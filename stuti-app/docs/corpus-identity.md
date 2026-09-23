# Corpus identity — step 1: id-keyed placement, the redirect map, the integrity gate

This is the first of two steps that put the fetched corpus on a footing that
does not break as it grows. It is a code-and-build change only: no corpus
`.txt` is touched, so it does not affect sourcing or the reader allow-list.
Step 2 (the presentation layer — explicit shelf / form / genre / sort fields,
a slim shardable index, see-also, search) is designed with the front-end
rework and is out of scope here. See `corpus-delivery.md` for the delivery
mechanism this builds on.

## The problem step 1 fixes

`place()` in `src/stuti-corpus.ts` joins a catalogue row to a library entry by
`shelf + normalised-title`. The normaliser (`normTitle` in `stuti-data.ts`)
drops everything after the first `(`, all digits, and the word "stotra". So
within one shelf, many distinct texts collapse to the same key, and `place()`
wires up only the **first** file at each key and silently drops the rest.

Measured against the current corpus (1,190 texts): **89 keys collide and 152
texts become unreachable.** Among them the whole Gurucaritam (26 parts all
normalise to `guru|gurucaritam` because the title cuts at `(Dvisāhasrī)`), every
recension set (six Durgā Stotrams → one, six Lakṣmī → one, …), every numbered
pair, and every Vedic-removed pūjā twin (each normalises the same as its Vedic
parent — directly undoing "keep both, never overwrite").

The root cause is that the app infers identity by parsing titles at runtime.
The fix is to key on the one thing that is already unique and does not need
parsing: the corpus `id`.

## The principle

The corpus `id` (`dattatreya/dvisahasri_gurucaritra/19`, `devi/durga/22`) is
**frozen identity**: unique, stable, never reused, never renumbered, never
reordered. The leading number carries no meaning and needs none — a key is an
address, not a fact. Everything a human cares about (order on the shelf,
grouping, the adhyāya sequence) is presentation, lives in separate explicit
fields, and is never derived from the id number. Step 1 makes the id the key
across every layer (source file → build → index → placement → reader state) and
guards that identity; step 2 builds the presentation fields on top.

Why identity must never move: a reader's saved state keys on the hymn id
(`stuti-favs`, `stuti-favs-week`, `stuti-watch`, `stuti-last`, `stuti-japa-last`,
the `stuti-pos-<id>` reading positions, `stuti-keep` refs), and the text file is
named `t/<id>.<hash>.json`. Change an id and the favourite dangles, the reading
position is lost, and a device holding the old file fetches a 404. So an id
change is never silent — it goes through the redirect map (below).

## Change A — id-keyed placement (`src/stuti-corpus.ts`, `place()`)

Rewrite the join so corpus rows can never collide with each other, and
title-match survives only as a one-time bridge to a pre-existing curated/seed
entry.

- Build the title-match map from the app's **pre-existing** hymns once, at the
  top of `place()`. Never fold a corpus-created hymn back into that map — that
  back-folding is exactly what made the second row at a key look "already
  listed" and get dropped.
- Keep two module-level sets for idempotency across the two placement passes
  (`applyCachedIndex` then `refreshIndex`): `placed` (corpus ids already given a
  tile) and `claimed` (pre-existing hymns already bridged). A row whose id is in
  `placed` only refreshes `corpusHash` on `byCorpusId[id]` and returns.
- Per row, per shelf in `r.deity`:
  - If an **unclaimed** pre-existing hymn matches by `(shelf, normTitle)`, claim
    it and attach `corpus` / `corpusHash`. Preserve the current rule exactly: a
    hymn that already carries inline verses keeps them and is not filled from the
    corpus (`if (have.verses.length) continue`), it only gains the link.
  - Otherwise create a new hymn. Its id is `d + "-" + slug(title)`; if that id is
    already taken in `byId`, disambiguate with a short suffix derived from the
    corpus id, so uniqueness holds even when two titles slug alike.
- When several corpus rows match one seed key, the row whose title has **no
  bracket and no trailing number** claims the seed (so "Durgā Stotram" fills the
  stub, not "Durgā Stotram (Yudhiṣṭhira-kṛtam)"); the rest become their own
  tiles. Absent such a row, first-in-file-order claims it.

`byCorpusId`, `fill()`, `corpusText()`, `useCorpusText()` are unchanged — they
already key on the unique id.

## Change B — the redirect map (retirement is the other half of the id-freeze)

Growth means texts are merged (the four bracket-merge candidates are already
queued) and occasionally refiled. Today a removed id just vanishes from the
index, so a device holding it 404s and any saved reference dangles. The
redirect map makes retirement explicit and migratable.

- **Source of truth:** a committed `stotras/corpus-redirects.json`, a list of
  `{ "from": "<retired-id>", "to": "<surviving-id-or-null>", "reason": "..." }`.
  `to: null` means the text was withdrawn with no successor. Hand-authored when
  a merge or refile happens; the build validates it (Change C).
- **Build:** `build_corpus.py` copies it to `corpus/redirects.json` beside
  `index.json`, after checking every `from` is absent from the current index and
  every non-null `to` is present.
- **Loader (`stuti-corpus.ts`):** fetch `redirects.json` alongside the index.
  On load, run a one-time migration over the reader-state keys that hold hymn
  ids — rewrite a retired id to its `to` (dropping it when `to` is null) in
  `stuti-favs`, `stuti-favs-week`, `stuti-watch`, `stuti-last`,
  `stuti-japa-last`, `stuti-keep`, and rename any `stuti-pos-<from>` to
  `stuti-pos-<to>`. Stamp a `stuti-corpus-redirects-applied` marker with the
  redirect-file hash so a given migration runs once per device. Also resolve a
  redirect when a fetch is requested for a retired id, so an in-flight open
  lands on the successor instead of a 404.
- Migration is additive and safe for today's beta devices: the corpus is off,
  so no corpus-created ids are in any device's state yet. The mechanism is built
  now so it is in place before the corpus goes live and before the first merge
  ships.

## Change C — the integrity gate (`build_corpus.py`, fail-loud)

The build already refuses to write while the reader-view audit reports a leak.
Extend that gate so an id can never quietly move and no row can ship unservable.

- **Id manifest:** a committed `stotras/corpus-ids.json` mapping `id → source
  path`. On every build, compare the freshly computed ids against it:
  - a **duplicate id** (two files resolve to one id — the parallel-sessions
    number-reuse risk) → hard fail, naming both files;
  - an id present in the manifest but **absent now** (a rename or renumber that
    would orphan reader state) → hard fail, unless the id appears as a `from` in
    `corpus-redirects.json` (an intentional, migrated retirement);
  - an id whose **source path changed** since the manifest → hard fail, unless
    covered by a redirect entry.
  A genuine refile is therefore possible, but only by adding an explicit
  redirect `from → to`; an accidental renumber can never slip through. New texts
  simply append; the gate confirms each took a fresh id. `--write-ids` updates
  the manifest after an intended change; a bare build only reads it.
- **Serve-ability:** after building, assert every index row's `file` exists in
  the output and its `hash` matches the row — a broken row leaves a reader on a
  spinner, so it must fail the build, not the device.
- **Redirect validity:** as in Change B — every `from` absent from the index,
  every non-null `to` present.

These run in the publish path so a bad corpus can never reach the host; keep the
previous published version for rollback.

## Verification

1. The Python join harness (written during the investigation) is the regression
   check: port the new `place()` logic into it and confirm **0 unreachable** and
   no unintended new duplicate tiles, against the full 1,190-text build.
2. Build the bundle, serve `dist` (the `stuti-built` launch entry), set the
   `stuti-corpus-url` browser key to the locally served corpus, and confirm in
   the browser that the Gurucaritam adhyāyas, both Puruṣa Sūktams, the recension
   sets, and both pūjā forms all appear and open.
3. A unit-level check of the redirect migration: seed a device's `stuti-favs`
   and a `stuti-pos-<id>` with a `from` id, load, confirm they move to `to`.
4. Changelog entry in the house voice.

## Not in step 1 (designed with the front end, step 2)

Explicit `shelf` / `form` / `genre` / `sort` header fields emitted into the
index; retiring the title/number/folder inference (`assignForm`, `typeOf`, the
`SHELF` folder map) as catalogue authority; a slim, shardable index with
`ETag`/`304` revalidation confirmed on the chosen host; `see-also` /
`variant-of` relationships; the search strategy for un-fetched texts; the
additive-only index schema version stamp; shrinking the bundled catalogue to a
small offline seed linked by explicit id.

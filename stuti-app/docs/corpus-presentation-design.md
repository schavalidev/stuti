# Step 2, part 2 — the design-side change-set (front-end half)

Part 1 (committed) made the build declare `genre`, `form`, `sakha`, `set`,
`sort`, `lang` and `first`, and the loader carry them onto each hymn. This is
the front-end half: the changes that make the library *use* them. These files
are design-authored (`design_handoff_stuti/app/*.jsx|*.js`, ported to
`stuti-app/src/`), so the changes land in the design and flow through the port.
Line numbers are the design files as they stand today.

**What this does NOT need to change, and why:** the genre/"type" lens already
reads `h.type` (`stuti-library.jsx` `TypeLens`/`TypeDetail`, `hymnsOfType`), and
`h.type` is now fed from the explicit `genre`. "All Sūktams / Kavacams /
Sahasranāmas" is already correct with no UI edit — the fragile guess simply
moved to the build. Deity-specific nitya pūjās already sit under their deity
because they carry that deity in `Shelves`. So only the pieces below are new.

House rules that bind every edit here (`design_handoff_stuti/CLAUDE.md`): no
italics anywhere; every language's string written as one whole sentence with a
`__` placeholder for any number, never assembled from fragments; colours from
the CSS tokens only; no `title` attribute (use `aria-label` and on-screen
words); the house calendar/date field where a date appears. New strings go in
`stuti-i18n.js` in all three UI languages.

---

## A. Shelf-less text must not break a row  — REQUIRED, do first

`stuti-library.jsx:19`, `HymnRow`: `const d = S.deityById[h.deity]` returns
`undefined` for a text with `deity: ""` (the generic Nitya Pūjā Vidhānam). The
row then throws when it reads the deity name/seal.

- Guard it: `const d = S.deityById[h.deity] || null;` and render the deity seal
  and the deity name in the meta line (`:44` region) only `when (d)`. When there
  is no deity, the meta line shows genre alone (and the language/śākhā chips from
  §D/§E).
- `stuti-reader.jsx` `DeityView` needs no guard — it lists `hymnsForDeity(id)`,
  which never returns a shelf-less text. Good.

Without §A a shelf-less text reaching a list row is a crash, so this ships even
if nothing else does.

---

## B. Order lists by `sort` (decouple display order from the id number)

Today ordering is only "curated before catalog" (`stuti-reader.jsx:349`
`g.rows.sort((a,b)=>(a.catalog?1:0)-(b.catalog?1:0))`), and the sections/rows
otherwise keep insertion order. Add `sort` as the primary key, falling back to
today's rule:

- `stuti-reader.jsx:349` — sort each group by
  `(a.sort ?? 1e9) - (b.sort ?? 1e9)` first, then the catalog tie-break, then
  title. This is what puts the Guru Caritra adhyāyas in 1→26 order regardless of
  their ids.
- `stuti-library.jsx` `TypeDetail` (`:238`) and the other lens lists — apply the
  same `sort`-first comparator before mapping to `HymnRow`.
- A tiny shared helper in `stuti-library-data.js` (`bySort(a,b)`) keeps the two
  call sites identical.

---

## C. Recension-set strip — "other recensions of this"

Data: hymns that share a non-empty `h.set`. Add to `stuti-library-data.js`
(beside `hymnsOfType`):

    const siblingsOf = (h) => !h || !h.set ? [] : S.hymns.filter(x => x.set === h.set && x.id !== h.id);

Render a strip of these siblings:
- **Primary — on the deity index** (`stuti-reader.jsx` `DeityView`, in `entry(h)`
  around `:406`): under a text that belongs to a set, a small "other recensions"
  row of its siblings, each a tap that opens that sibling
  (`go("reader",{hymn: sib.id, deity: sib.deity, ...})`). Label from i18n
  (`otherRecensions`), never a `title` tooltip.
- Keep the siblings as their own separate rows too (they already are, since each
  is its own tile) — the strip is a cross-link, not a replacement. This is the
  "not scattered" payoff without hiding any text.
- `set` values are authored (see §F seeding); until a file carries `set`,
  `siblingsOf` returns `[]` and no strip shows — safe with nothing seeded.

---

## D. Śākhā, only within sandhyāvandanam

The four sandhyāvandanam recensions are `vidhi/<śākhā>/…` files; part 1 gives
each a `h.sakha` (`taittiriya|kanva|madhyandina|rigveda`). They surface today on
the Itara shelf. Group and label them by śākhā where they are listed:

- Add `stuti-library-data.js` `SAKHA_LABELS` — the four names in deva/tel/roman
  (Taittirīya / Kāṇva / Mādhyandina / Ṛgveda), as whole words per language.
- In the view that lists these texts (the sandhyāvandanam collection, or the
  Itara shelf section that holds them), when rows carry `h.sakha`, group under a
  śākhā sub-heading using `SAKHA_LABELS`, and add a small śākhā chip on the row
  via `HymnRow` (`stuti-library.jsx:34` region, beside the genre span).
- Scope guard: the chip/grouping shows **only** when `h.sakha` is set, so it
  never appears on ordinary stotra. Not a top-level lens (your steer).

---

## E. Text-language tag + filter (Awadhi / Hindi / Braj / Tamil)

`h.lang` is now carried (`sa|hi|awa|bra|ta|te`). This is distinct from the
transliteration-script picker (`stuti-lang`: deva/roman/telugu) and must not be
confused with it.

- Add `stuti-i18n.js` `LANG_NAMES` — the language names in the three UI
  languages (Sanskrit, Hindi, Awadhi, Braj, Tamil, Telugu).
- **Tag:** in `HymnRow` (`stuti-library.jsx:34` region) and in the `DeityView`
  entry, show a language chip **only when `h.lang` is not `sa`** — Sanskrit is
  the unmarked default, so a chip on every stotra would be noise. Reads
  "Awadhi", "Hindi", … from `LANG_NAMES`.
- **Filter:** where a list holds texts in more than one language (a deity/genre
  view that mixes, e.g. Rāma with both Sanskrit and Awadhi texts), a small
  language filter (all / each present language), built from the distinct
  `h.lang` present in that list. Not shown when only one language is present.
- The reader itself is unchanged: a text is shown in the language it was written
  in (its verse fields), never toggled across languages.

---

## F. New strings (`stuti-i18n.js`)

All in the three UI languages, whole sentences, no italics, no fragments:
`otherRecensions` ("Other recensions"), `SAKHA_LABELS` (four śākhā names),
`LANG_NAMES` (six language names), and a `languageFilterAll` ("All languages").

---

## G. Authoring the fields the UI now reads

The UI above is inert until the corpus carries the fields. Only three are
authored by hand (the rest are derived in part 1):

- **`sakha`** — already derived from the folder for `vidhi/`; nothing to author.
- **`set`** — added to the sibling files of a recension set. Start with the four
  step-1 merge candidates and the obvious sets (the six Durgā stotras, the two
  Cālīsās, the Kāmākṣī/Mātaṅgī groups). A `Set: durga-stotram` header line on
  each sibling. Small, targeted — not a mass edit.
- **`sort`** — added where order matters and the id number does not encode it:
  the Guru Caritra adhyāyas, the Bhagavad Gītā adhyāyas, the Nārāyaṇīyam daśakas.
  A `Sort: 19` header line.
- **`Genre:`** override — only where the title-derived genre is wrong.

Each is an additive header line, one file at a time, respecting the corpus rule
against rewriting another session's verse text. The build validates genre/śākhā
and fails loud (part 1).

---

## Verification

Build the corpus and app, serve both, set `stuti-corpus-url`, and confirm in the
browser: a shelf-less vidhānam appears in the genre lens and opens (no crash); a
set shows its "other recensions" strip; sandhyāvandanam groups by śākhā with the
right labels; a non-Sanskrit text shows its language chip and the language filter
appears only where languages mix; `sort` orders the Guru Caritra 1→26.

## Landing these in the design

These edit design-owned files. Two routes: (1) apply them into
`design_handoff_stuti/app/`, run `tools/codemod/run-all.sh` + `npm run build`,
verify, and let the next design pull three-way merge them (they are additive, so
they merge cleanly unless the designer touched the same rows); or (2) hand this
brief to the designer to apply in the Claude Design "Stuti" project. Recommended:
route (1) for §A and §B (small, safe, and §A is a latent crash), and decide on
§C–§E together since they add visible UI the designer may want to place herself.

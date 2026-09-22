# Corpus delivery — adding texts after the app is live

A sketch, 22 September 2026. Nothing here is built yet.

## The problem

The reader's texts are compiled into the app: twenty-nine `src/stuti-text-*.ts`
modules, 1.8 MB, bundled into a couple of JS chunks that the service worker
precaches. The corpus in `stotras/` is 1,099 files and growing every day.
Bundling means every new text is a deploy and an APK, and every deploy makes
every device fetch the whole app again — the bandwidth that took the Netlify
allowance to 75%.

## The shape

The corpus becomes data the app fetches, in three parts.

**1. A build.** `stotras/bin/build_corpus.py` reads every `stotras/**/*.txt`
through `reader_view.reader()` — the allow-list already written, so a source
note can never reach the reader — and writes:

```
corpus/
  index.json                     the catalogue, one row per text
  t/<id>.<hash>.json             one file per text, immutable
```

It refuses to write if `reader_view.py --audit` reports a leak.

**2. A host.** A static bucket with free egress, separate from the app —
Cloudflare R2 (public bucket, custom domain `corpus.stuti.app`) is the plain
choice; a second Netlify site works too but bandwidth is what we are
rationing. `t/*.json` are hashed, so `Cache-Control: immutable, max-age=1y`.
`index.json` is `no-cache`, revalidated by ETag. CORS allows the app's
origins and `capacitor://localhost`.

**3. A loader in the app.** A new hand-written module, `src/stuti-corpus.ts`,
wrapping the generated pool the way `stuti-count-sink.ts` wraps the counter.
Never an edit to `stuti-data.ts` or `stuti-texts.ts`.

## index.json

```json
{
  "v": 1,
  "built": "2026-09-22T09:14:00Z",
  "texts": [
    {
      "id": "vishnu/narayaniyam/007",
      "deity": ["vishnu"],
      "title": "Nārāyaṇīyam — Daśaka 7: the arising of Hiraṇyagarbha",
      "deva": "श्रीनारायणीयम् – सप्तमदशकम्",
      "tel": "శ్రీనారాయణీయమ్ – సప్తమదశకమ్",
      "author": "Melputtūr Nārāyaṇa Bhaṭṭatiri",
      "lang": "sa",
      "type": "stotra",
      "units": 10,
      "sections": [{ "roman": "Daśaka 7", "tel": "దశకం 7" }],
      "hash": "b4f1e9c2",
      "bytes": 18420,
      "file": "t/vishnu.narayaniyam.007.b4f1e9c2.json",
      "published": "2026-09-22"
    }
  ]
}
```

- `id` is the corpus path without number padding or extension — stable across
  a rename of the file's descriptive tail, which happens.
- `deity` is the top-level folder, mapped by a small table in the build to the
  app's shelf ids (`Subrahmanya` → `subrahmanya`, `misc_vedic`/`veda` →
  `itara` or a Veda shelf once the design has one, `puja`/`vidhi` → the vidhi
  reader). A file may carry a second shelf through a `Shelves:` header field
  the build reads and the reader never sees.
- `lang` comes from the `Language:` header, first word: `sa`, `hi`, `awa`,
  `bra`, `ta`. The reader's language selector needs this (see the
  Hindi/Awadhi memory).
- `type` is `stotra`, `vidhi`, `sarga`, `names`, from the `Type:` header's
  first word, `stotra` when absent.
- `published` is a date, not a boolean: a file with `Published:` unset in its
  header is built to `t/` but not listed, so parallel sessions can keep
  writing while only audited texts are visible. The build prints what it
  withheld.
- Nothing about sources, witnesses or corrections is in this file. `--audit`
  runs against the built index too, with the same regexp.

Estimated size: 1,100 rows × ~400 bytes ≈ 450 KB, 80 KB gzipped. Fine for a
launch fetch; if it doubles, split per deity (`index/<deity>.json`) behind a
20 KB `index.json` of counts and hashes.

## t/<id>.<hash>.json

The reader's view of one file, already in the pool's verse shape:

```json
{
  "id": "vishnu/narayaniyam/007",
  "hash": "b4f1e9c2",
  "title": "...", "deva": "...", "tel": "...", "author": "...", "blurb": "...",
  "sections": [{ "roman": "...", "tel": "..." }],
  "verses": [
    { "s": 0, "n": "1", "deva": "...", "iast": "...", "en": "...", "tel": "...", "hi": "..." },
    { "s": 0, "n": null, "vidhi": "...", "deva": "..." }
  ]
}
```

`verse none` becomes `"n": null`; `vidhi:` and `variant:` pass through as
fields. Sections come from the `| section:` tag on each unit head, numbered
in order of first appearance. The hash is over this JSON, not the source
file, so a header-only edit that changes nothing the reader sees does not
invalidate the cache.

## The loader

```ts
// src/stuti-corpus.ts — hand-written, not generated
import { STUTI } from "./stuti-data";
import { STUTI_CORPUS_URL } from "./stuti-cloud-config";   // "" = off

export const Corpus = {
  async index(): Promise<IndexRow[]>,   // ETag-revalidated; IndexedDB copy served first
  async text(id: string): Promise<Text>, // IndexedDB → network; stored on first read
  async keep(deity: string): Promise<void>, // "download all of Viṣṇu", optional
  has(id: string): boolean,              // in IndexedDB, for the offline mark
};
```

On start:

1. Serve the IndexedDB index at once; fetch `index.json` in the background and
   swap when the ETag changes. First run with nothing stored and no network is
   the bundled seed only.
2. For each row, push a hymn into `STUTI.hymns` with `catalog: true` and
   `verses: []` — exactly what the STOTRA_INDEX rows already do — plus
   `corpus: row.id`. Skip a row whose `deity|normTitle` a curated hymn already
   holds (the same join `stuti-texts.ts` uses), so the bundled seed keeps
   winning and nothing shows twice.
3. When the reader opens a hymn with `corpus` set and no verses, `Corpus.text()`
   fills `h.verses`, `h.sections`, `h.blurb` and clears `catalog`, then the
   binding that `stuti-texts.ts` does at load runs for this one hymn —
   ritual sections, the `STUTI_RITUAL` cache. Factor that block into an
   exported `bindText(h, t)` through a codemod step (`fix-corpus-seam.mjs`)
   so the same code serves both paths and the port fails loud if the anchor
   moves.
4. The reader shows a one-line "fetching" state and, offline with nothing
   stored, the existing "text coming soon" state. Nothing else in the reader
   changes.

Storage: IndexedDB, one store keyed by `id`, value the text JSON, plus the
hash. A text whose hash in the new index differs from the stored one is
refetched on next open, not eagerly. The service worker does not cache
`corpus.stuti.app` at all; IndexedDB is the cache, and it survives a deploy.

The seed: the twenty-nine bundled modules stay as they are. Once the corpus
host has run for a while, the build can drop them from the bundle and mark the
same ids as `seed: true` in the index, which the loader fetches on first launch
and the APK ships in `public/corpus/`. That is a later step; the loader
should not depend on it.

## Publishing a text, once this exists

```
python3 stotras/bin/build_corpus.py          # audits, builds corpus/ locally
rclone sync corpus/ r2:stuti-corpus --immutable   # t/ first, index.json last
```

No app deploy, no APK, no Play review. The upload order matters: a device
that fetches the new index before a new `t/` file exists would fail on open,
so `t/` goes up first and `index.json` last, and the loader falls back to
"coming soon" on a 404 rather than an error.

## Order of work

1. `build_corpus.py` with the deity map and the audit gate — can be written
   and run now, against `stotras/`, without the app.
2. R2 bucket, custom domain, CORS, the sync command in `tools/`.
3. `stuti-corpus.ts` and `fix-corpus-seam.mjs`; `STUTI_CORPUS_URL` in the
   cloud config, empty by default so the app is unchanged until set.
4. Verify in the built bundle, on the phone, offline after one read.
5. Later: seed in `public/corpus/`, drop the bundled modules, per-deity keep.

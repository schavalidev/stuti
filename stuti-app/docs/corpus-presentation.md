# Corpus presentation — step 2: explicit structure, the lenses, the index shape

Step 1 (`corpus-identity.md`) made the corpus id the frozen key. Step 2 stops
the app guessing a text's shelf, genre and form from its title, and has it read
those from explicit fields the build writes down. It is the front-end half of
the corpus work, designed against the app as it stands today.

The decisions marked **(default)** are the ones I have chosen for us; each says
what it does so you can override it. The genuinely open ones are gathered under
"Your call" at the end — please read only that section if the rest is too much.

## The principle

The app already renders the library through a **lens switcher** (`LibraryHub`,
`stuti-library.tsx:514`): the lenses are `deity, type, masa, vrata, festival,
nomu, parayana`. It also groups a deity's texts by **form** (`FormSelector`,
`stuti-reader.tsx:312`) and by **type/genre** (`TypeLens`, `stuti-library.tsx:212`).
All three today are computed from the title at build time — `typeOf()` and
`assignForm()` (`stuti-data.ts`) and the folder→shelf map (`build_corpus.py`).
That guessing is the same fragility step 1 removed from placement.

Step 2 replaces each guess with a declared field. The title regexes stay, but
only as the seed default for the ~24 bundled texts — never as authority for a
corpus text.

## The header fields (what the build emits into each index row)

Written in the file header, carried by `build_corpus.py` into the index row,
read by the loader (`place()` in `stuti-corpus.ts`) onto the hymn object.

- **`Shelves:`** — which deity/shelf grids the text stands on. Already exists as
  a header line; step 2 makes it authority and **allows it to be empty**. A text
  with no shelf is valid: it makes no tile on any deity page and lives only in
  the cross-cutting views (genre, practices). This is how the generic Nitya Pūjā
  Vidhānam is filed — deity blank, everything else populated, its देव/देवि a
  placeholder, not a fixed god. A deity-specific pūjā (Gaṇapati Nitya Pūjā) keeps
  its deity in `Shelves` and does sit under that deity.
- **`genre`** — replaces `typeOf(title)`. Drives the type badge and the `type`
  lens. Drawn from the existing genre vocabulary (`TYPE_ORDER` / `TYPE_LABELS`,
  `stuti-library-data.ts`), extended where the corpus needs a value it lacks; the
  build validates a genre against that controlled list and fails loud on an
  unknown one.
- **`form`** — replaces `assignForm(title)`. The aspect within a deity that the
  `FormSelector` filters by. Validated against that deity's `FORMS`
  (`stuti-data.ts:243`). Blank for a shelf-less text.
- **`sakha`** — the Vedic recension (Taittirīya / Kāṇva / Mādhyandina / Ṛgveda).
  Surfaced **only within sandhyāvandanam**, to group its four recensions; not a
  top-level lens. Left blank on everything else (later also useful to filter
  Vedic texts to a reciter's own śākhā, out of scope here).
- **`set`** — a shared id linking recensions and siblings (the six Durgā stotras,
  both Cālīsās). Any texts carrying the same `set` value are siblings. Drives a
  "other recensions of this" strip on the reader/deity page, and lets a set read
  as one group rather than scattered rows.
- **`sort`** — an integer giving display order within a group, **decoupled from
  the id number**. The id's number is identity only; order is declared here, so
  the Gurucaritam adhyāyas read 1→26 whatever their ids are.
- **`lang`** — already emitted. Step 2 surfaces it as a **text-language label and
  filter**, distinct from the transliteration-script picker (deva/roman/telugu).
  A text is in the language its author wrote it in — Sanskrit, Awadhi, Hindi,
  Braj or Tamil — and is never toggled across languages. 31 non-Sanskrit files in
  four languages.
- **`first`** — the opening line (deva + iast), for first-line search and a list
  preview, so search and the row work without fetching the text.

## The index shape

- **Slim the rows (default).** Today each row carries its full `sections` inline,
  which is why `index.json` is ~1 MB. The list needs only: `id`, the title
  triplet (`title`/`deva`/`tel`), `deity` (may be empty), `genre`, `form`,
  `sakha`, `set`, `sort`, `lang`, `first`, `hash`, `bytes`, `file`. Sections stay
  in the per-text file, where they already live. This shrinks the index sharply.
- **`schema` version stamp + additive-only rule (default).** The index carries a
  schema version; fields are only ever added, never repurposed, so an old APK
  reads a newer index safely.
- **Shard boundary designed, single file for now (default).** Keep one
  `index.json`, but define the shard shape (a small top index plus per-shelf
  lists) so sharding is a pure format change the day size demands it. Confirm the
  chosen host returns `ETag`/`304` so the launch fetch is cheap when unchanged.

## The front-end changes (mapped to today's components)

- **`type` lens** (`TypeLens`/`TypeDetail`, `STUTI_LIB.typeList`) reads the
  explicit `genre` instead of `typeOf`. Near-zero change, big correctness gain —
  "all Sūktams / Kavacams / Sahasranāmas" becomes right.
- **`FormSelector`** (`formsForDeity`, `stuti-reader.tsx:350`) reads the explicit
  `form`; `assignForm` becomes the seed-only fallback.
- **`DeityLens`** (`stuti-library.tsx:59`) unchanged in shape, but a shelf-less
  text simply never appears there — no `itara` catch-all forced onto it.
- **Recension sets:** a "other recensions" strip on `DeityView` / `ReaderView`
  built from the `set` field (siblings via `STUTI_LIB`).
- **Sandhyāvandanam:** within its existing practice entry (`STUTI_LIB.practices`
  `sandhya-vandanam`), group by `sakha`.
- **Ordering:** lists order by `sort` (ties broken by id), replacing today's
  "curated before catalog" as the only rule.
- **Text-language:** a language tag on a row when `lang` is not Sanskrit, and a
  language filter where such texts cluster. This is a new, small UI, separate
  from the script picker. **(exact placement — see Your call.)**

## Seeding the ~1,190 headers

- **One script seeds all guessable fields (default).** A tool writes `Shelves`
  (from the folder map), `genre` (from `typeOf`) and `form` (from `assignForm`)
  into every file header in one pass — i.e. exactly what the app infers today, so
  seeding cannot make anything worse than the current state. Then, by hand: fix
  the wrong guesses, add `sakha` and `set` where they apply, blank the deity on
  the generic vidhānam, and set `sort` where order matters. `build_corpus.py`
  validates genre/form/sakha against their controlled lists and fails loud.

## Verification

- Build the index; assert every row's `genre`/`form`/`sakha` is in its
  controlled list, every `set` has ≥2 members, and a shelf-less text is reachable
  through the genre lens (a small harness, like step 1's).
- Serve `dist` + the corpus, and confirm in the browser: the genre lens counts
  are right; a deity's forms come from the declared `form`; a recension set shows
  its siblings; sandhyāvandanam groups by śākhā; the generic vidhānam appears in
  the genre/practices views and on no deity page; a non-Sanskrit text shows its
  language label.
- Changelog entry in the house voice.

## Your call (defaults chosen, override any)

1. **Text-language UI placement.** A per-row language tag plus a filter — where?
   My default: the tag shows on any non-Sanskrit row, and a language filter
   appears within a shelf/genre view when it holds texts in more than one
   language. Alternative: a dedicated language lens. (31 files, four languages.)
2. **Genre vocabulary.** Default: reuse the app's existing type list, extending it
   only where the corpus has no matching value. If you want a different genre set
   for the library, name it.
3. Anything above marked **(default)** that you would rather decide differently —
   especially slim-now-shard-later, and the one-script seed.

## Not in step 2 (follow-ups)

Implementing the shard split; a prebuilt full-text search index (you chose
title/first-line only); the runtime देव/देवि substitution that would let the
generic vidhānam be performed for a named deity; per-deity bulk download; the
corpus host decision itself (still open — `STUTI_CORPUS_URL` blank).

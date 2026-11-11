# The design pull of 11 November 2026 — what came in, and what is still to decide

The designer's project is now an Artifact
(`https://claude.ai/artifact/PSswH593YiwAFce1CYSrej`) rather than a folder she
hands over. It was read file by file with the Artifact tool, so the broken
`claude-design` connector no longer stands in the way of a design pull.

The dump as she sent it is committed on the branch `design-pull-nov` as
**"The design dump of 11 November, as she sent it"**. Nothing of it is lost,
whatever is decided below. The build that is live on the web and published as
`Stuti-v56.apk` is tagged **`verified-0.9.114`**.

## The thing to understand first

Her project is not ahead of our design folder. It is a **fork of it**, taken
before about six weeks of our own work, and that work was written straight into
`design_handoff_stuti/app/` in this repo — it never reached her Claude Design
project. So of her 55 edited files, most would not update ours; they would
**revert** ours.

Three examples, all found by comparing her copy against ours:

- **The Vedic accents.** Her reader has no `svaraSplit`, no `hasSvara`, and her
  stylesheet has no `.rd-vedic` rules. Taking her reader would have set every
  accented sūkta back in a face that detaches the svara marks, and dropped the
  cluster reordering that stops a visarga drawing a dotted ring.
- **The At-a-temple card.** Her `stuti-home.jsx` does not contain
  `AtTempleCard` at all.
- **Seventy interface strings.** Her `stuti-i18n.js` is missing the temple and
  tīrtha strings, the blind mālā, the face-down hold, and the śākhā and
  text-language names — which is to say the strings the reader
  text-language selector and the compass work are written against.

A mechanical three-way merge cannot see this, because the base it would merge
from already contains our edits: her dropping them looks like a deliberate
deletion rather than a copy that never had them.

## What was taken, and is built and checked

Only the part of her dump that **adds** and removes nothing of ours:

- **Mokkulu** — a standing list of promises made to a deity, with the store,
  the tracker, the builder sheet, its thirty interface strings, and its lens on
  Nitya.
- **The ābdikam week** — the arrangements a house makes before a śrāddha, kept
  per occurrence so each year starts unchecked, and the śrāddha notice in
  `stuti-nudge.js` that names the ones still unmade.
- **The Back-button stack** (`stuti-backstop.js`) — the store only; see below.
- **The parva stories and the kriyā-mantras** — the two indexes, the 22 month
  chunks, and her `stuti-vrata.jsx`, which is the screen that shows them and
  which removes nothing of ours.
- **`index.html`** — the website's new home page, which `Stuti - Website.html`
  now only redirects to.
- The script tags and boot-list entries both entry points need to load them.

Two pieces of plumbing were written for this, because the chunks are fetched by
a computed path that no existing check could see:

- `tools/codemod/copy-parva-chunks.mjs` copies the 22 month files into
  `public/` and refuses to pass if the index names a month that is not there.
  Without it the build answers the loader with `index.html`, the script fails
  to parse, and the day simply shows no story — with nobody told.
- `vite.config.ts` keeps those files out of the precache and caches them when
  they are asked for, as the gazetteer already is. They are about 280 KB and a
  sitting opens one of them at most.

Verified in the built bundle: it loads with no console errors, the gate and the
onboarding notice render, the app opens on Today, and `/parva-kriya/kartika.js`
is served as JavaScript rather than as the app's own page.

## What is still to decide — one question

**Her 51 edited files are a fork, not an update.** Each one needs a ruling
before any of it comes in. They fall into three kinds:

1. **The bundled texts** — `stuti-text-*.js`, sixteen files. Her copies are our
   own generated text from before the hyphenation: each shows the same number
   of lines removed as added. Taking them would undo
   "The Devanāgarī breaks its compounds where the IAST already did".
   **Nothing to decide: ours are newer.**
2. **The data and engines** — `stuti-vrata-data.js` (−148), `stuti-ephemeris.js`
   (−40), `stuti-panchanga-engine.js` (−29), `stuti-ekadashi-data.js`,
   `stuti-data.js`, `stuti-festive.js`, `stuti-library-data.js`. Ours carry the
   VSOP87 sun, the true Lahiri ayanāṁśa, the named ekādaśīs and the four filled
   vrata guides. **Ours are almost certainly newer; worth one look each.**
3. **The screens and the strings** — `stuti-reader.jsx` (−93), `stuti-home.jsx`
   (−79), `stuti-i18n.js` (−90), `stuti-main.jsx` (−22), `stuti-calendar.jsx`
   (−21), `stuti-components.css` (−118), `stuti-code.css` (−50), and the rest.
   **This is the real question**: her six weeks of design against our six weeks
   of building, in the same files.

The honest way through is not a merge. It is to send her our design folder so
her project and ours are the same again, and take her next dump cleanly. Until
that happens every pull will cost what this one cost.

## Two consequences of taking only the additive part

- **The Back button stack is inert.** `STUTI_BACKSTOP` exists, but the two
  files that register closers with it (`stuti-main.jsx`, `stuti-reader.jsx`)
  are in the fork, so nothing pushes to it yet. Harmless, and does nothing.
- **The parva text shows for a minority of days.** Her indexes are keyed
  against her `stuti-vrata-data.js`: of her 23 kriyā days only 5 exist in our
  vrata data, and of her 54 story days only 18. The rest are present on disk
  and reachable, and will appear as soon as the ids agree.
- **The ābdikam card has no home.** The store and the notice are in;
  `stuti-home.jsx` is the screen that shows the week's arrangements, and it is
  in the fork.

## Where things stand

- `main` is untouched. The web and `Stuti-v56.apk` are exactly as they were.
- The work above is on `design-pull-nov`, built and checked.
- `stuti-native.js` and `stuti-follow.jsx` were not taken from her dump at all:
  they are written back to her project by the mirror, and her copies are behind
  ours. The mirror still owes her an upload.
- Her build stamp is 0.9.131 · 2026.11.03. Ours stays 0.9.114 until the
  changelog has a section to match it.

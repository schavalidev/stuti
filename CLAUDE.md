# Akshara / Stuti — project notes (copy of the design project's CLAUDE.md)

## Working rules
- **Update `Changelog.html` at the end of every run.** Add to the current version's section, or open a new one when the work starts a new arc. Follow the house voice: name the cause, not the symptom; entries are prose, not bullet dumps of file names.
- **End every run with a handoff summary** — a short block the user can paste into a new chat: what changed, what's pending, and any context a fresh session would otherwise have to rediscover.

## Design preferences
- **No italics, ever.** Always use regular (upright) font. This applies to IAST/transliteration, glosses, captions, notes — everything. Do not use `font-style: italic` or `fontStyle: "italic"`.

## The port (`stuti-app/`)
- `stuti-app/src/` is generated from `design_handoff_stuti/app/` by `stuti-app/tools/codemod/run-all.sh`. **Never hand-edit a generated file to add backend or sync logic** — a re-port overwrites it. Wrap the generated stores from new modules instead. Fixes to the *port itself* belong in the codemod scripts (the `fix-*.mjs` steps), which fail loud on an unexpected anchor rather than silently skipping.
- After a design update: pull, run the pipeline, `npm run build`, `npx cap sync android`, then Gradle (see `README.md`). Android toolchain via `source stuti-app/tools/android-env.sh`.
- The keystore and `android/keystore.properties` are gitignored; don't commit or paste them anywhere.
- The changelog to update is `design_handoff_stuti/docs/Changelog.html`.

## Typography
- **All font choices go through the CSS tokens** (`--font-ui`, `--font-display`, `--font-deva`, `--font-telugu`, `--font-deva-serif`, `--font-telugu-serif` in `stuti.css`). Never hard-code a family name in a rule or a JSX `style={{ fontFamily }}`.
- **Known inline-family exceptions:** `stuti-sky.jsx` (sandhyā plate title + till, greeting), `stuti-flow.jsx` end-marks.
- **Alias trap:** `'Surasans02 Regular'` is one Regular.ttf registered across weight 300–700. For a real bold, use the `'Surasans02'` family. Nothing heavier than 700 exists in any project font.

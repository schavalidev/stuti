# Akshara / Stuti — project notes (copy of the design project's CLAUDE.md)

## Working rules
- **Every change ships three ways, every time:** commit + push to `origin main`, deploy the web build to Netlify (`netlify deploy --prod --build --site 3f9cdccf-4d91-463c-ae77-7fa0489e48d9` from the repo root), and when native code, assets, or the manifest changed, rebuild the APK into `builds/`. Don't skip Netlify because a change "only affects native" — the user asked for it unconditionally.
- **Update `Changelog.html` at the end of every run.** Add to the current version's section, or open a new one when the work starts a new arc. Follow the house voice: name the cause, not the symptom; entries are prose, not bullet dumps of file names.
- **End every run with a handoff summary** — a short block the user can paste into a new chat: what changed, what's pending, and any context a fresh session would otherwise have to rediscover.

## Design preferences
- **No italics, ever.** Always use regular (upright) font. This applies to IAST/transliteration, glosses, captions, notes — everything. Do not use `font-style: italic` or `fontStyle: "italic"`.

## The port (`stuti-app/`)
- `stuti-app/src/` is generated from `design_handoff_stuti/app/` by `stuti-app/tools/codemod/run-all.sh`. **Never hand-edit a generated file to add backend or sync logic** — a re-port overwrites it. Wrap the generated stores from new modules instead. Fixes to the *port itself* belong in the codemod scripts (the `fix-*.mjs` steps), which fail loud on an unexpected anchor rather than silently skipping.
- After a design update: pull, run the pipeline, `npm run build`, `npx cap sync android`, then Gradle (see `README.md`). Android toolchain via `source stuti-app/tools/android-env.sh`.
- The keystore and `android/keystore.properties` are gitignored; don't commit or paste them anywhere.
- The changelog to update is `design_handoff_stuti/docs/Changelog.html`.

## Typography — how to avoid font-detective sessions
- **All font choices go through the CSS tokens** (`--font-ui`, `--font-display`, `--font-deva`, `--font-telugu`, `--font-deva-serif`, `--font-telugu-serif` in `stuti.css`). Never hard-code a family name in a rule or a JSX `style={{ fontFamily }}`.
- **Known inline-family exceptions** (they beat every stylesheet rule — check these FIRST when a font "won't change"): `stuti-sky.jsx` (sandhyā plate title + till, greeting), `home-redesign.jsx`/`stuti-flow.jsx` end-marks. If more are added, list them here.
- **Alias trap:** `'Surasans02 Regular'` is one Regular.ttf registered across weight 300–700 — every weight renders as Regular. For a real bold, use the `'Surasans02'` family (has true faces at 300/400/500/700). Nothing heavier than 700 exists in any project font.
- **When diagnosing, don't guess from CSS** — probe the live element's `getComputedStyle(el).fontFamily/fontWeight` plus `document.fonts.check()` in one shot; inline styles and `:is()` specificity make source-reading unreliable.

## Design updates
- **The designer's Claude Design project root is the only design source** (agreed 8 Sep 2026). She hands over the whole project folder; her own `design_handoff_stuti/app/` copy is being deleted from her project so it can never be mistaken for the source again, while her `docs/` stay. Assemble this repo's `design_handoff_stuti/app/` from the root working files that `Stuti.html` loads (see the 8 Sep 2026 port in the changelog), then run the pipeline.
- The beta latch grandfathers any device that finished onboarding before the gate existed (`main.tsx`); keep that. New devices, reinstalls and cleared browsers see the gate, which always shows the support address.
- The beta latch (`stuti-gate.jsx`) asks for the passcode in `stuti-build.js` (`STUTI_BUILD.GATE`) once per device; set it to null for a public build.

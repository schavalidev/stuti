# Handoff: Stuti (स्तुति) — from design prototype to production app

## What this is

Stuti is a devotional companion app for Hindu households: a corpus of stotras and sahasranāmas in Devanāgarī, Telugu and Roman (IAST) script; a reader with per-verse meanings; a pañcāṅga (Hindu almanac) computed on-device; japa counting, recitation plans, vrata/nomu observance trackers; and a "practice ledger" of what the household has done. Interface language switches between English, Hindi and Telugu.

Everything in `app/` is a **working, high-fidelity prototype** built in HTML + React 18 + JSX, with no build step. It runs today by opening `app/Stuti.html` from any static host. It is the design of record: layout, colours, type, copy, motion, and behaviour are all final unless a doc says otherwise. Your job is to turn it into a production codebase, **not** to redesign it.

`docs/` holds the operational documents written alongside the design: the changelog (house voice and history of every decision), the launch tracker (what is real vs. stubbed), the pending list, the 4-week guide and daily plan, and data-format specs. Read `docs/Launch Tracker.html` before writing code — it lists every place the prototype pretends.

## Fidelity

**High-fidelity.** Recreate pixel-for-pixel. Do not substitute components, fonts, radii, colours or copy. Where a token exists in `stuti.css`, use it; never hard-code a family or hex.

## How the prototype is built (read before choosing a stack)

- **`app/Stuti.html`** is the phone entry point (`Stuti-Tablet-Desktop.html` is the wide layout, sharing every module and adding `stuti-wide-main.jsx` + `stuti-wide.css`). `Stuti - Website.html` is the one-page marketing site.
- **Load order matters.** Plain `.js` modules load first as `<script>` tags and attach globals to `window` (`window.STUTI`, `STUTI_FAVS`, `STUTI_LOC`, `AKSHARA_PANCHANGA`, …). Then `stuti-boot.js` transpiles and injects the `.jsx` files in the exact order listed in `Stuti.html`. Each JSX file ends with `Object.assign(window, {...})` exporting its components. Later files depend on earlier ones. **Preserve that order when converting to ES modules.**
- **Three layers:**
  1. **Data** — `stuti-data.js` (deities, hymn registry), `stuti-text-*.js` (verse text per deity, Devanāgarī + IAST + meanings), `stuti-hindi-*.js` (Hindi meanings), `stuti-names-*.js` (sahasranāma name lists), `stuti-*-data.js` (vrata, nomu, parāyaṇa, māsa, saṅkrānti, saṅkalpa, library shelves), `stotra-index-data.js`, `telugu-meanings.js`, `vsn-stotram.js`. ~1.7 MB of text. Format specs in `docs/sahasranama-format.md` and `docs/nomu-data-spec.md`.
  2. **Engines (pure JS, no React)** — `stuti-ephemeris.js` + `stuti-panchanga-engine.js` (sun/moon positions → tithi, nakṣatra, yoga, karaṇa, sunrise/sunset), `stuti-muhurta.js`, `stuti-sandhya.js`, `stuti-desa.js` (place → region/river clauses for saṅkalpa), `stuti-reckoning.js`, `stuti-translit.js` (Devanāgarī → Telugu), `stuti-lexicon.js`, `stuti-recite.js`, `stuti-i18n.js` (`STUTI_L` — all UI strings in three languages), `stuti-festive.js`, `stuti-cues.js`, `stuti-nudge.js`.
  3. **Stores + UI** — `stuti-store.js`, `stuti-sadhana.js`, `stuti-watch.js`, `stuti-keep.js`, `stuti-ledger.js`, `stuti-flyleaf.js`, `stuti-prefs.js`, `stuti-auth.js`, `stuti-dana.js`, `stuti-limits.js`, `stuti-push.js` are tiny observable stores (`list/add/toggle/subscribe`) persisting to `localStorage`. The `.jsx` files are the screens.
- **Styling:** `stuti.css` (tokens, themes day/night, type scale), `stuti-components.css`, `stuti-palette.css`, `stuti-pigment.css` (per-deity accent hues), `stuti-wide.css`. Fonts in `app/fonts/` (self-hosted: StutiSans, SangamSans, Surasans02/03, KanakaDurga, Suravaram) plus Google-hosted Noto Sans/Serif, Noto Sans Devanagari/Telugu, Mallanna. **Never use italics anywhere** — house rule.
- **Offline:** `stuti-sw.js` service worker, network-first for own files, cache-first for pinned CDN. Registered from `stuti-main.jsx`.
- **Build stamp:** `stuti-build.js` — `VERSION`/`BUILD`/`CHANNEL` shown in settings and prepended to feedback.

## Recommended target

Vite + React 18 + TypeScript, PWA plugin (replaces `stuti-sw.js`), Supabase (or Firebase) for the back end. Keep the prototype's file names as module names for the first pass so the changelog and docs stay navigable. Data files can be imported as-is (they are plain object literals wrapped in IIFEs — unwrap to `export default`).

## Phase plan

**Phase 0 — Lift (1 week).** Get the prototype running unchanged inside the new repo (copy `app/` to `public/` or serve it as-is). Confirm parity on Android Chrome, iOS Safari, desktop. This is your visual regression baseline.

**Phase 1 — Modularise (1–2 weeks).** Convert each `.js`/`.jsx` to an ES module in the load order given by `Stuti.html`. Replace `window.X` globals with imports. Replace `stuti-boot.js` with the bundler. Keep localStorage keys identical (listed below) so beta users' data survives.

**Phase 2 — Foundation / back end (6–10 weeks).** This is what the tracker calls "must become real". In dependency order:
1. Platform + accounts (`stuti-auth.js` is a stub storing `stuti-session` locally). Phone or email sign-in.
2. Sync: the stores in `stuti-store.js`, `stuti-sadhana.js`, `stuti-watch.js`, `stuti-keep.js`, `stuti-flyleaf.js`, `stuti-prefs.js` become local-first with server sync. Provide export/import (JSON of all keys below).
3. Push: `stuti-push.js` + `stuti-nudge.js` expect a cue server that sends sandhyā/tithi reminders; only the client half exists. Reminders must fire with the app closed.
4. Giving: `stuti-dana.js` has Razorpay slots (`STUTI_RAZORPAY`) left blank; payments do not settle.
5. Corrections pipeline: a way to fix a verse without redeploying (move text data to a served JSON/CMS with the same shape).
6. Release process, analytics (privacy-friendly, no PII, ~12 events — see `docs/Daily Plan.html` day 6).

**Phase 3 — Public launch.** Only after 1–4 are real.

## localStorage keys to preserve

`stuti-favs`, `stuti-favs-week`, `stuti-last`, `stuti-loc`, `stuti-detected`, `stuti-watch`, `stuti-thread`, `stuti-japa`, `stuti-plans`, `stuti-vows`, `stuti-keep`, `stuti-flyleaf`, `stuti-recite-cfg`, `stuti-session`, `stuti-push`, `stuti-nudge-fired`, `stuti-lang`, `stuti-theme`, `stuti-ui-lang`, plus whatever `stuti-prefs.js` writes (grep `localStorage` there). `stuti:jsx:*` is the boot loader's transpile cache — drop it.

## Screens (each is one `.jsx`)

Home/Today (`stuti-home.jsx`, `stuti-today.jsx`, `stuti-sky.jsx` — the sky plate changes with sandhyā), Reader (`stuti-reader.jsx`, `stuti-pada.jsx` per-word, `stuti-record.jsx`, `stuti-voice.jsx`), Library (`stuti-library.jsx`, `stuti-find.jsx` search, `stuti-picker.jsx`), Practice (`stuti-practice.jsx`, `stuti-japa.jsx`, `stuti-plans.jsx`, `stuti-vows.jsx`, `stuti-keep.jsx`, `stuti-ledger.jsx`, `stuti-parayana.jsx`, `stuti-vrata.jsx`, `stuti-nomu.jsx`, `stuti-prep.jsx`), Calendar (`stuti-calendar.jsx`, `stuti-panchanga.jsx`, `stuti-masa.jsx`, `stuti-sandhya.jsx`, `stuti-remind.jsx`), Settings/Account (`stuti-settings.jsx`, `stuti-account.jsx`, `stuti-flyleaf.jsx`, `stuti-dana.jsx`, `stuti-limits.jsx`, `stuti-feedback.jsx`, `stuti-share.jsx`), Onboarding (`stuti-onboard.jsx`, `stuti-flow.jsx`, `stuti-await.jsx`). Routing is hash-based in `STUTI_ROUTE` (`stuti-store.js`) and `stuti-main.jsx`.

Every component's header comment explains *why* it exists and the decisions behind it. Read them; they are the spec.

## Known gaps (from the tracker)

Sign-in, sync, push, payments are stubs. Some texts lack a rights source (`docs/Stotra Sourcing Tracker.md`). No automated tests exist. Pañcāṅga accuracy has been checked against printed almanacs for a few dates only.

## House rules (copy into the new repo's CLAUDE.md)

See `docs/PROJECT-NOTES.md` — no italics ever; all fonts via CSS tokens; update the changelog every run in the house voice (name the cause, not the symptom); end every session with a handoff summary.

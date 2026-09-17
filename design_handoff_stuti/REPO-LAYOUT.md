# Repo layout — schavalidev/stuti

One copy of every file lives at this project's root. This file maps each root file to its place in the repo. Claude Code: clone the repo, download this project, copy by these rules, then `git add` and push. Rewrite no `<script src>` — every app file lands together in `app/`, so relative paths hold.

## Rules, in order

1. `app/` — the running prototype. Everything the entry HTML files load.
   - Entry points: `Stuti.html` (phone), `Stuti - Tablet & Desktop.html` → rename to `Stuti-Tablet-Desktop.html`, `Stuti - Website.html`.
   - All `stuti-*.js`, `stuti-*.jsx`, `stuti*.css`, `stuti-logo*.png`, `stuti-sw.js`, `manifest.webmanifest`.
   - `site-*.js`, `site.css` (website).
   - Data: `stotra-index-data.js`, `observances-data.js`, `telugu-meanings.js`, `vsn-stotram.js`.
   - `tweaks-panel.jsx`, `ios-frame.jsx`.
   - Folders: `assets/`, `emblems/`, `fonts/`, `icons/` (whole folders).
2. `docs/` — operating documents, read as-is.
   - `Changelog.html`, `Launch Tracker.html`, `Launch Plan.html`, `Daily Plan.html`, `Founders Guide 4 Weeks.html`, `Pending.html`, `Work Items.html`, `Welcome Note.html`, `Stuti Market Analysis.html`.
   - `Stotra Sourcing Tracker.md`, `Suktam Content Spec.md`, `nomu-data-spec.md`, `sahasranama-format.md`.
   - `stuti-ops.js`, `stuti-ops.css` (the docs' shared chrome).
   - `handoff/`, `audit/` (whole folders).
3. `design/` — explorations, option boards, audits. Not loaded by the app.
   - Every other root `.html` (Akshara*, App Audit, Beige + Pigment, Calendar Tabs Options, Deity *, Emblem Gallery, Festival Card Options, Font *, Glyph *, Home *, Kids, Kshana Card, Library Page Redesign, Navigation Audit, Pitru Register Preview, Reader Redesign Options, Recitation Builder Prototype, Reset offline worker, Ritu Palette Exploration, Season *, Shiva Emblem Test, Sky Variations, Speed control options, Stotra Index, Stuti Logo, Telugu Reader Font Comparison).
   - Their support files: `home-redesign.css`, `home-redesign.jsx`, `_*.json`, `kids/`, `screenshots/`.
4. `legacy-akshara/` — the older Akshara app, kept for reference only: `index.html`, `about.html`, `almanac.html`, `audit.html`, `calendar.html`, `get.html`, `library.html`, `practice.html`, `read.html`, `settings.html`, `signin.html`, and the `.jsx`/`.js`/`.css` they load (`app.jsx`, `about.jsx`, `account.jsx`, `akshara-almanac.jsx`, `calendar.jsx`, `components.jsx`, `data.js`, `detail.jsx`, `edge.jsx`, `home.jsx`, `library.jsx`, `observances.jsx`, `practice.jsx`, `reader.jsx`, `saved.jsx`, `script.js`, `search.jsx`, `shelves.jsx`, `stotras.jsx`, `styles.css`).
5. Repo root: `HANDOFF.md` → `README.md`; `CLAUDE.md` as-is; `REPO-LAYOUT.md` as-is.
6. Skip: `.thumbnail`, `scraps/`, `uploads/`, `github.md`.

## From the user's disk, not from this project

The stotra corpus and reference notes are only on the user's machine, in the folder `Stuti/`. Copy them straight into the repo — they do not pass through this project:
- `Stuti/stotras/` → `stotras/` (source texts, one `.txt` per hymn, grouped by deity; `stotras/bin/` holds the Python tools that built the app's `stuti-text-*.js`). Drop `.DS_Store` and `bin/cache/`.
- `Stuti/reference/` → `reference/` (māsa, tithi and vrata references in English, Hindi, Telugu).

## Tie-breaks

A root file not named above: if any `Stuti*.html` loads it, `app/`; if a `design/` page loads it, `design/`; otherwise `docs/`. When in doubt, `app/` is the safe error — a file too many there breaks nothing.

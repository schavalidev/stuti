# Stuti · स्तुति

A devotional companion for Hindu households: stotras and sahasranāmas in
Devanāgarī, Telugu and IAST; a pañcāṅga computed on-device; japa, recitation
plans, vrata/nomu trackers and a practice ledger.

## Two halves, one repo

- **`design_handoff_stuti/`** — the design of record. The designer exports
  here from Claude Design (`README.md`, `app/`, `docs/`). `app/` is a
  working no-build-step prototype and is never hand-edited from the
  engineering side; `docs/Changelog.html` is the shared history, appended
  to in the house voice by both sides.
- **`stuti-app/`** — the production app: Vite + React + TypeScript, Capacitor
  for Android, `vite-plugin-pwa` for the installable web build. `src/` is
  **generated** from `design_handoff_stuti/app/` by
  `tools/codemod/run-all.sh` (plus the hand-authored entry files that script
  restores from `tools/codemod/templates/`).

## When the design changes

```bash
git pull
cd stuti-app
./tools/codemod/run-all.sh     # re-port the prototype into src/ (fails loud on anything unexpected)
npm run build                  # web build
npx cap sync android           # copy it into the Android project
source tools/android-env.sh && (cd android && ./gradlew assembleRelease)
# -> android/app/build/outputs/apk/release/app-release.apk
```

`run-all.sh` overwrites the modules it generates and removes only those
whose source file has gone. Files it does not own (anything not derived from
`design_handoff_stuti/app/`) are left alone.

## Rule for backend / sync code

Don't put backend logic into generated files under `src/` — the next
re-port overwrites them. Write it in new modules that import and wrap the
generated stores (`stuti-store.ts`, `stuti-sadhana.ts`, …) instead.

## Toolchain

`source stuti-app/tools/android-env.sh` — JDK 21 and the Android SDK
cmdline-tools, both installed via Homebrew; no Android Studio.

`stuti-app/stuti-release.keystore` and `stuti-app/android/keystore.properties`
sign every build and are **gitignored on purpose**. Back them up somewhere
private: a build signed with a different key can't be installed over an
existing one without uninstalling first.

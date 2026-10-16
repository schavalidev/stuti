# End-to-end audit — S76, 17 October 2026

What was done: the bundle in `stuti-app/dist` was built from the current source and walked in
the browser at phone width (gate, onboarding, the four tabs, reader, learn, settings and every
sheet under it, search, japa, nitya lenses, calendar tabs, vrata pages, deep links). In parallel,
six reviewers read the whole source by area and diffed it against the design prototype. The live
site was checked with read-only requests. Nothing in the app was changed; this file is the only
new thing in the repo.

Severity: **broken** = the flow cannot complete · **degraded** = completes wrongly or loses state ·
**missing** = promised but not there · **risk** = a promise the code can break · cosmetic.

Every item names a file and line so it can be checked rather than trusted. The detailed per-area
notes (about 450 findings-lines) are summarised here; the shape of each fix is given where it is
obvious, but no fix was applied.

---

## 1. Stop the line — fix before anything is published again

### 1.1 broken · "Add a tithi" and the japa back-entry white-screen the whole app
`stuti-app/src/stuti-japa.tsx:378-379` — `DayPick` calls `window.React.useRef` and
`window.React.useEffect`. The prototype loads React as a global; the Vite build does not, so the
component throws on first render and React unmounts everything. Reproduced in the built bundle:
Calendar → My tithis → Add a tithi → blank screen, `#root` empty, only a reload recovers.
Reached from `stuti-tithis.tsx:311` (add, edit, "add a tithi on this day", personal day on the
festival card, personal parva card on Home) and from the japa "counted on your own mālā" day
picker (`stuti-japa.tsx:237`).

It is in every APK since 19 September: `builds/Stuti-v51.apk` to `Stuti-v54.apk` all carry
`window.React.useRef` (checked by unzipping the bundle). The live web does not, only because the
live web is older still (1.9). The codemod has no step that rewrites `window.React`; the fix is
a `fix-*.mjs` step (or `React.useRef` in the design file, then a re-port).

### 1.2 broken · even past 1.1, the tithi sheet can never be saved
`stuti-tithis.tsx:377` — `disabled={!name.trim()}`; there is no `name` in `TithiSheet` (the typed
name is `nm.roman`, line 192), so it reads `window.name`, which is `""`, and Save stays disabled
forever. Same at line 259. Present in the design too. A śrāddha tithi can only enter through the
pitṛ register's `linkTithi`; janma tithis and "other" days cannot be added at all.

### 1.3 broken · every dark-fortnight ekādaśī is named one month late
The vrata list shows Indirā Ekādaśī on 5 Nov 2026 and Ramā on 4 Dec; the pañcāṅga has Ramā on
5 Nov and Indirā on 6 Oct. Cause: `stuti-ekadashi-data.ts:85-95` matches `e.key.masa` against
`pa.masaIdx`, which is the **amānta** month (`stuti-panchanga-engine.ts:893-903`), while the
data is keyed by the **pūrṇimānta** names every ekādaśī list uses (Saphalā = "Pauṣa · Kṛṣṇa",
line 54). Śukla ekādaśīs are right (Pāśāṅkuśā 22 Oct); every kṛṣṇa one is shifted (Utpannā on
3 Jan, Saphalā on 2 Feb, Pāpamocanī on 2 May, Varūthinī on 1 Jun). Fix shape: for a kṛṣṇa
pakṣa, match on `(masaIdx + 1) % 12` — the engine already computes this as `masaPurnimanta`.

### 1.4 broken · the Hindi and Telugu meanings never load
The eight `stuti-hindi-*.ts` modules (core, shiva, ganesha, ganesha2, subrahmanya, sahasra,
names-lalita, names-vishnu) are ported but **nothing imports them**, so Vite never bundles them.
They are side-effect scripts that attach `v.hi` / `v.tel` to each verse; the design ran them as
`<script>` tags. Verified: probe strings from each file occur 0 times in the built chunk. Effect:
a Devanāgarī or Telugu reader sees the English meaning for every text these files cover (ten
core stotras, eleven Śiva texts, the Gaṇeśa and Subrahmaṇya sets, and the Hindi glosses of the
Lalitā and Viṣṇu thousand names). Fix: side-effect imports from `tools/codemod/templates/main.tsx`
after `stuti-data`.

### 1.5 broken · a learn-by-heart plan can be finished in one sitting
`stuti-plan-sitting.tsx:211` completes the day the moment the last verse holds;
`stuti-sadhana.ts:126-132` saves and notifies; `stuti-plans.tsx:191-195` recomputes
`currentDay` and remounts the next day's sitting in the same tick. "Day done · back tomorrow"
never shows. `doneToday` at `stuti-plans.tsx:192` is computed and never used — that is the guard.

### 1.6 broken · vow bells reckon the wrong days
`stuti-cues.ts:395` hands the cue engine `{occ, term}` only, so `vowDueOn` (line 62) ignores
`spanDays`: a "some days" vow rings on day one only, a date-range vow rings for 92 days from
its start. The in-app Vows card uses `STUTI_VOWS.isDue` correctly, so the card and the bells
disagree.

### 1.7 broken · "Open the day" on the home lead-up strip does nothing, and the vidhānam's Back strands the reader
`stuti-home.tsx:407` calls `go("vrata", …)` and `stuti-vidhi-jump.tsx:14` opens the reader with
`from: "vrata"`. The router (`stuti-main.tsx:629-646`) has no `vrata` view: it falls through to
a second, un-keyed Home with `route.view` still "vrata", so the brand bar vanishes and no tab is
lit. From a vidhānam the Back arrow lands there, and the Library tab then resets the page the
reciter came from. Both exist in the design. Fix: `go("browse", {libSub: {kind: "vrata", key,
returnTo: "home"}})` for the strip (the sibling cards do this), `from: "browse"` for the jump.

### 1.8 broken for shipping · the build stamp disagrees with the changelog
`Changelog.html:98-99` is at 0.9.110 · 15 Oct; `stuti-build.ts:15-16` and the design's
`stuti-build.js:8-9` say 0.9.109 · 2026.10.13. `check-stamp.mjs` exits 1, so `release-apk.sh`
and `ship.sh` refuse in preflight. One line in the design stamp, then a re-port.

### 1.9 the live web is six weeks behind the verified build
The deployed chunk (`index-CtiFz0Uk.js`) stamps 0.9.89 · 2026.09.04. It still loads
`fonts.googleapis.com` (the GDPR request removed on 17 Sep), has no push worker
(`/stuti-push-sw.js` and `/.netlify/functions/push-send` are 404), no corrections, no feedback
relay path, no counters. The privacy draft's "fonts are not loaded from Google" is true of
`dist/` and false of the site. Publishing is batched by rule; this is the size of the batch.
Not deployed here — that needs your yes.

---

## 2. Privacy and promises the code can break

- **risk** · `stuti-journal.ts:83-87` logs every tapped button's text. In the pitṛ register each
  name is a button (`stuti-pitru-register.tsx:322`), so a deceased's name goes into the journal
  that beta builds send to Drive by default (`stuti-relay.ts:39-40`) — against the register's own
  "never sent anywhere" line (`:38`) and the journal's header promise (`:12`). Skip `.rg-name`.
- **risk** · `stuti-sync-hook.ts:14-21` lists the pitṛ register, my-tithis, dāna and ledger for
  sync. Inactive while Supabase is blank; the day it is filled, the same on-screen promise breaks.
  Either take the register off the list or change the sentence first.
- **degraded** · Follow relays every session's transcript (and WAV on Android) to the makers
  (`stuti-follow.tsx:366`) while the keep chip says "Nothing is uploaded" (`:72-77`). True of
  the kept file, not of the session. Say so, or link the Settings relay switch from the chip.
- **degraded** · with the Drive token dead (since 22 Sep), the relay answers 502, the client
  queues it (`stuti-relay.ts:64-70`, cap 12) and replays on every launch and every `online`
  event, forever. Bounded in storage, unbounded in function calls, silent to the user. Treat 502
  like 503.
- **risk** · "Everything" reset and "Save a copy" use a key list (`stuti-build.ts:74-92`) that
  misses about twenty-five keys the app now writes: `stuti-favs-week` (the weekday lists),
  `stuti-my-tithis`, `stuti-pitru-register`, `stuti-dana`, `stuti-temples`, `stuti-readmode`,
  `stuti-fontscale2` (the list names `stuti-fontscale`, which nothing writes), the prep and
  samagri keys, and more. A reset leaves the register and the lamp on the phone; a carried shelf
  arrives without weekday lists or personal tithis. The practice reset also misses `stuti-keep`.
- **missing** · the privacy policy and terms (`stuti-app/docs/legal/`) are not served, not
  linked, and still read "Effective [DATE]". Settings' "Privacy & data" block links nothing.

---

## 3. Degraded flows, by screen

### Home and shell
- "All of <deity>'s hymns" on the home's temple card opens the library root
  (`stuti-home.tsx:578`, `returnTo` is dropped by `go()`); should be `go("deity", …)`.
- Rāhu-kāla "in effect" rows compare the device clock with the place's windows
  (`stuti-home.tsx:229-230`); the calendar does it right with `effTz`.
- A detected location stores a fixed UTC offset (`stuti-store.ts:104`), so every DST change
  shifts sunrise and tithi ends by an hour until re-detected. Store the IANA zone.
- Sandhyā bells default to Tirupati when no place was ever set (`stuti-store.ts:91`); overseas,
  prātaḥ rings at one in the morning. There is no "no place" state.
- The pañcāṅga bell uses `new Notification` (`stuti-home.tsx:650`), which the Android WebView
  lacks, and it only sets `remind.tithi`, which rides in a digest that is off by default.
- The first-run saṅkalpa sheet opens on the home underneath onboarding, whose last step asks
  the same gotra and name; the reciter lands on Home with the sheet already open. Seen in the
  browser; the trigger is the flyleaf's first-run ask.
- A running parva reads "Sunday · today" on the getting-ready card (`stuti-prep.tsx:229`, the
  start date's weekday with away = 0) and "in -6 days" on its vrata page
  (`stuti-vrata.tsx:44-49`, no branch for a negative count). Say "day 7 of 10".
- The notifications row in Settings says "The reminder is set but will not arrive" whenever
  permission is denied, even with the reminder off (`stuti-settings.tsx:484-489`).
- Unknown views (`#reader/<bad id>`, an unknown deity) show a chrome-less Home; a deep-linked
  hash is never cleared, so a reload reopens the linked screen (`stuti-main.tsx:533, 646`).
- Onboarding calls the Devanāgarī script "Hindi" (`stuti-onboard.tsx:30`); the sample is Sanskrit.
- Many controls have no accessible name: deity tiles, calendar day cells, the four tab buttons,
  the Nitya lens tabs (seen in the accessibility tree).

### Reader, search, japa
- Search loses its query, weekday and voice flag on Back from a hymn (`stuti-reader.tsx:1464`,
  `stuti-main.tsx:597`); only the festival hit threads them back. The "add for Tuesday" flow
  therefore comes back adding to the everyday list.
- Settings opened from the reader resets its Back to the deity shelf (`stuti-settings.tsx:342`).
- Reading the full column by scrolling never saves a place or writes the resume card
  (`stuti-reader.tsx:1147-1153` vs `1102-1122`).
- Search and "also in" jumps count every verse, the reader skips hidden nyāsa verses, so a result
  opens N lines late in the Subrahmaṇya texts with a nyāsa (`stuti-main.tsx:84-91`,
  `stuti-lexicon.ts:978-988`, `stuti-reader.tsx:907-919`).
- "Record your turn" in Learn → Repeat closes Learn and starts the whole-recitation Follow
  recording wherever speech recognition exists (`stuti-reader.tsx:1606`); the label still
  promises a per-line take.
- Follow builds its line table once (`stuti-follow.tsx:307-334`); toggling nyāsa or the tarpaṇa
  occasion mid-session mis-seats the light.
- The japa counter has no thread chooser (`setMid` never called, `stuti-japa.tsx:471`); it counts
  for "shiva" by default and Back always goes to Nitya.
- Once a corpus host is set: a corpus text's saved place is deleted on first open each session
  (`stuti-reader.tsx:843-849` computes `total` from still-empty verses) and the reader says
  "coming soon" while the fetch is in flight.
- Share produces a PNG only (`stuti-share.tsx:127-136`); there is no shareable verse link,
  though `stuti-store.ts:181` describes one.

### Nitya, plans, vows, reminders
- Drag-to-reorder the Nitya list is HTML5 drag only (`stuti-home.tsx:906-910`): nothing moves on
  a phone.
- Weekday exclusivity is one-way (`stuti-store.ts:18-19` vs `49-54`): lighting the diya in the
  reader on a Tuesday hymn puts it in both lists and the queue plays it twice.
- A vow's bell, a personal tithi, a plan and japa only ride in the daily digest, which needs
  "Remind me daily" on; VowSheet asks permission but never turns it on (`stuti-vows.tsx:380-382`).
- Android cues keep their first wording for the week they were laid (`stuti-notify.ts:204-219`)
  and `lay()` is not subscribed to the vow, plan, keep or tithi stores.
- The sandhyā practice's two "open text" buttons point at catalog-only texts (Āditya Hṛdayam,
  Gāyatrī) and open the waiting room (`stuti-library-data.ts:131-132`).
- Reopening a practice ticked last week marks today's thread (`stuti-practice.tsx:283`, undated
  checklist); un-ticking a nomu or undoing japa never un-marks it (`stuti-sadhana.ts:19-25`), so
  the keep card and the ledger disagree exactly there.
- The reminders sheet previews a "getting ready" notification that no layer sends
  (`stuti-remind.tsx:325`; no bell layer reads `STUTI_PREP`); the "remind me on the day" snooze
  flag is written and never read.

### Calendar, observances, ancestors
- Pitṛ bells on eclipse and saṅkrānti rows (`stuti-pitru.tsx:189`) record a watch under ids no
  lookup resolves (`grahana-tarpanam`, `sankranti-pitru`): lit, "added", invisible, silent.
- Māsa page → a row → Back lands on the lens root, not the month (`stuti-library.tsx:533-538`).
- `NOMU_MASA` (`stuti-masa-data.ts:262-266`) names six nomu ids that do not exist, so Kārtika and
  Śrāvaṇa list no nomulu; `BYVRATA` in `stuti-purnima-data.ts:45` maps twelve ids that are not
  vrata ids, so Lakṣmī, Kūrma and Annapūrṇā Jayantī never show their pūrṇimā story.
- The gazetteer and temple index never retry after one failed load (`stuti-gaz.ts:20-31`,
  `stuti-temple.ts:94-105`) and the menu then says "No place by that name".
- The register's "×" and the tithi sheet's "Remove" delete at once, with the linked ābdikam
  (`stuti-pitru-register.tsx:326`); every other destructive control in the app arms first.
- The compass's iOS refusal is reported three sections below the switch (`stuti-compass.tsx`).
- English-only strings on the place menu, sky bell sheet, home notes and grahaṇa subs; the pitṛ
  fortnight line prints the roman name. Every `L.t` key used does resolve (267 checked).
- `.pit-day i` has no `font-style: normal` (`stuti-components.css:1446`), so the pitṛ day-chip
  label is the one italic in the app. Also `KanakaDurga-Italic.otf` is bundled and never used.

---

## 4. Missing against the design and the launch docs

- **Tablet and desktop layout.** `index.html` loads only `main.tsx` → `stuti-main`. Nothing
  imports `stuti-wide-main.tsx`, there is no media query or dynamic import choosing a shell, and
  `stuti-wide.css` is never copied by the pipeline (`setup-entry.mjs:21`). On a wide screen the
  app is the phone column, centred. The dead file still ends in `createRoot` (line 565), skips
  the beta gate and registers a `stuti-sw.js` that does not exist; the pipeline still seam-patches
  it every run and typecheck reports its 23 errors.
- **Festive petals.** `stuti-festive.ts` is ported but never imported; its CSS is in
  `stuti-pigment.css:146`, "festive-petal" is absent from the bundle.
- **Website and landing page.** Deployed nowhere. "Stuti - Website.html" redirects to an
  `index.html` that is not in `app/`; the real pages are in `legacy-akshara/` and load
  `site-*.js` files that only exist in `app/`. `site-signin.js` accepts any six digits without
  verification and writes a localStorage flag; it shares nothing with the app's Supabase flow.
- **Ledger export** (Launch Tracker "non-negotiable"): no export handler anywhere.
- **The print meter** still ships "A paid plan is coming in the next version"
  (`stuti-i18n.ts:341`) against the standing recommendation to delete it. It is not enforced
  anywhere (`STUTI_LIMITS.take` is never called), so it is copy, not a gate.
- **Pipeline stamp.** `.ported-at` is written from the last commit at run time, before the
  commit carrying both design and port exists, so `check-design-updates.sh` reports nine "new"
  commits that are already ported. The port is current; the stamp is not.
- The design's own `stuti-practice.jsx:282` carries a `data-lens={lens}` ReferenceError that the
  port strips; the design still has the bug.
- The precache is 24 entries, 6.09 MiB, of which the one main chunk is 5.45 MiB (91% of the
  6 MiB ceiling in `vite.config.ts:35`): a one-byte text change re-downloads 5.4 MiB per device.
  Splitting the text modules into their own chunks is what makes deploys cheap again.

---

## 5. Integrations with every config blank (the shipped state)

All verified clean: no Supabase client is created, nothing syncs, no counters leave the device,
corrections and corpus return at once, web push never subscribes, the account row is an inert
"coming later", dāna shows a labelled preview with no live button, and feedback goes relay ∥
table → `mailto:feedback@stuti.app`. Schema and client agree on every table, column and RPC;
RLS is on every table; the admin inbox is gated server-side; the native deep link
`com.stuti.app://auth-callback` is in the manifest and handled; the push chain is consistent and
`push-selftest.mjs` passes 23/23. The relay has no delete path and enforces the APK name shape;
it has no auth and no rate limit by design. No secret is tracked; no third-party CDN or
analytics is in the bundle. Still unverified from here: the Netlify environment values and the
merged Android notification permissions.

---

## 6. Verified working in the browser (built bundle, phone width)

Gate (wrong-word path and Enter key), onboarding's five steps and their persistence, the four
tabs, library → deity → reader, play/pause and line stepping, Verse/Full, Meaning, Learn →
Repeat/Memorize, add and remove from the daily list, Nitya "Begin" queue into the reader, all six
Nitya lenses, japa beads with the day/lifetime counts and the ledger reflecting them, search
across titles/verses/festivals and the festival hit's round trip with the query intact, the
vrata page from the calendar, Settings' theme, place search through the lazily fetched gazetteer,
reminder toggle, the feedback and support sheets, and the hash deep links `#calendar`, `#nitya`,
`#library`, `#japa`, `#plans`, `#settings`, `#reader/<deity>/<hymn>`. No console errors on any
of these paths.

---

## 7. A sensible order

1. 1.1 + 1.2 (tithi sheet), 1.4 (Hindi imports), 1.3 (ekādaśī month), 1.8 (stamp) — all small,
   all in the port or one line of data; then build, verify, and publish web + APK together, which
   also closes 1.9.
2. 1.5, 1.6, 1.7 and the two privacy leaks in §2 — each is a handful of lines.
3. The key-list reset/carry, the relay replay, the legal pages served and linked.
4. Everything in §3 and §4 is launch polish; the tablet layout and the website are decisions, not
   bugs.

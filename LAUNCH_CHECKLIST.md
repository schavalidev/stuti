# Launch checklist

Granular, tickable state of what stands between Stuti as it is today and a public
release. Written 3 October 2026 (S61) from the code and the corpus on disk, not
from the September planning docs — `design_handoff_stuti/docs/Launch Tracker.html`
and `Pending.html` date from 13 September and no longer describe the app.

**The rule for this file:** tick a box only when the thing is true on disk or in a
live account, and keep the boxes current per item rather than at the end of a run.
Every claim below can be re-derived with the command named beside it, so the file
can be checked rather than trusted.

---

## A. The four switches

Everything in this section is built, tested and shipping switched off. Each waits
on an account that only you can open; none of it is code.
Config: `stuti-app/src/stuti-cloud-config.ts`. Procedure: `stuti-app/docs/backend.md`.

### A1. Supabase — accounts, sync, export, counters, feedback inbox, corrections

Blocks the other three in practice: real identity sits under all of them.

- [ ] Create the project at supabase.com, region Mumbai (`ap-south-1`)
- [ ] SQL Editor → run `stuti-app/supabase/schema.sql` (safe to re-run)
- [ ] Paste Project URL into `supabaseUrl`
- [ ] Paste the anon / publishable key into `supabaseAnonKey` (never `service_role`)
- [ ] Authentication → URL Configuration → Site URL `https://stuti-app.netlify.app`
- [ ] Redirect URLs: `https://stuti-app.netlify.app/**`, `http://localhost:4173/**`, `com.stuti.app://auth-callback`
- [ ] Magic Link email template → show `{{ .Token }}`, because the app asks for six digits, not a link
- [ ] Custom SMTP before any public release (the built-in mailer sends a few an hour)
- [ ] Decide which doors open, and set the same in `providers`: email is on; phone needs an SMS provider plus DLT registration for Indian numbers; Google needs an OAuth client with redirect `https://<ref>.supabase.co/auth/v1/callback`
- [ ] Verify first sign-in on a device that already holds beta data — existing keys are offered to the account, and the conflict screen appears when two phones disagree
- [ ] Insert your own `user_id` into `stuti_admins` so the in-app feedback inbox appears
- [ ] Read the counters once: `select * from stuti_events_daily;`

### A2. Razorpay — giving

Cannot start before the entity exists (D1). Longest lead on the page.

- [ ] Razorpay account against the registered entity, KYC cleared
- [ ] Payment Buttons → one fixed-amount button each for ₹251, ₹1,100, ₹2,500, ₹5,001
- [ ] Paste the four `pl_…` ids into `STUTI_RAZORPAY_IDS` (`day`, `month`, `year`, `patron`)
- [ ] Until they are in, confirm the giving screen still reads as a preview and promises nothing

### A3. Corpus host — the texts the app does not bundle

Procedure: `stuti-app/docs/corpus-delivery.md`, "Order of work" step 2 onward.
Step 1 is done: `stotras/bin/build_corpus.py` exists and runs.

- [ ] Create the R2 bucket (or equivalent static host)
- [ ] Custom domain on it
- [ ] CORS so the app's origin may fetch
- [ ] Sync command in `stuti-app/tools/`, honouring the order: `t/` first, `index.json` last
- [ ] Set `STUTI_CORPUS_URL`
- [ ] Verify in the built bundle, on the phone, and offline after one read
- [ ] Later, not for launch: seed in `public/corpus/`, drop the bundled text modules, per-deity keep

### A4. Feedback mail — three Netlify environment variables

The relay already files feedback into Drive; only the mail leg is unset.

- [ ] `RESEND_API_KEY` (resend.com, free tier)
- [ ] `STUTI_FEEDBACK_TO` — the support address
- [ ] `STUTI_FEEDBACK_FROM` — a sender on a domain verified in Resend, or Resend's
      test sender delivers only to your own address
- [ ] Deploy, then send one real message from the app and confirm it arrives

---

## B. Publish the corpus

The largest piece of work left, and it is a decision, not a build.
Re-derive with `python3 stotras/bin/build_corpus.py --check`.

Today: **1,528 files, 1,526 built, 0 listed.** Not one file carries a `Published:`
field, so the index has zero rows and nothing in the written corpus reaches a
reader. The source-leak gate is clean — `--publish-all` withholds nothing for a
reader field naming a source, so the 22 September backlog of 332 is closed.

- [ ] Rule on the launch set: how wide, and where it stops. The standing advice is
      to launch narrow and finished, and to publish the roadmap so absence reads as
      deliberate
- [ ] Add `Published: <date>` to each text in that set
- [ ] Run `build_corpus.py --write-ids` once the set is settled, so `corpus-ids.json`
      records the published identities
- [ ] Confirm the shelf spread is what you intend. With everything published it is
      vishnu 675, devi 359, itara 183, guru 77, subrahmanya 54, navagraha 49,
      hanuman 34, shiva 34, ganesha 31, nadi 17, pitr 5, and 8 deliberately
      shelf-less generic vidhānam texts
- [ ] Decide what the reader sees for a text whose meanings are not written yet

### Content still to write

- [ ] Bhāgavata: meanings for 332 of 335 adhyāyas. Only 8.2, 8.3 and 8.4 carry them
- [ ] Bhāgavata māhātmyas: not written
- [ ] `puja/smarta/51_sravana_mangalagauri_vrata_challa.txt` — reserved 14 September,
      transcription from 400 dpi page images in progress, no text layer in the source
- [ ] Minor deities absent from Gītā Press 1594 (Subrahmaṇya among them) need a
      printed edition found before their texts can be collated
- [ ] `devi/main/03_anandalahari.txt` is a deliberate pointer with no verses — leave it
      unpublished rather than fixing it

### Near-duplicate pairs awaiting a ruling

`python3 stotras/bin/variant_sweep.py` now reports **9 pairs**, up from the four
last reviewed. Each needs one of: merge, cross-reference both, or leave apart.

- [ ] `devi/durga/37` ⇄ `devi/durga/50` — Durgā aṣṭottara, 0.945
- [ ] `krishna/15_akrura_krta_krishna_stuti` ⇄ `vishnu/bhagavata/1040` — 0.938, new with the Bhāgavata
- [ ] `devi/durga/06_aparajita_stotram` ⇄ `devi/durga/43_tantrokta_devi_suktam` — 0.932
- [ ] `devi/lakshmi/01_kanakadhara` ⇄ `devi/lakshmi/02_kanakadhara_pathantaram` — 0.887
- [ ] `krishna/12_gopi_gitam` ⇄ `vishnu/bhagavata/1031` — 0.873, new with the Bhāgavata
- [ ] `devi/durga/27_aparadha_kshamapana` ⇄ `devi/durga/44_kshama_prarthana` — 0.829
- [ ] `devi/durga/14_tantrokta_ratri_suktam` ⇄ `devi/kalika/01_mahakali_stotram` — 0.820
- [ ] `Subrahmanya/12_kartikeyashtakam` ⇄ `Subrahmanya/33_shadanana_ashtakam` — 0.814
- [ ] `Subrahmanya/20_prajnavivardhana` ⇄ `Subrahmanya/53_prajnavivardhana_gitapress` — 0.789

---

## C. Not built at all

### C1. Push that survives a closed app

`stuti-app/src/stuti-push.ts` is 66 lines and holds the client half only:
`subscribed()`, `subscription()`, `record()`. The server half does not exist.
Scoped in `design_handoff_stuti/docs/Pending.html`; waits on A1.

- [ ] Generate VAPID keys
- [ ] Wire `PushManager.subscribe()` to the bell taps and the Settings reminder toggles
- [ ] A scheduled function that computes, per subscriber, which cues fall due in the
      next window — from `stuti_cue_prefs`, which already carries place, time zone,
      sandhyā toggles, quiet hours and digest hour
- [ ] The send step, `web-push` or the provider's REST API, against each due endpoint
- [ ] A service-worker `push` handler to show the OS notification with no page open
- [ ] A `notificationclick` handler to focus or open the app
- [ ] Until all of it lands, the toggles must keep saying the bells ring only while
      Stuti is open

### C2. Recorded recitation

- [ ] The registration seam and the per-line cue contract are built and validated.
      Zero recordings exist. A reciter, a room, per-line timings and written
      permission to distribute the voice are the work; the engineering is the small part
- [ ] Keep every audio affordance hidden until one recording is real

---

## D. Legal, naming, and the things with lead times

### D1. The entity — start first, it gates money

- [ ] Take the entity question to a chartered accountant: sole proprietorship,
      private limited, or a trust / Section 8 company. The dāna model points at the
      last, and it opens donation-specific tax treatment
- [ ] Bank account in that name
- [ ] KYC, which gates A2 entirely

### D2. Privacy policy and terms

Drafted in the app's own voice at `stuti-app/docs/legal/privacy.html` and
`terms.html`. Two problems: nine unfilled placeholders, and they are not served.

- [ ] `privacy.html:6` `[DATE]`
- [ ] `privacy.html:8` `[OPERATOR NAME]`, `[ADDRESS]`
- [ ] `privacy.html:50` `[REGION]`
- [ ] `privacy.html:98` `[NAME]`, `[SUPPORT EMAIL]`, `[ADDRESS]`
- [ ] `terms.html:6` `[DATE]`
- [ ] `terms.html:8` `[OPERATOR NAME]`, `[ADDRESS]`
- [ ] `terms.html:51` `[CITY]` — the courts named for disputes
- [ ] `terms.html:54` `[SUPPORT EMAIL]`, `[ADDRESS]`
- [ ] Move both into `stuti-app/public/` so they are served, and link them from
      Settings. Nothing in `src/` references either file today
- [ ] Check both against the DPDP Act duties: stated purpose, consent, deletion on
      request, breach notification. The counting stance — count actions, never
      people — is already right; put it in writing

### D3. Name, domain, licences

- [ ] Search the trademark register for "Stuti" in the relevant classes
- [ ] Register the domain and the obvious variants
- [ ] Take the handle on every platform you might use
- [ ] Verify `stuti.app` is yours — `SUPPORT` in `stuti-app/src/stuti-build.ts` already
      promises `feedback@stuti.app` and a three-day reply
- [ ] Check each bundled typeface for web-embedding rights, and each library's licence
- [ ] One attributions page in the app

### D4. Authority over the text

- [ ] Find one or two paṇḍitas or senior reciters willing to be credited as reviewers,
      per deity where possible
- [ ] Write the recension policy down: a named primary source per deity, followed, with
      the source and known variants shown on the text's own page
- [ ] State the pañcāṅga accuracy claim in the app before someone else tests it for
      you: which ayanāṃśa, which siddhānta, validated against which published
      pañcāṅga, and the margin — with a line telling anyone with a local tradition to
      follow their own
- [ ] Record a source and a rights basis for every text. The hymns are ancient and
      free; a particular edition, translation or gloss is somebody's copyright

---

## E. Release mechanics

- [ ] `stuti-app/src/stuti-build.ts` is stamped `0.9.104` / `2026.09.16` while the
      changelog is at `0.9.106` / 1 October. The stamp is stale and a tester's report
      will name the wrong build
- [ ] `GATE = "matsya"` — set to null for a public build
- [ ] `CHANNEL = "beta"` — move to `release`
- [ ] Keep the beta latch's grandfather clause in `main.tsx` for devices that finished
      onboarding before the gate existed
- [ ] Renew the Drive relay refresh token in Netlify. It died 22 September with
      `invalid_grant`, and APK publishing is blocked until you do it — only you can
- [ ] Prune the Drive folder by hand at the next publish: newest two APKs, and never
      trash a text log
- [ ] A staging URL that is not the live one
- [ ] An error reporter, so crashes arrive from software rather than from a
      disappointed relative
- [ ] Confirm a rollback can be done in minutes

---

## F. Rulings I am holding

Each of these quietly blocks work somewhere else, so each wants a decision more
than it wants more research.

- [ ] **Kedāreśvara's day.** The app shows Dīpāvali; the printed kalpa says Bhādrapada.
      I will not move `find()` on my own
- [ ] **Nārāyaṇīyam pārāyaṇa schedule** — the last open item on that text
- [ ] **Satyanārāyaṇa Paurāṇika twin** — audit it; the GP 592 substitutes and the
      reworded instructions are our own work, not a witness's
- [ ] **Satyanārāyaṇa adhyāyas 6–9** — whether the print's extra kathā adhyāyas go in
- [ ] **Reader text-language selector** — 31 non-Sanskrit files across Awadhi, Hindi,
      Braj and Tamil, so not a two-way toggle. Needs design on the next dump
- [ ] **Is there a paid tier, ever?** The print meter and the dāna screen hold two
      philosophies at once. The standing recommendation is dāna only, and delete the
      meter
- [ ] **Which surface is the front door** — one installable web app, with the site's
      only job being to get people to install it

---

## G. Housekeeping

- [ ] `design_handoff_stuti/docs/Launch Tracker.html` and `Pending.html` describe a
      state three weeks gone: they still call the port, the corpus build and the whole
      server side missing. Either refresh them in the designer's project or mark them
      as of 13 September so they are not read as current
- [ ] Nothing is instrumented until A1 lands, so day-seven return — the one number
      that decides whether this app is in anyone's practice — cannot yet be read

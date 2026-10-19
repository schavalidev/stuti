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

## A. The five switches

Everything in this section is built, tested and shipping switched off. Each waits
on an account that only you can open; none of it is code.
Config: `stuti-app/src/stuti-cloud-config.ts`. Procedure: `stuti-app/docs/backend.md`.

### A1. Supabase — accounts, sync, export, counters, feedback inbox, corrections

Blocks the other three in practice: real identity sits under all of them.

- [x] Create the project at supabase.com — made 19 October 2026 (S83) in Singapore
      (`ap-southeast-1`), not Mumbai: the sign-up form offered only the region group,
      and ~50 ms on an occasional sync does not justify recreating it
- [x] SQL Editor → run `stuti-app/supabase/schema.sql` (safe to re-run)
- [x] Paste Project URL into `supabaseUrl`
- [x] Paste the anon / publishable key into `supabaseAnonKey` (never `service_role`)
- [x] Authentication → URL Configuration → Site URL `https://stuti-app.netlify.app`
- [x] Redirect URLs: `https://stuti-app.netlify.app/**`, `http://localhost:4173/**`, `com.stuti.app://auth-callback`
- [x] Magic Link email template → show `{{ .Token }}`, because the app asks for six digits, not a link
- [x] Custom SMTP — Resend, 19 October 2026 (S83), `smtp.resend.com:465`, sending as
      `no-reply@stutiapp.com`. Not optional in the end: Supabase now locks template
      editing on the free plan until a sender of your own is connected, and its built-in
      mailer reaches only your own address anyway. DKIM, SPF and DMARC are live on
      Cloudflare and verified
- [x] Decide which doors open — email only for the first launch (19 October 2026, S83).
      Phone would need an SMS provider and DLT registration for Indian numbers, which is
      paperwork and cost for no reach that email does not already have; Google can be
      added later without anyone losing an account. `providers` in the config and the
      project's own settings agree: email on, phone and Google off
- [ ] Verify first sign-in on a device that already holds beta data — existing keys are offered to the account, and the conflict screen appears when two phones disagree
- [ ] Insert your own `user_id` into `stuti_admins` so the in-app feedback inbox appears
- [ ] Read the counters once: `select * from stuti_events_daily;`

### A2. Razorpay — giving

**Not in the first launch** (decided 19 October 2026, S83). Giving is held back,
which takes the entity, the bank account and KYC (D1) off the launch path
entirely: none of it gates the release any more, and the accountant conversation
can happen while the app is already out. What this section asks for still has to
happen before any money is taken; it is simply no longer a launch blocker.

The one thing this decision does add to the launch: the giving screen is still in
the app, so it must either come out of the first build or read plainly as not yet
open, so that nobody taps it and finds nothing behind it.

- [ ] Remove the giving screen from the first build, or make it say plainly that
      giving is not open yet
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

### A5. Web push — bells that reach a closed browser

Built 3 October 2026 (S64); waits on A1. Procedure: `stuti-app/docs/backend.md` §7.
The Android app does not need this: its bells are already laid in the OS.

- [ ] `node stuti-app/tools/vapid-keys.mjs` — public key into `pushKey` in
      `stuti-cloud-config.ts`, private key into Netlify as `STUTI_VAPID_PRIVATE`
- [ ] Re-run `schema.sql` (adds section 7), then run `supabase/push-cron.sql`
      (needs `pg_cron` and `pg_net`)
- [ ] Deploy, then `select beat_at, beat_ok, note from stuti_push_sender;` reads
      `beat_ok = true` within ten minutes
- [ ] In Chrome on the live site: switch on a sandhyā bell, allow notifications,
      close the tab, and see the bell arrive. Then the same in Firefox, and in
      Safari from a home-screen install on an iPhone (iOS 16.4 or later)

---

## B. Publish the corpus

The largest piece of work left, and it is a decision, not a build.
Re-derive with `python3 stotras/bin/build_corpus.py --check`.

Today: **1,528 files, 1,526 built, 0 listed** (the two that build to nothing are deliberate; see below). Not one file carries a `Published:`
field, so the index has zero rows and nothing in the written corpus reaches a
reader. The header gate is clean — `--publish-all` withholds nothing for a
reader field naming a source, so the 22 September backlog of 332 is closed.
**But the gate checks headers only** (found 17 Oct 2026, S75): 183 files carry sourcing inside
the `en`/`tel`/`hi`/`vidhi` fields themselves, and a parser fault had been appending the
recension note to the last verse of 509 files. The parser is fixed; the 183 files are not. See
`stotras/CORPUS_AUDIT_2026-10-17.md` §1b before publishing any of them.

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

**Settled, so not a box.** `build_corpus.py` reports two files with no units.
Neither is a fault. One is a reservation stub whose transcription is still in
progress, and it has its own box below. The other is permanent:
`devi/main/03_anandalahari.txt` is a pointer, because the
Ānandalaharī is not a separate work but verses 1–41 of the Saundaryalaharī, which
is already written at `devi/lalita/14_saundarya_lahari.txt` — 103 verses, with
Ānandalaharī carried as a named section and every one of those verses tagged to
it. Duplicating the forty-one verses under a second title is what the pointer
exists to prevent. Leave it unpublished and do not raise it again.

### Content still to write

- [ ] Bhāgavata: meanings for 332 of 335 adhyāyas. Only 8.2, 8.3 and 8.4 carry them
- [ ] Bhāgavata māhātmyas: not written
- [ ] `puja/smarta/51_sravana_mangalagauri_vrata_challa.txt` — reserved 14 September,
      transcription from 400 dpi page images in progress, no text layer in the source
- [ ] Minor deities absent from Gītā Press 1594 (Subrahmaṇya among them) need a
      printed edition found before their texts can be collated

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

Built 3 October 2026 (S64), switched off until A5. The design's scope had a server
reckon the cues from `stuti_cue_prefs`; that was decided against, because the cues
read state that lives only on the device and a second copy of the almanac would
disagree with the page. Instead the device seals its own week, as the phone lays
its own week in the OS. `node stuti-app/tools/push-selftest.mjs` checks it.

- [x] VAPID: `tools/vapid-keys.mjs` makes the pair; the sender checks the private
      half belongs to the public half before it sends anything
- [x] `PushManager.subscribe()` follows the reminder toggles, the place, the
      notification permission and every return to the app (`src/stuti-webpush.ts`)
- [x] The week is sealed on the device to the browser's own keys
      (`src/stuti-push-seal.ts`, matches RFC 8291's example byte for byte, in Node
      and in Chromium), so the server never holds a readable bell
- [x] Queue and sender state in Supabase (`schema.sql` §7, run under PGlite: 26 checks)
- [x] A cron in the database wakes the sender only when a bell is due
      (`supabase/push-cron.sql`)
- [x] The send step, with no dependency (`netlify/functions/push-send.mjs`)
- [x] Service-worker `push` and `notificationclick` handlers (`public/stuti-push-sw.js`)
- [x] The toggles say "only while open" until a server has actually accepted a week
- [ ] Verified end to end on a real push service — needs A5

### C2. Recorded recitation

- [ ] The registration seam and the per-line cue contract are built and validated.
      Zero recordings exist. A reciter, a room, per-line timings and written
      permission to distribute the voice are the work; the engineering is the small part
- [ ] Keep every audio affordance hidden until one recording is real

---

## D. Legal, naming, and the things with lead times

### D1. The entity — it gates money, but no longer the launch

Held back with giving (A2), decided 19 October 2026 (S83). Still the longest lead
on the page, so it is worth starting early; it just does not stand in the way of
the first release.

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

**The domain is `stutiapp.com`** (decided 19 October 2026, S83). `stuti.app` was
never available: it has been parked at a registrar by someone who is not running
anything on it, and the address the app promised therefore could never have been
had. The name itself stands — checked the same day, no app is called simply Stuti
on either the Indian or the American App Store, nor on Play, and the near names
(Stuti Sangrah, Ganpati Stuti) use the ordinary Sanskrit word descriptively, as
anyone may. `SUPPORT` now reads `feedback@stutiapp.com` in the port and in the
design's copy; the designer's own project still has the old address and needs the
same one-line change on the next dump.

The domain is now on the critical path, because Supabase will not let the free
plan edit the sign-in email until a mail sender of our own is connected, and
Resend will not send from a domain nobody owns. So no one can sign in until it
is bought.

- [ ] Buy `stutiapp.com` — blocks the sign-in email, and so blocks A1
- [ ] Search the trademark register for "Stuti" in the relevant classes
- [ ] Reserve the app name in App Store Connect when the first build is submitted;
      Apple holds names first-come from submission, not before
- [ ] Register the obvious variants
- [ ] Take the handle on every platform you might use
- [ ] Verify `stutiapp.com` is yours — `SUPPORT` in `stuti-app/src/stuti-build.ts` already
      promises `feedback@stutiapp.com` and a three-day reply
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

- [x] Build stamp matches the changelog (0.9.107 / 2026.10.03, S64), and
      `release-apk.sh` now refuses to build when they disagree
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

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
- [x] Sign-in works end to end, 19 October 2026 (S83): a code reached a real inbox
      from `no-reply@stutiapp.com` and opened a session in the built bundle. The
      templates cost most of the evening, and the reasons are worth keeping. Supabase
      parses the body and falls back to its own default **without reporting anything**
      when the parse fails, so the first version's nested tables and multi-line style
      attributes were discarded in silence; the rewritten body in
      `supabase/email-magic-link.html` must stay plain, and any change to it has to be
      tested by actually signing in. Both `Confirm sign up` and `Magic link or OTP`
      need the same body, because Supabase picks between them by whether the address
      is already known — a first-time reciter gets the signup one. A save takes a
      minute or two to reach the mailer, so a test straight after a save reads the old
      template. The OTP is eight digits unless Email OTP Length is set to 6
- [x] Verify the merge itself, away from the network — `node stuti-app/tools/sync-selftest.mjs`
      runs the real `stuti-cloud.ts` against a stand-in phone and a stand-in
      `stuti_kv`: fifty checks over ten situations, including a phone whose practice
      predates the stamps, an account another phone already filled, and both answers
      to the conflict screen's question. Nothing is lost, nothing is silently
      overwritten (25 Oct 2026, S61)
- [ ] Verify first sign-in on a real phone with real beta data and your own email —
      the part the selftest cannot reach
- [x] Insert your own `user_id` into `stuti_admins` — done 25 Oct 2026 (S61); the
      Feedback section shows on the account screen, signed in on the phone
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

- [x] Remove the giving screen from the first build, or make it say plainly that
      giving is not open yet — **already true**, checked 27 Oct 2026 (S83). The
      amounts step carries `danaOpenNote` ("Donations are not open yet — no money
      is taken today") above its own button, and the step behind it is titled
      "The giving is not open yet". With `STUTI_RAZORPAY_IDS` blank the real
      Razorpay button never renders at all. Nothing to change
- [ ] Razorpay account against the registered entity, KYC cleared
- [ ] Payment Buttons → one fixed-amount button each for ₹251, ₹1,100, ₹2,500, ₹5,001
- [ ] Paste the four `pl_…` ids into `STUTI_RAZORPAY_IDS` (`day`, `month`, `year`, `patron`)
- [x] Until they are in, confirm the giving screen still reads as a preview and
      promises nothing — confirmed 27 Oct 2026 (S83); the lamp is lit as a
      preview and says so in every language

### A3. Corpus host — the texts the app does not bundle

Procedure: `stuti-app/docs/corpus-delivery.md`, "Order of work" step 2 onward.
Step 1 is done: `stotras/bin/build_corpus.py` exists and runs.

- [x] Create the R2 bucket (or equivalent static host). Then an R2 API token with
      Object Read & Write, and export `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`,
      `R2_SECRET_ACCESS_KEY` — the sync command reads them from the environment and
      nothing is written into the repo
- [x] Custom domain on it — `corpus.stutiapp.com`, live 27 October 2026
- [x] CORS so the app's origin may fetch. The app's web origin is
      **`stuti-app.netlify.app`**, not `stutiapp.com`; the Android build's is
      `https://localhost`. All three, with `http://localhost:4173` for the
      verified bundle, answer with an `Access-Control-Allow-Origin`. The dev
      server's `http://localhost:5173` does not, so the corpus is invisible
      there — add it if the dev server is ever used against the live host
- [x] Sync command — `stuti-app/tools/sync-corpus.mjs`, written 21 October 2026 (S83).
      No dependencies: it signs its own S3 requests, so there is nothing to install. It
      uploads the texts first and `index.json` last, since the index is the only thing that
      names a text's file; it sweeps superseded texts only after the index has stopped
      naming them; and it uploads **only what `index.json` names**, because the build writes
      a text as `t/<id>.<hash>.json` and never removes the copy under the old hash — on
      20 October `corpus/t/` held 3,025 files against 2,016 live rows. `--to <dir>` rehearses
      the whole selection without an account, and `--dry-run` says what it would send.
      Proved locally: the built app fetched the index over CORS, cached all 2,016 rows, and
      opened Bhāgavata 11.24 with its thirty verses from a text file
- [x] Set `STUTI_CORPUS_URL` — `https://corpus.stutiapp.com`, 27 October 2026
- [x] Uploaded: 2,015 texts and `index.json`, about 102 MB
- [x] Verified in the built bundle, 27 October 2026. The app fetched the index
      cross-origin, placed all 2,015 rows (search went from 32 results for
      "Bhagavata" to 365), opened Araṇyakāṇḍa sarga 1 and Bhāgavata 1.1 and 9.6
      from their text files, and kept each one in IndexedDB after the read. This
      was also the first sight of the meaning-gap notice in its own case, on
      Bhāgavata 9.6 — 153 of the 2,015 live rows carry no gloss yet
- [ ] Verify on the phone, and offline after one read
- [x] Re-run `node tools/sync-corpus.mjs` to send `redirects.json` — done
      27 October 2026; it is on the host and the app's launch is clean. The first
      upload left it behind — the sync had never uploaded it — so the app asks
      for it and gets a 404 on every launch. It is not empty: it carries the
      retirement of `misc_vedic/01`, and without it a device holding an older
      index asks for a text the new index no longer names and never lands on its
      successor. Mended in the sync 27 October 2026, with a check that fails the
      run if the file is missing from the build
- [ ] Later, not for launch: seed in `public/corpus/`, drop the bundled text modules, per-deity keep

### A4. Feedback mail — three Netlify environment variables

The relay already files feedback into Drive; only the mail leg is unset.

**Mail on the domain comes first (found 25 Oct 2026, S61).** `stutiapp.com` is
yours and sits on Cloudflare, but it has **no MX records**, so nothing can receive
mail there yet. That is the address the app shows every tester, promises a
reply from within three days, and which the privacy policy names as the grievance
contact. It has to receive mail before anyone is invited to write to it.

- [x] The domain is **stutiapp.com**, not `stuti.app` — Cloudflare nameservers, and
      it already carries a Resend DKIM record. `stuti.app` belongs to a stranger,
      and the app had been naming `feedback@stuti.app` as its support address in
      four places, the published privacy policy among them. Corrected 25 Oct 2026
- [ ] Receiving: Cloudflare → stutiapp.com → **Email Routing** → forward
      `feedback@stutiapp.com` to your own inbox. It is free, takes a couple of
      minutes, and adds the MX records itself
- [ ] Sending: Resend → Domains → add `stutiapp.com`, then put its DKIM and SPF
      records in at Cloudflare. A DKIM record is already there, so this may be
      part-done. Until Resend shows the domain green, `STUTI_FEEDBACK_FROM` must
      stay unset, and Resend's test sender delivers only to your own Resend address
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

Today: **2,018 files, 2,016 built, 2,016 listed** (3 October: 1,528 files, 0 listed) (the two that build to nothing are deliberate; see below).
Every one of those 2,016 now carries a `Published:` date, so the index has a row for each
and the written corpus reaches a reciter — it had zero rows on the morning of 20 October.
**The reader fields are now clean** (20 October 2026, S83). The 183 files that carried
sourcing inside `en`/`tel`/`hi`/`vidhi` are cleared — 673 places in all, by
`stotras/bin/reader_leak.py`, which cuts what it can prove and hands the rest to a person;
about 150 were rewritten by hand. The header fields went with them, 279 places down to one,
and that one is the Gurucaritra calling the Self "the witness", which the audit's pattern
cannot tell from a textual witness. The markdown markers a reader was seeing — `**bold**`
and backticked mantras, 672 lines in 215 files — are gone too.

- [x] **Ruled 19 October 2026 (S83): the launch set is everything.** Everything that
      builds, not a narrow first shelf — 2,016 texts as it turned out, the corpus
      having grown since the count in this file was written. The tidying the ruling
      implied was done first, on 20 October, and is described above. One thing still
      follows from it: 332 of the 335 Bhāgavata adhyāyas have
      no meanings written, so the reader meets them as text alone; the box below about
      what a meaningless text looks like is no longer hypothetical
- [x] Add `Published: <date>` to each text in that set — done 20 October 2026 (S83),
      `Published: 2026-10-20` on all 2,016 texts that build
- [x] Run `build_corpus.py --write-ids` — done 20 October 2026 (S83); 2,016 ids
- [x] Shelf spread, as built 20 October 2026 (S83): vishnu 1141, devi 359, itara 207,
      guru 77, subrahmanya 54, navagraha 49, hanuman 34, shiva 34, ganesha 31, nadi 17,
      pitr 5, and 8 deliberately shelf-less generic vidhānam texts. Vishnu has nearly
      doubled since 3 October: the Bhāgavata and the Vālmīki Rāmāyaṇa landed between
- [x] Decide what the reader sees for a text whose meanings are not written yet —
      ruled and built 27 Oct 2026 (S83). It sees one quiet notice instead of the
      blank page it used to get: the verses are here and complete, the meaning is
      still being prepared and will arrive in an update, nothing is missing from
      your copy. `src/stuti-meaning-gap.tsx`, placed once inside the reader's
      scroller by `tools/codemod/fix-meaning-gap-seam.mjs`, so it covers the verse
      view and the flow view alike. A namāvalī is left alone: its meaning is the
      glossary and the reader already says so. Verified in the built bundle that a
      text **with** meanings shows them and no notice. The notice's own case was
      seen on 27 October, once the corpus was hosted, on Bhāgavata 9.6 — 153 of
      the 2,015 live rows carry no gloss yet, rather than the 332 recorded above:
      the meanings pass has moved since

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

- [x] `privacy.html` — filled and published 25 Oct 2026, S61
      Operator: Srikrishna, an individual. Contact: feedback@stuti.app, no postal
      address — the DPDP Act wants a reachable contact, not an address, from an
      individual. The SMS provider row was cut, not filled: phone sign-in is off
      It also now names the pitṛ register among what never leaves the phone
      Live at https://stuti-app.netlify.app/legal/privacy.html — and the service
      worker's navigation fallback skips /legal/, or an installed device is handed
      the app instead of the page
- [x] `terms.html` — filled and served 27 Oct 2026 (S83), beside the policy in
      `public/legal/`. §6 Giving no longer names a refund window or Razorpay: it
      says giving is not open for this release, which removed two blanks and
      matches A2. §3 stopped asking for a mobile number the app cannot sign
      anyone in with. §11's "Address: feedback@stutiapp.com" — an email on an
      address line — is replaced by a plain sentence that we keep no postal address
- [x] `terms.html` `[CITY]` — **the clause is gone, 27 Oct 2026 (S83).** Naming a
      city's courts is conventional but optional, and it binds almost nobody here:
      the same paragraph already concedes that anyone outside India may sue where
      they live, and Indian consumer law lets a consumer file in their own district
      whatever the terms say. §10 now says the terms are governed by the laws of
      India and stops. Neither document has a blank left in it
- [x] **The published policy had four blanks, not none** (found 27 Oct 2026, S83).
      The 25 Oct tick above was written from the intention, not from the file.
      `class="fill"` spans were live at the public URL: feedback retention, log
      retention, the reply deadline, and — on the page a reader would reach — a
      note to ourselves asking whether GDPR Article 27 needs a representative
      named in the EU and the UK. The three periods now read two years, twelve
      months and thirty days. The Article 27 note is off the page; whether a
      representative is actually required is now an open question below, not a
      paragraph on display

- [x] Link both from Settings — done 27 Oct 2026 (S83). Settings → Help → About
      now carries three rows: Privacy policy, Terms of use, Credits and licences.
      The rows are `src/stuti-legal-ui.tsx`, placed by
      `tools/codemod/fix-legal-seam.mjs`; the pages are served from
      `public/legal/`, so they open with no network, and the service worker's
      navigation fallback already skips `/legal/`. Verified in the built bundle
- [ ] **GDPR Article 27** — decide whether a representative in the EU and in the UK
      is required, now that the policy no longer carries the question as text
- [ ] Check both against the DPDP Act duties: stated purpose, consent, deletion on
      request, breach notification. The counting stance — count actions, never
      people — is already right; put it in writing

### D3. Name, domain, licences

**The domain is `stutiapp.com`** (decided 19 October 2026, S83). `stuti.app` could
not be had, and the address the app promised therefore never existed.

**`stuti.app` is a live competing product, found 21 October 2026 (S83). This
needs a decision.** On 19 October it was read as a parked domain with nothing on
it; that was wrong, and the reading was made from a 200 response and the
registrar's nameservers rather than from the page. The site is "Stuti, a Sadhaka
product", © 2026: it teaches Viṣṇu and Lalitā Sahasranāma verse by verse, with
word-by-word padacheda, adjustable tempo and daily review — the same ground this
app stands on. Web practice is live, it says iOS and Android are in build, and it
carries refund and delivery pages, so it takes money.

What follows: the name is in active commercial use for a close product by a
company that is ahead of us to the stores by its own account; the trademark
search below is now a launch item rather than housekeeping; and a reciter
searching for either will meet both. The store listings are still clear — checked
19 October, no app is called simply Stuti on Play or on either App Store, and the
near names (Stuti Sangrah, Ganpati Stuti) use the ordinary Sanskrit word
descriptively, as anyone may. `SUPPORT` now reads `feedback@stutiapp.com` in the port and in the
design's copy; the designer's own project still has the old address and needs the
same one-line change on the next dump.

The domain is now on the critical path, because Supabase will not let the free
plan edit the sign-in email until a mail sender of our own is connected, and
Resend will not send from a domain nobody owns. So no one can sign in until it
is bought.

- [ ] Buy `stutiapp.com` — blocks the sign-in email, and so blocks A1
- [x] **Ruled 21 October 2026 (S83): the app keeps the name Stuti, for now.** Taken with
      the competing product known and described above. "For now" is the user's own
      wording, so the question is not closed — it is parked, and the trademark search
      below is what would reopen it
- [ ] Search the trademark register for "Stuti" in the relevant classes — and search
      for Sadhaka's own filings while there
- [ ] Reserve the app name in App Store Connect when the first build is submitted;
      Apple holds names first-come from submission, not before
- [ ] Register the obvious variants
- [ ] Take the handle on every platform you might use
- [ ] Verify `stutiapp.com` is yours — `SUPPORT` in `stuti-app/src/stuti-build.ts` already
      promises `feedback@stutiapp.com` and a three-day reply
- [x] Check each bundled typeface for web-embedding rights, and each library's
      licence — done 27 Oct 2026 (S83), by reading each font's own name table
      rather than trusting the file names. **Two fonts carry no licence and have
      been taken out of the build**: `SangamSans` has no copyright, licence,
      vendor or designer in it at all, and `KanakaDurga` carries
      "This font is copyright of Purushoth Kumar Guthula" (telugufonts.in, 2017)
      with no grant of any kind. `tools/codemod/fix-font-licence.mjs` removes both
      `@font-face` blocks and strips the families from every token — the
      declaration, not the token, is what puts a font file in the bundle.
      KanakaDurga was named by no token. SangamSans led `--font-telugu-serif`,
      which now falls to Tiro Telugu: bundled, OFL, and drawn for the job. The
      files stay in `src/fonts/`, so a licence found later undoes this in one step.
      Everything else is clean — OFL for every other face, MIT for React,
      Capacitor, supabase-js and Vite, Apache 2.0 for Vosk
- [x] One attributions page in the app — `public/legal/attributions.html`,
      written 27 Oct 2026 (S83) and linked from Settings. It also discharges two
      attribution licences the app was quietly in breach of: GeoNames place data
      (CC BY 4.0) and the OpenStreetMap temple index (ODbL)

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

- [x] **Mended 27 Oct 2026 (S83).** The keep sheet now reads the diagnostics
      switch: with it off the old promise stands, and with it on it says a copy
      goes to the makers and names the switch to turn that off. The flag is
      `relaySending` in `stuti-relay.ts`; `stuti-follow.tsx` is mirrored, so the
      new wording and a `relaySending: () => false` stub have gone to the
      designer's prototype through `mirror-to-design.mjs`. The old description
      follows. The Follow screen says "Nothing is uploaded" while recording, and on a beta
      build that is not true: when Follow stops, the session's audio goes to the
      makers' Drive folder. The relay switch is on by default for beta and off for
      release, so setting the channel to release mends it — but the line is still
      wrong for anyone who turns the switch on. Either condition the line or stop
      the audio travelling while it is shown. `stuti-follow.tsx` mirrors back to the
      designer's project, so the new wording goes to her (found 25 Oct 2026, S61)

- [x] Build stamp matches the changelog (0.9.107 / 2026.10.03, S64), and
      `release-apk.sh` now refuses to build when they disagree
- [ ] `GATE = "matsya"` — set to null for a public build
- [ ] `CHANNEL = "beta"` — move to `release`
- [ ] Keep the beta latch's grandfather clause in `main.tsx` for devices that finished
      onboarding before the gate existed
- [x] The Drive relay works again, and should stop dying (25 Oct 2026, S61). The
      cause was never the token: the relay asked for the whole-Drive scope, which
      Google calls restricted, which kept the consent screen in Testing mode, which
      expires a refresh token every seven days. Now on `drive.file` with the consent
      screen published. The narrow scope still writes into the original folder, so
      nothing moved. `tools/relay-selftest.mjs` covers the folder handling
- [x] Stuti-v55.apk published to Drive (25 Oct 2026) — the first build carrying real
      accounts, and the first with the pitṛ register kept off the server
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

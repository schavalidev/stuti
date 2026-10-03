# The server side — accounts, sync, corrections, counters, giving

Everything is built and ships switched off. Filling in
`src/stuti-cloud-config.ts` switches it on; until then every screen reads as
the beta does today. Nothing here needs a server of our own: Supabase holds
accounts and data behind row-level security, the Netlify relay carries
feedback, and Razorpay's Payment Buttons take the money.

## 1. Supabase project (one time, ~15 minutes)

1. Create a project at supabase.com (region: Mumbai, `ap-south-1`).
2. SQL Editor → paste `stuti-app/supabase/schema.sql` → Run. It is safe to run again.
3. Project Settings → API: copy the **Project URL** and the **anon / publishable key**
   into `src/stuti-cloud-config.ts`. Both are public by design. Never put the
   `service_role` key anywhere in the app.
4. Authentication → URL Configuration:
   - Site URL: `https://stuti-app.netlify.app`
   - Redirect URLs: `https://stuti-app.netlify.app/**`, `http://localhost:4173/**`, `com.stuti.app://auth-callback`
5. Authentication → Email templates → "Magic Link": make the body show the code,
   `{{ .Token }}`, since the app asks for the six digits, not a link.
   The built-in mailer sends only a few mails an hour; before a public release set a
   custom SMTP server (Authentication → SMTP; Resend, Zoho or Amazon SES all work).
6. Providers — switch on what you want, then set the same in `providers` in the config:
   - **Email**: on by default.
   - **Phone**: needs an SMS provider (Twilio, MessageBird, Vonage or Textlocal).
     Indian numbers also need DLT registration with that provider.
   - **Google**: Google Cloud console → APIs & Services → Credentials → OAuth client
     (Web application), authorised redirect URI
     `https://<ref>.supabase.co/auth/v1/callback`; paste the client id and secret
     into Supabase → Providers → Google.

Then build, verify, commit. Existing beta data is kept: on a device's first
sign-in every key already on it is offered to the account, and a copy the
account already holds from another phone wins.

## 2. What syncs, and what never leaves the phone

Synced, one row per key in `stuti_kv` (list in `src/stuti-sync-hook.ts`):
favourites, reading positions, place, script, japa, plans, vows, the thread,
watch, keep, prefs, my tithis, pitṛ register, the lamp, reading settings.

Never sent: the flyleaf (name, gotra — the saṅkalpa panel promises this), the
session, device id, relay queue, beta latch, journal.

The cue record (`stuti_cue_prefs`, one row per device): place and time zone,
reading script, sandhyā reminders, quiet hours, digest hour, almanac settings,
vows (with the days each was kept), the memorisation plans and the japa counts,
and the push subscription once there is one. The plans and the japa are there
because they are what the cues about them are reckoned from — a plan's day and
a thread gone quiet are bells, and a server cannot ring what it cannot count.
No name, no gotra, no reading history, no favourites. (`STUTI_PUSH.record()` is the
exact payload.) The push sender does not read it: it is kept for a signed-in
reciter's other devices and for a server-side reckoning that was decided against
(section 7 says why).

### When two records differ

Practice keys (japa, thread, vows, plans, keep, favourites, ledger, pitṛ register,
my tithis, watch, lamp, `stuti-practice-*`) are never settled by clock. If a device's
first sign-in finds a different record on both sides, or a practice key changed on
both phones since they last agreed, sync stops in state `conflict` and the account
screen asks which to keep. The chosen side replaces the other whole. Settings keys
still take the newer stamp.

### Deleting an account

Settings → Account → Delete my account calls `stuti_delete_my_account()` (in
`schema.sql`), which removes the caller from `auth.users`; every table cascades.
The phone's own data is kept. Re-run `schema.sql` on an existing project to add it.

## 3. Correcting a verse without a release

Table Editor → `stuti_corrections` → Insert row:

| column | value |
|---|---|
| hymn | the hymn's id (e.g. `shiva-panchakshara`) or its exact title |
| n | the verse number as the text numbers it; for unnumbered hymns, its place counting from 1; `''` for `title`/`blurb` |
| s | section index, or empty |
| field | `deva`, `iast`, `en`, `tel`, … |
| old_text | the field exactly as it reads now |
| new_text | what it should read |
| published | tick when ready |

Every app picks it up at its next launch, and it keeps working offline after that.
A row applies only while the verse still reads `old_text`, so once the corpus
itself is fixed on the next design port the row stops doing anything and can be
deleted. Put the same fix in the source corpus too, or the row is the only record of it.

## 4. Counters

The design's twelve events (`STUTI_COUNT`) go to `stuti_events`: event, a few
enumerated facts, platform, build, the day. No device, user, IP or time of day.
Read them in the SQL editor: `select * from stuti_events_daily;`

## 5. Feedback

Send does two things at once, and either arriving counts as sent; the mail app
opens only when neither can be reached.

- **The relay** mails the message to the support address and writes
  `feedback-<device>-<time>-<kind>.txt` into the Drive folder beside the logs.
  Mail needs three Netlify environment variables: `RESEND_API_KEY` (resend.com,
  free tier), `STUTI_FEEDBACK_TO` (the support address) and `STUTI_FEEDBACK_FROM`
  (a sender on a domain verified in Resend; without it Resend's test sender is
  used, which only delivers to the Resend account's own address). The subject is
  the kind and the build. Relay changes go live with the next Netlify deploy.
- **The table** `stuti_feedback` gets a row when Supabase is configured. Anyone
  can add one; only accounts in `stuti_admins` can read them or change their status.

To review in the app: sign in, copy your user id from Authentication → Users,
then Table Editor → `stuti_admins` → insert a row with that `user_id`. The account
screen then shows a Feedback section with the inbox: New, Seen and Done, and
buttons to move each message between them.

## 6. Giving

Razorpay dashboard → Payment Pages → Payment Buttons → create one button per amount
(₹251, ₹1,100, ₹2,500, ₹5,001), each fixed at that amount. Paste each button id
(`pl_…`) into `STUTI_RAZORPAY_IDS` in `src/stuti-cloud-config.ts`. Razorpay enforces the amount and sends
the receipt; the app keeps no payment data. Receipts inside the app would need an
order/verify function holding the Razorpay secret, which is not built.

## 7. Bells that reach a closed browser (web push)

The phone already rings its cues with the app closed, because the OS holds them
(`src/stuti-notify.ts`). A browser has no alarm table, so on the web a server keeps
the minute instead. Nothing about *what* is due is reckoned there: the page walks
the week ahead with the same `STUTI_CUES` and words each bell with the same words
as the tab and the phone, seals every bell to this browser's own push keys
(`src/stuti-push-seal.ts`, RFC 8291), and lays the week in Supabase
(`stuti_push_lay`). The server holds an endpoint, a time and ciphertext: no
account, no place, no hymn, no name. Every thirty seconds the database checks
whether anything falls due and, only then, wakes `netlify/functions/push-send.mjs`,
which signs each request with the VAPID key and posts it. The week is laid again
whenever the app is opened or put away, or the reminders or place change, so a
browser that is never opened gets a week of bells and then stops — the same
honest limit the phone has.

Why the device reckons and not the server: the cues read the vows, plans, keeps,
the house's own tithis and the ledger, all of which live on the device. A server
running its own copy of the almanac from `stuti_cue_prefs` would ring bells the
page does not and miss ones it does.

The page stands its own timer down only after the server has accepted a week, and
the server accepts one only while the sender has run cleanly in the last twenty
minutes with the key the browser subscribed with. A missing key, a wrong key or a
stopped cron therefore leaves the page ringing its own bells, never silent.

Setup, once Supabase is in place (section 1):

1. `node stuti-app/tools/vapid-keys.mjs`. Paste the **public** key into `pushKey` in
   `src/stuti-cloud-config.ts`. Put the **private** key into Netlify → Site
   configuration → Environment variables as `STUTI_VAPID_PRIVATE`, and nowhere
   else. Make the pair once: replacing it later orphans every subscription until
   each browser is next opened.
2. Re-run `stuti-app/supabase/schema.sql` (it adds section 7), then run
   `stuti-app/supabase/push-cron.sql`. It needs the `pg_cron` and `pg_net`
   extensions, which it creates; if the editor refuses, switch both on under
   Database → Extensions and run it again.
3. Build, verify and deploy. The function goes out with the site.
4. Check, in the SQL editor, that the sender has reported in (within ten minutes):
   `select beat_at, beat_ok, note from public.stuti_push_sender;`
   `note` names what is wrong if `beat_ok` is false.

To test in a real browser: open the deployed site in Chrome, switch on a sandhyā
bell with a short lead, allow notifications, then run
`select due_at, outcome from stuti_push_queue order by due_at;` — the week should
be there, and `outcome` turns to `sent` as each falls due. Close the tab and wait
for the next one. `window.STUTI_WEB_PUSH.status()` in the console says how the last
lay went (`laid`, `asleep`, `refused`, `error`), and `.week()` shows the bells it
would send, in plain words.

`node stuti-app/tools/push-selftest.mjs` checks the sealing against RFC 8291's own
example, the VAPID signature, the sender against stand-in services, and the
service worker's handlers. It needs no accounts.

The sender holds no Supabase credential. It calls `stuti_push_claim` and
`stuti_push_done` with the public anon key and the secret the cron hands it, which
lives only in `stuti_push_sender`. To move it:
`update public.stuti_push_sender set url = 'https://<site>/.netlify/functions/push-send';`

## 8. Releasing

Verify the built bundle, then `tools/ship.sh`: it builds the signed APK once,
publishes it to Drive, and deploys that same `dist/` (and the functions) to Netlify.

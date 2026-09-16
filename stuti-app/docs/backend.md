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
sandhyā reminders, quiet hours, digest hour, almanac settings, vows. It is what
a push sender will read; there is no sender yet.

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

The sheet's Send posts to the relay, which writes `feedback-<device>-<time>-<kind>.txt`
into the Drive folder beside the logs. If the relay cannot be reached the mail app
opens, as before. The relay change deploys with the next Netlify deploy; until then
Send falls back to mail.

## 6. Giving

Razorpay dashboard → Payment Pages → Payment Buttons → create one button per amount
(₹251, ₹1,100, ₹2,500, ₹5,001), each fixed at that amount. Paste each button id
(`pl_…`) into `STUTI_RAZORPAY_IDS` in `src/stuti-cloud-config.ts`. Razorpay enforces the amount and sends
the receipt; the app keeps no payment data. Receipts inside the app would need an
order/verify function holding the Razorpay secret, which is not built.

## 7. Releasing

Verify the built bundle, then `tools/ship.sh`: it builds the signed APK once,
publishes it to Drive, and deploys that same `dist/` (and the functions) to Netlify.

# The log relay — setup

The app sends crash notes and Follow sessions to `netlify/functions/relay.mjs`,
which writes them into the **Stuti App** folder on Google Drive
(`https://drive.google.com/drive/folders/1msv7s9w0Q-MJJINiuVQDq-tnzmzWHKez`).
Until the site has a credential the function answers 503 and the app stays
quiet, so nothing breaks while this is unset.

Three environment variables on the Netlify site, set from the repo root with
the Netlify CLI (never paste the values into a chat, a commit, or this file):

| Variable | Value |
|---|---|
| `STUTI_DRIVE_FOLDER` | `1msv7s9w0Q-MJJINiuVQDq-tnzmzWHKez` |
| `STUTI_DRIVE_OAUTH` | `{"client_id":"…","client_secret":"…","refresh_token":"…"}` for the folder owner's Google account |
| `STUTI_DRIVE_SA` | alternative: a service-account key JSON, with the folder shared to its email as Editor |

Set exactly one of the last two. **Prefer the OAuth route**: files uploaded
by a service account are owned by the robot, and Google gives robots no
storage, so uploads into a personal My Drive folder can fail with a quota
error. Files uploaded with your own account's refresh token are yours.

## Getting the OAuth values (about ten minutes, your own Google account)

1. Google Cloud console → a project (any name) → **APIs & Services → Library**
   → enable **Google Drive API**.
2. **OAuth consent screen** (now "Google Auth Platform → Audience") →
   External → fill the app name and your email → under **Test users** add
   your own Google account, or the consent page answers "Access blocked". (Testing mode is fine; the
   refresh token for a test user lasts seven days *unless* the app is
   published — press **Publish app** on that screen, no verification is
   needed for a Drive scope you only use yourself.)
3. **Credentials → Create credentials → OAuth client ID → Web application**,
   add `https://developers.google.com/oauthplayground` as an authorised
   redirect URI. Note the client id and secret.
4. Open https://developers.google.com/oauthplayground → the gear icon → tick
   **Use your own OAuth credentials** and paste the id and secret — *before*
   pressing Authorize APIs, and check the redirect shown in the right pane
   carries your client id, not the playground's 407408718192.
   In step 1 type the scope `https://www.googleapis.com/auth/drive.file`
   — or `https://www.googleapis.com/auth/drive` if the folder is one you
   did not create in this app — authorise, then in step 2 press
   **Exchange authorization code for tokens** and copy the refresh token —
   the one the box shows *after* that press; a value left from an earlier
   attempt is the wrong token, and will fail as `unauthorized_client`.
5. From the repo root:

```bash
netlify env:set STUTI_DRIVE_FOLDER 1msv7s9w0Q-MJJINiuVQDq-tnzmzWHKez --site 3f9cdccf-4d91-463c-ae77-7fa0489e48d9
```

```bash
netlify env:set STUTI_DRIVE_OAUTH '{"client_id":"PASTE","client_secret":"PASTE","refresh_token":"PASTE"}' --site 3f9cdccf-4d91-463c-ae77-7fa0489e48d9
```

A function only sees the environment captured when it was deployed, so
redeploy after setting them (`netlify deploy --prod --build --site 3f9cdccf-4d91-463c-ae77-7fa0489e48d9 --skip-functions-cache`
from the repo root). Then check with:

```bash
curl -s -X POST https://stuti-app.netlify.app/.netlify/functions/relay -H 'Content-Type: application/json' -d '{"name":"note-setup-check.txt","text":"hello from setup"}'
```

A `{"id":…,"name":"note-setup-check.txt"}` reply means the file is in the folder.

If the reply is `token 401 unauthorized_client`, the refresh token was not
minted for this client id: in the playground the gear's **Use your own OAuth
credentials** must be ticked, with this client's id and secret pasted in,
*before* pressing Authorize APIs. A token minted with the playground's own
credentials belongs to Google's client, and this client cannot refresh it.
Redo step 4 with the box ticked, set the variable again, redeploy.

## What the app sends

- `crash-<device>-<time>.txt` — the page's error and stack, the last forty
  console warnings and errors, the build's diagnostics block, the last dozen
  counter events. At most three per launch.
- `follow-<device>-<time>-<hymn>.txt` — the Follow session log (what was
  heard, where the light went), after every session of eight seconds or
  more. On the phone the audio goes alongside as `.wav` when it is under
  12 MB (about six minutes); longer sessions send the log alone.
- `journal-<device>-<time>-<why>.txt` — the reciter's path through the app,
  one line per event with seconds since launch: each screen, each tapped
  control by its label, each of the counter's events, and every main-thread
  task over half a second (`slow 2314ms on calendar`). Flushed every ten
  minutes of use once twenty lines have gathered (`timer`), whenever the app
  goes to the background (`hide`), and at the next launch for what was left
  (`launch`). Never a typed word or a verse.
- `<device>` is a random eight-character id kept on the phone
  (`stuti-device` in localStorage). No name, no account, no text read.

Testers can turn it off in Settings → About → "Send diagnostics to the
makers" (`stuti-relay = "0"`). A dev server on localhost never sends, unless `stuti-relay-dev` is `"1"` in its localStorage.
When the network is away, text goes into a small queue (`stuti-relay-q`) and
leaves on the next launch or when the connection returns; audio is tried once.

Verified 8 Sep 2026: the text path (`note-setup-check.txt` landed in the folder) and the resumable audio path (a 2-second WAV via PUT, 200).

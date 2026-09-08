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
2. **OAuth consent screen** → External → fill the app name and your email →
   add your own Google account as a test user. (Testing mode is fine; the
   refresh token for a test user lasts seven days *unless* the app is
   published — press **Publish app** on that screen, no verification is
   needed for a Drive scope you only use yourself.)
3. **Credentials → Create credentials → OAuth client ID → Web application**,
   add `https://developers.google.com/oauthplayground` as an authorised
   redirect URI. Note the client id and secret.
4. Open https://developers.google.com/oauthplayground → the gear icon → tick
   **Use your own OAuth credentials** and paste the id and secret.
   In step 1 type the scope `https://www.googleapis.com/auth/drive.file`
   — or `https://www.googleapis.com/auth/drive` if the folder is one you
   did not create in this app — authorise, then in step 2 press
   **Exchange authorization code for tokens** and copy the refresh token.
5. From the repo root:

```bash
netlify env:set STUTI_DRIVE_FOLDER 1msv7s9w0Q-MJJINiuVQDq-tnzmzWHKez --site 3f9cdccf-4d91-463c-ae77-7fa0489e48d9
```

```bash
netlify env:set STUTI_DRIVE_OAUTH '{"client_id":"PASTE","client_secret":"PASTE","refresh_token":"PASTE"}' --site 3f9cdccf-4d91-463c-ae77-7fa0489e48d9
```

Functions read the environment at each invocation, so no redeploy is needed.
Check with:

```bash
curl -s -X POST https://stuti-app.netlify.app/.netlify/functions/relay -H 'Content-Type: application/json' -d '{"name":"note-setup-check.txt","text":"hello from setup"}'
```

A `{"id":…,"name":"note-setup-check.txt"}` reply means the file is in the folder.

## What the app sends

- `crash-<device>-<time>.txt` — the page's error and stack, the last forty
  console warnings and errors, the build's diagnostics block, the last dozen
  counter events. At most three per launch.
- `follow-<device>-<time>-<hymn>.txt` — the Follow session log (what was
  heard, where the light went), after every session of eight seconds or
  more. On the phone the audio goes alongside as `.wav` when it is under
  12 MB (about six minutes); longer sessions send the log alone.
- `<device>` is a random eight-character id kept on the phone
  (`stuti-device` in localStorage). No name, no account, no text read.

Testers can turn it off in Settings → About → "Send diagnostics to the
makers" (`stuti-relay = "0"`). A dev server on localhost never sends.
When the network is away, text goes into a small queue (`stuti-relay-q`) and
leaves on the next launch or when the connection returns; audio is tried once.

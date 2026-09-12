#!/usr/bin/env bash
# Publish a signed build into the makers' "Stuti App" Drive folder — the same
# folder the testers' logs arrive in, so a tester installs the build from
# where they already look.
#
#   tools/publish-apk.sh builds/Stuti-v44.apk
#
# The bytes do not go through Netlify: the relay is asked for one of Google's
# resumable upload sessions and the file is PUT straight to Google, which is
# why a 32 MB APK gets through a function whose own request limit is far
# smaller. The credential stays in Netlify's environment; nothing here signs
# into anything. The relay only accepts the name shape Stuti-v<N>.apk.
set -euo pipefail

APK="${1:-}"
RELAY="${STUTI_RELAY:-https://stuti-app.netlify.app/.netlify/functions/relay}"
[ -n "$APK" ] || { echo "usage: $0 <path to Stuti-vNN.apk>" >&2; exit 2; }
[ -f "$APK" ] || { echo "no such file: $APK" >&2; exit 2; }

NAME="$(basename "$APK")"
case "$NAME" in
  Stuti-v[0-9]*.apk) ;;
  *) echo "the relay only takes Stuti-v<N>.apk; got $NAME" >&2; exit 2 ;;
esac
SIZE="$(stat -f%z "$APK" 2>/dev/null || stat -c%s "$APK")"
MIME="application/vnd.android.package-archive"

echo "asking the relay for an upload session for $NAME ($SIZE bytes)…"
SESSION="$(curl -sS -X POST "$RELAY" -H 'Content-Type: application/json' \
  -d "{\"name\":\"$NAME\",\"mime\":\"$MIME\",\"size\":$SIZE,\"resumable\":true}")"
URL="$(printf '%s' "$SESSION" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("url",""))' 2>/dev/null || true)"
[ -n "$URL" ] || { echo "relay refused: $SESSION" >&2; exit 1; }

echo "uploading to Google…"
CODE="$(curl -sS -X PUT "$URL" -H "Content-Type: $MIME" --data-binary @"$APK" -o /tmp/publish-apk.json -w '%{http_code}')"
[ "$CODE" = "200" ] || [ "$CODE" = "201" ] || { echo "upload failed (HTTP $CODE): $(cat /tmp/publish-apk.json)" >&2; exit 1; }

python3 - "$SIZE" <<'PY'
import json, sys
want = int(sys.argv[1])
d = json.load(open("/tmp/publish-apk.json"))
got = int(d.get("size") or 0)
print(f"published {d.get('name')}  ({got or want} bytes)")
if got and got != want:
    sys.exit(f"SIZE MISMATCH: sent {want}, Drive holds {got}")
PY

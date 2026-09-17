#!/usr/bin/env bash
# Build a signed APK and put it in the makers' "Stuti App" Drive folder, in
# one command.
#
#   tools/release-apk.sh              # build, show what it will publish, ask
#   tools/release-apk.sh --yes        # no question (for a scripted ship)
#   tools/release-apk.sh --dry-run    # build and name it, upload nothing
#   tools/release-apk.sh --init 44    # one-time: say what the last build was
#
# WHY THIS IS ONE COMMAND AND NOT A BUILD HOOK
# Publishing is batched on purpose: an APK is ~32 MB and every publish costs
# every tester a re-download. CLAUDE.md says to ask and publish only on a yes.
# So nothing here runs by itself — running it *is* the yes. What it removes is
# the toil between a build and a publish (the copy, the rename, the number),
# not the decision to publish.
#
# THE BUILD NUMBER
# ../build-number holds one integer: the last build published. The Drive
# folder cannot be listed — the relay is upload-only and takes no credential —
# so nothing else knows what the last number was, which is why it is tracked
# in the repo. android/app/build.gradle reads the same file for versionCode,
# so the number in the APK's name and the number inside it are one number.
#
# The number is bumped *before* Gradle runs, because versionCode is baked into
# the APK. If a publish then fails, the number is not given back: a gap in the
# sequence is harmless, while reusing a number would put two different builds
# into the world calling themselves the same thing.
set -euo pipefail

cd "$(dirname "$0")/.."                    # stuti-app/
ROOT="$(pwd)"
NUMFILE="$ROOT/build-number"
BUILDS="$ROOT/../builds"
APK_OUT="$ROOT/android/app/build/outputs/apk/release/app-release.apk"

DRY=""; YES=""
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY=1; shift ;;
    --yes|-y)  YES=1; shift ;;
    --init)
      [ $# -ge 2 ] || { echo "usage: $0 --init <N>" >&2; exit 2; }
      case "$2" in ''|*[!0-9]*) echo "--init needs a plain integer; got '$2'" >&2; exit 2 ;; esac
      printf '%s\n' "$2" > "$NUMFILE"
      echo "build-number set to $2 — the next build will be Stuti-v$(( $2 + 1 )).apk"
      exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

say() { printf '\n=== %s\n' "$1"; }

# ---- preflight: everything that can be known before a long build ----
say "preflight"

[ -f "$NUMFILE" ] || { echo "no build-number at $NUMFILE" >&2; exit 1; }
CUR="$(tr -d '[:space:]' < "$NUMFILE")"
case "$CUR" in ''|*[!0-9]*) echo "build-number holds '$CUR', expected one integer" >&2; exit 1 ;; esac

if [ "$CUR" = "0" ]; then
  cat >&2 <<'MSG'
build-number is still 0, which means nobody has said what the last build was.
Publishing now could reissue a number that is already in Drive, so this stops.

Open the "Stuti App" Drive folder, find the highest Stuti-v<N>.apk, then:

    tools/release-apk.sh --init <N>

and run this again. --init records the LAST build, so the next one is N+1:
--init 43 makes the next build v44. If the folder holds no APK at all, pick
whatever starting point you want.
MSG
  exit 1
fi

KEYSTORE_PROPS="$ROOT/android/keystore.properties"
if [ ! -f "$KEYSTORE_PROPS" ]; then
  cat >&2 <<MSG
no $KEYSTORE_PROPS, so Gradle would produce an unsigned release.

Both the keystore and this file are gitignored on purpose and are not in the
repo. Restore them from your private backup before publishing: a build signed
with a different key cannot be installed over an existing Stuti without
uninstalling first, which loses the reciter's saved practice.
MSG
  exit 1
fi

command -v node >/dev/null || { echo "node not on PATH" >&2; exit 1; }
# shellcheck source=/dev/null
. "$ROOT/tools/android-env.sh"
command -v java >/dev/null || { echo "java not on PATH after android-env.sh" >&2; exit 1; }

NEXT=$(( CUR + 1 ))
NAME="Stuti-v${NEXT}.apk"
echo "last published: v${CUR}"
echo "building:       ${NAME}"
[ -n "$DRY" ] && echo "mode:           dry run (nothing will be uploaded)"

# ---- the number goes in before the build, so versionCode matches the name ----
printf '%s\n' "$NEXT" > "$NUMFILE"

# ---- build ----
say "web build"
npm run build

say "capacitor sync"
npx cap sync android

say "gradle assembleRelease"
( cd android && ./gradlew assembleRelease )

[ -f "$APK_OUT" ] || { echo "gradle did not produce $APK_OUT" >&2; exit 1; }

# ---- name it the one name the relay accepts ----
mkdir -p "$BUILDS"
cp "$APK_OUT" "$BUILDS/$NAME"
SIZE="$(stat -f%z "$BUILDS/$NAME" 2>/dev/null || stat -c%s "$BUILDS/$NAME")"
MB=$(( SIZE / 1024 / 1024 ))

# a release must be signed; an unsigned one installs nowhere
say "checking the signature"
APKSIGNER="$(ls -1 "$ANDROID_HOME"/build-tools/*/apksigner 2>/dev/null | sort -V | tail -1 || true)"
[ -n "$APKSIGNER" ] || { echo "no apksigner under $ANDROID_HOME/build-tools" >&2; exit 1; }
if "$APKSIGNER" verify "$BUILDS/$NAME" >/dev/null 2>&1; then
  echo "signed: yes"
else
  echo "this APK is not signed — refusing to publish it" >&2
  exit 1
fi

say "built"
echo "  $BUILDS/$NAME"
echo "  ${MB} MB, versionCode ${NEXT}"

if [ -n "$DRY" ]; then
  echo
  echo "dry run: stopping here. Publish it with"
  echo "  tools/publish-apk.sh ../builds/$NAME"
  exit 0
fi

# ---- ask, then publish ----
if [ -z "$YES" ]; then
  echo
  printf 'Publish %s (%s MB) to the makers’ Drive folder? [y/N] ' "$NAME" "$MB"
  read -r reply
  case "$reply" in
    y|Y|yes|YES) ;;
    *) echo "not published. The APK is at $BUILDS/$NAME when you want it."; exit 0 ;;
  esac
fi

say "publishing"
"$ROOT/tools/publish-apk.sh" "$BUILDS/$NAME"

say "done"
echo "$NAME is in the Drive folder, beside the testers' logs."
echo "build-number is now $NEXT."

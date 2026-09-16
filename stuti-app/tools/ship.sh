#!/usr/bin/env bash
# Publish everything at once, the way CLAUDE.md asks for when the answer is yes:
# the signed APK to the makers' Drive folder, then the web app and the Netlify
# functions from the very same dist/ the APK was built from.
#
#   tools/ship.sh            # asks once before anything leaves the machine
#   tools/ship.sh --yes      # no question
#
# Before running: verify the built bundle in the browser (the stuti-built entry
# in .claude/launch.json). This script builds once, inside release-apk.sh, and
# deploys that build — never a second one.
set -euo pipefail
cd "$(dirname "$0")/.."
YES=""; [ "${1:-}" = "--yes" ] || [ "${1:-}" = "-y" ] && YES=1

if [ -z "$YES" ]; then
  printf 'Publish the APK to Drive and deploy the web app to Netlify? [y/N] '
  read -r reply
  case "$reply" in y|Y|yes|YES) ;; *) echo "nothing published."; exit 0 ;; esac
fi

tools/release-apk.sh --yes

echo
echo "=== netlify deploy (the dist/ the APK was just built from)"
cd ..
npx netlify deploy --prod --dir=stuti-app/dist --site 3f9cdccf-4d91-463c-ae77-7fa0489e48d9
echo
echo "shipped: APK v$(tr -d '[:space:]' < stuti-app/build-number) and the web app."

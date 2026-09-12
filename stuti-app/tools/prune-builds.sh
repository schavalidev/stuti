#!/usr/bin/env bash
# Keep builds/ from becoming an archive of every build ever made.
#
#   tools/prune-builds.sh            # prune, saying what goes
#   tools/prune-builds.sh --dry-run  # say what would go, touch nothing
#   KEEP=4 tools/prune-builds.sh     # keep more than the usual two
#
# What it keeps, and why:
#   · the newest KEEP signed APKs (default 2) — the current build and one to
#     roll back to. Everything published is also in the Drive folder.
#   · every follow-*.wav in builds/ — these are the real chanting sessions the
#     Follow engine is tuned and regression-tested against, and they are the
#     only copies. They are small, they are not builds, and they are not
#     rubbish; nothing here touches them.
#   · every relayed log. The journals are kilobytes and they are the record of
#     what testers actually did.
# What it removes: APKs beyond the newest KEEP, wherever they have collected,
# including the ones that ended up inside builds/relay/ when logs were pulled.
#
# builds/ is gitignored, so nothing here is recoverable from the repo — which
# is why it only ever removes APKs, and only ones it can see are superseded.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/../.." && pwd)"
BUILDS="$HERE/builds"
KEEP="${KEEP:-2}"
DRY=""
[ "${1:-}" = "--dry-run" ] && DRY=1

[ -d "$BUILDS" ] || { echo "no builds/ at $BUILDS"; exit 0; }

# newest by version number, not by mtime: a rebuilt old APK is still old.
# Written for the bash macOS ships (3.2), which has no mapfile and no
# negative array slicing.
APKS=""
while IFS= read -r n; do [ -n "$n" ] && APKS="$APKS $n"; done < <(
  find "$BUILDS" -name 'Stuti-v*.apk' -exec basename {} \; \
    | sed -E 's/^Stuti-v([0-9]+)\.apk$/\1 &/' | sort -rn | awk '!seen[$2]++ {print $2}')
set -- $APKS
total=$#

if [ "$total" -le "$KEEP" ]; then
  echo "builds: $total APK(s), keeping $KEEP — nothing to prune"
else
  keptnames=""; i=0; doomed=""
  for n in "$@"; do
    i=$((i + 1))
    if [ "$i" -le "$KEEP" ]; then keptnames="$keptnames $n"; else doomed="$doomed $n"; fi
  done
  echo "builds: $total APKs, keeping the newest $KEEP ($(echo $keptnames))"
  freed=0
  for name in $doomed; do
    # the same version may sit in builds/ and in builds/relay/
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      sz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
      freed=$((freed + sz))
      if [ -n "$DRY" ]; then echo "   would remove ${f#$HERE/}"; else rm -f "$f"; echo "   removed ${f#$HERE/}"; fi
    done < <(find "$BUILDS" -name "$name")
  done
  echo "   $(( freed / 1024 / 1024 )) MB $([ -n "$DRY" ] && echo "would be freed" || echo freed)"
fi

# Anything else APK-shaped that collected under builds/ — old names, copies
# pulled down with logs — is a build too, and the rule above has already
# spared the ones worth keeping.
while IFS= read -r f; do
  [ -n "$f" ] || continue
  sz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [ -n "$DRY" ]; then echo "   would remove stray $(basename "$f") ($(( sz / 1024 / 1024 )) MB)"
  else rm -f "$f"; echo "   removed stray $(basename "$f") ($(( sz / 1024 / 1024 )) MB)"; fi
done < <(find "$BUILDS" -name '*.apk' ! -name 'Stuti-v*.apk')

echo "builds/ now $(du -sh "$BUILDS" | cut -f1)"

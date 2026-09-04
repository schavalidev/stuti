#!/usr/bin/env bash
# Has the designer pushed anything under design_handoff_stuti/ since src/
# was last ported? Compares origin/main against the design commit recorded
# by the last run-all.sh (tools/codemod/.ported-at).
#
# Exit 0: up to date. Exit 3: new design commits (listed). Anything else:
# the check itself failed (no remote yet, no network, ...).
set -euo pipefail
cd "$(dirname "$0")/../.."

git fetch -q origin main
LAST=$(cat stuti-app/tools/codemod/.ported-at 2>/dev/null || true)
RANGE="${LAST:+$LAST..}origin/main"

NEW=$(git log --format='%h %ad %s' --date=short "$RANGE" -- design_handoff_stuti/ | cat)
if [ -z "$NEW" ]; then
  echo "design: up to date with origin/main"
  exit 0
fi

echo "design: new commits under design_handoff_stuti/ since the last port:"
echo "$NEW"
echo
echo "files touched:"
git diff --stat "${LAST:-$(git rev-list --max-parents=0 origin/main)}" origin/main -- design_handoff_stuti/ | tail -20
echo
echo "to re-port: git pull && (cd stuti-app && ./tools/codemod/run-all.sh && npm run build)"
exit 3

#!/usr/bin/env bash
# Regenerates src/ from design_handoff_stuti/app/ end to end. Safe to rerun
# any time the prototype changes: every step is a deterministic script, no
# hand edits live only in src/. Nothing here deletes the src/ tree wholesale
# — transform.mjs overwrites the modules it owns and removes only those
# whose source file has gone (see manifest.json); everything hand-authored
# is restored by setup-entry.mjs from ./templates.
#
# Order matters. fix-name-collisions must precede fix-missing-imports: the
# .js/.jsx self-import collisions masked some "cannot find name" errors,
# and fix-missing-imports reads tsc's output for exactly those.
set -euo pipefail
cd "$(dirname "$0")"
node analyze.mjs
node transform.mjs
node fix-special-cases.mjs
node fix-names-round2.mjs
node fix-nitya-queue.mjs
node fix-alias-collisions.mjs
node fix-name-collisions.mjs
node fix-hand-patches.mjs
node setup-entry.mjs
node fix-missing-imports.mjs
echo "pipeline complete"

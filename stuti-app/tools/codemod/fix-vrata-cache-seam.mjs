#!/usr/bin/env node
/* ============================================================
   The upcoming days, remembered between launches.

   STUTI_VRATA.upcoming() resolves the next date of every vrata, janma
   clone and backlog row, and it finds each one by walking days forward
   through the ephemeris. Measured at launch: one synchronous block of
   1,472 ms on a laptop, 3,405 pañcāṅga days computed to draw one
   screen, and about three and a half seconds on a Pixel 9 — which is
   the `slow 3263ms on home` the device's own journal recorded, and the
   whole of the seven-second first launch a tester reported.

   The module already knows this; its own note says the answer is wanted
   once per civil day and costs three quarters of a second, and it keeps
   an in-memory cache keyed on a fingerprint of everything the answer
   depends on — the day, the list's length, the reckoning preferences,
   the house's own tithis field by field. What it cannot do is remember
   across launches, so every launch pays for it again.

   This gives that cache somewhere to live. The key is the module's own
   fingerprint, unchanged, so nothing about when the answer is still
   good is decided here: if anything that moves a date moves, the key
   moves and the day is computed afresh. Only the remembering is new.

   The hook is a global the design does not set (src/stuti-vrata-cache.ts
   installs it), so the prototype goes on computing exactly as before and
   this file stays runnable there.

   It is still computed once per civil day. Taking it off the first
   render as well is the next thing, and a separate one.
   ============================================================ */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { patcher } from "./seam-lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");
const SEAM = "fix-vrata-cache-seam";

const p = join(SRC, "stuti-vrata-data.ts");
const api = patcher(SEAM, readFileSync(p, "utf8"));

/* the module's own fingerprint, so the cache can be keyed on it from outside */
api.patch(
  `  return { vratas, byId, lookup, all, nextDate, daysAway, upcoming, inMonth, dayKey, today, kalaWindow, isParva, parvaNow, parvasNow, southern, lunarDay: lunar };`,
  `  return { vratas, byId, lookup, all, nextDate, daysAway, upFingerprint, upcoming, inMonth, dayKey, today, kalaWindow, isParva, parvaNow, parvasNow, southern, lunarDay: lunar };`,
  "upFingerprint on the public surface",
);

/* a restored list stands in for the walk; a computed one is handed over to be
   kept. Both go through a hook that is simply absent in the design. */
api.patch(
  `    const k = upFingerprint();\n    if (upCacheKey !== k) {\n      upCacheKey = k;\n      upCache = all().map((v) => {`,
  `    const k = upFingerprint();\n    if (upCacheKey !== k) {\n      upCacheKey = k;\n      /* kept from the last launch, under this very key (stuti-vrata-cache.ts) */\n      var KEPT = (typeof window !== "undefined" && window.STUTI_VRATA_CACHE) || null;\n      var restored = KEPT && KEPT.restore(k);\n      if (restored) { upCache = restored; return limit ? upCache.slice(0, limit) : upCache.slice(); }\n      upCache = all().map((v) => {`,
  "the restore",
);

api.patch(
  `        if (seenND.has(key)) return false; seenND.add(key); return true;\n      });\n    }\n    return limit ? upCache.slice(0, limit) : upCache.slice();`,
  `        if (seenND.has(key)) return false; seenND.add(key); return true;\n      });\n      if (KEPT) KEPT.save(k, upCache);\n    }\n    return limit ? upCache.slice(0, limit) : upCache.slice();`,
  "the save",
);

writeFileSync(p, api.text);
console.log(`vrata cache seam applied (${api.stats.applied} patch(es), ${api.stats.upstream} already upstream)`);

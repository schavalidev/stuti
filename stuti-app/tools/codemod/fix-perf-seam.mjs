// Why a tab felt slow: the press itself was instant, but Today and the
// calendar then spent seconds inside the vrata engine. Every vrata's `find`
// is an ephemeris search, and nothing remembered its answer — Today asked
// for the whole list five times per render (the parva card, the day's
// vratas, the preparations, the festive tint), the calendar once per month
// plus a pañcāṅga day for each cell. Two memos, both keyed on everything that
// can change an answer (the Settings prefs, the place, the personal tithis)
// and emptied the moment any of it moves. Literal anchors; a moved one fails.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
function patchFile(rel, edits) {
  const file = join(HERE, "../../src", rel);
  let t = readFileSync(file, "utf8");
  for (const [from, to, what] of edits) {
    if (!t.includes(from)) throw new Error(`fix-perf-seam: anchor not found in ${rel} — ${what}`);
    t = t.replace(from, to);
  }
  writeFileSync(file, t);
}

patchFile("stuti-vrata-data.ts", [
  [`  const byId = {};`,
`  /* ---- memo: a vrata's find(), remembered until its inputs change ---- */
  const FIND_CACHE = new Map<string, any>();
  let FIND_STAMP = "";
  const findStamp = () => {
    try { return JSON.stringify(STUTI_PREFS.get()) + "|" + STUTI_LOC.getLocId() + "|" + JSON.stringify(STUTI_LOC.getDetected()); }
    catch (e) { return ""; }
  };
  const memoFind = (v: any, extra = "") => {
    if (!v || v.__memoFind || typeof v.find !== "function") return v;
    const raw = v.find;
    v.find = function (...a: any[]) {
      const s = findStamp();
      if (s !== FIND_STAMP) { FIND_STAMP = s; FIND_CACHE.clear(); }
      const k = v.id + "|" + extra + "|" + a.join(",");
      if (FIND_CACHE.has(k)) { const c = FIND_CACHE.get(k); return c instanceof Date ? new Date(c) : c; }
      const r = raw.apply(v, a);
      FIND_CACHE.set(k, r instanceof Date ? new Date(r) : r);
      return r;
    };
    v.__memoFind = true;
    return v;
  };
  vratas.forEach((v) => memoFind(v));
  const byId = {};`, "the find memo, before the id index"],
  [`  const personal = () => { try { return STUTI_TITHIS ? STUTI_TITHIS.vratas() : []; } catch (e) { return []; } };`,
   `  const personal = () => { try { return STUTI_TITHIS ? STUTI_TITHIS.vratas().map((v) => memoFind(v, JSON.stringify(v, (k, x) => (typeof x === "function" ? undefined : x)))) : []; } catch (e) { return []; } };`,
   "personal tithis memoised by their own rule"],
]);

patchFile("stuti-panchanga-engine.ts", [
  [`import { ayanSys, reckoning } from "./stuti-reckoning";`,
   `import { ayanSys, reckoning } from "./stuti-reckoning";\nimport { STUTI_PREFS } from "./stuti-prefs";`, "prefs import for the day memo"],
  [`  function forDay(date, loc, opts) {`,
`  /* a civil day's pañcāṅga, remembered: the calendar asks for thirty of
     them per month and the engine takes tens of milliseconds for each. The
     instant form (the tithi prevailing right now) is never cached. */
  const DAY_CACHE = new Map<string, any>();
  let DAY_STAMP = "";
  function forDay(date, loc, opts) {
    if (opts && opts.instant) return forDayRaw(date, loc, opts);
    let stamp = "";
    try { stamp = JSON.stringify(STUTI_PREFS.get()); } catch (e) {}
    if (stamp !== DAY_STAMP) { DAY_STAMP = stamp; DAY_CACHE.clear(); }
    const k = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "|" + (loc && (loc.id || loc.lat + "," + loc.lon + "," + loc.tz)) + "|" + JSON.stringify(opts || null);
    const hit = DAY_CACHE.get(k);
    if (hit) return hit;
    const r = forDayRaw(date, loc, opts);
    if (DAY_CACHE.size > 1200) DAY_CACHE.clear();
    DAY_CACHE.set(k, r);
    return r;
  }
  function forDayRaw(date, loc, opts) {`, "the day memo wrapping forDay"],
]);
console.log("perf seam applied");

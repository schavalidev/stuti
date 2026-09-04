import { STUTI_NOMU } from "./stuti-nomu-data";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { STUTI_THREAD } from "./stuti-sadhana";
import { STUTI_LOC } from "./stuti-store";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — what the house is keeping (plain JS, loads before React)
   STUTI_KEEP: the nomulu and vratālu a reciter has rung the bell on.
   A vrata already knows its date; the store only remembers how much
   warning was asked for. A nomu does not — its cadence is read off
   its "when" line: a daily one (Gaḍapa Gaurī) becomes a day-tick
   with a year's progress; anything else is kept in a month the
   reciter names, and nudged as that month opens and as it closes.
   Marking a nomu kept turns its udyāpana into the last thing owed.
   ============================================================ */
export const STUTI_KEEP = (function () {
  const KEY = "stuti-keep"; let list;
  const load = () => { let l; try { l = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { l = []; } return Array.isArray(l) ? l : []; };
  list = load();
  const subs = new Set();
  /* two open views of the app (a second tab, a preview) each hold their own
     copy; re-reading before every write, and on the storage event, keeps one
     from writing the other's kept nomulu away */
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} subs.forEach((fn) => fn()); };
  window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === null) { list = load(); subs.forEach((fn) => fn()); } });
  const fresh = () => { list = load(); };
  const DAY = 86400000, YEAR = 365, DEFAULT_LEAD = 3;
  const dkey = (d) => { const x = d || new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const noon = (d) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };

  /* the one classifier for a nomu's "when" line — the lens's filter chips
     and the bell read the same answer */
  const NOMU_CADENCE = [
    { key: "daily", labelKey: "nomuCadDaily", test: (t) => /daily|each day|every day/.test(t) },
    { key: "multiyear", labelKey: "nomuCadMultiyear", test: (t) => /(five|six|nine|sixteen|twenty|ten|\d{2,})\s+years|years from the first year/.test(t) },
    { key: "annual", labelKey: "nomuCadAnnual", test: (t) => /year/.test(t) && !/day/.test(t) },
    { key: "fixed", labelKey: "nomuCadFixed", test: (t) => /\d+\s+days|nine days|thirty days/.test(t) },
    { key: "occasion", labelKey: "nomuCadOccasion", test: (t) => /eclipse|nakshatram|purnima|amavasya|tadiya|saptami|any time in/.test(t) },
  ];
  function nomuCadence(n) {
    const t = ((n && n.when && n.when.roman) || "").toLowerCase();
    if (!t) return "unspecified";
    for (const c of NOMU_CADENCE) if (c.test(t)) return c.key;
    return "unspecified";
  }
  /* what the bell does with it: a daily nomu ticks; every other nomu is
     kept in a month; a vrata is watched for */
  const modeFor = (kind, ref) => kind === "vrata" ? "vrata" : nomuCadence(STUTI_NOMU && STUTI_NOMU.get(ref)) === "daily" ? "daily" : "month";

  const find = (kind, ref) => list.find((k) => k.kind === kind && k.ref === ref) || null;
  const byId = (id) => list.find((k) => k.id === id) || null;

  function add(kind, ref, opts) {
    fresh();
    if (find(kind, ref)) return find(kind, ref);
    const rec = Object.assign({ id: "k" + Date.now(), kind, ref, mode: modeFor(kind, ref), lead: DEFAULT_LEAD, masa: null, start: dkey(), ticks: [], kept: false, keptOn: null, udyapanaDone: false }, opts || {});
    list = list.concat([rec]); save(); return rec;
  }
  const remove = (id) => { fresh(); list = list.filter((k) => k.id !== id); save(); };
  const patch = (id, p) => { fresh(); const k = byId(id); if (!k) return; Object.assign(k, p); save(); };
  function tick(id, key) {
    fresh();
    const k = byId(id); if (!k) return;
    const d = key || dkey();
    if (d > dkey()) return;
    k.ticks = k.ticks.indexOf(d) >= 0 ? k.ticks.filter((x) => x !== d) : k.ticks.concat([d]);
    if (k.ticks.indexOf(d) >= 0) { try { STUTI_THREAD.mark("p", "keep:" + id + ":" + d); } catch (e) {} }
    if (k.ticks.length >= YEAR) k.kept = true, k.keptOn = d;
    save();
  }
  function markKept(id, on) {
    fresh();
    const k = byId(id); if (!k) return;
    k.kept = on !== false; k.keptOn = k.kept ? dkey() : null;
    if (k.kept) { try { STUTI_THREAD.mark("p", "keep:" + id + ":" + k.keptOn); } catch (e) {} }
    save();
  }

  /* the nomu's and vrata's own records, resolved */
  const subject = (k) => k.kind === "vrata" ? (STUTI_VRATA && STUTI_VRATA.byId[k.ref]) : (STUTI_NOMU && STUTI_NOMU.get(k.ref));
  const hasUdyapana = (k) => { const n = k.kind === "nomu" && subject(k); return !!(n && n.udyapana && (n.udyapana.roman || n.udyapana.tel)); };

  /* ---- what one record asks of one day — pure, given the engines ----
     Returns null when nothing is owed, else { state, done, remind }.
     `remind` is whether the day's digest should name it; the in-app list
     shows everything owed regardless. */
  function dueOn(k, day, eng) {
    const d = noon(day), key = dkey(d);
    if (k.kept) {
      if (k.kind !== "nomu" || k.udyapanaDone || !hasUdyapana(k)) return null;
      const since = Math.round((d - noon(new Date(k.keptOn + "T12:00:00"))) / DAY);
      if (since < 1) return null;
      return { state: "udyapana", done: false, remind: since % 7 === 1 };
    }
    if (k.mode === "daily") return { state: "daily", done: k.ticks.indexOf(key) >= 0, remind: true, n: k.ticks.length };
    if (k.mode === "month") {
      if (k.masa == null || !eng.panchanga || !eng.place) return null;
      let pa; try { pa = eng.panchanga.forDay(d, eng.place); } catch (e) { return null; }
      if (pa.masaIdx !== k.masa || pa.masaAdhika) return null;
      /* the month's first day, and its last `lead` days */
      let first = false, closing = false;
      try {
        const y = eng.panchanga.forDay(new Date(d - DAY), eng.place); first = y.masaIdx !== k.masa || !!y.masaAdhika;
        const z = eng.panchanga.forDay(new Date(d.getTime() + k.lead * DAY), eng.place); closing = z.masaIdx !== k.masa;
      } catch (e) {}
      return { state: "month", done: false, remind: first || closing };
    }
    if (k.mode === "vrata") {
      const V = eng.vrata, v = V && V.byId[k.ref]; if (!v) return null;
      let nd; try { nd = V.nextDate(v, d); } catch (e) { return null; }
      if (!nd) return null;
      const away = Math.round((noon(nd) - d) / DAY);
      if (away < 0 || away > k.lead) return null;
      return { state: "vrata", away, date: nd, done: k.keptOn === dkey(nd), remind: true };
    }
    return null;
  }
  /* a vrata is kept per occurrence, so "kept" for it is a date, not a flag */
  function keepVrataDay(id, date) { fresh(); const k = byId(id); if (!k) return; k.keptOn = dkey(date); try { STUTI_THREAD.mark("p", "keep:" + id + ":" + k.keptOn); } catch (e) {} save(); }

  const engines = () => {
    const PA = AKSHARA_PANCHANGA, LOC = STUTI_LOC; let place = null;
    if (PA && LOC) { const id = LOC.getLocId && LOC.getLocId(), det = LOC.getDetected && LOC.getDetected(); place = (id === "detected" && det) ? det : (PA.locations.find((l) => l.id === id) || PA.locations[0]); }
    return { panchanga: PA, place, vrata: STUTI_VRATA };
  };

  return {
    YEAR, DEFAULT_LEAD, NOMU_CADENCE, nomuCadence, modeFor, dkey,
    list: () => list.slice(), find, byId, subject, hasUdyapana,
    add, remove, patch, tick, markKept, keepVrataDay,
    setLead: (id, n) => patch(id, { lead: Math.max(0, n | 0) }),
    setMasa: (id, idx) => patch(id, { masa: idx }),
    markUdyapana: (id) => patch(id, { udyapanaDone: true }),
    /* start the nomu over — the ticks, the kept mark and the udyāpana all clear; the māsa stays */
    reset: (id) => patch(id, { ticks: [], kept: false, keptOn: null, udyapanaDone: false, start: dkey() }),
    dueOn, engines,
    dueToday: (k) => dueOn(k, new Date(), engines()),
    leadFor: (vrataId) => { const k = find("vrata", vrataId); return k ? k.lead : DEFAULT_LEAD; },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

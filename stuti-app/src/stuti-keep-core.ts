import { STUTI_NOMU } from "./stuti-nomu-data";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { STUTI_THREAD } from "./stuti-sadhana";
import { STUTI_LOC } from "./stuti-store";
import { STUTI_TARPANA } from "./stuti-tarpana";
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
     kept in a month; a vrata is watched for — unless it is bound to no
     month (a Sapta Śanivāra, a Satyanārāyaṇa), when it too is kept in a
     month of the reader's choosing */
  /* a vow kept a set number of times — twenty-one days, seven Saturdays,
     forty-one days of a dīkṣā — is begun on a day the reader names and counted
     from it. `days` counts every day; `count` with `weekly` counts one weekday. */
  const vrataRec = (ref) => { const V = STUTI_VRATA; return V && (V.lookup ? V.lookup(ref) : V.byId[ref]); };
  const spanOf = (v) => v && ((v.days > 1 && (v.type === "cycle" || v.type === "diksha")) || (v.count > 1 && v.weekly != null)) ? { total: v.count || v.days, weekly: v.count ? v.weekly : null } : null;
  const isSpan = (ref) => !!spanOf(vrataRec(ref));
  const vrataFloats = (ref) => { const V = STUTI_VRATA, v = V && (V.lookup ? V.lookup(ref) : V.byId[ref]); return !!(v && (v.floating || v.optional)); };
  const modeFor = (kind, ref) => kind === "tarpana" ? "tarpana" : kind === "vrata" ? (isSpan(ref) ? "span" : vrataFloats(ref) ? "month" : "vrata") : nomuCadence(STUTI_NOMU && STUTI_NOMU.get(ref)) === "daily" ? "daily" : "month";

  const find = (kind, ref) => list.find((k) => k.kind === kind && k.ref === ref) || null;
  const byId = (id) => list.find((k) => k.id === id) || null;

  function add(kind, ref, opts) {
    fresh();
    if (find(kind, ref)) return find(kind, ref);
    const mode = modeFor(kind, ref);
    const rec = Object.assign({ id: "k" + Date.now(), kind, ref, mode, lead: DEFAULT_LEAD, masa: null, start: mode === "span" ? spanDefaultStart(ref) : dkey(), ticks: [], kept: false, keptOn: null, udyapanaDone: false }, opts || {});
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
    if (k.mode === "span") { const s = spanState(k, new Date(d + "T12:00:00")); if (s && s.n >= s.total && k.ticks.indexOf(d) >= 0) k.kept = true, k.keptOn = d; }
    else if (k.ticks.length >= YEAR) k.kept = true, k.keptOn = d;
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
  /* a śrāddha group resolves to its own record in the tarpaṇa classification,
     so the Sādhana list can name what is being watched */
  function tarpanaGroup(ref) {
    const TP = STUTI_TARPANA; if (!TP) return null;
    const y = new Date().getFullYear();
    try {
      const g = (TP.shannavati(y) || []).concat(TP.yogaDays ? (TP.yogaDays(y) || []) : []);
      return g.find((x) => x.id === ref) || null;
    } catch (e) { return null; }
  }
  const subject = (k) => k.kind === "tarpana" ? tarpanaGroup(k.ref) : k.kind === "vrata" ? (STUTI_VRATA && (STUTI_VRATA.lookup ? STUTI_VRATA.lookup(k.ref) : STUTI_VRATA.byId[k.ref])) : (STUTI_NOMU && STUTI_NOMU.get(k.ref));
  const hasUdyapana = (k) => { const n = subject(k); if (!n) return false; if (k.kind === "vrata") return k.mode === "span" && n.udyapana === true; return !!(n.udyapana && (n.udyapana.roman || n.udyapana.tel)); };

  /* where a span stands on a day: which occurrence, of how many, and its end */
  function spanState(k, day) {
    const v = vrataRec(k.ref), sp = spanOf(v); if (!sp || !k.start) return null;
    const d = noon(day || new Date()), s0 = noon(new Date(k.start + "T12:00:00"));
    const step = sp.weekly != null ? 7 : 1;
    const end = new Date(s0.getTime() + (sp.total - 1) * step * DAY);
    const diff = Math.round((d - s0) / DAY);
    const n = diff < 0 ? 0 : Math.floor(diff / step) + 1;
    const owed = diff >= 0 && n <= sp.total && diff % step === 0;
    return { total: sp.total, weekly: sp.weekly, start: s0, end, n: Math.min(n, sp.total), before: diff < 0, over: n > sp.total, owed, away: diff < 0 ? -diff : 0 };
  }
  const spanDefaultStart = (ref) => {
    const V = STUTI_VRATA, v = vrataRec(ref), sp = spanOf(v); if (!sp) return dkey();
    const t = noon(new Date());
    if (sp.weekly != null) { const d = new Date(t); while (d.getDay() !== sp.weekly) d.setDate(d.getDate() + 1); return dkey(d); }
    if (v.floating) return dkey(t);
    try { const nd = V.nextDate(v); if (nd) { const s = new Date(noon(nd).getTime() - ((v.lead || 0)) * DAY); return dkey(s); } } catch (e) {}
    return dkey(t);
  };

  /* ---- what one record asks of one day — pure, given the engines ----
     Returns null when nothing is owed, else { state, done, remind }.
     `remind` is whether the day's digest should name it; the in-app list
     shows everything owed regardless. */
  function dueOn(k, day, eng) {
    const d = noon(day), key = dkey(d);
    if (k.kept) {
      if (k.udyapanaDone || !hasUdyapana(k)) return null;
      const since = Math.round((d - noon(new Date(k.keptOn + "T12:00:00"))) / DAY);
      if (since < 1) return null;
      return { state: "udyapana", done: false, remind: since % 7 === 1 };
    }
    if (k.mode === "span") {
      const s = spanState(k, d); if (!s) return null;
      if (s.over) return null;
      if (s.before) return s.away <= k.lead ? { state: "vrata", away: s.away, date: s.start, done: false, remind: true } : null;
      if (!s.owed) return null;
      return { state: "span", done: k.ticks.indexOf(key) >= 0, remind: true, n: s.n, total: s.total, end: s.end };
    }
    if (k.mode === "daily") return { state: "daily", done: k.ticks.indexOf(key) >= 0, remind: true, n: k.ticks.length };
    if (k.mode === "month") {
      if (k.masa == null || !eng.panchanga || !eng.place) return null;
      let pa; try { pa = eng.panchanga.forDay(d, eng.place); } catch (e) { return null; }
      /* "any month this year" — owed all year; the nudge comes as each lunar month opens */
      if (k.masa === "any") {
        let first = false;
        try { const y = eng.panchanga.forDay(new Date(d - DAY), eng.place); first = y.masaIdx !== pa.masaIdx || !!y.masaAdhika !== !!pa.masaAdhika; } catch (e) {}
        return { state: "month", done: false, remind: first };
      }
      if (pa.masaIdx !== k.masa || pa.masaAdhika) return null;
      /* the month's first day, and its last `lead` days */
      let first = false, closing = false;
      try {
        const y = eng.panchanga.forDay(new Date(d - DAY), eng.place); first = y.masaIdx !== k.masa || !!y.masaAdhika;
        const z = eng.panchanga.forDay(new Date(d.getTime() + k.lead * DAY), eng.place); closing = z.masaIdx !== k.masa;
      } catch (e) {}
      return { state: "month", done: false, remind: first || closing };
    }
    /* a group of śrāddha occasions — the twelve amāvāsyas, the mahālaya
       pakṣa, the fourteen manvādis. Not one recurring day but a set, so the
       group is asked for its own dates and the nearest one ahead is owed. */
    if (k.mode === "tarpana") {
      const TP = STUTI_TARPANA; if (!TP) return null;
      let items = [];
      try {
        const y = d.getFullYear();
        for (const yy of [y, y + 1]) {
          const g = (TP.shannavati(yy, eng.place) || []).concat(TP.yogaDays ? (TP.yogaDays(yy, eng.place) || []) : []);
          const hit = g.find((x) => x.id === k.ref);
          if (hit) items = items.concat(hit.items || []);
        }
      } catch (e) { return null; }
      const dates = items.map((it) => it && it.date).filter(Boolean).map(noon).filter((x) => x >= d).sort((a, b) => a - b);
      if (!dates.length) return null;
      const away = Math.round((dates[0] - d) / DAY);
      if (away > k.lead) return null;
      return { state: "vrata", away, date: dates[0], done: k.keptOn === dkey(dates[0]), remind: true };
    }
    if (k.mode === "vrata") {
      const V = eng.vrata, v = V && (V.lookup ? V.lookup(k.ref) : V.byId[k.ref]); if (!v) return null;
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
    YEAR, DEFAULT_LEAD, NOMU_CADENCE, nomuCadence, modeFor, dkey, tarpanaGroup,
    list: () => list.slice(), find, byId, subject, hasUdyapana,
    add, remove, patch, tick, markKept, keepVrataDay,
    spanOf: (ref) => spanOf(vrataRec(ref)), spanState, spanDefaultStart,
    setStart: (id, key) => patch(id, { start: key, ticks: [], kept: false, keptOn: null }),
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

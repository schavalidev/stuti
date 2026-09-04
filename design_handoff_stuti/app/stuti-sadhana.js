/* ============================================================
   STUTI — sādhanā stores (plain JS, loads before React files)
   STUTI_THREAD: the unbroken thread — one record per local day,
   kept alive by any recitation (r), completed practice (p), or
   japa (j). A single missed day can be bridged by grace.
   STUTI_JAPA: per-mantra japa tallies (108 to a mālā).
   ============================================================ */
window.STUTI_THREAD = (function () {
  const KEY = "stuti-thread"; let db;
  try { db = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { db = {}; }
  if (!db || typeof db !== "object" || Array.isArray(db)) db = {};
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} subs.forEach(fn => fn()); };
  const dkey = (d) => { const x = d || new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const activeDay = (k) => { const r = db[k]; return !!(r && ((r.r && r.r.length) || (r.p && r.p.length) || r.j > 0)); };
  function mark(kind, id, n, key) {
    const k = key || dkey(); const r = db[k] || (db[k] = { r: [], p: [], j: 0 });
    if (kind === "r" && id) { if (r.r.indexOf(id) < 0) r.r.push(id); }
    else if (kind === "p" && id) { if (r.p.indexOf(id) < 0) r.p.push(id); }
    else if (kind === "j") r.j = (r.j || 0) + (n || 1);
    save();
  }
  function streak() {
    const day = 86400000; const t = new Date(); t.setHours(12, 0, 0, 0);
    const today = activeDay(dkey(t));
    let cur = today ? t : new Date(t - day); // an idle today hasn't broken the thread yet
    if (!activeDay(dkey(cur))) return { days: 0, graced: 0, today };
    let days = 0, graced = 0;
    while (true) {
      if (activeDay(dkey(cur))) { days++; cur = new Date(cur - day); continue; }
      const prev = new Date(cur - day); // grace: bridge a single missed day, sparingly
      if (activeDay(dkey(prev)) && graced < Math.max(1, Math.floor(days / 7))) { graced++; cur = prev; continue; }
      break;
    }
    return { days, graced, today };
  }
  function last(n) {
    const day = 86400000, out = []; const t = new Date(); t.setHours(12, 0, 0, 0);
    for (let i = n - 1; i >= 0; i--) {
      const k = dkey(new Date(t - i * day)), r = db[k];
      const kinds = r ? ((r.r && r.r.length ? 1 : 0) + (r.p && r.p.length ? 1 : 0) + (r.j > 0 ? 1 : 0)) : 0;
      out.push({ key: k, level: Math.min(2, kinds), today: i === 0 });
    }
    return out;
  }
  return { mark, streak, last, dkey, day: (k) => db[k || dkey()] || null, subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); } };
})();

window.STUTI_JAPA = (function () {
  const KEY = "stuti-japa"; let db;
  try { db = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { db = {}; }
  if (!db || typeof db !== "object" || Array.isArray(db)) db = {};
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} subs.forEach(fn => fn()); };
  const MALA = 108;
  const dk = () => window.STUTI_THREAD.dkey();
  /* days{} is the record; total is the lifetime sum. Older saves carried
     only today's tally, so fold that in once and keep counting. */
  const st = (id) => {
    const s = db[id] || (db[id] = { total: 0, days: {} });
    if (!s.days) { s.days = s.td && s.tn ? { [s.td]: s.tn } : {}; delete s.td; delete s.tn; }
    return s;
  };
  const addOn = (id, n, key) => {
    const k = key || dk();
    if (k > dk()) return null;   // a future day cannot have been told
    const s = st(id);
    s.days[k] = Math.max(0, (s.days[k] || 0) + n);
    s.total = Math.max(0, s.total + n);
    if (n > 0) window.STUTI_THREAD.mark("j", null, n, k);
    save();
    return s.days[k];
  };
  return {
    MALA,
    state: (id) => { const s = st(id), k = dk(); return { total: s.total, today: s.days[k] || 0, rounds: Math.floor(s.total / MALA) }; },
    bump: (id) => addOn(id, 1),
    undo: (id) => { const s = st(id), k = dk(); if ((s.days[k] || 0) > 0) addOn(id, -1); return (s.days[k] || 0); },
    /* a mālā counted in the hand — whole rounds, logged after the fact,
       for today or for the day it was actually done */
    addRounds: (id, rounds, key) => addOn(id, MALA * Math.max(1, Math.round(rounds)), key),
    dayCount: (id, key) => (st(id).days[key] || 0),
    /* the last n days, oldest first */
    history: (id, n) => {
      const s = st(id), out = [], day = 86400000, t = new Date(); t.setHours(12, 0, 0, 0);
      for (let i = n - 1; i >= 0; i--) { const k = window.STUTI_THREAD.dkey(new Date(t - i * day)); out.push({ key: k, n: s.days[k] || 0, today: i === 0 }); }
      return out;
    },
    lastId: () => { try { return localStorage.getItem("stuti-japa-last") || ""; } catch (e) { return ""; } },
    setLast: (id) => { try { localStorage.setItem("stuti-japa-last", id); } catch (e) {} },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

/* ============================================================
   STUTI_PLANS — learn-by-heart plans over any full text.
   A plan splits a hymn's verses into daily portions; each done
   day is stored, and finishing a portion keeps the thread.
   ============================================================ */
window.STUTI_PLANS = (function () {
  const KEY = "stuti-plans"; let db;
  try { db = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { db = {}; }
  if (!db || typeof db !== "object" || Array.isArray(db)) db = {};
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} subs.forEach(fn => fn()); };
  function meta(hymn) { // how long the plan runs: short texts a verse a day, long ones capped at 40 days
    const n = (hymn.verses || []).length;
    const days = n <= 14 ? n : n <= 60 ? Math.ceil(n / 2) : 40;
    const chunk = Math.ceil(n / days);
    return { verses: n, days, chunk };
  }
  function chunkFor(hymn, day) { // 1-based day -> verse index range [from, to)
    const m = meta(hymn);
    const from = (day - 1) * m.chunk;
    return { from, to: Math.min(m.verses, from + m.chunk) };
  }
  return {
    meta, chunkFor,
    get: (id) => db[id] || null,
    active: () => Object.keys(db).filter(id => !db[id].finished),
    start: (id) => { if (!db[id]) { db[id] = { started: window.STUTI_THREAD.dkey(), done: [], last: "" }; save(); } },
    drop: (id) => { delete db[id]; save(); },
    currentDay: (id, hymn) => { const p = db[id]; return p ? Math.min(p.done.length + 1, meta(hymn).days) : 1; },
    completeDay: (id, day, hymn) => {
      const p = db[id]; if (!p || p.done.indexOf(day) >= 0) return;
      p.done.push(day); p.last = window.STUTI_THREAD.dkey();
      if (p.done.length >= meta(hymn).days) p.finished = true;
      window.STUTI_THREAD.mark("p", "plan:" + id + ":" + day);
      save();
    },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

/* ============================================================
   STUTI_VOWS — saṅkalpa scheduler.
   A vow binds a hymn to a recurring lunar occasion for a term.
   Dates are computed from the pañcāṅga engine, so "every pradoṣa"
   means the real pradoṣa days at the reader's own location.
   ============================================================ */
window.STUTI_VOWS = (function () {
  const KEY = "stuti-vows"; let list;
  try { list = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { list = []; }
  if (!Array.isArray(list)) list = [];
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} subs.forEach(fn => fn()); };

  /* occasions, each a predicate on one day's pañcāṅga */
  const OCCASIONS = [
    { id: "daily",     name: "Every day",           deva: "प्रतिदिन",        tel: "ప్రతిరోజు",        test: () => true },
    { id: "vara",      name: "A weekday",           deva: "वार",             tel: "వారం",            weekday: true },
    { id: "ekadashi",  name: "Ekādaśī",             deva: "एकादशी",          tel: "ఏకాదశి",          test: p => p.tithiIndex === 10 || p.tithiIndex === 25 },
    { id: "pradosha",  name: "Pradoṣa",             deva: "प्रदोष",          tel: "ప్రదోషం",         test: p => p.tithiIndex === 12 || p.tithiIndex === 27 },
    { id: "sankashti", name: "Saṅkaṣṭī Caturthī",   deva: "सङ्कष्टी चतुर्थी", tel: "సంకష్టహర చతుర్థి", test: p => p.tithiIndex === 18 },
    { id: "chaturthi", name: "Vināyaka Caturthī",   deva: "विनायक चतुर्थी",   tel: "వినాయక చతుర్థి",   test: p => p.tithiIndex === 3 },
    { id: "purnima",   name: "Pūrṇimā",             deva: "पूर्णिमा",         tel: "పూర్ణిమ",         test: p => p.tithiIndex === 14 },
    { id: "amavasya",  name: "Amāvāsyā",            deva: "अमावस्या",        tel: "అమావాస్య",        test: p => p.tithiIndex === 29 },
    { id: "ashtami",   name: "Kṛṣṇa Aṣṭamī",        deva: "कृष्ण अष्टमी",     tel: "కృష్ణ అష్టమి",     test: p => p.tithiIndex === 22 },
  ];
  const TERMS = [
    { id: "m1",  name: "One month",     deva: "एक मास",      tel: "ఒక మాసం",     days: 30 },
    { id: "m3",  name: "Three months",  deva: "तीन मास",     tel: "మూడు మాసాలు",  days: 92 },
    { id: "m6",  name: "Six months",    deva: "छह मास",      tel: "ఆరు మాసాలు",   days: 183 },
    { id: "y1",  name: "One year",      deva: "एक वर्ष",      tel: "ఒక సంవత్సరం",  days: 366 },
  ];
  const occ = (id) => OCCASIONS.find(o => o.id === id) || OCCASIONS[0];
  function vowLoc() { // the reader's own place, so tithi-bound vows fall on their real days
    const PA = window.AKSHARA_PANCHANGA, LOC = window.STUTI_LOC;
    if (!PA) return null;
    const id = LOC && LOC.getLocId && LOC.getLocId();
    const det = LOC && LOC.getDetected && LOC.getDetected();
    if (id === "detected" && det) return det;
    return PA.locations.find(l => l.id === id) || PA.locations[0];
  }
  const term = (id) => TERMS.find(t => t.id === id) || TERMS[1];

  /* the vow's dates within its term, from today forward (capped) */
  function dates(vow, cap) {
    const PA = window.AKSHARA_PANCHANGA, out = [];
    if (!PA) return out;
    const loc = vowLoc();
    const o = occ(vow.occasion), t = term(vow.term);
    const start = new Date(vow.start + "T12:00:00");
    const end = new Date(start.getTime() + t.days * 86400000);
    const from = new Date(); from.setHours(12, 0, 0, 0);
    const cur = from > start ? from : new Date(start);
    const limit = cap || 6;
    for (let i = 0; i < t.days && out.length < limit; i++) {
      const d = new Date(cur.getTime() + i * 86400000);
      if (d > end) break;
      const ok = o.weekday ? d.getDay() === (vow.weekday || 0) : o.test(PA.forDay(d, loc));
      if (ok) out.push(d);
    }
    return out;
  }
  function isDue(vow, date) {
    const PA = window.AKSHARA_PANCHANGA; if (!PA) return false;
    const loc = vowLoc();
    const d = date || new Date();
    const start = new Date(vow.start + "T12:00:00");
    const end = new Date(start.getTime() + term(vow.term).days * 86400000);
    if (d < start || d > end) return false;
    const o = occ(vow.occasion);
    return o.weekday ? d.getDay() === (vow.weekday || 0) : o.test(PA.forDay(d, loc));
  }
  return {
    OCCASIONS, TERMS, occ, term, dates, isDue,
    list: () => list.slice(),
    add: (v) => { list = list.concat([Object.assign({ id: "v" + Date.now(), start: window.STUTI_THREAD.dkey(), kept: [] }, v)]); save(); },
    remove: (id) => { list = list.filter(v => v.id !== id); save(); },
    keep: (id) => { const v = list.find(x => x.id === id); if (!v) return; const k = window.STUTI_THREAD.dkey(); if (v.kept.indexOf(k) < 0) { v.kept.push(k); window.STUTI_THREAD.mark("p", "vow:" + id + ":" + k); save(); } },
    keptToday: (v) => v.kept.indexOf(window.STUTI_THREAD.dkey()) >= 0,
    /* a vow is always an obligation; whether it may ring is a separate
       question, answered per vow. Taking one is opting in — absent means on,
       so an old vow keeps its bell. */
    reminds: (v) => !!v && v.remind !== false,
    setRemind: (id, on) => { const v = list.find(x => x.id === id); if (!v) return; v.remind = !!on; save(); },
    dueToday: () => list.filter(v => isDue(v)),
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

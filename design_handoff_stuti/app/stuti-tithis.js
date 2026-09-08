/* ============================================================
   STUTI — the house's own tithis (plain JS, loads before React)
   STUTI_TITHIS: the days a family keeps that no almanac prints — a
   grandmother's janma tithi, a father's ābdikam, the day a house was
   entered. Each is a lunar rule (māsa · pakṣa · tithi) the reciter set
   once, usually from the Gregorian date they remember; the app finds it
   every year after. Records dress as vratas so the calendar, the home
   card and the bell take them without special cases.
   ============================================================ */
window.STUTI_TITHIS = (function () {
  const KEY = "stuti-my-tithis"; let list;
  const load = () => { let l; try { l = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { l = []; } return Array.isArray(l) ? l : []; };
  list = load();
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} subs.forEach((fn) => fn()); };
  window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === null) { list = load(); subs.forEach((fn) => fn()); } });
  const fresh = () => { list = load(); };

  /* kinds: what the day is, which fixes the hour it is kept at and the tone */
  const KINDS = {
    janma:    { deity: "surya",  rule: "sunrise",  label: { roman: "Janma tithi", deva: "जन्म तिथि", tel: "జన్మ తిథి" } },
    shraddha: { deity: "vishnu", rule: "aparahna", label: { roman: "Śrāddha · Ābdikam", deva: "श्राद्ध · आब्दिक", tel: "శ్రాద్ధం · ఆబ్దికం" } },
    other:    { deity: "guru",   rule: "sunrise",  label: { roman: "Tithi", deva: "तिथि", tel: "తిథి" } },
  };
  const MASA_NAMES = [
    { roman: "Caitra", deva: "चैत्र", tel: "చైత్ర" }, { roman: "Vaiśākha", deva: "वैशाख", tel: "వైశాఖ" }, { roman: "Jyeṣṭha", deva: "ज्येष्ठ", tel: "జ్యేష్ఠ" },
    { roman: "Āṣāḍha", deva: "आषाढ", tel: "ఆషాఢ" }, { roman: "Śrāvaṇa", deva: "श्रावण", tel: "శ్రావణ" }, { roman: "Bhādrapada", deva: "भाद्रपद", tel: "భాద్రపద" },
    { roman: "Āśvayuja", deva: "आश्विन", tel: "ఆశ్వయుజ" }, { roman: "Kārtika", deva: "कार्तिक", tel: "కార్తిక" }, { roman: "Mārgaśīrṣa", deva: "मार्गशीर्ष", tel: "మార్గశిర" },
    { roman: "Puṣya", deva: "पौष", tel: "పుష్య" }, { roman: "Māgha", deva: "माघ", tel: "మాఘ" }, { roman: "Phālguna", deva: "फाल्गुन", tel: "ఫాల్గుణ" },
  ];
  const PAKSHA = [{ roman: "Śukla", deva: "शुक्ल", tel: "శుక్ల" }, { roman: "Kṛṣṇa", deva: "कृष्ण", tel: "కృష్ణ" }];
  /* 0-based whole-month index → name; 14 and 29 are the moon's own days */
  function tithiName(ti) {
    const P = window.AKSHARA_PANCHANGA; const T = P.TITHI;
    if (ti === 14) return T[14] || { iast: "Pūrṇimā", deva: "पूर्णिमा", tel: "పౌర్ణమి" };
    if (ti === 29) return T[15] || T[29] || { iast: "Amāvāsyā", deva: "अमावस्या", tel: "అమావాస్య" };
    return T[ti % 15];
  }
  /* "Śrāvaṇa · Śukla Pañcamī", in the three scripts */
  function ruleText(rec) {
    const m = MASA_NAMES[rec.masa] || MASA_NAMES[0], p = PAKSHA[rec.ti >= 15 ? 1 : 0], t = tithiName(rec.ti);
    const solo = rec.ti === 14 || rec.ti === 29;
    return {
      roman: m.roman + " · " + (solo ? "" : p.roman + " ") + t.iast,
      deva: m.deva + " " + (solo ? "" : p.deva + " ") + t.deva,
      tel: m.tel + " " + (solo ? "" : p.tel + " ") + t.tel,
    };
  }

  /* the record read off a civil date — the way most people know the day */
  function fromDate(date, loc) {
    const P = window.AKSHARA_PANCHANGA;
    const pa = P.forDay(date, loc || (P.locations.find((l) => l.id === "ujjain") || P.locations[0]));
    return { masa: pa.masaIdx, ti: pa.tithiIndex, adhika: !!pa.masaAdhika };
  }

  const byId = (id) => list.find((r) => r.id === id) || null;
  function add(rec) {
    fresh();
    const r = Object.assign({ id: "t" + Date.now(), name: "", kind: "other", masa: 0, ti: 0, lead: 1, note: "", from: null }, rec);
    list = list.concat([r]); save(); return r;
  }
  const patch = (id, p) => { fresh(); const r = byId(id); if (!r) return; Object.assign(r, p); save(); };
  const remove = (id) => { fresh(); list = list.filter((r) => r.id !== id); save(); };

  /* the vrata the rest of the app sees */
  function asVrata(r) {
    const k = KINDS[r.kind] || KINDS.other;
    const nm = r.name || k.label.roman;
    return {
      id: "my-" + r.id, personal: true, rec: r, deity: k.deity, kind: r.kind, brief: true,
      name: { roman: nm, deva: nm, tel: nm },
      rule: ruleText(r),
      find: (y) => { const V = window.STUTI_VRATA; return V && V.lunarDay ? V.lunarDay(y, r.masa, r.ti, k.rule) : null; },
      lead: 0, remindLead: r.lead == null ? 1 : r.lead,
      stotras: r.kind === "shraddha" ? [{ deity: "vishnu", m: "visnu sahasra" }] : r.kind === "janma" ? [{ deity: "surya", m: "aditya" }] : [],
    };
  }
  const vratas = () => list.map(asVrata);

  return { KINDS, MASA_NAMES, PAKSHA, tithiName, ruleText, fromDate, list: () => list.slice(), byId, add, patch, remove, asVrata, vratas, subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); } };
})();

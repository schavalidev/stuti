/* ============================================================
   STUTI — getting ready for a vratham
   The window opens three days before an enrolled vrata falls.
   Inside it: a nudge (previewed in-app; local scheduled
   notifications in the native build), a home card, and a
   checklist built from the samagri plus the timeline's
   before-the-day steps. State is kept per OCCURRENCE — this
   year's Chavithi, not forever — so every year starts fresh.
   ============================================================ */
window.STUTI_PREP = (function () {
  const V = () => window.STUTI_VRATA;
  const LEAD = 3;
  /* auto-enrolled; everything else is opt-in from the reminders sheet */
  const AUTO = ["ganesha-chaturthi", "varalakshmi", "navaratri", "dipavali", "shivaratri", "janmashtami", "makara-sankranti", "ugadi"];
  const prefs = () => ((window.STUTI_PREFS.get().remind || {}).prep) || {};
  const masterOn = () => prefs().on !== false;
  const kept = (id) => { try { return !!window.STUTI_KEEP.find("vrata", id); } catch (e) { return false; } };
  const leadOf = (id) => { try { return window.STUTI_KEEP.leadFor(id); } catch (e) { return LEAD; } };
  const enrolled = (id) => {
    if (kept(id)) return true;
    const p = prefs();
    return AUTO.indexOf(id) !== -1 ? !(p.off || {})[id] : !!(p.extra || {})[id];
  };
  const setMaster = (on) => window.STUTI_PREFS.setRemind({ prep: Object.assign({}, prefs(), { on }) });
  const toggleVrata = (id) => {
    const p = prefs();
    if (AUTO.indexOf(id) !== -1) {
      const off = Object.assign({}, p.off); off[id] = !off[id];
      window.STUTI_PREFS.setRemind({ prep: Object.assign({}, p, { off }) });
    } else {
      const extra = Object.assign({}, p.extra); extra[id] = !extra[id];
      window.STUTI_PREFS.setRemind({ prep: Object.assign({}, p, { extra }) });
    }
  };
  /* the timeline rows that belong to BEFORE the day — named so, or the
     eve row of a weekly vrata (Maṅgaḷa Gaurī preps on Monday evening) */
  const preSteps = (v) => (v.timeline || []).filter((row, i) =>
    /before|ముందు/i.test(((row.t || {}).roman || "") + " " + ((row.t || {}).tel || "")) ||
    (v.weekly !== undefined && i === 0));
  const items = (v) => (v.samagri || []).map((s, i) => ({ id: "g" + i, kind: "get", text: s }))
    .concat(preSteps(v).map((row, i) => ({ id: "d" + i, kind: "do", text: row.d })));
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const key = (id, date) => "stuti-prep:" + id + ":" + iso(date);
  const done = (id, date) => {
    try { const a = JSON.parse(localStorage.getItem(key(id, date)) || "[]"); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  };
  const toggleItem = (id, date, itemId) => {
    const a = done(id, date);
    const n = a.indexOf(itemId) !== -1 ? a.filter((x) => x !== itemId) : a.concat([itemId]);
    try { localStorage.setItem(key(id, date), JSON.stringify(n)); } catch (e) {}
    return n;
  };
  const txt = (t, lang) => !t ? "" : ((lang === "telugu" ? (t.tel || t.roman) : t.roman) || "");
  /* enrolled occurrences whose window is open — today through LEAD days out */
  const windowOpen = () => !masterOn() ? [] :
    V().upcoming(40).filter((x) => enrolled(x.v.id) && x.away >= 0 && x.away <= leadOf(x.v.id));
  /* the soonest enrolled occurrence at any distance — the reminders preview */
  const nextEnrolled = () => V().upcoming(40).filter((x) => enrolled(x.v.id))[0] || null;
  function shareText(v, date, lang) {
    const name = lang === "telugu" ? v.name.tel : lang === "deva" ? v.name.deva : v.name.roman;
    const ds = date.toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { weekday: "long", day: "numeric", month: "long" });
    const dn = done(v.id, date);
    const lines = items(v).map((it) => (dn.indexOf(it.id) !== -1 ? "✓ " : "• ") + txt(it.text, lang));
    return name + " — " + ds + (lines.length ? "\n" + lines.join("\n") : "");
  }
  return { LEAD, AUTO, masterOn, enrolled, setMaster, toggleVrata, items, done, toggleItem, txt, windowOpen, nextEnrolled, shareText };
})();

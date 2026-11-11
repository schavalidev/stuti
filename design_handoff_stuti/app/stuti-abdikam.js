/* ============================================================
   STUTI — getting ready for an ābdikam
   A śrāddha is not a to-do checked off in a morning. In the week
   before it, a house has arrangements only it can make: a purohita
   to reach and a day to fix, bhoktas to invite, the samagri he names
   to gather, a meal to arrange, leave to take. The engine already
   finds the day and rings the week ahead; this store holds the
   arrangements themselves, so the far notice can name them and the
   home card can be worked through across the week.

   State is kept per OCCURRENCE — this year's day, not the standing
   rule — so each year begins with the list unchecked. The task text
   is deliberately plain and does not prescribe which samagri: the
   purohita names that, and the list sends the reciter to him.
   ============================================================ */
window.STUTI_ABDIKAM = (function () {
  const KEY = "stuti-abdikam-prep";   /* map: "recId|YYYY-MM-DD" -> [taskId, ...] */
  let map;
  try { map = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { map = {}; }
  if (typeof map !== "object" || map === null) map = {};
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(map)); } catch (e) {} subs.forEach((fn) => fn()); };
  window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === null) { try { map = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (x) { map = {}; } subs.forEach((fn) => fn()); } });

  /* the arrangements, in the order a week falls into: the priest first,
     because everything else waits on the day he can come; then the people,
     the things, the meal, the leave. Each is one plain sentence per script. */
  const TASKS = [
    { id: "purohita", text: {
      roman: "Speak to the purohita and fix the day",
      deva:  "पुरोहित से बात करके दिन निश्चित करें",
      tel:   "పురోహితుడితో మాట్లాడి రోజు నిర్ణయించండి" } },
    { id: "bhokta", text: {
      roman: "Invite the bhoktas for the meal",
      deva:  "भोक्ताओं को भोजन के लिए आमंत्रित करें",
      tel:   "భోక్తలను భోజనానికి పిలవండి" } },
    { id: "samagri", text: {
      roman: "Gather the samagri the purohita names",
      deva:  "पुरोहित द्वारा बताई सामग्री जुटाएँ",
      tel:   "పురోహితుడు చెప్పిన సామగ్రి సమకూర్చుకోండి" } },
    { id: "vanta", text: {
      roman: "Arrange the cooking",
      deva:  "भोजन की व्यवस्था करें",
      tel:   "వంట ఏర్పాటు చేసుకోండి" } },
    { id: "selavu", text: {
      roman: "Take leave for the day",
      deva:  "उस दिन का अवकाश लें",
      tel:   "ఆ రోజుకు సెలవు తీసుకోండి" } },
  ];

  const iso = (d) => { const x = d instanceof Date ? d : new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const okey = (recId, date) => recId + "|" + iso(date);
  const done = (recId, date) => { const a = map[okey(recId, date)]; return Array.isArray(a) ? a.slice() : []; };
  const toggle = (recId, date, taskId) => {
    const k = okey(recId, date), a = Array.isArray(map[k]) ? map[k] : [];
    map[k] = a.indexOf(taskId) !== -1 ? a.filter((x) => x !== taskId) : a.concat([taskId]);
    save(); return map[k].slice();
  };
  const leftCount = (recId, date) => TASKS.length - done(recId, date).length;
  const text = (t, lang) => !t ? "" : (lang === "telugu" ? (t.tel || t.roman) : lang === "deva" ? (t.deva || t.roman) : t.roman);
  /* the arrangements still unmade, as plain lines — what the notice names */
  const remaining = (recId, date, lang) => { const dn = done(recId, date); return TASKS.filter((x) => dn.indexOf(x.id) === -1).map((x) => text(x.text, lang)); };

  return { TASKS, tasks: () => TASKS.slice(), done, toggle, leftCount, text, remaining, subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); } };
})();

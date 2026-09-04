/* ============================================================
   STUTI — the waiting list
   Hundreds of stotras are in the index by name while their text is
   still being keyed and proofed. Rather than a dead end, a reciter
   can ask to be told when one arrives. Same shape as STUTI_FAVS.
   ============================================================ */
export const STUTI_WATCH = (function () {
  const KEY = "stuti-watch";
  let ids;
  try { ids = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { ids = []; }
  if (!Array.isArray(ids)) ids = [];
  const subs = new Set();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) {}
    subs.forEach((fn) => fn(ids.slice()));
  }
  return {
    list: () => ids.slice(),
    count: () => ids.length,
    has: (id) => ids.indexOf(id) !== -1,
    toggle: (id) => { ids = ids.indexOf(id) !== -1 ? ids.filter((x) => x !== id) : ids.concat([id]); save(); },
    remove: (id) => { ids = ids.filter((x) => x !== id); save(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

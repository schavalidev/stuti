/* ============================================================
   STUTI — mokkulu (మొక్కులు)
   A mokku is a promise made to a deity, often against a wish —
   hair at Tirumala, an abhiṣeka, an annadānam — and the one thing
   it asks of the app is not to be forgotten. So this store is plain:
   a standing list, each the deity it was made to, what was promised,
   the day it was taken, and whether it has been fulfilled. No
   schedule, no bell — a mokku is kept when the wish is granted or the
   temple is reached, not on a tithi the engine can name.
   ============================================================ */
window.STUTI_MOKKU = (function () {
  const KEY = "stuti-mokku"; let list;
  try { list = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { list = []; }
  if (!Array.isArray(list)) list = [];
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} subs.forEach((fn) => fn()); };
  const dkey = () => { try { return window.STUTI_THREAD.dkey(); } catch (e) { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); } };
  const byId = (id) => list.find((m) => m.id === id);
  return {
    list: () => list.slice(),
    byId,
    /* deityId is an app deity when one was picked, else null; deityName carries
       a temple or a form the app does not hold. pledge is the promise itself. */
    add: (m) => { list = list.concat([Object.assign({ id: "mk" + Date.now(), made: dkey(), fulfilled: null }, m)]); save(); },
    remove: (id) => { list = list.filter((m) => m.id !== id); save(); },
    fulfill: (id) => { const m = byId(id); if (!m) return; m.fulfilled = dkey(); save(); },
    reopen: (id) => { const m = byId(id); if (!m) return; m.fulfilled = null; save(); },
    pending: () => list.filter((m) => !m.fulfilled),
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

/* ============================================================
   STUTI — the print/share limit, standing in for v2's paid plan
   Full printing and sharing are moving to a paid plan in the next
   version. Nothing can be charged yet, so this only meters a free
   monthly allowance — one print, one share — and says plainly
   that more is coming rather than pretending a plan already
   exists to sell. Storage is the record: every question re-reads
   it and rolls the month while reading, so two open tabs cannot
   each spend the same free print, and the website and the app
   share one allowance because they share one origin.
   ============================================================ */
export const STUTI_LIMITS = (function () {
  const subs = new Set();
  const emit = () => subs.forEach(fn => { try { fn(); } catch (e) {} });
  const USED = "stuti-limit-used", NOTE = "stuti-limit-interest";
  let used = {}, noted = false;
  try { noted = localStorage.getItem(NOTE) === "1"; } catch (e) {}

  const QUOTA = { print: 1, share: 1 };
  /* the vrata pack is the same verb with more paper */
  const BUCKET = { print: "print", pack: "print", share: "share" };
  const monthKey = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1); };

  function load() {
    try { used = JSON.parse(localStorage.getItem(USED) || "{}") || {}; } catch (e) { used = {}; }
    if (used.m !== monthKey()) used = { m: monthKey() };
    return used;
  }
  function save() { try { localStorage.setItem(USED, JSON.stringify(used)); } catch (e) {} }

  function left(gate) {
    const b = BUCKET[gate]; if (!b) return 0;
    load();
    return Math.max(0, (QUOTA[b] || 0) - (used[b] || 0));
  }
  function take(gate) {
    const b = BUCKET[gate]; if (!b) return false;
    load();
    if ((QUOTA[b] || 0) - (used[b] || 0) <= 0) return false;
    used[b] = (used[b] || 0) + 1; save(); emit();
    return true;
  }
  function held(gate) { return left(gate) <= 0; }
  function resetMonth() { used = { m: monthKey() }; save(); emit(); }

  return {
    left, take, held, resetMonth,
    interested: () => noted,
    note: () => { noted = true; try { localStorage.setItem(NOTE, "1"); } catch (e) {} emit(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

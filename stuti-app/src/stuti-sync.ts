/* ============================================================
   STUTI — the sync seam
   No server here. This is the list of what an account backs up,
   and the two operations a sync needs from the device: take a
   snapshot, and compare one against what the account holds.
   The flyleaf (name, gotra) is not on the list on purpose.
   The real client (stuti-app/src/backend/sync.ts) does the
   pulling and pushing; it never reads localStorage itself.
   ============================================================ */
export const STUTI_SYNC = (function () {
  const KEYS = [
    "stuti-favs", "stuti-favs-week", "stuti-last",
    "stuti-loc", "stuti-detected",
    "stuti-watch", "stuti-thread", "stuti-japa", "stuti-japa-last",
    "stuti-plans", "stuti-vows", "stuti-keep",
    "stuti-recite-cfg", "stuti-lang", "stuti-theme", "stuti-ui-lang", "stuti-ui-lang-custom",
    "stuti-uiscale", "stuti-fontscale2", "stuti-readmode",
  ];
  const PREFIX = ["stuti-pos-"];
  const NEVER = ["stuti-flyleaf", "stuti-session", "stuti-push", "stuti-nudge-fired", "stuti-beta-key"];

  function keys() {
    const out = new Set(KEYS);
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (PREFIX.some(p => k.startsWith(p))) out.add(k); } } catch (e) {}
    NEVER.forEach(k => out.delete(k));
    return Array.from(out);
  }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* { key: rawString } for every key that has a value */
  function snapshot() {
    const s = {};
    keys().forEach(k => { const v = read(k); if (v !== null) s[k] = v; });
    return s;
  }

  /* remote: { key: rawString }. Returns the four lists the account screen
     needs to ask "which to keep". Same string means same; nothing is merged. */
  function compare(remote) {
    const local = snapshot(), r = remote || {};
    const same = [], localOnly = [], remoteOnly = [], differ = [];
    Object.keys(local).forEach(k => { if (!(k in r)) localOnly.push(k); else if (r[k] === local[k]) same.push(k); else differ.push(k); });
    Object.keys(r).forEach(k => { if (!(k in local) && !NEVER.includes(k)) remoteOnly.push(k); });
    return { same, localOnly, remoteOnly, differ };
  }

  /* writes a snapshot over the device, whole. The caller has asked first. */
  function apply(snap) {
    Object.keys(snap || {}).forEach(k => { if (NEVER.includes(k)) return; try { localStorage.setItem(k, snap[k]); } catch (e) {} });
  }

  /* the numbers the two cards show: what a reader can weigh at a glance */
  function summary(snap) {
    const j = (k) => { try { return JSON.parse((snap || {})[k] || "null"); } catch (e) { return null; } };
    const japa = j("stuti-japa") || {}, vows = j("stuti-vows") || [], keep = j("stuti-keep") || [], plans = j("stuti-plans") || {};
    return {
      japa: Object.values(japa).reduce((a, v) => a + (typeof v === "number" ? v : (v && v.count) || 0), 0),
      vowsKept: vows.reduce((a, v) => a + ((v.kept || []).length), 0),
      keeps: Array.isArray(keep) ? keep.length : Object.keys(keep).length,
      plans: Object.keys(plans).length,
    };
  }

  return { KEYS, NEVER, keys, snapshot, compare, apply, summary };
})();

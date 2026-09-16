/* ============================================================
   STUTI — noticing what changed, so it can travel
   Hand-authored, and imported first in main.tsx: it has to be in
   place before any store writes. The stores stay exactly as the
   design wrote them — each one reads and writes its own
   localStorage key — and this watches those writes from outside,
   stamping every key that belongs to the reciter with the moment
   it changed. stuti-cloud.ts reads the stamps to decide what to
   send and whether a copy from another phone is newer.

   Nothing here talks to a network. With no account the stamps
   simply collect, and the first sign-in uses them.
   ============================================================ */
const EXACT = new Set([
  "stuti-favs", "stuti-favs-week", "stuti-last", "stuti-loc", "stuti-lang",
  "stuti-japa", "stuti-japa-last", "stuti-plans", "stuti-thread", "stuti-vows",
  "stuti-watch", "stuti-keep", "stuti-prefs", "stuti-my-tithis",
  "stuti-pitru-register", "stuti-dana", "stuti-recite-cfg", "stuti-ledger-span",
  "stuti-ledger", "stuti-nitya-lens", "stuti-fontscale", "stuti-home",
  "stuti-theme", "stuti-uiscale", "stuti-readmode", "stuti-speed", "stuti-ui-lang", "stuti-ui-lang-custom",
]);
const PREFIX = ["stuti-pos-", "stuti-practice-"];   // a reading position per hymn; practice records

/* Not here, on purpose: stuti-flyleaf (and the older stuti-gotra / -nama /
   -gender / -karma). The saṅkalpa panel promises the reciter that name and
   gotra never leave the phone, and that promise is kept by sync too. */
/** the reciter's own data; device plumbing (session, relay queue, beta latch, device id) never travels */
export const syncs = (k: string) => EXACT.has(k) || PREFIX.some((p) => k.startsWith(p));

const META = "stuti-sync-meta";
type Meta = { ts: Record<string, number>; dirty: string[] };

const proto = Storage.prototype;
export const rawSet = proto.setItem;
export const rawRemove = proto.removeItem;

export function readMeta(): Meta {
  try { const m = JSON.parse(localStorage.getItem(META) || "null"); if (m && m.ts && m.dirty) return m; } catch (e) {}
  return { ts: {}, dirty: [] };
}
export function writeMeta(m: Meta) { try { rawSet.call(localStorage, META, JSON.stringify(m)); } catch (e) {} }

const listeners = new Set<() => void>();
export const onLocalChange = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };

function stamp(store: Storage, key: string) {
  if (store !== localStorage || !syncs(key)) return;
  const m = readMeta();
  m.ts[key] = Date.now();
  if (m.dirty.indexOf(key) === -1) m.dirty.push(key);
  writeMeta(m);
  listeners.forEach((fn) => { try { fn(); } catch (e) {} });
}

let installed = false;
export function installSyncHook() {
  if (installed) return; installed = true;
  proto.setItem = function (this: Storage, key: string, value: string) {
    let before: string | null = null;
    try { before = this === localStorage && syncs(key) ? this.getItem(key) : null; } catch (e) {}
    rawSet.call(this, key, value);
    if (before !== value) stamp(this, key);   // stores rewrite unchanged values often; those are not changes
  };
  proto.removeItem = function (this: Storage, key: string) {
    const had = this.getItem(key) !== null;
    rawRemove.call(this, key);
    if (had) stamp(this, key);
  };
}
installSyncHook();

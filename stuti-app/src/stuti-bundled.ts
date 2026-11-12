/* ============================================================
   STUTI — the bundled texts, read when they are wanted
   Hand-authored, like stuti-corpus.ts, and the same contract: a
   catalogue row exists with no verses, something puts the verses on
   it later, and the reader takes a tick so it re-reads the hymn it
   was handed.

   The difference is where the body comes from. The corpus fetches
   one text at a time from a host; these ninety-four are compiled
   into the app, because the pūjā room is the use case and they must
   read with no network at all. They are not fetched, then — they are
   imported. tools/codemod/fix-defer-bodies.mjs lifts the verses out
   of each deity module into a stuti-body-*.ts, which Vite gives a
   chunk of its own and Workbox precaches like any other built file.
   On the phone the file is already on disk; on the web it is in the
   worker's cache. Nothing is read over the network either way, and
   nothing is read at all until this module asks for it.

   What arrives at first paint is the catalogue: every title, blurb
   and section heading, and every `catalog = false`, so the library
   is complete and correct from the first frame. The verses follow in
   idle slices, and a hymn a reader actually opens jumps the queue.

   Placed by fix-defer-bodies.mjs, which also makes stuti-texts.ts's
   binding pass re-runnable and turns the Hindi and Telugu meaning
   modules from attach-once into registered attachers. Those
   attachers are the delicate part: a meaning hung on a verse that
   has not arrived is lost in silence, and that is how every
   Devanāgarī reader got the English line for months before 17 Oct
   2026. So every one of them is run again after every body.
   ============================================================ */
import { useEffect, useState } from "react";
import { STUTI_ATTACH } from "./stuti-texts";
import { BODY_MODS } from "./stuti-body-registry";

const W: any = typeof window !== "undefined" ? window : globalThis;
const norm = (s: string) =>
  (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* ---- the tick ---- */
let tick = 0;
const subs = new Set<() => void>();
let pending: any = 0;

/* Coalesced: thirty-one bodies land in quick succession just after first
   paint, and the screens want one re-read, not thirty-one. */
function bump() {
  if (pending) return;
  pending = setTimeout(() => {
    pending = 0;
    tick++;
    subs.forEach((f) => { try { f(); } catch (e) {} });
    try { W.dispatchEvent && W.dispatchEvent(new CustomEvent("stuti-bundled")); } catch (e) {}
  }, 150);
}

/* ---- which body file carries a given hymn ---- */
const byTitle = new Map<string, string>();
for (const m of BODY_MODS) for (const t of m.heads || []) byTitle.set(norm(t.title), m.key);

/* A hymn this module can fill: a bundled text, not a corpus row (which has its
   own loader) and not a "coming soon" stub, which has no text anywhere yet. */
export const bundledHas = (h: any) => !!(h && !h.corpus && byTitle.has(norm(h.title)));

const loaded = new Set<string>();
const inflight: Record<string, Promise<void>> = {};

/* ---- the meanings and the name registries ---- */
function runAttachers() {
  const list = (W.STUTI_HI_ATTACH || []) as Array<() => any>;
  for (const f of list) { try { f(); } catch (e) {} }
}

let support: Promise<void> | null = null;
/* The thousand-name registries come before any body: stuti-texts.ts generates a
   sahasranāma's name-ślokas out of them as it binds, so a body bound without
   them would be a text short its thousand names. */
function loadSupport(): Promise<void> {
  if (!support) {
    support = Promise.all([import("./stuti-names-lazy"), import("./stuti-hindi-lazy")])
      .then(() => { runAttachers(); })
      .catch(() => {});
  }
  return support;
}

/* ---- one body ---- */
export function loadBody(key: string): Promise<void> {
  if (loaded.has(key)) return Promise.resolve();
  if (inflight[key]) return inflight[key];
  const m = BODY_MODS.find((x) => x.key === key);
  if (!m) return Promise.resolve();
  inflight[key] = (async () => {
    await loadSupport();
    const mod: any = await m.load();
    const bodies: any[][] = (mod && mod.default) || [];
    m.heads.forEach((t: any, i: number) => { t.verses = bodies[i] || []; STUTI_ATTACH(t); });
    loaded.add(key);
    runAttachers();
    bump();
  })().catch(() => {});
  return inflight[key];
}

export function loadFor(h: any): Promise<void> {
  const key = h && byTitle.get(norm(h.title));
  return key ? loadBody(key) : Promise.resolve();
}

const idle = () => new Promise<void>((res) => {
  if (typeof W.requestIdleCallback === "function") W.requestIdleCallback(() => res(), { timeout: 200 });
  else setTimeout(res, 0);
});

let all: Promise<void> | null = null;
/* Every body, one at a time, yielding the main thread between each — so the
   app stays answerable while the rest of the library fills in behind it. Also
   what tools/codemod/check-links.mjs calls, to check the whole bound corpus. */
export function loadAllBundled(): Promise<void> {
  if (!all) all = (async () => {
    for (const m of BODY_MODS) { await loadBody(m.key); await idle(); }
  })();
  return all;
}

export function installBundled() {
  const go = () => { loadAllBundled(); };
  if (typeof W.requestIdleCallback === "function") W.requestIdleCallback(go, { timeout: 500 });
  else setTimeout(go, 0);
}

/* ---- what the screens take ---- */
/* The reader calls this once per hymn; a bundled text still in the queue is
   loaded ahead of it, and the tick changes when its verses are there. */
export function useBundledText(h: any) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!h || (h.verses && h.verses.length)) return;
    if (!bundledHas(h)) return;
    let live = true;
    loadFor(h).then(() => { if (live) setT((n) => n + 1); });
    return () => { live = false; };
  }, [h]);
  return t;
}

/* The library, the search and the practice screens read verse counts straight
   off the hymns, so the app re-reads them as the bodies land. */
export function useBundledTick() {
  const [t, setT] = useState(tick);
  useEffect(() => {
    const f = () => setT(tick);
    subs.add(f);
    return () => { subs.delete(f); };
  }, []);
  return t;
}

/* ============================================================
   STUTI — the corpus the app fetches
   Hand-authored. The reader's texts are compiled into the app,
   so a new stotra has meant a deploy and an APK, and a deploy
   makes every device fetch the whole app again. This module lets
   the app read a catalogue of texts from a static host and fetch
   one the first time it is opened, keeping it on the device from
   then on (stuti-app/docs/corpus-delivery.md).

   Off until STUTI_CORPUS_URL is set (or, for a test, the
   localStorage key "stuti-corpus-url"). Wraps the generated
   catalogue the way stuti-count-sink.ts wraps the counter: never
   an edit to stuti-data.ts or stuti-texts.ts. Placed by
   tools/codemod/fix-corpus-seam.mjs, which also exposes the four
   catalogue helpers this needs and gives the reader a hook.
   ============================================================ */
import { useEffect, useState } from "react";
import { STUTI } from "./stuti-data";
import { STUTI_CORPUS_URL } from "./stuti-cloud-config";

type Row = { id: string; deity: string[]; title: string; deva: string; tel: string; author: string; lang: string; type: string; genre?: string; form?: string; set?: string; sort?: number; sakha?: string; first?: string; units: number; hash: string; bytes: number; file: string };
type Doc = { id: string; hash: string; title: string; deva: string; tel: string; author: string; blurb: string; sections: any[]; verses: any[]; names?: any[] };

const INDEX_KEY = "stuti-corpus-index", ETAG_KEY = "stuti-corpus-etag";
const REDIR_KEY = "stuti-corpus-redirects", REDIR_APPLIED = "stuti-corpus-redirects-applied";
const DB = "stuti-corpus", STORE = "texts";
const RITUAL = /ny[āa]sa|dig-?bandha/i;   // the same test stuti-texts.ts applies to a section heading

export const corpusUrl = (): string => {
  try { const o = localStorage.getItem("stuti-corpus-url"); if (o) return o.replace(/\/$/, ""); } catch (e) {}
  return (STUTI_CORPUS_URL || "").replace(/\/$/, "");
};
export const corpusOn = () => !!corpusUrl();

/* ---- the device's copy of each text ---- */
function idb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: "id" }); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function tx<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return idb().then((d) => new Promise<T>((res, rej) => { const q = f(d.transaction(STORE, mode).objectStore(STORE)); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }));
}
const stored = new Set<string>();   // ids known to be on the device, for the offline mark

/* ---- the catalogue rows become hymns ---- */
const byCorpusId: Record<string, any[]> = {};   // corpus id -> the hymn rows that carry it (one per shelf)
const placed = new Set<string>();   // corpus ids already given a tile, so the two passes are idempotent

/* Placement keys on the corpus id, never on the title. A row's id is unique by
   construction (folder + leading number, frozen — see docs/corpus-identity.md),
   so two rows can never collide, and the 152 texts the old title-join dropped
   (the whole Gurucaritam, every recension set, both forms of every pūjā) each
   keep their own tile. Title-match survives only as a claim-once bridge from a
   corpus row to a pre-existing curated/seed entry, so a "coming soon" stub is
   filled rather than duplicated beside its text. */
function place(rows: Row[]) {
  const S: any = STUTI as any, X = S._corpus;
  if (!S || !X) return 0;
  const hymns: any[] = S.hymns;
  /* the honorific allowance: the corpus writes "Śrī Subrahmaṇya Bhujaṅgam"
     where a seed shelf does not, and that is the same text */
  const norm = (s: string) => X.normTitle(s).replace(/^(sri|shri)/, "");
  const byId = new Map<string, any>(hymns.map((h) => [h.id, h]));

  /* the seeds a corpus row may bridge onto: pre-existing hymns not already
     carrying a corpus link (so a re-pass never re-bridges, and corpus-created
     tiles from an earlier pass are not themselves treated as seeds) */
  const seedKeys = new Map<string, any>();
  hymns.forEach((h) => { if (!h.corpus) seedKeys.set(h.deity + "|" + norm(h.title), h); });

  /* which row claims each seed: the first by file order, unless a later row has
     a cleaner title (no bracket, no number), which is the general text of a set
     rather than a named recension — "Durgā Stotram" fills the stub, not
     "Durgā Stotram (Yudhiṣṭhira-kṛtam)" */
  const isClean = (t: string) => !/[()\d]/.test(t);
  const chosen = new Map<string, { id: string; clean: boolean }>();
  for (const r of rows) for (const d of r.deity) {
    const key = d + "|" + norm(r.title);
    if (!seedKeys.has(key)) continue;
    const c = isClean(r.title), prev = chosen.get(key);
    if (!prev || (c && !prev.clean)) chosen.set(key, { id: r.id, clean: c });
  }

  /* fields the build now declares; the title guesses are the fallback only
     (docs/corpus-presentation.md). A shelf-less text (deity []) still gets one
     tile under "" so it is reachable through the genre lens and search, though
     it appears on no deity grid. */
  const carry = (h: any, r: Row) => {
    if (r.set) h.set = r.set;
    if (r.sakha) h.sakha = r.sakha;
    if (typeof r.sort === "number") h.sort = r.sort;
    if (r.first) h.first = r.first;
  };

  let added = 0;
  for (const r of rows) {
    if (placed.has(r.id)) { (byCorpusId[r.id] || []).forEach((h) => (h.corpusHash = r.hash)); continue; }
    let did = false;
    const shelves = r.deity && r.deity.length ? r.deity : [""];
    for (const d of shelves) {
      if (d && !S.deityById[d]) continue;
      const key = d + "|" + norm(r.title);
      const seed = seedKeys.get(key);
      if (seed && chosen.get(key)?.id === r.id) {
        /* bridge onto the seed. A seed that carries its own verses keeps them
           and is left untouched — the corpus copy of the same text is ignored
           on this shelf, and no duplicate tile is made. */
        if (!(seed.verses && seed.verses.length)) {
          if (!seed.corpus) { seed.corpus = r.id; seed.corpusHash = r.hash; seed.catalog = false; (byCorpusId[r.id] ||= []).push(seed); }
          else seed.corpusHash = r.hash;
        }
        carry(seed, r);
        did = true; continue;
      }
      /* its own tile, keyed on the id: slug of the title, disambiguated by the
         (unique) corpus id if two titles slug alike */
      let id = (d || "x") + "-" + X.slug(r.title);
      if (byId.has(id)) id = id + "-" + X.slug(r.id.replace(/\//g, "-"));
      const h: any = {
        id, deity: d, title: r.title, deva: r.deva, tel: r.tel,
        type: r.genre || X.typeOf(r.title), by: r.author || "Traditional", blurb: "",
        catalog: false,   // not "soon": the text is there to fetch
        verses: [], corpus: r.id, corpusHash: r.hash, lang: r.lang, corpusType: r.type,
      };
      h.form = r.form || X.assignForm(d, r.title);
      carry(h, r);
      hymns.push(h); byId.set(id, h); (byCorpusId[r.id] ||= []).push(h);
      did = true; added++;
    }
    if (did) placed.add(r.id);
  }
  return added;
}

function fill(h: any, doc: Doc) {
  const sections = (doc.sections || []).map((s: any) => ({ ...s, roman: s.roman || s.deva || "" }));
  sections.forEach((s: any) => { if (RITUAL.test(s.roman || "")) s.ritual = true; });
  h.verses = doc.verses || [];
  h.sections = sections;
  h.catalog = false;
  h.corpusHash = doc.hash;
  if (doc.blurb) h.blurb = doc.blurb;
  if (doc.names) h.names = doc.names;
  delete h._ritual;   // STUTI_RITUAL caches on the hymn; the verses are new
}

/* ---- retirement: the redirect map (docs/corpus-identity.md) ----
   A merge or refile retires an id; `redirects` carries from -> to (or to null
   when a text was withdrawn with no successor), so a saved reference migrates
   instead of dangling and an open lands on the successor instead of a 404. */
let redirects: Record<string, string | null> = {};
function resolveId(id: string | null | undefined): string | null {
  if (!id) return null;
  const seen = new Set<string>();
  while (id != null && id in redirects && !seen.has(id)) { seen.add(id); id = redirects[id]; }
  return id ?? null;
}
const hashStr = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return String(h); };

/* Rewrite the reader-state keys that hold a hymn id. Only ids named in the map
   are touched, so this is safe to run over keys that also hold other refs. */
function migrateState(mapText: string) {
  if (!redirects || !Object.keys(redirects).length) return;
  let done = ""; try { done = localStorage.getItem(REDIR_APPLIED) || ""; } catch (e) {}
  const stamp = hashStr(mapText);
  if (done === stamp) return;
  const idList = (key: string) => {
    try {
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(arr)) return;
      const out: any[] = []; const seen = new Set<string>();
      for (const v of arr) {
        if (typeof v !== "string") { out.push(v); continue; }
        if (!(v in redirects)) { if (!seen.has(v)) { seen.add(v); out.push(v); } continue; }
        const to = resolveId(v); if (to && !seen.has(to)) { seen.add(to); out.push(to); }
      }
      localStorage.setItem(key, JSON.stringify(out));
    } catch (e) {}
  };
  const idScalar = (key: string) => {
    try { const v = localStorage.getItem(key); if (v && v in redirects) { const to = resolveId(v); if (to) localStorage.setItem(key, to); else localStorage.removeItem(key); } } catch (e) {}
  };
  const refList = (key: string) => {
    try {
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(arr)) return;
      const out: any[] = [];
      for (const it of arr) {
        const ref = it && typeof it === "object" ? it.ref : null;
        if (typeof ref === "string" && ref in redirects) { const to = resolveId(ref); if (to) out.push({ ...it, ref: to }); }
        else out.push(it);
      }
      localStorage.setItem(key, JSON.stringify(out));
    } catch (e) {}
  };
  ["stuti-favs", "stuti-favs-week", "stuti-watch"].forEach(idList);
  ["stuti-last", "stuti-japa-last"].forEach(idScalar);
  refList("stuti-keep");
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i); if (!k || !k.startsWith("stuti-pos-")) continue;
      const from = k.slice("stuti-pos-".length);
      if (!(from in redirects)) continue;
      const to = resolveId(from), v = localStorage.getItem(k);
      localStorage.removeItem(k);
      if (to && v != null) localStorage.setItem("stuti-pos-" + to, v);
    }
  } catch (e) {}
  try { localStorage.setItem(REDIR_APPLIED, stamp); } catch (e) {}
}

function loadRedirects(text: string) {
  try {
    const list = JSON.parse(text || "[]");
    redirects = {};
    if (Array.isArray(list)) for (const e of list) if (e && e.from) redirects[e.from] = e.to ?? null;
    migrateState(text);
  } catch (e) { redirects = {}; }
}

/* ---- the index ---- */
export function applyCachedIndex() {
  if (!corpusOn()) return 0;
  try { loadRedirects(localStorage.getItem(REDIR_KEY) || "[]"); } catch (e) {}
  try { const rows: Row[] = JSON.parse(localStorage.getItem(INDEX_KEY) || "[]"); return place(rows); } catch (e) { return 0; }
}

export async function refreshIndex() {
  if (!corpusOn()) return;
  try {
    try {
      const rr = await fetch(corpusUrl() + "/redirects.json", { cache: "no-cache" });
      if (rr.ok) { const t = await rr.text(); try { localStorage.setItem(REDIR_KEY, t); } catch (e) {} loadRedirects(t); }
    } catch (e) {}
    const r = await fetch(corpusUrl() + "/index.json", { cache: "no-cache" });
    if (!r.ok) return;
    const etag = r.headers.get("etag") || "";
    const body = await r.json();
    const rows: Row[] = body.texts || [];
    try { localStorage.setItem(INDEX_KEY, JSON.stringify(rows)); localStorage.setItem(ETAG_KEY, etag); } catch (e) {}
    place(rows);
    window.dispatchEvent(new CustomEvent("stuti-corpus-index"));
  } catch (e) {}
}

/* ---- one text ---- */
const inflight: Record<string, Promise<Doc | null>> = {};
export function corpusText(h: any): Promise<Doc | null> {
  const rawId = h && h.corpus;
  const id = resolveId(rawId);   // a retired id lands on its successor, not a 404
  if (!id) return Promise.resolve(null);
  if (inflight[id]) return inflight[id];
  inflight[id] = (async () => {
    let doc: Doc | null = null;
    try { doc = (await tx<any>("readonly", (s) => s.get(id)))?.doc || null; } catch (e) {}
    const want = id === rawId ? h.corpusHash : undefined;   // a redirected id's hash is the successor's, not h's
    if (doc && (!want || doc.hash === want)) { stored.add(id); }
    else if (navigator.onLine !== false) {
      try {
        /* the file is named by its hash, so the row must be current; an old
           row asks for a file that is gone and the reader keeps waiting */
        let rows: Row[] = [];
        try { rows = JSON.parse(localStorage.getItem(INDEX_KEY) || "[]"); } catch (e) {}
        const row = rows.find((x) => x.id === id);
        if (row) {
          const r = await fetch(corpusUrl() + "/" + row.file, { cache: "force-cache" });
          if (r.ok) {
            doc = await r.json();
            try { await tx("readwrite", (s) => s.put({ id, hash: doc!.hash, doc })); stored.add(id); } catch (e) {}
          }
        }
      } catch (e) {}
    }
    if (doc) (byCorpusId[rawId] || [h]).forEach((x) => fill(x, doc!));
    delete inflight[id];
    return doc;
  })();
  return inflight[id];
}
export const corpusHas = (h: any) => { const id = resolveId(h && h.corpus); return !!(id && stored.has(id)); };

/* The reader calls this once per hymn; it returns a tick that changes when
   the text arrives, so the reader re-reads the hymn it was handed. */
export function useCorpusText(h: any) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!h || !h.corpus || (h.verses && h.verses.length)) return;
    let live = true;
    corpusText(h).then((d) => { if (live && d) setTick((n) => n + 1); });
    return () => { live = false; };
  }, [h]);
  return tick;
}

export function installCorpus() {
  applyCachedIndex();
  refreshIndex();
}

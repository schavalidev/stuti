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

type Row = { id: string; deity: string[]; title: string; deva: string; tel: string; author: string; lang: string; type: string; units: number; sections: any[]; hash: string; bytes: number; file: string };
type Doc = { id: string; hash: string; title: string; deva: string; tel: string; author: string; blurb: string; sections: any[]; verses: any[]; names?: any[] };

const INDEX_KEY = "stuti-corpus-index", ETAG_KEY = "stuti-corpus-etag";
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

function place(rows: Row[]) {
  const S: any = STUTI as any, X = S._corpus;
  if (!S || !X) return 0;
  const hymns: any[] = S.hymns;
  /* the same join stuti-data.ts uses between the curated shelf and the index,
     with one more allowance: the corpus writes the honorific ("Śrī Subrahmaṇya
     Bhujaṅgam") where the shelf does not, and that is the same text */
  const norm = (s: string) => X.normTitle(s).replace(/^(sri|shri)/, "");
  const curated = new Map<string, any>();
  hymns.forEach((h) => curated.set(h.deity + "|" + norm(h.title), h));
  const byId = new Map<string, any>(hymns.map((h) => [h.id, h]));
  let added = 0;
  for (const r of rows) {
    for (const d of r.deity) {
      if (!S.deityById[d]) continue;
      const key = d + "|" + norm(r.title);
      const have = curated.get(key) || byId.get(d + "-" + X.slug(r.title));
      if (have) {
        /* the shelf already lists this text: a curated hymn keeps its own verses,
           and a catalogue-only row ("coming soon") now has a text to fetch */
        if (have.verses && have.verses.length) continue;
        if (!have.corpus) { have.corpus = r.id; have.corpusHash = r.hash; have.catalog = false; (byCorpusId[r.id] ||= []).push(have); }
        else if (have.corpus === r.id) have.corpusHash = r.hash;
        continue;
      }
      const h: any = {
        id: d + "-" + X.slug(r.title), deity: d, title: r.title, deva: r.deva, tel: r.tel,
        type: X.typeOf(r.title), by: r.author || "Traditional", blurb: "",
        catalog: false,   // not "soon": the text is there to fetch
        verses: [], corpus: r.id, corpusHash: r.hash, lang: r.lang, corpusType: r.type,
      };
      h.form = X.assignForm(d, r.title);
      hymns.push(h); byId.set(h.id, h); curated.set(key, h); (byCorpusId[r.id] ||= []).push(h);
      added++;
    }
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

/* ---- the index ---- */
export function applyCachedIndex() {
  if (!corpusOn()) return 0;
  try { const rows: Row[] = JSON.parse(localStorage.getItem(INDEX_KEY) || "[]"); return place(rows); } catch (e) { return 0; }
}

export async function refreshIndex() {
  if (!corpusOn()) return;
  try {
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
  const id = h && h.corpus;
  if (!id) return Promise.resolve(null);
  if (inflight[id]) return inflight[id];
  inflight[id] = (async () => {
    let doc: Doc | null = null;
    try { doc = (await tx<any>("readonly", (s) => s.get(id)))?.doc || null; } catch (e) {}
    const want = h.corpusHash;
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
    if (doc) (byCorpusId[id] || [h]).forEach((x) => fill(x, doc!));
    delete inflight[id];
    return doc;
  })();
  return inflight[id];
}
export const corpusHas = (h: any) => !!(h && h.corpus && stored.has(h.corpus));

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

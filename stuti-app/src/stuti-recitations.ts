/* ============================================================
   STUTI — kept recitations
   Hand-authored. A recitation is a Follow session the reciter chose to
   keep: the audio, and the second at which the light entered each line,
   which is the cue table the designer's Listen mode was written for.
   Keeping one registers it with STUTI_AUDIO, so Listen appears for that
   hymn in the reciter's own voice.

   Where they live: on Android, files in the app's private storage
   (filesDir/recitations, through StutiVoskPlugin); on the web, IndexedDB
   in this browser. Nothing is uploaded anywhere.
   ============================================================ */
import { STUTI_AUDIO } from "./stuti-audio";
import type { Recitation } from "./stuti-vosk";
import { voskAvailable, voskDeleteRecording, voskFileUrl, voskKeepRecording, voskListRecordings, voskShareRecording } from "./stuti-vosk";

export type { Recitation };
type KeepInput = { hymn: string; title: string; lang: string; cues: number[]; lineCount: number; linesLit: number; blob?: Blob | null; dur?: number };

const native = () => voskAvailable();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((f) => { try { f(); } catch (e) {} });
export const onRecitationsChange = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f); }; };

/* ---- the web store: IndexedDB, one record per recitation, blob inside ---- */
const DB = "stuti-recitations", STORE = "recitations";
function idb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: "id" }).createIndex("hymn", "hymn"); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function tx<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return idb().then((d) => new Promise<T>((res, rej) => { const q = f(d.transaction(STORE, mode).objectStore(STORE)); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }));
}
const blobUrls: Record<string, string> = {};

/* ---- the list ---- */
export async function listRecitations(hymn: string): Promise<Recitation[]> {
  if (native()) { try { return await voskListRecordings(hymn); } catch (e) { return []; } }
  try {
    const all = (await tx<any[]>("readonly", (s) => s.getAll())) || [];
    return all.filter((r) => !hymn || r.hymn === hymn).sort((a, b) => b.at - a.at).map(({ blob, ...m }) => ({ ...m, size: blob ? blob.size : 0 }));
  } catch (e) { return []; }
}

/** The URL the reader plays a recitation from. */
export function recitationSrc(r: Recitation): string {
  if (native() && r.path) return voskFileUrl(r.path);
  return blobUrls[r.id] || "";
}
async function webBlobUrl(id: string): Promise<string> {
  if (blobUrls[id]) return blobUrls[id];
  try { const rec = await tx<any>("readonly", (s) => s.get(id)); if (rec && rec.blob) blobUrls[id] = URL.createObjectURL(rec.blob); } catch (e) {}
  return blobUrls[id] || "";
}

/* ---- keep, delete, share ---- */
export async function keepRecitation(input: KeepInput): Promise<Recitation> {
  let r: Recitation;
  if (native()) {
    r = await voskKeepRecording({ hymn: input.hymn, title: input.title, lang: input.lang, cues: input.cues, lineCount: input.lineCount, linesLit: input.linesLit });
  } else {
    if (!input.blob) throw new Error("nothing recorded");
    const id = input.hymn.replace(/[^A-Za-z0-9_-]/g, "_") + "-" + Date.now();
    const rec = { id, hymn: input.hymn, title: input.title, lang: input.lang, at: Date.now(), dur: input.dur || 0, lineCount: input.lineCount, linesLit: input.linesLit, cues: input.cues, blob: input.blob };
    await tx("readwrite", (s) => s.put(rec));
    const { blob, ...m } = rec;
    r = { ...m, size: blob.size };
    blobUrls[id] = URL.createObjectURL(blob);
  }
  await registerLatest(input.hymn);
  notify();
  return r;
}
export async function deleteRecitation(r: Recitation): Promise<void> {
  if (native()) await voskDeleteRecording(r.id);
  else { await tx("readwrite", (s) => s.delete(r.id)); if (blobUrls[r.id]) { URL.revokeObjectURL(blobUrls[r.id]); delete blobUrls[r.id]; } }
  await registerLatest(r.hymn);
  notify();
}
export async function shareRecitation(r: Recitation): Promise<void> {
  if (native()) { await voskShareRecording(r.id, r.title || "Stuti recitation"); return; }
  const rec = await tx<any>("readonly", (s) => s.get(r.id));
  if (!rec || !rec.blob) return;
  const file = new File([rec.blob], (r.title || "recitation").replace(/[^\w.-]+/g, "_") + ".webm", { type: rec.blob.type || "audio/webm" });
  const nav: any = navigator;
  if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) { await nav.share({ files: [file], title: r.title }); return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
}

/* ---- the registry: the latest kept recitation of a hymn is its Listen recording ---- */
export async function registerLatest(hymn: string): Promise<boolean> {
  const list = await listRecitations(hymn);
  const r = list[0];
  if (!r || !r.cues || r.cues.length < 1) { unregister(hymn); return false; }
  const src = native() ? recitationSrc(r) : await webBlobUrl(r.id);
  if (!src) return false;
  return STUTI_AUDIO.register({ [hymn]: { src, lines: r.cues, dur: r.dur, by: "you" } }) > 0;
}
function unregister(hymn: string) {
  /* the registry has no remove; an empty register() leaves the old entry —
     replace it with an impossible table so get() ignores it */
  try { (STUTI_AUDIO as any).register({ [hymn]: { src: "", lines: [0] } }); } catch (e) {}
}
/** At boot: every hymn with a kept recitation gets it registered. */
export async function registerKept(): Promise<void> {
  try {
    const all = await listRecitations("");
    const hymns = Array.from(new Set(all.map((r) => r.hymn)));
    for (const h of hymns) await registerLatest(h);
    notify();
  } catch (e) {}
}

/* ---- the web's ears also record: MediaRecorder on its own stream ---- */
export class WebCapture {
  private rec: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private t0 = 0;
  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];
    this.rec = new MediaRecorder(this.stream);
    this.rec.ondataavailable = (e) => { if (e.data && e.data.size) this.chunks.push(e.data); };
    this.rec.start(1000);
    this.t0 = Date.now();
  }
  get seconds() { return this.t0 ? (Date.now() - this.t0) / 1000 : 0; }
  stop(): Promise<{ blob: Blob | null; dur: number }> {
    return new Promise((res) => {
      const done = () => {
        if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
        const blob = this.chunks.length ? new Blob(this.chunks, { type: this.chunks[0].type }) : null;
        const dur = this.seconds;
        this.rec = null; this.stream = null; this.chunks = []; this.t0 = 0;
        res({ blob, dur });
      };
      if (this.rec && this.rec.state !== "inactive") { this.rec.onstop = done; try { this.rec.stop(); } catch (e) { done(); } }
      else done();
    });
  }
}

/* ---- helpers for the shelf ---- */
export const fmtDur = (s: number) => { const m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ":" + (r < 10 ? "0" : "") + r; };
export const fmtSize = (b: number) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");
export const fmtWhen = (at: number, lang: string) => {
  try { return new Date(at).toLocaleString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); }
  catch (e) { return new Date(at).toLocaleString(); }
};

/** Cue table from where the light went: the first second each line was
    entered. Lines the ears never caught are placed between their
    neighbours; the table must climb, so it is made to. */
export function cuesFrom(entered: Map<number, number>, lineCount: number, dur: number): number[] {
  const known: (number | null)[] = Array.from({ length: lineCount }, (_, i) => (entered.has(i) ? entered.get(i)! : null));
  if (known[0] == null) known[0] = 0;
  const out: number[] = new Array(lineCount);
  let i = 0;
  while (i < lineCount) {
    if (known[i] != null) { out[i] = known[i]!; i++; continue; }
    let j = i; while (j < lineCount && known[j] == null) j++;
    const a = out[i - 1], b = j < lineCount ? known[j]! : Math.max(dur, a + (j - i + 1) * 0.5);
    const n = j - i + 1;
    for (let k = i; k < j; k++) out[k] = a + ((b - a) * (k - i + 1)) / n;
    i = j;
  }
  for (let k = 1; k < lineCount; k++) if (!(out[k] > out[k - 1])) out[k] = out[k - 1] + 0.01;
  return out.map((v) => Math.round(v * 100) / 100);
}

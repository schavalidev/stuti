/* ============================================================
   STUTI — Follow's ears on the Android app (JS side of StutiVoskPlugin)
   Hand-authored. A streaming on-device recogniser that never closes the
   mic between phrases, exposed with the same shape the hook already
   speaks (lang, interimResults, onresult/onerror/onend, start, abort) so
   the alignment engine can't tell it from the browser's API.

   Opt-in by construction: nothing is downloaded until the user taps
   Follow and agrees; the model lives in the app's private storage and
   works offline from then on. Roman-script readers get the Hindi model —
   the sounds are the same, and an English model has no Sanskrit in it.
   ============================================================ */
import { Capacitor, registerPlugin } from "@capacitor/core";

type Handle = { remove: () => Promise<void> };
type Plugin = {
  modelStatus(o: { id: string }): Promise<{ ready: boolean }>;
  downloadModel(o: { id: string; url: string }): Promise<{ ready: boolean }>;
  deleteModel(o: { id: string }): Promise<void>;
  start(o: { id: string; grammar?: string[]; capture?: boolean }): Promise<void>;
  stop(): Promise<void>;
  vocab(o: { id: string }): Promise<{ words: string }>;
  shareSession(o: { log: string }): Promise<void>;
  log(o: { msg: string }): Promise<void>;
  note(o: { line: string; fresh?: boolean }): Promise<void>;
  addListener(ev: "partial" | "result" | "progress" | "error" | "level", fn: (d: any) => void): Promise<Handle>;
};

const Native = registerPlugin<Plugin>("StutiVosk");

export const VOSK_MODELS = {
  hi: { id: "vosk-model-small-hi-0.22", url: "https://alphacephei.com/vosk/models/vosk-model-small-hi-0.22.zip", mb: 45, label: "Hindi" },
  te: { id: "vosk-model-small-te-0.42", url: "https://alphacephei.com/vosk/models/vosk-model-small-te-0.42.zip", mb: 61, label: "Telugu" },
} as const;
export type VoskLang = keyof typeof VOSK_MODELS;

export const voskAvailable = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
/* Every script gets the Hindi ears. The Telugu model was tried on the
   founder's own chanting (Liṅgāṣṭakam, Telugu script, 55 s): one word.
   The Hindi model on the same audio: seventy-odd results with "liṅgam"
   on nearly every line. Matching is script-blind, so the ears can be. */
export const voskLangFor = (_script: string): VoskLang => "hi";

export async function voskModelReady(lang: VoskLang): Promise<boolean> {
  try { return (await Native.modelStatus({ id: VOSK_MODELS[lang].id })).ready; } catch (e) { return false; }
}

export async function voskDownload(lang: VoskLang, onProgress: (pct: number) => void): Promise<void> {
  const m = VOSK_MODELS[lang];
  const h = await Native.addListener("progress", (d: any) => { if (d && d.id === m.id) onProgress(Number(d.pct) || 0); });
  try { await Native.downloadModel({ id: m.id, url: m.url }); }
  finally { h.remove().catch(() => {}); }
}

/* the model's word list, read once per model and kept for the session */
const vocabCache: Partial<Record<VoskLang, Promise<string>>> = {};
export function voskVocab(lang: VoskLang): Promise<string> {
  const id = VOSK_MODELS[lang].id;
  if (!vocabCache[lang]) vocabCache[lang] = Native.vocab({ id }).then((r) => r.words).catch((e) => { delete vocabCache[lang]; throw e; });
  return vocabCache[lang]!;
}

/** A note into the phone's log (logcat), for a release build's silent console. */
export function voskLog(msg: string) { if (voskAvailable()) Native.log({ msg }).catch(() => {}); }

/** A line of the session log, onto the phone's disk as it happens. */
export function voskNote(line: string, fresh = false) { if (voskAvailable()) Native.note({ line, fresh }).catch(() => {}); }

/** Hand the last session (audio + the page's log) to another app, so a
    real chant can be replayed on a desk for tuning. */
export function voskShareSession(log: string): Promise<void> {
  return Native.shareSession({ log });
}

/** Same surface as SpeechRecognition, over the streaming plugin. `onend`
    fires only on abort() or an unrecoverable error — never on a pause. */
export class VoskRecognition {
  lang = "hi-IN";
  interimResults = true;
  continuous = true;
  maxAlternatives = 1;
  grammar: string[] | null = null;   // words the recogniser may output (see stuti-follow-grammar.ts)
  onresult: ((ev: any) => void) | null = null;
  onerror: ((ev: any) => void) | null = null;
  onend: (() => void) | null = null;
  onlevel: ((level: number) => void) | null = null;   // mic loudness 0..1, a few times a second
  onraw: ((text: string) => void) | null = null;      // the recogniser's words before "[unk]" is dropped
  private handles: Handle[] = [];
  private live = false;

  private emit(raw: string, isFinal: boolean) {
    /* in grammar mode the recogniser names what it could not place "[unk]";
       that is silence to the matcher, not a word */
    if (this.onraw) this.onraw(raw);
    const transcript = raw.replace(/\[unk\]/g, " ").replace(/\s+/g, " ").trim();
    if (!transcript) return;
    const result: any = [{ transcript, confidence: 1 }];
    result.isFinal = isFinal;
    if (this.onresult) this.onresult({ resultIndex: 0, results: [result] });
  }

  async start() {
    /* the same choice the download made — the script decides nothing now */
    const lang: VoskLang = voskLangFor(/^te/.test(this.lang) ? "telugu" : "deva");
    this.live = true;
    try {
      this.handles.push(await Native.addListener("partial", (d: any) => { if (this.live && d && d.text) this.emit(String(d.text), false); }));
      this.handles.push(await Native.addListener("result", (d: any) => { if (this.live && d && d.text) this.emit(String(d.text), true); }));
      this.handles.push(await Native.addListener("level", (d: any) => { if (this.live && this.onlevel) this.onlevel(Number(d && d.level) || 0); }));
      this.handles.push(await Native.addListener("error", (d: any) => {
        if (!this.live) return;
        if (this.onerror) this.onerror({ error: String((d && d.message) || "audio") });
      }));
      await Native.start({ id: VOSK_MODELS[lang].id, grammar: this.grammar || undefined, capture: true });
    } catch (e: any) {
      const msg = String((e && e.message) || e);
      this.live = false;
      this.cleanup();
      if (this.onerror) this.onerror({ error: /not-allowed/.test(msg) ? "not-allowed" : /model-missing/.test(msg) ? "model-missing" : msg });
      if (this.onend) this.onend();
    }
  }
  stop() { this.abort(); }
  abort() {
    if (!this.live) return;
    this.live = false;
    Native.stop().catch(() => {});
    this.cleanup();
    if (this.onend) this.onend();
  }
  private cleanup() {
    for (const h of this.handles) h.remove().catch(() => {});
    this.handles = [];
  }
}

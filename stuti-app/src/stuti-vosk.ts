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
  start(o: { id: string }): Promise<void>;
  stop(): Promise<void>;
  addListener(ev: "partial" | "result" | "progress" | "error", fn: (d: any) => void): Promise<Handle>;
};

const Native = registerPlugin<Plugin>("StutiVosk");

export const VOSK_MODELS = {
  hi: { id: "vosk-model-small-hi-0.22", url: "https://alphacephei.com/vosk/models/vosk-model-small-hi-0.22.zip", mb: 45, label: "Hindi" },
  te: { id: "vosk-model-small-te-0.42", url: "https://alphacephei.com/vosk/models/vosk-model-small-te-0.42.zip", mb: 61, label: "Telugu" },
} as const;
export type VoskLang = keyof typeof VOSK_MODELS;

export const voskAvailable = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
export const voskLangFor = (script: string): VoskLang => (script === "telugu" ? "te" : "hi");

export async function voskModelReady(lang: VoskLang): Promise<boolean> {
  try { return (await Native.modelStatus({ id: VOSK_MODELS[lang].id })).ready; } catch (e) { return false; }
}

export async function voskDownload(lang: VoskLang, onProgress: (pct: number) => void): Promise<void> {
  const m = VOSK_MODELS[lang];
  const h = await Native.addListener("progress", (d: any) => { if (d && d.id === m.id) onProgress(Number(d.pct) || 0); });
  try { await Native.downloadModel({ id: m.id, url: m.url }); }
  finally { h.remove().catch(() => {}); }
}

/** Same surface as SpeechRecognition, over the streaming plugin. `onend`
    fires only on abort() or an unrecoverable error — never on a pause. */
export class VoskRecognition {
  lang = "hi-IN";
  interimResults = true;
  continuous = true;
  maxAlternatives = 1;
  onresult: ((ev: any) => void) | null = null;
  onerror: ((ev: any) => void) | null = null;
  onend: (() => void) | null = null;
  private handles: Handle[] = [];
  private live = false;

  private emit(transcript: string, isFinal: boolean) {
    const result: any = [{ transcript, confidence: 1 }];
    result.isFinal = isFinal;
    if (this.onresult) this.onresult({ resultIndex: 0, results: [result] });
  }

  async start() {
    const lang: VoskLang = /^te/.test(this.lang) ? "te" : "hi";
    this.live = true;
    try {
      this.handles.push(await Native.addListener("partial", (d: any) => { if (this.live && d && d.text) this.emit(String(d.text), false); }));
      this.handles.push(await Native.addListener("result", (d: any) => { if (this.live && d && d.text) this.emit(String(d.text), true); }));
      this.handles.push(await Native.addListener("error", (d: any) => {
        if (!this.live) return;
        if (this.onerror) this.onerror({ error: String((d && d.message) || "audio") });
      }));
      await Native.start({ id: VOSK_MODELS[lang].id });
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

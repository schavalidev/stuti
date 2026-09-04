/* ============================================================
   STUTI — native speech recognition for the Android app
   The prototype's voice search uses the browser's Web Speech API
   (stuti-voice.tsx, generated — not edited here). Android's WebView
   exposes webkitSpeechRecognition as a constructor but has no speech
   backend behind it, so the mic button drew and then did nothing.
   Inside the native app this shim installs an adapter with the same
   surface (lang, interimResults, onresult/onerror/onend, start, abort)
   over the platform's own SpeechRecognizer via
   @capacitor-community/speech-recognition. It must be imported before
   anything that reads window.SpeechRecognition — main.tsx imports it
   first. In a plain browser (the PWA) it does nothing.

   Plugin contract on Android (read from its SpeechRecognition.java):
   with partialResults on, start() resolves IMMEDIATELY; every result —
   the final one included — arrives on the "partialResults" listener,
   and the end of recognition on "listeningState" { status: "stopped" }.
   The first version of this shim tore its listeners down as soon as
   start() resolved and therefore heard nothing.
   ============================================================ */
import { Capacitor } from "@capacitor/core";
import { SpeechRecognition as Native } from "@capacitor-community/speech-recognition";

type Handle = { remove: () => Promise<void> };
const MAX_LISTEN_MS = 20000;

class NativeSpeechRecognition {
  lang = "en-IN";
  interimResults = false;
  continuous = false;
  maxAlternatives = 1;
  onresult: ((ev: any) => void) | null = null;
  onerror: ((ev: any) => void) | null = null;
  onend: (() => void) | null = null;
  private handles: Handle[] = [];
  private done = false;
  private latest = "";
  private timer: any = null;

  private emit(transcript: string, isFinal: boolean) {
    const result: any = [{ transcript, confidence: 1 }];
    result.isFinal = isFinal;
    if (this.onresult) this.onresult({ resultIndex: 0, results: [result] });
  }

  async start() {
    this.done = false;
    this.latest = "";
    try {
      const { available } = await Native.available();
      if (!available) throw new Error("service-not-allowed");
      const perm: any = await Native.requestPermissions();
      const granted = perm && (perm.speechRecognition === "granted" || perm.microphone === "granted");
      if (!granted) throw new Error("not-allowed");

      this.handles.push(await Native.addListener("partialResults", (d: any) => {
        const t = d && d.matches && d.matches[0];
        if (!t || this.done) return;
        this.latest = String(t);
        this.emit(this.latest, false);
      }));
      this.handles.push(await Native.addListener("listeningState", (d: any) => {
        if (this.done || !d || d.status !== "stopped") return;
        // the recognizer has closed: the last partial is the answer
        if (this.latest) this.emit(this.latest, true);
        this.finish();
      }));
      this.timer = setTimeout(() => { if (!this.done) { if (this.latest) this.emit(this.latest, true); this.finish(); } }, MAX_LISTEN_MS);

      const res: any = await Native.start({
        language: this.lang,
        maxResults: this.maxAlternatives || 1,
        partialResults: true,
        popup: false,
      });
      // without partial results the plugin would resolve here with the
      // matches; with them on it resolves at once and the listeners do the
      // rest — but honour a result if one ever does come back this way
      const t = res && res.matches && res.matches[0];
      if (t && !this.done) { this.latest = String(t); this.emit(this.latest, true); this.finish(); }
    } catch (e: any) {
      if (this.done) return;
      if (this.onerror) this.onerror({ error: String((e && e.message) || e) });
      this.finish();
    }
  }

  stop() { Native.stop().catch(() => {}); }
  abort() {
    if (this.done) return;
    this.done = true;
    Native.stop().catch(() => {});
    this.cleanup();
    if (this.onend) this.onend();
  }

  private finish() {
    this.done = true;
    this.cleanup();
    if (this.onend) this.onend();
  }
  private cleanup() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    for (const h of this.handles) h.remove().catch(() => {});
    this.handles = [];
  }
}

if (Capacitor.isNativePlatform()) {
  (window as any).SpeechRecognition = NativeSpeechRecognition;
}

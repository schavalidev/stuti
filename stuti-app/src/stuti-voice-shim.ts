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

   Two things that contract does not say, and that cost the search its
   voice until 12 Sep 2026:

   "stopped" is not the end of recognition. The plugin sends it from
   onEndOfSpeech — the moment the speaker stops talking — and the
   recogniser's best and final transcript arrives AFTER that, on the same
   partialResults channel. A shim that finished on "stopped" therefore
   threw away the answer and kept, at best, a stale partial; when the
   partials had not started yet it kept nothing at all, and the mic button
   simply lit up and went out. So "stopped" now opens a short wait for the
   final text instead of ending the session.

   And an error never arrives at all. The plugin reports one by rejecting
   the start call, which with partialResults on it has already resolved;
   the rejection is dropped on the floor, no "stopped" is sent, and the
   button stays lit until a timeout with nothing to show. What the plugin
   does do on the way out is set its own listening flag false, so that flag
   is polled: when it goes down unannounced, the session ended badly and
   the shim says so.
   ============================================================ */
import { Capacitor } from "@capacitor/core";
import { SpeechRecognition as Native } from "@capacitor-community/speech-recognition";
import { journal } from "./stuti-journal";

type Handle = { remove: () => Promise<void> };
const MAX_LISTEN_MS = 20000;
/* how long after the speaker stops to wait for the recogniser's final say */
const SETTLE_MS = 1800;
/* how often to ask the plugin whether it is still listening */
const WATCH_MS = 600;

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
  private settle: any = null;
  private watch: any = null;
  private ended = false;     // the speaker has stopped; we are waiting on the final text
  private spoke = false;     // anything at all was heard this session

  private emit(transcript: string, isFinal: boolean) {
    const result: any = [{ transcript, confidence: 1 }];
    result.isFinal = isFinal;
    if (this.onresult) this.onresult({ resultIndex: 0, results: [result] });
  }

  /* the answer, and the end of the session */
  private settleNow(reason: string) {
    if (this.done) return;
    if (this.latest) { this.emit(this.latest, true); journal("voice", "heard " + this.lang + " · " + reason); }
    else { this.fail(this.spoke ? "no-match" : "no-speech"); return; }
    this.finish();
  }
  private fail(error: string) {
    if (this.done) return;
    journal("voice", "failed " + this.lang + " · " + error);
    if (this.onerror) this.onerror({ error });
    this.finish();
  }

  async start() {
    this.done = false; this.ended = false; this.spoke = false;
    this.latest = "";
    try {
      const { available } = await Native.available();
      if (!available) throw new Error("service-not-allowed");
      const perm: any = await Native.requestPermissions();
      const granted = perm && (perm.speechRecognition === "granted" || perm.microphone === "granted");
      if (!granted) throw new Error("not-allowed");
      this.lang = await usableLang(this.lang);

      this.handles.push(await Native.addListener("partialResults", (d: any) => {
        const t = d && d.matches && d.matches[0];
        if (!t || this.done) return;
        this.spoke = true;
        this.latest = String(t);
        /* after the speaker stopped this is the recogniser's final say, and
           it is worth more than the partial it replaces: take it and close */
        if (this.ended) { this.settleNow("final"); return; }
        this.emit(this.latest, false);
      }));
      this.handles.push(await Native.addListener("listeningState", (d: any) => {
        if (this.done || !d || d.status !== "stopped" || this.ended) return;
        /* the speaker has stopped, not the recogniser: give the final
           transcript its moment before settling for the last partial */
        this.ended = true;
        clearTimeout(this.settle);
        this.settle = setTimeout(() => this.settleNow("settled"), SETTLE_MS);
      }));
      this.timer = setTimeout(() => this.settleNow("timeout"), MAX_LISTEN_MS);

      const res: any = await Native.start({
        language: this.lang,
        maxResults: this.maxAlternatives || 1,
        partialResults: true,
        popup: false,
      });
      journal("voice", "listening " + this.lang);
      /* the plugin drops an error instead of delivering it (see the head of
         this file); its own listening flag going down is the only sign */
      /* the flag goes down a moment before "stopped" reaches this side, so a
         single reading down means nothing; two in a row mean no event is
         coming, and the session ended the way the plugin cannot report */
      let downFor = 0;
      this.watch = setInterval(async () => {
        if (this.done || this.ended) return;
        try {
          const s: any = await Native.isListening();
          if (s && s.listening !== false) { downFor = 0; return; }
          /* whatever was heard before it went quiet is still the answer */
          if (++downFor >= 2 && !this.ended) this.settleNow("plugin stopped without a word");
        } catch (e) { /* asking failed; the timeout still ends the session */ }
      }, WATCH_MS);

      // without partial results the plugin would resolve here with the
      // matches; with them on it resolves at once and the listeners do the
      // rest — but honour a result if one ever does come back this way
      const t = res && res.matches && res.matches[0];
      if (t && !this.done) { this.spoke = true; this.latest = String(t); this.settleNow("direct"); }
    } catch (e: any) {
      if (this.done) return;
      this.fail(String((e && e.message) || e));
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
    if (this.settle) { clearTimeout(this.settle); this.settle = null; }
    if (this.watch) { clearInterval(this.watch); this.watch = null; }
    for (const h of this.handles) h.remove().catch(() => {});
    this.handles = [];
  }
}

/* The search asks for the reading script's own language — Telugu for a
   Telugu reader. Not every phone has every one installed, and a recogniser
   asked for a language it does not hold fails the silent way described at
   the head of this file. Where the device will say what it has, an absent
   language falls back to one it does have; a device that answers nothing
   (most of them do not answer at all) is taken at its word and asked for
   what was wanted. Sanskrit hymn names survive the fallback: search folds
   every script to one key before it matches. */
const FALLBACK = ["hi-IN", "en-IN", "en-US"];
let known: string[] | null = null;
async function usableLang(want: string): Promise<string> {
  if (known === null) {
    known = [];
    /* the plugin answers this from an ordered broadcast to the phone's
       search app, which on a phone that has no such app may never come
       back — the mic must not wait on it, so the question is given a
       second and the session goes ahead with what was asked for */
    try {
      const r: any = await Promise.race([
        Native.getSupportedLanguages(),
        new Promise((res) => setTimeout(() => res(null), 1000)),
      ]);
      known = (r && r.languages || []).map(String);
    } catch (e) { known = []; }
  }
  if (!known.length) return want;                                  // the phone did not say
  const has = (t: string) => known!.some((l) => l.toLowerCase().replace("_", "-") === t.toLowerCase());
  if (has(want)) return want;
  const near = known.find((l) => l.toLowerCase().startsWith(want.slice(0, 2).toLowerCase()));
  const to = near || FALLBACK.find(has) || want;
  journal("voice", "no " + want + " on this phone · using " + to);
  return to;
}

if (Capacitor.isNativePlatform()) {
  (window as any).SpeechRecognition = NativeSpeechRecognition;
}

/* ============================================================
   STUTI — Follow: the reader listens and the light keeps pace
   Hand-authored (never regenerated). The hook owns the recogniser and
   drives the reader's own line/word highlight through the setters it is
   handed; the engine (stuti-follow-engine.ts) decides where the reciter
   is. Wired into the generated reader by tools/codemod/fix-follow-seam.mjs.

   Ears: on the Android app, Vosk (stuti-vosk.ts) — a streaming on-device
   recogniser that never closes the mic between phrases, the way the good
   voice-driven teleprompters work. Its language model is fetched only
   when the user taps Follow and agrees (size and Wi-Fi named), and works
   offline from then on. In a browser, the browser's own SpeechRecognition,
   which does stop after a pause and is restarted for as long as Follow is
   on. Recogniser language follows the reading script: Telugu for Telugu,
   Hindi for the rest.
   ============================================================ */
import React from "react";
import { Icon } from "./stuti-icons";
import { FollowEngine } from "./stuti-follow-engine";
import type { FollowStatus, Line } from "./stuti-follow-engine";
import { VOSK_MODELS, VoskRecognition, voskAvailable, voskDownload, voskLangFor, voskLog, voskModelReady, voskShareSession, voskVocab } from "./stuti-vosk";
import { grammarFor, indexVocab } from "./stuti-follow-grammar";

/* the vocabulary index per model and the grammar per text, built once */
const vocabIndex: Record<string, ReturnType<typeof indexVocab>> = {};
const grammars: Record<string, string[]> = {};
async function grammarForLines(voskLang: string, key: string, lines: Line[]): Promise<string[] | null> {
  if (grammars[key]) return grammars[key];
  try {
    const t0 = Date.now();
    if (!vocabIndex[voskLang]) vocabIndex[voskLang] = indexVocab(await voskVocab(voskLang as any));
    const t1 = Date.now();
    const g = grammarFor(lines.map((l) => l.deva || l.iast).join(" "), vocabIndex[voskLang]);
    if (g.length) g.push("[unk]");
    grammars[key] = g;
    voskLog("grammar " + key + ": " + g.length + " words; vocab " + (t1 - t0) + " ms, build " + (Date.now() - t1) + " ms");
    return g;
  } catch (e) {
    voskLog("no grammar: " + String(e && (e as any).message || e));
    console.warn("[follow] no grammar:", e);
    return null;   // free decoding still works, just noisier
  }
}

const T: Record<string, Record<string, string>> = {
  follow:      { roman: "Follow my voice",                  deva: "मेरी आवाज़ के साथ चलो",             telugu: "నా స్వరాన్ని అనుసరించు" },
  stop:        { roman: "Stop following",                   deva: "अनुसरण रोकें",                     telugu: "అనుసరణ ఆపు" },
  listening:   { roman: "Following your voice",             deva: "आपकी आवाज़ के साथ",                telugu: "మీ స్వరాన్ని అనుసరిస్తోంది" },
  lost:        { roman: "Lost you — keep chanting",         deva: "सुन नहीं पाया — जारी रखें",        telugu: "వినిపించలేదు — కొనసాగించండి" },
  done:        { roman: "Recitation complete",              deva: "पाठ पूर्ण हुआ",                    telugu: "పారాయణం పూర్తయింది" },
  denied:      { roman: "Microphone not allowed",           deva: "माइक्रोफ़ोन की अनुमति नहीं",         telugu: "మైక్రోఫోన్ అనుమతి లేదు" },
  unsupported: { roman: "Voice follow isn't available here", deva: "यहाँ आवाज़-अनुसरण उपलब्ध नहीं",   telugu: "ఇక్కడ స్వర-అనుసరణ అందుబాటులో లేదు" },
  needsModel:  { roman: "Follow needs a {mb} MB {label} voice model, downloaded once (Wi-Fi recommended). It stays on this phone and works offline.",
                 deva:  "अनुसरण के लिए {mb} MB का {label} वॉइस मॉडल एक बार डाउनलोड होगा (Wi-Fi बेहतर)। यह फ़ोन पर रहेगा और ऑफ़लाइन चलेगा।",
                 telugu:"అనుసరణకు {mb} MB {label} వాయిస్ మోడల్ ఒకసారి డౌన్‌లోడ్ అవుతుంది (Wi-Fi మంచిది). ఇది ఫోన్‌లోనే ఉండి ఆఫ్‌లైన్‌లో పనిచేస్తుంది." },
  download:    { roman: "Download",                         deva: "डाउनलोड करें",                     telugu: "డౌన్‌లోడ్" },
  notNow:      { roman: "Not now",                          deva: "अभी नहीं",                          telugu: "ఇప్పుడు కాదు" },
  downloading: { roman: "Downloading the voice model… {pct}%", deva: "वॉइस मॉडल डाउनलोड हो रहा है… {pct}%", telugu: "వాయిస్ మోడల్ డౌన్‌లోడ్ అవుతోంది… {pct}%" },
  failed:      { roman: "Download failed — check the connection and try again", deva: "डाउनलोड विफल — कनेक्शन देखकर फिर कोशिश करें", telugu: "డౌన్‌లోడ్ విఫలం — కనెక్షన్ చూసి మళ్లీ ప్రయత్నించండి" },
  langLabel:   { roman: "{label}", deva: "{label}", telugu: "{label}" },
};
const MODEL_LABEL: Record<string, Record<string, string>> = {
  hi: { roman: "Hindi", deva: "हिन्दी", telugu: "హిందీ" },
  te: { roman: "Telugu", deva: "तेलुगु", telugu: "తెలుగు" },
};
const t = (k: string, lang: string, vars: Record<string, string | number> = {}) => {
  let s = (T[k] && (T[k][lang] || T[k].roman)) || k;
  for (const [a, b] of Object.entries(vars)) s = s.replace("{" + a + "}", String(b));
  return s;
};
const BrowserSR = () => (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

type Status = FollowStatus | "denied" | "unsupported" | "needs-model" | "downloading" | "failed";
type Args = {
  hymn: any; lines: Line[]; lang: string; active: number;
  setActive: (i: number) => void; setWord: (w: number) => void; setPlaying: (p: boolean) => void;
  onDone?: () => void;
};

export function useFollow({ hymn, lines, lang, active, setActive, setWord, setPlaying, onDone }: Args) {
  const [on, setOn] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");
  const [pct, setPct] = React.useState(0);
  const [heard, setHeard] = React.useState("");   // the last thing the ears reported — shown in the chip
  const [events, setEvents] = React.useState(0);  // how many results have arrived (0 = the ears are silent)
  const eng = React.useRef<FollowEngine | null>(null);
  const rec = React.useRef<any>(null);
  const onRef = React.useRef(false);
  const applied = React.useRef(-1);       // last line WE set — a different `active` means the reciter tapped
  const doneRef = React.useRef(false);
  const restartTimer = React.useRef<any>(null);
  const log = React.useRef<string[]>([]);      // this session, for sharing: what was heard and where the light went
  const t0 = React.useRef(0);
  const grammar = React.useRef<string[] | null>(null);
  const native = voskAvailable();
  const supported = native || !!BrowserSR();
  const voskLang = voskLangFor(lang);

  const apply = (pos: { line: number; word: number }) => {
    applied.current = pos.line;
    setActive(pos.line);
    /* the reader resets its word index on every line change (an effect that
       runs after ours would); set the word once that has happened */
    setTimeout(() => setWord(pos.word), 0);
  };

  const noteTimer = () => { setTimeout(() => setStatus((s) => (s === "denied" || s === "unsupported" || s === "failed" ? "idle" : s)), 5000); };

  const wire = (r: any) => {
    r.lang = lang === "telugu" ? "te-IN" : "hi-IN";
    r.interimResults = true;
    r.continuous = true;
    r.maxAlternatives = 1;
    r.onresult = (ev: any) => {
      if (!onRef.current || !eng.current) return;
      const last = ev.results[ev.results.length - 1];
      if (!last) return;
      setHeard(String(last[0].transcript || "").slice(-60));
      console.log("[follow] heard:", last[0].transcript, last.isFinal ? "(final)" : "");
      setEvents((n) => n + 1);
      const moved = eng.current.hear(last[0].transcript, !!last.isFinal);
      log.current.push(((Date.now() - t0.current) / 1000).toFixed(2) + (last.isFinal ? " F " : " p ") + last[0].transcript + (moved ? "  -> " + moved.line + ":" + moved.word : ""));
      if (log.current.length > 4000) log.current.splice(0, 1000);
      if (moved) apply(moved);
      const st = eng.current.status;
      setStatus(st);
      if (st === "done" && !doneRef.current) { doneRef.current = true; onDone && onDone(); }
    };
    r.onerror = (ev: any) => {
      const e = String((ev && ev.error) || "");
      if (/not-allowed|service-not-allowed|denied/.test(e)) stop("denied");
      else if (/model-missing/.test(e)) stop("needs-model");
      /* "no-speech" and friends just mean a quiet stretch */
    };
    r.onend = () => {
      rec.current = null;
      /* the browser's recogniser closes after a pause: reopen it. Vosk only
         ends when we stop it, so this never loops there. */
      if (onRef.current && !native) restartTimer.current = setTimeout(listen, 250);
    };
  };

  const listen = () => {
    if (!onRef.current) return;
    let r: any;
    try { r = native ? new VoskRecognition() : new (BrowserSR())(); } catch (e) { stop("unsupported"); return; }
    wire(r);
    if (native) r.grammar = grammar.current;
    rec.current = r;
    try { r.start(); } catch (e) { if (!native) restartTimer.current = setTimeout(listen, 800); }
  };

  const begin = async () => {
    setPlaying(false);
    eng.current = new FollowEngine(lines);
    eng.current.seek(active < 0 ? 0 : active);
    doneRef.current = false;
    applied.current = active;
    onRef.current = true;
    setOn(true);
    setStatus("listening");
    setHeard(""); setEvents(0);
    t0.current = Date.now();
    log.current = ["# Stuti Follow " + new Date().toISOString() + " hymn=" + (hymn && hymn.id) + " lang=" + lang + " ears=" + (native ? "vosk-" + voskLang : "browser")];
    grammar.current = null;
    if (native && voskLang === "hi") {
      /* the stotra's own sounds as the recogniser's vocabulary; built once
         per text, from the model's word list. Hindi ears need it — their
         vocabulary has no Sanskrit. Telugu ears are left free: Telugu is
         full of Sanskrit and the model already knows most of the words,
         and a grammar only takes its language model away. */
      grammar.current = await grammarForLines(voskLang, (hymn && hymn.id) + ":" + voskLang, lines);
      log.current.push("# grammar " + (grammar.current ? grammar.current.length + " words" : "none"));
      if (!onRef.current) return;   // stopped while the grammar was being built
    }
    listen();
  };
  const share = () => {
    if (!native) return;
    voskShareSession(log.current.join("\n")).catch(() => {});
  };

  const start = async () => {
    if (!supported) { setStatus("unsupported"); noteTimer(); return; }
    if (native && !(await voskModelReady(voskLang))) { setStatus("needs-model"); return; }
    begin();
  };
  const download = async () => {
    setStatus("downloading"); setPct(0);
    try { await voskDownload(voskLang, setPct); begin(); }
    catch (e) { setStatus("failed"); noteTimer(); }
  };
  const dismiss = () => setStatus("idle");

  const stop = (why?: Status) => {
    onRef.current = false;
    setOn(false);
    if (restartTimer.current) { clearTimeout(restartTimer.current); restartTimer.current = null; }
    try { rec.current && rec.current.abort(); } catch (e) {}
    rec.current = null;
    if (why) { setStatus(why); if (why !== "needs-model") noteTimer(); } else setStatus("idle");
  };
  const toggle = () => (on ? stop() : start());
  const showChip = on || ["denied", "unsupported", "needs-model", "downloading", "failed"].includes(status);

  /* the reciter tapped another line: follow them, don't fight them */
  React.useEffect(() => {
    if (on && eng.current && active !== applied.current && active >= 0) { eng.current.seek(active); applied.current = active; }
  }, [active, on]);
  /* a new script changes the recogniser language: restart the ears */
  React.useEffect(() => { if (on) { stop(); start(); } }, [lang]);   // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => () => stop(), [hymn && hymn.id]);            // leaving the text stops listening

  return { on, status, pct, heard, events, supported, native, showChip, voskLang, start, stop, toggle, download, dismiss, share };
}

export function FollowButton({ follow, lang }: { follow: ReturnType<typeof useFollow>; lang: string }) {
  if (!follow.supported) return null;
  const label = follow.on ? t("stop", lang) : t("follow", lang);
  /* a long press on the mic shares the last session (its audio and what
     was heard) — the founder's way of getting a real chant onto a desk */
  const held = React.useRef(false);
  const timer = React.useRef<any>(null);
  const down = () => { held.current = false; clearTimeout(timer.current); timer.current = setTimeout(() => { held.current = true; follow.share(); }, 650); };
  const up = () => clearTimeout(timer.current);
  const click = () => { if (held.current) { held.current = false; return; } follow.toggle(); };
  return (
    <button type="button" className={"icon-btn rd-follow-btn" + (follow.on ? " is-on" : "") + (follow.status === "lost" ? " is-lost" : "")}
      onClick={click} onPointerDown={down} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}
      onContextMenu={(e) => { e.preventDefault(); }}
      aria-pressed={follow.on} aria-label={label} title={label}>
      <Icon name="mic" size={20} />
    </button>
  );
}

export function FollowChip({ follow, lang }: { follow: ReturnType<typeof useFollow>; lang: string }) {
  const st = follow.status === "idle" ? "listening" : follow.status;
  const m = VOSK_MODELS[follow.voskLang];
  const label = (MODEL_LABEL[follow.voskLang] || {})[lang] || m.label;
  if (st === "needs-model") {
    return (
      <div className="rd-follow-chip is-needs-model" role="dialog" aria-live="polite">
        <span>{t("needsModel", lang, { mb: m.mb, label })}</span>
        <span className="rd-follow-actions">
          <button type="button" className="rd-follow-act primary" onClick={follow.download}>{t("download", lang)}</button>
          <button type="button" className="rd-follow-act" onClick={follow.dismiss}>{t("notNow", lang)}</button>
        </span>
      </div>
    );
  }
  const text = st === "downloading" ? t("downloading", lang, { pct: follow.pct }) : t(st, lang);
  /* what the ears last reported: the reciter sees that they are heard (as
     every voice teleprompter shows), and a chip that stays empty says the
     ears are silent rather than the matcher lost */
  const showHeard = follow.on && (st === "listening" || st === "lost");
  return (
    <div className={"rd-follow-chip is-" + st} role="status" aria-live="polite">
      <span className="rd-follow-dot" aria-hidden="true" />
      <span className="rd-follow-text">
        <span>{text}</span>
        {showHeard && <span className="rd-follow-heard">{follow.events ? "“" + follow.heard + "”" : "…"}</span>}
      </span>
    </div>
  );
}

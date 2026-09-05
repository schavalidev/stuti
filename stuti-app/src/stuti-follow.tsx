/* ============================================================
   STUTI — Follow: the reader listens and the light keeps pace
   Hand-authored (never regenerated). The hook owns the recogniser loop
   and drives the reader's own line/word highlight through the setters
   it is handed; the engine (stuti-follow-engine.ts) decides where the
   reciter is. Wired into the generated reader by
   tools/codemod/fix-follow-seam.mjs, which also passes the ledger call.

   Recogniser: the browser's SpeechRecognition — on the Android app that
   is the native adapter from stuti-voice-shim.ts. Both stop after a
   pause, so the loop restarts them for as long as Follow is on.
   Language follows the reading script: Telugu for Telugu, Hindi for the
   rest — Sanskrit through Hindi ears beats Sanskrit through English ones.
   ============================================================ */
import React from "react";
import { Icon } from "./stuti-icons";
import { FollowEngine } from "./stuti-follow-engine";
import type { FollowStatus, Line } from "./stuti-follow-engine";

const T: Record<string, Record<string, string>> = {
  follow:      { roman: "Follow my voice",                 deva: "मेरी आवाज़ के साथ चलो",            telugu: "నా స్వరాన్ని అనుసరించు" },
  stop:        { roman: "Stop following",                  deva: "अनुसरण रोकें",                    telugu: "అనుసరణ ఆపు" },
  listening:   { roman: "Following your voice",            deva: "आपकी आवाज़ के साथ",               telugu: "మీ స్వరాన్ని అనుసరిస్తోంది" },
  lost:        { roman: "Lost you — keep chanting",        deva: "सुन नहीं पाया — जारी रखें",       telugu: "వినిపించలేదు — కొనసాగించండి" },
  done:        { roman: "Recitation complete",             deva: "पाठ पूर्ण हुआ",                   telugu: "పారాయణం పూర్తయింది" },
  denied:      { roman: "Microphone not allowed",          deva: "माइक्रोफ़ोन की अनुमति नहीं",        telugu: "మైక్రోఫోన్ అనుమతి లేదు" },
  unsupported: { roman: "Voice follow isn't available here", deva: "यहाँ आवाज़-अनुसरण उपलब्ध नहीं",  telugu: "ఇక్కడ స్వర-అనుసరణ అందుబాటులో లేదు" },
};
const t = (k: string, lang: string) => (T[k] && (T[k][lang] || T[k].roman)) || k;
const SR = () => (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

type Args = {
  hymn: any; lines: Line[]; lang: string; active: number;
  setActive: (i: number) => void; setWord: (w: number) => void; setPlaying: (p: boolean) => void;
  onDone?: () => void;
};

export function useFollow({ hymn, lines, lang, active, setActive, setWord, setPlaying, onDone }: Args) {
  const [on, setOn] = React.useState(false);
  const [status, setStatus] = React.useState<FollowStatus | "denied" | "unsupported">("idle");
  const eng = React.useRef<FollowEngine | null>(null);
  const rec = React.useRef<any>(null);
  const onRef = React.useRef(false);
  const applied = React.useRef(-1);       // last line WE set — a different `active` means the reciter tapped
  const doneRef = React.useRef(false);
  const restartTimer = React.useRef<any>(null);
  const supported = !!SR();

  const apply = (pos: { line: number; word: number }) => {
    applied.current = pos.line;
    setActive(pos.line);
    /* the reader resets its word index on every line change (an effect that
       runs after ours would); set the word once that has happened */
    setTimeout(() => setWord(pos.word), 0);
  };

  const listen = () => {
    const S = SR();
    if (!S || !onRef.current) return;
    let r: any;
    try { r = new S(); } catch (e) { setStatus("unsupported"); return; }
    r.lang = lang === "telugu" ? "te-IN" : "hi-IN";
    r.interimResults = true;
    r.continuous = true;      // honoured by Chrome; the native adapter restarts instead
    r.maxAlternatives = 1;
    r.onresult = (ev: any) => {
      if (!onRef.current || !eng.current) return;
      const last = ev.results[ev.results.length - 1];
      if (!last) return;
      const moved = eng.current.hear(last[0].transcript, !!last.isFinal);
      if (moved) apply(moved);
      const st = eng.current.status;
      setStatus(st);
      if (st === "done" && !doneRef.current) { doneRef.current = true; onDone && onDone(); }
    };
    r.onerror = (ev: any) => {
      const e = String((ev && ev.error) || "");
      if (/not-allowed|service-not-allowed|denied/.test(e)) { stop("denied"); }
      /* "no-speech" and friends just mean a quiet stretch; onend restarts */
    };
    r.onend = () => {
      rec.current = null;
      if (onRef.current) restartTimer.current = setTimeout(listen, 250);
    };
    rec.current = r;
    try { r.start(); } catch (e) { restartTimer.current = setTimeout(listen, 800); }
  };

  const start = () => {
    if (!supported) { setStatus("unsupported"); noteTimer(); return; }
    setPlaying(false);
    eng.current = new FollowEngine(lines);
    eng.current.seek(active < 0 ? 0 : active);
    doneRef.current = false;
    applied.current = active;
    onRef.current = true;
    setOn(true);
    setStatus("listening");
    listen();
  };
  /* a refusal has to be SEEN: "denied"/"unsupported" outlive the stop, show
     in the chip for a few seconds, and clear on the next tap */
  const noteTimer = () => { setTimeout(() => setStatus((s) => (s === "denied" || s === "unsupported" ? "idle" : s)), 4000); };
  const stop = (why?: "denied") => {
    onRef.current = false;
    setOn(false);
    if (restartTimer.current) { clearTimeout(restartTimer.current); restartTimer.current = null; }
    try { rec.current && rec.current.abort(); } catch (e) {}
    rec.current = null;
    if (why) { setStatus(why); noteTimer(); } else setStatus("idle");
  };
  const toggle = () => (on ? stop() : start());
  const showChip = on || status === "denied" || status === "unsupported";

  /* the reciter tapped another line: follow them, don't fight them */
  React.useEffect(() => {
    if (on && eng.current && active !== applied.current && active >= 0) { eng.current.seek(active); applied.current = active; }
  }, [active, on]);
  /* a new script changes the recogniser language: restart the loop */
  React.useEffect(() => { if (on) { try { rec.current && rec.current.abort(); } catch (e) {} } }, [lang]);
  React.useEffect(() => () => stop(), [hymn && hymn.id]);   // leaving the text stops listening

  return { on, status, supported, showChip, start, stop, toggle };
}

export function FollowButton({ follow, lang }: { follow: ReturnType<typeof useFollow>; lang: string }) {
  if (!follow.supported) return null;
  const label = follow.on ? t("stop", lang) : t("follow", lang);
  return (
    <button type="button" className={"icon-btn rd-follow-btn" + (follow.on ? " is-on" : "") + (follow.status === "lost" ? " is-lost" : "")}
      onClick={follow.toggle} aria-pressed={follow.on} aria-label={label} title={label}>
      <Icon name="mic" size={20} />
    </button>
  );
}

export function FollowChip({ follow, lang }: { follow: ReturnType<typeof useFollow>; lang: string }) {
  const k = follow.status === "idle" ? "listening" : follow.status;
  return (
    <div className={"rd-follow-chip is-" + k} role="status" aria-live="polite">
      <span className="rd-follow-dot" aria-hidden="true" />
      <span>{t(k, lang)}</span>
    </div>
  );
}

import { Icon } from "./stuti-icons";
import React from "react";
import { STUTI_L } from "./stuti-i18n";

/* ============================================================
   STUTI — voice search
   One microphone for every search field. Speech recognition is the
   browser's own (Web Speech API); where it is absent the button is
   simply not drawn, so no field promises a microphone it cannot keep.
   The recognition language follows the UI script — Hindi for
   Devanāgarī, Telugu for Telugu, Indian English for Roman — so a
   spoken "Lalitā sahasranāmam" lands in the script the search folds.
   ============================================================ */
const VOICE_SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const VOICE_LANG = { deva: "hi-IN", telugu: "te-IN", roman: "en-IN" };

function VoiceButton({ lang = "deva", onResult, onInterim, autoStart = false, size = 18, className = "" }) {
  const L = STUTI_L;
  const [state, setState] = React.useState("idle"); // idle | listening | error
  const recRef = React.useRef(null);
  const stop = () => { try { recRef.current && recRef.current.abort(); } catch (e) {} recRef.current = null; setState("idle"); };
  const start = () => {
    if (!VOICE_SR) return;
    stop();
    const r = new VOICE_SR();
    r.lang = VOICE_LANG[lang] || "en-IN";
    r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
    let finalText = "";
    r.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalText += t; else interim += t;
      }
      if (finalText) { onResult && onResult(finalText.trim()); }
      else if (interim && onInterim) onInterim(interim.trim());
    };
    r.onerror = () => { setState("error"); recRef.current = null; setTimeout(() => setState("idle"), 1400); };
    r.onend = () => { recRef.current = null; setState((s) => (s === "error" ? s : "idle")); };
    recRef.current = r;
    try { r.start(); setState("listening"); } catch (e) { setState("idle"); }
  };
  React.useEffect(() => { if (autoStart) start(); return stop; }, []);
  if (!VOICE_SR) return null;
  const label = state === "listening" ? L.t("voiceListening", lang) : L.t("aVoice", lang);
  return (
    <button type="button" className={"voice-btn" + (state === "listening" ? " is-listening" : "") + (state === "error" ? " is-error" : "") + (className ? " " + className : "")}
      onClick={() => (state === "listening" ? stop() : start())} aria-label={label} aria-pressed={state === "listening"} title={label}>
      <Icon name="mic" size={size} />
    </button>
  );
}

export const STUTI_VOICE = { supported: !!VOICE_SR };
export { VoiceButton };

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
import { relayFollowSession } from "./stuti-relay";
import { VOSK_MODELS, VoskRecognition, voskAvailable, voskDownload, voskLangFor, voskLog, voskModelReady, voskNote, voskShareSession, voskVocab } from "./stuti-vosk";
import { grammarFor, indexVocab } from "./stuti-follow-grammar";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_L } from "./stuti-i18n";
import { WebCapture, cuesCover, cuesFrom, deleteRecitation, fmtDur, fmtSize, fmtWhen, keepRecitation, listRecitations, onRecitationsChange, recitationSrc, shareRecitation } from "./stuti-recitations";
import type { Recitation } from "./stuti-recitations";

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
  follow:      { roman: "Follow my voice",                  deva: "मेरी आवाज़ के साथ चलो",             telugu: "నా గొంతును అనుసరించు" },
  stop:        { roman: "Stop following",                   deva: "अनुसरण रोकें",                     telugu: "అనుసరణ ఆపు" },
  listening:   { roman: "Following your voice",             deva: "आपकी आवाज़ के साथ",                telugu: "మీ గొంతును అనుసరిస్తోంది" },
  lost:        { roman: "Lost you — keep chanting",         deva: "सुन नहीं पाया — जारी रखें",        telugu: "వినిపించలేదు — కొనసాగించండి" },
  done:        { roman: "Recitation complete",              deva: "पाठ पूर्ण हुआ",                    telugu: "పారాయణం పూర్తయింది" },
  denied:      { roman: "Microphone not allowed",           deva: "माइक्रोफ़ोन की अनुमति नहीं",         telugu: "మైక్రోఫోన్ అనుమతి లేదు" },
  unsupported: { roman: "Voice follow isn't available here", deva: "यहाँ आवाज़-अनुसरण उपलब्ध नहीं",   telugu: "ఇక్కడ గొంతును అనుసరించడం కుదరదు" },
  needsModel:  { roman: "Follow needs a {mb} MB {label} voice model, downloaded once (Wi-Fi recommended). It stays on this phone and works offline.",
                 deva:  "अनुसरण के लिए {mb} MB का {label} वॉइस मॉडल एक बार डाउनलोड होगा (Wi-Fi बेहतर)। यह फ़ोन पर रहेगा और ऑफ़लाइन चलेगा।",
                 telugu:"అనుసరణకు {mb} MB {label} వాయిస్ మోడల్ ఒకసారి డౌన్‌లోడ్ అవుతుంది (Wi-Fi మంచిది). ఇది ఫోన్‌లోనే ఉండి ఆఫ్‌లైన్‌లో పనిచేస్తుంది." },
  download:    { roman: "Download",                         deva: "डाउनलोड करें",                     telugu: "డౌన్‌లోడ్" },
  notNow:      { roman: "Not now",                          deva: "अभी नहीं",                          telugu: "ఇప్పుడు కాదు" },
  downloading: { roman: "Downloading the voice model… {pct}%", deva: "वॉइस मॉडल डाउनलोड हो रहा है… {pct}%", telugu: "వాయిస్ మోడల్ డౌన్‌లోడ్ అవుతోంది… {pct}%" },
  failed:      { roman: "Download failed — check the connection and try again", deva: "डाउनलोड विफल — कनेक्शन देखकर फिर कोशिश करें", telugu: "డౌన్‌లోడ్ విఫలం — కనెక్షన్ చూసి మళ్లీ ప్రయత్నించండి" },
  langLabel:   { roman: "{label}", deva: "{label}", telugu: "{label}" },
  /* recording a recitation */
  recordTitle: { roman: "Record this recitation",           deva: "यह पाठ रिकॉर्ड करें",                telugu: "ఈ పాఠం రెకార్డు చేయి" },
  recording:   { roman: "Recording · {t}",                  deva: "रिकॉर्ड हो रहा है · {t}",            telugu: "రెకార్డు అవుతోంది · {t}" },
  keepQ:       { roman: "Keep this recitation? {dur} · {lit} of {n} lines followed.",
                 deva:  "यह पाठ रखें? {dur} · {n} में से {lit} पंक्तियाँ पहचानी गईं।",
                 telugu:"ఈ పాఠం ఉంచాలా? {dur} · {n}లో {lit} పంక్తులు గుర్తించబడ్డాయి." },
  keepWhere:   { roman: "It stays on this phone only, under this stotra. Nothing is uploaded.",
                 deva:  "यह केवल इस फ़ोन पर, इसी स्तोत्र के नीचे रहेगा। कुछ भी अपलोड नहीं होता।",
                 telugu:"ఇది ఈ ఫోన్‌లోనే, ఈ స్తోత్రం కింద ఉంటుంది. ఏదీ అప్‌లోడ్ కాదు." },
  keepWhereWeb:{ roman: "It stays in this browser only, under this stotra. Nothing is uploaded.",
                 deva:  "यह केवल इस ब्राउज़र में, इसी स्तोत्र के नीचे रहेगा। कुछ भी अपलोड नहीं होता।",
                 telugu:"ఇది ఈ బ్రౌజర్‌లోనే, ఈ స్తోత్రం కింద ఉంటుంది. ఏదీ అప్‌లోడ్ కాదు." },
  keep:        { roman: "Keep",                             deva: "रखें",                              telugu: "ఉంచు" },
  kept:        { roman: "Kept · {dur}. Hear it under {learn} → {listen}, or from ● beside the title.",
                 deva:  "रख लिया · {dur}। इसे {learn} → {listen} में, या शीर्षक के पास ● से सुनें।",
                 telugu:"ఉంచాం · {dur}. {learn} → {listen}లో, లేదా శీర్షిక పక్క ● నుండి వినండి." },
  keepFailed:  { roman: "Could not keep it — try again",    deva: "रख नहीं सका — फिर कोशिश करें",        telugu: "ఉంచలేకపోయాం — మళ్లీ ప్రయత్నించండి" },
  shelf:       { roman: "My recitations",                   deva: "मेरे पाठ",                           telugu: "నా పఠనాలు" },
  shelfEmpty:  { roman: "None yet. Tap the mic beside the title, then Record.", deva: "अभी कोई नहीं। शीर्षक के पास माइक दबाएँ, फिर रिकॉर्ड।", telugu: "ఇంకా లేవు. శీర్షిక పక్క మైక్ నొక్కి, రెకార్డు నొక్కండి." },
  /* (labels of the learn bar come from the app's own strings at render time) */
  linesOf:     { roman: "{lit} of {n} lines",               deva: "{n} में से {lit} पंक्तियाँ",          telugu: "{n}లో {lit} పంక్తులు" },
  share:       { roman: "Share",                            deva: "साझा करें",                           telugu: "పంచు" },
  del:         { roman: "Delete",                           deva: "हटाएँ",                              telugu: "తీసేయి" },
  sure:        { roman: "Delete?",                          deva: "हटाएँ?",                             telugu: "తీసేయాలా?" },
  openShelf:   { roman: "My recitations ({n})",             deva: "मेरे पाठ ({n})",                     telugu: "నా పఠనాలు ({n})" },
};
const MODEL_LABEL: Record<string, Record<string, string>> = {
  hi: { roman: "Hindi", deva: "हिन्दी", telugu: "హిందీ" },
  te: { roman: "Telugu", deva: "तेलुगु", telugu: "తెలుగు" },
};
/* words the app already has are hers: the learn bar's Record and Stop, the
   sheets' Close and Discard, the player's Play and Pause, and the two words
   of the face-down hold, which live in the app's strings so the switch reads
   in the same voice as the rest of the chrome */
const HERS: Record<string, string> = { record: "recordTurn", stopRec: "stopRec", close: "close", discard: "discardTake", play: "aPlay", pause: "aPause",
  faceDown: "followFaceDown", held: "followHeld" };
const t = (k: string, lang: string, vars: Record<string, string | number> = {}) => {
  if (HERS[k]) { try { const v = STUTI_L.t(HERS[k], lang); if (v && v !== HERS[k]) return v; } catch (e) {} }
  let s = (T[k] && (T[k][lang] || T[k].roman)) || k;
  for (const [a, b] of Object.entries(vars)) s = s.replace("{" + a + "}", String(b));
  return s;
};
const BrowserSR = () => (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

/* The phone laid face down on the mat holds the recitation. The reciter has
   put it down to do an ācamana, to offer a flower, to answer the door, and
   Follow used to run on without them and lose their place.
   Off unless the reciter asks for it: a phone resting on a lap at an angle
   must never stop the chant, and that is the common case. */
const FACE_DOWN_PREF = "stuti.follow.faceDown";
const FACE_DOWN_HOLD = 1000;     // the tilt must last this long before it counts
const FACE_DOWN_RESUME = 1200;   // a beat after the pickup, so the voice is not met mid-syllable
const FACE_DOWN_BAR = -0.8;      // how far past level the screen must look down (about 37° short of flat)
/* How far the screen is looking down, from the two angles that need no
   compass: beta is the front-back tilt and gamma the left-right one, both
   measured against gravity. The screen's normal points straight up when both
   are zero, and its vertical component is cos(beta)·cos(gamma); -1 is the
   screen flat against the floor, whichever way the phone is turned on it.
   Alpha is deliberately not read here — without a magnetometer fix it is not
   a heading at all, and nothing about this gesture needs one. */
function screenUpness(beta: number, gamma: number): number {
  const r = Math.PI / 180;
  return Math.cos(beta * r) * Math.cos(gamma * r);
}

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
  const [level, setLevel] = React.useState(0);    // mic loudness (Android), so a dead mic shows as one
  const [raw, setRaw] = React.useState("");       // the recogniser's last words, "[unk]" included
  const eng = React.useRef<FollowEngine | null>(null);
  const rec = React.useRef<any>(null);
  const onRef = React.useRef(false);
  const applied = React.useRef(-1);       // last line WE set — a different `active` means the reciter tapped
  const doneRef = React.useRef(false);
  const restartTimer = React.useRef<any>(null);
  const log = React.useRef<string[]>([]);      // this session, for sharing: what was heard and where the light went
  const t0 = React.useRef(0);
  const grammar = React.useRef<string[] | null>(null);
  /* recording: a session the reciter chose to keep, with where the light went */
  const [recOn, setRecOn] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [keep, setKeep] = React.useState<null | { dur: number; cues: number[]; linesLit: number; blob: Blob | null; failed?: boolean }>(null);
  const [kept, setKept] = React.useState<Recitation | null>(null);
  const [shelf, setShelf] = React.useState(false);
  const [recs, setRecs] = React.useState<Recitation[]>([]);
  /* the face-down hold: the preference as the reciter left it, and whether
     the recitation is waiting on the phone being turned over right now */
  const [faceDown, setFaceDown] = React.useState(() => { try { return localStorage.getItem(FACE_DOWN_PREF) === "1"; } catch (e) { return false; } });
  const [held, setHeld] = React.useState(false);
  const heldByTilt = React.useRef(false);
  const armRec = React.useRef(false);
  const recT0 = React.useRef(0);
  const entered = React.useRef(new Map<number, number>());
  const webCap = React.useRef<WebCapture | null>(null);
  const ticker = React.useRef<any>(null);
  const native = voskAvailable();
  const supported = native || !!BrowserSR();
  const voskLang = voskLangFor(lang);

  /* the session log: kept here for the share, and on the phone's disk line
     by line, so a share after the reader was reopened still has it */
  const note = (line: string, fresh = false) => {
    if (fresh) log.current = [line]; else log.current.push(line);
    if (log.current.length > 4000) log.current.splice(0, 1000);
    voskNote(line, fresh);
  };

  const mark = (line: number) => { if (recT0.current && !entered.current.has(line)) entered.current.set(line, (Date.now() - recT0.current) / 1000); };
  const apply = (pos: { line: number; word: number }) => {
    mark(pos.line);
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
      note(((Date.now() - t0.current) / 1000).toFixed(2) + (last.isFinal ? " F " : " p ") + last[0].transcript + (moved ? "  -> " + moved.line + ":" + moved.word : ""));
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
    r.onstart = () => { if (armRec.current && !recT0.current) beginCapture(); };
    r.onlevel = (v: number) => setLevel(v);
    r.onraw = (text: string) => { setRaw(text.slice(-60)); setEvents((n) => n + 1); note(((Date.now() - t0.current) / 1000).toFixed(2) + " raw " + text); };
    r.onend = () => {
      rec.current = null;
      /* the browser's recogniser closes after a pause: reopen it. Vosk only
         ends when we stop it, so this never loops there. */
      if (onRef.current && !native) restartTimer.current = setTimeout(listen, 250);
    };
  };

  /* the file begins now: the light's line is line one of the cue table */
  const beginCapture = () => {
    recT0.current = Date.now();
    entered.current = new Map([[Math.max(0, applied.current >= 0 ? applied.current : active), 0]]);
    setRecOn(true); setElapsed(0);
    clearInterval(ticker.current);
    ticker.current = setInterval(() => setElapsed((Date.now() - recT0.current) / 1000), 500);
    note("# recording from line " + Math.max(0, applied.current));
    if (!native) {
      const w = new WebCapture();
      webCap.current = w;
      w.start().catch(() => { webCap.current = null; endCapture(true); });
    }
  };
  /* the file ends: offer to keep it (unless the reader is going away) */
  const endCapture = (silent = false) => {
    if (!recT0.current) return;
    const dur = (Date.now() - recT0.current) / 1000;
    /* the cue table is offered only if the light walked the whole hymn; a
       recording of two verses out of a hundred keeps its audio and gives up
       its claim to know where the voice is (see cuesCover) */
    const weights = lines.map((l: any) => (l.iast || l.deva || "").replace(/\s+/g, "").length);
    const cues = cuesCover(entered.current, lines.length) ? cuesFrom(entered.current, lines.length, dur, weights) : [];
    const linesLit = entered.current.size;
    recT0.current = 0; armRec.current = false;
    clearInterval(ticker.current);
    setRecOn(false);
    const w = webCap.current; webCap.current = null;
    if (silent) { if (w) w.stop().catch(() => {}); return; }
    if (native) setKeep({ dur, cues, linesLit, blob: null });
    else if (w) w.stop().then(({ blob, dur: d }) => setKeep({ dur: d || dur, cues, linesLit, blob })).catch(() => setKeep({ dur, cues, linesLit, blob: null }));
    else setKeep({ dur, cues, linesLit, blob: null });
  };
  const record = () => {
    if (recT0.current) return;
    setKeep(null); setKept(null);
    armRec.current = true;
    if (onRef.current) {
      if (rec.current) {
        /* the ears are open already: reopen them so the file starts now */
        try { rec.current.abort(); } catch (e) {}
        rec.current = null;
        listen();
      }
      /* otherwise the ears are still opening (the grammar is being built):
         the pending listen()'s onstart will begin the capture */
      return;
    }
    start();
  };
  const doKeep = async () => {
    const k = keep; if (!k) return;
    try {
      const r = await keepRecitation({ hymn: hymn && hymn.id, title: (hymn && (hymn.title || hymn.id)) || "", lang, cues: k.cues, lineCount: lines.length, linesLit: k.linesLit, blob: k.blob, dur: k.dur });
      setKeep(null); setKept(r);
      /* stays until dismissed: the reciter should read where it went */
    } catch (e) { setKeep({ ...k, failed: true }); }
  };
  const discardKeep = () => setKeep(null);
  const openShelf = () => setShelf(true);
  const closeShelf = () => setShelf(false);
  const refreshRecs = () => { if (hymn && hymn.id) listRecitations(hymn.id).then(setRecs).catch(() => {}); };

  const listen = () => {
    if (!onRef.current) return;
    let r: any;
    try { r = native ? new VoskRecognition() : new (BrowserSR())(); } catch (e) { stop("unsupported"); return; }
    wire(r);
    if (native) r.grammar = grammar.current;
    rec.current = r;
    try { r.start(); } catch (e) { if (!native) restartTimer.current = setTimeout(listen, 800); }
  };

  /* `resume` picks the same session up where the hold left it: a new clock
     and a fresh log would cut one sitting into pieces in the makers' record. */
  const begin = async (resume = false) => {
    setPlaying(false);
    eng.current = new FollowEngine(lines);
    eng.current.seek(active < 0 ? 0 : active);
    doneRef.current = false;
    applied.current = active;
    onRef.current = true;
    setOn(true);
    setStatus("listening");
    setHeard(""); setEvents(0); setLevel(0); setRaw("");
    if (resume) note("# resumed " + new Date().toISOString() + " — the phone was turned back over");
    else {
      t0.current = Date.now();
      note("# Stuti Follow " + new Date().toISOString() + " hymn=" + (hymn && hymn.id) + " lang=" + lang + " ears=" + (native ? "vosk-" + voskLang : "browser"), true);
    }
    grammar.current = null;
    if (native && voskLang === "hi") {
      /* the stotra's own sounds as the recogniser's vocabulary; built once
         per text, from the model's word list. Hindi ears need it — their
         vocabulary has no Sanskrit. Telugu ears are left free: Telugu is
         full of Sanskrit and the model already knows most of the words,
         and a grammar only takes its language model away. */
      grammar.current = await grammarForLines(voskLang, (hymn && hymn.id) + ":" + voskLang, lines);
      note("# grammar " + (grammar.current ? grammar.current.length + " words" : "none"));
      if (!onRef.current) return;   // stopped while the grammar was being built
    }
    listen();
  };
  const share = () => {
    if (!native) return;
    if (onRef.current) stop(undefined, true);   // close the session, then hand it over
    voskShareSession(log.current.length > 1 ? log.current.join("\n") : "").catch(() => {});
  };

  const start = async () => {
    setKeep(null);
    if (!supported) { setStatus("unsupported"); noteTimer(); return; }
    if (native && !(await voskModelReady(voskLang))) { setStatus("needs-model"); return; }
    begin();
  };
  const download = async () => {
    setStatus("downloading"); setPct(0);
    try { await voskDownload(voskLang, setPct); begin(); }
    catch (e) { setStatus("failed"); noteTimer(); }
  };
  const dismiss = () => { armRec.current = false; setStatus("idle"); };

  /* `hold` means the phone has been turned over, not that the sitting is done.
     The session is therefore left open: no log goes to the makers, and t0 and
     the log keep running, so a reciter who sets the phone down four times
     sends one session and not four — with four uploads of the audio behind
     them, which on a phone is the expensive half. */
  const stop = (why?: Status, silent = false, hold = false) => {
    const wasOn = onRef.current;
    onRef.current = false;
    setOn(false);
    endCapture(silent);
    /* the session goes to the makers by itself (stuti-relay.ts): the log,
       and on the phone the audio, so a real chant can be replayed for tuning */
    if (!hold && wasOn && t0.current) relayFollowSession({ hymn: (hymn && hymn.id) || "", lang, lines: log.current.slice(), seconds: (Date.now() - t0.current) / 1000, wav: true }).catch(() => {});
    armRec.current = false;   // a Record that never began must not arm the next Follow
    if (restartTimer.current) { clearTimeout(restartTimer.current); restartTimer.current = null; }
    try { rec.current && rec.current.abort(); } catch (e) {}
    rec.current = null;
    if (why) { setStatus(why); if (why !== "needs-model") noteTimer(); } else setStatus("idle");
  };
  /* a tap on the mic is the reciter's own word on whether to listen, so it
     always ends the hold: a pickup afterwards must not restart what they
     themselves stopped */
  const release = () => { heldByTilt.current = false; setHeld(false); };
  const toggle = () => { release(); return on ? stop() : start(); };
  const setFaceDownHold = async (next: boolean) => {
    if (next) {
      /* iOS hands out the tilt sensors only on request, and only from a real
         tap — which is why the asking lives in this switch and not in an
         effect that runs when the reader opens. */
      const D: any = (window as any).DeviceOrientationEvent;
      if (D && typeof D.requestPermission === "function") {
        try { if ((await D.requestPermission()) !== "granted") return; } catch (e) { return; }
      }
    } else release();
    setFaceDown(next);
    try { localStorage.setItem(FACE_DOWN_PREF, next ? "1" : "0"); } catch (e) {}
  };
  const showChip = on || held || !!keep || !!kept || shelf || ["denied", "unsupported", "needs-model", "downloading", "failed"].includes(status);
  /* this hymn's kept recitations, refreshed whenever one is kept or deleted */
  React.useEffect(() => { refreshRecs(); return onRecitationsChange(refreshRecs); }, [hymn && hymn.id]);   // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => () => clearInterval(ticker.current), []);

  /* the reciter tapped another line: follow them, don't fight them */
  React.useEffect(() => {
    if (on && eng.current && active !== applied.current && active >= 0) { eng.current.seek(active); applied.current = active; }
  }, [active, on]);
  /* a new script changes the recogniser language: restart the ears */
  React.useEffect(() => { if (on && !recT0.current) { stop(); start(); } }, [lang]);   // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => () => { release(); stop(undefined, true); }, [hymn && hymn.id]);   // leaving the text stops listening
  /* the ears are open, or waiting on the phone to be turned back over: watch
     the tilt. Attached only in those two cases and only if asked for, and
     taken down again with the listener's own timer, so a reader that is not
     following costs nothing. Stopping and starting is the reciter's own pause
     path (the mic button's), so the engine's place is kept the same way. */
  React.useEffect(() => {
    if (!faceDown || (!on && !held)) return;
    let timer: any = null;
    let want = held;                 // the state the tilt has been asking for since it last changed
    const onTilt = (ev: DeviceOrientationEvent) => {
      const b = ev.beta, g = ev.gamma;
      if (b == null || g == null) return;
      const down = screenUpness(b, g) < FACE_DOWN_BAR;
      if (down === want) return;     // already waiting on this, or nothing has changed
      want = down;
      clearTimeout(timer);
      timer = setTimeout(() => {
        /* a recitation being recorded is left alone: stopping would end the
           file and ask whether to keep it, which is not what setting the
           phone down means */
        if (down) { if (onRef.current && !recT0.current) { heldByTilt.current = true; setHeld(true); stop(undefined, true, true); } }
        else if (heldByTilt.current) { heldByTilt.current = false; setHeld(false); begin(true); }
      }, down ? FACE_DOWN_HOLD : FACE_DOWN_RESUME);
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => { window.removeEventListener("deviceorientation", onTilt); clearTimeout(timer); };
  }, [faceDown, on, held]);   // eslint-disable-line react-hooks/exhaustive-deps

  return { on, status, pct, heard, events, level, raw, supported, native, showChip, voskLang, start, stop, toggle, download, dismiss, share,
    faceDown, setFaceDownHold, held,
    recOn, elapsed, keep, kept, shelf, recs, record, doKeep, discardKeep, openShelf, closeShelf, dismissKept: () => setKept(null),
    lineCount: lines.length, activeLine: active, hymnTitle: (hymn && (hymn.title || hymn.id)) || "" };
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
  /* the phone is face down: the chip says so, and is there to be read the
     moment it is turned over */
  if (follow.held) {
    return (
      <div className="rd-follow-chip is-held" role="status" aria-live="polite">
        <span className="rd-follow-dot" aria-hidden="true" />
        <span className="rd-follow-text"><span>{t("held", lang)}</span></span>
      </div>
    );
  }
  if (follow.keep) {
    const k = follow.keep;
    return (
      <div className="rd-follow-chip is-needs-model is-keep" role="dialog" aria-live="polite">
        <span>{t("keepQ", lang, { dur: fmtDur(k.dur), lit: k.linesLit, n: follow.lineCount })}</span>
        <span className="rd-follow-where">{k.failed ? t("keepFailed", lang) : t(follow.native ? "keepWhere" : "keepWhereWeb", lang)}</span>
        <span className="rd-follow-actions">
          <button type="button" className="rd-follow-act primary" onClick={follow.doKeep}>{t("keep", lang)}</button>
          <button type="button" className="rd-follow-act" onClick={follow.discardKeep}>{t("discard", lang)}</button>
        </span>
      </div>
    );
  }
  if (follow.kept && !follow.on) {
    return (
      <div className="rd-follow-chip is-done is-kept" role="status" aria-live="polite">
        <span className="rd-follow-dot" aria-hidden="true" />
        <span className="rd-follow-text"><span>{t("kept", lang, { dur: fmtDur(follow.kept.dur), learn: STUTI_L.t("learn", lang), listen: STUTI_L.t("listen", lang) })}</span></span>
        <button type="button" className="rd-follow-act primary" onClick={() => { follow.dismissKept(); follow.openShelf(); }}>{t("shelf", lang)}</button>
        <button type="button" className="rd-follow-act" onClick={follow.dismissKept}>{t("close", lang)}</button>
      </div>
    );
  }
  if (!follow.on && follow.shelf) return <RecitationsSheet follow={follow} lang={lang} />;
  const text = st === "downloading" ? t("downloading", lang, { pct: follow.pct }) : follow.recOn ? t("recording", lang, { t: fmtDur(follow.elapsed) }) : t(st, lang);
  /* what the ears last reported: the reciter sees that they are heard (as
     every voice teleprompter shows), and a chip that stays empty says the
     ears are silent rather than the matcher lost */
  const showHeard = follow.on && (st === "listening" || st === "lost");
  return (
    <React.Fragment>
    <div className={"rd-follow-chip is-" + st + (follow.recOn ? " is-recording" : "")} role="status" aria-live="polite">
      <span className="rd-follow-dot" aria-hidden="true" />
      <span className="rd-follow-text">
        <span>{text}</span>
        {showHeard && <span className="rd-follow-heard">{follow.events ? "“" + (follow.raw || follow.heard) + "”" : "…"}</span>}
      </span>
      {showHeard && follow.native && (
        <span className="rd-follow-level" aria-hidden="true"><span style={{ transform: "scaleY(" + Math.max(0.08, follow.level) + ")" }} /></span>
      )}
      {/* the hold's switch sits with Follow's other in-session control, where
          a reciter who has just set the phone down once will look for it */}
      {follow.on && (st === "listening" || st === "lost") && !follow.recOn && (
        <button type="button" className={"rd-follow-act face-down" + (follow.faceDown ? " on" : "")}
          onClick={() => follow.setFaceDownHold(!follow.faceDown)} aria-pressed={follow.faceDown}>
          {t("faceDown", lang)}
        </button>
      )}
      {follow.on && (st === "listening" || st === "lost" || st === "done") && (
        follow.recOn
          ? <button type="button" className="rd-follow-act rec on" onClick={() => follow.stop()} aria-label={t("stopRec", lang)}>■ {t("stopRec", lang)}</button>
          : <button type="button" className="rd-follow-act rec" onClick={follow.record} aria-label={t("recordTitle", lang)} title={t("recordTitle", lang)}>● {t("record", lang)}</button>
      )}
    </div>
    {follow.shelf && <RecitationsSheet follow={follow} lang={lang} />}
    </React.Fragment>
  );
}

/* the Record chip in the reader's main row: one word, one action */
export function RecordChip({ follow, lang }: { follow: ReturnType<typeof useFollow>; lang: string }) {
  if (!follow.supported) return null;
  const on = follow.recOn;
  return (
    <button type="button" className={"chip chip-record" + (on ? " chip-on" : "")} onClick={on ? () => follow.stop() : follow.record}
      aria-pressed={on} title={t("recordTitle", lang)}>
      {on ? "■ " + t("stopRec", lang) : "● " + t("record", lang)}
    </button>
  );
}

/* ● beside the title: how many recitations of this text are kept, and the
   way to them */
export function RecitationsButton({ follow, lang }: { follow: ReturnType<typeof useFollow>; lang: string }) {
  if (!follow.recs.length) return null;
  const label = t("openShelf", lang, { n: follow.recs.length });
  return (
    <button type="button" className="icon-btn rd-rec-btn" onClick={follow.openShelf} aria-label={label} title={label}>
      <span aria-hidden="true">●</span><span className="rd-rec-count">{follow.recs.length}</span>
    </button>
  );
}

/* the shelf: every kept recitation of this text, playable, shareable,
   deletable, with a plain sentence about where it lives */
export function RecitationsSheet({ follow, lang }: { follow: ReturnType<typeof useFollow>; lang: string }) {
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [arm, setArm] = React.useState<string | null>(null);
  const audio = React.useRef<HTMLAudioElement | null>(null);
  const play = (r: Recitation) => {
    const el = audio.current; if (!el) return;
    if (playing === r.id) { el.pause(); setPlaying(null); return; }
    el.src = recitationSrc(r); el.currentTime = 0;
    el.play().then(() => setPlaying(r.id)).catch(() => setPlaying(null));
  };
  React.useEffect(() => { const el = audio.current; if (!el) return; const done = () => setPlaying(null); el.addEventListener("ended", done); return () => { el.removeEventListener("ended", done); el.pause(); }; }, []);
  React.useEffect(() => { if (arm) { const id = setTimeout(() => setArm(null), 4000); return () => clearTimeout(id); } }, [arm]);
  return (
    <OverlayPortal>
      <div className="rd-rec-scrim" onClick={follow.closeShelf} />
      <div className="rd-rec-sheet" role="dialog" aria-label={t("shelf", lang)}>
        <div className="rd-rec-head">
          <span className="rd-rec-title">{t("shelf", lang)}</span>
          <button type="button" className="rd-follow-act" onClick={follow.closeShelf}>{t("close", lang)}</button>
        </div>
        {!follow.recs.length && <div className="rd-rec-empty">{t("shelfEmpty", lang)}</div>}
        {follow.recs.map((r) => (
          <div key={r.id} className={"rd-rec-row" + (playing === r.id ? " is-playing" : "")}>
            <button type="button" className="rd-rec-play" onClick={() => play(r)} aria-label={playing === r.id ? t("pause", lang) : t("play", lang)}>
              <Icon name={playing === r.id ? "pause" : "play"} size={18} />
            </button>
            <span className="rd-rec-meta">
              <span className="rd-rec-when">{fmtWhen(r.at, lang)} · {fmtDur(r.dur)}</span>
              <span className="rd-rec-sub">{t("linesOf", lang, { lit: r.linesLit, n: r.lineCount })} · {fmtSize(r.size)}</span>
            </span>
            <button type="button" className="rd-follow-act" onClick={() => shareRecitation(r).catch(() => {})}>{t("share", lang)}</button>
            <button type="button" className={"rd-follow-act" + (arm === r.id ? " danger" : "")}
              onClick={() => { if (arm === r.id) { setArm(null); if (playing === r.id && audio.current) { audio.current.pause(); setPlaying(null); } deleteRecitation(r).catch(() => {}); } else setArm(r.id); }}>
              {arm === r.id ? t("sure", lang) : t("del", lang)}
            </button>
          </div>
        ))}
        <div className="rd-rec-foot">{t(follow.native ? "keepWhere" : "keepWhereWeb", lang)}</div>
        <audio ref={audio} preload="none" />
      </div>
    </OverlayPortal>
  );
}

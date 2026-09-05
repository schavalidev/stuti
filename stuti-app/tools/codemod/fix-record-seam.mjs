// Repairs the designer's Record & compare (Learn > Repeat) in the generated
// reader, found by replaying the flow on the founder's phone: a take was filed
// under the line that came next and erased by that line's turn, an arming mic
// was never stopped, a discard flag was thrown away before the recorder could
// read it, the playback bar never filled (MediaRecorder's WebM has no
// duration), Repeat xN spanned one recording across every turn, a refusal
// disabled the toggle for the sitting with copy written for a web embed, and
// the live strip hid the your-turn cue and its "I said it". Every anchor is
// literal text from the prototype; a design update that moves one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");

function patchFile(file, patches) {
  let t = readFileSync(file, "utf8");
  for (const [from, to, what] of patches) {
    if (!t.includes(from)) throw new Error(`fix-record-seam: anchor not found in ${file} — ${what}`);
    t = t.replace(from, to);
  }
  writeFileSync(file, t);
}

patchFile(join(SRC, "stuti-record.tsx"), [
  [`const REC_CAP_MS = 15000;   // no turn of a single line runs longer than this`,
   `const REC_CAP_MS = 60000;   // a hard stop for a forgotten take; the turn's own timer ends a normal one`,
   "cap constant"],
  // a take belongs to the line it was recorded on: stamp it at start, bank by it
  [`    release();                                          // never stack two streams
    setState("arming");`,
   `    release();                                          // never stack two streams
    const mine = box.current;                           // this arm's box: a stop in flight replaces it
    mine.key = key.current;                             // the line this take belongs to
    setState("arming");`,
   "start: stamp box and line"],
  [`    const b = box.current;
    b.stream = stream;`,
   `    if (box.current !== mine) { stream.getTracks().forEach((t) => t.stop()); return; }   // stopped while the mic was opening
    const b = box.current;
    b.stream = stream;`,
   "start: cancelled arm releases its stream"],
  [`      b.ctx = new (window.AudioContext || window.webkitAudioContext)();`,
   `      b.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (b.ctx.state !== "running") b.ctx.resume().catch(() => {});`,
   "resume a suspended AudioContext"],
  [`        const bb = box.current;`,
   `        const bb = b;                                   // the box this take was made in, not whatever is current`,
   "onstop reads its own box"],
  [`        if (key.current != null) bank.current.set(key.current, t);
        setTake(t);
        setState("ready");`,
   `        if (bb.key != null) bank.current.set(bb.key, t);
        if (bb.key != null && bb.key !== key.current) return;   // closed for a line we have left: banked, not shown
        setTake(t);
        setState("ready");`,
   "bank under the recorded line"],
  // moving to another line closes the take on the line it was recorded on
  [`    if (k === key.current) return;`,
   `    if (k === key.current) return;
    if (box.current.rec && box.current.rec.state === "recording") stop();   // the take closes under its own line`,
   "at(): stop before moving"],
  [`      if (el.duration && !el.paused) { setFrac(el.currentTime / el.duration); raf = requestAnimationFrame(tick); }`,
   `      if (!el.paused) { setFrac(Math.min(1, (el.currentTime * 1000) / Math.max(1, take.ms || 0))); raf = requestAnimationFrame(tick); }`,
   "playback progress against the take's own length"],
]);

patchFile(join(SRC, "stuti-reader.tsx"), [
  // the end of a turn stops the mic whatever state it is in (an arming one included)
  [`    else if (rec.state === "recording") rec.stop();
  }, [speakingNow, recordOn]);`,
   `    else rec.stop();
  }, [speakingNow, recordOn, repIter]);   // each turn of Repeat xN is its own take`,
   "speakingNow effect"],
  // a pause returns to the top of the line, so resuming does not re-record the take on screen
  [`  useEffect(() => { setPhase("chant"); setPeek(false); setRepIter(1); }, [active, learnMode]);`,
   `  useEffect(() => { setPhase("chant"); setPeek(false); setRepIter(1); }, [active, learnMode]);
  useEffect(() => { if (!playing) setPhase("chant"); }, [playing]);`,
   "pause resets phase"],
  // switching Record on asks again; a refusal no longer disables it for the sitting
  [`    if (!recordOn) return;
    let live = true;`,
   `    if (!recordOn) return;
    setMicNote(false);
    let live = true;`,
   "recordOn clears the note"],
  [`disabled={micNote} aria-pressed={recordOn}`,
   `aria-pressed={recordOn}`,
   "toggle stays enabled"],
  // the toggle says its name
  [`                <Icon name="mic" size={17} />
              </button>`,
   `                <Icon name="mic" size={17} /><span className="rd-seg-rec-lbl">{STUTI_L.t("recordTurn", lang)}</span>
              </button>`,
   "record label"],
  // the your-turn cue stays while recording; the take shows once there is one
  [`      {repeatOn && recordOn && (rec.take || rec.recording) ? (`,
   `      {repeatOn && recordOn && rec.take && !rec.recording ? (`,
   "strip only for a finished take"],
  [`      ) : repeatOn && playing ? (`,
   `      ) : null}
      {repeatOn && playing ? (`,
   "cue alongside the strip"],
]);

patchFile(join(SRC, "stuti-i18n.ts"), [
  [`    micDenied:     { roman: "The microphone is not available — recording needs permission. Open the app directly and try again.",`,
   `    micDenied:     { roman: "The microphone was refused. Allow it for Stuti in Settings → Apps → Stuti → Permissions, then switch Record on again.",`,
   "micDenied roman"],
  ["माइक्रोफोन उपलब्ध नहीं — रिकॉर्डिंग के लिए अनुमति चाहिए। ऐप को सीधे खोलकर फिर से कोशिश करें।", "माइक्रोफ़ोन को अनुमति नहीं मिली। सेटिंग्स → ऐप्स → Stuti → अनुमतियाँ में माइक्रोफ़ोन चालू करें, फिर रिकॉर्ड दोबारा चालू करें।", "micDenied deva"],
  ["ఇక్కడ మైక్రోఫోన్ అందుబాటులో లేదు — రెకార్డు చేయడానికి అనుమతి కావాలి, మరొక పేజీ లోపల తెరిచిన పేజీకి అది సాధారణంగా ఇవ్వబడదు.", "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. సెట్టింగ్స్ → యాప్స్ → Stuti → అనుమతులు లో మైక్రోఫోన్ అనుమతించి, రికార్డు మళ్లీ ఆన్ చేయండి.", "micDenied telugu"],
]);

console.log("record seam applied");

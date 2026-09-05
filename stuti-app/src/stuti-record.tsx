import { Icon } from "./stuti-icons";
import React from "react";
import { STUTI_L } from "./stuti-i18n";

/* ============================================================
   STUTI — record & compare (Repeat mode)
   The reciter's turn, recorded: their own voice played back with
   the expected beat of the line drawn over it, so practice is
   measurable instead of felt. Nothing leaves the device.

   One take per line is kept for the sitting — at(key) banks the take
   under the line it belongs to and brings back whatever that line
   already has, so stepping away from a line and returning to it does
   not throw the take away. Recording the same line again replaces it;
   nothing is written to storage, so a reload starts clean and no blob
   outlives the sitting.

   The hook owns the microphone's whole lifetime: every start
   releases what came before, a hard cap stops a forgotten take,
   clear() always releases the stream, and unmount cleans up. No
   render condition can leave the mic open.
   ============================================================ */
const { useState: useStateR, useEffect: useEffectR, useRef: useRefR } = React;

const REC_CAP_MS = 60000;   // a hard stop for a forgotten take; the turn's own timer ends a normal one

function useRecTake() {
  const [state, setState] = useStateR("idle");     // idle | arming | recording | ready | denied
  const [take, setTake] = useStateR(null);         // { url, env:[0..1], ms }
  const box = useRefR({});
  const bank = useRefR(new Map());                 // line key → its last take
  const key = useRefR(null);                       // the line being recorded now

  /* let go of everything: cap timer, envelope loop, audio graph, tracks */
  const release = () => {
    const b = box.current;
    if (b.cap) clearTimeout(b.cap);
    if (b.raf) cancelAnimationFrame(b.raf);
    if (b.ctx) { try { b.ctx.close(); } catch (e) {} }
    if (b.stream) b.stream.getTracks().forEach((t) => t.stop());
    box.current = {};
  };
  const stop = () => {
    const b = box.current;
    if (b.cap) { clearTimeout(b.cap); b.cap = null; }
    if (b.rec && b.rec.state === "recording") { try { b.rec.stop(); return; } catch (e) {} }
    release();
    setState((s) => (s === "recording" || s === "arming" ? "idle" : s));
  };
  const clear = () => {
    const b = box.current;
    b.discard = true;                                   // read by onstop before release
    if (b.rec && b.rec.state === "recording") { try { b.rec.stop(); } catch (e) {} }
    release();
    if (key.current != null) bank.current.delete(key.current);
    setTake((t) => { if (t && t.url) URL.revokeObjectURL(t.url); return null; });
    setState("idle");
  };
  /* move to a line: bank nothing, recall what that line already has */
  const at = (k) => {
    if (k === key.current) return;
    if (box.current.rec && box.current.rec.state === "recording") stop();   // the take closes under its own line
    key.current = k;
    const t = k != null ? bank.current.get(k) || null : null;
    setTake(t);
    setState((s) => (s === "recording" || s === "arming" ? s : t ? "ready" : "idle"));
  };
  /* stand the whole feature down: every take goes, not just this line's */
  const forget = () => {
    bank.current.forEach((t) => { if (t && t.url) URL.revokeObjectURL(t.url); });
    bank.current.clear();
    clear();
  };
  useEffectR(() => () => {
    release();
    bank.current.forEach((t) => { if (t && t.url) URL.revokeObjectURL(t.url); });
    bank.current.clear();
  }, []);

  const start = async () => {
    release();                                          // never stack two streams
    const mine = box.current;                           // this arm's box: a stop in flight replaces it
    mine.key = key.current;                             // the line this take belongs to
    setState("arming");
    setTake((t) => { if (t && t.url) URL.revokeObjectURL(t.url); return null; });
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setState("denied"); return; }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { setState("denied"); return; }
    if (box.current !== mine) { stream.getTracks().forEach((t) => t.stop()); return; }   // stopped while the mic was opening
    const b = box.current;
    b.stream = stream;
    b.env = [];
    b.t0 = performance.now();
    try {
      b.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (b.ctx.state !== "running") b.ctx.resume().catch(() => {});
      const an = b.ctx.createAnalyser();
      an.fftSize = 512;
      b.ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.fftSize);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128) / 128);
        b.env.push(Math.min(1, peak * 1.7));
        b.raf = requestAnimationFrame(tick);
      };
      b.raf = requestAnimationFrame(tick);
    } catch (e) { /* the envelope is a nicety; the recording still works */ }
    try {
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        const bb = b;                                   // the box this take was made in, not whatever is current
        const discarded = bb.discard;
        const ms = performance.now() - (bb.t0 || performance.now());
        const env = (bb.env || []).slice();
        release();
        if (discarded) return;
        const url = chunks.length ? URL.createObjectURL(new Blob(chunks, { type: chunks[0].type })) : null;
        const t = { url, env, ms };
        if (bb.key != null) bank.current.set(bb.key, t);
        if (bb.key != null && bb.key !== key.current) return;   // closed for a line we have left: banked, not shown
        setTake(t);
        setState("ready");
      };
      b.rec = rec;
      rec.start();
      b.cap = setTimeout(() => { try { rec.stop(); } catch (e) { release(); } }, REC_CAP_MS);
      setState("recording");
    } catch (e) { release(); setState("denied"); }
  };

  return { state, take, start, stop, clear, at, forget, recording: state === "recording" || state === "arming" };
}

/* the take, drawn: their loudness over time, with the expected word
   beats of the line as ticks above it */
function TakeTrace({ env, beats, playedFrac }) {
  const n = 56;
  const bars = [];
  const src = env && env.length ? env : [0];
  for (let i = 0; i < n; i++) {
    const a = Math.floor((i / n) * src.length), b = Math.max(a + 1, Math.floor(((i + 1) / n) * src.length));
    let peak = 0;
    for (let k = a; k < b && k < src.length; k++) peak = Math.max(peak, src[k]);
    bars.push(peak);
  }
  return (
    <div className="rt-trace">
      <div className="rt-beats">
        {(beats || []).map((f, i) => <i key={i} style={{ left: (f * 100).toFixed(2) + "%" }} />)}
      </div>
      <div className="rt-bars">
        {bars.map((v, i) => (
          <span key={i} className={playedFrac != null && i / n <= playedFrac ? "on" : ""}
            style={{ height: Math.max(3, Math.round(v * 20)) + "px" }} />
        ))}
      </div>
    </div>
  );
}

/* verdict — their pace against the expected dwell of the line */
function paceVerdict(take, expectedMs) {
  const env = take.env || [];
  const loud = env.filter((v) => v > 0.075);
  if (!env.length || loud.length < 3) return { key: "nothingHeard", tone: "quiet" };
  let first = env.findIndex((v) => v > 0.075), last = env.length - 1;
  while (last > first && env[last] <= 0.075) last--;
  const spokenMs = take.ms * ((last - first + 1) / env.length);
  const r = spokenMs / Math.max(400, expectedMs);
  const key = r < 0.72 ? "paceQuick" : r > 1.35 ? "paceSlow" : "paceSteady";
  return { key, tone: key === "paceSteady" ? "good" : "off" };
}

function RecordStrip({ rec, expectedMs, beats, lang, onAgain }) {
  const L = STUTI_L;
  const [frac, setFrac] = useStateR(null);
  const audio = useRefR(null);
  const take = rec.take;

  useEffectR(() => {
    setFrac(null);
    const el = audio.current;
    if (!el) return;
    let raf;
    const tick = () => {
      if (!el.paused) { setFrac(Math.min(1, (el.currentTime * 1000) / Math.max(1, take.ms || 0))); raf = requestAnimationFrame(tick); }
    };
    const onPlay = () => { raf = requestAnimationFrame(tick); };
    const onEnd = () => { cancelAnimationFrame(raf); setFrac(null); };
    el.addEventListener("play", onPlay);
    el.addEventListener("ended", onEnd);
    el.addEventListener("pause", onEnd);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("play", onPlay); el.removeEventListener("ended", onEnd); el.removeEventListener("pause", onEnd); };
  }, [take && take.url]);

  /* recording: say so, and give a way to stop it */
  if (rec.recording) {
    return (
      <div className="rt-strip rt-live">
        <span className="rt-dot" />
        <span className="rt-live-cap">{L.t("recording", lang)}</span>
        <button className="rt-stop" onClick={rec.stop}>{L.t("stopRec", lang)}</button>
      </div>
    );
  }
  if (!take) return null;
  const v = paceVerdict(take, expectedMs);
  return (
    <div className="rt-strip">
      <button className="rt-play" onClick={() => { const el = audio.current; if (!el) return; if (el.paused) el.play(); else { el.pause(); el.currentTime = 0; } }}
        disabled={!take.url} aria-label={L.t("hearYourself", lang)}>
        <Icon name="play" size={17} />
      </button>
      <div className="rt-mid">
        <TakeTrace env={take.env} beats={beats} playedFrac={frac} />
        <div className={"rt-verdict " + v.tone}>{L.t(v.key, lang)}</div>
      </div>
      <button className="rt-again" onClick={onAgain} aria-label={L.t("recordAgain", lang)} title={L.t("recordAgain", lang)}>
        <Icon name="repeat" size={16} />
      </button>
      <button className="rt-x" onClick={rec.clear} aria-label={L.t("discardTake", lang)} title={L.t("discardTake", lang)}>×</button>
      {take.url && <audio ref={audio} src={take.url} preload="auto" />}
    </div>
  );
}

export { useRecTake, RecordStrip, TakeTrace };

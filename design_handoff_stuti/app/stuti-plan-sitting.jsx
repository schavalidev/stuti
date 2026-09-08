/* ============================================================
   STUTI — the kaṇṭhastha sitting (replaces PlanDay in stuti-plans.jsx)
   Order follows how it is actually done at home: first recite what is
   already learnt, then take up the new verse and go round it until it
   holds. Repetition is the whole point — a verse read once is not learnt.
   · Review: all learnt verses while they are few (≤24), then a spaced set
     — yesterday's, a week ago's, and one older portion — so a
     sahasranāma on day 30 is not a forty-minute warm-up.
   · Learn: each new verse goes round with a round counter, an auto-paced
     line light (speed, repeat count) borrowed from the reader, and a veil
     that thickens each round: full → first akṣara → first word.
     The reciter, not the app, says when it holds.
   · The day is done only when both review and new verses are finished.
   ============================================================ */
const { useState: useStatePS, useEffect: useEffectPS, useMemo: useMemoPS, useRef: useRefPS } = React;

const PS_REVIEW_ALL_MAX = 24;
const PS_SPEEDS = [0.75, 1, 1.25, 1.5];
const PS_REPEATS = [1, 3, 5, 10];

/* first akṣara of a word — the consonant cluster with its vowel sign (శ్రీ, వా, ఛ), not the bare first code point */
const PS_SEG = typeof Intl !== "undefined" && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
function psAksharas(w) {
  const g = PS_SEG ? Array.from(PS_SEG.segment(w), s => s.segment) : Array.from(w);
  // fold virāma-joined clusters (క్ + ష → క్ష) that graphemes split
  const out = [];
  for (const s of g) { if (out.length && /[\u094D\u0C4D\u0BCD\u0CCD\u0D4D\u0A4D\u0ACD\u0B4D\u09CD]$/u.test(out[out.length - 1])) out[out.length - 1] += s; else out.push(s); }
  return out;
}
function psLines(text) { return (text || "").split("\n").map(s => s.trim()).filter(Boolean); }
function psDwell(line, speed) { // ~240ms a syllable, syllables ≈ letters/2.6, clamped so a short refrain still has time to be said
  const letters = (line.match(/\p{L}/gu) || []).length;
  return Math.max(1400, Math.min(9000, (letters / 2.6) * 240)) / speed;
}
/* which verses to recite before the new ones */
function psReviewSet(hymn, day) {
  const P = window.STUTI_PLANS;
  if (day <= 1) return [];
  const learnt = P.chunkFor(hymn, day - 1).to; // verses [0, learnt) are behind us
  const range = (c) => { const a = []; for (let i = c.from; i < c.to; i++) a.push(i); return a; };
  if (learnt <= PS_REVIEW_ALL_MAX) return Array.from({ length: learnt }, (_, i) => i);
  const set = new Set(range(P.chunkFor(hymn, day - 1)));
  if (day > 7) range(P.chunkFor(hymn, day - 7)).forEach(i => set.add(i));
  const olderDays = []; for (let d = 1; d < day - 7; d++) olderDays.push(d);
  if (olderDays.length) range(P.chunkFor(hymn, olderDays[(day * 7) % olderDays.length])).forEach(i => set.add(i));
  return [...set].sort((a, b) => a - b);
}

/* a verse under a veil of a given depth: 0 full · 1 first akṣara · 2 first word of each line */
function VeiledVerse({ text, level, lang, litLine }) {
  const L = window.STUTI_L;
  const lines = psLines(text);
  return (
    <div className="ps-verse" style={{ fontFamily: lang === "roman" ? "var(--font-ui)" : L.font(lang) }}>
      {lines.map((ln, li) => {
        const words = ln.split(/\s+/).filter(Boolean);
        return (
          <div key={li} className={"ps-line" + (litLine === li ? " lit" : "") + (litLine != null && litLine !== li ? " dim" : "")}>
            {words.map((w, wi) => {
              const isWord = /\p{L}/u.test(w);
              if (!isWord || level === 0) return <span key={wi} className="ps-w">{w}</span>;
              if (level === 1) { const ak = psAksharas(w); return <span key={wi} className="ps-w veil"><b>{ak[0]}</b><i>{"·".repeat(Math.max(2, Math.min(6, ak.length - 1)))}</i></span>; }
              if (level === 2) return wi === 0 ? <span key={wi} className="ps-w">{w}</span> : <span key={wi} className="ps-w veil"><i>{"·".repeat(Math.max(2, Math.min(6, Array.from(w).length)))}</i></span>;
              return <span key={wi} className="ps-w veil"><i>{"·".repeat(Math.max(2, Math.min(6, Array.from(w).length)))}</i></span>;
            })}
          </div>
        );
      })}
    </div>
  );
}

/* the auto-paced line light — plays through a verse's lines, `reps` times */
function usePacer(lines, speed, reps, textKey, onRound) {
  const [lit, setLit] = useStatePS(null);
  const [playing, setPlaying] = useStatePS(false);
  const [rep, setRep] = useStatePS(0);
  const timer = useRefPS(null);
  useEffectPS(() => { setLit(null); setPlaying(false); setRep(0); clearTimeout(timer.current); }, [textKey]);
  useEffectPS(() => {
    if (!playing || lit == null) return;
    timer.current = setTimeout(() => {
      if (lit + 1 < lines.length) { setLit(lit + 1); return; }
      onRound && onRound();
      if (rep + 1 < reps) { setRep(rep + 1); setLit(0); }
      else { setPlaying(false); setLit(null); setRep(0); }
    }, psDwell(lines[lit] || "", speed));
    return () => clearTimeout(timer.current);
  }, [playing, lit, rep]);
  const start = () => { setRep(0); setLit(0); setPlaying(true); };
  const stop = () => { clearTimeout(timer.current); setPlaying(false); setLit(null); setRep(0); };
  return { lit, playing, rep, start, stop };
}

function PsPacerBar({ pacer, speed, setSpeed, reps, setReps, lang, lines }) {
  const L = window.STUTI_L, A = window.STUTI_L.a;
  return (
    <div className="ps-pacer">
      <button className={"ps-play" + (pacer.playing ? " on" : "")} onClick={() => pacer.playing ? pacer.stop() : pacer.start()} aria-label={pacer.playing ? A("aPause") : A("aPlay")}>
        <Icon name={pacer.playing ? "pause" : "play"} size={18} />
        <span>{pacer.playing ? L.t("followLine", lang) : L.t("psFollow", lang)}</span>
      </button>
      <button className="ps-chip" onClick={() => setSpeed(PS_SPEEDS[(PS_SPEEDS.indexOf(speed) + 1) % PS_SPEEDS.length])} aria-label={A("aSpeed")}>{speed}×</button>
      <button className="ps-chip" onClick={() => setReps(PS_REPEATS[(PS_REPEATS.indexOf(reps) + 1) % PS_REPEATS.length])} aria-label={A("aRepeatCount")}><Icon name="repeat" size={14} /> {reps}{pacer.playing && reps > 1 ? ` · ${pacer.rep + 1}` : ""}</button>
    </div>
  );
}

/* ---- Phase one: recite what is already learnt ---- */
function PsReview({ hymn, idxs, lang, onDone }) {
  const L = window.STUTI_L;
  const [pass, setPass] = useStatePS(1);
  const [speed, setSpeed] = useStatePS(1);
  const [reps, setReps] = useStatePS(1);
  const flat = useMemoPS(() => idxs.flatMap(vi => psLines(planVerseText(hymn.verses[vi], lang)).map((ln, li) => ({ vi, li, ln }))), [idxs, lang]);
  const pacer = usePacer(flat.map(x => x.ln), speed, reps, "rv" + hymn.id, () => setPass(p => p + 1));
  const litRef = useRefPS(null);
  useEffectPS(() => { if (pacer.lit != null && litRef.current) { const el = litRef.current; const box = el.closest(".scroll"); if (box) { const r = el.getBoundingClientRect(), b = box.getBoundingClientRect(); if (r.top < b.top + 120 || r.bottom > b.bottom - 160) box.scrollBy({ top: r.top - b.top - b.height * 0.4, behavior: "smooth" }); } } }, [pacer.lit]);
  const font = lang === "roman" ? "var(--font-ui)" : L.font(lang);
  let k = 0;
  return (
    <div className="ps-phase">
      <div className="ps-head">
        <span className="plan-step-kind">{L.t("reviewLabel", lang)} · {L.versesCount(idxs.length, lang)}</span>
        <span className="ps-round">{L.t("psPass", lang)} {pass}</span>
      </div>
      <p className="ps-lede">{L.t("psReviewLede", lang)}</p>
      <PsPacerBar pacer={pacer} speed={speed} setSpeed={setSpeed} reps={reps} setReps={setReps} lang={lang} lines={flat} />
      <div className="ps-scroll">
        {idxs.map(vi => {
          const v = hymn.verses[vi]; const lines = psLines(planVerseText(v, lang));
          return (
            <div key={vi} className="ps-rv">
              {v.n != null && <span className="ps-rv-n">{v.n}</span>}
              <div className="ps-verse" style={{ fontFamily: font }}>
                {lines.map((ln, li) => { const i = k++; const lit = pacer.lit === i; return <div key={li} ref={lit ? litRef : null} className={"ps-line" + (lit ? " lit" : "") + (pacer.lit != null && !lit ? " dim" : "")}>{ln}</div>; })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="ps-actions">
        <button className="ps-again" onClick={() => { pacer.stop(); setPass(p => p + 1); }}><Icon name="repeat" size={16} /> {L.t("psOnceMore", lang)}</button>
        <button className="plan-next" onClick={() => { pacer.stop(); onDone(pass); }}>{L.t("psReviewDone", lang)} <Icon name="chev" size={16} /></button>
      </div>
    </div>
  );
}

/* ---- Phase two: one new verse, round and round ---- */
function PsLearn({ hymn, vi, n, of, lang, onDone }) {
  const L = window.STUTI_L;
  const v = hymn.verses[vi];
  const text = planVerseText(v, lang);
  const lines = psLines(text);
  const meaning = window.STUTI_MEAN(v, lang);
  const [round, setRound] = useStatePS(1);
  const [level, setLevel] = useStatePS(0);
  const [auto, setAuto] = useStatePS(true); // veil deepens by itself every second round
  const [speed, setSpeed] = useStatePS(1);
  const [reps, setReps] = useStatePS(3);
  const [showMeaning, setShowMeaning] = useStatePS(false);
  const bump = () => setRound(r => { const nr = r + 1; if (auto) setLevel(l => Math.min(2, Math.floor((nr - 1) / 2))); return nr; });
  const pacer = usePacer(lines, speed, reps, "ln" + vi, bump);
  useEffectPS(() => { setRound(1); setLevel(0); setShowMeaning(false); }, [vi]);
  const levelNames = ["psVeil0", "psVeil1", "psVeil2"];
  return (
    <div className="ps-phase">
      <div className="ps-head">
        <span className="plan-step-kind learn">{L.t("newVerses", lang)} · {n}/{of}{v.n != null ? " · " + v.n : ""}</span>
        <span className="ps-round">{L.t("psRound", lang)} {round}</span>
      </div>
      <div className="ps-veils" role="radiogroup" aria-label={L.t("psVeil", lang)}>
        {levelNames.map((k, i) => <button key={k} role="radio" aria-checked={level === i} className={"ps-veil-pip" + (level === i ? " on" : "") + (i < level ? " past" : "")} onClick={() => { setLevel(i); setAuto(false); }}><span></span>{L.t(k, lang)}</button>)}
      </div>
      <VeiledVerse text={text} level={level} lang={lang} litLine={pacer.lit} />
      {level > 0 && <button className="mask-all" onClick={() => { setLevel(0); setAuto(false); }}>{L.t("revealAll", lang)}</button>}
      {meaning && (showMeaning ? <div className={"plan-meaning" + (lang === "telugu" ? " tel" : "")}>{meaning}</div> : <button className="mask-all" onClick={() => setShowMeaning(true)}>{L.t("psMeaning", lang)}</button>)}
      <PsPacerBar pacer={pacer} speed={speed} setSpeed={setSpeed} reps={reps} setReps={setReps} lang={lang} lines={lines} />
      <div className="ps-actions">
        <button className="ps-again" onClick={() => { pacer.stop(); bump(); }}><Icon name="repeat" size={16} /> {L.t("psOnceMore", lang)}</button>
        <button className={"plan-next" + (round < 3 ? " soft" : "")} onClick={() => { pacer.stop(); onDone(round); }}>{L.t("psHolds", lang)} <Icon name="chev" size={16} /></button>
      </div>
      {round < 3 && <div className="japa-hint">{L.t("psHint", lang)}</div>}
    </div>
  );
}

/* ---- The sitting ---- */
function PlanDay({ hymn, deity, day, meta, go, lang, backView = "daily" }) {
  const L = window.STUTI_L, P = window.STUTI_PLANS;
  const cur = P.chunkFor(hymn, day);
  const newIdxs = useMemoPS(() => { const a = []; for (let i = cur.from; i < cur.to; i++) a.push(i); return a; }, [hymn, day]);
  const review = useMemoPS(() => psReviewSet(hymn, day), [hymn, day]);
  const [stage, setStage] = useStatePS(review.length ? -1 : 0); // -1 review · 0..n-1 learn · n done
  const [rounds, setRounds] = useStatePS(0);
  const finished = stage >= newIdxs.length;
  useEffectPS(() => { if (finished) P.completeDay(hymn.id, day, hymn); }, [finished]);
  const font = L.font(lang);
  const back = () => go(backView);
  const total = (review.length ? 1 : 0) + newIdxs.length;
  const doneN = (review.length ? (stage >= 0 ? 1 : 0) : 0) + Math.max(0, stage);
  const top = (
    <div className="topbar">
      <button className="icon-btn" onClick={back} aria-label={L.a("aBack")}><Icon name="back" /></button>
      <div className="topbar-title display" style={{ fontFamily: font }}>{L.hymnTitle(hymn, lang)}</div>
      <span className="plan-day-tag">{L.t("day", lang)} {day}/{meta.days}</span>
    </div>
  );
  if (finished) {
    return (
      <div className="view japa scroll lens-olive" style={{ "--deity-hue": deity.hue }}>
        {top}
        <div className="plan-done-wrap">
          <div className="plan-done-mark">दीप</div>
          <div className="plan-done-head display">{L.t("dayDone", lang)}</div>
          <p className="plans-lede" style={{ textAlign: "center" }}>{L.t("psRoundsLine", lang).replace("{n}", rounds)}{" "}{day < meta.days ? L.t("backTomorrow", lang) : L.t("planDoneLine", lang)}</p>
          <div className="plan-day-dots">{Array.from({ length: meta.days }).map((_, i) => <span key={i} className={"plan-day-dot" + (i < day ? " on" : "")}></span>)}</div>
          <button className="ps-again" onClick={() => setStage(review.length ? -1 : 0)}><Icon name="repeat" size={16} /> {L.t("psSitAgain", lang)}</button>
          <button className="preface-btn" onClick={back}>{backView === "daily"
            ? <React.Fragment><Icon name="flower" size={17} /> {L.t("nitya", lang)}</React.Fragment>
            : <React.Fragment><Icon name="book" size={17} /> {L.t("backToText", lang)}</React.Fragment>}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="view japa scroll lens-olive" style={{ "--deity-hue": deity.hue }}>
      {top}
      <div className="ps-steps" aria-hidden="true">{Array.from({ length: total }).map((_, i) => <span key={i} className={"ps-step" + (i < doneN ? " done" : i === doneN ? " now" : "")}></span>)}</div>
      {stage === -1
        ? <PsReview key={"r" + day} hymn={hymn} idxs={review} lang={lang} onDone={(p) => { setRounds(r => r + p); setStage(0); }} />
        : <PsLearn key={"l" + newIdxs[stage]} hymn={hymn} vi={newIdxs[stage]} n={stage + 1} of={newIdxs.length} lang={lang} onDone={(r) => { setRounds(x => x + r); setStage(s => s + 1); }} />}
      <div style={{ height: 90 }} />
    </div>
  );
}

Object.assign(window, { PlanDay, VeiledVerse, psReviewSet });

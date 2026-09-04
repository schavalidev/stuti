import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { Flame, Icon } from "./stuti-icons";
import { JAPA_THREADS } from "./stuti-japa";
import { STUTI_LEDGER } from "./stuti-ledger-core";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_JAPA } from "./stuti-sadhana";

/* ============================================================
   STUTI — trackers on the Nitya lenses, and the Ledger lens
   Not a calendar. The app's own figure for practice is the thread —
   the streak is "days unbroken" — so each tracker draws the last
   four weeks as one thread: a bead where the day was kept, a hollow
   bead where it was kept in part, a break where it was not. Two
   figures sit above it, this month and this year. Nothing here
   writes — the reader, the counter, the plan and the bell keep the
   record; this reads it back.
   ============================================================ */
const { useState: useStateLg, useEffect: useEffectLg } = React;
const LG = () => STUTI_LEDGER;
const LG_SPAN = 14;
function useLedger() { const [, f] = useStateLg(0); useEffectLg(() => LG().subscribe(() => f((x) => x + 1)), []); return LG(); }
const lgLoc = (lang) => (lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN");

/* ---- the thread ----
   `read(date)` returns { v: 0 | 0.5 | 1 | 2 | 3, title } — 0 a break, 0.5 a
   hollow bead, 1 a bead, 2 and 3 heavier beads (japa). `onDay` makes the
   beads tappable; `size` is the bead radius. */
function Thread({ read, onDay, size = 5, span = LG_SPAN, sel }) {
  const L = LG(), days = L.lastDays(span), today = L.dkey(new Date());
  const W = 100, step = W / (span - 1), cy = size + 3, H = cy * 2;
  const vals = days.map((d) => Object.assign({ key: L.dkey(d), d }, read(d) || { v: 0 }));
  /* the line runs between consecutive kept days only — a miss is a visible gap */
  const segs = [];
  for (let i = 1; i < vals.length; i++) if (vals[i - 1].v && vals[i].v) segs.push(<line key={i} x1={(i - 1) * step} x2={i * step} y1={cy} y2={cy} />);
  return (
    <div className={"lg-thread" + (onDay ? " tap" : "")} style={{ height: H + (onDay ? 4 : 0) }}>
      <svg viewBox={`0 ${0} ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <line className="lg-th-base" x1="0" x2={W} y1={cy} y2={cy} />
        <g className="lg-th-line">{segs}</g>
      </svg>
      <div className="lg-beads">
        {vals.map((x, i) => {
          const r = x.v >= 3 ? size + 2 : x.v >= 2 ? size + 1 : x.v ? size : x.v === 0.5 ? size : Math.max(1.5, size - 3);
          const cls = "lg-bead" + (x.v === 0 ? " miss" : x.v === 0.5 ? " half" : " on") + (x.v >= 2 ? " w" + Math.floor(x.v) : "") + (x.key === today ? " today" : "") + (sel === x.key ? " sel" : "");
          const style = { left: (i * step) + "%", width: r * 2, height: r * 2 };
          return onDay
            ? <button key={x.key} type="button" className={cls} style={style} title={x.title || ""} aria-label={x.key} onClick={() => onDay(x)} />
            : <span key={x.key} className={cls} style={style} title={x.title || ""} />;
        })}
      </div>
    </div>
  );
}

/* the tracker's own name, its month figure, and how to read it — the
   annual tally is dropped: a year's number told nobody anything a month's
   did not, and the beads are the record worth looking at */
function Figures({ lang, a, aLabel, tap = true }) {
  const L = STUTI_L, font = L.font(lang);
  return (
    <div className="lg-figs">
      <div className="lg-fig"><span className="lg-fig-n display" style={{ fontFamily: font }}>{a}</span><span className="lg-fig-l">{aLabel}</span></div>
      <div className="lg-fig-name">
        <span className="eyebrow">{L.t("lgTracker", lang)}</span>
        {tap && <span className="lg-fig-hint">{L.t("lgTapBead", lang)}</span>}
      </div>
    </div>
  );
}

/* ---- the day, opened as a sheet from a tapped bead ---- */
function DayPeekSheet({ lang, day, eyebrow, children, onClose }) {
  const L = STUTI_L, LG_ = LG();
  const today = day.key === LG_.dkey(new Date());
  const title = today ? L.t("todayLower", lang) : day.d.toLocaleDateString(lgLoc(lang), { weekday: "long", day: "numeric", month: "long" });
  useEffectLg(() => { const k = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  return (
    <OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet lg-sheet" role="dialog" aria-label={title}>
          <div className="pd-grip" />
          <button className="pd-x" onClick={onClose} aria-label={L.t("close", lang)}><Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{eyebrow}</div>
            <div className="rm-head-title display" style={{ fontFamily: L.font(lang) }}>{title}</div>
          </div>
          <div className="pd-body scroll lg-sheet-body">{children}</div>
        </div>
      </div>
    </OverlayPortal>
  );
}

function monthYear() { const n = new Date(), L = LG(); return { m: L.month(n.getFullYear(), n.getMonth()), y: L.year(n.getFullYear()) }; }

/* ---- Recitation ---- */
function ReciteTracker({ lang }) {
  const LG_ = useLedger(), L = STUTI_L, S = STUTI;
  const [peek, setPeek] = useStateLg(null);
  const { m, y } = monthYear();
  const read = (d) => { const r = LG_.recite(d); return { v: r.state === "full" ? 1 : r.state === "part" ? 0.5 : 0, title: r.hit.length + "/" + r.due.length }; };
  const pk = peek && LG_.recite(peek.d);
  return (
    <section className="lg-card">
      <Figures lang={lang} a={m.recite.full + " / " + m.elapsed} aLabel={L.t("lgDaysMonth", lang)} />
      <Thread read={read} sel={peek && peek.key} onDay={(x) => setPeek(peek && peek.key === x.key ? null : x)} />
      {pk && (
        <DayPeekSheet lang={lang} day={peek} eyebrow={L.t("lensPatha", lang)} onClose={() => setPeek(null)}>
          {pk.due.length === 0 && pk.done.length === 0 ? <div className="lg-peek-none">{L.t("lgNothing", lang)}</div> :
            <ul className="lg-sheet-list">{(pk.due.length ? pk.due : pk.done).map((id) => { const h = S.hymnById(id); if (!h) return null; const on = pk.done.indexOf(id) >= 0;
              return <li key={id} className={"lg-peek-h" + (on ? " on" : "")} style={{ fontFamily: L.font(lang) }}>{on ? <Icon name="check" size={14} /> : <span className="lg-peek-o" />}<span>{L.hymnTitle(h, lang)}</span></li>; })}</ul>}
        </DayPeekSheet>
      )}
    </section>
  );
}

/* ---- Japa: bead weight by count ---- */
function JapaTracker({ lang }) {
  const LG_ = useLedger(), L = STUTI_L, J = STUTI_JAPA;
  const [peek, setPeek] = useStateLg(null);
  const { m, y } = monthYear();
  const read = (d) => { const j = LG_.japa(d); return { v: j.level, title: j.n ? j.n + " · " + j.malas + " " + L.t("malas", lang) : "" }; };
  /* what was told that day, mantra by mantra */
  const told = peek ? (JAPA_THREADS || []).map((t) => ({ t, n: J.dayCount(t.id, peek.key) })).filter((x) => x.n > 0) : [];
  const mName = (t) => { try { const d = STUTI.deityById[t.deity || t.id]; return d ? L.name(d, lang) : t.id; } catch (e) { return t.id; } };
  return (
    <section className="lg-card">
      <Figures lang={lang} a={m.japa.malas} aLabel={L.t("lgMalasMonth", lang)} />
      <Thread read={read} sel={peek && peek.key} onDay={(x) => setPeek(peek && peek.key === x.key ? null : x)} />
      {peek && (
        <DayPeekSheet lang={lang} day={peek} eyebrow={L.t("lensJapa", lang)} onClose={() => setPeek(null)}>
          {told.length === 0 ? <div className="lg-peek-none">{L.t("lgNothing", lang)}</div> :
            <ul className="lg-sheet-list">{told.map(({ t, n }) => <li key={t.id} className="lg-peek-h on" style={{ fontFamily: L.font(lang) }}><Icon name="mala" size={14} /><span>{mName(t)}</span><i>{n} · {Math.floor(n / J.MALA)} {L.t("malas", lang)}</i></li>)}</ul>}
        </DayPeekSheet>
      )}
    </section>
  );
}

/* ---- Learn ---- */
function LearnTracker({ lang }) {
  const LG_ = useLedger(), L = STUTI_L;
  const { m, y } = monthYear();
  const read = (d) => { const l = LG_.learn(d); return { v: l.n ? 1 : 0, title: l.n ? L.t("lgPortions", lang).replace("{n}", l.n) : "" }; };
  return (
    <section className="lg-card">
      <Figures lang={lang} a={m.learn.days + " / " + m.elapsed} aLabel={L.t("lgDaysMonth", lang)} tap={false} />
      <Thread read={read} />
    </section>
  );
}

/* ---- the Ledger lens: the streak, then one thread per practice ---- */
function LedgerLens({ lang, onLens }) {
  const LG_ = useLedger(), L = STUTI_L;
  const font = L.font(lang);
  const st = LG_.streak();
  const { m, y } = monthYear();
  const rows = [
    { lens: "patha", icon: "flower", label: L.t("lensPatha", lang), n: m.recite.full + " / " + m.elapsed + " " + L.t("lgDays", lang),
      read: (d) => { const r = LG_.recite(d).state; return { v: r === "full" ? 1 : r === "part" ? 0.5 : 0 }; } },
    { lens: "japa", icon: "mala", label: L.t("lensJapa", lang), n: m.japa.malas + " " + L.t("malas", lang),
      read: (d) => ({ v: LG_.japa(d).level }) },
    { lens: "learn", icon: "spark", label: L.t("lensLearn", lang), n: m.learn.days + " / " + m.elapsed + " " + L.t("lgDays", lang),
      read: (d) => ({ v: LG_.learn(d).n ? 1 : 0 }) },
    { lens: "nomu", icon: "vayanam", label: L.t("lensNomu", lang), n: L.t("lgTicks", lang).replace("{n}", m.nomu.ticks),
      read: (d) => ({ v: LG_.nomu(d).n ? 1 : 0 }) },
  ].filter((r) => r.lens !== "nomu" || lang !== "deva");
  return (
    <div className="lg-card lg-ledger">
      <div className="lg-streak">
        <Flame size={24} />
        <div>
          <div className="lg-streak-n display" style={{ fontFamily: font }}>{st.days}</div>
          <div className="lg-streak-l">{L.t("lgStreak", lang)}{st.graced ? " · " + L.t("lgGraced", lang).replace("{n}", st.graced) : ""}</div>
        </div>
        <div className="lg-streak-span">{L.t("lgSpan", lang)}</div>
      </div>
      <div className="lg-rows">
        {rows.map((r) => (
          <button key={r.lens} className="lg-row" onClick={() => onLens && onLens(r.lens)}>
            <span className="lg-row-head">
              <span className="lg-row-label"><Icon name={r.icon} size={15} /><span>{r.label}</span></span>
              <span className="lg-row-n">{r.n}</span>
            </span>
            <Thread read={r.read} size={3.5} />
          </button>
        ))}
      </div>
    </div>
  );
}

export { DayPeekSheet, ReciteTracker, JapaTracker, LearnTracker, LedgerLens, Thread, useLedger };

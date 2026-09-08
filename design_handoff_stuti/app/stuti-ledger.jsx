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
const LG = () => window.STUTI_LEDGER;
const LG_SPAN = 14;
function useLedger() { const [, f] = useStateLg(0); useEffectLg(() => LG().subscribe(() => f((x) => x + 1)), []); return LG(); }
const lgLoc = (lang) => (lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN");

/* ---- the thread ----
   `read(date)` returns { v: 0 | 0.5 | 1 | 2 | 3, title } — 0 a break, 0.5 a
   hollow bead, 1 a bead, 2 and 3 heavier beads (japa). `onDay` makes the
   beads tappable; `size` is the bead radius. */
function Thread({ read, onDay, size = 5, span = LG_SPAN, sel, days: given }) {
  const L = LG(), days = given || L.lastDays(span), today = L.dkey(new Date());
  span = days.length;
  const W = 100, step = W / (span - 1), cy = size + 3, H = cy * 2;
  /* a day not yet come is neither kept nor missed — it draws as a faint dot */
  const vals = days.map((d) => { const key = L.dkey(d); return Object.assign({ key, d }, key > today ? { v: 0, future: true } : (read(d) || { v: 0 })); });
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
          const cls = "lg-bead" + (x.future ? " future" : x.v === 0 ? " miss" : x.v === 0.5 ? " half" : " on") + (x.v >= 2 ? " w" + Math.floor(x.v) : "") + (x.key === today ? " today" : "") + (sel === x.key ? " sel" : "");
          const style = { left: (i * step) + "%", width: r * 2, height: r * 2 };
          return onDay
            ? <button key={x.key} type="button" className={cls} style={style} title={x.title || ""} aria-label={x.key} onClick={() => onDay(x)} />
            : <span key={x.key} className={cls} style={style} title={x.title || ""} />;
        })}
      </div>
    </div>
  );
}

/* one line above the thread: the tracker's name and, where the beads open
   a day, how to. The month figure ("0 / 4 days") was a score before the
   month began; the beads are the record and need no tally. */
function Figures({ lang, a, aLabel, tap = true }) {
  const L = window.STUTI_L;
  return (
    <div className="lg-figs">
      {a != null && <div className="lg-fig"><span className="lg-fig-n display" style={{ fontFamily: L.font(lang) }}>{a}</span><span className="lg-fig-l">{aLabel}</span></div>}
      <div className="lg-fig-name">
        <span className="eyebrow">{L.t("lgTracker", lang)}{tap && <span className="lg-fig-hint"> · {L.t("lgTapBead", lang)}</span>}</span>
      </div>
    </div>
  );
}

/* ---- the day, opened as a sheet from a tapped bead ---- */
function DayPeekSheet({ lang, day, eyebrow, children, foot, onClose }) {
  const L = window.STUTI_L, LG_ = LG();
  const today = day.key === LG_.dkey(new Date());
  const title = today ? L.t("todayLower", lang) : day.d.toLocaleDateString(lgLoc(lang), { weekday: "long", day: "numeric", month: "long" });
  useEffectLg(() => { const k = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  return (
    <window.OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet lg-sheet" role="dialog" aria-label={title}>
          <div className="pd-grip" />
          <button className="pd-x" onClick={onClose} aria-label={L.t("close", lang)}><window.Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{eyebrow}</div>
            <div className="rm-head-title display" style={{ fontFamily: L.font(lang) }}>{title}</div>
          </div>
          <div className="pd-body scroll lg-sheet-body">{children}
            {foot && <div className="lg-sheet-foot"><span className="lg-fig-n display" style={{ fontFamily: L.font(lang) }}>{foot.n}</span><span className="lg-fig-l">{foot.label}</span></div>}
          </div>
        </div>
      </div>
    </window.OverlayPortal>
  );
}

function monthYear() { const n = new Date(), L = LG(); return { m: L.month(n.getFullYear(), n.getMonth()), y: L.year(n.getFullYear()) }; }

/* ---- Recitation ---- */
function ReciteTracker({ lang }) {
  const LG_ = useLedger(), L = window.STUTI_L, S = window.STUTI;
  const [peek, setPeek] = useStateLg(null);
  const { m, y } = monthYear();
  const read = (d) => { const r = LG_.recite(d); return { v: r.state === "full" ? 1 : r.state === "part" ? 0.5 : 0, title: r.hit.length + "/" + r.due.length }; };
  const pk = peek && LG_.recite(peek.d);
  return (
    <section className="lg-card">
      <Figures lang={lang} />
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
  const LG_ = useLedger(), L = window.STUTI_L, J = window.STUTI_JAPA;
  const [peek, setPeek] = useStateLg(null);
  const { m, y } = monthYear();
  const read = (d) => { const j = LG_.japa(d); return { v: j.level, title: j.n ? j.n + " · " + j.malas + " " + L.t("malas", lang) : "" }; };
  /* what was told that day, mantra by mantra */
  const told = peek ? (window.JAPA_THREADS || []).map((t) => ({ t, n: J.dayCount(t.id, peek.key) })).filter((x) => x.n > 0) : [];
  const mName = (t) => { try { const d = window.STUTI.deityById[t.deity || t.id]; return d ? L.name(d, lang) : t.id; } catch (e) { return t.id; } };
  return (
    <section className="lg-card">
      <Figures lang={lang} />
      <Thread read={read} sel={peek && peek.key} onDay={(x) => setPeek(peek && peek.key === x.key ? null : x)} />
      {peek && (
        <DayPeekSheet lang={lang} day={peek} eyebrow={L.t("lensJapa", lang)} foot={{ n: m.japa.malas, label: L.t("lgMalasMonth", lang) }} onClose={() => setPeek(null)}>
          {told.length === 0 ? <div className="lg-peek-none">{L.t("lgNothing", lang)}</div> :
            <ul className="lg-sheet-list">{told.map(({ t, n }) => <li key={t.id} className="lg-peek-h on" style={{ fontFamily: L.font(lang) }}><Icon name="mala" size={14} /><span>{mName(t)}</span><i>{n} · {Math.floor(n / J.MALA)} {L.t("malas", lang)}</i></li>)}</ul>}
        </DayPeekSheet>
      )}
    </section>
  );
}

/* ---- Learn ---- */
function LearnTracker({ lang }) {
  const LG_ = useLedger(), L = window.STUTI_L;
  const { m, y } = monthYear();
  const read = (d) => { const l = LG_.learn(d); return { v: l.n ? 1 : 0, title: l.n ? L.t("lgPortions", lang).replace("{n}", l.n) : "" }; };
  return (
    <section className="lg-card">
      <Figures lang={lang} tap={false} />
      <Thread read={read} />
    </section>
  );
}

/* ---- the Ledger lens: the streak, then one thread per practice ----
   Three spans on the same record — the week just gone, the month so
   far, the year so far — switched at the top and remembered. Each row
   carries the span's figure, how far it fills the days elapsed, and the
   change against the span before it. Week and month draw their days as
   the thread; the year is too long for beads and draws twelve month-bars. */
const LG_SPANS = ["week", "month", "year"], LG_SPAN_KEY = "stuti-ledger-span";
function readSpan() { try { const v = localStorage.getItem(LG_SPAN_KEY); return LG_SPANS.indexOf(v) >= 0 ? v : "month"; } catch (e) { return "month"; } }

/* Each span is read with the figure that suits it, not one thread stretched
   to fit: the week as seven day-cells under their weekday letters, the month
   as a heat calendar plus a bar per calendar week, the year as twelve
   month-bars. `lvl` maps a day's value to a tint step 0–4. */
const lgTint = (v) => v <= 0 ? 0 : v === 0.5 ? 1 : v >= 3 ? 4 : v >= 2 ? 3 : 2;

/* the week: one cell per day, filled by what that day held. `onPick` makes a
   past day pressable — the day's own record opens as a sheet. */
function DayCells({ read, days, lang, head, onPick, sel }) {
  const LG_ = LG(), today = LG_.dkey(new Date());
  return (
    <span className="lg-cells">
      {days.map((d) => {
        const key = LG_.dkey(d), future = key > today, v = future ? 0 : (read(d) || { v: 0 }).v;
        const cls = "lg-cell" + (future ? " future" : "") + (key === today ? " today" : "") + (sel === key ? " sel" : "") + (onPick && !future ? " tap" : "");
        const inner = (
          <React.Fragment>
            {head && <span className="lg-cell-l">{d.toLocaleDateString(lgLoc(lang), { weekday: "short" }).slice(0, 2)}</span>}
            {head && <span className="lg-cell-d">{d.getDate()}</span>}
          </React.Fragment>
        );
        return onPick && !future
          ? <button key={key} type="button" className={cls} data-t={lgTint(v)} onClick={() => onPick(d)}>{inner}</button>
          : <span key={key} className={cls} data-t={future ? 0 : lgTint(v)}>{inner}</span>;
      })}
    </span>
  );
}

/* the month: the whole month as a calendar, tinted by how much of the day's
   practice was kept — the one figure that answers "how has the month gone" */
function MonthHeat({ lang, year, month, onPick, sel }) {
  const LG_ = LG(), cells = LG_.monthCells(year, month), today = LG_.dkey(new Date());
  const wd = [];
  for (let i = 0; i < 7; i++) wd.push(new Date(2024, 8, 1 + i).toLocaleDateString(lgLoc(lang), { weekday: "short" }).slice(0, 2));
  const score = (d) => {
    const r = LG_.recite(d).state, n = (r === "full" ? 1 : r === "part" ? 0.5 : 0) + (LG_.japa(d).n > 0 ? 1 : 0) + (LG_.learn(d).n ? 1 : 0) + (LG_.nomu(d).n ? 1 : 0);
    return n <= 0 ? 0 : n < 1 ? 1 : n < 2 ? 2 : n < 3 ? 3 : 4;
  };
  return (
    <div className="lg-heat">
      <div className="lg-heat-wd">{wd.map((w, i) => <span key={i}>{w}</span>)}</div>
      <div className="lg-heat-grid">
        {cells.map((c, i) => {
          if (c === null) return <span key={"e" + i} className="lg-hc pad" />;
          const future = c.key > today;
          const cls = "lg-hc" + (future ? " future" : "") + (c.key === today ? " today" : "") + (sel === c.key ? " sel" : "") + (onPick && !future ? " tap" : "");
          return onPick && !future
            ? <button key={c.key} type="button" className={cls} data-t={score(c.date)} onClick={() => onPick(c.date)}>{c.d}</button>
            : <span key={c.key} className={cls} data-t={future ? 0 : score(c.date)}>{c.d}</span>;
        })}
      </div>
    </div>
  );
}

/* the twelve months of the year as bars; `val(monthSummary)` -> 0..1 */
function YearBars({ lang, val, year, onPick, sel }) {
  const LG_ = LG(), now = new Date(), cur = year === now.getFullYear() ? now.getMonth() : 11;
  const months = []; for (let i = 0; i < 12; i++) months.push(i);
  return (
    <div className="lg-bars lg-bars-big" aria-hidden={onPick ? undefined : "true"}>
      {months.map((i) => {
        const future = i > cur, s = future ? null : LG_.month(year, i), v = s ? Math.min(1, val(s)) : 0;
        const label = new Date(year, i, 1).toLocaleDateString(lgLoc(lang), { month: "short" }).replace(".", "");
        const cls = "lg-bar" + (future ? " future" : "") + (i === cur ? " now" : "") + (sel === i ? " sel" : "") + (onPick && !future ? " tap" : "");
        const inner = (
          <React.Fragment>
            <span className="lg-bar-track"><span className="lg-bar-fill" style={{ height: (v * 100) + "%" }} /></span>
            <span className="lg-bar-l">{label}</span>
          </React.Fragment>
        );
        return onPick && !future
          ? <button key={i} type="button" className={cls} onClick={() => onPick(i)}>{inner}</button>
          : <span key={i} className={cls}>{inner}</span>;
      })}
    </div>
  );
}

/* the span's own name, and a way to step back through them */
function spanTitle(span, view, lang) {
  if (span === "year") return String(view.y);
  if (span === "month") return new Date(view.y, view.m, 1).toLocaleDateString(lgLoc(lang), { month: "long", year: "numeric" });
  const a = view.days[0], b = view.days[view.days.length - 1], loc = lgLoc(lang);
  const same = a.getMonth() === b.getMonth();
  return a.toLocaleDateString(loc, { day: "numeric", month: same ? undefined : "short" }) + " \u2013 " + b.toLocaleDateString(loc, { day: "numeric", month: "short" });
}
const lgName = (o, lang) => !o ? "" : (window.pick3 ? window.pick3(o.name, lang) : (o.name && (o.name.roman || o.name.tel)) || "");

/* the named record under the figures: what was recited and how often, what
   was learnt, which d\u012bk\u1e63\u0101s ran their course, which nomulu and vrat\u0101lu were kept */
function LedgerDetail({ lang, det, span, onOpen }) {
  const L = window.STUTI_L, S = window.STUTI, font = L.font(lang);
  const [all, setAll] = useStateLg(false);
  const hymn = (id) => { const h = S.hymnById(id); return h ? L.hymnTitle(h, lang) : id; };
  const vowName = (v) => v.kind === "japa" ? (v.label || L.t("lensJapa", lang)) : hymn(v.hymn);
  const keepName = (k) => { let s = null; try { s = window.STUTI_KEEP.subject(k); } catch (e) {} return lgName(s, lang) || k.ref; };
  const recited = all ? det.recited : det.recited.slice(0, 6);
  const sect = (key, items) => items.length ? (
    <div className="lg-sect" key={key}>
      <div className="eyebrow lg-sect-h">{L.t(key, lang)}</div>
      <ul className="lg-list">{items}</ul>
    </div>
  ) : null;
  const li = (k, name, note, click) => (
    <li key={k} className={"lg-li" + (click ? " tap" : "")} onClick={click || undefined}>
      <span className="lg-li-n" style={{ fontFamily: font }}>{name}</span>
      {note && <span className="lg-li-x">{note}</span>}
    </li>
  );
  const any = det.recited.length || det.learnt.length || det.diksha.length || det.nomus.length || det.vratas.length;
  if (!any) return <div className="lg-empty">{L.t("lgNoneYet", lang)}</div>;
  return (
    <div className="lg-detail">
      {sect("lgRecited", recited.map((r) => {
        const h = S.hymnById(r.id);
        return li(r.id, h ? L.hymnTitle(h, lang) : r.id, L.t(r.n === 1 ? "lgTime1" : "lgTimes", lang).replace("{n}", r.n),
          h && onOpen ? () => onOpen(h) : null);
      }))}
      {det.recited.length > 6 && (
        <button className="lg-more" onClick={() => setAll(!all)}>
          {all ? L.t("lgLess", lang) : L.t("lgMore", lang).replace("{n}", det.recited.length - 6)}
        </button>
      )}
      {sect("lgLearnt", det.learnt.map((x) => li(x.id, hymn(x.id), null)))}
      {sect("lgDiksha", det.diksha.map((x) => li(x.v.id, vowName(x.v), L.t("lgKeptN", lang).replace("{n}", x.kept))))}
      {sect("lgNomus", det.nomus.map((x) => li(x.k.id, keepName(x.k), x.done ? L.t("lgNomuDone", lang) : L.t("lgTicksN", lang).replace("{n}", x.ticks))))}
      {sect("lgVratas", det.vratas.map((x) => li(x.k.id + x.on, keepName(x.k), new Date(x.on + "T12:00:00").toLocaleDateString(lgLoc(lang), { day: "numeric", month: "short" }))))}
    </div>
  );
}

/* a tapped day or a tapped month, opened as a sheet: everything the ledger
   holds for that stretch — recitation, japa, kaṇṭhastha, nomulu, vratālu —
   read with the same LedgerDetail the span itself uses. */
function LedgerPeek({ lang, title, eyebrow, days, onOpen, onClose }) {
  const L = window.STUTI_L, LG_ = LG(), font = L.font(lang);
  const det = LG_.detail(days), sum = LG_.summary(days);
  const figs = [
    { k: "patha", icon: "flower", n: sum.recite.full, label: L.t("lensPatha", lang) },
    { k: "japa", icon: "mala", n: sum.japa.malas, label: L.t("lensJapa", lang) },
    { k: "learn", icon: "spark", n: sum.learn.days, label: L.t("lensLearn", lang) },
    { k: "nomu", icon: "vayanam", n: sum.nomu.ticks, label: L.t("lensNomu", lang) },
  ].filter((f) => f.n > 0 && (f.k !== "nomu" || lang !== "deva"));
  return (
    <window.OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose}></div>
        <div className="pd-sheet lg-sheet" role="dialog" aria-label={title}>
          <div className="pd-grip"></div>
          <button className="pd-x" onClick={onClose} aria-label={L.t("close", lang)}><window.Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{eyebrow}</div>
            <h3 className="rm-title display" style={{ fontFamily: font }}>{title}</h3>
          </div>
          <div className="pd-body scroll lg-sheet-body">
            {figs.length > 0 && (
              <div className="lg-peek-figs">
                {figs.map((f) => <span key={f.k} className="lg-peek-fig"><window.Icon name={f.icon} size={15} /><b style={{ fontFamily: font }}>{f.n}</b><span>{f.label}</span></span>)}
              </div>
            )}
            <LedgerDetail lang={lang} det={det} onOpen={onOpen} />
          </div>
        </div>
      </div>
    </window.OverlayPortal>
  );
}

function LedgerLens({ lang, onLens, go }) {
  const LG_ = useLedger(), L = window.STUTI_L;
  const font = L.font(lang);
  const [span, setSpanRaw] = useStateLg(readSpan);
  const [off, setOff] = useStateLg(0);      /* 0 is the span running now, -1 the one before it */
  const setSpan = (v) => { setSpanRaw(v); setOff(0); try { localStorage.setItem(LG_SPAN_KEY, v); } catch (e) {} };
  const st = LG_.streak();
  const now = new Date(), Y0 = now.getFullYear(), M0 = now.getMonth(), DAY = 86400000;

  const view = React.useMemo(() => {
    if (span === "week") {
      const end = new Date(now.getTime() + off * 7 * DAY), days = LG_.weekDates(end);
      return { days, cur: LG_.summary(days), prev: LG_.summary(LG_.weekDates(new Date(end.getTime() - 7 * DAY))) };
    }
    if (span === "month") {
      const d = new Date(Y0, M0 + off, 1), y = d.getFullYear(), m = d.getMonth(), pm = new Date(y, m - 1, 1);
      return { days: LG_.monthDates(y, m), y, m, cur: LG_.month(y, m), prev: LG_.month(pm.getFullYear(), pm.getMonth()) };
    }
    const y = Y0 + off;
    return { days: LG_.yearDates(y), y, cur: LG_.year(y), prev: LG_.year(y - 1) };
  }, [span, off, LG_, st.days, st.today]);

  const cur = view.cur, prev = view.prev, days = view.days;
  const det = React.useMemo(() => LG_.detail(days), [days, LG_, st.days, st.today]);
  const ofDays = () => "/ " + cur.elapsed + " " + L.t("lgDays", lang);
  const unitKey = span === "week" ? "lgVsWeek" : span === "month" ? "lgVsMonth" : "lgVsYear";
  const sameKey = span === "week" ? "lgSameWeek" : span === "month" ? "lgSameMonth" : "lgSameYear";
  const rows = [
    { lens: "patha", icon: "flower", label: L.t("lensPatha", lang), n: cur.recite.full, sub: ofDays(), fill: cur.recite.full / Math.max(1, cur.elapsed), delta: prev && cur.recite.full - prev.recite.full, unit: "lgDays" },
    { lens: "japa", icon: "mala", label: L.t("lensJapa", lang), n: cur.japa.malas, sub: L.t("malas", lang) + " \u00b7 " + cur.japa.days + " " + ofDays(), fill: cur.japa.days / Math.max(1, cur.elapsed), delta: prev && cur.japa.malas - prev.japa.malas, unit: "malas" },
    { lens: "learn", icon: "spark", label: L.t("lensLearn", lang), n: cur.learn.days, sub: ofDays(), fill: cur.learn.days / Math.max(1, cur.elapsed), delta: prev && cur.learn.days - prev.learn.days, unit: "lgDays" },
    { lens: "nomu", icon: "vayanam", label: L.t("lensNomu", lang), n: cur.nomu.ticks, sub: L.t("lgKept", lang), fill: cur.nomu.days / Math.max(1, cur.elapsed), delta: prev && cur.nomu.ticks - prev.nomu.ticks, unit: "lgDays" },
  ].filter((r) => r.lens !== "nomu" || lang !== "deva");

  const dayLevel = (d) => {
    const r = LG_.recite(d).state;
    return (r === "full" ? 1 : r === "part" ? 0.5 : 0) + (LG_.japa(d).n > 0 ? 1 : 0) + (LG_.learn(d).n ? 1 : 0) + (LG_.nomu(d).n ? 1 : 0);
  };
  const active = React.useMemo(() => {
    const today = LG_.dkey(now);
    return days.filter((d) => LG_.dkey(d) <= today && (LG_.recite(d).state !== "none" || LG_.japa(d).n > 0 || LG_.learn(d).n > 0 || LG_.nomu(d).n > 0)).length;
  }, [days, LG_, st.days, st.today]);
  const deltaText = (d, unit) => d == null ? null : d === 0 ? L.t(sameKey, lang)
    : (d > 0 ? "+" : "\u2212") + Math.abs(d) + " " + L.t(unit, lang) + " " + L.t(unitKey, lang);
  const openHymn = go ? (h) => go("reader", { deity: h.deity, hymn: h.id, from: "practice" }) : null;

  /* a day or a month tapped out of the figure above: {kind, key, title, days} */
  const [peek, setPeek] = useStateLg(null);
  React.useEffect(() => { setPeek(null); }, [span, off]);
  const pickDay = (d) => {
    const key = LG_.dkey(d);
    if (peek && peek.key === key) return setPeek(null);
    setPeek({ kind: "day", key, days: [d], title: d.toLocaleDateString(lgLoc(lang), { weekday: "long", day: "numeric", month: "long" }) });
  };
  const pickMonth = (mi) => {
    const key = "m" + mi;
    if (peek && peek.key === key) return setPeek(null);
    setPeek({ kind: "month", key, days: LG_.monthDates(view.y, mi), title: new Date(view.y, mi, 1).toLocaleDateString(lgLoc(lang), { month: "long", year: "numeric" }) });
  };

  return (
    <div className="lg-card lg-ledger">
      <div className="lg-seg" role="tablist">
        {LG_SPANS.map((s) => <button key={s} role="tab" aria-selected={span === s} className={"lg-seg-b" + (span === s ? " on" : "")} onClick={() => setSpan(s)}>{L.t(s === "week" ? "lgSegWeek" : s === "month" ? "lgSegMonth" : "lgSegYear", lang)}</button>)}
      </div>

      {/* which week, month or year is being read \u2014 and a step either way */}
      <div className="lg-nav">
        <button className="lg-nav-b" onClick={() => setOff(off - 1)} aria-label={L.t("lgPrev", lang)}><Icon name="chevron-left" size={18} /></button>
        <div className="lg-nav-t" style={{ fontFamily: font }}>{spanTitle(span, view, lang)}</div>
        <button className="lg-nav-b" onClick={() => setOff(Math.min(0, off + 1))} disabled={off >= 0} aria-label={L.t("lgNext", lang)}><Icon name="chevron-right" size={18} /></button>
      </div>

      <div className="lg-head">
        <div className="lg-head-n display" style={{ fontFamily: font }}>{active}<span className="lg-of">/{cur.elapsed}</span></div>
        <div className="lg-head-l">{L.t("lgActive", lang)}</div>
      </div>
      <div className="lg-prog" aria-hidden="true"><span style={{ width: (100 * active / Math.max(1, cur.elapsed)) + "%" }} /></div>

      {span === "week" ? <DayCells read={(d) => ({ v: dayLevel(d) })} days={days} lang={lang} head onPick={pickDay} sel={peek && peek.key} />
        : span === "month" ? <MonthHeat lang={lang} year={view.y} month={view.m} onPick={pickDay} sel={peek && peek.key} />
        : <YearBars lang={lang} year={view.y} onPick={pickMonth} sel={peek && peek.kind === "month" ? Number(peek.key.slice(1)) : null} val={(s) => s.elapsed ? (s.recite.full + s.japa.days + s.learn.days + s.nomu.days) / (4 * s.elapsed) : 0} />}
      <div className="lg-tap-hint">{L.t(span === "year" ? "lgTapMonth" : "lgTapDay", lang)}</div>

      {peek && <LedgerPeek lang={lang} days={peek.days} title={peek.title} eyebrow={L.t("lensLedger", lang)} onOpen={openHymn} onClose={() => setPeek(null)} />}

      {off === 0 && (
        <div className="lg-streak lg-streak-line">
          <Flame size={20} />
          <span className="lg-streak-n display" style={{ fontFamily: font }}>{st.days}</span>
          <span className="lg-streak-l">{L.t("lgStreak", lang)}{st.graced ? " \u00b7 " + L.t("lgGraced", lang).replace("{n}", st.graced) : ""}</span>
        </div>
      )}

      <div className="lg-rows">
        {rows.map((r) => { const dt = deltaText(r.delta, r.unit); return (
          <div key={r.lens} className="lg-row lg-row-flat">
            <div className="lg-row-head">
              <span className="lg-row-label"><Icon name={r.icon} size={16} /><span>{r.label}</span></span>
              <span className="lg-row-n"><b style={{ fontFamily: font }}>{r.n}</b> {r.sub}</span>
            </div>
            <div className="lg-row-bar"><span style={{ width: (100 * Math.min(1, r.fill)) + "%" }} /></div>
            {dt && <div className={"lg-row-delta" + (r.delta > 0 ? " up" : r.delta < 0 ? " down" : "")}>{dt}</div>}
          </div>
        ); })}
      </div>

      <LedgerDetail lang={lang} det={det} span={span} onOpen={openHymn} />
    </div>
  );
}

Object.assign(window, { MonthHeat, DayCells, YearBars, LedgerDetail, DayPeekSheet, LedgerPeek, ReciteTracker, JapaTracker, LearnTracker, LedgerLens, Thread, useLedger });

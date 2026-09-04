import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { Flame, Icon } from "./stuti-icons";
import { STUTI_LEDGER } from "./stuti-ledger-core";
import { STUTI_LIB } from "./stuti-library-data";
import { pick3 } from "./stuti-library";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_JAPA, STUTI_THREAD } from "./stuti-sadhana";

/* ============================================================
   STUTI — sādhanā UI: the unbroken thread + japa mālā
   ThreadCard (heat-strip of the last 28 days) · JapaEntryCard
   · JapaView (108-bead counter with haptics)
   ============================================================ */
const { useState: useStateJ, useEffect: useEffectJ, useRef: useRefJ } = React;

/* One thread per deity — an id and the deity it is kept for, and nothing else.
   This used to be a table of mūla mantras, printed on the counter as though the
   app were handing one out. A bīja or a mūla mantra is received from a guru,
   not published to whoever opens a page, and a practitioner already has theirs.
   So the app supplies no mantra at all: it counts the mālā, names whose thread
   it is, and stays out of the japa itself. */
const JAPA_THREADS = [
  { id: "ganesha",     deity: "ganesha" },
  { id: "shiva",       deity: "shiva" },
  { id: "devi",        deity: "devi" },
  { id: "vishnu",      deity: "vishnu" },
  { id: "subrahmanya", deity: "subrahmanya" },
  { id: "surya",       deity: "surya" },
  { id: "hanuman",     deity: "hanuman" },
  { id: "guru",        deity: "guru" },
];

/* ---------------- The unbroken thread ---------------- */
function ThreadCard({ lang = "deva" }) {
  const L = STUTI_L;
  const [, force] = useStateJ(0);
  useEffectJ(() => STUTI_THREAD.subscribe(() => force(x => x + 1)), []);
  const s = STUTI_THREAD.streak();
  const cells = STUTI_THREAD.last(28);
  const FlameI = Flame;
  const note = s.days === 0 ? L.t("threadBegin", lang)
    : !s.today ? L.t("threadToday", lang)
    : s.graced ? L.t("threadKept", lang) + " · " + L.t("graceHeld", lang)
    : L.t("threadKept", lang);
  return (
    <div className="thread-card">
      <div className="thread-top">
        <div className={"thread-flame" + (s.today ? " lit" : "")}>{FlameI ? <FlameI size={24} /> : <Icon name="lotus" size={22} />}</div>
        <div style={{ minWidth: 0 }}>
          <div className="thread-title">{L.t("thread", lang)}</div>
          <div className="thread-count">{s.days}<small>{L.t(s.days === 1 ? "threadDay" : "threadDays", lang)}</small></div>
          <div className="thread-note">{note}</div>
        </div>
      </div>
      <div className="thread-grid" aria-label={L.t("thread", lang)}>
        {cells.map(c => <span key={c.key} className={"thread-cell l" + c.level + (c.today ? " today" : "")} title={c.key}></span>)}
      </div>
    </div>
  );
}

/* ---------------- The thread, as a strip ----------------
   The same record, worn thin: it belongs to no one lens, because
   reciting, practising and japa all keep it. Tap a day and it says
   what kept it — the store has known all along. */
function ThreadStrip({ lang = "deva" }) {
  const L = STUTI_L, S = STUTI, T = STUTI_THREAD;
  const [, force] = useStateJ(0);
  const [sel, setSel] = useStateJ(null);
  useEffectJ(() => T.subscribe(() => force(x => x + 1)), []);
  const s = T.streak();
  const cells = T.last(28);
  const FlameI = Flame;
  const note = s.days === 0 ? L.t("threadBegin", lang)
    : !s.today ? L.t("threadToday", lang)
    : s.graced ? L.t("threadKept", lang) + " · " + L.t("graceHeld", lang)
    : L.t("threadKept", lang);

  const locale = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined;
  const dayLabel = (key) => {
    const p = key.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  };
  const dayLabelLong = (key) => {
    const p = key.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  /* The same record, listed rather than crushed into one line: every hymn,
     practice and tally gets its own row, because a joined string at caption
     size was the one thing in the strip nobody could read. */
  const keptRows = (key) => {
    const r = T.day(key);
    if (!r) return [];
    const LIB = STUTI_LIB, rows = [];
    (r.r || []).forEach((id) => {
      const h = S.hymnById(id);
      if (h) rows.push({ k: L.t("threadKindRecited", lang), v: L.hymnTitle(h, lang) });
    });
    (r.p || []).forEach((id) => {
      if (id.indexOf("vow:") === 0) { rows.push({ k: L.t("threadKindVow", lang), v: L.t("threadVow", lang) }); return; }
      if (id.indexOf("plan:") === 0) { rows.push({ k: L.t("threadKindPlan", lang), v: L.t("threadPlan", lang) }); return; }
      const pr = LIB && LIB.practiceById(id);
      if (pr) rows.push({ k: L.t("threadKindPractised", lang), v: pick3 ? pick3(pr.name, lang) : pr.name.roman });
    });
    if (r.j > 0) rows.push({ k: L.t("threadKindJapa", lang), v: L.t("threadBeads", lang).replace("{n}", r.j) });
    return rows;
  };

  const selRows = sel ? keptRows(sel) : null;
  const Portal = OverlayPortal || (({ children }) => children);
  useEffectJ(() => {
    if (!sel) return;
    const esc = (e) => { if (e.key === "Escape") setSel(null); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [sel]);
  return (
    <div className="thread-strip">
      <div className="thread-strip-head">
        <div className="eyebrow">{L.t("threadHeading", lang)}</div>
        <p className="thread-strip-sub">{L.t("threadSub", lang)}</p>
      </div>
      <div className="thread-strip-row">
        <span className="thread-strip-count">{s.days}<i>{L.t(s.days === 1 ? "threadDay" : "threadDays", lang)}</i></span>
        <span className="thread-strip-grid" role="group" aria-label={L.t("thread", lang)}>
          {cells.map((c) => (
            <button key={c.key} type="button"
              className={"thread-strip-cell l" + c.level + (c.today ? " today" : "") + (sel === c.key ? " sel" : "")}
              aria-label={dayLabel(c.key)} aria-pressed={sel === c.key}
              onClick={() => setSel((x) => (x === c.key ? null : c.key))} />
          ))}
        </span>
      </div>
      {sel && (
        <Portal>
          <div className="tday-scrim" onClick={() => setSel(null)} />
          <div className="tday-sheet" role="dialog" aria-label={dayLabelLong(sel)}>
            <div className="tday-grip" />
            <div className="tday-head">
              <div style={{ minWidth: 0 }}>
                <div className="eyebrow">{L.t("threadHeading", lang)}</div>
                <h3 className="tday-date">{dayLabelLong(sel)}</h3>
              </div>
              <button className="tday-x" onClick={() => setSel(null)} aria-label={STUTI_L.a("aClose")}>×</button>
            </div>
            <div className="tday-list scroll">
              {selRows.length ? selRows.map((row, i) => (
                <div className="tday-row" key={i}>
                  <span className="tday-row-k">{row.k}</span>
                  <span className="tday-row-v">{row.v}</span>
                </div>
              )) : <div className="tday-empty">{L.t("threadNone", lang)}</div>}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

/* ---------------- Nitya-tab entry into the mālā ---------------- */
function BeadsGlyph({ size = 26 }) {
  const dots = [];
  for (let i = 0; i < 9; i++) { const a = (-90 + i * 40) * Math.PI / 180; dots.push(<circle key={i} cx={13 + 9.5 * Math.cos(a)} cy={13 + 9.5 * Math.sin(a)} r={i === 0 ? 2.6 : 1.9} fill="currentColor" opacity={i === 0 ? 1 : 0.75} />); }
  return <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true">{dots}</svg>;
}
function JapaEntryCard({ go, lang = "deva" }) {
  const L = STUTI_L;
  const [, force] = useStateJ(0);
  useEffectJ(() => STUTI_JAPA.subscribe(() => force(x => x + 1)), []);
  const today = JAPA_THREADS.reduce((s, m) => s + STUTI_JAPA.state(m.id).today, 0);
  return (
    <button className="japa-entry" onClick={() => go("japa")}>
      <span className="japa-entry-beads"><BeadsGlyph /></span>
      <span className="japa-entry-body">
        <span className="japa-entry-name">{L.t("japaMala", lang)}</span>
        <span className="japa-entry-sub">{L.t("japaSub", lang)}{today > 0 ? " · " + today + " " + L.t("todayLower", lang) : ""}</span>
      </span>
      <Icon name="chev" size={18} />
    </button>
  );
}

/* ---------------- Counted in the hand ----------------
   A reciter of forty years has a rudrākṣa mālā and will not tap a
   phone a hundred thousand times — and mid-japa the phone is impure
   anyway. So: whole rounds, entered once afterwards, for whichever
   day they were actually told. The bead ring stays for everyone else. */
function MalaEntry({ mid, lang, onDone }) {
  const L = STUTI_L, J = STUTI_JAPA, T = STUTI_THREAD;
  const [rounds, setRounds] = useStateJ(1);
  const [when, setWhen] = useStateJ("today");
  const [said, setSaid] = useStateJ(0);
  const todayKey = T.dkey();
  const yKey = T.dkey(new Date(Date.now() - 86400000));
  /* never an empty date: an unset picker silently logging to today is
     precisely the mis-dating this entry exists to avoid */
  const [other, setOther] = useStateJ(todayKey);
  const key = when === "today" ? todayKey : when === "yesterday" ? yKey : other;
  /* ISO keys compare lexicographically — no empty date, and none ahead of today */
  const valid = !!key && key <= todayKey;
  const record = () => {
    if (!valid) return;
    J.addRounds(mid, rounds, key);
    setSaid(rounds);
    setRounds(1);
    setTimeout(() => setSaid(0), 2600);
    if (onDone) onDone();
  };
  return (
    <div className="mala-entry">
      <div className="mala-entry-head">
        <span className="mala-entry-title">{L.t("malaByHand", lang)}</span>
        <span className="mala-entry-sub">{L.t("malaByHandSub", lang)}</span>
      </div>
      <div className="mala-entry-row">
        <div className="mala-step">
          <button onClick={() => setRounds((n) => Math.max(1, n - 1))} aria-label={STUTI_L.a("aFewer")} disabled={rounds <= 1}>−</button>
          <span className="mala-step-n">{rounds}<i>{L.t(rounds === 1 ? "malaRoundL" : "malaRoundsL", lang)}</i></span>
          <button onClick={() => setRounds((n) => Math.min(999, n + 1))} aria-label={STUTI_L.a("aMore")}>+</button>
        </div>
        <button className="mala-record" onClick={record} disabled={!valid}>{L.t("malaAdd", lang)}</button>
      </div>
      <div className="mala-quick">
        {[5, 10, 27].map((n) => (
          <button key={n} className={"chip" + (rounds === n ? " on" : "")} onClick={() => setRounds(n)}>{n}</button>
        ))}
        <span className="mala-quick-eq">= {rounds * 108}</span>
      </div>
      <div className="mala-when">
        {[["today", L.t("today", lang)], ["yesterday", L.t("yesterday", lang)], ["other", L.t("malaOtherDay", lang)]].map(([k, label]) => (
          <button key={k} className={"chip" + (when === k ? " on" : "")} onClick={() => setWhen(k)}>{label}</button>
        ))}
        {when === "other" && <DayPick value={other} max={todayKey} lang={lang} onChange={setOther} label={L.t("malaOtherDay", lang)} bad={other > todayKey} />}
      </div>
      {when === "other" && other > todayKey && <div className="mala-bad">{L.t("malaFuture", lang)}</div>}
      {said > 0 && <div className="mala-said">{said === 1 ? L.t("malaLoggedOne", lang) : L.t("malaLogged", lang).replace("{n}", said)}</div>}
    </div>
  );
}

/* ---------------- A day, picked in the app's own colours ----------------
   The browser's date popup paints itself in system blue over the parchment;
   this one is drawn with the same ink, surface and accent as everything else. */
function DayPick({ value, max, lang, onChange, label, bad }) {
  const [open, setOpen] = useStateJ(false);
  const parse = (k) => { const p = (k || max).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  const key = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const sel = parse(value);
  const [view, setView] = useStateJ(() => new Date(sel.getFullYear(), sel.getMonth(), 1));
  const locale = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined;
  const monthLabel = view.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const shown = sel.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  const dow = [0, 1, 2, 3, 4, 5, 6].map((i) => new Date(2023, 0, 1 + i).toLocaleDateString(locale, { weekday: "narrow" }));
  const first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));
  const maxD = parse(max);
  const nextOk = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= maxD;
  const pick = (d) => { onChange(key(d)); setOpen(false); };
  return (
    <span className="daypick">
      <button type="button" className={"mala-date" + (bad ? " bad" : "")} aria-label={label} aria-expanded={open}
        onClick={() => { setView(new Date(sel.getFullYear(), sel.getMonth(), 1)); setOpen((o) => !o); }}>
        <Icon name="calendar" size={15} />{shown}
      </button>
      {open && <>
        <span className="cal-yearpick-scrim" onClick={() => setOpen(false)} />
        <div className="daypick-pop" role="dialog" aria-label={label}>
          <div className="daypick-head">
            <button type="button" className="icon-btn" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} aria-label={STUTI_L.a("aPrevMonth")}><span style={{ display: "inline-flex", transform: "rotate(90deg)" }}><Icon name="chev" size={16} /></span></button>
            <span className="daypick-month">{monthLabel}</span>
            <button type="button" className="icon-btn" disabled={!nextOk} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} aria-label={STUTI_L.a("aNextMonth")}><span style={{ display: "inline-flex", transform: "rotate(-90deg)" }}><Icon name="chev" size={16} /></span></button>
          </div>
          <div className="daypick-grid">
            {dow.map((w, i) => <span key={"w" + i} className="daypick-dow">{w}</span>)}
            {cells.map((d, i) => d ? (
              <button type="button" key={i} disabled={d > maxD}
                className={"daypick-day" + (key(d) === value ? " on" : "") + (key(d) === max ? " today" : "")}
                onClick={() => pick(d)}>{d.getDate()}</button>
            ) : <span key={i} />)}
          </div>
          <div className="daypick-foot"><button type="button" onClick={() => pick(maxD)}>{STUTI_L.t("today", lang)}</button></div>
        </div>
      </>}
    </span>
  );
}

/* ---------------- What the last four weeks held ---------------- */
function JapaHistory({ mid, lang, vertical = false }) {
  const L = STUTI_L, J = STUTI_JAPA;
  const days = J.history(mid, 28);
  const peak = days.reduce((m, d) => Math.max(m, d.n), 0);
  const locale = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined;
  const label = (k) => { const p = k.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(locale, { day: "numeric", month: "short" }); };
  const week = days.slice(21).reduce((s, d) => s + d.n, 0);
  const weekMalas = Math.floor(week / 108);
  /* upright: the column stands beside the ring, today at the top, each day
     a bar growing leftward from the spine */
  if (vertical) {
    return (
      <div className="japa-hist-v" aria-label={L.t("japaLast28", lang)}>
        <span className="japa-hist-v-n">{weekMalas}<i>7d</i></span>
        <div className="japa-hist-v-bars">
          {days.slice().reverse().map((d) => (
            <span key={d.key} className={"japa-vbar" + (d.today ? " today" : "") + (d.n ? " on" : "")} title={label(d.key) + " · " + d.n}>
              <i style={{ width: peak ? Math.max(d.n ? 22 : 8, Math.round((d.n / peak) * 100)) + "%" : "8%" }} />
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (!peak) return <div className="japa-hist-empty">{L.t("japaNoneYet", lang)}</div>;
  return (
    <div className="japa-hist">
      <div className="japa-hist-head">
        <span className="eyebrow">{L.t("japaLast28", lang)}</span>
        <span className="japa-hist-week">{weekMalas} {L.t(weekMalas === 1 ? "malaRoundL" : "malaRoundsL", lang)}<i>· 7d</i></span>
      </div>
      <div className="japa-hist-bars">
        {days.map((d) => (
          <span key={d.key} className={"japa-bar" + (d.today ? " today" : "")}
            title={label(d.key) + " · " + d.n}>
            <i style={{ height: Math.max(d.n ? 8 : 2, Math.round((d.n / peak) * 100)) + "%" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- The mālā ---------------- */
function JapaView({ go, lang = "deva", embedded = false }) {
  const S = STUTI, L = STUTI_L;
  const [mid, setMid] = useStateJ(() => {
    const last = STUTI_JAPA.lastId();
    return JAPA_THREADS.some(m => m.id === last) ? last : "shiva";
  });
  const m = JAPA_THREADS.find(x => x.id === mid) || JAPA_THREADS[1];
  const d = S.deityById[m.deity];
  const [st, setSt] = useStateJ(() => STUTI_JAPA.state(m.id));
  const [flash, setFlash] = useStateJ(false);
  const flashT = useRefJ(null);
  useEffectJ(() => { setSt(STUTI_JAPA.state(m.id)); STUTI_JAPA.setLast(m.id); }, [m.id]);
  useEffectJ(() => () => clearTimeout(flashT.current), []);
  const pos = st.today === 0 ? 0 : ((st.today - 1) % 108) + 1;
  const count = () => {
    const tn = STUTI_JAPA.bump(m.id);
    setSt(STUTI_JAPA.state(m.id));
    const done = tn % 108 === 0;
    if (navigator.vibrate) { try { navigator.vibrate(done ? [45, 70, 45] : 12); } catch (e) {} }
    if (done) { setFlash(true); clearTimeout(flashT.current); flashT.current = setTimeout(() => setFlash(false), 1900); }
  };
  const undo = () => { STUTI_JAPA.undo(m.id); setSt(STUTI_JAPA.state(m.id)); };
  const dots = [];
  for (let i = 0; i < 108; i++) {
    const a = (-90 + i * (360 / 108)) * Math.PI / 180;
    dots.push(<circle key={i} className={"japa-dot" + (i < pos ? " on" : "")} cx={160 + 138 * Math.cos(a)} cy={160 + 138 * Math.sin(a)} r={i % 27 === 0 ? 4.6 : 3.3} />);
  }
  const [byHand, setByHand] = useStateJ(false);
  const font = L.font(lang);
  const ring = (
    <button className="japa-ring" onPointerDown={(e) => { if (e.pointerType) count(); }} onClick={(e) => { if (e.detail === 0) count(); }} aria-label={L.t("tapToCount", lang)}>
      <svg viewBox="0 0 320 320">{dots}</svg>
      <span className="japa-center">
        <span className="japa-count display">{pos}</span>
        <span className="japa-of">/ 108</span>
      </span>
      {flash && <span className="japa-toast">॥ {L.t("malaDone", lang)} ॥</span>}
    </button>
  );
  const malas = Math.floor(st.today / 108);
  const monthDays = (() => { try { const n = new Date(); return STUTI_LEDGER.month(n.getFullYear(), n.getMonth()).japa.days; } catch (e) { return 0; } })();
  const card = (k, n, label) => <div key={k} className={"japa-stat japa-corner " + k}><b className="display">{n}</b><span>{label}</span></div>;
  const corners = [
    card("tl", st.today, L.t("todayCount", lang)),
    card("tr", malas, L.t(malas === 1 ? "mala" : "malas", lang)),
    card("bl", monthDays, L.t("lgDays", lang)),
    card("br", st.total, L.t("lifetime", lang)),
  ];
  const stats = null;
  if (embedded) return (
    <div className="japa japa-embed" style={{ "--deity-hue": d.hue }}>
      <div className="japa-embed-row">
        <div className="japa-embed-main">
          <div className="japa-field">
            <div className="japa-hint">{L.t("tapToCount", lang)}</div>
            <div className="japa-field-ring">{corners}{ring}</div>
            <div className="japa-actions">
              <button className="chip" onClick={undo} disabled={st.today === 0}><Icon name="back" size={15} /> {L.t("undoBead", lang)}</button>
            </div>
          </div>
        </div>
      </div>
      <MalaEntry mid={m.id} lang={lang} onDone={() => setSt(STUTI_JAPA.state(m.id))} />
    </div>
  );
  return (
    <div className="view japa scroll" style={{ "--deity-hue": d.hue }}>
      <div className="topbar">
        <button className="icon-btn" onClick={() => go("daily")} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display">{L.t("japaMala", lang)}</div>
        <span style={{ width: 40 }} />
      </div>
      <div className="japa-field">
        <div className="japa-hint">{L.t("tapToCount", lang)}</div>
        <div className="japa-field-ring">{corners}{ring}</div>
        <div className="japa-actions">
        <button className="chip" onClick={undo} disabled={st.today === 0}><Icon name="back" size={15} /> {L.t("undoBead", lang)}</button>
      </div>
      </div>
      <MalaEntry mid={m.id} lang={lang} onDone={() => setSt(STUTI_JAPA.state(m.id))} />
      <JapaHistory mid={m.id} lang={lang} />
      <div style={{ height: 90 }} />
    </div>
  );
}

export { ThreadCard, ThreadStrip, JapaEntryCard, JapaView, MalaEntry, JapaHistory, JAPA_THREADS };

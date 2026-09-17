import React from "react";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { MoonPhase, useLoc } from "./stuti-panchanga";

/* ============================================================
   STUTI — the house date field
   A date in this app is a tithi. The browser's own date box cannot show
   one, and it paints itself in system blue no matter what the app wears.
   This field opens the house month — the same cal-grid, the same moon
   marks, the same gold — and names the tithi of the day under it.
   ============================================================ */
const { useState: useDpS, useMemo: useDpM } = React;

const DP_T = {
  today:  { roman: "Today", deva: "आज", telugu: "ఈ రోజు" },
  clear:  { roman: "Clear", deva: "हटाएँ", telugu: "తీసివేయి" },
  choose: { roman: "Choose a day", deva: "दिन चुनें", telugu: "రోజు ఎంచుకోండి" },
};
const dpT = (k, lang) => (DP_T[k] && (DP_T[k][lang] || DP_T[k].roman)) || "";
const dpFont = (s) => s === "telugu" ? "var(--font-telugu)" : s === "roman" ? "var(--font-display)" : "var(--font-deva)";
const dpWD = {
  roman: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  deva: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  telugu: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
};
const dpKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const dpSame = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* value / onChange speak "YYYY-MM-DD" (or "" for none), so this drops in
   wherever a native date box stood. */
function HouseDate({ value, onChange, lang, min, max, ariaLabel }) {
  const L = STUTI_L;
  const P = AKSHARA_PANCHANGA;
  const loc = (useLoc ? useLoc().loc : null);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const sel = value ? (() => { const p = value.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); })() : null;
  const [open, setOpen] = useDpS(false);
  const [cursor, setCursor] = useDpS(() => { const d = sel || today; return { y: d.getFullYear(), m: d.getMonth() }; });
  const [yearOpen, setYearOpen] = useDpS(false);
  const locale = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined;

  const nDays = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const startDow = new Date(cursor.y, cursor.m, 1).getDay();
  const days = useDpM(() => {
    const arr = [];
    for (let d = 1; d <= nDays; d++) {
      const date = new Date(cursor.y, cursor.m, d);
      let phase = null, isFull = false, isNew = false;
      try { const pa = P.forDay(date, loc); phase = pa.phase; isFull = pa.tithiIndex === 14; isNew = pa.tithiIndex === 29; } catch (e) {}
      const k = dpKey(date);
      const out = (min && k < min) || (max && k > max);
      arr.push({ d, date, phase, isFull, isNew, out });
    }
    return arr;
  }, [cursor.y, cursor.m, loc, min, max]);

  const tithiLine = useDpM(() => {
    if (!sel) return "";
    try {
      const p = P.forDay(sel, loc);
      const pk = lang === "telugu" ? p.pakshaTel : lang === "deva" ? p.pakshaDeva : p.paksha;
      const ti = lang === "telugu" ? p.tithiTel : lang === "deva" ? p.tithiDeva : p.tithiName;
      return [pk, ti].filter(Boolean).join(" ");
    } catch (e) { return ""; }
  }, [value, loc, lang]);

  const faceLabel = sel
    ? sel.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
    : dpT("choose", lang);
  const step = (n) => setCursor((c) => { const d = new Date(c.y, c.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const choose = (date) => { onChange(dpKey(date)); setOpen(false); };

  return (
    <div className={"hd" + (open ? " open" : "")}>
      <button type="button" className={"hd-face" + (sel ? "" : " is-empty")} aria-label={ariaLabel || faceLabel}
        aria-expanded={open} onClick={() => { if (!open && sel) setCursor({ y: sel.getFullYear(), m: sel.getMonth() }); setOpen((o) => !o); }}>
        <span className="hd-face-date">{faceLabel}</span>
        {tithiLine && <span className="hd-face-tithi" style={{ fontFamily: dpFont(lang) }}>{tithiLine}</span>}
      </button>
      {open && (
        <React.Fragment>
          <div className="hd-scrim" onClick={() => { setOpen(false); setYearOpen(false); }} />
          <div className="hd-pop">
            <div className="cal-nav hd-nav">
              <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label={L.a("aPrevMonth")}><Icon name="prev" size={18} /></button>
              <div className="hd-yearpick">
                <button type="button" className="cal-nav-title display hd-title" onClick={() => setYearOpen((o) => !o)} aria-expanded={yearOpen}>
                  {new Date(cursor.y, cursor.m, 1).toLocaleDateString(locale, { month: "long", year: "numeric" })} <Icon name="chev" size={14} />
                </button>
                {yearOpen && (
                  <div className="hd-years" ref={(el) => {
                    /* the list holds a hundred and twenty years; it opens on
                       the year in hand, not on 1916 */
                    if (!el) return;
                    const on = el.querySelector(".hd-year.on");
                    if (on) el.scrollTop = on.offsetTop - el.clientHeight / 2 + on.offsetHeight / 2;
                  }}>
                    {Array.from({ length: 121 }).map((_, i) => {
                      const y = today.getFullYear() - 110 + i;
                      return (
                        <button type="button" key={y} className={"hd-year" + (y === cursor.y ? " on" : "")}
                          onClick={() => { setCursor((c) => ({ y, m: c.m })); setYearOpen(false); }}>{y}</button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button type="button" className="icon-btn" onClick={() => step(1)} aria-label={L.a("aNextMonth")}><Icon name="next" size={18} /></button>
            </div>
            <div className="cal-grid cal-wd-row">
              {dpWD[lang === "telugu" ? "telugu" : lang === "deva" ? "deva" : "roman"].map((w, i) => (
                <div key={i} className="cal-wd" style={{ fontFamily: dpFont(lang) }}>{w}</div>
              ))}
            </div>
            <div className="cal-grid">
              {Array.from({ length: startDow }).map((_, i) => <div key={"b" + i} className="cal-cell cal-cell-empty" />)}
              {days.map(({ d, date, phase, isFull, isNew, out }) => (
                <button type="button" key={d} disabled={out}
                  className={"cal-cell" + (dpSame(date, sel) ? " sel" : "") + (dpSame(date, today) ? " today" : "") + (out ? " is-out" : "")}
                  onClick={() => choose(date)}>
                  <span className="cal-daynum">{d}</span>
                  <span className="cal-marks">{(isFull || isNew) && <MoonPhase phase={phase} size={12} />}</span>
                </button>
              ))}
            </div>
            <div className="hd-foot">
              <button type="button" className="hd-foot-btn" onClick={() => choose(new Date())}>{dpT("today", lang)}</button>
              <button type="button" className="hd-foot-btn" onClick={() => { onChange(""); setOpen(false); }}>{dpT("clear", lang)}</button>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
export { HouseDate };

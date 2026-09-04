/* ============================================================
   STUTI — the sandhyā card
   Three lines, not three taps. A regular practitioner glances at this
   to plan the day: when each juncture opens, which one is running,
   and how long is left of it. The heading answers the only urgent
   question — what is next, and in how long.
   ============================================================ */
const { useState: useSyS, useEffect: useSyE } = React;

/* a juncture is a limb of the day and is named in the same face as the rest:
   Tiro for the Indic scripts, the display serif for roman */
function kalaFont(lang) {
  return lang === "deva" ? "var(--font-deva-serif)"
    : lang === "telugu" ? "var(--font-telugu)" : "var(--font-display)";
}
function syFont(s) {
  return s === "telugu" ? "var(--font-telugu)" : s === "roman" ? "var(--font-display)" : "var(--font-deva)";
}
/* A span of minutes as a human duration, in the reading script's numerals.
   An exact hour drops the minutes rather than printing “7 hours 0 minutes”. */
function syDur(mins, lang, L) {
  const m = Math.max(0, Math.round(mins));
  const h = Math.floor(m / 60), r = m % 60;
  if (!h) return L.t("durM", lang).replace("{m}", r);
  if (!r) return L.t("durH", lang).replace("{h}", h);
  return L.t("durHM", lang).replace("{h}", h).replace("{m}", r);
}

function SandhyaCard({ lang = "deva", planOnly }) {
  const L = window.STUTI_L, S = window.STUTI_SANDHYA, P = window.AKSHARA_PANCHANGA;
  const { loc } = window.useLoc();
  const [, tick] = useSyS(0);
  /* the countdown is the point of the card, so it has to move */
  useSyE(() => { const t = setInterval(() => tick((n) => n + 1), 30000); return () => clearInterval(t); }, []);
  if (!S || !P) return null;

  const now = new Date();
  const st = S.state(now, loc, null, null);
  if (!st.list.length) return null;
  const nm = (o) => S.name(o, lang);
  const span = (b) => P.fmtTime(((b.start % 1440) + 1440) % 1440) + " – " + P.fmtTime(((b.end % 1440) + 1440) % 1440);
  /* past the last juncture of the day, the next one is tomorrow's first */
  const ahead = st.next ? { kala: st.next, at: st.minsTo } : (() => {
    const u = S.upcoming(loc, null, 0, now)[0];
    return u ? { kala: u.kala, at: Math.round((u.at - now) / 60000) } : null;
  })();

  return (
    <section className="sy-card">
      <div className="sy-head">
        <span className="eyebrow">{L.t("sandhya", lang)}</span>
        <span className="sy-place">{loc.city}</span>
      </div>
      {!planOnly && <React.Fragment>
      <div className={"sy-lede" + (st.current ? " on" : "")}>
        {st.current ? (
          <React.Fragment>
            <b style={{ fontFamily: syFont(lang) }}>{nm(st.current.label)}</b>
            <span className={"sy-grade sy-" + st.band.grade} style={{ fontFamily: syFont(lang) }}>{nm(st.band.label)}</span>
            <span className="sy-left">{L.t("sandhyaLeft", lang).replace("{t}", syDur(st.minsLeft, lang, L))}</span>
          </React.Fragment>
        ) : ahead ? (
          <React.Fragment>
            <b style={{ fontFamily: syFont(lang) }}>{nm(ahead.kala.label)}</b>
            <span className="sy-left">{L.t("sandhyaIn", lang).replace("{t}", syDur(ahead.at, lang, L))}</span>
          </React.Fragment>
        ) : null}
      </div>
      {st.rite && <div className="sy-rite" style={{ fontFamily: syFont(lang) }}>
        {st.rite === "arghya"
          ? L.t("riteArghya", lang).replace("{t}", P.fmtTime(((st.hinge % 1440) + 1440) % 1440))
          : L.t("riteLatePray", lang)}
      </div>}
      {st.prayaschitta && !st.rite && <div className="sy-warn">{L.t("prayaschitta", lang)}</div>}
      </React.Fragment>}
      <div className="sy-rows">
        {st.list.map((k) => (
          <div className={"sy-row" + (st.current && st.current.id === k.id ? " now" : "")} key={k.id}>
            {/* the manuscript serif, the same face Rāhu kāla and the other limbs
               are set in — chosen here because an inline family cannot be
               overridden from the stylesheet */}
            <span className="sy-row-k" style={{ fontFamily: kalaFont(lang) }}>{nm(k.label)}</span>
            <span className="sy-row-v">
              {span(k.best)}
              <small>{L.t("sandhyaGrace", lang).replace("{t}", P.fmtTime(((k.end % 1440) + 1440) % 1440))}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { SandhyaCard, syDur, syFont });

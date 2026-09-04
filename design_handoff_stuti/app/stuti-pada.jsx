/* ============================================================
   STUTI — the padārtha sheet
   Tap a word in the reader: what it means, what it is made of,
   and where else it stands in the corpus. Walk the line word by
   word with the two arrows without leaving the sheet.
   ============================================================ */
const { useState: useStateP, useEffect: useEffectP } = React;

function padaInScript(iast, lang, deva) {
  const d = deva || window.STUTI_PADA.toDeva(iast);
  if (lang === "telugu") return window.STUTI_TRANSLIT.convert(d, "telugu");
  if (lang === "deva") return d;
  return iast;
}
function padaScriptFont(lang) {
  return lang === "telugu" ? "var(--font-telugu)" : lang === "deva" ? "var(--font-deva)" : "var(--font-display)";
}

function PadaSheet({ pada, hymn, lang, onClose, onStep, onJump }) {
  const L = window.STUTI_L, P = window.STUTI_PADA;
  const [showAll, setShowAll] = useStateP(false);
  const res = P.lookup(pada.iast);
  const all = res && res.found ? P.occurrences(res.stem, { hymnId: hymn.id, surface: res.surface }) : [];
  const occ = all.filter((o) => o.lineIdx !== pada.lineIdx || o.hymnId !== hymn.id);
  occ.capped = all.capped;
  const shown = showAll ? occ.slice(0, 24) : occ.slice(0, 5);
  const font = padaScriptFont(lang);
  const te = lang === "telugu";
  const gloss = (x) => (te && x.te ? x.te : x.en) || "—";
  const glossFont = (x) => (te && x.te ? { fontFamily: "var(--font-telugu)" } : null);

  useEffectP(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose, onStep]);

  const whole = res && res.whole;
  const parts = res && res.parts;

  return (
    <div className="pd-wrap">
      <div className="pd-scrim" onClick={onClose} />
      <div className="pd-sheet" role="dialog" aria-label={L.t("padartha", lang)}>
        <div className="pd-grip" />
        <button className="pd-x" onClick={onClose} aria-label={window.STUTI_L.t("close", lang)}><window.Icon name="close" size={18} /></button>
        <div className="pd-head">
          <button className="pd-nav" onClick={() => onStep(-1)} disabled={pada.wordIdx <= 0} aria-label={window.STUTI_L.a("aPrevWord")}>
            <Icon name="prev" size={20} />
          </button>
          <div className="pd-word">
            <div className="pd-word-main" style={{ fontFamily: font }}>{pada.display}</div>
            {lang !== "roman" && <div className="pd-word-iast">{pada.iast}</div>}
          </div>
          <button className="pd-nav" onClick={() => onStep(1)} disabled={pada.wordIdx >= pada.count - 1} aria-label={window.STUTI_L.a("aNextWord")}>
            <Icon name="next" size={20} />
          </button>
        </div>

        <div className="pd-body scroll">
          {whole && (
            <div className="pd-gloss">
              <div className="pd-gloss-text" style={glossFont(whole)}>{gloss(whole)}</div>
              <div className="pd-gloss-tags">
                {whole.match === "name" && whole.n && <span className="pd-tag">{L.t("namaNo", lang)} {whole.n}</span>}
                {whole.match === "inflected" && whole.stem && <span className="pd-tag pd-tag-quiet">{L.t("fromStem", lang)} {whole.stem}</span>}
              </div>
            </div>
          )}

          {parts && (
            <div className="pd-split">
              <div className="pd-cap">{L.t("padaSplit", lang)}</div>
              <div className="pd-join">
                {parts.map((p, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="pd-plus">+</span>}
                    <span className="pd-piece" style={{ fontFamily: font }}>{padaInScript(p.part, lang, p.deva)}</span>
                  </React.Fragment>
                ))}
              </div>
              <div className="pd-parts">
                {parts.map((p, i) => (
                  <div className={"pd-part" + (p.unknown ? " unknown" : "")} key={i}>
                    <div className="pd-part-word" style={{ fontFamily: font }}>{padaInScript(p.part, lang, p.deva)}</div>
                    <div className="pd-part-body">
                      {lang !== "roman" && <div className="pd-part-iast">{p.part}</div>}
                      <div className="pd-part-gloss" style={glossFont(p)}>{gloss(p)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!whole && !parts && (
            <div className="pd-none">
              <Icon name="lotus" size={22} />
              <div className="pd-none-text">{L.t("notGlossed", lang)}</div>
            </div>
          )}

          {occ.length > 0 && (
            <div className="pd-occ">
              <div className="pd-cap">{L.t("alsoIn", lang)} · {occ.length}{occ.capped ? "+" : ""}</div>
              {shown.map((o, i) => (
                <button className={"pd-occ-row" + (o.here ? " here" : "")} key={i} onClick={() => onJump(o)}>
                  <div className="pd-occ-line" style={{ fontFamily: "var(--font-display)" }}>{o.line}</div>
                  <div className="pd-occ-meta">
                    <span style={o.here ? null : { fontFamily: padaScriptFont(lang) }}>
                      {o.here ? L.t("thisHymn", lang) : (te ? (o.tel || o.title) : lang === "deva" ? (o.deva || o.title) : o.title)}
                    </span>
                    <span className="dot" />
                    <span>{L.t("verse", lang)} {o.n || o.verse + 1}</span>
                  </div>
                </button>
              ))}
              {!showAll && occ.length > 5 && (
                <button className="pd-more" onClick={() => setShowAll(true)}>{L.t("seeAll", lang)}</button>
              )}
            </div>
          )}
        </div>

        <button className="pd-close" onClick={onClose}>{L.t("close", lang)}</button>
      </div>
    </div>
  );
}

Object.assign(window, { PadaSheet, padaInScript });

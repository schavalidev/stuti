/* ============================================================
   AKSHARA — Text detail / overview (synopsis + chapter contents)
   ============================================================ */
function ChapterRow({ t, c, go, last }) {
  return (
    <button onClick={() => go("reader", { textId: t.id, chapterNo: c.n })}
      className="chap-row"
      style={{ display: "flex", alignItems: "center", gap: 22, width: "100%", textAlign: "left",
        background: "none", border: 0, borderBottom: last ? "none" : "1px solid var(--line-soft)",
        padding: "20px 14px", transition: "background .16s ease" }}>
      <span style={{ flex: "none", width: 50, fontFamily: "var(--font-deva)", fontSize: 22, color: "var(--maroon)",
        textAlign: "center", lineHeight: 1 }}>{window.AKSHARA_DATA.toDeva(c.n)}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.25 }}>{c.title}</span>
        <Sa as="span" style={{ fontSize: 16, color: "var(--ink-faint)", marginLeft: 12, lineHeight: 1.25 }}>{c.deva}</Sa>
        {c.gloss && <span style={{ display: "block", fontStyle: "normal", fontSize: 14, color: "var(--ink-soft)", marginTop: 5 }}>{c.gloss}</span>}
      </span>
      <span style={{ flex: "none", fontSize: 13, color: "var(--ink-faint)", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>{c.verses.toLocaleString()} verses</span>
      <span className="chap-arrow" style={{ flex: "none", color: "var(--ink-faint)", display: "flex" }}><Icon name="chevron" size={18} /></span>
    </button>
  );
}

function TextDetail({ go, bookmarks, toggleMark, textId }) {
  const D = window.AKSHARA_DATA;
  const t = D.texts.find(x => x.id === textId) || D.texts[0];
  const coll = D.collections.find(c => c.id === t.coll);
  const toc = D.tocFor(t);
  const unit = D.UNIT[t.coll] || { en: "Chapter", pl: "chapters" };
  const marked = bookmarks.has(t.id);

  const meta = [
    [t.tradition, "tradition"],
    [t.era, "dated"],
    [`${t.chapters} ${unit.pl}`, "in"],
    [`${t.verses.toLocaleString()} verses`, "across"],
  ];

  return (
    <div className="rise">
      {/* ---- Hero ---- */}
      <section style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-6%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.1, pointerEvents: "none" }}>
          <Mandala size={560} spin />
        </div>
        <div className="wrap" style={{ padding: "34px 40px 60px", position: "relative" }}>
          <button onClick={() => go("library")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--on-night-soft)", fontSize: 14, marginBottom: 34 }}>
            <Icon name="arrowL" size={16} /> Library
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 56, alignItems: "center" }} className="detail-hero-grid">
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>{coll ? `${coll.name} · ${coll.sub}` : t.tradition}</span>
              <Sa as="p" style={{ fontSize: "clamp(2rem,4vw,3.1rem)", color: "var(--gold-bright)", margin: "20px 0 6px", lineHeight: 1.3 }}>{t.deva}</Sa>
              <h1 style={{ fontSize: "clamp(2.6rem,5.2vw,4.2rem)", lineHeight: 1.02, color: "var(--on-night)" }}>{t.title}</h1>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 0, margin: "30px 0 0" }}>
                {meta.map(([v, l], i) => (
                  <div key={l} style={{ display: "flex", alignItems: "center" }}>
                    {i > 0 && <span style={{ width: 1, height: 30, background: "rgba(240,228,204,0.18)", margin: "0 22px" }} />}
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--on-night-soft)" }}>{l}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, color: "var(--on-night)", marginTop: 3, whiteSpace: "nowrap" }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ maxWidth: 560, color: "var(--on-night-soft)", fontSize: 17, lineHeight: 1.7, marginTop: 30 }}>{t.blurb}</p>

              <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
                <button className="btn" style={{ background: "var(--gold-bright)", color: "var(--night)" }}
                  onClick={() => go("reader", { textId: t.id, chapterNo: toc[0].n })}>
                  <Icon name="book" size={17} /> Begin reading
                </button>
                <button onClick={() => toggleMark(t.id)} className="btn"
                  style={{ background: marked ? "var(--maroon)" : "transparent", color: marked ? "var(--on-night)" : "var(--on-night)", border: "1px solid " + (marked ? "var(--maroon)" : "rgba(240,228,204,0.3)") }}>
                  <Icon name={marked ? "bookmarkFill" : "bookmark"} size={17} /> {marked ? "Saved" : "Save to library"}
                </button>
                {t.audio && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--gold-bright)", fontSize: 14, alignSelf: "center" }}>
                    <Icon name="speaker" size={17} /> Recitation available
                  </span>
                )}
              </div>
            </div>

            {/* Book plate */}
            <div style={{ position: "relative" }} className="detail-plate-col">
              <div style={{ aspectRatio: "3 / 4", borderRadius: 6, background: "linear-gradient(160deg, var(--paper-2), var(--paper-3))",
                border: "1px solid var(--gold)", boxShadow: "var(--shadow-lift)", position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center" }}>
                <div style={{ position: "absolute", inset: 0, color: "var(--gold)", opacity: 0.16, display: "grid", placeItems: "center" }}><Mandala size={260} /></div>
                <div style={{ position: "relative" }}>
                  <Sa as="p" style={{ fontSize: 40, color: "var(--maroon)", lineHeight: 1.3, margin: 0 }}>{t.deva}</Sa>
                  <div style={{ width: 40, height: 1, background: "var(--gold)", margin: "18px auto" }} />
                  <p style={{ fontFamily: "var(--font-display)", fontStyle: "normal", fontSize: 16, color: "var(--ink-soft)", margin: 0 }}>{coll ? coll.sub : t.tradition}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Contents ---- */}
      <section className="wrap" style={{ padding: "56px 40px 30px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
          <div>
            <span className="eyebrow">Read line by line</span>
            <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", marginTop: 12 }}>Contents</h2>
          </div>
          <span style={{ fontSize: 14, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>{toc.length} {toc.length === 1 ? unit.en.toLowerCase() : unit.pl}</span>
        </div>
        <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {toc.map((c, i) => <ChapterRow key={c.n} t={t} c={c} go={go} last={i === toc.length - 1} />)}
        </div>
        <p style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-faint)", fontStyle: "normal", fontSize: 14, marginTop: 22 }}>
          <Icon name="quote" size={15} /> Each {unit.en.toLowerCase()} opens into Devanagari, transliteration and translation, with recitation where available.
        </p>
      </section>
    </div>
  );
}

Object.assign(window, { TextDetail, ChapterRow, TextPreview });

/* ---------- Text preview popup (drawer) — keeps you on the grid ----------
   Reuses the calendar drawer shell: dark header + scrollable body + pinned
   actions. Opens from any text card so browsing never swaps the whole page. */
function TextPreview({ textId, go, bookmarks, toggleMark, onClose }) {
  const D = window.AKSHARA_DATA;
  const t = D.texts.find(x => x.id === textId);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!t) return null;
  const coll = D.collections.find(c => c.id === t.coll);
  const toc = D.tocFor(t);
  const unit = D.UNIT[t.coll] || { en: "Chapter", pl: "chapters" };
  const marked = bookmarks.has(t.id);
  const meta = [t.era, `${t.chapters} ${unit.pl}`, `${t.verses.toLocaleString()} verses`];

  return (
    <div className="drawer-back" onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(28,20,12,0.5)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "flex-end" }}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}
        style={{ width: 500, maxWidth: "94vw", height: "100%", background: "var(--paper)", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(28,20,12,0.3)" }}>
        {/* header */}
        <div style={{ background: "var(--night)", color: "var(--on-night)", padding: "26px 30px 26px", position: "relative", flex: "none" }}>
          <button onClick={onClose} aria-label="Close"
            style={{ position: "absolute", top: 20, right: 22, background: "rgba(240,228,204,0.1)", border: "1px solid rgba(240,228,204,0.22)", color: "var(--on-night)", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center" }}>
            <Icon name="close" size={17} />
          </button>
          <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>{coll ? `${coll.name} · ${coll.sub}` : t.tradition}</span>
          <Sa as="p" style={{ fontSize: 26, color: "var(--gold-bright)", margin: "16px 0 4px", lineHeight: 1.3 }}>{t.deva}</Sa>
          <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.3rem)", lineHeight: 1.05, color: "var(--on-night)", fontWeight: 600 }}>{t.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 16, color: "var(--on-night-soft)", fontSize: 13.5 }}>
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--on-night-soft)", opacity: 0.6 }} />}
                <span>{m}</span>
              </React.Fragment>
            ))}
            {t.audio && <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--gold-bright)", marginLeft: 4 }}><Icon name="speaker" size={15} /> recitation</span>}
          </div>
        </div>

        {/* scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 30px 18px" }}>
          <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.7, margin: "0 0 22px" }}>{t.blurb}</p>
          <div className="ornament" style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>Contents · {toc.length} {toc.length === 1 ? unit.en.toLowerCase() : unit.pl}</span>
          </div>
          <div>
            {toc.map((c, i) => <ChapterRow key={c.n} t={t} c={c} go={go} last={i === toc.length - 1} />)}
          </div>
        </div>

        {/* pinned actions */}
        <div style={{ flex: "none", display: "flex", gap: 12, padding: "16px 30px calc(18px + env(safe-area-inset-bottom))", borderTop: "1px solid var(--line)", background: "var(--paper)" }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}
            onClick={() => go("reader", { textId: t.id, chapterNo: toc[0].n })}>
            <Icon name="book" size={17} /> Begin reading
          </button>
          <button onClick={() => toggleMark(t.id)} className="btn btn-ghost" aria-label={marked ? "Saved" : "Save"}
            style={{ flex: "none", background: marked ? "var(--maroon)" : "transparent", color: marked ? "var(--on-night)" : "var(--ink)", borderColor: marked ? "var(--maroon)" : "var(--line)" }}>
            <Icon name={marked ? "bookmarkFill" : "bookmark"} size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

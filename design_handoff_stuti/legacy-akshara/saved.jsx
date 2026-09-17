/* ============================================================
   AKSHARA — My Library (continue reading + saved texts)
   ============================================================ */
function readProgress() {
  try { return JSON.parse(localStorage.getItem("akshara_progress") || "null"); } catch { return null; }
}

function MyLibrary({ go, bookmarks, toggleMark, openText }) {
  const D = window.AKSHARA_DATA;
  const prog = readProgress();
  const progText = prog ? D.texts.find(t => t.id === prog.textId) : null;
  const progToc = progText ? D.tocFor(progText) : [];
  const progChap = progText ? (progToc.find(c => c.n === prog.chapterNo) || progToc[0]) : null;
  const progUnit = progText ? (D.UNIT[progText.coll] || { en: "Chapter" }) : null;

  const saved = D.texts.filter(t => bookmarks.has(t.id));

  return (
    <div className="rise">
      {/* Continue reading band */}
      <section style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-6%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.1, pointerEvents: "none" }}>
          <Mandala size={520} spin />
        </div>
        <div className="wrap" style={{ padding: "60px 40px", position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>My library</span>
          <h1 style={{ fontSize: "clamp(2.4rem,4.4vw,3.6rem)", color: "var(--on-night)", marginTop: 14 }}>Your shelf, your place in the text</h1>

          {progText && progChap ? (
            <div onClick={() => go("reader", { textId: progText.id, chapterNo: progChap.n })}
              style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 34, background: "rgba(240,228,204,0.06)",
                border: "1px solid rgba(240,228,204,0.2)", borderRadius: 8, padding: "22px 26px", cursor: "pointer", maxWidth: 760 }}>
              <div style={{ width: 64, height: 64, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
                background: "var(--gold-bright)", color: "var(--night)" }}>
                <Icon name="play" size={26} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-bright)" }}>Continue reading</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--on-night)", marginTop: 4 }}>{progText.title}</div>
                <div style={{ fontSize: 15, color: "var(--on-night-soft)", marginTop: 2 }}>{progUnit.en} {progChap.n}{progChap.title && progChap.title !== `${progUnit.en} ${progChap.n}` ? ` · ${progChap.title}` : ""}</div>
              </div>
              <Icon name="arrowR" size={22} />
            </div>
          ) : (
            <p style={{ color: "var(--on-night-soft)", fontSize: 17, lineHeight: 1.7, marginTop: 20, maxWidth: 560 }}>
              Nothing in progress yet. Open any text and your place will be kept here for your next visit.
            </p>
          )}
        </div>
      </section>

      {/* Saved texts */}
      <section className="wrap" style={{ padding: "56px 40px 30px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
          <div>
            <span className="eyebrow">Kept for return</span>
            <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", marginTop: 12 }}>Saved texts</h2>
          </div>
          <span style={{ fontSize: 14, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>{saved.length} {saved.length === 1 ? "text" : "texts"}</span>
        </div>

        {saved.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "var(--ink-faint)", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, color: "var(--gold)", opacity: 0.55 }}><Lotus size={40} color="var(--gold)" /></div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--ink-soft)" }}>No texts saved yet</p>
            <p style={{ fontSize: 15, maxWidth: 380, margin: "6px auto 24px" }}>Tap the bookmark on any text to keep it on your shelf.</p>
            <button className="btn btn-primary" onClick={() => go("library")}>Browse the canon <Icon name="arrowR" size={16} /></button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
            {saved.map(t => <TextCard key={t.id} t={t} go={go} marked={true} toggleMark={toggleMark} onOpen={openText} />)}
          </div>
        )}
      </section>
    </div>
  );
}

Object.assign(window, { MyLibrary });

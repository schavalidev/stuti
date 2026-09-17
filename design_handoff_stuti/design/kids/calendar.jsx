/* ============================================================
   KATHĀ — Festival calendar (why we celebrate)
   ============================================================ */
function KFestivals({ go }) {
  const D = window.KATHA_DATA;
  const fests = D.festivals;
  const next = fests[0];

  return (
    <div className="pop">
      {/* Hero / next up */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {window.Sparkles && <Sparkles />}
        <div className="wrap" style={{ padding: "48px 36px 8px", position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--marigold)" }}>The festival calendar</span>
          <h1 style={{ fontSize: "clamp(2.2rem,4.4vw,3.2rem)", margin: "10px 0 0", lineHeight: 1.04 }}>
            Why we <span style={{ color: "var(--marigold)" }}>celebrate</span>
          </h1>
          <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 17, maxWidth: 540, marginTop: 12 }}>
            Every festival has a story behind it. Here's what each one means — and the tale that goes with it.
          </p>

          {/* Coming up next */}
          <div style={{ marginTop: 26, background: next.color, color: "#fff", borderRadius: "var(--r-lg)", padding: "26px 28px", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", boxShadow: "var(--shadow-md)" }}>
            <div style={{ fontSize: 60, lineHeight: 1 }}>{next.emoji}</div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>Coming up · {next.when}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, lineHeight: 1.05, marginTop: 4 }}>{next.name}</div>
              <p style={{ fontWeight: 600, fontSize: 15.5, lineHeight: 1.5, marginTop: 8, opacity: 0.96, maxWidth: 460 }}>{next.why}</p>
            </div>
            {next.story && (
              <button className="btn" style={{ background: "#fff", color: next.color }} onClick={() => go("detail", { id: next.story })}>
                <KIcon name="book" size={17} /> Read the story
              </button>
            )}
          </div>
        </div>
      </section>

      {/* All festivals */}
      <section className="wrap" style={{ padding: "34px 36px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 18 }}>
          {fests.map(f => (
            <div key={f.id} className="fest-card"
              onClick={() => f.story ? go("detail", { id: f.story }) : null}
              style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden",
                cursor: f.story ? "pointer" : "default", transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease" }}>
              <div style={{ height: 130, background: `color-mix(in srgb, ${f.color} 18%, #fff)`, position: "relative", display: "grid", placeItems: "center" }}>
                <span style={{ fontSize: 60, lineHeight: 1 }}>{f.emoji}</span>
                <span style={{ position: "absolute", top: 12, left: 12, background: "#fff", color: f.color, fontWeight: 800, fontSize: 12.5, padding: "5px 12px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}>{f.when}</span>
                <span style={{ position: "absolute", top: 12, right: 12, color: f.color }}><KIcon name={f.icon} size={20} /></span>
              </div>
              <div style={{ padding: "18px 20px 20px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 21 }}>{f.name}</h3>
                  <span className="deva" style={{ fontSize: 15, color: "var(--ink-faint)" }}>{f.deva}</span>
                </div>
                <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.5, margin: "8px 0 0" }}>{f.why}</p>
                {f.story && (
                  <div style={{ marginTop: 14, fontWeight: 800, fontSize: 13.5, color: f.color, display: "flex", alignItems: "center", gap: 6 }}>
                    Read the story <KIcon name="arrowR" size={15} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontWeight: 600, color: "var(--ink-faint)", fontSize: 13.5, marginTop: 22 }}>
          Months are a guide — many festivals follow the moon, so exact dates shift a little each year.
        </p>
      </section>
    </div>
  );
}

Object.assign(window, { KFestivals });

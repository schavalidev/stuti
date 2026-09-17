/* ============================================================
   KATHĀ — For grown-ups (parents & teachers)
   ============================================================ */
function KGrownups({ go }) {
  const D = window.KATHA_DATA;

  const pillars = [
    { icon: "heart", color: "var(--green)", title: "A value to keep", body: "Every tale lands on one gentle idea — courage, honesty, kindness — named in plain words a child can carry." },
    { icon: "atom",  color: "var(--teal)",  title: "A thread of real knowledge", body: "Behind the wonder sits something true: a strand of Indian mathematics, astronomy, Āyurveda or yoga." },
    { icon: "book",  color: "var(--blue)",  title: "A Sanskrit word to treasure", body: "Each story closes with one śabda — script, sound and meaning — so a little vocabulary grows, tale by tale." },
  ];

  const ages = [
    { band: "4–6", color: "var(--marigold)", note: "Short, sound-rich tales. Best read aloud, one sitting." },
    { band: "7–9", color: "var(--teal)", note: "A little plot and a clear lesson. Great for early readers." },
    { band: "10+", color: "var(--purple)", note: "Bigger questions — heroes, history and the why behind things." },
  ];

  const tips = [
    "Use the “Read to me” button for bedtime — let the page turn itself.",
    "Pause on the last page: ask “what would you have done?”",
    "Say the Sanskrit word together. Repetition is how it sticks.",
    "Follow a theme for a week — six fables, then six heroes.",
  ];

  return (
    <div className="pop">
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--bg-soft)" }}>
        <div className="wrap" style={{ padding: "56px 36px 52px", position: "relative", textAlign: "center" }}>
          <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Peacock size={84} /></div>
          <span className="eyebrow" style={{ color: "var(--purple)" }}>For grown-ups</span>
          <h1 style={{ fontSize: "clamp(2.2rem,4.6vw,3.4rem)", lineHeight: 1.05, margin: "12px auto 0", maxWidth: 760 }}>
            Every story carries a seed
          </h1>
          <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 17.5, lineHeight: 1.6, maxWidth: 600, margin: "16px auto 0" }}>
            Kathā turns the wisdom of Sanātana Dharma into little stories — built so the wonder lingers long after the page is turned, with nothing to buy and nothing to interrupt.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="wrap" style={{ padding: "54px 36px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px,1fr))", gap: 18 }}>
          {pillars.map(p => (
            <div key={p.title} style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "30px 28px" }}>
              <span style={{ width: 56, height: 56, borderRadius: 18, display: "grid", placeItems: "center", background: `color-mix(in srgb, ${p.color} 16%, #fff)`, color: p.color }}>
                <KIcon name={p.icon} size={28} />
              </span>
              <h3 style={{ fontSize: 22, marginTop: 18 }}>{p.title}</h3>
              <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.6, marginTop: 8 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ages */}
      <section className="wrap" style={{ padding: "60px 36px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <span style={{ color: "var(--marigold)" }}><KIcon name="star" size={24} /></span>
          <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.1rem)" }}>Right-sized for every age</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
          {ages.map(a => (
            <div key={a.band} style={{ background: a.color, color: "#fff", borderRadius: "var(--r-lg)", padding: "26px 26px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, lineHeight: 1 }}>{a.band}</div>
              <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.55, marginTop: 10, opacity: 0.95 }}>{a.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Read-aloud tips */}
      <section className="wrap" style={{ padding: "60px 36px 0" }}>
        <div style={{ background: "var(--bg-soft)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "38px 40px" }}>
          <span className="eyebrow" style={{ color: "var(--teal)" }}>Read-aloud tips</span>
          <h2 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", marginTop: 10 }}>Make the most of story time</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 14, marginTop: 24 }}>
            {tips.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-md)", padding: "18px 20px" }}>
                <span style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", background: "var(--teal)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 15 }}>{i + 1}</span>
                <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.5, margin: 0, color: "var(--ink-soft)" }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap" style={{ padding: "54px 36px 10px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.2rem)" }}>Ready when they are</h2>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => go("library")}>Explore stories <KIcon name="arrowR" size={17} /></button>
          <button className="btn btn-sun" onClick={() => go("reader", { id: D.storybook.id })}><KIcon name="play" size={16} /> Read today's tale</button>
          <button className="btn btn-ghost" onClick={() => go("gate")}>🔒 Parent settings</button>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { KGrownups });

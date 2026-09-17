/* ============================================================
   KATHĀ — Home screen
   ============================================================ */
function Sparkles() {
  const items = [
  { t: 18, l: "8%", c: "var(--marigold)", s: 22, d: "0s" },
  { t: 120, l: "20%", c: "var(--pink)", s: 14, d: ".6s" },
  { t: 60, l: "84%", c: "var(--teal)", s: 18, d: "1.2s" },
  { t: 170, l: "92%", c: "var(--blue)", s: 13, d: ".3s" },
  { t: 240, l: "5%", c: "var(--green)", s: 15, d: ".9s" }];

  return <div className="sparkles" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{items.map((p, i) =>
    <span key={i} className="float" style={{ position: "absolute", top: p.t, left: p.l, color: p.c, animationDelay: p.d }}>
      <KIcon name="sparkle" size={p.s} />
    </span>
    )}</div>;
}

function KHero({ go }) {
  const story = window.KATHA_DATA.storybook;
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <Sparkles />
      <div className="wrap katha-hero-grid" style={{ padding: "56px 36px 64px", position: "relative", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }}>
        <div className="pop">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "2px solid var(--line)", borderRadius: 999, padding: "7px 16px 7px 8px", marginBottom: 24 }}>
            <Peacock size={34} />
            <span style={{ fontWeight: 800, fontSize: 14, color: "var(--ink-soft)" }}></span>
          </div>
          <h1 style={{ lineHeight: 1.02, fontSize: "26px" }}>
            Big ideas,<br />
            <span style={{ color: "var(--blue)", fontSize: "6px" }}>tiny </span>
            <span style={{ color: "var(--marigold)", fontSize: "6px" }}>stories</span>
            <span style={{ color: "var(--pink)", fontSize: "6px" }}>.</span>
          </h1>
          <p style={{ fontWeight: 600, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 480, marginTop: 18, fontSize: "16px" }}>
            Fables, heroes, festivals and the wonder-sciences of ancient India — read aloud, with a lesson and a new word to treasure in every tale.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => go("library")}>Explore stories <KIcon name="arrowR" size={18} /></button>
            <button className="btn btn-sun" onClick={() => go("reader", { id: story.id })}><KIcon name="play" size={17} /> Read today's tale</button>
          </div>
        </div>
        {/* featured story preview */}
        <div className="pop float" style={{ animationDuration: "6s" }}>
          <div onClick={() => go("detail", { id: story.id })}
          style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden", cursor: "pointer", boxShadow: "var(--shadow-md)", transform: "rotate(1.4deg)" }}>
            <div style={{ height: 230, background: story.color, position: "relative" }}>
              <SceneArt name={story.scene} accent={story.color} />
              <span style={{ position: "absolute", top: 14, left: 14, whiteSpace: "nowrap", background: "#fff", color: story.color, fontWeight: 800, fontSize: 12.5, padding: "6px 14px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}>⭐ Story of the day</span>
            </div>
            <div style={{ padding: "20px 24px 22px" }}>
              <h3 style={{ fontSize: 25 }}>{story.title}</h3>
              <p style={{ fontWeight: 600, color: "var(--ink-soft)", margin: "8px 0 0", fontSize: 15 }}>A clever little rabbit, a fierce lion, and one very good idea.</p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function ThemeGrid({ go }) {
  const { themes } = window.KATHA_DATA;
  return (
    <section className="wrap" style={{ padding: "26px 36px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 26 }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--teal)" }}>Where to begin</span>
          <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", marginTop: 8 }}>Pick your adventure</h2>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: 18 }}>
        {themes.map((t) =>
        <button key={t.id} onClick={() => go("library", { theme: t.id })} className="theme-card"
        style={{ textAlign: "left", border: 0, borderRadius: "var(--r-lg)", padding: "26px 24px 24px", background: t.color, color: "#fff",
          position: "relative", overflow: "hidden", transition: "transform .18s ease, box-shadow .18s ease", boxShadow: "var(--shadow-sm)" }}>
            <span style={{ position: "absolute", right: -18, top: -18, opacity: 0.18 }}><KIcon name={t.icon} size={120} stroke={1.4} /></span>
            <span style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.25)", display: "grid", placeItems: "center", color: "#fff" }}>
              <KIcon name={t.icon} size={26} />
            </span>
            <div className="deva" style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, marginTop: 18 }}>{t.deva}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, fontWeight: 700, opacity: 0.92, marginTop: 5 }}>{t.name}</div>
            <p style={{ fontWeight: 600, fontSize: 14.5, opacity: 0.95, margin: "6px 0 0", position: "relative" }}>{t.blurb}</p>
            <div style={{ marginTop: 16, fontWeight: 800, fontSize: 13.5, display: "flex", alignItems: "center", gap: 7 }}>
              {t.count} stories <KIcon name="arrowR" size={16} />
            </div>
          </button>
        )}
      </div>
    </section>);

}

function FeaturedStories({ go, saved, toggleSave }) {
  const featured = window.KATHA_DATA.stories.filter((s) => s.featured);
  return (
    <section className="wrap" style={{ padding: "64px 36px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ color: "var(--marigold)" }}><KIcon name="star" size={26} /></span>
        <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)" }}>Loved by little readers</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
        {featured.map((s) => <StoryCard key={s.id} s={s} go={go} saved={saved} toggleSave={toggleSave} />)}
      </div>
    </section>);

}

function GrownupBand() {
  return (
    <section className="wrap" style={{ padding: "70px 36px 0" }}>
      <div style={{ background: "var(--bg-soft)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "40px 40px", display: "flex", gap: 30, alignItems: "center", flexWrap: "wrap" }}>
        <div className="float" style={{ flex: "none" }}><Peacock size={92} /></div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <span className="eyebrow" style={{ color: "var(--purple)" }}>For grown-ups</span>
          <h3 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", marginTop: 8 }}>Every story carries a seed</h3>
          <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.6, marginTop: 8, maxWidth: 620 }}>
            Akshara pairs each tale with a gentle value, a real strand of Indian science or scripture, and one Sanskrit word — so the wonder lingers long after the page is turned.
          </p>
        </div>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          {[["6", "themes"], ["31", "stories"], ["31", "Sanskrit words"]].map(([n, l]) =>
          <div key={l}><div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34, color: "var(--purple)" }}>{n}</div><div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-faint)" }}>{l}</div></div>
          )}
        </div>
      </div>
    </section>);

}

function KHome(props) {
  return (
    <div className="pop">
      <KHero {...props} />
      <ThemeGrid {...props} />
      <FeaturedStories {...props} />
      <GrownupBand />
    </div>);

}

Object.assign(window, { KHome, Sparkles });
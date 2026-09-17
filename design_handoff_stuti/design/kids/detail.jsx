/* ============================================================
   KATHĀ — Story detail / landing (cover · what you'll discover · more)
   ============================================================ */
function KStoryDetail({ go, saved, toggleSave, storyId }) {
  const D = window.KATHA_DATA;
  const s = D.stories.find(x => x.id === storyId)
    || (D.storybook.id === storyId ? D.storybook : null)
    || D.stories.find(x => x.featured) || D.stories[0];
  const theme = D.themes.find(t => t.id === s.theme);
  const marked = saved.has(s.id);
  const accent = s.color;
  const blurb = s.blurb || "A little tale with a big heart.";
  const pages = (D.storybook.id === s.id ? D.storybook.pages.length : null);

  const siblings = D.stories.filter(x => x.theme === s.theme && x.id !== s.id).slice(0, 3);

  return (
    <div className="pop" style={{ minHeight: "calc(100vh - 80px)" }}>
      <div className="wrap" style={{ padding: "26px 36px 64px" }}>
        <button onClick={() => go("library")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, fontWeight: 800, color: "var(--ink-soft)", marginBottom: 20 }}>
          <KIcon name="arrowL" size={18} /> All stories
        </button>

        {/* ---- Hero ---- */}
        <div className="katha-detail-grid" style={{ display: "grid", gridTemplateColumns: "0.92fr 1.08fr", gap: 40, alignItems: "center" }}>
          {/* cover */}
          <div className="float" style={{ animationDuration: "6s" }}>
            <div style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)", transform: "rotate(-1.2deg)" }}>
              <div style={{ position: "relative", height: 300, background: accent }}>
                <SceneArt name={s.scene} accent={accent} />
                <span style={{ position: "absolute", top: 16, left: 16, display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", background: "#fff", color: accent, fontWeight: 800, fontSize: 13, padding: "7px 14px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}>
                  <KIcon name={theme.icon} size={16} /> {theme.name}
                </span>
                <button onClick={() => toggleSave(s.id)}
                  style={{ position: "absolute", top: 12, right: 12, width: 42, height: 42, borderRadius: "50%", border: 0, background: "#fff", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)", color: marked ? "var(--pink)" : "var(--ink-faint)" }}>
                  <KIcon name="heart" size={21} />
                </button>
              </div>
            </div>
          </div>

          {/* info */}
          <div>
            <span className="eyebrow" style={{ color: accent }}>{theme.translit} · {theme.deva}</span>
            <h1 style={{ fontSize: "clamp(2.2rem,4.4vw,3.3rem)", margin: "10px 0 0", lineHeight: 1.06 }}>{s.title}</h1>
            <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 17, lineHeight: 1.55, marginTop: 14, maxWidth: 520 }}>{blurb}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
              <span className="meta-pill"><KIcon name="star" size={16} /> Age {s.age}</span>
              <span className="meta-pill"><KIcon name="clock" size={16} /> {s.mins} min read</span>
              {pages && <span className="meta-pill"><KIcon name="book" size={16} /> {pages} pages</span>}
              <span className="meta-pill"><KIcon name="speaker" size={16} /> Read aloud</span>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <button className="btn" style={{ background: accent, color: "#fff", boxShadow: "var(--shadow-sm)" }} onClick={() => go("reader", { id: s.id })}>
                <KIcon name="play" size={17} /> Start reading
              </button>
              <button className="btn btn-ghost" onClick={() => toggleSave(s.id)} style={{ color: marked ? "var(--pink)" : "var(--ink)" }}>
                <KIcon name="heart" size={18} /> {marked ? "Saved" : "Save for later"}
              </button>
            </div>
          </div>
        </div>

        {/* ---- What you'll discover ---- */}
        <div className="katha-discover" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginTop: 48 }}>
          <div style={{ background: "var(--bg-soft)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "30px 32px" }}>
            <span className="eyebrow" style={{ color: "var(--purple)" }}>The little lesson</span>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.4rem,2.2vw,1.9rem)", lineHeight: 1.2, color: "var(--ink)", margin: "12px 0 0" }}>{s.moral}</p>
            <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.6, marginTop: 12 }}>
              Every Kathā tale ends with a value to keep — a gentle idea your little one can carry into the world.
            </p>
          </div>

          <div style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "30px 32px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>A word to treasure</div>
            <div className="deva" style={{ fontSize: 50, color: accent, lineHeight: 1.1, marginTop: 8 }}>{s.word.deva}</div>
            <div style={{ fontWeight: 800, fontSize: 19, color: "var(--ink)", marginTop: 2 }}>{s.word.iast}</div>
            <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink-soft)", marginTop: 2 }}>“{s.word.en}”</div>
          </div>
        </div>

        {/* ---- More like this ---- */}
        {siblings.length > 0 && (
          <div style={{ marginTop: 52 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <span style={{ color: accent }}><KIcon name={theme.icon} size={24} /></span>
              <h2 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)" }}>More {theme.name.toLowerCase()}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
              {siblings.map(x => <StoryCard key={x.id} s={x} go={go} saved={saved} toggleSave={toggleSave} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { KStoryDetail });

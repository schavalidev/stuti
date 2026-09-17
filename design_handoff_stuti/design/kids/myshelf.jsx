/* ============================================================
   KATHĀ — My Shelf (continue the story + saved stories)
   ============================================================ */
function kReadProgress() {
  try { return JSON.parse(localStorage.getItem("katha_progress") || "null"); } catch { return null; }
}

function KShelf({ go, saved, toggleSave }) {
  const D = window.KATHA_DATA;
  const prog = kReadProgress();
  const progStory = prog ? (D.stories.find(s => s.id === prog.storyId) || (D.storybook.id === prog.storyId ? D.storybook : null)) : null;
  const progTheme = progStory ? D.themes.find(t => t.id === progStory.theme) : null;

  const savedList = D.stories.filter(s => saved.has(s.id));

  return (
    <div className="pop">
      {/* Continue band */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {window.Sparkles && <Sparkles />}
        <div className="wrap" style={{ padding: "48px 36px 6px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "2px solid var(--line)", borderRadius: 999, padding: "7px 16px 7px 8px", marginBottom: 18 }}>
            <Peacock size={32} />
            <span style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink-soft)" }}>Your bookshelf</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem,4.4vw,3.3rem)", lineHeight: 1.04 }}>
            Saved stories &amp; <span style={{ color: "var(--blue)" }}>where you left off</span>
          </h1>

          {progStory && (
            <div onClick={() => go("reader", { id: progStory.id })}
              style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 28, background: "#fff", border: "2px solid var(--line)",
                borderRadius: "var(--r-lg)", padding: "18px 22px", cursor: "pointer", maxWidth: 640, boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 92, height: 72, flex: "none", borderRadius: 14, overflow: "hidden", background: progStory.color, position: "relative" }}>
                <SceneArt name={progStory.scene} accent={progStory.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: progStory.color }}>Continue the story</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, lineHeight: 1.15, marginTop: 3 }}>{progStory.title}</div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-faint)", marginTop: 3 }}>{progTheme ? progTheme.name : ""}{prog.page > 0 ? ` · page ${prog.page + 1}` : ""}</div>
              </div>
              <div style={{ width: 48, height: 48, flex: "none", borderRadius: "50%", background: progStory.color, color: "#fff", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)" }}>
                <KIcon name="play" size={20} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Saved */}
      <section className="wrap" style={{ padding: "40px 36px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <span style={{ color: "var(--pink)" }}><KIcon name="heart" size={24} /></span>
          <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.1rem)" }}>My saved stories</h2>
          {savedList.length > 0 && <span style={{ marginLeft: 4, fontWeight: 800, color: "var(--ink-faint)", fontSize: 15 }}>{savedList.length}</span>}
        </div>

        {savedList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 20px", background: "var(--bg-soft)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)" }}>
            <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><Peacock size={78} /></div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink-soft)" }}>No saved stories yet!</p>
            <p style={{ fontWeight: 700, color: "var(--ink-faint)", maxWidth: 360, margin: "4px auto 22px" }}>Tap the little heart on any story to keep it here for later.</p>
            <button className="btn btn-primary" onClick={() => go("library")}>Find a story <KIcon name="arrowR" size={17} /></button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
            {savedList.map(s => <StoryCard key={s.id} s={s} go={go} saved={saved} toggleSave={toggleSave} />)}
          </div>
        )}
      </section>
    </div>
  );
}

Object.assign(window, { KShelf });

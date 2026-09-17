/* ============================================================
   KATHĀ — Search (stories + words to treasure)
   ============================================================ */
function KSearch({ go, saved, toggleSave, initialQuery }) {
  const D = window.KATHA_DATA;
  const [q, setQ] = useState(initialQuery || "");
  const inputRef = useRef(null);
  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  const term = q.trim().toLowerCase();

  const storyHits = term ? D.stories.filter(s =>
    (s.title + " " + s.blurb + " " + s.moral + " " + s.word.en + " " + s.word.iast).toLowerCase().includes(term)
  ) : [];

  const wordHits = term ? D.stories.filter(s =>
    (s.word.en + " " + s.word.iast + " " + s.word.deva).toLowerCase().includes(term)
  ) : [];

  const suggestions = ["courage", "kindness", "stars", "Diwali", "wisdom", "animals"];
  const total = storyHits.length;

  return (
    <div className="pop wrap" style={{ padding: "44px 36px 50px", minHeight: "70vh" }}>
      <span className="eyebrow" style={{ color: "var(--blue)" }}>Search</span>
      <h1 style={{ fontSize: "clamp(2.1rem,4vw,3.1rem)", margin: "8px 0 0" }}>What shall we read about?</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "2px solid var(--line)", borderRadius: 999, padding: "14px 22px", marginTop: 24 }}>
        <span style={{ color: "var(--ink-faint)" }}><KIcon name="search" size={22} /></span>
        <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search stories, lessons, words…"
          style={{ flex: 1, border: 0, outline: "none", background: "none", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 17, color: "var(--ink)" }} />
        {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0, color: "var(--ink-faint)" }}><KIcon name="close" size={20} /></button>}
      </div>

      {!term ? (
        <div style={{ marginTop: 30 }}>
          <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Try one of these</span>
          <div style={{ display: "flex", gap: 9, marginTop: 14, flexWrap: "wrap" }}>
            {suggestions.map(s => <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>)}
          </div>
        </div>
      ) : total === 0 && wordHits.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><Peacock size={76} /></div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink-soft)" }}>Nothing found for "{q}"</p>
          <p style={{ fontWeight: 700, color: "var(--ink-faint)" }}>Try another word!</p>
        </div>
      ) : (
        <div>
          {/* Words to treasure */}
          {wordHits.length > 0 && (
            <div style={{ marginTop: 34 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--purple)" }}>Words to treasure</span>
                <span style={{ flex: 1, height: 2, background: "var(--line)", borderRadius: 2 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 14 }}>
                {wordHits.map(s => (
                  <button key={s.id} onClick={() => go("detail", { id: s.id })}
                    style={{ textAlign: "left", background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-md)", padding: "18px 20px", cursor: "pointer", transition: "transform .15s, border-color .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = s.color; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--line)"; }}>
                    <div className="deva" style={{ fontSize: 34, color: s.color, lineHeight: 1.1 }}>{s.word.deva}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>{s.word.iast}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-soft)" }}>“{s.word.en}”</div>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--ink-faint)", marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
                      from {s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title} <KIcon name="arrowR" size={13} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stories */}
          {storyHits.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--blue)" }}>Stories</span>
                <span style={{ fontWeight: 800, color: "var(--ink-faint)", fontSize: 13 }}>{storyHits.length}</span>
                <span style={{ flex: 1, height: 2, background: "var(--line)", borderRadius: 2 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
                {storyHits.map(s => <StoryCard key={s.id} s={s} go={go} saved={saved} toggleSave={toggleSave} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { KSearch });

/* ============================================================
   KATHĀ — StoryCard + Story Library
   ============================================================ */
function StoryCard({ s, go, saved, toggleSave, big }) {
  const theme = window.KATHA_DATA.themes.find((t) => t.id === s.theme);
  return (
    <div className="story-card" onClick={() => go("detail", { id: s.id })}
    style={{ background: "var(--card)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden",
      cursor: "pointer", display: "flex", flexDirection: "column", transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease" }}>
      <div style={{ position: "relative", height: big ? 210 : 168, background: s.color }}>
        <SceneArt name={s.scene} accent={s.color} />
        <span style={{ position: "absolute", top: 12, left: 12, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
          background: "#fff", color: s.color, fontWeight: 800, fontSize: 12.5, padding: "5px 12px", borderRadius: 999, boxShadow: "var(--shadow-sm)" }}>
          <KIcon name={theme.icon} size={15} /> {theme.name}
        </span>
        <button onClick={(e) => {e.stopPropagation();toggleSave(s.id);}}
        style={{ position: "absolute", top: 10, right: 10, width: 38, height: 38, borderRadius: "50%", border: 0,
          background: "#fff", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)",
          color: saved.has(s.id) ? "var(--pink)" : "var(--ink-faint)" }}>
          <KIcon name="heart" size={19} />
        </button>
      </div>
      <div style={{ padding: big ? "22px 24px 20px" : "18px 20px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: big ? 25 : 21, lineHeight: 1.12 }}>{s.title}</h3>
        <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.5, margin: "8px 0 16px", flex: 1 }}>{s.blurb}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 13, color: "var(--ink-faint)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><KIcon name="star" size={15} /> Age {s.age}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><KIcon name="clock" size={15} /> {s.mins} min</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, color: s.color }}>
            Read <KIcon name="arrowR" size={16} />
          </span>
        </div>
      </div>
    </div>);

}

function KLibrary({ go, saved, toggleSave, initialFav, initialTheme }) {
  const { stories, themes } = window.KATHA_DATA;
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState(initialFav ? "fav" : initialTheme || "all");
  const [age, setAge] = useState("all");
  const [view, setView] = useState("shelf");

  useEffect(() => {if (initialFav) setTheme("fav");else if (initialTheme) setTheme(initialTheme);}, [initialFav, initialTheme]);

  const inAge = (range) => {
    if (age === "all") return true;
    const [lo, hi] = range.split("–").map(Number);
    if (age === "4-6") return lo <= 6;
    if (age === "7-9") return hi >= 7 && lo <= 9;
    if (age === "10+") return hi >= 10;
    return true;
  };

  let list = stories.filter((s) => {
    if (theme === "fav") {if (!saved.has(s.id)) return false;} else
    if (theme !== "all" && s.theme !== theme) return false;
    if (!inAge(s.age)) return false;
    if (q.trim()) {
      const hay = (s.title + " " + s.blurb + " " + s.moral + " " + s.word.en).toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  const themeChips = [{ id: "all", name: "All stories", color: "var(--ink)" }, ...themes.map((t) => ({ id: t.id, name: `${t.translit} - ${t.deva}`, color: t.color })), { id: "fav", name: `Saved${saved.size ? " · " + saved.size : ""}`, color: "var(--pink)" }];
  const ages = [["all", "Any age"], ["4-6", "4–6"], ["7-9", "7–9"], ["10+", "10+"]];

  return (
    <div className="pop wrap" style={{ padding: "44px 36px 30px" }}>
      <span className="eyebrow" style={{ color: "var(--blue)" }}>The story shelf</span>
      <h1 style={{ fontSize: "clamp(2.3rem,4.4vw,3.4rem)", margin: "8px 0 0" }}>Pick a story to dive into</h1>
      <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 17, maxWidth: 560, marginTop: 10 }}>Pick a theme, choose an age, or search for a word. Tap the heart to save your favourites.</p>

      {/* search + age */}
      <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260, display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "2px solid var(--line)", borderRadius: 999, padding: "12px 20px" }}>
          <span style={{ color: "var(--ink-faint)" }}><KIcon name="search" size={20} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories…"
          style={{ flex: 1, border: 0, outline: "none", background: "none", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, color: "var(--ink)" }} />
          {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0, color: "var(--ink-faint)" }}><KIcon name="close" size={18} /></button>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#fff", border: "2px solid var(--line)", borderRadius: 999, padding: 5 }}>
          {ages.map(([id, label]) =>
          <button key={id} onClick={() => setAge(id)}
          style={{ padding: "8px 15px", borderRadius: 999, border: 0, whiteSpace: "nowrap", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 14,
            background: age === id ? "var(--marigold)" : "transparent", color: age === id ? "#fff" : "var(--ink-soft)" }}>{label}</button>
          )}
        </div>
      </div>

      {/* theme chips */}
      <div style={{ display: "flex", gap: 9, marginTop: 18, flexWrap: "wrap" }}>
        {themeChips.map((c) =>
        <button key={c.id} className="chip" data-active={theme === c.id}
        onClick={() => setTheme(c.id)}
        style={theme === c.id ? { background: c.color } : {}}>
            {c.name}
          </button>
        )}
      </div>

      <div style={{ margin: "26px 0 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 800, color: "var(--ink-faint)", fontSize: 14.5 }}>
          {list.length} {list.length === 1 ? "story" : "stories"}
        </span>
        <div style={{ display: "flex", gap: 4, background: "#fff", border: "2px solid var(--line)", borderRadius: 999, padding: 4 }}>
          {[["shelf", "Shelf", "book"], ["grid", "Cards", "grid"]].map(([v, label, icon]) =>
          <button key={v} onClick={() => setView(v)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 15px", borderRadius: 999, border: 0, fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 14, whiteSpace: "nowrap",
            background: view === v ? "var(--blue)" : "transparent", color: view === v ? "#fff" : "var(--ink-soft)" }}>
              <KIcon name={icon} size={16} /> {label}
            </button>
          )}
        </div>
      </div>

      {list.length === 0 ?
      <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--ink-faint)" }}>
          <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Peacock size={84} /></div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ink-soft)" }}>No stories here yet!</p>
          <p style={{ fontWeight: 700 }}>Try another theme or age.</p>
        </div> :
      view === "shelf" ?
      <Bookcase list={list} go={go} saved={saved} toggleSave={toggleSave} /> :

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
          {list.map((s) => <StoryCard key={s.id} s={s} go={go} saved={saved} toggleSave={toggleSave} />)}
        </div>
      }
    </div>);

}

Object.assign(window, { StoryCard, KLibrary });
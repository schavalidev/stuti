/* ============================================================
   KATHĀ — Storybook reader (cover · pages · narrate · ending)
   ============================================================ */
function getBook(id) {
  const D = window.KATHA_DATA;
  if (!id || id === D.storybook.id) return D.storybook;
  const s = D.stories.find(x => x.id === id);
  if (!s) return D.storybook;
  return {
    id: s.id, title: s.title, theme: s.theme, color: s.color, scene: s.scene,
    age: s.age, mins: s.mins, word: s.word, moral: s.moral, preview: true,
    pages: [{ art: s.scene, heading: "Once upon a time…", text: s.blurb + " The full storybook is being illustrated — but here is the heart of the tale, and the treasure it leaves behind." }],
    end: { heading: "What we learned", text: s.moral },
  };
}

function KReader({ go, saved, toggleSave, storyId }) {
  const book = getBook(storyId);
  const theme = window.KATHA_DATA.themes.find(t => t.id === book.theme);
  const total = book.pages.length;
  // page: 0..total-1 = pages, total = ending (cover lives on the detail screen)
  const [page, setPage] = useState(0);
  const [narrate, setNarrate] = useState(false);
  const [prog, setProg] = useState(0);
  const timer = useRef(null);
  const marked = saved.has(book.id);

  useEffect(() => { setPage(0); setNarrate(false); setProg(0); }, [storyId]);

  // Record progress for "My shelf · Continue the story"
  useEffect(() => {
    try { localStorage.setItem("katha_progress", JSON.stringify({ storyId: book.id, page, at: Date.now() })); } catch {}
  }, [book.id, page]);

  const last = total; // ending index
  const go2 = (p) => { setPage(Math.max(0, Math.min(last, p))); setProg(0); };

  useEffect(() => {
    if (!narrate || page < 0 || page >= total) { clearInterval(timer.current); return; }
    const dur = 5500, step = 60;
    timer.current = setInterval(() => {
      setProg(p => {
        const np = p + step / dur;
        if (np >= 1) { setPage(cur => (cur + 1 > last ? (clearInterval(timer.current), setNarrate(false), cur) : cur + 1)); return 0; }
        return np;
      });
    }, step);
    return () => clearInterval(timer.current);
  }, [narrate, page, total]);

  const accent = book.color;

  /* ---------- Ending ---------- */
  if (page === last) {
    return (
      <div className="pop" style={{ minHeight: "calc(100vh - 80px)", padding: "30px 36px 60px", position: "relative", overflow: "hidden" }}>
        <Sparkles />
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div className="float" style={{ display: "flex", justifyContent: "center", marginTop: 20 }}><Peacock size={92} /></div>
          <span className="eyebrow" style={{ color: accent }}>{book.end.heading}</span>
          <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.9rem)", margin: "10px 0 0", lineHeight: 1.15 }}>{book.moral}</h1>
          <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 17, marginTop: 14, lineHeight: 1.55 }}>{book.end.text}</p>

          {/* Sanskrit word card */}
          <div style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "26px 30px", margin: "30px auto 0", maxWidth: 460, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>A word to treasure</div>
            <div className="deva" style={{ fontSize: 52, color: accent, lineHeight: 1.1, marginTop: 8 }}>{book.word.deva}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "var(--ink)", marginTop: 2 }}>{book.word.iast}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-soft)", marginTop: 2 }}>“{book.word.en}”</div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
            <button className="btn btn-ghost" onClick={() => go2(0)}><KIcon name="arrowL" size={18} /> Read again</button>
            <button className="btn btn-primary" onClick={() => go("library")}>More stories <KIcon name="arrowR" size={18} /></button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Story page ---------- */
  const pg = book.pages[page];
  return (
    <div className="pop" style={{ minHeight: "calc(100vh - 80px)", padding: "22px 36px 40px" }}>
      {/* topbar */}
      <div style={{ maxWidth: 980, margin: "0 auto 16px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => go("detail", { id: book.id })} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, fontWeight: 800, color: "var(--ink-soft)" }}>
          <KIcon name="arrowL" size={18} /> Story
        </button>
        <div style={{ flex: 1, fontWeight: 800, color: "var(--ink)", fontSize: 15, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</div>
        <button onClick={() => setNarrate(n => !n)} className="btn"
          style={{ padding: "9px 16px", background: narrate ? accent : "#fff", color: narrate ? "#fff" : accent, border: "2px solid " + accent }}>
          <KIcon name={narrate ? "pause" : "speaker"} size={17} /> {narrate ? "Reading…" : "Read to me"}
        </button>
      </div>

      {/* book spread */}
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "stretch", gap: 16 }}>
        <button onClick={() => page === 0 ? go("detail", { id: book.id }) : go2(page - 1)} className="page-arrow" style={{ alignSelf: "center" }}>
          <KIcon name="arrowL" size={24} />
        </button>
        <div style={{ flex: 1, background: "#fff", border: "2px solid var(--line)", borderRadius: 32, overflow: "hidden", boxShadow: "var(--shadow-md)", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 420 }}>
          <div style={{ background: accent, position: "relative" }}>
            <SceneArt name={pg.art} accent={accent} />
          </div>
          <div style={{ padding: "40px 40px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 22, right: 26, whiteSpace: "nowrap", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--ink-faint)" }}>{page + 1} / {total}</div>
            <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.2rem)", color: accent, lineHeight: 1.1 }}>{pg.heading}</h2>
            <p style={{ fontWeight: 600, fontSize: "clamp(1.1rem,1.5vw,1.32rem)", lineHeight: 1.65, color: "var(--ink)", marginTop: 16 }}>{pg.text}</p>
          </div>
        </div>
        <button onClick={() => go2(page + 1)} className="page-arrow" style={{ alignSelf: "center" }}>
          <KIcon name="arrowR" size={24} />
        </button>
      </div>

      {/* progress dots */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 9, marginTop: 24 }}>
        {book.pages.map((_, i) => (
          <button key={i} onClick={() => go2(i)} aria-label={"Page " + (i + 1)}
            style={{ width: i === page ? 30 : 12, height: 12, borderRadius: 999, border: 0, padding: 0, cursor: "pointer",
              background: i === page ? accent : "var(--line)", transition: "all .2s ease", position: "relative", overflow: "hidden" }}>
            {i === page && narrate && <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, background: "rgba(255,255,255,0.55)" }} />}
          </button>
        ))}
        <button onClick={() => go2(last)} style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", background: "none", border: 0, fontWeight: 800, color: accent, fontSize: 14 }}>
          The end <KIcon name="arrowR" size={16} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { KReader, getBook });

/* ============================================================
   AKSHARA — Library (browse + search + filter) and TextCard
   ============================================================ */
function TextCard({ t, go, marked, toggleMark, view = "grid", onOpen }) {
  const coll = window.AKSHARA_DATA.collections.find(c => c.id === t.coll);
  const open = () => onOpen ? onOpen(t.id) : go("detail", { textId: t.id });
  if (view === "list") {
    return (
      <div className="text-card-list" onClick={open}
        style={{ display: "flex", gap: 22, alignItems: "center", padding: "20px 22px", background: "var(--paper-2)",
          border: "1px solid var(--line)", borderRadius: "var(--radius)", cursor: "pointer",
          transition: "border-color .18s, box-shadow .18s" }}>
        <div style={{ width: 56, height: 56, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
          background: "var(--paper-3)", color: "var(--maroon)", fontFamily: "var(--font-deva)", fontSize: 24 }}>{t.deva.slice(0,1)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>{t.title}</span>
            <Sa as="span" style={{ color: "var(--ink-faint)", fontSize: 16 }}>{t.deva}</Sa>
          </div>
          <p style={{ margin: "5px 0 0", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.blurb}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flex: "none" }}>
          <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{t.verses.toLocaleString()} verses</span>
          {t.audio && <span style={{ color: "var(--saffron)" }}><Icon name="speaker" size={17} /></span>}
          <button onClick={(e) => { e.stopPropagation(); toggleMark(t.id); }}
            style={{ background: "none", border: 0, color: marked ? "var(--maroon)" : "var(--ink-faint)", padding: 4 }}>
            <Icon name={marked ? "bookmarkFill" : "bookmark"} size={19} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="text-card" onClick={open}
      style={{ display: "flex", flexDirection: "column", background: "var(--paper-2)", border: "1px solid var(--line)",
        borderRadius: "var(--radius)", padding: "24px 24px 22px", cursor: "pointer", position: "relative",
        transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--saffron)", fontWeight: 500 }}>{coll ? coll.name : t.tradition}</span>
        <button onClick={(e) => { e.stopPropagation(); toggleMark(t.id); }}
          style={{ background: "none", border: 0, color: marked ? "var(--maroon)" : "var(--ink-faint)", padding: 0, marginTop: -2 }}>
          <Icon name={marked ? "bookmarkFill" : "bookmark"} size={19} />
        </button>
      </div>
      <Sa as="div" style={{ fontSize: 26, color: "var(--maroon)", lineHeight: 1.2 }}>{t.deva}</Sa>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, marginTop: 6, lineHeight: 1.1 }}>{t.title}</div>
      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "14px 0 20px", flex: 1 }}>{t.blurb}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 16, borderTop: "1px solid var(--line-soft)", fontSize: 13, color: "var(--ink-faint)" }}>
        <span>{t.era}</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--ink-faint)" }} />
        <span>{t.verses.toLocaleString()} verses</span>
        {t.audio && <span style={{ marginLeft: "auto", color: "var(--saffron)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="speaker" size={15} /> audio</span>}
      </div>
    </div>
  );
}

function LibraryScreen({ go, bookmarks, toggleMark, initialColl, openText }) {
  const { texts, collections } = window.AKSHARA_DATA;
  const [q, setQ] = useState("");
  const [coll, setColl] = useState(initialColl || "all");
  const [audioOnly, setAudioOnly] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [view, setView] = useState("grid");

  useEffect(() => { if (initialColl) setColl(initialColl); }, [initialColl]);

  let list = texts.filter(t => {
    if (coll !== "all" && coll !== "bookmarks" && t.coll !== coll) return false;
    if (coll === "bookmarks" && !bookmarks.has(t.id)) return false;
    if (audioOnly && !t.audio) return false;
    if (q.trim()) {
      const s = (t.title + " " + t.deva + " " + t.blurb + " " + t.tradition).toLowerCase();
      if (!s.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });
  if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "verses") list = [...list].sort((a, b) => b.verses - a.verses);

  const chips = [{ id: "all", name: "All texts" }, ...collections.map(c => ({ id: c.id, name: c.name })), { id: "bookmarks", name: `Saved${bookmarks.size ? " · " + bookmarks.size : ""}` }];

  return (
    <div className="rise wrap" style={{ padding: "52px 40px 40px" }}>
      <span className="eyebrow">The library</span>
      <h1 style={{ fontSize: "clamp(2.4rem,4vw,3.4rem)", margin: "12px 0 0" }}>Every text, line by line</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 17, maxWidth: 600, marginTop: 14 }}>Search across the canon, or wander it by tradition. Each work opens into Sanskrit, transliteration and translation.</p>

      {/* Search */}
      <div style={{ display: "flex", gap: 12, marginTop: 34, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 12, background: "var(--paper-2)",
          border: "1px solid var(--line)", borderRadius: 999, padding: "14px 22px" }}>
          <Icon name="search" size={20} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search titles, traditions, themes…"
            style={{ flex: 1, background: "none", border: 0, outline: "none", fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink)" }} />
          {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0, color: "var(--ink-faint)" }}><Icon name="close" size={18} /></button>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setAudioOnly(a => !a)} className="chip" data-active={audioOnly}
            style={{ padding: "0 16px", height: 50, fontSize: 14 }}>
            <Icon name="speaker" size={16} /> With audio
          </button>
          <div style={{ display: "flex", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: 4 }}>
            {["grid", "list"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ width: 42, height: 42, borderRadius: 999, border: 0, display: "grid", placeItems: "center",
                  background: view === v ? "var(--maroon)" : "transparent", color: view === v ? "var(--on-night)" : "var(--ink-soft)" }}>
                <Icon name={v} size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collection chips */}
      <div style={{ display: "flex", gap: 9, marginTop: 22, flexWrap: "wrap" }}>
        {chips.map(c => (
          <button key={c.id} className="chip" data-active={coll === c.id} onClick={() => c.id === "stotra" ? go("stotras") : setColl(c.id)}
            style={{ height: 38, fontSize: 14 }}>{c.name}</button>
        ))}
      </div>

      {/* Result bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "30px 0 20px", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 14, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>
          {list.length} {list.length === 1 ? "text" : "texts"}{coll !== "all" && coll !== "bookmarks" ? " · " + (collections.find(c => c.id === coll) || {}).name : ""}
        </span>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-soft)" }}>
          Sort
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ fontFamily: "var(--font-body)", fontSize: 14, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: "8px 14px", color: "var(--ink)" }}>
            <option value="relevance">Relevance</option>
            <option value="title">Title (A–Z)</option>
            <option value="verses">Length</option>
          </select>
        </label>
      </div>

      {/* Results */}
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--ink-faint)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, color: "var(--gold)", opacity: 0.5 }}><Mandala size={120} /></div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Nothing here yet.</p>
          <p style={{ fontSize: 15 }}>Try another tradition, or clear your filters.</p>
        </div>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
          {list.map(t => <TextCard key={t.id} t={t} go={go} marked={bookmarks.has(t.id)} toggleMark={toggleMark} onOpen={openText} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map(t => <TextCard key={t.id} t={t} go={go} marked={bookmarks.has(t.id)} toggleMark={toggleMark} view="list" onOpen={openText} />)}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TextCard, LibraryScreen });

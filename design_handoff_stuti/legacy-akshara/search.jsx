/* ============================================================
   AKSHARA — Search (across texts, chapters & verses)
   ============================================================ */
function SearchScreen({ go, bookmarks, toggleMark, initialQuery, openText }) {
  const D = window.AKSHARA_DATA;
  const [q, setQ] = useState(initialQuery || "");
  const inputRef = useRef(null);
  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  const term = q.trim().toLowerCase();

  // Build a searchable verse pool (daily + reader sample), tagged to a text
  const versePool = [
    ...D.daily.map(v => ({ ...v, textId: "gita", chapterNo: 2 })),
    ...D.reader.verses.map(v => ({ deva: v.deva, iast: v.iast, en: v.en, ref: `Bhagavad Gītā 2.${v.n}`, textId: "gita", chapterNo: 2 })),
  ];

  const textHits = term ? D.texts.filter(t => (t.title + " " + t.deva + " " + t.blurb + " " + t.tradition).toLowerCase().includes(term)) : [];
  const chapterHits = term ? D.gitaChapters.filter(c => (c.title + " " + c.gloss + " " + c.deva).toLowerCase().includes(term)).map(c => ({ ...c, textId: "gita", textTitle: "Bhagavad Gītā" })) : [];
  const verseHits = term ? versePool.filter(v => (v.en + " " + v.iast + " " + v.deva).toLowerCase().includes(term)) : [];
  const deityHits = term ? D.deities.filter(d => (d.name + " " + d.deva + " " + d.epithet + " " + d.note).toLowerCase().includes(term)) : [];
  const stotraHits = term ? D.stotras.filter(s => (s.title + " " + s.deva + " " + s.by + " " + s.type + " " + s.form + " " + (s.blurb || "")).toLowerCase().includes(term)) : [];

  const suggestions = ["dharma", "the Self", "yoga", "Hanumān", "Aṣṭakam", "Lakṣmī", "immortality"];
  const totalHits = textHits.length + chapterHits.length + verseHits.length + deityHits.length + stotraHits.length;

  function GroupLabel({ children, n }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "36px 0 16px" }}>
        <span className="eyebrow">{children}</span>
        <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{n}</span>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
    );
  }

  return (
    <div className="rise wrap" style={{ padding: "48px 40px 60px", minHeight: "70vh" }}>
      <span className="eyebrow">Search</span>
      <h1 style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", margin: "12px 0 0" }}>Find a text, a hymn, a verse</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: "16px 24px", marginTop: 30 }}>
        <Icon name="search" size={22} />
        <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search the library — texts, hymns, deities, lines…"
          style={{ flex: 1, background: "none", border: 0, outline: "none", fontFamily: "var(--font-body)", fontSize: 18, color: "var(--ink)" }} />
        {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0, color: "var(--ink-faint)" }}><Icon name="close" size={20} /></button>}
      </div>

      {!term ? (
        <div style={{ marginTop: 36 }}>
          <span style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Try</span>
          <div style={{ display: "flex", gap: 9, marginTop: 14, flexWrap: "wrap" }}>
            {suggestions.map(s => <button key={s} className="chip" onClick={() => setQ(s)} style={{ height: 38, fontSize: 14 }}>{s}</button>)}
          </div>
        </div>
      ) : totalHits === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--ink-faint)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, color: "var(--gold)", opacity: 0.5 }}><Mandala size={110} /></div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>No matches for "{q}"</p>
          <p style={{ fontSize: 15 }}>Try a different word, or a transliterated term.</p>
        </div>
      ) : (
        <div>
          {/* Deities */}
          {deityHits.length > 0 && (
            <>
              <GroupLabel n={`${deityHits.length}`}>Deities</GroupLabel>
              <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                {deityHits.map((d, i) => {
                  const n = D.stotras.filter(s => s.deity === d.id).length;
                  return (
                    <button key={d.id} onClick={() => go("deity", { deity: d.id })} className="chap-row"
                      style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left", background: "none", border: 0,
                        borderBottom: i === deityHits.length - 1 ? "none" : "1px solid var(--line-soft)", padding: "15px 22px" }}>
                      <span style={{ flex: "none", width: 44, height: 44, borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold)", color: "var(--maroon)" }}>
                        <Sa as="span" style={{ fontSize: 20, lineHeight: 1 }}>{d.seed}</Sa>
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600 }}>{d.name}</span>
                        <Sa as="span" style={{ fontSize: 14, color: "var(--ink-faint)", marginLeft: 10 }}>{d.deva}</Sa>
                        <span style={{ display: "block", fontSize: 13.5, color: "var(--ink-soft)", marginTop: 2, fontStyle: "normal" }}>{d.epithet}</span>
                      </span>
                      <span style={{ flex: "none", fontSize: 13, color: "var(--saffron)" }}>{n} stotras</span>
                      <Icon name="chevron" size={17} />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Texts */}
          {textHits.length > 0 && (
            <>
              <GroupLabel n={`${textHits.length} ${textHits.length === 1 ? "text" : "texts"}`}>Texts</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {textHits.map(t => <TextCard key={t.id} t={t} go={go} marked={bookmarks.has(t.id)} toggleMark={toggleMark} view="list" onOpen={openText} />)}
              </div>
            </>
          )}

          {/* Chapters */}
          {chapterHits.length > 0 && (
            <>
              <GroupLabel n={`${chapterHits.length}`}>Chapters</GroupLabel>
              <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                {chapterHits.map((c, i) => (
                  <button key={c.n} onClick={() => go("reader", { textId: c.textId, chapterNo: c.n })}
                    className="chap-row"
                    style={{ display: "flex", alignItems: "center", gap: 18, width: "100%", textAlign: "left", background: "none", border: 0,
                      borderBottom: i === chapterHits.length - 1 ? "none" : "1px solid var(--line-soft)", padding: "16px 22px" }}>
                    <span style={{ flex: "none", width: 34, fontFamily: "var(--font-deva)", fontSize: 18, color: "var(--maroon)", textAlign: "center" }}>{D.toDeva(c.n)}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600 }}>{c.title}</span>
                      <Sa as="span" style={{ fontSize: 14, color: "var(--ink-faint)", marginLeft: 10 }}>{c.deva}</Sa>
                      <span style={{ display: "block", fontSize: 13.5, color: "var(--ink-soft)", marginTop: 2 }}>{c.textTitle} · Chapter {c.n}</span>
                    </span>
                    <Icon name="chevron" size={17} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Verses */}
          {verseHits.length > 0 && (
            <>
              <GroupLabel n={`${verseHits.length}`}>Verses</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {verseHits.map((v, i) => (
                  <button key={i} onClick={() => go("reader", { textId: v.textId, chapterNo: v.chapterNo })}
                    style={{ textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "22px 26px", cursor: "pointer", transition: "border-color .16s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line)"}>
                    <Sa as="p" style={{ fontSize: 19, color: "var(--ink)", margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>{v.deva}</Sa>
                    <p style={{ fontSize: 15, color: "var(--ink-soft)", margin: "10px 0 0", lineHeight: 1.6, fontFamily: "var(--font-display)" }}>{v.en}</p>
                    <p style={{ fontSize: 12.5, letterSpacing: "0.08em", color: "var(--saffron)", margin: "12px 0 0" }}>{v.ref}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Stotras */}
          {stotraHits.length > 0 && (
            <>
              <GroupLabel n={`${stotraHits.length}`}>Stotras</GroupLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stotraHits.slice(0, 12).map(s => {
                  const deity = D.deities.find(d => d.id === s.deity);
                  return (
                    <button key={s.id} onClick={() => go("stotraReader", { id: s.id })}
                      style={{ display: "flex", gap: 16, alignItems: "center", textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "15px 20px", cursor: "pointer", transition: "border-color .16s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line)"}>
                      <span style={{ flex: "none", width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid var(--gold)", color: "var(--maroon)" }}>
                        <Sa as="span" style={{ fontSize: 18, lineHeight: 1 }}>{deity ? deity.seed : "ॐ"}</Sa>
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{s.title}</span>
                        <Sa as="span" style={{ fontSize: 14, color: "var(--maroon)", marginLeft: 10 }}>{s.deva}</Sa>
                        <span style={{ display: "block", fontSize: 13, color: "var(--ink-soft)", marginTop: 2, fontStyle: "normal" }}>{deity ? (s.form && s.form !== deity.name ? s.form : deity.name) : ""} · {s.type} · {s.by}</span>
                      </span>
                      <Icon name="chevron" size={17} />
                    </button>
                  );
                })}
              </div>
              {stotraHits.length > 12 && (
                <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 14, fontStyle: "normal" }}>+ {stotraHits.length - 12} more — open a deity to filter within its collection.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SearchScreen });

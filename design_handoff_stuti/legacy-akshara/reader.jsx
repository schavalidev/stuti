/* ============================================================
   AKSHARA — Reader (Devanagari · IAST · translation + audio)
   Chapter-aware: text + chapter come from route params.
   ============================================================ */
function ChapterMenu({ toc, chap, onPick }) {
  const [open, setOpen] = useState(false);
  const cur = toc.find(c => c.n === chap) || toc[0];
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} className="btn"
        style={{ background: "transparent", color: "var(--ink)", border: "1px solid rgba(58,40,20,0.2)", maxWidth: 360 }}>
        <Icon name="layers" size={17} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cur.title}</span>
        <Icon name="chevronD" size={16} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, zIndex: 60, width: 360, maxHeight: 380, overflowY: "auto",
          background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--shadow-lift)", padding: 6 }}>
          {toc.map(c => (
            <button key={c.n} onClick={() => { onPick(c.n); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", border: 0,
                background: c.n === chap ? "color-mix(in srgb, var(--maroon) 10%, transparent)" : "transparent",
                borderRadius: 6, padding: "11px 12px", color: "var(--ink)" }}>
              <span style={{ flex: "none", width: 26, fontFamily: "var(--font-deva)", fontSize: 16, color: "var(--maroon)", textAlign: "center" }}>{window.AKSHARA_DATA.toDeva(c.n)}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
                <Sa as="span" style={{ fontSize: 13, color: "var(--ink-faint)" }}>{c.deva}</Sa>
              </span>
              {c.n === chap && <span style={{ flex: "none", width: 6, height: 6, borderRadius: "50%", background: "var(--maroon)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReaderScreen({ go, bookmarks, toggleMark, textId, chapterNo }) {
  const D = window.AKSHARA_DATA;
  const text = D.texts.find(t => t.id === textId) || D.texts.find(t => t.id === D.reader.textId);
  const toc = D.tocFor(text);
  const R = D.reader;                                   // mock verse body (sample passage)

  const [chap, setChap] = useState(chapterNo || R.chapterNo);
  const [show, setShow] = useState({ deva: true, iast: true, en: true });
  const [layout, setLayout] = useState("stacked");      // stacked | parallel
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);              // current verse index
  const [prog, setProg] = useState(0);                  // 0..1 within verse
  const [speed, setSpeed] = useState(1);
  const marked = bookmarks.has(text.id);
  const tick = useRef(null);

  const total = R.verses.length;
  const dur = 6.5;  // seconds per verse (mock)

  const idx = Math.max(0, toc.findIndex(c => c.n === chap));
  const current = toc[idx] || toc[0];
  const hasPrev = idx > 0;
  const hasNext = idx < toc.length - 1;
  const single = toc.length === 1;   // one-section works ("Complete text")

  // Reset when the route (text or chapter) changes
  useEffect(() => { setChap(chapterNo || R.chapterNo); }, [textId, chapterNo]);
  useEffect(() => { setActive(0); setProg(0); setPlaying(false); window.scrollTo({ top: 0 }); }, [chap, textId]);

  // Record reading progress for "My Library · Continue reading"
  useEffect(() => {
    try { localStorage.setItem("akshara_progress", JSON.stringify({ textId: text.id, chapterNo: chap, at: Date.now() })); } catch {}
  }, [text.id, chap]);

  function gotoChap(n) { setChap(n); }

  useEffect(() => {
    if (!playing) { clearInterval(tick.current); return; }
    const step = 0.05;
    tick.current = setInterval(() => {
      setProg(p => {
        const np = p + (step * speed) / dur;
        if (np >= 1) {
          setActive(a => {
            if (a + 1 >= total) { setPlaying(false); return a; }
            return a + 1;
          });
          return 0;
        }
        return np;
      });
    }, step * 1000);
    return () => clearInterval(tick.current);
  }, [playing, speed, total]);

  useEffect(() => {
    if (!playing) return;
    const el = document.getElementById("verse-" + active);
    if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 168; window.scrollTo({ top, behavior: "smooth" }); }
  }, [active, playing]);

  const toggle = k => setShow(s => ({ ...s, [k]: !s[k] }));
  const colCount = (show.deva ? 1 : 0) + (show.iast ? 1 : 0) + (show.en ? 1 : 0);
  const lang = React.useContext(window.LangContext);
  const sc = window.AKSHARA_SCRIPT.byCode[lang] || window.AKSHARA_SCRIPT.byCode.sa;

  function Verse({ v, i }) {
    const isActive = playing && i === active;
    const par = layout === "parallel";
    const devaEl = show.deva && (
      <Sa as="p" style={{ fontSize: par ? 23 : "clamp(1.55rem,2.1vw,1.95rem)", lineHeight: 1.7, margin: 0, color: "var(--ink)", whiteSpace: "pre-line", textAlign: par ? "left" : "center" }}>{v.deva}</Sa>
    );
    const iastEl = show.iast && (
      <p style={{ fontStyle: "normal", color: "var(--gold)", fontSize: par ? 16.5 : "clamp(1.12rem,1.45vw,1.28rem)", lineHeight: 1.6, margin: par ? 0 : "15px 0 0", whiteSpace: "pre-line", textAlign: par ? "left" : "center" }}>{v.iast}</p>
    );
    const enEl = show.en && (
      <p style={{ fontSize: par ? 17.5 : "clamp(1.15rem,1.5vw,1.32rem)", lineHeight: 1.7, margin: par ? 0 : "17px 0 0", color: "var(--ink-soft)", maxWidth: par ? "none" : 720, marginLeft: par ? 0 : "auto", marginRight: par ? 0 : "auto", textAlign: par ? "left" : "center", fontFamily: "var(--font-display)", fontWeight: 500 }}>{v.en}</p>
    );
    return (
      <div id={"verse-" + i} onClick={() => { setActive(i); setProg(0); }}
        style={{ position: "relative", padding: par ? "30px 0" : "40px 0", borderTop: i ? "1px solid var(--line-soft)" : "none", cursor: "pointer",
          background: isActive ? "color-mix(in srgb, var(--saffron) 8%, transparent)" : "transparent",
          borderRadius: isActive ? 8 : 0, transition: "background .3s", scrollMarginTop: 168 }}>
        <div style={{ position: "absolute", left: par ? 0 : "calc(50% - 380px)", top: par ? 30 : 40,
          fontFamily: "var(--font-display)", fontSize: 18, color: isActive ? "var(--maroon)" : "var(--ink-faint)", fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{chap}.{v.n}</span>
          {isActive && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--maroon)" }} className="pulse" />}
        </div>
        {par ? (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(colCount,1)}, 1fr)`, gap: 36, paddingLeft: 64 }}>
            {devaEl && <div>{devaEl}</div>}
            {iastEl && <div style={{ paddingTop: 4 }}>{iastEl}</div>}
            {enEl && <div>{enEl}</div>}
          </div>
        ) : (
          <>{devaEl}{iastEl}{enEl}</>
        )}
      </div>
    );
  }

  const toggles = [["deva", sc.native, sc.label], ["iast", "ā", "Transliteration"], ["en", "En", "Translation"]];
  const unit = D.UNIT[text.coll] || { en: "Chapter" };

  return (
    <div className="rise reader-screen" style={{ paddingBottom: 40 }}>
      {/* Chapter header */}
      <div style={{ background: "var(--paper-2)", color: "var(--ink)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: "var(--gold-bright)", opacity: 0.1 }}><Mandala size={460} /></div>
        </div>
        <div className="wrap" style={{ padding: "32px 40px 48px", position: "relative" }}>
          <button onClick={() => go("detail", { textId: text.id })} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--ink-faint)", fontSize: 14, marginBottom: 24 }}>
            <Icon name="arrowL" size={16} /> {text.title}
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 13, maxWidth: 760 }}>
              <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>
                {single ? `Complete text · ${text.verses.toLocaleString()} verses` : `${unit.en} ${chap} of ${toc.length}`}
              </span>
              <Sa as="p" style={{ fontSize: 24, color: "var(--gold-bright)", margin: 0, lineHeight: 1.45 }}>{single ? text.deva : current.deva}</Sa>
              <h1 style={{ fontSize: "clamp(2.85rem,5.05vw,4.25rem)", lineHeight: 1.08, color: "var(--ink)", background: "linear-gradient(90deg, rgba(184,134,11,0.14), rgba(184,134,11,0))", padding: "6px 16px 8px 14px", margin: "0 0 0 -14px", borderLeft: "3px solid var(--gold)" }}>{single ? text.title : current.title}</h1>
              {!single && current.gloss && <p style={{ fontStyle: "normal", color: "var(--ink-faint)", fontSize: 16, margin: 0 }}>{current.gloss}</p>}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => toggleMark(text.id)} className="btn"
                style={{ background: marked ? "var(--gold)" : "transparent", color: marked ? "var(--night)" : "var(--ink)", border: "1px solid " + (marked ? "var(--gold)" : "rgba(58,40,20,0.2)") }}>
                <Icon name={marked ? "bookmarkFill" : "bookmark"} size={17} /> {marked ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Chapter navigation row */}
          {!single && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <button onClick={() => hasPrev && gotoChap(toc[idx - 1].n)} disabled={!hasPrev}
              className="btn" style={{ background: "transparent", color: "var(--ink)", border: "1px solid rgba(58,40,20,0.2)", opacity: hasPrev ? 1 : 0.35, cursor: hasPrev ? "pointer" : "default" }}>
              <Icon name="arrowL" size={16} /> Previous
            </button>
            <ChapterMenu toc={toc} chap={chap} onPick={gotoChap} />
            <button onClick={() => hasNext && gotoChap(toc[idx + 1].n)} disabled={!hasNext}
              className="btn" style={{ background: "transparent", color: "var(--ink)", border: "1px solid rgba(58,40,20,0.2)", opacity: hasNext ? 1 : 0.35, cursor: hasNext ? "pointer" : "default" }}>
              Next <Icon name="arrowR" size={16} />
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Reader toolbar — recitation player + display controls, pinned at top */}
      <div style={{ position: "sticky", top: "var(--header-h)", zIndex: 30, background: "var(--paper-2)", color: "var(--ink)", borderBottom: "1px solid var(--line)" }}>
        {/* progress hairline */}
        <div style={{ height: 3, background: "rgba(58,40,20,0.12)" }}>
          <div style={{ height: "100%", width: `${((active + prog) / total) * 100}%`, background: "var(--gold-bright)", transition: "width .1s linear" }} />
        </div>
        <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 40px", flexWrap: "wrap" }}>
          {/* Recitation group */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            <button onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause recitation" : "Play recitation"}
              style={{ width: 52, height: 52, borderRadius: "50%", flex: "none", border: 0, background: "var(--gold-bright)", color: "var(--night)", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Icon name={playing ? "pause" : "play"} size={24} />
            </button>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, whiteSpace: "nowrap" }}>{playing ? "Reciting" : "Listen"} · Verse {chap}.{R.verses[active].n}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>{unit.en} {chap} · classical svara</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <button onClick={() => { setActive(a => Math.max(0, a - 1)); setProg(0); }} aria-label="Previous verse" style={{ background: "none", border: 0, color: "var(--ink)", padding: 8, cursor: "pointer" }}><Icon name="arrowL" size={20} /></button>
              <button onClick={() => { setActive(a => Math.min(total - 1, a + 1)); setProg(0); }} aria-label="Next verse" style={{ background: "none", border: 0, color: "var(--ink)", padding: 8, cursor: "pointer" }}><Icon name="arrowR" size={20} /></button>
            </div>
            <SpeedControl speed={speed} setSpeed={setSpeed} />
          </div>

          <div style={{ flex: 1, minWidth: 20 }} />

          {/* Display group */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 7 }}>
              {toggles.map(([k, glyph, label]) => (
                <button key={k} onClick={() => toggle(k)} title={label}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999, fontSize: 13.5, cursor: "pointer",
                    border: "1px solid " + (show[k] ? "var(--gold)" : "rgba(58,40,20,0.2)"),
                    background: show[k] ? "var(--gold)" : "transparent", color: show[k] ? "var(--night)" : "var(--ink-faint)",
                    fontFamily: k === "deva" ? `var(--font-${sc.font})` : "var(--font-body)" }}>
                  <span style={{ fontStyle: k === "iast" ? "normal" : "normal", fontSize: k === "deva" ? 15 : undefined }}>{glyph}</span> <span style={{ fontSize: 13, fontFamily: "var(--font-body)" }}>{label}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", background: "rgba(58,40,20,0.05)", border: "1px solid rgba(58,40,20,0.15)", borderRadius: 999, padding: 3 }}>
              {[["stacked", "Stacked"], ["parallel", "Parallel"]].map(([v, l]) => (
                <button key={v} onClick={() => setLayout(v)}
                  style={{ padding: "7px 15px", borderRadius: 999, border: 0, fontSize: 13.5, fontFamily: "var(--font-body)", cursor: "pointer",
                    background: layout === v ? "var(--gold)" : "transparent", color: layout === v ? "var(--night)" : "var(--ink-faint)" }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verses */}
      <div className="wrap" style={{ maxWidth: layout === "parallel" ? 1180 : 880, padding: "26px 40px 60px" }}>
        {R.verses.map((v, i) => <Verse key={v.n} v={v} i={i} />)}
        <div className="ornament" style={{ marginTop: 50 }}><Lotus size={22} color="var(--gold)" /></div>
        <p style={{ textAlign: "center", color: "var(--ink-faint)", fontStyle: "normal", marginTop: 24, fontSize: 15 }}>
          Selected verses · {text.title}, {unit.en} {chap}
        </p>
        {/* Chapter pager footer */}
        {single ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
            <button onClick={() => go("detail", { textId: text.id })} className="btn btn-primary">
              Back to {text.title} <Icon name="arrowR" size={16} />
            </button>
          </div>
        ) : (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
          <button onClick={() => hasPrev && gotoChap(toc[idx - 1].n)} disabled={!hasPrev} className="btn btn-ghost" style={{ opacity: hasPrev ? 1 : 0.35, cursor: hasPrev ? "pointer" : "default" }}>
            <Icon name="arrowL" size={16} /> {hasPrev ? toc[idx - 1].title : "Beginning"}
          </button>
          <button onClick={() => hasNext ? gotoChap(toc[idx + 1].n) : go("detail", { textId: text.id })} className="btn btn-primary">
            {hasNext ? toc[idx + 1].title : "Back to contents"} <Icon name="arrowR" size={16} />
          </button>
        </div>
        )}
      </div>

    </div>
  );
}

Object.assign(window, { ReaderScreen, ChapterMenu });

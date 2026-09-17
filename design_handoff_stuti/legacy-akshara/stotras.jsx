/* ============================================================
   AKSHARA — Stotras
   Landing = a directory: hero + today's deity + deity grid +
   "most loved" row. Each deity opens its OWN library page
   (DeityScreen) built to hold 70–80 hymns: search-within-deity,
   type filters (Aṣṭakam · Sahasranāma · Kavacam …), sort, list/
   grid density, and the night-band recite bar from the Reader.
   ============================================================ */

/* ---------- Speaker labels (the "uvāca" lines) in Devanagari ----------
   The verses carry their speaker only in IAST; this map gives each one a
   Devanagari form so <Sa> can transliterate it into the active script
   (Telugu, Kannada, …) alongside the verse. */
const VSN_SPEAKER_DEVA = {
  "Śrī Vaiśampāyana uvāca": "श्रीवैशम्पायन उवाच",
  "Yudhiṣṭhira uvāca":      "युधिष्ठिर उवाच",
  "Śrī Bhīṣma uvāca":       "श्रीभीष्म उवाच",
  "Arjuna uvāca":           "अर्जुन उवाच",
  "Śrī Bhagavān uvāca":     "श्रीभगवानुवाच",
  "Vyāsa uvāca":            "व्यास उवाच",
  "Pārvaty uvāca":          "पार्वत्युवाच",
  "Īśvara uvāca":           "ईश्वर उवाच",
  "Brahmovāca":             "ब्रह्मोवाच",
  "Sañjaya uvāca":          "सञ्जय उवाच",
};

/* ---------- Shared recitation engine (mock audio, like the Reader) ---------- */
function useRecite(list) {
  const [now, setNow] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [prog, setProg] = useState(0);
  const tick = useRef(null);
  const ids = list.map(s => s.id);

  function stepTo(dir) {
    const i = ids.indexOf(now);
    const ni = i + dir;
    if (ni < 0 || ni >= ids.length) { setPlaying(false); return; }
    setNow(ids[ni]); setProg(0); setPlaying(true);
  }
  useEffect(() => {
    if (!playing || !now) { clearInterval(tick.current); return; }
    const dur = 9, step = 0.05;
    tick.current = setInterval(() => {
      setProg(p => { const np = p + (step * speed) / dur; if (np >= 1) { stepTo(1); return 0; } return np; });
    }, step * 1000);
    return () => clearInterval(tick.current);
  }, [playing, now, speed, ids.join(",")]);

  function play(id) { if (now === id) { setPlaying(p => !p); return; } setNow(id); setPlaying(true); setProg(0); }
  function close() { setNow(null); setPlaying(false); }
  return { now, playing, speed, prog, setPlaying, setSpeed, play, stepTo, close };
}

/* ---------- Deity medallion → opens that deity's library ---------- */
function DeityMedallion({ d, count, onClick }) {
  return (
    <button onClick={onClick} className="coll-card"
      style={{ textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)",
        padding: "22px 22px 20px", position: "relative", overflow: "hidden", color: "var(--ink)",
        transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease" }}>
      <div style={{ position: "absolute", right: -30, bottom: -30, color: "var(--gold)", opacity: 0.13 }}><Mandala size={130} /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
        <div style={{ width: 52, height: 52, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
          border: "1.5px solid var(--gold)", color: "var(--maroon)", background: "var(--paper)" }}>
          <Sa as="span" style={{ fontSize: 24, lineHeight: 1 }}>{d.seed}</Sa>
        </div>
        <div style={{ minWidth: 0 }}>
          <Sa as="div" style={{ fontSize: 18, color: "var(--maroon)", lineHeight: 1.5 }}>{d.deva}</Sa>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, lineHeight: 1.1, marginTop: 3 }}>{d.name}</div>
        </div>
      </div>
      <div style={{ fontStyle: "normal", fontSize: 13.5, color: "var(--ink-faint)", marginTop: 13, position: "relative" }}>{d.epithet}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, position: "relative" }}>
        <span style={{ fontSize: 12.5, letterSpacing: "0.07em", color: "var(--saffron)", fontWeight: 500 }}>{count} stotras</span>
        <span className="chap-arrow" style={{ color: "var(--maroon)", display: "flex" }}><Icon name="arrowR" size={16} /></span>
      </div>
    </button>
  );
}

/* ---------- One stotra — grid card or compact list row ---------- */
function StotraCard({ s, deity, marked, toggleMark, fav, toggleFav, isPlaying, onPlay, onOpen, view = "grid" }) {
  if (view === "list") {
    return (
      <div className="text-card-list" onClick={() => onOpen && onOpen(s.id)}
        style={{ display: "flex", gap: 18, alignItems: "center", padding: "15px 20px",
          background: isPlaying ? "color-mix(in srgb, var(--saffron) 9%, var(--paper-2))" : "var(--paper-2)",
          border: "1px solid " + (isPlaying ? "var(--gold)" : "var(--line)"), borderRadius: "var(--radius)", cursor: "pointer",
          transition: "border-color .18s, background .18s" }}>
        <button onClick={(e) => { e.stopPropagation(); onPlay(s.id); }}
          style={{ width: 42, height: 42, flex: "none", borderRadius: "50%", border: "1px solid " + (isPlaying ? "var(--maroon)" : "var(--gold)"),
            background: isPlaying ? "var(--maroon)" : "transparent", color: isPlaying ? "var(--on-night)" : "var(--maroon)", display: "grid", placeItems: "center" }}>
          <Icon name={isPlaying ? "pause" : "play"} size={17} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18.5, fontWeight: 600, lineHeight: 1.25 }}>{s.title}</div>
          <div style={{ marginTop: 3, display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <Sa as="span" style={{ color: "var(--maroon)", fontSize: 15, lineHeight: 1.4 }}>{s.deva}</Sa>
            <span style={{ fontSize: 12.5, color: "var(--ink-faint)", fontStyle: "normal" }}>{deity && s.form && s.form !== deity.name ? s.form + " · " : ""}{s.by}</span>
          </div>
        </div>
        <span className="type-pill" style={{ flex: "none", fontSize: 11.5, letterSpacing: "0.04em", color: "var(--saffron)", border: "1px solid var(--line)", borderRadius: 999, padding: "4px 11px", background: "var(--paper)" }}>{s.type}</span>
        <span className="stotra-verses" style={{ flex: "none", fontSize: 13, color: "var(--ink-faint)", width: 76, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{s.verses.toLocaleString()} {s.verses === 1 ? "verse" : "verses"}</span>
        <span className="chap-arrow" style={{ flex: "none", color: "var(--ink-faint)", display: "flex" }}><Icon name="arrowR" size={16} /></span>
        <div style={{ display: "flex", flex: "none", gap: 2 }}>
          {toggleFav && (
            <button onClick={(e) => { e.stopPropagation(); toggleFav(s.id); }} title={fav ? "In your daily recitation" : "Add to daily recitation"}
              style={{ background: "none", border: 0, color: fav ? "var(--saffron)" : "var(--ink-faint)", padding: 4 }}>
              <Icon name={fav ? "flameFill" : "flame"} size={18} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); toggleMark(s.id); }} title={marked ? "Saved" : "Save"}
            style={{ background: "none", border: 0, color: marked ? "var(--maroon)" : "var(--ink-faint)", padding: 4 }}>
            <Icon name={marked ? "bookmarkFill" : "bookmark"} size={18} />
          </button>
        </div>
      </div>
    );
  }
  // grid card
  return (
    <div className="text-card" onClick={() => onOpen && onOpen(s.id)} style={{ display: "flex", flexDirection: "column", background: "var(--paper-2)",
      border: "1px solid " + (isPlaying ? "var(--gold)" : "var(--line)"), borderRadius: "var(--radius)",
      padding: "22px 24px 20px", position: "relative", overflow: "hidden", cursor: "pointer",
      boxShadow: isPlaying ? "var(--shadow-soft)" : "none", transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 12, letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--saffron)", fontWeight: 500 }}>
          {deity && s.form && s.form !== deity.name ? s.form : (deity ? deity.name : "Stotra")} · <span style={{ textTransform: "none", letterSpacing: "0.02em", color: "var(--ink-faint)" }}>{s.type}</span>
        </span>
        <div style={{ display: "flex", gap: 8, marginTop: -1 }}>
          {toggleFav && (
            <button onClick={(e) => { e.stopPropagation(); toggleFav(s.id); }} title={fav ? "In your daily recitation" : "Add to daily recitation"}
              style={{ background: "none", border: 0, color: fav ? "var(--saffron)" : "var(--ink-faint)", padding: 0 }}>
              <Icon name={fav ? "flameFill" : "flame"} size={18} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); toggleMark(s.id); }} style={{ background: "none", border: 0, color: marked ? "var(--maroon)" : "var(--ink-faint)", padding: 0 }}>
            <Icon name={marked ? "bookmarkFill" : "bookmark"} size={18} />
          </button>
        </div>
      </div>
      <Sa as="div" style={{ fontSize: 24, color: "var(--maroon)", lineHeight: 1.25, marginTop: 14 }}>{s.deva}</Sa>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 600, marginTop: 4, lineHeight: 1.1 }}>{s.title}</div>
      {s.incipit && (
        <div style={{ margin: "15px 0 0", paddingLeft: 14, borderLeft: "2px solid var(--line)" }}>
          <Sa as="p" style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>{s.incipit.deva}</Sa>
          <p style={{ fontStyle: "normal", color: "var(--gold)", fontSize: 13.5, lineHeight: 1.5, margin: "5px 0 0" }}>{s.incipit.iast}</p>
        </div>
      )}
      <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "14px 0 18px", flex: 1 }}>{s.blurb}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 15, borderTop: "1px solid var(--line-soft)" }}>
        <button onClick={(e) => { e.stopPropagation(); onPlay(s.id); }} className="btn"
          style={{ padding: "9px 18px", background: isPlaying ? "var(--maroon)" : "transparent", color: isPlaying ? "var(--on-night)" : "var(--maroon)",
            border: "1px solid " + (isPlaying ? "var(--maroon)" : "var(--gold)"), fontSize: 14 }}>
          <Icon name={isPlaying ? "pause" : "play"} size={16} /> {isPlaying ? "Reciting" : "Recite"}
        </button>
        <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{s.verses.toLocaleString()} {s.verses === 1 ? "verse" : "verses"}</span>
        <span style={{ marginLeft: "auto", color: "var(--maroon)", display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 500 }}>Read <Icon name="arrowR" size={15} /></span>
      </div>
    </div>
  );
}

/* ---------- Fixed recite bar (Reader vocabulary) ---------- */
function ReciteBar({ stotra, deity, playing, setPlaying, speed, setSpeed, prog, onStep, onClose }) {
  return (
    <div className="recite-bar" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, background: "var(--night)", color: "var(--on-night)", borderTop: "1px solid rgba(240,228,204,0.14)" }}>
      <div style={{ height: 3, background: "rgba(240,228,204,0.12)" }}>
        <div style={{ height: "100%", width: `${prog * 100}%`, background: "var(--gold-bright)", transition: "width .1s linear" }} />
      </div>
      <div className="wrap recite-row" style={{ display: "flex", alignItems: "center", gap: 18, padding: "13px 40px" }}>
        <button onClick={() => setPlaying(p => !p)} style={{ width: 46, height: 46, borderRadius: "50%", flex: "none", border: 0, background: "var(--gold-bright)", color: "var(--night)", display: "grid", placeItems: "center" }}>
          <Icon name={playing ? "pause" : "play"} size={21} />
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Reciting · {stotra.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--on-night-soft)" }}>{deity ? deity.name : ""} · {stotra.by} · {stotra.verses.toLocaleString()} {stotra.verses === 1 ? "verse" : "verses"}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => onStep(-1)} title="Previous" style={{ background: "none", border: 0, color: "var(--on-night)", padding: 8 }}><Icon name="arrowL" size={20} /></button>
          <button onClick={() => onStep(1)} title="Next" style={{ background: "none", border: 0, color: "var(--on-night)", padding: 8 }}><Icon name="arrowR" size={20} /></button>
        </div>
        <SpeedControl speed={speed} setSpeed={setSpeed} />
        <button onClick={onClose} title="Close" style={{ background: "none", border: 0, color: "var(--on-night-soft)", padding: 8 }}><Icon name="close" size={19} /></button>
      </div>
    </div>
  );
}

/* ---------- Today's deity ribbon (bridge from the pañcāṅga) ---------- */
function TodayDeityBanner({ go }) {
  const D = window.AKSHARA_DATA;
  const day = new Date().getDay();
  const vara = window.AKSHARA_PANCHANGA.VARA[day];
  const deity = D.deities.find(x => x.id === D.weekdayDeity[day]);
  const n = D.stotras.filter(s => s.deity === deity.id).length;
  return (
    <button className="today-deity-banner" onClick={() => go("deity", { deity: deity.id })}
      style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap",
        background: "var(--night)", color: "var(--on-night)", border: 0, borderRadius: "var(--radius)", padding: "22px 26px", position: "relative", overflow: "hidden", cursor: "pointer" }}>
      <div style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.14 }}><Mandala size={220} /></div>
      <div className="tdb-seed" style={{ width: 60, height: 60, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold-bright)", color: "var(--gold-bright)" }}>
        <Sa as="span" style={{ fontSize: 28, lineHeight: 1 }}>{deity.seed}</Sa>
      </div>
      <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
        <div className="eyebrow" style={{ color: "var(--gold-bright)" }}>Today · {vara.en} · <Sa as="span">{vara.deva}</Sa></div>
        <div className="tdb-title" style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, marginTop: 6, color: "var(--on-night)" }}>{vara.en} belongs to {deity.name}</div>
        <div className="tdb-note" style={{ fontSize: 14.5, color: "var(--on-night-soft)", marginTop: 3 }}>{deity.note}</div>
      </div>
      <span className="btn tdb-cta" style={{ background: "var(--gold-bright)", color: "var(--night)", border: 0, position: "relative", whiteSpace: "nowrap" }}>
        Open {deity.name}'s {n} stotras <Icon name="arrowR" size={16} />
      </span>
    </button>
  );
}

/* ---------- Drag-to-reorder (pointer-based, mouse + touch) ----------
   DOM order stays fixed during the drag; we measure each row's midpoint and
   draw an insertion marker at the target slot, committing the new order only
   on drop. axis "y" for stacked lists, "x" for the horizontal mālā rail. */
function useFavReorder(order, onChange, axis = "y") {
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);
  const wrapRef = useRef(null);
  const overRef = useRef(null);
  const begin = (e, id) => {
    if (e.button != null && e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    setDragId(id);
    const start = order.indexOf(id);
    overRef.current = start; setOver(start);
    const move = (ev) => {
      const wrap = wrapRef.current; if (!wrap) return;
      const rows = [...wrap.querySelectorAll("[data-fav-row]")];
      const pos = axis === "x" ? ev.clientX : ev.clientY;
      let idx = rows.length;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i].getBoundingClientRect();
        const mid = axis === "x" ? r.left + r.width / 2 : r.top + r.height / 2;
        if (pos < mid) { idx = i; break; }
      }
      if (idx !== overRef.current) { overRef.current = idx; setOver(idx); }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const from = order.indexOf(id);
      const to = overRef.current == null ? from : overRef.current;
      const next = order.slice();
      next.splice(from, 1);
      next.splice(Math.max(0, Math.min(next.length, to > from ? to - 1 : to)), 0, id);
      setDragId(null); setOver(null); overRef.current = null;
      if (next.some((x, i) => x !== order[i])) onChange(next);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return { dragId, over, wrapRef, begin };
}

// quick syllable-ish estimate so we can show an honest "~N min" for the queue
function favMinutes(list) {
  // recitation engine paces ~ per verse; ~7s/verse, floored per hymn
  const secs = list.reduce((t, s) => t + Math.max(40, (s.verses || 1) * 7), 0);
  return Math.max(1, Math.round(secs / 60));
}

/* ============================================================
   Daily recitation — the favorites queue, pinned atop the page.
   Three switchable layouts (Tweak → favStyle): playlist · mālā · night.
   ============================================================ */
function EmptyDaily({ variant }) {
  const night = variant === "night";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
      background: night ? "var(--night)" : "var(--paper-2)", color: night ? "var(--on-night)" : "var(--ink)",
      border: night ? "0" : "1px dashed var(--gold)", borderRadius: "var(--radius)", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
      {night && <div style={{ position: "absolute", right: -30, top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.12 }}><Mandala size={180} /></div>}
      <div style={{ width: 46, height: 46, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
        border: "1.5px solid " + (night ? "var(--gold-bright)" : "var(--gold)"), color: night ? "var(--gold-bright)" : "var(--saffron)" }}>
        <Icon name="flame" size={22} />
      </div>
      <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
        <div className="eyebrow" style={{ color: night ? "var(--gold-bright)" : "var(--saffron)" }}>Daily recitation · <Sa as="span">नित्य पाठ</Sa></div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, marginTop: 5, color: night ? "var(--on-night)" : "var(--ink)" }}>Build your daily sequence</div>
        <p style={{ fontSize: 14.5, color: night ? "var(--on-night-soft)" : "var(--ink-soft)", lineHeight: 1.6, margin: "5px 0 0", maxWidth: 520 }}>
          Tap the <Icon name="flame" size={14} /> lamp on any stotra to add it here — then begin them all in one tap, in the order you recite each day.
        </p>
      </div>
    </div>
  );
}

function DailyRecitations({ variant, favStotras, favorites, reorderFav, toggleFav, favRec, onPlay, go, deities }) {
  const axis = variant === "mala" ? "x" : "y";
  const { dragId, over, wrapRef, begin } = useFavReorder(favorites, reorderFav, axis);
  const ids = favStotras.map(s => s.id);
  const deityOf = id => deities.find(d => d.id === id);

  if (favStotras.length === 0) return <EmptyDaily variant={variant} />;

  const activeInFav = favRec.now && ids.includes(favRec.now);
  const beginPlaying = activeInFav && favRec.playing;
  const onBegin = () => { if (activeInFav) favRec.setPlaying(p => !p); else onPlay(ids[0]); };
  const mins = favMinutes(favStotras);
  const eyebrow = <span className="eyebrow" style={{ color: "var(--saffron)" }}>Daily recitation · <Sa as="span">नित्य पाठ</Sa></span>;

  // ============ Variant: NIGHT — ceremonial dark band ============
  if (variant === "night") {
    const Marker = () => <div data-fav-marker style={{ height: 2, background: "var(--gold-bright)", borderRadius: 2, margin: "1px 0" }} />;
    const rows = [];
    favStotras.forEach((s, i) => {
      const playing = favRec.now === s.id && favRec.playing;
      const isNow = favRec.now === s.id;
      if (dragId && over === i) rows.push(<Marker key={"m" + i} />);
      rows.push(
        <div key={s.id} data-fav-row onClick={() => go("stotraReader", { id: s.id })}
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", cursor: "pointer", borderRadius: 8,
            opacity: dragId === s.id ? 0.35 : 1, background: isNow ? "rgba(240,228,204,0.08)" : "transparent",
            border: "1px solid " + (isNow ? "rgba(240,228,204,0.22)" : "transparent"), transition: "background .2s" }}>
          <button onPointerDown={(e) => begin(e, s.id)} onClick={(e) => e.stopPropagation()} title="Drag to reorder"
            style={{ flex: "none", background: "none", border: 0, color: "var(--on-night-soft)", padding: 2, cursor: "grab", touchAction: "none" }}><Icon name="grip" size={18} /></button>
          <span style={{ flex: "none", width: 26, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--gold-bright)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17.5, fontWeight: 600, color: "var(--on-night)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
            <div style={{ fontSize: 12.5, color: "var(--on-night-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{(deityOf(s.deity) || {}).name} · {s.type}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onPlay(s.id); }} title={playing ? "Pause" : "Recite"}
            style={{ flex: "none", width: 38, height: 38, borderRadius: "50%", border: "1px solid " + (isNow ? "var(--gold-bright)" : "rgba(240,228,204,0.3)"),
              background: playing ? "var(--gold-bright)" : "transparent", color: playing ? "var(--night)" : "var(--gold-bright)", display: "grid", placeItems: "center" }}>
            <Icon name={playing ? "pause" : "play"} size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); toggleFav(s.id); }} title="Remove from daily"
            style={{ flex: "none", background: "none", border: 0, color: "var(--gold-bright)", padding: 4 }}><Icon name="flameFill" size={17} /></button>
        </div>
      );
    });
    if (dragId && over === favStotras.length) rows.push(<Marker key="mEnd" />);
    return (
      <div style={{ background: "var(--night)", color: "var(--on-night)", borderRadius: "var(--radius)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-6%", top: -40, color: "var(--gold-bright)", opacity: 0.1, pointerEvents: "none" }}><Mandala size={300} spin /></div>
        <div style={{ padding: "26px 28px 10px", position: "relative", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            {eyebrow}
            <div style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, marginTop: 6 }}>Your daily sequence</div>
            <div style={{ fontSize: 13.5, color: "var(--on-night-soft)", marginTop: 3 }}>{favStotras.length} {favStotras.length === 1 ? "stotra" : "stotras"} · about {mins} min · in your order</div>
          </div>
          <button onClick={onBegin} className="btn" style={{ background: "var(--gold-bright)", color: "var(--night)", border: 0, fontSize: 15, padding: "12px 22px" }}>
            <Icon name={beginPlaying ? "pause" : "play"} size={18} /> {beginPlaying ? "Pause" : (activeInFav ? "Resume" : "Begin recitation")}
          </button>
        </div>
        <div ref={wrapRef} style={{ padding: "4px 18px 22px", position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>{rows}</div>
      </div>
    );
  }

  // ============ Variant: MĀLĀ — horizontal bead rail ============
  if (variant === "mala") {
    const Marker = () => <div data-fav-marker style={{ width: 2, alignSelf: "stretch", background: "var(--saffron)", borderRadius: 2, flex: "none" }} />;
    const beads = [];
    favStotras.forEach((s, i) => {
      const d = deityOf(s.deity) || {};
      const playing = favRec.now === s.id && favRec.playing;
      const isNow = favRec.now === s.id;
      if (dragId && over === i) beads.push(<Marker key={"m" + i} />);
      beads.push(
        <div key={s.id} data-fav-row onClick={() => go("stotraReader", { id: s.id })}
          style={{ flex: "none", width: 168, scrollSnapAlign: "start", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8,
            padding: "18px 14px 14px", borderRadius: 14, cursor: "pointer", position: "relative", opacity: dragId === s.id ? 0.35 : 1,
            background: isNow ? "color-mix(in srgb, var(--saffron) 10%, var(--paper-2))" : "var(--paper-2)",
            border: "1px solid " + (isNow ? "var(--gold)" : "var(--line)"), transition: "border-color .2s, background .2s" }}>
          <button onPointerDown={(e) => begin(e, s.id)} onClick={(e) => e.stopPropagation()} title="Drag to reorder"
            style={{ position: "absolute", top: 8, left: 8, background: "none", border: 0, color: "var(--ink-faint)", padding: 2, cursor: "grab", touchAction: "none" }}><Icon name="grip" size={16} /></button>
          <button onClick={(e) => { e.stopPropagation(); toggleFav(s.id); }} title="Remove from daily"
            style={{ position: "absolute", top: 8, right: 8, background: "none", border: 0, color: "var(--saffron)", padding: 2 }}><Icon name="flameFill" size={15} /></button>
          <div style={{ width: 56, height: 56, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
            border: "1.5px solid var(--gold)", color: "var(--maroon)", background: "var(--paper)", position: "relative" }}>
            <Sa as="span" style={{ fontSize: 24, lineHeight: 1 }}>{d.seed}</Sa>
            <span style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "var(--maroon)", color: "var(--on-night)", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, display: "grid", placeItems: "center" }}>{i + 1}</span>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, lineHeight: 1.25, color: "var(--ink)" }}>{s.title}</div>
          <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{d.name} · {s.type}</div>
          <button onClick={(e) => { e.stopPropagation(); onPlay(s.id); }}
            style={{ marginTop: 2, width: 38, height: 38, borderRadius: "50%", border: "1px solid " + (isNow ? "var(--maroon)" : "var(--gold)"),
              background: playing ? "var(--maroon)" : "transparent", color: playing ? "var(--on-night)" : "var(--maroon)", display: "grid", placeItems: "center" }}>
            <Icon name={playing ? "pause" : "play"} size={16} />
          </button>
        </div>
      );
    });
    if (dragId && over === favStotras.length) beads.push(<Marker key="mEnd" />);
    return (
      <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "22px 0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", padding: "0 24px 16px" }}>
          <div style={{ width: 44, height: 44, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold)", color: "var(--saffron)" }}><Icon name="flame" size={21} /></div>
          <div style={{ flex: 1, minWidth: 180 }}>
            {eyebrow}
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, marginTop: 4 }}>Your daily mālā</div>
            <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{favStotras.length} {favStotras.length === 1 ? "bead" : "beads"} · about {mins} min · drag to re-thread</div>
          </div>
          <button onClick={onBegin} className="btn" style={{ background: beginPlaying ? "var(--maroon)" : "var(--maroon)", color: "var(--on-night)", border: 0, fontSize: 14.5, padding: "11px 20px" }}>
            <Icon name={beginPlaying ? "pause" : "play"} size={17} /> {beginPlaying ? "Pause" : (activeInFav ? "Resume" : "Begin")}
          </button>
        </div>
        <div ref={wrapRef} className="fav-rail" style={{ display: "flex", alignItems: "stretch", gap: 12, padding: "4px 24px 6px", overflowX: "auto", scrollSnapType: "x mandatory" }}>{beads}</div>
      </div>
    );
  }

  // ============ Variant: PLAYLIST — numbered list (default) ============
  const Marker = () => <div data-fav-marker style={{ height: 2, background: "var(--saffron)", borderRadius: 2, margin: "1px 8px" }} />;
  const rows = [];
  favStotras.forEach((s, i) => {
    const d = deityOf(s.deity) || {};
    const playing = favRec.now === s.id && favRec.playing;
    const isNow = favRec.now === s.id;
    if (dragId && over === i) rows.push(<Marker key={"m" + i} />);
    rows.push(
      <div key={s.id} data-fav-row onClick={() => go("stotraReader", { id: s.id })}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", cursor: "pointer", borderRadius: 10,
          opacity: dragId === s.id ? 0.35 : 1,
          background: isNow ? "color-mix(in srgb, var(--saffron) 9%, var(--paper))" : "var(--paper)",
          border: "1px solid " + (isNow ? "var(--gold)" : "var(--line-soft)"), transition: "background .2s, border-color .2s" }}>
        <button onPointerDown={(e) => begin(e, s.id)} onClick={(e) => e.stopPropagation()} title="Drag to reorder"
          style={{ flex: "none", background: "none", border: 0, color: "var(--ink-faint)", padding: 2, cursor: "grab", touchAction: "none" }}><Icon name="grip" size={18} /></button>
        <span style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid var(--gold)", color: "var(--maroon)", fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17.5, fontWeight: 600, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name} · {s.type} · {s.verses} {s.verses === 1 ? "verse" : "verses"}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onPlay(s.id); }} title={playing ? "Pause" : "Recite"}
          style={{ flex: "none", width: 40, height: 40, borderRadius: "50%", border: "1px solid " + (isNow ? "var(--maroon)" : "var(--gold)"),
            background: playing ? "var(--maroon)" : "transparent", color: playing ? "var(--on-night)" : "var(--maroon)", display: "grid", placeItems: "center" }}>
          <Icon name={playing ? "pause" : "play"} size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleFav(s.id); }} title="Remove from daily"
          style={{ flex: "none", background: "none", border: 0, color: "var(--saffron)", padding: 4 }}><Icon name="flameFill" size={17} /></button>
      </div>
    );
  });
  if (dragId && over === favStotras.length) rows.push(<Marker key="mEnd" />);
  return (
    <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "22px 22px 18px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold)", color: "var(--saffron)" }}><Icon name="flame" size={21} /></div>
        <div style={{ flex: 1, minWidth: 180 }}>
          {eyebrow}
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, marginTop: 4 }}>Your daily recitation</div>
          <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{favStotras.length} {favStotras.length === 1 ? "stotra" : "stotras"} · about {mins} min · drag to reorder</div>
        </div>
        <button onClick={onBegin} className="btn" style={{ background: "var(--maroon)", color: "var(--on-night)", border: 0, fontSize: 14.5, padding: "11px 20px" }}>
          <Icon name={beginPlaying ? "pause" : "play"} size={17} /> {beginPlaying ? "Pause" : (activeInFav ? "Resume" : "Begin all")}
        </button>
      </div>
      <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", gap: 6 }}>{rows}</div>
    </div>
  );
}

/* ============================================================
   Landing — the stotra directory
   ============================================================ */
function StotrasScreen({ go, bookmarks, toggleMark, favorites = [], toggleFav, reorderFav, favStyle = "playlist" }) {
  const D = window.AKSHARA_DATA;
  const { deities, stotras } = D;
  const popular = stotras.filter(s => s.popular);
  const savedStotras = stotras.filter(s => bookmarks.has(s.id));
  const favStotras = favorites.map(id => stotras.find(s => s.id === id)).filter(Boolean);
  const favSet = new Set(favorites);

  // Two recitation engines: one scoped to the daily queue (plays through the
  // favorites in order, stops at the end), one for the saved/popular cards.
  // Only one bottom bar shows at a time — starting one closes the other.
  const favRec = useRecite(favStotras);
  const rec = useRecite([...savedStotras, ...popular.filter(s => !bookmarks.has(s.id))]);
  const playFav = (id) => { rec.close(); favRec.play(id); };
  const playOther = (id) => { favRec.close(); rec.play(id); };
  const countFor = id => stotras.filter(s => s.deity === id).length;
  const barOpen = !!(favRec.now || rec.now);

  return (
    <div className="rise" style={{ paddingBottom: barOpen ? 120 : 60 }}>
      <div className="wrap" style={{ padding: "52px 40px 0" }}>
        <span className="eyebrow">Stotras · <Sa as="span">स्तोत्र</Sa></span>
        <h1 style={{ fontSize: "clamp(2.4rem,4vw,3.4rem)", margin: "12px 0 0" }}>Hymns of praise, by deity</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 17, maxWidth: 640, marginTop: 14 }}>
          A library in itself — hundreds of devotional hymns for recitation and listening. Choose a deity to enter their collection, or follow the day.
        </p>
      </div>

      {/* Daily recitation — favorites queue, pinned at the very top */}
      <div className="wrap" style={{ padding: "26px 40px 0" }}>
        <DailyRecitations variant={favStyle} favStotras={favStotras} favorites={favorites}
          reorderFav={reorderFav} toggleFav={toggleFav} favRec={favRec} onPlay={playFav} go={go} deities={deities} />
      </div>

      {/* Today's deity */}
      <div className="wrap" style={{ padding: "26px 40px 0" }}><TodayDeityBanner go={go} /></div>

      {/* Your saved stotras — bookmark-driven, distinct from the daily queue */}
      {savedStotras.length > 0 && (
      <div className="wrap" style={{ padding: "42px 40px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
          <Icon name="bookmarkFill" size={18} color="var(--maroon)" />
          <span className="eyebrow">Your saved stotras</span>
          <span style={{ marginLeft: "auto", fontSize: 13.5, color: "var(--ink-faint)" }}>{savedStotras.length} saved</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {savedStotras.map(s => (
            <StotraCard key={s.id} s={s} deity={deities.find(d => d.id === s.deity)} marked={true} toggleMark={toggleMark} fav={favSet.has(s.id)} toggleFav={toggleFav} view="list" isPlaying={rec.now === s.id && rec.playing} onPlay={playOther} onOpen={(id) => go("stotraReader", { id })} />
          ))}
        </div>
      </div>
      )}

      {/* Deity grid */}
      <div className="wrap" style={{ padding: "42px 40px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <span className="eyebrow">Choose a deity</span>
          <span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>{stotras.length} stotras · {deities.length} deities</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px,1fr))", gap: 16 }}>
          {deities.map(d => <DeityMedallion key={d.id} d={d} count={countFor(d.id)} onClick={() => go("deity", { deity: d.id })} />)}
        </div>
        <div className="ornament" style={{ marginTop: 56 }}><Lotus size={20} color="var(--gold)" /></div>
      </div>

      {favRec.now ? (() => { const ns = favStotras.find(s => s.id === favRec.now); return ns ? (
        <ReciteBar stotra={ns} deity={deities.find(d => d.id === ns.deity)} playing={favRec.playing} setPlaying={favRec.setPlaying} speed={favRec.speed} setSpeed={favRec.setSpeed} prog={favRec.prog} onStep={favRec.stepTo} onClose={favRec.close} />
      ) : null; })() : rec.now ? (() => { const ns = stotras.find(s => s.id === rec.now); return (
        <ReciteBar stotra={ns} deity={deities.find(d => d.id === ns.deity)} playing={rec.playing} setPlaying={rec.setPlaying} speed={rec.speed} setSpeed={rec.setSpeed} prog={rec.prog} onStep={rec.stepTo} onClose={rec.close} />
      ); })() : null}
    </div>
  );
}

/* ============================================================
   DeityScreen — one deity's full library (built for 70–80 hymns)
   ============================================================ */
function DeityScreen({ go, bookmarks, toggleMark, favorites = [], toggleFav, deity }) {
  const D = window.AKSHARA_DATA;
  const dd = D.deities.find(x => x.id === deity) || D.deities[0];
  const all = D.stotras.filter(s => s.deity === dd.id);
  const favSet = new Set(favorites);

  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [form, setForm] = useState("all");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState("list");
  const isMobile = useIsMobile();
  const [filterSheet, setFilterSheet] = useState(false);

  useEffect(() => { setType("all"); setForm("all"); setQ(""); }, [dd.id]);

  // types present for this deity, in canonical order
  const present = D.stotraTypes.filter(t => all.some(s => s.type === t));
  const typeChips = ["all", ...present, "saved"];

  // forms present (avatāra axis) — declared order first, then any extras
  const formsRaw = [...new Set(all.map(s => s.form))];
  const order = D.formOrder[dd.id] || [];
  const formsPresent = [...order.filter(f => formsRaw.includes(f)), ...formsRaw.filter(f => !order.includes(f)).sort()];
  const hasForms = formsPresent.length >= 2;
  const formChips = ["all", ...formsPresent];

  // faceted matchers — each axis's counts respect the OTHER axis's selection
  const matchType = s => type === "all" ? true : type === "saved" ? bookmarks.has(s.id) : s.type === type;
  const matchForm = s => form === "all" ? true : s.form === form;

  let list = all.filter(s => {
    if (!matchForm(s)) return false;
    if (!matchType(s)) return false;
    if (q.trim()) {
      const hay = (s.title + " " + s.deva + " " + s.by + " " + s.type + " " + s.form + " " + (s.blurb || "")).toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });
  if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "length") list = [...list].sort((a, b) => b.verses - a.verses);
  else list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || a.title.localeCompare(b.title)); // popular

  const rec = useRecite(list);

  // weekday tie, if any
  const wdIdx = D.weekdayDeity.indexOf(dd.id);
  const vara = wdIdx >= 0 ? window.AKSHARA_PANCHANGA.VARA[wdIdx] : null;

  const activeFilters = (form !== "all" ? 1 : 0) + (type !== "all" ? 1 : 0);
  const FormChips = () => (
    formChips.map(f => {
      const c = f === "all" ? all.filter(matchType).length : all.filter(s => s.form === f && matchType(s)).length;
      return (
        <button key={f} className="chip" data-active={form === f} onClick={() => setForm(f)} style={{ height: 34, fontSize: 13.5 }}>
          {f === "all" ? "All forms" : f}{f !== "all" ? " \u00b7 " + c : ""}
        </button>
      );
    })
  );
  const TypeChips = () => (
    typeChips.map(t => {
      const c = t === "all" ? all.filter(matchForm).length : t === "saved" ? all.filter(s => bookmarks.has(s.id) && matchForm(s)).length : all.filter(s => s.type === t && matchForm(s)).length;
      return (
        <button key={t} className="chip" data-active={type === t} onClick={() => setType(t)} style={{ height: 34, fontSize: 13.5 }}>
          {t === "all" ? "All" : t === "saved" ? "Saved" : t}{t !== "all" ? " \u00b7 " + c : ""}
        </button>
      );
    })
  );

  return (
    <div className="rise" style={{ paddingBottom: rec.now ? 130 : 70 }}>
      {/* Deity hero (night band) */}
      <div style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-4%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.12 }}><Mandala size={460} spin /></div>
        <div className="wrap" style={{ padding: "30px 40px 40px", position: "relative" }}>
          <button onClick={() => go("stotras")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--on-night-soft)", fontSize: 14, marginBottom: 26 }}>
            <Icon name="arrowL" size={16} /> All deities
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
            <div className="seal seal--colour" style={{ width: 88, height: 88, flex: "none", border: "1.5px solid var(--gold-bright)", color: "var(--gold-bright)", borderRadius: "50%" }}>
              {window.DEITY_PORTRAIT && window.DEITY_PORTRAIT[dd.id]
                ? <img className="seal-emblem" src={window.DEITY_PORTRAIT[dd.id]} alt="" draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                : <Sa as="span" style={{ fontSize: 42, lineHeight: 1 }}>{dd.seed}</Sa>}
            </div>
            <div style={{ minWidth: 0 }}>
              <Sa as="div" style={{ fontSize: 26, color: "var(--gold-bright)", lineHeight: 1.4 }}>{dd.deva}</Sa>
              <h1 style={{ fontSize: "clamp(2.4rem,4.4vw,3.6rem)", lineHeight: 1, color: "var(--on-night)", marginTop: 2 }}>{dd.name}</h1>
              <div style={{ fontStyle: "normal", color: "var(--on-night-soft)", fontSize: 16, marginTop: 8 }}>{dd.epithet}</div>
            </div>
          </div>
          <p style={{ color: "var(--on-night-soft)", fontSize: 16.5, lineHeight: 1.7, maxWidth: 680, marginTop: 22 }}>{dd.note}</p>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 22, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--gold-bright)" }}>{all.length}</span>
            <span style={{ fontSize: 14, color: "var(--on-night-soft)", letterSpacing: "0.04em" }}>stotras in this collection</span>
            {vara && <><span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--on-night-soft)" }} />
              <span style={{ fontSize: 14, color: "var(--on-night-soft)" }}>Observed on <strong style={{ color: "var(--on-night)", fontWeight: 600 }}>{vara.en}s</strong></span></>}
          </div>
        </div>
      </div>

      {/* Sticky toolbar: search · type filter · sort · view */}
      <div style={{ position: "sticky", top: "var(--header-h)", zIndex: 30, background: "color-mix(in srgb, var(--paper) 92%, transparent)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "14px 40px 12px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 230, display: "flex", alignItems: "center", gap: 11, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: "11px 18px" }}>
              <Icon name="search" size={18} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${dd.name} stotras…`}
                style={{ flex: 1, background: "none", border: 0, outline: "none", fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink)" }} />
              {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0, color: "var(--ink-faint)" }}><Icon name="close" size={16} /></button>}
            </div>
            {!isMobile && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-soft)" }}>
              Sort
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontFamily: "var(--font-body)", fontSize: 14, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: "9px 14px", color: "var(--ink)" }}>
                <option value="popular">Most loved</option>
                <option value="title">Title (A–Z)</option>
                <option value="length">Length</option>
              </select>
            </label>
            )}
            {isMobile && (
              <button onClick={() => setFilterSheet(true)} className="chip" data-active={activeFilters > 0}
                style={{ height: 44, fontSize: 14, padding: "0 16px", gap: 8 }}>
                <Icon name="list" size={16} /> Filters{activeFilters > 0 ? <span style={{ display: "inline-grid", placeItems: "center", minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, background: "var(--on-night)", color: "var(--maroon)", fontSize: 11.5, fontWeight: 700 }}>{activeFilters}</span> : null}
              </button>
            )}
            <div style={{ display: "flex", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: 4 }}>
              {["list", "grid"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{ width: 40, height: 40, borderRadius: 999, border: 0, display: "grid", placeItems: "center",
                  background: view === v ? "var(--maroon)" : "transparent", color: view === v ? "var(--on-night)" : "var(--ink-soft)" }}><Icon name={v} size={18} /></button>
              ))}
            </div>
          </div>
          {/* form (avatāra) chips + type chips — inline on desktop, in a sheet on mobile */}
          {!isMobile && hasForms && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginRight: 2 }}>Form</span>
              <FormChips />
            </div>
          )}
          {!isMobile && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
              {hasForms && <span style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginRight: 2 }}>Type</span>}
              <TypeChips />
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {isMobile && filterSheet && (
        <div onClick={() => setFilterSheet(false)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(20,14,8,0.42)", display: "flex", alignItems: "flex-end" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxHeight: "82vh", overflowY: "auto", background: "var(--paper)", borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: "10px 22px 30px" }}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: "var(--line)", margin: "4px auto 14px" }} />
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <span className="eyebrow" style={{ color: "var(--saffron)" }}>Filter &amp; sort</span>
              {activeFilters > 0 && <button onClick={() => { setForm("all"); setType("all"); }} style={{ marginLeft: "auto", background: "none", border: 0, color: "var(--maroon)", fontSize: 13.5 }}>Clear all</button>}
              <button onClick={() => setFilterSheet(false)} aria-label="Close" style={{ marginLeft: activeFilters > 0 ? 14 : "auto", background: "none", border: 0, color: "var(--ink-faint)" }}><Icon name="close" size={20} /></button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 10 }}>Sort</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["popular", "Most loved"], ["title", "Title (A–Z)"], ["length", "Length"]].map(([v, l]) => (
                  <button key={v} className="chip" data-active={sort === v} onClick={() => setSort(v)} style={{ height: 38, fontSize: 14 }}>{l}</button>
                ))}
              </div>
            </div>
            {hasForms && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 10 }}>Form</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><FormChips /></div>
              </div>
            )}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 10 }}>Type</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><TypeChips /></div>
            </div>
            <button onClick={() => setFilterSheet(false)} className="btn" style={{ width: "100%", justifyContent: "center", background: "var(--maroon)", color: "var(--on-night)", border: 0, padding: "13px", fontSize: 15 }}>
              Show {list.length} {list.length === 1 ? "stotra" : "stotras"}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="wrap" style={{ padding: "24px 40px 0" }}>
        <div style={{ fontSize: 14, color: "var(--ink-faint)", letterSpacing: "0.04em", marginBottom: 18 }}>
          {list.length} {list.length === 1 ? "stotra" : "stotras"}{form !== "all" ? " · " + form : ""}{type !== "all" && type !== "saved" ? " · " + type : ""}{type === "saved" ? " · saved" : ""}
        </div>
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--ink-faint)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, color: "var(--gold)", opacity: 0.5 }}><Mandala size={110} /></div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 21 }}>Nothing matches.</p>
            <p style={{ fontSize: 15 }}>{type === "saved" ? "Bookmark a hymn to keep it here." : "Try another form, or clear your search."}</p>
          </div>
        ) : view === "list" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {list.map(s => <StotraCard key={s.id} s={s} deity={dd} marked={bookmarks.has(s.id)} toggleMark={toggleMark} fav={favSet.has(s.id)} toggleFav={toggleFav} isPlaying={rec.now === s.id && rec.playing} onPlay={rec.play} onOpen={(id) => go("stotraReader", { id })} view="list" />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px,1fr))", gap: 18 }}>
            {list.map(s => <StotraCard key={s.id} s={s} deity={dd} marked={bookmarks.has(s.id)} toggleMark={toggleMark} fav={favSet.has(s.id)} toggleFav={toggleFav} isPlaying={rec.now === s.id && rec.playing} onPlay={rec.play} onOpen={(id) => go("stotraReader", { id })} />)}
          </div>
        )}
        {window.IndexShelf && <window.IndexShelf deity={dd} />}
        <div className="ornament" style={{ marginTop: 50 }}><Lotus size={20} color="var(--gold)" /></div>
      </div>

      {rec.now && (() => { const ns = list.find(s => s.id === rec.now) || all.find(s => s.id === rec.now); return (
        <ReciteBar stotra={ns} deity={dd} playing={rec.playing} setPlaying={rec.setPlaying} speed={rec.speed} setSpeed={rec.setSpeed} prog={rec.prog} onStep={rec.stepTo} onClose={rec.close} />
      ); })()}
    </div>
  );
}

/* ============================================================
   StotraReaderScreen — one hymn, line by line (deva · IAST · en)
   ============================================================ */
function StotraReaderScreen({ go, bookmarks, toggleMark, favorites = [], toggleFav, id }) {
  const D = window.AKSHARA_DATA;
  const s = D.stotras.find(x => x.id === id) || D.stotras[0];
  const deity = D.deities.find(d => d.id === s.deity);
  const verses = s.text || (s.incipit ? [s.incipit] : []);
  const marked = bookmarks.has(s.id);
  const isFav = favorites.includes(s.id);
  const isNamavali = !!(s.names && s.names.length);

  const [show, setShow] = useState({ deva: true, iast: true, en: true, tel: false });
  const [layout, setLayout] = useState("stacked");
  const [nameMode, setNameMode] = useState("namavali"); // namavali | grouped (only for *Sahasranāma/Aṣṭottara)
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0);
  const [speed, setSpeed] = useState(1);
  const tick = useRef(null);

  // progressive window: rendering all 1000 namāvalī rows at once freezes the
  // page, so we render a growing slice (grows on demand + during recitation)
  const PAGE = 120;
  const [visN, setVisN] = useState(PAGE);

  // group names into śloka-style chunks (~8 per group) for the "Grouped" view
  const GROUP = 8;
  const groups = React.useMemo(() => {
    if (!isNamavali) return [];
    const out = [];
    for (let i = 0; i < s.names.length; i += GROUP) {
      const chunk = s.names.slice(i, i + GROUP);
      out.push({
        deva: chunk.map(n => n.deva).join("  "),
        iast: chunk.map(n => n.iast).join(" · "),
        en: chunk.map(n => n.en).join("; "),
        from: i + 1, to: i + chunk.length,
      });
    }
    return out;
  }, [s.id]);

  // what the audio bar / highlight steps through
  const usingNamavali = isNamavali && nameMode === "namavali";
  const units = isNamavali ? (nameMode === "namavali" ? s.names : groups) : verses;
  const total = units.length;
  const partial = isNamavali ? s.names.length < s.verses : (verses.length > 0 && verses.length < s.verses);

  // Recitation pacing scales with the length of each unit, so a long compound
  // name (e.g. brahmopendra…vaibhavā) dwells far longer than a short one (bhavānī).
  // We count akṣara — maximal runs of IAST vowels — as a syllable proxy.
  const aksara = (str) => {
    if (!str) return 1;
    const runs = str.toLowerCase().match(/[aāiīuūṛṝḷḹeo]+/g);
    return runs ? runs.length : 1;
  };
  const dur = React.useMemo(() => {
    const u = units[active];
    const syl = u ? aksara(u.iast || u.deva || "") : 5;
    return usingNamavali
      ? Math.max(1.4, Math.min(6.5, 0.5 * syl))   // per-name
      : Math.max(4, Math.min(13, 0.22 * syl));     // verse / grouped śloka
  }, [active, units, usingNamavali]);

  useEffect(() => { setActive(0); setProg(0); setPlaying(false); window.scrollTo({ top: 0 }); }, [id]);
  useEffect(() => { setActive(0); setProg(0); setPlaying(false); }, [nameMode]);
  useEffect(() => { setVisN(PAGE); }, [id, nameMode]);
  // keep the highlighted name within the rendered window during playback / jumps
  useEffect(() => { setVisN(v => (active + 8 > v ? Math.min(total, active + 8) : v)); }, [active, total]);
  useEffect(() => {
    if (!playing || !total) { clearInterval(tick.current); return; }
    const step = 0.05;
    tick.current = setInterval(() => {
      setProg(p => { const np = p + (step * speed) / dur; if (np >= 1) { setActive(a => { if (a + 1 >= total) { setPlaying(false); try { window.STUTI_THREAD.mark("r", s.id); } catch (e) {} return a; } return a + 1; }); return 0; } return np; });
    }, step * 1000);
    return () => clearInterval(tick.current);
  }, [playing, speed, total, dur]);
  useEffect(() => {
    if (!playing) return;
    const el = document.getElementById("sv-" + active);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 168, behavior: "smooth" });
  }, [active, playing]);

  const lang = React.useContext(window.LangContext);
  const sc = window.AKSHARA_SCRIPT.byCode[lang] || window.AKSHARA_SCRIPT.byCode.sa;
  const toggle = k => setShow(v => ({ ...v, [k]: !v[k] }));
  const colCount = (show.deva ? 1 : 0) + (show.iast ? 1 : 0) + (show.en ? 1 : 0) + (show.tel && (s.text || []).some(v => v.tel) ? 1 : 0);
  // Telugu meaning is a display option on every stotra. Where a Telugu source
  // document exists the gloss is shown; elsewhere a brief note explains it isn't
  // available yet. Chrome stays English; only the sacred content switches script.
  // "Meaning / purport" in the active script — तात्पर्यं → తాత్పర్యం, ತಾತ್ಪರ್ಯಂ, …
  const meaningWord = window.AKSHARA_SCRIPT.to("\u0924\u093e\u0924\u094d\u092a\u0930\u094d\u092f\u0902", lang);
  const toggles = [["deva", sc.native, sc.label], ["iast", "ā", "Transliteration"], ["en", "En", "Translation"], ["tel", "", meaningWord]];
  // Coverage states for the one-time note under the toolbar.
  const telAny = isNamavali ? (s.names || []).some(n => n.tel) : (s.text || []).some(v => v.tel);
  const telNone = !telAny;
  // Continuous-verse stotra (e.g. Viṣṇu Sahasranāma): pīṭhikā verses are glossed
  // but the name-ślokas are not — a partial state.
  const telPartial = telAny && !isNamavali && (s.text || []).some(v => !v.tel);

  function Verse({ v, i }) {
    const on = playing && i === active;
    const par = layout === "parallel";
    const devaEl = show.deva && <Sa as="p" style={{ fontSize: par ? 22 : "clamp(1.5rem,2vw,1.9rem)", lineHeight: 1.7, margin: 0, color: "var(--ink)", whiteSpace: "pre-line", textAlign: "left" }}>{v.deva}</Sa>;
    const iastEl = show.iast && <p style={{ fontStyle: "normal", color: "var(--gold)", fontSize: par ? 16 : "clamp(1.05rem,1.4vw,1.22rem)", lineHeight: 1.6, margin: par ? 0 : "13px 0 0", whiteSpace: "pre-line", textAlign: "left" }}>{v.iast}</p>;
    const enEl = show.en && <p style={{ fontSize: par ? 16.5 : "clamp(1.1rem,1.4vw,1.26rem)", lineHeight: 1.7, margin: par ? 0 : "15px 0 0", color: "var(--ink-soft)", maxWidth: par ? "none" : 680, marginLeft: 0, marginRight: par ? 0 : "auto", textAlign: "left", fontFamily: "var(--font-display)", fontWeight: 500 }}>{v.en}</p>;
    const telP = v.tel && <p style={{ fontFamily: "var(--font-tel)", fontSize: par ? 16.5 : "clamp(1.05rem,1.35vw,1.2rem)", lineHeight: 1.95, margin: 0, color: "var(--ink)", textAlign: "left", textWrap: "pretty" }}>{v.tel}</p>;
    const telEl = show.tel && v.tel && (
      <div style={{ margin: "16px 0 0", maxWidth: par ? "none" : 700, padding: par ? 0 : "14px 24px", borderRadius: 12,
        background: par ? "transparent" : "color-mix(in srgb, var(--saffron) 6%, transparent)", border: par ? "none" : "1px solid var(--line-soft)" }}>{telP}</div>
    );
    const num = v.n !== undefined ? v.n : (v.from ? v.from + "–" + v.to : i + 1);
    return (
      <React.Fragment>
        {v.section && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            padding: i ? "46px 0 6px" : "2px 0 6px", borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
            <Lotus size={18} color="var(--gold)" />
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600, textAlign: "center" }}>{v.section}</div>
          </div>
        )}
        <div id={"sv-" + i} onClick={() => { setActive(i); setProg(0); }}
          style={{ position: "relative", padding: par ? "26px 0" : "36px 0 36px 52px", borderTop: (i && !v.section) ? "1px solid var(--line-soft)" : "none", cursor: "pointer",
            background: on ? "color-mix(in srgb, var(--saffron) 8%, transparent)" : "transparent", borderRadius: on ? 8 : 0, transition: "background .3s", scrollMarginTop: 168 }}>
          {num !== "" && (
            <div style={{ position: "absolute", left: 0, top: par ? 26 : 36, fontFamily: "var(--font-display)", fontSize: v.from ? 14 : 17, color: on ? "var(--maroon)" : "var(--ink-faint)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{num}</span>
              {on && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--maroon)" }} className="pulse" />}
            </div>
          )}
          {v.speaker && (() => {
            const spkDeva = VSN_SPEAKER_DEVA[v.speaker];
            return (
              <div style={{ marginBottom: 12, textAlign: "left", paddingLeft: par ? 56 : 0 }}>
                {spkDeva && <Sa as="div" style={{ fontSize: 17, color: "var(--saffron)", fontWeight: 600, lineHeight: 1.4 }}>{spkDeva}</Sa>}
                <div style={{ fontStyle: "normal", fontSize: 13.5, color: "var(--ink-faint)", fontWeight: 500, marginTop: spkDeva ? 2 : 0 }}>{v.speaker}</div>
              </div>
            );
          })()}
          {par ? (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(colCount, 1)}, 1fr)`, gap: 34, paddingLeft: 56 }}>
              {devaEl && <div>{devaEl}</div>}{iastEl && <div style={{ paddingTop: 4 }}>{iastEl}</div>}{enEl && <div>{enEl}</div>}
              {show.tel && telAny && <div style={{ paddingTop: 2 }}>{v.tel ? telP : <span style={{ color: "var(--ink-faint)" }}>—</span>}</div>}
            </div>
          ) : <>{devaEl}{iastEl}{enEl}{telEl}</>}
        </div>
      </React.Fragment>
    );
  }

  // one name in the nāmāvalī (name-by-name) view
  function NameRow({ n, i }) {
    const on = playing && i === active;
    return (
      <div id={"sv-" + i} onClick={() => { setActive(i); setProg(0); }}
        style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "14px 16px", cursor: "pointer", borderRadius: 10, scrollMarginTop: 168,
          background: on ? "color-mix(in srgb, var(--saffron) 11%, var(--paper-2))" : "var(--paper-2)",
          border: "1px solid " + (on ? "var(--gold)" : "var(--line)"), transition: "background .25s, border-color .25s" }}>
        <span style={{ flex: "none", width: 42, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: on ? "var(--maroon)" : "var(--ink-faint)", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{i + 1}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          {show.deva && <Sa as="span" style={{ fontSize: 22, color: "var(--maroon)", lineHeight: 1.45, marginRight: 14 }}>{n.deva}</Sa>}
          {show.iast && <span style={{ fontStyle: "normal", color: "var(--gold)", fontSize: 15.5 }}>{n.iast}</span>}
          {show.en && <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15.5, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.5 }}>{n.en}</div>}
          {show.tel && n.tel && <div style={{ fontFamily: "var(--font-tel)", fontSize: 16, color: "var(--maroon)", marginTop: 5, lineHeight: 1.75, textWrap: "pretty" }}>{n.tel}</div>}
        </div>
        {on && <span style={{ flex: "none", width: 8, height: 8, borderRadius: "50%", background: "var(--maroon)", alignSelf: "center" }} className="pulse" />}
      </div>
    );
  }

  return (
    <div className="rise" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: "var(--gold-bright)", opacity: 0.1 }}><Mandala size={440} /></div>
        <div className="wrap" style={{ padding: "30px 40px 42px", position: "relative" }}>
          <button onClick={() => go("deity", { deity: s.deity })} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--on-night-soft)", fontSize: 14, marginBottom: 22 }}>
            <Icon name="arrowL" size={16} /> {deity ? deity.name : "Stotras"}
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div style={{ maxWidth: 760 }}>
              <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>{deity ? deity.name : ""} · {s.type} · {s.by}</span>
              <Sa as="p" style={{ fontSize: 25, color: "var(--gold-bright)", margin: "12px 0 0", lineHeight: 1.4 }}>{s.deva}</Sa>
              <h1 style={{ fontSize: "clamp(2.1rem,3.8vw,3.1rem)", lineHeight: 1.05, color: "var(--on-night)", marginTop: 4 }}>{s.title}</h1>
              <p style={{ color: "var(--on-night-soft)", fontSize: 16, lineHeight: 1.6, marginTop: 12, maxWidth: 620 }}>{s.blurb}</p>
            </div>
            <div style={{ display: "flex", gap: 10, flex: "none" }}>
              {toggleFav && (
                <button onClick={() => toggleFav(s.id)} className="btn" title={isFav ? "In your daily recitation" : "Add to daily recitation"}
                  style={{ background: isFav ? "var(--gold-bright)" : "transparent", color: isFav ? "var(--night)" : "var(--on-night)", border: "1px solid " + (isFav ? "var(--gold-bright)" : "rgba(240,228,204,0.3)") }}>
                  <Icon name={isFav ? "flameFill" : "flame"} size={17} /> {isFav ? "In daily" : "Daily"}
                </button>
              )}
              <button onClick={() => toggleMark(s.id)} className="btn" style={{ background: marked ? "var(--gold)" : "transparent", color: marked ? "var(--night)" : "var(--on-night)", border: "1px solid " + (marked ? "var(--gold)" : "rgba(240,228,204,0.3)") }}>
                <Icon name={marked ? "bookmarkFill" : "bookmark"} size={17} /> {marked ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader toolbar — recitation player + display controls, pinned at top */}
      <div style={{ position: "sticky", top: "var(--header-h)", zIndex: 30, background: "var(--night)", color: "var(--on-night)", borderBottom: "1px solid rgba(240,228,204,0.14)" }}>
        {total > 0 && (
          <div style={{ height: 3, background: "rgba(240,228,204,0.12)" }}>
            <div style={{ height: "100%", width: `${((active + prog) / total) * 100}%`, background: "var(--gold-bright)", transition: "width .1s linear" }} />
          </div>
        )}
        <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 40px", flexWrap: "wrap" }}>
          {/* Recitation group */}
          {total > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            <button onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause recitation" : "Play recitation"}
              style={{ width: 52, height: 52, borderRadius: "50%", flex: "none", border: 0, background: "var(--gold-bright)", color: "var(--night)", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Icon name={playing ? "pause" : "play"} size={24} />
            </button>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, whiteSpace: "nowrap" }}>{playing ? "Reciting" : "Listen"} · {usingNamavali ? "Name" : "Verse"} {active + 1}</div>
              <div style={{ fontSize: 12.5, color: "var(--on-night-soft)", whiteSpace: "nowrap" }}>of {total} · classical svara</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <button onClick={() => { setActive(a => Math.max(0, a - 1)); setProg(0); }} aria-label="Previous" style={{ background: "none", border: 0, color: "var(--on-night)", padding: 8, cursor: "pointer" }}><Icon name="arrowL" size={20} /></button>
              <button onClick={() => { setActive(a => Math.min(total - 1, a + 1)); setProg(0); }} aria-label="Next" style={{ background: "none", border: 0, color: "var(--on-night)", padding: 8, cursor: "pointer" }}><Icon name="arrowR" size={20} /></button>
            </div>
            <SpeedControl speed={speed} setSpeed={setSpeed} />
          </div>
          )}

          <div style={{ flex: 1, minWidth: 20 }} />

          {/* Display group */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 7 }}>
              {toggles.map(([k, glyph, label]) => (
                <button key={k} onClick={() => toggle(k)} title={k === "tel" ? "Meaning · " + label : label}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999, fontSize: 13.5, cursor: "pointer",
                    border: "1px solid " + (show[k] ? "var(--gold-bright)" : "rgba(240,228,204,0.28)"), background: show[k] ? "var(--gold-bright)" : "transparent",
                    color: show[k] ? "var(--night)" : "var(--on-night-soft)", fontFamily: k === "deva" ? `var(--font-${sc.font})` : "var(--font-body)" }}>
                  {glyph && <span style={{ fontStyle: k === "iast" ? "normal" : "normal", fontSize: k === "deva" ? 15 : undefined }}>{glyph}</span>}
                  <span style={{ fontSize: k === "tel" ? 15 : 13, fontFamily: k === "tel" ? `var(--font-${sc.font})` : "var(--font-body)" }}>{label}</span>
                </button>
              ))}
            </div>
            {isNamavali && (
              <div style={{ display: "flex", background: "rgba(240,228,204,0.08)", border: "1px solid rgba(240,228,204,0.2)", borderRadius: 999, padding: 3 }}>
                {[["namavali", "Name by name"], ["grouped", "Grouped"]].map(([v, l]) => (
                  <button key={v} onClick={() => setNameMode(v)} style={{ padding: "7px 15px", borderRadius: 999, border: 0, fontSize: 13.5, fontFamily: "var(--font-body)", cursor: "pointer",
                    background: nameMode === v ? "var(--gold-bright)" : "transparent", color: nameMode === v ? "var(--night)" : "var(--on-night-soft)" }}>{l}</button>
                ))}
              </div>
            )}
            {!usingNamavali && (
              <div style={{ display: "flex", background: "rgba(240,228,204,0.08)", border: "1px solid rgba(240,228,204,0.2)", borderRadius: 999, padding: 3 }}>
                {[["stacked", "Stacked"], ["parallel", "Parallel"]].map(([v, l]) => (
                  <button key={v} onClick={() => setLayout(v)} style={{ padding: "7px 15px", borderRadius: 999, border: 0, fontSize: 13.5, fontFamily: "var(--font-body)", cursor: "pointer",
                    background: layout === v ? "var(--gold-bright)" : "transparent", color: layout === v ? "var(--night)" : "var(--on-night-soft)" }}>{l}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="wrap" style={{ maxWidth: usingNamavali ? 1100 : (layout === "parallel" ? (show.tel ? 1320 : 1160) : (show.tel ? 920 : 840)), padding: "24px 40px 56px" }}>
        {show.tel && telPartial && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, margin: "0 auto 24px", maxWidth: 760, padding: "14px 18px", borderRadius: 12,
            background: "color-mix(in srgb, var(--saffron) 6%, var(--paper-2))", border: "1px solid var(--line)" }}>
            <span style={{ flex: "none", color: "var(--saffron)", marginTop: 1 }}><Icon name="quote" size={16} /></span>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>
              Telugu meaning is shown for the <strong style={{ fontWeight: 600, color: "var(--ink)" }}>Pūrva &amp; Uttara Pīṭhikā</strong> verses. The 108 name-ślokas await a name-by-name Telugu glossary.
            </p>
          </div>
        )}
        {show.tel && telNone && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, margin: "0 auto 24px", maxWidth: 760, padding: "14px 18px", borderRadius: 12,
            background: "color-mix(in srgb, var(--saffron) 6%, var(--paper-2))", border: "1px solid var(--line)" }}>
            <span style={{ flex: "none", color: "var(--saffron)", marginTop: 1 }}><Icon name="quote" size={16} /></span>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>
              A Telugu meaning for this stotra is not available yet. It appears wherever a Telugu source is on hand — at present the <strong style={{ fontWeight: 600, color: "var(--ink)" }}>Viṣṇu</strong> and <strong style={{ fontWeight: 600, color: "var(--ink)" }}>Lalitā Sahasranāmas</strong>.
            </p>
          </div>
        )}
        {total === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--ink-faint)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, color: "var(--gold)", opacity: 0.5 }}><Lotus size={40} color="var(--gold)" /></div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 21 }}>The text is being prepared.</p>
            <p style={{ fontSize: 15 }}>The recitation of this {s.verses}-verse hymn is available in audio.</p>
          </div>
        ) : usingNamavali ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 10 }}>
              {units.slice(0, visN).map((n, i) => <NameRow key={i} n={n} i={i} />)}
            </div>
            {visN < total ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 30 }}>
                <p style={{ color: "var(--ink-faint)", fontSize: 14.5, fontFamily: "var(--font-display)" }}>Showing {visN} of {total} names</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setVisN(v => Math.min(total, v + PAGE))} className="btn"
                    style={{ background: "var(--maroon)", color: "var(--on-night)", border: 0 }}>
                    Show {Math.min(PAGE, total - visN)} more names
                  </button>
                  <button onClick={() => setNameMode("grouped")} className="btn"
                    style={{ background: "transparent", color: "var(--maroon)", border: "1px solid var(--line)" }}>
                    See all {total}, grouped
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="ornament" style={{ marginTop: 48 }}><Lotus size={20} color="var(--gold)" /></div>
                <p style={{ textAlign: "center", color: "var(--ink-faint)", fontStyle: "normal", marginTop: 22, fontSize: 14.5 }}>
                  {partial ? `First ${units.length} names · ${s.title} (${s.verses} in full)` : `${s.title} · ${units.length} names · ${s.by}`}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            {units.map((v, i) => <Verse key={i} v={v} i={i} />)}
            <div className="ornament" style={{ marginTop: 48 }}><Lotus size={20} color="var(--gold)" /></div>
            <p style={{ textAlign: "center", color: "var(--ink-faint)", fontStyle: "normal", marginTop: 22, fontSize: 14.5 }}>
              {isNamavali
                ? (partial ? `First ${s.names.length} names, grouped · ${s.title} (${s.verses} in full)` : `${s.title} · grouped · ${s.by}`)
                : (partial ? `Opening verses · ${s.title} (${s.verses} in full)` : `${s.title} · complete · ${s.by}`)}
            </p>
          </>
        )}
      </div>

    </div>
  );
}

Object.assign(window, { StotrasScreen, DeityScreen, StotraReaderScreen, StotraCard, DeityMedallion, useRecite });

/* ============================================================
   AKSHARA — shared components (atoms, motifs, nav, cards)
   Exported to window for cross-file use.
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------- Language context + Sanskrit-script helper ----------
   `lang`: "sa" → Devanagari · "te" → Telugu. <Sa> renders a Devanagari
   string in the chosen script (transliterated when Telugu) with the
   matching font class. Reading context here keeps the rotating verse,
   reader chapters, etc. reactive to the global toggle. */
window.LangContext = React.createContext("sa");
function Sa({ children, as = "span", className, style }) {
  const lang = React.useContext(window.LangContext);
  const txt = typeof children === "string" ? children : "";
  const out = window.AKSHARA_SCRIPT.to(txt, lang);
  const cls = window.AKSHARA_SCRIPT.fontClass(lang) + (className ? " " + className : "");
  return React.createElement(as, { className: cls, style }, out);
}

/* ---------- Sacred geometry: layered mandala line-work ---------- */
function Mandala({ size = 420, stroke = "currentColor", opacity = 1, spin = false }) {
  const c = size / 2;
  const petals = (r, n, len, rot = 0) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rot;
      const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r;
      const x2 = c + Math.cos(a) * (r + len), y2 = c + Math.sin(a) * (r + len);
      const px = c + Math.cos(a + Math.PI / n) * (r + len * 0.5);
      const py = c + Math.sin(a + Math.PI / n) * (r + len * 0.5);
      const mx = c + Math.cos(a - Math.PI / n) * (r + len * 0.5);
      const my = c + Math.sin(a - Math.PI / n) * (r + len * 0.5);
      out.push(`M${x.toFixed(1)},${y.toFixed(1)} Q${px.toFixed(1)},${py.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)} Z`);
    }
    return out.join(" ");
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
         stroke={stroke} style={{ opacity, color: "inherit" }}
         className={spin ? "mandala-spin" : ""}>
      <g strokeWidth="1">
        <circle cx={c} cy={c} r={size*0.46} />
        <circle cx={c} cy={c} r={size*0.40} />
        <circle cx={c} cy={c} r={size*0.27} />
        <circle cx={c} cy={c} r={size*0.14} strokeWidth="1.2" />
        <circle cx={c} cy={c} r={size*0.045} strokeWidth="1.4" />
        <path d={petals(size*0.27, 16, size*0.13)} strokeWidth="0.9" />
        <path d={petals(size*0.14, 12, size*0.13, 0.26)} strokeWidth="0.9" />
        <path d={petals(size*0.40, 24, size*0.055)} strokeWidth="0.7" opacity="0.8" />
      </g>
    </svg>
  );
}

/* ---------- Small lotus glyph used as section ornament ---------- */
function Lotus({ size = 22, color = "currentColor" }) {
  return (
    <svg width={size} height={size*0.62} viewBox="0 0 40 25" fill="none" stroke={color} strokeWidth="1.2">
      <path d="M20 23 C20 12 20 4 20 2 C24 6 26 14 24 22" />
      <path d="M20 23 C20 12 20 4 20 2 C16 6 14 14 16 22" />
      <path d="M20 23 C24 14 30 9 34 7 C35 14 31 20 25 23" />
      <path d="M20 23 C16 14 10 9 6 7 C5 14 9 20 15 23" />
      <path d="M20 23 C28 18 36 17 39 17 C37 22 30 24 24 23" opacity="0.7" />
      <path d="M20 23 C12 18 4 17 1 17 C3 22 10 24 16 23" opacity="0.7" />
    </svg>
  );
}

/* ---------- Icons (single source) ---------- */
function Icon({ name, size = 20, stroke = 1.6, color }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color || "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></>,
    bookmark: <path d="M6 4h12v16l-6-4-6 4z"/>,
    bookmarkFill: <path d="M6 4h12v16l-6-4-6 4z" fill="currentColor"/>,
    play:     <path d="M7 5v14l11-7z" fill="currentColor" stroke="none"/>,
    pause:    <><rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none"/></>,
    arrowR:   <path d="M5 12h14M13 6l6 6-6 6"/>,
    arrowL:   <path d="M19 12H5M11 18l-6-6 6-6"/>,
    chevron:  <path d="m9 6 6 6-6 6"/>,
    chevronD: <path d="m6 9 6 6 6-6"/>,
    close:    <path d="M6 6l12 12M18 6 6 18"/>,
    menu:     <path d="M4 7h16M4 12h16M4 17h16"/>,
    grid:     <><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></>,
    list:     <><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    book:     <path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z"/>,
    layers:   <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></>,
    text:     <><path d="M5 7V5h14v2M12 5v14M9 19h6"/></>,
    speaker:  <><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></>,
    sun:      <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></>,
    feather:  <><path d="M20 4C14 4 7 8 5 16l-1 4 4-1c8-2 12-9 12-15z"/><path d="M16 8 8 16"/></>,
    quote:    <path d="M7 7H4v5h3c0 2-1 3-3 3v2c3 0 5-2 5-5V7zm10 0h-3v5h3c0 2-1 3-3 3v2c3 0 5-2 5-5V7z" fill="currentColor" stroke="none"/>,
    check:    <path d="M20 6 9 17l-5-5"/>,
    script:   <><path d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10"/><path d="M8 9h6M8 13h8M8 17h5"/></>,
    home:     <><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5h12V10"/></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9.5h16M8 3v4M16 3v4"/></>,
    flame:    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2 2.5z"/>,
    flameFill: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2 2.5z" fill="currentColor"/>,
    grip:     <g fill="currentColor" stroke="none"><circle cx="9" cy="5" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="9" cy="19" r="1.3"/><circle cx="15" cy="5" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="15" cy="19" r="1.3"/></g>,
    plus:     <path d="M12 5v14M5 12h14"/>,
    mapPin:   <><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></>,
    gauge:    <><path d="M5 17.5a8 8 0 1 1 14 0"/><path d="M12 14.5 15.5 10"/></>,
  };
  return <svg {...p} style={{ flex: "none" }}>{paths[name] || null}</svg>;
}

/* ---------- Wordmark ---------- */
function Logo({ onClick, compact = false }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: 0, padding: 0 }}>
      <span style={{
        width: 38, height: 38, borderRadius: "50%", flex: "none",
        display: "grid", placeItems: "center",
        border: "1.5px solid var(--gold)", color: "var(--maroon)",
        fontFamily: "var(--font-deva)", fontSize: 22, lineHeight: 1, paddingBottom: 2 }}>
        ॐ
      </span>
      {!compact && (
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1, textAlign: "left" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, letterSpacing: "0.02em", color: "var(--ink)" }}>Akshara</span>
          <span className="eyebrow" style={{ fontSize: 9, letterSpacing: "0.32em", marginTop: 3 }}><Sa>अक्षर</Sa> · the imperishable</span>
        </span>
      )}
    </button>
  );
}

/* ---------- Companion-script picker (scales past two scripts) ---------- */
function ScriptMenu({ lang, setLang, onNight }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const scripts = window.AKSHARA_SCRIPTS;
  const cur = window.AKSHARA_SCRIPT.byCode[lang] || scripts[0];
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const fg = onNight ? "var(--on-night)" : "var(--ink-soft)";
  const bd = onNight ? "rgba(240,228,204,0.3)" : "var(--line)";
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} title="Companion script"
        style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 999,
          background: onNight ? "transparent" : "var(--paper-2)", border: "1px solid " + bd, color: fg, fontFamily: "var(--font-body)" }}>
        <Icon name="script" size={16} />
        <span className={cur.font} style={{ fontSize: 16, lineHeight: 1 }}>{cur.native}</span>
        <Icon name="chevronD" size={14} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 9px)", right: 0, zIndex: 70, minWidth: 150,
          background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, boxShadow: "var(--shadow-lift)", padding: 5 }}>
          {scripts.map(s => {
            const on = s.code === lang;
            return (
              <button key={s.code} onClick={() => { setLang(s.code); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", border: 0,
                  background: on ? "color-mix(in srgb, var(--maroon) 10%, transparent)" : "transparent",
                  borderRadius: 6, padding: "8px 11px", color: "var(--ink)", cursor: "pointer" }}>
                <span className={s.font} style={{ flex: 1, fontSize: 17, color: on ? "var(--maroon)" : "var(--ink)", lineHeight: 1.2 }}>{s.native}</span>
                {on && <Icon name="check" size={16} color="var(--maroon)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Recitation speed (shared: fine slider + nudge + preset chips) ---------- */
const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
const SPEED_MIN = 0.5, SPEED_MAX = 3, SPEED_STEP = 0.05;
function fmtSpeed(v) { return v.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") + "×"; }
function SpeedControl({ speed, setSpeed, compact }) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(true);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const clamp = v => Math.min(SPEED_MAX, Math.max(SPEED_MIN, Math.round(v * 100) / 100));
  const pct = ((speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100;
  function toggle() {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setUp(r.top > window.innerHeight / 2);
    }
    setOpen(o => !o);
  }
  return (
    <div className={"speed" + (compact ? " speed-compact" : "")} ref={ref} style={{ position: "relative" }}>
      <button type="button" className="speed-pill" onClick={toggle} aria-expanded={open} aria-label="Recitation speed">
        <Icon name="gauge" size={15} />
        <span className="speed-readout">{fmtSpeed(speed)}</span>
      </button>
      {open && (
        <div className={"speed-pop" + (up ? " up" : "")} role="dialog" aria-label="Recitation speed">
          <div className="speed-pop-head"><span>Recitation speed</span><span className="speed-readout big">{fmtSpeed(speed)}</span></div>
          <div className="speed-fine">
            <button type="button" className="speed-nudge" onClick={() => setSpeed(s => clamp(s - SPEED_STEP))} aria-label="Slower">−</button>
            <input className="speed-range" type="range" min={SPEED_MIN} max={SPEED_MAX} step={SPEED_STEP}
              value={speed} onChange={e => setSpeed(clamp(+e.target.value))}
              style={{ ["--fill"]: pct + "%" }} aria-label="Recitation speed" />
            <button type="button" className="speed-nudge" onClick={() => setSpeed(s => clamp(s + SPEED_STEP))} aria-label="Faster">+</button>
          </div>
          <div className="speed-presets">
            {SPEEDS.map(v => (
              <button type="button" key={v}
                className={"speed-chip" + (Math.abs(v - speed) < 0.001 ? " on" : "")}
                onClick={() => setSpeed(v)}>{v}×</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Top-nav dropdown (desktop) ---------- */
function NavDropdown({ label, items, route, go, activeRoutes }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = activeRoutes.includes(route);
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button onClick={() => { if (items[0]) go(items[0].route, items[0].params); }}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: 0, padding: "8px 12px", borderRadius: 999,
          fontFamily: "var(--font-body)", fontSize: 15, cursor: "pointer",
          color: active ? "var(--maroon)" : "var(--ink-soft)", fontWeight: active ? 600 : 400 }}>
        {label} <Icon name="chevronD" size={14} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 2px)", left: 0, zIndex: 70, minWidth: 240,
          background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "var(--shadow-lift)", padding: 6 }}>
          {items.map(it => (
            <button key={it.label} onClick={() => { setOpen(false); go(it.route, it.params); }}
              style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", textAlign: "left", border: 0, background: "transparent",
                borderRadius: 8, padding: "10px 12px", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "color-mix(in srgb, var(--maroon) 8%, transparent)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {it.icon && <span style={{ flex: "none", color: "var(--saffron)", marginTop: 1 }}><Icon name={it.icon} size={18} /></span>}
              <span>
                <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 16.5, fontWeight: 600, color: "var(--ink)" }}>{it.label}</span>
                {it.desc && <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-faint)", marginTop: 1 }}>{it.desc}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Top navigation (responsive) ---------- */
function TopNav({ route, go, query, setQuery, bookmarks, user, lang, setLang }) {
  const D = window.AKSHARA_DATA;
  const popularDeities = ["ganesha", "shiva", "vishnu", "devi", "lakshmi", "hanuman"];
  const deityItems = popularDeities.map(id => {
    const d = (D.deities || []).find(x => x.id === id);
    return d ? { label: d.name, desc: d.epithet, route: "deity", params: { deity: id } } : null;
  }).filter(Boolean);
  const navItems = [
    { id: "home", label: "Home", route: "home" },
    { id: "library", label: "Library", route: "library" },
    { id: "stotras", label: "Stotras", routes: ["stotras", "deity", "stotraReader", "parayanas", "parayana"], children: [
      { label: "All stotras", desc: "Browse by deity", route: "stotras", icon: "speaker" },
      { label: "Pārāyaṇa", desc: "Sustained readings, cut into days", route: "parayanas", icon: "book" },
      ...deityItems,
    ] },
    { id: "practice", label: "Practice", route: "practice", routes: ["practice", "japa", "plan"] },
    { id: "calendar", label: "Calendar", routes: ["calendar", "festivals", "festival", "vrathams", "vratham", "nomus", "nomu"], children: [
      { label: "Pañcāṅga", desc: "Today's reading of the sky", route: "calendar", icon: "sun" },
      { label: "Festivals", desc: "How each festival is kept", route: "festivals", icon: "calendar" },
      { label: "Vrathams", desc: "Vows, with full procedure", route: "vrathams", icon: "flame" },
      { label: "Nomulu", desc: "The household vows", route: "nomus", icon: "flame" },
    ] },
    { id: "about", label: "About", route: "about" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40,
      background: "color-mix(in srgb, var(--paper) 86%, transparent)",
      backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap topnav-row" style={{ display: "flex", alignItems: "center", gap: 20, height: 76 }}>
        <Logo onClick={() => go("home")} />
        <nav className="topnav-links" style={{ display: "flex", gap: 2, marginLeft: 8 }}>
          {navItems.map(l => l.children ? (
            <NavDropdown key={l.id} label={l.label} items={l.children} route={route} go={go} activeRoutes={l.routes} />
          ) : (
            <button key={l.id} onClick={() => go(l.route)}
              style={{ background: "none", border: 0, padding: "8px 12px", borderRadius: 999,
                fontFamily: "var(--font-body)", fontSize: 15, cursor: "pointer",
                color: route === l.id ? "var(--maroon)" : "var(--ink-soft)",
                fontWeight: route === l.id ? 600 : 400 }}>
              {l.label}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        {setLang && <ScriptMenu lang={lang} setLang={setLang} />}
        <button onClick={() => go("search")} aria-label="Search" className="topnav-search-full"
          style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--paper-2)",
            border: "1px solid var(--line)", borderRadius: 999, padding: "9px 16px 9px 14px",
            color: "var(--ink-faint)", minWidth: 150 }}>
          <Icon name="search" size={17} />
          <span style={{ fontSize: 14, whiteSpace: "nowrap" }}>Search…</span>
        </button>
        <button onClick={() => go("search")} aria-label="Search" className="topnav-icon topnav-search-icon">
          <Icon name="search" size={19} />
        </button>
        <button onClick={() => go("saved")} aria-label="My library" className="btn-ghost topnav-saved"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 999,
            border: "1px solid " + (route === "saved" ? "var(--maroon)" : "var(--line)"), background: "none",
            color: route === "saved" ? "var(--maroon)" : "var(--ink)", fontSize: 14 }}>
          <Icon name={bookmarks.size > 0 ? "bookmarkFill" : "bookmark"} size={17} />
          {bookmarks.size > 0 && <span style={{ color: "var(--maroon)", fontWeight: 600 }}>{bookmarks.size}</span>}
        </button>
        {user ? (
          <button onClick={() => go("account")} aria-label="Account" title={user.name} className="topnav-auth"
            style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", border: route === "account" ? "2px solid var(--maroon)" : "1px solid var(--line)",
              background: "var(--maroon)", color: "var(--on-night)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18 }}>
            {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
          </button>
        ) : (
          <button onClick={() => go("auth")} className="btn-ghost topnav-auth"
            style={{ padding: "9px 16px", borderRadius: 999, border: "1px solid var(--line)", background: "none", color: "var(--ink)", fontSize: 14, whiteSpace: "nowrap" }}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}

/* ---------- viewport helper + mobile section sub-nav ---------- */
function useIsMobile(bp = 820) {
  const [m, setM] = useState(typeof window !== "undefined" && window.innerWidth <= bp);
  useEffect(() => {
    const on = () => setM(window.innerWidth <= bp);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return m;
}

/* Mobile-only sticky pill row for section pages (hidden on desktop via CSS,
   where the top-nav dropdowns serve the same purpose). */
function SectionTabs({ items, route, go }) {
  return (
    <div className="section-tabs">
      {items.map(it => (
        <button key={it.label} className="chip" data-active={it.routes ? it.routes.includes(route) : route === it.route}
          onClick={() => go(it.route, it.params)}
          style={{ height: 34, fontSize: 13.5, whiteSpace: "nowrap", flex: "none" }}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Mobile bottom tab bar + More sheet ---------- */
function MobileNav({ route, go, bookmarks, user }) {
  const [more, setMore] = useState(false);
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "library", label: "Library", icon: "book" },
    { id: "stotras", label: "Stotras", icon: "speaker", routes: ["stotras", "deity", "stotraReader", "parayanas", "parayana"] },
    { id: "calendar", label: "Calendar", icon: "calendar", routes: ["calendar", "festivals", "festival", "vrathams", "vratham", "nomus", "nomu"] },
  ];
  const moreActive = ["about", "saved", "account", "auth", "search", "practice", "japa", "plan"].includes(route);
  function nav(r) { setMore(false); go(r); }
  const moreItems = [
    { id: "practice", label: "Practice", icon: "flame", desc: "The thread · japa · plans · vows" },
    { id: "parayanas", label: "Pārāyaṇa", icon: "book", desc: "Sustained readings, cut into days" },
    { id: "festivals", label: "Festivals", icon: "calendar", desc: "How each festival is kept" },
    { id: "vrathams", label: "Vrathams", icon: "flame", desc: "Vows, with full procedure" },
    { id: "nomus", label: "Nomulu", icon: "flame", desc: "The household vows" },
    { id: "search", label: "Search", icon: "search", desc: "Find any verse or text" },
    { id: "saved", label: "My Library", icon: bookmarks.size ? "bookmarkFill" : "bookmark", desc: bookmarks.size ? bookmarks.size + " saved" : "Your saved texts" },
    { id: "about", label: "About", icon: "feather", desc: "Mission & sources" },
    user
      ? { id: "account", label: user.name || "Account", icon: "text", desc: user.email || "Your shelf" }
      : { id: "auth", label: "Sign in", icon: "text", desc: "Sync across devices" },
  ];
  return (
    <>
      {more && <div className="sheet-back" onClick={() => setMore(false)} />}
      <div className={"more-sheet" + (more ? " open" : "")} role="dialog" aria-hidden={!more}>
        <div className="more-grip" />
        <div className="more-head">
          <span className="eyebrow" style={{ color: "var(--saffron)" }}>Menu</span>
          <button onClick={() => setMore(false)} aria-label="Close" className="more-close"><Icon name="close" size={20} /></button>
        </div>
        <div className="more-list">
          {moreItems.map(it => (
            <button key={it.id} className="more-item" onClick={() => nav(it.id)} data-active={route === it.id}>
              <span className="more-ic"><Icon name={it.icon} size={20} /></span>
              <span className="more-txt"><span className="more-lbl">{it.label}</span><span className="more-desc">{it.desc}</span></span>
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </div>
      </div>
      <nav className="tabbar" aria-label="Primary">
        {tabs.map(tb => (
          <button key={tb.id} className="tab" data-active={tb.routes ? tb.routes.includes(route) : route === tb.id} onClick={() => nav(tb.id)}>
            <Icon name={tb.icon} size={22} />
            <span>{tb.label}</span>
          </button>
        ))}
        <button className="tab" data-active={moreActive || more} onClick={() => setMore(m => !m)}>
          <Icon name="menu" size={22} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}

/* ---------- Footer ---------- */
function Footer({ go }) {
  return (
    <footer style={{ background: "var(--night)", color: "var(--on-night)", marginTop: 96 }}>
      <div className="wrap" style={{ padding: "64px 40px 48px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between" }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center",
                border: "1.5px solid var(--gold)", color: "var(--gold-bright)", fontFamily: "var(--font-deva)", fontSize: 20, paddingBottom: 2 }}>ॐ</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>Akshara</span>
            </div>
            <p style={{ color: "var(--on-night-soft)", fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>
              A living library of Sanātana Dharma — śruti, smṛti, and the long conversation of the tradition, freely offered.
            </p>
          </div>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            {[
              { h: "Explore", items: [["The Vedas", "library"], ["Upaniṣads", "library"], ["Bhagavad Gītā", "detail"], ["Festival calendar", "calendar"], ["Search the canon", "search"]] },
              { h: "Study", items: [["My library", "saved"], ["Sanskrit glossary", "library"], ["Pañcāṅga", "calendar"], ["Audio recitation", "library"]] },
              { h: "About", items: [["Our mission", "about"], ["Sources & editions", "about"], ["Contributors", "about"], ["Sign in", "auth"]] },
            ].map(col => (
              <div key={col.h}>
                <div className="eyebrow" style={{ color: "var(--gold-bright)", marginBottom: 16 }}>{col.h}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                  {col.items.map(([label, r]) => <li key={label}><a onClick={() => go(r, label === "Bhagavad Gītā" ? { textId: "gita" } : {})} style={{ color: "var(--on-night-soft)", fontSize: 14.5, cursor: "pointer" }}>{label}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(240,228,204,0.12)", margin: "44px 0 22px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, color: "var(--on-night-soft)", fontSize: 13 }}>
          <span><Sa>सत्यमेव जयते</Sa> · Truth alone triumphs</span>
          <span>Texts in the public domain · Editions credited per source</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Mandala, Lotus, Icon, Logo, TopNav, MobileNav, NavDropdown, SectionTabs, useIsMobile, SpeedControl, SPEEDS, Footer, Sa });

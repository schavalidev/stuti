/* ============================================================
   KATHĀ — shared components (icons, scene art, mascot, nav, cards)
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------------- Icons ---------------- */
function KIcon({ name, size = 22, stroke = 2 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", style: { flex: "none" } };
  const m = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></>,
    star: <path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 17l-5.4 2.7 1.2-5.9L3.4 9.7l6-.7z" fill="currentColor" stroke="none" />,
    starline: <path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 17l-5.4 2.7 1.2-5.9L3.4 9.7l6-.7z" />,
    play: <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />,
    pause: <><rect x="7" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" stroke="none" /><rect x="13.6" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" stroke="none" /></>,
    speaker: <><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" stroke="none" /><path d="M16 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" /></>,
    arrowR: <path d="M5 12h14M13 6l6 6-6 6" />,
    arrowL: <path d="M19 12H5M11 18l-6-6 6-6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
    heart: <path d="M12 20s-7-4.5-7-9.3A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7 3.7C19 15.5 12 20 12 20z" fill="currentColor" stroke="none" />,
    leaf: <><path d="M20 4C12 4 5 9 5 17v2h2c8 0 14-6 14-15z" /><path d="M9 17c2-4 5-6 9-7" /></>,
    fox: <><path d="M4 5l5 4M20 5l-5 4" /><path d="M5 8c0 6 3 11 7 11s7-5 7-11" /><circle cx="9.5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" /><path d="M12 15v1" /></>,
    bow: <><path d="M5 4c6 3 6 13 0 16" /><path d="M5 4v16" /><path d="M5 12h15M16 9l4 3-4 3" /></>,
    atom: <><path d="M9.5 3h5M10 3v5.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8.5V3" /><path d="M7.5 14h9" /></>,
    flask: <><path d="M9.5 3h5M10 3v5.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8.5V3" /><path d="M7.5 14h9" /></>,
    diya: <><path d="M4 13c0 3 3.6 5 8 5s8-2 8-5z" /><path d="M4 13c2-1 5-1.5 8-1.5S18 12 20 13" /><path d="M12 10c0-2-1.5-2.5-1.5-4 1.5.7 3 2 3 4z" fill="currentColor" stroke="none" /></>,
    book: <path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z" />,
    sparkle: <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" fill="currentColor" stroke="none" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    home: <path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" />,
    grid: <><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>
  };
  return <svg {...p}>{m[name] || null}</svg>;
}

/* ---------------- Scene art (cheerful placeholder illustrations) ---------------- */
function SceneArt({ name = "forest", accent = "var(--marigold)", style }) {
  const W = 400,H = 260;
  const sky = {
    forest: "#FCEFD0", village: "#FFE7C4", night: "#2A2C66", sky: "#CDEBFF",
    river: "#D7F0FF", scroll: "#FBEAD0", well: "#E7F3D8"
  }[name] || "#FCEFD0";
  const dots = (n, fill, r = 2.4, seed = 1) => Array.from({ length: n }).map((_, i) => {
    const x = (i * 53 + seed * 17) % 380 + 10;
    const y = (i * 41 + seed * 29) % 120 + 14;
    return <circle key={i} cx={x} cy={y} r={r} fill={fill} opacity="0.8" />;
  });
  let content;
  if (name === "night") {
    content = <>
      <rect width={W} height={H} fill={sky} />
      {dots(26, "#FFF1B8", 1.8, 3)}
      <circle cx="320" cy="64" r="34" fill="#FFF1B8" />
      <circle cx="306" cy="58" r="34" fill={sky} />
      <path d={`M0 200 Q100 150 200 196 T400 188 V260 H0 Z`} fill="#1C1E4D" />
      <path d={`M0 224 Q120 196 240 224 T400 216 V260 H0 Z`} fill={accent} opacity="0.9" />
    </>;
  } else if (name === "sky") {
    content = <>
      <rect width={W} height={H} fill={sky} />
      <g className="spin" style={{ transformOrigin: "92px 92px" }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = i / 12 * Math.PI * 2;
          return <line key={i} x1={92 + Math.cos(a) * 40} y1={92 + Math.sin(a) * 40} x2={92 + Math.cos(a) * 56} y2={92 + Math.sin(a) * 56} stroke={accent} strokeWidth="5" strokeLinecap="round" />;
        })}
      </g>
      <circle cx="92" cy="92" r="34" fill={accent} />
      <g fill="#fff">
        <ellipse cx="280" cy="150" rx="46" ry="26" /><ellipse cx="320" cy="150" rx="40" ry="22" /><ellipse cx="250" cy="158" rx="34" ry="20" />
      </g>
      <path d={`M0 220 Q200 196 400 220 V260 H0 Z`} fill={accent} opacity="0.85" />
    </>;
  } else if (name === "river") {
    content = <>
      <rect width={W} height={H} fill={sky} />
      <circle cx="330" cy="58" r="28" fill="var(--marigold)" />
      <path d={`M0 120 Q100 100 200 120 T400 116 V160 H0 Z`} fill="var(--green)" />
      <g fill="#7FD4FF">
        <path d={`M0 150 Q100 130 200 150 T400 146 V260 H0 Z`} />
      </g>
      <g stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none">
        <path d="M40 186 q20 -8 40 0" /><path d="M150 210 q20 -8 40 0" /><path d="M270 192 q20 -8 40 0" />
      </g>
      <circle cx="120" cy="200" r="13" fill={accent} /><circle cx="250" cy="226" r="11" fill={accent} />
    </>;
  } else if (name === "village") {
    const house = (x, c) => <g key={x}><rect x={x} y="150" width="56" height="56" rx="6" fill="#fff" /><path d={`M${x - 6} 150 L${x + 28} 118 L${x + 62} 150 Z`} fill={c} /><rect x={x + 20} y="172" width="16" height="34" rx="3" fill={c} opacity="0.85" /></g>;
    content = <>
      <rect width={W} height={H} fill={sky} />
      <circle cx="60" cy="56" r="28" fill="var(--marigold)" />
      {house(70, "var(--coral)")}{house(170, "var(--blue)")}{house(270, "var(--green)")}
      <rect x="0" y="206" width={W} height="54" fill={accent} opacity="0.9" />
    </>;
  } else if (name === "scroll") {
    content = <>
      <rect width={W} height={H} fill={sky} />
      {dots(10, accent, 3, 5)}
      <rect x="70" y="60" width="260" height="150" rx="14" fill="#FFFCF2" stroke={accent} strokeWidth="4" />
      <g stroke="var(--ink-faint)" strokeWidth="4" strokeLinecap="round" opacity="0.55">
        <path d="M96 96 H300" /><path d="M96 120 H300" /><path d="M96 144 H260" /><path d="M96 168 H284" />
      </g>
      <path d="M300 150 l34 -22 8 14 -30 20 z" fill={accent} />
    </>;
  } else if (name === "well") {
    content = <>
      <rect width={W} height={H} fill={sky} />
      <circle cx="64" cy="56" r="24" fill="var(--marigold)" />
      <path d={`M0 150 Q120 124 240 150 T400 146 V260 H0 Z`} fill="var(--green)" opacity="0.5" />
      <ellipse cx="200" cy="150" rx="92" ry="30" fill="#fff" stroke={accent} strokeWidth="5" />
      <ellipse cx="200" cy="150" rx="64" ry="20" fill="#7FD4FF" />
      <rect x="108" y="150" width="184" height="78" rx="10" fill="#fff" stroke={accent} strokeWidth="5" />
      <g stroke={accent} strokeWidth="4"><path d="M150 150 V228" /><path d="M200 150 V228" /><path d="M250 150 V228" /><path d="M108 188 H292" /></g>
    </>;
  } else {/* forest */
    const tree = (x, c, s = 1) => <g key={x}><rect x={x - 5} y={150} width="10" height={50} rx="4" fill="#B07A43" /><circle cx={x} cy={140} r={26 * s} fill={c} /><circle cx={x - 16 * s} cy={150} r={18 * s} fill={c} /><circle cx={x + 16 * s} cy={150} r={18 * s} fill={c} /></g>;
    content = <>
      <rect width={W} height={H} fill={sky} />
      <circle cx="330" cy="54" r="28" fill="var(--marigold)" />
      {dots(8, accent, 3, 2)}
      <path d={`M0 196 Q100 168 200 196 T400 190 V260 H0 Z`} fill="var(--green)" />
      {tree(80, "#36C26E", 1.1)}{tree(200, "#2CA65C", 1.3)}{tree(320, "#36C26E", 1)}
    </>;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%", ...style }}>
      {content}
    </svg>);

}

/* ---------------- Mascot: Mayuri the peacock ---------------- */
function Peacock({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="float">
      <g>
        {[-32, -16, 0, 16, 32].map((deg, i) =>
        <g key={i} transform={`rotate(${deg} 32 40)`}>
            <line x1="32" y1="40" x2="32" y2="8" stroke="var(--teal)" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="32" cy="8" r="5.5" fill="var(--blue)" />
            <circle cx="32" cy="8" r="2.4" fill="var(--marigold)" />
          </g>
        )}
        <circle cx="32" cy="44" r="13" fill="var(--teal)" />
        <circle cx="32" cy="30" r="7" fill="var(--blue)" />
        <circle cx="29.5" cy="29" r="1.4" fill="#fff" /><circle cx="34.5" cy="29" r="1.4" fill="#fff" />
        <circle cx="29.5" cy="29.3" r="0.7" fill="#2E2A3A" /><circle cx="34.5" cy="29.3" r="0.7" fill="#2E2A3A" />
        <path d="M32 32 l5 2 -5 2 z" fill="var(--marigold)" />
        <line x1="32" y1="22" x2="32" y2="17" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="16" r="2" fill="var(--marigold)" />
      </g>
    </svg>);

}

/* ---------------- Logo ---------------- */
function KLogo({ onClick, small }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: 0, padding: 0 }}>
      <span style={{ width: 46, height: 46, flex: "none", borderRadius: 16, background: "var(--blue)", display: "grid", placeItems: "center", boxShadow: "0 5px 0 rgba(76,107,255,0.28)" }}>
        <span className="deva" style={{ color: "#fff", paddingBottom: 2, fontSize: 25 }}>ॐ</span>
      </span>
      {!small &&
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1, textAlign: "left" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>Akshara</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "var(--ink-faint)", marginTop: 2 }}> The Imperishable</span>
        </span>
      }
    </button>);

}

/* ---------------- Top nav ---------------- */
function KNav({ route, go, saved, child }) {
  const links = [["home", "Home", "home"], ["library", "Stories", "grid"], ["calendar", "Festivals", "diya"]];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,252,245,0.86)", backdropFilter: "blur(10px)", borderBottom: "2px solid var(--line)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 22, height: 80 }}>
        <KLogo onClick={() => go("home")} />
        <nav style={{ display: "flex", gap: 4, marginLeft: 10 }}>
          {links.map(([id, label, icon]) =>
          <button key={id} onClick={() => go(id)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: route === id ? "#fff" : "none", border: 0,
            padding: "10px 16px", borderRadius: 999, fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15,
            color: route === id ? "var(--blue)" : "var(--ink-soft)", boxShadow: route === id ? "var(--shadow-sm)" : "none" }}>
              <KIcon name={icon} size={18} /> {label}
            </button>
          )}
        </nav>
        <div style={{ flex: 1 }} />
        <button onClick={() => go("search")} aria-label="Search" className="btn-ghost"
        style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 999, color: "var(--ink-soft)" }}>
          <KIcon name="search" size={19} />
        </button>
        <button onClick={() => go("shelf")} className="btn-ghost"
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 999, fontWeight: 800, fontSize: 14.5,
          color: route === "shelf" ? "#fff" : "var(--pink)", background: route === "shelf" ? "var(--pink)" : "#fff",
          borderColor: route === "shelf" ? "transparent" : "var(--line)" }}>
          <KIcon name="heart" size={18} /> {saved.size > 0 ? saved.size : ""} Saved
        </button>
        <button onClick={() => go("who")} aria-label="Switch reader" title={child ? child.name : "Who's reading?"}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "2px solid " + (route === "who" ? "var(--blue)" : "var(--line)"), borderRadius: 999, padding: child ? "5px 14px 5px 5px" : 0, height: 44, cursor: "pointer" }}>
          {child ?
          <><KidAvatar child={child} size={32} /><span style={{ fontWeight: 800, fontSize: 14.5, color: "var(--ink)" }}>{child.name}</span></> :
          <span style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: "50%", fontSize: 20 }}>👤</span>}
        </button>
      </div>
    </header>);

}

/* ---------------- Footer ---------------- */
function KFooter({ go }) {
  return (
    <footer style={{ background: "var(--blue)", color: "#fff", marginTop: 90, borderRadius: "40px 40px 0 0" }}>
      <div className="wrap" style={{ padding: "56px 36px 44px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Peacock size={48} />
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800 }}>Akshara</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "var(--yellow)", marginTop: 3 }}>for young minds</span>
              </span>
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", margin: 0 }}>
              Big ideas from Sanātana Dharma, told as little stories — for curious hearts and growing minds.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[["Explore", [["Tales & Fables", "library"], ["Gods & Heroes", "library"], ["Wonder Sciences", "library"], ["Festivals", "calendar"]]],
            ["For grown-ups", [["For parents", "grownups"], ["Parent settings", "gate"], ["How stories teach", "grownups"], ["Switch reader", "who"]]]].map(([h, items]) =>
            <div key={h}>
                <div className="eyebrow" style={{ color: "var(--yellow)", marginBottom: 14 }}>{h}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map(([label, r]) => <li key={label}><a onClick={() => go(r)} style={{ fontWeight: 700, fontSize: 14.5, color: "rgba(255,255,255,0.88)", cursor: "pointer" }}>{label}</a></li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.18)", margin: "36px 0 18px" }} />
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "rgba(255,255,255,0.82)" }}>विद्या ददाति विनयम् · Knowledge gives humility — Akshara, the young readers' library.</div>
      </div>
    </footer>);

}

Object.assign(window, { KIcon, SceneArt, Peacock, KLogo, KNav, KFooter });
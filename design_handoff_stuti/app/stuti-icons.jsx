/* ============================================================
   STUTI — icons + shared primitives
   Line icons, generously stroked for legibility at a glance.
   Exposed on window for the other Babel scripts.
   ============================================================ */

/* Pigment miniatures: a glyph that carries both renderings — the ink line
   (.g-ink) and the full-colour miniature (.g-pig). stuti-pigment.css shows one
   or the other from data-pigment, so the Ink tweak needs no re-render. */
function pig2(p, ink, pigment) {
  return <svg {...p} className="has-pig"><g className="g-ink">{ink}</g><g className="g-pig" stroke="none">{pigment}</g></svg>;
}
const PIG_C = {
  gold: "oklch(0.62 0.12 80)", goldPale: "oklch(0.9 0.05 85)", goldMid: "oklch(0.84 0.07 80)", goldInk: "oklch(0.52 0.1 75)",
  rose: "oklch(0.68 0.13 15)", rosePale: "oklch(0.78 0.1 15)", roseInk: "oklch(0.53 0.14 18)",
  verm: "oklch(0.55 0.13 42)", peacock: "oklch(0.6 0.09 215)", peacockInk: "oklch(0.44 0.09 220)",
  leaf: "oklch(0.62 0.1 145)", leafInk: "oklch(0.48 0.09 145)", glint: "oklch(0.88 0.09 85)",
};
function Icon({ name, size = 24, stroke = 2, filled = false }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  const C = PIG_C;
  switch (name) {
    case "back":   return <svg {...p}><path d="M15 5l-7 7 7 7" /></svg>;
    case "arrow":  return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "home":   return pig2(p,
      <React.Fragment><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></React.Fragment>,
      <React.Fragment><path d="M6 10.5v8.5h12v-8.5z" fill={C.goldPale} stroke={C.goldInk} strokeWidth="1.5" /><path d="M3.6 11.2L12 4l8.4 7.2" fill="none" stroke={C.verm} strokeWidth="2.2" /><path d="M10.4 19v-4.6a1.6 1.6 0 0 1 3.2 0V19z" fill={C.gold} /></React.Fragment>);
    case "grid":   return pig2(p,
      <React.Fragment><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></React.Fragment>,
      <React.Fragment><rect x="3.5" y="3.5" width="7" height="7" rx="2" fill={C.gold} /><rect x="13.5" y="3.5" width="7" height="7" rx="2" fill={C.rose} /><rect x="3.5" y="13.5" width="7" height="7" rx="2" fill={C.peacock} /><rect x="13.5" y="13.5" width="7" height="7" rx="2" fill={C.verm} /></React.Fragment>);
    case "book":   return pig2(p,
      <React.Fragment><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.2z" /><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.2z" /></React.Fragment>,
      <React.Fragment><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.2z" fill={C.goldPale} stroke={C.goldInk} strokeWidth="1.5" /><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.2z" fill={C.goldMid} stroke={C.goldInk} strokeWidth="1.5" /><path d="M8.2 4.4v8l1.7-1.5 1.7 1.5v-8z" fill={C.roseInk} /></React.Fragment>);
    case "play":   return <svg {...p} fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z" /></svg>;
    case "pause":  return <svg {...p} fill="currentColor" stroke="none"><rect x="6.5" y="5.5" width="3.6" height="13" rx="1.2" /><rect x="13.9" y="5.5" width="3.6" height="13" rx="1.2" /></svg>;
    case "next":   return <svg {...p}><path d="M7 5l7 7-7 7" /><path d="M17 5v14" /></svg>;
    case "prev":   return <svg {...p}><path d="M17 5l-7 7 7 7" /><path d="M7 5v14" /></svg>;
    case "sun":    return <svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>;
    case "moon":   return <svg {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" /></svg>;
    case "diya":   return pig2(p,
      <React.Fragment><path d="M4 15.5h16c-.6 3-3.8 5-8 5s-7.4-2-8-5z" fill={filled ? "color-mix(in oklab, currentColor 22%, transparent)" : "none"} />{filled && <path d="M12 12.8c1.5-1.1 2.3-2.4 2.3-4 0-1.5-1-2.9-2.3-4.3-1.3 1.4-2.3 2.8-2.3 4.3 0 1.6.8 2.9 2.3 4z" fill="currentColor" stroke="none" />}{!filled && <path d="M12 13v-1.6" />}</React.Fragment>,
      <React.Fragment>{filled && <path className="diya-flame" d="M12 12.8c1.5-1.1 2.3-2.4 2.3-4 0-1.5-1-2.9-2.3-4.3-1.3 1.4-2.3 2.8-2.3 4.3 0 1.6.8 2.9 2.3 4z" fill={C.gold} stroke="oklch(0.5 0.11 75)" strokeWidth="1.1" strokeLinejoin="round" />}{filled && <path d="M12 11.2c.7-.6 1.1-1.2 1.1-2 0-.7-.5-1.4-1.1-2.1-.6.7-1.1 1.4-1.1 2.1 0 .8.4 1.4 1.1 2z" fill={C.glint} stroke="none" />}{!filled && <path d="M12 13.2v-2" fill="none" stroke="oklch(0.42 0.05 60)" strokeWidth="1.4" strokeLinecap="round" />}<path d="M4 15.5h16c-.6 3-3.8 5-8 5s-7.4-2-8-5z" fill={filled ? C.verm : "oklch(0.82 0.04 50)"} stroke="oklch(0.42 0.11 40)" strokeWidth="1.2" strokeLinejoin="round" />{filled && <path d="M6.2 15.5h11.6c-.5 1.1-1.4 1.9-2.6 2.4H8.8c-1.2-.5-2.1-1.3-2.6-2.4z" fill="oklch(0.66 0.13 45)" stroke="none" />}</React.Fragment>);
    case "lotus":  return pig2(p,
      <React.Fragment><path d="M12 20c-4 0-7-2.4-7-5.5 0 0 2.6.3 4.4 1.7M12 20c4 0 7-2.4 7-5.5 0 0-2.6.3-4.4 1.7" /><path d="M12 20c-2.3 0-3.8-2.4-3.8-5.2 0-2.6 1.7-4.8 3.8-6.3 2.1 1.5 3.8 3.7 3.8 6.3C15.8 17.6 14.3 20 12 20z" /></React.Fragment>,
      <React.Fragment><path d="M12 20c-4 0-7-2.4-7-5.5 0 0 2.6.3 4.4 1.7z" fill={C.leaf} stroke={C.leafInk} strokeWidth="1.2" /><path d="M12 20c4 0 7-2.4 7-5.5 0 0-2.6.3-4.4 1.7z" fill={C.leaf} stroke={C.leafInk} strokeWidth="1.2" /><path d="M12 9.6c0-2.6-1-4.6-2.7-4.6S6.6 7.5 8 9.7 12 14 12 14z" fill={C.rosePale} stroke={C.roseInk} strokeWidth="1.2" /><path d="M12 9.6c0-2.6 1-4.6 2.7-4.6S17.4 7.5 16 9.7 12 14 12 14z" fill={C.rosePale} stroke={C.roseInk} strokeWidth="1.2" /><path d="M12 20c-2.3 0-3.8-2.4-3.8-5.2 0-2.6 1.7-4.8 3.8-6.3 2.1 1.5 3.8 3.7 3.8 6.3C15.8 17.6 14.3 20 12 20z" fill={C.rose} stroke={C.roseInk} strokeWidth="1.4" /></React.Fragment>);
    case "mala":   return pig2(p,
      <React.Fragment><circle cx="12" cy="4.6" r="1.7" /><circle cx="17.4" cy="6.9" r="1.7" /><circle cx="19.6" cy="12.2" r="1.7" /><circle cx="17.3" cy="17.5" r="1.7" /><circle cx="6.6" cy="6.9" r="1.7" /><circle cx="4.4" cy="12.2" r="1.7" /><circle cx="6.7" cy="17.5" r="1.7" /><circle cx="12" cy="19.6" r="2.2" /></React.Fragment>,
      <React.Fragment><g fill={C.verm}><circle cx="12" cy="4.6" r="1.9" /><circle cx="17.4" cy="6.9" r="1.9" /><circle cx="19.6" cy="12.2" r="1.9" /><circle cx="17.3" cy="17.5" r="1.9" /><circle cx="6.6" cy="6.9" r="1.9" /><circle cx="4.4" cy="12.2" r="1.9" /><circle cx="6.7" cy="17.5" r="1.9" /></g><circle cx="12" cy="19.4" r="2.5" fill={C.gold} stroke={C.goldInk} strokeWidth="1.2" /><path d="M12 21.9v1.6" stroke={C.goldInk} strokeWidth="1.3" strokeLinecap="round" /></React.Fragment>);
    case "repeat": return <svg {...p}><path d="M17 3l3 3-3 3" /><path d="M20 6H8a4 4 0 0 0-4 4v1" /><path d="M7 21l-3-3 3-3" /><path d="M4 18h12a4 4 0 0 0 4-4v-1" /></svg>;
    case "speed":  return <svg {...p}><path d="M12 14l4-4" /><path d="M5.5 18.5a9 9 0 1 1 13 0" /></svg>;
    case "text":   return <svg {...p}><path d="M5 6h14M5 6V5M9 6v13M7 19h4" /><path d="M14 11h6M17 11v8M15.5 19h3" /></svg>;
    case "check":  return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
    case "lock":   return <svg {...p}><rect x="4.5" y="10.5" width="15" height="10" rx="2.4" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>;
    case "mail":   return <svg {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.4" /><path d="M4 7l8 6 8-6" /></svg>;
    case "phone":  return <svg {...p}><rect x="6.5" y="2.5" width="11" height="19" rx="2.6" /><path d="M10.6 18.6h2.8" /></svg>;
    case "bell":   return <svg {...p}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
    case "spark":  return pig2(p,
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />,
      <React.Fragment><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" fill={C.peacock} stroke={C.peacockInk} strokeWidth="1.3" /><path d="M12 7.4l.8 2.1 2.1.5-2.1.5-.8 2.1-.8-2.1-2.1-.5 2.1-.5z" fill={C.glint} /><circle cx="18.6" cy="4.6" r="1.2" fill={C.gold} /></React.Fragment>);
    case "warn":   return <svg {...p}><path d="M12 4l9 15.5H3z" /><path d="M12 10v4M12 17h.01" /></svg>;
    /* pigment rendering is a hibiscus — five broad petals and the tell-tale
       protruding stamen — the flower one actually offers in pūjā */
    case "flower": return pig2(p,
      <React.Fragment><circle cx="12" cy="12" r="2.4" fill={filled ? "currentColor" : "none"} /><path d="M12 9.6c0-2.6-1-4.6-2.7-4.6S6.6 7.5 8 9.7M12 9.6c0-2.6 1-4.6 2.7-4.6S17.4 7.5 16 9.7M9.6 13.4c-2.2 1.3-4.5 1.2-5.4-.2S4.7 9.5 7.2 9M14.4 13.4c2.2 1.3 4.5 1.2 5.4-.2S19.3 9.5 16.8 9M10.7 14.8c-.8 2.5-.2 4.7 1.3 4.7s2.1-2.2 1.3-4.7" fill={filled ? "color-mix(in oklab, currentColor 22%, transparent)" : "none"} /></React.Fragment>,
      <React.Fragment><g fill={filled ? "oklch(0.62 0.17 25)" : "oklch(0.72 0.13 22)"} stroke={C.roseInk} strokeWidth="1.1" strokeLinejoin="round"><ellipse cx="12" cy="8.2" rx="3.1" ry="4.6" /><ellipse cx="12" cy="8.2" rx="3.1" ry="4.6" transform="rotate(72 12 13)" /><ellipse cx="12" cy="8.2" rx="3.1" ry="4.6" transform="rotate(144 12 13)" /><ellipse cx="12" cy="8.2" rx="3.1" ry="4.6" transform="rotate(216 12 13)" /><ellipse cx="12" cy="8.2" rx="3.1" ry="4.6" transform="rotate(288 12 13)" /></g><circle cx="12" cy="13" r="1.9" fill="oklch(0.5 0.16 27)" /><path d="M12.6 12.4L18 5.6" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round" /><g fill={C.glint}><circle cx="18.4" cy="5" r="1" /><circle cx="17" cy="4.4" r="0.7" /><circle cx="19.2" cy="6.4" r="0.7" /></g></React.Fragment>);
    /* the nomulu lens's own flower. Recitation already owns the hibiscus, and
       two lenses drawn with the same bloom read as the same shelf — so a nomu
       gets the banti puvvu: the packed pompom strung for a vow, deep red
       rather than the hibiscus rose. */
    case "marigold": return pig2(p,
      <React.Fragment><path d="M12 4.6c1.1 0 2 .7 2.3 1.7.8-.7 2-.8 2.8-.2s1.1 1.8.8 2.8c1 .3 1.7 1.2 1.7 2.3s-.7 2-1.7 2.3c.3 1-.1 2.2-.8 2.8s-2 .5-2.8-.2c-.3 1-1.2 1.7-2.3 1.7s-2-.7-2.3-1.7c-.8.7-2 .8-2.8.2s-1.1-1.8-.8-2.8c-1-.3-1.7-1.2-1.7-2.3s.7-2 1.7-2.3c-.3-1 .1-2.2.8-2.8s2-.5 2.8.2c.3-1 1.2-1.7 2.3-1.7z" fill={filled ? "color-mix(in oklab, currentColor 22%, transparent)" : "none"} /><circle cx="12" cy="11.2" r="3.1" /><path d="M12 18.2v3.2" /></React.Fragment>,
      <React.Fragment><path d="M9.6 18.3c-1.9.2-3.4 1.6-3.6 3.3 1.8.2 3.5-.8 4.2-2.4zM14.4 18.3c1.9.2 3.4 1.6 3.6 3.3-1.8.2-3.5-.8-4.2-2.4z" fill={C.leaf} stroke={C.leafInk} strokeWidth="1" strokeLinejoin="round" /><path d="M12 17.4v4" stroke={C.leafInk} strokeWidth="1.3" strokeLinecap="round" /><path d="M12 4.6c1.1 0 2 .7 2.3 1.7.8-.7 2-.8 2.8-.2s1.1 1.8.8 2.8c1 .3 1.7 1.2 1.7 2.3s-.7 2-1.7 2.3c.3 1-.1 2.2-.8 2.8s-2 .5-2.8-.2c-.3 1-1.2 1.7-2.3 1.7s-2-.7-2.3-1.7c-.8.7-2 .8-2.8.2s-1.1-1.8-.8-2.8c-1-.3-1.7-1.2-1.7-2.3s.7-2 1.7-2.3c-.3-1 .1-2.2.8-2.8s2-.5 2.8.2c.3-1 1.2-1.7 2.3-1.7z" fill="oklch(0.52 0.13 27)" stroke="oklch(0.41 0.11 29)" strokeWidth="1.1" strokeLinejoin="round" /><circle cx="12" cy="11.2" r="3.4" fill="oklch(0.61 0.13 40)" /><circle cx="12" cy="11.2" r="1.4" fill={C.gold} /></React.Fragment>);
    /* the nomu glyph is the vāyanam plate itself — the tied offering of
       turmeric, betel and fruit handed on at the vow's close, banana leaves
       fanned beneath it the way the kalaśa's mango leaves fan its neck */
    case "vayanam": return pig2(p,
      <React.Fragment><ellipse cx="12" cy="14.5" rx="7.3" ry="3.4" /><path d="M6 13.6c-.7-2.6.5-5.2 3-6.4M18 13.6c.7-2.6-.5-5.2-3-6.4" /><circle cx="9.6" cy="14.3" r=".8" fill={filled ? "currentColor" : "none"} /><circle cx="14.4" cy="14.3" r=".8" fill={filled ? "currentColor" : "none"} /></React.Fragment>,
      <React.Fragment><path d="M4.3 12.6c-1.7 1-2.5 3.3-1.7 4.7 1.7-.1 3.2-1.4 3.6-3.2z" fill={C.leaf} stroke={C.leafInk} strokeWidth="1" strokeLinejoin="round" /><path d="M19.7 12.6c1.7 1 2.5 3.3 1.7 4.7-1.7-.1-3.2-1.4-3.6-3.2z" fill={C.leaf} stroke={C.leafInk} strokeWidth="1" strokeLinejoin="round" /><ellipse cx="12" cy="14.8" rx="7.3" ry="3.4" fill={C.gold} stroke={C.goldInk} strokeWidth="1.2" /><ellipse cx="12" cy="14.8" rx="7.3" ry="3.4" fill="none" stroke={C.verm} strokeWidth="1" opacity="0.85" /><circle cx="9.4" cy="14.5" r="1.3" fill={C.verm} /><circle cx="14.6" cy="14.5" r="1.3" fill="oklch(0.6 0.1 55)" stroke="oklch(0.42 0.08 55)" strokeWidth="0.6" /><circle cx="12" cy="15.6" r="1.1" fill="oklch(0.85 0.14 90)" /></React.Fragment>);
    case "list":   return pig2(p,
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
      <React.Fragment><path d="M8 6h12M8 12h12M8 18h12" stroke="oklch(0.45 0.03 60)" strokeWidth="2" strokeLinecap="round" /><g fill={C.gold}><circle cx="4" cy="6" r="1.6" /><circle cx="4" cy="12" r="1.6" /><circle cx="4" cy="18" r="1.6" /></g></React.Fragment>);
    case "globe":  return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z" /></svg>;
    case "chev":   return <svg {...p}><path d="M6 9l6 6 6-6" /></svg>;
    case "locate": return <svg {...p}><path d="M12 21s6.4-5.6 6.4-10.6a6.4 6.4 0 1 0-12.8 0C5.6 15.4 12 21 12 21z" /><circle cx="12" cy="10.4" r="2.4" /></svg>;
    case "copy":   return <svg {...p}><rect x="9" y="9" width="11" height="11" rx="2.2" /><path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" /></svg>;
    case "clock":  return <svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3.2 1.9" /></svg>;
    /* pigment rendering is a kalaśa — the pot set up for any vratam's
       sankalpa: mango leaves fanned at the neck, a coconut crowning it,
       a red thread tied at the rim */
    case "kalasha": return pig2(p,
      <React.Fragment><path d="M8 9.5c0-1.7 1.8-3 4-3s4 1.3 4 3v1.3c1.6.8 2.7 2.4 2.7 4.3 0 3-3 5.4-6.7 5.4s-6.7-2.4-6.7-5.4c0-1.9 1.1-3.5 2.7-4.3z" /><path d="M6.5 10l-2.3-3M12 10.3V6M17.5 10l2.3-3" /></React.Fragment>,
      <React.Fragment><path d="M8 10.8c0-1.7 1.8-3 4-3s4 1.3 4 3v1c1.6.8 2.7 2.4 2.7 4.3 0 3-3 5.4-6.7 5.4s-6.7-2.4-6.7-5.4c0-1.9 1.1-3.5 2.7-4.3z" fill={C.gold} stroke={C.goldInk} strokeWidth="1.2" strokeLinejoin="round" /><path d="M5.4 14.3a8.2 8.2 0 0 0 13.2 0" fill="none" stroke={C.verm} strokeWidth="1" opacity="0.85" /><circle cx="12" cy="17.4" r="1.5" fill={C.verm} /><path d="M9.7 20.2c.6.3 1.4.5 2.3.5s1.7-.2 2.3-.5" fill="none" stroke={C.verm} strokeWidth="1" opacity="0.8" /><path d="M6.5 10.2l-2.3-3.1M17.5 10.2l2.3-3.1" fill="none" stroke={C.leafInk} strokeWidth="1.5" strokeLinecap="round" /><path d="M4.2 6.9c-2 1-2.9 3.5-2 5.1 1.9-.1 3.6-1.5 4.1-3.5zM19.8 6.9c2 1 2.9 3.5 2 5.1-1.9-.1-3.6-1.5-4.1-3.5z" fill={C.leaf} stroke={C.leafInk} strokeWidth="1" strokeLinejoin="round" /><path d="M9.3 9.3c0-1.4 1.2-2.5 2.7-2.5s2.7 1.1 2.7 2.5v1.4c-.8-.3-1.7-.5-2.7-.5s-1.9.2-2.7.5z" fill="oklch(0.6 0.1 55)" stroke="oklch(0.42 0.08 55)" strokeWidth="1" /><path d="M12 8.6v2.4" stroke={C.verm} strokeWidth="1.2" strokeLinecap="round" /><circle cx="12" cy="11.6" r="0.85" fill={C.verm} /></React.Fragment>);
    case "mic":    return <svg {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" /></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.4-3.4" /></svg>;
    /* sliders, not a cogwheel: a toothed ring reads as mush at 24px, and a
       spoked circle is indistinguishable from the sun beside it */
    case "share":  return <svg {...p}><circle cx="18" cy="5.5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="18.5" r="2.6" /><path d="M8.3 10.8l7.4-4M8.3 13.2l7.4 4" /></svg>;
    case "print":  return <svg {...p}><path d="M7 9V3.5h10V9" /><rect x="3.5" y="9" width="17" height="7.5" rx="2" /><path d="M7 14h10v6.5H7z" /></svg>;
    case "cog":
    case "gear":   return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;
    case "sliders":return <svg {...p}><path d="M4 7h6M14 7h6M4 12h10M18 12h2M4 17h4M12 17h8" /><circle cx="12" cy="7" r="2.1" /><circle cx="16" cy="12" r="2.1" /><circle cx="10" cy="17" r="2.1" /></svg>;
    case "calendar": return pig2(p,
      <React.Fragment><rect x="3.5" y="4.5" width="17" height="16" rx="2.5" /><path d="M3.5 9.5h17M8 3v3M16 3v3" /></React.Fragment>,
      <React.Fragment><rect x="3.5" y="4.5" width="17" height="16" rx="2.5" fill="oklch(0.96 0.02 85)" stroke={C.goldInk} strokeWidth="1.5" /><path d="M3.5 7a2.5 2.5 0 0 1 2.5-2.5h12A2.5 2.5 0 0 1 20.5 7v2.5h-17z" fill={C.verm} /><path d="M8 3v3M16 3v3" stroke="oklch(0.35 0.05 60)" strokeWidth="1.8" strokeLinecap="round" /><g fill={C.gold}><circle cx="8" cy="13" r="1.2" /><circle cx="12" cy="13" r="1.2" /><circle cx="16" cy="13" r="1.2" /><circle cx="8" cy="17" r="1.2" /><circle cx="12" cy="17" r="1.2" /></g></React.Fragment>);
    case "close":  return <svg {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case "pin":    return <svg {...p}><path d="M9.5 3.5h5l-.8 5.5 3.3 3.5H7l3.3-3.5z" /><path d="M12 12.5V20" /></svg>;
    case "chevron-left": return <svg {...p}><path d="M15 6l-6 6 6 6" /></svg>;
    case "chevron-right": return <svg {...p}><path d="M9 6l6 6-6 6" /></svg>;
    case "pray":   return <svg {...p}><path d="M8 6v4c0 2.2.9 4 2 5.2M16 6v4c0 2.2-.9 4-2 5.2M10 16.2c1.2 1.5 2.2 2.8 2 4.8" /><path d="M9 10l6 0" /></svg>;
    default: return null;
  }
}

/* A small steady oil-lamp flame, used as the brand mark + reciter pulse */
function Flame({ size = 28, lit = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 28" fill="none"
      style={{ overflow: "visible" }}>
      <g className={lit ? "flame-lit" : ""} style={{ transformOrigin: "12px 11px" }}>
        <path d="M12 1.5c2.6 3.2 5.4 5.7 5.4 9.4A5.4 5.4 0 0 1 12 16.3a5.4 5.4 0 0 1-5.4-5.4C6.6 7.2 9.4 4.7 12 1.5z"
          fill="var(--accent)" />
        <path d="M12 6.2c1.3 1.9 2.6 3.2 2.6 5.2A2.6 2.6 0 0 1 12 14a2.6 2.6 0 0 1-2.6-2.6C9.4 9.4 10.7 8.1 12 6.2z"
          fill="color-mix(in oklab, var(--accent) 30%, #fff)" />
      </g>
    </svg>
  );
}

/* Set the per-deity accent hue on any wrapper. Śiva is karpūra-gaura
   (ash/white, not blue) — near-neutral chroma; others keep full chroma. */
const DEITY_CHROMA = { shiva: 0.15 };
function deityStyle(d, extra) {
  const s = { ...(extra || {}), "--deity-hue": d ? d.hue : 36 };
  if (d && DEITY_CHROMA[d.id] != null) s["--deity-chroma"] = DEITY_CHROMA[d.id];
  return s;
}

/* deities whose seal shows a drawn emblem (an alpha silhouette, tinted to the
   accent) in place of the bīja. Files live in emblems/. */
const DEITY_EMBLEM = {
  ganesha: "emblems/ganesha-face",
  shiva: "emblems/shiva-face",
  devi: "emblems/devi-face",
  vishnu: "emblems/vishnu-face",
  subrahmanya: "emblems/subrahmanya-face",
  surya: "emblems/surya-face",
  guru: "emblems/guru-face",
  hanuman: "emblems/hanuman-face",
};

/* deities whose seal shows the painting itself — full colour on its own
   ground, in place of the tinted plate + ratna stone */
const DEITY_COLOUR = { devi: "emblems/devi-face-colour.png", ganesha: "emblems/ganesha-face-colour.png", shiva: "emblems/shiva-face-colour.png", vishnu: "emblems/vishnu-face-colour.png", subrahmanya: "emblems/subrahmanya-face-colour.png", guru: "emblems/guru-face-colour.png" };

/* A reusable deity seal — the deity's drawn emblem, pre-tinted for day + night;
   CSS shows the right one. There is no bīja fallback: a seed syllable is
   received from a guru, not displayed to whoever opens the app. */
function Seal({ d, size = 56, fontScale = 0.42, style }) {
  const emblem = d && DEITY_EMBLEM[d.id];
  const colour = d && DEITY_COLOUR[d.id];
  if (colour) return (
    <div className="seal seal--colour" style={{ width: size, height: size, ...deityStyle(d), ...style }}>
      <img className="seal-emblem seal-emblem--colour" src={colour} alt="" draggable="false" />
    </div>
  );
  return (
    <div className="seal" style={{ width: size, height: size, fontSize: Math.round(size * fontScale), ...deityStyle(d), ...style }}>
      {emblem ? (
        <React.Fragment>
          <img className="seal-emblem seal-emblem--day" src={emblem + "-day.png"} alt="" draggable="false" />
          <img className="seal-emblem seal-emblem--night" src={emblem + "-night.png"} alt="" draggable="false" />
        </React.Fragment>
      ) : null}
    </div>
  );
}

/* Tap-scale wrapper that respects reduced-motion automatically via CSS */
function press(e) {}

/* The bare emblem (no disc) — day + night, pre-tinted; CSS shows the right one.
   Falls back to the bīja when a deity has no drawn emblem. */
function Emblem({ d, variant, className = "", style }) {
  const e = d && DEITY_EMBLEM[d.id];
  if (!e) return null;   /* no bīja fallback — see Seal above */
  const sfx = variant === "ink" ? ["-inkday.png", "-inknight.png"] : ["-day.png", "-night.png"];
  return (
    <React.Fragment>
      <img className={"emblem-img emblem-img--day " + className} src={e + sfx[0]} alt="" draggable="false" style={style} />
      <img className={"emblem-img emblem-img--night " + className} src={e + sfx[1]} alt="" draggable="false" style={style} />
    </React.Fragment>
  );
}

/* favourites: subscribe to the store and re-render on change */
function useFavs() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => window.STUTI_FAVS.subscribe(() => force()), []);
  return window.STUTI_FAVS;
}

/* a round "offer a flower" toggle — adds a hymn to the daily recitation */
function FavButton({ id, size = 24, className = "", lang, weekday }) {
  const isWeek = weekday !== undefined && weekday !== null;
  const store = isWeek ? window.STUTI_FAVS_WEEK : window.STUTI_FAVS;
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => store.subscribe(() => force()), [isWeek, weekday]);
  const on = isWeek ? store.has(id, weekday) : store.has(id);
  /* offering a flower answers with a small scatter of petals */
  const [burst, setBurst] = React.useState(false);
  React.useEffect(() => { if (!burst) return; const t = setTimeout(() => setBurst(false), 700); return () => clearTimeout(t); }, [burst]);
  /* the label is spoken, not seen, so it still owes the reciter their own
     script — callers rarely pass lang, so fall back to the stored choice */
  let lg = lang;
  if (!lg) { try { lg = localStorage.getItem("stuti-lang") || "deva"; } catch (e) { lg = "deva"; } }
  return (
    <button
      className={"fav-btn" + (on ? " on" : "") + (className ? " " + className : "")}
      aria-pressed={on}
      aria-label={window.STUTI_L.t(on ? "favRemove" : "favAdd", lg)}
      onClick={(e) => { e.stopPropagation(); if (!on) setBurst(true); isWeek ? store.toggle(id, weekday) : store.toggle(id); }}
    >
      <Icon name="diya" size={size} filled={on} />
      {burst && <span className="fav-burst" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--a": (i * 72 - 90) + "deg", "--dl": (i * 0.035) + "s" }} />)}</span>}
    </button>
  );
}

/* A vow points at its deity, not at a hand-picked shelf of hymns.
   The list a vrata or nomu "should" recite grows every time the library
   does, and a frozen set of four is wrong the day the fifth is added —
   so the guides send the reciter to the deity's own page, which is
   already the complete and self-updating answer.

   `from` is a VIEW name, not a lens id: the router reads it for both the
   back arrow and the lit tab, so a lens id there leaves the deity page
   with no tab lit and a back arrow that drops to Home. "browse" is the
   right answer and not merely the safe one — the library hub holds its
   lens and open guide in App state, so returning to it lands the reciter
   back on the guide they were reading. */
function DeityLink({ d, go, lang }) {
  const L = window.STUTI_L;
  if (!d) return null;
  return (
    <button className="vr-row" style={deityStyle(d)}
      onClick={() => go("deity", { deity: d.id, from: "browse" })}>
      <Seal d={d} size={40} />
      <span className="vr-row-body">
        <span className="vr-row-name display" style={{ fontFamily: L.font(lang) }}>{L.name(d, lang)}</span>
        <span className="vr-row-rule">{L.t("deityTextsSub", lang)}</span>
      </span>
      <span className="vr-row-when"><Icon name="arrow" size={18} /></span>
    </button>
  );
}

Object.assign(window, { Icon, Flame, Seal, Emblem, deityStyle, useFavs, FavButton, DeityLink });

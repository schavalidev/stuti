import { Icon } from "./stuti-icons";
import React from "react";
import { STUTI_L } from "./stuti-i18n";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { STUTI_SK } from "./stuti-sankalpa-data";
import { STUTI_LOC } from "./stuti-store";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — Pañcāṅga (the daily almanac, for saṅkalpa)
   Built on the astronomical engine (AKSHARA_PANCHANGA):
   vāra · tithi · pakṣa from real moon-phase math; nakṣatra,
   māsa, ṛtu, ayana derived. Saṃvatsara added here.
   This card is the hero of the home: the day's coordinates a
   devotee needs to speak the saṅkalpa, with the deity-of-the-
   day folded in as a small reference at the foot.
   ============================================================ */
const { useState: usePS, useEffect: usePE } = React;

/* The sixty-year cycle, the graha vāra names, the gotra list, the karma
   the saṅkalpa closes with, and the Devanāgarī for the engine's yogas and
   karaṇas all live in stuti-sankalpa-data.js now — the website says a
   saṅkalpa too, and two copies of the sixty names is how two of them came
   to be corrupt. Named here so the rest of this file reads as it did. */
const SK_DATA = STUTI_SK;
const SAMVATSARA = SK_DATA.SAMVATSARA, YOGA_DEVA = SK_DATA.YOGA_DEVA, KARANA_DEVA = SK_DATA.KARANA_DEVA;
const samvatsaraFor = SK_DATA.samvatsaraFor;

/* A quiet, dimensional moon: the lit limb is a gold with real shading, the
   dark side keeps a faint earthshine, the terminator is softened, and three
   maria sit in the surface at whisper opacity. The halo breathes slowly. */
function MoonPhase({ phase, size = 46 }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const r = size / 2;
  const cos = Math.cos(2 * Math.PI * phase);
  const rx = Math.abs(r * cos);
  const waxing = phase < 0.5;
  const gibbous = phase > 0.25 && phase < 0.75;
  const semi = waxing
    ? `M${r},0 A${r},${r} 0 0 1 ${r},${size}`
    : `M${r},0 A${r},${r} 0 0 0 ${r},${size}`;
  const sweep = waxing ? (gibbous ? 1 : 0) : (gibbous ? 0 : 1);
  const term = `A${rx},${r} 0 0 ${sweep} ${r},0`;
  /* highlight sits toward the lit limb */
  const hx = waxing ? "68%" : "32%";
  return (
    <svg className="moonp" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ flex: "none", overflow: "visible" }}>
      <defs>
        <radialGradient id={`ml${uid}`} cx={hx} cy="36%" r="80%">
          <stop offset="0%" stopColor="var(--moon-lit-hi)" />
          <stop offset="55%" stopColor="var(--moon-lit)" />
          <stop offset="100%" stopColor="var(--moon-lit-lo)" />
        </radialGradient>
        <radialGradient id={`md${uid}`} cx="42%" cy="38%" r="85%">
          <stop offset="0%" stopColor="var(--moon-dark-hi)" />
          <stop offset="100%" stopColor="var(--moon-dark)" />
        </radialGradient>
        <filter id={`mb${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={Math.max(0.6, size / 46)} />
        </filter>
        <clipPath id={`mc${uid}`}><circle cx={r} cy={r} r={r} /></clipPath>
      </defs>
      <circle cx={r} cy={r} r={r} fill={`url(#md${uid})`} />
      <g clipPath={`url(#mc${uid})`}>
        <path d={`${semi} ${term} Z`} fill={`url(#ml${uid})`} filter={`url(#mb${uid})`} />
        {/* maria — barely-there surface, on the lit side */}
        <g fill="var(--moon-mare)" opacity="0.4">
          <circle cx={r * (waxing ? 1.38 : 0.62)} cy={r * 0.68} r={r * 0.20} />
          <circle cx={r * (waxing ? 1.18 : 0.82)} cy={r * 1.22} r={r * 0.14} />
          <circle cx={r * (waxing ? 1.52 : 0.48)} cy={r * 1.06} r={r * 0.09} />
        </g>
      </g>
      <circle cx={r} cy={r} r={r - 0.5} fill="none" stroke="var(--moon-ring)" strokeWidth="1" />
    </svg>
  );
}

const VARA_GRAHA = SK_DATA.VARA_GRAHA, GOTRAS = SK_DATA.GOTRAS, KARMAS = SK_DATA.KARMAS;
const skNorm = SK_DATA.skNorm;

/* the font for a given reading script */

/* ------------------------------------------------------------
   Location: a shared hook + a self-contained chip+menu control.
   The pañcāṅga and the home greeting both use these, reading the
   single STUTI_LOC store so the chosen place stays in sync.
   ------------------------------------------------------------ */
function useLoc() {
  const LOC = STUTI_LOC;
  const LOCS = AKSHARA_PANCHANGA.locations;
  const [, force] = usePS(0);
  usePE(() => LOC.subscribe(() => force(n => n + 1)), []);
  const locId = LOC.getLocId();
  const detected = LOC.getDetected();
  const geo = LOC.getGeo();
  const loc = (locId === "detected" && detected) ? detected : (LOCS.find(l => l.id === locId) || LOCS[0]);
  return { locId, detected, geo, loc, LOCS, setLocId: LOC.setLocId, detect: LOC.detect };
}

const locFold = (s) => STUTI_TRANSLIT.fold(s);

function LocationControl() {
  const { locId, detected, geo, loc, LOCS, setLocId, detect } = useLoc();
  const [open, setOpen] = usePS(false);
  const [q, setQ] = usePS("");
  const qf = locFold(q).trim();
  const matches = qf
    ? LOCS.filter(l => locFold(l.city + " " + l.region + " " + (l.alt || "")).indexOf(qf) !== -1).slice(0, 80)
    : LOCS.filter(l => l.top);
  const choose = (id) => { setLocId(id); setQ(""); setOpen(false); };
  return (
    <div className={"locctl" + (open ? " open" : "")}>
      <button className="loc-chip" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}>
        {loc.city}
      </button>
      {open && (
        <React.Fragment>
          <div className="loc-scrim" onClick={() => { setOpen(false); setQ(""); }} />
          <div className="loc-menu loc-menu-float" role="listbox">
            <div className="loc-head">
              <div className="loc-search">
                <Icon name="search" size={16} />
                <input value={q} onChange={e => setQ(e.target.value)} autoFocus
                  placeholder={"Search " + LOCS.length + " cities"} autoComplete="off" spellCheck="false" />
                {q && <button className="loc-search-clear" onClick={() => setQ("")} aria-label={STUTI_L.a("aClear")}>×</button>}
              </div>
              <button className="loc-detect" onClick={() => detect(() => { setQ(""); setOpen(false); })} disabled={geo === "locating"}>
                <Icon name="locate" size={17} />
                {geo === "locating" ? "Locating…" : "Detect my location"}
              </button>
              {(geo === "denied" || geo === "error") && (
                <div className="loc-msg">
                  {geo === "denied"
                    ? "Location permission was denied — search for your city instead."
                    : "Couldn’t detect your location — search for your city instead."}
                </div>
              )}
            </div>
            <div className="loc-list">
              {detected && !qf && (
                <button className={"loc-detected" + (locId === "detected" ? " on" : "")} onClick={() => choose("detected")}>
                  <span className="loc-detected-pin"><Icon name="locate" size={16} /></span>
                  <span className="loc-detected-body">{detected.city}<i>{detected.region}</i></span>
                </button>
              )}
              {!qf && <div className="loc-cap">Frequently chosen</div>}
              {matches.map(l => (
                <button key={l.id} className={"loc-opt" + (l.id === locId ? " on" : "")} onClick={() => choose(l.id)}>
                  {l.city}<span>{l.region}</span>
                </button>
              ))}
              {qf && matches.length === 0 && (
                <div className="loc-msg loc-none">No city by that name. Try the nearest large town, or detect your location.</div>
              )}
              {!qf && <div className="loc-cap loc-cap-end">Type to search all {LOCS.length} places</div>}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
function scriptFont(script) {
  return script === "telugu" ? "var(--font-telugu)"
       : script === "roman"  ? "var(--font-display)"
       :                       "var(--font-deva)";
}

/* ṛtu → ambient weather motif + hue. Keyed by IAST season name.
   Hues are tokens (stuti.css) so the season strip moves with the palette and
   is written once instead of once here and once in the ambient CSS. */
const RTU_VIS = {
  "Śiśira":  { kind: "mist",     hue: "var(--rtu-sisira)"  }, // late winter — Sankranti fog, veiled sun
  "Vasanta": { kind: "blossom",  hue: "var(--rtu-vasanta)" }, // spring — blossoms let go
  "Grīṣma":  { kind: "sun-hot",  hue: "var(--rtu-grisma)"  }, // summer — blazing sun
  "Varṣā":   { kind: "rain",     hue: "var(--rtu-varsa)"   }, // monsoon — cloud + rain
  "Śarad":   { kind: "leaf",     hue: "var(--rtu-sarad)"   }, // autumn — turning leaf
  "Hemanta": { kind: "sun-cold", hue: "var(--rtu-hemanta)" }, // early winter — frost and snowflakes
};

/* a small season glyph — hand-tuned SVG per motif */
function RtuGlyph({ kind, size = 30 }) {
  const s = size, c = "currentColor";
  const sun = (rays, r = 7) => (
    <g>
      <circle cx="16" cy="16" r={r} fill={c} />
      {rays && [...Array(8)].map((_, i) => {
        const a = (i * Math.PI) / 4, x = 16 + Math.cos(a), y = 16 + Math.sin(a);
        return <line key={i} x1={16 + Math.cos(a) * (r + 2)} y1={16 + Math.sin(a) * (r + 2)}
          x2={16 + Math.cos(a) * (r + 2 + rays)} y2={16 + Math.sin(a) * (r + 2 + rays)}
          stroke={c} strokeWidth="1.7" strokeLinecap="round" />;
      })}
    </g>
  );
  const cloud = (
    <path d="M8 21 q-3 0 -3 -3 q0 -3 3 -3 q0.4 -4 4.5 -4 q3.7 0 4.4 3.4 q0.6 -0.4 1.6 -0.4 q2.5 0 2.5 2.5 q2 0.2 2 2.3 q0 2.6 -2.8 2.6 Z"
      fill={c} />
  );
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {kind === "sun-hot"  && sun(6, 6.5)}
      {kind === "sun-cold" && sun(3, 6)}
      {kind === "blossom"  && (
        <g fill={c}>
          {[...Array(5)].map((_, i) => {
            const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            return <ellipse key={i} cx={16 + Math.cos(a) * 6.4} cy={16 + Math.sin(a) * 6.4} rx="3.4" ry="5.2"
              transform={`rotate(${(a * 180) / Math.PI + 90} ${16 + Math.cos(a) * 6.4} ${16 + Math.sin(a) * 6.4})`} opacity="0.9" />;
          })}
          <circle cx="16" cy="16" r="2.6" />
        </g>
      )}
      {kind === "rain" && (
        <g>
          {cloud}
          {[10, 15.5, 21].map((x, i) => (
            <line key={i} x1={x} y1="23" x2={x - 1.6} y2="28" stroke={c} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
          ))}
        </g>
      )}
      {kind === "leaf" && (
        <g fill={c}>
          <path d="M23 7 C13 8 8 14 8 22 C8 24 9 25 11 25 C20 25 25 17 25 9 C25 8 24 7 23 7 Z" opacity="0.92" />
          <path d="M20 11 L11.5 22.5" stroke="var(--surface)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
      )}
      {kind === "mist" && (
        <g stroke={c} strokeWidth="2.1" strokeLinecap="round" fill="none">
          <path d="M6 11 q5 -2.5 10 0 t10 0" opacity="0.45" />
          <path d="M6 16 q5 -2.5 10 0 t10 0" opacity="0.75" />
          <path d="M6 21 q5 -2.5 10 0 t10 0" opacity="0.55" />
        </g>
      )}
    </svg>
  );
}

/* ayana — the sun's half-year course. Arc + sun + direction the arc is bending. */
function AyanaGlyph({ uttar, size = 30 }) {
  const c = "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"
      style={{ transform: uttar ? "none" : "scaleY(-1)" }}>
      {/* horizon */}
      <line x1="4" y1="24" x2="28" y2="24" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      {/* the sun's rising arc toward its solstice */}
      <path d="M5 24 Q16 4 27 12" stroke={c} strokeWidth="1.9" fill="none" strokeLinecap="round" strokeDasharray="1.5 3.2" opacity="0.75" />
      {/* arrowhead at the arc's leading end */}
      <path d="M27 12 l-4.6 -0.4 M27 12 l-1.1 4.5" stroke={c} strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14.5" cy="9.4" r="4" fill={c} />
    </svg>
  );
}

/* a six-armed dendritic crystal: one arm drawn, then rotated five times.
   The centre carries a small highlight that twinkles as the flake falls. */
function Snowflake() {
  const arm = (
    <g>
      <path className="flake-arm" strokeWidth="1.15" d="M12 12 L12 1.6" />
      <path className="flake-arm" strokeWidth="1" d="M12 8.6 L15.5 5.5 M12 8.6 L8.5 5.5" />
      <path className="flake-arm" strokeWidth="0.85" d="M12 5.4 L14.5 3.3 M12 5.4 L9.5 3.3" />
      <path className="flake-arm" strokeWidth="0.75" d="M12 1.6 L13.4 3.4 M12 1.6 L10.6 3.4" />
    </g>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a} 12 12)`}>{arm}</g>
      ))}
      <circle className="flake-core" cx="12" cy="12" r="1.5" />
      <g className="flake-spark">
        <line x1="12" y1="7.4" x2="12" y2="16.6" />
        <line x1="7.4" y1="12" x2="16.6" y2="12" />
      </g>
    </svg>
  );
}

/* Śarad falls in three states at once — still green, half-turned, spent — so
   the leaves cycle six shades rather than sharing the season's one pigment */
/* and Vasanta lets go of a mixed orchard: six blossom shades at four sizes,
   so no two that fall together match in colour or in scale */
const BLOOM_SHADES = ["var(--bloom-pink-1)", "var(--bloom-yellow-1)", "var(--bloom-violet-1)", "var(--bloom-orange-1)", "var(--bloom-pink-2)", "var(--bloom-violet-2)", "var(--bloom-yellow-2)", "var(--bloom-orange-2)"];
const BLOOM_FORMS = ["f-bloom", "f-rosette"];
const BLOOM_SIZES = { "f-bloom": [17, 14, 19], "f-rosette": [16, 13, 18] };

const LEAF_SHADES = ["var(--leaf-green-1)", "var(--leaf-gold-1)", "var(--leaf-brown-1)", "var(--leaf-green-2)", "var(--leaf-gold-2)", "var(--leaf-brown-2)"];

/* subtle animated ambient behind the card content, matched to the season.
   `dense` scales the particle count for full-screen use. */
function SeasonAmbient({ kind, dense, mix, heat, sunHue, sunBright, mild, sunStatic, noSun, noMango }) {
  if (mix) {
    return (
      <span className="pcard-mix" aria-hidden="true">
        {mix.map((k, i) => <span key={i} className="pcard-mix-layer" style={k === "sun-hot" ? { "--rtu": sunHue || "var(--rtu-grisma)", opacity: sunBright ? 1 : undefined } : k === "mist" ? { "--rtu": "var(--rtu-sisira)" } : k === "rain" ? { "--rtu": "var(--rtu-varsa)" } : undefined}><SeasonAmbient kind={k} dense={dense} mild heat={k === "sun-hot" ? heat !== false : undefined} noMango={k === "sun-hot"} sunStatic={k === "sun-hot"} sunBright={sunBright} noSun={k === "mist" && mix.indexOf("sun-hot") !== -1} /></span>)}
      </span>
    );
  }
  return <SeasonAmbientOne kind={kind} dense={dense} heat={heat} mild={mild} sunStatic={sunStatic} sunBright={sunBright} noSun={noSun} noMango={noMango} />;
}
function SeasonAmbientOne({ kind, dense, mild, heat, sunStatic, sunBright, noSun, noMango }) {
  /* mild wins over dense: a transition month keeps a light hand even on the
     full-screen backdrops — half strength there, a fifth on small cards */
  const scale = (base) => mild ? Math.max(1, Math.round(base * (dense ? 0.5 : 0.2))) : dense ? Math.round(base * 2) : base;
  const n = scale;
  if (kind === "rain") {
    return (
      <div className="pcard-ambient rain" aria-hidden="true">
        {[...Array(3)].map((_, i) => <span key={"c" + i} className="rain-cloud" style={{
          top: `${dense ? 3 + i * 5 : 4 + i * 9}%`, width: `${dense ? 18 + i * 5 : 34 + i * 10}%`, height: `${dense ? 4 + i : 14 + i * 3}%`,
          animationDelay: `${i * -14}s`, animationDuration: `${(dense ? 46 : 34) + i * 12}s`,
        }} />)}
        {[...Array(n(14))].map((_, i) => <span key={i} style={{ left: `${(i * 7 + 4) % 100}%`, animationDelay: `${(i % 9) * 0.24}s`, animationDuration: `${(dense ? 1.5 : 0.9) + (i % 4) * 0.18}s` }} />)}
      </div>
    );
  }
  if (kind === "sun-hot") {
    return (
      <div className="pcard-ambient shimmer" aria-hidden="true">
        {heat !== false && [...Array(mild ? 2 : 3)].map((_, i) => <span key={i} className="heat-wave" style={{ bottom: "50%", marginBottom: "-26px", animationDelay: `${i * -2.7}s`, animationDuration: "8s" }} />)}
        {!noMango && [...Array(mild ? 1 : dense ? 3 : 2)].map((_, i) => <span key={"m" + i} className="mango-fall" style={{ left: `${(i * 31 + 12) % 88}%`, animationDelay: `${i * -4.6}s`, animationDuration: `${11 + (i % 3) * 2}s`, transform: `scale(${0.85 + (i % 3) * 0.15})` }} />)}
        <span className="mango-bunch" />
        <span className="sun-arc" style={sunStatic ? (sunBright ? { filter: "brightness(1.02)", boxShadow: "0 0 24px 8px color-mix(in oklab, var(--rtu) 26%, transparent)" } : { opacity: 0.6, filter: "brightness(0.9) saturate(0.9)", boxShadow: "0 0 28px 10px color-mix(in oklab, var(--rtu) 26%, transparent)" }) : undefined} />
      </div>
    );
  }
  if (kind === "blossom") {
    return (
      <div className="pcard-ambient bough" aria-hidden="true">
        {[...Array(n(9))].map((_, i) => {
          const form = BLOOM_FORMS[i % BLOOM_FORMS.length], size = BLOOM_SIZES[form][i % 3];
          return <span key={i} className={"bough-petal " + form} style={{
            left: `${(i * 11 + 4) % 94}%`, animationDelay: `${i * 1.3}s`, animationDuration: `${(dense ? 10 : 7) + (i % 4) * 1.4}s`,
            width: size, height: size, "--pet": BLOOM_SHADES[i % BLOOM_SHADES.length],
          }} />;
        })}
        {[...Array(dense ? 3 : 2)].map((_, i) => <span key={"lf" + i} className="bough-leaf" style={{
          left: `${18 + i * 34}%`, animationDelay: `${4 + i * 6}s`, animationDuration: `${(dense ? 11 : 8) + i * 1.5}s`,
          "--leaf": i % 2 ? "var(--leaf-green-1)" : "var(--leaf-green-2)",
        }} />)}
      </div>
    );
  }
  if (kind === "sun-cold") {
    const ns = n(12), nf = n(7);
    return (
      <div className="pcard-ambient frost" aria-hidden="true">
        {[...Array(ns)].map((_, i) => <span key={i} style={{ left: `${((i + 0.7) * (94 / ns) + (i % 3) * 5) % 100}%`, animationDelay: `${(i % 7) * 1.6}s`, animationDuration: `${(dense ? 13 : 8) + (i % 4) * 2.5}s` }} />)}
        {[...Array(nf)].map((_, i) => <span key={"f" + i} className="frost-flake" style={{
          left: `${((i + 0.25) * (90 / nf) + (i % 2) * 8) % 96}%`, animationDelay: `${(i % 7) * 2}s`, animationDuration: `${(dense ? 16 : 11) + (i % 3) * 3}s`,
          width: [22, 16, 27][i % 3], height: [22, 16, 27][i % 3],
        }}><Snowflake /></span>)}
      </div>
    );
  }
  if (kind === "leaf") {
    /* Śarad drops leaves in three states at once — still green, half-turned,
       spent — so the shades cycle rather than repeat one pigment */
    const nl = n(6);
    return (
      <div className="pcard-ambient leaves" aria-hidden="true">
        {[...Array(nl)].map((_, i) => <span key={i} style={{
          left: `${((i + 0.6) * (90 / nl) + (i % 2) * 7) % 96}%`,
          animationDelay: `${i * 1.2}s`,
          animationDuration: `${(dense ? 11 : 6) + (i % 3) * 1.5}s`,
          "--leaf": LEAF_SHADES[i % LEAF_SHADES.length],
        }} />)}
      </div>
    );
  }
  if (kind === "mist") {
    return (
      <div className="pcard-ambient mist" aria-hidden="true">
        {[...Array(3)].map((_, i) => <span key={i} className="mist-band" style={{
          top: `${8 + i * 22}%`, height: `${20 + i * 6}%`, width: `${74 + i * 16}%`,
          animationDelay: `${i * -9}s`, animationDuration: `${26 + i * 7}s`,
        }} />)}
        <span className="mist-pool" />
        {[...Array(dense ? 7 : 4)].map((_, i) => <span key={"d" + i} className="mist-dew" style={{
          left: dense ? `${7 + i * 13.5}%` : `${30 + i * 17}%`,
          bottom: dense ? `${3 + (i % 2) * 4}%` : `${8 + (i % 2) * 6}%`,
          animationDelay: `${(i * 1.3).toFixed(1)}s`,
          "--dsc": (0.85 + (i % 3) * 0.2).toFixed(2),
        }} />)}
      </div>
    );
  }

  return null; // nothing left without motion
}

/* a single limb cell — renders its headword in the chosen reading script */
function Limb({ label, main, sub, script, glyph, glyphColor }) {
  return (
    <div className="limb">
      <div className="limb-label" style={script === "roman" ? undefined
        : { fontFamily: scriptFont(script), letterSpacing: "normal", textTransform: "none", fontSize: 13 }}>{label}</div>
      <div className="limb-deva" style={{
        fontFamily: scriptFont(script),
        fontStyle: script === "roman" ? "normal" : "normal",
        fontSize: script === "telugu" ? 22 : undefined,
        overflowWrap: "anywhere", wordBreak: "break-word",
      }}>
        {glyph && <span className="limb-glyph" style={{ color: glyphColor }}>{glyph}</span>}
        <span>{main}</span>
      </div>
      {sub && script === "roman" && <div className="limb-sub">{sub}</div>}
    </div>
  );
}

/* PanchangaCard used to live here — the original home hero. It has not been
   mounted since HomeA (stuti-home.jsx) took over the home screen, and its rows
   array quietly absorbed two rounds of edits that never reached a user. Removed
   so the next change lands on the card people actually see. The parts of this
   file that ARE live — useLoc, LocationControl, MoonPhase, samvatsaraFor,
   SK_CONST and the season glyphs — are exported below. */

export { MoonPhase, samvatsaraFor, useLoc, LocationControl };
/* additive exports for the home-redesign exploration — the saṅkalpa
   constants + season glyphs, so alternative presentations can be built
   without duplicating the source data. Behaviour of the card is unchanged. */
export { RtuGlyph, AyanaGlyph, SeasonAmbient, RTU_VIS, Snowflake };
export const SK_CONST = { GOTRAS, KARMAS, VARA_GRAHA, YOGA_DEVA, KARANA_DEVA };

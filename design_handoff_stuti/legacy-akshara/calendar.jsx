/* ============================================================
   AKSHARA — Pañcāṅga & festival calendar
   Location-aware. Full-month grid of the five limbs + an
   elegant day drawer. Festivals open the drawer — never a
   silent jump into the library.
   ============================================================ */
const P = window.AKSHARA_PANCHANGA;
const KIND_COLOR = { festival: "var(--maroon)", vrata: "var(--saffron)", observance: "var(--gold)" };
const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* regional companion script: "sa" → Devanagari, "te" → Telugu */
const regKey = (lang) => lang === "te" ? "tel" : "deva";
const regClass = (lang) => lang === "te" ? "tel" : "deva";
const tithiReg = (panch, lang) => lang === "te" ? panch.tithiTel : panch.tithiDeva;
const pakshaReg = (panch, lang) => lang === "te" ? panch.pakshaTel : panch.pakshaDeva;

/* The month grid is set like a printed pañcāṅgam page: plain paper, hairline
   rules, the tithi as a line of type rather than a chip. The phone shades its
   cells by moonlight; a printed sheet says the pakṣa in words and moves on. */

/* an intercalary month is named by prefixing it, which is how a printed
   sheet does it too — the mark belongs on the name, not beside it */
const adhikaPrefix = (k) => (k === "deva" ? "अधिक " : k === "tel" ? "అధిక " : "Adhika ");

/* the same day named from the sun: the rāśi it stands in and the day counted
   from the saṅkrānti that opened it. Half of India reckons this way. */
function sauraStr(date) {
  const P = window.AKSHARA_PANCHANGA;
  try {
    const sd = P.solarDate(date);
    return sd ? sd.masa.iast + " " + sd.day : "—";
  } catch (e) { return "—"; }
}

/* ---------- Moon-phase glyph ---------- */
function MoonPhase({ illum = 0.5, waxing = true, size = 18, lit = "var(--gold-bright)", dark = "var(--paper-3)", ring = "var(--line)" }) {
  const r = size / 2;
  const k = Math.max(0, Math.min(1, illum));
  const rx = (r * Math.abs(1 - 2 * k)).toFixed(2);
  const outer = waxing ? 1 : 0;
  const inner = k < 0.5 ? waxing ? 1 : 0 : waxing ? 0 : 1;
  const d = `M0,${-r} A${r},${r} 0 0 ${outer} 0,${r} A${rx},${r} 0 0 ${inner} 0,${-r} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: "none", display: "block" }}>
      <g transform={`translate(${r},${r})`}>
        <circle r={r - 0.5} fill={dark} stroke={ring} strokeWidth="1" />
        {k > 0.02 && <path d={d} fill={lit} />}
        <circle r={r - 0.5} fill="none" stroke={ring} strokeWidth="1" />
      </g>
    </svg>);

}

/* ---------- Merge curated festivals + derived observances for a date ---------- */
function marksFor(date, festByIso, panch) {
  const curated = (festByIso[isoOf(date)] || []).map((f) => ({ ...f, source: "festival" }));
  const out = [...curated];
  const hasVrata = curated.some((c) => c.kind === "vrata");
  const hasObs = curated.some((c) => c.kind === "observance");
  for (const o of panch.observances) {
    if (o.kind === "vrata" && hasVrata || o.kind === "observance" && hasObs && (o.id === "purnima" || o.id === "amavasya") === false && curated.some((c) => c.name === o.name)) continue;
    if (curated.some((c) => c.name === o.name)) continue;
    out.push({ ...o, source: "derived" });
  }
  return out;
}

/* The place list: two hundred cities, searchable, in AkLocationSearch —
   the ten-item 6px <select> that stood here predated the engine's own list
   and could not be read on the screen it was drawn for. */

/* ---------- Today's hero ---------- */
function TodayHero({ today, loc, lang, comfy, onChangeLoc }) {
  const greg = today.date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <section style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-6%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.1 }}><Mandala size={540} spin /></div>
      <div className="wrap" style={{ padding: "54px 40px 58px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px", minWidth: 0 }}>
            <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>Pañcāṅga · the five limbs of time</span>
            <h1 style={{ fontSize: "clamp(2.1rem,3.8vw,3rem)", lineHeight: 1.06, color: "var(--on-night)", marginTop: 14 }}>Today's reading of the sky</h1>
            <p style={{ color: "var(--on-night-soft)", fontSize: 16, marginTop: 12 }}>{greg}</p>
          </div>
          <div style={{ marginTop: 10, marginRight: 48 }}><AkLocationSearch loc={loc} onChange={onChangeLoc} /></div>
        </div>

        {/* Sun line — genuinely location-driven */}
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 24, flexWrap: "wrap", color: "var(--on-night-soft)", fontSize: 15 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}><Icon name="sun" size={17} /> Sunrise <b style={{ color: "var(--on-night)", fontWeight: 600 }}>{P.fmtTime(today.sunrise)}</b></span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}><MoonPhase illum={today.illum} waxing={today.waxing} size={16} dark="rgba(240,228,204,0.12)" ring="rgba(240,228,204,0.4)" /> Sunset <b style={{ color: "var(--on-night)", fontWeight: 600 }}>{P.fmtTime(today.sunset)}</b></span>
          <span>Day length <b style={{ color: "var(--on-night)", fontWeight: 600 }}>{P.fmtDur(today.dayLen)}</b></span>
          {today.rahu && <span style={{ color: "var(--gold-bright)" }}>Rāhukāla {P.fmtTime(today.rahu.start)}–{P.fmtTime(today.rahu.end)}</span>}
        </div>
        <AkNowNext panch={today} date={today.date} loc={loc} />
        <p className="hero-note" style={{ color: "var(--on-night-soft)", fontStyle: "normal", fontSize: comfy ? 13.5 : 12.5, marginTop: 18, opacity: 0.82, maxWidth: 680, lineHeight: 1.6 }}>
          All five limbs are computed live for this location — sidereal longitudes of the sun and moon, read at the day's own sunrise.
        </p>
      </div>
    </section>);

}

/* ---------- The day sheet — a printed ledger, not tiles ----------
   The five limbs ruled like a granthasūcī: label, the name in type, the
   companion script beside it, and both ends of the limb on the same line.
   The windows share the sheet, favoured and avoided alike. */
function DayLedger({ panch, lang, loc }) {
  const rc = regClass(lang), rk = regKey(lang);
  const span = (k) => (window.akLimbSpan ? window.akLimbSpan(panch, k) : "");
  const rows = [
    ["Vāra", panch.vara[rk], panch.vara.iast, `${panch.vara.en} — lord ${panch.vara.lord}`, ""],
    ["Tithi", tithiReg(panch, lang), `${panch.paksha} ${panch.tithiName}`, `${panch.waxing ? "waxing" : "waning"} moon`, span("tithi")],
    ["Nakṣatra", panch.nak[rk], panch.nak.iast, "lunar mansion", span("nak")],
    ["Yoga", "", panch.yoga, "sun–moon combination", span("yoga")],
    ["Karaṇa", "", panch.karana, "half-tithi", span("karana")],
  ];
  const facts = [
    ["Māsa", (panch.masaAdhika ? "Adhika " : "") + panch.masa.iast, (panch.masaAdhika ? adhikaPrefix(rk) : "") + panch.masa[rk]],
    ["Ṛtu", `${panch.ritu.iast} · ${panch.ritu.en}`, panch.ritu[rk]],
    ["Ayana", panch.ayana.iast, panch.ayana[rk]],
    ["Saura", sauraStr(panch.date), ""],
  ];
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 6, background: "var(--paper)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14, padding: "15px 26px", borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--maroon)", fontWeight: 600 }}>The day sheet · {loc.city}</span>
        <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>both ends of every limb, as a printed sheet gives them</span>
      </div>
      <div className="ledger-cols" style={{ display: "grid", gridTemplateColumns: "1.12fr .88fr" }}>
        <div style={{ padding: "6px 26px 20px", borderRight: "1px solid var(--line-soft)" }}>
          {rows.map(([label, reg, val, sub, when], i) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "13px 0", borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
              <span style={{ flex: "none", width: 94, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 600 }}>{label}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>{val}</span>
                {reg && <span className={rc} style={{ fontSize: 15, color: "var(--maroon)", marginLeft: 12 }}>{reg}</span>}
                <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>{sub}{when ? <span style={{ color: "var(--saffron)", fontVariantNumeric: "tabular-nums" }}> · {when}</span> : null}</span>
              </span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap", paddingTop: 15, borderTop: "1px solid var(--line)" }}>
            {facts.map(([l, v, reg]) => (
              <span key={l}>
                <span style={{ display: "block", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", fontWeight: 600 }}>{l}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{v}</span>
                {reg ? <span className={rc} style={{ fontSize: 13.5, color: "var(--maroon)", marginLeft: 8 }}>{reg}</span> : null}
              </span>
            ))}
          </div>
        </div>
        <div style={{ padding: "6px 26px 20px" }}>
          <AkDayWindows panch={panch} date={panch.date} loc={loc} />
        </div>
      </div>
    </div>
  );
}

/* ---------- One day cell ---------- */
function DayCell({ date, inMonth, isToday, panch, marks, lang, showPaksha, comfy, onOpen }) {
  const rc = regClass(lang);
  const tReg = tithiReg(panch, lang);
  const begins = panch.tithiIndex === 0 || panch.tithiIndex === 15;
  const pakColor = panch.waxing ? "var(--saffron)" : "#46577d";
  const maxMarks = comfy ? 3 : 2;
  return (
    <div className="cal-cell tappable" onClick={() => onOpen(date)}
    style={{ minHeight: comfy ? 150 : 130, padding: comfy ? "11px 13px 12px" : "9px 11px 10px", background: "var(--paper)",
      borderRight: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)",
      boxShadow: isToday ? "inset 0 0 0 1.5px var(--maroon)" : "none", position: "relative",
      opacity: inMonth ? 1 : 0.35, display: "flex", flexDirection: "column", gap: comfy ? 5 : 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="cell-date" style={{ fontFamily: "var(--font-display)", fontSize: comfy ? 24 : 19, fontWeight: 600, lineHeight: 1,
          color: isToday ? "var(--maroon)" : "var(--ink)" }}>{date.getDate()}</span>
        <MoonPhase illum={panch.illum} waxing={panch.waxing} size={comfy ? 15 : 12} lit="var(--gold)" />
      </div>

      {showPaksha &&
      <div className="cell-paksha" style={{ fontSize: comfy ? 10 : 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: pakColor, marginTop: 1 }}>
        {panch.paksha} pakṣa{begins ? " begins" : ""}
      </div>
      }

      <div className="cell-tithi" style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: comfy ? 16.5 : 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.15,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{panch.tithiName}</div>
        <div className={rc} style={{ fontSize: comfy ? 13.5 : 12, color: "var(--maroon)", lineHeight: 1.25,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tReg}</div>
      </div>
      {!comfy &&
      <div className="cell-nak" style={{ minWidth: 0, fontSize: 10.5, color: "var(--ink-faint)", lineHeight: 1.3,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{panch.nak.iast} <span className={rc} style={{ color: "var(--ink-soft)" }}>{panch.nak[regKey(lang)]}</span></div>
      }

      <div className="cell-marks" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: comfy ? 3 : 2 }}>
        {marks.slice(0, maxMarks).map((m, i) =>
        <div key={i} className="cal-mark" style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span style={{ flex: "none", width: 5, height: 5, borderRadius: "50%", background: KIND_COLOR[m.kind] }} />
            <span style={{ fontSize: comfy ? 12 : 10.5, fontWeight: 600, color: "var(--ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
          </div>
        )}
        {marks.length > maxMarks && <span style={{ fontSize: comfy ? 11 : 10, color: "var(--ink-faint)", paddingLeft: 11 }}>+{marks.length - maxMarks} more</span>}
      </div>
      {marks.length > 0 &&
      <div className="cell-dots" aria-hidden="true">
        {marks.slice(0, 4).map((m, i) => <span key={i} style={{ background: KIND_COLOR[m.kind] }} />)}
      </div>
      }
    </div>);

}

/* ---------- Month grid ---------- */
function MonthGrid({ cursor, loc, festByIso, today, lang, comfy, onOpen }) {
  const y = cursor.getFullYear(),m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - first.getDay()); // back up to Sunday
  const cells = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const trimmed = cells.slice(0, cells[35].getMonth() === m || cells[35].getDay() !== 0 ? 42 : 35);
  const heads = P.VARA;
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 6, overflow: "hidden", background: "var(--paper)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid var(--line)" }}>
        {heads.map((v, i) =>
        <div key={i} className="cal-head" style={{ padding: comfy ? "13px 8px" : "10px 8px", textAlign: "center", borderRight: i < 6 ? "1px solid var(--line-soft)" : "none" }}>
            <div className="cal-head-en" style={{ fontSize: comfy ? 12.5 : 11, letterSpacing: "0.14em", textTransform: "uppercase", color: i === 0 ? "var(--maroon)" : "var(--ink-soft)", fontWeight: 600 }}>{v.en.slice(0, 3)}</div>
            <div className={"cal-head-reg " + regClass(lang)} style={{ fontSize: comfy ? 13 : 11.5, color: "var(--ink-faint)", marginTop: 2 }}>{v[regKey(lang)].slice(0, 3)}</div>
          </div>
        )}
      </div>
      <div className="cal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
        {trimmed.map((date, i) => {
          const panch = P.forDay(date, loc);
          const marks = marksFor(date, festByIso, panch);
          // tag the first day of each pakṣa, plus the first visible cell as an anchor
          const showPaksha = panch.tithiIndex === 0 || panch.tithiIndex === 15 || i === 0;
          return <DayCell key={i} date={date} inMonth={date.getMonth() === m} isToday={sameDay(date, today)} panch={panch} marks={marks} lang={lang} showPaksha={showPaksha} comfy={comfy} onOpen={onOpen} />;
        })}
      </div>
    </div>);

}

/* ---------- Day drawer ---------- */
function DayDrawer({ date, loc, festByIso, lang, go, onClose }) {
  useEffect(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!date) return null;
  const panch = P.forDay(date, loc);
  const marks = marksFor(date, festByIso, panch);
  const greg = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const rc = regClass(lang),rk = regKey(lang);

  /* where each limb began as well as when it lets go — a printed sheet gives
     both ends, and a limb usually took hold before this midnight */
  const span = (k) => (window.akLimbSpan ? window.akLimbSpan(panch, k) : "");
  const limbs = [
  ["Vāra", panch.vara[rk], panch.vara.iast, `${panch.vara.en} — lord ${panch.vara.lord}`, ""],
  ["Tithi", tithiReg(panch, lang), panch.tithiName, `${panch.paksha} pakṣa · ${panch.waxing ? "waxing" : "waning"} moon`, span("tithi")],
  ["Nakṣatra", panch.nak[rk], panch.nak.iast, "lunar mansion", span("nak")],
  ["Yoga", "", panch.yoga, "sun–moon combination", span("yoga")],
  ["Karaṇa", "", panch.karana, "half-tithi", span("karana")]];


  return (
    <div className="drawer-back" onClick={onClose}
    style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(28,20,12,0.5)", backdropFilter: "blur(3px)",
      display: "flex", justifyContent: "flex-end" }}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}
      style={{ width: 460, maxWidth: "92vw", height: "100%", background: "var(--paper)", overflowY: "auto",
        boxShadow: "-20px 0 60px rgba(28,20,12,0.3)" }}>
        {/* header */}
        <div style={{ background: "var(--night)", color: "var(--on-night)", padding: "26px 30px 28px", position: "relative" }}>
          <button onClick={onClose} aria-label="Close"
          style={{ position: "absolute", top: 20, right: 22, background: "rgba(240,228,204,0.1)", border: "1px solid rgba(240,228,204,0.22)",
            color: "var(--on-night)", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center" }}>
            <Icon name="close" size={17} />
          </button>
          <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>{loc.city}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
            <MoonPhase illum={panch.illum} waxing={panch.waxing} size={40} dark="rgba(240,228,204,0.1)" ring="rgba(240,228,204,0.4)" />
            <div>
              <div className={rc} style={{ fontSize: 23, color: "var(--gold-bright)", lineHeight: 1.2 }}>{pakshaReg(panch, lang)} {tithiReg(panch, lang)}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>{panch.paksha} {panch.tithiName}</div>
            </div>
          </div>
          <p style={{ color: "var(--on-night-soft)", fontSize: 14.5, marginTop: 12 }}>{greg}</p>
        </div>

        {/* five limbs */}
        <div style={{ padding: "26px 30px 8px" }}>
          <div className="ornament" style={{ marginBottom: 18 }}><span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>The five limbs</span></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {limbs.map(([label, deva, val, sub, when], i) =>
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "13px 0", borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{label}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>{sub}</div>
                  {when && <div style={{ fontSize: 12.5, color: "var(--gold)", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{when}</div>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--ink)" }}>{val}</div>
                  {deva && <div className={rc} style={{ fontSize: 16, color: "var(--maroon)", marginTop: 1 }}>{deva}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* sun + month */}
        <div style={{ padding: "8px 30px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Sunrise", P.fmtTime(panch.sunrise)], ["Sunset", P.fmtTime(panch.sunset)],
            ["Day length", P.fmtDur(panch.dayLen)], ["Rāhukāla", panch.rahu ? `${P.fmtTime(panch.rahu.start)}–${P.fmtTime(panch.rahu.end)}` : "—"],
            ["Māsa", (panch.masaAdhika ? "Adhika " : "") + panch.masa.iast
              + (panch.masaKshaya && panch.masaKshayaName ? " · " + panch.masaKshayaName.iast + " kṣaya" : "")],
            ["Ṛtu", `${panch.ritu.iast} · ${panch.ritu.en}`],
            ["Ayana", panch.ayana.iast],
            ["Saura", sauraStr(panch.date)]].map(([l, v]) =>
            <div key={l} style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{l}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: l === "Rāhukāla" ? "var(--maroon)" : "var(--ink)", marginTop: 3, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              </div>
            )}
          </div>
        </div>

        {/* the day's windows — three to stand down in, three to begin in */}
        <div style={{ padding: "10px 30px 8px" }}>
          <AkDayWindows panch={panch} date={date} loc={loc} />
        </div>

        {/* special mentions */}
        {marks.length > 0 &&
        <div style={{ padding: "10px 30px 34px" }}>
            <div className="ornament" style={{ marginBottom: 18 }}><span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>Special mentions</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {marks.map((m, i) =>
            <div key={i} style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderLeft: `3px solid ${KIND_COLOR[m.kind]}`, borderRadius: "var(--radius)", padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600 }}>{m.name}</span>
                    {m.deva && <Sa as="span" style={{ fontSize: 15, color: "var(--ink-faint)" }}>{m.deva}</Sa>}
                    <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: KIND_COLOR[m.kind], border: "1px solid var(--line)", borderRadius: 999, padding: "2px 9px", marginLeft: "auto" }}>{m.kind}</span>
                  </div>
                  {m.tithi && <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 5 }}>{m.tithi}</div>}
                  <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "8px 0 0" }}>{m.note}</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {m.source === "festival" && m.id &&
              <button onClick={() => go(m.vratham ? "vratham" : "festival", { id: m.vratham || m.id })} className="btn btn-ghost"
              style={{ marginTop: 14, padding: "8px 15px", fontSize: 13.5 }}>
                      <Icon name="calendar" size={15} /> Open full guide <Icon name="arrowR" size={14} />
                    </button>
              }
                  {m.coll &&
              <button onClick={() => go("library", { coll: m.coll })} className="btn btn-ghost"
              style={{ marginTop: 14, padding: "8px 15px", fontSize: 13.5 }}>
                      <Icon name="book" size={15} /> Read {m.collName || "the related text"} <Icon name="arrowR" size={14} />
                    </button>
              }
                  </div>
                </div>
            )}
            </div>
          </div>
        }
        {marks.length === 0 &&
        <div style={{ padding: "4px 30px 36px" }}>
            <p style={{ fontSize: 14, color: "var(--ink-faint)", fontStyle: "normal", lineHeight: 1.6 }}>
              No special observance falls on this day — an ordinary day for study and recitation.
            </p>
          </div>
        }
      </div>
    </div>);

}

/* ---------- Screen ---------- */
function PanchangaScreen({ go, lang, comfy }) {
  const D = window.AKSHARA_DATA;
  const today = new Date();
  /* ayanāṁśa, drik/vākya and the month system all feed the engine, and the
     māna decides what the saṅkalpa says — every one of them is read during
     render, so this screen has to know when one is answered differently */
  window.useAkPrefs();
  const [locId, setLocId] = useState(() => localStorage.getItem("akshara_loc") || "ujjain");
  const loc = P.locations.find((l) => l.id === locId) || P.locations[0];
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  useEffect(() => {localStorage.setItem("akshara_loc", locId);}, [locId]);

  // festivals reckoned at a fixed reference, by name — locations[0] is the picker's first entry
  const refLoc = P.locations.find((l) => l.id === "ujjain") || P.locations[0];
  const festsForYear = (year) => D.festivals
    .map((f) => ({ ...f, dateObj: window.akFestDate(f, year, refLoc) }))
    .filter((f) => f.dateObj);
  const gridFests = festsForYear(cursor.getFullYear());
  const festByIso = {};
  for (const f of gridFests) {const k = isoOf(f.dateObj);(festByIso[k] = festByIso[k] || []).push(f);}
  const listFests = festsForYear(today.getFullYear()).sort((a, b) => a.dateObj - b.dateObj);

  const todayPanch = P.forDay(today, loc);
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  /* the lunar months this Gregorian month actually spans — read off the
     engine at the first and last day of it. Keyed to cursor.getMonth() this
     was a fixed table, so it named Caitra through all of April however the
     new moon fell, and never said adhika. */
  const spanA = P.forDay(new Date(cursor.getFullYear(), cursor.getMonth(), 1), loc);
  const spanB = P.forDay(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0), loc);
  const masaA = spanA.masa, masaNext = spanB.masa;
  const masaSpan = (k) => {
    const a = (spanA.masaAdhika ? adhikaPrefix(k) : "") + masaA[k];
    const b = (spanB.masaAdhika ? adhikaPrefix(k) : "") + masaNext[k];
    return a === b ? a : a + "–" + b;
  };

  const shiftMonth = (n) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1));
  const openFestival = (f) => {
    setCursor(new Date(f.dateObj.getFullYear(), f.dateObj.getMonth(), 1));
    setSelected(f.dateObj);
  };

  return (
    <div className="rise">
      <SectionTabs route={"calendar"} go={go} items={[
        { label: "Pañcāṅga", route: "calendar" },
        { label: "Festivals", route: "festivals" },
        { label: "Vrathams", route: "vrathams" },
      ]} />
      <TodayHero today={todayPanch} loc={loc} lang={lang} comfy={comfy} onChangeLoc={setLocId} />

      {/* The day sheet — the five limbs as a printed ledger, not tiles */}
      <section className="wrap" style={{ padding: "40px 40px 8px" }}>
        <DayLedger panch={todayPanch} lang={lang} loc={loc} />
      </section>

      {/* Month calendar */}
      <section className="wrap" style={{ padding: "52px 40px 8px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 26 }}>
          <div>
            <span className="eyebrow">The month in full</span>
            <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.5rem)", marginTop: 10 }}>{monthLabel}</h2>
            <p className={regClass(lang)} style={{ fontSize: 17, color: "var(--maroon)", marginTop: 6 }}>{masaSpan(regKey(lang))} · {masaSpan("iast")}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => shiftMonth(-1)} className="btn btn-ghost" aria-label="Previous month" style={{ padding: "10px 14px" }}><Icon name="arrowL" size={17} /></button>
            <button onClick={() => {setCursor(new Date(today.getFullYear(), today.getMonth(), 1));}} className="btn btn-ghost" style={{ padding: "10px 18px", fontSize: 14 }}>Today</button>
            <button onClick={() => shiftMonth(1)} className="btn btn-ghost" aria-label="Next month" style={{ padding: "10px 14px" }}><Icon name="arrowR" size={17} /></button>
          </div>
        </div>

        <MonthGrid cursor={cursor} loc={loc} festByIso={festByIso} today={today} lang={lang} comfy={comfy} onOpen={setSelected} />

        {/* legend */}
        <div className="cal-legend" style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", marginTop: 18, fontSize: 13, color: "var(--ink-soft)" }}>
          {[["Festival", "festival"], ["Vrata (fast)", "vrata"], ["Observance", "observance"]].map(([l, k]) =>
          <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: KIND_COLOR[k] }} />{l}
            </span>
          )}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 13, height: 13, borderRadius: 3, boxShadow: "inset 0 0 0 1.5px var(--maroon)" }} />today
          </span>
          <span className="legend-moon" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><MoonPhase illum={0.7} waxing size={13} lit="var(--gold)" /> moon phase</span>
          <span style={{ color: "var(--ink-faint)", fontStyle: "normal" }}>Open any day for its full sheet</span>
        </div>
      </section>

      {/* What is said before beginning, and how the day above was reckoned */}
      <section className="wrap" style={{ padding: "44px 40px 8px" }}>
        <AkSankalpa panch={todayPanch} loc={loc} date={today} lang={lang} deity={null} />
      </section>
      <section className="wrap" style={{ padding: "34px 40px 8px" }}>
        <AkReckoning />
      </section>

      {/* The year's turning */}
      <section className="wrap" style={{ padding: "48px 40px 20px" }}>
        <div className="ornament" style={{ marginBottom: 30 }}><Lotus size={22} color="var(--gold)" /></div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span className="eyebrow">The year's turning</span>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", marginTop: 12 }}>Festivals &amp; observances</h2>
            <p style={{ color: "var(--ink-soft)", fontSize: 15.5, marginTop: 8 }}>The principal days ahead. Open any for its full guide — meaning, pūjā, what to recite and offer.</p>
          </div>
          <button onClick={() => go("festivals")} className="btn btn-ghost" style={{ padding: "10px 18px", fontSize: 14 }}>
            All festivals <Icon name="arrowR" size={15} />
          </button>
        </div>

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
          {listFests.map((f) => {
            const dObj = f.dateObj;
            const dd = dObj.getDate();
            return (
              <div key={f.id} onClick={() => go("festival", { id: f.id })} className="fest-row linked"
              style={{ display: "flex", alignItems: "center", gap: 22, background: "var(--paper-2)", border: "1px solid var(--line)",
                borderRadius: "var(--radius)", padding: "18px 24px", cursor: "pointer", transition: "background .15s ease, border-color .15s ease" }}>
                <div style={{ flex: "none", width: 64, textAlign: "center" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--saffron)", fontWeight: 600 }}>{dObj.toLocaleDateString(undefined, { month: "short" })}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: "var(--maroon)", lineHeight: 1 }}>{dd}</div>
                </div>
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>{f.name}</span>
                    <Sa as="span" style={{ fontSize: 16, color: "var(--ink-faint)" }}>{f.deva}</Sa>
                    <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: KIND_COLOR[f.kind] || "var(--gold)", border: "1px solid var(--line)", borderRadius: 999, padding: "2px 10px" }}>{f.kind}</span>
                  </div>
                  <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.55, margin: "5px 0 0", textWrap: "pretty" }}>{f.note}</p>
                  <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 4 }}>{f.tithi} · {f.when}</div>
                </div>
                <Icon name="chevron" size={18} />
              </div>);

          })}
        </div>
      </section>

      <DayDrawer date={selected} loc={loc} festByIso={festByIso} lang={lang} go={go} onClose={() => setSelected(null)} />
    </div>);

}

Object.assign(window, { PanchangaScreen, MoonPhase });
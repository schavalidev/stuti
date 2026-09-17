/* ============================================================
   AKSHARA — Home screen
   ============================================================ */
/* ---------- Waxing/waning moon glyph (self-contained) ---------- */
function MoonDot({ illum = 0.5, waxing = true, size = 34 }) {
  const r = size / 2, k = Math.max(0, Math.min(1, illum));
  // terminator offset: full at illum=1, hidden at 0
  const off = (waxing ? 1 : -1) * (1 - k) * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><clipPath id="mc"><circle cx={r} cy={r} r={r - 1} /></clipPath></defs>
      <circle cx={r} cy={r} r={r - 1} fill="var(--paper-3)" />
      <g clipPath="url(#mc)">
        <ellipse cx={r + off} cy={r} rx={r} ry={r} fill="var(--gold-bright)" opacity={k < 0.04 ? 0 : 1} />
      </g>
      <circle cx={r} cy={r} r={r - 1} fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ---------- Home pañcāṅga bridge card → the day's deity stotras ---------- */
function PanchangaMiniCard({ go }) {
  const P = window.AKSHARA_PANCHANGA, D = window.AKSHARA_DATA;
  const loc = P.locations.find((l) => l.id === "ujjain") || P.locations[0];
  const today = P.forDay(new Date(), loc);
  const deity = D.todayDeity();
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const endStr = P.fmtTime(today.tithiEndMin) + (today.tithiEndsTomorrow ? " · tomorrow" : "");
  const n = D.stotras.filter(s => s.deity === deity.id).length;
  // compact astro line, script-aware via <Sa>
  const limbs = [today.ayana.deva, (today.masaAdhika ? "अधिक " : "") + today.masa.deva, today.pakshaDeva, today.tithiDeva];

  return (
    <div className="home-panch rise" style={{ flex: "0 1 348px", minWidth: 280, alignSelf: "flex-start",
      background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)",
      padding: "22px 24px 20px", boxShadow: "var(--shadow-soft)", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <div>
          <span className="eyebrow">Today's pañcāṅga</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, marginTop: 5, color: "var(--ink)" }}>{dateStr}</div>
        </div>
        <MoonDot illum={today.illum} waxing={today.waxing} size={36} />
      </div>

      {/* compact astro string */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 0", marginTop: 16, lineHeight: 1.5 }}>
        {limbs.map((x, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "baseline" }}>
            <Sa as="span" style={{ fontSize: 18, color: "var(--maroon)" }}>{x}</Sa>
            {i < limbs.length - 1 && <span style={{ color: "var(--ink-faint)", margin: "0 9px", fontSize: 13 }}>·</span>}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 7, fontStyle: "normal" }}>
        {today.paksha} {today.tithiName} until {endStr}
      </div>

      <div style={{ height: 1, background: "var(--line)", margin: "18px 0 16px" }} />

      {/* deity bridge */}
      <button onClick={() => go("deity", { deity: deity.id })}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer" }}>
        <div style={{ width: 44, height: 44, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
          border: "1.5px solid var(--gold)", color: "var(--maroon)" }}>
          <Sa as="span" style={{ fontSize: 21, lineHeight: 1 }}>{deity.seed}</Sa>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>Sacred to</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--ink)" }}>{deity.name}</div>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--maroon)", fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap" }}>
          {n} stotras <Icon name="arrowR" size={15} />
        </span>
      </button>

      <button onClick={() => go("calendar")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: 0, padding: "12px 0 0", color: "var(--ink-faint)", fontSize: 13 }}>
        Full pañcāṅga <Icon name="arrowR" size={13} />
      </button>
    </div>
  );
}

function Hero({ go }) {
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-8%", top: "-6%", color: "var(--gold)", opacity: 0.18, pointerEvents: "none" }}>
        <Mandala size={720} />
      </div>
      <div className="wrap" style={{ padding: "96px 40px 104px", position: "relative" }}>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="rise" style={{ flex: "1 1 520px", maxWidth: 780 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
            <span className="eyebrow">Sanātana Dharma · the eternal way</span>
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 7vw, 5.6rem)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 0.98 }}>
            The eternal,<br/>
            <span style={{ fontStyle: "normal", color: "var(--maroon)" }}>made legible.</span>
          </h1>
          <p style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.4rem)", lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: 620, margin: "30px 0 0" }}>
            A digital library of the Vedas, Upaniṣads, epics and beyond — original Sanskrit set beside transliteration and translation, with recitation you can hear.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => go("library")}>
              Enter the library <Icon name="arrowR" size={17} />
            </button>
            <button className="btn btn-ghost" onClick={() => go("detail", { textId: "gita" })}>
              <Icon name="book" size={17} /> Begin with the Gītā
            </button>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
            {[["108", "texts & editions"], ["12,000+", "verses, line by line"], ["3", "scripts, side by side"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 500, color: "var(--maroon)", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 13.5, color: "var(--ink-faint)", letterSpacing: "0.04em", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <PanchangaMiniCard go={go} />
        </div>
      </div>
    </section>
  );
}

function CollectionsGrid({ go }) {
  const { collections } = window.AKSHARA_DATA;
  return (
    <section className="wrap" style={{ padding: "20px 40px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 34, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="eyebrow">Browse the canon</span>
          <h2 style={{ fontSize: "clamp(2rem,3.2vw,2.8rem)", marginTop: 12 }}>Eight gateways into the tradition</h2>
        </div>
        <button onClick={() => go("library")} style={{ background: "none", border: 0, color: "var(--maroon)", fontSize: 15, display: "flex", alignItems: "center", gap: 7, fontWeight: 500 }}>
          See all texts <Icon name="arrowR" size={16} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 18 }}>
        {collections.map((c, idx) => (
          <button key={c.id} onClick={() => c.id === "stotra" ? go("stotras") : go("library", { coll: c.id })}
            className="coll-card"
            style={{ textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)",
              borderRadius: "var(--radius)", padding: "26px 26px 24px", position: "relative", overflow: "hidden",
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease" }}>
            <div style={{ position: "absolute", right: -34, bottom: -34, color: "var(--gold)", opacity: 0.14 }}><Mandala size={150} /></div>
            <Sa as="div" style={{ fontSize: 30, color: "var(--maroon)", lineHeight: 1, marginBottom: 18 }}>{c.deva}</Sa>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
            <div style={{ fontStyle: "normal", color: "var(--ink-faint)", fontSize: 14, marginTop: 3 }}>{c.sub}</div>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "16px 0 0", position: "relative" }}>{c.note}</p>
            <div style={{ marginTop: 18, fontSize: 13, letterSpacing: "0.08em", color: "var(--saffron)", fontWeight: 500 }}>{c.count} {c.count === 1 ? "text" : "texts"}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturedRow({ go, bookmarks, toggleMark, openText }) {
  const featured = window.AKSHARA_DATA.texts.filter(t => t.featured);
  return (
    <section className="wrap" style={{ padding: "84px 40px 0" }}>
      <div className="ornament" style={{ marginBottom: 40 }}><Lotus size={24} color="var(--gold)" /></div>
      <div style={{ marginBottom: 34 }}>
        <span className="eyebrow">Where many begin</span>
        <h2 style={{ fontSize: "clamp(2rem,3.2vw,2.8rem)", marginTop: 12 }}>Featured texts</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
        {featured.map(t => <TextCard key={t.id} t={t} go={go} marked={bookmarks.has(t.id)} toggleMark={toggleMark} onOpen={openText} />)}
      </div>
    </section>
  );
}

function HomeScreen(props) {
  if (props.homeLayout === "classic") {
    return (
      <div className="rise">
        <Hero {...props} />
        <div style={{ height: 84 }} />
        <CollectionsGrid {...props} />
        <FeaturedRow {...props} />
      </div>
    );
  }
  return <HomeHub {...props} />;
}

/* ============================================================
   HomeHub — compact "one screen" hub (elder-friendly)
   Greeting + today's pañcāṅga, then a few large entry tiles.
   No long scrolling feed: the main choices sit above the fold.
   ============================================================ */
function readProg() {
  try { return JSON.parse(localStorage.getItem("akshara_progress") || "null"); } catch { return null; }
}

function HubTile({ go, route, params, seed, title, sub, meta, dark }) {
  return (
    <button onClick={() => go(route, params || {})} className="hub-tile"
      style={{ textAlign: "left", cursor: "pointer", position: "relative", overflow: "hidden", width: "100%",
        display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18,
        minHeight: 168, padding: "26px 28px", borderRadius: "var(--radius)",
        background: dark ? "var(--night)" : "var(--paper-2)",
        border: "1px solid " + (dark ? "transparent" : "var(--line)"),
        color: dark ? "var(--on-night)" : "var(--ink)",
        boxShadow: "var(--shadow-soft)", transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease" }}>
      <div style={{ position: "absolute", right: -30, bottom: -30, color: dark ? "var(--gold-bright)" : "var(--gold)", opacity: dark ? 0.16 : 0.13, pointerEvents: "none" }}><Mandala size={150} /></div>
      <Sa as="div" style={{ fontSize: 34, lineHeight: 1, color: dark ? "var(--gold-bright)" : "var(--maroon)" }}>{seed}</Sa>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 600, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 16, color: dark ? "var(--on-night-soft)" : "var(--ink-soft)", marginTop: 6, lineHeight: 1.45 }}>{sub}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 14.5, fontWeight: 500, color: dark ? "var(--gold-bright)" : "var(--maroon)" }}>
          {meta} <Icon name="arrowR" size={16} />
        </div>
      </div>
    </button>
  );
}

/* ---------- The day, across the top of the hub ----------
   The hub opened on a greeting and a pill that said the tithi and
   nothing else, and closed on a verse. This is the first thing on
   the page instead: the five limbs, when the tithi turns, the sun's
   two hours and what window is running — the reasons a household
   opens an almanac at all — with the day's deity beside them. */
function HubPanchangaCard({ go, today, loc, deity, nStotras }) {
  const P = window.AKSHARA_PANCHANGA;
  const masa = (window.masaShown ? window.masaShown(today) : today.masa) || today.masa;
  const ends = today.tithiEndMin != null
    ? "until " + P.fmtTime(today.tithiEndMin) + (today.tithiEndsTomorrow ? " tomorrow" : "")
    : null;
  const dateStr = today.date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const cells = [
    ["Vāra", today.vara.iast, today.vara.deva],
    ["Nakṣatra", today.nak.iast, today.nak.deva],
    ["Māsa", (today.masaAdhika ? "Adhika " : "") + masa.iast, (today.masaAdhika ? "अधिक " : "") + masa.deva],
    ["Ṛtu", today.ritu.iast, today.ritu.deva],
  ];
  return (
    <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow-soft)", overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
        {/* the tithi, and when it turns */}
        <div style={{ flex: "1 1 330px", minWidth: 0, padding: "22px 26px", display: "flex", alignItems: "center", gap: 18 }}>
          <MoonDot illum={today.illum} waxing={today.waxing} size={46} />
          <div style={{ minWidth: 0 }}>
            <span className="eyebrow" style={{ color: "var(--gold)" }}>Today's pañcāṅga · {loc.city}</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
              <Sa as="span" style={{ fontSize: 23, color: "var(--maroon)", lineHeight: 1.2 }}>{today.tithiDeva}</Sa>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
                {today.soloTithi ? today.tithiName : today.paksha + " " + today.tithiName}
              </span>
            </div>
            <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 3 }}>
              {dateStr}{ends ? " · " + ends : ""}
            </div>
          </div>
        </div>
        {/* the other four limbs */}
        <div className="hub-limbs" style={{ flex: "1 1 400px", minWidth: 0, display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", borderLeft: "1px solid var(--line)" }}>
          {cells.map(([label, val, deva], i) => (
            <div key={label} style={{ padding: "20px 12px", borderLeft: i ? "1px solid var(--line-soft)" : "none", minWidth: 0 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--ink)", marginTop: 5, lineHeight: 1.25 }}>{val}</div>
              <Sa as="div" style={{ fontSize: 14, color: "var(--maroon)", marginTop: 1 }}>{deva}</Sa>
            </div>
          ))}
        </div>
      </div>
      {/* the sun's hours, what is running, and the day's deity */}
      <div style={{ borderTop: "1px solid var(--line)", background: "var(--paper)", padding: "13px 26px",
        display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap", fontSize: 14, color: "var(--ink-soft)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon name="sun" size={16} /> {P.fmtTime(today.sunrise)} – {P.fmtTime(today.sunset)}
        </span>
        {today.rahu && <span style={{ color: "var(--maroon)" }}>Rāhukāla {P.fmtTime(today.rahu.start)}–{P.fmtTime(today.rahu.end)}</span>}
        <HubNowNext today={today} loc={loc} />
        <span style={{ flex: 1 }} />
        <button onClick={() => go("deity", { deity: deity.id })}
          style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "none", border: 0, padding: 0,
            color: "var(--ink)", fontSize: 14, cursor: "pointer" }}>
          <Sa as="span" style={{ fontSize: 17, color: "var(--maroon)" }}>{deity.seed}</Sa>
          Sacred to <b style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{deity.name}</b>
          <span style={{ color: "var(--ink-faint)" }}>· {nStotras} stotras</span>
        </button>
        <button onClick={() => go("calendar")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: 0, padding: 0,
            color: "var(--maroon)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          Full pañcāṅga <Icon name="arrowR" size={14} />
        </button>
      </div>
    </div>
  );
}

/* what window is running now — the muhūrta table's one-line answer, on paper
   rather than on the calendar's night band */
function HubNowNext({ today, loc }) {
  const M = window.STUTI_MUHURTA, P = window.AKSHARA_PANCHANGA;
  const cn = React.useMemo(() => {
    try { return M ? M.currentAndNext(today.date, loc, today) : null; } catch (e) { return null; }
  }, [today, loc, M]);
  const w = cn && (cn.current || cn.next);
  if (!w) return null;
  const name = (w.label && w.label.roman) || "";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", flex: "none",
        background: w.kind === "good" ? "var(--gold-bright)" : "var(--maroon)" }} />
      {cn.current ? <span>Now <b style={{ fontWeight: 600, color: "var(--ink)" }}>{name}</b> until {P.fmtTime(w.end)}</span>
                  : <span>Next <b style={{ fontWeight: 600, color: "var(--ink)" }}>{name}</b> at {P.fmtTime(w.start)}</span>}
    </span>
  );
}

function HomeHub({ go }) {
  const D = window.AKSHARA_DATA, P = window.AKSHARA_PANCHANGA;
  /* the month system and the ayanāṁśa are read while this renders */
  window.useAkPrefs();

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetDeva = hour < 12 ? "सुप्रभातम्" : hour < 17 ? "नमस्ते" : "शुभ सन्ध्या";
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  /* the place the reciter chose on the calendar — this card names it and
     prints sunrise, Rāhukāla and the running window for it, so the two
     screens cannot be left disagreeing about the same day. Festival dates
     stay on the Ujjain reference, which is a different question. */
  const loc = P.locations.find((l) => l.id === (localStorage.getItem("akshara_loc") || "ujjain")) || P.locations[0];
  const today = P.forDay(new Date(), loc);
  const deity = D.todayDeity();
  const nStotras = D.stotras.filter(s => s.deity === deity.id).length;

  // Continue reading
  const prog = readProg();
  const progText = prog ? D.texts.find(t => t.id === prog.textId) : null;
  const resume = progText
    ? { route: "reader", params: { textId: progText.id, chapterNo: prog.chapterNo },
        title: "Continue reading", sub: progText.title,
        meta: (D.UNIT[progText.coll] || { en: "Chapter" }).en + " " + prog.chapterNo, seed: progText.deva.slice(0, 2) }
    : { route: "detail", params: { textId: "gita" },
        title: "Begin with the Gītā", sub: "Kṛṣṇa's counsel to Arjuna",
        meta: "Start reading", seed: "गीता" };

  return (
    <div className="rise" style={{ minHeight: "calc(100vh - 76px)", display: "flex", flexDirection: "column" }}>
      {/* The day, first — then the greeting */}
      <div className="wrap" style={{ padding: "26px 40px 0", width: "100%" }}>
        <HubPanchangaCard go={go} today={today} loc={loc} deity={deity} nStotras={nStotras} />
      </div>

      <div className="wrap" style={{ padding: "30px 40px 24px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 10 }}>
          <Lotus size={22} color="var(--gold)" />
          <Sa as="span" className="eyebrow" style={{ color: "var(--maroon)" }}>{greetDeva}</Sa>
        </div>
        <h1 style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 500, lineHeight: 1.04, letterSpacing: "-0.01em" }}>{greet}.</h1>
      </div>

      {/* Tile grid — the main choices, all above the fold */}
      <div className="wrap" style={{ padding: "0 40px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {/* Continue reading spans the top row, most prominent */}
          <div style={{ gridColumn: "1 / -1" }}>
            <HubTile go={go} route={resume.route} params={resume.params} dark
              seed={resume.seed} title={resume.title} sub={resume.sub} meta={resume.meta} />
          </div>
          <HubTile go={go} route="library" seed="ग्रन्थ" title="The Library"
            sub="Vedas, Upaniṣads, the epics & more" meta={D.texts.length + " texts"} />
          <HubTile go={go} route="stotras" seed="स्तोत्र" title="Stotras"
            sub="Devotional hymns to hear & recite" meta={D.stotras.length + " hymns"} />
          <HubTile go={go} route="deity" params={{ deity: deity.id }} seed={deity.seed} title={"Today · " + deity.name}
            sub={deity.epithet} meta={nStotras + " stotras"} />
          <HubTile go={go} route="saved" seed="❀" title="My Library"
            sub="Your saved texts & reading" meta="Open" />
        </div>
      </div>

      <div style={{ height: 34 }} />
    </div>
  );
}

Object.assign(window, { HomeScreen, HomeHub, HubTile, HubPanchangaCard, PanchangaMiniCard, MoonDot });

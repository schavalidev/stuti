/* ============================================================
   AKSHARA — Festivals & Vrathams
   Browseable index pages + rich, scrollable detail guides.
   Content from window.AKSHARA_OBSERVANCES; dates resolved by
   the pañcāṅga engine (window.AKSHARA_PANCHANGA).
   ============================================================ */
const OBS = window.AKSHARA_OBSERVANCES;
const PA = window.AKSHARA_PANCHANGA;
const KINDC = { festival: "var(--maroon)", vrata: "var(--saffron)", observance: "var(--gold)" };
const REGION_LABEL = { telugu: "Telugu", pan: "Pan-Indian", north: "North Indian", south: "South Indian" };

/* resolve a festival meta object → a Date for the given year */
/* festivals are reckoned at Ujjain so a date does not shift per viewer.
   By name: the engine's location list is ordered for its picker. */
const refLoc = () => PA.locations.find((l) => l.id === "ujjain") || PA.locations[0];

/* one resolver, shared with the calendar — it also knows the saṅkrāntis */
function festDate(f, year) { return window.akFestDate(f, year, refLoc()); }

/* ---------- Shared sticky section sub-nav (in-page anchors) ----------
   Used on detail pages. Smooth-scrolls to a section without scrollIntoView. */
function SectionSubNav({ sections, activeId, onJump }) {
  return (
    <div className="subnav-sticky" style={{ position: "sticky", top: "var(--header-h)", zIndex: 25,
      background: "color-mix(in srgb, var(--paper) 93%, transparent)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap subnav-scroll" style={{ display: "flex", gap: 8, padding: "11px 40px", overflowX: "auto" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => onJump(s.id)} className="chip" data-active={activeId === s.id}
            style={{ height: 34, fontSize: 13.5, whiteSpace: "nowrap", flex: "none" }}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- A small stotra link card (jumps into the reciter) ---------- */
function StotraLink({ id, go }) {
  const D = window.AKSHARA_DATA;
  const s = D.stotras.find(x => x.id === id);
  if (!s) return null;
  const deity = D.deities.find(d => d.id === s.deity);
  return (
    <button onClick={() => go("stotraReader", { id })} className="stotra-link"
      style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%",
        background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "13px 16px", cursor: "pointer" }}>
      <span style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
        border: "1px solid var(--gold)", color: "var(--maroon)" }}><Sa as="span" style={{ fontSize: 18 }}>{(deity || {}).seed}</Sa></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{s.title}</span>
        <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-faint)" }}>{(deity || {}).name} · {s.type}</span>
      </span>
      <span style={{ flex: "none", display: "flex", alignItems: "center", gap: 6, color: "var(--saffron)", fontSize: 13 }}>
        <Icon name="play" size={13} /> Recite
      </span>
    </button>
  );
}

/* ---------- Section heading with lotus ornament ---------- */
function GuideSection({ id, eyebrow, title, children, refMap }) {
  return (
    <section id={id} ref={el => { if (refMap) refMap.current[id] = el; }} style={{ scrollMarginTop: 130, padding: "40px 0 4px" }}>
      <span className="eyebrow" style={{ color: "var(--saffron)" }}>{eyebrow}</span>
      <h2 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", margin: "8px 0 22px" }}>{title}</h2>
      {children}
    </section>
  );
}

/* ============================================================
   RichGuide — the shared festival / vratham body
   ============================================================ */
function RichGuide({ data, meta, kind, go }) {
  const D = window.AKSHARA_DATA;
  const deity = D.deities.find(d => d.id === data.deity);
  const refMap = useRef({});
  const [active, setActive] = useState("significance");

  const has = (k) => Array.isArray(data[k]) && data[k].length > 0;
  const sections = [
    has("significance") && { id: "significance", label: "Significance" },
    has("timeline") && { id: "timeline", label: "When & how" },
    has("samagri") && { id: "samagri", label: "What you need" },
    has("vidhi") && { id: "vidhi", label: "Pūjā vidhi" },
    has("stotras") && { id: "stotras", label: "Stotras to recite" },
    has("naivedya") && { id: "naivedya", label: "Naivedya" },
    (has("dos") || has("donts")) && { id: "dosdonts", label: "Do's & don'ts" },
  ].filter(Boolean);

  // track which section is in view
  useEffect(() => {
    const onScroll = () => {
      let cur = sections[0] && sections[0].id;
      for (const s of sections) {
        const el = refMap.current[s.id];
        if (el && el.getBoundingClientRect().top <= 160) cur = s.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  const jump = (id) => {
    const el = refMap.current[id];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 118, behavior: "smooth" });
  };

  return (
    <>
      {sections.length > 1 && <SectionSubNav sections={sections} activeId={active} onJump={jump} />}
      <div className="wrap" style={{ padding: "0 40px 40px", maxWidth: 860 }}>

        {has("significance") && (
          <GuideSection id="significance" eyebrow="Why it is kept" title="Significance" refMap={refMap}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {data.significance.map((p, i) => (
                <p key={i} style={{ fontSize: 17, lineHeight: 1.72, color: "var(--ink-soft)", margin: 0, textWrap: "pretty" }}>{p}</p>
              ))}
            </div>
          </GuideSection>
        )}

        {has("timeline") && (
          <GuideSection id="timeline" eyebrow="The day, hour by hour" title="When & how" refMap={refMap}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {data.timeline.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 22 }}>
                  <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--saffron)", border: "2px solid var(--paper)", boxShadow: "0 0 0 1px var(--gold)" }} />
                    {i < data.timeline.length - 1 && <span style={{ flex: 1, width: 2, background: "var(--line)", marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingTop: -2 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--maroon)" }}>{t.t}</div>
                    <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-soft)", margin: "4px 0 0", textWrap: "pretty" }}>{t.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </GuideSection>
        )}

        {has("samagri") && (
          <GuideSection id="samagri" eyebrow="Gather beforehand" title="What you need" refMap={refMap}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 12 }}>
              {data.samagri.map((it, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 11, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "13px 16px" }}>
                  <span style={{ flex: "none", color: "var(--gold)", marginTop: 1 }}><Lotus size={16} color="var(--gold)" /></span>
                  <span style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-soft)" }}>{it}</span>
                </div>
              ))}
            </div>
          </GuideSection>
        )}

        {has("vidhi") && (
          <GuideSection id="vidhi" eyebrow="Step by step" title="Pūjā vidhi" refMap={refMap}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {data.vidhi.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 16, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "16px 18px" }}>
                  <span style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid var(--gold)", color: "var(--maroon)", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{v.step}</div>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-soft)", margin: "3px 0 0", textWrap: "pretty" }}>{v.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </GuideSection>
        )}

        {has("stotras") && (
          <GuideSection id="stotras" eyebrow="To chant on the day" title="Stotras to recite" refMap={refMap}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 10 }}>
              {data.stotras.map(id => <StotraLink key={id} id={id} go={go} />)}
            </div>
          </GuideSection>
        )}

        {has("naivedya") && (
          <GuideSection id="naivedya" eyebrow="What to offer & make" title="Naivedya · prasādam" refMap={refMap}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.naivedya.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "13px 0", borderBottom: i < data.naivedya.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                  <span style={{ flex: "none", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--maroon)", minWidth: 150 }}>{n.item}</span>
                  <span style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55 }}>{n.note}</span>
                </div>
              ))}
            </div>
          </GuideSection>
        )}

        {(has("dos") || has("donts")) && (
          <GuideSection id="dosdonts" eyebrow="Keep it right" title="Do's & don'ts" refMap={refMap}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 16 }}>
              {has("dos") && (
                <div style={{ background: "color-mix(in srgb, var(--gold) 9%, var(--paper))", border: "1px solid var(--gold)", borderRadius: "var(--radius)", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14, color: "var(--maroon)" }}><Icon name="check" size={18} /><span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>Do</span></div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                    {data.dos.map((d, i) => <li key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-soft)" }}><span style={{ color: "var(--maroon)", flex: "none" }}>·</span>{d}</li>)}
                  </ul>
                </div>
              )}
              {has("donts") && (
                <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14, color: "var(--ink-faint)" }}><Icon name="close" size={18} /><span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>Don't</span></div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                    {data.donts.map((d, i) => <li key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-soft)" }}><span style={{ color: "var(--ink-faint)", flex: "none" }}>·</span>{d}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </GuideSection>
        )}

        {deity && window.DeityFootRow && (
          <GuideSection id="deityfoot" eyebrow="Whose day it is" title="The deity" refMap={refMap}>
            <window.DeityFootRow deity={deity.id} go={go} />
          </GuideSection>
        )}

        <p style={{ fontSize: 13, color: "var(--ink-faint)", fontStyle: "normal", lineHeight: 1.6, marginTop: 40, paddingTop: 22, borderTop: "1px solid var(--line-soft)" }}>
          Observance varies by region, sampradāya, and family custom. This is a respectful, widely-accepted account — follow your family's elders and purohita where they differ.
        </p>
      </div>
    </>
  );
}

/* ---------- Detail hero (night band) ---------- */
function ObservanceHero({ title, deva, deity, tagline, kind, when, duration, dateStr, backLabel, onBack }) {
  const D = window.AKSHARA_DATA;
  const dd = D.deities.find(d => d.id === deity);
  return (
    <div style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.12 }}><Mandala size={460} spin /></div>
      <div className="wrap" style={{ padding: "28px 40px 40px", position: "relative" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--on-night-soft)", fontSize: 14, marginBottom: 26, cursor: "pointer" }}>
          <Icon name="arrowL" size={16} /> {backLabel}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          {dd && <div style={{ width: 72, height: 72, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold-bright)", color: "var(--gold-bright)" }}><Sa as="span" style={{ fontSize: 32, lineHeight: 1 }}>{dd.seed}</Sa></div>}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>{kind}</span>
              {dateStr && <span style={{ fontSize: 13, color: "var(--on-night-soft)" }}>· {dateStr}</span>}
            </div>
            <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.9rem)", lineHeight: 1.08, marginTop: 10, color: "var(--on-night)" }}>{title}</h1>
            <Sa as="div" style={{ fontSize: 22, color: "var(--gold-bright)", marginTop: 6 }}>{deva}</Sa>
            {tagline && <p style={{ fontSize: 16.5, color: "var(--on-night-soft)", lineHeight: 1.6, marginTop: 14, maxWidth: 620, textWrap: "pretty" }}>{tagline}</p>}
            <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginTop: 18 }}>
              {when && <div><div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--on-night-soft)" }}>When</div><div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, marginTop: 3 }}>{when}</div></div>}
              {duration && <div><div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--on-night-soft)" }}>Duration</div><div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, marginTop: 3 }}>{duration}</div></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Graceful stub when a guide isn't authored yet ---------- */
function GuideStub({ name }) {
  return (
    <div className="wrap" style={{ padding: "50px 40px 30px", maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, color: "var(--gold)", opacity: 0.5 }}><Mandala size={120} /></div>
      <p style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink)" }}>A full guide is being prepared.</p>
      <p style={{ textAlign: "center", fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 520, margin: "8px auto 0" }}>
        The complete procedure for {name} — its vidhi, naivedya, and observances — will appear here. The significance above is ready to read.
      </p>
    </div>
  );
}

/* ============================================================
   FESTIVAL DETAIL
   ============================================================ */
function FestivalDetailScreen({ go, id }) {
  const D = window.AKSHARA_DATA;
  const meta = D.festivals.find(f => f.id === id);
  const data = OBS.festivals[id];
  if (!meta && !data) return <div className="wrap" style={{ padding: "80px 40px" }}><p>Not found.</p></div>;
  const year = new Date().getFullYear();
  const dObj = meta ? festDate(meta, year) : null;
  const dateStr = dObj ? dObj.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }) : (meta && meta.when);
  const guide = data ? { ...data, deity: data.deity || (meta && meta.region) } : null;

  return (
    <div className="rise">
      <ObservanceHero
        title={meta ? meta.name : id} deva={meta && meta.deva} deity={(data && data.deity)}
        tagline={(data && data.tagline) || (meta && meta.note)} kind={meta ? (REGION_LABEL[meta.region] || "Festival") + " · festival" : "Festival"}
        when={meta && meta.when} duration={data && data.duration} dateStr={dateStr}
        backLabel="All festivals" onBack={() => go("festivals")} />
      {guide ? <RichGuide data={guide} meta={meta} kind="festival" go={go} /> : <GuideStub name={meta ? meta.name : "this festival"} />}
    </div>
  );
}

/* ============================================================
   VRATHAM DETAIL
   ============================================================ */
function VrathamDetailScreen({ go, id }) {
  const data = OBS.vrathams.find(v => v.id === id);
  if (!data) return <div className="wrap" style={{ padding: "80px 40px" }}><p>Not found.</p></div>;
  return (
    <div className="rise">
      <ObservanceHero
        title={data.name} deva={data.deva} deity={data.deity} tagline={data.tagline}
        kind="Vratham" when={data.when} duration={data.duration}
        backLabel="All vrathams" onBack={() => go("vrathams")} />
      {data.stub ? (
        <>
          <RichGuide data={{ ...data, timeline: null, samagri: null, vidhi: null, naivedya: null, dos: null, donts: null }} kind="vratham" go={go} />
          <GuideStub name={data.name} />
        </>
      ) : <RichGuide data={data} kind="vratham" go={go} />}
    </div>
  );
}

/* ============================================================
   FESTIVALS INDEX
   ============================================================ */
function FestivalsScreen({ go }) {
  const D = window.AKSHARA_DATA;
  const year = new Date().getFullYear();
  const today = new Date();
  const [region, setRegion] = useState("all");
  const [q, setQ] = useState("");

  const all = D.festivals.map(f => ({ ...f, dateObj: festDate(f, year), authored: !!OBS.festivals[f.id] }))
    .filter(f => f.dateObj)
    .sort((a, b) => a.dateObj - b.dateObj);
  const regions = ["all", ...Array.from(new Set(D.festivals.map(f => f.region).filter(Boolean)))];
  const upcoming = all.filter(f => f.dateObj >= new Date(today.getFullYear(), today.getMonth(), today.getDate())).slice(0, 3);

  let list = all.filter(f => region === "all" || f.region === region);
  if (q.trim()) { const h = q.trim().toLowerCase(); list = list.filter(f => (f.name + " " + f.deva + " " + (f.note || "")).toLowerCase().includes(h)); }

  return (
    <div className="rise" style={{ paddingBottom: 40 }}>
      <SectionTabs route={"festivals"} go={go} items={[
        { label: "Pañcāṅga", route: "calendar" },
        { label: "Festivals", route: "festivals", routes: ["festivals", "festival"] },
        { label: "Vrathams", route: "vrathams", routes: ["vrathams", "vratham"] },
      ]} />
      {/* hero */}
      <div style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.1 }}><Mandala size={460} spin /></div>
        <div className="wrap" style={{ padding: "48px 40px 40px", position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>The year's turning · <Sa as="span">उत्सव</Sa></span>
          <h1 style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", marginTop: 12, color: "var(--on-night)" }}>Festivals</h1>
          <p style={{ color: "var(--on-night-soft)", fontSize: 16.5, maxWidth: 600, marginTop: 12, lineHeight: 1.6 }}>
            How each festival is kept — its meaning, the day's rhythm, the pūjā, what to recite and offer. Telugu Smārta practice, with notes where regions differ.
          </p>
          {/* next up */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
            {upcoming.map(f => (
              <button key={f.id} onClick={() => go("festival", { id: f.id })}
                style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(240,228,204,0.07)", border: "1px solid rgba(240,228,204,0.2)", borderRadius: 12, padding: "11px 16px", color: "var(--on-night)", cursor: "pointer", textAlign: "left" }}>
                <div style={{ textAlign: "center", flex: "none" }}>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gold-bright)" }}>{f.dateObj.toLocaleDateString(undefined, { month: "short" })}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, lineHeight: 1 }}>{f.dateObj.getDate()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-bright)" }}>Next up</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600 }}>{f.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* filter bar */}
      <div className="subnav-sticky" style={{ position: "sticky", top: "var(--header-h)", zIndex: 25, background: "color-mix(in srgb, var(--paper) 93%, transparent)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "13px 40px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: "9px 16px" }}>
            <Icon name="search" size={17} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search festivals…" style={{ flex: 1, background: "none", border: 0, outline: "none", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--ink)" }} />
            {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0, color: "var(--ink-faint)" }}><Icon name="close" size={15} /></button>}
          </div>
          <div className="subnav-scroll" style={{ display: "flex", gap: 8, overflowX: "auto" }}>
            {regions.map(r => (
              <button key={r} className="chip" data-active={region === r} onClick={() => setRegion(r)} style={{ height: 34, fontSize: 13.5, whiteSpace: "nowrap", flex: "none" }}>
                {r === "all" ? "All" : REGION_LABEL[r] || r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* list */}
      <div className="wrap" style={{ padding: "26px 40px 0" }}>
        <div style={{ fontSize: 13.5, color: "var(--ink-faint)", marginBottom: 18 }}>{list.length} {list.length === 1 ? "festival" : "festivals"} · {year}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px,1fr))", gap: 14 }}>
          {list.map(f => (
            <button key={f.id} onClick={() => go("festival", { id: f.id })} className="fest-row linked"
              style={{ display: "flex", alignItems: "center", gap: 18, textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "18px 20px", cursor: "pointer" }}>
              <div style={{ flex: "none", width: 58, textAlign: "center" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--saffron)", fontWeight: 600 }}>{f.dateObj.toLocaleDateString(undefined, { month: "short" })}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--maroon)", lineHeight: 1 }}>{f.dateObj.getDate()}</div>
              </div>
              <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>{f.name}</span>
                  <Sa as="span" style={{ fontSize: 14.5, color: "var(--ink-faint)" }}>{f.deva}</Sa>
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, margin: "4px 0 0", textWrap: "pretty", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{f.note}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 7 }}>
                  {f.region && <span style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: KINDC[f.kind] || "var(--gold)", border: "1px solid var(--line)", borderRadius: 999, padding: "2px 9px" }}>{REGION_LABEL[f.region] || f.region}</span>}
                  {f.authored
                    ? <span style={{ fontSize: 12, color: "var(--saffron)", display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="check" size={13} /> Full guide</span>
                    : <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Guide coming</span>}
                </div>
              </div>
              <Icon name="chevron" size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VRATHAMS INDEX
   ============================================================ */
function VrathamsScreen({ go }) {
  const D = window.AKSHARA_DATA;
  const list = OBS.vrathams;
  return (
    <div className="rise" style={{ paddingBottom: 40 }}>
      <SectionTabs route={"vrathams"} go={go} items={[
        { label: "Pañcāṅga", route: "calendar" },
        { label: "Festivals", route: "festivals", routes: ["festivals", "festival"] },
        { label: "Vrathams", route: "vrathams", routes: ["vrathams", "vratham"] },
      ]} />
      <div style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.1 }}><Mandala size={460} spin /></div>
        <div className="wrap" style={{ padding: "48px 40px 40px", position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>Vows kept · <Sa as="span">व्रतम्</Sa></span>
          <h1 style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", marginTop: 12, color: "var(--on-night)" }}>Vrathams</h1>
          <p style={{ color: "var(--on-night-soft)", fontSize: 16.5, maxWidth: 620, marginTop: 12, lineHeight: 1.6 }}>
            A vratham is a vow — kept on a chosen day with fast, pūjā, and the reading of its kathā. Here is the full procedure for each, with what to gather, recite, and offer.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ padding: "34px 40px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 16 }}>
          {list.map(v => {
            const dd = D.deities.find(d => d.id === v.deity);
            return (
              <button key={v.id} onClick={() => go("vratham", { id: v.id })} className="text-card"
                style={{ textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "24px 24px 22px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease" }}>
                <div style={{ position: "absolute", right: -28, bottom: -28, color: "var(--gold)", opacity: 0.12 }}><Mandala size={130} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
                  <span style={{ width: 50, height: 50, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold)", color: "var(--maroon)" }}><Sa as="span" style={{ fontSize: 22 }}>{(dd || {}).seed || v.seed}</Sa></span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, lineHeight: 1.15 }}>{v.name}</div>
                    <Sa as="div" style={{ fontSize: 14.5, color: "var(--maroon)", marginTop: 2 }}>{v.deva}</Sa>
                  </div>
                </div>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "16px 0 0", textWrap: "pretty", position: "relative" }}>{v.tagline}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, position: "relative" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{v.when}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12.5, color: v.stub ? "var(--ink-faint)" : "var(--saffron)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    {v.stub ? "Guide coming" : <><Icon name="check" size={13} /> Full guide</>}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FestivalsScreen, FestivalDetailScreen, VrathamsScreen, VrathamDetailScreen, SectionSubNav, festDate });

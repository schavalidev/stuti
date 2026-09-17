/* ============================================================
   AKSHARA — the two shelves the phone had first: Nomulu and
   Pārāyaṇa. Data shared verbatim from the Stuti modules
   (stuti-nomu-data.js, stuti-parayana-data.js); the guides are
   re-said in the site's own layout. Plus the index shelf
   (awaiting-text rows with a watch toggle) and the deity foot.
   ============================================================ */
const shPick = (x) => x == null ? "" : (typeof x === "object" ? (x.roman || x.tel || x.deva || "") : x);
const shList = (M) => (M && (M.list || (typeof M.get === "function" ? [] : M))) || [];
function shGet(M, id) { if (!M) return null; if (M.get) { const g = M.get(id); if (g) return g; } return shList(M).find(x => x.id === id) || null; }

/* ---------- the deity foot: one row, the seal and the name ---------- */
function DeityFootRow({ deity, go }) {
  const D = window.AKSHARA_DATA;
  const dd = D.deities.find(d => d.id === deity);
  if (!dd) return null;
  return (
    <button onClick={() => go("deity", { deity: dd.id })} className="text-card-list"
      style={{ display: "flex", alignItems: "center", gap: 18, width: "100%", textAlign: "left", cursor: "pointer",
        background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "18px 22px" }}>
      <span style={{ width: 54, height: 54, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold)", color: "var(--maroon)" }}>
        <Sa as="span" style={{ fontSize: 25 }}>{dd.seed}</Sa>
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--ink)" }}>Everything for {dd.name}</span>
        <span style={{ display: "block", fontSize: 13.5, color: "var(--ink-faint)", marginTop: 2 }}>{dd.epithet} · every hymn, in one place</span>
      </span>
      <span style={{ flex: "none", color: "var(--saffron)", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>Open <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><Icon name="arrowL" size={15} /></span></span>
    </button>
  );
}

/* ---------- shared night hero for the shelves ---------- */
function ShelfHero({ eyebrow, native, title, lede, backLabel, onBack, facts }) {
  return (
    <div style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.12 }}><Mandala size={460} spin /></div>
      <div className="wrap" style={{ padding: (onBack ? "28px" : "44px") + " 40px 42px", position: "relative" }}>
        {onBack && (
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--on-night-soft)", fontSize: 14, marginBottom: 26, cursor: "pointer" }}>
            <Icon name="arrowL" size={16} /> {backLabel}
          </button>
        )}
        <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>{eyebrow}</span>
        <h1 style={{ fontSize: "clamp(2.1rem,3.8vw,3.1rem)", lineHeight: 1.1, marginTop: 12, color: "var(--on-night)" }}>{title}</h1>
        {native && <div className="tel-face" style={{ fontFamily: "var(--font-tel)", fontSize: 21, color: "var(--gold-bright)", marginTop: 8 }}>{native}</div>}
        {lede && <p style={{ color: "var(--on-night-soft)", fontSize: 16.5, maxWidth: 640, marginTop: 14, lineHeight: 1.65, textWrap: "pretty" }}>{lede}</p>}
        {facts && facts.length > 0 && (
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 20 }}>
            {facts.map((f, i) => f[1] ? (
              <div key={i}><div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--on-night-soft)" }}>{f[0]}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16.5, fontWeight: 600, marginTop: 3 }}>{f[1]}</div></div>
            ) : null)}
          </div>
        )}
      </div>
    </div>
  );
}

function ShelfSection({ eyebrow, title, children }) {
  return (
    <section style={{ padding: "38px 0 4px" }}>
      <span className="eyebrow" style={{ color: "var(--saffron)" }}>{eyebrow}</span>
      <h2 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", margin: "8px 0 20px" }}>{title}</h2>
      {children}
    </section>
  );
}
const shBody = { fontSize: 16.5, lineHeight: 1.72, color: "var(--ink-soft)", margin: 0, textWrap: "pretty" };

/* ============================================================
   NOMULU — index + guide
   ============================================================ */
const NOMU_CADENCE = [
  { key: "daily", label: "Daily, through the year", test: t => /daily|each day|every day/.test(t) },
  { key: "multiyear", label: "Kept for several years", test: t => /(five|six|nine|sixteen|\d{2,}|thousand)s?\s+years|years from the first year/.test(t) },
  { key: "annual", label: "Once a year", test: t => /^(one year\.?|through one year\.?)$/.test(t.trim()) || (/year/.test(t) && !/day/.test(t)) },
  { key: "fixed", label: "A fixed span of days", test: t => /\d+\s+days|nine days|thirty days/.test(t) },
  { key: "occasion", label: "Tied to a date or occasion", test: t => /eclipse|nakshatram|purnima|amavasya|tadiya|saptami|any time in/.test(t) },
];
function nomuCadence(n) {
  const t = (shPick(n.when) || "").toLowerCase();
  if (!t) return "unspecified";
  for (const c of NOMU_CADENCE) if (c.test(t)) return c.key;
  return "unspecified";
}
function NomusScreen({ go }) {
  const list = shList(window.STUTI_NOMU);
  const [filter, setFilter] = React.useState("all");
  const groups = [...NOMU_CADENCE, { key: "unspecified", label: "As the family keeps it" }];
  const shown = filter === "all" ? list : list.filter(n => nomuCadence(n) === filter);
  return (
    <div className="rise" style={{ paddingBottom: 70 }}>
      <ShelfHero eyebrow="The household vows" native="నోములు" title="Nomulu"
        lede="A nomu is not a smaller vratham. A vratham asks when the day falls; a nomu asks how many years you have kept it and who you handed the vāyanam to. Taken up for a fixed count of years, closed with an udyāpana, and carried by a story told aloud." />
      <div className="wrap" style={{ padding: "34px 40px 0", maxWidth: 1000 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
          <button onClick={() => setFilter("all")} style={nomuPillStyle(filter === "all")}>All {list.length}</button>
          {groups.map(g => {
            const n = list.filter(x => nomuCadence(x) === g.key).length;
            if (!n) return null;
            return <button key={g.key} onClick={() => setFilter(g.key)} style={nomuPillStyle(filter === g.key)}>{g.label} · {n}</button>;
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
          {shown.map(n => (
            <button key={n.id} onClick={() => go("nomu", { id: n.id })} className="coll-card"
              style={{ textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "20px 22px", cursor: "pointer", transition: "all .18s ease" }}>
              <div style={{ fontFamily: "var(--font-tel)", fontSize: 24, color: "var(--maroon)", lineHeight: 1.3 }}>{n.name.tel}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--ink)", marginTop: 5 }}>{shPick(n.name)}</div>
              <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 6 }}>{shPick(n.when)}{n.years ? " · " + shPick(n.years).toLowerCase() : ""}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-soft)", margin: "12px 0 0", textWrap: "pretty" }}>{shPick(n.tagline)}</p>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.65, marginTop: 34, maxWidth: 64 + "ch" }}>
          Varalakṣmī and Maṅgaḷa Gaurī are kept as nomulu in most houses but fall on computed tithis, so they live with the <a onClick={e => { e.preventDefault(); go("vrathams"); }} href="#" style={{ color: "var(--maroon)", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>vrathams</a> and their dates rather than being duplicated here. Families differ — in the count of years, in what goes in the vāyanam — and their own elders outrank this page.
        </p>
      </div>
    </div>
  );
}
function nomuPillStyle(active) {
  return { padding: "8px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: active ? "1px solid var(--maroon)" : "1px solid var(--line)", background: active ? "var(--maroon)" : "var(--paper-2)", color: active ? "var(--paper)" : "var(--ink-soft)", transition: "all .15s ease" };
}

function NomuScreen({ go, id }) {
  const n = shGet(window.STUTI_NOMU, id);
  if (!n) return <div className="wrap" style={{ padding: "80px 40px" }}><p>Not found.</p></div>;
  return (
    <div className="rise" style={{ paddingBottom: 70 }}>
      <ShelfHero eyebrow="Nomu · household vow" native={n.name.tel} title={shPick(n.name)} lede={shPick(n.tagline)}
        backLabel="All nomulu" onBack={() => go("nomus")}
        facts={[["When", shPick(n.when)], ["The count", shPick(n.years)], ["Who keeps it", shPick(n.who)]]} />
      <div className="wrap" style={{ padding: "0 40px 40px", maxWidth: 820 }}>
        {Array.isArray(n.gist) && n.gist.length > 0 && (
          <ShelfSection eyebrow="What it is" title="The vow">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{n.gist.map((g, i) => <p key={i} style={shBody}>{shPick(g)}</p>)}</div>
          </ShelfSection>
        )}
        {Array.isArray(n.vidhi) && n.vidhi.length > 0 && (
          <ShelfSection eyebrow="Step by step" title="How the day goes">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {n.vidhi.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 16, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "16px 18px" }}>
                  <span style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid var(--gold)", color: "var(--maroon)", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{shPick(v.step)}</div>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-soft)", margin: "3px 0 0", textWrap: "pretty" }}>{shPick(v.detail)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ShelfSection>
        )}
        {Array.isArray(n.vayanam) && n.vayanam.length > 0 && (
          <ShelfSection eyebrow="What is given" title="The vāyanam">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {n.vayanam.map((v, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "13px 0", borderBottom: i < n.vayanam.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                  <span style={{ flex: "none", fontFamily: "var(--font-display)", fontSize: 17.5, fontWeight: 600, color: "var(--maroon)", minWidth: 170 }}>{shPick(v.item)}</span>
                  <span style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55 }}>{shPick(v.note)}</span>
                </div>
              ))}
            </div>
          </ShelfSection>
        )}
        {n.katha && (
          <ShelfSection eyebrow="Told aloud before the vāyanam" title="The story">
            <div style={{ background: "color-mix(in srgb, var(--gold) 8%, var(--paper))", border: "1px solid var(--gold)", borderRadius: "var(--radius)", padding: "22px 26px" }}>
              <p style={shBody}>{shPick(n.katha)}</p>
            </div>
          </ShelfSection>
        )}
        {n.udyapana && (
          <ShelfSection eyebrow="How it is closed" title="The udyāpana">
            <p style={shBody}>{shPick(n.udyapana)}</p>
          </ShelfSection>
        )}
        <ShelfSection eyebrow="Whose day it is" title="To recite">
          <DeityFootRow deity={n.deity} go={go} />
        </ShelfSection>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6, marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line-soft)" }}>
          The common shape, respectfully given. Families differ — in the count of years, in the vāyanam, in who may keep it — and your own elders outrank this page.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   PĀRĀYAṆA — index + guide
   ============================================================ */
function ParayanasScreen({ go }) {
  const list = shList(window.STUTI_PARAYANA);
  return (
    <div className="rise" style={{ paddingBottom: 70 }}>
      <ShelfHero eyebrow="The sustained readings" native="పారాయణం" title="Pārāyaṇa"
        lede="A stotra is read; a pārāyaṇa is undertaken. Each guide here is a schedule rather than a text — how a long work is cut into days, how many days the tradition allows, when it is begun, and the niyama that holds between the first day and the last." />
      <div className="wrap" style={{ padding: "34px 40px 0", maxWidth: 1000 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
          {list.map(p => (
            <button key={p.id} onClick={() => go("parayana", { id: p.id })} className="coll-card"
              style={{ textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "20px 22px", cursor: "pointer", transition: "all .18s ease" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 19.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>{shPick(p.name)}</div>
              <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 6 }}>{shPick(p.source)} · {shPick(p.span)}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-soft)", margin: "12px 0 0", textWrap: "pretty" }}>{shPick(p.tagline)}</p>
              {Array.isArray(p.schedules) && <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 14 }}>
                {p.schedules.map((s, i) => <span key={i} style={{ fontSize: 12, color: "var(--maroon)", border: "1px solid var(--gold)", borderRadius: 999, padding: "3px 11px" }}>{shPick(s.span)}</span>)}
              </div>}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-faint)", lineHeight: 1.65, marginTop: 34, maxWidth: 64 + "ch" }}>
          The divisions are the common ones. A guru's own division outranks them, and a household that has read the Sundarakāṇḍa in five days for three generations should go on doing so.
        </p>
      </div>
    </div>
  );
}

function ParayanaScreen({ go, id }) {
  const P = window.STUTI_PARAYANA;
  const p = shGet(P, id);
  if (!p) return <div className="wrap" style={{ padding: "80px 40px" }}><p>Not found.</p></div>;
  const niyama = (P && P.niyama) || [];
  return (
    <div className="rise" style={{ paddingBottom: 70 }}>
      <ShelfHero eyebrow="Pārāyaṇa · sustained reading" native={p.name.tel} title={shPick(p.name)} lede={shPick(p.tagline)}
        backLabel="All pārāyaṇas" onBack={() => go("parayanas")}
        facts={[["Source", shPick(p.source)], ["Span", shPick(p.span)]]} />
      <div className="wrap" style={{ padding: "0 40px 40px", maxWidth: 820 }}>
        {Array.isArray(p.gist) && p.gist.length > 0 && (
          <ShelfSection eyebrow="What is undertaken" title="The reading">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{p.gist.map((g, i) => <p key={i} style={shBody}>{shPick(g)}</p>)}</div>
          </ShelfSection>
        )}
        {Array.isArray(p.schedules) && p.schedules.length > 0 && (
          <ShelfSection eyebrow="How it is cut into days" title="The divisions">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {p.schedules.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 18, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "16px 20px", flexWrap: "wrap" }}>
                  <span style={{ flex: "none", minWidth: 130, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--maroon)" }}>{shPick(s.span)}</span>
                  <p style={{ flex: "1 1 300px", fontSize: 15, lineHeight: 1.62, color: "var(--ink-soft)", margin: 0, textWrap: "pretty" }}>{shPick(s.how)}</p>
                </div>
              ))}
            </div>
          </ShelfSection>
        )}
        {p.when && (
          <ShelfSection eyebrow="The favoured days" title="When it is begun">
            <p style={shBody}>{shPick(p.when)}</p>
          </ShelfSection>
        )}
        {niyama.length > 0 && (
          <ShelfSection eyebrow="What holds, first day to last" title="The niyama">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {niyama.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ flex: "none", color: "var(--gold)", marginTop: 5 }}><Lotus size={15} color="var(--gold)" /></span>
                  <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-soft)", margin: 0, textWrap: "pretty" }}>{shPick(r)}</p>
                </div>
              ))}
            </div>
          </ShelfSection>
        )}
        <ShelfSection eyebrow="Whose reading it is" title="To recite">
          <DeityFootRow deity={p.deity} go={go} />
        </ShelfSection>
      </div>
    </div>
  );
}

/* ============================================================
   IndexShelf — the full index on a deity's page: entries whose
   texts are still being keyed, each with a watch toggle.
   ============================================================ */
function IndexShelf({ deity }) {
  const [, force] = useState(0);
  const [openAll, setOpenAll] = useState(false);
  useEffect(() => window.STUTI_WATCH ? window.STUTI_WATCH.subscribe(() => force(x => x + 1)) : undefined, []);
  const IDX = window.STOTRA_INDEX;
  if (!IDX || !window.STUTI_WATCH) return null;
  const entry = (IDX.deities || []).find(d => d.id === deity.id);
  if (!entry) return null;
  const D = window.AKSHARA_DATA;
  const fold = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const have = new Set(D.stotras.filter(s => s.deity === deity.id).map(s => fold(s.title)));
  const rows = (entry.list || []).filter(r => !have.has(fold(r[0])));
  if (rows.length === 0) return null;
  const shown = openAll ? rows : rows.slice(0, 10);
  const W = window.STUTI_WATCH;
  return (
    <section style={{ marginTop: 46, borderTop: "1px solid var(--line)", paddingTop: 34 }}>
      <span className="eyebrow" style={{ color: "var(--saffron)" }}>In the index · texts being keyed</span>
      <h2 style={{ fontSize: "clamp(1.4rem,2.2vw,1.8rem)", margin: "8px 0 6px" }}>{rows.length} more in the granthasūcī</h2>
      <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 20px", maxWidth: 62 + "ch", textWrap: "pretty" }}>
        These are in the library's index by name while their texts are keyed and proofed. Ask to be told when one arrives, and it will be waiting in your library.
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {shown.map((r, i) => {
          const [iast, deva, tel, author] = r;
          const wid = deity.id + "|" + fold(iast);
          const on = W.has(wid);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 2px", borderBottom: "1px solid var(--line-soft)" }}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16.5, fontWeight: 600, color: "var(--ink)" }}>{iast}</span>
                {deva && <Sa as="span" style={{ fontSize: 14, color: "var(--ink-faint)", marginLeft: 10 }}>{deva}</Sa>}
                {author ? <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-faint)", marginTop: 1 }}>{author}</span> : null}
              </span>
              <button className="chip" data-active={on} onClick={() => W.toggle(wid)} style={{ height: 34, fontSize: 13, flex: "none" }}>
                {on ? "Watching ✓" : "Tell me when it arrives"}
              </button>
            </div>
          );
        })}
      </div>
      {rows.length > 10 && (
        <button onClick={() => setOpenAll(v => !v)} style={{ marginTop: 16, background: "none", border: 0, color: "var(--maroon)", fontSize: 14, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
          {openAll ? "Show fewer" : `Show all ${rows.length}`}
        </button>
      )}
    </section>
  );
}

Object.assign(window, { NomusScreen, NomuScreen, ParayanasScreen, ParayanaScreen, DeityFootRow, IndexShelf, ShelfHero, ShelfSection });

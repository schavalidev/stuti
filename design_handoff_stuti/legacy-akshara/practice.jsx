/* ============================================================
   AKSHARA — Practice (sādhanā): the thread, japa, plans, vows.
   State lives in the shared Stuti stores (stuti-sadhana.js), so a
   household that counts on the phone finds the same counts here.
   ============================================================ */
const AK_JAPA_THREADS = ["ganesha", "shiva", "devi", "vishnu", "subrahmanya", "surya", "hanuman", "guru"];
const AK_DEITY_EXTRA = {
  subrahmanya: { name: "Subrahmaṇya", deva: "सुब्रह्मण्य", seed: "षं", epithet: "The commander, the six-faced" },
  guru: { name: "Guru", deva: "गुरु", seed: "गुं", epithet: "The teacher's line" },
};
function akDeity(id) {
  const D = window.AKSHARA_DATA;
  return (D.deities || []).find(d => d.id === id) || (AK_DEITY_EXTRA[id] ? { id, ...AK_DEITY_EXTRA[id] } : { id, name: id, deva: "", seed: "ॐ", epithet: "" });
}
function useStoreTick(...stores) {
  const [, f] = useState(0);
  useEffect(() => { const offs = stores.filter(Boolean).map(s => s.subscribe(() => f(x => x + 1))); return () => offs.forEach(o => o && o()); }, []);
}
function akStotra(id) { return (window.AKSHARA_DATA.stotras || []).find(s => s.id === id) || null; }
function akTitle(id) {
  const s = akStotra(id);
  if (s) return s.title;
  /* Phone-side ids often lead with the deity ("vishnu-visnu-sahasranama-stotram").
     Drop that segment so the ledger reads as a title, not a stutter, and map the
     common IAST losses back (visnu → Viṣṇu, calisa → Cālīsā). */
  let parts = id.replace(/_/g, "-").split("-").filter(Boolean);
  const lead = { ganesha: 1, shiva: 1, vishnu: 1, devi: 1, lakshmi: 1, hanuman: 1, sarasvati: 1, surya: 1, subrahmanya: 1, guru: 1, rama: 1, krishna: 1 };
  if (parts.length > 1 && lead[parts[0]]) parts = parts.slice(1);
  const FIX = { visnu: "Viṣṇu", vishnu: "Viṣṇu", siva: "Śiva", sahasranama: "Sahasranāma", stotram: "Stotram", stotra: "Stotra", calisa: "Cālīsā", chalisa: "Cālīsā", astakam: "Aṣṭakam", ashtakam: "Aṣṭakam", astottara: "Aṣṭottara", mahaganapati: "Mahāgaṇapati", lalita: "Lalitā", hanuman: "Hanumān", kavacam: "Kavacam", hrdayam: "Hṛdayam", hridayam: "Hṛdayam", aditya: "Āditya", suprabhatam: "Suprabhātam", bhujangam: "Bhujaṅgam", pancaratnam: "Pañcaratnam", pancharatnam: "Pañcaratnam" };
  return parts.map(w => FIX[w] || (w.charAt(0).toUpperCase() + w.slice(1))).join(" ");
}
function planHymn(s) { const n = Math.max(1, Number(s && s.verses) || (s && s.text ? s.text.length : 0) || 1); return { id: s ? s.id : "", verses: new Array(n) }; }
function fmtDay(d) { return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }); }

/* ---------- the last-14-days dots ---------- */
function ThreadDots({ n = 14, size = 9, onNight = false }) {
  const days = window.STUTI_THREAD.last(n);
  const base = onNight ? "rgba(240,228,204,0.22)" : "var(--line)";
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {days.map(d => (
        <span key={d.key} title={d.key} style={{ width: size, height: size, borderRadius: "50%", flex: "none",
          background: d.level === 2 ? "var(--gold)" : d.level === 1 ? "color-mix(in srgb, var(--gold) 55%, transparent)" : base,
          outline: d.today ? "1.5px solid var(--gold)" : "none", outlineOffset: 2 }} />
      ))}
    </div>
  );
}

/* ---------- section heading ---------- */
function PSection({ eyebrow, title, children, aside }) {
  return (
    <section style={{ padding: "38px 0 6px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <span className="eyebrow" style={{ color: "var(--saffron)" }}>{eyebrow}</span>
          <h2 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", margin: "8px 0 0" }}>{title}</h2>
        </div>
        {aside}
      </div>
      <div style={{ marginTop: 22 }}>{children}</div>
    </section>
  );
}

/* ============================================================
   PracticeScreen — the hub
   ============================================================ */
function PracticeScreen({ go, favorites = [] }) {
  const T = window.STUTI_THREAD, J = window.STUTI_JAPA, PL = window.STUTI_PLANS, V = window.STUTI_VOWS;
  useStoreTick(T, J, PL, V);
  const st = T.streak();
  const todayRec = (T.day() || { r: [] }).r || [];
  const due = V.dueToday();
  const activePlans = PL.active().map(id => ({ id, s: akStotra(id), p: PL.get(id) }));
  const japaToday = AK_JAPA_THREADS.reduce((n, id) => n + J.state(id).today, 0);
  const favList = favorites.map(akStotra).filter(Boolean);
  const owedEmpty = due.length === 0 && activePlans.length === 0;

  return (
    <div className="rise" style={{ paddingBottom: 70 }}>
      {/* hero */}
      <div style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-5%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.12 }}><Mandala size={460} spin /></div>
        <div className="wrap" style={{ padding: "44px 40px 44px", position: "relative", display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 380px", minWidth: 0 }}>
            <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>Sādhanā</span>
            <h1 style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", marginTop: 12, color: "var(--on-night)" }}>Practice</h1>
            <p style={{ color: "var(--on-night-soft)", fontSize: 16.5, maxWidth: 560, marginTop: 12, lineHeight: 1.6, textWrap: "pretty" }}>
              The unbroken thread — kept alive by any recitation, any completed portion, any japa. Counted on the phone or here; it is one record.
            </p>
          </div>
          <div style={{ flex: "none", textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, justifyContent: "flex-end" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 600, lineHeight: 1, color: "var(--gold-bright)" }}>{st.days}</span>
              <span style={{ fontSize: 15, color: "var(--on-night-soft)" }}>{st.days === 1 ? "day on the thread" : "days on the thread"}</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}><ThreadDots onNight /></div>
            <div style={{ marginTop: 10, fontSize: 13, color: "var(--on-night-soft)" }}>
              {st.today ? "Today is kept." : "Nothing yet today — the thread waits."}{st.graced ? ` · ${st.graced} ${st.graced === 1 ? "day" : "days"} bridged by grace` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ padding: "0 40px 40px", maxWidth: 1000 }}>
        {/* owed today */}
        <PSection eyebrow="The day's obligations" title="Owed today"
          aside={<span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>{japaToday > 0 ? `${japaToday} japa counted today` : ""}</span>}>
          {owedEmpty && (
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.65, margin: 0, maxWidth: 60 + "ch" }}>
              No vow falls today and no plan is running. Any recitation below keeps the thread.
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {due.map(v => {
              const kept = V.keptToday(v);
              const o = V.occ(v.occasion);
              return (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 16, background: "color-mix(in srgb, var(--gold) 8%, var(--paper))", border: "1px solid var(--gold)", borderRadius: "var(--radius)", padding: "15px 18px", flexWrap: "wrap" }}>
                  <span style={{ flex: "none", color: "var(--maroon)" }}><Icon name="flame" size={20} /></span>
                  <span style={{ flex: 1, minWidth: 200 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 17.5, fontWeight: 600, color: "var(--ink)" }}>{akTitle(v.hymn)}</span>
                    <span style={{ display: "block", fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>Vow · {o.name} · due today</span>
                  </span>
                  {akStotra(v.hymn) && <button className="btn-ghost" onClick={() => go("stotraReader", { id: v.hymn })} style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "8px 16px", background: "none", fontSize: 14, color: "var(--ink)" }}>Open</button>}
                  <button className="btn" disabled={kept} onClick={() => V.keep(v.id)}
                    style={{ border: 0, borderRadius: 999, padding: "9px 18px", fontSize: 14, background: kept ? "var(--paper-2)" : "var(--maroon)", color: kept ? "var(--ink-faint)" : "var(--on-night)", cursor: kept ? "default" : "pointer" }}>
                    {kept ? "Kept ✓" : "Mark kept"}
                  </button>
                </div>
              );
            })}
            {activePlans.map(({ id, s, p }) => {
              if (!p) return null;
              const h = planHymn(s || { id, verses: 0 });
              const m = window.STUTI_PLANS.meta(h);
              const day = window.STUTI_PLANS.currentDay(id, h);
              const doneToday = p.last === window.STUTI_THREAD.dkey() && p.done.indexOf(day) >= 0;
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "15px 18px", flexWrap: "wrap" }}>
                  <span style={{ flex: "none", color: "var(--saffron)" }}><Icon name="book" size={20} /></span>
                  <span style={{ flex: 1, minWidth: 200 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 17.5, fontWeight: 600, color: "var(--ink)" }}>{akTitle(id)}</span>
                    <span style={{ display: "block", fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{p.finished ? "Plan complete" : `Plan · day ${day} of ${m.days} · ${p.done.length} done`}</span>
                  </span>
                  <button className="btn-ghost" onClick={() => go("plan", { id })} style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "8px 16px", background: "none", fontSize: 14, color: "var(--ink)" }}>{p.finished ? "Review" : doneToday ? "Done today ✓" : "Today's portion"}</button>
                </div>
              );
            })}
          </div>
          {/* quick-mark the daily list */}
          {favList.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 10 }}>Your daily list — mark what you have recited</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {favList.map(s => {
                  const donef = todayRec.includes(s.id);
                  return (
                    <button key={s.id} className="chip" data-active={donef} onClick={() => !donef && window.STUTI_THREAD.mark("r", s.id)}
                      style={{ height: 36, fontSize: 13.5, cursor: donef ? "default" : "pointer" }}>
                      {donef ? "✓ " : ""}{s.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </PSection>

        {/* japa */}
        <PSection eyebrow="The mālā" title="Japa"
          aside={<span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>108 to a round · the app supplies no mantra</span>}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))", gap: 12 }}>
            {AK_JAPA_THREADS.map(id => {
              const d = akDeity(id), s = window.STUTI_JAPA.state(id);
              const hist = window.STUTI_JAPA.history(id, 7), max = Math.max(1, ...hist.map(h => h.n));
              return (
                <button key={id} onClick={() => { window.STUTI_JAPA.setLast(id); go("japa", { id }); }} className="coll-card"
                  style={{ textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "16px 17px", cursor: "pointer", transition: "all .18s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid var(--gold)", color: "var(--maroon)" }}><Sa as="span" style={{ fontSize: 17 }}>{d.seed}</Sa></span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 16.5, fontWeight: 600, color: "var(--ink)" }}>{d.name}</span>
                      <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-faint)" }}>{s.rounds} {s.rounds === 1 ? "round" : "rounds"} in all</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: s.today > 0 ? "var(--maroon)" : "var(--ink-faint)" }}>{s.today}<span style={{ fontSize: 12.5, fontWeight: 400, color: "var(--ink-faint)" }}> today</span></span>
                    <span style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 22 }}>
                      {hist.map(h => <span key={h.key} style={{ width: 5, borderRadius: 2, height: Math.max(3, Math.round(22 * h.n / max)), background: h.n > 0 ? "var(--gold)" : "var(--line)" }} />)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </PSection>

        {/* plans */}
        <PlansSection go={go} activePlans={activePlans} />

        {/* vows */}
        <VowsSection go={go} />

        {/* record */}
        <RecordSection />
      </div>
    </div>
  );
}

/* ---------- Plans: active + start ---------- */
function PlansSection({ go, activePlans }) {
  const D = window.AKSHARA_DATA;
  const candidates = D.stotras.filter(s => (Number(s.verses) || 0) >= 4 && !window.STUTI_PLANS.get(s.id)).sort((a, b) => a.title.localeCompare(b.title));
  const [pick, setPick] = useState("");
  return (
    <PSection eyebrow="Anuṣṭhāna" title="Plans" aside={<span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>a text split into daily portions</span>}>
      {activePlans.length === 0 && <p style={{ fontSize: 15.5, color: "var(--ink-soft)", margin: "0 0 16px" }}>No plan is running. Short texts go a verse a day; long ones are capped at forty days.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {activePlans.map(({ id, s, p }) => {
          if (!p) return null;
          const m = window.STUTI_PLANS.meta(planHymn(s || { id }));
          return (
            <button key={id} onClick={() => go("plan", { id })} className="text-card-list" style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "15px 18px", cursor: "pointer" }}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{akTitle(id)}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>{p.finished ? `Completed · ${m.days} days` : `${p.done.length} of ${m.days} days done`}</span>
              </span>
              <span style={{ flex: "none", width: 130, height: 5, borderRadius: 3, background: "var(--line)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: Math.round(100 * p.done.length / m.days) + "%", background: "var(--gold)" }} />
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={pick} onChange={e => setPick(e.target.value)} style={{ flex: "1 1 260px", fontFamily: "var(--font-body)", fontSize: 14.5, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 999, padding: "11px 16px", color: "var(--ink)" }}>
          <option value="">Choose a text to take up…</option>
          {candidates.map(s => <option key={s.id} value={s.id}>{s.title} · {s.verses} verses</option>)}
        </select>
        <button className="btn" disabled={!pick} onClick={() => { if (pick) { window.STUTI_PLANS.start(pick); go("plan", { id: pick }); } }}
          style={{ border: 0, borderRadius: 999, padding: "11px 22px", fontSize: 14.5, background: pick ? "var(--maroon)" : "var(--paper-2)", color: pick ? "var(--on-night)" : "var(--ink-faint)", cursor: pick ? "pointer" : "default" }}>
          Begin the plan
        </button>
      </div>
    </PSection>
  );
}

/* ---------- Vows: list + take one ---------- */
function VowsSection({ go }) {
  const V = window.STUTI_VOWS, D = window.AKSHARA_DATA;
  const vows = V.list();
  const [hymn, setHymn] = useState("");
  const [occasion, setOccasion] = useState("ekadashi");
  const [weekday, setWeekday] = useState(1);
  const [term, setTerm] = useState("m3");
  const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const stotras = [...D.stotras].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <PSection eyebrow="Saṅkalpa" title="Vows" aside={<span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>a hymn bound to a lunar occasion, for a term</span>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {vows.length === 0 && <p style={{ fontSize: 15.5, color: "var(--ink-soft)", margin: 0 }}>No vow is standing. Ekādaśī and pradoṣa fall on their real days for your chosen place.</p>}
        {vows.map(v => {
          const o = V.occ(v.occasion), t = V.term(v.term);
          const next = V.dates(v, 3);
          const ring = V.reminds(v);
          return (
            <div key={v.id} style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "15px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <span style={{ flex: 1, minWidth: 220 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{akTitle(v.hymn)}</span>
                  <span style={{ display: "block", fontSize: 13, color: "var(--ink-faint)", marginTop: 2 }}>
                    {o.weekday ? "Every " + WD[v.weekday || 0] : o.name} · {t.name.toLowerCase()} · kept {v.kept.length} {v.kept.length === 1 ? "time" : "times"}
                  </span>
                </span>
                <button className="chip" data-active={ring} onClick={() => V.setRemind(v.id, !ring)} style={{ height: 34, fontSize: 13 }} title="Whether this vow may remind you">{ring ? "Reminds ✓" : "Quiet"}</button>
                <button onClick={() => V.remove(v.id)} style={{ background: "none", border: 0, color: "var(--ink-faint)", fontSize: 13, cursor: "pointer", padding: "6px 4px" }}>Release</button>
              </div>
              {next.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  {next.map((d, i) => <span key={i} style={{ fontSize: 12.5, color: i === 0 ? "var(--maroon)" : "var(--ink-faint)", border: "1px solid " + (i === 0 ? "var(--gold)" : "var(--line)"), borderRadius: 999, padding: "4px 11px" }}>{fmtDay(d)}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ background: "var(--paper-2)", border: "1px dashed var(--line)", borderRadius: "var(--radius)", padding: "16px 18px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={hymn} onChange={e => setHymn(e.target.value)} style={{ flex: "1 1 220px", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999, padding: "10px 14px", color: "var(--ink)" }}>
          <option value="">The hymn…</option>
          {stotras.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <select value={occasion} onChange={e => setOccasion(e.target.value)} style={{ flex: "0 1 190px", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999, padding: "10px 14px", color: "var(--ink)" }}>
          {V.OCCASIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        {occasion === "vara" && (
          <select value={weekday} onChange={e => setWeekday(+e.target.value)} style={{ flex: "0 1 150px", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999, padding: "10px 14px", color: "var(--ink)" }}>
            {WD.map((w, i) => <option key={w} value={i}>{w}</option>)}
          </select>
        )}
        <select value={term} onChange={e => setTerm(e.target.value)} style={{ flex: "0 1 160px", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999, padding: "10px 14px", color: "var(--ink)" }}>
          {V.TERMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button className="btn" disabled={!hymn} onClick={() => { if (hymn) { V.add({ hymn, occasion, weekday, term }); setHymn(""); } }}
          style={{ border: 0, borderRadius: 999, padding: "10px 20px", fontSize: 14, background: hymn ? "var(--maroon)" : "var(--paper)", color: hymn ? "var(--on-night)" : "var(--ink-faint)", cursor: hymn ? "pointer" : "default" }}>
          Take the vow
        </button>
      </div>
    </PSection>
  );
}

/* ---------- The record: the last 30 days, said plainly ---------- */
function RecordSection() {
  const T = window.STUTI_THREAD;
  const days = T.last(30).slice().reverse().filter(d => d.level > 0);
  function say(k) {
    const r = T.day(k) || {};
    const bits = [];
    (r.r || []).forEach(id => bits.push(akTitle(id)));
    (r.p || []).forEach(p => {
      if (p.startsWith("plan:")) { const [, id, day] = p.split(":"); bits.push(`${akTitle(id)} — day ${day}`); }
      else if (p.startsWith("vow:")) bits.push("A vow kept");
      else bits.push(p);
    });
    if (r.j > 0) bits.push(`${r.j} japa`);
    return bits.join(" · ");
  }
  return (
    <PSection eyebrow="The ledger" title="The record" aside={<span style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>the last thirty days</span>}>
      {days.length === 0 ? (
        <p style={{ fontSize: 15.5, color: "var(--ink-soft)", margin: 0 }}>Nothing in the last thirty days. The first recitation starts the record.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {days.map((d, i) => (
            <div key={d.key} style={{ display: "flex", gap: 18, alignItems: "baseline", padding: "12px 2px", borderBottom: i < days.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
              <span style={{ flex: "none", width: 118, fontSize: 13.5, color: d.today ? "var(--maroon)" : "var(--ink-faint)", fontWeight: d.today ? 600 : 400 }}>{d.today ? "Today" : fmtDay(new Date(d.key + "T12:00:00"))}</span>
              <span style={{ flex: 1, fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>{say(d.key)}</span>
            </div>
          ))}
        </div>
      )}
    </PSection>
  );
}

/* ============================================================
   JapaScreen — one thread, counted. No picker here: the thread
   is chosen on the Practice page; this page does one thing.
   ============================================================ */
function JapaScreen({ go, id }) {
  const J = window.STUTI_JAPA;
  const mid = AK_JAPA_THREADS.includes(id) ? id : (AK_JAPA_THREADS.includes(J.lastId()) ? J.lastId() : "shiva");
  const d = akDeity(mid);
  useStoreTick(J);
  useEffect(() => { J.setLast(mid); }, [mid]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); J.bump(mid); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mid]);
  const st = J.state(mid);
  const inRound = st.today % J.MALA;
  const roundsToday = Math.floor(st.today / J.MALA);
  const pct = Math.round(100 * inRound / J.MALA);
  const hist = J.history(mid, 14), max = Math.max(1, ...hist.map(h => h.n));
  return (
    <div className="rise wrap" style={{ padding: "40px 40px 80px", maxWidth: 640, minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <button onClick={() => go("practice")} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--ink-faint)", fontSize: 14, cursor: "pointer" }}>
        <Icon name="arrowL" size={16} /> Practice
      </button>
      <span className="eyebrow" style={{ color: "var(--saffron)", marginTop: 26 }}>Japa · {d.name}</span>
      <Sa as="div" style={{ fontSize: 22, color: "var(--maroon)", marginTop: 10 }}>{d.deva}</Sa>
      <button onClick={() => J.bump(mid)} aria-label="Count one"
        style={{ marginTop: 30, width: 240, height: 240, borderRadius: "50%", cursor: "pointer", border: "1px solid var(--gold)",
          background: `conic-gradient(var(--gold) ${pct}%, var(--paper-2) ${pct}% 100%)`, display: "grid", placeItems: "center", padding: 7 }}>
        <span style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--paper)", display: "grid", placeItems: "center", alignContent: "center", gap: 2 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 74, fontWeight: 600, lineHeight: 1, color: "var(--ink)" }}>{inRound}</span>
          <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>of {J.MALA} · tap or press space</span>
        </span>
      </button>
      <div style={{ display: "flex", gap: 26, marginTop: 26, fontSize: 14, color: "var(--ink-soft)", flexWrap: "wrap", justifyContent: "center" }}>
        <span><b style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--maroon)" }}>{roundsToday}</b> {roundsToday === 1 ? "round" : "rounds"} today</span>
        <span><b style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--maroon)" }}>{st.today}</b> counted today</span>
        <span><b style={{ fontFamily: "var(--font-display)", fontSize: 19, color: "var(--maroon)" }}>{st.rounds}</b> rounds in all</span>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        <button className="chip" onClick={() => J.undo(mid)} style={{ height: 38, fontSize: 13.5 }}>Undo one</button>
        <button className="chip" onClick={() => J.addRounds(mid, 1)} style={{ height: 38, fontSize: 13.5 }} title="A mālā counted in the hand, logged after the fact">Log a full mālā</button>
      </div>
      <div style={{ marginTop: 40, width: "100%", maxWidth: 420 }}>
        <div style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>The last fourteen days</div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 56, justifyContent: "center" }}>
          {hist.map(h => (
            <span key={h.key} title={`${h.key} · ${h.n}`} style={{ flex: "0 0 16px", borderRadius: 3, height: Math.max(4, Math.round(56 * h.n / max)),
              background: h.n > 0 ? (h.today ? "var(--maroon)" : "var(--gold)") : "var(--line)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PlanScreen — one plan: the day grid and today's portion
   ============================================================ */
function PlanScreen({ go, id }) {
  const PL = window.STUTI_PLANS;
  useStoreTick(PL);
  const s = akStotra(id);
  const p = PL.get(id);
  const h = planHymn(s || { id, verses: 0 });
  const m = PL.meta(h);
  if (!p) return (
    <div className="rise wrap" style={{ padding: "80px 40px", textAlign: "center", minHeight: "60vh" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>No plan is running for this text.</p>
      <button className="btn" onClick={() => { PL.start(id); }} style={{ marginTop: 16, border: 0, borderRadius: 999, padding: "11px 22px", background: "var(--maroon)", color: "var(--on-night)", fontSize: 14.5, cursor: "pointer" }}>Begin it</button>
    </div>
  );
  const day = PL.currentDay(id, h);
  const chunk = PL.chunkFor(h, day);
  const doneSet = new Set(p.done);
  const textPartial = s && s.text && s.text.length < (Number(s.verses) || 0);
  return (
    <div className="rise wrap" style={{ padding: "40px 40px 80px", maxWidth: 780 }}>
      <button onClick={() => go("practice")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, color: "var(--ink-faint)", fontSize: 14, cursor: "pointer" }}>
        <Icon name="arrowL" size={16} /> Practice
      </button>
      <span className="eyebrow" style={{ color: "var(--saffron)", display: "block", marginTop: 26 }}>Anuṣṭhāna plan</span>
      <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.8rem)", margin: "10px 0 0" }}>{akTitle(id)}</h1>
      <p style={{ fontSize: 15, color: "var(--ink-faint)", margin: "10px 0 0" }}>{m.verses} verses · {m.days} days · {m.chunk} a day · begun {p.started}</p>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 30 }}>
        {Array.from({ length: m.days }, (_, i) => i + 1).map(n => {
          const done = doneSet.has(n), cur = !p.finished && n === day;
          return (
            <span key={n} title={`Day ${n}`} style={{ width: 38, height: 38, borderRadius: 9, display: "grid", placeItems: "center", fontSize: 13.5,
              fontFamily: "var(--font-display)", fontWeight: 600,
              background: done ? "var(--gold)" : "var(--paper-2)", color: done ? "var(--night)" : cur ? "var(--maroon)" : "var(--ink-faint)",
              border: "1px solid " + (cur ? "var(--maroon)" : done ? "var(--gold)" : "var(--line)") }}>{n}</span>
          );
        })}
      </div>

      {p.finished ? (
        <div style={{ marginTop: 30, background: "color-mix(in srgb, var(--gold) 10%, var(--paper))", border: "1px solid var(--gold)", borderRadius: "var(--radius)", padding: "22px 24px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>The plan is complete.</div>
          <p style={{ fontSize: 15, color: "var(--ink-soft)", margin: "6px 0 0" }}>{m.days} days, {m.verses} verses. It stays here as a record until you release it.</p>
        </div>
      ) : (
        <div style={{ marginTop: 30, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "22px 24px" }}>
          <div style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Today — day {day}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)", marginTop: 6 }}>Verses {chunk.from + 1}–{chunk.to}</div>
          {textPartial && <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "8px 0 0" }}>The site holds a portion of this text while the rest is keyed; the plan still counts the full span.</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {s && <button className="btn-ghost" onClick={() => go("stotraReader", { id })} style={{ border: "1px solid var(--line)", borderRadius: 999, padding: "10px 18px", background: "none", fontSize: 14, color: "var(--ink)", cursor: "pointer" }}>Open the text</button>}
            <button className="btn" onClick={() => PL.completeDay(id, day, h)} style={{ border: 0, borderRadius: 999, padding: "10px 20px", background: "var(--maroon)", color: "var(--on-night)", fontSize: 14, cursor: "pointer" }}>Mark the portion done</button>
          </div>
        </div>
      )}

      <button onClick={() => { PL.drop(id); go("practice"); }} style={{ marginTop: 26, background: "none", border: 0, color: "var(--ink-faint)", fontSize: 13.5, cursor: "pointer" }}>Release this plan</button>
    </div>
  );
}

Object.assign(window, { PracticeScreen, JapaScreen, PlanScreen, ThreadDots });

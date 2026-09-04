import { Flame, Icon, Seal, deityStyle } from "./stuti-icons";
import React from "react";
import { WatchCard } from "./stuti-await";
import { STUTI } from "./stuti-data";
import { DailyCard } from "./stuti-home";
import { STUTI_L } from "./stuti-i18n";
import { JapaView } from "./stuti-japa";
import { NomuTracker } from "./stuti-keep";
import { JapaTracker, LearnTracker, LedgerLens, ReciteTracker } from "./stuti-ledger";
import { STUTI_LIB } from "./stuti-library-data";
import { pick3, useLensArrange, useLensSwipe } from "./stuti-library";
import { PlanEntryCard } from "./stuti-plans";
import { RemindCard } from "./stuti-remind";
import { STUTI_THREAD } from "./stuti-sadhana";
import { TodayBand } from "./stuti-today";
import { VowsCard } from "./stuti-vows";

/* ============================================================
   STUTI — Nitya (daily practice) + Practice reader
   Anuṣṭhānams are sequences, not single hymns — a step/checklist
   template, not the verse reader. Nitya gathers the daily
   practices and the reciter's saved stotras.
   ============================================================ */
const { useState: useStatePr, useEffect: useEffectPr } = React;

/* ---- per-practice checklist state (own localStorage key) ---- */
function usePracticeDone(id, total) {
  const key = "stuti-practice-" + id;
  const [done, setDone] = useStatePr(() => {
    try { const a = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(a) ? a.filter((n) => n < total) : []; }
    catch (e) { return []; }
  });
  useEffectPr(() => { try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {} }, [done, key]);
  const toggle = (i) => setDone((d) => (d.indexOf(i) !== -1 ? d.filter((x) => x !== i) : [...d, i]));
  const reset = () => setDone([]);
  return [done, toggle, reset];
}

/* count of completed steps, reactive, for the Nitya card rings */
function usePracticeCount(id, total) {
  const key = "stuti-practice-" + id;
  const read = () => { try { const a = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(a) ? a.filter((n) => n < total).length : 0; } catch (e) { return 0; } };
  const [n, setN] = useStatePr(read);
  useEffectPr(() => {
    const on = () => setN(read());
    window.addEventListener("storage", on);
    window.addEventListener("practicechange", on);
    return () => { window.removeEventListener("storage", on); window.removeEventListener("practicechange", on); };
  }, []);
  return n;
}

/* The guide is a screen of its own, like a nomu's — reached with go("sandhyaNote",
   { from }), and back returns to whatever opened it. */
function SandhyaNoteView({ go, lang, backView = "home" }) {
  return (
    <div className="view libhub scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go(backView)} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display" style={{ fontFamily: "var(--font-telugu)" }}>సంధ్యావందనం</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="lens-pad" style={{ fontFamily: "var(--font-telugu)", paddingTop: 18 }}>
        <p style={{ fontSize: "1.02rem", lineHeight: 1.7, color: "var(--ink)", marginBottom: 20 }}>
          సంధ్యావందనం కోరేది ప్రధానంగా భావన. విశ్వవ్యాపకమైన భగవత్‌శక్తి సూర్యమండలంలో ప్రకాశిస్తున్నదని భావించి, ఆ పరమాత్మ చైతన్యంలో తమ ఇష్టదేవతను ఉపాసించడమే సంధ్యావందనం యొక్క అంతరార్థం.
        </p>
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "16px 18px", marginBottom: 16 }}>
          <div className="nextup-k display" style={{ fontSize: "1rem", marginBottom: 8, color: "var(--accent-ink)" }}>1. ఉపనయనం పొందినవారు</div>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: 0 }}>
            ఉపనయనం పొందినవారు తమ గురువు, కుటుంబ లేదా వేదశాఖ సంప్రదాయం ప్రకారం వైదిక సంధ్యావందనం చేసి, గురూపదేశం పొందిన త్రిపాద గాయత్రి మంత్రాన్ని జపించాలి.
          </p>
        </div>
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "16px 18px", marginBottom: 20 }}>
          <div className="nextup-k display" style={{ fontSize: "1rem", marginBottom: 8, color: "var(--accent-ink)" }}>2. ఉపనయనం పొందని వారు</div>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 12px" }}>
            ఉపనయనం పొందని వారు కూడా సంధ్యాకాలంలో భగవదుపాసన చేయాలి. సూర్యమండలాంతర్వర్తి అయిన పరమాత్మ చైతన్యాన్ని ధ్యానించడం భారతీయ ఉపాసనా సంప్రదాయంలో ప్రధాన భావన. అందువల్ల వేదము చే ప్రతిపాదించబడిన శివుడు, విష్ణువు, దేవి, గణపతి మొదలైన తమ ఇష్టదేవతను ఆ పరబ్రహ్మ స్వరూపంగానే భావించి ఉపాసించవచ్చు. ఏ దేవతను ఉపాసిస్తే ఆవిడే/అతనే గాయత్రి.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink)", margin: "0 0 8px", fontWeight: 600 }}>ఉపనయనం లేనివారు చేయగల సంధ్యావందనం</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 12px", fontWeight: 600 }}>సమ్యక్ ధ్యానమే సంధ్య.</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 12px" }}>
            1. గురువు ఇచ్చిన మంత్రాన్ని లేదా ఇష్టదేవతను, సంధ్యాకాలంలో సూర్యమండలంలో ఉన్నట్టు ధ్యానిస్తూ, అదే చైతన్యం హృదయమండలంలో కూడా ఉన్నట్టు భావించి జపించడమే సమ్యక్ ధ్యానం. సమ్యక్ ధ్యానమే సంధ్య — అదే గాయత్రీ ఉపాసన.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 12px" }}>
            2. ప్రాణశక్తి ఉపాసనే గాయత్రీ కనుక, సంధ్యాకాలంలో ఉచ్ఛ్వాస–నిశ్వాసలతో "శ్రీ మాత్రే నమః" / "శివాయ నమః" / "శ్రీ రామ జయ రామ జయ జయ రామ" వంటి నామాలను అనుసంధానం చేసి జపించినా అది గాయత్రీ ఉపాసనే.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 12px" }}>
            3. ఆదిత్య హృదయం అంతా గాయత్రీ స్వరూపమే కనుక, సంధ్యాకాలంలో ధ్యానానికి కూర్చొని ఆదిత్య హృదయ పారాయణం చేసినా అది కూడా గాయత్రీ ఉపాసనే.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 12px" }}>
            4. దేవీ భాగవతంలో చెప్పబడిన ఈ శ్లోకాన్ని వీలైనన్ని సార్లు భక్తితో జపించినా అది కూడా గాయత్రీ ఉపాసనే.
          </p>
        </div>
        <div style={{ background: "color-mix(in oklab, var(--accent) 8%, var(--surface))", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "18px 20px", marginBottom: 20 }}>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--ink)", textAlign: "center", margin: "0 0 10px", fontFamily: "var(--font-deva)" }}>
            సర్వచైతన్యరూపాం తామ్ ఆద్యాం విద్యాం చ ధీమహి ।<br />బుద్ధిం యా నః ప్రచోదయాత్ ॥
          </p>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-faint)", margin: 0, textAlign: "center" }}>
            భావం: సర్వచైతన్య స్వరూపిణి, ఆద్యవిద్య అయిన ఆ పరాశక్తిని మనం ధ్యానిస్తున్నాము. ఆమె మన బుద్ధిని సన్మార్గంలో ప్రేరేపించుగాక.
          </p>
        </div>
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "16px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 12px" }}>
            5. సూర్యునికి అర్ఘ్యం సమర్పించదలచినవారు, ద్వాదశ సూర్యనామాలను స్మరిస్తూ అర్ఘ్యం సమర్పించవచ్చు.
          </p>
          <div style={{ fontSize: "0.8125rem", letterSpacing: "0.03em", color: "var(--ink-faint)", marginBottom: 8 }}>ద్వాదశ సూర్య నామాలు</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: "0.95rem", color: "var(--accent-ink)", background: "var(--accent-soft)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: "12px 14px", fontWeight: 600 }}>
            {["మిత్రాయ నమః","రవయే నమః","సూర్యాయ నమః","భానవే నమః","ఖగాయ నమః","పూష్ణే నమః","హిరణ్యగర్భాయ నమః","మరీచయే నమః","ఆదిత్యాయ నమః","సవిత్రే నమః","అర్కాయ నమః","భాస్కరాయ నమః"].map((n) => <span key={n}>{n}</span>)}
          </div>
        </div>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink-soft)", marginBottom: 16 }}>
          అంటే, ఉపనయనం లేకపోవడం వల్ల సంధ్యాకాల భగవదుపాసనను వదిలేయాల్సిన అవసరం లేదు. తమకు లభించిన గురూపదేశం, సంప్రదాయం మేరకు సూర్యార్ఘ్యం, ఇష్టదేవతా ధ్యానం, మంత్రజపం లేదా నామజపంతో సంధ్యావందనం చేసుకోవచ్చు.
        </p>
        <p style={{ fontSize: "0.8438rem", lineHeight: 1.6, color: "var(--ink)", fontWeight: 700, borderTop: "1px solid var(--line)", paddingTop: 14, marginBottom: 20 }}>
          గయాన్ (ప్రాణాన్) త్రాయతే ఇతి గాయత్రీ — ప్రాణములను రక్షించే శక్తియే గాయత్రీ.
        </p>
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

/* ---- a practice card (opens the step/checklist reader) ---- */
function PracticeCard({ p, go, lang, from = "daily" }) {
  const S = STUTI, L = STUTI_L;
  const d = S.deityById[p.deity];
  const total = p.steps.length;
  const done = usePracticeCount(p.id, total);
  const pct = Math.round((done / total) * 100);
  return (
    <div className="practice-card" style={{ ...deityStyle(d), position: "relative", cursor: "pointer" }} onClick={() => go("practice", { practice: p.id, from })} role="button" tabIndex={0}>
      <Seal d={d} size={46} style={{ fontSize: 15 }} />
      <div className="practice-card-body">
        <div className="practice-card-name display" style={{ fontFamily: L.font(lang) }}>{pick3(p.name, lang)}</div>
        <div className="practice-card-meta">{total} {L.t("stepsLabel", lang)}{done > 0 && <React.Fragment><span className="dot" /><span>{done}/{total}</span></React.Fragment>}</div>
        {done > 0 && <div className="practice-card-track"><span style={{ width: Math.max(6, pct) + "%" }} /></div>}
      </div>
      <span className="practice-card-go"><Icon name="arrow" size={18} /></span>
      {p.id === "sandhya-vandanam" && (
        <button className="icon-btn" aria-label="How to perform sandhyā by your own sampradāya" title="How to perform sandhyā by your own sampradāya"
          style={{ flex: "none", width: 26, height: 26, minWidth: 26, borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--ink-soft)", fontSize: "0.8125rem", fontWeight: 700, display: "grid", placeItems: "center" }}
          onClick={(e) => { e.stopPropagation(); go("sandhyaNote", { from }); }}>?</button>
      )}
    </div>
  );
}

/* ---- Nitya tab ----
   Two lenses on the same daily life, switched like the library's:
   Recitation is what the reciter says today; Practice is the
   scaffolding around it — the counter, the memorising, the vows,
   the reminder. Recitation leads, because that is the tab's job. */
const NITYA_LENSES = [
  { id: "patha",   key: "lensPatha",   icon: "flower" },
  { id: "sadhana", key: "lensSadhana", icon: "diya" },
  { id: "japa",     key: "lensJapa",    icon: "mala" },
  { id: "learn",   key: "lensLearn",   icon: "spark" },
  { id: "nomu",    key: "lensNomu",    icon: "marigold" },
  { id: "ledger",  key: "lensLedger",  icon: "book" },
];

function NityaView({ go, lang = "deva", showPractices = true, openRemind }) {
  const L = STUTI_L, LIB = STUTI_LIB;
  const [lens0, setLens] = useStatePr("patha");
  /* the nomulu shelf is Telugu custom and hidden from the Devanāgarī interface, as in the library */
  const lens = lens0 === "nomu" && lang === "deva" ? "patha" : lens0;
  const choose = React.useCallback((id) => { setLens(id); try { localStorage.setItem("stuti-nitya-lens", id); } catch (e) {} }, [setLens]);
  const viewRef = React.useRef(null);
  const trackRef = React.useRef(null);
  /* the bar's order is the reciter's: the library's own arrange gesture, on this bar */
  const arr = useLensArrange({ lenses: NITYA_LENSES, storageKey: "stuti-nitya-lens-order", lang });
  const nityaLenses = arr.ordered.filter((l) => l.id !== "nomu" || lang !== "deva");
  /* the same swipe the library answers — six lenses do not fit a phone either.
     While arranging, the swipe would fight the drag, so it stands down. */
  useLensSwipe({ viewRef, trackRef, lenses: nityaLenses, lens, onChange: choose, disabled: arr.arranging });
  return (
    <div className="view libhub scroll" ref={viewRef}>
      <div className="topbar lens-topbar">
        <div className="topbar-title display">{L.t("nitya", lang)}</div>
      </div>

      <div className="lensbar nitya-bar">
        <div className="lensbar-track" ref={trackRef}>
          <div className={"lensbar-inner" + (arr.arranging ? " arranging" : "")} role="tablist" aria-label={L.t("nitya", lang)}>
            {nityaLenses.map((l) => (
              <button key={l.id} role="tab" aria-selected={lens === l.id}
                className={"lens-pill" + (lens === l.id ? " on" : "") + (arr.dragId === l.id ? " dragging" : "")} data-lens={l.id}
                {...arr.pill(l.id)}
                onClick={() => { if (!arr.arranging) choose(l.id); }}>
                <Icon name={l.icon} size={17} filled={l.icon === "diya"} />
                <span>{L.t(l.key, lang)}</span>
              </button>
            ))}
          </div>
        </div>
        {arr.note}
      </div>

      <div className={"lens-pad" + (lens === "nomu" ? " lens-red" : "")} data-lens={lens}>
        {lens === "patha" ? (
          <React.Fragment>
            <ReciteTracker lang={lang} />
            <DailyCard go={go} lang={lang} />
          </React.Fragment>
        ) : lens === "learn" ? (
          <React.Fragment>
            <LearnTracker lang={lang} />
            <PlanEntryCard go={go} lang={lang} />
          </React.Fragment>
        ) : lens === "japa" ? (
          <React.Fragment>
            <JapaTracker lang={lang} />
            <JapaView go={go} lang={lang} embedded={true} />
          </React.Fragment>
        ) : lens === "ledger" ? (
          <LedgerLens lang={lang} onLens={choose} />
        ) : lens === "nomu" ? (
          <NomuTracker go={go} lang={lang} />
        ) : (
          <React.Fragment>
            <TodayBand go={go} lang={lang} />
            {openRemind && <RemindCard lang={lang} onOpen={openRemind} />}
            <VowsCard go={go} lang={lang} />
            <WatchCard go={go} lang={lang} />
            {showPractices && (
              <React.Fragment>
                <div className="lens-sect"><div className="eyebrow">{L.t("dailyPractice", lang)}</div></div>
                <div className="practice-list">
                  {LIB.practices.map((pr) => <PracticeCard key={pr.id} p={pr} go={go} lang={lang} from="daily" />)}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

/* ---- Practices tab (4-tab layout) — just the anuṣṭhānams ---- */
function PracticesView({ go, lang = "deva" }) {
  const L = STUTI_L, LIB = STUTI_LIB;
  return (
    <div className="view libhub scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go("browse")} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display">{L.t("practices", lang)}</div>
        <button className="icon-btn" onClick={() => go("search", { from: "practices" })} aria-label={L.t("search", lang)}><Icon name="search" /></button>
      </div>
      <div className="lens-pad">
        <div className="practice-list">
          {LIB.practices.map((p) => <PracticeCard key={p.id} p={p} go={go} lang={lang} from="practices" />)}
        </div>
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

/* ---- Practice reader — the step/checklist ---- */
function PracticeView({ practice, go, lang = "deva", backView = "daily" }) {
  const S = STUTI, L = STUTI_L, LIB = STUTI_LIB;
  const p = practice;
  const d = S.deityById[p.deity];
  const total = p.steps.length;
  const [done, toggle, reset] = usePracticeDone(p.id, total);
  useEffectPr(() => { window.dispatchEvent(new Event("practicechange")); }, [done]);
  const allDone = done.length === total;
  useEffectPr(() => { if (allDone) STUTI_THREAD.mark("p", p.id); }, [allDone, p.id]);
  const pct = Math.round((done.length / total) * 100);

  const reciteFor = (step) => {
    if (!step.recite) return null;
    const arr = LIB.resolveStotras([step.recite]);
    return arr[0] || null;
  };

  return (
    <div className="view practice-view scroll" style={deityStyle(d, { flex: 1 })}>
      <div className="topbar">
        <button className="icon-btn" onClick={() => go(backView)} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div style={{ width: 50 }} />
      </div>

      <div className="lens-pad">
        <header className="practice-hero">
          <div className="deity-hero-row">
            <Seal d={d} size={56} style={{ fontSize: 18 }} />
            <div className="deity-hero-text">
              <h1 className="deity-hero-name display" style={{ fontFamily: L.font(lang) }}>{pick3(p.name, lang)}</h1>
              <div className="deity-hero-epithet">{pick3(p.when, lang)}</div>
            </div>
          </div>
          <p className="deity-hero-line">{pick3(p.tagline, lang)}</p>
        </header>

        <div className="practice-prog">
          <div className="practice-prog-track"><span style={{ width: Math.max(2, pct) + "%" }} /></div>
          <span className="practice-prog-count">{done.length}<i>/{total}</i></span>
        </div>

        <ol className="pstep-list">
          {p.steps.map((s, i) => {
            const on = done.indexOf(i) !== -1;
            const h = reciteFor(s);
            return (
              <li key={i} className={"pstep" + (on ? " done" : "")}>
                <button className="pstep-check" aria-pressed={on} aria-label={on ? "Undo step" : "Mark step done"} onClick={() => toggle(i)}>
                  {on ? <Icon name="check" size={18} /> : <span className="pstep-num">{i + 1}</span>}
                </button>
                <div className="pstep-body">
                  <div className="pstep-title-row">
                    <span className="pstep-title display" style={{ fontFamily: L.font(lang) }}>{pick3(s.title, lang)}</span>
                    {s.japa && <span className="pstep-japa">{s.japa} {L.t("japaLabel", lang)}</span>}
                  </div>
                  <div className="pstep-detail">{pick3(s.detail, lang)}</div>
                  {h && (
                    <button className="pstep-recite" style={deityStyle(S.deityById[h.deity])} onClick={() => go("reader", { deity: h.deity, hymn: h.id, from: "practice", ret: backView })}>
                      <Icon name="play" size={13} />
                      <span style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(h, lang)}</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {allDone && (
          <div className="practice-done">
            <Flame size={28} />
            <div className="practice-done-text display" style={{ fontFamily: L.font(lang) }}>{L.t("shubham", lang)}</div>
            <div className="practice-done-sub">{L.t("allStepsDone", lang)}</div>
          </div>
        )}

        {done.length > 0 && (
          <button className="practice-reset ghost" onClick={reset}>
            <Icon name="repeat" size={16} /> {L.t("startOver", lang)}
          </button>
        )}

        {p.note && (
          <div className="practice-note">
            <span className="practice-note-cap">{L.t("aboutPractice", lang)}</span>
            <span className="practice-note-line">{pick3(p.note, lang)}</span>
          </div>
        )}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

export { NityaView, PracticesView, PracticeView, PracticeCard, usePracticeDone, SandhyaNoteView };

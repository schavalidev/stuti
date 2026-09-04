/* ============================================================
   STUTI — learn-by-heart plans
   PlanEntryCard (Nitya tab) · PlansView (choose a text)
   · PlanView (a day's sitting: learn new verses, recall by
   masked words, review earlier portions)
   ============================================================ */
const { useState: useStateL, useEffect: useEffectL, useMemo: useMemoL } = React;

function planVerseText(v, lang) {
  if (lang === "telugu") return v.tdeva || (window.STUTI_TRANSLIT ? window.STUTI_TRANSLIT.convert(v.deva, "telugu") : v.deva);
  return lang === "deva" ? v.deva : v.iast;
}
function planEligible() {
  const S = window.STUTI;
  return S.hymns.filter(h => !h.catalog && h.verses && h.verses.length >= 4)
    .sort((a, b) => b.verses.length - a.verses.length);
}

/* a verse with each word veiled — tap a word to see it */
function MaskedVerse({ text, lang }) {
  const [shown, setShown] = useStateL({});
  const [all, setAll] = useStateL(false);
  const L = window.STUTI_L;
  useEffectL(() => { setShown({}); setAll(false); }, [text]);
  const lines = (text || "").split("\n");
  let k = 0;
  return (
    <div className="mask-verse" style={{ fontFamily: lang === "roman" ? "var(--font-ui)" : L.font(lang) }}>
      {lines.map((ln, li) => (
        <div key={li} className="mask-line">
          {ln.split(/\s+/).filter(Boolean).map((w) => {
            if (!/\p{L}/u.test(w)) return <span key={"p" + k++} className="mask-plain">{w}</span>;
            const id = k++;
            const on = all || shown[id];
            const head = Array.from(w)[0];
            return (
              <button key={id} className={"mask-word" + (on ? " on" : "")} onClick={() => setShown(s => ({ ...s, [id]: true }))}>
                {on ? w : <React.Fragment>{head}<span className="mask-dots">···</span></React.Fragment>}
              </button>
            );
          })}
        </div>
      ))}
      {!all && <button className="mask-all" onClick={() => setAll(true)}>{L.t("revealAll", lang)}</button>}
    </div>
  );
}

/* ---------------- Nitya-tab entry ---------------- */
function PlanEntryCard({ go, lang = "deva" }) {
  const S = window.STUTI, L = window.STUTI_L, P = window.STUTI_PLANS;
  const [, force] = useStateL(0);
  useEffectL(() => P.subscribe(() => force(x => x + 1)), []);
  const ids = P.active().filter(id => S.hymnById(id));
  const [arm, setArm] = useStateL(null);
  useEffectL(() => { if (arm == null) return; const t = setTimeout(() => setArm(null), 3000); return () => clearTimeout(t); }, [arm]);
  if (ids.length === 0) {
    return (
      <button className="japa-entry plan-hint" onClick={() => go("plans")}>
        <span className="japa-entry-beads"><Icon name="book" size={20} /></span>
        <span className="japa-entry-body">
          <span className="japa-entry-name">{L.t("learnByHeart", lang)}</span>
          <span className="japa-entry-sub">{L.t("planHint", lang)}</span>
        </span>
        <Icon name="chev" size={18} />
      </button>
    );
  }
  return (
    <React.Fragment>
      {ids.map(id => {
        const hymn = S.hymnById(id), d = S.deityById[hymn.deity];
        const m = P.meta(hymn), day = P.currentDay(id, hymn), donePct = Math.round((P.get(id).done.length / m.days) * 100);
        return (
          <div key={id} className="japa-entry plan-entry" style={{ "--deity-hue": d.hue }}>
            <button className="plan-entry-main" onClick={() => go("plan", { plan: id })}>
              <span className="japa-entry-beads plan-ring-mini" style={{ "--pct": donePct }}><Icon name="book" size={20} /></span>
              <span className="japa-entry-body">
                <span className="japa-entry-name" style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(hymn, lang)}</span>
                <span className="japa-entry-sub">{L.t("day", lang)} {day} / {m.days} · {L.t("learnByHeart", lang)}</span>
              </span>
            </button>
            <button className={"plan-x" + (arm === id ? " arm" : "")}
              aria-label={L.t("removePlan", lang)}
              onClick={() => { if (arm === id) { P.drop(id); setArm(null); } else setArm(id); }}>
              {arm === id ? L.t("removePlan", lang) : "×"}
            </button>
          </div>
        );
      })}
      {/* the only way into the chooser once a plan is running — without it
         the screen that picks a text was reachable from nowhere at all */}
      <button className="plan-more" onClick={() => go("plans")}>
        <Icon name="book" size={16} /> {L.t("planAnother", lang)}
      </button>
    </React.Fragment>
  );
}

/* ---------------- Choose a text ---------------- */
function PlansView({ go, lang = "deva" }) {
  const S = window.STUTI, L = window.STUTI_L, P = window.STUTI_PLANS;
  const [, force] = useStateL(0);
  useEffectL(() => P.subscribe(() => force(x => x + 1)), []);
  const list = planEligible();
  const [q, setQ] = useStateL("");
  const [sel, setSel] = useStateL(() => new Set());
  const fold = window.STUTI_TRANSLIT.fold;
  const shown = q.trim()
    ? list.filter(h => fold(L.hymnTitle(h, lang) + " " + L.name(S.deityById[h.deity], lang)).includes(fold(q.trim())))
    : list;
  const toggle = (id) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const startSelected = () => { const ids = [...sel]; ids.forEach(id => P.start(id)); setSel(new Set()); if (ids.length === 1) go("plan", { plan: ids[0] }); };
  return (
    <div className="view libhub scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go("daily")} aria-label={window.STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display">{L.t("learnByHeart", lang)}</div>
        <span style={{ width: 40 }} />
      </div>
      <div className="lens-pad">
        <p className="plans-lede">{L.t("plansLede", lang)}</p>
        <div className="ssel">
          <div className="ssel-field">
            <Icon name="search" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.t("searchTexts", lang)} />
            <window.VoiceButton lang={lang} size={16} onInterim={setQ} onResult={setQ} />
            {q && <button type="button" className="ssel-x" aria-label={window.STUTI_L.a("aClose")} onClick={() => setQ("")}><Icon name="close" size={15} /></button>}
          </div>
        </div>
        <div className="hymn-list" style={{ marginTop: 14 }}>
          {shown.map(h => {
            const d = S.deityById[h.deity], m = P.meta(h), p = P.get(h.id);
            const SealC = window.Seal;
            const picked = sel.has(h.id);
            return (
              <div key={h.id} className={"hymn-card plan-card" + (picked ? " picked" : "")} style={{ "--deity-hue": d.hue }}>
                <button type="button" className="plan-check" aria-pressed={picked}
                  aria-label={L.t("selectText", lang)} onClick={() => toggle(h.id)}>
                  {picked ? <Icon name="check" size={16} /> : null}
                </button>
                <button className="plan-card-main" onClick={() => { if (sel.size) toggle(h.id); else { P.start(h.id); go("plan", { plan: h.id }); } }}>
                  {SealC && <SealC d={d} size={40} />}
                  <span className="japa-entry-body">
                    <span className="japa-entry-name" style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(h, lang)}</span>
                    <span className="japa-entry-sub">
                      {p ? (p.finished ? L.t("planDone", lang) : L.t("day", lang) + " " + P.currentDay(h.id, h) + " / " + m.days)
                         : m.days + " " + L.t("threadDays", lang) + " · " + L.versesCount(m.verses, lang)}
                    </span>
                  </span>
                  {!sel.size && <span className={"plan-badge" + (p && !p.finished ? " on" : "")}>{p ? (p.finished ? "॥" : L.t("continueLabel", lang)) : L.t("startPlan", lang)}</span>}
                </button>
              </div>
            );
          })}
          {shown.length === 0 && <div className="ssel-empty">{L.t("noTextsFound", lang)}</div>}
        </div>
      </div>
      <div style={{ height: 40 }} />
      {sel.size > 0 && (
        <div className="plan-selbar">
          <span className="plan-selbar-count">{L.t("textsSelected", lang).replace("{n}", sel.size)}</span>
          <button className="plan-selbar-start" onClick={startSelected}>{L.t("startPlan", lang)}</button>
          <button className="plan-selbar-x" aria-label={window.STUTI_L.a("aClose")} onClick={() => setSel(new Set())}><Icon name="close" size={16} /></button>
        </div>
      )}
    </div>
  );
}

/* ---------------- A day's sitting ---------------- */
function PlanView({ hymnId, go, lang = "deva", backView = "daily" }) {
  const S = window.STUTI, L = window.STUTI_L, P = window.STUTI_PLANS;
  const hymn = S.hymnById(hymnId);
  const deity = hymn ? S.deityById[hymn.deity] : null;
  const [, force] = useStateL(0);
  useEffectL(() => P.subscribe(() => force(x => x + 1)), []);
  if (!hymn || !deity) return null;
  const plan = P.get(hymnId);
  if (!plan) { P.start(hymnId); return null; }
  const m = P.meta(hymn);
  const day = P.currentDay(hymnId, hymn);
  const doneToday = plan.last === window.STUTI_THREAD.dkey() && plan.done.indexOf(day) >= 0;
  return plan.finished
    ? <PlanFinished hymn={hymn} deity={deity} go={go} lang={lang} backView={backView} />
    : <PlanDay key={hymnId + ":" + day} hymn={hymn} deity={deity} day={day} meta={m} go={go} lang={lang} backView={backView} />;
}

function PlanFinished({ hymn, deity, go, lang, backView = "daily" }) {
  const L = window.STUTI_L;
  return (
    <div className="view japa scroll" style={{ "--deity-hue": deity.hue }}>
      <div className="topbar">
        <button className="icon-btn" onClick={() => go(backView)} aria-label={window.STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display" style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(hymn, lang)}</div>
        <span style={{ width: 40 }} />
      </div>
      <div className="plan-done-wrap">
        <div className="plan-done-mark">॥ श्री ॥</div>
        <div className="plan-done-head display">{L.t("planDone", lang)}</div>
        <p className="plans-lede" style={{ textAlign: "center" }}>{L.t("planDoneLine", lang)}</p>
        <button className="preface-btn" onClick={() => go("reader", { deity: deity.id, hymn: hymn.id, from: "plan", ret: backView })}><Icon name="book" size={17} /> {L.t("beginRecitation", lang)}</button>
      </div>
    </div>
  );
}

function PlanDay({ hymn, deity, day, meta, go, lang, backView = "daily" }) {
  const L = window.STUTI_L, P = window.STUTI_PLANS;
  /* the sitting: learn each new verse (read, then recall), then review earlier portions */
  const steps = useMemoL(() => {
    const out = [];
    const cur = P.chunkFor(hymn, day);
    for (let i = cur.from; i < cur.to; i++) { out.push({ t: "learn", vi: i }); out.push({ t: "recall", vi: i }); }
    if (day > 1) { const prev = P.chunkFor(hymn, day - 1); for (let i = prev.from; i < prev.to; i++) out.push({ t: "review", vi: i }); }
    if (day > 7) { const week = P.chunkFor(hymn, day - 7); out.push({ t: "review", vi: week.from }); if (week.from + 1 < week.to) out.push({ t: "review", vi: week.from + 1 }); }
    return out;
  }, [hymn, day]);
  const [idx, setIdx] = useStateL(0);
  const [celebrate, setCelebrate] = useStateL(false);
  const finished = idx >= steps.length;
  useEffectL(() => { if (finished && !celebrate) { P.completeDay(hymn.id, day, hymn); setCelebrate(true); } }, [finished]);
  const font = L.font(lang);
  const back = () => go(backView);
  if (finished) {
    return (
      <div className="view japa scroll" style={{ "--deity-hue": deity.hue }}>
        <div className="topbar">
          <button className="icon-btn" onClick={back} aria-label={window.STUTI_L.a("aBack")}><Icon name="back" /></button>
          <div className="topbar-title display" style={{ fontFamily: font }}>{L.hymnTitle(hymn, lang)}</div>
          <span style={{ width: 40 }} />
        </div>
        <div className="plan-done-wrap">
          <div className="plan-done-mark">दीप</div>
          <div className="plan-done-head display">{L.t("dayDone", lang)}</div>
          <p className="plans-lede" style={{ textAlign: "center" }}>{day < meta.days ? L.t("backTomorrow", lang) : L.t("planDoneLine", lang)}</p>
          <div className="plan-day-dots">{Array.from({ length: meta.days }).map((_, i) => <span key={i} className={"plan-day-dot" + (i < day ? " on" : "")}></span>)}</div>
          <button className="preface-btn" onClick={back}>{backView === "daily"
            ? <React.Fragment><Icon name="flower" size={17} /> {L.t("nitya", lang)}</React.Fragment>
            : <React.Fragment><Icon name="book" size={17} /> {L.t("backToText", lang)}</React.Fragment>}</button>
        </div>
      </div>
    );
  }
  const st = steps[idx];
  const v = hymn.verses[st.vi];
  const text = planVerseText(v, lang);
  const meaning = window.STUTI_MEAN(v, lang);
  const kind = st.t === "learn" ? "newVerses" : st.t === "recall" ? "recallLabel" : "reviewLabel";
  return (
    <div className="view japa scroll" style={{ "--deity-hue": deity.hue }}>
      <div className="topbar">
        <button className="icon-btn" onClick={back} aria-label={window.STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display" style={{ fontFamily: font }}>{L.hymnTitle(hymn, lang)}</div>
        <span className="plan-day-tag">{L.t("day", lang)} {day}/{meta.days}</span>
      </div>
      <div className="plan-progress"><span style={{ width: (idx / steps.length) * 100 + "%" }}></span></div>
      <div className="plan-step">
        <div className={"plan-step-kind" + (st.t === "learn" ? " learn" : "")}>{L.t(kind, lang)}{v.n ? " · " + v.n : ""}</div>
        {st.t === "learn" ? (
          <React.Fragment>
            <div className="plan-verse" style={{ fontFamily: lang === "roman" ? "var(--font-ui)" : font }}>{text.split("\n").map((ln, i) => <span key={i} className="plan-verse-line">{ln.replace(/\s+((?:[|।॥]|\p{L}*\d)[\s|।॥\d.]*)$/u, (mm, g) => "\u00A0" + g.replace(/\s+/g, "\u00A0"))}</span>)}</div>
            {meaning && <div className={"plan-meaning" + (lang === "telugu" ? " tel" : "")}>{meaning}</div>}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MaskedVerse text={text} lang={lang} />
            <div className="japa-hint">{L.t("tapMasked", lang)}</div>
          </React.Fragment>
        )}
        <button className="plan-next" onClick={() => setIdx(i => i + 1)}>
          {st.t === "learn" ? L.t("reciteContinue", lang) : L.t("iRecited", lang)} <Icon name="chev" size={16} />
        </button>
      </div>
      <div style={{ height: 90 }} />
    </div>
  );
}

/* ---------------- Learn button — sits beside the flower everywhere ----------------
   `from` is where this button was tapped, and it rides along on the
   navigation so the sitting knows how to give the reciter back what they
   were looking at. Without it a book mark tapped in the reader dropped you
   into the day's verses and then ejected you to Nitya, losing the text. */
function LearnButton({ id, size = 22, go, from }) {
  const P = window.STUTI_PLANS, L = window.STUTI_L;
  const [, force] = useStateL(0);
  useEffectL(() => P.subscribe(() => force(x => x + 1)), []);
  const on = !!P.get(id);
  const label = L.t("learnByHeart", "roman");
  return (
    <button className={"learn-btn" + (on ? " on" : "")} title={label} aria-label={label} aria-pressed={on}
      onClick={(e) => { e.stopPropagation(); if (!on) P.start(id); if (go) go("plan", { plan: id, from }); }}>
      {/* a book is the story, and the library tab, and the कथा tab — three things
         this is not. Learning by heart is a commitment you take on and tick off,
         which is what this button already is: a toggle with aria-pressed. */}
      <Icon name="check" size={size - 4} />
    </button>
  );
}

Object.assign(window, { PlanEntryCard, PlansView, PlanView, MaskedVerse, LearnButton });

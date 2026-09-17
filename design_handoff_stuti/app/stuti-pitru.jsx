/* ============================================================
   STUTI — the pitṛ calendar, and "why this date"
   Two surfaces over STUTI_TARPANA. The drawer answers the one
   question a computed date always raises: on what grounds is it
   this day and not the next? It names the kāla that decided it,
   the instant tested, the tithi found there, the window the rite
   is kept in, and the source the rule rests on.

   The page is the reference calendar — the tarpaṇa days ahead,
   then the traditional śrāddha classification (the "ninety-six")
   as a readable list rather than ninety-six notifications, which
   is the one thing the domain spec asks us not to do.
   ============================================================ */
const { useState: usePiS, useEffect: usePiE, useMemo: usePiM } = React;

const piPick = (o, lang) => !o ? "" : (lang === "telugu" ? (o.tel || o.telugu || o.roman) : lang === "deva" ? (o.deva || o.roman) : o.roman) || o.roman || "";
const piFont = (lang) => lang === "telugu" ? "var(--font-telugu)" : lang === "roman" ? "var(--font-display)" : "var(--font-deva)";
const piLocale = (lang) => lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN";
const piDate = (d, lang) => d ? d.toLocaleDateString(piLocale(lang), { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "";
const piShort = (d, lang) => d ? d.toLocaleDateString(piLocale(lang), { day: "numeric", month: "short" }) : "";

const PI_T = {
  cap:      { roman: "The pitṛ calendar", deva: "पितृ पञ्चाङ्ग", tel: "పితృ పంచాంగం" },
  title:    { roman: "Tarpaṇa days", deva: "तर्पण के दिन", tel: "తర్పణ దినాలు" },
  noneToday:{ roman: "No tarpaṇam today.", deva: "आज तर्पण नहीं है।", tel: "ఈ రోజు తర్పణం లేదు." },
  /* one whole sentence per language, with the rite at __ and the day at @@ */
  nextIs:   { roman: "Next is __, on @@.", deva: "अगला __, @@ को।", tel: "తరువాతిది __, @@." },
  /* the pakṣa is a span, not a day — one whole sentence per language */
  spanIs:   { roman: "__ to @@", deva: "__ से @@ तक", tel: "__ నుండి @@ వరకు" },
  nextCap:  { roman: "The next tarpaṇam", deva: "अगला तर्पण", tel: "తరువాతి తర్పణం" },
  lede:     { roman: "Which day a tarpaṇam falls on is not the tithi at sunrise. Each rite here says the hour that decided it, and where the rule comes from.",
              deva: "तर्पण का दिन सूर्योदय की तिथि से तय नहीं होता। यहाँ प्रत्येक कर्म उस काल को बताता है जिसने दिन तय किया, और नियम का स्रोत भी।",
              tel: "తర్పణం ఏ రోజు వస్తుందో సూర్యోదయ తిథి నిర్ణయించదు. ఇక్కడ ప్రతి కర్మ, రోజును నిర్ణయించిన కాలాన్ని, నియమపు మూలాన్ని చెబుతుంది." },
  ahead:    { roman: "Coming up", deva: "आगे", tel: "రాబోయేవి" },
  why:      { roman: "Why this date?", deva: "यह दिन क्यों?", tel: "ఈ రోజు ఎందుకు?" },
  decidedBy:{ roman: "Day decided at", deva: "दिन का निर्णय", tel: "రోజు నిర్ణయం" },
  keptIn:   { roman: "Kept in", deva: "कर्म काल", tel: "కర్మ కాలం" },
  tithiThere:{ roman: "Tithi at that instant", deva: "उस क्षण की तिथि", tel: "ఆ క్షణపు తిథి" },
  trigger:  { roman: "Falls on", deva: "कब", tel: "ఎప్పుడు" },
  sources:  { roman: "Sources", deva: "स्रोत", tel: "మూలాలు" },
  candidates:{ roman: "Two candidate days — the schools differ", deva: "दो सम्भावित दिन — मत भिन्न", tel: "రెండు సంభావ్య రోజులు — మతభేదం" },
  shanCap:  { roman: "The traditional śrāddha occasions", deva: "पारम्परिक श्राद्ध अवसर", tel: "సంప్రదాయ శ్రాద్ధ సందర్భాలు" },
  shanLede: { roman: "The śāstra counts ninety-six occasions on which a śrāddha or a tila tarpaṇa may be kept. They are a classification, not ninety-six obligations — most families keep a few of them, and no alert is raised for any of these. They are listed here so the calendar can be read rather than guessed at.",
              deva: "शास्त्र छियानवे अवसर गिनाता है जिन पर श्राद्ध या तिल तर्पण किया जा सकता है। यह एक वर्गीकरण है, छियानवे काम नहीं — अधिकांश परिवार इनमें से कुछ ही रखते हैं, और इनके लिए कोई सूचना नहीं भेजी जाती।",
              tel: "శ్రాద్ధం లేదా తిల తర్పణం చేయదగిన తొంభై ఆరు సందర్భాలను శాస్త్రం లెక్కిస్తుంది. ఇది వర్గీకరణ, తొంభై ఆరు కర్తవ్యాలు కాదు — చాలా కుటుంబాలు వీటిలో కొన్నే పాటిస్తాయి; వీటికి ఏ సూచనా పంపం. పంచాంగం ఊహించకుండా చదవగలిగేలా ఇక్కడ ఇచ్చాం." },
  yourTithi:{ roman: "Your record falls in this fortnight", deva: "आपका दिन इस पक्ष में", tel: "మీ రికార్డు ఈ పక్షంలో ఉంది" },
  vedaAsk:  { roman: "Upākarman differs by Veda and śākhā. Name yours in Settings and the Kāṇḍarṣi day will appear here.",
              deva: "उपाकर्म वेद और शाखा से बदलता है। सेटिंग्स में अपनी शाखा बतायें, तो काण्डर्षि का दिन यहाँ दिखेगा।",
              tel: "ఉపాకర్మ వేదం, శాఖను బట్టి మారుతుంది. సెట్టింగ్స్‌లో మీ శాఖ చెబితే కాండర్షి దినం ఇక్కడ కనిపిస్తుంది." },
  none:     { roman: "Nothing computed for this year", deva: "इस वर्ष के लिए कुछ नहीं", tel: "ఈ సంవత్సరానికి ఏమీ లేదు" },
  status_review: { roman: "Nirṇaya varies", deva: "निर्णय भिन्न", tel: "నిర్ణయం మారుతుంది" },
  status_prayoga:{ roman: "Prayoga-specific", deva: "प्रयोग-सापेक्ष", tel: "ప్రయోగాన్ని బట్టి" },
  badge_core:    { roman: "Core", deva: "मुख्य", tel: "ముఖ్యం" },
  badge_personal:{ roman: "Personal", deva: "व्यक्तिगत", tel: "వ్యక్తిగతం" },
  badge_advanced:{ roman: "Advanced", deva: "विस्तृत", tel: "విస్తృతం" },
  badge_prayoga: { roman: "Prayoga", deva: "प्रयोग", tel: "ప్రయోగం" },
};
const piT = (k, lang) => piPick(PI_T[k], lang);

function PiBadge({ kind, lang }) {
  if (!kind) return null;
  return <span className={"pit-badge is-" + kind}>{piT("badge_" + kind, lang)}</span>;
}

/* ---------------- why this date ---------------- */
function TarpanaWhy({ id, date, lang = "deva", onClose }) {
  const TP = window.STUTI_TARPANA, P = window.AKSHARA_PANCHANGA, L = window.STUTI_L;
  const w = usePiM(() => { try { return TP.why(id, date); } catch (e) { return null; } }, [id, +date]);
  if (!w) return null;
  const kalaName = (k) => piPick((TP.KALA[k] || {}).label, lang) || k;
  const tithiName = (ti) => { try { return piPick(window.STUTI_TITHIS.tithiName(ti), lang); } catch (e) { return String(ti + 1); } };
  return (
    <window.OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet" role="dialog" aria-label={piT("why", lang)}>
          <div className="pd-grip" />
          <button className="pd-x" onClick={onClose} aria-label={L.t("close", lang)}><window.Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{piT("why", lang)}</div>
            <div className="rm-head-title display" style={{ fontFamily: piFont(lang) }}>{piDate(date, lang)}</div>
            <div className="rm-head-sub">{piPick(w.trigger, lang)}</div>
          </div>
          <div className="pd-body scroll">
            <div className="pit-badges">
              <PiBadge kind={w.badge} lang={lang} />
              {w.status === "review" && <span className="pit-badge is-flag">{piT("status_review", lang)}</span>}
              {w.status === "prayoga" && <span className="pit-badge is-flag">{piT("status_prayoga", lang)}</span>}
            </div>
            <div className="pit-facts">
              <div className="pit-fact">
                <span>{piT("decidedBy", lang)}</span>
                <b>{kalaName(w.decisionKala)}{w.decidedAt ? " · " + w.decidedAt : ""}{w.overlapNextDay ? " (" + L.t("tomorrowShort", lang) + ")" : ""}</b>
              </div>
              {w.decidedTithi != null && (
                <div className="pit-fact">
                  <span>{piT("tithiThere", lang)}</span>
                  <b style={{ fontFamily: piFont(lang) }}>{tithiName(w.decidedTithi)}</b>
                </div>
              )}
              {(w.from || w.to) && (
                <div className="pit-fact">
                  <span>{piT("keptIn", lang)}</span>
                  <b>{kalaName(w.performanceKala)} · {w.from} – {w.to}</b>
                </div>
              )}
            </div>
            {w.candidates && w.candidates.length > 1 && (
              <div className="pit-cand">
                <div className="eyebrow">{piT("candidates", lang)}</div>
                <div className="pit-cand-days">{w.candidates.map((d, i) => <span key={i}>{piDate(d, lang)}</span>)}</div>
              </div>
            )}
            <p className="pit-rule">{piPick(w.rule, lang)}</p>
            {w.sources && w.sources.length > 0 && (
              <div className="pit-src">
                <div className="eyebrow">{piT("sources", lang)}</div>
                {w.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer noopener" className="pit-src-row">
                    <span>{s.label}</span><window.Icon name="chev" size={14} />
                  </a>
                ))}
              </div>
            )}
            <div style={{ height: 24 }} />
          </div>
        </div>
      </div>
    </window.OverlayPortal>
  );
}

/* ---------------- the days themselves ----------------
   The days ahead and the ninety-six, with no chrome of their own, so the
   same list serves the page and the calendar's tarpaṇa tab. */
function PitruDaysBody({ lang = "deva" }) {
  const TP = window.STUTI_TARPANA, V = window.STUTI_VRATA, L = window.STUTI_L;
  const [why, setWhy] = usePiS(null);              // { id, date }
  const [open, setOpen] = usePiS({});              // group id → bool
  const year = new Date().getFullYear();
  const ahead = usePiM(() => { try { return TP.upcoming(10); } catch (e) { return []; } }, [year]);
  const [groups, setGroups] = usePiS([]);
  /* the classification is a walk over the year's lunar months, so it is
     computed after the first paint — the tarpaṇa days above it are what the
     page is for and must be on screen at once */
  usePiE(() => {
    let live = true;
    const t = setTimeout(() => { try { const g = TP.shannavati(year); if (live) setGroups(g); } catch (e) {} }, 40);
    return () => { live = false; clearTimeout(t); };
  }, [year]);
  /* the yoga groups cost a walk of the whole year, so they are filled in when
     the reciter opens one — not on the way to a page they may not expand */
  const [yoga, setYoga] = usePiS(null);
  const expand = (g) => {
    const on = !!open[g.id];
    if (!on && g.lazy === "yoga" && !yoga) { try { setYoga(TP.yogaDays(year)); } catch (e) { setYoga({}); } }
    setOpen((o) => Object.assign({}, o, { [g.id]: !on }));
  };
  const itemsOf = (g) => g.lazy === "yoga" ? ((yoga && yoga[g.id]) || []) : g.items;
  const prof = TP.profile();
  const mine = usePiM(() => {
    /* a house śrāddha record whose tithi falls in the pitṛ pakṣa — the one
       part of the ninety-six that is actually about this family */
    try {
      const set = TP.mahalaya(year).map((x) => x.ti);
      return (window.STUTI_TITHIS.list() || []).filter((r) => r.kind === "shraddha" && set.indexOf(r.ti) !== -1);
    } catch (e) { return []; }
  }, [year]);
  const font = piFont(lang);
  return (
    <React.Fragment>
      <section className="tt-card">
        <div className="eyebrow">{piT("ahead", lang)}</div>
        <div className="pit-list">
          {ahead.map((u) => {
            const r = TP.rulesFor(u.v.id) || {};
            return (
              <div className="pit-row" key={u.v.id + u.date.getTime()}>
                {window.KeepBell && <span className="pit-row-bell"><window.KeepBell kind="vrata" id={u.v.id} lang={lang} size={18} /></span>}
                <div className="pit-row-body">
                  <div className="pit-row-name" style={{ fontFamily: font }}>{piPick(u.v.name, lang)}</div>
                  <div className="pit-row-sub">{piDate(u.date, lang)}{u.away === 0 ? " · " + L.t("vrataToday", lang) : u.away === 1 ? " · " + L.t("vrataTomorrow", lang) : ""}</div>
                </div>
                <div className="pit-row-acts">
                  <PiBadge kind={r.badge} lang={lang} />
                  <button className="icon-btn pit-why" onClick={() => setWhy({ id: u.v.id, date: u.date })}
                    aria-label={piT("why", lang)}>?</button>
                </div>
              </div>
            );
          })}
          {!ahead.length && <div className="pit-empty">{piT("none", lang)}</div>}
        </div>
        {!prof.veda && <p className="fb-hint" style={{ margin: "10px 2px 0" }}>{piT("vedaAsk", lang)}</p>}
      </section>


      <section className="tt-card">
        <div className="eyebrow">{piT("shanCap", lang)}</div>
        <p className="pit-lede pit-lede-sm">{piT("shanLede", lang)}</p>
        {mine.length > 0 && (
          <div className="pit-mine">
            <span>{piT("yourTithi", lang)}</span>
            <b style={{ fontFamily: font }}>{mine.map((r) => r.name).join(" · ")}</b>
          </div>
        )}
        <div className="pit-groups">
          {groups.map((g) => {
            const on = !!open[g.id];
            return (
              <div className={"pit-group" + (on ? " on" : "")} key={g.id}>
                {window.KeepBell && <span className="pit-group-bell"><window.KeepBell kind="tarpana" id={g.id} lang={lang} size={18} /></span>}
                <button className="pit-group-head" onClick={() => expand(g)} aria-expanded={on}>
                  <span className="pit-group-name" style={{ fontFamily: font }}>{piPick(g.name, lang)}</span>
                  <span className="pit-group-meta">
                    <PiBadge kind={g.badge} lang={lang} />
                    <span className="pit-group-n">{g.lazy && !yoga ? "" : itemsOf(g).length}</span>
                    <window.Icon name="chev" size={15} />
                  </span>
                </button>
                {on && (
                  <div className="pit-group-body">
                    <p className="pit-note">{piPick(g.note, lang)}</p>
                    <div className="pit-days">
                      {itemsOf(g).map((it, i) => (
                        <span className="pit-day" key={i}>
                          {piShort(it.date, lang)}
                          {it.label ? <i style={{ fontFamily: font }}>{piPick(it.label, lang)}</i> : null}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      {why && <TarpanaWhy id={why.id} date={why.date} lang={lang} onClose={() => setWhy(null)} />}
    </React.Fragment>
  );
}

/* ---------------- the page ---------------- */
function PitruCalendarView({ go, lang = "deva", backView }) {
  return (
    <div className="view pit-view scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go(backView || "calendar")} aria-label={window.STUTI_L.a("aBack")}><window.Icon name="back" /></button>
        <div className="topbar-title display" style={{ fontFamily: piFont(lang) }}>{piT("title", lang)}</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="pit-head">
        <div className="pit-seal-row">{window.Seal && <window.Seal d={{ id: "pitr", hue: 168 }} size={88} />}</div>
              <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{piT("cap", lang)}</div>
        <p className="pit-lede">{piT("lede", lang)}</p>
      </div>
      <PitruDaysBody lang={lang} />
    </div>
  );
}

/* the door on the pañcāṅga page */
function PitruDoor({ go, lang = "deva", compact }) {
  const TP = window.STUTI_TARPANA;
  let nx = null;
  try { if (!compact) nx = TP.nextOccasion(); } catch (e) {}
  return (
    <button className="pit-door" onClick={() => go("pitru", { from: "calendar" })}>
      <span className="pit-door-body">
        <span className="pit-door-name" style={{ fontFamily: piFont(lang) }}>{piT("title", lang)}</span>
        {!compact && <span className="eyebrow">{piT("cap", lang)}</span>}
        {nx && <span className="pit-door-sub">{piPick(nx.name, lang)} · {piDate(nx.date, lang)}</span>}
      </span>
      <window.Icon name="chev" size={17} />
    </button>
  );
}

Object.assign(window, { TarpanaWhy, PitruCalendarView, PitruDaysBody, PitruDoor, PiBadge, piT, piPick });

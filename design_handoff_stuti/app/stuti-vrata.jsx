/* ============================================================
   STUTI — the Vrata lens
   Not a list of dates: a lens for things you prepare for. Which
   fall this month, how many days away, and for each one the
   samagri to gather (tickable — it is a shopping list before it
   is anything else), the vidhi in order, and the texts.
   ============================================================ */
const { useState: useStateV2, useEffect: useEffectV2 } = React;

const vRule = (v) => {
  if (v.ruleBy && window.STUTI_VRATA && window.STUTI_VRATA.southern) return v.ruleBy(window.STUTI_VRATA.southern());
  return (window.masaSys && window.masaSys() === "purnimanta" && v.ruleP) ? v.ruleP : v.rule;
};
window.vRule = vRule;
/* the month reckoning can change under a screen that is already open */
function useMasaSys() {
  const [s, setS] = useStateV2(() => (window.masaSys ? window.masaSys() : "amanta"));
  useEffectV2(() => window.STUTI_PREFS.subscribe(() => setS(window.masaSys())), []);
  return s;
}
const vp3 = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.tel || o.roman) : o.roman);
const vLocale = (lang) => (lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined);
const vFont = (lang) => window.STUTI_L.font(lang);

function vDateStr(d, lang, opts) {
  return d.toLocaleDateString(vLocale(lang), opts || { day: "numeric", month: "short" });
}
function vAwayLabel(away, lang) {
  const L = window.STUTI_L;
  if (away === 0) return L.t("vrataToday", lang);
  if (away === 1) return L.t("vrataTomorrow", lang);
  return L.t("vrataInDays", lang).replace("{n}", away);
}

/* a many-day span is told by its start; while it runs, by which day it is */
function vSpanLabel(entry, lang) {
  const L = window.STUTI_L;
  if (entry.dayNo) {
    const end = new Date(entry.start.getFullYear(), entry.start.getMonth(), entry.start.getDate() + (entry.days || 1) - 1);
    return L.t("vrataDayOf", lang).replace("{n}", entry.dayNo).replace("{d}", entry.days) + " · " + L.t("vrataEnds", lang).replace("{date}", vDateStr(end, lang));
  }
  return L.t("vrataBegins", lang).replace("{date}", vDateStr(entry.start, lang)) + " · " + vAwayLabel(entry.away, lang);
}

/* a festival of several named days is listed day by day: the parent row
   carries the name and the span, each day below it its own line and date */
function VrataSpanRows({ entry, lang, onOpen, no }) {
  const S = window.STUTI, L = window.STUTI_L;
  const v = entry.v, font = vFont(lang);
  const end = new Date(entry.start.getFullYear(), entry.start.getMonth(), entry.start.getDate() + entry.days - 1);
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  return (
    <div className="gs-span">
      <div className="gs-en">
        {vIsVratam(v) && <window.KeepBell kind="vrata" id={v.id} lang={lang} />}
        <button className="gs-main" onClick={() => onOpen(v.id)}>
          <span className="gs-no" style={{ fontFamily: font }}>{String(no)}</span>
          <span className="gs-ti"><span className="gs-d" style={{ fontFamily: font }}>{vp3(v.name, lang)}</span></span>
          <span className="gs-dl" />
          <span className="gs-vc">{vDateStr(entry.start, lang)} – {vDateStr(end, lang)}</span>
        </button>
      </div>
      {v.dayLines.slice(0, entry.days).map((dl, i) => {
        const d = new Date(entry.start.getFullYear(), entry.start.getMonth(), entry.start.getDate() + i);
        const away = Math.round((d - t0) / 86400000);
        const past = away < 0;
        const dayNo = lang === "telugu" ? (i + 1) + "వ రోజు" : lang === "deva" ? "दिन " + (i + 1) : "Day " + (i + 1);
        return (
          <div key={i} className={"gs-en gs-en-day" + (past ? " soon" : "")}>
            <button className="gs-main" onClick={() => onOpen(v.id)}>
              <span className="gs-no gs-day-no" style={{ fontFamily: font }}>{dayNo}</span>
              <span className="gs-ti">
                <span className="gs-day-line">{vp3(dl, lang)}</span>
                {dl.mark && <span className="gs-day-mark">{vp3(dl.mark, lang)}</span>}
              </span>
              <span className="gs-dl" />
              <span className={"gs-vc" + (!past && away <= 10 ? " gs-vc-soon" : "")}>{vDateStr(d, lang)}{past ? "" : " · " + vAwayLabel(away, lang)}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- one row in the lens: granthasūcī entry, not a card ---------------- */
/* a full-moon row reads "[month] Pūrṇimā · [viśeṣa tithi]"; colour the
   month's pūrṇimā apart from the day's own occasion so the eye finds the
   month at once. Only when both halves are present — a plain name stays one
   colour. */
function vNameColored(name, lang) {
  const txt = vp3(name, lang);
  const fold = (s) => (window.STUTI_TRANSLIT ? window.STUTI_TRANSLIT.fold(s) : String(s).toLowerCase());
  const isPur = (p) => fold(p).indexOf("purnima") !== -1 || /పౌర్ణమ|పూర్ణిమ|पूर्णिम/.test(p);
  const parts = String(txt).split(" · ");
  const masaIdx = parts.findIndex(isPur);
  if (masaIdx === -1) return txt;
  return parts.map((p, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span className="gs-nsep"> · </span>}
      <span className={i === masaIdx ? "gs-n-masa" : "gs-n-visesha"}>{p}</span>
    </React.Fragment>
  ));
}

function VrataRow({ entry, lang, onOpen, no }) {
  if (entry.days > 1 && entry.v.dayLines && entry.v.dayLines.length >= entry.days) return <VrataSpanRows entry={entry} lang={lang} onOpen={onOpen} no={no} />;
  const S = window.STUTI;
  const v = entry.v, d = S.deityById[v.deity];
  const soon = entry.away <= 10;
  const font = vFont(lang);
  return (
    <div className="gs-en">
      {vIsVratam(v) && <window.KeepBell kind="vrata" id={v.id} lang={lang} />}
      <button className="gs-main" onClick={() => onOpen(v.id)}>
        <span className="gs-no" style={{ fontFamily: font }}>{String(no)}</span>
        <span className="gs-ti"><span className="gs-d" style={{ fontFamily: font }}>{vNameColored(v.name, lang)}</span></span>
        <span className="gs-dl" />
        <span className={"gs-vc" + (soon ? " gs-vc-soon" : "")}>{entry.days > 1 ? vSpanLabel(entry, lang) : vDateStr(entry.date, lang) + " · " + vAwayLabel(entry.away, lang)}</span>
      </button>
    </div>
  );
}

/* ---------------- the lens ---------------- */
/* One engine, two lenses. A vratam is something you keep — fast, niyama,
   samagri — and a parva is something the whole house observes; the same
   almanac finds both dates, so they share the row, the search and the guide,
   and differ only in which half of the pool they draw from. */
const vIsVratam = (v) => (window.STUTI_PROV ? window.STUTI_PROV.isType(v, "vratam", "cycle", "diksha") : v.kind === "vratam");
/* a vow bound to no month: begun on any week, kept every fortnight, or on any
   favourable day. It has no place in a list ordered by date. */
const vIsVow = (v) => !!(v.floating || v.optional || v.everyMonth || (window.STUTI_PROV && window.STUTI_PROV.isType(v, "diksha")));
const vVowGroup = (v) => (v.optional && !v.floating ? "vrataGrpAny" : v.everyMonth ? "vrataGrpFortnight" : window.STUTI_PROV && window.STUTI_PROV.isType(v, "diksha") ? "vrataGrpDiksha" : "vrataGrpCycle");

/* one row on the vow tab: name and rule, no date; a dīkṣā with a fixed span adds it */
function VowRow({ v, lang, onOpen, no, entry }) {
  const font = vFont(lang);
  const span = entry && entry.days > 1 && !v.floating ? vSpanLabel(entry, lang) : null;
  return (
    <div className="gs-en">
      <window.KeepBell kind="vrata" id={v.id} lang={lang} />
      <button className="gs-main" onClick={() => onOpen(v.id)}>
        <span className="gs-no" style={{ fontFamily: font }}>{String(no)}</span>
        <span className="gs-ti">
          <span className="gs-d" style={{ fontFamily: font }}>{vp3(v.name, lang)}</span>
          <span className="gs-vow-rule">{vp3(vRule(v), lang)}</span>
        </span>
        {span && <span className="gs-dl" />}
        {span && <span className="gs-vc">{span}</span>}
      </button>
    </div>
  );
}

/* the lens search query outlives a trip into a detail and back, so opening
   an Ekādaśī from a search and returning lands on the same results */
const vrataLensQ = {};
function VrataLens({ go, lang, onOpen, only = "vratam", ph = "vrataSearchPh", none = "vrataNoMatch" }) {
  const L = window.STUTI_L, V = window.STUTI_VRATA;
  useMasaSys();
  const [q, setQ0] = useStateV2(() => vrataLensQ[only] || "");
  const setQ = (val) => { const v = typeof val === "function" ? val(vrataLensQ[only] || "") : val; vrataLensQ[only] = v; setQ0(v); };
  const [tab, setTab] = useStateV2("year");
  const now = new Date();
  const pool = V.upcoming().filter((x) => (only === "vratam" ? vIsVratam(x.v) : !vIsVratam(x.v)));
  /* the vows bound to no month sit on their own tab; the dated list is annual */
  const vows = only === "vratam" ? pool.filter((x) => vIsVow(x.v)) : [];
  const all = only === "vratam" ? pool.filter((x) => !vIsVow(x.v)) : pool;
  /* the list is a calendar until someone types: then it is a name lookup,
     flat and date-ordered, because "when is Varalakṣmī" is the only
     question a search on this lens is ever asked. */
  const fold = (s) => (window.STUTI_TRANSLIT ? window.STUTI_TRANSLIT.fold(s) : String(s).toLowerCase());
  const qf = fold(q).trim().replace(/pournn?am[ia]|poornn?am[ia]|punn?am[ia]|purnami|pornima|pornami|punima|punami/g, "purnima");
  const hayOf = (v) => { let h = fold([v.name.roman, v.name.deva, v.name.tel].filter(Boolean).join(" ")); if (h.indexOf("purnima") !== -1) h += " " + fold("poornima pournima pournami punnami poornnima pournnami"); return h; };
  const hits = qf ? pool.filter((x) => hayOf(x.v).indexOf(qf) !== -1)
    .sort((a, b) => (b.v.everyMonth ? 1 : 0) - (a.v.everyMonth ? 1 : 0)) : null;
  /* a span that began last month but is still running belongs with this month,
     not dumped into "coming" behind every later date */
  const spanEndOf = (x) => new Date(x.start.getFullYear(), x.start.getMonth(), x.start.getDate() + (x.days || 1) - 1);
  const inThisMonth = (x) => (x.start.getFullYear() === now.getFullYear() && x.start.getMonth() === now.getMonth()) || (x.dayNo && spanEndOf(x) >= now);
  const thisMonth = all.filter(inThisMonth);
  const later = all.filter((x) => thisMonth.indexOf(x) === -1);
  const monthName = now.toLocaleDateString(vLocale(lang), { month: "long" });
  let n = 0;
  return (
    <div className="lens-pad">
      <div className="nomu-lens-head">
        {only === "vratam" && <div className="gs-wm gs-wm-nomu gs-wm-vrata">
          <img className="emblem-img emblem-img--day" src="emblems/kalasham-inkday.png" alt="" draggable="false" />
          <img className="emblem-img emblem-img--night" src="emblems/kalasham-inknight.png" alt="" draggable="false" />
        </div>}
        {only === "parva" && <div className="gs-wm gs-wm-nomu gs-wm-parva">
          <img className="emblem-img emblem-img--day" src="emblems/harathi-inkday.png" alt="" draggable="false" />
          <img className="emblem-img emblem-img--night" src="emblems/harathi-inknight.png" alt="" draggable="false" />
        </div>}
        <div className="vr-find vr-find-compact vr-find-side">
          <div className="search-field search-field-sm">
            <Icon name="search" size={18} />
            <input className="search-input" type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={L.t(ph, lang)} aria-label={L.t(ph, lang)} style={{ fontFamily: vFont(lang) }} />
            <window.VoiceButton lang={lang} onInterim={setQ} onResult={setQ} />
            {q && <button className="icon-btn vr-find-x" onClick={() => setQ("")} aria-label={L.t("startOver", lang)}><Icon name="close" size={17} /></button>}
          </div>
        </div>
      </div>

      {only === "vratam" && !hits && (
        <div className="cal-lenses vr-tabs" role="tablist">
          {[["year", "vrataTabYear"], ["vow", "vrataTabVow"]].map(([id, key]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={"cal-lens" + (tab === id ? " on" : "")} style={{ fontFamily: vFont(lang) }} onClick={() => setTab(id)}>{L.t(key, lang)}</button>
          ))}
        </div>
      )}

      {hits ? (
        <div className="gs-ix">
          <div className="gs-sec">{hits.length ? L.t("vrataFound", lang).replace("{n}", hits.length) : L.t(none, lang)}</div>
          {hits.map((x) => (vIsVow(x.v) && only === "vratam" ? <VowRow key={x.v.id} v={x.v} entry={x} lang={lang} onOpen={onOpen} no={++n} /> : <VrataRow key={x.v.id} entry={x} lang={lang} onOpen={onOpen} no={++n} />))}
        </div>
      ) : tab === "vow" && only === "vratam" ? (
      <div className="gs-ix">
        {["vrataGrpCycle", "vrataGrpDiksha", "vrataGrpFortnight", "vrataGrpAny"].map((g) => {
          const rows = vows.filter((x) => vVowGroup(x.v) === g);
          if (!rows.length) return null;
          return (
            <React.Fragment key={g}>
              <div className="gs-sec">{L.t(g, lang)}</div>
              {rows.map((x) => <VowRow key={x.v.id} v={x.v} entry={x} lang={lang} onOpen={onOpen} no={++n} />)}
            </React.Fragment>
          );
        })}
        <div className="vr-caveat">{L.t("vrataVowNote", lang)}</div>
      </div>
      ) : (
      <div className="gs-ix">
        {thisMonth.length > 0 && (
          <React.Fragment>
            <div className="gs-sec">{monthName}</div>
            {thisMonth.map((x) => <VrataRow key={x.v.id} entry={x} lang={lang} onOpen={onOpen} no={++n} />)}
          </React.Fragment>
        )}
        <div className="gs-sec">{L.t("vrataComing", lang)}</div>
        {later.map((x) => <VrataRow key={x.v.id} entry={x} lang={lang} onOpen={onOpen} no={++n} />)}
      </div>
      )}

      {tab !== "vow" && <div className="vr-caveat">{L.t("vrataDateNote", lang)}</div>}
      <div style={{ height: 32 }} />
    </div>
  );
}

/* ---------------- samagri: a list you tick while shopping ---------------- */
function SamagriList({ vrataId, items, lang }) {
  const L = window.STUTI_L;
  const key = "stuti-samagri-" + vrataId;
  const [done, setDone] = useStateV2(() => {
    try { const a = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  });
  useEffectV2(() => { try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {} }, [done, key]);
  const toggle = (i) => setDone((d) => (d.indexOf(i) !== -1 ? d.filter((x) => x !== i) : d.concat([i])));
  const left = items.length - done.length;
  return (
    <div className="sam-block">
      <div className="sam-head">
        <span className="eyebrow">{L.t("samagri", lang)}</span>
        <span className="sam-count">{left > 0 ? L.t("samagriLeft", lang).replace("{n}", left) : L.t("samagriAll", lang)}</span>
      </div>
      <ul className="sam-list">
        {items.map((it, i) => {
          const on = done.indexOf(i) !== -1;
          return (
            <li key={i} className={"sam-item" + (on ? " on" : "")}>
              <button onClick={() => toggle(i)} aria-pressed={on}>
                <span className="sam-box">{on && <Icon name="check" size={15} />}</span>
                <span className="sam-text">{vp3(it, lang)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {done.length > 0 && (
        <button className="sam-clear" onClick={() => setDone([])}>
          <Icon name="repeat" size={14} /> {L.t("startOver", lang)}
        </button>
      )}
    </div>
  );
}

/* ---------------- the named Ekādaśī of this fortnight ----------------
   The Ekādaśī vratam is one row, but each fortnight's fast has its own
   name, story and source — and a few are kept their own way. The page
   reads the pañcāṅga for the coming Ekādaśī, names it, tells it, and
   closes with the keeping shared by all twenty-six. */
function EkadashiNamed({ v, lang, font }) {
  const E = window.STUTI_EKADASHI, V = window.STUTI_VRATA;
  if (!E) return null;
  const named = E.byId(v.id);
  const date = V.nextDate(v);
  const ek = named || (date ? E.pick(date) : null);
  if (!ek) return null;
  const g = (o) => vp3(o, lang);
  const lbl = (r, d, t) => (lang === "telugu" ? t : lang === "deva" ? d : r);
  return (
    <React.Fragment>
      <div className="vr-sect ek-named">
        <div className="eyebrow">{named ? lbl("The Ekādaśī", "एकादशी", "ఏకాదశి") : lbl("This fortnight’s Ekādaśī", "इस पक्ष की एकादशी", "ఈ పక్షపు ఏకాదశి")}</div>
        <h2 className="ek-name display" style={{ fontFamily: font }}>{g(ek.name)}</h2>
        <div className="ek-when">{g(ek.when)}</div>
        {ek.also && <div className="ek-also">{lbl("Also", "अन्य नाम", "ఇతర పేర్లు")} · {g(ek.also)}</div>}
        {ek.differs && <div className="ek-flag">{lbl("Kept its own way", "अपने ढंग से रखी जाती है", "దీనికి సొంత నియమం ఉంది")}</div>}
      </div>
      <div className="vr-sect">
        <div className="eyebrow">{lbl("Introduction", "आरंभिक संवाद", "పూర్వభాగం")}</div>
        <p className="vr-para">{g(ek.meaning)}</p>
      </div>
      <div className="vr-sect">
        <div className="eyebrow">{lbl("The story", "कथा", "కథ")}</div>
        <p className="vr-para">{g(ek.story)}</p>
        <div className="vr-source" style={{ marginTop: 12 }}>{g(ek.source)}</div>
      </div>
      {ek.differs && ek.niyama && (
        <div className="vr-sect ek-differs">
          <div className="eyebrow">{lbl("How this one is kept", "इसका अपना नियम", "దీని ప్రత్యేక నియమం")}</div>
          <p className="vr-para">{g(ek.niyama)}</p>
        </div>
      )}
      <div className="vr-sect ek-shared">
        <div className="eyebrow">{lbl("The keeping, for every Ekādaśī", "नियम, हर एकादशी के लिए", "ప్రతి ఏకాదశికీ నియమం")}</div>
        {[["The fast", "उपवास", "ఉపవాసం", E.shared.fast],
          ["Which day — the viddha rule", "कौन-सा दिन — विद्धा नियम", "ఏ రోజు — విద్ధ నియమం", E.shared.viddha],
          ["Breaking the fast — the pāraṇa", "पारण", "పారణ", E.shared.parana]].map(([r, d, t, body], i) => (
          <div className="ek-rule" key={i}>
            <div className="ek-rule-h display" style={{ fontFamily: font }}>{lbl(r, d, t)}</div>
            <p className="vr-para">{g(body)}</p>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

/* ---------------- the pūrṇimā of this month ----------------
   Most full moons carry a story the elders tell — Hanumān on Caitra,
   Vyāsa on Āṣāḍha, the three cities on Kārtika. A roster entry that
   is a pūrṇimā, or a jayantī kept on one, opens with that month's
   account; Satyanārāyaṇa opens with its own vratakathā instead. */
function PurnimaNamed({ v, lang, font }) {
  const Pu = window.STUTI_PURNIMA, V = window.STUTI_VRATA;
  if (!Pu) return null;
  const g = (o) => vp3(o, lang);
  const lbl = (r, d, t) => (lang === "telugu" ? t : lang === "deva" ? d : r);
  const paras = (s) => String(s || "").split(/\n\n+/).map((x) => x.trim()).filter(Boolean);
  const Para = ({ src }) => paras(g(src)).map((p, i) => <p className="vr-para" key={i}>{p}</p>);

  if (v.id === "satyanarayana") {
    const s = Pu.satya;
    return (
      <React.Fragment>
        <div className="vr-sect ek-named">
          <div className="eyebrow">{lbl("The vratakathā", "व्रतकथा", "వ్రతకథ")}</div>
          <h2 className="ek-name display" style={{ fontFamily: font }}>{g(s.name)}</h2>
          <div className="ek-when">{g(s.lead)}</div>
        </div>
        {s.chapters.map((c, i) => (
          <div className="vr-sect" key={i}>
            <div className="eyebrow">{lbl("Chapter", "अध्याय", "అధ్యాయం")} {c.num}</div>
            <div className="ek-rule-h display" style={{ fontFamily: font }}>{g(c.title)}</div>
            <Para src={c.body} />
          </div>
        ))}
        {s.niyama && g(s.niyama) && (
          <div className="vr-sect ek-differs">
            <div className="eyebrow">{lbl("How it is kept", "इसका नियम", "దీని నియమం")}</div>
            <Para src={s.niyama} />
          </div>
        )}
        <div className="vr-sect"><div className="vr-source">{g(s.source)}</div></div>
      </React.Fragment>
    );
  }

  const pur = Pu.forVrata(v.id) || (V.nextDate(v) ? Pu.pick(V.nextDate(v)) : null);
  if (!pur) return null;
  return (
    <React.Fragment>
      <div className="vr-sect ek-named">
        <div className="eyebrow">{lbl("The Pūrṇimā", "पूर्णिमा", "పౌర్ణమి")}</div>
        <h2 className="ek-name display" style={{ fontFamily: font }}>{g(pur.name)}</h2>
        <div className="ek-when">{g(pur.when)}</div>
      </div>
      {g(pur.meaning) && (
        <div className="vr-sect">
          <div className="eyebrow">{lbl("Introduction", "आरंभिक संवाद", "పూర్వభాగం")}</div>
          <Para src={pur.meaning} />
        </div>
      )}
      <div className="vr-sect">
        <div className="eyebrow">{lbl("The story", "कथा", "కథ")}</div>
        <Para src={pur.story} />
        <div className="vr-source" style={{ marginTop: 12 }}>{g(pur.source)}</div>
      </div>
      {g(pur.connection) && (
        <div className="vr-sect">
          <div className="eyebrow">{lbl("The full-moon connection", "पूर्णिमा से संबंध", "పౌర్ణమి సంబంధం")}</div>
          <Para src={pur.connection} />
        </div>
      )}
      {pur.festival && g(pur.festival) && (
        <div className="vr-sect">
          <div className="eyebrow">{lbl("The festival account", "उत्सव-परम्परा", "పండుగ కథ")}</div>
          <Para src={pur.festival} />
        </div>
      )}
      {pur.differs && pur.niyama && g(pur.niyama) && (
        <div className="vr-sect ek-differs">
          <div className="eyebrow">{lbl("How this one is kept", "इसका अपना नियम", "దీని నియమం")}</div>
          <Para src={pur.niyama} />
        </div>
      )}
    </React.Fragment>
  );
}

/* ---------------- the guide ---------------- */
function VrataDetail({ vrataId, go, lang, onBack }) {
  const S = window.STUTI, L = window.STUTI_L, V = window.STUTI_VRATA;
  useMasaSys();
  const v = V.lookup ? V.lookup(vrataId) : V.byId[vrataId];
  if (!v) return null;
  const d = S.deityById[v.deity];
  const date = V.nextDate(v);
  const away = date ? V.daysAway(date) : null;
  const font = vFont(lang);
  const E = window.STUTI_EKADASHI;
  const isEk = !!(E && (v.id === "ekadashi" || E.byId(v.id) || v.asEkadashi));
  const Pu = window.STUTI_PURNIMA;
  const isPur = !isEk && !!(Pu && Pu.hasVrata(v.id));

  return (
    <div className="view libhub scroll" style={deityStyle(d, { flex: 1 })}>
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label={window.STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div style={{ width: 50 }} />
      </div>
      <div className="lens-pad">
        <header className="vr-hero">
          <div className="deity-hero-row">
            <Seal d={d} size={56} />
            <div className="deity-hero-text">
              <h1 className="deity-hero-name display" style={{ fontFamily: font }}>{vp3(v.name, lang)}</h1>
              <div className="deity-hero-epithet">{vp3(vRule(v), lang)}</div>
            </div>
            {window.VidhiJump && !isEk && !isPur && <window.VidhiJump hymnId={v.vidhiText} deity={v.deity} go={go} lang={lang} />}
          </div>
          <p className="deity-hero-line">{vp3(v.tagline, lang)}</p>
          {date && (
            <div className="vr-when">
              <span className="vr-when-date">{vDateStr(date, lang, { weekday: "long", day: "numeric", month: "long" })}</span>
              <span className={"vr-when-away" + (away <= 10 ? " soon" : "")}>{vAwayLabel(away, lang)}</span>
            </div>
          )}
          {window.KeepSpan && window.STUTI_KEEP.spanOf(v.id) && <window.KeepSpan vrataId={v.id} lang={lang} />}
          <div className="vr-meta">
            <span>{vp3(v.duration, lang)}</span>
            <span className="dot" />
            <span>{vp3(v.who, lang)}</span>
          </div>
        </header>

        {/* the two things a reciter opens the page for: the vidhānam of the day and,
           where the day carries one, its pārāyaṇa. Both stand at the top rather
           than under the reading; neither is written yet, so both say so. */}
        {((!v.vidhi && !isEk && !isPur) || v.parayana) && (
        <div className="vr-sect vr-open">
          {/* the placeholder only stands where no procedure has been keyed yet — a
             rite that carries its own vidhi says so ten steps further down */}
          {!v.vidhi && !isEk && !isPur && (
          <div className="vr-open-row is-soon" aria-disabled="true">
            <span className="vr-open-mark"><Icon name="diya" size={22} /></span>
            <span className="vr-row-body">
              <span className="vr-row-name display" style={{ fontFamily: font }}>{L.t("vidhanamOpen", lang)}</span>
              <span className="vr-row-rule">{L.t("vidhanamOpenSub", lang)}</span>
            </span>
            <span className="vr-open-soon">{L.t("comingSoon", lang)}</span>
          </div>
          )}
          {v.parayana && (
            <div className="vr-open-row is-soon" aria-disabled="true">
              <span className="vr-open-mark"><Icon name="book" size={22} /></span>
              <span className="vr-row-body">
                <span className="vr-row-name display" style={{ fontFamily: font }}>{vp3(v.parayana.name, lang)}</span>
                <span className="vr-row-rule">{vp3(v.parayana.sub, lang)}</span>
              </span>
              <span className="vr-open-soon">{L.t("comingSoon", lang)}</span>
            </div>
          )}
        </div>
        )}

        {isEk && <EkadashiNamed v={v} lang={lang} font={font} />}
        {isPur && <PurnimaNamed v={v} lang={lang} font={font} />}

        {v.brief && !isEk && !isPur && <div className="vr-brief">{L.t("vrataBrief", lang)}</div>}

        {v.samagri && <SamagriList vrataId={v.id} items={v.samagri} lang={lang} />}

        {v.patri && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("patri", lang)}</div>
            <div className="vr-patri-sub">{L.t("patriLeaves", lang)}</div>
            <ol className="vr-patri">
              {v.patri.map((p, i) => (
                <li key={i}><span className="vr-patri-n">{i + 1}</span><span className="vr-patri-name">{vp3(p, lang)}</span></li>
              ))}
            </ol>
            {v.pushpa && (
              <React.Fragment>
                <div className="vr-patri-sub">{L.t("patriFlowers", lang)}</div>
                <ol className="vr-patri">
                  {v.pushpa.map((p, i) => (
                    <li key={i}><span className="vr-patri-n">{i + 1}</span><span className="vr-patri-name">{vp3(p, lang)}</span></li>
                  ))}
                </ol>
              </React.Fragment>
            )}
            {v.durva && (
              <React.Fragment>
                <div className="vr-patri-sub">{L.t("patriDurva", lang)}</div>
                <ol className="vr-patri">
                  {v.durva.map((p, i) => (
                    <li key={i}><span className="vr-patri-n">{i + 1}</span><span className="vr-patri-name">{vp3(p, lang)}</span></li>
                  ))}
                </ol>
              </React.Fragment>
            )}
            {v.patriNote && <p className="vr-para" style={{ marginTop: 10 }}>{vp3(v.patriNote, lang)}</p>}
          </div>
        )}

        {v.vidhi && (
          <div className="vr-sect" id={"vidhi-" + v.id}>
            <div className="eyebrow">{L.t("vidhi", lang)}</div>
            <ol className="vr-vidhi">
              {v.vidhi.map((s, i) => (
                <li key={i}>
                  <span className="vr-vidhi-n">{i + 1}</span>
                  <span className="vr-vidhi-body">
                    <span className="vr-vidhi-step display" style={{ fontFamily: font }}>{vp3(s.step, lang)}</span>
                    <span className="vr-vidhi-detail">{vp3(s.detail, lang)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {v.sankalpas && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("sankalpas", lang)}</div>
            <div className="vr-sank">
              {v.sankalpas.map((s, i) => (
                <div key={i} className="vr-sank-row">
                  <span className="vr-sank-when display" style={{ fontFamily: font }}>{vp3(s.when, lang)}</span>
                  <span className="vr-sank-text">{vp3(s.text, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {v.recipients && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("recipients", lang)}</div>
            {v.recipientsNote && <p className="vr-para">{vp3(v.recipientsNote, lang)}</p>}
            <div className="vr-recip">
              {v.recipients.map((r, i) => (
                <div key={i} className="vr-recip-row">
                  <span className="vr-recip-head">
                    <span className="vr-recip-name">{vp3(r.name, lang)}</span>
                    <span className="vr-recip-kin">{vp3(r.kin, lang)}</span>
                  </span>
                  <span className="vr-recip-form">{vp3(r.form, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {v.significance && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("significance", lang)}</div>
            {v.significance.map((s, i) => <p key={i} className="vr-para">{vp3(s, lang)}</p>)}
          </div>
        )}

        {v.timeline && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("howTheDayRuns", lang)}</div>
            <ol className="vr-timeline">
              {v.timeline.map((t, i) => (
                <li key={i}>
                  <span className="vr-tl-t">{vp3(t.t, lang)}</span>
                  <span className="vr-tl-d">{vp3(t.d, lang)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}


        {v.naivedya && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("naivedya", lang)}</div>
            <div className="vr-naiv">
              {v.naivedya.map((n, i) => (
                <div key={i} className="vr-naiv-row">
                  <span className="vr-naiv-item">{vp3(n.item, lang)}</span>
                  <span className="vr-naiv-note">{vp3(n.note, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* the app names no hymn for a day; the reader chooses from the deity's shelf */}
        <div className="vr-sect">
          <div className="eyebrow">{L.t("toRecite", lang)}</div>
          <window.DeityLink d={d} go={go} lang={lang} />
        </div>

        {(v.dos || v.donts) && (
          <div className="vr-sect vr-rules">
            {v.dos && (
              <div className="vr-rule vr-do">
                <div className="eyebrow">{L.t("dos", lang)}</div>
                <ul>{v.dos.map((x, i) => <li key={i}>{vp3(x, lang)}</li>)}</ul>
              </div>
            )}
            {v.donts && (
              <div className="vr-rule vr-dont">
                <div className="eyebrow">{L.t("donts", lang)}</div>
                <ul>{v.donts.map((x, i) => <li key={i}>{vp3(x, lang)}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {v.source && <div className="vr-source">{vp3(v.source, lang)}</div>}
        {v.prov && window.STUTI_PROV && !isEk && <div className="vr-source vr-prov">{window.STUTI_PROV.typeName(v, lang)} · {window.STUTI_PROV.line(v, lang)}</div>}
        {v.brief && !v.source && !isEk && <div className="vr-caveat">{L.t("vrataNote", lang)}</div>}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

function FestivalLens(props) {
  return <VrataLens {...props} only="parva" ph="festSearchPh" none="festNoMatch" />;
}

Object.assign(window, { VrataLens, FestivalLens, VrataDetail, SamagriList });

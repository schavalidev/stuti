/* ============================================================
   STUTI — the house's own tithis, on screen
   TithiSheet: add or edit one — usually from the civil date the family
   remembers, which the pañcāṅga turns into māsa · pakṣa · tithi; the rule
   can be corrected by hand. MyTithisCard: the list, on the calendar page.
   ============================================================ */
const { useState: useStateTT, useEffect: useEffectTT, useMemo: useMemoTT } = React;

const TT = {
  cap:      { roman: "My tithis", deva: "मेरी तिथियाँ", telugu: "మా తిథులు" },
  add:      { roman: "Add a tithi", deva: "तिथि जोड़ें", telugu: "తిథి జోడించు" },
  addHere:  { roman: "Add a tithi on this day", deva: "इस दिन की तिथि जोड़ें", telugu: "ఈ రోజు తిథి జోడించు" },
  edit:     { roman: "Edit tithi", deva: "तिथि बदलें", telugu: "తిథి మార్చు" },
  lede:     { roman: "A janma tithi, an ābdikam, a day the house keeps — the app finds it every year and says so the day before.", deva: "जन्म तिथि, आब्दिक, या घर का कोई दिन — ऐप हर वर्ष उसे ढूँढकर एक दिन पहले बताता है।", telugu: "జన్మ తిథి, ఆబ్దికం, ఇల్లు పాటించే రోజు — యాప్ ప్రతి సంవత్సరం దాన్ని కనుగొని ముందు రోజే చెబుతుంది." },
  empty:    { roman: "No tithis of your own yet.", deva: "अभी आपकी कोई तिथि नहीं।", telugu: "మీ తిథులు ఇంకా లేవు." },
  who:      { roman: "Whose day, or what", deva: "किसका दिन, या क्या", telugu: "ఎవరి రోజు, లేదా ఏమిటి" },
  whoPh:    { roman: "e.g. Amma's janma tithi", deva: "जैसे — अम्मा की जन्म तिथि", telugu: "ఉదా. అమ్మ జన్మ తిథి" },
  fromDate: { roman: "The date you remember", deva: "जो तारीख़ याद है", telugu: "మీకు గుర్తున్న తేదీ" },
  fromNote: { roman: "The pañcāṅga reads the tithi off it. Adjust below if the family keeps it differently.", deva: "पञ्चाङ्ग उससे तिथि निकालता है। परिवार अलग रखता हो तो नीचे बदलें।", telugu: "పంచాంగం దాని నుండి తిథి తీస్తుంది. కుటుంబం వేరుగా పాటిస్తే కింద మార్చండి." },
  adhika:   { roman: "That date fell in an adhika māsa; the nija month is used.", deva: "वह तारीख़ अधिक मास में थी; निज मास लिया गया।", telugu: "ఆ తేదీ అధిక మాసంలో పడింది; నిజ మాసం తీసుకున్నాం." },
  rule:     { roman: "Kept on", deva: "तिथि", telugu: "తిథి" },
  masa:     { roman: "Māsa", deva: "मास", telugu: "మాసం" },
  paksha:   { roman: "Pakṣa", deva: "पक्ष", telugu: "పక్షం" },
  tithi:    { roman: "Tithi", deva: "तिथि", telugu: "తిథి" },
  remind:   { roman: "Remind me", deva: "याद दिलाएँ", telugu: "గుర్తు చేయి" },
  lead0:    { roman: "On the day", deva: "उसी दिन", telugu: "ఆ రోజే" },
  lead1:    { roman: "A day before", deva: "एक दिन पहले", telugu: "ఒక రోజు ముందు" },
  lead3:    { roman: "3 days before", deva: "3 दिन पहले", telugu: "3 రోజుల ముందు" },
  lead7:    { roman: "A week before", deva: "एक सप्ताह पहले", telugu: "వారం ముందు" },
  next:     { roman: "Next", deva: "अगली", telugu: "తదుపరి" },
  save:     { roman: "Save", deva: "सहेजें", telugu: "భద్రపరచు" },
  del:      { roman: "Remove", deva: "हटाएँ", telugu: "తీసివేయి" },
  cancel:   { roman: "Cancel", deva: "रद्द", telugu: "రద్దు" },
  shraddhaNote: { roman: "A śrāddha follows the tithi at aparāhṇa, so the day can differ from the sunrise tithi by one.", deva: "श्राद्ध अपराह्ण की तिथि से रखा जाता है, इसलिए दिन सूर्योदय-तिथि से एक दिन भिन्न हो सकता है।", telugu: "శ్రాద్ధం అపరాహ్ణ తిథిని అనుసరిస్తుంది, అందుకే రోజు సూర్యోదయ తిథికి ఒకరోజు తేడా రావచ్చు." },
};
const ttT = (k, lang) => (TT[k] || {})[lang === "telugu" ? "telugu" : lang === "deva" ? "deva" : "roman"] || (TT[k] || {}).roman || k;
const ttPick = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.telugu || o.roman) : lang === "deva" ? (o.deva || o.roman) : (o.roman || o.iast));
const ttFont = (lang) => lang === "telugu" ? "var(--font-telugu)" : lang === "roman" ? "var(--font-display)" : "var(--font-deva)";
const ttDateKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function useTithis() { const [, f] = useStateTT(0); useEffectTT(() => window.STUTI_TITHIS.subscribe(() => f((x) => x + 1)), []); return window.STUTI_TITHIS; }

/* ---------------- the sheet ---------------- */
function TithiSheet({ lang = "deva", rec, seedDate, onClose }) {
  const L = window.STUTI_L, T = window.STUTI_TITHIS, P = window.AKSHARA_PANCHANGA;
  const { loc } = window.useLoc();
  const editing = !!(rec && rec.id);
  const seed = useMemoTT(() => {
    if (rec) return rec;
    const d = seedDate || null;
    const r = d ? T.fromDate(d, loc) : { masa: 0, ti: 0 };
    return { name: "", kind: "other", masa: r.masa, ti: r.ti, lead: 1, from: d ? ttDateKey(d) : "" , adhika: r.adhika };
  }, []);
  const [name, setName] = useStateTT(seed.name || "");
  const [kind, setKind] = useStateTT(seed.kind || "other");
  const [from, setFrom] = useStateTT(seed.from || "");
  const [masa, setMasa] = useStateTT(seed.masa);
  const [ti, setTi] = useStateTT(seed.ti);
  const [lead, setLead] = useStateTT(seed.lead == null ? 1 : seed.lead);
  const [adhika, setAdhika] = useStateTT(!!seed.adhika);
  const onDate = (v) => {
    setFrom(v);
    if (!v) return;
    const [y, m, d] = v.split("-").map(Number); if (!y || !m || !d) return;
    try { const r = T.fromDate(new Date(y, m - 1, d), loc); setMasa(r.masa); setTi(r.ti); setAdhika(r.adhika); } catch (e) {}
  };
  const paksha = ti >= 15 ? 1 : 0, tnum = ti % 15;
  const setPaksha = (p) => setTi(p * 15 + tnum);
  const setTnum = (n) => setTi(paksha * 15 + n);
  const rule = T.ruleText({ masa, ti });
  const next = useMemoTT(() => {
    try { const V = window.STUTI_VRATA; return V.nextDate(T.asVrata({ id: "x", name, kind, masa, ti })); } catch (e) { return null; }
  }, [masa, ti, kind]);
  const font = ttFont(lang);
  const save = () => {
    const p = { name: name.trim(), kind, masa, ti, lead, from: from || null };
    if (editing) T.patch(rec.id, p); else T.add(p);
    try { window.kpArmReminders && window.kpArmReminders(); } catch (e) {}
    onClose();
  };
  const del = () => { T.remove(rec.id); onClose(); };
  const tithiOpts = Array.from({ length: 15 }, (_, i) => i);
  return (
    <window.OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet" role="dialog" aria-label={ttT(editing ? "edit" : "add", lang)}>
          <div className="pd-grip" />
          <button className="pd-x" onClick={onClose} aria-label={L.t("close", lang)}><window.Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{ttT("cap", lang)}</div>
            <div className="rm-head-title display" style={{ fontFamily: font }}>{ttT(editing ? "edit" : "add", lang)}</div>
            {!editing && <div className="rm-head-sub">{ttT("lede", lang)}</div>}
          </div>
          <div className="pd-body scroll">
            <div className="fb-kinds">
              {Object.keys(T.KINDS).map((k) => (
                <button key={k} className={"fb-kind" + (kind === k ? " on" : "")} onClick={() => setKind(k)} aria-pressed={kind === k} style={{ fontFamily: font }}>{ttPick(T.KINDS[k].label, lang)}</button>
              ))}
            </div>
            {kind === "shraddha" && <p className="fb-hint">{ttT("shraddhaNote", lang)}</p>}
            <label className="acc-field" style={{ marginTop: 14 }}>
              <span>{ttT("who", lang)}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={ttT("whoPh", lang)} />
            </label>
            <label className="acc-field" style={{ marginTop: 12 }}>
              <span>{ttT("fromDate", lang)}</span>
              <input type="date" value={from} onChange={(e) => onDate(e.target.value)} />
            </label>
            <p className="fb-hint" style={{ margin: "8px 2px 12px" }}>{ttT("fromNote", lang)}{adhika ? " " + ttT("adhika", lang) : ""}</p>
            <div className="tt-rule">
              <div className="eyebrow">{ttT("rule", lang)}</div>
              <div className="tt-rule-v" style={{ fontFamily: font }}>{ttPick(rule, lang)}</div>
              <div className="tt-selects">
                <label><span>{ttT("masa", lang)}</span>
                  <select value={masa} onChange={(e) => setMasa(+e.target.value)} style={{ fontFamily: font }}>{T.MASA_NAMES.map((m, i) => <option key={i} value={i}>{ttPick(m, lang)}</option>)}</select></label>
                <label><span>{ttT("paksha", lang)}</span>
                  <select value={paksha} onChange={(e) => setPaksha(+e.target.value)} style={{ fontFamily: font }}>{T.PAKSHA.map((p, i) => <option key={i} value={i}>{ttPick(p, lang)}</option>)}</select></label>
                <label><span>{ttT("tithi", lang)}</span>
                  <select value={tnum} onChange={(e) => setTnum(+e.target.value)} style={{ fontFamily: font }}>{tithiOpts.map((n) => { const t = T.tithiName(paksha * 15 + n); return <option key={n} value={n}>{ttPick(t, lang)}</option>; })}</select></label>
              </div>
              {next && <div className="tt-next">{ttT("next", lang)} · {next.toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</div>}
            </div>
            <div className="eyebrow" style={{ marginTop: 18 }}>{ttT("remind", lang)}</div>
            <div className="fb-kinds" style={{ marginTop: 8 }}>
              {[0, 1, 3, 7].map((n) => <button key={n} className={"fb-kind" + (lead === n ? " on" : "")} onClick={() => setLead(n)}>{ttT("lead" + n, lang)}</button>)}
            </div>
            <div className="tt-actions">
              {editing && <button className="dana-later" onClick={del}>{ttT("del", lang)}</button>}
              <button className="dana-cta" onClick={save} disabled={!name.trim()}>{ttT("save", lang)}</button>
            </div>
          </div>
        </div>
      </div>
    </window.OverlayPortal>
  );
}

/* ---------------- the list, on the calendar page ---------------- */
function MyTithisCard({ lang = "deva", onJump }) {
  const T = useTithis(), V = window.STUTI_VRATA;
  const [sheet, setSheet] = useStateTT(null);   // null | { rec } | { seedDate }
  const font = ttFont(lang);
  const rows = T.list().map((r) => { const v = T.asVrata(r); let d = null; try { d = V.nextDate(v); } catch (e) {} return { r, v, d, away: d ? V.daysAway(d) : null }; }).sort((a, b) => (a.d || 0) - (b.d || 0));
  return (
    <section className="tt-card">
      <div className="tt-head">
        <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{ttT("cap", lang)}</div>
        <button className="tt-add" onClick={() => setSheet({})}><window.Icon name="plus" size={15} />{ttT("add", lang)}</button>
      </div>
      {rows.length === 0 ? <p className="tt-empty">{ttT("empty", lang)}</p> : (
        <div className="tt-list">
          {rows.map(({ r, v, d, away }) => (
            <button key={r.id} className="tt-row" onClick={() => setSheet({ rec: r })}>
              <span className="tt-row-body">
                <span className="tt-row-name" style={{ fontFamily: font }}>{r.name}</span>
                <span className="tt-row-rule" style={{ fontFamily: font }}>{ttPick(T.KINDS[r.kind].label, lang)} · {ttPick(v.rule, lang)}</span>
              </span>
              {d && <span className="tt-row-date" onClick={(e) => { if (onJump) { e.stopPropagation(); onJump(d); } }}>{d.toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { day: "numeric", month: "short" })}<small>{away === 0 ? window.STUTI_L.t("vrataToday", lang) : away === 1 ? window.STUTI_L.t("vrataTomorrow", lang) : window.STUTI_L.t("vrataInDays", lang).replace("{n}", away)}</small></span>}
            </button>
          ))}
        </div>
      )}
      {sheet && <TithiSheet lang={lang} rec={sheet.rec} seedDate={sheet.seedDate} onClose={() => setSheet(null)} />}
    </section>
  );
}

Object.assign(window, { TithiSheet, MyTithisCard, useTithis, ttT });

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
  noneToday:{ roman: "No tithi today.", deva: "आज कोई तिथि नहीं।", telugu: "ఈ రోజు తిథి లేదు." },
  lede:     { roman: "A janma tithi, an ābdikam, a day the house keeps — the app finds it every year and says so the day before.", deva: "जन्म तिथि, आब्दिक, या घर का कोई दिन — ऐप हर वर्ष उसे ढूँढकर एक दिन पहले बताता है।", telugu: "జన్మ తిథి, ఆబ్దికం, ఇల్లు పాటించే రోజు — యాప్ ప్రతి సంవత్సరం దాన్ని కనుగొని ముందు రోజే చెబుతుంది." },
  empty:    { roman: "No tithis of your own yet.", deva: "अभी आपकी कोई तिथि नहीं।", telugu: "మీ తిథులు ఇంకా లేవు." },
  who:      { roman: "Whose day, or what", deva: "किसका दिन, या क्या — अंग्रेज़ी अक्षरों में", telugu: "ఎవరి రోజు, లేదా ఏమిటి — ఇంగ్లిష్ అక్షరాలలో" },
  whoPh:    { roman: "e.g. amma janma tithi", deva: "जैसे — amma janma tithi", telugu: "ఉదా. amma janma tithi" },
  whoAlso:  { roman: "Written out in Hindi and Telugu too. Correct either one if it is wrong.", deva: "हिन्दी और तेलुगु में भी लिखा गया। कोई ठीक न हो तो सुधार लें।", telugu: "హిందీ, తెలుగులలో కూడా వ్రాయబడింది. సరిగా లేకపోతే సరిదిద్దండి." },
  nmRoman:  { roman: "In English", deva: "अंग्रेज़ी में", telugu: "ఇంగ్లిష్‌లో" },
  nmDeva:   { roman: "In Hindi", deva: "हिन्दी में", telugu: "హిందీలో" },
  nmTel:    { roman: "In Telugu", deva: "तेलुगु में", telugu: "తెలుగులో" },
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
  place:    { roman: "Where it happened", deva: "वह स्थान", telugu: "ఆ ప్రదేశం" },
  placeSearch: { roman: "Search any town", deva: "कोई भी नगर खोजें", telugu: "ఏ ఊరైనా వెతకండి" },
  placeMore: { roman: "Every other place", deva: "अन्य सब स्थान", telugu: "మిగిలిన అన్ని ప్రదేశాలు" },
  placeCustom: { roman: "A village not listed", deva: "सूची में नहीं", telugu: "జాబితాలో లేని ఊరు" },
  placeCustomSub: { roman: "Enter its latitude and longitude", deva: "अक्षांश और देशांतर भरें", telugu: "అక్షాంశం, రేఖాంశం ఇవ్వండి" },
  latLabel: { roman: "Latitude", deva: "अक्षांश", telugu: "అక్షాంశం" },
  lonLabel: { roman: "Longitude", deva: "देशांतर", telugu: "రేఖాంశం" },
  coordNote: { roman: "North and east positive. The zone is taken from the nearest listed city — accurate anywhere the clock is the same.", deva: "उत्तर और पूर्व धनात्मक। समय-क्षेत्र निकटतम सूचीबद्ध नगर से लिया जाता है।", telugu: "ఉత్తరం, తూర్పు ధనాత్మకం. సమయ మండలం దగ్గరి నగరం నుంచి తీసుకుంటాం." },
  placeNone: { roman: "No city by that name.", deva: "उस नाम का कोई शहर नहीं।", telugu: "ఆ పేరుతో నగరం లేదు." },
  atTime:   { roman: "At what hour", deva: "किस समय", telugu: "ఏ సమయంలో" },
  atTimeNote:{ roman: "Śrāddha is named by the tithi running at the moment of death — after nightfall that is often already the next tithi. Leave it blank and the day's sunrise tithi is used.", deva: "श्राद्ध मृत्यु के क्षण की तिथि से निश्चित होता है — रात्रि के बाद वह प्रायः अगली तिथि होती है। रिक्त छोड़ें तो सूर्योदय की तिथि ली जाएगी।", telugu: "మరణ క్షణంలో నడుస్తున్న తిథి ప్రకారం శ్రాద్ధం నిర్ణయమవుతుంది — రాత్రి తర్వాత అది చాలాసార్లు తదుపరి తిథి. ఖాళీగా వదిలితే సూర్యోదయ తిథి తీసుకుంటాం." },
  atTimeBirth: { roman: "At what hour", deva: "किस समय", telugu: "ఏ సమయంలో" },
  atTimeBirthNote: { roman: "If the hour of birth is known, the tithi is read at that moment — a birth late at night can fall under the next tithi. Leave it blank and the day's sunrise tithi is used, which is how most families remember it.", deva: "जन्म का समय ज्ञात हो तो तिथि उसी क्षण से पढ़ी जाती है — देर रात का जन्म अगली तिथि में पड़ सकता है। रिक्त छोड़ें तो सूर्योदय की तिथि ली जाएगी, जैसे प्रायः स्मरण रहती है।", telugu: "జన్మ సమయం తెలిస్తే ఆ క్షణపు తిథి తీసుకుంటాం — అర్ధరాత్రి జన్మ తదుపరి తిథిలో పడవచ్చు. ఖాళీగా వదిలితే సూర్యోదయ తిథి — చాలా కుటుంబాలు గుర్తుంచుకునే విధంగా." },
  noticeHead: { roman: "Early notice", deva: "पूर्व सूचना", telugu: "ముందస్తు సూచన" },
  noticeOff: { roman: "None", deva: "नहीं", telugu: "వద్దు" },
  noticeN: { roman: "{n} days before", deva: "{n} दिन पहले", telugu: "{n} రోజుల ముందు" },
  noticeNote: { roman: "One quiet notice this far out, and the day-before reminder above. A śrāddha needs the week: a priest to reach, samagri to gather, leave to take.", deva: "इतने दिन पहले एक शान्त सूचना, और ऊपर वाली एक दिन पहले की। श्राद्ध के लिए पूरा सप्ताह चाहिए — पुरोहित, सामग्री, अवकाश।", telugu: "ఇన్ని రోజుల ముందు ఒక్క సూచన, పైన ఒకరోజు ముందు ఒకటి. శ్రాద్ధానికి వారం కావాలి — పురోహితుడు, సామగ్రి, సెలవు." },
  optional: { roman: "optional", deva: "वैकल्पिक", telugu: "ఐచ్ఛికం" },
  hh:       { roman: "Hour", deva: "घंटा", telugu: "గంట" },
  mm:       { roman: "Minute", deva: "मिनट", telugu: "నిమిషం" },
  placeNote:{ roman: "The tithi is read at that place's sunrise — a birth abroad can fall on a different tithi than it would here.", deva: "तिथि उसी स्थान के सूर्योदय से पढ़ी जाती है — विदेश में जन्म यहाँ की तिथि से भिन्न हो सकता है।", telugu: "ఆ ప్రదేశపు సూర్యోదయం ప్రకారం తిథి లెక్కిస్తాం — విదేశంలో జన్మించితే ఇక్కడి తిథికి తేడా రావచ్చు." },
  shraddhaNote: { roman: "A śrāddha follows the tithi at aparāhṇa, so the day can differ from the sunrise tithi by one.", deva: "श्राद्ध अपराह्ण की तिथि से रखा जाता है, इसलिए दिन सूर्योदय-तिथि से एक दिन भिन्न हो सकता है।", telugu: "శ్రాద్ధం అపరాహ్ణ తిథిని అనుసరిస్తుంది, అందుకే రోజు సూర్యోదయ తిథికి ఒకరోజు తేడా రావచ్చు." },
};
const ttT = (k, lang) => (TT[k] || {})[lang === "telugu" ? "telugu" : lang === "deva" ? "deva" : "roman"] || (TT[k] || {}).roman || k;
const ttPick = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.telugu || o.roman) : lang === "deva" ? (o.deva || o.roman) : (o.roman || o.iast));
const ttFont = (lang) => lang === "telugu" ? "var(--font-telugu)" : lang === "roman" ? "var(--font-display)" : "var(--font-deva)";
const ttDateKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function useTithis() { const [, f] = useStateTT(0); useEffectTT(() => window.STUTI_TITHIS.subscribe(() => f((x) => x + 1)), []); return window.STUTI_TITHIS; }

/* a searchable place field — two hundred-odd cities are a list to type into,
   not one to scroll */
function PlaceField({ locs, value, onChange, onPick, customLabel, lang }) {
  const [q, setQ] = useStateTT("");
  const [open, setOpen] = useStateTT(false);
  const cur = locs.find((c) => c.id === value);
  const label = value === "custom" ? (customLabel || ttT("placeCustom", lang)) : cur ? cur.city + (cur.region ? " · " + cur.region : "") : "";
  /* nobody types Telaṅgāṇa with its ṅ and ṇ: match on folded letters */
  const fold = (x) => (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const needle = fold(q.trim());
  const hits = !needle ? locs.slice(0, 40)
    : locs.filter((c) => fold(c.city + " " + (c.region || "") + " " + (c.alt || "")).includes(needle)).slice(0, 40);
  /* the same long tail the pañcāṅga's chip searches — a śrāddha is remembered
     at the village it happened in, which the curated list does not hold */
  const [tail, setTail] = useStateTT([]);
  React.useEffect(() => {
    const GZ = window.STUTI_GAZ;
    if (!GZ || !open || needle.length < 3) { setTail([]); return; }
    let live = true;
    const t = setTimeout(() => { GZ.search(q, 20).then((rows) => { if (live) setTail(rows); }); }, 140);
    return () => { live = false; clearTimeout(t); };
  }, [needle, open]);
  const close = () => { setOpen(false); setQ(""); };
  return (
    <div className="tt-placewrap">
      <button type="button" className="tt-place" onClick={() => { setQ(""); setOpen(true); }}>
        <span>{label}</span><window.Icon name="search" size={15} />
      </button>
      {open && (
        <React.Fragment>
          <div className="tt-placescrim" onClick={close} />
          <div className="tt-placebox tt-placebox-float">
            <div className="tt-placesearch">
              <window.Icon name="search" size={15} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={ttT("placeSearch", lang)} spellCheck="false" />
            </div>
            <div className="tt-placelist">
              <button type="button" className="tt-placerow tt-placecustom" onClick={() => { onChange("custom"); close(); }}>
                <span>{ttT("placeCustom", lang)}</span><small>{ttT("placeCustomSub", lang)}</small>
              </button>
              {hits.map((c) => (
                <button type="button" key={c.id} className={"tt-placerow" + (c.id === value ? " on" : "")}
                  onClick={() => { onChange(c.id); close(); }}>
                  <span>{c.city}</span><small>{c.region}</small>
                </button>
              ))}
              {tail.length > 0 && <div className="tt-placecap">{ttT("placeMore", lang)}</div>}
              {tail.map((p) => (
                <button type="button" key={p.city + p.lat + p.lon} className="tt-placerow"
                  onClick={() => { if (onPick) onPick(p); close(); }}>
                  <span>{p.city}</span><small>{p.region}</small>
                </button>
              ))}
              {!hits.length && !tail.length && <div className="tt-placenone">{ttT("placeNone", lang)}</div>}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/* hour and minute, in the app's own chrome — a native time input paints itself
   in system blue and offers seconds nobody remembers */
function ClockField({ value, onChange, lang }) {
  /* "--" on either select is a clearing, not a zero: Number("") is 0, which
     would read the tithi at local midnight — a real instant, and the wrong one */
  const set = (h, m) => onChange(h === "" || m === "" ? "" : String(Number(h) * 60 + Number(m)));
  const cur = value === "" || value == null ? null : Number(value);
  const h = cur == null ? "" : Math.floor(cur / 60), m = cur == null ? "" : cur % 60;
  return (
    <div className="tt-clock">
      <select value={h} onChange={(e) => set(e.target.value, m === "" ? 0 : m)} aria-label={ttT("hh", lang)}>
        <option value="">--</option>
        {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}</option>)}
      </select>
      <span>:</span>
      <select value={m} onChange={(e) => set(h === "" ? 0 : h, e.target.value)} aria-label={ttT("mm", lang)}>
        <option value="">--</option>
        {Array.from({ length: 60 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}</option>)}
      </select>
      {cur != null && <button type="button" className="tt-clock-clear" onClick={() => onChange("")}><window.Icon name="close" size={14} /></button>}
    </div>
  );
}

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
  /* One name per script, from one typing. Nearly every keyboard here is an
     English one, so the name is typed in English letters and spelt into
     Devanāgarī and Telugu as it is typed. Either script form can be
     corrected by hand, and a corrected one is then left alone. */
  const seedNames = (seed.names || { roman: seed.name || "", deva: "", tel: "" });
  const ttSpell = (r, k) => {
    const TR = window.STUTI_TRANSLIT; const s = (r || "").trim();
    if (!TR || !s) return "";
    const d = TR.romanToDeva(s);
    return k === "tel" ? TR.convert(d, "telugu") : d;
  };
  /* a record written before the script fields existed opens with them filled
     from its English spelling — the same forms the screens already show */
  const [nm, setNm] = useStateTT({
    roman: seedNames.roman || "",
    deva: (seedNames.deva || "").trim() || ttSpell(seedNames.roman, "deva"),
    tel: (seedNames.tel || "").trim() || ttSpell(seedNames.roman, "tel"),
  });
  const [nmOwn, setNmOwn] = useStateTT({ deva: !!(seedNames.deva || "").trim(), tel: !!(seedNames.tel || "").trim() });
  const onNmRoman = (v) => setNm((o) => Object.assign({}, o, { roman: v },
    nmOwn.deva ? {} : { deva: ttSpell(v, "deva") }, nmOwn.tel ? {} : { tel: ttSpell(v, "tel") }));
  const setNmK = (k, v) => { if (k === "roman") return onNmRoman(v); setNmOwn((o) => Object.assign({}, o, { [k]: !!v.trim() })); setNm((o) => Object.assign({}, o, { [k]: v })); };
  const NM_LABEL = { roman: "nmRoman", deva: "nmDeva", tel: "nmTel" };
  const NM_FONT = { roman: "var(--font-ui)", deva: "var(--font-deva)", tel: "var(--font-telugu)" };
  const [kind, setKind] = useStateTT(seed.kind || "other");
  const [from, setFrom] = useStateTT(seed.from || "");
  const [masa, setMasa] = useStateTT(seed.masa);
  const [ti, setTi] = useStateTT(seed.ti);
  const [lead, setLead] = useStateTT(seed.lead == null ? 1 : seed.lead);
  const [notice, setNotice] = useStateTT(seed.notice == null ? T.KINDS[seed.kind || "other"].notice : seed.notice);
  const [adhika, setAdhika] = useStateTT(!!seed.adhika);
  /* the tithi is a fact of a place as much as of a date; and for a śrāddha,
     of an hour too — it is the tithi running at the moment of death */
  const LOCS = (window.AKSHARA_PANCHANGA && window.AKSHARA_PANCHANGA.locations) || [];
  const [placeId, setPlaceId] = useStateTT(seed.place || (loc && loc.id) || (LOCS[0] && LOCS[0].id));
  const [coord, setCoord] = useStateTT(seed.coord || null);
  /* a village of four hundred houses is in no gazetteer; its own latitude and
     longitude are, and the clock it keeps is the nearest listed city's */
  const placeOf = (id, cd) => {
    if (id === "custom") {
      const c = cd === undefined ? coord : cd;
      if (!c || c.lat === "" || c.lon === "") return loc;
      const P = window.AKSHARA_PANCHANGA;
      const near = P.nearest ? P.nearest(Number(c.lat), Number(c.lon)) : loc;
      /* a place chosen from the gazetteer brings its own zone; a hand-typed
         lat/lon borrows the nearest listed city's clock */
      return { id: "custom", city: c.city || ttT("placeCustom", lang), region: c.region || "",
        lat: Number(c.lat), lon: Number(c.lon),
        tz: c.tz != null ? c.tz : near ? near.tz : 5.5,
        zone: c.zone || (near ? near.zone : "Asia/Kolkata") };
    }
    return LOCS.find((c) => c.id === id) || loc;
  };
  const [time, setTime] = useStateTT(seed.time == null ? "" : seed.time);
  const readTithi = (v, pid, tm, kd, cd) => {
    if (!v) return;
    const [y, m, d] = v.split("-").map(Number); if (!y || !m || !d) return;
    /* an hour, whenever it is known, beats the sunrise reading — a birth at
        eleven at night falls under the tithi running then, not the day's */
    const mins = (tm !== "" && tm != null) ? Number(tm) : null;
    try { const r = T.fromDate(new Date(y, m - 1, d), placeOf(pid, cd), mins); setMasa(r.masa); setTi(r.ti); setAdhika(r.adhika); } catch (e) {}
  };
  const onDate = (v) => { setFrom(v); readTithi(v, placeId, time, kind); };
  const onPlace = (id) => { setPlaceId(id); readTithi(from, id, time, kind, coord); };
  /* a gazetteer pick is stored as a custom place — the record already carries
     a lat/lon for those, so nothing new needs persisting */
  const onPickPlace = (p) => {
    const c = { lat: p.lat, lon: p.lon, city: p.city, region: p.region, tz: p.tz, zone: p.zone };
    setCoord(c); setPlaceId("custom"); readTithi(from, "custom", time, kind, c);
  };
  const onCoord = (k, v) => { const c = Object.assign({ lat: "", lon: "" }, coord, { [k]: v }); setCoord(c); readTithi(from, "custom", time, kind, c); };
  const onTime = (v) => { setTime(v); readTithi(from, placeId, v, kind); };
  /* switching kind re-sets the notice to that kind's own default, unless the
     reciter has already chosen one for this record */
  const onKind = (k) => { setKind(k); if (!editing) setNotice(T.KINDS[k].notice); readTithi(from, placeId, time, k); };
  const paksha = ti >= 15 ? 1 : 0, tnum = ti % 15;
  const setPaksha = (p) => setTi(p * 15 + tnum);
  const setTnum = (n) => setTi(paksha * 15 + n);
  const rule = T.ruleText({ masa, ti });
  const next = useMemoTT(() => {
    try { const V = window.STUTI_VRATA; return V.nextDate(T.asVrata({ id: "x", name, kind, masa, ti })); } catch (e) { return null; }
  }, [masa, ti, kind]);
  const font = ttFont(lang);
  const save = () => {
    const names = { roman: nm.roman.trim(), deva: nm.deva.trim(), tel: nm.tel.trim() };
    const p = { name: names.roman || names.tel || names.deva, names, kind, masa, ti, lead, notice, from: from || null, place: placeId || null, coord: placeId === "custom" ? coord : null, time: time !== "" && time != null ? Number(time) : null };
    if (editing) T.patch(rec.id, p); else T.add(p);
    try { window.kpArmReminders && window.kpArmReminders(); } catch (e) {}
    onClose();
  };
  const del = () => { T.remove(rec.id); onClose(); };
  /* Amāvāsyā and Pūrṇimā are not tithis inside a pakṣa — they close one.
     Naming a pakṣa beside them reads as a question with no answer, so the
     field steps aside once the fifteenth is chosen, and the pakṣa is set by
     the tithi itself: kṛṣṇa for amāvāsyā, śukla for pūrṇimā. */
  const solo = tnum === 14;
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
                <button key={k} className={"fb-kind" + (kind === k ? " on" : "")} onClick={() => onKind(k)} aria-pressed={kind === k} style={{ fontFamily: font }}>{ttPick(T.KINDS[k].label, lang)}</button>
              ))}
            </div>
            {kind === "shraddha" && <p className="fb-hint">{ttT("shraddhaNote", lang)}</p>}
            <label className="acc-field" style={{ marginTop: 14 }}>
              <span>{ttT("who", lang)}</span>
              <input value={nm.roman} onChange={(e) => setNmK("roman", e.target.value)} placeholder={ttT("whoPh", lang)} />
            </label>
            <p className="fb-hint" style={{ margin: "10px 2px 0" }}>{ttT("whoAlso", lang)}</p>
            {["deva", "tel"].map((k) => (
              <label className="acc-field" key={k} style={{ marginTop: 8 }}>
                <span>{ttT(NM_LABEL[k], lang)}</span>
                <input value={nm[k]} onChange={(e) => setNmK(k, e.target.value)} style={{ fontFamily: NM_FONT[k] }}
                  onBlur={() => { const TR = window.STUTI_TRANSLIT, v = nm[k]; if (!TR || !v || !/[\u0900-\u097F\u0C00-\u0C7F]/.test(v)) return; const d = TR.toDeva(v); const w = k === "tel" ? TR.convert(d, "telugu") : d; if (w !== v) setNmK(k, w); }} />
              </label>
            ))}
            {/* date and place are one question — the day, and where it was kept */}
            <div className="tt-row">
              <label className="acc-field">
                <span>{ttT("fromDate", lang)}</span>
                {/* the app's own picker: the browser's paints itself in system blue over the parchment */}
                <window.DayPick value={from} lang={lang} onChange={onDate} label={ttT("fromDate", lang)} place="down" />
              </label>
              <label className="acc-field">
                <span>{ttT("place", lang)}</span>
                <window.PlaceField locs={LOCS} value={placeId} onChange={onPlace} onPick={onPickPlace}
                  customLabel={coord && coord.city ? coord.city + (coord.region ? " · " + coord.region : "") : null} lang={lang} />
              </label>
            </div>
            {placeId === "custom" && (
              <>
                <div className="tt-row">
                  <label className="acc-field"><span>{ttT("latLabel", lang)}</span>
                    <input type="number" step="0.01" inputMode="decimal" value={coord ? coord.lat : ""} onChange={(e) => onCoord("lat", e.target.value)} placeholder="19.06" />
                  </label>
                  <label className="acc-field"><span>{ttT("lonLabel", lang)}</span>
                    <input type="number" step="0.01" inputMode="decimal" value={coord ? coord.lon : ""} onChange={(e) => onCoord("lon", e.target.value)} placeholder="79.49" />
                  </label>
                </div>
                <p className="fb-hint" style={{ margin: "8px 2px 0" }}>{ttT("coordNote", lang)}</p>
              </>
            )}
            <p className="fb-hint" style={{ margin: "8px 2px 0" }}>{ttT("placeNote", lang)}</p>
            {kind !== "other" && (
              <>
                <label className="acc-field" style={{ marginTop: 12 }}>
                  <span>{ttT(kind === "janma" ? "atTimeBirth" : "atTime", lang)}<small>{ttT("optional", lang)}</small></span>
                  <window.ClockField value={time} onChange={onTime} lang={lang} />
                </label>
                <p className="fb-hint" style={{ margin: "8px 2px 0" }}>{ttT(kind === "janma" ? "atTimeBirthNote" : "atTimeNote", lang)}</p>
              </>
            )}
            <p className="fb-hint" style={{ margin: "8px 2px 12px" }}>{ttT("fromNote", lang)}{adhika ? " " + ttT("adhika", lang) : ""}</p>
            <div className="tt-rule">
              <div className="eyebrow">{ttT("rule", lang)}</div>
              <div className="tt-rule-v" style={{ fontFamily: font }}>{ttPick(rule, lang)}</div>
              <div className={"tt-selects" + (solo ? " is-solo" : "")}>
                <label><span>{ttT("masa", lang)}</span>
                  <select value={masa} onChange={(e) => setMasa(+e.target.value)} style={{ fontFamily: font }}>{T.MASA_NAMES.map((m, i) => <option key={i} value={i}>{ttPick(m, lang)}</option>)}</select></label>
                {!solo && (
                  <label><span>{ttT("paksha", lang)}</span>
                    <select value={paksha} onChange={(e) => setPaksha(+e.target.value)} style={{ fontFamily: font }}>{T.PAKSHA.map((p, i) => <option key={i} value={i}>{ttPick(p, lang)}</option>)}</select></label>
                )}
                <label><span>{ttT("tithi", lang)}</span>
                  {/* the fifteenth is two different days depending on the fortnight, so
                     both stand in the list by name — with the pakṣa field gone, this is
                     the only place they can be told apart */}
                  <select value={ti} onChange={(e) => setTi(+e.target.value)} style={{ fontFamily: font }}>
                    {Array.from({ length: 14 }, (_, n) => paksha * 15 + n).map((x) => <option key={x} value={x}>{ttPick(T.tithiName(x), lang)}</option>)}
                    <option value={14}>{ttPick(T.tithiName(14), lang)}</option>
                    <option value={29}>{ttPick(T.tithiName(29), lang)}</option>
                  </select></label>
              </div>
              {next && <div className="tt-next">{ttT("next", lang)} · {next.toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</div>}
            </div>
            <div className="eyebrow" style={{ marginTop: 18 }}>{ttT("remind", lang)}</div>
            <div className="fb-kinds" style={{ marginTop: 8 }}>
              {[0, 1, 3, 7].map((n) => <button key={n} className={"fb-kind" + (lead === n ? " on" : "")} onClick={() => setLead(n)}>{ttT("lead" + n, lang)}</button>)}
            </div>
            {/* the far warning — the one that leaves time to arrange a week */}
            <div className="eyebrow" style={{ marginTop: 16 }}>{ttT("noticeHead", lang)}</div>
            <div className="fb-kinds" style={{ marginTop: 8 }}>
              {[0, 3, 7, 14].map((n) => <button key={n} className={"fb-kind" + (notice === n ? " on" : "")} onClick={() => setNotice(n)}>{n === 0 ? ttT("noticeOff", lang) : ttT("noticeN", lang).replace("{n}", n)}</button>)}
            </div>
            <p className="fb-hint" style={{ margin: "8px 2px 0" }}>{ttT("noticeNote", lang)}</p>
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
                <span className="tt-row-name" style={{ fontFamily: font }}>{T.nameIn(r, lang)}</span>
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

Object.assign(window, { PlaceField, ClockField, TithiSheet, MyTithisCard, useTithis, ttT });

/* ============================================================
   STUTI — what kind of day, and on whose word
   One table for every observance in the app: its primary type, the
   grade of the evidence behind it, and how far it may be published.
   The vocabularies follow the Master Vrata and Parva Reference
   (September 2026). Records keep their bodies; this file only labels
   them, so the whole inventory can be audited in one place.

   type    vratam · parva · jayanti · puja · seasonal · cycle · diksha ·
           parayana · regional      (one primary; `tags` carry the rest)
   grade   A primary śāstra with passage · B classical nibandha ·
           C sampradāya or temple publication · D regional vrata or nomu
           book, or a traceable living lineage · E contemporary booklet
           or modern movement · Q awaiting verification
   status  verified · partial · living · modern · backlog
   ============================================================ */
window.STUTI_PROV = (function () {
  const TYPES = {
    vratam:   { roman: "Vratam",          deva: "व्रतम्",            tel: "వ్రతం" },
    parva:    { roman: "Parva dinam",     deva: "पर्व दिनम्",        tel: "పర్వ దినం" },
    jayanti:  { roman: "Jayantī",         deva: "जयन्ती",            tel: "జయంతి" },
    puja:     { roman: "Pūjā dinam",      deva: "पूजा दिनम्",        tel: "పూజా దినం" },
    seasonal: { roman: "Seasonal observance", deva: "ऋतु-पालन",      tel: "కాలానుగత ఆచరణ" },
    cycle:    { roman: "Fixed-count vow", deva: "संख्या-व्रतम्",     tel: "సంఖ్యా వ్రతం" },
    diksha:   { roman: "Dīkṣā",           deva: "दीक्षा",            tel: "దీక్ష" },
    parayana: { roman: "Pārāyaṇa",        deva: "पारायणम्",          tel: "పారాయణం" },
    regional: { roman: "Regional tradition", deva: "प्रादेशिक परम्परा", tel: "ప్రాంతీయ సంప్రదాయం" },
    tarpana:  { roman: "Tarpaṇam",        deva: "तर्पणम्",           tel: "తర్పణం" },
  };
  /* what the reader is told, in one plain line, by status */
  const STATUS = {
    verified: { roman: "Checked against a named text.",
                deva: "नामित ग्रन्थ से मिलाया गया है।",
                tel: "పేరున్న గ్రంథంతో సరిచూశారు." },
    partial:  { roman: "The date is checked. The procedure follows household practice.",
                deva: "तिथि मिलाई गई है। विधि घर की रीति से है।",
                tel: "తేదీ సరిచూశారు. విధి ఇంటి ఆచారం ప్రకారం." },
    living:   { roman: "Regional practice. Not a rule from śāstra.",
                deva: "प्रादेशिक रीति। शास्त्र का नियम नहीं।",
                tel: "ప్రాంతీయ ఆచారం. శాస్త్ర నియమం కాదు." },
    modern:   { roman: "A recent devotional practice.",
                deva: "आधुनिक भक्ति-परम्परा।",
                tel: "ఇటీవలి భక్తి సంప్రదాయం." },
    backlog:  { roman: "The date is marked. The procedure is not yet written.",
                deva: "तिथि अंकित है। विधि अभी नहीं लिखी गई।",
                tel: "తేదీ గుర్తు పెట్టారు. విధి ఇంకా వ్రాయలేదు." },
  };
  const GRADES = {
    A: { roman: "Primary śāstra", deva: "मूल शास्त्र", tel: "మూల శాస్త్రం" },
    B: { roman: "Classical nibandha", deva: "निबन्ध ग्रन्थ", tel: "నిబంధ గ్రంథం" },
    C: { roman: "Sampradāya publication", deva: "सम्प्रदाय प्रकाशन", tel: "సంప్రదాయ ప్రకాశన" },
    D: { roman: "Regional tradition", deva: "प्रादेशिक परम्परा", tel: "ప్రాంతీయ సంప్రదాయం" },
    E: { roman: "Contemporary practice", deva: "समकालीन रीति", tel: "సమకాలీన ఆచారం" },
    Q: { roman: "Awaiting verification", deva: "सत्यापन शेष", tel: "సరిచూడవలసి ఉంది" },
  };

  /* [type, grade, status, tags?, region?] — one row per record id */
  const V = (t, g, s, tags, region) => ({ type: t, grade: g, status: s, tags: tags || [], region: region || null });
  const TE = "Telugu regions", SI = "South India", PAN = "Pan-Indian", NI = "North India";
  const rows = {
    /* ---- stuti-vrata-data.js ---- */
    "ganesha-chaturthi": V("vratam", "B", "partial", ["parva"], PAN),
    "varalakshmi":       V("vratam", "D", "partial", ["puja"], SI),
    "satyanarayana":     V("vratam", "A", "verified", [], PAN),
    "navaratri":         V("seasonal", "B", "partial", ["vratam", "parva"], PAN),
    "mangala-gauri":     V("vratam", "D", "partial", ["cycle"], SI),
    "naga-panchami":     V("vratam", "D", "living", ["parva"], TE),
    "shitala-saptami":   V("vratam", "D", "living", [], TE),
    "shravana-ravivaram": V("vratam", "D", "living", ["cycle"], TE),
    "shravana-somavaram": V("vratam", "D", "living", ["cycle"], SI),
    "vata-savitri":      V("vratam", "A", "verified", [], PAN),
    "shivaratri":        V("vratam", "B", "partial", ["parva"], PAN),
    "ekadashi":          V("vratam", "B", "partial", [], PAN),
    "pradosha":          V("vratam", "B", "partial", [], PAN),
    "dipavali":          V("parva", "B", "partial", ["puja"], PAN),
    "rama-navami":       V("jayanti", "B", "partial", ["parva"], PAN),
    "janmashtami":       V("vratam", "B", "partial", ["jayanti", "parva"], PAN),
    "hanuman-jayanti":   V("jayanti", "C", "partial", [], PAN),
    "guru-purnima":      V("parva", "B", "partial", ["puja"], PAN),
    "ratha-saptami":     V("parva", "B", "partial", ["jayanti"], PAN),
    "ugadi":             V("parva", "B", "partial", [], TE),
    "skanda-shashti":    V("vratam", "C", "partial", ["parva"], SI),
    "nrsimha-jayanti":   V("jayanti", "B", "partial", [], PAN),
    "lalita-jayanti":    V("jayanti", "C", "partial", [], SI),
    "sita-navami":       V("jayanti", "Q", "backlog", [], NI),
    "parashurama-jayanti": V("jayanti", "B", "partial", [], PAN),
    "vamana-jayanti":    V("jayanti", "B", "partial", [], PAN),
    "radha-ashtami":     V("jayanti", "C", "partial", [], NI),
    "shankara-jayanti":  V("jayanti", "C", "partial", [], PAN),
    "dattatreya-jayanti": V("jayanti", "C", "partial", [], PAN),
    "hayagriva-jayanti": V("jayanti", "C", "partial", [], SI),
    "vasanta-panchami":  V("parva", "B", "partial", ["puja"], PAN),
    "vasanta-navaratri": V("seasonal", "B", "partial", ["vratam"], PAN),
    "shyamala-navaratri": V("seasonal", "C", "partial", ["vratam"], SI),
    "varahi-navaratri":  V("seasonal", "C", "partial", ["vratam"], SI),
    /* ---- stuti-parva-data.js ---- */
    "holi":              V("parva", "B", "partial", [], NI),
    "kartika-purnima":   V("parva", "B", "partial", ["puja"], PAN),
    "kartika-somavaram": V("vratam", "D", "living", ["cycle"], SI),
    "shravana-shukravaram": V("vratam", "D", "living", ["cycle"], SI),
    "bonalu":            V("regional", "D", "living", ["parva"], "Telangana"),
    "ananta-caturdashi": V("vratam", "B", "partial", ["parva"], PAN),
    "mahalaya-amavasya": V("parva", "A", "partial", ["tarpana"], PAN),
    "polala-amavasya":   V("vratam", "D", "living", ["regional"], TE),
    "atla-taddi":        V("vratam", "D", "living", ["regional"], TE),
    "karva-chauth":      V("vratam", "D", "living", [], NI),
    "tulasi-vivaha":     V("parva", "C", "partial", ["puja"], PAN),
    "subrahmanya-shashti": V("parva", "D", "living", ["puja"], TE),
    "vaikuntha-ekadashi": V("vratam", "C", "partial", ["parva"], SI),
    "bhishma-ekadashi":  V("vratam", "B", "partial", ["parva"], PAN),
    "nirjala-ekadashi":  V("vratam", "B", "partial", [], PAN),
    "ganga-dashahara":   V("parva", "B", "partial", [], NI),
    "ratha-yatra":       V("parva", "C", "partial", [], "Odisha"),
    "dhanurmasa":        V("seasonal", "C", "partial", ["puja"], SI),
    "pitru-paksha":      V("seasonal", "A", "partial", ["tarpana"], PAN),
    "upakarma":          V("parva", "A", "partial", [], PAN),
    "vijayadashami":     V("parva", "B", "partial", [], PAN),
    /* ---- stuti-sankranti-data.js ---- */
    "makara-sankranti":  V("parva", "B", "partial", ["seasonal"], PAN),
    "mesha-sankranti":   V("parva", "B", "partial", [], PAN),
    "karka-sankranti":   V("parva", "B", "partial", [], PAN),
    "kanya-sankranti":   V("parva", "B", "partial", [], PAN),
    "tula-sankranti":    V("parva", "B", "partial", [], SI),
    "dhanu-sankranti":   V("seasonal", "C", "partial", [], SI),
    /* ---- stuti-cycle-data.js ---- */
    "sapta-shanivara":   V("cycle", "D", "living", ["vratam"], TE),
    "ekadasha-somavara": V("cycle", "D", "living", ["vratam"], SI),
    "shodasha-somavara": V("cycle", "D", "living", ["vratam"], PAN),
    "vaibhava-lakshmi":  V("cycle", "E", "modern", ["vratam"], PAN),
    "mangala-gauri-5":   V("cycle", "D", "living", ["vratam"], SI),
    "ananta-padmanabha-14": V("cycle", "B", "partial", ["vratam"], PAN),
    "kartika-dipa-damodara": V("seasonal", "C", "partial", ["puja"], PAN),
    /* ---- stuti-diksha-data.js ---- */
    "ayyappa-mandala":   V("diksha", "C", "living", [], SI),
    "bhavani-diksha":    V("diksha", "C", "living", [], TE),
    "kedara-gauri-diksha": V("diksha", "D", "living", ["vratam"], SI),
    "hanuman-diksha":    V("diksha", "D", "living", [], TE),
    "govinda-mala":      V("diksha", "C", "living", [], TE),
    /* ---- stuti-masa-data.js ---- */
    "chaturmasya":       V("seasonal", "B", "partial", ["vratam"], PAN),
  };
  /* a few nomus rest on a text; the rest are a living Telugu tradition
     read from the household nomu books, and are graded D as one body */
  const nomuRows = {
    "varalakshmi-vratam":     V("vratam", "D", "partial", ["regional"], SI),
    "mangala-gauri-vratam":   V("vratam", "D", "partial", ["cycle", "regional"], SI),
    "kartika-somavara-vratam": V("vratam", "D", "living", ["cycle", "regional"], SI),
    "kedareswara-vratam":     V("vratam", "D", "partial", ["regional"], SI),
    "ksheerabdhi-sayana-vratam": V("vratam", "C", "partial", ["regional"], SI),
    "gauri-vratam":           V("vratam", "D", "living", ["regional"], TE),
  };
  const NOMU_DEFAULT = V("vratam", "D", "living", ["regional"], TE);
  /* ids that arrive from other joins carry a type by prefix */
  const byPrefix = (rec) => {
    const id = rec.id;
    if (rec.kind === "tarpana" || /tarpan|grahana/.test(id)) return V("tarpana", "A", "partial", [], PAN);
    if (/-janma$|graha-/.test(id)) return V("puja", "C", "partial", [], PAN);
    if (/sankranti|sankramana/.test(id)) return V("parva", "B", "partial", [], PAN);
    /* a record the source already calls a vratam stays one, whatever the table says */
    if (rec.kind === "vratam") return V("vratam", "Q", "partial", [], null);
    return null;
  };

  const of = (rec, isNomu) => (isNomu ? (nomuRows[rec.id] || NOMU_DEFAULT) : (rows[rec.id] || byPrefix(rec) || V("parva", "Q", "backlog", [], null)));

  /* stamp a record in place; existing fields win, so a record that already
     names its own type or grade is not overwritten */
  function stamp(rec, isNomu) {
    if (!rec || !rec.id || rec.prov) return rec;
    const p = of(rec, isNomu);
    /* the two lens flags must agree: a source-marked vratam is typed vratam */
    if (rec.kind === "vratam" && p.type !== "vratam" && p.type !== "cycle" && p.type !== "diksha") { p.tags = [p.type].concat(p.tags); p.type = "vratam"; }
    rec.prov = p;
    if (!rec.type) rec.type = p.type;
    /* the older boolean lens flag, kept in step so nothing reading it breaks */
    if (rec.kind === undefined && (p.type === "vratam" || p.type === "cycle" || p.type === "diksha")) rec.kind = "vratam";
    return rec;
  }

  /* the one line a detail page shows: status sentence, then the grade name */
  const pick = (o, lang) => (lang === "telugu" ? o.tel : lang === "deva" ? o.deva : o.roman);
  function line(rec, lang) {
    const p = rec && rec.prov; if (!p) return "";
    const stop = lang === "deva" ? "।" : ".";
    return pick(STATUS[p.status] || STATUS.backlog, lang) + " " + pick(GRADES[p.grade] || GRADES.Q, lang) + stop;
  }
  const typeName = (rec, lang) => { const t = rec && TYPES[rec.type || (rec.prov && rec.prov.type)]; return t ? pick(t, lang) : ""; };
  const isType = (rec, ...ts) => { const t = rec.type || (rec.prov && rec.prov.type); return ts.indexOf(t) !== -1; };

  return { TYPES, STATUS, GRADES, rows, nomuRows, of, stamp, line, typeName, isType };
})();

/* ============================================================
   STUTI — the navagraha janma dinams
   Nine birth-days: for each graha the gotra ṛṣi, the month, the tithi,
   the weekday, the nakṣatra and the saṁvatsara of the birth, in the
   order the navagraha ārādhana names them. Read on the Navagraha shelf;
   the tithi of each joins the vrata list so the calendar marks it and
   a bell can be kept on it.
   ============================================================ */
export const STUTI_GRAHA_JANMA = (function () {
  const MASA = { caitra: 0, vaisakha: 1, jyeshtha: 2, ashadha: 3, shravana: 4, bhadrapada: 5, ashvina: 6, kartika: 7, margashirsha: 8, pausha: 9, magha: 10, phalguna: 11 };
  /* tithi index across the lunar month: śukla n → n-1, pūrṇimā 14, kṛṣṇa n → 14+n */
  const rows = [
    { id: "ravi",    form: "navagraha",
      graha: { roman: "Ravi",   deva: "रवि",   tel: "రవి" },
      rishi: { roman: "Kaśyapa",    deva: "कश्यप",     tel: "కశ్యప" },
      masa: MASA.magha, ti: 6,
      tithi: { roman: "Māgha · Śukla Saptamī", deva: "माघ शुक्ल सप्तमी", tel: "మాఘ శుక్ల సప్తమి" },
      vara:  { roman: "Sunday",    deva: "रविवार",     tel: "ఆదివారం" },
      naks:  { roman: "Aśvinī",    deva: "अश्विनी",    tel: "అశ్విని" },
      samv:  { roman: "Prabhava",  deva: "प्रभव",      tel: "ప్రభవ" } },
    { id: "shani",   form: "shani",
      graha: { roman: "Śani",   deva: "शनि",   tel: "శని" },
      rishi: { roman: "Kaśyapa",    deva: "कश्यप",     tel: "కశ్యప" },
      masa: MASA.pausha, ti: 8,
      tithi: { roman: "Puṣya · Śukla Navamī", deva: "पुष्य शुक्ल नवमी", tel: "పుష్య శుక్ల నవమి" },
      vara:  { roman: "Saturday",  deva: "शनिवार",     tel: "శనివారం" },
      naks:  { roman: "Bharaṇī",   deva: "भरणी",       tel: "భరణి" },
      samv:  { roman: "Vibhava",   deva: "विभव",       tel: "విభవ" } },
    { id: "guru",    form: "brhaspati",
      graha: { roman: "Guru",   deva: "गुरु",   tel: "గురు" },
      rishi: { roman: "Aṅgirasa",   deva: "अङ्गिरस",   tel: "అంగీరస" },
      masa: MASA.vaisakha, ti: 10,
      tithi: { roman: "Vaiśākha · Śukla Ekādaśī", deva: "वैशाख शुक्ल एकादशी", tel: "వైశాఖ శుక్ల ఏకాదశి" },
      vara:  { roman: "Thursday",  deva: "गुरुवार",    tel: "గురువారం" },
      naks:  { roman: "Uttara Phalgunī", deva: "उत्तर फल्गुनी", tel: "ఉత్తర ఫల్గుణి" },
      samv:  { roman: "Āṅgīrasa",  deva: "आङ्गीरस",    tel: "ఆంగీరస" } },
    { id: "budha",   form: "budha",
      graha: { roman: "Budha",  deva: "बुध",   tel: "బుధ" },
      rishi: { roman: "Atri",       deva: "अत्रि",      tel: "అత్రి" },
      masa: MASA.margashirsha, ti: 6,
      tithi: { roman: "Mārgaśira · Śukla Saptamī", deva: "मार्गशीर्ष शुक्ल सप्तमी", tel: "మార్గశిర శుక్ల సప్తమి" },
      vara:  { roman: "Wednesday", deva: "बुधवार",     tel: "బుధవారం" },
      naks:  { roman: "Pūrvābhādra", deva: "पूर्वाभाद्रपदा", tel: "పూర్వాభాద్ర" },
      samv:  { roman: "Āṅgīrasa",  deva: "आङ्गीरस",    tel: "ఆంగీరస" } },
    { id: "shukra",  form: "shukra",
      graha: { roman: "Śukra",  deva: "शुक्र",  tel: "శుక్ర" },
      rishi: { roman: "Bhṛgu",      deva: "भृगु",       tel: "భృగు" },
      masa: MASA.shravana, ti: 7,
      tithi: { roman: "Śrāvaṇa · Śukla Aṣṭamī", deva: "श्रावण शुक्ल अष्टमी", tel: "శ్రావణ శుక్ల అష్టమి" },
      vara:  { roman: "Friday",    deva: "शुक्रवार",   tel: "శుక్రవారం" },
      naks:  { roman: "Svātī",     deva: "स्वाती",     tel: "స్వాతి" },
      samv:  { roman: "Pārthiva",  deva: "पार्थिव",    tel: "పార్థివ" } },
    { id: "chandra", form: "chandra",
      graha: { roman: "Candra", deva: "चन्द्र", tel: "చంద్ర" },
      rishi: { roman: "Atri",       deva: "अत्रि",      tel: "అత్రి" },
      masa: MASA.kartika, ti: 14,
      tithi: { roman: "Kārtika · Pūrṇimā", deva: "कार्तिक पूर्णिमा", tel: "కార్తిక పౌర్ణమి" },
      vara:  { roman: "Monday",    deva: "सोमवार",     tel: "సోమవారం" },
      naks:  { roman: "Kṛttikā",   deva: "कृत्तिका",   tel: "కృత్తిక" },
      samv:  { roman: "Saumya",    deva: "सौम्य",      tel: "సౌమ్య" } },
    { id: "ketu",    form: "rahuketu",
      graha: { roman: "Ketu",   deva: "केतु",   tel: "కేతు" },
      rishi: { roman: "Jaimini",    deva: "जैमिनि",     tel: "జైమిని" },
      masa: MASA.caitra, ti: 28,
      tithi: { roman: "Caitra · Kṛṣṇa Caturdaśī", deva: "चैत्र कृष्ण चतुर्दशी", tel: "చైత్ర కృష్ణ చతుర్దశి" },
      vara:  { roman: "Monday",    deva: "सोमवार",     tel: "సోమవారం" },
      naks:  { roman: "Revatī",    deva: "रेवती",      tel: "రేవతి" },
      samv:  { roman: "Rākṣasa",   deva: "राक्षस",     tel: "రాక్షస" } },
    { id: "kuja",    form: "angaraka",
      graha: { roman: "Kuja",   deva: "कुज",   tel: "కుజ" },
      rishi: { roman: "Bharadvāja", deva: "भरद्वाज",   tel: "భరద్వాజ" },
      masa: MASA.ashadha, ti: 9,
      tithi: { roman: "Āṣāḍha · Śukla Daśamī", deva: "आषाढ शुक्ल दशमी", tel: "ఆషాఢ శుక్ల దశమి" },
      vara:  { roman: "Tuesday",   deva: "मङ्गलवार",   tel: "మంగళవారం" },
      naks:  { roman: "Anurādhā",  deva: "अनुराधा",    tel: "అనూరాధ" },
      samv:  { roman: "Rākṣasa",   deva: "राक्षस",     tel: "రాక్షస" } },
    { id: "rahu",    form: "rahuketu",
      graha: { roman: "Rāhu",   deva: "राहु",   tel: "రాహు" },
      rishi: { roman: "Paiṭhīnasa", deva: "पैठीनस",    tel: "పైఠీనస" },
      masa: MASA.bhadrapada, ti: 28,
      tithi: { roman: "Bhādrapada · Kṛṣṇa Caturdaśī", deva: "भाद्रपद कृष्ण चतुर्दशी", tel: "భాద్రపద కృష్ణ చతుర్దశి" },
      vara:  { roman: "Sunday",    deva: "रविवार",     tel: "ఆదివారం" },
      naks:  { roman: "Viśākhā",   deva: "विशाखा",     tel: "విశాఖ" },
      samv:  { roman: "Rākṣasa",   deva: "राक्षस",     tel: "రాక్షస" } },
  ];
  const T = {
    cap:   { roman: "Navagraha janma dinams", deva: "नवग्रह जन्म दिन", tel: "నవగ్రహ జన్మ దినాలు" },
    lede:  { roman: "The birth of each graha: gotra ṛṣi, month and tithi, weekday, nakṣatra, saṁvatsara.",
             deva: "प्रत्येक ग्रह का जन्म: गोत्र ऋषि, मास और तिथि, वार, नक्षत्र, संवत्सर।",
             tel: "ప్రతి గ్రహపు జన్మ: గోత్ర ఋషి, మాసం, తిథి, వారం, నక్షత్రం, సంవత్సరం." },
    gotra: { roman: "gotra", deva: "गोत्र", tel: "గోత్రం" },
    janma: { roman: "Janma Dinam", deva: "जन्मदिनम्", tel: "జన్మదినం" },
  };
  const vratId = (r) => "graha-janma-" + r.id;
  return { rows, T, vratId, byForm: (f) => rows.filter((r) => f === "all" || f === "navagraha" || r.form === f) };
})();

/* the nine tithis, as calendar entries — quiet, so they mark the month and
   take a bell without claiming the home card from the day's own parva */
export const STUTI_GRAHA_JANMA_EXTRA = (function () {
  const G = STUTI_GRAHA_JANMA;
  let lunar = null;
  const pick = (o, l) => o[l === "tel" ? "tel" : l];
  const entries = G.rows.map((r) => ({
    id: G.vratId(r), deity: "navagraha", brief: true, quiet: true, graha: r.id,
    name: { roman: r.graha.roman + " " + G.T.janma.roman, deva: r.graha.deva + " " + G.T.janma.deva, tel: r.graha.tel + " " + G.T.janma.tel },
    rule: r.tithi,
    find: (y) => (lunar ? lunar(y, r.masa, r.ti) : null),
    duration: { roman: "Forenoon", tel: "పూర్వాహ్ణం" },
    tagline: { roman: r.rishi.roman + " gotra · " + r.naks.roman + " nakṣatra · " + r.samv.roman + " saṁvatsara.",
               tel: r.rishi.tel + " గోత్రం · " + r.naks.tel + " నక్షత్రం · " + r.samv.tel + " సంవత్సరం." },
    stotras: [{ deity: "navagraha", m: "navagraha" }],
  }));
  return { entries, bind: (fns) => { lunar = fns.lunar; } };
})();

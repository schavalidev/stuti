/* ============================================================
   STUTI — the parva dinams the first list left out
   The vrata list began with the days that have a vidhi to teach; the
   calendar then read only from it, so a whole class of marked days — Holi,
   Kārtika Pūrṇimā, Atla Taddi, Vaikuṇṭha Ekādaśī — was simply absent from
   a month that knew its tithis to the minute. These are brief entries:
   a name, a rule, a line, the hymns. They join the vrata list the way the
   solar days do, so every surface picks them up unchanged.
   Tithi indices are 0-based across the lunar month: śukla n → n−1,
   kṛṣṇa n → 14+n. Kept Telugu smārta where traditions differ.
   ============================================================ */
window.STUTI_PARVA_EXTRA = (function () {
  const P = () => window.AKSHARA_PANCHANGA;
  const MASA = { caitra: 0, vaisakha: 1, jyeshtha: 2, ashadha: 3, shravana: 4, bhadrapada: 5, ashvina: 6, kartika: 7, margashirsha: 8, pausha: 9, magha: 10, phalguna: 11 };
  /* `lunar` and `monthStart` are lent by stuti-vrata-data.js at join time */
  let lunar = null, monthStart = null;
  const L = (m, ti, rule) => (y) => (lunar ? lunar(y, m, ti, rule) : null);
  const weeklyIn = (m, wd) => ({
    weekly: wd,
    window: (y) => { const s = monthStart(y, m); if (!s) return null; const e = new Date(s); e.setDate(e.getDate() + 29); return [s, e]; },
    find: (y) => { const d = monthStart(y, m); if (!d) return null; while (d.getDay() !== wd) d.setDate(d.getDate() + 1); return d; },
  });

  const entries = [
    {
      id: "holi", deity: "vishnu", brief: true, days: 2, kala: "pradosha", kalaDay: 1,
      name: { roman: "Holikā Dahana · Holi", deva: "होलिका दहन · होली", tel: "హోళికా దహనం · హోళీ" },
      rule: { roman: "Phālguna · Pūrṇimā, the fire at pradoṣa; colours the next morning", deva: "फाल्गुन पूर्णिमा, प्रदोष में होलिका; अगली भोर रंग", tel: "ఫాల్గుణ పౌర్ణమి, ప్రదోష వేళ హోళిక; మరుసటి ఉదయం రంగులు" },
      find: L(MASA.phalguna, 14, "pradosha"),
      dayLines: [
        { roman: "Holikā Dahana at pradoṣa", deva: "प्रदोष में होलिका दहन", tel: "ప్రదోష వేళ హోళికా దహనం" },
        { roman: "Dhuleṇḍī · the colours", deva: "धुलेंडी · रंग", tel: "రంగుల హోళీ" },
      ],
      tagline: { roman: "Prahlāda kept, Holikā burnt — the year's last full moon, and the winter with it.", tel: "ప్రహ్లాదుడు నిలిచాడు, హోళిక కాలింది — సంవత్సరపు చివరి పౌర్ణమి, దానితో శీతాకాలం." },
      stotras: [{ deity: "vishnu", m: "nrsimha" }, { deity: "vishnu", m: "narayana" }],
    },
    {
      id: "kartika-purnima", deity: "shiva", brief: true, kala: "pradosha",
      name: { roman: "Kārtika Pūrṇimā · Kārtika Dīpam", deva: "कार्तिक पूर्णिमा · त्रिपुरारि पूर्णिमा", tel: "కార్తిక పౌర్ణమి · జ్వాలా తోరణం" },
      rule: { roman: "Kārtika · Pūrṇimā", deva: "कार्तिक पूर्णिमा", tel: "కార్తిక పౌర్ణమి" },
      find: L(MASA.kartika, 14),
      tagline: { roman: "Tripurāri Pūrṇimā — 365 wicks in one lamp, the jvālā tōraṇam at the temple gate, Śiva's victory over the three cities.", tel: "త్రిపురారి పౌర్ణమి — ఒక దీపంలో 365 వత్తులు, గుడి గుమ్మంలో జ్వాలా తోరణం." },
      stotras: [{ deity: "shiva", m: "lingastakam" }, { deity: "shiva", m: "bilvastakam" }, { deity: "shiva", m: "rudram" }],
    },
    Object.assign({
      id: "kartika-somavaram", deity: "shiva", brief: true, kind: "vratam",
      name: { roman: "Kārtika Somavāram", deva: "कार्तिक सोमवार", tel: "కార్తిక సోమవారం" },
      rule: { roman: "Every Monday of Kārtika", deva: "कार्तिक के प्रत्येक सोमवार", tel: "కార్తిక మాసంలోని ప్రతి సోమవారం" },
      tagline: { roman: "A fast to Śiva through the day, broken after the evening lamp and the Rudrābhiṣeka.", tel: "పగలంతా శివునికి ఉపవాసం, సాయంత్రం దీపం, రుద్రాభిషేకం తర్వాత విరమణ." },
      stotras: [{ deity: "shiva", m: "rudram" }, { deity: "shiva", m: "siva pancaksara" }],
    }, weeklyIn(MASA.kartika, 1)),
    Object.assign({
      id: "shravana-shukravaram", deity: "devi", brief: true, kind: "vratam",
      name: { roman: "Śrāvaṇa Śukravāram", deva: "श्रावण शुक्रवार", tel: "శ్రావణ శుక్రవారం" },
      rule: { roman: "Every Friday of Śrāvaṇa", deva: "श्रावण के प्रत्येक शुक्रवार", tel: "శ్రావణ మాసంలోని ప్రతి శుక్రవారం" },
      tagline: { roman: "Lakṣmī's own Fridays — the sumaṅgalis invited, tāmbūlam given; the Varalakṣmī Friday is the greatest of them.", tel: "లక్ష్మీదేవి శుక్రవారాలు — ముత్తైదువుల ఆహ్వానం, తాంబూలం; వరలక్ష్మీ శుక్రవారం వీటిలో పెద్దది." },
      stotras: [{ deity: "devi", m: "mahalaksmi" }, { deity: "devi", m: "laksmi astottara" }],
    }, weeklyIn(MASA.shravana, 5)),
    Object.assign({
      id: "bonalu", deity: "devi", brief: true,
      name: { roman: "Bonālu", deva: "बोनालु", tel: "బోనాలు" },
      rule: { roman: "Every Sunday of Āṣāḍha — Telangana", deva: "आषाढ के प्रत्येक रविवार — तेलंगाणा", tel: "ఆషాఢ మాసంలోని ప్రతి ఆదివారం — తెలంగాణ" },
      tagline: { roman: "Cooked rice carried to the Mother in a decorated pot — Golconda first, then Ujjaini Mahākāḻi, then Lāl Darwāzā.", tel: "అలంకరించిన కుండలో అమ్మవారికి బోనం — గోల్కొండ, ఉజ్జయిని మహంకాళి, లాల్ దర్వాజా వరుసగా." },
      stotras: [{ deity: "devi", m: "mahisasuramardini" }, { deity: "devi", m: "durga" }],
    }, weeklyIn(MASA.ashadha, 0)),
    {
      id: "ananta-caturdashi", deity: "vishnu", kind: "vratam",
      name: { roman: "Ananta Caturdaśī", deva: "अनन्त चतुर्दशी", tel: "అనంత చతుర్దశి" },
      rule: { roman: "Bhādrapada · Śukla Caturdaśī", deva: "भाद्रपद शुक्ल चतुर्दशी", tel: "భాద్రపద శుక్ల చతుర్దశి" },
      find: L(MASA.bhadrapada, 13),
      duration: { roman: "One day; the vrata is kept for fourteen years", deva: "एक दिन; व्रत चौदह वर्ष तक रखा जाता है", tel: "ఒక రోజు; వ్రతం పద్నాలుగు సంవత్సరాలు ఆచరిస్తారు" },
      tagline: { roman: "The fourteen-knotted thread to Ananta Padmanābha; the day the Gaṇeśa of eleven days goes to the water.", deva: "अनन्त पद्मनाभ को चौदह गाँठों का सूत्र; वही दिन जब ग्यारह दिन के गणेश जल में जाते हैं।", tel: "అనంత పద్మనాభునికి పద్నాలుగు ముడుల తోరం; పదకొండు రోజుల గణపతి నిమజ్జనం." },
      who: { roman: "Kept by the household together. The toram is bound on the right hand, and the vrata is taken up for fourteen years.",
             deva: "कुटुम्ब सहित रखा जाता है। तोरम् दाहिने हाथ पर बाँधा जाता है, और व्रत चौदह वर्ष के लिये लिया जाता है।",
             tel: "కుటుంబ సమేతంగా చేస్తారు. తోరాన్ని కుడి చేతికి కడతారు, వ్రతాన్ని పద్నాలుగు సంవత్సరాలకు సంకల్పిస్తారు." },
      significance: [
        { roman: "The number fourteen runs through the whole rite: fourteen knots in the toram, fourteen years of keeping, the fourteenth tithi, and the materials of the worship counted in fourteens.",
          deva: "चौदह की संख्या पूरे व्रत में चलती है — तोरम् की चौदह गाँठें, चौदह वर्ष का नियम, चतुर्दशी तिथि, और पूजा की सामग्री भी चौदह-चौदह की गिनती में।",
          tel: "పద్నాలుగు అనే సంఖ్య వ్రతమంతటా కనిపిస్తుంది — తోరంలో పద్నాలుగు ముడులు, పద్నాలుగు సంవత్సరాల నియమం, చతుర్దశి తిథి, పూజా సామగ్రి కూడా పద్నాలుగేసి లెక్కన." },
        { roman: "The toram is set up before the Lord at the start, before the services begin, which most vratas do not do.",
          deva: "तोरम् आरम्भ में ही भगवान् के सम्मुख रखा जाता है, उपचारों से पूर्व — अधिकांश व्रतों में ऐसा नहीं होता।",
          tel: "తోరాన్ని మొదటే స్వామి ఎదుట ఉంచుతారు, ఉపచారాలకు ముందే — చాలా వ్రతాలలో ఇలా ఉండదు." },
        { roman: "The story is of Kauṇḍinya, who tore his wife's toram off in anger and threw it into the fire, lost everything, and wandered the forest asking the tree, the cow, the bull, the lakes, the donkey and the elephant for Ananta; none of them knew him.",
          deva: "कथा कौण्डिन्य की है, जिसने क्रोध में अपनी पत्नी का तोरम् तोड़कर अग्नि में डाल दिया, सब कुछ खो बैठा, और वन में वृक्ष, गाय, बैल, सरोवरों, गधे और हाथी से अनन्त का पता पूछता फिरा; किसी ने उन्हें नहीं जाना।",
          tel: "కథ కౌండిన్యుడిది. కోపంతో భార్య తోరాన్ని తెంచి అగ్నిలో వేయగా సర్వం కోల్పోయాడు; అడవిలో చెట్టును, ఆవును, ఎద్దును, సరస్సులను, గాడిదను, ఏనుగును అనంతుని గురించి అడుగుతూ తిరిగాడు; ఎవరికీ ఆయన తెలియలేదు." },
      ],
      timeline: [
        { t: { roman: "Morning", deva: "प्रातःकाल", tel: "ఉదయం" },
          d: { roman: "Smear a pure place with cow dung and make the maṇḍala of eight petals on it.", deva: "शुद्ध स्थान को गोबर से लीपकर उस पर अष्टदल मण्डल बनाएँ।", tel: "శుభ్రమైన చోటును ఆవుపేడతో అలికి, దానిపై అష్టదళ మండలం వేయాలి." } },
        { t: { roman: "Setting up", deva: "स्थापना", tel: "స్థాపన" },
          d: { roman: "Set the pot of water on the south side, make the image of the Lord in darbha grass, and set up the toram before him.", deva: "दक्षिण दिशा में जल-कलश रखें, दर्भ से भगवान् की प्रतिमा बनाएँ, और उनके सम्मुख तोरम् रखें।", tel: "దక్షిణ వైపు నీటి కలశం ఉంచి, దర్భతో స్వామి ప్రతిమ చేసి, ఆయన ఎదుట తోరం ఉంచాలి." } },
        { t: { roman: "Worship", deva: "पूजा", tel: "పూజ" },
          d: { roman: "Yamunā Devī first, as a limb of the rite; then the sixteen services to Ananta Padmanābha and the worship of his limbs.", deva: "पहले यमुना देवी की पूजा, जो विधि का अङ्ग है; फिर अनन्त पद्मनाभ को षोडश उपचार और अङ्गपूजा।", tel: "మొదట యమునాదేవి పూజ, అది వ్రతంలో ఒక అంగం; తరువాత అనంత పద్మనాభునికి షోడశోపచారాలు, అంగపూజ." } },
        { t: { roman: "Close", deva: "समापन", tel: "ముగింపు" },
          d: { roman: "Worship the fourteen knots, bind the toram on the right hand, and give the vāyana.", deva: "चौदह गाँठों की पूजा करें, तोरम् दाहिने हाथ पर बाँधें, और वायन दें।", tel: "పద్నాలుగు ముడులను పూజించి, తోరాన్ని కుడి చేతికి కట్టుకుని, వాయనం ఇవ్వాలి." } },
      ],
      samagri: [
        { roman: "Darbha grass, to make the image of the Lord", deva: "भगवान् की प्रतिमा बनाने को दर्भ", tel: "స్వామి ప్రతిమ చేయడానికి దర్భ" },
        { roman: "A strong thread wetted with kuṅkuma, with fourteen knots", deva: "कुमकुम से भिगोया हुआ दृढ़ सूत्र, जिसमें चौदह गाँठें हों", tel: "కుంకుమతో తడిపిన దృఢమైన దారం, అందులో పద్నాలుగు ముడులు" },
        { roman: "A pot of water, to stand on the south side", deva: "दक्षिण दिशा में रखने को जल-कलश", tel: "దక్షిణ వైపు ఉంచడానికి నీటి కలశం" },
        { roman: "Cow dung for the floor, and rice flour for the maṇḍala of eight petals", deva: "भूमि लीपने को गोबर, और अष्टदल मण्डल के लिये चावल का आटा", tel: "నేల అలకడానికి ఆవుపేడ, అష్టదళ మండలానికి బియ్యప్పిండి" },
        { roman: "Twenty-eight sweet cakes — half given away, half eaten", deva: "अट्ठाईस मीठे पूए — आधे दान, आधे स्वयं", tel: "ఇరవై ఎనిమిది అప్పాలు — సగం దానం, సగం స్వీకరణ" },
        { roman: "Turmeric, kumkum, akṣata, sandal, flowers, counted in fourteens", deva: "हल्दी, कुमकुम, अक्षत, चन्दन, पुष्प — चौदह-चौदह की गिनती में", tel: "పసుపు, కుంకుమ, అక్షతలు, గంధం, పూలు — పద్నాలుగేసి లెక్కన" },
        { roman: "Dhūpa, dīpa, ghee, camphor", deva: "धूप, दीप, घी, कर्पूर", tel: "ధూపం, దీపం, నెయ్యి, కర్పూరం" },
      ],
      vidhi: [
        { step: { roman: "Yamunā pūjā", deva: "यमुना पूजा", tel: "యమునా పూజ" },
          detail: { roman: "Set up the subsidiary pot, call Yamunā Devī into it and worship her. This is done first, as a limb of the rite.", deva: "सहायक कलश स्थापित कर उसमें यमुना देवी का आवाहन करें और पूजा करें। यह पहले किया जाता है, विधि के अङ्ग रूप में।", tel: "సహాయక కలశం స్థాపించి, అందులో యమునాదేవిని ఆవాహన చేసి పూజించాలి. ఇది ముందుగా, వ్రతంలో ఒక అంగంగా చేస్తారు." } },
        { step: { roman: "Maṇḍala & pratimā", deva: "मण्डल व प्रतिमा", tel: "మండలం, ప్రతిమ" },
          detail: { roman: "Make the eight-petalled maṇḍala on the smeared floor, and the image of the Lord in darbha grass in the middle of it.", deva: "लीपी हुई भूमि पर अष्टदल मण्डल बनाएँ, और उसके मध्य में दर्भ से भगवान् की प्रतिमा।", tel: "అలికిన నేలపై అష్టదళ మండలం వేసి, దాని మధ్యలో దర్భతో స్వామి ప్రతిమ చేయాలి." } },
        { step: { roman: "Toram sthāpana", deva: "तोरम् स्थापन", tel: "తోర స్థాపన" },
          detail: { roman: "Set up the thread of fourteen knots before the Lord, before the services begin.", deva: "उपचारों से पूर्व ही चौदह गाँठों का सूत्र भगवान् के सम्मुख रखें।", tel: "ఉపచారాలు మొదలయ్యే ముందే పద్నాలుగు ముడుల తోరాన్ని స్వామి ఎదుట ఉంచాలి." } },
        { step: { roman: "Āvāhana & ṣoḍaśopacāra", deva: "आवाहन व षोडशोपचार", tel: "ఆవాహనం, షోడశోపచారం" },
          detail: { roman: "Invite him as one who dwells in the white island, with seven hoods, tawny eyes and four arms, bearing the conch, the discus and the mace; then the sixteen services.", deva: "श्वेतद्वीप में निवास करने वाले, सात फणों, पिङ्गल नेत्रों और चार भुजाओं वाले, शङ्ख-चक्र-गदाधारी भगवान् का आवाहन करें; फिर षोडश उपचार।", tel: "శ్వేతద్వీపంలో నివసించే, ఏడు పడగల, పింగళ నేత్రాల, నాలుగు చేతుల, శంఖ చక్ర గదాధారి అయిన స్వామిని ఆవాహన చేయాలి; తరువాత పదహారు ఉపచారాలు." } },
        { step: { roman: "Aṅga-pūjā & aṣṭottara", deva: "अङ्गपूजा व अष्टोत्तर", tel: "అంగపూజ, అష్టోత్తరం" },
          detail: { roman: "Worship the limbs by seventeen names from the feet up to the head, then the hundred and eight names.", deva: "चरणों से शिर तक सत्रह नामों से अङ्गपूजा करें, फिर अष्टोत्तरशत नाम।", tel: "పాదాల నుండి శిరస్సు వరకు పదిహేడు నామాలతో అంగపూజ చేసి, తరువాత అష్టోత్తర శతనామాలు." } },
        { step: { roman: "Granthi-pūjā & bandhanam", deva: "ग्रन्थिपूजा व बन्धन", tel: "గ్రంథిపూజ, బంధనం" },
          detail: { roman: "Worship the fourteen knots, one name to each, bow to the toram, then bind it on the right hand and let go of last year's.", deva: "चौदह गाँठों की पूजा एक-एक नाम से करें, तोरम् को नमस्कार करें, फिर उसे दाहिने हाथ पर बाँधें और पिछले वर्ष का छोड़ दें।", tel: "పద్నాలుగు ముడులను ఒక్కొక్క నామంతో పూజించి, తోరానికి నమస్కరించి, కుడి చేతికి కట్టుకుని, గత సంవత్సరపు తోరాన్ని విడిచిపెట్టాలి." } },
        { step: { roman: "Vāyanam", deva: "वायन", tel: "వాయనం" },
          detail: { roman: "Of the twenty-eight sweet cakes made for the rite, give fourteen to brāhmaṇas and eat the rest.", deva: "व्रत के लिये बनाए अट्ठाईस पूओं में से चौदह ब्राह्मणों को दें और शेष स्वयं ग्रहण करें।", tel: "వ్రతం కోసం చేసిన ఇరవై ఎనిమిది అప్పాలలో పద్నాలుగు బ్రాహ్మణులకు ఇచ్చి, మిగిలినవి స్వీకరించాలి." } },
      ],
      naivedya: [
        { item: { roman: "Twenty-eight sweet cakes", deva: "अट्ठाईस मीठे पूए", tel: "ఇరవై ఎనిమిది అప్పాలు" },
          note: { roman: "Half are given away and half eaten; the source and the printed witness agree on this.", deva: "आधे दान किये जाते हैं और आधे स्वयं ग्रहण — मूल और मुद्रित साक्ष्य दोनों इस पर एकमत हैं।", tel: "సగం దానం, సగం స్వీకరణ; మూలం, ముద్రిత సాక్ష్యం రెండూ దీనిపై ఏకీభవిస్తాయి." } },
        { item: { roman: "Fruit and jaggery", deva: "फल और गुड़", tel: "పండ్లు, బెల్లం" },
          note: { roman: "Offered with the naivedya, counted in fourteens like the rest.", deva: "नैवेद्य के साथ अर्पित, शेष सामग्री की भाँति चौदह की गिनती में।", tel: "నైవేద్యంతో పాటు సమర్పణ; మిగతా సామగ్రిలాగే పద్నాలుగేసి లెక్కన." } },
      ],
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }, { deity: "vishnu", m: "narayana" }],
      dos: [
        { roman: "Let go of the previous year's toram before binding the new one.", deva: "नया तोरम् बाँधने से पूर्व पिछले वर्ष का छोड़ दें।", tel: "కొత్త తోరం కట్టుకునే ముందు గత సంవత్సరపు తోరాన్ని విడిచిపెట్టాలి." },
        { roman: "Count the materials of the worship in fourteens, as the rite directs.", deva: "पूजा की सामग्री चौदह-चौदह की गिनती में रखें, जैसा विधि कहती है।", tel: "వ్రతం చెప్పినట్లు పూజా సామగ్రిని పద్నాలుగేసి లెక్కన ఉంచాలి." },
        { roman: "Take it up for fourteen years, as the story gives it, and say so in the resolve.", deva: "कथा के अनुसार इसे चौदह वर्ष के लिये लें, और सङ्कल्प में यह कहें।", tel: "కథ చెప్పినట్లు పద్నాలుగు సంవత్సరాలకు సంకల్పించుకోవాలి, సంకల్పంలో అది చెప్పాలి." },
      ],
      donts: [
        { roman: "Do not cut or burn the toram; the story of this vrata is the story of a toram thrown into the fire.", deva: "तोरम् को न काटें और न जलाएँ; इस व्रत की कथा अग्नि में डाले गए तोरम् की ही कथा है।", tel: "తోరాన్ని కత్తిరించరాదు, కాల్చరాదు; ఈ వ్రత కథ అగ్నిలో వేసిన తోరం కథే." },
        { roman: "Do not begin the services before the toram has been set up before the Lord.", deva: "तोरम् भगवान् के सम्मुख रखे बिना उपचार आरम्भ न करें।", tel: "తోరాన్ని స్వామి ఎదుట ఉంచకుండా ఉపచారాలు ప్రారంభించరాదు." },
        { roman: "Do not keep last year's worn thread on the hand beside the new one.", deva: "पिछले वर्ष का पुराना सूत्र नए के साथ हाथ पर न रखें।", tel: "గత సంవత్సరపు పాత తోరాన్ని కొత్తదానితో పాటు చేతికి ఉంచరాదు." },
      ],
      source: { roman: "Follows the Telugu Smārta kalpa, collated against the printed Āru Vratālu, Rajahmundry 1999. The rule of the rite is given in the story itself, where the women at the lake teach it to Śīlā.",
                deva: "तेलुगु स्मार्त कल्प के अनुसार, आरु व्रतालु (राजमहेन्द्री 1999) के मुद्रित पाठ से मिलान किया गया। विधि का नियम कथा में ही मिलता है, जहाँ सरोवर की स्त्रियाँ शीला को सिखाती हैं।",
                tel: "తెలుగు స్మార్త కల్పం ప్రకారం; ఆరు వ్రతాలు (రాజమహేంద్రవరం 1999) ముద్రిత పాఠంతో సరిచూడబడింది. వ్రత నియమం కథలోనే ఉంది — సరస్సు వద్ద స్త్రీలు శీలకు చెప్పే చోట." },
    },
    {
      id: "mahalaya-amavasya", deity: "vishnu", brief: true,
      name: { roman: "Mahālaya Amāvāsyā", deva: "महालय अमावस्या", tel: "మహాలయ అమావాస్య" },
      rule: { roman: "Bhādrapada · Amāvāsyā — the last day of Pitṛ Pakṣa", deva: "भाद्रपद अमावस्या — पितृपक्ष का अन्त", tel: "భాద్రపద అమావాస్య — పితృపక్షం చివరి రోజు" },
      find: L(MASA.bhadrapada, 29),
      tagline: { roman: "Tarpaṇa for every ancestor whose tithi is not known; the fortnight of the fathers closes, and Navarātri opens tomorrow.", tel: "తిథి తెలియని పితరులందరికీ తర్పణం; పితృపక్షం ముగుస్తుంది, రేపు నవరాత్రి." },
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }],
    },
    {
      id: "polala-amavasya", deity: "devi", brief: true, kind: "vratam",
      name: { roman: "Polāla Amāvāsyā", deva: "पोलाल अमावस्या", tel: "పోలాల అమావాస్య" },
      rule: { roman: "Śrāvaṇa · Amāvāsyā", deva: "श्रावण अमावस्या", tel: "శ్రావణ అమావాస్య" },
      find: L(MASA.shravana, 29),
      tagline: { roman: "Mothers keep it for their children — the pōla plant worshipped, the story of Pōlāmma told, the threads tied.", tel: "పిల్లల కోసం తల్లులు చేసే నోము — పోలేరమ్మ కథ, తోరం, పోలాల పూజ." },
      stotras: [{ deity: "devi", m: "lalita sahasra" }],
    },
    {
      id: "atla-taddi", deity: "devi", brief: true, kind: "vratam",
      name: { roman: "Aṭla Taddi", deva: "अट्ल तद्दि", tel: "అట్ల తద్ది" },
      rule: { roman: "Āśvayuja · Kṛṣṇa Tṛtīyā", deva: "आश्विन कृष्ण तृतीया", tel: "ఆశ్వయుజ బహుళ తదియ" },
      find: L(MASA.ashvina, 17),
      tagline: { roman: "The Telugu Karvā Cauth — a day's fast to Gaurī, eleven aṭlu offered at moonrise, the swings and the gorintāku the night before.", tel: "గౌరీదేవికి పగలంతా ఉపవాసం, చంద్రోదయాన పదకొండు అట్లు; ముందు రాత్రి ఉయ్యాలలు, గోరింటాకు." },
      stotras: [{ deity: "devi", m: "gauri" }, { deity: "devi", m: "lalita sahasra" }],
    },
    {
      id: "karva-chauth", deity: "devi", brief: true, kind: "vratam",
      name: { roman: "Karvā Cauth", deva: "करवा चौथ", tel: "కర్వా చౌత్" },
      rule: { roman: "Āśvayuja · Kṛṣṇa Caturthī — the north", deva: "कार्तिक कृष्ण चतुर्थी (पूर्णिमान्त) — उत्तर भारत", tel: "ఆశ్వయుజ బహుళ చవితి — ఉత్తరాది" },
      ruleP: { roman: "Kārtika · Kṛṣṇa Caturthī — the north", deva: "कार्तिक कृष्ण चतुर्थी — उत्तर भारत", tel: "కార్తిక బహుళ చవితి — ఉత్తరాది" },
      find: L(MASA.ashvina, 18),
      tagline: { roman: "A waterless fast from dawn to moonrise, broken through the sieve at the husband's face.", tel: "సూర్యోదయం నుండి చంద్రోదయం వరకు నిర్జల ఉపవాసం." },
      stotras: [{ deity: "devi", m: "gauri" }],
    },
    {
      id: "tulasi-vivaha", deity: "vishnu", brief: true,
      name: { roman: "Utthāna Dvādaśī · Tulasī Vivāha", deva: "उत्थान द्वादशी · तुलसी विवाह", tel: "ఉత్థాన ద్వాదశి · తులసీ కల్యాణం" },
      rule: { roman: "Kārtika · Śukla Dvādaśī", deva: "कार्तिक शुक्ल द्वादशी", tel: "కార్తిక శుద్ధ ద్వాదశి" },
      find: L(MASA.kartika, 11),
      kala: "pradosha",
      tagline: { roman: "Viṣṇu wakes from the four months' sleep; Tulasī is married to him at dusk, and the wedding season opens.", tel: "చాతుర్మాస్య నిద్ర నుండి విష్ణువు మేల్కొంటాడు; సాయంత్రం తులసీ కల్యాణం, పెళ్ళిళ్ళ కాలం ఆరంభం." },
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }],
    },
    {
      id: "subrahmanya-shashti", deity: "subrahmanya", brief: true,
      name: { roman: "Subrahmaṇya Ṣaṣṭhī", deva: "सुब्रह्मण्य षष्ठी", tel: "సుబ్రహ్మణ్య షష్ఠి" },
      rule: { roman: "Mārgaśīrṣa · Śukla Ṣaṣṭhī", deva: "मार्गशीर्ष शुक्ल षष्ठी", tel: "మార్గశిర శుద్ధ షష్ఠి" },
      find: L(MASA.margashirsha, 5),
      tagline: { roman: "The Telugu Ṣaṣṭhī — Mopidevi and Skandagiri fill; the serpent pits are fed milk and eggs.", tel: "తెలుగువారి షష్ఠి — మోపిదేవి, స్కందగిరి నిండుతాయి; పుట్టలో పాలు." },
      stotras: [{ deity: "subrahmanya", m: "subrahmanya bhujanga" }, { deity: "subrahmanya", m: "subrahmanya astottara" }],
    },
    {
      id: "vaikuntha-ekadashi", deity: "vishnu", brief: true, kind: "vratam",
      name: { roman: "Vaikuṇṭha Ekādaśī · Gītā Jayantī", deva: "वैकुण्ठ एकादशी · गीता जयन्ती", tel: "వైకుంఠ ఏకాదశి · ముక్కోటి ఏకాదశి" },
      rule: { roman: "The Śukla Ekādaśī of Dhanurmāsa — after the sun enters Dhanu", deva: "धनुर्मास की शुक्ल एकादशी — मोक्षदा एकादशी", tel: "ధనుర్మాసంలోని శుద్ధ ఏకాదశి — ధనుస్సంక్రమణం తర్వాత" },
      /* solar-bounded: the bright ekādaśī that falls between the Dhanu and
         Makara saṅkrāntis. A tithi-in-month rule lands a month off in the
         years the two calendars part. */
      find: (y) => {
        try {
          const Pa = P(), REF = Pa.locations.find((l) => l.id === "ujjain") || Pa.locations[0];
          /* Dhanu saṅkrānti of the PREVIOUS December opens the Dhanurmāsa ending in year y */
          const s = Pa.sankrantiDay(y - 1, 8) || Pa.sankrantiDay(y, 8);
          if (!s) return null;
          const e = Pa.nextTithiFrom(s, 10, REF);
          return e ? (lunar ? lunar.viddha ? lunar.viddha(e, 10) : e : e) : null;
        } catch (err) { return lunar ? lunar(y, MASA.margashirsha, 10, "viddha") : null; }
      },
      tagline: { roman: "The northern door opens at Tirupati and Śrīraṅgam before dawn; the day the Gītā was spoken.", tel: "తిరుపతి, శ్రీరంగంలో తెల్లవారకముందే ఉత్తర ద్వార దర్శనం; గీత చెప్పబడిన రోజు." },
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }, { deity: "vishnu", m: "venkatesvara" }, { deity: "vishnu", m: "bhagavad gita" }],
    },
    {
      id: "bhishma-ekadashi", deity: "vishnu", brief: true, kind: "vratam",
      name: { roman: "Bhīṣma Ekādaśī", deva: "भीष्म एकादशी", tel: "భీష్మ ఏకాదశి" },
      rule: { roman: "Māgha · Śukla Ekādaśī", deva: "माघ शुक्ल एकादशी", tel: "మాఘ శుద్ధ ఏకాదశి" },
      find: L(MASA.magha, 10, "viddha"),
      tagline: { roman: "The day Bhīṣma spoke the thousand names on the bed of arrows — the Viṣṇu Sahasranāma's own day.", tel: "అంపశయ్యపై భీష్ముడు సహస్రనామం చెప్పిన రోజు — విష్ణు సహస్రనామం పుట్టినరోజు." },
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }],
    },
    {
      id: "nirjala-ekadashi", deity: "vishnu", brief: true, kind: "vratam",
      name: { roman: "Nirjalā Ekādaśī", deva: "निर्जला एकादशी", tel: "నిర్జల ఏకాదశి" },
      rule: { roman: "Jyeṣṭha · Śukla Ekādaśī", deva: "ज्येष्ठ शुक्ल एकादशी", tel: "జ్యేష్ఠ శుద్ధ ఏకాదశి" },
      find: L(MASA.jyeshtha, 10, "viddha"),
      tagline: { roman: "Bhīma's Ekādaśī — one waterless fast in the hottest month, said to stand for all twenty-four.", tel: "భీముని ఏకాదశి — ఎండాకాలంలో ఒక నిర్జల ఉపవాసం, ఇరవై నాలుగింటికి సమానమని." },
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }],
    },
    {
      id: "ganga-dashahara", deity: "devi", brief: true,
      name: { roman: "Gaṅgā Daśaharā", deva: "गङ्गा दशहरा", tel: "గంగా దశహర" },
      rule: { roman: "Jyeṣṭha · Śukla Daśamī", deva: "ज्येष्ठ शुक्ल दशमी", tel: "జ్యేష్ఠ శుద్ధ దశమి" },
      find: L(MASA.jyeshtha, 9),
      tagline: { roman: "Gaṅgā came down to earth — a bath in any river, ten of everything offered.", tel: "గంగ భూమికి దిగిన రోజు — ఏ నదిలోనైనా స్నానం, పదేసి సమర్పణ." },
      stotras: [{ deity: "devi", m: "sri suktam" }],
    },
    {
      id: "ratha-yatra", deity: "vishnu", brief: true,
      name: { roman: "Ratha Yātrā", deva: "रथ यात्रा", tel: "రథ యాత్ర" },
      rule: { roman: "Āṣāḍha · Śukla Dvitīyā", deva: "आषाढ शुक्ल द्वितीया", tel: "ఆషాఢ శుద్ధ విదియ" },
      find: L(MASA.ashadha, 1),
      tagline: { roman: "Jagannātha leaves his temple for his aunt's house at Purī; the one day the Lord comes out to the street.", tel: "పూరీలో జగన్నాథుడు గుడి విడిచి పిన్ని ఇంటికి; స్వామి వీధికి వచ్చే ఒకే రోజు." },
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }],
    },
    {
      id: "dhanurmasa", deity: "vishnu", brief: true, quiet: true,
      name: { roman: "Dhanurmāsa", deva: "धनुर्मास", tel: "ధనుర్మాసం" },
      rule: { roman: "The sun in Dhanu — mid-December to Makara Saṅkrānti", deva: "सूर्य धनु राशि में — मध्य दिसम्बर से मकर सङ्क्रान्ति", tel: "సూర్యుడు ధనుస్సులో — డిసెంబరు మధ్య నుండి మకర సంక్రాంతి వరకు" },
      find: (y) => { try { return P().sankrantiDay(y - 1, 8) || P().sankrantiDay(y, 8); } catch (e) { return null; } },
      days: 30,
      tagline: { roman: "The month of the dawn pūjā — Tiruppāvai one verse a day, the temple doors open before the stars go.", tel: "ఉషఃకాల పూజల మాసం — రోజుకో తిరుప్పావై పాశురం, నక్షత్రాలు ఉండగానే గుడి తలుపులు." },
      stotras: [{ deity: "vishnu", m: "venkatesvara suprabhata" }, { deity: "vishnu", m: "visnu sahasra" }],
    },
    {
      id: "pitru-paksha", deity: "vishnu", brief: true, quiet: true,
      name: { roman: "Pitṛ Pakṣa · Mahālaya", deva: "पितृपक्ष · महालय", tel: "పితృపక్షం · మహాలయం" },
      rule: { roman: "Bhādrapada · Kṛṣṇa Pratipadā to Amāvāsyā", deva: "भाद्रपद कृष्ण प्रतिपदा से अमावस्या", tel: "భాద్రపద బహుళ పాడ్యమి నుండి అమావాస్య" },
      find: L(MASA.bhadrapada, 15),
      days: 15,
      tagline: { roman: "The fortnight of the fathers — tarpaṇa daily, or at least on the ancestor's own tithi; the last day gathers every one left out.", tel: "పితరుల పక్షం — రోజూ తర్పణం, లేదా కనీసం పితరుని తిథి నాడు; చివరి రోజు మిగిలినవారందరికీ." },
      stotras: [{ deity: "vishnu", m: "visnu sahasra" }],
    },
    {
      id: "upakarma", deity: "guru", brief: true,
      name: { roman: "Śrāvaṇa Pūrṇimā · Upākarma · Rakṣā Bandhana", deva: "श्रावण पूर्णिमा · उपाकर्म · रक्षा बन्धन", tel: "శ్రావణ పౌర్ణమి · జంధ్యాల పౌర్ణమి · రాఖీ" },
      rule: { roman: "Śrāvaṇa · Pūrṇimā", deva: "श्रावण पूर्णिमा", tel: "శ్రావణ పౌర్ణమి" },
      find: L(MASA.shravana, 14),
      tagline: { roman: "The sacred thread changed and the Veda begun again; the rakṣā tied at the wrist.", tel: "జంధ్యం మార్చి వేదాధ్యయనం మళ్ళీ మొదలు; రాఖీ కట్టే రోజు." },
      stotras: [{ deity: "guru", m: "guru" }, { deity: "surya", m: "gayatri" }],
    },
    {
      id: "vijayadashami", deity: "devi", brief: true,
      name: { roman: "Vijayadaśamī · Dasarā", deva: "विजयदशमी · दशहरा", tel: "విజయదశమి · దసరా" },
      rule: { roman: "Āśvayuja · Śukla Daśamī", deva: "आश्विन शुक्ल दशमी", tel: "ఆశ్వయుజ శుద్ధ దశమి" },
      find: L(MASA.ashvina, 9),
      kala: "pradosha",
      tagline: { roman: "The tenth day: śamī pūjā at dusk, the akṣarābhyāsa, anything begun today succeeds — the one day no muhūrta is asked for.", tel: "పదోరోజు: సాయంత్రం శమీ పూజ, అక్షరాభ్యాసం; ముహూర్తం చూడనవసరం లేని ఒకే రోజు." },
      stotras: [{ deity: "devi", m: "mahisasuramardini" }, { deity: "devi", m: "durga" }],
    },
  ];

  return {
    entries,
    /* the vrata module hands over its finders once it has built them */
    bind: (fns) => { lunar = fns.lunar; monthStart = fns.monthStart; },
  };
})();

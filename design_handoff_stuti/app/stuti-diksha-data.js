/* ============================================================
   STUTI — dīkṣās
   A dīkṣā is a sustained discipline, most often forty-one days, taken
   with a mālā from a guru or a temple, kept with niyamas, and ended at
   a shrine. It is not a kathā vrata. The guru's word and the temple's
   rule govern every detail; this file gives the span, the common
   niyamas, and the texts. Where the end day is fixed by the calendar
   the span is marked on it; where it is not, the entry is optional
   and shows only when opened.
   ============================================================ */
window.STUTI_DIKSHA_EXTRA = (function () {
  const P = () => window.AKSHARA_PANCHANGA;
  const MASA = { caitra: 0, vaisakha: 1, bhadrapada: 5, ashvina: 6, kartika: 7, margashirsha: 8 };
  let lunar = null;
  const L = (m, ti, rule) => (y) => (lunar ? lunar(y, m, ti, rule) : null);
  const S = (step, detail) => ({ step, detail });
  const common = [
    S({ roman: "The mālā", deva: "माला", tel: "మాల" },
      { roman: "Taken from the guru or at the temple, with the saṅkalpa. Worn until the dīkṣā ends.", deva: "गुरु से या मन्दिर में सङ्कल्प के साथ धारण। दीक्षा पूरी होने तक पहनते हैं।", tel: "గురువు దగ్గర లేదా గుడిలో సంకల్పంతో ధరిస్తారు. దీక్ష ముగిసేదాకా తీయరు." }),
    S({ roman: "Food", deva: "आहार", tel: "ఆహారం" },
      { roman: "One cooked meal a day, sattvika, without onion or garlic. No meat, no drink, no tobacco.", deva: "दिन में एक बार सात्त्विक भोजन, बिना प्याज़-लहसुन। मांस, मद्य, तम्बाकू वर्जित।", tel: "రోజుకు ఒక పూట సాత్త్విక భోజనం, ఉల్లి వెల్లుల్లి లేకుండా. మాంసం, మద్యం, పొగాకు ఉండవు." }),
    S({ roman: "Conduct", deva: "आचरण", tel: "నడవడి" },
      { roman: "Brahmacarya. Bare feet or plain footwear. Sleep on the floor. No harsh words.", deva: "ब्रह्मचर्य। नंगे पाँव या साधारण पादुका। भूमि पर शयन। कठोर वचन नहीं।", tel: "బ్రహ్మచర్యం. చెప్పులు లేకుండా లేదా సాధారణ చెప్పులు. నేలపై నిద్ర. కటువైన మాట లేదు." }),
    S({ roman: "Pūjā", deva: "पूजा", tel: "పూజ" },
      { roman: "Bath before dawn and at dusk. The deity's names or the given stotra, twice a day, with the lamp.", deva: "प्रातः और सन्ध्या स्नान। दिन में दो बार दीप के साथ नाम या दिया गया स्तोत्र।", tel: "వేకువన, సాయంత్రం స్నానం. రోజుకు రెండు పూటలు దీపంతో నామాలు లేదా ఇచ్చిన స్తోత్రం." }),
  ];

  const entries = [
    {
      id: "ayyappa-mandala", masa: [MASA.kartika, MASA.margashirsha], deity: "vishnu", brief: true, kind: "vratam", type: "diksha", quiet: true,
      name: { roman: "Ayyappa Maṇḍala Vratam", deva: "अय्यप्प मण्डल व्रतम्", tel: "అయ్యప్ప మండల దీక్ష" },
      rule: { roman: "Forty-one days from Vṛścika Saṅkrānti, the first of the Malayalam month Vṛścikam.", deva: "वृश्चिक सङ्क्रान्ति से इकतालीस दिन।", tel: "వృశ్చిక సంక్రాంతి నుంచి నలభై ఒక్క రోజులు." },
      find: (y) => { try { return P().sankrantiDay(y, 7); } catch (e) { return null; } }, days: 41,
      tagline: { roman: "The black cloth, the mālā, and the irumudi. The dīkṣā ends at Śabarimalai, or at the local Ayyappa temple with the guru-svāmi.",
                 tel: "నల్ల వస్త్రం, మాల, ఇరుముడి. దీక్ష శబరిమలలో లేదా గురుస్వామితో ఊరి అయ్యప్ప గుడిలో ముగుస్తుంది." },
      vidhi: common.concat([S({ roman: "Address", deva: "सम्बोधन", tel: "సంబోధన" },
        { roman: "Every other dīkṣādhāri is called Svāmi; the greeting is Svāmiye Śaraṇam Ayyappā.", deva: "प्रत्येक दीक्षाधारी को स्वामी कहते हैं; अभिवादन स्वामिये शरणम् अय्यप्पा।", tel: "దీక్షలో ఉన్న ప్రతివారినీ స్వామి అని పిలుస్తారు; పలకరింపు స్వామియే శరణం అయ్యప్పా." })]),
    },
    {
      id: "bhavani-diksha", masa: [MASA.bhadrapada, MASA.ashvina], deity: "devi", brief: true, kind: "vratam", type: "diksha", quiet: true,
      name: { roman: "Bhavānī Dīkṣā", deva: "भवानी दीक्षा", tel: "భవానీ దీక్ష" },
      rule: { roman: "Forty-one days, ending on Vijayadaśamī. Some take twenty-one or eleven days.", deva: "इकतालीस दिन, विजयदशमी को समाप्त। कुछ इक्कीस या ग्यारह दिन लेते हैं।", tel: "నలభై ఒక్క రోజులు, విజయదశమితో ముగుస్తుంది. కొందరు ఇరవై ఒకటి లేదా పదకొండు రోజులు తీసుకుంటారు." },
      find: L(MASA.ashvina, 9), days: 41, lead: 40,
      tagline: { roman: "The red cloth and the mālā of Kanaka Durgā of Vijayavāḍa. The dīkṣā ends on Indrakīlādri at Dasarā.",
                 tel: "విజయవాడ కనకదుర్గమ్మ ఎర్ర వస్త్రం, మాల. దీక్ష దసరాకు ఇంద్రకీలాద్రిపై ముగుస్తుంది." },
      vidhi: common,
    },
    {
      id: "kedara-gauri-diksha", udyapana: true, masa: MASA.ashvina, deity: "shiva", brief: true, kind: "vratam", type: "diksha", quiet: true,
      name: { roman: "Kedāra Gaurī Dīkṣā", deva: "केदार गौरी दीक्षा", tel: "కేదార గౌరీ దీక్ష" },
      rule: { roman: "Twenty-one days, ending on Dīpāvalī Amāvāsyā.", deva: "इक्कीस दिन, दीपावली अमावस्या को समाप्त।", tel: "ఇరవై ఒక్క రోజులు, దీపావళి అమావాస్యతో ముగుస్తుంది." },
      find: L(MASA.ashvina, 29, "pradosha"), days: 21, lead: 20,
      tagline: { roman: "The twenty-one-strand thread and the mālā. Twenty-one of each offering, the pūjā daily, and the udyāpana on Amāvāsyā at the Śiva temple. The one-day Kedāreśvara Vratam is under Nomus.",
                 tel: "ఇరవై ఒక్క పోగుల తోరం, మాల. ఒక్కొక్కటి ఇరవై ఒకటి, రోజూ పూజ, అమావాస్య నాడు శివాలయంలో ఉద్యాపన. ఒక రోజు కేదారేశ్వర వ్రతం నోములలో ఉంది." },
      vidhi: common,
    },
    {
      id: "hanuman-diksha", masa: [MASA.caitra, MASA.vaisakha], deity: "hanuman", brief: true, kind: "vratam", type: "diksha", quiet: true,
      name: { roman: "Hanumān Dīkṣā", deva: "हनुमान् दीक्षा", tel: "హనుమాన్ దీక్ష" },
      rule: { roman: "Forty-one days, ending on Hanumān Jayantī, Vaiśākha Kṛṣṇa Daśamī in the Telugu reckoning.", deva: "इकतालीस दिन, तेलुगु गणना की हनुमान् जयन्ती, वैशाख कृष्ण दशमी को समाप्त।", tel: "నలభై ఒక్క రోజులు, వైశాఖ బహుళ దశమి హనుమాన్ జయంతితో ముగుస్తుంది." },
      find: L(MASA.vaisakha, 24), days: 41, lead: 40,
      tagline: { roman: "The saffron cloth and the mālā. The dīkṣā ends at Koṇḍagaṭṭu or the family's Hanumān temple with the Cālīsā and the Sundarakāṇḍa.",
                 tel: "కాషాయ వస్త్రం, మాల. దీక్ష కొండగట్టులో లేదా ఇంటి హనుమాన్ గుడిలో చాలీసా, సుందరకాండతో ముగుస్తుంది." },
      vidhi: common,
    },
    Object.assign({
      id: "govinda-mala", floating: true, days: 41, deity: "vishnu", brief: true, kind: "vratam", type: "diksha", optional: true,
      name: { roman: "Govinda Mālā · Veṅkaṭeśvara Dīkṣā", deva: "गोविन्द माला · वेङ्कटेश्वर दीक्षा", tel: "గోవింద మాల · వేంకటేశ్వర దీక్ష" },
      rule: { roman: "Begun on a Saturday. The length is set by the guru, often forty-one days, and ends at Tirumala or the local Veṅkaṭeśvara temple.",
              deva: "शनिवार से आरम्भ। अवधि गुरु तय करते हैं, प्रायः इकतालीस दिन; तिरुमला या स्थानीय वेङ्कटेश्वर मन्दिर में समाप्त।",
              tel: "శనివారం మొదలు. కాలం గురువు నిర్ణయిస్తారు, తరచుగా నలభై ఒక్క రోజులు; తిరుమలలో లేదా ఊరి వేంకటేశ్వర గుడిలో ముగుస్తుంది." },
      tagline: { roman: "The blue cloth and the tulasī mālā. The Govinda nāmas morning and evening.",
                 tel: "నీలి వస్త్రం, తులసి మాల. ఉదయం, సాయంత్రం గోవింద నామాలు." },
      vidhi: common,
    }, { weekly: 6, window: (y) => [new Date(y, 0, 1), new Date(y, 11, 31)], find: (y) => { const d = new Date(y, 0, 1); while (d.getDay() !== 6) d.setDate(d.getDate() + 1); return d; } }),
  ];

  return { entries, bind: (fns) => { lunar = fns.lunar; } };
})();

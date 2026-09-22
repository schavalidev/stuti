/* ============================================================
   STUTI — fixed-count vows
   A cycle is a vow kept a set number of times: seven Saturdays,
   sixteen Mondays, twenty-one days, fourteen years. It has no date of
   its own. The devotee chooses a start; the app shows the next day on
   which one could begin, and the count. Counts, start rules and the
   udyāpana differ by the book a family follows, and this file says so
   in every rule. Joined into STUTI_VRATA the same way the parva dinams
   are; the tithi finders are lent at bind time.
   ============================================================ */
window.STUTI_CYCLE_EXTRA = (function () {
  const P = () => window.AKSHARA_PANCHANGA;
  const MASA = { shravana: 4, bhadrapada: 5, ashvina: 6, kartika: 7 };
  let lunar = null, monthStart = null;
  const L = (m, ti, rule) => (y) => (lunar ? lunar(y, m, ti, rule) : null);
  /* any week of the year: the next such weekday is a day one could begin.
     `floating` marks a vow bound to no month: the lens lists it apart, and
     the bell asks which month to keep it in */
  const anyWeek = (wd) => ({
    weekly: wd,
    window: (y) => [new Date(y, 0, 1), new Date(y, 11, 31)],
    find: (y) => { const d = new Date(y, 0, 1); while (d.getDay() !== wd) d.setDate(d.getDate() + 1); return d; },
  });
  const weeklyIn = (m, wd) => ({
    weekly: wd,
    window: (y) => { const s = monthStart(y, m); if (!s) return null; const e = new Date(s); e.setDate(e.getDate() + 29); return [s, e]; },
    find: (y) => { const d = monthStart(y, m); if (!d) return null; while (d.getDay() !== wd) d.setDate(d.getDate() + 1); return d; },
  });

  const entries = [
    Object.assign({
      id: "sapta-shanivara", floating: true, count: 7, deity: "vishnu", brief: true, kind: "vratam", type: "cycle",
      name: { roman: "Sapta Śanivāra Vratam", deva: "सप्त शनिवार व्रतम्", tel: "సప్త శనివార వ్రతం" },
      rule: { roman: "Seven Saturdays in a row, begun on any Saturday. Many begin in Śrāvaṇa or Kārtika.",
              deva: "लगातार सात शनिवार, किसी भी शनिवार से आरम्भ। बहुत लोग श्रावण या कार्तिक में आरम्भ करते हैं।",
              tel: "వరుసగా ఏడు శనివారాలు, ఏ శనివారం నుంచైనా మొదలుపెట్టవచ్చు. చాలామంది శ్రావణంలో లేదా కార్తికంలో మొదలుపెడతారు." },
      tagline: { roman: "Seven Saturdays to Śrī Veṅkaṭeśvara. One meal a day, the lamp at dusk, the Suprabhātam or the Govinda nāmas.",
                 tel: "శ్రీ వేంకటేశ్వరునికి ఏడు శనివారాలు. రోజుకు ఒక పూట భోజనం, సాయంత్రం దీపం, సుప్రభాతం లేదా గోవింద నామాలు." },
      who: { roman: "Kept by the household or by one member on its behalf. The count is not broken for illness; the missed Saturday is added at the end.",
             tel: "ఇల్లంతా లేదా ఇంటి తరఫున ఒకరు చేస్తారు. అనారోగ్యంతో తప్పిన శనివారం చివరన కలుపుతారు; లెక్క తెగదు." },
    }, anyWeek(6)),
    Object.assign({
      id: "ekadasha-somavara", floating: true, count: 11, deity: "shiva", brief: true, kind: "vratam", type: "cycle",
      name: { roman: "Ekādaśa Somavāra Vratam", deva: "एकादश सोमवार व्रतम्", tel: "ఏకాదశ సోమవార వ్రతం" },
      rule: { roman: "Eleven Mondays in a row, begun on any Monday. Śrāvaṇa and Kārtika are favoured.",
              deva: "लगातार ग्यारह सोमवार, किसी भी सोमवार से आरम्भ। श्रावण और कार्तिक श्रेष्ठ माने जाते हैं।",
              tel: "వరుసగా పదకొండు సోమవారాలు, ఏ సోమవారం నుంచైనా. శ్రావణం, కార్తికం శ్రేష్ఠం." },
      tagline: { roman: "Eleven Mondays to Śiva. Fast through the day, abhiṣeka and the lamp in the evening, one meal after.",
                 tel: "శివునికి పదకొండు సోమవారాలు. పగలు ఉపవాసం, సాయంత్రం అభిషేకం, దీపం, ఆ తరువాత ఒక పూట భోజనం." },
    }, anyWeek(1)),
    Object.assign({
      id: "shodasha-somavara", floating: true, count: 16, udyapana: true, deity: "shiva", brief: true, kind: "vratam", type: "cycle",
      name: { roman: "Ṣoḍaśa Somavāra Vratam", deva: "षोडश सोमवार व्रतम्", tel: "షోడశ సోమవార వ్రతం" },
      rule: { roman: "Sixteen Mondays in a row, begun on any Monday. The udyāpana is on the seventeenth.",
              deva: "लगातार सोलह सोमवार, किसी भी सोमवार से आरम्भ। सत्रहवें सोमवार को उद्यापन।",
              tel: "వరుసగా పదహారు సోమవారాలు, ఏ సోమవారం నుంచైనా. పదిహేడవ సోమవారం ఉద్యాపన." },
      tagline: { roman: "Sixteen Mondays to Śiva and Pārvatī. The kathā is read each Monday; the procedure differs by the book followed.",
                 tel: "శివపార్వతులకు పదహారు సోమవారాలు. ప్రతి సోమవారం కథ చదువుతారు; విధి పుస్తకాన్ని బట్టి మారుతుంది." },
    }, anyWeek(1)),
    Object.assign({
      id: "vaibhava-lakshmi", floating: true, count: 11, deity: "devi", brief: true, kind: "vratam", type: "cycle",
      name: { roman: "Vaibhava Lakṣmī Vratam", deva: "वैभव लक्ष्मी व्रतम्", tel: "వైభవ లక్ష్మీ వ్రతం" },
      rule: { roman: "Eleven or twenty-one Fridays in a row, begun on any Friday.",
              deva: "लगातार ग्यारह या इक्कीस शुक्रवार, किसी भी शुक्रवार से आरम्भ।",
              tel: "వరుసగా పదకొండు లేదా ఇరవై ఒక్క శుక్రవారాలు, ఏ శుక్రవారం నుంచైనా." },
      tagline: { roman: "Fridays to Mahālakṣmī, following a modern booklet. A gold ornament is placed before her; the kathā is read; sweets are offered.",
                 tel: "మహాలక్ష్మికి శుక్రవారాలు, ఇటీవలి పుస్తకం ప్రకారం. ఆమె ముందు బంగారు నగ ఉంచి కథ చదువుతారు; మధురం నివేదిస్తారు." },
    }, anyWeek(5)),
    Object.assign({
      id: "mangala-gauri-5", masa: MASA.shravana, deity: "devi", brief: true, kind: "vratam", type: "cycle", quiet: true,
      name: { roman: "Pañcavārṣika Maṅgaḷa Gaurī Vratam", deva: "पञ्चवार्षिक मङ्गल गौरी व्रतम्", tel: "పంచవార్షిక మంగళ గౌరీ వ్రతం" },
      rule: { roman: "Every Tuesday of Śrāvaṇa, for the first five years after marriage. The udyāpana is in the fifth year.",
              deva: "विवाह के बाद पाँच वर्ष तक श्रावण के प्रत्येक मङ्गलवार। पाँचवें वर्ष उद्यापन।",
              tel: "పెళ్ళయిన తరువాత అయిదేళ్ళు, శ్రావణంలోని ప్రతి మంగళవారం. అయిదవ ఏట ఉద్యాపన." },
      tagline: { roman: "The same Tuesday pūjā as Maṅgaḷa Gaurī, kept as a five-year cycle. The number of years follows the family.",
                 tel: "మంగళ గౌరీ మంగళవార పూజే, అయిదేళ్ళ నోముగా. ఏళ్ళ లెక్క కుటుంబాన్ని బట్టి." },
    }, weeklyIn(MASA.shravana, 2)),
    {
      id: "ananta-padmanabha-14", masa: MASA.bhadrapada, deity: "vishnu", brief: true, kind: "vratam", type: "cycle", quiet: true,
      name: { roman: "Ananta Padmanābha Vratam", deva: "अनन्त पद्मनाभ व्रतम्", tel: "అనంత పద్మనాభ వ్రతం" },
      rule: { roman: "Bhādrapada · Śukla Caturdaśī, each year for fourteen years. The udyāpana is in the fourteenth.",
              deva: "भाद्रपद शुक्ल चतुर्दशी, चौदह वर्ष तक प्रति वर्ष। चौदहवें वर्ष उद्यापन।",
              tel: "భాద్రపద శుద్ధ చతుర్దశి, పద్నాలుగేళ్ళు ప్రతి ఏటా. పద్నాలుగవ ఏట ఉద్యాపన." },
      find: L(MASA.bhadrapada, 13),
      tagline: { roman: "The annual Ananta Caturdaśī kept as a continued vow. The fourteen-knot thread is renewed each year. Some families keep it once; the count is not a rule for all.",
                 tel: "ఏటా చేసే అనంత చతుర్దశిని కొనసాగించే నోము. పద్నాలుగు ముడుల తోరం ఏటా మారుస్తారు. కొన్ని కుటుంబాలు ఒక్కసారే చేస్తారు; పద్నాలుగు అన్నది అందరికీ నియమం కాదు." },
    },
    {
      id: "kartika-dipa-damodara", masa: MASA.kartika, deity: "vishnu", brief: true, type: "seasonal", quiet: true,
      name: { roman: "Kārtika Dīpam · Dāmodara Māsa", deva: "कार्तिक दीप · दामोदर मास", tel: "కార్తిక దీపం · దామోదర మాసం" },
      rule: { roman: "Every day of Kārtika, from Pratipadā to Pūrṇimā and on.", deva: "कार्तिक के प्रत्येक दिन, प्रतिपदा से पूर्णिमा तक और आगे।", tel: "కార్తికమాసంలో ప్రతి రోజు, పాడ్యమి నుంచి పౌర్ణమి దాకా, ఆపైన." },
      find: (y) => (monthStart ? monthStart(y, MASA.kartika) : null), days: 30,
      tagline: { roman: "A lamp at dawn and at dusk through the month, at the door, at the tulasī, and at the temple. Vaiṣṇavas offer it to Dāmodara; Śaivas keep the same lamp for Śiva.",
                 tel: "నెలంతా ఉదయం, సాయంత్రం దీపం — గుమ్మంలో, తులసి దగ్గర, గుడిలో. వైష్ణవులు దామోదరునికి; శైవులు అదే దీపం శివునికి." },
    },
  ];

  return { entries, bind: (fns) => { lunar = fns.lunar; monthStart = fns.monthStart; } };
})();

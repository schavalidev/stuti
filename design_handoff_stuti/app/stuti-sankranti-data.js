/* ============================================================
   STUTI — the sun's own days
   Every other observance in this app is lunar: a tithi inside a
   named month. These six are not. They are saṅkramaṇas — the
   instants the sun crosses from one rāśi into the next — and the
   tithi-based finder cannot produce them at any price. That is why
   Makara Saṅkrānti sat missing from a calendar that knew, to the
   minute, when the sun entered Makara.

   Each one asks the engine for its transit and for the civil day
   the puṇyakāla falls on. Because they are solar they barely move
   in the Gregorian year — mid-January, mid-April — while every
   lunar festival wanders a month either way.

   Concatenated into the vrata list by stuti-vrata-data.js, so they
   flow into the calendar, the upcoming list and the day sheets
   with no special casing anywhere.
   ============================================================ */
window.STUTI_SANKRANTI = (function () {
  const P = () => window.AKSHARA_PANCHANGA;
  /* rāśi indices, as the engine numbers them: Meṣa 0 … Mīna 11 */
  const R = { mesha: 0, karka: 3, kanya: 5, tula: 6, dhanu: 8, makara: 9 };
  const on = (rashi) => (y) => { try { return P().sankrantiDay(y, rashi); } catch (e) { return null; } };

  const entries = [
    /* ---------------------------------------------------------- */
    {
      id: "makara-sankranti", deity: "surya", solar: R.makara,
      name: { roman: "Makara Saṅkrānti", deva: "मकर सङ्क्रान्ति", tel: "మకర సంక్రాంతి" },
      rule: { roman: "The sun enters Makara — Uttarāyaṇa begins", deva: "सूर्य का मकर प्रवेश — उत्तरायण आरम्भ", tel: "సూర్యుడు మకరంలో ప్రవేశం — ఉత్తరాయణ ఆరంభం" },
      find: on(R.makara),
      duration: { roman: "One day; kept as four in Tamil households, from Bhogi to Kāṇum", tel: "ఒక రోజు; తమిళ ఇళ్లలో భోగి నుండి కాణుం వరకు నాలుగు రోజులు" },
      tagline: { roman: "The sun turns north. The only major festival fixed to the sun rather than the moon — which is why it holds to mid-January while everything else wanders.",
                 tel: "సూర్యుడు ఉత్తరాభిముఖుడవుతాడు. చంద్రుని కాక సూర్యుని బట్టి నిర్ణయమయ్యే ఒకే ఒక పెద్ద పండుగ — అందుకే ఇది జనవరి మధ్యలోనే నిలుస్తుంది." },
      who: { roman: "Kept across the whole country under different names — Saṅkrānti, Poṅgal, Lohṛī, Māgha Bihu, Uttarāyaṇ, Khicaṛī.",
             tel: "దేశమంతటా వేర్వేరు పేర్లతో — సంక్రాంతి, పొంగల్, లోహ్రీ, మాఘ బిహు, ఉత్తరాయణ్, ఖిచడీ." },
      significance: [
        { roman: "Uttarāyaṇa is the devayāna, the gods' half of the year; the six months it opens are held fit for every auspicious undertaking.", tel: "ఉత్తరాయణం దేవయానం, సంవత్సరపు దేవభాగం; ఇది ప్రారంభించే ఆరు నెలలు శుభకార్యాలకు యోగ్యమైనవి." },
        { roman: "The puṇyakāla is the bathing and giving hour around the transit — sesame, jaggery, a blanket, ghee, and food to whoever asks.", tel: "సంక్రమణ సమయపు స్నాన దాన పుణ్యకాలం — నువ్వులు, బెల్లం, కంబళి, నెయ్యి, అడిగినవారికి అన్నం." },
        { roman: "Sesame and jaggery are the day's own foods, and its own courtesy: take the til and the gur, and speak sweetly.", tel: "నువ్వులు, బెల్లం ఈ రోజు ఆహారమూ, మర్యాదా: నువ్వుండ తీసుకో, తీయగా మాట్లాడు." },
      ],
      timeline: [
        { t: { roman: "The eve — Bhogi", tel: "ముందు రోజు — భోగి" }, d: { roman: "The old is burnt: worn things onto the bonfire before dawn, and the house swept out for the turning year.", tel: "పాతది దహనం: తెల్లవారుజామున భోగి మంటలో పాత సామాను, ఇల్లు శుభ్రం." } },
        { t: { roman: "Before the transit", tel: "సంక్రమణానికి ముందు" }, d: { roman: "Bathe — in a river if one is near, with sesame in the water if not. New cloth. Ancestors are remembered with tarpaṇa.", tel: "స్నానం — నది దగ్గరుంటే నదిలో, లేకుంటే నీటిలో నువ్వులు వేసుకుని. కొత్త బట్టలు. పితృ తర్పణం." } },
        { t: { roman: "The puṇyakāla", tel: "పుణ్యకాలం" }, d: { roman: "Sūrya is offered arghya and the Gāyatrī; then the giving — sesame, jaggery, rice, cloth, and a blanket to someone who needs one.", tel: "సూర్యునికి అర్ఘ్యం, గాయత్రీ; తరువాత దానం — నువ్వులు, బెల్లం, బియ్యం, వస్త్రం, అవసరమైనవారికి కంబళి." } },
        { t: { roman: "The day after — Kanuma", tel: "మరునాడు — కనుమ" }, d: { roman: "The cattle are washed, painted and garlanded; nothing is asked of them. In Tamil households this is Māṭṭu Poṅgal.", tel: "పశువులకు స్నానం, రంగులు, పూలదండలు; ఆ రోజు వాటిపై పని లేదు. తమిళ ఇళ్లలో మాట్టు పొంగల్." } },
      ],
      samagri: [
        { roman: "Sesame — white and black — and jaggery", tel: "నువ్వులు — తెల్లవి, నల్లవి — బెల్లం" },
        { roman: "New rice, moong dal and jaggery for the pongal", tel: "పొంగలికి కొత్త బియ్యం, పెసరపప్పు, బెల్లం" },
        { roman: "Sugarcane, turmeric with the root, bananas", tel: "చెరకు, కొమ్ములతో పసుపు, అరటిపండ్లు" },
        { roman: "A blanket, cloth or ghee to give away", tel: "దానం చేయడానికి కంబళి, వస్త్రం లేదా నెయ్యి" },
        { roman: "Rangoli powders and cow dung for the gobbemma", tel: "ముగ్గు పిండి, గొబ్బెమ్మలకు ఆవు పేడ" },
      ],
      stotras: [{ deity: "surya", m: "aditya" }, { deity: "surya", m: "japakusuma" }, { deity: "surya", m: "surya astakam" }],
      dos: [
        { roman: "Bathe before the transit, not after — the puṇyakāla is for giving, and one gives clean.", tel: "సంక్రమణానికి ముందే స్నానం — పుణ్యకాలం దానానికి; శుచిగా దానం చేయాలి." },
        { roman: "Give something warm. In the coldest fortnight of the year the blanket is the point, not the symbol.", tel: "వెచ్చనిదేదో ఇవ్వాలి. ఏటిలో అతి చలి పక్షంలో కంబళి ప్రతీక కాదు, అవసరం." },
        { roman: "Feed the cattle and the birds first on Kanuma.", tel: "కనుమనాడు మొదట పశువులకు, పక్షులకు ఆహారం." },
      ],
      donts: [
        { roman: "Do not set out on a journey on Kanuma — the day is for the household and its animals.", tel: "కనుమనాడు ప్రయాణం చేయరాదు — ఆ రోజు ఇంటికి, ఇంటి జంతువులకు." },
        { roman: "Do not turn away anyone who comes to the door on Saṅkrānti.", tel: "సంక్రాంతినాడు ఇంటికి వచ్చినవారిని తిప్పి పంపరాదు." },
      ],
      source: { roman: "Following Telugu household practice; the four-day sequence and the names differ across Tamil Nadu, Maharashtra, Punjab and Assam.", tel: "తెలుగు గృహాచారం ప్రకారం; నాలుగు రోజుల క్రమం, పేర్లు తమిళనాడు, మహారాష్ట్ర, పంజాబ్, అస్సాంలలో మారుతాయి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "mesha-sankranti", deity: "surya", solar: R.mesha,
      name: { roman: "Meṣa Saṅkrānti", deva: "मेष सङ्क्रान्ति", tel: "మేష సంక్రాంతి" },
      rule: { roman: "The sun enters Meṣa — the solar year begins", deva: "सूर्य का मेष प्रवेश — सौर वर्षारम्भ", tel: "సూర్యుడు మేషంలో ప్రవేశం — సౌర సంవత్సరారంభం" },
      find: on(R.mesha),
      duration: { roman: "One day", tel: "ఒక రోజు" },
      tagline: { roman: "The sun returns to the first degree of the zodiac. Half of India keeps its new year here — and keeps it on the same date every year, because the sun does not wander.",
                 tel: "సూర్యుడు రాశిచక్రపు మొదటి అంశకు తిరిగివస్తాడు. భారతదేశంలో సగం మంది ఇక్కడే నూతన సంవత్సరం జరుపుకుంటారు — సూర్యుడు తిరుగాడడు కాబట్టి ఏటా అదే తేదీన." },
      who: { roman: "The solar new year of Tamil Nadu, Kerala, Bengal, Assam, Odisha and Punjab — Puthāṇḍu, Viṣu, Poilā Boiśākh, Bohāg Bihu, Paṇā Saṅkrānti, Baisākhī.",
             tel: "తమిళనాడు, కేరళ, బెంగాల్, అస్సాం, ఒడిశా, పంజాబ్ సౌర నూతన సంవత్సరం — పుత్తాండు, విషు, పొయిలా బోయిశాఖ్, బోహాగ్ బిహు, పణా సంక్రాంతి, బైసాఖీ." },
      significance: [
        { roman: "Meṣa is the head of the zodiac, so this transit is the viṣuva — the balance point the solar calendar counts from.", tel: "మేషం రాశిచక్రపు శిరస్సు; ఈ సంక్రమణం విషువం — సౌర పంచాంగం లెక్కించే సమతౌల్య బిందువు." },
        { roman: "In Kerala the first thing seen on waking is arranged the night before — the viṣu-kaṇi of grain, gold, fruit, mirror and lamp. What the year is met with, it returns.", tel: "కేరళలో మేల్కొన్నప్పుడు మొదట కనిపించేది రాత్రే సిద్ధం చేస్తారు — ధాన్యం, బంగారం, పండ్లు, అద్దం, దీపంతో విషు-కణి. సంవత్సరాన్ని ఎలా ఎదుర్కొంటే అదే తిరిగివస్తుంది." },
        { roman: "The pañcāṅga for the coming year is read aloud on this day in Tamil households — the year's almanac, opened in company.", tel: "తమిళ ఇళ్లలో ఈ రోజు రాబోయే సంవత్సర పంచాంగ పఠనం — అందరి మధ్య సంవత్సర పంచాంగం తెరవడం." },
      ],
      timeline: [
        { t: { roman: "The night before", tel: "ముందు రాత్రి" }, d: { roman: "Set out the kaṇi or the auspicious tray — grain, fruit, coin, mirror, a lamp — to be the first sight of the year.", tel: "కణి లేదా శుభ పాత్రను సిద్ధం చేయాలి — ధాన్యం, పండ్లు, నాణెం, అద్దం, దీపం — సంవత్సరపు మొదటి దృశ్యంగా." },
        },
        { t: { roman: "At dawn", tel: "వేకువన" }, d: { roman: "Bathe, light the lamp, and look on the kaṇi before anything else. Elders give the year's first coin to the young.", tel: "స్నానం, దీపం, అన్నిటికన్నా ముందు కణి దర్శనం. పెద్దలు చిన్నవారికి సంవత్సరపు తొలి నాణెం ఇస్తారు." } },
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Sūrya-arghya and the pañcāṅga reading; the year's fortunes and the harvest are heard together.", tel: "సూర్యార్ఘ్యం, పంచాంగ పఠనం; సంవత్సర ఫలాలు, పంట కలిసి వింటారు." } },
        { t: { roman: "The meal", tel: "భోజనం" }, d: { roman: "All six tastes on one leaf — bitter with the sweet, deliberately. The year will hold both.", tel: "ఒక ఆకులో ఆరు రుచులు — తీపితో పాటు చేదు, ఉద్దేశపూర్వకంగా. సంవత్సరం రెండూ కలిగి ఉంటుంది." } },
      ],
      samagri: [
        { roman: "New rice, jaggery, raw mango, neem flower, tamarind, salt and chilli — the six tastes", tel: "కొత్త బియ్యం, బెల్లం, పచ్చి మామిడి, వేప పువ్వు, చింతపండు, ఉప్పు, మిరప — ఆరు రుచులు" },
        { roman: "A mirror, a gold ornament, a coin, an uncut fruit", tel: "అద్దం, బంగారు నగ, నాణెం, కోయని పండు" },
        { roman: "The year's new pañcāṅga", tel: "సంవత్సరపు కొత్త పంచాంగం" },
        { roman: "Mango leaves and flowers for the doorway", tel: "గుమ్మానికి మామిడాకులు, పూలు" },
      ],
      stotras: [{ deity: "surya", m: "aditya" }, { deity: "surya", m: "japakusuma" }, { deity: "vishnu", m: "sahasranama" }],
      dos: [
        { roman: "Arrange the first sight the night before. The point is that the year is met deliberately, not stumbled into.", tel: "మొదటి దృశ్యాన్ని ముందు రాత్రే సిద్ధం చేయాలి. సంవత్సరాన్ని ఉద్దేశపూర్వకంగా ఎదుర్కోవాలి, తడబడి కాదు." },
        { roman: "Include the bitter taste in the meal — neem flower with the jaggery.", tel: "భోజనంలో చేదు ఉండాలి — బెల్లంతో పాటు వేప పువ్వు." },
      ],
      donts: [
        { roman: "Do not quarrel or settle accounts on this day; what the year opens with, it repeats.", tel: "ఈ రోజు కలహం, లెక్కల తగాదా వద్దు; సంవత్సరం ఏమితో మొదలైతే అదే పునరావృతమవుతుంది." },
      ],
      source: { roman: "Composite of Tamil and Malayalam practice; Bengal, Assam, Odisha and Punjab keep the same transit with quite different customs.", tel: "తమిళ, మలయాళ ఆచారాల సమాహారం; బెంగాల్, అస్సాం, ఒడిశా, పంజాబ్ అదే సంక్రమణాన్ని వేరే ఆచారాలతో జరుపుకుంటాయి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "karka-sankranti", deity: "surya", solar: R.karka,
      name: { roman: "Karka Saṅkrānti", deva: "कर्क सङ्क्रान्ति", tel: "కర్కాటక సంక్రాంతి" },
      rule: { roman: "The sun enters Karka — Dakṣiṇāyana begins", deva: "सूर्य का कर्क प्रवेश — दक्षिणायन आरम्भ", tel: "సూర్యుడు కర్కాటకంలో ప్రవేశం — దక్షిణాయన ఆరంభం" },
      find: on(R.karka),
      duration: { roman: "One day; the month it opens is kept for the ancestors", tel: "ఒక రోజు; ఇది ప్రారంభించే మాసం పితరులకు" },
      tagline: { roman: "The sun turns south and the gods' night begins. The half of the year in which one does less, and remembers more.",
                 tel: "సూర్యుడు దక్షిణాభిముఖుడవుతాడు, దేవరాత్రి మొదలవుతుంది. తక్కువ చేసి, ఎక్కువ స్మరించే అర్ధ సంవత్సరం." },
      who: { roman: "Marked in Tamil Nadu as the opening of Āḍi, in Kerala as Karkiḍakam, and by anyone who keeps the pitṛ observances.",
             tel: "తమిళనాడులో ఆడి ఆరంభంగా, కేరళలో కర్కిడకంగా, పితృ కర్మలు ఆచరించే అందరూ." },
      significance: [
        { roman: "Dakṣiṇāyana is the pitṛyāna — the ancestors' road. Tarpaṇa on this day carries further than on most.", tel: "దక్షిణాయనం పితృయానం — పితరుల మార్గం. ఈ రోజు తర్పణం మిగిలిన రోజులకన్నా దూరం చేరుతుంది." },
        { roman: "Āḍi and Karkiḍakam are held inauspicious for weddings and new ventures — not from ill omen but because the monsoon is the season to consolidate, not to begin.", tel: "ఆడి, కర్కిడకం పెళ్లిళ్లకు, కొత్త పనులకు అనుకూలం కాదు — అపశకునం వల్ల కాదు, వర్షాకాలం కూర్చుకునే కాలం, ప్రారంభించే కాలం కాదు." },
        { roman: "In Kerala the whole month is given to reading the Rāmāyaṇa through, a little each evening.", tel: "కేరళలో నెలంతా రామాయణ పారాయణం, ప్రతి సాయంత్రం కొంచెం." },
      ],
      timeline: [
        { t: { roman: "At dawn", tel: "వేకువన" }, d: { roman: "Bathe and offer arghya; the transit day is a snāna-dāna day like every saṅkramaṇa.", tel: "స్నానం, అర్ఘ్యం; ప్రతి సంక్రమణం లాగే ఇదీ స్నాన దాన దినం." } },
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Tarpaṇa for the ancestors, with sesame and water, facing south.", tel: "దక్షిణాభిముఖంగా నువ్వులు, నీటితో పితృ తర్పణం." } },
        { t: { roman: "Through the month", tel: "మాసమంతా" }, d: { roman: "Begin the Rāmāyaṇa, or a daily reading of one's own choosing, and hold to it till the next transit.", tel: "రామాయణం లేదా తనకు ఇష్టమైన నిత్య పారాయణం మొదలుపెట్టి, తరువాతి సంక్రమణం వరకు కొనసాగించాలి." } },
      ],
      stotras: [{ deity: "surya", m: "aditya" }, { deity: "vishnu", m: "rama" }, { deity: "vishnu", m: "sahasranama" }],
      dos: [
        { roman: "Offer tarpaṇa if you know the rite; if not, give food in the ancestors' name.", tel: "విధి తెలిస్తే తర్పణం; తెలియకపోతే పితరుల పేరున అన్నదానం." },
        { roman: "Start the reading you have been putting off. The month is built for it.", tel: "వాయిదా వేస్తున్న పారాయణం మొదలుపెట్టాలి. ఈ మాసం అందుకే." },
      ],
      donts: [
        { roman: "Weddings and house-warmings are held over past Āḍi in most southern families.", tel: "చాలా దక్షిణ కుటుంబాలలో పెళ్లిళ్లు, గృహప్రవేశాలు ఆడి దాటాకే." },
      ],
      source: { roman: "Following southern practice; the pitṛ observances vary considerably by sampradāya.", tel: "దక్షిణ ఆచారం ప్రకారం; పితృ కర్మలు సంప్రదాయాన్ని బట్టి బాగా మారతాయి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "kanya-sankranti", deity: "surya", solar: R.kanya,
      name: { roman: "Kanyā Saṅkrānti", deva: "कन्या सङ्क्रान्ति", tel: "కన్యా సంక్రాంతి" },
      rule: { roman: "The sun enters Kanyā", deva: "सूर्य का कन्या प्रवेश", tel: "సూర్యుడు కన్యలో ప్రవేశం" },
      find: on(R.kanya),
      duration: { roman: "One day", tel: "ఒక రోజు" },
      tagline: { roman: "Viśvakarmā's day — the tools are put down, cleaned, and worshipped as what they are.",
                 tel: "విశ్వకర్మ దినం — పనిముట్లు కింద పెట్టి, శుభ్రం చేసి, ఉన్నవి ఉన్నట్టుగా పూజిస్తారు." },
      who: { roman: "Kept by artisans, smiths, weavers, mechanics and engineers, chiefly in the east and north; and as Kanni saṅkramaṇa in Kerala.",
             tel: "శిల్పులు, కమ్మరులు, నేతపనివారు, మెకానిక్‌లు, ఇంజినీర్లు — ముఖ్యంగా తూర్పు, ఉత్తర భారతంలో; కేరళలో కన్ని సంక్రమణం." },
      significance: [
        { roman: "Viśvakarmā is the maker — of Indra's weapon, of the gods' chariots, of the first city. The craft is his, and so is the tool.", tel: "విశ్వకర్మ నిర్మాత — ఇంద్రుని ఆయుధం, దేవరథాలు, తొలి నగరం. శిల్పం ఆయనది, పనిముట్టూ ఆయనదే." },
        { roman: "This is the one day the workshop stops for its own sake: machines cleaned, oiled, garlanded, and left idle.", tel: "పనిశాల తన కోసమే ఆగే ఒకే ఒక రోజు: యంత్రాలు శుభ్రం, నూనె, పూలదండ, పని లేదు." },
        { roman: "Kanyā opens the fortnight in which the ancestors are remembered; the transit day itself is a snāna-dāna day.", tel: "కన్య పితృ స్మరణ పక్షాన్ని ప్రారంభిస్తుంది; సంక్రమణ దినం స్నాన దాన దినం." },
      ],
      timeline: [
        { t: { roman: "Morning", tel: "ఉదయం" }, d: { roman: "Clean the workspace and every tool in it before the pūjā — the cleaning is the pūjā's first half.", tel: "పూజకు ముందు పనిచోటు, ప్రతి పనిముట్టు శుభ్రం — శుభ్రతే పూజలో సగం." } },
        { t: { roman: "Pūjā", tel: "పూజ" }, d: { roman: "Viśvakarmā is invoked over the assembled tools; kalaśa, dhūpa, dīpa, and a red thread tied to each.", tel: "సమకూర్చిన పనిముట్లపై విశ్వకర్మ ఆవాహన; కలశం, ధూపం, దీపం, ప్రతి దానికి ఎర్రని దారం." } },
        { t: { roman: "The rest of the day", tel: "మిగిలిన రోజు" }, d: { roman: "No work with them. Prasāda is shared with everyone who works in the place.", tel: "వాటితో పని లేదు. ఆ చోట పనిచేసే అందరికీ ప్రసాదం." } },
      ],
      stotras: [{ deity: "surya", m: "aditya" }, { deity: "ganesha", m: "vakratu" }],
      dos: [
        { roman: "Include every tool, however humble — the broom belongs on the cloth beside the lathe.", tel: "ఎంత చిన్నదైనా ప్రతి పనిముట్టూ చేర్చాలి — చీపురుకూ లేత్ పక్కన వస్త్రంపై చోటు ఉంది." },
        { roman: "Feed those who work with you before eating.", tel: "తినే ముందు తనతో పనిచేసేవారికి పెట్టాలి." },
      ],
      donts: [
        { roman: "Do not use the tools once they have been worshipped, until the next day.", tel: "పూజ అయిన పనిముట్లను మరునాటి వరకు వాడరాదు." },
      ],
      source: { roman: "Following eastern and northern artisan practice; the date is the transit, not a tithi, so it holds to mid-September.", tel: "తూర్పు, ఉత్తర శిల్పి ఆచారం ప్రకారం; తేదీ సంక్రమణం, తిథి కాదు — కాబట్టి సెప్టెంబర్ మధ్యలోనే నిలుస్తుంది." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "tula-sankranti", deity: "surya", solar: R.tula,
      name: { roman: "Tulā Saṅkrānti", deva: "तुला सङ्क्रान्ति", tel: "తులా సంక్రాంతి" },
      rule: { roman: "The sun enters Tulā — Kāverī saṅkramaṇa", deva: "सूर्य का तुला प्रवेश — कावेरी सङ्क्रमण", tel: "సూర్యుడు తులలో ప్రవేశం — కావేరీ సంక్రమణం" },
      find: on(R.tula),
      duration: { roman: "One day; the Kāverī bathing month follows", tel: "ఒక రోజు; తరువాత కావేరీ స్నాన మాసం" },
      tagline: { roman: "At the moment of the transit the spring at Talakāverī rises of itself. The river's birthday, kept where it is born.",
                 tel: "సంక్రమణ క్షణంలో తలకావేరీ ఊట తానే పైకి ఉబుకుతుంది. నది పుట్టినరోజు, పుట్టిన చోటే." },
      who: { roman: "Kept through Kodagu and the Kāverī basin, and in Odisha as Garbhaṇa Saṅkrānti, when the paddy is in ear.",
             tel: "కొడగు, కావేరీ పరీవాహకంలో; ఒడిశాలో గర్భణ సంక్రాంతిగా, వరి ఈనే సమయంలో." },
      significance: [
        { roman: "Tulā is the second viṣuva, the balance opposite Meṣa — day and night level again, the year's other hinge.", tel: "తులం రెండవ విషువం, మేషానికి ఎదురుగా సమతౌల్యం — పగలు రాత్రి సమానం, సంవత్సరపు మరో మలుపు." },
        { roman: "Bathing in the Kāverī through the month that follows is held equal to bathing in the Gaṅgā.", tel: "తరువాతి మాసంలో కావేరీ స్నానం గంగా స్నానంతో సమానం." },
        { roman: "In Odisha the standing paddy is treated as a woman with child — the field is given turmeric, and nothing is cut.", tel: "ఒడిశాలో ఈనిన వరిని గర్భిణిగా భావిస్తారు — పొలానికి పసుపు, కోత లేదు." },
      ],
      timeline: [
        { t: { roman: "At the transit", tel: "సంక్రమణ సమయం" }, d: { roman: "Where the river is near, bathe at the hour itself; elsewhere, water from the household vessel with the river named over it.", tel: "నది దగ్గరుంటే ఆ ఘడియలోనే స్నానం; లేకుంటే ఇంటి పాత్రలోని నీటిపై నదిని స్మరించి." } },
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Arghya to Sūrya, and giving — rice, oil, a lamp; the harvest is close and the giving comes before it, not after.", tel: "సూర్యార్ఘ్యం, దానం — బియ్యం, నూనె, దీపం; పంట దగ్గరపడింది, దానం దానికి ముందే, తరువాత కాదు." } },
      ],
      stotras: [{ deity: "surya", m: "aditya" }, { deity: "devi", m: "sarva mangala" }],
      dos: [
        { roman: "Give from what is about to be harvested, not from what is already stored.", tel: "నిల్వ ఉన్నదానినుండి కాదు, కోయబోయే దానినుండి ఇవ్వాలి." },
      ],
      donts: [
        { roman: "Do not cut or harvest on this day where the crop is in ear.", tel: "పంట ఈనిన చోట ఈ రోజు కోత వద్దు." },
      ],
      source: { roman: "Kodagu and Odia practice; observed thinly elsewhere, though the transit is reckoned everywhere.", tel: "కొడగు, ఒడియా ఆచారం; ఇతర చోట్ల తక్కువ, కానీ సంక్రమణం అంతటా లెక్కిస్తారు." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "dhanu-sankranti", deity: "vishnu", solar: R.dhanu,
      name: { roman: "Dhanurmāsa ārambha", deva: "धनुर्मास आरम्भ", tel: "ధనుర్మాస ఆరంభం" },
      rule: { roman: "The sun enters Dhanu — Dhanurmāsa begins, and runs to Makara Saṅkrānti", deva: "सूर्य का धनु प्रवेश — मकर सङ्क्रान्ति तक धनुर्मास", tel: "సూర్యుడు ధనువులో ప్రవేశం — మకర సంక్రాంతి వరకు ధనుర్మాసం" },
      find: on(R.dhanu),
      duration: { roman: "Thirty days, ending at Makara Saṅkrānti", tel: "ముప్పై రోజులు, మకర సంక్రాంతితో ముగింపు" },
      tagline: { roman: "The month of the earliest hour. Viṣṇu is woken before dawn for thirty days, and the Tiruppāvai is sung a verse a day.",
                 tel: "అతి తొలి ఘడియల మాసం. ముప్పై రోజులు వేకువకు ముందే విష్ణువును మేల్కొలుపుతారు, రోజుకొక పాశురం తిరుప్పావై." },
      who: { roman: "Kept in every Vaiṣṇava temple and household; Mārgaḻi in Tamil Nadu, where the streets are awake before the sky is.",
             tel: "ప్రతి వైష్ణవ ఆలయంలో, ఇంట్లో; తమిళనాడులో మార్గళి — ఆకాశం కన్నా ముందే వీధులు మేల్కొంటాయి." },
      significance: [
        { roman: "Dhanurmāsa worship is done at aruṇodaya, before sunrise — the hour the Tiruppāvai calls the girls out of their houses.", tel: "ధనుర్మాస పూజ అరుణోదయంలో, సూర్యోదయానికి ముందు — తిరుప్పావై గోపికలను ఇళ్లలోంచి పిలిచే ఘడియ." },
        { roman: "Āṇḍāḷ's thirty pāsurams are sung one a day through the month, and the Tirupalliyeḻucci wakes the deity.", tel: "ఆండాళ్ ముప్పై పాశురాలు నెలంతా రోజుకొకటి; తిరుప్పళ్ళియెళుచ్చి స్వామిని మేల్కొలుపుతుంది." },
        { roman: "The month is held unfit for weddings and new undertakings — it is given wholly to the morning worship, and ends the moment the sun turns north.", tel: "ఈ మాసం పెళ్లిళ్లకు, కొత్త పనులకు యోగ్యం కాదు — పూర్తిగా ప్రాతఃకాల పూజకే; సూర్యుడు ఉత్తరాభిముఖుడైన క్షణం ముగుస్తుంది." },
      ],
      timeline: [
        { t: { roman: "Before dawn, daily", tel: "ప్రతిరోజు వేకువకు ముందు" }, d: { roman: "Bathe and finish the worship before sunrise. The whole discipline of the month is that hour.", tel: "సూర్యోదయానికి ముందే స్నానం, పూజ ముగించాలి. మాసపు నియమమంతా ఆ ఘడియే." } },
        { t: { roman: "The pāsuram", tel: "పాశురం" }, d: { roman: "One verse of the Tiruppāvai each day, in order, from the first to the thirtieth.", tel: "రోజుకొక తిరుప్పావై పాశురం, క్రమంగా మొదటి నుండి ముప్పైవ వరకు." } },
        { t: { roman: "Naivedya", tel: "నైవేద్యం" }, d: { roman: "Huggi or veṇ poṅgal in the morning, and akkāra aḍisil on the closing days.", tel: "ఉదయం హుగ్గి లేదా వెణ్ పొంగలి, చివరి రోజుల్లో అక్కార అడిసిల్." } },
        { t: { roman: "The close", tel: "ముగింపు" }, d: { roman: "The month ends at Makara Saṅkrānti, when the sun turns and ordinary undertakings resume.", tel: "మకర సంక్రాంతితో మాసం ముగుస్తుంది; సూర్యుడు మళ్లుతాడు, సాధారణ కార్యాలు తిరిగి మొదలవుతాయి." } },
      ],
      samagri: [
        { roman: "Tulasī, and fresh flowers gathered before light", tel: "తులసి, వెలుగుకు ముందే కోసిన పూలు" },
        { roman: "Rice and moong for huggi; jaggery, ghee, cashew for akkāra aḍisil", tel: "హుగ్గికి బియ్యం, పెసరపప్పు; అక్కార అడిసిల్‌కు బెల్లం, నెయ్యి, జీడిపప్పు" },
        { roman: "A lamp that will hold for the whole hour before dawn", tel: "వేకువ ముందు ఘడియంతా వెలిగే దీపం" },
      ],
      stotras: [{ deity: "vishnu", m: "tiruppavai" }, { deity: "vishnu", m: "venkatesa suprabhata" }, { deity: "vishnu", m: "sahasranama" }, { deity: "vishnu", m: "madhurastakam" }],
      dos: [
        { roman: "Finish before sunrise. A Dhanurmāsa pūjā after sunrise has missed its own point.", tel: "సూర్యోదయానికి ముందే ముగించాలి. సూర్యోదయం తరువాతి ధనుర్మాస పూజ తన ప్రయోజనాన్నే కోల్పోతుంది." },
        { roman: "Keep the same hour every day for the thirty. The month is a habit, not thirty separate rites.", tel: "ముప్పై రోజులు ఒకే ఘడియ ఉంచాలి. ఈ మాసం అలవాటు, ముప్పై వేరు వేరు పూజలు కాదు." },
      ],
      donts: [
        { roman: "Weddings, gṛhapraveśa and new ventures wait for Makara Saṅkrānti.", tel: "పెళ్లిళ్లు, గృహప్రవేశం, కొత్త పనులు మకర సంక్రాంతి వరకు ఆగాలి." },
      ],
      source: { roman: "Following Śrīvaiṣṇava and Telugu household practice; the naivedya and the pāsuram order are as commonly kept.", tel: "శ్రీవైష్ణవ, తెలుగు గృహాచారం ప్రకారం; నైవేద్యం, పాశుర క్రమం సాధారణంగా ఆచరించే విధంగా." },
    },
  ];

  return { entries };
})();

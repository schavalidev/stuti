/* ============================================================
   STUTI — मासः, the month itself
   The other lenses cut the library by what a text is, who it is
   for, or when a single day falls. This one cuts by the month
   that holds the day — what a house keeps all through Śrāvaṇa or
   all through Kārtika, not just on the one date inside it that
   has a name. Vratas, nomulu and pārāyaṇas already carry their
   own month; this file only points at them, it does not repeat
   them — the cross-references below are read off each one's own
   rule or when field, so a new vrata added elsewhere is missed
   here until it is taught to this list, not silently wrong.
   ============================================================ */
window.STUTI_MASA = (function () {
  const M = { caitra: 0, vaisakha: 1, jyeshtha: 2, ashadha: 3, shravana: 4, bhadrapada: 5,
              ashvina: 6, kartika: 7, margashirsha: 8, pausha: 9, magha: 10, phalguna: 11 };

  function currentIdx() {
    try {
      const P = window.AKSHARA_PANCHANGA, loc = P.locations.find((l) => l.id === "ujjain") || P.locations[0];
      const pa = P.forDay(new Date(), loc);
      return typeof pa.masaIdx === "number" ? pa.masaIdx : new Date().getMonth();
    } catch (e) { return new Date().getMonth(); }
  }

  /* ---------- the two spans: kept across months, not inside one ---------- */
  const spans = {
    chaturmasya: {
      id: "chaturmasya",
      name: { roman: "Cāturmāsya", deva: "चातुर्मास्य", tel: "చాతుర్మాస్యం" },
      months: [M.ashadha, M.shravana, M.bhadrapada, M.ashvina],
      rule: { roman: "Āṣāḍha Śukla Ekādaśī (Śayanī) to Kārtika Śukla Ekādaśī or Dvādaśī (Prabodhinī)",
              deva: "आषाढ शुक्ल एकादशी (शयनी) से कार्तिक शुक्ल एकादशी अथवा द्वादशी (प्रबोधिनी) तक",
              tel: "ఆషాఢ శుక్ల ఏకాదశి (శయనీ) నుండి కార్తిక శుక్ల ఏకాదశి లేదా ద్వాదశి (ప్రబోధిని) వరకు" },
      gist: [
        { roman: "Four months named for Viṣṇu's own rest — he is said to turn to sleep on Śayanī Ekādaśī and wake on Prabodhinī — kept by sannyāsis as a halt to their wandering, and by households as a season of one held restraint rather than four separate ones. What is given up is usually named at the start and kept for the whole span: a vegetable, a taste, an hour of silence, not renewed month to month.",
          deva: "विष्णु की निद्रा के नाम पर चार मास — कहा जाता है कि वे शयनी एकादशी को शयन करते हैं और प्रबोधिनी को जागते हैं। संन्यासी इस काल में भ्रमण रोककर एक स्थान पर रहते हैं; गृहस्थ एक ही नियम को चारों मास एक साथ निभाते हैं, चार अलग-अलग नहीं। जो त्यागा जाता है वह आरम्भ में ही निश्चित होता है — कोई शाक, कोई स्वाद, मौन का कोई क्षण — और मास-दर-मास नहीं बदलता।",
          tel: "విష్ణువు నిద్రకు పేరు పెట్టిన నాలుగు మాసాలు — శయనీ ఏకాదశి నాడు శయనించి, ప్రబోధినికి మేల్కొంటాడని చెబుతారు. సన్యాసులు ఈ కాలంలో సంచారం ఆపి ఒకేచోట ఉంటారు; గృహస్థులు నాలుగు వేర్వేరు నియమాలు కాక, ఒకే నియమాన్ని నాలుగు నెలలూ పాటిస్తారు. వదిలిపెట్టేది ప్రారంభంలోనే నిర్ణయించుకుంటారు — ఒక కూర, ఒక రుచి, మౌనం కోసం ఒక వేళ — నెలనెలా మారదు." },
      ],
      dos: [
        { roman: "Name the one thing being given up on Śayanī Ekādaśī itself, aloud, so the vow has a stated start.", deva: "शयनी एकादशी के दिन ही, त्यागी जाने वाली वस्तु को स्पष्ट बोलकर नाम दें, ताकि व्रत का आरम्भ निश्चित हो।", tel: "శయనీ ఏకాదశి నాడే వదిలిపెట్టే వస్తువును పైకి చెప్పి నిర్ణయించుకోవాలి — వ్రతానికి స్పష్టమైన ఆరంభం ఉండాలి." },
        { roman: "Keep the same restraint for all four months rather than a different one each month.", deva: "चारों मास एक ही नियम निभाएँ, प्रतिमास भिन्न नहीं।", tel: "నాలుగు నెలలూ ఒకే నియమం పాటించాలి, నెలకో నియమం కాదు." },
      ],
      donts: [
        { roman: "Do not begin a wedding, a house-warming or other new undertaking within the span — Kārtika Śukla Ekādaśī is the traditional wait.", deva: "इस काल में विवाह, गृहप्रवेश अथवा अन्य नया कार्य आरम्भ न करें — परम्परा कार्तिक शुक्ल एकादशी तक प्रतीक्षा करती है।", tel: "ఈ కాలంలో వివాహం, గృహప్రవేశం లేదా ఇతర కొత్త పనులు ప్రారంభించరాదు — సంప్రదాయం కార్తిక శుక్ల ఏకాదశి వరకు వేచి ఉంటుంది." },
        { roman: "Do not treat the four months as four separate vows; break one and the whole term is usually begun again.", deva: "चारों मास को चार अलग व्रत न मानें; एक में चूक हो तो सामान्यतः पूरा काल पुनः आरम्भ होता है।", tel: "నాలుగు నెలలను నాలుగు వేర్వేరు వ్రతాలుగా భావించరాదు; ఒకదానిలో తప్పితే సాధారణంగా మొత్తం కాలం మళ్లీ మొదలుపెట్టాలి." },
      ],
      source: { roman: "Followed by Vaiṣṇava and Smārta households alike, though the exact restraint kept is a family or personal choice rather than a fixed rule.",
                deva: "वैष्णव एवं स्मार्त दोनों परिवार इसे मानते हैं, यद्यपि त्यागी जाने वाली वस्तु परिवार अथवा व्यक्ति की अपनी पसन्द है, कोई निश्चित नियम नहीं।",
                tel: "వైష్ణవ, స్మార్త కుటుంబాలు రెండూ దీన్ని పాటిస్తాయి, అయితే వదిలిపెట్టే వస్తువు కుటుంబం లేదా వ్యక్తి ఇష్టం — స్థిర నియమం కాదు." },
    },
    dhanurmasa: {
      id: "dhanurmasa",
      name: { roman: "Dhanurmāsa · Śūnya Māsa", deva: "धनुर्मास · शून्य मास", tel: "ధనుర్మాసం · శూన్యమాసం" },
      months: [M.margashirsha, M.pausha],
      rule: { roman: "The sun's own month in Dhanu rāśi — roughly mid-December to mid-January, so it closes Mārgaśīrṣa and opens most of Puṣya",
              deva: "धनु राशि में सूर्य का अपना मास — लगभग मध्य दिसम्बर से मध्य जनवरी तक, अर्थात् मार्गशीर्ष का अन्त और पौष का अधिकांश भाग",
              tel: "ధనూరాశిలో సూర్యుని స్వంత మాసం — సుమారు డిసెంబర్ మధ్య నుండి జనవరి మధ్య వరకు — మార్గశిర ముగింపు, పుష్యంలో ఎక్కువ భాగం" },
      gist: [
        { roman: "A solar month rather than a lunar one, and kept mainly in Tamil and Andhra Vaiṣṇava households: pūjā is moved to before sunrise for its whole length, the Tiruppāvai or an equivalent is recited a verse a day, and the threshold is given its most elaborate muggu of the year. It is also called Śūnya Māsa — the empty month — because weddings and other beginnings are set aside for its length, the way they are through Cāturmāsya.",
          deva: "यह चान्द्र नहीं, सौर मास है, और मुख्यतः तमिल एवं आन्ध्र वैष्णव घरों में मनाया जाता है — पूजा पूरे मास सूर्योदय से पूर्व की जाती है, तिरुप्पावै अथवा समान स्तोत्र का एक-एक पद्य प्रतिदिन पढ़ा जाता है, और देहली पर वर्ष का सबसे विस्तृत मुग्गु रचा जाता है। इसे शून्य मास भी कहते हैं — विवाह एवं अन्य नए कार्य इस काल में, चातुर्मास्य के समान, टाल दिए जाते हैं।",
          tel: "ఇది చాంద్రమానం కాదు, సౌరమానం — ప్రధానంగా తమిళ, ఆంధ్ర వైష్ణవ ఇళ్లలో పాటిస్తారు: నెలంతా పూజ సూర్యోదయానికి ముందే జరుగుతుంది, తిరుప్పావై లేదా అటువంటిది రోజుకు ఒక పాశురం చొప్పున పఠిస్తారు, గడపకు ఏడాదిలోకెల్లా విస్తృతమైన ముగ్గు వేస్తారు. దీన్ని శూన్యమాసం అని కూడా అంటారు — చాతుర్మాస్యంలో లాగే వివాహాలు, ఇతర కొత్త పనులు ఈ కాలంలో వాయిదా వేస్తారు." },
      ],
      dos: [
        { roman: "Move the household pūjā to before sunrise for the month's length, even where the rest of the year keeps it later.", deva: "वर्षभर पूजा देर से होती हो तो भी, इस मास भर पूजा सूर्योदय से पूर्व करें।", tel: "సంవత్సరమంతా పూజ ఆలస్యంగా చేసినా, ఈ నెలంతా సూర్యోదయానికి ముందే చేయాలి." },
        { roman: "Recite one pāsuram of the Tiruppāvai a day where that is the family's practice, finishing the thirty on the last day.", deva: "परिवार की रीति हो तो तिरुप्पावै का एक-एक पद्य प्रतिदिन पढ़ें, अन्तिम दिन तीसों पूर्ण करें।", tel: "కుటుంబ ఆచారమైతే తిరుప్పావై ఒక్కో పాశురం రోజుకొకటి పఠించి, చివరి రోజు ముప్పైయీ పూర్తి చేయాలి." },
      ],
      donts: [
        { roman: "Do not schedule a wedding or a gṛhapraveśam within it — the reason it is called the empty month.", deva: "इसमें विवाह अथवा गृहप्रवेश न रखें — इसीलिए इसे शून्य मास कहा जाता है।", tel: "ఇందులో వివాహం లేదా గృహప్రవేశం పెట్టుకోరాదు — అందుకే దీన్ని శూన్యమాసం అంటారు." },
        { roman: "Do not treat it as identical to Cāturmāsya — the two overlap only at the edges and are kept for different reasons.", deva: "इसे चातुर्मास्य के समान न मानें — दोनों केवल सिरों पर मिलते हैं और भिन्न कारणों से मनाए जाते हैं।", tel: "దీన్ని చాతుర్మాస్యంతో సమానంగా భావించరాదు — ఇవి రెండూ అంచుల్లో మాత్రమే కలుస్తాయి, వేర్వేరు కారణాల వల్ల పాటిస్తారు." },
      ],
      source: { roman: "Reckoned by the sun's transit, not the moon, so its dates hold across amānta and pūrṇimānta households alike; the exact start can differ by a day depending on the sāyana/nirayana the almanac uses.",
                deva: "यह सूर्य-संक्रमण से गिना जाता है, चन्द्र से नहीं, अतः अमान्त एवं पूर्णिमान्त दोनों घरों में तिथियाँ समान रहती हैं; पञ्चांग के सायन/निरयन गणना भेद से आरम्भ में एक दिन का अन्तर हो सकता है।",
                tel: "ఇది సూర్య సంక్రమణ ప్రకారం లెక్కిస్తారు, చంద్రుని బట్టి కాదు — కాబట్టి అమాంత, పూర్ణిమాంత ఇళ్లలో తేదీలు ఒకటే; పంచాంగం సాయన/నిరయన లెక్కను బట్టి ఆరంభంలో ఒక రోజు తేడా రావచ్చు." },
    },
  };

  const list = [
    { id: "caitra", idx: M.caitra, name: { roman: "Caitra", deva: "चैत्र", tel: "చైత్ర" }, greg: "Mid-March – mid-April",
      tagline: { roman: "The year turns over — Ugādi's new pañcāṅga, and Rāma's birth nine days later.", deva: "वर्ष का आरम्भ — उगादि का नया पञ्चांग, और नौ दिन बाद राम-जन्म।", tel: "సంవత్సరం మారే వేళ — ఉగాది కొత్త పంచాంగం, తొమ్మిది రోజుల తర్వాత రామ జననం." },
      gist: [{ roman: "Caitra Śukla Pratipadā opens the saṃvatsara, read out fresh at Ugādi in the pañcāṅga śravaṇam; the same bright fortnight closes on Rāma Navamī, so the month runs from one beginning to another. Its first nine days are also kept as Vasanta Navarātri, the Mother's spring nine nights alongside the epic's own.",
        deva: "चैत्र शुक्ल प्रतिपदा से संवत्सर आरम्भ होता है, उगादि के दिन नया पञ्चांग सुनाया जाता है; वही शुक्ल पक्ष राम नवमी पर पूर्ण होता है — मास एक आरम्भ से दूसरे आरम्भ तक चलता है। इसके प्रथम नौ दिन वसन्त नवरात्रि भी हैं, माता की वसन्त की नौ रातें, रामकथा की अपनी नौ रातों के साथ।",
        tel: "చైత్ర శుక్ల పాడ్యమితో సంవత్సరం మొదలవుతుంది, ఉగాది నాడు కొత్త పంచాంగం చదివి వినిపిస్తారు; అదే శుక్ల పక్షం రామనవమితో ముగుస్తుంది — మాసం ఒక ఆరంభం నుండి మరో ఆరంభం వరకు సాగుతుంది. మొదటి తొమ్మిది రోజులు వసంత నవరాత్రి కూడా — అమ్మవారి వసంతపు తొమ్మిది రాత్రులు, రామకథ తొమ్మిది రోజులతో పాటు." }],
      nishtas: [{ name: { roman: "Ugādi Saṅkalpa", deva: "उगादि संकल्प", tel: "ఉగాది సంకల్పం" },
        detail: { roman: "Take a vow for the year on Pratipadā — a text to finish, a monthly dāna, or a new habit.",
          deva: "प्रतिपदा के दिन ही वर्ष का एक संकल्प लें — पूरा करने के लिए कोई ग्रंथ, हर महीने कोई दान, या कोई नई आदत।",
          tel: "పాడ్యమి నాడే ఏడాదికి ఒక సంకల్పం తీసుకోండి — పూర్తి చేయాల్సిన గ్రంథం, నెలవారీ దానం, లేదా ఒక కొత్త అలవాటు." } }],
      dana: { roman: "Ugādi Paccaḍi is placed at the doorstep before the house eats it, and shared with everyone, all six tastes.",
        deva: "उगादि पच्चडि घर में खाने से पहले देहली पर रखा जाता है; छह स्वादों के साथ सबको बाँटा जाता है।",
        tel: "ఉగాది పచ్చడి ఇంట్లో తినే ముందు గడపకు పెడతారు; ఆరు రుచులతో అందరికీ పంచుతారు." },
      recite: [{ deity: "vishnu", m: "sahasranama" }] },

    { id: "vaisakha", idx: M.vaisakha, name: { roman: "Vaiśākha", deva: "वैशाख", tel: "వైశాఖ" }, greg: "Mid-April – mid-May",
      tagline: { roman: "The hottest month of the year — giving water is its main dāna.", deva: "वर्ष का सबसे गर्म महीना — जल-दान इसका मुख्य धर्म है।", tel: "సంవత్సరంలో అత్యంత వేడి మాసం — నీటి దానం దీని ముఖ్య ధర్మం." },
      gist: [{ roman: "Vaiśākha carries more descents than any other month — Narasiṁha, Paraśurāma and Vāmana are all born in it — but the month is known first for its own snāna-dāna māhātmya: bathing before sunrise and giving what the heat makes precious, water and shade, is said to outweigh dāna given at any other time.",
        deva: "अन्य किसी मास से अधिक अवतार वैशाख में हुए — नृसिंह, परशुराम और वामन तीनों इसी मास में जन्मे — किन्तु मास पहले अपने स्नान-दान माहात्म्य के लिए जाना जाता है: सूर्योदय से पूर्व स्नान और गर्मी में मूल्यवान हुई वस्तुएँ — जल, छाया — देना, अन्य किसी काल के दान से बढ़कर कहा गया है।",
        tel: "మరే మాసంలో లేనన్ని అవతారాలు వైశాఖంలో జరిగాయి — నృసింహుడు, పరశురాముడు, వామనుడు ముగ్గురూ ఈ మాసంలోనే జన్మించారు — కానీ మాసం మొదట తన స్నాన-దాన మాహాత్మ్యానికే ప్రసిద్ధి: సూర్యోదయానికి ముందు స్నానం, ఎండలో విలువైనవి — నీరు, నీడ — దానం చేయడం మరే కాలపు దానం కన్నా మిన్నగా చెబుతారు." }],
      nishtas: [{ name: { roman: "Vaiśākha Snānam", deva: "वैशाख स्नानम्", tel: "వైశాఖ స్నానం" },
        detail: { roman: "A bath before sunrise every day of the month — the main observance of this month.",
          deva: "पूरे महीने सूर्योदय से पहले स्नान — इस महीने का मुख्य नियम।",
          tel: "నెలంతా ఎండ ముదరకముందే ప్రాతఃస్నానం — ఈ మాసపు ముఖ్య నియమం ఇదే." } }],
      dana: { roman: "Water, fans and footwear — given at a well or a roadside pandal, for whoever is walking in the heat.",
        deva: "जल, पंखे और जूते — किसी कुएँ या मार्ग के पण्डाल पर, धूप में चलने वालों के लिए दिए जाते हैं।",
        tel: "నీరు, విసనకర్రలు, చెప్పులు — బావి వద్ద లేదా దారిపక్క పందిరిలో, ఎండలో నడిచేవారి కోసం ఇస్తారు." },
      recite: [{ deity: "hanuman", m: "calisa" }] },

    { id: "jyeshtha", idx: M.jyeshtha, name: { roman: "Jyeṣṭha", deva: "ज्येष्ठ", tel: "జ్యేష్ఠ" }, greg: "Mid-May – mid-June",
      tagline: { roman: "The peak of the heat — Vaṭa Sāvitrī's banyan, and water given before anything else.", deva: "गर्मी की पराकाष्ठा — वट सावित्री का वृक्ष, और सबसे पहले जल का दान।", tel: "ఎండ తీవ్రత గరిష్ఠంగా ఉండే వేళ — వట సావిత్రి చెట్టు, అన్నిటికన్నా ముందు నీటి దానం." },
      gist: [{ roman: "Jyeṣṭha is named for its star, Jyeṣṭhā, but kept for its heat — the Vaiśākha custom of the dawn bath and the water-pot given away often runs on into it, and the month's one great vrata, Vaṭa Sāvitrī in the north, is itself kept at a tree for its shade as much as its story.",
        deva: "ज्येष्ठ का नाम ज्येष्ठा नक्षत्र से है, पर मास अपनी गर्मी के लिए जाना जाता है — वैशाख की प्रातः स्नान एवं जल-कलश दान की रीति प्रायः इसमें भी चलती रहती है, और मास का एक बड़ा व्रत, उत्तर भारत की वट सावित्री, वृक्ष की छाया के लिए भी उतना ही रखा जाता है जितना उसकी कथा के लिए।",
        tel: "జ్యేష్ఠ అనే పేరు జ్యేష్ఠా నక్షత్రం నుండి వచ్చినా, మాసం తన వేడికే ప్రసిద్ధి — వైశాఖపు ప్రాతఃస్నానం, జలకలశ దాన ఆచారం చాలామటుకు దీనిలోకి కొనసాగుతుంది; మాసపు ఒక పెద్ద వ్రతం, ఉత్తరాదిలోని వట సావిత్రి, కథ కోసం ఎంతో చెట్టు నీడ కోసం కూడా అంతే పాటిస్తారు." }],
      nishtas: [{ name: { roman: "Jala-dāna Niyama", deva: "जलदान नियम", tel: "జలదాన నియమం" },
        detail: { roman: "Water kept out for birds and travellers through the month, and a pot of water given at a temple or a crossroads — Jyeṣṭha's observance.",
          deva: "पूरे महीने पक्षियों और राहगीरों के लिए जल रखना, और मंदिर या चौराहे पर जल का कलश दान करना — ज्येष्ठ का नियम।",
          tel: "నెలంతా పక్షులకు, బాటసారులకు నీరు ఉంచడం, గుడి వద్ద లేదా కూడలిలో నీటి కలశం దానం చేయడం — జ్యేష్ఠ మాసపు నియమం." } }],
      dana: { roman: "A pot of water and a fan, given to a brāhmaṇa or left at a shaded stop for anyone walking.",
        deva: "जल का कलश और पंखा — किसी ब्राह्मण को दें, या छायादार विश्राम-स्थल पर राहगीरों के लिए रख दें।",
        tel: "నీటి కలశం, విసనకర్ర — ఒక బ్రాహ్మణుడికి ఇవ్వాలి, లేదా నీడ ఉన్న విశ్రాంతి స్థలంలో నడిచేవారి కోసం ఉంచాలి." },
      recite: [{ deity: "devi", m: "lalita sahasra" }] },

    { id: "ashadha", idx: M.ashadha, name: { roman: "Āṣāḍha", deva: "आषाढ", tel: "ఆషాఢ" }, greg: "Mid-June – mid-July",
      tagline: { roman: "The rains gather, Vyāsa is honoured, and Cāturmāsya begins.", deva: "वर्षा जुटती है, व्यास का सम्मान होता है, और चातुर्मास्य आरम्भ होता है।", tel: "వర్షాలు మొదలవుతాయి, వ్యాసుని గౌరవిస్తారు, చాతుర్మాస్యం ప్రారంభమవుతుంది." },
      gist: [{ roman: "Āṣāḍha Śukla Pūrṇimā is Guru Pūrṇimā, kept for Vyāsa and for every teacher after him; nine days earlier, Śayanī Ekādaśī opens the four months of Cāturmāsya, so the month both closes the year's teaching and opens its longest season of restraint.",
        deva: "आषाढ शुक्ल पूर्णिमा गुरु पूर्णिमा है, व्यास एवं उनके पश्चात् हर गुरु के लिए मनाई जाती है; नौ दिन पूर्व शयनी एकादशी से चातुर्मास्य के चार मास आरम्भ होते हैं — यह मास वर्ष की शिक्षा को पूर्ण भी करता है और संयम के सबसे बड़े काल को आरम्भ भी।",
        tel: "ఆషాఢ శుద్ధ పౌర్ణమి గురుపూర్ణిమ — వ్యాసునికి, ఆయన తర్వాతి ప్రతి గురువుకూ అంకితం; తొమ్మిది రోజుల ముందు శయనీ ఏకాదశితో చాతుర్మాస్యపు నాలుగు నెలలు మొదలవుతాయి — ఈ మాసం సంవత్సరపు విద్యను ముగిస్తూనే, సంయమనపు అతిపెద్ద కాలాన్ని ప్రారంభిస్తుంది." }],
      nishtas: [{ span: "chaturmasya" }],
      dana: { roman: "Dakṣiṇā to your guru on Guru Pūrṇimā — a book, a cloth, or a gift.",
        deva: "गुरु पूर्णिमा पर गुरु को दक्षिणा — पुस्तक, वस्त्र, या कोई भेंट।",
        tel: "గురుపూర్ణిమ నాడు గురువుకు దక్షిణ — పుస్తకం, వస్త్రం, లేదా కానుక." },
      recite: [{ deity: "guru", m: "guru stotram" }] },

    { id: "shravana", idx: M.shravana, name: { roman: "Śrāvaṇa", deva: "श्रावण", tel: "శ్రావణ" }, greg: "Mid-July – mid-August",
      tagline: { roman: "The month with the most vratas — Varalakṣmī, Nāga Pañcamī, and a vrata for every day of the week.", deva: "सबसे अधिक व्रतों का महीना — वरलक्ष्मी, नाग पंचमी, और सप्ताह के हर दिन एक व्रत।", tel: "వ్రతాలు అత్యధికంగా ఉండే మాసం — వరలక్ష్మి, నాగ పంచమి, వారంలో ప్రతి రోజుకూ ఒక వ్రతం." },
      gist: [{ roman: "No other month carries as many kept days: Nāga Pañcamī, Varalakṣmī Vratam, Kṛṣṇa Janmāṣṭamī and Hayagrīva Jayantī all fall within it, and its Mondays, Tuesdays, Fridays and Sundays each carry their own vrata besides. It sits inside Cāturmāsya's second month, so the restraint continues underneath all of it.",
        deva: "किसी अन्य मास में इतने व्रत-पर्व नहीं होते: नाग पञ्चमी, वरलक्ष्मी व्रतम्, कृष्ण जन्माष्टमी और हयग्रीव जयन्ती — सभी इसी में पड़ते हैं, और इसके सोमवार, मंगलवार, शुक्रवार तथा रविवार भी अपने-अपने व्रत रखते हैं। यह चातुर्मास्य का दूसरा मास भी है, अतः संयम इन सबके नीचे चलता रहता है।",
        tel: "మరే మాసంలోనూ ఇన్ని వ్రత పండుగలు రావు: నాగ పంచమి, వరలక్ష్మీ వ్రతం, కృష్ణ జన్మాష్టమి, హయగ్రీవ జయంతి — అన్నీ ఇందులోనే; దీని సోమ, మంగళ, శుక్ర, ఆదివారాలు కూడా వాటికవే వ్రతాలు కలిగి ఉంటాయి. ఇది చాతుర్మాస్యంలో రెండో నెల కూడా — కాబట్టి సంయమనం వీటన్నిటి కింద కొనసాగుతూనే ఉంటుంది." }],
      nishtas: [{ span: "chaturmasya" }],
      dana: { roman: "Women exchange vāyanam with each other this month — it is the main custom.",
        deva: "इस महीने स्त्रियाँ आपस में वायन देती-लेती हैं — यही मुख्य रीति है।",
        tel: "ఈ మాసంలో స్త్రీలు ఒకరికొకరు వాయనాలు ఇచ్చిపుచ్చుకుంటారు — ఇదే ముఖ్య ఆచారం." },
      recite: [{ deity: "shiva", m: "pancaksara" }, { deity: "devi", m: "lalita sahasra" }] },

    { id: "bhadrapada", idx: M.bhadrapada, name: { roman: "Bhādrapada", deva: "भाद्रपद", tel: "భాద్రపద" }, greg: "Mid-August – mid-September",
      tagline: { roman: "Vināyaka Caviti first, then Pitṛ Pakṣa.", deva: "भाद्रपद में पहले गणेश चतुर्थी, फिर पितृ पक्ष।", tel: "భాద్రపదంలో ముందు వినాయక చవితి, తర్వాత పితృ పక్షం." },
      gist: [{ roman: "Gaṇeśa Caturthī falls in Bhādrapada's bright fortnight, and its own dark fortnight is Mahālaya Pakṣa — sixteen days of tarpaṇa for the ancestors, ending on Mahālaya Amāvāsyā the day before Navarātri begins. The two halves of the month face opposite ways, one to a birth and one to what came before.",
        deva: "गणेश चतुर्थी भाद्रपद के शुक्ल पक्ष में पड़ती है, और इसका कृष्ण पक्ष ही महालय पक्ष है — पितरों हेतु सोलह दिनों का तर्पण, महालय अमावस्या पर समाप्त, जो नवरात्रि आरम्भ होने से ठीक एक दिन पूर्व है। मास के दोनों पक्ष विपरीत दिशा देखते हैं — एक जन्म की ओर, एक अतीत की ओर।",
        tel: "గణేశ చతుర్థి భాద్రపద శుక్ల పక్షంలో వస్తుంది, దీని కృష్ణ పక్షమే మహాలయ పక్షం — పితరుల కోసం పదహారు రోజుల తర్పణం, నవరాత్రి మొదలయ్యే ముందు రోజు మహాలయ అమావాస్యతో ముగుస్తుంది. మాసపు రెండు పక్షాలు వ్యతిరేక దిక్కులు చూస్తాయి — ఒకటి జననం వైపు, ఒకటి గతం వైపు." }],
      nishtas: [{ span: "chaturmasya" },
        { name: { roman: "Mahālaya Pakṣa · Pitṛ Pakṣa", deva: "महालय पक्ष · पितृ पक्ष", tel: "మహాలయ పక్షం · పితృ పక్షం" },
          detail: { roman: "Tarpaṇa offered to one's ancestors through the dark fortnight, on the tithi each one is remembered by, closing on Mahālaya Amāvāsyā.",
            deva: "कृष्ण पक्ष भर पितरों को उनकी स्मृति-तिथि पर तर्पण, महालय अमावस्या पर समापन।",
            tel: "కృష్ణ పక్షమంతా పితరులకు వారి స్మృతి తిథి నాడు తర్పణం, మహాలయ అమావాస్యతో ముగింపు." } }],
      dana: { roman: "Food set out for crows and given to brāhmaṇas through Mahālaya Pakṣa, in the ancestors' name rather than one's own.",
        deva: "महालय पक्ष भर कौओं के लिए भोजन रखा जाता है और ब्राह्मणों को दिया जाता है — अपने नाम से नहीं, पितरों के नाम से।",
        tel: "మహాలయ పక్షమంతా కాకులకు ఆహారం ఉంచి, బ్రాహ్మణులకు పెడతారు — తన పేరుతో కాదు, పితరుల పేరుతో." },
      recite: [{ deity: "ganesha", m: "vakratu" }] },

    { id: "ashvina", idx: M.ashvina, name: { roman: "Āśvayuja", deva: "आश्विन", tel: "ఆశ్వయుజ" }, greg: "Mid-September – mid-October",
      tagline: { roman: "Nine nights to the Mother, then the lamps of Dīpāvalī at the month's dark end.", deva: "माता के लिए नौ रातें, फिर मास के अन्त में दीपावली के दीप।", tel: "అమ్మవారికి తొమ్మిది రాత్రులు, మాసాంతంలో దీపావళి దీపాలు." },
      gist: [{ roman: "Śāradīya Navarātri opens the month and closes Cāturmāsya's third leg with it; three weeks later the same fortnight ends in Dīpāvalī, so Āśvayuja carries the year's two brightest observances a breath apart, one of worship and one of light.",
        deva: "शारदीय नवरात्रि मास का आरम्भ करती है और उसी के साथ चातुर्मास्य का तीसरा चरण पूर्ण करती है; तीन सप्ताह बाद वही पक्ष दीपावली पर समाप्त होता है — आश्विन वर्ष के दो सबसे उज्ज्वल पर्व एक साँस की दूरी पर रखता है, एक पूजा का, एक प्रकाश का।",
        tel: "శారదీయ నవరాత్రి మాసాన్ని మొదలుపెడుతూనే చాతుర్మాస్యపు మూడో దశను ముగిస్తుంది; మూడు వారాల తర్వాత అదే పక్షం దీపావళితో ముగుస్తుంది — ఆశ్వయుజం సంవత్సరపు అత్యంత ప్రకాశవంతమైన రెండు పండుగలను ఒకదానికొకటి దగ్గరగా ఉంచుతుంది, ఒకటి పూజది, ఒకటి వెలుగుది." }],
      nishtas: [{ span: "chaturmasya" }],
      dana: { roman: "New clothes and sweets for Dīpāvalī are given to the household help and to children too.",
        deva: "दीपावली पर नए वस्त्र और मिठाई घर में काम करने वालों और बच्चों को भी दी जाती है।",
        tel: "దీపావళికి కొత్త బట్టలు, స్వీట్లు ఇంట్లో పనిచేసేవారికి, పిల్లలకు కూడా ఇస్తారు." },
      recite: [{ deity: "devi", m: "lalita sahasra" }] },

    { id: "kartika", idx: M.kartika, name: { roman: "Kārtika", deva: "कार्तिक", tel: "కార్తిక" }, greg: "Mid-October – mid-November",
      tagline: { roman: "The month of lamps — a light kept burning at the threshold every evening of it.", deva: "दीपों का मास — प्रतिदिन सायं देहली पर जलता एक दीप।", tel: "దీపాల మాసం — ప్రతి సాయంత్రం గడపన వెలిగే ఒక దీపం." },
      gist: [{ roman: "Kārtika closes Cāturmāsya on its own Prabodhinī Ekādaśī and is kept, independently of that, as the year's own month for Śiva and for Dāmodara together — a lamp lit at dusk, a dawn bath where a river allows it, and a plainer table than the rest of the year keeps.",
        deva: "कार्तिक अपनी प्रबोधिनी एकादशी पर चातुर्मास्य को पूर्ण करता है, और इससे अलग भी, यह वर्ष का अपना मास है शिव तथा दामोदर दोनों के लिए — सन्ध्या में जलता दीप, जहाँ नदी सुलभ हो वहाँ प्रातः स्नान, और वर्षभर से सादा भोजन।",
        tel: "కార్తికం తన ప్రబోధిని ఏకాదశి నాడు చాతుర్మాస్యాన్ని ముగిస్తుంది, అంతేకాక ఇది శివుడు, దామోదరుడు ఇద్దరికీ సొంతమైన సంవత్సరపు మాసం — సాయంత్రం వెలిగే దీపం, నది దొరికితే ప్రాతఃస్నానం, సంవత్సరమంతటి కన్నా సాదా భోజనం." }],
      nishtas: [{ name: { roman: "Kārtika Dīpa Niyama", deva: "कार्तिक दीप नियम", tel: "కార్తిక దీప నియమం" },
        detail: { roman: "A lamp lit at the tulasi or the threshold every evening of the month — the observance the month is named for in most households.",
          deva: "मासभर प्रतिदिन सायं तुलसी अथवा देहली पर दीप — अधिकांश घरों में मास इसी नियम से पहचाना जाता है।",
          tel: "నెలంతా ప్రతి సాయంత్రం తులసి వద్ద లేదా గడపకు దీపం — చాలా ఇళ్లలో మాసానికి ఈ నియమమే గుర్తు." } },
        { name: { roman: "Kārtika Āhāra Niyama", deva: "कार्तिक आहार नियम", tel: "కార్తిక ఆహార నియమం" },
          detail: { roman: "Onion and garlic set aside for the month in many homes, and a plainer table generally — a small daily restraint rather than a single day's fast.",
            deva: "अनेक घरों में मासभर प्याज-लहसुन त्यागा जाता है, और सामान्यतः भोजन सादा रखा जाता है — एक दिन का उपवास नहीं, प्रतिदिन का छोटा संयम।",
            tel: "చాలా ఇళ్లలో నెలంతా ఉల్లి, వెల్లుల్లి మానేస్తారు, భోజనం సాధారణంగా సాదాగా ఉంచుతారు — ఒక్క రోజు ఉపవాసం కాదు, ప్రతిరోజూ చిన్న నియమం." } }],
      dana: { roman: "Dīpa-dāna above every other gift — oil or ghee given for a temple's lamps, or a lamp floated on a river at dusk.",
        deva: "अन्य किसी दान से बढ़कर दीप-दान — मन्दिर के दीपों हेतु तेल अथवा घी, या सायं नदी में प्रवाहित दीप।",
        tel: "మరే దానం కన్నా దీపదానం — గుడి దీపాల కోసం నూనె లేదా నెయ్యి, లేదా సాయంత్రం నదిలో వదిలే దీపం." },
      recite: [{ deity: "shiva", m: "pancaksara" }, { deity: "vishnu", m: "sahasranama" }] },

    { id: "margashirsha", idx: M.margashirsha, name: { roman: "Mārgaśīrṣa", deva: "मार्गशीर्ष", tel: "మార్గశిర" }, greg: "Mid-November – mid-December",
      tagline: { roman: "In the Gītā Kṛṣṇa says “of months I am Mārgaśīrṣa”; Dhanurmāsa begins at its close.", deva: "गीता में कृष्ण कहते हैं “महीनों में मैं मार्गशीर्ष हूँ”; इसके अंत में धनुर्मास शुरू होता है।", tel: "గీతలో కృష్ణుడు “మాసాలలో నేను మార్గశిరం” అన్నాడు; ఈ మాసం చివర ధనుర్మాసం మొదలవుతుంది." },
      gist: [{ roman: "“Māsānāṃ mārgaśīrṣo'ham” — of months, I am Mārgaśīrṣa, Kṛṣṇa says of himself in the Gītā's tenth chapter, and the month is kept accordingly: Gītā Jayantī and Vaikuṇṭha Ekādaśī fall in it together, and Dhanurmāsa's month-long dawn worship begins in its last third, when the sun enters Dhanu.",
        deva: "“मासानां मार्गशीर्षोऽहम्” — मासों में मैं मार्गशीर्ष हूँ, गीता के दसवें अध्याय में कृष्ण स्वयं कहते हैं, और मास इसी भाव से मनाया जाता है: गीता जयन्ती और वैकुण्ठ एकादशी दोनों इसी में पड़ती हैं, और इसके अन्तिम भाग में, जब सूर्य धनु राशि में प्रवेश करता है, धनुर्मास की मासभर चलने वाली प्रातः पूजा आरम्भ होती है।",
        tel: "“మాసానాం మార్గశీర్షోఽహమ్” — మాసాలలో నేను మార్గశిరను అని గీత పదో అధ్యాయంలో కృష్ణుడే చెప్పుకుంటాడు, మాసాన్ని ఆ భావంతోనే పాటిస్తారు: గీతా జయంతి, వైకుంఠ ఏకాదశి రెండూ ఇందులోనే వస్తాయి; సూర్యుడు ధనూరాశిలో ప్రవేశించే దీని చివరి భాగంలో నెలరోజుల ధనుర్మాస ప్రాతః పూజ మొదలవుతుంది." }],
      nishtas: [{ span: "dhanurmasa" }],
      dana: { roman: "In Dhanurmāsa, grain or a warm meal is given before dawn.",
        deva: "धनुर्मास में सूर्योदय से पहले अन्न या गर्म भोजन का दान करने की रीति है।",
        tel: "ధనుర్మాసంలో తెల్లవారకముందే ధాన్యం లేదా వేడి భోజనం దానం చేయడం ఆచారం." },
      recite: [{ deity: "vishnu", m: "sahasranama" }] },

    { id: "pausha", idx: M.pausha, name: { roman: "Puṣya", deva: "पौष", tel: "పుష్య" }, greg: "Mid-December – mid-January",
      tagline: { roman: "The coldest month — Dhanurmāsa's dawn worship runs through all of it.", deva: "वर्ष का सबसे ठंडा महीना — पूरे महीने धनुर्मास की सुबह की पूजा।", tel: "సంవత్సరంలో అత్యంత చలి మాసం, మొదటి నుండి చివరి వరకు ధనుర్మాస ప్రాతః పూజతో నిండినది." },
      gist: [{ roman: "Puṣya is Dhanurmāsa whole, start to finish in most reckonings — the month the sun spends in Dhanu, kept with pre-dawn pūjā, Tiruppāvai or its like recited, and a muggu at the door before the household's own day begins. Makara Saṅkrānti stands at its far edge, where the sun turns north.",
        deva: "अधिकांश गणनाओं में पौष सम्पूर्ण धनुर्मास है, आदि से अन्त तक — वह मास जो सूर्य धनु में बिताता है, प्रातःपूर्व पूजा, तिरुप्पावै अथवा समान पाठ, और घर का अपना दिन आरम्भ होने से पहले देहली पर मुग्गु के साथ मनाया जाता है। इसके अन्तिम छोर पर मकर संक्रान्ति है, जहाँ सूर्य उत्तर की ओर मुड़ता है।",
        tel: "చాలా లెక్కల్లో పుష్యం మొత్తం ధనుర్మాసమే, మొదటి నుండి చివరి వరకు — సూర్యుడు ధనువులో గడిపే మాసం, తెల్లవారకముందే పూజ, తిరుప్పావై లేదా అటువంటిది పఠించడం, ఇంటి సొంత దినచర్య మొదలయ్యేలోపు గడపకు ముగ్గుతో పాటిస్తారు. దీని చివరి అంచున మకర సంక్రాంతి ఉంటుంది, అక్కడ సూర్యుడు ఉత్తరం వైపు తిరుగుతాడు." }],
      nishtas: [{ span: "dhanurmasa" }],
      dana: { roman: "Blankets, warm food and til sweets — it is the cold month, so these are the dāna.",
        deva: "कंबल, गर्म भोजन और तिल की मिठाई — ठंड का महीना है, इसलिए यही दान।",
        tel: "దుప్పట్లు, వేడి భోజనం, నువ్వుల మిఠాయిలు — చలికాలం కనుక ఇవే దానం." },
      recite: [{ deity: "surya", m: "gayatri" }] },

    { id: "magha", idx: M.magha, name: { roman: "Māgha", deva: "माघ", tel: "మాఘ" }, greg: "Mid-January – mid-February",
      tagline: { roman: "The Purāṇas say a bath and a dāna in Māgha count for more than in any other month.", deva: "पुराणों के अनुसार माघ में स्नान और दान का फल सबसे अधिक है।", tel: "స్నానం, దానం రెండూ మాఘంలో మరే మాసంలో కన్నా ఎక్కువ ఫలమిస్తాయని పురాణాలు చెబుతాయి." },
      gist: [{ roman: "The month opens with Ratha Saptamī, the Sun turning his chariot fully north, and closes with Śivarātri in most reckonings; between them Vasanta Pañcamī gives Sarasvatī her own day. Its dawn bath and the dāna that follows it are the two acts the Māgha Purāṇa spends the most verses praising.",
        deva: "मास रथ सप्तमी से आरम्भ होता है, जब सूर्य अपना रथ पूर्णतः उत्तर की ओर मोड़ते हैं, और अधिकांश गणनाओं में शिवरात्रि पर पूर्ण होता है; बीच में वसन्त पञ्चमी सरस्वती को उनका अपना दिन देती है। इसका प्रातः स्नान और उसके पश्चात् का दान — यही दो कर्म हैं जिनकी प्रशंसा में माघ पुराण सबसे अधिक श्लोक रचता है।",
        tel: "మాసం రథ సప్తమితో మొదలవుతుంది, సూర్యుడు తన రథాన్ని పూర్తిగా ఉత్తరం వైపు తిప్పే రోజు; చాలా లెక్కల్లో శివరాత్రితో ముగుస్తుంది. మధ్యలో వసంత పంచమి సరస్వతికి ఆమె సొంత రోజునిస్తుంది. దీని ప్రాతఃస్నానం, తర్వాతి దానం — మాఘ పురాణం అత్యధిక శ్లోకాలతో కొనియాడేవి ఈ రెండు పనులే." }],
      nishtas: [{ name: { roman: "Māgha Snānam", deva: "माघ स्नानम्", tel: "మాఘ స్నానం" },
        detail: { roman: "A bath at dawn every day of the month — at a river or saṅgama if you can, at home otherwise — with dāna given right after.",
          deva: "पूरे महीने रोज़ सुबह स्नान — हो सके तो नदी या संगम पर, नहीं तो घर पर — और स्नान के तुरंत बाद दान।",
          tel: "ప్రాతఃస్నానం — వీలైతే నది లేదా సంగమం వద్ద, లేకుంటే ఇంట్లోనే — నెలంతా ప్రతిరోజూ, దానం రోజులో తర్వాత కాక స్నానం అయిన వెంటనే ఇస్తారు." } }],
      dana: { roman: "After the bath, grain, til or a lamp — given at the water's edge.",
        deva: "स्नान के बाद अन्न, तिल, दीप — जल के तट पर ही दान करें।",
        tel: "స్నానం తర్వాత ధాన్యం, నువ్వులు, దీపం — నీటి ఒడ్డునే దానం చేయాలి." },
      recite: [{ deity: "surya", m: "aditya hrdayam" }, { deity: "devi", m: "sarasvati vandana" }] },

    { id: "phalguna", idx: M.phalguna, name: { roman: "Phālguna", deva: "फाल्गुन", tel: "ఫాల్గుణ" }, greg: "Mid-February – mid-March",
      tagline: { roman: "The year's last month — Śivarātri in some reckonings, Holī at its full moon, and then Caitra again.", deva: "वर्ष का अन्तिम मास — किन्हीं गणनाओं में शिवरात्रि, पूर्णिमा पर होली, फिर पुनः चैत्र।", tel: "సంవత్సరపు చివరి మాసం — కొన్ని లెక్కల్లో శివరాత్రి, పౌర్ణమి నాడు హోళి, తర్వాత మళ్లీ చైత్రం." },
      gist: [{ roman: "Where Phālguna rather than Māgha is kept as Śivarātri's month, the night falls near its start; the month itself ends on Holī's bonfire and the colour the next morning, and then the saṃvatsara begins again with Caitra. Nothing new is usually begun in its last days — they belong to finishing, not starting.",
        deva: "जहाँ शिवरात्रि माघ के बजाय फाल्गुन में मानी जाती है, वह रात्रि मास के आरम्भ के निकट पड़ती है; मास स्वयं होली की अग्नि और अगली सुबह के रंग पर समाप्त होता है, फिर संवत्सर चैत्र से पुनः आरम्भ होता है। इसके अन्तिम दिनों में सामान्यतः कुछ नया आरम्भ नहीं किया जाता — ये दिन पूर्ण करने के हैं, आरम्भ के नहीं।",
        tel: "మాఘానికి బదులు ఫాల్గుణాన్ని శివరాత్రి మాసంగా పాటించేచోట, ఆ రాత్రి మాసారంభానికి దగ్గరగా వస్తుంది; మాసం స్వయంగా హోళి మంటతో, మరుసటి ఉదయం రంగులతో ముగుస్తుంది, తర్వాత సంవత్సరం చైత్రంతో మళ్లీ మొదలవుతుంది. దీని చివరి రోజుల్లో సాధారణంగా కొత్తది మొదలుపెట్టరు — అవి ముగించడానికే తప్ప మొదలుపెట్టడానికి కాదు." }],
      nishtas: [],
      dana: { roman: "Wood given toward the Holikā fire, and colour and sweets shared with whoever cannot buy their own.",
        deva: "होलिका की अग्नि हेतु लकड़ी का दान, और रंग-मिठाई उनके साथ बाँटना जो स्वयं नहीं खरीद सकते।",
        tel: "హోలికా మంట కోసం కట్టెల దానం, రంగులు-మిఠాయిలు తామే కొనలేనివారితో పంచుకోవడం." },
      recite: [{ deity: "shiva", m: "pancaksara" }] },
  ];
  const byId = {};
  list.forEach((m) => { byId[m.id] = m; });

  /* ---------- cross-references, kept by hand rather than parsed out of
     each guide's prose `rule`/`when` field, which is written for a reciter
     to read, not for code to scan. "any" means the day floats free of one
     month (Satyanārāyaṇa's "any Pūrṇimā") and is left off every month's
     list rather than guessed onto one. everyMonth vratas (Ekādaśī, Pradoṣa)
     need no entry here — they qualify for every month at read time. ---------- */
  const VRATA_MASA = {
    "ganesha-chaturthi": M.bhadrapada, "varalakshmi": M.shravana, "satyanarayana": "any",
    "navaratri": M.ashvina, "mangala-gauri": M.shravana, "naga-panchami": M.shravana,
    "shitala-saptami": M.shravana, "shravana-ravivaram": M.shravana, "shravana-somavaram": M.shravana,
    "vata-savitri": M.vaisakha, "shivaratri": M.magha, "dipavali": M.ashvina,
    "rama-navami": M.caitra, "janmashtami": M.shravana, "hanuman-jayanti": [M.caitra, M.vaisakha],
    "guru-purnima": M.ashadha, "ratha-saptami": M.magha, "ugadi": M.caitra,
    "skanda-shashti": M.kartika, "nrsimha-jayanti": M.vaisakha, "lalita-jayanti": M.magha,
    "sita-navami": M.vaisakha, "parashurama-jayanti": M.vaisakha, "vamana-jayanti": M.bhadrapada,
    "radha-ashtami": M.bhadrapada, "shankara-jayanti": M.vaisakha, "dattatreya-jayanti": M.margashirsha,
    "hayagriva-jayanti": M.shravana, "vasanta-panchami": M.magha, "vasanta-navaratri": M.caitra,
    "shyamala-navaratri": M.magha, "varahi-navaratri": M.ashadha,
  };
  const NOMU_MASA = {
    "atla-tadde": M.ashvina, "undralla-tadde": M.bhadrapada, "uppu-nomu": M.shravana,
    "kartika-somavara": M.kartika, "sravana-sukravara": M.shravana, "kedareshwara": M.ashvina,
    "tulasi-nomu": M.kartika, "nagula-chaviti": M.kartika,
  };
  const PARAYANA_MASA = {
    "sundarakanda": [M.margashirsha], "devi-mahatmyam": [M.ashvina, M.caitra],
    "bhagavad-gita": [M.margashirsha], "bhagavata-saptaha": [M.kartika, M.shravana],
    "vishnu-sahasranama-parayana": [M.margashirsha], "hanuman-chalisa-mandala": [M.caitra, M.vaisakha, M.shravana],
    "rudram-ekadasini": [M.kartika, M.shravana, M.magha], "lalita-parayana": [M.shravana, M.ashvina],
  };

  /* vratas (personal vows/fasts) and parva dinālu (festival/calendar days)
     share one list and month map — kind: "vratam" on an entry marks the vow.
     An annual vratam is also a day the calendar keeps, so it shows under
     parva dinālu too; only the recurring ones (everyMonth, or a weekly rule
     mapped to its month) are vows alone and stay out of the parva list. */
  function matchesMasa(v, idx) {
    if (v.everyMonth) return true;
    const m = VRATA_MASA[v.id]; if (m == null || m === "any") return false;
    return Array.isArray(m) ? m.indexOf(idx) !== -1 : m === idx;
  }
  const WEEKLY = { "mangala-gauri": 1, "shravana-ravivaram": 1, "shravana-somavaram": 1 };
  const annual = (v) => !v.everyMonth && !WEEKLY[v.id];
  function vratasOf(idx) {
    const V = window.STUTI_VRATA; if (!V) return [];
    return V.vratas.filter((v) => v.kind === "vratam" && matchesMasa(v, idx));
  }
  function parvasOf(idx) {
    const V = window.STUTI_VRATA; if (!V) return [];
    return V.vratas.filter((v) => (v.kind !== "vratam" || annual(v)) && matchesMasa(v, idx));
  }
  function nomuOf(idx) {
    const N = window.STUTI_NOMU; if (!N) return [];
    return N.list.filter((n) => {
      const m = NOMU_MASA[n.id]; if (m == null || m === "any") return false;
      return Array.isArray(m) ? m.indexOf(idx) !== -1 : m === idx;
    });
  }
  function parayanaOf(idx) {
    const P = window.STUTI_PARAYANA; if (!P) return [];
    return P.list.filter((p) => { const m = PARAYANA_MASA[p.id]; return Array.isArray(m) && m.indexOf(idx) !== -1; });
  }
  function spansOf(idx) {
    return Object.keys(spans).map((k) => spans[k]).filter((s) => s.months.indexOf(idx) !== -1);
  }
  /* the running month first, then the year ahead in order, wrapping back
     around to the month just closed — a browsing order, not the samvatsara's */
  function orderedList() {
    const cur = currentIdx();
    return list.slice(cur).concat(list.slice(0, cur));
  }

  /* ---------- the real civil window, read off the engine ----------
     The static greg strings above are the no-engine fallback only. A lunar
     month drifts against the civil calendar, and in a year carrying an
     adhika māsa everything after it lands a full month late — 2026's Adhika
     Jyeṣṭha is why late August is still Śrāvaṇa. So the range shown is
     computed: the walk finds each lunation's first day the way the vrata
     engine does (the tithi index falling past 15 is a month opening), reads
     the engine's own masaIdx/masaAdhika off that day, and the card shows
     this cycle's true dates. */
  let startsCache = null;
  function monthStarts() {
    if (startsCache) return startsCache;
    try {
      const P = window.AKSHARA_PANCHANGA; if (!P) return null;
      const loc = P.locations.find((l) => l.id === "ujjain") || P.locations[0];
      const out = [];
      const d = new Date(); d.setDate(d.getDate() - 45); d.setHours(9, 0, 0, 0);
      let prev = P.forDay(d, loc).tithiIndex, guard = 0;
      while (out.length < 15 && guard++ < 460) {
        d.setDate(d.getDate() + 1);
        const pa = P.forDay(d, loc);
        if (pa.tithiIndex < prev && prev >= 15) {
          out.push({ start: new Date(d), idx: pa.masaIdx, adhika: !!pa.masaAdhika });
          d.setDate(d.getDate() + 20);          // no month is shorter — skip the middle
          prev = P.forDay(d, loc).tithiIndex;
        } else prev = pa.tithiIndex;
      }
      startsCache = out.length ? out : null;
      return startsCache;
    } catch (e) { return null; }
  }

  /* the current-or-next window of the named (nija) month; a month still
     running shows its own dates, not next year's. adhikaShifted marks a
     nija month whose intercalary twin ran just before it. */
  function rangeOf(idx) {
    const st = monthStarts(); if (!st) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < st.length - 1; i++) {
      const s = st[i];
      if (s.idx !== idx || s.adhika) continue;
      const end = new Date(st[i + 1].start); end.setDate(end.getDate() - 1);
      if (end >= today) return { start: s.start, end, adhikaShifted: !!(i > 0 && st[i - 1].adhika && st[i - 1].idx === idx) };
    }
    return null;
  }

  return { M, list, byId, spans, currentIdx, orderedList, vratasOf, parvasOf, nomuOf, parayanaOf, spansOf, rangeOf };
})();

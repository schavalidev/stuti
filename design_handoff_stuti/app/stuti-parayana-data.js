/* ============================================================
   STUTI — పారాయణం, the sustained readings

   A stotra is read; a pārāyaṇa is undertaken. What is written here
   is therefore not a text but a schedule: how a long work is cut
   into days, how many days the tradition allows, and what holds
   between the first day and the last. That is the part a reciter
   actually needs and the part no index gives them — the text itself
   is already in the library, and the deity's page is where it is
   read from.

   The divisions below are the common ones. A guru's own division
   outranks them, and a household that has read the Sundarakāṇḍa in
   five days for three generations should go on doing so.
   ============================================================ */
window.STUTI_PARAYANA = (function () {
  const list = [
    {
      id: "sundarakanda", deity: "hanuman",
      name: { roman: "Sundarakāṇḍa Pārāyaṇa", deva: "सुन्दरकाण्ड पारायण", tel: "సుందరకాండ పారాయణం" },
      source: { roman: "Vālmīki Rāmāyaṇa · Book V", deva: "वाल्मीकि रामायण · पञ्चम काण्ड", tel: "వాల్మీకి రామాయణం · పంచమ కాండ" },
      span: { roman: "68 sargas", deva: "६८ सर्ग", tel: "68 సర్గలు" },
      tagline: { roman: "The one kāṇḍa in which nothing goes wrong — read when something has.", deva: "एकमात्र काण्ड जिसमें कुछ अशुभ नहीं होता — विपत्ति में यही पढ़ा जाता है।", tel: "ఏదీ చెడుగా జరగని ఒకే ఒక కాండ — కష్టం వచ్చినప్పుడు చదివేది ఇదే." },
      gist: [
        { roman: "Of the seven kāṇḍas this is the one read alone, and the reason given is simple: every undertaking in it succeeds. The sea is crossed, the city entered, Sītā found, the grove burnt, and the messenger returns. A house in difficulty reads it for that shape.", deva: "सात काण्डों में यही स्वतन्त्र रूप से पढ़ा जाता है — कारण सरल है: इसमें प्रत्येक कार्य सिद्ध होता है। समुद्र लङ्घन, लङ्का प्रवेश, सीता-दर्शन, वन-दहन, और दूत का लौटना।", tel: "ఏడు కాండలలో ఒంటరిగా చదివేది ఇదే — కారణం సులభం: ఇందులో ప్రతి పని నెరవేరుతుంది. సముద్ర లంఘనం, లంకా ప్రవేశం, సీతా దర్శనం, వన దహనం, దూత తిరిగి రావడం." },
        { roman: "It is Hanumān's kāṇḍa, and it is named sundara — beautiful — for him. Read it aloud where the household can hear; the sargas were composed to be heard, not scanned.", deva: "यह हनुमान् का काण्ड है, और उन्हीं के कारण 'सुन्दर' कहलाता है। सस्वर पढ़ें — सर्ग सुनने के लिए रचे गये हैं।", tel: "ఇది హనుమంతుని కాండ, ఆయన వల్లే 'సుందర' అని పేరు. ఇల్లంతా వినేలా పైకి చదవాలి — సర్గలు వినడానికే రాసినవి." },
      ],
      schedules: [
        { span: { roman: "Nine days", deva: "नौ दिन", tel: "తొమ్మిది రోజులు" }, how: { roman: "The common navāha: sargas 1–5, 6–12, 13–21, 22–28, 29–36, 37–43, 44–51, 52–60, 61–68.", deva: "नवाह: सर्ग १–५, ६–१२, १३–२१, २२–२८, २९–३६, ३७–४३, ४४–५१, ५२–६०, ६१–६८।", tel: "నవాహం: సర్గలు 1–5, 6–12, 13–21, 22–28, 29–36, 37–43, 44–51, 52–60, 61–68." } },
        { span: { roman: "Five days", deva: "पाँच दिन", tel: "అయిదు రోజులు" }, how: { roman: "Kept from a Tuesday to a Saturday, roughly fourteen sargas a day.", deva: "मङ्गलवार से शनिवार तक, प्रतिदिन लगभग चौदह सर्ग।", tel: "మంగళవారం నుంచి శనివారం వరకు, రోజుకు సుమారు పద్నాలుగు సర్గలు." } },
        { span: { roman: "Sixty-eight days", deva: "अड़सठ दिन", tel: "అరవై ఎనిమిది రోజులు" }, how: { roman: "One sarga a day — the slow reading, taken up when the parayana is for a standing difficulty rather than an occasion.", deva: "प्रतिदिन एक सर्ग — दीर्घ कष्ट हेतु मन्द पाठ।", tel: "రోజుకు ఒక సర్గ — సందర్భం కోసం కాక, నిలిచిన కష్టం కోసం చేసే మెల్లని పారాయణం." } },
      ],
      when: { roman: "Begun on a Tuesday or Saturday; Hanumān Jayantī and the month of Mārgaśīrṣa are favoured.", deva: "मङ्गल अथवा शनिवार को आरम्भ; हनुमान् जयन्ती और मार्गशीर्ष श्रेष्ठ।", tel: "మంగళ లేదా శనివారం ప్రారంభం; హనుమజ్జయంతి, మార్గశిర మాసం శ్రేష్ఠం." },
    },
    {
      id: "devi-mahatmyam", deity: "devi",
      name: { roman: "Devī Māhātmyam Pārāyaṇa", deva: "देवी माहात्म्य पारायण", tel: "దేవీ మాహాత్మ్య పారాయణం" },
      source: { roman: "Mārkaṇḍeya Purāṇa · Durgā Saptaśatī", deva: "मार्कण्डेय पुराण · दुर्गा सप्तशती", tel: "మార్కండేయ పురాణం · దుర్గా సప్తశతి" },
      span: { roman: "13 adhyāyas · 700 ślokas", deva: "१३ अध्याय · ७०० श्लोक", tel: "13 అధ్యాయాలు · 700 శ్లోకాలు" },
      tagline: { roman: "Seven hundred ślokas in three carita — the Goddess in her three acts.", deva: "तीन चरितों में सात सौ श्लोक — देवी के तीन कर्म।", tel: "మూడు చరితాల్లో ఏడు వందల శ్లోకాలు — దేవి మూడు కార్యాలు." },
      gist: [
        { roman: "The text divides itself: prathama carita is one adhyāya, madhyama is three, uttama is nine. Almost every schedule follows that seam rather than counting ślokas, because each carita has its own ṛṣi, its own chandas and its own aṅga-nyāsa.", deva: "पाठ स्वयं विभक्त है — प्रथम चरित एक अध्याय, मध्यम तीन, उत्तम नौ। प्रत्येक चरित के अपने ऋषि, छन्द और न्यास हैं।", tel: "పాఠమే విభజించుకుంటుంది — ప్రథమ చరితం ఒక అధ్యాయం, మధ్యమం మూడు, ఉత్తమం తొమ్మిది. ప్రతి చరితానికి తన ఋషి, ఛందస్సు, న్యాసం ఉన్నాయి." },
        { roman: "Never read bare. The kavaca, argalā and kīlaka precede it and the Devī Sūktam follows; a reading that drops them is a reading of the story, not the pārāyaṇa.", deva: "कवच, अर्गला, कीलक पूर्व में और देवी सूक्त अन्त में — इनके बिना वह कथा-पाठ है, पारायण नहीं।", tel: "కవచం, అర్గళ, కీలకం ముందు; దేవీ సూక్తం చివర — ఇవి లేకుండా చదివితే అది కథ, పారాయణం కాదు." },
      ],
      schedules: [
        { span: { roman: "Nine days", deva: "नौ दिन", tel: "తొమ్మిది రోజులు" }, how: { roman: "Navarātri: 1 · 2–3 · 4 · 5–6 · 7 · 8 · 9–10 · 11 · 12–13.", deva: "नवरात्रि: १ · २–३ · ४ · ५–६ · ७ · ८ · ९–१० · ११ · १२–१३।", tel: "నవరాత్రి: 1 · 2–3 · 4 · 5–6 · 7 · 8 · 9–10 · 11 · 12–13." } },
        { span: { roman: "Three days", deva: "तीन दिन", tel: "మూడు రోజులు" }, how: { roman: "One carita a day — prathama, madhyama, uttama.", deva: "प्रतिदिन एक चरित — प्रथम, मध्यम, उत्तम।", tel: "రోజుకు ఒక చరితం — ప్రథమ, మధ్యమ, ఉత్తమ." } },
        { span: { roman: "One day", deva: "एक दिन", tel: "ఒక రోజు" }, how: { roman: "The whole seven hundred in a single sitting, usually on Aṣṭamī or Navamī.", deva: "एक ही आसन में सम्पूर्ण सप्तशती — प्रायः अष्टमी या नवमी को।", tel: "ఒకే ఆసనంలో మొత్తం సప్తశతి — సాధారణంగా అష్టమి లేదా నవమి నాడు." } },
      ],
      when: { roman: "Śāradīya and Vāsantika Navarātri above all; also Aṣṭamī of any month.", deva: "शारदीय एवं वासन्तिक नवरात्रि; किसी भी मास की अष्टमी भी।", tel: "శారదీయ, వాసంతిక నవరాత్రులు ముఖ్యం; ఏ మాసపు అష్టమి అయినా." },
    },
    {
      id: "bhagavad-gita", deity: "vishnu",
      name: { roman: "Bhagavad Gītā Pārāyaṇa", deva: "भगवद्गीता पारायण", tel: "భగవద్గీతా పారాయణం" },
      source: { roman: "Mahābhārata · Bhīṣma Parva", deva: "महाभारत · भीष्म पर्व", tel: "మహాభారతం · భీష్మ పర్వం" },
      span: { roman: "18 adhyāyas · 700 ślokas", deva: "१८ अध्याय · ७०० श्लोक", tel: "18 అధ్యాయాలు · 700 శ్లోకాలు" },
      tagline: { roman: "A chapter a day for eighteen days, and the whole again on Gītā Jayantī.", deva: "अठारह दिन, प्रतिदिन एक अध्याय; गीता जयन्ती पर सम्पूर्ण पाठ।", tel: "పద్దెనిమిది రోజులు, రోజుకు ఒక అధ్యాయం; గీతా జయంతి నాడు మొత్తం." },
      gist: [
        { roman: "The cleanest pārāyaṇa in the tradition, because the text was already cut for it — eighteen chapters, eighteen days, and the dhyāna ślokas at the head of each sitting. It is read for study as often as for merit, and the two are not held apart.", deva: "परम्परा का सबसे सुव्यवस्थित पारायण — अठारह अध्याय, अठारह दिन, प्रत्येक बैठक के आरम्भ में ध्यान-श्लोक। अध्ययन और पुण्य यहाँ पृथक् नहीं।", tel: "సంప్రదాయంలో అత్యంత సులభమైన పారాయణం — పద్దెనిమిది అధ్యాయాలు, పద్దెనిమిది రోజులు, ప్రతి కూర్చునేముందు ధ్యాన శ్లోకాలు. అధ్యయనం, పుణ్యం ఇక్కడ వేరు కాదు." },
      ],
      schedules: [
        { span: { roman: "Eighteen days", deva: "अठारह दिन", tel: "పద్దెనిమిది రోజులు" }, how: { roman: "One adhyāya a day, in order, without skipping a day.", deva: "प्रतिदिन एक अध्याय, क्रमशः, बिना नागा।", tel: "రోజుకు ఒక అధ్యాయం, వరుసగా, ఒక్క రోజు కూడా వదలకుండా." } },
        { span: { roman: "Seven days", deva: "सात दिन", tel: "ఏడు రోజులు" }, how: { roman: "1–3 · 4–6 · 7–9 · 10–11 · 12–14 · 15–16 · 17–18.", deva: "१–३ · ४–६ · ७–९ · १०–११ · १२–१४ · १५–१६ · १७–१८।", tel: "1–3 · 4–6 · 7–9 · 10–11 · 12–14 · 15–16 · 17–18." } },
        { span: { roman: "One day", deva: "एक दिन", tel: "ఒక రోజు" }, how: { roman: "Gītā Jayantī — Mārgaśīrṣa Śukla Ekādaśī — the whole read from dawn.", deva: "गीता जयन्ती — मार्गशीर्ष शुक्ल एकादशी — प्रातः से सम्पूर्ण पाठ।", tel: "గీతా జయంతి — మార్గశిర శుద్ధ ఏకాదశి — ఉదయం నుంచి మొత్తం." } },
      ],
      when: { roman: "Any time; begun on Ekādaśī or Gītā Jayantī by custom.", deva: "कभी भी; प्रथानुसार एकादशी अथवा गीता जयन्ती से आरम्भ।", tel: "ఎప్పుడైనా; ఆచారంగా ఏకాదశి లేదా గీతా జయంతి నాడు ప్రారంభం." },
    },
    {
      id: "bhagavata-saptaha", deity: "vishnu",
      name: { roman: "Bhāgavata Saptāha", deva: "भागवत सप्ताह", tel: "భాగవత సప్తాహం" },
      source: { roman: "Śrīmad Bhāgavata Purāṇa · 12 skandhas", deva: "श्रीमद्भागवत पुराण · १२ स्कन्ध", tel: "శ్రీమద్భాగవత పురాణం · 12 స్కంధాలు" },
      span: { roman: "Seven days", deva: "सात दिन", tel: "ఏడు రోజులు" },
      tagline: { roman: "Twelve skandhas in seven days, read to a listening house — the reading is the rite.", deva: "सात दिनों में बारह स्कन्ध, श्रोताओं के समक्ष — पाठ ही यज्ञ है।", tel: "ఏడు రోజుల్లో పన్నెండు స్కంధాలు, వినేవాళ్ల ముందు — పఠనమే యజ్ఞం." },
      gist: [
        { roman: "Unlike the others this is not a private reading. A vaktā reads and a house listens, for seven days, at a fixed hour; the seventh day ends with the Śuka–Parīkṣit parting and a hāratī. Where a family cannot hold seven days, a māsa pārāyaṇa over a month is the accepted substitute.", deva: "यह एकान्त पाठ नहीं — वक्ता पढ़ते हैं, श्रोता सुनते हैं, सात दिन नियत समय पर। सातवें दिन शुक-परीक्षित विदा और आरती। सात दिन सम्भव न हों तो मास-पारायण मान्य है।", tel: "ఇది ఒంటరి పఠనం కాదు — వక్త చదువుతారు, ఇల్లంతా వింటుంది, ఏడు రోజులు నిర్ణీత వేళలో. ఏడో రోజు శుక–పరీక్షిత్తుల వీడ్కోలు, హారతి. ఏడు రోజులు కుదరకపోతే మాస పారాయణం ఆమోదయోగ్యం." },
      ],
      schedules: [
        { span: { roman: "Seven days", deva: "सात दिन", tel: "ఏడు రోజులు" }, how: { roman: "Skandhas 1–2 · 3 · 4–5 · 6–7 · 8–9 · 10 (pūrva) · 10 (uttara)–12.", deva: "स्कन्ध १–२ · ३ · ४–५ · ६–७ · ८–९ · १० (पूर्व) · १० (उत्तर)–१२।", tel: "స్కంధాలు 1–2 · 3 · 4–5 · 6–7 · 8–9 · 10 (పూర్వ) · 10 (ఉత్తర)–12." } },
        { span: { roman: "One month", deva: "एक मास", tel: "ఒక నెల" }, how: { roman: "Māsa pārāyaṇa — roughly one adhyāya a day through Kārtika or Śrāvaṇa.", deva: "मास-पारायण — कार्तिक या श्रावण भर प्रतिदिन लगभग एक अध्याय।", tel: "మాస పారాయణం — కార్తికం లేదా శ్రావణం అంతా రోజుకు సుమారు ఒక అధ్యాయం." } },
      ],
      when: { roman: "Kārtika and Śrāvaṇa above all; also in the days after a death in the house.", deva: "कार्तिक एवं श्रावण; गृह में मृत्यु के पश्चात् भी।", tel: "కార్తికం, శ్రావణం ముఖ్యం; ఇంట్లో మరణం జరిగిన తర్వాత కూడా." },
    },
    {
      id: "vishnu-sahasranama-parayana", deity: "vishnu",
      name: { roman: "Viṣṇu Sahasranāma Pārāyaṇa", deva: "विष्णुसहस्रनाम पारायण", tel: "విష్ణు సహస్రనామ పారాయణం" },
      source: { roman: "Mahābhārata · Anuśāsana Parva", deva: "महाभारत · अनुशासन पर्व", tel: "మహాభారతం · అనుశాసన పర్వం" },
      span: { roman: "108 ślokas · daily", deva: "१०८ श्लोक · नित्य", tel: "108 శ్లోకాలు · నిత్యం" },
      tagline: { roman: "The one pārāyaṇa meant to be daily rather than finished.", deva: "यही एकमात्र पारायण है जो समाप्त नहीं, नित्य होता है।", tel: "ముగించడానికి కాక, ప్రతిరోజూ చేయడానికి ఉద్దేశించిన ఒకే పారాయణం." },
      gist: [
        { roman: "Half an hour a day, the same hour, for as long as the vow runs — that is the whole of it. Most houses keep it for a maṇḍala of forty-eight days, or on every Ekādaśī and Saturday, and a good number simply never stop.", deva: "प्रतिदिन आधा घण्टा, वही समय, जब तक संकल्प चले। प्रायः अड़तालीस दिन का मण्डल, अथवा प्रत्येक एकादशी और शनिवार; अनेक तो कभी नहीं छोड़ते।", tel: "రోజుకు అరగంట, అదే వేళ, సంకల్పం ఉన్నంత కాలం. చాలా ఇళ్లలో నలభై ఎనిమిది రోజుల మండలం, లేదా ప్రతి ఏకాదశి, శనివారం; కొందరు అసలు ఆపరు." },
      ],
      schedules: [
        { span: { roman: "A maṇḍala — 48 days", deva: "मण्डल — ४८ दिन", tel: "మండలం — 48 రోజులు" }, how: { roman: "Once a day without a break; a missed day restarts the count in strict houses.", deva: "प्रतिदिन एक बार, बिना नागा; कठोर परम्परा में नागा होने पर गणना पुनः आरम्भ।", tel: "రోజుకు ఒకసారి, ఆపకుండా; కఠినంగా పాటించే ఇళ్లలో ఒక రోజు తప్పితే లెక్క మళ్లీ మొదటి నుంచి." } },
        { span: { roman: "Ekādaśī and Saturday", deva: "एकादशी एवं शनिवार", tel: "ఏకాదశి, శనివారం" }, how: { roman: "The lighter keeping — twice a fortnight and once a week.", deva: "सरल रीति — पक्ष में दो बार, सप्ताह में एक बार।", tel: "తేలికైన పద్ధతి — పక్షానికి రెండుసార్లు, వారానికి ఒకసారి." } },
      ],
      when: { roman: "Begun on Ekādaśī, Vaikuṇṭha Ekādaśī above all.", deva: "एकादशी से आरम्भ, विशेषतः वैकुण्ठ एकादशी।", tel: "ఏకాదశి నాడు ప్రారంభం, ముఖ్యంగా వైకుంఠ ఏకాదశి." },
    },
    {
      id: "hanuman-chalisa-mandala", deity: "hanuman",
      name: { roman: "Hanumān Cālīsā — forty days", deva: "हनुमान् चालीसा — चालीस दिन", tel: "హనుమాన్ చాలీసా — నలభై రోజులు" },
      source: { roman: "Tulasīdāsa · Awadhi", deva: "तुलसीदास · अवधी", tel: "తులసీదాసు · అవధి" },
      span: { roman: "40 verses · 40 days", deva: "४० चौपाई · ४० दिन", tel: "40 చౌపాయిలు · 40 రోజులు" },
      tagline: { roman: "Forty verses, eleven times a day, forty days — the count is the practice.", deva: "चालीस चौपाई, दिन में ग्यारह बार, चालीस दिन — गणना ही साधना है।", tel: "నలభై చౌపాయిలు, రోజుకు పదకొండుసార్లు, నలభై రోజులు — లెక్కే సాధన." },
      gist: [
        { roman: "The shortest text here and the heaviest discipline. Eleven readings a day is the common anuṣṭhāna; some keep eight, some a hundred and eight on the last day. What is not negotiable is the unbroken forty — a missed day is begun again.", deva: "यहाँ सबसे छोटा पाठ, सबसे कठिन नियम। प्रतिदिन ग्यारह पाठ सामान्य; कोई आठ, कोई अन्तिम दिन एक सौ आठ। अखण्ड चालीस दिन अनिवार्य — नागा होने पर पुनरारम्भ।", tel: "ఇక్కడ అతి చిన్న పాఠం, అతి కఠిన నియమం. రోజుకు పదకొండు పారాయణాలు సాధారణం; కొందరు ఎనిమిది, కొందరు చివరి రోజు నూట ఎనిమిది. నలభై రోజులు తెగకుండా ఉండటం తప్పనిసరి — తప్పితే మళ్లీ మొదటి నుంచి." },
      ],
      schedules: [
        { span: { roman: "Forty days", deva: "चालीस दिन", tel: "నలభై రోజులు" }, how: { roman: "Eleven readings daily at a fixed hour, on the same seat, facing the same direction.", deva: "नियत समय, वही आसन, वही दिशा — प्रतिदिन ग्यारह पाठ।", tel: "నిర్ణీత వేళ, అదే ఆసనం, అదే దిక్కు — రోజుకు పదకొండు పారాయణాలు." } },
        { span: { roman: "Tuesdays and Saturdays", deva: "मङ्गल एवं शनिवार", tel: "మంగళ, శనివారాలు" }, how: { roman: "Seven readings on the day; the ordinary household keeping.", deva: "उस दिन सात पाठ — सामान्य गृह-रीति।", tel: "ఆ రోజు ఏడు పారాయణాలు — సాధారణ ఇంటి ఆచారం." } },
      ],
      when: { roman: "Begun on a Tuesday; Hanumān Jayantī and the Śrāvaṇa Saturdays are favoured.", deva: "मङ्गलवार से आरम्भ; हनुमान् जयन्ती और श्रावण के शनिवार श्रेष्ठ।", tel: "మంగళవారం ప్రారంభం; హనుమజ్జయంతి, శ్రావణ శనివారాలు శ్రేష్ఠం." },
    },
    {
      id: "rudram-ekadasini", deity: "shiva",
      name: { roman: "Rudra Ekādaśinī", deva: "रुद्र एकादशिनी", tel: "రుద్ర ఏకాదశిని" },
      source: { roman: "Kṛṣṇa Yajurveda · Śrī Rudram", deva: "कृष्ण यजुर्वेद · श्री रुद्रम्", tel: "కృష్ణ యజుర్వేదం · శ్రీ రుద్రం" },
      span: { roman: "11 × Namakam · 1 Camakam", deva: "११ नमकम् · १ चमकम्", tel: "11 నమకం · 1 చమకం" },
      tagline: { roman: "Eleven namakams to one camakam — and eleven of those make a Rudra.", deva: "ग्यारह नमक एक चमक के साथ — और ऐसे ग्यारह मिलकर एक रुद्र।", tel: "పదకొండు నమకాలకు ఒక చమకం — అలాంటివి పదకొండు కలిస్తే ఒక రుద్రం." },
      gist: [
        { roman: "This one counts rather than schedules. Eleven recitations of the Namakam closed by one Camakam is an ekādaśinī; eleven ekādaśinīs make a Rudra, eleven Rudras a Mahārudra, and eleven of those an Atirudra — which is a temple undertaking, not a household one.", deva: "यहाँ गणना है, कालक्रम नहीं। ग्यारह नमक + एक चमक = एकादशिनी; ग्यारह एकादशिनी = रुद्र; ग्यारह रुद्र = महारुद्र; ग्यारह महारुद्र = अतिरुद्र (मन्दिर-स्तर का अनुष्ठान)।", tel: "ఇక్కడ ఉన్నది లెక్క, కాలక్రమం కాదు. పదకొండు నమకాలు + ఒక చమకం = ఏకాదశిని; పదకొండు ఏకాదశినులు = రుద్రం; పదకొండు రుద్రాలు = మహారుద్రం; పదకొండు మహారుద్రాలు = అతిరుద్రం — అది గుడి స్థాయి అనుష్ఠానం." },
        { roman: "Learn it from a teacher before undertaking it. The Rudram is Vedic — the svaras are the text, and a reading without them is not this pārāyaṇa.", deva: "गुरुमुख से सीखकर ही करें। रुद्रम् वैदिक है — स्वर ही पाठ हैं; स्वरहीन पाठ यह पारायण नहीं।", tel: "గురుముఖంగా నేర్చుకున్న తర్వాతే చేయాలి. రుద్రం వైదికం — స్వరాలే పాఠం; స్వరాలు లేని పఠనం ఈ పారాయణం కాదు." },
      ],
      schedules: [
        { span: { roman: "One sitting", deva: "एक बैठक", tel: "ఒక కూర్చునేసారి" }, how: { roman: "An ekādaśinī with abhiṣeka — about two hours, commonly on a Monday or Pradoṣa.", deva: "अभिषेक सहित एक एकादशिनी — लगभग दो घण्टे, प्रायः सोमवार अथवा प्रदोष को।", tel: "అభిషేకంతో ఒక ఏకాదశిని — సుమారు రెండు గంటలు, సాధారణంగా సోమవారం లేదా ప్రదోషం." } },
        { span: { roman: "Eleven days", deva: "ग्यारह दिन", tel: "పదకొండు రోజులు" }, how: { roman: "One ekādaśinī a day through Kārtika or the Śrāvaṇa Mondays, completing a Rudra.", deva: "कार्तिक अथवा श्रावण-सोमवारों में प्रतिदिन एक एकादशिनी — एक रुद्र पूर्ण।", tel: "కార్తికంలో లేదా శ్రావణ సోమవారాల్లో రోజుకు ఒక ఏకాదశిని — ఒక రుద్రం పూర్తి." } },
      ],
      when: { roman: "Kārtika and Śrāvaṇa Mondays, Pradoṣa, and Mahā Śivarātri.", deva: "कार्तिक एवं श्रावण के सोमवार, प्रदोष, महाशिवरात्रि।", tel: "కార్తిక, శ్రావణ సోమవారాలు, ప్రదోషం, మహాశివరాత్రి." },
    },
    {
      id: "lalita-parayana", deity: "devi",
      name: { roman: "Lalitā Sahasranāma Pārāyaṇa", deva: "ललितासहस्रनाम पारायण", tel: "లలితా సహస్రనామ పారాయణం" },
      source: { roman: "Brahmāṇḍa Purāṇa", deva: "ब्रह्माण्ड पुराण", tel: "బ్రహ్మాండ పురాణం" },
      span: { roman: "1000 names · weekly", deva: "१००० नाम · साप्ताहिक", tel: "1000 నామాలు · వారానికి" },
      tagline: { roman: "Fridays, and the Full Moon — the thousand names read at one sitting.", deva: "शुक्रवार और पूर्णिमा — एक ही बैठक में सहस्रनाम।", tel: "శుక్రవారాలు, పౌర్ణమి — ఒకే కూర్చునేసారి వెయ్యి నామాలు." },
      gist: [
        { roman: "Read whole or not at all — the thousand names are one garland and the tradition does not divide them across days. What varies is how often: every Friday, every Full Moon, or daily for a maṇḍala of forty-eight.", deva: "सम्पूर्ण पढ़ें अथवा नहीं — सहस्रनाम एक ही माला है, दिनों में विभक्त नहीं होती। भेद केवल आवृत्ति में: प्रत्येक शुक्रवार, पूर्णिमा, अथवा अड़तालीस दिन नित्य।", tel: "మొత్తం చదవాలి, లేదా అసలు వద్దు — వెయ్యి నామాలు ఒకే మాల, రోజులుగా విభజించరు. మారేది ఎంత తరచుగా అన్నదే: ప్రతి శుక్రవారం, పౌర్ణమి, లేదా నలభై ఎనిమిది రోజులు నిత్యం." },
      ],
      schedules: [
        { span: { roman: "Every Friday", deva: "प्रत्येक शुक्रवार", tel: "ప్రతి శుక్రవారం" }, how: { roman: "The common keeping — with kuṅkuma arcana where the household has the leisure.", deva: "सामान्य रीति — यथावकाश कुङ्कुम अर्चना सहित।", tel: "సాధారణ పద్ధతి — వీలుంటే కుంకుమార్చనతో." } },
        { span: { roman: "A maṇḍala — 48 days", deva: "मण्डल — ४८ दिन", tel: "మండలం — 48 రోజులు" }, how: { roman: "Daily at the same hour, closed with an arcana on the forty-eighth.", deva: "प्रतिदिन नियत समय; अड़तालीसवें दिन अर्चना से समापन।", tel: "రోజూ అదే వేళ; నలభై ఎనిమిదో రోజు అర్చనతో ముగింపు." } },
      ],
      when: { roman: "Fridays, Pūrṇimā, Navarātri, and the Śrāvaṇa month.", deva: "शुक्रवार, पूर्णिमा, नवरात्रि, श्रावण मास।", tel: "శుక్రవారాలు, పౌర్ణమి, నవరాత్రులు, శ్రావణ మాసం." },
    },
  ];
  /* The niyama is the same for every pārāyaṇa here, so it is written once
     rather than repeated eight times with small drifts. */
  const niyama = [
    { roman: "State the saṅkalpa on the first day — the text, the count of days, and what it is undertaken for. A pārāyaṇa without a stated end is a habit, not a vow.",
      deva: "प्रथम दिन संकल्प करें — ग्रन्थ, दिन-संख्या और प्रयोजन। बिना निश्चित समाप्ति के पारायण अभ्यास है, व्रत नहीं।",
      tel: "మొదటి రోజు సంకల్పం చెప్పాలి — గ్రంథం, ఎన్ని రోజులు, ఏ కోసం. ముగింపు చెప్పని పారాయణం అలవాటే తప్ప నోము కాదు." },
    { roman: "The same seat, the same hour, facing the same direction, every day of it.",
      deva: "प्रतिदिन वही आसन, वही समय, वही दिशा।",
      tel: "ప్రతిరోజూ అదే ఆసనం, అదే వేళ, అదే దిక్కు." },
    { roman: "Aloud, and at the pace the metre asks — not silently and not hurried to finish.",
      deva: "सस्वर और छन्दानुकूल गति से — न मौन, न शीघ्रता।",
      tel: "పైకి, ఛందస్సు అడిగే వేగంలోనే — మౌనంగా కాదు, తొందరగానూ కాదు." },
    { roman: "If a day is missed, say so plainly and begin the count again — the tradition would rather have a short reading finished than a long one abandoned.",
      deva: "नागा हो जाये तो स्पष्ट कहकर गणना पुनः आरम्भ करें — अपूर्ण दीर्घ पाठ से पूर्ण लघु पाठ श्रेष्ठ है।",
      tel: "ఒక రోజు తప్పితే స్పష్టంగా చెప్పి లెక్క మళ్లీ మొదలుపెట్టాలి — సగంలో వదిలిన పెద్ద పారాయణం కంటే పూర్తయిన చిన్నదే మేలు." },
    { roman: "Close with the phalaśruti, and give something away on the last day — food, a book, or the reading itself, aloud, to someone who cannot read it.",
      deva: "फलश्रुति से समापन; अन्तिम दिन कुछ दान करें — अन्न, ग्रन्थ, अथवा किसी अपाठक को सस्वर पाठ।",
      tel: "ఫలశ్రుతితో ముగించాలి; చివరి రోజు ఏదైనా దానం — అన్నం, పుస్తకం, లేదా చదవలేని వారికి పైకి చదివి వినిపించడం." },
  ];
  const byId = {};
  list.forEach((p) => { byId[p.id] = p; });
  return { list, byId, niyama, get: (id) => byId[id] || null };
})();

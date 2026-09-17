/* ============================================================
   STUTI website — the interface in the script you read in.
   The app renders every screen in the chosen script; the site only
   swapped the verses, so a Telugu reader met an English website with
   Telugu hymns in it. One dictionary, three columns, and a walker that
   applies it: data-t sets text, data-th sets a line that carries markup,
   data-tp a placeholder, data-ta an aria-label.
   Copy is deliberately short — a page a reciter can scan is worth more
   than a page that explains itself.
   ============================================================ */
window.SITE_I18N=(function(){
var S={
/* ---- deity epithets, and two lines the pages share ---- */
epGanesha:{roman:"Remover of obstacles",deva:"विघ्नहर्ता",telugu:"విఘ్నహర్త"},
epShiva:{roman:"The auspicious one",deva:"मङ्गलमय",telugu:"మంగళకరుడు"},
epDevi:{roman:"The Mother, Śakti",deva:"जगन्माता, शक्ति",telugu:"జగన్మాత, శక్తి"},
epVishnu:{roman:"The preserver",deva:"पालनकर्ता",telugu:"పాలకుడు"},
epSubrahmanya:{roman:"Skanda · Murugan",deva:"स्कन्द · मुरुगन्",telugu:"స్కందుడు · మురుగన్"},
epSurya:{roman:"The radiant sun",deva:"तेजस्वी सूर्य",telugu:"తేజోమయ సూర్యుడు"},
epGuru:{roman:"The teacher, the light",deva:"गुरु, प्रकाश",telugu:"గురువు, వెలుగు"},
epHanuman:{roman:"Añjaneya, the devoted",deva:"आञ्जनेय, भक्तश्रेष्ठ",telugu:"ఆంజనేయుడు, భక్తశ్రేష్ఠుడు"},
epItara:{roman:"The other forms",deva:"अन्य रूप",telugu:"ఇతర రూపాలు"},
abAccuracy:{roman:"<b>On accuracy.</b> A text that presents itself as complete when it is not is the one thing this project will not ship.",deva:"<b>शुद्धता पर।</b> अपूर्ण पाठ को पूर्ण कहकर देना — यही एक बात यह परियोजना नहीं करेगी।",telugu:"<b>ఖచ్చితత్వం.</b> అపూర్ణ పాఠాన్ని పూర్ణమని చూపడం — ఈ ప్రాజెక్ట్ చేయని ఒకే పని."},
shelfFor:{roman:"the shelf for",deva:"इस दिन का शेल्फ़ —",telugu:"ఈ రోజు అర —"},
belongsTo:{roman:"belongs to",deva:"का दिन",telugu:"రోజు"},
/* ---- the hour's greeting, as the app words it ---- */
greetMorning:{roman:"Good morning",deva:"सुप्रभात",telugu:"శుభోదయం"},
greetAfternoon:{roman:"Good afternoon",deva:"शुभ अपराह्न",telugu:"శుభ మధ్యాహ్నం"},
greetEvening:{roman:"Good evening",deva:"शुभ सन्ध्या",telugu:"శుభ సాయంత్రం"},
greetNight:{roman:"A peaceful night",deva:"शुभ रात्रि",telugu:"శుభ రాత్రి"},
/* ---- the sheet's own limb names, and what cast it ---- */
limbSamvatsara:{roman:"Saṃvatsara",deva:"संवत्सर",telugu:"సంవత్సరం"},
limbAyana:{roman:"Ayana",deva:"अयन",telugu:"అయనం"},
limbRitu:{roman:"Ṛtu",deva:"ऋतु",telugu:"ఋతువు"},
limbMasa:{roman:"Māsa",deva:"मास",telugu:"మాసం"},
limbVara:{roman:"Vāra",deva:"वार",telugu:"వారం"},
limbNaksatra:{roman:"Nakṣatra",deva:"नक्षत्र",telugu:"నక్షత్రం"},
limbYoga:{roman:"Yoga",deva:"योग",telugu:"యోగం"},
limbKarana:{roman:"Karaṇa",deva:"करण",telugu:"కరణం"},
limbRahu:{roman:"Rāhu kāla",deva:"राहु काल",telugu:"రాహు కాలం"},
limbDurmuhurta:{roman:"Durmuhūrta",deva:"दुर्मुहूर्त",telugu:"దుర్ముహూర్తం"},
northward:{roman:"northward",deva:"उत्तर की ओर",telugu:"ఉత్తర దిక్కుగా"},
southward:{roman:"southward",deva:"दक्षिण की ओर",telugu:"దక్షిణ దిక్కుగా"},
rkDrik:{roman:"dṛk gaṇita",deva:"दृक् गणित",telugu:"దృక్ గణితం"},
rkVakya:{roman:"vākya",deva:"वाक्य",telugu:"వాక్యం"},
ayLahiri:{roman:"Lahiri",deva:"लाहिरी",telugu:"లాహిరి"},
ayRaman:{roman:"Raman",deva:"रमण",telugu:"రమణ"},
ayKp:{roman:"KP",deva:"के.पी.",telugu:"కె.పి."},
msAmanta:{roman:"amānta",deva:"अमान्त",telugu:"అమాంతం"},
msPurnimanta:{roman:"pūrṇimānta",deva:"पूर्णिमान्त",telugu:"పూర్ణిమాంతం"},
ayanamsaWord:{roman:"ayanāṁśa",deva:"अयनांश",telugu:"అయనాంశ"},
nirayanaBy:{roman:"nirayana by construction",deva:"स्वयं निरयन",telugu:"స్వతహాగా నిరయనం"},
/* ---- the fortnight ---- */
pakshaSukla:{roman:"Śukla",deva:"शुक्ल",telugu:"శుక్ల"},
pakshaKrsna:{roman:"Kṛṣṇa",deva:"कृष्ण",telugu:"కృష్ణ"},
/* ---- masthead + footer ---- */
navHome:{roman:"Home",deva:"गृह",telugu:"గృహం"},
navLibrary:{roman:"Library",deva:"संग्रह",telugu:"సంకలనం"},
navRead:{roman:"Stotras",deva:"स्तोत्र",telugu:"స్తోత్రాలు"},
navPractice:{roman:"Practice",deva:"अनुष्ठान",telugu:"అనుష్ఠానం"},
navCalendar:{roman:"Calendar",deva:"पञ्चाङ्ग",telugu:"పంచాంగం"},
navSettings:{roman:"Settings",deva:"सेटिंग्स",telugu:"సెట్టింగ్‌లు"},
navAbout:{roman:"About",deva:"परिचय",telugu:"పరిచయం"},
getApp:{roman:"Get the app",deva:"ऐप लें",telugu:"యాప్ పొందండి"},
skipToPage:{roman:"Skip to the page",deva:"पृष्ठ पर जाएँ",telugu:"పేజీకి వెళ్ళండి"},
footRead:{roman:"Read",deva:"पढ़ें",telugu:"చదవండి"},
footApp:{roman:"The app",deva:"ऐप",telugu:"యాప్"},
footMore:{roman:"More",deva:"और",telugu:"మరిన్ని"},
fLibrary:{roman:"The library",deva:"संग्रह",telugu:"సంకలనం"},
fReader:{roman:"The reader",deva:"वाचन",telugu:"పఠనం"},
fPanchanga:{roman:"Today's pañcāṅga",deva:"आज का पञ्चाङ्ग",telugu:"నేటి పంచాంగం"},
fWhatAdds:{roman:"What it adds",deva:"ऐप में और क्या",telugu:"యాప్‌లో అదనంగా"},
fInstall:{roman:"Install Stuti",deva:"स्तुति स्थापित करें",telugu:"స్తుతి ఇన్‌స్టాల్ చేయండి"},
fWhySign:{roman:"Why sign in",deva:"साइन इन क्यों",telugu:"సైన్ ఇన్ ఎందుకు"},
fChangelog:{roman:"Changelog",deva:"परिवर्तन-सूची",telugu:"మార్పుల జాబితా"},
footTag:{roman:"A recitation companion — mūla-accurate, unhurried, made to be kept.",deva:"पाठ का सहचर — मूल-सम्मत, अविचल, संग रहने योग्य।",telugu:"పారాయణ సహచరుడు — మూలానుసారం, తొందర లేకుండా, నిలిచేలా."},
footRights:{roman:"© 2026 Stuti — traditional, public-domain texts.",deva:"© २०२६ स्तुति — पारम्परिक, सार्वजनिक पाठ।",telugu:"© 2026 స్తుతి — సంప్రదాయ, సార్వజనిక పాఠాలు."},
footMade:{roman:"Made elder-first, for the pūjā room and the desk alike.",deva:"वृद्धजनों के लिए पहले — पूजा-गृह और मेज़, दोनों हेतु।",telugu:"పెద్దలకు మొదట — పూజ గదికీ, బల్లకీ ఒకేలా."},
/* ---- home ---- */
heroTitle:{roman:"The hymn, exactly as it is said.",deva:"स्तोत्र, जैसा कहा जाता है वैसा ही।",telugu:"స్తోత్రం, చెప్పినట్టుగానే."},
searchBar:{roman:"Search titles, verses, words",deva:"स्तोत्र, श्लोक, शब्द खोजें",telugu:"స్తోత్రాలు, శ్లోకాలు, పదాలు వెతకండి"},
wholeDay:{roman:"The whole day, hour by hour",deva:"पूरा दिन, घण्टे-घण्टे",telugu:"రోజంతా, గంట గంటకు"},
homeLede:{roman:"Mūla text in three scripts, the meaning of every line, and paced highlighting to recite by.",deva:"तीन लिपियों में मूल पाठ, हर पंक्ति का अर्थ, और पाठ हेतु गति-अनुसार प्रकाश।",telugu:"మూడు లిపులలో మూల పాఠం, ప్రతి పంక్తి అర్థం, పారాయణానికి తగిన వెలుగు."},
beginReciting:{roman:"Begin reciting",deva:"पाठ आरम्भ करें",telugu:"పారాయణం మొదలు"},
browseLibrary:{roman:"Browse the library",deva:"संग्रह देखें",telugu:"సంకలనం చూడండి"},
factTexts:{roman:"Texts to read",deva:"पाठ",telugu:"పాఠాలు"},
factVerses:{roman:"Verses",deva:"श्लोक",telugu:"శ్లోకాలు"},
factTitles:{roman:"Titles catalogued",deva:"सूचीबद्ध",telugu:"సూచీలో"},
factScripts:{roman:"Scripts",deva:"लिपियाँ",telugu:"లిపులు"},
shelfEyebrow:{roman:"Complete, and glossed",deva:"पूर्ण, अर्थ सहित",telugu:"పూర్ణం, అర్థంతో"},
shelfHead:{roman:"On the shelf today",deva:"आज के पाठ",telugu:"నేటి పాఠాలు"},
wholeLibrary:{roman:"The whole library",deva:"पूरा संग्रह",telugu:"పూర్తి సంకలనం"},
practiceEyebrow:{roman:"From listener to reciter",deva:"श्रोता से पाठक",telugu:"శ్రోత నుండి పాఠకుడు"},
practiceHead:{roman:"Practice, witnessed — never scored",deva:"अनुष्ठान — साक्षी भाव से, अंक नहीं",telugu:"అనుష్ఠానం — సాక్షిగా, అంకెలు కాదు"},
practiceLede:{roman:"Japa counted to 108, a pārāyaṇa in daily portions, a vratam on its real tithi.",deva:"१०८ तक जप, दैनिक भागों में पारायण, अपनी तिथि पर व्रत।",telugu:"108 వరకు జపం, రోజువారీ భాగాలలో పారాయణం, సరైన తిథిన వ్రతం."},
howPractice:{roman:"How practice works",deva:"अनुष्ठान कैसे चलता है",telugu:"అనుష్ఠానం ఎలా సాగుతుంది"},
whatAppAdds:{roman:"What the app adds",deva:"ऐप में और क्या",telugu:"యాప్‌లో అదనంగా"},
noAccount:{roman:"<b>Reading needs no account.</b> The library, the reader and the day's almanac open cold. <a href=\"get.html#account\">Why sign in</a>",deva:"<b>पढ़ने हेतु खाता नहीं चाहिए।</b> संग्रह, वाचन और दिन का पञ्चाङ्ग सीधे खुलते हैं। <a href=\"get.html#account\">साइन इन क्यों</a>",telugu:"<b>చదవడానికి ఖాతా అవసరం లేదు.</b> సంకలనం, పఠనం, నేటి పంచాంగం నేరుగా తెరుచుకుంటాయి. <a href=\"get.html#account\">సైన్ ఇన్ ఎందుకు</a>"},
/* ---- library ---- */
libEyebrow:{roman:"One pool, six ways in",deva:"एक संग्रह, छह दृष्टियाँ",telugu:"ఒకే సంకలనం, ఆరు దారులు"},
libHead:{roman:"The library",deva:"संग्रह",telugu:"సంకలనం"},
libLede:{roman:"Every text, sliced by deity, by kind, by vratam, by nomu, by pārāyaṇa, by author.",deva:"प्रत्येक पाठ — देवता, प्रकार, व्रत, नोमु, पारायण और रचयिता के अनुसार।",telugu:"ప్రతి పాఠం — దేవత, రకం, వ్రతం, నోము, పారాయణం, రచయిత వారీగా."},
libSearchPh:{roman:"Search titles and verses",deva:"स्तोत्र और श्लोक खोजें",telugu:"స్తోత్రాలు, శ్లోకాలు వెతకండి"},
readableHere:{roman:"readable here",deva:"यहाँ पढ़ने योग्य",telugu:"ఇక్కడ చదవగలిగేవి"},
inTheApp:{roman:"in the app",deva:"ऐप में",telugu:"యాప్‌లో"},
nothingHere:{roman:"Nothing here yet.",deva:"अभी कुछ नहीं।",telugu:"ఇంకా ఏమీ లేదు."},
noMatch:{roman:"Nothing by that name.",deva:"इस नाम से कुछ नहीं मिला।",telugu:"ఆ పేరుతో ఏమీ దొరకలేదు."},
allShelves:{roman:"All the shelves",deva:"सभी शेल्फ़",telugu:"అన్ని అరలు"},
whatIsRecited:{roman:"What is recited",deva:"क्या पाठ किया जाता है",telugu:"ఏమి పారాయణం చేస్తారు"},
howDivided:{roman:"How it is divided",deva:"विभाजन",telugu:"విభజన"},
texts:{roman:"texts",deva:"पाठ",telugu:"పాఠాలు"},
/* ---- reader ---- */
readerNote:{roman:"Space plays and pauses; the arrow keys step verses, and the bar jumps. <a href=\"get.html#account\">An account carries your place to the app</a>",deva:"स्पेस से आरम्भ-विराम; तीर-कुंजियों से श्लोक; पट्टी से छलाँग। <a href=\"get.html#account\">खाता आपका स्थान ऐप तक ले जाता है</a>",telugu:"స్పేస్‌తో ఆడు-ఆపు; బాణం కీలతో శ్లోకాలు; పట్టీతో దూకు. <a href=\"get.html#account\">ఖాతా మీ స్థానాన్ని యాప్‌కు తీసుకెళ్తుంది</a>"},
readerMiss:{roman:"<b>That link does not name a text the website carries.</b> <a href=\"library.html\">The library lists them all</a>",deva:"<b>यह कड़ी वेबसाइट के किसी पाठ का नाम नहीं है।</b> <a href=\"library.html\">संग्रह में सब सूचीबद्ध हैं</a>",telugu:"<b>ఈ లింక్ వెబ్‌సైట్‌లోని ఏ పాఠాన్నీ సూచించదు.</b> <a href=\"library.html\">సంకలనంలో అన్నీ ఉన్నాయి</a>"},
verseOf:{roman:"Verse",deva:"श्लोक",telugu:"శ్లోకం"},
shareLbl:{roman:"Share",deva:"साझा",telugu:"పంచుకో"},
printLbl:{roman:"Print",deva:"मुद्रण",telugu:"ముద్రణ"},
shareLock:{roman:"Coming in v2",deva:"आगामी — संस्करण 2",telugu:"వస్తుంది — వెర్షన్ 2"},
printLock:{roman:"Coming in v2",deva:"आगामी — संस्करण 2",telugu:"వస్తుంది — వెర్షన్ 2"},
limLockNote:{roman:"<b>Printing and sharing beyond the app's one free each a month are moving to a paid plan in v2.</b> Nothing is charged today.",deva:"<b>मास में एक नि:शुल्क मुद्रण और साझा से आगे, संस्करण 2 में एक सशुल्क योजना आयेगी।</b> आज कोई शुल्क नहीं।",telugu:"<b>నెలకు ఒక ఉచిత ముద్రణ, పంచుకోవడం దాటితే వెర్షన్ 2లో చెల్లింపు ప్రణాళిక వస్తుంది.</b> ఈరోజు రుసుము లేదు."},
of:{roman:"of",deva:"में से",telugu:"లో"},
speedTitle:{roman:"How fast the lines advance",deva:"पंक्तियों की गति",telugu:"పంక్తుల వేగం"},
loopTitle:{roman:"Repeat this verse",deva:"यही श्लोक दोहराएँ",telugu:"ఈ శ్లోకాన్నే మళ్ళీ"},
scrubTitle:{roman:"Jump to a verse",deva:"किसी श्लोक पर जाएँ",telugu:"ఏదైనా శ్లోకానికి"},
playPause:{roman:"Play or pause",deva:"आरम्भ या विराम",telugu:"ఆడు లేదా ఆపు"},
prevVerse:{roman:"Previous verse",deva:"पिछला श्लोक",telugu:"గత శ్లోకం"},
nextVerse:{roman:"Next verse",deva:"अगला श्लोक",telugu:"తరువాతి శ్లోకం"},
/* ---- the day ---- */
calEyebrow:{roman:"The month, tithi by tithi",deva:"मास, तिथि-तिथि",telugu:"మాసం, తిథి వారీగా"},
calLede:{roman:"Pick a day and its full sheet opens beside the month, computed for this place.",deva:"कोई दिन चुनें — उसका पूरा पत्रक मास के साथ खुलता है, इसी स्थान हेतु गणित।",telugu:"ఒక రోజు ఎంచుకోండి — దాని పూర్ణ పత్రం మాసం పక్కన తెరుచుకుంటుంది, ఈ స్థలానికి గణించి."},
almEyebrow:{roman:"The day, before the hymn",deva:"पाठ से पूर्व, दिन",telugu:"పాఠానికి ముందు, రోజు"},
almHead:{roman:"Today's pañcāṅga",deva:"आज का पञ्चाङ्ग",telugu:"నేటి పంచాంగం"},
almLede:{roman:"All five limbs with their closing hours, the sun and the moon, and the two windows to keep clear of.",deva:"पाँचों अङ्ग अपने समय सहित, सूर्य और चन्द्र, और दो वर्ज्य काल।",telugu:"ఐదు అంగాలు వాటి వేళలతో, సూర్యుడు, చంద్రుడు, రెండు వర్జ్య కాలాలు."},
plateNote:{roman:"<b>The three bands</b> are the window's uttama, madhyama and adhama parts; the tick is the hour standing now.",deva:"<b>तीन पट्टियाँ</b> — उत्तम, मध्यम, अधम; चिह्न इस समय का है।",telugu:"<b>మూడు పట్టీలు</b> — ఉత్తమం, మధ్యమం, అధమం; గుర్తు ఇప్పటి వేళ."},
almComputed:{roman:"<b>Computed, not tabulated.</b> The app carries the same sheet with no signal, and a reminder at each juncture. <a href=\"get.html\">What the app adds</a>",deva:"<b>गणित, तालिका से नहीं।</b> ऐप वही पत्रक बिना नेटवर्क रखता है, और प्रत्येक सन्ध्या पर स्मरण। <a href=\"get.html\">ऐप में और क्या</a>",telugu:"<b>గణించినది, పట్టిక కాదు.</b> నెట్ లేకుండానే యాప్ అదే పత్రాన్ని ఇస్తుంది, ప్రతి సంధ్యకు స్మరణ కూడా. <a href=\"get.html\">యాప్‌లో అదనంగా</a>"},
findRecite:{roman:"Find something to recite",deva:"पाठ हेतु कुछ चुनें",telugu:"పారాయణానికి ఏదైనా ఎంచుకోండి"},
sandhyaCap:{roman:"Sandhyāvandanam",deva:"सन्ध्यावन्दनम्",telugu:"సంధ్యావందనం"},
nextJuncture:{roman:"The next juncture",deva:"अगली सन्ध्या",telugu:"తరువాతి సంధ్య"},
till:{roman:"till",deva:"तक",telugu:"వరకు"},
opensIn:{roman:"opens in",deva:"में आरम्भ",telugu:"లో మొదలు"},
prayaschitta:{roman:"Begun in adhama kāla — the prāyaścitta arghya is prescribed.",deva:"अधम काल में आरम्भ — प्रायश्चित्त अर्घ्य विहित है।",telugu:"అధమ కాలంలో మొదలు — ప్రాయశ్చిత్త అర్ఘ్యం విధి."},
todaysPanchanga:{roman:"Today's pañcāṅga",deva:"आज का पञ्चाङ्ग",telugu:"నేటి పంచాంగం"},
daysPanchanga:{roman:"The day's pañcāṅga",deva:"दिन का पञ्चाङ्ग",telugu:"ఆ రోజు పంచాంగం"},
sunrise:{roman:"Sunrise",deva:"सूर्योदय",telugu:"సూర్యోదయం"},
sunset:{roman:"Sunset",deva:"सूर्यास्त",telugu:"సూర్యాస్తమయం"},
moonrise:{roman:"Moonrise",deva:"चन्द्रोदय",telugu:"చంద్రోదయం"},
moonset:{roman:"Moonset",deva:"चन्द्रास्त",telugu:"చంద్రాస్తమయం"},
daylight:{roman:"of daylight",deva:"दिन का प्रकाश",telugu:"పగటి వెలుగు"},
keptAs:{roman:"Kept as",deva:"पर्व",telugu:"పర్వం"},
until:{roman:"until",deva:"तक",telugu:"వరకు"},
tomorrow:{roman:"tomorrow",deva:"कल",telugu:"రేపు"},
sankalpaFoot:{roman:"The saṅkalpa reads off these limbs",deva:"सङ्कल्प इन्हीं अङ्गों से पढ़ा जाता है",telugu:"సంకల్పం ఈ అంగాల నుండే చదవబడుతుంది"},
castWith:{roman:"Cast",deva:"गणना",telugu:"గణన"},
atThisMoment:{roman:"at this moment",deva:"इस क्षण के लिए",telugu:"ఈ క్షణానికి"},
searchCity:{roman:"Search a city",deva:"नगर खोजें",telugu:"నగరం వెతకండి"},
noPlace:{roman:"No place by that name.",deva:"इस नाम का स्थान नहीं मिला।",telugu:"ఆ పేరుతో స్థలం లేదు."},
prevMonth:{roman:"Previous month",deva:"पिछला मास",telugu:"గత మాసం"},
nextMonth:{roman:"Next month",deva:"अगला मास",telugu:"తరువాతి మాసం"},
/* ---- settings ---- */
setEyebrow:{roman:"How the site reads",deva:"साइट कैसे पढ़े",telugu:"సైట్ ఎలా చదవాలి"},
setLede:{roman:"Kept in this browser. No account, nothing sent anywhere.",deva:"इसी ब्राउज़र में रखा जाता है। न खाता, न कुछ भेजा जाता है।",telugu:"ఈ బ్రౌజర్‌లోనే ఉంటుంది. ఖాతా లేదు, ఏదీ బయటకు వెళ్ళదు."},
sScript:{roman:"Reading script",deva:"पाठ-लिपि",telugu:"పఠన లిపి"},
sScriptH:{roman:"The script you read in",deva:"आप किस लिपि में पढ़ेंगे",telugu:"మీరు చదివే లిపి"},
sScriptP:{roman:"The verse is held in Hindi letters; Telugu and English are written out from it.",deva:"मूल पाठ हिन्दी अक्षरों में रहता है; तेलुगु और अंग्रेज़ी उससे लिखे जाते हैं।",telugu:"మూల పాఠం హిందీ అక్షరాలలో ఉంటుంది; తెలుగు, ఇంగ్లిష్ దాని నుండి వ్రాయబడతాయి."},
sUiLang:{roman:"Interface language",deva:"अंतरफलक भाषा",telugu:"ఇంటర్ఫేస్ భాష"},
sUiLangH:{roman:"What the buttons and pages say",deva:"बटन और पृष्ठ किस भाषा में",telugu:"బటన్లు, పేజీలు ఏ భాషలో"},
sUiLangP:{roman:"Separate from the reading script — Telugu verses can sit under an English interface, or the reverse.",deva:"पाठ-लिपि से पृथक् — तेलुगु श्लोक अंग्रेज़ी अंतरफलक के नीचे भी रह सकते हैं, या इसका विपरीत।",telugu:"పఠన లిపి నుండి వేరుగా — తెలుగు శ్లోకాలు ఆంగ్ల ఇంటర్ఫేస్ కింద కూడా ఉండొచ్చు, లేదా దీనికి విరుద్ధంగా."},
sFace:{roman:"Face",deva:"रूप",telugu:"రూపం"},
sFaceH:{roman:"Day or night",deva:"दिन या रात्रि",telugu:"పగలు లేక రాత్రి"},
sFaceP:{roman:"Parchment by day; a lamplit ground for the evening.",deva:"दिन में भोजपत्र; सन्ध्या हेतु दीप-प्रकाश।",telugu:"పగలు తాళపత్రం; సాయంత్రం దీపకాంతి."},
sPlace:{roman:"Almanac",deva:"पञ्चाङ्ग",telugu:"పంచాంగం"},
sPlaceH:{roman:"Where the day is computed",deva:"दिन कहाँ के लिए गणित है",telugu:"రోజు ఎక్కడికి గణించాలి"},
sPlaceP:{roman:"Sunrise, the tithi's turn and the sandhyā windows all follow it.",deva:"सूर्योदय, तिथि का बदलना और सन्ध्या काल — सब इसी से।",telugu:"సూర్యోదయం, తిథి మార్పు, సంధ్యా కాలాలు — అన్నీ దీని ప్రకారం."},
sReck:{roman:"Reckoning",deva:"गणित",telugu:"గణితం"},
sReckH:{roman:"How the day is cast",deva:"दिन कैसे गणित हो",telugu:"రోజు ఎలా గణించాలి"},
sReckP:{roman:"Dr̥k follows the sky; vākya follows the Siddhānta's arithmetic. They can name a different tithi on the same morning.",deva:"दृक् आकाश का अनुसरण करता है; वाक्य सिद्धान्त के गणित का। एक ही प्रभात पर तिथि भिन्न हो सकती है।",telugu:"దృక్ ఆకాశాన్ని అనుసరిస్తుంది; వాక్యం సిద్ధాంత గణితాన్ని. ఒకే ఉదయాన తిథి వేరుగా ఉండవచ్చు."},
sMasa:{roman:"Māsa",deva:"मास",telugu:"మాసం"},
sMasaH:{roman:"How the months are named",deva:"मासों के नाम",telugu:"మాసాల పేర్లు"},
sMasaP:{roman:"Amānta counts from the new moon, pūrṇimānta from the full.",deva:"अमान्त अमावस्या से गिनता है, पूर्णिमान्त पूर्णिमा से।",telugu:"అమాంతం అమావాస్య నుండి, పూర్ణిమాంతం పూర్ణిమ నుండి."},
sMasaNote:{roman:"These three are the app's own settings — set them here and it opens with them.",deva:"ये तीन ऐप की ही सेटिंग्स हैं — यहाँ चुनें, ऐप उन्हीं से खुलेगा।",telugu:"ఈ మూడు యాప్‌కూ చెందినవే — ఇక్కడ ఎంచుకుంటే యాప్ అవే తీసుకుంటుంది."},
sPos:{roman:"Reading position",deva:"पाठ-स्थान",telugu:"పఠన స్థానం"},
sPosH:{roman:"Where you left off",deva:"आप कहाँ रुके थे",telugu:"మీరు ఆగిన చోటు"},
sPosP:{roman:"The verse you were on, in this browser only.",deva:"आप जिस श्लोक पर थे — केवल इसी ब्राउज़र में।",telugu:"మీరున్న శ్లోకం — ఈ బ్రౌజర్‌లో మాత్రమే."},
nothingYet:{roman:"Nothing yet",deva:"अभी कुछ नहीं",telugu:"ఇంకా ఏమీ లేదు"},
forgetIt:{roman:"Forget it",deva:"भुला दें",telugu:"మరచిపో"},
takeMeBack:{roman:"Take me back there",deva:"वहीं ले चलें",telugu:"అక్కడికే తీసుకెళ్ళు"},
setAppNote:{roman:"<b>In the app.</b> Reminders at each sandhyā, the texts held offline, the saṅkalpa flyleaf, and the japa and pārāyaṇa records. <a href=\"get.html\">What the app adds</a>",deva:"<b>ऐप में।</b> प्रत्येक सन्ध्या पर स्मरण, बिना नेटवर्क पाठ, सङ्कल्प-पत्र, और जप और पारायण का लेखा। <a href=\"get.html\">ऐप में और क्या</a>",telugu:"<b>యాప్‌లో.</b> ప్రతి సంధ్యకు స్మరణ, నెట్ లేకుండా పాఠాలు, సంకల్ప పత్రం, జప పారాయణ లెక్క. <a href=\"get.html\">యాప్‌లో అదనంగా</a>"},
ayanNote:{roman:"Lahiri is the government almanac's.",deva:"लाहिरी राजकीय पञ्चाङ्ग का है।",telugu:"లాహిరి ప్రభుత్వ పంచాంగానిది."},
ayanNoteVakya:{roman:"Vākya is nirayana by construction, so the ayanāṁśa has nothing to act on.",deva:"वाक्य स्वयं निरयन है, इसलिए अयनांश का कोई कार्य नहीं।",telugu:"వాక్యం స్వతహాగా నిరయనం, కాబట్టి అయనాంశకు పని లేదు."},
/* ---- practice ---- */
prLede:{roman:"A thread kept, not a game won. Reading lives here; keeping lives in the app.",deva:"जीती हुई बाज़ी नहीं, थामी हुई धारा। पढ़ना यहाँ; थामना ऐप में।",telugu:"గెలిచిన ఆట కాదు, నిలిపిన ధార. చదవడం ఇక్కడ; నిలపడం యాప్‌లో."},
prJapa:{roman:"The japa mālā",deva:"जप माला",telugu:"జప మాల"},
prJapaP:{roman:"108 to the round, a soft turn at the meru bead, and a tally that keeps itself.",deva:"एक माला १०८, मेरु मनके पर कोमल मोड़, और स्वयं चलता लेखा।",telugu:"ఒక మాలకు 108, మేరు పూసవద్ద మెల్లి మలుపు, తనకు తానే నిలిచే లెక్క."},
prParayana:{roman:"Pārāyaṇa plans",deva:"पारायण योजनाएँ",telugu:"పారాయణ ప్లాన్‌లు"},
prParayanaP:{roman:"The bookshelf becomes a course: small daily portions, visible progress, grace days.",deva:"संग्रह एक क्रम बनता है — छोटे दैनिक भाग, दृश्य प्रगति, कृपा-दिवस।",telugu:"సంకలనం ఒక క్రమమవుతుంది — చిన్న రోజువారీ భాగాలు, కనిపించే పురోగతి, అనుగ్రహ దినాలు."},
prVratam:{roman:"Vratam & festival",deva:"व्रत और पर्व",telugu:"వ్రతం, పర్వం"},
prVratamP:{roman:"What to recite today, and why — each vratam with its tithi read from the almanac.",deva:"आज क्या पढ़ें और क्यों — प्रत्येक व्रत, पञ्चाङ्ग से उसकी तिथि सहित।",telugu:"ఈరోజు ఏమి చదవాలి, ఎందుకు — ప్రతి వ్రతం, పంచాంగం నుండి దాని తిథితో."},
prLensParayana:{roman:"The pārāyaṇa lens",deva:"पारायण दृष्टि",telugu:"పారాయణ దారి"},
prLensVratam:{roman:"Every vratam",deva:"सभी व्रत",telugu:"అన్ని వ్రతాలు"},
prWhyApp:{roman:"Why the counter is the app's",deva:"गणक ऐप में क्यों",telugu:"లెక్క యాప్‌లో ఎందుకు"},
prNothingScored:{roman:"<b>Nothing is scored.</b> A missed day is a missed day; the vow says so and carries on.",deva:"<b>कोई अंक नहीं।</b> छूटा दिन छूटा ही है; व्रत यही कहकर आगे चलता है।",telugu:"<b>అంకెలు లేవు.</b> తప్పిన రోజు తప్పినదే; వ్రతం అది చెప్పి ముందుకు సాగుతుంది."},
readFirst:{roman:"Read something first",deva:"पहले कुछ पढ़ें",telugu:"ముందు ఏదైనా చదవండి"},
/* ---- about + get ---- */
abEyebrow:{roman:"What this is",deva:"यह क्या है",telugu:"ఇది ఏమిటి"},
abHead:{roman:"A companion for the reciter",deva:"पाठक का सहचर",telugu:"పాఠకుని సహచరుడు"},
abLede:{roman:"It does one thing: it helps you recite — correctly, with understanding, and eventually by heart.",deva:"यह एक ही कार्य करता है — शुद्ध पाठ, अर्थ सहित, और अन्ततः कण्ठस्थ।",telugu:"ఇది ఒకటే చేస్తుంది — శుద్ధంగా, అర్థంతో, చివరకు కంఠస్థంగా పారాయణం."},
abScripts:{roman:"Three scripts, one source",deva:"तीन लिपियाँ, एक मूल",telugu:"మూడు లిపులు, ఒకే మూలం"},
abScriptsP:{roman:"The verse is held in Hindi letters; Telugu and English are written out from it as you read.",deva:"मूल पाठ हिन्दी अक्षरों में रहता है; पढ़ते समय तेलुगु और अंग्रेज़ी उससे लिखे जाते हैं।",telugu:"మూల పాఠం హిందీ అక్షరాలలో ఉంటుంది; చదివేటప్పుడు తెలుగు, ఇంగ్లిష్ దాని నుండి వ్రాయబడతాయి."},
abMeaning:{roman:"Meaning, line by line",deva:"पंक्ति-पंक्ति अर्थ",telugu:"పంక్తి పంక్తికి అర్థం"},
abMeaningP:{roman:"The sense of the line you are on — not a summary of the hymn.",deva:"जिस पंक्ति पर हैं उसका अर्थ — स्तोत्र का सारांश नहीं।",telugu:"మీరున్న పంక్తి అర్థం — స్తోత్ర సారాంశం కాదు."},
abUnhurried:{roman:"Unhurried, and elder-first",deva:"अविचल, वृद्धजन-प्रथम",telugu:"తొందర లేకుండా, పెద్దలకు మొదట"},
abUnhurriedP:{roman:"Large type, generous targets, a day and a night face. Nothing blinks or counts down.",deva:"बड़े अक्षर, बड़े स्पर्श-क्षेत्र, दिन और रात्रि रूप। कुछ झपकता या घटता नहीं।",telugu:"పెద్ద అక్షరాలు, పెద్ద తాకే చోట్లు, పగలు రాత్రి రూపాలు. ఏదీ మెరవదు, తగ్గదు."},
abOpen:{roman:"Traditional texts, openly",deva:"पारम्परिक पाठ, मुक्त रूप से",telugu:"సంప్రదాయ పాఠాలు, స్వేచ్ఛగా"},
abOpenP:{roman:"Public domain, and given whole — no verse withheld, no paywall on scripture.",deva:"सार्वजनिक, और पूर्ण — कोई श्लोक रोका नहीं, शास्त्र पर शुल्क नहीं।",telugu:"సార్వజనికం, పూర్ణం — ఏ శ్లోకమూ దాచలేదు, శాస్త్రానికి రుసుము లేదు."},
abMoney:{roman:"<b>No ads, ever.</b> The library, the reader and the almanac open with no account. <a href=\"get.html#account\">What an account is for</a>",deva:"<b>विज्ञापन कभी नहीं।</b> संग्रह, वाचन और पञ्चाङ्ग बिना खाते खुलते हैं। <a href=\"get.html#account\">खाता किसलिए</a>",telugu:"<b>ప్రకటనలు ఎప్పుడూ లేవు.</b> సంకలనం, పఠనం, పంచాంగం ఖాతా లేకుండా తెరుచుకుంటాయి. <a href=\"get.html#account\">ఖాతా ఎందుకు</a>"},
readChangelog:{roman:"Read the changelog",deva:"परिवर्तन-सूची पढ़ें",telugu:"మార్పుల జాబితా చూడండి"},
getEyebrow:{roman:"One text, every room",deva:"एक पाठ, हर कक्ष",telugu:"ఒకే పాఠం, అన్ని గదులు"},
getHead:{roman:"Take it into the pūjā room",deva:"पूजा-गृह तक ले जाएँ",telugu:"పూజ గదిలోకి తీసుకెళ్ళండి"},
getLede:{roman:"The website reads. The app keeps — the whole library offline, the live pañcāṅga, japa, pārāyaṇa and your place in it.",deva:"वेबसाइट पढ़ाती है। ऐप थामता है — पूरा संग्रह बिना नेटवर्क, सजीव पञ्चाङ्ग, जप, पारायण और आपका स्थान।",telugu:"వెబ్‌సైట్ చదివిస్తుంది. యాప్ నిలుపుతుంది — నెట్ లేకుండా పూర్తి సంకలనం, సజీవ పంచాంగం, జపం, పారాయణం, మీ స్థానం."},
installFree:{roman:"Install Stuti — free",deva:"स्तुति स्थापित करें — निःशुल्क",telugu:"స్తుతి ఇన్‌స్టాల్ చేయండి — ఉచితం"},
kidsLink:{roman:"Kathā, for children",deva:"बालकों हेतु कथा",telugu:"పిల్లలకు కథ"},
chipOffline:{roman:"Offline, always",deva:"सदा बिना नेटवर्क",telugu:"ఎప్పుడూ నెట్ లేకుండా"},
chipNoAds:{roman:"No ads, ever",deva:"विज्ञापन कभी नहीं",telugu:"ప్రకటనలు ఎప్పుడూ లేవు"},
chipNoAccount:{roman:"Read without an account",deva:"बिना खाते पढ़ें",telugu:"ఖాతా లేకుండా చదవండి"},
chipPublic:{roman:"Public-domain texts",deva:"सार्वजनिक पाठ",telugu:"సార్వజనిక పాఠాలు"},
whySignIn:{roman:"Why sign in",deva:"साइन इन क्यों",telugu:"సైన్ ఇన్ ఎందుకు"},
acctHead:{roman:"An account, only where it earns one",deva:"खाता — केवल जहाँ आवश्यक",telugu:"ఖాతా — అవసరమైన చోటే"},
acct1:{roman:"Your place, in both rooms",deva:"आपका स्थान, दोनों कक्षों में",telugu:"మీ స్థానం, రెండు గదులలో"},
acct1P:{roman:"The verse you left in the pūjā room is the verse waiting at the desk.",deva:"पूजा-गृह में छोड़ा श्लोक ही मेज़ पर प्रतीक्षा करता है।",telugu:"పూజ గదిలో ఆగిన శ్లోకమే బల్లవద్ద ఎదురుచూస్తుంది."},
acct2:{roman:"A thread that survives a new phone",deva:"नए फ़ोन पर भी धारा",telugu:"కొత్త ఫోన్‌లోనూ ధార"},
acct2P:{roman:"Japa rounds, pārāyaṇa days and a vow kept are held for you.",deva:"जप की मालाएँ, पारायण के दिन और थामा व्रत — सब सुरक्षित।",telugu:"జప మాలలు, పారాయణ దినాలు, నిలిపిన వ్రతం — అన్నీ భద్రం."},
acct3:{roman:"The saṅkalpa remembers you",deva:"सङ्कल्प आपको स्मरण रखता है",telugu:"సంకల్పం మిమ్మల్ని గుర్తుంచుకుంటుంది"},
acct3P:{roman:"Nāma, gotra and deśa are said once, not typed every morning.",deva:"नाम, गोत्र और देश एक बार — प्रति प्रभात लिखना नहीं।",telugu:"నామం, గోత్రం, దేశం ఒకసారే — రోజూ రాయనవసరం లేదు."},
fourTabs:{roman:"Four tabs, and that is the whole app.",deva:"चार टैब — इतना ही पूरा ऐप।",telugu:"నాలుగు టాబ్‌లు — అదే మొత్తం యాప్."},
straightTo:{roman:"Straight to a screen",deva:"सीधे किसी पटल पर",telugu:"నేరుగా ఒక తెరకు"},
opensApp:{roman:"Opens the app",deva:"ऐप खोलता है",telugu:"యాప్ తెరుస్తుంది"},
/* ---- signing in, and the two lines the saṅkalpa cannot compute ---- */
siEyebrow:{roman:"Where an account earns itself",deva:"जहाँ खाता अपना स्थान अर्जित करता है",telugu:"ఖాతా తన స్థానాన్ని సంపాదించే చోటు"},
siHead:{roman:"Sign in",deva:"साइन इन",telugu:"సైన్ ఇన్"},
siLede:{roman:"Reading needs no account. This one keeps what has to outlive a browser — your place in a text, the rounds you have kept, and the two lines the saṅkalpa cannot compute for you.",deva:"पढ़ने के लिए खाते की आवश्यकता नहीं। यह खाता केवल वही रखता है जो इस विंडो से आगे टिकना चाहिए — पाठ में आपका स्थान, थामे गए जप, और वे दो वाक्य जिन्हें सङ्कल्प स्वयं गणना नहीं कर सकता।",telugu:"చదవడానికి ఖాతా అవసరం లేదు. ఈ ఖాతా ఈ విండో తర్వాత నిలవాల్సినవి మాత్రమే ఉంచుతుంది — పాఠంలో మీ స్థానం, మీరు చేసిన జపం, సంకల్పం స్వయంగా లెక్కించలేని ఆ రెండు వాక్యాలు."},
siStep1:{roman:"Account",deva:"खाता",telugu:"ఖాతా"},
siStep2:{roman:"Saṅkalpa",deva:"सङ्कल्प",telugu:"సంకల్పం"},
siStep3:{roman:"Begin",deva:"आरम्भ",telugu:"ఆరంభం"},
siS1H:{roman:"One address, one code",deva:"एक पता, एक कोड",telugu:"ఒక చిరునామా, ఒక కోడ్"},
siS1P:{roman:"No password to remember. A six-digit code arrives once and then expires.",deva:"कोई पासवर्ड याद रखने की आवश्यकता नहीं। छह अङ्कों का कोड एक बार आता है और समाप्त हो जाता है।",telugu:"గుర్తుంచుకోవాల్సిన పాస్‌వర్డ్ లేదు. ఆరు అంకెల కోడ్ ఒకసారి వస్తుంది, తర్వాత రద్దవుతుంది."},
siWho:{roman:"Phone or email",deva:"फ़ोन या ईमेल",telugu:"ఫోన్ లేదా ఈమెయిల్"},
siSend:{roman:"Send a one-time code",deva:"एक-बार का कोड भेजें",telugu:"వన్-టైమ్ కోడ్ పంపండి"},
siWhoBad:{roman:"That reads as neither a phone number nor an email address.",deva:"यह न फ़ोन नम्बर जैसा है, न ईमेल पता।",telugu:"ఇది ఫోన్ నంబర్‌గా లేదా ఈమెయిల్‌గా చదవబడదు."},
siNoAcct:{roman:"Read without an account",deva:"बिना खाते के पढ़ें",telugu:"ఖాతా లేకుండా చదవండి"},
siS2H:{roman:"The six digits",deva:"छह अङ्क",telugu:"ఆరు అంకెలు"},
siSentTo:{roman:"Sent to",deva:"भेजा गया —",telugu:"పంపాం —"},
siVerify:{roman:"Verify",deva:"सत्यापित करें",telugu:"నిర్ధారించండి"},
siResend:{roman:"Send it again",deva:"पुनः भेजें",telugu:"మళ్ళీ పంపండి"},
siResent:{roman:"Sent again",deva:"पुनः भेजा",telugu:"మళ్ళీ పంపాము"},
siOther:{roman:"Use another address",deva:"दूसरा पता दें",telugu:"వేరే చిరునామా"},
siDemo:{roman:"A design prototype — any six digits will do.",deva:"यह एक डिज़ाइन प्रारूप है — कोई भी छह अङ्क चलेंगे।",telugu:"ఇది డిజైన్ ప్రాతిరూపం — ఏ ఆరు అంకెలైనా సరిపోతాయి."},
siS3H:{roman:"Two lines the saṅkalpa cannot compute",deva:"दो वाक्य जिन्हें सङ्कल्प गणना नहीं कर सकता",telugu:"సంకల్పం లెక్కించలేని రెండు వాక్యాలు"},
siS3P:{roman:"The saṃvatsara, the māsa, the tithi and the deśa are already set for today. Only these two are yours to say.",deva:"संवत्सर, मास, तिथि और देश आज के लिए सिद्ध हैं। कहने को केवल ये दो शेष हैं।",telugu:"సంవత్సరం, మాసం, తిథి, దేశం ఈరోజుకి సిద్ధం. చెప్పాల్సినవి ఈ రెండే."},
siNamaL:{roman:"Your nāma",deva:"आपका नाम",telugu:"మీ పేరు"},
siNamaPh:{roman:"The name you are called by in the rite",deva:"जिस नाम से रीति में पुकारे जाते हैं",telugu:"పూజలో పిలవబడే పేరు"},
siGotraL:{roman:"Your gotra",deva:"आपका गोत्र",telugu:"మీ గోత్రం"},
siGotraPh:{roman:"Start typing — Bhāradvāja, Kāśyapa…",deva:"लिखना शुरू करें — भारद्वाज, काश्यप…",telugu:"టైప్ చేయండి — భారద్వాజ, కాశ్యప…"},
siDunno:{roman:"Don’t know it? Kāśyapa is the accepted answer.",deva:"ज्ञात नहीं? काश्यप स्वीकृत उत्तर है।",telugu:"తెలియదా? కాశ్యప అనేది ఆమోదిత సమాధానం."},
siRecitL:{roman:"The clause is declined for",deva:"वाक्य किसके लिए विभक्त हो",telugu:"వాక్యం ఎవరికి విభక్తి పొందాలి"},
siMale:{roman:"Male · gotrasya",deva:"पुरुष · गोत्रस्य",telugu:"పురుషుడు · గోత్రస్య"},
siFemale:{roman:"Female · gotrāyāḥ",deva:"स्त्री · गोत्रायाः",telugu:"స్త్రీ · గోత్రాయాః"},
siKeep:{roman:"Keep these",deva:"इन्हें रखें",telugu:"ఇవి ఉంచండి"},
siSkip:{roman:"Skip — add them later",deva:"छोड़ें — बाद में जोड़ें",telugu:"వదిలేయండి — తర్వాత జోడించండి"},
siPrivate:{roman:"Kept in this browser, and in the app you install. The gotra and nāma are never sent anywhere.",deva:"इस ब्राउज़र में, और आपके ऐप में रहता है। गोत्र और नाम कहीं नहीं भेजे जाते।",telugu:"ఈ బ్రౌజర్‌లో, మీరు ఇన్‌స్టాల్ చేసే యాప్‌లో ఉంటుంది. గోత్రం, పేరు ఎక్కడికీ పంపబడవు."},
siKnownCap:{roman:"What today already knows",deva:"आज जो पहले से ज्ञात है",telugu:"ఈరోజు గురించి ఇప్పటికే తెలిసినవి"},
siNoteFoot:{roman:"<b>Nothing is required to read.</b> Every text, the calendar and the pañcāṅga stay open without an account.",deva:"<b>पढ़ने के लिए कुछ आवश्यक नहीं।</b> सभी पाठ, पञ्चाङ्ग और कैलेण्डर बिना खाते खुले रहते हैं।",telugu:"<b>చదవడానికి ఏదీ అవసరం లేదు.</b> అన్ని పాఠాలు, పంచాంగం, క్యాలెండర్ ఖాతా లేకుండానే తెరుచుకుంటాయి."},
siPakshaL:{roman:"Pakṣa",deva:"पक्ष",telugu:"పక్షం"},
siTithiL:{roman:"Tithi",deva:"तिथि",telugu:"తిథి"},
siDesaL:{roman:"Deśa",deva:"देश",telugu:"దేశం"},
siBlankRow:{roman:"Gotra · nāma",deva:"गोत्र · नाम",telugu:"గోత్రం · పేరు"},
siYourLine:{roman:"Your line",deva:"आपका वाक्य",telugu:"మీ వాక్యం"},
siSignedIn:{roman:"Signed in",deva:"साइन इन",telugu:"సైన్ ఇన్ అయ్యారు"},
siSignOut:{roman:"Sign out",deva:"साइन आउट",telugu:"సైన్ అవుట్"},
siDoneH:{roman:"The clause reads your name now",deva:"अब वाक्य आपका नाम पढ़ता है",telugu:"ఇప్పుడు వాక్యం మీ పేరు చదువుతుంది"},
siDoneP:{roman:"This is today’s saṅkalpa — at your place, under your reckoning.",deva:"यह आज का सङ्कल्प है — आपके देश में, आपकी गणना से।",telugu:"ఇది ఈరోజు సంకల్పం — మీ దేశంలో, మీ గణన ప్రకారం."},
siSkipH:{roman:"Kept, without the flyleaf",deva:"खाता रखा — फलक के बिना",telugu:"ఖాతా ఉంచాం — ఫలకం లేకుండా"},
siSkipP:{roman:"The saṅkalpa still reads, with ____ where the nāma goes. Both fields wait in Settings, and in the app.",deva:"सङ्कल्प तब भी पढ़ा जाता है — नाम के स्थान पर ____ के साथ। दोनों प्रविष्टियाँ सेटिंग्स में और ऐप में प्रतीक्षा करती हैं।",telugu:"సంకల్పం అప్పుడూ చదవబడుతుంది — పేరు స్థానంలో ____ తో. ఆ రెండు గడులు సెట్టింగ్స్‌లో, యాప్‌లో వేచి ఉంటాయి."},
siAddNow:{roman:"Add them now",deva:"अभी जोड़ें",telugu:"ఇప్పుడే జోడించండి"},
siEdit:{roman:"Change them",deva:"बदलें",telugu:"మార్చండి"},
siOpenLib:{roman:"Open the library",deva:"पुस्तकालय खोलें",telugu:"గ్రంథాలయం తెరవండి"}
};
function lang(){return document.documentElement.getAttribute("data-lang")||"roman";}
/* the reading script governs the corpus's own vocabulary — deity epithets and
   the pañcāṅga's technical terms — even when the interface language has been
   set apart from it. Everything else in S{} is chrome, and follows uiLang(). */
var CONTENT_KEYS={epGanesha:1,epShiva:1,epDevi:1,epVishnu:1,epSubrahmanya:1,epSurya:1,epGuru:1,epHanuman:1,epItara:1,
shelfFor:1,belongsTo:1,sandhyaCap:1,
limbSamvatsara:1,limbAyana:1,limbRitu:1,limbMasa:1,limbVara:1,limbNaksatra:1,limbYoga:1,limbKarana:1,limbRahu:1,limbDurmuhurta:1,
northward:1,southward:1,rkDrik:1,rkVakya:1,ayLahiri:1,ayRaman:1,ayKp:1,msAmanta:1,msPurnimanta:1,ayanamsaWord:1,nirayanaBy:1,
pakshaSukla:1,pakshaKrsna:1};
/* the language buttons and page copy render in — independent of the reading
   script unless the reader has never said otherwise, in which case it just
   mirrors it (see site-chrome.js / site-settings.js) */
function uiLang(){return document.documentElement.getAttribute("data-ui-lang")||lang();}
function langFor(k){return CONTENT_KEYS[k]?lang():uiLang();}
/* the app's own choice: let the platform name the day and the month, in the
   locale that matches the reading script (stuti-home.jsx does exactly this) */
function locale(){var l=lang();return l==="telugu"?"te-IN":l==="deva"?"hi-IN":undefined;}
function dateLong(d){try{return d.toLocaleDateString(locale(),{weekday:"long",day:"numeric",month:"long",year:"numeric"});}catch(e){return d.toDateString();}}
function monthYear(d){try{return d.toLocaleDateString(locale(),{month:"long",year:"numeric"});}catch(e){return d.toDateString();}}
function weekday(n){try{return new Date(2024,0,7+((n%7)+7)%7).toLocaleDateString(locale(),{weekday:"long"});}catch(e){return "";}}
function t(k){var d=S[k];if(!d)return "";var l=langFor(k);return d[l]||d.roman;}
function font(){var l=lang();return l==="telugu"?"var(--font-telugu)":l==="deva"?"var(--font-deva)":"";}
function fontFor(k){var l=langFor(k);return l==="telugu"?"var(--font-telugu)":l==="deva"?"var(--font-deva)":"";}
/* one walk over the document: text, markup, placeholders and labels, each in
   the face its own language calls for — content keys keep the reading
   script's face even when the interface language differs from it */
function apply(root){
  var r=root||document;
  r.querySelectorAll("[data-t]").forEach(function(el){var k=el.getAttribute("data-t"),v=t(k);if(v){el.textContent=v;el.style.fontFamily=fontFor(k);}});
  r.querySelectorAll("[data-th]").forEach(function(el){var k=el.getAttribute("data-th"),v=t(k);if(v){el.innerHTML=v;el.style.fontFamily=fontFor(k);}});
  r.querySelectorAll("[data-tp]").forEach(function(el){var k=el.getAttribute("data-tp"),v=t(k);if(v){el.setAttribute("placeholder",v);el.style.fontFamily=fontFor(k);}});
  r.querySelectorAll("[data-ta]").forEach(function(el){var v=t(el.getAttribute("data-ta"));if(v)el.setAttribute("aria-label",v);});
  r.querySelectorAll("[data-tt]").forEach(function(el){var v=t(el.getAttribute("data-tt"));if(v)el.setAttribute("title",v);});
}
/* the deity's epithet in the chosen script, from the app's own table */
function epithet(id,fallback){
  try{var L=window.STUTI_L;if(L&&L.deity){var e=L.deity(id,"epithet",lang());if(e)return e;}}catch(e){}
  try{var D=window.STUTI_L&&window.STUTI_L.D;if(D&&D[id]&&D[id].epithet)return D[id].epithet[lang()]||fallback;}catch(e){}
  return fallback;
}
return {t:t,apply:apply,font:font,lang:lang,uiLang:uiLang,epithet:epithet,strings:S,locale:locale,dateLong:dateLong,monthYear:monthYear,weekday:weekday};
})();
window.SITE_T=function(k){return window.SITE_I18N.t(k);};
window.SITE_TR=function(root){window.SITE_I18N.apply(root);};
window.SITE_DATE=function(d){return window.SITE_I18N.dateLong(d);};
window.SITE_MONTHYEAR=function(d){return window.SITE_I18N.monthYear(d);};
window.SITE_WEEKDAY=function(n){return window.SITE_I18N.weekday(n);};
window.SITE_UILANG=function(){return window.SITE_I18N.uiLang();};

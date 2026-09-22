/* ============================================================
   STUTI — the calendar backlog
   Parvas and jayantīs from the Master Vrata and Parva Reference
   (September 2026, §4) that the app did not yet carry. Each is a mark
   on the calendar with its name and its tithi rule, nothing more: the
   procedure is not written, and the detail page says so. Every record
   is graded Q and published as `backlog`, so the inventory can be
   audited from one place and each entry promoted as its source work
   is done. Rules are labels built per language from the month and
   tithi tables the house already uses.
   ============================================================ */
window.STUTI_BACKLOG_EXTRA = (function () {
  const P = () => window.AKSHARA_PANCHANGA;
  let lunar = null, monthStart = null;
  const L = (m, ti, rule) => (y) => (lunar ? lunar(y, m, ti, rule) : null);
  const MN = {
    roman: ["Caitra", "Vaiśākha", "Jyeṣṭha", "Āṣāḍha", "Śrāvaṇa", "Bhādrapada", "Āśvayuja", "Kārtika", "Mārgaśīrṣa", "Pauṣa", "Māgha", "Phālguna"],
    deva: ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"],
    tel: ["చైత్ర", "వైశాఖ", "జ్యేష్ఠ", "ఆషాఢ", "శ్రావణ", "భాద్రపద", "ఆశ్వయుజ", "కార్తిక", "మార్గశిర", "పుష్య", "మాఘ", "ఫాల్గుణ"],
  };
  const TN = {
    roman: ["Pratipadā", "Dvitīyā", "Tṛtīyā", "Caturthī", "Pañcamī", "Ṣaṣṭhī", "Saptamī", "Aṣṭamī", "Navamī", "Daśamī", "Ekādaśī", "Dvādaśī", "Trayodaśī", "Caturdaśī"],
    deva: ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी"],
    tel: ["పాడ్యమి", "విదియ", "తదియ", "చవితి", "పంచమి", "షష్ఠి", "సప్తమి", "అష్టమి", "నవమి", "దశమి", "ఏకాదశి", "ద్వాదశి", "త్రయోదశి", "చతుర్దశి"],
  };
  const PK = { roman: ["Śukla", "Kṛṣṇa"], deva: ["शुक्ल", "कृष्ण"], tel: ["శుద్ధ", "బహుళ"] };
  const FULL = { roman: "Pūrṇimā", deva: "पूर्णिमा", tel: "పౌర్ణమి" }, NEW = { roman: "Amāvāsyā", deva: "अमावस्या", tel: "అమావాస్య" };
  const tithiLabel = (lang, ti) => (ti === 14 ? FULL[lang] : ti === 29 ? NEW[lang] : PK[lang][ti < 15 ? 0 : 1] + " " + TN[lang][ti % 15]);
  const ruleOf = (m, ti) => ({
    roman: MN.roman[m] + " · " + tithiLabel("roman", ti),
    deva: MN.deva[m] + " " + tithiLabel("deva", ti),
    tel: MN.tel[m] + " " + tithiLabel("tel", ti),
  });

  /* id, month, tithi (0–29), deity, type, roman, deva, tel, [extra] */
  const R = (id, m, ti, deity, type, roman, deva, tel, extra) => Object.assign({
    id, deity, type, brief: true, backlog: true, masa: m, kind: type === "vratam" ? "vratam" : undefined,
    name: { roman, deva, tel }, rule: ruleOf(m, ti), find: L(m, ti),
  }, extra || {});
  const C = 0, VA = 1, JY = 2, AS = 3, SR = 4, BH = 5, AV = 6, KA = 7, MA = 8, PU = 9, MG = 10, PH = 11;

  const entries = [
    /* Caitra */
    R("saubhagya-gauri", C, 2, "devi", "vratam", "Saubhāgya Gaurī Vratam", "सौभाग्य गौरी व्रतम्", "సౌభాగ్య గౌరీ వ్రతం"),
    R("matsya-jayanti", C, 2, "vishnu", "jayanti", "Matsya Jayantī", "मत्स्य जयन्ती", "మత్స్య జయంతి"),
    R("kamada-ekadashi", C, 10, "vishnu", "vratam", "Kāmadā Ekādaśī", "कामदा एकादशी", "కామదా ఏకాదశి"),
    R("caitra-purnima", C, 14, "vishnu", "parva", "Caitra Pūrṇimā", "चैत्र पूर्णिमा", "చైత్ర పౌర్ణమి"),
    /* Vaiśākha */
    R("akshaya-tritiya", VA, 2, "vishnu", "parva", "Akṣaya Tṛtīyā", "अक्षय तृतीया", "అక్షయ తృతీయ"),
    R("ganga-saptami", VA, 6, "devi", "parva", "Gaṅgā Saptamī", "गङ्गा सप्तमी", "గంగా సప్తమి"),
    R("vasavi-jayanti", VA, 9, "devi", "jayanti", "Vāsavī Kanyakā Parameśvarī Jayantī", "वासवी कन्यका परमेश्वरी जयन्ती", "వాసవీ కన్యకా పరమేశ్వరీ జయంతి"),
    R("mohini-ekadashi", VA, 10, "vishnu", "vratam", "Mohinī Ekādaśī", "मोहिनी एकादशी", "మోహినీ ఏకాదశి"),
    R("kurma-jayanti", VA, 14, "vishnu", "jayanti", "Kūrma Jayantī", "कूर्म जयन्ती", "కూర్మ జయంతి"),
    R("buddha-purnima", VA, 14, "vishnu", "jayanti", "Buddha Pūrṇimā", "बुद्ध पूर्णिमा", "బుద్ధ పౌర్ణమి"),
    R("annamacharya-jayanti", VA, 14, "guru", "jayanti", "Annamācārya Jayantī", "अन्नमाचार्य जयन्ती", "అన్నమాచార్య జయంతి"),
    R("narada-jayanti", VA, 15, "guru", "jayanti", "Nārada Jayantī", "नारद जयन्ती", "నారద జయంతి"),
    /* Jyeṣṭha */
    R("snana-yatra", JY, 14, "vishnu", "parva", "Jagannātha Snāna Yātrā", "जगन्नाथ स्नान यात्रा", "జగన్నాథ స్నాన యాత్ర"),
    /* Āṣāḍha */
    R("devashayani-ekadashi", AS, 10, "vishnu", "vratam", "Devaśayanī Ekādaśī", "देवशयनी एकादशी", "దేవశయనీ ఏకాదశి"),
    /* Śrāvaṇa */
    R("garuda-panchami", SR, 4, "vishnu", "parva", "Garuḍa Pañcamī", "गरुड पञ्चमी", "గరుడ పంచమి"),
    R("kalki-jayanti", SR, 5, "vishnu", "jayanti", "Kalki Jayantī", "कल्कि जयन्ती", "కల్కి జయంతి"),
    R("shravana-putrada-ekadashi", SR, 10, "vishnu", "vratam", "Śrāvaṇa Putradā Ekādaśī", "श्रावण पुत्रदा एकादशी", "శ్రావణ పుత్రదా ఏకాదశి"),
    R("gayatri-jayanti", SR, 10, "devi", "jayanti", "Gāyatrī Jayantī", "गायत्री जयन्ती", "గాయత్రీ జయంతి"),
    R("raghavendra-aradhana", SR, 16, "guru", "parva", "Rāghavendra Svāmi Ārādhana", "राघवेन्द्र स्वामी आराधना", "రాఘవేంద్ర స్వామి ఆరాధన"),
    /* Bhādrapada */
    R("hartalika", BH, 2, "devi", "vratam", "Haritālikā Tīj", "हरितालिका तीज", "హరితాలికా వ్రతం"),
    R("swarna-gauri", BH, 2, "devi", "vratam", "Svarṇa Gaurī Vratam", "स्वर्ण गौरी व्रतम्", "స్వర్ణ గౌరీ వ్రతం"),
    R("rishi-panchami", BH, 4, "guru", "vratam", "Ṛṣi Pañcamī", "ऋषि पञ्चमी", "ఋషి పంచమి"),
    R("parivartini-ekadashi", BH, 10, "vishnu", "vratam", "Parivartinī Ekādaśī", "परिवर्तिनी एकादशी", "పరివర్తినీ ఏకాదశి"),
    R("aja-ekadashi", BH, 25, "vishnu", "vratam", "Ajā Ekādaśī", "अजा एकादशी", "అజా ఏకాదశి"),
    /* Āśvayuja */
    R("bathukamma", BH, 29, "devi", "regional", "Bathukamma", "बतुकम्मा", "బతుకమ్మ", { days: 9,
      rule: { roman: "Nine days from Mahālaya Amāvāsyā to Durgāṣṭamī — Telangana", deva: "महालय अमावस्या से दुर्गाष्टमी तक नौ दिन — तेलंगाणा", tel: "మహాలయ అమావాస్య నుంచి దుర్గాష్టమి దాకా తొమ్మిది రోజులు — తెలంగాణ" } }),
    R("lalita-panchami", AV, 4, "devi", "puja", "Lalitā Pañcamī", "ललिता पञ्चमी", "లలితా పంచమి"),
    R("sarasvati-avahana", AV, 6, "devi", "puja", "Sarasvatī Āvāhana", "सरस्वती आवाहन", "సరస్వతీ ఆవాహన"),
    R("durgashtami", AV, 7, "devi", "parva", "Durgāṣṭamī", "दुर्गाष्टमी", "దుర్గాష్టమి"),
    R("mahanavami", AV, 8, "devi", "parva", "Mahānavamī · Āyudha Pūjā", "महानवमी · आयुध पूजा", "మహానవమి · ఆయుధ పూజ"),
    R("sharad-purnima", AV, 14, "devi", "vratam", "Śarad Pūrṇimā · Kojāgarī", "शरद पूर्णिमा · कोजागरी", "శరద్ పౌర్ణమి · కోజాగరీ"),
    R("valmiki-jayanti", AV, 14, "guru", "jayanti", "Vālmīki Jayantī", "वाल्मीकि जयन्ती", "వాల్మీకి జయంతి"),
    R("govatsa-dvadashi", AV, 26, "vishnu", "parva", "Govatsa Dvādaśī", "गोवत्स द्वादशी", "గోవత్స ద్వాదశి"),
    R("dhana-trayodashi", AV, 27, "devi", "parva", "Dhana Trayodaśī · Dhanvantari Jayantī", "धन त्रयोदशी · धन्वन्तरि जयन्ती", "ధన త్రయోదశి · ధన్వంతరి జయంతి"),
    /* Kārtika */
    R("bali-padyami", KA, 0, "vishnu", "parva", "Bali Pāḍyami · Govardhana Pūjā", "बलि प्रतिपदा · गोवर्धन पूजा", "బలి పాడ్యమి · గోవర్ధన పూజ"),
    R("yama-dvitiya", KA, 1, "vishnu", "parva", "Yama Dvitīyā · Bhaginī Hastā Bhojanam", "यम द्वितीया · भगिनी हस्ता भोजनम्", "యమ ద్వితీయ · భగినీ హస్త భోజనం"),
    R("nagula-cavithi", KA, 3, "subrahmanya", "vratam", "Nāgula Cavithi", "नागुल चविति", "నాగుల చవితి"),
    R("utthana-ekadashi", KA, 10, "vishnu", "vratam", "Utthāna Ekādaśī", "उत्थान एकादशी", "ఉత్థాన ఏకాదశి"),
    R("vaikuntha-caturdashi", KA, 13, "vishnu", "parva", "Vaikuṇṭha Caturdaśī", "वैकुण्ठ चतुर्दशी", "వైకుంఠ చతుర్దశి"),
    R("kalabhairava-jayanti", KA, 22, "shiva", "jayanti", "Kālabhairava Jayantī", "कालभैरव जयन्ती", "కాలభైరవ జయంతి"),
    /* Mārgaśīrṣa */
    Object.assign(R("margashira-lakshmi", MA, 0, "devi", "vratam", "Mārgaśira Lakṣmī Vāram", "मार्गशीर्ष लक्ष्मी गुरुवार", "మార్గశిర లక్ష్మీవారం", {
      rule: { roman: "Every Thursday of Mārgaśīrṣa", deva: "मार्गशीर्ष के प्रत्येक गुरुवार", tel: "మార్గశిర మాసంలోని ప్రతి గురువారం" } }), {
      weekly: 4,
      window: (y) => { const s = monthStart(y, MA); if (!s) return null; const e = new Date(s); e.setDate(e.getDate() + 29); return [s, e]; },
      find: (y) => { const d = monthStart(y, MA); if (!d) return null; while (d.getDay() !== 4) d.setDate(d.getDate() + 1); return d; },
    }),
    R("mitra-saptami", MA, 6, "surya", "parva", "Mitra Saptamī", "मित्र सप्तमी", "మిత్ర సప్తమి"),
    R("annapurna-jayanti", MA, 14, "devi", "jayanti", "Annapūrṇā Jayantī · Mārgaśīrṣa Pūrṇimā", "अन्नपूर्णा जयन्ती · मार्गशीर्ष पूर्णिमा", "అన్నపూర్ణా జయంతి · మార్గశిర పౌర్ణమి"),
    /* Pauṣa */
    R("bhogi", PU, 0, "surya", "parva", "Bhogi", "भोगि", "భోగి", {
      rule: { roman: "The day before Makara Saṅkrānti", deva: "मकर सङ्क्रान्ति से एक दिन पूर्व", tel: "మకర సంక్రాంతికి ముందు రోజు" },
      find: (y) => { try { const d = P().sankrantiDay(y, 9); if (!d) return null; const b = new Date(d); b.setDate(b.getDate() - 1); return b; } catch (e) { return null; } } }),
    R("kanuma", PU, 0, "surya", "parva", "Kanuma · Mukkanuma", "कनुमा · मुक्कनुमा", "కనుమ · ముక్కనుమ", { days: 2,
      rule: { roman: "The two days after Makara Saṅkrānti", deva: "मकर सङ्क्रान्ति के बाद के दो दिन", tel: "మకర సంక్రాంతి తరువాతి రెండు రోజులు" },
      find: (y) => { try { const d = P().sankrantiDay(y, 9); if (!d) return null; const b = new Date(d); b.setDate(b.getDate() + 1); return b; } catch (e) { return null; } } }),
    R("shakambhari-purnima", PU, 14, "devi", "parva", "Śākambharī Pūrṇimā", "शाकम्भरी पूर्णिमा", "శాకంభరీ పౌర్ణమి"),
    R("sakata-caturthi", PU, 18, "ganesha", "vratam", "Sakaṭa Caturthī", "सकट चौथ", "సకట చతుర్థి"),
    /* Māgha */
    R("magha-snana", MG, 0, "vishnu", "seasonal", "Māgha Snāna", "माघ स्नान", "మాఘ స్నానం", { days: 30, quiet: true,
      rule: { roman: "Every dawn of Māgha", deva: "माघ के प्रत्येक प्रातः", tel: "మాఘమాసంలో ప్రతి వేకువ" },
      find: (y) => (monthStart ? monthStart(y, MG) : null) }),
    R("bhishmashtami", MG, 7, "vishnu", "parva", "Bhīṣmāṣṭamī", "भीष्माष्टमी", "భీష్మాష్టమి"),
    R("madhva-navami", MG, 8, "guru", "jayanti", "Madhva Navamī", "मध्व नवमी", "మధ్వ నవమి"),
    R("varaha-dvadashi", MG, 11, "vishnu", "jayanti", "Varāha Dvādaśī", "वराह द्वादशी", "వరాహ ద్వాదశి"),
    R("vijaya-ekadashi", MG, 25, "vishnu", "vratam", "Vijayā Ekādaśī", "विजया एकादशी", "విజయా ఏకాదశి"),
    /* Phālguna */
    R("amalaki-ekadashi", PH, 10, "vishnu", "vratam", "Āmalakī Ekādaśī", "आमलकी एकादशी", "ఆమలకీ ఏకాదశి"),
    R("lakshmi-jayanti", PH, 14, "devi", "jayanti", "Lakṣmī Jayantī", "लक्ष्मी जयन्ती", "లక్ష్మీ జయంతి"),
    R("caitanya-jayanti", PH, 14, "vishnu", "jayanti", "Caitanya Mahāprabhu Jayantī", "चैतन्य महाप्रभु जयन्ती", "చైతన్య మహాప్రభు జయంతి"),
  ];

  /* every backlog record is published as such: grade Q, status backlog */
  entries.forEach((e) => { e.prov = { type: e.type, grade: "Q", status: "backlog", tags: [], region: null }; });

  return { entries, bind: (fns) => { lunar = fns.lunar; monthStart = fns.monthStart; } };
})();

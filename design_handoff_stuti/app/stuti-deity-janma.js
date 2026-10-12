/* ============================================================
   STUTI — the janma dinams of the deities
   For each shelf, the birth and appearance days its tradition keeps:
   the month and tithi, and the nakṣatra where the tradition names one.
   Read on the shelf, beside the texts; where the day is
   already a parva in the calendar the row points at it, and where it is
   not, the tithi joins the calendar as a quiet mark that can take a bell.
   Rules from the house catalogue of jayanti and āvirbhāva days.
   ============================================================ */
window.STUTI_DEITY_JANMA = (function () {
  const M = { caitra: 0, vaisakha: 1, jyeshtha: 2, ashadha: 3, shravana: 4, bhadrapada: 5, ashvina: 6, kartika: 7, margashirsha: 8, pausha: 9, magha: 10, phalguna: 11 };
  /* tithi index across the lunar month: śukla n → n-1, pūrṇimā 14, kṛṣṇa n → 14+n */
  const rows = [
    /* ---- Gaṇeśa ---- */
    { id: "ganesha-jayanti", deity: "ganesha", form: "ganesha", masa: M.magha, ti: 3,
      name:  { roman: "Gaṇeśa Jayantī", deva: "गणेश जयन्ती", tel: "గణేశ జయంతి" },
      tithi: { roman: "Māgha · Śukla Caturthī", deva: "माघ शुक्ल चतुर्थी", tel: "మాఘ శుక్ల చవితి" },
      meta:  { roman: "Śiva and Pārvatī", deva: "शिव और पार्वती", tel: "శివుడు, పార్వతి" } },
    { id: "vinayaka-chaviti", deity: "ganesha", form: "ganesha", vrata: "ganesha-chaturthi",
      name:  { roman: "Vināyaka Caturthī", deva: "विनायक चतुर्थी", tel: "వినాయక చవితి" },
      tithi: { roman: "Bhādrapada · Śukla Caturthī", deva: "भाद्रपद शुक्ल चतुर्थी", tel: "భాద్రపద శుక్ల చవితి" },
      meta:  { roman: "Śiva and Pārvatī", deva: "शिव और पार्वती", tel: "శివుడు, పార్వతి" } },

    /* ---- Śiva ---- */
    { id: "kalabhairava-jayanti", deity: "shiva", form: "kalabhairava", masa: M.kartika, ti: 22,
      name:  { roman: "Kālabhairava Jayantī", deva: "कालभैरव जयन्ती", tel: "కాలభైరవ జయంతి" },
      tithi: { roman: "Kārtika · Kṛṣṇa Aṣṭamī", deva: "कार्तिक कृष्ण अष्टमी", tel: "కార్తిక బహుళ అష్టమి" } },
    { id: "lingodbhava", deity: "shiva", form: "shiva", vrata: "shivaratri",
      name:  { roman: "Mahāśivarātri · Liṅgodbhava", deva: "महाशिवरात्रि · लिङ्गोद्भव", tel: "మహాశివరాత్రి · లింగోద్భవం" },
      tithi: { roman: "Māgha · Kṛṣṇa Caturdaśī", deva: "माघ कृष्ण चतुर्दशी", tel: "మాఘ బహుళ చతుర్దశి" },
      origin:  { roman: "Unborn", deva: "अजन्मा", tel: "అజుడు" } },

    /* ---- Devī ---- */
    { id: "annapurna-jayanti", deity: "devi", form: "annapurna", masa: M.margashirsha, ti: 14,
      name:  { roman: "Annapūrṇā Jayantī", deva: "अन्नपूर्णा जयन्ती", tel: "అన్నపూర్ణా జయంతి" },
      tithi: { roman: "Mārgaśīrṣa · Pūrṇimā", deva: "मार्गशीर्ष पूर्णिमा", tel: "మార్గశిర పౌర్ణమి" },
      meta:  { roman: "Himavān and Menā", deva: "हिमवान् और मेना", tel: "హిమవంతుడు, మేన" } },
    { id: "sarasvati-jayanti", deity: "devi", form: "sarasvati", vrata: "vasanta-panchami",
      name:  { roman: "Sarasvatī Jayantī", deva: "सरस्वती जयन्ती", tel: "సరస్వతీ జయంతి" },
      tithi: { roman: "Māgha · Śukla Pañcamī", deva: "माघ शुक्ल पञ्चमी", tel: "మాఘ శుక్ల పంచమి" } },
    { id: "lalita-janma", deity: "devi", form: "lalita", vrata: "lalita-jayanti",
      name:  { roman: "Lalitā Jayantī", deva: "ललिता जयन्ती", tel: "లలితా జయంతి" },
      tithi: { roman: "Māgha · Pūrṇimā", deva: "माघ पूर्णिमा", tel: "మాఘ పౌర్ణమి" } },
    { id: "lakshmi-jayanti", deity: "devi", form: "lakshmi", masa: M.phalguna, ti: 14,
      name:  { roman: "Lakṣmī Jayantī", deva: "लक्ष्मी जयन्ती", tel: "లక్ష్మీ జయంతి" },
      tithi: { roman: "Phālguna · Pūrṇimā", deva: "फाल्गुन पूर्णिमा", tel: "ఫాల్గుణ పౌర్ణమి" },
      meta:  { roman: "Bhṛgu and Khyāti", deva: "भृगु और ख्याति", tel: "భృగువు, ఖ్యాతి" },
      origin:  { roman: "Risen from the Ocean of Milk in another account · consort of Viṣṇu", deva: "अन्य कथा में क्षीरसागर से प्रकट · विष्णु की पत्नी", tel: "మరొక కథలో క్షీరసాగరం నుండి ఆవిర్భావం · విష్ణువు పత్ని" } },

    /* ---- Viṣṇu and the avatāras ---- */
    { id: "matsya-jayanti", deity: "vishnu", form: "narayana", masa: M.caitra, ti: 2,
      name:  { roman: "Matsya Jayantī", deva: "मत्स्य जयन्ती", tel: "మత్స్య జయంతి" },
      tithi: { roman: "Caitra · Śukla Tṛtīyā", deva: "चैत्र शुक्ल तृतीया", tel: "చైత్ర శుక్ల తదియ" },
      origin:  { roman: "Viṣṇu's avatāra", deva: "विष्णु का अवतार", tel: "విష్ణువు అవతారం" } },
    { id: "rama-janma", deity: "vishnu", form: "rama", vrata: "rama-navami",
      name:  { roman: "Śrī Rāma Navamī", deva: "श्री राम नवमी", tel: "శ్రీ రామ నవమి" },
      tithi: { roman: "Caitra · Śukla Navamī", deva: "चैत्र शुक्ल नवमी", tel: "చైత్ర శుక్ల నవమి" },
      meta:  { roman: "Daśaratha and Kausalyā · Ikṣvāku line", deva: "दशरथ और कौसल्या · इक्ष्वाकु वंश", tel: "దశరథుడు, కౌసల్య · ఇక్ష్వాకు వంశం" },
      naks:  { roman: "Punarvasu nakṣatra", deva: "पुनर्वसु नक्षत्र", tel: "పునర్వసు నక్షత్రం" } },
    { id: "parashurama-janma", deity: "vishnu", form: "narayana", vrata: "parashurama-jayanti",
      name:  { roman: "Paraśurāma Jayantī", deva: "परशुराम जयन्ती", tel: "పరశురామ జయంతి" },
      tithi: { roman: "Vaiśākha · Śukla Tṛtīyā", deva: "वैशाख शुक्ल तृतीया", tel: "వైశాఖ శుక్ల తదియ" },
      meta:  { roman: "Jamadagni and Reṇukā · Bhārgava line", deva: "जमदग्नि और रेणुका · भार्गव वंश", tel: "జమదగ్ని, రేణుక · భార్గవ వంశం" } },
    { id: "sita-janma", deity: "vishnu", form: "rama", vrata: "sita-navami",
      name:  { roman: "Sītā Navamī · Jānakī Jayantī", deva: "सीता नवमी · जानकी जयन्ती", tel: "సీతా నవమి · జానకీ జయంతి" },
      tithi: { roman: "Vaiśākha · Śukla Navamī", deva: "वैशाख शुक्ल नवमी", tel: "వైశాఖ శుక్ల నవమి" },
      meta:  { roman: "Janaka and Sunayanā", deva: "जनक और सुनयना", tel: "జనకుడు, సునయన" },
      origin:  { roman: "Born of the Earth", deva: "पृथ्वी से जन्म", tel: "భూమి నుండి జన్మ" } },
    { id: "rukmini-dvadashi", deity: "vishnu", form: "krishna", masa: M.vaisakha, ti: 11,
      name:  { roman: "Rukmiṇī Dvādaśī", deva: "रुक्मिणी द्वादशी", tel: "రుక్మిణీ ద్వాదశి" },
      tithi: { roman: "Vaiśākha · Śukla Dvādaśī", deva: "वैशाख शुक्ल द्वादशी", tel: "వైశాఖ శుక్ల ద్వాదశి" },
      meta:  { roman: "Bhīṣmaka of Vidarbha · Bhoja line", deva: "विदर्भ के भीष्मक · भोज वंश", tel: "విదర్భ భీష్మకుడు · భోజ వంశం" } },
    { id: "narasimha-janma", deity: "vishnu", form: "narasimha", vrata: "nrsimha-jayanti",
      name:  { roman: "Narasiṁha Jayantī", deva: "नरसिंह जयन्ती", tel: "నరసింహ జయంతి" },
      tithi: { roman: "Vaiśākha · Śukla Caturdaśī", deva: "वैशाख शुक्ल चतुर्दशी", tel: "వైశాఖ శుక్ల చతుర్దశి" },
      origin:  { roman: "Viṣṇu's avatāra", deva: "विष्णु का अवतार", tel: "విష్ణువు అవతారం" } },
    { id: "kurma-jayanti", deity: "vishnu", form: "narayana", masa: M.vaisakha, ti: 14,
      name:  { roman: "Kūrma Jayantī", deva: "कूर्म जयन्ती", tel: "కూర్మ జయంతి" },
      tithi: { roman: "Vaiśākha · Pūrṇimā", deva: "वैशाख पूर्णिमा", tel: "వైశాఖ పౌర్ణమి" },
      origin:  { roman: "Viṣṇu's avatāra", deva: "विष्णु का अवतार", tel: "విష్ణువు అవతారం" } },
    { id: "kalki-jayanti", deity: "vishnu", form: "narayana", masa: M.shravana, ti: 5,
      name:  { roman: "Kalki Jayantī", deva: "कल्कि जयन्ती", tel: "కల్కి జయంతి" },
      tithi: { roman: "Śrāvaṇa · Śukla Ṣaṣṭhī", deva: "श्रावण शुक्ल षष्ठी", tel: "శ్రావణ శుక్ల షష్ఠి" },
      meta:  { roman: "Viṣṇuyaśas and Sumati", deva: "विष्णुयशस् और सुमति", tel: "విష్ణుయశస్, సుమతి" },
      origin:  { roman: "A birth yet to come", deva: "आगामी जन्म", tel: "రాబోయే జన్మ" } },
    { id: "hayagriva-janma", deity: "vishnu", form: "narayana", vrata: "hayagriva-jayanti",
      name:  { roman: "Hayagrīva Jayantī", deva: "हयग्रीव जयन्ती", tel: "హయగ్రీవ జయంతి" },
      tithi: { roman: "Śrāvaṇa · Pūrṇimā", deva: "श्रावण पूर्णिमा", tel: "శ్రావణ పౌర్ణమి" },
      origin:  { roman: "Viṣṇu's avatāra", deva: "विष्णु का अवतार", tel: "విష్ణువు అవతారం" } },
    { id: "krishna-janma", deity: "vishnu", form: "krishna", vrata: "janmashtami",
      name:  { roman: "Śrī Kṛṣṇa Janmāṣṭamī", deva: "श्रीकृष्ण जन्माष्टमी", tel: "శ్రీకృష్ణ జన్మాష్టమి" },
      tithi: { roman: "Śrāvaṇa · Kṛṣṇa Aṣṭamī", deva: "श्रावण कृष्ण अष्टमी", tel: "శ్రావణ బహుళ అష్టమి" },
      meta:  { roman: "Vasudeva and Devakī · Yadu line", deva: "वसुदेव और देवकी · यदु वंश", tel: "వసుదేవుడు, దేవకి · యదు వంశం" },
      naks:  { roman: "Rohiṇī nakṣatra", deva: "रोहिणी नक्षत्र", tel: "రోహిణీ నక్షత్రం" } },
    { id: "varaha-jayanti", deity: "vishnu", form: "narayana", masa: M.bhadrapada, ti: 2,
      name:  { roman: "Varāha Jayantī", deva: "वराह जयन्ती", tel: "వరాహ జయంతి" },
      tithi: { roman: "Bhādrapada · Śukla Tṛtīyā", deva: "भाद्रपद शुक्ल तृतीया", tel: "భాద్రపద శుక్ల తదియ" },
      origin:  { roman: "Viṣṇu's avatāra", deva: "विष्णु का अवतार", tel: "విష్ణువు అవతారం" } },
    { id: "balarama-jayanti", deity: "vishnu", form: "krishna", masa: M.bhadrapada, ti: 5,
      name:  { roman: "Balarāma Jayantī", deva: "बलराम जयन्ती", tel: "బలరామ జయంతి" },
      tithi: { roman: "Bhādrapada · Śukla Ṣaṣṭhī", deva: "भाद्रपद शुक्ल षष्ठी", tel: "భాద్రపద శుక్ల షష్ఠి" },
      meta:  { roman: "Vasudeva and Rohiṇī · Yadu line", deva: "वसुदेव और रोहिणी · यदु वंश", tel: "వసుదేవుడు, రోహిణి · యదు వంశం" } },
    { id: "radha-janma", deity: "vishnu", form: "krishna", vrata: "radha-ashtami",
      name:  { roman: "Rādhāṣṭamī", deva: "राधाष्टमी", tel: "రాధాష్టమి" },
      tithi: { roman: "Bhādrapada · Śukla Aṣṭamī", deva: "भाद्रपद शुक्ल अष्टमी", tel: "భాద్రపద శుక్ల అష్టమి" },
      meta:  { roman: "Vṛṣabhānu and Kīrtidā", deva: "वृषभानु और कीर्तिदा", tel: "వృషభానుడు, కీర్తిద" } },
    { id: "vamana-janma", deity: "vishnu", form: "narayana", vrata: "vamana-jayanti",
      name:  { roman: "Vāmana Jayantī", deva: "वामन जयन्ती", tel: "వామన జయంతి" },
      tithi: { roman: "Bhādrapada · Śukla Dvādaśī", deva: "भाद्रपद शुक्ल द्वादशी", tel: "భాద్రపద శుక్ల ద్వాదశి" },
      meta:  { roman: "Kaśyapa and Aditi", deva: "कश्यप और अदिति", tel: "కశ్యపుడు, అదితి" },
      naks:  { roman: "Śravaṇa nakṣatra", deva: "श्रवण नक्षत्र", tel: "శ్రవణ నక్షత్రం" } },
    { id: "dhanvantari-jayanti", deity: "vishnu", form: "narayana", masa: M.ashvina, ti: 27,
      name:  { roman: "Dhanvantarī Jayantī", deva: "धन्वन्तरि जयन्ती", tel: "ధన్వంతరి జయంతి" },
      tithi: { roman: "Āśvayuja · Kṛṣṇa Trayodaśī", deva: "आश्विन कृष्ण त्रयोदशी", tel: "ఆశ్వయుజ బహుళ త్రయోదశి" },
      origin:  { roman: "Risen from the Ocean of Milk", deva: "क्षीरसागर से प्रकट", tel: "క్షీరసాగరం నుండి ఆవిర్భావం" } },

    /* ---- Subrahmaṇya ---- */
    { id: "skanda-shashti-janma", deity: "subrahmanya", form: "skanda", vrata: "skanda-shashti",
      name:  { roman: "Skanda Ṣaṣṭhī", deva: "स्कन्द षष्ठी", tel: "స్కంద షష్ఠి" },
      tithi: { roman: "Kārtika · Śukla Ṣaṣṭhī", deva: "कार्तिक शुक्ल षष्ठी", tel: "కార్తిక శుక్ల షష్ఠి" },
      meta:  { roman: "Śiva and Pārvatī", deva: "शिव और पार्वती", tel: "శివుడు, పార్వతి" },
      naks:  { roman: "Kṛttikā nakṣatra, the nurturing stars", deva: "कृत्तिका नक्षत्र, पालक तारे", tel: "కృత్తికా నక్షత్రం, పెంచిన తారలు" } },
    { id: "subrahmanya-shashti-janma", deity: "subrahmanya", form: "subrahmanya", vrata: "subrahmanya-shashti",
      name:  { roman: "Subrahmaṇya Ṣaṣṭhī", deva: "सुब्रह्मण्य षष्ठी", tel: "సుబ్రహ్మణ్య షష్ఠి" },
      tithi: { roman: "Mārgaśīrṣa · Śukla Ṣaṣṭhī", deva: "मार्गशीर्ष शुक्ल षष्ठी", tel: "మార్గశిర శుక్ల షష్ఠి" },
      meta:  { roman: "Śiva and Pārvatī", deva: "शिव और पार्वती", tel: "శివుడు, పార్వతి" },
      naks:  { roman: "Kṛttikā nakṣatra, the nurturing stars", deva: "कृत्तिका नक्षत्र, पालक तारे", tel: "కృత్తికా నక్షత్రం, పెంచిన తారలు" } },

    /* ---- Sūrya ---- */
    { id: "gayatri-jayanti", deity: "devi", form: "gayatri", masa: M.jyeshtha, ti: 10,
      name:  { roman: "Gāyatrī Jayantī", deva: "गायत्री जयन्ती", tel: "గాయత్రీ జయంతి" },
      tithi: { roman: "Jyeṣṭha · Śukla Ekādaśī", deva: "ज्येष्ठ शुक्ल एकादशी", tel: "జ్యేష్ఠ శుక్ల ఏకాదశి" },
      origin:  { roman: "The Gāyatrī metre personified", deva: "गायत्री छन्द का स्वरूप", tel: "గాయత్రీ ఛందం మూర్తి" } },
    { id: "gayatri-jayanti-shravana", deity: "devi", form: "gayatri", masa: M.shravana, ti: 14,
      name:  { roman: "Gāyatrī Jayantī · Śrāvaṇa tradition", deva: "गायत्री जयन्ती · श्रावण परम्परा", tel: "గాయత్రీ జయంతి · శ్రావణ సంప్రదాయం" },
      tithi: { roman: "Śrāvaṇa · Pūrṇimā", deva: "श्रावण पूर्णिमा", tel: "శ్రావణ పౌర్ణమి" },
      origin:  { roman: "The Gāyatrī metre personified", deva: "गायत्री छन्द का स्वरूप", tel: "గాయత్రీ ఛందం మూర్తి" } },
    { id: "surya-janma", deity: "surya", form: "surya", vrata: "ratha-saptami",
      name:  { roman: "Ratha Saptamī · Sūrya Jayantī", deva: "रथ सप्तमी · सूर्य जयन्ती", tel: "రథ సప్తమి · సూర్య జయంతి" },
      tithi: { roman: "Māgha · Śukla Saptamī", deva: "माघ शुक्ल सप्तमी", tel: "మాఘ శుక్ల సప్తమి" },
      meta:  { roman: "Kaśyapa and Aditi · Kāśyapa line", deva: "कश्यप और अदिति · काश्यप वंश", tel: "కశ్యపుడు, అదితి · కాశ్యప వంశం" } },

    /* ---- Guru ---- */
    { id: "shankara-janma", deity: "guru", form: "guru", vrata: "shankara-jayanti",
      name:  { roman: "Śaṅkara Jayantī", deva: "शङ्कर जयन्ती", tel: "శంకర జయంతి" },
      tithi: { roman: "Vaiśākha · Śukla Pañcamī", deva: "वैशाख शुक्ल पञ्चमी", tel: "వైశాఖ శుక్ల పంచమి" } },
    { id: "vyasa-jayanti", deity: "guru", form: "guru", vrata: "guru-purnima",
      name:  { roman: "Vyāsa Jayantī · Guru Pūrṇimā", deva: "व्यास जयन्ती · गुरु पूर्णिमा", tel: "వ్యాస జయంతి · గురు పూర్ణిమ" },
      tithi: { roman: "Āṣāḍha · Pūrṇimā", deva: "आषाढ पूर्णिमा", tel: "ఆషాఢ పౌర్ణమి" },
      meta:  { roman: "Parāśara and Satyavatī · Vāsiṣṭha line", deva: "पराशर और सत्यवती · वासिष्ठ वंश", tel: "పరాశరుడు, సత్యవతి · వాసిష్ఠ వంశం" } },
    { id: "dattatreya-janma", deity: "guru", form: "dattatreya", vrata: "dattatreya-jayanti",
      name:  { roman: "Dattātreya Jayantī", deva: "दत्तात्रेय जयन्ती", tel: "దత్తాత్రేయ జయంతి" },
      tithi: { roman: "Mārgaśīrṣa · Pūrṇimā", deva: "मार्गशीर्ष पूर्णिमा", tel: "మార్గశిర పౌర్ణమి" },
      meta:  { roman: "Atri and Anasūyā · Ātreya line", deva: "अत्रि और अनसूया · आत्रेय वंश", tel: "అత్రి, అనసూయ · ఆత్రేయ వంశం" },
      naks:  { roman: "Mṛgaśīrṣa nakṣatra in the Mādhva account", deva: "माध्व परम्परा में मृगशीर्ष नक्षत्र", tel: "మాధ్వ సంప్రదాయంలో మృగశీర్ష నక్షత్రం" } },

    /* ---- Hanumān ---- */
    { id: "hanuman-janma", deity: "hanuman", form: "hanuman", vrata: "hanuman-jayanti",
      name:  { roman: "Hanumān Jayantī", deva: "हनुमान् जयन्ती", tel: "హనుమాన్ జయంతి" },
      tithi: { roman: "Vaiśākha Kṛṣṇa Daśamī in the Deccan", deva: "दक्षिण में वैशाख कृष्ण दशमी", tel: "దక్షిణాన వైశాఖ బహుళ దశమి" },
      tithi2:{ roman: "Caitra Pūrṇimā in the north", deva: "उत्तर में चैत्र पूर्णिमा", tel: "ఉత్తరాన చైత్ర పౌర్ణమి" },
      meta:  { roman: "Kesarī and Añjanā · Vānara line", deva: "केसरी और अञ्जना · वानर वंश", tel: "కేసరి, అంజన · వానర వంశం" },
      origin:  { roman: "Vāyu is honoured as the divine father", deva: "वायु दिव्य पिता माने जाते हैं", tel: "వాయువు దివ్య తండ్రిగా గౌరవింపబడతాడు" },
      naks:  { roman: "Mūla nakṣatra in the Tamil observance", deva: "तमिल परम्परा में मूल नक्षत्र", tel: "తమిళ సంప్రదాయంలో మూల నక్షత్రం" } },

    /* ---- Nadī devatās ---- */
    { id: "yamuna-jayanti", deity: "nadi", form: "yamuna", masa: M.caitra, ti: 5,
      name:  { roman: "Yamunā Jayantī", deva: "यमुना जयन्ती", tel: "యమునా జయంతి" },
      tithi: { roman: "Caitra · Śukla Ṣaṣṭhī", deva: "चैत्र शुक्ल षष्ठी", tel: "చైత్ర శుక్ల షష్ఠి" },
      meta:  { roman: "Sūrya and Saṃjñā · sister of Yama", deva: "सूर्य और संज्ञा · यम की बहन", tel: "సూర్యుడు, సంజ్ఞ · యముని సోదరి" } },
    { id: "ganga-avatarana", deity: "nadi", form: "ganga", vrata: "ganga-dashahara",
      name:  { roman: "Gaṅgā Daśaharā · Avataraṇa", deva: "गङ्गा दशहरा · अवतरण", tel: "గంగా దశహర · అవతరణ" },
      tithi: { roman: "Jyeṣṭha · Śukla Daśamī", deva: "ज्येष्ठ शुक्ल दशमी", tel: "జ్యేష్ఠ శుక్ల దశమి" },
      meta:  { roman: "Himavān and Menā", deva: "हिमवान् और मेना", tel: "హిమవంతుడు, మేన" } },
  ];
  const T = {
    cap:   { roman: "Janma dinams", deva: "जन्म दिन", tel: "జన్మ దినాలు" },
    janma: { roman: "Janma Dinam", deva: "जन्मदिनम्", tel: "జన్మదినం" },
  };
  const vratId = (r) => r.vrata || ("deity-janma-" + r.id);
  return {
    rows, T, vratId,
    forDeity: (d, f) => rows.filter((r) => r.deity === d && (!f || f === "all" || r.form === f)),
    hasDeity: (d) => rows.some((r) => r.deity === d),
  };
})();

/* the tithis that are not already parvas join the calendar as quiet marks,
   so the month shows them and a bell can be kept on them */
window.STUTI_DEITY_JANMA_EXTRA = (function () {
  const G = window.STUTI_DEITY_JANMA;
  let lunar = null;
  const entries = G.rows.filter((r) => !r.vrata).map((r) => ({
    id: G.vratId(r), deity: r.deity, brief: true, quiet: true,
    name: r.name, rule: r.tithi,
    find: (y) => (lunar ? lunar(y, r.masa, r.ti) : null),
    duration: { roman: "One day", tel: "ఒక రోజు" },
    tagline: { roman: r.tithi.roman, tel: r.tithi.tel },
  }));
  return { entries, bind: (fns) => { lunar = fns.lunar; } };
})();

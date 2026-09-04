import { STUTI_EPHEM } from "./stuti-ephemeris";
import { ayanSys } from "./stuti-reckoning";

/* ============================================================
   STUTI — the saṅkalpa's own vocabulary
   The sixty-year cycle, the graha names a saṅkalpa uses for the
   weekday, the gotra list, the karma it closes with, and the
   Devanāgarī for the yogas and karaṇas the engine names in IAST.

   This lived inside the app's pañcāṅga screen, which meant the
   website could not say a saṅkalpa without keeping a second copy
   of the sixty names — and a second copy is how the cycle came to
   carry two corrupt names in the first place. Plain JS, no React,
   so both apps read the one list.
   ============================================================ */
export const STUTI_SK = (function () {
  /* the 60-year cycle (Prabhava … Akṣaya) */
  const SAMVATSARA = [
    ["Prabhava","प्रभव"],["Vibhava","विभव"],["Śukla","शुक्ल"],["Pramoda","प्रमोद"],["Prajāpati","प्रजापति"],
    ["Āṅgīrasa","आङ्गीरस"],["Śrīmukha","श्रीमुख"],["Bhāva","भाव"],["Yuva","युव"],["Dhātṛ","धातृ"],
    ["Īśvara","ईश्वर"],["Bahudhānya","बहुधान्य"],["Pramāthī","प्रमाथी"],["Vikrama","विक्रम"],["Vṛṣa","वृष"],
    ["Citrabhānu","चित्रभानु"],["Svabhānu","स्वभानु"],["Tāraṇa","तारण"],["Pārthiva","पार्थिव"],["Vyaya","व्यय"],
    ["Sarvajit","सर्वजित्"],["Sarvadhārī","सर्वधारी"],["Virodhī","विरोधी"],["Vikṛti","विकृति"],["Khara","खर"],
    ["Nandana","नन्दन"],["Vijaya","विजय"],["Jaya","जय"],["Manmatha","मन्मथ"],["Durmukha","दुर्मुख"],
    ["Hevilambi","हेविळम्बि"],["Vilambi","विळम्बि"],["Vikārī","विकारी"],["Śārvarī","शार्वरी"],["Plava","प्लव"],
    ["Śubhakṛt","शुभकृत्"],["Śobhakṛt","शोभकृत्"],["Krodhi","क्रोधी"],["Viśvāvasu","विश्वावसु"],["Parābhava","पराभव"],
    ["Plavaṅga","प्लवङ्ग"],["Kīlaka","कीलक"],["Saumya","सौम्य"],["Sādhāraṇa","साधारण"],["Virodhakṛt","विरोधकृत्"],
    ["Paridhāvī","परिधावी"],["Pramādī","प्रमादी"],["Ānanda","आनन्द"],["Rākṣasa","राक्षस"],["Nala","नल"],
    ["Piṅgala","पिङ्गल"],["Kālayukti","कालयुक्ति"],["Siddhārthī","सिद्धार्थी"],["Raudra","रौद्र"],["Durmati","दुर्मति"],
    ["Dundubhi","दुन्दुभि"],["Rudhirodgārī","रुधिरोद्गारी"],["Raktākṣī","रक्ताक्षी"],["Krodhana","क्रोधन"],["Akṣaya","अक्षय"],
  ];

  /* Which of the sixty the day belongs to, and the era-year that carries it.
     The cycle turns at the Caitra new moon — Ugādi — which wanders between the
     middle of March and the middle of April; a fixed 22 March cutoff named 2024
     wrongly from then until the ninth of April, its actual Ugādi. The ephemeris
     knows when the lunation opened, so ask it.
     Returns [iast, deva, śaka, vikrama]; the first two are what every caller
     used before this and still reads. */
  function samvatsaraFor(date) {
    const E = STUTI_EPHEM;
    if (E && E.lunarYearOf) {
      const ly = E.lunarYearOf(E.toJD(date), (typeof ayanSys === "function") ? ayanSys() : "lahiri");
      const s = SAMVATSARA[ly.samvatsara];
      return [s[0], s[1], ly.shaka, ly.vikrama];
    }
    /* no ephemeris — the old approximation, which is better than a blank row */
    const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    const lunarYear = (m < 3 || (m === 3 && d < 22)) ? y - 1 : y;
    const idx = (((37 + (lunarYear - 2024)) % 60) + 60) % 60; // 2024–25 = Krodhi (#38)
    return SAMVATSARA[idx];
  }

  /* Yoga & Karaṇa: the engine gives IAST only. Devanāgarī here is the
     source for the other scripts (Telugu derived via STUTI_TRANSLIT,
     the same path used for the saṃvatsara). Keyed by the engine's IAST. */
  const YOGA_DEVA = {
    "Viṣkambha": "विष्कम्भ", "Prīti": "प्रीति", "Āyuṣmān": "आयुष्मान्", "Saubhāgya": "सौभाग्य",
    "Śobhana": "शोभन", "Atigaṇḍa": "अतिगण्ड", "Sukarmā": "सुकर्मा", "Dhṛti": "धृति",
    "Śūla": "शूल", "Gaṇḍa": "गण्ड", "Vṛddhi": "वृद्धि", "Dhruva": "ध्रुव",
    "Vyāghāta": "व्याघात", "Harṣaṇa": "हर्षण", "Vajra": "वज्र", "Siddhi": "सिद्धि",
    "Vyatīpāta": "व्यतीपात", "Varīyān": "वरीयान्", "Parigha": "परिघ", "Śiva": "शिव",
    "Siddha": "सिद्ध", "Sādhya": "साध्य", "Śubha": "शुभ", "Śukla": "शुक्ल",
    "Brahmā": "ब्रह्मा", "Aindra": "ऐन्द्र", "Vaidhṛti": "वैधृति",
  };
  const KARANA_DEVA = {
    "Bava": "बव", "Bālava": "बालव", "Kaulava": "कौलव", "Taitila": "तैतिल",
    "Garaja": "गरज", "Vaṇija": "वणिज", "Viṣṭi": "विष्टि", "Śakuni": "शकुनि",
    "Catuṣpāda": "चतुष्पाद", "Nāga": "नाग", "Kiṃstughna": "किंस्तुघ्न",
  };

  /* saṅkalpa vāra names — the graha (planetary) name, not the weekday word,
     indexed by weekday 0=Sun. These take vāsare directly (Sthira vāsare…). */
  const VARA_GRAHA = [
    { iast: "Bhānu",     deva: "भानु",       tel: "భాను" },      // Sun
    { iast: "Indu",      deva: "इन्दु",       tel: "ఇందు" },      // Mon
    { iast: "Bhauma",    deva: "भौम",        tel: "భౌమ" },       // Tue
    { iast: "Saumya",    deva: "सौम्य",       tel: "సౌమ్య" },     // Wed
    { iast: "Bṛhaspati", deva: "बृहस्पति", tel: "బృహస్పతి" },  // Thu
    { iast: "Bhṛgu",     deva: "भृगु",        tel: "భృగు" },      // Fri
    { iast: "Sthira",    deva: "स्थिर",       tel: "స్థిర" },      // Sat
  ];

  /* common gotras (pravara ṛṣi lineages) — [iast, deva]; Telugu derived at render.
     Āṅgirasa had a Devanāgarī ग spliced into its IAST — "Āṅगīrasa" — which is
     the sort of thing that survives in a list nobody reads aloud. */
  const GOTRAS = [
    ["Bhāradvāja", "भारद्वाज"], ["Kāśyapa", "काश्यप"], ["Viśvāmitra", "विश्वामित्र"],
    ["Vasiṣṭha", "वसिष्ठ"], ["Gautama", "गौतम"], ["Atri", "अत्रि"],
    ["Bhṛgu", "भृगु"], ["Āṅgirasa", "आङ्गिरस"], ["Jamadagni", "जमदग्नि"],
    ["Agastya", "अगस्त्य"], ["Kauṇḍinya", "कौण्डिन्य"], ["Śāṇḍilya", "शाण्डिल्य"],
    ["Kauśika", "कौशिक"], ["Hārīta", "हारीत"], ["Śrīvatsa", "श्रीवत्स"],
    ["Parāśara", "पराशर"], ["Garga", "गर्ग"], ["Mudgala", "मुद्गल"],
  ];

  /* the intention (karma) the saṅkalpa closes with */
  const KARMAS = [
    { id: "parayana", iast: "pārāyaṇam", deva: "पारायणम्", label: { roman: "Recitation (pārāyaṇa)", deva: "पारायण", telugu: "పారాయణం" } },
    { id: "japa",     iast: "japam",     deva: "जपम्",     label: { roman: "Japa",   deva: "जप",   telugu: "జపం" } },
    { id: "puja",     iast: "pūjāṃ",     deva: "पूजां",    label: { roman: "Pūjā",   deva: "पूजा", telugu: "పూజ" } },
    { id: "dhyana",   iast: "dhyānam",   deva: "ध्यानम्",  label: { roman: "Dhyāna", deva: "ध्यान", telugu: "ధ్యానం" } },
    { id: "vrata",    iast: "vratam",    deva: "व्रतम्",   label: { roman: "Vrata",  deva: "व्रत",  telugu: "వ్రతం" } },
  ];

  /* match a typed gotra to the list, ignoring case + diacritics */
  const skNorm = (x) => (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  return { SAMVATSARA, samvatsaraFor, YOGA_DEVA, KARANA_DEVA, VARA_GRAHA, GOTRAS, KARMAS, skNorm };
})();

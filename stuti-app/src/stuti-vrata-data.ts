import { STUTI_EPHEM } from "./stuti-ephemeris";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { sampradaya } from "./stuti-reckoning";
import { STUTI_SANKRANTI } from "./stuti-sankranti-data";

/* ============================================================
   STUTI — Vratas & viśeṣa pūjās
   A vrata is not a date in a list: it is something you prepare for,
   perform, and conclude. So each one carries its rule (when it falls),
   its samagri (what to gather — the part that is only useful *before*),
   its vidhi (what to do, in order), its naivedya, its texts, and the
   cautions. Dates are derived from the pañcāṅga engine.

   Regional practice varies widely. Every guide names the tradition it
   follows; families differ, and their own elders outrank this app.
   ============================================================ */
export const STUTI_VRATA = (function () {
  const P = () => AKSHARA_PANCHANGA;

  /* tithiIndex is 0-based across the whole lunar month:
     0–14 = śukla pratipadā…pūrṇimā, 15–29 = kṛṣṇa pratipadā…amāvāsyā */
  const T = { pratipada: 0, tritiya: 2, caturthi: 3, panchami: 4, ekadashi: 10, purnima: 14,
              kCaturthi: 18, kEkadashi: 25, kTrayodashi: 27, amavasya: 29 };

  const D = (y, m, d) => new Date(y, m, d);

  /* ---------- Lunar months, named rather than counted ----------
     Counting lunations from Ugadi breaks in an intercalary year — 2026
     carries an Adhika Jyeshtha, so counting puts every later month a full
     month early. The traditional rule is not counting at all: an amanta
     month takes its name from the rasi the sun occupies at its new moon
     (sun in Mina -> Caitra, Mesa -> Vaisakha, and so on). A lunation in
     which the sun changes no rasi is adhika and carries the next month's
     name; vratas are kept in the nija (second) month, so that is the one
     returned. The rasi comes from the engine, which reads it off the
     ephemeris — one solar longitude for the whole app, so no two modules
     can disagree about which side of a sankranti a new moon fell on. */
  const MASA = { caitra: 0, vaisakha: 1, jyeshtha: 2, ashadha: 3, shravana: 4, bhadrapada: 5,
                 ashvina: 6, kartika: 7, margashirsha: 8, pausha: 9, magha: 10, phalguna: 11 };

  const REF = () => P().locations.find((l) => l.id === "ujjain") || P().locations[0];

  const sunRashi = (d) => P().sunRashi(d);   // the engine owns the astronomy

  /* The next day that opens a bright fortnight, on or after `from`.
     Looked for as a wrap rather than a match: a tithi that begins and ends
     between two sunrises is elided, so pratipada itself can be missing from
     the day list entirely — as Margasirsa 2026 is. Watching for the index to
     fall instead of to equal zero survives that. */
  function nextMonthStart(from) {
    const d = new Date(from), loc = REF();
    let prev = P().forDay(d, loc).tithiIndex;
    if (prev === 0) return new Date(d);
    for (let i = 0; i < 40; i++) {
      d.setDate(d.getDate() + 1);
      const cur = P().forDay(d, loc).tithiIndex;
      if (cur < prev && prev >= 15) return new Date(d);
      prev = cur;
    }
    return null;
  }

  /* Every lunation of the samvatsara opening in year y. The name and the
     adhika flag are read straight off the engine, which computes both from
     the exact new moons either side — two modules deciding "is this month
     intercalary?" by different arithmetic is how they come to disagree. */
  const yearCache = {};
  function months(y) {
    if (yearCache[y]) return yearCache[y];
    const out = [], loc = REF();
    let s = nextMonthStart(new Date(y, 1, 10));   // start well before Caitra
    for (let i = 0; i < 15 && s; i++) {
      const pa = P().forDay(s, loc);
      out.push({ start: new Date(s), name: pa.masaIdx, adhika: !!pa.masaAdhika });
      const probe = new Date(s); probe.setDate(probe.getDate() + 20);
      s = nextMonthStart(probe);
    }
    yearCache[y] = out;
    return out;
  }

  /* first day of a named lunar month — the nija one, if the year has two */
  function monthStart(y, n) {
    const ms = months(y).filter((m) => m.name === n && !m.adhika);
    if (!ms.length) return null;
    /* Caitra through Phalguna run from spring; pick the one on or after Caitra */
    const caitra = months(y).find((m) => m.name === MASA.caitra && !m.adhika);
    const pick = caitra ? ms.find((m) => m.start >= caitra.start) || ms[0] : ms[0];
    return new Date(pick.start);
  }

  /* The day carrying a given tithi inside a named lunar month. An elided
     tithi has no sunrise of its own, so the first day at or past it is
     taken — which is where the observance moves to in practice. */
  function lunar(y, n, ti, rule) {
    const s = monthStart(y, n);
    if (!s) return null;
    const loc = REF(), d = new Date(s);
    let prev = -1, base = null;
    for (let i = 0; i <= 31; i++) {
      const cur = P().forDay(d, loc).tithiIndex;
      if (cur < prev) break;                 // rolled into the next month
      if (cur >= ti) { base = new Date(d); break; }
      prev = cur;
      d.setDate(d.getDate() + 1);
    }
    return base ? governed(base, ti, rule) : null;
  }

  /* ---------- which day a vrata is kept on ----------
     A tithi is not a day; it is a span of nineteen to twenty-six hours
     that straddles sunrises. Most vratas take the day at whose SUNRISE
     the tithi is current, but not all — Gaṇeśa Caturthī wants it at
     madhyāhna, Śivarātri at niśītha, Dīpāvalī at pradoṣa. Getting this
     wrong is worth exactly one day, which is the error it produces. */
  const jdAtLocal = (date, minutes, tz) =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000 + 2440587.5 + minutes / 1440 - tz / 24;

  /* ---------- where the traditions part ----------
     Vaiṣṇavas will not keep an ekādaśī that daśamī still touches at
     aruṇodaya — the fast moves to dvādaśī. Smārtas take the ekādaśī
     prevailing at sunrise as it stands. Janmāṣṭamī divides the same way:
     Smārtas by aṣṭamī at niśītha, Vaiṣṇavas by aṣṭamī at sunrise. This is
     a genuine disagreement between schools, not an error in either. */
  const sampradaya = () => (typeof sampradaya === "function" ? sampradaya() : "smarta");

  function viddhaShift(base, ti) {
    if (sampradaya() !== "vaishnava") return base;
    const Pa = P(), loc = REF(), E = STUTI_EPHEM;
    const pa = Pa.forDay(base, loc);
    if (!E || pa.sunrise == null || pa.jdRef == null) return base;
    const arunodaya = pa.jdRef - 96 / 1440;          // 96 minutes before sunrise
    const before = Math.floor(E.elong(arunodaya) / 12);
    if (before === ti) return base;                   // ekādaśī already running
    return new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1);
  }

  function governed(base, ti, rule) {
    if (rule === "viddha") return viddhaShift(base, ti);
    if (rule === "janmashtami") {
      const nis = governed(base, ti, "nishitha");
      return sampradaya() === "vaishnava" ? governed(base, ti, "sunrise") : nis;
    }
    if (!rule || rule === "sunrise") return base;
    const E = STUTI_EPHEM, Pa = P(), loc = REF();
    if (!E) return base;
    /* The span wanted is tithi `ti`'s own, which is NOT necessarily the one
       holding the base day's sunrise — a pradoṣa trayodaśī often begins after
       it. Deriving the span from the base day's sunrise made the test compare
       against the wrong tithi entirely, and returned a day early. */
    const anchor = Pa.forDay(base, loc).jdRef;
    if (anchor == null) return base;
    let start = null, end = null;
    for (const probe of [anchor, anchor + 0.5, anchor + 1, anchor - 0.5]) {
      if (Math.floor(E.elong(probe) / 12) !== ti) continue;
      start = E.tithiStart(probe); end = E.tithiEnd(probe);
      break;
    }
    if (start == null || end == null) return base;
    const tz = Pa.effTz(loc, base);
    for (const off of [-1, 0, 1, 2]) {
      const day = new Date(base.getFullYear(), base.getMonth(), base.getDate() + off);
      const pa = Pa.forDay(day, loc);
      if (pa.sunrise == null || pa.sunset == null) continue;
      let mins;
      if (rule === "madhyahna") mins = (pa.sunrise + pa.sunset) / 2;
      else if (rule === "pradosha") mins = pa.sunset;
      else if (rule === "nishitha") mins = 1440;          // the night that follows
      else mins = pa.sunrise;
      const jd = jdAtLocal(day, mins, tz);
      if (jd >= start && jd <= end) return day;
    }
    return base;
  }

  const dayKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

  /* the Friday strictly before a given date — when Śrāvaṇa Pūrṇimā itself
     falls on a Friday, the vrata is kept the Friday preceding it */
  const fridayBefore = (d) => { const x = new Date(d); do { x.setDate(x.getDate() - 1); } while (x.getDay() !== 5); return x; };

  const vratas = [
    /* ---------------------------------------------------------- */
    {
      id: "ganesha-chaturthi", deity: "ganesha",
      name: { roman: "Gaṇeśa Caturthī", deva: "गणेश चतुर्थी", tel: "గణేశ చతుర్థి" },
      rule: { roman: "Bhādrapada · Śukla Caturthī", deva: "भाद्रपद शुक्ल चतुर्थी", tel: "భాద్రపద శుక్ల చతుర్థి" },
      find: (y) => lunar(y, MASA.bhadrapada, T.caturthi, "madhyahna"),
      duration: { roman: "One day, or one to eleven days of installation", tel: "ఒక రోజు, లేదా ఒకటి నుండి పదకొండు రోజుల ప్రతిష్ఠ" },
      tagline: { roman: "The birth of Gaṇeśa — clay, not stone; welcomed as a guest and sent home to the water.",
                 tel: "గణేశుని జననం — మట్టితో, రాతితో కాదు; అతిథిగా ఆహ్వానించి, నీటికి సాగనంపుతారు." },
      who: { roman: "Kept by the whole household; the eldest usually takes the saṅkalpa.",
             tel: "ఇల్లంతా కలిసి చేసేది; సంకల్పం సాధారణంగా పెద్దవారు తీసుకుంటారు." },
      significance: [
        { roman: "Gaṇeśa is invoked first in every rite, so his own festival opens the ritual year in Bhādrapada.", tel: "ప్రతి కార్యంలో మొదట గణేశుని ఆవాహన చేస్తారు; అందుకే భాద్రపదంలో ఆయన పండుగతోనే ఆచార సంవత్సరం మొదలవుతుంది." },
        { roman: "The mūrti is of unbaked clay by design — it is made, worshipped, and dissolved, the whole festival a lesson in holding lightly.", tel: "మూర్తి కాల్చని మట్టితోనే చేయాలి — తయారుచేసి, పూజించి, కరిగిస్తారు; పండుగ అంతా విడిచిపెట్టడం నేర్పుతుంది." },
        { roman: "The moon is not to be looked at on this night — the mithyā-doṣa of Syamantaka; if seen, the Syamantaka story is read as remedy.", tel: "ఈ రాత్రి చంద్రుని చూడరాదు — స్యమంతక మిథ్యాదోషం; చూసినట్లయితే స్యమంతక కథ చదవడం పరిహారం." },
      ],
      timeline: [
        { t: { roman: "Before the day", tel: "ముందు రోజు" }, d: { roman: "Bring home a clay mūrti, patrī (the twenty-one leaves), and the makings of the maṇḍapa.", tel: "మట్టి మూర్తి, పత్రి (ఇరవై ఒక్క పత్రాలు), మండప సామగ్రి ఇంటికి తెచ్చుకోవాలి." } },
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Bathe, decorate the maṇḍapa, and install the mūrti facing east. Caturthī forenoon is the preferred hour.", tel: "స్నానం, మండప అలంకరణ, తూర్పు ముఖంగా మూర్తి ప్రతిష్ఠ. చతుర్థి పూర్వాహ్ణం శ్రేష్ఠం." } },
        { t: { roman: "Pūjā", tel: "పూజ" }, d: { roman: "Prāṇa-pratiṣṭhā, ṣoḍaśopacāra, patrī-pūjā with the twenty-one leaves, then the twenty-one modakas.", tel: "ప్రాణప్రతిష్ఠ, షోడశోపచారం, ఇరవై ఒక్క పత్రాలతో పత్రీపూజ, తరువాత ఇరవై ఒక్క మోదకాలు." } },
        { t: { roman: "Visarjana", tel: "విసర్జన" }, d: { roman: "On day one, three, five, seven or eleven — take leave with ārati and immerse in clean water.", tel: "ఒకటి, మూడు, ఐదు, ఏడు లేదా పదకొండవ రోజున — హారతితో సెలవు తీసుకుని శుభ్రమైన నీటిలో నిమజ్జనం." } },
      ],
      samagri: [
        { roman: "Clay Gaṇeśa mūrti (unbaked, undyed)", tel: "మట్టి గణేశ మూర్తి (కాల్చనిది, రంగులేనిది)" },
        { roman: "Patrī — the twenty-one leaves (garika, mācipatri, bilva, tulasi, jājikāya…)", tel: "పత్రి — ఇరవై ఒక్క పత్రాలు (గరిక, మాచీపత్రి, బిల్వం, తులసి, జాజికాయ…)" },
        { roman: "Garika (dūrvā) grass — twenty-one blades, tied in threes", tel: "గరిక (దూర్వ) — ఇరవై ఒక్క రెమ్మలు, మూడేసి చొప్పున కట్టి" },
        { roman: "Modaka or undrāḷḷu — twenty-one", tel: "మోదకాలు లేదా ఉండ్రాళ్ళు — ఇరవై ఒక్కటి" },
        { roman: "Banana stalks and mango leaves for the maṇḍapa", tel: "మండపానికి అరటి బోదెలు, మామిడి ఆకులు" },
        { roman: "Turmeric, kumkum, akṣata, sandal paste", tel: "పసుపు, కుంకుమ, అక్షతలు, గంధం" },
        { roman: "Coconut, betel leaves and nuts, fruit, jaggery", tel: "కొబ్బరికాయ, తమలపాకులు, వక్కలు, పండ్లు, బెల్లం" },
        { roman: "Dhūpa, dīpa, ghee, camphor, cotton wicks", tel: "ధూపం, దీపం, నెయ్యి, కర్పూరం, వత్తులు" },
        { roman: "Kalaśa, new cloth, a small bell", tel: "కలశం, కొత్త వస్త్రం, చిన్న గంట" },
      ],
      vidhi: [
        { step: { roman: "Saṅkalpa", tel: "సంకల్పం" }, detail: { roman: "Seated facing east, state the year, māsa, pakṣa, tithi, your gotra and nāma, and the vow being kept.", tel: "తూర్పు ముఖంగా కూర్చుని సంవత్సరం, మాసం, పక్షం, తిథి, గోత్రనామాలు, చేయబోయే వ్రతం చెప్పుకోవాలి." } },
        { step: { roman: "Kalaśa & Prāṇa-pratiṣṭhā", tel: "కలశం, ప్రాణప్రతిష్ఠ" }, detail: { roman: "Establish the kalaśa, then invoke the living presence into the clay with the prāṇa-pratiṣṭhā mantra.", tel: "కలశ స్థాపన చేసి, ప్రాణప్రతిష్ఠ మంత్రంతో మట్టిలో చైతన్యాన్ని ఆవాహన చేయాలి." } },
        { step: { roman: "Ṣoḍaśopacāra", tel: "షోడశోపచారం" }, detail: { roman: "The sixteen services — āvāhana through to namaskāra — offering water, cloth, sandal, akṣata, flowers.", tel: "పదహారు ఉపచారాలు — ఆవాహన మొదలు నమస్కారం వరకు — నీరు, వస్త్రం, గంధం, అక్షతలు, పుష్పాలు." } },
        { step: { roman: "Patrī pūjā", tel: "పత్రీ పూజ" }, detail: { roman: "Offer the twenty-one leaves one by one with the twenty-one names; garika above all, which Gaṇeśa favours.", tel: "ఇరవై ఒక్క నామాలతో ఇరవై ఒక్క పత్రాలు ఒక్కొక్కటిగా సమర్పించాలి; అన్నిటికన్నా గరిక గణేశునికి ప్రియం." } },
        { step: { roman: "Naivedya", tel: "నైవేద్యం" }, detail: { roman: "Twenty-one modakas, offered with the right hand covered by the left.", tel: "ఇరవై ఒక్క మోదకాలు, కుడిచేతిని ఎడమచేతితో ఆనించి సమర్పించాలి." } },
        { step: { roman: "Kathā & Ārati", tel: "కథ, హారతి" }, detail: { roman: "Read the Syamantaka story, then the ārati; distribute prasāda to everyone present.", tel: "స్యమంతక కథ చదివి, హారతి ఇచ్చి, అందరికీ ప్రసాదం పంచాలి." } },
        { step: { roman: "Udvāsana", tel: "ఉద్వాసన" }, detail: { roman: "On the closing day, ask leave formally before immersing — the guest is seen off, not discarded.", tel: "చివరి రోజు నిమజ్జనానికి ముందు ఉద్వాసన చెప్పాలి — అతిథిని సాగనంపడం, వదిలేయడం కాదు." } },
      ],
      naivedya: [
        { item: { roman: "Modaka / undrāḷḷu", tel: "మోదకం / ఉండ్రాళ్ళు" }, note: { roman: "Twenty-one, steamed, with a jaggery-coconut filling.", tel: "ఇరవై ఒక్కటి, ఆవిరిపై, బెల్లం-కొబ్బరి పూరణంతో." } },
        { item: { roman: "Panakam & vaḍapappu", tel: "పానకం, వడపప్పు" }, note: { roman: "Jaggery water and soaked moong — offered in the heat of Bhādrapada.", tel: "బెల్లం నీరు, నానబెట్టిన పెసరపప్పు — భాద్రపద ఎండలో సమర్పణ." } },
        { item: { roman: "Fruit and jaggery", tel: "పండ్లు, బెల్లం" }, note: { roman: "Banana above all; no strong-smelling fruit.", tel: "ముఖ్యంగా అరటిపండు; ఘాటైన వాసన గల పండ్లు వద్దు." } },
      ],
      stotras: [{ deity: "ganesha", m: "vakratu" }, { deity: "ganesha", m: "atharva" }, { deity: "ganesha", m: "pancaratn" }, { deity: "ganesha", m: "sahasranama" }],
      dos: [
        { roman: "Use unbaked clay and immerse in clean water — a plaster mūrti poisons the tank it goes into.", tel: "కాల్చని మట్టినే వాడాలి, శుభ్రమైన నీటిలో నిమజ్జనం చేయాలి — ప్లాస్టర్ మూర్తి ఆ నీటిని విషతుల్యం చేస్తుంది." },
        { roman: "Keep the lamp lit for as long as the mūrti is installed.", tel: "మూర్తి ఉన్నంతకాలం దీపం వెలుగుతూ ఉండాలి." },
        { roman: "Feed whoever comes — the festival is measured by the guests fed, not the mūrti's height.", tel: "వచ్చినవారికి భోజనం పెట్టాలి — పండుగ కొలత మూర్తి ఎత్తు కాదు, ఆదరించిన అతిథులు." },
      ],
      donts: [
        { roman: "Do not look at the moon on Caturthī night; if you do, read the Syamantaka kathā.", tel: "చతుర్థి రాత్రి చంద్రుని చూడరాదు; చూస్తే స్యమంతక కథ చదవాలి." },
        { roman: "Do not offer tulasī to Gaṇeśa — it is withheld from him alone.", tel: "గణేశునికి తులసి సమర్పించరాదు — ఆయనకు మాత్రమే నిషిద్ధం." },
        { roman: "Do not leave the mūrti installed past the day you vowed.", tel: "సంకల్పించిన రోజు దాటి మూర్తిని ఉంచరాదు." },
      ],
      source: { roman: "Following common Telugu and Marathi household practice; the patrī list and modaka count vary by family.", tel: "సాధారణ తెలుగు, మరాఠీ గృహాచారం ప్రకారం; పత్రి జాబితా, మోదకాల సంఖ్య కుటుంబాన్ని బట్టి మారుతాయి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "varalakshmi", deity: "devi", kind: "vratam",
      name: { roman: "Varalakṣmī Vratam", deva: "वरलक्ष्मी व्रतम्", tel: "వరలక్ష్మీ వ్రతం" },
      rule: { roman: "Śrāvaṇa · the Friday before Pūrṇimā", deva: "श्रावण, पूर्णिमा से पूर्व शुक्रवार", tel: "శ్రావణ పౌర్ణమికి ముందు శుక్రవారం" },
      find: (y) => { const p = lunar(y, MASA.shravana, T.purnima); return p ? fridayBefore(p) : null; },
      duration: { roman: "Forenoon, before noon", tel: "మధ్యాహ్నానికి ముందు, పూర్వాహ్ణం" },
      tagline: { roman: "Lakṣmī who grants boons — kept by married women for the well-being of the household.",
                 tel: "వరాలిచ్చే లక్ష్మి — ఇంటి క్షేమం కోసం ముత్తైదువులు చేసే వ్రతం." },
      who: { roman: "Kept by sumaṅgalis; widely observed across Andhra, Telangana, Karnataka and Tamil Nadu.",
             tel: "ముత్తైదువులు చేస్తారు; ఆంధ్ర, తెలంగాణ, కర్ణాటక, తమిళనాడులలో విస్తృతంగా ఆచరిస్తారు." },
      significance: [
        { roman: "Śiva taught this vrata to Pārvatī as the surest household observance for prosperity and a long marriage.", tel: "గృహక్షేమం, దీర్ఘ సుమంగళిత్వం కోసం శివుడు పార్వతికి ఉపదేశించిన వ్రతం." },
        { roman: "Worshipping Varalakṣmī is held to equal worship of all eight Lakṣmīs at once — Dhana, Dhānya, Dhairya and the rest.", tel: "వరలక్ష్మిని పూజిస్తే ధన, ధాన్య, ధైర్య మొదలైన అష్టలక్ష్ములను ఒకేసారి పూజించినట్లే." },
        { roman: "The kalaśa is dressed as the goddess herself — face, jewels, sari — so the household worships a guest, not a symbol.", tel: "కలశాన్నే అమ్మవారిగా అలంకరిస్తారు — ముఖం, నగలు, చీర — గుర్తుగా కాక అతిథిగా పూజిస్తారు." },
      ],
      timeline: [
        { t: { roman: "The day before", tel: "ముందు రోజు" }, d: { roman: "Clean the house, gather the samagri, soak the nine grains, prepare the toraṃ threads.", tel: "ఇల్లు శుభ్రం, సామగ్రి సిద్ధం, నవధాన్యాలు నానబెట్టడం, తోరాలు తయారీ." } },
        { t: { roman: "Before sunrise", tel: "సూర్యోదయానికి ముందు" }, d: { roman: "Bathe, wear a new or clean sari, draw the muggu and set the pīṭha facing east.", tel: "స్నానం, కొత్త లేదా శుభ్రమైన చీర, ముగ్గు, తూర్పు ముఖంగా పీఠం." } },
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Establish and dress the kalaśa, then the pūjā and the kathā — completed before noon.", tel: "కలశ స్థాపన, అలంకరణ, పూజ, కథ — మధ్యాహ్నానికి ముందు పూర్తి." } },
        { t: { roman: "Afterwards", tel: "తరువాత" }, d: { roman: "Tie the toraṃ, give tāmbūlam to the sumaṅgalis invited, and eat only after they have.", tel: "తోరం కట్టుకుని, పిలిచిన ముత్తైదువులకు తాంబూలం ఇచ్చి, వారి తరువాతే భోజనం." } },
      ],
      samagri: [
        { roman: "Kalaśa (silver, brass or copper) with rice, a coin and a whole betel nut", tel: "కలశం (వెండి, ఇత్తడి లేదా రాగి) — బియ్యం, నాణెం, పోకచెక్క" },
        { roman: "A Lakṣmī face (mukhavaṭa) or framed picture for the kalaśa", tel: "కలశానికి లక్ష్మీ ముఖవట లేదా పటం" },
        { roman: "New sari and blouse piece, bangles, jewellery to dress the kalaśa", tel: "కలశ అలంకరణకు కొత్త చీర, రవికె గుడ్డ, గాజులు, నగలు" },
        { roman: "Toraṃ — nine-strand thread with nine knots, one per woman", tel: "తోరం — తొమ్మిది పోగుల దారం, తొమ్మిది ముడులు, ఒక్కొక్కరికి ఒకటి" },
        { roman: "Mango leaves, coconut, banana stalks, lotus or any fragrant flowers", tel: "మామిడాకులు, కొబ్బరికాయ, అరటి బోదెలు, తామర లేదా సువాసన పూలు" },
        { roman: "Turmeric, kumkum, akṣata, sandal, camphor, ghee lamps", tel: "పసుపు, కుంకుమ, అక్షతలు, గంధం, కర్పూరం, నేతి దీపాలు" },
        { roman: "Nine grains (navadhānya), rice, jaggery", tel: "నవధాన్యాలు, బియ్యం, బెల్లం" },
        { roman: "Tāmbūlam trays for the invited sumaṅgalis", tel: "పిలిచిన ముత్తైదువులకు తాంబూలం పళ్ళెములు" },
      ],
      vidhi: [
        { step: { roman: "Saṅkalpa", tel: "సంకల్పం" }, detail: { roman: "Take the vow naming the household and its well-being, seated before the pīṭha.", tel: "పీఠం ముందు కూర్చుని ఇంటిని, దాని క్షేమాన్ని పేర్కొంటూ సంకల్పం చెప్పాలి." } },
        { step: { roman: "Gaṇeśa pūjā", tel: "గణేశ పూజ" }, detail: { roman: "Worship Gaṇeśa first with turmeric, so the rite runs without obstruction.", tel: "ముందుగా పసుపు గణపతిని పూజించాలి, విఘ్నం లేకుండా." } },
        { step: { roman: "Kalaśa sthāpana", tel: "కలశ స్థాపన" }, detail: { roman: "Fill the kalaśa, set mango leaves and coconut, fix the face, and dress it as the goddess.", tel: "కలశం నింపి, మామిడాకులు, కొబ్బరికాయ ఉంచి, ముఖవట అమర్చి అమ్మవారిలా అలంకరించాలి." } },
        { step: { roman: "Āvāhana & ṣoḍaśopacāra", tel: "ఆవాహన, షోడశోపచారం" }, detail: { roman: "Invoke Varalakṣmī and offer the sixteen services, with the aṣṭottara throughout.", tel: "వరలక్ష్మిని ఆవాహన చేసి, అష్టోత్తరంతో పదహారు ఉపచారాలు సమర్పించాలి." } },
        { step: { roman: "Toraṃ pūjā & binding", tel: "తోరపూజ, ధారణ" }, detail: { roman: "Worship the toraṃ at the kalaśa, then tie it on the right wrist of each woman keeping the vrata.", tel: "తోరాన్ని కలశం వద్ద పూజించి, వ్రతం చేసే ప్రతి స్త్రీ కుడి మణికట్టుకు కట్టాలి." } },
        { step: { roman: "Kathā", tel: "కథ" }, detail: { roman: "Read the story of Cārumatī of Kuṇḍinapura, to whom the goddess appeared in a dream.", tel: "కుండినపుర చారుమతి కథ చదవాలి — ఆమెకు అమ్మవారు స్వప్నంలో దర్శనమిచ్చారు." } },
        { step: { roman: "Ārati & tāmbūlam", tel: "హారతి, తాంబూలం" }, detail: { roman: "Conclude with ārati, then give tāmbūlam and kumkum to the sumaṅgalis before eating.", tel: "హారతితో ముగించి, భోజనానికి ముందు ముత్తైదువులకు తాంబూలం, కుంకుమ ఇవ్వాలి." } },
      ],
      naivedya: [
        { item: { roman: "Pāyasam", tel: "పాయసం" }, note: { roman: "Rice or semiyā, in milk with jaggery.", tel: "బియ్యం లేదా సేమియా, పాలలో బెల్లంతో." } },
        { item: { roman: "Pulihora and garelu", tel: "పులిహోర, గారెలు" }, note: { roman: "The standard pair for a Lakṣmī pūjā.", tel: "లక్ష్మీ పూజకు సాధారణ జంట." } },
        { item: { roman: "Nine kinds of fruit", tel: "తొమ్మిది రకాల పండ్లు" }, note: { roman: "With jaggery and soaked moong.", tel: "బెల్లం, నానబెట్టిన పెసరపప్పుతో." } },
      ],
      stotras: [{ deity: "devi", m: "kanakadhara" }, { deity: "devi", m: "sri suktam" }, { deity: "devi", m: "mahalaksmi" }, { deity: "devi", m: "laksmi astottara" }],
      dos: [
        { roman: "Complete the pūjā before noon; the forenoon is the vrata's hour.", tel: "మధ్యాహ్నానికి ముందే పూజ పూర్తి చేయాలి; పూర్వాహ్ణమే వ్రత సమయం." },
        { roman: "Keep the toraṃ on until the next Varalakṣmī, or at least the Śrāvaṇa month out.", tel: "తోరాన్ని మరుసటి వరలక్ష్మి వరకు, కనీసం శ్రావణమాసం పూర్తయ్యే వరకు ఉంచుకోవాలి." },
        { roman: "Invite at least two sumaṅgalis and send them off with tāmbūlam.", tel: "కనీసం ఇద్దరు ముత్తైదువులను పిలిచి తాంబూలంతో సాగనంపాలి." },
      ],
      donts: [
        { roman: "Do not eat before the pūjā and the tāmbūlam are done.", tel: "పూజ, తాంబూలం పూర్తయ్యేవరకు భోజనం చేయరాదు." },
        { roman: "Do not use a cracked or chipped kalaśa.", tel: "పగిలిన లేదా చిట్లిన కలశం వాడరాదు." },
        { roman: "Do not dismantle the kalaśa the same day — keep it at least till the next morning.", tel: "కలశాన్ని అదే రోజు తీసేయరాదు — కనీసం మరుసటి ఉదయం వరకు ఉంచాలి." },
      ],
      source: { roman: "Follows Telugu smārta household practice; Tamil and Kannada families differ in the toraṃ and the kathā read.", tel: "తెలుగు స్మార్త గృహాచారం ప్రకారం; తమిళ, కన్నడ కుటుంబాలలో తోరం, కథ భిన్నంగా ఉంటాయి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "satyanarayana", deity: "vishnu", kind: "vratam", optional: true,
      name: { roman: "Satyanārāyaṇa Vratam", deva: "सत्यनारायण व्रतम्", tel: "సత్యనారాయణ వ్రతం" },
      rule: { roman: "Any Pūrṇimā — Kārtika and Vaiśākha most favoured", deva: "किसी भी पूर्णिमा को", tel: "ఏ పౌర్ణమి నాడైనా — కార్తిక, వైశాఖ శ్రేష్ఠం" },
      /* Any pūrṇimā, so the question is simply "when is the next one" — which
         the ephemeris answers directly, without scanning a solar month. */
      find: (y, m) => P().nextTithiFrom((typeof m === "number") ? new Date(y, m, 1) : new Date(), T.purnima, REF()),
      everyMonth: true,
      duration: { roman: "Half a day · forenoon to evening", tel: "అర్ధ దినం · పూర్వాహ్ణం నుండి సాయంత్రం" },
      tagline: { roman: "The vow to Viṣṇu as truth itself — kept on a wish fulfilled, a new home, a marriage.",
                 tel: "సత్యస్వరూపుడైన విష్ణువుకు వ్రతం — కోరిక తీరినప్పుడు, గృహప్రవేశానికి, వివాహానికి." },
      who: { roman: "Any householder, with the family present. No fast is required.", tel: "కుటుంబ సమేతంగా ఏ గృహస్థుడైనా. ఉపవాసం అవసరం లేదు." },
      significance: [
        { roman: "The most widely kept household vrata, precisely because it asks so little — no fast, no rare samagri, only truth and the kathā.", tel: "అత్యంత విస్తృతంగా ఆచరించే గృహ వ్రతం — ఉపవాసం లేదు, అరుదైన సామగ్రి లేదు, సత్యం, కథ మాత్రమే." },
        { roman: "Its kathā, from the Skanda Purāṇa, runs in five chapters, each showing the fruit of keeping — or forgetting — a vow once made.", tel: "స్కాంద పురాణంలోని కథ ఐదు అధ్యాయాలు — చేసిన వ్రతం నిలుపుకోవడం, మరచిపోవడం ఫలితాలు." },
        { roman: "The sapāda measure — one and a quarter of everything — is its signature: a little more than enough, never exact.", tel: "సపాద కొలత — ప్రతిదీ ఒకటిన్నర పావు — దీని ముద్ర: సరిపడా కన్నా కొంచెం ఎక్కువ, ఎప్పుడూ సరిగ్గా కాదు." },
      ],
      timeline: [
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Bathe, clean the pūjā place, take the saṅkalpa. Many keep a light fast until the pūjā.", tel: "స్నానం, పూజా స్థలం శుభ్రం, సంకల్పం. చాలామంది పూజ వరకు లఘు ఉపవాసం ఉంటారు." } },
        { t: { roman: "Evening pūjā", tel: "సాయంత్ర పూజ" }, d: { roman: "At dusk, invoke Satyanārāyaṇa on the kalaśa along with Gaṇeśa and the navagrahas.", tel: "సంధ్యవేళ కలశంపై గణేశుడు, నవగ్రహాలతో సహా సత్యనారాయణుని ఆవాహన." } },
        { t: { roman: "Kathā", tel: "కథ" }, d: { roman: "Read all five chapters aloud to the gathered family — no one should leave in between.", tel: "కుటుంబం అంతా వినేలా ఐదు అధ్యాయాలూ చదవాలి — మధ్యలో ఎవరూ లేవరాదు." } },
        { t: { roman: "Conclusion", tel: "ముగింపు" }, d: { roman: "Offer the sapāda-bhakṣya, do the ārati, distribute prasāda — none should leave without it.", tel: "సపాద భక్ష్యం సమర్పించి, హారతి ఇచ్చి, ప్రసాదం పంచాలి — ప్రసాదం లేకుండా ఎవరూ వెళ్ళరాదు." } },
      ],
      samagri: [
        { roman: "Image of Satyanārāyaṇa and a kalaśa", tel: "సత్యనారాయణ పటం, కలశం" },
        { roman: "Banana stalks and leaves to frame the maṇḍapa", tel: "మండపానికి అరటి బోదెలు, ఆకులు" },
        { roman: "Sapāda (1¼) measure of rava, sugar, ghee, banana and milk", tel: "సపాద (ఒకటిన్నర పావు) కొలత — రవ్వ, పంచదార, నెయ్యి, అరటిపండ్లు, పాలు" },
        { roman: "Tulasī leaves — essential, and never omitted for Viṣṇu", tel: "తులసి దళాలు — విష్ణువుకు తప్పనిసరి" },
        { roman: "Pañcāmṛta: milk, curd, ghee, honey, sugar", tel: "పంచామృతం: పాలు, పెరుగు, నెయ్యి, తేనె, పంచదార" },
        { roman: "Betel leaves and nuts, coconut, fruit, flowers", tel: "తమలపాకులు, వక్కలు, కొబ్బరికాయ, పండ్లు, పూలు" },
        { roman: "Dhūpa, dīpa, camphor; the Kathā in five chapters", tel: "ధూపం, దీపం, కర్పూరం; ఐదు అధ్యాయాల కథ" },
      ],
      vidhi: [
        { step: { roman: "Saṅkalpa", tel: "సంకల్పం" }, detail: { roman: "State the day, the deity, and the wish or the thanksgiving for which the vrata is kept.", tel: "రోజు, దేవత, ఏ కోరిక లేదా కృతజ్ఞత కోసం వ్రతమో చెప్పుకోవాలి." } },
        { step: { roman: "Gaṇeśa & Navagraha", tel: "గణేశ, నవగ్రహ పూజ" }, detail: { roman: "Worship Gaṇeśa first, then the nine grahas, for an unobstructed rite.", tel: "ముందు గణేశుని, తరువాత నవగ్రహాలను పూజించాలి." } },
        { step: { roman: "Āvāhana & ṣoḍaśopacāra", tel: "ఆవాహన, షోడశోపచారం" }, detail: { roman: "Invoke Satyanārāyaṇa on the kalaśa; offer the sixteen services, tulasī with each.", tel: "కలశంపై సత్యనారాయణుని ఆవాహన; ప్రతి ఉపచారంతో తులసితో పదహారు సేవలు." } },
        { step: { roman: "Kathā śravaṇa", tel: "కథా శ్రవణం" }, detail: { roman: "Read the five chapters aloud; all present should listen from beginning to end.", tel: "ఐదు అధ్యాయాలు చదవాలి; అందరూ మొదటి నుండి చివరి వరకు వినాలి." } },
        { step: { roman: "Sapāda naivedya", tel: "సపాద నైవేద్యం" }, detail: { roman: "Offer the one-and-a-quarter measure of the rava-jaggery prasāda.", tel: "రవ్వ-బెల్లం ప్రసాదాన్ని సపాద కొలతలో సమర్పించాలి." } },
        { step: { roman: "Ārati & prasāda", tel: "హారతి, ప్రసాదం" }, detail: { roman: "Conclude with ārati; distribute prasāda to everyone, including those passing by.", tel: "హారతితో ముగించి, వచ్చినవారందరికీ ప్రసాదం పంచాలి." } },
      ],
      naivedya: [
        { item: { roman: "Sapāda-bhakṣya", tel: "సపాద భక్ష్యం" }, note: { roman: "Rava, sugar, ghee, banana and milk, each in the one-and-a-quarter measure.", tel: "రవ్వ, పంచదార, నెయ్యి, అరటిపండు, పాలు — ప్రతిదీ సపాద కొలతలో." } },
        { item: { roman: "Pañcāmṛta", tel: "పంచామృతం" }, note: { roman: "With tulasī set on top before offering.", tel: "సమర్పించే ముందు పైన తులసి ఉంచాలి." } },
        { item: { roman: "Fruit and betel", tel: "పండ్లు, తాంబూలం" }, note: { roman: "Banana especially — it is in the sapāda list.", tel: "ముఖ్యంగా అరటిపండు — సపాద జాబితాలో ఉంది." } },
      ],
      stotras: [{ deity: "vishnu", m: "sahasranama" }, { deity: "vishnu", m: "madhurastakam" }, { deity: "vishnu", m: "astottara" }],
      dos: [
        { roman: "Speak only truth on the day of the vow — the deity is truth, and the vrata is named for it.", tel: "వ్రతం రోజున సత్యమే పలకాలి — దేవుడే సత్యం, వ్రతానికి ఆ పేరే." },
        { roman: "Read all five chapters; stopping short is the very fault the kathā warns of.", tel: "ఐదు అధ్యాయాలూ చదవాలి; మధ్యలో ఆపడమే కథ హెచ్చరించే దోషం." },
        { roman: "Give prasāda to everyone present, and to anyone who arrives after.", tel: "వచ్చినవారందరికీ, తరువాత వచ్చినవారికీ ప్రసాదం ఇవ్వాలి." },
      ],
      donts: [
        { roman: "Do not omit tulasī — no offering to Viṣṇu is complete without it.", tel: "తులసి విడిచిపెట్టరాదు — విష్ణువుకు తులసి లేని నైవేద్యం పూర్తికాదు." },
        { roman: "Do not refuse or discard the prasāda; the kathā turns on exactly that.", tel: "ప్రసాదాన్ని నిరాకరించరాదు, పారవేయరాదు; కథ అంతా దానిపైనే." },
        { roman: "Do not promise the vrata and then postpone it indefinitely.", tel: "వ్రతం చేస్తానని మాటిచ్చి నిరవధికంగా వాయిదా వేయరాదు." },
      ],
      source: { roman: "Skanda Purāṇa, Revā Khaṇḍa; the sapāda measure and the evening hour follow common household practice.", tel: "స్కాంద పురాణం, రేవా ఖండం; సపాద కొలత, సాయంత్ర సమయం సాధారణ గృహాచారం." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "navaratri", deity: "devi",
      name: { roman: "Śāradīya Navarātri", deva: "शारदीय नवरात्रि", tel: "శారదీయ నవరాత్రి" },
      rule: { roman: "Āśvayuja · Śukla Pratipadā to Navamī", deva: "आश्विन शुक्ल प्रतिपदा से नवमी", tel: "ఆశ్వయుజ శుక్ల పాడ్యమి నుండి నవమి" },
      find: (y) => lunar(y, MASA.ashvina, T.pratipada),
      duration: { roman: "Nine nights, ten days with Vijayadaśamī", tel: "తొమ్మిది రాత్రులు, విజయదశమితో పది రోజులు" },
      tagline: { roman: "Nine nights to the Mother — Durgā, Lakṣmī and Sarasvatī, three nights each.",
                 tel: "అమ్మవారికి తొమ్మిది రాత్రులు — దుర్గ, లక్ష్మి, సరస్వతి, మూడేసి రాత్రులు." },
      who: { roman: "The household together; the golu/bommala koluvu is arranged by the women.", tel: "కుటుంబమంతా; బొమ్మల కొలువు స్త్రీలు అమరుస్తారు." },
      significance: [
        { roman: "The nine nights divide in three: Durgā to destroy what obstructs, Lakṣmī to establish what sustains, Sarasvatī to reveal what liberates.", tel: "తొమ్మిది రాత్రులు మూడుగా: అడ్డంకులు నశింపజేసే దుర్గ, పోషించే లక్ష్మి, జ్ఞానమిచ్చే సరస్వతి." },
        { roman: "Each day the goddess is dressed and named differently — the alaṅkāra calendar differs by temple and by family.", tel: "ప్రతిరోజు అమ్మవారికి వేరే అలంకారం, వేరే నామం — ఆలయాన్ని, కుటుంబాన్ని బట్టి మారుతుంది." },
        { roman: "Āyudha Pūjā on Mahānavamī honours tools and books; Vijayadaśamī is the day to begin anything.", tel: "మహానవమి నాడు ఆయుధ పూజ — పనిముట్లు, పుస్తకాలు; విజయదశమి ఏ పనైనా ప్రారంభించే రోజు." },
      ],
      timeline: [
        { t: { roman: "Before Pratipadā", tel: "పాడ్యమికి ముందు" }, d: { roman: "Clean the house, set up the golu steps, sow the navadhānya in a clay tray.", tel: "ఇల్లు శుభ్రం, కొలువు మెట్లు, మట్టి పళ్ళెంలో నవధాన్యాలు చల్లడం." } },
        { t: { roman: "Day 1", tel: "మొదటి రోజు" }, d: { roman: "Ghaṭasthāpana at the auspicious hour; light the akhaṇḍa dīpa to burn all nine nights.", tel: "శుభ ముహూర్తంలో ఘటస్థాపన; తొమ్మిది రాత్రులూ వెలిగే అఖండ దీపం." } },
        { t: { roman: "Days 1–9", tel: "1–9 రోజులు" }, d: { roman: "A different alaṅkāra and naivedya each day; kumārī pūjā and sumaṅgali invitations through the week.", tel: "ప్రతిరోజు వేరే అలంకారం, నైవేద్యం; కుమారీ పూజ, ముత్తైదువుల ఆహ్వానం." } },
        { t: { roman: "Day 9–10", tel: "9–10 రోజులు" }, d: { roman: "Āyudha Pūjā on Navamī, then Vijayadaśamī — Sarasvatī pūjā, the akṣarābhyāsa, and śamī pūjā at dusk.", tel: "నవమి నాడు ఆయుధ పూజ, తరువాత విజయదశమి — సరస్వతీ పూజ, అక్షరాభ్యాసం, సాయంత్రం శమీ పూజ." } },
      ],
      samagri: [
        { roman: "Kalaśa, mango leaves, coconut, new cloth for ghaṭasthāpana", tel: "ఘటస్థాపనకు కలశం, మామిడాకులు, కొబ్బరికాయ, కొత్త వస్త్రం" },
        { roman: "Clay tray and navadhānya to sow on day one", tel: "మొదటి రోజు చల్లడానికి మట్టి పళ్ళెం, నవధాన్యాలు" },
        { roman: "Akhaṇḍa dīpa vessel, ghee or sesame oil for nine nights", tel: "అఖండ దీప పాత్ర, తొమ్మిది రాత్రులకు నెయ్యి లేదా నువ్వుల నూనె" },
        { roman: "Nine sarees or cloth pieces for the daily alaṅkāra", tel: "రోజువారీ అలంకారానికి తొమ్మిది చీరలు లేదా వస్త్రాలు" },
        { roman: "Golu steps and the bommalu, if the household keeps them", tel: "కొలువు మెట్లు, బొమ్మలు — ఆచారం ఉన్న ఇళ్ళలో" },
        { roman: "Kumkum, turmeric, bangles and tāmbūlam for the sumaṅgalis", tel: "ముత్తైదువులకు కుంకుమ, పసుపు, గాజులు, తాంబూలం" },
        { roman: "Flowers daily — different for each alaṅkāra", tel: "ప్రతిరోజు పూలు — అలంకారాన్ని బట్టి వేరు" },
      ],
      vidhi: [
        { step: { roman: "Ghaṭasthāpana", tel: "ఘటస్థాపన" }, detail: { roman: "On Pratipadā morning, establish the kalaśa over the sown grain and light the akhaṇḍa dīpa.", tel: "పాడ్యమి ఉదయం, చల్లిన ధాన్యంపై కలశం స్థాపించి అఖండ దీపం వెలిగించాలి." } },
        { step: { roman: "Daily alaṅkāra", tel: "నిత్య అలంకారం" }, detail: { roman: "Dress the goddess in the day's form, offer that day's naivedya, and recite her name.", tel: "ఆ రోజు రూపంలో అమ్మవారిని అలంకరించి, ఆ నైవేద్యం సమర్పించి, నామం పఠించాలి." } },
        { step: { roman: "Pāṭha", tel: "పారాయణం" }, detail: { roman: "Devī Māhātmyam or Lalitā Sahasranāma daily; many read one chapter of the Saptaśatī a night.", tel: "ప్రతిరోజు దేవీ మాహాత్మ్యం లేదా లలితా సహస్రనామం; కొందరు రోజుకు ఒక సప్తశతి అధ్యాయం." } },
        { step: { roman: "Kumārī pūjā", tel: "కుమారీ పూజ" }, detail: { roman: "Worship young girls as the goddess — commonly on Aṣṭamī, in some families each day.", tel: "బాలికలను అమ్మవారిగా పూజించాలి — సాధారణంగా అష్టమి నాడు, కొన్ని ఇళ్ళలో ప్రతిరోజు." } },
        { step: { roman: "Āyudha pūjā", tel: "ఆయుధ పూజ" }, detail: { roman: "On Navamī, lay out tools, instruments and books; clean them, garland them, let them rest.", tel: "నవమి నాడు పనిముట్లు, వాద్యాలు, పుస్తకాలు శుభ్రం చేసి, పూలదండలు వేసి, విశ్రాంతినివ్వాలి." } },
        { step: { roman: "Vijayadaśamī", tel: "విజయదశమి" }, detail: { roman: "Sarasvatī pūjā and akṣarābhyāsa in the morning; śamī pūjā and the crossing at dusk.", tel: "ఉదయం సరస్వతీ పూజ, అక్షరాభ్యాసం; సాయంత్రం శమీ పూజ, సీమోల్లంఘనం." } },
      ],
      naivedya: [
        { item: { roman: "A different offering each day", tel: "ప్రతిరోజు వేరే నైవేద్యం" }, note: { roman: "Commonly pulihora, dadhyodanam, payasam, kesari, vada, chalimidi in turn.", tel: "సాధారణంగా పులిహోర, దద్ధ్యోదనం, పాయసం, కేసరి, గారె, చలిమిడి వరుసగా." } },
        { item: { roman: "Kadalī and jaggery", tel: "అరటిపండు, బెల్లం" }, note: { roman: "Offered every day without fail.", tel: "ప్రతిరోజు తప్పకుండా సమర్పణ." } },
        { item: { roman: "Sundal or guggillu", tel: "సుండల్ / గుగ్గిళ్ళు" }, note: { roman: "Soaked pulses, given to the sumaṅgalis with tāmbūlam.", tel: "నానబెట్టిన పప్పు ధాన్యాలు, ముత్తైదువులకు తాంబూలంతో." } },
      ],
      stotras: [{ deity: "devi", m: "mahisasuramardini" }, { deity: "devi", m: "lalita sahasra" }, { deity: "devi", m: "argala" }, { deity: "devi", m: "sarasvati" }],
      dos: [
        { roman: "Keep the akhaṇḍa dīpa burning unbroken for all nine nights — arrange the oil beforehand.", tel: "తొమ్మిది రాత్రులూ అఖండ దీపం ఆరకుండా ఉంచాలి — నూనె ముందే సిద్ధం చేసుకోవాలి." },
        { roman: "Water the sown navadhānya each morning; its sprouting is read as the vrata's fruit.", tel: "చల్లిన నవధాన్యాలకు ప్రతి ఉదయం నీరు పోయాలి; మొలక వ్రత ఫలంగా చూస్తారు." },
        { roman: "Invite girls and sumaṅgalis and send none away empty-handed.", tel: "బాలికలను, ముత్తైదువులను పిలిచి ఎవరినీ ఖాళీ చేతులతో పంపరాదు." },
      ],
      donts: [
        { roman: "Do not let the akhaṇḍa dīpa go out; if it does, relight it with an apology, not a fuss.", tel: "అఖండ దీపం ఆరిపోకూడదు; ఆరితే క్షమాపణ చెప్పి మళ్ళీ వెలిగించాలి." },
        { roman: "Do not begin the golu after Pratipadā, nor dismantle it before Daśamī.", tel: "పాడ్యమి తరువాత కొలువు మొదలుపెట్టరాదు, దశమికి ముందు తీసేయరాదు." },
        { roman: "Do not cut hair or nails, and avoid meat, through the nine days.", tel: "తొమ్మిది రోజులూ జుట్టు, గోళ్ళు కత్తిరించరాదు; మాంసాహారం వద్దు." },
      ],
      source: { roman: "Follows Telugu smārta practice. The alaṅkāra order differs sharply between Vijayawada, Mysore and Bengal — keep your family's.", tel: "తెలుగు స్మార్త ఆచారం. అలంకార క్రమం విజయవాడ, మైసూరు, బెంగాల్‌లలో చాలా భిన్నం — మీ కుటుంబ ఆచారమే పాటించండి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "mangala-gauri", deity: "devi", kind: "vratam",
      name: { roman: "Maṅgaḷa Gaurī Vratam", deva: "मङ्गल गौरी व्रतम्", tel: "మంగళ గౌరీ వ్రతం" },
      rule: { roman: "Every Tuesday of Śrāvaṇa", deva: "श्रावण के प्रत्येक मङ्गलवार", tel: "శ్రావణ మాసంలోని ప్రతి మంగళవారం" },
      /* recurs weekly inside the month, so the next Tuesday still standing
         in Śrāvaṇa is the answer — not next year's first one */
      weekly: 2,
      window: (y) => { const s = monthStart(y, MASA.shravana); const e = new Date(s); e.setDate(e.getDate() + 29); return [s, e]; },
      find: (y) => { const d = monthStart(y, MASA.shravana); if (!d) return null; while (d.getDay() !== 2) d.setDate(d.getDate() + 1); return d; },
      duration: { roman: "Forenoon, on each Tuesday of the month", tel: "మాసంలోని ప్రతి మంగళవారం పూర్వాహ్ణం" },
      tagline: { roman: "Gaurī on Tuesdays — kept by newly married women for the long life of the husband.",
                 tel: "మంగళవారాల గౌరి — నూతన వధువులు భర్త దీర్ఘాయువు కోసం చేసే వ్రతం." },
      who: { roman: "Newly married women, in the first five years of marriage, usually at the mother's house for the first.", tel: "వివాహమైన మొదటి ఐదు సంవత్సరాలలో నూతన వధువులు; మొదటిది సాధారణంగా పుట్టింటిలో." },
      significance: [
        { roman: "Kept on the Tuesdays of Śrāvaṇa for the husband's long life and the household's harmony, for five years from marriage.", tel: "వివాహం నుండి ఐదేళ్ళు, శ్రావణ మంగళవారాలలో భర్త ఆయుష్షు, ఇంటి సామరస్యం కోసం." },
        { roman: "Gaurī is worshipped in her unmarried form — the one who won Śiva by austerity, not by fortune.", tel: "గౌరిని కన్యారూపంలో పూజిస్తారు — తపస్సుతో శివుని పొందినది, అదృష్టంతో కాదు." },
        { roman: "In the fifth year the vrata is concluded with udyāpana and passed to another new bride.", tel: "ఐదవ సంవత్సరం ఉద్యాపనతో ముగించి, మరో నూతన వధువుకు అందిస్తారు." },
      ],
      timeline: [
        { t: { roman: "Monday evening", tel: "సోమవారం సాయంత్రం" }, d: { roman: "Gather flowers and the sixteen items; prepare the turmeric Gaurī.", tel: "పూలు, పదహారు వస్తువులు సిద్ధం; పసుపు గౌరిని చేయాలి." } },
        { t: { roman: "Tuesday, before sunrise", tel: "మంగళవారం సూర్యోదయానికి ముందు" }, d: { roman: "Bathe, wear the green bangles and a new sari, draw the muggu.", tel: "స్నానం, ఆకుపచ్చ గాజులు, కొత్త చీర, ముగ్గు." } },
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Install Gaurī, offer the ṣoḍaśa upacāra and the sixteen of each item; read the kathā.", tel: "గౌరీ ప్రతిష్ఠ, షోడశోపచారం, ప్రతిదీ పదహారు చొప్పున; కథ చదవాలి." } },
        { t: { roman: "Afterwards", tel: "తరువాత" }, d: { roman: "Give tāmbūlam and bangles to the sumaṅgalis, then break the fast.", tel: "ముత్తైదువులకు తాంబూలం, గాజులు ఇచ్చి, తరువాత ఉపవాసం విరమణ." } },
      ],
      samagri: [
        { roman: "Turmeric Gaurī, or a small silver/clay image", tel: "పసుపు గౌరి, లేదా చిన్న వెండి/మట్టి ప్రతిమ" },
        { roman: "Sixteen each of: betel leaves, nuts, fruit, wicks, bangles, blouse pieces", tel: "పదహారేసి: తమలపాకులు, వక్కలు, పండ్లు, వత్తులు, గాజులు, రవికె గుడ్డలు" },
        { roman: "Green bangles and a green sari, if kept traditionally", tel: "ఆకుపచ్చ గాజులు, ఆకుపచ్చ చీర — సంప్రదాయంగా" },
        { roman: "Rice-flour lamp — the vrata's mark. The number of wicks follows your family's practice, not one rule; see the dīpa step.", tel: "బియ్యప్పిండి దీపం — వ్రత చిహ్నం. వత్తుల సంఖ్య మీ కుటుంబ ఆచారం ప్రకారం; ఒకే నియమం లేదు — దీప విధి చూడండి." },
        { roman: "Turmeric, kumkum, akṣata, flowers, sandal", tel: "పసుపు, కుంకుమ, అక్షతలు, పూలు, గంధం" },
        { roman: "Tāmbūlam trays for the invited sumaṅgalis", tel: "పిలిచిన ముత్తైదువులకు తాంబూలం పళ్ళెములు" },
      ],
      vidhi: [
        { step: { roman: "Saṅkalpa", tel: "సంకల్పం" }, detail: { roman: "Take the vow naming the husband and the five-year term.", tel: "భర్త పేరు, ఐదేళ్ళ కాలం పేర్కొంటూ సంకల్పం." } },
        { step: { roman: "Gaṇeśa & Gaurī sthāpana", tel: "గణేశ, గౌరీ స్థాపన" }, detail: { roman: "Worship the turmeric Gaṇapati, then install Gaurī on rice on a wooden pīṭha.", tel: "పసుపు గణపతిని పూజించి, చెక్క పీఠంపై బియ్యంపై గౌరిని ప్రతిష్ఠించాలి." } },
        { step: { roman: "Ṣoḍaśopacāra", tel: "షోడశోపచారం" }, detail: { roman: "The sixteen services, and sixteen of each offering — the number governs this vrata.", tel: "పదహారు ఉపచారాలు, ప్రతి సమర్పణా పదహారు — ఈ వ్రతానికి ఆ సంఖ్యే ప్రమాణం." } },
        { step: { roman: "Dīpa", tel: "దీపం" }, detail: { roman: "Light the rice-flour lamp before the goddess. The wick count is a family matter and differs by sampradāya: some rise through the five years — five the first year, ten the second, and so on to twenty-five in the last; others light five every year, and others sixteen throughout. Ask your purohita, or keep the count your mother and grandmother kept.", tel: "అమ్మవారి ముందు బియ్యప్పిండి దీపం వెలిగించాలి. వత్తుల సంఖ్య సంప్రదాయాన్ని అనుసరించి మారుతుంది: కొందరు ఐదేళ్ళలో పెంచుతారు — మొదటి ఏడు ఐదు, రెండో ఏడు పది, అలా చివరి ఏడు ఇరవై ఐదు; కొందరు ప్రతి ఏడూ ఐదే; కొందరు అన్ని ఏళ్ళూ పదహారు. మీ పురోహితుని అడగండి, లేదా అమ్మ, అమ్మమ్మ ఏ సంఖ్య పాటించారో అదే పాటించండి." } },
        { step: { roman: "Kathā", tel: "కథ" }, detail: { roman: "Read the Maṅgaḷa Gaurī kathā of the merchant's son restored to life.", tel: "ప్రాణం తిరిగి పొందిన వర్తక పుత్రుని మంగళ గౌరీ కథ చదవాలి." } },
        { step: { roman: "Tāmbūlam", tel: "తాంబూలం" }, detail: { roman: "Give sixteen tāmbūlams to sumaṅgalis; the vrata is not complete without them.", tel: "ముత్తైదువులకు పదహారు తాంబూలాలు ఇవ్వాలి; అవి లేకుండా వ్రతం పూర్తికాదు." } },
      ],
      naivedya: [
        { item: { roman: "Pūrṇam / chalimidi", tel: "పూర్ణం / చలిమిడి" }, note: { roman: "Jaggery and rice flour, sixteen pieces.", tel: "బెల్లం, బియ్యపు పిండి, పదహారు ముక్కలు." } },
        { item: { roman: "Pulihora", tel: "పులిహోర" }, note: { roman: "Offered in a leaf, never a metal plate, in many families.", tel: "చాలా ఇళ్ళలో ఆకులో సమర్పణ, లోహపు పళ్ళెంలో కాదు." } },
        { item: { roman: "Sixteen fruit", tel: "పదహారు పండ్లు" }, note: { roman: "Distributed with the tāmbūlam afterwards.", tel: "తరువాత తాంబూలంతో పంపిణీ." } },
      ],
      stotras: [{ deity: "devi", m: "gauri" }, { deity: "devi", m: "lalita sahasra" }, { deity: "devi", m: "annapurna" }],
      dos: [
        { roman: "Keep the sixteen count exactly in the offerings — leaves, fruit, tāmbūlam. The lamp's wicks are the one number that follows the family rather than the rule.", tel: "సమర్పణలలో — తమలపాకులు, పండ్లు, తాంబూలం — పదహారు సంఖ్య కచ్చితంగా పాటించాలి. దీపపు వత్తుల సంఖ్య మాత్రం నియమం కాదు, కుటుంబ ఆచారం." },
        { roman: "Keep it on every Tuesday of Śrāvaṇa, not just one.", tel: "శ్రావణంలోని ప్రతి మంగళవారం చేయాలి, ఒక్కరోజు కాదు." },
        { roman: "Conclude with udyāpana in the fifth year.", tel: "ఐదవ సంవత్సరం ఉద్యాపనతో ముగించాలి." },
      ],
      donts: [
        { roman: "Do not keep it after the five years without the udyāpana done first.", tel: "ఉద్యాపన చేయకుండా ఐదేళ్ళ తరువాత కొనసాగించరాదు." },
        { roman: "Do not use a metal image where the family's custom is turmeric.", tel: "పసుపు ఆచారం ఉన్న కుటుంబంలో లోహ ప్రతిమ వాడరాదు." },
        { roman: "Do not eat before the tāmbūlam has been given.", tel: "తాంబూలం ఇచ్చేవరకు భోజనం చేయరాదు." },
      ],
      source: { roman: "Telugu and Marathi practice; the rice-flour lamp and the sixteen offerings are the common core, while the wick count and the udyāpana year differ from family to family — where they differ, the household's own line decides.", tel: "తెలుగు, మరాఠీ ఆచారం; బియ్యప్పిండి దీపం, పదహారు సమర్పణలు ఉమ్మడి మూలం. వత్తుల సంఖ్య, ఉద్యాపన సంవత్సరం కుటుంబానికి కుటుంబానికి మారుతాయి — అక్కడ ఇంటి ఆచారమే ప్రమాణం." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "naga-panchami", deity: "subrahmanya", kind: "vratam",
      name: { roman: "Nāga Pañcamī", deva: "नाग पञ्चमी", tel: "నాగ పంచమి" },
      rule: { roman: "Śrāvaṇa · Śukla Pañcamī", deva: "श्रावण शुक्ल पञ्चमी", tel: "శ్రావణ శుక్ల పంచమి" },
      find: (y) => lunar(y, MASA.shravana, T.panchami),
      duration: { roman: "Forenoon", tel: "పూర్వాహ్ణం" },
      tagline: { roman: "Five-hooded nāgas drawn in turmeric and sandal, worshipped where they are drawn.", tel: "పసుపు కలిపిన చందనంతో గీసిన అయిదు పడగల నాగులు — గీసిన చోటనే పూజ." },
      who: { roman: "The household; kept for protection from serpents and the family's health.", tel: "ఇల్లంతా; సర్పభయ నివారణ, ఇంటి ఆరోగ్యం కోసం." },
      samagri: [
        { roman: "Turmeric mixed with sandal paste, to draw the nāgas", tel: "నాగులను గీయడానికి పసుపు కలిపిన చందనం" },
        { roman: "Dūrvā grass, flowers, akṣatas", tel: "దూర్వాలు, పువ్వులు, అక్షతలు" },
        { roman: "Godhuma nūka (cracked wheat) for the naivedyam", tel: "నైవేద్యానికి గోధుమనూక" },
      ],
      vidhi: [
        { step: { roman: "Draw the nāgas", tel: "నాగులను గీయడం" }, detail: { roman: "On a wall, draw images of five-hooded nāgas with sandal paste mixed with turmeric.", tel: "పసుపు కలిపిన చందనంతో గోడపై అయిదు పడగలు కలిగిన నాగ చిత్రములు లిఖించాలి." } },
        { step: { roman: "Worship", tel: "పూజ" }, detail: { roman: "Offer dūrvā grass, flowers and akṣatas to the drawn nāgas.", tel: "గీసిన నాగులను దూర్వాలు, పువ్వులు, అక్షతలతో పూజించాలి." } },
        { step: { roman: "The nāga names", tel: "నాగ నామాలు" }, detail: { roman: "Recite: anantaṁ vāsukiṁ śeṣaṁ padmanābhaṁ ca kambalam, tathā karkoṭakaṁ nāma nāgam aśvaṁ tathāṣṭamam, dhṛtarāṣṭraṁ śaṅkhapālaṁ kāḷiyaṁ takṣakaṁ tathā.", tel: "'అనంతం వాసుకిం శేషం పద్మనాభం చ కంబళం, తథా కర్కోటకం నామ నాగమశ్వం తథాష్టమం, ధృతరాష్ట్రం శంఖపాలం కాళియం తక్షకం తథా' అని ప్రార్థించాలి." } },
        { step: { roman: "Naivedya", tel: "నైవేద్యం" }, detail: { roman: "Offer godhuma nūka as prasādam.", tel: "గోధుమనూక ప్రసాదమును నైవేద్యముగా పెట్టవలెను." } },
      ],
      naivedya: [
        { item: { roman: "Godhuma nūka", tel: "గోధుమనూక" }, note: { roman: "Cracked wheat, offered after the nāga names are recited.", tel: "నాగ నామాలు ప్రార్థించిన తరువాత సమర్పించేది." } },
      ],
      source: { roman: "Follows a widely kept Telugu household vidhi; the nāga image and its names vary slightly by family line.", tel: "తెలుగు గృహాలలో విస్తృతంగా పాటించే విధి; నాగ చిత్రం, నామాలు కుటుంబాన్ని బట్టి కొద్దిగా మారవచ్చు." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "shitala-saptami", deity: "devi", kind: "vratam",
      name: { roman: "Śītalā Saptamī", deva: "शीतला सप्तमी", tel: "శీతలా సప్తమి" },
      rule: { roman: "Śrāvaṇa · Śukla Saptamī", deva: "श्रावण शुक्ल सप्तमी", tel: "శ్రావణ శుక్ల సప్తమి" },
      find: (y) => lunar(y, MASA.shravana, 6),
      duration: { roman: "Forenoon", tel: "పూర్వాహ్ణం" },
      tagline: { roman: "Śītalā Devī, coolness itself — her aṣṭakam read, and what stays cool offered.", tel: "చల్లదనమే రూపమైన శీతలాదేవి — శీతలాష్టకం చదివి, చల్లని పదార్థాలు నివేదించడం." },
      who: { roman: "Kept for health; said to cool the body's three tāpas (afflictions).", tel: "ఆరోగ్యం కోసం చేసేది; త్రితాపములను చల్లార్చుతుందని విశ్వాసం." },
      naivedya: [
        { item: { roman: "Dosakāya (yellow cucumber)", tel: "దోసకాయ" }, note: { roman: "The cooling fruit of her naivedya.", tel: "శీతల నైవేద్యంలో భాగం." } },
        { item: { roman: "Dadhyodanam (curd rice)", tel: "దధ్యోదనం" }, note: { roman: "Offered cool, never heated.", tel: "చల్లగానే సమర్పించాలి, వేడి చేయరాదు." } },
      ],
      source: { roman: "Read the Śītalāṣṭakam before the naivedya is offered; a Telugu household observance for Śrāvaṇa Saptamī.", tel: "నైవేద్యం పెట్టే ముందు శీతలాష్టకము చదువుకోవాలి; శ్రావణ సప్తమి నాటి తెలుగు గృహాచారం." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "shravana-ravivaram", deity: "surya", kind: "vratam",
      name: { roman: "Śrāvaṇa Ravivāram", deva: "श्रावण रविवारम्", tel: "శ్రావణ ఆదివారం" },
      rule: { roman: "Every Sunday of Śrāvaṇa", deva: "श्रावण के प्रत्येक रविवार", tel: "శ్రావణ మాసంలోని ప్రతి ఆదివారం" },
      weekly: 0,
      window: (y) => { const s = monthStart(y, MASA.shravana); const e = new Date(s); e.setDate(e.getDate() + 29); return [s, e]; },
      find: (y) => { const d = monthStart(y, MASA.shravana); if (!d) return null; while (d.getDay() !== 0) d.setDate(d.getDate() + 1); return d; },
      duration: { roman: "Dawn to the forenoon arghya", tel: "ప్రాతఃకాలం నుండి పూర్వాహ్ణ అర్ఘ్యం వరకు" },
      tagline: { roman: "Sūrya drawn in red sandal on a betel leaf, and given arghya twelve times.", tel: "తమలపాకుపై ఎర్రచందనంతో గీసిన సూర్యుడు — పన్నెండు అర్ఘ్యాలు." },
      who: { roman: "The household; kept for health and the sun's grace.", tel: "ఇల్లంతా; ఆరోగ్యం, సూర్యానుగ్రహం కోసం." },
      samagri: [
        { roman: "A betel leaf and red sandal paste, to draw the sun's image", tel: "సూర్య బింబం గీయడానికి తమలపాకు, ఎర్రచందనం" },
        { roman: "Red flowers", tel: "ఎర్రని పువ్వులు" },
        { roman: "A ripe coconut and paṭikabellam (rock candy) for the naivedyam", tel: "నైవేద్యానికి ముదిరిన కొబ్బరికాయ, పటికబెల్లం" },
      ],
      vidhi: [
        { step: { roman: "Dawn bath", tel: "ప్రాతఃస్నానం" }, detail: { roman: "Rise early and bathe in cold water.", tel: "ప్రాతఃకాలంలో లేచి చన్నీటి స్నానం చేయాలి." } },
        { step: { roman: "Draw the Sun", tel: "సూర్య బింబం" }, detail: { roman: "On a betel leaf, draw Sūrya's image in red sandal paste.", tel: "తమలపాకుపై ఎర్రచందనంతో సూర్య బింబాన్ని లిఖించాలి." } },
        { step: { roman: "Ṣoḍaśopacāra", tel: "షోడశోపచారం" }, detail: { roman: "Worship Sūrya with the sixteen upacāras, together with Saṃjñā Devī.", tel: "సంజ్ఞాసహితంగా సూర్యుని షోడశోపచారములతో ఆరాధించాలి." } },
        { step: { roman: "Arghya", tel: "అర్ఘ్యం" }, detail: { roman: "Offer arghya twelve times with water mixed with red sandal and red flowers.", tel: "ఎర్రచందనము, ఎర్రని పువ్వులు కలిపిన నీటితో పన్నెండు మార్లు అర్ఘ్యమివ్వాలి." } },
        { step: { roman: "Naivedya", tel: "నైవేద్యం" }, detail: { roman: "Offer a ripe coconut and paṭikabellam.", tel: "ముదిరిన కొబ్బరికాయలు, పటికబెల్లం నివేదించాలి." } },
      ],
      stotras: [{ deity: "surya", m: "aditya hrdayam" }, { deity: "surya", m: "suryastakam" }, { deity: "surya", m: "surya suktam" }],
      source: { roman: "A widely kept Śrāvaṇa household practice for Sūrya; the names spoken at each arghya follow your family's own list.", tel: "శ్రావణంలో సూర్యునికి విస్తృతంగా పాటించే గృహాచారం; అర్ఘ్యంలో పలికే నామాలు మీ కుటుంబ ఆచారాన్ని అనుసరించాలి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "shravana-somavaram", deity: "shiva", kind: "vratam",
      name: { roman: "Śrāvaṇa Somavāram", deva: "श्रावण सोमवारम्", tel: "శ్రావణ సోమవారం" },
      rule: { roman: "Every Monday of Śrāvaṇa", deva: "श्रावण के प्रत्येक सोमवार", tel: "శ్రావణ మాసంలోని ప్రతి సోమవారం" },
      weekly: 1,
      window: (y) => { const s = monthStart(y, MASA.shravana); const e = new Date(s); e.setDate(e.getDate() + 29); return [s, e]; },
      find: (y) => { const d = monthStart(y, MASA.shravana); if (!d) return null; while (d.getDay() !== 1) d.setDate(d.getDate() + 1); return d; },
      duration: { roman: "A single evening meal — the nakta vrata", tel: "సాయంత్రం ఒంటిపూట భోజనం — నక్తవ్రతం" },
      tagline: { roman: "Every Somavāra vratam of the year, gathered into Śrāvaṇa's own.", tel: "సంవత్సరమంతటి సోమవార వ్రతాల ఫలం — శ్రావణంలోనే." },
      who: { roman: "Kept by Śiva's devotees; said to carry the merit of every month's Somavāra vratam at once.", tel: "శివభక్తులు చేస్తారు; అన్ని నెలల సోమవార వ్రతాల ఫలితాన్నిస్తుందని చెబుతారు." },
      significance: [
        { roman: "Even one who could not keep every Monday vrata across the twelve months may keep only Śrāvaṇa's for Śiva's pleasure, and it is said to carry the merit of all of them.", tel: "పన్నెండు నెలలలో వచ్చే సోమవార వ్రతములన్నీ చేయలేకపోయినా, ఈ మాసంలో వచ్చే సోమవార వ్రతాలను శివప్రీతిగా ఆచరించడంవలన అన్ని నెలలలో చేసిన ఫలితం పొందవచ్చు." },
      ],
      vidhi: [
        { step: { roman: "Nakta vrata", tel: "నక్తవ్రతం" }, detail: { roman: "Keep a single meal, taken in the evening.", tel: "నక్తవ్రతం ఆచరించి సాయంత్రం ఒంటిపూట భోజనం చేయాలి." } },
        { step: { roman: "Ṣoḍaśopacāra", tel: "షోడశోపచారం" }, detail: { roman: "Worship Śiva with the sixteen upacāras.", tel: "శివుని షోడశోపచారములతో పూజించాలి." } },
        { step: { roman: "Stotra & kathā", tel: "స్తోత్రం, కథ" }, detail: { roman: "Recite Śiva's stotras, then read or listen to his stories.", tel: "స్తోత్రాదులు చేసి శివుని కథలను చదువవలెను లేదా వినవలెను." } },
        { step: { roman: "The names", tel: "నామాలు" }, detail: { roman: "Chant: Śarvāya Bhavanāśāya Mahādevāya dhīmahi, Ugrāya ca Ugranāthāya Bhavāya Śaśimauline, Rudrāya Nīlakaṇṭhāya Śivāya Bhavahāriṇe.", tel: "'శర్వాయ భవనాశాయ మహాదేవాయ ధీమహి, ఉగ్రాయ చ ఉగ్రనాథాయ భవాయ శశిమౌళినే, రుద్రాయ నీలకంఠాయ శివాయ భవహారిణే' అనే నామాలను జపించాలి." } },
      ],
      stotras: [{ deity: "shiva", m: "mahamrtyu" }, { deity: "shiva", m: "rudram" }],
      source: { roman: "A common Śrāvaṇa household practice for Śiva; some keep the nakta vrata strictly, others simply take grain only in the evening — follow your family's line.", tel: "శివునికి శ్రావణంలో పాటించే సాధారణ గృహాచారం; కొందరు నక్తవ్రతం కచ్చితంగా పాటిస్తారు, కొందరు సాయంత్రం వరకు మాత్రమే ధాన్యం తీసుకుంటారు — మీ కుటుంబ ఆచారాన్నే పాటించండి." },
    },

    /* ---------------------------------------------------------- */
    {
      id: "vata-savitri", deity: "devi", kind: "vratam",
      name: { roman: "Vaṭa Sāvitrī Vratam", deva: "वट सावित्री व्रतम्", tel: "వట సావిత్రీ వ్రతం" },
      rule:  { roman: "Vaiśākha · Amāvāsyā", deva: "वैशाख अमावस्या", tel: "వైశాఖ అమావాస్య" },
      ruleP: { roman: "Jyeṣṭha · Amāvāsyā",  deva: "ज्येष्ठ अमावस्या", tel: "జ్యేష్ఠ అమావాస్య" },
      find: (y) => lunar(y, MASA.vaisakha, T.amavasya),
      duration: { roman: "One day · fast from dawn", tel: "ఒక రోజు · తెల్లవారుజాము నుండి ఉపవాసం" },
      tagline: { roman: "Sāvitrī, who followed Yama and argued her husband back from death — kept beneath the banyan.",
                 tel: "యముని వెంబడించి భర్తను తిరిగి తెచ్చుకున్న సావిత్రి — మర్రిచెట్టు కింద చేసే వ్రతం." },
      who: { roman: "Married women, for the husband's long life. Kept as Karadaiyan Nombu in Tamil families, at a different reckoning.", tel: "వివాహిత స్త్రీలు, భర్త దీర్ఘాయువు కోసం. తమిళ కుటుంబాలలో కారడైయాన్ నోంబుగా, వేరే లెక్కన." },
      significance: [
        { roman: "Sāvitrī followed Yama for three days as he carried Satyavān's life away, and out-argued him for it — the vrata remembers the argument, not the grief.", tel: "సత్యవంతుని ప్రాణాలు తీసుకుపోతున్న యముని మూడు రోజులు వెంబడించి, వాదించి గెలిచిన సావిత్రి — వ్రతం దుఃఖాన్ని కాదు, ఆ వాదాన్ని స్మరిస్తుంది." },
        { roman: "The banyan is central because Satyavān's life returned to him beneath one; its aerial roots stand for continuity.", tel: "సత్యవంతునికి మర్రిచెట్టు కిందే ప్రాణం తిరిగి వచ్చింది; దాని ఊడలు నిరంతరతకు సంకేతం." },
        { roman: "The thread wound around the trunk — seven or a hundred and eight turns — binds the vow to the tree's long life.", tel: "మొద్దు చుట్టూ చుట్టే దారం — ఏడు లేదా నూట ఎనిమిది చుట్లు — వ్రతాన్ని చెట్టు దీర్ఘాయువుతో ముడిపెడుతుంది." },
      ],
      timeline: [
        { t: { roman: "The day before", tel: "ముందు రోజు" }, d: { roman: "Take a light single meal; gather the thread, fruit and the fan.", tel: "ఒక్కపూట లఘు ఆహారం; దారం, పండ్లు, విసనకర్ర సిద్ధం." } },
        { t: { roman: "Dawn", tel: "తెల్లవారుజాము" }, d: { roman: "Bathe, wear sumaṅgali marks, and begin the fast — many keep it without water.", tel: "స్నానం, సుమంగళి చిహ్నాలు, ఉపవాస ప్రారంభం — చాలామంది నిర్జల ఉపవాసం." } },
        { t: { roman: "Forenoon", tel: "పూర్వాహ్ణం" }, d: { roman: "Go to a banyan; water its root, offer, circumambulate and wind the thread.", tel: "మర్రిచెట్టు వద్దకు వెళ్ళి, వేరుకు నీరు పోసి, సమర్పించి, ప్రదక్షిణ చేసి దారం చుట్టాలి." } },
        { t: { roman: "Evening", tel: "సాయంత్రం" }, d: { roman: "Read the Sāvitrī–Satyavān story, give tāmbūlam, then break the fast.", tel: "సావిత్రీ-సత్యవంతుల కథ చదివి, తాంబూలం ఇచ్చి, ఉపవాసం విరమించాలి." } },
      ],
      samagri: [
        { roman: "Raw cotton thread or yellow thread to wind the banyan", tel: "మర్రిచెట్టుకు చుట్టడానికి పత్తి దారం లేదా పసుపు దారం" },
        { roman: "A hand fan (viśanakarra) — Sāvitrī fanned Satyavān", tel: "విసనకర్ర — సావిత్రి సత్యవంతునికి విసిరింది" },
        { roman: "Water pot, to water the tree's root", tel: "చెట్టు వేరుకు నీరు పోయడానికి కలశం" },
        { roman: "Banyan leaf, mango, jackfruit, banana — seasonal fruit", tel: "మర్రి ఆకు, మామిడి, పనస, అరటి — కాలానుగుణ పండ్లు" },
        { roman: "Turmeric, kumkum, akṣata, flowers, sindūra", tel: "పసుపు, కుంకుమ, అక్షతలు, పూలు, సిందూరం" },
        { roman: "Soaked chana and jaggery for the offering", tel: "సమర్పణకు నానబెట్టిన శనగలు, బెల్లం" },
      ],
      vidhi: [
        { step: { roman: "Saṅkalpa & fast", tel: "సంకల్పం, ఉపవాసం" }, detail: { roman: "At dawn, vow the fast for the husband's long life.", tel: "తెల్లవారుజామున భర్త దీర్ఘాయువు కోసం ఉపవాస సంకల్పం." } },
        { step: { roman: "At the banyan", tel: "మర్రిచెట్టు వద్ద" }, detail: { roman: "Water the root, apply turmeric and kumkum to the trunk, and offer flowers.", tel: "వేరుకు నీరు పోసి, మొద్దుకు పసుపు కుంకుమ పెట్టి, పూలు సమర్పించాలి." } },
        { step: { roman: "Sūtra veṣṭana", tel: "సూత్ర వేష్టనం" }, detail: { roman: "Circumambulate the tree winding the thread — seven, or a hundred and eight, turns.", tel: "దారం చుడుతూ చెట్టుకు ప్రదక్షిణ — ఏడు, లేదా నూట ఎనిమిది చుట్లు." } },
        { step: { roman: "Vījana", tel: "వీజనం" }, detail: { roman: "Fan the tree with the hand fan, as Sāvitrī fanned her husband.", tel: "సావిత్రి భర్తకు విసిరినట్లు చెట్టుకు విసనకర్రతో విసరాలి." } },
        { step: { roman: "Kathā", tel: "కథ" }, detail: { roman: "Read the Sāvitrī–Satyavān episode from the Mahābhārata's Vana Parva.", tel: "మహాభారత వన పర్వంలోని సావిత్రీ-సత్యవంతుల ఘట్టం చదవాలి." } },
        { step: { roman: "Dāna & pāraṇa", tel: "దానం, పారణ" }, detail: { roman: "Give fruit and tāmbūlam to sumaṅgalis, then break the fast.", tel: "ముత్తైదువులకు పండ్లు, తాంబూలం ఇచ్చి, ఉపవాసం విరమించాలి." } },
      ],
      naivedya: [
        { item: { roman: "Soaked chana with jaggery", tel: "నానబెట్టిన శనగలు, బెల్లం" }, note: { roman: "The standard offering at the tree.", tel: "చెట్టు వద్ద సాధారణ సమర్పణ." } },
        { item: { roman: "Seasonal fruit", tel: "కాలానుగుణ పండ్లు" }, note: { roman: "Mango and jackfruit especially — it is Jyeṣṭha.", tel: "ముఖ్యంగా మామిడి, పనస — జ్యేష్ఠ మాసం కదా." } },
        { item: { roman: "Rice with jaggery", tel: "బెల్లం అన్నం" }, note: { roman: "Offered at home before the fast is broken.", tel: "ఉపవాసం విరమించే ముందు ఇంట్లో సమర్పణ." } },
      ],
      stotras: [{ deity: "devi", m: "lalita sahasra" }, { deity: "devi", m: "gauri" }, { deity: "shiva", m: "mrtyunjaya" }],
      dos: [
        { roman: "Choose a living, unpruned banyan; water its root before anything else.", tel: "బతికి ఉన్న, కత్తిరించని మర్రిచెట్టు ఎంచుకోవాలి; అన్నిటికన్నా ముందు వేరుకు నీరు పోయాలి." },
        { roman: "Keep the thread's turns to the number you vowed — seven or a hundred and eight.", tel: "సంకల్పించిన సంఖ్య చుట్లే చుట్టాలి — ఏడు లేదా నూట ఎనిమిది." },
        { roman: "Break the fast only after the tāmbūlam is given.", tel: "తాంబూలం ఇచ్చిన తరువాతే ఉపవాసం విరమించాలి." },
      ],
      donts: [
        { roman: "Do not break a branch or a leaf from the tree you are worshipping.", tel: "పూజిస్తున్న చెట్టు కొమ్మను, ఆకును తుంచరాదు." },
        { roman: "Do not leave plastic thread on the trunk — use cotton, which rots away.", tel: "మొద్దుపై ప్లాస్టిక్ దారం వదలరాదు — కుళ్ళిపోయే పత్తి దారం వాడాలి." },
        { roman: "Do not keep the fast if unwell; the vrata bends, the body does not.", tel: "అనారోగ్యంగా ఉంటే ఉపవాసం వద్దు; వ్రతం సర్దుకుంటుంది, శరీరం కాదు." },
      ],
      source: { roman: "Mahābhārata, Vana Parva. Kept on Amāvāsyā in the Deccan and on Pūrṇimā in the north — both are traditional.", tel: "మహాభారతం, వన పర్వం. దక్కన్‌లో అమావాస్య, ఉత్తరాదిలో పౌర్ణమి — రెండూ సంప్రదాయమే." },
    },

    /* ------------------------------------------------------------------
       Carried over with their rule, their reason and their texts. The
       guide view renders only the sections a vrata actually has, so these
       stand as short entries until samagri and vidhi are written for them.
       ------------------------------------------------------------------ */
    {
      id: "shivaratri", deity: "shiva", brief: true, kind: "vratam",
      name: { roman: "Mahā Śivarātri", deva: "महा शिवरात्रि", tel: "మహా శివరాత్రి" },
      rule:  { roman: "Māgha · Kṛṣṇa Caturdaśī",    deva: "माघ कृष्ण चतुर्दशी",     tel: "మాఘ కృష్ణ చతుర్దశి" },
      ruleP: { roman: "Phālguna · Kṛṣṇa Caturdaśī", deva: "फाल्गुन कृष्ण चतुर्दशी", tel: "ఫాల్గుణ కృష్ణ చతుర్దశి" },
      find: (y) => lunar(y, MASA.magha, 28, "nishitha"),
      duration: { roman: "Night-long · four praharas", tel: "రాత్రంతా · నాలుగు ప్రహరాలు" },
      who: { roman: "Kept by all; the vigil is the vrata.", tel: "అందరూ చేస్తారు; జాగరణమే వ్రతం." },
      tagline: { roman: "The great night of Śiva — vigil, fasting, and the rudrābhiṣeka.", tel: "శివుని మహారాత్రి — జాగరణ, ఉపవాసం, రుద్రాభిషేకం." },
      stotras: [{ deity: "shiva", m: "tandava" }, { deity: "shiva", m: "lingastakam" }, { deity: "shiva", m: "bilvastakam" }, { deity: "shiva", m: "rudram" }, { deity: "shiva", m: "mahamrtyu" }],
    },
    {
      id: "ekadashi", deity: "vishnu", brief: true, everyMonth: true, kind: "vratam",
      name: { roman: "Ekādaśī Vratam", deva: "एकादशी व्रतम्", tel: "ఏకాదశి వ్రతం" },
      rule: { roman: "The eleventh tithi of each fortnight", deva: "प्रत्येक पक्ष की एकादशी", tel: "ప్రతి పక్షపు ఏకాదశి" },
      /* Two ekādaśīs a month, a fortnight apart; whichever comes first is the
         answer, and the Vaiṣṇava viddha rule may then move it on a day. */
      find: (y, m) => {
        const from = (typeof m === "number") ? new Date(y, m, 1) : new Date();
        const a = P().nextTithiFrom(from, T.ekadashi, REF());
        const b = P().nextTithiFrom(from, T.kEkadashi, REF());
        if (!a && !b) return null;
        if (!a) return governed(b, T.kEkadashi, "viddha");
        if (!b) return governed(a, T.ekadashi, "viddha");
        return a <= b ? governed(a, T.ekadashi, "viddha") : governed(b, T.kEkadashi, "viddha");
      },
      duration: { roman: "Sunrise to the next sunrise", tel: "సూర్యోదయం నుండి మరుసటి సూర్యోదయం వరకు" },
      who: { roman: "Vaiṣṇavas above all, but kept widely; not by children or the unwell.", tel: "ముఖ్యంగా వైష్ణవులు, కానీ విస్తృతంగా; పిల్లలు, అనారోగ్యులు కాదు." },
      tagline: { roman: "The fortnightly fast to Viṣṇu — no grain, and the night kept awake.", tel: "విష్ణువుకు పక్ష ఉపవాసం — ధాన్యం లేదు, రాత్రి జాగరణ." },
      stotras: [{ deity: "vishnu", m: "sahasranama" }, { deity: "vishnu", m: "bhaja govindam" }],
    },
    {
      id: "pradosha", deity: "shiva", brief: true, everyMonth: true, kind: "vratam",
      name: { roman: "Pradoṣa Vratam", deva: "प्रदोष व्रतम्", tel: "ప్రదోష వ్రతం" },
      rule: { roman: "Trayodaśī, at twilight, each fortnight", deva: "प्रत्येक पक्ष की त्रयोदशी सन्ध्या", tel: "ప్రతి పక్షపు త్రయోదశి సంధ్య" },
      /* Trayodaśī of either fortnight — and kept at its TWILIGHT, not its
         sunrise, so the day is the one whose sunset the tithi covers. Taking
         the sunrise day put it a day early whenever trayodaśī began during
         the morning. */
      find: (y, m) => {
        const from = (typeof m === "number") ? new Date(y, m, 1) : new Date();
        const a = P().nextTithiFrom(from, 12, REF());
        const b = P().nextTithiFrom(from, T.kTrayodashi, REF());
        if (!a && !b) return null;
        if (!a) return governed(b, T.kTrayodashi, "pradosha");
        if (!b) return governed(a, 12, "pradosha");
        return a <= b ? governed(a, 12, "pradosha") : governed(b, T.kTrayodashi, "pradosha");
      },
      duration: { roman: "The pradoṣa hour — roughly 1½ hours around sunset", tel: "ప్రదోష కాలం — సూర్యాస్తమయం చుట్టూ సుమారు గంటన్నర" },
      who: { roman: "Kept by Śaivas; Śani Pradoṣa (Saturday) is held most potent.", tel: "శైవులు చేస్తారు; శని ప్రదోషం (శనివారం) అత్యంత శ్రేష్ఠం." },
      tagline: { roman: "Śiva in the twilight of the thirteenth tithi — an evening abhiṣeka.", tel: "త్రయోదశి సంధ్యలో శివుడు — సాయం అభిషేకం." },
      stotras: [{ deity: "shiva", m: "lingastakam" }, { deity: "shiva", m: "pancaksara" }],
    },
    {
      id: "dipavali", deity: "devi", brief: true,
      name: { roman: "Dīpāvalī · Lakṣmī Pūjā", deva: "दीपावली · लक्ष्मी पूजा", tel: "దీపావళి · లక్ష్మీ పూజ" },
      rule:  { roman: "Āśvayuja · Amāvāsyā",  deva: "आश्विन अमावस्या",  tel: "ఆశ్వయుజ అమావాస్య" },
      ruleP: { roman: "Kārtika · Amāvāsyā", deva: "कार्तिक अमावस्या", tel: "కార్తిక అమావాస్య" },
      find: (y) => lunar(y, MASA.ashvina, T.amavasya, "pradosha"),
      duration: { roman: "Evening, at pradoṣa", tel: "సాయంత్రం, ప్రదోష వేళ" },
      who: { roman: "The whole household; the lamps are lit by everyone.", tel: "ఇల్లంతా; దీపాలు అందరూ వెలిగిస్తారు." },
      tagline: { roman: "The festival of lights — Lakṣmī enters the swept and lamp-lit home.", tel: "దీపాల పండుగ — శుభ్రమైన, దీపాలంకృత గృహంలోకి లక్ష్మి రాక." },
      stotras: [{ deity: "devi", m: "kanakadhara" }, { deity: "devi", m: "sri suktam" }, { deity: "devi", m: "mahalaksmi" }, { deity: "devi", m: "laksmi astottara" }],
    },
    {
      id: "rama-navami", deity: "vishnu", brief: true,
      name: { roman: "Śrī Rāma Navamī", deva: "श्री राम नवमी", tel: "శ్రీ రామ నవమి" },
      rule: { roman: "Caitra · Śukla Navamī", deva: "चैत्र शुक्ल नवमी", tel: "చైత్ర శుక్ల నవమి" },
      find: (y) => lunar(y, MASA.caitra, 8),
      duration: { roman: "Noon — the hour of the birth", tel: "మధ్యాహ్నం — జన్మ ఘడియ" },
      who: { roman: "The household, often with a kalyāṇam in the evening.", tel: "కుటుంబం, సాయంత్రం కల్యాణంతో." },
      tagline: { roman: "The birth of Rāma at noon — the Rāma Rakṣā and the thousand names.", tel: "మధ్యాహ్నం రాముని జననం — రామరక్ష, సహస్రనామం." },
      stotras: [{ deity: "vishnu", m: "rama raksa" }, { deity: "vishnu", m: "nama ramayanam" }, { deity: "vishnu", m: "rama pancaratna" }],
    },
    {
      id: "janmashtami", deity: "vishnu", brief: true, kind: "vratam",
      name: { roman: "Kṛṣṇa Janmāṣṭamī", deva: "कृष्ण जन्माष्टमी", tel: "కృష్ణ జన్మాష్టమి" },
      rule:  { roman: "Śrāvaṇa · Kṛṣṇa Aṣṭamī",    deva: "श्रावण कृष्ण अष्टमी",    tel: "శ్రావణ కృష్ణ అష్టమి" },
      ruleP: { roman: "Bhādrapada · Kṛṣṇa Aṣṭamī", deva: "भाद्रपद कृष्ण अष्टमी", tel: "భాద్రపద కృష్ణ అష్టమి" },
      find: (y) => lunar(y, MASA.shravana, 22, "janmashtami"),
      duration: { roman: "Until midnight — the hour of the birth", tel: "అర్ధరాత్రి వరకు — జన్మ ఘడియ" },
      who: { roman: "The household; children draw the little footprints to the cradle.", tel: "కుటుంబం; పిల్లలు ఊయల వరకు చిన్ని పాదాలు వేస్తారు." },
      tagline: { roman: "The midnight birth of Kṛṣṇa — vigil, fasting, and song.", tel: "అర్ధరాత్రి కృష్ణ జననం — జాగరణ, ఉపవాసం, సంకీర్తనం." },
      stotras: [{ deity: "vishnu", m: "madhura" }, { deity: "vishnu", m: "krsnastakam" }, { deity: "vishnu", m: "karnamrta" }],
    },
    {
      id: "hanuman-jayanti", deity: "hanuman", brief: true,
      name: { roman: "Hanumān Jayantī", deva: "हनुमान् जयन्ती", tel: "హనుమాన్ జయంతి" },
      rule: { roman: "Caitra Pūrṇimā in the north; Vaiśākha Kṛṣṇa Daśamī in the Deccan", deva: "उत्तर में चैत्र पूर्णिमा; दक्षिण में वैशाख कृष्ण दशमी", tel: "ఉత్తరాదిలో చైత్ర పౌర్ణమి; దక్కన్‌లో వైశాఖ కృష్ణ దశమి" },
      find: (y) => lunar(y, MASA.caitra, T.purnima),
      duration: { roman: "One day", tel: "ఒక రోజు" },
      who: { roman: "Kept by all; especially those under Śani's period.", tel: "అందరూ; ముఖ్యంగా శని దశలో ఉన్నవారు." },
      tagline: { roman: "The birth of Hanumān — the Cālīsā and Saṅkaṭamocana are read.", tel: "హనుమాన్ జననం — చాలీసా, సంకటమోచన పారాయణం." },
      stotras: [{ deity: "hanuman", m: "calisa" }, { deity: "hanuman", m: "sankatamocana" }, { deity: "hanuman", m: "bajaranga" }],
    },
    {
      id: "guru-purnima", deity: "guru", brief: true,
      name: { roman: "Guru Pūrṇimā", deva: "गुरु पूर्णिमा", tel: "గురు పూర్ణిమ" },
      rule: { roman: "Āṣāḍha · Pūrṇimā", deva: "आषाढ पूर्णिमा", tel: "ఆషాఢ పౌర్ణమి" },
      find: (y) => lunar(y, MASA.ashadha, T.purnima),
      duration: { roman: "Forenoon", tel: "పూర్వాహ్ణం" },
      who: { roman: "Disciples, students, and anyone who has been taught.", tel: "శిష్యులు, విద్యార్థులు, నేర్చుకున్న ప్రతి ఒక్కరూ." },
      tagline: { roman: "Honour the teacher — the day of Vyāsa, source of the śāstras.", tel: "గురు వందనం — వ్యాస పూర్ణిమ, శాస్త్రాల మూలం." },
      stotras: [{ deity: "guru", m: "guru stotram" }, { deity: "guru", m: "guru gita" }, { deity: "guru", m: "paduka stotram" }],
    },
    {
      id: "ratha-saptami", deity: "surya", brief: true,
      name: { roman: "Ratha Saptamī", deva: "रथ सप्तमी", tel: "రథ సప్తమి" },
      rule: { roman: "Māgha · Śukla Saptamī", deva: "माघ शुक्ल सप्तमी", tel: "మాఘ శుక్ల సప్తమి" },
      find: (y) => lunar(y, MASA.magha, 6),
      duration: { roman: "Dawn — the bath before sunrise", tel: "ప్రాతఃకాలం — సూర్యోదయానికి ముందు స్నానం" },
      who: { roman: "All; the arka leaves are placed on the head at the bath.", tel: "అందరూ; స్నానంలో జిల్లేడు ఆకులు తలపై ఉంచుతారు." },
      tagline: { roman: "The Sun turns his chariot north — bathe at dawn and salute Sūrya.", tel: "సూర్యుని ఉత్తరాయణ రథం — ప్రాతఃస్నానం, సూర్య వందనం." },
      stotras: [{ deity: "surya", m: "aditya hrdayam" }, { deity: "surya", m: "suryastakam" }, { deity: "surya", m: "surya suktam" }],
    },
    {
      id: "ugadi", deity: "vishnu", brief: true,
      name: { roman: "Ugādi", deva: "उगादि", tel: "ఉగాది" },
      rule: { roman: "Caitra · Śukla Pratipadā", deva: "चैत्र शुक्ल प्रतिपदा", tel: "చైత్ర శుక్ల పాడ్యమి" },
      find: (y) => lunar(y, MASA.caitra, T.pratipada),
      duration: { roman: "The day — pañcāṅga śravaṇam by evening", tel: "పగలు — సాయంత్రానికి పంచాంగ శ్రవణం" },
      who: { roman: "The Telugu and Kannada new year — the whole household.", tel: "తెలుగు, కన్నడ నూతన సంవత్సరం — ఇల్లంతా." },
      tagline: { roman: "The samvatsara opens — ugādi pacchadi, and the year read aloud.", tel: "సంవత్సరాది — ఉగాది పచ్చడి, పంచాంగ శ్రవణం." },
      stotras: [{ deity: "vishnu", m: "sahasranama" }],
    },
    {
      id: "skanda-shashti", deity: "subrahmanya", brief: true,
      name: { roman: "Skanda Ṣaṣṭhī", deva: "स्कन्द षष्ठी", tel: "స్కంద షష్ఠి" },
      rule: { roman: "Kārtika · Śukla Ṣaṣṭhī", deva: "कार्तिक शुक्ल षष्ठी", tel: "కార్తిక శుక్ల షష్ఠి" },
      find: (y) => lunar(y, MASA.kartika, 5),
      duration: { roman: "Six days, ending on Ṣaṣṭhī", tel: "ఆరు రోజులు, షష్ఠితో ముగింపు" },
      who: { roman: "Kept especially in Tamil and Telugu households.", tel: "ముఖ్యంగా తమిళ, తెలుగు కుటుంబాలలో." },
      tagline: { roman: "Six days to Skanda's victory over Sūrapadma — the Kavacam is read.", tel: "స్కందుని విజయపు ఆరు రోజులు — కవచ పారాయణం." },
      stotras: [{ deity: "subrahmanya", m: "skanda sasthi kavacam" }, { deity: "subrahmanya", m: "bhujangam" }, { deity: "subrahmanya", m: "kandar" }],
    },

    /* ------------------------------------------------------------------
       The jayantīs — a birth is a day, not a rite, so these are brief by
       nature: the hour, who keeps it, and what is read.
       ------------------------------------------------------------------ */
    {
      id: "nrsimha-jayanti", deity: "vishnu", brief: true,
      name: { roman: "Nṛsiṁha Jayantī", deva: "नृसिंह जयन्ती", tel: "నృసింహ జయంతి" },
      rule: { roman: "Vaiśākha · Śukla Caturdaśī", deva: "वैशाख शुक्ल चतुर्दशी", tel: "వైశాఖ శుక్ల చతుర్దశి" },
      find: (y) => lunar(y, MASA.vaisakha, 13),
      duration: { roman: "Dusk — the hour between day and night, which is when he came", tel: "సాయం సంధ్య — పగలు, రాత్రి కానివేళ; అదే ఆవిర్భావ ఘడియ" },
      who: { roman: "Kept by Vaiṣṇavas; especially those asking for protection.", tel: "వైష్ణవులు; ముఖ్యంగా రక్షణ కోరేవారు." },
      tagline: { roman: "Neither man nor beast, neither day nor night — the pillar opens at dusk.", tel: "నరుడూ కాదు మృగమూ కాదు, పగలూ కాదు రాత్రీ కాదు — సంధ్యలో స్తంభం చీలుతుంది." },
      stotras: [{ deity: "vishnu", m: "dasavatara" }, { deity: "vishnu", m: "sahasranama" }, { deity: "vishnu", m: "achyuta" }],
    },
    {
      id: "lalita-jayanti", deity: "devi", brief: true,
      name: { roman: "Lalitā Jayantī", deva: "ललिता जयन्ती", tel: "లలితా జయంతి" },
      rule: { roman: "Māgha · Pūrṇimā", deva: "माघ पूर्णिमा", tel: "మాఘ పౌర్ణమి" },
      find: (y) => lunar(y, MASA.magha, T.purnima),
      duration: { roman: "One day, the sahasranāma at its centre", tel: "ఒక రోజు, మధ్యలో సహస్రనామ పారాయణం" },
      who: { roman: "Śrīvidyā upāsakas above all, and any household that keeps the sahasranāma.", tel: "ముఖ్యంగా శ్రీవిద్యా ఉపాసకులు; సహస్రనామం చేసే ఇళ్ళన్నీ." },
      tagline: { roman: "The day of the thousand names — Lalitā's appearance, read from Śrīmātā to Lalitāmbikā.", tel: "సహస్రనామ దినం — శ్రీమాత నుండి లలితాంబిక వరకు పారాయణం." },
      stotras: [{ deity: "devi", m: "lalita sahasra" }, { deity: "devi", m: "lalita pancaratna" }, { deity: "devi", m: "khadgamala" }],
    },
    {
      id: "sita-navami", deity: "vishnu", brief: true,
      name: { roman: "Sītā Navamī", deva: "सीता नवमी", tel: "సీతా నవమి" },
      rule: { roman: "Vaiśākha · Śukla Navamī", deva: "वैशाख शुक्ल नवमी", tel: "వైశాఖ శుక్ల నవమి" },
      find: (y) => lunar(y, MASA.vaisakha, 8),
      duration: { roman: "Forenoon", tel: "పూర్వాహ్ణం" },
      who: { roman: "Married women especially; the furrow's daughter is asked for a steady house.", tel: "ముఖ్యంగా ముత్తైదువులు; భూమిపుత్రిని గృహస్థైర్యం కోరుతారు." },
      tagline: { roman: "Jānakī, found in the furrow — a month after Rāma's own navamī.", tel: "నాగేటిచాలులో దొరికిన జానకి — రామనవమి తరువాత నెలకు." },
      stotras: [{ deity: "vishnu", m: "rama raksa" }, { deity: "vishnu", m: "nama ramayanam" }],
    },
    {
      id: "parashurama-jayanti", deity: "vishnu", brief: true,
      name: { roman: "Paraśurāma Jayantī", deva: "परशुराम जयन्ती", tel: "పరశురామ జయంతి" },
      rule: { roman: "Vaiśākha · Śukla Tṛtīyā — Akṣaya Tṛtīyā", deva: "वैशाख शुक्ल तृतीया — अक्षय तृतीया", tel: "వైశాఖ శుక్ల తృతీయ — అక్షయ తృతీయ" },
      find: (y) => lunar(y, MASA.vaisakha, T.tritiya),
      duration: { roman: "Forenoon; the tithi needs no muhūrta of its own", tel: "పూర్వాహ్ణం; ఈ తిథికి వేరే ముహూర్తం అక్కరలేదు" },
      who: { roman: "Kept where the axe-bearer is the family's own; the tithi itself is kept by all.", tel: "పరశురాముని కులదైవంగా భావించే ఇళ్ళలో; తిథిని అందరూ పాటిస్తారు." },
      tagline: { roman: "The sixth descent, on the tithi that is said to lose nothing.", tel: "ఆరవ అవతారం — ఏదీ క్షయం కాని తిథి నాడు." },
      stotras: [{ deity: "vishnu", m: "dasavatara" }, { deity: "vishnu", m: "sahasranama" }],
    },
    {
      id: "vamana-jayanti", deity: "vishnu", brief: true,
      name: { roman: "Vāmana Jayantī", deva: "वामन जयन्ती", tel: "వామన జయంతి" },
      rule: { roman: "Bhādrapada · Śukla Dvādaśī", deva: "भाद्रपद शुक्ल द्वादशी", tel: "భాద్రపద శుక్ల ద్వాదశి" },
      find: (y) => lunar(y, MASA.bhadrapada, 11),
      duration: { roman: "Noon — the hour of the asking", tel: "మధ్యాహ్నం — దానం అడిగిన ఘడియ" },
      who: { roman: "Vaiṣṇava households; kept with the dvādaśī's own fast.", tel: "వైష్ణవ కుటుంబాలు; ద్వాదశి ఉపవాసంతో." },
      tagline: { roman: "Three steps of ground, asked by a boy and given by a king.", tel: "మూడడుగుల నేల — బాలుడు అడిగాడు, రాజు ఇచ్చాడు." },
      stotras: [{ deity: "vishnu", m: "dasavatara" }, { deity: "vishnu", m: "sahasranama" }],
    },
    {
      id: "radha-ashtami", deity: "vishnu", brief: true,
      name: { roman: "Rādhā Aṣṭamī", deva: "राधा अष्टमी", tel: "రాధా అష్టమి" },
      rule: { roman: "Bhādrapada · Śukla Aṣṭamī", deva: "भाद्रपद शुक्ल अष्टमी", tel: "భాద్రపద శుక్ల అష్టమి" },
      find: (y) => lunar(y, MASA.bhadrapada, 7),
      duration: { roman: "Midday", tel: "మధ్యాహ్నం" },
      who: { roman: "Kept in Vraja and by Vaiṣṇavas of the bhakti sampradāyas.", tel: "వ్రజంలో, భక్తి సంప్రదాయ వైష్ణవులలో." },
      tagline: { roman: "A fortnight after the midnight birth, the one who is asked for before he is.", tel: "అర్ధరాత్రి జననం తరువాత పక్షానికి — కృష్ణునికి ముందు పేరు చెప్పబడేది." },
      stotras: [{ deity: "vishnu", m: "madhura" }, { deity: "vishnu", m: "karnamrta" }],
    },
    {
      id: "shankara-jayanti", deity: "guru", brief: true,
      name: { roman: "Śaṅkara Jayantī", deva: "शङ्कर जयन्ती", tel: "శంకర జయంతి" },
      rule: { roman: "Vaiśākha · Śukla Pañcamī", deva: "वैशाख शुक्ल पञ्चमी", tel: "వైశాఖ శుక్ల పంచమి" },
      find: (y) => lunar(y, MASA.vaisakha, T.panchami),
      duration: { roman: "Forenoon", tel: "పూర్వాహ్ణం" },
      who: { roman: "Smārtas and the maṭha traditions; students of Vedānta.", tel: "స్మార్తులు, మఠ సంప్రదాయాలు; వేదాంత విద్యార్థులు." },
      tagline: { roman: "The ācārya whose hymns half this library is — read one of his in his own metre.", tel: "ఈ సంకలనంలో సగం ఆయన రచనలే — ఆయన ఛందస్సులోనే ఒకటి పఠించండి." },
      stotras: [{ deity: "guru", m: "totakastakam" }, { deity: "shiva", m: "nirvana" }, { deity: "devi", m: "kanakadhara" }],
    },
    {
      id: "dattatreya-jayanti", deity: "guru", brief: true,
      name: { roman: "Dattātreya Jayantī", deva: "दत्तात्रेय जयन्ती", tel: "దత్తాత్రేయ జయంతి" },
      rule: { roman: "Mārgaśīrṣa · Pūrṇimā", deva: "मार्गशीर्ष पूर्णिमा", tel: "మార్గశిర పౌర్ణమి" },
      find: (y) => lunar(y, MASA.margashirsha, T.purnima),
      duration: { roman: "Evening, at the rise of the full moon", tel: "సాయంత్రం, పూర్ణచంద్రోదయ వేళ" },
      who: { roman: "Datta upāsakas, strong in Marāṭhī and Telugu households.", tel: "దత్త ఉపాసకులు; మరాఠీ, తెలుగు ఇళ్ళలో ఎక్కువ." },
      tagline: { roman: "Guru, Viṣṇu and Śiva in one body — the day the three were born as a teacher.", tel: "గురువు, విష్ణువు, శివుడు ఒకే రూపంలో — ముగ్గురూ గురువుగా జన్మించిన రోజు." },
      stotras: [{ deity: "guru", m: "guru stotram" }, { deity: "guru", m: "paduka" }, { deity: "guru", m: "guru gita" }],
    },
    {
      id: "hayagriva-jayanti", deity: "vishnu", brief: true,
      name: { roman: "Hayagrīva Jayantī", deva: "हयग्रीव जयन्ती", tel: "హయగ్రీవ జయంతి" },
      rule: { roman: "Śrāvaṇa · Pūrṇimā", deva: "श्रावण पूर्णिमा", tel: "శ్రావణ పౌర్ణమి" },
      find: (y) => lunar(y, MASA.shravana, T.purnima),
      duration: { roman: "Forenoon — the same day as the upākarma", tel: "పూర్వాహ్ణం — ఉపాకర్మ దినమే" },
      who: { roman: "Students and teachers; Śrīvaiṣṇavas keep it with the upākarma.", tel: "విద్యార్థులు, ఉపాధ్యాయులు; శ్రీవైష్ణవులు ఉపాకర్మతో." },
      tagline: { roman: "The horse-necked one who returned the Vedas — asked for learning, on the day the thread is changed.", tel: "వేదాలను తిరిగి తెచ్చిన హయవదనుడు — జందెం మార్చే రోజున విద్య కోరతారు." },
      stotras: [{ deity: "vishnu", m: "sahasranama" }, { deity: "devi", m: "sarasvati" }],
    },
    {
      id: "vasanta-panchami", deity: "devi", brief: true,
      name: { roman: "Vasanta Pañcamī · Sarasvatī Jayantī", deva: "वसन्त पञ्चमी · सरस्वती जयन्ती", tel: "వసంత పంచమి · సరస్వతీ జయంతి" },
      rule: { roman: "Māgha · Śukla Pañcamī", deva: "माघ शुक्ल पञ्चमी", tel: "మాఘ శుక్ల పంచమి" },
      find: (y) => lunar(y, MASA.magha, T.panchami),
      duration: { roman: "Forenoon; the akṣarābhyāsa is done in it", tel: "పూర్వాహ్ణం; అక్షరాభ్యాసం ఈ వేళలోనే" },
      who: { roman: "Students, musicians, and any child beginning letters.", tel: "విద్యార్థులు, గాయకులు, అక్షరాలు మొదలుపెట్టే పిల్లలు." },
      tagline: { roman: "Spring's first day belongs to Sarasvatī — books are worshipped, not opened.", tel: "వసంతపు మొదటి రోజు సరస్వతికి — పుస్తకాలు పూజిస్తారు, చదవరు." },
      stotras: [{ deity: "devi", m: "sarasvati" }, { deity: "devi", m: "syamala" }],
    },

    /* ------------------------------------------------------------------
       The other three navarātris. Śāradīya in Āśvina is the one everyone
       keeps; these three are kept by upāsakas, and two of them are called
       gupta — hidden — because they are done without announcement.
       ------------------------------------------------------------------ */
    {
      id: "vasanta-navaratri", deity: "devi", brief: true,
      name: { roman: "Vasanta Navarātri", deva: "वसन्त नवरात्रि", tel: "వసంత నవరాత్రి" },
      rule: { roman: "Caitra · Śukla Pratipadā to Navamī — the first nine days of Vasanta", deva: "चैत्र शुक्ल प्रतिपदा से नवमी — वसन्त के प्रथम नौ दिन", tel: "చైత్ర శుక్ల పాడ్యమి నుండి నవమి — వసంతపు మొదటి తొమ్మిది రోజులు" },
      find: (y) => lunar(y, MASA.caitra, T.pratipada),
      duration: { roman: "Nine nights, ending on Rāma Navamī", tel: "తొమ్మిది రాత్రులు, రామనవమితో ముగింపు" },
      who: { roman: "Devī upāsakas; in Rāma temples the same nine days are kept as Rāma's.", tel: "దేవీ ఉపాసకులు; రామాలయాల్లో ఇవే తొమ్మిది రోజులు రామునికి." },
      tagline: { roman: "The spring nine nights — the year's other Navarātri, closing on Rāma's birth.", tel: "వసంతపు తొమ్మిది రాత్రులు — సంవత్సరపు రెండో నవరాత్రి, రామజననంతో ముగుస్తుంది." },
      stotras: [{ deity: "devi", m: "lalita sahasra" }, { deity: "devi", m: "mahisasuramardini" }, { deity: "devi", m: "argala" }],
    },
    {
      id: "shyamala-navaratri", deity: "devi", brief: true,
      name: { roman: "Śyāmalā Navarātri · Gupta Navarātri", deva: "श्यामला नवरात्रि · गुप्त नवरात्रि", tel: "శ్యామలా నవరాత్రి · గుప్త నవరాత్రి" },
      rule: { roman: "Māgha · Śukla Pratipadā to Navamī — the first nine days of Māgha", deva: "माघ शुक्ल प्रतिपदा से नवमी — माघ के प्रथम नौ दिन", tel: "మాఘ శుక్ల పాడ్యమి నుండి నవమి — మాఘపు మొదటి తొమ్మిది రోజులు" },
      find: (y) => lunar(y, MASA.magha, T.pratipada),
      duration: { roman: "Nine nights, kept quietly", tel: "తొమ్మిది రాత్రులు, నిశ్శబ్దంగా" },
      who: { roman: "Śrīvidyā upāsakas; Śyāmalā is the minister of the Devī's court, asked for speech and skill.", tel: "శ్రీవిద్యా ఉపాసకులు; శ్యామల దేవీ మంత్రిణి — వాక్కు, నైపుణ్యం కోరతారు." },
      tagline: { roman: "Gupta — hidden: nine nights done without announcement, to Rāja-Mātaṅgī.", tel: "గుప్తం — ప్రకటన లేకుండా చేసే తొమ్మిది రాత్రులు, రాజమాతంగికి." },
      stotras: [{ deity: "devi", m: "syamala" }, { deity: "devi", m: "lalita sahasra" }, { deity: "devi", m: "sarasvati" }],
    },
    {
      id: "varahi-navaratri", deity: "devi", brief: true,
      name: { roman: "Vārāhī Navarātri", deva: "वाराही नवरात्रि", tel: "వారాహీ నవరాత్రి" },
      rule: { roman: "Āṣāḍha · Śukla Pratipadā to Navamī — the first nine days of Āṣāḍha", deva: "आषाढ शुक्ल प्रतिपदा से नवमी — आषाढ के प्रथम नौ दिन", tel: "ఆషాఢ శుక్ల పాడ్యమి నుండి నవమి — ఆషాఢపు మొదటి తొమ్మిది రోజులు" },
      find: (y) => lunar(y, MASA.ashadha, T.pratipada),
      duration: { roman: "Nine nights, kept quietly", tel: "తొమ్మిది రాత్రులు, నిశ్శబ్దంగా" },
      who: { roman: "Śrīvidyā upāsakas; Vārāhī is the commander of the Devī's forces, asked for protection.", tel: "శ్రీవిద్యా ఉపాసకులు; వారాహి దేవీ దండనాయకి — రక్షణ కోరతారు." },
      tagline: { roman: "The other gupta nine nights — to Daṇḍanāthā, who removes what stands in the way.", tel: "మరో గుప్త నవరాత్రి — అడ్డు తొలగించే దండనాథకు." },
      stotras: [{ deity: "devi", m: "varahi" }, { deity: "devi", m: "lalita sahasra" }, { deity: "devi", m: "durga" }],
    },
  ];

  /* The sun's own days live in their own file: they are found by a transit
     rather than a tithi, and nothing else in this list works that way. They
     join here so the calendar, the upcoming list and the day sheets treat them
     like any other observance. */
  (((STUTI_SANKRANTI || {}).entries) || []).forEach((e) => vratas.push(e));

  const byId = {};
  vratas.forEach((v) => { byId[v.id] = v; });

  /* the next occurrence on or after `from` — monthly vratas roll forward */
  function nextDate(v, from) {
    const base = from || new Date();
    const t0 = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    /* a weekly vrata: the next matching weekday still inside this year's
       window, else the first of next year's */
    if (v.weekly !== undefined) {
      for (const y of [t0.getFullYear(), t0.getFullYear() + 1]) {
        let win; try { win = v.window(y); } catch (e) { return null; }
        const d = new Date(win[0]);
        while (d.getDay() !== v.weekly) d.setDate(d.getDate() + 1);
        while (d <= win[1]) { if (d >= t0) return new Date(d); d.setDate(d.getDate() + 7); }
      }
      return null;
    }
    for (let i = 0; i < 14; i++) {
      const probe = new Date(t0.getFullYear(), t0.getMonth() + i, 1);
      let d;
      try { d = v.everyMonth ? v.find(probe.getFullYear(), probe.getMonth()) : v.find(probe.getFullYear()); }
      catch (e) { return null; }
      if (!d) continue;
      if (d >= t0) return d;
      if (!v.everyMonth) { // try next year once we have passed this year's
        try { const nd = v.find(t0.getFullYear() + 1); if (nd && nd >= t0) return nd; } catch (e) {}
      }
    }
    return null;
  }

  const daysAway = (d) => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - t) / 86400000);
  };

  /* every vrata with its next date, soonest first */
  function upcoming(limit) {
    const out = vratas.map((v) => { const d = nextDate(v); return d ? { v, date: d, away: daysAway(d) } : null; })
      .filter(Boolean).sort((a, b) => a.date - b.date);
    return limit ? out.slice(0, limit) : out;
  }

  /* those falling inside a given month */
  function inMonth(y, m) {
    return upcoming().filter((x) => x.date.getFullYear() === y && x.date.getMonth() === m);
  }

  return { vratas, byId, nextDate, daysAway, upcoming, inMonth, dayKey };
})();

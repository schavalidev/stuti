import { STUTI } from "./stuti-data";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — Library derivations + occasion & practice content
   The library is one pool of texts, re-sliced by lens:
     · by TYPE   — genre, already tagged by STUTI's typeOf()
     · by AUTHOR — attribution, already carried on every entry
     · by WEEKDAY  — vāra → deity (vratas live in stuti-vrata-data.js)
   And the daily PRACTICES (anuṣṭhānams) — step sequences, not
   single hymns. All authored content here is a careful, widely-
   accepted starting point; regional families differ in detail.
   Attaches to STUTI_LIB.
   ============================================================ */
export const STUTI_LIB = (function () {
  const S = STUTI;
  const strip = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const norm = (s) => strip(s).toLowerCase();

  /* ---------------- TYPE lens ---------------- */
  /* canonical display order; anything unlisted sorts after */
  const TYPE_ORDER = [
    "Sahasranāma", "Nāmāvali", "Aṣṭakam", "Pañcaratna", "Kavaca",
    "Sūkta", "Daṇḍaka", "Dhyāna-śloka", "Vandanā", "Stotra", "Kṛti", "Gītā", "Upaniṣad",
  ];
  const TYPE_LABELS = {
    "Sahasranāma":  { deva: "सहस्रनाम",        tel: "సహస్రనామ",          note: "The thousand names" },
    "Nāmāvali":     { deva: "नामावलि · अष्टोत्तर", tel: "నామావళి · అష్టోత్తర", note: "Litanies — 108 names & more" },
    "Aṣṭakam":      { deva: "अष्टक",           tel: "అష్టకం",             note: "Eight-verse praise" },
    "Pañcaratna":   { deva: "पञ्चरत्न",         tel: "పంచరత్నం",           note: "Five jewels" },
    "Kavaca":       { deva: "कवच",            tel: "కవచం",              note: "Armour of protection" },
    "Sūkta":        { deva: "सूक्त",           tel: "సూక్తం",             note: "Vedic hymn" },
    "Daṇḍaka":      { deva: "दण्डक",           tel: "దండకం",             note: "Unbroken metric praise" },
    "Dhyāna-śloka": { deva: "ध्यान श्लोक",       tel: "ధ్యాన శ్లోకం",         note: "Verse of contemplation" },
    "Vandanā":      { deva: "वन्दना",          tel: "వందన",              note: "Salutation" },
    "Stotra":       { deva: "स्तोत्र",          tel: "స్తోత్రం",            note: "Hymn of praise" },
    "Gītā":         { deva: "गीता",            tel: "గీత",               note: "Song" },
    "Upaniṣad":     { deva: "उपनिषद्",         tel: "ఉపనిషత్",           note: "Esoteric teaching" },
    "Kṛti":         { deva: "कृति",            tel: "కృతి",              note: "Karnatic composition" },
  };
  function typeList() {
    const counts = {};
    S.hymns.forEach((h) => { counts[h.type] = (counts[h.type] || 0) + 1; });
    return Object.keys(counts)
      .sort((a, b) => {
        const ia = TYPE_ORDER.indexOf(a), ib = TYPE_ORDER.indexOf(b);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || b.localeCompare(a);
      })
      .map((t) => ({ type: t, count: counts[t], ...(TYPE_LABELS[t] || { deva: t, tel: t, note: "" }) }));
  }
  const hymnsOfType = (t) => S.hymns.filter((h) => h.type === t);

  /* ---------------- AUTHOR lens ---------------- */
  /* fold a `by` string to a primary attribution (drop "· source" tails) */
  function primaryAuthor(by) {
    if (!by) return "Traditional";
    if (norm(by).includes("traditional")) return "Traditional";
    const a = by.split("·")[0].trim();
    return a || "Traditional";
  }
  function authorList() {
    const counts = {};
    S.hymns.forEach((h) => { const a = primaryAuthor(h.by); counts[a] = (counts[a] || 0) + 1; });
    return Object.keys(counts)
      .sort((a, b) => {
        if (a === "Traditional") return 1;
        if (b === "Traditional") return -1;
        return counts[b] - counts[a] || a.localeCompare(b);
      })
      .map((a) => ({ author: a, count: counts[a] }));
  }
  const hymnsByAuthor = (a) => S.hymns.filter((h) => primaryAuthor(h.by) === a);

  /* ---------------- OCCASION lens ---------------- */
  /* weekday → deity (STUTI.weekday), with day names in three scripts */
  const WEEKDAYS = [
    { roman: "Sunday",    deva: "रविवार",    tel: "ఆదివారం" },
    { roman: "Monday",    deva: "सोमवार",    tel: "సోమవారం" },
    { roman: "Tuesday",   deva: "मङ्गलवार",  tel: "మంగళవారం" },
    { roman: "Wednesday", deva: "बुधवार",    tel: "బుధవారం" },
    { roman: "Thursday",  deva: "गुरुवार",   tel: "గురువారం" },
    { roman: "Friday",    deva: "शुक्रवार",  tel: "శుక్రవారం" },
    { roman: "Saturday",  deva: "शनिवार",    tel: "శనివారం" },
  ];
  function weekPlan() {
    return S.weekday.map((w, i) => ({ ...WEEKDAYS[i], idx: i, deity: S.deityById[w.deity] }));
  }
  const todayIdx = () => new Date().getDay();

  /* Festivals & vrathams moved to stuti-vrata-data.js (STUTI_VRATA),
     where each one carries its date rule, samagri and vidhi as well. */

  /* Resolve a curated pick list — [{ deity, m }], where `m` is a substring
     of the title — into real hymns from the pool. Kept here because both
     the vrata guides and the practice steps point into the pool this way. */
  function resolveStotras(picks) {
    if (!picks || !picks.length) return [];
    const out = [];
    picks.forEach((p) => {
      const want = norm(p.m || "");
      const pool = S.hymnsForDeity(p.deity) || [];
      const hit = pool.find((h) => norm(h.title).indexOf(want) !== -1)
               || pool.find((h) => norm([h.title, h.deva, h.tel].join(" ")).indexOf(want) !== -1);
      if (hit && out.indexOf(hit) === -1) out.push(hit);
    });
    return out;
  }

  /* ---------------- PRACTICES (anuṣṭhānams) ----------------
     Step sequences, not single hymns. A step may carry a `japa`
     count and/or a `recite` pointer into the pool ({deity, m}). */
  const practices = [
    {
      id: "sandhya-vandanam", deity: "surya", seed: "गायत्री",
      name: { roman: "Sandhyā Vandanam", deva: "सन्ध्या वन्दनम्", tel: "సంధ్యా వందనం" },
      tagline: { roman: "The daily twilight worship — purification, the arghya to the Sun, and the Gāyatrī japa.", deva: "नित्य सन्ध्या उपासना — शुद्धि, सूर्य अर्घ्य, गायत्री जप।", tel: "నిత్య సంధ్యోపాసన — శుద్ధి, సూర్య అర్ఘ్యం, గాయత్రీ జపం." },
      when: { roman: "At the three junctions — dawn, midday, dusk", deva: "त्रिकाल — प्रातः, मध्याह्न, सायं", tel: "త్రికాలం — ప్రాతః, మధ్యాహ్నం, సాయంత్రం" },
      steps: [
        { title: { roman: "Ācamana", deva: "आचमन", tel: "ఆచమనం" }, detail: { roman: "Sip water thrice with the names Keśava, Nārāyaṇa, Mādhava; purify the hands.", deva: "केशव-नारायण-माधव नामों से तीन बार जल आचमन; हस्त शुद्धि।", tel: "కేశవ-నారాయణ-మాధవ నామాలతో మూడుసార్లు జల ఆచమనం; హస్త శుద్ధి." } },
        { title: { roman: "Prāṇāyāma", deva: "प्राणायाम", tel: "ప్రాణాయామం" }, detail: { roman: "Steady the breath, reciting the praṇava, the vyāhṛtis, and the Gāyatrī once within.", deva: "प्रणव, व्याहृति एवं गायत्री सहित प्राणों का नियमन।", tel: "ప్రణవం, వ్యాహృతులు, గాయత్రితో ప్రాణ నియంత్రణ." } },
        { title: { roman: "Saṅkalpa", deva: "सङ्कल्प", tel: "సంకల్పం" }, detail: { roman: "State the time and the intent — to perform the sandhyā of this junction.", deva: "इस सन्ध्या-काल एवं संकल्प का उच्चारण।", tel: "ఈ సంధ్యా కాలం, సంకల్ప ఉచ్చారణ." } },
        { title: { roman: "Mārjana", deva: "मार्जन", tel: "మార్జనం" }, detail: { roman: "Sprinkle water over the head with the āpo-hi-ṣṭhā mantras — outer purification.", deva: "आपो हि ष्ठा मन्त्रों से जल-प्रोक्षण — बाह्य शुद्धि।", tel: "ఆపో హి ష్ఠా మంత్రాలతో జల ప్రోక్షణ — బాహ్య శుద్ధి." } },
        { title: { roman: "Prāśana", deva: "प्राशन", tel: "ప్రాశనం" }, detail: { roman: "Sip the purified water once — inner purification from lapses of the day.", deva: "एक बार जल प्राशन — आन्तरिक शुद्धि।", tel: "ఒకసారి జల ప్రాశనం — అంతఃశుద్ధి." } },
        { title: { roman: "Arghya-pradāna", deva: "अर्घ्य प्रदान", tel: "అర్ఘ్య ప్రదానం" }, detail: { roman: "The central act — offer water to the Sun three times, standing, facing the light. Given at or before sunrise in the morning, at or before sunset in the evening: it belongs to the joining, not to the day or the night.", deva: "मुख्य कर्म — सूर्य को तीन बार अर्घ्य, सूर्याभिमुख खड़े होकर। प्रातः सूर्योदय के पूर्व अथवा उदयकाल में, सायं सूर्यास्त के पूर्व अथवा अस्तकाल में — यह सन्धि का कर्म है।", tel: "ముఖ్య కర్మ — సూర్యునికి మూడుసార్లు అర్ఘ్యం, సూర్యాభిముఖంగా నిలిచి. ప్రాతఃకాలం సూర్యోదయానికి ముందు లేదా ఉదయ సమయంలో, సాయంకాలం సూర్యాస్తమయానికి ముందు లేదా అస్తమయ సమయంలో — ఇది సంధి కర్మ." } },
        { title: { roman: "Gāyatrī āvāhana", deva: "गायत्री आवाहन", tel: "గాయత్రీ ఆవాహన" }, detail: { roman: "Invoke and meditate on Gāyatrī, mother of the Vedas, seated in the heart.", deva: "वेदमाता गायत्री का आवाहन एवं ध्यान।", tel: "వేదమాత గాయత్రి ఆవాహన, ధ్యానం." } },
        { title: { roman: "Gāyatrī japa", deva: "गायत्री जप", tel: "గాయత్రీ జపం" }, japa: "10 · 28 · 108", detail: { roman: "Repeat the Gāyatrī mantra silently — 10, 28, or 108 times, by capacity.", deva: "गायत्री मन्त्र का मौन जप — यथाशक्ति 10 · 28 · 108 बार।", tel: "గాయత్రీ మంత్ర మౌన జపం — శక్తికొద్దీ 10 · 28 · 108 సార్లు." }, recite: { deity: "surya", m: "gayatri" } },
        { title: { roman: "Sūrya upasthāna", deva: "सूर्य उपस्थान", tel: "సూర్య ఉపస్థానం" }, detail: { roman: "Stand in praise of the Sun with the Āditya hymn before concluding — after sunrise in the morning, after sunset in the evening, the sun already risen or already set.", deva: "समापन से पूर्व आदित्य स्तुति में उपस्थान — प्रातः सूर्योदय के पश्चात्, सायं सूर्यास्त के पश्चात्।", tel: "ముగింపుకు ముందు ఆదిత్య స్తుతిలో ఉపస్థానం — ప్రాతఃకాలం సూర్యోదయం తరువాత, సాయంకాలం సూర్యాస్తమయం తరువాత." }, recite: { deity: "surya", m: "aditya hrdayam" } },
        { title: { roman: "Abhivādana", deva: "अभिवादन", tel: "అభివాదనం" }, detail: { roman: "Announce your lineage (gotra · pravara), salute the elders and the deities, and conclude with ācamana.", deva: "गोत्र-प्रवर सहित अभिवादन, नमस्कार एवं आचमन से समापन।", tel: "గోత్ర-ప్రవరతో అభివాదనం, నమస్కారం, ఆచమనంతో ముగింపు." } },
      ],
      note: { roman: "A short outline of the core sequence. The full vidhi varies by Veda-śākhā and family — learn it from your ācārya.", deva: "यह मूल क्रम का संक्षिप्त रूप है। पूर्ण विधि शाखा एवं परम्परा अनुसार भिन्न होती है — आचार्य से सीखें।", tel: "ఇది ప్రధాన క్రమపు సంక్షిప్త రూపం. పూర్తి విధి శాఖ, సంప్రదాయాన్ని బట్టి మారుతుంది — ఆచార్యుని వద్ద నేర్చుకోండి." },
    },
    {
      id: "nitya-puja", deity: "ganesha", seed: "गं",
      name: { roman: "Nitya Pūjā Vidhānam", deva: "नित्य पूजा विधानम्", tel: "నిత్య పూజా విధానం" },
      tagline: { roman: "The daily home worship — from cleansing and saṅkalpa through the sixteen upacāras to ārati.", deva: "नित्य गृह पूजा — शुद्धि एवं संकल्प से षोडशोपचार तथा आरती तक।", tel: "నిత్య గృహ పూజ — శుద్ధి, సంకల్పం నుండి షోడశోపచారం, హారతి వరకు." },
      when: { roman: "Each morning after bath, at the home altar", deva: "प्रतिदिन प्रातः स्नानोपरान्त, गृह देवस्थान में", tel: "ప్రతిరోజు ప్రాతః స్నానానంతరం, గృహ దేవస్థానంలో" },
      steps: [
        { title: { roman: "Śuci & dīpa", deva: "शुचि · दीप", tel: "శుచి · దీపం" }, detail: { roman: "Bathe, clean the altar, and light the lamp — the worship begins with light.", deva: "स्नान, देवस्थान शुद्धि, दीप प्रज्वलन।", tel: "స్నానం, దేవస్థాన శుద్ధి, దీప ప్రజ్వలనం." } },
        { title: { roman: "Ācamana · Prāṇāyāma", deva: "आचमन · प्राणायाम", tel: "ఆచమనం · ప్రాణాయామం" }, detail: { roman: "Sip water for purity and steady the breath before worship.", deva: "आचमन एवं प्राणायाम से शुद्धि।", tel: "ఆచమనం, ప్రాణాయామంతో శుద్ధి." } },
        { title: { roman: "Saṅkalpa", deva: "सङ्कल्प", tel: "సంకల్పం" }, detail: { roman: "State the day, the place, and the intent of today's pūjā.", deva: "तिथि, स्थान एवं आज की पूजा का संकल्प।", tel: "తిథి, స్థలం, నేటి పూజ సంకల్పం." } },
        { title: { roman: "Gaṇeśa smaraṇa", deva: "गणेश स्मरण", tel: "గణేశ స్మరణ" }, detail: { roman: "Invoke Gaṇeśa first, that the worship proceed without obstacle.", deva: "निर्विघ्नता हेतु प्रथम गणेश स्मरण।", tel: "నిర్విఘ్నత కోసం మొదట గణేశ స్మరణ." }, recite: { deity: "ganesha", m: "vakratu" } },
        { title: { roman: "Dhyāna & āvāhana", deva: "ध्यान · आवाहन", tel: "ధ్యానం · ఆవాహన" }, detail: { roman: "Contemplate the iṣṭa-devatā and invoke the presence upon the image.", deva: "इष्ट देव का ध्यान एवं आवाहन।", tel: "ఇష్ట దేవత ధ్యానం, ఆవాహన." } },
        { title: { roman: "Ṣoḍaśopacāra", deva: "षोडशोपचार", tel: "షోడశోపచారం" }, detail: { roman: "Offer the sixteen services — āsana, pādya, arghya, snāna, vastra, gandha, puṣpa, dhūpa, dīpa, naivedya.", deva: "षोडश उपचार — आसन, पाद्य, अर्घ्य, स्नान, वस्त्र, गन्ध, पुष्प, धूप, दीप, नैवेद्य।", tel: "పదహారు ఉపచారాలు — ఆసనం, పాద్యం, అర్ఘ్యం, స్నానం, వస్త్రం, గంధం, పుష్పం, ధూపం, దీపం, నైవేద్యం." } },
        { title: { roman: "Aṣṭottara / stotra", deva: "अष्टोत्तर · स्तोत्र", tel: "అష్టోత్తర · స్తోత్రం" }, detail: { roman: "Recite the deity's 108 names, or a stotra, offering a flower at each name.", deva: "देव के अष्टोत्तर शतनाम अथवा स्तोत्र, प्रत्येक नाम पर पुष्प।", tel: "దేవత అష్టోత్తర శతనామాలు లేదా స్తోత్రం, ప్రతి నామానికి పుష్పం." } },
        { title: { roman: "Naivedya", deva: "नैवेद्य", tel: "నైవేద్యం" }, detail: { roman: "Offer food, sprinkling water around it; offer tāmbūla and a lamp.", deva: "जल-प्रोक्षण सहित नैवेद्य, ताम्बूल एवं दीप अर्पण।", tel: "జల ప్రోక్షణతో నైవేద్యం, తాంబూలం, దీపం సమర్పణ." } },
        { title: { roman: "Dhūpa-dīpa & ārati", deva: "धूप-दीप · आरती", tel: "ధూప-దీప · హారతి" }, detail: { roman: "Wave incense and the camphor flame; ring the bell and sing the ārati.", deva: "धूप एवं कर्पूर आरती, घण्टानाद सहित।", tel: "ధూపం, కర్పూర హారతి, గంటానాదంతో." } },
        { title: { roman: "Pradakṣiṇa · Namaskāra", deva: "प्रदक्षिणा · नमस्कार", tel: "ప్రదక్షిణ · నమస్కారం" }, detail: { roman: "Circumambulate and prostrate; ask pardon for any lapse, and share the prasāda.", deva: "प्रदक्षिणा, नमस्कार, क्षमापन एवं प्रसाद वितरण।", tel: "ప్రదక్షిణ, నమస్కారం, క్షమాపణ, ప్రసాద వితరణ." } },
      ],
      note: { roman: "A concise household order; the number and manner of upacāras vary by tradition. Adapt to your family's practice.", deva: "यह संक्षिप्त गृह-क्रम है; उपचारों की संख्या एवं रीति परम्परानुसार भिन्न होती है।", tel: "ఇది సంక్షిప్త గృహ క్రమం; ఉపచారాల సంఖ్య, రీతి సంప్రదాయాన్ని బట్టి మారుతుంది." },
    },
  ];
  const practiceById = (id) => practices.find((p) => p.id === id) || null;

  return {
    // type
    typeList, hymnsOfType, TYPE_LABELS,
    // author
    authorList, hymnsByAuthor, primaryAuthor,
    // weekday plan (still used by the deity-of-the-day reference)
    weekPlan, todayIdx, resolveStotras,
    // practices
    practices, practiceById,
  };
})();

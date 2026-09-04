/* ============================================================
   STUTI — the deśa clause
   A saṅkalpa names where it is spoken, and the app said the same
   thing everywhere: jambūdvīpe bhāratavarṣe bharatakhaṇḍe meroḥ
   dakṣiṇa-digbhāge — true of Kanyākumārī and Kāśī alike, and so
   not really an answer. What the tradition actually uses to place
   a rite is the river: which basin, and which bank of it. That is
   derivable from a latitude and a longitude, which every location
   in this app already carries.

   Three parts, in the order they are spoken:
     • dvīpa · varṣa · khaṇḍa · digbhāga   — the cosmographic frame
     • the river clause                     — computed here
     • the kṣetra                           — named, for the tīrthas

   Outside India the frame is proposed, not computed: the varṣa on
   your side of Meru, or krauñca for the Americas, with the note that
   the schools differ and a field for the clause your family uses.
   Some assign krauñca-dvīpa to the Americas,
   some plakṣa, many keep jambū; some read meroḥ dakṣiṇa-digbhāge as
   wrong above the equator. Someone recites this daily, so the app
   offers the options, says the schools differ, and lets the reciter
   choose. A confidently wrong clause is worse than a general one.
   ============================================================ */
window.STUTI_DESA = (function () {
  /* ---------- the rivers ----------
     Each course is a handful of real points along it — enough to say which
     basin a place sits in and which side of the water it stands on. `axis`
     is how the river runs, which decides whether the banks are named north
     and south or east and west. `gen` is the genitive that carries "tīre";
     `stem` and `dual` build the "between two rivers" form, where the dual
     ending lands on the second member. */
  const RIVERS = [
    { id: "ganga", rank: 1, axis: "ew",
      gen: { deva: "गङ्गायाः", iast: "gaṅgāyāḥ" }, stem: { deva: "गङ्गा", iast: "gaṅgā" }, dual: { deva: "गङ्गयोः", iast: "gaṅgayoḥ" },
      pts: [[29.95, 78.16], [27.9, 78.08], [26.45, 80.33], [25.44, 81.85], [25.32, 83.01], [25.59, 85.14], [24.8, 87.9], [22.57, 88.36]] },
    { id: "yamuna", rank: 2, axis: "ns",
      gen: { deva: "यमुनायाः", iast: "yamunāyāḥ" }, stem: { deva: "यमुना", iast: "yamunā" }, dual: { deva: "यमुनयोः", iast: "yamunayoḥ" },
      pts: [[30.15, 77.9], [28.61, 77.25], [27.18, 78.01], [26.5, 79.9], [25.44, 81.85]] },
    { id: "godavari", rank: 4, axis: "ew",
      gen: { deva: "गोदावर्याः", iast: "godāvaryāḥ" }, stem: { deva: "गोदावरी", iast: "godāvarī" }, dual: { deva: "गोदावर्योः", iast: "godāvaryoḥ" },
      pts: [[20.0, 73.53], [19.6, 75.3], [19.15, 77.32], [18.4, 79.1], [17.67, 80.89], [17.0, 81.78]] },
    { id: "krishna", rank: 3, axis: "ew",
      gen: { deva: "कृष्णायाः", iast: "kṛṣṇāyāḥ" }, stem: { deva: "कृष्णा", iast: "kṛṣṇā" }, dual: { deva: "कृष्णयोः", iast: "kṛṣṇayoḥ" },
      pts: [[17.92, 73.66], [16.85, 74.57], [16.5, 76.5], [16.07, 78.87], [16.51, 80.65]] },
    { id: "kaveri", rank: 5, axis: "ew",
      gen: { deva: "कावेर्याः", iast: "kāveryāḥ" }, stem: { deva: "कावेरी", iast: "kāverī" }, dual: { deva: "कावेर्योः", iast: "kāveryoḥ" },
      pts: [[12.39, 75.49], [12.42, 76.7], [11.4, 77.75], [10.86, 78.69], [10.96, 79.38], [11.0, 79.83]] },
    { id: "narmada", rank: 6, axis: "ew",
      gen: { deva: "नर्मदायाः", iast: "narmadāyāḥ" }, stem: { deva: "नर्मदा", iast: "narmadā" }, dual: { deva: "नर्मदयोः", iast: "narmadayoḥ" },
      pts: [[22.67, 81.75], [23.17, 79.95], [22.75, 77.72], [22.24, 76.15], [21.9, 74.5], [21.7, 72.98]] },
    { id: "tapi", rank: 9, axis: "ew",
      gen: { deva: "ताप्याः", iast: "tāpyāḥ" }, stem: { deva: "तापी", iast: "tāpī" }, dual: { deva: "ताप्योः", iast: "tāpyoḥ" },
      pts: [[21.5, 78.3], [21.3, 76.23], [21.2, 74.5], [21.17, 72.83]] },
    { id: "tungabhadra", rank: 8, axis: "ew",
      gen: { deva: "तुङ्गभद्रायाः", iast: "tuṅgabhadrāyāḥ" }, stem: { deva: "तुङ्गभद्रा", iast: "tuṅgabhadrā" }, dual: { deva: "तुङ्गभद्रयोः", iast: "tuṅgabhadrayoḥ" },
      pts: [[13.9, 75.6], [14.5, 75.9], [15.34, 76.46], [15.95, 78.3]] },
    { id: "bhima", rank: 10, axis: "ew",
      gen: { deva: "भीमायाः", iast: "bhīmāyāḥ" }, stem: { deva: "भीमा", iast: "bhīmā" }, dual: { deva: "भीमयोः", iast: "bhīmayoḥ" },
      pts: [[18.9, 73.9], [18.2, 74.6], [17.68, 75.33], [16.9, 76.6]] },
    { id: "mahanadi", rank: 11, axis: "ew",
      gen: { deva: "महानद्याः", iast: "mahānadyāḥ" }, stem: { deva: "महानदी", iast: "mahānadī" }, dual: { deva: "महानद्योः", iast: "mahānadyoḥ" },
      pts: [[20.1, 81.9], [21.0, 82.7], [21.47, 83.98], [20.46, 85.88]] },
    { id: "sabarmati", rank: 13, axis: "ns",
      gen: { deva: "साबरमत्याः", iast: "sābarmatyāḥ" }, stem: { deva: "साबरमती", iast: "sābarmatī" }, dual: { deva: "साबरमत्योः", iast: "sābarmatyoḥ" },
      pts: [[24.3, 72.9], [23.02, 72.57], [22.3, 72.6]] },
    { id: "gomati", rank: 14, axis: "ew",
      gen: { deva: "गोमत्याः", iast: "gomatyāḥ" }, stem: { deva: "गोमती", iast: "gomatī" }, dual: { deva: "गोमत्योः", iast: "gomatyoḥ" },
      pts: [[28.6, 80.1], [27.6, 80.5], [26.85, 80.95], [25.5, 83.2]] },
    { id: "sarayu", rank: 12, axis: "ew",
      gen: { deva: "सरय्वाः", iast: "sarayvāḥ" }, stem: { deva: "सरयू", iast: "sarayū" }, dual: { deva: "सरय्वोः", iast: "sarayvoḥ" },
      pts: [[27.4, 81.0], [26.8, 82.2], [26.3, 83.6]] },
    { id: "kshipra", rank: 15, axis: "ns",
      gen: { deva: "क्षिप्रायाः", iast: "kṣiprāyāḥ" }, stem: { deva: "क्षिप्रा", iast: "kṣiprā" }, dual: { deva: "क्षिप्रयोः", iast: "kṣiprayoḥ" },
      pts: [[23.5, 75.7], [23.18, 75.78], [22.75, 75.9]] },
    { id: "vegavati", rank: 16, axis: "ew",
      gen: { deva: "वेगवत्याः", iast: "vegavatyāḥ" }, stem: { deva: "वेगवती", iast: "vegavatī" }, dual: { deva: "वेगवत्योः", iast: "vegavatyoḥ" },
      pts: [[10.1, 77.6], [9.93, 78.12], [9.6, 78.8]] },
    { id: "purna", rank: 17, axis: "ew",
      gen: { deva: "पूर्णायाः", iast: "pūrṇāyāḥ" }, stem: { deva: "पूर्णा", iast: "pūrṇā" }, dual: { deva: "पूर्णयोः", iast: "pūrṇayoḥ" },
      pts: [[9.9, 77.15], [10.0, 76.6], [10.05, 76.3]] },
    { id: "brahmaputra", rank: 7, axis: "ew",
      gen: { deva: "ब्रह्मपुत्रस्य", iast: "brahmaputrasya" }, stem: { deva: "ब्रह्मपुत्र", iast: "brahmaputra" }, dual: { deva: "ब्रह्मपुत्रयोः", iast: "brahmaputrayoḥ" },
      pts: [[27.8, 95.3], [26.9, 94.2], [26.6, 92.8], [26.14, 91.74], [25.2, 89.7]] },
    { id: "vitasta", rank: 18, axis: "ns",
      gen: { deva: "वितस्तायाः", iast: "vitastāyāḥ" }, stem: { deva: "वितस्ता", iast: "vitastā" }, dual: { deva: "वितस्तयोः", iast: "vitastayoḥ" },
      pts: [[34.4, 75.2], [34.08, 74.8], [33.4, 74.0], [32.9, 73.7]] },
    { id: "candrabhaga", rank: 19, axis: "ns",
      gen: { deva: "चन्द्रभागायाः", iast: "candrabhāgāyāḥ" }, stem: { deva: "चन्द्रभागा", iast: "candrabhāgā" }, dual: { deva: "चन्द्रभागयोः", iast: "candrabhāgayoḥ" },
      pts: [[33.5, 76.0], [33.0, 75.0], [32.6, 74.0], [31.9, 72.9]] },
    { id: "satadru", rank: 20, axis: "ew",
      gen: { deva: "शतद्रु-नद्याः", iast: "śatadru-nadyāḥ" }, stem: { deva: "शतद्रु", iast: "śatadru" }, dual: { deva: "शतद्र्वोः", iast: "śatadrvoḥ" },
      pts: [[31.5, 76.9], [31.0, 76.0], [30.9, 75.0], [30.92, 74.0]] },
    { id: "iravati", rank: 21, axis: "ew",
      gen: { deva: "इरावत्याः", iast: "irāvatyāḥ" }, stem: { deva: "इरावती", iast: "irāvatī" }, dual: { deva: "इरावत्योः", iast: "irāvatyoḥ" },
      pts: [[32.6, 75.8], [32.1, 75.2], [31.8, 74.6]] },
  ];

  /* ---------- the tīrthas, by their own names ----------
     A kṣetra clause is not derivable — Ujjain is Mahākāla-kṣetra because the
     tradition says so, not because of where it sits. Named here, and only
     where the name is settled beyond doubt. */
  const KSETRA = {
    ujjain: { deva: "महाकाल-क्षेत्रे", iast: "mahākāla-kṣetre" },
    varanasi: { deva: "अविमुक्त-क्षेत्रे", iast: "avimukta-kṣetre" },
    prayagraj: { deva: "तीर्थराज-प्रयाग-क्षेत्रे", iast: "tīrtharāja-prayāga-kṣetre" },
    gaya: { deva: "गया-क्षेत्रे", iast: "gayā-kṣetre" },
    ayodhya: { deva: "अयोध्या-क्षेत्रे", iast: "ayodhyā-kṣetre" },
    mathura: { deva: "मथुरा-क्षेत्रे", iast: "mathurā-kṣetre" },
    vrindavan: { deva: "वृन्दावन-क्षेत्रे", iast: "vṛndāvana-kṣetre" },
    kurukshetra: { deva: "कुरुक्षेत्रे", iast: "kurukṣetre" },
    haridwar: { deva: "माया-क्षेत्रे", iast: "māyā-kṣetre" },
    badrinath: { deva: "बदरिकाश्रमे", iast: "badarikāśrame" },
    kedarnath: { deva: "केदार-क्षेत्रे", iast: "kedāra-kṣetre" },
    chitrakoot: { deva: "चित्रकूट-क्षेत्रे", iast: "citrakūṭa-kṣetre" },
    pushkar: { deva: "पुष्कर-क्षेत्रे", iast: "puṣkara-kṣetre" },
    dwarka: { deva: "द्वारका-क्षेत्रे", iast: "dvārakā-kṣetre" },
    somnath: { deva: "प्रभास-क्षेत्रे", iast: "prabhāsa-kṣetre" },
    omkareshwar: { deva: "ओंकार-क्षेत्रे", iast: "oṁkāra-kṣetre" },
    puri: { deva: "श्रीपुरुषोत्तम-क्षेत्रे", iast: "śrī-puruṣottama-kṣetre" },
    deoghar: { deva: "वैद्यनाथ-क्षेत्रे", iast: "vaidyanātha-kṣetre" },
    nashik: { deva: "पञ्चवटी-क्षेत्रे", iast: "pañcavaṭī-kṣetre" },
    pandharpur: { deva: "पण्डरी-क्षेत्रे", iast: "paṇḍarī-kṣetre" },
    tirupati: { deva: "शेषाचल-क्षेत्रे", iast: "śeṣācala-kṣetre" },
    srisailam: { deva: "श्रीशैल-क्षेत्रे", iast: "śrīśaila-kṣetre" },
    bhadrachalam: { deva: "भद्राचल-क्षेत्रे", iast: "bhadrācala-kṣetre" },
    kalahasti: { deva: "श्रीकालहस्ति-क्षेत्रे", iast: "śrī-kālahasti-kṣetre" },
    annavaram: { deva: "रत्नगिरि-क्षेत्रे", iast: "ratnagiri-kṣetre" },
    sringeri: { deva: "ऋष्यशृङ्ग-क्षेत्रे", iast: "ṛṣyaśṛṅga-kṣetre" },
    gokarna: { deva: "गोकर्ण-क्षेत्रे", iast: "gokarṇa-kṣetre" },
    udupi: { deva: "रजतपीठ-क्षेत्रे", iast: "rajata-pīṭha-kṣetre" },
    hampi: { deva: "किष्किन्धा-क्षेत्रे", iast: "kiṣkindhā-kṣetre" },
    kanchipuram: { deva: "काञ्ची-क्षेत्रे", iast: "kāñcī-kṣetre" },
    chidambaram: { deva: "चिदम्बर-क्षेत्रे", iast: "cidambara-kṣetre" },
    tiruchirappalli: { deva: "श्रीरङ्ग-क्षेत्रे", iast: "śrīraṅga-kṣetre" },
    madurai: { deva: "हालास्य-क्षेत्रे", iast: "hālāsya-kṣetre" },
    rameswaram: { deva: "सेतु-क्षेत्रे", iast: "setu-kṣetre" },
    kanyakumari: { deva: "कन्याकुमारी-क्षेत्रे", iast: "kanyā-kumārī-kṣetre" },
    thiruvananthapuram: { deva: "अनन्तपुर-क्षेत्रे", iast: "anantapura-kṣetre" },
    sabarimala: { deva: "शबरी-क्षेत्रे", iast: "śabarī-kṣetre" },
    thrissur: { deva: "वृषभाद्रि-क्षेत्रे", iast: "vṛṣabhādri-kṣetre" },
  };

  /* Where the tradition has a fixed phrase, it outranks the geometry. The
     confluence at Prayāga is not "the north bank of the Gaṅgā"; Paṇḍharpur
     stands on the Bhīmā but nobody there calls it that. */
  const FIXED = {
    prayagraj: { deva: "गङ्गा-यमुना-सरस्वती-सङ्गमे", iast: "gaṅgā-yamunā-sarasvatī-saṅgame" },
    pandharpur: { deva: "चन्द्रभागायाः तीरे", iast: "candrabhāgāyāḥ tīre" },
    varanasi: { deva: "गङ्गायाः पश्चिमे तीरे", iast: "gaṅgāyāḥ paścime tīre" },
    ujjain: { deva: "क्षिप्रायाः पूर्वे तीरे", iast: "kṣiprāyāḥ pūrve tīre" },
    rameswaram: { deva: "रत्नाकर-समुद्र-तीरे", iast: "ratnākara-samudra-tīre" },
    kanyakumari: { deva: "त्रिसमुद्र-सङ्गमे", iast: "tri-samudra-saṅgame" },
    badrinath: { deva: "अलकनन्दायाः तीरे", iast: "alakanandāyāḥ tīre" },
    kedarnath: { deva: "मन्दाकिन्याः तीरे", iast: "mandākinyāḥ tīre" },
    rishikesh: { deva: "गङ्गायाः पश्चिमे तीरे", iast: "gaṅgāyāḥ paścime tīre" },
    haridwar: { deva: "गङ्गायाः पश्चिमे तीरे", iast: "gaṅgāyāḥ paścime tīre" },
  };

  /* The Konkan and Malabar coasts are the one region where a river clause is
     the wrong instrument. West of the Sahyādri the rivers are short and the
     tradition places a rite by the range and the sea instead. */
  const COAST = { deva: "सह्याद्रेः पश्चिम-दिग्भागे, रत्नाकर-समुद्र-तीरे", iast: "sahyādreḥ paścima-digbhāge, ratnākara-samudra-tīre" };
  ["mumbai", "thane", "panaji", "mangaluru", "udupi", "gokarna", "kozhikode", "kannur", "alappuzha", "kollam"]
    .forEach((id) => { FIXED[id] = COAST; });

  /* ---------- geometry ----------
     Equirectangular, which is ample: the question is only which basin, and
     the nearest river is never a close call at this scale. */
  const KM = 111.195;
  function segDist(lat, lon, a, b) {
    const cl = Math.cos(lat * Math.PI / 180);
    const ax = (a[1] - lon) * cl, ay = a[0] - lat;
    const bx = (b[1] - lon) * cl, by = b[0] - lat;
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 ? -(ax * dx + ay * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    const px = ax + t * dx, py = ay + t * dy;
    return { km: Math.sqrt(px * px + py * py) * KM, t,
             /* the closest point ON the river, which is what the bank is
                measured against — running the segment out past its own ends
                to meet the place's longitude put Mumbai south of the Bhīmā
                and Badrīnāth south of the Gaṅgā */
             lat: a[0] + t * (b[0] - a[0]), lon: a[1] + t * (b[1] - a[1]) };
  }
  function nearest(river, lat, lon) {
    let best = null;
    for (let i = 0; i < river.pts.length - 1; i++) {
      const d = segDist(lat, lon, river.pts[i], river.pts[i + 1]);
      if (!best || d.km < best.km) best = d;
    }
    return best;
  }
  /* which bank — the place against the nearest point of the water. For an
     east–west river the banks are north and south; for one running north and
     south they are east and west. */
  function bank(river, lat, lon, hit) {
    if (river.axis === "ew") return lat >= hit.lat ? "uttare" : "dakṣiṇe";
    return lon >= hit.lon ? "pūrve" : "paścime";
  }
  const SIDE = {
    "uttare": { deva: "उत्तरे", iast: "uttare" },
    "dakṣiṇe": { deva: "दक्षिणे", iast: "dakṣiṇe" },
    "pūrve": { deva: "पूर्वे", iast: "pūrve" },
    "paścime": { deva: "पश्चिमे", iast: "paścime" },
  };
  const OPPOSITE = { "uttare": "dakṣiṇe", "dakṣiṇe": "uttare", "pūrve": "paścime", "paścime": "pūrve" };

  const IN_INDIA = (loc) =>
    /india/i.test(loc.region || "") ||
    (loc.lat > 6 && loc.lat < 37.5 && loc.lon > 67.5 && loc.lon < 97.5 && !/(nepal|lanka|pakistan|bangladesh|bhutan|myanmar)/i.test(loc.region || ""));

  /* the river clause for a place, or null when no basin is near enough */
  function river(loc) {
    if (FIXED[loc.id]) return FIXED[loc.id];
    if (!IN_INDIA(loc)) return null;
    const hits = RIVERS.map((r) => ({ r, hit: nearest(r, loc.lat, loc.lon) }))
      .sort((a, b) => a.hit.km - b.hit.km);
    const first = hits[0];
    if (!first || first.hit.km > 260) return null;
    const s1 = bank(first.r, loc.lat, loc.lon, first.hit);
    /* between two rivers — the form most of the Deccan actually uses. It needs
       both within reach AND the place genuinely between them: one river to the
       north of it, the other to the south. */
    const second = hits[1];
    if (second && second.hit.km < 260 && second.r.axis === first.r.axis) {
      const s2 = bank(second.r, loc.lat, loc.lon, second.hit);
      if (s2 === OPPOSITE[s1]) {
        const pair = [first.r, second.r].sort((a, b) => a.rank - b.rank);
        return {
          deva: pair[0].stem.deva + "-" + pair[1].dual.deva + " मध्य-प्रदेशे",
          iast: pair[0].stem.iast + "-" + pair[1].dual.iast + " madhya-pradeśe",
        };
      }
    }
    return {
      deva: first.r.gen.deva + " " + SIDE[s1].deva + " तीरे",
      iast: first.r.gen.iast + " " + SIDE[s1].iast + " tīre",
    };
  }

  /* ---------- the frames ----------
     bharata is the one every printed sheet in India carries. The other three
     are for places outside it, and only one of them leaves jambū-dvīpa:

       ketumala   the varṣa west of Meru
       bhadrasva  the varṣa east of Meru
       kraunca    a separate dvīpa, which a good many paṇḍitas give the Americas

     ketumāla and bhadrāśva are not inventions of this app — they stand in the
     same purāṇic list as bhāratavarṣa itself, the varṣas set around Meru
     (ilāvṛta at the centre, bhadrāśva east, ketumāla west, bhārata south,
     kuru north). That is why they carry no khaṇḍa: bhāratavarṣa is the one
     divided into nine, and giving the others a khaṇḍa would be making it up.
     kraunca is a different kind of claim — a school's identification of a
     landmass, not a reading of the cosmography — so it is offered, never
     asserted, and never chosen for the reciter without the note beside it. */
  const FRAMES = {
    bharata:   { deva: "जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, मेरोः दक्षिण-दिग्भागे,", iast: "jambū-dvīpe, bhārata-varṣe, bharata-khaṇḍe, meroḥ dakṣiṇa-digbhāge," },
    ketumala:  { deva: "जम्बूद्वीपे, केतुमाल-वर्षे, मेरोः पश्चिम-दिग्भागे,", iast: "jambū-dvīpe, ketumāla-varṣe, meroḥ paścima-digbhāge," },
    bhadrasva: { deva: "जम्बूद्वीपे, भद्राश्व-वर्षे, मेरोः पूर्व-दिग्भागे,", iast: "jambū-dvīpe, bhadrāśva-varṣe, meroḥ pūrva-digbhāge," },
    kraunca:   { deva: "क्रौञ्चद्वीपे, रमणक-वर्षे, ऐन्द्र-खण्डे, मेरोः पश्चिम-दिग्भागे,", iast: "krauñca-dvīpe, ramaṇaka-varṣe, aindra-khaṇḍe, meroḥ paścima-digbhāge," },
  };

  /* Meru stands at roughly the Pamir meridian, and the varṣas are named by
     which side of it you are on — so for everywhere outside Bhārata the
     proposal is geometry, not opinion. The Americas are the one exception:
     far enough west to be east of nothing, and the school that speaks about
     them at all speaks of krauñca. */
  const MERU_LON = 73;
  function suggest(loc) {
    if (IN_INDIA(loc)) return "bharata";
    const lon = loc.lon;
    if (lon <= -25 && lon >= -170) return "kraunca";
    return lon < MERU_LON ? "ketumala" : "bhadrasva";
  }

  /* The whole deśa clause as saṅkalpa segments. `seg` is the caller's own
     segment maker, so the emphasis and script handling stay where they are.
     `custom` is the reciter's override, which wins over everything. */
  function segs(loc, seg, custom, frameKey) {
    if (custom && custom.trim()) return [seg(custom.trim(), custom.trim(), true)];
    const frame = IN_INDIA(loc) ? FRAMES.bharata : (FRAMES[frameKey] || FRAMES[suggest(loc)] || FRAMES.bharata);
    const out = [seg(frame.deva, frame.iast)];
    const riv = river(loc);
    if (riv) out.push(seg(riv.deva + ",", riv.iast + ",", true));
    const ks = KSETRA[loc.id];
    if (ks) out.push(seg(ks.deva + ",", ks.iast + ",", true));
    return out;
  }

  /* a plain one-line description, for the settings row and the note */
  function describe(loc, lang) {
    const riv = river(loc), ks = KSETRA[loc.id];
    const parts = [];
    if (riv) parts.push(lang === "deva" ? riv.deva : riv.iast);
    if (ks) parts.push(lang === "deva" ? ks.deva : ks.iast);
    return parts.join(" · ");
  }

  /* the i18n key for each frame's button, so the pickers do not each keep
     their own copy of the mapping */
  const LABEL_KEY = { bharata: "frameBharata", ketumala: "frameKetumala", bhadrasva: "frameBhadrasva", kraunca: "frameKraunca" };

  return { segs, river, describe, suggest, inIndia: IN_INDIA, FRAMES, LABEL_KEY, KSETRA, RIVERS };
})();

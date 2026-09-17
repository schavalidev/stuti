/* ============================================================
   STUTI — the kṣaṇa: an observance that is an instant
   ------------------------------------------------------------
   Almost everything in this almanac is a tithi: an angle between
   the sun and the moon, running from some hour to some hour, and
   the day it belongs to is decided by which of its own hours the
   angle was standing in. Two things in the year are not like that
   at all. A saṅkrānti is the instant the sun crosses out of one
   rāśi into the next. A grahaṇa is the instant the moon's shadow
   touches, and then leaves, a disc. Neither can be found by a
   tithi rule, and neither is really a day — each is a moment with
   a window around it, and the window is the observance.

   That shared shape is why they belong in one module. The card
   the app draws for either one needs the same five things: the
   moment, the marks on either side of it, the window the rite is
   kept in, whether any of it clears this horizon, and the ground
   the rule rests on. The two feeders below fill that shape from
   two entirely different computations — the ephemeris's rāśi
   crossing, and the eclipse module's local contact times — and
   the card never learns which it is holding.

   Minutes throughout are minutes after local midnight at the
   place in hand, the same convention the pañcāṅga card uses, so
   a mark can legitimately read negative or past 1440 when an
   eclipse straddles midnight.
   ============================================================ */
window.STUTI_KSHANA = (function () {
  const P = () => window.AKSHARA_PANCHANGA;
  const EC = () => window.STUTI_ECLIPSE;

  /* One ghaṭikā is twenty-four minutes. The puṇyakāla of a saṅkrānti is
     counted in ghaṭikās either side of the crossing, and how many differs
     by saṅkrānti and by school — sixteen is the span Stuti prints, and the
     card says so rather than implying a settled number. */
  const GHATIKA = 24, PUNYA_GH = 16, PUNYA = GHATIKA * PUNYA_GH;

  const D = (y, m, d) => new Date(y, m, d);
  const dayKey = (d) => d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  const midnightJD = (d, tz) =>
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000 + 2440587.5 - tz / 24;

  /* Each name written whole, per language — the rāśi's nominative (మకరం,
     సింహం) is not its compound form (మకర, సింహ), so these are not built by
     joining the zodiac label to the word. */
  const SANKRANTI_NAME = [
    { iast: "Meṣa Saṅkrānti",     deva: "मेष सङ्क्रान्ति",     tel: "మేష సంక్రాంతి" },
    { iast: "Vṛṣabha Saṅkrānti",  deva: "वृषभ सङ्क्रान्ति",    tel: "వృషభ సంక్రాంతి" },
    { iast: "Mithuna Saṅkrānti",  deva: "मिथुन सङ्क्रान्ति",   tel: "మిథున సంక్రాంతి" },
    { iast: "Karkaṭa Saṅkrānti",  deva: "कर्कट सङ्क्रान्ति",   tel: "కర్కాటక సంక్రాంతి" },
    { iast: "Siṁha Saṅkrānti",    deva: "सिंह सङ्क्रान्ति",    tel: "సింహ సంక్రాంతి" },
    { iast: "Kanyā Saṅkrānti",    deva: "कन्या सङ्क्रान्ति",   tel: "కన్యా సంక్రాంతి" },
    { iast: "Tulā Saṅkrānti",     deva: "तुला सङ्क्रान्ति",    tel: "తులా సంక్రాంతి" },
    { iast: "Vṛścika Saṅkrānti",  deva: "वृश्चिक सङ्क्रान्ति", tel: "వృశ్చిక సంక్రాంతి" },
    { iast: "Dhanu Saṅkrānti",    deva: "धनु सङ्क्रान्ति",     tel: "ధను సంక్రాంతి" },
    { iast: "Makara Saṅkrānti",   deva: "मकर सङ्क्रान्ति",     tel: "మకర సంక్రాంతి" },
    { iast: "Kumbha Saṅkrānti",   deva: "कुम्भ सङ्क्रान्ति",   tel: "కుంభ సంక్రాంతి" },
    { iast: "Mīna Saṅkrānti",     deva: "मीन सङ्क्रान्ति",     tel: "మీన సంక్రాంతి" },
  ];

  const T = {
    grahanaCap:   { roman: "Grahaṇa", deva: "ग्रहण", tel: "గ్రహణం" },
    sankrantiCap: { roman: "Saṅkrānti", deva: "सङ्क्रान्ति", tel: "సంక్రాంతి" },
    sparsha:  { roman: "Sparśa", deva: "स्पर्श", tel: "స్పర్శ" },
    madhya:   { roman: "Madhya", deva: "मध्य", tel: "మధ్యం" },
    moksha:   { roman: "Mokṣa", deva: "मोक्ष", tel: "మోక్షం" },
    innerIn:  { roman: "Sammīlana", deva: "सम्मीलन", tel: "సమ్మీలనం" },
    innerOut: { roman: "Unmīlana", deva: "उन्मीलन", tel: "ఉన్మీలనం" },
    sankramana: { roman: "Saṅkramaṇa", deva: "सङ्क्रमण", tel: "సంక్రమణం" },
    punyakala:  { roman: "Puṇyakāla", deva: "पुण्यकाल", tel: "పుణ్యకాలం" },
    keptSpan:   { roman: "Kept in", deva: "कर्म काल", tel: "కర్మ కాలం" },
    sources:    { roman: "Sources", deva: "स्रोत", tel: "మూలాలు" },
    yesterday:  { roman: "yesterday", deva: "बीता कल", tel: "నిన్న" },
    tomorrow:   { roman: "tomorrow", deva: "कल", tel: "రేపు" },
    ghatikaU:   { roman: "ghaṭikā", deva: "घटिका", tel: "ఘటికలు" },
    sutaka:     { roman: "Sūtaka", deva: "सूतक", tel: "సూతకం" },
    unseen:  { roman: "Nothing of it clears this horizon", deva: "यहाँ के क्षितिज पर कुछ भी नहीं", tel: "ఇక్కడి క్షితిజంపై ఏదీ కనిపించదు" },
    notReckoned: { roman: "Not reckoned for observance", deva: "व्रत हेतु अगण्य", tel: "వ్రతానికి లెక్కించరు" },
    seenHere:{ roman: "Above the horizon here", deva: "यहाँ क्षितिज के ऊपर", tel: "ఇక్కడ క్షితిజం పైన" },
    keptNext:{ roman: "The crossing falls after sunset, so the puṇyakāla is kept the next morning",
               deva: "सङ्क्रमण सूर्यास्त के बाद हो रहा है, इसलिए पुण्यकाल अगले दिन सुबह लिया जाता है।",
               tel: "సంక్రమణం సూర్యాస్తమయం తరువాత వస్తోంది, అందుకే పుణ్యకాలం మరుసటి ఉదయం తీసుకోవాలి." },
  };
  /* the two feeders name things in two vocabularies: the module's own strings
     carry `roman`, the eclipse module's NAME/TYPE tables carry `iast`. Either
     is the Roman reading, so both are accepted rather than normalised — the
     eclipse tables are shared with the pañcāṅga card and are not ours to
     rewrite. */
  const pick = (o, lang) => {
    if (!o) return "";
    const rm = o.roman || o.iast || "";
    return (lang === "telugu" ? (o.tel || rm) : lang === "deva" ? (o.deva || rm) : rm) || rm;
  };

  const SRC = {
    ds: { label: "Dharma Sindhu — saṅkrānti puṇyakāla, grahaṇa snāna", url: "https://www.kamakoti.org/kamakoti/dharmasindhu/bookview.php?chapnum=26" },
    geo:{ label: "Contact times computed locally — parallax from the observer's own place", url: null },
  };

  /* ---------- the grahaṇa feeder ----------
     The eclipse module has already done the hard part: it returns the
     contacts as minutes on this civil day, marks the event unseen when
     the sky here is empty, and names the eclipse from the shadow itself
     when the geometry belongs to some other longitude. All this does is
     lay those out in the shared shape. */
  function fromGrahana(gr) {
    if (!gr) return null;
    const marks = [];
    const add = (key, min) => { if (min != null) marks.push({ key, label: T[key], min }); };
    add("sparsha", gr.beginMin);
    add("innerIn", gr.innerBeginMin);
    add("madhya", gr.maxMin);
    add("innerOut", gr.innerEndMin);
    add("moksha", gr.endMin);
    const band = gr.beginMin != null && gr.endMin != null ? { start: gr.beginMin, end: gr.endMin } : null;
    const inner = gr.innerBeginMin != null && gr.innerEndMin != null
      ? { start: gr.innerBeginMin, end: gr.innerEndMin } : null;
    /* the span the rite is kept in is not the whole event but the part of it
       that stands above this horizon — an eclipse half-set carries the rite
       only while it is up */
    /* An upacchāyā eclipse is not a grahaṇa for observance. The moon never
       reaches the umbra; the dimming is beyond the eye, and the nirṇaya that
       governs sūtaka and the snāna-japa does not reckon it. Printed almanacs
       list it as a fact about the sky and nothing more, and now that the node
       gate is wide enough to find these events the card has to say so — an
       hour of fast asserted for an eclipse nobody can see is worse than the
       silence it replaced. */
    const reckoned = gr.type !== "penumbral";
    const kept = reckoned && gr.visible && gr.seenFromMin != null && gr.seenToMin != null
      ? { start: gr.seenFromMin, end: gr.seenToMin } : null;
    /* sūtaka: the fast before the touch — four praharas (twelve hours) for a
       solar eclipse, three (nine hours) for a lunar, counted back from sparśa.
       Only meaningful where the eclipse is actually seen. It is an order of
       magnitude longer than the eclipse itself, which is why the card states
       it as its own hour and keeps it off the line of time. */
    const sutakaMins = (gr.kind === "solar" ? 4 : 3) * 180;
    const sutaka = kept ? { start: kept.start - sutakaMins, end: kept.start } : null;
    return {
      id: "grahana", kind: "grahana",
      cap: T.grahanaCap,
      name: gr.name, type: gr.typeName,
      marks, band, inner, kept, sutaka,
      visible: !!gr.visible, elsewhere: !!gr.elsewhere, reckoned,
      local: true,
      metric: gr.kind === "solar"
        ? { label: { roman: "Obscuration", deva: "ग्रस्त भाग", tel: "గ్రస్త భాగం" }, value: Math.round(gr.obscuration * 100) + "%" }
        : { label: { roman: "Magnitude", deva: "मान", tel: "మానం" }, value: gr.magnitude.toFixed(2) },
      rules: !reckoned ? [] : [
        { roman: "Do not eat and do not do pūjā while the eclipse lasts.",
          deva: "ग्रहण के समय कुछ नहीं खाना चाहिए और पूजा नहीं करनी चाहिए।",
          tel: "గ్రహణం ఉన్నంతసేపు భోజనం చేయకూడదు, పూజ చేయకూడదు." },
        { roman: "Bathe when the eclipse begins — at sparśa.",
          deva: "ग्रहण शुरू होते ही, स्पर्श के समय, स्नान करना चाहिए।",
          tel: "గ్రహణం మొదలయ్యేప్పుడు, అంటే స్పర్శ సమయంలో, స్నానం చేయాలి." },
        { roman: "Do japa and give dāna through the span.",
          deva: "ग्रहण के समय जप और दान करना चाहिए।",
          tel: "గ్రహణ సమయంలో జపం, దానం చేయాలి." },
        { roman: "Bathe again after mokṣa, and only then eat.",
          deva: "मोक्ष के बाद फिर से स्नान करना चाहिए; उसके बाद ही भोजन करें।",
          tel: "మోక్షం తరువాత మళ్ళీ స్నానం చేయాలి; ఆ తరువాతే భోజనం చేయాలి." },
      ],
      caveat: !reckoned ? {
        roman: "An upacchāyā grahaṇa is not reckoned an eclipse for observance: the moon passes through the outer shadow only, the dimming is below what the eye can catch, and no sūtaka or snāna falls due. It is named because it is a fact about the sky.",
        deva: "उपच्छाया ग्रहण को व्रत के लिए ग्रहण नहीं माना जाता। चन्द्रमा सिर्फ बाहर की छाया से होकर निकलता है, और इतना हल्का मलिन होता है कि आँख से पता नहीं चलता। इसलिए न सूतक लगता है, न स्नान करना पड़ता है। यह केवल आकाश की बात है, इसीलिये दिन इसका नाम लेता है।",
        tel: "ఉపచ్ఛాయ గ్రహణాన్ని వ్రతానికి గ్రహణంగా లెక్కించరు. చంద్రుడు బయటి ఛాయలో మాత్రమే వెళ్ళి వస్తాడు; తగ్గే వెలుతురు కంటికి కనిపించనంత తక్కువ. అందుకే సూతకం లేదు, స్నానం చేయాల్సిన అవసరం లేదు. ఇది ఆకాశంలో జరిగే విషయం మాత్రమే, అందుకే రోజు దాని పేరు చెబుతుంది.",
      } : gr.visible ? null : {
        roman: "An eclipse below the horizon carries no vrata here. The day names it because it is a fact about the sky, not because anything falls due.",
        deva: "क्षितिज के नीचे का ग्रहण यहाँ कोई व्रत नहीं लाता। दिन इसका नाम लेता है क्योंकि यह आकाश की बात है, इसलिए नहीं कि कुछ करना है।",
        tel: "క్షితిజం క్రింద జరిగే గ్రహణానికి ఇక్కడ ఏ వ్రతమూ లేదు. ఇది ఆకాశంలో జరిగే విషయం కాబట్టి రోజు దాని పేరు చెబుతుంది — చేయాల్సిన పని ఉంది కాబట్టి కాదు.",
      },
      sources: [SRC.geo, SRC.ds],
    };
  }

  /* ---------- the saṅkrānti feeder ----------
     The ephemeris knows the crossing to the minute. What it does not know
     is which day the observance sits on, and that is the only judgement
     here: a crossing after sunset moves its puṇyakāla to the next morning,
     which is why Makara Saṅkrānti is sometimes the fourteenth of January
     and sometimes the fifteenth. */
  function sankrantiFor(date, loc) {
    const Pa = P(); if (!Pa) return null;
    const y = date.getFullYear();
    let hit = null;
    for (const yr of [y - 1, y, y + 1]) {
      let list = [];
      try { list = Pa.sankrantis(yr) || []; } catch (e) {}
      for (const s of list) {
        const tz = Pa.effTz(loc, date);
        const mins = (s.jd - midnightJD(date, tz)) * 1440;
        if (mins > -720 && mins < 2160) { hit = { s, mins, tz }; break; }
      }
      if (hit) break;
    }
    return hit;
  }

  function fromSankranti(date, loc) {
    const Pa = P(); if (!Pa) return null;
    const h = sankrantiFor(date, loc);
    if (!h) return null;
    const { s, mins, tz } = h;
    const rashi = (Pa.RASHI || [])[s.rashi];
    if (!rashi) return null;

    /* the day the crossing's own civil date is, and the day it is kept on */
    const crossDay = D(date.getFullYear(), date.getMonth(), date.getDate() + (mins < 0 ? -1 : mins >= 1440 ? 1 : 0));
    let pa = null; try { pa = Pa.forDay(crossDay, loc); } catch (e) {}
    const offset = (crossDay - D(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000 * 1440;
    const crossMin = mins - offset;          // minutes within crossDay
    const afterSunset = pa && pa.sunset != null && crossMin > pa.sunset;
    const keptDay = afterSunset ? D(crossDay.getFullYear(), crossDay.getMonth(), crossDay.getDate() + 1) : crossDay;
    if (dayKey(keptDay) !== dayKey(date)) return null;

    let kpa = pa; if (afterSunset) { try { kpa = Pa.forDay(keptDay, loc); } catch (e) {} }
    /* the instant, in minutes on the day being shown — negative when the
       crossing was yesterday evening and the puṇyakāla is this morning */
    const instant = mins;

    /* sixteen ghaṭikās either side, clipped to the kept day's own light.
       A crossing at night has no daylight of its own to share, so the
       window opens at sunrise and runs its sixteen ghaṭikās from there —
       the prātaḥ-snāna rule every printed almanac falls back on. */
    let punya = null;
    if (kpa && kpa.sunrise != null && kpa.sunset != null) {
      if (afterSunset) punya = { start: kpa.sunrise, end: Math.min(kpa.sunrise + PUNYA, kpa.sunset) };
      else {
        const a = Math.max(instant - PUNYA, kpa.sunrise), b = Math.min(instant + PUNYA, kpa.sunset);
        punya = b > a ? { start: a, end: b } : { start: kpa.sunrise, end: Math.min(kpa.sunrise + PUNYA, kpa.sunset) };
      }
    }
    const marks = [{ key: "sankramana", label: T.sankramana, min: instant }];

    return {
      id: "sankranti-" + s.rashi, kind: "sankranti",
      cap: T.sankrantiCap,
      name: SANKRANTI_NAME[s.rashi] || { iast: rashi.iast + " Saṅkrānti", deva: rashi.deva + " सङ्क्रान्ति", tel: rashi.tel + " సంక్రాంతి" },
      type: null,
      marks, band: punya, inner: null, kept: punya, sutaka: null,
      visible: true, elsewhere: false, local: false,
      instant, afterSunset,
      metric: punya ? {
        label: T.punyakala,
        /* the badge reads off the window actually shown, not the nominal
           sixteen: a crossing after sunset gets sixteen ghaṭikās from
           sunrise rather than thirty-two around the moment, and a long
           summer day clips the span to its own light either way */
        value: {
          roman: Math.round((punya.end - punya.start) / GHATIKA) + " " + T.ghatikaU.roman,
          deva: Math.round((punya.end - punya.start) / GHATIKA) + " " + T.ghatikaU.deva,
          tel: Math.round((punya.end - punya.start) / GHATIKA) + " " + T.ghatikaU.tel,
        },
      } : null,
      rules: [
        { roman: "Bathe, give dāna and do the tila tarpaṇa in the puṇyakāla — not at any other hour of the day.",
          deva: "पुण्यकाल में स्नान करना चाहिए, दान देना चाहिए और तिल तर्पण करना चाहिए — दिन के दूसरे समय में नहीं।",
          tel: "పుణ్యకాలంలో స్నానం చేయాలి, దానం ఇవ్వాలి, తిల తర్పణం చేయాలి — రోజులో మిగిలిన సమయంలో కాదు." },
        { roman: "Do not begin anything in the six ghaṭikās before the crossing — the sun is between two houses then.",
          deva: "सङ्क्रमण से पहले की जो छह घटिका हैं, उनमें कोई नया काम शुरू नहीं करना चाहिए — उस समय सूर्य दो राशियों के बीच में रहता है।",
          tel: "సంక్రమణానికి ముందు ఉండే ఆరు ఘటికలలో కొత్త పని మొదలుబెట్టకూడదు — అప్పుడు సూర్యుడు రెండు రాశుల నడుమ ఉంటాడు." },
      ],
      caveat: afterSunset ? T.keptNext : null,
      note: {
        roman: "How many ghaṭikās the puṇyakāla runs differs by saṅkrānti and by school. Stuti prints sixteen either side of the crossing, clipped to the day's light, and names the rule rather than hiding it.",
        deva: "पुण्यकाल कितनी घटिका का होता है, यह सङ्क्रान्ति और परम्परा के अनुसार बदलता रहता है। स्तुति सङ्क्रमण के दोनों ओर सोलह घटिका लेती है, उसे दिन के उजाले तक ही रखती है, और कौन सा नियम लिया है यह साफ़ बता देती है।",
        tel: "పుణ్యకాలం ఎన్ని ఘటికలు అనేది సంక్రాంతిని, సంప్రదాయాన్ని బట్టి మారుతుంటుంది. స్తుతి సంక్రమణానికి ఇరువైపులా పదహారు ఘటికలు తీసుకుంటుంది, పగటి వెలుతురు వరకే పరిమితం చేస్తుంది, ఏ నియమం తీసుకుందో స్పష్టంగా చెప్తుంది.",
      },
      sources: [SRC.ds],
    };
  }

  /* ---------- what stands on a day ----------
     At most one of each, and in practice never both — the two events are a
     fortnight's phases apart by construction. Returned as a list anyway,
     so the caller does not have to know that. */
  const cache = {};
  function forDay(date, loc, pa) {
    if (!loc) return [];
    const key = dayKey(date) + "|" + loc.lat.toFixed(2) + "," + loc.lon.toFixed(2);
    if (cache[key]) return cache[key];
    const out = [];
    try {
      const gr = pa && pa.grahana !== undefined ? pa.grahana : (EC() ? EC().forDay(date, loc) : null);
      if (gr) {
        if (!gr.name && EC()) { gr.name = EC().NAME[gr.kind]; gr.typeName = EC().TYPE[gr.type]; }
        const k = fromGrahana(gr); if (k) out.push(k);
      }
    } catch (e) {}
    try { const k = fromSankranti(date, loc); if (k) out.push(k); } catch (e) {}
    return (cache[key] = out);
  }

  return { forDay, fromGrahana, fromSankranti, pick, T, GHATIKA, PUNYA_GH };
})();

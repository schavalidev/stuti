import { STUTI_EPHEM } from "./stuti-ephemeris";
import { STUTI_KSHANA } from "./stuti-kshana-core";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { STUTI_PREFS } from "./stuti-prefs";
import { STUTI_LOC } from "./stuti-store";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — the tarpaṇa rule engine
   Written against the Tarpaṇa Calendar & Ritual Logic spec, and
   its first principle: a rite's DAY, its HOUR, and its PROCEDURE
   are three different questions, and none may be inferred from
   another. So every rite here carries a decision kāla (which day
   it is), a performance kāla (when in that day), an optional day
   offset, a badge, a status, and the sources its rule rests on.

   Stuti is prayoga-neutral by choice: what is shown is what the
   traditions agree on, and where they part the card says so and
   points out rather than picking. Where the spec marks a rule for
   nirṇaya review — Bhīṣma's dual-day aṣṭamī, the Kṛṣṇāṅgāraka
   overlap — nothing is invented: both candidates are named.

   Nothing here asks whether a father is living. That is a real
   rule of adhikāra, but it is one input among several and the
   spec is explicit that it is not a switch that hides rites; the
   reciter's own paddhati decides, so the cards say who a rite
   belongs to and leave the judgement where it lives.
   ============================================================ */
export const STUTI_TARPANA = (function () {
  const P = () => AKSHARA_PANCHANGA;
  const E = () => STUTI_EPHEM;
  const MASA = { caitra: 0, vaisakha: 1, jyeshtha: 2, ashadha: 3, shravana: 4, bhadrapada: 5,
                 ashvina: 6, kartika: 7, margashirsha: 8, pausha: 9, magha: 10, phalguna: 11 };
  const AMAVASYA = 29, CATURDASHI = 28, ASHTAMI = 7, PURNIMA = 14;
  let lunar = null, monthStart = null, governed = null, ref = null;

  /* ---------- the reciter's place ----------
     A rite whose day turns on a mid-afternoon or a moonrise instant must be
     reckoned where the reciter stands, or the day and the hour on the same
     card come from two different cities. */
  function place() {
    try {
      const LOC = STUTI_LOC, LOCS = P().locations;
      const id = LOC && LOC.getLocId(), det = LOC && LOC.getDetected();
      if (id === "detected" && det) return det;
      return LOCS.find((l) => l.id === id) || (ref ? ref() : LOCS[0]);
    } catch (e) { return ref ? ref() : null; }
  }
  const placeKey = (p) => p ? (p.id || "") + ":" + p.lat + "," + p.lon : "-";
  const dayKeyOf = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const D = (y, m, d) => new Date(y, m, d);

  /* ---------- the kāla engine ----------
     Daylight in five equal parts, not clock hours: aparāhṇa is the fourth
     fifth of the day's own light, which in December is not where it is in
     June. Kutapa and Rohiṇa are muhūrtas eight and nine of the day's fifteen.
     Each code answers two different questions — the INSTANT that decides a
     day, and the WINDOW a rite is performed in. */
  const KALA = {
    udaya:      { label: { roman: "Sunrise", deva: "सूर्योदय", tel: "సూర్యోదయం" } },
    pratah:     { label: { roman: "Prātaḥ", deva: "प्रातः", tel: "ప్రాతః" } },
    sangava:    { label: { roman: "Saṅgava", deva: "सङ्गव", tel: "సంగవం" } },
    madhyahna:  { label: { roman: "Madhyāhna", deva: "मध्याह्न", tel: "మధ్యాహ్నం" } },
    aparahna:   { label: { roman: "Aparāhṇa", deva: "अपराह्ण", tel: "అపరాహ్ణం" } },
    sayahna:    { label: { roman: "Sāyāhna", deva: "सायाह्न", tel: "సాయాహ్నం" } },
    kutapa:     { label: { roman: "Kutapa", deva: "कुतप", tel: "కుతపం" } },
    rohina:     { label: { roman: "Rohiṇa", deva: "रोहिण", tel: "రోహిణం" } },
    arunodaya:  { label: { roman: "Aruṇodaya", deva: "अरुणोदय", tel: "అరుణోదయం" } },
    chandrodaya:{ label: { roman: "Candrodaya", deva: "चन्द्रोदय", tel: "చంద్రోదయం" } },
    overlap:    { label: { roman: "Caturdaśī joined with the Tuesday", deva: "मङ्गलवार से युक्त चतुर्दशी", tel: "మంగళవారంతో కూడిన చతుర్దశి" } },
    grahana:    { label: { roman: "The eclipse", deva: "ग्रहण", tel: "గ్రహణం" } },
    sankranti:  { label: { roman: "Saṅkrānti puṇyakāla", deva: "सङ्क्रान्ति पुण्यकाल", tel: "సంక్రాంతి పుణ్యకాలం" } },
  };

  /* the window a kāla names, in minutes after local midnight at `loc` */
  function window_(kala, pa) {
    if (!pa || pa.sunrise == null || pa.sunset == null) return null;
    const r = pa.sunrise, s = pa.sunset, day = s - r, fifth = day / 5, muh = day / 15;
    switch (kala) {
      case "udaya":       return { start: r, end: r + fifth / 3 };
      case "pratah":      return { start: r, end: r + fifth };
      case "sangava":     return { start: r + fifth, end: r + fifth * 2 };
      case "madhyahna":   return { start: r + fifth * 2, end: r + fifth * 3 };
      case "aparahna":    return { start: r + fifth * 3, end: r + fifth * 4 };
      case "sayahna":     return { start: r + fifth * 4, end: s };
      case "kutapa":      return { start: r + muh * 7, end: r + muh * 8 };
      case "rohina":      return { start: r + muh * 8, end: r + muh * 9 };
      case "arunodaya":   return { start: r - 96, end: r };
      case "chandrodaya": { const m = pa.moonrise != null ? pa.moonrise : pa.moonriseNext; return m == null ? null : { start: m, end: m + 48 }; }
      default: return null;
    }
  }
  /* the single instant a kāla is tested at, when a day is being decided */
  function instant(kala, pa) {
    const w = window_(kala, pa);
    if (!w) return null;
    if (kala === "chandrodaya" || kala === "arunodaya" || kala === "udaya") return w.start;
    return (w.start + w.end) / 2;
  }
  const jdOf = (day, mins, tz) =>
    Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) / 86400000 + 2440587.5 + mins / 1440 - tz / 24;
  function tithiAt(day, kala, loc) {
    const Pa = P(), Ep = E();
    if (!Ep) return null;
    const pa = Pa.forDay(day, loc), mins = instant(kala, pa);
    if (mins == null) return null;
    return { ti: Math.floor(Ep.elong(jdOf(day, mins, Pa.effTz(loc, day))) / 12), mins: mins };
  }

  /* Which civil day a tithi belongs to: not "where does its sunrise fall" but
     "which day's own hour is it running at". Every tarpaṇa day goes through
     here — deriving one by adding a day to another rite's date is how a
     caturdaśī morning becomes a trayodaśī morning. */
  function dayCarrying(anchor, ti, kala, loc) {
    if (!anchor) return null;
    for (const off of [0, -1, 1, -2, 2]) {
      const day = D(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + off);
      const t = tithiAt(day, kala, loc);
      if (t && t.ti === ti) return day;
    }
    return null;
  }
  /* both candidates, when a tithi spans two days at the tested hour — the
     spec's answer for Bhīṣma: name them, do not choose */
  function daysCarrying(anchor, ti, kala, loc) {
    const out = [];
    for (const off of [-2, -1, 0, 1, 2]) {
      const day = D(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + off);
      const t = tithiAt(day, ti, loc) === null ? null : tithiAt(day, kala, loc);
      if (t && t.ti === ti) out.push(day);
    }
    return out;
  }

  /* ---------- the reciter's ritual profile ----------
     Optional, every field. Unset means "assume nothing": the rite is shown
     with a note rather than hidden or guessed at. */
  function profile() {
    let p = {};
    try { p = STUTI_PREFS.get().ritual || {}; } catch (e) {}
    return { veda: p.veda || "", shakha: p.shakha || "", sutra: p.sutra || "", gotra: p.gotra || "", pravara: p.pravara || "" };
  }

  const SRC = {
    ds23: { label: "Dharma Sindhu 23 — Brahma-yajña tarpaṇa", url: "https://www.kamakoti.org/kamakoti/dharmasindhu/bookview.php?chapnum=23" },
    ds25: { label: "Dharma Sindhu 25 — adhikāra, jīvat-pitṛ", url: "https://www.kamakoti.org/kamakoti/dharmasindhu/bookview.php?chapnum=25" },
    ds26: { label: "Dharma Sindhu 26 — śrāddha, tila tarpaṇa", url: "https://www.kamakoti.org/kamakoti/dharmasindhu/bookview.php?chapnum=26" },
    ds8:  { label: "Dharma Sindhu 8 — Dīpāvali, Naraka Caturdaśī", url: "https://www.kamakoti.org/kamakoti/dharmasindhu/bookview.php?chapnum=8" },
    kanchiYama: { label: "Kanchi VDSP — Kṛṣṇāṅgāraka Yama Tarpaṇam", url: "https://kamakoti.github.io/prakashanam/VDSP/YamaTarpanam/" },
    kanchi: { label: "Kanchi Prakāśanam — annual ritual calendar", url: "https://kamakoti.github.io/prakashanam/" },
    vyoma: { label: "Vyoma — Bhīṣmāṣṭamī (Laugākṣī Smṛti)", url: "https://www.vyoma.org/blog-post/bhishma-ashtami/" },
    sd: { label: "SanskritDocuments — Pitṛ Tarpaṇam (secondary)", url: "https://sanskritdocuments.org/sites/puja/pitratarpaNam_unic.html" },
  };

  /* ============ the named-day rites ============ */
  const amCache = {}, narakaCache = {}, bhCache = {}, angCache = {};

  function amavasyaDay(y, m) {
    const loc = place(), ck = y + "/" + m + "|" + placeKey(loc);
    if (amCache[ck] !== undefined) return amCache[ck];
    const from = (typeof m === "number") ? D(y, m, 1) : new Date();
    const d = P().nextTithiFrom(from, AMAVASYA, loc);
    amCache[ck] = d ? (dayCarrying(d, AMAVASYA, "aparahna", loc) || d) : null;
    return amCache[ck];
  }
  /* Naraka Caturdaśī — anchored to Dīpāvalī's amāvāsyā so the two festivals
     cannot drift apart, but decided at candrodaya per Dharma Sindhu 8 */
  function narakaDay(y) {
    const loc = place(), ck = y + "|" + placeKey(loc);
    if (narakaCache[ck] !== undefined) return narakaCache[ck];
    const V = STUTI_VRATA;
    let dip = null;
    try { const v = V && V.all().find((x) => x.id === "dipavali"); if (v) dip = v.find(y); } catch (e) {}
    narakaCache[ck] = dip
      ? (dayCarrying(dip, CATURDASHI, "chandrodaya", loc) || dayCarrying(dip, CATURDASHI, "arunodaya", loc)
         || D(dip.getFullYear(), dip.getMonth(), dip.getDate() - 1))
      : null;
    return narakaCache[ck];
  }
  /* Bhīṣmāṣṭamī. The spec flags the dual-day aṣṭamī for nirṇaya review, so
     both candidates are computed and the card says the schools differ; the
     earlier day is offered as the date, which is what a calendar must print. */
  function bhishmaDays(y) {
    const loc = place(), ck = y + "|" + placeKey(loc);
    if (bhCache[ck] !== undefined) return bhCache[ck];
    const anchor = lunar ? lunar(y, MASA.magha, ASHTAMI) : null;
    let days = [];
    if (anchor) {
      for (const off of [-1, 0, 1]) {
        const day = D(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + off);
        const u = tithiAt(day, "udaya", loc), md = tithiAt(day, "madhyahna", loc);
        if ((u && u.ti === ASHTAMI) || (md && md.ti === ASHTAMI)) days.push(day);
      }
      if (!days.length) days = [anchor];
    }
    bhCache[ck] = days;
    return days;
  }
  /* Kṛṣṇāṅgāraka Caturdaśī — a Tuesday joined with kṛṣṇa caturdaśī. The
     overlap rule is source-specific and the spec forbids inventing a
     tie-break, so the test is the plain one and the card states it: caturdaśī
     running at any point in that Tuesday's daylight. */
  function angarakaDays(y, m) {
    const loc = place(), ck = y + "/" + m + "|" + placeKey(loc);
    if (angCache[ck] !== undefined) return angCache[ck];
    const out = [];
    const last = new Date(y, m + 1, 0).getDate();
    for (let dd = 1; dd <= last; dd++) {
      const day = D(y, m, dd);
      if (day.getDay() !== 2) continue;
      const a = tithiAt(day, "udaya", loc), b = tithiAt(day, "sayahna", loc);
      if ((a && a.ti === CATURDASHI) || (b && b.ti === CATURDASHI)) out.push(day);
    }
    angCache[ck] = out;
    return out;
  }

  function forget() {
    [amCache, narakaCache, bhCache, angCache, dayCache, shanCache, mahCache, yogaCache].forEach((c) => { for (const k in c) delete c[k]; });
  }
  try { if (STUTI_LOC) STUTI_LOC.subscribe(forget); } catch (e) {}

  /* ---------- rule metadata, keyed by rite id ----------
     The card and the "why this date" drawer read from here; nothing about a
     rule is written twice. */
  const RULES = {
    "pitru-tarpanam": {
      badge: "core", status: "verified", decision: "aparahna", performance: "aparahna", offset: 0,
      trigger: { roman: "Every amāvāsyā", deva: "प्रत्येक अमावस्या", tel: "ప్రతి అమావాస్య" },
      rule: { roman: "The amāvāsyā running at aparāhṇa — the fourth fifth of the day's own light — carries the offering. A new moon that has already ended by then belongs, for this purpose, to the day before.",
              tel: "అపరాహ్ణ కాలంలో (దినపు నాలుగవ భాగంలో) నడుస్తున్న అమావాస్యే తర్పణాన్ని మోస్తుంది. అప్పటికే ముగిసిన అమావాస్య ఈ విషయంలో ముందు రోజుకే చెందుతుంది." },
      sources: [SRC.ds26, SRC.sd],
    },
    "yama-tarpanam": {
      badge: "core", status: "verified", decision: "chandrodaya", performance: "arunodaya", offset: 0,
      trigger: { roman: "Naraka Caturdaśī", deva: "नरक चतुर्दशी", tel: "నరక చతుర్దశి" },
      rule: { roman: "Dharma Sindhu decides the Naraka Caturdaśī bath by the caturdaśī prevailing at moonrise. The tarpaṇam follows the bath, before sunrise — so the day is settled at candrodaya and the rite performed at aruṇodaya. Subtracting a day from Dīpāvalī gives a trayodaśī morning whenever caturdaśī and amāvāsyā share a date.",
              tel: "నరక చతుర్దశి స్నానాన్ని ధర్మసింధు చంద్రోదయ సమయంలో ఉన్న చతుర్దశిని బట్టి నిర్ణయిస్తుంది. తర్పణం స్నానం తరువాత, సూర్యోదయానికి ముందు — రోజు చంద్రోదయంతో, కర్మ అరుణోదయంలో. దీపావళి నుండి ఒక రోజు తీసేస్తే త్రయోదశి ఉదయమే వస్తుంది." },
      sources: [SRC.ds8],
    },
    "yama-angaraka": {
      badge: "prayoga", status: "review", decision: "udaya", performance: "aparahna", offset: 0,
      trigger: { roman: "Any Tuesday joined with kṛṣṇa caturdaśī", deva: "कृष्ण चतुर्दशी से युक्त मङ्गलवार", tel: "కృష్ణ చతుర్దశితో కూడిన మంగళవారం" },
      rule: { roman: "Kanchi's Veda Dharma Śāstra Sabha publishes this as a Yama tarpaṇam day, and says it applies even to those who do not ordinarily keep the amāvāsyā tarpaṇam. The month varies: the trigger is weekday, pakṣa and tithi together. The overlap rule is source-specific — Stuti tests whether caturdaśī runs at any point in that Tuesday's daylight, and does not invent a tie-break for a partial overlap.",
              tel: "కంచి వేద ధర్మ శాస్త్ర సభ ఈ రోజును యమ తర్పణ దినంగా ప్రకటిస్తుంది; సాధారణంగా అమావాస్య తర్పణం చేయనివారికీ ఇది వర్తిస్తుందని చెబుతుంది. మాసం మారుతుంది — వారం, పక్షం, తిథి కలయికే నియమం. అతివ్యాప్తి నియమం మూలాన్ని బట్టి మారుతుంది; స్తుతి ఆ మంగళవారపు పగటిలో ఎప్పుడైనా చతుర్దశి నడుస్తోందా అని చూస్తుంది, పాక్షిక అతివ్యాప్తికి తనంతట నిర్ణయం చేయదు." },
      sources: [SRC.kanchiYama, SRC.kanchi],
    },
    "bhishma-tarpanam": {
      badge: "core", status: "review", decision: "udaya", performance: "madhyahna", offset: 0,
      trigger: { roman: "Māgha śukla aṣṭamī", deva: "माघ शुक्ल अष्टमी", tel: "మాఘ శుద్ధ అష్టమి" },
      rule: { roman: "A named annual arghya, not a pitṛ rite: Bhīṣma died sonless, so it is offered in his own pravara by whoever offers it, and the traditions permit it even where the father is living. When aṣṭamī spans two civil days the nirṇaya differs by prayoga — some traditions separate the Bhīṣma śrāddha day from the snāna-and-tarpaṇa day — so Stuti names both candidates rather than choosing one.",
              tel: "ఇది నామాంకిత వార్షిక అర్ఘ్యం, పితృ కర్మ కాదు: భీష్మునికి పుత్రుడు లేడు, కాబట్టి ఇచ్చినవారే ఆయన ప్రవరలో ఇస్తారు; తండ్రి జీవించి ఉన్నవారికీ సంప్రదాయాలు అనుమతిస్తాయి. అష్టమి రెండు రోజులకు వ్యాపించినప్పుడు నిర్ణయం ప్రయోగాన్ని బట్టి మారుతుంది — కొన్ని సంప్రదాయాలు భీష్మ శ్రాద్ధ దినాన్ని స్నాన-తర్పణ దినం నుండి వేరు చేస్తాయి — కాబట్టి స్తుతి రెండు రోజులనూ చెబుతుంది, ఒకటి ఎంచుకోదు." },
      sources: [SRC.vyoma, SRC.kanchi],
    },
    "mahalaya": {
      badge: "core", status: "verified", decision: "aparahna", performance: "kutapa", offset: 0,
      trigger: { roman: "Bhādrapada kṛṣṇa pratipadā to amāvāsyā", deva: "भाद्रपद कृष्ण प्रतिपदा से अमावस्या", tel: "భాద్రపద బహుళ పాడ్యమి నుండి అమావాస్య వరకు" },
      rule: { roman: "Each day of the fortnight is the day of one tithi's ancestors, and each is chosen by the tithi running at aparāhṇa — not at sunrise. How the fortnight is counted and labelled differs by calendar convention, so the days are computed from the tithis rather than laid out as a fixed fifteen.",
              tel: "పక్షంలోని ప్రతి రోజు ఒక తిథి పితృదేవతలదే; ప్రతిదీ అపరాహ్ణంలో నడుస్తున్న తిథిని బట్టి నిర్ణయమవుతుంది — సూర్యోదయాన్ని బట్టి కాదు. పక్షాన్ని లెక్కించే, పేరు పెట్టే విధానం క్యాలెండర్ సంప్రదాయాన్ని బట్టి మారుతుంది; కాబట్టి రోజులు తిథుల నుండి లెక్కిస్తాం, పదిహేను రోజుల స్థిర జాబితాగా కాదు." },
      sources: [SRC.ds26],
    },
    "grahana-tarpanam": {
      badge: "core", status: "verified", decision: "grahana", performance: "grahana", offset: 0,
      trigger: { roman: "A solar or lunar eclipse visible where you are", deva: "स्थानीय दृश्य ग्रहण", tel: "మీ ఊరిలో కనిపించే గ్రహణం" },
      rule: { roman: "An eclipse is an event, not a tithi: the window is sparśa to mokṣa at your own horizon. An eclipse below the horizon carries no rite here, which is why the day is shown only where it is visible.",
              tel: "గ్రహణం ఒక ఘటన, తిథి కాదు: కాలం మీ క్షితిజంలో స్పర్శ నుండి మోక్షం వరకు. క్షితిజం కింద జరిగే గ్రహణానికి ఇక్కడ కర్మ లేదు; అందుకే కనిపించే చోటే ఆ రోజు చూపుతాం." },
      sources: [SRC.ds26],
    },
    "sankranti-pitru": {
      badge: "advanced", status: "prayoga", decision: "sankranti", performance: "sankranti", offset: 0,
      trigger: { roman: "Each solar ingress", deva: "प्रत्येक सङ्क्रान्ति", tel: "ప్రతి సంక్రాంతి" },
      rule: { roman: "Reckoned from the ingress instant and its puṇyakāla, never from a tithi at sunrise. Which puṇyakāla applies differs by saṅkrānti and by tradition; Stuti shows the sixteen-ghaṭikā span either side of the moment and says so.",
              tel: "సంక్రమణ క్షణం, దాని పుణ్యకాలం నుండి లెక్క — సూర్యోదయ తిథి నుండి కాదు. ఏ పుణ్యకాలం వర్తిస్తుందో సంక్రాంతిని, సంప్రదాయాన్ని బట్టి మారుతుంది; స్తుతి క్షణానికి ఇరువైపులా పదహారు ఘటికల కాలాన్ని చూపి, అదే చెబుతుంది." },
      sources: [SRC.ds26],
    },
    "kandarshi-tarpanam": {
      badge: "prayoga", status: "prayoga", decision: "udaya", performance: "pratah", offset: 0,
      trigger: { roman: "Upākarman, by your Veda and śākhā", deva: "उपाकर्म — वेद/शाखा के अनुसार", tel: "ఉపాకర్మ — మీ వేదం, శాఖను బట్టి" },
      rule: { roman: "Upākarman is not one day for everyone: Yajurvedins commonly keep Śrāvaṇa Pūrṇimā, Ṛgvedins the Śravaṇa nakṣatra day of Śrāvaṇa, Sāmavedins a Hasta day in Bhādrapada. Without your Veda and śākhā, Stuti will not name a day.",
              tel: "ఉపాకర్మ అందరికీ ఒకే రోజు కాదు: యజుర్వేదులు సాధారణంగా శ్రావణ పౌర్ణమి, ఋగ్వేదులు శ్రావణంలో శ్రవణా నక్షత్ర దినం, సామవేదులు భాద్రపదంలో హస్తా దినం. మీ వేదం, శాఖ తెలియకుండా స్తుతి రోజును చెప్పదు." },
      sources: [SRC.ds23, SRC.kanchi],
    },
    "annual-shraddha": {
      badge: "personal", status: "prayoga", decision: "aparahna", performance: "aparahna", offset: 0,
      trigger: { roman: "The death tithi, each year", deva: "प्रतिवर्ष मृत्यु तिथि", tel: "ప్రతి సంవత్సరం మృతి తిథి" },
      rule: { roman: "Chosen by śrāddha nirṇaya on the tithi running at aparāhṇa, with vṛddhi and kṣaya handled by the tithi engine. Some prayogas keep the tila tarpaṇa the FOLLOWING morning, after snāna, around prātaḥ-sandhyā — a setting on the record, not a guess.",
              tel: "అపరాహ్ణంలో నడుస్తున్న తిథిపై శ్రాద్ధ నిర్ణయం; వృద్ధి, క్షయాలను తిథి యంత్రం చూసుకుంటుంది. కొన్ని ప్రయోగాలలో తిల తర్పణం మరుసటి ఉదయం, స్నానం తరువాత, ప్రాతఃసంధ్య వేళ — ఇది రికార్డులో ఎంపిక, ఊహ కాదు." },
      sources: [SRC.ds26],
    },
  };
  const rulesFor = (id) => RULES[id] || null;

  /* ---------- why this date ----------
     The drawer's whole content, computed: the instant that decided the day,
     the tithi found there, the window the rite is kept in, and the sources. */
  function why(id, date, loc) {
    const r = RULES[id]; if (!r) return null;
    const L = loc || place(), Pa = P();
    const out = { id: id, badge: r.badge, status: r.status, trigger: r.trigger, rule: r.rule, sources: r.sources,
                  decisionKala: r.decision, performanceKala: r.performance, offset: r.offset || 0 };
    try {
      const pa = Pa.forDay(date, L);
      const di = instant(r.decision, pa);
      if (di != null) {
        out.decidedAt = Pa.fmtTime(((di % 1440) + 1440) % 1440);
        const Ep = E();
        if (Ep) out.decidedTithi = Math.floor(Ep.elong(jdOf(date, di, Pa.effTz(L, date))) / 12);
      }
      const w = window_(r.performance, pa);
      if (w) { out.from = Pa.fmtTime(((w.start % 1440) + 1440) % 1440); out.to = Pa.fmtTime(((w.end % 1440) + 1440) % 1440); }
      if (id === "bhishma-tarpanam") {
        /* the candidates are found around the date in hand, not by asking the
           year again — M\u0101gha spans two civil years and the year of a February
           a\u1e63\u1e6dam\u012b is not the year its samvatsara opened */
        const cand = [];
        for (const off of [-1, 0, 1]) {
          const day = D(date.getFullYear(), date.getMonth(), date.getDate() + off);
          const u = tithiAt(day, "udaya", L), md = tithiAt(day, "madhyahna", L);
          if ((u && u.ti === ASHTAMI) || (md && md.ti === ASHTAMI)) cand.push(day);
        }
        if (cand.length > 1) out.candidates = cand;
      }
      /* the aṅgāraka day is a coincidence, not an instant: what the drawer
         must show is the span of caturdaśī inside that Tuesday, since the
         tithi often begins well after sunrise — reporting a single tested
         hour there would name trayodaśī and contradict the rite */
      if (id === "yama-angaraka") {
        const Ep = E(), tz = Pa.effTz(L, date);
        if (Ep) {
          let hit = null;
          for (let mm = 0; mm <= 1440; mm += 20) {
            const j = jdOf(date, mm, tz);
            if (Math.floor(Ep.elong(j) / 12) === CATURDASHI) { hit = j; break; }
          }
          if (hit != null) {
            const s = Ep.tithiStart(hit), e2 = Ep.tithiEnd(hit);
            const toMin = (j) => (j - (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000 + 2440587.5 - tz / 24)) * 1440;
            out.decisionKala = "overlap";
            out.overlapFrom = Pa.fmtTime(((toMin(s) % 1440) + 1440) % 1440);
            out.overlapTo = Pa.fmtTime(((toMin(e2) % 1440) + 1440) % 1440);
            out.overlapNextDay = toMin(e2) > 1440;
            out.decidedAt = out.overlapFrom + " – " + out.overlapTo;
            out.decidedTithi = CATURDASHI;
          }
        }
      }
      if (id === "grahana-tarpanam" && pa.grahana) {
        out.from = Pa.fmtTime(pa.grahana.startMin != null ? pa.grahana.startMin : 0);
        out.to = Pa.fmtTime(pa.grahana.endMin != null ? pa.grahana.endMin : 0);
        out.visible = !!pa.grahana.visible;
      }
      /* the ingress has no tithi window to borrow, so the kṣaṇa module —
         which owns the puṇyakāla rule — is asked for it directly */
      if (id === "sankranti-pitru" && STUTI_KSHANA) {
        const k = STUTI_KSHANA.fromSankranti(date, L);
        if (k && k.kept) { out.from = Pa.fmtTime(k.kept.start); out.to = Pa.fmtTime(k.kept.end); }
      }
    } catch (e) {}
    return out;
  }

  /* ---------- what falls on a given day ----------
     The named-day rites come from the vrata list; the event-driven ones are
     asked directly, since an eclipse and a solar ingress are not tithis. */
  const dayCache = {};
  function onDay(date, loc) {
    const V = STUTI_VRATA; if (!V) return null;
    const d = date || new Date(), ck = dayKeyOf(d) + "|" + placeKey(loc || place());
    if (dayCache[ck] !== undefined) return dayCache[ck];
    const key = V.dayKey(d);
    let hit = null;
    for (const e of entries) {
      let x = null;
      try { x = V.nextDate(e, d); } catch (err) { x = null; }
      if (x && V.dayKey(x) === key) { hit = e; break; }
    }
    dayCache[ck] = hit;
    return hit;
  }

  /* every tarpaṇa occasion on a day, named-day and event alike */
  function occasionsOn(date, loc) {
    const L = loc || place(), Pa = P(), V = STUTI_VRATA, out = [];
    const key = V ? V.dayKey(date) : dayKeyOf(date);
    if (V) entries.forEach((e) => {
      let x = null; try { x = V.nextDate(e, date); } catch (err) {}
      if (x && V.dayKey(x) === key) out.push({ id: e.id, name: e.name, rite: e });
    });
    /* mahālaya: a pitṛ-pakṣa day, decided at aparāhṇa */
    try {
      const set = mahalaya(date.getFullYear(), L);
      const hit = set.find((x) => dayKeyOf(x.date) === dayKeyOf(date));
      if (hit) out.push({ id: "mahalaya", name: MAHALAYA_NAME, tithi: hit.ti, note: hit.label });
    } catch (e) {}
    /* grahaṇa: an event, and only where it stands above the horizon */
    try {
      const pa = Pa.forDay(date, L);
      /* an upacchāyā eclipse is a fact about the sky and not a grahaṇa for
         nirṇaya, so it brings no tarpaṇa with it however well it is seen */
      if (pa.grahana && pa.grahana.visible && pa.grahana.type !== "penumbral") out.push({ id: "grahana-tarpanam", name: grahanaName(pa.grahana), grahana: pa.grahana });
    } catch (e) {}
    /* saṅkrānti: the ingress instant, not a tithi */
    try {
      const s = (Pa.sankrantis(date.getFullYear()) || []).find((x) => {
        const d2 = Pa.sankrantiDay(date.getFullYear(), x.rashi);
        return d2 && dayKeyOf(d2) === dayKeyOf(date);
      });
      if (s) out.push({ id: "sankranti-pitru", name: SANKRANTI_NAME, rashi: s.rashi });
    } catch (e) {}
    return out;
  }

  const MAHALAYA_NAME = { roman: "Mahālaya · Pitṛ Pakṣa", deva: "महालय · पितृपक्ष", tel: "మహాలయం · పితృపక్షం" };
  const GRAHANA_NAME = { roman: "Grahaṇa Tarpaṇam", deva: "ग्रहण तर्पणम्", tel: "గ్రహణ తర్పణం" };
  const SANKRANTI_NAME = { roman: "Saṅkrānti Pitṛ-kārya", deva: "सङ्क्रान्ति पितृकार्य", tel: "సంక్రాంతి పితృకార్యం" };

  /* the pitṛ-pakṣa days of a year, each tithi placed by its aparāhṇa */
  const mahCache = {};
  function mahalaya(y, loc) {
    const L = loc || place(), ck = y + "|" + placeKey(L);
    if (mahCache[ck]) return mahCache[ck];
    const out = [];
    const start = monthStart ? monthStart(y, MASA.bhadrapada) : null;
    if (start) {
      /* the dark fortnight of Bhādrapada: from kṛṣṇa pratipadā (15) to
         amāvāsyā (29), each day taken where its own tithi holds aparāhṇa */
      for (let ti = 15; ti <= 29; ti++) {
        const anchor = P().nextTithiFrom(D(start.getFullYear(), start.getMonth(), start.getDate() + 12), ti, L);
        const day = anchor ? (dayCarrying(anchor, ti, "aparahna", L) || anchor) : null;
        if (day) out.push({ ti: ti, date: day, label: null });
      }
    }
    mahCache[ck] = out;
    return out;
  }

  /* ============ the Shaṇṇavati — the ninety-six ============
     Not ninety-six separate alerts: it is the traditional CLASSIFICATION of
     śrāddha occasions, and it belongs in a reference calendar the reciter can
     read, not in a notification. Grouped, dated for the year, and labelled
     with what each group is. */
  const shanCache = {};
  function shannavati(y, loc) {
    const L = loc || place(), ck = y + "|" + placeKey(L);
    if (shanCache[ck]) return shanCache[ck];
    const Pa = P(), groups = [];
    const push = (id, name, note, items, badge, lazy) => groups.push({ id, name, note, items, badge: badge || "advanced", lazy: lazy || null });

    /* 12 amāvāsyās */
    const am = [];
    for (let m = 0; m < 12; m++) { const d = amavasyaDay(y, m); if (d && d.getFullYear() === y) am.push({ date: d }); }
    push("amavasya", { roman: "The twelve amāvāsyās", deva: "द्वादश अमावस्या", tel: "పన్నెండు అమావాస్యలు" },
      { roman: "Darśa — the pitṛ day of every lunar month, decided at aparāhṇa.", tel: "దర్శం — ప్రతి చాంద్రమాసపు పితృ దినం, అపరాహ్ణంతో నిర్ణయం." }, am, "core");

    /* 12 saṅkrāntis */
    const sk = [];
    try { (Pa.sankrantis(y) || []).forEach((s) => { const d = Pa.sankrantiDay(y, s.rashi); if (d) sk.push({ date: d, label: Pa.RASHI ? Pa.RASHI[s.rashi] : null }); }); } catch (e) {}
    push("sankranti", { roman: "The twelve saṅkrāntis", deva: "द्वादश सङ्क्रान्ति", tel: "పన్నెండు సంక్రాంతులు" },
      { roman: "Each solar ingress, with its own puṇyakāla — not a tithi rule.", tel: "ప్రతి సంక్రమణం, దాని పుణ్యకాలంతో — తిథి నియమం కాదు." }, sk);

    /* the mahālaya set */
    push("mahalaya", MAHALAYA_NAME,
      { roman: "The dark fortnight of Bhādrapada, one tithi's ancestors a day.", tel: "భాద్రపద బహుళ పక్షం — రోజుకు ఒక తిథి పితృదేవతలు." },
      mahalaya(y, L).map((x) => ({ date: x.date, ti: x.ti })), "core");

    /* 12 vyatīpātas and 12 vaidhṛtis — yoga-driven, so finding them means
       scanning the year's days. Left unfilled until the group is opened: a
       year of forDay calls is most of a second, and it must not be spent on
       the way to a page nobody has asked to expand. */
    push("vyatipata", { roman: "Vyatīpāta", deva: "व्यतीपात", tel: "వ్యతీపాతం" },
      { roman: "A yoga, not a tithi — the seventeenth, prevailing at sunrise.", tel: "ఇది యోగం, తిథి కాదు — పదిహేడవ యోగం, సూర్యోదయంలో ఉన్నది." }, [], "advanced", "yoga");
    push("vaidhriti", { roman: "Vaidhṛti", deva: "वैधृति", tel: "వైధృతి" },
      { roman: "The twenty-seventh yoga, likewise taken at sunrise.", tel: "ఇరవై ఏడవ యోగం, అలాగే సూర్యోదయంలో." }, [], "advanced", "yoga");

    /* 14 manvādis */
    const MANVADI = [[MASA.caitra, 2], [MASA.caitra, PURNIMA], [MASA.jyeshtha, PURNIMA], [MASA.ashadha, 9],
      [MASA.ashadha, PURNIMA], [MASA.shravana, 22], [MASA.bhadrapada, 2], [MASA.ashvina, 8],
      [MASA.kartika, 11], [MASA.kartika, PURNIMA], [MASA.pausha, 10], [MASA.magha, 6],
      [MASA.phalguna, PURNIMA], [MASA.phalguna, AMAVASYA]];
    push("manvadi", { roman: "The fourteen Manvādis", deva: "चतुर्दश मन्वादि", tel: "పదునాలుగు మన్వాదులు" },
      { roman: "The tithis on which each Manu's age is traditionally said to open.", tel: "ప్రతి మనువు యుగం ప్రారంభమైనట్లు సంప్రదాయం చెప్పే తిథులు." },
      MANVADI.map(([m, ti]) => ({ date: lunar ? lunar(y, m, ti) : null })).filter((x) => x.date));

    /* 4 yugādis */
    const YUGADI = [[MASA.vaisakha, 2, { roman: "Tretā", tel: "త్రేతా" }], [MASA.kartika, 8, { roman: "Kṛta", tel: "కృత" }],
      [MASA.bhadrapada, 27, { roman: "Kali", tel: "కలి" }], [MASA.magha, AMAVASYA, { roman: "Dvāpara", tel: "ద్వాపర" }]];
    push("yugadi", { roman: "The four Yugādis", deva: "चतुर्युगादि", tel: "నాలుగు యుగాదులు" },
      { roman: "The commencement tithis of the four ages — not the regional new year.", tel: "నాలుగు యుగాల ఆరంభ తిథులు — ప్రాంతీయ ఉగాది కాదు." },
      YUGADI.map(([m, ti, lbl]) => ({ date: lunar ? lunar(y, m, ti) : null, label: lbl })).filter((x) => x.date));

    /* the aṣṭakā group — three months, three days each */
    const ASHT = [MASA.margashirsha, MASA.pausha, MASA.magha];
    const ash = [];
    ASHT.forEach((m) => [21, 22, 23].forEach((ti) => { const d = lunar ? lunar(y, m, ti) : null; if (d) ash.push({ date: d, ti: ti }); }));
    push("ashtaka", { roman: "Pūrvedyu · Aṣṭakā · Anvaṣṭakā", deva: "पूर्वेद्यु · अष्टका · अन्वष्टका", tel: "పూర్వేద్యు · అష్టకా · అన్వష్టకా" },
      { roman: "The seasonal pitṛ triads of the three winter months — saptamī, aṣṭamī, navamī of the dark fortnight.", tel: "మూడు హేమంత మాసాల ఋతు పితృ త్రయాలు — బహుళ సప్తమి, అష్టమి, నవమి." }, ash);

    /* the named special cases */
    const shastra = mahalaya(y, L).find((x) => x.ti === CATURDASHI);
    push("special", { roman: "The named cases", deva: "विशेष दिन", tel: "విశేష దినాలు" },
      { roman: "Śastrahata Caturdaśī is for those who died by weapon or by violence; Dauhitra Pratipadā is the maternal grandfather's day, which a daughter's son may keep even with his own father living. Gajacchāyā depends on a rare tithi–nakṣatra–sun combination and is left to an authoritative pañcāṅga.",
        tel: "శస్త్రహత చతుర్దశి — ఆయుధం చేత, హింస చేత గతించినవారికి; దౌహిత్ర పాడ్యమి — మాతామహుని దినం, తండ్రి జీవించి ఉన్నా కూతురి కొడుకు చేయవచ్చు. గజచ్ఛాయ అరుదైన తిథి-నక్షత్ర-సూర్య కలయికపై ఆధారపడుతుంది; దానిని ప్రామాణిక పంచాంగానికే వదిలేస్తాం." },
      [shastra ? { date: shastra.date, label: { roman: "Śastrahata Caturdaśī", tel: "శస్త్రహత చతుర్దశి" } } : null,
       lunar ? { date: lunar(y, MASA.ashvina, 0), label: { roman: "Dauhitra Pratipadā", tel: "దౌహిత్ర పాడ్యమి" } } : null].filter((x) => x && x.date));

    shanCache[ck] = groups;
    return groups;
  }

  /* ============ the rite records ============ */
  const entries = [];
  function defineEntries() {
    entries.length = 0;
    entries.push(
      {
        id: "pitru-tarpanam", deity: "pitr", kind: "tarpana", everyMonth: true, parva: true,
        name: { roman: "Pitṛ Tarpaṇam", deva: "पितृ तर्पणम्", tel: "పితృ తర్పణం" },
        rule: { roman: "Every Amāvāsyā · at aparāhṇa", deva: "प्रत्येक अमावस्या · अपराह्ण", tel: "ప్రతి అమావాస్య · అపరాహ్ణ కాలం" },
        find: (y, m) => amavasyaDay(y, m), kala: "aparahna",
        duration: { roman: "The fourth fifth of the day — roughly two hours", tel: "దినంలో నాలుగవ భాగం — సుమారు రెండు గంటలు" },
        who: { roman: "Who holds the adhikāra depends on the family. While a father is living, he is ordinarily the karta for his own line. On the rest, the traditions differ. Follow your paddhati and your elders.",
               tel: "అధికారం ఎవరిదో కుటుంబాన్ని బట్టి ఉంటుంది. తండ్రి జీవించి ఉన్నంతకాలం సాధారణంగా ఆయనే తన వంశానికి కర్త. మిగిలిన విషయాలలో సంప్రదాయాలు వేరుపడతాయి. మీ పద్ధతిని, పెద్దలను అనుసరించండి." },
        tagline: { roman: "Water, sesame and darbha are offered to three generations. The amāvāsyā is their day.",
                   tel: "మూడు తరాలకు నీరు, నువ్వులు, దర్భ సమర్పిస్తారు. అమావాస్య వారి దినం." },
        significance: [
          { roman: "The pitṛs are said to stand nearest on the day the moon is dark. The amāvāsyā is their tithi as much as it is the moon's.",
            tel: "చంద్రుడు కనిపించని రోజున పితృదేవతలు అత్యంత సమీపంలో ఉంటారని చెబుతారు. అమావాస్య చంద్రునిదే కాదు, వారిదీ తిథి." },
          { roman: "Aparāhṇa decides the day. It does not decide the hour of every part of the rite. Some prayogas keep the tila tarpaṇa before the śrāddha, some after.",
            tel: "అపరాహ్ణం రోజును నిర్ణయిస్తుంది. కర్మలోని ప్రతి భాగపు వేళను కాదు. కొన్ని ప్రయోగాలలో తిల తర్పణం శ్రాద్ధానికి ముందు, కొన్నిటిలో తరువాత." },
          { roman: "Tarpaṇa is not one rite. Deva, ṛṣi, ācārya and pitṛ-devatā tarpaṇa belong to the daily brahma-yajña. The offering to one's own ancestors is a separate question.",
            tel: "తర్పణం ఒకే కర్మ కాదు. దేవ, ఋషి, ఆచార్య, పితృదేవతా తర్పణాలు నిత్య బ్రహ్మయజ్ఞంలో భాగం. స్వకీయ పితరులకు ఇచ్చే తర్పణం వేరే విషయం." },
        ],
        timeline: [
          { t: { roman: "Morning", tel: "ఉదయం" }, d: { roman: "Bathe. The meal follows the rite, never precedes it.", tel: "స్నానం. భోజనం కర్మ తరువాతే, ముందు కాదు." } },
          { t: { roman: "Aparāhṇa", tel: "అపరాహ్ణం" }, d: { roman: "Facing south, on a darbha āsana, near flowing water if there is any.", tel: "దక్షిణ ముఖంగా, దర్భాసనంపై, ప్రవహించే నీరు ఉంటే దాని దగ్గర." } },
          { t: { roman: "After", tel: "తరువాత" }, d: { roman: "Restore the yajñopavītam, do ācamana, and set the darbha aside in a clean place.", tel: "యజ్ఞోపవీతం సవ్యం చేసుకుని, ఆచమనం, దర్భను శుభ్రమైన చోట ఉంచడం." } },
        ],
        samagri: [
          { roman: "Darbha (kuśa) grass — āsana, pavitram, and the offering itself", tel: "దర్భ (కుశ) — ఆసనం, పవిత్రం, సమర్పణ" },
          { roman: "Black sesame (tila) — where your prayoga allows it on that day", tel: "నల్ల నువ్వులు — ఆ రోజు మీ ప్రయోగం అనుమతించినప్పుడు" },
          { roman: "A vessel of clean water and a wide plate to receive it", tel: "శుభ్రమైన నీటి పాత్ర, అందుకునే వెడల్పు పళ్ళెం" },
          { roman: "Akṣata, gandha, a flower or two", tel: "అక్షతలు, గంధం, ఒకటిరెండు పుష్పాలు" },
        ],
        /* The worked prayoga below is one Telugu household paddhati, kept whole
           and attributed; it is an example of a procedure, not a ruling on one. */
        vidhi: [
          { step: { roman: "Ācamanam", tel: "ఆచమనం" }, detail: { roman: "Oṁ keśavāya svāhā. Oṁ nārāyaṇāya svāhā. Oṁ mādhavāya svāhā. Then the twenty-four names, from govindāya namaḥ to śrī kṛṣṇāya namaḥ.", tel: "ఓం కేశవాయ స్వాహా. ఓం నారాయణాయ స్వాహా. ఓం మాధవాయ స్వాహా. తరువాత గోవిందాయ నమః మొదలు శ్రీ కృష్ణాయ నమః వరకు ఇరవై నాలుగు నామాలు." } },
          { step: { roman: "Pavitraṁ dhṛtvā", tel: "పవిత్రం ధృత్వా" }, detail: { roman: "Wear the pavitram. Those who have received the mantra recite oṁ pavitre vantaḥ … tatra mā śaktī. Then do ācamana again.", tel: "పవిత్రమును ధరించాలి. మంత్రం వచ్చినవారు ఓం పవిత్రే వంతః … తత్ర మా శక్తీ చదవాలి. తరువాత మరల ఆచమనం చేయాలి." } },
          { step: { roman: "Bhūtocchāṭana", tel: "భూతోచ్ఛాటన" }, detail: { roman: "Uttiṣṭhantu bhūta piśācāḥ ye te bhūmi bhārakāḥ | yeteṣām avirodhena brahma karma samārabhe || Sprinkle water behind you as you say it.", tel: "ఉత్తిష్ఠంతు భూత పిశాచాః యే తే భూమి భారకాః | యేతేషామవిరోధేన బ్రహ్మ కర్మ సమారభే || ఇది చెబుతూ నీటిని వెనుకకు చల్లాలి." } },
          { step: { roman: "Prāṇāyāmam", tel: "ప్రాణాయామము" }, detail: { roman: "Oṁ bhūḥ … oṁ tat savitur vareṇyaṁ … oṁ āpo jyotī raso'mṛtaṁ brahma bhūr bhuvas suvar oṁ. Recite it silently.", tel: "ఓం భూః … ఓం తత్సవితుర్వరేణ్యం … ఓం ఆపోజ్యోతీరసోఽమృతం బ్రహ్మ భూర్భువస్సువరోం. మనసులో జపించాలి." } },
          { step: { roman: "Saṅkalpam", tel: "సంకల్పం" }, detail: { roman: "State the place and the time: saṁvatsara, ayana, ṛtu, māsa, pakṣa, tithi. Then your own gotra and nāma. Then add the saṅkalpa that the day calls for, from the list below.", tel: "దేశకాలాలను చెప్పాలి: సంవత్సరం, ఆయనం, ఋతువు, మాసం, పక్షం, తిథి. తరువాత మీ గోత్రనామాలు. తరువాత ఆ రోజుకి తగిన సంకల్పాన్ని కింది జాబితా నుండి చేర్చాలి." } },
          { step: { roman: "Prācīnāvīti", tel: "ప్రాచీనావీతి" }, detail: { roman: "Move the yajñopavītam from the left shoulder to the right. Spread three darbhas with their points to the east. Spread two more across them, pointing south. Invoke the pitṛ-devatās upon them.", tel: "యజ్ఞోపవీతమును ఎడమ నుండి కుడి భుజము పైకి మార్చుకోవాలి. తూర్పు కొసలుగా మూడు దర్భలు పరచాలి. వాటిపై దక్షిణ కొసలుగా రెండు కూర్చులు పరచాలి. వాటిపై పితృదేవతలను ఆవాహన చేయాలి." } },
          { step: { roman: "Āvāhana", tel: "ఆవాహన" }, detail: { roman: "Oṁ āgacchantu me pitara imaṁ gṛhṇantu jalāñjalim || Read it while placing sesame. Then turn to face south. The left knee rests on the ground, and the offering falls over the knees.", tel: "ఓం ఆగచ్ఛంతు మే పితర ఇమం గృహ్ణంతు జలాంజలిం || ఇది చదువుతూ తిలలు వేయాలి. తరువాత దక్షిణముఖముగా తిరగాలి. ఎడమ మోకాలు నేలపై ఉంచి, మోకాళ్ళ మీదుగా తర్పణం విడవాలి." } },
          { step: { roman: "Tarpaṇam", tel: "తర్పణం" }, detail: { roman: "Take each name below in turn. Offer three double-handfuls of sesame water over the base of the right thumb, which is the pitṛ tīrtha, saying svadhā namas tarpayāmi. Every name is prefixed with asmat. The first blank takes the gotra, the second takes the name.", tel: "కింది ప్రతి పేరును వరుసగా తీసుకోవాలి. కుడి బొటనవేలి మూలం పితృతీర్థం; దాని మీదుగా మూడు దోసిళ్ళ తిలోదకము విడవాలి, స్వధా నమస్తర్పయామి అంటూ. ప్రతి పేరుకు ముందు అస్మత్ చేర్చాలి. మొదటి ఖాళీలో గోత్రము, రెండవ ఖాళీలో వారి పేరు." } },
          { step: { roman: "Ye ke cāsmat", tel: "యే కే చాస్మత్" }, detail: { roman: "This is offered to all of this line and gotra who died without sons. Twist the pavitram, dip its knot in water, and wring it out over the ground while reading: ye ke cāsmat kule jātā aputrā gotriṇo mṛtāḥ | te gṛhṇantu mayā dattaṁ vastra-niṣpīḍanodakam ||", tel: "ఈ కులములో, ఈ గోత్రములో పుత్రులు లేక మరణించినవారందరికీ ఇది సమర్పణ. పవిత్రమును పేనుకుని, ముడిని నీటిలో ముంచి, నేలపై పిండుతూ చదవాలి: యే కే చాస్మత్ కులే జాతాః అపుత్రా గోత్రిణో మృతాః | తే గృహ్ణంతు మయాదత్తం వస్త్ర నిష్పీడనోదకం ||" } },
          { step: { roman: "Savyaṁ", tel: "సవ్యం" }, detail: { roman: "Return the yajñopavītam to the left shoulder. Touch the knot of the pavitram to the eyes and untwist it. Say śrīrāma rāma rāma. Set the darbha aside in a clean place.", tel: "యజ్ఞోపవీతమును ఎడమ భుజము పైకి మార్చుకోవాలి. పవిత్రపు ముడిని కళ్ళకద్దుకుని సవ్యము చేసుకోవాలి. శ్రీరామ రామ రామ అనాలి. దర్భను శుభ్రమైన చోట ఉంచాలి." } },
        ],
        sankalpas: [
          { when: { roman: "Nitya tarpaṇam", tel: "నిత్య తర్పణం" }, text: { roman: "asmat pitṝṇām akṣaya puṇyalokāvāptyarthaṁ nitya-śrāddha pratinidhi sadyaḥ nitya pitṛ tarpaṇaṁ kariṣye", tel: "అస్మత్ పితౄణాం అక్షయ పుణ్యలోకావాప్త్యర్థం నిత్యశ్రాద్ధ ప్రతినిధి సద్యః నిత్య పితృ తర్పణం కరిష్యే" } },
          { when: { roman: "Amāvāsyā", tel: "అమావాస్య" }, text: { roman: "asmat pitṝṇām akṣaya puṇyalokā vāptyarthaṁ darśa śrāddha pratinidhi sadyaḥ tila tarpaṇaṁ kariṣye", tel: "అస్మత్ పితౄణాం అక్షయ పుణ్యలోకా వాప్త్యర్థం దర్శ శ్రాద్ధ ప్రతినిధి సద్యః తిల తర్పణం కరిష్యే" } },
          { when: { roman: "At an eclipse", tel: "గ్రహణ సమయములో" }, text: { roman: "rāhu-grasta somoparāga samaye / ketu-grasta sūryoparāga samaye asmat pitṝṇām akṣaya puṇyalokā vāptyarthaṁ grahaṇa śrāddha pratinidhi sadyaḥ tila tarpaṇaṁ kariṣye", tel: "రాహుగ్రస్త సోమోపరాగ సమయే / కేతుగ్రస్త సూర్యోపరాగ సమయే అస్మత్ పితౄణాం అక్షయ పుణ్యలోకా వాప్త్యర్థం గ్రహణ శ్రాద్ధ ప్రతినిధి సద్యః తిల తర్పణం కరిష్యే" } },
          { when: { roman: "At a saṅkramaṇa", tel: "సంక్రమణములకు" }, text: { roman: "makara saṅkramaṇa prayukta uttarāyaṇa mahā-parva puṇyakāle / karkāṭaka saṅkramaṇa prayukta dakṣiṇāyana mahā-parva puṇyakāle asmat pitṝṇām akṣaya puṇyalokā vāptyarthaṁ saṅkramaṇa śrāddha pratinidhi sadyaḥ tila tarpaṇaṁ kariṣye", tel: "మకర సంక్రమణ ప్రయుక్త ఉత్తరాయణ మహాపర్వ పుణ్యకాలే / కర్కాటక సంక్రమణ ప్రయుక్త దక్షిణాయన మహాపర్వ పుణ్యకాలే అస్మత్ పితౄణాం అక్షయ పుణ్యలోకా వాప్త్యర్థం సంక్రమణ శ్రాద్ధ ప్రతినిధి సద్యః తిల తర్పణం కరిష్యే" } },
          { when: { roman: "Mahālayam", tel: "మహాలయము" }, text: { roman: "pitṝṇāṁ mātāmahādīnāṁ sarveṣāṁ kāruṇyānāñca akṣaya puṇyalokā vāptyarthaṁ kanyāgate savitari āpādyādi pañca-māsa-pakṣe kartavya sakṛn-mahālayākhyānna śrāddha pratinidhi sadyaḥ tila tarpaṇaṁ kariṣye", tel: "పితౄణాం మాతామహాదీనాం సర్వేషాం కారుణ్యానాంచ అక్షయ పుణ్యలోకా వాప్త్యర్థం కన్యాగతే సవితరి ఆపాద్యాది పంచమాసపక్షే కర్తవ్య సకృన్మహాలయాఖ్యాన్న శ్రాద్ధ ప్రతినిధి సద్యః తిల తర్పణం కరిష్యే" } },
          { when: { roman: "Puṣkara samayam", tel: "పుష్కర సమయములలో" }, text: { roman: "pitṝṇāṁ mātāmahādīnāṁ sarveṣāṁ kāruṇyānāñca akṣaya puṇyalokā vāptyarthaṁ kanyāgate devagurau sārdha-trikoṭi tīrtha sahita kṛṣṇaveṇī puṣkara prayukta tīrthābhyāṁ śrāddha pratinidhi sadyaḥ tila tarpaṇaṁ kariṣye", tel: "పితౄణాం మాతామహాదీనాం సర్వేషాం కారుణ్యానాంచ అక్షయ పుణ్యలోకా వాప్త్యర్థం కన్యాగతే దేవగురౌ సార్ధ త్రికోటి తీర్థ సహిత కృష్ణవేణీ పుష్కర ప్రయుక్త తీర్థాభ్యాం శ్రాద్ధ ప్రతినిధి సద్యః తిల తర్పణం కరిష్యే" } },
        ],
        recipientsNote: { roman: "Only the names of those who have died are read. Where a wife also is gone, sapatnīkaṁ is added. For a woman whose husband is gone, sabhartṛkaṁ is added. Śarmaṇaṁ is the ending for brāhmaṇas. Varmaṇaṁ stands in its place for kṣatriyas, guptaṁ for vaiśyas, and dāsaṁ for others.",
          tel: "మరణించినవారి పేర్లే చదవాలి. వారి భార్య కూడా లేనట్లయితే సపత్నీకం అని చేర్చాలి. స్త్రీల విషయములో భర్త కూడా లేనట్లయితే సభర్తృకం అని చేర్చాలి. బ్రాహ్మణులైతే శర్మణం అనాలి. రాజులైతే వర్మణం, వైశ్యులైతే గుప్తం, ఇతరులు దాసం అని మార్చి పలకాలి." },
        recipients: [
          { name: { roman: "Pitaraṁ", tel: "పితరం" }, kin: { roman: "father", tel: "తండ్రి" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Pitāmahaṁ", tel: "పితామహం" }, kin: { roman: "father's father", tel: "తాత" }, form: { roman: "…gotraṁ … śarmaṇaṁ rudrarūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం రుద్రరూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Prapitāmahaṁ", tel: "ప్రపితామహం" }, kin: { roman: "great-grandfather", tel: "ముత్తాత" }, form: { roman: "…gotraṁ … śarmaṇaṁ ādityarūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం ఆదిత్యరూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātaraṁ", tel: "మాతరం" }, kin: { roman: "mother", tel: "తల్లి" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Pitāmahīṁ", tel: "పితామహీం" }, kin: { roman: "father's mother", tel: "నాయనమ్మ" }, form: { roman: "…gotrāṁ … padāṁ rudrarūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం రుద్రరూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Prapitāmahīṁ", tel: "ప్రపితామహీం" }, kin: { roman: "great-grandmother", tel: "ముత్తమ్మ" }, form: { roman: "…gotrāṁ … padāṁ ādityarūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం ఆదిత్యరూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Sapatna mātaraṁ", tel: "సపత్న మాతరం" }, kin: { roman: "step-mother", tel: "సవతి తల్లి" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātāmahaṁ", tel: "మాతామహం" }, kin: { roman: "mother's father", tel: "తల్లి తండ్రి" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātuḥ pitāmahaṁ", tel: "మాతుః పితామహం" }, kin: { roman: "mother's grandfather", tel: "తల్లి తాత" }, form: { roman: "…gotraṁ … śarmaṇaṁ rudrarūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం రుద్రరూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātuḥ prapitāmahaṁ", tel: "మాతుః ప్రపితామహం" }, kin: { roman: "mother's great-grandfather", tel: "తల్లి ముత్తాత" }, form: { roman: "…gotraṁ … śarmaṇaṁ ādityarūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం ఆదిత్యరూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātāmahīṁ", tel: "మాతామహీం" }, kin: { roman: "mother's mother", tel: "అమ్మమ్మ" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātuḥ pitāmahīṁ", tel: "మాతుః పితామహీం" }, kin: { roman: "mother's grandmother", tel: "తల్లికి నానమ్మ" }, form: { roman: "…gotrāṁ … padāṁ rudrarūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం రుద్రరూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātuḥ prapitāmahīṁ", tel: "మాతుః ప్రపితామహీం" }, kin: { roman: "mother's great-grandmother", tel: "తల్లికి ముత్తమ్మ" }, form: { roman: "…gotrāṁ … padāṁ ādityarūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం ఆదిత్యరూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Ātmapatnīṁ", tel: "ఆత్మపత్నీం" }, kin: { roman: "one's own wife", tel: "తన భార్య" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Sutaṁ", tel: "సుతం" }, kin: { roman: "son", tel: "కుమారుడు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Jyeṣṭha / kaniṣṭha bhrātaraṁ", tel: "జ్యేష్ఠ / కనిష్ఠ భ్రాతరం" }, kin: { roman: "elder or younger brother", tel: "సోదరులు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Jyeṣṭha / kaniṣṭha pitṛvyaṁ", tel: "జ్యేష్ఠ / కనిష్ఠ పితృవ్యం" }, kin: { roman: "father's brothers", tel: "తండ్రి సోదరులు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātulaṁ", tel: "మాతులం" }, kin: { roman: "mother's brother", tel: "మేనమామ" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Duhitaraṁ", tel: "దుహితరం" }, kin: { roman: "daughter", tel: "కుమార్తె" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Bhaginīṁ", tel: "భగినీం" }, kin: { roman: "sister", tel: "తోబుట్టువు" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Dauhitraṁ", tel: "దౌహిత్రం" }, kin: { roman: "daughter's son", tel: "కూతురి కొడుకు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Bhāgineyakaṁ", tel: "భాగినేయకం" }, kin: { roman: "sister's son", tel: "మేనల్లుడు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Pitṛbhaginīṁ", tel: "పితృభగినీం" }, kin: { roman: "father's sister", tel: "మేనత్త" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ (sabhartṛkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం (సభర్తృకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Mātṛbhaginīṁ", tel: "మాతృభగినీం" }, kin: { roman: "mother's sister", tel: "అల్లి తోబుట్టువు" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ (sabhartṛkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం (సభర్తృకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Jāmātaraṁ", tel: "జామాతరం" }, kin: { roman: "son-in-law", tel: "అల్లుడు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Bhāvukaṁ", tel: "భావుకం" }, kin: { roman: "sister's husband", tel: "బావగారు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Snuṣāṁ", tel: "స్నుషాం" }, kin: { roman: "daughter-in-law", tel: "కోడలు" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Śvaśuraṁ", tel: "శ్వశురం" }, kin: { roman: "wife's father", tel: "భార్య తండ్రి" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Śvaśrūṁ", tel: "శ్వశ్రూం" }, kin: { roman: "wife's mother", tel: "భార్య తల్లి" }, form: { roman: "…gotrāṁ … padāṁ vasurūpāṁ svadhā namas tarpayāmi ||3||", tel: "… గోత్రాం … పదాం వసురూపాం స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Śyālakaṁ", tel: "శ్యాలకం" }, kin: { roman: "wife's brother", tel: "భార్య సోదరుడు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Svāminaṁ", tel: "స్వామినం" }, kin: { roman: "one's master", tel: "ప్రభువు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Guruṁ", tel: "గురుం" }, kin: { roman: "guru", tel: "గురువు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
          { name: { roman: "Ṛktinaṁ", tel: "ఋక్తినం" }, kin: { roman: "one who gave wealth", tel: "ధనమిచ్చినవారు" }, form: { roman: "…gotraṁ … śarmaṇaṁ vasurūpaṁ (sapatnīkaṁ) svadhā namas tarpayāmi ||3||", tel: "… గోత్రం … శర్మణం వసురూపం (సపత్నీకం) స్వధా నమస్తర్పయామి ||3||" } },
        ],
        source: { roman: "The day is chosen by the aparāhṇa principle of the śrāddha nirṇaya (Dharma Sindhu 26). The procedure is settled by prayoga, not by a general list. The order of the recipients, the tīrtha, the position of the yajñopavītam, the number of añjalis, and the use of sesame on a given weekday all come from your family's paddhati or your śākhā's manual. The procedure shown here is the Telugu Pitṛ Tarpaṇam sheet of Rajasekharuni Vijay Śarma, given whole as one household's paddhati.",
                  tel: "రోజు నిర్ణయం శ్రాద్ధ నిర్ణయపు అపరాహ్ణ సూత్రాన్ని అనుసరిస్తుంది (ధర్మసింధు 26). విధానం ప్రయోగాన్ని బట్టి మారుతుంది. స్మరించే క్రమం, తీర్థం, యజ్ఞోపవీత స్థానం, అంజలుల సంఖ్య, ఆ వారం నువ్వులు వాడడం — ఇవన్నీ మీ కుటుంబ పద్ధతి లేదా శాఖా గ్రంథం నుండి తీసుకోవాలి. ఇక్కడ చూపిన విధానం రాజశేఖరుని విజయ శర్మ గారి తెలుగు పితృ తర్పణ పత్రం; ఒక ఇంటి పద్ధతిగా యథాతథంగా ఇచ్చాం." },
        stotras: [{ deity: "pitr", m: "tarpana vidhi" }, { deity: "pitr", m: "rucistava" }, { deity: "pitr", m: "vajasaneyi" }, { deity: "pitr", m: "rgveda" }, { deity: "pitr", m: "ruci-krtam" }, { deity: "pitr", m: "brahma-krtam" }],
      },
      {
        id: "yama-tarpanam", deity: "pitr", kind: "tarpana", parva: true,
        name: { roman: "Yama Tarpaṇam", deva: "यम तर्पणम्", tel: "యమ తర్పణం" },
        rule: { roman: "Naraka Caturdaśī · after the pre-dawn bath", deva: "नरक चतुर्दशी · प्रभात स्नान के बाद", tel: "నరక చతుర్దశి · తెల్లవారుజాము స్నానం తరువాత" },
        find: (y) => narakaDay(y), decisionKala: "chandrodaya", kala: "arunodaya",
        duration: { roman: "Between the oil bath and sunrise", tel: "అభ్యంగ స్నానం, సూర్యోదయం మధ్య" },
        who: { roman: "Offered by everyone, including those whose father is living. The traditions state this exception plainly. It is a tarpaṇam to Yama, not to one's own pitṛs.",
               tel: "అందరూ చేస్తారు, తండ్రి జీవించి ఉన్నవారితో సహా. సంప్రదాయాలు ఈ మినహాయింపును స్పష్టంగా చెబుతాయి. ఇది యమునికి తర్పణం, స్వకీయ పితరులకు కాదు." },
        tagline: { roman: "Fourteen names of Yama. Water is offered once at each name.",
                   tel: "యమునికి పదునాలుగు నామాలు. ప్రతి నామానికి ఒకసారి నీరు సమర్పిస్తారు." },
        significance: [
          { roman: "The day is decided by the caturdaśī standing at moonrise. The tarpaṇam follows the prescribed bath. It is a rite of the small hours, not an afternoon pitṛ observance.",
            tel: "చంద్రోదయ సమయంలో ఉన్న చతుర్దశి రోజును నిర్ణయిస్తుంది. తర్పణం నిర్దేశిత స్నానం తరువాత చేయాలి. ఇది తెల్లవారుజాము కర్మ, మధ్యాహ్న పితృ కర్మ కాదు." },
          { roman: "The fourteen names — Yama, Dharmarāja, Mṛtyu, Antaka, Vaivasvata, Kāla, Sarvabhūtakṣaya, Audumbara, Dadhna, Nīla, Parameṣṭhī, Vṛkodara, Citra, Citragupta.",
            tel: "పదునాలుగు నామాలు — యమ, ధర్మరాజ, మృత్యు, అంతక, వైవస్వత, కాల, సర్వభూతక్షయ, ఔదుంబర, దధ్న, నీల, పరమేష్ఠి, వృకోదర, చిత్ర, చిత్రగుప్త." },
          { roman: "Posture and tīrtha differ by source. Savya or apasavya, and which part of the hand releases the water. Take these from your prayoga.",
            tel: "ఆసనం, తీర్థం మూలాన్ని బట్టి మారుతాయి. సవ్యమా అపసవ్యమా, నీరు చేతిలో ఏ భాగం నుండి విడవాలి. ఇవి మీ ప్రయోగం నుండి తీసుకోండి." },
        ],
        samagri: [
          { roman: "Sesame oil for the bath", tel: "స్నానానికి నువ్వుల నూనె" },
          { roman: "Black sesame, water, darbha", tel: "నల్ల నువ్వులు, నీరు, దర్భ" },
        ],
        source: { roman: "Day-selection after Dharma Sindhu 8 (candrodaya-vyāpinī caturdaśī); posture, tīrtha and the order of names are prayoga-specific.",
                  tel: "రోజు నిర్ణయం ధర్మసింధు 8 ప్రకారం (చంద్రోదయ వ్యాపిని చతుర్దశి); ఆసనం, తీర్థం, నామ క్రమం ప్రయోగాన్ని బట్టి." },
        stotras: [],
      },
      {
        id: "yama-angaraka", deity: "pitr", kind: "tarpana", everyMonth: true, parva: true,
        name: { roman: "Kṛṣṇāṅgāraka Caturdaśī Yama Tarpaṇam", deva: "कृष्णाङ्गारक चतुर्दशी यम तर्पणम्", tel: "కృష్ణాంగారక చతుర్దశి యమ తర్పణం" },
        rule: { roman: "A Tuesday joined with kṛṣṇa caturdaśī", deva: "कृष्ण चतुर्दशी से युक्त मङ्गलवार", tel: "కృష్ణ చతుర్దశితో కూడిన మంగళవారం" },
        find: (y, m) => {
          const from = (typeof m === "number") ? m : new Date().getMonth();
          const yy = (typeof m === "number") ? y : new Date().getFullYear();
          const list = angarakaDays(yy, from);
          return list.length ? list[0] : null;
        },
        kala: "aparahna",
        duration: { roman: "As your prayoga's published timing gives it", tel: "మీ ప్రయోగం ప్రకటించిన కాలం ప్రకారం" },
        who: { roman: "Published as applying even to those who do not ordinarily keep the amāvāsyā tarpaṇam, and permitted where the father is living.",
               tel: "సాధారణంగా అమావాస్య తర్పణం చేయనివారికీ వర్తిస్తుందని ప్రకటించారు; తండ్రి జీవించి ఉన్నా అనుమతి ఉంది." },
        tagline: { roman: "A Tuesday that falls on the dark fourteenth. It is a second Yama day, and it may come in any month.",
                   tel: "బహుళ చతుర్దశి మంగళవారం వచ్చినప్పుడు. ఇది రెండవ యమ దినం. ఏ మాసంలోనైనా రావచ్చు." },
        significance: [
          { roman: "The trigger is a coincidence, not a month. Weekday, pakṣa and tithi must fall together. It is not an Āṣāḍha or Śrāvaṇa rite.",
            tel: "ఇది మాసం కాదు, కలయిక. వారం, పక్షం, తిథి కలిసి రావాలి. ఇది ఆషాఢ లేదా శ్రావణ కర్మ కాదు." },
          { roman: "Where caturdaśī only partly overlaps the Tuesday, the published pañcāṅga of your tradition decides. Stuti names the day it finds and shows the overlap. It does not rule on it.",
            tel: "చతుర్దశి ఆ మంగళవారంతో పాక్షికంగా మాత్రమే కలిసినప్పుడు, మీ సంప్రదాయపు ప్రకటిత పంచాంగమే నిర్ణయిస్తుంది. స్తుతి కనిపించిన రోజును చెప్పి, కలయికను చూపుతుంది. తీర్పు చెప్పదు." },
        ],
        source: { roman: "Kanchi Veda Dharma Śāstra Paripālana Sabha publishes this Yama Tarpaṇam day and its procedure; the overlap tie-break is left to that authority.",
                  tel: "కంచి వేద ధర్మ శాస్త్ర పరిపాలన సభ ఈ యమ తర్పణ దినాన్ని, విధానాన్ని ప్రకటిస్తుంది; అతివ్యాప్తి నిర్ణయం ఆ ప్రామాణికతకే వదిలేశాం." },
        stotras: [],
      },
      {
        id: "bhishma-tarpanam", deity: "pitr", kind: "tarpana", parva: true,
        name: { roman: "Bhīṣma Tarpaṇam · Bhīṣmāṣṭamī", deva: "भीष्म तर्पणम् · भीष्माष्टमी", tel: "భీష్మ తర్పణం · భీష్మాష్టమి" },
        rule: { roman: "Māgha · Śukla Aṣṭamī", deva: "माघ शुक्ल अष्टमी", tel: "మాఘ శుద్ధ అష్టమి" },
        find: (y) => { const d = bhishmaDays(y); return d.length ? d[0] : null; },
        kala: "madhyahna",
        duration: { roman: "Madhyāhna, in the common practice", tel: "సాధారణ ఆచారంలో మధ్యాహ్నం" },
        who: { roman: "Anyone, of any gotra. Those whose father is living may offer it too. Bhīṣma died without a son, so the arghya is given by whoever gives it.",
               tel: "ఏ గోత్రం వారైనా చేయవచ్చు. తండ్రి జీవించి ఉన్నవారూ చేయవచ్చు. భీష్మునికి పుత్రుడు లేడు, కాబట్టి అర్ఘ్యం ఇచ్చినవారే ఇచ్చినవారు." },
        tagline: { roman: "Bhīṣma died without a son. Water is given to him in his own pravara, by anyone.",
                   tel: "భీష్ముడు పుత్రుడు లేకుండా గతించాడు. ఆయన ప్రవరతోనే, ఎవరైనా ఆయనకు నీరు సమర్పించవచ్చు." },
        significance: [
          { roman: "Bhīṣma left the body on Māgha śukla aṣṭamī, after lying on the bed of arrows. The day is kept as his tithi.",
            tel: "అంపశయ్యపై ఉండి, మాఘ శుద్ధ అష్టమి నాడు భీష్ముడు దేహం విడిచాడు. ఆ రోజును ఆయన తిథిగా ఆచరిస్తారు." },
          { roman: "When aṣṭamī spans two civil days, the traditions part. Some keep the śrāddha day apart from the snāna-and-tarpaṇa day. Both days are shown. Your prayoga chooses.",
            tel: "అష్టమి రెండు రోజులకు వ్యాపించినప్పుడు సంప్రదాయాలు వేరుపడతాయి. కొన్ని శ్రాద్ధ దినాన్ని స్నాన-తర్పణ దినం నుండి వేరు చేస్తాయి. రెండు రోజులూ చూపుతాం. మీ ప్రయోగమే ఎంచుకుంటుంది." },
          { roman: "Bhīṣma Pañcaka runs from Kārtika śukla ekādaśī to pūrṇimā. It is a separate observance, kept by some traditions. It is not a second annual Bhīṣma tarpaṇa day.",
            tel: "భీష్మ పంచకం కార్తిక శుద్ధ ఏకాదశి నుండి పౌర్ణమి వరకు. ఇది కొన్ని సంప్రదాయాలు ఆచరించే వేరే కర్మ. ఇది రెండవ వార్షిక భీష్మ తర్పణ దినం కాదు." },
        ],
        samagri: [
          { roman: "Black sesame, water, darbha", tel: "నల్ల నువ్వులు, నీరు, దర్భ" },
          { roman: "Akṣata and a flower", tel: "అక్షతలు, పుష్పం" },
        ],
        source: { roman: "The annual arghya is attested in the smṛti material and published in the Kanchi ritual calendar; the dual-day aṣṭamī nirṇaya is prayoga-specific and is not decided here.",
                  tel: "వార్షిక అర్ఘ్యం స్మృతి సామగ్రిలో ఉంది, కంచి ఆచార పంచాంగంలో ప్రకటితం; అష్టమి రెండు రోజుల నిర్ణయం ప్రయోగాన్ని బట్టి — ఇక్కడ తీర్మానించలేదు." },
        stotras: [{ deity: "vishnu", m: "sahasranama" }],
      }
    );
  }
  defineEntries();
  const ids = () => entries.map((e) => e.id);

  function next(from) {
    const V = STUTI_VRATA; if (!V) return null;
    const set = ids();
    return V.upcoming().filter((u) => set.indexOf(u.v.id) !== -1).sort((a, b) => a.date - b.date)[0] || null;
  }
  /* The next tarpaṇa occasion of any kind, from a given day.
     `next` walks the named parva entries only, so it cannot see Saṅkrānti
     Pitṛ-kārya or the mahālaya pakṣa — both are decided per day at their own
     kāla rather than being entries. Reading forward through `occasionsOn` is
     the same source the calendar marks its days from, so a screen showing the
     dots and a screen naming the next day cannot disagree. A run of
     consecutive days is reported with the day it ends on. */
  function nextOccasion(from, loc) {
    const L = loc || place();
    const base = from || new Date();
    const day = (n) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + n);
    for (let i = 1; i <= 60; i++) {
      let occ = [];
      try { occ = occasionsOn(day(i), L) || []; } catch (e) { continue; }
      if (!occ.length) continue;
      const start = day(i);
      let last = start;
      for (let k = i + 1; k <= i + 40; k++) {
        let o2 = [];
        try { o2 = occasionsOn(day(k), L) || []; } catch (e) { break; }
        if (!o2.length) break;
        last = day(k);
      }
      return { name: occ[0].name, date: start, last: last > start ? last : null, occ: occ };
    }
    const n = next(base);
    return n && n.date ? { name: n.v.name, date: n.date, last: null, occ: [] } : null;
  }

  /* The eclipse days ahead. An eclipse is not a tithi, so it is not in the
     vrata list and a forward walk of every day would cost a year of forDay
     calls. It can only fall at pūrṇimā or amāvāsyā, so only those days are
     asked — and each with the day either side, since the eclipse may cross
     midnight into the neighbouring civil day. */
  function grahanaDaysAhead(months, loc) {
    const Pa = P(), L = loc || place(), out = [], seen = {};
    if (!Pa) return out;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const check = (d) => {
      if (!d || d < today) return;
      const k = dayKeyOf(d);
      if (seen[k]) return;
      seen[k] = 1;
      try {
        const pa = Pa.forDay(d, L);
        if (pa.grahana && pa.grahana.visible && pa.grahana.type !== "penumbral") out.push({ date: new Date(d), gr: pa.grahana });
      } catch (e) {}
    };
    const near = (d) => { if (!d) return; const s = new Date(d); check(new Date(s.getFullYear(), s.getMonth(), s.getDate() - 1)); check(s); check(new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1)); };
    [14, 29].forEach((ti) => {
      let cur = today;
      for (let i = 0; i < (months || 14); i++) {
        let d = null;
        try { d = Pa.nextTithiFrom(cur, ti, L); } catch (e) { break; }
        if (!d) break;
        near(d);
        cur = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2);
      }
    });
    return out.sort((a, b) => a.date - b.date);
  }

  /* The row says which grahaṇa it is, because "an eclipse" is not a day one
     can prepare for: khagrāsa sūrya is not khaṇḍa candra. Each language gets
     its whole phrase, and the type words are held in their attributive form —
     ఖగ్రాస, not ఖగ్రాసం — because an adjective before a noun is not the noun
     with a letter chopped off it. */
  const GR_TYPE = {
    total:   { roman: "Khagrāsa",   deva: "खग्रास",  tel: "ఖగ్రాస" },
    annular: { roman: "Valayākāra", deva: "वलयाकार", tel: "వలయాకార" },
    partial: { roman: "Khaṇḍa",     deva: "खण्ड",    tel: "ఖండ" },
  };
  const GR_KIND = {
    solar: { roman: "Sūrya Grahaṇa",  deva: "सूर्य ग्रहण",  tel: "సూర్య గ్రహణ" },
    lunar: { roman: "Candra Grahaṇa", deva: "चन्द्र ग्रहण", tel: "చంద్ర గ్రహణ" },
  };
  function grahanaName(gr) {
    const n = gr && GR_KIND[gr.kind];
    if (!n) return GRAHANA_NAME;
    const t = GR_TYPE[gr.type] || null;
    return {
      roman: [t ? t.roman : "", n.roman, "Tarpaṇam"].filter(Boolean).join(" "),
      deva:  [t ? t.deva : "", n.deva, "तर्पणम्"].filter(Boolean).join(" "),
      tel:   [t ? t.tel : "", n.tel, "తర్పణం"].filter(Boolean).join(" "),
    };
  }

  /* the upcoming tarpaṇa days, soonest first — the Pitṛ calendar's own list.
     The named parvas come from the vrata list; the eclipse and the next solar
     ingress are added here, because neither is a tithi and neither would
     otherwise reach a page that is meant to show every tarpaṇa day ahead. */
  function upcoming(limit, loc) {
    const V = STUTI_VRATA; if (!V) return [];
    const L = loc || place(), Pa = P();
    const set = ids();
    const out = V.upcoming().filter((u) => set.indexOf(u.v.id) !== -1).slice();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const awayOf = (d) => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - today) / 86400000);
    grahanaDaysAhead(14, L).forEach((g) => out.push({ v: { id: "grahana-tarpanam", name: grahanaName(g.gr) }, date: g.date, away: awayOf(g.date) }));
    /* one ingress, not twelve: the next one. The others are a monthly rule,
       and a list of them would bury the parvas it sits among. */
    try {
      const y = today.getFullYear();
      let nextS = null;
      [y, y + 1].forEach((yy) => {
        (Pa.sankrantis(yy) || []).forEach((s) => {
          const d = Pa.sankrantiDay(yy, s.rashi);
          if (d && d >= today && (!nextS || d < nextS)) nextS = d;
        });
      });
      if (nextS) out.push({ v: { id: "sankranti-pitru", name: SANKRANTI_NAME }, date: nextS, away: awayOf(nextS) });
    } catch (e) {}
    return out.sort((a, b) => a.date - b.date).slice(0, limit || 12);
  }

  /* the year's vyatīpāta and vaidhṛti days, found by walking the year — asked
     for only when one of those groups is opened */
  const yogaCache = {};
  function yogaDays(y, loc) {
    const L = loc || place(), ck = y + "|" + placeKey(L);
    if (yogaCache[ck]) return yogaCache[ck];
    const Pa = P(), vy = [], vd = [];
    try {
      const d = D(y, 0, 1);
      for (let i = 0; i < 366 && d.getFullYear() === y; i++) {
        const pa = Pa.forDay(d, L);
        if (pa.yoga === "Vyatīpāta") vy.push({ date: new Date(d) });
        else if (pa.yoga === "Vaidhṛti") vd.push({ date: new Date(d) });
        d.setDate(d.getDate() + 1);
      }
    } catch (e) {}
    yogaCache[ck] = { vyatipata: vy, vaidhriti: vd };
    return yogaCache[ck];
  }

  return {
    entries, ids, onDay, occasionsOn, next, nextOccasion, upcoming, grahanaDaysAhead, grahanaName, why, rulesFor, RULES, KALA,
    place, forget, profile, mahalaya, shannavati, yogaDays, bhishmaDays, angarakaDays,
    window: window_, instant, tithiAt, dayCarrying, daysCarrying,
    bind: (fns) => { lunar = fns.lunar; monthStart = fns.monthStart; governed = fns.governed; ref = fns.ref; },
  };
})();
export const STUTI_TARPANA_EXTRA = STUTI_TARPANA;

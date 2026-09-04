import { pick3 } from "./stuti-library";
import ReactDOM from "react-dom";
import React from "react";
import { DanaRow } from "./stuti-dana";
import { STUTI } from "./stuti-data";
import { STUTI_DESA } from "./stuti-desa";
import { STUTI_EPHEM } from "./stuti-ephemeris";
import { SankalpaSheet, useFlyleaf } from "./stuti-flyleaf";
import { STUTI_L } from "./stuti-i18n";
import { FavButton, Icon, Seal, deityStyle, useFavs } from "./stuti-icons";
import { masaMixFor } from "./stuti-masa";
import { nityaQueue } from "./stuti-nitya-queue";
import { STUTI_MUHURTA } from "./stuti-muhurta";
import { STUTI_NUDGE } from "./stuti-nudge";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { MoonPhase, RTU_VIS, SK_CONST, SeasonAmbient, samvatsaraFor, useLoc } from "./stuti-panchanga";
import { STUTI_PREFS } from "./stuti-prefs";
import { HomePrepCard } from "./stuti-prep";
import { hymnParts } from "./stuti-reader";
import { STUTI_RECITE } from "./stuti-recite";
import { manaSys, masaShown } from "./stuti-reckoning";
import { SandhyaCard } from "./stuti-sandhya";
import { SkyHeader } from "./stuti-sky";
import { STUTI_FAVS_WEEK, STUTI_PROGRESS } from "./stuti-store";
import { STUTI_RITUAL } from "./stuti-texts";
import { STUTI_TRANSLIT } from "./stuti-translit";
import { STUTI_VOICE } from "./stuti-voice";

/* ============================================================
   STUTI — home (Today)
   The home greets you, gives you one prominent way to search all
   texts, offers to resume any recitation you left mid-way, then
   presents the day's pañcāṅga. Everything else (deities → forms →
   reader) hangs off the Browse tab.
   ============================================================ */

/* today's deity + its first hymn (drives the home accent + saṅkalpa) */
function todayInfo() {
  const S = STUTI;
  const t = S.today();
  const first = S.hymnsForDeity(t.deity.id)[0];
  return { t, deity: t.deity, hymn: first };
}

/* ---- a prominent, always-present entry into search ---- */
function HomeSearchBar({ go, lang = "deva" }) {
  const L = STUTI_L;
  return (
    <div className="home-search">
      <button className="home-search-go" onClick={() => go("search", { from: "home" })} aria-label={L.t("search", lang)}>
        <Icon name="search" size={20} />
        <span>{L.t("searchHint", lang)}</span>
      </button>
      {STUTI_VOICE && STUTI_VOICE.supported && (
        <button type="button" className="voice-btn" onClick={() => go("search", { from: "home", voice: true })} aria-label={L.t("aVoice", lang)} title={L.t("aVoice", lang)}><Icon name="mic" size={19} /></button>
      )}
    </div>
  );
}

/* ---- resume: reactive read of the last-read pointer ---- */
function useProgress() {
  const [rec, setRec] = React.useState(() => STUTI_PROGRESS.get());
  React.useEffect(() => STUTI_PROGRESS.subscribe(setRec), []);
  return rec;
}

/* ---- "Continue reciting" — jumps back to your exact spot ---- */
function ContinueCard({ go, lang = "deva" }) {
  const S = STUTI, L = STUTI_L;
  const rec = useProgress();
  if (!rec) return null;
  const h = S.hymnById(rec.hymnId);
  if (!h || !h.verses || h.verses.length === 0) return null;
  const total = rec.total || 1;
  // only offer mid-recitation: past the opening line, not yet at the close
  if (rec.line < 1 || rec.line >= total - 1) return null;
  const d = S.deityById[h.deity];
  if (!d) return null;
  const verses = rec.verses || h.verses.length;
  const verseNo = Math.min(verses, (rec.verse || 0) + 1);
  const pct = Math.max(6, Math.round(((rec.line + 1) / total) * 100));
  return (
    <button className="resume-card" style={deityStyle(d)} onClick={() => go("reader", { deity: d.id, hymn: h.id, from: "home" })}>
      <Seal d={d} size={44} />
      <div className="resume-body">
        <div className="resume-cap">{L.t("continueReciting", lang)}</div>
        <div className="resume-title" style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(h, lang)}</div>
        <div className="resume-prog">
          <div className="resume-track"><span style={{ width: pct + "%" }} /></div>
          <span className="resume-verse">{verseNo}<i>/{verses}</i></span>
        </div>
      </div>
      <span className="resume-go"><Icon name="play" size={18} /></span>
    </button>
  );
}

/* ---- the daily pañcāṅga, presented calm & airy (one limb per row) ----
   The full almanac is always visible; the saṅkalpa opens as a focused
   bottom sheet. Built on the same engine + stores as the card it
   replaces, so it shows today's real data. ---- */
function sFont(s) { return s === "telugu" ? "var(--font-telugu)" : s === "roman" ? "var(--font-display)" : "var(--font-deva)"; }
function skFold(x) { return (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }

/* the saṅkalpa's identity now lives in the flyleaf — one store, read here with
   the same field-wise shape the builder has always used */
function useSankalpa() { return useFlyleaf(); }

/* everything a presentation of today needs: limbs, timings, saṅkalpa text */
function usePanchangaVM(lang, sk, deity) {
  const L = lang || "deva";
  const PA = AKSHARA_PANCHANGA, TR = STUTI_TRANSLIT, I18 = STUTI_L;
  const { loc } = useLoc();
  /* the pañcāṅga preferences change what this card says — the māna the
     saṅkalpa names, how the months are named, which ayanāṁśa the longitudes sit
     on. Read at render time, so the card has to hear about a change. */
  const [, bumpPrefs] = React.useState(0);
  React.useEffect(() => STUTI_PREFS.subscribe(() => bumpPrefs((n) => n + 1)), []);
  /* Home reads the limbs at the moment of viewing, so a card left open drifts
     out of date. Tick it at the next boundary rather than on a blind interval:
     one timer, and it fires exactly when something has actually changed. */
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const p = AKSHARA_PANCHANGA.forDay(new Date(), loc, { instant: true });
    const mins = [p.karanaEndMin, p.tithiEndMin, p.nakEndMin, p.yogaEndMin].filter((m) => m != null);
    if (!mins.length) return;
    const nowMin = (() => {
      const tz = AKSHARA_PANCHANGA.effTz(loc, new Date());
      const u = new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + new Date().getUTCSeconds() / 60;
      return (((u + tz * 60) % 1440) + 1440) % 1440;
    })();
    const next = Math.min.apply(null, mins.filter((m) => m > nowMin).concat([1440 + 1]));
    const ms = Math.max(20000, (next - nowMin) * 60000 + 2000);
    const id = setTimeout(() => tick((n) => n + 1), Math.min(ms, 2147483647));
    return () => clearTimeout(id);
  });
  const now = new Date();
  const dateLocale = L === "telugu" ? "te-IN" : L === "deva" ? "hi-IN" : undefined;
  const pa = PA.forDay(now, loc, { instant: true });
  const MU = STUTI_MUHURTA;
  /* windows (rāhu, varjyam, …) are pegged to the day's sunrise, not the
     instant we happen to render at — an instant-anchored jdRef drifts the
     varjyam span every time this recomputes, which lit the badge at the
     wrong hour. Use the sunrise-anchored pa for the spans, live clock for "now". */
  const paDay = PA.forDay(now, loc);
  const muNow = MU ? MU.currentAndNext(now, loc, paDay).current : null;
  const samv = samvatsaraFor(now);
  const dateStr = now.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long" });

  const pick = o => L === "telugu" ? { main: o.tel, sub: o.iast } : L === "roman" ? { main: o.iast, sub: null } : { main: o.deva, sub: o.iast };
  const samvTel = TR.convert(samv[1], "telugu");
  const varaGraha = SK_CONST.VARA_GRAHA[pa.varaIdx] || SK_CONST.VARA_GRAHA[0];
  const varaP = pick({ iast: varaGraha.iast, deva: varaGraha.deva, tel: varaGraha.tel });
  const nakP = pick(pa.nak), masaP = pick(masaShown(pa)), rituP = pick(pa.ritu), ayanaP = pick(pa.ayana);
  const samvP = pick({ iast: samv[0], deva: samv[1], tel: samvTel });
  const tithiP = pick({ iast: pa.tithiName, deva: pa.tithiDeva, tel: pa.tithiTel });
  const pakshaP = pick({ iast: pa.paksha, deva: pa.pakshaDeva, tel: pa.pakshaTel });
  const localName = (iast, deva) => L === "telugu" ? TR.convert(deva || iast, "telugu") : L === "deva" ? (deva || iast) : iast;
  const yogaV = localName(pa.yoga, SK_CONST.YOGA_DEVA[pa.yoga]);
  const karanaV = localName(pa.karana, SK_CONST.KARANA_DEVA[pa.karana]);

  const untilW = I18.t("untilTime", L);
  const tmrwW = pa.tithiEndsTomorrow ? " (" + I18.t("tomorrowShort", L) + ")" : "";
  const tEnd = PA.fmtTime(pa.tithiEndMin);
  const endsStr = L === "roman" ? `${untilW} ${tEnd}${tmrwW}` : `${tEnd} ${untilW}${tmrwW}`;
  const fmtWindow = w => w ? `${PA.fmtTime(w.start)} – ${PA.fmtTime(w.end)}` : "—";
  /* every limb gets its closing hour, phrased like the tithi line above.
     A nākṣatra or karaṇa without one is half an answer. */
  const until = (min) => {
    if (min == null) return null;
    const mark = min >= 1440 ? " (" + I18.t("tomorrowShort", L) + ")" : "";
    const t = PA.fmtTime(min);
    return (L === "roman" ? `${untilW} ${t}` : `${t} ${untilW}`) + mark;
  };

  const isUttar = pa.ayana.iast.startsWith("Uttar");
  const moonRow = (key, min, next) => ({
    key,
    main: min != null ? PA.fmtTime(min) : "—",
    till: min == null && next != null
      ? I18.t("moonNoRise", L).replace("{t}", PA.fmtTime(next) + " (" + I18.t("tomorrowShort", L) + ")")
      : null,
  });
  const coord = [
    { key: "limbSamvatsara", main: samvP.main, sub: samvP.sub, script: true },
    { key: "limbAyana", main: ayanaP.main, sub: isUttar ? "northward" : "southward", script: true },
    { key: "limbRtu", main: rituP.main, sub: pa.ritu.en, script: true },
    { key: "limbMasa", main: masaP.main, sub: masaP.sub, script: true },
    { key: "limbVara", main: varaP.main, sub: varaP.sub, script: true },
    { key: "limbNakshatra", main: nakP.main, sub: nakP.sub, till: until(pa.nakEndMin), script: true },
  ];
  const sun = [
    { key: "sunrise", main: PA.fmtTime(pa.sunrise) },
    { key: "sunset", main: PA.fmtTime(pa.sunset) },
    { key: "dayLength", main: PA.fmtDur(pa.dayLen) },
    /* moonrise is not decoration — a nakta vrata is broken on sighting the
       moon, and Saṅkaṣṭī is kept to it. On the one date a month that has no
       moonrise, say so and give the next: a bare dash reads as a fault. */
    moonRow("moonrise", pa.moonrise, pa.moonriseNext),
    moonRow("moonset", pa.moonset, pa.moonsetNext),
  ];
  const yk = [
    { key: "yoga", main: yogaV, till: until(pa.yogaEndMin), script: true },
    /* Home is always today, so the karaṇa that closed before breakfast is
       just noise — the one running now and the one after it answer the
       question. The Calendar, which browses any day, lists them all. */
    { key: "karana", vals: (() => {
        const E = STUTI_EPHEM;
        const out = [{ main: karanaV, till: until(pa.karanaEndMin) }];
        const end1 = (E && pa.jdRef != null) ? E.karanaEnd(pa.jdRef) : null;
        if (end1 != null && pa.karanaEndMin != null) {
          const inNext = end1 + 1 / 2880;
          const end2 = E.karanaEnd(inNext);
          const nm = PA.forDay(E.toDate(inNext), loc, { instant: true }).karana;
          const endMin = end2 == null ? null : pa.karanaEndMin + (end2 - end1) * 1440;
          out.push({ main: localName(nm, SK_CONST.KARANA_DEVA[nm]), till: until(endMin) });
        }
        return out;
      })(), script: true },
  ];
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const inWindow = w => w && nowMin >= w.start && nowMin <= w.end;
  const caution = [
    { key: "rahuKala", vals: [fmtWindow(pa.rahu)], active: inWindow(pa.rahu) },
    { key: "durmuhurta", vals: pa.durmuhurta ? pa.durmuhurta.map(fmtWindow) : ["—"], active: pa.durmuhurta ? pa.durmuhurta.some(inWindow) : false },
  ];

  const ayanaLocIast = isUttar ? "Uttar\u0101ya\u1e47e" : "Dak\u1e63i\u1e47\u0101yane";
  const ayanaLocDeva = isUttar ? "\u0909\u0924\u094d\u0924\u0930\u093e\u092f\u0923\u0947" : "\u0926\u0915\u094d\u0937\u093f\u0923\u093e\u092f\u0928\u0947";
  const gotraObj = SK_CONST.GOTRAS.find(g => skFold(g[0]) === skFold(sk.gotra));
  const gDeva = gotraObj ? gotraObj[1] : (sk.gotra.trim() || "____");
  const gIast = gotraObj ? gotraObj[0] : (sk.gotra.trim() || "____");
  const nm = sk.nama.trim() || "____";
  const male = sk.gender !== "female";
  const karmaObj = SK_CONST.KARMAS.find(k => k.id === sk.karma) || SK_CONST.KARMAS[0];
  const seg = (deva, iast, em) => ({ deva, iast, em: !!em });
  const DS = STUTI_DESA;
  const desaSegs = DS
    ? DS.segs(loc, seg, sk.desa, sk.frame || undefined)
    : [seg("जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, मेरोः दक्षिण-दिग्भागे,", "jambū-dvīpe, bhārata-varṣe, bharata-khaṇḍe, meroḥ dakṣiṇa-digbhāge,")];
  const saura = typeof manaSys === "function" && manaSys() === "saura";
  const sd = saura && PA.solarDate ? PA.solarDate(now) : null;
  const skSegs = [
    seg("ॐ श्री", "Oṃ Śrī"),
    seg("मम उपात्त-समस्त-दुरितक्षयद्वारा श्रीपरमेश्वर-प्रीत्यर्थं,", "mama upātta-samasta-durita-kṣaya-dvārā śrī-parameśvara-prītyarthaṃ,"),
    seg("शुभे शोभने मुहूर्ते,", "śubhe śobhane muhūrte,"),
    seg("आद्य-ब्रह्मणः द्वितीय-परार्धे, श्वेत-वराह-कल्पे, वैवस्वत-मन्वन्तरे, कलियुगे, प्रथम-पादे,", "ādya-brahmaṇaḥ dvitīya-parārdhe, śveta-varāha-kalpe, vaivasvata-manvantare, kaliyuge, prathama-pāde,"),
    /* where it is being spoken. Derived from the location: the river basin and
       which bank of it, then the kṣetra if the place has a settled name. */
    ...desaSegs,
    /* and the reckoning the date below is named in — the clause the app used to
       run together with the deśa as "vartamāna-vyāvahārika-deśe", which belongs
       to neither half */
    saura
      ? seg("अस्मिन् वर्तमान-व्यावहारिक सौरमानेन,", "asmin vartamāna-vyāvahārika sauramānena,")
      : seg("अस्मिन् वर्तमान-व्यावहारिक चान्द्रमानेन,", "asmin vartamāna-vyāvahārika cāndramānena,"),
    seg(`${samv[1]} नाम संवत्सरे,`, `${samv[0]} nāma saṃvatsare,`, true),
    seg(`${ayanaLocDeva},`, `${ayanaLocIast},`, true),
    seg(`${pa.ritu.deva} ऋतौ,`, `${pa.ritu.iast} ṛtau,`, true),
    /* a saura saṅkalpa names the sun's month and the day counted from its
       saṅkrānti; a cāndra one names the lunar month and lets the tithi carry
       the day */
    saura && sd
      ? seg(`${sd.masa.deva} मासे, ${PA.toDeva(sd.day)} दिने,`, `${sd.masa.iast} māse, ${sd.day} dine,`, true)
      : seg(`${masaShown(pa).deva} मासे,`, `${masaShown(pa).iast} māse,`, true),
    seg(`${pa.pakshaDeva} पक्षे,`, `${pa.paksha} pakṣe,`, true),
    seg(`${pa.tithiDeva} तिथौ,`, `${pa.tithiName} tithau,`, true),
    seg(`${varaGraha.deva} वासरे,`, `${varaGraha.iast} vāsare,`, true),
    seg(`${pa.nak.deva} नक्षत्र-युक्तायां,`, `${pa.nak.iast} nakṣatra-yuktāyāṃ,`, true),
    seg("शुभयोग-शुभकरण-एवंगुण-विशेषण-विशिष्टायां अस्यां शुभतिथौ,", "śubha-yoga-śubha-karaṇa-evaṃguṇa-viśeṣaṇa-viśiṣṭāyām asyāṃ śubha-tithau,"),
    seg(
      male ? `${gDeva}-गोत्रस्य ${nm}-नामधेयस्य अहम्` : `${gDeva}-गोत्रायाः ${nm}-नामधेयायाः अहम्`,
      male ? `${gIast}-gotrasya ${nm}-nāmadheyasya aham` : `${gIast}-gotrāyāḥ ${nm}-nāmadheyāyāḥ aham`,
      true
    ),
    deity
      ? seg(`श्री ${deity.deva}-प्रीत्यर्थं ${karmaObj.deva} करिष्ये॥`, `śrī ${deity.name}-prītyarthaṃ ${karmaObj.iast} kariṣye.`)
      : seg(`इष्टकाम्यार्थसिद्ध्यर्थं ${karmaObj.deva} करिष्ये॥`, `iṣṭa-kāmyārtha-siddhyarthaṃ ${karmaObj.iast} kariṣye.`),
  ];
  const segText = s => L === "telugu" ? TR.convert(s.deva, "telugu") : L === "deva" ? s.deva : s.iast;
  const skPlain = skSegs.map(segText).join(" ");

  return {
    L, pa, dateStr,
    tithi: { main: tithiP.main, paksha: pa.soloTithi ? null : pakshaP.main, full: pa.soloTithi ? pa.tithiName : `${pa.paksha} ${pa.tithiName}`, ends: endsStr },
    coord, sun, yk, caution,
    muNow,
    skSegs, segText, skPlain, rahuStr: fmtWindow(pa.rahu),
    desaLine: DS ? (L === "telugu" ? TR.convert(DS.describe(loc, "deva"), "telugu") : DS.describe(loc, L === "roman" ? "iast" : "deva")) : "",
    desaOutside: DS ? !DS.inIndia(loc) : false,
    desaSuggest: DS ? DS.suggest(loc) : "bharata",
  };
}

/* ============ Home — "Today, first" (calm pañcāṅga + saṅkalpa sheet) ============ */
function HomeA({ go, lang, overlayEl }) {
  const L = lang || "deva";
  const t = k => STUTI_L.t(k, L);
  const { deity } = todayInfo();
  const sk = useSankalpa();
  const vm = usePanchangaVM(L, sk, deity);
  /* the running ṛtu, published for the season tint (stuti-pigment.css) */
  React.useEffect(() => {
    try {
      const tok = { "Śiśira": "sisira", "Vasanta": "vasanta", "Grīṣma": "grisma", "Varṣā": "varsa", "Śarad": "sarad", "Hemanta": "hemanta" }[vm.pa.ritu.iast];
      if (tok) document.documentElement.setAttribute("data-rtu", tok);
    } catch (e) {}
  }, [vm.pa.ritu.iast]);
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const [muNoteOpen, setMuNoteOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const explainMu = () => {
    if (muNoteOpen) { setNote(null); setMuNoteOpen(false); return; }
    const m = vm.muNow;
    const lbl = m.label[L === "telugu" ? "tel" : L === "roman" ? "roman" : "deva"];
    const untilTxt = L === "telugu" ? "వరకు" : L === "deva" ? "तक" : "until";
    const time = AKSHARA_PANCHANGA.fmtTime(m.end);
    const kindTxt = L === "telugu" ? "ఇప్పుడు నడుస్తోంది"
      : L === "deva" ? "अभी चल रहा है"
      : "is running now";
    setNote(L === "telugu" ? `${lbl} ${kindTxt}, ${time} ${untilTxt}.`
      : L === "deva" ? `${lbl} ${kindTxt}, ${time} ${untilTxt}.`
      : `${lbl} ${kindTxt}, ${untilTxt} ${time}.`);
    setMuNoteOpen(true);
  };
  const explainRow = (it) => {
    setMuNoteOpen(false);
    const lbl = t(it.key);
    const when = it.vals.join(", ");
    setNote(it.active ? `${lbl} is in effect right now (${when}).` : `${lbl} isn't in effect right now — today's window is ${when}.`);
  };
  /* the bell is a switch over the daily pañcāṅga nudge, not a one-shot send:
     tapping it on subscribes and sends today's line as the confirmation;
     tapping it off says the nudges are stopped. */
  const [bellTick, setBellTick] = React.useState(0);
  const panchangaBellOn = !!((STUTI_PREFS.get().remind || {}).tithi);
  const togglePanchangaNotif = () => {
    setMuNoteOpen(false);
    const N = STUTI_NUDGE, PR = STUTI_PREFS;
    const turningOff = panchangaBellOn;
    PR.setRemind({ tithi: !turningOff });
    setBellTick(n => n + 1);
    if (turningOff) { setNote("Notifications are stopped for now — tap the bell again to resume them."); return; }
    const text = [vm.tithi.full, vm.dateStr].filter(Boolean).join(" · ") + ` · ${t("rahuKala")} ${vm.rahuStr}`;
    const fire = () => { try { new Notification("Stuti · " + t("todaysPanchanga"), { body: text }); } catch (e) {} };
    const on = "Pañcāṅga notifications are on — today's is on its way.";
    if (!N || !N.supported()) { setNote("Notifications aren't supported here — " + text); return; }
    if (N.permission() === "granted") { fire(); setNote(on); }
    else N.ask().then(p => { if (p === "granted") { fire(); setNote(on); } else setNote("Allow notifications in your browser to receive the pañcāṅga."); });
  };
  const rows = [...vm.coord, ...vm.sun.slice(0, 2)];
  const moreRows = [...vm.sun.slice(2), ...vm.yk, ...vm.caution.map(it => ({ ...it, caution: it.active }))];
  return (
    <div className="view home home-a scroll" style={deityStyle(deity)}>
      {(() => {
        const rv = (RTU_VIS || {})[vm.pa.ritu.iast];
        /* a transition month blends both seasons here too, as Calendar and Māsa do */
        const mName = masaShown ? masaShown(vm.pa) : vm.pa.masa;
        const mix = masaMixFor ? masaMixFor(mName && mName.iast) : null;
        const vars = mix ? { "--rtu": rv.hue, "--rtu-b": mix.hueB } : { "--rtu": rv.hue };
        return rv ? (
          <React.Fragment>
            <div className="cal-season cal-season-back" aria-hidden="true" style={vars}>
              <div className="cal-season-in cal-season-wash" data-mix={mix ? "1" : undefined} />
            </div>
            <div className="cal-season cal-season-front" aria-hidden="true" style={vars}>
              <div className="cal-season-in cal-season-fg"><SeasonAmbient kind={rv.kind} dense mix={mix && mix.kinds} heat={mix && mix.heat} sunHue={mix && mix.sunHue} sunBright={mix && mix.sunBright} /></div>
            </div>
          </React.Fragment>
        ) : null;
      })()}
      <SkyHeader lang={L} go={go} />

      <HomeSearchBar go={go} lang={L} />

      <HomePrepCard lang={L} />

      <section className="rhb-card">
        <div className="eyebrow rhb-eyebrow" style={{ color: "var(--accent-ink)" }}>
          <span>{t("todaysPanchanga")}</span>
          <button className={"eyebrow-bell" + (panchangaBellOn ? " on" : "")} aria-pressed={panchangaBellOn}
            title={panchangaBellOn ? "Stop pañcāṅga notifications" : "Notify me with the pañcāṅga"}
            aria-label={panchangaBellOn ? "Stop pañcāṅga notifications" : "Notify me with the pañcāṅga"} onClick={togglePanchangaNotif}>
            <Icon key={panchangaBellOn ? "on" : "off"} name="bell" size={14} />
          </button>
          {vm.muNow && (
            <button className={"rhb-muhurta-badge" + (vm.muNow.kind === "good" ? " good" : " avoid")}
              title={vm.muNow.label[L === "telugu" ? "tel" : L === "roman" ? "roman" : "deva"]} onClick={explainMu}>
              <Icon name={vm.muNow.kind === "good" ? "spark" : "warn"} size={14} />
            </button>
          )}
        </div>
        {note && <div className="rhb-tapnote" onClick={() => { setNote(null); setMuNoteOpen(false); }}>{note}</div>}
        <div className="rhb-date">{vm.dateStr}</div>
        <div className="rhb-hero">
          <MoonPhase phase={vm.pa.phase} size={62} />
          <div>
            <div className={"rhb-tithi" + (L === "roman" ? " roman" : "")} style={{ fontFamily: sFont(L), fontWeight: 400, fontSize: "2.125rem" }}>
              {vm.tithi.paksha && <span style={{ marginRight: "0.35em" }}>{vm.tithi.paksha} ·</span>}
              {vm.tithi.main}
            </div>
            <div className="rhb-tithi-sub">{vm.tithi.ends}</div>
          </div>
        </div>
        <div className="rhb-rows">
          {rows.map(it => {
            const tappable = it.active !== undefined;
            const Tag = tappable ? "button" : "div";
            return (
            <Tag className={"rhb-row" + (it.caution ? " caution" : "") + (tappable ? " rhb-row-btn" : "")} data-k={it.key} key={it.key} onClick={tappable ? () => explainRow(it) : undefined}>
              <span className="rhb-row-k">{t(it.key)}</span>
              <span className="rhb-row-v" style={it.script ? { fontFamily: sFont(L) } : undefined}>
                {it.vals
                  ? it.vals.map((v, i) => (typeof v === "object" && v !== null
                      ? <div key={i}>{v.main}{v.till && <small>{v.till}</small>}</div>
                      : <div key={i}>{v}</div>))
                  : <React.Fragment>{it.main}{it.sub && L === "roman" && <small>{it.sub}</small>}{it.till && <small>{it.till}</small>}</React.Fragment>}
              </span>
            </Tag>
            );
          })}
        </div>
        <button className="rhb-more-toggle" aria-expanded={moreOpen} onClick={() => setMoreOpen(o => !o)}>
          <span>{moreOpen ? t("rhbLess") : t("rhbMore")}</span>
          <Icon name="chev" size={15} style={{ transform: moreOpen ? "rotate(180deg)" : "none" }} />
        </button>
        {moreOpen && (
          <div className="rhb-rows">
            {moreRows.map(it => {
              const tappable = it.active !== undefined;
              const Tag = tappable ? "button" : "div";
              return (
              <Tag className={"rhb-row" + (it.caution ? " caution" : "") + (tappable ? " rhb-row-btn" : "")} data-k={it.key} key={it.key} onClick={tappable ? () => explainRow(it) : undefined}>
                <span className="rhb-row-k">{t(it.key)}</span>
                <span className="rhb-row-v" style={it.script ? { fontFamily: sFont(L) } : undefined}>
                  {it.vals
                    ? it.vals.map((v, i) => (typeof v === "object" && v !== null
                        ? <div key={i}>{v.main}{v.till && <small>{v.till}</small>}</div>
                        : <div key={i}>{v}</div>))
                    : <React.Fragment>{it.main}{it.sub && L === "roman" && <small>{it.sub}</small>}{it.till && <small>{it.till}</small>}</React.Fragment>}
                </span>
              </Tag>
              );
            })}
          </div>
        )}
        {/* the saṅkalpa is not a daily task — gotra and nāma are fixed for life
            and the date clauses are the very limbs listed above, so it closes
            this card rather than standing as an action of its own */}
        <button className="rhb-foot" onClick={() => setOpen(true)}>
          <span className="rhb-foot-body">
            <span className="rhb-foot-k">{t("flReady")}</span>
            <span className="rhb-foot-v">{sk.ready ? t("flSetForToday") : t("flNotYet")}</span>
          </span>
          <Icon name="chev" size={17} />
        </button>
      </section>

      <div style={{ height: 16 }} />
      <SandhyaCard lang={L} planOnly />
      <div style={{ height: 16 }} />
      <ContinueCard go={go} lang={L} />
      {/* the ask, once, at the foot of the day's screen — not a banner */}
      <div style={{ height: 16 }} />
      <DanaRow lang={L} />
      <div style={{ height: 24 }} />

      {overlayEl && ReactDOM.createPortal(
        <React.Fragment>
          <div className={"rhb-scrim" + (open ? " on" : "")} onClick={() => setOpen(false)} />
          <div className={"rhb-sheet" + (open ? " on" : "")} style={deityStyle(deity)}>
            <div className="rhb-grab" />
            <div className="rhb-sheet-head">
              <span className="rhb-sheet-title display">{t("flReady")}</span>
              <button className="rhb-sheet-x" onClick={() => setOpen(false)} aria-label={STUTI_L.a("aClose")}>×</button>
            </div>
            <div className="rhb-sheet-body"><SankalpaSheet vm={vm} sk={sk} L={L} go={go} /></div>
          </div>
        </React.Fragment>, overlayEl)}
    </div>
  );
}

/* ---- Recitation builder — which movements of a sahasranāma this reciter
   says. Only offered where hymnParts finds the four-movement shape; the
   choice is saved per hymn so a quick weekday Lalitā and a full Viṣṇu
   live side by side without either bleeding into the other. ---- */
function RecitationSheet({ hymn, lang, onClose }) {
  const L = STUTI_L;
  const ritualSet = STUTI_RITUAL ? STUTI_RITUAL(hymn) : null;
  const hasRitual = !!(ritualSet && ritualSet.size);
  const [cfg, setCfg] = React.useState(() => STUTI_RECITE.get(hymn.id));
  const toggle = (k) => setCfg((c) => {
    const keys = k === "viniyoga_dhyanam" ? ["viniyoga", "dhyanam"] : [k];
    const v = !c[keys[0]];
    const n = Object.assign({}, c); keys.forEach((kk) => { n[kk] = v; });
    STUTI_RECITE.set(hymn.id, n); return n;
  });
  const t3 = (roman, tel, deva) => ({ roman, tel, deva });
  const rows = [
    { k: "purva", label: t3("Pūrvapīṭhikā", "పూర్వపీఠిక", "पूर्वपीठिका"), sub: t3("the frame story", "ఉపోద్ఘాత కథ", "प्रारंभिक कथा") },
    { k: "viniyoga_dhyanam", label: t3("Viniyoga · Dhyānam", "వినియోగం · ధ్యానం", "विनियोग · ध्यानम्"), sub: t3("application formula & meditation verse", "వినియోగ మంత్రం, ధ్యాన శ్లోకం", "विनियोग मंत्र, ध्यान श्लोक") },
  ].concat(hasRitual ? [{ k: "nyasa", label: t3("Nyāsa · Pañcapūjā", "న్యాస · పంచపూజ", "न्यास · पञ्चपूजा"), sub: t3("ritual placement", "అంగన్యాసం", "अंगन्यास") }] : []);
  const rows2 = [
    { k: "phala", label: t3("Phalaśruti", "ఫలశ్రుతి", "फलश्रुति"), sub: t3("fruits of recitation", "పారాయణ ఫలము", "पाठ का फल") },
    { k: "ksama", label: t3("Kṣamāprārthanā · Samarpaṇam", "క్షమాప్రార్థన · సమర్పణం", "क्षमाप्रार्थना · समर्पणम्"), sub: t3("pardon and offering", "క్షమాపణ, సమర్పణ", "क्षमा और समर्पण") },
  ];
  const F = { fontFamily: L.font(lang) };
  const rrow = (r) => {
    const on = r.k === "viniyoga_dhyanam" ? !!cfg.viniyoga : !!cfg[r.k];
    return (
      <div className="rec-row" key={r.k}>
        <div><div className="rec-row-text" style={F}>{pick3(r.label, lang)}</div><div className="rec-row-sub">{pick3(r.sub, lang)}</div></div>
        <button className={"rec-switch" + (on ? " on" : "")} aria-pressed={on} onClick={() => toggle(r.k)}>
          <span className="rec-dot" />
        </button>
      </div>
    );
  };
  const portalHost = document.querySelector(".app-overlay") || document.querySelector(".stage") || document.body;
  return ReactDOM.createPortal(
    <div className="pd-wrap">
      <div className="pd-scrim" onClick={onClose} />
      <div className="pd-sheet rec-sheet" role="dialog" aria-label="Build this recitation">
        <div className="pd-grip" />
        <button className="pd-x" onClick={onClose} aria-label={L.a("aClose")}><Icon name="close" size={18} /></button>
        <div className="rm-head">
          <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{pick3(t3("Build this recitation", "ఈ పారాయణాన్ని రూపొందించండి", "यह पाठ तैयार करें"), lang)}</div>
          <div className="rm-head-title display" style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(hymn, lang)}</div>
        </div>
        <div className="pd-body">
          {rows.map(rrow)}
          <div className="rec-locked">
            <div><div className="rec-row-text" style={F}>{pick3(t3("Sahasranāma Stōtram", "సహస్రనామ స్తోత్రం", "सहस्रनाम स्तोत्रम्"), lang)}</div></div>
            <span className="rec-locked-tag">{pick3(t3("Always on", "ఎల్లప్పుడూ", "सदा शामिल"), lang)}</span>
          </div>
          {rows2.map(rrow)}
        </div>
      </div>
    </div>, portalHost);
}

/* ---- Daily recitation (favourites) card ---- */
const WEEKDAY_KEYS = ["wdSun", "wdMon", "wdTue", "wdWed", "wdThu", "wdFri", "wdSat"];
const WEEKDAY_SHORT_TE = ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"];
const WEEKDAY_SHORT_DEVA = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
function DailyCard({ go, lang = "deva", from = "daily" }) {
  const S = STUTI, L = STUTI_L;
  const favs = useFavs();
  const [, forceWeek] = React.useState(0);
  React.useEffect(() => STUTI_FAVS_WEEK.subscribe(() => forceWeek(n => n + 1)), []);
  const today = new Date().getDay();
  const [viewDay, setViewDay] = React.useState(today);
  const ids = favs.list();
  const weekIds = STUTI_FAVS_WEEK.list(viewDay);
  const items = ids.map(id => S.hymnById(id)).filter(Boolean);
  const weekItems = weekIds.map(id => S.hymnById(id)).filter(Boolean);
  const todayWeekItems = STUTI_FAVS_WEEK.list(today).map(id => S.hymnById(id)).filter(Boolean);
  const queue = items.concat(todayWeekItems);
  const [editHymn, setEditHymn] = React.useState(null);
  const [, bumpRecite] = React.useState(0);
  const dragId = React.useRef(null);
  const [dragOver, setDragOver] = React.useState(null);

  const reorderDrop = (targetId, isWeek) => {
    if (!dragId.current || dragId.current === targetId) { setDragOver(null); return; }
    const store = isWeek ? STUTI_FAVS_WEEK : favs;
    const cur = isWeek ? store.list(viewDay) : store.list();
    const from_ = cur.indexOf(dragId.current), to_ = cur.indexOf(targetId);
    if (from_ < 0 || to_ < 0) { setDragOver(null); return; }
    const next = cur.slice(); next.splice(from_, 1); next.splice(to_, 0, dragId.current);
    isWeek ? store.reorder(next, viewDay) : store.reorder(next);
    dragId.current = null; setDragOver(null);
  };

  const playFrom = (h, isWeek) => {
    let list;
    if (!isWeek) list = items.concat(todayWeekItems);
    else if (viewDay === today) list = items.concat(todayWeekItems);
    else list = weekItems;
    const idx = list.findIndex(x => x.id === h.id);
    nityaQueue.set(list.length > 1 ? { ids: list.map(x => x.id), idx: Math.max(0, idx), from } : null);
    go("reader", { deity: h.deity, hymn: h.id, from });
  };

  const row = (h, isWeek) => {
    const d = S.deityById[h.deity];
    const parts = hymnParts ? hymnParts(h) : null;
    const custom = parts && STUTI_RECITE.isCustom(h.id);
    return (
      <div key={(isWeek ? "w-" : "g-") + h.id}
        className={"daily-row" + (dragOver === h.id ? " drag-over" : "")}
        draggable onDragStart={() => { dragId.current = h.id; }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(h.id); }}
        onDrop={(e) => { e.preventDefault(); reorderDrop(h.id, isWeek); }}
        onClick={() => go("reader", { deity: h.deity, hymn: h.id, from })} style={deityStyle(d)}>
        <span className="daily-row-handle" aria-hidden="true">⠿</span>
        <div className="daily-row-body">
          <div className="daily-row-title display" style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(h, lang)}</div>
          {custom && <div className="daily-row-sub">{lang === "telugu" ? "అనుకూలించినది" : lang === "deva" ? "अनुकूलित" : "Customised"}</div>}
        </div>
        {parts && (
          <button className="icon-btn" aria-label="Build this recitation"
            onClick={(e) => { e.stopPropagation(); setEditHymn(h); }}>
            <Icon name="gear" size={18} />
          </button>
        )}
        <button className="icon-btn daily-row-play" aria-label={L.t("begin", lang)}
          onClick={(e) => { e.stopPropagation(); playFrom(h, isWeek); }}>
          <Icon name="play" size={16} />
        </button>
        <FavButton id={h.id} weekday={isWeek ? viewDay : undefined} size={20} />
      </div>
    );
  };

  return (
    <section className="daily">
      <div className="daily-head">
        <div>
          <div className="daily-title display" style={{ fontFamily: L.font(lang) }}>{L.t("dailyRecitation", lang)}</div>
        </div>
        {queue.length > 0 && (
          <button className="daily-begin" onClick={() => { const h = queue[0]; nityaQueue.set(queue.length > 1 ? { ids: queue.map(x => x.id), idx: 0, from } : null); go("reader", { deity: h.deity, hymn: h.id, from }); }}>
            <Icon name="play" size={14} /> {L.t("begin", lang)}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <React.Fragment>
          <div className="daily-empty-title display" style={{ fontFamily: L.font(lang) }}>{L.t("buildDaily", lang)}</div>
          <p className="daily-empty-line"><span className="inline-flower"><Icon name="flower" size={16} /></span> {L.t("offerFlowerLine", lang)}</p>
        </React.Fragment>
      ) : null}

      <div className="daily-list">
        <button className="daily-add-row" onClick={() => go("search", { from: "daily" })}>
          <Icon name="search" size={18} />
          <span>{L.t("findHymn", lang)} — {L.t("tapFlowerAdd", lang)}</span>
        </button>
        {items.map(h => row(h, false))}
      </div>

      <div className="week-strip">
        {WEEKDAY_KEYS.map((k, i) => (
          <button key={i} className={"week-day" + (i === viewDay ? " on" : "") + (i === today ? " is-today" : "")}
            onClick={() => setViewDay(i)}>{lang === "telugu" ? WEEKDAY_SHORT_TE[i] : lang === "deva" ? WEEKDAY_SHORT_DEVA[i] : L.t(k, lang).slice(0, 2)}</button>
        ))}
      </div>
      <div className="daily-list">
        <button className="daily-add-row daily-add-week" onClick={() => go("search", { from: "daily", weekday: viewDay })}>
          <Icon name="spark" size={18} />
          <span>{L.t("addForWeekday", lang).replace("{d}", L.t(WEEKDAY_KEYS[viewDay], lang))}</span>
        </button>
        {weekItems.map(h => row(h, true))}
      </div>

      {editHymn && (
        <RecitationSheet hymn={editHymn} lang={lang}
          onClose={() => { setEditHymn(null); bumpRecite((n) => n + 1); }} />
      )}
    </section>
  );
}
function DailyView({ go, lang = "deva" }) {
  const L = STUTI_L;
  return (
    <div className="view browse scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go("home")} aria-label={STUTI_L.a("aHome")}><Icon name="back" /></button>
        <div className="topbar-title display">{L.t("dailyRecitation", lang)}</div>
        <button className="icon-btn" onClick={() => go("search", { from: "daily" })} aria-label={L.t("search", lang)}><Icon name="search" /></button>
      </div>
      <div className="daily-pad">
        <DailyCard go={go} lang={lang} />
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

export { HomeA, todayInfo, DailyCard, DailyView, ContinueCard, HomeSearchBar };

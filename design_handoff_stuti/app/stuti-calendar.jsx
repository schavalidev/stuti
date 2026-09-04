/* ============================================================
   STUTI — Calendar (month view of the pañcāṅga)
   Browse any day of the month; tap a day for its tithi, timings
   and observances. Built on window.AKSHARA_PANCHANGA, location-aware.
   ============================================================ */
const { useState: useCS, useMemo: useCM, useRef: useCR, useEffect: useCE } = React;

/* the Indic columns name the vāra rather than abbreviating it to one akshara —
   a lone శ or श does not tell śukra from śani */
const CAL_WD = {
  roman:  ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  deva:   ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  telugu: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
};

function calFont(s) {
  return s === "telugu" ? "var(--font-telugu)" : s === "roman" ? "var(--font-display)" : "var(--font-deva)";
}

function CalendarView({ go, lang = "deva" }) {
  const P = window.AKSHARA_PANCHANGA, L = window.STUTI_L, TR = window.STUTI_TRANSLIT, V = window.STUTI_VRATA;
  const { loc } = window.useLoc();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [cursor, setCursor] = useCS(() => {
    try { const s = JSON.parse(localStorage.getItem("stuti-cal-cursor")); if (s && Number.isInteger(s.y) && Number.isInteger(s.m)) return s; } catch (e) {}
    return { y: today.getFullYear(), m: today.getMonth() };
  });
  const [sel, setSel] = useCS(() => {
    try { const s = localStorage.getItem("stuti-cal-sel"); if (s) { const d = new Date(s); if (!isNaN(d)) return d; } } catch (e) {}
    return new Date(today);
  });
  useCE(() => { try { localStorage.setItem("stuti-cal-cursor", JSON.stringify(cursor)); } catch (e) {} }, [cursor]);
  useCE(() => { try { localStorage.setItem("stuti-cal-sel", sel.toISOString()); } catch (e) {} }, [sel]);
  const [pickerOpen, setPickerOpen] = useCS(false);
  const [pickYear, setPickYear] = useCS(() => today.getFullYear());
  const [yearOpen, setYearOpen] = useCS(false);
  const yearListRef = useCR(null);
  useCE(() => {
    if (!yearOpen || !yearListRef.current) return;
    const el = yearListRef.current.querySelector(".cal-yearpick-opt.on");
    if (el) yearListRef.current.scrollTop = el.offsetTop - yearListRef.current.clientHeight / 2 + el.offsetHeight / 2;
  }, [yearOpen]);
  const dateLocale = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined;
  const pick = (o) => lang === "telugu" ? { main: o.tel, sub: o.iast } : lang === "roman" ? { main: o.iast, sub: null } : { main: o.deva, sub: o.iast };
  const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const first = new Date(cursor.y, cursor.m, 1);
  const startDow = first.getDay();
  const nDays = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const monthTitle = first.toLocaleDateString(dateLocale, { month: "long", year: "numeric" });
  const step = (n) => setCursor(c => { const d = new Date(c.y, c.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const jumpToday = () => { setCursor({ y: today.getFullYear(), m: today.getMonth() }); setSel(new Date(today)); };

  /* Named festivals & vratas — the almanac's tithi-derived observances (ekādaśī,
     pūrṇimā…) say what kind of day it is; this says what it's FOR. Each entry
     in STUTI_VRATA knows how to find its own date in a given year, so the
     month's occurrences are collected once and read off by day-key. */
  const monthFestMap = useCM(() => {
    const map = {};
    if (!V) return map;
    for (const v of V.vratas) {
      if (v.optional) continue;
      let d;
      try { d = v.everyMonth ? v.find(cursor.y, cursor.m) : v.find(cursor.y); } catch (e) { d = null; }
      if (!d) continue;
      const key = V.dayKey(d);
      (map[key] = map[key] || []).push(v);
    }
    return map;
  }, [cursor.y, cursor.m]);
  const nameOf = (o) => lang === "telugu" ? o.tel : lang === "roman" ? o.roman : o.deva;

  /* Search, scoped to this page: parva dinams by name, and days by what the
     pañcāṅga calls them — tithi, pakṣa, māsa, vāra, or the civil date. A hit
     moves the calendar to that day; it never leaves the page. */
  const [calSearchOpen, setCalSearchOpen] = useCS(false);
  const [calQ, setCalQ] = useCS("");
  const calFold = (s) => (TR && TR.fold ? TR.fold(String(s || "")) : String(s || "").toLowerCase());
  const calQf = calFold(calQ).trim();
  const calLive = calSearchOpen && calQf.length >= 2;
  const dayScan = useCR({ key: null, rows: null });
  const parvaHits = useCM(() => {
    if (!calLive || !V) return [];
    return V.vratas.filter((v) => calFold([v.name.roman, v.name.deva, v.name.tel].join(" ")).indexOf(calQf) !== -1)
      .map((v) => { const d = V.nextDate(v); return d ? { v, date: d, away: V.daysAway(d) } : null; })
      .filter(Boolean).sort((a, b) => a.date - b.date);
  }, [calQf, calLive]);
  const dayHits = useCM(() => {
    if (!calLive) return [];
    const key = JSON.stringify(loc) + "|" + lang;
    if (dayScan.current.key !== key) {
      const rows = [];
      const enFmt = { weekday: "long", day: "numeric", month: "long" };
      for (let i = 0; i < 400; i++) {
        const date = new Date(today); date.setDate(today.getDate() + i);
        let p; try { p = P.forDay(date, loc); } catch (e) { continue; }
        const obs = p.observances.map((o) => [o.name, o.deva].join(" ")).join(" ");
        const masa = p.masa ? [p.masa.iast, p.masa.deva, p.masa.tel].join(" ") : "";
        const hay = calFold([p.tithiName, p.tithiDeva, p.tithiTel, p.paksha, p.pakshaDeva, p.pakshaTel, obs, masa,
          date.toLocaleDateString("en-IN", enFmt), date.toLocaleDateString(dateLocale, enFmt), date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })].join(" "));
        rows.push({ date, p, hay, away: i });
      }
      dayScan.current = { key, rows };
    }
    return dayScan.current.rows.filter((r) => r.hay.indexOf(calQf) !== -1).slice(0, 40);
  }, [calQf, calLive, loc, lang]);
  const jumpTo = (d) => { setCursor({ y: d.getFullYear(), m: d.getMonth() }); setSel(new Date(d)); setCalQ(""); setCalSearchOpen(false); };
  const awayStr = (away) => away === 0 ? L.t("vrataToday", lang) : away === 1 ? L.t("vrataTomorrow", lang) : L.t("vrataInDays", lang).replace("{n}", away);

  const days = useCM(() => {
    const arr = [];
    for (let d = 1; d <= nDays; d++) {
      const date = new Date(cursor.y, cursor.m, d);
      const pa = P.forDay(date, loc);
      const fests = (V && monthFestMap[V.dayKey(date)]) || [];
      arr.push({ d, date, phase: pa.phase, isFull: pa.tithiIndex === 14, isNew: pa.tithiIndex === 29, vrata: pa.observances.some(o => o.kind === "vrata"), fest: fests.length > 0 });
    }
    return arr;
  }, [cursor.y, cursor.m, loc, monthFestMap]);
  const selFests = (V && monthFestMap[V.dayKey(sel)]) || [];

  // selected-day detail
  const pa = P.forDay(sel, loc);
  const samv = window.samvatsaraFor(sel);
  const samvP = pick({ iast: samv[0], deva: samv[1], tel: TR.convert(samv[1], "telugu") });
  const tithiP = pick({ iast: pa.tithiName, deva: pa.tithiDeva, tel: pa.tithiTel });
  const pakshaP = pick({ iast: pa.paksha, deva: pa.pakshaDeva, tel: pa.pakshaTel });
  const vara = window.SK_CONST.VARA_GRAHA[pa.varaIdx];
  /* a limb without its ending is half the answer — a printed pañcāṅga
     gives an hour for every one of the five */
  const till = (min) => {
    if (min == null) return "";
    /* a limb that runs past midnight ends tomorrow, and the clock alone
       would not say so */
    const mark = min >= 1440 ? " (" + L.t("tomorrowShort", lang) + ")" : "";
    return (lang === "roman"
      ? " " + L.t("untilTime", lang) + " " + P.fmtTime(min)
      : " " + P.fmtTime(min) + " " + L.t("untilTime", lang)) + mark;
  };
  /* and the hour it took hold, when that happened today. Most limbs begin
     before midnight and only the ending is worth printing; the ones that
     start during the day get both, as a printed pañcāṅga gives them. */
  const from = (min) => {
    if (min == null || min <= 0) return "";
    return lang === "roman"
      ? " " + L.t("fromTime", lang) + " " + P.fmtTime(min)
      : " " + P.fmtTime(min) + " " + L.t("fromTime", lang);
  };
  const span = (start, end) => from(start) + till(end);
  /* yoga and karaṇa arrive as IAST; the Devānāgarī source is what the other
     scripts derive from — the same path the home card takes */
  const YD = (window.SK_CONST && window.SK_CONST.YOGA_DEVA) || window.YOGA_DEVA || {};
  const KD = (window.SK_CONST && window.SK_CONST.KARANA_DEVA) || window.KARANA_DEVA || {};
  const localName = (iast, deva) =>
    lang === "telugu" ? TR.convert(deva || iast, "telugu")
    : lang === "deva" ? (deva || iast)
    : iast;

  /* Karaṇa is half a tithi, so it turns about twice a day — printing only
     the one current at sunrise leaves the calendar advertising a window that
     closed before breakfast, and disagreeing with the home card. Both of the
     day's karaṇas, as a printed pañcāṅga gives them. */
  const karanas = (() => {
    const E = window.STUTI_EPHEM;
    if (!E || pa.jdRef == null || pa.sunrise == null) return [];
    const midnightJd = pa.jdRef - pa.sunrise / 1440;
    const out = [];
    let jd = pa.jdRef;
    for (let i = 0; i < 3; i++) {
      const end = E.karanaEnd(jd);
      if (end == null) break;
      const nm = P.forDay(E.toDate(jd), loc, { instant: true }).karana;
      out.push({ name: localName(nm, KD[nm]), end: (end - midnightJd) * 1440 });
      if ((end - midnightJd) * 1440 >= 1440) break;
      jd = end + 1 / 2880;
    }
    return out;
  })();

  /* Eleven kālas drawn as bands on a timeline meant a tap to learn any one
     of them, and a careful tap for the thin ones. This detail is already a
     list read straight down, so they join it — ordered the way a printed
     pañcāṅga orders them: the two auspicious first, then the ones to stand
     down for. Rāhu kāla moves in with its siblings rather than sitting apart. */
  const MU = window.STUTI_MUHURTA;
  const wins = MU && pa.sunrise != null ? MU.windows(sel, loc, pa) : [];
  const nowMin = (() => {
    if (!sameDay(sel, today)) return null;
    const n = new Date(), tz = P.effTz(loc, sel);
    return (((n.getUTCHours() * 60 + n.getUTCMinutes() + tz * 60) % 1440) + 1440) % 1440;
  })();
  /* Brahma muhūrta begins before midnight-relative zero on a late sunrise,
     and varjyam can spill past 1440 — wrap rather than print a negative hour */
  const clk = (m) => P.fmtTime((((m % 1440) + 1440) % 1440));
  const winName = (w) => lang === "telugu" ? w.label.tel : lang === "roman" ? w.label.roman : w.label.deva;
  /* durmuhūrta comes twice most days and varjyam sometimes does; one row with
     two lines, not two rows wearing the same name */
  const winRows = ["brahma", "abhijit", "rahu", "yama", "gulika", "durmuhurta", "varjyam"]
    .map((k) => {
      const g = wins.filter((w) => w.id.replace(/\d+$/, "") === k);
      if (!g.length) return null;
      return { k: "kala-" + k, label: winName(g[0]), tone: g[0].kind,
               vals: g.map((w) => clk(w.start) + " – " + clk(w.end)),
               now: nowMin != null && g.some((w) => nowMin >= w.start && nowMin < w.end) };
    }).filter(Boolean);
  /* Abhijit is not kept on Wednesday. Dropping the row silently reads as a bug
     in the almanac; the row stays and says why it is empty. */
  if (MU && wins.length && !wins.some((w) => w.id === "abhijit")) {
    const at = winRows.findIndex((r) => r.k === "kala-rahu");
    winRows.splice(at === -1 ? winRows.length : at, 0, {
      k: "kala-abhijit", label: winName({ label: MU.LABEL.abhijit }), tone: "good",
      vals: ["— " + L.t("abhijitNone", lang)], muted: true });
  }
  /* Sandhyā belongs in the same list for the same reason: a practitioner
     planning a day wants the hour, not a screen to open. The uttama band is
     the answer; the grace period rides under it. */
  const SY = window.STUTI_SANDHYA;
  const syList = SY ? SY.kalas(sel, loc, pa) : [];
  const syRows = syList.length ? [{ k: "sy-sec", sec: "sandhya" }].concat(syList.map((k) => ({
    k: "sy-" + k.id, label: SY.name(k.label, lang), tone: "good",
    vals: [clk(k.best.start) + " – " + clk(k.best.end),
           L.t("sandhyaGrace", lang).replace("{t}", clk(k.end))],
    dim: 1,
    now: nowMin != null && nowMin >= k.start && nowMin < k.end,
  }))) : [];

  /* Two captions rather than one. Colour alone cannot carry "begin here" against
     "stand down" — the two inks sit in the same warm family, and one of them
     follows the deity hue — so the split is structural: the heading says it. */
  ["good", "avoid"].forEach((tone) => {
    const i = winRows.findIndex((r) => r.tone === tone);
    if (i !== -1) winRows.splice(i, 0, { k: "kala-sec-" + tone, sec: tone === "good" ? "kalaGood" : "kalaAvoid" });
  });

  /* The moon rises about fifty minutes later each day, so roughly once a month
     a date has no moonrise at all — the event slid across midnight. Browsing
     the calendar walks into that date every cycle, and a bare dash there reads
     as a hole in the almanac, so it is said outright with the next one given. */
  const moonRow = (k, min, next) => (min != null || next == null
    ? { k, v: min != null ? P.fmtTime(min) : "—" }
    : { k, dim: 1, vals: ["—", L.t("moonNoRise", lang)
        .replace("{t}", P.fmtTime(next) + " (" + L.t("tomorrowShort", lang) + ")")] });

  const rows = [
    /* The order follows the home card: the day's coordinates from the widest
       span inward — year, month, weekday, nakṣatra — and only then yoga and
       karaṇa, which are the technical half a saṅkalpa rarely names.
       the śaka year rides with the saṁvatsara name — the two together are
       what a saṅkalpa actually says, and the number is the checkable half */
    { k: "limbSamvatsara", v: samvP.main + (samv[2] ? " · " + L.t("shakaShort", lang) + " " + samv[2] : ""), script: true },
    { k: "limbAyana", v: pick(pa.ayana).main, script: true },
    { k: "limbRtu", v: pick(pa.ritu).main + (lang === "roman" ? " · " + pa.ritu.en : ""), script: true },
    /* an intercalary month, and the rarer swallowed one, are the two facts
       about a māsa that change what a household does with it */
    { k: "limbMasa", v: pick(window.masaShown(pa)).main
        + (pa.masaAdhika ? " (" + L.t("adhikaMark", lang) + ")" : "")
        + (pa.masaKshaya && pa.masaKshayaName ? " · " + pick(pa.masaKshayaName).main + " (" + L.t("kshayaMark", lang) + ")" : ""), script: true },
    { k: "limbVara", v: pick({ iast: vara.iast, deva: vara.deva, tel: vara.tel }).main, script: true },
    { k: "limbNakshatra", v: pick(pa.nak).main + span(pa.nakStartMin, pa.nakEndMin), script: true },
    { k: "limbYoga", v: localName(pa.yoga, YD[pa.yoga]) + span(pa.yogaStartMin, pa.yogaEndMin), script: true },
    /* one line per karaṇa — the row grid right-aligns, and a single long
       string wraps ragged. Durmuhūrta already stacks its windows this way. */
    { k: "limbKarana", vals: karanas.length
        ? karanas.map((x) => x.name + till(x.end))
        : [localName(pa.karana, KD[pa.karana])], script: true },
    { k: "sunrise", v: P.fmtTime(pa.sunrise) },
    { k: "sunset", v: P.fmtTime(pa.sunset) },
    moonRow("moonrise", pa.moonrise, pa.moonriseNext),
    moonRow("moonset", pa.moonset, pa.moonsetNext),
  ].concat(winRows).concat(syRows);
  /* the tithi's closing hour rides with the tithi itself, as on the home card */
  const untilW = L.t("untilTime", lang);
  const tEnd = P.fmtTime(pa.tithiEndMin) + (pa.tithiEndsTomorrow ? " (" + L.t("tomorrowShort", lang) + ")" : "");
  const endsStr = (from(pa.tithiStartMin).trim() + " ").replace(/^ $/, "")
    + (lang === "roman" ? untilW + " " + tEnd : tEnd + " " + untilW);
  const tithiLine = pa.soloTithi ? tithiP.main
    : lang === "roman" ? pakshaP.main + " " + tithiP.main
    : pakshaP.main + " · " + tithiP.main;
  const selDateStr = sel.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="view cal-view scroll">
      {(() => {
        /* the backdrop belongs to the month on screen, not to the day last
           tapped — paging to Māgha should turn the view wintry at once */
        const monthPa = P.forDay(new Date(cursor.y, cursor.m, 15), loc);
        const rv = (window.RTU_VIS || {})[monthPa.ritu.iast];
        /* a transition month carries a mild mix of both seasons, as the Māsa lens does */
        const mName = window.masaShown ? window.masaShown(monthPa) : monthPa.masa;
        const mix = window.masaMixFor ? window.masaMixFor(mName && mName.iast) : null;
        const vars = mix ? { "--rtu": rv.hue, "--rtu-b": mix.hueB } : { "--rtu": rv.hue };
        return rv ? (
          <React.Fragment>
            <div className="cal-season cal-season-back" aria-hidden="true" style={vars}>
              <div className="cal-season-in cal-season-wash" data-mix={mix ? "1" : undefined} />
            </div>
            <div className="cal-season cal-season-front" aria-hidden="true" style={vars}>
              <div className="cal-season-in cal-season-fg"><window.SeasonAmbient kind={rv.kind} dense mix={mix && mix.kinds} heat={mix && mix.heat} sunHue={mix && mix.sunHue} sunBright={mix && mix.sunBright} /></div>
            </div>
          </React.Fragment>
        ) : null;
      })()}
      <div className="topbar">
        <div className="topbar-title display">{L.t("calendar", lang)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", marginRight: 26 }}>
          <button className={"icon-btn" + (calSearchOpen ? " on" : "")} onClick={() => { setCalSearchOpen((o) => !o); setCalQ(""); }} aria-label={window.STUTI_L.a("aSearch")} aria-expanded={calSearchOpen}><Icon name={calSearchOpen ? "close" : "search"} size={19} /></button>
          <window.LocationControl />
        </div>
      </div>

      {calSearchOpen && (
        <div className="cal-search">
          <div className="search-field">
            <Icon name="search" size={18} />
            <input className="search-input" type="search" value={calQ} onChange={(e) => setCalQ(e.target.value)} autoFocus
              placeholder={L.t("calSearchPh", lang)} aria-label={L.t("calSearchPh", lang)} autoComplete="off" spellCheck="false" enterKeyHint="search" style={{ fontFamily: calFont(lang) }} />
            <window.VoiceButton lang={lang} onInterim={setCalQ} onResult={setCalQ} />
            {calQ && <button className="search-clear" onClick={() => setCalQ("")} aria-label={window.STUTI_L.a("aClearSearch")}>×</button>}
          </div>
        </div>
      )}

      {calSearchOpen && !calLive ? (
        <div className="cal-search-hint">{L.t("calSearchScope", lang)}</div>
      ) : calLive ? (
        <div style={{ padding: "0 18px" }}>
          {!parvaHits.length && !dayHits.length ? (
            <div className="form-empty">
              <div className="form-empty-mark"><Icon name="lotus" size={28} /></div>
              <div className="form-empty-text">{L.t("noCalResults", lang)}</div>
            </div>
          ) : (
            <React.Fragment>
              {parvaHits.length > 0 && (
                <div className="sr-sec">
                  <div className="eyebrow sr-cap">{L.t("srParva", lang)} <i>{parvaHits.length}</i></div>
                  <div className="cal-fest-card" style={{ margin: 0 }}>
                    {parvaHits.map(({ v, date, away }) => (
                      <button key={v.id} className="cal-fest-item" onClick={() => jumpTo(date)}>
                        <span className="cal-fest-dot" aria-hidden="true" />
                        <span className="cal-fest-body">
                          <span className="cal-fest-name" style={{ fontFamily: calFont(lang) }}>{nameOf(v.name)}</span>
                          <span className="cal-fest-rule">{date.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {awayStr(away)}</span>
                        </span>
                        <Icon name="next" size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {dayHits.length > 0 && (
                <div className="sr-sec">
                  <div className="eyebrow sr-cap">{L.t("srDays", lang)} <i>{dayHits.length}</i></div>
                  <div className="cal-fest-card" style={{ margin: 0 }}>
                    {dayHits.map(({ date, p, away }) => {
                      const tp = pick({ iast: p.tithiName, deva: p.tithiDeva, tel: p.tithiTel }), pp = pick({ iast: p.paksha, deva: p.pakshaDeva, tel: p.pakshaTel });
                      const obs = p.observances.map((o) => (lang === "deva" ? (o.deva || o.name) : o.name)).join(" · ");
                      return (
                        <button key={date.toDateString()} className="cal-sr-day" onClick={() => jumpTo(date)}>
                          <MoonPhase phase={p.phase} size={26} />
                          <span className="cal-sr-body">
                            <span className="cal-sr-date">{date.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long" })}</span>
                            <span className="cal-sr-tithi" style={{ fontFamily: calFont(lang) }}>{pp.main} {tp.main}{obs ? " · " + obs : ""}</span>
                          </span>
                          <span className="cal-sr-away">{awayStr(away)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      ) : (
      <React.Fragment>
      <div className="cal-nav">
        <button className="icon-btn" onClick={() => step(-1)} aria-label={window.STUTI_L.a("aPrevMonth")}><Icon name="prev" size={20} /></button>
        <button className="cal-nav-title display" onClick={() => { setPickYear(cursor.y); setPickerOpen(o => !o); }} aria-expanded={pickerOpen}>
          {monthTitle} <Icon name="chev" size={16} />
        </button>
        <button className="icon-btn" onClick={() => step(1)} aria-label={window.STUTI_L.a("aNextMonth")}><Icon name="next" size={20} /></button>
      </div>

      {pickerOpen && (
        <div className="cal-picker">
          <button className="icon-btn cal-picker-close" onClick={() => setPickerOpen(false)} aria-label={window.STUTI_L.a("aClose")}><Icon name="close" size={16} /></button>
          <div className="cal-picker-year">
            <button className="icon-btn" onClick={() => setPickYear(y => y - 1)} aria-label={window.STUTI_L.a("aPrevYear")}><Icon name="prev" size={18} /></button>
            <div className="cal-yearpick">
              <button className="cal-picker-y-btn" onClick={() => setYearOpen(o => !o)} aria-expanded={yearOpen}>
                {new Date(pickYear, 0, 1).toLocaleDateString(dateLocale, { year: "numeric" })} <Icon name="chev" size={14} />
              </button>
              {yearOpen && (
                <React.Fragment>
                  <div className="cal-yearpick-scrim" onClick={() => setYearOpen(false)} />
                  <div className="cal-yearpick-list" ref={yearListRef}>
                    {Array.from({ length: 111 }).map((_, i) => {
                      const y = today.getFullYear() - 75 + i;
                      return (
                        <button key={y} className={"cal-yearpick-opt" + (y === pickYear ? " on" : "")}
                          onClick={() => { setPickYear(y); setYearOpen(false); }}>
                          {new Date(y, 0, 1).toLocaleDateString(dateLocale, { year: "numeric" })}
                        </button>
                      );
                    })}
                  </div>
                </React.Fragment>
              )}
            </div>
            <button className="icon-btn" onClick={() => setPickYear(y => y + 1)} aria-label={window.STUTI_L.a("aNextYear")}><Icon name="next" size={18} /></button>
          </div>
          <div className="cal-month-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <button key={i} className={"cal-month" + (pickYear === cursor.y && i === cursor.m ? " on" : "")}
                onClick={() => { setCursor({ y: pickYear, m: i }); setPickerOpen(false); }}>
                {new Date(pickYear, i, 1).toLocaleDateString(dateLocale, { month: "long" })}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="cal-grid cal-wd-row">
        {CAL_WD[lang].map((w, i) => <div key={i} className="cal-wd" style={{ fontFamily: calFont(lang) }}>{w}</div>)}
      </div>
      <div className="cal-grid">
        {Array.from({ length: startDow }).map((_, i) => <div key={"b" + i} className="cal-cell cal-cell-empty" />)}
        {days.map(({ d, date, phase, isFull, isNew, vrata, fest }) => (
          <button key={d} className={"cal-cell" + (sameDay(date, sel) ? " sel" : "") + (sameDay(date, today) ? " today" : "")}
            onClick={() => setSel(new Date(date))}>
            <span className="cal-daynum">{d}</span>
            <span className="cal-marks">
              {(isFull || isNew) && <MoonPhase phase={phase} size={13} />}
              {fest && <span className="cal-dot cal-dot-fest" />}
              {!fest && vrata && <span className="cal-dot" />}
            </span>
          </button>
        ))}
      </div>

      {selFests.length > 0 && (
        <div className="cal-fest-card">
          {selFests.map(v => (
            <button key={v.id} className="cal-fest-item" onClick={() => go("browse", { libSub: { kind: "vrata", key: v.id, returnTo: "calendar" } })}>
              <span className="cal-fest-dot" aria-hidden="true" />
              <span className="cal-fest-body">
                <span className="cal-fest-name" style={{ fontFamily: calFont(lang) }}>{nameOf(v.name)}</span>
              </span>
              <Icon name="next" size={15} />
            </button>
          ))}
        </div>
      )}

      <section className="cal-detail">
        <div className="cal-detail-head">
          <MoonPhase phase={pa.phase} size={44} />
          <div className="cal-detail-headbody">
            <div className="cal-detail-date">{selDateStr}</div>
            <div className="cal-detail-tithi" style={{ fontFamily: calFont(lang) }}>{tithiLine}</div>
            <div className="cal-detail-ends">{endsStr}</div>
          </div>
          {!sameDay(sel, today) && (
            <button className="cal-today-btn" onClick={jumpToday}>
              <Icon name="prev" size={13} />{L.t("backToToday", lang)}
            </button>
          )}
        </div>

        <div className="cal-detail-grid">
          {rows.map(r => r.sec ? (
            <div className="pdrow pdrow-sec" key={r.k}><span className="eyebrow">{L.t(r.sec, lang)}</span></div>
          ) : (
            <div className={"pdrow" + (r.tone ? " pdrow-" + r.tone : "") + (r.now ? " now" : "")} key={r.k}>
              <span className="pdrow-k" style={r.label ? { fontFamily: calFont(lang) } : undefined}>
                {r.label || L.t(r.k, lang)}
                {r.now && <span className="pdrow-now">{L.t("nowTag", lang)}</span>}
              </span>
              <span className={"pdrow-v" + (r.muted ? " muted" : "")} style={r.script ? { fontFamily: calFont(lang) } : undefined}>
                {r.vals ? r.vals.map((v, i) => <div key={i} className={r.dim && i ? "sub" : undefined}>{v}</div>) : r.v}
              </span>
            </div>
          ))}
        </div>

        {pa.observances.length > 0 ? (
          <div className="cal-obs">
            {pa.observances.map(o => (
              <div className="pd-obs" key={o.id}><b>{lang === "deva" ? (o.deva || o.name) : o.name}</b> — {o.note}</div>
            ))}
          </div>
        ) : (
          <div className="cal-detail-note">{L.t("ordinaryDay", lang)}</div>
        )}
        <div className="cal-detail-note">{L.t("panchangaNote", lang)}</div>
      </section>
      </React.Fragment>
      )}
      <div style={{ height: 32 }} />
    </div>
  );
}

Object.assign(window, { CalendarView });

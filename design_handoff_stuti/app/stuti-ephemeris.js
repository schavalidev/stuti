/* ============================================================
   STUTI — ephemeris
   The five limbs of the pañcāṅga all fall out of two numbers: the
   apparent sidereal longitude of the sun and of the moon.

       tithi     = ⌊(λ☾ − λ☉) / 12°⌋
       nakṣatra  = ⌊λ☾ / 13°20′⌋
       yoga      = ⌊(λ☉ + λ☾) / 13°20′⌋
       karaṇa    = half a tithi, on the eleven-fold cycle

   So this file computes those two longitudes and nothing else — in
   either of the two schemes India actually keeps.
   Drik: Meeus ch. 25 for the sun, the abridged ELP-2000/82 of ch. 47
   for the moon — sixty periodic terms, good to about ten arcseconds,
   which puts a tithi boundary inside a minute. Sidereal via Lahiri.
   Vākya: the Sūrya Siddhānta's own arithmetic, further down.

   No network, no dependency: this must work in a pūjā room with the
   phone in flight mode.
   ============================================================ */
window.STUTI_EPHEM = (function () {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const sin = (d) => Math.sin(d * D2R), cos = (d) => Math.cos(d * D2R);
  const norm360 = (x) => ((x % 360) + 360) % 360;

  /* ---------- time ---------- */
  const J2000 = 2451545.0;
  /* a JS Date is UTC underneath, whatever the local zone */
  const toJD = (date) => date.getTime() / 86400000 + 2440587.5;
  const toDate = (jd) => new Date((jd - 2440587.5) * 86400000);

  /* ΔT: TT − UT, seconds. Espenak & Meeus for 2005–2050, which is the
     span anyone using this app will care about. Worth having — 70s of it
     moves the moon a hundredth of a degree. */
  function deltaT(jd) {
    const y = 2000 + (jd - J2000) / 365.25;
    if (y >= 2005 && y <= 2050) { const t = y - 2000; return 62.92 + 0.32217 * t + 0.005589 * t * t; }
    if (y > 2050 && y <= 2150) { const u = (y - 1820) / 100; return -20 + 32 * u * u - 0.5628 * (2150 - y); }
    const u = (y - 1820) / 100; return -20 + 32 * u * u;
  }
  /* Julian centuries of TT from J2000 */
  const centuries = (jd) => (jd + deltaT(jd) / 86400 - J2000) / 36525;

  /* ---------- the sun (Meeus ch. 25) ---------- */
  function sunApparent(jd) {
    const T = centuries(jd);
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M)
            + (0.019993 - 0.000101 * T) * sin(2 * M)
            + 0.000289 * sin(3 * M);
    const O = 125.04 - 1934.136 * T;
    return norm360(L0 + C - 0.00569 - 0.00478 * sin(O));   // apparent
  }

  /* ---------- the moon (Meeus ch. 47, table 47.A) ----------
     Each row is D, M, M', F and the coefficient of the longitude term
     in millionths of a degree. */
  const ML = [
    [0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],
    [0,1,0,0,-185116],[0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],
    [2,0,1,0,53322],[2,-1,0,0,45758],[0,1,-1,0,-40923],[1,0,0,0,-34720],
    [0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],[0,0,1,-2,10980],
    [4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],
    [2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],
    [2,0,2,0,3994],[4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],
    [2,0,-1,2,-2602],[2,-1,-2,0,2390],[1,0,1,0,-2348],[2,-2,0,0,2236],
    [0,1,2,0,-2120],[0,2,0,0,-2069],[2,-2,-1,0,2048],[2,0,1,-2,-1773],
    [2,0,0,2,-1595],[4,-1,-1,0,1215],[0,0,2,2,-1110],[3,0,-1,0,-892],
    [2,1,1,0,-810],[4,-1,-2,0,759],[0,2,-1,0,-713],[2,2,-1,0,-700],
    [2,1,-2,0,691],[2,-1,0,-2,596],[4,0,1,0,549],[0,0,4,0,537],
    [4,-1,0,0,520],[1,0,-2,0,-487],[2,1,0,-2,-399],[0,0,2,-2,-381],
    [1,1,1,0,351],[3,0,-2,0,-340],[4,0,-3,0,330],[2,-1,2,0,327],
    [0,2,1,0,-323],[1,1,-1,0,299],[2,0,3,0,294],[2,0,-1,-2,0],
  ];

  function moonApparent(jd) {
    const T = centuries(jd);
    const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000;
    const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
    const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
    const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
    const F  =  93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;
    /* the sun's eccentricity correction, applied to terms involving M */
    const E = 1 - 0.002516 * T - 0.0000074 * T2;

    let sum = 0;
    for (let i = 0; i < ML.length; i++) {
      const r = ML[i];
      if (!r[4]) continue;
      const arg = r[0] * D + r[1] * M + r[2] * Mp + r[3] * F;
      let f = r[4];
      const am = Math.abs(r[1]);
      if (am === 1) f *= E; else if (am === 2) f *= E * E;
      sum += f * sin(arg);
    }
    /* additive terms — Venus, Jupiter and the flattening of the earth */
    const A1 = 119.75 + 131.849 * T;
    const A2 = 53.09 + 479264.290 * T;
    sum += 3958 * sin(A1) + 1962 * sin(Lp - F) + 318 * sin(A2);

    return norm360(Lp + sum / 1000000);
  }

  /* ---------- vākya: the Sūrya-siddhānta scheme ----------
     Two calendars are in use and they do not agree. Drik (dṛg-gaṇita)
     computes where the sun and the moon actually are — the series above.
     Vākya keeps the arithmetic of the Sūrya Siddhānta: mean motions given
     as revolutions in a mahāyuga, corrected by one equation of centre read
     off the Rsine table. Tamil Nāḍu and much of Kerala keep temple time by
     it, and its tithis close a few hours from the drik ones — enough to move
     a vrata by a day. Neither is an error; they are different traditions.

     Mean positions are counted in civil days at the Ujjain meridian from the
     siddhānta's own creation epoch, and are nirayana by construction: the SS
     frame carries its zero point in its mean motions. */
  const SS = {
    sidYear: 365 + 279457 / 1080000,
    sidMonth: 27 + 4644439 / 14438334,
    anomYear: 1577917828000 / (4320000000 - 387),
    anomMonth: 1577917828 / (57753336 - 488203),
  };
  /* Kali epoch — 18 Feb 3102 BCE, JD 588465.5 — as a plain day number;
     creation stands 1,955,880,000 sidereal years before it. */
  SS.creation = (588465.5 - 1721424.5) - 1955880000 * SS.sidYear;
  /* That count runs to twelve digits, which would leave the moon quantised in
     steps of a few arcseconds. Each period's epoch phase is folded out once,
     here, so the runtime arithmetic works on numbers that keep every digit. */
  const ssPh = {};
  ["sidYear", "sidMonth", "anomYear", "anomMonth"].forEach((k) => {
    ssPh[k] = ((-SS.creation / SS[k]) % 1 + 1) % 1;
  });
  /* the siddhānta's own sine: twenty-four Rsines at 3°45′ on a radius of
     3438, linearly interpolated. Math.sin here instead would be a modern
     correction slipped into a deliberately unmodern calculation. */
  const RSINE = [0, 225, 449, 671, 890, 1105, 1315, 1520, 1719, 1910, 2093, 2267, 2431,
                 2585, 2728, 2859, 2978, 3084, 3177, 3256, 3321, 3372, 3409, 3431, 3438];
  function ssSine(deg) {
    let a = norm360(deg), s = 1;
    if (a > 180) { a -= 180; s = -1; }
    if (a > 90) a = 180 - a;
    const x = a / 3.75, i = Math.min(23, Math.floor(x));
    return s * (RSINE[i] + (x - i) * (RSINE[i + 1] - RSINE[i])) / 3438;
  }
  const ssMean = (t, key) => 360 * (((t / SS[key] + ssPh[key]) % 1 + 1) % 1);
  /* and its inverse, for the arcs the rising computation needs */
  function ssArcSin(y) {
    const t = Math.min(3438, Math.abs(y) * 3438), s = y < 0 ? -1 : 1;
    let i = 0;
    while (i < 23 && RSINE[i + 1] < t) i++;
    const span = RSINE[i + 1] - RSINE[i];
    return s * 3.75 * (i + (span ? (t - RSINE[i]) / span : 0));
  }
  const ssCos = (d) => ssSine(d + 90);
  /* true longitude = mean, less the equation of centre. `size` is the greatest
     equation — the siddhānta gives 2°10′ for the sun and 5°02′ for the moon —
     and `change` the contraction it applies to that near the apsides. */
  function ssTrue(t, per, size, anom, change) {
    const lam = ssMean(t, per), off = ssSine(ssMean(t, anom));
    const eq = Math.asin(off * (size - Math.abs(off) * change * size)) * R2D;
    return norm360(lam - eq);
  }
  /* civil days at Ujjain, where the siddhānta's day begins */
  const ssDay = (jd) => jd + 75.7684 / 360 - 1721424.5;
  const ssSun = (jd) => ssTrue(ssDay(jd), "sidYear", 14 / 360, "anomYear", 1 / 42);
  const ssMoon = (jd) => ssTrue(ssDay(jd), "sidMonth", 32 / 360, "anomMonth", 1 / 96);

  /* ---------- which scheme is in force ----------
     Held as state so that not one of the hundred call sites downstream has to
     carry the choice. The app sets it from the reciter's preference; nothing
     in this file reads storage. */
  let system = "drik";
  const setSystem = (s) => { system = (s === "vakya") ? "vakya" : "drik"; };
  const getSystem = () => system;
  const sunLongitude = (jd) => system === "vakya" ? ssSun(jd) : sunApparent(jd);
  const moonLongitude = (jd) => system === "vakya" ? ssMoon(jd) : moonApparent(jd);

  /* ---------- ayanāṁśa ----------
     Lahiri (Chitrapakṣa) is the Indian government standard and what
     almost every printed pañcāṅga uses. Raman and KP differ only in
     their epoch offset, so they come almost free once this is here. */
  const AYAN_EPOCH = { lahiri: 23.85674, raman: 22.37139, kp: 23.71833 };
  function ayanamsaRaw(jd, flavour) {
    const T = (jd - J2000) / 36525;
    const base = AYAN_EPOCH[flavour || "lahiri"] || AYAN_EPOCH.lahiri;
    return base + 1.39702 * T + 0.000309 * T * T;
  }
  function ayanamsa(jd, flavour) {
    /* vākya longitudes are already nirayana — the siddhānta's zero point is
       built into its mean motions, and taking an ayanāṁśa off them again
       would count the same precession twice */
    if (system === "vakya") return 0;
    return ayanamsaRaw(jd, flavour);
  }

  /* ---------- sidereal longitudes ---------- */
  function longitudes(jd, flavour) {
    const ay = ayanamsa(jd, flavour);
    return { sun: norm360(sunLongitude(jd) - ay), moon: norm360(moonLongitude(jd) - ay), ayanamsa: ay };
  }

  /* elongation of the moon from the sun, 0–360 — the quantity the tithi
     counts in twelfths. Ayanāṁśa cancels, so it needs no flavour. */
  const elong = (jd) => norm360(moonLongitude(jd) - sunLongitude(jd));

  /* ---------- the limbs, as indices ---------- */
  function limbs(jd, flavour) {
    const L = longitudes(jd, flavour);
    const e = norm360(L.moon - L.sun);
    return {
      sun: L.sun, moon: L.moon, ayanamsa: L.ayanamsa, elongation: e,
      tithi: Math.floor(e / 12),                       // 0–29
      nakshatra: Math.floor(L.moon / (360 / 27)),      // 0–26
      yoga: Math.floor(norm360(L.sun + L.moon) / (360 / 27)),  // 0–26
      karana: karanaIndex(e),
      /* how far through the current tithi, for the moon glyph */
      phase: e / 360,
    };
  }

  /* Sixty half-tithis to a lunar month, carrying eleven karaṇa names.
     Kiṁstughna opens the month; then the seven movable ones (Bava …
     Viṣṭi) turn eight times over; then Śakuni, Catuṣpāda and Nāga close
     it. Indices below match the engine's KARANA table, in which the four
     fixed ones sit at 7–10. */
  function karanaIndex(e) {
    const half = Math.floor(e / 6);                 // 0–59
    if (half === 0) return 10;                      // Kiṁstughna
    if (half >= 57) return 7 + (half - 57);         // Śakuni · Catuṣpāda · Nāga
    return (half - 1) % 7;                          // Bava … Viṣṭi
  }

  /* ---------- when a limb turns ----------
     The angle rises about 12.2°/day for the elongation and 13.2°/day for
     the moon, but not evenly — which is exactly why a tithi runs anywhere
     from nineteen to twenty-six hours, and why a calendar that assumes a
     fixed length lands a day out. Bisection on the angle is exact enough
     and cannot diverge. */
  function crossing(fn, target, jd0, jd1) {
    const wrapped = (jd) => {
      let d = fn(jd) - target;
      while (d < -180) d += 360;
      while (d > 180) d -= 360;
      return d;
    };
    let a = jd0, b = jd1, fa = wrapped(a);
    if (fa > 0) return null;
    for (let i = 0; i < 48; i++) {
      const m = (a + b) / 2, fm = wrapped(m);
      if (fm < 0) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  }

  /* the moment the tithi holding jd gives way to the next */
  function tithiEnd(jd) {
    const idx = Math.floor(elong(jd) / 12);
    const target = ((idx + 1) % 30) * 12;
    return crossing(elong, target, jd, jd + 2.2);
  }
  /* and the same for the moon alone, which governs the nakṣatra */
  function nakshatraEnd(jd, flavour) {
    const step = 360 / 27;
    const lon = (j) => norm360(moonLongitude(j) - ayanamsa(j, flavour));
    const idx = Math.floor(lon(jd) / step);
    return crossing(lon, ((idx + 1) % 27) * step, jd, jd + 1.6);
  }

  /* Yoga counts the sum of the two longitudes, karaṇa the half-tithi — both
     turn at their own pace, so both get their own ending. A printed pañcāṅga
     gives every limb an hour; without these the app can only give tithi one. */
  function yogaEnd(jd, flavour) {
    const step = 360 / 27;
    const sum = (j) => { const L = longitudes(j, flavour); return norm360(L.sun + L.moon); };
    const idx = Math.floor(sum(jd) / step);
    return crossing(sum, ((idx + 1) % 27) * step, jd, jd + 1.6);
  }
  function karanaEnd(jd) {
    const idx = Math.floor(elong(jd) / 6);
    return crossing(elong, ((idx + 1) % 60) * 6, jd, jd + 1.2);
  }

  /* ...and when each began. A printed pañcāṅga gives both ends of every limb;
     with only the ending hour the app can say when a nakṣatra lets go but not
     when it took hold, which is the half a saṅkalpa actually names. */
  function tithiStart(jd) {
    const idx = Math.floor(elong(jd) / 12);
    return crossing(elong, idx * 12, jd - 2.2, jd);
  }
  function nakshatraStart(jd, flavour) {
    const step = 360 / 27;
    const lon = (j) => norm360(moonLongitude(j) - ayanamsa(j, flavour));
    return crossing(lon, Math.floor(lon(jd) / step) * step, jd - 1.6, jd);
  }
  function yogaStart(jd, flavour) {
    const step = 360 / 27;
    const sum = (j) => { const L = longitudes(j, flavour); return norm360(L.sun + L.moon); };
    return crossing(sum, Math.floor(sum(jd) / step) * step, jd - 1.6, jd);
  }
  function karanaStart(jd) {
    return crossing(elong, Math.floor(elong(jd) / 6) * 6, jd - 1.2, jd);
  }

  /* ---------- the sun's own sidereal seat ----------
     Which rāśi the sun holds names the lunar month and decides whether a
     lunation is intercalary. Both are knife-edge calls at a saṅkrānti, so
     they read the same solar longitude as everything else here. */
  const sunRashiAt = (jd, flavour) => Math.floor(norm360(sunLongitude(jd) - ayanamsa(jd, flavour)) / 30);
  /* the next saṅkrānti — the instant the sun steps into the following rāśi */
  function sankrantiAfter(jd, flavour) {
    const f = (j) => norm360(sunLongitude(j) - ayanamsa(j, flavour));
    const idx = Math.floor(f(jd) / 30);
    return crossing(f, ((idx + 1) % 12) * 30, jd, jd + 40);
  }

  /* ---------- the lunar year, and the name it carries ----------
     The sixty-year cycle turns at the Caitra new moon, which falls anywhere
     between mid-March and mid-April — so a fixed calendar cutoff names the
     year wrongly for weeks together in every year Ugādi runs late, as 2024's
     did on the ninth of April. Śaka is the era a saṅkalpa names; Vikrama, the
     northern reckoning of the same year, stands 135 years ahead.

     One Caitra new moon per year is all this needs, and the engine asks for
     the lunar year on every single day it computes — several thousand times
     over a vrata calendar. So the answer is found once per year and kept. */
  const caitraCache = {};
  function caitraNewMoon(Y, flavour) {
    const key = Y + "|" + (flavour || "lahiri") + "|" + system;
    if (key in caitraCache) return caitraCache[key];
    /* the sun enters Mīna in the second week of March; Caitra opens at the
       first new moon after that */
    const f = (j) => norm360(sunLongitude(j) - ayanamsa(j, flavour));
    const j0 = toJD(new Date(Date.UTC(Y, 1, 20)));
    const mina = crossing(f, 330, j0, j0 + 40);
    let nm = null;
    if (mina != null) {
      nm = lastNewMoon(mina + 29.6);
      /* the window is a hair longer than the shortest lunation, so it can
         catch the second new moon after the saṅkrānti, or the last one before
         it. Both are one step away. */
      if (nm <= mina) nm = lastNewMoon(nm + 30.5);
      else { const p = lastNewMoon(nm - 1.5); if (p > mina) nm = p; }
    }
    return (caitraCache[key] = nm);
  }
  function lunarYearOf(jd, flavour) {
    let Y = toDate(jd).getFullYear();
    let c = caitraNewMoon(Y, flavour);
    if (c != null && jd < c) { Y -= 1; c = caitraNewMoon(Y, flavour); }
    const shaka = Y - 78;
    return { caitra: c, shaka, vikrama: shaka + 135, samvatsara: (((shaka + 11) % 60) + 60) % 60 };
  }

  /* the new moon at or before jd — the instant a lunar month opens */
  function lastNewMoon(jd) {
    const back = elong(jd) / 12.19;           // rough days since new moon
    let a = jd - back - 1.5, b = jd - back + 1.5;
    const f = (j) => { let d = elong(j); return d > 180 ? d - 360 : d; };
    if (f(a) > 0) a = jd - back - 3;
    for (let i = 0; i < 48; i++) { const m = (a + b) / 2; if (f(m) < 0) a = m; else b = m; }
    return (a + b) / 2;
  }

  /* ---------- the moon's latitude, and where it stands in the sky ----------
     Longitude alone cannot say when the moon rises: it wanders up to 5°
     either side of the ecliptic, which is worth the better part of an hour.
     The leading terms of Meeus' Σb give latitude to about 0.03°, ample. */
  function moonLatitude(jd) {
    const T = centuries(jd), T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000;
    const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000;
    const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000;
    const F  =  93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000;
    return 5.128122 * sin(F) + 0.280602 * sin(Mp + F) + 0.277693 * sin(Mp - F)
         + 0.173237 * sin(2 * D - F) + 0.055413 * sin(2 * D - Mp + F) + 0.046271 * sin(2 * D - Mp - F)
         + 0.032573 * sin(2 * D + F) + 0.017198 * sin(2 * Mp + F) + 0.009266 * sin(2 * D + Mp - F)
         + 0.008822 * sin(2 * Mp - F) + 0.008216 * sin(2 * D - M - F) + 0.004324 * sin(2 * D - 2 * Mp - F)
         + 0.004200 * sin(2 * D + Mp + F);
  }

  const obliquity = (jd) => 23.4392911 - 0.0130042 * centuries(jd);
  /* Greenwich mean sidereal time, degrees */
  function gmst(jd) {
    const T = (jd - J2000) / 36525;
    return norm360(280.46061837 + 360.98564736629 * (jd - J2000) + 0.000387933 * T * T - T * T * T / 38710000);
  }
  /* altitude of the moon above the horizon, degrees */
  function moonAltitude(jd, lat, lon) {
    const lam = moonApparent(jd), bet = moonLatitude(jd), eps = obliquity(jd);
    const ra = Math.atan2(sin(lam) * cos(eps) - Math.tan(bet * D2R) * sin(eps), cos(lam)) * R2D;
    const dec = Math.asin(sin(bet) * cos(eps) + cos(bet) * sin(eps) * sin(lam)) * R2D;
    const H = norm360(gmst(jd) + lon - ra);
    return Math.asin(sin(lat) * sin(dec) + cos(lat) * cos(dec) * cos(H)) * R2D;
  }

  /* ---------- the sun on the horizon ----------
     Same declination-and-hour-angle geometry as the moon, from the apparent
     longitude computed above rather than a fitted day-of-year curve — which
     matters more than it looks: every limb of the day is read AT SUNRISE, so
     a two-minute error in sunrise is a two-minute error in all five. */
  function sunAltitude(jd, lat, lon) {
    /* the TROPICAL sun, always — declination is measured from the equinox, and
       feeding a nirayana vākya longitude in here would swing sunrise by the
       whole ayanāṁśa. Vākya has its own rising tables; this app computes the
       horizon the same way in both schemes and says so. */
    const lam = sunApparent(jd), eps = obliquity(jd);
    const ra = Math.atan2(sin(lam) * cos(eps), cos(lam)) * R2D;
    const dec = Math.asin(sin(eps) * sin(lam)) * R2D;
    const H = norm360(gmst(jd) + lon - ra);
    return Math.asin(sin(lat) * sin(dec) + cos(lat) * cos(dec) * cos(H)) * R2D;
  }

  /* Rise and set of any body over one civil day, by ten-minute sampling and
     bisection on the altitude. Returns Julian days, either possibly null —
     the moon skips a day about once a month, and above the arctic circle so
     does the sun. */
  function horizonCrossings(altFn, jdMidnight, lat, lon, h0) {
    const step = 1 / 144;
    let rise = null, set = null, top = -90;
    let prevT = jdMidnight, prevA = altFn(prevT, lat, lon) - h0;
    for (let t = jdMidnight + step; t <= jdMidnight + 1.0001; t += step) {
      const a = altFn(t, lat, lon) - h0;
      if (a > top) top = a;
      if (prevA <= 0 && a > 0 && rise == null) rise = bisectAlt(altFn, prevT, t, lat, lon, h0, true);
      if (prevA > 0 && a <= 0 && set == null) set = bisectAlt(altFn, prevT, t, lat, lon, h0, false);
      prevT = t; prevA = a;
    }
    return { rise, set, top };
  }
  function bisectAlt(altFn, a, b, lat, lon, h0, rising) {
    for (let i = 0; i < 30; i++) {
      const m = (a + b) / 2, v = altFn(m, lat, lon) - h0;
      if (rising ? v < 0 : v > 0) a = m; else b = m;
    }
    return (a + b) / 2;
  }

  /* How far the horizon falls away below level for an observer standing high
     ABOVE THE GROUND THEY CAN SEE TO: 1.76′√h in metres.

     The height that counts is not height above sea level. A city on a
     plateau — Bengaluru at 920 m, Mysūru at 770, Hyderabad at 505 — looks
     out at land standing just as high as it does, so its horizon is level
     and the dip is zero. That is why every printed pañcāṅga gives Bengaluru
     the sunset a sea-level town at its longitude gets; feed the formula the
     plateau's height instead and the almanac runs three or four minutes late
     all year. In the mountains the error runs the other way: Kedārnāth's
     horizon is a wall of higher peaks, so the sun is lost EARLIER there, not
     later, and no √h will say by how much without terrain data.

     So this takes `horizon` — metres of genuine unobstructed drop to a sea
     or plain horizon — and a location leaves it unset unless that is true of
     it. Zero is the honest default. */
  const dip = (horizon) => (horizon > 0 ? 0.0293 * Math.sqrt(horizon) : 0);

  /* ---------- vākya rising times ----------
     The siddhānta does not hunt the horizon; it finds the cara — the
     ascensional difference. Declination from an obliquity of exactly 24°,
     then Rsin(cara) = earth-sine ÷ day-radius, and the half-day is fifteen
     ghaṭikās plus that. What it yields is the geometric centre of the sun
     on a level horizon: no refraction, no semidiameter — which is why a
     vākya pañcāṅga prints sunrise a few minutes after a drik one, and why
     borrowing drik's sunrise for vākya tithis was a scheme no printed
     almanac produces.

     The siddhānta's frame has drifted from the equinox in the fifteen
     centuries since, so declination is taken from the sāyana longitude —
     ayanāṁśa added back — as every working vākya almanac does. A commanding
     horizon still counts: it really does fall away, whatever the scheme. */
  function ssRiseSet(jdMidnight, lat, lon, horizon) {
    const sayana = (jd) => norm360(ssSun(jd) + ayanamsaRaw(jd, "lahiri"));
    const rightAsc = (jd) => {
      const l = sayana(jd);
      return norm360(Math.atan2(ssSine(l) * ssCos(24), ssCos(l)) * R2D);
    };
    /* local apparent noon — the true sun's hour angle run down to zero. Solved
       rather than corrected: the equation of time falls out of it, which is
       what the siddhānta's own bhujāntara and udayāntara are for. */
    let jn = jdMidnight + 0.5;
    for (let i = 0; i < 8; i++) {
      let H = norm360(gmst(jn) + lon - rightAsc(jn));
      if (H > 180) H -= 360;
      jn -= H / 360.9856;
    }
    const dec = ssArcSin(ssSine(24) * ssSine(sayana(jn)));
    const h0 = -dip(horizon);
    const cosH = (ssSine(h0) - ssSine(lat) * ssSine(dec)) / (ssCos(lat) * ssCos(dec));
    if (cosH >= 1) return { rise: null, set: null, polar: "polar night" };
    if (cosH <= -1) return { rise: null, set: null, polar: "midnight sun" };
    const half = (90 - ssArcSin(cosH)) / 15 / 24;          // arccos, then to days
    return { rise: (jn - half - jdMidnight) * 1440, set: (jn + half - jdMidnight) * 1440, polar: null };
  }

  /* Sunrise and sunset as minutes after local midnight. h0 = −0.833° is the
     usual allowance for refraction plus the sun's own semidiameter — the
     upper limb touching the horizon, which is what a pañcāṅga means — less
     the dip of the horizon for a place above the sea. */
  function sunRiseSet(jdMidnight, lat, lon, horizon) {
    if (system === "vakya") return ssRiseSet(jdMidnight, lat, lon, horizon);
    const c = horizonCrossings(sunAltitude, jdMidnight, lat, lon, -0.833 - dip(horizon));
    const mins = (jd) => jd == null ? null : (jd - jdMidnight) * 1440;
    const polar = (c.rise == null && c.set == null) ? (c.top > 0 ? "midnight sun" : "polar night") : null;
    return { rise: mins(c.rise), set: mins(c.set), polar };
  }

  /* Moonrise and moonset for a civil day, as minutes after local midnight.
     h0 = +0.125° is the standard allowance for refraction less parallax. */
  function moonRiseSet(jdMidnight, lat, lon, tzHours, horizon) {
    const c = horizonCrossings(moonAltitude, jdMidnight, lat, lon, 0.125 - dip(horizon));
    const mins = (jd) => jd == null ? null : (jd - jdMidnight) * 1440;
    return { rise: mins(c.rise), set: mins(c.set) };
  }

  return {
    toJD, toDate, deltaT, sunLongitude, moonLongitude, moonLatitude, ayanamsa, longitudes,
    sunApparent, moonApparent, setSystem, getSystem, ssSun, ssMoon, ssRiseSet, lunarYearOf, dip,
    ayanamsaRaw, caitraNewMoon,
    elong, limbs, karanaIndex, crossing, lastNewMoon,
    tithiStart, tithiEnd, nakshatraStart, nakshatraEnd, yogaStart, yogaEnd, karanaStart, karanaEnd,
    sunRashiAt, sankrantiAfter,
    sunAltitude, sunRiseSet, moonAltitude, moonRiseSet, obliquity, gmst, AYAN_EPOCH,
  };
})();

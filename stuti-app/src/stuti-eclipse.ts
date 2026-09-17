import { STUTI_EPHEM } from "./stuti-ephemeris";

/* ============================================================
   Grahaṇa — eclipses, computed rather than tabulated
   ------------------------------------------------------------
   Every other limb this app computes is an angle: a tithi is a
   difference of longitudes, a nakṣatra a longitude alone. An eclipse is
   the one thing in a pañcāṅga that longitude cannot answer. The moon
   passes the sun twelve times a year and stands opposite it twelve more;
   whether either one is a grahaṇa depends on how far the moon is from
   the ecliptic at that instant, on how far away both bodies are — and,
   for a solar eclipse, on WHERE THE OBSERVER STANDS, because the moon's
   parallax is a full degree, four times its own diameter. A grahaṇa is
   the only entry in an almanac that is genuinely local.

   So this works in vectors, not in Besselian elements. Sun and moon are
   placed as points in space from the ephemeris longitudes and their
   distances; the observer is placed on the spheroid; the two directions
   are differenced from the observer's own position, and the eclipse is
   the moment the discs overlap. Contact times fall out by bisecting the
   same separation. Accuracy runs to a minute or so on the contacts and
   a percent on the magnitude — well inside what a vrata needs, and far
   short of what a scientific canon would claim.

   The śāstric use is plain: a grahaṇa forbids food and worship through
   its span, the bath and japa belong to it, and Grahaṇa Gaurī Nomu is
   kept from the moment the sun is seized. All of those need the hour
   HERE, which is exactly what a global eclipse table cannot give.
   ============================================================ */
export const STUTI_ECLIPSE = (function () {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const AU = 149597870.7, RE = 6378.137, R_SUN = 696000, R_MOON = 1737.4;
  const sin = (d) => Math.sin(d * D2R), cos = (d) => Math.cos(d * D2R);
  const norm = (a) => ((a % 360) + 360) % 360;
  const EPH = () => STUTI_EPHEM;

  /* ---------- distances ----------
     The angles come from the ephemeris; the distances do not, because
     nothing before this needed them. Both matter here and neither is
     small: the moon's distance decides whether an eclipse is total or
     annular, and the sun's decides the size of the disc being covered. */
  function sunDistKm(jd) {
    const T = (jd - 2451545) / 36525;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M)
            + (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
    return AU * (1.000001018 * (1 - e * e) / (1 + e * cos(M + C)));
  }
  /* Meeus' Σr, leading terms — good to a few kilometres, which is a
     thousandth of the moon's own semidiameter */
  const R_TERMS = [
    [0,0,1,0,-20905355],[2,0,-1,0,-3699111],[2,0,0,0,-2955968],[0,0,2,0,-569925],
    [0,1,0,0,48888],[0,0,0,2,-3149],[2,0,-2,0,246158],[2,-1,-1,0,-152138],
    [2,0,1,0,-170733],[2,-1,0,0,-204586],[0,1,-1,0,-129620],[1,0,0,0,108743],
    [0,1,1,0,104755],[2,0,0,-2,10321],[0,0,1,-2,79661],[4,0,-1,0,-34782],
    [0,0,3,0,-23210],[4,0,-2,0,-21636],[2,1,-1,0,24208],[2,1,0,0,30824],
    [1,0,-1,0,-8379],[1,1,0,0,-16675],[2,-1,1,0,-12831],[2,0,2,0,-10445],
    [4,0,0,0,-11650],[2,0,-3,0,14403],
  ];
  function moonArgs(jd) {
    const T = (jd - 2451545) / 36525, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    return {
      D:  297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000,
      M:  357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000,
      Mp: 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000,
      F:   93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000,
      E: 1 - 0.002516 * T - 0.0000074 * T2,
    };
  }
  function moonDistKm(jd) {
    const a = moonArgs(jd);
    let s = 0;
    for (const [d, m, mp, f, c] of R_TERMS) {
      const ecc = Math.abs(m) === 1 ? a.E : Math.abs(m) === 2 ? a.E * a.E : 1;
      s += c * ecc * cos(d * a.D + m * a.M + mp * a.Mp + f * a.F);
    }
    return 385000.56 + s / 1000;
  }

  /* ---------- geometry ----------
     Everything below is Cartesian and geocentric-equatorial: the only
     frame in which "the observer is not at the centre of the earth" can
     be said at all. */
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const len = (a) => Math.sqrt(dot(a, a));
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const angle = (a, b) => {
    const c = dot(a, b) / (len(a) * len(b));
    return Math.acos(Math.max(-1, Math.min(1, c))) * R2D;
  };
  function eq(lam, bet, eps, r) {
    const x = cos(bet) * cos(lam), y = cos(bet) * sin(lam), z = sin(bet);
    return [r * x, r * (y * cos(eps) - z * sin(eps)), r * (y * sin(eps) + z * cos(eps))];
  }
  /* Sun and moon as points in space. Always read in the drik scheme,
     whatever reckoning the app is set to: a vākya almanac prints its
     grahaṇa from a drik computation too, because the siddhānta's own
     eclipse rules miss the hour by the better part of one. */
  function bodies(jd) {
    const E = EPH(), was = E.getSystem ? E.getSystem() : "drik";
    if (was !== "drik" && E.setSystem) E.setSystem("drik");
    const eps = E.obliquity(jd);
    const sd = sunDistKm(jd), md = moonDistKm(jd);
    const s = eq(E.sunApparent(jd), 0, eps, sd);
    const m = eq(E.moonApparent(jd), E.moonLatitude(jd), eps, md);
    if (was !== "drik" && E.setSystem) E.setSystem(was);
    return { s, m, sd, md };
  }
  /* the observer, on the spheroid, in the same frame */
  function observer(jd, lat, lon) {
    const f = 1 / 298.257223563;
    const u = Math.atan(Math.tan(lat * D2R) * (1 - f));
    const rs = (1 - f) * Math.sin(u) * RE, rc = Math.cos(u) * RE;
    const th = norm(EPH().gmst(jd) + lon);
    return [rc * cos(th), rc * sin(th), rs];
  }

  /* what the sky looks like from one place at one instant */
  function circumstances(jd, lat, lon) {
    const b = bodies(jd), o = observer(jd, lat, lon);
    const ts = sub(b.s, o), tm = sub(b.m, o);
    return {
      sep: angle(ts, tm),
      ss: Math.asin(R_SUN / len(ts)) * R2D,
      sm: Math.asin(R_MOON / len(tm)) * R2D,
      altSun: 90 - angle(ts, o),
      altMoon: 90 - angle(tm, o),
    };
  }

  /* the fraction of the sun's disc covered — two overlapping circles.
     Magnitude is a ratio of diameters and reads high; obscuration is
     what the eye and the almanac both mean by "how much". */
  function obscuration(sep, ss, sm) {
    if (sep >= ss + sm) return 0;
    if (sep <= Math.abs(sm - ss)) return sm >= ss ? 1 : (sm * sm) / (ss * ss);
    const a = ss, b = sm, d = sep;
    const t1 = Math.acos((d * d + a * a - b * b) / (2 * d * a));
    const t2 = Math.acos((d * d + b * b - a * a) / (2 * d * b));
    const area = a * a * (t1 - Math.sin(2 * t1) / 2) + b * b * (t2 - Math.sin(2 * t2) / 2);
    return area / (Math.PI * a * a);
  }

  /* ---------- solvers ----------
     Minimum separation, then the contacts on either side of it. Sampled
     coarsely and bisected, because the function is smooth and the whole
     event lasts hours. */
  function minimum(f, t0, half, step) {
    let bt = t0, bv = Infinity;
    for (let t = t0 - half; t <= t0 + half; t += step) {
      const v = f(t);
      if (v < bv) { bv = v; bt = t; }
    }
    let a = bt - step, b = bt + step;
    for (let i = 0; i < 36; i++) {
      const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3;
      if (f(m1) < f(m2)) b = m2; else a = m1;
    }
    return (a + b) / 2;
  }
  /* the instant g crosses zero between t (where g<0) and t+dir·span */
  function contact(g, tMax, span, dir) {
    let a = tMax, b = tMax + dir * span;
    if (g(b) < 0) return null;
    for (let i = 0; i < 40; i++) {
      const m = (a + b) / 2;
      if (g(m) < 0) a = m; else b = m;
    }
    return (a + b) / 2;
  }

  /* Where on earth the shadow axis comes closest — the place that sees the
     most of a solar eclipse. Not the sub-lunar point: for a grazing eclipse
     the axis passes near the limb and the point under the moon sees nothing,
     which is how a real Antarctic annular went unnoticed here. So the axis
     is drawn from the sun through the moon and the geocentre dropped onto
     it; the surface point on the near side of that perpendicular is the one
     to ask. Returns null when the axis misses the earth entirely.

     What this buys is only a NAME: a total eclipse over the Pacific is still
     a grahaṇa, and the day should say so rather than fall silent. */
  function axisPoint(jd) {
    const b = bodies(jd), E = EPH();
    const ax = sub(b.m, b.s), n = len(ax);
    const d = [ax[0] / n, ax[1] / n, ax[2] / n];
    const negM = [-b.m[0], -b.m[1], -b.m[2]];
    const tt = dot(negM, d);
    const w = [negM[0] - tt * d[0], negM[1] - tt * d[1], negM[2] - tt * d[2]];
    const gamma = len(w) / RE;
    if (gamma > 1.6) return null;
    /* where the axis meets the globe. When it does (\u03b3 < 1) that is a
       line\u2013sphere intersection and the near root is the daylit one; when it
       misses, the surface point on the perpendicular is the closest the
       shadow's edge comes to anybody. Taking the perpendicular in both
       cases was the earlier mistake \u2014 for a central eclipse it lands a
       quarter of the way round the earth and reads as a small partial. */
    const B = dot(b.m, d), C = dot(b.m, b.m) - RE * RE;
    const disc = B * B - C;
    let p;
    if (disc >= 0) {
      const ss2 = -B - Math.sqrt(disc);
      p = [b.m[0] + ss2 * d[0], b.m[1] + ss2 * d[1], b.m[2] + ss2 * d[2]];
    } else {
      const k = -RE / len(w);
      p = [w[0] * k, w[1] * k, w[2] * k];
    }
    return {
      gamma,
      lat: Math.asin(p[2] / RE) * R2D,
      lon: norm(Math.atan2(p[1], p[0]) * R2D - E.gmst(jd) + 180) - 180,
    };
  }

  /* ---------- a solar eclipse, as seen from one place ---------- */
  function solarAt(t0, lat, lon) {
    const c = (t) => circumstances(t, lat, lon);
    const f = (t) => { const x = c(t); return x.sep; };
    const tMax = minimum(f, t0, 0.28, 1 / 288);
    const x = c(tMax);
    if (x.sep >= x.ss + x.sm) return null;
    const outer = (t) => { const y = c(t); return y.sep - (y.ss + y.sm); };
    const inner = (t) => { const y = c(t); return y.sep - Math.abs(y.sm - y.ss); };
    const central = x.sep <= Math.abs(x.sm - x.ss);
    const ev = {
      kind: "solar",
      type: central ? (x.sm >= x.ss ? "total" : "annular") : "partial",
      magnitude: (x.ss + x.sm - x.sep) / (2 * x.ss),
      obscuration: obscuration(x.sep, x.ss, x.sm),
      max: tMax,
      begin: contact(outer, tMax, 0.25, -1),
      end: contact(outer, tMax, 0.25, +1),
      innerBegin: central ? contact(inner, tMax, 0.1, -1) : null,
      innerEnd: central ? contact(inner, tMax, 0.1, +1) : null,
      altAtMax: x.altSun,
    };
    return ev;
  }

  /* ---------- a lunar eclipse ----------
     Geocentric by nature: the shadow falls on the moon, not on the
     observer, so everyone who can see the moon sees the same eclipse.
     Only whether it has risen is local. The 1.02 enlargement of both
     shadow radii is the standard allowance for the earth's atmosphere. */
  function shadow(jd) {
    const b = bodies(jd);
    const anti = [-b.s[0], -b.s[1], -b.s[2]];
    const pm = Math.asin(RE / b.md) * R2D, ps = Math.asin(RE / b.sd) * R2D;
    const ss = Math.asin(R_SUN / b.sd) * R2D, sm = Math.asin(R_MOON / b.md) * R2D;
    return {
      sep: angle(anti, b.m), sm,
      P: 1.02 * (0.998340 * pm + ps + ss),
      U: 1.02 * (0.998340 * pm + ps - ss),
    };
  }
  function lunarAt(t0, lat, lon) {
    const f = (t) => shadow(t).sep;
    const tMax = minimum(f, t0, 0.3, 1 / 288);
    const x = shadow(tMax);
    const penMag = (x.P + x.sm - x.sep) / (2 * x.sm);
    const umbMag = (x.U + x.sm - x.sep) / (2 * x.sm);
    if (penMag <= 0) return null;
    const g = (r, s) => (t) => { const y = shadow(t); return y.sep - (y[r] + s * y.sm); };
    const ev = {
      kind: "lunar",
      type: umbMag >= 1 ? "total" : umbMag > 0 ? "partial" : "penumbral",
      magnitude: umbMag > 0 ? umbMag : penMag,
      penumbralMagnitude: penMag,
      obscuration: umbMag > 0 ? Math.min(1, umbMag) : 0,
      max: tMax,
      begin: contact(g("P", +1), tMax, 0.3, -1),
      end: contact(g("P", +1), tMax, 0.3, +1),
      partialBegin: umbMag > 0 ? contact(g("U", +1), tMax, 0.25, -1) : null,
      partialEnd: umbMag > 0 ? contact(g("U", +1), tMax, 0.25, +1) : null,
      innerBegin: umbMag >= 1 ? contact(g("U", -1), tMax, 0.15, -1) : null,
      innerEnd: umbMag >= 1 ? contact(g("U", -1), tMax, 0.15, +1) : null,
      altAtMax: circumstances(tMax, lat, lon).altMoon,
    };
    return ev;
  }

  /* ---------- syzygies ----------
     An eclipse can only sit at a conjunction or an opposition, so those
     are the only instants worth testing. */
  /* the full moon of the lunation that opened at nm. Anchored to the new
     moon rather than hunted from an arbitrary date: elongation runs 0→360
     once a month, so a bracket taken around "now" can straddle the wrong
     lunation and land a month away. */
  function fullAfter(nm) {
    const E = EPH();
    const f = (j) => E.elong(j) - 180;
    let a = nm + 11, b = nm + 19;
    for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (f(m) < 0) a = m; else b = m; }
    return (a + b) / 2;
  }
  const fullMoonNear = (jd) => fullAfter(EPH().lastNewMoon(jd));

  /* ---------- one civil day ----------
     Returns the eclipse touching this local day, or null. Anything the
     observer cannot see is still returned, marked unseen: a grahaṇa
     invisible here carries no vrata, and the app should be able to say
     so rather than leave the day silent. */
  const cache = {};
  function forDay(date, loc, tz) {
    const E = EPH();
    if (!E || !loc) return null;
    const y = date.getFullYear(), mo = date.getMonth() + 1, d = date.getDate();
    const TZ = typeof tz === "number" ? tz : (loc.tz || 0);
    const key = `${y}-${mo}-${d}|${loc.lat.toFixed(2)},${loc.lon.toFixed(2)}|${TZ}`;
    if (key in cache) return cache[key];

    const a = Math.floor((14 - mo) / 12), yy = y + 4800 - a, mm = mo + 12 * a - 3;
    const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy
      + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
    const jdMid = jdn - 0.5 - TZ / 24;     // local midnight, in Julian days

    const mid = jdMid + 0.5;
    const cands = [];
    const nm = E.lastNewMoon(mid + 1.2);
    const nmPrev = E.lastNewMoon(nm - 1.5);
    [nm, nmPrev].forEach((t) => { if (Math.abs(t - mid) < 1.4) cands.push(["solar", t]); });
    [fullAfter(nm), fullAfter(nmPrev)].forEach((t) => {
      if (Math.abs(t - mid) < 1.4) cands.push(["lunar", t]);
    });

    let out = null;
    for (const [kind, t] of cands) {
      /* a cheap gate first: the moon must be within about a degree and a
         half of the node for an eclipse of either kind — the penumbra
         reaches nearly as far as the moon's own shadow cone does, so a
         tighter lunar gate silently drops real upacchāyā eclipses. Almost
         every syzygy fails here and costs nothing. */
      const bet = Math.abs(E.moonLatitude(t));
      if (bet > 1.6) continue;
      let ev = kind === "solar" ? solarAt(t, loc.lat, loc.lon) : lunarAt(t, loc.lat, loc.lon);
      let elsewhere = false;
      const global = () => {
        const tg = minimum((j) => { const a2 = axisPoint(j); return a2 ? a2.gamma : 99; }, t, 0.25, 1 / 288);
        const sp = axisPoint(tg);
        return sp ? solarAt(tg, sp.lat, sp.lon) : null;
      };
      /* nothing of it reaches this sky — then ask the shadow itself, at the
         place the axis comes nearest, so the day can still name the
         grahaṇa it is */
      if (!ev && kind === "solar") {
        ev = global();
        elsewhere = !!ev;
      }
      if (!ev) continue;
      const b = ev.begin != null ? ev.begin : ev.max, e = ev.end != null ? ev.end : ev.max;
      if (e < jdMid || b > jdMid + 1) continue;
      const min = (jd) => jd == null ? null : (jd - jdMid) * 1440;
      /* seen or not: the sun must be up through some of a solar eclipse,
         the moon up through some of a lunar one */
      const altFn = (jd) => {
        const c = circumstances(jd, loc.lat, loc.lon);
        return kind === "solar" ? c.altSun : c.altMoon;
      };
      let visible = false, firstSeen = null, lastSeen = null;
      const step = (e - b) / 60 || 1 / 288;
      if (!elsewhere) for (let t2 = b; t2 <= e + 1e-9; t2 += step) {
        if (altFn(t2) > (kind === "solar" ? -0.5 : 0)) {
          visible = true;
          if (firstSeen == null) firstSeen = t2;
          lastSeen = t2;
        }
      }
      /* the discs can overlap in a direction that is under this city's feet
         — geometry with the sun below the horizon. Then the local reading
         describes an eclipse nobody here could have seen, so the event is
         named from the shadow instead: what it IS, not what it would have
         looked like through the earth. */
      if (!visible && kind === "solar" && !elsewhere) {
        const g = global();
        if (g) { ev = g; elsewhere = true; }
      }
      out = {
        ...ev,
        visible, elsewhere,
        beginMin: elsewhere ? null : min(ev.begin), endMin: elsewhere ? null : min(ev.end),
        maxMin: min(ev.max),
        innerBeginMin: elsewhere ? null : min(ev.innerBegin), innerEndMin: elsewhere ? null : min(ev.innerEnd),
        partialBeginMin: min(ev.partialBegin), partialEndMin: min(ev.partialEnd),
        seenFromMin: min(firstSeen), seenToMin: min(lastSeen),
      };
      break;
    }
    return (cache[key] = out);
  }

  /* the next eclipses from a date, for a calendar or a reminder */
  function next(fromDate, loc, count) {
    const E = EPH();
    if (!E || !loc) return [];
    const out = [];
    let jd = E.toJD(fromDate);
    for (let i = 0; i < 40 && out.length < (count || 4); i++) {
      const nm = E.lastNewMoon(jd + 29.6);
      const t = i % 2 === 0 ? nm : fullAfter(nm);
      const kind = i % 2 === 0 ? "solar" : "lunar";
      if (Math.abs(E.moonLatitude(t)) <= 1.6) {
        const ev = kind === "solar" ? solarAt(t, loc.lat, loc.lon) : lunarAt(t, loc.lat, loc.lon);
        if (ev) out.push({ ...ev, date: E.toDate(ev.max) });
      }
      if (i % 2 === 1) jd += 29.53;
    }
    out.sort((p, q) => p.max - q.max);
    return out;
  }

  const NAME = {
    solar: { iast: "Sūrya grahaṇa", deva: "सूर्य ग्रहण", tel: "సూర్య గ్రహణం" },
    lunar: { iast: "Candra grahaṇa", deva: "चन्द्र ग्रहण", tel: "చంద్ర గ్రహణం" },
  };
  const TYPE = {
    total:     { iast: "khagrāsa",  deva: "खग्रास",   tel: "ఖగ్రాసం", en: "total" },
    annular:   { iast: "valayākāra", deva: "वलयाकार", tel: "వలయాకారం", en: "annular" },
    partial:   { iast: "khaṇḍa",    deva: "खण्ड",     tel: "ఖండం",    en: "partial" },
    penumbral: { iast: "upacchāyā", deva: "उपच्छाया", tel: "ఉపచ్ఛాయ", en: "penumbral" },
  };

  return { forDay, next, solarAt, lunarAt, circumstances, shadow, fullAfter, fullMoonNear, axisPoint, moonDistKm, sunDistKm, NAME, TYPE };
})();

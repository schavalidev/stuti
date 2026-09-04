/* ============================================================
   STUTI — muhūrta: the good and bad windows of a day
   Rāhu kāla, Yamagaṇḍa and Gulika are the daylight cut into eight,
   with a different part falling to each on each weekday. Abhijit is
   the eighth of fifteen. Brahma muhūrta is the hour before dawn.
   All of these want nothing but an exact sunrise and sunset.

   Varjyam is the one that needed the ephemeris: it is a span *inside*
   a nakṣatra, at a fixed fraction of that nakṣatra's own length — so
   it cannot be computed at all until you know when the nakṣatra began
   and when it ends, to the minute.

   Times are minutes after local midnight, matching the engine.
   ============================================================ */
window.STUTI_MUHURTA = (function () {
  const P = () => window.AKSHARA_PANCHANGA;
  const E = () => window.STUTI_EPHEM;

  /* which eighth of the daylight falls to each, by weekday (Sun … Sat).
     0-based: 0 is the first part after sunrise. */
  const SEG = {
    rahu:  [7, 1, 6, 4, 5, 3, 2],
    yama:  [4, 3, 2, 1, 0, 6, 5],
    gulika:[6, 5, 4, 3, 2, 1, 0],
  };

  /* Varjyam — the "abandoned" span. Each nakṣatra has its own starting
     point, given in ghaṭikās out of the sixty that nominally make one up;
     the span itself runs four ghaṭikās. Both scale with the nakṣatra's
     real duration, which is why it moves about the clock.
     Table as printed in Telugu pañcāṅgas (Vākya and Dṛk agree on it —
     it is a fraction, not an observation). */
  const VARJYA_GH = [50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21,
                     20, 14, 14, 10, 14, 56, 24, 20, 10, 10, 18, 16, 24, 30];
  const VARJYA_LEN_GH = 4;

  const NAME = (roman, deva, tel) => ({ roman: roman, deva: deva, tel: tel });
  const LABEL = {
    rahu:    NAME("Rāhu kāla",     "राहु काल",      "రాహు కాలం"),
    yama:    NAME("Yamagaṇḍa",     "यमगण्ड",        "యమగండం"),
    gulika:  NAME("Gulika kāla",   "गुलिक काल",     "గుళిక కాలం"),
    durmuhurta: NAME("Durmuhūrta", "दुर्मुहूर्त",    "దుర్ముహూర్తం"),
    varjyam: NAME("Varjyam",       "वर्ज्यम्",       "వర్జ్యం"),
    abhijit: NAME("Abhijit",       "अभिजित्",       "అభిజిత్"),
    brahma:  NAME("Brahma muhūrta","ब्रह्म मुहूर्त", "బ్రహ్మ ముహూర్తం"),
  };

  /* the nakṣatra span holding a moment, in minutes after local midnight */
  function nakSpan(jd, jdMidnight) {
    const eph = E();
    if (!eph) return null;
    const step = 360 / 27;
    const lon = (j) => { const L = eph.longitudes(j); return L.moon; };
    const idx = Math.floor(lon(jd) / step);
    const start = eph.crossing(lon, idx * step, jd - 1.7, jd);
    const end = eph.crossing(lon, ((idx + 1) % 27) * step, jd, jd + 1.7);
    if (start == null || end == null) return null;
    return { idx: idx, start: (start - jdMidnight) * 1440, end: (end - jdMidnight) * 1440 };
  }

  /* every window of one civil day, sorted, each in minutes after midnight.
     kind: "avoid" — stand down; "good" — favoured for a beginning. */
  function windows(date, loc, pa) {
    const Pa = P();
    pa = pa || Pa.forDay(date, loc);
    const out = [];
    const sr = pa.sunrise, ss = pa.sunset;
    if (sr == null || ss == null) return out;
    const vara = date.getDay(), dayLen = ss - sr, eighth = dayLen / 8;

    ["rahu", "yama", "gulika"].forEach((k) => {
      const i = SEG[k][vara];
      out.push({ id: k, label: LABEL[k], kind: "avoid", start: sr + eighth * i, end: sr + eighth * (i + 1) });
    });

    (pa.durmuhurta || []).forEach((d, i) => {
      out.push({ id: "durmuhurta" + i, label: LABEL.durmuhurta, kind: "avoid", start: d.start, end: d.end });
    });

    /* Abhijit — the eighth of the fifteen muhūrtas of daylight, straddling
       local noon. Not kept on Wednesday. */
    if (vara !== 3) {
      const m = dayLen / 15;
      out.push({ id: "abhijit", label: LABEL.abhijit, kind: "good", start: sr + m * 7, end: sr + m * 8 });
    }

    /* Brahma muhūrta — the two muhūrtas before sunrise, when the mind is
       said to be clearest and recitation is begun */
    out.push({ id: "brahma", label: LABEL.brahma, kind: "good", start: sr - 96, end: sr - 48 });

    /* Varjyam — from the nakṣatra current at sunrise, and from the one that
       follows if it begins before the day is out */
    const jdMidnight = pa.jdRef != null ? pa.jdRef - (sr / 1440) : null;
    if (jdMidnight != null) {
      const seen = {};
      [pa.jdRef, pa.jdRef + 0.8, pa.jdRef + 1.2].forEach((j) => {
        const s = nakSpan(j, jdMidnight);
        if (!s || seen[s.idx]) return;
        seen[s.idx] = 1;
        const len = s.end - s.start;
        const vs = s.start + (VARJYA_GH[s.idx] / 60) * len;
        const ve = vs + (VARJYA_LEN_GH / 60) * len;
        if (ve <= 0 || vs >= 1440) return;
        out.push({ id: "varjyam" + s.idx, label: LABEL.varjyam, kind: "avoid",
                   start: Math.max(0, vs), end: Math.min(1440, ve), nak: s.idx });
      });
    }

    out.sort((a, b) => a.start - b.start);
    return out;
  }

  /* what is running now, and what is next — the only two a home card needs */
  function currentAndNext(date, loc, pa, nowMin) {
    const list = windows(date, loc, pa);
    const now = nowMin != null ? nowMin : (() => {
      const tz = P().effTz(loc, date);
      const utcMin = new Date().getUTCHours() * 60 + new Date().getUTCMinutes();
      return (((utcMin + tz * 60) % 1440) + 1440) % 1440;
    })();
    /* when a good window and an avoid window overlap (Abhijit under a kāla),
       show the good one — the caution rows below already carry the kālas */
    const running = list.filter((w) => now >= w.start && now < w.end);
    const current = running.find((w) => w.kind === "good") || running[0] || null;
    const next = list.find((w) => w.start > now) || null;
    return { current: current, next: next, now: now, all: list };
  }

  return { windows, currentAndNext, LABEL, SEG, VARJYA_GH };
})();

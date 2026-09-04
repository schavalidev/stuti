import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";

/* ============================================================
   STUTI — sandhyāvandanam: the three junctures
   A regular practitioner does not need the vidhi. What they need is
   the hour, and the hour moves: sandhyā is pinned to sunrise and
   sunset, so it slides a minute or two a day and swings well over an
   hour across the year — and it is a different hour in Chennai than
   in Chicago. A 6 AM alarm is wrong most of the year. This is the
   whole argument for computing it rather than setting a clock.

   Each juncture is graded, as the tradition grades it: uttama is the
   proper window, madhyama and adhama the grace after it. Performing
   in adhama kāla calls for the prāyaścitta arghya, so the grade is
   not decoration — it changes what you do.

   One juncture is not one moment, and the two Sūrya acts in it fall on
   opposite sides of a line. The arghya is given at or before sunrise in
   the morning and at or before sunset in the evening — it belongs to the
   sandhi, the joining, and is late once the disc has crossed. Upasthāna
   is the other way about: it is done after sunrise and after sunset, the
   standing praise of a sun already risen or already set. That line is
   `hinge` — sunrise for prātaḥ, sunset for sāyaṃ. Mādhyāhnika has none:
   there its arghya is given at madhyāhna itself and the upasthāna follows
   in the same sitting, so the field is null rather than guessed at.

     Prātaḥ      aruṇodaya (4 ghaṭikās before sunrise) → sunrise,
                 then two muhūrtas madhyama, then adhama.
     Mādhyāhnika the third fifth of the daylight — madhyāhna proper,
                 straddling local noon — then aparāhṇa as it degrades.
     Sāyaṃ       three ghaṭikās before sunset → sunset, then to
                 nightfall as the stars come out, then adhama.

   Times are minutes after local midnight at the chosen place,
   matching the pañcāṅga engine. whenLocal() turns one into a real
   instant on the device clock, which is what a reminder needs.
   ============================================================ */
export const STUTI_SANDHYA = (function () {
  const P = () => AKSHARA_PANCHANGA;
  const NAME = (roman, deva, tel) => ({ roman: roman, deva: deva, tel: tel });

  const LABEL = {
    pratah:      NAME("Prātaḥ sandhyā", "प्रातःसन्ध्या",  "ప్రాతః సంధ్య"),
    madhyahnika: NAME("Mādhyāhnika",    "माध्याह्निक",    "మాధ్యాహ్నికం"),
    sayam:       NAME("Sāyaṃ sandhyā",  "सायंसन्ध्या",    "సాయం సంధ్య"),
  };
  const GRADE = {
    uttama:   NAME("uttama",   "उत्तम",  "ఉత్తమం"),
    madhyama: NAME("madhyama", "मध्यम",  "మధ్యమం"),
    adhama:   NAME("adhama",   "अधम",    "అధమం"),
  };
  const ORDER = ["pratah", "madhyahnika", "sayam"];

  /* the three junctures of one civil day, each with its graded bands */
  function kalas(date, loc, pa) {
    const Pa = P();
    if (!Pa) return [];
    pa = pa || Pa.forDay(date, loc);
    const sr = pa.sunrise, ss = pa.sunset;
    if (sr == null || ss == null) return [];
    const fifth = (ss - sr) / 5;
    const g = (grade, start, end) => ({ grade: grade, label: GRADE[grade], start: start, end: end });
    const mk = (id, bands, hinge) => ({
      id: id, label: LABEL[id], bands: bands,
      start: bands[0].start, end: bands[bands.length - 1].end,
      best: bands[0],                       // the uttama band — the one to aim at
      hinge: hinge == null ? null : hinge,  // arghya before it, upasthāna after
    });
    return [
      mk("pratah", [
        g("uttama", sr - 96, sr),
        g("madhyama", sr, sr + 48),
        g("adhama", sr + 48, sr + 144),
      ], sr),
      mk("madhyahnika", [
        g("uttama", sr + fifth * 2, sr + fifth * 3),
        g("madhyama", sr + fifth * 3, sr + fifth * 3.5),
        g("adhama", sr + fifth * 3.5, sr + fifth * 4),
      ], null),
      mk("sayam", [
        g("uttama", ss - 72, ss),
        g("madhyama", ss, ss + 24),
        g("adhama", ss + 24, ss + 72),
      ], ss),
    ];
  }

  /* minutes after midnight at `loc` → a real instant on the device clock.
     The reciter may not be standing in the place the almanac is cast for,
     and a reminder that ignores that fires at the wrong hour. */
  function whenLocal(date, minOfDay, loc) {
    const tz = P().effTz(loc, date);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) + (minOfDay - tz * 60) * 60000);
  }

  /* the clock at `loc` right now, in minutes after its midnight */
  function nowMin(loc, date) {
    const d = date || new Date();
    const tz = P().effTz(loc, d);
    const u = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
    return (((u + tz * 60) % 1440) + 1440) % 1440;
  }

  /* which band a moment falls in, if any */
  function bandAt(k, m) {
    return k.bands.find((b) => m >= b.start && m < b.end) || null;
  }

  /* what the day looks like from a given moment: the juncture running now
     (with its grade, and whether prāyaścitta applies), and the next one due */
  function state(date, loc, pa, m) {
    const list = kalas(date, loc, pa);
    if (!list.length) return { list: [], current: null, next: null, now: m };
    if (m == null) m = nowMin(loc, date);
    let current = null, band = null;
    for (const k of list) { const b = bandAt(k, m); if (b) { current = k; band = b; break; } }
    const next = list.find((k) => k.start > m) || null;
    return {
      list: list, now: m, current: current, band: band, next: next,
      /* begun in adhama kāla — the extra arghya is prescribed */
      prayaschitta: !!(band && band.grade === "adhama"),
      /* which of the two Sūrya acts the hour is on the right side of */
      hinge: current && current.hinge != null ? current.hinge : null,
      rite: !current || current.hinge == null ? null : (m < current.hinge ? "arghya" : "upasthana"),
      minsLeft: band ? Math.round(band.end - m) : null,
      minsTo: next ? Math.round(next.start - m) : null,
    };
  }

  /* upcoming junctures as real instants, today and tomorrow — what a
     reminder schedules against. lead = minutes of warning. */
  function upcoming(loc, ids, lead, from) {
    const now = from || new Date();
    const out = [];
    for (let off = 0; off <= 1; off++) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + off);
      kalas(day, loc).forEach((k) => {
        if (ids && ids.indexOf(k.id) === -1) return;
        const at = whenLocal(day, k.start - (lead || 0), loc);
        if (at > now) out.push({ id: k.id, kala: k, at: at, day: day });
      });
    }
    out.sort((a, b) => a.at - b.at);
    return out;
  }

  const name = (o, lang) => !o ? "" : lang === "telugu" ? o.tel : lang === "roman" ? o.roman : o.deva;

  return { kalas, state, upcoming, whenLocal, nowMin, bandAt, name, LABEL, GRADE, ORDER };
})();

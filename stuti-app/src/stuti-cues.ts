import { STUTI } from "./stuti-data";
import { STUTI_KEEP } from "./stuti-keep-core";
import { STUTI_LEDGER } from "./stuti-ledger-core";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { STUTI_PREFS } from "./stuti-prefs";
import { STUTI_PLANS, STUTI_VOWS } from "./stuti-sadhana";
import { STUTI_SANDHYA } from "./stuti-sandhya-core";
import { STUTI_LOC } from "./stuti-store";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — the cue registry
   One question asked in one place: what does the reciter owe today,
   what of it has earned the right to interrupt, and what lapsed unkept.

   Deliberately pure. Everything it needs arrives in `ctx` — no globals,
   no localStorage, no DOM — because the same reckoning has to run in
   three places and agree with itself: in the page, in the service
   worker, and on the push server. A server computing cues by its own
   logic would double-ring and invent phantoms, and those are miserable
   bugs to chase. `ctx()` below gathers the globals for the browser;
   the server builds the same shape from the user's record.

   Two answers, and they are not the same answer:
     obligations() — everything owed, always, whatever the settings say.
     ring()        — what should interrupt. Far less.

   The bell is the unreliable surface: permission may be denied, the tab
   may be shut, the push may not arrive. So the in-app list is computed
   from obligations() and depends on none of that.

   On the count of bells: only sandhyā earns one of its own. It is a
   window that opens and closes, and arriving late has a prescribed
   remedy — the hour is the whole point. A vow, a plan's portion, a
   mālā, a marked tithi are all "sometime today", and four separate
   interruptions saying so is how an app gets its notifications shut
   off for good. They fold into one digest at the hour the reciter
   chose. Two or three bells a day, not ten.

   Quiet hours split along the same seam. The digest is "sometime
   today" and simply waits for the hour to lift. A juncture cannot
   wait: by the time the quiet ends its window has closed, and a bell
   announcing a kāla that is already past is not a late reminder but a
   false one — so it does not ring, and the sheet says plainly which
   junctures the quiet swallows.
   ============================================================ */
export const STUTI_CUES = (function () {

  const dayKey = (d) => { const x = d || new Date(); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  const noon = (d) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };
  const DAY = 86400000;

  /* ---- the vow predicate, rebuilt pure ----
     STUTI_VOWS.isDue reaches for the ambient place, which a server has no
     way to supply. Same rule, place handed in. */
  function vowDueOn(vow, day, ctx) {
    const PA = ctx.engines.panchanga, V = ctx.engines.vows;
    if (!PA || !V) return false;
    const start = new Date(vow.start + "T12:00:00");
    const end = new Date(start.getTime() + V.term(vow.term).days * DAY);
    const d = noon(day);
    if (d < noon(start) || d > end) return false;
    const o = V.occ(vow.occasion);
    return o.weekday ? d.getDay() === (vow.weekday || 0) : !!o.test(PA.forDay(d, ctx.place));
  }

  /* a japa practice is established, not incidental — someone who tapped the
     beads once last month should not be told they are behind */
  function japaEstablished(ctx) {
    const id = ctx.state.japaLast;
    if (!id) return false;
    const s = (ctx.state.japa || {})[id];
    if (!s || !s.days) return false;
    let n = 0, t = noon(ctx.now);
    for (let i = 1; i <= 7; i++) if ((s.days[dayKey(new Date(t - i * DAY))] || 0) > 0) n++;
    return n >= 2;
  }

  /* ---------------- quiet hours ----------------
     A span, possibly wrapping midnight, within which nothing may ring.
     Returned as minutes-of-day so the same arithmetic serves the page,
     the worker and the server. */
  const mins = (t) => { const p = String(t || "0:00").split(":"); return (+p[0] || 0) * 60 + (+p[1] || 0); };
  function quiet(prefs) {
    const q = ((prefs || {}).remind || {}).quiet;
    if (!q || !q.on) return null;
    const from = mins(q.from), to = mins(q.to);
    if (from === to) return null;   /* a zero-width quiet is no quiet at all */
    return { from: from, to: to, wraps: from > to };
  }
  function inQuiet(at, q) {
    if (!q) return false;
    const t = at.getHours() * 60 + at.getMinutes();
    return q.wraps ? (t >= q.from || t < q.to) : (t >= q.from && t < q.to);
  }
  /* the first moment after `at` that the quiet lifts */
  function afterQuiet(at, q) {
    const d = new Date(at);
    d.setHours(Math.floor(q.to / 60), q.to % 60, 0, 0);
    if (d <= at) d.setDate(d.getDate() + 1);
    return d;
  }

  /* which enabled junctures the quiet silences today. Said out loud in the
     sheet, because the failure is otherwise invisible: set 9pm to 6am, and
     sāyaṃ in December never rings again with nothing on screen to explain it. */
  function silenced(ctx) {
    const r = (ctx.prefs && ctx.prefs.remind) || {}, q = quiet(ctx.prefs), SY = ctx.engines.sandhya;
    if (!q || !SY || !ctx.place) return [];
    const out = [];
    try {
      SY.kalas(ctx.now, ctx.place).forEach((k) => {
        if (!(r.sandhya || {})[k.id]) return;
        const at = new Date(ctx.now);
        at.setHours(0, 0, 0, 0);
        at.setMinutes(((k.best.start % 1440) + 1440) % 1440 - (r.lead || 0));
        if (inQuiet(at, q)) out.push(k.id);
      });
    } catch (e) {}
    return out;
  }

  /* ---------------- everything owed today ----------------
     `done` is tri-state on purpose: true, false, or null when the app has
     no way to know. Sandhyā is null — nothing records an arghya given, and
     asserting a lapse we cannot see would be a lie. */
  function obligations(ctx) {
    const out = [];
    const now = ctx.now, key = dayKey(now);
    const PA = ctx.engines.panchanga, SY = ctx.engines.sandhya;

    if (SY && ctx.place) {
      let st = null;
      try { st = SY.state(now, ctx.place, null, null); } catch (e) {}
      if (st) st.list.forEach((k) => {
        const running = st.current && st.current.id === k.id;
        out.push({
          kind: "sandhya", id: "sandhya-" + k.id, ref: k.id, window: true, done: null,
          start: k.start, end: k.end, best: k.best, label: k.label,
          state: running ? "now" : k.start > st.now ? "ahead" : "past",
          grade: running ? (st.band && st.band.grade) || null : null,
          prayaschitta: running ? !!st.prayaschitta : false,
        });
      });
    }

    (ctx.state.vows || []).forEach((v) => {
      if (!vowDueOn(v, now, ctx)) return;
      out.push({ kind: "vow", id: "vow-" + v.id, ref: v.id, hymn: v.hymn, deity: v.deity, vkind: v.kind, label: v.label,
        occasion: v.occasion, weekday: v.weekday, remind: v.remind !== false,
        done: (v.kept || []).indexOf(key) >= 0 });
    });

    const plans = ctx.state.plans || {};
    Object.keys(plans).forEach((id) => {
      const p = plans[id];
      if (!p || p.finished) return;
      const h = ctx.state.hymnById ? ctx.state.hymnById(id) : null;
      const days = h && ctx.engines.plans ? ctx.engines.plans.meta(h).days : null;
      out.push({ kind: "plan", id: "plan-" + id, ref: id, hymn: id,
        day: Math.min((p.done || []).length + 1, days || Infinity),
        days: days, done: p.last === key });
    });

    if (japaEstablished(ctx)) {
      const id = ctx.state.japaLast, s = (ctx.state.japa || {})[id] || {};
      out.push({ kind: "japa", id: "japa-" + id, ref: id,
        today: (s.days || {})[key] || 0, done: ((s.days || {})[key] || 0) > 0 });
    }

    /* what the house is keeping — a bell rung on a nomu or a vratam */
    const KP = ctx.engines.keep;
    if (KP) (ctx.state.keeps || []).forEach((k) => {
      let d = null; try { d = KP.dueOn(k, now, { panchanga: PA, place: ctx.place, vrata: ctx.engines.vrata }); } catch (e) {}
      if (!d) return;
      out.push({ kind: "keep", id: "keep-" + k.id, ref: k.id, kkind: k.kind, kref: k.ref, mode: k.mode, state: d.state, away: d.away, n: d.n, done: d.done, remind: d.remind });
    });

    /* an observance is not a debt — it is the day telling you what it is.
       Carried here so one surface can answer "what is today". */
    if (PA && ctx.place) {
      try {
        const obs = (PA.forDay(now, ctx.place).observances || [])[0];
        if (obs) out.push({ kind: "tithi", id: "tithi-" + key, ref: obs.name, obs: obs, done: null });
      } catch (e) {}
    }
    return out;
  }

  /* what lapsed and we can prove it — only the kinds that keep a record.
     Sandhyā is absent by design: a passed kāla is not evidence of a
     missed one.

     Vows lapse a day at a time; each due day either carries its mark or it
     doesn't. Plans and japa don't work that way — a plan is a sequence, so
     there is no such thing as missing day four, and a japa thread has no due
     dates at all. What happened to those is that they went quiet, and the
     honest report is one line saying for how long. */
  function missed(ctx, back) {
    const out = [], n = back || 3, PA = ctx.engines.panchanga;
    const t0 = noon(ctx.now), key = dayKey(ctx.now);

    if (PA) for (let i = 1; i <= n; i++) {
      const day = noon(new Date(t0 - i * DAY)), k = dayKey(day);
      (ctx.state.vows || []).forEach((v) => {
        if (!vowDueOn(v, day, ctx)) return;
        if ((v.kept || []).indexOf(k) < 0)
          out.push({ kind: "vow", id: "miss-vow-" + v.id + "-" + k, ref: v.id, hymn: v.hymn, deity: v.deity, vkind: v.kind, label: v.label, day: day, key: k, days: i });
      });
    }

    /* days since a dayKey, or null if it was never set — a plan touched once
       and abandoned yesterday is not a lapse, it is today's portion */
    const gapSince = (k) => {
      if (!k) return null;
      const d = new Date(k + "T12:00:00");
      if (isNaN(d.getTime())) return null;
      return Math.round((t0 - noon(d)) / DAY);
    };

    const plans = ctx.state.plans || {};
    Object.keys(plans).forEach((id) => {
      const p = plans[id];
      if (!p || p.finished || p.last === key) return;
      const g = gapSince(p.last);
      if (g !== null && g > 1) out.push({ kind: "plan", id: "miss-plan-" + id, ref: id, hymn: id, days: g, since: p.last });
    });

    if (japaEstablished(ctx)) {
      const id = ctx.state.japaLast, days = ((ctx.state.japa || {})[id] || {}).days || {};
      let g = 0;
      while (g < 8 && !((days[dayKey(new Date(t0 - g * DAY))] || 0) > 0)) g++;
      if (g > 1 && g < 8) out.push({ kind: "japa", id: "miss-japa-" + id, ref: id, days: g });
    }

    return out.sort((a, b) => a.days - b.days);
  }

  /* ---------------- what the record says about the record ----------------
     Progress lines ride in the same digest — never their own bell. A pāṭha
     left unsaid is named only the morning after; a plan or japa gone quiet
     for three days gets one line; Sunday carries the week, the month's last
     day the month, its first the count of days ahead; and the thread is
     named at 7, 30 and 108. */
  const MILESTONES = [7, 30, 108, 365];
  function progress(ctx) {
    const LG = ctx.engines.ledger; if (!LG) return [];
    const out = [], day = noon(ctx.now), key = dayKey(day);
    try {
      const y = LG.recite(new Date(day - DAY));
      if (y.due.length && y.state !== "full") out.push({ kind: "recite-missed", id: "recite-missed-" + key, n: y.due.length - y.hit.length, done: false });
    } catch (e) {}
    try {
      missed(ctx, 3).filter((m) => (m.kind === "plan" || m.kind === "japa") && m.days >= 3)
        .forEach((m) => out.push({ kind: "lapse", id: "lapse-" + m.id, what: m.kind, hymn: m.hymn, ref: m.ref, days: m.days, done: false }));
    } catch (e) {}
    try {
      if (day.getDay() === 0) out.push({ kind: "roundup", id: "week-" + key, period: "week", sum: LG.week(new Date(day - DAY)), done: false });
      const last = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
      if (day.getDate() === last) out.push({ kind: "roundup", id: "month-" + key, period: "month", sum: LG.month(day.getFullYear(), day.getMonth()), done: false });
      if (day.getDate() === 1) { const o = LG.open(); if (o.plans || o.nomus) out.push({ kind: "monthstart", id: "monthstart-" + key, days: last, plans: o.plans, nomus: o.nomus, done: false }); }
      const st = LG.streak(); if (MILESTONES.indexOf(st.days) >= 0) out.push({ kind: "streak", id: "streak-" + st.days, days: st.days, done: false });
    } catch (e) {}
    return out;
  }

  /* ---------------- what may interrupt ----------------
     Junctures ring on their own hour. Everything else waits for the digest. */
  function ring(ctx) {
    const r = (ctx.prefs && ctx.prefs.remind) || {};
    const out = [], now = ctx.now, SY = ctx.engines.sandhya, PA = ctx.engines.panchanga;
    const tz = (PA && ctx.place && PA.effTz) ? PA.effTz(ctx.place, now) : null;
    const q = quiet(ctx.prefs);
    const stamp = (c) => { c.utc = c.at.getTime(); c.tz = tz; c.day = dayKey(c.at); return c; };

    const ids = Object.keys(r.sandhya || {}).filter((k) => r.sandhya[k]);
    if (SY && ctx.place && ids.length) {
      try {
        SY.upcoming(ctx.place, ids, r.lead || 0, now).forEach((u) => {
          if (inQuiet(u.at, q)) return;   /* by the time the quiet lifts the kāla is gone */
          out.push(stamp({ id: "sandhya-" + u.id, kind: "sandhya", at: u.at, ref: u.id, kala: u.kala }));
        });
      } catch (e) {}
    }

    if (r.on) {
      const [h, m] = (r.time || "06:00").split(":").map(Number);
      for (let off = 0; off <= 1; off++) {
        let at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + off, h, m, 0, 0);
        /* held, not dropped — the day's obligations keep */
        const held = inQuiet(at, q);
        if (held) at = afterQuiet(at, q);
        if (at <= now) continue;
        /* the digest is reckoned for the day it will land on, not for today —
           a nudge at 6am tomorrow should name tomorrow's vow */
        const items = obligations(Object.assign({}, ctx, { now: at }))
          .filter((o) => o.kind !== "sandhya" && !o.done)
          .filter((o) => o.kind !== "tithi" || r.tithi !== false)
          .filter((o) => o.kind !== "vow" || o.remind !== false)
          .filter((o) => o.kind !== "keep" || o.remind !== false);
        if (r.progress !== false) progress(Object.assign({}, ctx, { now: at })).forEach((p) => items.push(p));
        out.push(stamp({ id: "daily", kind: "digest", at: at, held: held, items: items }));
        break;
      }
    }

    const fired = ctx.fired || {};
    return out.filter((c) => !fired[c.id + "|" + c.day]).sort((a, b) => a.at - b.at);
  }

  /* ---------------- browser adapter ----------------
     The one impure function, kept to one place so the rest can travel. */
  function ctxNow(now) {
    const PA = AKSHARA_PANCHANGA, LOC = STUTI_LOC;
    let place = null;
    if (PA && LOC) {
      const id = LOC.getLocId && LOC.getLocId(), det = LOC.getDetected && LOC.getDetected();
      place = (id === "detected" && det) ? det : (PA.locations.find((l) => l.id === id) || PA.locations[0]);
    }
    let prefs = {}; try { prefs = STUTI_PREFS.get(); } catch (e) {}
    let japa = {}, plans = {};
    try { japa = JSON.parse(localStorage.getItem("stuti-japa") || "{}") || {}; } catch (e) {}
    try { plans = JSON.parse(localStorage.getItem("stuti-plans") || "{}") || {}; } catch (e) {}
    let vows = []; try { vows = STUTI_VOWS.list(); } catch (e) {}
    let keeps = []; try { keeps = STUTI_KEEP.list(); } catch (e) {}
    let fired = {};
    try { fired = JSON.parse(localStorage.getItem("stuti-nudge-fired") || "{}") || {}; } catch (e) {}
    return {
      now: now || new Date(), place: place, prefs: prefs, fired: fired,
      state: {
        vows: vows, plans: plans, japa: japa, keeps: keeps,
        japaLast: (function () { try { return localStorage.getItem("stuti-japa-last") || ""; } catch (e) { return ""; } })(),
        hymnById: (id) => { try { return STUTI.hymnById(id); } catch (e) { return null; } },
      },
      engines: {
        panchanga: PA, sandhya: STUTI_SANDHYA,
        plans: STUTI_PLANS,
        vows: STUTI_VOWS ? { occ: STUTI_VOWS.occ, term: STUTI_VOWS.term } : null,
        keep: STUTI_KEEP || null, vrata: STUTI_VRATA || null,
        ledger: STUTI_LEDGER || null,
      },
    };
  }

  return { obligations, missed, progress, ring, silenced, quiet, inQuiet, ctx: ctxNow, dayKey };
})();

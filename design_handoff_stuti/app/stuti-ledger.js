/* ============================================================
   STUTI — the ledger (plain JS, loads after the stores)
   STUTI_LEDGER reckons, it does not store. Every day's record is
   already in STUTI_THREAD (what was recited, which plan-days and
   nomu-days were kept, how many beads), so a month of any practice
   is a read across those days against what the day asked for:
   the saved stotras for that weekday, a mālā of 108, an open plan,
   a rung nomu. Trackers and the digest read the same answers.
   ============================================================ */
window.STUTI_LEDGER = (function () {
  const MALA = 108, DAY = 86400000;
  const T = () => window.STUTI_THREAD;
  const dkey = (d) => T().dkey(d);
  const noon = (d) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };
  const fromKey = (k) => new Date(k + "T12:00:00");
  const rec = (d) => T().day(dkey(d)) || null;

  /* what the day asked to be recited: the everyday list plus that weekday's */
  function dueRecite(d) {
    let ids = [];
    try { ids = window.STUTI_FAVS.list().concat(window.STUTI_FAVS_WEEK.list(d.getDay())); } catch (e) {}
    return ids.filter((x, i) => ids.indexOf(x) === i);
  }
  /* full: every saved stotra said; part: some; none. With nothing saved, any
     recitation counts as full — the reciter has no list to fall short of */
  function recite(d) {
    const r = rec(d), done = (r && r.r) || [], due = dueRecite(d);
    const hit = due.filter((id) => done.indexOf(id) >= 0);
    const state = !due.length ? (done.length ? "full" : "none") : hit.length === due.length ? "full" : hit.length ? "part" : "none";
    return { key: dkey(d), state, done, due, hit };
  }
  function japa(d) {
    const r = rec(d), n = (r && r.j) || 0;
    return { n, malas: Math.floor(n / MALA), level: n <= 0 ? 0 : n < MALA ? 1 : n < 3 * MALA ? 2 : 3 };
  }
  const pOf = (d, prefix) => (((rec(d) || {}).p) || []).filter((x) => x.indexOf(prefix) === 0);
  function learn(d) { const p = pOf(d, "plan:"); const plans = p.map((x) => x.split(":")[1]); return { plans: plans.filter((x, i) => plans.indexOf(x) === i), n: p.length }; }
  function nomu(d) { const p = pOf(d, "keep:"); return { n: p.length, ids: p.map((x) => x.split(":")[1]) }; }

  function monthCells(y, m) {
    const first = new Date(y, m, 1), n = new Date(y, m + 1, 0).getDate(), out = [];
    for (let i = 0; i < first.getDay(); i++) out.push(null);
    for (let d = 1; d <= n; d++) out.push({ d, date: noon(new Date(y, m, d)), key: dkey(new Date(y, m, d)) });
    return out;
  }
  const monthDates = (y, m) => monthCells(y, m).filter(Boolean).map((c) => c.date);
  function lastDays(n, end) { const e = noon(end || new Date()), out = []; for (let i = n - 1; i >= 0; i--) out.push(new Date(e - i * DAY)); return out; }

  /* one reckoning over a run of days; future days are not counted as elapsed */
  function summary(dates) {
    const today = dkey(new Date());
    const s = { days: 0, elapsed: 0, recite: { full: 0, part: 0, due: 0 }, japa: { beads: 0, malas: 0, days: 0 }, learn: { days: 0, portions: 0 }, nomu: { ticks: 0, days: 0 } };
    dates.forEach((d) => {
      s.days++;
      if (dkey(d) > today) return;
      s.elapsed++;
      const r = recite(d); if (r.due.length) s.recite.due++; if (r.state === "full") s.recite.full++; else if (r.state === "part") s.recite.part++;
      const j = japa(d); s.japa.beads += j.n; if (j.n > 0) s.japa.days++;
      const l = learn(d); if (l.n) { s.learn.days++; s.learn.portions += l.n; }
      const k = nomu(d); if (k.n) { s.nomu.days++; s.nomu.ticks += k.n; }
    });
    s.japa.malas = Math.floor(s.japa.beads / MALA);
    return s;
  }
  const month = (y, m) => summary(monthDates(y, m));
  const week = (end) => summary(lastDays(7, end));
  const year = (y) => { const out = []; for (let m = 0; m < 12; m++) out.push(...monthDates(y, m)); return summary(out); };

  /* what is open right now, for the month-start line */
  const open = () => {
    let plans = 0, nomus = 0;
    try { plans = window.STUTI_PLANS.active().length; } catch (e) {}
    try { nomus = window.STUTI_KEEP.list().filter((k) => k.kind === "nomu" && !k.kept).length; } catch (e) {}
    return { plans, nomus };
  };

  const subs = new Set();
  const fire = () => subs.forEach((fn) => fn());
  ["STUTI_THREAD", "STUTI_JAPA", "STUTI_PLANS", "STUTI_KEEP", "STUTI_FAVS", "STUTI_FAVS_WEEK"].forEach((k) => { try { window[k].subscribe(fire); } catch (e) {} });

  return {
    MALA, dkey, fromKey, dueRecite, recite, japa, learn, nomu,
    monthCells, monthDates, lastDays, summary, month, week, year, open,
    streak: () => { try { return T().streak(); } catch (e) { return { days: 0, graced: 0, today: false }; } },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

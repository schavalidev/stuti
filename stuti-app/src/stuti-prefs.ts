/* ============================================================
   STUTI — preferences
   What the reciter told us once, at the start: the script they
   read, the deities they keep, and the hour they want the lamp
   lit. Plain JS so it loads before React.
   ============================================================ */
export const STUTI_PREFS = (function () {
  const KEY = "stuti-prefs";
  const DEF = { onboarded: false, kept: [], /* the daily stotra nudge is a clock time; the sandhyā cues are not —
                   they are junctures, recomputed each day from sunrise and sunset,
                   so what is stored is which ones and how much warning. */
                remind: { on: false, time: "06:00", tithi: true, progress: true,
                          sandhya: { pratah: false, madhyahnika: false, sayam: false }, lead: 15,
                          /* quiet hours are not one rule but two, because the two kinds of cue
                             are not alike: a digest says "sometime today" and survives being
                             moved, so it waits for the hour to lift; a juncture is a window that
                             closes, and a bell for prātaḥ arriving at seven is not a late
                             reminder but a wrong one, so it falls silent instead. Off by
                             default — prātaḥ can open at 5:10 in June, and a reciter who never
                             heard that cue would blame the app, not the setting. */
                          quiet: { on: false, from: "21:30", to: "05:30" } },
                /* how lunar months are named: amānta (Deccan, south, west) counts
                   a month from new moon; pūrṇimānta (north, east) from full moon.
                   Same days either way — different names through the dark fortnight. */
                masaSystem: "amanta",
                /* which ayanāṁśa the sidereal longitudes are cast against, and
                   whose rule decides a contested vrata day */
                ayanamsa: "lahiri", sampradaya: "smarta",
                /* and which of the two schemes computes the longitudes at all:
                   drik follows the sky, vākya the Sūrya Siddhānta's arithmetic */
                reckoning: "drik",
                /* whether the saṅkalpa names the lunar month or the solar one —
                   cāndramāna across most of the north and Deccan, sauramāna in
                   Tamil Nāḍu, Kerala, Bengal, Assam and Odisha */
                mana: "candra" };
  let p;
  try { p = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { p = Object.assign({}, DEF); }
  if (!Array.isArray(p.kept)) p.kept = [];
  p.remind = Object.assign({}, DEF.remind, p.remind || {});
  p.remind.sandhya = Object.assign({}, DEF.remind.sandhya, p.remind.sandhya || {});
  p.remind.quiet = Object.assign({}, DEF.remind.quiet, p.remind.quiet || {});
  const subs = new Set();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    subs.forEach((fn) => fn(p));
  }
  return {
    get: () => p,
    set: (patch) => { p = Object.assign({}, p, patch); save(); },
    setRemind: (patch) => { p = Object.assign({}, p, { remind: Object.assign({}, p.remind, patch) }); save(); },
    setQuiet: (patch) => { p = Object.assign({}, p, { remind: Object.assign({}, p.remind, { quiet: Object.assign({}, p.remind.quiet, patch) }) }); save(); },
    setSandhya: (id, on) => { p = Object.assign({}, p, { remind: Object.assign({}, p.remind, { sandhya: Object.assign({}, p.remind.sandhya, { [id]: on }) }) }); save(); },
    keeps: (id) => p.kept.indexOf(id) !== -1,
    toggleKeep: (id) => { p = Object.assign({}, p, { kept: p.kept.indexOf(id) !== -1 ? p.kept.filter((x) => x !== id) : p.kept.concat([id]) }); save(); },
    finish: () => { p = Object.assign({}, p, { onboarded: true }); save(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

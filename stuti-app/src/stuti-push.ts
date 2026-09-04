import { STUTI_CUES } from "./stuti-cues";
import { STUTI_NUDGE } from "./stuti-nudge";

/* ============================================================
   STUTI — the push seam
   There is no push server yet, and this file does not pretend
   otherwise. It exists so the day there is one, nothing else has to
   change: the ringing code already asks subscribed() before it fires,
   and already knows how to describe a reciter to a server in the exact
   shape STUTI_CUES consumes.

   record() is the launch blocker written out in full. A server cannot
   reckon junctures from a device's localStorage — prātaḥ and sāyaṃ need
   the place and its true offset for the day, the digest needs the
   chosen hour and the quiet span, the vows need their occasions and
   which of them may ring. This is that payload. Nothing else about the
   reciter travels, deliberately: no reading history, no favourites, no
   progress. A cue server has no business knowing what someone read.
   ============================================================ */
export const STUTI_PUSH = (function () {
  const KEY = "stuti-push";
  let sub = null;
  try { sub = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { sub = null; }

  /* the server owns delivery only once it can actually reach the device.
     While this is false the page rings its own bells; the moment it turns
     true the page stands down, so the two can never both post the same cue. */
  const subscribed = () => !!(sub && sub.endpoint);
  const subscription = () => sub;

  function note(s) {
    sub = s && s.endpoint ? s : null;
    try { sub ? localStorage.setItem(KEY, JSON.stringify(sub)) : localStorage.removeItem(KEY); } catch (e) {}
    try { STUTI_NUDGE.arm(); } catch (e) {}
    return sub;
  }

  function record() {
    let c = null;
    try { c = STUTI_CUES.ctx(); } catch (e) { return null; }
    const pl = c.place, PA = c.engines.panchanga, pr = c.prefs || {};
    return {
      v: 1,
      lang: (function () { try { return localStorage.getItem("stuti-lang") || "deva"; } catch (e) { return "deva"; } })(),
      /* the zone is what the server must keep; the offset below is only true
         for today, and a stored number goes wrong twice a year.
         `horizon`, not `elev`: what moves sunrise is the drop to the horizon
         the observer can actually see to, and a plateau city stands level with
         its own. Sending height above sea level had the server reckon
         Bengaluru's s\u0101ya\u1e43 cue three or four minutes off the hour the card
         shows \u2014 the same error the ephemeris stopped making. */
      place: pl ? { id: pl.id, city: pl.city, lat: pl.lat, lon: pl.lon, horizon: pl.horizon || 0,
                    zone: pl.zone || null, tz: (PA && PA.effTz) ? PA.effTz(pl, c.now) : (pl.tz || 0) } : null,
      remind: pr.remind || null,
      /* the almanac settings decide which day a tithi-bound vow falls on, so
         they are part of the cue payload, not decoration */
      reckoning: { ayanamsa: pr.ayanamsa, sampradaya: pr.sampradaya, reckoning: pr.reckoning, masaSystem: pr.masaSystem },
      vows: (c.state.vows || []).map((v) => ({ id: v.id, hymn: v.hymn, kind: v.kind, deity: v.deity, occasion: v.occasion,
        weekday: v.weekday, term: v.term, start: v.start, kept: v.kept || [], remind: v.remind !== false })),
      plans: c.state.plans || {}, japa: c.state.japa || {}, japaLast: c.state.japaLast || "",
      sub: sub || null,
    };
  }

  return { subscribed, subscription, note, record };
})();

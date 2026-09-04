/* ============================================================
   STUTI — favourites / daily-recitation store
   A tiny observable list of hymn ids the user keeps for daily
   pāṭha. Plain JS so it loads before the React scripts.
   ============================================================ */
window.STUTI_FAVS = (function () {
  const KEY = "stuti-favs";
  let ids;
  try { ids = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { ids = []; }
  if (!Array.isArray(ids)) ids = [];
  const subs = new Set();
  function save() { localStorage.setItem(KEY, JSON.stringify(ids)); subs.forEach(fn => fn(ids.slice())); }
  return {
    list: () => ids.slice(),
    has: (id) => ids.includes(id),
    add: (id) => { if (!ids.includes(id)) { ids = [...ids, id]; save(); } },
    toggle: (id) => { ids = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]; save(); },
    /* used only by STUTI_FAVS_WEEK, to lift an id out without re-triggering
       the weekday side of the exclusivity rule */
    _remove: (id) => { if (ids.includes(id)) { ids = ids.filter(x => x !== id); save(); } },
    /* the reciter's own order, not the order things happened to be added in —
       dragged into place once, remembered forever */
    reorder: (newIds) => { const set = new Set(newIds); ids = newIds.filter(id => ids.includes(id)).concat(ids.filter(id => !set.has(id))); save(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

/* ============================================================
   STUTI — weekday recitation lists
   Beside the everyday list, each weekday (0=Sun..6=Sat) may carry its
   own recurring list — a Tuesday list, a Friday list — that recites
   in addition to the everyday one, every week, on that weekday alone.
   A stotra lives in exactly one list at a time: claiming it for a
   weekday lifts it out of the everyday list and any other weekday.
   ============================================================ */
window.STUTI_FAVS_WEEK = (function () {
  const KEY = "stuti-favs-week";
  let db;
  try { db = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { db = {}; }
  if (!db || typeof db !== "object" || Array.isArray(db)) db = {};
  const subs = new Set();
  function save() { localStorage.setItem(KEY, JSON.stringify(db)); subs.forEach(fn => fn()); }
  const arr = (w) => db[w] || (db[w] = []);
  const api = {
    list: (w) => arr(w).slice(),
    has: (id, w) => arr(w).includes(id),
    add: (id, w) => {
      for (let x = 0; x < 7; x++) { if (x === w) continue; const a = arr(x); const i = a.indexOf(id); if (i >= 0) a.splice(i, 1); }
      if (window.STUTI_FAVS) window.STUTI_FAVS._remove(id);
      const a = arr(w); if (!a.includes(id)) a.push(id);
      save();
    },
    toggle: (id, w) => { if (arr(w).includes(id)) { arr(w).splice(arr(w).indexOf(id), 1); save(); } else api.add(id, w); },
    reorder: (newIds, w) => { const cur = arr(w); const set = new Set(newIds); db[w] = newIds.filter(id => cur.includes(id)).concat(cur.filter(id => !set.has(id))); save(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
  return api;
})();

/* ============================================================
   STUTI — reading-progress pointer
   The reader persists a per-hymn line position (stuti-pos-<id>).
   This holds a single pointer to the *most recent* hymn so the
   home can offer to resume it in one tap.
   ============================================================ */
window.STUTI_PROGRESS = (function () {
  const KEY = "stuti-last";
  let rec;
  try { rec = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { rec = null; }
  const subs = new Set();
  function emit() { subs.forEach(fn => fn(rec)); }
  return {
    get: () => rec,
    set: (r) => { rec = r; try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} emit(); },
    clear: () => { rec = null; try { localStorage.removeItem(KEY); } catch (e) {} emit(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

/* ============================================================
   STUTI — location store (drives the pañcāṅga)
   Lifted out of the pañcāṅga card so the location chip can live
   in the home greeting while the almanac reads the same value.
   Holds only the id + any detected place; resolving id → city
   object is done in the useLoc() hook against the engine's list.
   ============================================================ */
window.STUTI_LOC = (function () {
  let locId, detected, geo = "idle"; // geo: idle | locating | denied | error
  try { locId = localStorage.getItem("stuti-loc") || "tirupati"; } catch (e) { locId = "tirupati"; }
  try { detected = JSON.parse(localStorage.getItem("stuti-detected") || "null"); } catch (e) { detected = null; }
  const subs = new Set();
  function emit() { subs.forEach(fn => fn()); }
  function setLocId(id) { locId = id; try { localStorage.setItem("stuti-loc", id); } catch (e) {} emit(); }
  function setDetected(d) { detected = d; try { localStorage.setItem("stuti-detected", JSON.stringify(d)); } catch (e) {} emit(); }
  function setGeo(g) { geo = g; emit(); }
  function detect(onDone) {
    if (!navigator.geolocation) { setGeo("error"); return; }
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude, lon = pos.coords.longitude;
        const tz = -new Date().getTimezoneOffset() / 60; // device offset, DST-aware
        /* Name the place from the nearest city we already know, so the chip
           reads sensibly with no network at all. The lookup below only ever
           improves on it. */
        let city = "My location", region = "Detected position", near = null;
        try { near = window.AKSHARA_PANCHANGA.nearest(lat, lon); } catch (e) {}
        if (near) {
          city = near.km <= 30 ? near.city : "Near " + near.city;
          region = near.region;
        }
        try {
          const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
          const bail = ctl && setTimeout(() => ctl.abort(), 6000);
          const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, ctl ? { signal: ctl.signal } : undefined);
          if (bail) clearTimeout(bail);
          if (r.ok) {
            const j = await r.json();
            const named = j.city || j.locality || j.principalSubdivision;
            if (named) {
              city = named;
              const country = (j.countryName || "").replace(/ of Great Britain.*$/i, "").replace(/\s*\(the\)\s*$/i, "").trim();
              region = [j.principalSubdivision, country].filter(Boolean).join(", ") || region;
            }
          }
        } catch (e) { /* offline or refused — the nearest-city name stands */ }
        setDetected({ id: "detected", city, region, lat: +lat.toFixed(3), lon: +lon.toFixed(3), tz,
          /* if the device knows its height, the horizon dips and sunrise comes
             earlier — worth minutes in the hills, nothing at the coast */
          elev: (pos.coords.altitude != null && pos.coords.altitude > 0) ? Math.round(pos.coords.altitude) : 0,
          detected: true });
        setLocId("detected");
        setGeo("idle");
        if (onDone) onDone();
      },
      (err) => { setGeo(err && err.code === 1 ? "denied" : "error"); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }
  return {
    getLocId: () => locId,
    getDetected: () => detected,
    getGeo: () => geo,
    setLocId, setGeo, detect,
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

/* The four reckoning questions — māsa system, ayanāṁśa, drik/vākya,
   sampradāya, and the māna a saṅkalpa names — moved to stuti-reckoning.js
   when the website needed the same answers. One definition, both apps. */

/* ============================================================
   Deep links — Stuti.html#nitya, #library, #calendar and the rest.
   The table lived inside stuti-main.jsx, which the tablet build does not
   load, so the wide app quietly ignored every link the website sent it.
   It belongs here, where both mains can read it.
   ============================================================ */
window.STUTI_ROUTE = (function () {
  const VIEW = {
    today: "home", home: "home", nitya: "daily", daily: "daily",
    library: "browse", browse: "browse", calendar: "calendar", panchanga: "calendar",
    japa: "japa", plans: "plans", practices: "practices", settings: "settings",
  };
  return {
    VIEW: VIEW,
    /* the screen a URL names, or null — an unknown hash is not an error, it is
       just not a route, and the app stays where it was */
    view: function () {
      const h = (location.hash || "").replace(/^#\/?/, "").toLowerCase();
      return VIEW[h] || null;
    },
  };
})();

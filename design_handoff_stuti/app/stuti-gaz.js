/* ============================================================
   STUTI — the long tail of places, fetched only when typed
   The curated list is ordered for a picker: the places a reciter
   is likely to be in, with their regions spelled the way the app
   spells them. It cannot also be a gazetteer — 559 entries do not
   contain Bellampally's neighbour village, and a saṅkalpa spoken
   at the wrong latitude gets the wrong sunrise.
   So the gazetteer is a second file — India plus the diaspora
   regions, ~1MB packed — loaded the first time someone types
   three letters and never on a cold start.
   ============================================================ */
window.STUTI_GAZ = (function () {
  let state = "idle"; // idle | loading | ready | error
  let promise = null;
  const subs = new Set();
  const emit = () => subs.forEach((fn) => fn());

  function load() {
    if (promise) return promise;
    state = "loading"; emit();
    promise = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "stuti-gazetteer.js";
      s.onload = () => { state = window.STUTI_GAZETTEER ? "ready" : "error"; emit(); resolve(window.STUTI_GAZETTEER || null); };
      s.onerror = () => { state = "error"; emit(); resolve(null); };
      document.head.appendChild(s);
    });
    return promise;
  }

  const norm = (v) => v.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  /* Suppressing a curated place from the gazetteer results is a question of
     identity, not of spelling. Curated diaspora rows keep the state inside
     the city ("Coppell, TX") and the country in the region, so no key built
     from those strings will ever match the gazetteer's "Coppell|Texas". A
     name and a position will: same name within 25km is the same town, which
     suppresses Coppell twice over while keeping Philadelphia, Mississippi,
     which is a different place from the one in Pennsylvania.
     The curated Indian rows also match on name alone, since the app's
     coordinates there are rounded to the city and can sit further out. */
  let seen = null;
  function curated() {
    if (seen) return seen;
    seen = new Map();
    const add = (name, l) => {
      const k = norm(String(name).replace(/,\s*[A-Z]{2}$/, ""));
      if (!k) return;
      if (!seen.has(k)) seen.set(k, []);
      seen.get(k).push(l);
    };
    try {
      for (const l of window.AKSHARA_PANCHANGA.locations) { add(l.city, l); if (l.alt) add(l.alt, l); }
    } catch (e) {}
    return seen;
  }
  function isCurated(row) {
    const hits = curated().get(norm(row.name));
    if (!hits) return false;
    if (row.countryCode === "IN") return true;
    return hits.some((l) => {
      const dLat = (l.lat - row.lat) * 111, dLon = (l.lon - row.lon) * 111 * Math.cos(row.lat * Math.PI / 180);
      return Math.sqrt(dLat * dLat + dLon * dLon) <= 25;
    });
  }

  /* The engine wants `tz` as the zone's STANDARD offset in hours and `zone`
     as the IANA name, which is the only value that survives a DST change.
     Standard is whichever of January and July is the smaller offset — true
     in both hemispheres, since summer time only ever adds. */
  const offsets = {};
  function stdOffset(zone) {
    if (offsets[zone] != null) return offsets[zone];
    const at = (iso) => {
      try {
        const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(new Date(iso));
        const m = /GMT([+-])(\d{2}):(\d{2})/.exec((parts.find((p) => p.type === "timeZoneName") || {}).value || "");
        if (!m) return null;
        return (m[1] === "-" ? -1 : 1) * (Number(m[2]) + Number(m[3]) / 60);
      } catch (e) { return null; }
    };
    const jan = at("2026-01-15T12:00:00Z"), jul = at("2026-07-15T12:00:00Z");
    const v = jan == null ? jul : jul == null ? jan : Math.min(jan, jul);
    offsets[zone] = v == null ? 0 : v;
    return offsets[zone];
  }

  /* → [{ city, region, lat, lon, tz, zone, countryCode }] in the shape
     STUTI_LOC.pick wants */
  async function search(query, limit) {
    if (!query || query.trim().length < 3) return [];
    const g = await load();
    if (!g) return [];
    return g.search(query, limit || 24, isCurated).map((r) => ({
      city: r.name,
      region: r.admin === r.country ? r.country : r.admin + ", " + r.country,
      lat: r.lat, lon: r.lon, tz: stdOffset(r.tz), zone: r.tz,
      countryCode: r.countryCode,
    }));
  }

  return {
    search, load,
    getState: () => state,
    count: () => (window.STUTI_GAZETTEER ? window.STUTI_GAZETTEER.count : 0),
    countries: () => (window.STUTI_GAZETTEER ? window.STUTI_GAZETTEER.countries : []),
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

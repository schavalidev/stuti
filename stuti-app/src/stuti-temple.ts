/* ============================================================
   STUTI — the reciter's own temples
   The app knows the great kṣetras, and a reciter visits those a few
   times in a life. The temple they actually go to is the one at the
   end of their road, and no gazetteer of ours will ever hold it. So
   they pin it themselves, standing in it: a name, the deity, and the
   position the phone was at when they pinned it. After that the app
   can recognise the place on its own.

   Nothing here leaves the device. The pins are the reciter's own
   record of where they worship, which is about as private as this
   app holds, so they are kept in localStorage beside the rest and
   are never sent anywhere.
   ============================================================ */
export const STUTI_TEMPLE = (function () {
  const KEY = "stuti-temples";
  const ASK = "stuti-temple-notice";   /* may the app look, on opening? */
  /* How near counts as being there. A temple stands in its own ground and
     a phone's fix inside a stone building is poor, so this is generous:
     close enough to be at that temple and not at the next street. */
  const NEAR_M = 250;

  let list = [];
  try { const raw = localStorage.getItem(KEY); list = raw ? JSON.parse(raw) : []; } catch (e) { list = []; }
  if (!Array.isArray(list)) list = [];

  const subs = new Set();
  const emit = () => subs.forEach((fn) => { try { fn(); } catch (e) {} });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} emit(); };

  /* metres between two positions on the sphere. The compass needs bearings
     over thousands of kilometres and does its own; this one needs tens of
     metres, and the two have no reason to share a line of code. */
  const R = 6371000, D = Math.PI / 180;
  function metres(a, b) {
    const p1 = a.lat * D, p2 = b.lat * D;
    const dp = p2 - p1, dl = (b.lon - a.lon) * D;
    const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return R * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  return {
    NEAR_M,
    all: () => list.slice(),
    count: () => list.length,
    get: (id) => list.find((p) => p.id === id) || null,
    add: ({ name, deity, lat, lon }) => {
      const id = "t" + Date.now().toString(36);
      list.push({ id, name: String(name || "").trim(), deity: deity || null,
        lat: +Number(lat).toFixed(5), lon: +Number(lon).toFixed(5), pinned: Date.now() });
      save();
      return id;
    },
    edit: (id, patch) => { const p = list.find((x) => x.id === id); if (!p) return; Object.assign(p, patch); save(); },
    remove: (id) => { list = list.filter((p) => p.id !== id); save(); },
    /* the pin you are standing in, or null. The nearest wins, so two pins in
       one compound do not argue. */
    at: (lat, lon) => {
      if (typeof lat !== "number" || typeof lon !== "number") return null;
      let best = null;
      list.forEach((p) => {
        const m = metres({ lat, lon }, p);
        if (m <= NEAR_M && (!best || m < best.m)) best = { pin: p, m: Math.round(m) };
      });
      return best;
    },
    /* Looking for the reciter at all is asked for once and then remembered.
       An app that quietly takes a position every time it opens is not what
       was agreed to, and for the households abroad it is not even lawful. */
    mayNotice: () => { try { return localStorage.getItem(ASK) === "1"; } catch (e) { return false; } },
    setNotice: (v) => { try { localStorage.setItem(ASK, v ? "1" : "0"); } catch (e) {} emit(); },
    asked: () => { try { return localStorage.getItem(ASK) != null; } catch (e) { return false; } },
    /* a fix taken for this purpose only: where the phone is now, to the
       accuracy a building allows, and never stored unless a pin is made */
    here: () => new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, acc: pos.coords.accuracy }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 }
      );
    }),
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

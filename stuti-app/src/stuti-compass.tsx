import React from "react";
import { STUTI_DESA } from "./stuti-desa";
import { STUTI_L } from "./stuti-i18n";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — a compact compass beside the place, and the tīrthas it points to
   A rite faces a direction — east for the sandhyā, south for the pitṛs —
   and in a new town the reciter does not know where east is. The dial
   turns with the phone; north is the long mark, east the accent dot.
   On iOS the sensor is asked for from the tap itself, never on load.

   A dial that only says "north is that way" leaves the reciter to do the
   geometry, so the dial opens a sheet of tīrthas: how far Kāśī is from
   where you stand, which of the eight directions it lies in, and a gold
   needle that holds it. Choose one and the needle stays on the face.
   The sheet is why the dial now renders on a device with no orientation
   sensor at all — a bearing counted from a fixed north is still an answer,
   and it is the answer a printed map gives.
   ============================================================ */
const { useState: useCpS, useEffect: useCpE, useRef: useCpR, useMemo: useCpM } = React;

/* ---------- the tīrthas ----------
   Coordinates come from the deśa clause's ANCHORS wherever it has them:
   one list of positions for the whole app, and no second truth to drift.
   The rows below add the kṣetras a reciter looks for that a saṅkalpa does
   not reckon from, with their own positions. A tīrtha a few kilometres off
   is of no consequence here — from Dallas, eight kilometres between the
   hill and the town below it moves the bearing by a twentieth of a degree.
   The name is the one the reciter uses, not the saṅkalpa's genitive. */
const CP_TIRTHA = [
  { id: "varanasi",     roman: "Kāśī",             deva: "काशी" },
  { id: "prayagraj",    roman: "Prayāga",          deva: "प्रयाग" },
  { id: "gaya",         roman: "Gayā",             deva: "गया" },
  { id: "ayodhya",      roman: "Ayodhyā",          deva: "अयोध्या" },
  { id: "mathura",      roman: "Mathurā",          deva: "मथुरा" },
  { id: "vrindavan",    roman: "Vṛndāvana",        deva: "वृन्दावन",       lat: 27.581, lon: 77.701 },
  { id: "kurukshetra",  roman: "Kurukṣetra",       deva: "कुरुक्षेत्र" },
  { id: "haridwar",     roman: "Haridvāra",        deva: "हरिद्वार" },
  { id: "badrinath",    roman: "Badarīnātha",      deva: "बदरीनाथ" },
  { id: "kedarnath",    roman: "Kedāranātha",      deva: "केदारनाथ",       lat: 30.735, lon: 79.067 },
  { id: "vaishnodevi",  roman: "Vaiṣṇodevī",       deva: "वैष्णोदेवी",     lat: 33.030, lon: 74.950 },
  { id: "chitrakoot",   roman: "Citrakūṭa",        deva: "चित्रकूट",       lat: 25.200, lon: 80.867 },
  { id: "pushkar",      roman: "Puṣkara",          deva: "पुष्कर" },
  { id: "ujjain",       roman: "Ujjayinī",         deva: "उज्जयिनी" },
  { id: "omkareshwar",  roman: "Oṁkāreśvara",      deva: "ओंकारेश्वर" },
  { id: "dwarka",       roman: "Dvārakā",          deva: "द्वारका" },
  { id: "nageshwar",    roman: "Nāgeśvara",        deva: "नागेश्वर",       lat: 22.336, lon: 69.086 },
  { id: "somnath",      roman: "Somanātha",        deva: "सोमनाथ" },
  { id: "kamakhya",     roman: "Kāmākhyā",         deva: "कामाख्या",       lat: 26.166, lon: 91.706 },
  { id: "puri",         roman: "Purī",             deva: "पुरी" },
  { id: "deoghar",      roman: "Vaidyanātha",      deva: "वैद्यनाथ" },
  { id: "nashik",       roman: "Pañcavaṭī",        deva: "पञ्चवटी" },
  { id: "trimbakeshwar",roman: "Tryambakeśvara",   deva: "त्र्यम्बकेश्वर",  lat: 19.933, lon: 73.533 },
  { id: "bhimashankar", roman: "Bhīmāśaṅkara",     deva: "भीमाशङ्कर",      lat: 19.073, lon: 73.536 },
  { id: "grishneshwar", roman: "Ghṛṣṇeśvara",      deva: "घृष्णेश्वर",      lat: 20.024, lon: 75.170 },
  { id: "pandharpur",   roman: "Paṇḍharpur",       deva: "पण्ढरपुर" },
  { id: "gokarna",      roman: "Gokarṇa",          deva: "गोकर्ण" },
  { id: "udupi",        roman: "Uḍupi",            deva: "उडुपि",          lat: 13.341, lon: 74.742 },
  { id: "sringeri",     roman: "Śṛṅgerī",          deva: "शृङ्गेरी" },
  { id: "hampi",        roman: "Hampi",            deva: "हम्पी" },
  { id: "mantralayam",  roman: "Mantrālayam",      deva: "मन्त्रालयम्",     lat: 15.950, lon: 77.500 },
  { id: "srisailam",    roman: "Śrīśailam",        deva: "श्रीशैलम्" },
  { id: "ahobilam",     roman: "Ahobilam",         deva: "अहोबिलम्",        lat: 15.133, lon: 78.717 },
  { id: "tirupati",     roman: "Tirumala",         deva: "तिरुमल" },
  { id: "kalahasti",    roman: "Śrīkālahasti",     deva: "श्रीकालहस्ति" },
  { id: "vijayawada",   roman: "Indrakīlādri",     deva: "इन्द्रकीलाद्रि",  lat: 16.517, lon: 80.617 },
  { id: "yadagirigutta",roman: "Yādādri",          deva: "यादाद्रि",        lat: 17.583, lon: 78.950 },
  { id: "bhadrachalam", roman: "Bhadrācalam",      deva: "भद्राचलम्" },
  { id: "draksharamam", roman: "Dakṣārāmam",       deva: "दक्षारामम्",      lat: 16.794, lon: 82.064 },
  { id: "annavaram",    roman: "Annavaram",        deva: "अन्नवरम्" },
  { id: "simhachalam",  roman: "Siṁhācalam",       deva: "सिंहाचलम्",       lat: 17.767, lon: 83.250 },
  { id: "kanchipuram",  roman: "Kāñcī",            deva: "काञ्ची" },
  { id: "arunachala",   roman: "Aruṇācala",        deva: "अरुणाचल",        lat: 12.225, lon: 79.075 },
  { id: "chidambaram",  roman: "Cidambaram",       deva: "चिदम्बरम्" },
  { id: "tiruchirappalli", roman: "Śrīraṅgam",     deva: "श्रीरङ्गम्" },
  { id: "madurai",      roman: "Madurai",          deva: "मदुरै" },
  { id: "rameswaram",   roman: "Rāmeśvaram",       deva: "रामेश्वरम्" },
  { id: "kanyakumari",  roman: "Kanyākumārī",      deva: "कन्याकुमारी",     lat: 8.079, lon: 77.541 },
  { id: "sabarimala",   roman: "Śabarimala",       deva: "शबरिमल",         lat: 9.433, lon: 77.083 },
  { id: "guruvayur",    roman: "Guruvāyūr",        deva: "गुरुवायूर्",       lat: 10.595, lon: 76.040 },
  { id: "thiruvananthapuram", roman: "Anantapuram", deva: "अनन्तपुरम्" },
];

/* ---------- the geometry ----------
   The initial bearing of the great circle, which is the direction a reciter
   in Dallas actually faces to face Tirumala. A constant compass course is a
   different line and a wrong answer over that distance. */
const CP_D2R = Math.PI / 180, CP_R2D = 180 / Math.PI;
function cpBearing(a, b) {
  const p1 = a.lat * CP_D2R, p2 = b.lat * CP_D2R, dl = (b.lon - a.lon) * CP_D2R;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (Math.atan2(y, x) * CP_R2D + 360) % 360;
}
function cpKm(a, b) {
  const p1 = a.lat * CP_D2R, p2 = b.lat * CP_D2R;
  const dp = p2 - p1, dl = (b.lon - a.lon) * CP_D2R;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/* The eight are reckoned clockwise from the east, which is the order the
   deśa clause keeps them in; a bearing is counted from the north. */
function cpDir8(bearing) {
  const DIR = (STUTI_DESA && STUTI_DESA.DIR8) || null;
  if (!DIR) return null;
  return DIR[Math.round((((bearing - 90) % 360 + 360) % 360) / 45) % 8];
}

function CompassDial({ lang, loc }) {
  const has = typeof window !== "undefined" && "DeviceOrientationEvent" in window;
  const [on, setOn] = useCpS(() => { try { return localStorage.getItem("stuti-compass") === "1"; } catch (e) { return false; } });
  const [hd, setHd] = useCpS(null);
  const [sheet, setSheet] = useCpS(false);
  const [aimId, setAimId] = useCpS(() => { try { return localStorage.getItem("stuti-tirtha") || null; } catch (e) { return null; } });
  const [q, setQ] = useCpS("");
  const L = STUTI_L;
  const label = L && L.t ? L.t("compass", lang) : "Compass";
  const remember = (v) => { try { localStorage.setItem("stuti-compass", v ? "1" : "0"); } catch (e) {} };

  /* A dial is only a compass if its heading is counted from true north.
     Chrome on Android gives that on deviceorientationabsolute, and on any
     event that sets the absolute flag; plain deviceorientation counts alpha
     from wherever the phone happened to lie when the page loaded, so taking
     that reading would point the mark at a direction that is not north.
     Both listeners stay — whichever carries a true heading is used. */
  const gotRef = useCpR(false);
  useCpE(() => {
    if (!on || !has) return;
    let live = true;
    const handler = (e) => {
      if (!live) return;
      let h = null;
      if (typeof e.webkitCompassHeading === "number" && !isNaN(e.webkitCompassHeading)) h = e.webkitCompassHeading;
      else if (e.absolute === true && typeof e.alpha === "number" && !isNaN(e.alpha)) h = (360 - e.alpha) % 360;
      if (h == null) return;
      gotRef.current = true;
      setHd(h);
    };
    window.addEventListener("deviceorientationabsolute", handler, true);
    window.addEventListener("deviceorientation", handler, true);
    /* no reading in a while means the sensor is not giving one — the dial
       stays, off, and the next tap asks again from a real gesture. Whether
       one arrived is kept in a ref: a reading does not re-run this effect,
       so the state read here would always be the null it was created with,
       and the dial would put itself out five seconds after every tap. */
    const t = setTimeout(() => { if (live && !gotRef.current) { setOn(false); remember(false); } }, 5000);
    return () => { live = false; clearTimeout(t); window.removeEventListener("deviceorientationabsolute", handler, true); window.removeEventListener("deviceorientation", handler, true); };
  }, [on]);

  const sensor = () => {
    if (on) { setOn(false); setHd(null); gotRef.current = false; remember(false); return; }
    const DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === "function") {
      DOE.requestPermission().then((r) => { if (r === "granted") { gotRef.current = false; setOn(true); remember(true); } }).catch(() => {});
    } else { gotRef.current = false; setOn(true); remember(true); }
  };
  const keep = (id) => { setAimId(id); try { if (id) localStorage.setItem("stuti-tirtha", id); else localStorage.removeItem("stuti-tirtha"); } catch (e) {} };

  /* The list is worked out once per place, not once per heading: a reading
     arrives several times a second and the distances do not move. */
  const rows = useCpM(() => {
    if (!loc || typeof loc.lat !== "number") return [];
    const A = {};
    try { (STUTI_DESA.ANCHORS || []).forEach((a) => { A[a.id] = a; }); } catch (e) {}
    const out = [];
    CP_TIRTHA.forEach((t) => {
      const p = (typeof t.lat === "number") ? t : A[t.id];
      if (!p || typeof p.lat !== "number") return;   /* no position, no row */
      const km = cpKm(loc, p);
      if (km < 12) return;                           /* you are standing in it */
      out.push({ ...t, km, bearing: cpBearing(loc, p) });
    });
    out.sort((a, b) => a.km - b.km);
    return out;
  }, [loc && loc.lat, loc && loc.lon]);

  const aim = rows.find((r) => r.id === aimId) || null;
  const nm = (r) => lang === "deva" ? r.deva
    : lang === "telugu" ? STUTI_TRANSLIT.convert(r.deva, "telugu")
    : r.roman;
  const dirOf = (b) => {
    const d = cpDir8(b);
    if (!d) return Math.round(b) + "°";
    const s = lang === "deva" ? d.deva : lang === "telugu" ? STUTI_TRANSLIT.convert(d.deva, "telugu") : d.iast;
    return s + " · " + Math.round(b) + "°";
  };

  /* The ring already carries the heading, so the aiming needle inside it is
     turned by the bearing alone — and on a device with no sensor the ring
     stands at zero and the needle reads off a fixed north, as on a map. */
  const rot = hd == null ? 0 : -hd;
  const dirs = lang === "telugu" ? ["ఉ", "తూ"] : lang === "deva" ? ["उ", "पू"] : ["N", "E"];
  const deg = hd == null ? "" : " " + Math.round(hd) + "°";
  const fold = (s) => STUTI_TRANSLIT.fold(s);
  const qf = fold(q).trim();
  const shown = qf ? rows.filter((r) => fold(r.roman + " " + r.id).indexOf(qf) !== -1) : rows;
  const font = L && L.font ? L.font(lang) : undefined;
  const Portal = OverlayPortal || (({ children }) => children);

  return (
    <React.Fragment>
      <button className={"cp-dial" + (on && hd != null ? " live" : "")} onClick={() => setSheet(true)}
        aria-label={label + deg} aria-haspopup="dialog" aria-expanded={sheet}>
        <span className="cp-ring" style={{ transform: `rotate(${rot}deg)` }}>
          <span className="cp-n" />
          <span className="cp-e" />
          <span className="cp-l cp-l-n">{dirs[0]}</span>
          <span className="cp-l cp-l-e">{dirs[1]}</span>
          {aim && <span className="cp-aim" style={{ transform: `rotate(${aim.bearing.toFixed(1)}deg)` }} />}
        </span>
        <span className="cp-pin" />
      </button>
      {sheet && (
        <Portal>
          <div className="tday-scrim" onClick={() => setSheet(false)} />
          <div className="tday-sheet cp-sheet" role="dialog" aria-label={L.t("tirthaDik", lang)}>
            <div className="tday-grip" />
            <div className="tday-head">
              <div style={{ minWidth: 0 }}>
                <div className="eyebrow">{label}</div>
                <h3 className="tday-date" style={{ fontFamily: font }}>{L.t("tirthaDik", lang)}</h3>
              </div>
              <button className="tday-x" onClick={() => setSheet(false)} aria-label={L.a("aClose")}>×</button>
            </div>
            {has && (
              <button type="button" className={"rm-toggle cp-sw" + (on && hd != null ? " on" : "")}
                aria-pressed={on} onClick={sensor}>
                <span>{L.t("compassUse", lang)}</span>
                <span className="cp-sw-v">{on ? (hd == null ? L.t("compassWait", lang) : Math.round(hd) + "°") : ""}</span>
              </button>
            )}
            <div className="cp-note" style={{ fontFamily: font }}>
              {L.t("tirthaNote", lang).replace("{place}", (loc && loc.city) || "")}
            </div>
            <div className="cp-find">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.t("tirthaFind", lang)}
                autoComplete="off" spellCheck="false" aria-label={L.t("tirthaFind", lang)} />
              {q && <button onClick={() => setQ("")} aria-label={L.a("aClear")}>×</button>}
            </div>
            <div className="tday-list cp-list">
              {shown.map((r) => (
                <button type="button" key={r.id} className={"cp-row" + (r.id === aimId ? " on" : "")}
                  onClick={() => keep(r.id === aimId ? null : r.id)} aria-pressed={r.id === aimId}>
                  <span className="cp-mini" aria-hidden="true">
                    <span className="cp-mini-n" style={{ transform: `rotate(${(r.bearing - (hd || 0)).toFixed(1)}deg)` }} />
                  </span>
                  <span className="cp-row-nm" style={{ fontFamily: font }}>{nm(r)}</span>
                  <span className="cp-row-m">
                    <b>{Math.round(r.km).toLocaleString()} km</b>
                    <i style={{ fontFamily: font }}>{dirOf(r.bearing)}</i>
                  </span>
                </button>
              ))}
              {shown.length === 0 && <div className="tday-empty">{L.t("tirthaNone", lang)}</div>}
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
}
export { CompassDial };

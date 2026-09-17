/* ============================================================
   STUTI — a compact compass beside the place
   A rite faces a direction — east for the sandhyā, south for the pitṛs —
   and in a new town the reciter does not know where east is. The dial
   turns with the phone; north is the long mark, east the accent dot.
   Hidden only where the device has no orientation sensor at all. On iOS
   the sensor is asked for from the tap itself, never on load.
   ============================================================ */
const { useState: useCpS, useEffect: useCpE, useRef: useCpR } = React;

function CompassDial({ lang }) {
  const has = typeof window !== "undefined" && "DeviceOrientationEvent" in window;
  const [on, setOn] = useCpS(() => { try { return localStorage.getItem("stuti-compass") === "1"; } catch (e) { return false; } });
  const [hd, setHd] = useCpS(null);
  const L = window.STUTI_L;
  const label = L && L.t ? L.t("compass", lang) : "Compass";
  const remember = (v) => { try { localStorage.setItem("stuti-compass", v ? "1" : "0"); } catch (e) {} };

  useCpE(() => {
    if (!on || !has) return;
    let live = true;
    const handler = (e) => {
      if (!live) return;
      let h = null;
      if (typeof e.webkitCompassHeading === "number" && !isNaN(e.webkitCompassHeading)) h = e.webkitCompassHeading;
      else if (typeof e.alpha === "number") h = (360 - e.alpha) % 360;
      if (h != null) setHd(h);
    };
    window.addEventListener("deviceorientationabsolute", handler, true);
    window.addEventListener("deviceorientation", handler, true);
    /* no reading in a while means the sensor is not giving one — the dial
       stays, off, and the next tap asks again from a real gesture */
    const t = setTimeout(() => { if (live && hd == null) { setOn(false); remember(false); } }, 5000);
    return () => { live = false; clearTimeout(t); window.removeEventListener("deviceorientationabsolute", handler, true); window.removeEventListener("deviceorientation", handler, true); };
  }, [on]);

  if (!has) return null;
  const toggle = () => {
    if (on) { setOn(false); setHd(null); remember(false); return; }
    const DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === "function") {
      DOE.requestPermission().then((r) => { if (r === "granted") { setOn(true); remember(true); } }).catch(() => {});
    } else { setOn(true); remember(true); }
  };
  const rot = hd == null ? 0 : -hd;
  const dirs = lang === "telugu" ? ["ఉ", "తూ"] : lang === "deva" ? ["उ", "पू"] : ["N", "E"];
  const deg = hd == null ? "" : " " + Math.round(hd) + "°";
  return (
    <button className={"cp-dial" + (on && hd != null ? " live" : "")} onClick={toggle} aria-label={label + deg} aria-pressed={on}>
      <span className="cp-ring" style={{ transform: `rotate(${rot}deg)` }}>
        <span className="cp-n" />
        <span className="cp-e" />
        <span className="cp-l cp-l-n">{dirs[0]}</span>
        <span className="cp-l cp-l-e">{dirs[1]}</span>
      </span>
      <span className="cp-pin" />
    </button>
  );
}
Object.assign(window, { CompassDial });

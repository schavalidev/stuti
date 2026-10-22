/* Pañcāṅga check — entry bundled by run.mjs. Imports the engine as the app
   does and prints one record per (date, place). Nothing here changes the
   engine; STUTI_PREFS falls back to its defaults because Node has no
   localStorage (lahiri · drik · amānta). */
import { AKSHARA_PANCHANGA as P } from "../../src/stuti-panchanga-engine";
import { STUTI_MUHURTA as MU } from "../../src/stuti-muhurta";
import { STUTI_ECLIPSE as EC } from "../../src/stuti-eclipse";
import { STUTI_EPHEM as E } from "../../src/stuti-ephemeris";

const fmt = (min: number | null) => {
  if (min == null) return "—";
  let m = Math.round(min), day = "";
  if (m >= 1440) { m -= 1440; day = "+1"; } else if (m < 0) { m += 1440; day = "-1"; }
  const h = Math.floor(m / 60), mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}${day}`;
};
const win = (w: any) => w ? `${fmt(w.start)}–${fmt(w.end)}` : "—";

export function record(dateStr: string, locId: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const loc = P.locations.find((l: any) => l.id === locId);
  if (!loc) throw new Error("no location " + locId);
  const date = new Date(y, m - 1, d);
  const pa = P.forDay(date, loc);
  const wins = MU.windows(date, loc, pa);
  const w = (id: string) => wins.find((x: any) => x.id === id);
  const tz = P.effTz(loc, date);
  return {
    date: dateStr, place: loc.city, tz,
    vara: pa.vara.iast || pa.vara.en || pa.vara,
    sunrise: fmt(pa.sunrise), sunset: fmt(pa.sunset),
    moonrise: fmt(pa.moonrise ?? pa.moonriseNext), moonset: fmt(pa.moonset ?? pa.moonsetNext),
    tithi: `${pa.paksha} ${pa.tithiName}`, tithiEnd: fmt(pa.tithiEndMin),
    nakshatra: pa.nak.iast, nakEnd: fmt(pa.nakEndMin),
    yoga: pa.yoga, yogaEnd: fmt(pa.yogaEndMin),
    karana: pa.karana, karanaEnd: fmt(pa.karanaEndMin),
    rahu: win(pa.rahu), yama: win(w("yama")), gulika: win(w("gulika")), abhijit: win(w("abhijit")),
    masaAmanta: pa.masa.iast, masaPurnimanta: pa.masaPurnimanta.iast, adhika: pa.masaAdhika, kshaya: pa.masaKshaya,
    ayana: pa.ayana.iast, samvatsaraIdx: pa.samvatsaraIdx, shaka: pa.shaka,
    grahana: pa.grahana ? { kind: pa.grahana.kind, type: pa.grahana.type, visible: pa.grahana.visible,
      begin: fmt(pa.grahana.begin != null ? (pa.grahana.begin - (pa.jdRef - pa.sunrise / 1440)) * 1440 : null),
      max: fmt((pa.grahana.max - (pa.jdRef - pa.sunrise / 1440)) * 1440),
      end: fmt(pa.grahana.end != null ? (pa.grahana.end - (pa.jdRef - pa.sunrise / 1440)) * 1440 : null) } : null,
  };
}

/* helpers for choosing dates */
export function sankrantis(year: number) {
  return P.sankrantis(year).map((s: any) => ({ rashi: s.rashi, jd: s.jd, utc: E.toDate(s.jd).toISOString(), civil: s.civil && s.civil.toDateString ? s.civil.toDateString() : s.civil }));
}
export function nextEclipses(from: string, locId: string, n = 2) {
  const loc = P.locations.find((l: any) => l.id === locId);
  return EC.next(new Date(from), loc, n).map((e: any) => ({ kind: e.kind, type: e.type, maxUTC: E.toDate(e.max).toISOString(), mag: e.magnitude, altAtMax: e.altAtMax }));
}
/* days (at a place) whose tithi ends within `tol` minutes of sunrise */
export function nearSunriseTithi(from: string, days: number, locId: string, tol = 60) {
  const loc = P.locations.find((l: any) => l.id === locId);
  const out: any[] = [];
  const d0 = new Date(from);
  for (let i = 0; i < days; i++) {
    const d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + i);
    const pa = P.forDay(d, loc);
    const gap = pa.tithiEndMin - pa.sunrise;                 // this tithi ends after sunrise by gap
    const prevGap = pa.sunrise - pa.tithiStartMin;           // it began before sunrise by prevGap
    if (Math.abs(gap) <= tol || Math.abs(prevGap) <= tol) out.push({ date: d.toISOString().slice(0, 10), sunrise: fmt(pa.sunrise), tithi: pa.tithiName, start: fmt(pa.tithiStartMin), end: fmt(pa.tithiEndMin) });
  }
  return out;
}
export function tithiDays(from: string, days: number, locId: string, which: "Amāvāsyā" | "Pūrṇimā") {
  const loc = P.locations.find((l: any) => l.id === locId);
  const out: string[] = [];
  const d0 = new Date(from);
  for (let i = 0; i < days; i++) {
    const d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + i);
    const pa = P.forDay(d, loc);
    if (pa.tithiName === which) out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${pa.masa.iast}${pa.masaAdhika ? " (adhika)" : ""}`);
  }
  return out;
}
export function adhikaMonths(from: string, days: number) {
  const loc = P.locations.find((l: any) => l.id === "hyderabad");
  const seen = new Set<string>(); const out: string[] = [];
  const d0 = new Date(from);
  for (let i = 0; i < days; i += 7) {
    const d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + i);
    const pa = P.forDay(d, loc);
    if (pa.masaAdhika && !seen.has(pa.masa.iast)) { seen.add(pa.masa.iast); out.push(`${pa.masa.iast} around ${d.toDateString()}`); }
  }
  return out;
}

/* geocentric apparent place of the moon and sun at an instant, for checking
   against JPL Horizons (observer 500@399, apparent RA/Dec) */
export function positions(iso: string) {
  const jd = E.toJD(new Date(iso));
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const s = (d: number) => Math.sin(d * D2R), c = (d: number) => Math.cos(d * D2R);
  const lam = E.moonApparent(jd), bet = E.moonLatitude(jd), eps = E.obliquity(jd);
  const ra = ((Math.atan2(s(lam) * c(eps) - Math.tan(bet * D2R) * s(eps), c(lam)) * R2D) + 360) % 360;
  const dec = Math.asin(s(bet) * c(eps) + c(bet) * s(eps) * s(lam)) * R2D;
  const slam = E.sunApparent(jd);
  const sra = ((Math.atan2(s(slam) * c(eps), c(slam)) * R2D) + 360) % 360, sdec = Math.asin(s(eps) * s(slam)) * R2D;
  return { jd, deltaT: E.deltaT(jd), moon: { lon: lam, lat: bet, ra, dec }, sun: { lon: slam, ra: sra, dec: sdec }, obliquity: eps, gmst: E.gmst(jd), ayanamsaLahiri: E.ayanamsaRaw(jd, "lahiri") };
}

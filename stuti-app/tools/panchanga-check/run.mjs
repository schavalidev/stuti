#!/usr/bin/env node
/* Pañcāṅga check — bundles entry.ts with the app's own rolldown and runs it.
   Usage (from stuti-app/):
     node tools/panchanga-check/run.mjs                 # the standard date×place matrix, JSON lines
     node tools/panchanga-check/run.mjs 2026-01-14 tirupati hyderabad
     node tools/panchanga-check/run.mjs --pos 2026-05-18T00:00:00Z   # sun/moon RA, Dec, longitude for a Horizons check
     node tools/panchanga-check/run.mjs --find          # saṅkrāntis, eclipses, adhika, amāvāsyā/pūrṇimā, near-sunrise tithi ends
   Reads nothing but the engine; writes only the bundle to os.tmpdir(). */
import { rolldown } from "rolldown";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "panchanga-check-")), "bundle.mjs");
const b = await rolldown({ input: path.join(here, "entry.ts"), platform: "node", logLevel: "silent" });
await b.write({ file: out, format: "esm" });
const M = await import(out);

const PLACES = ["tirupati", "hyderabad", "newyork", "sydney"];
export const DATES = [
  "2026-01-14", "2026-01-15",            // Makara saṅkrānti 2026 (sun enters Makara 14 Jan 20:45 IST → kept 15 Jan)
  "2026-05-18", "2026-06-10",            // adhika Jyeṣṭha 2026
  "2026-07-16",                          // Karka saṅkrānti 2026
  "2026-10-31", "2026-11-01", "2026-11-02", // New York DST ends 1 Nov 2026
  "2026-11-08", "2026-11-09",            // Dīpāvali: amāvāsyā begins 8 Nov evening, holds at sunrise 9 Nov
  "2026-11-19", "2026-11-20",            // tithi ends within an hour of sunrise (Daśamī 07:16, Ekādaśī 06:32 vs sunrise 06:24 Hyd)
  "2026-11-24",                          // Kārtika pūrṇimā
  "2027-01-14", "2027-01-15",            // Makara saṅkrānti 2027
  "2027-02-06", "2027-02-07", "2027-02-20", "2027-02-21", // next two eclipses: annular solar 6 Feb 16:55 UTC, penumbral lunar 20 Feb 23:13 UTC
  "2027-03-13", "2027-03-14",            // New York DST begins 14 Mar 2027
  "2027-04-03", "2027-04-04",            // Sydney DST ends 4 Apr 2027
  "2027-07-17",                          // Karka saṅkrānti 2027
];

const args = process.argv.slice(2);
if (args[0] === "--find") {
  console.log(JSON.stringify({
    sankrantis2026: M.sankrantis(2026), sankrantis2027: M.sankrantis(2027),
    eclipsesFromToday: M.nextEclipses("2026-10-22", "hyderabad", 3),
    adhika: M.adhikaMonths("2026-01-01", 730),
    amavasya: M.tithiDays("2026-10-01", 90, "hyderabad", "Amāvāsyā"),
    purnima: M.tithiDays("2026-10-01", 90, "hyderabad", "Pūrṇimā"),
    nearSunriseHyd: M.nearSunriseTithi("2026-10-01", 120, "hyderabad", 60),
  }, null, 1));
} else if (args[0] === "--pos") {
  /* geocentric apparent sun and moon at UTC instants, to set beside JPL Horizons (CENTER 500@399, QUANTITIES 2,31) */
  for (const t of args.slice(1)) console.log(t, JSON.stringify(M.positions(t)));
} else if (args.length && /^\d{4}-\d{2}-\d{2}$/.test(args[0])) {
  const dates = args.filter((a) => /^\d{4}-/.test(a)), places = args.filter((a) => !/^\d{4}-/.test(a));
  for (const d of dates) for (const p of (places.length ? places : PLACES)) console.log(JSON.stringify(M.record(d, p)));
} else {
  for (const d of DATES) for (const p of PLACES) console.log(JSON.stringify(M.record(d, p)));
}

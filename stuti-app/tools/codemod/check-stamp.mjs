// The build a tester is holding must be the build they name in a report.
//
// STUTI_BUILD.label() — "Stuti 0.9.104 · 2026.09.16 · beta" — stands on the
// gate, at the foot of the library, in every feedback mail and on every batch
// of counters. Its two constants are written by hand in stuti-build.js, and
// nothing has ever compared them with anything: the stamp said 0.9.89 and the
// 4th of September through fifteen releases, so a fortnight of beta reports
// named a build that no tester had.
//
// The changelog is where a release gets its number, so the changelog is what
// the stamp is measured against: its newest section's version and date.
// Bumping one without the other now stops the port.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DESIGN = join(HERE, "../../../design_handoff_stuti");
const CHANGELOG = join(DESIGN, "docs/Changelog.html");
const STAMP = join(DESIGN, "app/stuti-build.js");
const PORTED = join(HERE, "../../src/stuti-build.ts");

const MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

const log = readFileSync(CHANGELOG, "utf8");
const ver = log.match(/<div class="ver">\s*([^<\s]+)\s*<\/div>/);
const date = log.match(/<div class="date">\s*([^<]+?)\s*<\/div>/);
if (!ver || !date) {
  console.error("stamp: the changelog's newest release has no version or no date — cannot check the build stamp");
  process.exit(1);
}
const [, d, month, y] = date[1].match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/) || [];
const mi = MONTHS.indexOf(month);
if (mi < 0) {
  console.error(`stamp: the changelog's newest date reads "${date[1]}", which is not a date this can parse`);
  process.exit(1);
}
const want = { version: ver[1], build: `${y}.${String(mi + 1).padStart(2, "0")}.${d.padStart(2, "0")}` };

const bad = [];
for (const [file, label] of [[STAMP, "design_handoff_stuti/app/stuti-build.js"], [PORTED, "stuti-app/src/stuti-build.ts"]]) {
  const text = readFileSync(file, "utf8");
  const v = (text.match(/const VERSION = "([^"]+)"/) || [])[1];
  const b = (text.match(/const BUILD = "([^"]+)"/) || [])[1];
  if (v !== want.version || b !== want.build) bad.push({ label, v, b });
}

if (!bad.length) {
  console.log(`stamp: the app calls itself ${want.version} · ${want.build}, which is the newest release in the changelog`);
  process.exit(0);
}
console.error("stamp: the app does not call itself what the changelog's newest release calls it:");
for (const { label, v, b } of bad) console.error(`  ${label} says ${v} · ${b}`);
console.error(`  the changelog says ${want.version} · ${want.build}`);
console.error("\nset VERSION and BUILD in design_handoff_stuti/app/stuti-build.js (and rerun the port), or open the release section the work belongs to.");
process.exit(1);

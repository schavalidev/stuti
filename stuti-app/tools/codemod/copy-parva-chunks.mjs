#!/usr/bin/env node
/* ============================================================
   The parva stories and the kriyā-mantras, copied where the app can
   fetch them.

   These two bodies of text are too large to parse before the first
   screen is drawn, so the design loads them a month at a time:
   stuti-parva-stories.js and stuti-parva-kriya.js hold only an index,
   and inject `parva-stories/<month>.js` the first time a reader opens
   a day in that month.

   The injection builds its path with a function, not a string
   literal, so check-data.mjs cannot see it — and a missing chunk does
   not fail loudly. The build answers any unknown path with
   index.html, so the loader gets a 200, the script fails to parse,
   the promise resolves with null, and the day simply shows no story.
   Nobody is told. That is the same trap the gazetteer fell into, and
   it is why this step both copies the chunks and refuses to pass
   unless every month the two indexes name is actually there.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const app = path.join(here, "..", "..");
const DESIGN = path.join(app, "..", "design_handoff_stuti", "app");
const PUB = path.join(app, "public");
const SRC = path.join(app, "src");

/* the month names in the order the loaders index them — read out of the
   ported module rather than repeated here, so the two cannot drift */
function monthsOf(file) {
  const t = fs.readFileSync(path.join(SRC, file), "utf8");
  const m = t.match(/const CHUNK = \(m\) =>\s*"([^"]+)\/"\s*\+\s*\[([^\]]+)\]/);
  if (!m) throw new Error(`copy-parva-chunks: no CHUNK list in ${file}`);
  const dir = m[1];
  const months = [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]);
  /* and which of them a parva actually names, since a month with no entry
     has no chunk to copy and must not be demanded */
  const used = new Set();
  const idx = t.match(/const MONTH_OF = \{([\s\S]*?)\n\s*\};/);
  if (idx) for (const x of idx[1].matchAll(/:\s*(\d+)\s*,/g)) used.add(months[Number(x[1])]);
  return { dir, months, used };
}

let copied = 0;
const missing = [];
for (const file of ["stuti-parva-stories.ts", "stuti-parva-kriya.ts"]) {
  const { dir, used } = monthsOf(file);
  fs.mkdirSync(path.join(PUB, dir), { recursive: true });
  for (const month of used) {
    const from = path.join(DESIGN, dir, `${month}.js`);
    if (!fs.existsSync(from)) { missing.push(`${dir}/${month}.js`); continue; }
    fs.copyFileSync(from, path.join(PUB, dir, `${month}.js`));
    copied++;
  }
}

if (missing.length) {
  console.error("copy-parva-chunks: the index names a month with no chunk to copy —");
  for (const m of missing) console.error(`  MISSING  design_handoff_stuti/app/${m}`);
  process.exit(1);
}
console.log(`parva chunks: ${copied} month file(s) copied into public/, where the loaders fetch them`);

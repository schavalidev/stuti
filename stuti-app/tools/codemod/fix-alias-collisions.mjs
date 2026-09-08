// A handful of files did `const Icon = window.Icon` / `const SK_CONST =
// window.SK_CONST` — a local alias that happened to reuse the global's own
// name. transform.mjs's blind `window.X -> X` replacement turns that into
// `const Icon = Icon`, a self-reference (ReferenceError: temporal dead
// zone). Found by scanning every converted file for `NAME = NAME` in a
// declarator position (see codemod notes in PLAN.md) — these four were
// the only real hits; everything else that pattern matched was a genuine
// `obj.prop = localVar` assignment. The fix is just to drop the redundant
// clause: the imported binding already has the right name in scope.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src");
const rd = (f) => readFileSync(join(OUT, f), "utf8");
const wr = (f, t) => writeFileSync(join(OUT, f), t);

const FIXES = [
  ["stuti-account.tsx", ", Icon = Icon;", ";"],
  ["stuti-dana.tsx", ", Icon = Icon;", ";"],
  ["stuti-feedback.tsx", ", Icon = Icon;", ";"],
  ["stuti-home.tsx", "SK_CONST = SK_CONST, ", ""],
];

for (const [file, from, to] of FIXES) {
  let text = rd(file);
  if (!text.includes(from)) throw new Error(`${file}: expected "${from}" not found`);
  text = text.replace(from, to);
  wr(file, text);
}

// The same collision in a newer shape: a module-local `const NAME = ...`
// that the prototype then publishes with `window.NAME = NAME`, which the
// transform turns into `export const NAME = NAME;`. Found by scanning every
// file; the fix is to export the existing binding instead of redeclaring it.
import { readdirSync } from "node:fs";
let general = 0;
for (const f of readdirSync(OUT)) {
  if (!/\.tsx?$/.test(f)) continue;
  const text = rd(f);
  const fixed = text.replace(/^export const (\w+) = \1;$/gm, (m, name) => { general++; return `export { ${name} };`; });
  if (fixed !== text) wr(f, fixed);
}

console.log("alias collisions fixed:", FIXES.length, "+ self-alias exports:", general);

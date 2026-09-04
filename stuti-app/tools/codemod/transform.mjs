// Mechanical port: window.X globals -> ES module imports/exports, in place,
// content otherwise byte-identical. Run analyze.mjs first (writes
// registry.json this reads). Six names are excluded here and hand-finished
// afterward (see fix-special-cases.mjs / PLAN.md): STUTI_NAMES and
// STUTI_TEXTS_EXTRA are assembled by several files each, and
// STUTI_NITYA_AUTO/Q/SPEED + STUTI_OFFLINE are ad-hoc cross-screen flags,
// not clean single-owner exports. Left untouched here they stay valid
// `window.X` reads/writes (a real `window` exists in the WebView too), so
// skipping them is safe, not silently broken.
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ORDER } from "./order.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../../design_handoff_stuti/app");
const OUT = join(HERE, "../../src");

const { registry, importPlan } = JSON.parse(readFileSync(join(HERE, "registry.json"), "utf8"));

const SPECIAL = new Set([
  "STUTI_NAMES", "STUTI_TEXTS_EXTRA",
  "STUTI_NITYA_AUTO", "STUTI_NITYA_Q", "STUTI_NITYA_SPEED",
  "STUTI_OFFLINE",
  // only ever reached as SK_CONST.YOGA_DEVA; the one bare `window.YOGA_DEVA`
  // (a fallback in stuti-calendar.jsx) was always undefined and stays so
  "YOGA_DEVA",
]);
const MANIFEST = join(HERE, "manifest.json");
const SKIP_FILES = new Set(["stuti-boot.js"]); // no job once Vite compiles JSX at build time

function ownExportsFor(file) {
  return Object.entries(registry)
    .filter(([name, def]) => !SPECIAL.has(name) && def.allFiles.includes(file))
    .map(([name, def]) => ({ name, kind: def.kind }));
}

mkdirSync(OUT, { recursive: true });

const report = [];

for (const file of ORDER) {
  if (SKIP_FILES.has(file)) continue;
  let text;
  try { text = readFileSync(join(SRC, file), "utf8"); }
  catch (e) { report.push(`MISSING ${file}`); continue; }

  const isJsx = file.endsWith(".jsx");
  const outExt = isJsx ? ".tsx" : ".ts";
  const outName = file.replace(/\.jsx?$/, outExt);

  const ownExports = ownExportsFor(file);
  const ownNames = new Set(ownExports.map((e) => e.name));

  // 1) definition-site rewrites: window.NAME = EXPR  ->  export const NAME = EXPR
  for (const { name, kind } of ownExports) {
    if (kind !== "assign") continue;
    const re = new RegExp(`^([ \\t]*)window\\.${name}(\\s*=(?!=))`, "m");
    if (!re.test(text)) { report.push(`WARN ${file}: expected assign site for ${name} not found`); continue; }
    text = text.replace(re, `$1export const ${name}$2`);
  }

  // Object.assign(window, { A, B, pub: local }); -> export { A, B, local as pub };
  // Global, since stuti-panchanga.jsx has two separate calls. An entry whose
  // value is itself an object literal (`SK_CONST: { ... }`) doesn't fit an
  // export list at all — that call is left untouched here and rewritten by
  // fix-hand-patches.mjs into a real `export const`.
  text = text.replace(/Object\.assign\(window,\s*\{([\s\S]*?)\}\)\s*;?/g, (whole, inner) => {
    if (inner.includes("{")) return whole;
    const entries = inner.split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
      const [pub, local] = s.split(":").map((x) => x.trim());
      return local ? { pub, local } : { pub, local: pub };
    }).filter((e) => !SPECIAL.has(e.pub));
    if (!entries.length) return "";
    return `export { ${entries.map((e) => (e.local === e.pub ? e.pub : `${e.local} as ${e.pub}`)).join(", ")} };`;
  });

  // 2) cross-file usages: window.NAME -> NAME, collecting what to import
  const importsBySource = {};
  const plan = importPlan[file] || {};
  for (const [sourceFile, names] of Object.entries(plan)) {
    for (const name of names) {
      if (SPECIAL.has(name)) continue;
      (importsBySource[sourceFile] ||= new Set()).add(name);
      text = text.replace(new RegExp(`\\bwindow\\.${name}\\b`, "g"), name);
    }
  }

  // 3) self-references to this file's own exports elsewhere in the file
  for (const name of ownNames) {
    text = text.replace(new RegExp(`\\bwindow\\.${name}\\b`, "g"), name);
  }

  // 4) header: React import for jsx (code uses React.foo as a real value,
  // not just JSX sugar) + one import per source file this one draws from
  let header = "";
  if (isJsx) header += `import React from "react";\n`;
  for (const sourceFile of Object.keys(importsBySource).sort()) {
    const names = [...importsBySource[sourceFile]].sort();
    const importFrom = "./" + sourceFile.replace(/\.jsx?$/, "");
    header += `import { ${names.join(", ")} } from "${importFrom}";\n`;
  }
  if (header) text = header + "\n" + text;

  writeFileSync(join(OUT, outName), text);
}

// A source file the designer removed leaves its old module behind otherwise.
// Remember what was generated; on the next run, delete anything that no
// longer has a source (including the `-core` rename fix-name-collisions.mjs
// may have given it). Hand-authored files in src/ are never touched.
const nowBases = ORDER.filter((f) => !SKIP_FILES.has(f)).map((f) => f.replace(/\.jsx?$/, ""));
let prevBases = [];
try { prevBases = JSON.parse(readFileSync(MANIFEST, "utf8")); } catch (e) { /* first run */ }
let stale = 0;
for (const base of prevBases) {
  if (nowBases.includes(base)) continue;
  for (const ext of [".ts", ".tsx", "-core.ts"]) {
    try { unlinkSync(join(OUT, base + ext)); stale++; } catch (e) { /* not there */ }
  }
}
writeFileSync(MANIFEST, JSON.stringify(nowBases, null, 2) + "\n");

console.log(report.length ? report.join("\n") : "no warnings");
console.log("wrote", nowBases.length, "modules to", OUT, stale ? `(removed ${stale} stale)` : "");

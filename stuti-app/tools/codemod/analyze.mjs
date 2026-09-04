// Builds a registry of every `window.X` the prototype defines and uses,
// across every file, in Stuti.html's load order. Read-only: writes a JSON
// report to tools/codemod/registry.json for review before any file is
// touched. See design_handoff_stuti/README.md for the load-order rationale.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ORDER } from "./order.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../../design_handoff_stuti/app");

// Browser/DOM/CDN globals the app reads off `window` but never defines itself.
// Usages of these stay bare `window.X` (or a runtime shim) rather than becoming
// an import.
const NATIVE = new Set([
  "location","navigator","localStorage","sessionStorage","fetch","history",
  "innerWidth","innerHeight","matchMedia","requestAnimationFrame","cancelAnimationFrame",
  "setTimeout","clearTimeout","setInterval","clearInterval","dispatchEvent",
  "addEventListener","removeEventListener","getComputedStyle","scrollTo","scrollY","scrollX",
  "open","alert","confirm","prompt","crypto","performance","devicePixelRatio","Image",
  "URL","URLSearchParams","Notification","caches","AbortController","React","ReactDOM",
  "Babel","StutiBoot","dataLayer","gtag","visualViewport","speechSynthesis",
  "SpeechRecognition","webkitSpeechRecognition","MediaRecorder","DeviceOrientationEvent",
  "ononline","onoffline","onresize","onscroll","print","top","self","parent","frames",
  "__theme", // debug hook, write-only
  "AudioContext","webkitAudioContext","Intl","focus",
  // ad-hoc cross-screen signalling (Home <-> Reader "next up" queue), not a
  // module export — ported to a tiny shared store instead, see PLAN.md
  "STUTI_NITYA_AUTO","STUTI_NITYA_Q","STUTI_NITYA_SPEED",
]);

const defines = new Map(); // name -> [{file, kind}]
const usesByFile = new Map(); // file -> Set(name)
const missing = [];

for (const file of ORDER) {
  let text;
  try { text = readFileSync(join(SRC, file), "utf8"); }
  catch (e) { missing.push(file); continue; }

  const uses = new Set();
  for (const m of text.matchAll(/window\.(\w+)/g)) uses.add(m[1]);
  usesByFile.set(file, uses);

  for (const m of text.matchAll(/^[ \t]*window\.(\w+)\s*=(?!=)/gm)) {
    const name = m[1];
    if (!defines.has(name)) defines.set(name, []);
    defines.get(name).push({ file, kind: "assign" });
  }
  // accumulator idiom: (window.X = window.X || []).push(...) / || {}
  for (const m of text.matchAll(/\(\s*window\.(\w+)\s*=\s*window\.\1\s*\|\|/g)) {
    const name = m[1];
    if (!defines.has(name)) defines.set(name, []);
    defines.get(name).push({ file, kind: "accumulator" });
  }
  const tailMatches = [...text.matchAll(/Object\.assign\(window,\s*\{([\s\S]*?)\}\)/g)];
  for (const tm of tailMatches) {
    const names = tm[1].split(",").map((s) => s.trim()).filter(Boolean)
      .map((s) => s.split(":")[0].trim()) // handle `{ Foo: Bar }` just in case
      .filter((s) => /^\w+$/.test(s));
    for (const name of names) {
      if (!defines.has(name)) defines.set(name, []);
      defines.get(name).push({ file, kind: "objassign" });
    }
  }
}

// name -> single definer (first in load order; load order IS definition order
// for a global, so "first" here is also "only" for anything not reassigned)
const registry = {};
const conflicts = [];
for (const [name, defs] of defines) {
  const files = [...new Set(defs.map((d) => d.file))];
  if (files.length > 1) conflicts.push({ name, files });
  registry[name] = { file: files[0], kind: defs[0].kind, allFiles: files };
}

// names used somewhere but defined nowhere in the app -> should be in NATIVE;
// anything left over here is worth a human look
const allUsed = new Set();
for (const s of usesByFile.values()) for (const n of s) allUsed.add(n);
const undefinedUses = [...allUsed].filter((n) => !registry[n] && !NATIVE.has(n)).sort();

// per-file import plan: for each file, which OTHER files it needs to import from
const importPlan = {};
for (const file of ORDER) {
  const uses = usesByFile.get(file) || new Set();
  const ownDefs = new Set(
    [...defines.entries()].filter(([, defs]) => defs.some((d) => d.file === file)).map(([n]) => n)
  );
  const needed = [...uses].filter((n) => !ownDefs.has(n) && !NATIVE.has(n) && registry[n]);
  const byFile = {};
  for (const n of needed) {
    const from = registry[n].file;
    if (from === file) continue; // defined earlier in a PREVIOUS pass isn't possible here; guards self-ref
    (byFile[from] ||= []).push(n);
  }
  importPlan[file] = byFile;
}

writeFileSync(
  join(HERE, "registry.json"),
  JSON.stringify({ registry, conflicts, undefinedUses, missing, importPlan }, null, 2)
);

console.log("files processed:", ORDER.length - missing.length, "missing:", missing);
console.log("total globals defined:", Object.keys(registry).length);
console.log("conflicts (defined in >1 file):", conflicts.length);
for (const c of conflicts) console.log("  ", c.name, "->", c.files);
console.log("used-but-undefined (should be NATIVE or a bug):", undefinedUses.length);
for (const n of undefinedUses) console.log("  ", n);

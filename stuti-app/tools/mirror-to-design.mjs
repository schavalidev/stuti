#!/usr/bin/env node
// Carries what was built in code back into the design prototype.
//
// The port runs one way: design -> src. Everything added on the code side —
// Follow and the recording of a recitation, the repaired Record & compare,
// the search that reads words, the latch that keeps its focus, the cue that
// opens its hymn, the vrata and pañcāṅga memos — therefore existed only in
// the app, and the designer's prototype went on showing a reader without a
// Record chip. This script closes that loop, and does it from the same
// sources the app is built from, so the two cannot say different things:
//
//   1. the hand-authored modules a browser can run are turned back into the
//      prototype's dialect (types off, imports and exports to window, one
//      IIFE so no top-level name can collide) and written beside her files;
//   2. the seams' own patch lists are applied to her .js/.jsx, in "design"
//      mode (codemod/seam-lib.mjs) — the very anchors the port uses;
//   3. the marked parts of src/stuti-app.css become stuti-code.css;
//   4. the pages load the new files.
//
// Every step is idempotent: run it on a tree that already has the work and
// nothing changes. What cannot be carried — Vosk, files on the phone, the
// relay, the account, the OS bell — is answered by mirror/stuti-native.js.
//
//   node tools/mirror-to-design.mjs <dir with the design's app files> [--check]
//
// --check writes nothing and exits 1 if anything would change.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { applyRecord, applyReader } from "./codemod/fix-record-seam.mjs";
import { applyFollow } from "./codemod/fix-follow-seam.mjs";
import { applyMain as applySearchMain, applyVoice } from "./codemod/fix-search-seam.mjs";
import { applyGate } from "./codemod/fix-gate-seam.mjs";
import { applyStore, applyMain as applyLinkMain, applyWideMain } from "./codemod/fix-deeplink-seam.mjs";
import { applyVrataData, applyEngine } from "./codemod/fix-perf-seam.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../src");
const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const DIR = args.find((a) => !a.startsWith("--"));
if (!DIR || !existsSync(join(DIR, "Stuti.html"))) { console.error("usage: mirror-to-design.mjs <dir holding Stuti.html> [--check]"); process.exit(2); }

const MIRRORED = JSON.parse(readFileSync(join(HERE, "codemod/mirrored.json"), "utf8"));
const changed = [];
function put(name, text) {
  const file = join(DIR, name);
  const had = existsSync(file) ? readFileSync(file, "utf8") : null;
  if (had === text) return;
  changed.push((had === null ? "new      " : "changed  ") + name);
  if (!CHECK) writeFileSync(file, text);
}

/* ---------- 1. modules ---------- */
const MODULES = [
  { src: "stuti-follow-engine.ts", out: "stuti-follow-engine.js" },
  { src: "stuti-search-match.ts", out: "stuti-search-match.js" },
  /* main.tsx registers the kept recitations once the app is up; the prototype has no main */
  { src: "stuti-recitations.ts", out: "stuti-recitations.js", tail: "registerKept();" },
  { src: "stuti-follow.tsx", out: "stuti-follow.jsx" },
];
const stubText = readFileSync(join(HERE, "mirror/stuti-native.js"), "utf8");
const models = /export const VOSK_MODELS = (\{[\s\S]*?\n\}) as const;/.exec(readFileSync(join(SRC, "stuti-vosk.ts"), "utf8"));
if (!models) throw new Error("mirror: VOSK_MODELS not found in stuti-vosk.ts");
const native = stubText.replace("/*@VOSK_MODELS@*/", "VOSK_MODELS: " + models[1].replace(/\n/g, "\n    ") + ",");
const stubNames = new Set([...native.matchAll(/^\s{4}(\w+):/gm)].map((m) => m[1]));

/* every name the prototype hands around on window */
const designGlobals = new Set();
for (const f of readdirSync(DIR)) {
  if (!/\.jsx?$/.test(f) || MIRRORED.includes(f)) continue;
  const t = readFileSync(join(DIR, f), "utf8");
  for (const m of t.matchAll(/^[ \t]*window\.(\w+)\s*=(?!=)/gm)) designGlobals.add(m[1]);
  for (const m of t.matchAll(/Object\.assign\(window,\s*\{([\s\S]*?)\}\)/g)) m[1].split(",").forEach((s) => { const n = s.split(":")[0].trim(); if (/^\w+$/.test(n)) designGlobals.add(n); });
}

const exportsOf = {};
const built = {};
for (const mod of MODULES) {
  const source = readFileSync(join(SRC, mod.src), "utf8");
  const isX = mod.src.endsWith(".tsx");
  let js = ts.transpileModule(source, {
    fileName: mod.src,
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.Preserve, removeComments: false, newLine: ts.NewLineKind.LineFeed },
  }).outputText;
  const wants = [];   // [name, from]
  js = js.replace(/^import\s+([\s\S]*?)\s+from\s+"([^"]+)";?[ \t]*\n/gm, (whole, what, from) => {
    if (from === "react") return "";
    const named = /^\{([\s\S]*)\}$/.exec(what.trim());
    if (!named) throw new Error(`mirror: ${mod.src} has an import this script cannot carry: ${whole.trim()}`);
    for (const part of named[1].split(",").map((s) => s.trim()).filter(Boolean)) {
      if (/\sas\s/.test(part)) throw new Error(`mirror: ${mod.src} renames an import (${part}); the prototype has only one name per thing`);
      wants.push([part, from]);
    }
    return "";
  });
  if (/^\s*import\s/m.test(js)) throw new Error(`mirror: an import survived in ${mod.src}`);
  const names = [];
  js = js.replace(/^export\s+(async\s+function|function|const|let|class)\s+(\w+)/gm, (m, kind, name) => { names.push(name); return kind + " " + name; });
  js = js.replace(/^export\s*\{\s*\};?[ \t]*\n/gm, "");
  if (/^\s*export\s/m.test(js)) throw new Error(`mirror: an export survived in ${mod.src}`);
  exportsOf[mod.src.replace(/\.tsx?$/, "")] = names;
  built[mod.out] = { mod, js, names, wants, isX };
}
/* every import must land on something the prototype really has */
for (const [out, b] of Object.entries(built)) {
  for (const [name, from] of b.wants) {
    const base = from.replace(/^\.\//, "");
    const ok = (exportsOf[base] && exportsOf[base].includes(name)) || stubNames.has(name) || designGlobals.has(name);
    if (!ok) throw new Error(`mirror: ${out} needs ${name} (from ${from}) and the prototype has no such global — mirror that module too, or add it to mirror/stuti-native.js`);
  }
  for (const name of b.names) {
    if (designGlobals.has(name)) throw new Error(`mirror: ${out} would put ${name} on window, and the design already has one`);
  }
}
for (const [out, b] of Object.entries(built)) {
  const head = `/* ============================================================
   Carried from the app's code: stuti-app/src/${b.mod.src}
   Written by stuti-app/tools/mirror-to-design.mjs. Do not edit this copy —
   the next run overwrites it. Change the source, then run the script.
   The port skips this file (stuti-app/tools/codemod/mirrored.json): the
   app is built from the source, not from here.
   ============================================================ */
`;
  const tail = `\nObject.assign(window, { ${b.names.join(", ")} });\n` + (b.mod.tail ? `try { ${b.mod.tail} } catch (e) {}\n` : "");
  put(out, head + "(function () {\n" + b.js.trimEnd() + "\n" + tail + "})();\n");
}
put("stuti-native.js", native);

/* ---------- 2. the seams, on her own files ---------- */
const SEAMS = [
  ["stuti-reader.jsx", [applyFollow, applyReader]],       // the pipeline's order: follow, then record
  ["stuti-record.jsx", [applyRecord]],
  ["stuti-gate.jsx", [applyGate]],
  ["stuti-main.jsx", [(t, m) => applySearchMain(t, m).text, applyLinkMain]],
  ["stuti-voice.jsx", [applyVoice]],
  ["stuti-store.js", [applyStore]],
  ["stuti-wide-main.jsx", [applyWideMain]],
  ["stuti-vrata-data.js", [applyVrataData]],
  ["stuti-panchanga-engine.js", [applyEngine]],
];
for (const [name, fns] of SEAMS) {
  let t = readFileSync(join(DIR, name), "utf8");
  for (const fn of fns) t = fn(t, "design");
  put(name, t);
}

/* ---------- 3. the stylesheet ---------- */
{
  const css = readFileSync(join(SRC, "stuti-app.css"), "utf8");
  const parts = [...css.matchAll(/\/\* @design:begin[^\n]*\*\/\n([\s\S]*?)\/\* @design:end \*\/\n/g)].map((m) => m[1].trimEnd());
  if (!parts.length) throw new Error("mirror: no @design sections in stuti-app.css");
  put("stuti-code.css", `/* ============================================================
   Carried from the app's code: the marked sections of
   stuti-app/src/stuti-app.css. Written by stuti-app/tools/mirror-to-design.mjs.
   Do not edit this copy — change the source, then run the script.
   (The app's system-bar insets are not here: a browser tab has no bars.)
   ============================================================ */

` + parts.join("\n\n") + "\n");
}

/* ---------- 4. the pages ---------- */
const PAGES = ["Stuti.html", "Stuti-Tablet-Desktop.html", "Stuti - Tablet & Desktop.html"].filter((p) => existsSync(join(DIR, p)));
for (const page of PAGES) {
  let h = readFileSync(join(DIR, page), "utf8");
  if (!h.includes(`href="stuti-code.css"`)) {
    const links = [...h.matchAll(/<link rel="stylesheet" href="stuti[^"]*\.css" \/>\n/g)];
    if (!links.length) throw new Error(`mirror: no stuti stylesheet link in ${page}`);
    const last = links[links.length - 1];
    const at = last.index + last[0].length;
    h = h.slice(0, at) + `<link rel="stylesheet" href="stuti-code.css" />\n` + h.slice(at);
  }
  const js = MIRRORED.filter((f) => f.endsWith(".js") && !h.includes(`src="${f}"`));
  if (js.length) {
    const anchor = `<script src="stuti-audio.js"></script>\n`;   // the recitations register with STUTI_AUDIO
    if (!h.includes(anchor)) throw new Error(`mirror: ${page} does not load stuti-audio.js where expected`);
    h = h.replace(anchor, anchor + js.map((f) => `<script src="${f}"></script>\n`).join(""));
  }
  for (const f of MIRRORED.filter((x) => x.endsWith(".jsx"))) {
    if (h.includes(`"${f}"`)) continue;
    const m = /^([ \t]*)"stuti-reader\.jsx",?[ \t]*\n/m.exec(h);
    if (!m) throw new Error(`mirror: ${page} does not list stuti-reader.jsx where expected`);
    h = h.slice(0, m.index) + `${m[1]}"${f}",\n` + h.slice(m.index);
  }
  put(page, h);
}

/* ---------- 5. nothing written may fail to parse ---------- */
let bad = 0;
for (const name of [...Object.keys(built), "stuti-native.js", ...SEAMS.map((s) => s[0])]) {
  const file = join(DIR, name);
  if (!existsSync(file)) continue;   // --check on a tree that lacks it
  const out = ts.transpileModule(readFileSync(file, "utf8"), { fileName: name, reportDiagnostics: true, compilerOptions: { allowJs: true, jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2020 } });
  const errs = (out.diagnostics || []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  for (const d of errs) { bad++; console.error(`parse: ${name}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`); }
}
if (bad) process.exit(1);

console.log(changed.length ? changed.join("\n") : "design already carries everything");
if (CHECK && changed.length) process.exit(1);

// transform.mjs only caught cross-file references written as `window.X`.
// The prototype's script-tag architecture also let files see each OTHER's
// top-level `function`/`const` declarations as bare identifiers (one
// shared global scope — see stuti-boot.js's own comment on this) — most
// visibly every screen using <Icon/>, <Seal/>, <Flame/> etc. from
// stuti-icons.jsx without ever writing `window.Icon`. tsc's "Cannot find
// name" errors are a reliable, precise signal for exactly these: run
// `tsc --noEmit`, and for every TS2304 whose name IS in the registry
// (i.e. some other file really does export it), add the import.
//
// Usage: node fix-missing-imports.mjs [path-to-tsc-log]
// If no log path given, runs tsc itself first.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { execFileSync as exec } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "../..");
const OUT = join(APP, "src");
const { registry } = JSON.parse(readFileSync(join(HERE, "registry.json"), "utf8"));

let log;
const logPathArg = process.argv[2];
if (logPathArg) {
  log = readFileSync(logPathArg, "utf8");
} else {
  try {
    log = exec("npx", ["tsc", "--noEmit", "-p", "tsconfig.app.json"], { cwd: APP, encoding: "utf8" });
  } catch (e) {
    log = e.stdout || "";
  }
}

/* Before reading tsc: `window.NAME` reads of a plain function that another
   generated file defines at top level (kpArmReminders in stuti-keep.jsx, read
   by stuti-tithis.jsx). The prototype shared them through script scope; here
   the owner exports the name, the reader imports it, and the window goes. */
{
  const files = readdirSync(OUT).filter((f) => /\.tsx?$/.test(f));
  const owners = {};
  for (const f of files) {
    const t = readFileSync(join(OUT, f), "utf8");
    for (const m of t.matchAll(/^(?:export )?(?:function|const|let) ([A-Za-z_]\w*)\b/gm)) (owners[m[1]] ||= new Set()).add(f);
  }
  let rewired = 0;
  for (const f of files) {
    let t = readFileSync(join(OUT, f), "utf8");
    const names = new Set([...t.matchAll(/\bwindow\.([A-Za-z_]\w*)\b/g)].map((m) => m[1]).filter((n) => !registry[n] && owners[n] && owners[n].size === 1 && !owners[n].has(f)));
    if (!names.size) continue;
    for (const n of names) {
      const owner = [...owners[n]][0];
      const op = join(OUT, owner);
      let ot = readFileSync(op, "utf8");
      if (!new RegExp(`^export (?:function|const|let) ${n}\\b|^export \\{[^}]*\\b${n}\\b`, "m").test(ot)) writeFileSync(op, ot + `\nexport { ${n} };\n`);
      t = t.replace(new RegExp(`\\bwindow\\.${n}\\b`, "g"), n);
      t = `import { ${n} } from "./${owner.replace(/\.tsx?$/, "")}";\n` + t;
      rewired++;
    }
    writeFileSync(join(OUT, f), t);
  }
  if (rewired) console.log("window reads rewired to imports:", rewired);
}

const RE = /^src[\\/](.+?)\((\d+),(\d+)\): error TS2304: Cannot find name '([^']+)'\./gm;
const missingByFile = {}; // file -> Set(name)
let m, total = 0, unresolved = new Set();
while ((m = RE.exec(log))) {
  const [, file, , , name] = m;
  let def = registry[name];
  if (!def) {
    /* not a window global: a plain top-level function or const that the
       prototype shared through script scope (planVerseText in stuti-plans.jsx,
       used by stuti-plan-sitting.jsx). Find its one definition among the
       generated files, export it there, and import it here. */
    const owners = readdirSync(OUT).filter((f) => /\.tsx?$/.test(f) && f !== file && new RegExp(`^(?:export )?(?:function|const|let) ${name}\\b`, "m").test(readFileSync(join(OUT, f), "utf8")));
    if (owners.length !== 1) { unresolved.add(`${file}: ${name}`); continue; }
    const op = join(OUT, owners[0]);
    let ot = readFileSync(op, "utf8");
    if (!new RegExp(`^export (?:function|const|let) ${name}\\b|^export \\{[^}]*\\b${name}\\b`, "m").test(ot)) writeFileSync(op, ot + `\nexport { ${name} };\n`);
    def = { file: owners[0] };
  }
  const defFile = def.file.replace(/\.(jsx?|tsx?)$/, "");
  const thisFile = file.replace(/\.tsx?$/, "");
  if (defFile === thisFile) continue; // shouldn't happen, but guard
  (missingByFile[file] ||= {});
  (missingByFile[file][defFile] ||= new Set()).add(name);
  total++;
}

let filesTouched = 0;
for (const [file, bySource] of Object.entries(missingByFile)) {
  const p = join(OUT, file);
  let text = readFileSync(p, "utf8");
  for (const [sourceFile, namesSet] of Object.entries(bySource)) {
    const importFrom = "./" + sourceFile;
    const names = [...namesSet].sort();
    const existingRe = new RegExp(`^import \\{([^}]*)\\} from "${importFrom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}";$`, "m");
    const existing = text.match(existingRe);
    if (existing) {
      const current = existing[1].split(",").map((s) => s.trim()).filter(Boolean);
      const merged = [...new Set([...current, ...names])].sort();
      text = text.replace(existingRe, `import { ${merged.join(", ")} } from "${importFrom}";`);
    } else {
      text = `import { ${names.join(", ")} } from "${importFrom}";\n` + text;
    }
  }
  writeFileSync(p, text);
  filesTouched++;
}

console.log("resolved:", total, "across", filesTouched, "files");
console.log("unresolved (need a manual look):", unresolved.size);
for (const u of unresolved) console.log("  ", u);
if (unresolved.size) { console.error("fix-missing-imports: an unresolved name is a ReferenceError at runtime — port it before shipping"); process.exit(1); }

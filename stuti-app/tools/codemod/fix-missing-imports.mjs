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
import { readFileSync, writeFileSync } from "node:fs";
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

const RE = /^src[\\/](.+?)\((\d+),(\d+)\): error TS2304: Cannot find name '([^']+)'\./gm;
const missingByFile = {}; // file -> Set(name)
let m, total = 0, unresolved = new Set();
while ((m = RE.exec(log))) {
  const [, file, , , name] = m;
  const def = registry[name];
  if (!def) { unresolved.add(`${file}: ${name}`); continue; }
  const defFile = def.file.replace(/\.jsx?$/, "");
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

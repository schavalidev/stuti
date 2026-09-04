// Seven original files share a base name across .js and .jsx (a store and
// a screen with the same name — e.g. stuti-dana.js the store, stuti-dana.jsx
// the screen). transform.mjs strips extensions when building import
// specifiers, so both collapse to "./stuti-dana" — every import meant for
// the store instead resolves (ambiguously, and in practice wrongly) to the
// screen file, including the screen importing from itself. Fix: rename each
// .js-origin file's OUTPUT to `-core`, then repoint every import of its
// names at the new path.
import { readFileSync, writeFileSync, renameSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src");
const { registry } = JSON.parse(readFileSync(join(HERE, "registry.json"), "utf8"));

const BASES = ["stuti-dana", "stuti-flyleaf", "stuti-keep", "stuti-ledger", "stuti-limits", "stuti-prep", "stuti-sandhya"];

// name -> which side of the collision it belongs to, per base
const jsNamesByBase = {};
for (const base of BASES) {
  jsNamesByBase[base] = new Set(
    Object.entries(registry).filter(([, def]) => def.file === base + ".js").map(([n]) => n)
  );
}

for (const base of BASES) {
  renameSync(join(OUT, base + ".ts"), join(OUT, base + "-core.ts"));
}

let filesTouched = 0, linesRewritten = 0;
for (const file of readdirSync(OUT)) {
  if (!/\.(ts|tsx)$/.test(file)) continue;
  const p = join(OUT, file);
  let text = readFileSync(p, "utf8");
  let changed = false;

  for (const base of BASES) {
    const re = new RegExp(`^import \\{([^}]*)\\} from "\\./${base}";$`, "gm");
    text = text.replace(re, (whole, inner) => {
      const names = inner.split(",").map((s) => s.trim()).filter(Boolean);
      const toCore = names.filter((n) => jsNamesByBase[base].has(n));
      const toScreen = names.filter((n) => !jsNamesByBase[base].has(n));
      if (!toCore.length) return whole; // nothing to redirect
      changed = true;
      linesRewritten++;
      const lines = [];
      if (toCore.length) lines.push(`import { ${toCore.sort().join(", ")} } from "./${base}-core";`);
      if (toScreen.length) lines.push(`import { ${toScreen.sort().join(", ")} } from "./${base}";`);
      return lines.join("\n");
    });
  }

  if (changed) { writeFileSync(p, text); filesTouched++; }
}

console.log("renamed", BASES.length, "files to -core; rewrote", linesRewritten, "import lines across", filesTouched, "files");

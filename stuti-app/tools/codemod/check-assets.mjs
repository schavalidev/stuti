// Every picture the ported code names must actually be in public/.
//
// The pipeline generates src/ and nothing else: the emblems, the parva cards
// and the icons are copied into public/ by hand and shrunk by
// tools/optimize-emblems.sh. So a design update that adds a painting ports
// cleanly, builds cleanly, and then shows an empty circle on the shelf — which
// is how ganesha-portrait-v4, pitr-face-colour and nadi-face-colour reached a
// beta. Nothing said a word; the file was simply not there.
//
// This says it, at the end of the port, and names the copy to take and the
// script that shrinks it. It fails the run: an emblem missing here is missing
// in the APK too.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");
const PUBLIC = join(HERE, "../../public");
const DESIGN = join(HERE, "../../../design_handoff_stuti/app");

const FOLDERS = "(?:emblems|assets|icons)";
/* a quoted path under one of the folders public/ serves */
const FILE = new RegExp(`["'(\`](${FOLDERS}/[A-Za-z0-9._/-]+\\.(?:png|jpg|jpeg|svg|webp|avif))`, "g");
/* and the same without an ending: a seal is named by its stem, and the
   -day / -night / -colour / -ink ending is added in the markup (stuti-icons.tsx) */
const STEM = new RegExp(`["'(\`](${FOLDERS}/[A-Za-z0-9._-]+)["'\`]`, "g");

const files = new Map(), stems = new Map();
for (const f of readdirSync(SRC)) {
  if (!/\.(ts|tsx|css)$/.test(f)) continue;
  const text = readFileSync(join(SRC, f), "utf8");
  for (const m of text.matchAll(FILE)) if (!files.has(m[1])) files.set(m[1], f);
  for (const m of text.matchAll(STEM)) if (!/\.[a-z0-9]+$/i.test(m[1]) && !stems.has(m[1])) stems.set(m[1], f);
}

/* a stem stands for a family of files; one of the family being there is the test */
const family = (stem) => {
  const dir = join(PUBLIC, dirname(stem)), base = stem.slice(stem.lastIndexOf("/") + 1);
  return existsSync(dir) && readdirSync(dir).some((n) => n === base || n.startsWith(base + "-") || n.startsWith(base + "."));
};

const missing = [
  ...[...files].filter(([p]) => !existsSync(join(PUBLIC, p))),
  ...[...stems].filter(([p]) => !family(p)).map(([p, f]) => [p + "-*.png", f]),
];

if (!missing.length) {
  console.log(`assets: all ${files.size + stems.size} named pictures are in public/`);
  process.exit(0);
}

console.error(`assets: ${missing.length} picture(s) the ported code names are not in public/:`);
for (const [p, f] of missing) {
  const from = existsSync(join(DESIGN, p)) ? "design_handoff_stuti/app/" + p : "not in the design either — ask the designer";
  console.error(`  public/${p}\n      named by src/${f}\n      take it from ${from}`);
}
console.error("\nthen shrink them: stuti-app/tools/optimize-emblems.sh (it needs ImageMagick)");
process.exit(1);

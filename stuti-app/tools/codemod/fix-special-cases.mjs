// Hand-scoped patches for the names transform.mjs deliberately skipped.
// Idempotent-ish: re-running after a fresh transform.mjs pass is the
// expected workflow (transform.mjs always regenerates src/ from source).
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src");
const rd = (f) => readFileSync(join(OUT, f), "utf8");
const wr = (f, t) => writeFileSync(join(OUT, f), t);

// ---------- STUTI_NAMES: stuti-names-{vishnu,lalita,ganesha}.ts ----------
const NAMES_FILES = [
  ["stuti-names-vishnu.ts", "vishnu"],
  ["stuti-names-lalita.ts", "lalita"],
  ["stuti-names-ganesha.ts", "ganesha"],
];
for (const [file, key] of NAMES_FILES) {
  let text = rd(file);
  text = text.replace(/^window\.STUTI_NAMES=window\.STUTI_NAMES\|\|\{\};\n/m, "");
  const m = text.match(/window\.STUTI_NAMES\.(\w+)\s*=\s*([\s\S]*?);?\s*$/);
  if (!m) throw new Error(`STUTI_NAMES pattern not found in ${file}`);
  if (m[1] !== key) throw new Error(`expected key ${key} in ${file}, found ${m[1]}`);
  text = text.slice(0, m.index) + `export const ${key} = ` + m[2] + ";\n";
  wr(file, text);
}
wr(
  "stuti-names.ts",
  `// Aggregates the sahasranāma name-lists, each shipped as its own module
// (see design_handoff_stuti/README.md — these three used to merge onto a
// shared window.STUTI_NAMES object at load time).
import { vishnu } from "./stuti-names-vishnu";
import { lalita } from "./stuti-names-lalita";
import { ganesha } from "./stuti-names-ganesha";

export const STUTI_NAMES = { vishnu, lalita, ganesha };
`
);
for (const file of ["stuti-hindi-names-lalita.ts", "stuti-hindi-names-vishnu.ts", "stuti-lexicon.ts"]) {
  let text = rd(file);
  if (!text.includes('from "./stuti-names"')) {
    text = `import { STUTI_NAMES } from "./stuti-names";\n` + text;
  }
  text = text.replace(/\bwindow\.STUTI_NAMES\b/g, "STUTI_NAMES");
  wr(file, text);
}

// ---------- STUTI_TEXTS_EXTRA: 26 stuti-text-*.ts contributor files ----------
const EXTRA_FILES = [
  "stuti-text-ganesha","stuti-text-ganesha2","stuti-text-ganesha3","stuti-text-ganesha4",
  "stuti-text-guru","stuti-text-guru2",
  "stuti-text-subrahmanya","stuti-text-subrahmanya2","stuti-text-subrahmanya3","stuti-text-subrahmanya4",
  "stuti-text-subrahmanya5","stuti-text-subrahmanya6","stuti-text-subrahmanya7","stuti-text-subrahmanya8",
  "stuti-text-subrahmanya9","stuti-text-subrahmanya10",
  "stuti-text-shiva","stuti-text-shiva2","stuti-text-shiva3",
  "stuti-text-devi","stuti-text-devi2","stuti-text-devi3","stuti-text-devi4",
  "stuti-text-vishnu","stuti-text-vishnu2","stuti-text-hanuman",
];
// `.push(a, b, ...)` takes any number of arguments — most files push one
// catalog entry, but at least one (stuti-text-devi) pushes two in the same
// call. Wrapping the captured argument list in `[...]` handles either
// case uniformly: `extra` is always an array now, spread into the
// aggregate below instead of listed as one item per file.
const RE_PUSH = /\(\s*window\.STUTI_TEXTS_EXTRA\s*=\s*window\.STUTI_TEXTS_EXTRA\s*\|\|\s*\[\]\s*\)\.push\(\s*([\s\S]*?)\s*\);?\s*$/;
for (const base of EXTRA_FILES) {
  const file = base + ".ts";
  let text = rd(file);
  const m = text.match(RE_PUSH);
  if (!m) throw new Error(`STUTI_TEXTS_EXTRA push pattern not found in ${file}`);
  text = text.slice(0, m.index) + "export const extra = [" + m[1] + "];\n";
  wr(file, text);
}
const alias = (base) => "x_" + base.replace(/^stuti-text-/, "").replace(/-/g, "_");
const extraHeader =
  `// Aggregates the "coming soon" catalog entries every deity text file\n` +
  `// contributes (each used to push one or more entries onto a shared\n` +
  `// window.STUTI_TEXTS_EXTRA array at load time — see stuti-texts.ts).\n` +
  EXTRA_FILES.map((b) => `import { extra as ${alias(b)} } from "./${b}";`).join("\n") +
  `\n\nexport const STUTI_TEXTS_EXTRA = [\n  ${EXTRA_FILES.map((b) => "..." + alias(b)).join(",\n  ")},\n];\n`;
wr("stuti-texts-extra.ts", extraHeader);

{
  let text = rd("stuti-texts.ts");
  if (!text.includes('from "./stuti-texts-extra"')) {
    text = `import { STUTI_TEXTS_EXTRA } from "./stuti-texts-extra";\n` + text;
  }
  text = text.replace(/\bwindow\.STUTI_TEXTS_EXTRA\b/g, "STUTI_TEXTS_EXTRA");
  wr("stuti-texts.ts", text);
}

console.log("special cases patched: STUTI_NAMES (4 files + 3 consumers), STUTI_TEXTS_EXTRA (27 files + 1 consumer)");

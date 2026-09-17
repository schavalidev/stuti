// Google Fonts, served from the app (tools/fonts-local.mjs wrote public/fonts/google/).
// A request to fonts.googleapis.com hands the reader's IP to Google, which GDPR
// treats as personal data sent without consent; the local copy also works offline.
// index.html (hand-authored) links fonts.css; this removes the design's @import
// and repoints the two print windows, which are about:blank documents and so
// need the app's origin spelled out. Literal anchors; a moved one fails here.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src/");
if (!existsSync(join(HERE, "../../public/fonts/google/fonts.css"))) throw new Error("fix-local-fonts: run node tools/fonts-local.mjs first");

function edit(file, fn) {
  const F = SRC + file; const before = readFileSync(F, "utf8"); const after = fn(before);
  if (after === before) throw new Error(`fix-local-fonts: nothing replaced in ${file}`);
  writeFileSync(F, after);
}
edit("stuti.css", (t) => t.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?[^']+'\);\n?/, "/* Google Fonts: served locally, linked from index.html (fix-local-fonts.mjs) */\n"));
const PRINT = `'<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Mukta:wght@400;600&family=Noto+Sans+Devanagari&family=Noto+Sans+Telugu&display=swap" rel="stylesheet">'`;
const LOCAL = `'<link href="' + location.origin + '/fonts/google/fonts.css" rel="stylesheet">'`;
for (const f of ["stuti-prep.tsx", "stuti-share.tsx"]) edit(f, (t) => t.split(PRINT).join(LOCAL));
console.log("local fonts applied");

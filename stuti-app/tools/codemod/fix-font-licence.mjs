// Two bundled typefaces that may not be distributed, found 27 Oct 2026 (S83)
// while preparing public/legal/attributions.html, which meant reading every
// font's own name table rather than trusting the file names:
//
//   SangamSans  — no copyright, no licence, no vendor, no designer. Nothing.
//   KanakaDurga — "This font is copyright of Purushoth Kumar Guthula"
//                 (telugufonts.in, 2017), and no grant of any kind.
//
// A copyright notice with no licence is a reservation of rights, and a font
// with no notice at all cannot be credited, so neither may go into a public
// build. Removing the @font-face is what keeps them out: Vite emits a font
// file into dist only where a stylesheet references it, so the declaration —
// not the token — is what puts the bytes in the APK.
//
// KanakaDurga was already named by no token, so it costs nothing. SangamSans
// led --font-telugu-serif and sat second in --font-display, so this also takes
// it out of both; what each token already names next is Tiro Telugu and Noto
// Serif, both bundled and both under an open licence. The files stay in
// src/fonts, so if a licence turns up this step comes out and nothing else.
//
// This has to be a codemod and not an edit: stuti.css comes from the design
// and every port overwrites it.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti.css");
let t = readFileSync(FILE, "utf8");

let gone = 0;
for (const family of ["KanakaDurga", "SangamSans"]) {
  const face = new RegExp(`@font-face \\{ font-family: '${family}';[^\\n]*\\n`, "g");
  gone += (t.match(face) || []).length;
  t = t.replace(face, "");
  /* and out of every token that named it, so no rule can reach for it */
  t = t.replace(new RegExp(`'${family}',\\s*`, "g"), "");
  t = t.replace(new RegExp(`,\\s*'${family}'`, "g"), "");
  if (t.includes(family)) {
    throw new Error(`fix-font-licence: ${family} still appears in stuti.css — a rule may still reach for an unlicensed font`);
  }
}
writeFileSync(FILE, t);
console.log(`font-licence step: removed ${gone} @font-face declarations`);

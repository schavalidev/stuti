// Every frosted surface in the app was flat, and had been since the port.
//
// The prototype writes its frosting the careful way — the standard property
// and then the vendor-prefixed one beside it:
//
//     backdrop-filter: blur(10px) saturate(1.15);
//     -webkit-backdrop-filter: blur(10px) saturate(1.15);
//
// That is good hygiene in a hand-served page and wrong through this build.
// Lightning CSS knows the two names for one property, sees the same value
// declared twice, and keeps the later — the -webkit- one — as the author's
// evident choice. Chrome 148 and the Android WebView built on it do not
// support -webkit-backdrop-filter at all (CSS.supports says so), so the one
// declaration that survives is the one that does nothing: the sky plate on
// Home, the masa cards, the lens bar and the rest have been computing
// backdrop-filter: none in every build.
//
// Left to itself the minifier does the right thing — given only the standard
// property it emits both spellings, correctly ordered. So the prefixed
// declarations are stripped from the copied stylesheets here, after
// setup-entry.mjs copies them and before anything builds. Nothing is lost:
// what the prefix was for, the minifier puts back.
//
// This does not touch @supports conditions, which name the property rather
// than declaring it, and it leaves the hand-authored stuti-app.css alone —
// that file knows the rule and keeps it.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");
const SHEETS = ["stuti.css", "stuti-components.css", "stuti-palette.css", "stuti-pigment.css"];

/* a declaration, not a condition: ...;-webkit-backdrop-filter: <value>; */
const DECL = /(^|[;{\s])-webkit-backdrop-filter\s*:\s*[^;}]+;?/g;

let total = 0;
const touched = [];
for (const f of SHEETS) {
  const p = join(SRC, f);
  let css;
  try { css = readFileSync(p, "utf8"); } catch (e) { throw new Error(`fix-backdrop-prefix: ${f} is not in src/ — did setup-entry.mjs run first?`); }
  const before = (css.match(DECL) || []).length;
  if (!before) continue;
  /* keep whatever separator the declaration was sitting behind */
  css = css.replace(DECL, (m, lead) => lead || "");
  if (/-webkit-backdrop-filter\s*:/.test(css.replace(/@supports[^{]*\{/g, ""))) {
    throw new Error(`fix-backdrop-prefix: ${f} still declares -webkit-backdrop-filter after the strip`);
  }
  writeFileSync(p, css);
  total += before;
  touched.push(`${f} (${before})`);
}

/* The prototype has always written them; none at all means the stylesheets
   moved or the prefix was dropped upstream, and this step should be looked
   at rather than left running silently. */
if (!total) throw new Error("fix-backdrop-prefix: no -webkit-backdrop-filter found in any copied stylesheet — check whether this step is still needed");
console.log(`backdrop prefix stripped so the standard property survives: ${touched.join(", ")}`);

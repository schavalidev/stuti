// The privacy policy and the terms of use, reachable from Settings. The rows
// are a hand-authored component (stuti-legal-ui.tsx); this only places them in
// the About block, above the diagnostics switch, and hands them the page's own
// SetRow. Literal anchors; a moved one fails here.
//
// Both documents are law, not design: the DPDP Act and the GDPR both want the
// policy reachable by the person it describes, and until this seam existed the
// policy was served but nothing in the app pointed a reciter at it.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-settings.tsx");
let t = readFileSync(FILE, "utf8");
function patch(from, to, what) {
  if (t.includes(to)) return;                       // already placed
  if (!t.includes(from)) throw new Error(`fix-legal-seam: anchor not found — ${what}`);
  t = t.replace(from, to);
}
patch(
  `import { STUTI_BUILD } from "./stuti-build";`,
  `import { STUTI_BUILD } from "./stuti-build";\nimport { LegalRows } from "./stuti-legal-ui";`,
  "import",
);
patch(
  `              <RelayRow lang={uiLang} Row={SetRow} />`,
  `              <LegalRows lang={uiLang} Row={SetRow} />\n              <RelayRow lang={uiLang} Row={SetRow} />`,
  "the rows above the diagnostics switch",
);
writeFileSync(FILE, t);
console.log("legal seam applied");

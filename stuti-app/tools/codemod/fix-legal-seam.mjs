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

// ---- and on the first onboarding screen ----
// Settings is after the fact. India's DPDP Act wants the notice given before
// or at the time consent is sought, and the GDPR wants it at collection — and
// Stuti counts screen opens from first run, with diagnostics already on in a
// test build. So the two pages are named once, quietly, under the first
// onboarding step, where the reciter meets the app before agreeing to it.
const OB = join(HERE, "../../src/stuti-onboard.tsx");
let ob = readFileSync(OB, "utf8");
function patchOb(from, to, what) {
  if (ob.includes(to)) return;
  if (!ob.includes(from)) throw new Error(`fix-legal-seam: anchor not found in stuti-onboard — ${what}`);
  ob = ob.replace(from, to);
}
patchOb(
  `import { STUTI_COUNT } from "./stuti-count";`,
  `import { STUTI_COUNT } from "./stuti-count";\nimport { LegalNote } from "./stuti-legal-ui";`,
  "import",
);
patchOb(
  `        <div className="ob-foot">`,
  `        {i === 0 && <LegalNote lang={lang} />}\n        <div className="ob-foot">`,
  "above the onboarding footer",
);
writeFileSync(OB, ob);
console.log("legal seam: onboarding note placed");

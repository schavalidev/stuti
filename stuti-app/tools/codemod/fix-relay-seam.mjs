// The log relay's switch in Settings, under the support line: the row is a
// hand-authored component (stuti-relay-ui.tsx); this only places it and
// hands it the page's own SetRow. Literal anchor; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-settings.tsx");
let t = readFileSync(FILE, "utf8");
function patch(from, to, what) { if (!t.includes(from)) throw new Error(`fix-relay-seam: anchor not found — ${what}`); t = t.replace(from, to); }
patch(`import { STUTI_BUILD } from "./stuti-build";`, `import { STUTI_BUILD } from "./stuti-build";\nimport { RelayRow } from "./stuti-relay-ui";`, "import");
patch(`              <BuildStamp lang={lang} noReset />`, `              <RelayRow lang={uiLang} Row={SetRow} />\n              <BuildStamp lang={lang} noReset />`, "the row above the build stamp");
writeFileSync(FILE, t);
console.log("relay seam applied");

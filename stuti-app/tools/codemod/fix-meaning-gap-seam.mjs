// Meaning, turned on over a text whose meanings are not written, used to show
// a blank page. The notice is a hand-authored component
// (stuti-meaning-gap.tsx); this places it once inside the reader's scroller,
// which wraps both the verse view and the flow view, so one insertion covers
// both. Literal anchors; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-reader.tsx");
let t = readFileSync(FILE, "utf8");
function patch(from, to, what) {
  if (t.includes(to)) return;                       // already placed
  if (!t.includes(from)) throw new Error(`fix-meaning-gap-seam: anchor not found — ${what}`);
  t = t.replace(from, to);
}
patch(
  `import { STUTI_NAMES } from "./stuti-names";`,
  `import { STUTI_NAMES } from "./stuti-names";\nimport { MeaningGap } from "./stuti-meaning-gap";`,
  "import",
);
patch(
  `      <div className={"reader-scroll scroll" + (flow ? " is-flow" : "") + (hasSvara ? " rd-vedic" : "")} ref={scrollRef}>`,
  `      <div className={"reader-scroll scroll" + (flow ? " is-flow" : "") + (hasSvara ? " rd-vedic" : "")} ref={scrollRef}>\n        {showMeaning && !namaluOpen && <MeaningGap hymn={hymn} lang={lang} />}`,
  "the reader's scroller",
);
writeFileSync(FILE, t);
console.log("meaning-gap seam applied");

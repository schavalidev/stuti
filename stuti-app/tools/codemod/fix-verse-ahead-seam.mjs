// The verse view shows one śloka at a time, and a sahasranāma's śloka is
// four names, so on a phone the card filled under half the screen. The
// component (stuti-verse-ahead.tsx, hand-authored) sets the next ślokas under
// the card; this places it, on sahasranāmas and nāmāvaḷis only, and never in
// Memorise. Literal anchors; a moved one fails here. (S104, 27 Nov 2026)
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-reader.tsx");
let t = readFileSync(FILE, "utf8");
function patch(from, to, what) {
  if (t.includes(to)) return;                       // already placed
  if (!t.includes(from)) throw new Error(`fix-verse-ahead-seam: anchor not found — ${what}`);
  if (t.split(from).length !== 2) throw new Error(`fix-verse-ahead-seam: anchor not unique — ${what}`);
  t = t.replace(from, to);
}
patch(
  `import { STUTI_NAMES } from "./stuti-names";`,
  `import { STUTI_NAMES } from "./stuti-names";\nimport { VerseAhead } from "./stuti-verse-ahead";`,
  "import",
);
patch(
  `          })()}
        </div>
        )}
      </div>

      {/* Repeat mode: the your-turn strip`,
  `          })()}
          {(namavaliOnly || hymn.namesKey) && learnMode !== "memorize" && (
            <VerseAhead hymn={hymn} lines={lines} curVerse={curVerse} lang={lang}
              quiet={playing || follow.on} onPick={(i) => setActive(i)} />
          )}
        </div>
        )}
      </div>

      {/* Repeat mode: the your-turn strip`,
  "the end of the verse stage",
);
writeFileSync(FILE, t);
console.log("verse-ahead seam applied");

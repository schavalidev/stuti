// Round 2: the STUTI_NAMES contributor files also carried extra statements
// beyond their main per-deity export (a shared `.range` helper duplicated
// in vishnu+ganesha; lalita attaches two more arrays after its main object).
// fix-special-cases.mjs only handled the one main assignment per file.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src");
const rd = (f) => readFileSync(join(OUT, f), "utf8");
const wr = (f, t) => writeFileSync(join(OUT, f), t);

// Anchored on the literal statement only (not any preceding comment) —
// an earlier version of this regex reached back to the NEAREST `*/`
// before it, which for these files was the far end of the file's OWN
// header comment, and ate everything in between (the whole name list).
const RANGE_BLOCK_RE =
  /window\.STUTI_NAMES\.range = window\.STUTI_NAMES\.range \|\| function \(key, slokaN\) \{[\s\S]*?\n\};\n?/;

for (const file of ["stuti-names-vishnu.ts", "stuti-names-ganesha.ts"]) {
  let text = rd(file);
  if (!RANGE_BLOCK_RE.test(text)) throw new Error(`range block not found in ${file}`);
  text = text.replace(RANGE_BLOCK_RE, "\n");
  wr(file, text);
}

{
  let text = rd("stuti-names-lalita.ts");
  text = text.replace(/window\.STUTI_NAMES\.lalita\.slokaCounts\s*=/, "(lalita as any).slokaCounts =");
  text = text.replace(/window\.STUTI_NAMES\.lalita\.slokaLine1\s*=/, "(lalita as any).slokaLine1 =");
  wr("stuti-names-lalita.ts", text);
}

wr(
  "stuti-names.ts",
  `// Aggregates the sahasranāma name-lists, each shipped as its own module
// (see design_handoff_stuti/README.md — these three used to merge onto a
// shared window.STUTI_NAMES object at load time).
import { vishnu } from "./stuti-names-vishnu";
import { lalita } from "./stuti-names-lalita";
import { ganesha } from "./stuti-names-ganesha";

export const STUTI_NAMES: Record<string, any> = { vishnu, lalita, ganesha };

/* Per-śloka name counts for a registry that has them (\`slokaCounts\`) — how
   many of its names each śloka carries — turned into a from/to range for
   a given śloka number. Shared by every registry that carries the field;
   installed once here rather than duplicated per file. */
export function range(key: string, slokaN: number) {
  const N = (STUTI_NAMES as any)[key], c = N && N.slokaCounts;
  if (!c) return null;
  const i = parseInt(String(slokaN), 10);
  if (!i || i < 1 || i > c.length) return null;
  let from = 1;
  for (let k = 0; k < i - 1; k++) from += c[k];
  return { from: from, to: from + c[i - 1] - 1 };
}
`
);

for (const file of ["stuti-texts.ts", "stuti-reader.tsx"]) {
  let text = rd(file);
  if (!text.includes('from "./stuti-names"')) {
    text = `import { STUTI_NAMES } from "./stuti-names";\n` + text;
  }
  text = text.replace(/\bwindow\.STUTI_NAMES\b/g, "STUTI_NAMES");
  wr(file, text);
}

console.log("round 2 done");

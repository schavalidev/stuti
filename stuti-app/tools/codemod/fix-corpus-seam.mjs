// The corpus seam (stuti-app/docs/corpus-delivery.md): the hand-authored
// src/stuti-corpus.ts lists the fetched catalogue beside the bundled one and
// fills a hymn's verses the first time it is opened. Three anchors, each a
// loud failure when the design moves it:
//   1. stuti-data.ts hands out the four catalogue helpers the loader needs
//      (normTitle, slug, typeOf, assignForm) under STUTI._corpus;
//   2. the reader takes a tick from useCorpusText(rawHymn) and re-reads the
//      hymn when it changes, so a text that arrives is shown at once;
//   main.tsx is copied from templates/ by setup-entry.mjs and calls
//   installCorpus() itself, beside the corrections.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");

function patchFile(name, edits) {
  const p = join(SRC, name);
  let t = readFileSync(p, "utf8");
  for (const [from, to, what] of edits) {
    if (t.includes(to)) continue;                        // already applied
    if (!t.includes(from)) throw new Error(`fix-corpus-seam: anchor not found in ${name} — ${what}`);
    t = t.replace(from, to);
  }
  writeFileSync(p, t);
}

patchFile("stuti-data.ts", [[
  `  return { deities, hymns, weekday, deityById, hymnsForDeity, hymnById, today, FORMS, formsForDeity };`,
  `  return { deities, hymns, weekday, deityById, hymnsForDeity, hymnById, today, FORMS, formsForDeity, _corpus: { normTitle, slug, typeOf, assignForm } };`,
  "the catalogue helpers",
]]);

patchFile("stuti-reader.tsx", [
  [`function ReaderView({ hymn: rawHymn, deity, go, theme, toggleTheme, lang, setLang, backView = "deity", retView }) {`,
   `import { useCorpusText } from "./stuti-corpus";\nfunction ReaderView({ hymn: rawHymn, deity, go, theme, toggleTheme, lang, setLang, backView = "deity", retView }) {\n  const corpusTick = useCorpusText(rawHymn);`,
   "ReaderView head"],
  [`    [rawHymn, regTick, lang]\n  );`, `    [rawHymn, regTick, lang, corpusTick]\n  );`, "the hymn memo"],
]);

console.log("corpus seam applied");

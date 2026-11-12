#!/usr/bin/env node
/* ============================================================
   The catalogue apart from the hymns.

   A tester found the first launch on Android taking about seven
   seconds. 0.9.134 made the hymns parse as JSON rather than as
   JavaScript source, which is worth tens of milliseconds. The cause
   it did not touch is structural: `stuti-texts-extra.ts` wants the
   twenty-nine deity modules only for their catalogue entries —
   title, blurb, sections — and each of those entries carries every
   verse of its hymn in the same object. Taking the entry evaluates
   the whole module. So the library, asking for a list of names,
   pulls in the verse text, the meanings and the thousand-name
   registries of every hymn in the app before React draws anything.

   This parts the two. Each text module keeps its entries with the
   `verses` lifted out — about 49 KB for all thirty-one files — and
   the verses go into a `stuti-body-*.ts` beside it, reached only by
   a dynamic import, which Vite gives its own chunk and Workbox
   caches like any other built file. The catalogue is therefore
   complete and correct at first paint, with every blurb, every
   section heading and every `catalog = false`; the verses arrive in
   idle slices just after, or at once and ahead of the queue when a
   reader opens a hymn whose body has not landed yet.

   The same is done to the sahasranāma name registries (688 KB, and
   needed only to read a thousand-name text) and to the Hindi and
   Telugu meanings, whose modules walk the texts and hang `v.hi` /
   `v.tel` on verses that must therefore already be there. Those
   modules used to attach once at load and give up after a couple of
   seconds of retrying; each now registers its attach function
   instead, and the loader re-runs all of them every time a body
   lands. That is the trap in this change — a build that loses a
   meaning here is clean by every check in the repo and simply hands
   a Devanāgarī reader the English line, which is how the meanings
   went missing for months before 17 Oct 2026.

   Every split is proved before it is written: the head and the body
   are put back together and compared with the original entry key by
   key. A module that does not come back exactly as it went in fails
   the run rather than shipping.
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { patcher } from "./seam-lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");
const SEAM = "fix-defer-bodies";

/* ---------- the proof: same value, field for field ---------- */
function same(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) { if (!(k in b) || !same(a[k], b[k])) return false; }
  return true;
}

/* the JSON.parse("…") literal fix-data-as-json.mjs left behind */
const JSON_LITERAL = /JSON\.parse\(\s*("(?:[^"\\]|\\[\s\S])*")\s*\)/;

function apply(name, patches) {
  const p = join(SRC, name);
  const api = patcher(SEAM, readFileSync(p, "utf8"));
  for (const [from, to, what] of patches) api.patch(from, to, what);
  writeFileSync(p, api.text);
  return api.stats;
}

/* ---------- 1. split each text module into a head and a body ---------- */
/* module order is the order the app binds them in: the main file first, then
   stuti-texts-extra.ts's own list, so a text on two shelves is bound the same
   way it always was */
const extraOrder = (() => {
  const t = readFileSync(join(SRC, "stuti-texts-extra.ts"), "utf8");
  return [...t.matchAll(/from "\.\/(stuti-text-[a-z0-9-]+)"/g)].map((m) => m[1]);
})();

const mods = [{ file: "stuti-texts.ts", key: "main", exp: "STUTI_TEXTS" },
  ...extraOrder.map((f) => ({ file: f + ".ts", key: f.replace(/^stuti-text-/, ""), exp: "extra" }))];

let headBytes = 0, bodyBytes = 0, entries = 0, verses = 0;
const wrote = new Set();

for (const m of mods) {
  const path = join(SRC, m.file);
  let text = readFileSync(path, "utf8");
  const bodyFile = `stuti-body-${m.key}.ts`;
  wrote.add(bodyFile);

  const hit = JSON_LITERAL.exec(text);
  if (!hit) {
    /* already split by an earlier run of this seam, or the design moved it */
    if (text.includes("/* verses: stuti-body-")) { headBytes += text.length; continue; }
    throw new Error(`${SEAM}: no JSON literal in ${m.file} — fix-data-as-json.mjs must run first`);
  }

  const original = JSON.parse(JSON.parse(hit[1]));
  if (!Array.isArray(original)) throw new Error(`${SEAM}: ${m.file} does not export an array of entries`);

  const heads = [], bodies = [];
  for (const e of original) {
    const head = {};
    for (const k of Object.keys(e)) { if (k !== "verses") head[k] = e[k]; }
    heads.push(head);
    bodies.push(e.verses || []);
  }

  /* the proof — put them back together and compare with what was there */
  const rebuilt = heads.map((h, i) => {
    const out = {};
    for (const k of Object.keys(original[i])) out[k] = k === "verses" ? bodies[i] : h[k];
    return out;
  });
  if (!same(original, rebuilt)) throw new Error(`${SEAM}: ${m.file} does not come back unchanged from the split`);

  const headJson = JSON.stringify(heads), bodyJson = JSON.stringify(bodies);
  if (!same(heads, JSON.parse(headJson)) || !same(bodies, JSON.parse(bodyJson))) {
    throw new Error(`${SEAM}: ${m.file} will not go through JSON unchanged`);
  }

  entries += heads.length;
  verses += bodies.reduce((n, b) => n + b.length, 0);

  text = text.slice(0, hit.index) + `/* verses: stuti-body-${m.key}.ts, loaded when a reader opens one */\n  JSON.parse(${JSON.stringify(headJson)})` + text.slice(hit.index + hit[0].length);
  writeFileSync(path, text);
  headBytes += text.length;

  const body = `/* The verses of the hymns ${m.file} catalogues, in its own order.\n   Written by tools/codemod/fix-defer-bodies.mjs — not a design file. Reached\n   only by a dynamic import from stuti-bundled.ts, so it is a chunk of its own\n   and nothing here is parsed before the first screen is drawn. */\nexport default JSON.parse(${JSON.stringify(bodyJson)}) as any[][];\n`;
  writeFileSync(join(SRC, bodyFile), body);
  bodyBytes += bodyJson.length;
}

/* a deity module the designer removed leaves its body behind otherwise */
let stale = 0;
for (const f of readdirSync(SRC)) {
  if (/^stuti-body-[a-z0-9-]+\.ts$/.test(f) && !wrote.has(f)) { unlinkSync(join(SRC, f)); stale++; }
}

/* ---------- 2. the registry the loader walks ---------- */
const reg = [
  `/* Which body file carries which catalogue entries. Written by`,
  `   tools/codemod/fix-defer-bodies.mjs; read by stuti-bundled.ts. The heads are`,
  `   the live entry objects, so hanging a body's verses on one is what binds a`,
  `   hymn to its text — exactly as stuti-texts.ts has always done it. */`,
  `import { STUTI_TEXTS } from "./stuti-texts";`,
  ...mods.slice(1).map((m) => `import { extra as m_${m.key.replace(/-/g, "_")} } from "./stuti-text-${m.key}";`),
  ``,
  `export const BODY_MODS: Array<{ key: string; heads: any[]; load: () => Promise<any> }> = [`,
  `  { key: "main", heads: STUTI_TEXTS, load: () => import("./stuti-body-main") },`,
  ...mods.slice(1).map((m) => `  { key: "${m.key}", heads: m_${m.key.replace(/-/g, "_")}, load: () => import("./stuti-body-${m.key}") },`),
  `];`,
  ``,
].join("\n");
writeFileSync(join(SRC, "stuti-body-registry.ts"), reg);

/* ---------- 3. stuti-texts.ts: one pass, re-runnable ---------- */
apply("stuti-texts.ts", [
  [`(function () {\n  var S = STUTI; if (!S || !STUTI_TEXTS) return;`,
   `/* The binding pass, kept as a function so a body that arrives later is bound\n   the same way the eager pass bound its head (see stuti-bundled.ts). */\nvar ATTACH: any = null;\nexport const STUTI_ATTACH = function (t: any) { if (ATTACH) ATTACH(t); };\n(function () {\n  var S = STUTI; if (!S || !STUTI_TEXTS) return;`,
   "the re-runnable pass"],

  [`  STUTI_TEXTS.concat(STUTI_TEXTS_EXTRA || []).forEach(function (t) {\n    var verses = t.verses;`,
   `  ATTACH = function (t) {\n    var verses = t.verses;`,
   "the pass head"],

  [`    if (t.namesKey && t.namesAt != null) {`,
   `    if (t.namesKey && t.namesAt != null && verses) {`,
   "the name-verse guard"],

  [`      h.verses = verses; h.sections = t.sections; h.catalog = false;`,
   `      if (verses) h.verses = verses;\n      h.sections = t.sections; h.catalog = false;\n      delete h._ritual;   // STUTI_RITUAL caches on the hymn, and the verses are new`,
   "the hymn fields"],

  [`      if (t.occasions) h.occasions = t.occasions;\n    });\n  });\n})();`,
   `      if (t.occasions) h.occasions = t.occasions;\n    });\n  };\n  /* the heads, now: every blurb, section heading and catalog flag is right at\n     first paint, and only the verses are still to come */\n  STUTI_TEXTS.concat(STUTI_TEXTS_EXTRA || []).forEach(ATTACH);\n})();`,
   "the pass tail"],

  [`  verses.forEach(function (v) { if (nmSec[v.s] && v.n) v.nm = true; });`,
   `  (verses || []).forEach(function (v) { if (nmSec[v.s] && v.n) v.nm = true; });`,
   "the name-sloka marker"],
]);

/* ---------- 4. the name registries, lazily installed ---------- */
apply("stuti-names.ts", [
  [`import { vishnu } from "./stuti-names-vishnu";\nimport { lalita } from "./stuti-names-lalita";\nimport { ganesha } from "./stuti-names-ganesha";\n\nexport const STUTI_NAMES: Record<string, any> = { vishnu, lalita, ganesha };`,
   `/* The three registries are 688 KB and only a thousand-name text needs them,\n   so they are not in the launch chunk: stuti-names-lazy.ts puts them in this\n   same object, which keeps its identity, so every reader of STUTI_NAMES goes\n   on working and simply sees it empty until the bodies land. */\nexport const STUTI_NAMES: Record<string, any> = {};\nexport function installNames(regs: Record<string, any>) { Object.assign(STUTI_NAMES, regs); }`,
   "the lazily filled registry"],
]);

writeFileSync(join(SRC, "stuti-names-lazy.ts"),
`/* The sahasranāma registries and the Hindi for their thousand names. Written by\n   tools/codemod/fix-defer-bodies.mjs. Imported only by stuti-bundled.ts, and\n   only once a body is wanted, so none of it is read at launch. */\nimport { installNames } from "./stuti-names";\nimport { vishnu } from "./stuti-names-vishnu";\nimport { lalita } from "./stuti-names-lalita";\nimport { ganesha } from "./stuti-names-ganesha";\nimport "./stuti-hindi-names-vishnu";\nimport "./stuti-hindi-names-lalita";\n\ninstallNames({ vishnu, lalita, ganesha });\n`);

writeFileSync(join(SRC, "stuti-hindi-lazy.ts"),
`/* The Hindi and Telugu meanings that hang on the verses. Written by\n   tools/codemod/fix-defer-bodies.mjs, in the order main.tsx used to import\n   them in. Each module now only registers its attach function; stuti-bundled.ts\n   runs them all again every time a body lands, because a meaning attached to a\n   verse that is not there yet is a meaning lost in silence. */\nimport "./stuti-hindi-shiva";\nimport "./stuti-hindi-core";\nimport "./stuti-hindi-ganesha2";\nimport "./stuti-hindi-subrahmanya";\nimport "./stuti-hindi-ganesha";\nimport "./stuti-hindi-sahasra";\n`);

/* ---------- 5. the meaning modules register instead of attaching once ---------- */
const REGISTER = `  /* registered rather than run: stuti-bundled.ts calls this again each time a\n     hymn's verses arrive, so no meaning depends on load order any more */\n  var W: any = typeof window !== "undefined" ? window : globalThis;\n  (W.STUTI_HI_ATTACH = W.STUTI_HI_ATTACH || []).push(attach);\n})();`;
const HINDI = ["stuti-hindi-core", "stuti-hindi-ganesha", "stuti-hindi-ganesha2", "stuti-hindi-shiva",
  "stuti-hindi-subrahmanya", "stuti-hindi-sahasra", "stuti-hindi-names-vishnu", "stuti-hindi-names-lalita"];
let registered = 0;
for (const name of HINDI) {
  const p = join(SRC, name + ".ts");
  let t = readFileSync(p, "utf8");
  if (t.includes("STUTI_HI_ATTACH")) { registered++; continue; }
  const onDom = `  if (!attach()) document.addEventListener("DOMContentLoaded", attach);\n})();`;
  const onPoll = `  if (!attach()) {\n    let tries = 0;\n    const t = setInterval(function () { if (attach() || ++tries > 40) clearInterval(t); }, 60);\n  }\n})();`;
  if (t.includes(onDom)) t = t.replace(onDom, REGISTER);
  else if (t.includes(onPoll)) t = t.replace(onPoll, REGISTER);
  else throw new Error(`${SEAM}: ${name}.ts does not end in either known attach-once form`);
  writeFileSync(p, t);
  registered++;
}

/* ---------- 6. the screens that cache a walk over every verse ---------- */
const INVALIDATE = (what) =>
  `\ntry { (typeof window !== "undefined" ? window : globalThis).addEventListener("stuti-bundled", function () { ${what} }); } catch (e) {}`;

for (const f of ["stuti-main.tsx", "stuti-wide-main.tsx"]) {
  apply(f, [
    [`let SR_VERSES = null;`,
     `let SR_VERSES = null;` + INVALIDATE("SR_VERSES = null;"),
     "the verse index cache"],
    [`function App() {\n  const S = STUTI;`,
     `function App() {\n  useBundledTick();   // the bodies arrive after first paint; the screens re-read when they do\n  const S = STUTI;`,
     "the App tick"],
    [`import { STUTI } from "./stuti-data";`,
     `import { STUTI } from "./stuti-data";\nimport { useBundledTick } from "./stuti-bundled";`,
     "the tick import"],
  ]);
}

apply("stuti-lexicon.ts", [
  [`  let CORPUS = null;`,
   `  let CORPUS = null;\n  try { (typeof window !== "undefined" ? window : globalThis).addEventListener("stuti-bundled", function () { CORPUS = null; NAMES = null; }); } catch (e) {}`,
   "the padārtha index caches"],
]);

/* ---------- 7. the reader asks for a body it does not have ---------- */
apply("stuti-reader.tsx", [
  [`import { useCorpusText } from "./stuti-corpus";\nfunction ReaderView({`,
   `import { useCorpusText } from "./stuti-corpus";\nimport { useBundledText } from "./stuti-bundled";\nfunction ReaderView({`,
   "the bundled-text import"],
  [`  const corpusTick = useCorpusText(rawHymn);`,
   `  const corpusTick = useCorpusText(rawHymn);\n  const bundledTick = useBundledText(rawHymn);   // a bundled text whose verses are still queued jumps the queue`,
   "the reader's bundled tick"],
  [`    [rawHymn, regTick, lang, corpusTick]\n  );`,
   `    [rawHymn, regTick, lang, corpusTick, bundledTick]\n  );`,
   "the hymn memo"],
]);

console.log(`defer bodies: ${entries} entries kept eager (${(headBytes / 1024).toFixed(0)} KB of catalogue), `
  + `${verses} verses moved into ${wrote.size} body chunks (${(bodyBytes / 1048576).toFixed(2)} MB), `
  + `${registered} meaning modules registered${stale ? `, ${stale} stale body file(s) removed` : ""}`);

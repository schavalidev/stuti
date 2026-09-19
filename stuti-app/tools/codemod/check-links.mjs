// Every text written into the build must reach a reader, and every pointer at
// one must find it.
//
// The catalogue and the texts are joined at load time, by title and by
// keyword, and both joins fail in silence. `stuti-texts.ts` binds a written
// text to its catalogue row by deity + title and returns quietly when no row
// matches; `resolveStotras` looks a stotra up on a vrata or a māsa page by a
// fragment of its title and simply omits what it cannot find. A misspelling on
// either side, or a catalogue row that was never created, costs a text its
// reader — and nothing anywhere says so. That is how the seven pitṛ texts, and
// then the Vipra-kṛta Kumāra Stuti, sat finished in the bundle through several
// beta builds.
//
// So this reads the generated modules the way the app does and reports:
//   1. a written text that binds to no catalogue row at all,
//   2. a hymn declared to have a text but carrying no verses,
//   3. a vidhiText or other id pointer naming a hymn that does not exist,
//   4. a {deity, m} pick on a vrata, māsa or practice page matching nothing.
// The first three fail the run. The fourth only warns: a pick may deliberately
// name a text still to be written.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve as resolvePath } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");

/* the generated modules import each other without a file ending, which Node
   does not do on its own */
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith(".") && !/\.(ts|tsx|js|mjs|json|css)$/.test(spec)) {
      const base = dirname(fileURLToPath(ctx.parentURL));
      for (const ext of [".ts", ".tsx"]) {
        const p = resolvePath(base, spec + ext);
        if (existsSync(p)) return { url: pathToFileURL(p).href, shortCircuit: true };
      }
    }
    return next(spec, ctx);
  },
});

/* the data modules are the app's own, and a few of them listen to the browser
   as they load. Enough of one to let them finish loading, and no more — nothing
   here is read back. */
const noop = () => {};
globalThis.window ??= {
  addEventListener: noop, removeEventListener: noop, setTimeout: noop, clearTimeout: noop,
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }),
  location: { href: "", search: "", hash: "" }, innerWidth: 390, innerHeight: 844,
};
Object.defineProperty(globalThis, "localStorage", {  /* Node has one of its own, and warns when it is touched */
  value: { getItem: () => null, setItem: noop, removeItem: noop, key: () => null, length: 0 }, configurable: true });
globalThis.document ??= {
  addEventListener: noop, removeEventListener: noop, querySelector: () => null, querySelectorAll: () => [],
  createElement: () => ({ style: {}, setAttribute: noop, appendChild: noop, classList: { add: noop, remove: noop } }),
  documentElement: { style: { setProperty: noop }, setAttribute: noop, classList: { add: noop, remove: noop } },
  body: { appendChild: noop, classList: { add: noop, remove: noop } },
};
globalThis.navigator ??= { userAgent: "node", language: "en", onLine: true };

const load = (name) => import(pathToFileURL(join(SRC, name)).href);
const { STUTI } = await load("stuti-data.ts");
const { STUTI_TEXTS } = await load("stuti-texts.ts");           // binds as a side effect
const { STUTI_TEXTS_EXTRA } = await load("stuti-texts-extra.ts");
const { STUTI_VRATA } = await load("stuti-vrata-data.ts");
const { STUTI_MASA } = await load("stuti-masa-data.ts");
const { STUTI_LIB } = await load("stuti-library-data.ts");

const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const errors = [], warnings = [];

/* 1 — a written text with nowhere to land */
const written = STUTI_TEXTS.concat(STUTI_TEXTS_EXTRA || []);
for (const t of written) {
  for (const d of t.deities || []) {
    if (!STUTI.hymns.some((h) => h.deity === d && norm(h.title) === norm(t.title))) {
      const near = STUTI.hymns
        .filter((h) => h.deity === d && norm(h.title).startsWith(norm(t.title).slice(0, 8)))
        .map((h) => h.title);
      errors.push(
        `text "${t.title}" (${d}) binds to no catalogue row` +
        (near.length ? `\n      the rows it nearly matches: ${near.join(" · ")}` : "") +
        `\n      a row for it must exist in stuti-data.js before the text can be read`
      );
    }
  }
}

/* 2 — a hymn that says it has a text and has none */
for (const h of STUTI.hymns) {
  if (!h.catalog && !(h.verses && h.verses.length)) {
    errors.push(`hymn "${h.id}" is not marked catalog and carries no verses`);
  }
}

/* 3 — an id pointer naming a hymn that is not there */
const byId = new Map(STUTI.hymns.map((h) => [h.id, h]));
for (const v of STUTI_VRATA.vratas || []) {
  for (const field of ["vidhiText", "kathaText"]) {
    const id = v[field];
    if (id && !byId.has(id)) errors.push(`vrata "${v.id}" ${field} names "${id}", which is not a hymn id`);
  }
}

/* 4 — a keyword pick that matches nothing */
const picks = [];
for (const v of STUTI_VRATA.vratas || []) (v.stotras || []).forEach((p) => picks.push([`vrata ${v.id}`, p]));
for (const m of STUTI_MASA.list || []) (m.recite || []).forEach((p) => picks.push([`māsa ${m.id || m.name?.roman}`, p]));
for (const pr of STUTI_LIB.practices || []) (pr.steps || []).forEach((s) => { if (s.recite) picks.push([`practice ${pr.id}`, s.recite]); });
for (const [where, p] of picks) {
  if (!p || !p.deity) continue;
  const hit = STUTI_LIB.resolveStotras([p]);
  if (!hit.length) warnings.push(`${where}: "${p.m}" (${p.deity}) matches no title in the catalogue`);
}

const counted = `${written.length} written texts · ${STUTI.hymns.length} catalogue rows · ${picks.length} picks`;
if (warnings.length) {
  console.warn(`links: ${warnings.length} pick(s) match nothing:`);
  for (const w of warnings) console.warn("  " + w);
}
if (!errors.length) {
  console.log(`links: every written text reaches a reader (${counted})`);
  process.exit(0);
}
console.error(`links: ${errors.length} text(s) or pointer(s) cannot be reached:`);
for (const e of errors) console.error("  " + e);
process.exit(1);

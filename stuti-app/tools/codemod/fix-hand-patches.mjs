// The handful of edits that were first applied by hand after the pipeline
// ran, now scripted so a rerun reproduces the whole final state. Each one
// fails loudly if its anchor text isn't found — if a design update changes
// one of these spots, that should surface here, not as a silent regression.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src");
const rd = (f) => readFileSync(join(OUT, f), "utf8");
const wr = (f, t) => writeFileSync(join(OUT, f), t);

function must(file, text, re, what) {
  if (!re.test(text)) throw new Error(`${file}: ${what} — anchor not found`);
}

// --- stuti-main.tsx: an App module, not a page script ---------------------
// Drop the ReactDOM.createRoot(...) call and the manual service-worker block
// that follows it (main.tsx and vite-plugin-pwa own both now); export App.
{
  let t = rd("stuti-main.tsx");
  // The designer wrapped App in an error boundary (0.9.131), after a missing
  // file blanked the tablet build in silence. The boundary is hers; main.tsx
  // is what mounts it, since the root belongs to the port.
  const tail = /ReactDOM\.createRoot\(document\.getElementById\("root"\)\)\.render\(\s*(?:<StutiBoundary>\s*)?<App \/>\s*(?:<\/StutiBoundary>\s*)?\);[\s\S]*$/;
  must("stuti-main.tsx", t, tail, "createRoot tail");
  must("stuti-main.tsx", t, /class StutiBoundary extends React\.Component/, "the error boundary");
  t = t.replace(tail, "export { StutiBoundary };\nexport default App;\n");
  // two spots used bare useState where the rest of the file uses its own alias
  t = t.replace(/\buseState\(/g, "useStateM(");
  wr("stuti-main.tsx", t);
}

// --- stuti-practice.tsx: a `lens` that was never in PracticeView's scope --
// Would throw on opening any practice detail screen; the attribute was a
// leftover from the tabbed views that do have a lens.
{
  let t = rd("stuti-practice.tsx");
  const re = /(<div className="lens-pad") data-lens=\{lens\}(>\s*\n\s*<header className="practice-hero">)/;
  must("stuti-practice.tsx", t, re, "stray data-lens on practice-hero");
  wr("stuti-practice.tsx", t.replace(re, "$1$2"));
}

// --- stuti-panchanga.tsx: the nested SK_CONST export ----------------------
// transform.mjs leaves this call alone (its value is an object literal).
{
  let t = rd("stuti-panchanga.tsx");
  const re = /Object\.assign\(window,\s*\{\s*RtuGlyph,\s*AyanaGlyph,\s*SeasonAmbient,\s*RTU_VIS,\s*Snowflake,\s*SK_CONST:\s*\{\s*GOTRAS,\s*KARMAS,\s*VARA_GRAHA,\s*YOGA_DEVA,\s*KARANA_DEVA\s*\},?\s*\}\);?/;
  must("stuti-panchanga.tsx", t, re, "SK_CONST Object.assign block");
  wr("stuti-panchanga.tsx", t.replace(re,
    "export { RtuGlyph, AyanaGlyph, SeasonAmbient, RTU_VIS, Snowflake };\n" +
    "export const SK_CONST = { GOTRAS, KARMAS, VARA_GRAHA, YOGA_DEVA, KARANA_DEVA };"));
}

// --- stuti-calendar.tsx: the dead bare-YOGA_DEVA fallback ------------------
// `window.YOGA_DEVA` is SPECIAL in transform.mjs (left as-is, never
// imported), matching how the sibling `window.KARANA_DEVA` fallback already
// behaves — nothing to do here beyond asserting it still reads that way.
{
  const t = rd("stuti-calendar.tsx");
  must("stuti-calendar.tsx", t, /\|\|\s*window\.YOGA_DEVA\s*\|\|/, "bare window.YOGA_DEVA fallback");
}

// --- ReactDOM: portals and roots ------------------------------------------
// ReactDOM is a browser global in the prototype; here it's an import, and
// which one depends on what the file calls.
let dom = 0;
for (const file of readdirSync(OUT)) {
  if (!file.endsWith(".tsx")) continue;
  let t = rd(file);
  if (/\bimport ReactDOM from/.test(t)) continue;
  if (/\bReactDOM\.createRoot\(/.test(t)) t = `import ReactDOM from "react-dom/client";\n` + t;
  else if (/\bReactDOM\.createPortal\(/.test(t)) t = `import ReactDOM from "react-dom";\n` + t;
  else continue;
  wr(file, t);
  dom++;
}

console.log("hand patches applied; ReactDOM imports added to", dom, "files");

/* Live refresh by binding, not by window: the ledger and the Today band
   subscribed to stores through `window[k]`, which the port never publishes,
   so neither refreshed when a bead was counted or a plan advanced. The
   stores are imported names now (fix-missing-imports adds the imports). */
{
  let t = rd("stuti-ledger-core.ts");
  const from = `["STUTI_THREAD", "STUTI_JAPA", "STUTI_PLANS", "STUTI_KEEP", "STUTI_FAVS", "STUTI_FAVS_WEEK"].forEach((k) => { try { window[k].subscribe(fire); } catch (e) {} });`;
  if (!t.includes(from)) throw new Error("fix-hand-patches: ledger subscribe line not found");
  wr("stuti-ledger-core.ts", t.replace(from, `[STUTI_THREAD, STUTI_JAPA, STUTI_PLANS, STUTI_KEEP, STUTI_FAVS, STUTI_FAVS_WEEK].forEach((s) => { try { s.subscribe(fire); } catch (e) {} });`));
  t = rd("stuti-today.tsx");
  const from2 = `const offs = ["STUTI_PREFS", "STUTI_VOWS", "STUTI_PLANS", "STUTI_JAPA", "STUTI_THREAD", "STUTI_LOC", "STUTI_KEEP"]
      .map((k) => { try { return window[k].subscribe(f); } catch (e) { return null; } });`;
  if (!t.includes(from2)) throw new Error("fix-hand-patches: today subscribe lines not found");
  wr("stuti-today.tsx", t.replace(from2, `const offs = [STUTI_PREFS, STUTI_VOWS, STUTI_PLANS, STUTI_JAPA, STUTI_THREAD, STUTI_LOC, STUTI_KEEP]
      .map((s) => { try { return s.subscribe(f); } catch (e) { return null; } });`));
  console.log("live subscriptions rewired: ledger, today");
}

// --- stuti-library-data.ts: a label for the "Vidhi" type -------------------
// Śrī Varasiddhi Vināyaka Vratam is typed "Vidhi", and TYPE_LABELS had no row
// for it, so typeList() fell back to the raw word and the Telugu and Hindi
// books showed "VIDHI" in Latin capitals under Gaṇeśa (S102 audit). The words
// are the ones stuti-i18n already uses for vidhi. If the design adds its own
// row, this steps aside.
{
  let t = rd("stuti-library-data.ts");
  if (!/"Vidhi":\s*\{/.test(t)) {
    const row = /(\n(\s*)"Tālam":\s*\{[^\n]*\},)/;
    const order = /("Kṛti", "Tālam",)/;
    must("stuti-library-data.ts", t, row, "Tālam row of TYPE_LABELS");
    must("stuti-library-data.ts", t, order, "Kṛti, Tālam in TYPE_ORDER");
    t = t.replace(row, `$1\n$2"Vidhi":        { deva: "विधि",            tel: "విధానం",            note: "The order of the rite" },`);
    t = t.replace(order, `$1 "Vidhi",`);
    wr("stuti-library-data.ts", t);
    console.log("library: Vidhi type labelled");
  }
}

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
  const tail = /ReactDOM\.createRoot\(document\.getElementById\("root"\)\)\.render\(<App \/>\);[\s\S]*$/;
  must("stuti-main.tsx", t, tail, "createRoot tail");
  t = t.replace(tail, "export default App;\n");
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

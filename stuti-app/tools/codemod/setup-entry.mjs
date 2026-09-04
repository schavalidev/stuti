// The parts of src/ that are NOT derived from the prototype's JS: the entry
// point, Vite's type shim, and the stylesheets + self-hosted fonts copied
// over as-is. Kept as a pipeline step (templates in ./templates) so a rerun
// restores them — an earlier version of this workflow lost main.tsx to a
// regenerate and only noticed at build time.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SRC } from "./order.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../../src");
const TPL = join(HERE, "templates");

mkdirSync(join(OUT, "fonts"), { recursive: true });

copyFileSync(join(TPL, "main.tsx"), join(OUT, "main.tsx"));
writeFileSync(join(OUT, "vite-env.d.ts"), `/// <reference types="vite/client" />\n`);

const CSS = ["stuti.css", "stuti-components.css", "stuti-palette.css", "stuti-pigment.css"];
for (const f of CSS) copyFileSync(join(SRC, f), join(OUT, f));

let fonts = 0;
for (const f of readdirSync(join(SRC, "fonts"))) {
  copyFileSync(join(SRC, "fonts", f), join(OUT, "fonts", f));
  fonts++;
}

console.log("entry files written; copied", CSS.length, "stylesheets and", fonts, "font files");

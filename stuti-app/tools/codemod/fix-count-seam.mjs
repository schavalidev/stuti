// stuti-count keys every event to location.hostname, which inside the Android
// app is "localhost"; the app names its own domain (main.tsx sets it) so an
// endpoint, if one is ever configured, sees phone and web as one site.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-count.ts");
let t = readFileSync(FILE, "utf8");
const from = `const DOMAIN = location.hostname || "stuti";`;
if (!t.includes(from)) throw new Error("fix-count-seam: DOMAIN anchor not found");
t = t.replace(from, `const DOMAIN = (window as any).STUTI_COUNT_DOMAIN || location.hostname || "stuti";`);
writeFileSync(FILE, t);
console.log("count seam applied");

// The sink (12 Sep 2026 plan, item 7): every counted event also goes to the
// hand-authored stuti-count-sink.ts, which writes it to Supabase when that is
// configured; state() reads "on" then, so the build stamp tells the truth.
function patch(from, to, what) { if (!t.includes(from)) throw new Error(`fix-count-seam: anchor not found — ${what}`); t = t.replace(from, to); }
t = readFileSync(FILE, "utf8");
patch(`export const STUTI_COUNT = (function () {`, `import { countSink, countSinkOn } from "./stuti-count-sink";\nexport const STUTI_COUNT = (function () {`, "import");
patch(`    if (ENDPOINT) {`, `    countSink(name, ev.p);\n    if (ENDPOINT) {`, "hand each event to the sink");
patch(`const state = () => (dnt ? "dnt" : ENDPOINT ? "on" : "local");`, `const state = () => (dnt ? "dnt" : ENDPOINT || countSinkOn() ? "on" : "local");`, "state");
writeFileSync(FILE, t);
console.log("count sink seam applied");

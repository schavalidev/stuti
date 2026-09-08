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

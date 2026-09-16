// Razorpay button ids live in the hand-authored stuti-cloud-config.ts beside
// the other public server values, so filling them in never means editing a
// generated file. Literal anchor; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-dana-core.ts");
let t = readFileSync(FILE, "utf8");
const from = `export const STUTI_RAZORPAY = { day: "", month: "", year: "", patron: "" };`;
if (!t.includes(from)) throw new Error("fix-dana-seam: STUTI_RAZORPAY anchor not found");
t = `import { STUTI_RAZORPAY_IDS } from "./stuti-cloud-config";\n` + t.replace(from, `export const STUTI_RAZORPAY = STUTI_RAZORPAY_IDS;`);
writeFileSync(FILE, t);
console.log("dana seam applied");

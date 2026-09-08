// Two small things in the designer's beta latch, found on the phone: a wrong
// word remounts the input (key={no}) and the focus effect ran only once, so
// the keyboard closed on every retry; and after three misses the note says
// "write to us" with nowhere to write. Literal anchors; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-gate.tsx");
let t = readFileSync(FILE, "utf8");
function patch(from, to, what) { if (!t.includes(from)) throw new Error(`fix-gate-seam: anchor not found — ${what}`); t = t.replace(from, to); }
patch(`className={"gate-input" + (no ? " gate-shake" : "")} key={no}`, `className={"gate-input" + (no ? " gate-shake" : "")} key={no} autoFocus`, "input keeps focus across retries");
patch(`<div className="gate-foot">{B.label()}</div>`, `{no > 2 && B.SUPPORT && <a className="gate-mail" href={"mailto:" + B.SUPPORT}>{B.SUPPORT}</a>}\n        <div className="gate-foot">{B.label()}</div>`, "an address after the third miss");
writeFileSync(FILE, t);
console.log("gate seam applied");

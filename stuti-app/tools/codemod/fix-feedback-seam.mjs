// Feedback that arrives (stuti-feedback-send.ts): Send goes through the log
// relay to the makers' Drive folder, and falls back to the mail app only when
// the relay cannot be reached. Literal anchors; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-feedback.tsx");
let t = readFileSync(FILE, "utf8");
function patch(from, to, what) { if (!t.includes(from)) throw new Error(`fix-feedback-seam: anchor not found — ${what}`); t = t.replace(from, to); }
patch(`import { STUTI_BUILD } from "./stuti-build";`, `import { STUTI_BUILD } from "./stuti-build";\nimport { sendFeedback, FB_SENT } from "./stuti-feedback-send";`, "import");
patch(`  const send = () => {
    if (!text.trim()) return;
    const href`, `  const send = async () => {
    if (!text.trim() || sent === "sending") return;
    setSent("sending");
    if (await sendFeedback(kind, subject, body())) { setSent("server"); setText(""); count(); return; }
    const href`, "send through the relay first");
patch(`{sent && <p className="fb-done">{L.t(`, `{sent && sent !== "sending" && <p className="fb-done">{sent === "server" ? (FB_SENT[lang] || FB_SENT.roman) : L.t(`, "the sent line");
writeFileSync(FILE, t);
console.log("feedback seam applied");

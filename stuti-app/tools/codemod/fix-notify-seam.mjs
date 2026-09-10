// The bell on the phone. The prototype's nudge speaks only browser
// Notification, which the Android WebView does not implement at all — so
// every cue was reckoned and then dropped, while the reminder sheet
// reported "unsupported" as if the reciter's own device were at fault.
//
// Four small openings, no more: what is supported, what was permitted, how
// to ask, and who owns delivery. The native layer answers all four through
// window.STUTI_NATIVE_CUES (set by stuti-notify.ts, hand-authored) rather
// than an import, so the generated module keeps its own dependency graph
// and nothing here can cycle. Literal anchors; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-nudge.ts");
let t = readFileSync(FILE, "utf8");
function patch(from, to, what) { if (!t.includes(from)) throw new Error(`fix-notify-seam: anchor not found — ${what}`); t = t.replace(from, to); }

patch(
`  const supported = () => typeof window.Notification === "function";
  const permission = () => (supported() ? Notification.permission : "unsupported");

  function ask() {
    if (!supported()) return Promise.resolve("unsupported");
    if (Notification.permission !== "default") return Promise.resolve(Notification.permission);
    try { return Notification.requestPermission().then((p) => { arm(); return p; }); }
    catch (e) { return Promise.resolve(Notification.permission); }
  }`,
`  /* on the phone the OS holds the bells, and answers all three of these */
  const nativeCues = () => { try { return (window as any).STUTI_NATIVE_CUES || null; } catch (e) { return null; } };

  const supported = () => !!nativeCues() || typeof window.Notification === "function";
  const permission = () => {
    const n = nativeCues();
    if (n) return n.permission();
    return typeof window.Notification === "function" ? Notification.permission : "unsupported";
  };

  function ask() {
    const n = nativeCues();
    if (n) return n.ask();
    if (typeof window.Notification !== "function") return Promise.resolve("unsupported");
    if (Notification.permission !== "default") return Promise.resolve(Notification.permission);
    try { return Notification.requestPermission().then((p) => { arm(); return p; }); }
    catch (e) { return Promise.resolve(Notification.permission); }
  }`,
  "supported / permission / ask");

patch(
`  function pushOwns() {
    try { return !!(STUTI_PUSH && STUTI_PUSH.subscribed()); } catch (e) { return false; }
  }`,
`  function pushOwns() {
    /* the OS's own alarm table counts as a server for this purpose: once it
       holds the week, a page left open must not ring the same cue again */
    try { const n = nativeCues(); if (n && n.owns()) return true; } catch (e) {}
    try { return !!(STUTI_PUSH && STUTI_PUSH.subscribed()); } catch (e) { return false; }
  }`,
  "pushOwns");

writeFileSync(FILE, t);
console.log("notify seam applied");

// The sheet's closing note is written for the web — "only while the app is
// open in a tab", "the browser's settings". Neither is true once the OS
// holds the cues, and a reciter who reads it decides the bells are broken.
const SHEET = join(HERE, "../../src/stuti-remind.tsx");
let r = readFileSync(SHEET, "utf8");
function patchSheet(from, to, what) { if (!r.includes(from)) throw new Error(`fix-notify-seam: anchor not found — ${what}`); r = r.replace(from, to); }
patchSheet(
`import { STUTI_NUDGE } from "./stuti-nudge";`,
`import { STUTI_NUDGE } from "./stuti-nudge";
import { notifyNote } from "./stuti-notify";`,
  "sheet import");
patchSheet(
`            {perm === "denied" ? L.t("notifBlocked", lang)
              : perm === "unsupported" ? L.t("notifNote", lang)
              : L.t("notifWhileOpen", lang)}`,
`            {notifyNote(lang, perm)
              || (perm === "denied" ? L.t("notifBlocked", lang)
              : perm === "unsupported" ? L.t("notifNote", lang)
              : L.t("notifWhileOpen", lang))}`,
  "the sheet's closing note");
writeFileSync(SHEET, r);
console.log("notify seam applied (sheet)");

// The sandhyā plate's own copy, which the sheet's note does not cover. Two
// problems, both reported as "the bell did nothing": it promised "while
// Stuti is open", which stopped being the phone's truth; and when a bell was
// switched on after that evening's window had already opened, it said the
// reminder was set without saying the first one it could ring was the next
// day's. It now names the hour it will actually ring at.
const SKY = join(HERE, "../../src/stuti-sky.tsx");
let k = readFileSync(SKY, "utf8");
function patchSky(from, to, what) { if (!k.includes(from)) throw new Error(`fix-notify-seam: anchor not found — ${what}`); k = k.replace(from, to); }
patchSky(
`import { STUTI_NUDGE } from "./stuti-nudge";`,
`import { STUTI_NUDGE } from "./stuti-nudge";
import { cueNote, cueRefusal } from "./stuti-notify";`,
  "sky import");
patchSky(
`    if (!N || !N.supported()) { setConfirmNote("Notifications aren't supported in this browser."); return; }
    if (N.permission() === "granted") return;
    N.ask().then((p) => { if (p !== "granted") setConfirmNote("Notifications are blocked — allow them for this site to get sandhyā nudges."); });`,
`    if (!N || !N.supported()) { setConfirmNote(cueRefusal("unsupported") || "Notifications aren't supported in this browser."); return; }
    if (N.permission() === "granted") return;
    N.ask().then((p) => { if (p !== "granted") setConfirmNote(cueRefusal("denied") || "Notifications are blocked — allow them for this site to get sandhyā nudges."); });`,
  "the plate's two refusals");
patchSky(
`    setConfirmNote(n === 0 ? "No sandhyā reminders are set."
      : lead ? \`You'll be nudged \${lead} min before \${n === 3 ? "each sandhyā" : n === 1 ? "the chosen sandhyā" : "the chosen sandhyās"} while Stuti is open.\`
      : \`You'll be nudged as \${n === 3 ? "each sandhyā" : n === 1 ? "the chosen sandhyā" : "each chosen sandhyā"} opens, while Stuti is open.\`);`,
`    setConfirmNote(n === 0 ? "No sandhyā reminders are set."
      : cueNote(n, lead)
      || (lead ? \`You'll be nudged \${lead} min before \${n === 3 ? "each sandhyā" : n === 1 ? "the chosen sandhyā" : "the chosen sandhyās"} while Stuti is open.\`
      : \`You'll be nudged as \${n === 3 ? "each sandhyā" : n === 1 ? "the chosen sandhyā" : "each chosen sandhyā"} opens, while Stuti is open.\`));`,
  "the plate's confirmation");
// The note stayed on the plate as written: switched on at 10:30 it still
// said "Next: Mādhyāhnika, today 10:47" at 11:15, with the window open and
// the first bell that could ring the evening's. It now keeps step with the
// plate's own minute tick, so once a cue's hour passes it names the next.
patchSky(
`  const bellSheet = bellOpen && (`,
`  React.useEffect(() => {
    if (!confirmNote || String(confirmNote).indexOf("Next: ") !== 0) return;
    const n = SY.ORDER.filter((id) => sandhyaOn[id]).length;
    const fresh = n ? cueNote(n, lead) : null;
    if (fresh && fresh !== confirmNote) setConfirmNote(fresh);
  });
  const bellSheet = bellOpen && (`,
  "the plate's live note");
writeFileSync(SKY, k);
console.log("notify seam applied (sky)");

/* ============================================================
   STUTI — the log relay
   Hand-authored. When something goes wrong on a tester's phone, the
   maker used to hear about it by message and then ask for files. Now
   the app sends them itself: a crash note (the page's error, the last
   console lines, the build's own diagnostics) and, after every Follow
   session, the session log and — on the phone, when it is not too
   large — the audio the ears heard, so a real chant can be replayed
   on a desk. Everything goes to a small Netlify function
   (netlify/functions/relay.mjs) that writes into the maker's Google
   Drive folder. No account on the phone, no name; the device carries a
   random id so one phone's sessions can be told from another's.
   Off with the switch in Settings (stuti-relay = "0").
   ============================================================ */
import { Capacitor } from "@capacitor/core";
import { STUTI_BUILD } from "./stuti-build";
import { STUTI_COUNT } from "./stuti-count";
import { voskAvailable, voskFileUrl, voskSessionFiles } from "./stuti-vosk";

const SITE = "https://stuti-app.netlify.app";
const PATH = "/.netlify/functions/relay";
const QKEY = "stuti-relay-q";
const MAX_WAV = 12 * 1024 * 1024;   // ~6 minutes of 16 kHz mono; longer sessions send the log alone

const native = Capacitor.isNativePlatform();
const onSite = /netlify\.app$/.test(location.hostname);
/** A dev server on localhost is not a tester's phone: stay quiet there. */
const dev = () => { try { return localStorage.getItem("stuti-relay-dev") === "1"; } catch (e) { return false; } };
const bot = /HeadlessChrome|Lighthouse|bot\b/i.test(navigator.userAgent);   // Netlify screenshots every deploy with a headless browser
const active = () => !bot && (native || onSite || dev()) && enabled();
const url = () => (onSite ? "" : SITE) + PATH;

export const enabled = () => { try { return localStorage.getItem("stuti-relay") !== "0"; } catch (e) { return true; } };
export const setEnabled = (on: boolean) => { try { localStorage.setItem("stuti-relay", on ? "1" : "0"); } catch (e) {} };

export const deviceId = (() => {
  let id: string | null = null;
  return () => {
    if (id) return id;
    try { id = localStorage.getItem("stuti-device"); } catch (e) {}
    if (!id) { id = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0")).join(""); try { localStorage.setItem("stuti-device", id); } catch (e) {} }
    return id;
  };
})();

const stamp = () => new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const header = () => {
  let d = ""; try { d = STUTI_BUILD.diagnostics(); } catch (e) {}
  return "# device=" + deviceId() + " platform=" + Capacitor.getPlatform() + "\n" + d.split("\n").map((l) => "# " + l).join("\n") + "\n";
};

/* ---- text: sent now, or queued for the next launch when the network is away ---- */
type Item = { name: string; mime: string; text: string };
const readQ = (): Item[] => { try { return JSON.parse(localStorage.getItem(QKEY) || "[]"); } catch (e) { return []; } };
const writeQ = (q: Item[]) => { try { localStorage.setItem(QKEY, JSON.stringify(q.slice(-12))); } catch (e) {} };

async function post(item: Item): Promise<"sent" | "later" | "dropped"> {
  try {
    const r = await fetch(url(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item), keepalive: true });
    if (r.ok) return "sent";
    return r.status === 503 || r.status >= 400 && r.status < 500 ? "dropped" : "later";   // unconfigured or refused: not worth keeping
  } catch (e) { return "later"; }
}

export async function relayText(name: string, text: string, mime = "text/plain"): Promise<boolean> {
  if (!active()) return false;
  const item = { name, mime, text: header() + text };
  const r = await post(item);
  if (r === "later") writeQ(readQ().concat(item));
  return r === "sent";
}

async function flush() {
  if (!active()) return;
  const q = readQ(); if (!q.length) return;
  writeQ([]);
  const keep: Item[] = [];
  for (const item of q) { const r = await post(item); if (r === "later") keep.push(item); }
  if (keep.length) writeQ(readQ().concat(keep));
}

/* ---- bytes: a resumable upload the function opens for us ---- */
export async function relayBlob(name: string, blob: Blob): Promise<boolean> {
  if (!active() || !blob.size) return false;
  try {
    const r = await fetch(url(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, mime: blob.type || "application/octet-stream", size: blob.size, resumable: true }) });
    if (!r.ok) return false;
    const { url: up } = await r.json();
    if (!up) return false;
    const put = await fetch(up, { method: "PUT", body: blob, headers: { "Content-Type": blob.type || "application/octet-stream" } });
    return put.ok;
  } catch (e) { return false; }
}

/* ---- a Follow session, after it ends ---- */
export async function relayFollowSession(o: { hymn: string; lang: string; lines: string[]; seconds: number; wav?: boolean }) {
  if (!active() || o.seconds < 8 || o.lines.length < 3) return;   // a tap-and-stop tells nothing
  const base = "follow-" + deviceId() + "-" + stamp() + "-" + String(o.hymn || "hymn").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 40);
  /* the audio is read first: a Keep two seconds later moves the file into
     the recitations shelf, and a session that was kept is exactly the one
     worth hearing */
  let blob: Blob | null = null;
  if (o.wav && native && voskAvailable()) {
    try {
      const f = await voskSessionFiles();
      if (f.wavBytes > 44 && f.wavBytes <= MAX_WAV) blob = new Blob([await (await fetch(voskFileUrl(f.wav))).blob()], { type: "audio/wav" });
    } catch (e) {}
  }
  await relayText(base + ".txt", o.lines.join("\n"));
  if (blob) { try { await relayBlob(base + ".wav", blob); } catch (e) {} }
}

/* ---- crashes: the page's own errors, with the last console lines ---- */
const ring: string[] = [];
const remember = (level: string, args: any[]) => {
  const line = new Date().toISOString().slice(11, 19) + " " + level + " " + args.map((a) => { try { return typeof a === "string" ? a : a instanceof Error ? a.stack || a.message : JSON.stringify(a); } catch (e) { return String(a); } }).join(" ");
  ring.push(line.slice(0, 600)); if (ring.length > 40) ring.shift();
};
let crashes = 0, crashTimer: any = null, pending: string[] = [];
function crash(what: string) {
  pending.push(what);
  if (crashTimer || crashes >= 3) return;
  crashTimer = setTimeout(() => {
    crashTimer = null; crashes++;
    let recent = ""; try { recent = JSON.stringify(STUTI_COUNT.recent().slice(-12)); } catch (e) {}
    const body = "## errors\n" + pending.join("\n\n") + "\n\n## console\n" + ring.join("\n") + "\n\n## recent\n" + recent + "\n";
    pending = [];
    relayText("crash-" + deviceId() + "-" + stamp() + ".txt", body);
  }, 4000);
}

let installed = false;
export function installRelay() {
  if (installed) return; installed = true;
  for (const level of ["error", "warn"] as const) {
    const orig = console[level];
    console[level] = (...args: any[]) => { remember(level, args); orig.apply(console, args); };
  }
  window.addEventListener("error", (e) => crash((e.message || "error") + "\n  at " + (e.filename || "?") + ":" + e.lineno + ":" + e.colno + (e.error && e.error.stack ? "\n" + e.error.stack : "")));
  window.addEventListener("unhandledrejection", (e: any) => { const r = e.reason; crash("unhandled rejection: " + (r && r.stack ? r.stack : String(r))); });
  window.addEventListener("online", () => { flush(); });
  setTimeout(flush, 3000);
}

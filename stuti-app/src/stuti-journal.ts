/* ============================================================
   STUTI — the journal: what a reciter did, in order
   Hand-authored. The counter (stuti-count.ts) knows a dozen verbs; the
   relay (stuti-relay.ts) knows crashes and Follow sessions. Between them
   lay everything a tester actually does — which screens, in what order,
   what was tapped, and where the app made them wait. This keeps that as
   one line per event, in a rolling log on the device, and hands it to
   the relay every ten minutes of use, whenever the app goes to the
   background, and at the next launch for whatever was left. What is
   written: the screen, the counter's own events, the label of a tapped
   control, and any task that held the page for more than half a second.
   Never a typed word, a verse, or a name.
   ============================================================ */
import { STUTI_COUNT } from "./stuti-count";
import { deviceId, relayText } from "./stuti-relay";

const KEY = "stuti-journal";
const MAX_LINES = 600;
const FLUSH_EVERY = 10 * 60 * 1000;
const FLUSH_AT = 20;   // lines since the last flush before a timer flush bothers
let lines: string[] = [];
let since = 0, screen = "", t0 = Date.now(), timer: any = null, flushing = false;

const clock = () => ((Date.now() - t0) / 1000).toFixed(1).padStart(7);
export function journal(kind: string, what = "") {
  const line = clock() + " " + kind + (what ? " " + what.replace(/\s+/g, " ").slice(0, 80) : "");
  lines.push(line); since++;
  if (lines.length > MAX_LINES) lines.splice(0, lines.length - MAX_LINES);
  save();
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ t0, lines })); } catch (e) {} };

/* the label a control shows — its aria-label, else its own text, else its class */
function labelOf(el: Element): string {
  const a = el.getAttribute("aria-label") || el.getAttribute("title");
  if (a) return a;
  const t = (el.textContent || "").trim();
  if (t) return t.slice(0, 40);
  const c = (el.getAttribute("class") || "").split(/\s+/)[0];
  return c ? "." + c : el.tagName.toLowerCase();
}

async function flush(why: string) {
  if (flushing || !lines.length || (why === "timer" && since < FLUSH_AT)) return;
  flushing = true;
  const body = lines.join("\n") + "\n";
  const held = lines; lines = []; since = 0; save();
  try {
    const ok = await relayText("journal-" + deviceId() + "-" + new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19) + "-" + why + ".txt", body);
    if (!ok) { lines = held.concat(lines).slice(-MAX_LINES); save(); }   // relay queued or declined: keep for next time
  } finally { flushing = false; }
}

let installed = false;
export function installJournal() {
  if (installed) return; installed = true;
  /* whatever the last launch left behind goes first */
  let left: string[] = [];
  try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s && Array.isArray(s.lines)) left = s.lines; } catch (e) {}
  if (left.length) { lines = left; since = left.length; setTimeout(() => flush("launch"), 5000); }
  else lines = [];
  t0 = Date.now();
  journal("open", innerWidth + "x" + innerHeight + (document.hidden ? " hidden" : ""));

  /* the counter's verbs, as they happen */
  const hit = STUTI_COUNT.hit;
  STUTI_COUNT.hit = (name: string, props?: any) => {
    const r = hit(name, props);
    if (name === "screen" && props && props.screen) { screen = String(props.screen); journal("screen", screen); }
    else if (r) journal("count", name + (props ? " " + Object.entries(props).map(([k, v]) => k + "=" + v).join(" ") : ""));
    return r;
  };

  /* every tapped control, by its label; typing is never captured */
  document.addEventListener("click", (e) => {
    const el = (e.target as Element | null)?.closest?.("button, a, [role=button], [role=tab], summary, input[type=checkbox], input[type=radio], select");
    if (!el) return;
    journal("tap", (screen ? screen + " · " : "") + labelOf(el));
  }, true);

  /* where the page held the reciter: main-thread tasks over half a second */
  try {
    new PerformanceObserver((l) => { for (const en of l.getEntries()) if (en.duration >= 500) journal("slow", Math.round(en.duration) + "ms on " + (screen || "?")); }).observe({ type: "longtask" });
  } catch (e) {}

  document.addEventListener("visibilitychange", () => { journal(document.hidden ? "hide" : "show"); if (document.hidden) flush("hide"); });
  window.addEventListener("pagehide", () => flush("hide"));
  timer = setInterval(() => { if (!document.hidden) flush("timer"); }, FLUSH_EVERY);
}

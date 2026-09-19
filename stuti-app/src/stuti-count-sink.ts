/* ============================================================
   STUTI — where the counters go
   Hand-authored. STUTI_COUNT (the design's) already decides what
   may be counted: twelve named events, a few enumerated facts,
   nothing typed by the reciter, nothing when Do Not Track is on.
   This is only the sink. Events are batched and written to the
   `stuti_events` table with the day, the platform and the build —
   no device id, no account, no time of day, no IP kept (Supabase's
   REST layer does not store it in the table, and the table has no
   column for it). Anyone can add a row; nobody without the service
   key can read one. Off when Supabase is not configured. Placed by
   tools/codemod/fix-count-seam.mjs.
   ============================================================ */
import { Capacitor } from "@capacitor/core";
import { STUTI_CLOUD_CONFIG as CFG } from "./stuti-cloud-config";

const on = () => !!(CFG.supabaseUrl && CFG.supabaseAnonKey) && !/HeadlessChrome|Lighthouse|bot\b/i.test(navigator.userAgent)
  && (Capacitor.isNativePlatform() || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname));   // a desk's dev server is not a reciter

let q: any[] = [], timer: any = null;
export const countSinkOn = on;

export function countSink(name: string, props: Record<string, string>) {
  if (!on()) return;
  q.push({ name, props, platform: Capacitor.getPlatform() });
  if (q.length >= 20) flush(); else if (!timer) timer = setTimeout(flush, 15000);
}

/* The build is stamped when the batch leaves, not when an event is counted.
   STUTI_COUNT counts app_open as it is imported — which is before main.tsx
   has run a line, so the label it sets was not there yet and the one event
   that says which build was opened went out unstamped. */
function flush() {
  clearTimeout(timer); timer = null;
  if (!q.length || !on()) return;
  const build = String((window as any).STUTI_BUILD_LABEL || "").slice(0, 40);   // set by main.tsx
  const rows = q.map((r) => ({ ...r, build })); q = [];
  try {
    fetch(CFG.supabaseUrl + "/rest/v1/stuti_events", {
      method: "POST", keepalive: true, body: JSON.stringify(rows),
      headers: { "Content-Type": "application/json", apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + CFG.supabaseAnonKey, Prefer: "return=minimal" },
    }).catch(() => {});
  } catch (e) {}
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });

import { Capacitor } from "@capacitor/core";
import { STUTI_CLOUD_CONFIG as CFG } from "./stuti-cloud-config";
import { cloud, configured } from "./stuti-cloud";
import { journal } from "./stuti-journal";
import { STUTI_NOTIFY } from "./stuti-notify";
import { STUTI_PREFS } from "./stuti-prefs";
import { STUTI_PUSH } from "./stuti-push";
import { b64u, seal, unb64u } from "./stuti-push-seal";
import { STUTI_LOC } from "./stuti-store";

/* ============================================================
   STUTI — the bell that reaches a closed browser
   Hand-authored; not part of the port.

   The phone already does this through the OS (stuti-notify.ts): it
   walks the week ahead, asks STUTI_CUES what falls due each day, and
   lays the answers in Android's alarm table. A browser has no alarm
   table, so here the same week goes to a server that keeps the time
   for it — and nothing else changes. The cues are the same cues, the
   words are the same words (STUTI_NOTIFY.words), the horizon is the
   same week, laid again each time the app is opened.

   Nothing is reckoned on the server. It could not do it faithfully:
   the cues read the vows, the plans, the keeps, the house's own tithis
   and the ledger, all of which live on the device, and a server running
   its own copy of the almanac would ring bells the page does not and
   miss ones it does. So the device does the reckoning and the server
   only keeps the minute.

   And the server cannot read what it keeps. Each bell is sealed on the
   device to this browser's own push keys (stuti-push-seal.ts) before it
   leaves; what Supabase holds is an endpoint, a time and ciphertext. A
   śrāddha bell names the person whose tithi it is, and that name does
   not need to sit in anyone's database to arrive.

   Who owns delivery: STUTI_NUDGE stands the page's own timer down once
   STUTI_PUSH.subscribed() is true, so the two can never both ring a cue.
   That is noted only after the server has accepted a week, and the
   server accepts one only while its sender has reported in cleanly in
   the last twenty minutes with the key this browser subscribed with. A
   browser is never left with its page silenced and nothing coming.
   ============================================================ */

const LAID = "stuti-push-laid";          /* { sig, at, endpoint } of the last accepted lay */
const FRESH = 12 * 3600000;              /* re-lay at least this often, to keep the week a week */

/* how long after its minute a bell is still worth delivering (the push
   service holds it that long for a phone that is offline), and whether it
   may wake a dozing one. A juncture is past its use quickly; the morning
   digest is not. */
const TTL: Record<string, number> = { sandhya: 900, tarpana: 1800, digest: 21600, mytithi: 21600 };
const URGENT: Record<string, string> = { sandhya: "high", tarpana: "high" };

let status = "off";                      /* off | idle | laid | asleep | refused | error */
let busy = false, again = false;

const native = () => Capacitor.isNativePlatform();
export const webPushAvailable = () =>
  !native() && configured() && !!CFG.pushKey
  && typeof navigator !== "undefined" && "serviceWorker" in navigator
  && typeof window !== "undefined" && "PushManager" in window && typeof Notification === "function";

function wants() {
  let r: any = {};
  try { r = (STUTI_PREFS.get() || {}).remind || {}; } catch (e) {}
  return !!(r.on || r.tarpana || Object.keys(r.sandhya || {}).some((k) => r.sandhya[k]));
}

function readLaid(): any { try { return JSON.parse(localStorage.getItem(LAID) || "null"); } catch (e) { return null; } }
function writeLaid(v: any) { try { v ? localStorage.setItem(LAID, JSON.stringify(v)) : localStorage.removeItem(LAID); } catch (e) {} }
function hash(s: string) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36) + ":" + s.length; }

/* `ready` never settles where no worker can run — a private window in some
   browsers, the desktop app's preview pane — so it is given a few seconds */
function registration(): Promise<ServiceWorkerRegistration | null> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<null>((res) => setTimeout(() => res(null), 8000)),
  ]).catch(() => null);
}

function sameKey(k: ArrayBuffer | null | undefined) {
  if (!k) return false;
  try { return b64u(new Uint8Array(k)) === b64u(unb64u(CFG.pushKey)); } catch (e) { return false; }
}

async function drop(endpoint: string | null | undefined) {
  if (!endpoint) return;
  const c = cloud();
  if (c) { try { await c.rpc("stuti_push_drop", { p_endpoint: endpoint }); } catch (e) {} }
}

/* the page takes its bells back: nothing queued anywhere, nothing noted */
async function standDown(sub: PushSubscription | null, why: string) {
  const noted: any = STUTI_PUSH.subscription();   /* typed never by the port */
  await drop(sub ? sub.endpoint : noted && noted.endpoint);
  if (noted && sub && noted.endpoint !== sub.endpoint) await drop(noted.endpoint);
  if (sub) { try { await sub.unsubscribe(); } catch (e) {} }
  if (noted) STUTI_PUSH.note(null);
  writeLaid(null);
  status = "idle";
  try { journal("push", "stood down: " + why); } catch (e) {}
}

/* the week, worded and stamped. The slot is stuti-notify's own hash of cue
   and day, so the server can tell bells apart without being told what any
   of them is. */
function weekAhead() {
  return STUTI_NOTIFY.week().map((c: any) => {
    const w = STUTI_NOTIFY.words(c);
    return {
      slot: STUTI_NOTIFY.slot(c.id + "|" + c.day),
      at: new Date(c.at).getTime(),
      kind: c.kind,
      msg: {
        t: String(w.title || "Stuti").slice(0, 120),
        b: String(w.text || "").slice(0, 900),
        u: w.hymn && w.hymn.id && w.hymn.deity ? "#reader/" + w.hymn.deity + "/" + w.hymn.id : "",
        g: c.id,
        d: new Date(c.at).getTime(),
      },
    };
  });
}

async function step(force: boolean) {
  const reg = await registration();
  if (!reg) { status = "off"; return; }
  let sub = await reg.pushManager.getSubscription();

  if (Notification.permission !== "granted" || !wants()) {
    if (sub || STUTI_PUSH.subscribed()) await standDown(sub, Notification.permission !== "granted" ? "permission " + Notification.permission : "no bell is switched on");
    else status = "idle";
    return;
  }

  /* a subscription made under another key can never be delivered to: the
     pair was replaced. Give it up and make a fresh one. */
  if (sub && !sameKey(sub.options && sub.options.applicationServerKey)) {
    await drop(sub.endpoint);
    try { await sub.unsubscribe(); } catch (e) {}
    sub = null;
  }
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: unb64u(CFG.pushKey) as unknown as BufferSource });
  const keys = (sub.toJSON().keys || {}) as { p256dh?: string; auth?: string };
  if (!keys.p256dh || !keys.auth) throw new Error("the subscription carries no keys");

  /* the push service may have replaced the endpoint since the last lay */
  const noted: any = STUTI_PUSH.subscription();   /* typed never by the port */
  if (noted && noted.endpoint && noted.endpoint !== sub.endpoint) await drop(noted.endpoint);

  const week = weekAhead();
  const sig = hash(sub.endpoint + "\n" + JSON.stringify(week));
  const last = readLaid();
  if (!force && last && last.sig === sig && last.endpoint === sub.endpoint && Date.now() - last.at < FRESH && STUTI_PUSH.subscribed()) return;

  const k = { p256dh: keys.p256dh, auth: keys.auth };
  const cues = await Promise.all(week.map(async (c) => ({
    slot: c.slot, at: c.at, ttl: TTL[c.kind] || 3600, urgency: URGENT[c.kind] || "normal",
    payload: b64u(await seal(k, JSON.stringify(c.msg))),
  })));

  const c = cloud();
  if (!c) return;
  const { data, error } = await c.rpc("stuti_push_lay", { p_endpoint: sub.endpoint, p_key: CFG.pushKey, p_cues: cues });
  if (error) {
    /* offline, or Supabase unreachable: whatever was laid before is still on
       the server and still true for its week, so nothing changes here */
    status = "error";
    try { journal("push", "lay failed: " + String(error.message || error).slice(0, 120)); } catch (e) {}
    return;
  }
  const d: any = data || {};
  if (!d.ok) {
    /* the sender is not running, or not with our key. Take back anything
       queued so it cannot ring alongside the page later, and let the page
       ring its own bells meanwhile. */
    status = d.reason === "asleep" ? "asleep" : "refused";
    await drop(sub.endpoint);
    if (STUTI_PUSH.subscribed()) STUTI_PUSH.note(null);
    writeLaid(null);
    try { journal("push", "lay refused: " + d.reason + (d.note ? " (" + String(d.note).slice(0, 80) + ")" : "")); } catch (e) {}
    return;
  }
  writeLaid({ sig, at: Date.now(), endpoint: sub.endpoint });
  /* only the endpoint is noted: the auth secret has no business in the cue
     record that stuti-cloud.ts sends for a signed-in reciter */
  STUTI_PUSH.note({ endpoint: sub.endpoint, at: Date.now() });
  status = "laid";
  try {
    const next = week[0];
    journal("push", "laid=" + d.laid + " of " + week.length + (next ? " next=" + next.msg.g + "@" + new Date(next.at).toISOString() : " next=none"));
  } catch (e) {}
}

/* one pass at a time; a change that arrives mid-pass gets one more after it */
async function reconcile(force = false) {
  if (!webPushAvailable()) return;
  if (busy) { again = true; return; }
  busy = true;
  try { await step(force); }
  catch (e: any) { status = "error"; try { journal("push", "error: " + String(e && e.message || e).slice(0, 160)); } catch (x) {} }
  finally {
    busy = false;
    if (again) { again = false; reconcile(); }
  }
}

let soon: any = null;
const later = (ms = 1500) => { clearTimeout(soon); soon = setTimeout(() => reconcile(), ms); };

/* a tapped bell names a hymn; the worker hands it to an open window rather
   than opening a second one (public/stuti-push-sw.js) */
function routing() {
  navigator.serviceWorker.addEventListener("message", (ev: MessageEvent) => {
    const m: any = ev.data;
    if (!m || m.stuti !== "open" || typeof m.u !== "string" || m.u.charAt(0) !== "#") return;
    /* setting a hash to what it already says raises no event, which is the
       case of the same hymn cued two mornings running */
    try {
      if (location.hash === m.u) window.dispatchEvent(new Event("hashchange"));
      else location.hash = m.u;
    } catch (e) {}
  });
}

let started = false;
export function installWebPush() {
  /* on window for a tester's console and the journal's reader: whether it is
     on, how the last lay went, and the week it would send, in plain words */
  try { (window as any).STUTI_WEB_PUSH = STUTI_WEB_PUSH; } catch (e) {}
  if (started || !webPushAvailable()) return;
  started = true;
  status = "idle";
  routing();
  /* whatever changes what is due lays the week again: the reminder sheet, a
     change of place, and coming back to the app — the only moment a browser
     that has been shut for days gets its horizon back. Leaving the app lays
     it too, so a portion finished just now is not announced tomorrow. */
  try { STUTI_PREFS.subscribe(() => later()); } catch (e) {}
  try { STUTI_LOC.subscribe(() => later()); } catch (e) {}
  document.addEventListener("visibilitychange", () => later(document.hidden ? 0 : 800));
  window.addEventListener("online", () => later(500));
  /* the bell taps ask for permission through STUTI_NUDGE.ask(); the answer
     arrives here, so the subscription follows the reciter's own yes */
  try {
    const perms = (navigator as any).permissions;
    if (perms) perms.query({ name: "notifications" }).then((p: any) => { p.onchange = () => later(200); }).catch(() => {});
  } catch (e) {}
  later(3000);
}

export const STUTI_WEB_PUSH = {
  available: webPushAvailable,
  status: () => status,
  owns: () => !native() && STUTI_PUSH.subscribed(),
  sync: (force = false) => reconcile(force),
  week: () => weekAhead(),
  words: (cue: any) => STUTI_NOTIFY.words(cue),
};

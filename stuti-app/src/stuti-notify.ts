import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { STUTI } from "./stuti-data";
import { STUTI_CUES } from "./stuti-cues";
import { STUTI_L } from "./stuti-i18n";
import { journal } from "./stuti-journal";
import { STUTI_NUDGE } from "./stuti-nudge";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { STUTI_PREFS } from "./stuti-prefs";
import { STUTI_SANDHYA } from "./stuti-sandhya-core";
import { STUTI_LOC } from "./stuti-store";

/* ============================================================
   STUTI — the bell the phone rings
   Hand-authored; not part of the port.

   The prototype rings its bells with `new Notification(...)` from the
   page, which is honest on a desktop browser and useless everywhere the
   app actually lives: the Android WebView has no Notification
   constructor at all, so on the phone every cue was computed, found due,
   and then dropped on the floor. The reminder sheet, reading the same
   unsupported answer, told the reciter their bells were on.

   So the phone hands its cues to the OS instead. Nothing about *what* is
   due is reckoned here — STUTI_CUES still answers that and STUTI_NUDGE
   still words it, exactly as the page and a future server would; this
   file only walks the next few days, asks for each day's cues, and lays
   them in Android's own alarm table. Which means they arrive with the
   app closed, and survive a reboot.

   The horizon is a week, re-laid every time the app is opened. A cue
   cannot be computed on a phone that never opens Stuti — sunrise moves,
   vows fall due, the digest names a hymn — so a week of silence is the
   honest limit rather than a repeating alarm with a body that slowly
   stops being true.

   While this owns delivery the page timer must stand down, or a reciter
   with Stuti open at 6am hears the same cue twice. STUTI_NUDGE asks
   window.STUTI_NATIVE_CUES before it posts; the seam that teaches it to
   is tools/codemod/fix-notify-seam.mjs.
   ============================================================ */

const DAY = 86400000;
const HORIZON = 7;          /* days laid out ahead */
const CHANNEL = "stuti-cues";

const native = () => Capacitor.isNativePlatform();

/* Capacitor answers permission asynchronously; the reminder sheet asks
   synchronously, mid-render. So the answer is cached, refreshed at start
   and after every request. */
let perm: string = "prompt";
let laying = false;

const lang = () => { try { return localStorage.getItem("stuti-lang") || "deva"; } catch (e) { return "deva"; } };

/* a stable positive 32-bit id for a cue on a day — the same cue re-laid on
   a later pass overwrites its own alarm instead of adding a second */
function slot(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 1) % 2000000000 || 1;
}

/* the words, taken from the same places the page takes them, so a cue that
   arrives from the OS reads exactly like one that arrived from the tab */
function words(cue: any) {
  const lg = lang(), L = STUTI_L, P = AKSHARA_PANCHANGA, SY = STUTI_SANDHYA;
  if (cue.kind === "sandhya") {
    const k = cue.kala;
    return {
      title: "Stuti · " + SY.name(k.label, lg),
      text: L.t("sandhyaNudge", lg) + " · " + P.fmtTime(((k.best.start % 1440) + 1440) % 1440) + " – " + P.fmtTime(((k.best.end % 1440) + 1440) % 1440),
      hymn: null as any,
    };
  }
  const parts = STUTI_NUDGE.digestParts(cue.items, lg);
  const one = (cue.items || []).filter((x: any) => x.kind === "vow" || x.kind === "plan");
  if (parts.length) {
    return { title: "Stuti", text: parts.join(" · "), hymn: one.length === 1 ? STUTI.hymnById(one[0].hymn) || null : null };
  }
  const b = STUTI_NUDGE.body(lg);
  return { title: "Stuti", text: b.title + " — " + b.text, hymn: b.hymn };
}

/* every cue due between now and the horizon. STUTI_CUES.ring answers for
   the day it is handed, so the week is seven questions, de-duplicated by
   the cue's own id-and-day — sandhyā upcoming reaches into tomorrow and
   would otherwise be laid twice. */
function week() {
  const out: any[] = [], seen: Record<string, boolean> = {}, now = Date.now();
  for (let off = 0; off < HORIZON; off++) {
    const at = new Date(now + off * DAY);
    let cues: any[] = [];
    try { cues = STUTI_CUES.ring(STUTI_CUES.ctx(at)); } catch (e) { cues = []; }
    cues.forEach((c) => {
      const k = c.id + "|" + c.day;
      if (seen[k] || c.at.getTime() <= now) return;
      seen[k] = true;
      out.push(c);
    });
  }
  return out.sort((a, b) => a.at - b.at);
}

/* Android wants a channel before it will let a notification make a sound */
async function channel() {
  if (Capacitor.getPlatform() !== "android") return;
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL, name: "Stuti", description: "Daily and sandhyā cues",
      importance: 4, visibility: 1, sound: undefined, vibration: true,
    } as any);
  } catch (e) {}
}

async function refresh() {
  try { perm = (await LocalNotifications.checkPermissions()).display; } catch (e) { perm = "denied"; }
  return perm;
}

/* asking is the reciter's own doing — the sheet calls this when a bell is
   switched on, never on load */
async function ask() {
  if (!native()) return "unsupported";
  try { perm = (await LocalNotifications.requestPermissions()).display; } catch (e) {}
  lay();
  return perm;
}

/* clear what we laid before and lay the week again. Only ours are cancelled:
   getPending is filtered to the ids we would have minted. */
async function lay() {
  if (!native() || laying) return;
  if (perm !== "granted") return;
  laying = true;
  try {
    const cues = week();
    const wanted: Record<number, any> = {};
    cues.forEach((c) => { wanted[slot(c.id + "|" + c.day)] = c; });

    let pending: any[] = [];
    try { pending = ((await LocalNotifications.getPending()) || {}).notifications || []; } catch (e) {}
    const stale = pending.filter((n: any) => n.extra && n.extra.stuti && !wanted[n.id]).map((n: any) => ({ id: n.id }));
    if (stale.length) { try { await LocalNotifications.cancel({ notifications: stale }); } catch (e) {} }

    const held: Record<number, boolean> = {};
    pending.forEach((n: any) => { if (n.extra && n.extra.stuti) held[n.id] = true; });

    const fresh = cues
      .filter((c) => !held[slot(c.id + "|" + c.day)])
      .map((c) => {
        const w = words(c);
        return {
          id: slot(c.id + "|" + c.day),
          title: w.title,
          body: w.text,
          channelId: CHANNEL,
          schedule: { at: new Date(c.at), allowWhileIdle: true },
          extra: { stuti: 1, cue: c.id, day: c.day, hymn: w.hymn ? { id: w.hymn.id, deity: w.hymn.deity } : null },
        };
      });
    if (fresh.length) { try { await LocalNotifications.schedule({ notifications: fresh } as any); } catch (e) {} }
    /* the first night of this shipped, the journal could say the bells were
       permitted but not whether anything had been laid — which is the only
       question that matters when a reciter reports silence */
    try {
      const next = cues[0];
      journal("cues", "laid=" + fresh.length + " held=" + (cues.length - fresh.length) + " dropped=" + stale.length
        + (next ? " next=" + next.id + "@" + new Date(next.at).toISOString() : " next=none"));
    } catch (e) {}
  } finally { laying = false; }
}

/* a tapped cue opens what it named */
function routing() {
  try {
    LocalNotifications.addListener("localNotificationActionPerformed", (ev: any) => {
      const h = ev && ev.notification && ev.notification.extra && ev.notification.extra.hymn;
      if (h && h.id && h.deity) { try { location.hash = "#reader/" + h.deity + "/" + h.id; } catch (e) {} }
    });
  } catch (e) {}
}

/* what STUTI_NUDGE and the reminder sheet see through the seam */
const owner = {
  supported: () => native(),
  permission: () => (perm === "prompt" || perm === "prompt-with-rationale" ? "default" : perm === "granted" ? "granted" : "denied"),
  ask: () => ask().then(() => owner.permission()),
  owns: () => native() && perm === "granted",
};

export async function installNotify() {
  if (!native()) return;
  (window as any).STUTI_NATIVE_CUES = owner;
  routing();
  await channel();
  await refresh();
  lay();
  /* anything that changes what is due re-lays the week: the reminder sheet,
     a change of place, and every return to the app — which is also the only
     moment a phone that has been closed for days gets its horizon back */
  try { STUTI_PREFS.subscribe(() => lay()); } catch (e) {}
  try { STUTI_LOC.subscribe(() => lay()); } catch (e) {}
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh().then(lay); });
}

export const STUTI_NOTIFY = { installNotify, lay, ask, refresh, week, words, permission: () => owner.permission(), available: native };

/* What the reminder sheet may honestly say once the OS holds the cues. The
   generated copy is written for the web — "only while the app is open in a
   tab", "the browser's settings" — and is simply untrue on a phone. Kept
   here rather than in stuti-i18n.ts, which the port overwrites. */
export function notifyNote(lang: string, perm: string) {
  if (!native()) return null;
  const s = perm === "denied"
    ? {
        roman: "Notifications are turned off for Stuti. Allow them in the phone's settings, then reopen this panel.",
        deva: "स्तुति के लिए सूचनाएँ बंद हैं। फ़ोन की सेटिंग्स में उन्हें चालू करें, फिर यह पैनल दोबारा खोलें।",
        telugu: "స్తుతికి నోటిఫికేషన్‌లు ఆపివేయబడ్డాయి. ఫోన్ సెట్టింగ్‌లలో వాటిని అనుమతించి, ఈ ప్యానెల్ మళ్లీ తెరవండి.",
      }
    : {
        roman: "Cues are handed to the phone, so they arrive with Stuti closed. The week ahead is laid out again each time you open the app.",
        deva: "सूचनाएँ फ़ोन को सौंप दी जाती हैं, इसलिए स्तुति बंद होने पर भी आती हैं। हर बार ऐप खोलने पर आगे का सप्ताह फिर से तय हो जाता है।",
        telugu: "సూచనలు ఫోన్‌కు అప్పగించబడతాయి, కాబట్టి స్తుతి మూసి ఉన్నా వస్తాయి. యాప్ తెరిచిన ప్రతిసారీ ముందున్న వారం మళ్లీ సిద్ధమవుతుంది.",
      };
  return lang === "telugu" ? s.telugu : lang === "roman" ? s.roman : s.deva;
}

/* When a bell is switched on, say when it will actually ring. The sky plate
   promised "while Stuti is open", which the phone no longer needs — and said
   nothing about the case that brought this on: a sāyaṃ bell set at 6:52pm,
   two hours after that evening's window had opened, so the first cue it could
   possibly ring was the next day's. Nothing was broken and nothing was going
   to arrive, and the screen had no way to say so. */
export function cueNote(count: number, lead: number) {
  if (!native() || !count) return null;
  const soon = week().filter((c: any) => c.kind === "sandhya")[0];
  if (!soon) return "Set — but nothing falls in the next week. Check the quiet hours, which may be swallowing every chosen juncture.";
  const at = new Date(soon.at), now = new Date();
  const sameDay = at.toDateString() === now.toDateString();
  const tomorrow = at.toDateString() === new Date(now.getTime() + 86400000).toDateString();
  const when = (sameDay ? "today" : tomorrow ? "tomorrow" : at.toLocaleDateString(undefined, { weekday: "long" }))
    + " " + at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const name = STUTI_SANDHYA.name(soon.kala.label, "roman");
  const opens = new Date(at.getTime() + lead * 60000);   // the cue is laid lead minutes before the window
  return "Next: " + name + ", " + when + (lead ? " (" + lead + " min before it opens at " + opens.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) + ")" : "")
    + ". Reminders arrive with Stuti closed.";
}

/* the sky plate's two refusals, which speak of browsers and sites */
export function cueRefusal(kind: "unsupported" | "denied") {
  if (!native()) return null;
  return kind === "denied"
    ? "Notifications are turned off for Stuti — allow them in the phone's settings to get sandhyā reminders."
    : "This device cannot post notifications.";
}

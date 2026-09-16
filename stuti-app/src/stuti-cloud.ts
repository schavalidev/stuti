/* ============================================================
   STUTI — the account, sync, and the cue record, for real
   Hand-authored. The design's stuti-auth.ts is a stub with the
   right shape (get, signedIn, signIn, signOut, syncState,
   subscribe); this is the same shape against Supabase, plus the
   two steps a real sign-in needs (send a code, verify it) and
   Google. The account screen is wired to it by
   tools/codemod/fix-account-seam.mjs.

   Sync is local-first. Every store keeps writing its own
   localStorage key as it always has; stuti-sync-hook.ts stamps
   the ones that belong to the reciter, and this file carries
   those keys to one row each in `stuti_kv`, newest stamp winning.
   A copy pulled from another phone is written straight into
   localStorage, and because the stores read their keys once at
   start, the app reloads the next time it is put away — never in
   front of the reciter, except right after they sign in, when a
   reload is what they are waiting for.

   The cue record (STUTI_PUSH.record: place, sandhyā reminders,
   quiet hours, digest time, vows) goes to `stuti_cue_prefs`, one
   row per device, whenever it changes. The flyleaf's name and
   gotra travel nowhere: not in that record, and not in sync
   either, because the saṅkalpa panel promises they stay on the phone.
   ============================================================ */
import { createClient, type SupabaseClient, type Session } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { STUTI_CLOUD_CONFIG as CFG } from "./stuti-cloud-config";
import { readMeta, writeMeta, rawSet, rawRemove, onLocalChange, syncs } from "./stuti-sync-hook";

const native = Capacitor.isNativePlatform();
const NATIVE_REDIRECT = "com.stuti.app://auth-callback";

export const configured = () => !!(CFG.supabaseUrl && CFG.supabaseAnonKey);

let client: SupabaseClient | null = null;
export function cloud(): SupabaseClient | null {
  if (!configured()) return null;
  if (!client) {
    client = createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: { storageKey: "stuti-cloud-auth", persistSession: true, autoRefreshToken: true, detectSessionInUrl: !native, flowType: "pkce" },
    });
  }
  return client;
}

/* ---------------- the account ---------------- */
export type Provider = "google" | "phone" | "email";
type Shape = { provider: Provider; name: string; handle: string; id: string; at: number; stub: false };
type SyncState = "off" | "signedOut" | "syncing" | "synced" | "offline" | "error";

let session: Session | null = null;
let state: SyncState = configured() ? "signedOut" : "off";
const subs = new Set<(s: Shape | null) => void>();

function shape(): Shape | null {
  const u = session && session.user;
  if (!u) return null;
  const p = (u.app_metadata && u.app_metadata.provider) || (u.phone ? "phone" : "email");
  const md: any = u.user_metadata || {};
  return {
    provider: (p === "google" ? "google" : p === "phone" ? "phone" : "email") as Provider,
    name: md.stuti_name || md.full_name || md.name || "",
    handle: u.email || (u.phone ? "+" + u.phone.replace(/^\+/, "") : ""),
    id: u.id, at: Date.parse(u.created_at) || Date.now(), stub: false,
  };
}
let snap: Shape | null = null;
const emit = () => { snap = shape(); subs.forEach((fn) => { try { fn(snap); } catch (e) {} }); };
const setState = (s: SyncState) => { if (state !== s) { state = s; emit(); } };

/** a phone number as Supabase wants it: E.164, India assumed when no country code is typed */
export function e164(raw: string) {
  const d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  const digits = d.replace(/^0+/, "");
  return digits.length === 10 ? "+91" + digits : "+" + digits;
}

async function sendCode(method: "phone" | "email", handle: string): Promise<{ ok: boolean; error?: string }> {
  const c = cloud(); if (!c) return { ok: false, error: "off" };
  const r = method === "email"
    ? await c.auth.signInWithOtp({ email: handle.trim(), options: { shouldCreateUser: true } })
    : await c.auth.signInWithOtp({ phone: e164(handle), options: { shouldCreateUser: true } });
  return r.error ? { ok: false, error: r.error.message } : { ok: true };
}

async function verify(method: "phone" | "email", handle: string, code: string, name?: string): Promise<{ ok: boolean; error?: string }> {
  const c = cloud(); if (!c) return { ok: false, error: "off" };
  const token = code.replace(/\s/g, "");
  const r = method === "email"
    ? await c.auth.verifyOtp({ email: handle.trim(), token, type: "email" })
    : await c.auth.verifyOtp({ phone: e164(handle), token, type: "sms" });
  if (r.error) return { ok: false, error: r.error.message };
  if (name && name.trim()) { try { await c.auth.updateUser({ data: { stuti_name: name.trim() } }); } catch (e) {} }
  return { ok: true };
}

async function google(): Promise<{ ok: boolean; error?: string }> {
  const c = cloud(); if (!c) return { ok: false, error: "off" };
  if (!native) {
    const r = await c.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } });
    return r.error ? { ok: false, error: r.error.message } : { ok: true };
  }
  /* on the phone the consent page opens in the system browser and comes back
     through the app's own scheme (the intent filter in AndroidManifest.xml) */
  const r = await c.auth.signInWithOAuth({ provider: "google", options: { redirectTo: NATIVE_REDIRECT, skipBrowserRedirect: true } });
  if (r.error || !r.data.url) return { ok: false, error: (r.error && r.error.message) || "no url" };
  const { Browser } = await import("@capacitor/browser");
  await Browser.open({ url: r.data.url });
  return { ok: true };
}

async function signOut() {
  const c = cloud();
  if (c) { try { await c.auth.signOut(); } catch (e) {} }
  session = null;
  try { rawRemove.call(localStorage, CURSOR); } catch (e) {}
  setState(configured() ? "signedOut" : "off");
  emit();
}

async function rename(name: string) {
  const c = cloud(); if (!c || !session) return;
  const r = await c.auth.updateUser({ data: { stuti_name: name.trim() } });
  if (!r.error && r.data.user && session) { session = { ...session, user: r.data.user }; emit(); }
}

export const STUTI_CLOUD_AUTH = {
  get: () => snap,
  signedIn: () => !!snap,
  configured,
  providers: () => CFG.providers,
  /* kept for the stub's callers: a real sign-in cannot happen in one call */
  signIn: (provider: Provider) => (provider === "google" ? google() : Promise.resolve({ ok: false, error: "use sendCode" })),
  sendCode, verify, google, signOut, rename,
  syncState: () => (snap ? state : configured() ? "signedOut" : "off"),
  syncNow: () => sync(true),
  subscribe: (fn: (s: Shape | null) => void) => { subs.add(fn); return () => { subs.delete(fn); }; },
};

/* ---------------- sync ---------------- */
const CURSOR = "stuti-sync-cursor";      // the newest server updated_at seen, per signed-in user
const FIRST = "stuti-sync-joined";       // the user id this device's existing data was first merged into
let busy = false, again = false, reloadOnHide = false, timer: any = null;

async function sync(interactive = false) {
  const c = cloud(); if (!c || !session) return;
  if (busy) { again = true; return; }
  busy = true; setState("syncing");
  const uid = session.user.id;
  try {
    const meta = readMeta();

    /* the first time this device meets this account, everything already on
       it is offered up — stamped 1, so any copy the account already holds
       (from a phone that has been syncing) wins, and anything the account
       lacks is filled from here. Keys the hook has stamped keep their real time. */
    let joined = ""; try { joined = localStorage.getItem(FIRST) || ""; } catch (e) {}
    if (joined !== uid) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && syncs(k)) { if (!meta.ts[k]) meta.ts[k] = 1; if (meta.dirty.indexOf(k) === -1) meta.dirty.push(k); }
      }
      try { rawRemove.call(localStorage, CURSOR); } catch (e) {}
    }

    /* pull what changed on the server since last time */
    let cursor = ""; try { cursor = localStorage.getItem(CURSOR) || ""; } catch (e) {}
    let q = c.from("stuti_kv").select("key,value,ts,updated_at").eq("user_id", uid).order("updated_at", { ascending: true }).limit(1000);
    if (cursor) q = q.gt("updated_at", cursor);
    const { data: rows, error } = await q;
    if (error) throw error;
    const remoteTs: Record<string, number> = {};
    let changed = 0;
    for (const r of rows || []) {
      remoteTs[r.key] = Number(r.ts) || 0;
      if (r.updated_at > cursor) cursor = r.updated_at;
      if (!syncs(r.key)) continue;
      const mine = meta.ts[r.key] || 0;
      if (remoteTs[r.key] <= mine) continue;
      const cur = localStorage.getItem(r.key);
      if (r.value === null) { if (cur !== null) { rawRemove.call(localStorage, r.key); changed++; } }
      else if (cur !== r.value) { rawSet.call(localStorage, r.key, r.value); changed++; }
      meta.ts[r.key] = remoteTs[r.key];
      meta.dirty = meta.dirty.filter((k) => k !== r.key);
    }

    /* push what changed here and is still newer than the server's copy */
    const out = meta.dirty.filter((k) => syncs(k) && !(remoteTs[k] >= (meta.ts[k] || 0) && remoteTs[k] !== undefined))
      .map((k) => ({ user_id: uid, key: k, value: localStorage.getItem(k), ts: meta.ts[k] || Date.now() }));
    for (let i = 0; i < out.length; i += 200) {
      const { error: e2 } = await c.from("stuti_kv").upsert(out.slice(i, i + 200), { onConflict: "user_id,key" });
      if (e2) throw e2;
    }
    const sent = new Set(out.map((o) => o.key));
    const now = readMeta();                        // a store may have written while we were away on the network
    now.dirty = now.dirty.filter((k) => !sent.has(k) || (now.ts[k] || 0) > (meta.ts[k] || 0));
    for (const k of Object.keys(meta.ts)) if (!now.ts[k] || now.ts[k] < meta.ts[k]) now.ts[k] = meta.ts[k];
    writeMeta(now);
    if (cursor) rawSet.call(localStorage, CURSOR, cursor);
    rawSet.call(localStorage, FIRST, uid);

    await sendCueRecord(c, uid);
    setState("synced");

    if (changed) {
      if (interactive || document.visibilityState === "hidden") location.reload();
      else reloadOnHide = true;
    }
  } catch (e: any) {
    setState(navigator.onLine === false || /fetch|network/i.test(String(e && e.message)) ? "offline" : "error");
  } finally {
    busy = false;
    if (again) { again = false; schedule(1500); }
  }
}
const schedule = (ms = 4000) => { clearTimeout(timer); timer = setTimeout(() => sync(), ms); };

/* ---------------- the cue record ---------------- */
const CUE_SENT = "stuti-cue-sent";
async function sendCueRecord(c: SupabaseClient, uid: string) {
  let rec: any = null;
  try { const { STUTI_PUSH } = await import("./stuti-push"); rec = STUTI_PUSH.record(); } catch (e) { return; }
  if (!rec) return;
  const body = JSON.stringify(rec);
  let last = ""; try { last = localStorage.getItem(CUE_SENT) || ""; } catch (e) {}
  const sig = uid + ":" + body.length + ":" + hash(body);
  if (last === sig) return;
  let device = ""; try { const { deviceId } = await import("./stuti-relay"); device = deviceId(); } catch (e) { device = "unknown"; }
  const { error } = await c.from("stuti_cue_prefs").upsert({ user_id: uid, device, platform: Capacitor.getPlatform(), record: rec }, { onConflict: "user_id,device" });
  if (!error) rawSet.call(localStorage, CUE_SENT, sig);
}
function hash(s: string) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }

/* ---------------- start ---------------- */
let started = false;
export async function installCloud() {
  if (started) return; started = true;
  const c = cloud();
  if (!c) { emit(); return; }

  c.auth.onAuthStateChange((ev, s) => {
    const before = session && session.user.id;
    session = s;
    if (!s) setState("signedOut");
    emit();
    if (s && (ev === "SIGNED_IN" && before !== s.user.id)) setTimeout(() => sync(true), 0);
    else if (s && ev === "INITIAL_SESSION") schedule(1200);
  });

  if (native) {
    const { App } = await import("@capacitor/app");
    App.addListener("appUrlOpen", async ({ url }) => {
      if (!url.startsWith(NATIVE_REDIRECT)) return;
      try { const { Browser } = await import("@capacitor/browser"); await Browser.close(); } catch (e) {}
      const code = new URL(url.replace(NATIVE_REDIRECT, "https://x/cb")).searchParams.get("code");
      if (code) await c.auth.exchangeCodeForSession(code);
    });
    App.addListener("resume", () => schedule(500));
  }

  onLocalChange(() => { if (session) schedule(); });
  window.addEventListener("online", () => schedule(500));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (reloadOnHide) { reloadOnHide = false; setTimeout(() => location.reload(), 50); return; }
      if (session && readMeta().dirty.length) sync();
    } else if (session) schedule(800);
  });
}

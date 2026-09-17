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
   those keys to one row each in `stuti_kv`, newest stamp winning —
   except for the reciter's record (japa, the thread, vows, plans,
   keeps, the ledger…). When this phone and the account hold two
   different records, nothing is merged and nothing is overwritten:
   sync stops in state "conflict" and the account screen asks which
   to keep. That happens on a device's first sign-in when both sides
   already hold practice, and later for any record key changed on
   both sides since they last agreed.
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
type SyncState = "off" | "signedOut" | "syncing" | "synced" | "offline" | "error" | "conflict";

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

async function signOut(scope: "global" | "local" = "global") {
  const c = cloud();
  if (c) { try { await c.auth.signOut({ scope }); } catch (e) {} }
  session = null; pending = null;
  try { rawRemove.call(localStorage, CURSOR); } catch (e) {}
  setState(configured() ? "signedOut" : "off");
  emit();
}

/* Removes the account and everything the server holds under it (the
   cascade in schema.sql). What is on this phone stays: the reciter's
   practice was theirs before the account and remains so after it. */
async function deleteAccount(): Promise<{ ok: boolean; error?: string }> {
  const c = cloud(); if (!c || !session) return { ok: false, error: "off" };
  const { error } = await c.rpc("stuti_delete_my_account");
  if (error) return { ok: false, error: error.message };
  for (const k of [CURSOR, FIRST, CUE_SENT]) { try { rawRemove.call(localStorage, k); } catch (e) {} }
  const m = readMeta(); delete m.base; writeMeta(m);
  await signOut("local");      // the user is gone server-side; only the local session is left to drop
  return { ok: true };
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
  sendCode, verify, google, signOut: () => signOut(), rename, deleteAccount,
  syncState: () => (snap ? state : configured() ? "signedOut" : "off"),
  /** the two records awaiting a choice, summarised for the screen; null when none */
  conflict: () => (pending && snap ? { whole: pending.whole, keys: pending.keys.length, here: pending.here, account: pending.account } : null),
  resolve: (keep: "phone" | "account") => resolve(keep),
  syncNow: () => sync(true),
  subscribe: (fn: (s: Shape | null) => void) => { subs.add(fn); return () => { subs.delete(fn); }; },
};

/* ---------------- sync ---------------- */
const CURSOR = "stuti-sync-cursor";      // the newest server updated_at seen, per signed-in user
const FIRST = "stuti-sync-joined";       // the user id this device's existing data was first merged into
let busy = false, again = false, reloadOnHide = false, timer: any = null;

/* The reciter's record: what they did, as against how the app is set up.
   These are never settled by clock alone. Settings (theme, script, font
   size, reading positions…) still go to the newer stamp. */
const RECORD_EXACT = new Set(["stuti-favs", "stuti-favs-week", "stuti-japa", "stuti-plans", "stuti-thread", "stuti-vows",
  "stuti-watch", "stuti-keep", "stuti-my-tithis", "stuti-pitru-register", "stuti-dana", "stuti-ledger"]);
const isRecord = (k: string) => RECORD_EXACT.has(k) || k.startsWith("stuti-practice-");
const empty = (v: string | null | undefined) => v == null || v === "" || v === "{}" || v === "[]" || v === "null";

type Row = { key: string; value: string | null; ts: number };
export type Summary = { japa: number; days: number; vows: number; favs: number; last: number };
type Pending = { whole: boolean; keys: string[]; remote: Record<string, Row>; here: Summary; account: Summary };
let pending: Pending | null = null;

function summarise(get: (k: string) => string | null | undefined, stamps: number[]): Summary {
  const j = (k: string) => { try { return JSON.parse(get(k) || "null"); } catch (e) { return null; } };
  const japa = j("stuti-japa"), thread = j("stuti-thread"), vows = j("stuti-vows"), favs = j("stuti-favs");
  let total = 0;
  if (japa && typeof japa === "object") for (const id of Object.keys(japa)) total += Number(japa[id] && japa[id].total) || 0;
  let days = 0;
  if (thread && typeof thread === "object") for (const d of Object.keys(thread)) { const r = thread[d]; if (r && ((r.r && r.r.length) || (r.p && r.p.length) || r.j > 0)) days++; }
  return { japa: total, days, vows: Array.isArray(vows) ? vows.length : 0, favs: Array.isArray(favs) ? favs.length : 0,
    last: stamps.filter((x) => x > 1).reduce((a, b) => Math.max(a, b), 0) };
}

function hold(whole: boolean, keys: string[], remote: Record<string, Row>, meta: { ts: Record<string, number> }) {
  pending = {
    whole, keys, remote,
    here: summarise((k) => localStorage.getItem(k), keys.map((k) => meta.ts[k] || 0)),
    account: summarise((k) => (remote[k] ? remote[k].value : null), keys.map((k) => (remote[k] ? remote[k].ts : 0))),
  };
  setState("conflict");
}

async function sync(interactive = false) {
  const c = cloud(); if (!c || !session) return;
  if (busy) { again = true; return; }
  busy = true; setState("syncing");
  const uid = session.user.id;
  let held = false;
  try {
    const meta = readMeta();
    const base = meta.base || (meta.base = {});

    let joined = ""; try { joined = localStorage.getItem(FIRST) || ""; } catch (e) {}
    if (joined !== uid) {
      /* The first time this device meets this account. Read everything the
         account holds; if both sides carry a record and they differ, stop and
         ask. Otherwise everything here is offered up, and where the account
         already has something, its copy is taken (stamped 1 here, so it wins);
         where it has nothing, this phone's copy fills it. */
      const { data: all, error } = await c.from("stuti_kv").select("key,value,ts").eq("user_id", uid).limit(5000);
      if (error) throw error;
      const remote: Record<string, Row> = {};
      for (const r of all || []) if (syncs(r.key)) remote[r.key] = { key: r.key, value: r.value, ts: Number(r.ts) || 0 };
      const local: string[] = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && syncs(k)) local.push(k); }

      const clash = local.some((k) => isRecord(k) && remote[k] && !empty(remote[k].value) && !empty(localStorage.getItem(k)) && remote[k].value !== localStorage.getItem(k));
      if (clash) {
        const keys = Array.from(new Set([...local, ...Object.keys(remote)])).filter((k) => isRecord(k) && (!empty(localStorage.getItem(k)) || (remote[k] && !empty(remote[k].value))));
        hold(true, keys, remote, meta);
        held = true;
        return;
      }
      for (const k of local) {
        if (remote[k] && !empty(remote[k].value)) meta.ts[k] = 1;
        else if (!meta.ts[k]) meta.ts[k] = 1;
        if (meta.dirty.indexOf(k) === -1) meta.dirty.push(k);
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
    const clashes: Record<string, Row> = {};
    let changed = 0;
    for (const r of rows || []) {
      const rts = Number(r.ts) || 0;
      remoteTs[r.key] = rts;
      if (r.updated_at > cursor) cursor = r.updated_at;
      if (!syncs(r.key)) continue;
      const cur = localStorage.getItem(r.key);
      /* a record key changed on both sides since they last agreed */
      if (isRecord(r.key) && meta.dirty.indexOf(r.key) !== -1 && base[r.key] !== undefined && rts > base[r.key] && cur !== r.value) {
        clashes[r.key] = { key: r.key, value: r.value, ts: rts };
        continue;
      }
      const mine = meta.ts[r.key] || 0;
      if (rts <= mine) continue;
      if (r.value === null) { if (cur !== null) { rawRemove.call(localStorage, r.key); changed++; } }
      else if (cur !== r.value) { rawSet.call(localStorage, r.key, r.value); changed++; }
      meta.ts[r.key] = rts; base[r.key] = rts;
      meta.dirty = meta.dirty.filter((k) => k !== r.key);
    }

    /* push what changed here and is still newer than the server's copy */
    const out = meta.dirty.filter((k) => syncs(k) && !clashes[k] && !(remoteTs[k] >= (meta.ts[k] || 0) && remoteTs[k] !== undefined))
      .map((k) => ({ user_id: uid, key: k, value: localStorage.getItem(k), ts: meta.ts[k] || Date.now() }));
    for (let i = 0; i < out.length; i += 200) {
      const { error: e2 } = await c.from("stuti_kv").upsert(out.slice(i, i + 200), { onConflict: "user_id,key" });
      if (e2) throw e2;
    }
    for (const o of out) base[o.key] = o.ts;
    const sent = new Set(out.map((o) => o.key));
    const now = readMeta();                        // a store may have written while we were away on the network
    now.dirty = now.dirty.filter((k) => !sent.has(k) || (now.ts[k] || 0) > (meta.ts[k] || 0));
    for (const k of Object.keys(meta.ts)) if (!now.ts[k] || now.ts[k] < meta.ts[k]) now.ts[k] = meta.ts[k];
    now.base = { ...(now.base || {}), ...base };
    writeMeta(now);
    /* while a clash waits, the cursor stays put so the account's copy is read again next time */
    const clashKeys = Object.keys(clashes);
    if (cursor && !clashKeys.length) rawSet.call(localStorage, CURSOR, cursor);
    rawSet.call(localStorage, FIRST, uid);

    await sendCueRecord(c, uid);
    if (clashKeys.length) { hold(false, clashKeys, clashes, now); held = true; }
    else { pending = null; setState("synced"); }

    if (changed) {
      if (interactive || document.visibilityState === "hidden") location.reload();
      else reloadOnHide = true;
    }
  } catch (e: any) {
    setState(navigator.onLine === false || /fetch|network/i.test(String(e && e.message)) ? "offline" : "error");
  } finally {
    busy = false;
    if (again && !held) { again = false; schedule(1500); }
    else again = false;
  }
}

/* The reciter has chosen. The chosen record applies whole across the keys in
   question: nothing from the other side is kept alongside it. */
async function resolve(keep: "phone" | "account"): Promise<{ ok: boolean; error?: string }> {
  const c = cloud(); const p = pending;
  if (!c || !session || !p) return { ok: false, error: "nothing to resolve" };
  const uid = session.user.id;
  const meta = readMeta(); const base = meta.base || (meta.base = {});
  try {
    if (keep === "phone") {
      const rows = p.keys.map((k) => {
        const ts = Math.max(Date.now(), (p.remote[k] ? p.remote[k].ts : 0) + 1);   // the server keeps only a newer stamp
        return { user_id: uid, key: k, value: localStorage.getItem(k), ts };
      });
      for (let i = 0; i < rows.length; i += 200) {
        const { error } = await c.from("stuti_kv").upsert(rows.slice(i, i + 200), { onConflict: "user_id,key" });
        if (error) throw error;
      }
      for (const r of rows) { meta.ts[r.key] = r.ts; base[r.key] = r.ts; }
    } else {
      for (const k of p.keys) {
        const r = p.remote[k];
        if (r && r.value !== null) rawSet.call(localStorage, k, r.value); else rawRemove.call(localStorage, k);
        if (r) { meta.ts[k] = r.ts; base[k] = r.ts; } else { delete meta.ts[k]; delete base[k]; }
      }
    }
    meta.dirty = meta.dirty.filter((k) => p.keys.indexOf(k) === -1);
    writeMeta(meta);
    pending = null;
    if (keep === "account") {
      /* the stores read their keys once at start; finish joining, then start afresh */
      rawSet.call(localStorage, FIRST, uid);
      location.reload();
      return { ok: true };
    }
    await sync(true);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e && e.message) };
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

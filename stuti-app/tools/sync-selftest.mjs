#!/usr/bin/env node
// Checks what happens to a reciter's practice when they sign in — the one
// part of accounts that can lose a year of work and cannot be seen by reading
// the screen:
//
//   node stuti-app/tools/sync-selftest.mjs
//
// It runs the real src/stuti-cloud.ts, unmodified, against a stand-in
// localStorage and a stand-in `stuti_kv` table, and asserts what survives.
// Supabase, the network and the sign-in itself are stood in for; what is
// exercised is the merge, which is where the loss would happen.
//
// What it cannot check is a real Supabase project and a real phone. The last
// box in LAUNCH_CHECKLIST.md A1 is that check, and docs/backend.md says how.
import { registerHooks } from "node:module";

let failed = 0, scenario = "";
const ok = (cond, what) => { console.log((cond ? "  ok   " : "  FAIL ") + what); if (!cond) failed++; };
const head = (s) => { scenario = s; console.log("\n" + s); };

/* ---------------- the table ---------------- */
/* one row per (user_id, key), as schema.sql has it */
let TABLE = [];
let CUES = [];
const nowIso = (n) => new Date(1760000000000 + n * 1000).toISOString();
let writeSeq = 0;

function from(table) {
  if (table === "stuti_cue_prefs") return { upsert: async (r) => { CUES.push(r); return { error: null }; } };
  const q = { _eq: {}, _gt: null };
  const run = async () => {
    let rows = TABLE.filter((r) => Object.entries(q._eq).every(([k, v]) => r[k] === v));
    if (q._gt) rows = rows.filter((r) => r[q._gt[0]] > q._gt[1]);
    rows.sort((a, b) => (a.updated_at < b.updated_at ? -1 : 1));
    return { data: rows.map((r) => ({ ...r })), error: null };
  };
  const chain = {
    select: () => chain,
    eq: (k, v) => { q._eq[k] = v; return chain; },
    gt: (k, v) => { q._gt = [k, v]; return chain; },
    order: () => chain,
    limit: () => chain,
    then: (res, rej) => run().then(res, rej),
    upsert: async (rows) => {
      for (const row of rows) {
        const i = TABLE.findIndex((r) => r.user_id === row.user_id && r.key === row.key);
        const rec = { ...row, updated_at: nowIso(++writeSeq) };
        if (i === -1) TABLE.push(rec); else TABLE[i] = rec;
      }
      return { error: null };
    },
  };
  return chain;
}

/* ---------------- stand-ins for what the module imports ---------------- */
let onAuth = null;
const MODULES = {
  "@supabase/supabase-js": `export const createClient = () => ({
    auth: {
      onAuthStateChange: (fn) => { globalThis.__setAuth(fn); return { data: { subscription: { unsubscribe() {} } } }; },
      signOut: async () => ({}), updateUser: async () => ({ error: null, data: { user: null } }),
    },
    from: (t) => globalThis.__from(t),
    rpc: async () => ({ error: null }),
  });`,
  "@capacitor/core": `export const Capacitor = { isNativePlatform: () => false, getPlatform: () => "web" };`,
  "./stuti-cloud-config": `export const STUTI_CLOUD_CONFIG = { supabaseUrl: "https://selftest.supabase.co", supabaseAnonKey: "anon", providers: { email: true, phone: false, google: false } };
    export const STUTI_RAZORPAY_IDS = {}; export const STUTI_CORPUS_URL = "";`,
  // the cue record is its own path, tested by push-selftest.mjs; here it must
  // only not get in the way
  "./stuti-push": `export const STUTI_PUSH = { record: () => null };`,
  "./stuti-relay": `export const deviceId = () => "selftest-device";`,
};
globalThis.__from = from;
globalThis.__setAuth = (fn) => { onAuth = fn; };

registerHooks({
  resolve(spec, ctx, next) {
    if (spec in MODULES) return { url: "stuti-stub:" + spec, shortCircuit: true };
    // the app is written for a bundler, so its relative imports carry no extension
    if (spec.startsWith(".") && !/\.[a-z]+$/.test(spec)) { try { return next(spec + ".ts", ctx); } catch (e) {} }
    return next(spec, ctx);
  },
  load(url, ctx, next) {
    if (url.startsWith("stuti-stub:")) return { format: "module", shortCircuit: true, source: MODULES[url.slice(11)] };
    return next(url, ctx);
  },
});

/* ---------------- a browser, as far as the module needs one ---------------- */
class Storage {
  constructor() { Object.defineProperty(this, "_m", { value: new Map(), enumerable: false }); }
  getItem(k) { return this._m.has(k) ? this._m.get(k) : null; }
  setItem(k, v) { this._m.set(k, String(v)); }
  removeItem(k) { this._m.delete(k); }
  key(i) { return Array.from(this._m.keys())[i] ?? null; }
  get length() { return this._m.size; }
  clear() { this._m.clear(); }
}
globalThis.Storage = Storage;
globalThis.localStorage = new Storage();
let reloads = 0;
globalThis.location = { reload: () => { reloads++; } };
Object.defineProperty(globalThis, "navigator", { value: { onLine: true }, configurable: true });
globalThis.window = { addEventListener() {} };
globalThis.document = { visibilityState: "visible", addEventListener() {} };

const { STUTI_CLOUD_AUTH, installCloud } = await import("../src/stuti-cloud.ts");
await installCloud();

/* ---------------- the fixtures ---------------- */
/* what a tester's phone looks like after a season of use: a real japa total,
   days on the thread, two vows, favourites, a reading position, settings, and
   the flyleaf, which must never travel */
const BETA_PHONE = {
  "stuti-japa": JSON.stringify({ "ganesha-mula": { total: 1008 }, "gayatri": { total: 432 } }),
  "stuti-thread": JSON.stringify({ "2026-09-01": { r: ["a"], j: 108 }, "2026-09-02": { r: ["b"] }, "2026-09-03": { p: ["c"] } }),
  "stuti-vows": JSON.stringify([{ id: "v1", kept: ["2026-09-01", "2026-09-02"] }, { id: "v2", kept: ["2026-09-03"] }]),
  "stuti-favs": JSON.stringify(["hanuman-chalisa", "lalita-sahasranama"]),
  "stuti-pos-hanuman-chalisa": "17",
  "stuti-loc": JSON.stringify({ place: "Hyderabad", lat: 17.38, lon: 78.48 }),
  "stuti-theme": "night",
  "stuti-lang": "tel",
  "stuti-pitru-register": JSON.stringify({ pitr: [{ nama: "Venkata Rao", gotra: "Bharadvaja" }], matr: [{ nama: "Lakshmi" }] }),
  "stuti-flyleaf": JSON.stringify({ nama: "Srikrishna", gotra: "Bharadvaja" }),
  "stuti-session": "local-session-token",
};
const seed = (obj) => { localStorage.clear(); for (const [k, v] of Object.entries(obj)) localStorage.setItem(k, v); };
const UID = "11111111-1111-4111-8111-111111111111";
const OTHER = (rows) => { TABLE = rows.map((r, i) => ({ user_id: UID, ...r, updated_at: nowIso(i + 1) })); writeSeq = rows.length; };
const kv = () => Object.fromEntries(TABLE.filter((r) => r.user_id === UID).map((r) => [r.key, r.value]));
const settle = async () => { await new Promise((r) => setTimeout(r, 0)); };

/* The module syncs on SIGNED_IN only when the account differs from the one it
   already holds, so each scenario starts from signed out, as a fresh app does. */
async function signIn() {
  await onAuth("SIGNED_OUT", null);
  await onAuth("SIGNED_IN", { user: { id: UID, email: "selftest@stuti.app", created_at: nowIso(0), app_metadata: { provider: "email" }, user_metadata: {} } });
  await settle(); await settle(); await settle();
}

/* ============================================================
   1. a beta phone meets an empty account
   ============================================================ */
head("1. A tester's phone signs in for the first time, account empty");
{
  seed(BETA_PHONE); TABLE = []; CUES = []; writeSeq = 0;
  // the stores wrote these before there was an account: stamp them as the hook would
  await signIn();
  const up = kv();
  ok(STUTI_CLOUD_AUTH.syncState() === "synced", "sync finishes in state 'synced' (was " + STUTI_CLOUD_AUTH.syncState() + ")");
  ok(up["stuti-japa"] === BETA_PHONE["stuti-japa"], "the japa total goes up to the account");
  ok(up["stuti-thread"] === BETA_PHONE["stuti-thread"], "the thread's days go up");
  ok(up["stuti-vows"] === BETA_PHONE["stuti-vows"], "both vows go up, with the days kept");
  ok(up["stuti-favs"] === BETA_PHONE["stuti-favs"], "the favourites go up");
  ok(up["stuti-pos-hanuman-chalisa"] === "17", "the reading position goes up");
  ok(up["stuti-loc"] === BETA_PHONE["stuti-loc"], "the place goes up");
  ok(up["stuti-theme"] === "night" && up["stuti-lang"] === "tel", "the settings go up");
  ok(!("stuti-flyleaf" in up), "the flyleaf (name, gotra) does NOT go up");
  ok(!("stuti-session" in up), "the session token does NOT go up");
  ok(!("stuti-pitru-register" in up), "the pitṛ register (the dead's names and gotras) does NOT go up");
  ok(localStorage.getItem("stuti-japa") === BETA_PHONE["stuti-japa"], "nothing on the phone was changed");
  ok(localStorage.getItem("stuti-flyleaf") === BETA_PHONE["stuti-flyleaf"], "the flyleaf is still on the phone");
}

/* ============================================================
   2. a beta phone meets an account that already holds practice
   ============================================================ */
head("2. The same phone signs into an account that another phone already filled");
{
  seed(BETA_PHONE);
  OTHER([
    { key: "stuti-japa", value: JSON.stringify({ "rama-taraka": { total: 108 } }), ts: 5000 },
    { key: "stuti-thread", value: JSON.stringify({ "2026-08-01": { r: ["z"] } }), ts: 5000 },
  ]);
  await signIn();
  const c = STUTI_CLOUD_AUTH.conflict();
  ok(STUTI_CLOUD_AUTH.syncState() === "conflict", "sync stops and asks, rather than choosing (state " + STUTI_CLOUD_AUTH.syncState() + ")");
  ok(!!c, "the account screen is given a conflict to show");
  ok(!!c && c.here.japa === 1440, "the phone's side is summarised: 1440 japa (got " + (c && c.here.japa) + ")");
  ok(!!c && c.account.japa === 108, "the account's side is summarised: 108 japa (got " + (c && c.account.japa) + ")");
  ok(!!c && c.here.days === 3, "the phone's side counts 3 days on the thread (got " + (c && c.here.days) + ")");
  ok(localStorage.getItem("stuti-japa") === BETA_PHONE["stuti-japa"], "while it waits, the phone is untouched");
  ok(kv()["stuti-japa"] === JSON.stringify({ "rama-taraka": { total: 108 } }), "while it waits, the account is untouched");
}

/* ============================================================
   3. the reciter keeps the phone's record
   ============================================================ */
head("3. Asked which to keep, the reciter keeps what is on the phone");
{
  const r = await STUTI_CLOUD_AUTH.resolve("phone");
  await settle();
  ok(r.ok, "resolve succeeds");
  ok(localStorage.getItem("stuti-japa") === BETA_PHONE["stuti-japa"], "the phone keeps its 1440 japa");
  ok(kv()["stuti-japa"] === BETA_PHONE["stuti-japa"], "the account is overwritten with the phone's record");
  ok(kv()["stuti-thread"] === BETA_PHONE["stuti-thread"], "the thread too");
  ok(STUTI_CLOUD_AUTH.conflict() === null, "the question is cleared");
}

/* ============================================================
   4. the reciter keeps the account's record
   ============================================================ */
head("4. Asked which to keep, the reciter keeps what the account holds");
{
  seed(BETA_PHONE);
  const accountJapa = JSON.stringify({ "rama-taraka": { total: 108 } });
  OTHER([
    { key: "stuti-japa", value: accountJapa, ts: 5000 },
    { key: "stuti-thread", value: JSON.stringify({ "2026-08-01": { r: ["z"] } }), ts: 5000 },
  ]);
  await signIn();
  ok(STUTI_CLOUD_AUTH.syncState() === "conflict", "it asks again");
  const before = reloads;
  const r = await STUTI_CLOUD_AUTH.resolve("account");
  await settle();
  ok(r.ok, "resolve succeeds");
  ok(localStorage.getItem("stuti-japa") === accountJapa, "the phone takes the account's record whole");
  ok(localStorage.getItem("stuti-flyleaf") === BETA_PHONE["stuti-flyleaf"], "the flyleaf is untouched by the choice");
  ok(reloads > before, "the app reloads, so the stores read the new record");
}

/* ============================================================
   5. an account holding only settings is not a conflict
   ============================================================ */
head("5. The account holds settings from another device — this phone's own must stand");
{
  /* The bug this replaced: a reciter signed in on their Telugu phone and the
     app turned English, because a test account from the week before held
     stuti-lang and the account won every setting on a first sign-in. */
  seed(BETA_PHONE);
  OTHER([
    { key: "stuti-theme", value: "day", ts: 9_000_000_000_000 },
    { key: "stuti-lang", value: "roman", ts: 9_000_000_000_000 },
    { key: "stuti-readmode", value: "paged", ts: 9_000_000_000_000 },   // this phone has never set it
  ]);
  localStorage.removeItem("stuti-readmode");
  await signIn();
  ok(STUTI_CLOUD_AUTH.syncState() === "synced", "no conflict is raised (state " + STUTI_CLOUD_AUTH.syncState() + ")");
  ok(kv()["stuti-japa"] === BETA_PHONE["stuti-japa"], "the practice goes up");
  ok(localStorage.getItem("stuti-lang") === "tel", "the phone stays in Telugu, however old the account's copy says it is");
  ok(localStorage.getItem("stuti-theme") === "night", "and keeps its own theme");
  ok(kv()["stuti-lang"] === "tel", "the phone's language is what the account now holds");
  ok(localStorage.getItem("stuti-readmode") === "paged", "a setting this phone never set still comes down from the account");
}

/* ============================================================
   6. an empty record on the account is not a conflict either
   ============================================================ */
head("6. The account holds an empty record (a phone that signed in and did nothing)");
{
  seed(BETA_PHONE);
  OTHER([{ key: "stuti-japa", value: "{}", ts: 5000 }, { key: "stuti-vows", value: "[]", ts: 5000 }]);
  await signIn();
  ok(STUTI_CLOUD_AUTH.syncState() === "synced", "no conflict over an empty record (state " + STUTI_CLOUD_AUTH.syncState() + ")");
  ok(kv()["stuti-japa"] === BETA_PHONE["stuti-japa"], "the phone's japa fills it");
  ok(kv()["stuti-vows"] === BETA_PHONE["stuti-vows"], "the phone's vows fill it");
}

/* ============================================================
   7. signing in again on the same phone does not re-migrate
   ============================================================ */
head("7. The same phone, signing in a second time");
{
  seed(BETA_PHONE); TABLE = []; writeSeq = 0;
  await signIn();
  ok(Object.keys(kv()).length > 0, "the first sign-in filled the account");
  localStorage.setItem("stuti-japa", JSON.stringify({ "ganesha-mula": { total: 2016 } }));
  await STUTI_CLOUD_AUTH.syncNow();
  await settle();
  ok(STUTI_CLOUD_AUTH.syncState() === "synced", "no conflict with itself (state " + STUTI_CLOUD_AUTH.syncState() + ")");
  const j = kv()["stuti-japa"];
  ok(!!j && JSON.parse(j)["ganesha-mula"].total === 2016, "the newer count on the phone reaches the account (got " + j + ")");
}

/* ============================================================
   8. what must never travel
   ============================================================ */
head("8. What the saṅkalpa panel promises never leaves the phone");
{
  const everySent = new Set(TABLE.map((r) => r.key));
  for (const k of ["stuti-flyleaf", "stuti-pitru-register", "stuti-session", "stuti-push", "stuti-beta-key", "stuti-sync-meta", "stuti-sync-joined", "stuti-sync-cursor"]) {
    ok(!everySent.has(k), k + " is never written to the account");
  }
  ok(CUES.length === 0, "no cue record was sent (push is off in this run)");
}

/* ============================================================
   9. a phone whose practice predates the sync hook
   ============================================================ */
head("9. A beta phone whose data was written before the stamps existed");
{
  /* The hook stamps every write, but a tester's phone has been filling up
     since before the hook shipped, so those keys carry no stamp at all.
     Write them the way the browser would have, under the hook's radar. */
  localStorage.clear();
  for (const [k, v] of Object.entries(BETA_PHONE)) localStorage._m.set(k, v);   // written under the hook's radar
  TABLE = []; writeSeq = 0;
  ok(!localStorage.getItem("stuti-sync-meta"), "the phone carries no stamps at all");
  await signIn();
  const up = kv();
  ok(STUTI_CLOUD_AUTH.syncState() === "synced", "sync finishes (state " + STUTI_CLOUD_AUTH.syncState() + ")");
  ok(up["stuti-japa"] === BETA_PHONE["stuti-japa"], "unstamped japa still reaches the account");
  ok(up["stuti-thread"] === BETA_PHONE["stuti-thread"], "unstamped thread still reaches the account");
  ok(up["stuti-vows"] === BETA_PHONE["stuti-vows"], "unstamped vows still reach the account");
  ok(localStorage.getItem("stuti-japa") === BETA_PHONE["stuti-japa"], "and nothing on the phone was lost");
}

/* ============================================================
   10. unstamped practice against an account that already holds some
   ============================================================ */
head("10. Unstamped practice meeting an account that already holds a record");
{
  localStorage.clear();
  for (const [k, v] of Object.entries(BETA_PHONE)) localStorage._m.set(k, v);
  OTHER([{ key: "stuti-japa", value: JSON.stringify({ "rama-taraka": { total: 108 } }), ts: 5000 }]);
  await signIn();
  ok(STUTI_CLOUD_AUTH.syncState() === "conflict", "it still stops and asks (state " + STUTI_CLOUD_AUTH.syncState() + ")");
  ok(localStorage.getItem("stuti-japa") === BETA_PHONE["stuti-japa"], "the unstamped phone is not overwritten while it waits");
}

console.log("\n" + (failed ? failed + " FAILED" : "all checks passed") + "\n");
process.exit(failed ? 1 : 0);

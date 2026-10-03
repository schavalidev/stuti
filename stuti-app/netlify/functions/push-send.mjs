// The push sender: posts each bell that has fallen due to the push service
// that will carry it to a closed browser.
//
// It is a postman and nothing more. The bells arrive in Supabase already sealed
// by the device that laid them (src/stuti-push-seal.ts), so this holds no text
// and reckons no almanac: it takes the rows due now, signs each request with the
// VAPID key so the push service knows it comes from Stuti, and reports what
// happened. The database wakes it (supabase/push-cron.sql) only when something
// is due, plus a health call every ten minutes, and hands it the secret that is
// its whole authority. It holds no Supabase credential of its own: it calls two
// secret-guarded functions with the public anon key.
//
// Environment:
//   STUTI_VAPID_PRIVATE  — the private half of the VAPID pair, base64url
//                          (node stuti-app/tools/vapid-keys.mjs makes one)
//   STUTI_VAPID_SUBJECT  — optional; a mailto: or https: contact the push
//                          services can reach. Defaults to the support address.
// The public half, the Supabase URL and the anon key are read from
// src/stuti-cloud-config.ts, so the app and the sender cannot disagree about
// them; SUPABASE_URL, SUPABASE_ANON_KEY and STUTI_VAPID_PUBLIC override.
//
// Request: POST { secret }, from the database. Anything else is refused.
import { STUTI_CLOUD_CONFIG as CFG } from "../../src/stuti-cloud-config.ts";

const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder();
const b64u = (u) => Buffer.from(u).toString("base64url");
const unb64u = (s) => new Uint8Array(Buffer.from(String(s), "base64url"));

// the same list as stuti_push_host_ok() in schema.sql: this POSTs to whatever
// endpoint a row names, so nothing but a push service may ever be one
export const PUSH_HOST = /^https:\/\/(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9-]+(\.[a-z0-9-]+)*\.push\.apple\.com|[a-z0-9-]+(\.[a-z0-9-]+)*\.notify\.windows\.com)\//;

/** The signing key, checked against the public half before anything is sent:
 *  a private key pasted from a different pair signs perfectly well, and every
 *  push service then refuses every message with a 403 nobody reads. */
export async function vapidKey(pub, priv) {
  const p = unb64u(pub);
  if (p.length !== 65 || p[0] !== 4) throw new Error("the public key is not an uncompressed P-256 point");
  const jwk = { kty: "EC", crv: "P-256", x: b64u(p.slice(1, 33)), y: b64u(p.slice(33, 65)) };
  /* Node refuses an inconsistent pair at import ("Invalid keyData"), which
     says nothing useful in a beat note; other runtimes import it and only the
     probe below catches it */
  let key;
  try { key = await subtle.importKey("jwk", { ...jwk, d: priv }, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]); }
  catch (e) { throw new Error("the private key does not belong to the public key, or is not a base64url P-256 key"); }
  const check = await subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const probe = enc.encode("stuti");
  const sig = await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, probe);
  if (!(await subtle.verify({ name: "ECDSA", hash: "SHA-256" }, check, sig, probe))) throw new Error("the private key does not belong to the public key");
  return key;
}

/** The Authorization header for one push service (RFC 8292). One token per
 *  service per run: the audience is the service's origin, not the endpoint. */
export function vapidSigner(key, pub, subject, now = Date.now()) {
  const tokens = new Map();
  return async (endpoint) => {
    const aud = new URL(endpoint).origin;
    if (!tokens.has(aud)) {
      const head = b64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
      const claims = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(now / 1000) + 12 * 3600, sub: subject })));
      const sig = await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(head + "." + claims));
      tokens.set(aud, "vapid t=" + head + "." + claims + "." + b64u(new Uint8Array(sig)) + ", k=" + pub);
    }
    return tokens.get(aud);
  };
}

/** Post one sealed bell. The outcome is what stuti_push_done() understands. */
export async function sendOne(row, sign, fetchImpl = fetch) {
  if (!PUSH_HOST.test(row.endpoint)) return "error:host";
  try {
    const res = await fetchImpl(row.endpoint, {
      method: "POST",
      headers: {
        Authorization: await sign(row.endpoint),
        "Content-Encoding": "aes128gcm",
        "Content-Type": "application/octet-stream",
        TTL: String(row.ttl),
        Urgency: row.urgency || "normal",
      },
      body: unb64u(row.payload),
      signal: AbortSignal.timeout(8000),
    });
    if (res.status >= 200 && res.status < 300) return "sent";
    if (res.status === 404 || res.status === 410) return "gone";
    if (res.status === 429 || res.status >= 500) return "retry";
    return "error:" + res.status;
  } catch (e) {
    return "retry";
  }
}

const reply = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

export default async (req, _ctx, fetchImpl = fetch) => {
  if (req.method !== "POST") return reply(405, { error: "POST only" });
  let secret = "";
  try { secret = String((await req.json()).secret || ""); } catch (e) {}
  if (!secret) return reply(400, { error: "no secret" });

  const env = process.env;
  const url = env.SUPABASE_URL || CFG.supabaseUrl, anon = env.SUPABASE_ANON_KEY || CFG.supabaseAnonKey;
  const pub = env.STUTI_VAPID_PUBLIC || CFG.pushKey || "", priv = env.STUTI_VAPID_PRIVATE || "";
  const subject = env.STUTI_VAPID_SUBJECT || "mailto:feedback@stuti.app";
  if (!url || !anon) return reply(503, { error: "Supabase is not configured" });

  const rpc = (fn, args) => fetchImpl(url.replace(/\/+$/, "") + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: { apikey: anon, Authorization: "Bearer " + anon, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  let key = null, note = "";
  if (!pub) note = "no public VAPID key: set pushKey in src/stuti-cloud-config.ts";
  else if (!priv) note = "STUTI_VAPID_PRIVATE is not set";
  else { try { key = await vapidKey(pub, priv); } catch (e) { note = "VAPID: " + e.message; } }

  const results = [], tally = { sent: 0, gone: 0, retry: 0, error: 0 };
  if (key) {
    const sign = vapidSigner(key, pub, subject);
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      const r = await rpc("stuti_push_claim", { p_secret: secret, p_limit: 200 });
      if (!r.ok) return reply(r.status === 401 || r.status === 403 ? 401 : 502, { error: "claim " + r.status });
      const rows = await r.json();
      if (!Array.isArray(rows) || !rows.length) break;
      /* sixteen at a time: a sunrise falls on thousands of reciters within the
         same minute in one city, and none of them should wait on the others */
      for (let i = 0; i < rows.length; i += 16) {
        await Promise.all(rows.slice(i, i + 16).map(async (row) => {
          const outcome = await sendOne(row, sign, fetchImpl);
          results.push({ id: row.id, outcome });
          tally[outcome.startsWith("error") ? "error" : outcome]++;
        }));
      }
      if (rows.length < 200) break;
    }
    note = "sent " + tally.sent + ", gone " + tally.gone + ", retry " + tally.retry + ", error " + tally.error;
  }

  const done = await rpc("stuti_push_done", { p_secret: secret, p_key: pub || null, p_ok: !!key, p_note: note, p_results: results });
  if (!done.ok) return reply(done.status === 401 || done.status === 403 ? 401 : 502, { error: "done " + done.status, ...tally });
  return reply(key ? 200 : 503, { ok: !!key, note, ...tally });
};

export const config = { path: "/.netlify/functions/push-send" };

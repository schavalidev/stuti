#!/usr/bin/env node
// Checks every part of the push path that can be checked without the accounts:
//
//   node stuti-app/tools/push-selftest.mjs
//
// 1. the device's sealing (src/stuti-push-seal.ts) reproduces the worked example
//    in RFC 8291 byte for byte;
// 2. a sealed message opens again the way a browser opens it;
// 3. the sender's VAPID key check and signature verify against the public half;
// 4. the sender, run whole against stand-in Supabase and push services, posts
//    what it claimed with the right headers and reports each outcome;
// 5. the service worker shows what arrives and routes a tap.
//
// What it cannot check is a real push service and a real browser, which need
// the keys and Supabase in place; docs/backend.md says how to test those.
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { seal, b64u, unb64u } from "../src/stuti-push-seal.ts";
import send, { vapidKey, vapidSigner, PUSH_HOST } from "../netlify/functions/push-send.mjs";

const { subtle } = globalThis.crypto;
const enc = new TextEncoder(), dec = new TextDecoder();
let failed = 0;
const ok = (cond, what) => { console.log((cond ? "ok   " : "FAIL ") + what); if (!cond) failed++; };
const cat = (...p) => { const o = new Uint8Array(p.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of p) { o.set(x, i); i += x.length; } return o; };
const eq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// ---- 1. RFC 8291, Appendix A ----
{
  const body = await seal(
    { p256dh: "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4", auth: "BTBZMqHH6r4Tts7J_aSIgg" },
    "When I grow up, I want to be a watermelon",
    { salt: "DGv6ra1nlYgDCS1FRnbzlw", d: "yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw",
      pub: "BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8" });
  // the appendix gives the 86-byte header and the ciphertext separately
  const want = cat(unb64u("DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8"),
    unb64u("8pfeW0KbunFT06SuDKoJH9Ql87S1QUrdirN6GcG7sFz1y1sqLgVi1VhjVkHsUoEsbI_0LpXMuGvnzQ"));
  ok(eq(body, want), "seal reproduces RFC 8291's example message byte for byte (" + body.length + " bytes)");
}

// ---- 2. a browser opening what the device sealed ----
async function hmac(k, d) { return new Uint8Array(await subtle.sign("HMAC", await subtle.importKey("raw", k, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]), d)); }
async function hkdf(salt, ikm, info, len) { return (await hmac(await hmac(salt, ikm), cat(info, new Uint8Array([1])))).slice(0, len); }
async function browser() {
  const kp = await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const pub = new Uint8Array(await subtle.exportKey("raw", kp.publicKey));
  const auth = crypto.getRandomValues(new Uint8Array(16));
  return {
    keys: { p256dh: b64u(pub), auth: b64u(auth) },
    async open(body) {
      const salt = body.slice(0, 16), rs = new DataView(body.buffer, body.byteOffset).getUint32(16), idlen = body[20];
      const asPub = body.slice(21, 21 + idlen), ct = body.slice(21 + idlen);
      const as = await subtle.importKey("raw", asPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
      const ecdh = new Uint8Array(await subtle.deriveBits({ name: "ECDH", public: as }, kp.privateKey, 256));
      const ikm = await hkdf(auth, ecdh, cat(enc.encode("WebPush: info\0"), pub, asPub), 32);
      const cek = await hkdf(salt, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
      const nonce = await hkdf(salt, ikm, enc.encode("Content-Encoding: nonce\0"), 12);
      const k = await subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["decrypt"]);
      const pt = new Uint8Array(await subtle.decrypt({ name: "AES-GCM", iv: nonce }, k, ct));
      if (rs !== 4096 || pt[pt.length - 1] !== 2) throw new Error("bad record");
      return dec.decode(pt.slice(0, -1));
    },
  };
}
{
  const b = await browser();
  const msg = JSON.stringify({ t: "Stuti · Prātaḥ sandhyā", b: "సంధ్యా సమయం · 5:52 – 6:40", u: "#reader/devi/lalita", g: "sandhya-pratah", d: 1 });
  const one = await seal(b.keys, msg), two = await seal(b.keys, msg);
  ok((await b.open(one)) === msg, "a sealed bell opens again in the browser, Telugu and diacritics intact");
  ok(!eq(one, two), "two seals of the same bell differ (fresh key and salt each time)");
  let threw = false; try { await seal(b.keys, "x".repeat(4000)); } catch (e) { threw = true; }
  ok(threw, "a message too long for one push is refused, not truncated");
}

// ---- 3. VAPID ----
async function pair() {
  const kp = await subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  return { pub: b64u(new Uint8Array(await subtle.exportKey("raw", kp.publicKey))), priv: (await subtle.exportKey("jwk", kp.privateKey)).d };
}
const V = await pair(), other = await pair();
{
  const key = await vapidKey(V.pub, V.priv);
  let threw = ""; try { await vapidKey(V.pub, other.priv); } catch (e) { threw = e.message; }
  ok(/does not belong/.test(threw), "a private key from another pair is caught before anything is sent");
  const now = Date.now();
  const h = await vapidSigner(key, V.pub, "mailto:feedback@stuti.app", now)("https://fcm.googleapis.com/fcm/send/abc");
  const [, jwt, k] = h.match(/^vapid t=([^,]+), k=(.+)$/) || [];
  const [hd, cl, sg] = jwt.split(".");
  const pk = await subtle.importKey("raw", unb64u(V.pub), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const good = await subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pk, unb64u(sg), enc.encode(hd + "." + cl));
  const c = JSON.parse(dec.decode(unb64u(cl)));
  ok(good && k === V.pub, "the VAPID token verifies against the public key it names");
  ok(c.aud === "https://fcm.googleapis.com" && c.sub === "mailto:feedback@stuti.app" && c.exp - now / 1000 > 11 * 3600 && c.exp - now / 1000 <= 12 * 3600 + 1,
    "its audience is the service's origin, its expiry twelve hours, its subject the support address");
  ok(JSON.parse(dec.decode(unb64u(hd))).alg === "ES256" && unb64u(sg).length === 64, "ES256, with a raw 64-byte signature as JWS wants");
}
ok(PUSH_HOST.test("https://fcm.googleapis.com/fcm/send/x") && PUSH_HOST.test("https://web.push.apple.com/x") && PUSH_HOST.test("https://updates.push.services.mozilla.com/wpush/v2/x")
   && !PUSH_HOST.test("https://fcm.googleapis.com.evil.example/x") && !PUSH_HOST.test("http://fcm.googleapis.com/x"), "the sender's host list matches the push services and nothing else");

// ---- 4. the sender, whole ----
{
  Object.assign(process.env, { SUPABASE_URL: "https://ref.supabase.co", SUPABASE_ANON_KEY: "anon", STUTI_VAPID_PUBLIC: V.pub, STUTI_VAPID_PRIVATE: V.priv });
  const b = await browser();
  const bell = JSON.stringify({ t: "Stuti", b: "Lalitā Sahasranāma · day 3", u: "#reader/devi/lalita", g: "daily", d: Date.now() });
  const rows = [
    { id: 1, endpoint: "https://fcm.googleapis.com/fcm/send/live", payload: b64u(await seal(b.keys, bell)), ttl: 900, urgency: "high" },
    { id: 2, endpoint: "https://fcm.googleapis.com/fcm/send/expired", payload: "AAAA", ttl: 900, urgency: "normal" },
    { id: 3, endpoint: "https://updates.push.services.mozilla.com/wpush/v2/busy", payload: "AAAA", ttl: 600, urgency: "normal" },
  ];
  const seen = { claims: 0, push: [], done: null };
  const fake = async (url, init) => {
    if (url === "https://ref.supabase.co/rest/v1/rpc/stuti_push_claim") {
      const a = JSON.parse(init.body);
      if (a.p_secret !== "s3cret") return new Response('{"code":"42501"}', { status: 403 });
      return Response.json(seen.claims++ === 0 ? rows : []);
    }
    if (url === "https://ref.supabase.co/rest/v1/rpc/stuti_push_done") { seen.done = JSON.parse(init.body); return new Response(null, { status: 204 }); }
    seen.push.push({ url, init });
    return new Response(null, { status: url.endsWith("live") ? 201 : url.endsWith("expired") ? 410 : 503 });
  };
  const post = (body) => new Request("https://stuti-app.netlify.app/.netlify/functions/push-send", { method: "POST", body: JSON.stringify(body) });

  let res = await send(post({ secret: "s3cret" }), {}, fake);
  let out = await res.json();
  ok(res.status === 200 && out.sent === 1 && out.gone === 1 && out.retry === 1, "the sender posts what it claimed: one sent, one gone, one to retry");
  const live = seen.push.find((p) => p.url.endsWith("live"));
  const hd = live.init.headers;
  ok(hd["Content-Encoding"] === "aes128gcm" && hd.TTL === "900" && hd.Urgency === "high" && /^vapid t=.+, k=/.test(hd.Authorization), "with aes128gcm, the TTL left, the urgency and a VAPID header");
  ok((await b.open(live.init.body)) === bell, "and the bytes it posts are the device's sealed bell, untouched");
  const moz = seen.push.find((p) => p.url.includes("mozilla")).init.headers.Authorization;
  ok(moz !== hd.Authorization, "a different push service gets a token with its own audience");
  ok(seen.done && seen.done.p_ok === true && seen.done.p_key === V.pub && JSON.stringify(seen.done.p_results.map((r) => r.outcome).sort()) === '["gone","retry","sent"]',
    "it reports each outcome and a clean beat with the key it signed with");

  res = await send(post({ secret: "wrong" }), {}, fake);
  ok(res.status === 401, "a wrong secret gets nothing: the database refuses the claim");
  ok((await send(new Request("https://x/", { method: "GET" }), {}, fake)).status === 405, "anything but a POST is refused");

  delete process.env.STUTI_VAPID_PRIVATE; seen.claims = 0; seen.done = null;
  res = await send(post({ secret: "s3cret" }), {}, fake); out = await res.json();
  ok(res.status === 503 && seen.claims === 0 && seen.done.p_ok === false && /STUTI_VAPID_PRIVATE/.test(seen.done.p_note),
    "with no private key it claims nothing, and says why in its beat so the app stops laying");
  process.env.STUTI_VAPID_PRIVATE = other.priv; seen.claims = 0;
  res = await send(post({ secret: "s3cret" }), {}, fake);
  ok(res.status === 503 && seen.claims === 0 && /does not belong/.test(seen.done.p_note), "with a mismatched private key, the same");
}

// ---- 5. the service worker ----
{
  const handlers = {}, shown = [], opened = [], posted = [];
  let windows = [];
  const self = {
    addEventListener: (t, fn) => { handlers[t] = fn; },
    registration: { scope: "https://stuti-app.netlify.app/", showNotification: async (t, o) => { shown.push({ t, o }); } },
    clients: { matchAll: async () => windows, openWindow: async (u) => { opened.push(u); } },
  };
  vm.runInNewContext(readFileSync(new URL("../public/stuti-push-sw.js", import.meta.url), "utf8"), { self, URL });
  const fire = async (type, ev) => { let p; handlers[type]({ ...ev, waitUntil: (x) => { p = x; } }); await p; };

  await fire("push", { data: { json: () => ({ t: "Stuti · Sāyaṃ sandhyā", b: "6:12 – 6:58", u: "#reader/devi/x", g: "sandhya-sayam", d: 5 }) } });
  ok(shown[0].t === "Stuti · Sāyaṃ sandhyā" && shown[0].o.body === "6:12 – 6:58" && shown[0].o.tag === "sandhya-sayam" && shown[0].o.data.u === "#reader/devi/x",
    "a push is shown with its own title, words and tag");
  await fire("push", { data: { json: () => { throw new Error("not json"); } } });
  ok(shown[1].t === "Stuti", "an unreadable push still shows something, as the browser requires");
  await fire("push", { data: { json: () => ({ t: "x", u: "https://evil.example/" }) } });
  ok(shown[2].o.data.u === "", "a tap can only ever lead inside the app");

  const n = { close() { n.closed = true; }, data: { u: "#reader/devi/x" } };
  await fire("notificationclick", { notification: n });
  ok(n.closed && opened[0] === "https://stuti-app.netlify.app/#reader/devi/x", "with no window open, a tap opens the app at the hymn");
  windows = [{ url: "https://stuti-app.netlify.app/#home", focus: async () => { windows[0].focused = true; }, postMessage: (m) => posted.push(m) }];
  await fire("notificationclick", { notification: { close() {}, data: { u: "#reader/devi/y" } } });
  ok(windows[0].focused && posted[0].stuti === "open" && posted[0].u === "#reader/devi/y" && opened.length === 1, "with one open, it is focused and told where to go");
}

console.log(failed ? "\n" + failed + " FAILED" : "\nall push checks passed");
process.exit(failed ? 1 : 0);

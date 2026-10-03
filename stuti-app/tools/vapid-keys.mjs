#!/usr/bin/env node
// Make the VAPID key pair the push sender signs with (RFC 8292).
//
//   node stuti-app/tools/vapid-keys.mjs
//
// The public half goes in src/stuti-cloud-config.ts as `pushKey`; it ships in
// the app and is meant to be seen. The private half goes into Netlify's
// environment as STUTI_VAPID_PRIVATE and nowhere else: not in the repo, not in
// a chat, not in a note. Anyone holding it can send notifications as Stuti to
// every browser that has allowed them.
//
// Make the pair once. Replacing it later orphans every subscription made with
// the old public key; the app notices and subscribes afresh on each browser's
// next open, but bells stop until then.
const { subtle } = globalThis.crypto;
const kp = await subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
const jwk = await subtle.exportKey("jwk", kp.privateKey);
const pub = Buffer.from(await subtle.exportKey("raw", kp.publicKey)).toString("base64url");

console.log("public  (src/stuti-cloud-config.ts → pushKey):");
console.log("  " + pub);
console.log("private (Netlify → Site configuration → Environment variables → STUTI_VAPID_PRIVATE):");
console.log("  " + jwk.d);

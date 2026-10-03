/* ============================================================
   STUTI — sealing a bell for the push service
   Hand-authored; not part of the port. No imports, on purpose: the
   same file runs in the page and under Node for the self-test
   (tools/push-selftest.mjs), which checks it byte for byte against
   the worked example in RFC 8291.

   A web push message is encrypted to the browser that will show it,
   with the two keys that browser published when it subscribed
   (p256dh and auth). Anyone holding the subscription can seal a
   message, and only that browser can open one. So the device seals
   its own week of bells before handing them over, and the server
   that sends them holds ciphertext and a minute to send it at —
   never the hymn, the vow, or the name of the person whose tithi it
   is. The server's part is the VAPID signature, which proves the
   message comes from Stuti and does not depend on what it says.

   aes128gcm (RFC 8188) with the Web Push key schedule (RFC 8291):
   one record, no padding beyond the delimiter.
   ============================================================ */

const enc = new TextEncoder();
const subtle = () => globalThis.crypto.subtle;

export function b64u(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function unb64u(str: string): Uint8Array {
  const s = String(str).replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "===".slice((s.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function cat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

const bytes = (v: string | Uint8Array) => (typeof v === "string" ? unb64u(v) : v);
const buf = (u: Uint8Array) => u as unknown as BufferSource;

async function hmac(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const k = await subtle().importKey("raw", buf(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await subtle().sign("HMAC", k, buf(data)));
}

/* HKDF with a single output block, which is all this schedule ever needs:
   extract is HMAC(salt, ikm), expand to ≤32 bytes is HMAC(prk, info ‖ 0x01) */
async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, len: number) {
  const prk = await hmac(salt, ikm);
  return (await hmac(prk, cat(info, new Uint8Array([1])))).slice(0, len);
}

/* the sender's key for one message. Fresh every time, except in the
   self-test, which hands in the RFC's own pair to reproduce its output */
async function senderKey(fixed?: { d: string; pub: string }) {
  if (fixed) {
    const p = unb64u(fixed.pub);
    const priv = await subtle().importKey("jwk",
      { kty: "EC", crv: "P-256", d: fixed.d, x: b64u(p.slice(1, 33)), y: b64u(p.slice(33, 65)), ext: true },
      { name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
    return { priv, pub: p };
  }
  const kp = await subtle().generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]) as CryptoKeyPair;
  return { priv: kp.privateKey, pub: new Uint8Array(await subtle().exportKey("raw", kp.publicKey)) };
}

/** Seal `plaintext` for the browser that published `keys`. Returns the whole
 *  request body: the 86-byte header (salt, record size, sender key) and the
 *  one encrypted record. */
export async function seal(
  keys: { p256dh: string | Uint8Array; auth: string | Uint8Array },
  plaintext: string | Uint8Array,
  fixed?: { salt: string; d: string; pub: string },
): Promise<Uint8Array> {
  const uaPub = bytes(keys.p256dh), auth = bytes(keys.auth);
  if (uaPub.length !== 65 || uaPub[0] !== 4) throw new Error("seal: p256dh is not an uncompressed P-256 key");
  if (auth.length !== 16) throw new Error("seal: auth secret is not 16 bytes");
  const data = typeof plaintext === "string" ? enc.encode(plaintext) : plaintext;
  /* one record of 4096 bytes holds 4096 − 16 (tag) − 1 (delimiter); the push
     services cap the body at 4096 in any case, header included */
  if (data.length > 3993) throw new Error("seal: message too long for one push");

  const as = await senderKey(fixed ? { d: fixed.d, pub: fixed.pub } : undefined);
  const ua = await subtle().importKey("raw", buf(uaPub), { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdh = new Uint8Array(await subtle().deriveBits({ name: "ECDH", public: ua } as any, as.priv, 256));

  const ikm = await hkdf(auth, ecdh, cat(enc.encode("WebPush: info\0"), uaPub, as.pub), 32);
  const salt = fixed ? unb64u(fixed.salt) : globalThis.crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, enc.encode("Content-Encoding: nonce\0"), 12);

  const key = await subtle().importKey("raw", buf(cek), { name: "AES-GCM" }, false, ["encrypt"]);
  const sealed = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv: buf(nonce) }, key, buf(cat(data, new Uint8Array([2])))));

  const header = new Uint8Array(21);
  new DataView(header.buffer).setUint32(16, 4096);
  header.set(salt, 0);
  header[20] = as.pub.length;
  return cat(header, as.pub, sealed);
}

// The log relay: the app posts a crash note or a Follow session here, and
// this writes it into the "Stuti App" folder on Google Drive, where the
// maker's tooling already reads. Testers never sign into anything; the only
// credential lives in Netlify's environment, never in the app.
//
// Two ways to hold that credential (set exactly one):
//   STUTI_DRIVE_OAUTH — {"client_id","client_secret","refresh_token"} for the
//       folder owner's own Google account (recommended: files are owned by
//       the account, so they count against its storage, not a robot's)
//   STUTI_DRIVE_SA    — a service-account key JSON; the folder must be shared
//       with the account's email as Editor
// and STUTI_DRIVE_FOLDER — the folder id (the tail of its Drive URL).
//
// Requests: POST JSON
//   { name, mime, text }                → written as a file (≤ 4 MB)
//   { name, mime, size, resumable: true } → { url } to PUT the bytes to
//     (Google's resumable session; the PUT needs no token, and honours CORS
//     for the Origin this request carried)
import { createSign } from "node:crypto";

const MAX_TEXT = 4 * 1024 * 1024, MAX_BLOB = 40 * 1024 * 1024;
const PREFIXES = ["crash-", "follow-", "note-", "recitation-", "journal-"];
// ...and the signed build itself, published from the maker's machine so a
// tester can install it from the same folder their logs arrive in. Named
// exactly rather than by prefix: this endpoint carries no credential, and a
// shape this narrow leaves nothing to drop here but another build.
const BUILD = /^Stuti-v\d+\.apk$/;
const ORIGINS = [/^https:\/\/stuti-app\.netlify\.app$/, /^https?:\/\/localhost(:\d+)?$/, /^capacitor:\/\/localhost$/, /^https:\/\/[a-z0-9-]+--stuti-app\.netlify\.app$/];

let cached = { token: null, until: 0 };
const b64url = (s) => Buffer.from(s).toString("base64url");

async function accessToken() {
  if (cached.token && Date.now() < cached.until - 60_000) return cached.token;
  let body;
  if (process.env.STUTI_DRIVE_OAUTH) {
    const o = JSON.parse(process.env.STUTI_DRIVE_OAUTH);
    body = new URLSearchParams({ client_id: o.client_id, client_secret: o.client_secret, refresh_token: o.refresh_token, grant_type: "refresh_token" });
  } else if (process.env.STUTI_DRIVE_SA) {
    const sa = JSON.parse(process.env.STUTI_DRIVE_SA);
    const now = Math.floor(Date.now() / 1000);
    const unsigned = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" })) + "." + b64url(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/drive", aud: sa.token_uri || "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
    const sig = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key, "base64url");
    body = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: unsigned + "." + sig });
  } else return null;
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body });
  if (!r.ok) throw new Error("token " + r.status + " " + (await r.text()).slice(0, 200));
  const j = await r.json();
  cached = { token: j.access_token, until: Date.now() + (j.expires_in || 3600) * 1000 };
  return cached.token;
}

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ORIGINS.some((re) => re.test(origin || "")) ? origin : "https://stuti-app.netlify.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
});
const reply = (status, obj, origin) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });

export default async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return reply(405, { error: "POST only" }, origin);
  const folder = process.env.STUTI_DRIVE_FOLDER;
  if (!folder || !(process.env.STUTI_DRIVE_OAUTH || process.env.STUTI_DRIVE_SA)) return reply(503, { error: "relay not configured" }, origin);
  let q; try { q = await req.json(); } catch (e) { return reply(400, { error: "bad json" }, origin); }
  const name = String(q.name || "").replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
  if (!BUILD.test(name) && !PREFIXES.some((p) => name.startsWith(p))) return reply(400, { error: "unknown kind" }, origin);
  const mime = /^[a-z]+\/[a-z0-9.+-]+$/i.test(q.mime || "") ? q.mime : "text/plain";
  const meta = JSON.stringify({ name, parents: [folder], mimeType: mime });
  let token; try { token = await accessToken(); } catch (e) { return reply(502, { error: String(e.message || e) }, origin); }
  const auth = { Authorization: "Bearer " + token };

  if (q.resumable) {
    const size = Number(q.size) || 0;
    if (size <= 0 || size > MAX_BLOB) return reply(413, { error: "size" }, origin);
    const r = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true", {
      method: "POST", body: meta,
      headers: { ...auth, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": mime, "X-Upload-Content-Length": String(size), ...(origin ? { Origin: origin } : {}) },
    });
    if (!r.ok) return reply(502, { error: "drive " + r.status + " " + (await r.text()).slice(0, 200) }, origin);
    return reply(200, { url: r.headers.get("location") }, origin);
  }

  const text = String(q.text || "");
  if (!text) return reply(400, { error: "empty" }, origin);
  if (Buffer.byteLength(text) > MAX_TEXT) return reply(413, { error: "size" }, origin);
  const boundary = "stuti" + Math.random().toString(36).slice(2);
  const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: ${mime}; charset=UTF-8\r\n\r\n${text}\r\n--${boundary}--`;
  const r = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name", {
    method: "POST", body, headers: { ...auth, "Content-Type": `multipart/related; boundary=${boundary}` },
  });
  if (!r.ok) return reply(502, { error: "drive " + r.status + " " + (await r.text()).slice(0, 200) }, origin);
  return reply(200, await r.json(), origin);
};

export const config = { path: "/.netlify/functions/relay" };

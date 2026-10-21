#!/usr/bin/env node
/* ============================================================
   STUTI — put the built corpus on its host

   `stotras/bin/build_corpus.py` writes corpus/index.json and one immutable
   file per text under corpus/t/. This uploads them to an S3-compatible
   bucket (Cloudflare R2 is what docs/corpus-delivery.md chooses) and keeps
   the bucket to exactly what index.json names.

     node tools/sync-corpus.mjs --dry-run      # say what it would do
     node tools/sync-corpus.mjs                # do it
     node tools/sync-corpus.mjs --to <dir>     # copy to a directory instead,
                                               # for testing without an account

   Credentials come from the environment, never from a file in the repo:
   R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.

   Three rules this follows, each for a reason:

   **Only what index.json names goes up.** The build writes a text as
   t/<id>.<hash>.json and never removes the copy under the old hash, so on
   20 October corpus/t held 3,025 files against 2,016 live rows. Uploading
   the directory wholesale would leave a thousand superseded readings on the
   host, reachable by anyone who kept a link.

   **Texts first, index.json last.** The index is the only thing that names a
   text's file, so a reader who fetches the index can always fetch what it
   points at. The other order leaves a window where the app asks for a file
   that is not there yet.

   **The index is never cached, the texts always are.** A text's name carries
   its content hash, so it can be kept for a year and never revalidated;
   index.json is the one file that changes under its own name.
   ============================================================ */
import { createHash, createHmac } from "node:crypto";
import { readFile, readdir, mkdir, copyFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CORPUS = path.join(ROOT, "corpus");
const IMMUTABLE = "public, max-age=31536000, immutable";
const REVALIDATE = "no-cache";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const toDir = args.includes("--to") ? args[args.indexOf("--to") + 1] : null;

/* ---------------- what the index says belongs on the host ---------------- */

async function manifest() {
  const indexPath = path.join(CORPUS, "index.json");
  if (!existsSync(indexPath)) {
    throw new Error("corpus/index.json is missing — run stotras/bin/build_corpus.py first");
  }
  const raw = await readFile(indexPath, "utf8");
  const rows = JSON.parse(raw).texts;
  if (!Array.isArray(rows) || !rows.length) throw new Error("index.json names no texts");
  const wanted = new Map();
  for (const row of rows) {
    if (!row.file) throw new Error(`a row has no file: ${row.id || "(no id)"}`);
    const full = path.join(CORPUS, row.file);
    if (!existsSync(full)) throw new Error(`index names a file that is not built: ${row.file}`);
    wanted.set(row.file, full);
  }
  return { wanted, indexPath, indexBytes: Buffer.from(raw) };
}

/* ---------------- signing, so no SDK is needed ---------------- */

const sha256 = (b) => createHash("sha256").update(b).digest("hex");
const hmac = (key, s) => createHmac("sha256", key).update(s).digest();

function sign({ method, key, body, contentType, cacheControl, accountId, bucket, accessKey, secret }) {
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const now = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = now.slice(0, 8);
  const payload = body ? sha256(body) : "UNSIGNED-PAYLOAD";
  const canonicalUri = `/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const headers = { host, "x-amz-content-sha256": payload, "x-amz-date": now };
  if (contentType) headers["content-type"] = contentType;
  if (cacheControl) headers["cache-control"] = cacheControl;
  const names = Object.keys(headers).sort();
  const canonicalHeaders = names.map((n) => `${n}:${headers[n]}\n`).join("");
  const signedHeaders = names.join(";");
  const canonical = [method, canonicalUri, "", canonicalHeaders, signedHeaders, payload].join("\n");
  const scope = `${date}/auto/s3/aws4_request`;
  const toSign = ["AWS4-HMAC-SHA256", now, scope, sha256(Buffer.from(canonical))].join("\n");
  let k = hmac(Buffer.from(`AWS4${secret}`), date);
  for (const part of ["auto", "s3", "aws4_request"]) k = hmac(k, part);
  const signature = createHmac("sha256", k).update(toSign).digest("hex");
  headers.authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return { url: `https://${host}${canonicalUri}`, headers };
}

function credentials() {
  const need = ["R2_ACCOUNT_ID", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"];
  const missing = need.filter((n) => !process.env[n]);
  if (missing.length) {
    throw new Error(
      `not configured: ${missing.join(", ")} are unset.\n` +
      `Create the bucket, then an R2 API token with Object Read & Write, and export the four.`
    );
  }
  return {
    accountId: process.env.R2_ACCOUNT_ID,
    bucket: process.env.R2_BUCKET,
    accessKey: process.env.R2_ACCESS_KEY_ID,
    secret: process.env.R2_SECRET_ACCESS_KEY,
  };
}

async function put(key, body, contentType, cacheControl, creds) {
  const { url, headers } = sign({ method: "PUT", key, body, contentType, cacheControl, ...creds });
  const res = await fetch(url, { method: "PUT", headers, body });
  if (!res.ok) throw new Error(`PUT ${key} → ${res.status} ${await res.text()}`);
}

async function remove(key, creds) {
  const { url, headers } = sign({ method: "DELETE", key, ...creds });
  const res = await fetch(url, { method: "DELETE", headers });
  if (!res.ok && res.status !== 404) throw new Error(`DELETE ${key} → ${res.status}`);
}

/** Every key already in the bucket, paged. */
async function listRemote(creds) {
  const keys = new Set();
  let token = null;
  do {
    const query = new URLSearchParams({ "list-type": "2", prefix: "t/" });
    if (token) query.set("continuation-token", token);
    const host = `${creds.accountId}.r2.cloudflarestorage.com`;
    const { headers } = sign({ method: "GET", key: "", ...creds });
    const res = await fetch(`https://${host}/${creds.bucket}?${query}`, { headers });
    if (!res.ok) throw new Error(`list → ${res.status} ${await res.text()}`);
    const xml = await res.text();
    for (const m of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) keys.add(m[1]);
    token = (xml.match(/<NextContinuationToken>([^<]+)</) || [])[1] || null;
  } while (token);
  return keys;
}

/* ---------------- the local rehearsal ---------------- */

async function copyTo(dir, wanted, indexBytes) {
  await mkdir(path.join(dir, "t"), { recursive: true });
  for (const [key, full] of wanted) await copyFile(full, path.join(dir, key));
  const existing = existsSync(path.join(dir, "t")) ? await readdir(path.join(dir, "t")) : [];
  const stale = existing.filter((n) => !wanted.has(`t/${n}`));
  await writeFile(path.join(dir, "index.json"), indexBytes);
  console.log(`copied ${wanted.size} texts and index.json to ${dir}`);
  console.log(stale.length ? `  ${stale.length} stale files would be deleted on a real host` : "  nothing stale");
}

/* ---------------- main ---------------- */

const { wanted, indexBytes } = await manifest();
console.log(`index.json names ${wanted.size} texts`);

if (toDir) {
  await copyTo(path.resolve(toDir), wanted, indexBytes);
  process.exit(0);
}

const creds = credentials();
const remote = await listRemote(creds);
const toUpload = [...wanted.keys()].filter((k) => !remote.has(k));
const toDelete = [...remote].filter((k) => !wanted.has(k));

console.log(`on the host: ${remote.size}; to upload: ${toUpload.length}; to remove: ${toDelete.length}`);
if (dryRun) {
  for (const k of toUpload.slice(0, 5)) console.log(`  + ${k}`);
  for (const k of toDelete.slice(0, 5)) console.log(`  - ${k}`);
  console.log("dry run: nothing sent");
  process.exit(0);
}

/* Texts first. */
let done = 0;
for (const key of toUpload) {
  await put(key, await readFile(wanted.get(key)), "application/json", IMMUTABLE, creds);
  if (++done % 100 === 0) console.log(`  ${done}/${toUpload.length}`);
}

/* Then the index, which is what makes the new texts reachable. */
await put("index.json", indexBytes, "application/json", REVALIDATE, creds);
console.log("index.json written");

/* Only then the sweep: until the index no longer names them, they are in use. */
for (const key of toDelete) await remove(key, creds);
if (toDelete.length) console.log(`removed ${toDelete.length} superseded texts`);
console.log("done");

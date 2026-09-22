#!/usr/bin/env node
// Serves the built corpus (../corpus at the repo root) the way the real host
// will: plain files, CORS open, t/*.json immutable, index.json revalidated.
// For checking the loader against the preview (set localStorage
// "stuti-corpus-url" to this server's origin in the app).
//   node tools/serve-corpus.mjs [port] [dir]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
const ROOT = process.argv[3] || join(dirname(fileURLToPath(import.meta.url)), "../../corpus");
const PORT = Number(process.argv[2]) || 4175;
createServer(async (req, res) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Expose-Headers": "ETag" };
  if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(ROOT, normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403, cors); return res.end(); }
  try {
    await stat(file);
    const body = await readFile(file);
    const etag = '"' + createHash("sha1").update(body).digest("hex").slice(0, 16) + '"';
    if (req.headers["if-none-match"] === etag) { res.writeHead(304, cors); return res.end(); }
    const immutable = /^\/t\//.test(p);
    res.writeHead(200, { ...cors, "Content-Type": "application/json; charset=utf-8", ETag: etag,
      "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "no-cache" });
    res.end(body);
  } catch (e) { res.writeHead(404, cors); res.end("not found"); }
}).listen(PORT, () => console.log(`corpus at http://localhost:${PORT}/ from ${ROOT}`));

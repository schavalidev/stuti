#!/usr/bin/env node
// Serves design_handoff_stuti/app as the prototype is served on Claude Design:
// plain files, no build. Used by the `stuti-design` preview entry to check the
// prototype after tools/mirror-to-design.mjs has run.
//   node tools/serve-design.mjs [port] [dir]
// With a dir (a download of the designer's own files, say), files are served
// from there first and from the repo's copy when absent — pictures and fonts
// need not be downloaded to try her current code.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../design_handoff_stuti/app");
const PORT = Number(process.argv[2]) || 4174;
const FIRST = process.argv[3] || null;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".jsx": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf", ".mp3": "audio/mpeg" };
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/") p = "/Stuti.html";
  const file = join(ROOT, normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (FIRST) {
    try { const b = await readFile(join(FIRST, normalize(p))); res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" }).end(b); return; }
    catch (e) { /* fall through to the repo's copy */ }
  }
  try { const b = await readFile(file); res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" }).end(b); }
  catch (e) { res.writeHead(404).end("not found"); }
}).listen(PORT, () => console.log("design prototype on http://localhost:" + PORT));

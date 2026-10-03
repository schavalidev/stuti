#!/usr/bin/env node
/* ============================================================
   The files the app fetches at runtime, and what the phone is made
   to download before it has asked for anything.

   Two traps, both of which this project has actually fallen into:

   1. A file loaded by name at runtime — the gazetteer, the temple
      index — that was never copied into public/. The build serves
      index.html for any unknown path, so the loader gets a 200 and
      a page of HTML, the script fails to parse, and the feature
      reports itself broken to nobody. "Every other place" in the
      location search was empty from the port until 3 Oct 2026 for
      exactly this reason. A 200 is not evidence that a file exists.

   2. The same file swept into the service worker's precache by
      workbox's default glob, so every device downloads it on
      install and again after every deploy — which is the opposite
      of loading it on demand, and is what took the Netlify
      allowance to 75% in a day.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const app = path.join(here, "..", "..");
const SRC = path.join(app, "src"), PUB = path.join(app, "public"), DIST = path.join(app, "dist");

/* every `x.src = "something.js"` that is not an absolute URL */
const wanted = new Map();
for (const f of fs.readdirSync(SRC)) {
  if (!/\.(ts|tsx)$/.test(f)) continue;
  const text = fs.readFileSync(path.join(SRC, f), "utf8");
  for (const m of text.matchAll(/\.src\s*=\s*["'`]([^"'`]+)["'`]/g)) {
    const url = m[1];
    if (/^(https?:)?\/\//.test(url) || url.startsWith("data:") || url.includes("${")) continue;
    wanted.set(url.replace(/^\//, ""), f);
  }
}

let bad = 0;
for (const [file, from] of wanted) {
  if (!fs.existsSync(path.join(PUB, file))) {
    console.error(`  MISSING  public/${file} — ${from} loads it at runtime, and the build would answer with index.html`);
    bad++;
  }
}

/* the precache, if there is a build to read */
const sw = path.join(DIST, "sw.js");
if (fs.existsSync(sw)) {
  const text = fs.readFileSync(sw, "utf8");
  for (const [file] of wanted) {
    if (text.includes(`"${file}"`) || text.includes(`'${file}'`) || text.includes(`/${file}"`)) {
      console.error(`  PRECACHED  ${file} is fetched on demand but sits in the service worker's precache:`);
      console.error(`             every device downloads it on install and after every deploy.`);
      console.error(`             Add it to workbox.globIgnores in vite.config.ts.`);
      bad++;
    }
  }
}

if (bad) { console.error(`data: ${bad} problem(s) — see above`); process.exit(1); }
console.log(`data: ${wanted.size} runtime-loaded file(s) present in public/ and out of the precache`);

// Canonical load order, read from the prototype's own Stuti.html — its
// <script src> tags, then its StutiBoot.load([...]) array — plus the one
// file the tablet/desktop build adds on top. Parsed rather than hardcoded
// so a design update that adds or removes a file is picked up on the next
// run without anyone editing this list. stuti-boot.js is excluded: it was
// the runtime JSX transpiler for the no-build-step prototype and has no job
// once Vite compiles JSX at build time.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const SRC = join(HERE, "../../../design_handoff_stuti/app");

const html = readFileSync(join(SRC, "Stuti.html"), "utf8");

const scripts = [...html.matchAll(/<script\s+src="([^"]+\.js)"/g)].map((m) => m[1]);
const loadBlock = html.match(/StutiBoot\.load\(\[([\s\S]*?)\]\)/);
const jsx = loadBlock ? [...loadBlock[1].matchAll(/"([^"]+\.jsx)"/g)].map((m) => m[1]) : [];

const order = [...scripts, ...jsx].filter((f) => f !== "stuti-boot.js" && !/^https?:/.test(f));
if (existsSync(join(SRC, "stuti-wide-main.jsx")) && !order.includes("stuti-wide-main.jsx")) {
  order.push("stuti-wide-main.jsx");
}

export const ORDER = order;

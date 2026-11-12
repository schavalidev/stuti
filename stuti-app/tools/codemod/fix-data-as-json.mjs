#!/usr/bin/env node
/* ============================================================
   The text, read as JSON rather than as code.

   A tester found the first launch on Android taking about seven
   seconds. It is not the download — inside the app every file is
   already on the phone — it is the parse. The build is one script of
   some 5.8 MB, and roughly two thirds of it is not program at all
   but the hymns themselves: verse text, their meanings, the
   sahasranāma name lists. All of it has to be read as JavaScript
   source, by a parser that must assume any of it could be code,
   before React draws a single pixel.

   A string handed to JSON.parse does not. The grammar is tiny, the
   parser is a different and much faster one, and for a megabyte of
   literal data the difference is large on a phone. The data is
   identical; only the way the engine reads it changes.

   So: every module whose export is one plain literal — no
   functions, no undefined, nothing JSON cannot hold — is rewritten
   to parse that literal from a string. Every rewrite is proved
   first. The literal is evaluated, sent through JSON and read back,
   and the two are compared key by key; a module that does not come
   back exactly as it went in is left alone and named below. Nothing
   is taken on trust, because a silently lost field here would be a
   verse with no meaning, or a name missing from a thousand.
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");

/* the literal that begins at `i` (a [ or {), to its matching close —
   counting brackets, and skipping anything inside a string */
function literalEnd(text, i) {
  const open = text[i];
  const close = open === "[" ? "]" : "}";
  let depth = 0, q = null;
  for (let k = i; k < text.length; k++) {
    const c = text[k];
    if (q) {
      if (c === "\\") { k++; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return k + 1; }
  }
  return -1;
}

/* same value, field for field — the proof that JSON lost nothing */
function same(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) { if (!(k in b) || !same(a[k], b[k])) return false; }
  return true;
}

const DECL = /^export (?:const|var|let) ([A-Za-z_$][\w$]*)\s*=\s*(?=[[{])/m;

let done = 0, bytes = 0;
const skipped = [];

for (const f of readdirSync(SRC)) {
  if (!/\.ts$/.test(f)) continue;
  const path = join(SRC, f);
  let text = readFileSync(path, "utf8");
  if (text.includes("JSON.parse(")) continue;          // already done, or hand-written
  const m = DECL.exec(text);
  if (!m) continue;
  const start = m.index + m[0].length;
  const end = literalEnd(text, start);
  if (end < 0) { skipped.push(`${f}: the literal does not close`); continue; }
  const literal = text.slice(start, end);
  if (literal.length < 4000) continue;                 // only where the parse is worth it

  let value;
  try { value = new Function(`"use strict"; return (${literal});`)(); }
  catch (e) { skipped.push(`${f}: not a self-contained literal (${e.message.slice(0, 50)})`); continue; }

  let json;
  try { json = JSON.stringify(value); } catch (e) { skipped.push(`${f}: will not go through JSON`); continue; }
  if (json === undefined) { skipped.push(`${f}: JSON has nothing to say about it`); continue; }
  if (!same(value, JSON.parse(json))) { skipped.push(`${f}: JSON does not give it back unchanged`); continue; }

  const replacement = `JSON.parse(${JSON.stringify(json)})`;
  writeFileSync(path, text.slice(0, start) + replacement + text.slice(end));
  done++;
  bytes += literal.length;
}

for (const s of skipped) console.log(`  left as code — ${s}`);
console.log(`data as JSON: ${done} module(s), ${(bytes / 1048576).toFixed(2)} MB of literal now parsed as JSON`);

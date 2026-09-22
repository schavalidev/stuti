// One way of applying a seam's literal patches, shared by every seam that is
// also mirrored back into the design (see ../mirror-to-design.mjs).
//
// A seam used to have one job: find the designer's text in the generated
// module and replace it. Once the same patches are carried by the design
// itself, a re-port meets text that is already patched, and a seam that only
// knows how to fail on a missing anchor would stop the pipeline for work that
// is in fact done. So a patch now has three outcomes, and still only one way
// to pass silently wrong:
//
//   applied  — the anchor was there and was replaced
//   upstream — the anchor is gone and the replacement is there: the design
//              carries it. Nothing to do. (If the design carries it without
//              the TypeScript annotations a .jsx cannot hold, they are put
//              back, so src/ comes out the same either way.)
//   throw    — neither. A design update moved something; a human looks.
//
// mode "port"   works on generated .ts/.tsx text.
// mode "design" works on the prototype's own .js/.jsx, where a cross-file name
//               may be written `window.NAME`; anchors are matched with that
//               prefix allowed, and the replacement keeps the prefix wherever
//               the matched text had it, so the transform sees the same
//               window.NAME usages it always did.
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** TypeScript a .jsx cannot hold, in the few shapes the seams use. */
export function stripTs(s) {
  return s
    .replace(/new Map<[^>]+>\(/g, "new Map(")
    .replace(/: Record<string, string>/g, "")
    .replace(/\((\.\.\.)?(\w+): any(\[\])?/g, "($1$2")
    .replace(/(\w+): any(\[\])?([,)])/g, "$1$3")
    .replace(/ as any\b/g, "");
}

/** `from`, as a pattern that also matches where the design wrote window.NAME. */
function tolerant(from) {
  let out = "", i = 0;
  const re = /(?<![\w.$])([A-Z][A-Za-z0-9_]*)\b/g;
  let m;
  while ((m = re.exec(from))) {
    out += esc(from.slice(i, m.index)) + "(?:window\\.)?" + esc(m[1]);
    i = m.index + m[1].length;
  }
  return new RegExp(out + esc(from.slice(i)));
}

/** The names the matched design text wrote as window.NAME. */
const prefixed = (text) => new Set([...text.matchAll(/window\.([A-Z][A-Za-z0-9_]*)\b/g)].map((m) => m[1]));
function withPrefixes(to, names) {
  for (const n of names) to = to.replace(new RegExp(`(?<![\\w.$])${esc(n)}\\b`, "g"), "window." + n);
  return to;
}

export function patcher(seam, text, mode = "port") {
  const stats = { applied: 0, upstream: 0 };
  const api = {
    get text() { return text; },
    set text(v) { text = v; },
    stats,
    /** opts.port: true — this patch only makes sense in the port (an import line, say). */
    patch(from, to, what, opts = {}) {
      if (opts.port && mode !== "port") return;
      if (mode === "port") {
        const bare = stripTs(to);
        const done = to.includes(from) ? text.includes(to) : !text.includes(from) && text.includes(to);
        if (done) { stats.upstream++; return; }
        const doneBare = bare !== to && (bare.includes(from) ? text.includes(bare) : !text.includes(from) && text.includes(bare));
        if (doneBare) { text = text.replace(bare, () => to); stats.upstream++; return; }
        if (!text.includes(from)) throw new Error(`${seam}: anchor not found — ${what}`);
        text = text.replace(from, () => to);
        stats.applied++;
        return;
      }
      /* design */
      const want = stripTs(to);
      const reTo = tolerant(want), reFrom = tolerant(from);
      const hasTo = reTo.test(text), mFrom = reFrom.exec(text);
      const done = want.includes(from) ? hasTo : !mFrom && hasTo;
      if (done) { stats.upstream++; return; }
      if (!mFrom) throw new Error(`${seam} (design): anchor not found — ${what}`);
      text = text.slice(0, mFrom.index) + withPrefixes(want, prefixed(mFrom[0])) + text.slice(mFrom.index + mFrom[0].length);
      stats.applied++;
    },
  };
  return api;
}

/** True when this module is the script node was asked to run. */
import { fileURLToPath } from "node:url";
export const isMain = (metaUrl) => process.argv[1] && fileURLToPath(metaUrl) === process.argv[1];

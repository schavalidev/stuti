// A cue that names a hymn must open it. Both the page's nudge and the phone's
// notification write `#reader/<deity>/<hymn>` when one is tapped, and nothing
// anywhere read it: STUTI_ROUTE.view() looks the hash up in a table of screen
// names, finds no "reader/ganesha/…" in it, and answers null — so the tap
// opened the app and left the reciter wherever they had been, which is the one
// thing a cue about a hymn must not do.
//
// So STUTI_ROUTE learns to answer a whole target — a screen, and the hymn it
// names — and both shells read the target instead of the bare view, at mount
// and on every hash change. Literal anchors; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));

function edit(file, pairs) {
  const F = join(HERE, "../../src/" + file);
  let t = readFileSync(F, "utf8");
  for (const [from, to, what] of pairs) {
    if (!t.includes(from)) throw new Error(`fix-deeplink-seam: anchor not found in ${file} — ${what}`);
    t = t.replace(from, to);
  }
  writeFileSync(F, t);
}

edit("stuti-store.ts", [[
  `  return {
    VIEW: VIEW,`,
  `  /* a hymn named in the URL: #reader/<deity>/<hymn>, which is what a tapped
     cue writes (stuti-nudge.js in a tab, stuti-notify.ts on the phone) and
     what a shared verse link carries. It is not a screen name, so view()
     answers null for it and target() is what reads a link. */
  function target() {
    const h = (location.hash || "").replace(/^#\\/?/, "");
    const m = /^reader\\/([A-Za-z0-9_-]+)\\/([A-Za-z0-9_.-]+)$/i.exec(h);
    if (m) return { view: "reader", deity: m[1], hymn: m[2] };
    const v = VIEW[h.toLowerCase()];
    return v ? { view: v, deity: null, hymn: null } : null;
  }
  return {
    VIEW: VIEW,
    target: target,`,
  "STUTI_ROUTE.target",
]]);

/* both shells: the hash is read once at mount and listened to after */
const mount = (call) => [
  `const [route, setRoute] = useStateM(() => ({ view: ${call} || "home", deity: null, hymn: null, practice: null }));`,
  `const [route, setRoute] = useStateM(() => { const t = STUTI_ROUTE.target(); return { view: (t && t.view) || "home", deity: (t && t.deity) || null, hymn: (t && t.hymn) || null, practice: null }; });`,
  "the route read at mount",
];
const listen = (call) => [
  `    const on = () => { const v = ${call}; if (v) go(v, v === "browse" ? { reset: true } : {}); };`,
  `    const on = () => {
      const t = STUTI_ROUTE.target(); if (!t) return;
      go(t.view, t.view === "browse" ? { reset: true } : t.hymn ? { deity: t.deity, hymn: t.hymn, from: "home" } : {});
    };`,
  "the hashchange listener",
];
edit("stuti-main.tsx", [mount("hashView()"), listen("hashView()")]);
edit("stuti-wide-main.tsx", [mount("STUTI_ROUTE.view()"), listen("STUTI_ROUTE.view()")]);
console.log("deeplink seam applied");

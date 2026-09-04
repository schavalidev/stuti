/* ============================================================
   STUTI — the JSX loader
   The app is written as two dozen JSX files and has no build step,
   so every page load fetched each one, downloaded Babel, and
   transpiled the lot before the first paint. On a phone that is
   most of the wait, and it is the same wait every single morning.

   This loader keeps the no-build-step arrangement and removes the
   repetition: each file is transpiled once, keyed by a hash of its
   own text, and kept in localStorage. A warm load reads the
   compiled output straight out of storage and never asks for Babel
   at all — the 3MB it costs is only paid when something changed.
   Edit one JSX file and only that file is transpiled again.

   Two things are deliberate. Each file is injected as its own
   <script>, exactly as the page did before, so nothing about
   scope changes — files still hand things to each other through
   window, and two files may still each have their own top-level
   const of the same name. And if anything at all goes wrong —
   no fetch (opened over file://), no storage, a bad transform —
   the loader falls back to the old path: Babel plus the original
   tags, which is slow but is known to work.

   Usage, in place of the text/babel tags:
     <script src="stuti-boot.js"></script>
     <script>StutiBoot.load(["a.jsx", "b.jsx"]);</script>
   ============================================================ */
window.StutiBoot = (function () {
  "use strict";

  /* bump when the transform options below change — every cached
     entry from an older loader is then ignored and rewritten */
  const V = 2;
  const PREFIX = "stuti:jsx:";
  const BABEL_SRC = "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js";
  const BABEL_SRI = "sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y";

  /* cyrb53 — short, fast, and good enough to tell one revision of a
     file from another, which is all it is asked to do */
  function hash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  const keyFor = (name, h) => PREFIX + V + ":" + name + ":" + h;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) {
    try { localStorage.setItem(k, v); return true; }
    catch (e) { sweep(); try { localStorage.setItem(k, v); return true; } catch (e2) { return false; } }
  }
  /* only ever touches keys this loader wrote */
  function sweep(keep) {
    try {
      const doomed = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0 && !(keep && keep[k])) doomed.push(k);
      }
      doomed.forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* storage gone; nothing to sweep */ }
  }
  /* drop stale revisions of the files this page just loaded, and leave
     every other page's entries alone — the origin is shared */
  function prune(names, keep) {
    try {
      const mine = {};
      names.forEach((n) => (mine[n] = 1));
      const doomed = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || k.indexOf(PREFIX) !== 0 || keep[k]) continue;
        const name = k.slice(k.indexOf(":", PREFIX.length) + 1, k.lastIndexOf(":"));
        if (mine[name]) doomed.push(k);
      }
      doomed.forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* ignore */ }
  }

  let babelPromise = null;
  function loadBabel() {
    if (window.Babel) return Promise.resolve(window.Babel);
    if (babelPromise) return babelPromise;
    babelPromise = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = BABEL_SRC;
      s.integrity = BABEL_SRI;
      s.crossOrigin = "anonymous";
      s.onload = () => res(window.Babel);
      s.onerror = () => rej(new Error("could not load Babel"));
      document.head.appendChild(s);
    });
    return babelPromise;
  }

  /* One script element per file, injected bare — which is exactly what Babel's
     own tag runner does, and the scope it gives: every top-level declaration,
     const included, lands in one shared global scope that later files can see.
     The app depends on that (the older screens pass a destructured
     `const { useState } = React` from one file to the next), and it is also
     unforgiving — two files declaring the same top-level name is a redeclaration
     error that kills the second one outright. Wrapping each file to dodge that
     would be a quieter arrangement than the one the app was written against, so
     the collisions were fixed instead. sourceURL keeps stack traces pointing at
     the .jsx the code came from. */
  function run(name, code) {
    const s = document.createElement("script");
    s.textContent = code + "\n//# sourceURL=" + name;
    document.body.appendChild(s);
  }

  function complain(msg) {
    const el = document.createElement("pre");
    el.style.cssText = "position:fixed;inset:auto 12px 12px 12px;z-index:99999;margin:0;padding:12px 14px;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;background:#3a1d1d;color:#ffdede;border-radius:8px;max-height:45vh;overflow:auto";
    el.textContent = "Stuti could not start\n\n" + msg;
    document.body.appendChild(el);
  }

  /* the old path, kept whole: Babel and the original tags */
  function fallback(list, done) {
    loadBabel().then(function () {
      list.forEach(function (src) {
        const s = document.createElement("script");
        s.type = "text/babel";
        s.src = src;
        document.body.appendChild(s);
      });
      if (window.Babel && Babel.transformScriptTags) Babel.transformScriptTags();
      if (done) done();
    }).catch(function (e) { complain(String(e && e.message || e)); });
  }

  /* a page may still hold an inline text/babel block — a preview harness,
     say. Babel normally finds those itself on DOMContentLoaded; loaded on
     demand it never gets the chance. Its own transformScriptTags() is not
     used for them: it reads transform options from wherever the host has
     put them, and a host plugin this loader cannot register (om-src-id)
     makes it throw on every block. Transformed here with the same options
     as the files, which is the one arrangement that holds either way. */
  async function inlineTags() {
    const tags = [].slice.call(document.querySelectorAll('script[type="text/babel"]:not([data-stuti-ran])'));
    if (!tags.length) return;
    let B;
    try { B = await loadBabel(); }
    catch (e) { return complain("an inline JSX block could not be compiled\n" + String(e && e.message || e)); }
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      tag.setAttribute("data-stuti-ran", "");
      const src = tag.textContent;
      if (!src || !src.trim()) continue;
      try {
        run("inline-jsx-" + (i + 1), B.transform(src, {
          presets: ["react"], sourceType: "script", filename: "inline-" + (i + 1) + ".jsx", compact: false,
        }).code);
      } catch (e) { complain("an inline JSX block could not be compiled\n" + String(e && e.message || e)); }
    }
  }

  async function load(list, done) {
    let sources;
    try {
      /* revalidate rather than trust the HTTP cache: force-cache here served
         a file that had been edited a minute earlier, and the transform cache
         keys off the text it is given, so a stale fetch caches a stale build */
      sources = await Promise.all(list.map((src) =>
        fetch(src, { cache: "no-cache" }).then((r) => {
          if (!r.ok) throw new Error(src + " — " + r.status);
          return r.text();
        })
      ));
    } catch (e) {
      /* file:// or an offline first load — do it the old way */
      return fallback(list, done);
    }

    const keep = {};
    const units = list.map((name, i) => {
      const src = sources[i];
      const k = keyFor(name, hash(src));
      keep[k] = 1;
      return { name: name, src: src, key: k, code: get(k) };
    });

    const cold = units.filter((u) => !u.code);
    if (cold.length) {
      let Babel;
      try { Babel = await loadBabel(); }
      catch (e) { return complain("Babel did not load, so the JSX could not be compiled.\n" + e.message); }
      for (const u of cold) {
        try {
          u.code = Babel.transform(u.src, {
            presets: ["react"],
            sourceType: "script",
            filename: u.name,
            compact: false,
          }).code;
          set(u.key, u.code);
        } catch (e) {
          return complain(u.name + "\n\n" + String(e && e.message || e));
        }
      }
    }

    for (const u of units) run(u.name, u.code);
    prune(list, keep);
    await inlineTags();
    window.dispatchEvent(new Event("stuti-boot-ready"));
    if (done) done();
  }

  return { load: load, sweep: sweep, version: V };
})();

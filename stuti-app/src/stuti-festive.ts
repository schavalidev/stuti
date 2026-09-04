import { STUTI_THREAD } from "./stuti-sadhana";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — festive moments (Tweaks · Glyphs: Pigment)
   Three things the day itself triggers, all gated by data-pigment
   and stilled by reduced motion:
   · a completion shower — marking a recitation or practice done
     lets a handful of petals fall once across the screen
   · festival drift — on a day the vrata engine names, a few petals
     drift down slowly while the app is open, festival-wide, sparse
   · season tint — data-rtu on <html> (set by the home view) lets
     the accent lean a few degrees toward the running ṛtu
   ============================================================ */
(function () {
  "use strict";
  const reduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pig = () => document.documentElement.getAttribute("data-pigment") !== "off";
  const SHADES = ["oklch(0.72 0.13 20)", "oklch(0.78 0.1 15)", "oklch(0.8 0.11 60)", "oklch(0.84 0.1 85)", "oklch(0.7 0.1 330)"];

  function layer() {
    let el = document.getElementById("festive-layer");
    if (!el) { el = document.createElement("div"); el.id = "festive-layer"; el.setAttribute("aria-hidden", "true"); document.body.appendChild(el); }
    return el;
  }
  function petal(opts) {
    const el = layer(); const p = document.createElement("i");
    p.className = "festive-petal" + (opts.drift ? " drift" : "");
    p.style.left = (opts.x * 100) + "%";
    p.style.background = SHADES[Math.floor(Math.random() * SHADES.length)];
    p.style.setProperty("--fp-dur", opts.dur + "s");
    p.style.setProperty("--fp-delay", (opts.delay || 0) + "s");
    p.style.setProperty("--fp-sway", (Math.random() * 60 - 30) + "px");
    p.style.setProperty("--fp-rot", (Math.random() * 540 - 270) + "deg");
    p.style.setProperty("--fp-scale", (0.7 + Math.random() * 0.7).toFixed(2));
    el.appendChild(p);
    setTimeout(() => p.remove(), (opts.dur + (opts.delay || 0)) * 1000 + 300);
  }

  /* ---------- completion shower ---------- */
  let lastShower = 0;
  function shower() {
    if (!pig() || reduced()) return;
    const now = Date.now(); if (now - lastShower < 4000) return; lastShower = now;
    for (let i = 0; i < 14; i++) petal({ x: Math.random(), dur: 2.2 + Math.random() * 1.6, delay: Math.random() * 0.9 });
  }
  function wrapThread() {
    const T = STUTI_THREAD; if (!T || T.__festive) return;
    const orig = T.mark;
    T.mark = function (kind, id, n, key) {
      let fresh = false;
      if ((kind === "r" || kind === "p") && id && !key) {
        try { const d = T.day(); fresh = !d || (d[kind] || []).indexOf(id) < 0; } catch (e) {}
      }
      const out = orig.apply(T, arguments);
      if (fresh) shower();
      return out;
    };
    T.__festive = true;
  }

  /* ---------- festival drift: sparse petals all day when a vrata falls today ---------- */
  /* ---------- festival drift: only a marked day, not a routine one ----------
     Weekly observances (Śrāvaṇa Sundays) and every-fortnight vratas (Ekādaśī,
     Pradoṣa) recur too often to be an occasion — petals fall only for the
     singular annual days. */
  let driftTimer = null;
  function festivalToday() {
    try {
      const V = STUTI_VRATA; if (!V) return false;
      return (V.upcoming(40) || []).some((u) => u.away === 0 && u.v.weekly === undefined && !u.v.everyMonth);
    } catch (e) { return false; }
  }
  function startDrift() {
    if (driftTimer || !festivalToday()) return;
    driftTimer = setInterval(() => {
      if (!pig() || reduced() || document.hidden) return;
      petal({ x: Math.random(), dur: 7 + Math.random() * 5, drift: true });
    }, 2600);
  }

  function boot() {
    if (!STUTI_THREAD) { setTimeout(boot, 400); return; }
    wrapThread(); startDrift();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();

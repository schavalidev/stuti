/* ============================================================
   STUTI — build stamp + tester diagnostics
   A tester's bug report is only useful if we know which build it
   came from and what state the app was in. This holds the version,
   and can serialise a small, non-personal snapshot to the clipboard.
   ============================================================ */
window.STUTI_BUILD = (function () {
  const VERSION = "0.9.59";
  const BUILD = "2026.08.25";
  const CHANNEL = "test";                 // test | beta | release

  const label = () => "Stuti " + VERSION + " · " + BUILD + " · " + CHANNEL;

  function texts() {
    try {
      const S = window.STUTI;
      const full = S.hymns.filter(h => !h.catalog).length;
      return full + "/" + S.hymns.length;
    } catch (e) { return "?"; }
  }

  function diagnostics() {
    const g = (k, fn) => { try { return fn(); } catch (e) { return "?"; } };
    return [
      label(),
      "texts: " + texts(),
      "script: " + g(0, () => localStorage.getItem("stuti-lang") || "deva"),
      "theme: "  + g(0, () => localStorage.getItem("stuti-theme") || "day"),
      "place: "  + g(0, () => {
        const id = window.STUTI_LOC.getLocId();
        if (id === "detected") { const d = window.STUTI_LOC.getDetected(); return d ? d.city + " (detected)" : "detected"; }
        return id;
      }),
      "tz: " + g(0, () => Intl.DateTimeFormat().resolvedOptions().timeZone + " (" + (-new Date().getTimezoneOffset() / 60) + ")"),
      "saved: " + g(0, () => window.STUTI_FAVS.list().length) + " · watching: " + g(0, () => window.STUTI_WATCH.count()),
      "last read: " + g(0, () => { const p = window.STUTI_PROGRESS.get(); return p ? p.hymnId + " @ line " + p.line + (p.verse != null ? " / verse " + p.verse : "") : "none"; }),
      "viewport: " + g(0, () => innerWidth + "×" + innerHeight + " @" + (devicePixelRatio || 1) + "x"),
      "offline: " + g(0, () => (window.STUTI_OFFLINE ? "cached" : ("serviceWorker" in navigator ? "pending" : "unsupported"))),
      "notify: " + g(0, () => (window.STUTI_NUDGE ? window.STUTI_NUDGE.permission() : "n/a")),
      "when: " + new Date().toISOString(),
      "ua: " + navigator.userAgent,
    ].join("\n");
  }

  function copy() {
    const text = diagnostics();
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(() => true, () => false);
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      return Promise.resolve(true);
    } catch (e) { return Promise.resolve(false); }
  }

  /* ---------- Wiping the slate ----------
     Two scopes, deliberately separate. "Practice" forgets what was done;
     the library, settings and saved stotras survive — the shape a reciter
     wants when starting a fresh saṅkalpa. "Everything" is the tester's
     first-run button. Neither touches keys we did not write. */
  const PRACTICE_KEYS = ["stuti-thread", "stuti-japa", "stuti-japa-last", "stuti-plans", "stuti-vows"];
  const PRACTICE_PREFIX = ["stuti-practice-"];
  /* Named one by one, not by prefix: other documents in this project
     (the font comparer, the changelog) also write "stuti-" keys, and
     they are not ours to erase. */
  const APP_KEYS = PRACTICE_KEYS.concat([
    "stuti-theme", "stuti-lang", "stuti-prefs", "stuti-favs", "stuti-watch",
    "stuti-last", "stuti-loc", "stuti-detected", "stuti-nitya-lens", "stuti-speed",
    "stuti-pada-seen", "stuti-fontscale", "stuti-flyleaf", "stuti-gotra",
    "stuti-nama", "stuti-gender", "stuti-karma", "stuti-home",
  ]);
  const APP_PREFIX = PRACTICE_PREFIX.concat(["stuti-pos-"]);

  function keysMatching(exact, prefixes) {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (exact && exact.indexOf(k) !== -1) { out.push(k); continue; }
      if (prefixes && prefixes.some((p) => k.indexOf(p) === 0)) out.push(k);
    }
    return out;
  }

  /* what a reset would cost, so the confirmation can say it out loud */
  function tally() {
    const g = (fn, d) => { try { return fn(); } catch (e) { return d; } };
    return {
      days:  g(() => window.STUTI_THREAD.streak().days, 0),
      japa:  g(() => Object.keys(JSON.parse(localStorage.getItem("stuti-japa") || "{}"))
                      .reduce((n, id) => n + (window.STUTI_JAPA.state(id).total || 0), 0), 0),
      plans: g(() => window.STUTI_PLANS.active().length, 0),
      vows:  g(() => window.STUTI_VOWS.list().length, 0),
      saved: g(() => window.STUTI_FAVS.list().length, 0),
    };
  }

  function reset(scope) {
    const keys = scope === "all"
      ? keysMatching(APP_KEYS, APP_PREFIX)
      : keysMatching(PRACTICE_KEYS, PRACTICE_PREFIX);
    keys.forEach((k) => { try { localStorage.removeItem(k); } catch (e) {} });
    return keys.length;
  }

  /* ---------- Carrying the shelf to another device ----------
     There is no account and no server, so the honest interim is a file the
     reciter keeps: every key this app wrote, and nothing else. The same
     APP_KEYS list that a reset is allowed to erase is what a copy is allowed
     to carry — one definition of "ours", used by both.

     Restoring reloads the page rather than telling two dozen modules to
     re-read storage: each of them read it once at load, and a reload is the
     one path that cannot leave half the app on the old shelf. */
  function carry() {
    const keys = {};
    keysMatching(APP_KEYS, APP_PREFIX).forEach((k) => {
      try { keys[k] = localStorage.getItem(k); } catch (e) {}
    });
    return { app: "stuti", v: 1, build: BUILD, at: new Date().toISOString(), keys };
  }

  function carryFile() {
    const snap = carry();
    const d = new Date();
    const stamp = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const blob = new Blob([JSON.stringify(snap, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stuti-shelf-" + stamp + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return Object.keys(snap.keys).length;
  }

  /* what a copy holds, read from the file rather than from this device */
  function carryTally(snap) {
    const k = (snap && snap.keys) || {};
    const j = (s) => { try { return JSON.parse(s || "null"); } catch (e) { return null; } };
    const thread = j(k["stuti-thread"]) || {};
    const japa = j(k["stuti-japa"]) || {};
    const plans = j(k["stuti-plans"]) || {};
    const favs = j(k["stuti-favs"]) || [];
    const vows = j(k["stuti-vows"]) || [];
    let rounds = 0;
    Object.keys(japa).forEach((id) => {
      const days = (japa[id] && japa[id].days) || {};
      Object.keys(days).forEach((d) => { rounds += Number(days[d]) || 0; });
    });
    return {
      days: Object.keys(thread).length,
      japa: rounds,
      plans: Object.keys(plans).length,
      vows: Array.isArray(vows) ? vows.length : 0,
      saved: Array.isArray(favs) ? favs.length : 0,
      at: snap && snap.at ? snap.at : null,
      count: Object.keys(k).length,
    };
  }

  function carryRead(text) {
    let snap;
    try { snap = JSON.parse(text); } catch (e) { return null; }
    if (!snap || snap.app !== "stuti" || !snap.keys || typeof snap.keys !== "object") return null;
    return snap;
  }

  /* replace: this device becomes the copy. merge: the copy fills gaps only. */
  function carryRestore(snap, mode) {
    if (!snap || snap.app !== "stuti" || !snap.keys) return 0;
    if (mode !== "merge") {
      keysMatching(APP_KEYS, APP_PREFIX).forEach((k) => { try { localStorage.removeItem(k); } catch (e) {} });
    }
    let n = 0;
    Object.keys(snap.keys).forEach((k) => {
      const ours = APP_KEYS.indexOf(k) !== -1 || APP_PREFIX.some((p) => k.indexOf(p) === 0);
      if (!ours) return;                                  // never write a key we do not own
      if (mode === "merge" && localStorage.getItem(k) != null) return;
      const v = snap.keys[k];
      if (typeof v !== "string") return;
      try { localStorage.setItem(k, v); n++; } catch (e) {}
    });
    return n;
  }

  return { VERSION, BUILD, CHANNEL, label, texts, diagnostics, copy, tally, reset,
           carry, carryFile, carryTally, carryRead, carryRestore };
})();

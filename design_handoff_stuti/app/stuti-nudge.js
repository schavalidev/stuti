/* ============================================================
   STUTI — actually ringing the bell
   Two kinds of cue, and they are not the same kind of thing.

   The daily stotra nudge is a clock time the reciter picked. The
   sandhyā cues are junctures: prātaḥ, mādhyāhnika and sāyaṃ are
   pinned to sunrise and sunset at the chosen place, so their hour
   moves every day and differs by city. Storing "05:30" would be
   wrong by an hour six months later — so what is stored is which
   junctures, and how much warning; the hour is computed each time
   the timer re-arms.

   What a page can honestly promise: while Stuti is open in a tab,
   the cue fires. It cannot wake a closed browser — that needs a push
   server, and there isn't one. The sheet says so plainly.

   One timer, aimed at the earliest cue still due, re-armed after each
   firing. Fired cues are remembered by id and day, so a tab left open
   overnight rings each cue once.

   What is due is no longer reckoned here — STUTI_CUES answers that, purely,
   so the page, the worker and the push server all agree. This file only
   rings what it is handed. And it stands down entirely once a push
   subscription exists: two authorities posting the same cue is a double
   bell, so the server wins and the client only remembers that it fired.
   ============================================================ */
window.STUTI_NUDGE = (function () {
  const KEY = "stuti-nudge-fired";
  let timer = null;

  const dayKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function firedMap() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function markFired(k) {
    const m = firedMap();
    m[k] = 1;
    /* keep the ledger from growing without bound — nothing older than the
       last two days can matter */
    const keep = [dayKey(new Date()), dayKey(new Date(Date.now() - 86400000)), dayKey(new Date(Date.now() + 86400000))];
    Object.keys(m).forEach((x) => { if (keep.indexOf(x.split("|")[1]) === -1) delete m[x]; });
    try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {}
  }

  const supported = () => typeof window.Notification === "function";
  const permission = () => (supported() ? Notification.permission : "unsupported");

  function ask() {
    if (!supported()) return Promise.resolve("unsupported");
    if (Notification.permission !== "default") return Promise.resolve(Notification.permission);
    try { return Notification.requestPermission().then((p) => { arm(); return p; }); }
    catch (e) { return Promise.resolve(Notification.permission); }
  }

  const lang = () => { try { return localStorage.getItem("stuti-lang") || "deva"; } catch (e) { return "deva"; } };

  /* the reciter's own place — the almanac, and so the junctures, are cast for it */
  function place() {
    const PA = window.AKSHARA_PANCHANGA, LOC = window.STUTI_LOC;
    if (!PA || !LOC) return null;
    const id = LOC.getLocId(), det = LOC.getDetected();
    if (id === "detected" && det) return det;
    return PA.locations.find((l) => l.id === id) || PA.locations[0];
  }

  /* what the daily nudge says — the hymn they were last in, else a kept one */
  function body(lg) {
    const L = window.STUTI_L, S = window.STUTI;
    let h = null;
    try {
      const last = window.STUTI_PROGRESS.get();
      h = (last && S.hymnById(last.hymnId)) || null;
      if (!h) { for (const id of window.STUTI_FAVS.list()) { const x = S.hymnById(id); if (x && x.verses && x.verses.length) { h = x; break; } } }
      if (!h) { const t = window.todayInfo && window.todayInfo(); h = t ? t.hymn : S.hymns[0]; }
    } catch (e) {}
    return { title: h ? L.hymnTitle(h, lg) : L.t("todayHymn", lg), text: L.t("nudgeSub", lg), hymn: h };
  }

  /* every cue still due, soonest first — the registry's answer, verbatim */
  function cues(from) {
    try { return window.STUTI_CUES.ring(window.STUTI_CUES.ctx(from || new Date())); }
    catch (e) { return []; }
  }

  /* once the server can reach the device, it owns delivery */
  function pushOwns() {
    try { return !!(window.STUTI_PUSH && window.STUTI_PUSH.subscribed()); } catch (e) { return false; }
  }

  /* the digest names what the day actually asks, not "your daily pāṭha" */
  function digestParts(items, lg) {
    const L = window.STUTI_L, S = window.STUTI, TR = window.STUTI_TRANSLIT;
    const parts = [];
    (items || []).forEach((it) => {
      if (it.kind === "vow" || it.kind === "plan") {
        if (it.kind === "vow" && it.vkind === "japa") {
          if (it.label) { parts.push(it.label + " · " + L.t("vowKindJapa", lg)); return; }
          try { const d = S.deityById[it.deity]; parts.push(L.name(d, lg) + " · " + L.t("vowKindJapa", lg)); } catch (e) { parts.push(L.t("vowKindJapa", lg)); }
          return;
        }
        const h = S.hymnById(it.hymn); if (!h) return;
        parts.push(L.hymnTitle(h, lg) + (it.kind === "plan"
          ? " · " + L.t("digestPlanDay", lg).replace("{n}", it.day) : ""));
      } else if (it.kind === "japa") parts.push(L.t("digestJapa", lg));
      else if (it.kind === "keep") {
        try {
          const k = window.STUTI_KEEP.byId(it.ref), s = k && window.STUTI_KEEP.subject(k); if (!s) return;
          const nm = lg === "telugu" ? (s.name.tel || s.name.roman) : lg === "deva" ? (s.name.deva || s.name.tel || s.name.roman) : s.name.roman;
          const note = it.state === "udyapana" ? L.t("keepUdyapana", lg) : it.state === "month" ? L.t("keepThisMonth", lg)
            : it.state === "vrata" ? (it.away === 0 ? L.t("vrataToday", lg) : L.t("keepIn", lg).replace("{n}", it.away)) : "";
          parts.push(nm + (note ? " · " + note : ""));
        } catch (e) {}
      }
      else if (it.kind === "tithi") {
        const o = it.obs;
        parts.push(lg === "telugu" ? TR.convert(o.deva || o.name, "telugu") : lg === "deva" ? (o.deva || o.name) : o.name);
      }
      else if (it.kind === "recite-missed") parts.push(L.t("digestReciteMissed", lg));
      else if (it.kind === "lapse") {
        let w = L.t(it.what === "japa" ? "lensJapa" : "lensLearn", lg);
        try { const h = it.hymn && S.hymnById(it.hymn); if (h) w = L.hymnTitle(h, lg); } catch (e) {}
        parts.push(L.t("digestLapse", lg).replace("{w}", w).replace("{n}", it.days));
      }
      else if (it.kind === "roundup") {
        const s = it.sum || {};
        parts.push(L.t(it.period === "week" ? "digestWeek" : "digestMonth", lg)
          .replace("{r}", (s.recite || {}).full || 0).replace("{m}", (s.japa || {}).malas || 0).replace("{p}", (s.learn || {}).days || 0).replace("{k}", (s.nomu || {}).days || 0));
      }
      else if (it.kind === "monthstart") parts.push(L.t("digestMonthStart", lg).replace("{d}", it.days).replace("{p}", it.plans).replace("{k}", it.nomus));
      else if (it.kind === "streak") parts.push(L.t("digestStreak", lg).replace("{n}", it.days));
    });
    return parts;
  }

  function post(cue) {
    /* the server will deliver this one — note it and stand down, or the
       local timer keeps chasing a cue it must not ring */
    if (pushOwns()) { markFired(cue.id + "|" + dayKey(cue.at)); return; }
    if (permission() !== "granted") return;
    const lg = lang(), L = window.STUTI_L, P = window.AKSHARA_PANCHANGA, S = window.STUTI_SANDHYA;
    let title, text, hymn = null;
    if (cue.kind === "sandhya") {
      const k = cue.kala;
      title = S.name(k.label, lg);
      text = L.t("sandhyaNudge", lg) + " · " + P.fmtTime(((k.best.start % 1440) + 1440) % 1440) + " – " + P.fmtTime(((k.best.end % 1440) + 1440) % 1440);
    } else {
      const parts = digestParts(cue.items, lg);
      const one = (cue.items || []).filter((x) => x.kind === "vow" || x.kind === "plan");
      title = "Stuti";
      if (parts.length) {
        text = parts.join(" · ");
        if (one.length === 1) hymn = window.STUTI.hymnById(one[0].hymn) || null;
      } else {
        const b = body(lg); text = b.title + " — " + b.text; hymn = b.hymn;
      }
    }
    try {
      const n = new Notification(cue.kind === "sandhya" ? "Stuti · " + title : title, { body: text, tag: cue.id, silent: false });
      n.onclick = () => {
        window.focus();
        if (hymn) { try { location.hash = "#reader/" + hymn.deity + "/" + hymn.id; } catch (e) {} }
        n.close();
      };
    } catch (e) { /* a browser that refuses is not worth a crash */ }
    markFired(cue.id + "|" + dayKey(cue.at));
  }

  function fire() {
    const now = Date.now();
    cues().filter((c) => c.at - now <= 1000).forEach(post);
    arm();
  }

  /* the next moment any bell is due */
  function nextDue() {
    const c = cues()[0];
    return c ? c.at : null;
  }

  function arm() {
    if (timer) { clearTimeout(timer); timer = null; }
    const due = nextDue();
    if (!due) return;
    /* setTimeout saturates past ~24.8 days; re-check hourly anyway so a laptop
       waking from sleep does not miss the hour, and so a change of place or of
       date pulls the next juncture forward */
    const ms = Math.min(due - Date.now(), 3600000);
    timer = setTimeout(() => { const d = nextDue(); (d && Date.now() >= d - 1000) ? fire() : arm(); }, Math.max(1000, ms));
  }

  function start() {
    try { window.STUTI_PREFS.subscribe(arm); } catch (e) {}
    try { window.STUTI_LOC.subscribe(arm); } catch (e) {}
    document.addEventListener("visibilitychange", () => { if (!document.hidden) arm(); });
    arm();
  }

  return { supported, permission, ask, arm, start, nextDue, fire, body, cues, digestParts };
})();

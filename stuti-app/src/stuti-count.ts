/* ============================================================
   STUTI — counting what people do, never who they are
   About a dozen events, each a verb and a small set of enumerated
   facts (which screen, which script). No ids, no names, no verse
   text, no free strings from the reciter. The sink is pluggable:
   set STUTI_COUNT_ENDPOINT (a Plausible-style /api/event URL) and
   events post there; unset, they collect in a session ring buffer
   so a tester can read exactly what would have been sent
   (STUTI_COUNT.recent()). Respects the browser's Do Not Track.
   ============================================================ */
export const STUTI_COUNT = (function () {
  const ENDPOINT = window.STUTI_COUNT_ENDPOINT || null;
  const DOMAIN = (window as any).STUTI_COUNT_DOMAIN || location.hostname || "stuti";
  const EVENTS = ["app_open", "screen", "onboarded", "text_open", "script", "japa", "guide", "search", "install", "feedback", "carry", "gate"];
  const OK_PROPS = ["screen", "script", "kind", "lens", "from"];
  const dnt = (navigator.doNotTrack === "1" || window.doNotTrack === "1");
  const buf = [];
  const KEY = "stuti-count-buf";
  try { const s = sessionStorage.getItem(KEY); if (s) buf.push.apply(buf, JSON.parse(s)); } catch (e) {}

  function clean(props) {
    const out = {};
    if (!props) return out;
    OK_PROPS.forEach((k) => { if (props[k] != null) out[k] = String(props[k]).slice(0, 32); });
    return out;
  }

  let lastScreen = null;
  function hit(name, props) {
    if (dnt || EVENTS.indexOf(name) === -1) return false;
    if (name === "screen") { if (props && props.screen === lastScreen) return false; lastScreen = props && props.screen; }
    const ev = { n: name, p: clean(props), t: Date.now() };
    buf.push(ev); if (buf.length > 60) buf.shift();
    try { sessionStorage.setItem(KEY, JSON.stringify(buf)); } catch (e) {}
    if (ENDPOINT) {
      try {
        const body = JSON.stringify({ name: name, url: location.origin + "/" + (ev.p.screen || ""), domain: DOMAIN, props: ev.p });
        if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
        else fetch(ENDPOINT, { method: "POST", body: body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
      } catch (e) {}
    }
    return true;
  }

  const recent = () => buf.slice();
  const state = () => (dnt ? "dnt" : ENDPOINT ? "on" : "local");

  window.addEventListener("appinstalled", () => hit("install"));
  hit("app_open", { screen: (location.hash || "").replace(/^#\/?/, "") || "home" });

  return { hit, recent, state, EVENTS };
})();

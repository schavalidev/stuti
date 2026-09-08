import "./stuti-voice-shim"; // must come first: replaces window.SpeechRecognition in the native app
import { Capacitor } from "@capacitor/core";
import ReactDOM from "react-dom/client";
import App from "./stuti-main";
import { STUTI_NUDGE } from "./stuti-nudge";
import { registerKept } from "./stuti-recitations"; // kept recitations become each hymn's Listen recording
import { installRelay } from "./stuti-relay"; // crash notes and Follow sessions go to the makers' Drive folder
import "./stuti.css";
import "./stuti-components.css";
import "./stuti-palette.css";
import "./stuti-pigment.css";
import "./stuti-app.css"; // app-shell overrides: system-bar insets, listening cue (hand-authored)

/* No StrictMode: the prototype's stores/timers/effects were never written
   against React's double-invoke-in-dev checks, and this first pass is
   about matching its tested behavior exactly. Worth revisiting once the
   port is stable. */
/* The beta latch (0.9.94) asks every new device for the word. A phone that
   had already finished onboarding before the latch existed was invited by the
   founder in person; it is let through without being asked. */
try {
  const prefs = JSON.parse(localStorage.getItem("stuti-prefs") || "{}");
  if (prefs && prefs.onboarded && !localStorage.getItem("stuti-beta-key")) localStorage.setItem("stuti-beta-key", "1");
} catch (e) {}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

/* arm the daily bell once the app is mounted (offline caching + push are
   handled by vite-plugin-pwa instead of the prototype's hand-written
   stuti-sw.js / manual registration block — see vite.config.ts) */
if (STUTI_NUDGE) STUTI_NUDGE.start();
registerKept();
installRelay();
(window as any).STUTI_COUNT_DOMAIN = "stuti-app.netlify.app";   // one site for the counters, phone and web alike

/* The offline worker is for the web. Inside the Android app every file is
   already on the phone, and a precache only meant that the first launch or
   two after an update still showed the previous build. On the web it
   registers and updates itself; on the phone any old worker is removed. */
if (Capacitor.isNativePlatform()) {
  try {
    navigator.serviceWorker && navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
    typeof caches !== "undefined" && caches.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
  } catch (e) {}
} else {
  import("virtual:pwa-register").then(({ registerSW }) => registerSW({ immediate: true, onRegisteredSW: (_u: string, r: any) => { (window as any).STUTI_OFFLINE = r || null; }, onRegisterError: () => { (window as any).STUTI_OFFLINE = null; } })).catch(() => {});
}

import "./stuti-voice-shim"; // must come first: replaces window.SpeechRecognition in the native app
import { BOOT } from "./stuti-boot"; // second: t0 is taken while the module graph is still being read
import "./stuti-sync-hook"; // before any store writes: stamps the reciter's own keys so they can sync
import { Capacitor } from "@capacitor/core";
import ReactDOM from "react-dom/client";
import App from "./stuti-main";
/* The Hindi and Telugu meanings. The prototype ran these as <script> tags
   after stuti-data; each one attaches v.hi / v.tel to the verses of the
   texts it covers and exports nothing, so nothing imported them and Vite
   never bundled them — a Devanāgarī or Telugu reader got English for every
   text here, in every build to 17 Oct 2026.
   They are no longer imported here. A meaning can only be hung on a verse
   that is there, and since 0.9.134 the verses arrive after first paint, so
   these modules are loaded and re-run by stuti-bundled.ts beside the bodies
   — in the same order the prototype loaded them, which it keeps. */
import { installBundled } from "./stuti-bundled";   // the hymns themselves, read once the first screen is drawn
import { installVrataCache } from "./stuti-vrata-cache";   // the upcoming days, kept between launches
import { STUTI_NUDGE } from "./stuti-nudge";
import { registerKept } from "./stuti-recitations"; // kept recitations become each hymn's Listen recording
import { installRelay } from "./stuti-relay"; // crash notes and Follow sessions go to the makers' Drive folder
import { installJournal } from "./stuti-journal"; // screens, taps and slow tasks, flushed to the same folder
import { installNotify } from "./stuti-notify"; // on the phone the OS holds the cues, so they arrive with the app closed
import { installCloud } from "./stuti-cloud"; // the account, sync and the cue record, when Supabase is configured
import { installWebPush } from "./stuti-webpush"; // on the web, a server keeps the week of bells so they reach a closed browser
import { applyCachedCorrections, refreshCorrections } from "./stuti-corrections";
import { installCorpus } from "./stuti-corpus"; // texts fetched one at a time from the corpus host, kept on the device // verse corrections published without a release
import { STUTI_BUILD } from "./stuti-build";
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

BOOT.mark("imports");   // the module graph is read; everything above this line is the engine
installVrataCache();   // before the first render asks which vrata is next
BOOT.mark("vrata");
installCorpus();   // the fetched catalogue, when a corpus host is configured
BOOT.mark("corpus");
installBundled();  // and the bundled texts, off the critical path
BOOT.mark("bundled");
applyCachedCorrections();
BOOT.mark("corrections");
(window as any).STUTI_BUILD_LABEL = STUTI_BUILD.label();   // the analytics sink names the build, nothing else about the device

BOOT.mark("render0");
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
BOOT.mark("render1");

/* arm the daily bell once the app is mounted (offline caching + push are
   handled by vite-plugin-pwa instead of the prototype's hand-written
   stuti-sw.js / manual registration block — see vite.config.ts) */
/* The daily bell waits for the first paint. arm() asks the pañcāṅga when the
   next juncture is, and on a phone carrying held cues that was measured at
   3,139 ms of held main thread — in the module body, so React had not drawn
   anything yet and it was the whole of a five-second launch. Nothing wants it
   sooner: the timer it sets cannot fire for at least a second. */
const afterPaint = (f: () => void) => {
  let done = false;
  const go = () => { if (done) return; done = true; try { f(); } catch (e) {} };
  /* whichever comes first: the frame after the first paint, or the timer. A
     launch straight into the background paints no frame at all, and the bell
     must be armed either way. */
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => {
      if (typeof requestIdleCallback === "function") requestIdleCallback(go, { timeout: 1200 });
      else setTimeout(go, 0);
    });
  }
  setTimeout(go, 1500);
};
afterPaint(() => { if (STUTI_NUDGE) STUTI_NUDGE.start(); BOOT.mark("nudge"); });
registerKept();
BOOT.mark("kept");
installRelay();
BOOT.mark("relay");
installJournal();
BOOT.mark("journal");
installNotify();
BOOT.mark("notify");
installCloud();
BOOT.mark("cloud");
installWebPush();
BOOT.mark("webpush");
refreshCorrections();
BOOT.mark("installs");
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

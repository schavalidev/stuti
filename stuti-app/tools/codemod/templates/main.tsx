import "./stuti-voice-shim"; // must come first: replaces window.SpeechRecognition in the native app
import ReactDOM from "react-dom/client";
import App from "./stuti-main";
import { STUTI_NUDGE } from "./stuti-nudge";
import { registerKept } from "./stuti-recitations"; // kept recitations become each hymn's Listen recording
import "./stuti.css";
import "./stuti-components.css";
import "./stuti-palette.css";
import "./stuti-pigment.css";
import "./stuti-app.css"; // app-shell overrides: system-bar insets, listening cue (hand-authored)

/* No StrictMode: the prototype's stores/timers/effects were never written
   against React's double-invoke-in-dev checks, and this first pass is
   about matching its tested behavior exactly. Worth revisiting once the
   port is stable. */
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

/* arm the daily bell once the app is mounted (offline caching + push are
   handled by vite-plugin-pwa instead of the prototype's hand-written
   stuti-sw.js / manual registration block — see vite.config.ts) */
if (STUTI_NUDGE) STUTI_NUDGE.start();
registerKept();

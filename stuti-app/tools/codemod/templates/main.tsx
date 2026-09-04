import ReactDOM from "react-dom/client";
import App from "./stuti-main";
import { STUTI_NUDGE } from "./stuti-nudge";
import "./stuti.css";
import "./stuti-components.css";
import "./stuti-palette.css";
import "./stuti-pigment.css";

/* No StrictMode: the prototype's stores/timers/effects were never written
   against React's double-invoke-in-dev checks, and this first pass is
   about matching its tested behavior exactly. Worth revisiting once the
   port is stable. */
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

/* arm the daily bell once the app is mounted (offline caching + push are
   handled by vite-plugin-pwa instead of the prototype's hand-written
   stuti-sw.js / manual registration block — see vite.config.ts) */
if (STUTI_NUDGE) STUTI_NUDGE.start();

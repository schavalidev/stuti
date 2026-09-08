import React from "react";
import { STUTI_BUILD } from "./stuti-build";
import { STUTI_COUNT } from "./stuti-count";
import { STUTI_L } from "./stuti-i18n";
import { Flame, Icon } from "./stuti-icons";

/* ============================================================
   STUTI — the beta latch
   One shared passcode for invited households. A latch, not security:
   it keeps a link that leaks from becoming a hundred strangers before
   the app is ready for them. Entered once, remembered on the device
   (stuti-beta-key); removed for the public build by setting
   STUTI_BUILD.GATE to null.
   ============================================================ */
const { useState: useGateS, useEffect: useGateE, useRef: useGateR } = React;

function GateScreen({ lang = "deva", onOpen }) {
  const L = STUTI_L, B = STUTI_BUILD;
  const [v, setV] = useGateS("");
  const [no, setNo] = useGateS(0);
  const ref = useGateR(null);
  const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, "");
  const tryIt = () => {
    if (norm(v) === norm(B.GATE)) {
      try { localStorage.setItem("stuti-beta-key", "1"); } catch (e) {}
      try { STUTI_COUNT.hit("gate", { kind: "open" }); } catch (e) {}
      onOpen();
    } else { setNo(n => n + 1); setV(""); if (ref.current) ref.current.focus(); }
  };
  useGateE(() => { if (ref.current) ref.current.focus(); }, []);
  const font = L.font(lang);
  return (
    <div className="gate-wrap" role="dialog" aria-label={L.t("gateTitle", lang)}>
      <div className="gate-card">
        <div className="gate-brand"><Flame size={26} /><span className="display" style={{ fontFamily: font }}>{lang === "telugu" ? "స్తుతి" : lang === "deva" ? "स्तुति" : "Stuti"}</span></div>
        <h1 className="gate-title display" style={{ fontFamily: font }}>{L.t("gateTitle", lang)}</h1>
        <p className="gate-lede">{L.t("gateLede", lang)}</p>
        <form className="gate-form" onSubmit={(e) => { e.preventDefault(); tryIt(); }}>
          <input ref={ref} className={"gate-input" + (no ? " gate-shake" : "")} key={no} autoFocus value={v} onChange={(e) => setV(e.target.value)}
            placeholder={L.t("gatePh", lang)} autoComplete="off" autoCapitalize="none" spellCheck="false" inputMode="text" aria-label={L.t("gatePh", lang)} />
          <button className="gate-go" type="submit" disabled={!v.trim()}>{L.t("gateGo", lang)}<Icon name="arrow" size={17} /></button>
        </form>
        <p className={"gate-note" + (no ? " is-no" : "")}>{no ? L.t(no > 2 ? "gateNoAgain" : "gateNo", lang) : L.t("gateHint", lang)}</p>
        {no > 2 && B.SUPPORT && <a className="gate-mail" href={"mailto:" + B.SUPPORT}>{B.SUPPORT}</a>}
        <div className="gate-foot">{B.label()}</div>
      </div>
    </div>
  );
}

/* the latch is open when there is no code to ask for, or this device gave it once */
function gateOpen() {
  const B = STUTI_BUILD;
  if (!B || !B.GATE) return true;
  try { return localStorage.getItem("stuti-beta-key") === "1"; } catch (e) { return false; }
}

export { GateScreen, gateOpen };

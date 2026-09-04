import React from "react";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";
import { STUTI_LIMITS } from "./stuti-limits-core";
import { OverlayPortal } from "./stuti-picker";

/* ============================================================
   STUTI — the "coming in v2" sheet, and the lock a spent control wears
   Held, not disabled: past the month's one free print or share the
   control keeps its place and its colour, wears a small lock, and
   the tap opens this sheet rather than doing nothing. No prices and
   no plan here — that is v2's work — only the fact that one is
   coming, and a way to ask to be told.
   ============================================================ */
const { useState: useLimS, useEffect: useLimE } = React;

/* reactive: re-renders wherever it is read the instant the allowance changes,
   which is what lets a lock appear on the exact tap that spends the last one */
function useLimitLeft(gate) {
  const [, bump] = React.useReducer(x => x + 1, 0);
  useLimE(() => STUTI_LIMITS.subscribe(() => bump()), []);
  return STUTI_LIMITS.left(gate);
}

function LimitLock({ size = 13 }) {
  return <Icon name="lock" size={size} />;
}

function LimitSheet({ lang = "roman", onClose }) {
  const L = STUTI_L, LM = STUTI_LIMITS;
  const [noted, setNoted] = useLimS(() => LM.interested());
  return (
    <OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet" role="dialog" aria-label={L.t("limCap", lang)}>
          <div className="pd-grip" />
        <button className="pd-x" onClick={onClose} aria-label={STUTI_L.t("close", lang)}><Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{L.t("limCap", lang)}</div>
            <div className="rm-head-title display">{L.t("limTitle", lang)}</div>
            <div className="rm-head-sub">{L.t("limLede", lang)}</div>
          </div>
          <div className="pd-body scroll">
            <div className="dana-soon">
              <div className="dana-soon-mark"><Icon name="lock" size={24} /></div>
              <div className="dana-soon-title display">{L.t("limComing", lang)}</div>
              <p className="dana-soon-body">{L.t("limBody", lang)}</p>
            </div>
            <div className="dana-acts">
              <button className="dana-cta" disabled={noted} onClick={() => { LM.note(); setNoted(true); }}>
                {L.t(noted ? "limNoted" : "limNotify", lang)}
              </button>
              <button className="dana-later" onClick={onClose}>{L.t("limNotNow", lang)}</button>
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

export { useLimitLeft, LimitLock, LimitSheet };

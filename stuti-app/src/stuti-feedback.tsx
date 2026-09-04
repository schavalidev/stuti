import React from "react";
import { STUTI_BUILD } from "./stuti-build";
import { STUTI_DANA } from "./stuti-dana-core";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_LOC } from "./stuti-store";

/* ============================================================
   STUTI — feedback, and asking for what is missing
   Three kinds, because they go to different places in the work:
   something is broken, something is wanted, something in the
   text is wrong — the last matters most in a corpus like this
   and is worth its own door. Nothing is sent silently: the sheet
   shows exactly what will travel with the message, and the send
   hands it to the reader's own mail app rather than to a server
   this app does not have.
   ============================================================ */
const { useState: useFbS } = React;

/* the one address to change when there is a better one */
const FB_TO = "feedback@stuti.app";

function FeedbackSheet({ lang = "deva", onClose }) {
  const L = STUTI_L;
  const [kind, setKind] = useFbS("problem");
  const [text, setText] = useFbS("");
  const [reply, setReply] = useFbS("");
  const [sent, setSent] = useFbS("");
  const script = lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null;

  /* What travels with the message, shown rather than attached quietly. The build
     stamp is the app's own — STUTI_BUILD names the version once, so the chip in
     About, a tester's diagnostics paste and this message cannot disagree. A
     broken thing gets the full diagnostics, which is exactly what they are for;
     an idea or a textual correction needs the build and the reading script and
     nothing else about the device. */
  const facts = () => {
    const B = STUTI_BUILD;
    if (kind === "problem" && B && B.diagnostics) { try { return B.diagnostics(); } catch (e) {} }
    const out = [B && B.label ? B.label() : "Stuti"];
    out.push("script: " + lang);
    try {
      const LOC = STUTI_LOC, LOCS = AKSHARA_PANCHANGA.locations;
      const id = LOC.getLocId(), det = LOC.getDetected();
      const p = (id === "detected" && det) ? det : (LOCS.find(l => l.id === id) || LOCS[0]);
      if (p) out.push("place: " + (p.city || p.name || p.label || p.id));
    } catch (e) {}
    try { if (STUTI_DANA.gave()) out.push("lamp: lit"); } catch (e) {}
    return out.join(" · ");
  };

  const subject = "[Stuti] " + L.t("fbKind_" + kind, "roman");
  const body = () => text.trim() + "\n\n—\n" + facts() + (reply.trim() ? "\nreply to: " + reply.trim() : "");

  const send = () => {
    if (!text.trim()) return;
    const href = "mailto:" + FB_TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body());
    try { window.location.href = href; setSent("mail"); } catch (e) { setSent("fail"); }
  };
  const copy = () => {
    const t = subject + "\n\n" + body();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => setSent("copied"), () => setSent("fail"));
    else setSent("fail");
  };

  return (
    <OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet" role="dialog" aria-label={L.t("fbTitle", lang)}>
          <div className="pd-grip" />
        <button className="pd-x" onClick={onClose} aria-label={STUTI_L.t("close", lang)}><Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{L.t("fbCap", lang)}</div>
            <div className="rm-head-title display" style={script}>{L.t("fbTitle", lang)}</div>
            <div className="rm-head-sub">{L.t("fbLede", lang)}</div>
          </div>
          <div className="pd-body scroll">
            <div className="fb-kinds">
              {["problem", "idea", "text"].map(k => (
                <button key={k} className={"fb-kind" + (kind === k ? " on" : "")} onClick={() => setKind(k)} aria-pressed={kind === k}>
                  {L.t("fbKind_" + k, lang)}
                </button>
              ))}
            </div>
            <p className="fb-hint">{L.t("fbHint_" + kind, lang)}</p>

            <label className="acc-field">
              <span>{L.t("fbYourWords", lang)}</span>
              <textarea className="fb-area" value={text} rows={6}
                onChange={e => { setText(e.target.value); setSent(""); }}
                placeholder={L.t("fbPlaceholder_" + kind, lang)} />
            </label>
            <label className="acc-field">
              <span>{L.t("fbReply", lang)}</span>
              <input value={reply} onChange={e => setReply(e.target.value)} placeholder={L.t("fbReplyPh", lang)} />
            </label>

            <div className="fb-facts">
              <div className="eyebrow">{L.t("fbSentWith", lang)}</div>
              <code>{facts()}</code>
              <p>{L.t("fbNoTrack", lang)}</p>
            </div>

            <div className="dana-acts">
              <button className="dana-cta" disabled={!text.trim()} onClick={send}>{L.t("fbSend", lang)}</button>
              <button className="dana-later" onClick={copy}>{L.t("fbCopy", lang)}</button>
            </div>
            {sent && <p className="fb-done">{L.t(sent === "copied" ? "fbCopied" : sent === "mail" ? "fbHanded" : "fbFailed", lang)}</p>}
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

export { FeedbackSheet };

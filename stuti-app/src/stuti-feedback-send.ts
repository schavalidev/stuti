/* ============================================================
   STUTI — feedback that arrives
   Hand-authored. The design's feedback sheet hands the message to
   the reciter's mail app, because there was nowhere else to send
   it. Now it goes through the log relay into the makers' Drive
   folder, beside the testers' logs, as feedback-<device>-<time>-
   <kind>.txt — the same text the sheet shows. The mail app stays
   the fallback when the relay cannot be reached. Unlike crash
   notes, this is sent even with the log switch off: the reciter
   pressed Send. Placed by tools/codemod/fix-feedback-seam.mjs.
   ============================================================ */
import { deviceId } from "./stuti-relay";

const SITE = "https://stuti-app.netlify.app";
const PATH = "/.netlify/functions/relay";

export async function sendFeedback(kind: string, subject: string, body: string): Promise<boolean> {
  if (/HeadlessChrome|Lighthouse|bot\b/i.test(navigator.userAgent)) return false;
  const onSite = /netlify\.app$/.test(location.hostname);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const name = "feedback-" + deviceId() + "-" + stamp + "-" + String(kind).replace(/[^a-z]/g, "") + ".txt";
  try {
    const r = await fetch((onSite ? "" : SITE) + PATH, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mime: "text/plain", text: subject + "\n\n" + body + "\n" }),
    });
    return r.ok;
  } catch (e) { return false; }
}

/* the one line the design has no key for */
export const FB_SENT: Record<string, string> = {
  roman: "Sent. Thank you — we read every message.",
  deva: "भेज दिया। धन्यवाद — हम हर संदेश पढ़ते हैं।",
  telugu: "పంపాము. ధన్యవాదాలు — ప్రతి సందేశాన్నీ చదువుతాము.",
};

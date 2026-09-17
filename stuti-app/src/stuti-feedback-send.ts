/* ============================================================
   STUTI — feedback that arrives
   Hand-authored. The design's feedback sheet hands the message to
   the reciter's mail app, because there was nowhere else to send
   it. Now Send does two things at once:
   - posts to the log relay, which mails it to the support address
     (through Resend) and files it in the makers' Drive folder as
     feedback-<device>-<time>-<kind>.txt;
   - when Supabase is configured, adds a row to `stuti_feedback`,
     the list reviewed in the app (stuti-feedback-inbox.tsx).
   Either one arriving counts as sent. The mail app stays the
   fallback when neither can be reached. Unlike crash notes, this
   is sent even with the log switch off: the reciter pressed Send.
   Placed by tools/codemod/fix-feedback-seam.mjs.
   ============================================================ */
import { Capacitor } from "@capacitor/core";
import { deviceId } from "./stuti-relay";
import { cloud } from "./stuti-cloud";

const SITE = "https://stuti-app.netlify.app";
const PATH = "/.netlify/functions/relay";
const KINDS = ["problem", "idea", "text"];

const buildLabel = () => String((window as any).STUTI_BUILD_LABEL || "").slice(0, 60);   // set by main.tsx

async function viaRelay(kind: string, subject: string, body: string) {
  const onSite = /netlify\.app$/.test(location.hostname);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const name = "feedback-" + deviceId() + "-" + stamp + "-" + String(kind).replace(/[^a-z]/g, "") + ".txt";
  try {
    const r = await fetch((onSite ? "" : SITE) + PATH, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mime: "text/plain", text: subject + "\n\n" + body + "\n", subject, build: buildLabel() }),
    });
    return r.ok;
  } catch (e) { return false; }
}

async function viaTable(kind: string, subject: string, body: string) {
  const c = cloud(); if (!c) return false;
  try {
    const { error } = await c.from("stuti_feedback").insert({
      kind: KINDS.indexOf(kind) >= 0 ? kind : "problem",
      subject: subject.slice(0, 200), body: body.slice(0, 20000),
      build: buildLabel(), platform: Capacitor.getPlatform(),
    });
    return !error;
  } catch (e) { return false; }
}

export async function sendFeedback(kind: string, subject: string, body: string): Promise<boolean> {
  if (/HeadlessChrome|Lighthouse|bot\b/i.test(navigator.userAgent)) return false;
  const [a, b] = await Promise.all([viaRelay(kind, subject, body), viaTable(kind, subject, body)]);
  return a || b;
}

/* the one line the design has no key for */
export const FB_SENT: Record<string, string> = {
  roman: "Sent. Thank you — we read every message.",
  deva: "भेज दिया। धन्यवाद — हम हर संदेश पढ़ते हैं।",
  telugu: "పంపాము. ధన్యవాదాలు — ప్రతి సందేశాన్నీ చదువుతాము.",
};

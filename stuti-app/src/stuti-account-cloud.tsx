import React from "react";
import { AccountView as DesignAccountView } from "./stuti-account";
import { useDana } from "./stuti-dana";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";
import { STUTI_CLOUD_AUTH as A, type Summary } from "./stuti-cloud";
import "./stuti-account-cloud.css";
import { FeedbackInbox, useIsAdmin } from "./stuti-feedback-inbox";

/* ============================================================
   STUTI — the account screen, against a real server
   Hand-authored. The designer's AccountView (stuti-account.tsx)
   asks for a handle and a name and signs in at once, because
   nothing checked. A real sign-in has a second step — the code
   that arrives by mail or SMS — so this screen keeps her layout,
   classes and words, and adds that step and an honest sync line.
   Until stuti-cloud-config.ts is filled in it hands over to her
   screen unchanged. Placed by tools/codemod/fix-account-seam.mjs.
   ============================================================ */
const { useState, useEffect } = React;

/* the few words the design has no key for yet */
const W: Record<string, Record<string, string>> = {
  lede:      { roman: "With an account, your reading position, vows and lamp are kept safe and are the same on every phone you sign in on.", deva: "खाते से आपका पढ़ने का स्थान, व्रत और दीप सुरक्षित रहते हैं, और जिस फोन पर भी साइन इन करें, वहाँ वही मिलते हैं।", telugu: "ఖాతాతో మీ పఠన స్థానం, వ్రతాలు, దీపం భద్రంగా ఉంటాయి; మీరు సైన్ ఇన్ చేసే ప్రతి ఫోన్‌లోనూ అవే ఉంటాయి." },
  codeSent:  { roman: "We have sent a code to {h}. Type it here.", deva: "{h} पर एक कोड भेजा है। उसे यहाँ लिखिये।", telugu: "{h} కి ఒక కోడ్ పంపాము. దాన్ని ఇక్కడ రాయండి." },
  codeLbl:   { roman: "The code", deva: "कोड", telugu: "కోడ్" },
  sendCode:  { roman: "Send the code", deva: "कोड भेजिये", telugu: "కోడ్ పంపండి" },
  verify:    { roman: "Sign in", deva: "साइन इन", telugu: "సైన్ ఇన్" },
  back:      { roman: "Use a different number or address", deva: "दूसरा नम्बर या पता", telugu: "వేరే నంబరు లేదా చిరునామా" },
  failed:    { roman: "That did not work. Please check and try again.", deva: "यह नहीं हुआ। देखकर फिर से कोशिश कीजिये।", telugu: "కుదరలేదు. సరిచూసి మళ్ళీ ప్రయత్నించండి." },
  wait:      { roman: "One moment…", deva: "एक क्षण…", telugu: "ఒక్క క్షణం…" },
  s_syncing: { roman: "Syncing now.", deva: "अभी सिंक हो रहा है।", telugu: "ఇప్పుడు సింక్ అవుతోంది." },
  s_synced:  { roman: "Your data is saved to your account and kept the same on every phone you sign in on.", deva: "आपका डेटा आपके खाते में सुरक्षित है, और जिस फोन पर भी साइन इन करें, वहाँ वही रहेगा।", telugu: "మీ వివరాలు మీ ఖాతాలో భద్రంగా ఉన్నాయి. మీరు సైన్ ఇన్ చేసే ప్రతి ఫోన్‌లోనూ అవే ఉంటాయి." },
  s_offline: { roman: "No connection. Changes are kept on this phone and will be sent when the connection returns.", deva: "इंटरनेट नहीं है। बदलाव इसी फोन पर रखे हैं और इंटरनेट आने पर भेजे जायेंगे।", telugu: "ఇంటర్నెట్ లేదు. మార్పులు ఈ ఫోన్‌లోనే ఉన్నాయి, కనెక్షన్ రాగానే పంపబడతాయి." },
  s_error:   { roman: "Syncing did not complete. It will try again.", deva: "सिंक पूरा नहीं हुआ। फिर से कोशिश होगी।", telugu: "సింక్ పూర్తి కాలేదు. మళ్ళీ ప్రయత్నిస్తుంది." },
  carryVows: { roman: "Vows, plans and reminders", deva: "व्रत, अभ्यास और स्मारक", telugu: "వ్రతాలు, అభ్యాసం, రిమైండర్‌లు" },
  syncNow:   { roman: "Sync now", deva: "अभी सिंक करें", telugu: "ఇప్పుడు సింక్ చేయండి" },
  s_conflict: { roman: "This phone and your account hold different records. Choose which to keep.", deva: "इस फोन और आपके खाते में अलग-अलग रिकॉर्ड हैं। कौन-सा रखना है, चुनिये।", telugu: "ఈ ఫోన్‌లోనూ మీ ఖాతాలోనూ వేర్వేరు వివరాలు ఉన్నాయి. ఏది ఉంచాలో ఎంచుకోండి." },
  cfCap:     { roman: "Which record to keep", deva: "कौन-सा रिकॉर्ड रखें", telugu: "ఏ వివరాలు ఉంచాలి" },
  cfNote:    { roman: "The one you keep replaces the other completely. They are not combined. The one you do not keep cannot be recovered.", deva: "जो आप रखेंगे, वह दूसरे की जगह पूरी तरह ले लेगा। दोनों जोड़े नहीं जाते। जो नहीं रखेंगे, वह वापस नहीं मिलेगा।", telugu: "మీరు ఉంచేవి మిగతా వాటి స్థానాన్ని పూర్తిగా తీసుకుంటాయి. రెండూ కలపబడవు. ఉంచనివి తిరిగి రావు." },
  cfPhone:   { roman: "This phone", deva: "यह फोन", telugu: "ఈ ఫోన్" },
  cfAcct:    { roman: "Your account", deva: "आपका खाता", telugu: "మీ ఖాతా" },
  cfKeepPhone: { roman: "Keep this phone's record", deva: "इस फोन का रिकॉर्ड रखें", telugu: "ఈ ఫోన్ వివరాలు ఉంచండి" },
  cfKeepAcct:  { roman: "Keep the account's record", deva: "खाते का रिकॉर्ड रखें", telugu: "ఖాతా వివరాలు ఉంచండి" },
  cfSure:    { roman: "The other record will be removed. Are you sure?", deva: "दूसरा रिकॉर्ड हट जायेगा। क्या आप निश्चित हैं?", telugu: "మరొకటి తొలగిపోతుంది. మీరు నిశ్చయించుకున్నారా?" },
  cfYes:     { roman: "Yes, keep it", deva: "हाँ, यही रखें", telugu: "అవును, ఇదే ఉంచండి" },
  cancel:    { roman: "Cancel", deva: "रहने दें", telugu: "వద్దు" },
  mJapa:     { roman: "Japa counted", deva: "जप की गिनती", telugu: "జప సంఖ్య" },
  mDays:     { roman: "Days of practice", deva: "अभ्यास के दिन", telugu: "అభ్యాస దినాలు" },
  mVows:     { roman: "Vows", deva: "व्रत", telugu: "వ్రతాలు" },
  mFavs:     { roman: "Favourites", deva: "प्रिय स्तोत्र", telugu: "ఇష్టమైనవి" },
  mLast:     { roman: "Last changed", deva: "अंतिम बदलाव", telugu: "చివరి మార్పు" },
  delCap:    { roman: "Delete the account", deva: "खाता हटाएँ", telugu: "ఖాతా తొలగించండి" },
  delNote:   { roman: "This removes your account and everything kept on our server under it. What is on this phone stays on this phone.", deva: "इससे आपका खाता और हमारे सर्वर पर उसमें रखा सब कुछ हट जाता है। इस फोन पर जो है, वह इसी फोन पर रहता है।", telugu: "దీనితో మీ ఖాతా, మా సర్వర్‌లో దానిలో ఉన్నదంతా తొలగిపోతుంది. ఈ ఫోన్‌లో ఉన్నది ఈ ఫోన్‌లోనే ఉంటుంది." },
  delBtn:    { roman: "Delete my account", deva: "मेरा खाता हटाएँ", telugu: "నా ఖాతా తొలగించండి" },
  delSure:   { roman: "This cannot be undone. Delete the account and its data on the server?", deva: "यह वापस नहीं होगा। खाता और सर्वर पर उसका डेटा हटा दें?", telugu: "ఇది తిరిగి రాదు. ఖాతాను, సర్వర్‌లోని దాని వివరాలను తొలగించాలా?" },
  delYes:    { roman: "Yes, delete it", deva: "हाँ, हटा दें", telugu: "అవును, తొలగించండి" },
  delDone:   { roman: "Your account has been deleted.", deva: "आपका खाता हटा दिया गया।", telugu: "మీ ఖాతా తొలగించబడింది." },
  realNote:  { roman: "Your account is kept on our server. Only you can read your data. The name and gotra in the saṅkalpa stay on this phone and are never sent.", deva: "आपका खाता हमारे सर्वर पर है। आपका डेटा केवल आप देख सकते हैं। संकल्प का नाम और गोत्र इसी फोन पर रहते हैं, कभी भेजे नहीं जाते।", telugu: "మీ ఖాతా మా సర్వర్‌లో ఉంది. మీ వివరాలు మీరు మాత్రమే చూడగలరు. సంకల్పంలోని పేరు, గోత్రం ఈ ఫోన్‌లోనే ఉంటాయి, ఎక్కడికీ పంపబడవు." },
};
const w = (k: string, lang: string) => (W[k] && (W[k][lang] || W[k].roman)) || k;

function useCloudSession() {
  const [s, setS] = useState(() => A.get());
  const [, bump] = React.useReducer((x: number) => x + 1, 0);
  useEffect(() => A.subscribe((v) => { setS(v); bump(); }), []);
  return s;
}

function Record({ title, s, lang }: { title: string; s: Summary; lang: string }) {
  const loc = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN";
  const n = (x: number) => x.toLocaleString(loc);
  const rows: [string, string][] = [["mJapa", n(s.japa)], ["mDays", n(s.days)], ["mVows", n(s.vows)], ["mFavs", n(s.favs)]];
  if (s.last) rows.push(["mLast", new Date(s.last).toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" })]);
  return (
    <div className="cf-card">
      <div className="cf-title display">{title}</div>
      {rows.map(([k, v]) => <div className="cf-row" key={k}><span>{w(k, lang)}</span><b>{v}</b></div>)}
    </div>
  );
}

function CloudAccountView({ go, lang = "deva", backView = "settings" }: any) {
  const L = STUTI_L;
  const session = useCloudSession();
  const lamp = useDana();
  const [method, setMethod] = useState<null | "google" | "phone" | "email">(null);
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"handle" | "code">("handle");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [choose, setChoose] = useState<null | "phone" | "account">(null);
  const [delAsk, setDelAsk] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const script = lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : undefined;
  const P = A.providers();

  const handleOk = method === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(handle.trim())
    : method === "phone" ? handle.replace(/[^\d]/g, "").length >= 10 : false;

  const run = async (f: () => Promise<{ ok: boolean; error?: string }>, next?: () => void) => {
    setBusy(true); setErr("");
    try { const r = await f(); if (r.ok) { next && next(); } else setErr(w("failed", lang)); }
    catch (e) { setErr(w("failed", lang)); }
    setBusy(false);
  };

  const state = A.syncState();
  const conflict = A.conflict();
  const admin = useIsAdmin(session ? session.id : null);
  const methods = ([["google", "accGoogle", "globe"], ["phone", "accPhone", "phone"], ["email", "accEmail", "mail"]] as const).filter(([k]) => (P as any)[k]);

  return (
    <div className="view libhub scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go(backView)} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display">{L.t("account", lang)}</div>
        <span style={{ width: 44 }} />
      </div>

      <div className="lens-pad">
        {session ? (
          <React.Fragment>
            <section className="acc-card">
              <div className="acc-seal"><Icon name="lotus" size={26} /></div>
              <div className="acc-who">
                <div className="acc-name display" style={script}>{session.name || L.t("accNoName", lang)}</div>
                <div className="acc-handle">{session.handle || L.t("accVia", lang).replace("{p}", L.t("accProv_" + session.provider, lang))}</div>
              </div>
            </section>

            {conflict && (
              <section className="set-sect cf">
                <div className="eyebrow set-cap">{w("cfCap", lang)}</div>
                <p className="set-note">{w("s_conflict", lang)}</p>
                <div className="cf-pair">
                  <Record title={w("cfPhone", lang)} s={conflict.here} lang={lang} />
                  <Record title={w("cfAcct", lang)} s={conflict.account} lang={lang} />
                </div>
                <p className="acc-fine">{w("cfNote", lang)}</p>
                {!choose ? (
                  <div className="cf-actions">
                    <button className="dana-cta" onClick={() => setChoose("phone")}>{w("cfKeepPhone", lang)}</button>
                    <button className="dana-cta" onClick={() => setChoose("account")}>{w("cfKeepAcct", lang)}</button>
                  </div>
                ) : (
                  <div className="cf-actions">
                    <p className="set-note">{w(choose === "phone" ? "cfKeepPhone" : "cfKeepAcct", lang)} — {w("cfSure", lang)}</p>
                    <button className="dana-cta" disabled={busy} onClick={() => run(() => A.resolve(choose), () => setChoose(null))}>{busy ? w("wait", lang) : w("cfYes", lang)}</button>
                    <button className="dana-later" disabled={busy} onClick={() => setChoose(null)}>{w("cancel", lang)}</button>
                  </div>
                )}
                {err && <p className="fb-done">{err}</p>}
              </section>
            )}

            <section className="set-sect">
              <div className="eyebrow set-cap">{L.t("accSyncCap", lang)}</div>
              <p className="set-note">{w("s_" + (state === "signedOut" || state === "off" ? "syncing" : state), lang)}</p>
              <div className="acc-rows">
                {["accCarryPlace", "carryVows", "accCarryPlus"].map(k => (
                  <div className="acc-row" key={k}>
                    <span className="acc-row-mark"><Icon name={state === "synced" ? "check" : "clock"} size={14} /></span>
                    <span>{W[k] ? w(k, lang) : L.t(k, lang)}</span>
                  </div>
                ))}
              </div>
              {state !== "syncing" && state !== "conflict" && <button className="dana-later" onClick={() => A.syncNow()}>{w("syncNow", lang)}</button>}
            </section>

            <section className="set-sect">
              <div className="eyebrow set-cap">{L.t("danaCap", lang)}</div>
              <p className="set-note">{lamp ? L.t("danaRowLit", lang) : L.t("accPlusNone", lang)}</p>
            </section>

            {admin && <FeedbackInbox lang={lang} />}

            <button className="acc-out" onClick={() => { A.signOut(); setStep("handle"); setMethod(null); setCode(""); }}>{L.t("accSignOut", lang)}</button>
            <p className="acc-fine">{w("realNote", lang)}</p>

            <section className="set-sect cf-del">
              <div className="eyebrow set-cap">{w("delCap", lang)}</div>
              <p className="set-note">{w("delNote", lang)}</p>
              {!delAsk ? (
                <button className="acc-out cf-danger" onClick={() => { setErr(""); setDelAsk(true); }}>{w("delBtn", lang)}</button>
              ) : (
                <div className="cf-actions">
                  <p className="set-note">{w("delSure", lang)}</p>
                  <button className="acc-out cf-danger" disabled={busy}
                    onClick={() => run(() => A.deleteAccount(), () => { setDelAsk(false); setDeleted(true); setStep("handle"); setMethod(null); setCode(""); })}>
                    {busy ? w("wait", lang) : w("delYes", lang)}
                  </button>
                  <button className="dana-later" disabled={busy} onClick={() => setDelAsk(false)}>{w("cancel", lang)}</button>
                </div>
              )}
              {delAsk && err && <p className="fb-done">{err}</p>}
            </section>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {deleted && <p className="set-note">{w("delDone", lang)}</p>}
            <p className="acc-lede">{w("lede", lang)}</p>

            {step === "handle" && (
              <div className="acc-methods">
                {methods.map(([k, key, icon]) => (
                  <button key={k} className={"acc-method" + (method === k ? " on" : "")} disabled={busy}
                    onClick={() => { setErr(""); if (k === "google") run(() => A.google()); else setMethod(k); }}>
                    <Icon name={icon} size={18} /> {L.t(key, lang)}
                  </button>
                ))}
              </div>
            )}

            {method && method !== "google" && step === "handle" && (
              <div className="acc-form">
                <label className="acc-field">
                  <span>{L.t(method === "phone" ? "accPhoneLbl" : "accEmailLbl", lang)}</span>
                  <input value={handle} onChange={e => setHandle(e.target.value)}
                    inputMode={method === "phone" ? "tel" : "email"} autoComplete={method === "phone" ? "tel" : "email"}
                    placeholder={method === "phone" ? "+91" : "name@example.com"} />
                </label>
                <label className="acc-field">
                  <span>{L.t("accNameLbl", lang)}</span>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={L.t("accNamePh", lang)} />
                </label>
                <button className="dana-cta" disabled={!handleOk || busy}
                  onClick={() => run(() => A.sendCode(method, handle), () => setStep("code"))}>
                  {busy ? w("wait", lang) : w("sendCode", lang)}
                </button>
              </div>
            )}

            {method && method !== "google" && step === "code" && (
              <div className="acc-form">
                <p className="set-note">{w("codeSent", lang).replace("{h}", handle.trim())}</p>
                <label className="acc-field">
                  <span>{w("codeLbl", lang)}</span>
                  <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={10} />
                </label>
                <button className="dana-cta" disabled={code.replace(/\D/g, "").length < 6 || busy}
                  onClick={() => run(() => A.verify(method, handle, code, name))}>
                  {busy ? w("wait", lang) : w("verify", lang)}
                </button>
                <button className="dana-later" onClick={() => { setStep("handle"); setCode(""); setErr(""); }}>{w("back", lang)}</button>
              </div>
            )}

            {err && <p className="fb-done">{err}</p>}

            <div className="acc-carry">
              <div className="eyebrow">{L.t("accCarryCap", lang)}</div>
              <ul>
                <li>{L.t("accCarryPlace", lang)}</li>
                <li>{w("carryVows", lang)}</li>
                <li>{L.t("accCarryPlus", lang)}</li>
              </ul>
              <p className="acc-fine">{w("realNote", lang)}</p>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function AccountView(props: any) {
  return A.configured() ? <CloudAccountView {...props} /> : <DesignAccountView {...props} />;
}

export { AccountView };

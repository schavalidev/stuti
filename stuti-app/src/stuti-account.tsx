import React from "react";
import { STUTI_AUTH } from "./stuti-auth";
import { useDana } from "./stuti-dana";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";

/* ============================================================
   STUTI — the account screen
   Sign in, see what an account will carry, and sign out. Every
   promise on this page is marked with when it becomes true:
   the local things work today, the crossing-devices things say
   they are waiting for a server rather than implying one.
   ============================================================ */
const { useState: useAcS, useEffect: useAcE } = React;

function useSession() {
  const A = STUTI_AUTH;
  const [s, setS] = useAcS(() => A.get());
  useAcE(() => A.subscribe(setS), []);
  return s;
}

function AccountView({ go, lang = "deva", backView = "settings" }) {
  const L = STUTI_L, A = STUTI_AUTH;
  const session = useSession();
  const lamp = useDana();
  const [method, setMethod] = useAcS(null);      // google | phone | email
  const [handle, setHandle] = useAcS("");
  const [name, setName] = useAcS("");
  const script = lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null;

  /* a name typed wrong is a name that comes back wrong on the other device,
     so the door stays shut until the handle at least has the right shape */
  const handleOk = method === "google" ? true
    : method === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(handle.trim())
    : method === "phone" ? (handle.replace(/[^\d]/g, "").length >= 10)
    : false;

  const submit = () => {
    if (method === "google") { A.signIn("google", { name: name || "", handle: "" }); return; }
    if (!handleOk) return;
    A.signIn(method, { name: name.trim(), handle: handle.trim() });
    setHandle(""); setMethod(null);
  };

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

            <section className="set-sect">
              <div className="eyebrow set-cap">{L.t("accSyncCap", lang)}</div>
              <p className="set-note">{L.t("accSyncWaiting", lang)}</p>
              <div className="acc-rows">
                {["accCarryPlace", "accCarryVows", "accCarryPlus"].map(k => (
                  <div className="acc-row" key={k}>
                    <span className="acc-row-mark"><Icon name="clock" size={14} /></span>
                    <span>{L.t(k, lang)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="set-sect">
              <div className="eyebrow set-cap">{L.t("danaCap", lang)}</div>
              <p className="set-note">{lamp ? L.t("danaRowLit", lang) : L.t("accPlusNone", lang)}</p>
            </section>

            <button className="acc-out" onClick={() => A.signOut()}>{L.t("accSignOut", lang)}</button>
            <p className="acc-fine">{L.t("accStubNote", lang)}</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="acc-lede">{L.t("accLede", lang)}</p>

            <div className="acc-methods">
              {[["google", "accGoogle", "globe"], ["phone", "accPhone", "phone"], ["email", "accEmail", "mail"]].map(([k, key, icon]) => (
                <button key={k} className={"acc-method" + (method === k ? " on" : "")} onClick={() => setMethod(k)}>
                  <Icon name={icon} size={18} /> {L.t(key, lang)}
                </button>
              ))}
            </div>

            {method && (
              <div className="acc-form">
                {method !== "google" && (
                  <label className="acc-field">
                    <span>{L.t(method === "phone" ? "accPhoneLbl" : "accEmailLbl", lang)}</span>
                    <input value={handle} onChange={e => setHandle(e.target.value)}
                      inputMode={method === "phone" ? "tel" : "email"}
                      placeholder={method === "phone" ? "+91" : "name@example.com"} />
                  </label>
                )}
                <label className="acc-field">
                  <span>{L.t("accNameLbl", lang)}</span>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={L.t("accNamePh", lang)} />
                </label>
                <button className="dana-cta" onClick={submit} disabled={!handleOk}>{L.t("accContinue", lang)}</button>
              </div>
            )}

            <div className="acc-carry">
              <div className="eyebrow">{L.t("accCarryCap", lang)}</div>
              <ul>
                <li>{L.t("accCarryPlace", lang)}</li>
                <li>{L.t("accCarryVows", lang)}</li>
                <li>{L.t("accCarryPlus", lang)}</li>
              </ul>
              <p className="acc-fine">{L.t("accStubNote", lang)}</p>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export { AccountView, useSession };

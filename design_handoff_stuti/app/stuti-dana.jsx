/* ============================================================
   STUTI — the dakṣiṇā sheet, and the lamp it lights
   One sheet: what the giving is for, four amounts, and — for the
   patron amount — the name to be printed. It ends on the truth
   that the rail is not open yet rather than on a card form.
   The lamp is the receipt: a card on the home screen that keeps
   burning, with the giver's name under it.
   ============================================================ */
const { useState: useDnS, useEffect: useDnE } = React;

/* A real Razorpay Payment Button, embedded only once its id is configured.
   Razorpay's own script renders the button and owns the whole checkout —
   this component just gives it an empty <form> to render into and redraws
   it when the picked amount (and so the button id) changes. */
function RazorpayButton({ buttonId }) {
  const formRef = React.useRef(null);
  useDnE(() => {
    const form = formRef.current;
    if (!form) return;
    form.innerHTML = "";
    if (!buttonId) return;
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/payment-button.js";
    s.setAttribute("data-payment_button_id", buttonId);
    s.async = true;
    form.appendChild(s);
  }, [buttonId]);
  return <form ref={formRef} className="dana-razorpay" />;
}

function useDana() {
  const D = window.STUTI_DANA;
  const [, bump] = React.useReducer(x => x + 1, 0);
  useDnE(() => (D ? D.subscribe(() => bump()) : undefined), []);
  return D ? D.supporter() : null;
}

function DanaSheet({ lang = "deva", onClose }) {
  const L = window.STUTI_L, D = window.STUTI_DANA, Icon = window.Icon;
  const given = useDana();
  const [step, setStep] = useDnS(given ? "lit" : "ask");
  const [pick, setPick] = useDnS("month");
  const [name, setName] = useDnS(given ? given.name : "");
  const [noted, setNoted] = useDnS(() => D.interested());
  const script = lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null;
  const amt = D.byId(pick);
  const rzpId = (window.STUTI_RAZORPAY || {})[pick];

  return (
    <window.OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet" role="dialog" aria-label={L.t("danaCap", lang)}>
          <div className="pd-grip" />
        <button className="pd-x" onClick={onClose} aria-label={window.STUTI_L.t("close", lang)}><window.Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{L.t("danaCap", lang)}</div>
            <div className="rm-head-title display" style={script}>{L.t(step === "lit" ? "danaLitTitle" : "danaTitle", lang)}</div>
            <div className="rm-head-sub">{L.t(step === "lit" ? "danaLitSub" : "danaLede", lang)}</div>
          </div>
          <div className="pd-body scroll">
            {step === "lit" ? (
              <React.Fragment>
                <div className="dana-lamp big">
                  <window.Flame size={40} />
                  <div className="dana-lamp-name display" style={script}>{(given && given.name) || L.t("danaLampNoName", lang)}</div>
                  <div className="dana-lamp-note">{L.t("danaPreviewNote", lang)}</div>
                </div>
                <div className="dana-acts">
                  <button className="dana-later" onClick={() => { D.clear(); setStep("ask"); }}>{L.t("danaPutOut", lang)}</button>
                </div>
              </React.Fragment>
            ) : step === "soon" && rzpId ? (
              <React.Fragment>
                <div className="dana-soon">
                  <div className="dana-soon-mark"><window.Flame size={28} /></div>
                  <div className="dana-soon-title display">{amt.inr} · {L.t(amt.key, lang)}</div>
                </div>
                <RazorpayButton buttonId={rzpId} />
                <div className="dana-acts">
                  {/* a real charge already happened above; this just records the lamp locally */}
                  <button className="dana-cta" onClick={() => { D.give({ id: pick, name: name }); setStep("lit"); }}>
                    {L.t("danaMarkLit", lang)}
                  </button>
                  <button className="dana-later" onClick={() => setStep("ask")}>{L.t("danaNotNow", lang)}</button>
                </div>
              </React.Fragment>
            ) : step === "soon" ? (
              <React.Fragment>
                <div className="dana-soon">
                  <div className="dana-soon-mark"><window.Flame size={28} /></div>
                  <div className="dana-soon-title display">{L.t("danaSoonTitle", lang)}</div>
                  <p className="dana-soon-body">{L.t("danaSoonBody", lang)}</p>
                  <p className="dana-soon-body">{L.t("danaRails", lang)}</p>
                </div>
                <div className="dana-acts">
                  <button className="dana-cta" disabled={noted} onClick={() => { D.note(); setNoted(true); }}>
                    {L.t(noted ? "danaNoted" : "danaNotify", lang)}
                  </button>
                  {/* the lamp can be lit now as a preview, and says that it is one */}
                  <button className="dana-later" onClick={() => { D.give({ id: pick, name: name }); setStep("lit"); }}>
                    {L.t("danaPreviewLamp", lang)}
                  </button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ul className="dana-what">
                  {["danaWhat1", "danaWhat2"].map(k => (
                    <li key={k}><span className="dana-tick"><Icon name="check" size={14} /></span><span>{L.t(k, lang)}</span></li>
                  ))}
                </ul>

                <div className="dana-amts">
                  {D.amounts.map(a => (
                    <button key={a.id} className={"dana-amt" + (pick === a.id ? " on" : "")} onClick={() => setPick(a.id)} aria-pressed={pick === a.id}>
                      <span className="dana-amt-mark">{pick === a.id && <Icon name="check" size={13} />}</span>
                      <span className="dana-amt-body">
                        <b>{a.inr}</b>
                        <span>{L.t(a.key, lang)}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {amt.named && (
                  <label className="acc-field dana-name">
                    <span>{L.t("danaNameLbl", lang)}</span>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder={L.t("danaNamePh", lang)} />
                  </label>
                )}

                <p className="dana-note">{L.t("danaOpenNote", lang)}</p>

                <div className="dana-acts">
                  <button className="dana-cta" onClick={() => setStep("soon")}>{L.t("danaGive", lang)}</button>
                  <button className="dana-later" onClick={onClose}>{L.t("danaNotNow", lang)}</button>
                </div>

                <div className="dana-free">
                  <div className="eyebrow">{L.t("danaNothingHeld", lang)}</div>
                  <p>{L.t("danaNothingHeldNote", lang)}</p>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </window.OverlayPortal>
  );
}

/* The home-screen row: a lamp once something has been given, an invitation
   before that. Quiet either way — this is a request, not a banner. */
function DanaRow({ lang = "deva" }) {
  const L = window.STUTI_L;
  const given = useDana();
  const [open, setOpen] = useDnS(false);
  return (
    <React.Fragment>
      <button className={"dana-row" + (given ? " lit" : "")} onClick={() => setOpen(true)}>
        <span className="dana-row-mark">{given ? <window.Flame size={22} /> : <window.Icon name="lotus" size={20} />}</span>
        <span className="dana-row-body">
          <span className="dana-row-title">{L.t(given ? "danaRowLit" : "danaRowAsk", lang)}</span>
          <span className="dana-row-sub">{given ? ((given.name || L.t("danaLampNoName", lang)) + " · " + L.t("danaPreviewShort", lang)) : L.t("danaRowSub", lang)}</span>
        </span>
        <window.Icon name="chev" size={17} />
      </button>
      {open && <DanaSheet lang={lang} onClose={() => setOpen(false)} />}
    </React.Fragment>
  );
}

Object.assign(window, { useDana, DanaSheet, DanaRow });

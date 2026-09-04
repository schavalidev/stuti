import { Icon } from "./stuti-icons";
import React from "react";
import { STUTI_AUTH } from "./stuti-auth";
import { STUTI_BUILD } from "./stuti-build";
import { STUTI_DANA } from "./stuti-dana-core";
import { DanaSheet, useDana } from "./stuti-dana";
import { FeedbackSheet } from "./stuti-feedback";
import { FlyleafForm, useFlyleaf } from "./stuti-flyleaf";
import { STUTI_L } from "./stuti-i18n";
import { BuildStamp, ResetPanel } from "./stuti-library";
import { STUTI_NUDGE } from "./stuti-nudge";
import { LocationControl } from "./stuti-panchanga";
import { STUTI_PREFS } from "./stuti-prefs";

/* ============================================================
   STUTI — Settings
   Everything the reciter told us once, in one place: the script
   they read, the hour of the lamp, the place the almanac is cast
   for, and how their tradition names the lunar months.

   The pañcāṅga section is live. Reckoning picks the scheme the
   longitudes are computed in at all; ayanāṁśa moves the sidereal
   zero point the nakṣatras are measured from — and is therefore
   inert under vākya, which carries its own; sampradāya decides
   which day a vrata is kept on when the schools differ. All three
   sit on real longitudes and real tithi timings, so all three
   change what the app says — which is why they are offered.
   ============================================================ */
const { useState: useStateS, useEffect: useEffectS } = React;

function SetSection({ title, note, children }) {
  return (
    <section className="set-sect">
      <div className="eyebrow set-cap">{title}</div>
      {note && <p className="set-note">{note}</p>}
      <div className="set-body">{children}</div>
    </section>
  );
}

function SetRow({ label, sub, children, onClick, as }) {
  const Tag = onClick ? "button" : (as || "div");
  return (
    <Tag className="set-row" onClick={onClick}>
      <span className="set-row-body">
        <span className="set-row-label">{label}</span>
        {sub && <span className="set-row-sub">{sub}</span>}
      </span>
      <span className="set-row-ctl">{children}</span>
    </Tag>
  );
}

/* ---------------- The regrouped page ----------------
   Settings used to be seventeen sections of identical white cards, each with
   its own eyebrow, its own note and its own border — every hairline the same
   weight as every other, so nothing led the eye and the whole page read pale.
   It is now six chapters. A chapter is announced once, in the display face
   with a gold mark and a rule; everything under it lives in one sheet parted
   by inner hairlines, so the sheet's own edge is the only strong line. The
   pañcāṅga's five choices, which cost eleven full-width option cards, are
   value pills that open on demand — the answer is visible, the arguing for it
   sits underneath in small type. */
function SetChapter({ icon, title, children }) {
  return (
    <section className="set-ch">
      <div className="set-ch-head">
        <span className="set-ch-mark"><Icon name={icon} size={18} stroke={1.8} /></span>
        <h2 className="set-ch-title display">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SetPanel({ children }) { return <div className="set-panel">{children}</div>; }

/* a labelled control: the answer on the right, the reason below */
function SetField({ label, note, children }) {
  return (
    <div className="set-field">
      <div className="set-field-top">
        <span className="set-field-label">{label}</span>
        <span className="set-field-ctl">{children}</span>
      </div>
      {note && <p className="set-field-note">{note}</p>}
    </div>
  );
}

/* free-form contents — a form, a menu, a paragraph — inside the same sheet */
function SetBlock({ note, children }) {
  return (
    <div className="set-block">
      {children}
      {note && <p className="set-block-note">{note}</p>}
    </div>
  );
}

/* a stack of choices — used for anything with 2–4 named answers */
function SetChoice({ value, options, onChange, disabled, dropdown }) {
  const [open, setOpen] = useStateS(false);
  if (dropdown) {
    const cur = options.find((o) => o.k === value) || options[0];
    return (
      <div className={"set-dd" + (disabled ? " off" : "") + (open ? " open" : "")}>
        <button className="set-dd-face" disabled={disabled} aria-expanded={open}
          onClick={() => !disabled && setOpen((v) => !v)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}>
          <span className="set-opt-name">{cur.name}</span>
          {cur.sub && <span className="set-opt-sub">{cur.sub}</span>}
          <Icon name="chev" size={17} />
        </button>
        {open && (
          <div className="set-dd-list" role="listbox">
            {options.map((o) => (
              <button key={o.k} className={"set-dd-item" + (value === o.k ? " on" : "")}
                role="option" aria-selected={value === o.k}
                onClick={() => { onChange(o.k); setOpen(false); }}>
                <span className="set-opt-name">{o.name}</span>
                {o.sub && <span className="set-opt-sub">{o.sub}</span>}
                {value === o.k && <Icon name="check" size={17} />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={"set-choice" + (disabled ? " off" : "")}>
      {options.map((o) => (
        <button key={o.k} className={"set-opt" + (value === o.k ? " on" : "")}
          disabled={disabled} aria-pressed={value === o.k}
          onClick={() => !disabled && onChange(o.k)}>
          <span className="set-opt-name">{o.name}</span>
          {o.sub && <span className="set-opt-sub">{o.sub}</span>}
          {value === o.k && !disabled && <Icon name="check" size={17} />}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Carry your shelf ----------------
   There is no account behind Stuti, so the shelf cannot follow a reciter to a
   new phone by itself. A file can: STUTI_BUILD.carry writes every key the app
   owns, and nothing else. Restoring offers two readings of the same file —
   replace, for a new device, and fill-gaps, for a device that has its own
   history you do not want to lose. */
function CarrySection({ lang: uiLang }) {
  const L = STUTI_L, B = STUTI_BUILD;
  const [pending, setPending] = useStateS(null);
  const [note, setNote] = useStateS(null);
  const fileRef = React.useRef(null);
  const holds = pending ? B.carryTally(pending) : null;
  const fill = (t) => L.t("carryHolds", uiLang)
    .replace("{days}", t.days).replace("{plans}", t.plans)
    .replace("{saved}", t.saved).replace("{japa}", t.japa);
  const onPick = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      const snap = B.carryRead(String(rd.result || ""));
      if (!snap) { setPending(null); setNote("bad"); return; }
      setNote(null); setPending(snap);
    };
    rd.onerror = () => { setPending(null); setNote("bad"); };
    rd.readAsText(f);
  };
  const restore = (mode) => {
    B.carryRestore(pending, mode);
    setPending(null); setNote("done");
    setTimeout(() => { try { location.reload(); } catch (e) {} }, 800);
  };
  return (
    <React.Fragment>
      <SetRow label={L.t("carrySave", uiLang)} sub={L.t("carrySaveSub", uiLang)}
        onClick={() => { B.carryFile(); setPending(null); setNote("saved"); }}>
        <Icon name="share" size={18} />
      </SetRow>
      <SetRow label={L.t("carryLoad", uiLang)} sub={L.t("carryLoadSub", uiLang)}
        onClick={() => fileRef.current && fileRef.current.click()}>
        <Icon name="chev" size={18} />
      </SetRow>
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={onPick} hidden />
      {pending && (
        <div className="set-carry">
          <div className="set-carry-holds">{fill(holds)}</div>
          {holds.at && <div className="set-carry-when">{new Date(holds.at).toLocaleString()}</div>}
          <div className="set-carry-acts">
            <button className="set-carry-go" onClick={() => restore("replace")}>{L.t("carryDo", uiLang)}</button>
            <button className="set-carry-alt" onClick={() => restore("merge")}>{L.t("carryMerge", uiLang)}</button>
            <button className="set-carry-x" onClick={() => setPending(null)}>{L.t("carryCancel", uiLang)}</button>
          </div>
        </div>
      )}
      {note && (
        <div className={"set-carry-note" + (note === "bad" ? " bad" : "")}>
          {L.t(note === "bad" ? "carryBad" : note === "done" ? "carryDone" : "carrySaved", uiLang)}
        </div>
      )}
    </React.Fragment>
  );
}

/* the flyleaf's own form, without the section shell it used to carry */
function FlyleafBlock({ lang: uiLang }) {
  const L = STUTI_L;
  const sk = useFlyleaf();
  return (
    <SetBlock note={L.t("flDeviceNote", uiLang)}>
      <div className="set-block-cap">{L.t("flTitle", uiLang)}</div>
      <div className="fl-set"><FlyleafForm sk={sk} lang={uiLang} /></div>
    </SetBlock>
  );
}

function SettingsView({ go, lang, setLang, uiLang, setUiLang, theme, toggleTheme, openRemind, backView }) {
  const L = STUTI_L, PR = STUTI_PREFS;
  const [prefs, setPrefs] = useStateS(() => PR.get());
  useEffectS(() => PR.subscribe(setPrefs), []);
  const masaSystem = prefs.masaSystem || "amanta";
  const DANA = STUTI_DANA;
  const given = useDana();
  const [danaOpen, setDanaOpen] = useStateS(false);
  const [fbOpen, setFbOpen] = useStateS(false);
  const rm = prefs.remind || {};

  const scripts = [
    { k: "deva", name: "देवनागरी", sub: "Devanāgarī" },
    { k: "roman", name: "IAST", sub: "English" },
    { k: "telugu", name: "తెలుగు", sub: "Telugu" },
  ];
  const uiLangCustom = localStorage.getItem("stuti-ui-lang-custom") === "1";
  const uiLangOptions = [
    { k: "match", name: L.t("uiLangMatch", uiLang) },
    { k: "deva", name: "देवनागरी", sub: "Devanāgarī" },
    { k: "roman", name: "IAST", sub: "English" },
    { k: "telugu", name: "తెలుగు", sub: "Telugu" },
  ];

  const masaOptions = [
    { k: "amanta", name: L.t("amanta", uiLang), sub: L.t("amantaSub", uiLang) },
    { k: "purnimanta", name: L.t("purnimanta", uiLang), sub: L.t("purnimantaSub", uiLang) },
  ];

  const ayanOptions = [
    { k: "lahiri", name: "Lahiri", sub: L.t("ayanLahiri", uiLang) },
    { k: "raman", name: "Raman", sub: L.t("ayanRaman", uiLang) },
    { k: "kp", name: "KP", sub: L.t("ayanKP", uiLang) },
  ];
  const sampradayaOptions = [
    { k: "smarta", name: L.t("smarta", uiLang), sub: L.t("smartaSub", uiLang) },
    { k: "vaishnava", name: L.t("vaishnava", uiLang), sub: L.t("vaishnavaSub", uiLang) },
  ];
  /* vākya is nirayana by construction, so the ayanāṁśa below has nothing to
     act on. The control stays visible and goes quiet — hiding it would leave
     the reciter hunting for a setting that was there yesterday. */
  const manaOptions = [
    { k: "candra", name: L.t("manaCandra", uiLang), sub: L.t("manaCandraSub", uiLang) },
    { k: "saura", name: L.t("manaSaura", uiLang), sub: L.t("manaSauraSub", uiLang) },
  ];
  const reckoning = prefs.reckoning || "drik";
  const reckoningOptions = [
    { k: "drik", name: L.t("drikName", uiLang), sub: L.t("drikSub", uiLang) },
    { k: "vakya", name: L.t("vakyaName", uiLang), sub: L.t("vakyaSub", uiLang) },
  ];

  return (
    <div className="view libhub scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go(backView || "home")} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display">{L.t("settings", uiLang)}</div>
        <span style={{ width: 44 }} />
      </div>

      {danaOpen && <DanaSheet lang={lang} onClose={() => setDanaOpen(false)} />}
      {fbOpen && <FeedbackSheet lang={lang} onClose={() => setFbOpen(false)} />}

      <div className="lens-pad">
       <div className="set-page">

        <SetChapter icon="pray" title={L.t("setChReciter", uiLang)}>
          <SetPanel>
            <FlyleafBlock lang={uiLang} />
            <SetRow label={STUTI_AUTH.signedIn() ? (STUTI_AUTH.get().name || L.t("account", uiLang)) : L.t("accSignIn", uiLang)}
              sub={STUTI_AUTH.signedIn() ? L.t("accSyncWaiting", uiLang) : L.t("accLede", uiLang)}
              onClick={() => go("account", { from: "settings" })}>
              <Icon name="chev" size={18} />
            </SetRow>
            <SetRow label={L.t(given ? "danaRowLit" : "danaRowAsk", uiLang)}
              sub={given ? ((given.name || L.t("danaLampNoName", uiLang)) + " · " + L.t("danaPreviewShort", uiLang)) : L.t("danaRowSub", uiLang)}
              onClick={() => setDanaOpen(true)}>
              <Icon name="chev" size={18} />
            </SetRow>
          </SetPanel>
        </SetChapter>

        <SetChapter icon="text" title={L.t("setChReading", uiLang)}>
          <SetPanel>
            <SetField label={L.t("readIn", uiLang)}>
              <SetChoice value={lang} options={scripts} onChange={setLang} dropdown />
            </SetField>
            <SetField label={L.t("uiLangLabel", uiLang)} note={L.t("uiLangNote", uiLang)}>
              <SetChoice value={uiLangCustom ? uiLang : "match"} options={uiLangOptions} onChange={setUiLang} dropdown />
            </SetField>
            <SetRow label={L.t("nightMode", uiLang)} sub={L.t("nightModeSub", uiLang)} onClick={toggleTheme}>
              <span className={"set-switch" + (theme === "night" ? " on" : "")}><i /></span>
            </SetRow>
          </SetPanel>
        </SetChapter>

        <SetChapter icon="locate" title={L.t("setChPlace", uiLang)}>
          <SetPanel>
            <SetBlock note={L.t("placeNote", uiLang)}>
              <div className="set-block-cap">{L.t("placeLabel", uiLang)}</div>
              <div className="set-loc"><LocationControl /></div>
            </SetBlock>
            <SetRow label={L.t("dailyReminder", uiLang)}
              sub={rm.on ? rm.time : L.t("reminderOff", uiLang)}
              onClick={() => openRemind && openRemind()}>
              <Icon name="chev" size={18} />
            </SetRow>
            <NotifPermRow lang={uiLang} />
          </SetPanel>
        </SetChapter>

        <SetChapter icon="calendar" title={L.t("panchangaLabel", uiLang)}>
          <SetPanel>
            <SetField label={L.t("setMasa", uiLang)} note={L.t("masaNote", uiLang)}>
              <SetChoice value={masaSystem} options={masaOptions} dropdown
                onChange={(k) => PR.set({ masaSystem: k })} />
            </SetField>
            <SetField label={L.t("setMana", uiLang)} note={L.t("manaNote", uiLang)}>
              <SetChoice value={prefs.mana || "candra"} options={manaOptions} dropdown
                onChange={(k) => PR.set({ mana: k })} />
            </SetField>
            <SetField label={L.t("setSampradaya", uiLang)} note={L.t("sampradayaNote", uiLang)}>
              <SetChoice value={prefs.sampradaya || "smarta"} options={sampradayaOptions} dropdown
                onChange={(k) => PR.set({ sampradaya: k })} />
            </SetField>
            <SetField label={L.t("setReckoning", uiLang)} note={L.t("reckoningNote", uiLang)}>
              <SetChoice value={reckoning} options={reckoningOptions} dropdown
                onChange={(k) => PR.set({ reckoning: k })} />
            </SetField>
            <SetField label={L.t("setAyanamsa", uiLang)}
              note={L.t(reckoning === "vakya" ? "ayanamsaVakya" : "ayanamsaNote", uiLang)}>
              <SetChoice value={prefs.ayanamsa || "lahiri"} options={ayanOptions} dropdown
                disabled={reckoning === "vakya"}
                onChange={(k) => PR.set({ ayanamsa: k })} />
            </SetField>
          </SetPanel>
        </SetChapter>

        <SetChapter icon="phone" title={L.t("setChDevice", uiLang)}>
          <SetPanel>
            <SetField label={L.t("dlAll", uiLang)} note={L.t("dlNote", uiLang)}>
              <span className="set-field-val">{L.t("dlZero", uiLang)}</span>
            </SetField>
            <SetBlock note={L.t("carryNote", uiLang)}>
              <div className="set-block-cap">{L.t("carryTitle", uiLang)}</div>
            </SetBlock>
            <CarrySection lang={uiLang} />
            <SetBlock note={L.t("privacyNote", uiLang)}>
              <div className="set-block-cap">{L.t("privacyLabel", uiLang)}</div>
              <ResetPanel lang={lang} />
            </SetBlock>
          </SetPanel>
        </SetChapter>

        <SetChapter icon="spark" title={L.t("setChHelp", uiLang)}>
          <SetPanel>
            <SetRow label={L.t("fbSettings", uiLang)} sub={L.t("fbLede", uiLang)} onClick={() => setFbOpen(true)}>
              <Icon name="chev" size={18} />
            </SetRow>
            <SetBlock>
              <div className="set-block-cap">{L.t("aboutLabel", uiLang)}</div>
              <p className="set-about">{L.t("aboutTexts", uiLang)}</p>
              <BuildStamp lang={lang} noReset />
            </SetBlock>
          </SetPanel>
        </SetChapter>

        <div style={{ height: 40 }} />
       </div>
      </div>
    </div>
  );
}

/* the switch that says the reminder is "on" is only a promise — the OS
   permission is what actually rings it. Shown only once it matters: after
   the reciter has asked for a reminder, or if the OS has refused one. */
function NotifPermRow({ lang: uiLang }) {
  const L = STUTI_L, N = STUTI_NUDGE;
  const [perm, setPerm] = useStateS(() => (N ? N.permission() : "unsupported"));
  if (!N || perm === "unsupported" || perm === "granted") return null;
  const denied = perm === "denied";
  return (
    <SetRow label={L.t(denied ? "notifRowBlocked" : "notifRowAsk", uiLang)}
      sub={L.t(denied ? "notifRowBlockedSub" : "notifRowAskSub", uiLang)}
      onClick={denied ? undefined : (() => N.ask().then(setPerm))}>
      {!denied && <Icon name="chev" size={18} />}
    </SetRow>
  );
}

export { SettingsView, SetSection, SetRow, SetChoice, SetChapter, SetPanel, SetField, SetBlock, CarrySection, NotifPermRow, FlyleafBlock };

import { Icon, Seal } from "./stuti-icons";
import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { STUTI_KEEP } from "./stuti-keep-core";
import { Thread } from "./stuti-ledger";
import { STUTI_MASA } from "./stuti-masa-data";
import { STUTI_NUDGE } from "./stuti-nudge";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_PREFS } from "./stuti-prefs";

/* ============================================================
   STUTI — the bell beside a nomu or a vratam
   KeepBell (one tap in the library list) · KeepMonthSheet (a nomu
   with no date asks which month) · KeepCard (the Sādhana section
   that lists what is being kept, with its tick, its lead and its
   udyāpana) · a small toast, the app's first.
   ============================================================ */
const { useState: useStateK, useEffect: useEffectK } = React;

const kpPick = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.tel || o.roman) : o.roman);
const kpMasaName = (m, lang) => kpPick(m.name, lang);
function kpDate(d, lang) {
  return d.toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });
}
function useKeep() { const [, f] = useStateK(0); useEffectK(() => STUTI_KEEP.subscribe(() => f((x) => x + 1)), []); return STUTI_KEEP; }

/* ---------------- toast ---------------- */
let kpToastTimer = null;
function stutiToast(text) {
  let el = document.getElementById("stuti-toast");
  if (!el) { el = document.createElement("div"); el.id = "stuti-toast"; el.className = "stuti-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = text; el.classList.add("show");
  clearTimeout(kpToastTimer); kpToastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* the daily digest is what carries these bells; a first bell on a reciter
   who never set one turns it on, and the permission is asked at the moment
   of commitment, as the vows do */
function kpArmReminders() {
  try { const r = STUTI_PREFS.get().remind || {}; if (!r.on) STUTI_PREFS.setRemind({ on: true, time: r.time || "06:00" }); } catch (e) {}
  try { const N = STUTI_NUDGE; if (N && N.permission() === "default") N.ask(); } catch (e) {}
}

/* ---------------- the bell in a list row ---------------- */
function KeepBell({ kind, id, lang, size = 17 }) {
  const K = useKeep(), L = STUTI_L;
  const [ask, setAsk] = useStateK(false);
  const rec = K.find(kind, id);
  const on = !!rec;
  const toggle = (e) => {
    e.stopPropagation();
    if (on) { K.remove(rec.id); stutiToast(L.t("keepRemoved", lang)); return; }
    if (K.modeFor(kind, id) === "month") { setAsk(true); return; }
    K.add(kind, id); kpArmReminders(); stutiToast(L.t("keepAdded", lang));
  };
  return (
    <React.Fragment>
      <button type="button" className={"keep-bell" + (on ? " on" : "")} aria-pressed={on} aria-label={L.t("keepBell", lang)} onClick={toggle}>
        <Icon name="bell" size={size} />
      </button>
      {ask && <OverlayPortal><KeepMonthSheet lang={lang} onClose={() => setAsk(false)}
        onPick={(idx) => { K.add(kind, id, { masa: idx }); kpArmReminders(); setAsk(false); stutiToast(L.t("keepAdded", lang)); }} /></OverlayPortal>}
    </React.Fragment>
  );
}

/* ---------------- which month ---------------- */
function KeepMonthSheet({ lang, onClose, onPick, current }) {
  const L = STUTI_L, MA = STUTI_MASA;
  const font = L.font(lang);
  const months = MA.orderedList();
  return (
    <div className="nm-sheet keep-sheet">
      <div className="nm-head">
        <button className="icon-btn" onClick={onClose} aria-label={L.a("aClose")}><Icon name="back" /></button>
        <div className="nm-title">
          <div className="nm-title-name display" style={{ fontFamily: font }}>{L.t("keepPickMonth", lang)}</div>
          <div className="nm-title-sub">{L.t("keepPickMonthSub", lang)}</div>
        </div>
      </div>
      <div className="nm-list scroll">
        <div className="keep-months">
          {months.map((m, i) => {
            const rng = MA.rangeOf ? MA.rangeOf(m.idx) : null;
            return (
              <button key={m.id} className={"keep-month" + (current === m.idx ? " on" : "")} onClick={() => onPick(m.idx)}>
                <span className="keep-month-name display" style={{ fontFamily: font }}>{kpMasaName(m, lang)}</span>
                <span className="keep-month-sub">{i === 0 ? L.t("keepThisMonth", lang) : rng ? rng.start.toLocaleDateString("en", { day: "numeric", month: "short" }) + " – " + rng.end.toLocaleDateString("en", { day: "numeric", month: "short" }) : ""}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- the Sādhana section ---------------- */
function KeepCard({ go, lang = "deva" }) {
  const K = useKeep(), L = STUTI_L, MA = STUTI_MASA;
  const [armed, setArmed] = useStateK(null);
  const [pickFor, setPickFor] = useStateK(null);
  const font = L.font(lang);
  const items = K.list();
  const eng = K.engines();
  const open = (k) => go("browse", { libSub: { kind: k.kind, key: k.ref, returnTo: "daily" } });
  const masaOf = (idx) => MA.list.find((m) => m.idx === idx);
  return (
    <div className="vows keep">
      <div className="vows-head">
        <div>
          <div className="eyebrow">{L.t("keepEyebrow", lang)}</div>
          <div className="vows-title display" style={{ fontFamily: font }}>{L.t("keepTitle", lang)}</div>
        </div>
      </div>
      {items.length === 0 ? <p className="vows-empty">{L.t("keepEmpty", lang)}</p> : (
        <div className="vows-list">
          {items.map((k) => {
            const s = K.subject(k); if (!s) return null;
            const d = STUTI.deityById[s.deity];
            const due = K.dueOn(k, new Date(), eng);
            const udy = k.kept && k.kind === "nomu" && K.hasUdyapana(k) && !k.udyapanaDone;
            let sub = "", status = "";
            if (k.mode === "daily") {
              sub = L.t("keepDailySub", lang).replace("{n}", k.ticks.length).replace("{t}", K.YEAR);
            } else if (k.mode === "month") {
              const m = k.masa != null && masaOf(k.masa);
              sub = m ? L.t("keepMonthSub", lang).replace("{m}", kpMasaName(m, lang)) : L.t("keepPickMonth", lang);
              if (due && !k.kept) status = L.t("keepThisMonth", lang);
            } else {
              let nd = null; try { nd = eng.vrata.nextDate(s, new Date()); } catch (e) {}
              sub = (nd ? kpDate(nd, lang) + " · " : "") + L.t("keepVrataSub", lang).replace("{n}", k.lead);
              if (due) status = due.away === 0 ? L.t("vrataToday", lang) : L.t("keepIn", lang).replace("{n}", due.away);
            }
            if (k.kept && !udy) status = L.t("keepKept", lang);
            if (udy) status = L.t("keepUdyapana", lang);
            const pct = k.mode === "daily" ? Math.min(100, Math.round(k.ticks.length / K.YEAR * 100)) : null;
            return (
              <div key={k.id} className={"vow keep-row" + (due && !due.done ? " due" : "")} style={{ "--deity-hue": d ? d.hue : 36 }}>
                <div className="vow-top">
                  <div className="vow-body">
                    <div className="vow-occ">{k.kind === "vrata" ? L.t("lensVrata", lang) : L.t("lensNomu", lang)}{status ? " · " + status : ""}</div>
                    <button className="vow-hymn display" style={{ fontFamily: font }} onClick={() => open(k)}>{kpPick(s.name, lang)}</button>
                    <div className="vow-next">{sub}</div>
                  </div>
                  <div className="vow-tools">
                    <button className={"vow-x" + (armed === k.id ? " arm" : "")} aria-label={L.t("removePlan", lang)}
                      onClick={() => { if (armed === k.id) { K.remove(k.id); setArmed(null); return; } setArmed(k.id); setTimeout(() => setArmed((a) => (a === k.id ? null : a)), 4000); }}>
                      {armed === k.id ? L.t("removePlan", lang) : "×"}</button>
                  </div>
                </div>
                {pct !== null && !k.kept && <div className="keep-bar"><span style={{ width: pct + "%" }} /></div>}
                <div className="vow-actions keep-actions">
                  {k.mode === "daily" && !k.kept && (
                    <button className={"vow-keep" + (due && due.done ? " kept" : "")} onClick={() => K.tick(k.id)} disabled={due && due.done}>
                      <Icon name="check" size={16} /> {due && due.done ? L.t("keepTicked", lang) : L.t("keepTick", lang)}
                    </button>
                  )}
                  {k.mode === "month" && !k.kept && (
                    <React.Fragment>
                      <button className="vow-do" onClick={() => setPickFor(k.id)}><Icon name="moon" size={15} /> {k.masa != null ? kpMasaName(masaOf(k.masa), lang) : L.t("keepPickMonth", lang)}</button>
                      <button className="vow-keep" onClick={() => K.markKept(k.id)}><Icon name="check" size={16} /> {L.t("keepMarkKept", lang)}</button>
                    </React.Fragment>
                  )}
                  {k.mode === "vrata" && (
                    <React.Fragment>
                      <span className="keep-lead-label">{L.t("keepLead", lang)}</span>
                      {[1, 3, 7].map((n) => <button key={n} className={"keep-lead" + (k.lead === n ? " on" : "")} onClick={() => K.setLead(k.id, n)}>{L.t("keepLeadDays", lang).replace("{n}", n)}</button>)}
                      {due && due.away === 0 && !due.done && <button className="vow-keep" onClick={() => K.keepVrataDay(k.id, due.date)}><Icon name="check" size={16} /> {L.t("keepMarkKept", lang)}</button>}
                    </React.Fragment>
                  )}
                  {udy && <button className="vow-keep" onClick={() => K.markUdyapana(k.id)}><Icon name="check" size={16} /> {L.t("keepUdyapanaDone", lang)}</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {pickFor && <OverlayPortal><KeepMonthSheet lang={lang} current={(K.byId(pickFor) || {}).masa} onClose={() => setPickFor(null)}
        onPick={(idx) => { K.setMasa(pickFor, idx); setPickFor(null); }} /></OverlayPortal>}
    </div>
  );
}

/* ---------------- the Nomu lens on Nitya ----------------
   A compact ledger: the name, then only the tracker in the shape its
   cadence asks. A daily nomu is a month grid of ticks that can be paged
   back, with the year's tally beneath; a māsa nomu is its month and a
   kept mark; a kept nomu shows its udyāpana. The nomu's own text
   stays behind the name — this page is the ledger, not the guide. */
function ntShortDate(key, lang) {
  if (!key) return "";
  return new Date(key + "T12:00:00").toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function NomuTrackerRow({ k, lang, go, K, eng }) {
  const L = STUTI_L, MA = STUTI_MASA, S = STUTI;
  const [armed, setArmed] = useStateK(null);
  const [pick, setPick] = useStateK(false);
  const now = new Date();
  const font = L.font(lang);
  const n = K.subject(k); if (!n) return null;
  const d = S.deityById[n.deity];
  const due = K.dueOn(k, now, eng);
  const udy = k.kept && K.hasUdyapana(k) && !k.udyapanaDone;
  const masa = k.masa != null && MA.list.find((m) => m.idx === k.masa);
  const T = (o) => kpPick(o, lang);
  const open = () => go("browse", { libSub: { kind: "nomu", key: k.ref, returnTo: "daily" } });
  const arm = (what, fn) => { if (armed === what) { fn(); setArmed(null); return; } setArmed(what); setTimeout(() => setArmed((a) => (a === what ? null : a)), 4000); };
  let status = "";
  if (udy) status = L.t("keepUdyapana", lang);
  else if (k.kept) status = L.t("ntKeptOn", lang).replace("{d}", ntShortDate(k.keptOn, lang));
  else if (k.mode === "month") status = masa ? kpMasaName(masa, lang) : L.t("keepPickMonth", lang);
  else status = L.t("ntSince", lang).replace("{d}", ntShortDate(k.start, lang));
  const pct = Math.min(100, Math.round(k.ticks.length / K.YEAR * 100));
  return (
    <article className={"vow keep-row nt-row" + (due && !due.done ? " due" : "")} style={{ "--deity-hue": d ? d.hue : 36 }}>
      <div className="vow-top">
        <Seal d={d} size={36} style={{ fontSize: 13 }} />
        <div className="vow-body">
          <button className="vow-hymn display nt-name" style={{ fontFamily: font }} onClick={open}>{T(n.name)}</button>
          <div className="vow-next">{status}</div>
        </div>
        <div className="vow-tools">
          <button className={"vow-x nt-reset" + (armed === "reset" ? " arm" : "")} aria-label={L.t("startOver", lang)} title={L.t("startOver", lang)}
            onClick={() => arm("reset", () => K.reset(k.id))}>{armed === "reset" ? L.t("startOver", lang) : <Icon name="repeat" size={14} />}</button>
          <button className={"vow-x" + (armed === "rm" ? " arm" : "")} aria-label={L.t("removePlan", lang)}
            onClick={() => arm("rm", () => K.remove(k.id))}>{armed === "rm" ? L.t("removePlan", lang) : "×"}</button>
        </div>
      </div>

      {k.mode === "daily" && !k.kept && (
        <div className="nt-track">
          <Thread read={(dd) => ({ v: k.ticks.indexOf(K.dkey(dd)) >= 0 ? 1 : 0 })} onDay={(x) => K.tick(k.id, x.key)} />
          <div className="nt-year">
            <div className="keep-bar"><span style={{ width: pct + "%" }} /></div>
            <span className="nt-track-n">{k.ticks.length}<i>/{K.YEAR}</i></span>
          </div>
        </div>
      )}

      <div className="vow-actions keep-actions">
        {k.mode === "daily" && !k.kept && (
          <button className={"vow-keep" + (due && due.done ? " kept" : "")} onClick={() => K.tick(k.id)} disabled={due && due.done}>
            <Icon name="check" size={16} /> {due && due.done ? L.t("keepTicked", lang) : L.t("keepTick", lang)}
          </button>
        )}
        {k.mode === "month" && !k.kept && (
          <React.Fragment>
            <button className="vow-keep" onClick={() => setPick(true)}><Icon name="moon" size={15} /> {masa ? kpMasaName(masa, lang) : L.t("keepPickMonth", lang)}</button>
            <button className="vow-do" onClick={() => K.markKept(k.id)}><Icon name="check" size={16} /> {L.t("keepMarkKept", lang)}</button>
          </React.Fragment>
        )}
        {udy && <button className="vow-do" onClick={() => K.markUdyapana(k.id)}><Icon name="check" size={16} /> {L.t("keepUdyapanaDone", lang)}</button>}
      </div>
      {udy && T(n.udyapana) && <p className="nt-udy">{T(n.udyapana)}</p>}
      {pick && <OverlayPortal><KeepMonthSheet lang={lang} current={k.masa} onClose={() => setPick(false)}
        onPick={(idx) => { K.setMasa(k.id, idx); setPick(false); }} /></OverlayPortal>}
    </article>
  );
}

function NomuTracker({ go, lang = "telugu" }) {
  const K = useKeep(), L = STUTI_L;
  const font = L.font(lang);
  const items = K.list().filter((k) => k.kind === "nomu");
  const eng = K.engines();
  const toLib = () => go("browse", { reset: true, libLens: "nomu" });
  return (
    <div className="vows keep nt">
      <div className="vows-head">
        <div>
          <div className="eyebrow">{L.t("ntEyebrow", lang)}</div>
          <div className="vows-title display" style={{ fontFamily: font }}>{L.t("ntTitle", lang)}</div>
        </div>
        {items.length > 0 && <button className="vows-add" onClick={toLib}>{L.t("ntGoLib", lang)}</button>}
      </div>
      {items.length === 0 ? (
        <React.Fragment>
          <p className="vows-empty">{L.t("ntEmpty", lang)}</p>
          <button className="vow-do nt-find" onClick={toLib}><Icon name="vayanam" size={16} /> {L.t("ntBrowse", lang)}</button>
        </React.Fragment>
      ) : (
        <div className="vows-list">
          {items.map((k) => <NomuTrackerRow key={k.id} k={k} lang={lang} go={go} K={K} eng={eng} />)}
        </div>
      )}
    </div>
  );
}

export { KeepBell, KeepCard, KeepMonthSheet, NomuTracker, stutiToast };

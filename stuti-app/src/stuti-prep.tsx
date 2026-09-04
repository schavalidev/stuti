import React from "react";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";
import { STUTI_LIMITS } from "./stuti-limits-core";
import { LimitLock, LimitSheet, useLimitLeft } from "./stuti-limits";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_PREFS } from "./stuti-prefs";
import { STUTI_PREP } from "./stuti-prep-core";
import { usePrefs } from "./stuti-remind";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — the getting-ready surfaces
   A home card while a vrata's window is open, the checklist
   sheet it opens, and the section of the reminders sheet that
   controls which vratas are watched.
   ============================================================ */
const { useState: usePrS, useEffect: usePrE } = React;

const prName = (v, lang) => lang === "telugu" ? v.name.tel : lang === "deva" ? v.name.deva : v.name.roman;
const prLocale = (lang) => lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN";
function prAway(away, lang) {
  const L = STUTI_L;
  if (away === 0) return L.t("vrataToday", lang);
  if (away === 1) return L.t("vrataTomorrow", lang);
  return L.t("vrataInDays", lang).replace("{n}", away);
}

/* ---------------- the checklist sheet ---------------- */
function PrepSheet({ occ, lang, onClose }) {
  const L = STUTI_L, P = STUTI_PREP;
  const v = occ.v;
  const its = P.items(v);
  const [done, setDone] = usePrS(() => P.done(v.id, occ.date));
  const [copied, setCopied] = usePrS(false);
  const [limAsk, setLimAsk] = usePrS(false);
  const [note, setNote] = usePrS("");
  const shareLeft = useLimitLeft("share");
  const packLeft = useLimitLeft("pack");
  const gated = (gate, fn) => () => {
    if (STUTI_LIMITS.take(gate)) { fn(); setNote(L.t("limFreeLeft", lang)); setTimeout(() => setNote(""), 3600); return; }
    setLimAsk(true);
  };
  const gets = its.filter((i) => i.kind === "get"), dos = its.filter((i) => i.kind === "do");
  const pct = its.length ? Math.round(done.length / its.length * 100) : 0;
  const dateStr = occ.date.toLocaleDateString(prLocale(lang), { weekday: "long", day: "numeric", month: "long" });
  const copy = () => {
    const ok = () => { setCopied(true); setTimeout(() => setCopied(false), 2600); };
    const t = P.shareText(v, occ.date, lang);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, ok); else ok();
  };
  const share = () => {
    const t = P.shareText(v, occ.date, lang);
    if (navigator.share) navigator.share({ title: prName(v, lang), text: t }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => setCopied(true), () => {});
  };
  const printPack = () => printPrepPack(v, occ.date, lang, its, done);
  const row = (it) => {
    const on = done.indexOf(it.id) !== -1;
    return (
      <li key={it.id} className={"sam-item" + (on ? " on" : "")}>
        <button onClick={() => setDone(P.toggleItem(v.id, occ.date, it.id))} aria-pressed={on}>
          <span className="sam-box">{on && <Icon name="check" size={15} />}</span>
          <span className="sam-text" style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : undefined}>{P.txt(it.text, lang)}</span>
        </button>
      </li>
    );
  };
  return (
    <OverlayPortal>
    <div className="pd-wrap">
      <div className="pd-scrim" onClick={onClose} />
      <div className="pd-sheet" role="dialog" aria-label={L.t("prepCap", lang)}>
        <div className="pd-grip" />
        <button className="pd-x" onClick={onClose} aria-label={STUTI_L.t("close", lang)}><Icon name="close" size={18} /></button>
        <div className="rm-head">
          <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{L.t("prepCap", lang)}</div>
          <div className="rm-head-title display" style={{ fontFamily: L.font(lang) }}>{prName(v, lang)}</div>
          <div className="rm-head-sub">{dateStr} · {prAway(occ.away, lang)}</div>
        </div>
        <div className="pd-body scroll">
          {its.length ? (
            <React.Fragment>
              <div className="prep-bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><span style={{ width: pct + "%" }} /></div>
              <div className="prep-sheet-count">{done.length < its.length ? L.t("samagriLeft", lang).replace("{n}", its.length - done.length) : L.t("samagriAll", lang)}</div>
              {gets.length > 0 && (
                <div className="sam-block prep-block">
                  <div className="sam-head"><span className="eyebrow">{L.t("samagri", lang)}</span></div>
                  <ul className="sam-list">{gets.map(row)}</ul>
                </div>
              )}
              {dos.length > 0 && (
                <div className="sam-block prep-block">
                  <div className="sam-head"><span className="eyebrow">{L.t("prepSteps", lang)}</span></div>
                  <ul className="sam-list">{dos.map(row)}</ul>
                </div>
              )}
              <div className="prep-copy-row prep-opts">
                <button className="prep-copy" onClick={copy}><Icon name="copy" size={16} />{L.t(copied ? "prepCopied" : "prepCopy", lang)}</button>
                <button className={"prep-copy" + (shareLeft <= 0 ? " is-locked" : "")} onClick={gated("share", share)}
                  title={shareLeft > 0 ? L.t("prepShare", lang) + " · " + L.t("limFreeOne", lang) : L.t("limCap", lang)}>
                  <Icon name="share" size={16} />{L.t("prepShare", lang)}{shareLeft <= 0 && <LimitLock size={12} />}
                </button>
                <button className={"prep-copy" + (packLeft <= 0 ? " is-locked" : "")} onClick={gated("pack", printPack)}
                  title={packLeft > 0 ? L.t("prepPrint", lang) + " · " + L.t("limFreeOne", lang) : L.t("limCap", lang)}>
                  <Icon name="print" size={16} />{L.t("prepPrint", lang)}{packLeft <= 0 && <LimitLock size={12} />}
                </button>
              </div>
            </React.Fragment>
          ) : (
            <p className="prep-none">{L.t("prepNoList", lang)}</p>
          )}
        </div>
      </div>
    </div>
    {note && <div className="free-toast" role="status">{note}</div>}
    {limAsk && <LimitSheet lang={lang} onClose={() => setLimAsk(false)} />}
    </OverlayPortal>
  );
}

/* The pack is the whole preparation on one sheet — the list, what is still to
   get, and the day it is for. Printed, it goes on the kitchen wall, which is
   where a vrata is actually run from. */
function printPrepPack(v, date, lang, items, done) {
  const L = STUTI_L, P = STUTI_PREP;
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const font = lang === "telugu" ? "'Noto Sans Telugu',sans-serif" : lang === "deva" ? "'Noto Sans Devanagari',sans-serif" : "'Marcellus',Georgia,serif";
  const block = (kind, cap) => {
    const list = items.filter(i => i.kind === kind);
    if (!list.length) return "";
    return '<h2>' + esc(cap) + '</h2><ul>' + list.map(i =>
      '<li class="' + (done.indexOf(i.id) !== -1 ? "on" : "") + '"><span class="bx"></span>' + esc(P.txt(i.text, lang)) + '</li>').join("") + '</ul>';
  };
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + esc(prName(v, lang)) + ' — Stuti</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Mukta:wght@400;600&family=Noto+Sans+Devanagari&family=Noto+Sans+Telugu&display=swap" rel="stylesheet">'
    + "<style>@page{size:letter;margin:18mm 16mm}*{box-sizing:border-box;font-style:normal}"
    + "body{margin:0;background:#fff;color:#2B2017;font-family:'Mukta',sans-serif}"
    + "header{text-align:center;border-bottom:1px solid rgba(43,32,23,.18);padding-bottom:14px;margin-bottom:24px}"
    + ".shri{color:#B07A2B;font-family:'Noto Sans Devanagari',sans-serif;font-size:13pt}"
    + "h1{font-family:" + font + ";font-weight:400;font-size:22pt;margin:8px 0 4px}"
    + ".when{font-size:10.5pt;color:#6E5E4E;letter-spacing:.03em}"
    + "h2{font-family:" + font + ";font-weight:400;font-size:14pt;color:#8A5A18;margin:22px 0 10px}"
    + "ul{list-style:none;margin:0;padding:0}"
    + "li{display:flex;align-items:flex-start;gap:10px;font-size:12pt;line-height:1.7;padding:4px 0;page-break-inside:avoid}"
    + "li.on{color:#9A8A78;text-decoration:line-through}"
    + ".bx{flex:none;width:13px;height:13px;margin-top:5px;border:1.4px solid #B07A2B;border-radius:3px}"
    + "li.on .bx{background:#B07A2B}"
    + "footer{margin-top:30px;border-top:1px solid rgba(43,32,23,.14);padding-top:10px;text-align:center;font-size:9pt;color:#9A8A78}"
    + "footer b{font-family:'Marcellus',Georgia,serif;font-weight:400;color:#B07A2B;font-size:11pt}"
    + "</style></head><body>"
    + '<header><div class="shri">॥ श्री ॥</div><h1>' + esc(prName(v, lang)) + "</h1>"
    + '<div class="when">' + esc(date.toLocaleDateString(prLocale(lang), { weekday: "long", day: "numeric", month: "long", year: "numeric" })) + "</div></header>"
    + block("get", L.t("samagri", lang)) + block("do", L.t("prepSteps", lang))
    + "<footer><b>Stuti</b> · " + esc(L.t("prepCap", "roman")) + "</footer></body></html>");
  w.document.close();
  setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 700);
}

/* ---------------- home card, shown while a window is open ---------------- */
function HomePrepCard({ lang }) {
  const L = STUTI_L, P = STUTI_PREP;
  const [open, setOpen] = usePrS(null);
  const [, force] = usePrS(0);
  usePrE(() => STUTI_PREFS.subscribe(() => force((n) => n + 1)), []);
  let list = [];
  try { list = P.windowOpen(); } catch (e) {}
  if (!list.length) return null;
  const occ = list[0], v = occ.v;
  const its = P.items(v), done = P.done(v.id, occ.date);
  const left = its.length - done.length;
  return (
    <React.Fragment>
      <section className="prep-card">
        <button className="prep-card-main" onClick={() => setOpen(occ)}>
          <span className="prep-mark"><Icon name="calendar" size={19} /></span>
          <span className="prep-body">
            <span className="eyebrow" style={{ color: "var(--accent-ink)" }}>{L.t("prepCap", lang)}</span>
            <span className="prep-name" style={{ fontFamily: L.font(lang) }}>{prName(v, lang)}</span>
            <span className="prep-sub">
              {occ.date.toLocaleDateString(prLocale(lang), { weekday: "long" })} · {prAway(occ.away, lang)}
              {its.length > 0 && " · " + (left > 0 ? L.t("prepThings", lang).replace("{n}", left) : L.t("samagriAll", lang))}
            </span>
          </span>
          {its.length > 0 && <span className="prep-count">{done.length}/{its.length}</span>}
        </button>
        {list.length > 1 && <div className="prep-more">{L.t("bandMissMore", lang).replace("{n}", list.length - 1)}</div>}
      </section>
      {open && <PrepSheet occ={open} lang={lang} onClose={() => { setOpen(null); force((n) => n + 1); }} />}
    </React.Fragment>
  );
}

/* ---------------- the reminders-sheet section ---------------- */
function PrepCues({ lang }) {
  const L = STUTI_L, P = STUTI_PREP, V = STUTI_VRATA;
  usePrefs();
  const on = P.masterOn();
  const next = on ? P.nextEnrolled() : null;
  const optional = V.vratas.filter((v) => P.AUTO.indexOf(v.id) === -1);
  return (
    <div className="rm-sy-sect">
      <div className="pd-cap">{L.t("prepRemindTitle", lang)}</div>
      <button className={"rm-toggle" + (on ? " on" : "")} onClick={() => P.setMaster(!on)} role="switch" aria-checked={on}>
        <span>{L.t("prepRemindSub", lang)}</span>
        <span className="rm-switch"><i /></span>
      </button>
      {next && (() => {
        const its = P.items(next.v);
        return (
          <div className="rm-notif">
            <span className="rm-notif-ico"><Icon name="calendar" size={20} /></span>
            <span className="rm-notif-body">
              <span className="rm-notif-top">
                <span className="rm-notif-app">Stuti</span>
                <span className="rm-notif-time">{prAway(Math.max(0, next.away - P.LEAD), lang)}</span>
              </span>
              <span className="rm-notif-line" style={{ fontFamily: L.font(lang) }}>
                {prName(next.v, lang)}{its.length ? " · " + L.t("prepThings", lang).replace("{n}", its.length) : ""}
              </span>
              <span className="rm-notif-sub">{L.t("prepCap", lang)} · {next.date.toLocaleDateString(prLocale(lang), { weekday: "long", day: "numeric", month: "long" })}</span>
            </span>
          </div>
        );
      })()}
      {on && optional.length > 0 && (
        <React.Fragment>
          <div className="pd-cap">{L.t("prepAlso", lang)}</div>
          <div className="rm-times prep-opts">
            {optional.map((v) => (
              <button key={v.id} className={"rm-time" + (P.enrolled(v.id) ? " on" : "")} onClick={() => P.toggleVrata(v.id)} style={{ fontFamily: L.font(lang) }}>{prName(v, lang)}</button>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export { PrepSheet, HomePrepCard, PrepCues, printPrepPack };

import React from "react";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_TARPANA } from "./stuti-tarpana";

/* ============================================================
   STUTI — which tarpaṇam is being performed
   The vidhi prints six saṅkalpas, one under the next, because paper
   cannot ask. The reader asks once, on opening, and then shows the
   one saṅkalpa the occasion calls for; the other five are put away.
   The day's own answer is offered first, from the pañcāṅga.
   ============================================================ */
const { useState: useToS, useEffect: useToE } = React;

const TO_LIST = [
  { id: "nitya", n: "8",
    label: { roman: "Nitya tarpaṇam", deva: "नित्य तर्पणम्", tel: "నిత్య తర్పణం" },
    when:  { roman: "The daily offering, on a day that is not a parvam.",
             deva: "पर्व न होने पर प्रतिदिन किया जाने वाला तर्पण।",
             tel: "పర్వదినం కాని రోజున ప్రతిరోజూ చేసే తర్పణం." } },
  { id: "darsha", n: "9",
    label: { roman: "Darśa tarpaṇam", deva: "दर्श तर्पणम्", tel: "దర్శ తర్పణం" },
    when:  { roman: "On the amāvāsyā.", deva: "अमावस्या के दिन।", tel: "అమావాస్య నాడు." } },
  { id: "grahana", n: "10",
    label: { roman: "Grahaṇa tarpaṇam", deva: "ग्रहण तर्पणम्", tel: "గ్రహణ తర్పణం" },
    when:  { roman: "At a solar or lunar eclipse.", deva: "सूर्य या चन्द्र ग्रहण के समय।", tel: "సూర్య లేదా చంద్ర గ్రహణ సమయములో." } },
  { id: "sankramana", n: "11",
    label: { roman: "Saṅkramaṇa tarpaṇam", deva: "सङ्क्रमण तर्पणम्", tel: "సంక్రమణ తర్పణం" },
    when:  { roman: "At an ingress of the sun into a new sign.", deva: "सूर्य के नई राशि में प्रवेश पर।", tel: "సూర్యుడు కొత్త రాశిలో ప్రవేశించినప్పుడు." } },
  { id: "mahalaya", n: "12",
    label: { roman: "Mahālaya tarpaṇam", deva: "महालय तर्पणम्", tel: "మహాలయ తర్పణం" },
    when:  { roman: "In the mahālaya pakṣa.", deva: "महालय पक्ष में।", tel: "మహాలయ పక్షములో." } },
  { id: "pushkara", n: "13",
    label: { roman: "Puṣkara tarpaṇam", deva: "पुष्कर तर्पणम्", tel: "పుష్కర తర్పణం" },
    when:  { roman: "During a river's puṣkaram.", deva: "किसी नदी के पुष्कर काल में।", tel: "ఒక నది పుష్కర కాలములో." } },
];

const TO_T = {
  ask:    { roman: "Which tarpaṇam is this?", deva: "यह कौन-सा तर्पण है?", tel: "ఇది ఏ తర్పణం?" },
  lede:   { roman: "The saṅkalpa for the occasion you choose is the one the scroll will show.",
            deva: "आप जो अवसर चुनेंगे, उसी का संकल्प पाठ में दिखेगा।",
            tel: "మీరు ఎంచుకున్న సందర్భపు సంకల్పమే పాఠంలో కనిపిస్తుంది." },
  today:  { roman: "Today", deva: "आज", tel: "ఈ రోజుకి" },
  change: { roman: "Change", deva: "बदलें", tel: "మార్చు" },
  all:    { roman: "Show all six", deva: "छहों दिखाएँ", tel: "ఆరింటినీ చూపు" },
  allOn:  { roman: "All six saṅkalpas", deva: "छहों संकल्प", tel: "ఆరు సంకల్పాలు" },
};

const toPick = (o, lang) => (o && (lang === "telugu" ? o.tel : lang === "roman" ? o.roman : o.deva)) || "";
const toT = (k, lang) => toPick(TO_T[k], lang);
const toOcc = (id) => TO_LIST.find((o) => o.id === id) || null;

/* the day's own answer, read from the pañcāṅga */
function toGuess(date) {
  try {
    const on = STUTI_TARPANA.occasionsOn(date || new Date()) || [];
    const has = (s) => on.some((x) => String(x.id || "").indexOf(s) === 0 || String(x.id || "").indexOf(s) > -1);
    if (has("grahana")) return "grahana";
    if (has("mahalaya")) return "mahalaya";
    if (has("sankram") || has("sankranti")) return "sankramana";
    if (has("pushkar")) return "pushkara";
    if (has("pitru-tarpanam")) return "darsha";
  } catch (e) {}
  return "nitya";
}

/* the five saṅkalpas this occasion does not use */
function toHidden(hymn, occId) {
  const keep = toOcc(occId);
  if (!hymn || !hymn.verses || !keep) return null;
  const drop = new Set(TO_LIST.filter((o) => o.id !== occId).map((o) => o.n));
  const out = new Set();
  hymn.verses.forEach((v, i) => { if (drop.has(String(v.n))) out.add(i); });
  return out.size ? out : null;
}

const TO_KEY = "stuti-tarpana-occasion";
/* the answer is kept for the day it was given. A tarpaṇam opened next month
   is a different occasion, and a stale choice would silently pick it. */
function toRead() {
  try {
    const raw = JSON.parse(localStorage.getItem(TO_KEY) || "null");
    const d = new Date(); const key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    if (raw && raw.day === key && (raw.id === "all" || toOcc(raw.id))) return raw.id;
  } catch (e) {}
  return null;
}
function toWrite(id) {
  const d = new Date();
  try { localStorage.setItem(TO_KEY, JSON.stringify({ id: id, day: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() })); } catch (e) {}
}

/* the bar over the scroll — what was chosen, and the way back to the question */
function TarpanaOccasionBar({ occId, lang, onOpen }) {
  const o = toOcc(occId);
  return (
    <div className="rd-occ-bar">
      <span className="rd-occ-name" style={{ fontFamily: STUTI_L.font(lang) }}>
        {o ? toPick(o.label, lang) : toT("allOn", lang)}
      </span>
      <button className="rd-occ-change" onClick={onOpen}>{toT("change", lang)}</button>
    </div>
  );
}

function TarpanaOccasionSheet({ occId, lang, onPick, onClose }) {
  const today = toGuess(new Date());
  const font = STUTI_L.font(lang);
  return (
    <OverlayPortal>
      <div className="pd-wrap" onClick={onClose}>
        <div className="pd-sheet" role="dialog" aria-label={toT("ask", lang)} onClick={(e) => e.stopPropagation()}>
          <div className="pd-grip" />
          <button className="pd-x" onClick={onClose} aria-label={STUTI_L.t("close", lang)}><Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="rm-head-title display" style={{ fontFamily: font }}>{toT("ask", lang)}</div>
            <div className="rm-head-sub">{toT("lede", lang)}</div>
          </div>
          <div className="pd-body scroll">
            <div className="tocc-list">
              {TO_LIST.map((o) => (
                <button key={o.id} className={"tocc-row" + (o.id === occId ? " on" : "")} onClick={() => onPick(o.id)}>
                  <span className="tocc-row-name" style={{ fontFamily: font }}>{toPick(o.label, lang)}</span>
                  <span className="tocc-row-when">{toPick(o.when, lang)}</span>
                  {o.id === today && <span className="tocc-row-today">{toT("today", lang)}</span>}
                </button>
              ))}
              <button className={"tocc-row is-all" + (occId === "all" ? " on" : "")} onClick={() => onPick("all")}>
                <span className="tocc-row-name" style={{ fontFamily: font }}>{toT("all", lang)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

export { TarpanaOccasionBar, TarpanaOccasionSheet, toGuess as toTarpanaGuess, toHidden as toTarpanaHidden, toRead as toTarpanaRead, toWrite as toTarpanaWrite };

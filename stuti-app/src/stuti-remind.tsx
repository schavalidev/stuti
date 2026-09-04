import React from "react";
import { STUTI_CUES } from "./stuti-cues";
import { STUTI } from "./stuti-data";
import { todayInfo } from "./stuti-home";
import { STUTI_L } from "./stuti-i18n";
import { Flame, Icon } from "./stuti-icons";
import { STUTI_NUDGE } from "./stuti-nudge";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { useLoc } from "./stuti-panchanga";
import { STUTI_PREFS } from "./stuti-prefs";
import { PrepCues } from "./stuti-prep";
import { STUTI_SANDHYA } from "./stuti-sandhya-core";
import { STUTI_FAVS, STUTI_PROGRESS } from "./stuti-store";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — the daily cue
   A single nudge at an hour the reciter chooses, and a few more on
   the days the pañcāṅga marks. A web prototype cannot post a system
   notification, so the sheet shows exactly what would arrive.
   ============================================================ */
const { useState: useStateN, useEffect: useEffectN } = React;

function usePrefs() {
  const [p, setP] = useStateN(() => STUTI_PREFS.get());
  useEffectN(() => STUTI_PREFS.subscribe(setP), []);
  return p;
}

const TIME_CHIPS = ["05:30", "06:00", "06:30", "07:00", "18:30"];
/* an observance's name in the reading script (the engine holds IAST + Devanāgarī) */
function obsName(o, lang) {
  if (!o) return "";
  if (lang === "telugu") return STUTI_TRANSLIT.convert(o.deva || o.name, "telugu");
  if (lang === "deva") return o.deva || o.name;
  return o.name;
}
function fmtTime(t, lang) {
  const [h, m] = (t || "06:00").split(":").map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0);
  const locale = lang === "telugu" ? "te-IN" : "en-IN";
  return d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}

/* the hymn the nudge would name: what they were last reading, else a
   kept favourite, else what the day itself suggests */
function nudgeHymn() {
  const S = STUTI;
  const last = STUTI_PROGRESS.get();
  if (last && S.hymnById(last.hymnId)) return S.hymnById(last.hymnId);
  const favs = STUTI_FAVS.list();
  for (const id of favs) { const h = S.hymnById(id); if (h && h.verses && h.verses.length) return h; }
  const t = todayInfo && todayInfo();
  return t ? t.hymn : S.hymns[0];
}

/* when the next nudge falls, and whether the pañcāṅga marks that day */
function nextNudge(remind, loc) {
  const [h, m] = (remind.time || "06:00").split(":").map(Number);
  const now = new Date();
  const at = new Date(); at.setHours(h, m, 0, 0);
  const today = at > now;
  if (!today) at.setDate(at.getDate() + 1);
  let mark = null;
  try {
    const pa = AKSHARA_PANCHANGA.forDay(at, loc);
    mark = (pa.observances || [])[0] || null;
  } catch (e) {}
  return { at, today, mark };
}

/* the next few days the pañcāṅga marks — what "tithi-aware" means, concretely */
function upcomingMarks(loc, n) {
  const out = [];
  try {
    const d = new Date();
    for (let i = 0; i < 40 && out.length < (n || 3); i++) {
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      const pa = AKSHARA_PANCHANGA.forDay(day, loc);
      const o = (pa.observances || [])[0];
      if (o) out.push({ day, o });
    }
  } catch (e) {}
  return out;
}

function RemindCard({ lang = "deva", onOpen }) {
  const L = STUTI_L;
  const p = usePrefs();
  const r = p.remind;
  const S = STUTI_SANDHYA;
  const syOn = S ? S.ORDER.filter((id) => (r.sandhya || {})[id]) : [];
  const parts = [];
  if (r.on) parts.push(fmtTime(r.time, lang) + (r.tithi ? " · " + L.t("plusTithiDays", lang) : ""));
  if (syOn.length) parts.push(syOn.map((id) => S.name(S.LABEL[id], lang)).join(" · "));
  return (
    <button className={"rm-card" + (r.on || syOn.length ? " on" : "")} onClick={onOpen}>
      <span className="rm-mark"><Icon name="bell" size={19} /></span>
      <span className="rm-card-body">
        <span className="rm-title">{L.t("remindTitle", lang)}</span>
        <span className="rm-explain">{L.t("remindExplain", lang)}</span>
        <span className="rm-sub" style={syOn.length && !r.on ? { fontFamily: L.font(lang) } : undefined}>
          {parts.length ? parts.join(" · ") : L.t("remindOff", lang)}
        </span>
      </span>
      <Icon name="chev" size={18} />
    </button>
  );
}

function NudgePreview({ lang }) {
  const L = STUTI_L;
  const h = nudgeHymn();
  const p = STUTI_PREFS.get();
  return (
    <div className="rm-notif">
      <span className="rm-notif-ico"><Flame size={20} /></span>
      <span className="rm-notif-body">
        <span className="rm-notif-top">
          <span className="rm-notif-app">Stuti</span>
          <span className="rm-notif-time">{fmtTime(p.remind.time, lang)}</span>
        </span>
        <span className="rm-notif-line" style={{ fontFamily: L.font(lang) }}>
          {h ? L.hymnTitle(h, lang) : L.t("todayHymn", lang)}
        </span>
        <span className="rm-notif-sub">{L.t("nudgeSub", lang)}</span>
      </span>
    </div>
  );
}

/* ---- the three junctures, as switches rather than clock times ----
   A sandhyā cue cannot be stored as an hour: it is pinned to sunrise and
   sunset at the chosen place, so it moves daily and by city. The reciter
   picks the juncture; the app works out the minute, every day. */
const LEADS = [0, 10, 15, 30];
function SandhyaCues({ lang, loc, onNeedPermission }) {
  const L = STUTI_L, S = STUTI_SANDHYA, P = AKSHARA_PANCHANGA;
  const p = usePrefs(), r = p.remind, sy = r.sandhya || {};
  if (!S || !P) return null;
  const list = S.kalas(new Date(), loc);
  const byId = {};
  list.forEach((k) => { byId[k.id] = k; });
  const anyOn = S.ORDER.some((id) => sy[id]);
  const clk = (m) => P.fmtTime((((m % 1440) + 1440) % 1440));
  const toggle = (id) => {
    const on = !sy[id];
    STUTI_PREFS.setSandhya(id, on);
    if (on) onNeedPermission();
  };
  const next = anyOn ? S.upcoming(loc, S.ORDER.filter((id) => sy[id]), r.lead || 0)[0] : null;
  const dayWord = next && next.at.getDate() !== new Date().getDate() ? L.t("tomorrow", lang) : L.t("todayLower", lang);

  return (
    <div className="rm-sy-sect">
      <div className="pd-cap">{L.t("remindSandhya", lang)}</div>
      <p className="rm-sy-note">{L.t("remindSandhyaSub", lang)}</p>
      <div className="rm-sy-list">
        {S.ORDER.map((id) => {
          const k = byId[id], on = !!sy[id];
          return (
            <button key={id} className={"rm-sy" + (on ? " on" : "")} onClick={() => toggle(id)} role="switch" aria-checked={on}>
              <span className="rm-sy-body">
                <span className="rm-sy-name" style={{ fontFamily: L.font(lang) }}>{S.name(S.LABEL[id], lang)}</span>
                <span className="rm-sy-time">{k ? clk(k.best.start) + " – " + clk(k.best.end) : "—"}</span>
              </span>
              <span className="rm-switch"><i /></span>
            </button>
          );
        })}
      </div>
      {anyOn && (
        <React.Fragment>
          <div className="pd-cap">{L.t("howMuchWarning", lang)}</div>
          <div className="rm-times">
            {LEADS.map((n) => (
              <button key={n} className={"rm-time" + ((r.lead || 0) === n ? " on" : "")} onClick={() => STUTI_PREFS.setRemind({ lead: n })}>
                {n === 0 ? L.t("leadAtOpen", lang) : L.t("leadMins", lang).replace("{n}", n)}
              </button>
            ))}
          </div>
          {next && (
            <div className="rm-next">
              {L.t("nextSandhya", lang)}: <span style={{ fontFamily: L.font(lang) }}>{S.name(next.kala.label, lang)}</span>
              {" · " + dayWord + " " + next.at.toLocaleTimeString(lang === "telugu" ? "te-IN" : "en-IN", { hour: "numeric", minute: "2-digit" })}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

/* ---- quiet hours ----
   The one setting that can silence a cue on purpose, so it has to say what it
   silences. The digest waits for the hour to lift; a juncture inside the span
   does not ring at all, because by then its window has closed — and if any
   enabled juncture falls inside, the sheet names it rather than letting the
   bell vanish without explanation. */
function QuietHours({ lang }) {
  const L = STUTI_L, C = STUTI_CUES, S = STUTI_SANDHYA;
  const p = usePrefs(), q = p.remind.quiet || {};
  const set = (patch) => STUTI_PREFS.setQuiet(patch);
  let hush = [];
  try { hush = q.on ? C.silenced(C.ctx()) : []; } catch (e) {}
  return (
    <div className="rm-sy-sect">
      <button className={"rm-toggle" + (q.on ? " on" : "")} onClick={() => set({ on: !q.on })} role="switch" aria-checked={!!q.on}>
        <span>{L.t("quietHours", lang)}</span>
        <span className="rm-switch"><i /></span>
      </button>
      {q.on && (
        <React.Fragment>
          <div className="rm-quiet-row">
            <label className="rm-quiet-field">
              <span>{L.t("quietFrom", lang)}</span>
              <input type="time" value={q.from} onChange={(e) => set({ from: e.target.value || "21:30" })} />
            </label>
            <label className="rm-quiet-field">
              <span>{L.t("quietTo", lang)}</span>
              <input type="time" value={q.to} onChange={(e) => set({ to: e.target.value || "05:30" })} />
            </label>
          </div>
          <p className="rm-sy-note">{L.t("quietNote", lang)}</p>
          {hush.length > 0 && S && (
            <div className="rm-next rm-next-warn">
              {L.t("quietSwallows", lang).replace("{k}", hush.map((id) => S.name(S.LABEL[id], lang)).join(" · "))}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

function RemindSheet({ lang = "deva", onClose }) {
  const L = STUTI_L;
  const p = usePrefs();
  const r = p.remind;
  const N = STUTI_NUDGE;
  const [perm, setPerm] = useStateN(() => (N ? N.permission() : "unsupported"));
  const { loc } = useLoc();
  const next = nextNudge(r, loc);
  const marks = upcomingMarks(loc, 3);
  const set = (patch) => STUTI_PREFS.setRemind(patch);
  const dayLabel = (d) => d.toLocaleDateString(lang === "telugu" ? "te-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });

  /* turning it on is the moment to ask — asking on load is what trains
     people to refuse */
  const toggle = () => {
    const on = !r.on;
    set({ on: on });
    if (on && N && N.permission() === "default") N.ask().then(setPerm);
  };

  return (
    <div className="pd-wrap">
      <div className="pd-scrim" onClick={onClose} />
      <div className="pd-sheet rm-sheet" role="dialog" aria-label={L.t("remindTitle", lang)}>
        <div className="pd-grip" />
        <button className="pd-x" onClick={onClose} aria-label={STUTI_L.t("close", lang)}><Icon name="close" size={18} /></button>
        <div className="rm-head">
          <div className="rm-head-title display" style={{ fontFamily: L.font(lang) }}>{L.t("remindTitle", lang)}</div>
          <div className="rm-head-sub">{L.t("remindSub", lang)}</div>
        </div>
        <div className="pd-body scroll">
          <button className={"rm-toggle" + (r.on ? " on" : "")} onClick={toggle} role="switch" aria-checked={r.on}>
            <span className="rm-toggle-lbl"><span className="rm-toggle-bell"><Icon name="bell" size={16} /></span>{L.t("remindMeDaily", lang)}</span>
            <span className="rm-switch"><i /></span>
          </button>

          <div className={"rm-fields" + (r.on ? "" : " off")}>
            <div className="pd-cap">{L.t("atWhatHour", lang)}</div>
            <div className="rm-times">
              {TIME_CHIPS.map((t) => (
                <button key={t} className={"rm-time" + (r.time === t ? " on" : "")} onClick={() => set({ time: t })}>{fmtTime(t, lang)}</button>
              ))}
              <label className="rm-time rm-time-custom">
                <Icon name="clock" size={15} />
                <input type="time" value={r.time} onChange={(e) => set({ time: e.target.value || "06:00" })} aria-label={L.t("atWhatHour", lang)} />
              </label>
            </div>

            <button className={"rm-toggle rm-toggle-quiet" + (r.tithi ? " on" : "")} onClick={() => set({ tithi: !r.tithi })} role="switch" aria-checked={r.tithi}>
              <span>{L.t("tithiNudges", lang)}</span>
              <span className="rm-switch"><i /></span>
            </button>
            {r.tithi && marks.length > 0 && (
              <div className="rm-marks">
                {marks.map((m, i) => (
                  <div className="rm-mark-row" key={i}>
                    <span className="rm-mark-name" style={{ fontFamily: L.font(lang) }}>{obsName(m.o, lang)}</span>
                    <span className="rm-mark-day">{dayLabel(m.day)}</span>
                  </div>
                ))}
              </div>
            )}

            <button className={"rm-toggle rm-toggle-quiet" + (r.progress !== false ? " on" : "")} onClick={() => set({ progress: r.progress === false })} role="switch" aria-checked={r.progress !== false}>
              <span>{L.t("progressNudges", lang)}</span>
              <span className="rm-switch"><i /></span>
            </button>

            <div className="pd-cap">{L.t("whatArrives", lang)}</div>
            <NudgePreview lang={lang} />
            <div className="rm-next">
              {L.t("remindNext", lang)}: {next.today ? L.t("todayLower", lang) : L.t("tomorrow", lang)} {fmtTime(r.time, lang)}
              {next.mark ? " · " + obsName(next.mark, lang) : ""}
            </div>
          </div>

          <SandhyaCues lang={lang} loc={loc} onNeedPermission={() => { if (N && N.permission() === "default") N.ask().then(setPerm); }} />

          <PrepCues lang={lang} />

          <QuietHours lang={lang} />

          {(r.on || Object.keys(r.sandhya || {}).some((k) => r.sandhya[k])) && perm === "default" && (
            <button className="rm-permit" onClick={() => N.ask().then(setPerm)}>
              <Icon name="bell" size={16} /> {L.t("allowNotifs", lang)}
            </button>
          )}
          <div className={"rm-note" + (perm === "denied" ? " rm-note-warn" : "")}>
            {perm === "denied" ? L.t("notifBlocked", lang)
              : perm === "unsupported" ? L.t("notifNote", lang)
              : L.t("notifWhileOpen", lang)}
          </div>
        </div>
        <button className="pd-close" onClick={onClose}>{L.t("close", lang)}</button>
      </div>
    </div>
  );
}

export { RemindCard, RemindSheet, SandhyaCues, QuietHours, NudgePreview, usePrefs, fmtTime as fmtNudgeTime, nextNudge };

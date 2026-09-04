import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { DeityLink, Icon, Seal, deityStyle } from "./stuti-icons";
import { KeepBell } from "./stuti-keep";
import { STUTI_PREFS } from "./stuti-prefs";
import { masaSys } from "./stuti-reckoning";
import { STUTI_TRANSLIT } from "./stuti-translit";
import { VoiceButton } from "./stuti-voice";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — the Vrata lens
   Not a list of dates: a lens for things you prepare for. Which
   fall this month, how many days away, and for each one the
   samagri to gather (tickable — it is a shopping list before it
   is anything else), the vidhi in order, and the texts.
   ============================================================ */
const { useState: useStateV2, useEffect: useEffectV2 } = React;

const vRule = (v) => (masaSys && masaSys() === "purnimanta" && v.ruleP) ? v.ruleP : v.rule;
/* the month reckoning can change under a screen that is already open */
function useMasaSys() {
  const [s, setS] = useStateV2(() => (masaSys ? masaSys() : "amanta"));
  useEffectV2(() => STUTI_PREFS.subscribe(() => setS(masaSys())), []);
  return s;
}
const vp3 = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.tel || o.roman) : o.roman);
const vLocale = (lang) => (lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined);
const vFont = (lang) => STUTI_L.font(lang);

function vDateStr(d, lang, opts) {
  return d.toLocaleDateString(vLocale(lang), opts || { day: "numeric", month: "short" });
}
function vAwayLabel(away, lang) {
  const L = STUTI_L;
  if (away === 0) return L.t("vrataToday", lang);
  if (away === 1) return L.t("vrataTomorrow", lang);
  return L.t("vrataInDays", lang).replace("{n}", away);
}

/* ---------------- one row in the lens: granthasūcī entry, not a card ---------------- */
function VrataRow({ entry, lang, onOpen, no }) {
  const S = STUTI;
  const v = entry.v, d = S.deityById[v.deity];
  const soon = entry.away <= 10;
  const font = vFont(lang);
  return (
    <div className="gs-en">
      {vIsVratam(v) && <KeepBell kind="vrata" id={v.id} lang={lang} />}
      <button className="gs-main" onClick={() => onOpen(v.id)}>
        <span className="gs-no" style={{ fontFamily: font }}>{String(no)}</span>
        <span className="gs-ti"><span className="gs-d" style={{ fontFamily: font }}>{vp3(v.name, lang)}</span></span>
        <span className="gs-dl" />
        <span className={"gs-vc" + (soon ? " gs-vc-soon" : "")}>{vDateStr(entry.date, lang)} · {vAwayLabel(entry.away, lang)}</span>
      </button>
    </div>
  );
}

/* ---------------- the lens ---------------- */
/* One engine, two lenses. A vratam is something you keep — fast, niyama,
   samagri — and a parva is something the whole house observes; the same
   almanac finds both dates, so they share the row, the search and the guide,
   and differ only in which half of the pool they draw from. */
const vIsVratam = (v) => v.kind === "vratam";

function VrataLens({ go, lang, onOpen, only = "vratam", ph = "vrataSearchPh", none = "vrataNoMatch" }) {
  const L = STUTI_L, V = STUTI_VRATA;
  useMasaSys();
  const [q, setQ] = useStateV2("");
  const now = new Date();
  const all = V.upcoming().filter((x) => (only === "vratam" ? vIsVratam(x.v) : !vIsVratam(x.v)));
  /* the list is a calendar until someone types: then it is a name lookup,
     flat and date-ordered, because "when is Varalakṣmī" is the only
     question a search on this lens is ever asked. */
  const fold = (s) => (STUTI_TRANSLIT ? STUTI_TRANSLIT.fold(s) : String(s).toLowerCase());
  const qf = fold(q).trim();
  const hits = qf ? all.filter((x) => fold([x.v.name.roman, x.v.name.deva, x.v.name.tel, vp3(vRule(x.v), lang) || ""].join(" ")).indexOf(qf) !== -1) : null;
  const thisMonth = all.filter((x) => x.date.getFullYear() === now.getFullYear() && x.date.getMonth() === now.getMonth());
  const later = all.filter((x) => thisMonth.indexOf(x) === -1);
  const monthName = now.toLocaleDateString(vLocale(lang), { month: "long" });
  let n = 0;
  return (
    <div className="lens-pad">
      <div className="nomu-lens-head">
        {only === "vratam" && <div className="gs-wm gs-wm-nomu gs-wm-vrata">
          <img className="emblem-img emblem-img--day" src="emblems/kalasham-inkday.png" alt="" draggable="false" />
          <img className="emblem-img emblem-img--night" src="emblems/kalasham-inknight.png" alt="" draggable="false" />
        </div>}
        {only === "parva" && <div className="gs-wm gs-wm-nomu gs-wm-parva">
          <img className="emblem-img emblem-img--day" src="emblems/harathi-inkday.png" alt="" draggable="false" />
          <img className="emblem-img emblem-img--night" src="emblems/harathi-inknight.png" alt="" draggable="false" />
        </div>}
        <div className="vr-find vr-find-compact vr-find-side">
          <div className="search-field search-field-sm">
            <Icon name="search" size={18} />
            <input className="search-input" type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={L.t(ph, lang)} aria-label={L.t(ph, lang)} style={{ fontFamily: vFont(lang) }} />
            <VoiceButton lang={lang} onInterim={setQ} onResult={setQ} />
            {q && <button className="icon-btn vr-find-x" onClick={() => setQ("")} aria-label={L.t("startOver", lang)}><Icon name="close" size={17} /></button>}
          </div>
        </div>
      </div>

      {hits ? (
        <div className="gs-ix">
          <div className="gs-sec">{hits.length ? L.t("vrataFound", lang).replace("{n}", hits.length) : L.t(none, lang)}</div>
          {hits.map((x) => <VrataRow key={x.v.id} entry={x} lang={lang} onOpen={onOpen} no={++n} />)}
        </div>
      ) : (
      <div className="gs-ix">
        {thisMonth.length > 0 && (
          <React.Fragment>
            <div className="gs-sec">{monthName}</div>
            {thisMonth.map((x) => <VrataRow key={x.v.id} entry={x} lang={lang} onOpen={onOpen} no={++n} />)}
          </React.Fragment>
        )}
        <div className="gs-sec">{L.t("vrataComing", lang)}</div>
        {later.map((x) => <VrataRow key={x.v.id} entry={x} lang={lang} onOpen={onOpen} no={++n} />)}
      </div>
      )}

      <div className="vr-caveat">{L.t("vrataDateNote", lang)}</div>
      <div style={{ height: 32 }} />
    </div>
  );
}

/* ---------------- samagri: a list you tick while shopping ---------------- */
function SamagriList({ vrataId, items, lang }) {
  const L = STUTI_L;
  const key = "stuti-samagri-" + vrataId;
  const [done, setDone] = useStateV2(() => {
    try { const a = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  });
  useEffectV2(() => { try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {} }, [done, key]);
  const toggle = (i) => setDone((d) => (d.indexOf(i) !== -1 ? d.filter((x) => x !== i) : d.concat([i])));
  const left = items.length - done.length;
  return (
    <div className="sam-block">
      <div className="sam-head">
        <span className="eyebrow">{L.t("samagri", lang)}</span>
        <span className="sam-count">{left > 0 ? L.t("samagriLeft", lang).replace("{n}", left) : L.t("samagriAll", lang)}</span>
      </div>
      <ul className="sam-list">
        {items.map((it, i) => {
          const on = done.indexOf(i) !== -1;
          return (
            <li key={i} className={"sam-item" + (on ? " on" : "")}>
              <button onClick={() => toggle(i)} aria-pressed={on}>
                <span className="sam-box">{on && <Icon name="check" size={15} />}</span>
                <span className="sam-text">{vp3(it, lang)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {done.length > 0 && (
        <button className="sam-clear" onClick={() => setDone([])}>
          <Icon name="repeat" size={14} /> {L.t("startOver", lang)}
        </button>
      )}
    </div>
  );
}

/* ---------------- the guide ---------------- */
function VrataDetail({ vrataId, go, lang, onBack }) {
  const S = STUTI, L = STUTI_L, V = STUTI_VRATA;
  useMasaSys();
  const v = V.byId[vrataId];
  if (!v) return null;
  const d = S.deityById[v.deity];
  const date = V.nextDate(v);
  const away = date ? V.daysAway(date) : null;
  const font = vFont(lang);

  return (
    <div className="view libhub scroll" style={deityStyle(d, { flex: 1 })}>
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div style={{ width: 50 }} />
      </div>
      <div className="lens-pad">
        <header className="vr-hero">
          <div className="deity-hero-row">
            <Seal d={d} size={56} />
            <div className="deity-hero-text">
              <h1 className="deity-hero-name display" style={{ fontFamily: font }}>{vp3(v.name, lang)}</h1>
              <div className="deity-hero-epithet">{vp3(vRule(v), lang)}</div>
            </div>
          </div>
          <p className="deity-hero-line">{vp3(v.tagline, lang)}</p>
          {date && (
            <div className="vr-when">
              <span className="vr-when-date">{vDateStr(date, lang, { weekday: "long", day: "numeric", month: "long" })}</span>
              <span className={"vr-when-away" + (away <= 10 ? " soon" : "")}>{vAwayLabel(away, lang)}</span>
            </div>
          )}
          <div className="vr-meta">
            <span>{vp3(v.duration, lang)}</span>
            <span className="dot" />
            <span>{vp3(v.who, lang)}</span>
          </div>
        </header>

        {v.brief && <div className="vr-brief">{L.t("vrataBrief", lang)}</div>}

        {v.significance && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("significance", lang)}</div>
            {v.significance.map((s, i) => <p key={i} className="vr-para">{vp3(s, lang)}</p>)}
          </div>
        )}

        {v.timeline && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("howTheDayRuns", lang)}</div>
            <ol className="vr-timeline">
              {v.timeline.map((t, i) => (
                <li key={i}>
                  <span className="vr-tl-t">{vp3(t.t, lang)}</span>
                  <span className="vr-tl-d">{vp3(t.d, lang)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {v.samagri && <SamagriList vrataId={v.id} items={v.samagri} lang={lang} />}

        {v.vidhi && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("vidhi", lang)}</div>
            <ol className="vr-vidhi">
              {v.vidhi.map((s, i) => (
                <li key={i}>
                  <span className="vr-vidhi-n">{i + 1}</span>
                  <span className="vr-vidhi-body">
                    <span className="vr-vidhi-step display" style={{ fontFamily: font }}>{vp3(s.step, lang)}</span>
                    <span className="vr-vidhi-detail">{vp3(s.detail, lang)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {v.naivedya && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("naivedya", lang)}</div>
            <div className="vr-naiv">
              {v.naivedya.map((n, i) => (
                <div key={i} className="vr-naiv-row">
                  <span className="vr-naiv-item">{vp3(n.item, lang)}</span>
                  <span className="vr-naiv-note">{vp3(n.note, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="vr-sect">
          <div className="eyebrow">{L.t("toRecite", lang)}</div>
          <DeityLink d={d} go={go} lang={lang} />
        </div>

        {(v.dos || v.donts) && (
          <div className="vr-sect vr-rules">
            {v.dos && (
              <div className="vr-rule vr-do">
                <div className="eyebrow">{L.t("dos", lang)}</div>
                <ul>{v.dos.map((x, i) => <li key={i}>{vp3(x, lang)}</li>)}</ul>
              </div>
            )}
            {v.donts && (
              <div className="vr-rule vr-dont">
                <div className="eyebrow">{L.t("donts", lang)}</div>
                <ul>{v.donts.map((x, i) => <li key={i}>{vp3(x, lang)}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {v.source && <div className="vr-source">{vp3(v.source, lang)}</div>}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

function FestivalLens(props) {
  return <VrataLens {...props} only="parva" ph="festSearchPh" none="festNoMatch" />;
}

export { VrataLens, FestivalLens, VrataDetail, SamagriList };

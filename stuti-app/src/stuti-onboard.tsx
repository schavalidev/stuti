import { Flame, Icon, Seal, deityStyle } from "./stuti-icons";
import React from "react";
import { STUTI } from "./stuti-data";
import { FlyleafForm, KnownClauses, useFlyleaf } from "./stuti-flyleaf";
import { STUTI_L } from "./stuti-i18n";
import { useLoc } from "./stuti-panchanga";
import { STUTI_PREFS } from "./stuti-prefs";
import { fmtNudgeTime } from "./stuti-remind";

/* ============================================================
   STUTI — first run
   Five quiet questions before the first recitation: the script, the
   deities kept, the place (the pañcāṅga needs it), the hour of the
   lamp, and — last, and skippable — who is reciting.

   Identity comes last on purpose. "What is your gotra?" asked before
   anyone has seen a stotra turns a welcome into an examination, and
   plenty of reciters genuinely do not know theirs. So it is asked
   after the app has shown its work: today's clauses, already set.
   ============================================================ */
const { useState: useStateO } = React;

const OB_SAMPLE = {
  deva:   "श्रीगणेशाय नमः",
  telugu: "శ్రీగణేశాయ నమః",
  roman:  "śrīgaṇeśāya namaḥ",
};
const OB_SCRIPTS = [
  { k: "deva",   name: "Devanāgarī", native: "देवनागरी" },
  { k: "telugu", name: "Telugu",     native: "తెలుగు" },
  { k: "roman",  name: "Roman · IAST", native: "IAST" },
];

function ObStep({ title, sub, children, lang }) {
  const L = STUTI_L;
  return (
    <div className="ob-step">
      <h2 className="ob-title display" style={{ fontFamily: L.font(lang) }}>{title}</h2>
      {sub && <p className="ob-sub">{sub}</p>}
      <div className="ob-body">{children}</div>
    </div>
  );
}

/* The place step — built for a full screen: where you are now, one tap to
   detect it, and the almanac's cities inline. (LocationControl is a compact
   chip for the pañcāṅga card; it has no business filling a step.) */
function ObPlace({ lang }) {
  const L = STUTI_L;
  const { locId, detected, geo, loc, LOCS, setLocId, detect } = useLoc();
  const rows = (detected ? [detected] : []).concat(LOCS);
  return (
    <div className="ob-place">
      <div className="ob-place-now">
        <span className="ob-place-mark"><Icon name="locate" size={20} /></span>
        <span className="ob-place-text">
          <span className="ob-place-city display">{loc ? loc.city : "—"}</span>
          <span className="ob-place-region">{loc ? loc.region : ""}</span>
        </span>
      </div>
      <button className="ob-detect" onClick={() => detect()} disabled={geo === "locating"}>
        <Icon name="locate" size={17} />
        {geo === "locating" ? L.t("locating", lang) : L.t("useMyPlace", lang)}
      </button>
      {(geo === "denied" || geo === "error") && <div className="ob-place-note">{L.t("locDenied", lang)}</div>}
      <div className="pd-cap">{L.t("orChooseCity", lang)}</div>
      <div className="ob-cities">
        {rows.map((c) => (
          <button key={c.id} className={"ob-city" + (locId === c.id ? " on" : "")} onClick={() => setLocId(c.id)}>
            <span className="ob-city-text">
              <span className="ob-city-name">{c.city}</span>
              <span className="ob-city-region">{c.region}</span>
            </span>
            {locId === c.id && <Icon name="check" size={17} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Onboarding({ lang, setLang, onDone }) {
  const S = STUTI, L = STUTI_L, P = STUTI_PREFS;
  const [i, setI] = useStateO(0);
  const [kept, setKept] = useStateO(() => P.get().kept.slice());
  const [remind, setRemind] = useStateO(() => Object.assign({}, P.get().remind));
  /* written straight through to the flyleaf — identity is idempotent, so there
     is nothing to stage and nothing to lose by backing out */
  const sk = useFlyleaf();
  const last = 4;

  const toggleKeep = (id) => setKept((k) => (k.indexOf(id) !== -1 ? k.filter((x) => x !== id) : k.concat([id])));
  const finish = () => {
    P.set({ kept: kept, remind: remind });
    P.finish();
    onDone();
  };
  const next = () => (i === last ? finish() : setI(i + 1));

  return (
    <div className="ob-wrap">
      <div className="ob-sheet">
        <div className="ob-top">
          <div className="ob-brand"><Flame size={22} /><span className="ob-brand-name display">Stuti</span></div>
          {i > 0 && <button className="ob-skip" onClick={finish}>{L.t("obSkip", lang)}</button>}
        </div>

        <div className="ob-scroll scroll">
          {i === 0 && (
            <ObStep lang={lang} title={L.t("obReadIn", lang)} sub={L.t("obReadInSub", lang)}>
              <div className="ob-scripts">
                {OB_SCRIPTS.map((s) => (
                  <button key={s.k} className={"ob-script" + (lang === s.k ? " on" : "")} onClick={() => setLang(s.k)}>
                    <span className="ob-script-sample" style={{ fontFamily: L.font(s.k) }}>{OB_SAMPLE[s.k]}</span>
                    <span className="ob-script-name">{s.native}<small>{s.name}</small></span>
                    {lang === s.k && <span className="ob-script-tick"><Icon name="check" size={16} /></span>}
                  </button>
                ))}
              </div>
            </ObStep>
          )}

          {i === 1 && (
            <ObStep lang={lang} title={L.t("obKeep", lang)} sub={L.t("obKeepSub", lang)}>
              <div className="ob-deities">
                {S.deities.map((d) => (
                  <button key={d.id} className={"ob-deity" + (kept.indexOf(d.id) !== -1 ? " on" : "")}
                    style={deityStyle(d)} onClick={() => toggleKeep(d.id)} aria-pressed={kept.indexOf(d.id) !== -1}>
                    <Seal d={d} size={54} />
                    <span className="ob-deity-name" style={{ fontFamily: L.font(lang) }}>{L.name(d, lang)}</span>
                    {kept.indexOf(d.id) !== -1 && <span className="ob-deity-tick"><Icon name="check" size={13} /></span>}
                  </button>
                ))}
              </div>
            </ObStep>
          )}

          {i === 2 && (
            <ObStep lang={lang} title={L.t("obPlace", lang)} sub={L.t("obPlaceSub", lang)}>
              <ObPlace lang={lang} />
            </ObStep>
          )}

          {i === 3 && (
            <ObStep lang={lang} title={L.t("obWhen", lang)} sub={L.t("obWhenSub", lang)}>
              <div className="ob-times">
                {["05:30", "06:00", "06:30", "07:00", "18:30"].map((t) => (
                  <button key={t} className={"rm-time" + (remind.time === t && remind.on ? " on" : "")}
                    onClick={() => setRemind((r) => Object.assign({}, r, { time: t, on: true }))}>
                    {fmtNudgeTime(t, lang)}
                  </button>
                ))}
                <label className="rm-time rm-time-custom">
                  <Icon name="clock" size={15} />
                  <input type="time" value={remind.time} aria-label={L.t("atWhatHour", lang)}
                    onChange={(e) => setRemind((r) => Object.assign({}, r, { time: e.target.value || "06:00", on: true }))} />
                </label>
              </div>
              <button className={"rm-toggle rm-toggle-quiet" + (remind.tithi ? " on" : "")} role="switch" aria-checked={remind.tithi}
                onClick={() => setRemind((r) => Object.assign({}, r, { tithi: !r.tithi }))}>
                <span>{L.t("tithiNudges", lang)}</span>
                <span className="rm-switch"><i /></span>
              </button>
              <button className={"ob-none" + (remind.on ? "" : " on")} onClick={() => setRemind((r) => Object.assign({}, r, { on: false }))}>
                {L.t("obNoReminder", lang)}
              </button>
              <div className="rm-note">{L.t("notifNote", lang)}</div>
            </ObStep>
          )}
          {i === 4 && (
            <ObStep lang={lang} title={L.t("obSankalpa", lang)} sub={L.t("obSankalpaSub", lang)}>
              {/* show first, ask second. The app has already set twelve clauses
                  for today at this reciter's place; having done that, it has
                  earned the right to ask for the thirteenth. */}
              <KnownClauses lang={lang} sk={sk} />
              <FlyleafForm sk={sk} lang={lang} />
              <button className="ob-none ob-later" onClick={finish}>{L.t("obLater", lang)}</button>
            </ObStep>
          )}
        </div>

        <div className="ob-foot">
          <div className="ob-dots">
            {[0, 1, 2, 3, 4].map((n) => <span key={n} className={"ob-dot" + (n === i ? " on" : "")} />)}
          </div>
          <div className="ob-actions">
            {i > 0 && <button className="ob-back" onClick={() => setI(i - 1)}>{L.t("obBack", lang)}</button>}
            <button className="ob-next" onClick={next}>
              {i === last ? L.t("obBegin", lang) : L.t("obNext", lang)}
              <Icon name="arrow" size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Onboarding };

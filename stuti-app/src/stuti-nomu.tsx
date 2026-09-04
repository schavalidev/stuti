import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { DeityLink, Icon, Seal, deityStyle } from "./stuti-icons";
import { STUTI_KEEP } from "./stuti-keep-core";
import { KeepBell } from "./stuti-keep";
import { STUTI_NOMU } from "./stuti-nomu-data";
import { STUTI_TRANSLIT } from "./stuti-translit";
import { VoiceButton } from "./stuti-voice";

/* ============================================================
   STUTI — the Nomulu lens

   Deliberately not a second Vrata lens. A vrata answers "when",
   so its lens is a calendar; a nomu answers "how many years, and
   who did I give it to", so its lens is a shelf. No dates are
   reckoned here — most nomulu are named by month and day the way
   an elder names them, and a computed date would claim more
   precision than the custom has.

   The guide reuses the vrata guide's own classes so the two read as
   one book with two chapters, and adds nothing to the stylesheet.
   ============================================================ */
const nomP = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.tel || o.roman) : o.roman);
const nomFont = (lang) => STUTI_L.font(lang);

/* the classifier lives in STUTI_KEEP so the bell and these chips agree */
const NOMU_CADENCE = STUTI_KEEP.NOMU_CADENCE;
const nomuCadence = (n) => STUTI_KEEP.nomuCadence(n);

function NomuRow({ n, lang, onOpen, no }) {
  const S = STUTI, d = S.deityById[n.deity];
  const font = nomFont(lang);
  return (
    <div className="gs-en">
      <KeepBell kind="nomu" id={n.id} lang={lang} />
      <button className="gs-main" onClick={() => onOpen(n.id)}>
        <span className="gs-no" style={{ fontFamily: font }}>{String(no)}</span>
        <span className="gs-ti"><span className="gs-d" style={{ fontFamily: font }}>{nomP(n.name, lang)}</span></span>
      </button>
    </div>
  );
}

function NomuLens({ go, lang, onOpen }) {
  const L = STUTI_L, N = STUTI_NOMU;
  const [q, setQ] = React.useState("");
  const [whatOpen, setWhatOpen] = React.useState(false);
  const [cadence, setCadence] = React.useState("all");
  const fold = (s) => (STUTI_TRANSLIT ? STUTI_TRANSLIT.fold(s) : String(s).toLowerCase());
  const qf = fold(q).trim();
  const hits = qf ? N.list.filter((n) => fold([n.name.roman, n.name.deva, n.name.tel, nomP(n.when, lang) || "", nomP(n.years, lang) || ""].join(" ")).indexOf(qf) !== -1) : null;
  const base = hits || N.list;
  const shown = cadence === "all" ? base : base.filter((n) => nomuCadence(n) === cadence);
  const groups = NOMU_CADENCE.filter((g) => g.key === "daily" || g.key === "multiyear");
  return (
    <div className="lens-pad" style={{ "--deity-hue": 25 }}>
      <div className="nomu-lens-head">
        <div className="gs-wm gs-wm-nomu gs-wm-vrata">
          <img className="emblem-img emblem-img--day" src="emblems/vayanam-inkday.png" alt="" draggable="false" />
          <img className="emblem-img emblem-img--night" src="emblems/vayanam-inknight.png" alt="" draggable="false" />
        </div>
        <div className="vr-find vr-find-compact vr-find-side">
          <div className="search-field search-field-sm">
            <Icon name="search" size={17} />
            <input className="search-input" type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={L.t("nomuSearchPh", lang)} aria-label={L.t("nomuSearchPh", lang)} style={{ fontFamily: nomFont(lang) }} />
            <VoiceButton lang={lang} size={17} onInterim={setQ} onResult={setQ} />
            {q && <button className="icon-btn vr-find-x" onClick={() => setQ("")} aria-label={L.t("startOver", lang)}><Icon name="close" size={17} /></button>}
          </div>
          <button type="button" className={"vr-q-btn" + (whatOpen ? " is-open" : "")} onClick={() => setWhatOpen((v) => !v)} aria-expanded={whatOpen} aria-label={L.t("nomuWhatQ", lang)}>?</button>
        </div>
        {whatOpen && <div className="vr-brief vr-brief-tight">{L.t("nomuWhat", lang)}</div>}
      </div>
      <div className="nomu-cad">
      {[{ key: "all", labelKey: "nomuCadAll" }, ...groups].map((g) => {
      const n = g.key === "all" ? base.length : base.filter((x) => nomuCadence(x) === g.key).length;
      if (g.key !== "all" && !n) return null;
      const active = cadence === g.key;
      return (
      <button key={g.key} className={"chip" + (active ? " on" : "")} onClick={() => setCadence(g.key)} aria-pressed={active}>
      {L.t(g.labelKey, lang)} · {n}
      </button>
      );
      })}
      </div>
      <div className="gs-ix">
        {hits && <div className="gs-sec">{hits.length ? L.t("vrataFound", lang).replace("{n}", hits.length) : L.t("nomuNoMatch", lang)}</div>}
        {shown.map((n, i) => <NomuRow key={n.id} n={n} lang={lang} onOpen={onOpen} no={i + 1} />)}
      </div>
      <div className="vr-caveat">{L.t("nomuCaveat", lang)}</div>
      <div style={{ height: 32 }} />
    </div>
  );
}

function NomuDetail({ nomuId, go, lang, onBack }) {
  const S = STUTI, L = STUTI_L, N = STUTI_NOMU;
  const n = N.get(nomuId);
  if (!n) return null;
  const d = S.deityById[n.deity];
  const font = nomFont(lang);

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
              <h1 className="deity-hero-name display" style={{ fontFamily: font }}>{nomP(n.name, lang)}</h1>
              <div className="deity-hero-epithet">{nomP(n.when, lang)}</div>
            </div>
          </div>
          <p className="deity-hero-line">{nomP(n.forwhat, lang)}</p>
        </header>

        {n.how && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("vidhi", lang)}</div>
            <p className="vr-para">{nomP(n.how, lang)}</p>
          </div>
        )}

        {n.vayanam && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("vayanam", lang)}</div>
            <p className="vr-para">{nomP(n.vayanam, lang)}</p>
          </div>
        )}

        {n.katha && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("katha", lang)}</div>
            <div className="nomu-katha-card">
              <p className="vr-para">{nomP(n.katha, lang)}</p>
            </div>
          </div>
        )}

        {n.udyapana && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("udyapana", lang)}</div>
            <p className="vr-para">{nomP(n.udyapana, lang)}</p>
          </div>
        )}

        {n.caution && <div className="vr-caveat">{nomP(n.caution, lang)}</div>}

        <div className="vr-sect">
          <div className="eyebrow">{L.t("toRecite", lang)}</div>
          <DeityLink d={d} go={go} lang={lang} />
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

export { NomuLens, NomuDetail };

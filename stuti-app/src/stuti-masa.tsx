import { Icon, Seal, deityStyle } from "./stuti-icons";
import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { STUTI_LIB } from "./stuti-library-data";
import { STUTI_MASA } from "./stuti-masa-data";
import { RtuGlyph, SeasonAmbient } from "./stuti-panchanga";

/* ============================================================
   STUTI — the Māsa lens
   Layout borrows the vrata guide's, as the nomu and pārāyaṇa
   lenses already do — a hero for the month running now, a grid
   of the eleven ahead of it, and a guide page that points out at
   whatever else already carries that month: vratas, nomulu and
   pārāyaṇas are read off their own data, not re-typed here.
   ============================================================ */
const maP = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.tel || o.roman) : o.roman);
const maFont = (lang) => STUTI_L.font(lang);
const maLocale = (lang) => (lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : undefined);
/* the six ṛtus, in the sidereal order the lunar months fall into — two months
   to a season, which is what gives the year-ahead grid its rhythm. Hue and
   motif come from the pañcāṅga's own season table so a month and the day card
   agree about what Śrāvaṇa looks like. */
const MA_RTU = [
  { ids: ["caitra", "vaisakha"],        name: { roman: "Vasanta", deva: "वसन्त", tel: "వసంత" },   gloss: "spring",       kind: "blossom",  hue: "var(--rtu-vasanta)" },
  { ids: ["jyeshtha", "ashadha"],       name: { roman: "Grīṣma",  deva: "ग्रीष्म", tel: "గ్రీష్మ" }, gloss: "summer",       kind: "sun-hot",  hue: "var(--rtu-grisma)" },
  { ids: ["shravana", "bhadrapada"],    name: { roman: "Varṣā",   deva: "वर्षा",  tel: "వర్ష" },    gloss: "the rains",    kind: "rain",     hue: "var(--rtu-varsa)" },
  { ids: ["ashvina", "kartika"],        name: { roman: "Śarad",   deva: "शरद्",   tel: "శరద్" },    gloss: "autumn",       kind: "leaf",     hue: "var(--rtu-sarad)" },
  { ids: ["margashirsha", "pausha"],    name: { roman: "Hemanta", deva: "हेमन्त", tel: "హేమంత" },   gloss: "early winter", kind: "sun-cold", hue: "var(--rtu-hemanta)" },
  { ids: ["magha", "phalguna"],         name: { roman: "Śiśira",  deva: "शिशिर",  tel: "శిశిర" },   gloss: "late winter",  kind: "mist",     hue: "var(--rtu-sisira)" },
];
const maRtu = (id) => MA_RTU.find((r) => r.ids.indexOf(id) !== -1) || MA_RTU[0];
/* transitional months carry a milder mix of the outgoing and incoming
   season rather than snapping straight over on the same day the group does */
const MASA_MIX = {
  bhadrapada: { kinds: ["rain", "leaf"], hueB: "var(--rtu-sarad)" },
  pausha:     { kinds: ["sun-cold", "mist"],           hueB: "var(--rtu-sisira)" },
  phalguna:   { kinds: ["mist", "blossom"], hueB: "var(--rtu-vasanta)" },
  vaisakha:   { kinds: ["blossom", "sun-hot"],         hueB: "var(--rtu-grisma)", sunBright: true },
  ashadha:    { kinds: ["sun-hot", "rain"], heat: false, hueB: "var(--rtu-varsa)" },
  kartika:    { kinds: ["leaf", "sun-cold"],          hueB: "var(--rtu-hemanta)" },
};
/* how many named days the month carries — parva dinālu and nomulu together,
   read off their own lists rather than counted here */
function maKept(m) {
  const MA = STUTI_MASA;
  return MA.parvasOf(m.idx).length + MA.nomuOf(m.idx).length;
}
/* the running month's own arithmetic: how far through it is, and what is left */
function maProgress(idx) {
  const MA = STUTI_MASA, r = MA.rangeOf ? MA.rangeOf(idx) : null;
  if (!r) return null;
  const DAY = 86400000, t = new Date(); t.setHours(0, 0, 0, 0);
  const total = Math.round((r.end - r.start) / DAY) + 1;
  const gone = Math.round((t - r.start) / DAY) + 1;
  if (!(total > 0) || gone < 1 || gone > total) return null;
  return { total, gone, left: total - gone, pct: Math.max(4, Math.min(100, (gone / total) * 100)) };
}
/* the engine's own dates for this cycle; the authored greg string only
   when the engine is unreachable — an adhika year moves every month */
function maRange(m, lang) {
  const MA = STUTI_MASA;
  const r = MA.rangeOf ? MA.rangeOf(m.idx) : null;
  if (!r) return m.greg;
  const f = (d) => d.toLocaleDateString(maLocale(lang), { day: "numeric", month: "long" });
  return f(r.start) + " – " + f(r.end);
}

function MasaLens({ lang, onOpen }) {
  const L = STUTI_L, MA = STUTI_MASA;
  const ordered = React.useMemo(() => MA.orderedList(), []);
  const hero = ordered[0], rest = ordered.slice(1);
  const font = maFont(lang);
  const rtu = maRtu(hero.id);
  const prog = maProgress(hero.idx);
  const marks = MA.parvasOf(hero.idx).slice(0, 3);
  const spans = MA.spansOf(hero.idx);

  return (
    <div className="lens-pad">
      <div className="lens-sect"><div className="eyebrow">{L.t("masaNow", lang)}</div></div>
      <button className="masa-now" style={MASA_MIX[hero.id] ? { "--rtu": rtu.hue, "--rtu-b": MASA_MIX[hero.id].hueB } : { "--rtu": rtu.hue }} data-mix={MASA_MIX[hero.id] ? "1" : undefined} onClick={() => onOpen(hero.id)}>
        <SeasonAmbient kind={rtu.kind} dense mix={MASA_MIX[hero.id] && MASA_MIX[hero.id].kinds} heat={MASA_MIX[hero.id] && MASA_MIX[hero.id].heat} sunHue={MASA_MIX[hero.id] && MASA_MIX[hero.id].sunHue} sunBright={MASA_MIX[hero.id] && MASA_MIX[hero.id].sunBright} />
        <span className="masa-now-top">
          <span className="masa-now-rtu">
            <RtuGlyph kind={rtu.kind} size={17} />
            <span style={{ fontFamily: font }}>{maP(rtu.name, lang)}</span>
            {lang === "roman" && <span className="masa-now-gloss">{rtu.gloss}</span>}
          </span>
          <span className="masa-now-greg">{maRange(hero, lang)}</span>
        </span>
        <span className="masa-now-name display" style={{ fontFamily: font }}>{maP(hero.name, lang)}</span>
        <span className="masa-now-tag">{maP(hero.tagline, lang)}</span>
        {prog && (
          <span className="masa-now-prog">
            <span className="masa-now-bar"><span className="masa-now-fill" style={{ width: prog.pct + "%" }} /></span>
            <span className="masa-now-left">{prog.left + " " + L.t("masaLeft", lang)}</span>
          </span>
        )}
        {(marks.length > 0 || spans.length > 0) && (
          <span className="masa-now-marks">
            {spans.map((s) => <span key={s.id} className="masa-mark masa-mark-span" style={{ fontFamily: font }}>{maP(s.name, lang)}</span>)}
            {marks.map((v) => <span key={v.id} className="masa-mark" style={{ fontFamily: font }}>{maP(v.name, lang)}</span>)}
          </span>
        )}
      </button>

      <div className="lens-sect lens-sect-gap"><div className="eyebrow">{L.t("masaAhead", lang)}</div></div>
      <div className="tile-grid">
        {rest.map((m, n) => {
          const r = maRtu(m.id), kept = maKept(m), mix = MASA_MIX[m.id];
          return (
            <button key={m.id} className="masa-tile masa-tile-plain" style={mix ? { "--rtu": r.hue, "--rtu-b": mix.hueB, animationDelay: `${60 + n * 30}ms` } : { "--rtu": r.hue, animationDelay: `${60 + n * 30}ms` }} data-mix={mix ? "1" : undefined} onClick={() => onOpen(m.id)}>
              <span className="masa-tile-name display" style={{ fontFamily: font }}>{maP(m.name, lang)}</span>
              <span className="masa-tile-greg">{maRange(m, lang)}</span>
              {kept > 0 && <span className="masa-tile-kept">{kept + " " + L.t("masaKept", lang)}</span>}
            </button>
          );
        })}
      </div>
      <div className="vr-caveat">{L.t("masaNote", lang)}</div>
      <div style={{ height: 32 }} />
    </div>
  );
}

/* a row pointing out of this page — vrata, nomu and pārāyaṇa detail
   already exist in their own lens, so a tap here just opens that */
function MasaRefRow({ d, name, sub, lang, i, onClick }) {
  return (
    <button className="vr-row" style={{ ...deityStyle(d), animationDelay: `${40 + i * 40}ms` }} onClick={onClick}>
      <Seal d={d} size={40} />
      <span className="vr-row-body">
        <span className="vr-row-name display" style={{ fontFamily: maFont(lang) }}>{name}</span>
        <span className="vr-row-rule">{sub}</span>
      </span>
      <span className="vr-row-when"><Icon name="chev" size={18} /></span>
    </button>
  );
}

function MasaDetail({ masaId, go, lang, onBack, onOpen }) {
  const S = STUTI, L = STUTI_L, MA = STUTI_MASA, LIB = STUTI_LIB;
  const m = MA.byId[masaId];
  if (!m) return null;
  const font = maFont(lang);
  const vratas = MA.vratasOf(m.idx);
  const parvas = MA.parvasOf(m.idx);
  const parayanas = MA.parayanaOf(m.idx);
  const nomus = MA.nomuOf(m.idx);
  const recited = m.recite ? LIB.resolveStotras(m.recite) : [];
  const rng = MA.rangeOf ? MA.rangeOf(m.idx) : null;
  const prog = maProgress(m.idx);
  const rtu = maRtu(m.id);

  return (
    <div className="view libhub scroll masa-detail-page" data-mix={MASA_MIX[m.id] ? "1" : undefined} style={MASA_MIX[m.id] ? { "--rtu": maRtu(m.id).hue, "--rtu-b": MASA_MIX[m.id].hueB } : { "--rtu": maRtu(m.id).hue }}>
      <SeasonAmbient kind={maRtu(m.id).kind} dense mix={MASA_MIX[m.id] && MASA_MIX[m.id].kinds} heat={MASA_MIX[m.id] && MASA_MIX[m.id].heat} sunHue={MASA_MIX[m.id] && MASA_MIX[m.id].sunHue} sunBright={MASA_MIX[m.id] && MASA_MIX[m.id].sunBright} />
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <h1 className="topbar-title md-name display" style={{ fontFamily: font }}>{maP(m.name, lang)}</h1>
        <div style={{ width: 50 }} />
      </div>
      <div className="lens-pad">
        <header className="md-hero">
          <div className="md-meta">
            <div className="md-rtu">
              <RtuGlyph kind={rtu.kind} size={15} />
              <span style={{ fontFamily: font }}>{maP(rtu.name, lang)}</span>
              {lang === "roman" && <span className="md-rtu-gloss">{rtu.gloss}</span>}
            </div>
            <div className="md-range">{maRange(m, lang)}</div>
          </div>
          <p className="md-tag">{maP(m.tagline, lang)}</p>
          {prog && (
            <div className="md-prog">
              <span className="md-bar"><span className="md-fill" style={{ width: prog.pct + "%" }} /></span>
              <span className="md-left">{prog.left + " " + L.t("masaLeft", lang)}</span>
            </div>
          )}
        </header>

        {rng && rng.adhikaShifted && <div className="vr-brief">{L.t("masaAdhikaNote", lang)}</div>}

        {m.gist && (
          <div className="md-card">
            <div className="eyebrow">{L.t("significance", lang)}</div>
            {m.gist.map((g, i) => <p key={i} className="vr-para">{maP(g, lang)}</p>)}
          </div>
        )}

        {m.nishtas && m.nishtas.length > 0 && (
          <div className="md-card">
            <div className="eyebrow">{L.t("masaNishtas", lang)}</div>
            {m.nishtas.map((n, i) => {
              if (n.span) {
                const sp = MA.spans[n.span];
                if (!sp) return null;
                return (
                  <div key={i} className="masa-nishta masa-nishta-span">
                    <div className="masa-nishta-name display" style={{ fontFamily: font }}>{maP(sp.name, lang)}</div>
                    <div className="masa-nishta-rule">{maP(sp.rule, lang)}</div>
                    <div className="masa-nishta-detail">{maP(sp.gist[0], lang)}</div>
                  </div>
                );
              }
              return (
                <div key={i} className="masa-nishta">
                  <div className="masa-nishta-name display" style={{ fontFamily: font }}>{maP(n.name, lang)}</div>
                  <div className="masa-nishta-detail">{maP(n.detail, lang)}</div>
                </div>
              );
            })}
          </div>
        )}

        {parvas.length > 0 && (
          <div className="md-list">
            <div className="eyebrow">{L.t("masaParvaHead", lang)}</div>
            <div className="vr-list">
              {parvas.map((v, i) => (
                <MasaRefRow key={v.id} d={S.deityById[v.deity]} name={maP(v.name, lang)} sub={maP(v.rule, lang)} lang={lang} i={i}
                  onClick={() => onOpen("vrata", v.id)} />
              ))}
            </div>
          </div>
        )}

        {nomus.length > 0 && (
          <div className="md-list">
            <div className="eyebrow">{L.t("masaNomuHead", lang)}</div>
            <div className="vr-list">
              {nomus.map((n, i) => (
                <MasaRefRow key={n.id} d={S.deityById[n.deity]} name={maP(n.name, lang)} sub={maP(n.when, lang)} lang={lang} i={i}
                  onClick={() => onOpen("nomu", n.id)} />
              ))}
            </div>
          </div>
        )}

        {vratas.length > 0 && (
          <div className="md-list">
            <div className="eyebrow">{L.t("masaVrathaluHead", lang)}</div>
            <div className="vr-list">
              {vratas.map((v, i) => (
                <MasaRefRow key={v.id} d={S.deityById[v.deity]} name={maP(v.name, lang)} sub={maP(v.rule, lang)} lang={lang} i={i}
                  onClick={() => onOpen("vrata", v.id)} />
              ))}
            </div>
          </div>
        )}

        {parayanas.length > 0 && (
          <div className="md-list">
            <div className="eyebrow">{L.t("masaParayana", lang)}</div>
            <div className="vr-list">
              {parayanas.map((p, i) => (
                <MasaRefRow key={p.id} d={S.deityById[p.deity]} name={maP(p.name, lang)} sub={maP(p.source, lang)} lang={lang} i={i}
                  onClick={() => onOpen("parayana", p.id)} />
              ))}
            </div>
          </div>
        )}

        {recited.length > 0 && (
          <div className="md-card">
            <div className="eyebrow">{L.t("toRecite", lang)}</div>
            {recited.map((h, i) => h && (
              <button key={i} className="pstep-recite" style={deityStyle(S.deityById[h.deity])}
                onClick={() => go("reader", { deity: h.deity, hymn: h.id, from: "browse" })}>
                <Icon name="play" size={13} />
                <span style={{ fontFamily: font }}>{L.hymnTitle(h, lang)}</span>
              </button>
            ))}
          </div>
        )}

        {m.dana && (
          <div className="md-card">
            <div className="eyebrow">{L.t("masaDana", lang)}</div>
            <p className="vr-para">{maP(m.dana, lang)}</p>
          </div>
        )}

        <div className="vr-caveat">{L.t("masaNote", lang)}</div>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

/* the calendar backdrop asks by the masa's roman name — same mix table */
const MASA_MIX_IAST = { "Bhādrapada": MASA_MIX.bhadrapada, "Puṣya": MASA_MIX.pausha, "Pauṣa": MASA_MIX.pausha, "Phālguna": MASA_MIX.phalguna, "Vaiśākha": MASA_MIX.vaisakha, "Kārtika": MASA_MIX.kartika, "Āṣāḍha": MASA_MIX.ashadha };
const masaMixFor = (iast) => (iast && MASA_MIX_IAST[iast]) || null;
export { MasaLens, MasaDetail, masaMixFor };

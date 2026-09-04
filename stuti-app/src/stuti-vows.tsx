import { Icon } from "./stuti-icons";
import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { JAPA_THREADS } from "./stuti-japa";
import { STUTI_NUDGE } from "./stuti-nudge";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_JAPA, STUTI_THREAD, STUTI_VOWS } from "./stuti-sadhana";
import { STUTI_FAVS } from "./stuti-store";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — saṅkalpa scheduler (vows)
   VowsCard (Nitya tab: due today + upcoming) · VowSheet (builder)
   Dates come from the pañcāṅga engine at the reader's own place.
   ============================================================ */
const { useState: useStateV, useEffect: useEffectV } = React;

const vowOccName = (o, lang) => lang === "telugu" ? o.tel : lang === "deva" ? o.deva : o.name;
const vowTermName = (t, lang) => lang === "telugu" ? t.tel : lang === "deva" ? t.deva : t.name;
function vowDateStr(d, lang) {
  const V = AKSHARA_PANCHANGA.VARA[d.getDay()];
  const wd = lang === "telugu" ? V.tel : lang === "deva" ? V.deva : V.iast;
  return wd + " · " + d.getDate() + " " + d.toLocaleDateString("en", { month: "short" });
}

/* ---------------- Nitya tab card ---------------- */
function VowsCard({ go, lang = "deva" }) {
  const S = STUTI, L = STUTI_L, W = STUTI_VOWS;
  const [, force] = useStateV(0);
  const [open, setOpen] = useStateV(false);
  /* a saṅkalpa is a promise, so it does not come undone on one stray tap:
     the × arms, says so, and disarms itself if the hand moves on */
  const [armed, setArmed] = useStateV(null);
  useEffectV(() => W.subscribe(() => force(x => x + 1)), []);
  /* the moment someone commits is the moment to ask — a prompt raised on a
     settings screen they merely wandered into is the one that gets refused */
  const askPerm = () => { const N = STUTI_NUDGE; if (N && N.permission() === "default") N.ask(); };
  const vows = W.list();
  return (
    <React.Fragment>
      <div className="vows">
        <div className="vows-head">
          <div>
            <div className="eyebrow">{L.t("vows", lang)}</div>
            <div className="vows-title display" style={{ fontFamily: L.font(lang) }}>{L.t("sankalpaVow", lang)}</div>
          </div>
          <button className="vows-add" onClick={() => setOpen(true)}>+ {L.t("takeVow", lang)}</button>
        </div>
        {vows.length === 0 ? (
          <p className="vows-empty">{L.t("vowsEmpty", lang)}</p>
        ) : (
          <div className="vows-list">
            {vows.map(v => {
              const isJ = v.kind === "japa";
              const h = isJ ? null : S.hymnById(v.hymn); if (!isJ && !h) return null;
              const d = S.deityById[isJ ? v.deity : h.deity], o = W.occ(v.occasion), t = W.term(v.term);
              const jTitle = isJ ? ((v.label || (d ? L.name(d, lang) : "")) + " \u00b7 " + L.t("vowKindJapa", lang)) : null;
              const inMala = isJ && !v.label && JAPA_THREADS.some(m => m.id === v.deity);
              const japaId = isJ ? v.deity : v.hymn;
              const due = W.isDue(v), kept = W.keptToday(v);
              const next = W.dates(v, 3).filter(x => x.toDateString() !== new Date().toDateString());
              const occLabel = o.weekday
                ? vowOccName(o, lang) + " · " + vowDateStr(new Date(Date.now() + ((7 + (v.weekday || 0) - new Date().getDay()) % 7) * 86400000), lang).split(" · ")[0]
                : vowOccName(o, lang);
              return (
                <div key={v.id} className={"vow" + (due ? " due" : "")} style={{ "--deity-hue": d ? d.hue : 36 }}>
                  <div className="vow-top">
                    <div className="vow-body">
                      <div className="vow-occ">{occLabel} · {vowTermName(t, lang)}</div>
                      <button className="vow-hymn display" style={{ fontFamily: L.font(lang) }} disabled={isJ && !inMala}
                        onClick={() => { if (isJ) { if (!inMala) return; STUTI_JAPA.setLast(v.deity); go("japa"); } else go("reader", { deity: h.deity, hymn: h.id, from: "daily" }); }}>
                        {isJ ? jTitle : L.hymnTitle(h, lang)}</button>
                      <div className="vow-next">
                        {due ? L.t("dueToday", lang)
                            : next.length ? L.t("nextOn", lang) + " " + vowDateStr(next[0], lang)
                            : L.t("vowComplete", lang)}
                      </div>
                    </div>
                    <div className="vow-tools">
                      <button className={"vow-bell" + (W.reminds(v) ? " on" : "")} aria-label={L.t("vowRemind", lang)} aria-pressed={W.reminds(v)}
                        onClick={() => { const on = !W.reminds(v); W.setRemind(v.id, on); if (on) askPerm(); }}>
                        <Icon name="bell" size={16} />
                      </button>
                      <button className={"vow-x" + (armed === v.id ? " arm" : "")} aria-label={L.t("removePlan", lang)}
                        onClick={() => {
                          if (armed === v.id) { W.remove(v.id); setArmed(null); return; }
                          setArmed(v.id);
                          setTimeout(() => setArmed((a) => (a === v.id ? null : a)), 4000);
                        }}>{armed === v.id ? L.t("removePlan", lang) : "×"}</button>
                    </div>
                  </div>
                  {due && (
                    <div className="vow-actions">
                      {isJ ? (inMala ? (
                        <button className="vow-do" onClick={() => { STUTI_JAPA.setLast(v.deity); go("japa"); }}>
                          <Icon name="flower" size={16} /> {L.t("vowBeginJapa", lang)}
                        </button>
                      ) : null) : (
                        <button className="vow-do" onClick={() => go("reader", { deity: h.deity, hymn: h.id, from: "daily" })}>
                          <Icon name="book" size={16} /> {L.t("beginRecitation", lang)}
                        </button>
                      )}
                      <button className={"vow-keep" + (kept ? " kept" : "")} onClick={() => W.keep(v.id)} disabled={kept}>
                        <Icon name="check" size={16} /> {kept ? L.t("vowKept", lang) : L.t("markKept", lang)}
                      </button>
                    </div>
                  )}
                  {v.japa && v.japa.count > 0 && (() => {
                    const js = STUTI_JAPA.state(japaId);
                    return (
                      <button className="vow-japa" onClick={() => { STUTI_JAPA.bump(japaId); STUTI_JAPA.setLast(japaId); force(x => x + 1); }}>
                        <Icon name="flower" size={15} />
                        {L.t("vowJapaBadge", lang).replace("{n}", js.today).replace("{t}", v.japa.count)}
                      </button>
                    );
                  })()}
                  {!due && next.length > 1 && (
                    <div className="vow-dates">{next.slice(0, 3).map((x, i) => <span key={i}>{vowDateStr(x, lang)}</span>)}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {open && <OverlayPortal><VowSheet lang={lang} onClose={() => setOpen(false)} /></OverlayPortal>}
    </React.Fragment>
  );
}

/* a plain search field for picking one thing from many — no populated
   dropdown, just type and the matching list appears below; a clear (×)
   sits in the field once something is typed or chosen */
function SearchSelect({ value, options, onChange, placeholder, font, ariaLabel }) {
  const [q, setQ] = useStateV("");
  const [focused, setFocused] = useStateV(false);
  const [chosen, setChosen] = useStateV("");
  const showList = focused && q.trim().length > 0;
  const fold = STUTI_TRANSLIT.fold;
  const matches = showList
    ? options.filter(o => fold(o.label + " " + (o.sub || "")).includes(fold(q.trim()))).slice(0, 8)
    : [];
  return (
    <div className="ssel">
      <div className="ssel-field">
        <Icon name="search" size={16} />
        <input aria-label={ariaLabel} placeholder={placeholder || "—"}
          style={font ? { fontFamily: font } : null}
          value={focused ? q : chosen}
          onFocus={() => setFocused(true)}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => setTimeout(() => setFocused(false), 120)} />
      </div>
      {showList && (
        <div className="ssel-list">
          {matches.length ? matches.map(o => (
            <button key={String(o.value)} type="button" className="ssel-opt"
              style={o.font || font ? { fontFamily: o.font || font } : null}
              onClick={() => { onChange(o.value); setChosen(o.label); setQ(""); setFocused(false); }}>
              <span className="ssel-opt-label">{o.label}</span>
              {o.sub && <span className="ssel-opt-sub">{o.sub}</span>}
            </button>
          )) : <div className="ssel-empty">{placeholder || "—"}</div>}
        </div>
      )}
    </div>
  );
}

/* ---------------- The builder ---------------- */
function VowSheet({ lang = "deva", onClose }) {
  const S = STUTI, L = STUTI_L, W = STUTI_VOWS;
  const texts = S.hymns.filter(h => !h.catalog && h.verses && h.verses.length);
  const [kind, setKind] = useStateV("stotra");
  const [deity, setDeity] = useStateV("shiva");
  const [ownName, setOwnName] = useStateV("");
  const own = ownName.trim();
  const [hymn, setHymn] = useStateV(() => (STUTI_FAVS.list().find(id => S.hymnById(id)) || texts[0].id));
  const [occasion, setOccasion] = useStateV("pradosha");
  const [weekday, setWeekday] = useStateV(2);
  const [term, setTerm] = useStateV("m3");
  const [japaOn, setJapaOn] = useStateV(false);
  const [japaCount, setJapaCount] = useStateV(108);
  const o = W.occ(occasion);
  const preview = W.dates({ hymn, occasion, weekday, term, start: STUTI_THREAD.dkey() }, 4);
  const font = L.font(lang);
  const VARA = AKSHARA_PANCHANGA.VARA;
  return (
    <div className="nm-sheet vow-sheet">
      <div className="nm-head">
        <button className="icon-btn" onClick={onClose} aria-label={STUTI_L.a("aClose")}><Icon name="back" /></button>
        <div className="nm-title">
          <div className="nm-title-name display" style={{ fontFamily: font }}>{L.t("takeVow", lang)}</div>
          <div className="nm-title-sub">{L.t("vowSheetSub", lang)}</div>
        </div>
      </div>
      <div className="nm-list scroll">
        <div className="vow-form">
          <label className="vow-label">{L.t("vowKindLabel", lang)}</label>
          <div className="vow-opts">
            {[["stotra", "vowKindStotra"], ["japa", "vowKindJapa"]].map(([k, key]) => (
              <button key={k} className={"vow-opt" + (kind === k ? " on" : "")} onClick={() => setKind(k)}
                style={lang === "roman" ? null : { fontFamily: font }}>{L.t(key, lang)}</button>
            ))}
          </div>
          {kind === "stotra" ? (
            <React.Fragment>
              <label className="vow-label">{L.t("vowWhat", lang)}</label>
              <SearchSelect value={hymn} onChange={(v) => setHymn(v || hymn)} font={font} ariaLabel={L.t("vowWhat", lang)}
                options={texts.map(h => ({ value: h.id, label: L.hymnTitle(h, lang), sub: L.name(S.deityById[h.deity], lang) + " \u00b7 " + L.versesCount(h.verses.length, lang) }))} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <label className="vow-label">{L.t("vowWhichDeity", lang)}</label>
              <div className="vow-opts">
                {JAPA_THREADS.map(m => {
                  const dd = S.deityById[m.deity];
                  return (
                    <button key={m.id} className={"vow-opt" + (!own && m.id === deity ? " on" : "")} onClick={() => { setDeity(m.id); setOwnName(""); }}
                      style={lang === "roman" ? null : { fontFamily: font }}>{L.name(dd, lang)}</button>
                  );
                })}
              </div>
              <div className="ssel" style={{ marginTop: 8 }}>
                <div className="ssel-field">
                  <Icon name="flower" size={16} />
                  <input aria-label={L.t("vowOwnDeity", lang)} placeholder={L.t("vowOwnDeity", lang)}
                    style={{ fontFamily: font }} value={ownName} onChange={(e) => setOwnName(e.target.value)} />
                </div>
              </div>
            </React.Fragment>
          )}
          <label className="vow-label">{L.t("vowWhen", lang)}</label>
          <div className="vow-opts">
            {W.OCCASIONS.map(x => (
              <button key={x.id} className={"vow-opt" + (x.id === occasion ? " on" : "")} onClick={() => setOccasion(x.id)}
                style={lang === "roman" ? null : { fontFamily: font }}>{vowOccName(x, lang)}</button>
            ))}
          </div>
          {o.weekday && (
            <div className="vow-opts vow-weekdays">
              {VARA.map((v, i) => (
                <button key={i} className={"vow-opt" + (i === weekday ? " on" : "")} onClick={() => setWeekday(i)}
                  style={lang === "roman" ? null : { fontFamily: font }}>
                  {lang === "telugu" ? v.tel : lang === "deva" ? v.deva : v.iast}
                </button>
              ))}
            </div>
          )}

          <label className="vow-label">{L.t("vowHowLong", lang)}</label>
          <div className="vow-opts">
            {W.TERMS.map(x => (
              <button key={x.id} className={"vow-opt" + (x.id === term ? " on" : "")} onClick={() => setTerm(x.id)}
                style={lang === "roman" ? null : { fontFamily: font }}>{vowTermName(x, lang)}</button>
            ))}
          </div>

          <div className="vow-preview">
            <div className="vow-label" style={{ marginTop: 0 }}>{L.t("firstDates", lang)}</div>
            {preview.length ? (
              <div className="vow-dates">{preview.map((d, i) => <span key={i}>{vowDateStr(d, lang)}</span>)}</div>
            ) : <p className="vows-empty" style={{ margin: 0 }}>{L.t("noDates", lang)}</p>}
          </div>

          {kind === "stotra" ? (
            <React.Fragment>
              <label className="vow-label">{L.t("vowJapaLabel", lang)}</label>
              <div className="vow-opts">
                <button className={"vow-opt" + (japaOn ? " on" : "")} onClick={() => setJapaOn(v => !v)}>{japaOn ? "✓" : "+"} {L.t("vowJapaLabel", lang)}</button>
                {japaOn && [27, 54, 108, 216].map(n => (
                  <button key={n} className={"vow-opt" + (n === japaCount ? " on" : "")} onClick={() => setJapaCount(n)}>{n} {L.t("vowJapaCount", lang)}</button>
                ))}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <label className="vow-label">{L.t("vowJapaCount", lang)}</label>
              <div className="vow-opts">
                {[27, 54, 108, 216, 1008].map(n => (
                  <button key={n} className={"vow-opt" + (n === japaCount ? " on" : "")} onClick={() => setJapaCount(n)}>{n}</button>
                ))}
              </div>
            </React.Fragment>
          )}

          <button className="vow-commit" disabled={!preview.length}
            onClick={() => {
              if (kind === "japa") {
                const ownId = own ? "own:" + STUTI_TRANSLIT.fold(own).replace(/\s+/g, "-") : null;
                W.add({ kind: "japa", deity: ownId || deity, label: own || undefined, occasion, weekday, term, japa: { count: japaCount } });
                STUTI_JAPA.setLast(ownId || deity);
              } else {
                W.add({ hymn, occasion, weekday, term, japa: japaOn ? { count: japaCount } : null });
                if (japaOn) STUTI_JAPA.setLast(hymn);
              }
              const N = STUTI_NUDGE;
              if (N && N.permission() === "default") N.ask();
              onClose();
            }}>
            <Icon name="flower" size={17} /> {L.t("commitVow", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

export { VowsCard, VowSheet };

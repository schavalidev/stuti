/* ============================================================
   STUTI — saṅkalpa scheduler (vows)
   VowsCard (Nitya tab: due today + upcoming) · VowSheet (builder)
   Dates come from the pañcāṅga engine at the reader's own place.
   ============================================================ */
const { useState: useStateV, useEffect: useEffectV } = React;

const vowOccName = (o, lang) => lang === "telugu" ? o.tel : lang === "deva" ? o.deva : o.name;
const vowTermName = (t, lang, v) => t.custom && v ? window.STUTI_L.t("vowNDays", lang).replace("{n}", v.days | 0) : lang === "telugu" ? t.tel : lang === "deva" ? t.deva : t.name;
/* tithi index 0–29 → "Śukla Caturthī", "Pūrṇimā", "Kṛṣṇa Aṣṭamī", "Amāvāsyā" */
function vowTithiName(i, lang) {
  const PA = window.AKSHARA_PANCHANGA, L = window.STUTI_L;
  if (i === 14) return L.t("tithiPurnima", lang);
  if (i === 29) return L.t("tithiAmavasya", lang);
  const t = PA.TITHI[i % 15], p = i < 15 ? L.t("pakshaShukla", lang) : L.t("pakshaKrishna", lang);
  return p + " " + (lang === "telugu" ? t.tel : lang === "deva" ? t.deva : t.iast);
}
const vowKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function vowDateStr(d, lang) {
  const V = window.AKSHARA_PANCHANGA.VARA[d.getDay()];
  const wd = lang === "telugu" ? V.tel : lang === "deva" ? V.deva : V.iast;
  return wd + " · " + d.getDate() + " " + d.toLocaleDateString("en", { month: "short" });
}

/* ---------------- Nitya tab card ---------------- */
function VowsCard({ go, lang = "deva" }) {
  const S = window.STUTI, L = window.STUTI_L, W = window.STUTI_VOWS;
  const [, force] = useStateV(0);
  const [open, setOpen] = useStateV(false);
  /* a saṅkalpa is a promise, so it does not come undone on one stray tap:
     the × arms, says so, and disarms itself if the hand moves on */
  const [armed, setArmed] = useStateV(null);
  useEffectV(() => W.subscribe(() => force(x => x + 1)), []);
  /* the moment someone commits is the moment to ask — a prompt raised on a
     settings screen they merely wandered into is the one that gets refused */
  const askPerm = () => { const N = window.STUTI_NUDGE; if (N && N.permission() === "default") N.ask(); };
  const vows = W.list();
  return (
    <React.Fragment>
      <div className="vows">
        <div className="vows-head">
          <h2 className="vows-title display" style={{ fontFamily: L.font(lang) }}>{L.t("vows", lang)}</h2>
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
              const inMala = isJ && !v.label && window.JAPA_THREADS.some(m => m.id === v.deity);
              const japaId = isJ ? v.deity : v.hymn;
              const due = W.isDue(v), kept = W.keptToday(v);
              const next = W.dates(v, 3).filter(x => x.toDateString() !== new Date().toDateString());
              const occLabel = o.weekday
                ? vowOccName(o, lang) + " · " + vowDateStr(new Date(Date.now() + ((7 + (v.weekday || 0) - new Date().getDay()) % 7) * 86400000), lang).split(" · ")[0]
                : o.tithi ? vowTithiName(v.tithi | 0, lang)
                : o.range && v.from && v.to ? vowDateStr(new Date(v.from + "T12:00:00"), lang).split(" · ")[1] + " – " + vowDateStr(new Date(v.to + "T12:00:00"), lang).split(" · ")[1]
                : vowOccName(o, lang);
              const termLabel = o.range ? L.t("vowNDays", lang).replace("{n}", W.spanDays(v) + 1) : vowTermName(t, lang, v);
              return (
                <div key={v.id} className={"vow" + (due ? " due" : "")} style={{ "--deity-hue": d ? d.hue : 36 }}>
                  <div className="vow-top">
                    <div className="vow-body">
                      <div className="vow-occ">{occLabel} · {termLabel}</div>
                      <button className="vow-hymn display" style={{ fontFamily: L.font(lang) }} disabled={isJ && !inMala}
                        onClick={() => { if (isJ) { if (!inMala) return; window.STUTI_JAPA.setLast(v.deity); go("japa"); } else go("reader", { deity: h.deity, hymn: h.id, from: "daily" }); }}>
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
                        <button className="vow-do" onClick={() => { window.STUTI_JAPA.setLast(v.deity); go("japa"); }}>
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
                    const js = window.STUTI_JAPA.state(japaId);
                    return (
                      <button className="vow-japa" onClick={() => { window.STUTI_JAPA.bump(japaId); window.STUTI_JAPA.setLast(japaId); force(x => x + 1); }}>
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
      {open && <window.OverlayPortal><VowSheet lang={lang} onClose={() => setOpen(false)} /></window.OverlayPortal>}
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
  const fold = window.STUTI_TRANSLIT.fold;
  const matches = showList
    ? options.filter(o => fold(o.label + " " + (o.sub || "")).includes(fold(q.trim()))).slice(0, 8)
    : [];
  return (
    <div className="ssel">
      <div className="ssel-field">
        <Icon name="search" size={16} />
        <input aria-label={ariaLabel} placeholder={placeholder || window.STUTI_L.t("searchHint", window.STUTI_L.ui())}
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
          )) : <div className="ssel-empty">{window.STUTI_L.t("noResults", window.STUTI_L.ui())}</div>}
        </div>
      )}
    </div>
  );
}

/* ---------------- The builder ---------------- */
function VowSheet({ lang = "deva", onClose }) {
  const S = window.STUTI, L = window.STUTI_L, W = window.STUTI_VOWS;
  const texts = S.hymns.filter(h => !h.catalog && h.verses && h.verses.length);
  const [kind, setKind] = useStateV("stotra");
  const [deity, setDeity] = useStateV("shiva");
  const [ownName, setOwnName] = useStateV("");
  const own = ownName.trim();
  const [hymn, setHymn] = useStateV(() => (window.STUTI_FAVS.list().find(id => S.hymnById(id)) || texts[0].id));
  const [occasion, setOccasion] = useStateV("pradosha");
  const [weekday, setWeekday] = useStateV(2);
  const [tithi, setTithi] = useStateV(3);
  const todayKey = vowKey(new Date());
  const [from, setFrom] = useStateV(todayKey);
  const [to, setTo] = useStateV(vowKey(new Date(Date.now() + 6 * 86400000)));
  const [term, setTerm] = useStateV("m3");
  const [days, setDays] = useStateV(11);
  const [japaOn, setJapaOn] = useStateV(false);
  const [japaCount, setJapaCount] = useStateV(108);
  const [ownCount, setOwnCount] = useStateV("");
  const o = W.occ(occasion);
  const count = ownCount.trim() ? Math.max(1, parseInt(ownCount, 10) || 0) : japaCount;
  const draft = { hymn, occasion, weekday, tithi, from, to, term, days, start: window.STUTI_THREAD.dkey() };
  const preview = W.dates(draft, 4);
  const font = L.font(lang);
  const VARA = window.AKSHARA_PANCHANGA.VARA;
  /* the "when" list, grouped: the marked days, then the mechanisms */
  const SPECIAL = W.OCCASIONS.filter(x => !x.weekday && !x.tithi && !x.range && x.id !== "daily");
  const scriptFont = lang === "roman" ? null : { fontFamily: font };
  return (
    <div className="nm-sheet vow-sheet">
      <div className="nm-head">
        <button className="icon-btn" onClick={onClose} aria-label={window.STUTI_L.a("aClose")}><Icon name="back" /></button>
        <div className="nm-title">
          <div className="nm-title-name display" style={{ fontFamily: font }}>{L.t("takeVow", lang)}</div>
          <div className="nm-title-sub">{L.t("vowSheetSub", lang)}</div>
        </div>
      </div>
      <div className="nm-list scroll">
        <div className="vow-form">
          <section className="vow-step">
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
              <SearchSelect value={hymn} onChange={(v) => setHymn(v || hymn)} font={font} ariaLabel={L.t("vowWhat", lang)} placeholder={L.t("searchHint", lang)}
                options={texts.map(h => ({ value: h.id, label: L.hymnTitle(h, lang), sub: L.name(S.deityById[h.deity], lang) + " \u00b7 " + L.versesCount(h.verses.length, lang) }))} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <label className="vow-label">{L.t("vowWhichDeity", lang)}</label>
              <div className="vow-opts">
                {window.JAPA_THREADS.map(m => {
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
          </section>
          <section className="vow-step">
          <label className="vow-label">{L.t("vowWhen", lang)}</label>
          <div className="vow-sub">{L.t("vowWhenSpecial", lang)}</div>
          <div className="vow-opts">
            {SPECIAL.map(x => (
              <button key={x.id} className={"vow-opt" + (x.id === occasion ? " on" : "")} onClick={() => setOccasion(x.id)} style={scriptFont}>{vowOccName(x, lang)}</button>
            ))}
          </div>
          <div className="vow-sub">{L.t("vowWhenOther", lang)}</div>
          <div className="vow-opts">
            {["daily", "tithi", "vara", "range"].map(id => { const x = W.occ(id); return (
              <button key={id} className={"vow-opt" + (id === occasion ? " on" : "")} onClick={() => setOccasion(id)} style={scriptFont}>{vowOccName(x, lang)}</button>
            ); })}
          </div>
          {o.tithi && (
            <div className="vow-nest vow-tithis">
              {[0, 15].map(base => (
                <div key={base} className="vow-paksha-grp">
                  <div className="vow-paksha" style={scriptFont}>{L.t(base ? "pakshaKrishna" : "pakshaShukla", lang)}</div>
                  <div className="vow-tithi-grid">
                    {Array.from({ length: 15 }, (_, i) => base + i).map(i => (
                      <button key={i} className={"vow-opt vow-opt-sm" + (i === tithi ? " on" : "")} onClick={() => setTithi(i)} style={scriptFont}>{vowTithiName(i, lang).replace(/^\S+\s/, "")}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {o.weekday && (
            <div className="vow-nest vow-opts vow-weekdays">
              {VARA.map((v, i) => (
                <button key={i} className={"vow-opt" + (i === weekday ? " on" : "")} onClick={() => setWeekday(i)} style={scriptFont}>
                  {lang === "telugu" ? v.tel : lang === "deva" ? v.deva : v.iast}
                </button>
              ))}
            </div>
          )}
          {o.range && (
            <div className="vow-nest vow-range">
              <label className="vow-date"><span>{L.t("vowFrom", lang)}</span><input type="date" value={from} min={todayKey} onChange={(e) => { const v = e.target.value; setFrom(v); if (v > to) setTo(v); }} /></label>
              <label className="vow-date"><span>{L.t("vowTo", lang)}</span><input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></label>
            </div>
          )}
          </section>

          {!o.range && (
            <section className="vow-step">
              <label className="vow-label">{L.t("vowHowLong", lang)}</label>
              <div className="vow-opts">
                {W.TERMS.map(x => (
                  <button key={x.id} className={"vow-opt" + (x.id === term ? " on" : "")} onClick={() => setTerm(x.id)} style={scriptFont}>{x.custom ? L.t("vowSomeDays", lang) : vowTermName(x, lang)}</button>
                ))}
              </div>
              {W.term(term).custom && (
                <div className="vow-opts">
                  {[3, 5, 9, 11, 21, 41, 48].map(n => (
                    <button key={n} className={"vow-opt vow-opt-sm" + (n === days ? " on" : "")} onClick={() => setDays(n)}>{n}</button>
                  ))}
                  <input className="vow-num" type="number" inputMode="numeric" min="1" max="999" aria-label={L.t("vowOwnDays", lang)} placeholder={L.t("vowOwnDays", lang)}
                    value={[3, 5, 9, 11, 21, 41, 48].includes(days) ? "" : days} onChange={(e) => setDays(Math.max(1, parseInt(e.target.value, 10) || 1))} />
                </div>
              )}
            </section>
          )}

          <section className="vow-step">
          {kind === "stotra" ? (
            <React.Fragment>
              <label className="vow-label">{L.t("vowJapaLabel", lang)}</label>
              <div className="vow-opts">
                <button className={"vow-opt" + (japaOn ? " on" : "")} onClick={() => setJapaOn(v => !v)}>{japaOn ? "✓" : "+"} {L.t("vowJapaLabel", lang)}</button>
                {japaOn && [27, 54, 108, 216].map(n => (
                  <button key={n} className={"vow-opt" + (n === japaCount && !ownCount.trim() ? " on" : "")} onClick={() => { setJapaCount(n); setOwnCount(""); }}>{n} {L.t("vowJapaCount", lang)}</button>
                ))}
                {japaOn && <input className="vow-num" type="number" inputMode="numeric" min="1" aria-label={L.t("vowOwnCount", lang)} placeholder={L.t("vowOwnCount", lang)} value={ownCount} onChange={(e) => setOwnCount(e.target.value)} />}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <label className="vow-label">{L.t("vowJapaCount", lang)}</label>
              <div className="vow-opts">
                {[27, 54, 108, 216, 1008].map(n => (
                  <button key={n} className={"vow-opt" + (n === japaCount && !ownCount.trim() ? " on" : "")} onClick={() => { setJapaCount(n); setOwnCount(""); }}>{n}</button>
                ))}
                <input className="vow-num" type="number" inputMode="numeric" min="1" aria-label={L.t("vowOwnCount", lang)} placeholder={L.t("vowOwnCount", lang)} value={ownCount} onChange={(e) => setOwnCount(e.target.value)} />
              </div>
            </React.Fragment>
          )}
          </section>

          <div className="vow-preview">
            <div className="vow-label" style={{ marginTop: 0 }}>{L.t("firstDates", lang)}</div>
            {preview.length ? (
              <div className="vow-dates">{preview.map((d, i) => <span key={i}>{vowDateStr(d, lang)}</span>)}</div>
            ) : <p className="vows-empty" style={{ margin: 0 }}>{L.t("noDates", lang)}</p>}
          </div>

          <button className="vow-commit" disabled={!preview.length}
            onClick={() => {
              const extra = { occasion, weekday, tithi, term, days };
              if (o.range) { extra.from = from; extra.to = to; }
              if (kind === "japa") {
                const ownId = own ? "own:" + window.STUTI_TRANSLIT.fold(own).replace(/\s+/g, "-") : null;
                W.add(Object.assign({ kind: "japa", deity: ownId || deity, label: own || undefined, japa: { count } }, extra));
                window.STUTI_JAPA.setLast(ownId || deity);
              } else {
                W.add(Object.assign({ hymn, japa: japaOn ? { count } : null }, extra));
                if (japaOn) window.STUTI_JAPA.setLast(hymn);
              }
              const N = window.STUTI_NUDGE;
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

Object.assign(window, { VowsCard, VowSheet });

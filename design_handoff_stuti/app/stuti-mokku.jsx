/* ============================================================
   STUTI — mokkulu on Nitya
   MokkuTracker (the lens: what is owed, what has been kept)
   · MokkuRow · MokkuSheet (the builder).
   A mokku has no page in the library — it is the reciter's own word,
   so the whole of it lives here: the deity, the promise, the wish it
   was made against, and the day it is taken or kept.
   ============================================================ */
const { useState: useStateMk, useEffect: useEffectMk } = React;

function useMokku() { const [, f] = useStateMk(0); useEffectMk(() => window.STUTI_MOKKU.subscribe(() => f((x) => x + 1)), []); return window.STUTI_MOKKU; }
function mkDate(key, lang) {
  if (!key) return "";
  return new Date(key + "T12:00:00").toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ---------------- a row ---------------- */
function MokkuRow({ m, lang, M }) {
  const S = window.STUTI, L = window.STUTI_L;
  const [armed, setArmed] = useStateMk(false);
  const font = L.font(lang);
  const d = m.deityId ? S.deityById[m.deityId] : null;
  const name = d ? L.name(d, lang) : m.deityName;
  const done = !!m.fulfilled;
  const arm = (fn) => { if (armed) { fn(); setArmed(false); return; } setArmed(true); setTimeout(() => setArmed(false), 4000); };
  const occ = name + (done ? " · " + L.t("mkFulfilled", lang) : "");
  return (
    <article className={"vow mk-row" + (done ? " kept" : "")} style={{ "--deity-hue": d ? d.hue : 36 }}>
      <div className="vow-top">
        {d ? <Seal d={d} size={36} style={{ fontSize: 13 }} />
           : <span className="mk-glyph"><Icon name="vayanam" size={21} /></span>}
        <div className="vow-body">
          <div className="vow-occ" style={{ fontFamily: font }}>{occ}</div>
          <div className="mk-pledge" style={{ fontFamily: font }}>{m.pledge}</div>
          {m.wish && <div className="mk-wish" style={{ fontFamily: font }}>{L.t("mkWishLine", lang).replace("{w}", m.wish)}</div>}
          <div className="vow-next">
            {done ? L.t("mkFulfilledOn", lang).replace("{d}", mkDate(m.fulfilled, lang))
                  : L.t("mkMadeOn", lang).replace("{d}", mkDate(m.made, lang))}
            {!done && m.by && <span className="mk-by"> · {L.t("mkByWhen", lang).replace("{d}", mkDate(m.by, lang))}</span>}
          </div>
        </div>
        <div className="vow-tools">
          <button className={"vow-x" + (armed ? " arm" : "")} aria-label={L.t("removePlan", lang)}
            onClick={() => arm(() => M.remove(m.id))}>{armed ? L.t("removePlan", lang) : "×"}</button>
        </div>
      </div>
      <div className="vow-actions keep-actions">
        {done ? (
          <button className="vow-x mk-reopen" onClick={() => M.reopen(m.id)}><Icon name="repeat" size={14} /> {L.t("mkReopen", lang)}</button>
        ) : (
          <button className="vow-keep" onClick={() => { M.fulfill(m.id); if (window.stutiToast) window.stutiToast(L.t("mkKeptToast", lang)); }}>
            <Icon name="check" size={16} /> {L.t("mkMarkDone", lang)}
          </button>
        )}
      </div>
    </article>
  );
}

/* ---------------- the lens ---------------- */
function MokkuTracker({ go, lang = "telugu" }) {
  const M = useMokku(), L = window.STUTI_L;
  const font = L.font(lang);
  const [open, setOpen] = useStateMk(false);
  const [showKept, setShowKept] = useStateMk(false);
  const all = M.list();
  const pending = all.filter((m) => !m.fulfilled);
  const kept = all.filter((m) => m.fulfilled);
  return (
    <div className="vows keep mk">
      <div className="vows-head">
        <div>
          <div className="eyebrow">{L.t("mkEyebrow", lang)}</div>
          <div className="vows-title display" style={{ fontFamily: font }}>{L.t("mkTitle", lang)}</div>
        </div>
        <button className="vows-add" onClick={() => setOpen(true)}>+ {L.t("mkAdd", lang)}</button>
      </div>

      {all.length === 0 ? (
        <React.Fragment>
          <p className="vows-empty">{L.t("mkEmpty", lang)}</p>
          <button className="vow-do nt-find" onClick={() => setOpen(true)}><Icon name="vayanam" size={16} /> {L.t("mkAdd", lang)}</button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {pending.length > 0 && (
            <div className="vows-list">
              {pending.map((m) => <MokkuRow key={m.id} m={m} lang={lang} M={M} />)}
            </div>
          )}
          {pending.length === 0 && <p className="vows-empty">{L.t("mkAllKept", lang)}</p>}
          {kept.length > 0 && (
            <div className="mk-kept-wrap">
              <button className={"mk-kept-head" + (showKept ? " open" : "")} onClick={() => setShowKept((o) => !o)} aria-expanded={showKept}>
                <span>{L.t("mkDone", lang)} · {kept.length}</span>
                <Icon name="chev" size={17} />
              </button>
              {showKept && <div className="vows-list">{kept.map((m) => <MokkuRow key={m.id} m={m} lang={lang} M={M} />)}</div>}
            </div>
          )}
        </React.Fragment>
      )}

      {open && <window.OverlayPortal><MokkuSheet lang={lang} onClose={() => setOpen(false)} /></window.OverlayPortal>}
    </div>
  );
}

/* ---------------- the builder ---------------- */
function MokkuSheet({ lang = "telugu", onClose }) {
  const S = window.STUTI, L = window.STUTI_L, M = window.STUTI_MOKKU;
  const font = L.font(lang);
  const [deityId, setDeityId] = useStateMk("");
  const [ownDeity, setOwnDeity] = useStateMk("");
  const [pledge, setPledge] = useStateMk("");
  const [wish, setWish] = useStateMk("");
  const [byOn, setByOn] = useStateMk(false);
  const todayKey = (() => { try { return window.STUTI_THREAD.dkey(); } catch (e) { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); } })();
  const [by, setBy] = useStateMk(todayKey);
  const own = ownDeity.trim();
  const ready = (!!deityId || !!own) && pledge.trim().length > 0;
  const commit = () => {
    if (!ready) return;
    M.add({
      deityId: deityId || null,
      deityName: deityId ? "" : own,
      pledge: pledge.trim(),
      wish: wish.trim() || undefined,
      by: byOn ? by : undefined,
    });
    if (window.stutiToast) window.stutiToast(L.t("mkAddedToast", lang));
    onClose();
  };
  return (
    <div className="nm-sheet vow-sheet">
      <div className="nm-head">
        <button className="icon-btn" onClick={onClose} aria-label={L.a("aClose")}><Icon name="back" /></button>
        <div className="nm-title">
          <div className="nm-title-name display" style={{ fontFamily: font }}>{L.t("mkSheetTitle", lang)}</div>
          <div className="nm-title-sub">{L.t("mkSheetSub", lang)}</div>
        </div>
      </div>
      <div className="nm-list scroll">
        <div className="vow-form">

          <section className="vow-step">
            <label className="vow-label">{L.t("mkDeityLabel", lang)}</label>
            <div className="vow-opts">
              {JAPA_THREADS.map((m) => {
                const dd = S.deityById[m.deity];
                return (
                  <button key={m.id} className={"vow-opt" + (!own && m.deity === deityId ? " on" : "")}
                    onClick={() => { setDeityId(m.deity); setOwnDeity(""); }}
                    style={lang === "roman" ? null : { fontFamily: font }}>{L.name(dd, lang)}</button>
                );
              })}
            </div>
            <div className="ssel" style={{ marginTop: 9 }}>
              <div className="ssel-field">
                <Icon name="flower" size={16} />
                <input aria-label={L.t("mkDeityOwn", lang)} placeholder={L.t("mkDeityOwn", lang)}
                  style={{ fontFamily: font }} value={ownDeity}
                  onChange={(e) => { setOwnDeity(e.target.value); if (e.target.value.trim()) setDeityId(""); }} />
              </div>
            </div>
          </section>

          <section className="vow-step">
            <label className="vow-label">{L.t("mkPledgeLabel", lang)}</label>
            <textarea className="mk-text" rows={2} aria-label={L.t("mkPledgeLabel", lang)} placeholder={L.t("mkPledgePlace", lang)}
              style={{ fontFamily: font }} value={pledge} onChange={(e) => setPledge(e.target.value)} />
          </section>

          <section className="vow-step">
            <label className="vow-label">{L.t("mkWishLabel", lang)}</label>
            <input className="mk-text mk-line" aria-label={L.t("mkWishLabel", lang)} placeholder={L.t("mkWishPlace", lang)}
              style={{ fontFamily: font }} value={wish} onChange={(e) => setWish(e.target.value)} />
          </section>

          <section className="vow-step">
            <label className="vow-label">{L.t("mkWhenLabel", lang)}</label>
            <div className="vow-opts">
              <button className={"vow-opt" + (byOn ? " on" : "")} onClick={() => setByOn((v) => !v)}>{byOn ? "✓" : "+"} {L.t("mkWhenSet", lang)}</button>
            </div>
            {byOn && (
              <div className="vow-nest vow-range" style={{ marginTop: 12 }}>
                <label className="vow-date"><span>{L.t("mkByBefore", lang)}</span>
                  <window.HouseDate value={by} lang={lang} min={todayKey} onChange={(v) => v && setBy(v)} />
                </label>
              </div>
            )}
          </section>

          <button className="vow-commit" disabled={!ready} onClick={commit}>
            <Icon name="vayanam" size={17} /> {L.t("mkCommit", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MokkuTracker, MokkuRow, MokkuSheet });

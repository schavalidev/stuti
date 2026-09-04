/* ============================================================
   STUTI — the Pārāyaṇa lens

   Replaces the author lens. Attribution is a cataloguer's axis: it
   answers "what else did Śaṅkara write", which is a question about
   the library rather than about the reciting, and every entry
   already carries its author on the face of it. A pārāyaṇa is the
   question a reciter actually arrives with — I have a fortnight and
   a difficulty, what can I undertake and how is it cut into days.

   Layout is the vrata guide's, as the nomu guide is, so the three
   read as chapters of one book and the stylesheet gains nothing.
   ============================================================ */
const parP = (o, lang) => (!o ? "" : lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.tel || o.roman) : o.roman);
const parFont = (lang) => window.STUTI_L.font(lang);

function ParayanaRow({ p, lang, onOpen, no }) {
  const font = parFont(lang);
  return (
    <div className="gs-en">
      <button className="gs-main" onClick={() => onOpen(p.id)}>
        <span className="gs-no" style={{ fontFamily: font }}>{String(no)}</span>
        <span className="gs-ti"><span className="gs-d" style={{ fontFamily: font }}>{parP(p.name, lang)}</span></span>
        <span className="gs-dl" />
        <span className="gs-vc">{parP(p.span, lang)}</span>
      </button>
    </div>
  );
}

function ParayanaLens({ go, lang, onOpen }) {
  const L = window.STUTI_L, P = window.STUTI_PARAYANA;
  const [whatOpen, setWhatOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const fold = (s) => (window.STUTI_TRANSLIT ? window.STUTI_TRANSLIT.fold(s) : String(s).toLowerCase());
  const qf = fold(q).trim();
  const hits = qf ? P.list.filter((p) => fold([p.name.roman, p.name.deva, p.name.tel, parP(p.source, lang) || "", parP(p.span, lang) || ""].join(" ")).indexOf(qf) !== -1) : null;
  return (
    <div className="lens-pad">
      <div className="nomu-lens-head">
        <div className="gs-wm gs-wm-nomu gs-wm-parva gs-wm-grantha">
          <img className="emblem-img emblem-img--day" src="emblems/grantha-inkday.png" alt="" draggable="false" />
          <img className="emblem-img emblem-img--night" src="emblems/grantha-inknight.png" alt="" draggable="false" />
        </div>
        <div className="vr-find vr-find-compact vr-find-side">
          <div className="search-field search-field-sm">
            <Icon name="search" size={17} />
            <input className="search-input" type="search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={L.t("parayanaSearchPh", lang)} aria-label={L.t("parayanaSearchPh", lang)} style={{ fontFamily: parFont(lang) }} />
            <window.VoiceButton lang={lang} size={17} onInterim={setQ} onResult={setQ} />
            {q && <button className="icon-btn vr-find-x" onClick={() => setQ("")} aria-label={L.t("startOver", lang)}><Icon name="close" size={17} /></button>}
          </div>
          <button type="button" className={"vr-q-btn" + (whatOpen ? " is-open" : "")} onClick={() => setWhatOpen((v) => !v)} aria-expanded={whatOpen} aria-label={L.t("parayanaWhat", lang)}>?</button>
        </div>
      </div>
      {whatOpen && <div className="vr-brief vr-brief-tight">{L.t("parayanaWhat", lang)}</div>}
      <div className="gs-ix">
        <div className="gs-sec">{hits ? (hits.length ? L.t("vrataFound", lang).replace("{n}", hits.length) : L.t("parayanaNoMatch", lang)) : L.t("parayanaUndertake", lang)}</div>
        {(hits || P.list).map((p, i) => <ParayanaRow key={p.id} p={p} lang={lang} onOpen={onOpen} no={i + 1} />)}
      </div>
      <div className="vr-caveat">{L.t("parayanaCaveat", lang)}</div>
      <div style={{ height: 32 }} />
    </div>
  );
}

function ParayanaDetail({ parayanaId, go, lang, onBack }) {
  const S = window.STUTI, L = window.STUTI_L, P = window.STUTI_PARAYANA;
  const p = P.get(parayanaId);
  if (!p) return null;
  const d = S.deityById[p.deity];
  const font = parFont(lang);

  return (
    <div className="view libhub scroll" style={deityStyle(d, { flex: 1 })}>
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label={window.STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div style={{ width: 50 }} />
      </div>
      <div className="lens-pad">
        <header className="vr-hero">
          <div className="deity-hero-row">
            <div className="deity-hero-text">
              <h1 className="deity-hero-name display" style={{ fontFamily: font }}>{parP(p.name, lang)}</h1>
              <div className="deity-hero-epithet">{parP(p.source, lang)}</div>
            </div>
          </div>
          <p className="deity-hero-line">{parP(p.tagline, lang)}</p>
          <div className="vr-meta">
            <span>{parP(p.span, lang)}</span>
          </div>
        </header>

        {p.gist && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("significance", lang)}</div>
            {p.gist.map((g, i) => <p key={i} className="vr-para">{parP(g, lang)}</p>)}
          </div>
        )}

        {p.schedules && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("parayanaSchedule", lang)}</div>
            <div className="vr-naiv">
              {p.schedules.map((s, i) => (
                <div key={i} className="vr-naiv-row">
                  <span className="vr-naiv-item">{parP(s.span, lang)}</span>
                  <span className="vr-naiv-note">{parP(s.how, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {p.when && (
          <div className="vr-sect">
            <div className="eyebrow">{L.t("parayanaWhen", lang)}</div>
            <p className="vr-para">{parP(p.when, lang)}</p>
          </div>
        )}

        <div className="vr-sect">
          <div className="eyebrow">{L.t("parayanaNiyama", lang)}</div>
          <ol className="vr-vidhi">
            {P.niyama.map((n, i) => (
              <li key={i}>
                <span className="vr-vidhi-n">{i + 1}</span>
                <span className="vr-vidhi-body">
                  <span className="vr-vidhi-detail">{parP(n, lang)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="vr-sect">
          <div className="eyebrow">{L.t("toRecite", lang)}</div>
          <window.DeityLink d={d} go={go} lang={lang} />
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

Object.assign(window, { ParayanaLens, ParayanaDetail });

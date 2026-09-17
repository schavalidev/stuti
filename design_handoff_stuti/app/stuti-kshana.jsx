/* ============================================================
   STUTI — the kṣaṇa card
   One card, two feeders. A grahaṇa and a saṅkrānti are the only
   two entries in the almanac that are instants rather than days,
   and both need the same drawing: a line of time, the moment
   marked on it, the window the rite is kept in shaded under it,
   and — the part a table cannot give — whether any of it stands
   above this horizon. STUTI_KSHANA normalises the two into one
   shape; nothing below knows which it is holding.
   ============================================================ */
const { useMemo: useKsM } = React;

const kPick = (o, lang) => window.STUTI_KSHANA.pick(o, lang);
const kFont = (lang) => lang === "telugu" ? "var(--font-telugu)" : lang === "roman" ? "var(--font-display)" : "var(--font-deva)";
/* an hour on a day that is not the day the card is about — an eclipse can
   straddle midnight, and a saṅkrānti's crossing routinely belongs to the
   evening before the morning that keeps it. A bare + or − told the reader
   nothing, so the day is named. */
const kTime = (min, lang) => {
  const P = window.AKSHARA_PANCHANGA, T = window.STUTI_KSHANA.T;
  const s = P.fmtTime(((min % 1440) + 1440) % 1440);
  if (min < 0) return s + " · " + kPick(T.yesterday, lang);
  if (min >= 1440) return s + " · " + kPick(T.tomorrow, lang);
  return s;
};

/* the line of time. The extent is the event and its kept window plus a
   margin — and nothing else, so a two-minute annular and a five-hour
   penumbral each fill the width they are given. The sūtaka deliberately
   stays out of it: twelve hours of fast against seventy minutes of eclipse
   would push the whole event into the last tenth of the track, which is
   exactly the scale this line exists to avoid. It is stated as an hour of
   its own in the facts below instead.

   The marks of a short eclipse land within a few per cent of each other, so
   a tick takes the first row whose own last neighbour is far enough away,
   adding rows as the crowd demands — a total eclipse emits five contacts,
   three of them minutes apart, and one spare row is not enough for them. */
function KshanaLine({ k, lang }) {
  const model = useKsM(() => {
    const xs = k.marks.map((m) => m.min);
    if (k.band) xs.push(k.band.start, k.band.end);
    const lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs);
    const pad = Math.max((hi - lo) * 0.12, 12);
    const ext = { lo: lo - pad, hi: hi + pad };
    const span = ext.hi - ext.lo || 1;
    const at = (m) => ((m - ext.lo) / span) * 100;
    /* 22% of the width is about as close as two of these ticks can sit */
    const MINGAP = 22;
    const ticks = k.marks.slice().sort((a, b) => a.min - b.min).map((m) => ({ m, x: at(m.min) }));
    const lastByRow = [];
    ticks.forEach((t) => {
      let r = 0;
      while (lastByRow[r] != null && t.x - lastByRow[r] < MINGAP) r++;
      t.row = r;
      lastByRow[r] = t.x;
    });
    return { at, ticks, rows: lastByRow.length };
  }, [k]);
  const { at, ticks, rows } = model;
  const seg = (w) => ({ left: at(w.start) + "%", width: Math.max(at(w.end) - at(w.start), 0.6) + "%" });
  const ROW = 44;
  return (
    <div className="ksh-line">
      <div className="ksh-track">
        {k.band && <div className={"ksh-band" + (k.kind === "sankranti" ? " is-punya" : "")} style={seg(k.band)} />}
        {k.inner && <div className="ksh-band is-inner" style={seg(k.inner)} />}
        {k.marks.map((m) => (
          <div key={m.key} className={"ksh-mark" + (m.key === "madhya" || m.key === "sankramana" ? " is-peak" : "")} style={{ left: at(m.min) + "%" }} />
        ))}
      </div>
      <div className="ksh-ticks" style={{ height: rows * ROW }}>
        {ticks.map(({ m, x, row }) => {
          /* a mark near either end carries a label wider than the room left
             beside it — a crossing the evening before reads "9:05 pm ·
             yesterday" and centring that on 3% of the track puts half of it
             off the card. The end ticks hang inward instead. */
          const edge = x < 16 ? "start" : x > 84 ? "end" : null;
          return (
          <div key={m.key} className={"ksh-tick" + (edge ? " is-" + edge : "")} style={{ left: x + "%", top: row * ROW }}>
            {row > 0 && <span className="ksh-lead" style={{ top: -(row * ROW), height: row * ROW }} />}
            <span className="ksh-tick-t">{kTime(m.min, lang)}</span>
            <span className="ksh-tick-l" style={{ fontFamily: kFont(lang) }}>{kPick(m.label, lang)}</span>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function KshanaCard({ k, date, lang = "deva", onClose }) {
  const L = window.STUTI_L, KS = window.STUTI_KSHANA;
  if (!k) return null;
  const font = kFont(lang);
  /* the type words are stored lowercase for use mid-sentence; at the head of
     a title the roman form takes a capital (Telugu and Devanāgarī have none) */
  const rawTitle = [k.type ? kPick(k.type, lang) : null, kPick(k.name, lang)].filter(Boolean).join(" ");
  const title = lang === "roman" ? rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1) : rawTitle;
  const dateStr = date ? date.toLocaleDateString(lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN",
    { weekday: "long", day: "numeric", month: "long" }) : "";
  return (
    <window.OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet" role="dialog" aria-label={kPick(k.cap, lang)}>
          <div className="pd-grip" />
          <button className="pd-x" onClick={onClose} aria-label={L.t("close", lang)}><window.Icon name="close" size={18} /></button>
          <div className="rm-head">
            <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{kPick(k.cap, lang)}</div>
            <div className="rm-head-title display" style={{ fontFamily: font }}>{title}</div>
            <div className="rm-head-sub">{dateStr}</div>
          </div>
          <div className="pd-body scroll">
            <div className="pit-badges">
              {k.local && <span className={"pit-badge " + (k.visible && k.reckoned !== false ? "is-core" : "is-flag")}>
                {kPick(!k.visible ? KS.T.unseen : k.reckoned === false ? KS.T.notReckoned : KS.T.seenHere, lang)}
              </span>}
              {k.metric && <span className="pit-badge is-advanced">{kPick(k.metric.label, lang)} · {typeof k.metric.value === "string" ? k.metric.value : kPick(k.metric.value, lang)}</span>}
            </div>

            <KshanaLine k={k} lang={lang} />

            <div className="pit-facts">
              {k.kept && (
                <div className="pit-fact">
                  <span style={{ fontFamily: font }}>{kPick(k.kind === "sankranti" ? KS.T.punyakala : KS.T.keptSpan, lang)}</span>
                  <b>{kTime(k.kept.start, lang)} – {kTime(k.kept.end, lang)}</b>
                </div>
              )}
              {k.sutaka && (
                <div className="pit-fact">
                  <span style={{ fontFamily: font }}>{kPick(KS.T.sutaka, lang)}</span>
                  <b>{kTime(k.sutaka.start, lang)} – {kTime(k.sutaka.end, lang)}</b>
                </div>
              )}
              {k.marks.map((m) => (
                <div className="pit-fact" key={"f" + m.key}>
                  <span style={{ fontFamily: font }}>{kPick(m.label, lang)}</span>
                  <b>{kTime(m.min, lang)}</b>
                </div>
              ))}
            </div>

            {k.caveat && <p className="ksh-caveat">{kPick(k.caveat, lang)}</p>}

            {k.visible && k.rules && k.rules.length > 0 && (
              <ul className="ksh-rules">
                {k.rules.map((r, i) => <li key={i}>{kPick(r, lang)}</li>)}
              </ul>
            )}

            {k.note && <p className="pit-rule">{kPick(k.note, lang)}</p>}

            {k.sources && k.sources.length > 0 && (
              <div className="pit-src">
                <div className="eyebrow">{kPick(KS.T.sources, lang)}</div>
                {k.sources.map((s, i) => s.url
                  ? <a key={i} href={s.url} target="_blank" rel="noreferrer noopener" className="pit-src-row"><span>{s.label}</span><window.Icon name="chev" size={14} /></a>
                  : <div key={i} className="pit-src-row is-plain"><span>{s.label}</span></div>)}
              </div>
            )}
            <div style={{ height: 24 }} />
          </div>
        </div>
      </div>
    </window.OverlayPortal>
  );
}

Object.assign(window, { KshanaCard, KshanaLine, kPick, kTime });

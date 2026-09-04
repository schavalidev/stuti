/* ============================================================
   STUTI — the sky, and the juncture standing in it
   Home opens onto the hour. The header is not decoration: the
   gradient is the light outside, the disc sits where the sun (or the
   moon, with its real phase) actually is, and the plate beneath names
   the sandhyā juncture the sun's position defines. A header that
   showed dawn at two in the afternoon would be a lie, and this app is
   too literal to afford one.

   The plate is read-only, and that is the whole design. A reciter who
   has kept sandhyāvandanam for forty years does not need to be told it
   is open, and will not put down the arghya to tap a phone — logging
   ācamana would break the very attention the rite is made of. So the
   app's job ends at the hour: when the juncture stands, when the next
   one arrives. Nothing to mark, nothing owed, no reproach for a kāla
   that has passed. Sandhyā appears nowhere in what today asks and
   never in the lapse list; it is time, not obligation.
   ============================================================ */
const { useState: useSkS, useEffect: useSkE } = React;

/* the light outside, in six named states. aruṇodaya (4 ghaṭikās before
   sunrise) opens the dawn, which is also where prātaḥ sandhyā opens — the
   sky and the juncture agree because they are the same fact. */
function skyPhase(m, sr, ss) {
  if (sr == null || ss == null) return "night";
  const dawn = sr - 96, dusk = ss + 72, day = ss - sr;
  if (m >= dawn && m < sr) return "dawn";
  if (m >= sr && m < sr + day * 0.28) return "morning";
  if (m >= sr + day * 0.28 && m < sr + day * 0.66) return "midday";
  if (m >= sr + day * 0.66 && m <= ss) return "afternoon";
  if (m > ss && m < dusk) return "dusk";
  return "night";
}

function SkyHeader({ lang = "deva", greeting, go }) {
  const L = window.STUTI_L, SY = window.STUTI_SANDHYA, P = window.AKSHARA_PANCHANGA;
  const { loc } = window.useLoc();
  const [confirmNote, setConfirmNote] = useSkS(null);
  const [, tick] = useSkS(0);
  /* the sun moves, so the header moves — a minute is finer than anyone can
     see, but it keeps the disc honest without a second thought */
  useSkE(() => { const t = setInterval(() => tick((n) => n + 1), 60000); return () => clearInterval(t); }, []);
  if (!P || !SY) return null;

  const now = new Date();
  let pa = null, m = 0;
  try { pa = P.forDay(now, loc, { instant: true }); m = SY.nowMin(loc, now); } catch (e) { return null; }
  const sr = pa ? pa.sunrise : null, ss = pa ? pa.sunset : null;
  const phase = skyPhase(m, sr, ss);
  const night = phase === "night";

  /* where the disc sits. t runs 0 at sunrise to 1 at sunset, and a little
     past either end through the twilights so the sun is genuinely below the
     horizon while the sky is still lit. */
  let t = 0.5;
  if (sr != null && ss != null) {
    if (phase === "dawn") t = -0.055 * (1 - (m - (sr - 96)) / 96);
    else if (phase === "dusk") t = 1 + 0.055 * ((m - ss) / 72);
    else if (!night) t = Math.max(0, Math.min(1, (m - sr) / (ss - sr)));
    else {
      /* through the night the moon crosses the same arc — from the end of
         dusk to the start of dawn, wrapping midnight */
      const from = ss + 72, to = sr - 96 + 1440, mm = m < sr ? m + 1440 : m;
      t = Math.max(0.04, Math.min(0.96, (mm - from) / Math.max(1, to - from)));
    }
  }
  const lift = Math.sin(Math.PI * Math.max(-0.08, Math.min(1.08, t)));
  /* the disc's centre above the horizon, floored so that at the twilights — when
     the sun is genuinely below it — a crown still shows at the plate's edge.
     Physically it has not risen; a header that went blank for the whole of dawn
     would say nothing at all, and dawn is the hour the header exists for. */
  const discY = Math.max(lift * 64, -8) - 18;

  const st = SY.state(now, loc, pa, m);
  const ahead = st.next ? { kala: st.next, at: st.minsTo } : (() => {
    try { const u = SY.upcoming(loc, null, 0, now)[0]; return u ? { kala: u.kala, at: Math.round((u.at - now) / 60000) } : null; }
    catch (e) { return null; }
  })();
  const nm = (o) => SY.name(o, lang);
  const clock = (x) => P.fmtTime(((x % 1440) + 1440) % 1440);
  /* the bell is a switch, not a send: tapping it turns the sandhyā nudges on
     and says so; tapping again turns them off and says that. It used to only
     ever switch on, so a second tap looked like it had done nothing. */
  const font = window.syFont ? window.syFont(lang) : "var(--font-deva)";
  const titleFont = lang === "deva" ? "var(--font-deva-serif)"
    : lang === "telugu" ? "var(--font-telugu)" : font;
  const bellOn = (() => {
    const PR = window.STUTI_PREFS;
    if (!PR || !SY.ORDER) return false;
    const cur = (PR.get().remind || {}).sandhya || {};
    return SY.ORDER.some((id) => cur[id]);
  })();
  /* the bell opens a small sheet rather than flipping all three at once: which
     sandhyā to be told about, and how many minutes before it opens */
  const [bellOpen, setBellOpen] = React.useState(false);
  const remind = (() => { const PR = window.STUTI_PREFS; return PR ? (PR.get().remind || {}) : {}; })();
  const sandhyaOn = remind.sandhya || {};
  const lead = remind.lead || 0;
  const LEADS = [0, 5, 10, 15, 30];
  const askPermission = () => {
    const N = window.STUTI_NUDGE;
    if (!N || !N.supported()) { setConfirmNote("Notifications aren't supported in this browser."); return; }
    if (N.permission() === "granted") return;
    N.ask().then((p) => { if (p !== "granted") setConfirmNote("Notifications are blocked — allow them for this site to get sandhyā nudges."); });
  };
  const setSandhya = (id, on) => {
    const PR = window.STUTI_PREFS; if (!PR) return;
    PR.setRemind({ sandhya: Object.assign({}, sandhyaOn, { [id]: on }) });
    if (on) askPermission();
    tick((n) => n + 1);
  };
  const setLead = (mins) => {
    const PR = window.STUTI_PREFS; if (!PR) return;
    PR.setRemind({ lead: mins });
    tick((n) => n + 1);
  };
  const toggleSandhyaNotifs = (e) => { e.stopPropagation(); setConfirmNote(null); setBellOpen((o) => !o); };
  const closeBell = () => {
    setBellOpen(false);
    const n = SY.ORDER.filter((id) => sandhyaOn[id]).length;
    setConfirmNote(n === 0 ? "No sandhyā reminders are set."
      : lead ? `You'll be nudged ${lead} min before ${n === 3 ? "each sandhyā" : n === 1 ? "the chosen sandhyā" : "the chosen sandhyās"} while Stuti is open.`
      : `You'll be nudged as ${n === 3 ? "each sandhyā" : n === 1 ? "the chosen sandhyā" : "each chosen sandhyā"} opens, while Stuti is open.`);
  };
  const bellSheet = bellOpen && (
    <div className="sky-bell-sheet" onClick={(e) => e.stopPropagation()}>
      <div className="sky-bell-cap">Remind me at</div>
      <div className="sky-bell-rows">
        {SY.ORDER.map((id) => (
          <label key={id} className="sky-bell-row">
            <span style={{ fontFamily: titleFont }}>{nm(SY.LABEL[id])}</span>
            <button type="button" role="switch" aria-checked={!!sandhyaOn[id]} className={"sky-bell-sw" + (sandhyaOn[id] ? " on" : "")} onClick={() => setSandhya(id, !sandhyaOn[id])}><i /></button>
          </label>
        ))}
      </div>
      <div className="sky-bell-cap">Minutes in advance</div>
      <div className="sky-bell-leads">
        {LEADS.map((v) => <button key={v} type="button" aria-pressed={lead === v} className={"sky-bell-lead" + (lead === v ? " on" : "")} onClick={() => setLead(v)}>{v === 0 ? "At start" : v}</button>)}
      </div>
      <button type="button" className="sky-bell-done" onClick={closeBell}>Done</button>
    </div>
  );
  /* the sandhyā's name is the plate's title and is set in the manuscript serif,
     the same face the limb names beneath it use — declared here rather than in
     the stylesheet because the greeting beside it sets its family inline too,
     and an inline family cannot be overridden from a rule */

  /* the window as a bar. Not a progress fill — a single fill edge plus a
     "now" tick read as a playhead that has drifted from its bar. Instead the
     track is a map: the three graded bands drawn at their true places in
     fading gold, and the tick standing wherever the hour stands. */
  const bar = (k) => {
    const span = Math.max(1, k.end - k.start);
    const at = Math.max(0, Math.min(100, ((m - k.start) / span) * 100));
    return (
      <div className="sky-bar">
        <span className="sky-bar-track">
          {k.bands.map((b) => (
            <span key={b.grade} className={"sky-seg sky-seg-" + b.grade} style={{ left: (((b.start - k.start) / span) * 100) + "%", width: (((b.end - b.start) / span) * 100) + "%" }} />
          ))}
        </span>
        <span className="sky-bar-at" style={{ left: at + "%" }} />
      </div>
    );
  };

  return (
    <header className={"sky sky-" + phase}>
      {/* The lid is the sky's own box, so its bottom edge is a real horizon rather
          than wherever the header happens to end. The plate is tucked up under
          it by --sky-lap, and that tuck line IS the horizon: arc, glow and disc
          are all measured from it, so a twilight sun sits half-behind the plate
          edge instead of vanishing below the header. The gradient is clipped by
          .sky-fill and not by the lid, because the place chip's menu has to be
          able to float out. */}
      <div className="sky-lid">
        <div className="sky-fill" aria-hidden="true">
          <div className="sky-arc" />
          <div className="sky-disc" style={{ left: `calc(20px + ${t.toFixed(4)} * (100% - 40px))`, bottom: `calc(var(--sky-lap) + ${discY.toFixed(1)}px)` }}>
            {night
              ? <window.MoonPhase phase={pa.phase} size={32} />
              : <span className={"sky-sun" + (phase === "dawn" || phase === "dusk" ? " low" : "")} />}
          </div>
          <div className="sky-horizon" />
        </div>
        <div className="sky-top">
          <span className="sky-greet" style={{ fontFamily: font }}>
            {greeting || L.greeting(lang)}
            {(() => { const n = ((window.STUTI_FLYLEAF && window.STUTI_FLYLEAF.get().nama) || "").trim(); return n ? ", " + n : ""; })()}
          </span>
          <window.LocationControl />
        </div>
      </div>

      {st.current ? (
        <div className="sky-plate" style={{ position: "relative" }}>
          <div className="sky-plate-cap">{L.t("sandhya", lang)}<button className={"sky-plate-bell" + (bellOn ? " on" : "")} aria-pressed={bellOn} aria-expanded={bellOpen} title="Sandhyā reminders" aria-label="Sandhyā reminders" onClick={toggleSandhyaNotifs}><window.Icon key={bellOn ? "on" : "off"} name="bell" size={13} /></button></div>
          <div className="sky-plate-head">
            <b style={{ fontFamily: titleFont }}>{nm(st.current.label)}</b>
            <span className="sky-plate-till" style={{ fontFamily: titleFont }}>{L.t("juncTill", lang).replace("{t}", clock(st.current.end))}</span>
          </div>
          {bar(st.current)}
          <div className="sky-plate-foot">
            <span>{clock(st.current.start)}</span>
            {/* the band standing NOW, not a frozen "uttama till" — at two in
                the afternoon uttama is a fact about the past */}
            <span className={"sky-plate-mid sky-mid-" + st.band.grade} style={{ fontFamily: font }}>
              {nm(st.band.label)} {L.t("juncTill", lang).replace("{t}", clock(st.band.end))}
            </span>
            <span>{clock(st.current.end)}</span>
          </div>
          {/* the hour is on one side or the other of sunrise/sunset, and the two
              Sūrya acts of the rite fall on opposite sides of it */}
          {st.rite === "arghya" && (
            <div className="sky-plate-note sky-plate-rite" style={{ fontFamily: font, paddingRight: 44 }}>
              {L.t("riteArghya", lang).replace("{t}", clock(st.hinge))}
            </div>
          )}
          {st.rite === "upasthana" && (
            <div className="sky-plate-note sky-plate-rite" style={{ fontFamily: font, paddingRight: 44 }}>
              {L.t("riteLatePray", lang)}
            </div>
          )}
          {/* the prāyaścitta stands alone only where there is no hinge line to
              carry it — otherwise the two lines argue over the same arghya */}
          {st.prayaschitta && !st.rite && <div className="sky-plate-note" style={{ paddingRight: 44 }}>{L.t("prayaschitta", lang)}</div>}
          <button className="icon-btn" aria-label="How to perform sandhyā by your own sampradayā" title="How to perform sandhyā by your own sampradayā"
            style={{ position: "absolute", right: 10, bottom: 10, width: 26, height: 26, minWidth: 26, borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--ink-soft)", fontSize: "0.8125rem", fontWeight: 700, display: "grid", placeItems: "center" }}
            onClick={(e) => { e.stopPropagation(); if (go) go("sandhyaNote", { from: "home" }); }}>?</button>
        </div>
      ) : ahead ? (
        <div className="sky-plate sky-plate-ahead" style={{ position: "relative" }}>
          <div className="sky-plate-cap">{L.t("juncNext", lang)}<button className={"sky-plate-bell" + (bellOn ? " on" : "")} aria-pressed={bellOn} aria-expanded={bellOpen} title="Sandhyā reminders" aria-label="Sandhyā reminders" onClick={toggleSandhyaNotifs}><window.Icon key={bellOn ? "on" : "off"} name="bell" size={13} /></button></div>
          <div className="sky-plate-head">
            <b style={{ fontFamily: titleFont }}>{nm(ahead.kala.label)}</b>
            <span className="sky-plate-till" style={{ fontFamily: titleFont }}>{clock(ahead.kala.start)}</span>
          </div>
          <div className="sky-plate-foot sky-plate-foot-solo">
            <span>{L.t("sandhyaIn", lang).replace("{t}", window.syDur(ahead.at, lang, L))}</span>
          </div>
          <button className="icon-btn" aria-label="How to perform sandhyā by your own sampradayā" title="How to perform sandhyā by your own sampradayā"
            style={{ position: "absolute", right: 10, bottom: 10, width: 26, height: 26, minWidth: 26, borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--line)", color: "var(--ink-soft)", fontSize: "0.8125rem", fontWeight: 700, display: "grid", placeItems: "center" }}
            onClick={(e) => { e.stopPropagation(); if (go) go("sandhyaNote", { from: "home" }); }}>?</button>
        </div>
      ) : null}
      {bellSheet}
      {confirmNote && <div className="sky-plate-confirm" onClick={() => setConfirmNote(null)}>{confirmNote}</div>}
    </header>
  );
}

Object.assign(window, { SkyHeader, skyPhase });

/* ============================================================
   STUTI — Library hub (lens switcher)
   One pool of texts, re-sliced by lens. The deity lens is a grid
   (each has a seal + accent); type / occasion / author are lists
   (text labels, open-ended sets). "For you" is the hub's landing.
   ============================================================ */
const { useState: useStateLb, useEffect: useEffectLb } = React;

/* pick a field from a {roman,deva,tel} triplet for the reading script */
function pick3(o, lang) {
  if (!o) return "";
  return lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.roman) : o.roman;
}

/* a hymn row used across every list lens — carries the deity seal so a
   cross-deity list still shows whose text it is */
function HymnRow({ h, go, lang, showSeal = true, i = 0, from = "browse" }) {
  const S = window.STUTI, L = window.STUTI_L;
  const d = S.deityById[h.deity];
  const font = L.font(lang);
  /* every list lens lives inside the library, and the library remembers its
     open detail — so back from the stotra returns to the list, not the root */
  const open = () => go("reader", { deity: h.deity, hymn: h.id, from });
  return (
    <div className={"hymn-card" + (h.catalog ? " hymn-card-soon" : "")}
      style={{ animationDelay: `${Math.min(i, 9) * 40}ms`, ...deityStyle(d) }}>
      <button className="hymn-card-main search-result" onClick={open}>
        {showSeal && <Seal d={d} size={40} />}
        <div className="search-result-body">
          <div className="hymn-card-lead" style={{ fontFamily: font, fontSize: 20, color: "var(--accent-ink)", lineHeight: 1.2, fontStyle: "normal" }}>{L.hymnTitle(h, lang)}</div>
          <div className="hymn-card-meta">
            <span>{L.name(d, lang)}</span>
            <span className="dot" />
            <span>{h.type}</span>
            {h.catalog && <React.Fragment><span className="dot" /><span style={{ fontStyle: "normal" }}>{L.t("textComingSoon", lang)}</span></React.Fragment>}
          </div>
        </div>
      </button>
      {!h.catalog && <window.LearnButton id={h.id} size={22} go={go} from="browse" />}
      {!h.catalog && <FavButton id={h.id} size={22} />}
    </div>
  );
}

/* ---------------- By deity (adaptive grid) ---------------- */
function DeityLens({ go, lang, tileMode = "seal" }) {
  const S = window.STUTI, L = window.STUTI_L;
  const full = tileMode === "full";
  /* the deities the reciter said they keep stand first */
  const kept = window.STUTI_PREFS ? window.STUTI_PREFS.get().kept : [];
  const deities = kept.length
    ? S.deities.slice().sort((a, b) => (kept.indexOf(b.id) !== -1) - (kept.indexOf(a.id) !== -1))
    : S.deities;
  return (
    <div className="lens-pad">
      <div className="tile-grid lib-deity-grid">
        {deities.map((d, i) => (
          <button key={d.id} className={"gtile" + (full ? " gtile-full" : "") + (kept.indexOf(d.id) !== -1 ? " gtile-kept" : "")} style={{ ...deityStyle(d), animationDelay: `${40 + i * 45}ms` }}
            onClick={() => go("deity", { deity: d.id, from: "browse" })}>
            {full
              ? <div className="gtile-pic"><Emblem d={d} variant="ink" /></div>
              : <Seal d={d} size={134} style={{ width: "100%", height: "auto", aspectRatio: "1 / 1", maxWidth: 134 }} />}
            <div className="gtile-name display" style={{ fontFamily: L.font(lang) }}>{L.name(d, lang)}</div>
          </button>
        ))}
        {/* the ninth shelf: what is coming. A dashed ring rather than an emblem —
            a drawn deity would promise a text that is not there yet, and eight
            plus this one fills the three-up grid exactly. */}
        <div className="gtile gtile-soon" aria-disabled="true">
          <span className="gtile-soon-ring"><Icon name="grid" size={26} /></span>
          <div className="gtile-name display" style={{ fontFamily: L.font(lang) }}>{L.t("otherDeities", lang)}</div>
          <div className="gtile-soon-tag">{L.t("comingSoon", lang)}</div>
        </div>
      </div>

      <div className="coll-list">
        <div className="eyebrow coll-eyebrow">{L.t("moreLabel", lang)}</div>
        <button className="coll-card" onClick={() => go("practices")}>
          <span className="coll-ico"><Icon name="diya" size={24} filled={true} /></span>
          <div className="coll-body">
            <div className="coll-title display" style={{ fontFamily: L.font(lang) }}>{L.t("nityaAnushtana", lang)}</div>
            <div className="coll-sub">{L.t("nityaAnushtanaSub", lang)}</div>
          </div>
          <span className="lens-row-chev"><Icon name="chev" size={18} /></span>
        </button>
      </div>
      <div style={{ height: 32 }} />
    </div>
  );
}

/* ---------------- Reset ----------------
   Destructive, so it asks twice and says exactly what it is about to
   forget. Two scopes: the record of practice, or a clean first run. */
function ResetPanel({ lang }) {
  const L = window.STUTI_L, B = window.STUTI_BUILD;
  const [open, setOpen] = React.useState(false);
  const [armed, setArmed] = React.useState(null);   // "practice" | "all"
  if (!B || !B.reset) return null;
  const t = open ? B.tally() : null;
  const go = (scope) => {
    if (armed !== scope) { setArmed(scope); setTimeout(() => setArmed((a) => (a === scope ? null : a)), 4000); return; }
    B.reset(scope);
    location.reload();
  };
  if (!open) {
    return <button className="reset-open" onClick={() => setOpen(true)}>{L.t("resetOpen", lang)}</button>;
  }
  const bits = [
    [t.days, L.t("resetDays", lang)],
    [t.japa, L.t("resetJapa", lang)],
    [t.plans, L.t("resetPlans", lang)],
    [t.vows, L.t("resetVows", lang)],
    [t.saved, L.t("resetSaved", lang)],
  ].filter((x) => x[0] > 0);
  return (
    <div className="reset-panel">
      <div className="reset-heading">{L.t("resetHeading", lang)}</div>
      {bits.length > 0 && (
        <div className="reset-holds">
          <span>{L.t("resetHolds", lang)}</span>
          {bits.map(([n, label]) => <b key={label}>{n} <i>{label}</i></b>)}
        </div>
      )}
      <button className={"reset-btn" + (armed === "practice" ? " armed" : "")} onClick={() => go("practice")}>
        <span className="reset-btn-name">{armed === "practice" ? L.t("resetSure", lang) : L.t("resetPractice", lang)}</span>
        <span className="reset-btn-note">{L.t("resetPracticeNote", lang)}</span>
      </button>
      <button className={"reset-btn reset-btn-all" + (armed === "all" ? " armed" : "")} onClick={() => go("all")}>
        <span className="reset-btn-name">{armed === "all" ? L.t("resetSure", lang) : L.t("resetAll", lang)}</span>
        <span className="reset-btn-note">{L.t("resetAllNote", lang)}</span>
      </button>
      <button className="reset-cancel" onClick={() => { setArmed(null); setOpen(false); }}>{L.t("resetCancel", lang)}</button>
    </div>
  );
}

/* ---------------- Build stamp ----------------
   Quiet at the foot of the library. A tester taps it and the version,
   state and device go to the clipboard, ready to paste into a report. */
function BuildStamp({ lang, noReset }) {
  const L = window.STUTI_L, B = window.STUTI_BUILD;
  const [copied, setCopied] = React.useState(false);
  if (!B) return null;
  const tap = () => { B.copy().then((ok) => { if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2600); } }); };
  return (
    <div className="build-foot">
      <button className="build-chip" onClick={tap} aria-label={window.STUTI_L.a("aCopyBuild")}>
        <span className="build-ver">{B.label()}</span>
        <span className="build-dot" />
        <span className="build-texts">{L.t("buildTexts", lang).replace("{n}", B.texts())}</span>
      </button>
      <div className={"build-note" + (copied ? " on" : "")}>{L.t(copied ? "buildCopied" : "buildTap", lang)}</div>
      {!noReset && <ResetPanel lang={lang} />}
    </div>
  );
}

/* ---------------- By type (list → detail) ---------------- */
function TypeLens({ go, lang, onOpen }) {
  const L = window.STUTI_L, LIB = window.STUTI_LIB;
  const types = LIB.typeList();
  return (
    <div className="lens-pad">
      <div className="lens-list">
        {types.map((t, i) => (
          <button key={t.type} className="lens-row" style={{ animationDelay: `${i * 35}ms` }} onClick={() => onOpen(t.type)}>
            <div className="lens-row-body">
              <div className="lens-row-name display" style={{ fontFamily: L.font(lang) }}>{lang === "roman" ? t.type : pick3({ roman: t.type, deva: t.deva, tel: t.tel }, lang)}</div>
              <div className="lens-row-sub">{lang === "roman" ? t.note : t.type}</div>
            </div>
            <span className="lens-row-count">{t.count}</span>
            <span className="lens-row-chev"><Icon name="chev" size={18} /></span>
          </button>
        ))}
      </div>
      <div style={{ height: 32 }} />
    </div>
  );
}

function TypeDetail({ typeKey, go, lang, onBack }) {
  const L = window.STUTI_L, LIB = window.STUTI_LIB;
  const hymns = LIB.hymnsOfType(typeKey);
  const label = LIB.TYPE_LABELS[typeKey];
  return (
    <div className="view libhub scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label={window.STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display" style={{ fontFamily: L.font(lang) }}>{lang === "roman" ? typeKey : pick3({ roman: typeKey, deva: label && label.deva, tel: label && label.tel }, lang)}</div>
        <div style={{ width: 50 }} />
      </div>
      <div className="lens-pad">
        <div className="lens-detail-head">
          <span className="eyebrow">{hymns.length} {L.t("hymns", lang)}</span>
          {label && label.note && <span className="lens-detail-note">· {label.note}</span>}
        </div>
        <div className="hymn-list">
          {hymns.map((h, i) => <HymnRow key={h.id} h={h} go={go} lang={lang} i={i} />)}
        </div>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

/* The occasion lens is gone: its content lives in STUTI_VRATA and renders
   through VrataLens / VrataDetail (stuti-vrata.jsx). */

/* ---------------- The hub ---------------- */
const LENSES = [
  { id: "deity",    key: "lensDeity",    icon: "grid" },
  { id: "type",     key: "lensType",     icon: "list" },
  { id: "masa",     key: "lensMasa",     icon: "moon" },
  { id: "vrata",    key: "lensVrata",    icon: "kalasha" },
  { id: "festival", key: "lensFestival", icon: "diya" },
  { id: "nomu",     key: "lensNomu",     icon: "vayanam" },
  { id: "parayana", key: "parayana",     icon: "book" },
];

/* `lens` and `sub` are owned by App, not by this component. The hub is
   unmounted every time the reciter leaves the library — to a sitting, to a
   stotra, to another tab — so state held locally here does not survive the
   trip back, and a back arrow that should have returned someone to the
   Aṣṭakam list dropped them at the lens root instead. Lifted, the library
   remembers where it was open; only a Library tab press clears it. */
/* ---- the lens swipe, shared by every lens bar ----
   The library and Nitya are the same instrument: one pool of screens re-sliced
   by a row of pills too wide for a phone. A side-swipe steps the row, and the
   row scrolls to follow, so both screens answer the thumb the same way.
   Everything the gesture had to learn the hard way lives here once:
   - Listeners sit on window in the capture phase. Bound to the screen element
     the swipe failed twice over — a drag released outside it never delivered
     its end event, and any child that swallowed the event ate the swipe
     silently. Membership is tested from the event's target instead.
   - A trackpad side-swipe is not a pointer gesture at all; it arrives as wheel
     deltas, so the wheel is read too.
   - One gesture may step once, and what separates gestures is a quiet gap
     measured in the events' own timestamps, not in wall-clock time at the
     moment they are handled: on an expensive lens the flick's remaining
     momentum queues behind the React commit and is handled hundreds of
     milliseconds late, which any now-based gap test reads as a fresh swipe and
     steps again. An event's timeStamp is set when the gesture produced it, so
     the queue cannot forge a pause that never happened.
   - Strips that own the horizontal axis themselves — the lens bar, a chip rail
     wider than its frame — opt out, so their own scrolling still works. */
function useLensSwipe({ viewRef, trackRef, lenses, lens, onChange, disabled }) {
  const dragRef = React.useRef(null);
  const wheelRef = React.useRef({ ax: 0, lastWheel: 0, stepped: false });
  React.useEffect(() => {
    if (disabled) return;
    const inside = (el) => {
      const v = viewRef.current;
      return !!v && el instanceof Node && v.contains(el);
    };
    const ownsAxis = (el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        if (n.classList && n.classList.contains("lensbar")) return true;
        const ov = getComputedStyle(n).overflowX;
        if ((ov === "auto" || ov === "scroll") && n.scrollWidth > n.clientWidth + 4) return true;
      }
      return false;
    };
    const step = (dir) => {
      const i = lenses.findIndex((l) => l.id === lens);
      if (i === -1) return;
      const next = dir < 0 ? lenses[i + 1] : lenses[i - 1];
      if (next) onChange(next.id);
    };
    const begin = (x, y, target) => {
      dragRef.current = (inside(target) && !ownsAxis(target)) ? { x, y } : null;
    };
    const finish = (x, y) => {
      const st = dragRef.current; dragRef.current = null;
      if (!st) return;
      const dx = x - st.x, dy = y - st.y;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      step(dx);
    };
    const ts = (e) => { if (e.touches.length === 1) { const t = e.touches[0]; begin(t.clientX, t.clientY, e.target); } };
    const te = (e) => { const t = e.changedTouches[0]; if (t) finish(t.clientX, t.clientY); };
    const pd = (e) => { if (e.pointerType === "mouse" && e.button === 0) begin(e.clientX, e.clientY, e.target); };
    const pu = (e) => { if (e.pointerType === "mouse") finish(e.clientX, e.clientY); };
    const cancel = () => { dragRef.current = null; };
    const w = wheelRef.current;
    const wheel = (e) => {
      if (!inside(e.target) || ownsAxis(e.target)) return;
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.2) return;
      const now = e.timeStamp || performance.now();
      const fresh = now - w.lastWheel > 150;
      w.lastWheel = now;
      if (fresh) { w.ax = 0; w.stepped = false; }
      if (w.stepped) { w.ax = 0; return; }
      w.ax += e.deltaX;
      if (Math.abs(w.ax) < 45) return;
      const dir = w.ax; w.ax = 0; w.stepped = true;
      step(-dir);
    };
    const o = { capture: true, passive: true };
    const on = [["wheel", wheel], ["touchstart", ts], ["touchend", te], ["touchcancel", cancel], ["pointerdown", pd], ["pointerup", pu]];
    on.forEach(([n, h]) => window.addEventListener(n, h, o));
    return () => on.forEach(([n, h]) => window.removeEventListener(n, h, o));
  }, [lens, lenses, disabled, onChange, viewRef]);
  /* The bar follows. A gesture changes the lens without touching the row, so
     the active pill could sit off-screen behind it and the reciter would meet a
     new screen with no visible sign of which lens produced it. Centred, and
     clamped at both ends so the first and last pills sit flush rather than
     half-scrolled into empty space. */
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const pill = track.querySelector(".lens-pill.on");
    if (!pill) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;
    const target = Math.max(0, Math.min(max, pill.offsetLeft - (track.clientWidth - pill.offsetWidth) / 2));
    if (Math.abs(target - track.scrollLeft) < 2) return;
    track.scrollTo({ left: target, behavior: "smooth" });
  }, [lens, trackRef]);
}

/* ---- arranging a lens bar ----
   Our order is a guess; the reciter's is a fact. Long-press any pill to
   arrange, drag it where it belongs, and the bar keeps that order. Both bars —
   the library's seven and Nitya's six — are the same instrument, so the gesture
   and its wording live here once and both call it.

   The stored order is a list of ids reconciled against the real lens list on
   every read, never a frozen snapshot: a lens added later appears at its
   canonical place, one withdrawn drops out without leaving a hole. */
function useLensArrange({ lenses, storageKey, lang = "deva" }) {
  const L = window.STUTI_L;
  const ids = lenses.map((l) => l.id);
  const read = () => {
    let saved = [];
    try { const a = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (Array.isArray(a)) saved = a; } catch (e) {}
    const kept = saved.filter((id, i) => ids.indexOf(id) >= 0 && saved.indexOf(id) === i);
    ids.forEach((id, i) => { if (kept.indexOf(id) < 0) kept.splice(Math.min(i, kept.length), 0, id); });
    return kept;
  };
  const [order, setOrder] = React.useState(read);
  const [arranging, setArranging] = React.useState(false);
  const [dragId, setDragId] = React.useState(null);
  const [resetHold, setResetHold] = React.useState(false);
  const pressRef = React.useRef(null), resetRef = React.useRef(null);

  const commit = (next) => {
    setOrder(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (e) {}
  };
  const clearPress = () => { if (pressRef.current) { clearTimeout(pressRef.current.t); pressRef.current = null; } };
  const exit = () => { setDragId(null); setArranging(false); };
  React.useEffect(() => clearPress, []);
  React.useEffect(() => {
    if (!arranging) return;
    const esc = (e) => { if (e.key === "Escape") exit(); };
    /* a press anywhere off the bar also leaves the mode: the pills swallow taps
       while arranging, so the way out must not depend on hitting one control */
    const out = (e) => { if (!e.target.closest || !e.target.closest(".lensbar")) exit(); };
    window.addEventListener("keydown", esc);
    window.addEventListener("pointerdown", out, true);
    return () => { window.removeEventListener("keydown", esc); window.removeEventListener("pointerdown", out, true); };
  }, [arranging]);

  /* The drag is read on the window, not on the pill.
     Bound to the pill it failed on the library bar in two ordinary ways: a pill
     carrying an <img> (the kalāśa, the pārāyaṇa glyph) starts the browser's own
     image drag on mousedown, which fires pointercancel and kills ours; and the
     moment the row re-orders under the finger, the element the pointer began on
     is no longer beneath it. Window listeners with the native drag suppressed
     answer both. */
  const orderRef = React.useRef(order); orderRef.current = order;
  React.useEffect(() => {
    if (!dragId) return;
    const move = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const over = el && el.closest && el.closest(".lens-pill");
      const overId = over && over.getAttribute("data-lens");
      if (!overId || overId === dragId) return;
      const next = orderRef.current.slice();
      const from_ = next.indexOf(dragId), to_ = next.indexOf(overId);
      if (from_ < 0 || to_ < 0) return;
      next.splice(from_, 1); next.splice(to_, 0, dragId);
      commit(next);
    };
    const up = () => setDragId(null);
    const nodrag = (e) => e.preventDefault();
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    window.addEventListener("dragstart", nodrag, true);
    return () => {
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
      window.removeEventListener("dragstart", nodrag, true);
    };
  }, [dragId]);

  const pill = (id) => ({
    "aria-grabbed": arranging ? dragId === id : undefined,
    draggable: false,
    onDragStart: (e) => e.preventDefault(),
    onPointerDown: (e) => {
      if (arranging) {
        e.preventDefault();
        setDragId(id);
        return;
      }
      if (e.pointerType === "mouse" && e.button !== 0) return;
      clearPress();
      const x = e.clientX, y = e.clientY;
      pressRef.current = { x, y, t: setTimeout(() => {
        pressRef.current = null; setArranging(true);
        try { navigator.vibrate && navigator.vibrate(12); } catch (err) {}
      }, 480) };
    },
    onPointerMove: (e) => {
      if (arranging) return;
      const p = pressRef.current;
      if (p && (Math.abs(e.clientX - p.x) > 8 || Math.abs(e.clientY - p.y) > 8)) clearPress();
    },
    onPointerUp: () => { clearPress(); },
    onPointerCancel: () => { clearPress(); },
    onContextMenu: (e) => { if (arranging) e.preventDefault(); },
  });

  /* Reset undoes an arrangement built by hand, so it asks for the same
     deliberate gesture that built it: hold, don't tap. And it appears only once
     there is something to undo. */
  const endHold = () => { if (resetRef.current) { clearTimeout(resetRef.current); resetRef.current = null; } setResetHold(false); };
  const beginHold = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    endHold(); setResetHold(true);
    resetRef.current = setTimeout(() => {
      resetRef.current = null; setResetHold(false);
      try { localStorage.removeItem(storageKey); } catch (err) {}
      setOrder(ids.slice());
      try { navigator.vibrate && navigator.vibrate(12); } catch (err) {}
    }, 700);
  };
  React.useEffect(() => endHold, []);

  /* Done sits below the bar, not at the end of the pill row: the row scrolls,
     and an exit that scrolls off the right edge is no exit at all on a phone. */
  const note = !arranging ? null : (
    <div className="lens-arrange-note">
      <span className="lens-arrange-hint">{L.t("lensArrHint", lang)}</span>
      {order.join(",") !== ids.join(",") && (
        <button className={"lens-arrange-reset" + (resetHold ? " holding" : "")}
          onPointerDown={beginHold} onPointerUp={endHold} onPointerLeave={endHold} onPointerCancel={endHold}
          title={L.t("lensArrResetHold", lang)}>{L.t(resetHold ? "lensArrResetHold" : "lensArrReset", lang)}</button>
      )}
      <button className="lens-arrange-done" data-arrange="done" onClick={exit}>{L.t("lensArrDone", lang)}</button>
    </div>
  );

  const byId = {}; lenses.forEach((l) => { byId[l.id] = l; });
  return { order, ordered: order.map((id) => byId[id]).filter(Boolean), arranging, dragId, pill, note, exit };
}

function LibraryHub({ go, lang = "deva", tileMode = "seal", lens = "deity", setLens, sub = null, setSub }) {
  const L = window.STUTI_L;
  /* Hooks sit above the detail-view return on purpose: hooks declared after it
     change in number the moment a detail opens or closes, which React counts
     as a different component. */
  const viewRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const effLens = (lens === "nomu" && lang === "deva") ? "vrata" : lens;
  const arr = useLensArrange({ lenses: LENSES, storageKey: "stuti-library-lens-order", lang });
  const swipeLenses = arr.ordered.filter((l) => l.id !== "nomu" || lang !== "deva");
  const pickLens = React.useCallback((id) => { setLens(id); setSub(null); }, [setLens, setSub]);
  useLensSwipe({ viewRef, trackRef, lenses: swipeLenses, lens: effLens, onChange: pickLens, disabled: !!sub || arr.arranging });

  // a detail view takes over the whole screen (its own back returns to the lens)
  if (sub) {
    const back = () => sub.returnTo ? go(sub.returnTo, { reset: true }) : setSub(null);
    if (sub.kind === "type") return <TypeDetail typeKey={sub.key} go={go} lang={lang} onBack={back} />;
    if (sub.kind === "parayana") return <window.ParayanaDetail parayanaId={sub.key} go={go} lang={lang} onBack={back} />;
    if (sub.kind === "vrata") return <window.VrataDetail vrataId={sub.key} go={go} lang={lang} onBack={back} />;
    if (sub.kind === "nomu") return <window.NomuDetail nomuId={sub.key} go={go} lang={lang} onBack={back} />;
    if (sub.kind === "masa") return <window.MasaDetail masaId={sub.key} go={go} lang={lang} onBack={back} onOpen={(kind, key) => setSub({ kind, key })} />;
  }

  lens = effLens;
  const visibleLenses = swipeLenses;
  let body;
  if (lens === "type") body = <TypeLens go={go} lang={lang} onOpen={(k) => setSub({ kind: "type", key: k })} />;
  else if (lens === "vrata") body = <window.VrataLens go={go} lang={lang} onOpen={(k) => setSub({ kind: "vrata", key: k })} />;
  else if (lens === "festival") body = <window.FestivalLens go={go} lang={lang} onOpen={(k) => setSub({ kind: "vrata", key: k })} />;
  else if (lens === "nomu") body = <window.NomuLens go={go} lang={lang} onOpen={(k) => setSub({ kind: "nomu", key: k })} />;
  else if (lens === "parayana") body = <window.ParayanaLens go={go} lang={lang} onOpen={(k) => setSub({ kind: "parayana", key: k })} />;
  else if (lens === "masa") body = <window.MasaLens go={go} lang={lang} onOpen={(k) => setSub({ kind: "masa", key: k })} />;
  /* deity is the default and the fallback — an unrecognised lens must still
     render a library rather than an empty screen */
  else body = <DeityLens go={go} lang={lang} tileMode={tileMode} />;

  return (
    <div className="view libhub scroll" ref={viewRef}>
      <div className="topbar lens-topbar">
        <div className="topbar-title display">{L.t("library", lang)}</div>
        <button className="icon-btn" style={{ marginRight: 44 }} onClick={() => go("search", { from: "browse" })} aria-label={L.t("search", lang)}><Icon name="search" /></button>
      </div>

      {/* lens switcher — same pool, pick how it's grouped */}
      <div className="lensbar">
        <div className="lensbar-track" ref={trackRef}>
          <div className={"lensbar-inner" + (arr.arranging ? " arranging" : "")} role="tablist" aria-label={L.t("browseBy", lang)}>
            {visibleLenses.map((l) => (
              <button key={l.id} role="tab" aria-selected={lens === l.id}
                className={"lens-pill" + (lens === l.id ? " on" : "") + (arr.dragId === l.id ? " dragging" : "")} data-lens={l.id}
                {...arr.pill(l.id)}
                onClick={() => { if (!arr.arranging) { setLens(l.id); setSub(null); } }}>
                {l.icon === "kalasha" ? <img src="assets/kalasha-sm.png" alt="" width="20" height="20" loading="eager" decoding="sync" fetchPriority="high" style={{ objectFit: "contain" }} /> : l.id === "parayana" ? <img src="assets/parayana-glyph.png" alt="" width="20" height="20" style={{ objectFit: "contain" }} /> : <Icon name={l.icon} size={17} filled={l.icon === "diya"} />}
                <span>{L.t(l.key, lang)}</span>
              </button>
            ))}
          </div>
        </div>
        {arr.note}
      </div>

      {body}
    </div>
  );
}

Object.assign(window, { useLensSwipe, useLensArrange, LibraryHub, HymnRow, pick3, BuildStamp, ResetPanel });

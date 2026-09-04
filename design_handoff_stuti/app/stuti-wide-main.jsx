/* ============================================================
   STUTI — app shell, router, Browse, Search
   ============================================================ */
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

/* Tweaks — the two “explore a few options” forks (persisted by the host) */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "defaultLens": "Deity",
  "deityTile": "Seal",
  "seal": "Ratna",
  "palette": "Unified"
}/*EDITMODE-END*/;
const LENS_FROM_LABEL = { "Deity": "deity", "Type": "type" };

/* brand wordmark + auspicious mark, per reading script */
const BRAND_SCRIPT = { deva: "स्तुति", telugu: "స్తుతి" };
const SHRI = { deva: "॥ श्री ॥", telugu: "॥ శ్రీ ॥", roman: "॥ Śrī ॥" };

/* ---------------- Search: hymns · verses · words ----------------
   Three passes over the corpus. Titles and deities first (what the
   reciter usually reaches for), then the body of every verse —
   Sanskrit, IAST and translation alike — and last the lexicon, so a
   half-remembered word yields its meaning and where it is sung. */
const srStrip = (s) => window.STUTI_TRANSLIT.strip(s);
const srFold  = (s) => window.STUTI_TRANSLIT.fold(s);

/* a diacritic-blind view of a string that still knows where each
   character came from — so a match can be highlighted in the original */
function srTrace(text) {
  let out = "";
  const idx = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    for (const ch of c) { out += ch; idx.push(i); }
  }
  return { out, idx };
}

/* every verse of every text that has one, with the line index the
   reader counts in — so a result opens exactly at that verse */
let SR_VERSES = null;
function verseIndex() {
  if (SR_VERSES) return SR_VERSES;
  const out = [];
  window.STUTI.hymns.forEach((h) => {
    if (!h.verses || !h.verses.length) return;
    let base = 0;
    h.verses.forEach((v, vi) => {
      out.push({
        hid: h.id, did: h.deity, vi, base, n: v.n,
        deva: v.deva || "", iast: v.iast || "", en: v.en || "",
        key: srFold((v.iast || "") + " " + (v.en || "")),
      });
      base += (v.deva || "").split("\n").length;
    });
  });
  SR_VERSES = out;
  return out;
}

/* the matched run, lit, with just enough either side to read it */
function Snip({ text, needle, before = 30, len = 130 }) {
  if (!text) return null;
  const nd = srStrip(needle || "");
  const tr = nd ? srTrace(text) : null;
  const at = tr ? tr.out.indexOf(nd) : -1;
  if (at < 0) return <React.Fragment>{text.length > len ? text.slice(0, len).trim() + "…" : text}</React.Fragment>;
  const a = tr.idx[at], b = tr.idx[at + nd.length - 1] + 1;
  const s = Math.max(0, a - before), e = Math.min(text.length, b + (len - before));
  return (
    <React.Fragment>
      {s > 0 ? "…" : ""}{text.slice(s, a)}<mark>{text.slice(a, b)}</mark>{text.slice(b, e)}{e < text.length ? "…" : ""}
    </React.Fragment>
  );
}

const srPadaGloss = (lk) => {
  if (!lk) return "";
  if (lk.whole && lk.whole.en) return lk.whole.en;
  if (lk.parts) return lk.parts.filter((p) => p.en).map((p) => p.en).join(" · ");
  return "";
};

function SearchView({ go, lang = "deva", backView = "browse", weekday, voice = false }) {
  const S = window.STUTI, L = window.STUTI_L, TR = window.STUTI_TRANSLIT, PADA = window.STUTI_PADA;
  const [q, setQ] = useStateM("");
  const qf = srFold(q).trim();
  const raw = q.trim();
  const live = qf.length >= 1;

  /* 1 — titles, deities, forms */
  const hymnHits = React.useMemo(() => {
    if (!live) return [];
    const r = S.hymns.filter((h) => {
      const d = S.deityById[h.deity];
      return srFold([h.title, h.deva, h.tel, h.type, h.by, d && d.name, d && d.deva, d && d.tel, d && d.epithet].join(" ")).indexOf(qf) !== -1;
    });
    const rank = (h) => {
      const t = srFold([h.title, h.deva, h.tel].join(" "));
      const at = t.indexOf(qf);
      if (at === -1) return 3;
      if (at === 0) return 0;
      return t[at - 1] === " " ? 1 : 2;
    };
    r.sort((a, b) => rank(a) - rank(b) || (a.catalog ? 1 : 0) - (b.catalog ? 1 : 0));
    return r;
  }, [qf]);

  /* 2 — inside the verses */
  const verseHits = React.useMemo(() => {
    if (!live || qf.length < 2) return [];
    const deva = /[\u0900-\u097F\u0C00-\u0C7F]/.test(raw) ? raw : null;
    return verseIndex().filter((v) => (deva ? v.deva.indexOf(deva) !== -1 : v.key.indexOf(qf) !== -1));
  }, [qf, raw]);

  /* 3 — the word itself */
  const wordHit = React.useMemo(() => {
    if (!PADA || !raw || /\s/.test(raw) || raw.length < 3) return null;
    let lk = null;
    try { lk = PADA.lookup(raw); } catch (e) { return null; }
    if (!lk || !lk.found) return null;
    let occ = [];
    try { occ = PADA.occurrences(lk.stem, { surface: lk.surface }) || []; } catch (e) {}
    return { lk, occ };
  }, [raw]);

  const font = L.font(lang);
  const openHymn = (h) => (h.catalog ? go("deity", { deity: h.deity, from: "search", ret: backView }) : go("reader", { deity: h.deity, hymn: h.id, from: "search", ret: backView }));
  const resume = (hid, line, did) => {
    try { localStorage.setItem("stuti-pos-" + hid, String(line)); } catch (e) {}
    go("reader", { deity: did, hymn: hid, from: "search", ret: backView });
  };
  const verseLead = (v) => {
    const line = ((lang === "roman" ? (v.iast || v.deva) : v.deva) || "").split("\n")[0];
    return lang === "telugu" ? TR.convert(line, "telugu") : line;
  };
  const padaText = (iast) => {
    if (lang === "roman") return iast;
    const d = PADA.toDeva(iast);
    return lang === "telugu" ? TR.convert(d, "telugu") : d;
  };

  const nothing = live && !hymnHits.length && !verseHits.length && !wordHit;

  return (
    <div className="view browse scroll">
      <div className="topbar search-topbar">
        <button className="icon-btn" onClick={() => go(backView)} aria-label="Back"><Icon name="back" /></button>
        <div className="search-field">
          <Icon name="search" size={18} />
          <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)} autoFocus
            placeholder={L.t("searchHint", lang)} autoComplete="off" spellCheck="false" enterKeyHint="search" />
          <window.VoiceButton lang={lang} autoStart={voice} onInterim={setQ} onResult={setQ} />
          {q && <button className="search-clear" onClick={() => setQ("")} aria-label="Clear search">×</button>}
        </div>
      </div>
      <div style={{ padding: "6px 18px 24px" }}>
        {!live ? (
          <div className="search-hint">{L.t("searchScope", lang)}</div>
        ) : nothing ? (
          <div className="form-empty">
            <div className="form-empty-mark"><Icon name="lotus" size={28} /></div>
            <div className="form-empty-text">{L.t("noResults", lang)}</div>
          </div>
        ) : (
          <React.Fragment>
            {wordHit && (
              <div className="sr-sec">
                <div className="eyebrow sr-cap">{L.t("srWord", lang)}</div>
                <div className="sr-word">
                  <div className="sr-word-head">
                    <span className="sr-word-pada" style={{ fontFamily: font }}>{padaText(wordHit.lk.iast)}</span>
                    {lang !== "roman" && <span className="sr-word-iast">{wordHit.lk.iast}</span>}
                  </div>
                  {srPadaGloss(wordHit.lk) && <div className="sr-word-gloss">{srPadaGloss(wordHit.lk)}</div>}
                  {wordHit.occ.length > 0 && (
                    <button className="sr-word-go" onClick={() => resume(wordHit.occ[0].hymnId, wordHit.occ[0].lineIdx, wordHit.occ[0].deityId)}>
                      {L.t("srOccur", lang).replace("{n}", wordHit.occ.length)}
                      <Icon name="chev" size={15} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {hymnHits.length > 0 && (
              <div className="sr-sec">
                <div className="eyebrow sr-cap">{L.t("srHymns", lang)} <i>{hymnHits.length}</i></div>
                <div className="hymn-list">
                  {hymnHits.slice(0, 30).map((h, i) => {
                    const d = S.deityById[h.deity];
                    return (
                      <div key={h.id} className={"hymn-card" + (h.catalog ? " hymn-card-soon" : "")} style={{ animationDelay: `${Math.min(i, 8) * 45}ms`, ...deityStyle(d) }}>
                        <button className="hymn-card-main search-result" onClick={() => openHymn(h)}>
                          <Seal d={d} size={40} />
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
                        {!h.catalog && <FavButton id={h.id} weekday={weekday} size={22} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {verseHits.length > 0 && (
              <div className="sr-sec">
                <div className="eyebrow sr-cap">{L.t("srVerses", lang)} <i>{verseHits.length}</i></div>
                <div className="sr-vlist">
                  {verseHits.slice(0, 24).map((v) => {
                    const h = S.hymnById(v.hid), d = S.deityById[v.did];
                    return (
                      <button key={v.hid + ":" + v.vi} className="sr-verse" style={deityStyle(d)} onClick={() => resume(v.hid, v.base, v.did)}>
                        <div className="sr-verse-lead" style={{ fontFamily: lang === "roman" ? "var(--font-display)" : font }}>
                          {lang === "roman" ? <Snip text={v.iast.split("\n")[0]} needle={raw} /> : verseLead(v)}
                        </div>
                        {v.en && <div className="sr-verse-en"><Snip text={v.en} needle={raw} /></div>}
                        <div className="sr-verse-src">
                          <span>{L.hymnTitle(h, lang)}</span>
                          <span className="dot" />
                          <span>{v.n ? v.n : v.vi + 1}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {verseHits.length > 24 && <div className="sr-more">{L.t("srMore", lang).replace("{n}", verseHits.length - 24)}</div>}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

/* ---------------- Browse: all deities ---------------- */
function BrowseView({ go, lang = "deva" }) {
  const S = window.STUTI, L = window.STUTI_L;
  return (
    <div className="view browse scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go("home")} aria-label="Home"><Icon name="back" /></button>
        <div className="topbar-title display">{L.t("deities", lang)}</div>
        <button className="icon-btn" onClick={() => go("search", { from: "browse" })} aria-label={L.t("search", lang)}><Icon name="search" /></button>
      </div>
      <div className="tile-grid browse-grid">
        {S.deities.map((d, i) => (
          <button key={d.id} className="gtile" style={{ ...deityStyle(d), animationDelay: `${60 + i * 60}ms` }}
            onClick={() => go("deity", { deity: d.id, from: "browse" })}>
            <Seal d={d} size={66} />
            <div className="gtile-name display" style={{ fontFamily: L.font(lang) }}>{L.name(d, lang)}</div>
            <div className="gtile-count">{L.hymnsCount(S.hymnsForDeity(d.id).length, lang)}</div>
          </button>
        ))}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

/* ---------------- Language / reading-script picker ---------------- */
const READ_SCRIPTS = [
  { k: "deva",   name: "Devanāgarī",   native: "देवनागरी" },
  { k: "roman",  name: "English · IAST",  native: "English" },
  { k: "telugu", name: "Telugu",       native: "తెలుగు" },
];

function LangPicker({ lang, setLang, align }) {
  const [open, setOpen] = useStateM(false);
  const cur = READ_SCRIPTS.find(s => s.k === lang) || READ_SCRIPTS[0];
  return (
    <div className={"langpick" + (open ? " open" : "")}>
      <button className="langpick-btn" onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox" aria-expanded={open} aria-label="Reading script">
        {/* the chosen script names itself; a globe in front of తెలుగు says nothing
            the word does not already say */}
        <span className="langpick-cur" style={{ fontFamily: cur.font }}>{cur.native}</span>
        <Icon name="chev" size={15} />
      </button>
      {open && (
        <React.Fragment>
          <div className="langpick-scrim" onClick={() => setOpen(false)} />
          <div className={"langpick-menu" + (align === "right" ? " right" : "")} role="listbox">
            {READ_SCRIPTS.map(s => (
              <button key={s.k} role="option" aria-selected={lang === s.k}
                className={"langpick-opt" + (lang === s.k ? " on" : "")}
                onClick={() => { setLang(s.k); setOpen(false); }}>
                {/* one name per script, in that script — the Roman gloss beside it
                    was a second name for a reader who can already read the first */}
                <span className="langpick-native" style={{ fontFamily: s.font }}>{s.native}</span>
                {lang === s.k && <Icon name="check" size={17} />}
              </button>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/* ---------------- Bottom navigation (4 tabs) ----------------
   Every screen's tab, in one table. Settings is reached from the gear in
   the home bar and its back goes home, so Today stays lit rather than
   leaving the bar dark — an unlit bar reads as "you are nowhere". */
const TAB_OF = {
  home: "home", settings: "home",
  daily: "nitya", japa: "nitya", plans: "nitya", plan: "nitya",
  browse: "lib", deity: "lib", reader: "lib", practices: "lib",
  calendar: "cal",
};
/* Screens with no tab of their own. Each is reachable from four or five
   places, so it inherits the tab of whatever opened it; the value here is
   only the fallback for a screen that arrived with no origin recorded. */
const HOP = { search: "browse", reader: "deity", deity: "browse", plan: "daily", practice: "daily" };
function TabBar({ view, from, ret, go, lang = "deva", theme, toggleTheme }) {
  const L = window.STUTI_L;
  /* Which tab a screen belongs under. The rootless screens above answer it
     from the same `from` their back arrows use, so the bar and the arrow
     cannot drift apart — a bar asserting one place while Back goes to
     another is the bug, wherever it appears. `ret` carries the origin's own
     origin, so a stotra opened from a search opened from the home still
     lights Today rather than the library. Walked rather than recursed, so a
     stale route can loop at most four times before falling through. */
  const lineage = (() => {
    let v = view, f = from, r = ret;
    for (let i = 0; i < 4 && HOP[v]; i++) {
      /* the anuṣṭhānams hang off the library's More section, and a practice
         opened from there goes back to them */
      if (v === "practice" && f === "practices") return "lib";
      v = f || HOP[v]; f = r; r = null;
    }
    return TAB_OF[v] || null;
  })();
  const onHome = lineage === "home";
  const onNitya = lineage === "nitya";
  const onLib = lineage === "lib";
  const onCal = lineage === "cal";
  return (
    <nav className="tabbar tabbar-4">
      {/* rail-only furniture — display:none on the phone (stuti-wide.css) */}
      <div className="rail-head" aria-hidden="true">
        <Flame size={30} />
        <span className="rail-name" style={{ fontFamily: window.STUTI_L.font(lang) }}>{BRAND_SCRIPT[lang] || "Stuti"}</span>
      </div>
      <button className={"tab tab-home" + (onHome ? " tab-on" : "")} onClick={() => go("home")}>
        <Icon name="home" size={25} /><span>{L.t("today", lang)}</span>
      </button>
      <button className={"tab" + (onNitya ? " tab-on" : "")} onClick={() => go("daily")}>
        <Icon name="diya" size={25} filled={true} /><span>{L.t("nitya", lang)}</span>
      </button>
      <button className={"tab" + (onLib ? " tab-on" : "")} onClick={() => go("browse", { reset: true })}>
        <Icon name="book" size={25} /><span>{L.t("library", lang)}</span>
      </button>
      <button className={"tab" + (onCal ? " tab-on" : "")} onClick={() => go("calendar")}>
        <Icon name="calendar" size={25} /><span>{L.t("calendar", lang)}</span>
      </button>
      <div className="rail-foot">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Day or night">
          <Icon name={theme === "night" ? "sun" : "moon"} />
        </button>
        <button className={"icon-btn" + (view === "settings" ? " rail-on" : "")} onClick={() => go("settings")} aria-label={L.t("settings", lang)}>
          <Icon name="gear" />
        </button>
      </div>
    </nav>
  );
}

/* ---------------- The app ---------------- */
function App() {
  const S = window.STUTI;
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const tileMode = t.deityTile === "Full picture" ? "full" : "seal";
  const [theme, setTheme] = useStateM(() => localStorage.getItem("stuti-theme") || "day");
  const [lang, setLang] = useStateM(() => localStorage.getItem("stuti-lang") || "deva");
  const [uiLang, setUiLangRaw] = useStateM(() => localStorage.getItem("stuti-ui-lang") || localStorage.getItem("stuti-lang") || "deva");
  const setUiLang = (v) => { localStorage.setItem("stuti-ui-lang-custom", v === "match" ? "0" : "1"); setUiLangRaw(v === "match" ? lang : v); };
  const [route, setRoute] = useStateM(() => ({ view: window.STUTI_ROUTE.view() || "home", deity: null, hymn: null, practice: null }));
  const [dir, setDir] = useStateM("fwd");
  const [overlayEl, setOverlayEl] = useStateM(null); // app-level host for the saṅkalpa bottom sheet
  const [onboarding, setOnboarding] = useStateM(() => !window.STUTI_PREFS.get().onboarded);
  const [remindOpen, setRemindOpen] = useStateM(false);
  /* the library's open lens and open detail live here, not in the hub — the
     hub unmounts on every trip out of the library and would forget them */
  const [libLens, setLibLens] = useStateM(() => LENS_FROM_LABEL[t.defaultLens] || "deity");
  const [libSub, setLibSub] = useStateM(null);
  /* changing the default lens in Tweaks should move the library to it */
  useEffectM(() => { setLibLens(LENS_FROM_LABEL[t.defaultLens] || "deity"); setLibSub(null); }, [t.defaultLens]);

  useEffectM(() => { document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("stuti-theme", theme); }, [theme]);
  /* written during render, not in an effect — see stuti-main.jsx */
  if (document.documentElement.getAttribute("data-lang") !== lang) document.documentElement.setAttribute("data-lang", lang);
  if (document.documentElement.getAttribute("data-ui-lang") !== uiLang) document.documentElement.setAttribute("data-ui-lang", uiLang);
  useEffectM(() => { document.documentElement.setAttribute("data-seal", t.seal === "Ratna" ? "ratna" : "current"); }, [t.seal]);
  useEffectM(() => { document.documentElement.setAttribute("data-palette", String(t.palette || "Current").toLowerCase()); }, [t.palette]);
  useEffectM(() => { localStorage.setItem("stuti-lang", lang); if (localStorage.getItem("stuti-ui-lang-custom") !== "1") setUiLangRaw(lang); }, [lang]);
  useEffectM(() => { localStorage.setItem("stuti-ui-lang", uiLang); }, [uiLang]);

  /* A screen can be linked to. The hash is read once at mount (above) and
     listened to after, since a hash change never reloads the document. */
  useEffectM(() => {
    const on = () => { const v = window.STUTI_ROUTE.view(); if (v) go(v, v === "browse" ? { reset: true } : {}); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, [route.view]);

  // verification hook (harmless)
  useEffectM(() => { window.__theme = theme; });

  const toggleTheme = () => setTheme(t => (t === "day" ? "night" : "day"));

  /* Where a screen was opened FROM. Search and the practice reader are both
     reachable from three or four places, and each used to send you back to
     one hard-coded screen — search always to the library, a practice always
     to Nitya — so opening either from the home lost your place. `from` is
     carried on the navigation itself and never inherited. */
  const go = (view, payload = {}) => {
    const order = { home: 0, daily: 1, browse: 2, calendar: 2, settings: 2, plans: 2, practices: 3, practice: 3, japa: 3, plan: 3, deity: 3, search: 3, reader: 4 };
    setDir(order[view] >= order[route.view] ? "fwd" : "back");
    /* A tab is a way home to its own root, so tapping Library from inside a
       type/author/vrata detail must drop that detail — but a back arrow
       RETURNING to the library must not, or it lands the reciter one level
       above where they were. Both arrive as `go("browse")`, so intent has
       to be stated rather than guessed from the destination. */
    if (payload.reset) setLibSub(null);
    setRoute(r => ({ view, from: payload.from, ret: payload.ret, deity: payload.deity ?? r.deity, hymn: payload.hymn ?? r.hymn, practice: payload.practice ?? r.practice, plan: payload.plan ?? r.plan, weekday: payload.weekday }));
  };

  const openToday = () => {
    const { deity, hymn } = window.todayInfo();
    setDir("fwd");
    setRoute({ view: "reader", deity: deity.id, hymn: hymn.id, from: "home" });
  };

  const deity = route.deity ? S.deityById[route.deity] : null;
  const hymn = route.hymn ? S.hymnById(route.hymn) : null;

  const Home = window.HomeA;

  let body;
  if (route.view === "home") body = <Home key="home" go={go} openToday={openToday} lang={lang} overlayEl={overlayEl} />;
  else if (route.view === "browse") body = <window.LibraryHub key="browse" go={go} lang={lang} tileMode={tileMode} lens={libLens} setLens={setLibLens} sub={libSub} setSub={setLibSub} />;
  else if (route.view === "search") body = <SearchView key="search" go={go} lang={lang} backView={route.from || "browse"} weekday={route.weekday} voice={!!route.voice} />;
  else if (route.view === "daily") body = <window.NityaView key="daily" go={go} lang={lang} showPractices={false} openRemind={() => setRemindOpen(true)} />;
  else if (route.view === "practices") body = <window.PracticesView key="practices" go={go} lang={lang} />;
  else if (route.view === "japa") body = <window.JapaView key="japa" go={go} lang={lang} />;
  else if (route.view === "plans") body = <window.PlansView key="plans" go={go} lang={lang} />;
  else if (route.view === "plan" && route.plan) body = <window.PlanView key={"pl" + route.plan} hymnId={route.plan} go={go} lang={lang} backView={route.from || "daily"} />;
  else if (route.view === "calendar") body = <window.CalendarView key="calendar" go={go} lang={lang} />;
  else if (route.view === "account") body = <window.AccountView key="account" go={go} lang={lang} backView={route.from || "settings"} />;
  else if (route.view === "settings") body = <window.SettingsView key="settings" go={go} lang={lang} setLang={setLang} uiLang={uiLang} setUiLang={setUiLang} theme={theme} toggleTheme={toggleTheme} openRemind={() => setRemindOpen(true)} />;
  else if (route.view === "practice") { const p = window.STUTI_LIB.practiceById(route.practice); body = p ? <window.PracticeView key={"p" + p.id} practice={p} go={go} lang={lang} backView={route.from || "daily"} /> : <Home key="home" go={go} openToday={openToday} lang={lang} overlayEl={overlayEl} />; }
  else if (route.view === "deity" && deity) body = <DeityView key={"d" + deity.id} deity={deity} go={go} lang={lang} backView={route.from || "browse"} retView={route.ret} />;
  else if (route.view === "reader" && hymn && deity) body = <ReaderView key={"r" + hymn.id + (route.jump ? "-" + route.jump : "")} hymn={hymn} deity={deity} go={go} theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} backView={route.from || "deity"} retView={route.ret} />;
  else body = <Home go={go} openToday={openToday} lang={lang} overlayEl={overlayEl} />;

  return (
    <div className="stage">
      <div className="app" data-screen-label={route.view}>
        {/* brand bar only on home */}
        {route.view === "home" && (
          <div className="brandbar">
            <div className="brand">
              <Flame size={26} />
              {BRAND_SCRIPT[lang] ? (
                <React.Fragment>
                  <span className="brand-name" style={{ fontFamily: window.STUTI_L.font(lang), letterSpacing: 0 }}>{BRAND_SCRIPT[lang]}</span>
                  <span className="brand-script display">Stuti</span>
                </React.Fragment>
              ) : (
                <span className="brand-name display">Stuti</span>
              )}
            </div>
            <span className="brand-shri" style={{ fontFamily: window.STUTI_L.font(lang) }}>{SHRI[lang] || SHRI.deva}</span>
            <div className="brandbar-actions">
              <button className="icon-btn" onClick={toggleTheme} aria-label="Day or night">
                <Icon name={theme === "night" ? "sun" : "moon"} />
              </button>
              <button className="icon-btn" onClick={() => go("settings")} aria-label={window.STUTI_L.t("settings", lang)}>
                <Icon name="gear" />
              </button>
            </div>
          </div>
        )}

        <div className={"viewport " + (dir === "fwd" ? "d-fwd" : "d-back")}>
          {body}
        </div>

        <TabBar view={route.view} from={route.from} ret={route.ret} go={go} lang={lang} theme={theme} toggleTheme={toggleTheme} />

        <div className="app-overlay" ref={setOverlayEl} />

        {remindOpen && <window.RemindSheet lang={lang} onClose={() => setRemindOpen(false)} />}
        {onboarding && (
          <window.Onboarding lang={lang} setLang={setLang} onDone={() => setOnboarding(false)} />
        )}
      </div>

      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label={window.STUTI_L.t("library", "roman")} />
          <window.TweakRadio label="Opens on" value={t.defaultLens} options={["Deity", "Type"]} onChange={(v) => setTweak("defaultLens", v)} />
          <window.TweakRadio label="Deity tile" value={t.deityTile} options={["Seal", "Full picture"]} onChange={(v) => setTweak("deityTile", v)} />
          <window.TweakRadio label="Seal" value={t.seal} options={["Current", "Ratna"]} onChange={(v) => setTweak("seal", v)} />
          <window.TweakSection label="Colour" />
          <window.TweakRadio label="Palette" value={t.palette} options={["Current", "Warm", "Unified"]} onChange={(v) => setTweak("palette", v)} />
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
/* arm the daily bell once the app is mounted */
if (window.STUTI_NUDGE) window.STUTI_NUDGE.start();
/* and take the app offline — the pūjā room is the use case, and it is the
   one place the wifi is worst. Registered directly rather than on `load`:
   Babel transpiles this file after that event has already fired, so a
   listener for it would never run. Failure is silent by design — a browser
   that refuses a worker still has a working app. */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("stuti-sw.js").then((r) => {
    window.STUTI_OFFLINE = r;
    /* A worker that has installed but not taken over will keep serving the
       previous build until every tab closes — which in practice means edits
       stay invisible. Take over as soon as the new one is ready, and reload
       once so the page is running the code it just fetched.

       ONCE is doing real work there. This used to reload on every
       `installed` transition, with an unconditional `r.update()` on every
       load to provoke one — which is a loop the moment the served worker
       script is not byte-identical between fetches: update finds a new
       worker, it installs, the page reloads, the reload calls update again.
       A document that keeps tearing itself down never finishes booting.
       So: the reload is spent once per tab, and we no longer go looking
       for updates on load — the browser checks on its own, and the worker
       is network-first anyway, so a stale build is not the failure mode
       this was defending against. */
    r.addEventListener("updatefound", () => {
      const w = r.installing;
      if (!w) return;
      w.addEventListener("statechange", () => {
        if (w.state !== "installed" || !navigator.serviceWorker.controller) return;
        try {
          if (sessionStorage.getItem("stuti-sw-reloaded")) return;
          sessionStorage.setItem("stuti-sw-reloaded", "1");
        } catch (e) { return; }
        location.reload();
      });
    });
    if (r.waiting) r.waiting.postMessage({ type: "SKIP_WAITING" });
  }, () => { window.STUTI_OFFLINE = null; });
}

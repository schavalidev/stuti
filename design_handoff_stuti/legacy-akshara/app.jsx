/* ============================================================
   AKSHARA — app shell: routing, bookmarks, tweaks
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "manuscript",
  "typeScale": 1,
  "accent": "#6E1E18",
  "homeLayout": "comfortable",
  "favStyle": "playlist"
}/*EDITMODE-END*/;

/* Skeleton-gated route wrappers */
function LibraryRoute(props) {
  const ready = useDelayedReady((props.initialColl || "all"), 420);
  if (!ready) return (
    <div className="rise wrap" style={{ padding: "52px 40px 40px" }}>
      <SkLine w={120} h={12} /><SkLine w="44%" h={50} mt={16} /><SkLine w="60%" h={16} mt={16} />
      <div style={{ height: 40 }} /><CardGridSkeleton n={6} />
    </div>
  );
  return <LibraryScreen {...props} />;
}
function ReaderRoute(props) {
  const ready = useDelayedReady("" + props.textId + "-" + props.chapterNo, 420);
  if (!ready) return <ReaderSkeleton />;
  return <ReaderScreen {...props} />;
}
function StotrasRoute(props) {
  const ready = useDelayedReady((props.initialDeity || "all"), 420);
  if (!ready) return (
    <div className="rise wrap" style={{ padding: "52px 40px 40px" }}>
      <SkLine w={120} h={12} /><SkLine w="50%" h={50} mt={16} /><SkLine w="64%" h={16} mt={16} />
      <SkLine w="100%" h={108} mt={28} r={4} />
      <div style={{ height: 30 }} /><CardGridSkeleton n={6} />
    </div>
  );
  return <StotrasScreen {...props} />;
}
function DeityRoute(props) {
  const ready = useDelayedReady(props.deity || "", 420);
  if (!ready) return (
    <div className="rise">
      <div style={{ background: "var(--night)", padding: "54px 40px 48px" }}>
        <div className="wrap"><SkLine w={90} h={12} /><SkLine w="40%" h={54} mt={20} /><SkLine w="60%" h={16} mt={18} /></div>
      </div>
      <div className="wrap" style={{ padding: "30px 40px" }}><CardGridSkeleton n={6} /></div>
    </div>
  );
  return <DeityScreen {...props} />;
}
function StotraReaderRoute(props) {
  const ready = useDelayedReady(props.id || "", 380);
  if (!ready) return <ReaderSkeleton />;
  return <StotraReaderScreen {...props} />;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState("home");
  const [params, setParams] = useState({});
  const [previewText, setPreviewText] = useState(null);
  const [bookmarks, setBookmarks] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("akshara_marks") || "[]")); } catch { return new Set(); }
  });
  // Daily-recitation favorites — an ORDERED list (distinct from bookmarks),
  // arranged into the sequence one recites each day. Seeded with a gentle
  // starter sequence on first run; the user's own order persists thereafter.
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("akshara_favorites");
      if (raw == null) return ["ganesha-pancharatnam", "lingashtakam", "hanuman-chalisa", "aditya-hridayam"];
      const a = JSON.parse(raw); return Array.isArray(a) ? a : [];
    } catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("akshara_session") || "null"); } catch { return null; }
  });
  const [lang, setLang] = useState(() => localStorage.getItem("akshara_lang") || "sa"); // sa = Sanskrit/Devanagari · te = Telugu

  // apply theme + type scale
  useEffect(() => {
    const themeMap = { manuscript: "", indigo: "indigo", stone: "stone" };
    document.documentElement.setAttribute("data-theme", themeMap[t.theme] ?? "");
    document.documentElement.style.setProperty("--type-scale", t.typeScale);
    if (t.accent) {
      document.documentElement.style.setProperty("--maroon", t.accent);
    }
  }, [t.theme, t.typeScale, t.accent]);

  useEffect(() => {
    localStorage.setItem("akshara_marks", JSON.stringify([...bookmarks]));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("akshara_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    try { user ? localStorage.setItem("akshara_session", JSON.stringify(user)) : localStorage.removeItem("akshara_session"); } catch {}
  }, [user]);

  useEffect(() => { localStorage.setItem("akshara_lang", lang); }, [lang]);

  const immersive = route === "reader" || route === "stotraReader" || route === "auth";
  useEffect(() => { document.body.classList.toggle("immersive", immersive); }, [immersive]);

  function go(r, p = {}) {
    setRoute(r);
    setParams(p);
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  function toggleMark(id) {
    setBookmarks(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  // Newly favorited stotras append to the END of the daily sequence; removing
  // drops them out and the rest close ranks, preserving the chosen order.
  function toggleFav(id) {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function reorderFav(next) { setFavorites(next); }

  const shared = { go, bookmarks, toggleMark, favorites, toggleFav, reorderFav, user, lang, openText: setPreviewText };
  const KNOWN = ["home", "library", "stotras", "deity", "stotraReader", "detail", "reader", "saved", "about", "search", "account", "auth", "calendar", "festivals", "festival", "vrathams", "vratham", "practice", "japa", "plan", "nomus", "nomu", "parayanas", "parayana"];

  return (
    <ErrorBoundary>
      <window.LangContext.Provider value={lang}>
      <OfflineBanner />
      <TopNav route={route} go={go} bookmarks={bookmarks} user={user} lang={lang} setLang={setLang} />
      <main>
        {route === "home" && <HomeScreen {...shared} homeLayout={t.homeLayout} />}
        {route === "library" && <LibraryRoute {...shared} initialColl={params.coll} />}
        {route === "stotras" && <StotrasRoute {...shared} initialDeity={params.deity} favStyle={t.favStyle} />}
        {route === "deity" && <DeityRoute {...shared} deity={params.deity} />}
        {route === "stotraReader" && <StotraReaderRoute {...shared} id={params.id} />}
        {route === "detail" && <TextDetail {...shared} textId={params.textId} />}
        {route === "reader" && <ReaderRoute {...shared} textId={params.textId} chapterNo={params.chapterNo} />}
        {route === "saved" && <MyLibrary {...shared} />}
        {route === "about" && <AboutScreen {...shared} />}
        {route === "search" && <SearchScreen {...shared} initialQuery={params.q} />}
        {route === "calendar" && <PanchangaScreen {...shared} comfy={t.homeLayout === "comfortable"} />}
        {route === "festivals" && <FestivalsScreen {...shared} />}
        {route === "festival" && <FestivalDetailScreen {...shared} id={params.id} />}
        {route === "vrathams" && <VrathamsScreen {...shared} />}
        {route === "vratham" && <VrathamDetailScreen {...shared} id={params.id} />}
        {route === "practice" && <PracticeScreen {...shared} />}
        {route === "japa" && <JapaScreen {...shared} id={params.id} />}
        {route === "plan" && <PlanScreen {...shared} id={params.id} />}
        {route === "nomus" && <NomusScreen {...shared} />}
        {route === "nomu" && <NomuScreen {...shared} id={params.id} />}
        {route === "parayanas" && <ParayanasScreen {...shared} />}
        {route === "parayana" && <ParayanaScreen {...shared} id={params.id} />}
        {route === "auth" && <AuthScreen go={go} onAuth={setUser} bookmarks={bookmarks} />}
        {route === "account" && <AccountScreen go={go} user={user} onSignOut={() => setUser(null)} bookmarks={bookmarks} />}
        {!KNOWN.includes(route) && <NotFound go={go} />}
      </main>
      {route !== "reader" && route !== "stotraReader" && route !== "auth" && <Footer go={go} />}
      {!immersive && <MobileNav route={route} go={go} bookmarks={bookmarks} user={user} />}
      {previewText && <TextPreview textId={previewText} bookmarks={bookmarks} toggleMark={toggleMark}
        onClose={() => setPreviewText(null)}
        go={(r, p) => { setPreviewText(null); go(r, p); }} />}

      <TweaksPanel>
        <TweakSection label="Reading comfort" />
        <TweakRadio label="Layout" value={t.homeLayout}
          options={["comfortable", "classic"]}
          onChange={v => setTweak("homeLayout", v)} />
        <TweakSection label="Daily recitation" />
        <TweakRadio label="Favorites style" value={t.favStyle}
          options={[{ value: "playlist", label: "List" }, { value: "mala", label: "Mālā" }, { value: "night", label: "Night" }]}
          onChange={v => setTweak("favStyle", v)} />
        <TweakSection label="Visual theme" />
        <TweakRadio label="Palette" value={t.theme}
          options={["manuscript", "indigo", "stone"]}
          onChange={v => setTweak({ theme: v, accent: v === "manuscript" ? "#6E1E18" : v === "indigo" ? "#283A66" : "#8A4B23" })} />
        <TweakColor label="Accent" value={t.accent}
          options={["#6E1E18", "#283A66", "#8A4B23", "#2E5E4E", "#5B2A6E"]}
          onChange={v => setTweak("accent", v)} />
        <TweakSection label="Typography" />
        <TweakSlider label="Type scale" value={t.typeScale} min={0.9} max={1.2} step={0.05} unit="×"
          onChange={v => setTweak("typeScale", v)} />
      </TweaksPanel>
      </window.LangContext.Provider>
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

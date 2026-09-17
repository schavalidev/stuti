/* ============================================================
   KATHĀ — app shell: routing, saved stories, tweaks
   ============================================================ */
const KTWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "bg": "cream",
  "accent": "#6E81D2",
  "font": "modern",
  "typeScale": 1,
  "sparkles": true
}/*EDITMODE-END*/;

const KBG = {
  cream:    { bg: "#FFFCF5", soft: "#FFF7E9" },
  white:    { bg: "#FFFFFF", soft: "#F4F4EF" },
  mint:     { bg: "#F2FBF6", soft: "#E6F7EE" },
  blush:    { bg: "#FFF6F8", soft: "#FFEAF0" },
  sky:      { bg: "#F2FAFE", soft: "#E4F2FB" },
  lavender: { bg: "#F8F5FF", soft: "#EEE9FB" },
  peach:    { bg: "#FFF7F1", soft: "#FFECE0" },
  sage:     { bg: "#F5F8F2", soft: "#E9F0E4" },
  grey:     { bg: "#F8F8F6", soft: "#EEEEEA" },
};
const KFONTS = {
  modern:    { display: '"Poppins", system-ui, sans-serif',   body: '"Nunito", system-ui, sans-serif', label: "Modern · Poppins" },
  rounded:   { display: '"Baloo 2", system-ui, sans-serif',   body: '"Nunito", system-ui, sans-serif', label: "Rounded · Baloo" },
  airy:      { display: '"Quicksand", system-ui, sans-serif', body: '"Nunito", system-ui, sans-serif', label: "Airy · Quicksand" },
  geometric: { display: '"Fredoka", system-ui, sans-serif',   body: '"Mukta", system-ui, sans-serif',   label: "Geometric · Fredoka" },
};

/* Skeleton-gated library route */
function KLibraryRoute(props) {
  const ready = useKReady((props.initialFav ? "fav" : props.initialTheme || "all"), 420);
  if (!ready) return (
    <div className="pop wrap" style={{ padding: "44px 36px 30px" }}>
      <KSk w={120} h={12} /><KSk w="52%" h={48} mt={14} /><KSk w="66%" h={16} mt={16} />
      <div style={{ height: 40 }} /><StoryGridSkeleton n={6} />
    </div>
  );
  return <KLibrary {...props} />;
}

function KApp() {
  const [t, setTweak] = useTweaks(KTWEAK_DEFAULTS);
  const [route, setRoute] = useState("home");
  const [params, setParams] = useState({});
  const [family, setFamily] = useState(() => {
    try { return JSON.parse(localStorage.getItem("katha_family") || "null") || { parent: null, children: [], activeId: null }; }
    catch { return { parent: null, children: [], activeId: null }; }
  });
  const activeId = family.activeId || "guest";
  const savedKey = "katha_saved_" + activeId;
  const [saved, setSaved] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(savedKey) || localStorage.getItem("katha_saved") || "[]")); } catch { return new Set(); }
  });

  // Reload saved set when the active reader changes
  useEffect(() => {
    try { setSaved(new Set(JSON.parse(localStorage.getItem("katha_saved_" + activeId) || "[]"))); } catch { setSaved(new Set()); }
  }, [activeId]);

  useEffect(() => { try { localStorage.setItem("katha_family", JSON.stringify(family)); } catch {} }, [family]);

  useEffect(() => {
    const r = document.documentElement.style;
    const bg = KBG[t.bg] || KBG.cream;
    r.setProperty("--bg", bg.bg);
    r.setProperty("--bg-soft", bg.soft);
    r.setProperty("--blue", t.accent);
    const f = KFONTS[t.font] || KFONTS.modern;
    r.setProperty("--font-display", f.display);
    r.setProperty("--font-body", f.body);
    r.setProperty("--type-scale", t.typeScale);
    document.documentElement.classList.toggle("no-sparkle", !t.sparkles);
  }, [t.bg, t.accent, t.font, t.typeScale, t.sparkles]);

  useEffect(() => { localStorage.setItem("katha_saved_" + activeId, JSON.stringify([...saved])); }, [saved, activeId]);

  function go(r, p = {}) { setRoute(r); setParams(p); window.scrollTo({ top: 0 }); }
  function toggleSave(id) { setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  const child = (family.children || []).find(c => c.id === family.activeId) || null;
  const shared = { go, saved, toggleSave };
  const KNOWN = ["home", "library", "detail", "reader", "shelf", "grownups", "search", "calendar", "who", "gate", "family"];
  return (
    <KErrorBoundary>
      <KOfflineBanner />
      <KNav route={route} go={go} saved={saved} child={child} />
      <main>
        {route === "home" && <KHome {...shared} />}
        {route === "library" && <KLibraryRoute {...shared} initialFav={params.fav} initialTheme={params.theme} />}
        {route === "detail" && <KStoryDetail {...shared} storyId={params.id} />}
        {route === "reader" && <KReader {...shared} storyId={params.id} />}
        {route === "shelf" && <KShelf {...shared} />}
        {route === "grownups" && <KGrownups {...shared} />}
        {route === "search" && <KSearch {...shared} initialQuery={params.q} />}
        {route === "calendar" && <KFestivals {...shared} />}
        {route === "who" && <KWho go={go} family={family} setFamily={setFamily} />}
        {route === "gate" && <KParentGate go={go} />}
        {route === "family" && <KFamily go={go} family={family} setFamily={setFamily} />}
        {!KNOWN.includes(route) && <KNotFound go={go} />}
      </main>
      {route !== "reader" && route !== "who" && route !== "gate" && <KFooter go={go} />}

      <TweaksPanel>
        <TweakSection label="Page colour" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, padding: "2px 0 4px" }}>
          {Object.keys(KBG).map(k => (
            <button key={k} onClick={() => setTweak("bg", k)} title={k}
              style={{ width: 30, height: 30, borderRadius: 9, cursor: "pointer", background: KBG[k].bg,
                border: t.bg === k ? "2.5px solid var(--blue)" : "2px solid rgba(0,0,0,0.12)",
                boxShadow: t.bg === k ? "0 0 0 3px color-mix(in srgb, var(--blue) 22%, transparent)" : "none" }} />
          ))}
        </div>
        <TweakColor label="Accent" value={t.accent}
          options={["#6E81D2", "#3FA89D", "#D274A2", "#E0973F", "#66AE80", "#9A86D4"]}
          onChange={v => setTweak("accent", v)} />
        <TweakSection label="Type & feel" />
        <TweakSelect label="Font" value={t.font}
          options={Object.keys(KFONTS).map(k => ({ value: k, label: KFONTS[k].label }))}
          onChange={v => setTweak("font", v)} />
        <TweakSlider label="Text size" value={t.typeScale} min={0.9} max={1.25} step={0.05} unit="×" onChange={v => setTweak("typeScale", v)} />
        <TweakToggle label="Floating sparkles" value={t.sparkles} onChange={v => setTweak("sparkles", v)} />
      </TweaksPanel>
    </KErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<KApp />);

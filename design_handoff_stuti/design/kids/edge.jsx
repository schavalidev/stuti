/* ============================================================
   KATHĀ — Edge & loading states
   404 · offline · skeletons · error boundary
   ============================================================ */
function useKReady(dep, ms = 460) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(false); const t = setTimeout(() => setReady(true), ms); return () => clearTimeout(t); }, [dep]);
  return ready;
}

function KSk({ w = "100%", h = 14, mt = 0, r = 10 }) {
  return <div className="ksk" style={{ width: w, height: h, marginTop: mt, borderRadius: r }} />;
}
function StoryCardSkeleton() {
  return (
    <div style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
      <KSk h={168} r={0} />
      <div style={{ padding: "18px 20px" }}>
        <KSk w="80%" h={22} />
        <KSk w="100%" h={13} mt={12} />
        <KSk w="60%" h={13} mt={8} />
        <div style={{ display: "flex", gap: 12, marginTop: 18 }}><KSk w={56} h={12} /><KSk w={56} h={12} /></div>
      </div>
    </div>
  );
}
function StoryGridSkeleton({ n = 6 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
      {Array.from({ length: n }).map((_, i) => <StoryCardSkeleton key={i} />)}
    </div>
  );
}

function KOfflineBanner() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (online) return null;
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 60, background: "var(--marigold)", color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "10px 16px", fontWeight: 800, fontSize: 14 }}>
      <KIcon name="sparkle" size={16} /> You're offline — your saved stories are still here to read!
    </div>
  );
}

function KNotFound({ go }) {
  return (
    <div className="pop" style={{ minHeight: "74vh", display: "grid", placeItems: "center", textAlign: "center", padding: "60px 36px" }}>
      <div>
        <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Peacock size={110} /></div>
        <h1 style={{ fontSize: "clamp(2.2rem,4vw,3rem)" }}>Oops — this page flew away!</h1>
        <p style={{ fontWeight: 700, color: "var(--ink-soft)", fontSize: 17, maxWidth: 420, margin: "12px auto 0" }}>
          Even Mayuri the peacock can't find it. Let's go back to the stories.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => go("home")}>Take me home <KIcon name="arrowR" size={17} /></button>
          <button className="btn btn-sun" onClick={() => go("library")}><KIcon name="grid" size={16} /> All stories</button>
        </div>
      </div>
    </div>
  );
}

class KErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: "60px 36px", background: "var(--bg)" }}>
          <div style={{ maxWidth: 420 }}>
            <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Peacock size={92} /></div>
            <h1 style={{ fontSize: "2rem" }}>Hmm, the story got tangled</h1>
            <p style={{ fontWeight: 700, color: "var(--ink-soft)", fontSize: 16, marginTop: 12 }}>Let's give it a fresh start.</p>
            <button className="btn btn-primary" style={{ marginTop: 22 }} onClick={() => window.location.reload()}>Try again <KIcon name="arrowR" size={16} /></button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

Object.assign(window, { useKReady, KSk, StoryCardSkeleton, StoryGridSkeleton, KOfflineBanner, KNotFound, KErrorBoundary });

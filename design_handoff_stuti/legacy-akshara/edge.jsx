/* ============================================================
   AKSHARA — Edge & loading states
   404 · offline banner · skeletons · error boundary
   ============================================================ */

/* ---- Simulated load (shows skeletons briefly; swap for real async) ---- */
function useDelayedReady(dep, ms = 480) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [dep]);
  return ready;
}

/* ---- Skeleton primitives ---- */
function SkLine({ w = "100%", h = 14, mt = 0, r = 6 }) {
  return <div className="sk" style={{ width: w, height: h, marginTop: mt, borderRadius: r }} />;
}
function TextCardSkeleton() {
  return (
    <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "24px 24px 22px" }}>
      <SkLine w="40%" h={11} />
      <SkLine w="55%" h={26} mt={18} />
      <SkLine w="80%" h={22} mt={8} />
      <SkLine w="100%" h={13} mt={18} />
      <SkLine w="90%" h={13} mt={8} />
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}><SkLine w={70} h={12} /><SkLine w={80} h={12} /></div>
    </div>
  );
}
function CardGridSkeleton({ n = 6 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
      {Array.from({ length: n }).map((_, i) => <TextCardSkeleton key={i} />)}
    </div>
  );
}
function ReaderSkeleton() {
  return (
    <div className="wrap" style={{ maxWidth: 880, padding: "60px 40px" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ padding: "34px 0", borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><SkLine w="70%" h={26} /></div>
          <div style={{ display: "flex", justifyContent: "center" }}><SkLine w="50%" h={16} mt={18} /></div>
          <div style={{ display: "flex", justifyContent: "center" }}><SkLine w="80%" h={18} mt={20} /></div>
        </div>
      ))}
    </div>
  );
}

/* ---- Offline banner ---- */
function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (online) return null;
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 60, background: "var(--maroon)", color: "var(--on-night)",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "9px 16px", fontSize: 14 }}>
      <Icon name="layers" size={16} />
      You're offline — saved texts remain readable. New texts will load when you reconnect.
    </div>
  );
}

/* ---- 404 ---- */
function NotFound({ go }) {
  return (
    <div className="rise" style={{ minHeight: "72vh", display: "grid", placeItems: "center", textAlign: "center", padding: "60px 40px" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "center", color: "var(--gold)", opacity: 0.7, marginBottom: 12 }}><Mandala size={150} /></div>
        <Sa as="p" style={{ fontSize: 30, color: "var(--maroon)", margin: 0 }}>न विद्यते</Sa>
        <h1 style={{ fontSize: "clamp(2rem,3.4vw,2.8rem)", marginTop: 14 }}>This page wandered off the path</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 16.5, lineHeight: 1.7, maxWidth: 460, margin: "14px auto 0" }}>
          The verse you sought isn't here. Return to the library and begin again.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 30, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => go("home")}>Return home <Icon name="arrowR" size={16} /></button>
          <button className="btn btn-ghost" onClick={() => go("library")}><Icon name="search" size={16} /> Browse texts</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Error boundary ---- */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: "60px 40px", background: "var(--paper)" }}>
          <div style={{ maxWidth: 460 }}>
            <div style={{ display: "flex", justifyContent: "center", color: "var(--gold)", opacity: 0.6, marginBottom: 8 }}><Lotus size={40} color="var(--gold)" /></div>
            <h1 style={{ fontSize: "2rem" }}>Something interrupted the reading</h1>
            <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.7, marginTop: 12 }}>An unexpected error occurred. Reloading usually sets things right.</p>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => window.location.reload()}>Reload <Icon name="arrowR" size={16} /></button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

Object.assign(window, { useDelayedReady, SkLine, TextCardSkeleton, CardGridSkeleton, ReaderSkeleton, OfflineBanner, NotFound, ErrorBoundary });

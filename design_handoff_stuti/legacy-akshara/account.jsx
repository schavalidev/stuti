/* ============================================================
   AKSHARA — Accounts (optional sign-in to sync) — mocked session
   ============================================================ */
function AuthScreen({ go, onAuth, bookmarks }) {
  const [mode, setMode] = useState("signin");   // signin | create
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const create = mode === "create";
  const valid = email.includes("@") && pw.length >= 4 && (!create || name.trim());

  function submit(e) {
    e.preventDefault();
    if (!valid) return;
    onAuth({ name: create ? name.trim() : email.split("@")[0], email, since: Date.now() });
    go("account");
  }

  const field = (label, value, set, type = "text", ph = "") => (
    <label style={{ display: "block", marginTop: 18 }}>
      <span style={{ fontSize: 12.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{label}</span>
      <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={ph}
        style={{ display: "block", width: "100%", marginTop: 8, padding: "13px 16px", fontFamily: "var(--font-body)", fontSize: 16,
          background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--ink)", outline: "none" }} />
    </label>
  );

  return (
    <div className="rise" style={{ minHeight: "78vh", display: "grid", placeItems: "center", padding: "50px 24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <span style={{ width: 56, height: 56, borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px solid var(--gold)", color: "var(--maroon)", fontFamily: "var(--font-deva)", fontSize: 30, paddingBottom: 3 }}>ॐ</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.9rem,3vw,2.4rem)" }}>{create ? "Create your shelf" : "Welcome back"}</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.6, marginTop: 10 }}>
            Sign in to sync your saved texts and reading place across devices. Reading is always free and open — an account only carries your shelf with you.
          </p>
        </div>

        <form onSubmit={submit} style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "28px 28px 30px" }}>
          {create && field("Name", name, setName, "text", "Your name")}
          {field("Email", email, setEmail, "email", "you@example.com")}
          {field("Password", pw, setPw, "password", "••••••••")}
          <button type="submit" className="btn btn-primary" disabled={!valid}
            style={{ width: "100%", justifyContent: "center", marginTop: 24, opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "default" }}>
            {create ? "Create account" : "Sign in"} <Icon name="arrowR" size={16} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>or</span>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>
          <button type="button" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => go("library")}>
            Continue without an account
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14.5, color: "var(--ink-soft)", marginTop: 22 }}>
          {create ? "Already have an account?" : "New to Akshara?"}{" "}
          <button onClick={() => setMode(create ? "signin" : "create")} style={{ background: "none", border: 0, color: "var(--maroon)", fontWeight: 600, fontSize: 14.5 }}>
            {create ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}

function AccountScreen({ go, user, onSignOut, bookmarks }) {
  if (!user) {
    return (
      <div className="rise" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center", padding: "60px 40px" }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "center", color: "var(--gold)", opacity: 0.6, marginBottom: 10 }}><Lotus size={36} color="var(--gold)" /></div>
          <h1 style={{ fontSize: "2rem" }}>Your account</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.7, marginTop: 12 }}>Sign in to sync your shelf and reading place across devices.</p>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => go("auth")}>Sign in <Icon name="arrowR" size={16} /></button>
        </div>
      </div>
    );
  }
  const initials = (user.name || user.email || "?").slice(0, 1).toUpperCase();
  const since = new Date(user.since || Date.now()).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  return (
    <div className="rise">
      <section style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-6%", top: "50%", transform: "translateY(-50%)", color: "var(--gold-bright)", opacity: 0.1 }}><Mandala size={460} spin /></div>
        <div className="wrap" style={{ padding: "56px 40px", position: "relative", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <span style={{ width: 76, height: 76, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--gold-bright)", color: "var(--night)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 34 }}>{initials}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>Signed in</span>
            <h1 style={{ fontSize: "clamp(2rem,3.4vw,2.8rem)", color: "var(--on-night)", marginTop: 6 }}>{user.name}</h1>
            <p style={{ color: "var(--on-night-soft)", fontSize: 15, marginTop: 4 }}>{user.email}</p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--gold-bright)", fontSize: 14, border: "1px solid rgba(240,228,204,0.3)", borderRadius: 999, padding: "8px 16px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold-bright)" }} className="pulse" /> Synced
          </span>
        </div>
      </section>

      <section className="wrap" style={{ padding: "48px 40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16 }}>
          {[["Saved texts", bookmarks.size], ["Member since", since], ["Sync", "On"]].map(([l, v]) => (
            <div key={l} style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "24px 26px" }}>
              <div style={{ fontSize: 12.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{l}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--maroon)", marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => go("saved")}>Open my library <Icon name="arrowR" size={16} /></button>
          <button className="btn btn-ghost" onClick={() => { onSignOut(); go("home"); }}>Sign out</button>
        </div>
        <p style={{ color: "var(--ink-faint)", fontStyle: "normal", fontSize: 14, marginTop: 22 }}>
          This is a front-end demo — sign-in stays on this device until connected to a real account service.
        </p>
      </section>
    </div>
  );
}

Object.assign(window, { AuthScreen, AccountScreen });

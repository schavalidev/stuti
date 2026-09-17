/* ============================================================
   KATHĀ — Family: parent gate · parent account · child profiles
   ============================================================ */
const KID_ANIMALS = ["🦚", "🐯", "🐘", "🦋", "🐢", "🦜", "🦊", "🐬"];
const KID_COLORS = ["var(--blue)", "var(--marigold)", "var(--teal)", "var(--pink)", "var(--green)", "var(--purple)", "var(--coral)", "var(--sky)"];
let _kidSeq = 0;
function newKidId() { return "k" + Date.now().toString(36) + (_kidSeq++); }

function KidAvatar({ child, size = 64, ring = false }) {
  return (
    <span style={{ width: size, height: size, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
      background: child.color, color: "#fff", fontSize: size * 0.5, boxShadow: ring ? "0 0 0 4px color-mix(in srgb, " + child.color + " 30%, transparent)" : "var(--shadow-sm)" }}>
      {child.animal}
    </span>
  );
}

/* ---------- Parent gate ---------- */
function KParentGate({ go }) {
  const [a] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [b] = useState(() => 2 + Math.floor(Math.random() * 6));
  const [val, setVal] = useState("");
  const [shake, setShake] = useState(false);
  function check(e) {
    e.preventDefault();
    if (parseInt(val, 10) === a + b) go("family");
    else { setShake(true); setVal(""); setTimeout(() => setShake(false), 500); }
  }
  return (
    <div className="pop" style={{ minHeight: "78vh", display: "grid", placeItems: "center", padding: "40px 24px" }}>
      <form onSubmit={check} className={shake ? "gate-shake" : ""}
        style={{ width: "100%", maxWidth: 420, background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "34px 32px", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "var(--bg-soft)", fontSize: 32, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: "1.7rem" }}>Ask a grown-up</h1>
        <p style={{ fontWeight: 700, color: "var(--ink-soft)", fontSize: 15, marginTop: 8 }}>This bit is for parents. Please solve to continue.</p>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--blue)", margin: "22px 0 12px" }}>{a} + {b} = ?</div>
        <input value={val} onChange={e => setVal(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" autoFocus
          style={{ width: 120, textAlign: "center", padding: "12px 14px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
            border: "2px solid var(--line)", borderRadius: 14, outline: "none", color: "var(--ink)" }} />
        <button type="submit" className="btn btn-primary" style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: 22 }}>Enter <KIcon name="arrowR" size={16} /></button>
        <button type="button" onClick={() => go("home")} style={{ background: "none", border: 0, color: "var(--ink-faint)", fontWeight: 800, fontSize: 14, marginTop: 14 }}>Never mind</button>
      </form>
    </div>
  );
}

/* ---------- Child profile editor (inline) ---------- */
function KidEditor({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(6);
  const [animal, setAnimal] = useState(KID_ANIMALS[0]);
  const [color, setColor] = useState(KID_COLORS[0]);
  return (
    <div style={{ background: "var(--bg-soft)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "26px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <KidAvatar child={{ animal, color }} size={64} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Reader's name" autoFocus
          style={{ flex: 1, minWidth: 180, padding: "12px 16px", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 17, border: "2px solid var(--line)", borderRadius: 14, outline: "none" }} />
      </div>
      <div style={{ marginTop: 18, fontWeight: 800, fontSize: 13, color: "var(--ink-faint)", letterSpacing: "0.06em" }}>PICK AN ANIMAL</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        {KID_ANIMALS.map(a => (
          <button key={a} onClick={() => setAnimal(a)} type="button"
            style={{ width: 46, height: 46, borderRadius: 14, fontSize: 24, border: animal === a ? "2.5px solid var(--blue)" : "2px solid var(--line)", background: "#fff" }}>{a}</button>
        ))}
      </div>
      <div style={{ marginTop: 18, fontWeight: 800, fontSize: 13, color: "var(--ink-faint)", letterSpacing: "0.06em" }}>PICK A COLOUR</div>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 10 }}>
        {KID_COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)} type="button"
            style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: color === c ? "3px solid var(--ink)" : "2px solid rgba(0,0,0,0.1)" }} />
        ))}
      </div>
      <div style={{ marginTop: 18, fontWeight: 800, fontSize: 13, color: "var(--ink-faint)", letterSpacing: "0.06em" }}>AGE</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
          <button key={n} onClick={() => setAge(n)} type="button"
            style={{ width: 42, height: 42, borderRadius: 12, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16,
              border: 0, background: age === n ? "var(--blue)" : "#fff", color: age === n ? "#fff" : "var(--ink-soft)", boxShadow: age === n ? "none" : "inset 0 0 0 2px var(--line)" }}>{n}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button className="btn btn-primary" disabled={!name.trim()} style={{ opacity: name.trim() ? 1 : 0.5 }}
          onClick={() => name.trim() && onSave({ id: newKidId(), name: name.trim(), age, animal, color })}>Add reader</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ---------- "Who's reading?" picker ---------- */
function KWho({ go, family, setFamily }) {
  const [adding, setAdding] = useState(false);
  const children = family.children || [];
  function pick(id) { setFamily(f => ({ ...f, activeId: id })); go("home"); }
  function add(child) { setFamily(f => ({ ...f, children: [...(f.children || []), child], activeId: child.id })); setAdding(false); go("home"); }
  return (
    <div className="pop" style={{ minHeight: "78vh", display: "grid", placeItems: "center", padding: "50px 24px" }}>
      <div style={{ width: "100%", maxWidth: 720, textAlign: "center" }}>
        <span className="eyebrow" style={{ color: "var(--blue)" }}>Welcome to Kathā</span>
        <h1 style={{ fontSize: "clamp(2.2rem,4.6vw,3.2rem)", margin: "12px 0 0" }}>Who's reading today?</h1>

        {adding ? (
          <div style={{ marginTop: 30, textAlign: "left" }}><KidEditor onSave={add} onCancel={() => setAdding(false)} /></div>
        ) : (
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", justifyContent: "center", marginTop: 40 }}>
            {children.map(c => (
              <button key={c.id} onClick={() => pick(c.id)} style={{ background: "none", border: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <span className="who-av" style={{ transition: "transform .16s" }}><KidAvatar child={c} size={104} ring={family.activeId === c.id} /></span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19 }}>{c.name}</span>
              </button>
            ))}
            <button onClick={() => setAdding(true)} style={{ background: "none", border: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <span style={{ width: 104, height: 104, borderRadius: "50%", display: "grid", placeItems: "center", background: "#fff", border: "3px dashed var(--line)", color: "var(--ink-faint)", fontSize: 44 }}>+</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: "var(--ink-soft)" }}>Add a reader</span>
            </button>
          </div>
        )}

        <p style={{ marginTop: 40, fontWeight: 700, color: "var(--ink-faint)", fontSize: 14 }}>
          Grown-up?{" "}
          <button onClick={() => go("gate")} style={{ background: "none", border: 0, color: "var(--blue)", fontWeight: 800, fontSize: 14 }}>Open parent settings</button>
        </p>
      </div>
    </div>
  );
}

/* ---------- Parent account & profile management (behind the gate) ---------- */
function KFamily({ go, family, setFamily }) {
  const [adding, setAdding] = useState(false);
  const parent = family.parent;
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const children = family.children || [];

  function signIn(e) {
    e.preventDefault();
    if (!email.includes("@") || pw.length < 4) return;
    setFamily(f => ({ ...f, parent: { name: email.split("@")[0], email, since: Date.now() } }));
  }
  function addChild(child) { setFamily(f => ({ ...f, children: [...(f.children || []), child] })); setAdding(false); }
  function removeChild(id) { setFamily(f => ({ ...f, children: f.children.filter(c => c.id !== id), activeId: f.activeId === id ? null : f.activeId })); }

  if (!parent) {
    return (
      <div className="pop wrap" style={{ padding: "44px 36px 50px", maxWidth: 520 }}>
        <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, fontWeight: 800, color: "var(--ink-soft)", marginBottom: 16 }}>
          <KIcon name="arrowL" size={18} /> Home
        </button>
        <span className="eyebrow" style={{ color: "var(--purple)" }}>Parent account</span>
        <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.6rem)", margin: "10px 0 0" }}>Sign in to manage your family</h1>
        <p style={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: 16, marginTop: 10 }}>Sync each child's saved stories and reading place across devices. Reading is always free.</p>
        <form onSubmit={signIn} style={{ background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-lg)", padding: "26px 26px", marginTop: 24 }}>
          <label style={{ display: "block" }}><span style={{ fontWeight: 800, fontSize: 13, color: "var(--ink-faint)" }}>EMAIL</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={{ display: "block", width: "100%", marginTop: 8, padding: "13px 16px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, border: "2px solid var(--line)", borderRadius: 14, outline: "none" }} /></label>
          <label style={{ display: "block", marginTop: 16 }}><span style={{ fontWeight: 800, fontSize: 13, color: "var(--ink-faint)" }}>PASSWORD</span>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••"
              style={{ display: "block", width: "100%", marginTop: 8, padding: "13px 16px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, border: "2px solid var(--line)", borderRadius: 14, outline: "none" }} /></label>
          <button type="submit" className="btn btn-primary" disabled={!(email.includes("@") && pw.length >= 4)} style={{ width: "100%", justifyContent: "center", marginTop: 22, opacity: (email.includes("@") && pw.length >= 4) ? 1 : 0.5 }}>Sign in / Create <KIcon name="arrowR" size={16} /></button>
        </form>
      </div>
    );
  }

  return (
    <div className="pop wrap" style={{ padding: "44px 36px 50px", maxWidth: 760 }}>
      <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, fontWeight: 800, color: "var(--ink-soft)", marginBottom: 16 }}>
        <KIcon name="arrowL" size={18} /> Home
      </button>
      <span className="eyebrow" style={{ color: "var(--purple)" }}>Parent account</span>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "clamp(1.9rem,3.4vw,2.5rem)" }}>{parent.name}'s family</h1>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 800, fontSize: 13, color: "var(--green)", background: "color-mix(in srgb, var(--green) 14%, #fff)", borderRadius: 999, padding: "6px 14px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} /> Synced
        </span>
      </div>
      <p style={{ fontWeight: 700, color: "var(--ink-faint)", fontSize: 14.5, marginTop: 4 }}>{parent.email}</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, margin: "34px 0 18px", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "1.5rem" }}>Reader profiles</h2>
        {!adding && <button className="btn btn-sun" onClick={() => setAdding(true)}>+ Add a reader</button>}
      </div>

      {adding && <div style={{ marginBottom: 18 }}><KidEditor onSave={addChild} onCancel={() => setAdding(false)} /></div>}

      {children.length === 0 && !adding ? (
        <div style={{ textAlign: "center", padding: "44px 20px", background: "var(--bg-soft)", border: "2px solid var(--line)", borderRadius: "var(--r-lg)" }}>
          <p style={{ fontWeight: 800, color: "var(--ink-soft)", fontSize: 18 }}>No readers yet</p>
          <p style={{ fontWeight: 700, color: "var(--ink-faint)" }}>Add a child profile to keep their stories separate.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 14 }}>
          {children.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "2px solid var(--line)", borderRadius: "var(--r-md)", padding: "16px 18px" }}>
              <KidAvatar child={c} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>{c.name}</div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-faint)" }}>Age {c.age}{family.activeId === c.id ? " · reading now" : ""}</div>
              </div>
              <button onClick={() => removeChild(c.id)} aria-label="Remove" style={{ background: "none", border: 0, color: "var(--ink-faint)", padding: 6 }}><KIcon name="close" size={18} /></button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => go("who")}>Switch reader <KIcon name="arrowR" size={16} /></button>
        <button className="btn btn-ghost" onClick={() => setFamily(f => ({ ...f, parent: null }))}>Sign out</button>
      </div>
      <p style={{ color: "var(--ink-faint)", fontWeight: 600, fontSize: 13.5, marginTop: 20 }}>
        This is a front-end demo — sign-in and profiles stay on this device until connected to a real account service.
      </p>
    </div>
  );
}

Object.assign(window, { KidAvatar, KParentGate, KWho, KFamily, KidEditor });

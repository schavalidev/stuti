/* ============================================================
   AKSHARA (young minds) — Bookcase with face-out books
   ============================================================ */
function FaceOutBook({ s, go, saved, toggleSave }) {
  const marked = saved.has(s.id);
  return (
    <button className="facebook" onClick={() => go("detail", { id: s.id })}>
      <div className="facebook-cover" style={{ background: s.color }}>
        <SceneArt name={s.scene} accent={s.color} />
        <span className="facebook-heart" data-on={marked} onClick={(e) => {e.stopPropagation();toggleSave(s.id);}}
        style={{ color: marked ? "var(--pink)" : "var(--ink-faint)" }}>
          <KIcon name="heart" size={16} />
        </span>
      </div>
      <div className="facebook-label">
        <div className="facebook-title">{s.title}</div>
        <div className="facebook-meta">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><KIcon name="star" size={13} /> {s.age}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><KIcon name="clock" size={13} /> {s.mins}m</span>
        </div>
      </div>
    </button>);

}

function Bookcase({ list, go, saved, toggleSave }) {
  const backRef = useRef(null);
  const [perShelf, setPerShelf] = useState(4);
  useEffect(() => {
    const el = backRef.current;if (!el || !window.ResizeObserver) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth - 28;
      setPerShelf(Math.max(2, Math.floor(w / 184)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const themes = window.KATHA_DATA.themes;
  const groups = themes.
  map((t) => ({ t, books: list.filter((b) => b.theme === t.id) })).
  filter((g) => g.books.length);

  const chunk = (arr) => {
    const out = [];
    for (let i = 0; i < arr.length; i += perShelf) out.push(arr.slice(i, i + perShelf));
    return out;
  };

  const subgenres = window.KATHA_DATA.subgenres || {};
  const renderShelves = (arr) => chunk(arr).map((shelf, si) =>
  <div className="shelf" key={si}>
      <div className="shelf-books">
        {shelf.map((s) => <FaceOutBook key={s.id} s={s} go={go} saved={saved} toggleSave={toggleSave} />)}
      </div>
      <div className="shelf-plank" />
    </div>
  );

  return (
    <div className="bookcase">
      <div className="bookcase-back" ref={backRef}>
        {groups.map(({ t, books }) => {
          const subs = subgenres[t.id];
          return (
            <div className="genre-section" key={t.id}>
              <div className="genre-label">
                <span className="gl-ico" style={{ background: `color-mix(in srgb, ${t.color} 16%, #fff)`, color: t.color }}><KIcon name={t.icon} size={18} /></span>
                <span className="genre-deva" style={{ fontFamily: "Quicksand" }}>{t.translit} - {t.deva}</span>
                <span className="genre-name">{t.name}</span>
                <span className="genre-count">{books.length} {books.length === 1 ? "book" : "books"}</span>
              </div>
              {subs ?
              subs.map((sg) => {
                const sb = books.filter((b) => b.sub === sg.id);
                if (!sb.length) return null;
                return (
                  <div className="subgenre-block" key={sg.id}>
                        <div className="subgenre-label">
                          <span className="sg-dot" style={{ background: t.color }} />
                          <span className="sg-name">{sg.name}</span>
                          <span className="sg-deva">{sg.deva}</span>
                          <span className="sg-count">{sb.length}</span>
                        </div>
                        {renderShelves(sb)}
                      </div>);

              }) :
              renderShelves(books)}
            </div>);

        })}
      </div>
    </div>);

}

Object.assign(window, { FaceOutBook, Bookcase });
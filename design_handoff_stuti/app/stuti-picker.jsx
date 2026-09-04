/* ============================================================
   STUTI — Picker: a considered replacement for <select>.
   A field that opens a sheet of options; current one is ticked.
   options: [{ value, label, sub?, font? }]
   ============================================================ */
const { useState: useStateSel, useEffect: useEffectSel } = React;

function Picker({ value, options, onChange, placeholder, font, id, ariaLabel, searchable }) {
  const [open, setOpen] = useStateSel(false);
  const [q, setQ] = useStateSel("");
  const cur = options.find(o => o.value === value);
  const showSearch = searchable && options.length > 6;
  const fold = window.STUTI_TRANSLIT.fold;
  const shown = showSearch && q.trim()
    ? options.filter(o => fold(o.label + " " + (o.sub || "")).includes(fold(q.trim())))
    : options;
  useEffectSel(() => {
    if (!open) return;
    setQ("");
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  return (
    <React.Fragment>
      <button id={id} type="button" className="sel-field" aria-haspopup="listbox" aria-expanded={open}
        aria-label={ariaLabel} onClick={() => setOpen(true)}>
        <span className="sel-value" style={font ? { fontFamily: font } : null}>
          {cur ? cur.label : <span className="sel-ph">{placeholder || "—"}</span>}
        </span>
        <span className="sel-caret"><Icon name="chev" size={16} /></span>
      </button>
      {open && (
        <React.Fragment>
          <div className="sel-scrim" onClick={() => setOpen(false)} />
          <div className="sel-sheet" role="listbox" aria-label={ariaLabel}>
            <div className="sel-sheet-grip" />
            {showSearch && (
              <div className="sel-search">
                <Icon name="search" size={16} />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder={placeholder || "—"} />
              </div>
            )}
            <div className="sel-sheet-list scroll">
              {shown.map(o => (
                <button key={String(o.value)} type="button" role="option" aria-selected={o.value === value}
                  className={"sel-opt" + (o.value === value ? " on" : "")}
                  onClick={() => { onChange(o.value); setOpen(false); }}>
                  <span className="sel-opt-body">
                    <span className="sel-opt-label" style={o.font || font ? { fontFamily: o.font || font } : null}>{o.label}</span>
                    {o.sub && <span className="sel-opt-sub">{o.sub}</span>}
                  </span>
                  {o.value === value && <Icon name="check" size={18} />}
                </button>
              ))}
              {shown.length === 0 && <div className="sel-empty">{placeholder || "—"}</div>}
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

/* Sheets must escape the scrolled view: the enter animation leaves an identity
   transform on .view, which would otherwise become the containing block for
   position:fixed children. The app frame keeps a dedicated overlay host. */
function OverlayPortal({ children }) {
  const host = typeof document !== "undefined" && document.querySelector(".app-overlay");
  return host ? ReactDOM.createPortal(children, host) : children;
}

Object.assign(window, { Picker, OverlayPortal });

/* ============================================================
   STUTI — the janma dinams on each deity's shelf
   The same table the Navagraha shelf keeps: the day's name, its month
   and tithi, then the hour and the tradition. The next date the tithi
   falls on stands at the right with a bell. Opens showing the rows when
   the shelf is read through one form, folded when the whole shelf is.
   ============================================================ */
const { useState: useDjS } = React;
const djPick = (o, lang) => !o ? "" : (lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.roman) : o.roman) || "";
const DJ_LBL = {
  tradition: { roman: "Tradition", deva: "परम्परा", tel: "సంప్రదాయం" },
  parents:   { roman: "Parents", deva: "माता-पिता", tel: "తల్లిదండ్రులు" },
};
const djFont = (lang) => lang === "telugu" ? "var(--font-telugu)" : lang === "roman" ? "var(--font-display)" : "var(--font-deva)";

function DeityJanmaTable({ deity, lang = "deva", form = "all" }) {
  const G = window.STUTI_DEITY_JANMA, V = window.STUTI_VRATA;
  if (!G || !deity) return null;
  const rows = G.forDeity(deity, form);
  const lens = form || "all";
  const key = "stuti-fold-deity-janma-" + deity + "-" + lens;
  /* the whole shelf opens minimised; one form's lens opens showing its tithi */
  const defaultShut = lens === "all";
  const [shut, setShut] = useDjS(true);
  React.useEffect(() => {
    let v = null; try { v = localStorage.getItem(key); } catch (e) {}
    setShut(v === null ? defaultShut : v === "1");
  }, [key]);
  if (!rows.length) return null;
  const toggle = () => setShut((s) => { try { localStorage.setItem(key, s ? "0" : "1"); } catch (e) {} return !s; });
  const font = djFont(lang);
  const locale = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN";
  const next = (r) => {
    try {
      const v = V.lookup(G.vratId(r)); const d = v && V.nextDate(v);
      return d ? d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : "";
    } catch (e) { return ""; }
  };
  return (
    <div className="gj">
      <button className={"gs-sec gs-sec-btn" + (shut ? " shut" : "")} onClick={toggle} aria-expanded={!shut}>
        <span className="gs-sec-caret" aria-hidden="true" />
        <span className="gs-sec-name">{djPick(G.T.cap, lang)}</span>
        <span className="gs-sec-n">{rows.length}</span>
      </button>
      {!shut && (
        <div className="gj-rows">
          {rows.map((r) => (
            <div className="gj-row" key={r.id}>
              {window.KeepBell && <span className="pit-row-bell"><window.KeepBell kind="vrata" id={G.vratId(r)} lang={lang} size={18} /></span>}
              <div className="gj-body">
                <div className="gj-graha" style={{ fontFamily: font }}>{djPick(r.name, lang)}</div>
                {r.tithi2 && <div className="gj-lbl" style={{ fontFamily: font }}>{djPick(DJ_LBL.tradition, lang)}</div>}
                <div className="gj-when" style={{ fontFamily: font }}>{djPick(r.tithi, lang)}</div>
                {r.tithi2 && <div className="gj-when" style={{ fontFamily: font }}>{djPick(r.tithi2, lang)}</div>}
                {r.naks && <div className="gj-when" style={{ fontFamily: font }}>{djPick(r.naks, lang)}</div>}
                {r.meta && <div className="gj-lbl" style={{ fontFamily: font }}>{djPick(DJ_LBL.parents, lang)}</div>}
                {r.meta && <div className="gj-meta" style={{ fontFamily: font }}>{djPick(r.meta, lang)}</div>}
                {r.origin && <div className="gj-meta" style={{ fontFamily: font }}>{djPick(r.origin, lang)}</div>}
              </div>
              <div className="gj-side">
                <span className="gj-next">{next(r)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
Object.assign(window, { DeityJanmaTable });

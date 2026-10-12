import React from "react";
import { STUTI_GRAHA_JANMA } from "./stuti-graha-janma-core";
import { KeepBell } from "./stuti-keep";
import { STUTI_VRATA } from "./stuti-vrata-data";

/* ============================================================
   STUTI — the navagraha janma dinams, on the Navagraha shelf
   Nine rows read down like the shelf's own index: the graha, then its
   tithi and weekday, then gotra, nakṣatra and saṁvatsara. The next date
   the tithi falls on stands at the right with a bell, so the table and
   the calendar are one thing seen from two sides.
   ============================================================ */
const { useState: useGjS } = React;
const gjPick = (o, lang) => !o ? "" : (lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.roman) : o.roman) || "";
const gjFont = (lang) => lang === "telugu" ? "var(--font-telugu)" : lang === "roman" ? "var(--font-display)" : "var(--font-deva)";

function GrahaJanmaTable({ lang = "deva", form = "all" }) {
  const G = STUTI_GRAHA_JANMA, V = STUTI_VRATA;
  if (!G) return null;
  const rows = G.byForm(form);
  if (!rows.length) return null;
  const font = gjFont(lang);
  const lens = form || "all";
  const key = "stuti-fold-graha-janma-" + lens;
  /* the whole-shelf lenses open minimised; a single graha's tab opens showing its tithi */
  const defaultShut = lens === "all" || lens === "navagraha";
  const [shut, setShut] = useGjS(() => { try { const v = localStorage.getItem(key); return v === null ? defaultShut : v === "1"; } catch (e) { return defaultShut; } });
  React.useEffect(() => {
    let v = null; try { v = localStorage.getItem(key); } catch (e) {}
    setShut(v === null ? defaultShut : v === "1");
  }, [key]);
  const toggle = () => setShut((s) => { try { localStorage.setItem(key, s ? "0" : "1"); } catch (e) {} return !s; });
  const locale = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN";
  /* the next time the tithi falls, counted from today — the year is named
     when it is not this year, so a date that has passed cannot be read here */
  const next = (r) => {
    try {
      const v = V.lookup(G.vratId(r)); const d = v && V.nextDate(v);
      if (!d) return "";
      return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
    } catch (e) { return ""; }
  };
  return (
    <div className="gj">
      <button className={"gs-sec gs-sec-btn" + (shut ? " shut" : "")} onClick={toggle} aria-expanded={!shut}>
        <span className="gs-sec-caret" aria-hidden="true" />
        <span className="gs-sec-name">{gjPick(G.T.cap, lang)}</span>
        <span className="gs-sec-n">{rows.length}</span>
      </button>
      {!shut && (
        <div className="gj-rows">
          {rows.map((r) => (
            <div className="gj-row" key={r.id}>
              {KeepBell && <span className="pit-row-bell"><KeepBell kind="vrata" id={G.vratId(r)} lang={lang} size={18} /></span>}
              <div className="gj-body">
                <div className="gj-graha" style={{ fontFamily: font }}>{gjPick(r.graha, lang)}</div>
                <div className="gj-when" style={{ fontFamily: font }}>{gjPick(r.tithi, lang)} · {gjPick(r.vara, lang)}</div>
                <div className="gj-meta" style={{ fontFamily: font }}>{gjPick(r.rishi, lang)} {gjPick(G.T.gotra, lang)} · {gjPick(r.naks, lang)} · {gjPick(r.samv, lang)}</div>
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
export { GrahaJanmaTable };

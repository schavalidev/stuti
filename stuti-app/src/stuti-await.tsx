import { Icon, Seal, deityStyle } from "./stuti-icons";
import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { STUTI_WATCH } from "./stuti-watch";

/* ============================================================
   STUTI — awaiting text
   A catalogued stotra whose verses are not keyed yet. The name is
   real, the text is coming: say so plainly, let the reciter ask to
   be told, and offer what is ready for the same deity meanwhile.
   ============================================================ */
const { useState: useStateW, useEffect: useEffectW } = React;

function useWatch(id) {
  const [on, setOn] = useStateW(() => STUTI_WATCH.has(id));
  useEffectW(() => STUTI_WATCH.subscribe(() => setOn(STUTI_WATCH.has(id))), [id]);
  return [on, () => STUTI_WATCH.toggle(id)];
}

function AwaitingText({ hymn, deity, go, lang = "deva", theme, toggleTheme, backView = "deity", retView }) {
  const S = STUTI, L = STUTI_L;
  const [watched, toggle] = useWatch(hymn.id);
  const font = L.font(lang);
  const ready = S.hymnsForDeity(deity.id).filter((h) => !h.catalog && h.verses && h.verses.length).slice(0, 3);
  return (
    <div className="view reader" style={deityStyle(deity, { flex: 1 })}>
      <div className="topbar reader-topbar">
        <button className="icon-btn" onClick={() => go(backView, { deity: deity.id, from: retView })} aria-label={STUTI_L.a("aBack")}><Icon name="back" /></button>
        <div className="reader-topbar-title">
          <div className="reader-topbar-name display" style={{ fontFamily: font }}>{L.hymnTitle(hymn, lang)}</div>
          <div className="reader-topbar-by">{hymn.by}</div>
        </div>
        <div className="reader-topbar-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label={STUTI_L.a("dayNight")}>
            <Icon name={theme === "night" ? "sun" : "moon"} />
          </button>
        </div>
      </div>

      <div className="reader-scroll scroll">
        <div className="aw-wrap">
          <Seal d={deity} size={72} />
          <h1 className="aw-name display" style={{ fontFamily: font }}>{L.hymnTitle(hymn, lang)}</h1>
          <div className="aw-meta">
            <span>{L.name(deity, lang)}</span><span className="dot" /><span>{hymn.type}</span>
          </div>
          <div className="aw-badge"><Icon name="clock" size={15} /> {L.t("awaitingTitle", lang)}</div>
          <p className="aw-body">{L.t("awaitingBody", lang)}</p>

          <button className={"aw-tell" + (watched ? " on" : "")} onClick={toggle}>
            {watched ? <React.Fragment><Icon name="check" size={17} /> {L.t("willTell", lang)}</React.Fragment>
                     : <React.Fragment><Icon name="bell" size={17} /> {L.t("tellMe", lang)}</React.Fragment>}
          </button>
          {watched && <div className="aw-tell-note">{L.t("willTellNote", lang)}</div>}

          {ready.length > 0 && (
            <div className="aw-mean">
              <div className="eyebrow">{L.t("meanwhile", lang)}</div>
              <div className="hymn-list">
                {ready.map((h) => (
                  <div className="hymn-card" key={h.id} style={deityStyle(deity)}>
                    <button className="hymn-card-main" onClick={() => go("reader", { hymn: h.id, deity: deity.id, from: "deity", ret: backView })}>
                      <div className="hymn-card-lead" style={{ fontFamily: font, fontSize: 21, color: "var(--accent-ink)", lineHeight: 1.25 }}>{L.hymnTitle(h, lang)}</div>
                      <div className="hymn-card-meta">
                        <span>{h.type}</span><span className="dot" /><span>{L.versesCount(h.verses.length, lang)}</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ height: 30 }} />
        </div>
      </div>
    </div>
  );
}

/* Nitya card — appears only once something is being waited for */
function WatchCard({ go, lang = "deva" }) {
  const S = STUTI, L = STUTI_L;
  const [ids, setIds] = useStateW(() => STUTI_WATCH.list());
  const [open, setOpen] = useStateW(false);
  useEffectW(() => STUTI_WATCH.subscribe(setIds), []);
  const items = ids.map((id) => S.hymnById(id)).filter(Boolean);
  if (!items.length) return null;
  return (
    <div className={"watch-card" + (open ? " open" : "")}>
      <button className="watch-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="watch-mark"><Icon name="clock" size={19} /></span>
        <span className="watch-head-body">
          <span className="watch-title">{L.t("watching", lang)}</span>
          <span className="watch-sub">{items.length} · {L.t("watchingSub", lang)}</span>
        </span>
        <Icon name="chev" size={18} />
      </button>
      {open && (
        <div className="watch-list">
          {items.map((h) => {
            const d = S.deityById[h.deity];
            return (
              <div className="watch-row" key={h.id} style={deityStyle(d)}>
                <button className="watch-row-main" onClick={() => go("reader", { hymn: h.id, deity: h.deity, from: "daily" })}>
                  <Seal d={d} size={30} />
                  <span className="watch-row-text">
                    <span style={{ fontFamily: L.font(lang) }}>{L.hymnTitle(h, lang)}</span>
                    <small>{L.name(d, lang)}</small>
                  </span>
                </button>
                <button className="watch-row-x" onClick={() => STUTI_WATCH.remove(h.id)} aria-label={L.t("removeWatch", lang)}>×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { AwaitingText, WatchCard, useWatch };

/* ============================================================
   Flow — the whole stotra as one page, and a reader in its own right
   ------------------------------------------------------------
   The reciter's verse view pages one verse at a time because
   chanting aloud needs a fixed place to look. But on a text of
   a hundred short lines — an aṣṭottara śatanāmāvali above all —
   the reading IS the scroll, and many readers simply live here.
   So the full text carries the same engine: the reciter bar runs
   under it, the active line lights word by word, the column
   follows the recitation, and the learn modes (listen, repeat,
   memorize) work exactly as they do verse by verse.

   Tapping a verse recites from there, in place. The column stays
   cheap: each verse is memoised, so on a sahasranāma only the
   verse the light is in re-renders as it moves.
   ============================================================ */

function FlowVerse({ hymn, v, vi, numbered, lang, showMeaning, label, sub, sec, on, activeLi, word, lit, masked, hint, ritualOn, onRitual, onPick, onWord, onOpenNames, setMark }) {
  const dv = v.deva.split("\n");
  const it = v.iast.split("\n");
  const tdv = v.tdeva ? v.tdeva.split("\n") : null;
  const script = lang === "telugu" ? "var(--font-telugu)" : lang === "deva" ? "var(--font-deva)" : null;
  return (
    <div className={"flow-v" + (on ? " fl-v-on" + (numbered ? " at" : "") : "")} data-vi={vi}
      ref={el => setMark(vi, el)}
      onClick={() => onPick(vi)} role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(vi); } }}>
      {label && (
        <React.Fragment>
          <div className={"verse-sec" + (lang !== "roman" ? " tel" : "")} style={{ fontFamily: window.STUTI_SEC.font(sec, lang) }}>{label}</div>
          {sub && <div className="verse-sec-sub">{sub}</div>}
          {sec && sec.ritual && ritualOn && (
            <button className="ritual-off" onClick={e => { e.stopPropagation(); onRitual && onRitual(); }}>{window.STUTI_L.t("ritualHide", lang)}</button>
          )}
        </React.Fragment>
      )}
      {v.sp && (
        <div className="verse-speaker" style={script ? { fontFamily: script } : null}>
          {lang === "telugu" ? v.sp.tel : lang === "deva" ? v.sp.deva : (v.sp.iast || v.sp.tel)}
        </div>
      )}
      <div className="flow-body">
        <div className="flow-text">
          {dv.map((d, li) => {
            const isLast = li === dv.length - 1;
            const showNum = isLast && numbered && !v.pr;
            /* Aṣṭottara śatanāmāvalis keep their own badge — a bare list of
               names has no daṇḍa-numbered verse to fold a number into. Every
               other stotra gets its number the way its own mūla writes it:
               daṇḍa, number, daṇḍa, in the stotra's own script. */
            const namavali = hymn.type === "Nāmāvali";
            let main = window.STUTI_BIND(lang === "telugu" ? ((tdv && tdv[li]) || window.STUTI_TRANSLIT.convert(d, "telugu")) : lang === "deva" ? d : it[li]);
            if (showNum && !namavali && !/[|॥]\s*[0-9०-९౦-౯]+\s*[|॥]\s*$/.test(main.trim())) {
              const num = v.n ? v.n : vi + 1;
              main = main.replace(/\s*(\|\||[।॥])\s*$/, "");
              main += lang === "roman" ? (" || " + num + " ||") : (" ॥ " + num + " ॥");
            }
            const cls = lang === "deva" ? "line-deva deva" : lang === "telugu" ? "line-telugu" : "line-iast-lead";
            const here = li === activeLi;
            const markM = main.match(/\s*((?:\|\||[।॥])\s*[0-9०-९౦-౯]+\s*(?:\|\||[।॥]))\s*$/);
            const bodyText = markM ? main.slice(0, markM.index) : main;
            const markText = markM ? markM[1] : null;
            return (
              <div key={li} className={"flow-line" + (here ? " fl-on" : "")}>
                <div className={cls}>
                  {showNum && namavali && <span className="verse-n-badge verse-n-badge-lead">{v.n ? v.n : vi + 1}</span>}
                  {masked ? <window.RecMasked text={main} hint={hint} />
                    : here ? <React.Fragment>
                        <window.WordRun text={bodyText} upto={lit ? word : -1} lit={lit} onWord={(wi) => onWord(vi, li, wi)} />
                        {markText && <span className="verse-end-mark">{"\u2002" + markText.replace(/\s+/g, "\u2009")}</span>}
                      </React.Fragment>
                    : <React.Fragment>{bodyText}{markText && <span className="verse-end-mark">{"\u2002" + markText.replace(/\s+/g, "\u2009")}</span>}</React.Fragment>}
                </div>
              </div>
            );
          })}
        </div>
        {showMeaning && !masked && window.STUTI_MEAN(v, lang) && (
          <div className="flow-mean" style={{ fontFamily: window.STUTI_MEAN.font(v, lang) }}>
            {window.STUTI_MEAN(v, lang)}
          </div>
        )}
        {/* same as the verse reader: a name-śloka has no sentence to translate,
           so point at the glossary rather than leave the line blank */}
        {showMeaning && !masked && !window.STUTI_MEAN(v, lang) && hymn.namesKey && (
          <button className="verse-mean-names" onClick={(e) => { e.stopPropagation(); onOpenNames && onOpenNames(); }}>
            <window.Icon name="lotus" size={14} /> {window.STUTI_L.t("meaningInNames", lang)}
          </button>
        )}
      </div>
    </div>
  );
}
/* only the verse the light is in may re-render as it moves; function props are
   deliberately left out — they close over nothing that changes without one of
   the compared props changing with it */
const FlowVerseMemo = React.memo(FlowVerse, (a, b) =>
  a.v === b.v && a.vi === b.vi && a.lang === b.lang && a.showMeaning === b.showMeaning &&
  a.numbered === b.numbered && a.label === b.label && a.sub === b.sub && a.ritualOn === b.ritualOn &&
  a.on === b.on && a.activeLi === b.activeLi && a.word === b.word && a.lit === b.lit &&
  a.masked === b.masked && a.hint === b.hint);

function FlowText({ hymn, lang, showMeaning, scale, at, word, lit, masked, hint, peek, onPick, onWord, onSeen, onOpenNames, ritual, ritualOn, onRitual, scrollRef, hush, plain }) {
  const { useEffect, useLayoutEffect, useRef, useCallback } = React;
  const marks = useRef({});
  const setMark = useCallback((vi, el) => { marks.current[vi] = el; }, []);
  /* the verse at the top of the view and how far under the top edge it sits —
     kept current on every scroll so it is still true at the instant something
     reflows the column underneath it */
  const anchor = useRef({ vi: 0, off: 0 });
  /* a tap on a verse already in view must not be answered with a scroll */
  const skipC = useRef(0);
  const mounted = useRef(false);
  const curVerse = at ? at.vi : -1;

  const jump = (vi) => {
    const sc = scrollRef.current, el = marks.current[vi];
    if (!sc || !el) return;
    const delta = el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    sc.scrollTop = Math.max(0, sc.scrollTop + delta - 84);
  };

  /* arrive at the verse the reciter was on — without smooth scroll, which
     would animate the whole column past the reader on a long sahasranāma.
     Two frames late: the column has to be laid out before an offset means
     anything, and on a thousand names that is not the first frame. */
  useEffect(() => {
    if (!(curVerse > 0)) return;
    let n = 0;
    const tick = () => { jump(curVerse); if (++n < 3) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, []);

  /* follow the recitation: keep the active line in the upper third as it
     moves, the way the verse view centres its line. Arrival is jump()'s job,
     and a tap on a visible verse sets skipC so the page does not lurch. */
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (!at) return;
    if (hush && hush.current) { hush.current = false; return; }   // the pointer caught up with the page, not the other way
    if (Date.now() - skipC.current < 600) { skipC.current = 0; return; }
    const sc = scrollRef.current, vEl = marks.current[at.vi];
    if (!sc || !vEl) return;
    const el = vEl.querySelectorAll(".flow-line")[at.li] || vEl;
    const d = el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    const target = Math.max(0, sc.scrollTop + d - Math.max(76, (sc.clientHeight - el.clientHeight) * 0.38));
    const dist = Math.abs(target - sc.scrollTop);
    if (dist < 16) return;
    sc.scrollTo({ top: target, behavior: dist > sc.clientHeight * 2 ? "auto" : "smooth" });
  }, [at && at.vi, at && at.li, lit]);

  /* Report the verse at the top of the view, so the part tabs and the return
     to the reciter follow the reading rather than the last recitation. Kept
     out of state here: a thousand-verse column must not re-render on scroll. */
  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc || !onSeen) return;
    let raf = 0, last = -1;
    const read = () => {
      raf = 0;
      const top = sc.getBoundingClientRect().top + 90;
      let vi = 0;
      for (let i = 0; i < hymn.verses.length; i++) {
        const el = marks.current[i];
        if (!el) continue;                       // a verse the reading leaves out
        if (el.getBoundingClientRect().top <= top) vi = i; else break;
      }
      var top0 = marks.current[vi];
      anchor.current = { vi: vi, off: top0 ? top0.getBoundingClientRect().top - sc.getBoundingClientRect().top : 0 };
      if (vi !== last) { last = vi; onSeen(vi); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    sc.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => { sc.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [hymn.id, lang, showMeaning]);

  /* A bigger letter makes a longer column, and scrollTop is a pixel count, not
     a place in a text — so every size change used to slide the reader somewhere
     they had not asked to be. Put the verse they were looking at back where it
     was, before the browser paints the new size. */
  useLayoutEffect(() => {
    const sc = scrollRef.current, a = anchor.current, el = marks.current[a.vi];
    if (!sc || !el) return;
    const now = el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    if (Math.abs(now - a.off) > 0.5) sc.scrollTop += now - a.off;
  }, [scale]);

  const pick = (vi) => { skipC.current = Date.now(); onPick(vi); };
  const wordTap = (vi, li, wi) => { skipC.current = Date.now(); onWord(vi, li, wi); };

  return (
    <div className={"flow" + (lit && at ? " flow-lit" : "")}>
      {hymn.verses.map((v, vi) => {
        const sec = hymn.sections && v.s != null ? hymn.sections[v.s] : null;
        const prev = hymn.verses[vi - 1];
        const newSec = sec && (!prev || prev.s !== v.s);
        /* the nyāsa, left out of the reading: one band for the whole run of it,
           saying what it is and offering to bring it in */
        if (ritual && ritual.has(vi)) {
          if (vi > 0 && ritual.has(vi - 1)) return null;
          const names = [];
          for (let j = vi; j < hymn.verses.length && ritual.has(j); j++) {
            const nm = window.STUTI_SEC(hymn.sections[hymn.verses[j].s], lang);
            if (nm && names.indexOf(nm) < 0) names.push(nm);
          }
          return (
            <div key={vi} className="ritual-band" ref={el => (marks.current[vi] = el)}>
              <div className="ritual-band-name" style={{ fontFamily: window.STUTI_SEC.font(sec, lang) }}>{names.join(" · ")}</div>
              <div className="ritual-band-note">{window.STUTI_L.t("ritualNote", lang)}</div>
              <button className="ritual-band-btn" onClick={e => { e.stopPropagation(); onRitual && onRitual(); }}>{window.STUTI_L.t("ritualShow", lang)}</button>
            </div>
          );
        }
        /* plain: the page scrolls on its own and no verse is "the" verse — the
           pointer is still kept, for arrival and the saved place, but not shown */
        const isOn = !plain && vi === curVerse;
        return (
          <FlowVerseMemo key={vi} hymn={hymn} v={v} vi={vi} numbered={hymn.verses.length > 1}
            lang={lang} showMeaning={showMeaning}
            label={newSec ? window.STUTI_SEC(sec, lang) : null}
            sub={newSec ? window.STUTI_SEC.sub(sec, lang) : null} sec={sec}
            on={isOn} activeLi={isOn && at ? at.li : -1}
            word={isOn ? word : -1} lit={isOn && lit}
            masked={masked && !(isOn && peek)} hint={hint}
            ritualOn={ritualOn} onRitual={onRitual}
            onPick={pick} onWord={wordTap} onOpenNames={onOpenNames} setMark={setMark} />
        );
      })}

      {hymn.colophon && (lang === "telugu" ? hymn.colophon.tel : hymn.colophon.deva) && (
        <div className="colophon">
          <div className="colophon-mula" style={{ fontFamily: lang === "telugu" ? "var(--font-telugu)" : "var(--font-deva)" }}>
            ॥ {(lang === "telugu" ? hymn.colophon.tel : hymn.colophon.deva)} ॥
          </div>
          {lang !== "telugu" && <div className="colophon-en">{hymn.colophon.en}</div>}
        </div>
      )}
      <div className="reader-end">
        <window.Flame size={28} />
        <div style={{ fontFamily: lang === "telugu" ? "var(--font-telugu)" : lang === "deva" ? "var(--font-deva)" : "var(--font-display)", fontSize: 20, color: "var(--accent-ink)" }}>
          {window.STUTI_L.t("shubham", lang)}
        </div>
      </div>
      <div className="flow-tail">{window.STUTI_L.t("flowTapHint", lang)}</div>
    </div>
  );
}

/* memoised: the reader re-renders on every scroll-driven part change, and
   re-laying a sahasranāma each time would make the scroll stutter. The active
   line, word light and learn state are compared so the recitation shows. */
const eqAt = (x, y) => (x ? !!y && x.vi === y.vi && x.li === y.li : !y);
const FlowTextMemo = React.memo(FlowText, (a, b) =>
  a.hymn.id === b.hymn.id && a.lang === b.lang && a.showMeaning === b.showMeaning &&
  a.scale === b.scale && a.ritualOn === b.ritualOn &&
  eqAt(a.at, b.at) && a.word === b.word && a.lit === b.lit &&
  a.masked === b.masked && a.hint === b.hint && a.peek === b.peek && a.plain === b.plain);

Object.assign(window, { FlowText: FlowTextMemo });

/* Find my place — for the reciter who knows the text and looked away.
   Not a search: a re-sync. She types or says the phrase she is at, the lines
   that carry it light up nearest-first, one tap moves the reader there. */
const FIND_DEVA_LONG = { "ी": "ि", "ू": "ु", "ई": "इ", "ऊ": "उ", "ँ": "ं", "ॠ": "ऋ", "ॄ": "ृ", "ऎ": "े", "ऒ": "ो", "ॆ": "े", "ॊ": "ो", "ऩ": "न", "ऱ": "र", "ऴ": "ळ" };
const FIND_HAS_INDIC = /[\u0900-\u097F\u0C00-\u0C7F]/;
/* one lax key per script: no spaces, no daṇḍa, no numbers, long vowels folded
   to short — the reciter types what she hears, not the edition's spelling */
function findKeyDeva(s) {
  let t = window.STUTI_TRANSLIT.toDeva(s || "").replace(/ॐ/g, "ओं").replace(/[\s।॥|0-9०-९౦-౯\-—–,.;:!?'"()]/g, "");
  let out = "";
  for (const ch of t) out += FIND_DEVA_LONG[ch] || ch;
  return out;
}
function findKeyRoman(s) { return window.STUTI_TRANSLIT.fold(s || "").replace(/[^a-z]/g, ""); }
function findKey(q) {
  return FIND_HAS_INDIC.test(q) ? { deva: findKeyDeva(q) } : { roman: findKeyRoman(q) };
}
/* lines carrying the phrase, ordered by distance from the current line — a
   sahasranāma repeats a name many times, and hers is the nearest one */
function findMatches(lines, q, active, max) {
  const k = findKey(q);
  const need = k.deva || k.roman;
  if (!need || need.length < 2) return [];
  const hits = [];
  lines.forEach((l, i) => {
    const hay = k.deva ? (l._kd || (l._kd = findKeyDeva(l.deva))) : (l._kr || (l._kr = findKeyRoman(l.iast)));
    const at = hay.indexOf(need);
    if (at >= 0) hits.push({ i, at, d: Math.abs(i - Math.max(0, active)) });
  });
  hits.sort((a, b) => a.d - b.d);
  return hits.slice(0, max || 6);
}

function FindStrip({ lines, hymn, lang, active, onPick, onClose }) {
  const { useState, useEffect, useRef } = React;
  const [q, setQ] = useState("");
  const [hearing, setHearing] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const inp = useRef(null);
  const recog = useRef(null);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canHear = !!SR && navigator.onLine !== false;
  useEffect(() => { const id = setTimeout(() => inp.current && inp.current.focus(), 60); return () => clearTimeout(id); }, []);
  useEffect(() => () => { if (recog.current) try { recog.current.abort(); } catch (e) {} }, []);
  const hits = findMatches(lines, q, active, 6);
  const L = window.STUTI_L;
  const lineText = (l) => {
    if (lang === "roman") return l.iast;
    const v = hymn.verses[l.vi];
    if (lang === "telugu") { const tdv = v.tdeva ? v.tdeva.split("\n") : null; return (tdv && tdv[l.li]) || window.STUTI_TRANSLIT.convert(l.deva, "telugu"); }
    return l.deva;
  };
  const font = lang === "telugu" ? "var(--font-telugu)" : lang === "deva" ? "var(--font-deva)" : null;
  const listen = () => {
    if (!canHear) return;
    if (hearing) { try { recog.current.stop(); } catch (e) {} return; }
    const r = new SR();
    /* Sanskrit has no recogniser worth the name; the reading script's own
       language hears the sounds closest */
    r.lang = lang === "telugu" ? "te-IN" : "hi-IN";
    r.interimResults = true; r.continuous = false; r.maxAlternatives = 3;
    r.onresult = (e) => {
      let s = "";
      for (const res of e.results) s += res[0].transcript + " ";
      setQ(s.trim());
    };
    r.onerror = (e) => { setHearing(false); setVoiceNote(e.error === "not-allowed" || e.error === "service-not-allowed" ? "micDenied" : "findNoHear"); };
    r.onend = () => setHearing(false);
    recog.current = r;
    setVoiceNote("");
    setHearing(true);
    try { r.start(); } catch (e) { setHearing(false); }
  };
  return (
    <div className="rd-find" role="search">
      <div className="rd-find-row">
        <Icon name="search" size={18} />
        <input ref={inp} className="rd-find-inp" value={q} onChange={e => setQ(e.target.value)} placeholder={L.t("findPlace", lang)}
          style={font ? { fontFamily: font } : null} autoCapitalize="off" autoCorrect="off" spellCheck={false}
          onKeyDown={e => { if (e.key === "Enter" && hits.length) onPick(hits[0].i); if (e.key === "Escape") onClose(); }} />
        <window.VoiceButton lang={lang} size={17} onInterim={setQ} onResult={setQ} />
        {canHear && <button className={"rd-find-mic" + (hearing ? " on" : "")} onClick={listen} aria-pressed={hearing} aria-label={L.t("findSay", lang)} title={L.t("findSay", lang)}><Icon name="mic" size={18} /></button>}
        <button className="rd-find-x" onClick={onClose} aria-label={L.t("close", lang)}><Icon name="close" size={17} /></button>
      </div>
      {hearing && <div className="rd-peekhint rd-find-note">{L.t("findListening", lang)}</div>}
      {!hearing && voiceNote && <div className="rd-peekhint rd-find-note">{L.t(voiceNote, lang)}</div>}
      {q.trim().length >= 2 && !hearing && (
        hits.length ? (
          <div className="rd-find-hits">
            {hits.map(h => { const l = lines[h.i]; return (
              <button key={h.i} className={"rd-find-hit" + (h.i === active ? " here" : "")} onClick={() => onPick(h.i)}>
                <span className="rd-find-n">{hymn.verses[l.vi].n || l.vi + 1}</span>
                <span className="rd-find-t" style={font ? { fontFamily: font } : null}>{lineText(l).replace(/\s*(\|\||[।॥])\s*[0-9०-९౦-౯]*\s*(\|\||[।॥])?\s*$/, "")}</span>
              </button>
            ); })}
          </div>
        ) : <div className="rd-peekhint rd-find-note">{L.t("findNone", lang)}</div>
      )}
    </div>
  );
}
Object.assign(window, { FindStrip, findMatches });

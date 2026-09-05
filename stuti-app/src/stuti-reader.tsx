import { Emblem, FavButton, Flame, Icon, deityStyle, useFavs } from "./stuti-icons";
import { STUTI_NAMES } from "./stuti-names";
import React from "react";
import { STUTI_AUDIO } from "./stuti-audio";
import { AwaitingText } from "./stuti-await";
import { STUTI } from "./stuti-data";
import { FindStrip } from "./stuti-find";
import { FlowText } from "./stuti-flow";
import { STUTI_BIND, STUTI_L, STUTI_MEAN } from "./stuti-i18n";
import { STUTI_PADA } from "./stuti-lexicon";
import { STUTI_LIB } from "./stuti-library-data";
import { STUTI_LIMITS } from "./stuti-limits-core";
import { LimitSheet, useLimitLeft } from "./stuti-limits";
import { PadaSheet } from "./stuti-pada";
import { OverlayPortal } from "./stuti-picker";
import { LearnButton } from "./stuti-plans";
import { STUTI_RECITE } from "./stuti-recite";
import { RecordStrip, useRecTake } from "./stuti-record";
import { STUTI_THREAD } from "./stuti-sadhana";
import { ShareSheet, printStotra } from "./stuti-share";
import { STUTI_PROGRESS } from "./stuti-store";
import { STUTI_RITUAL } from "./stuti-texts";
import { nityaQueue } from "./stuti-nitya-queue";
import { useFollow, FollowButton, FollowChip } from "./stuti-follow";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — Deity view + Reader/Reciter (follow-along)
   The reader is the product: line-by-line Sanskrit that lights
   up as it is "recited", with transliteration & meaning as
   layers the user can lift on or off.
   ============================================================ */
const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

/* the title + font for the reader's chosen script */
function hymnTitle(h, lang) {
  return lang === "telugu" ? (h.tel || h.title)
       : lang === "deva"   ? (h.deva || h.title)
       :                     h.title;
}
/* folio numerals — a running index number is a locator, not prose, so it
   stays in plain Arabic numerals regardless of the reading script */
function folio(n) { return String(n); }
function scriptFontFor(lang) {
  return lang === "telugu" ? "var(--font-telugu)"
       : lang === "deva"   ? "var(--font-deva)"
       :                     "var(--font-display)";
}

/* Listen is the one mode that exists to be listened to, and the recitations it
   would play are v2's work — until they exist it is a silent highlight wearing
   the name of a recording, which is the one thing a reader would not forgive.
   Held behind a flag rather than deleted; the day the audio lands it comes back
   in one line. Repeat and Memorize need nothing from us: Repeat paces the line
   and records the reciter's own voice back to them, Memorize hides it. */
/* Whether a recitation exists is a fact about a hymn, not about the app, so it
   is asked per hymn of STUTI_AUDIO — which answers no until a recording is
   registered. Listen appears in the learn bar only where there is something to
   hear; Repeat and Memorize never needed audio and are unaffected. */
function audioFor(hymn, lineCount) {
  try { return STUTI_AUDIO.get(hymn.id, lineCount) || null; } catch (e) { return null; }
}

/* a masked line for Memorize mode (first word / initials / blank) */
const ROMAN_VOWELS = "aeiouāīūṛṝḻḹAEIOUĀĪŪṚṜḺḸēōĒŌ";
function firstSyllableRoman(tok) {
  let i = 0;
  while (i < tok.length && ROMAN_VOWELS.indexOf(tok[i]) === -1) i++;
  let end = Math.min(i + 1, tok.length);
  if ((tok[i] === "a" || tok[i] === "A") && (tok[i + 1] === "i" || tok[i + 1] === "u" || tok[i + 1] === "I" || tok[i + 1] === "U")) end = i + 2;
  const syl = tok.slice(0, end) || tok[0] || "";
  return syl.length ? syl[0].toUpperCase() + syl.slice(1) : syl;
}
/* Devanāgarī/Telugu: a base consonant carries its vowel sign as a separate,
   combining code point — an aksara, not a "letter". A grapheme-cluster split
   keeps them together; a plain char split (the old behaviour) silently
   dropped the vowel sign and showed the bare consonant instead. */
function firstSyllable(tok) {
  if (/^[a-zA-Z]/.test(tok)) return firstSyllableRoman(tok);
  if (window.Intl && Intl.Segmenter) {
    try {
      const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      const first = seg.segment(tok)[Symbol.iterator]().next();
      if (!first.done) return first.value.segment;
    } catch (e) {}
  }
  return tok[0];
}
function RecMasked({ text, hint }) {
  let seenWord = false;
  const [shown, setShownM] = useState({});
  if (hint === "initials") {
    let k = 0;
    return <div className="mask-line">{text.split(/\s+/).filter(Boolean).map((w) => {
      if (!/\p{L}/u.test(w)) return <span key={"p" + k++} className="mask-plain">{w}</span>;
      const id = k++;
      const on = shown[id];
      const head = firstSyllable(w);
      return (
        <button key={id} type="button" className={"mask-word" + (on ? " on" : "")} onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShownM(s => ({ ...s, [id]: true })); }}>
          {on ? w : <React.Fragment>{head}<span className="mask-dots">···</span></React.Fragment>}
        </button>
      );
    })}</div>;
  }
  return <span>{text.split(/(\s+)/).map((tok, i) => {
    if (/^\s+$/.test(tok) || tok === "") return <span key={i}>{tok}</span>;
    const chars = [...tok];
    if (hint === "firstword") {
      if (!seenWord) { seenWord = true; return <span key={i}>{tok}</span>; }
      return <span key={i} className="rd-blank" style={{ width: Math.max(1.2, Math.min(6, chars.length * 0.55)) + "ch" }} />;
    }
    return <span key={i} className="rd-blank" style={{ width: Math.max(1.2, Math.min(6, chars.length * 0.55)) + "ch" }} />;
  })}</span>;
}

/* the main-script text of a line, in the chosen reading script */
function lineMainText(line, lang) {
  if (!line) return "";
  return lang === "telugu" ? STUTI_TRANSLIT.convert(line.deva, "telugu")
       : lang === "deva" ? line.deva
       : line.iast;
}

/* natural dwell per line: proportional to how much sound the line carries, so
   the word-by-word highlight paces like real recitation rather than a fixed
   metronome.

   Measured in syllables, which is the same unit the per-word shares below are
   cut from. It used to be measured in characters, and the two units disagreeing
   is why the light visibly changed pace at some line and verse boundaries: IAST
   runs about two characters to a syllable, but a line thick with clusters —
   kṣ, ṣṭ, śr, ndh — runs closer to three, so it was handed half again the time
   for the same number of beats and every word in it held longer. One unit, one
   rate, and the clamp is wide enough that ordinary lines never touch it. */
const MS_PER_SYLLABLE = 240;
function lineDwell(line) {
  const src = ((line && line.iast) || (line && line.deva) || "").normalize("NFC");
  const n = src.split(/\s+/).filter(isWordTok).map(sylWeight).reduce((a, b) => a + b, 0) || 1;
  return Math.max(1400, Math.min(12000, Math.round(n * MS_PER_SYLLABLE)));
}
const isWordTok = (t) => /[\p{L}]/u.test(t);
function countWords(t) { return (t || "").split(/\s+/).filter(isWordTok).length; }
/* syllable weight of one word, script-aware — a long compound holds the light
   longer than a short particle, the way a reciter actually sings it */
function sylWeight(tok) {
  const t = (tok || "").normalize("NFC");
  const c = (re) => (t.match(re) || []).length;
  if (/[\u0900-\u097F]/.test(t)) return Math.max(1, c(/[\u0915-\u0939\u0958-\u095F]/g) - c(/\u094D/g) + c(/[\u0904-\u0914]/g));
  if (/[\u0C00-\u0C7F]/.test(t)) return Math.max(1, c(/[\u0C15-\u0C39\u0C58-\u0C5A]/g) - c(/\u0C4D/g) + c(/[\u0C05-\u0C14]/g));
  return Math.max(1, (t.toLowerCase().match(/[a\u0101i\u012bu\u016b\u1e5b\u1e5d\u1e37\u1e39e\u0113o\u014d]+/g) || []).length);
}
/* per-word dwell inside a line: each word's share of the line's total time,
   proportional to its syllable weight, with a floor so single beats stay legible */
function wordDurations(text, total) {
  const toks = (text || "").split(/\s+/).filter(isWordTok);
  const w = toks.map(sylWeight);
  const sum = w.reduce((a, b) => a + b, 0) || 1;
  return w.map(x => Math.max(140, (total * x) / sum));
}

/* karaoke word run — lights each word as the recitation reaches it, so the
   reciter can follow along and learn word by word */
function WordRun({ text, upto, lit, onWord }) {
  let wi = -1;
  return (
    <React.Fragment>
      {text.split(/(\s+)/).map((tok, i) => {
        if (!tok) return null;
        if (/^\s+$/.test(tok) || !isWordTok(tok)) return <span key={i}>{tok}</span>;
        wi += 1;
        const idx = wi;
        const cls = !lit ? "w" : idx < upto ? "w w-read" : idx === upto ? "w w-now" : "w w-next";
        return <span key={i} className={cls + (onWord ? " w-tap" : "")}
          onClick={onWord ? (e) => { e.stopPropagation(); onWord(idx); } : undefined}>{tok}</span>;
      })}
    </React.Fragment>
  );
}

/* ---------------- Sahasranāma glossary — the thousand names, name by name ---------------- */
function NamesSheet({ hymn, lang, onClose }) {
  const L = STUTI_L;
  const [gi, setGi] = useState(0);
  const [q, setQ] = useState("");
  const N = (STUTI_NAMES || {})[hymn.namesKey];
  if (!N) return null;
  const fold = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const query = q.trim();
  const g = N.groups[Math.min(gi, N.groups.length - 1)];
  const list = query
    ? N.names.filter(n => fold(n.iast).includes(fold(query)) || fold(n.me).includes(fold(query)) || (n.mt || "").includes(query))
    : N.names.filter(n => n.n >= g.from && n.n <= g.to);
  const font = scriptFontFor(lang);
  const gLabel = x => (lang === "telugu" ? (x.tel || x.roman) : lang === "deva" ? (x.hi || x.roman) : x.roman);
  const note = N.note && (lang === "telugu" ? (N.note.tel || N.note.roman) : lang === "deva" ? (N.note.hi || N.note.roman) : N.note.roman);
  return (
    <div className="nm-sheet">
      <div className="nm-head">
        <button className="icon-btn" onClick={onClose} aria-label={STUTI_L.a("aClose")}><Icon name="back" /></button>
        <div className="nm-title">
          <div className="nm-title-name display" style={{ fontFamily: font }}>{hymnTitle(hymn, lang)}</div>
          <div className="nm-title-sub">{N.names.length} {L.t("namesLbl", lang)}</div>
          {note && <div className="nm-title-note">{note}</div>}
        </div>
      </div>
      <div className="nm-search">
        <Icon name="search" size={18} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={L.t("searchNames", lang)} aria-label={L.t("searchNames", lang)} />
      </div>
      {!query && (
        <div className="nm-groups">
          {N.groups.map((x, i) => (
            <button key={i} className={"nm-gchip" + (i === gi ? " on" : "")} onClick={() => setGi(i)}>
              <span className="nm-grange">{x.from}–{x.to}</span>
              <span className="nm-glabel" style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : null}>{gLabel(x)}</span>
            </button>
          ))}
        </div>
      )}
      <div className="nm-list scroll">
        {list.length === 0 && <div className="nm-empty">{L.t("noResults", lang)}</div>}
        {list.map(n => (
          <div className="nm-row" key={n.n}>
            <div className="nm-n">{n.n}</div>
            <div className="nm-body">
              <div className="nm-name" style={{ fontFamily: font }}>
                {lang === "telugu" ? STUTI_TRANSLIT.convert(n.deva, "telugu") : lang === "deva" ? n.deva : n.iast}
              </div>
              <div className="nm-mean" style={(lang === "telugu" && n.mt) || (lang === "deva" && n.mh) ? { fontFamily: lang === "telugu" ? "var(--font-telugu)" : "var(--font-deva)" } : null}>{lang === "telugu" && n.mt ? n.mt : lang === "deva" && n.mh ? n.mh : n.me}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Nāmalu — the names said singly, in the dative: śrī ... namaḥ ----------------
   The corpus keeps names in the nominative (as the śloka itself declines them);
   chanting form wants the dative. Only the common a/i/u-stem and ā-stem endings
   are handled — the overwhelming majority of a sahasranāma's names — and
   anything else is left as written rather than guessed at. */
function toDativeIast(s) {
  if (/aḥ$/.test(s)) return s.slice(0, -2) + "āya";
  if (/iḥ$/.test(s)) return s.slice(0, -2) + "aye";
  if (/uḥ$/.test(s)) return s.slice(0, -2) + "ave";
  if (/ā$/.test(s)) return s.slice(0, -1) + "āyai";
  return s;
}
function toDativeDeva(s) {
  if (s.endsWith("ः")) {
    const base = s.slice(0, -1);
    if (base.endsWith("ि")) return base.slice(0, -1) + "ये";
    if (base.endsWith("ु")) return base.slice(0, -1) + "वे";
    return base + "ाय";
  }
  if (s.endsWith("ा")) return s.slice(0, -1) + "ायै";
  return s;
}
function NamaluList({ hymn, lang }) {
  const N = (STUTI_NAMES || {})[hymn.namesKey];
  const font = scriptFontFor(lang);
  if (!N) return null;
  const line = n => {
    if (lang === "telugu") return `శ్రీ ${STUTI_TRANSLIT.convert(toDativeDeva(n.deva), "telugu")} నమః`;
    if (lang === "deva") return `श्री ${toDativeDeva(n.deva)} नमः`;
    return `Śrī ${toDativeIast(n.iast)} namaḥ`;
  };
  return (
    <div className="nm-inline">
      {N.names.map(n => (
        <div key={n.n} className="nm-row">
          <span className="nm-n">{n.n}</span>
          <span className={"nm-name nm-name-" + (lang === "telugu" ? "telugu" : lang === "deva" ? "deva" : "iast")} style={{ fontFamily: font }}>{line(n)}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Form (aspect) selector ---------------- */
function formName(f, lang) {
  return lang === "telugu" ? (f.tel || f.iast) : lang === "deva" ? (f.deva || f.iast) : f.iast;
}

function FormSelector({ forms, value, onChange, lang, showCounts = true, variant = "pills" }) {
  const L = STUTI_L;
  const font = scriptFontFor(lang);
  const total = forms.reduce((s, f) => s + f.count, 0);
  const allItem = { id: "all", iast: L.t("all", lang), deva: L.t("all", lang), tel: L.t("all", lang), count: total };
  const items = [allItem, ...forms];
  return (
    <div className={"formbar formbar-" + variant}>
      <div className={"fsel fsel-" + variant}>
        <div className="fsel-track">
          <div className="fsel-inner" role="tablist" aria-label={L.t("forms", lang)}>
            {items.map(f => {
              const on = f.id === value;
              const soon = f.id !== "all" && f.count === 0;
              return (
                <button key={f.id} role="tab" aria-selected={on}
                  className={"fsel-item" + (on ? " on" : "") + (soon ? " soon" : "")}
                  onClick={() => onChange(f.id)}>
                  <span className="fsel-name" style={{ fontFamily: font }}>{formName(f, lang)}</span>
                  {soon ? <span className="fsel-soon">{L.t("soon", lang)}</span>
                        : (showCounts && <span className="fsel-count">{f.count}</span>)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- A single deity's hymns ---------------- */
/* A deity page is opened from the library grid, a vrata or type list, a
   search result and the reader's back arrow. It goes back to whichever of
   those it was, and carries that screen's own origin onward as `retView`. */
function DeityView({ deity, go, lang = "deva", showFormCounts = true, defaultForm = "all", backView = "browse", retView }) {
  const S = STUTI, L = STUTI_L;
  const allHymns = S.hymnsForDeity(deity.id);
  const forms = S.formsForDeity(deity.id);
  const hasForms = forms.length > 1;
  const principal = forms.length ? forms[0].id : "all";
  const [form, setForm] = useState(defaultForm === "principal" ? principal : "all");
  useEffect(() => { setForm(defaultForm === "principal" ? principal : "all"); }, [defaultForm, deity.id]);

  const indexFont = scriptFontFor(lang);
  const shown = form === "all" ? allHymns : allHymns.filter(h => (h.form || "others") === form);
  /* A granthasūcī, not a stack of cards: texts sit under their genre in the
     library's canonical order, carry a running folio numeral in the script
     being read, and reach their verse count across a dotted leader. A text
     not yet keyed keeps its place in the index and says so — exiling those
     to a block at the foot of the page hid what a shelf actually holds. */
  const LIB = STUTI_LIB;
  const typeOrder = (LIB && LIB.typeList) ? LIB.typeList().map(t => t.type) : [];
  const groups = [];
  shown.forEach(h => {
    const t = h.type || "Stotra";
    let g = groups.find(x => x.type === t);
    if (!g) groups.push(g = { type: t, rows: [] });
    g.rows.push(h);
  });
  const rank = t => { const i = typeOrder.indexOf(t); return i < 0 ? 99 : i; };
  groups.sort((a, b) => rank(a.type) - rank(b.type));
  groups.forEach(g => g.rows.sort((a, b) => (a.catalog ? 1 : 0) - (b.catalog ? 1 : 0)));

  const section = t => {
    const lab = (LIB && LIB.TYPE_LABELS && LIB.TYPE_LABELS[t]) || null;
    const name = !lab ? t : lang === "telugu" ? lab.tel : lang === "deva" ? lab.deva : t;
    /* the note is only ever written in English — showing it under a Telugu or
       Devanāgarī heading reads as an untranslated scrap, so it's roman-only */
    return { name, note: (lang === "roman" && lab && lab.note) || "" };
  };

  /* the three movements a sahasranāma is read in, sublisted under the text
     itself rather than left for the reader's own tab bar to reveal */
  const openAt = (h, at) => {
    /* mirror ReaderView's own line flattening — nyāsa verses are skipped from
       the line sequence by default, so a raw verse-index sum lands short */
    const ritualSet = STUTI_RITUAL ? STUTI_RITUAL(h) : null;
    const ritualOn = localStorage.getItem("stuti-ritual") === "1";
    const skip = ritualSet && !ritualOn ? ritualSet : null;
    let li = 0;
    for (let i = 0; i < at; i++) { if (skip && skip.has(i)) continue; li += h.verses[i].deva.split("\n").length; }
    try {
      localStorage.setItem("stuti-pos-" + h.id, String(li));
      /* jumping to a movement means the śloka-by-śloka view, whatever mode
         the reader was last left in — the full-text column tracks its own
         scroll position, not this pointer, and would ignore it */
      localStorage.setItem("stuti-readmode", "recite");
    } catch (e) {}
    /* the reader may already be mounted for this same hymn.id from an earlier
       visit — a plain go() then reuses that instance and its stale `active`
       state, ignoring the position just saved. `jump` forces a fresh mount. */
    go("reader", { hymn: h.id, deity: deity.id, from: "deity", ret: backView, jump: Date.now() });
  };
  const PART_LABEL = { purva: "gsPurva", stotram: "gsNamavali", uttara: "gsUttara" };

  let n = 0;
  const entry = (h) => {
    const no = folio(++n);
    const cfgParts = !h.catalog && hymnParts(h);
    return (
      <div key={h.id} className={"gs-en-wrap" + (cfgParts ? " has-sub" : "")}>
        <div className={"gs-en" + (h.catalog ? " soon" : "")}>
          <button className="gs-main" onClick={() => go("reader", { hymn: h.id, deity: deity.id, from: "deity", ret: backView })}>
            <span className="gs-no" style={{ fontFamily: indexFont }}>{no}</span>
            <span className="gs-ti">
              <span className="gs-d" style={{ fontFamily: indexFont }}>{hymnTitle(h, lang)}</span>
            </span>
            <span className="gs-dl" />
            {h.catalog && <span className="gs-vc">{L.t("soon", lang)}</span>}
          </button>
          {!h.catalog && (
            <span className="gs-marks">
              <LearnButton id={h.id} size={20} go={go} from="deity" />
              <FavButton id={h.id} size={20} />
            </span>
          )}
        </div>
        {cfgParts && (
          <div className="gs-sub-list">
            {cfgParts.map(p => {
              const badge = p.key === "purva" ? "\u00AB" : p.key === "uttara" ? "\u00BB" : null;
              return (
              <div key={p.key} className="gs-sub-row">
                <button className="gs-sub" onClick={() => openAt(h, p.at)}>
                  <span className="gs-sub-mark" />
                  <span className="gs-sub-t" style={{ fontFamily: indexFont }}>{L.t(PART_LABEL[p.key], lang)}</span>
                  <span className="gs-dl" />
                  {badge && <span className="gs-sub-badge">{badge}</span>}
                </button>
                <span className="gs-marks gs-sub-marks">
                  <PartFavButton hymn={h} partKey={p.key} size={18} />
                </span>
              </div>
            );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="view deity-view deity-index scroll" style={deityStyle(deity, { flex: 1 })}>
      <button className="icon-btn gs-back" onClick={() => go(backView, { from: retView })} aria-label={STUTI_L.a("aBackDeities")}>
        <Icon name="back" />
      </button>
      <div className="gs-wm"><Emblem d={deity} variant="ink" /></div>
      <header className="gs-head gs-head-nb">
        <h1 className="gs-name display" style={{ fontFamily: indexFont }}>{L.name(deity, lang)}</h1>
        <div className="gs-rom">{L.name(deity, "roman")} — {L.epithet(deity, "roman")}<span className="gs-count">– {allHymns.length}</span></div>
        <div className="gs-rule" />
      </header>

      {hasForms && (
        <FormSelector forms={forms} value={form} onChange={setForm} lang={lang} showCounts={false} variant="printed" />
      )}

      {shown.length === 0 ? (
        <div className="form-empty">
          <div className="form-empty-mark"><Icon name="lotus" size={28} /></div>
          <div className="form-empty-text">{L.t("noFormTexts", lang)}</div>
        </div>
      ) : (
        <div className="gs-ix">
          {groups.map(g => {
            const s = section(g.type);
            return (
              <React.Fragment key={g.type}>
                <div className="gs-sec">{s.name}{s.note ? <React.Fragment> · <span className="gs-sec-note">{s.note}</span></React.Fragment> : null}</div>
                {g.rows.map(entry)}
              </React.Fragment>
            );
          })}
        </div>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}

/* The four movements of a sahasranāma: the frame, the names, the fruits —
   plus the story that sits outside the recitation. Derived from the sections
   so every thousand-name text gets the same navigation. */
function hymnParts(hymn) {
  const V = hymn.verses || [], S = hymn.sections || [];
  if (!/sahasran/i.test((hymn.title || "").normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) return null;
  const roman = v => ((S[v.s] || {}).roman || "");
  let nama = V.findIndex(v => v.nama || /thousand names|st[oō]tram|n[aā]m[aā]vali/i.test(roman(v)));
  if (nama <= 0) return null;
  let uttara = V.findIndex((v, i) => i > nama && /uttara|phalaśruti|fruits of recitation/i.test(roman(v) + " " + ((S[v.s] || {}).tel || "")));
  if (uttara < 0) return null;
  return [
    { key: "purva",   at: 0 },
    { key: "stotram", at: nama },
    { key: "uttara",  at: uttara },
  ];
}

/* A section's "add to recitation" toggle. Sahasranāmāvali is the text's core
   and is implicit whenever the hymn is a favourite at all; Pūrva and Uttara
   are wrapper movements gated by STUTI_RECITE. So: adding Pūrva turns the
   hymn on with purva movements included (reading proceeds Pūrva → Nāmāvali);
   adding only Nāmāvali turns the hymn on with both wrappers off; adding
   Uttara alone is asked about first, since Phalaśruti is never read by
   itself — declining leaves the hymn untouched. */
function PartFavButton({ hymn, partKey, size }) {
  const favs = useFavs();
  const R = STUTI_RECITE;
  const [, force] = React.useReducer(x => x + 1, 0);
  const on = favs.has(hymn.id) && (partKey === "stotram" || (partKey === "purva" ? R.hasPurva(R.get(hymn.id)) : R.hasUttara(R.get(hymn.id))));
  const L = STUTI_L;
  let lg; try { lg = localStorage.getItem("stuti-lang") || "deva"; } catch (e) { lg = "deva"; }
  const click = (e) => {
    e.stopPropagation();
    if (on) {
      if (partKey === "stotram") { favs.toggle(hymn.id); R.clear(hymn.id); }
      else { const c = R.get(hymn.id); const n = Object.assign({}, c);
        if (partKey === "purva") { n.purva = n.viniyoga = n.dhyanam = false; } else { n.phala = n.ksama = false; }
        R.set(hymn.id, n);
      }
      force(); return;
    }
    if (partKey === "purva") {
      favs.add(hymn.id); const base = R.isCustom(hymn.id) ? R.get(hymn.id) : { purva: false, viniyoga: false, nyasa: false, dhyanam: false, phala: false, ksama: false };
      R.set(hymn.id, Object.assign({}, base, { purva: true, viniyoga: true, dhyanam: true }));
    } else if (partKey === "stotram") {
      favs.add(hymn.id); R.set(hymn.id, { purva: false, viniyoga: false, nyasa: false, dhyanam: false, phala: false, ksama: false });
    } else {
      /* Phalaśruti alone is an unusual pick, but a blocking dialog froze the
         embedded app — just honour the tap; removing it is one tap away. */
      favs.add(hymn.id); const base = R.isCustom(hymn.id) ? R.get(hymn.id) : { purva: false, viniyoga: false, nyasa: false, dhyanam: false, phala: false, ksama: false };
      R.set(hymn.id, Object.assign({}, base, { phala: true, ksama: true }));
    }
    force();
  };
  return (
    <button className={"fav-btn" + (on ? " on" : "")} aria-pressed={on}
      aria-label={L.t(on ? "favRemove" : "favAdd", lg)} onClick={click}>
      <Icon name="diya" size={size} filled={on} />
    </button>
  );
}

/* ---------------- Reading script — the home masthead's three-glyph pill, here too.
   Defined locally rather than borrowed from a main: the phone and tablet builds
   load different entry files, and only one of them declares it. ---------------- */
const RD_SCRIPTS = [
  { k: "telugu", glyph: "అ", name: "Telugu", font: "var(--font-telugu)" },
  { k: "roman",  glyph: "A", name: "Roman / IAST", font: "var(--font-display)" },
  { k: "deva",   glyph: "अ", name: "Devanāgarī", font: "var(--font-deva)" },
];
function RdScriptSeg({ lang, setLang }) {
  return (
    <div className="scriptseg" role="group" aria-label={STUTI_L.t("readIn", lang)}>
      {RD_SCRIPTS.map(o => (
        <button key={o.k} className={lang === o.k ? "on" : ""} style={{ fontFamily: o.font }}
          aria-pressed={lang === o.k} title={o.name} onClick={() => setLang(o.k)}>{o.glyph}</button>
      ))}
    </div>
  );
}

/* ---------------- Text size — a stepper sitting open in the reader header ---------------- */
function SizePicker({ dec, inc, atMin, atMax }) {
  return (
    <div className="rd-size" role="group" aria-label={STUTI_L.a("aTextSize")}>
      <button onClick={dec} disabled={atMin} aria-label={STUTI_L.a("aSmaller")}>−</button>
      <button onClick={inc} disabled={atMax} aria-label={STUTI_L.a("aLarger")}>+</button>
    </div>
  );
}

/* ---------------- The story behind the hymn — pūrva pīṭhikā, in full ---------------- */function StorySheet({ hymn, lang, onClose, onNext }) {
  const L = STUTI_L, a = hymn.about;
  const tel = (
    <>
      {a.te.map((p, i) => (
        <React.Fragment key={i}>
          <p className="st-p tel">{p}</p>
          {i === 2 && a.chain && (
            <div className="st-chain">{a.chain.map((c, k) => <span key={k} style={{ fontFamily: "var(--font-telugu)" }}>{c}</span>)}</div>
          )}
        </React.Fragment>
      ))}
    </>
  );
  const eng = <>{a.en.map((p, i) => <p key={i} className="st-p">{p}</p>)}</>;
  const hin = a.hi ? <>{a.hi.map((p, i) => <p key={i} className="st-p" style={{ fontFamily: "var(--font-deva)" }}>{p}</p>)}</> : null;
  const teluguFirst = lang === "telugu";
  /* the prose follows the reading script, and falls back to English rather
     than to a language the reader did not ask for */
  const prose = teluguFirst ? tel : lang === "deva" ? (hin || eng) : eng;
  return (
    <div className="nm-sheet">
      <div className="nm-head">
        <button className="icon-btn" onClick={onClose} aria-label={STUTI_L.a("aClose")}><Icon name="back" /></button>
        <div className="nm-title">
          <div className="nm-title-name display" style={{ fontFamily: scriptFontFor(lang) }}>{hymnTitle(hymn, lang)}</div>
          <div className="nm-title-sub">{a.ref}</div>
        </div>
      </div>
      <div className="nm-list scroll">
        <div className="st-body">
          <div className="st-kicker">{a.kicker}</div>
          <div className="st-head" style={teluguFirst ? { fontFamily: "var(--font-telugu)" } : lang === "deva" && a.headHi ? { fontFamily: "var(--font-deva)" } : null}>
            {teluguFirst ? a.headTel : lang === "deva" && a.headHi ? a.headHi : a.headRoman}
          </div>
          {prose}
          <div className="st-note">{a.source}</div>
        </div>
      </div>
      {onNext && (
        <div className="st-onward">
          <button className="st-onward-btn" onClick={onNext}
            style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null}>
            {STUTI_L.t("toPurva", lang)}<Icon name="arrow" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/* drag-to-seek: any horizontal track becomes a slider you can scrub with
   pointer, touch or arrow keys. onSeek receives a 0–1 fraction. */
function useScrub(onSeek) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const at = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
  };
  return {
    ref, drag,
    handlers: {
      onPointerDown: (e) => { e.preventDefault(); setDrag(true); try { ref.current.setPointerCapture(e.pointerId); } catch (err) {} at(e); },
      onPointerMove: (e) => { if (drag) at(e); },
      onPointerUp: (e) => { setDrag(false); try { ref.current.releasePointerCapture(e.pointerId); } catch (err) {} },
      onPointerCancel: () => setDrag(false),
    },
  };
}

/* ---------------- The Reader / Reciter ---------------- */
/* The reader is the most-entered screen in the app — from the home's today
   card and resume card, the deity page, a search result, a practice step, a
   sitting, and every list lens. Its back arrow used to go to the deity page
   from all of them, so reciting today's stotra ended on a deity you had
   never opened. It now returns to `backView`, and hands that screen its own
   origin back as `from` so the chain holds for two hops. */
function ReaderView({ hymn, deity, go, theme, toggleTheme, lang, setLang, backView = "deity", retView }) {
  const LINE_MS = 3600;                       // fallback dwell; real dwell scales with line length
  const SIZES = [0.9, 1, 1.15, 1.3, 1.5];     // reader text-size steps
  const [showMeaning, setShowMeaning] = useState(false);
  /* karanyāsa and aṅganyāsa are steps of a rite, not of a reading: left out of
     the recitation — and out of the line sequence the reciter walks — unless
     the reader asks for them. A habit, so it is remembered globally. */
  const [ritualOn, setRitualOn] = useState(() => {
    if (STUTI_RECITE && STUTI_RECITE.isCustom(hymn.id)) return !!STUTI_RECITE.get(hymn.id).nyasa;
    return localStorage.getItem("stuti-ritual") === "1";
  });
  /* print and share stay open once a month, free — past that they are held,
     not disabled, until v2's paid plan exists to lift them for good */
  const [limAsk, setLimAsk] = useState(false);
  const [freeNote, setFreeNote] = useState("");
  const printLeft = useLimitLeft("print");
  const shareLeft = useLimitLeft("share");
  const gated = (gate, fn) => () => {
    if (STUTI_LIMITS.take(gate)) {
      fn();
      setFreeNote(STUTI_L.t("limFreeLeft", lang));
      setTimeout(() => setFreeNote(""), 3600);
      return;
    }
    setLimAsk(true);
  };
  const limTitle = (leftN, normal) => leftN > 0
    ? STUTI_L.t(normal, lang) + " · " + STUTI_L.t("limFreeOne", lang)
    : STUTI_L.t("limCap", lang);
  const [namesOpen, setNamesOpen] = useState(false);
  const [namaluOpen, setNamaluOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  /* pinned: the tools bar stays open under the title, remembered as a habit */
  const [panelPin, setPanelPin] = useState(() => localStorage.getItem("stuti-rdbar-pin") === "1");
  const togglePanelPin = () => setPanelPin(p => { const n = !p; localStorage.setItem("stuti-rdbar-pin", n ? "1" : "0"); if (n) setPanelOpen(false); return n; });
  const panelDismiss = () => { if (!panelPin) setPanelOpen(false); };
  const [playing, setPlaying] = useState(false);
  /* the comfortable recitation speed is a reader-wide habit, not a per-stotra
     one — remembered across sessions and carried across the nitya queue */
  const [speed, setSpeed] = useState(() => {
    const saved = parseFloat(localStorage.getItem("stuti-speed"));
    return (nityaQueue.getAuto() && nityaQueue.getSpeed()) || (Number.isFinite(saved) ? saved : 1);
  });
  const [loopMode, setLoopMode] = useState("off"); // off | all | verse (verse = drill one verse)
  /* ---- nitya parayana queue: after this stotra ends, count down and open the next ---- */
  const nq = nityaQueue.get();
  const nqNextId = nq && nq.ids && nq.ids[nq.idx] === hymn.id && nq.idx + 1 < nq.ids.length ? nq.ids[nq.idx + 1] : null;
  const [nextUp, setNextUp] = useState(null);   // the hymn about to begin
  const [nqCount, setNqCount] = useState(5);
  const [nqPaused, setNqPaused] = useState(false);
  const wasPlayingRef = useRef(false);
  const [fontScale, setFontScale] = useState(() => {
    const s = parseFloat(localStorage.getItem("stuti-fontscale"));
    return [0.9, 1, 1.15, 1.3, 1.5].includes(s) ? s : 1.5;
  });
  const [active, setActive] = useState(() => {   // resume where the reciter left off
    const total = (hymn.verses || []).reduce((n, v) => n + v.deva.split("\n").length, 0);
    const s = parseInt(localStorage.getItem("stuti-pos-" + hymn.id), 10);
    if (Number.isFinite(s) && s >= 0 && s < total) return s;
    /* no saved place — a customised recitation (Nitya's builder) starts at its
       first included movement rather than the pūrva pīṭhikā every hymn opens
       with by default */
    const cfgParts = hymnParts(hymn);
    const recite = STUTI_RECITE && STUTI_RECITE.get(hymn.id);
    if (cfgParts && recite && !STUTI_RECITE.hasPurva(recite)) {
      const first = cfgParts.find(p => p.key !== "purva") || cfgParts[cfgParts.length - 1];
      let li = 0; for (let i = 0; i < first.at; i++) li += hymn.verses[i].deva.split("\n").length;
      return li;
    }
    return -1;
  });
  /* One text, two views. `recite` pages verse by verse for chanting aloud;
     `flow` is the whole stotra in one column for reference and plain reading.
     The choice is a habit, not a per-stotra decision, so it is remembered
     globally. */
  /* Aṣṭottara-śata nāmāvalis are a list of names, not verses to page through:
     they read as the full column only, and the view switch is not offered. */
  const namavaliOnly = hymn.type === "Nāmāvali";
  const [mode, setMode] = useState(() => namavaliOnly || localStorage.getItem("stuti-readmode") === "flow" ? "flow" : "recite");
  const [learnOpen, setLearnOpen] = useState(false);   // reveal the learn-mode bar
  const [learnMode, setLearnMode] = useState("repeat"); // listen | repeat | memorize
  const [phase, setPhase] = useState("chant");         // chant | speak (Repeat)
  const [hint, setHint] = useState("initials");           // firstword | initials | blank (Memorize)
  const [peek, setPeek] = useState(false);
  const [word, setWord] = useState(0);   // karaoke: index of the currently-lit word in the active line
  const [pada, setPada] = useState(null);          // padārtha: { lineIdx, wordIdx } of the tapped word
  const [padaHint, setPadaHint] = useState(() => !localStorage.getItem("stuti-pada-seen"));
  const [recordOn, setRecordOn] = useState(false);   // record your turn and hear it back
  const [micNote, setMicNote] = useState(false);     // the mic was refused — say so, once
  const [repeatCount, setRepeatCount] = useState(() => { const n = parseInt(localStorage.getItem("stuti-repeat-count"), 10); return Number.isFinite(n) && n >= 1 && n <= 5 ? n : 1; });
  const [repIter, setRepIter] = useState(1);         // which pass through the current line's chant+speak cycle we're on
  const cycleRepeatCount = () => setRepeatCount(n => { const next = n >= 5 ? 1 : n + 1; localStorage.setItem("stuti-repeat-count", next); return next; });
  const rec = useRecTake();
  /* Repeat is a learn mode, not the reciter's default. Plain verse-by-verse
     reading kept running its two-beat cycle — the reader was told "your turn,
     recite aloud" for a recitation they had opened to simply read. */
  const repeatOn = learnOpen && learnMode === "repeat";
  /* find my place: the strip over the text, opened when the reciter lost the light */
  const [findOpen, setFindOpen] = useState(false);
  /* drift: in the full column, play glides the page instead of lighting words —
     for the reciter who knows the text and wants a page that turns itself */
  const [drift, setDrift] = useState(() => localStorage.getItem("stuti-drift") === "1");

  // Flatten every verse into a single sequence of recitable lines.
  const ritualSet = STUTI_RITUAL ? STUTI_RITUAL(hymn) : null;
  const hasRitual = !!(ritualSet && ritualSet.size);
  const hidRitual = !ritualOn && hasRitual ? ritualSet : null;
  const lines = [];
  hymn.verses.forEach((v, vi) => {
    if (hidRitual && hidRitual.has(vi)) return;
    const dv = v.deva.split("\n");
    const it = v.iast.split("\n");
    dv.forEach((d, li) => lines.push({ vi, li, last: li === dv.length - 1, deva: d, iast: it[li] || "" }));
  });

  /* the provided recitation for this hymn, if there is one whose cue table
     matches the text we just flattened */
  const song = audioFor(hymn, lines.length);
  const hasAudio = !!song;                  // a recording exists, and it plays for anyone
  const A = STUTI_AUDIO;
  /* Follow: the reader listens and the light keeps pace (hand-authored module) */
  const follow = useFollow({ hymn, lines, lang, active, setActive, setWord, setPlaying, onDone: () => STUTI_THREAD.mark("r", hymn.id) });

  const scrollRef = useRef(null);
  const lineRefs = useRef([]);
  const timer = useRef(null);
  const player = useRef(null);
  const seeking = useRef(false);   // a seek we asked for, so timeupdate does not fight it

  /* Listen plays the recording and follows it; Repeat plays one line and then
     waits. Both take the line's real length from the cue table rather than from
     a guess at how long the syllables ought to take. */
  const listening = learnOpen && learnMode === "listen" && hasAudio;
  const chanting = repeatOn && hasAudio && phase === "chant";
  const audioDriven = (listening || chanting) && playing;
  const drifting = drift && mode === "flow" && !learnOpen && playing;
  const scrollOn = drift && mode === "flow" && !learnOpen;   // the mode is armed, moving or held
  const lineMs = (i) => hasAudio && i >= 0
    ? (A.endOf(song, i) - A.startOf(song, i)) * 1000
    : lineDwell(lines[i] || null);

  // advance the recitation (Listen · Repeat · Memorize share one engine)
  useEffect(() => {
    if (!playing) { clearTimeout(timer.current); return; }
    if (active < 0) { setActive(0); return; }
    if (audioDriven) { clearTimeout(timer.current); return; }   // the recording paces it
    if (drifting) { clearTimeout(timer.current); return; }      // the column glides instead
    const dur = lineMs(active);
    const advance = () => setActive(a => {
      const vi = lines[a] ? lines[a].vi : 0;
      let vStart = a, vEnd = a;
      while (vStart > 0 && lines[vStart - 1].vi === vi) vStart--;
      while (vEnd < lines.length - 1 && lines[vEnd + 1].vi === vi) vEnd++;
      if (loopMode === "verse") return a >= vEnd ? vStart : a + 1;   // drill the current verse
      if (a + 1 < lines.length) return a + 1;
      if (loopMode === "all") return 0;
      setPlaying(false);
      return a;            // rest on the final line
    });
    if (repeatOn && phase === "speak") {
      timer.current = setTimeout(() => {
        if (repIter < repeatCount) { setRepIter(n => n + 1); return; }   // stay on "speak" for the next turn
        setRepIter(1);
        advance();
      }, (dur * 1.15) / speed);
      return () => clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      if (repeatOn) { setPhase("speak"); return; }
      advance();
    }, dur / speed);
    return () => clearTimeout(timer.current);
  }, [playing, active, speed, loopMode, learnMode, learnOpen, phase, audioDriven, repIter, repeatCount, drifting]);

  /* ---- the provided recitation ----
     One element, three jobs: play and pause with the reciter, follow the cue
     table so the lit line is the line being sung, and honour the loop. A seek
     we asked for sets a flag, because the timeupdate it causes would otherwise
     read as the reciter having moved. */
  useEffect(() => {
    const el = player.current;
    if (!el || !hasAudio) return;
    el.playbackRate = Math.max(0.5, Math.min(2.5, speed));
  }, [speed, hasAudio]);

  useEffect(() => {
    const el = player.current;
    if (!el || !hasAudio) return;
    if (!(listening || chanting) || !playing) { el.pause(); return; }
    const want = A.startOf(song, Math.max(0, active));
    /* start from the top of the line unless we are already inside it */
    if (Math.abs(el.currentTime - want) > 0.35 && (el.currentTime < want || el.currentTime > A.endOf(song, Math.max(0, active)) - 0.05)) {
      seeking.current = true;
      try { el.currentTime = want; } catch (e) {}
    }
    const p = el.play();
    if (p && p.catch) p.catch(() => setPlaying(false));   // autoplay refused: say so by stopping
  }, [listening, chanting, playing, active, hasAudio]);

  useEffect(() => {
    const el = player.current;
    if (!el || !hasAudio) return;
    const onTime = () => {
      if (seeking.current) { seeking.current = false; return; }
      const t = el.currentTime;
      if (chanting) {
        /* Repeat: the line is sung once, then the reciter's turn */
        if (active >= 0 && t >= A.endOf(song, active) - 0.06) { el.pause(); setPhase("speak"); }
        return;
      }
      if (!listening) return;
      const i = A.lineAt(song, t);
      if (loopMode === "verse" && active >= 0) {
        const vi = lines[active].vi;
        let vStart = active, vEnd = active;
        while (vStart > 0 && lines[vStart - 1].vi === vi) vStart--;
        while (vEnd < lines.length - 1 && lines[vEnd + 1].vi === vi) vEnd++;
        if (i > vEnd) { seeking.current = true; try { el.currentTime = A.startOf(song, vStart); } catch (e) {} setActive(vStart); return; }
      }
      if (i !== active) setActive(i);
    };
    const onEnd = () => {
      if (loopMode === "all") { seeking.current = true; try { el.currentTime = 0; } catch (e) {} setActive(0); el.play(); return; }
      setPlaying(false);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => { el.removeEventListener("timeupdate", onTime); el.removeEventListener("ended", onEnd); };
  }, [listening, chanting, active, loopMode, hasAudio]);

  // reset per-line learn state
  useEffect(() => { setPhase("chant"); setPeek(false); setRepIter(1); }, [active, learnMode]);

  /* the queue: arriving from the countdown, begin at once */
  useEffect(() => {
    if (nityaQueue.getAuto()) { nityaQueue.setAuto(false); setActive(0); setPlaying(true); }
  }, []);
  /* the recitation just finished on the last line — announce the next stotra */
  useEffect(() => {
    if (playing) { wasPlayingRef.current = true; return; }
    if (!wasPlayingRef.current) return;
    wasPlayingRef.current = false;
    if (!nqNextId || nextUp || loopMode !== "off" || active < lines.length - 1) return;
    const nh = STUTI.hymnById(nqNextId);
    if (nh) { setNextUp(nh); setNqCount(5); setNqPaused(false); }
  }, [playing]);
  /* the countdown itself — pausable, closable */
  useEffect(() => {
    if (!nextUp || nqPaused) return;
    if (nqCount <= 0) {
      nityaQueue.set({ ids: nq.ids, idx: nq.idx + 1, from: nq.from });
      nityaQueue.setAuto(true);
      nityaQueue.setSpeed(speed);
      setNextUp(null);
      go("reader", { deity: nextUp.deity, hymn: nextUp.id, from: nq.from || "daily" });
      return;
    }
    const t = setTimeout(() => setNqCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [nextUp, nqCount, nqPaused]);

  // Repeat mode with Record on: the reciter's turn is captured, then shown back
  const speakingNow = repeatOn && playing && phase === "speak";
  useEffect(() => {
    if (!recordOn) return;
    if (speakingNow) { rec.clear(); rec.start(); }
    else if (rec.state === "recording") rec.stop();
  }, [speakingNow, recordOn]);
  useEffect(() => { if (!recordOn) rec.forget(); }, [recordOn]);
  useEffect(() => {
    if (!recordOn) return;
    let live = true;
    const refuse = () => { if (live) { setMicNote(true); setRecordOn(false); } };
    const fp = document.featurePolicy || document.permissionsPolicy;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return refuse();
    if (fp && fp.allowsFeature && !fp.allowsFeature("microphone")) return refuse();
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "microphone" })
        .then(p => { if (p.state === "denied") refuse(); }).catch(() => {});
    }
    return () => { live = false; };
  }, [recordOn]);
  /* a refused microphone must not displace the your-turn cue: stand Record
     down and leave a note by its toggle */
  useEffect(() => {
    if (rec.state !== "denied") return;
    setMicNote(true);
    setRecordOn(false);
  }, [rec.state]);
  /* the take belongs to its line: leaving the line banks it, returning brings
     it back, and reciting the line again replaces it */
  useEffect(() => { rec.at(active); }, [active]);

  // remember reading position per hymn + chosen text size
  useEffect(() => {
    if (active >= 0) { try { localStorage.setItem("stuti-pos-" + hymn.id, String(active)); } catch (e) {} }
  }, [active, hymn.id]);

  // any real reading keeps the unbroken thread for today
  const threadRef = useRef(false);
  useEffect(() => {
    if (active >= 1 && !threadRef.current) { threadRef.current = true; STUTI_THREAD.mark("r", hymn.id); }
  }, [active, hymn.id]);

  // record the last-read hymn (+ position) so the home can offer to resume it
  useEffect(() => {
    if (active < 0) return;
    STUTI_PROGRESS.set({
      hymnId: hymn.id, deityId: deity.id,
      line: active, total: lines.length,
      verse: lines[active] ? lines[active].vi : 0,
      verses: hymn.verses.length,
      at: Date.now(),
    });
  }, [active, hymn.id]);
  useEffect(() => { try { localStorage.setItem("stuti-fontscale", String(fontScale)); } catch (e) {} }, [fontScale]);
  useEffect(() => { try { localStorage.setItem("stuti-ritual", ritualOn ? "1" : "0"); } catch (e) {} }, [ritualOn]);
  /* dropping the nyāsa shortens the sequence: a position saved with it included
     must not point past the end */
  useEffect(() => { if (active >= lines.length) setActive(Math.max(0, lines.length - 1)); }, [lines.length]);
  useEffect(() => { if (!namavaliOnly) try { localStorage.setItem("stuti-readmode", mode); } catch (e) {} }, [mode]);

  /* the full text carries the reciter too now: playing, the learn modes and
     the word light all survive the switch in both directions */
  const toFlow = () => { setPada(null); setMode("flow"); };
  /* entering the reciter from a tapped verse starts on that verse's first line */
  const toRecite = (vi) => {
    if (namavaliOnly) return;
    setMode("recite");
    if (vi != null) { const i = lines.findIndex(l => l.vi === vi); if (i >= 0) setActive(i); }
  };
  const flow = mode === "flow";
  /* where flow's reading has got to — a ref plus a coarse state, so the part
     tabs can follow the scroll without re-rendering the column under it */
  const flowAt = useRef(0);
  const [flowPart, setFlowPart] = useState(0);
  const flowSeen = (vi) => {
    flowAt.current = vi;
    const ps = parts || [];
    let p = 0;
    ps.forEach((x, i) => { if (vi >= x.at) p = i; });
    setFlowPart(p);
  };
  /* the full text is a reader in its own right: a tap recites from that verse
     in place, and a word tap on the lit verse opens padārtha, as in the verse
     view. Memorize masks the whole column; a tap on the current verse peeks it. */
  const flowMask = learnOpen && learnMode === "memorize" && !peek;
  const flowPick = (vi) => {
    if (flowMask) setPeek(true);
    const i = lines.findIndex(l => l.vi === vi);
    if (i >= 0 && i !== active) setActive(i);
  };
  const flowWord = (vi, li, wi) => {
    const i = lines.findIndex(l => l.vi === vi && l.li === li);
    if (i >= 0) openPada(i, wi);
  };

  // gently center the active line
  const centerActive = (how) => {
    if (mode === "flow") return;             // the flow column follows its own light
    const el = lineRefs.current[active];
    const sc = scrollRef.current;
    if (!el || !sc) return;
    /* measured against the scroll box itself — offsetTop answers to the
       offset parent, which is not the scroller here */
    const delta = el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    const target = sc.scrollTop + delta - Math.max(0, (sc.clientHeight - el.clientHeight) / 2);
    sc.scrollTo({ top: Math.max(0, target), behavior: how || "smooth" });
  };
  useEffect(() => {
    if (active < 0) return;
    centerActive();
  }, [active]);
  /* the scroller keeps its box when the letters grow inside it, so the observer
     below never hears a size change — the active line has to be put back by hand */
  useEffect(() => {
    if (active < 0) return;
    const id = requestAnimationFrame(() => centerActive("auto"));
    return () => cancelAnimationFrame(id);
  }, [fontScale]);
  /* the learn strips shrink the verse viewport as they mount — re-center
     whenever its height changes, or the active line scrolls out of sight */
  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc || typeof ResizeObserver === "undefined") return;
    let raf = 0;
    const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (active >= 0) centerActive(); }); };
    const ro = new ResizeObserver(run);
    ro.observe(sc);
    window.addEventListener("resize", run);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("resize", run); };
  }, [active]);

  // word-by-word (karaoke) highlight within the active line during the chant dwell
  useEffect(() => { setWord(0); }, [active, learnMode, lang]);
  useEffect(() => {
    if (!playing || active < 0 || drifting) return;
    const isMasked = learnMode === "memorize" && !peek;
    if (isMasked) return;                               // memorize (hidden): nothing to light
    /* the reciter's own turn deserves the same word-by-word light as the lead-through
       — it is still a recitation, paced to the turn's own (slightly longer) duration,
       and losing the highlight there made the "their turn" pass harder to follow, not easier */
    const durMs = repeatOn && phase === "speak" ? lineMs(active) * 1.15 : lineMs(active);
    const mainText = lineMainText(lines[active], lang);
    const wc = countWords(mainText);
    if (wc <= 1) { setWord(0); return; }
    const durs = wordDurations(mainText, durMs / speed);
    let i = 0, id;
    setWord(0);
    const step = () => {
      i += 1;
      if (i >= wc) return;
      setWord(i);
      if (i < wc - 1) id = setTimeout(step, durs[i]);
    };
    id = setTimeout(step, durs[0]);
    return () => clearTimeout(id);
  }, [playing, active, speed, learnMode, phase, lang, peek, hint, repIter, drifting]);

  /* the drift engine. Pace is the whole text's natural dwell spread over the
     column's height, so a dense sahasranāma page passes slower than a sparse
     one, and the speed stepper scales it as it scales the light. A touch or a
     wheel holds the page; it resumes a beat after the hand lifts. The end of
     the column ends the reading. */
  const holdUntil = useRef(0);
  const loopRef = useRef(loopMode); loopRef.current = loopMode;   // read inside the frame loop without restarting it
  const hush = useRef(false);   // the next pointer move came from the page itself — do not scroll to it
  useEffect(() => {
    if (!drifting) return;
    const sc = scrollRef.current;
    if (!sc) return;
    /* play pressed at the foot of the page: a reading that ended begins again */
    if (sc.scrollTop >= sc.scrollHeight - sc.clientHeight - 1) sc.scrollTop = 0;
    holdUntil.current = 0;
    const totalMs = lines.reduce((s, l) => s + lineDwell(l), 0) / speed;
    let raf = 0, last = performance.now(), acc = 0;
    const tick = (now) => {
      const dt = Math.min(64, now - last); last = now;
      const max = sc.scrollHeight - sc.clientHeight;
      if (now >= holdUntil.current && max > 0) {
        const pxPerMs = sc.scrollHeight / totalMs;
        acc += pxPerMs * dt;
        if (acc >= 1) { const px = Math.floor(acc); acc -= px; sc.scrollTop = Math.min(max, sc.scrollTop + px); }
        if (sc.scrollTop >= max - 1) {
          /* loop: back to the top and keep going; otherwise the reading ends */
          if (loopRef.current === "all") { sc.scrollTop = 0; } else { setPlaying(false); return; }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const hold = () => { holdUntil.current = performance.now() + 1400; };
    const holdOn = () => { holdUntil.current = Infinity; };
    sc.addEventListener("touchstart", holdOn, { passive: true });
    sc.addEventListener("touchend", hold, { passive: true });
    sc.addEventListener("touchcancel", hold, { passive: true });
    sc.addEventListener("pointerdown", holdOn, { passive: true });
    sc.addEventListener("pointerup", hold, { passive: true });
    sc.addEventListener("wheel", hold, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      sc.removeEventListener("touchstart", holdOn); sc.removeEventListener("touchend", hold); sc.removeEventListener("touchcancel", hold);
      sc.removeEventListener("pointerdown", holdOn); sc.removeEventListener("pointerup", hold); sc.removeEventListener("wheel", hold);
      /* the pointer follows the page: wherever the drift left off is where the
         reader is, for the saved position and for the verse view */
      const i = lines.findIndex(l => l.vi === flowAt.current);
      if (i >= 0 && i !== active) { hush.current = true; setActive(i); }
    };
  }, [drifting, speed]);
  const setPace = (n) => {
    if (n === drift) return;
    try { localStorage.setItem("stuti-drift", n ? "1" : "0"); } catch (e) {}
    /* choosing Scroll is asking for the page to move — it begins at once, from
       here; choosing Pointer hands the place back to the light and waits */
    if (n) { if (active < 0) setActive(0); setPlaying(true); } else setPlaying(false);
    setDrift(n);
  };
  const findPick = (i) => { setFindOpen(false); setPada(null); setActive(i); };

  /* with Scroll on, the reciter bar is the page's transport: the rail shows how
     far down the page is and scrubs it, the steps move a verse at a time */
  const [scrollFrac, setScrollFrac] = useState(0);
  useEffect(() => {
    if (!scrollOn) return;
    const sc = scrollRef.current;
    if (!sc) return;
    let raf = 0;
    const read = () => { raf = 0; const max = sc.scrollHeight - sc.clientHeight; setScrollFrac(max > 0 ? sc.scrollTop / max : 0); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    sc.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => { cancelAnimationFrame(raf); sc.removeEventListener("scroll", onScroll); };
  }, [scrollOn]);
  const pageTo = (top) => {
    const sc = scrollRef.current; if (!sc) return;
    holdUntil.current = performance.now() + 900;   // let the hand finish before the page moves on
    sc.scrollTop = Math.max(0, Math.min(sc.scrollHeight - sc.clientHeight, top));
  };
  const pageVerse = (dir) => {
    const sc = scrollRef.current; if (!sc) return;
    const vis = hymn.verses.map((v, i) => i).filter(i => !hidRitual || !hidRitual.has(i));
    const k = vis.indexOf(flowAt.current);
    const target = vis[Math.max(0, Math.min(vis.length - 1, (k < 0 ? 0 : k) + dir))];
    const el = sc.querySelector('.flow-v[data-vi="' + target + '"]');
    if (!el) return;
    pageTo(sc.scrollTop + el.getBoundingClientRect().top - sc.getBoundingClientRect().top - 84);
  };

  /* padārtha — the tapped word, resolved in the reading script */
  const padaInfo = (() => {
    if (!pada) return null;
    const ln = lines[pada.lineIdx];
    if (!ln) return null;
    const v = hymn.verses[ln.vi];
    const tdv = v.tdeva ? v.tdeva.split("\n") : null;
    const shown = lang === "telugu" ? ((tdv && tdv[ln.li]) || STUTI_TRANSLIT.convert(ln.deva, "telugu"))
                : lang === "deva" ? ln.deva : ln.iast;
    const dws = STUTI_PADA.words(shown);
    const iws = STUTI_PADA.words(ln.iast);
    if (!dws.length) return null;
    const i = Math.max(0, Math.min(pada.wordIdx, dws.length - 1));
    return { display: STUTI_PADA.trimTok(dws[i]), iast: iws[i] || dws[i], wordIdx: i, count: dws.length, lineIdx: pada.lineIdx };
  })();
  const openPada = (lineIdx, wordIdx) => {
    setActive(lineIdx);
    setPlaying(false);
    setPada({ lineIdx, wordIdx });
    if (padaHint) { setPadaHint(false); try { localStorage.setItem("stuti-pada-seen", "1"); } catch (e) {} }
  };
  const jumpToOcc = (o) => {
    setPada(null);
    if (o.hymnId === hymn.id) { setActive(o.lineIdx); return; }
    try { localStorage.setItem("stuti-pos-" + o.hymnId, String(o.lineIdx)); } catch (e) {}
    go("reader", { hymn: o.hymnId, deity: o.deityId, from: backView, ret: retView });
  };

  const togglePlay = () => {
    if (active < 0) setActive(0);
    setPlaying(p => !p);
  };
  /* Loop-verse means nothing to a gliding page; with Scroll on the loop is only off or all */
  const cycleLoop = () => setLoopMode(m => scrollOn ? (m === "off" ? "all" : "off") : (m === "off" ? "all" : m === "all" ? "verse" : "off"));
  useEffect(() => { if (scrollOn && loopMode === "verse") setLoopMode("all"); }, [scrollOn]);
  const bumpSize = (dir) => setFontScale(s => SIZES[Math.max(0, Math.min(SIZES.length - 1, SIZES.indexOf(s) + dir))]);
  const restart = () => { setActive(0); setPlaying(true); };
  const step = (dir) => {
    if (scrollOn) { pageVerse(dir); return; }
    setActive(a => {
      const n = Math.min(lines.length - 1, Math.max(0, (a < 0 ? 0 : a) + dir));
      return n;
    });
  };
  const SPEED_MIN = 0.5, SPEED_MAX = 2.5, SPEED_STEP = 0.05;
  const SPEEDS = [SPEED_MIN, SPEED_MAX];
  const stepSpeed = (d) => setSpeed(s => { const n = Math.round(Math.max(SPEED_MIN, Math.min(SPEED_MAX, s + d * SPEED_STEP)) * 100) / 100; localStorage.setItem("stuti-speed", n); return n; });
  const seekLine = (f) => {
    if (scrollOn) { const sc = scrollRef.current; if (sc) pageTo(f * (sc.scrollHeight - sc.clientHeight)); return; }
    setActive(Math.max(0, Math.min(lines.length - 1, Math.round(f * (lines.length - 1)))));
  };
  const seekVerse = (f) => {
    const vi = Math.max(0, Math.min(hymn.verses.length - 1, Math.round(f * (hymn.verses.length - 1))));
    /* the first line at or after that verse — so a scrub across a section left
       out of the reading carries on rather than stalling on it */
    let i = lines.findIndex(l => l.vi >= vi);
    if (i < 0) i = lines.length - 1;
    setActive(i);
  };
  const lineScrub = useScrub(seekLine);
  const verseScrub = useScrub(seekVerse);
  const parts = (() => {
    const p = hymnParts(hymn);
    const recite = p && STUTI_RECITE && STUTI_RECITE.get(hymn.id);
    if (!recite) return p;
    return p.filter(x => (x.key !== "purva" || STUTI_RECITE.hasPurva(recite)) && (x.key !== "uttara" || STUTI_RECITE.hasUttara(recite)));
  })();
  const goVerse = (vi) => { const i = lines.findIndex(l => l.vi >= vi); if (i >= 0) setActive(i); };

  /* included, and the reciter has arrived at it: let them step past it without
     having to leave the verse and turn the chip off */
  const skipRitual = () => {
    if (!hasRitual) return;
    let j = curVerse;
    while (j < hymn.verses.length && ritualSet.has(j)) j++;
    goVerse(Math.min(j, hymn.verses.length - 1));
  };

  const curLine = active >= 0 ? (lines[active] || lines[lines.length - 1]) : null;
  /* The active index counts lines in a sequence the nyāsa toggle lengthens or
     shortens, so the same number names a different line afterwards. Remember the
     verse and line the reader was on, and find them again once it is rebuilt. */
  const place = useRef(null);
  const toggleRitual = () => {
    place.current = curLine ? { vi: curLine.vi, li: curLine.li } : null;
    setRitualOn(v => !v);
  };
  useLayoutEffect(() => {
    const p = place.current; place.current = null;
    if (!p || active < 0) return;
    let i = lines.findIndex(l => l.vi === p.vi && l.li === p.li);
    if (i < 0) i = lines.findIndex(l => l.vi >= p.vi);       // the verse itself was dropped
    if (i < 0) i = lines.length - 1;
    if (i !== active) setActive(i);
  }, [ritualOn]);
  const activeVerse = curLine ? curLine.vi : -1;
  const curVerse = curLine ? curLine.vi : (lines[0] ? lines[0].vi : 0);
  const progress = scrollOn ? scrollFrac : active < 0 ? 0 : (active + 1) / lines.length;
  const speaking = repeatOn && playing && phase === "speak";
  const masked = learnMode === "memorize" && !peek;

  // catalogued by name, text not keyed yet — a real waiting state, not a dead end
  if (!hymn.verses || hymn.verses.length === 0) {
    return <AwaitingText hymn={hymn} deity={deity} go={go} lang={lang} theme={theme} toggleTheme={toggleTheme} backView={backView} retView={retView} />;
  }

  const panelBody = (
    <React.Fragment>
      <button className="icon-btn" onClick={() => { panelDismiss(); go("settings", { from: "reader" }); }}
        aria-label={STUTI_L.t("settings", lang)} title={STUTI_L.t("settings", lang)}>
        <Icon name="cog" size={20} />
      </button>
      <RdScriptSeg lang={lang} setLang={setLang} />
      <SizePicker dec={() => bumpSize(-1)} inc={() => bumpSize(1)} atMin={fontScale <= SIZES[0]} atMax={fontScale >= SIZES[SIZES.length - 1]} />
      <FollowButton follow={follow} lang={lang} />
      <span className="rd-toppanel-gap" />
      <button className={"icon-btn" + (shareLeft <= 0 ? " is-locked" : "")} title={limTitle(shareLeft, "share")} aria-label={STUTI_L.t("share", lang)}
        onClick={() => { panelDismiss(); gated("share", () => setShareOpen(true))(); }}>
        <Icon name="share" size={20} />
        {shareLeft <= 0 && <span className="lock-dot"><Icon name="lock" size={9} /></span>}
      </button>
      <button className={"icon-btn" + (printLeft <= 0 ? " is-locked" : "")} title={limTitle(printLeft, "printIt")} aria-label={STUTI_L.t("printIt", lang)}
        onClick={() => { panelDismiss(); gated("print", () => printStotra(hymn, lang, showMeaning))(); }}>
        <Icon name="print" size={20} />
        {printLeft <= 0 && <span className="lock-dot"><Icon name="lock" size={9} /></span>}
      </button>
      <button className="icon-btn" onClick={toggleTheme} aria-label={STUTI_L.t("dayNight", lang)} title={STUTI_L.t("dayNight", lang)}>
        <Icon name={theme === "night" ? "sun" : "moon"} size={20} />
      </button>
      <button className={"icon-btn rd-pin-btn" + (panelPin ? " is-on" : "")} onClick={togglePanelPin} aria-pressed={panelPin}
        aria-label="Pin" title="Pin">
        <Icon name="pin" size={19} />
      </button>
    </React.Fragment>
  );
  return (
    <div className="view reader" style={deityStyle(deity, { flex: 1, "--rd-scale": fontScale })}>
      {panelPin && <div className="rd-toppanel is-pinned">{panelBody}</div>}
      <div className="topbar reader-topbar">
        <button className="icon-btn" onClick={() => go(backView, { deity: deity.id, from: retView })} aria-label={STUTI_L.a("aBack")}>
          <Icon name="back" />
        </button>
        <div className="reader-topbar-title">
          <div className="reader-topbar-name display">{hymnTitle(hymn, lang)}<FavButton id={hymn.id} size={21} /></div>
        </div>
        {/* settings in the corner; when the panel is pinned it carries its own gear */}
        {!panelPin ? <button className="icon-btn" onClick={() => setPanelOpen(v => !v)} aria-expanded={panelOpen}
          aria-label={STUTI_L.t("readAs", lang)} title={STUTI_L.t("readAs", lang)}>
          <Icon name="pin" size={19} />
        </button> : <span className="rd-topbar-pad" aria-hidden="true" />}
      </div>

      {/* line three — how the text reads. Three controls, no scroller: the two
         views share one glyph pair and only the chosen one says its name. */}
      <div className="reader-layers tight" hidden={learnOpen && (playing || (recordOn && (!!rec.take || rec.recording)))}>
        {hymn.about && (
          <button className="icon-btn" onClick={() => setStoryOpen(true)} aria-label={STUTI_L.t("story", lang)} title={STUTI_L.t("story", lang)}>
            <Icon name="book" size={19} />
          </button>
        )}
        {!namavaliOnly && <div className="rd-view" role="tablist" aria-label={STUTI_L.t("readAs", lang)}>
          <button className={"rd-view-btn" + (!flow ? " on" : "")} role="tab" aria-selected={!flow}
            aria-label={STUTI_L.t("viewVerse", lang)} title={STUTI_L.t("viewVerse", lang)}
            onClick={() => toRecite(flow ? flowAt.current : null)}>
            <span>{STUTI_L.t("viewVerse", lang)}</span>
          </button>
          <button className={"rd-view-btn" + (flow ? " on" : "")} role="tab" aria-selected={flow}
            aria-label={STUTI_L.t("viewFlow", lang)} title={STUTI_L.t("viewFlow", lang)}
            onClick={toFlow}>
            <span>{STUTI_L.t("viewFlow", lang)}</span>
          </button>
        </div>}
        <button className={"chip" + (showMeaning ? " chip-on" : "")} onClick={() => setShowMeaning(v => !v)}>
          {STUTI_L.t("meaning", lang)}
        </button>
        <button className={"chip chip-learn" + (learnOpen ? " chip-on" : "")} onClick={() => setLearnOpen(o => { const n = !o; if (!n) { setLearnMode(hasAudio ? "listen" : "repeat"); setPlaying(false); } return n; })}>
          {STUTI_L.t("learn", lang)}
        </button>
        {/* how the page moves — two named stops, only where there is a page to move */}
        {flow && !learnOpen && !namaluOpen && (
          <div className="rd-view rd-pace" role="tablist" aria-label={STUTI_L.t("paceLbl", lang)} title={STUTI_L.t(drift ? "driftNote" : "pointerNote", lang)}>
            <button className={"rd-view-btn" + (!drift ? " on" : "")} role="tab" aria-selected={!drift} onClick={() => setPace(false)}
              style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null}>
              <span>{STUTI_L.t("pacePointer", lang)}</span>
            </button>
            <button className={"rd-view-btn" + (drift ? " on" : "")} role="tab" aria-selected={drift} onClick={() => setPace(true)}
              style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null}>
              <span>{STUTI_L.t("drift", lang)}</span>
            </button>
          </div>
        )}
        <button className={"icon-btn rd-story-end" + (findOpen ? " is-on" : "")} onClick={() => setFindOpen(o => !o)} aria-expanded={findOpen}
          aria-label={STUTI_L.t("findPlace", lang)} title={STUTI_L.t("findPlace", lang)}>
          <Icon name="search" size={19} />
        </button>
      </div>

      {/* line four — the nyāsa, on the two or three texts that have one. Its own
         row: it is a decision about the rite, not about how the text reads. */}
      {hasRitual && !parts && (
        <div className="reader-layers tight rd-nyasa" hidden={learnOpen && (playing || (recordOn && (!!rec.take || rec.recording)))}>
          <button className={"chip" + (ritualOn ? " chip-on" : "")} onClick={toggleRitual}
            title={STUTI_L.t("ritualNote", lang)}
            style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null}>
            {STUTI_L.t("ritualChip", lang)}
          </button>
          <span className="rd-nyasa-note">{STUTI_L.t("ritualNote", lang)}</span>
        </div>
      )}

      {parts && (
        <div className="rd-parts" role="tablist" aria-label={STUTI_L.a("aParts")}>
          {parts.map((p, i) => {
            const next = parts[i + 1] ? parts[i + 1].at : hymn.verses.length;
            const on = !storyOpen && (flow ? flowPart === i : (curVerse >= p.at && curVerse < next));
            const partIcon = { purva: "chevron-left", uttara: "chevron-right" }[p.key];
            const label = STUTI_L.t(p.key, lang);
            if (p.key === "stotram" && hymn.namesKey) {
              return (
                <div key={p.key} className="rd-part-seg" role="presentation">
                  <button className={"rd-seg-opt" + (on && !namaluOpen ? " on" : "")} role="tab" aria-selected={on && !namaluOpen}
                    onClick={() => { setNamaluOpen(false); goVerse(p.at); }} aria-label={STUTI_L.t("tabNamavali", lang)} title={STUTI_L.t("tabNamavali", lang)}
                    style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : null}>
                    {STUTI_L.t("tabNamavali", lang)}
                  </button>
                  <button className={"rd-seg-opt" + (namaluOpen ? " on" : "")} role="tab" aria-selected={namaluOpen}
                    onClick={() => setNamaluOpen(true)} aria-label={STUTI_L.t("tabNamalu", lang)} title={STUTI_L.t("tabNamalu", lang)}
                    style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : null}>
                    {STUTI_L.t("tabNamalu", lang)}
                  </button>
                </div>
              );
            }
            return (
              <button key={p.key} className={"rd-part" + (on ? " on" : "")} role="tab" aria-selected={on}
                onClick={() => goVerse(p.at)} aria-label={label} title={label}
                style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : null}>
                {partIcon ? <Icon name={partIcon} size={18} /> : (p.key === "stotram" ? STUTI_L.t("gsNamavali", lang) : label)}
              </button>
            );
          })}
          {/* the names glossary rides at the end of the parts row on a sahasranāma —
             in the control row it pushed the search glyph out of sight */}
          {hymn.namesKey && (
            <button className="icon-btn rd-parts-end" onClick={() => setNamesOpen(true)} aria-label={STUTI_L.t("namesLbl", lang)} title={STUTI_L.t("namesLbl", lang)}>
              <Icon name="list" size={19} />
            </button>
          )}

        </div>
      )}

      {follow.showChip && <FollowChip follow={follow} lang={lang} />}
      {findOpen && (
        <FindStrip lines={lines} hymn={hymn} lang={lang} active={active} onPick={findPick} onClose={() => setFindOpen(false)} />
      )}

      {learnOpen && (
        <div className="rd-modebar">
          <div className="rd-seg">
            {[...(hasAudio ? [["listen", "listen"]] : []), ["repeat", "repeatMode"], ["memorize", "memorize"]].map(([k, key]) => (
              <button key={k} className={"rd-seg-btn" + (learnMode === k ? " on" : "")}
                onClick={() => { setLearnMode(k); setPlaying(false); setActive(a => a < 0 ? 0 : a); }}>
                {STUTI_L.t(key, lang)}
              </button>
            ))}
            {/* the take toggle rides in the same row — a second band would eat the verse */}
            {learnMode === "repeat" && (
              <button className="rd-seg-rec rd-seg-repcount" onClick={cycleRepeatCount}
                aria-label={STUTI_L.a("aRepeatCount")} title={STUTI_L.a("aRepeatCount")}>
                <Icon name="repeat" size={17} /><span>×{repeatCount}</span>
              </button>
            )}
            {learnMode === "repeat" && (
              <button className={"rd-seg-rec" + (recordOn ? " on" : "")} onClick={() => setRecordOn(v => !v)}
                disabled={micNote} aria-pressed={recordOn} aria-label={STUTI_L.t("recordTurn", lang)} title={STUTI_L.t("recordTurn", lang)}>
                <Icon name="mic" size={17} />
              </button>
            )}
            {/* the plan is the third thing you can do with a text you are learning,
               so it sits in the learn bar rather than in the settings row, where it
               was a second door to the same room */}
            <LearnButton id={hymn.id} size={20} go={go} from="reader" />
            {/* always-available exit — while playing or holding a take the chip
               row above is hidden, and Learn could not be switched off at all */}
            <button className="rd-seg-exit" onClick={() => { setLearnOpen(false); setLearnMode(hasAudio ? "listen" : "repeat"); setPlaying(false); }}
              aria-label={STUTI_L.t("close", lang)} title={STUTI_L.t("close", lang)}>
              <Icon name="close" size={17} />
            </button>
          </div>
          {learnMode === "repeat" && micNote && (
            <div className="rd-peekhint">{STUTI_L.t("micDenied", lang)}</div>
          )}
          {learnMode === "memorize" && (
            <div className="rd-hints">
              {[["firstword", "hintFirstWord"], ["initials", "hintInitials"], ["blank", "hintBlank"]].map(([k, key]) => (
                <button key={k} className={"rd-hint-btn" + (hint === k ? " on" : "")}
                  onClick={() => { setHint(k); setPeek(false); }}>{STUTI_L.t(key, lang)}</button>
              ))}
            </div>
          )}
          {learnMode === "memorize" && !peek && (
            <div className="rd-peekhint">{STUTI_L.t("tapPeek", lang)}</div>
          )}
        </div>
      )}

      {/* verse progress rail — one filled mark per verse */}
      {!flow && hymn.verses.length > 1 && hymn.verses.length <= 24 && (
        <div className="reader-versedots">
          {hymn.verses.map((v, vi) => (
            <button key={vi} className={"rvd" + (vi === curVerse ? " on" : "") + (vi < curVerse ? " done" : "")}
              onClick={() => setActive(lines.findIndex(l => l.vi === vi))} aria-label={"Verse " + (vi + 1)} />
          ))}
        </div>
      )}

      {/* one verse at a time, or the whole text in one column */}
      <div className={"reader-scroll scroll" + (flow ? " is-flow" : "")} ref={scrollRef}>
        {namaluOpen ? (
          <NamaluList hymn={hymn} lang={lang} />
        ) : flow ? (
          <FlowText hymn={hymn} lang={lang} showMeaning={showMeaning} scale={fontScale}
            at={curLine ? { vi: curLine.vi, li: curLine.li } : null}
            word={word} lit={(playing && !drifting) || follow.on} masked={flowMask} hint={hint} peek={peek}
            onPick={flowPick} onWord={flowWord} onSeen={flowSeen}
            ritual={hidRitual} ritualOn={ritualOn} onRitual={toggleRitual}
            onOpenNames={() => setNamesOpen(true)}
            scrollRef={scrollRef} hush={hush} plain={scrollOn} />
        ) : (
        <div className="reader-verse-stage">
          {(() => {
            const v = hymn.verses[curVerse];
            const startIdx = lines.findIndex(l => l.vi === curVerse);
            const dv = v.deva.split("\n");
            const it = v.iast.split("\n");
            const tdv = v.tdeva ? v.tdeva.split("\n") : null;   // explicit Telugu mūla, where the derived form isn't how it is written
            return (
              <div className="verse verse-active">
                {hymn.verses.length > 1 && (
                  <div className="verse-count">{curVerse + 1} / {hymn.verses.length}</div>
                )}
                {v.sp && (
                  <div className="verse-speaker" style={lang === "telugu" ? { fontFamily: "var(--font-telugu)" } : lang === "deva" ? { fontFamily: "var(--font-deva)" } : null}>
                    {lang === "telugu" ? v.sp.tel : lang === "deva" ? v.sp.deva : (v.sp.iast || v.sp.tel)}
                  </div>
                )}
                <div className="verse-body">
                <div className="verse-lines">
                  {dv.map((d, li) => {
                    const idx = startIdx + li;
                    const on = idx === active;
                    const isLast = li === dv.length - 1;
                    const showNum = isLast && hymn.verses.length > 1 && !v.pr;
                    return (
                      <div key={li} ref={el => (lineRefs.current[idx] = el)}
                        className={"line" + (on ? " line-on" : "") + ((playing || follow.on) && !on ? " line-off" : "")}
                        onClick={() => { if (masked) setPeek(true); setActive(idx); }}>
                        {(() => {
                          var mainText = STUTI_BIND(lang === "telugu" ? ((tdv && tdv[li]) || STUTI_TRANSLIT.convert(d, "telugu")) : lang === "deva" ? d : it[li]);
                          /* trailing verse number, danda-and-number-and-danda in the
                             mūla's own script — Mahāgaṇapati Sahasranāma's own text
                             already carries this; everyone else gets it appended here
                             so recite mode reads the way the source stotras do. */
                          if (showNum && !/(?:\|\||[।॥])\s*[0-9०-९౦-౯]+\s*(?:\|\||[।॥])\s*$/.test(mainText.trim())) {
                            const num = v.n ? v.n : curVerse + 1;
                            mainText = mainText.replace(/\s*(\|\||[।॥])\s*$/, "");
                            mainText += lang === "roman" ? (" || " + num + " ||") : (" ॥ " + num + " ॥");
                          }
                          const markM = mainText.match(/\s*((?:\|\||[।॥])\s*[0-9०-९౦-౯]+\s*(?:\|\||[।॥]))\s*$/);
                          const bodyText = markM ? mainText.slice(0, markM.index) : mainText;
                          const markText = markM ? markM[1] : null;
                          const mainCls = lang === "deva" ? "line-deva deva" : lang === "telugu" ? "line-telugu" : "line-iast-lead";
                          return <div className={mainCls}>{
                            masked ? <RecMasked text={mainText} hint={hint} />
                            : <React.Fragment>
                                <WordRun text={bodyText} upto={on ? word : -1} lit={on && (playing || follow.on)}
                                  onWord={(wi) => openPada(idx, wi)} />
                                {markText && <span className="verse-end-mark">{"\u2002" + markText.replace(/\s+/g, "\u2009")}</span>}
                              </React.Fragment>
                          }</div>;
                        })()}

                      </div>
                    );
                  })}
                </div>
                {showMeaning && !masked && STUTI_MEAN(v, lang) && (
                  <div className="verse-meaning" style={{ fontFamily: STUTI_MEAN.font(v, lang) }}>
                    {STUTI_MEAN(v, lang)}
                  </div>
                )}
                {/* A name-śloka carries no sentence to translate — its meaning is the
                    thousand names one at a time, which live in the glossary. Saying so
                    is better than the blank the reader used to get with Meaning on. */}
                {showMeaning && !masked && !STUTI_MEAN(v, lang) && hymn.namesKey && (
                  <button className="verse-mean-names" onClick={() => setNamesOpen(true)}>
                    <Icon name="lotus" size={14} /> {STUTI_L.t("meaningInNames", lang)}
                  </button>
                )}
                </div>
                {hasRitual && ritualSet.has(curVerse) && !masked && (
                  <button className="verse-skip" onClick={skipRitual}>
                    <Icon name="next" size={14} /> {STUTI_L.t("ritualSkip", lang)}
                  </button>
                )}
                {padaHint && !masked && (
                  <div className="pd-hint"><Icon name="lotus" size={15} /> {STUTI_L.t("tapWordHint", lang)}</div>
                )}
                {curVerse === hymn.verses.length - 1 && hymn.colophon && (lang === "telugu" ? hymn.colophon.tel : hymn.colophon.deva) && (
                  <div className="colophon">
                    <div className="colophon-mula" style={{ fontFamily: lang === "telugu" ? "var(--font-telugu)" : "var(--font-deva)" }}>
                      ॥ {(lang === "telugu" ? hymn.colophon.tel : hymn.colophon.deva)} ॥
                    </div>
                    {lang !== "telugu" && <div className="colophon-en">{hymn.colophon.en}</div>}
                  </div>
                )}
                {curVerse === hymn.verses.length - 1 && (
                  <div className="reader-end">
                    <Flame size={28} />
                    <div style={{ fontFamily: scriptFontFor(lang), fontSize: 20, color: "var(--accent-ink)" }}>{STUTI_L.t("shubham", lang)}</div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        )}
      </div>

      {/* Repeat mode: the your-turn strip, replaced by the take once there is one */}
      {repeatOn && recordOn && (rec.take || rec.recording) ? (
        <RecordStrip rec={rec} lang={lang}
          expectedMs={active >= 0 ? lineMs(active) / speed : 3000}
          beats={(() => {
            if (active < 0) return [];
            const txt = lineMainText(lines[active], lang);
            const total = lineMs(active) / speed;
            const durs = wordDurations(txt, total);
            let acc = 0;
            return durs.slice(0, -1).map(d => (acc += d) / total);
          })()}
          onAgain={() => { rec.clear(); setPhase("speak"); setPlaying(true); }} />
      ) : repeatOn && playing ? (
        <div className={"rd-speak" + (speaking ? " on" : "")}>
          <span className="rd-mic">
            <span className="rd-core">◉</span>
          </span>
          <span className="rd-speak-cap">{recordOn && rec.state === "recording" ? STUTI_L.t("recording", lang) : speaking ? STUTI_L.t("yourTurn", lang) + (repeatCount > 1 ? ` (${repIter}/${repeatCount})` : "") : STUTI_L.t(hasAudio ? "listenNow" : "followLine", lang)}</span>
          {speaking && <button className="rd-said" onClick={() => setActive(a => Math.min(lines.length - 1, a + 1))}>{STUTI_L.t("saidIt", lang)}</button>}
        </div>
      ) : null}

      {/* the provided recitation. One element for the whole hymn — seeking within
         one file is instant, where a file per line would be a thousand fetches. */}
      {hasAudio && <audio ref={player} src={song.src} preload="metadata" />}

      {padaInfo && (
        <OverlayPortal>
          <PadaSheet pada={padaInfo} hymn={hymn} lang={lang} onClose={() => setPada(null)} onJump={jumpToOcc}
            onStep={(dir) => setPada(p => p && { lineIdx: p.lineIdx, wordIdx: Math.max(0, Math.min(padaInfo.count - 1, padaInfo.wordIdx + dir)) })} />
        </OverlayPortal>
      )}
      {freeNote && <div className="free-toast" role="status">{freeNote}</div>}
      {nextUp && (
        <div className="nextup-scrim" role="dialog" aria-modal="true">
          <div className="nextup-card" style={deityStyle(STUTI.deityById[nextUp.deity])}>
            <div className="nextup-k">{STUTI_L.t("startingNext", lang)}</div>
            <div className="nextup-title display" style={{ fontFamily: STUTI_L.font(lang) }}>{STUTI_L.hymnTitle(nextUp, lang)}</div>
            <div className="nextup-count" key={nqCount}>{Math.max(1, nqCount)}</div>
            <div className="nextup-actions">
              <button className="nextup-btn" onClick={() => setNqPaused(p => !p)} aria-label={STUTI_L.a(nqPaused ? "aPlay" : "aPause")}><Icon name={nqPaused ? "play" : "pause"} size={24} /></button>
              <button className="nextup-btn nextup-x" onClick={() => { setNextUp(null); nityaQueue.set(null); }} aria-label={STUTI_L.a("aClose")}>×</button>
            </div>
          </div>
        </div>
      )}
      {limAsk && <LimitSheet lang={lang} onClose={() => setLimAsk(false)} />}
      {namesOpen && <OverlayPortal><NamesSheet hymn={hymn} lang={lang} onClose={() => setNamesOpen(false)} /></OverlayPortal>}
      {storyOpen && hymn.about && (
        <OverlayPortal>
          <StorySheet hymn={hymn} lang={lang} onClose={() => setStoryOpen(false)}
            onNext={parts ? () => { setStoryOpen(false); goVerse(parts[0].at); } : null} />
        </OverlayPortal>
      )}
      {panelOpen && !panelPin && (
        <OverlayPortal>
          <div className="rd-toppanel-scrim" onClick={() => setPanelOpen(false)}>
            <div className="rd-toppanel is-drop" role="dialog" aria-label={STUTI_L.t("settings", lang)} onClick={e => e.stopPropagation()}>{panelBody}</div>
          </div>
        </OverlayPortal>
      )}
      {shareOpen && (
        <OverlayPortal>
          <ShareSheet hymn={hymn} verse={hymn.verses[curVerse]} num={hymn.verses[curVerse] && hymn.verses[curVerse].n}
            lang={lang} theme={theme} onClose={() => setShareOpen(false)} />
        </OverlayPortal>
      )}

      {/* the reciter bar — under both views: the flow column recites too */}
      <div className="reciter">
        <div className={"reciter-progress" + (lineScrub.drag ? " scrubbing" : "")} ref={lineScrub.ref} {...lineScrub.handlers}
          role="slider" aria-label={STUTI_L.a("aPosition")} aria-valuemin={1} aria-valuemax={lines.length} aria-valuenow={Math.max(1, active + 1)}
          onKeyDown={e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }} tabIndex={0}>
          <span style={{ width: `${progress * 100}%` }} />
          <i className="scrub-knob" style={{ left: `${progress * 100}%` }} />
        </div>
        <div className="reciter-row">
          <button className={"reciter-aux" + (loopMode !== "off" ? " on" : "")} onClick={cycleLoop} aria-label={STUTI_L.a("aLoop")}>
            <Icon name="repeat" size={22} />
            <span>{loopMode === "all" ? STUTI_L.t("loopAll", lang) : loopMode === "verse" ? STUTI_L.t("loopVerse", lang) : STUTI_L.t("loop", lang)}</span>
          </button>

          <div className="reciter-center">
            <button className={"reciter-step" + (scrollOn ? " is-verse" : "")} onClick={() => step(-1)} aria-label={STUTI_L.a(scrollOn ? "aPrevVerse" : "aPrevLine")}><Icon name="prev" size={24} /></button>
            <button className="reciter-play" onClick={togglePlay} aria-label={STUTI_L.a(playing ? "aPause" : "aPlay")}>
              <span className={"flamehalo" + (playing ? " on" : "")}><Flame size={30} lit={playing} /></span>
              <Icon name={playing ? "pause" : "play"} size={30} />
            </button>
            <button className={"reciter-step" + (scrollOn ? " is-verse" : "")} onClick={() => step(1)} aria-label={STUTI_L.a(scrollOn ? "aNextVerse" : "aNextLine")}><Icon name="next" size={24} /></button>
          </div>

          <div className="reciter-speed" role="group" aria-label={STUTI_L.a("aSpeed")}>
            <button type="button" onClick={() => stepSpeed(-1)} disabled={speed <= SPEEDS[0]} aria-label="−">−</button>
            <span>{speed.toFixed(2).replace(/0$/, "")}×</span>
            <button type="button" onClick={() => stepSpeed(1)} disabled={speed >= SPEEDS[SPEEDS.length - 1]} aria-label="+">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DeityView, ReaderView, WordRun, RecMasked, hymnParts };

import React from "react";
import { HouseDate } from "./stuti-datepick";
import { GotraField } from "./stuti-flyleaf";
import { STUTI_L } from "./stuti-i18n";
import { Icon, Seal } from "./stuti-icons";
import { useLoc } from "./stuti-panchanga";
import { OverlayPortal } from "./stuti-picker";
import { STUTI_PITRU } from "./stuti-pitru-register-core";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — the pitṛ register, as a surface
   Opened from the tarpaṇa vidhi at the place where a blank stands,
   which is the only moment a reciter has a reason to fill it. Not
   a form to be completed: a page of a family book, where the near
   dead are written first and a line is added when someone asks for
   it.

   The order on screen is the order the rite names them, so a
   reciter reading down the sheet and a reciter reading down this
   page are in the same place.

   Nothing is required. Nothing turns red. A slot with no name is
   the ordinary state of most of these thirty-three.
   ============================================================ */
const { useState: useRgS, useEffect: useRgE, useMemo: useRgM } = React;

const rgPick = (o, lang) => !o ? "" : (lang === "telugu" ? (o.tel || o.roman) : lang === "deva" ? (o.deva || o.roman) : o.roman) || o.roman || "";
const rgFont = (lang) => lang === "telugu" ? "var(--font-telugu)" : lang === "roman" ? "var(--font-display)" : "var(--font-deva)";

const RG_T = {
  cap:     { roman: "The pitṛ register", deva: "पितृ-सूची", tel: "పితృ సూచి" },
  title:   { roman: "The names the rite asks for", deva: "कर्म के लिये आवश्यक नाम", tel: "కర్మకు కావలసిన పేర్లు" },
  lede:    { roman: "Write the names of the family and relatives you offer tarpaṇam to, each with their gotra. A name written here is read in the tarpaṇa line; a slot left empty keeps the line as it is printed.",
             deva: "जिन कुटुम्बियों और सम्बन्धियों को आप तर्पण देते हैं, उनके नाम गोत्र सहित लिखिये। यहाँ लिखा नाम तर्पण की पंक्ति में पढ़ा जायेगा; खाली छोड़ा स्थान पंक्ति को जैसी छपी है वैसी रखता है।",
             tel: "మీరు ఎవరెవరికి తర్పణం ఇస్తారో ఆ కుటుంబ సభ్యుల, బంధువుల పేర్లు గోత్రంతో సహా వ్రాయండి. ఇక్కడ వ్రాసిన పేరు తర్పణ పంక్తిలో చదవబడుతుంది; ఖాళీగా వదిలిన చోట పంక్తి అచ్చులో ఉన్నట్టే ఉంటుంది." },
  onlyDead:{ roman: "Only those who have died are named here.", deva: "यहाँ केवल दिवंगतों के नाम लिखे जाते हैं।", tel: "మరణించినవారి పేర్లే ఇక్కడ వ్రాయాలి." },
  privacy: { roman: "Kept on this device only. The names are never sent anywhere.", deva: "केवल इस उपकरण में रहता है। नाम कहीं नहीं भेजे जाते।", tel: "ఈ ఫోన్‌లో మాత్రమే ఉంటుంది. పేర్లు ఎక్కడికీ పంపబడవు." },
  varna:   { roman: "The ending the name takes", deva: "नाम का अन्त", tel: "పేరు చివర వచ్చే పదం" },
  varnaNote:{ roman: "Śarmāṇaṁ is the brāhmaṇa form. The sheet's own note gives the three that stand in its place.",
             deva: "शर्माणं ब्राह्मण-रूप है। पत्र की टिप्पणी उसके स्थान पर तीन और देती है।",
             tel: "శర్మాణం బ్రాహ్మణ రూపం. దాని స్థానంలో వచ్చే మూడింటిని పత్రపు సూచన చెబుతుంది." },
  seedMatr:{ roman: "Mother's father's gotra", deva: "मातामह का गोत्र", tel: "తల్లి తండ్రి గోత్రం" },
  seedSva: { roman: "Wife's father's gotra", deva: "श्वशुर का गोत्र", tel: "మామగారి గోత్రం" },
  seedNote:{ roman: "Asked once, then offered to the rest of that line.", deva: "एक बार पूछा जाता है, फिर उसी पक्ष के शेष नामों को दिया जाता है।", tel: "ఒకసారే అడుగుతాము; ఆ వైపు మిగిలినవారికి అదే వర్తిస్తుంది." },
  nameL:   { roman: "Name", deva: "नाम", tel: "పేరు" },
  nameRoman:{ roman: "Name in English", deva: "अंग्रेज़ी में नाम", tel: "ఇంగ్లిష్‌లో పేరు" },
  gotraL:  { roman: "Gotra", deva: "गोत्र", tel: "గోత్రం" },
  deathL:  { roman: "Day of death", deva: "मृत्यु का दिन", tel: "మరణించిన రోజు" },
  deathTime:{ roman: "Hour, if it is known", deva: "घड़ी, यदि ज्ञात हो", tel: "గడియ, తెలిసినట్లయితే" },
  deathNote:{ roman: "A śrāddha is named by the tithi running at the hour of death, not at that day's sunrise. Given the hour, the ābdikam is found for every year after.",
             deva: "श्राद्ध मृत्यु के समय चल रही तिथि से नामित होता है, उस दिन के सूर्योदय से नहीं। घड़ी बतायें तो आगे प्रत्येक वर्ष का आब्दिक निकल आता है।",
             tel: "శ్రాద్ధం మరణ సమయంలో నడుస్తున్న తిథితో నిర్ణయింపబడుతుంది, ఆ రోజు సూర్యోదయంతో కాదు. గడియ ఆధారంగా తీసుకుని ప్రతి సంవత్సరపు ఆబ్దికం లెక్కించబడుతుంది." },
  clauseL: { roman: "In the line it reads", deva: "पंक्ति में यह पढ़ा जायेगा", tel: "పంక్తిలో ఇది చదవబడుతుంది" },
  correct: { roman: "Correct this wording", deva: "इस रूप को सुधारें", tel: "ఈ రూపాన్ని సరిదిద్దండి" },
  correctNote:{ roman: "Write the line as you want it read in your tarpaṇa vidhi.",
             deva: "जैसा आप अपने तर्पण विधि में पढ़ना चाहते हैं, वैसा लिखें।",
             tel: "మీ తర్పణ విధిలో ఎలా చదవాలనుకుంటున్నారో అలా వ్రాయండి." },
  add:     { roman: "Write a name", deva: "नाम लिखें", tel: "పేరు వ్రాయండి" },
  addMore: { roman: "Write another", deva: "और एक", tel: "మరొక పేరు వ్రాయండి" },
  save:    { roman: "Keep", deva: "रखें", tel: "ఉంచండి" },
  removeE: { roman: "Remove this name", deva: "यह नाम हटायें", tel: "ఈ పేరును తీసివేయండి" },
  blank:   { roman: "Blank", deva: "रिक्त", tel: "ఖాళీ" },
  /* one sentence per language, not three fragments joined — "1 व्रासिनवि ·
     मुप्पै मूडुलो" is not Telugu, it is English word order in Telugu letters */
  countLine: { roman: "__ of thirty-three written", deva: "तैंतीस में से __ लिखे गये हैं", tel: "ముప్పై మూడులో __ పేర్లు వ్రాశారు" },
  countOne: { roman: "1 of thirty-three written", deva: "तैंतीस में से एक लिखा गया है", tel: "ముప్పై మూడులో ఒక పేరు వ్రాశారు" },
  noneYet: { roman: "Nothing written yet", deva: "अभी कुल नहीं लिखा गया", tel: "ఇంకా ఏమీ వ్రాయలేదు" },
  openReg: { roman: "Your register", deva: "आपकी सूची", tel: "మీ సూచి" },
  /* the door said only "your register", which told nobody what to put in it */
  doorAsk: { roman: "Write the names of the family and relatives you offer tarpaṇam to.",
             deva: "जिन कुटुम्बियों और सम्बन्धियों को आप तर्पण देते हैं, उनके नाम लिखिये।",
             tel: "మీరు ఎవరెవరికి తర్పణం ఇస్తారో ఆ కుటుంబ సభ్యుల, బంధువుల పేర్లు వ్రాయండి." },
  openAll: { roman: "All thirty-three names", deva: "तैंतीस नाम", tel: "ముప్పై మూడు పేర్లు" },
  fromReg: { roman: "From your register", deva: "आपकी सूची से", tel: "మీ సూచి నుండి" },
  stillBlank:{ roman: "This line is still blank", deva: "यह पंक्ति अभी रिक्त है", tel: "ఈ పంక్తి ఇంకా ఖాళీగా ఉంది" },
  needScript:{ roman: "This name is not in this script yet. Write it below and the line will read it.",
             deva: "यह नाम इस लिपि में नहीं है। नीचे लिखें और पंक्ति उसे पढ़ेगी।",
             tel: "ఈ పేరు ఈ లిపిలో లేదు. కింద వ్రాస్తే పంక్తి దానిని చదువుతుంది." },
  writeHere:{ roman: "The line, as you say it", deva: "पंक्ति, जैसे आप बोलते हैं", tel: "మీరు పలికే పంక్తి" },
};
const rgT = (k, lang) => rgPick(RG_T[k], lang);
/* "n of thirty-three written", as a whole sentence in each language */
const rgCount = (n, lang) => !n ? rgT("noneYet", lang)
  : n === 1 ? rgT("countOne", lang)
  : rgT("countLine", lang).replace("__", String(n));

function useRegister() {
  const [, tick] = useRgS(0);
  useRgE(() => STUTI_PITRU.subscribe(() => tick((n) => n + 1)), []);
  return STUTI_PITRU;
}

/* ---- one name ---- */
function RgEntry({ entry, slot, lang, onDone }) {
  const P = STUTI_PITRU, L = STUTI_L;
  const { loc } = useLoc ? useLoc() : { loc: null };
  /* A tapped slot used to write an empty row to the store at once, so a
     reciter who opened a name and thought better of it left a blank in the
     register and a name in the count. The draft lives here until it is kept. */
  const [e, setE] = useRgS(() => entry
    ? Object.assign({}, entry)
    : { id: null, slot: slot.id, nd: "", nr: "", gotra: P.gotraDefault(slot.id), declD: "", declR: "", note: "", death: null, tithiId: null });
  const [corr, setCorr] = useRgS(!!(entry && (entry.declD || entry.declR)));
  const set = (k) => (v) => setE((x) => Object.assign({}, x, { [k]: v }));
  const scriptField = lang !== "roman";
  /* The two name fields are one name in two hands, not two names. The Roman
     spelling is what a reciter types; the script form is spelt from it, so
     editing one moves the other. A script form the house wrote itself is
     never overwritten — Latin letters sitting in the script field are not a
     script form, so those do follow the Roman. */
  const rgIndic = (s) => /[\u0900-\u097F\u0C00-\u0C7F]/.test(s || "");
  const spellOut = (r) => {
    const TR = STUTI_TRANSLIT; if (!TR || !r) return "";
    const d = TR.romanToDeva(r.trim());
    return lang === "telugu" ? TR.convert(d, "telugu") : d;
  };
  /* One box. A name typed in English letters is spelt into the script the
     line reads; a name typed in Telugu or Hindi stands as it was written. */
  const typed0 = (entry && (rgIndic(entry.nd) ? entry.nd : entry.nr)) || "";
  const [typed, setTyped] = useRgS(typed0);
  const toScreen = (v) => {
    const TR = STUTI_TRANSLIT; if (!TR || !rgIndic(v)) return v;
    const d = TR.toDeva(v);
    return lang === "telugu" ? TR.convert(d, "telugu") : d;
  };
  const onNameDone = () => { const v = toScreen(typed); if (v !== typed) { setTyped(v); setE((s) => Object.assign({}, s, { nd: v })); } };
  const onName = (v) => {
    setTyped(v);
    if (rgIndic(v)) setE((s) => Object.assign({}, s, { nd: v, nr: "" }));
    else setE((s) => Object.assign({}, s, { nr: v, nd: spellOut(v) }));
  };
  /* the clause is computed from the draft, not from the store — a preview that
     writes as you type would leave a half-typed name in the rite */
  const preview = useRgM(() => { try { return P.clause(e); } catch (err) { return null; } },
    [e.nd, e.nr, e.gotra, e.declD, e.declR]);
  const commit = () => {
    const named = (e.nd || "").trim() || (e.nr || "").trim();
    if (!named) { if (e.id) P.remove(e.id); onDone(); return; }
    const id = e.id ? (P.patch(e.id, e), e.id) : P.add(e.slot, e).id;
    if (e.death && e.death.y) { try { P.linkTithi(id, loc); } catch (err) {} }
    onDone();
  };
  const dateVal = e.death && e.death.y != null ? `${e.death.y}-${String(e.death.m + 1).padStart(2, "0")}-${String(e.death.d).padStart(2, "0")}` : "";
  const timeVal = e.death && e.death.tm != null ? `${String(Math.floor(e.death.tm / 60)).padStart(2, "0")}:${String(e.death.tm % 60).padStart(2, "0")}` : "";
  return (
    <div className="rg-edit">
      <div className="rg-edit-rel" style={{ fontFamily: rgFont(lang) }}>{rgPick(slot.rel, lang)}</div>
      <div className="sk-field">
        <label className="sk-label">{rgT("nameL", lang)}</label>
        <input className="sk-input" value={typed} spellCheck="false" autoComplete="off"
          style={{ fontFamily: rgIndic(typed) ? rgFont(lang) : "var(--font-ui)" }}
          onBlur={onNameDone} onChange={(ev) => onName(ev.target.value)} />
      </div>
      <div className="sk-field">
        <label className="sk-label">{rgT("gotraL", lang)}</label>
        <GotraField value={e.gotra || ""} onChange={set("gotra")} lang={lang} />
      </div>
      <div className="sk-field">
        <label className="sk-label">{rgT("deathL", lang)}</label>
        <div className="rg-when">
          <HouseDate value={dateVal} lang={lang} ariaLabel={rgT("deathL", lang)}
            onChange={(v) => {
              if (!v) return set("death")(null);
              const p = v.split("-");
              setE((x) => Object.assign({}, x, { death: Object.assign({ tm: null }, x.death, { y: +p[0], m: +p[1] - 1, d: +p[2] }) }));
            }} />
          <input className="sk-input" type="time" value={timeVal} aria-label={rgT("deathTime", lang)}
            onChange={(ev) => {
              const v = ev.target.value;
              const p = v ? v.split(":") : null;
              setE((x) => Object.assign({}, x, { death: Object.assign({ y: null, m: 0, d: 1 }, x.death, { tm: p ? (+p[0] * 60 + +p[1]) : null }) }));
            }} />
        </div>
      </div>
      {(() => {
        if (!preview) return null;
        const shown = lang === "roman" ? preview.iast : preview.deva;
        /* an empty panel captioned "in the line it reads" is worse than no
           panel. Where this script has no form, say so and open the field. */
        if (!shown) return null;
        return (
          <div className="rg-preview">
            <div className="eyebrow">{rgT("clauseL", lang)}</div>
            <div className="rg-preview-line" style={{ fontFamily: rgFont(lang) }}>
              {lang === "telugu" ? STUTI_TRANSLIT.convert(preview.deva, "telugu") : shown}
            </div>
            {!corr && <button className="rg-link" onClick={() => setCorr(true)}>{rgT("correct", lang)}</button>}
          </div>
        );
      })()}
      {corr && (
        <div className="sk-field">
          <label className="sk-label">{rgT("correct", lang)}</label>
          {/* one box, for the line on this screen — the other script's form
              is left as it was generated */}
          {scriptField ? (
            <input className="sk-input" value={e.declD || ""} style={{ fontFamily: rgFont(lang) }}
              placeholder={(preview && (lang === "telugu" ? STUTI_TRANSLIT.convert(preview.deva, "telugu") : preview.deva)) || ""} onChange={(ev) => set("declD")(ev.target.value)} />
          ) : (
            <input className="sk-input" value={e.declR || ""}
              placeholder={(preview && preview.iast) || ""} onChange={(ev) => set("declR")(ev.target.value)} />
          )}
          <p className="rg-note">{rgT("correctNote", lang)}</p>
        </div>
      )}
      <div className="rg-edit-acts">
        <button className="rg-btn is-keep" onClick={commit}>{rgT("save", lang)}</button>
        {e.id && <button className="rg-btn is-drop" onClick={() => { P.remove(e.id); onDone(); }}>{rgT("removeE", lang)}</button>}
      </div>
    </div>
  );
}

/* ---- one name, over whatever the reciter was doing ----
   The editor is a sheet and not a page on purpose: it is opened from the
   verse where the blank stands, and the scroll must still be behind it. */
function RgSlotSheet({ slot, lang = "deva", onClose, onOpenAll }) {
  const P = useRegister();
  const L = STUTI_L;
  const s = P.slotById[slot];
  /* the slot's first name, or a fresh row — the sheet is for one name, and
     the whole register is a tap away for anything more */
  const es = P.forSlot(slot);
  const e = es.length ? es[0] : null;   // a fresh slot opens an unwritten draft
  if (!s) return null;
  return (
    <OverlayPortal>
      <div className="pd-wrap">
        <div className="pd-scrim" onClick={onClose} />
        <div className="pd-sheet rg-sheet" role="dialog" aria-label={rgPick(s.rel, lang)}>
          <div className="pd-grip" />
          <button className="pd-x" onClick={onClose} aria-label={L.t("close", lang)}><Icon name="close" size={18} /></button>
          <div className="pd-body scroll">
            <RgEntry entry={e} slot={s} lang={lang} onDone={onClose} />
            {onOpenAll && (
              <button className="rg-allnames" onClick={onOpenAll}>
                {rgT("openAll", lang)}<Icon name="chev" size={14} />
              </button>
            )}
            <div style={{ height: 20 }} />
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

/* ---- the register, as a page ----
   Thirty-three slots in five groups, browsed slowly and returned to over
   years. Every line stands open: a page has the room a sheet did not, and
   the whole point of this screen is to be read down in the order the rite
   names them. */
function PitruRegisterView({ go, lang = "deva", backView }) {
  const P = useRegister();
  const L = STUTI_L;
  const [editing, setEditing] = useRgS(null);
  /* a line folds away once it is read; the count stays on the folded head */
  const [open, setOpen] = useRgS(() => { try { return JSON.parse(localStorage.getItem("stuti.rg.open") || "null"); } catch (e) { return null; } });
  const isOpen = (id) => !open || open[id] !== false;
  const toggle = (id) => setOpen((o) => { const n = Object.assign({}, o || {}, { [id]: !isOpen(id) }); try { localStorage.setItem("stuti.rg.open", JSON.stringify(n)); } catch (e) {} return n; });
  const counts = P.filledSlots();
  const seeds = P.seeds();
  const font = rgFont(lang);
  const entryFor = (e) => {
    const c = P.clause(e);
    const txt = !c ? "" : lang === "telugu" ? STUTI_TRANSLIT.convert(c.deva, "telugu") : lang === "roman" ? c.iast : c.deva;
    return txt || (e.nr || e.nd || "");
  };
  return (
    <div className="view rg-view scroll">
      <div className="topbar">
        <button className="icon-btn" onClick={() => go(backView || "calendar")} aria-label={L.a("aBack")}><Icon name="back" /></button>
        <div className="topbar-title display" style={{ fontFamily: font }}>{rgT("openReg", lang)}</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="rg-head">
        <div className="pit-seal-row">{Seal && <Seal d={{ id: "pitr", hue: 168 }} size={88} />}</div>
              <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{rgT("cap", lang)}</div>
        <h1 className="rg-h1 display" style={{ fontFamily: font }}>{rgT("title", lang)}</h1>
        <div className="rg-count">{rgCount(P.count(), lang)}</div>
        <p className="rg-lede">{rgT("lede", lang)}</p>
      </div>

      <section className="tt-card rg-card">
        <div className="eyebrow">{rgT("varna", lang)}</div>
        <div className="rg-varna-row">
          {P.VARNA.map((v) => (
            <button key={v.id} className={"rg-chip" + (P.varna() === v.id ? " on" : "")}
              style={{ fontFamily: font }} onClick={() => P.setVarna(v.id)}>{rgPick(v.label, lang)}</button>
          ))}
        </div>
        <p className="rg-note">{rgT("varnaNote", lang)}</p>
      </section>

      {P.LINES.map((ln) => {
        const slots = P.SLOTS.filter((s) => s.ln === ln.id);
        const n = slots.reduce((a, s) => a + (counts[s.id] || 0), 0);
        return (
          <section className={"tt-card rg-card rg-lcard" + (isOpen(ln.id) ? "" : " is-folded")} key={ln.id}>
            <button className="rg-lhead" onClick={() => toggle(ln.id)} aria-expanded={isOpen(ln.id)}>
              <h2 className="rg-lname" style={{ fontFamily: font }}>{rgPick(ln.name, lang)}</h2>
              {n > 0 && <span className="rg-lcount">{n}</span>}
              <Icon name="chev" size={16} />
            </button>
            {isOpen(ln.id) && <>
            {ln.gotra === "seed" && (
              <div className="sk-field rg-seed">
                <label className="sk-label">{rgT(ln.id === "matr" ? "seedMatr" : "seedSva", lang)}</label>
                <GotraField value={seeds[ln.id] || ""} onChange={(v) => P.setSeed(ln.id, v)} lang={lang} />
              </div>
            )}
            <div className="rg-grid">
              {slots.map((s) => {
                const es = P.forSlot(s.id);
                return (
                  <div className={"rg-slot" + (es.length ? " has" : "")} key={s.id}>
                    <div className="rg-slot-rel" style={{ fontFamily: font }}>{rgPick(s.rel, lang)}</div>
                    {es.map((e) => (
                      <div className="rg-nrow" key={e.id}>
                        <button className="rg-name" onClick={() => setEditing({ id: e.id })}>
                          <span className="rg-name-txt" style={{ fontFamily: font }}>{entryFor(e)}</span>
                          <Icon name="chev" size={14} />
                        </button>
                        <button className="rg-del" aria-label={rgT("removeE", lang)} onClick={() => P.remove(e.id)}>
                          <Icon name="close" size={15} />
                        </button>
                      </div>
                    ))}
                    {!(s.one && es.length) && (
                      <button className="rg-add" onClick={() => setEditing({ slot: s.id })}>
                        {es.length ? rgT("addMore", lang) : rgT("add", lang)}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            </>}
          </section>
        );
      })}

      <p className="rg-foot">{rgT("onlyDead", lang)} {rgT("privacy", lang)}</p>
      <div style={{ height: 36 }} />

      {editing && (
        <OverlayPortal>
          <div className="pd-wrap">
            <div className="pd-scrim" onClick={() => setEditing(null)} />
            <div className="pd-sheet rg-sheet" role="dialog" aria-label={rgT("add", lang)}>
              <div className="pd-grip" />
              <button className="pd-x" onClick={() => setEditing(null)} aria-label={L.t("close", lang)}><Icon name="close" size={18} /></button>
              <div className="pd-body scroll">
                <RgEntry entry={editing.id ? P.byId(editing.id) : null} slot={P.slotById[editing.slot || (P.byId(editing.id) || {}).slot]} lang={lang} onDone={() => setEditing(null)} />
                <div style={{ height: 20 }} />
              </div>
            </div>
          </div>
        </OverlayPortal>
      )}
    </div>
  );
}

/* the door on the pitṛ calendar, so the register can be found again by
   someone who is not in the middle of the rite */
function PitruRegisterDoor({ lang = "deva", onOpen }) {
  const P = STUTI_PITRU;
  const n = P ? P.count() : 0;
  return (
    <button className="pit-door" onClick={onOpen}>
      <span className="pit-door-body">
        <span className="pit-door-name" style={{ fontFamily: rgFont(lang) }}>{rgT("cap", lang)}</span>
        <span className="pit-door-sub" style={{ fontFamily: rgFont(lang) }}>{rgT("doorAsk", lang)}</span>
        <span className="pit-door-sub pit-door-count">{rgCount(n, lang)}</span>
      </span>
      <Icon name="chev" size={17} />
    </button>
  );
}

export { RgSlotSheet, PitruRegisterView, PitruRegisterDoor, useRegister, rgT, rgCount, rgFont };

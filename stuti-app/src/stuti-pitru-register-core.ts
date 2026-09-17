import { STUTI_FLYLEAF } from "./stuti-flyleaf-core";
import { SK_CONST } from "./stuti-panchanga";
import { STUTI_SK } from "./stuti-sankalpa-data";
import { STUTI_TITHIS } from "./stuti-tithis-core";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — the pitṛ register
   The names the tarpaṇam asks for. A paddhati sheet prints
   "asmat pitaraṁ … gotraṁ … śarmaṇaṁ": two blanks, filled aloud
   from memory every time. This is where a house writes them down
   once, so the scroll can be read as it stands.

   Thirty-three slots, one for each recipient the rite names, in
   the order the text names them. Almost all of them will stay
   empty, and that is the normal state of this register — a family
   fills the near dead first and adds a line when someone asks for
   it. Nothing is required, nothing is prompted for, and no slot is
   ever dropped because it is blank: where there is no name the
   printed blank stands, which is what a reciter is used to.

   Only the departed are named. A living father is not offered
   tarpaṇam, so there is no place here to record one — the janma
   tithi of the living belongs in STUTI_TITHIS, which is a
   different book.

   Where it lives. The same rule the flyleaf keeps, and for a
   stronger reason: this is the most private thing the app will
   ever hold. localStorage, this device, never synced, never in a
   push payload. It can be read out and printed by the family that
   wrote it; it goes nowhere else.

   Gotra. The reciter's own gotra is offered for their own paternal
   line, where it is not an assumption but the definition of the
   line. Everything else is asked — a mother's natal gotra, a
   wife's father's, a teacher's — and asked once, with the line's
   answer offered to the rest of that line.

   Declension. The text needs the accusative, and the ending turns
   on varṇa and on gender. It is generated, shown plainly, and can
   be corrected per entry: a generated form that is wrong about
   someone's father's name is worse than a blank.
   ============================================================ */
export const STUTI_PITRU = (function () {
  const KEY = "stuti-pitru-register";

  /* ---- the lines a recipient belongs to ---- */
  const LINES = [
    { id: "pitr",  gotra: "own",  name: { roman: "Father's line",        deva: "पितृ-पक्ष",      tel: "తండ్రి వైపు" } },
    { id: "matr",  gotra: "seed", name: { roman: "Mother's father's line", deva: "मातामह-पक्ष",  tel: "తల్లి వైపు" } },
    { id: "house", gotra: "own",  name: { roman: "My family",            deva: "मेरा परिवार",     tel: "మా కుటుంబం" } },
    { id: "sva",   gotra: "seed", name: { roman: "Wife's father's line", deva: "श्वशुर-पक्ष",    tel: "భార్య వైపు" } },
    { id: "other", gotra: "ask",  name: { roman: "Teachers and others",  deva: "गुर्वादयः",      tel: "గురువులు, ఇతరులు" } },
  ];

  /* ---- the thirty-three, keyed to the verse that names each ----
     v    the verse number in Pitṛ Tarpaṇa Vidhiḥ
     g    the gender the clause is declined for
     ln   which line the recipient stands in
     gt   where the gotra comes from: own · line · ask */
  const SLOTS = [
    { id: "pitr", one: true,  v: "16", g: "m", ln: "pitr",  gt: "own",  rel: { roman: "Father",                    deva: "पिता",             tel: "తండ్రి" } },
    { id: "pitamaha", one: true,         v: "17", g: "m", ln: "pitr",  gt: "own",  rel: { roman: "Father's father",           deva: "पितामह",           tel: "తాత" } },
    { id: "prapitamaha", one: true,      v: "18", g: "m", ln: "pitr",  gt: "own",  rel: { roman: "Father's grandfather",      deva: "प्रपितामह",         tel: "ముత్తాత" } },
    { id: "matr", one: true,  v: "19", g: "f", ln: "pitr",  gt: "ask",  rel: { roman: "Mother",                    deva: "माता",             tel: "తల్లి" } },
    { id: "pitamahi", one: true,         v: "20", g: "f", ln: "pitr",  gt: "ask",  rel: { roman: "Father's mother",           deva: "पितामही",          tel: "నాయనమ్మ" } },
    { id: "prapitamahi", one: true,      v: "21", g: "f", ln: "pitr",  gt: "ask",  rel: { roman: "Father's grandmother",      deva: "प्रपितामही",        tel: "ముత్తమ్మ" } },
    { id: "sapatnamatr",      v: "22", g: "f", ln: "pitr",  gt: "ask",  rel: { roman: "Step-mother",               deva: "सपत्न-माता",        tel: "సవతి తల్లి" } },
    { id: "matamaha", one: true,         v: "23", g: "m", ln: "matr",  gt: "line", rel: { roman: "Mother's father",           deva: "मातामह",           tel: "తల్లి తండ్రి" } },
    { id: "matuhpitamaha", one: true,    v: "24", g: "m", ln: "matr",  gt: "line", rel: { roman: "Mother's grandfather",      deva: "मातुः पितामह",      tel: "తల్లి తాత" } },
    { id: "matuhprapitamaha", one: true, v: "25", g: "m", ln: "matr",  gt: "line", rel: { roman: "Mother's great-grandfather", deva: "मातुः प्रपितामह",   tel: "తల్లి ముత్తాత" } },
    { id: "matamahi", one: true,         v: "26", g: "f", ln: "matr",  gt: "ask",  rel: { roman: "Mother's mother",           deva: "मातामही",          tel: "అమ్మమ్మ" } },
    { id: "matuhpitamahi", one: true,    v: "27", g: "f", ln: "matr",  gt: "ask",  rel: { roman: "Mother's grandmother",      deva: "मातुः पितामही",     tel: "తల్లికి నానమ్మ" } },
    { id: "matuhprapitamahi", one: true, v: "28", g: "f", ln: "matr",  gt: "ask",  rel: { roman: "Mother's great-grandmother", deva: "मातुः प्रपितामही",  tel: "తల్లికి ముత్తమ్మ" } },
    { id: "atmapatni", one: true,        v: "29", g: "f", ln: "house", gt: "own",  rel: { roman: "Wife",                      deva: "आत्मपत्नी",        tel: "భార్య" } },
    { id: "suta",             v: "30", g: "m", ln: "house", gt: "own",  rel: { roman: "Son",                       deva: "सुत",              tel: "కుమారుడు" } },
    { id: "bhratr",           v: "31", g: "m", ln: "house", gt: "own",  rel: { roman: "Brother",                   deva: "भ्राता",            tel: "సోదరుడు" } },
    { id: "pitrvya",          v: "32", g: "m", ln: "pitr",  gt: "own",  rel: { roman: "Father's brother",          deva: "पितृव्य",           tel: "పెదనాన్న, బాబాయి" } },
    { id: "matula",           v: "33", g: "m", ln: "matr",  gt: "line", rel: { roman: "Mother's brother",          deva: "मातुल",            tel: "మేనమామ" } },
    { id: "duhitr",           v: "34", g: "f", ln: "house", gt: "own",  rel: { roman: "Daughter",                  deva: "दुहिता",            tel: "కుమార్తె" } },
    { id: "bhagini",          v: "35", g: "f", ln: "house", gt: "own",  rel: { roman: "Sister",                    deva: "भगिनी",            tel: "సోదరి" } },
    { id: "dauhitra",         v: "36", g: "m", ln: "house", gt: "ask",  rel: { roman: "Daughter's son",            deva: "दौहित्र",           tel: "కూతురి కొడుకు" } },
    { id: "bhagineyaka",      v: "37", g: "m", ln: "house", gt: "ask",  rel: { roman: "Sister's son",              deva: "भागिनेयक",          tel: "మేనల్లుడు" } },
    { id: "pitrbhagini",      v: "38", g: "f", ln: "pitr",  gt: "ask",  rel: { roman: "Father's sister",           deva: "पितृभगिनी",         tel: "మేనత్త" } },
    { id: "matrbhagini",      v: "39", g: "f", ln: "matr",  gt: "ask", rel: { roman: "Mother's sister",           deva: "मातृभगिनी",         tel: "పిన్ని, పెద్దమ్మ" } },
    { id: "jamatr",           v: "40", g: "m", ln: "house", gt: "ask",  rel: { roman: "Son-in-law",                deva: "जामाता",            tel: "అల్లుడు" } },
    { id: "bhavuka",          v: "41", g: "m", ln: "house", gt: "ask",  rel: { roman: "Sister's husband",          deva: "भावुक",            tel: "బావగారు" } },
    { id: "snusa",            v: "42", g: "f", ln: "house", gt: "own",  rel: { roman: "Daughter-in-law",           deva: "स्नुषा",            tel: "కోడలు" } },
    { id: "svasura", one: true,          v: "43", g: "m", ln: "sva",   gt: "line", rel: { roman: "Wife's father",             deva: "श्वशुर",            tel: "మామగారు" } },
    { id: "svasru", one: true,           v: "44", g: "f", ln: "sva",   gt: "ask",  rel: { roman: "Wife's mother",             deva: "श्वश्रू",           tel: "అత్తగారు" } },
    { id: "syalaka",          v: "45", g: "m", ln: "sva",   gt: "line", rel: { roman: "Wife's brother",            deva: "श्यालक",            tel: "బావమరిది" } },
    { id: "svamin",           v: "46", g: "m", ln: "other", gt: "ask",  rel: { roman: "The one served",            deva: "स्वामी",            tel: "ప్రభువు" } },
    { id: "guru",             v: "47", g: "m", ln: "other", gt: "ask",  rel: { roman: "Guru",                      deva: "गुरु",             tel: "గురువు" } },
    { id: "rktin",            v: "48", g: "m", ln: "other", gt: "ask",  rel: { roman: "The one who gave wealth",   deva: "ऋक्तिन्",           tel: "ధనమిచ్చినవారు" } },
  ];
  const slotById = {};
  SLOTS.forEach((s) => { slotById[s.id] = s; });
  const slotByVerse = {};
  SLOTS.forEach((s) => { slotByVerse[s.v] = s; });

  /* the ending the name takes. Śarman is the brāhmaṇa form; the sheet's own
     note gives the three that stand in its place. One household setting, not
     a field on every entry — a family does not change varṇa between two
     recipients. */
  /* Śarman is an -an stem, so the accusative takes the long vowel: ātmānam,
     brahmāṇam, śarmāṇam. The short śarmaṇam that many sheets print was
     offered beside it for a while and taken out — there is one right form. */
  const VARNA = [
    { id: "brahmana",  deva: "शर्माणं", iast: "śarmāṇaṁ", label: { roman: "śarmāṇaṁ", deva: "शर्माणं", tel: "శర్మాణం" } },
    { id: "kshatriya", deva: "वर्माणं", iast: "varmāṇaṁ", label: { roman: "varmāṇaṁ", deva: "वर्माणं", tel: "వర్మాణం" } },
    { id: "vaishya",   deva: "गुप्तं",  iast: "guptaṁ",   label: { roman: "guptaṁ",   deva: "गुप्तं",  tel: "గుప్తం" } },
    { id: "other",     deva: "दासं",   iast: "dāsaṁ",    label: { roman: "dāsaṁ",    deva: "दासं",   tel: "దాసం" } },
  ];
  const FEM = { deva: "दां", iast: "dāṁ" };

  /* ---- the store ---- */
  const DEF = { v: 1, varna: "brahmana", seeds: { matr: "", sva: "" }, entries: [] };
  let doc;
  const load = () => {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    doc = raw && Array.isArray(raw.entries)
      ? { v: 1, varna: raw.varna || "brahmana", seeds: Object.assign({ matr: "", sva: "" }, raw.seeds), entries: raw.entries }
      : JSON.parse(JSON.stringify(DEF));
    collapse();
  };
  load();
  const subs = new Set();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(doc)); } catch (e) {}
    subs.forEach((fn) => fn());
  };
  /* duplicates written before the single-name rule are cleared on file, not
     only on screen */
  try { localStorage.setItem(KEY, JSON.stringify(doc)); } catch (e) {}
  window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === null) { load(); subs.forEach((fn) => fn()); } });

  /* ---- script helpers ----
     A name is written in whichever script the house writes in. Devanāgarī and
     Telugu are the same text in two hands, so one converts to the other; Roman
     is kept beside them because it cannot be derived from either. Where a
     script is missing the blank stands rather than a guess. */
  const TR = () => STUTI_TRANSLIT;
  const isTel = (s) => /[\u0C00-\u0C7F]/.test(s || "");
  const isDev = (s) => /[\u0900-\u097F]/.test(s || "");
  function devaOf(s) {
    s = (s || "").trim(); if (!s) return "";
    if (isDev(s)) return s;
    if (isTel(s) && TR()) return TR().toDeva(s);
    return "";
  }

  const ownGotra = () => { try { return (STUTI_FLYLEAF.get().gotra || "").trim(); } catch (e) { return ""; } };
  function gotraDefault(slotId) {
    const s = slotById[slotId]; if (!s) return "";
    if (s.gt === "own") return ownGotra();
    if (s.gt === "line") return (doc.seeds[LINES.find((l) => l.id === s.ln).id] || "") || "";
    return "";
  }
  /* ---- matching a typed gotra to the list ----
     A reciter types Bharadwaja, Bhardwaj, Bhāradvāja. The saṅkalpa list's own
     fold only strips diacritics, so the first two miss the list, and a miss
     used to mean the Devanāgarī half of the clause came out empty and the
     Telugu line kept its dashes with nothing saying why. This folds the
     ordinary Roman spellings of the same name onto one key: w and v, the three
     s-es, the aspirates, and doubled vowels. */
  function gFold(x) {
    let s = (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    s = s.replace(/w/g, "v").replace(/sh/g, "s").replace(/[śṣ]/g, "s").replace(/ri/g, "r");
    s = s.replace(/([kgcjtdpb])h/g, "$1").replace(/(.)\1+/g, "$1");
    return s.replace(/[^a-z]/g, "");
  }
  function gotraPair(g) {
    g = (g || "").trim();
    if (!g) return null;
    const list = (STUTI_SK && STUTI_SK.GOTRAS) || (SK_CONST && SK_CONST.GOTRAS) || [];
    let hit = list.find((x) => gFold(x[0]) === gFold(g));
    if (!hit && (isDev(g) || isTel(g))) hit = list.find((x) => x[1] === devaOf(g));
    if (hit) return { iast: hit[0], deva: hit[1] };
    return { iast: isDev(g) || isTel(g) ? "" : g, deva: devaOf(g) };
  }

  /* ---- the clause, declined ----
     "Bhāradvāja gotraṁ Rāma śarmāṇaṁ" — the gotra stands as its own word, and
     so does the ending, set off from the name that takes it. */
  function clause(e) {
    const s = slotById[e.slot]; if (!s) return null;
    const g = gotraPair(e.gotra || gotraDefault(e.slot));
    const end = s.g === "f" ? FEM : (VARNA.find((v) => v.id === doc.varna) || VARNA[0]);
    const nr = (e.nr || "").trim();
    /* a name held only in Roman is spelt into the script — the line must read */
    const nd = devaOf(e.nd || e.name || "") || (nr && TR() && TR().romanToDeva ? TR().romanToDeva(nr) : "");
    const gd = (g && g.deva) || "", gi = (g && g.iast) || "";
    /* a correction stands for the script it was written in, and leaves the
       other script's generated form alone */
    return {
      deva: (e.declD || "").trim() || ((gd && nd) ? `${gd} गोत्रं ${nd} ${end.deva}` : ""),
      iast: (e.declR || "").trim() || ((gi && nr) ? `${gi} gotraṁ ${nr} ${end.iast}` : ""),
    };
  }
  /* what the app will actually put in the line, per script. A script with no
     form is reported as such rather than as a fill: a note saying the words
     came from the register, over a line that still shows dashes, is a lie. */
  function clausesFor(slotId) {
    return doc.entries.filter((e) => e.slot === slotId).map((e) => ({ e, c: clause(e) }))
      .filter((x) => x.c && (x.c.deva || x.c.iast));
  }

  const byId = (id) => doc.entries.find((e) => e.id === id) || null;
  /* a father, a grandfather, a wife: one name and no second row. Whatever
     asks to add a second writes over the first instead, and duplicates
     already on file are collapsed to the one name. */
  function onlyOne(slot) { return !!(slotById[slot] && slotById[slot].one); }
  function collapse() {
    /* an entry saved without an id cannot be opened or removed — give it one */
    doc.entries.forEach((e, n) => { if (!e.id) e.id = "p" + n + Date.now().toString(36); });
    const seen = {};
    doc.entries = doc.entries.filter((e) => {
      if (!onlyOne(e.slot)) return true;
      if (seen[e.slot]) return false;
      seen[e.slot] = true; return true;
    });
  }
  function add(slot, patch) {
    load();
    if (onlyOne(slot)) {
      const had = doc.entries.filter((x) => x.slot === slot);
      if (had.length) {
        doc.entries = doc.entries.filter((x) => x.slot !== slot || x.id === had[0].id);
        Object.assign(had[0], patch, { id: had[0].id, slot: slot }); save(); return had[0];
      }
    }
    /* the id is written LAST: the draft the editor hands over carries its own
       id: null, and letting that through left every entry unaddressable —
       opening a written name then showed an empty sheet */
    const e = Object.assign({ nd: "", nr: "", gotra: gotraDefault(slot), declD: "", declR: "", note: "", death: null, tithiId: null }, patch,
      { id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), slot: slot });
    doc.entries = doc.entries.concat([e]); save(); return e;
  }
  const patch = (id, p) => { load(); const e = byId(id); if (!e) return null; Object.assign(e, p); save(); return e; };
  function remove(id) {
    load();
    const e = byId(id);
    /* the ābdikam this entry created goes with it — a date in the calendar for
       a name no longer in the register is a date nobody can explain */
    if (e && e.tithiId) { try { STUTI_TITHIS.remove(e.tithiId); } catch (err) {} }
    doc.entries = doc.entries.filter((x) => x.id !== id); save();
  }

  /* ---- the ābdikam this name implies ----
     The death date is the one fact here that the calendar can use. A śrāddha
     is named by the tithi running at the MOMENT of death, not at that day's
     sunrise, which STUTI_TITHIS already reads correctly when given a time. So
     the register creates the record rather than asking the house to enter the
     same death twice. */
  function linkTithi(id, loc) {
    const e = byId(id); if (!e || !e.death) return null;
    const T = STUTI_TITHIS; if (!T) return null;
    const d = new Date(e.death.y, e.death.m, e.death.d);
    const rule = T.fromDate(d, loc || null, e.death.tm != null ? e.death.tm : null);
    const s = slotById[e.slot];
    const nm = (e.nr || e.nd || "").trim() || (s ? s.rel.roman : "");
    const rec = { kind: "shraddha", name: nm, masa: rule.masa, ti: rule.ti, from: e.death, time: e.death.tm, place: loc ? loc.id : null, note: s ? s.rel.roman : "" };
    if (e.tithiId && T.byId(e.tithiId)) { T.patch(e.tithiId, rec); return e.tithiId; }
    const made = T.add(rec);
    patch(id, { tithiId: made.id });
    return made.id;
  }

  const count = () => doc.entries.length;
  const filledSlots = () => { const m = {}; doc.entries.forEach((e) => { m[e.slot] = (m[e.slot] || 0) + 1; }); return m; };

  return {
    LINES, SLOTS, VARNA, FEM, slotById, slotByVerse,
    list: () => doc.entries.slice(), byId, add, patch, remove,
    forSlot: (id) => doc.entries.filter((e) => e.slot === id),
    clause, clausesFor, gotraDefault, gotraPair, devaOf, gFold,
    varna: () => doc.varna, setVarna: (v) => { load(); doc.varna = v; save(); },
    seeds: () => Object.assign({}, doc.seeds),
    setSeed: (k, v) => { load(); doc.seeds[k] = v; save(); },
    linkTithi, count, filledSlots,
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

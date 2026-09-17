import { STUTI_DESA } from "./stuti-desa";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { SK_CONST, samvatsaraFor } from "./stuti-panchanga";
import { STUTI_PITRU } from "./stuti-pitru-register-core";
import { masaShown } from "./stuti-reckoning";
import { STUTI_SK } from "./stuti-sankalpa-data";
import { STUTI_SANKALPA } from "./stuti-sankalpa";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — filling the blanks in a vidhi
   A paddhati is printed with blanks: "… saṁvatsare … tithau",
   "… gotraṁ … śarmaṇaṁ". They are blanks because a printed sheet
   cannot know who is holding it. This app does know, and a vidhi
   that still shows dashes is a library book, not a household's own
   copy of the rite.

   So the text is filled on the way to the reader — never in the
   source file, which stays the transcription it was keyed as. Two
   kinds of blank are filled:

     sankalpa   the frame clause, from STUTI_SANKALPA: the place,
                the hour reckoned for today at this place, and the
                reciter's own gotra and nāma.
     recipient  a tarpaṇa line, from the pitṛ register.

   Where the register has no name, the printed blank stands. That
   is deliberate: a rite is not a form with validation, and a
   reciter who has always said the name aloud should find the sheet
   exactly as it is printed.

   Every verse the app touched is marked `fill`, so the reader can
   say quietly where the words came from and open the register.

   Adding a vidhi later — Vināyaka vratam, nitya pūjā — needs only
   a `register()` call naming which of its verses carry a saṅkalpa.
   Nothing else about the text changes.
   ============================================================ */
export const STUTI_FILL = (function () {
  const SPECS = [];
  const register = (spec) => { SPECS.push(spec); return spec; };
  const specFor = (h) => SPECS.find((s) => s.match.test(h.title || "")) || null;

  /* the blank pair a tarpaṇa line carries, in both scripts and both genders */
  const RE = {
    mDeva: /…\s*गोत्रं\s*…\s*(?:शर्मणं|वर्मणं|गुप्तं|दासं)/,
    fDeva: /…\s*गोत्रां\s*…\s*पदां/,
    mIast: /…\s*gotraṁ\s*…\s*(?:śarmaṇaṁ|varmaṇaṁ|guptaṁ|dāsaṁ)/,
    fIast: /…\s*gotrāṁ\s*…\s*padāṁ/,
  };

  function fillRecipient(v, slot, lang) {
    const P = STUTI_PITRU;
    const cls = P.clausesFor(slot.id);
    if (!cls.length) return null;
    const fem = slot.g === "f";
    const reD = fem ? RE.fDeva : RE.mDeva, reI = fem ? RE.fIast : RE.mIast;
    if (!reD.test(v.deva) && !reI.test(v.iast)) return null;
    /* two brothers are two lines of the same verse, not two verses — the
       reciter's saved place in the text must not move because a name was
       added this morning */
    const dOn = cls.filter((x) => x.c.deva).length, iOn = cls.filter((x) => x.c.iast).length;
    const deva = cls.map((x) => x.c.deva ? v.deva.replace(reD, x.c.deva) : v.deva).join("\n");
    const iast = cls.map((x) => x.c.iast ? v.iast.replace(reI, x.c.iast) : v.iast).join("\n");
    /* the note under the verse speaks for the script being read. Where a name
       exists in Roman only, the Devanāgarī and Telugu lines still show the
       printed blank, and must say so. */
    const shown = lang === "roman" ? iOn : dOn;
    return Object.assign({}, v, {
      deva, iast, tdeva: null,
      fill: { kind: shown ? "recipient" : "blank", slot: slot.id, n: shown },
    });
  }

  function fillSankalpa(v, opts) {
    const S = STUTI_SANKALPA; if (!S) return null;
    let segs;
    try { segs = S.segs({ upto: "frame", loc: opts && opts.loc }); } catch (e) { return null; }
    const per = 4, dl = [], il = [];
    for (let i = 0; i < segs.length; i += per) {
      dl.push(segs.slice(i, i + per).map((s) => s.deva).join(" "));
      il.push(segs.slice(i, i + per).map((s) => s.iast).join(" "));
    }
    return Object.assign({}, v, {
      deva: dl.join("\n") + " ॥",
      iast: il.join("\n") + " ||",
      tdeva: null,
      fill: { kind: "sankalpa" },
    });
  }

  /* ---- a saṅkalpa printed with its own blanks ----
     The tarpaṇa sheet prints a short frame, so the whole clause is rebuilt.
     A vratam prints its own long saṅkalpa — the intention, the household,
     the deity named at the end — and only the day and the reciter are left
     open in it. Replacing that with the generic frame would throw away the
     vratam's own words, so here the printed ellipses are filled in place,
     in the order the paddhati prints them. A blank with nothing to put in
     it stays a blank. */
  function fillBlanks(v, opts) {
    const S = STUTI_SANKALPA, PA = AKSHARA_PANCHANGA, TR = STUTI_TRANSLIT;
    const K = (STUTI_SK || SK_CONST || {});
    if (!S || !PA) return null;
    let pa, id, loc, samv;
    try {
      loc = (opts && opts.loc) || S.place();
      pa = PA.forDay(new Date(), loc, { instant: true });
      id = S.identity();
      samv = samvatsaraFor(new Date());
    } catch (e) { return null; }
    const tel = (x) => TR ? TR.convert(x, "telugu") : x;
    const vara = (K.VARA_GRAHA || [])[pa.varaIdx] || { deva: "", iast: "" };
    const masa = masaShown(pa);
    const uttar = /^Uttar/.test((pa.ayana && pa.ayana.iast) || "");
    const L = {
      samv:   { deva: samv[1], iast: samv[0], tel: tel(samv[1]) },
      ayana:  { deva: uttar ? "उत्तर" : "दक्षिण", iast: uttar ? "uttara" : "dakṣiṇa", tel: uttar ? "ఉత్తర" : "దక్షిణ" },
      ritu:   { deva: pa.ritu.deva, iast: pa.ritu.iast, tel: tel(pa.ritu.deva) },
      masa:   { deva: masa.deva, iast: masa.iast, tel: tel(masa.deva) },
      paksha: { deva: pa.pakshaDeva, iast: pa.paksha, tel: pa.pakshaTel || tel(pa.pakshaDeva) },
      tithi:  { deva: pa.tithiDeva, iast: pa.tithiName, tel: pa.tithiTel || tel(pa.tithiDeva) },
      vara:   { deva: vara.deva, iast: vara.iast, tel: tel(vara.deva) },
      nak:    { deva: pa.nak.deva, iast: pa.nak.iast, tel: tel(pa.nak.deva) },
      gotra:  { deva: id.gDeva, iast: id.gIast, tel: tel(id.gDeva) },
      nama:   { deva: id.nmDeva, iast: id.nm, tel: tel(id.nmDeva) },
    };
    /* the order the blanks stand in. Sanskrit prints a blank for the
       asterism and two for the wife; Telugu names the asterism and prints
       the wife's two at the end. Nothing is known of the wife, so those
       stay as printed. */
    const ORDER = {
      sans: ["samv", "ayana", "ritu", "masa", "paksha", "tithi", "vara", "nak", "gotra", "nama", "gotra", "nama", null],
      tel:  ["samv", "ayana", "ritu", "masa", "paksha", "tithi", "vara", "gotra", "nama", null, null],
    };
    /* the deśa the reciter stands in is known, so the printed either-or of
       Bhārata and the lands beyond the seas is settled here */
    const DS = STUTI_DESA, sk = id.sk;
    let desa = null;
    if (DS) {
      try {
        const ds = DS.segs(loc, (deva, iast) => ({ deva, iast }), sk.desa, sk.frame || undefined);
        const j = (k) => ds.map((x) => x[k]).join(" ").replace(/,\s*$/, "");
        desa = { deva: j("deva"), iast: j("iast"), tel: tel(j("deva")) };
      } catch (e) {}
    }
    /* the Telugu line is the meaning, not the recitation, so it keeps its own
       words: the printed either-or is narrowed to the branch that applies
       rather than being replaced with transliterated Sanskrit */
    const inBharata = !desa || /भरत/.test(desa.deva);
    const telDesa = (str) => str.replace(/\(([^()]*)\)/, (m, inner) => {
      const br = inner.split(";");
      const pick = (br[inBharata ? 0 : 1] || br[0]).trim();
      return pick.replace(/^[^—]*—\s*/, "")
        .replace(/దక్షిణ\/ఉత్తర/, (!desa || /दक्षिण/.test(desa.deva)) ? "దక్షిణ" : "ఉత్తర");
    });
    const fill = (str, script) => {
      if (!str) return str;
      let out = script === "tel" ? telDesa(str)
        : desa ? str.replace(/\([^()]*\)/, desa[script]) : str;
      const order = script === "tel" ? ORDER.tel : ORDER.sans;
      const hits = out.match(/\.\.\./g);
      if (!hits || hits.length !== order.length) return null;
      let i = 0;
      out = out.replace(/\.\.\./g, () => {
        const k = order[i++];
        if (!k) return "...";
        const val = L[k][script === "tel" ? "tel" : script];
        return val || "...";
      });
      if (!id.male) {
        const F = script === "tel"
          ? [["గోత్రుడైన", "గోత్రపు"], ["నామధేయుడనైన", "నామధేయ అయిన"]]
          : script === "iast"
            ? [["śrīmān", "śrīmatī"], ["gotraḥ", "gotrā"], ["nāmadheyaḥ", "nāmadheyā"], ["gotrasya", "gotrāyāḥ"], ["nāmadheyohaṁ", "nāmadheyāhaṁ"]]
            : [["श्रीमान्", "श्रीमती"], ["गोत्रः", "गोत्रा"], ["नामधेयः", "नामधेया"], ["गोत्रस्य", "गोत्रायाः"], ["नामधेयोहं", "नामधेयाहं"]];
        F.forEach(([a, b]) => { out = out.split(a).join(b); });
      }
      return out;
    };
    const deva = fill(v.deva, "deva"), iast = fill(v.iast, "iast"), t = fill(v.tel, "tel");
    if (!deva && !iast && !t) return null;
    return Object.assign({}, v, {
      deva: deva || v.deva, iast: iast || v.iast, tel: t || v.tel, tdeva: null,
      fill: { kind: "sankalpa" },
    });
  }

  /* a filled copy of the hymn, or the hymn itself when nothing applies.
     The copy keeps the id, the section list and the verse count, so
     everything the reader remembers about this text still holds. */
  function hymn(h, opts) {
    if (!h || !h.verses) return h;
    const spec = specFor(h); if (!spec) return h;
    let touched = 0, blanks = 0;
    const verses = h.verses.map((v) => {
      if (!v || !v.n) return v;
      if (spec.blanks && spec.blanks.indexOf(v.n) !== -1) {
        const f = fillBlanks(v, opts);
        if (f) { touched++; return f; }
        return v;
      }
      if (spec.sankalpa && spec.sankalpa.indexOf(v.n) !== -1) {
        const f = fillSankalpa(v, opts);
        if (f) { touched++; return f; }
        return v;
      }
      if (spec.recipients && STUTI_PITRU) {
        const slot = STUTI_PITRU.slotByVerse[v.n];
        if (slot) {
          const f = fillRecipient(v, slot, (opts && opts.lang) || "deva");
          if (f) { if (f.fill.kind === "recipient") touched++; else blanks++; return f; }
          blanks++;
          return Object.assign({}, v, { fill: { kind: "blank", slot: slot.id } });
        }
      }
      return v;
    });
    if (!touched && !blanks) return h;
    const out = Object.assign(Object.create(Object.getPrototypeOf(h)), h);
    out.verses = verses;
    out.filled = { touched: touched, blanks: blanks };
    return out;
  }

  /* Pitṛ Tarpaṇa Vidhiḥ — verse 7 is the saṅkalpa frame; 16 to 48 are the
     thirty-three recipients, which the register keys by verse number. */
  register({ match: /Tarpa\u1e47a Vidhi/i, sankalpa: ["7"], recipients: true });

  /* Śrī Varasiddhi Vināyaka Vratam — unit 14 is the vratam's own saṅkalpa,
     printed with its blanks. */
  register({ match: /Varasiddhi Vin\u0101yaka Vratam/i, blanks: ["14"] });

  return { register, hymn, specFor, RE };
})();

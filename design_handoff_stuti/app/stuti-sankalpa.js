/* ============================================================
   STUTI — the saṅkalpa, in one place
   The twelve clauses that name the place and the hour, then the
   reciter, were built inside the home card's view-model. Every
   vidhi that opens with a saṅkalpa — tarpaṇam today, Vināyaka
   vratam and nitya pūjā next — needs the same sentence, and a
   second copy of it would drift within a month. So the builder
   lives here, in plain JS, and the card, the flyleaf sheet and the
   reader all read from it.

   Two lengths. `frame` stops at the reciter's own gotra and nāma,
   which is where a vidhi's own text takes over and names the karma
   the day calls for. `full` closes the sentence with the intention
   from the flyleaf, which is what the home card wants.

   Nothing is stored here. The identity comes from the flyleaf and
   the hour from the pañcāṅga, every time it is asked for.
   ============================================================ */
window.STUTI_SANKALPA = (function () {
  const seg = (deva, iast, em) => ({ deva, iast, em: !!em });
  const SK = () => window.STUTI_SK || window.SK_DATA || window.SK_CONST || {};
  /* the place the clause is spoken at, resolved the way the React hook does —
     the chosen location, or the detected one when that is what is chosen */
  function place() {
    const LOC = window.STUTI_LOC, LOCS = window.AKSHARA_PANCHANGA.locations;
    if (!LOC) return LOCS[0];
    const id = LOC.getLocId(), det = LOC.getDetected();
    return (id === "detected" && det) ? det : (LOCS.find((l) => l.id === id) || LOCS[0]);
  }
  const fold = (x) => ((SK().skNorm) ? SK().skNorm(x) : (x || "").toLowerCase().trim());

  /* who is reciting, resolved once — the gotra matched on the register's
     tolerant fold, the name held in whichever script it was typed in */
  function identity(sk) {
    sk = sk || (window.STUTI_FLYLEAF ? window.STUTI_FLYLEAF.get() : { gotra: "", nama: "", gender: "male", karma: "parayana" });
    const S = SK();
      const P = window.STUTI_PITRU;
      const gp = P && P.gotraPair ? P.gotraPair(sk.gotra) : null;
      const gotraObj = gp ? null : (S.GOTRAS || []).find((g) => fold(g[0]) === fold(sk.gotra));
      const gDeva = (gp && gp.deva) || (gotraObj ? gotraObj[1] : "") || ((sk.gotra || "").trim() || "____");
      const gIast = (gp && gp.iast) || (gotraObj ? gotraObj[0] : "") || ((sk.gotra || "").trim() || "____");
      /* a name typed in Telugu or Devanāgarī is one text in two hands; a name
         typed in Roman cannot be turned into either, so the flyleaf keeps it
         twice and each script is read from the field that holds it */
      const nmRaw = (sk.nama || "").trim(), nmAlt = (sk.namaAlt || "").trim();
      const indic = (s) => /[\u0900-\u097F\u0C00-\u0C7F]/.test(s);
      const nmRoman = (!indic(nmRaw) && nmRaw) || (!indic(nmAlt) && nmAlt) || "";
      const TRm = window.STUTI_TRANSLIT;
      /* a name held only in Roman is spelt into the script rather than left
         standing in Roman letters inside a Sanskrit sentence */
      const nmDeva = (P && P.devaOf ? (P.devaOf(nmRaw) || P.devaOf(nmAlt)) : "") || (nmRoman && TRm && TRm.romanToDeva ? TRm.romanToDeva(nmRoman) : "") || nmRaw || "____";
      const nm = nmRoman || nmRaw || "____";
      const male = sk.gender !== "female";
      /* the ending the name takes — śarmaṇaḥ, varmaṇaḥ, guptasya, dāsasya — in
         the genitive, standing where nāmadheyasya stands when none is chosen */
      const VN = { brahmana: { deva: "-शर्मणः", iast: "-śarmaṇaḥ" }, kshatriya: { deva: "-वर्मणः", iast: "-varmaṇaḥ" }, vaishya: { deva: "-गुप्तस्य", iast: "-guptasya" }, other: { deva: "-दासस्य", iast: "-dāsasya" } };
      const vn = VN[sk.varna] || { deva: "-नामधेयस्य", iast: "-nāmadheyasya" };
    return { gDeva, gIast, nmDeva, nm, male, vn, sk };
  }

  function segs(o) {
    o = o || {};
    const PA = window.AKSHARA_PANCHANGA, S = SK();
    const date = o.date || new Date();
    const loc = o.loc || place();
    const pa = o.pa || PA.forDay(date, loc, { instant: true });
    const sk = o.sk || (window.STUTI_FLYLEAF ? window.STUTI_FLYLEAF.get() : { gotra: "", nama: "", gender: "male", karma: "parayana" });
    const upto = o.upto || "full";
    const samv = window.samvatsaraFor ? window.samvatsaraFor(date) : S.samvatsaraFor(date);
    const vara = S.VARA_GRAHA[pa.varaIdx] || S.VARA_GRAHA[0];
    const isUttar = /^Uttar/.test((pa.ayana && pa.ayana.iast) || "");
    /* the gotra list is matched on the register's tolerant fold, not on a
       diacritic strip: a flyleaf holding the ordinary Roman spelling
       "Bharadwaja" used to miss the list, and the miss put a Roman word in
       the middle of a Telugu saṅkalpa */
    const id = identity(sk);
    const gDeva = id.gDeva, gIast = id.gIast, nmDeva = id.nmDeva, nm = id.nm, male = id.male, vn = id.vn;
    const DS = window.STUTI_DESA;
    const desaSegs = DS
      ? DS.segs(loc, seg, sk.desa, sk.frame || undefined)
      : [seg("जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, मेरोः दक्षिण-दिग्भागे,", "jambū-dvīpe, bhārata-varṣe, bharata-khaṇḍe, meroḥ dakṣiṇa-digbhāge,")];
    const saura = o.saura != null ? o.saura : (typeof window.manaSys === "function" && window.manaSys() === "saura");
    const sd = saura && PA.solarDate ? PA.solarDate(date) : null;
    const masa = window.masaShown(pa);
    const out = [
      seg("ॐ श्री", "Oṃ Śrī"),
      seg("मम उपात्त-समस्त-दुरितक्षयद्वारा श्रीपरमेश्वर-प्रीत्यर्थं,", "mama upātta-samasta-durita-kṣaya-dvārā śrī-parameśvara-prītyarthaṃ,"),
      seg("शुभे शोभने मुहूर्ते,", "śubhe śobhane muhūrte,"),
      seg("आद्य-ब्रह्मणः द्वितीय-परार्धे, श्वेत-वराह-कल्पे, वैवस्वत-मन्वन्तरे, कलियुगे, प्रथम-पादे,", "ādya-brahmaṇaḥ dvitīya-parārdhe, śveta-varāha-kalpe, vaivasvata-manvantare, kaliyuge, prathama-pāde,"),
      ...desaSegs,
      saura
        ? seg("अस्मिन् वर्तमान-व्यावहारिक सौरमानेन,", "asmin vartamāna-vyāvahārika sauramānena,")
        : seg("अस्मिन् वर्तमान-व्यावहारिक चान्द्रमानेन,", "asmin vartamāna-vyāvahārika cāndramānena,"),
      seg(`${samv[1]} नाम संवत्सरे,`, `${samv[0]} nāma saṃvatsare,`, true),
      seg(isUttar ? "उत्तरायणे," : "दक्षिणायने,", isUttar ? "Uttarāyaṇe," : "Dakṣiṇāyane,", true),
      seg(`${pa.ritu.deva} ऋतौ,`, `${pa.ritu.iast} ṛtau,`, true),
      saura && sd
        ? seg(`${sd.masa.deva} मासे, ${PA.toDeva(sd.day)} दिने,`, `${sd.masa.iast} māse, ${sd.day} dine,`, true)
        : seg(`${masa.deva} मासे,`, `${masa.iast} māse,`, true),
      seg(`${pa.pakshaDeva} पक्षे,`, `${pa.paksha} pakṣe,`, true),
      seg(`${pa.tithiDeva} तिथौ,`, `${pa.tithiName} tithau,`, true),
      seg(`${vara.deva} वासरे,`, `${vara.iast} vāsare,`, true),
      seg(`${pa.nak.deva} नक्षत्र-युक्तायां,`, `${pa.nak.iast} nakṣatra-yuktāyāṃ,`, true),
      seg("शुभयोग-शुभकरण-एवंगुण-विशेषण-विशिष्टायां अस्यां शुभतिथौ,", "śubha-yoga-śubha-karaṇa-evaṃguṇa-viśeṣaṇa-viśiṣṭāyām asyāṃ śubha-tithau,"),
      seg(
        male ? `${gDeva}-गोत्रस्य ${nmDeva}${vn.deva} अहम्` : `${gDeva}-गोत्रायाः ${nmDeva}-नामधेयायाः अहम्`,
        male ? `${gIast}-gotrasya ${nm}${vn.iast} aham` : `${gIast}-gotrāyāḥ ${nm}-nāmadheyāyāḥ aham`,
        true
      ),
    ];
    if (upto === "frame") return out;
    const karmaObj = (S.KARMAS || []).find((k) => k.id === sk.karma) || (S.KARMAS || [])[0];
    const deity = o.deity;
    out.push(deity
      ? seg(`श्री ${deity.deva}-प्रीत्यर्थं ${karmaObj.deva} करिष्ये॥`, `śrī ${deity.name}-prītyarthaṃ ${karmaObj.iast} kariṣye.`)
      : seg(`इष्टकाम्यार्थसिद्ध्यर्थं ${karmaObj.deva} करिष्ये॥`, `iṣṭa-kāmyārtha-siddhyarthaṃ ${karmaObj.iast} kariṣye.`));
    return out;
  }

  /* the same sentence as text, in the script asked for. `lines` breaks it
     where a printed paddhati breaks it, so a vidhi's verse keeps its shape
     instead of running as one long line. */
  function text(o, lang) {
    const TR = window.STUTI_TRANSLIT;
    const ss = segs(o);
    const pick = (s) => lang === "telugu" ? TR.convert(s.deva, "telugu") : lang === "roman" ? s.iast : s.deva;
    if (!o || !o.lines) return ss.map(pick).join(" ");
    /* four clauses to a line reads as a paddhati page does */
    const per = o.lines === true ? 4 : o.lines;
    const ls = [];
    for (let i = 0; i < ss.length; i += per) ls.push(ss.slice(i, i + per).map(pick).join(" "));
    return ls.join("\n");
  }

  return { segs, text, seg, place, identity };
})();

/* ============================================================
   AKSHARA — Sanskrit script transliteration
   Devanagari → any sibling Brahmic script, codepoint-level.

   Every Brahmic abugida fully encodes Sanskrit phonology, and
   their Unicode blocks run PARALLEL — each sits a fixed offset
   from Devanagari (U+0900):

       Devanagari  U+0900   offset 0
       Bengali     U+0980   +0x080
       Gurmukhi    U+0A00   +0x100
       Gujarati    U+0A80   +0x180
       Telugu      U+0C00   +0x300
       Kannada     U+0C80   +0x380

   Conjuncts compose from the virāma in ALL of them, so a
   character-by-character shift reproduces saṃyuktākṣaras
   correctly — no per-script cluster logic needed.

   This is TRANSLITERATION, not translation: the same Sanskrit
   words and sounds, written in a different script. Meaning is
   carried separately by the English line, which never changes.

   ► To add a script later, add ONE row to SCRIPTS below (code,
     label, native name, Unicode offset, font class). The reader,
     the script menu and every <Sa> element pick it up for free.
   ============================================================ */
window.AKSHARA_SCRIPT = (function () {

  // The single source of truth. Order = display order in the menu.
  const SCRIPTS = [
    { code: "sa", label: "Devanagari", native: "देवनागरी",  offset: 0,      font: "deva", om: "ॐ"  },
    { code: "te", label: "Telugu",     native: "తెలుగు",    offset: 0x300,  font: "tel",  om: "ఓం" },
    { code: "kn", label: "Kannada",    native: "ಕನ್ನಡ",     offset: 0x380,  font: "kan",  om: "ಓಂ" },
    { code: "bn", label: "Bengali",    native: "বাংলা",     offset: 0x080,  font: "ben",  om: "ওঁ" },
    { code: "gu", label: "Gujarati",   native: "ગુજરાતી",   offset: 0x180,  font: "guj",  om: "ૐ"  },
  ];
  const BY_CODE = Object.fromEntries(SCRIPTS.map(s => [s.code, s]));

  // Shift a Devanagari Sanskrit string into the target block.
  // Only the shared Brahmic repertoire (vowels, consonants, mātrās,
  // anusvāra/visarga/candrabindu, virāma, daṇḍa, digits) is mapped;
  // anything else is passed through untouched.
  function shift(text, s) {
    if (!s || !s.offset) return text;
    let out = "";
    for (const ch of text) {
      const c = ch.codePointAt(0);
      if (c === 0x0950) { out += s.om; continue; }            // ॐ → script's praṇava
      if (c === 0x093C) { continue; }                         // nukta → drop (no counterpart)
      if (c === 0x0964 || c === 0x0965) { out += ch; continue; } // daṇḍa । ॥ kept
      if (c >= 0x0901 && c <= 0x0963) {                       // signs, vowels, consonants, mātrās
        out += String.fromCodePoint(c + s.offset);
        continue;
      }
      if (c >= 0x0966 && c <= 0x096F) {                       // digits ०–९
        out += String.fromCodePoint(c + s.offset);
        continue;
      }
      out += ch;                                              // spaces, punctuation, latin, IAST
    }
    return out;
  }

  // Public: transliterate `text` (assumed Devanagari) into `lang`'s script.
  // Unknown / "sa" → unchanged Devanagari.
  function to(text, lang) {
    if (text == null) return text;
    const s = BY_CODE[lang];
    if (!s || s.code === "sa") return text;
    return shift(String(text), s);
  }

  // Font class to pair with the script in use.
  function fontClass(lang) { return (BY_CODE[lang] || BY_CODE.sa).font; }

  // Back-compat helper used elsewhere.
  function devaToTelugu(text) { return to(text, "te"); }

  return { to, fontClass, devaToTelugu, scripts: SCRIPTS, byCode: BY_CODE };
})();

// Convenience global for UI that builds the script menu.
window.AKSHARA_SCRIPTS = window.AKSHARA_SCRIPT.scripts;

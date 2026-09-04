/* ============================================================
   STUTI — script transliteration
   Devanāgarī is the single source of truth for every verse.
   Other reading scripts are derived from it at render time, so
   adding a language later is just another mapping table here —
   no re-keying of the corpus.  (Telugu today; Kannada, Tamil,
   Grantha, Malayalam … all share this abugida structure.)
   ============================================================ */
export const STUTI_TRANSLIT = (function () {

  /* Devanāgarī char → Telugu char. Anything absent (spaces,
     daṇḍa ।॥, latin, IAST) passes through untouched. */
  const TELUGU = {
    // independent vowels
    "अ": "అ", "आ": "ఆ", "इ": "ఇ", "ई": "ఈ", "उ": "ఉ", "ऊ": "ఊ",
    "ऋ": "ఋ", "ॠ": "ౠ", "ऌ": "ఌ", "ॡ": "ౡ",
    "ए": "ఏ", "ऐ": "ఐ", "ओ": "ఓ", "औ": "ఔ", "ऎ": "ఎ", "ऒ": "ఒ",
    "ऍ": "ఎ", "ऑ": "ఒ",
    // vowel signs (mātrās)
    "ा": "ా", "ि": "ి", "ी": "ీ", "ु": "ు", "ू": "ూ",
    "ृ": "ృ", "ॄ": "ౄ", "ॢ": "ౢ", "ॣ": "ౣ",
    "े": "ే", "ै": "ై", "ो": "ో", "ौ": "ౌ", "ॆ": "ె", "ॊ": "ొ",
    // signs
    "ं": "ం", "ः": "ః", "ँ": "ఁ", "ऽ": "ఽ", "्": "్",
    // consonants
    "क": "క", "ख": "ఖ", "ग": "గ", "घ": "ఘ", "ङ": "ఙ",
    "च": "చ", "छ": "ఛ", "ज": "జ", "झ": "ఝ", "ञ": "ఞ",
    "ट": "ట", "ठ": "ఠ", "ड": "డ", "ढ": "ఢ", "ण": "ణ",
    "त": "త", "थ": "థ", "द": "ద", "ध": "ధ", "न": "న", "ऩ": "న",
    "प": "ప", "फ": "ఫ", "ब": "బ", "भ": "భ", "म": "మ",
    "य": "య", "र": "ర", "ऱ": "ఱ", "ल": "ల", "ळ": "ళ", "ऴ": "ళ",
    "व": "వ", "श": "శ", "ष": "ష", "स": "స", "ह": "హ",
    // praṇava + digits
    "ॐ": "ఓం",
    "०": "౦", "१": "౧", "२": "౨", "३": "౩", "४": "౪",
    "५": "౫", "६": "౬", "७": "౭", "८": "౮", "९": "౯",
  };

  const MAPS = { telugu: TELUGU };

  function convert(text, script) {
    const m = MAPS[script];
    if (!m || !text) return text;
    let out = "";
    for (const ch of text) out += (m[ch] !== undefined ? m[ch] : ch);
    return out;
  }

  /* ---------- The one spelling-tolerant fold ----------
     Casual romanisation is wildly inconsistent — krishna/kṛṣṇa,
     shiva/śiva, sringeri/shringeri/Śṛṅgeri, lakshmi/lakṣmī. Everything
     that matches text the reciter typed (hymn search, city search)
     folds through this single function, so the two can never drift. */
  const strip = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const fold = (s) => strip(s)
    .replace(/ksh/g, "ks").replace(/sh/g, "s").replace(/ch/g, "c").replace(/th/g, "t")
    .replace(/ph/g, "p").replace(/kh/g, "k").replace(/gh/g, "g").replace(/jh/g, "j")
    .replace(/bh/g, "b").replace(/dh/g, "d").replace(/w/g, "v").replace(/z/g, "j")
    .replace(/r[iu]/g, "r").replace(/([a-z])\1+/g, "$1");

  /* Telugu → Devanāgarī, for matching what the reciter typed against the mūla.
     The first Devanāgarī spelling of each Telugu letter wins; ఓం comes back as
     ओं, which is what a lax match wants anyway. */
  const TO_DEVA = {};
  Object.keys(TELUGU).forEach(k => { const t = TELUGU[k]; if (t.length === 1 && TO_DEVA[t] === undefined) TO_DEVA[t] = k; });
  function toDeva(text) {
    if (!text) return text;
    let out = "";
    for (const ch of text) out += (TO_DEVA[ch] !== undefined ? TO_DEVA[ch] : ch);
    return out;
  }

  return { convert, toDeva, has: s => !!MAPS[s], strip, fold };
})();

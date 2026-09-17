/* ============================================================
   STUTI — script transliteration
   Devanāgarī is the single source of truth for every verse.
   Other reading scripts are derived from it at render time, so
   adding a language later is just another mapping table here —
   no re-keying of the corpus.  (Telugu today; Kannada, Tamil,
   Grantha, Malayalam … all share this abugida structure.)
   ============================================================ */
window.STUTI_TRANSLIT = (function () {

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

  /* Roman → Devanāgarī, for a name the flyleaf holds only in Roman. A lax
     scheme: plain letters read as their common Indian-name values, IAST
     diacritics where typed, a word-final consonant closed with a halant, and
     a few frequent name-parts spelt as they are said rather than as they are
     typed (krishna → कृष्ण, sri → श्री). Vowels typed as "ee"/"oo" are long. */
  const RD_WORDS = [
    /* names an audit caught coming out wrong — š for s before v, the long
       vowels English spelling drops, and the -aiah ending */
    ["ananthapadmanabha","अनंतपद्मनाभ"],["anantapadmanabha","अनंतपद्मनाभ"],["srinivasacharyulu","श्रीनिवासाचार्युलु"],
    ["venkateswarlu","वेंकटेश्वर्लु"],["venkateshwarlu","वेंकटेश्वर्लु"],["parameswara","परमेश्वर"],["parameshwara","परमेश्वर"],
    ["maheswara","महेश्वर"],["maheshwara","महेश्वर"],["viswanatha","विश्वनाथ"],["vishwanatha","विश्वनाथ"],["viswanath","विश्वनाथ"],["vishwanath","विश्वनाथ"],
    ["koteswara","कोटेश्वर"],["koteshwara","कोटेश्वर"],["rameswara","रामेश्वर"],["rameshwara","रामेश्वर"],
    ["eswaramma","ईश्वरम्म"],["eswara","ईश्वर"],["eshwara","ईश्वर"],["eswar","ईश्वर"],["iswara","ईश्वर"],["ishwara","ईश्वर"],
    ["jagannatha","जगन्नाथ"],["jagannath","जगन्नाथ"],["natha","नाथ"],
    ["mallikarjuna","मल्लिकार्जुन"],["arjuna","अर्जुन"],["raghavendra","राघवेंद्र"],["veerabhadra","वीरभद्र"],["bhadra","भद्र"],["veera","वीर"],
    ["annapurna","अन्नपूर्ण"],["purna","पूर्ण"],["poorna","पूर्ण"],["lakshmana","लक्ष्मण"],["bhimasena","भीमसेन"],["bhima","भीम"],
    ["seshagiri","शेषगिरि"],["sesha","शेष"],["gangadhara","गंगाधर"],["ganga","गंगा"],["dharmaraju","धर्मराजु"],["raju","राजु"],
    ["rajyalakshmi","राज्यलक्ष्मी"],["rajya","राज्य"],["nagamani","नागमणि"],["naga","नाग"],["mani","मणि"],
    ["padmavathi","पद्मावति"],["padmavati","पद्मावति"],["padmanabha","पद्मनाभ"],["savitri","सावित्रि"],["savithri","सावित्रि"],
    ["balakrishna","बालकृष्ण"],["bala","बाल"],["sundara","सुंदर"],["pulla","पुल्ल"],["yella","यॆल्ल"],
    ["anantha","अनंत"],["ananta","अनंत"],["acharyulu","आचार्युलु"],["acharya","आचार्य"],["avadhani","अवधानि"],
    ["somayajulu","सोमयाजुलु"],["ghanapathi","घनपाठि"],["ghanapati","घनपाठि"],["dharma","धर्म"],
    /* the -aiah / -ayya ending: ramaiah, veeraiah, subbaramaiah */
    ["aiah","अय्य"],["aiya","अय्य"],["ayyah","अय्य"],["ayya","अय्य"],["iah","य्य"],
    ["krishna","कृष्ण"],["krsna","कृष्ण"],["kṛṣṇa","कृष्ण"],["venkateshwara","वेंकटेश्वर"],["venkateswara","वेंकटेश्वर"],["venkatesh","वेंकटेश"],["venkata","वेंकट"],["venkat","वेंकट"],["srinivasa","श्रीनिवास"],["srinivas","श्रीनिवास"],["shri","श्री"],["sri","श्री"],["śrī","श्री"],["lakshmi","लक्ष्मी"],["laxmi","लक्ष्मी"],["vishnu","विष्णु"],["narayana","नारायण"],["subrahmanya","सुब्रह्मण्य"],["subramanya","सुब्रह्मण्य"],["anjaneya","आञ्जनेय"],["ganesh","गणेश"],["ganapati","गणपति"],["ramesh","रमेश"],["suresh","सुरेश"],["mahesh","महेश"],["rajesh","राजेश"],["dinesh","दिनेश"],["ramana","रमण"],["rama","राम"],["babu","बाबु"],["raghava","राघव"],["raghu","रघु"],["sastry","शास्त्रि"],["sastri","शास्त्रि"],["shastri","शास्त्रि"],["sastrulu","शास्त्रुलु"],["sharma","शर्म"],["sarma","शर्म"],["murthy","मूर्ति"],["murti","मूर्ति"],["rao","रावु"],["reddy","रॆड्डि"],["reddi","रॆड्डि"],["garu","गारु"],["naidu","नायुडु"],["prasad","प्रसाद"],["kumar","कुमार"],["siva","शिव"],["shiva","शिव"],["satya","सत्य"],["surya","सूर्य"],["chandra","चंद्र"],["sekhara","शेखर"],["shekhara","शेखर"],["sekhar","शेखर"],["shekhar","शेखर"],["bhaskar","भास्कर"],["gopal","गोपाल"],["mohan","मोहन"],["ravi","रवि"],["hari","हरि"],["radha","राधा"],["sita","सीता"],["seetha","सीता"],["parvati","पार्वती"],["parvathi","पार्वती"],["saraswati","सरस्वती"],["saraswathi","सरस्वती"],["durga","दुर्गा"],["padma","पद्म"],["devi","देवी"],["rishi","ऋषि"],["esh","ेश"],["eshwar","ेश्वर"],
    /* the words a house actually types into a tithi's name. "th" stands for
       both त and थ on an English keyboard, so thithi came out तिती — these
       are spelt as they are said, not as they are keyed. */
    ["thithi","तिथि"],["tithi","तिथि"],["thidhi","तिथि"],["janma","जन्म"],["jayanthi","जयंति"],["jayanti","जयंति"],["vardhanthi","वर्धंति"],["vardhanti","वर्धंति"],["abdikam","आब्दिकं"],["aabdikam","आब्दिकं"],["shraddha","श्राद्ध"],["sraddha","श्राद्ध"],["tharpanam","तर्पणं"],["tarpanam","तर्पणं"],["masam","मासं"],["paksham","पक्षं"],["punya","पुण्य"],["amavasya","अमावास्य"],["amavasa","अमावास्य"],["pournami","पूर्णिम"],["purnami","पूर्णिम"],["purnima","पूर्णिम"],["poornima","पूर्णिम"],
    /* kin, as a house writes them */
    ["ammamma","अम्मम्म"],["nanamma","नानम्म"],["amma","अम्म"],["nanna","नान्न"],["thatha","तात"],["tata","तात"],["tayi","तायि"],["bava","बाव"],["babai","बाबाय्"],["pinni","पिन्नि"],["mama","माम"],["akka","अक्क"],["anna","अन्न"],["chelli","चॆल्लि"],["chellelu","चॆल्लॆलु"],["thammudu","तम्मुडु"],["tammudu","तम्मुडु"]];
  const RD_C = [["ksh","क्ष"],["chh","छ"],["kh","ख"],["gh","घ"],["ch","च"],["jh","झ"],["th","त"],["dh","ध"],["ph","फ"],["bh","भ"],["sh","श"],["ṭh","ठ"],["ḍh","ढ"],["ṇ","ण"],["ñ","ञ"],["ṅ","ङ"],["ś","श"],["ṣ","ष"],["ṭ","ट"],["ḍ","ड"],["k","क"],["g","ग"],["c","च"],["j","ज"],["t","त"],["d","द"],["n","न"],["p","प"],["b","ब"],["m","म"],["y","य"],["r","र"],["l","ल"],["v","व"],["w","व"],["s","स"],["h","ह"],["x","क्स"],["f","फ"],["z","ज"],["q","क"]];
  const RD_V = [["ai","ऐ","ै"],["au","औ","ौ"],["aa","आ","ा"],["ā","आ","ा"],["ee","ई","ी"],["ii","ई","ी"],["ī","ई","ी"],["oo","ऊ","ू"],["uu","ऊ","ू"],["ū","ऊ","ू"],["ṛ","ऋ","ृ"],["a","अ",""],["i","इ","ि"],["u","उ","ु"],["e","ए","े"],["o","ओ","ो"]];
  /* independent vowel → its mātrā, for a word part joined to a consonant */
  const RD_MATRA = { "अ": "", "आ": "ा", "इ": "ि", "ई": "ी", "उ": "ु", "ऊ": "ू", "ऋ": "ृ", "ए": "े", "ऐ": "ै", "ओ": "ो", "औ": "ौ", "ऎ": "ॆ", "ऒ": "ॊ" };
  /* longest key first, always: the table is matched first-hit, so "purna"
     sitting above "purnami" would quietly swallow it. Sorted once here so
     an entry added anywhere in the list still takes effect. */
  RD_WORDS.sort((a, b) => b[0].length - a[0].length);
  function romanToDeva(text) {
    if (!text || /[\u0900-\u097F\u0C00-\u0C7F]/.test(text)) return text || "";
    return text.split(/(\s+)/).map((w) => {
      if (!w.trim()) return w;
      let s = w.normalize("NFC").toLowerCase(), out = "", i = 0, cons = false;
      if (s === "ram") return "राम";
      while (i < s.length) {
        const rest = s.slice(i);
        const wd = RD_WORDS.find((p) => rest.startsWith(p[0]));
        if (wd) {
          /* a part that begins with a vowel sign ("esh" → ेश) joins the
             consonant before it; one that begins with a letter closes it.
             A part that begins with an independent vowel ("amma" → अम्म)
             standing after a consonant takes that vowel's mātrā instead —
             otherwise sundara + amma came out सुन्दर्अम्म. */
          const sign = /^[\u093e-\u094c]/.test(wd[1]);
          const mat = RD_MATRA[wd[1][0]];
          if (cons && mat !== undefined) { out += mat + wd[1].slice(1); i += wd[0].length; cons = false; continue; }
          if (cons && !sign) out += "्";
          if (!cons && sign) out += (/[\u0915-\u0939]$/.test(out) ? wd[1] : "ए" + wd[1].slice(1)); else out += wd[1];
          i += wd[0].length; cons = false; continue;
        }
        /* n or m before another consonant is the anusvāra: venkata, sampat */
        if (/^[nm](?=[kgcjtdpbsvyrlhśṣṭḍ])/.test(rest) && cons === false && out) { out += "ं"; i++; continue; }
        const v = RD_V.find((p) => rest.startsWith(p[0]));
        if (v) {
          /* a name's last i is long: Murali, Lakshmi */
          const last = i + v[0].length >= s.length;
          out += cons ? (last && v[0] === "i" ? "ी" : v[2]) : v[1];
          i += v[0].length; cons = false; continue;
        }
        const c = RD_C.find((p) => rest.startsWith(p[0]));
        if (c) { if (cons) out += "्"; out += c[1]; i += c[0].length; cons = true; continue; }
        if (cons) { out += "्"; cons = false; }
        out += s[i]; i++;
      }
      /* a name's last m is the anusvāra: Subrahmanyam, Ram */
      if (cons) out = (/म$/.test(out) && out.length > 2) ? out.slice(0, -1) + "ं" : out + "्";
      return out;
    }).join("");
  }

  return { convert, toDeva, romanToDeva, has: s => !!MAPS[s], strip, fold };
})();

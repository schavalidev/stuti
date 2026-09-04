import { STUTI_NAMES } from "./stuti-names";
import { STUTI } from "./stuti-data";

/* ============================================================
   STUTI — padārtha: the word-by-word lexicon and resolver
   ------------------------------------------------------------
   Tap a word in the reader and this file answers three questions:
     1. what does the word mean?               (lexicon + the
        sahasranāma glossaries already in the app)
     2. what is it made of?                    (compound split,
        with vowel sandhi undone at the joints)
     3. where else does it occur in the corpus? (lazy index over
        every verse's IAST line)
   IAST is the pivot: verses carry an aligned IAST line, so the
   tapped word resolves the same way in every reading script,
   and IAST → Devanāgarī → Telugu renders each pada natively.
   ============================================================ */
export const STUTI_PADA = (function () {

  /* ---------- IAST → Devanāgarī (Telugu is derived from that) ---------- */
  const VOW = {
    "a": ["अ", ""], "ā": ["आ", "ा"], "i": ["इ", "ि"], "ī": ["ई", "ी"],
    "u": ["उ", "ु"], "ū": ["ऊ", "ू"], "ṛ": ["ऋ", "ृ"], "ṝ": ["ॠ", "ॄ"],
    "e": ["ए", "े"], "ai": ["ऐ", "ै"], "o": ["ओ", "ो"], "au": ["औ", "ौ"],
  };
  const CON = {
    "kh": "ख", "gh": "घ", "ch": "छ", "jh": "झ", "ṭh": "ठ", "ḍh": "ढ",
    "th": "थ", "dh": "ध", "ph": "फ", "bh": "भ",
    "k": "क", "g": "ग", "ṅ": "ङ", "c": "च", "j": "ज", "ñ": "ञ",
    "ṭ": "ट", "ḍ": "ड", "ṇ": "ण", "t": "त", "d": "द", "n": "न",
    "p": "प", "b": "ब", "m": "म", "y": "य", "r": "र", "l": "ल",
    "ḷ": "ळ", "v": "व", "ś": "श", "ṣ": "ष", "s": "स", "h": "ह",
  };
  const SIGN = { "ṁ": "ं", "ṃ": "ं", "ṅ̇": "ं", "ḥ": "ः", "'": "ऽ", "’": "ऽ" };

  function toDeva(s) {
    if (!s) return "";
    const t = s.normalize("NFC");
    let out = "", i = 0;
    const at = (n) => t.slice(i, i + n);
    while (i < t.length) {
      const c2 = at(2), c1 = at(1);
      const con = CON[c2] !== undefined ? { g: CON[c2], n: 2 } : CON[c1] !== undefined ? { g: CON[c1], n: 1 } : null;
      if (con) {
        out += con.g; i += con.n;
        const v2 = at(2), v1 = at(1);
        const vow = VOW[v2] ? { v: VOW[v2], n: 2 } : VOW[v1] ? { v: VOW[v1], n: 1 } : null;
        if (vow) { out += vow.v[1]; i += vow.n; }
        else out += "्";
        continue;
      }
      const v2 = at(2), v1 = at(1);
      const vow = VOW[v2] ? { v: VOW[v2], n: 2 } : VOW[v1] ? { v: VOW[v1], n: 1 } : null;
      if (vow) { out += vow.v[0]; i += vow.n; continue; }
      if (SIGN[c1] !== undefined) { out += SIGN[c1]; i += 1; continue; }
      out += c1; i += 1;
    }
    return out;
  }

  /* ---------- the lexicon ----------
     [ IAST stem, English gloss, Telugu gloss ]
     Stems, not inflected forms — the resolver undoes case and
     verb endings before it looks anything up.
     A leading "·" marks a particle: glossed on its own, but never
     accepted as a piece of a compound (they would match noise). */
  const RAW = [
    /* invocation, recitation, the words of the frame */
    ["oṁ", "the praṇava — the primal sound", "ప్రణవం, మూలనాదం"],
    ["śrī", "auspicious; holy; splendour", "శుభం; పవిత్రం; శోభ"],
    ["namaḥ", "salutation, obeisance", "నమస్కారం"],
    ["namas", "salutation", "నమస్సు"],
    ["namāmi", "I bow", "నమస్కరిస్తాను"],
    ["vande", "I salute, I praise", "వందిస్తాను"],
    ["bhaje", "I worship, I take refuge in", "భజిస్తాను"],
    ["smarāmi", "I remember", "స్మరిస్తాను"],
    ["stotra", "hymn of praise", "స్తోత్రం"],
    ["stuti", "praise", "స్తుతి"],
    ["stava", "hymn, eulogy", "స్తవం"],
    ["stavana", "praising", "స్తవనం"],
    ["śloka", "verse", "శ్లోకం"],
    ["japa", "muttered repetition", "జపం"],
    ["dhyāna", "meditation", "ధ్యానం"],
    ["mantra", "sacred formula", "మంత్రం"],
    ["kavaca", "armour — a hymn of protection", "కవచం"],
    ["aṣṭaka", "a set of eight verses", "అష్టకం"],
    ["sahasranāma", "the thousand names", "సహస్రనామం"],
    ["nāmāvali", "a string of names", "నామావళి"],
    ["nāma", "name", "నామం, పేరు"],
    ["nāman", "name", "నామం"],
    ["phalaśruti", "the fruits of recitation", "ఫలశ్రుతి"],
    ["saṅkalpa", "resolve, vow taken before worship", "సంకల్పం"],
    ["pūjā", "worship", "పూజ"],
    ["homa", "fire offering", "హోమం"],
    ["yajña", "sacrifice", "యజ్ఞం"],
    ["āhuti", "oblation", "ఆహుతి"],
    ["naivedya", "food offered", "నైవేద్యం"],
    ["ārati", "the waved lamp", "ఆరతి"],
    ["prasāda", "grace; what is given back", "ప్రసాదం"],
    ["śubha", "auspicious, good", "శుభం"],
    ["maṅgala", "auspicious, blessed", "మంగళం"],
    ["śānti", "peace", "శాంతి"],
    ["svāhā", "the oblation-call — thus offered", "స్వాహా"],
    ["jaya", "victory; hail", "జయం"],
    ["·iti", "thus — closes a quotation or a text", "ఇతి, ఇట్లు"],
    ["·atha", "now, then — an opening word", "ఇక, ఇప్పుడు"],
    ["·evam", "thus, in this way", "ఈ విధంగా"],
    ["·tathā", "likewise, and so", "అలాగే"],
    ["·yathā", "as, just as", "ఎట్లనగా"],
    ["·ca", "and", "మరియు"],
    ["·na", "not, no", "కాదు, లేదు"],
    ["·vā", "or", "లేక"],
    ["·hi", "indeed, for", "నిజముగా"],
    ["·tu", "but", "కానీ"],
    ["·api", "also, even", "కూడా"],
    ["·eva", "verily, only", "నిశ్చయముగా"],
    ["·punaḥ", "again", "మరల"],
    ["sadā", "always", "ఎల్లప్పుడూ"],
    ["sarvadā", "at all times", "సర్వదా"],
    ["nitya", "eternal; daily", "నిత్యం"],
    ["·adya", "today", "ఈ రోజు"],
    ["·yaḥ", "he who, whoever", "ఎవడు"],
    ["·saḥ", "he, that one", "అతడు"],
    ["·aham", "I", "నేను"],
    ["·mama", "my, mine", "నా"],
    ["·tvam", "you", "నీవు"],
    ["·tava", "your", "నీ"],
    ["·tat", "that; it", "అది"],
    ["·idam", "this", "ఇది"],
    ["·kim", "what? which?", "ఏమి"],
    ["·kaḥ", "who?", "ఎవరు"],

    /* the one who is praised */
    ["deva", "god, the shining one", "దేవుడు"],
    ["devī", "goddess", "దేవి"],
    ["īśa", "lord, ruler", "ప్రభువు"],
    ["īśvara", "lord, sovereign", "ఈశ్వరుడు"],
    ["īśāna", "ruler", "ఈశానుడు"],
    ["pati", "lord, master; husband", "పతి, ప్రభువు"],
    ["nātha", "lord, protector", "నాథుడు"],
    ["prabhu", "master, mighty one", "ప్రభువు"],
    ["bhagavān", "the blessed lord", "భగవంతుడు"],
    ["bhagavatī", "the blessed goddess", "భగవతి"],
    ["svāmin", "lord, owner", "స్వామి"],
    ["rāja", "king", "రాజు"],
    ["rājan", "king", "రాజు"],
    ["adhipa", "overlord", "అధిపతి"],
    ["nāyaka", "leader", "నాయకుడు"],
    ["guru", "teacher; weighty", "గురువు"],
    ["ācārya", "preceptor", "ఆచార్యుడు"],

    /* names and epithets in constant use */
    ["śiva", "the auspicious one; Śiva", "శివుడు; మంగళకరుడు"],
    ["śaṅkara", "the maker of good — Śiva", "శంకరుడు"],
    ["śambhu", "the benign one — Śiva", "శంభుడు"],
    ["hara", "the remover — Śiva", "హరుడు"],
    ["rudra", "the fierce one", "రుద్రుడు"],
    ["maheśa", "the great lord", "మహేశుడు"],
    ["mṛtyuñjaya", "conqueror of death", "మృత్యుంజయుడు"],
    ["nīlakaṇṭha", "the blue-throated one", "నీలకంఠుడు"],
    ["gaṅgādhara", "bearer of the Gaṅgā", "గంగాధరుడు"],
    ["candraśekhara", "crowned with the moon", "చంద్రశేఖరుడు"],
    ["dakṣiṇāmūrti", "the south-facing teacher", "దక్షిణామూర్తి"],
    ["viṣṇu", "the all-pervading one", "విష్ణువు"],
    ["hari", "the remover of sorrow — Viṣṇu", "హరి"],
    ["nārāyaṇa", "the resort of all beings", "నారాయణుడు"],
    ["vāsudeva", "son of Vasudeva; the indweller", "వాసుదేవుడు"],
    ["kṛṣṇa", "the dark one; Kṛṣṇa", "కృష్ణుడు"],
    ["govinda", "keeper of cows; finder of the earth", "గోవిందుడు"],
    ["mādhava", "lord of spring; Lakṣmī's consort", "మాధవుడు"],
    ["keśava", "the long-haired one", "కేశవుడు"],
    ["acyuta", "the unfallen, unchanging", "అచ్యుతుడు"],
    ["ananta", "the endless one", "అనంతుడు"],
    ["mādhusūdana", "slayer of Madhu", "మధుసూదనుడు"],
    ["rāma", "the delightful one; Rāma", "రాముడు"],
    ["raghu", "the Raghu line", "రఘువు"],
    ["gaṇeśa", "lord of the gaṇas", "గణేశుడు"],
    ["gaṇapati", "lord of the gaṇas", "గణపతి"],
    ["vināyaka", "the foremost remover", "వినాయకుడు"],
    ["vighneśvara", "lord over obstacles", "విఘ్నేశ్వరుడు"],
    ["skanda", "Skanda, the war-god", "స్కందుడు"],
    ["subrahmaṇya", "the wholly auspicious one", "సుబ్రహ్మణ్యుడు"],
    ["kumāra", "youth, prince", "కుమారుడు"],
    ["hanumān", "Hanumān", "హనుమంతుడు"],
    ["mārutī", "son of the wind", "మారుతి"],
    ["sūrya", "the sun", "సూర్యుడు"],
    ["āditya", "son of Aditi — the sun", "ఆదిత్యుడు"],
    ["ravi", "the sun", "రవి"],
    ["bhāskara", "the light-maker — the sun", "భాస్కరుడు"],
    ["savitṛ", "the vivifier — the sun", "సవిత"],
    ["candra", "the moon", "చంద్రుడు"],
    ["soma", "the moon; the soma draught", "సోముడు"],
    ["ambā", "mother", "అమ్మ"],
    ["ambikā", "little mother — the Goddess", "అంబిక"],
    ["umā", "Umā, Śiva's consort", "ఉమ"],
    ["gaurī", "the fair one — Pārvatī", "గౌరి"],
    ["pārvatī", "daughter of the mountain", "పార్వతి"],
    ["lalitā", "the graceful one", "లలిత"],
    ["lakṣmī", "fortune, splendour — Śrī", "లక్ష్మి"],
    ["sarasvatī", "the flowing one — speech, learning", "సరస్వతి"],
    ["durgā", "the hard-to-reach one", "దుర్గ"],
    ["kālī", "the dark one", "కాళి"],
    ["tripurā", "she of the three cities", "త్రిపుర"],
    ["brahmā", "the creator", "బ్రహ్మ"],
    ["brahman", "the absolute; the sacred word", "బ్రహ్మం"],
    ["indra", "lord of the gods", "ఇంద్రుడు"],
    ["agni", "fire; the fire-god", "అగ్ని"],
    ["vāyu", "wind; the wind-god", "వాయువు"],
    ["varuṇa", "lord of the waters", "వరుణుడు"],
    ["yama", "the restrainer — death", "యముడు"],
    ["kubera", "lord of wealth", "కుబేరుడు"],
    ["garuḍa", "the eagle-king, Viṣṇu's mount", "గరుడుడు"],
    ["nandin", "the joyful — Śiva's bull", "నంది"],
    ["gaṅgā", "the Gaṅgā", "గంగ"],
    ["kailāsa", "Śiva's mountain", "కైలాసం"],
    ["vaikuṇṭha", "Viṣṇu's abode", "వైకుంఠం"],
    ["ayodhyā", "the unassailable city", "అయోధ్య"],
    ["kāśī", "Kāśī, the city of light", "కాశి"],

    /* the human being */
    ["ātman", "the self, the soul", "ఆత్మ"],
    ["paramātman", "the supreme Self", "పరమాత్మ"],
    ["jīva", "a living being", "జీవుడు"],
    ["manas", "mind", "మనస్సు"],
    ["buddhi", "intellect, discernment", "బుద్ధి"],
    ["citta", "thought, awareness", "చిత్తం"],
    ["hṛdaya", "heart", "హృదయం"],
    ["hṛt", "heart", "హృత్తు"],
    ["prāṇa", "breath, life", "ప్రాణం"],
    ["deha", "body", "దేహం"],
    ["śarīra", "body", "శరీరం"],
    ["indriya", "sense, organ", "ఇంద్రియం"],
    ["netra", "eye", "నేత్రం"],
    ["nayana", "eye", "నయనం"],
    ["locana", "eye", "కన్ను"],
    ["akṣi", "eye", "కన్ను"],
    ["dṛṣṭi", "sight, glance", "దృష్టి"],
    ["mukha", "face; mouth", "ముఖం"],
    ["vaktra", "face, mouth", "వక్త్రం"],
    ["vadana", "face", "వదనం"],
    ["śiras", "head", "శిరస్సు"],
    ["mūrdhan", "head, crown", "మూర్ధం"],
    ["kaṇṭha", "throat, neck", "కంఠం"],
    ["vakṣas", "chest", "వక్షం"],
    ["udara", "belly", "ఉదరం"],
    ["kara", "hand; and: the maker of", "చేయి; చేసేవాడు"],
    ["hasta", "hand", "హస్తం"],
    ["pāṇi", "hand", "చేయి"],
    ["bāhu", "arm", "బాహువు"],
    ["pada", "foot; word; step", "పాదం; పదం"],
    ["caraṇa", "foot", "చరణం"],
    ["aṅga", "limb, body", "అంగం"],
    ["danta", "tooth, tusk", "దంతం"],
    ["karṇa", "ear", "చెవి"],
    ["jihvā", "tongue", "నాలుక"],
    ["keśa", "hair", "కేశం"],
    ["jaṭā", "matted locks", "జట"],
    ["vāc", "speech, word", "వాక్కు"],
    ["nara", "man", "నరుడు"],
    ["mānava", "human being", "మానవుడు"],
    ["strī", "woman", "స్త్రీ"],
    ["bāla", "child; young", "బాలుడు"],
    ["mātṛ", "mother", "తల్లి"],
    ["pitṛ", "father", "తండ్రి"],
    ["putra", "son", "పుత్రుడు"],
    ["sutā", "daughter", "కుమార్తె"],
    ["sūnu", "son", "కొడుకు"],
    ["patnī", "wife", "భార్య"],
    ["muni", "sage, silent one", "ముని"],
    ["ṛṣi", "seer", "ఋషి"],
    ["vipra", "brāhmaṇa, learned one", "విప్రుడు"],
    ["dvija", "twice-born", "ద్విజుడు"],
    ["dāsa", "servant, devotee", "దాసుడు"],
    ["śiṣya", "disciple", "శిష్యుడు"],
    ["sakha", "friend", "మిత్రుడు"],
    ["bhakta", "devotee", "భక్తుడు"],

    /* the world */
    ["loka", "world; the people", "లోకం"],
    ["jagat", "the moving world", "జగత్తు"],
    ["bhuvana", "world, sphere", "భువనం"],
    ["viśva", "all, the universe", "విశ్వం"],
    ["bhūmi", "earth", "భూమి"],
    ["pṛthvī", "the earth", "పృథ్వి"],
    ["gagana", "sky", "గగనం"],
    ["ākāśa", "space, sky", "ఆకాశం"],
    ["vyoman", "the heavens", "వ్యోమం"],
    ["svarga", "heaven", "స్వర్గం"],
    ["naraka", "hell", "నరకం"],
    ["jala", "water", "జలం"],
    ["ambu", "water", "నీరు"],
    ["vāri", "water", "నీరు"],
    ["toya", "water", "నీరు"],
    ["anala", "fire", "అగ్ని"],
    ["pāvaka", "the purifier — fire", "పావకుడు"],
    ["pavana", "wind, the purifying breeze", "పవనం"],
    ["tejas", "radiance, fiery power", "తేజం"],
    ["jyotis", "light", "జ్యోతి"],
    ["prakāśa", "light, shining forth", "ప్రకాశం"],
    ["dīpa", "lamp", "దీపం"],
    ["kiraṇa", "ray", "కిరణం"],
    ["chāyā", "shade, shadow", "ఛాయ"],
    ["andhakāra", "darkness", "అంధకారం"],
    ["kāla", "time; death; black", "కాలం"],
    ["dina", "day", "దినం"],
    ["divasa", "day", "దివసం"],
    ["rātri", "night", "రాత్రి"],
    ["prabhāta", "dawn", "ప్రభాతం"],
    ["sandhyā", "twilight, the joining hour", "సంధ్య"],
    ["varṣa", "year; rain", "సంవత్సరం; వర్షం"],
    ["megha", "cloud", "మేఘం"],
    ["giri", "mountain", "పర్వతం"],
    ["parvata", "mountain", "పర్వతం"],
    ["śaila", "rock, mountain", "శైలం"],
    ["samudra", "ocean", "సముద్రం"],
    ["sāgara", "ocean", "సాగరం"],
    ["sindhu", "sea; river", "సింధువు"],
    ["nadī", "river", "నది"],
    ["vana", "forest", "వనం"],
    ["vṛkṣa", "tree", "వృక్షం"],
    ["puṣpa", "flower", "పుష్పం"],
    ["mālā", "garland", "మాల"],
    ["phala", "fruit; result", "ఫలం"],
    ["patra", "leaf", "పత్రం"],
    ["padma", "lotus", "పద్మం"],
    ["kamala", "lotus", "కమలం"],
    ["puṇḍarīka", "white lotus", "తెల్ల తామర"],
    ["abja", "the water-born — lotus", "అబ్జం"],
    ["ratna", "gem", "రత్నం"],
    ["maṇi", "jewel", "మణి"],
    ["hema", "gold", "బంగారం"],
    ["svarṇa", "gold", "స్వర్ణం"],
    ["kāñcana", "gold, golden", "కాంచనం"],
    ["gaja", "elephant", "ఏనుగు"],
    ["mṛga", "deer; beast", "మృగం"],
    ["siṁha", "lion", "సింహం"],
    ["vṛṣa", "bull", "వృషభం"],
    ["aśva", "horse", "గుర్రం"],
    ["go", "cow; the earth", "గోవు"],
    ["nāga", "serpent; elephant", "నాగము"],
    ["sarpa", "serpent", "సర్పం"],
    ["gṛha", "house", "గృహం"],
    ["pura", "city, fortress", "పురం"],
    ["kṣetra", "sacred ground; field", "క్షేత్రం"],
    ["mandira", "temple, dwelling", "మందిరం"],
    ["āsana", "seat", "ఆసనం"],
    ["siṁhāsana", "lion-throne", "సింహాసనం"],

    /* what is sought, what is shed */
    ["jñāna", "knowledge", "జ్ఞానం"],
    ["vijñāna", "discerning knowledge", "విజ్ఞానం"],
    ["vidyā", "learning, sacred knowledge", "విద్య"],
    ["ajñāna", "ignorance", "అజ్ఞానం"],
    ["avidyā", "ignorance", "అవిద్య"],
    ["māyā", "the measuring power; illusion", "మాయ"],
    ["satya", "truth, the real", "సత్యం"],
    ["dharma", "the law; duty; righteousness", "ధర్మం"],
    ["karma", "action; its fruit", "కర్మ"],
    ["bhakti", "devotion", "భక్తి"],
    ["prema", "love", "ప్రేమ"],
    ["śraddhā", "faith", "శ్రద్ధ"],
    ["kāma", "desire", "కోరిక"],
    ["krodha", "anger", "క్రోధం"],
    ["moha", "delusion", "మోహం"],
    ["lobha", "greed", "లోభం"],
    ["mada", "pride, intoxication", "మదం"],
    ["bhaya", "fear", "భయం"],
    ["śoka", "grief", "శోకం"],
    ["duḥkha", "sorrow, pain", "దుఃఖం"],
    ["sukha", "ease, happiness", "సుఖం"],
    ["ānanda", "bliss", "ఆనందం"],
    ["mokṣa", "liberation", "మోక్షం"],
    ["mukti", "release", "ముక్తి"],
    ["janma", "birth", "జన్మ"],
    ["mṛtyu", "death", "మృత్యువు"],
    ["saṁsāra", "the round of birth and death", "సంసారం"],
    ["pāpa", "sin, evil", "పాపం"],
    ["puṇya", "merit, the holy", "పుణ్యం"],
    ["doṣa", "fault, blemish", "దోషం"],
    ["roga", "disease", "రోగం"],
    ["śatru", "enemy", "శత్రువు"],
    ["ripu", "foe", "శత్రువు"],
    ["vighna", "obstacle", "విఘ్నం"],
    ["bhīti", "dread", "భీతి"],
    ["siddhi", "attainment, success", "సిద్ధి"],
    ["vara", "boon; choice, excellent", "వరం"],
    ["dāna", "giving, gift", "దానం"],
    ["dayā", "compassion", "దయ"],
    ["kṛpā", "grace", "కృప"],
    ["śakti", "power, the Goddess", "శక్తి"],
    ["bala", "strength", "బలం"],
    ["vīrya", "valour, vigour", "వీర్యం"],
    ["ojas", "vital force", "ఓజస్సు"],
    ["tapas", "austerity, heat of practice", "తపస్సు"],
    ["yoga", "union; discipline", "యోగం"],
    ["mūrti", "form, image", "మూర్తి"],
    ["rūpa", "form, beauty", "రూపం"],
    ["varṇa", "colour; class; letter", "వర్ణం"],
    ["guṇa", "quality, strand, virtue", "గుణం"],
    ["veda", "the Veda; knowledge", "వేదం"],
    ["śāstra", "treatise, teaching", "శాస్త్రం"],
    ["kathā", "story, telling", "కథ"],
    ["gīta", "song; sung", "గీతం"],
    ["nāda", "sound", "నాదం"],
    ["svara", "tone, accent", "స్వరం"],
    ["akṣara", "imperishable; syllable", "అక్షరం"],
    ["bīja", "seed", "బీజం"],
    ["cakra", "wheel, discus", "చక్రం"],
    ["śaṅkha", "conch", "శంఖం"],
    ["gadā", "mace", "గద"],
    ["śūla", "spear, trident", "శూలం"],
    ["triśūla", "trident", "త్రిశూలం"],
    ["dhanus", "bow", "ధనుస్సు"],
    ["bāṇa", "arrow", "బాణం"],
    ["śara", "arrow", "శరం"],
    ["khaḍga", "sword", "ఖడ్గం"],
    ["aṅkuśa", "goad", "అంకుశం"],
    ["pāśa", "noose", "పాశం"],
    ["ḍamaru", "the hand-drum", "డమరుకం"],
    ["vīṇā", "the lute", "వీణ"],
    ["bhūṣaṇa", "ornament", "భూషణం"],
    ["ābharaṇa", "ornament", "ఆభరణం"],
    ["hāra", "necklace", "హారం"],
    ["kuṇḍala", "earring", "కుండలం"],
    ["kirīṭa", "crown, diadem", "కిరీటం"],
    ["mauli", "crown of the head", "మౌళి"],
    ["śekhara", "crest, that worn on the head", "శేఖరం"],
    ["vastra", "garment", "వస్త్రం"],
    ["ambara", "garment; sky", "అంబరం"],
    ["carman", "hide, skin", "చర్మం"],
    ["bhasma", "ash", "భస్మం"],
    ["candana", "sandal paste", "చందనం"],
    ["dhvaja", "banner", "ధ్వజం"],
    ["vāhana", "vehicle, mount", "వాహనం"],

    /* how it is described */
    ["mahā", "great", "మహా, గొప్ప"],
    ["mahat", "great, vast", "మహత్తు"],
    ["para", "supreme; beyond, other", "పరమైన"],
    ["parama", "highest, supreme", "పరమ"],
    ["uttama", "highest, best", "ఉత్తమం"],
    ["śreṣṭha", "best, most excellent", "శ్రేష్ఠం"],
    ["su", "well, good — an intensifier", "మంచి, చక్కగా"],
    ["sundara", "beautiful", "సుందరం"],
    ["ramya", "delightful", "రమ్యం"],
    ["pavitra", "pure, purifying", "పవిత్రం"],
    ["śuddha", "pure, clear", "శుద్ధం"],
    ["nirmala", "spotless", "నిర్మలం"],
    ["priya", "dear, beloved", "ప్రియమైన"],
    ["śānta", "calm, at peace", "శాంతం"],
    ["ugra", "fierce", "ఉగ్రం"],
    ["ghora", "terrible", "ఘోరం"],
    ["bhīma", "fearsome", "భీమం"],
    ["dhīra", "steady, resolute", "ధీరం"],
    ["śūra", "brave", "శూరుడు"],
    ["vīra", "hero; heroic", "వీరుడు"],
    ["śveta", "white", "శ్వేతం"],
    ["śukla", "white, bright", "శుక్లం"],
    ["rakta", "red; blood", "రక్తం"],
    ["nīla", "dark blue", "నీలం"],
    ["pīta", "yellow", "పసుపు"],
    ["gaura", "fair, golden-hued", "గౌరం"],
    ["hiraṇya", "golden", "హిరణ్యం"],
    ["śyāma", "dark, dusky", "శ్యామం"],
    ["sūkṣma", "subtle", "సూక్ష్మం"],
    ["sthūla", "gross, dense", "స్థూలం"],
    ["akhila", "entire, whole", "అఖిలం"],
    ["sakala", "all, complete", "సకలం"],
    ["sarva", "all, every", "సర్వం"],
    ["ādi", "first, beginning; and the rest", "ఆది"],
    ["anta", "end", "అంతం"],
    ["madhya", "middle", "మధ్య"],
    ["avyaya", "unchanging, imperishable", "అవ్యయం"],
    ["sanātana", "ancient and everlasting", "సనాతనం"],
    ["aja", "unborn; born of", "అజుడు"],
    ["amara", "immortal", "అమరుడు"],
    ["nirguṇa", "beyond quality", "నిర్గుణం"],
    ["saguṇa", "with quality, with form", "సగుణం"],
    ["sthita", "standing, abiding in", "ఉన్నవాడు"],
    ["yukta", "joined with, endowed", "కూడినవాడు"],
    ["sahita", "accompanied by", "కలిసినవాడు"],
    ["samanvita", "endowed with", "కలిగినవాడు"],
    ["rahita", "devoid of", "లేనివాడు"],
    ["vihīna", "without, bereft of", "లేనివాడు"],
    ["hīna", "lacking", "తక్కువ"],
    ["pūrṇa", "full, complete", "పూర్ణం"],
    ["ardha", "half", "అర్ధం"],
    ["eka", "one, alone", "ఒక్క"],
    ["dvi", "two", "రెండు"],
    ["tri", "three", "మూడు"],
    ["catur", "four", "నాలుగు"],
    ["pañca", "five", "ఐదు"],
    ["ṣaṭ", "six", "ఆరు"],
    ["sapta", "seven", "ఏడు"],
    ["aṣṭa", "eight", "ఎనిమిది"],
    ["nava", "nine; new", "తొమ్మిది; క్రొత్త"],
    ["daśa", "ten", "పది"],
    ["śata", "a hundred", "వంద"],
    ["sahasra", "a thousand", "వేయి"],
    ["koṭi", "ten million; a crore", "కోటి"],

    /* what the verse asks for */
    ["pāhi", "protect!", "రక్షించు"],
    ["rakṣa", "protect!; protection", "రక్షించు; రక్ష"],
    ["trāhi", "save!", "కాపాడు"],
    ["dehi", "give!", "ఇవ్వు"],
    ["kuru", "do!, make!", "చేయు"],
    ["śṛṇu", "listen!", "వినుము"],
    ["bhava", "be!, become!; existence", "అగుము; భవం"],
    ["nāśaya", "destroy!", "నాశనం చేయు"],
    ["prasīda", "be gracious!", "ప్రసన్నుడవు కాగా"],
    ["jaya-", "conquer!, be victorious", "జయించు"],
    ["asti", "is, exists", "ఉంది"],
    ["bhavati", "becomes, is", "అవుతుంది"],
    ["karoti", "does, makes", "చేస్తాడు"],
    ["gacchati", "goes", "వెళ్తాడు"],
    ["dadāti", "gives", "ఇస్తాడు"],
    ["paśyati", "sees", "చూస్తాడు"],
    ["jānāti", "knows", "తెలుసుకుంటాడు"],
    ["labhate", "obtains", "పొందుతాడు"],
    ["paṭhet", "should recite", "పఠించవలెను"],
    ["paṭhati", "recites", "పఠిస్తాడు"],
    ["japet", "should repeat", "జపించవలెను"],
    ["smaret", "should remember", "స్మరించవలెను"],
    ["śṛṇvan", "hearing, while listening", "వినుచున్న"],
    ["kṛtvā", "having done", "చేసి"],
    ["gatvā", "having gone", "వెళ్ళి"],
    ["prāpya", "having obtained", "పొంది"],
    ["namaskṛtya", "having bowed", "నమస్కరించి"],

    /* the elements compounds are built from */
    ["dhara", "bearing, holding", "ధరించినవాడు"],
    ["dhārin", "bearer", "ధరించినవాడు"],
    ["kārin", "doer, maker", "చేసేవాడు"],
    ["kāraṇa", "cause", "కారణం"],
    ["da", "giving, granting", "ఇచ్చేవాడు"],
    ["prada", "bestowing", "ప్రసాదించేవాడు"],
    ["ja", "born of, arisen from", "పుట్టినవాడు"],
    ["bhava-", "arising from", "కలిగినవాడు"],
    ["maya", "made of, full of", "తో నిండిన"],
    ["vat", "possessing, like", "కలిగిన"],
    ["hārin", "taking away, removing", "హరించేవాడు"],
    ["nāśana", "destroying", "నాశనం చేసేవాడు"],
    ["nāśa", "destruction", "నాశనం"],
    ["ghna", "slaying, destroying", "నశింపజేసేవాడు"],
    ["hantṛ", "slayer", "సంహారకుడు"],
    ["vardhana", "increasing, nourishing", "వృద్ధి చేసేవాడు"],
    ["kṣaya", "wasting away, loss", "క్షయం"],
    ["mocana", "releasing", "విముక్తి కలిగించేవాడు"],
    ["pālaka", "protector", "పాలకుడు"],
    ["pāla", "guardian", "పాలకుడు"],
    ["rakṣaka", "protector", "రక్షకుడు"],
    ["priya-", "fond of, dear to", "ప్రియమైన"],
    ["vallabha", "beloved, consort", "వల్లభుడు"],
    ["ramaṇa", "delighting, lover", "రమణుడు"],
    ["sambhava", "arisen from, birth", "సంభవం"],
    ["udbhava", "springing up from", "ఉద్భవం"],
    ["ālaya", "abode", "ఆలయం"],
    ["nilaya", "dwelling", "నిలయం"],
    ["vāsa", "dwelling, residing", "వాసం"],
    ["gata", "gone to, situated in", "పొందినవాడు"],
    ["priyaṅkara", "doing what is dear", "ప్రియం చేసేవాడు"],
    ["antaka", "the ender", "అంతకుడు"],
    ["vibhu", "all-pervading, mighty", "విభుడు"],
    ["vyāpaka", "pervading", "వ్యాపించినవాడు"],
    ["īśitṛ", "ruling", "పాలించువాడు"],
    ["kāra", "maker; and: the sound, the letter", "చేసేవాడు; అక్షరం"],
    ["kārya", "what is to be done, task", "కార్యం"],
    ["kṛta", "done, made", "చేయబడినది"],
    ["akṛta", "undone, uncreated", "చేయబడనిది"],
    ["kāya", "body", "కాయం, శరీరం"],
    ["vakra", "bent, curved", "వక్రమైన"],
    ["tuṇḍa", "trunk, snout, mouth", "తుండం"],
    ["prabhā", "radiance", "ప్రభ"],
    ["prabha", "shining, radiant", "ప్రకాశించువాడు"],
    ["sama", "equal, alike; even", "సమానం"],
    ["rāga", "hue; passion", "రాగం"],
    ["dik", "direction, quarter of the sky", "దిక్కు"],
    ["digambara", "sky-clad — Śiva", "దిగంబరుడు"],
    ["traya", "a triad, threefold", "త్రయం"],
    ["trailokya", "the three worlds", "త్రైలోక్యం"],
    ["praṇāma", "obeisance", "ప్రణామం"],
    ["praṇamya", "having bowed", "నమస్కరించి"],
    ["vandana", "salutation", "వందనం"],
    ["vandita", "saluted, revered", "వందితుడు"],
    ["arcana", "worship, offering", "అర్చన"],
    ["arcita", "worshipped", "అర్చించబడినవాడు"],
    ["pūjita", "worshipped", "పూజించబడినవాడు"],
    ["sevita", "served, attended upon", "సేవించబడినవాడు"],
    ["stuta", "praised", "స్తుతించబడినవాడు"],
    ["nuta", "praised, extolled", "నుతించబడినవాడు"],
    ["dhṛta", "held, worn", "ధరించినవాడు"],
    ["śobhita", "adorned, shining with", "శోభించువాడు"],
    ["bhūṣita", "adorned with", "అలంకరించబడినవాడు"],
    ["vibhūṣita", "richly adorned", "విభూషితుడు"],
    ["alaṅkṛta", "decorated", "అలంకృతం"],
    ["anvita", "accompanied by, endowed with", "కూడినవాడు"],
    ["saṁyuta", "joined with", "కలిసినవాడు"],
    ["līlā", "play, divine sport", "లీల"],
    ["mahiman", "greatness", "మహిమ"],
    ["kīrti", "fame", "కీర్తి"],
    ["yaśas", "glory, renown", "యశస్సు"],
    ["śrīmat", "glorious, holy", "శ్రీమంతుడు"],
    ["sadana", "abode", "సదనం"],
    ["sthāna", "place, station", "స్థానం"],
    ["pīṭha", "seat, pedestal", "పీఠం"],
    ["tīrtha", "holy ford, sacred water", "తీర్థం"],
    ["snāna", "bathing", "స్నానం"],
    ["graha", "planet; seizing", "గ్రహం"],
    ["nakṣatra", "star, lunar mansion", "నక్షత్రం"],
    ["māsa", "month", "మాసం"],
    ["yuga", "an age of the world", "యుగం"],
    ["kalpa", "an aeon; rite", "కల్పం"],
    ["ādya", "first, primal", "ఆద్యుడు"],
    ["kṣamā", "patience, forgiveness", "క్షమ"],
    ["·me", "to me, my", "నాకు, నా"],
    ["·tasmai", "to him, to that one", "అతనికి"],
    ["·tena", "by him, by that", "అతనిచేత"],
    ["·tubhyam", "to you", "నీకు"],
    ["·yaḥ-", "who, whoever", "ఎవడు"],
    ["·te", "to you; your", "నీకు; నీ"],
    ["namo", "salutation to", "నమస్కారం"],
    ["astu", "let it be, may there be", "అగుగాక"],
    ["āyata", "extended, long", "విశాలమైన"],
    ["akṣa", "eye", "కన్ను"],
    ["sva", "one's own, self", "స్వంతం"],
    ["svarūpa", "own form, essence", "స్వరూపం"],
    ["divya", "divine, heavenly", "దివ్యమైన"],
    ["śaraṇa", "refuge, shelter", "శరణం"],
    ["śaraṇya", "the refuge of all", "శరణ్యుడు"],
    ["artha", "meaning; purpose; wealth", "అర్థం"],
    ["sādhaka", "one who accomplishes; a seeker", "సాధకుడు"],
    ["sādhikā", "she who accomplishes", "సాధించేది"],
    ["yakṣa", "a yakṣa — a spirit of the woods", "యక్షుడు"],
    ["madhura", "sweet", "మధురమైన"],
    ["madhu", "honey; sweet", "తేనె; మిరియైన"],
    ["hasita", "laughter, a smile", "నవ్వు"],
    ["smīta", "smiling", "చిరునవ్వు"],
    ["hāsa", "laughter", "హాసం"],
    ["nṛtya", "dance", "నృత్యం"],
    ["vacana", "word, speech", "వచనం"],
    ["vākya", "sentence, utterance", "వాక్యం"],
    ["carita", "conduct, deeds, story", "చరితం"],
    ["cala", "moving", "చలించే"],
    ["acala", "unmoving; a mountain", "అచలం; పర్వతం"],
    ["śayana", "lying down, couch", "శయనం"],
    ["nidrā", "sleep", "నిద్ర"],
    ["svapna", "dream", "స్వప్నం"],
    ["amṛta", "nectar; immortal", "అమృతం"],
    ["viṣa", "poison", "విషం"],
    ["kṣīra", "milk", "క్షీరం, పాలు"],
    ["ghṛta", "ghee", "నేయి"],
    ["anna", "food", "అన్నం"],
    ["dhana", "wealth", "ధనం"],
    ["aiśvarya", "lordship, abundance", "ఐశ్వర్యం"],
    ["sampat", "prosperity", "సంపద"],
    ["rājya", "kingdom, rule", "రాజ్యం"],
    ["senā", "army", "సేన"],
    ["yuddha", "battle", "యుద్ధం"],
    ["vijaya", "victory", "విజయం"],
    ["gamana", "going, gait", "గమనం"],
    ["vasana", "garment", "వస్త్రం"],
    ["veṇu", "flute", "వేణువు"],
    ["reṇu", "dust", "దూళి"],
    ["calita", "moved, set in motion", "చలనం"],
    ["adhipati", "overlord", "అధిపతి"],
    ["jāla", "net, web", "జాలం"],
    ["vāk", "speech, the word", "వాక్కు"],
    ["sat", "being, the real; good", "సత్తు; మంచి"],
    ["hartṛ", "remover, one who takes away", "హరించేవాడు"],
    ["kartṛ", "doer, maker", "కర్త"],
    ["dhātṛ", "upholder, creator", "ధాత"],

    /* pronouns and connectives that carry the sentence */
    ["·tasya", "his, its, of that", "అతని"],
    ["·yasya", "whose, of whom", "ఎవరిదో"],
    ["·yena", "by whom, by which", "ఎవరిచేత"],
    ["·asya", "of this, his", "ఈతని"],
    ["·ya", "who, which", "ఎవడు"],
    ["·yā", "she who", "ఎవతెభైతే"],
    ["·yat", "which, that", "ఎది"],
    ["·etat", "this", "ఇది"],
    ["·eṣa", "this one, he", "ఈతడు"],
    ["·sa", "he, that one", "అతడు"],
    ["·ka", "who?", "ఎవరు"],
    ["·ke", "who (plural); in Hindi: of", "ఎవరు (బహువచనం)"],
    ["·māṁ", "me", "నన్ను"],
    ["·naḥ", "us, to us", "మమ్మలను"],
    ["·svayaṁ", "of oneself, spontaneously", "స్వయంగా"],
    ["·vai", "indeed (an emphasis)", "నిజంగా"],
    ["·yatra", "where", "ఎక్కడ"],
    ["·tatra", "there", "అక్కడ"],
    ["·atra", "here", "ఇక్కడ"],
    ["·pratyahaṁ", "day after day", "ప్రతిదినం"],
    ["·aśeṣa", "without remainder, entirely", "సంపూర్ణంగా"],

    /* what the verses say people do */
    ["uvāca", "said, spoke", "అనెను"],
    ["āha", "says", "చెప్పుచున్నాడు"],
    ["bhavet", "would be, should become", "అగును"],
    ["syāt", "would be", "అయ్యును"],
    ["kuryāt", "should do", "చేయవలెను"],
    ["dhyāyet", "should meditate on", "ధ్యానించవలెను"],
    ["labhet", "would obtain", "పొందును"],
    ["yānti", "they go, they reach", "చేరుకుంటారు"],
    ["japyate", "is repeated", "జపించబడుతుంది"],
    ["paṭhyate", "is recited", "పఠించబడుతుంది"],
    ["bhaviṣyati", "will be", "అవుతుంది"],
    ["vindati", "finds, obtains", "పొందుతాడు"],
    ["vidadhāti", "ordains, creates", "కల్పిస్తాడు"],
    ["prahiṇoti", "sends forth", "పంపుతాడు"],
    ["śṛṇoti", "hears", "వినుతాడు"],
    ["parikalpayāmi", "I assign, I offer up", "సమర్పిస్తున్నాను"],
    ["praṇamāmi", "I bow low", "ప్రణమిల్లుచున్నాను"],
    ["dātṛ", "giver", "దాత"],
    ["parāyaṇa", "devoted recitation; the final resort", "పారాయణం"],

    /* the mantra frame — nyāsa, viniyoga, the bīja syllables */
    ["viniyoga", "the application — how a mantra is used", "వినియోగం"],
    ["nyāsa", "placing the mantra on the body", "న్యాసం"],
    ["kīlaka", "the pin — what fastens a mantra", "కీలకం"],
    ["chandas", "metre", "ఛందస్సు"],
    ["devatā", "the deity of a mantra", "దేవత"],
    ["digbandha", "binding the quarters", "దిగ్బంధం"],
    ["aṅguṣṭha", "thumb", "బొట్రనవేలు"],
    ["tarjanī", "forefinger", "చూపుడువేలు"],
    ["madhyamā", "middle finger; the middle one", "మధ్యమవేలు"],
    ["anāmikā", "ring finger — the nameless one", "అనామిక"],
    ["kaniṣṭhikā", "little finger", "చిటికెనవేలు"],
    ["karatala", "palm of the hand", "అరచేతి"],
    ["pṛṣṭha", "the back of", "వెనుభాగం"],
    ["śikhā", "the crown-tuft; a flame's tip", "శిఖ"],
    ["astra", "weapon", "అస్త్రం"],
    ["huṁ", "a bīja of force", "హుం — బలబీజం"],
    ["phaṭ", "the bīja that strikes and dispels", "ఫట్ — అస్త్ర బీజం"],
    ["vaṣaṭ", "an oblation-call", "వషట్"],
    ["vauṣaṭ", "an oblation-call", "వౌషట్"],
    ["hrīṁ", "the bīja of the Goddess", "హ్రీం — దేవీ బీజం"],
    ["klīṁ", "the bīja of attraction", "క్లీం బీజం"],
    ["śrīṁ", "the bīja of Lakṣmī", "శ్రీం బీజం"],
    ["aiṁ", "the bīja of speech", "ఐం — వాగ్బీజం"],
    ["gaṁ", "the bīja of Gaṇeśa", "గం — గణేశ బీజం"],

    /* nouns the compounds keep reaching for */
    ["gaṇa", "a host, a troop of attendants", "గణం"],
    ["puruṣa", "a person; the cosmic Person", "పురుషుడు"],
    ["pumān", "a man", "పురుషుడు"],
    ["sura", "a god", "సురుడు, దేవత"],
    ["asura", "an asura, adversary of the gods", "అసురుడు"],
    ["pāda", "foot; a quarter", "పాదం"],
    ["cintā", "thought, anxiety", "చింత"],
    ["aṇḍa", "an egg; the cosmic egg", "అండం"],
    ["mekhalā", "girdle", "మెఖల"],
    ["sāṅkhya", "the Sāṅkhya teaching; reckoning", "సాంఖ్యం"],
    ["nandana", "gladdening; a son", "నందనుడు"],
    ["lupta", "vanished, taken away", "తొలగిన"],
    ["kalā", "a part, a sixteenth; art", "కళ"],
    ["śārṅga", "the horn-bow of Viṣṇu", "శార్ఙం"],
    ["gahana", "deep, unfathomable", "గహనం, లోతైన"],
    ["ratha", "chariot", "రథం"],
    ["kṣobha", "agitation, shaking", "క్షోభం"],
    ["bhūta", "a being; what has come to be", "భూతం"],
    ["bhoga", "enjoyment, what is enjoyed", "భోగం"],
    ["śeṣa", "remainder; the serpent Śeṣa", "శేషుడు"],
    ["sthāvara", "standing still, unmoving", "స్థావరం"],
    ["jaṅgama", "moving, that which walks", "జంగమం"],
    ["aṁśu", "a ray", "కిరణం"],
    ["saṁśaya", "doubt", "సందేహం"],
    ["nāmnāṁ", "of the names", "నామాల యొక్క"],
    ["brahmaṇya", "devoted to Brahman and to the learned", "బ్రహ్మణ్యుడు"],
    ["kāśyapa", "of the sage Kaśyapa", "కాశ్యపుడు"],
    ["vaidya", "a healer", "వైద్యుడు"],
    ["vidhi", "the rule, the ordained way", "విధి"],
    ["samaya", "time, the appointed hour", "సమయం"],
    ["prabodha", "waking, awakening", "ప్రబోధం"],

    /* Awadhī of the Hānuman Cālīsā, where the corpus leaves Sanskrit */
    ["·jo", "who, whoever (Awadhī)", "ఎవరు (అవధీ)"],
    ["·tuma", "you (Awadhī)", "నువ్వు (అవధీ)"],
    ["·tumhare", "your (Awadhī)", "నీ (అవధీ)"],
    ["·saba", "all (Awadhī)", "అన్ని (అవధీ)"],
    ["kāja", "work, task (Awadhī)", "పని (అవధీ)"],
    ["·bina", "without (Awadhī)", "లేకుండా"],
    ["·nāhīṁ", "not (Awadhī)", "కాదు"],
    ["hanumāna", "Hanumān", "హనుమంతుడు"],
    ["saṅkaṭa", "straits, distress", "సంకటం"],
    ["nama", "salutation, obeisance", "నమస్కారం"],
    ["pūrva", "former, prior; the east", "పూర్వం"],
    ["kumbha", "pot, pitcher", "కుంభం"],
    ["vidyate", "exists, is found", "ఉంటుంది"],
    ["·iva", "like, as if", "వలె"],
    ["hetu", "cause, reason", "హేతువు"],
    ["siddha", "accomplished, perfected", "సిద్ధుడు"],
    ["prasanna", "gracious, well-pleased", "ప్రసన్నుడు"],
    ["tuṣṭa", "pleased", "సంతుష్టుడు"],
    ["vibhūti", "splendour, might; sacred ash", "విభూతి"],
    ["·taṁ", "him, that one", "అతని"],
    ["hanumat", "Hanumān — the strong-jawed one", "హనుమంతుడు"],
    ["·kī", "of (Awadhī)", "యొక్క (అవధీ)"],
    ["rāvaṇa", "Rāvaṇa", "రావణుడు"],
  ];

  /* prefixes — a stotra compound is as often prefix + word as word + word */
  const PRE = [
    ["nir", "without, free from", "లేని"], ["niṣ", "without, free from", "లేని"],
    ["nis", "without, free from", "లేని"], ["niḥ", "without, free from", "లేని"],
    ["duḥ", "hard, ill, difficult", "కష్టమైన"], ["dur", "hard, ill, difficult", "కష్టమైన"],
    ["prati", "toward; each", "ప్రతి"], ["pari", "around, fully", "చుట్టూ"],
    ["sam", "together, completely", "సంపూర్ణంగా"], ["saṁ", "together, completely", "సంపూర్ణంగా"],
    ["abhi", "toward, all around", "వైపు"], ["adhi", "over, above", "పైన"],
    ["anu", "after, along", "అనుసరించి"], ["upa", "near, lesser", "దగ్గరగా"],
    ["ati", "beyond, exceedingly", "మిక్కిలి"], ["apa", "away, off", "దూరంగా"],
    ["ud", "up, out", "పైకి"], ["vi", "apart; intensely", "విశేషంగా"],
    ["pra", "forth, forward", "ముందుకు"], ["an", "not, without", "కాని"],
    ["a", "not, without", "కాని"],
  ];

  /* ---------- index ---------- */
  const PUNCT = /[।॥.,;:!?()\[\]{}"“”‘’—–…|]/g;
  /* the corpus mixes IAST and ISO-15919 conventions — ē/ō for e/o, ṃ for ṁ.
     Fold those to one spelling so the lexicon needs only one form. */
  const ISO = (s) => s
    .replace(/ē/g, "e").replace(/ō/g, "o").replace(/ṃ/g, "ṁ")
    .replace(/:/g, "ḥ")                                  /* some sources write visarga as a colon */
    .replace(/ṁ(?=[kg])/g, "ṅ").replace(/ṁ(?=[cj])/g, "ñ")   /* anusvāra → the homorganic nasal, */
    .replace(/ṁ(?=[ṭḍ])/g, "ṇ").replace(/ṁ(?=[td])/g, "n")   /* so one spelling reaches the lexicon */
    .replace(/ṁ(?=[pb])/g, "m");
  const clean = (s) => ISO((s || "").normalize("NFC").toLowerCase()).replace(PUNCT, "").replace(/^-+|-+$/g, "").trim();
  const fold = (s) => clean(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const LEX = new Map(), PARTICLE = new Set(), PREFIX = new Map();
  RAW.forEach(([k, en, te]) => {
    let key = k, part = false, tail = false;
    if (key[0] === "·") { key = key.slice(1); part = true; }
    if (key.slice(-1) === "-") { key = key.slice(0, -1); tail = true; }
    if (part) PARTICLE.add(key);
    if (!LEX.has(key) || tail) LEX.set(key, { iast: key, en, te: te || "", particle: part });
  });

  PRE.forEach(([k, en, te]) => PREFIX.set(k, { iast: k, en, te, prefix: true }));

  /* the sahasranāma glossaries are a lexicon too — a few thousand
     names already glossed name by name; index them by IAST */
  let NAMES = null;
  function names() {
    if (NAMES) return NAMES;
    NAMES = new Map();
    const N = STUTI_NAMES || {};
    Object.keys(N).forEach((k) => {
      (N[k].names || []).forEach((n) => {
        const key = clean(n.iast);
        if (key && !NAMES.has(key)) NAMES.set(key, { iast: n.iast, deva: n.deva, en: n.me, te: n.mt || "", n: n.n, from: k });
      });
    });
    return NAMES;
  }

  /* ---------- undo inflection ---------- */
  const ENDINGS = [
    "ābhyām", "ebhyaḥ", "ānām", "ānāṁ", "īnām", "īnāṁ", "ūnām", "ūnāṁ", "ābhiḥ", "ubhiḥ",
    "eṣām", "eṣāṁ", "asmai", "asmāt", "ebhiḥ", "asya", "eṣu", "āsu", "avaḥ", "ave", "ayai", "aye",
    "ābhyāṁ", "ībhyām", "ībhyāṁ", "ubhyām", "ubhyāṁ",
    "ayoḥ", "bhyaḥ", "bhiḥ", "asaḥ", "ayaḥ", "ayā", "āya", "aiḥ", "āni", "ena", "yām",
    "yaḥ", "yai", "yoḥ", "āt", "aḥ", "aṁ", "am", "āḥ", "ān", "au", "oḥ", "iḥ", "īḥ",
    "im", "uḥ", "um", "yā", "ye", "ṣu", "su", "ni", "ai", "eḥ", "āṁ", "ā", "ī", "ū", "e", "o", "ḥ", "ṁ", "m", "i",
  ];
  const STEMS = ["", "a", "ā", "i", "ī", "u", "ū", "an", "as", "ṛ"];

  const FINAL_DEVOICE = { "d": "t", "g": "k", "b": "p", "ḍ": "ṭ" };
  function direct(w) {
    if (LEX.has(w)) return Object.assign({}, LEX.get(w), { match: "exact" });
    const N = names();
    if (N.has(w)) return Object.assign({}, N.get(w), { match: "name" });
    /* ṁ and m are written for one another at a word's end */
    const swap = /ṁ$/.test(w) ? w.slice(0, -1) + "m" : /m$/.test(w) ? w.slice(0, -1) + "ṁ" : null;
    if (swap) {
      if (LEX.has(swap)) return Object.assign({}, LEX.get(swap), { match: "exact" });
      if (N.has(swap)) return Object.assign({}, N.get(swap), { match: "name" });
    }
    return null;
  }
  function resolve(w, noAlt) {
    const d = direct(w);
    if (d) return d;
    for (const suf of ENDINGS) {
      if (w.length <= suf.length + 1 || !w.endsWith(suf)) continue;
      const b = w.slice(0, w.length - suf.length);
      for (const v of STEMS) {
        const hit = direct(b + v);
        if (hit) return Object.assign({}, hit, { match: hit.match === "name" ? "name" : "inflected", stem: b + v });
      }
    }
    if (noAlt) return null;
    /* word-final sandhi: visarga shows up as r/ś/s before the next word,
       as o before a voiced sound; iti sheds its i; stops devoice */
    const alt = [];
    if (/[rśsṣ]$/.test(w)) alt.push(w.slice(0, -1) + "ḥ");
    if (/ś$/.test(w)) alt.push(w.slice(0, -1) + "s");
    if (/o$/.test(w)) alt.push(w.slice(0, -1) + "aḥ");
    if (/y$/.test(w)) alt.push(w.slice(0, -1) + "i");
    if (FINAL_DEVOICE[w.slice(-1)]) alt.push(w.slice(0, -1) + FINAL_DEVOICE[w.slice(-1)]);
    for (const a of alt) {
      const hit = resolve(a, true);
      if (hit) return hit;
    }
    return null;
  }

  /* ---------- undo vowel sandhi at compound joints ---------- */
  const SANDHI = {
    "ā": [["a", "a"], ["a", "ā"], ["ā", "a"]],
    "ī": [["i", "i"], ["i", "ī"], ["ī", "i"]],
    "ū": [["u", "u"], ["u", "ū"], ["ū", "u"]],
    "e": [["a", "i"], ["a", "ī"]],
    "o": [["a", "u"], ["a", "ū"], ["aḥ", "a"], ["as", "a"]],
    "ai": [["a", "e"], ["ā", "e"]],
    "au": [["a", "o"], ["ā", "o"]],
  };
  /* a piece of a compound must be real vocabulary — a short sahasranāma
     name is far more likely to be a coincidence than a constituent */
  function usable(hit, key, allowParticles) {
    if (!hit || key.length < 2) return false;
    if (!allowParticles && (hit.particle || PARTICLE.has(key))) return false;
    if (hit.match === "name" && key.length < 6) return false;
    return true;
  }

  /* prefix + word: nir-vighna, su-mukha, sam-yoga … */
  function prefixSplit(w) {
    for (const [p, entry] of PREFIX) {
      if (w.length < p.length + 3 || !w.startsWith(p)) continue;
      const rest = w.slice(p.length);
      const R = resolve(rest);
      if (usable(R, rest)) return [Object.assign({ part: p }, entry), Object.assign({ part: rest }, R)];
      const deeper = split(rest, 1);
      if (deeper) return [Object.assign({ part: p }, entry)].concat(deeper);
    }
    return null;
  }

  const FINAL = { "d": "t", "g": "k", "b": "p", "ḍ": "ṭ", "j": "k", "n": "m" };
  function split(w, depth, allowParticles) {
    if (depth > 2 || w.length < 5) return null;
    for (let i = w.length - 2; i >= 2; i--) {
      const head = w.slice(0, i), tail = w.slice(i);
      const cands = [];
      const two = head.slice(-2), one = head.slice(-1);
      const rule = SANDHI[two] ? { k: two, r: SANDHI[two] } : SANDHI[one] ? { k: one, r: SANDHI[one] } : null;
      /* sandhi-restored joints first: compounds in these texts are joined,
         not concatenated, so a-a → ā is the likelier reading */
      if (rule) rule.r.forEach(([a, b]) => cands.push([head.slice(0, head.length - rule.k.length) + a, b + tail]));
      cands.push([head, tail]);
      /* final consonants voice before a vowel: jagat + īśvara → jagadīśvara */
      const fin = FINAL[one];
      if (fin) cands.push([head.slice(0, -1) + fin, tail]);
      for (const [h, t] of cands) {
        const H = resolve(h);
        if (!usable(H, h, allowParticles)) continue;
        const T = resolve(t);
        if (usable(T, t, allowParticles)) return [Object.assign({ part: h }, H), Object.assign({ part: t }, T)];
        const rest = split(t, (depth || 0) + 1, allowParticles);
        if (rest) return [Object.assign({ part: h }, H)].concat(rest);
      }
    }
    return null;
  }

  /* ---------- where else the word occurs ---------- */
  let CORPUS = null;
  function corpus() {
    if (CORPUS) return CORPUS;
    CORPUS = [];
    const S = STUTI;
    if (!S || !S.hymns) return CORPUS;
    S.hymns.forEach((h) => {
      if (!h.verses || !h.verses.length) return;
      let gi = 0;
      h.verses.forEach((v, vi) => {
        const devaLines = (v.deva || "").split("\n");
        if (v.iast) {
          const lines = v.iast.split("\n");
          /* diacritic-preserving: the corpus is consistently diacritized, and
             hāra (necklace) is not hara (to remove). Folding belongs to the
             search box, where a user types without marks — not here. */
          const norm = lines.map(clean);
          CORPUS.push({ hymnId: h.id, deityId: h.deity, title: h.title, deva: h.deva, tel: h.tel, verse: vi, n: v.n, lines, norm, flat: norm.map(dehyph), base: gi });
        }
        gi += devaLines.length;
      });
    });
    return CORPUS;
  }

  const dehyph = (s) => s.replace(/[-–—]/g, "");

  function occurrences(stem, opts) {
    const o = opts || {};
    const needle = clean(stem);
    if (needle.length < 3) return [];
    /* a stem must start a word or a compound member — otherwise "akṣa"
       is found inside "dakṣādhvara" and the list fills with coincidence.
       Long stems are allowed mid-compound, where they are meaningful; and
       the tapped word's own surface always counts, wherever it sits. */
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(needle.length >= 6 ? esc(needle) : "(^|[\\s\\-\u2013\u2014|(])" + esc(needle));
    const surface = o.surface ? dehyph(clean(o.surface)) : "";
    const out = [];
    for (const e of corpus()) {
      for (let li = 0; li < e.norm.length; li++) {
        if (!re.test(e.norm[li]) && !(surface.length >= 4 && e.flat[li].indexOf(surface) !== -1)) continue;
        out.push({ hymnId: e.hymnId, deityId: e.deityId, title: e.title, deva: e.deva, tel: e.tel, verse: e.verse, n: e.n, line: e.lines[li], lineIdx: e.base + li, here: e.hymnId === o.hymnId });
        break;
      }
      if (out.length >= 120) { out.capped = true; break; }
    }
    out.sort((a, b) => (a.here === b.here ? 0 : a.here ? -1 : 1));
    return out;
  }

  /* ---------- the tap ---------- */
  /* one hyphen-free segment: itself, or a prefix / compound analysis of it */
  function analyze(seg) {
    const whole = resolve(seg);
    if (whole && whole.match === "exact" && seg.length <= 9) return { whole: whole, parts: null };
    /* the loosest pass — particles allowed as pieces — only when nothing
       else recognised the word at all, or it turns hārāya into hārā + ya */
    const parts = split(seg, 0) || prefixSplit(seg) || (whole ? null : split(seg, 0, true));
    return { whole: whole, parts: parts };
  }

  /* the search key for "also in": in a Sanskrit compound the LAST member
     is the head noun — māhākāya is a body, not a greatness — so the
     occurrence search must key on that, never on the leading intensifier */
  function partStem(p) { return clean(p.stem || p.iast || p.part); }
  function headStem(parts, whole) {
    const real = parts.filter((p) => !p.prefix && !p.unknown && !p.particle && partStem(p).length >= 4);
    if (real.length) return partStem(real[real.length - 1]);
    const any = parts.filter((p) => !p.prefix && !p.unknown && partStem(p).length >= 3);
    if (any.length) return partStem(any[any.length - 1]);
    if (whole) return clean(whole.stem || whole.iast);
    return partStem(parts[parts.length - 1]);
  }

  function lookup(word) {
    const w = clean(word);
    if (!w) return null;
    /* the corpus marks compound joints with hyphens — an authored pada
       split, so honour it before guessing at sandhi */
    const segs = w.split(/[-–—]/).filter(Boolean);
    if (segs.length > 1) {
      const parts = [];
      segs.forEach((s) => {
        const a = analyze(s);
        if (a.parts && a.parts.length > 1) parts.push.apply(parts, a.parts);
        else if (a.whole) parts.push(Object.assign({ part: s }, a.whole));
        else parts.push({ part: s, iast: s, en: "", te: "", unknown: true });
      });
      const joined = resolve(segs.join(""));
      return {
        raw: word, iast: w,
        whole: joined && joined.match === "name" ? joined : null,
        parts: parts.length > 1 ? parts : null,
        stem: headStem(parts, joined),
        surface: dehyph(w),
        found: parts.some((p) => !p.unknown),
      };
    }
    const a = analyze(w);
    const stem = a.whole && a.whole.match === "exact" ? clean(a.whole.stem || a.whole.iast)
               : a.parts ? headStem(a.parts, a.whole)
               : a.whole ? clean(a.whole.stem || a.whole.iast)
               : w;
    return { raw: word, iast: w, whole: a.whole, parts: a.parts && a.parts.length > 1 ? a.parts : null, stem: stem, surface: w, found: !!(a.whole || a.parts) };
  }

  const isWord = (t) => /[\p{L}]/u.test(t);
  /* the displayed token, minus the punctuation that rides along with it */
  const trimTok = (t) => (t || "").normalize("NFC").replace(PUNCT, "").replace(/^[-–—]+|[-–—]+$/g, "").trim();
  const words = (text) => (text || "").split(/\s+/).filter(isWord);
  const nthWord = (text, i) => { const ws = words(text); return ws[i] || ""; };

  return { lookup, occurrences, toDeva, words, nthWord, clean, fold, trimTok, size: LEX.size };
})();

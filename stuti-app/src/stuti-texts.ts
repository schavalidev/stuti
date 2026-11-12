import { STUTI_NAMES } from "./stuti-names";
import { STUTI_TEXTS_EXTRA } from "./stuti-texts-extra";
import { STUTI } from "./stuti-data";

/* ============================================================
   STUTI — full recitable texts
   Parsed from the Telugu source documents in uploads/. Devanāgarī is
   transliterated from the Telugu script at build time; the reader derives
   Telugu back from it, so one corpus serves every reading script.
   ============================================================ */
export const STUTI_TEXTS=/* verses: stuti-body-main.ts, loaded when a reader opens one */
  JSON.parse("[{\"deities\":[\"surya\"],\"title\":\"Āditya Hṛdayam\",\"blurb\":\"Agastya's teaching to Rāma on the eve of the last battle — thirty-one verses to the Sun for courage and victory.\",\"sections\":[{\"tel\":\"ధ్యానం\",\"roman\":\"Dhyānam\"},{\"tel\":\"స్తోత్రం\",\"roman\":\"Stōtram\"},{\"tel\":\"ఫలశ్రుతి\",\"roman\":\"The Fruits of Recitation\"}]},{\"deities\":[\"shiva\",\"guru\"],\"title\":\"Dakṣiṇāmūrti Stotram\",\"blurb\":\"Śaṅkara's hymn to the silent teacher beneath the banyan — the world seen as a city reflected in a mirror.\",\"sections\":[{\"tel\":\"శాంతిపాఠః\",\"roman\":\"Śānti-Pāṭhaḥ\"},{\"tel\":\"ధ్యానం\",\"roman\":\"Dhyānam\"},{\"tel\":\"స్తోత్రం / STOTRAM / The Hymn Proper\",\"roman\":\"10 Shlokas\"},{\"tel\":\"సమాప్తి\",\"roman\":\"Colophon\"}]},{\"deities\":[\"hanuman\"],\"title\":\"Hanumān Cālīsā\",\"blurb\":\"Tulsīdās in Awadhī — forty quatrains on strength, wit and unwavering service, framed by three dohās.\",\"sections\":[{\"tel\":\"దోహా\",\"roman\":\"Dohā — opening couplets\",\"hi\":\"दोहा\"},{\"tel\":\"చౌపాయీ\",\"roman\":\"Caupāī — the forty verses\",\"hi\":\"चौपाई\"},{\"tel\":\"దోహా\",\"roman\":\"Dohā — closing couplet\",\"hi\":\"दोहा\"}]},{\"deities\":[\"vishnu\"],\"title\":\"Viṣṇu Sahasranāma Stotram\",\"blurb\":\"Bhīṣma's thousand names of Viṣṇu from the Anuśāsana Parva — with the pīṭhikās, the nyāsa and the phalaśruti.\",\"about\":{\"kicker\":\"The story\",\"headRoman\":\"Why Bhīṣma taught the thousand names\",\"headTel\":\"భీష్ముడు వేయి నామాలను ఎందుకు బోధించాడు\",\"headHi\":\"भीष्म ने सहस्रनाम क्यों सिखाया\",\"ref\":\"Mahābhārata · Anuśāsana Parva\",\"source\":\"Yudhiṣṭhira–Bhīṣma Saṃvāda\",\"en\":[\"The Viṣṇu Sahasranāma appears in the Anuśāsana Parva of the Mahābhārata. After the Kurukṣetra war, Yudhiṣṭhira had regained his kingdom but remained burdened by grief over the immense loss of life.\",\"Following Śrī Kṛṣṇa's guidance, he approached Bhīṣma Pitāmaha, who lay upon the bed of arrows awaiting Uttarāyaṇa. Though physically wounded, Bhīṣma remained serene and instructed Yudhiṣṭhira about dharma, kingship and liberation.\",\"Yudhiṣṭhira finally asked: who is the Supreme Deity and highest refuge? By praising and worshipping whom does one attain auspiciousness? What is the greatest dharma? By chanting what can one become free from the bondage of birth and death?\",\"Bhīṣma answered that Vāsudeva — the eternal Lord of the universe and Supreme Puruṣa — is the highest refuge. He then revealed the thousand sacred names of Viṣṇu as a path of remembrance, devotion, peace and liberation.\"],\"te\":[\"విష్ణు సహస్రనామం మహాభారతంలోని అనుశాసన పర్వంలో వస్తుంది. కురుక్షేత్ర యుద్ధం ముగిసిన తరువాత యుధిష్ఠిరుడు రాజ్యాన్ని తిరిగి పొందినప్పటికీ, యుద్ధంలో జరిగిన అపారమైన ప్రాణనష్టం కారణంగా తీవ్ర దుఃఖంలో మునిగిపోయాడు.\",\"శ్రీకృష్ణుని మార్గదర్శనంతో, ఉత్తరాయణ పుణ్యకాలం కోసం శరతల్పంపై వేచి ఉన్న భీష్మ పితామహుని సమీపించాడు. శరీరం గాయాలతో నిండినప్పటికీ, భీష్ముని మనస్సు ప్రశాంతంగా, జ్ఞానంతో నిండి ఉంది. ఆయన యుధిష్ఠిరునికి ధర్మం, రాజనీతి మరియు మోక్షమార్గం గురించి ఉపదేశించాడు.\",\"చివరిగా యుధిష్ఠిరుడు ఇలా ప్రశ్నించాడు: ఈ జగత్తులో పరమదైవం ఎవరు? అత్యున్నత ఆశ్రయం ఏది? ఎవరిని స్తుతించి, ఆరాధించడం ద్వారా మానవుడు శుభాన్ని పొందగలడు? అన్ని ధర్మాలలో శ్రేష్ఠమైన ధర్మం ఏది? దేనిని జపించడం ద్వారా జీవుడు జనన–మరణ బంధం నుండి విముక్తి పొందగలడు?\",\"వాసుదేవుడే జగత్తుకు ప్రభువు, పరమపురుషుడు మరియు సర్వోన్నత ఆశ్రయమని భీష్ముడు సమాధానమిచ్చాడు. అనంతరం భక్తి, శాంతి మరియు మోక్షానికి మార్గంగా విష్ణువు యొక్క వేయి పవిత్ర నామాలను యుధిష్ఠిరునికి ఉపదేశించాడు.\"],\"hi\":[\"विष्णु सहस्रनाम महाभारत के अनुशासन पर्व में आता है। कुरुक्षेत्र युद्ध समाप्त होने के बाद युधिष्ठिर को राज्य तो प्राप्त हो गया, लेकिन युद्ध में हुई अपार जनहानि के कारण उनका मन गहरे दुःख से भरा हुआ था।\",\"श्रीकृष्ण के मार्गदर्शन में वे भीष्म पितामह के पास पहुँचे, जो बाणों की शय्या पर लेटे हुए उत्तरायण की प्रतीक्षा कर रहे थे। शरीर घायल होने पर भी भीष्म का मन शान्त और ज्ञान से परिपूर्ण था। उन्होंने युधिष्ठिर को धर्म, राजधर्म और मोक्ष के मार्ग का उपदेश दिया।\",\"अन्त में युधिष्ठिर ने पूछा: संसार में परम देवता कौन हैं? सर्वोच्च आश्रय क्या है? किसकी स्तुति और आराधना करने से मनुष्य कल्याण प्राप्त करता है? सभी धर्मों में श्रेष्ठ धर्म कौन-सा है? किसका जप करने से जीव जन्म और संसार के बन्धन से मुक्त हो सकता है?\",\"भीष्म ने उत्तर दिया कि वासुदेव ही जगत के स्वामी, परम पुरुष और सर्वोच्च आश्रय हैं। इसके बाद उन्होंने भक्ति, शान्ति और मोक्ष के मार्ग के रूप में भगवान विष्णु के एक हजार पवित्र नामों का उपदेश दिया।\"]},\"sections\":[{\"tel\":\"పూర్వ పీఠిక\",\"roman\":\"Pūrva Pīṭhikā\"},{\"tel\":\"సంవాదం — యుధిష్ఠిరుని ప్రశ్నలు\",\"roman\":\"The Dialogue\"},{\"tel\":\"భీష్ముని సమాధానం\",\"roman\":\"Bhishma's Answer\"},{\"tel\":\"న్యాస-వినియోగం\",\"roman\":\"Nyasa & Viniyoga\"},{\"tel\":\"పూర్వన్యాసః\",\"roman\":\"Pūrvanyāsaḥ — the viniyoga\"},{\"tel\":\"కరన్యాసః\",\"roman\":\"Karanyāsaḥ — placement on the hands\"},{\"tel\":\"అంగన్యాసః\",\"roman\":\"Aṅganyāsaḥ — placement on the body\"},{\"tel\":\"ధ్యానం\",\"roman\":\"Dhyānam\"},{\"tel\":\"స్తోత్రం\",\"roman\":\"Stōtram\"},{\"tel\":\"సమాపన నామములు\",\"roman\":\"Closing invocation\"},{\"tel\":\"ఫలశ్రుతి\",\"roman\":\"The Fruits of Recitation\"},{\"tel\":\"ప్రకృతి-విభూతి శ్లోకములు\",\"roman\":\"The Glory of the Lord\"},{\"tel\":\"ఫలశ్రుత్యంత సంవాదము\",\"roman\":\"Concluding Dialogue\"},{\"tel\":\"విశ్వరూపం, పరమాత్మ తత్త్వం\",\"roman\":\"The cosmic form and the supreme Self\"},{\"tel\":\"సర్వజ్ఞత్వం, యజ్ఞ-వేద స్వరూపం\",\"roman\":\"Omniscience; the Vedas and sacrifice\"},{\"tel\":\"సృష్టి-స్థితి-లయ కర్తృత్వం\",\"roman\":\"Creation, preservation and dissolution\"},{\"tel\":\"ఐశ్వర్యం, ధర్మపాలన\",\"roman\":\"Sovereignty and the upholding of dharma\"},{\"tel\":\"జ్ఞానం, మోక్షప్రదత్వం\",\"roman\":\"Knowledge and the bestowing of liberation\"},{\"tel\":\"శ్రీపతి, లోకరక్షణ\",\"roman\":\"Consort of Sri; protector of the worlds\"},{\"tel\":\"అవతారాలు, విభూతులు\",\"roman\":\"The incarnations and divine glories\"},{\"tel\":\"పరమ తత్త్వం, ఆయుధధారి\",\"roman\":\"The supreme reality; bearer of the weapons\"}],\"namesKey\":\"vishnu\"},{\"deities\":[\"devi\"],\"title\":\"Lalitā Sahasranāma Stotram\",\"blurb\":\"The thousand names of Lalitā sung by the eight Vāk-devīs, from the Lalitopākhyāna — read here eight names to a breath.\",\"about\":{\"kicker\":\"Pūrva Pīṭhikā · the story\",\"headRoman\":\"Why the secret names were finally taught\",\"headTel\":\"రహస్య నామాలు చివరకు ఎందుకు బోధించబడ్డాయి\",\"headHi\":\"गुप्त नाम अन्ततः क्यों सिखाए गए\",\"ref\":\"Brahmāṇḍa Purāṇa · Uttara Khaṇḍa\",\"source\":\"Śrīhayagrīva–Agastya Saṃvāda\",\"en\":[\"In the Brahmāṇḍa Purāṇa's dialogue between Sage Agastya and Śrī Hayagrīva, Agastya asks why the thousand secret names of Lalitā Devī were not taught along with the other teachings concerning Śrīpura, Śrīvidyā, worship, and mantra practice. Hayagrīva explains that the hymn is sacred and was withheld because of its confidential character.\",\"The Pūrvapīṭhikā relates that Lalitāmbikā instructed the Vāgdevatās led by Vaśinī to compose a hymn using her divine names. They then praised her with this Rahasya Nāmasāhasra. Pleased, the Goddess directed that her devotees recite it for her delight. The central stōtram gives the thousand names in continuous chant form; the Uttarapīṭhikā describes the traditional fruits and occasions of recitation.\"],\"te\":[\"బ్రహ్మాండ పురాణంలోని శ్రీహయగ్రీవ–అగస్త్య సంవాదంలో, శ్రీపురం, శ్రీవిద్య, పూజా విధానం మొదలైన విషయాలను వివరించినప్పటికీ లలితాదేవి రహస్య సహస్రనామాలు ఎందుకు చెప్పలేదని అగస్త్య మహర్షి ప్రశ్నిస్తాడు. అవి అత్యంత రహస్యమైనవి కావడం వల్లనే ముందుగా ఉపదేశించలేదని శ్రీహయగ్రీవుడు వివరిస్తాడు.\",\"లలితాంబిక ఆజ్ఞతో వశినీ మొదలైన వాగ్దేవతలు ఆమె దివ్య నామాలతో ఈ రహస్యనామసాహస్రాన్ని రచించి స్తుతించారని పూర్వపీఠిక వివరిస్తుంది. దేవి సంతోషించి తన భక్తులు దీనిని పారాయణ చేయాలని ఆదేశిస్తుంది. మధ్య భాగంలో వెయ్యి నామాలు సంధితో కూడిన స్తోత్రరూపంలో ఉంటాయి; ఉత్తరపీఠికలో పారాయణ ఫలాలు మరియు సంప్రదాయ సందర్భాలు వివరించబడతాయి.\"],\"hi\":[\"ब्रह्माण्डपुराण के श्रीहयग्रीव–अगस्त्य संवाद में महर्षि अगस्त्य पूछते हैं कि श्रीपुर, श्रीविद्या, पूजा और मन्त्र-साधना का वर्णन करने के बाद भी ललितादेवी के सहस्र गुप्त नाम क्यों नहीं बताए गए। श्रीहयग्रीव समझाते हैं कि इस स्तोत्र के अत्यन्त गोपनीय होने के कारण इसे पहले प्रकट नहीं किया गया था।\",\"पूर्वपीठिका के अनुसार ललिताम्बिका ने वशिनी आदि वाग्देवताओं को अपने दिव्य नामों से स्तोत्र रचने की आज्ञा दी। उन्होंने रहस्यनामसाहस्र द्वारा देवी की स्तुति की और प्रसन्न होकर देवी ने भक्तों को इसका पाठ करने का निर्देश दिया। मध्य भाग में सहस्रनाम सन्धि सहित स्तोत्ररूप में हैं; उत्तरपीठिका में पाठ के पारम्परिक फल और अवसर वर्णित हैं।\"]},\"sections\":[{\"tel\":\"న్యాస-వినియోగం\",\"roman\":\"Nyasa & Viniyoga\"},{\"tel\":\"ధ్యానం\",\"roman\":\"Dhyānam\"},{\"tel\":\"పంచపూజ\",\"roman\":\"Pancha-pūjā — the five offerings\"},{\"tel\":\"సమాపన నామము\",\"roman\":\"The closing name-verse\"},{\"tel\":\"ఫలశ్రుతి\",\"roman\":\"The Fruits of Recitation\"},{\"tel\":\"నామ కీర్తన మహిమ\",\"roman\":\"The power of even one name\"},{\"tel\":\"దశవిధ నామసాహస్రము\",\"roman\":\"The ten great thousand-name hymns\"},{\"tel\":\"నిష్కామ కీర్తన ఫలము\",\"roman\":\"The fruit of desireless recitation\"},{\"tel\":\"ముగింపు\",\"roman\":\"The sealing verses\"},{\"tel\":\"దేవీ స్వరూప వర్ణన — శిరస్సు నుండి పాదాల వరకు\",\"roman\":\"Description of the Devī's form\"},{\"tel\":\"శ్రీనగరం, దేవీ వైభవం, భండాసుర యుద్ధం\",\"roman\":\"Sri Nagara, the Devī's glory, the war with Bhanda\"},{\"tel\":\"మంత్రస్వరూపం, కుండలినీ ఆరోహణం\",\"roman\":\"The mantra-body and the rise of Kundalini\"},{\"tel\":\"భక్తి, నిర్గుణ తత్త్వ నామాలు\",\"roman\":\"Devotion and the attributeless reality\"},{\"tel\":\"సర్వశక్తి, మహిమ, పంచకృత్య నామాలు\",\"roman\":\"Cosmic power, glory, and the five acts\"},{\"tel\":\"జగత్కారణం, వాక్, శ్రీవిద్యా నామాలు\",\"roman\":\"Cause of the world, speech, and Sri Vidya\"},{\"tel\":\"షట్చక్ర దేవతలు — యోగినీ నామాలు\",\"roman\":\"The devatās of the six chakras\"},{\"tel\":\"పరతత్త్వం, శ్రీవిద్యా, కుల నామాలు\",\"roman\":\"The supreme principle and the Kula\"},{\"tel\":\"దేవీ గుణ, వాక్, విద్యా నామాలు\",\"roman\":\"Qualities, speech, and knowledge\"},{\"tel\":\"ఆరోగ్య, రక్షణ, రాజ్యలక్ష్మీ నామాలు\",\"roman\":\"Healing, protection, and sovereign glory\"},{\"tel\":\"జ్ఞానం, యోగం, గురుతత్త్వ నామాలు\",\"roman\":\"Knowledge, yoga, and the guru principle\"},{\"tel\":\"మోక్షప్రద, తత్త్వాతీత నామాలు\",\"roman\":\"Bestower of liberation, beyond all principles\"},{\"tel\":\"పంచకృత్య, శాశ్వత, ధర్మ నామాలు\",\"roman\":\"The eternal, and the upholder of dharma\"},{\"tel\":\"పరమ తత్త్వం — శ్రీచక్రరాజ నిలయం\",\"roman\":\"The supreme reality and the Srichakra\"}],\"namesKey\":\"lalita\",\"namesAt\":6,\"namesPer\":8,\"namesSecBase\":9},{\"deities\":[\"ganesha\"],\"title\":\"Mahāgaṇapati Sahasranāmāvali\",\"blurb\":\"The thousand names of Mahāgaṇapati, recited on their own — no frame, no phalaśruti, just the names.\",\"sections\":[{\"roman\":\"Nāmāvali\",\"deva\":\"नामावली\",\"tel\":\"నామావళి\"}],\"namesKey\":\"ganesha\",\"namesAt\":0,\"namesSecBase\":0},{\"deities\":[\"devi\"],\"title\":\"Lalitā Sahasranāmāvali\",\"blurb\":\"The thousand names of Lalitā, recited on their own — no frame, no phalaśruti, just the names.\",\"sections\":[{\"roman\":\"Nāmāvali\",\"deva\":\"नामावली\",\"tel\":\"నామావళి\"}],\"namesKey\":\"lalita\",\"namesAt\":0,\"namesSecBase\":0},{\"deities\":[\"vishnu\"],\"title\":\"Viṣṇu Sahasranāmāvali\",\"blurb\":\"The thousand names of Viṣṇu, recited on their own — no frame, no phalaśruti, just the names.\",\"sections\":[{\"roman\":\"Nāmāvali\",\"deva\":\"नामावली\",\"tel\":\"నామావళి\"}],\"namesKey\":\"vishnu\",\"namesAt\":0,\"namesSecBase\":0}]");

/* Attach the full texts to the library pool built by stuti-data.js.
   Every verse carries: deva (source of truth) · iast · en · tel (తెలుగు అర్థం)
   · s (section index) · n (verse number). A sahasranāma's name-verses are
   grouped out of the nāmāvali at load, so the thousand names live once and
   can be read either as verses or as a glossary. */
/* The binding pass, kept as a function so a body that arrives later is bound
   the same way the eager pass bound its head (see stuti-bundled.ts). */
var ATTACH: any = null;
export const STUTI_ATTACH = function (t: any) { if (ATTACH) ATTACH(t); };
(function () {
  var S = STUTI; if (!S || !STUTI_TEXTS) return;
  var norm = function (s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, ""); };
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; };
  /* Nyāsa — karanyāsa, aṅganyāsa, pūrvanyāsa — places the mantra on the hands
     and the body. Every sahasranāma carries one, and all of it belongs to japa
     performed as a rite; pāṭhana does not need it. Flagged at load, in one
     place and by what the heading names, so a text keyed later is covered
     without anyone remembering to add it. */
  var RITUAL = /ny[\u0101a]sa|dig-?bandha/i;
  function nameVerses(t) {
    var N = STUTI_NAMES && STUTI_NAMES[t.namesKey];
    if (!N) return [];
    var per = t.namesPer || 8, out = [];
    var joinIast = function (arr) { return arr.map(function (x, k) { return k ? lc(x.iast) : x.iast; }).join(" "); };
    var joinDeva = function (arr) { return arr.map(function (x) { return x.deva; }).join(" "); };
    /* The nāmāvali IS the metrical text: the names concatenated form anuṣṭubh
       ślokas — two lines of sixteen syllables. Chunking by name count broke
       mid-śloka for anyone who knows the chant; counting syllables recovers
       the traditional boundaries (…bisatantutanīyasī ॥ bhavānī bhāvanāgamyā…).
       One stanza = one śloka, split into its two 16-syllable lines. Group
       (section) boundaries in the registry fall on śloka boundaries, so
       chunking within each group and by metre agree. No number is shown. */
    var syl = function (s) { return ((s || "").match(/[aāiīuūeoṛṝḷ]+/gi) || []).length; };
    var runs = (N.groups && N.groups.length)
      ? N.groups.map(function (g) { return N.names.filter(function (x) { return x.n >= g.from && x.n <= g.to; }); })
      : [N.names];
    /* When the source registry carries canonical per-śloka boundaries (keyed
       from the actual chanted stotra's daṇḍa numbers, not guessed), cut
       there — hard boundaries, no metre heuristic. Falls back to the metre
       DP only for a sahasranāma with no stotra-form source yet keyed. */
    var hasHard = N.slokaCounts && N.slokaCounts.length;
    runs.forEach(function (names, gi) {
      var sec = (N.groups && N.groups.length) ? t.namesSecBase + gi : t.namesSecBase;
      var n = names.length;
      if (hasHard) {
        var idx0 = names[0].n - 1, from = 0;
        for (var si = 0; si < N.slokaCounts.length && from < n; si++) {
          var skFrom = 0; for (var q = 0; q < si; q++) skFrom += N.slokaCounts[q];
          var skTo = skFrom + N.slokaCounts[si];
          if (skTo <= idx0 || skFrom >= idx0 + n) continue;
          var lo = Math.max(skFrom, idx0) - idx0, hi = Math.min(skTo, idx0 + n) - idx0;
          if (lo >= hi) continue;
          var g = names.slice(lo, hi);
          var l1 = N.slokaLine1 ? Math.max(0, Math.min(g.length, N.slokaLine1[si] - (Math.max(skFrom, idx0) - skFrom))) : g.length;
          var a = g.slice(0, l1), b = g.slice(l1);
          out.push({
            deva: [joinDeva(a), joinDeva(b)].filter(Boolean).join("\n"),
            iast: [joinIast(a), joinIast(b)].filter(Boolean).join("\n"),
            en: g.map(function (x) { return x.me; }).filter(Boolean).join(" · "),
            tel: g.map(function (x) { return x.mt; }).filter(Boolean).join(" · "),
            s: sec, n: g[0].n + "–" + g[g.length - 1].n, nama: true, pr: true,
          });
        }
        return;
      }
      /* Metre-DP fallback: the canon holds half-ślokas and nāmāvali forms
         drift from chanted sandhi, so a global partition picks stanza cuts
         (32-syllable śloka or 16-syllable half-śloka) minimizing total
         deviation — no greedy cascade, nothing over 40 syllables. */
      var cum = [0], c = 0;
      names.forEach(function (x) { c += syl(x.iast); cum.push(c); });
      var cost = function (L) {
        if (L > 40 || L < 3) return Infinity;
        return Math.min(Math.abs(L - 32), Math.abs(L - 16) + 2);
      };
      var dp = [0], back = [0];
      for (var i = 1; i <= n; i++) {
        dp[i] = Infinity; back[i] = i - 1;
        for (var j = Math.max(0, i - 12); j < i; j++) {
          var v = dp[j] + cost(cum[i] - cum[j]);
          if (v < dp[i]) { dp[i] = v; back[i] = j; }
        }
        if (dp[i] === Infinity) { dp[i] = dp[i - 1] + 99; back[i] = i - 1; }
      }
      var cuts = [n]; for (var p = n; p > 0; p = back[p]) cuts.push(back[p]);
      cuts.reverse();
      for (var s2 = 0; s2 < cuts.length - 1; s2++) {
        var g2 = names.slice(cuts[s2], cuts[s2 + 1]);
        if (!g2.length) continue;
        var tot = cum[cuts[s2 + 1]] - cum[cuts[s2]];
        var a2 = g2, b2 = [];
        if (tot > 20 && g2.length > 1) {
          var c2 = 0, bestJ = 1, bj = Infinity;
          for (var j2 = 1; j2 < g2.length; j2++) {
            c2 += syl(g2[j2 - 1].iast);
            var dj = Math.abs(c2 - tot / 2);
            if (dj < bj) { bj = dj; bestJ = j2; }
          }
          a2 = g2.slice(0, bestJ); b2 = g2.slice(bestJ);
        }
        out.push({
          deva: [joinDeva(a2), joinDeva(b2)].filter(Boolean).join("\n"),
          iast: [joinIast(a2), joinIast(b2)].filter(Boolean).join("\n"),
          en: g2.map(function (x) { return x.me; }).filter(Boolean).join(" · "),
          tel: g2.map(function (x) { return x.mt; }).filter(Boolean).join(" · "),
          s: sec, n: g2[0].n + "–" + g2[g2.length - 1].n, nama: true, pr: true,
        });
      }
    });
    return out;
  }
  ATTACH = function (t) {
    var verses = t.verses;
    if (t.sections) t.sections.forEach(function (s) { if (RITUAL.test(s.roman || "")) s.ritual = true; });
    if (t.namesKey && t.namesAt != null && verses) {
      var gen = nameVerses(t);
      if (gen.length) verses = verses.slice(0, t.namesAt).concat(gen, verses.slice(t.namesAt));
    }
    /* Which verses are name-ślokas. The reader prints "373–383" under the verse
       number, and only a name-śloka has such a range — a phalaśruti verse also
       numbered 12 has none. Recognised by the section the verse sits in, whose
       heading is either the registry's own group label (Viṣṇu) or names itself
       as the thousand (Gaṇapati), so nothing is keyed verse by verse. */
    if (t.namesKey) {
      var NR = STUTI_NAMES && STUTI_NAMES[t.namesKey], lbl = {};
      if (NR) (NR.groups || []).forEach(function (g) { lbl[norm(g.roman)] = 1; });
      var nmSec = {};
      (t.sections || []).forEach(function (s, i) {
        if (lbl[norm(s.roman)] || norm(s.roman).indexOf("thousandnames") >= 0) nmSec[i] = 1;
      });
      (verses || []).forEach(function (v) { if (nmSec[v.s] && v.n) v.nm = true; });
    }
    t.deities.forEach(function (d) {
      var h = S.hymns.find(function (x) { return x.deity === d && norm(x.title) === norm(t.title); });
      if (!h) return;
      if (verses) h.verses = verses;
      h.sections = t.sections; h.catalog = false;
      delete h._ritual;   // STUTI_RITUAL caches on the hymn, and the verses are new
      if (t.blurb) h.blurb = t.blurb;
      if (t.about) h.about = t.about;
      if (t.colophon) h.colophon = t.colophon;
      if (t.namesKey) h.namesKey = t.namesKey;
      if (t.occasions) h.occasions = t.occasions;
    });
  };
  /* the heads, now: every blurb, section heading and catalog flag is right at
     first paint, and only the verses are still to come */
  STUTI_TEXTS.concat(STUTI_TEXTS_EXTRA || []).forEach(ATTACH);
})();

/* The verse indices a hymn's ritual sections cover — a Set, or null for the
   great majority of texts, which have no nyāsa at all. Cached on the hymn. */
export const STUTI_RITUAL = function (h) {
  if (!h || !h.verses || !h.sections) return null;
  if (h._ritual !== undefined) return h._ritual;
  var set = null;
  h.verses.forEach(function (v, i) {
    var s = v.s != null ? h.sections[v.s] : null;
    if (s && s.ritual) { if (!set) set = new Set(); set.add(i); }
  });
  h._ritual = set;
  return set;
};

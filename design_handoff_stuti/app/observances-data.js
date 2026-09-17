/* ============================================================
   AKSHARA — Observance content (festivals + vrathams)
   Telugu Smārta practice, with pan-Indian notes where they differ.
   Attaches to window.AKSHARA_OBSERVANCES.

   These are CAREFUL, widely-accepted versions for review — regional
   families differ in detail; treat as a respectful starting point,
   not a ruling. Each `stotras` id must exist in AKSHARA_DATA.stotras.
   ============================================================ */
window.AKSHARA_OBSERVANCES = (function () {

  /* A fully-authored guide has: tagline, significance[], story (optional),
     timeline[] (when & how — wake/bathe/saṅkalpa), samagri[] (items),
     vidhi[] {step,detail}, naivedya[] {item,note}, stotras[] (ids),
     dos[], donts[]. Festivals without these render a graceful stub. */

  const festivals = {

    /* ---------------- DĪPĀVALĪ ---------------- */
    diwali: {
      deity: "lakshmi",
      tagline: "The festival of lights — Lakṣmī enters the swept and lamp-lit home.",
      duration: "Five days · Dhanteras to Bhāī Dūj",
      significance: [
        "Dīpāvalī (“a row of lamps”) marks the return of Śrī Rāma to Ayodhyā after fourteen years of exile, the city lit end to end to welcome him.",
        "On the Amāvāsyā night, Lakṣmī — the goddess of fortune and well-being — is said to walk the earth and enter homes that are clean, lit, and open. The lamp is both welcome and invitation.",
        "In the Telugu household the eve is Naraka Caturdaśī, commemorating Kṛṣṇa's slaying of Narakāsura; the abhyaṅga snāna (oil bath) before dawn is its central rite.",
      ],
      timeline: [
        { t: "Naraka Caturdaśī, before sunrise", d: "Rise in the Brāhma muhūrta. Take the abhyaṅga snāna — warm sesame oil massaged in, then a bath with ubṭan — before the sun rises; this is the day's most important act." },
        { t: "Morning", d: "Wear new or clean clothes. Clean and decorate the threshold with muggu (rāngolī) and mango leaves; place lamps at the door, tulasī, and well." },
        { t: "Evening (pradoṣa)", d: "Light the first row of lamps at dusk. Perform Lakṣmī pūjā at the chosen muhūrta — many keep it after sunset on Amāvāsyā." },
        { t: "Night", d: "Keep lamps burning; offer naivedya, distribute sweets, and (where customary) light crackers in moderation." },
      ],
      samagri: [
        "Clay diyas / oil lamps and wicks; sesame or castor oil",
        "Image or idol of Lakṣmī (with Gaṇeśa)",
        "Kumkum, turmeric, akṣata (rice), sandal paste",
        "Fresh flowers — lotus and marigold; mango leaves",
        "New coins or account books (for Lakṣmī–Kubera pūjā)",
        "Naivedya: sweets, fruit, and a lamp of ghee",
      ],
      vidhi: [
        { step: "Śuddhi & saṅkalpa", detail: "Bathe, clean the pūjā place, and state the intention — the day, the deity (Lakṣmī, with Gaṇeśa first), and the wish for the household's welfare." },
        { step: "Gaṇeśa pūjā", detail: "Invoke Gaṇeśa first to remove obstacles, with akṣata, flowers, and a sweet." },
        { step: "Kalaśa & āvāhana", detail: "Set a kalaśa, invoke Lakṣmī, and seat her image; light the lamps in odd numbers." },
        { step: "Ṣoḍaśopacāra", detail: "Offer the sixteen services — āsana, pādya, arghya, snāna, vastra, gandha, puṣpa, dhūpa, dīpa, naivedya — with the Lakṣmī Aṣṭottara." },
        { step: "Dīpa ārādhana", detail: "Wave the lamp, sing the ārati, and circle the home with a lamp so its light reaches every room." },
        { step: "Naivedya & prasāda", detail: "Offer the sweets, then distribute prasāda to all present." },
      ],
      naivedya: [
        { item: "Ariselu / Adhirasam", note: "Jaggery-rice sweet, the signature Telugu Dīpāvalī offering" },
        { item: "Pāyasam", note: "Rice or vermicelli kheer" },
        { item: "Murukku / Chakli", note: "Savoury, made fresh for the festival" },
        { item: "Fruit & ghee lamp", note: "Offered alongside the sweets" },
      ],
      stotras: ["l-ashtalakshmi", "l-ashtottara", "l-chalisa", "l-kamala", "ganesha-pancharatnam"],
      dos: [
        "Take the oil bath before sunrise on Naraka Caturdaśī.",
        "Clean the whole house beforehand — Lakṣmī enters where it is swept and bright.",
        "Light lamps in odd numbers and keep at least one burning through the night.",
        "Give to those in need; share sweets with neighbours.",
      ],
      donts: [
        "Don't leave the house dark on Lakṣmī pūjā night.",
        "Don't gamble or quarrel — the day sets the tone for the year.",
        "Don't burst crackers near lamps, animals, or the elderly; keep it gentle.",
      ],
    },

    /* ---------------- NAVARĀTRI ---------------- */
    navaratri: {
      deity: "devi",
      tagline: "Nine nights to the Mother — Durgā, Lakṣmī, and Sarasvatī in turn.",
      duration: "Nine nights & the tenth day, Vijayadaśamī",
      significance: [
        "Śāradā Navarātri celebrates the Goddess's nine-night battle with Mahiṣāsura, ending in his fall — the victory of dharma over adharma, light over inertia.",
        "The nine nights are kept in three sets of three: Durgā (the fierce, to destroy faults), Lakṣmī (the gracious, to bestow), and Sarasvatī (the wise, to illumine).",
        "In Telugu homes the Bāttukamma and Bommala Koluvu (doll display) traditions flourish; the tenth day, Vijayadaśamī, is auspicious for beginning learning and new ventures.",
      ],
      timeline: [
        { t: "Each morning", d: "Bathe and perform the daily Devī pūjā; light the akhaṇḍa dīpa (unbroken lamp) to burn through the nine days where kept." },
        { t: "Daily alaṅkāra", d: "The Goddess is dressed in a different form each day; offer that day's colour and flower." },
        { t: "Evening", d: "Recite the Devī Māhātmya / Durgā Saptaślokī; women gather for kumkum and songs." },
        { t: "Mahā Navamī", d: "Āyudha pūjā — tools, instruments, and books are honoured and rested." },
        { t: "Vijayadaśamī", d: "Begin a new study or skill at the chosen muhūrta; akṣarābhyāsa for children." },
      ],
      samagri: [
        "Image of Durgā / Devī and a kalaśa",
        "Akhaṇḍa dīpa (lamp kept burning nine days)",
        "Nine days of flowers; kumkum, turmeric",
        "Books, instruments, tools for Āyudha pūjā",
        "Bommala koluvu (doll display) where kept",
        "Naivedya: a different offering each day",
      ],
      vidhi: [
        { step: "Kalaśa sthāpana", detail: "On Pratipadā, establish the kalaśa and invoke the Goddess; light the akhaṇḍa dīpa." },
        { step: "Daily pūjā", detail: "Each day offer that form's alaṅkāra, flowers, and naivedya, with the day's nāma." },
        { step: "Pārāyaṇa", detail: "Read a portion of the Devī Māhātmya daily, completing it across the nine nights." },
        { step: "Āyudha pūjā", detail: "On Navamī, clean and honour tools, vehicles, and books; rest them for the day." },
        { step: "Vijayadaśamī", detail: "Begin learning or new work; offer śamī leaves and seek blessings of elders." },
      ],
      naivedya: [
        { item: "Daily offering", note: "Pongali, pulihora, vada, payasam — a different dish each day" },
        { item: "Sundal", note: "Spiced legumes, the classic Navarātri prasāda" },
        { item: "Kumkum", note: "Distributed to women along with tāmbūla" },
      ],
      stotras: ["mahishasura", "d-saptashloki", "d-argala", "d-kilaka", "d-devikavacham", "d-lalitasahasra", "d-durgachalisa", "d-bhavani"],
      dos: [
        "Keep the akhaṇḍa dīpa lit without interruption where vowed.",
        "Read a portion of the Devī Māhātmya each day.",
        "Honour women, tools, and books — all forms of Śakti.",
        "Begin study or new work on Vijayadaśamī.",
      ],
      donts: [
        "Don't let the akhaṇḍa lamp go out — arrange oil in advance.",
        "Don't begin the pārāyaṇa you can't complete; vow to your capacity.",
        "Avoid anger and harsh speech during the vrata.",
      ],
    },

    /* ---------------- KṚṢṆA JANMĀṢṬAMĪ ---------------- */
    janmashtami: {
      deity: "vishnu",
      tagline: "The midnight birth of Kṛṣṇa — vigil, fasting, and song until the hour.",
      duration: "One night · vigil until midnight",
      significance: [
        "Janmāṣṭamī marks the appearance of Kṛṣṇa, the eighth avatāra of Viṣṇu, born at midnight in the prison of Mathurā to lift the burden of the earth.",
        "It is kept as a fast and a vigil — the devotee waits, as the world waited, for the hour of his birth.",
        "In Telugu homes tiny footprints are drawn from the door to the pūjā room, marking the child Kṛṣṇa's entry into the house.",
      ],
      timeline: [
        { t: "Morning", d: "Bathe, take the saṅkalpa of the fast (upavāsa), and clean the pūjā room. Draw Kṛṣṇa's footprints from the threshold inward." },
        { t: "Through the day", d: "Keep the fast — fruit and milk only, or nirjala by capacity. Recite Kṛṣṇa's names and the Bhāgavata." },
        { t: "Late evening", d: "Prepare the cradle and the naivedya — butter, milk sweets, and the savoury murukku." },
        { t: "Midnight (the birth)", d: "At midnight perform the pūjā, bathe the infant Kṛṣṇa (abhiṣeka), rock the cradle, sing, and break the fast with prasāda." },
      ],
      samagri: [
        "Idol or image of Bāla Kṛṣṇa; a small cradle",
        "Milk, curd, ghee, honey, butter for abhiṣeka",
        "Tulasī leaves (essential for Viṣṇu)",
        "Flowers, peacock feather, flute",
        "Naivedya: butter, milk sweets, fruit",
      ],
      vidhi: [
        { step: "Saṅkalpa & upavāsa", detail: "Take the vow of the fast in the morning, naming the vigil until midnight." },
        { step: "Footprints", detail: "Draw the child's footprints from the door to the altar, welcoming him home." },
        { step: "Midnight abhiṣeka", detail: "At the birth hour bathe the idol in pañcāmṛta (milk, curd, ghee, honey, sugar), then pure water." },
        { step: "Alaṅkāra & cradle", detail: "Dress and adorn the infant, place him in the cradle, and rock it while singing." },
        { step: "Naivedya & pāraṇa", detail: "Offer butter and sweets with tulasī, then break the fast with prasāda." },
      ],
      naivedya: [
        { item: "Butter & misri", note: "Kṛṣṇa's beloved offering" },
        { item: "Seedai / Murukku", note: "Savoury rice fritters made for the night" },
        { item: "Pāyasam", note: "Milk kheer" },
        { item: "Fruit & tulasī", note: "Always with a tulasī leaf for Viṣṇu" },
      ],
      stotras: ["v-krishnashtakam", "v-govindashtakam", "v-mukundamala", "vishnu-sahasranama", "v-purushasukta", "v-dashavatara"],
      dos: [
        "Keep the vigil and fast to your capacity — even fruit and milk suffice.",
        "Always offer Viṣṇu with a tulasī leaf.",
        "Perform the main pūjā at the midnight birth hour.",
      ],
      donts: [
        "Don't break the fast before the midnight pūjā.",
        "Don't omit tulasī from the offering.",
        "Don't offer items not permitted on a Viṣṇu fast (e.g. grains, if vowed).",
      ],
    },

    /* ---------------- MAHĀ ŚIVARĀTRI ---------------- */
    shivaratri: {
      deity: "shiva",
      tagline: "The great night of Śiva — kept in vigil, fasting, and the five-fold offering.",
      duration: "One night · four praharas of vigil",
      significance: [
        "Mahā Śivarātri, on the Kṛṣṇa Caturdaśī of Phālguna, is the night Śiva is most easily pleased — kept in fasting, wakefulness, and the rudrābhiṣeka.",
        "Tradition tells of the hunter who, sleepless and hungry through the night, dropped bilva leaves on a liṅga below and was redeemed — the night rewards even unintended devotion.",
        "The vigil is kept through four praharas (watches), each with its own abhiṣeka and round of worship.",
      ],
      timeline: [
        { t: "Morning", d: "Bathe and take the saṅkalpa of the fast and the night-long vigil (jāgaraṇa)." },
        { t: "Through the day", d: "Fast — fruit and milk, or nirjala by capacity. Visit a Śiva temple; chant Oṁ Namaḥ Śivāya." },
        { t: "Four praharas (night)", d: "Perform abhiṣeka in each of the four watches — with milk, curd, ghee, honey, and water — offering bilva leaves throughout." },
        { t: "Dawn", d: "Conclude the vigil, offer the final ārati, and break the fast (pāraṇa) after sunrise." },
      ],
      samagri: [
        "A Śiva liṅga (or image) and abhiṣeka vessel",
        "Bilva (bael) leaves — essential",
        "Milk, curd, ghee, honey, sugar (pañcāmṛta); water",
        "Vibhūti (sacred ash), candana, akṣata",
        "White flowers, dhatūra, lamp",
      ],
      vidhi: [
        { step: "Saṅkalpa & upavāsa", detail: "Vow the fast and the four-prahara vigil in the morning." },
        { step: "Abhiṣeka (each prahara)", detail: "Bathe the liṅga with pañcāmṛta and water in each watch, reciting the Rudram or Pañcākṣara." },
        { step: "Bilva arpaṇa", detail: "Offer bilva leaves (in threes, smooth side down) through the night." },
        { step: "Dhūpa, dīpa, naivedya", detail: "Offer incense, lamp, and naivedya at each round; sing the ārati." },
        { step: "Jāgaraṇa & pāraṇa", detail: "Stay awake chanting through the night; break the fast after sunrise." },
      ],
      naivedya: [
        { item: "Fruit & milk", note: "The fast's permitted foods, also offered" },
        { item: "Thandai", note: "Cooling milk drink kept for the vigil" },
        { item: "Sabudana / sama rice", note: "Fasting dishes where a partial fast is kept" },
      ],
      stotras: ["shiva-tandava", "lingashtakam", "shiva-panchakshara", "s-bilvashtakam", "s-sahasranama", "s-ashtottara", "s-kalabhairava"],
      dos: [
        "Offer bilva leaves — even a single leaf with devotion pleases Śiva.",
        "Keep the vigil through the four watches if you can.",
        "Chant Oṁ Namaḥ Śivāya through the night.",
      ],
      donts: [
        "Don't offer tulasī or ketakī (champak) to Śiva.",
        "Don't break the fast before sunrise / the appointed pāraṇa.",
        "Don't sleep through the night if the jāgaraṇa is vowed.",
      ],
    },
  };

  /* ============================================================
     VRATHAMS — observances vowed and kept, with full procedure.
     `dated` ties to a calendar festival id where one exists.
     ============================================================ */
  const vrathams = [

    /* ---------------- SATYANĀRĀYAṆA VRATAM ---------------- */
    {
      id: "satyanarayana",
      name: "Satyanārāyaṇa Vratam",
      deva: "सत्यनारायण व्रतम्",
      deity: "vishnu",
      seed: "ॐ",
      when: "Any Pūrṇimā, or on a vow fulfilled — Kārtika & Vaiśākha most favoured",
      duration: "Half a day · forenoon to evening",
      tagline: "The vow to Satyanārāyaṇa — Viṣṇu as truth itself — kept on a wish fulfilled.",
      significance: [
        "The Satyanārāyaṇa Vratam is among the most widely kept household vrathams — performed on the fulfilment of a wish, a new home, a marriage, or simply on a Pūrṇimā.",
        "Its kathā (from the Skanda Purāṇa) is read in five chapters, each showing the fruit of keeping — or forgetting — the vow.",
        "Its hallmark is simplicity: it asks no fast and no elaborate samagri, only truthfulness, the reading of the kathā, and the sapāda (one-and-a-quarter) measure of offerings.",
      ],
      timeline: [
        { t: "Forenoon", d: "Bathe, clean the pūjā place, and take the saṅkalpa. Many keep a light fast until the pūjā." },
        { t: "Pūjā (evening preferred)", d: "Perform the pūjā at dusk; invoke Satyanārāyaṇa on a kalaśa with Gaṇeśa and the navagrahas." },
        { t: "Kathā", d: "Read all five chapters of the Satyanārāyaṇa Kathā aloud to the gathered family." },
        { t: "Conclusion", d: "Offer the sapāda-bhakṣya (the one-and-a-quarter prasāda), do the ārati, and distribute prasāda — none should leave without it." },
      ],
      samagri: [
        "Image of Satyanārāyaṇa (Viṣṇu) and a kalaśa",
        "Banana stalks & leaves to frame the maṇḍapa",
        "Sapāda measure (1¼) of: rava/wheat, sugar, ghee, banana, milk",
        "Tulasī leaves, flowers, dhūpa, dīpa",
        "The Satyanārāyaṇa Kathā (five chapters)",
        "Pañcāmṛta; betel, coconut, fruit",
      ],
      vidhi: [
        { step: "Saṅkalpa", detail: "State the day, the deity, and the wish or thanksgiving for which the vrata is kept." },
        { step: "Gaṇeśa & Navagraha", detail: "Worship Gaṇeśa first, then the nine grahas for an unobstructed rite." },
        { step: "Āvāhana & ṣoḍaśopacāra", detail: "Invoke Satyanārāyaṇa on the kalaśa and offer the sixteen services with tulasī." },
        { step: "Kathā śravaṇa", detail: "Read the five chapters of the kathā aloud; all present should listen." },
        { step: "Sapāda naivedya", detail: "Offer the one-and-a-quarter measure of sapāda-bhakṣya (the wheat-rava prasāda)." },
        { step: "Ārati & prasāda", detail: "Conclude with ārati; distribute prasāda to every person present." },
      ],
      naivedya: [
        { item: "Sapāda bhakṣya", note: "Rava/wheat halwa in 1¼ measure — the defining offering" },
        { item: "Pañcāmṛta", note: "Milk, curd, ghee, honey, sugar" },
        { item: "Banana & fruit", note: "Offered with tulasī" },
      ],
      stotras: ["vishnu-sahasranama", "v-purushasukta", "v-ashtottara", "v-mukundamala"],
      dos: [
        "Keep to the truth in word and dealing — the vrata is to Satya itself.",
        "Read all five chapters of the kathā; let all present listen.",
        "Distribute prasāda to everyone — none should be sent away without it.",
      ],
      donts: [
        "Don't skip the kathā — it is the heart of the vrata.",
        "Don't break a promise made during the vrata.",
        "Don't deny the prasāda to anyone who has attended.",
      ],
    },

    /* ---------------- VARALAKṢMĪ VRATAM ---------------- */
    {
      id: "varalakshmi",
      name: "Varalakṣmī Vratam",
      deva: "वरलक्ष्मी व्रतम्",
      deity: "lakshmi",
      seed: "श्रीं",
      dated: "varalakshmi",
      when: "Friday before Śrāvaṇa Pūrṇimā (Aug)",
      duration: "Forenoon · the women's vrata",
      tagline: "Married women worship Lakṣmī, the giver of boons, for the well-being of the home.",
      significance: [
        "Varalakṣmī — Lakṣmī as the bestower of boons (vara) — is worshipped on the Friday before Śrāvaṇa Pūrṇimā, chiefly by married women (suvāsinīs) for the welfare and longevity of the family.",
        "Worshipping Varalakṣmī is held equal to worshipping the Aṣṭalakṣmī — the eight forms of fortune — together.",
        "Its centre is the kalaśa adorned as the Goddess's face, tied with the sacred toraṃ (thread) that the women bind on the wrist.",
      ],
      timeline: [
        { t: "Before dawn", d: "Bathe and wear the nine-yards / festive sari. Clean the pūjā place and draw the muggu." },
        { t: "Forenoon (the muhūrta)", d: "Set and adorn the kalaśa as Varalakṣmī's face; perform the pūjā at the morning muhūrta." },
        { t: "Pūjā", d: "Offer the ṣoḍaśopacāra, read the Varalakṣmī vrata kathā, and tie the toraṃ thread." },
        { t: "Conclusion", d: "Offer naivedya, do the ārati, and give tāmbūla and prasāda to the suvāsinīs." },
      ],
      samagri: [
        "A kalaśa, adorned with a Lakṣmī face / mukhavāḍa",
        "Turmeric, kumkum, akṣata, sandal",
        "Toraṃ — the nine-knot sacred thread",
        "Lotus & other flowers; mango leaves, coconut",
        "Bangles, blouse-piece, tāmbūla for suvāsinīs",
        "Naivedya: sweets and savouries, fruit",
      ],
      vidhi: [
        { step: "Saṅkalpa", detail: "Vow the vrata for the welfare and long life of the family." },
        { step: "Kalaśa sthāpana", detail: "Set the kalaśa on rice, adorn it as the Goddess's face, and invoke Varalakṣmī." },
        { step: "Toraṃ pūjā", detail: "Worship the nine-knot thread and keep it ready to bind." },
        { step: "Ṣoḍaśopacāra", detail: "Offer the sixteen services with the Lakṣmī Aṣṭottara." },
        { step: "Kathā & toraṃ binding", detail: "Read the vrata kathā; tie the toraṃ on the right wrist." },
        { step: "Naivedya & tāmbūla", detail: "Offer naivedya, do the ārati, and give tāmbūla and bāgina to the suvāsinīs." },
      ],
      naivedya: [
        { item: "Pulihora & garelu", note: "Tamarind rice and vada — classic Telugu offering" },
        { item: "Payasam", note: "Sweet kheer" },
        { item: "Kudumulu / sweets", note: "Steamed sweets offered to the Goddess" },
      ],
      stotras: ["l-ashtalakshmi", "l-ashtottara", "l-sahasranama", "l-chalisa", "l-kamala"],
      dos: [
        "Perform at the morning muhūrta where possible.",
        "Invite and honour suvāsinīs with tāmbūla and bāgina.",
        "Keep the toraṃ on until the appointed day.",
      ],
      donts: [
        "Don't remove the toraṃ carelessly — release it with respect.",
        "Don't skip the kathā reading.",
        "Don't begin without the kalaśa properly set and invoked.",
      ],
    },

    /* ---------------- listed, full guide to come ---------------- */
    {
      id: "ekadashi-vratam",
      name: "Ekādaśī Vratam",
      deva: "एकादशी व्रतम्",
      deity: "vishnu",
      seed: "ॐ",
      when: "Eleventh tithi of each fortnight",
      duration: "One day · fast",
      tagline: "The fortnightly fast to Viṣṇu, kept on the eleventh lunar day.",
      stub: true,
      significance: [
        "Ekādaśī, the eleventh tithi of each waxing and waning fortnight, is kept as a fast dedicated to Viṣṇu — twenty-four (or twenty-six) across the year, each with its own name and merit.",
      ],
      stotras: ["vishnu-sahasranama", "v-mukundamala"],
    },
    {
      id: "pradosha-vratam",
      name: "Pradoṣa Vratam",
      deva: "प्रदोष व्रतम्",
      deity: "shiva",
      seed: "ह्रौं",
      when: "Trayodaśī twilight, each fortnight",
      duration: "Evening · the pradoṣa hour",
      tagline: "Worship of Śiva in the twilight of the thirteenth tithi.",
      stub: true,
      significance: [
        "Pradoṣa, the twilight of Trayodaśī, is held especially dear to Śiva; the vrata is kept with an evening abhiṣeka and the lighting of lamps at dusk.",
      ],
      stotras: ["lingashtakam", "shiva-panchakshara"],
    },
    {
      id: "santoshi-vratam",
      name: "Maṅgaḷa Gaurī Vratam",
      deva: "मङ्गळ गौरी व्रतम्",
      deity: "devi",
      seed: "श्रीं",
      when: "Tuesdays of Śrāvaṇa",
      duration: "Forenoon",
      tagline: "Newly-married women worship Gaurī on the Tuesdays of Śrāvaṇa.",
      stub: true,
      significance: [
        "Maṅgaḷa Gaurī is kept by newly-married women on the Tuesdays of Śrāvaṇa for the long life and well-being of their husbands, in the first years of marriage.",
      ],
      stotras: ["d-bhavani", "d-lalitasahasra"],
    },
  ];

  return { festivals, vrathams };
})();

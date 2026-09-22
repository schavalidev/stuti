import { STOTRA_INDEX } from "./stotra-index-data";

/* ============================================================
   STUTI — curated devotional content
   A small, deliberately deep set: the ṣaṇmata six and the Guru, each with a hymn
   whose Sanskrit, transliteration and translation are complete,
   so the reciter can follow along line by line. All texts are
   traditional and in the public domain.
   ============================================================ */
export const STUTI = (function () {

  /* ---- Deities ---- seed = bīja (seed-syllable) · hue drives the per-deity accent ---- */
  const deities = [
    { id: "ganesha",     name: "Gaṇeśa",      deva: "गणेश",      tel: "గణేశ",
      epithet: "Remover of obstacles",
      line: "Invoked first in every beginning — the elephant-faced lord.",
      hue: 14 },   // warm vermilion
    { id: "shiva",       name: "Śiva",        deva: "शिव",       tel: "శివ",
      epithet: "The auspicious one",
      line: "Lord of stillness and the cosmic dance — Mahādeva.",
      hue: 210 },  // ash blue
    { id: "devi",        name: "Devī",        deva: "देवी",      tel: "దేవి",
      epithet: "The Mother, Śakti",
      line: "The Goddess in all her forms — Durgā, Gaurī, the primordial power.",
      hue: 344 },  // crimson rose
    { id: "vishnu",      name: "Viṣṇu",       deva: "विष्णु",    tel: "విష్ణు",
      epithet: "The preserver",
      line: "Sustainer of the worlds — and his sweetness as Kṛṣṇa.",
      hue: 224 },  // deep indigo
    { id: "subrahmanya", name: "Subrahmaṇya", deva: "सुब्रह्मण्य", tel: "సుబ్రహ్మణ్య",
      epithet: "Skanda · Murugan",
      line: "The six-faced commander of the gods, riding the peacock — Guha.",
      hue: 130 },  // peacock green
    { id: "surya",       name: "Sūrya",       deva: "सूर्य",     tel: "సూర్య",
      epithet: "The radiant sun",
      line: "The visible divinity, soul of all that lives — Savitṛ, the Maker of Day.",
      hue: 78 },   // gold
    { id: "guru",        name: "Guru",        deva: "गुरु",      tel: "గురు",
      epithet: "The teacher, the light",
      line: "Brahmā, Viṣṇu and Śiva as one — the preceptor who reveals the supreme.",
      hue: 295 },  // violet
    { id: "hanuman",     name: "Hanumān",     deva: "हनुमान्",   tel: "హనుమాన్",
      epithet: "Añjaneya, the devoted",
      line: "The mighty son of the wind — Rāma's perfect servant, remover of sorrows.",
      hue: 26 },   // saffron
    /* The forefathers are not a deity, but they do hold texts of their own and
       a shelf tile is where a reciter looks for them. They stand on the grids
       like any other niche; `notIshta` only keeps them out of the onboarding
       question, which asks which deity you keep — not a question the pitṛs
       are an answer to. */
    { id: "pitr",        name: "Pitṛ Devatās", deva: "पितृ देवताः", tel: "పితృ దేవతలు",
      epithet: "Pitarulu — the forefathers",
      line: "The dead who have joined the ancestors — fed at the amāvāsyā, named at the śrāddha.",
      hue: 168, notIshta: true },
    /* Three more shelves that hold texts without being an iṣṭa-devatā: the
       rivers, the nine grahas, and the gods who have no shelf of their own. */
    { id: "nadi",        name: "Nadī Devatās", deva: "नदी देवताः", tel: "నదీ దేవతలు",
      epithet: "The river goddesses",
      line: "Gaṅgā, Yamunā, Narmadā and the rest — called into the water before the bath.",
      hue: 192, notIshta: true },
    { id: "navagraha",   name: "Navagrahas",   deva: "नवग्रहाः",  tel: "నవగ్రహాలు",
      epithet: "The nine grahas",
      line: "Sun to Ketu — the nine who govern the times, each with its own kavaca.",
      hue: 262, notIshta: true },
    { id: "itara",       name: "Itara Devatās", deva: "इतर देवताः", tel: "ఇతర దేవతలు",
      epithet: "The other gods",
      line: "Agni, Bhūmi, Dhanvantari, Kubera and others who hold texts but no shelf of their own.",
      hue: 96, notIshta: true },
  ];

  /* ---- Hymns ---- every verse: deva / iast / en. ---- */
  const hymns = [
    {
      id: "vakratunda", deity: "ganesha", title: "Vakratuṇḍa Mahākāya", tel: "వక్రతుండ మహాకాయ",
      deva: "वक्रतुण्ड महाकाय", type: "Dhyāna-śloka", by: "Traditional invocation",
      blurb: "The single verse spoken before every undertaking, that all may begin unobstructed.",
      verses: [
        { deva: "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
          iast: "vakratuṇḍa mahākāya sūrya-koṭi-samaprabha |\nnirvighnaṁ kuru me deva sarva-kāryeṣu sarvadā ||",
          en: "O curved-trunked and mighty one, radiant as ten million suns — make all my undertakings free of obstacles, always, O Lord." },
      ],
    },
    {
      id: "shiva-panchakshara", deity: "shiva", title: "Śiva Pañcākṣara Stotra", tel: "శివ పంచాక్షర స్తోత్రం",
      deva: "शिवपञ्चाक्षरस्तोत्रम्", type: "Stotra", by: "Ādi Śaṅkarācārya",
      blurb: "A verse for each syllable of the five-fold mantra — na · ma · śi · vā · ya.",
      verses: [
        { deva: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय॥",
          iast: "nāgendra-hārāya tri-locanāya bhasmāṅga-rāgāya maheśvarāya |\nnityāya śuddhāya digambarāya tasmai na-kārāya namaḥ śivāya ||",
          en: "To him garlanded with the king of serpents, the three-eyed great Lord smeared with ash; eternal, pure, clad in the directions — to that syllable ‘na’, salutations to Śiva." },
        { deva: "मन्दाकिनीसलिलचन्दनचर्चिताय नन्दीश्वरप्रमथनाथमहेश्वराय।\nमन्दारपुष्पबहुपुष्पसुपूजिताय तस्मै मकाराय नमः शिवाय॥",
          iast: "mandākinī-salila-candana-carcitāya nandīśvara-pramatha-nātha-maheśvarāya |\nmandāra-puṣpa-bahu-puṣpa-supūjitāya tasmai ma-kārāya namaḥ śivāya ||",
          en: "To him anointed with Ganges water and sandal, Lord of Nandī and the gaṇas, worshipped with mandāra and many flowers — to that syllable ‘ma’, salutations to Śiva." },
        { deva: "शिवाय गौरीवदनाब्जवृन्दसूर्याय दक्षाध्वरनाशकाय।\nश्रीनीलकण्ठाय वृषध्वजाय तस्मै शिकाराय नमः शिवाय॥",
          iast: "śivāya gaurī-vadanābja-vṛnda-sūryāya dakṣādhvara-nāśakāya |\nśrī-nīlakaṇṭhāya vṛṣa-dhvajāya tasmai śi-kārāya namaḥ śivāya ||",
          en: "To Śiva, sun to the lotus-face of Gaurī, destroyer of Dakṣa’s sacrifice, the blue-throated whose banner bears the bull — to that syllable ‘śi’, salutations to Śiva." },
        { deva: "वसिष्ठकुम्भोद्भवगौतमार्यमुनीन्द्रदेवार्चितशेखराय।\nचन्द्रार्कवैश्वानरलोचनाय तस्मै वकाराय नमः शिवाय॥",
          iast: "vasiṣṭha-kumbhodbhava-gautamārya-munīndra-devārcita-śekharāya |\ncandrārka-vaiśvānara-locanāya tasmai va-kārāya namaḥ śivāya ||",
          en: "To him whose crown the sages Vasiṣṭha, Agastya and Gautama and the gods adore, whose eyes are moon, sun and fire — to that syllable ‘va’, salutations to Śiva." },
        { deva: "यक्षस्वरूपाय जटाधराय पिनाकहस्ताय सनातनाय।\nदिव्याय देवाय दिगम्बराय तस्मै यकाराय नमः शिवाय॥",
          iast: "yakṣa-svarūpāya jaṭā-dharāya pināka-hastāya sanātanāya |\ndivyāya devāya digambarāya tasmai ya-kārāya namaḥ śivāya ||",
          en: "To him in the form of a yakṣa, bearing matted locks, the trident in hand, eternal; the shining god clad in the directions — to that syllable ‘ya’, salutations to Śiva." },
      ],
    },
    {
      id: "sarva-mangala", deity: "devi", title: "Sarva Maṅgala Māṅgalye", tel: "సర్వమంగళ మాంగళ్యే",
      deva: "सर्वमङ्गलमाङ्गल्ये", type: "Dhyāna-śloka", by: "Devī Māhātmya",
      blurb: "The Mother as the auspiciousness within all that is auspicious — a verse of refuge.",
      verses: [
        { deva: "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥",
          iast: "sarva-maṅgala-māṅgalye śive sarvārtha-sādhike |\nśaraṇye tryambake gauri nārāyaṇi namo’stu te ||",
          en: "O auspiciousness of all that is auspicious, O Śivā, fulfiller of every aim; O refuge, three-eyed Gaurī, Nārāyaṇī — salutations to you." },
      ],
    },
    {
      id: "madhurashtakam", deity: "vishnu", title: "Madhurāṣṭakam", tel: "మధురాష్టకం",
      deva: "मधुराष्टकम्", type: "Aṣṭakam", by: "Vallabhācārya",
      blurb: "Adharaṁ madhuram — all of Kṛṣṇa, from his lips to his every gesture, is sweetness.",
      verses: [
        { deva: "अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम्।\nहृदयं मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "adharaṁ madhuraṁ vadanaṁ madhuraṁ nayanaṁ madhuraṁ hasitaṁ madhuram |\nhṛdayaṁ madhuraṁ gamanaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet his lips, sweet his face, sweet his eyes, sweet his smile; sweet his heart, sweet his gait — all of the Lord of sweetness is sweet." },
        { deva: "वचनं मधुरं चरितं मधुरं वसनं मधुरं वलितं मधुरम्।\nचलितं मधुरं भ्रमितं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "vacanaṁ madhuraṁ caritaṁ madhuraṁ vasanaṁ madhuraṁ valitaṁ madhuram |\ncalitaṁ madhuraṁ bhramitaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet his speech, sweet his deeds, sweet his garb, sweet his bearing; sweet his walk, sweet his wandering — all of the Lord of sweetness is sweet." },
        { deva: "वेणुर्मधुरो रेणुर्मधुरः पाणिर्मधुरः पादौ मधुरौ।\nनृत्यं मधुरं सख्यं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "veṇur madhuro reṇur madhuraḥ pāṇir madhuraḥ pādau madhurau |\nnṛtyaṁ madhuraṁ sakhyaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet his flute, sweet the dust of his feet, sweet his hands, sweet his feet; sweet his dance, sweet his friendship — all of the Lord of sweetness is sweet." },
        { deva: "गीतं मधुरं पीतं मधुरं भुक्तं मधुरं सुप्तं मधुरम्।\nरूपं मधुरं तिलकं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "gītaṁ madhuraṁ pītaṁ madhuraṁ bhuktaṁ madhuraṁ suptaṁ madhuram |\nrūpaṁ madhuraṁ tilakaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet his song, sweet his drinking, sweet his eating, sweet his sleeping; sweet his form, sweet his tilaka — all of the Lord of sweetness is sweet." },
        { deva: "करणं मधुरं तरणं मधुरं हरणं मधुरं रमणं मधुरम्।\nवमितं मधुरं शमितं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "karaṇaṁ madhuraṁ taraṇaṁ madhuraṁ haraṇaṁ madhuraṁ ramaṇaṁ madhuram |\nvamitaṁ madhuraṁ śamitaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet his acts, sweet his rescue, sweet his stealing, sweet his delight; sweet his subduing, sweet his soothing — all of the Lord of sweetness is sweet." },
        { deva: "गुञ्जा मधुरा माला मधुरा यमुना मधुरा वीची मधुरा।\nसलिलं मधुरं कमलं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "guñjā madhurā mālā madhurā yamunā madhurā vīcī madhurā |\nsalilaṁ madhuraṁ kamalaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet his beads, sweet his garland, sweet the Yamunā, sweet her waves; sweet the water, sweet the lotus — all of the Lord of sweetness is sweet." },
        { deva: "गोपी मधुरा लीला मधुरा युक्तं मधुरं मुक्तं मधुरम्।\nदृष्टं मधुरं शिष्टं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "gopī madhurā līlā madhurā yuktaṁ madhuraṁ muktaṁ madhuram |\ndṛṣṭaṁ madhuraṁ śiṣṭaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet the gopī, sweet his play, sweet his union, sweet his parting; sweet his glance, sweet his grace — all of the Lord of sweetness is sweet." },
        { deva: "गोपा मधुरा गावो मधुरा यष्टिर्मधुरा सृष्टिर्मधुरा।\nदलितं मधुरं फलितं मधुरं मधुराधिपतेरखिलं मधुरम्॥",
          iast: "gopā madhurā gāvo madhurā yaṣṭir madhurā sṛṣṭir madhurā |\ndalitaṁ madhuraṁ phalitaṁ madhuraṁ madhurādhipater akhilaṁ madhuram ||",
          en: "Sweet the cowherds, sweet the cows, sweet his staff, sweet his creation; sweet his crushing, sweet his fruit — all of the Lord of sweetness is sweet." },
      ],
    },
    {
      id: "shanmukha", deity: "subrahmanya", title: "Ṣaḍānanaṁ Śaraṇam", tel: "షడాననం శరణం",
      deva: "षडाननं शरणम्", type: "Dhyāna-śloka", by: "Traditional invocation",
      blurb: "Refuge in the six-faced Guha, red as kumkuma, riding the divine peacock.",
      verses: [
        { deva: "षडाननं कुङ्कुमरक्तवर्णं महामतिं दिव्यमयूरवाहनम्।\nरुद्रस्य सूनुं सुरसैन्यनाथं गुहं सदाहं शरणं प्रपद्ये॥",
          iast: "ṣaḍānanaṁ kuṅkuma-rakta-varṇaṁ mahā-matiṁ divya-mayūra-vāhanam |\nrudrasya sūnuṁ sura-sainya-nāthaṁ guhaṁ sadāhaṁ śaraṇaṁ prapadye ||",
          en: "The six-faced one, red as kumkuma, of great wisdom, borne by the divine peacock; son of Rudra, commander of the army of the gods — in Guha I ever take refuge." },
      ],
    },
    {
      id: "sarasvati-vandana", deity: "devi", title: "Sarasvatī Vandanā", tel: "సరస్వతీ వందన",
      deva: "सरस्वतीवन्दना", type: "Vandanā", by: "Traditional",
      blurb: "Yā kundendu — the white Goddess on the lotus, recited before study and music.",
      verses: [
        { deva: "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।\nया ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा वन्दिता\nसा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥",
          iast: "yā kundendu-tuṣāra-hāra-dhavalā yā śubhra-vastrāvṛtā\nyā vīṇā-vara-daṇḍa-maṇḍita-karā yā śveta-padmāsanā |\nyā brahmācyuta-śaṅkara-prabhṛtibhir devaiḥ sadā vanditā\nsā māṁ pātu sarasvatī bhagavatī niḥśeṣa-jāḍyāpahā ||",
          en: "She white as jasmine, the moon and frost-garlands, robed in spotless white; her hand graced with the vīṇā, seated on the white lotus; she whom Brahmā, Viṣṇu, Śiva and all the gods forever adore — may that Goddess Sarasvatī, remover of all dullness, protect me." },
      ],
    },
    {
      id: "surya-dhyana", deity: "surya", title: "Japākusuma Saṅkāśam", tel: "జపాకుసుమ సంకాశం",
      deva: "जपाकुसुमसङ्काशम्", type: "Dhyāna-śloka", by: "Traditional invocation",
      blurb: "The dawn salutation to the Sun — radiant as the hibiscus, foe of all darkness.",
      verses: [
        { deva: "जपाकुसुमसङ्काशं काश्यपेयं महाद्युतिम्।\nतमोथरिं सर्वपापघ्नं प्रणतोथस्मि दिवाकरम्॥",
          iast: "japākusuma-saṅkāśaṁ kāśyapeyaṁ mahā-dyutim |\ntamo'riṁ sarva-pāpa-ghnaṁ praṇato'smi divākaram ||",
          en: "Radiant as the hibiscus flower, son of Kaśyapa, of vast brilliance; foe of darkness, destroyer of all sins — I bow to the Maker of Day." },
      ],
    },
    {
      id: "guru-stotram", deity: "guru", title: "Guru Stotram", tel: "గురు స్తోత్రం",
      deva: "गुरुस्तोत्रम्", type: "Stotra", by: "Guru Gītā",
      blurb: "Gurur brahmā — the verse that beholds Brahmā, Viṣṇu and Śiva in the preceptor.",
      verses: [
        { deva: "गुरुर्ब्रह्मा गुरुर्विष्णुर्गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परब्रह्म तस्मै श्रीगुरवे नमः॥",
          iast: "gurur brahmā gurur viṣṇur gurur devo maheśvaraḥ |\nguruḥ sākṣāt para-brahma tasmai śrī-gurave namaḥ ||",
          en: "The Guru is Brahmā, the Guru is Viṣṇu, the Guru is the great Lord Maheśvara; the Guru is verily the supreme Brahman — to that revered Guru, salutations." },
        { deva: "अखण्डमण्डलाकारं व्याप्तं येन चराचरम्।\nतत्पदं दर्शितं येन तस्मै श्रीगुरवे नमः॥",
          iast: "akhaṇḍa-maṇḍalākāraṁ vyāptaṁ yena carācaram |\ntat-padaṁ darśitaṁ yena tasmai śrī-gurave namaḥ ||",
          en: "By whom this whole unbroken expanse, moving and unmoving, is pervaded; by whom that supreme state is revealed — to that revered Guru, salutations." },
      ],
    },
  ];

  /* The pitṛ texts. Their verses arrive from stuti-text-pitr.js, which binds
     by deity + title, so the catalogue rows have to exist first. */
  hymns.push(
    { id: "pitr-rucistava", deity: "pitr", title: "Rucistava", tel: "రుచిస్తవం",
      deva: "रुचिस्तवः", type: "Stotra", by: "Prajāpati Ruci · Garuḍa Purāṇa", blurb: "", verses: [] },
    { id: "pitr-stotram-ruci", deity: "pitr", title: "Pitṛ Stotram (Ruci-kṛtam)", tel: "పితృ స్తోత్రం (రుచికృతం)",
      deva: "पितृस्तोत्रम् (रुचिकृतम्)", type: "Stotra", by: "Prajāpati Ruci · Garuḍa Purāṇa", blurb: "", verses: [] },
    { id: "pitr-suktam-vajasaneyi", deity: "pitr", title: "Pitṛ Sūktam (Vājasaneyi)", tel: "పితృ సూక్తం (శుక్లయజుర్వేదీయం)",
      deva: "पितृसूक्तम् (शुक्लयजुर्वेदीय)", type: "Sūkta", by: "Vājasaneyi Saṁhitā 19.49–61", blurb: "", verses: [] },
    { id: "pitr-suktam-rigveda", deity: "pitr", title: "Pitṛ Sūktam (Ṛgveda)", tel: "పితృ సూక్తం (ఋగ్వేదీయం)",
      deva: "पितृसूक्तम् (ऋग्वेदीय)", type: "Sūkta", by: "Ṛgveda 10.15 · ṛṣi Śaṅkha Yāmāyana", blurb: "", verses: [] },
    { id: "pitr-stotram-brahma", deity: "pitr", title: "Pitṛ Stotram (Brahma-kṛtam)", tel: "పితృ స్తోత్రం (బ్రహ్మకృతం)",
      deva: "पितृस्तोत्रम् (ब्रह्मकृतम्)", type: "Stotra", by: "Brahmā · Bṛhaddharma Purāṇa", blurb: "", verses: [] },
    /* not a hymn but a rite, and it belongs on the shelf all the same: what a
       reciter needs at the water is a scroll to read from, not a card to read
       about. Its own genre, so it never sorts in among the stotras. */
    { id: "pitr-tarpana-vidhi", deity: "pitr", title: "Pitṛ Tarpaṇa Vidhiḥ", tel: "పితృ తర్పణ విధిః",
      deva: "पितृ तर्पण विधिः", type: "Tarpaṇa", by: "Telugu paddhati · Rajasekharuni Vijay Śarma", blurb: "", verses: [] },
    /* the same genre: the vratam's own order of service, read from while it is
       performed. It opens from the Gaṇeśa Caturthī page. */
    { id: "vinayaka-vrata-vidhi", deity: "ganesha", title: "Śrī Varasiddhi Vināyaka Vratam", tel: "శ్రీ వరసిద్ధి వినాయక వ్రతం",
      deva: "श्री वरसिद्धि विनायक व्रतम्", type: "Vidhi", by: "Smārta paddhati · Telugu country", blurb: "", verses: [] }
  );

  /* ---- Catalog ---- the fuller per-deity list from STOTRA_INDEX.
     Names only (title / deva / tel / author); full verse texts are
     added over time. Marked catalog:true so the UI can show them
     as "text coming soon". Duplicates of the full-text hymns above
     are skipped. ---- */
  const stripDia = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normTitle = s => stripDia((s.split("(")[0] || "")).toLowerCase().replace(/stotram|stotra/g, "").replace(/[^a-z]/g, "");
  const slug = s => stripDia(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  function typeOf(t) {
    const n = stripDia(t).toLowerCase();
    if (n.includes("sahasran")) return "Sahasranāma";
    if (n.includes("ottara") || n.includes("namavali") || n.includes("satanam")) return "Nāmāvali";
    if (n.includes("ashtakam") || n.includes("astakam")) return "Aṣṭakam";
    if (n.includes("pancaratn")) return "Pañcaratna";
    if (n.includes("kavacam")) return "Kavaca";
    if (n.includes("suktam")) return "Sūkta";
    if (n.includes("dandakam")) return "Daṇḍaka";
    if (n.includes("gita")) return "Gītā";
    if (n.includes("upanisad")) return "Upaniṣad";
    if (n.includes("dhyana")) return "Dhyāna-śloka";
    if (n.includes("vatapi ganapatim") || n.includes("mahaganapatim manasa smarami")) return "Kṛti";
    if (n.includes("talam")) return "Tālam";
    return "Stotra";
  }
  /* ---- Forms (aspects) per deity ----
     Each deity's stotras group under named forms. The first form is the
     "principal" and the catch-all for that deity's general stotras (except
     Devī, whose generals fall to "Others"). Names in all three scripts. ---- */
  const FORMS = {
    ganesha: [
      { id: "ganesha",      iast: "Gaṇeśa",       deva: "गणेश",        tel: "గణేశ" },
      { id: "mahaganapati", iast: "Mahāgaṇapati", deva: "महागणपति",     tel: "మహాగణపతి" },
      { id: "vighneshvara", iast: "Vighneśvara",  deva: "विघ्नेश्वर",    tel: "విఘ్నేశ్వర" },
    ],
    shiva: [
      { id: "shiva",         iast: "Śiva",           deva: "शिव",           tel: "శివ" },
      { id: "dakshinamurti", iast: "Dakṣiṇāmūrti",   deva: "दक्षिणामूर्ति", tel: "దక్షిణామూర్తి" },
      { id: "kalabhairava",  iast: "Kālabhairava",   deva: "कालभैरव",       tel: "కాలభైరవ" },
      { id: "nataraja",      iast: "Naṭarāja",       deva: "नटराज",         tel: "నటరాజ" },
      { id: "mrtyunjaya",    iast: "Mṛtyuñjaya",     deva: "मृत्युञ्जय",     tel: "మృత్యుంజయ" },
      { id: "ardhanari",     iast: "Ardhanārīśvara", deva: "अर्धनारीश्वर",  tel: "అర్ధనారీశ్వర" },
    ],
    devi: [
      { id: "durga",     iast: "Durgā",     deva: "दुर्गा",     tel: "దుర్గ" },
      { id: "lakshmi",   iast: "Lakṣmī",    deva: "लक्ष्मी",    tel: "లక్ష్మి" },
      { id: "sarasvati", iast: "Sarasvatī", deva: "सरस्वती",   tel: "సరస్వతి" },
      { id: "lalita",    iast: "Lalitā",    deva: "ललिता",     tel: "లలిత" },
      { id: "annapurna", iast: "Annapūrṇā", deva: "अन्नपूर्णा", tel: "అన్నపూర్ణ" },
      { id: "gauri",     iast: "Gaurī",     deva: "गौरी",       tel: "గౌరి" },
    ],
    vishnu: [
      { id: "narayana",      iast: "Nārāyaṇa",     deva: "नारायण",       tel: "నారాయణ" },
      { id: "krishna",       iast: "Kṛṣṇa",        deva: "कृष्ण",         tel: "కృష్ణ" },
      { id: "rama",          iast: "Rāma",         deva: "राम",           tel: "రామ" },
      { id: "narasimha",     iast: "Narasiṁha",    deva: "नरसिंह",        tel: "నరసింహ" },
      { id: "venkateshvara", iast: "Veṅkaṭeśvara", deva: "वेङ्कटेश्वर",   tel: "వేంకటేశ్వర" },
      { id: "vitthala",      iast: "Viṭṭhala",     deva: "विठ्ठल",        tel: "విఠ్ఠల" },
    ],
    subrahmanya: [
      { id: "subrahmanya", iast: "Subrahmaṇya", deva: "सुब्रह्मण्य", tel: "సుబ్రహ్మణ్య" },
      { id: "skanda",      iast: "Skanda",      deva: "स्कन्द",      tel: "స్కంద" },
      { id: "murugan",     iast: "Murugan",     deva: "मुरुगन्",     tel: "మురుగన్" },
      { id: "shanmukha",   iast: "Ṣaṇmukha",    deva: "षण्मुख",      tel: "షణ్ముఖ" },
    ],
    surya: [
      { id: "surya",     iast: "Sūrya",     deva: "सूर्य",     tel: "సూర్య" },
      { id: "aditya",    iast: "Āditya",    deva: "आदित्य",    tel: "ఆదిత్య" },
      { id: "savitr",    iast: "Savitṛ",    deva: "सवितृ",     tel: "సవిత" },
      { id: "navagraha", iast: "Navagraha", deva: "नवग्रह",    tel: "నవగ్రహ" },
    ],
    guru: [
      { id: "guru",       iast: "Guru",       deva: "गुरु",       tel: "గురు" },
      { id: "dattatreya", iast: "Dattātreya", deva: "दत्तात्रेय", tel: "దత్తాత్రేయ" },
      { id: "anagha",     iast: "Anaghā Devī", deva: "अनघा देवी", tel: "అనఘా దేవి" },
    ],
    hanuman: [
      { id: "hanuman",     iast: "Hanumān",    deva: "हनुमान्",   tel: "హనుమాన్" },
      { id: "panchamukha", iast: "Pañcamukha", deva: "पञ्चमुख",   tel: "పంచముఖ" },
    ],
    nadi: [
      { id: "ganga",   iast: "Gaṅgā",     deva: "गङ्गा",     tel: "గంగా" },
      { id: "yamuna",  iast: "Yamunā",    deva: "यमुना",     tel: "యమునా" },
      { id: "narmada", iast: "Narmadā",   deva: "नर्मदा",     tel: "నర్మదా" },
      { id: "nadi",    iast: "All rivers", deva: "सर्वनद्यः",  tel: "సర్వనదులు" },
    ],
    navagraha: [
      { id: "navagraha", iast: "All nine",   deva: "नवग्रह",     tel: "నవగ్రహాలు" },
      { id: "shani",     iast: "Śani",       deva: "शनि",        tel: "శని" },
      { id: "angaraka",  iast: "Aṅgāraka",   deva: "अङ्गारक",    tel: "అంగారక" },
      { id: "budha",     iast: "Budha",      deva: "बुध",        tel: "బుధ" },
      { id: "brhaspati", iast: "Bṛhaspati",  deva: "बृहस्पति",   tel: "బృహస్పతి" },
      { id: "shukra",    iast: "Śukra",      deva: "शुक्र",      tel: "శుక్ర" },
      { id: "chandra",   iast: "Candra",     deva: "चन्द्र",      tel: "చంద్ర" },
      { id: "rahuketu",  iast: "Rāhu & Ketu", deva: "राहु-केतु", tel: "రాహు, కేతు" },
    ],
  };

  /* keyword → form matcher (title compared with diacritics stripped, lowercased).
     `named` rules tried in order; unmatched fall to `fallback` (the principal),
     or to a synthetic "others" bucket when fallback is null. */
  const FORM_RULES = {
    ganesha: { fallback: "ganesha", named: [
      ["mahaganapati", /mahaganapati/],
      ["vighneshvara", /vighnesvara/],
    ] },
    shiva: { fallback: "shiva", named: [
      ["dakshinamurti", /daksinamurti/],
      ["kalabhairava",  /bhairava/],
      ["nataraja",      /tandava|nataraja/],
      ["mrtyunjaya",    /mrtyunjaya/],
      ["ardhanari",     /ardhanari/],
    ] },
    devi: { fallback: null, named: [
      ["durga",     /mahisasura|mahatmya|saptasati|argala|durga|sarva mangala/],
      ["lakshmi",   /sri suktam|kanakadhara|laksmi/],
      ["sarasvati", /sarasvati|syamala/],
      ["lalita",    /lalita|saundarya|minaksi/],
      ["annapurna", /annapurna/],
      ["gauri",     /gauri|bhavani/],
    ] },
    vishnu: { fallback: "narayana", named: [
      ["krishna",       /krsna|madhura|govinda|mukunda|karnamrta|gita|achyuta/],
      ["rama",          /rama/],
      ["narasimha",     /nrsimha|narasimha|nrisimha/],
      ["venkateshvara", /venkatesvara|venkat/],
      ["vitthala",      /panduranga|vitthala/],
    ] },
    subrahmanya: { fallback: "subrahmanya", named: [
      ["skanda",    /skanda/],
      ["murugan",   /kandar|tiruppugazh|murugan/],
      ["shanmukha", /sanmukha|sadanana/],
    ] },
    surya: { fallback: "surya", named: [
      ["aditya",    /aditya/],
      ["savitr",    /gayatri|savitr/],
      ["navagraha", /navagraha/],
    ] },
    guru: { fallback: "guru", named: [
      ["anagha",     /anagha/],
      ["dattatreya", /dattatreya/],
    ] },
    hanuman: { fallback: "hanuman", named: [
      ["panchamukha", /pancamukha/],
    ] },
    /* Gaṅgā first: the snāna-śloka names every river, and the bath verse belongs
       on Gaṅgā's shelf rather than Yamunā's. */
    nadi: { fallback: "nadi", named: [
      ["ganga",   /ganga|gange/],
      ["yamuna",  /yamuna/],
      ["narmada", /narmada/],
    ] },
    navagraha: { fallback: "navagraha", named: [
      ["shani",     /sani/],
      ["angaraka",  /angaraka|mangala/],
      ["budha",     /budha/],
      ["brhaspati", /brhaspati/],
      ["shukra",    /sukra/],
      ["chandra",   /candra/],
      ["rahuketu",  /rahu|ketu/],
    ] },
  };

  function assignForm(deityId, title) {
    const rules = FORM_RULES[deityId];
    if (!rules) return null;
    const n = stripDia(title || "").toLowerCase();
    for (const [fid, re] of rules.named) if (re.test(n)) return fid;
    return rules.fallback || "others";
  }

  /* A catalogue row is dropped when the curated shelf already carries that
     text, and that comparison ignores anything in brackets: the index's
     "Guru Stotram (Gurur Brahmā)" is the curated "Guru Stotram" under a fuller
     name. Between two index rows the bracket is the whole distinction — the
     Kumāra Stuti spoken by the devas is not the one spoken by the brāhmaṇa —
     so those are compared whole. Compared loosely, the second of such a pair
     is dropped, and a text written for it can then never be read. */
  const curatedKeys = new Set(hymns.map(h => h.deity + "|" + normTitle(h.title)));
  const indexKeys = new Set();
  if (STOTRA_INDEX) {
    STOTRA_INDEX.deities.forEach(d => {
      d.list.forEach(row => {
        const [iast, deva, tel, author] = row;
        if (curatedKeys.has(d.id + "|" + normTitle(iast))) return;
        const key = d.id + "|" + slug(iast);
        if (indexKeys.has(key)) return;
        indexKeys.add(key);
        hymns.push({
          id: d.id + "-" + slug(iast),
          deity: d.id,
          title: iast, deva, tel,
          type: typeOf(iast),
          by: author || "Traditional",
          blurb: "",
          catalog: true,
          verses: [],
        });
      });
    });
  }

  /* tag every hymn (curated + catalog) with its form (aspect) */
  hymns.forEach(h => { h.form = assignForm(h.deity, h.title); });

  /* weekday → deity — drives the day's accent + the lamp's "begin today" */
  const weekday = [
    { en: "Sunday",    deva: "रविवार",    deity: "surya" },
    { en: "Monday",    deva: "सोमवार",    deity: "shiva" },
    { en: "Tuesday",   deva: "मङ्गलवार",  deity: "subrahmanya" },
    { en: "Wednesday", deva: "बुधवार",    deity: "vishnu" },
    { en: "Thursday",  deva: "गुरुवार",   deity: "guru" },
    { en: "Friday",    deva: "शुक्रवार",  deity: "devi" },
    { en: "Saturday",  deva: "शनिवार",    deity: "vishnu" },
  ];

  const deityById = Object.fromEntries(deities.map(d => [d.id, d]));
  const hymnsForDeity = id => hymns.filter(h => h.deity === id);
  const hymnById = id => hymns.find(h => h.id === id);

  /* the ordered forms for a deity, each with a live stotra count; a synthetic
     "Others" is appended only when some stotra matched no named form. */
  function formsForDeity(id) {
    const defs = FORMS[id] || [];
    const list = defs.map(f => ({ ...f, count: hymns.filter(h => h.deity === id && h.form === f.id).length }));
    const others = hymns.filter(h => h.deity === id && h.form === "others").length;
    if (others > 0) list.push({ id: "others", iast: "Others", deva: "अन्य", tel: "ఇతర", count: others });
    return list;
  }

  function today() {
    const w = weekday[new Date().getDay()];
    return { ...w, deity: deityById[w.deity] };
  }

  return { deities, hymns, weekday, deityById, hymnsForDeity, hymnById, today, FORMS, formsForDeity, _corpus: { normTitle, slug, typeOf, assignForm } };
})();

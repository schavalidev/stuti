/* ============================================================
   AKSHARA — Viṣṇu Sahasranāma, STOTRA form (not nāmāvalī)
   Mahābhārata, Anuśāsana Parva. Public domain.

   Continuous ślokas with full sandhi — Pūrva Pīṭhikā (dhyāna,
   the Yudhiṣṭhira–Bhīṣma dialogue, nyāsa/viniyoga, dhyānam),
   the 108 ślokas of the thousand names, and the Uttara Pīṭhikā
   (phalaśruti, the glory of the Lord, and the closing dialogue).

   Devanagari is rendered from the IAST so the runtime
   transliterator can carry it into every sibling script. Each
   entry: { n?, section?, speaker?, deva, iast, en }.
   `n` (1–108) labels only the name-ślokas; pīṭhikā lines are
   left unnumbered. Sandhi is preserved exactly as recited.
   ============================================================ */
(function () {
  const VSN = [

    /* ───────────── PŪRVA PĪṬHIKĀ ───────────── */
    { section: "Pūrva Pīṭhikā · पूर्वपीठिका", n: "",
      deva: "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।\nप्रसन्नवदनं ध्यायेत्सर्वविघ्नोपशान्तये ॥",
      iast: "śuklāmbaradharaṁ viṣṇuṁ śaśivarṇaṁ caturbhujam |\nprasannavadanaṁ dhyāyet sarvavighnopaśāntaye ||",
      en: "For the removal of all obstacles, let one meditate on the white-robed, all-pervading Lord — moon-hued, four-armed, of serene countenance." },

    { n: "",
      deva: "यस्य द्विरदवक्त्राद्याः पारिषद्याः परश्शतम् ।\nविघ्नं निघ्नन्ति सततं विष्वक्सेनं तमाश्रये ॥",
      iast: "yasya dviradavaktrādyāḥ pāriṣadyāḥ paraśśatam |\nvighnaṁ nighnanti satataṁ viṣvaksenaṁ tamāśraye ||",
      en: "I take refuge in Viṣvaksena, whose hundreds of attendants — the elephant-faced and the rest — ever destroy all obstacles." },

    { n: "",
      deva: "व्यासं वसिष्ठनप्तारं शक्तेः पौत्रमकल्मषम् ।\nपराशरात्मजं वन्दे शुकतातं तपोनिधिम् ॥",
      iast: "vyāsaṁ vasiṣṭhanaptāraṁ śakteḥ pautram akalmaṣam |\nparāśarātmajaṁ vande śukatātaṁ taponidhim ||",
      en: "I bow to Vyāsa — great-grandson of Vasiṣṭha, grandson of Śakti, the sinless son of Parāśara, father of Śuka, a treasure-house of austerity." },

    { n: "",
      deva: "व्यासाय विष्णुरूपाय व्यासरूपाय विष्णवे ।\nनमो वै ब्रह्मनिधये वासिष्ठाय नमो नमः ॥",
      iast: "vyāsāya viṣṇurūpāya vyāsarūpāya viṣṇave |\nnamo vai brahmanidhaye vāsiṣṭhāya namo namaḥ ||",
      en: "Salutations to Vyāsa who is the form of Viṣṇu, and to Viṣṇu in the form of Vyāsa; again and again I bow to him of Vasiṣṭha's line, the treasury of sacred knowledge." },

    { n: "",
      deva: "अविकाराय शुद्धाय नित्याय परमात्मने ।\nसदैकरूपरूपाय विष्णवे सर्वजिष्णवे ॥",
      iast: "avikārāya śuddhāya nityāya paramātmane |\nsadaikarūparūpāya viṣṇave sarvajiṣṇave ||",
      en: "To the changeless, pure, eternal Supreme Self — to Viṣṇu, ever of one unvarying form, all-conquering — salutations." },

    { n: "",
      deva: "यस्य स्मरणमात्रेण जन्मसंसारबन्धनात् ।\nविमुच्यते नमस्तस्मै विष्णवे प्रभविष्णवे ॥\nॐ नमो विष्णवे प्रभविष्णवे ॥",
      iast: "yasya smaraṇamātreṇa janmasaṁsārabandhanāt |\nvimucyate namastasmai viṣṇave prabhaviṣṇave ||\noṁ namo viṣṇave prabhaviṣṇave ||",
      en: "Salutations to that almighty Viṣṇu, by the mere remembrance of whom one is freed from the bondage of birth and worldly existence. Oṁ, salutations to Viṣṇu, the all-powerful." },

    { speaker: "Śrī Vaiśampāyana uvāca", n: "",
      deva: "श्रुत्वा धर्मानशेषेण पावनानि च सर्वशः ।\nयुधिष्ठिरः शान्तनवं पुनरेवाभ्यभाषत ॥",
      iast: "śrutvā dharmān aśeṣeṇa pāvanāni ca sarvaśaḥ |\nyudhiṣṭhiraḥ śāntanavaṁ punar evābhyabhāṣata ||",
      en: "Vaiśampāyana said: Having heard all the dharmas and all that sanctifies, Yudhiṣṭhira again addressed Bhīṣma, the son of Śāntanu." },

    { speaker: "Yudhiṣṭhira uvāca", n: "",
      deva: "किमेकं दैवतं लोके किं वाप्येकं परायणम् ।\nस्तुवन्तः कं कमर्चन्तः प्राप्नुयुर्मानवाः शुभम् ॥",
      iast: "kim ekaṁ daivataṁ loke kiṁ vāpyekaṁ parāyaṇam |\nstuvantaḥ kaṁ kam arcantaḥ prāpnuyur mānavāḥ śubham ||",
      en: "Yudhiṣṭhira asked: Who is the one Deity in the world? What is the one supreme refuge? By praising and worshipping whom do men attain to all good?" },

    { n: "",
      deva: "को धर्मः सर्वधर्माणां भवतः परमो मतः ।\nकिं जपन्मुच्यते जन्तुर्जन्मसंसारबन्धनात् ॥",
      iast: "ko dharmaḥ sarvadharmāṇāṁ bhavataḥ paramo mataḥ |\nkiṁ japan mucyate jantur janmasaṁsārabandhanāt ||",
      en: "Of all dharmas, which do you hold to be the highest? By repeating what is a being freed from the bondage of birth and worldly existence?" },

    { speaker: "Śrī Bhīṣma uvāca", n: "",
      deva: "जगत्प्रभुं देवदेवमनन्तं पुरुषोत्तमम् ।\nस्तुवन्नामसहस्रेण पुरुषः सततोत्थितः ॥",
      iast: "jagatprabhuṁ devadevam anantaṁ puruṣottamam |\nstuvan nāmasahasreṇa puruṣaḥ satatotthitaḥ ||",
      en: "Bhīṣma said: Ever steadfast, praising with the thousand names that Lord of the universe, the God of gods, the infinite, the Supreme Being —" },

    { n: "",
      deva: "तमेव चार्चयन्नित्यं भक्त्या पुरुषमव्ययम् ।\nध्यायन्स्तुवन्नमस्यंश्च यजमानस्तमेव च ॥",
      iast: "tam eva cārcayan nityaṁ bhaktyā puruṣam avyayam |\ndhyāyan stuvan namasyaṁś ca yajamānas tam eva ca ||",
      en: "Worshipping, meditating upon, praising, bowing to, and offering oblations to that same imperishable Being with devotion —" },

    { n: "",
      deva: "अनादिनिधनं विष्णुं सर्वलोकमहेश्वरम् ।\nलोकाध्यक्षं स्तुवन्नित्यं सर्वदुःखातिगो भवेत् ॥",
      iast: "anādinidhanaṁ viṣṇuṁ sarvalokamaheśvaram |\nlokādhyakṣaṁ stuvan nityaṁ sarvaduḥkhātigo bhavet ||",
      en: "Ever praising Viṣṇu — without beginning or end, the great Lord of all the worlds, the overseer of the worlds — one transcends all sorrow." },

    { n: "",
      deva: "ब्रह्मण्यं सर्वधर्मज्ञं लोकानां कीर्तिवर्धनम् ।\nलोकनाथं महद्भूतं सर्वभूतभवोद्भवम् ॥",
      iast: "brahmaṇyaṁ sarvadharmajñaṁ lokānāṁ kīrtivardhanam |\nlokanāthaṁ mahadbhūtaṁ sarvabhūtabhavodbhavam ||",
      en: "The protector of the sacred, knower of all dharmas, enhancer of the glory of the worlds, lord of the worlds, the great Being, the source from which all beings arise —" },

    { n: "",
      deva: "एष मे सर्वधर्माणां धर्मोऽधिकतमो मतः ।\nयद्भक्त्या पुण्डरीकाक्षं स्तवैरर्चेन्नरः सदा ॥",
      iast: "eṣa me sarvadharmāṇāṁ dharmo'dhikatamo mataḥ |\nyad bhaktyā puṇḍarīkākṣaṁ stavair arcen naraḥ sadā ||",
      en: "This, in my view, is the highest of all dharmas: that a man should ever worship the lotus-eyed Lord with devotion through hymns of praise." },

    { n: "",
      deva: "परमं यो महत्तेजः परमं यो महत्तपः ।\nपरमं यो महद्ब्रह्म परमं यः परायणम् ॥",
      iast: "paramaṁ yo mahattejaḥ paramaṁ yo mahattapaḥ |\nparamaṁ yo mahadbrahma paramaṁ yaḥ parāyaṇam ||",
      en: "He who is the supreme great effulgence, the supreme great austerity, the supreme great Brahman, the supreme refuge —" },

    { n: "",
      deva: "पवित्राणां पवित्रं यो मङ्गलानां च मङ्गलम् ।\nदैवतं देवतानां च भूतानां योऽव्ययः पिता ॥",
      iast: "pavitrāṇāṁ pavitraṁ yo maṅgalānāṁ ca maṅgalam |\ndaivataṁ devatānāṁ ca bhūtānāṁ yo'vyayaḥ pitā ||",
      en: "He who is the purest of the pure, the most auspicious of the auspicious, the Deity of deities, the imperishable father of all beings —" },

    { n: "",
      deva: "यतः सर्वाणि भूतानि भवन्त्यादियुगागमे ।\nयस्मिंश्च प्रलयं यान्ति पुनरेव युगक्षये ॥",
      iast: "yataḥ sarvāṇi bhūtāni bhavantyādiyugāgame |\nyasmiṁś ca pralayaṁ yānti punar eva yugakṣaye ||",
      en: "From whom all beings arise at the dawn of the age, and into whom they dissolve again at the age's end —" },

    { n: "",
      deva: "तस्य लोकप्रधानस्य जगन्नाथस्य भूपते ।\nविष्णोर्नामसहस्रं मे शृणु पापभयापहम् ॥",
      iast: "tasya lokapradhānasya jagannāthasya bhūpate |\nviṣṇor nāmasahasraṁ me śṛṇu pāpabhayāpaham ||",
      en: "O King, hear from me the thousand names of that Viṣṇu — the foremost of the worlds, the Lord of the universe — names that dispel sin and fear." },

    { n: "",
      deva: "यानि नामानि गौणानि विख्यातानि महात्मनः ।\nऋषिभिः परिगीतानि तानि वक्ष्यामि भूतये ॥",
      iast: "yāni nāmāni gauṇāni vikhyātāni mahātmanaḥ |\nṛṣibhiḥ parigītāni tāni vakṣyāmi bhūtaye ||",
      en: "Those well-known descriptive names of the Great One, sung by the sages — these I shall now declare for your welfare." },

    { section: "Nyāsa · Viniyoga", n: "",
      deva: "ऋषिर्नाम्नां सहस्रस्य वेदव्यासो महामुनिः ।\nछन्दोऽनुष्टुप्तथा देवो भगवान्देवकीसुतः ॥",
      iast: "ṛṣir nāmnāṁ sahasrasya vedavyāso mahāmuniḥ |\nchando'nuṣṭup tathā devo bhagavān devakīsutaḥ ||",
      en: "The seer of this thousand-name hymn is the great sage Vedavyāsa; its metre is Anuṣṭup; its deity is the Lord, the son of Devakī." },

    { n: "",
      deva: "अमृतांशूद्भवो बीजं शक्तिर्देवकीनन्दनः ।\nत्रिसामा हृदयं तस्य शान्त्यर्थे विनियुज्यते ॥",
      iast: "amṛtāṁśūdbhavo bījaṁ śaktir devakīnandanaḥ |\ntrisāmā hṛdayaṁ tasya śāntyarthe viniyujyate ||",
      en: "'Amṛtāṁśūdbhavaḥ' is the seed (bīja); 'Devakīnandanaḥ' is the power (śakti); 'Trisāmā' is the heart — it is employed for the sake of peace." },

    { n: "",
      deva: "विष्णुं जिष्णुं महाविष्णुं प्रभविष्णुं महेश्वरम् ।\nअनेकरूपदैत्यान्तं नमामि पुरुषोत्तमम् ॥",
      iast: "viṣṇuṁ jiṣṇuṁ mahāviṣṇuṁ prabhaviṣṇuṁ maheśvaram |\nanekarūpadaityāntaṁ namāmi puruṣottamam ||",
      en: "I bow to the Supreme Being — Viṣṇu, the victorious, the great Viṣṇu, the all-powerful, the great Lord, the ender of demons of myriad forms." },

    { section: "Dhyānam · ध्यानम्", n: "",
      deva: "क्षीरोदन्वत्प्रदेशे शुचिमणिविलसत्सैकते मौक्तिकानां\nमालाक्लृप्तासनस्थः स्फटिकमणिनिभैर्मौक्तिकैर्मण्डिताङ्गः ।\nशुभ्रैरभ्रैरदभ्रैरुपरिविरचितैर्मुक्तपीयूषवर्षैः\nआनन्दी नः पुनीयादरिनलिनगदाशङ्खपाणिर्मुकुन्दः ॥",
      iast: "kṣīrodanvatpradeśe śucimaṇivilasatsaikate mauktikānāṁ\nmālāklṛptāsanasthaḥ sphaṭikamaṇinibhair mauktikair maṇḍitāṅgaḥ |\nśubhrair abhrair adabhrair upariviracitair muktapīyūṣavarṣaiḥ\nānandī naḥ punīyād arinalinagadāśaṅkhapāṇir mukundaḥ ||",
      en: "On the shore of the Ocean of Milk, on sands gleaming with pure gems, seated on a couch of pearls, his body adorned with crystal-like pearls, while bright boundless clouds shower nectar — may the blissful Mukunda, bearing discus, lotus, mace and conch, purify us." },

    { n: "",
      deva: "भूः पादौ यस्य नाभिर्वियदसुरनिलश्चन्द्रसूर्यौ च नेत्रे\nकर्णावाशाः शिरो द्यौर्मुखमपि दहनो यस्य वास्तेयमब्धिः ।\nअन्तःस्थं यस्य विश्वं सुरनरखगगोभोगिगन्धर्वदैत्यैः\nचित्रं रंरम्यते तं त्रिभुवनवपुषं विष्णुमीशं नमामि ॥",
      iast: "bhūḥ pādau yasya nābhir viyad asuranilaś candrasūryau ca netre\nkarṇāv āśāḥ śiro dyaur mukham api dahano yasya vāsteyam abdhiḥ |\nantaḥsthaṁ yasya viśvaṁ suranarakhagagobhogigandharvadaityaiḥ\ncitraṁ raṁramyate taṁ tribhuvanavapuṣaṁ viṣṇum īśaṁ namāmi ||",
      en: "He whose feet are the earth, navel the sky, breath the wind, eyes the moon and sun, ears the directions, head the heavens, mouth the fire, belly the ocean; within whom the whole universe wondrously sports — to that Viṣṇu, the Lord whose body is the three worlds, I bow." },

    { n: "",
      deva: "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं\nविश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।\nलक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं\nवन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम् ॥",
      iast: "śāntākāraṁ bhujagaśayanaṁ padmanābhaṁ sureśaṁ\nviśvādhāraṁ gaganasadṛśaṁ meghavarṇaṁ śubhāṅgam |\nlakṣmīkāntaṁ kamalanayanaṁ yogibhir dhyānagamyaṁ\nvande viṣṇuṁ bhavabhayaharaṁ sarvalokaikanātham ||",
      en: "I bow to Viṣṇu — serene of form, reclining on the serpent, lotus-naveled, lord of the gods, support of the universe, vast as the sky, dark as a cloud, of auspicious limbs, beloved of Lakṣmī, lotus-eyed, attainable by yogis in meditation, remover of the fear of existence, the one Lord of all." },

    { n: "",
      deva: "मेघश्यामं पीतकौशेयवासं\nश्रीवत्साङ्कं कौस्तुभोद्भासिताङ्गम् ।\nपुण्योपेतं पुण्डरीकायताक्षं\nविष्णुं वन्दे सर्वलोकैकनाथम् ॥",
      iast: "meghaśyāmaṁ pītakauśeyavāsaṁ\nśrīvatsāṅkaṁ kaustubhodbhāsitāṅgam |\npuṇyopetaṁ puṇḍarīkāyatākṣaṁ\nviṣṇuṁ vande sarvalokaikanātham ||",
      en: "Dark as a cloud, clad in yellow silk, marked with the Śrīvatsa, his body radiant with the Kaustubha gem, full of holiness, with long lotus eyes — I bow to Viṣṇu, the one Lord of all the worlds." },

    { n: "",
      deva: "सशङ्खचक्रं सकिरीटकुण्डलं\nसपीतवस्त्रं सरसीरुहेक्षणम् ।\nसहारवक्षःस्थलशोभिकौस्तुभं\nनमामि विष्णुं शिरसा चतुर्भुजम् ॥",
      iast: "saśaṅkhacakraṁ sakirīṭakuṇḍalaṁ\nsapītavastraṁ sarasīruhekṣaṇam |\nsahāravakṣaḥsthalaśobhikaustubhaṁ\nnamāmi viṣṇuṁ śirasā caturbhujam ||",
      en: "Bearing conch and discus, crown and earrings, yellow garment, lotus eyes, necklaces, and the Kaustubha gem shining on his chest — to that four-armed Viṣṇu I bow my head." },

    /* ───────────── STOTRAM — the thousand names ───────────── */
    { section: "Stotram · सहस्रनाम", n: 1,
      deva: "विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः ।\nभूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥",
      iast: "viśvaṁ viṣṇur vaṣaṭkāro bhūtabhavyabhavatprabhuḥ |\nbhūtakṛd bhūtabhṛd bhāvo bhūtātmā bhūtabhāvanaḥ ||",
      en: "The universe; the all-pervading; the sacred utterance of offering; lord of past, present and future; maker, sustainer and very being of all; the Self within all; the nurturer of beings." },

    { n: 2,
      deva: "पूतात्मा परमात्मा च मुक्तानां परमा गतिः ।\nअव्ययः पुरुषः साक्षी क्षेत्रज्ञोऽक्षर एव च ॥",
      iast: "pūtātmā paramātmā ca muktānāṁ paramā gatiḥ |\navyayaḥ puruṣaḥ sākṣī kṣetrajño'kṣara eva ca ||",
      en: "The ever-pure Self; the supreme Self; the highest goal of the liberated; the imperishable; the cosmic person; the witness; the knower of the field; the indestructible." },

    { n: 3,
      deva: "योगो योगविदां नेता प्रधानपुरुषेश्वरः ।\nनारसिंहवपुः श्रीमान्केशवः पुरुषोत्तमः ॥",
      iast: "yogo yogavidāṁ netā pradhānapuruṣeśvaraḥ |\nnārasiṁhavapuḥ śrīmān keśavaḥ puruṣottamaḥ ||",
      en: "Union itself; leader of those who know yoga; lord of matter and spirit; of the man-lion form; possessor of glory; Keśava; the supreme person." },

    { n: 4,
      deva: "सर्वः शर्वः शिवः स्थाणुर्भूतादिर्निधिरव्ययः ।\nसंभवो भावनो भर्ता प्रभवः प्रभुरीश्वरः ॥",
      iast: "sarvaḥ śarvaḥ śivaḥ sthāṇur bhūtādir nidhir avyayaḥ |\nsaṁbhavo bhāvano bhartā prabhavaḥ prabhur īśvaraḥ ||",
      en: "The all; the destroyer; the auspicious; the firm; source of beings; the imperishable treasure; the self-born; the nurturer; the upholder; the origin; the master; the Lord." },

    { n: 5,
      deva: "स्वयंभूः शंभुरादित्यः पुष्कराक्षो महास्वनः ।\nअनादिनिधनो धाता विधाता धातुरुत्तमः ॥",
      iast: "svayaṁbhūḥ śaṁbhur ādityaḥ puṣkarākṣo mahāsvanaḥ |\nanādinidhano dhātā vidhātā dhātur uttamaḥ ||",
      en: "The self-existent; bestower of happiness; the radiant sun; lotus-eyed; of mighty voice; without beginning or end; the sustainer; the ordainer; supreme over all supports." },

    { n: 6,
      deva: "अप्रमेयो हृषीकेशः पद्मनाभोऽमरप्रभुः ।\nविश्वकर्मा मनुस्त्वष्टा स्थविष्ठः स्थविरो ध्रुवः ॥",
      iast: "aprameyo hṛṣīkeśaḥ padmanābho'maraprabhuḥ |\nviśvakarmā manus tvaṣṭā sthaviṣṭhaḥ sthaviro dhruvaḥ ||",
      en: "The immeasurable; lord of the senses; lotus-naveled; lord of the immortals; maker of the universe; the cosmic mind; the fashioner; the most vast; the ancient; the steadfast." },

    { n: 7,
      deva: "अग्राह्यः शाश्वतः कृष्णो लोहिताक्षः प्रतर्दनः ।\nप्रभूतस्त्रिककुब्धाम पवित्रं मङ्गलं परम् ॥",
      iast: "agrāhyaḥ śāśvataḥ kṛṣṇo lohitākṣaḥ pratardanaḥ |\nprabhūtas trikakubdhāma pavitraṁ maṅgalaṁ param ||",
      en: "Ungraspable; eternal; the dark one; the red-eyed; the destroyer; the ever-full; abode of the three regions; the pure; the supreme auspiciousness." },

    { n: 8,
      deva: "ईशानः प्राणदः प्राणो ज्येष्ठः श्रेष्ठः प्रजापतिः ।\nहिरण्यगर्भो भूगर्भो माधवो मधुसूदनः ॥",
      iast: "īśānaḥ prāṇadaḥ prāṇo jyeṣṭhaḥ śreṣṭhaḥ prajāpatiḥ |\nhiraṇyagarbho bhūgarbho mādhavo madhusūdanaḥ ||",
      en: "The ruler; giver of life; the life-breath; the eldest; the best; lord of creatures; the golden-wombed; bearer of the earth; lord of Lakṣmī; slayer of Madhu." },

    { n: 9,
      deva: "ईश्वरो विक्रमी धन्वी मेधावी विक्रमः क्रमः ।\nअनुत्तमो दुराधर्षः कृतज्ञः कृतिरात्मवान् ॥",
      iast: "īśvaro vikramī dhanvī medhāvī vikramaḥ kramaḥ |\nanuttamo durādharṣaḥ kṛtajñaḥ kṛtir ātmavān ||",
      en: "The Lord; the valorous; the wielder of the bow; the wise; valor itself; the all-pervading stride; the unsurpassed; the unassailable; the knower of all done; action itself; the self-possessed." },

    { n: 10,
      deva: "सुरेशः शरणं शर्म विश्वरेताः प्रजाभवः ।\nअहस्संवत्सरो व्यालः प्रत्ययः सर्वदर्शनः ॥",
      iast: "sureśaḥ śaraṇaṁ śarma viśvaretāḥ prajābhavaḥ |\nahassaṁvatsaro vyālaḥ pratyayaḥ sarvadarśanaḥ ||",
      en: "Lord of the gods; the refuge; supreme bliss; seed of the universe; source of beings; the day and the year; the elusive serpent; the ground of conviction; the all-seeing." },

    { n: 11,
      deva: "अजस्सर्वेश्वरः सिद्धः सिद्धिः सर्वादिरच्युतः ।\nवृषाकपिरमेयात्मा सर्वयोगविनिःसृतः ॥",
      iast: "ajas sarveśvaraḥ siddhaḥ siddhiḥ sarvādir acyutaḥ |\nvṛṣākapir ameyātmā sarvayogaviniḥsṛtaḥ ||",
      en: "The unborn; lord of all; the accomplished; attainment itself; source of all; the unfalling; uplifter of dharma; the immeasurable Self; free of every bond." },

    { n: 12,
      deva: "वसुर्वसुमनाः सत्यः समात्मा संमितस्समः ।\nअमोघः पुण्डरीकाक्षो वृषकर्मा वृषाकृतिः ॥",
      iast: "vasur vasumanāḥ satyaḥ samātmā saṁmitas samaḥ |\namoghaḥ puṇḍarīkākṣo vṛṣakarmā vṛṣākṛtiḥ ||",
      en: "The dwelling; pure-minded; truth; even-souled; well-measured; the equal; the never-failing; lotus-eyed; of righteous deeds; of righteous form." },

    { n: 13,
      deva: "रुद्रो बहुशिरा बभ्रुर्विश्वयोनिः शुचिश्रवाः ।\nअमृतः शाश्वतस्थाणुर्वरारोहो महातपाः ॥",
      iast: "rudro bahuśirā babhrur viśvayoniḥ śuciśravāḥ |\namṛtaḥ śāśvatasthāṇur varāroho mahātapāḥ ||",
      en: "The Rudra; the many-headed; the upholder; womb of the universe; of pure renown; the immortal; eternal and firm; of glorious ascent; of great austerity." },

    { n: 14,
      deva: "सर्वगः सर्वविद्भानुर्विष्वक्सेनो जनार्दनः ।\nवेदो वेदविदव्यङ्गो वेदाङ्गो वेदवित्कविः ॥",
      iast: "sarvagaḥ sarvavid bhānur viṣvakseno janārdanaḥ |\nvedo vedavid avyaṅgo vedāṅgo vedavit kaviḥ ||",
      en: "The all-pervading; all-knowing; the radiant; whose hosts face every way; refuge of the people; the Veda; knower of the Veda; the flawless; whose limbs are the Vedas; the seer who knows the Veda." },

    { n: 15,
      deva: "लोकाध्यक्षः सुराध्यक्षो धर्माध्यक्षः कृताकृतः ।\nचतुरात्मा चतुर्व्यूहश्चतुर्दंष्ट्रश्चतुर्भुजः ॥",
      iast: "lokādhyakṣaḥ surādhyakṣo dharmādhyakṣaḥ kṛtākṛtaḥ |\ncaturātmā caturvyūhaś caturdaṁṣṭraś caturbhujaḥ ||",
      en: "Overseer of the worlds, of the gods, of dharma; both the made and the unmade; of fourfold Self; of fourfold manifestation; four-tusked; four-armed." },

    { n: 16,
      deva: "भ्राजिष्णुर्भोजनं भोक्ता सहिष्णुर्जगदादिजः ।\nअनघो विजयो जेता विश्वयोनिः पुनर्वसुः ॥",
      iast: "bhrājiṣṇur bhojanaṁ bhoktā sahiṣṇur jagadādijaḥ |\nanagho vijayo jetā viśvayoniḥ punarvasuḥ ||",
      en: "The luminous; that which is enjoyed; the enjoyer; the forbearing; first-born of the world; the sinless; victory; the conqueror; womb of the universe; dwelling again and again." },

    { n: 17,
      deva: "उपेन्द्रो वामनः प्रांशुरमोघः शुचिरूर्जितः ।\nअतीन्द्रः संग्रहः सर्गो धृतात्मा नियमो यमः ॥",
      iast: "upendro vāmanaḥ prāṁśur amoghaḥ śucir ūrjitaḥ |\natīndraḥ saṁgrahaḥ sargo dhṛtātmā niyamo yamaḥ ||",
      en: "Younger brother of Indra; the dwarf; the towering; the unerring; the pure; the mighty; beyond Indra; the gatherer; creation; the self-held; the rule and the ruler." },

    { n: 18,
      deva: "वेद्यो वैद्यः सदायोगी वीरहा माधवो मधुः ।\nअतीन्द्रियो महामायो महोत्साहो महाबलः ॥",
      iast: "vedyo vaidyaḥ sadāyogī vīrahā mādhavo madhuḥ |\natīndriyo mahāmāyo mahotsāho mahābalaḥ ||",
      en: "The knowable; the healer; ever in union; slayer of heroes; lord of knowledge; the sweet; beyond the senses; master of māyā; of great energy; of great strength." },

    { n: 19,
      deva: "महाबुद्धिर्महावीर्यो महाशक्तिर्महाद्युतिः ।\nअनिर्देश्यवपुः श्रीमानमेयात्मा महाद्रिधृक् ॥",
      iast: "mahābuddhir mahāvīryo mahāśaktir mahādyutiḥ |\nanirdeśyavapuḥ śrīmān ameyātmā mahādridhṛk ||",
      en: "Of great wisdom; great valor; great power; great splendor; of indefinable form; possessor of glory; of immeasurable Self; upholder of the great mountain." },

    { n: 20,
      deva: "महेश्वासो महीभर्ता श्रीनिवासः सतां गतिः ।\nअनिरुद्धः सुरानन्दो गोविन्दो गोविदां पतिः ॥",
      iast: "maheṣvāso mahībhartā śrīnivāsaḥ satāṁ gatiḥ |\naniruddhaḥ surānando govindo govidāṁ patiḥ ||",
      en: "Wielder of the great bow; bearer of the earth; abode of Śrī; refuge of the good; the unobstructed; joy of the gods; Govinda; lord of those who know speech." },

    { n: 21,
      deva: "मरीचिर्दमनो हंसः सुपर्णो भुजगोत्तमः ।\nहिरण्यनाभः सुतपाः पद्मनाभः प्रजापतिः ॥",
      iast: "marīcir damano haṁsaḥ suparṇo bhujagottamaḥ |\nhiraṇyanābhaḥ sutapāḥ padmanābhaḥ prajāpatiḥ ||",
      en: "The ray of light; the subduer; the swan; the fair-winged; best of serpents; the golden-naveled; of noble austerity; lotus-naveled; lord of creatures." },

    { n: 22,
      deva: "अमृत्युः सर्वदृक्सिंहः संधाता संधिमान्स्थिरः ।\nअजो दुर्मर्षणः शास्ता विश्रुतात्मा सुरारिहा ॥",
      iast: "amṛtyuḥ sarvadṛk siṁhaḥ saṁdhātā saṁdhimān sthiraḥ |\najo durmarṣaṇaḥ śāstā viśrutātmā surārihā ||",
      en: "The deathless; the all-seeing lion; the uniter; keeper of union; the firm; the unborn; the unbearable to foes; the teacher; the renowned Self; slayer of the enemies of the gods." },

    { n: 23,
      deva: "गुरुर्गुरुतमो धाम सत्यः सत्यपराक्रमः ।\nनिमिषोऽनिमिषः स्रग्वी वाचस्पतिरुदारधीः ॥",
      iast: "gurur gurutamo dhāma satyaḥ satyaparākramaḥ |\nnimiṣo'nimiṣaḥ sragvī vācaspatir udāradhīḥ ||",
      en: "The teacher; the greatest teacher; the abode; the truth; of true prowess; the closing-eyed and the ever-watchful; the garlanded; lord of speech; of noble intellect." },

    { n: 24,
      deva: "अग्रणीर्ग्रामणीः श्रीमान्न्यायो नेता समीरणः ।\nसहस्रमूर्धा विश्वात्मा सहस्राक्षः सहस्रपात् ॥",
      iast: "agraṇīr grāmaṇīḥ śrīmān nyāyo netā samīraṇaḥ |\nsahasramūrdhā viśvātmā sahasrākṣaḥ sahasrapāt ||",
      en: "The foremost leader; guide of the multitude; possessor of glory; justice; the leader; the mover; thousand-headed; Self of the universe; thousand-eyed; thousand-footed." },

    { n: 25,
      deva: "आवर्तनो निवृत्तात्मा संवृतः संप्रमर्दनः ।\nअहः संवर्तको वह्निरनिलो धरणीधरः ॥",
      iast: "āvartano nivṛttātmā saṁvṛtaḥ saṁpramardanaḥ |\nahaḥ saṁvartako vahnir anilo dharaṇīdharaḥ ||",
      en: "The turner of the wheel; the withdrawn Self; the veiled; the crusher of foes; the bringer of day's close; the fire; the wind; bearer of the earth." },

    { n: 26,
      deva: "सुप्रसादः प्रसन्नात्मा विश्वधृग्विश्वभुग्विभुः ।\nसत्कर्ता सत्कृतः साधुर्जह्नुर्नारायणो नरः ॥",
      iast: "suprasādaḥ prasannātmā viśvadhṛg viśvabhug vibhuḥ |\nsatkartā satkṛtaḥ sādhur jahnur nārāyaṇo naraḥ ||",
      en: "Of perfect grace; of serene Self; upholder of the universe; enjoyer of the universe; the all-pervading; honorer of the good; the honored; the saint; the withdrawer; Nārāyaṇa; the eternal man." },

    { n: 27,
      deva: "असंख्येयोऽप्रमेयात्मा विशिष्टः शिष्टकृच्छुचिः ।\nसिद्धार्थः सिद्धसंकल्पः सिद्धिदः सिद्धिसाधनः ॥",
      iast: "asaṁkhyeyo'prameyātmā viśiṣṭaḥ śiṣṭakṛc chuciḥ |\nsiddhārthaḥ siddhasaṁkalpaḥ siddhidaḥ siddhisādhanaḥ ||",
      en: "The numberless; of immeasurable Self; the most excellent; lawgiver of the good; the pure; of fulfilled purpose; of fulfilled will; giver of attainment; the means of attainment." },

    { n: 28,
      deva: "वृषाही वृषभो विष्णुर्वृषपर्वा वृषोदरः ।\nवर्धनो वर्धमानश्च विविक्तः श्रुतिसागरः ॥",
      iast: "vṛṣāhī vṛṣabho viṣṇur vṛṣaparvā vṛṣodaraḥ |\nvardhano vardhamānaś ca viviktaḥ śrutisāgaraḥ ||",
      en: "Lord of dharma's day; the bull of dharma; the all-pervading; the ladder of dharma; whose belly bears all; the nourisher; the ever-growing; the distinct; ocean of scripture." },

    { n: 29,
      deva: "सुभुजो दुर्धरो वाग्मी महेन्द्रो वसुदो वसुः ।\nनैकरूपो बृहद्रूपः शिपिविष्टः प्रकाशनः ॥",
      iast: "subhujo durdharo vāgmī mahendro vasudo vasuḥ |\nnaikarūpo bṛhadrūpaḥ śipiviṣṭaḥ prakāśanaḥ ||",
      en: "Of beautiful arms; hard to hold; the eloquent; the great Indra; giver of wealth; wealth itself; of manifold forms; of vast form; pervading the rays; the illuminator." },

    { n: 30,
      deva: "ओजस्तेजोद्युतिधरः प्रकाशात्मा प्रतापनः ।\nऋद्धः स्पष्टाक्षरो मन्त्रश्चन्द्रांशुर्भास्करद्युतिः ॥",
      iast: "ojas tejo dyutidharaḥ prakāśātmā pratāpanaḥ |\nṛddhaḥ spaṣṭākṣaro mantraś candrāṁśur bhāskaradyutiḥ ||",
      en: "Bearer of vigor, splendor and radiance; of luminous Self; the burning one; the prosperous; whose syllable (Oṁ) is clear; the sacred mantra; ray of the moon; of the sun's brilliance." },

    { n: 31,
      deva: "अमृतांशूद्भवो भानुः शशबिन्दुः सुरेश्वरः ।\nऔषधं जगतः सेतुः सत्यधर्मपराक्रमः ॥",
      iast: "amṛtāṁśūdbhavo bhānuḥ śaśabinduḥ sureśvaraḥ |\nauṣadhaṁ jagataḥ setuḥ satyadharmaparākramaḥ ||",
      en: "Source of the nectar-rayed moon; the radiant; moon marked with the hare; lord of the gods; the healing herb; bridge across the world; of true dharma and prowess." },

    { n: 32,
      deva: "भूतभव्यभवन्नाथः पवनः पावनोऽनलः ।\nकामहा कामकृत्कान्तः कामः कामप्रदः प्रभुः ॥",
      iast: "bhūtabhavyabhavannāthaḥ pavanaḥ pāvano'nalaḥ |\nkāmahā kāmakṛt kāntaḥ kāmaḥ kāmapradaḥ prabhuḥ ||",
      en: "Lord of past, present and future; the wind; the purifier; the fire; destroyer of desire; fulfiller of desire; the beloved; desire itself; giver of desires; the master." },

    { n: 33,
      deva: "युगादिकृद्युगावर्तो नैकमायो महाशनः ।\nअदृश्यो व्यक्तरूपश्च सहस्रजिदनन्तजित् ॥",
      iast: "yugādikṛd yugāvarto naikamāyo mahāśanaḥ |\nadṛśyo vyaktarūpaś ca sahasrajid anantajit ||",
      en: "Maker of the ages' beginning; the turner of ages; of manifold māyā; the great devourer; the unseen and the manifest; conqueror of thousands; conqueror of the endless." },

    { n: 34,
      deva: "इष्टोऽविशिष्टः शिष्टेष्टः शिखण्डी नहुषो वृषः ।\nक्रोधहा क्रोधकृत्कर्ता विश्वबाहुर्महीधरः ॥",
      iast: "iṣṭo'viśiṣṭaḥ śiṣṭeṣṭaḥ śikhaṇḍī nahuṣo vṛṣaḥ |\nkrodhahā krodhakṛt kartā viśvabāhur mahīdharaḥ ||",
      en: "The beloved; the impartial; dear to the good; the crested; the binder; dharma itself; destroyer of anger; rouser of anger against evil; the doer; whose arms are the universe; bearer of the earth." },

    { n: 35,
      deva: "अच्युतः प्रथितः प्राणः प्राणदो वासवानुजः ।\nअपांनिधिरधिष्ठानमप्रमत्तः प्रतिष्ठितः ॥",
      iast: "acyutaḥ prathitaḥ prāṇaḥ prāṇado vāsavānujaḥ |\napāṁnidhir adhiṣṭhānam apramattaḥ pratiṣṭhitaḥ ||",
      en: "The unfalling; the renowned; the life-breath; giver of life; younger brother of Indra; the ocean of waters; the foundation; the ever-vigilant; the well-established." },

    { n: 36,
      deva: "स्कन्दः स्कन्दधरो धुर्यो वरदो वायुवाहनः ।\nवासुदेवो बृहद्भानुरादिदेवः पुरंदरः ॥",
      iast: "skandaḥ skandadharo dhuryo varado vāyuvāhanaḥ |\nvāsudevo bṛhadbhānur ādidevaḥ puraṁdaraḥ ||",
      en: "The dried-up (Skanda); upholder of dharma's path; the burden-bearer; giver of boons; mover of the winds; Vāsudeva; of vast radiance; the first god; destroyer of the demons' cities." },

    { n: 37,
      deva: "अशोकस्तारणस्तारः शूरः शौरिर्जनेश्वरः ।\nअनुकूलः शतावर्तः पद्मी पद्मनिभेक्षणः ॥",
      iast: "aśokas tāraṇas tāraḥ śūraḥ śaurir janeśvaraḥ |\nanukūlaḥ śatāvartaḥ padmī padmanibhekṣaṇaḥ ||",
      en: "The sorrowless; ferrier across; the saving syllable; the brave; the heroic; lord of beings; the favorable; of a hundred manifestations; bearer of the lotus; lotus-eyed." },

    { n: 38,
      deva: "पद्मनाभोऽरविन्दाक्षः पद्मगर्भः शरीरभृत् ।\nमहर्धिरृद्धो वृद्धात्मा महाक्षो गरुडध्वजः ॥",
      iast: "padmanābho'ravindākṣaḥ padmagarbhaḥ śarīrabhṛt |\nmahardhir ṛddho vṛddhātmā mahākṣo garuḍadhvajaḥ ||",
      en: "Lotus-naveled; lotus-eyed; dwelling in the lotus of the heart; sustainer of bodies; of great prosperity; the increased; the ancient Self; the great-eyed; whose banner is Garuḍa." },

    { n: 39,
      deva: "अतुलः शरभो भीमः समयज्ञो हविर्हरिः ।\nसर्वलक्षणलक्षण्यो लक्ष्मीवान्समितिंजयः ॥",
      iast: "atulaḥ śarabho bhīmaḥ samayajño havir hariḥ |\nsarvalakṣaṇalakṣaṇyo lakṣmīvān samitiṁjayaḥ ||",
      en: "The incomparable; the soul that dwells in the body; the terrible; knower of right time; the oblation; the tawny remover of sins; known by all auspicious marks; possessor of Lakṣmī; victor in battle." },

    { n: 40,
      deva: "विक्षरो रोहितो मार्गो हेतुर्दामोदरः सहः ।\nमहीधरो महाभागो वेगवानमिताशनः ॥",
      iast: "vikṣaro rohito mārgo hetur dāmodaraḥ sahaḥ |\nmahīdharo mahābhāgo vegavān amitāśanaḥ ||",
      en: "The imperishable; the red form (fish); the way; the cause; bound by a cord at his waist; the forbearing; bearer of the earth; of great fortune; the swift; of boundless appetite." },

    { n: 41,
      deva: "उद्भवः क्षोभणो देवः श्रीगर्भः परमेश्वरः ।\nकरणं कारणं कर्ता विकर्ता गहनो गुहः ॥",
      iast: "udbhavaḥ kṣobhaṇo devaḥ śrīgarbhaḥ parameśvaraḥ |\nkaraṇaṁ kāraṇaṁ kartā vikartā gahano guhaḥ ||",
      en: "The origin; the agitator; the resplendent; whose womb is glory; the supreme Lord; the instrument; the cause; the doer; the maker of variety; the unfathomable; the hidden." },

    { n: 42,
      deva: "व्यवसायो व्यवस्थानः संस्थानः स्थानदो ध्रुवः ।\nपरर्धिः परमस्पष्टस्तुष्टः पुष्टः शुभेक्षणः ॥",
      iast: "vyavasāyo vyavasthānaḥ saṁsthānaḥ sthānado dhruvaḥ |\nparardhiḥ paramaspaṣṭas tuṣṭaḥ puṣṭaḥ śubhekṣaṇaḥ ||",
      en: "Resolve; the upholder of order; the dissolution; giver of place; the steadfast; of supreme glory; supremely manifest; the content; the full; of auspicious gaze." },

    { n: 43,
      deva: "रामो विरामो विरजो मार्गोनेयो नयोऽनयः ।\nवीरः शक्तिमतां श्रेष्ठो धर्मो धर्मविदुत्तमः ॥",
      iast: "rāmo virāmo virajo mārgo neyo nayo'nayaḥ |\nvīraḥ śaktimatāṁ śreṣṭho dharmo dharmavid uttamaḥ ||",
      en: "Rāma, in whom yogis delight; the resting-place; the stainless; the path; the guidable; the guide; the unguidable; the hero; best of the powerful; dharma itself; supreme among knowers of dharma." },

    { n: 44,
      deva: "वैकुण्ठः पुरुषः प्राणः प्राणदः प्रणवः पृथुः ।\nहिरण्यगर्भः शत्रुघ्नो व्याप्तो वायुरधोक्षजः ॥",
      iast: "vaikuṇṭhaḥ puruṣaḥ prāṇaḥ prāṇadaḥ praṇavaḥ pṛthuḥ |\nhiraṇyagarbhaḥ śatrughno vyāpto vāyur adhokṣajaḥ ||",
      en: "Lord of Vaikuṇṭha; the cosmic person; the life-breath; giver of life; the sacred Oṁ; the vast; the golden-wombed; slayer of foes; the pervading; the wind; the undecaying." },

    { n: 45,
      deva: "ऋतुः सुदर्शनः कालः परमेष्ठी परिग्रहः ।\nउग्रः संवत्सरो दक्षो विश्रामो विश्वदक्षिणः ॥",
      iast: "ṛtuḥ sudarśanaḥ kālaḥ parameṣṭhī parigrahaḥ |\nugraḥ saṁvatsaro dakṣo viśrāmo viśvadakṣiṇaḥ ||",
      en: "The season; of fair vision; time itself; the supreme abode; the receiver; the terrible; the year; the skilful; the resting-place; the most adept in all." },

    { n: 46,
      deva: "विस्तारः स्थावरस्थाणुः प्रमाणं बीजमव्ययम् ।\nअर्थोऽनर्थो महाकोशो महाभोगो महाधनः ॥",
      iast: "vistāraḥ sthāvarasthāṇuḥ pramāṇaṁ bījam avyayam |\nartho'nartho mahākośo mahābhogo mahādhanaḥ ||",
      en: "The expanse; firm support of all that is fixed; the measure; the imperishable seed; the goal; the desireless; the great treasury; of great enjoyment; of great wealth." },

    { n: 47,
      deva: "अनिर्विण्णः स्थविष्ठो भूर्धर्मयूपो महामखः ।\nनक्षत्रनेमिर्नक्षत्री क्षमः क्षामः समीहनः ॥",
      iast: "anirviṇṇaḥ sthaviṣṭho bhūr dharmayūpo mahāmakhaḥ |\nnakṣatranemir nakṣatrī kṣamaḥ kṣāmaḥ samīhanaḥ ||",
      en: "The undespairing; the most vast; existence; the post of dharma; the great sacrifice; the hub of the stars; lord of the constellations; the capable; the diminisher; the well-wishing." },

    { n: 48,
      deva: "यज्ञ इज्यो महेज्यश्च क्रतुः सत्रं सतां गतिः ।\nसर्वदर्शी विमुक्तात्मा सर्वज्ञो ज्ञानमुत्तमम् ॥",
      iast: "yajña ijyo mahejyaś ca kratuḥ satraṁ satāṁ gatiḥ |\nsarvadarśī vimuktātmā sarvajño jñānam uttamam ||",
      en: "The sacrifice; the worshipped; the most worshipped; the rite; the sacrificial session; refuge of the good; the all-seeing; the ever-free Self; the all-knowing; the highest knowledge." },

    { n: 49,
      deva: "सुव्रतः सुमुखः सूक्ष्मः सुघोषः सुखदः सुहृत् ।\nमनोहरो जितक्रोधो वीरबाहुर्विदारणः ॥",
      iast: "suvrataḥ sumukhaḥ sūkṣmaḥ sughoṣaḥ sukhadaḥ suhṛt |\nmanoharo jitakrodho vīrabāhur vidāraṇaḥ ||",
      en: "Of noble vows; of pleasing face; the subtle; of auspicious sound; giver of joy; the good-hearted friend; the heart-stealer; conqueror of anger; of heroic arms; the render of foes." },

    { n: 50,
      deva: "स्वापनः स्ववशो व्यापी नैकात्मा नैककर्मकृत् ।\nवत्सरो वत्सलो वत्सी रत्नगर्भो धनेश्वरः ॥",
      iast: "svāpanaḥ svavaśo vyāpī naikātmā naikakarmakṛt |\nvatsaro vatsalo vatsī ratnagarbho dhaneśvaraḥ ||",
      en: "The slumber-giver; the self-controlled; the pervading; of many forms; doer of many works; the abode; the affectionate; the loving; whose womb holds jewels; lord of wealth." },

    { n: 51,
      deva: "धर्मगुब्धर्मकृद्धर्मी सदसत्क्षरमक्षरम् ।\nअविज्ञाता सहस्रांशुर्विधाता कृतलक्षणः ॥",
      iast: "dharmagub dharmakṛd dharmī sad asat kṣaram akṣaram |\navijñātā sahasrāṁśur vidhātā kṛtalakṣaṇaḥ ||",
      en: "Guardian of dharma; doer of dharma; sustainer of dharma; the real and the unreal; the perishable and the imperishable; the unknowing (witness); the thousand-rayed; the ordainer; maker of scripture and marks." },

    { n: 52,
      deva: "गभस्तिनेमिः सत्त्वस्थः सिंहो भूतमहेश्वरः ।\nआदिदेवो महादेवो देवेशो देवभृद्गुरुः ॥",
      iast: "gabhastinemiḥ sattvasthaḥ siṁho bhūtamaheśvaraḥ |\nādidevo mahādevo deveśo devabhṛd guruḥ ||",
      en: "Hub of the wheel of rays; seated in goodness; the lion; great Lord of beings; the first god; the great god; lord of the gods; sustainer of the gods; the teacher." },

    { n: 53,
      deva: "उत्तरो गोपतिर्गोप्ता ज्ञानगम्यः पुरातनः ।\nशरीरभूतभृद्भोक्ता कपीन्द्रो भूरिदक्षिणः ॥",
      iast: "uttaro gopatir goptā jñānagamyaḥ purātanaḥ |\nśarīrabhūtabhṛd bhoktā kapīndro bhūridakṣiṇaḥ ||",
      en: "The transcendent; lord of cattle and earth; the protector; attainable by knowledge; the ancient; sustainer of the body's elements; the enjoyer; lord of Hanumān; giver of abundant gifts." },

    { n: 54,
      deva: "सोमपोऽमृतपः सोमः पुरुजित्पुरुसत्तमः ।\nविनयो जयः सत्यसंधो दाशार्हः सात्वतां पतिः ॥",
      iast: "somapo'mṛtapaḥ somaḥ purujit purusattamaḥ |\nvinayo jayaḥ satyasaṁdho dāśārhaḥ sātvatāṁ patiḥ ||",
      en: "Drinker of soma and of nectar; the moon; conqueror of many; best among beings; humility; victory; of true resolve; born in the Daśārha clan; lord of the Sātvatas." },

    { n: 55,
      deva: "जीवो विनयिता साक्षी मुकुन्दोऽमितविक्रमः ।\nअंभोनिधिरनन्तात्मा महोदधिशयोऽन्तकः ॥",
      iast: "jīvo vinayitā sākṣī mukundo'mitavikramaḥ |\naṁbhonidhir anantātmā mahodadhiśayo'ntakaḥ ||",
      en: "The living Self; the disciplinarian; the witness; the giver of liberation; of measureless valor; the ocean of being; the infinite Self; reclining on the great ocean; the ender." },

    { n: 56,
      deva: "अजो महार्हः स्वाभाव्यो जितामित्रः प्रमोदनः ।\nआनन्दोऽनन्दनोनन्दः सत्यधर्मा त्रिविक्रमः ॥",
      iast: "ajo mahārhaḥ svābhāvyo jitāmitraḥ pramodanaḥ |\nānando'nandanonandaḥ satyadharmā trivikramaḥ ||",
      en: "The unborn; the most worthy of worship; ever in his own nature; conqueror of foes; the gladdener; bliss itself; the delighter; the joyous; of true dharma; he of the three strides." },

    { n: 57,
      deva: "महर्षिः कपिलाचार्यः कृतज्ञो मेदिनीपतिः ।\nत्रिपदस्त्रिदशाध्यक्षो महाशृङ्गः कृतान्तकृत् ॥",
      iast: "maharṣiḥ kapilācāryaḥ kṛtajño medinīpatiḥ |\ntripadas tridaśādhyakṣo mahāśṛṅgaḥ kṛtāntakṛt ||",
      en: "The great seer; the teacher Kapila; knower of all creation; lord of the earth; he of the three strides; overseer of the gods; the great-horned (fish); maker of the end." },

    { n: 58,
      deva: "महावराहो गोविन्दः सुषेणः कनकाङ्गदी ।\nगुह्यो गभीरो गहनो गुप्तश्चक्रगदाधरः ॥",
      iast: "mahāvarāho govindaḥ suṣeṇaḥ kanakāṅgadī |\nguhyo gabhīro gahano guptaś cakragadādharaḥ ||",
      en: "The great boar; Govinda; of a goodly host; wearing golden armlets; the secret; the deep; the unfathomable; the hidden; bearer of discus and mace." },

    { n: 59,
      deva: "वेधाः स्वाङ्गोऽजितः कृष्णो दृढः संकर्षणोऽच्युतः ।\nवरुणो वारुणो वृक्षः पुष्कराक्षो महामनाः ॥",
      iast: "vedhāḥ svāṅgo'jitaḥ kṛṣṇo dṛḍhaḥ saṁkarṣaṇo'cyutaḥ |\nvaruṇo vāruṇo vṛkṣaḥ puṣkarākṣo mahāmanāḥ ||",
      en: "The creator; whose limbs are his own instruments; the unconquered; the dark one; the firm; the withdrawer of all; the unfalling; Varuṇa; his son; the tree (steadfast); lotus-eyed; of great mind." },

    { n: 60,
      deva: "भगवान्भगहाऽऽनन्दी वनमाली हलायुधः ।\nआदित्यो ज्योतिरादित्यः सहिष्णुर्गतिसत्तमः ॥",
      iast: "bhagavān bhagahā''nandī vanamālī halāyudhaḥ |\nādityo jyotirādityaḥ sahiṣṇur gatisattamaḥ ||",
      en: "The blessed Lord; destroyer of fortunes at dissolution; the blissful; wearer of the forest garland; armed with the plough; son of Aditi; of solar effulgence; the forbearing; the best goal." },

    { n: 61,
      deva: "सुधन्वा खण्डपरशुर्दारुणो द्रविणप्रदः ।\nदिवःस्पृक्सर्वदृग्व्यासो वाचस्पतिरयोनिजः ॥",
      iast: "sudhanvā khaṇḍaparaśur dāruṇo draviṇapradaḥ |\ndivaḥspṛk sarvadṛg vyāso vācaspatir ayonijaḥ ||",
      en: "Of the goodly bow; wielder of the axe; the dread to evildoers; giver of wealth; toucher of heaven; the all-seeing; the arranger (Vyāsa); lord of learning; the unborn." },

    { n: 62,
      deva: "त्रिसामा सामगः साम निर्वाणं भेषजं भिषक् ।\nसंन्यासकृच्छमः शान्तो निष्ठा शान्तिः परायणम् ॥",
      iast: "trisāmā sāmagaḥ sāma nirvāṇaṁ bheṣajaṁ bhiṣak |\nsaṁnyāsakṛc chamaḥ śānto niṣṭhā śāntiḥ parāyaṇam ||",
      en: "Praised by the three Sāmans; the singer of Sāman; the Sāman itself; liberation; the medicine; the physician; founder of renunciation; the tranquil; the peaceful; the abode; peace; the supreme refuge." },

    { n: 63,
      deva: "शुभाङ्गः शान्तिदः स्रष्टा कुमुदः कुवलेशयः ।\nगोहितो गोपतिर्गोप्ता वृषभाक्षो वृषप्रियः ॥",
      iast: "śubhāṅgaḥ śāntidaḥ sraṣṭā kumudaḥ kuvaleśayaḥ |\ngohito gopatir goptā vṛṣabhākṣo vṛṣapriyaḥ ||",
      en: "Of beautiful form; giver of peace; the creator; rejoicing in the earth; resting on the waters; benefactor of cattle; lord of the earth; the protector; whose eyes rain blessings; lover of dharma." },

    { n: 64,
      deva: "अनिवर्ती निवृत्तात्मा संक्षेप्ता क्षेमकृच्छिवः ।\nश्रीवत्सवक्षाः श्रीवासः श्रीपतिः श्रीमतां वरः ॥",
      iast: "anivartī nivṛttātmā saṁkṣeptā kṣemakṛc chivaḥ |\nśrīvatsavakṣāḥ śrīvāsaḥ śrīpatiḥ śrīmatāṁ varaḥ ||",
      en: "Who never retreats; the withdrawn Self; the contractor of the cosmos; doer of good; the auspicious; bearing Śrīvatsa on his chest; abode of Śrī; lord of Śrī; best of the glorious." },

    { n: 65,
      deva: "श्रीदः श्रीशः श्रीनिवासः श्रीनिधिः श्रीविभावनः ।\nश्रीधरः श्रीकरः श्रेयः श्रीमान्लोकत्रयाश्रयः ॥",
      iast: "śrīdaḥ śrīśaḥ śrīnivāsaḥ śrīnidhiḥ śrīvibhāvanaḥ |\nśrīdharaḥ śrīkaraḥ śreyaḥ śrīmān lokatrayāśrayaḥ ||",
      en: "Giver of Śrī; lord of Śrī; abode of Śrī; treasury of Śrī; dispenser of Śrī; bearer of Śrī; maker of Śrī; the highest good; possessor of Śrī; refuge of the three worlds." },

    { n: 66,
      deva: "स्वक्षः स्वङ्गः शतानन्दो नन्दिर्ज्योतिर्गणेश्वरः ।\nविजितात्माऽविधेयात्मा सत्कीर्तिश्छिन्नसंशयः ॥",
      iast: "svakṣaḥ svaṅgaḥ śatānando nandir jyotir gaṇeśvaraḥ |\nvijitātmā'vidheyātmā satkīrtiś chinnasaṁśayaḥ ||",
      en: "Of beautiful eyes; of beautiful limbs; of a hundred joys; bliss; the radiant; lord of hosts; the self-conquered; whose nature none can command; of true renown; cutter of all doubt." },

    { n: 67,
      deva: "उदीर्णः सर्वतश्चक्षुरनीशः शाश्वतस्थिरः ।\nभूशयो भूषणो भूतिर्विशोकः शोकनाशनः ॥",
      iast: "udīrṇaḥ sarvataścakṣur anīśaḥ śāśvatasthiraḥ |\nbhūśayo bhūṣaṇo bhūtir viśokaḥ śokanāśanaḥ ||",
      en: "The exalted; eyed on every side; the masterless; the eternally firm; resting on the earth; the ornament; the splendor; the sorrowless; destroyer of sorrow." },

    { n: 68,
      deva: "अर्चिष्मानर्चितः कुम्भो विशुद्धात्मा विशोधनः ।\nअनिरुद्धोऽप्रतिरथः प्रद्युम्नोऽमितविक्रमः ॥",
      iast: "arciṣmān arcitaḥ kumbho viśuddhātmā viśodhanaḥ |\naniruddho'pratirathaḥ pradyumno'mitavikramaḥ ||",
      en: "The effulgent; the worshipped; the vessel that holds all; of pure Self; the purifier; the unobstructed; the matchless warrior; of pre-eminent wealth; of measureless valor." },

    { n: 69,
      deva: "कालनेमिनिहा वीरः शौरिः शूरजनेश्वरः ।\nत्रिलोकात्मा त्रिलोकेशः केशवः केशिहा हरिः ॥",
      iast: "kālaneminihā vīraḥ śauriḥ śūrajaneśvaraḥ |\ntrilokātmā trilokeśaḥ keśavaḥ keśihā hariḥ ||",
      en: "Slayer of Kālanemi; the hero; the valiant; lord of the brave; Self of the three worlds; lord of the three worlds; Keśava; slayer of Keśin; the remover of sin." },

    { n: 70,
      deva: "कामदेवः कामपालः कामी कान्तः कृतागमः ।\nअनिर्देश्यवपुर्विष्णुर्वीरोऽनन्तो धनंजयः ॥",
      iast: "kāmadevaḥ kāmapālaḥ kāmī kāntaḥ kṛtāgamaḥ |\nanirdeśyavapur viṣṇur vīro'nanto dhanaṁjayaḥ ||",
      en: "The god of love (fulfiller of desires); guardian of desires; of all desires fulfilled; the beloved; author of scripture; of indefinable form; the all-pervading; the hero; the endless; winner of wealth (Arjuna)." },

    { n: 71,
      deva: "ब्रह्मण्यो ब्रह्मकृद्ब्रह्मा ब्रह्म ब्रह्मविवर्धनः ।\nब्रह्मविद्ब्राह्मणो ब्रह्मी ब्रह्मज्ञो ब्राह्मणप्रियः ॥",
      iast: "brahmaṇyo brahmakṛd brahmā brahma brahmavivardhanaḥ |\nbrahmavid brāhmaṇo brahmī brahmajño brāhmaṇapriyaḥ ||",
      en: "Devoted to the sacred; maker of the Veda; the creator Brahmā; Brahman itself; increaser of the sacred; knower of Brahman; the brāhmaṇa; possessor of Brahman; knower of the Veda; dear to the brāhmaṇas." },

    { n: 72,
      deva: "महाक्रमो महाकर्मा महातेजा महोरगः ।\nमहाक्रतुर्महायज्वा महायज्ञो महाहविः ॥",
      iast: "mahākramo mahākarmā mahātejā mahoragaḥ |\nmahākratur mahāyajvā mahāyajño mahāhaviḥ ||",
      en: "Of mighty stride; of mighty deeds; of mighty splendor; the great serpent; the great sacrifice; the great sacrificer; the great rite; the great oblation." },

    { n: 73,
      deva: "स्तव्यः स्तवप्रियः स्तोत्रं स्तुतिः स्तोता रणप्रियः ।\nपूर्णः पूरयिता पुण्यः पुण्यकीर्तिरनामयः ॥",
      iast: "stavyaḥ stavapriyaḥ stotraṁ stutiḥ stotā raṇapriyaḥ |\npūrṇaḥ pūrayitā puṇyaḥ puṇyakīrtir anāmayaḥ ||",
      en: "The praiseworthy; lover of praise; the hymn; the praise; the praiser; lover of battle; the full; the fulfiller; the holy; of holy renown; the diseaseless." },

    { n: 74,
      deva: "मनोजवस्तीर्थकरो वसुरेता वसुप्रदः ।\nवसुप्रदो वासुदेवो वसुर्वसुमना हविः ॥",
      iast: "manojavas tīrthakaro vasuretā vasupradaḥ |\nvasuprado vāsudevo vasur vasumanā haviḥ ||",
      en: "Swift as thought; founder of holy fords; whose seed is golden; giver of wealth; bestower of riches; Vāsudeva; the wealth; the pure-minded; the oblation." },

    { n: 75,
      deva: "सद्गतिः सत्कृतिः सत्ता सद्भूतिः सत्परायणः ।\nशूरसेनो यदुश्रेष्ठः सन्निवासः सुयामुनः ॥",
      iast: "sadgatiḥ satkṛtiḥ sattā sadbhūtiḥ satparāyaṇaḥ |\nśūraseno yaduśreṣṭhaḥ sannivāsaḥ suyāmunaḥ ||",
      en: "Refuge of the good; of good deeds; pure being; of true manifestation; supreme goal of the good; of heroic armies; best of the Yadus; abode of the good; dweller by the Yamunā." },

    { n: 76,
      deva: "भूतावासो वासुदेवः सर्वासुनिलयोऽनलः ।\nदर्पहा दर्पदो दृप्तो दुर्धरोऽथापराजितः ॥",
      iast: "bhūtāvāso vāsudevaḥ sarvāsunilayo'nalaḥ |\ndarpahā darpado dṛpto durdharo'thāparājitaḥ ||",
      en: "Dwelling-place of beings; Vāsudeva; abode of all life-breaths; the boundless; destroyer of pride; giver of just pride; the exalted; the irresistible; the unconquered." },

    { n: 77,
      deva: "विश्वमूर्तिर्महामूर्तिर्दीप्तमूर्तिरमूर्तिमान् ।\nअनेकमूर्तिरव्यक्तः शतमूर्तिः शताननः ॥",
      iast: "viśvamūrtir mahāmūrtir dīptamūrtir amūrtimān |\nanekamūrtir avyaktaḥ śatamūrtiḥ śatānanaḥ ||",
      en: "Whose form is the universe; of mighty form; of radiant form; the formless; of many forms; the unmanifest; of a hundred forms; of a hundred faces." },

    { n: 78,
      deva: "एको नैकः सवः कः किं यत्तत्पदमनुत्तमम् ।\nलोकबन्धुर्लोकनाथो माधवो भक्तवत्सलः ॥",
      iast: "eko naikaḥ savaḥ kaḥ kiṁ yat tat padam anuttamam |\nlokabandhur lokanātho mādhavo bhaktavatsalaḥ ||",
      en: "The one; the many; the sacrifice; bliss (Ka); the inquiry (Kim); the That, the supreme state; kinsman of the world; lord of the world; lord of knowledge; loving to his devotees." },

    { n: 79,
      deva: "सुवर्णवर्णो हेमाङ्गो वराङ्गश्चन्दनाङ्गदी ।\nवीरहा विषमः शून्यो घृताशीरचलश्चलः ॥",
      iast: "suvarṇavarṇo hemāṅgo varāṅgaś candanāṅgadī |\nvīrahā viṣamaḥ śūnyo ghṛtāśīr acalaś calaḥ ||",
      en: "Of golden hue; of golden limbs; of beautiful body; wearing fragrant armlets; slayer of heroes; the unequalled; the void; free of all craving; the unmoving and the moving." },

    { n: 80,
      deva: "अमानी मानदो मान्यो लोकस्वामी त्रिलोकधृक् ।\nसुमेधा मेधजो धन्यः सत्यमेधा धराधरः ॥",
      iast: "amānī mānado mānyo lokasvāmī trilokadhṛk |\nsumedhā medhajo dhanyaḥ satyamedhā dharādharaḥ ||",
      en: "Free of pride; giver of honor; the honorable; lord of the worlds; bearer of the three worlds; of fine intellect; born of sacrifice; the blessed; of true wisdom; bearer of the earth." },

    { n: 81,
      deva: "तेजोऽवृषो द्युतिधरः सर्वशस्त्रभृतां वरः ।\nप्रग्रहो निग्रहो व्यग्रो नैकशृङ्गो गदाग्रजः ॥",
      iast: "tejo'vṛṣo dyutidharaḥ sarvaśastrabhṛtāṁ varaḥ |\npragraho nigraho vyagro naikaśṛṅgo gadāgrajaḥ ||",
      en: "The effulgent rain-giver; bearer of radiance; best of all who bear weapons; the receiver of devotion; the restrainer; ever-intent; of many horns; elder of Gada." },

    { n: 82,
      deva: "चतुर्मूर्तिश्चतुर्बाहुश्चतुर्व्यूहश्चतुर्गतिः ।\nचतुरात्मा चतुर्भावश्चतुर्वेदविदेकपात् ॥",
      iast: "caturmūrtiś caturbāhuś caturvyūhaś caturgatiḥ |\ncaturātmā caturbhāvaś caturvedavid ekapāt ||",
      en: "Of fourfold form; four-armed; of fourfold array; the fourfold goal; of fourfold Self; of fourfold being; knower of the four Vedas; the one-footed." },

    { n: 83,
      deva: "समावर्तोऽनिवृत्तात्मा दुर्जयो दुरतिक्रमः ।\nदुर्लभो दुर्गमो दुर्गो दुरावासो दुरारिहा ॥",
      iast: "samāvarto'nivṛttātmā durjayo duratikramaḥ |\ndurlabho durgamo durgo durāvāso durārihā ||",
      en: "The well-turning wheel; the unretreating Self; the unconquerable; the insurmountable; the hard to attain; the hard to approach; the unassailable fort; the hard to dwell in; slayer of evil foes." },

    { n: 84,
      deva: "शुभाङ्गो लोकसारङ्गः सुतन्तुस्तन्तुवर्धनः ।\nइन्द्रकर्मा महाकर्मा कृतकर्मा कृतागमः ॥",
      iast: "śubhāṅgo lokasāraṅgaḥ sutantus tantuvardhanaḥ |\nindrakarmā mahākarmā kṛtakarmā kṛtāgamaḥ ||",
      en: "Of beautiful form; who draws the essence of the worlds; the fine thread of the cosmos; the weaver who extends it; of Indra-like deeds; of mighty deeds; whose work is done; author of scripture." },

    { n: 85,
      deva: "उद्भवः सुन्दरः सुन्दो रत्ननाभः सुलोचनः ।\nअर्को वाजसनः शृङ्गी जयन्तः सर्वविज्जयी ॥",
      iast: "udbhavaḥ sundaraḥ sundo ratnanābhaḥ sulocanaḥ |\narko vājasanaḥ śṛṅgī jayantaḥ sarvavij jayī ||",
      en: "The origin; the beautiful; the gentle and the mighty; jewel-naveled; of lovely eyes; the worshipful sun; giver of food; the horned; the victorious; the all-knowing conqueror." },

    { n: 86,
      deva: "सुवर्णबिन्दुरक्षोभ्यः सर्ववागीश्वरेश्वरः ।\nमहाह्रदो महागर्तो महाभूतो महानिधिः ॥",
      iast: "suvarṇabindur akṣobhyaḥ sarvavāgīśvareśvaraḥ |\nmahāhrado mahāgarto mahābhūto mahānidhiḥ ||",
      en: "Of golden limbs (or the sacred bindu); the unshakable; lord of all masters of speech; the great lake; the great chasm; the great being; the great treasure." },

    { n: 87,
      deva: "कुमुदः कुन्दरः कुन्दः पर्जन्यः पावनोऽनिलः ।\nअमृताशोऽमृतवपुः सर्वज्ञः सर्वतोमुखः ॥",
      iast: "kumudaḥ kundaraḥ kundaḥ parjanyaḥ pāvano'nilaḥ |\namṛtāśo'mṛtavapuḥ sarvajñaḥ sarvatomukhaḥ ||",
      en: "Gladdener of the earth; cleaver of the earth; giver like jasmine; the rain-cloud; the purifier; the wind; whose food is nectar; of immortal form; the all-knowing; facing every way." },

    { n: 88,
      deva: "सुलभः सुव्रतः सिद्धः शत्रुजिच्छत्रुतापनः ।\nन्यग्रोधोऽदुम्बरोऽश्वत्थश्चाणूरान्ध्रनिषूदनः ॥",
      iast: "sulabhaḥ suvrataḥ siddhaḥ śatrujic chatrutāpanaḥ |\nnyagrodho'dumbaro'śvatthaś cāṇūrāndhraniṣūdanaḥ ||",
      en: "Easily attained; of noble vows; the accomplished; conqueror of foes; tormentor of foes; the banyan; the imperishable above; the ever-changing fig (world-tree); slayer of the wrestler Cāṇūra." },

    { n: 89,
      deva: "सहस्रार्चिः सप्तजिह्वः सप्तैधाः सप्तवाहनः ।\nअमूर्तिरनघोऽचिन्त्यो भयकृद्भयनाशनः ॥",
      iast: "sahasrārciḥ saptajihvaḥ saptaidhāḥ saptavāhanaḥ |\namūrtir anagho'cintyo bhayakṛd bhayanāśanaḥ ||",
      en: "Of a thousand rays; of seven tongues (of fire); of seven fuels; of seven steeds; the formless; the sinless; the inconceivable; striker of fear into evil; destroyer of fear." },

    { n: 90,
      deva: "अणुर्बृहत्कृशः स्थूलो गुणभृन्निर्गुणो महान् ।\nअधृतः स्वधृतः स्वास्यः प्राग्वंशो वंशवर्धनः ॥",
      iast: "aṇur bṛhat kṛśaḥ sthūlo guṇabhṛn nirguṇo mahān |\nadhṛtaḥ svadhṛtaḥ svāsyaḥ prāgvaṁśo vaṁśavardhanaḥ ||",
      en: "The atom; the vast; the slender; the gross; bearer of qualities; the qualityless; the great; the unsupported; self-supported; of fair face; the ancient lineage; increaser of the line." },

    { n: 91,
      deva: "भारभृत्कथितो योगी योगीशः सर्वकामदः ।\nआश्रमः श्रमणः क्षामः सुपर्णो वायुवाहनः ॥",
      iast: "bhārabhṛt kathito yogī yogīśaḥ sarvakāmadaḥ |\nāśramaḥ śramaṇaḥ kṣāmaḥ suparṇo vāyuvāhanaḥ ||",
      en: "Bearer of the burden; the renowned; the yogi; lord of yogis; giver of all desires; the resting-place; the wearier of the lazy; the diminisher; the fair-winged; carried by the wind." },

    { n: 92,
      deva: "धनुर्धरो धनुर्वेदो दण्डो दमयिता दमः ।\nअपराजितः सर्वसहो नियन्ताऽनियमोऽयमः ॥",
      iast: "dhanurdharo dhanurvedo daṇḍo damayitā damaḥ |\naparājitaḥ sarvasaho niyantā'niyamo'yamaḥ ||",
      en: "Bearer of the bow; the science of archery; the punishing rod; the subduer; self-restraint; the unvanquished; the all-enduring; the controller; free of restraint; free of compulsion." },

    { n: 93,
      deva: "सत्त्ववान्सात्त्विकः सत्यः सत्यधर्मपरायणः ।\nअभिप्रायः प्रियार्होऽर्हः प्रियकृत्प्रीतिवर्धनः ॥",
      iast: "sattvavān sāttvikaḥ satyaḥ satyadharmaparāyaṇaḥ |\nabhiprāyaḥ priyārho'rhaḥ priyakṛt prītivardhanaḥ ||",
      en: "Endowed with goodness; of the nature of goodness; the truth; devoted to truth and dharma; the goal of all; worthy of love; worthy of worship; doer of what is dear; increaser of love." },

    { n: 94,
      deva: "विहायसगतिर्ज्योतिः सुरुचिर्हुतभुग्विभुः ।\nरविर्विरोचनः सूर्यः सविता रविलोचनः ॥",
      iast: "vihāyasagatir jyotiḥ surucir hutabhug vibhuḥ |\nravir virocanaḥ sūryaḥ savitā ravilocanaḥ ||",
      en: "Moving through the sky; the light; of beautiful radiance; enjoyer of oblations; the all-pervading; the sun (Ravi); the shining; Sūrya; the impeller; whose eye is the sun." },

    { n: 95,
      deva: "अनन्तो हुतभुग्भोक्ता सुखदो नैकजोऽग्रजः ।\nअनिर्विण्णः सदामर्षी लोकाधिष्ठानमद्भुतः ॥",
      iast: "ananto hutabhug bhoktā sukhado naikajo'grajaḥ |\nanirviṇṇaḥ sadāmarṣī lokādhiṣṭhānam adbhutaḥ ||",
      en: "The endless; enjoyer of oblations; the enjoyer; giver of joy; born many times; the first-born; the undespairing; ever-forbearing; foundation of the worlds; the wonderful." },

    { n: 96,
      deva: "सनात्सनातनतमः कपिलः कपिरव्ययः ।\nस्वस्तिदः स्वस्तिकृत्स्वस्ति स्वस्तिभुक्स्वस्तिदक्षिणः ॥",
      iast: "sanāt sanātanatamaḥ kapilaḥ kapir avyayaḥ |\nsvastidaḥ svastikṛt svasti svastibhuk svastidakṣiṇaḥ ||",
      en: "The ancient; the most ancient of all; the sage Kapila; the sun; the imperishable; giver of well-being; maker of well-being; well-being itself; enjoyer of well-being; bestower of auspicious gifts." },

    { n: 97,
      deva: "अरौद्रः कुण्डली चक्री विक्रम्यूर्जितशासनः ।\nशब्दातिगः शब्दसहः शिशिरः शर्वरीकरः ॥",
      iast: "araudraḥ kuṇḍalī cakrī vikramy ūrjitaśāsanaḥ |\nśabdātigaḥ śabdasahaḥ śiśiraḥ śarvarīkaraḥ ||",
      en: "Free of cruelty; wearer of earrings; bearer of the discus; the valiant; of mighty command; beyond the reach of words; bearer of the Vedic word; the cool refuge; maker of night." },

    { n: 98,
      deva: "अक्रूरः पेशलो दक्षो दक्षिणः क्षमिणां वरः ।\nविद्वत्तमो वीतभयः पुण्यश्रवणकीर्तनः ॥",
      iast: "akrūraḥ peśalo dakṣo dakṣiṇaḥ kṣamiṇāṁ varaḥ |\nvidvattamo vītabhayaḥ puṇyaśravaṇakīrtanaḥ ||",
      en: "Free of cruelty; the graceful; the able; the generous; best of the forbearing; the most learned; free of fear; whose hearing and praise are holy." },

    { n: 99,
      deva: "उत्तारणो दुष्कृतिहा पुण्यो दुःस्वप्ननाशनः ।\nवीरहा रक्षणः सन्तो जीवनः पर्यवस्थितः ॥",
      iast: "uttāraṇo duṣkṛtihā puṇyo duḥsvapnanāśanaḥ |\nvīrahā rakṣaṇaḥ santo jīvanaḥ paryavasthitaḥ ||",
      en: "The ferrier across saṁsāra; destroyer of evil deeds; the holy; dispeller of evil dreams; slayer of the strong; the protector; the good; the life of all; pervading all around." },

    { n: 100,
      deva: "अनन्तरूपोऽनन्तश्रीर्जितमन्युर्भयापहः ।\nचतुरश्रो गभीरात्मा विदिशो व्यादिशो दिशः ॥",
      iast: "anantarūpo'nantaśrīr jitamanyur bhayāpahaḥ |\ncaturaśro gabhīrātmā vidiśo vyādiśo diśaḥ ||",
      en: "Of endless forms; of endless glory; conqueror of wrath; remover of fear; the fair and just; of profound Self; the all-pervading; the commander; the director of the quarters." },

    { n: 101,
      deva: "अनादिर्भूर्भुवो लक्ष्मीः सुवीरो रुचिराङ्गदः ।\nजननो जनजन्मादिर्भीमो भीमपराक्रमः ॥",
      iast: "anādir bhūr bhuvo lakṣmīḥ suvīro rucirāṅgadaḥ |\njanano janajanmādir bhīmo bhīmaparākramaḥ ||",
      en: "The beginningless; the earth; glory of the earth; the valiant; wearer of shining armlets; the begetter; source of beings' birth; the terrible; of terrible prowess (to foes)." },

    { n: 102,
      deva: "आधारनिलयोऽधाता पुष्पहासः प्रजागरः ।\nऊर्ध्वगः सत्पथाचारः प्राणदः प्रणवः पणः ॥",
      iast: "ādhāranilayo'dhātā puṣpahāsaḥ prajāgaraḥ |\nūrdhvagaḥ satpathācāraḥ prāṇadaḥ praṇavaḥ paṇaḥ ||",
      en: "The support of all supports; the unsustained sustainer; whose unfolding is like a flower's bloom; the ever-wakeful; the upward-moving; treader of the good path; giver of life; the sacred Oṁ; the lord of transactions." },

    { n: 103,
      deva: "प्रमाणं प्राणनिलयः प्राणभृत्प्राणजीवनः ।\nतत्त्वं तत्त्वविदेकात्मा जन्ममृत्युजरातिगः ॥",
      iast: "pramāṇaṁ prāṇanilayaḥ prāṇabhṛt prāṇajīvanaḥ |\ntattvaṁ tattvavid ekātmā janmamṛtyujarātigaḥ ||",
      en: "The measure; resting-place of life; sustainer of life; the life of the life-breaths; the Reality; knower of the Reality; the one Self; beyond birth, death and old age." },

    { n: 104,
      deva: "भूर्भुवःस्वस्तरुस्तारः सविता प्रपितामहः ।\nयज्ञो यज्ञपतिर्यज्वा यज्ञाङ्गो यज्ञवाहनः ॥",
      iast: "bhūr bhuvaḥ svas tarus tāraḥ savitā prapitāmahaḥ |\nyajño yajñapatir yajvā yajñāṅgo yajñavāhanaḥ ||",
      en: "The tree of the three worlds; the deliverer; the impeller; great-grandfather of all; the sacrifice; lord of sacrifice; the sacrificer; whose limbs are the sacrifice; bearer of the sacrifice." },

    { n: 105,
      deva: "यज्ञभृद्यज्ञकृद्यज्ञी यज्ञभुक्यज्ञसाधनः ।\nयज्ञान्तकृद्यज्ञगुह्यमन्नमन्नाद एव च ॥",
      iast: "yajñabhṛd yajñakṛd yajñī yajñabhuk yajñasādhanaḥ |\nyajñāntakṛd yajñaguhyam annam annāda eva ca ||",
      en: "Upholder of sacrifice; doer of sacrifice; enjoyer of sacrifice; partaker of sacrifice; means of sacrifice; bringer of sacrifice to its end; the secret of sacrifice; the food and the eater of food." },

    { n: 106,
      deva: "आत्मयोनिः स्वयंजातो वैखानः सामगायनः ।\nदेवकीनन्दनः स्रष्टा क्षितीशः पापनाशनः ॥",
      iast: "ātmayoniḥ svayaṁjāto vaikhānaḥ sāmagāyanaḥ |\ndevakīnandanaḥ sraṣṭā kṣitīśaḥ pāpanāśanaḥ ||",
      en: "Self-born; born of his own will; the digger (boar); singer of the Sāman; son of Devakī; the creator; lord of the earth; destroyer of sin." },

    { n: 107,
      deva: "शङ्खभृन्नन्दकी चक्री शार्ङ्गधन्वा गदाधरः ।\nरथाङ्गपाणिरक्षोभ्यः सर्वप्रहरणायुधः ॥",
      iast: "śaṅkhabhṛn nandakī cakrī śārṅgadhanvā gadādharaḥ |\nrathāṅgapāṇir akṣobhyaḥ sarvapraharaṇāyudhaḥ ||",
      en: "Bearer of the conch; wielder of the Nandaka sword; bearer of the discus; of the Śārṅga bow; holder of the mace; the discus-handed; the unshakable; armed with every weapon." },

    { n: "",
      deva: "श्री सर्वप्रहरणायुध ॐ नम इति ॥",
      iast: "śrī sarvapraharaṇāyudha oṁ nama iti ||",
      en: "“Glory to him who is armed with every weapon” — Oṁ, salutations. (Thus the thousand names are complete.)" },

    { n: 108,
      deva: "वनमाली गदी शार्ङ्गी शङ्खी चक्री च नन्दकी ।\nश्रीमान्नारायणो विष्णुर्वासुदेवोऽभिरक्षतु ॥",
      iast: "vanamālī gadī śārṅgī śaṅkhī cakrī ca nandakī |\nśrīmān nārāyaṇo viṣṇur vāsudevo'bhirakṣatu ||",
      en: "May the glorious Nārāyaṇa — Viṣṇu, Vāsudeva — bearer of the forest garland, mace, Śārṅga bow, conch, discus and the Nandaka sword, protect us on every side." },

    /* ───────────── UTTARA PĪṬHIKĀ · PHALAŚRUTI ───────────── */
    { section: "Uttara Pīṭhikā · Phalaśruti", n: "",
      deva: "इतीदं कीर्तनीयस्य केशवस्य महात्मनः ।\nनाम्नां सहस्रं दिव्यानामशेषेण प्रकीर्तितम् ॥",
      iast: "itīdaṁ kīrtanīyasya keśavasya mahātmanaḥ |\nnāmnāṁ sahasraṁ divyānām aśeṣeṇa prakīrtitam ||",
      en: "Thus have the thousand divine names of the great Keśava, worthy of praise, been fully proclaimed." },

    { n: "",
      deva: "य इदं शृणुयान्नित्यं यश्चापि परिकीर्तयेत् ।\nनाशुभं प्राप्नुयात्किंचित्सोऽमुत्रेह च मानवः ॥",
      iast: "ya idaṁ śṛṇuyān nityaṁ yaś cāpi parikīrtayet |\nnāśubhaṁ prāpnuyāt kiñcit so'mutreha ca mānavaḥ ||",
      en: "Whoever daily hears or recites this will meet with no misfortune, here or hereafter." },

    { n: "",
      deva: "वेदान्तगो ब्राह्मणः स्यात्क्षत्रियो विजयी भवेत् ।\nवैश्यो धनसमृद्धः स्यात्शूद्रः सुखमवाप्नुयात् ॥",
      iast: "vedāntago brāhmaṇaḥ syāt kṣatriyo vijayī bhavet |\nvaiśyo dhanasamṛddhaḥ syāt śūdraḥ sukham avāpnuyāt ||",
      en: "By it the brāhmaṇa attains knowledge of Vedānta, the kṣatriya victory, the vaiśya abundance of wealth, and the śūdra happiness. (This verse reflects the social ordering of the text's own era.)" },

    { n: "",
      deva: "धर्मार्थी प्राप्नुयाद्धर्ममर्थार्थी चार्थमाप्नुयात् ।\nकामानवाप्नुयात्कामी प्रजार्थी चाप्नुयात्प्रजाः ॥",
      iast: "dharmārthī prāpnuyād dharmam arthārthī cārtham āpnuyāt |\nkāmān avāpnuyāt kāmī prajārthī cāpnuyāt prajāḥ ||",
      en: "The seeker of dharma gains dharma; the seeker of wealth, wealth; the desirous, their desires; and the seeker of progeny, progeny." },

    { n: "",
      deva: "भक्तिमान्यः सदोत्थाय शुचिस्तद्गतमानसः ।\nसहस्रं वासुदेवस्य नाम्नामेतत्प्रकीर्तयेत् ॥",
      iast: "bhaktimān yaḥ sadotthāya śucis tadgatamānasaḥ |\nsahasraṁ vāsudevasya nāmnām etat prakīrtayet ||",
      en: "The devout one who rises daily, purifies himself, fixes his mind on the Lord, and recites this thousand names of Vāsudeva —" },

    { n: "",
      deva: "यशः प्राप्नोति विपुलं ज्ञातिप्राधान्यमेव च ।\nअचलां श्रियमाप्नोति श्रेयः प्राप्नोत्यनुत्तमम् ॥",
      iast: "yaśaḥ prāpnoti vipulaṁ jñātiprādhānyam eva ca |\nacalāṁ śriyam āpnoti śreyaḥ prāpnoty anuttamam ||",
      en: "— gains vast fame, pre-eminence among his kin, unshakable prosperity, and the highest good." },

    { n: "",
      deva: "न भयं क्वचिदाप्नोति वीर्यं तेजश्च विन्दति ।\nभवत्यरोगो द्युतिमान्बलरूपगुणान्वितः ॥",
      iast: "na bhayaṁ kvacid āpnoti vīryaṁ tejaś ca vindati |\nbhavaty arogo dyutimān balarūpaguṇānvitaḥ ||",
      en: "He meets no fear anywhere; he gains vigor and radiance; he becomes free of disease, lustrous, endowed with strength, beauty and virtue." },

    { n: "",
      deva: "रोगार्तो मुच्यते रोगाद्बद्धो मुच्येत बन्धनात् ।\nभयान्मुच्येत भीतस्तु मुच्येतापन्न आपदः ॥",
      iast: "rogārto mucyate rogād baddho mucyeta bandhanāt |\nbhayān mucyeta bhītas tu mucyetāpanna āpadaḥ ||",
      en: "The sick are freed from disease, the bound from bondage, the fearful from fear, and the distressed from their distress." },

    { n: "",
      deva: "दुर्गाण्यतितरत्याशु पुरुषः पुरुषोत्तमम् ।\nस्तुवन्नामसहस्रेण नित्यं भक्तिसमन्वितः ॥",
      iast: "durgāṇy atitaraty āśu puruṣaḥ puruṣottamam |\nstuvan nāmasahasreṇa nityaṁ bhaktisamanvitaḥ ||",
      en: "He who ever praises the Supreme Being with these thousand names, full of devotion, swiftly crosses over all difficulties." },

    { n: "",
      deva: "वासुदेवाश्रयो मर्त्यो वासुदेवपरायणः ।\nसर्वपापविशुद्धात्मा याति ब्रह्म सनातनम् ॥",
      iast: "vāsudevāśrayo martyo vāsudevaparāyaṇaḥ |\nsarvapāpaviśuddhātmā yāti brahma sanātanam ||",
      en: "The mortal who takes refuge in Vāsudeva, devoted wholly to him, his soul cleansed of all sin, attains the eternal Brahman." },

    { n: "",
      deva: "न वासुदेवभक्तानामशुभं विद्यते क्वचित् ।\nजन्ममृत्युजराव्याधिभयं नैवोपजायते ॥",
      iast: "na vāsudevabhaktānām aśubhaṁ vidyate kvacit |\njanmamṛtyujarāvyādhibhayaṁ naivopajāyate ||",
      en: "For the devotees of Vāsudeva there is no misfortune anywhere; no fear of birth, death, old age or disease arises in them." },

    { n: "",
      deva: "इमं स्तवमधीयानः श्रद्धाभक्तिसमन्वितः ।\nयुज्येतात्मसुखक्षान्तिश्रीधृतिस्मृतिकीर्तिभिः ॥",
      iast: "imaṁ stavam adhīyānaḥ śraddhābhaktisamanvitaḥ |\nyujyetātmasukhakṣāntiśrīdhṛtismṛtikīrtibhiḥ ||",
      en: "He who studies this hymn with faith and devotion comes to possess inner happiness, patience, prosperity, fortitude, memory and renown." },

    { n: "",
      deva: "न क्रोधो न च मात्सर्यं न लोभो नाशुभा मतिः ।\nभवन्ति कृतपुण्यानां भक्तानां पुरुषोत्तमे ॥",
      iast: "na krodho na ca mātsaryaṁ na lobho nāśubhā matiḥ |\nbhavanti kṛtapuṇyānāṁ bhaktānāṁ puruṣottame ||",
      en: "In the meritorious devotees of the Supreme Being there arise no anger, no envy, no greed, no unwholesome thought." },

    { section: "The Glory of the Lord · विभूति", n: "",
      deva: "द्यौः सचन्द्रार्कनक्षत्रा खं दिशो भूर्महोदधिः ।\nवासुदेवस्य वीर्येण विधृतानि महात्मनः ॥",
      iast: "dyauḥ sacandrārkanakṣatrā khaṁ diśo bhūr mahodadhiḥ |\nvāsudevasya vīryeṇa vidhṛtāni mahātmanaḥ ||",
      en: "The heavens with moon, sun and stars, the sky, the directions, the earth and the great oceans — all are upheld by the power of the great Vāsudeva." },

    { n: "",
      deva: "ससुरासुरगन्धर्वं सयक्षोरगराक्षसम् ।\nजगद्वशे वर्ततेदं कृष्णस्य सचराचरम् ॥",
      iast: "sasurāsuragandharvaṁ sayakṣoragarākṣasam |\njagad vaśe vartate'daṁ kṛṣṇasya sacarācaram ||",
      en: "This whole world — with its gods, demons and gandharvas, its yakṣas, serpents and rākṣasas, all moving and unmoving — abides under the sway of Kṛṣṇa." },

    { n: "",
      deva: "इन्द्रियाणि मनो बुद्धिः सत्त्वं तेजो बलं धृतिः ।\nवासुदेवात्मकान्याहुः क्षेत्रं क्षेत्रज्ञ एव च ॥",
      iast: "indriyāṇi mano buddhiḥ sattvaṁ tejo balaṁ dhṛtiḥ |\nvāsudevātmakāny āhuḥ kṣetraṁ kṣetrajña eva ca ||",
      en: "The senses, mind, intellect, goodness, vigor, strength, fortitude, the field (body) and the knower of the field — all these, they say, are of the nature of Vāsudeva." },

    { n: "",
      deva: "सर्वागमानामाचारः प्रथमं परिकल्पितः ।\nआचारप्रभवो धर्मो धर्मस्य प्रभुरच्युतः ॥",
      iast: "sarvāgamānām ācāraḥ prathamaṁ parikalpitaḥ |\nācāraprabhavo dharmo dharmasya prabhur acyutaḥ ||",
      en: "In all scriptures, right conduct is enjoined first; from conduct arises dharma; and the Lord of dharma is the imperishable Acyuta." },

    { n: "",
      deva: "ऋषयः पितरो देवा महाभूतानि धातवः ।\nजंगमाजंगमं चेदं जगन्नारायणोद्भवम् ॥",
      iast: "ṛṣayaḥ pitaro devā mahābhūtāni dhātavaḥ |\njaṅgamājaṅgamaṁ cedaṁ jagan nārāyaṇodbhavam ||",
      en: "The sages, the ancestors, the gods, the great elements, the bodily constituents, and this whole world, moving and unmoving, have all arisen from Nārāyaṇa." },

    { n: "",
      deva: "योगो ज्ञानं तथा सांख्यं विद्याः शिल्पादि कर्म च ।\nवेदाः शास्त्राणि विज्ञानमेतत्सर्वं जनार्दनात् ॥",
      iast: "yogo jñānaṁ tathā sāṅkhyaṁ vidyāḥ śilpādi karma ca |\nvedāḥ śāstrāṇi vijñānam etat sarvaṁ janārdanāt ||",
      en: "Yoga, knowledge, Sāṅkhya, the sciences and arts, the crafts and their works, the Vedas, the scriptures and all wisdom — all this is from Janārdana." },

    { n: "",
      deva: "एको विष्णुर्महद्भूतं पृथग्भूतान्यनेकशः ।\nत्रीन्लोकान्व्याप्य भूतात्मा भुङ्क्ते विश्वभुगव्ययः ॥",
      iast: "eko viṣṇur mahad bhūtaṁ pṛthag bhūtāny anekaśaḥ |\ntrīn lokān vyāpya bhūtātmā bhuṅkte viśvabhug avyayaḥ ||",
      en: "The one Viṣṇu is the great Being; he it is who appears as the many diverse creatures. Pervading the three worlds, the Self of all beings, the imperishable enjoyer of the universe partakes of all." },

    { n: "",
      deva: "इमं स्तवं भगवतो विष्णोर्व्यासेन कीर्तितम् ।\nपठेद्य इच्छेत्पुरुषः श्रेयः प्राप्तुं सुखानि च ॥",
      iast: "imaṁ stavaṁ bhagavato viṣṇor vyāsena kīrtitam |\npaṭhed ya icchet puruṣaḥ śreyaḥ prāptuṁ sukhāni ca ||",
      en: "This hymn of the Lord Viṣṇu, sung by Vyāsa, let the man who desires good and happiness recite." },

    { n: "",
      deva: "विश्वेश्वरमजं देवं जगतः प्रभुमव्ययम् ।\nभजन्ति ये पुष्कराक्षं न ते यान्ति पराभवम् ॥\nन ते यान्ति पराभवम् ॐ नम इति ॥",
      iast: "viśveśvaram ajaṁ devaṁ jagataḥ prabhum avyayam |\nbhajanti ye puṣkarākṣaṁ na te yānti parābhavam ||\nna te yānti parābhavam oṁ nama iti ||",
      en: "Those who worship the lotus-eyed God — Lord of the universe, unborn, master of the world, imperishable — never meet with defeat. Oṁ, salutations." },

    /* ───────────── Concluding dialogue ───────────── */
    { section: "The Closing Dialogue", speaker: "Arjuna uvāca", n: "",
      deva: "पद्मपत्रविशालाक्ष पद्मनाभ सुरोत्तम ।\nभक्तानामनुरक्तानां त्राता भव जनार्दन ॥",
      iast: "padmapatraviśālākṣa padmanābha surottama |\nbhaktānām anuraktānāṁ trātā bhava janārdana ||",
      en: "Arjuna said: O lotus-petal-eyed one, O lotus-naveled, best of gods, Janārdana — be the protector of your loving devotees." },

    { speaker: "Śrī Bhagavān uvāca", n: "",
      deva: "यो मां नामसहस्रेण स्तोतुमिच्छति पाण्डव ।\nसोऽहमेकेन श्लोकेन स्तुत एव न संशयः ॥\nस्तुत एव न संशयः ॐ नम इति ॥",
      iast: "yo māṁ nāmasahasreṇa stotum icchati pāṇḍava |\nso'ham ekena ślokena stuta eva na saṁśayaḥ ||\nstuta eva na saṁśayaḥ oṁ nama iti ||",
      en: "The Lord said: O Pāṇḍava, whoever wishes to praise me with the thousand names — by that very intent, even with a single verse, I am praised; of this there is no doubt. Oṁ, salutations." },

    { speaker: "Vyāsa uvāca", n: "",
      deva: "वासनाद्वासुदेवस्य वासितं भुवनत्रयम् ।\nसर्वभूतनिवासोऽसि वासुदेव नमोऽस्तु ते ॥\nश्री वासुदेव नमोऽस्तु ते ॐ नम इति ॥",
      iast: "vāsanād vāsudevasya vāsitaṁ bhuvanatrayam |\nsarvabhūtanivāso'si vāsudeva namo'stu te ||\nśrī vāsudeva namo'stu te oṁ nama iti ||",
      en: "Vyāsa said: By the pervasion of Vāsudeva the three worlds are filled. You are the abode of all beings; O Vāsudeva, salutations to you. Oṁ." },

    { speaker: "Pārvaty uvāca", n: "",
      deva: "केनोपायेन लघुना विष्णोर्नामसहस्रकम् ।\nपठ्यते पण्डितैर्नित्यं श्रोतुमिच्छाम्यहं प्रभो ॥",
      iast: "kenopāyena laghunā viṣṇor nāmasahasrakam |\npaṭhyate paṇḍitair nityaṁ śrotum icchāmy ahaṁ prabho ||",
      en: "Pārvatī asked: O Lord, by what easy means do the wise daily recite the thousand names of Viṣṇu? This I wish to hear." },

    { speaker: "Īśvara uvāca", n: "",
      deva: "श्रीराम राम रामेति रमे रामे मनोरमे ।\nसहस्रनाम तत्तुल्यं रामनाम वरानने ॥\nश्री रामनाम वरानन ॐ नम इति ॥",
      iast: "śrīrāma rāma rāmeti rame rāme manorame |\nsahasranāma tat tulyaṁ rāmanāma varānane ||\nśrī rāmanāma varānana oṁ nama iti ||",
      en: "Śiva said: “Śrī Rāma, Rāma, Rāma” — thus I delight in the enchanting name of Rāma. O fair-faced one, the name 'Rāma' is equal to the entire thousand names. Oṁ, salutations." },

    { speaker: "Brahmovāca", n: "",
      deva: "नमोऽस्त्वनन्ताय सहस्रमूर्तये\nसहस्रपादाक्षिशिरोरुबाहवे ।\nसहस्रनाम्ने पुरुषाय शाश्वते\nसहस्रकोटीयुगधारिणे नमः ॥\nसहस्रकोटीयुगधारिण ॐ नम इति ॥",
      iast: "namo'stv anantāya sahasramūrtaye\nsahasrapādākṣiśiroru-bāhave |\nsahasranāmne puruṣāya śāśvate\nsahasrakoṭīyugadhāriṇe namaḥ ||\nsahasrakoṭīyugadhāriṇa oṁ nama iti ||",
      en: "Brahmā said: Salutations to the infinite One of a thousand forms, of a thousand feet, eyes, heads, thighs and arms; to the eternal Being of a thousand names, who upholds a thousand crore ages — salutations. Oṁ." },

    { speaker: "Sañjaya uvāca", n: "",
      deva: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः ।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥",
      iast: "yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanurdharaḥ |\ntatra śrīr vijayo bhūtir dhruvā nītir matir mama ||",
      en: "Sañjaya said: Where Kṛṣṇa the Lord of yoga is, and where Arjuna the archer is, there will be fortune, victory, prosperity and firm righteousness — such is my conviction." },

    { speaker: "Śrī Bhagavān uvāca", n: "",
      deva: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
      iast: "ananyāś cintayanto māṁ ye janāḥ paryupāsate |\nteṣāṁ nityābhiyuktānāṁ yogakṣemaṁ vahāmy aham ||",
      en: "The Lord said: For those who worship me with undivided mind, ever steadfast — to them I bring what they lack and preserve what they have." },

    { n: "",
      deva: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय संभवामि युगे युगे ॥",
      iast: "paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām |\ndharmasaṁsthāpanārthāya saṁbhavāmi yuge yuge ||",
      en: "For the protection of the good, for the destruction of the wicked, and for the establishing of dharma, I am born age after age." },

    { n: "",
      deva: "आर्ता विषण्णाः शिथिलाश्च भीताः\nघोरेषु च व्याधिषु वर्तमानाः ।\nसंकीर्त्य नारायणशब्दमात्रं\nविमुक्तदुःखाः सुखिनो भवन्ति ॥",
      iast: "ārtā viṣaṇṇāḥ śithilāś ca bhītāḥ\nghoreṣu ca vyādhiṣu vartamānāḥ |\nsaṁkīrtya nārāyaṇaśabdamātraṁ\nvimuktaduḥkhāḥ sukhino bhavanti ||",
      en: "The afflicted, the despondent, the weak, the frightened, and those caught in dire diseases — merely by uttering the word “Nārāyaṇa” become freed from sorrow and attain happiness." },

    { n: "",
      deva: "कायेन वाचा मनसेन्द्रियैर्वा\nबुद्ध्यात्मना वा प्रकृतेः स्वभावात् ।\nकरोमि यद्यत्सकलं परस्मै\nनारायणायेति समर्पयामि ॥\nश्रीमन्नारायणायेति समर्पयामि ॥",
      iast: "kāyena vācā manasendriyair vā\nbuddhyātmanā vā prakṛteḥ svabhāvāt |\nkaromi yad yat sakalaṁ parasmai\nnārāyaṇāyeti samarpayāmi ||\nśrīman nārāyaṇāyeti samarpayāmi ||",
      en: "Whatever I do with body, speech, mind, senses, intellect or self, or by the promptings of my nature — all of it I offer to the supreme Nārāyaṇa." },

    { n: "",
      deva: "॥ इति श्रीविष्णोर्दिव्यसहस्रनामस्तोत्रं संपूर्णम् ॥",
      iast: "|| iti śrī-viṣṇor divya-sahasranāma-stotraṁ saṁpūrṇam ||",
      en: "Thus concludes the divine thousand-name hymn of Śrī Viṣṇu. ॥ Śrī Kṛṣṇārpaṇam astu ॥" },
  ];

  /* Attach to the Viṣṇu Sahasranāma stotra as continuous verse text. */
  const D = window.AKSHARA_DATA;
  if (D && D.stotras) {
    const s = D.stotras.find(x => x.id === "vishnu-sahasranama");
    if (s) {
      s.text = VSN;
      delete s.names;            // present as stotra (ślokas), not nāmāvalī
      s.verses = VSN.length;     // keep the displayed count honest
      s.blurb = "The thousand names of Viṣṇu in their stotra form — taught by Bhīṣma to Yudhiṣṭhira on the bed of arrows. Pūrva Pīṭhikā, the 108 ślokas of names with full sandhi, and the Uttara Pīṭhikā (phalaśruti) entire.";
    }
  }
})();

// stuti-nomu-data.js  —  all 102 nomulu
// STUTI_NOMU wrapper per spec.
// Text object: { roman (English), deva (Devanagari placeholder), tel (Telugu) }
// Entries with id in ALREADY_FULL have richer structured data in the previous build.
// These are the full corpus entries extracted from nomulu-document.html.

export const STUTI_NOMU = (function () {
  const list = [
  //
  {
    id: "uppu-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Uppu Gauri Nomu",
        deva: "",
        tel: "ఉప్పుగౌరీ నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "Aidavatanam until the body is laid down.",
        deva: "",
        tel: "తనువు చాలించేవరకు ఐదవతనము."
      },
    how: {
        roman: "Saying the words — a pot filled full of salt, and aidavatanam until the body is laid down — akshatalu are placed on the head through the year.",
        deva: "",
        tel: "'దాకనిండా ఉప్పుపోసిన తనువు చాలించేవరకు ఐదవతనము ఉండును' — ఈ మాటలు అనుకొని ఏడాది పొడుగునా అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "This nomu has no narrative katha but the words above.",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; పైన చెప్పిన మాటలే."
      },
    udyapana: {
        roman: "Nine solas of salt are poured into a new pot, tied over with a ravikela gudda, and given to a muttaiduva with dakshina and tambulam. 'Though the katha may lapse, the vratam may not.'",
        deva: "",
        tel: "క్రొత్త దాకలో తొమ్మిది సోలల ఉప్పు పోసి, రవికెలగుడ్డ వాసెన కట్టి, దక్షిణ తాంబూలములతో ముత్తైదువుకు ఇవ్వవలెను. 'కథ తప్పిననూ వ్రతము తప్పరాదు.'"
      },
    vayanam: {
        roman: "A new pot filled with salt, ravikela gudda, dakshina, tambulam.",
        deva: "",
        tel: "ఉప్పు నిండిన కొత్త కుండ, రవికెలగుడ్డ, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "kanda-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Kanda Gauri Nomu",
        deva: "",
        tel: "కందగౌరీ నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "An end to unexplained weeping in a child; courage, ease, wellbeing.",
        deva: "",
        tel: "కారణము లేని ఏడుపు మానుట; ధైర్యము, ఉత్సాహము, సుఖము."
      },
    how: {
        roman: "The katha is told and akshatalu placed on the head for one year. Kanda dumpalu are made in silver and gold, and an ordinary kanda gadda obtained.",
        deva: "",
        tel: "కథ చెప్పుకొని సంవత్సరకాలము అక్షతలు నెత్తిపై వేసుకొనవలెను. వెండి, బంగారముతో చేసిన కంద దుంపలను తయారు చేయించుకొని, మామూలు కంద గడ్డ సంపాదించవలెను."
      },
    katha: {
        roman: "To a brahmana family a daughter was born who wept without cause, and no one could quiet her. Unable to bear the daily noise, the neighbours drove the family out of the village. The brahmana reached a forest with his family and, seeing no way, sat sobbing. Then Shiva came there with Parvati Devi, asked the cause, and said: 'Brahmana, your daughter's weeping is not without cause. In a former birth she took up the Kanda Gauri nomu and abandoned it, and that is the reason for this grief. Go home, have her keep the Kanda Gauri nomu, and the weeping will stop.' He did so, and the weeping stopped; courage, spirit, cheerfulness and ease came to her.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ కుటుంబమునకు ఒక కుమార్తె జన్మించినది. ఆమె అకారణముగా ఏడ్చుచుండెడిది; ఎవరూ ఆ ఏడుపు మాన్పలేకపోయిరి. నిత్యము ఆ గోల పడలేక ఇరుగుపొరుగువారు ఆ కుటుంబమును ఊరినుండి వెడలగొట్టిరి. ఆ బ్రాహ్మణుడు కుటుంబముతో ఒక అడవి చేరి, దారి తోచక వెక్కి వెక్కి ఏడ్వసాగెను. అంత శివుడు పార్వతీదేవితో అక్కడకు వచ్చి కారణమడిగి తెలిసికొని — 'ఓయీ బ్రాహ్మణా! నీ కుమార్తె ఏడుపునకు కారణము లేకపోలేదు. ఈమె గత జన్మమున కంద గౌరీ నోమును నోచి విడిచిపెట్టినది; అందుచేతనే ఈ శోకము. ఇంటికి పోయి కంద గౌరీ నోము నోయించి ఏడుపు మాన్పించుకో' అని చెప్పెను. అతడు అట్లే చేయగా ఏడుపు మానినది; ధైర్యము, ఉత్సాహము, ఉల్లాసము, సుఖము సిద్ధించినవి."
      },
    udyapana: {
        roman: "Silver and gold kanda dumpalu, a kanda gadda, ravikela gudda, lakka jollu, nallapusala tallu, dakshina and tambulam are given as vayanam to a muttaiduva.",
        deva: "",
        tel: "వెండి బంగారు కంద దుంపలు, కంద గడ్డ, రవికెల గుడ్డ, లక్క జోళ్ళు, నల్లపూసల తాళ్ళు, దక్షిణ తాంబూలము ముత్తయిదువునకు వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Kanda gadda, silver and gold kanda dumpalu, ravikela gudda, lakka jollu, nallapusala tallu, dakshina, tambulam.",
        deva: "",
        tel: "కంద గడ్డ, వెండి బంగారు కంద దుంపలు, రవికెల గుడ్డ, లక్క జోళ్ళు, నల్లపూసల తాళ్ళు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "kadupu-kadalani-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Kadupu Kadalani Gauri Nomu",
        deva: "",
        tel: "కడుపుకదలనిగౌరీ నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "Removing garbha-dosham; that the pregnancy hold.",
        deva: "",
        tel: "గర్భదోష నివారణ; గర్భము నిలుచుట."
      },
    how: {
        roman: "",
        deva: "",
        tel: ""
      },
    katha: {
        roman: "A somayajulu had one daughter only. He sought matches and gave her to a very poor brahmana boy — poor, but a poor pandita. She served him with great bhakti and showed bhakti to her parents-in-law. After a time she missed her month and all were glad; but the pregnancy did not hold. So it happened many times over. Grieving, she kept Parvati Devi in mind and did punya-karyamulu. One morning Parvati came to her house in the form of an old brahmani. The somayajulu's daughter received her with great respect and asked, humbly, that she take her meal there that day. She agreed. After the meal the old woman told her she had garbha-dosham, taught her the nomu and its udyapana, and went away. She kept that nomu, bore sons like dabbapallu, and lived in gladness.",
        deva: "",
        tel: "ఒక సోమయాజులవారికి ఒక్కతే కూతురు. ఆయన సంబంధములు వెదకి ఒక నిరుపేద బ్రాహ్మణ బాలునికిచ్చి పంపెను. ఆమె భర్త పేదవాడైనను పేద పండితుడు. ఆమె అతిభక్తితో అతనిని సేవించుచు, అత్తమామల యందు భక్తి చూపుచు కాలము గడుపుచుండెను. కొంతకాలమునకు ఆమెకు నెల దప్పెను; అందరూ సంతోషించిరి. కానీ ఆ గర్భము నిలువలేదు. అట్లే ఎన్నో పర్యాయములు గర్భవిచ్ఛిత్తి ప్రాప్తించెను. అందుచే ఆమె దుఃఖించుచు పార్వతీదేవిని తలచుకొని పుణ్యకార్యములు చేయుచుండెను. ఒకనాటి ఉదయమున పార్వతీదేవి ఒక వృద్ధ బ్రాహ్మణివలె ఆమె ఇంటికి వచ్చెను. ఆమెను చూచి సోమయాజులగారి కుమార్తె మిగుల గౌరవించి ఆనాడు తమ ఇంటనే భోజనము చేయవలసినదని వినయవిధేయలతో ప్రార్థించెను. ఆమె అంగీకరించెను. భోజనమైన తరువాత ఆ వృద్ధనారి ఆమెకు గర్భదోషమున్నదని తెలిపి, నోము, ఉద్యాపనము చెప్పి వెళ్ళిపోయెను. తరువాత ఆమె ఆ నోము నోచి దబ్బపళ్ళవంటి కొడుకులను కని సంతోషముగా ఉండెను."
      },
    udyapana: {
        roman: "Twenty-five jilledukayalu are made from five sers of rice flour, filled with coconut purnam or sesame purnam, and cooked carefully so that the bellies do not burst. Then five each are given as vayanam to five muttaiduvas with dakshina and tambulam.",
        deva: "",
        tel: "అయిదు శేర్ల బియ్యపు పిండితో ఇరవై ఐదు జిల్లేడుకాయలు చేసి, వాటిలో కొబ్బరి పూర్ణము గాని నువ్వుపప్పు పూర్ణము గాని పెట్టి, పొట్టలు చెదరకుండా జాగ్రత్తగా వండవలెను. పిమ్మట అయిదేసి చొప్పున అయిదుగురు ముత్తైదువులకు దక్షిణ తాంబూలములతో వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Jilledukayalu, dakshina, tambulam.",
        deva: "",
        tel: "జిల్లేడుకాయలు, దక్షిణ, తాంబూలము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "karalla-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Karalla Gauri Nomu",
        deva: "",
        tel: "కరళ్ళగౌరీ నోము"
      },
    when: {
        roman: "Daily, one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "That what is her own come to her; independence.",
        deva: "",
        tel: "తన సొమ్ము తనకు లభించుట; స్వాతంత్ర్యము."
      },
    how: {
        roman: "Each morning, after bathing, Surya is prayed to: 'I do not want my mother-in-law's wealth, nor my father-in-law's, nor my husband's, nor my children's — give me only what is my own.'",
        deva: "",
        tel: "ప్రతిదినము ఉదయకాలమందే స్నానము చేసి — 'అత్త సొమ్ము వద్దు, మామ సొమ్ము వద్దు, భర్త సొమ్ము వద్దు, బిడ్డల సొమ్ము వద్దు, నా సొమ్మే నాకిమ్ము' అని సూర్యుని ప్రార్థించవలెను."
      },
    katha: {
        roman: "A brahmana had five sons and five daughters-in-law. The youngest kept the karalla gauri nomu, and on that account all of them abounded in wealth. Each morning she bathed and prayed to Surya as above. Seeing it, her parents-in-law, her husband's brothers, her husband and her co-daughters-in-law grew angry. One night while she slept they carried her off, bed and all, left her in a forest and went home. At daybreak she rose and wept, and thinking that God is the refuge of those with no refuge, bathed in a nearby tank and made surya-namaskaram as before — and at once her cupped hands filled with varahalu. She took them, bought all she needed in the next village, and lived comfortably in a house of her own. But from the day she left her husband's house, all of them fell into poverty. One day they came into that forest for firewood, recognised the youngest daughter-in-law at her surya-namaskaram, and asked forgiveness for their fault. She grieved at their condition and forgave them all with warmth. Her parents-in-law and her co-daughters-in-law took up the nomu she kept, and lived in comfort.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు అయిదుగురు కొడుకులు, అయిదుగురు కోడళ్ళు. ఆఖరి కోడలు కరళ్ళ గౌరి నోము నోచుకొనుచుండెను; అందుచేత వాళ్ళందరూ సంపదలతో తులతూగుచుండిరి. ఆ చిన్నది ప్రతిదినము ఉదయమే స్నానము చేసి పైవిధముగా సూర్యుని ప్రార్థించుచుండెడిది. అది చూచి అత్తమామలు, బావలు, మగడు, తోడికోడళ్ళు కోపగించిరి. ఒకనాటి రాత్రి ఆమె నిద్రపోవుచుండగా మంచముతో సహా ఎత్తుకొనిపోయి ఒక అరణ్యములో వదలిపెట్టి వెళ్ళిరి. తెల్లవారగా ఆమె లేచి దుఃఖించి, దిక్కులేనివారికి దేవుడే దిక్కనుకొని ప్రక్క చెరువులో స్నానము చేసి పూర్వమువలెనే సూర్యనమస్కారము చేసినవెంటనే ఆమె దోసిలి నిండా వరహాలు పడినవి. వాటిని తీసుకొని ప్రక్క గ్రామములో కావలసినవన్నీ కొనుకొని సుఖముగా ఒక ఇంటిలో కాపురముండెను. కానీ ఆమె అత్తవారింటిని వదలి వచ్చినది మొదలు వారందరూ దరిద్రులైపోయిరి. ఒకనాడు వారా అడవిలో కట్టెలకు వచ్చి సూర్యనమస్కారము చేయుచున్న చిన్నకోడలిని గుర్తుపట్టి తమ తప్పును క్షమింపమని కోరిరి. ఆమె వారి దుఃస్థితికి విచారించి ఆదరముతో అందరినీ మన్నించెను. ఆమె పట్టిన నోమును అత్తవారు, తోడికోడళ్ళు పట్టి సుఖముగా ఉండిరి."
      },
    udyapana: {
        roman: "After the year, thirteen karallu are placed in a new kancham and given as vayanam to muttaiduvas with a saree and ravikela gudda. 'If the bhakti does not lapse, the fruit does not.'",
        deva: "",
        tel: "ఏడాది నిండిన తరువాత ఒక క్రొత్త కంచములో పదమూడు కరళ్ళు పెట్టి, చీర రవికెలగుడ్డతో ముత్తైదువులకు వాయనమివ్వవలెను. 'భక్తి తప్పకుండిన ఫలము తప్పదు.'"
      },
    vayanam: {
        roman: "Thirteen karallu, saree, ravikela gudda.",
        deva: "",
        tel: "పదమూడు కరళ్ళు, చీర, రవికెలగుడ్డ."
      },
  },
  //
  {
    id: "kalyana-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Kalyana Gauri Nomu",
        deva: "",
        tel: "కల్యాణగౌరీ నోము"
      },
    when: {
        roman: "Daily, three hundred and sixty days.",
        deva: "",
        tel: "ప్రతిదినము — మూడువందల అరవై రోజులు."
      },
    forwhat: {
        roman: "Marriage; nitya kalyanam; children; the fulfilment of what is sought.",
        deva: "",
        tel: "వివాహము; నిత్య కల్యాణము; సంతానము; కామితార్థ సిద్ధి."
      },
    how: {
        roman: "Each day, after bathing, the nomu verse is said and akshatalu placed on the head. One muttaiduva's hair is combed and bottu placed, and she is regarded as Gauri Devi herself and given namaskaram.",
        deva: "",
        tel: "ప్రతిదినము స్నానము చేసి, నోము పద్యము చెప్పి, అక్షతలు నెత్తిన వేసుకొనవలెను. ఒక ముత్తయిదువునకు తల దువ్వి బొట్టు పెట్టి, ఆమెనే సాక్షాత్తు గౌరీదేవిగా భావించి నమస్కరించవలెను."
      },
    katha: {
        roman: "NO KATHA EXISTS. The compiler states plainly that no katha for this nomu was found in any of the works examined. This is not a gap in our record but an absence in the tradition's own.",
        deva: "",
        tel: "ఈ నోమునకు ప్రత్యేకమైన కథ లభించలేదు. పరిశీలనకు తీసుకున్న గ్రంథములలో ఏ ఒక్కదానియందును ఈ నోమునకు కథ కనబడలేదని సంకలనకర్త స్పష్టముగా చెప్పియున్నాడు. ఇది మన సంకలనమునందలి లోపము కాదు — సంప్రదాయము యొక్క నమోదునందే ఉన్న ఖాళీ."
      },
    udyapana: {
        roman: "At the year's end: sugandha dravyamulu, pasupu, kumkuma, fruit, flowers, mettelu, mangalasutram, ravika, saree and tambulam are given as vayanam to a bride who has had mangalasutra dharana.",
        deva: "",
        tel: "సంవత్సరాంతమున సుగంధ ద్రవ్యములు, పసుపు, కుంకుమ, పండ్లు, పూలు, మెట్టెలు, మంగళసూత్రము, రవిక, చీర, తాంబూలము — మంగళసూత్ర ధారణ జరిగిన పెండ్లికుమార్తెకు వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "The bridal set named above.",
        deva: "",
        tel: "పైన చెప్పిన పెండ్లికుమార్తె సామగ్రి."
      },
  },
  //
  {
    id: "katuka-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Katuka Gauri Nomu",
        deva: "",
        tel: "కాటుకగౌరీ నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "Sight; the eyes.",
        deva: "",
        tel: "దృష్టి; కంటిచూపు."
      },
    how: {
        roman: "The nomu is taken up, the katha told, and akshatalu placed on the head for a year.",
        deva: "",
        tel: "నోము పట్టి కథ చెప్పుకొని ఏడాదిపాటు అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "A brahmana woman sat grieving in the forest. Parvati Devi, passing that way, asked, 'Why do you grieve?' She answered: 'Amma, I have no eyes to know who you are. I am blind. Everyone laughs at the sight of me. Unable to bear it I came away here. Being blind, everything seems blind to me — the neighbours blind, my husband blind, all of it blind, they said.' Parvati smiled to herself and said: 'In a former time you took up the katuka gauri nomu and transgressed it, and that is why this trouble came in this birth. Keep that nomu now and your sight will come' — and departed. She felt her way home, kept the nomu, and recovered her sight.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ స్త్రీ అడవిలో కూర్చుని విచారించుచుండెను. ఆ త్రోవన పోవుచున్న పార్వతీదేవి 'ఏమమ్మా విచారించుచున్నావు?' అని అడిగెను. అందుకామె — 'అమ్మా, నీవెవరివో తెలిసికొనుటకు నాకు కండ్లు లేవు. గ్రుడ్డిదానను. నన్ను చూచి అందరూ నవ్వుచున్నారు. ఆ బాధలు పడలేక ఇట్లు వచ్చితిని. గ్రుడ్డిదానను గనుక నాకు సర్వము గ్రుడ్డిదిగనే తోచుచున్నది — ఇరుగుపొరుగు గ్రుడ్డి, మగడు గ్రుడ్డి, అంతా గ్రుడ్డి అని అన్నారు' అనెను. పార్వతీదేవి నవ్వుకొని — 'నీవు పూర్వము కాటుకగౌరి నోము పట్టి ఉల్లంఘన చేయుటచే ఈ జన్మలో ఇట్టి కష్టము వచ్చెను. ఇప్పుడా నోము నోచినచో నీకు దృష్టి వచ్చును' అని వెడలిపోయెను. ఆమె తడుముకొని ఇంటికి వచ్చి నోము నోచుకొని దృష్టిని పొందగలిగెను."
      },
    udyapana: {
        roman: "After the year, a punyavati is given talantu snanam, and a saree, ravikela gudda, a bharini with katuka, dakshina and tambulam.",
        deva: "",
        tel: "సంవత్సరము పూర్తయిన తరువాత ఒక పుణ్యవతికి తలంటి నీళ్ళు పోసి, చీర, రవికెలగుడ్డ, కాటుకతో బరిణి, దక్షిణ తాంబూలములను ఇవ్వవలెను."
      },
    vayanam: {
        roman: "A katuka bharini, saree, ravikela gudda, dakshina, tambulam.",
        deva: "",
        tel: "కాటుక బరిణి, చీర, రవికెలగుడ్డ, దక్షిణ, తాంబూలము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "kailasa-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Kailasa Gauri Nomu",
        deva: "",
        tel: "కైలాసగౌరీ నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "A husband's affection restored.",
        deva: "",
        tel: "భర్త అనురాగము తిరిగి పొందుట."
      },
    how: {
        roman: "At a Parvati temple or on a river bank, five kunchams of kumkuma and five of pasupu are taken, and a double handful of each distributed to muttaiduvas.",
        deva: "",
        tel: "పార్వతీదేవి ఆలయమునందు గాని, నదీతీరమునందు గాని అయిదు కుంచాల కుంకుమ, అయిదు కుంచాల పసుపు తీసుకొని, దోసెడు పసుపు, దోసెడు కుంకుమ ముత్తైదువులకు పంచిపెట్టవలెను."
      },
    katha: {
        roman: "In a certain kingdom a maharaja raised his daughter with great care and, when she came of age, searched many lands for the most handsome match and married her with great splendour. Her husband kept company with courtesans and did not look after her. Deprived of his affection she grieved greatly. The maharaja too was troubled and prayed to Parameshwara; and she prayed constantly to Parvati Devi. One day near dawn Parvati appeared in a dream: 'Rajakumari, grieving is of no use. Keep the Kailasa Gauri nomu. Your life will come right, and you will have your husband's affection.' She kept it as told. In consequence her husband's attachment to the courtesan fell away, and love and affection for his wife arose. Those who saw them afterwards praised them as Parvati and Parameshwara.",
        deva: "",
        tel: "ఒక రాజ్యమున మహారాజు తన కుమార్తెను గారాబముగా పెంచి, యుక్తవయస్సు రాగానే దేశదేశాలు గాలించి అత్యంత సుందరాంగుడిని వెతికి వైభవముగా వివాహము జరిపించెను. ఆమె భర్త వేశ్యాలోలుడు; భార్యను సరిగా చూసేవాడు కాడు. భర్త అనురాగానికి దూరమై ఆమె ఎంతగానో దుఃఖించుచుండెను. మహారాజు కూడ బాధపడుచు పరమేశ్వరుని ప్రార్థించేవాడు. ఆ చిన్నదియు పార్వతీదేవిని నిరంతరము ప్రార్థించుచుండెను. ఒకనాటి వేకువజామున పార్వతీదేవి కలలో కనిపించి — 'రాకుమారీ! దుఃఖించిన ప్రయోజనము లేదు. కైలాసగౌరి నోము నోచుకో. నీ బ్రతుకు సరియౌతుంది; భర్త అనురాగము పొందగలుగుతావు' అని చెప్పినది. ఆ ప్రకారము ఆమె నోము నోచినది. ఫలితముగా భర్తకు వెలయాలిపై మమతానురాగములు తొలగిపోయినవి; భార్యపట్ల ప్రేమ, అనురాగము కలిగినవి. వారిని చూచినవారు పార్వతీపరమేశ్వరులని ప్రశంసించేవారు."
      },
    udyapana: {
        roman: "Pasupu, kumkuma, dakshina, tambulam and flowers are distributed to muttaiduvas and their blessing received.",
        deva: "",
        tel: "ముత్తైదువులకు పసుపు, కుంకుమ, దక్షిణ, తాంబూలము, పుష్పములు పంచిపెట్టి వారి ఆశీస్సులు పొందవలెను."
      },
    vayanam: {
        roman: "Pasupu, kumkuma, flowers, dakshina, tambulam.",
        deva: "",
        tel: "పసుపు, కుంకుమ, పుష్పములు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "gadapa-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Gadapa Gauri Nomu",
        deva: "",
        tel: "గడపగౌరి నోము"
      },
    when: {
        roman: "Daily in the morning, for one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము ఉదయము."
      },
    forwhat: {
        roman: "That no gandam too great to pass may come; the karuna of Gauri and Shankara.",
        deva: "",
        tel: "గడువరానంత గండములు ఉండకుండుట; గౌరీశంకరుల కరుణ."
      },
    how: {
        roman: "Each morning, pasupu is applied to a house threshold and three kumkuma bottlu placed on it. So for one year.",
        deva: "",
        tel: "ప్రతిదినము ఉదయము ఒక ఇంటి గడపకు పసుపు రాసి మూడు కుంకుమ బొట్లు పెట్టవలెను. అట్లు ఒక సంవత్సరము."
      },
    katha: {
        roman: "The verse is recited and akshatalu worn: for the woman who keeps the gadapa gauri nomu there is no gandam too great to pass, no want of the karuna of Gauri and Shankara, no bhagyam beyond her reach. (This nomu has no narrative katha but a verse.)",
        deva: "",
        tel: "గడపగౌరి నోము నోచిన పడతికి గడువరానంతటి గండములుండవు, గౌరీశంకరుల కరుణకు కొదవుండదు, బడయగలేనట్టి భాగ్యములుండవు — అని పఠించి అక్షతలు ధరించవలెను. (ఈ నోమునకు కథ లేదు; పద్యమే ఉన్నది.)"
      },
    udyapana: {
        roman: "In a platter: thirteen pairs of garelu, a new saree, a ravikela gudda, mangalasutralu, rupu, mettelu, pasupu and kumkuma, given with dakshina and tambulam as vayanam to a muttaiduva.",
        deva: "",
        tel: "ఒక పళ్ళెములో పదమూడు జతల గారెలు, ఒక కొత్త చీర, ఒక రవికెల గుడ్డ, మంగళసూత్రాలు, రూపు, మెట్టెలు, పసుపు, కుంకుమ ఉంచి దక్షిణ తాంబూలములతో ఒక ముత్తైదువుకు వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Garelu, saree, ravikela gudda, mangalasutralu, mettelu, pasupu, kumkuma.",
        deva: "",
        tel: "గారెలు, చీర, రవికెల గుడ్డ, మంగళసూత్రాలు, మెట్టెలు, పసుపు, కుంకుమ."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "gajula-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Gajula Gauri Nomu",
        deva: "",
        tel: "గాజులగౌరీ నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "To be dear to all — that mother-in-law, father-in-law, husband, husband's sisters and co-daughters-in-law all look on her with love.",
        deva: "",
        tel: "అందరికీ ప్రియురాలగుట — అత్త, మామ, మగడు, ఆడపడుచులు, తోడికోడళ్ళు అందరూ ప్రేమతో చూచుట."
      },
    how: {
        roman: "",
        deva: "",
        tel: ""
      },
    katha: {
        roman: "A brahmana's daughter-in-law took up the gajula gauri nomu and transgressed it. Because of that everyone bristled at the sight of her — mother-in-law, father-in-law, husband, husband's sisters, co-daughters-in-law, all of them. Then the young woman went grieving into the forest and wandered there. Parvati and Parameshwara, come to look over the earth, saw her and asked, 'What is it? Why do you wander grieving so?' She said: 'The neighbours, my parents-in-law, my husband — all are angry at the sight of me. If everyone is angry, how am I to live? So I wander here.' Parvati Devi said: 'It is not so, amma. You took up the gajula gauri nomu and transgressed it. That is the reason everyone who sees you is angry. If you take up that nomu again and do the udyapana, all will look on you with love.' Accordingly she went home, kept that nomu and did the udyapana in due form; and from then she was dear to everyone.",
        deva: "",
        tel: "ఒక బ్రాహ్మణుని కోడలు గాజుల గౌరి నోము పట్టి ఉల్లంఘనము చేసెను. అందుచేత ఆమెను చూచి అంతా చిటపటలాడుచుండేవారు — అత్త, మామ, మగడు, ఆడపడుచులు, తోడికోడళ్ళు అందరూ. అప్పుడు ఆ చిన్నది విచారించుచు అడవిలోకి పోయి తిరుగుచుండెను. అంతట పార్వతీపరమేశ్వరులు భూమి పాలించుటకు వచ్చి ఆమెను చూచి — 'ఏమి? అట్లా విచారించుచు తిరుగుచున్నావు?' అని అడిగిరి. అందుకు ఆమె — 'ఇరుగుపొరుగు, అత్తామామా, మగడు నన్ను చూస్తే కోపంగా ఉంటారు. అందరికీ కోపమైతే ఎట్లు బ్రతకనని ఇలా తిరుగుచున్నాను' అని చెప్పెను. 'అలా కాదమ్మా! నీవు గాజుల గౌరి నోము పట్టి ఉల్లంఘన చేసినావు. ఆ కారణమున నిన్ను చూచిన అందరికీ కోపముగా ఉన్నది. నీవు తిరిగి ఆ నోము పట్టి ఉద్యాపన చేసుకుంటే నిన్ను అంతా ప్రేమతో చూస్తారు' అని పార్వతీదేవి చెప్పెను. ఆ ప్రకారము ఆమె ఇంటికి వెళ్ళి ఆ నోము నోచుకొని యథావిధిగా ఉద్యాపన చేసికొనగా, అప్పటినుండి ఆమె అందరికీ ఇష్టము కలదయ్యెను."
      },
    udyapana: {
        roman: "A muttaiduva is brought, the bangles she likes are put on her, she is given talantu snanam, a saree and ravikela gudda, and fed with pindivantalu. 'Though the bhakti lapse, the fruit does not. Though the katha be faulty, the vratam must not be.'",
        deva: "",
        tel: "ఒక ముత్తైదువును తీసుకొని వచ్చి ఆమెకు ఇష్టమైన గాజులు తొడిగించి, తలంటి నీళ్ళు పోసి, చీర రవికెలగుడ్డ ఇచ్చి, పిండివంటలతో భోజనము పెట్టవలెను. 'భక్తి తప్పినా ఫలము తప్పదు. కథ లోపమైననూ వ్రతలోపము కాకూడదు.'"
      },
    vayanam: {
        roman: "Bangles, saree, ravikela gudda, and a meal with pindivantalu.",
        deva: "",
        tel: "గాజులు, చీర, రవికెలగుడ్డ, పిండివంటలతో భోజనము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "gummadi-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Gummadi Gauri Nomu",
        deva: "",
        tel: "గుమ్మడిగౌరీ నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "The husband's life; the protection of aidotanam.",
        deva: "",
        tel: "భర్తకు ఆయుష్షు; అయిదోతనము కాపాడుకొనుట."
      },
    how: {
        roman: "The katha is told and akshintalu placed on the head. A fruit with dakshina and tambulam is given as vayanam to one muttaiduva.",
        deva: "",
        tel: "కథ చెప్పుకొని తలపై అక్షింతలు వేసుకోవాలి. ఒక ముత్తయిదువుకు దక్షిణ తాంబూలాలతో ఒక పండును వాయనమివ్వాలి."
      },
    katha: {
        roman: "A brahmana in a certain village lived by reading jatakas. He had one son only. Learning that the boy was short-lived and would die in his youth, he was stricken. He resolved that if the boy were to come through, he must be married to a girl of real bhakti who would remain a sumangali her full hundred years. When the boy came of age he married him to the girl he had already sought out, told her at what hour the danger to his life stood, and made plain that the responsibility of saving him was hers. She decided to place the matter before the Amma she had worshipped since childhood, and went with her husband and the puja articles to the vigraham established under a tree in the forest. Parvati Devi, already knowing her devotee's trouble, was sitting near that tree in the form of an old woman. She asked what the trouble was, and told her that by keeping the Gummadi Gauri nomu she could save her husband, and gave her the vidhi. The girl searched the surroundings and brought three gummadikayalu at once. She took from her bag the pasupu, kumkuma and ravikela gudda she had brought from home, and — regarding that old woman as Gauri Devi herself — gave them as vayanam, praying in tears that her aidotanam be protected. The heart of the Amma in disguise melted. She blessed her, 'dirgha sumangali bhava', and vanished. The blessing was not in vain, and the danger to her husband's life passed. From then this nomu came into practice.",
        deva: "",
        tel: "ఒక ఊరిలో జాతకాలు చూచుకొని జీవించే బ్రాహ్మణుడు ఉండేవాడు. ఆయనకు ఒక్కడే కుమారుడు. ఆ కుమారుడు అల్పాయుష్కుడని, యుక్తవయసులోనే మరణిస్తాడని తెలిసి తల్లడిల్లిపోయాడు. ఆ గండం గట్టెక్కాలంటే భక్తిశ్రద్ధలు గల, నిండు నూరేళ్ళు సుమంగళిగా ఉండగల యువతితో వివాహం చేయాలని నిశ్చయించుకున్నాడు. కుమారునికి యుక్తవయసు రాగానే ముందుగా వెదకి ఉంచిన అమ్మాయితో పెళ్ళి జరిపించి, ఏ సమయాన ప్రాణగండం ఉన్నదో ఆమెకు చెప్పి, భర్తను కాపాడుకొను బాధ్యత ఆమెదేనని స్పష్టం చేశాడు. ఆ కోడలు చిన్నప్పటినుండి తాను పూజించే అమ్మవారికే మొరపెట్టుకోవాలని, భర్తను, పూజాసామగ్రిని తీసుకొని అడవిలో చెట్టుక్రింద ప్రతిష్ఠితమైన అమ్మవారి విగ్రహం వద్దకు వెళ్ళింది. తన భక్తురాలి కష్టము ముందే తెలిసిన పార్వతీదేవి వృద్ధురాలి వేషమున ఆ చెట్టు సమీపమున కూర్చొని ఉన్నది. ఆమె కష్టము అడిగి తెలిసికొని — 'గుమ్మడిగౌరీ నోము నోచుకొన్నచో భర్తను కాపాడుకొనవచ్చు' అని విధివిధానములు చెప్పింది. ఆ యువతి వెంటనే చుట్టుపక్కల వెదకి మూడు గుమ్మడికాయలు తెచ్చినది. ఇంటినుండి తెచ్చిన పసుపు కుంకుమలను, రవికెల గుడ్డను సంచీలోనుండి తీసి, ఆ వృద్ధురాలినే గౌరీదేవిగా భావించి వాయనమిచ్చి, తన అయిదోతనము కాపాడమని కన్నీళ్ళతో ప్రార్థించింది. మారువేషమున ఉన్న అమ్మవారి మనసు కరిగినది. 'దీర్ఘ సుమంగళీ భవ' అని దీవించి అంతర్ధానమైనది. ఆ దీవెన వృథా కాదు గనుక ఆ యువతి భర్తకు ప్రాణగండము గడిచినది. అది మొదలు ఈ నోము ప్రచారములోనికి వచ్చినది."
      },
    udyapana: {
        roman: "",
        deva: "",
        tel: ""
      },
    vayanam: {
        roman: "Three gummadikayalu, pasupu, kumkuma, ravikela gudda; a fruit with dakshina and tambulam.",
        deva: "",
        tel: "మూడు గుమ్మడికాయలు, పసుపు, కుంకుమ, రవికెల గుడ్డ; ఒక పండుతో దక్షిణ తాంబూలము."
      },
  },
  //
  {
    id: "grahana-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Grahana Gauri Nomu",
        deva: "",
        tel: "గ్రహణగౌరీ నోము"
      },
    when: {
        roman: "From the moment the solar eclipse begins; then nine days.",
        deva: "",
        tel: "సూర్యగ్రహణము పట్టిన క్షణము మొదలు; తరువాత తొమ్మిది రోజులు."
      },
    forwhat: {
        roman: "The removal of a fault carried from a former birth.",
        deva: "",
        tel: "పూర్వజన్మ దోష నివారణ."
      },
    how: {
        roman: "At the moment the eclipse begins, pasupu, kumkuma, rice, flour, cotton, bellam, aaku and poka are placed in the pandiri. As soon as the eclipse releases, they are brought into the house. From the next day, for nine days, Gauri is worshipped: nine padmas made, jyotis lit with nine wicks, and nine atlu offered.",
        deva: "",
        tel: "గ్రహణము పట్టిన క్షణమున పసుపు, కుంకుమ, బియ్యము, పిండి, ప్రత్తి, బెల్లం, ఆకు, పోక పందిరిలో పెట్టవలెను. గ్రహణము విడిచినంతనే వాటిని ఇంటిలో పెట్టవలెను. ఆ తరువాత రోజునుండి తొమ్మిది రోజులు గౌరిని పూజించి, తొమ్మిది పద్మములు చేసి, తొమ్మిది వత్తులతో జ్యోతులు వెలిగించి, తొమ్మిది అట్లు నైవేద్యము పెట్టవలెను."
      },
    katha: {
        roman: "A brahmana had four sons and one daughter. From her birth the girl was a child by day and worms by night. Her mother would gather the worms through the night and guard them, and by morning they would come together again as the child. Once her brother came to take her to her parents' home, but wishing to keep the child's condition from being known she did not go. So it happened many times. But before a festival the eldest brother insisted. Having no choice, she called her four daughters-in-law and asked them to watch the children; three refused, the youngest agreed. Then she told the youngest the secret of her daughter — at night to lay her bed beside the pit and gather the worms inside without one straying, and guard them — and went away. The young wife kept her word, guarding as the eyelid guards the eye, and did not even go to her husband at night. Four days passed. Not knowing the reason, her husband grew suspicious, and on the fifth day sat on the attic watching. As darkness fell he saw the child turn to worms, and his wife gathering them into the pit and staying awake all night. He asked what the secret was; she did not know it, and could only tell him her mother-in-law's instruction. Hearing that, determined to learn the secret, he went to the forest and began tapas. Parvati and Parameshwara, passing that way, asked the cause and he told them. Then Parvati said: 'Young man, in a former birth your sister, being rajasvala, brought that dosham into the house. As the fruit of that papam she becomes worms by night in this birth.' He fell at her feet asking how the affliction might be lifted. 'Have your sister keep the Grahana Gauri nomu; then the affliction will go' — and she vanished. He came home, had his sister keep it, and she was free of the dosham and kept the form of a girl by night as by day. All rejoiced at the young wife's faithfulness, the son's persistence and Parvati Devi's grace, and lived in comfort.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు నలుగురు కొడుకులు, ఒక కూతురు. ఆ పిల్ల పుట్టినది మొదలు పగలు పిల్లగను, రాత్రి పురుగులగను అగుచుండెడిది. తల్లి రాత్రులంతా ఆ పురుగులను పోగుచేసి కాపాడుచుండగా తెల్లవారుసరికి అవన్నీ చేరి పిల్లగా అగుచుండెను. ఒకసారి ఆమె అన్నగారు పుట్టింటికి తీసుకువెళ్ళవలెనని వచ్చెను; కానీ బిడ్డ పరిస్థితి బయల్పడకుండ కాపాడదలచి ఆమె వెళ్ళలేదు. అట్లు అనేక పర్యాయములు. కానీ పండుగముందు పెద్దన్నగారు పట్టుదలతో తీసుకువెళ్ళదలచెను. చేయునది లేక ఆమె నలుగురు కోడండ్రను పిలిచి పిల్లలను చూడమని కోరెను; ముగ్గురు అంగీకరించలేదు, చిన్నకోడలు ఒప్పుకొనెను. అప్పుడామె చిన్నకోడలితో కూతురి రహస్యమును చెప్పి — రాత్రివేళ గుంటదగ్గర ప్రక్కవేసి ఒక్క పురుగైనా చెదరకుండా లోనికి ప్రోగుచేసి కాపాడవలెనని బహు రహస్యముగా చెప్పి వెళ్ళెను. ఆ చిన్నకోడలు వాగ్దానము ప్రకారము కంటికి రెప్పవలె కాపాడుచు, రాత్రులందు భర్త దగ్గరకైనా వెళ్ళకుండెను. నాలుగు దినములు గడిచెను. సంగతి తెలియక భర్త అనుమానించి, అయిదవనాడు అటకమీద కూర్చుండి కనిపెట్టుచుండెను. చీకటిపడగానే పిల్ల పురుగులుగా మారుటయు, భార్య వాటిని గుంటలోకి ప్రోగుచేయుచు రాత్రంతా నిద్రలేకుండుటయు చూచి రహస్యమేమని అడిగెను; ఆమెకు తెలియనందున అత్తగారి ఆజ్ఞను మాత్రమే చెప్పెను. అది విని అతడు రహస్యము గ్రహించవలెనని అరణ్యమునకు పోయి తపస్సు చేయసాగెను. ఆ త్రోవను పోవుచున్న పార్వతీపరమేశ్వరులు కారణమడుగగా అతడు తెలిపెను. అప్పుడు పార్వతి — 'ఓ చిన్నవాడా! నీ చెల్లెలు పూర్వజన్మమందు రజస్వలయై ఆ దోషమును ఇంట కలిపెను. ఆ పాపఫలముగా ఈ జన్మమున రాత్రివేళ పురుగులగుచున్నది' అని చెప్పెను. అతడు 'ఆ పీడ ఎట్లు తొలగునో సెలవిమ్ము' అని పాదములపై వ్రాలగా — 'నీ చెల్లెలితో గ్రహణ గౌరీ నోము నోపించుము; అప్పుడు ఆ పీడ తొలగగలదు' అని చెప్పి అదృశ్యమైనది. అతడు ఇంటికివచ్చి చెల్లితో ఆ నోము నోపించగా ఆమె దోషరహితయై రాత్రింబవళ్ళు బాలికారూపమునే ఉండెను. కోడలి విశ్వాసమునకు, కొడుకు పట్టుదలకు, పార్వతీదేవి దయకు అందరూ సంతోషించి సుఖముగా ఉండిరి."
      },
    udyapana: {
        roman: "On the last day, aakulu, pokalu and atlu are placed in a new sieve, covered with an old sieve, and given as vayanam to muttaiduvas.",
        deva: "",
        tel: "ఆఖరి రోజున ఆకులు, పోకలు, అట్లు క్రొత్త జల్లెడలో పెట్టి పాత జల్లెడ మూత వేసి ముత్తైదువులకు వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Aakulu, pokalu, atlu — in a new sieve.",
        deva: "",
        tel: "ఆకులు, పోకలు, అట్లు — క్రొత్త జల్లెడలో."
      },
  },
  //
  {
    id: "chikkulla-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Chikkulla Gauri Nomu",
        deva: "",
        tel: "చిక్కుళ్ళగౌరీ నోము"
      },
    when: {
        roman: "Through one year.",
        deva: "",
        tel: "ఏడాది పొడుగునా."
      },
    forwhat: {
        roman: "That she not be parted from the child she has carried; kadupu chaluva; that there be no separation from her husband.",
        deva: "",
        tel: "ఎత్తిన బిడ్డను ఎడబాయకుండుట; కడుపు చలువ; కాంతుని ఎడబాటు లేకుండుట."
      },
    how: {
        roman: "The nomu verse is said and akshatalu placed through the year — 'I shall give vayanam of silver chikkullu, I shall distribute chikkullu of gold.'",
        deva: "",
        tel: "నోము పద్యము చెప్పుకొని ఏడాది పొడుగునా అక్షతలు వేసుకొనవలెను. 'వెండి చిక్కుళ్ళ వాయనాలిచ్చెదను, బంగారు చిక్కుళ్ళు పంచిపెట్టెదను' అని."
      },
    katha: {
        roman: "This nomu has no narrative katha but a verse.",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; పద్యమే ఉన్నది."
      },
    udyapana: {
        roman: "A woman is given talantu snanam and fed, and given a saree and ravikela gudda with a golden chikkudu flower as vayanam.",
        deva: "",
        tel: "ఒక స్త్రీకి తలంటి నీళ్ళు పోసి భోజనము పెట్టి, చీర రవికెలగుడ్డతో ఒక బంగారు చిక్కుడు పువ్వును పెట్టి వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "A golden chikkudu flower, saree, ravikela gudda.",
        deva: "",
        tel: "బంగారు చిక్కుడు పువ్వు, చీర, రవికెలగుడ్డ."
      },
  },
  //
  {
    id: "tavudu-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Tavudu Gauri Nomu",
        deva: "",
        tel: "తవుడుగౌరీ నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "A full household — that she not be parted from parents-in-law, parents, kin or children.",
        deva: "",
        tel: "నిండు సంసారము — అత్తమామలు, తల్లితండ్రులు, బంధువులు, బిడ్డలు ఎడబాయకుండుట."
      },
    how: {
        roman: "The katha is told and akshatalu placed on the head.",
        deva: "",
        tel: "కథ చెప్పుకొని అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "A fortunate woman, though eighty years old, lived in gladness without being parted from her parents-in-law, her parents, her kin or her children. The townspeople wondered and asked her, 'What nomu did you keep, amma? You have a full household and have lost no one.' She answered: 'Ammalara, this is the fruit of a nomu RECEIVED as vayanam, not of one kept. Long ago my mother kept the tavudu gauri nomu and gave me its vayanam. All this is the coolness of that vayanam.' Hearing this they thought — if merely receiving the vayanam gives so much, how much more must keeping the nomu give — and from then they kept it and flourished in long life, health and wealth.",
        deva: "",
        tel: "ఒక భాగ్యశాలి ఎనుబది ఏళ్ళ వృద్ధురాలై ఉన్నప్పటికీ అత్తమామలను, తల్లితండ్రులను, బంధువులను, బిడ్డలను ఎడబాయక సంతోషముగా ఉండెను. ఊరివారందరూ ఆశ్చర్యపడి 'ఏమి నోచితివమ్మా! ఎవరినీ వదలకుండా నిండు సంసారముతో ఉన్నావు' అని అడిగిరి. ఆమె — 'అమ్మలారా! ఇది వాయనమందిన నోము ఫలమే కాని, నోచిన ఫలము కాదు. పూర్వము మా అమ్మ తవుడు గౌరి నోము నోచుకొని నాకు వాయనము ఇచ్చినది. ఇదంతయు వాయనపు చలువే' అని చెప్పెను. అది విని వారు — వాయనమందితేనే ఇంత ఫలమైతే, నోము నోచినచో ఇంకెంత ఫలమో కదా అని అనుకొని ఆ నోము నోచుకొనుచు దీర్ఘాయురారోగ్య ఐశ్వర్యములతో విలసిల్లుచుండిరి."
      },
    udyapana: {
        roman: "A tavva filled with rice, covered over lightly with tavudu (bran), given as vayanam to a punyastri with a saree or ravikela gudda.",
        deva: "",
        tel: "తవ్వ నిండుగా బియ్యము పోసి పైన కొద్దిగా తవుడుతో కప్పి, చీరతోనో రవికెలగుడ్డతోనో పుణ్యస్త్రీకి వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Rice, bran, saree or ravikela gudda.",
        deva: "",
        tel: "బియ్యము, తవుడు, చీర లేదా రవికెలగుడ్డ."
      },
  },
  //
  {
    id: "dhairya-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Dhairya Gauri Nomu",
        deva: "",
        tel: "ధైర్యగౌరీ నోము"
      },
    when: {
        roman: "The lamp may be lit at any time in Bhadrapada, Ashwina, Kartika or Margashirsha.",
        deva: "",
        tel: "భాద్రపద, ఆశ్వయుజ, కార్తీక, మార్గశిర మాసములలో ఎప్పుడైనను దీపము వెలిగించవచ్చును."
      },
    forwhat: {
        roman: "Courage; the going of fear.",
        deva: "",
        tel: "ధైర్యము; భయము తొలగుట."
      },
    how: {
        roman: "A wick is made of a varaha's weight of bhamidi cotton in nine giddes of cow ghee and lit; the katha is told and akshatalu placed. Rice is cooked in five solas of cow milk and offered, and that prasadam is eaten by herself and not given to others.",
        deva: "",
        tel: "తొమ్మిది గిద్దెల ఆవునేతితో ఒక వరహా ఎత్తు భమిడిపత్తితో వత్తి చేసి వెలిగించి, కథ చెప్పుకొని అక్షతలు వేసుకొనవలెను. అయిదు సోలల ఆవుపాలలో బియ్యము వేసి వండి నైవేద్యము పెట్టి, ఆ ప్రసాదమును ఇతరులకు పెట్టకుండా తానే భుజించవలెను."
      },
    katha: {
        roman: "A king's daughter was exceedingly fearful. Though all her companions were bold, she was a coward. Her parents took heart, saying it was only childishness and would pass when she grew. But when she came of age and went to live with her husband she was fearful still; if spoken to, or given work, she wept. Her husband, wearied by it, said 'a man who laughs and a woman who weeps are not to be trusted' and left her at her parents' house. Her parents grieved and worshipped Shankara; and one day that Swami came in the form of an old brahmana and said that in a former birth she had kept the dhairya gauri nomu and transgressed it, and that was why she was a coward in this birth; if she kept that nomu, courage would come. And he vanished. They marvelled, took joy that Parameshwara himself had given the word, and had their daughter keep it in due form. From then she was full of courage. Her husband learned of it, was glad, took her to his house, and lived in comfort.",
        deva: "",
        tel: "ఒక రాచకూతురు మిక్కిలి భయస్తురాలై ఉండెను. చెలికత్తెలందరూ ధైర్యముగా ఉన్నను ఆమె పిరికిపంద. చిన్నతనము వలననే భయపడుచున్నది, పెద్దదైన పోవును అని తల్లితండ్రులు ధైర్యపడిరి. యుక్తవయస్కురాలై భర్తతో కాపురమునకు వెళ్ళిననూ భయస్తురాలై ఉండెను; పలుకరించినను, పని చెప్పినను ఏడ్చుచుండెను. అది చూచి భర్తకు విసుగువచ్చి 'నవ్వెడి మగవానిని, ఏడ్చెడి ఆడదానిని నమ్మరాదు' అనుకొని ఆమెను పుట్టింటి దగ్గర వదలిపెట్టెను. తల్లితండ్రులు పరితపించి శంకరుని పూజించుచుండగా ఒకనాడు ఆ స్వామి ముసలి బ్రాహ్మణ రూపమున వచ్చి — ఆ యువతి పూర్వజన్మమునందు ధైర్యగౌరి నోము నోచి ఉల్లంఘన చేయుటచే ఈ జన్మలో పిరికిపంద అయ్యెననియు, ఆ నోము నోపించినచో ధైర్యము కలుగుననియు చెప్పి మాయమయ్యెను. వారు ఆశ్చర్యపడి, పరమేశ్వరుడే ఆనతిచ్చెనని సంతోషించి పుత్రికతో యథావిధిగా చేయించిరి. అప్పటినుండి ఆమె ధైర్యసంపన్నురాలయ్యెను. ఆ సంగతి భర్త తెలుసుకొని సంతోషించి ఆమెను తన ఇంటికి తీసుకుపోయి సుఖముగా ఉండెను."
      },
    udyapana: {
        roman: "'Though the method may lapse, if the bhakti does not, the fruit does not.'",
        deva: "",
        tel: "'పద్ధతి తప్పినను భక్తి తప్పకపోయిన యెడల ఫలము తప్పదు.'"
      },
    vayanam: {
        roman: "",
        deva: "",
        tel: ""
      },
  },
  //
  {
    id: "pasupu-nomu-gauri",
    deity: "devi",
    name: {
        roman: "Pasupu Nomu Gauri",
        deva: "",
        tel: "పసుపు నోము (గౌరీ)"
      },
    when: {
        roman: "Daily, one year.",
        deva: "",
        tel: "ప్రతిదినము — ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "A husband who stays; steadiness in the household.",
        deva: "",
        tel: "భర్త ఇంటిపట్టున నిలుచుట; సంసారమున స్థిరత్వము."
      },
    how: {
        roman: "Rise at dawn and bathe. Five kunchams of pasupu and five of kumkuma are made ready and distributed to muttaiduvas. MAUNA DHARANA while giving is essential — it is given without speaking. Kumkuma puja to Gauri Devi and annadanam follow.",
        deva: "",
        tel: "ప్రాతఃకాలమున లేచి స్నానము చేసి, అయిదు కుంచముల పసుపు, అయిదు కుంచముల కుంకుమ సిద్ధము చేసుకొని ముత్తయిదువులకు పంచవలెను. పంచే సమయమున మౌనధారణ ముఖ్యము — మాటలాడకుండా ఇవ్వవలెను. అనంతరము గౌరీదేవికి కుంకుమపూజ చేయించి అన్నదానము చేయవలెను."
      },
    katha: {
        roman: "In a certain village a wealthy komati married his daughter to a groom of their own community. Some while after the marriage her husband, without steadiness, restless, would not stay at home but wandered the country. She grieved, and prayed to Gauri and Shankara: 'Adi dampatulu! Is there no way past my trouble?' One day Shiva appeared to her in a dream — 'Foolish girl, do not lose heart. The time will come round. Keep the pasupu-kumkuma nomu' — told her how, and vanished. She kept it as he said. By morning her husband stood before her, smiling, entirely at peace.",
        deva: "",
        tel: "ఒక గ్రామమున ధనవంతుడైన కోమటి తన కుమార్తెను కులస్తుడైన వరునికిచ్చి వివాహము చేసెను. వివాహమైన కొన్నాళ్ళకు ఆమె భర్త స్థిరత్వము లేక, చంచలుడై ఇంటిపట్టున ఉండక దేశదిమ్మరిలా తిరుగుచుండెను. ఆమె బాధపడి గౌరీశంకరులను ప్రార్థించి — 'ఆది దంపతులారా! నా కష్టము గట్టెక్కే మార్గమే లేదా?' అని వినయముగా అడిగెను. ఒకనాడు శివుడు కలలో కనిపించి — 'పిచ్చిదానా! అధైర్యపడకు. తప్పక కాలము కలిసివచ్చును. పసుపు-కుంకుమల నోము నోచుకో' అని వివరములు చెప్పి అదృశ్యమయ్యెను. ఆమె ఆ ప్రకారము నోము నోచెను. తెల్లవారేసరికి ఆమెకు ఎదురుగా భర్త మందహాసముతో, పరమ శాంతముగా నిలబడి ఉండెను."
      },
    udyapana: {
        roman: "Repeated at the year's end.",
        deva: "",
        tel: "సంవత్సరాంతమున పునరావృత్తి."
      },
    vayanam: {
        roman: "Pasupu and kumkuma, given in silence.",
        deva: "",
        tel: "పసుపు, కుంకుమ — మౌనముగా ఇవ్వవలెను."
      },
  },
  //
  {
    id: "kunkuma-nomu-gauri",
    deity: "devi",
    name: {
        roman: "Kunkuma Nomu Gauri",
        deva: "",
        tel: "కుంకుమ నోము (గౌరీ)"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "Averting widowhood; sowbhagyam.",
        deva: "",
        tel: "వైధవ్య నివారణ; సౌభాగ్యము."
      },
    how: {
        roman: "The katha is told and akshatalu placed on the head through the year.",
        deva: "",
        tel: "కథ చెప్పుకొని ఏడాది పొడుగునా అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "To a brahmana, after long waiting, a daughter was born. Her jataka showed she would be widowed in girlhood. So without marrying her he took her to Kashi and prayed to Parvati Devi. The compassionate Parvati appeared and asked what he wanted; he prayed that widowhood not come to his daughter. Then the mother of the world said: 'Brahmana, in a former birth your daughter kept the kunkuma gauri nomu and transgressed it, and that is why child-widowhood comes to her in this birth. Have her keep that nomu now and the trouble will not come.' He made namaskaram, had her keep it, and afterwards married her. By the fruit of that nomu she remained sowbhagyavati and lived in comfort.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు లేక లేక ఒక కూతురు కలిగెను. ఆమె జాతకము చూడగా బాలవితంతువు అగునని ఉన్నది. అందుచే అతడు ఆమెకు వివాహము చేయకుండా కాశీకి తీసుకువెళ్ళి పార్వతీదేవిని ప్రార్థించెను. దయామయియగు పార్వతీదేవి ప్రత్యక్షమై 'నీకేమి కావలెను?' అని అడుగగా, కుమార్తెకు వైధవ్యము ప్రాప్తించకుండునట్లు చేయమని ప్రార్థించెను. అప్పుడా లోకజనని — 'ఓయీ బ్రాహ్మణోత్తమా! నీ కుమార్తె పూర్వజన్మమున కుంకుమగౌరి నోము నోచి ఉల్లంఘించుటచే ఈ జన్మలో బాలవైధవ్యము ప్రాప్తించుచున్నది. ఇప్పుడు ఆమెచేత ఆ నోము నోయించినచో ఆ కష్టము సంభవించదు' అని చెప్పెను. అతడు నమస్కరించి ఆమెచే నోము నోయించి పిమ్మట వివాహము చేసెను. ఆ నోము ఫలముచే ఆమె సౌభాగ్యవతియై సుఖముగా ఉండెను."
      },
    udyapana: {
        roman: "Thirteen bharinelu filled with kumkuma, with nallapusalu, lakka jollu, dakshina and tambulam, given as vayanam to thirteen punyakantalu.",
        deva: "",
        tel: "పదమూడు భరిణెల నిండా కుంకుమ పోసి, నల్లపూసలు, లక్కజోళ్ళు, దక్షిణ తాంబూలములు పెట్టి పదముగ్గురు పుణ్యకాంతలకు వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Kumkuma bharinelu, nallapusalu, lakka jollu, dakshina, tambulam.",
        deva: "",
        tel: "కుంకుమ భరిణెలు, నల్లపూసలు, లక్కజోళ్ళు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "laksha-pasupu-nomu",
    deity: "devi",
    name: {
        roman: "Laksha Pasupu Nomu",
        deva: "",
        tel: "లక్ష పసుపు నోము"
      },
    when: {
        roman: "It need not be done in a single day; the giving may go on in hundreds or thousands until the lakh is complete.",
        deva: "",
        tel: "ఒకే దినమున చేయవలసిన అవసరము లేదు; వందలు లేక వేల చొప్పున పంచుచు లక్ష సంఖ్య పూర్తియగువరకు కొనసాగించవచ్చును."
      },
    forwhat: {
        roman: "Aidavatanam for a lakh of thousands of years, kadupu-chaluva, akshaya bhagyam, and the attaining of the akshaya loka.",
        deva: "",
        tel: "లక్షవేల ఏండ్ల ఐదవతనము, కడుపుచలువ, అక్షయ భాగ్యము, అక్షయ లోకప్రాప్తి."
      },
    how: {
        roman: "After the Ganapati puja, a form of Gauri Devi is made in pasupu and established. She is worshipped with pasupu, kumkuma, flowers, lamp and naivedyam, and 'Om Gauryai namah' or 'Om Umamaheshwarabhyam namah' is japped. The sankalpam is taken to distribute a lakh of turmeric fingers — unbroken, and paired so far as possible — giving each muttaiduva at least a double handful, or as means allow, together with kumkuma. The count given is recorded and the giving continued until the lakh is complete.",
        deva: "",
        tel: "గణపతి పూజ తరువాత పసుపుతో గౌరీదేవి రూపమును తయారుచేసి ప్రతిష్ఠించవలెను. పసుపు, కుంకుమ, పూలు, దీపము, నైవేద్యముతో పూజించి 'ఓం గౌర్యై నమః' లేక 'ఓం ఉమామహేశ్వరాభ్యాం నమః' జపించవలెను. లక్ష పసుపుకొమ్ములు పంచెదనని సంకల్పించి — విరగని, వీలైనంతవరకు జతగా ఉన్న కొమ్ములను సేకరించి — ఒక్కొక్క ముత్తయిదువుకు కనీసము ఒక దోసెడు, లేక శక్తిమేరకు, పసుపుకొమ్ములు కుంకుమతో ఇవ్వవలెను. ఇచ్చిన కొమ్ముల సంఖ్యను నమోదు చేసుకొనుచు లక్ష పూర్తియగువరకు కొనసాగించవలెను."
      },
    katha: {
        roman: "This nomu has no separate katha but a phalashruti: to the woman who keeps the laksha pasupu nomu come aidavatanam for a lakh of thousands of years, kadupu-chaluva, akshaya bhagyam and the akshaya loka. That sentence is read and akshatalu placed on the head.",
        deva: "",
        tel: "ఈ నోమునకు ప్రత్యేకమైన కథ లేదు; ఫలశ్రుతి ఉన్నది — 'లక్ష పసుపు నోము నోచిన భామకు లక్షవేల ఏండ్లు ఐదవతనము, కడుపుచలువ, అక్షయ భాగ్యము, అక్షయ లోకప్రాప్తి కలుగును.' ఈ వాక్యమును చదివి అక్షతలు తలపై వేసుకొనవలెను."
      },
    udyapana: {
        roman: "A full lakh of turmeric fingers is distributed, with kumkuma alongside. Some first have a laksha-nama kumkumarchana done to Gauri Devi or Lakshmi Devi and mix that kumkuma with the turmeric before giving. At the close there may be a special puja to Gauri Devi, the worship of muttaiduvas, and annadanam or vastradanam. Any question about the sankalpam is to be settled with the family purohita.",
        deva: "",
        tel: "మొత్తము లక్ష పసుపుకొమ్ములు పంచవలెను; పసుపుతోపాటు కుంకుమ కూడ ఇవ్వవలెను. కొందరు ముందుగా గౌరీదేవికి లేక లక్ష్మీదేవికి లక్షనామ కుంకుమార్చన చేయించి, ఆ కుంకుమను పసుపుకొమ్ములతో కలిపి పంచుదురు. చివరగా గౌరీదేవికి ప్రత్యేక పూజ, ముత్తయిదువుల పూజ, అన్నదానము లేక వస్త్రదానము చేయవచ్చును. సంకల్పమునకు సంబంధించిన సంశయములు కుటుంబ పురోహితునితో నిర్ణయించుకొనవలెను."
      },
    vayanam: {
        roman: "Turmeric fingers, kumkuma.",
        deva: "",
        tel: "పసుపుకొమ్ములు, కుంకుమ."
      },
  },
  //
  {
    id: "gauri-vratam",
    deity: "devi",
    name: {
        roman: "Gauri Vratam",
        deva: "",
        tel: "గౌరీ వ్రతం"
      },
    when: {
        roman: "Bhadrapada shuddha tadiya — usually the day before Vinayaka Chaviti. In some families it is kept for sixteen years from the first year of marriage.",
        deva: "",
        tel: "భాద్రపద శుద్ధ తదియ — సాధారణముగా వినాయక చవితికి ముందురోజు. కొన్ని కుటుంబములలో వివాహమైన మొదటి సంవత్సరమునుండి పదహారు సంవత్సరములు ఆచరింతురు."
      },
    forwhat: {
        roman: "That sowbhagyam stand firm; long life and health for the husband; ease and gladness for the household.",
        deva: "",
        tel: "సౌభాగ్యము స్థిరముగా ఉండుట; భర్తకు ఆయురారోగ్యములు; కుటుంబమునకు సుఖసంతోషములు."
      },
    how: {
        roman: "Rise before dawn, clean the house and the puja place, take a head bath and put on clean cloth. Pasupu is applied to the peetham and the muggu laid, and the pasupu Ganapati worshipped first. A kalasham is set and the picture of Gauri Devi or the pasupu Gauramma established; the sankalpam is spoken and shodashopachara puja done. Where possible, sixteen flowers, sixteen fruits, or sixteen kinds of offering according to the family's practice. A pasupu toram of thirteen knots is placed before Gauri Devi and worshipped; the katha is read, akshatalu placed, and the toram tied to the right wrist. Pindivantalu and payasam are offered as naivedyam and harati given; and a muttaiduva, regarded as Gauri Devi herself, is honoured with pasupu, kumkuma, flowers, fruit, tambulam and dakshina.",
        deva: "",
        tel: "తెల్లవారుజామున లేచి ఇల్లు, పూజాస్థలము శుభ్రము చేసి, తలస్నానము చేసి శుభ్రమైన వస్త్రములు ధరించవలెను. పీటకు పసుపు రాసి ముగ్గు పెట్టి, ముందుగా పసుపు గణపతిని పూజించవలెను. కలశము ఏర్పాటు చేసి గౌరీదేవి చిత్రమును లేక పసుపు గౌరమ్మను ప్రతిష్ఠించి, సంకల్పము చెప్పుకొని షోడశోపచార పూజ చేయవలెను. వీలైనచో పదహారు పూలు, పదహారు పండ్లు, లేక కుటుంబాచారము ప్రకారము పదహారు రకముల సమర్పణలు చేయవలెను. పదమూడు ముడులు వేసిన పసుపు తోరమును గౌరీదేవి ముందుంచి పూజించి, కథ చదివి అక్షతలు వేసుకొని, తోరమును కుడిచేతికి కట్టుకొనవలెను. పిండివంటలు, పాయసము నైవేద్యముగా సమర్పించి హారతి ఇచ్చి, ఒక ముత్తయిదువును గౌరీదేవిగా భావించి పసుపు, కుంకుమ, పూలు, పండు, తాంబూలము, దక్షిణతో సత్కరించవలెను."
      },
    katha: {
        roman: "Once a king went hunting and came to a riverbank. There, near an ashramam, he saw some women worshipping Gauri Devi with shraddha and bhakti, and asked, 'What vratam are you keeping?' They said: 'This is the Svarna Gauri vratam; kept with bhakti, sowbhagyam stands firm, long life and health come to the husband, and ease and gladness to the household' — and they explained the method. The king went to his palace and told his two wives of the vratam. The younger wife worshipped Gauri Devi with shraddha and bhakti and kept it. The elder wife only mocked the vratam and neglected it. In time the wellbeing of the household and its wealth came to the younger wife, while the elder, who had mocked, fell into hardship. Recognising her fault, she prayed to Gauri Devi and kept the vratam again with bhakti; her hardships were lifted and sowbhagyam came to her. The chief teaching of the katha is that even one who cannot keep the vratam must not mock it.",
        deva: "",
        tel: "పూర్వము ఒక రాజు వేటకు వెళ్ళి ఒక నదీతీరమునకు చేరెను. అచట ఒక ఆశ్రమము వద్ద కొందరు మహిళలు భక్తిశ్రద్ధలతో గౌరీదేవిని పూజించుట చూచి — 'మీరు ఏ వ్రతము చేయుచున్నారు?' అని అడిగెను. వారు — 'ఇది స్వర్ణగౌరీ వ్రతము; భక్తితో ఆచరించిన సౌభాగ్యము స్థిరముగా ఉండును, భర్తకు ఆయురారోగ్యములు, కుటుంబమునకు సుఖసంతోషములు కలుగును' అని వ్రత విధానమును వివరించిరి. రాజు అంతఃపురమునకు వెళ్ళి తన ఇద్దరు భార్యలకు ఆ వ్రతము గురించి చెప్పెను. చిన్న భార్య భక్తిశ్రద్ధలతో గౌరీదేవిని పూజించి వ్రతమును ఆచరించెను. పెద్ద భార్య మాత్రము వ్రతమును హేళన చేసి నిర్లక్ష్యము చేసెను. కాలక్రమమున చిన్న భార్యకు కుటుంబసౌఖ్యము, సిరిసంపదలు కలిగినవి; హేళన చేసిన పెద్ద భార్య కష్టముల పాలయ్యెను. ఆమె తన తప్పు తెలిసికొని గౌరీదేవిని ప్రార్థించి తిరిగి భక్తితో వ్రతమును ఆచరించగా కష్టములు తొలగి సౌభాగ్యము కలిగెను. వ్రతమును ఆచరించ లేకపోయినను దానిని అవహేళన చేయరాదనుటయే ఈ కథలోని ప్రధాన సందేశము."
      },
    udyapana: {
        roman: "The available source does not state the udyapana materials clearly. In common practice, in the final year: Gauri kalasha puja; the worship of muttaiduvas; vayanam of saree, ravike, bangles, pasupu and kumkuma; a meal with pindivantalu; and annadanam according to means. The sixteen-year sankalpam, the toram and the udyapana details are to be settled with the family purohita.",
        deva: "",
        tel: "అందుబాటులో ఉన్న కథామూలమున ప్రత్యేక ఉద్యాపన సామగ్రి స్పష్టముగా లేదు. సాధారణ సంప్రదాయమున చివరి సంవత్సరము — గౌరీ కలశపూజ; ముత్తయిదువుల పూజ; చీర, రవికె, గాజులు, పసుపు, కుంకుమ వాయనము; పిండివంటలతో భోజనము; శక్తిమేరకు అన్నదానము చేయుదురు. పదహారు సంవత్సరముల సంకల్పము, తోరము, ఉద్యాపన వివరములను కుటుంబ పురోహితునితో నిర్ధారించుకొనవలెను."
      },
    vayanam: {
        roman: "Saree, ravike, bangles, pasupu, kumkuma, fruit, tambulam, dakshina.",
        deva: "",
        tel: "చీర, రవికె, గాజులు, పసుపు, కుంకుమ, పండు, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "bachchali-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Bachchali Gauri Nomu",
        deva: "",
        tel: "బచ్చలిగౌరీ నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "Wellbeing among brothers, sisters, husband's sisters and co-daughters-in-law.",
        deva: "",
        tel: "అన్నదమ్ములు, అక్కచెల్లెళ్ళు, ఆడబిడ్డలు, తోడికోడళ్ళతో సుఖముగా ఉండుట."
      },
    how: {
        roman: "A bachchali kaya is made in gold and in silver, and a bachchali stalk in flower and fruit is worshipped.",
        deva: "",
        tel: "బంగారముతోను, వెండితోను బచ్చలికాయను చేయించి, పూలతోను కాయలతోను ఉన్న బచ్చలికాడకు పూజ చేయవలెను."
      },
    katha: {
        roman: "A woman keeping house happily was to be taken to her parents' home, and her brother came for her. In her gladness she made pindivantalu. She sent him into the back garden to gather karivepaku for the pulusu seasoning. As he was breaking off the sprigs a snake bit him; he fell to the ground frothing. When he did not come back she went out and saw him. As she wept aloud, Parvati Devi came in the form of an old woman, quieted her, and said: 'Go inside and keep the Bachchala Gauri nomu; your brother will live' — and went away. Recognising the words as Jaganmata's, she kept the Bachchala Gauri nomu. She came out and called her brother, and he rose.",
        deva: "",
        tel: "ఒక ఇల్లాలు చక్కగా సంసారము చేసుకొనుచుండగా, ఆమెను పుట్టింటికి తీసుకువెళ్ళుటకు అన్నగారు వచ్చెను. ఆనందముతో ఆమె పిండివంటలు చేసినది. పులుసు పోపునకు పెరటిలో కరివేపాకు కోసుకు రమ్మని అన్నగారిని పంపినది. కరివేపాకు రెమ్మలు తుంచుచున్న ఆ అన్నగారిని పాము కరిచెను; నురుగులు కక్కుచు నేలపై పడిపోయెను. ఎంతకూ అన్నగారు రాకపోవుటచే ఆమె పెరటిలోనికి వచ్చి చూచినది. భోరుభోరున ఏడ్చుచున్న ఆమెకు పార్వతీదేవి వృద్ధ స్త్రీ రూపమున వచ్చి ఊరడించి — 'లోనికి వెళ్ళి బచ్చలగౌరీ నోము నోచుకో; నీ అన్న బ్రతుకుతాడు' అని చెప్పి వెళ్ళిపోయినది. అది జగన్మాత వాక్కుగా గుర్తించి ఆ ఇల్లాలు బచ్చల గౌరీ నోము నోచినది. బయటకు వచ్చి అన్నను పిలువగా అతడు లేచెను."
      },
    udyapana: {
        roman: "Saree, jacket, the bachchali stalk, the gold and silver bachchali kaya, dakshina and tambulam are given as vayanam to an elderly muttaiduva. 'Though the means be less, the fruit is more.'",
        deva: "",
        tel: "చీర, జాకెట్టు, బచ్చలికాడ, బంగారు వెండి బచ్చలికాయలు, దక్షిణ తాంబూలములను ఒక ముసలి ముత్తైదువుకు వాయనమివ్వవలెను. 'శక్తి తగ్గినను ఫలము హెచ్చును.'"
      },
    vayanam: {
        roman: "Bachchali stalk, gold and silver bachchali kaya, saree, jacket, dakshina, tambulam.",
        deva: "",
        tel: "బచ్చలికాడ, బంగారు వెండి బచ్చలికాయలు, చీర, జాకెట్టు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "mulaga-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Mulaga Gauri Nomu",
        deva: "",
        tel: "ములగగౌరి నోము"
      },
    when: {
        roman: "Begun on Magha Purnima or on Ratha Saptami, kept one year.",
        deva: "",
        tel: "మాఘ పూర్ణిమ నాడైనను, రథసప్తమి నాడైనను మొదలుపెట్టి ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "That all her wishes be fulfilled.",
        deva: "",
        tel: "ముచ్చటలన్నియు తీరుట."
      },
    how: {
        roman: "The words are said and akshatalu placed: the mulaga is not to be named, not to be pointed out, one is not to stand in its shade, not to touch it, not to put it in the mouth.",
        deva: "",
        tel: "'ములగ పేరెత్తరాదు, ములగను చూపించరాదు, ములగనీడ నిలువరాదు, ములగను అంటరాదు, ములగ నోట బెట్టరాదు' — ఈ మాటలు అనుకొని అక్షతలు వేసుకోవలెను."
      },
    katha: {
        roman: "This nomu has no narrative katha but its restriction. For the woman who keeps the mulaga nomu, all her wishes are fulfilled.",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; నియమమే ఉన్నది. ములగనోమును నోచిన ముదితకు ముచ్చటలన్నియు తీరును."
      },
    udyapana: {
        roman: "After the year, twelve muttaiduvas are invited and each given twelve pairs of mulaga stalks, lakka jodu, pairs of nallapusala kova, with dakshina and tambulam. 'Though the method may lapse, the fruit does not.'",
        deva: "",
        tel: "సంవత్సరము పూర్తయిన తరువాత పన్నెండుమంది ముత్తైదువులను పిలిచి ఒక్కొక్కరికి పన్నెండేసి జతల ములగ కాడలు, లక్కజోడు, నల్లపూసల కోవ జతలు, దక్షిణ తాంబూలములతో వాయనమివ్వవలెను. 'పద్ధతి తప్పిననూ ఫలము తప్పదు.'"
      },
    vayanam: {
        roman: "Mulaga stalks, lakka jodu, nallapusala kova, dakshina, tambulam.",
        deva: "",
        tel: "ములగ కాడలు, లక్కజోడు, నల్లపూసల కోవ, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "regula-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Regula Gauri Nomu",
        deva: "",
        tel: "రేగులగౌరి నోము"
      },
    when: {
        roman: "Through one year.",
        deva: "",
        tel: "ఏడాది పొడుగునా."
      },
    forwhat: {
        roman: "Children.",
        deva: "",
        tel: "సంతానము."
      },
    how: {
        roman: "The katha is told and akshatalu placed on the head through the year.",
        deva: "",
        tel: "కథను చెప్పుకొని ఏడాది పొడుగునా అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "A maharaja grieved much for want of children. His wife kept many nomulu, but the result was nothing. So one day she began to lament, 'I have kept every nomu, but Adinarayana has no mercy.' Just then Vishnu came there in Vaishnava form and said: 'Amma, why blame Bhagavan for a fault of your own? You kept the regula gauri nomu and forgot its udyapana. That is why children have not come to you. Even now nothing is past repair — keep that nomu.' She prayed, 'Tell me how it is to be kept.' 'Have golden regu fruits made to the measure of two and a half solas, and give them as vayanam to a brahmana with dakshina and tambulam' — and he departed. She did so, obtained children, and lived in gladness.",
        deva: "",
        tel: "ఒక మహారాజునకు సంతానము లేక చాలా విచారించుచుండెను. అతని భార్య ఎన్నో నోములు నోచెను; కానీ ఫలితము శూన్యము. అందుచే ఒకనాడు 'అన్ని నోములు నోచితిని, కానీ ఆదినారాయణునకు దయలేదు' అని విలపింపదొడగెను. అంతలో విష్ణుమూర్తి వైష్ణవ రూపమున అక్కడకు వచ్చి — 'అమ్మా! నీవు చేసిన తప్పుకు భగవంతుని నిందించెదవేల? రేగులగౌరి నోము నోచి ఉద్యాపనము మరచిపోయితివి. అందుచే నీకు సంతానప్రాప్తి కలుగలేదు. ఇప్పటికైనా మించినది లేదు, ఆ నోము నోచుకొనుము' అనెను. ఆమె 'అదెట్లు నోచవలయునో సెలవొసంగుడు' అని ప్రార్థింపగా — 'రెండున్నర సోలల బంగారు రేగుపండ్లు చేయించి, దక్షిణ తాంబూలములతో వాటిని ఒక బ్రాహ్మణునకు వాయనమివ్వవలయును' అని చెప్పి వెడలిపోయెను. ఆ ప్రకారము చేసి సంతానమును పొంది సుఖముగా ఉండెను."
      },
    udyapana: {
        roman: "A golden regu fruit is placed among nine tavvas of regu fruit and given as vayanam to an elderly brahmana with dakshina and tambulam.",
        deva: "",
        tel: "తొమ్మిది తవ్వల రేగుపండ్లలో ఒక బంగారు రేగుపండు వేసి ఒక ముసలి బ్రాహ్మణునకు దక్షిణ తాంబూలాదులతో వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Regu fruit, a golden regu fruit, dakshina, tambulam.",
        deva: "",
        tel: "రేగుపండ్లు, బంగారు రేగుపండు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "magha-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Magha Gauri Nomu",
        deva: "",
        tel: "మాఘగౌరి నోము"
      },
    when: {
        roman: "Thirty days from the padyami after Magha amavasya; so for five years.",
        deva: "",
        tel: "మాఘమాసములో అమావాస్య వెళ్ళిన పాడ్యమి మొదలు ముప్పది దినములు; అట్లు అయిదేండ్లు."
      },
    forwhat: {
        roman: "The undoing of widowhood.",
        deva: "",
        tel: "వైధవ్య నివారణ."
      },
    how: {
        roman: "Each day, after bathing, a pasupu Gauri is set up at the bathing ghat, and puja done with five padmas of pasupu, five of kumkuma and five of flour.",
        deva: "",
        tel: "ప్రతిదినము స్నానము చేసి నీలాటి రేవులో పసుపు గౌరిని పెట్టుకొని, పసుపుతో అయిదు పద్మాలు, కుంకుమతో అయిదు పద్మాలు, పిండితో అయిదు పద్మాలు పెట్టుకొని పూజ చేయవలెను."
      },
    katha: {
        roman: "To a brahmana, after long waiting, a daughter was born. When she came of age he married her; but on the fifth day after the wedding she was widowed. Unable to watch her grief, her parents took her to visit punya-kshetras. On the way, near a tank, muttaiduvas were doing puja in one place and widows in another, each with five padmas set out. Seeing it, the couple asked what it was. Parvati Devi, among the punyastris in the form of an old woman, brought them along and had their daughter bathe. She told the girl to take up a double handful of the tank's sand and throw it on the bank. She did, and it became pasupu. A second time, kumkuma. A third, coconut. A fourth, bellam. A fifth, jeelakarra. Then she told the child-widow to keep the Magha Gauri nomu, taught her the method, and departed. Her parents had her give, in the first year serumbavu of pasupu, in the second kumkuma, in the third coconut, in the fourth a lump of bellam, in the fifth jeelakarra, as vayanam to muttaiduvas, with talantu snanam and a meal. After the five years, when the udyapana was done, her husband came back to life.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు లేక లేక ఒక పుత్రిక పుట్టెను. యుక్తవయస్సు రాగానే వివాహము చేసెను; కానీ పెండ్లియైన అయిదవనాడు ఆమె విధవ అయ్యెను. ఆమె దుఃఖమును చూడలేక తల్లితండ్రులు పుణ్యక్షేత్రములు దర్శించుటకు తీసుకొని వెళ్ళుచుండిరి. ఇంతలో ఒక చెరువు దగ్గర ముత్తైదువులు ఒక చోటను, విధవలు ఇంకొక చోటను అయిదేసి పద్మములు పెట్టుకొని పూజ చేయుచుండిరి. అది చూచి ఆ దంపతులు అదేమని అడిగిరి. పుణ్యస్త్రీలలో వృద్ధురాలి రూపమున ఉన్న పార్వతీదేవి వారిని తనతో తీసుకువచ్చి, వారి కుమార్తెను స్నానము చేయించెను. చెరువులోని ఇసుకను దోసెడు తీసి గట్టుమీద వేయమని ఆ బాలికతో అనెను. ఆమె అట్లు చేయగా అది పసుపయ్యెను. రెండవసారి కుంకుమయ్యెను. మూడవసారి కొబ్బరి; నాల్గవసారి బెల్లము; అయిదవసారి జీలకర్ర. తరువాత ఆమె ఆ బాలవితంతువును మాఘగౌరి నోము నోచుకొనమని పద్ధతిని చెప్పి వెడలిపోయెను. తల్లితండ్రులు ఆమెతో మొదటి సంవత్సరము శేరుంబావు పసుపు, రెండవ యేట కుంకుమ, మూడవ యేట కొబ్బరి, నాల్గవ యేట బెల్లపు గుండ, అయిదవ యేట జీలకర్ర ముత్తైదువులకు వాయనమిప్పించి, ముత్తైదువునకు తలంటి నీళ్ళు పోయించి భోజనము పెట్టించిరి. అయిదేళ్ళూ చేసిన తరువాత ఉద్యాపనము చేయగా ఆమె భర్త బ్రతికి వచ్చెను."
      },
    udyapana: {
        roman: "After five years the pasupu Gauri is released into the water, and five muttaiduvas are given vayanam as above and fed.",
        deva: "",
        tel: "అయిదేండ్లు చేసిన తరువాత పసుపు గౌరిని నీటిలో విడిచి, అయిదుగురు ముత్తైదువులకు పైన చెప్పిన విధముగా వాయనమిచ్చి భోజనములు పెట్టవలెను."
      },
    vayanam: {
        roman: "Pasupu, kumkuma, coconut, bellam, jeelakarra — one for each year.",
        deva: "",
        tel: "పసుపు, కుంకుమ, కొబ్బరి, బెల్లము, జీలకర్ర — సంవత్సరమునకొకటి."
      },
  },
  //
  {
    id: "mula-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Mula Gauri Nomu",
        deva: "",
        tel: "మూల గౌరి నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "The saving of the husband's life; every kind of aishwaryam.",
        deva: "",
        tel: "పతి ప్రాణరక్షణ; సకలైశ్వర్యములు."
      },
    how: {
        roman: "The twenty-five articles named in the katha are given as vayanam to punyastris as occasion allows.",
        deva: "",
        tel: "కథలో చెప్పిన ఇరవై ఐదు వస్తువులను పుణ్యస్త్రీలకు వీలైనపుడు వాయనమివ్వవలెను."
      },
    katha: {
        roman: "A king's daughter kept the mula gauri nomu and flourished with every aishwaryam, with a husband who ruled an empire, sons of good qualities, and great-grandchildren. Wishing to test the greatness of her vratam, Parvati and Parameshwara entered the heart of a king hostile to her husband and made him give battle. Though the lesser man, with divine strength behind him he won, and killed her husband and all their kin. Yama's messengers came to take the dead. Seeing them, the queen stood on the battlefield with great courage and spoke to the messengers of Yama: 'Great messengers of Yama, stand aside. To keep my husband's wellbeing I have given pasupu as vayanam; to keep our fortunes, gold; to keep house and door, a white saree; seeking children, beerakayalu; for kadupu chaluva, kanda chakkera; wishing the good of our kin, banti flowers; considering the good of our neighbours, pogada flowers… none of you can take my husband's life. Great messengers of Yama, stand aside.' Unable to stand before the power of her pativratyam, they released the lives of the dead and departed. Then Parvati and Parameshwara, pleased, restored to life all who had died in the battle, appeared before her, granted the boons she wished, and went their way.",
        deva: "",
        tel: "ఒక రాచబిడ్డ మూలగౌరి నోము నోచుకొని సకలైశ్వర్యములతో, సామ్రాజ్యమేలు భర్తతో, సద్గుణవంతులగు పుత్రులతో, ముని మనుమలతో అలరారుచుండెను. ఆమె వ్రత మహాత్మ్యమును పరీక్షింపగోరి పార్వతీపరమేశ్వరులు ఆమె భర్తకు విరోధియగు ఒక రాజు హృదయములో ప్రవేశించి యుద్ధము చేయించిరి. ఆ రాజు అల్పవంతుడైనను దైవబలసమేతుడై విజయమునంది ఆమె భర్తను, బంధుకోటిని చంపెను. మరణించినవారిని తీసుకుపోవుటకు యమభటులు వచ్చిరి. అది గాంచిన ఆ రాణి మహాధైర్యముతో యుద్ధభూమిలో నిలిచి యమదూతలతో — 'దొడ్డవారగు యమదూతలారా! తొలగిపొండి. పతిసౌఖ్యము నిలుపుకొనుటకు పసుపు వాయనమిచ్చేను; భాగ్యాలు నిలుపుకొనుటకు బంగారము వాయనమిచ్చేను; ఇల్లు వాకిళ్ళు నిలుపుకొనుటకు తెల్లచీర వాయనమిచ్చేను; బిడ్డల సంతతి కోరుచు బీరకాయలు వాయనమిచ్చేను; కడుపు చలువ కొఱకు కండచక్కెర వాయనమిచ్చేను; బంధువుల బాగును గోరి బంతిపూలు వాయనమిచ్చేను; పొరుగువారి బాగునెంచి పొగడపూలు వాయనమిచ్చేను… పట్టలేరు మీరెవ్వరును నా భర్త ప్రాణాలు. దొడ్డవారగు యమదూతలారా! తొలగిపొండి' — అని పలికెను. ఆమె పాతివ్రత్య మహిమము ముందు నిలువలేక వారు మరణించినవారి ప్రాణములను వదలిపోయిరి. అంతట పార్వతీపరమేశ్వరులు సంతోషించి, యుద్ధములో చచ్చినవారినందరినీ బ్రతికించి, ప్రత్యక్షమై కావలసిన వరములిచ్చి వెళ్ళిపోయిరి."
      },
    udyapana: {
        roman: "Five muttaiduvas are invited, given pasupu and bottu, and each given five of the articles as vayanam with dakshina and tambulam.",
        deva: "",
        tel: "అయిదుగురు ముత్తైదువులను పిలిచి పసుపు రాసి, బొట్టు పెట్టి, దక్షిణ తాంబూలాలతో ఒక్కొక్క ముత్తైదువునకు అయిదేసి వస్తువులను వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "The twenty-five articles named in the katha.",
        deva: "",
        tel: "కథలో చెప్పిన ఇరవై ఐదు వస్తువులు."
      },
  },
  //
  {
    id: "gandala-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Gandala Gauri Nomu",
        deva: "",
        tel: "గండాల గౌరి నోము"
      },
    when: {
        roman: "Through one year.",
        deva: "",
        tel: "ఏడాది పొడుగునా."
      },
    forwhat: {
        roman: "The averting of gandams.",
        deva: "",
        tel: "గండముల నివారణ."
      },
    how: {
        roman: "The katha is told and akshatalu placed on the head through the year.",
        deva: "",
        tel: "కథను చెప్పుకొని ఏడాది పొడుగునా అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "In a certain town there were a king's daughter and a minister's daughter. The king's daughter was greater in every way, but greatness of another kind she did not have. The minister's daughter was a house of wealth and grain, of a good marriage, of cattle and crops, of children like jewels, and lived in comfort. But the princess fell into gandams, was a bride of hardships, a resting-place of calamities, and suffered. Reflecting that the minister's daughter, who by every measure should have been beneath her, lived in comfort while she herself was full of gandams, she began the worship of Parvati. The Devi took pity, appeared, and gave the word to keep the gandala gauri nomu. The princess kept it and, with every sampada, with nitya kalyanam and pachcha toranam, passed beyond the gandams and lived in happiness.",
        deva: "",
        tel: "ఒక ఊరిలో రాజుకూతురు, మంత్రికూతురు కలరు. రాజకూతురు మంత్రికూతురుకన్నా అన్ని విధముల ఎక్కువైనది; కానీ ఘనత ఆమెకు లేదు. మంత్రికూతురు ధనధాన్యములకు, దాంపత్యమునకు, పాడిపంటలకు, మణులవంటి బిడ్డలకు నిలయమై సుఖముగా ఉండెను. కానీ రాజకుమారి గండాలపాలై, కష్టాల కలికియై, ఆపదల కాలవాలమై బాధపడుచుండెను. తనకన్న అన్ని విధముల తక్కువగా ఉండవలసిన మంత్రికుమార్తె సుఖముగా ఉండుటయు, తాను గండాలతో నిండుటయు తలచి ఆమె పార్వతీ పూజలు ప్రారంభించగా, ఆ దేవికి దయ కలిగి ప్రత్యక్షమై గండాల గౌరి నోము నోచుకొనమని ఆనతిచ్చెను. రాజపుత్రిక ఆ నోమును నోచుకొని సకల సంపదలతో, నిత్యకల్యాణముతో, పచ్చతోరణముతో గండాలను గడచి సుఖించెను."
      },
    udyapana: {
        roman: "Chimmili is made from five sers of sesame and rolled into three balls each. Thirteen pairs of scale-pans are brought; in thirteen of them a ball of chimmili is placed and the remaining pans put over as lids. One is offered as naivedyam and the other twelve given as vayanam to twelve punyastris with dakshina and tambulam.",
        deva: "",
        tel: "అయిదు శేర్ల నువ్వులపప్పుతో చిమ్మిలి చేసి మూడేసి ఉండలు కట్టవలెను. పదమూడు జతల తక్కెడు చిప్పలు తెచ్చి, పదమూడు చిప్పలలో ఒక్కొక్క చిమ్మిలి ముద్దనుంచి, మిగిలిన చిప్పలను మూతవేయవలెను. ఒకదానిని నైవేద్యముగా పెట్టి, మిగిలిన పన్నెండు చిప్పలను పన్నెండుగురు పుణ్యస్త్రీలకు దక్షిణ తాంబూలములతో వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Chimmili balls in scale-pans, dakshina, tambulam.",
        deva: "",
        tel: "చిమ్మిలి ఉండలు తక్కెడు చిప్పలలో, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "challa-chitta-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Challa Chitta Gauri Nomu",
        deva: "",
        tel: "చల్ల చిత్త గౌరి నోము"
      },
    when: {
        roman: "One hundred and fifteen days.",
        deva: "",
        tel: "నూట పదిహేను దినములు."
      },
    forwhat: {
        roman: "A cool life; sowbhagya lakshmi.",
        deva: "",
        tel: "చల్లని బ్రతుకు; సౌభాగ్యలక్ష్మి."
      },
    how: {
        roman: "The drops of buttermilk that cling while churning are mixed with pasupu, and bottlu placed on five punyanganas each day.",
        deva: "",
        tel: "చల్ల చిలుకునప్పుడు కండ్లకు అంటుకొనిన చల్లబొట్లతో పసుపు కలిపి ప్రతిదినము అయిదుగురు పుణ్యాంగనలకు బొట్లు పెట్టవలెను."
      },
    katha: {
        roman: "This nomu has no narrative katha but a verse: keeping the challa chitta nomu with a full heart — with house and door, with the thought of Ishwara, with a cool life and sowbhagya lakshmi, dwell in gladness, mother.",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; పద్యమే ఉన్నది — 'చల్లచిత్త నోము చిత్తమారగ జేసి, ఇల్లు వాకిళ్ళతో ఈశ్వర చింతతో, చల్లని బ్రతుకుతో సౌభాగ్యలక్ష్మితో, ఉల్లసంబుతోడ ఉండవే తల్లీ.'"
      },
    udyapana: {
        roman: "That day's buttermilk and butter are given as vayanam to a perantalu with dakshina and tambulam.",
        deva: "",
        tel: "దక్షిణ తాంబూలములతో ఆనాటి చల్లను, వెన్నను పేరంటాలికి వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Buttermilk, butter, dakshina, tambulam.",
        deva: "",
        tel: "చల్ల, వెన్న, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "velagala-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Velagala Gauri Nomu",
        deva: "",
        tel: "వెలగలగౌరి నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "",
        deva: "",
        tel: ""
      },
    how: {
        roman: "The words are said and akshatalu placed: velaga is not to be named, the velaga fruit is not to be eaten, one is not to stand in its shade, and it is not to be pointed at with the finger.",
        deva: "",
        tel: "'వెలగ వెలగ యనరాదు, వెలగపండు తినగరాదు, వెలగనీడ నిలువరాదు, వెలగను వేల చూపరాదు' — ఈ మాటలు అనుకొని అక్షతలు వేసుకొనవలయును."
      },
    katha: {
        roman: "This nomu has no narrative katha but its restriction. (Like the mulaga gauri nomu, it takes the form of an abstention.)",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; నియమమే ఉన్నది. (ములగగౌరి నోమువలెనే ఇది నిషేధ రూపమున ఉన్న నోము.)"
      },
    udyapana: {
        roman: "Thirteen pairs of velaga fruit with their stems are brought and given as vayanam to thirteen punyastris with lakka jollu, nallapusalu, dakshina and tambulam. 'Though the katha be faulty, there must be no fault in the vratam.'",
        deva: "",
        tel: "ముచ్చికలతో ఉన్న పదమూడు జతల వెలగకాయలను తెచ్చి, పదముగ్గురు పుణ్యస్త్రీలకు లక్కజోళ్ళు, నల్లపూసలు, దక్షిణ, తాంబూలములను పెట్టి వాయనమివ్వవలెను. 'కథ లోపమైననూ వ్రత లోపము ఉండరాదు.'"
      },
    vayanam: {
        roman: "Velaga fruit, lakka jollu, nallapusalu, dakshina, tambulam.",
        deva: "",
        tel: "వెలగకాయలు, లక్కజోళ్ళు, నల్లపూసలు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "krittika-gauri-nomu",
    deity: "devi",
    name: {
        roman: "Krittika Gauri Nomu",
        deva: "",
        tel: "కృత్తిక గౌరీ నోము"
      },
    when: {
        roman: "The Krittika nakshatram in Kartika.",
        deva: "",
        tel: "కార్తీక మాసములోని కృత్తికా నక్షత్రము."
      },
    forwhat: {
        roman: "Children; and their health.",
        deva: "",
        tel: "సంతానము; సంతానారోగ్యము."
      },
    how: {
        roman: "This is one and the same as the krittika dipamula nomu — the lamp of six wicks, the worship of Kumaraswami, and the prayer to the Krittikas.",
        deva: "",
        tel: "కృత్తిక దీపముల నోముతో ఇది ఒకటే — ఆరు వత్తుల దీపము, కుమారస్వామి పూజ, కృత్తికల ప్రార్థన."
      },
    katha: {
        roman: "The same katha as the krittika dipamula nomu. The grantha's contents give it as 'krittika gauri nomu' and other compilations as 'krittika deepala nomu' — two names in circulation for one nomu.",
        deva: "",
        tel: "కృత్తిక దీపముల నోము కథయే. గ్రంథమునందు 'కృత్తిక గౌరీ నోము' అనియు, ఇతర సంకలనములలో 'కృత్తిక దీపాల నోము' అనియు ఒకే నోముకు రెండు పేర్లు ప్రచారములో ఉన్నవి."
      },
    udyapana: {
        roman: "As for the krittika dipamula nomu.",
        deva: "",
        tel: "కృత్తిక దీపముల నోము వలెనే."
      },
    vayanam: {
        roman: "Pramidas, cloths, fruit, dakshina, tambulam.",
        deva: "",
        tel: "ప్రమిదలు, వస్త్రములు, పండ్లు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "puvvu-tambulamu-nomu",
    deity: "devi",
    name: {
        roman: "Puvvu Tambulamu Nomu",
        deva: "",
        tel: "పువ్వు తాంబూలము నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The husband's affection. Also one of the first nomulu taught to girls, to establish the habit of giving from childhood.",
        deva: "",
        tel: "భర్త అనురాగము. చిన్నతనమునుండి ఇచ్చు అలవాటు కలిగించుటకు ఆడపిల్లలకు నేర్పు తొలి నోములలో ఒకటి."
      },
    how: {
        roman: "Each day five flowers are placed in a tambulam and given to a muttaiduva, and she takes tambulam herself.",
        deva: "",
        tel: "ప్రతిదినము ఒక తాంబూలములో అయిదు పువ్వులు పెట్టి ముత్తయిదువునకిచ్చి, తానును తాంబూలము వేసుకొనవలెను."
      },
    katha: {
        roman: "The same katha as the nitya tambulam nomu — Parvati appearing in a dream and giving the direction for tambula danam. Here the distinguishing feature is the giving of five flowers with it.",
        deva: "",
        tel: "నిత్య తాంబూలము నోము కథయే — పార్వతీదేవి కలలో కనిపించి తాంబూలదానము చేయమని ఆనతిచ్చుట. ఇచట అయిదు పువ్వులతో ఇచ్చుట విశేషము."
      },
    udyapana: {
        roman: "A golden flower is placed in a platter, the platter filled with water, a saree and ravikela gudda placed with it, and given as vayanam to a perantalu in the name of Parvati Devi.",
        deva: "",
        tel: "ఒక బంగారు పువ్వును పళ్ళెములో పెట్టి, ఆ పళ్ళెము నిండుగా నీరు పోసి, చీర, రవికెలగుడ్డ పెట్టి పేరంటాలునకు పార్వతీదేవి పేరున వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "A golden flower, water, saree, ravikela gudda.",
        deva: "",
        tel: "బంగారు పువ్వు, నీరు, చీర, రవికెలగుడ్డ."
      },
  },
  //
  {
    id: "pandu-tambulamu-nomu",
    deity: "devi",
    name: {
        roman: "Pandu Tambulamu Nomu",
        deva: "",
        tel: "పండుతాంబూలము నోము"
      },
    when: {
        roman: "One year, every day, according to the traditional text.",
        deva: "",
        tel: "సంప్రదాయ గ్రంథము ప్రకారము ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "Children; sirisampadalu.",
        deva: "",
        tel: "సంతానము; సిరిసంపదలు."
      },
    how: {
        roman: "Each day Gauri Devi is worshipped, and a tambulam of one fruit with betel leaves, areca, pasupu and kumkuma is given to a muttaiduva. The katha is read and akshatalu placed. Where giving daily is not possible, whether it may be done on one fixed day a week is to be settled with the elders of the house or with a purohita.",
        deva: "",
        tel: "ప్రతిదినము గౌరీదేవిని పూజించి, ఒక పండు, తమలపాకులు, వక్క, పసుపు, కుంకుమతో కూడిన తాంబూలమును ఒక ముత్తయిదువుకు ఇవ్వవలెను. కథ చదివి అక్షతలు వేసుకొనవలెను. ప్రతిదినము ఇచ్చుట సాధ్యము కానిచో వారమునకు ఒక నిర్ణీత దినమున చేయవచ్చునా అనుటను కుటుంబ పెద్దలతో గాని పురోహితునితో గాని నిర్ణయించుకొనవలెను."
      },
    katha: {
        roman: "A king's wife and a minister's wife took up the pandu tambulam nomu together. The minister's wife gave the day's fruit-and-tambulam dana on that same day, with bhakti. The king's wife, considering the wealth she had, thought 'I shall give it all at once' and neglected the daily rule. In consequence no children came to her; while wealth and the wellbeing of children came to the minister's wife. Grieving — 'the minister's wife took up the nomu along with me and good has come to her; why not to me?' — the king's wife went into the forest. There Parvati and Parameshwara appeared and said: 'Considering your wealth you grew proud, and did not properly do the dana that was to be done each day; that is why the fruit of the nomu did not come. Go home again, complete the nomu with shraddha and bhakti, and do the udyapana.' She returned, kept it by rule through the year, did the udyapana, and children came to her.",
        deva: "",
        tel: "ఒక రాజు భార్యయు మంత్రి భార్యయు కలిసి పండు తాంబూలము నోము పట్టిరి. మంత్రి భార్య ప్రతిదినము చేయవలసిన పండు-తాంబూల దానమును ఆ దినమే భక్తితో ఇచ్చుచుండెను. రాజు భార్య మాత్రము తనకున్న సంపదను చూచుకొని — 'అన్నియు ఒకేసారి ఇచ్చివేసెదను' అని రోజువారీ నియమమును నిర్లక్ష్యము చేసెను. ఫలితముగా ఆమెకు సంతానము కలుగలేదు; మంత్రి భార్యకు మాత్రము సిరిసంపదలు, సంతానసౌఖ్యము కలిగినవి. 'నాతోపాటు నోము పట్టిన మంత్రి భార్యకు శుభములు కలిగి నాకు ఏల కలుగలేదు?' అని విచారించుచు రాజు భార్య అడవికి వెళ్ళెను. అచట పార్వతీపరమేశ్వరులు ప్రత్యక్షమై — 'నీ సంపదను చూచుకొని గర్వించి, ప్రతిదినము చేయవలసిన దానమును సక్రమముగా చేయలేదు; అందువలననే నోముఫలము కలుగలేదు. తిరిగి ఇంటికి వెళ్ళి భక్తిశ్రద్ధలతో నోము పూర్తి చేసి ఉద్యాపన చేసుకో' అని చెప్పిరి. ఆమె తిరిగి వచ్చి ఏడాది పొడుగునా నియమముగా ఆచరించి ఉద్యాపన చేసుకొనగా సంతానము కలిగినది."
      },
    udyapana: {
        roman: "A muttaiduva is given talantu snanam and honoured, fed with pindivantalu, and given a saree, ravike, pasupu, kumkuma, tambulam and dakshina. Vayanam is given with at least twenty-five fruits in a platter.",
        deva: "",
        tel: "ఒక ముత్తయిదువుకు తలంటి నీళ్ళు పోసి సత్కరించి, పిండివంటలతో భోజనము పెట్టి, చీర, రవికె, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ ఇవ్వవలెను. ఒక పళ్ళెములో కనీసము ఇరవై అయిదు పండ్లు పెట్టి వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Fruit, tambulam, saree, ravike, pasupu, kumkuma, dakshina.",
        deva: "",
        tel: "పండ్లు, తాంబూలము, చీర, రవికె, పసుపు, కుంకుమ, దక్షిణ."
      },
  },
  //
  {
    id: "gandha-tambulamu-nomu",
    deity: "devi",
    name: {
        roman: "Gandha Tambulamu Nomu",
        deva: "",
        tel: "గంధతాంబూలము నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The husband's affection.",
        deva: "",
        tel: "భర్త అనురాగము."
      },
    how: {
        roman: "Each day, five gandha balls with a tambulam are given to a muttaiduva.",
        deva: "",
        tel: "ప్రతిదినము ఒక తాంబూలముతో అయిదు గంధపు ఉండలను ముత్తయిదువునకివ్వవలెను."
      },
    katha: {
        roman: "The same katha as the nitya tambulam nomu — Parvati appearing in a dream and directing tambula danam. Here the distinguishing feature is the giving of gandha balls with it.",
        deva: "",
        tel: "నిత్య తాంబూలము నోము కథయే — పార్వతీదేవి కలలో కనిపించి తాంబూలదానము చేయమని చెప్పుట. ఇచట గంధపు ఉండలతో ఇచ్చుట విశేషము."
      },
    udyapana: {
        roman: "A muttaiduva is given a saree, ravikela gudda, aakulu, pokalu, gandha balls and dakshina as vayanam.",
        deva: "",
        tel: "ఒక ముత్తైదువునకు చీర, రవికెలగుడ్డ, ఆకులు, పోకలు, గంధపు ఉండలు, దక్షిణ వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Gandha balls, aakulu, pokalu, saree, ravikela gudda, dakshina.",
        deva: "",
        tel: "గంధపు ఉండలు, ఆకులు, పోకలు, చీర, రవికెలగుడ్డ, దక్షిణ."
      },
  },
  //
  {
    id: "dampatula-tambulamu-nomu",
    deity: "devi",
    name: {
        roman: "Dampatula Tambulamu Nomu",
        deva: "",
        tel: "దంపతుల తాంబూలము నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "A husband's return; the recovery of what was lost.",
        deva: "",
        tel: "భర్త తిరిగి వచ్చుట; పోయినది తిరిగి పొందుట."
      },
    how: {
        roman: "For a year: fruit with tambulam to the man, flowers with tambulam to the woman, and akshintalu received from them.",
        deva: "",
        tel: "సంవత్సరము పాటు మగవారికి పండు పెట్టి తాంబూలము, ఆడవారికి పువ్వులు పెట్టి తాంబూలము ఇచ్చి అక్షింతలు వేయించుకోవలెను."
      },
    katha: {
        roman: "A fortunate woman's husband went abroad on trade a few months after their marriage. Two years after he left, thieves carried off all her property. With her husband not returning however long, and her property gone, she gave up and was setting out for the forest. On the way Parvati and Parameshwara came as an old couple, learned the cause of her grief, and said: 'Amma, you took up the dampatula tambulam nomu and transgressed it, and that is why these troubles came. Keep that nomu again and live in comfort.' She came home, kept the nomu, told the katha, took the akshatalu, and after a year did the udyapana. Then her husband returned from abroad.",
        deva: "",
        tel: "ఒక భాగ్యశాలిని భర్త, పెండ్లియైన కొన్ని నెలలకు వర్తకము చేయుటకై దేశాంతరములకు వెళ్ళెను. అతడు వెళ్ళిన రెండు సంవత్సరములకు ఆమె ఆస్తి అంతయు దొంగలు దోచుకొనిపోయిరి. ఎంతకాలమునకు భర్త తిరిగి రాకపోవుటచేతను, ఉన్న ఆస్తి పోవుటచేతను ఆమె విసిగిపోయి అడవికి పోవుచుండెను. దారిలో పార్వతీపరమేశ్వరులు వృద్ధ దంపతులవలె వచ్చి ఆమె విచారమునకు కారణము తెలిసికొని — 'అమ్మా! నీవు దంపతుల తాంబూలము నోము పట్టి ఉల్లంఘించుటచే ఇట్టి కష్టములు వచ్చెను. కాబట్టి ఆ నోమును తిరిగి నోచుకొని సుఖముగా ఉండుము' అని చెప్పిరి. ఆమె ఇంటికి వచ్చి నోము నోచుకొని, కథ చెప్పుకొని, అక్షతలు వేసుకొని, ఏడాది అయిన తర్వాత ఉద్యాపన చేసుకొనెను. పిమ్మట ఆమె భర్త దేశాంతరముల నుండి వచ్చెను."
      },
    udyapana: {
        roman: "After the year, the couple are given talantu snanam and fed, and one hundred and eight aakulu, pokalu and tambulam articles are given in a platter.",
        deva: "",
        tel: "సంవత్సరము అనంతరము దంపతులకు తలంటి నీళ్ళు పోసి, భోజనము పెట్టి, నూట ఎనిమిది ఆకులను, పోకలను, తాంబూలపు వస్తువులను పళ్ళెములో పెట్టి ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Fruit with tambulam to the man; flowers with tambulam to the woman.",
        deva: "",
        tel: "మగవారికి పండుతో తాంబూలము; ఆడవారికి పువ్వులతో తాంబూలము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "moosi-vayanala-nomu",
    deity: "devi",
    name: {
        roman: "Moosi Vayanala Nomu",
        deva: "",
        tel: "మూసివాయనాల నోము"
      },
    when: {
        roman: "The older text gives no fixed tithi and no number of days. According to the family's practice the paata may be read daily, or for whatever period is settled on, with the udyapana at the close.",
        deva: "",
        tel: "పాత గ్రంథమున నిర్దిష్టమైన తిథి గాని, ఎన్ని దినములనుట గాని లేదు. కుటుంబ సంప్రదాయము ప్రకారము ప్రతిదినము, లేక నిర్ణయించుకొనిన కాలము వరకు పాట చదివి చివర ఉద్యాపన చేయవచ్చును."
      },
    forwhat: {
        roman: "Pasupu-kumkuma, cattle and crops, kadupu-chaluva, the husband's affection, the love of kin — this world; and after being carried out, the next.",
        deva: "",
        tel: "పసుపు కుంకుమ, పాడిపంట, కడుపుచలువ, పెనిమిటి అనురాగము, చుట్టాల ప్రేమ — ఇహము; మోసుకుపోయాక పరము."
      },
    how: {
        roman: "A picture of Gauri Devi or Lakshmi Devi is established, a lamp lit, and worship made with pasupu, kumkuma and flowers. The nomu paata is read with bhakti, and when it is finished akshatalu are placed on the head. Naivedyam is offered and harati given.",
        deva: "",
        tel: "గౌరీదేవి లేక లక్ష్మీదేవి చిత్రమును ప్రతిష్ఠించి, దీపము వెలిగించి, పసుపు కుంకుమ పుష్పములతో పూజించవలెను. నోము పాటను భక్తితో చదువుకొని, పాట పూర్తియైన తరువాత అక్షతలను తలపై వేసుకొనవలెను. నైవేద్యము సమర్పించి హారతి ఇవ్వవలెను."
      },
    katha: {
        roman: "This nomu has no separate katha; the nomu paata itself stands as both katha and phalashruti. It says: to the woman who keeps the moosi vayanams, pasupu-kumkuma until she is carried out; to her, cattle and crops until she is carried out; to that house, kadupu-chaluva; to that woman, her husband's affection; the love of her kin; this world until she is carried out — and after she is carried out, the next. 'Until she is carried out' means to the end of life; 'after she is carried out' means beyond it — the paata names both this world and the next.",
        deva: "",
        tel: "ఈ నోమునకు ప్రత్యేకమైన కథ లేదు; నోము పాటయే కథగాను ఫలశ్రుతిగాను చెప్పబడును — 'మూసివాయనాలు నోచిన భామకు మోసుకుపోయిందాకా పసుపు కుంకుమ; నోచిన కాంతకు మోసుకుపోయిందాకా పాడిపంట; నోచిన ఇంటికి మోసుకుపోయిందాకా కడుపుచలువ; నోచిన పడతికి మోసుకుపోయిందాకా పెనిమిటి అనురాగం; నోచిన భామకు మోసుకుపోయిందాకా చుట్టాల ప్రేమ; నోచిన ముదితకు మోసుకుపోయిందాకా ఇహం — మోసుకుపోయాక పరం.' 'మోసుకుపోయిందాకా' అనగా జీవితాంతము; 'మోసుకుపోయాక' అనగా అటుపిమ్మట — ఇహమును పరమును రెండును ఈ పాటలోనే చెప్పబడినవి."
      },
    udyapana: {
        roman: "Six pairs of chetas — twelve in all — are needed. Each vayanam has one cheta filled and another inverted over it as a lid, and it is from this covering that the nomu takes its name. One thing to each cheta — the first kumkuma; the second pasupu; the third black beads; the fourth flowers; the fifth fruit; the sixth bangles. In every covered vayanam there go besides: a ravike gudda, betel leaves, areca, dakshina, pasupu and kumkuma, and lakka bangles if wanted.",
        deva: "",
        tel: "ఆరు జతల చేటలు — మొత్తము పండ్రెండు — కావలెను. ఒక్కొక్క వాయనమునకు ఒక చేటను నింపి, దానిపై మరొక చేటను బోర్లించి మూసివేయుటచేతనే దీనికి 'మూసివాయనము' అను పేరు వచ్చినది. ఒక్కొక్క చేటలో ఒక్కొక్కటి — మొదటిది కుంకుమ; రెండవది పసుపు; మూడవది నల్లపూసలు; నాల్గవది పువ్వులు; అయిదవది పండ్లు; ఆరవది గాజులు. ప్రతి మూసివాయనములోను అదనముగా రవికె గుడ్డ, తమలపాకులు, వక్కలు, దక్షిణ, పసుపు కుంకుమ, అవసరమైనచో లక్కగాజులు ఉంచవలెను."
      },
    vayanam: {
        roman: "Six muttaiduvas are invited, pasupu and kumkuma placed on them, and one covered vayanam given to each; their blessing is received and they are fed a meal or refreshment. The six may all be given on one day; if means do not allow, the text says they may be completed one a week over six weeks, or two or three at a time. Those given in large chetas are called 'pedda moosivayanalu', those in small chetas 'chinna moosivayanalu' — it may be done as means allow.",
        deva: "",
        tel: "ఆరుగురు ముత్తయిదువులను ఆహ్వానించి పసుపు కుంకుమ పెట్టి, ఒక్కొక్కరికి ఒక్క మూసివాయనము చొప్పున ఇవ్వవలెను; వారి ఆశీర్వాదము తీసుకొని భోజనము లేక అల్పాహారము పెట్టవలెను. ఆరు వాయనములను ఒకేదినమున ఇవ్వవచ్చును; శక్తి లేనిచో వారమునకు ఒకటి చొప్పున ఆరు వారములలో, లేక రెండేసి మూడేసి చొప్పున పూర్తి చేయవచ్చునని గ్రంథమున ఉన్నది. పెద్ద చేటలతో ఇచ్చునవి 'పెద్ద మూసివాయనాలు'; చిన్న చేటలతో ఇచ్చునవి 'చిన్న మూసివాయనాలు' — శక్తికి తగినట్లు చేయవచ్చును."
      },
  },
  //
  {
    id: "padaharu-kudumula-nomu",
    deity: "devi",
    name: {
        roman: "Padaharu Kudumula Nomu",
        deva: "",
        tel: "పదహారు కుడుముల నోము"
      },
    when: {
        roman: "Bhadrapada shuddha tadiya. (The older text names it the 'padaharu kudumula tadiya nomu'.)",
        deva: "",
        tel: "భాద్రపద శుద్ధ తదియ. (పాత గ్రంథమున 'పదహారు కుడుముల తదియ నోము' అని పేర్కొనబడినది.)"
      },
    forwhat: {
        roman: "The averting of poverty and widowhood; aishwaryam.",
        deva: "",
        tel: "దారిద్ర్య, వైధవ్య నివారణ; ఐశ్వర్యము."
      },
    how: {
        roman: "After a head bath, Gauri Devi is established. Sixteen billa kudumulu are made — of rice flour or with bellam, according to the family's practice. They are offered to Gauri Devi as naivedyam, the katha read, akshatalu placed, and sixteen kudumulu with pasupu, kumkuma, tambulam and dakshina given as vayanam to a muttaiduva.",
        deva: "",
        tel: "తలస్నానము చేసి గౌరీదేవిని ప్రతిష్ఠించవలెను. పదహారు బిళ్ల కుడుములు తయారు చేయవలెను — కుటుంబాచారము ప్రకారము బియ్యప్పిండి కుడుములు గాని బెల్లముతో చేయు కుడుములు గాని చేయవచ్చును. గౌరీదేవికి నైవేద్యము సమర్పించి, కథ చదివి, అక్షతలు వేసుకొని, ఒక ముత్తయిదువుకు పదహారు కుడుములు, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ వాయనముగా ఇవ్వవలెను."
      },
    katha: {
        roman: "A king's daughter had in a former birth taken up the padaharu kudumula nomu and transgressed it; and so in the next birth poverty and widowhood came to her. Unable to bear those hardships, she was going into the forest meaning to give up her life when Parvati and Parameshwara appeared. Learning her troubles, Parvati Devi said: 'In a former birth you transgressed the padaharu kudumula nomu. On Bhadrapada shuddha tadiya take up the nomu again, read the katha, and do the udyapana.' The princess went home, took a head bath and made sixteen billa kudumulu. While she had gone next door to fetch buttermilk, a dog came and ate the kudumulu. She did not grow angry, but thought, 'this too is God's own sankalpam', and poured out for the dog the buttermilk she had brought as well. Pleased with her compassion, Gauri Devi appeared and granted her aishwaryam. From then she offered sixteen kudumulu each year as naivedyam, gave vayanam to a muttaiduva, and lived in ease and plenty.",
        deva: "",
        tel: "ఒక రాజకుమార్తె పూర్వజన్మలో పదహారు కుడుముల నోము పట్టి ఉల్లంఘించెను; అందువలన మరుజన్మలో ఆమెకు దారిద్ర్యము, వైధవ్యము కలిగినవి. ఆ బాధలు భరించలేక ప్రాణములు విడువవలెనను ఉద్దేశముతో అడవికి వెళ్ళుచుండగా పార్వతీపరమేశ్వరులు కనిపించిరి. ఆమె కష్టములను తెలిసికొని పార్వతీదేవి — 'నీవు పూర్వజన్మలో పదహారు కుడుముల నోము ఉల్లంఘించితివి. భాద్రపద శుద్ధ తదియనాడు తిరిగి నోము పట్టి, కథ చదివి, ఉద్యాపన చేసుకో' అని చెప్పెను. రాజకుమార్తె ఇంటికి వెళ్ళి తలస్నానము చేసి పదహారు బిళ్ల కుడుములు చేసెను. మజ్జిగ తీసుకువచ్చుటకు పొరుగింటికి వెళ్ళినపుడు ఒక కుక్క వచ్చి ఆ కుడుములను తినివేసెను. ఆమె కోపపడక — 'ఇది కూడా దేవుని సంకల్పమే' అని భావించి, తాను తెచ్చిన మజ్జిగను కూడా ఆ కుక్కకు పోసెను. ఆమె దయకు మెచ్చిన గౌరీదేవి ప్రత్యక్షమై ఐశ్వర్యమును ప్రసాదించెను. అప్పటినుండి ఆమె ప్రతి సంవత్సరము పదహారు కుడుములను నైవేద్యముగా సమర్పించి, ముత్తయిదువుకు వాయనమిచ్చి సుఖసంపదలతో జీవించెను."
      },
    udyapana: {
        roman: "By the older text — sixteen chetas; sixteen kudumulu in each cheta (two hundred and fifty-six in all); sixteen coins; nallapusalu; lakka jodu or bangles; pasupu, kumkuma, tambulam, dakshina.",
        deva: "",
        tel: "పాత గ్రంథము ప్రకారము — పదహారు చేటలు; ప్రతి చేటలో పదహారు కుడుములు (మొత్తము రెండువందల ఏబది ఆరు); పదహారు నాణేలు; నల్లపూసలు; లక్కజోడు లేక గాజులు; పసుపు, కుంకుమ, తాంబూలము, దక్షిణ."
      },
    vayanam: {
        roman: "Kudumulu, coins, nallapusalu, bangles, pasupu, kumkuma, tambulam, dakshina.",
        deva: "",
        tel: "కుడుములు, నాణేలు, నల్లపూసలు, గాజులు, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "padaru-phalamula-nomu",
    deity: "devi",
    name: {
        roman: "Padaru Phalamula Nomu",
        deva: "",
        tel: "పదారు ఫలముల నోము"
      },
    when: {
        roman: "Commonly sixteen days — one kind of fruit each day.",
        deva: "",
        tel: "సాధారణముగా పదహారు దినములు — దినమునకు ఒక రకము పండు."
      },
    forwhat: {
        roman: "Good children; their health; the growth of the household. And the discipline of giving well.",
        deva: "",
        tel: "మంచి సంతానము; పిల్లల ఆరోగ్యము; కుటుంబాభివృద్ధి. దానము చక్కగా చేయు అలవాటు."
      },
    how: {
        roman: "On the first day Gauri Devi or Lakshmi Devi is established and the sankalpam taken. A lamp is lit and worship made with pasupu, kumkuma and flowers. Each day one fresh kind of good fruit is examined and chosen BY HER OWN HAND and given as vayanam to a muttaiduva with flowers, pasupu, kumkuma, tambulam and dakshina. So over sixteen days sixteen kinds of fruit are offered. Each day the katha is read, akshatalu placed, naivedyam offered and harati given. The older text gives no binding list of fruits — sixteen kinds are chosen from what the season affords, fresh, ripe and unblemished. So far as possible the vayanam is given as a whole uncut fruit.",
        deva: "",
        tel: "మొదటి దినమున గౌరీదేవిని లేక లక్ష్మీదేవిని ప్రతిష్ఠించి సంకల్పము చేసుకొనవలెను. దీపము వెలిగించి పసుపు, కుంకుమ, పుష్పములతో పూజించవలెను. ప్రతిదినము ఒక క్రొత్త రకమునకు చెందిన మంచి పండును స్వయముగా పరిశీలించి ఎంచుకొని — పువ్వులు, పసుపు కుంకుమ, తాంబూలము, దక్షిణతో ఒక ముత్తయిదువుకు వాయనముగా ఇవ్వవలెను. ఇట్లు పదహారు దినములలో పదహారు రకముల పండ్లు సమర్పించవలెను. ప్రతిదినము కథ చదివి అక్షతలు వేసుకొని, నైవేద్యము సమర్పించి హారతి ఇవ్వవలెను. పండ్ల జాబితా పాత గ్రంథమున నిర్బంధముగా లేదు — కాలానుగుణముగా లభించు పదహారు రకముల తాజా, పండిన, దెబ్బతినని పండ్లను ఎంచుకొనవలెను. వాయనమునకు సాధ్యమైనంతవరకు కోయని పూర్తి పండునే ఇవ్వవలెను."
      },
    katha: {
        roman: "In one kingdom the king's wife and the minister's wife together took up the padaru phalamula nomu and did its udyapana. The minister's wife, with humility, examined each fruit one by one and gave the good fruit to a muttaiduva with fitting dakshina. The king's wife, in her pride, had all sixteen kinds of fruit brought at once and gave them away without looking at what among them was good and what was not. Afterwards good children were born to the minister's wife. To the king's wife were born children who were blind and lame. Then the king's wife said to the minister's wife: 'The two of us took up the same nomu and did its udyapana. Good children have been born to you; why have children such as these been born to me?' The minister's wife said: 'In your pride you had all sixteen kinds of fruit brought at once and gave them away without looking at what was good and what was not. I examined each fruit one by one and gave the good fruit to a muttaiduva with fitting dakshina. That is why different results have come to us.' The king's wife asked what the remedy was, and the minister's wife told her to take up the padaru phalamula nomu again, to choose good fruit, and to do the udyapana with fitting dakshina. The king's wife kept the nomu in that manner and did the udyapana.",
        deva: "",
        tel: "ఒక రాజ్యమున రాజుగారి భార్యయు, మంత్రి భార్యయు కలిసి పదహారు ఫలముల నోము పట్టి ఉద్యాపన చేసిరి. మంత్రి భార్య వినయముతో ఒక్కొక్క ఫలమును పరిశీలించి, మంచి ఫలమును తగిన దక్షిణతో ముత్తయిదువుకు ఇచ్చెను. రాజుగారి భార్య మాత్రము గర్వముతో పదహారు రకముల ఫలములను ఒకేసారి తెప్పించి, వాటిలో మంచి చెడు చూడకుండా దానము చేసెను. తరువాత మంత్రి భార్యకు మంచి సంతానము కలిగెను. రాజుగారి భార్యకు గుడ్డివారు, కుంటివారు అయిన పిల్లలు కలిగిరి. అప్పుడు రాజుగారి భార్య మంత్రి భార్యతో — 'మనమిద్దరము ఒకే నోము పట్టి ఉద్యాపన చేసినాము. నీకు మంచి పిల్లలు పుట్టిరి; నాకు ఇటువంటి సంతానము ఎందుకు కలిగినది?' అని అడిగెను. మంత్రి భార్య — 'నీవు గర్వముతో పదహారు రకముల ఫలములను ఒకేసారి తెప్పించి, వాటిలో మంచి చెడు చూడకుండా దానము చేసితివి. నేను ఒక్కొక్క ఫలమును పరిశీలించి, మంచి ఫలమును తగిన దక్షిణతో ముత్తయిదువుకు ఇచ్చితిని. అందువలననే మనకు వేర్వేరు ఫలితములు కలిగినవి' అని చెప్పెను. రాజుగారి భార్య పరిహారము అడుగగా — తిరిగి పదహారు ఫలముల నోము పట్టి, మంచి ఫలములను ఎంచుకొని తగిన దక్షిణతో ఉద్యాపన చేయుమని మంత్రి భార్య చెప్పెను. రాజుగారి భార్య ఆ ప్రకారమే నోము చేసి ఉద్యాపన చేసుకొనెను."
      },
    udyapana: {
        roman: "On the sixteenth day that day's fruit is given to the sixteenth muttaiduva with tambulam and dakshina. Then all sixteen kinds of fruit used in the nomu are gathered in one place, and with them pasupu, kumkuma, flowers, bangles, black beads, a ravike gudda, tambulam and dakshina; and this whole vayanam is given to another muttaiduva and her blessing received. Muttaiduvas are fed a meal or refreshment according to means. In some families all sixteen fruits are given, one a day, to the same muttaiduva, with the udyapana of sixteen fruits at the close; in others one muttaiduva a day. It is best to follow one's own household practice.",
        deva: "",
        tel: "పదహారవ దినమున పదహారవ ముత్తయిదువుకు ఆ దినపు పండును తాంబూలము దక్షిణతో ఇవ్వవలెను. తరువాత నోములో ఉపయోగించిన పదహారు రకముల పండ్లను ఒకచోట సమకూర్చి — వాటితోపాటు పసుపు, కుంకుమ, పువ్వులు, గాజులు, నల్లపూసలు, రవికె గుడ్డ, తాంబూలము, దక్షిణ ఉంచి — ఆ పూర్తి వాయనమును మరొక ముత్తయిదువుకు సమర్పించి ఆశీర్వాదము తీసుకొనవలెను. శక్తిని బట్టి ముత్తయిదువులకు భోజనము లేక అల్పాహారము పెట్టవలెను. కొన్ని కుటుంబములలో పదహారు దినములు ఒకే ముత్తయిదువుకు ఒక్కొక్క ఫలము ఇచ్చి చివర పదహారు ఫలములతో ఉద్యాపన చేయుదురు; మరికొన్నిటిలో దినమునకు ఒక ముత్తయిదువుకు ఇచ్చుట ఆచారము. తమ ఇంటి ఆచారమునే అనుసరించుట మంచిది."
      },
    vayanam: {
        roman: "Fruit, flowers, pasupu, kumkuma, bangles, black beads, ravike gudda, tambulam, dakshina.",
        deva: "",
        tel: "పండ్లు, పువ్వులు, పసుపు, కుంకుమ, గాజులు, నల్లపూసలు, రవికె గుడ్డ, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "padamudu-puvvula-nomu",
    deity: "devi",
    name: {
        roman: "Padamudu Puvvula Nomu",
        deva: "",
        tel: "పదమూడు పువ్వుల నోము"
      },
    when: {
        roman: "The number of days is not stated clearly in the text; family practice may keep it thirteen days, thirteen weeks, or as a year-long sankalpam.",
        deva: "",
        tel: "గ్రంథమున దినముల సంఖ్య స్పష్టముగా లేదు; కుటుంబ సంప్రదాయము ప్రకారము పదమూడు దినములు, పదమూడు వారములు లేక ఏడాది సంకల్పముగా చేయు ఆచారములు ఉండవచ్చును."
      },
    forwhat: {
        roman: "The wellbeing of the household, children, the means to give food and cloth, long sowbhagyam; the phalashruti says that the woman who keeps it with bhakti attains Shiva-loka.",
        deva: "",
        tel: "కుటుంబసౌఖ్యము, సంతానము, అన్నదాన-వస్త్రదాన భాగ్యము, దీర్ఘసౌభాగ్యము; భక్తితో ఆచరించిన స్త్రీకి శివలోకప్రాప్తి అని ఫలశ్రుతి."
      },
    how: {
        roman: "It is the practice to grow jasmine or another flowering plant in the house compound. Each day thirteen flowers are offered to Gauri Devi and the prayer read. Thirteen padmas or their likenesses are offered, a lamp of thirteen wicks lit, and thirteen pradakshinas made. 'Om Umamaheshwarabhyam namah' or 'Om Namah Shivaya' may be japped.",
        deva: "",
        tel: "ఇంటి ప్రాంగణమున మల్లె లేక మరొక పూలమొక్కను పెంచుట సంప్రదాయము. ప్రతిదినము గౌరీదేవికి పదమూడు పువ్వులు సమర్పించి, ప్రార్థన చదువవలెను. పదమూడు పద్మములు లేక వాటి ప్రతిరూపములు సమర్పించి, పదమూడు వత్తులతో దీపము వెలిగించి, పదమూడు ప్రదక్షిణలు చేయవలెను. 'ఓం ఉమామహేశ్వరాభ్యాం నమః' లేక 'ఓం నమః శివాయ' జపించవచ్చును."
      },
    katha: {
        roman: "For this nomu it is not a story but the Gauri-Shiva prayer made with thirteen flowers that is central. With each flower offered, one good is asked: birth in a good family; a wealth of good qualities; the blessing of a worthy daughter; a life of honour; the nine grains and plenty of food; the wellbeing of one's parents; good parents-in-law; unity in the household; ornaments and cloth; sowbhagyam; right understanding in the husband and his fidelity; wealth in the house; and the nearness of Parvati Devi. The prayer says that Shiva and Parvati, pleased with her bhakti, granted the wellbeing of her household, children, the means to give food and cloth, and long sowbhagyam.",
        deva: "",
        tel: "ఈ నోమునకు కథకంటె పదమూడు పువ్వులతో చేయు గౌరీ-శివ ప్రార్థనయే ప్రధానము. ఒక్కొక్క పువ్వు సమర్పించుచు ఒక్కొక్క శుభఫలమును కోరుకొందురు — ఉత్తమ కుటుంబమున జన్మ; సద్గుణసంపద; సుపుత్రికా భాగ్యము; గౌరవప్రదమైన జీవితము; నవధాన్యములు, అన్నసమృద్ధి; తల్లిదండ్రుల క్షేమము; మంచి అత్తమామలు; కుటుంబ ఐక్యత; ఆభరణ వస్త్రసంపద; సౌభాగ్యము; భర్తకు సద్బుద్ధి, ఏకపత్నీవ్రతము; గృహసంపద; పార్వతీదేవి సాన్నిధ్యము. ఆమె భక్తికి మెచ్చిన శివపార్వతులు కుటుంబసౌఖ్యము, సంతానము, అన్నదాన-వస్త్రదాన భాగ్యము, దీర్ఘసౌభాగ్యము ప్రసాదించిరని ప్రార్థన చెప్పును."
      },
    udyapana: {
        roman: "Thirteen double handfuls of rice; thirteen golden flowers; thirteen coins; pasupu, kumkuma and flowers; dakshina and tambulam. The text says these are to be taken to a Shiva temple and puja done to the Shivalingam.",
        deva: "",
        tel: "పదమూడు దోసిళ్ళ బియ్యము; పదమూడు బంగారు పువ్వులు; పదమూడు నాణేలు; పసుపు, కుంకుమ, పూలు; దక్షిణ, తాంబూలము. వీటిని శివాలయమునకు తీసుకువెళ్ళి శివలింగమునకు పూజ చేయవలెనని గ్రంథమున ఉన్నది."
      },
    vayanam: {
        roman: "Rice, golden flowers, coins, pasupu, kumkuma, flowers, dakshina, tambulam.",
        deva: "",
        tel: "బియ్యము, బంగారు పువ్వులు, నాణేలు, పసుపు, కుంకుమ, పూలు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "mogga-dosilla-nomu",
    deity: "devi",
    name: {
        roman: "Mogga Dosilla Nomu",
        deva: "",
        tel: "మొగ్గదోసిళ్ళ నోము"
      },
    when: {
        roman: "How many days or years is not stated clearly in the available source text. It is better not to fix the duration oneself without knowing the family's own practice.",
        deva: "",
        tel: "ఎన్ని దినములు లేక సంవత్సరములు అనునది అందుబాటులో ఉన్న మూలపాఠమున స్పష్టముగా లేదు. కుటుంబాచారము తెలియకుండా స్వయముగా కాలవ్యవధిని నిర్ణయించకుండుట మంచిది."
      },
    forwhat: {
        roman: "The lifting of poverty and of a stepmother's harshness; every kind of aishwaryam.",
        deva: "",
        tel: "దారిద్ర్యము, సవతితల్లి బాధలు తొలగుట; సకల ఐశ్వర్యములు."
      },
    how: {
        roman: "Each day, after bathing, three double handfuls of water mixed with a little pasupu are poured into a platter. Meditating on Shiva, this rule is continued daily. 'Om Namah Shivaya' is japped and the katha read. When the nomu is complete, puja is done at a Shiva temple to the Rudrapadas or the Shivalingam.",
        deva: "",
        tel: "ప్రతిదినము స్నానము చేసి, ఒక పళ్ళెములో కొద్దిగా పసుపు కలిపిన నీటిని మూడు దోసిళ్ళు పోయవలెను. శివుని ధ్యానించుచు ఈ నియమమును ప్రతిదినము కొనసాగించవలెను. 'ఓం నమః శివాయ' జపించి కథ చదువవలెను. నోము పూర్తయిన తరువాత శివాలయమున రుద్రపాదములకు లేక శివలింగమునకు పూజ చేయవలెను."
      },
    katha: {
        roman: "A brahmana's daughter had in a former birth taken up the mogga dosilla nomu, transgressed it, and died. In the next birth she was born in another brahmana's house; her mother died while she was small and a stepmother came. Poverty in the house and the stepmother's harshness both grew. Unable to bear it, one day she sat by the dhvajastambham in a Shiva temple and prayed to Parameshwara. Pleased with her bhakti, Shiva came in the form of a brahmana and asked the cause of her grief. When she told her troubles he said: 'In a former birth you transgressed the mogga dosilla nomu; that is why this poverty and this harshness from a stepmother have come. Keep it again now with bhakti' — and explained the method. She completed it accordingly, obtained every aishwaryam, and lived in comfort.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ కుమార్తె పూర్వజన్మలో మొగ్గదోసిళ్ళ నోము పట్టి ఉల్లంఘించి మరణించెను. మరుజన్మలో మరొక బ్రాహ్మణుని ఇంట జన్మించెను; చిన్నతనముననే తల్లి మరణించుటచే సవతితల్లి వచ్చెను. ఇంట దారిద్ర్యము, సవతితల్లి వేధింపులు ఎక్కువయ్యెను. ఆ బాధలు భరించలేక ఒకనాడు శివాలయములోని ధ్వజస్తంభము దగ్గర కూర్చొని పరమేశ్వరుని ప్రార్థించెను. ఆమె భక్తికి మెచ్చిన శివుడు బ్రాహ్మణ రూపమున వచ్చి బాధకు కారణమడిగెను. ఆమె తన కష్టములను చెప్పగా — 'నీవు పూర్వజన్మలో మొగ్గదోసిళ్ళ నోమును ఉల్లంఘించితివి; అందువలననే ఈ దారిద్ర్యము, సవతితల్లి బాధలు వచ్చినవి. ఇప్పుడు తిరిగి భక్తితో ఆచరించు' అని విధానమును వివరించెను. ఆమె ఆ ప్రకారము పూర్తి చేసి సకల ఐశ్వర్యములను పొంది సుఖముగా జీవించెను."
      },
    udyapana: {
        roman: "By the original text — three double handfuls of pearls; three double handfuls of corals; dakshina; tambulam; and Rudrapada puja at a Shiva temple.",
        deva: "",
        tel: "అసలు గ్రంథమున — మూడు దోసిళ్ళ ముత్యములు; మూడు దోసిళ్ళ పగడములు; దక్షిణ; తాంబూలము; శివాలయమున రుద్రపాద పూజ."
      },
    vayanam: {
        roman: "Pearls, corals, dakshina, tambulam.",
        deva: "",
        tel: "ముత్యములు, పగడములు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "akshaya-bondala-nomu",
    deity: "devi",
    name: {
        roman: "Akshaya Bondala Nomu",
        deva: "",
        tel: "అక్షయబొండాల నోము"
      },
    when: {
        roman: "Daily bath, one year.",
        deva: "",
        tel: "ప్రతినిత్యము స్నానము చేసి — ఒక సంవత్సర కాలము."
      },
    forwhat: {
        roman: "Akshaya sampada, akshaya santati, akshaya mangalyam, akshaya moksham.",
        deva: "",
        tel: "అక్షయ సంపద, అక్షయ సంతతి, అక్షయ మాంగల్యము, అక్షయ మోక్షము."
      },
    how: {
        roman: "The nomu verse is said and pavitrakshatalu placed on the head. Five pasupu balls the size of a kunkudukaya are made and offered to five muttaiduvas.",
        deva: "",
        tel: "నోము పద్యము చెప్పుకొని పవిత్రాక్షతలు శిరసున దాల్చవలెను. కుంకుడుకాయ పరిమాణములో అయిదు పసుపు ముద్దలు తయారు చేసుకొని అయిదుగురు ముత్తయిదువులకు సమర్పించవలెను."
      },
    katha: {
        roman: "This nomu has no narrative katha but a verse.",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; పద్యము కలదు."
      },
    udyapana: {
        roman: "Dakshina, tambulam, ravikela guddalu, pasupu, kumkuma and good bondalu are given as vayanam.",
        deva: "",
        tel: "దక్షిణ, తాంబూలము, రవికెల గుడ్డలు, పసుపు, కుంకుమ, మంచి బొండాలు వాయనమిచ్చుకొనవలెను."
      },
    vayanam: {
        roman: "Pasupu balls, bondalu, ravikela guddalu.",
        deva: "",
        tel: "పసుపు ముద్దలు, బొండాలు, రవికెల గుడ్డలు."
      },
  },
  //
  {
    id: "sahasra-phalamula-nomu",
    deity: "devi",
    name: {
        roman: "Sahasra Phalamula Nomu",
        deva: "",
        tel: "సహస్రఫలముల నోము"
      },
    when: {
        roman: "A nomu that may be kept at all times.",
        deva: "",
        tel: "ఎల్లకాలము చేయదగిన నోము."
      },
    forwhat: {
        roman: "The grace of all the devatas; gold in the fold of the garment.",
        deva: "",
        tel: "సర్వదేవతల దయ; కొంగుబంగారము."
      },
    how: {
        roman: "The katha is told, akshatalu placed, and the udyapana done.",
        deva: "",
        tel: "కథ చెప్పుకొని అక్షతలు వేసుకొని ఉద్యాపన చేసుకొనవలెను."
      },
    katha: {
        roman: "One day Parvati asked Shiva, 'Natha, which is the nomu that may be kept at all times?' That Swami said: 'Parvati, the sahasra phalamula nomu is the one fit to be kept at all times. For the woman who keeps that nomu, the grace of all the devatas is gold in the fold of her garment.'",
        deva: "",
        tel: "ఒకనాడు పార్వతి శివుని — 'నాథా! ఎల్లకాలము చేయు నోము వ్రతమేది?' అని అడుగగా, ఆ స్వామి — 'పార్వతీ! సహస్ర ఫలముల నోము ఎల్లకాలము చేయదగిన నోము. ఆ నోము చేసిన స్త్రీకి సర్వదేవతల దయయు కొంగుబంగారమై ఉండును' అని చెప్పెను."
      },
    udyapana: {
        roman: "A thousand kinds of fruit, a thousand of each kind, are gathered in their season and given with fitting dakshina to a thousand couples. The same kind of fruit is not to be given twice to the same person.",
        deva: "",
        tel: "వేయి రకముల పండ్లు, రకమునకు ఒక వేయి చొప్పున ఏరుకొని, అవి వచ్చు కాలములో తగిన దక్షిణలతో వేయిమంది దంపతులకు ఇచ్చుచుండవలెను. ఒకే రకము పండ్లను ఇచ్చినవారికి మరల ఇవ్వరాదు."
      },
    vayanam: {
        roman: "A thousand kinds of fruit, dakshina.",
        deva: "",
        tel: "వేయి రకముల పండ్లు, దక్షిణ."
      },
  },
  //
  {
    id: "nitya-tambulamu-nomu",
    deity: "devi",
    name: {
        roman: "Nitya Tambulamu Nomu",
        deva: "",
        tel: "నిత్య తాంబూలము నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The husband's affection.",
        deva: "",
        tel: "భర్త అనురాగము."
      },
    how: {
        roman: "Each day a tambulam is given to a muttaiduva, and she takes tambulam herself.",
        deva: "",
        tel: "ప్రతిదినము ఒక తాంబూలమును ముత్తయిదువునకిచ్చి, తానును తాంబూలము వేసుకొనవలెను."
      },
    katha: {
        roman: "A king had no love for his wife and frequented the houses of courtesans. So his wife grieved and did the worship of Parvati. One day Parvati Devi appeared in a dream: 'Amma, because you did not do tambula danam in a former time, bad breath has come to you in this birth. Unable to bear it your husband goes to the houses of courtesans. Therefore do nitya tambula danam and take tambulam yourself. After a year do the udyapana; your troubles will pass.' She kept the nomu so, did the udyapana when the year was full, gained her husband's affection, and lived in gladness.",
        deva: "",
        tel: "ఒక రాజు భార్యయందు ప్రేమ లేక సానికొంపలను పట్టియుండెను. అందుచే భార్య దుఃఖించుచు పార్వతీ పూజలు చేయుచుండెను. ఒకనాడు కలలో పార్వతీదేవి కనిపించి — 'అమ్మా! నీవు పూర్వము తాంబూలదానము చేయకపోవుటచే నీకీ జన్మలో నోటి దుర్వాసన వచ్చినది. అది భరింపలేక నీ భర్త వేశ్యాగృహములకు పోవుచున్నాడు. కావున నీవు నిత్య తాంబూలదానము చేసి తాంబూలము సేవింపుము. ఏడాదైన తర్వాత ఉద్యాపనము చేసుకొనుము; నీ కష్టములు గట్టెక్కును' అని చెప్పెను. ఆమె అట్లే నోము నోచుకొని, సంవత్సరము నిండగానే ఉద్యాపనము చేసుకొని, భర్త అనురాగమును పొంది ఆనందముగా ఉండెను."
      },
    udyapana: {
        roman: "Golden leaves and silver pieces together with tambulam are given to a brahmana.",
        deva: "",
        tel: "బంగారపు ఆకులు, వెండి చెక్కలు కలిపి తాంబూలములతో బ్రాహ్మణునకు ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Tambulam, golden leaves, silver pieces.",
        deva: "",
        tel: "తాంబూలము, బంగారపు ఆకులు, వెండి చెక్కలు."
      },
  },
  //
  {
    id: "krittika-deepala-nomu",
    deity: "devi",
    name: {
        roman: "Krittika Deepala Nomu",
        deva: "",
        tel: "కృత్తిక దీపాల నోము"
      },
    when: {
        roman: "The Krittika nakshatram in Kartika.",
        deva: "",
        tel: "కార్తీక మాసములోని కృత్తికా నక్షత్రము."
      },
    forwhat: {
        roman: "Children; and their health.",
        deva: "",
        tel: "సంతానము; సంతానారోగ్యము."
      },
    how: {
        roman: "On the Krittika nakshatram a lamp of six wicks is lit and Kumaraswami worshipped, and the Krittikas prayed to.",
        deva: "",
        tel: "కృత్తికా నక్షత్రము నాడు ఆరు వత్తుల దీపమును వెలిగించి కుమారస్వామిని పూజించవలెను. కృత్తికలను ప్రార్థించవలెను."
      },
    katha: {
        roman: "A couple long had no children. A rishi said that the Krittikas were the mothers who reared Kumaraswami, and that worshipping them brought children; and he directed the krittika dipamula nomu. On the Krittika nakshatram the couple lit a lamp of six wicks, kept it for a year and did the udyapana, and children came to them.",
        deva: "",
        tel: "ఒక దంపతులకు చిరకాలము సంతానము కలుగలేదు. ఒక ఋషి — కృత్తికలు కుమారస్వామిని పెంచిన తల్లులని, వారిని ఆరాధించినచో సంతానము కలుగుననని చెప్పి కృత్తిక దీపముల నోమును సూచించెను. ఆ దంపతులు కృత్తికా నక్షత్రము నాడు ఆరు వత్తుల దీపము వెలిగించి ఏడాది ఆచరించి ఉద్యాపన చేయగా సంతానము కలిగెను."
      },
    udyapana: {
        roman: "Six pramidas, six cloths, six kinds of fruit, dakshina and tambulam — puja is done in a Subrahmanya temple and the vayanam given to six brahmanas or muttaiduvas.",
        deva: "",
        tel: "ఆరు ప్రమిదలు, ఆరు వస్త్రములు, ఆరు రకముల పండ్లు, దక్షిణ తాంబూలము — సుబ్రహ్మణ్య స్వామి ఆలయమున పూజ చేసి ఆరుగురు బ్రాహ్మణులకు లేక ముత్తయిదువులకు వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Pramidas, cloths, fruit, dakshina, tambulam.",
        deva: "",
        tel: "ప్రమిదలు, వస్త్రములు, పండ్లు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "navagraha-deepala-nomu",
    deity: "devi",
    name: {
        roman: "Navagraha Deepala Nomu",
        deva: "",
        tel: "నవగ్రహ దీపాల నోము"
      },
    when: {
        roman: "Daily for one year; in some families only on Tuesdays and Saturdays.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము. కొన్ని కుటుంబములలో మంగళవారము, శనివారము మాత్రమే."
      },
    forwhat: {
        roman: "The removal of graha-dosham; health.",
        deva: "",
        tel: "గ్రహదోష నివారణ; ఆరోగ్యము."
      },
    how: {
        roman: "A lamp of nine wicks is lit and the navagrahas prayed to.",
        deva: "",
        tel: "తొమ్మిది వత్తుల దీపమును వెలిగించి నవగ్రహములను ప్రార్థించవలెను."
      },
    katha: {
        roman: "A king, afflicted by graha-doshams, was ceaselessly ill. The royal purohita directed the navagraha dipamula nomu. For a year the queen lit a lamp of nine wicks each day and prayed to the navagrahas. When the udyapana was done at the year's end the king was restored to health, and famine and disease left the kingdom.",
        deva: "",
        tel: "ఒక రాజు గ్రహదోషములచే నిరంతరము రోగపీడితుడై బాధపడుచుండెను. రాజపురోహితుడు నవగ్రహ దీపముల నోమును సూచించెను. రాణి ఏడాదిపాటు ప్రతిదినము తొమ్మిది వత్తుల దీపమును వెలిగించి నవగ్రహములను ప్రార్థించెను. సంవత్సరాంతమున ఉద్యాపన చేయగా రాజు ఆరోగ్యవంతుడయ్యెను; రాజ్యమున క్షామము, రోగములు తొలగినవి."
      },
    udyapana: {
        roman: "Nine pramidas, nine kinds of grain, nine cloths, nine kinds of fruit, and tokens of the navaratna, with navagraha puja, given in dana to nine brahmanas.",
        deva: "",
        tel: "తొమ్మిది ప్రమిదలు, తొమ్మిది రకముల ధాన్యములు, తొమ్మిది వస్త్రములు, తొమ్మిది రకముల పండ్లు, నవరత్న ప్రతీకలు — నవగ్రహ పూజ చేసి తొమ్మిదిమంది బ్రాహ్మణులకు దానము చేయవలెను."
      },
    vayanam: {
        roman: "Pramidas, the nine grains, cloths, fruit, dakshina, tambulam.",
        deva: "",
        tel: "ప్రమిదలు, నవధాన్యములు, వస్త్రములు, పండ్లు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "nela-sankramana-deepala-nomu",
    deity: "surya",
    name: {
        roman: "Nela Sankramana Deepala Nomu",
        deva: "",
        tel: "నెల సంక్రమణ దీపాల నోము"
      },
    when: {
        roman: "Each monthly sankramanam — twelve in all.",
        deva: "",
        tel: "ప్రతి నెల సంక్రమణము — పన్నెండు సంక్రమణములు."
      },
    forwhat: {
        roman: "Unity in the household; wealth; the ending of quarrels among kin.",
        deva: "",
        tel: "కుటుంబ ఐక్యత; సంపద; బంధువుల నడుమ కలహములు తొలగుట."
      },
    how: {
        roman: "On the sankramanam day, at sunrise, a lamp is lit facing the sun and surya-namaskaram made. On that same day tambulam is given to a muttaiduva.",
        deva: "",
        tel: "సంక్రమణ దినమున సూర్యోదయ సమయమున సూర్యునికి అభిముఖముగా దీపము వెలిగించి సూర్యనమస్కారము చేయవలెను. అదే దినమున ఒక ముత్తయిదువుకు తాంబూలము ఇవ్వవలెను."
      },
    katha: {
        roman: "In one household there were ceaseless quarrels among its members and money troubles besides. A sadhu said this state had come because in a former birth they had neglected to light the lamp on the sankramanam day, and directed the nela sankramana dipamula nomu. The women of the house lit the lamp through twelve sankramanams and did the udyapana, and unity and wealth came to them.",
        deva: "",
        tel: "ఒక కుటుంబములో సభ్యుల నడుమ నిరంతరము కలహములు, ఆర్థిక ఇబ్బందులు ఉండెడివి. ఒక సాధువు — వారు పూర్వజన్మలో సంక్రమణ దినమున దీపము వెలిగించుటను నిర్లక్ష్యము చేసినందున ఈ స్థితి వచ్చినదని చెప్పి, నెల సంక్రమణ దీపముల నోమును సూచించెను. కుటుంబ స్త్రీలు పన్నెండు సంక్రమణములు దీపము వెలిగించి ఉద్యాపన చేయగా ఐక్యత, సంపద కలిగినవి."
      },
    udyapana: {
        roman: "Twelve pramidas, twelve cloths, twelve kinds of fruit, twelve coins, dakshina and tambulam — given as vayanam to twelve muttaiduvas.",
        deva: "",
        tel: "పన్నెండు ప్రమిదలు, పన్నెండు వస్త్రములు, పన్నెండు రకముల పండ్లు, పన్నెండు నాణేలు, దక్షిణ తాంబూలము — పన్నెండుమంది ముత్తయిదువులకు వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Pramidas, cloths, fruit, coins, dakshina, tambulam.",
        deva: "",
        tel: "ప్రమిదలు, వస్త్రములు, పండ్లు, నాణేలు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "pedda-sankramana-deepala-nomu",
    deity: "surya",
    name: {
        roman: "Pedda Sankramana Deepala Nomu",
        deva: "",
        tel: "పెద్ద సంక్రమణ దీపాల నోము"
      },
    when: {
        roman: "Makara Sankramanam.",
        deva: "",
        tel: "మకర సంక్రమణము."
      },
    forwhat: {
        roman: "The undoing of poverty; health; every auspiciousness.",
        deva: "",
        tel: "దారిద్ర్య నివారణ; ఆరోగ్యము; సకల శుభములు."
      },
    how: {
        roman: "On the day of Makara Sankramanam, abhyangana snanam is done, a great lamp lit and Aditya prayed to. Annadanam is performed.",
        deva: "",
        tel: "మకర సంక్రమణ దినమున అభ్యంగన స్నానము చేసి, పెద్ద దీపమును వెలిగించి ఆదిత్యుని ప్రార్థించవలెను. అన్నదానము చేయవలెను."
      },
    katha: {
        roman: "A merchant kept the great sankramanam lamp-dana every year. One year, on account of losses in trade, he let it go. From the next year poverty and illness came upon his household. Aditya appeared to him in a dream and told him the cause was the giving up of the pedda sankramanam dipadanam. He kept it again and did the udyapana, and wealth and health came back.",
        deva: "",
        tel: "ఒక వ్యాపారి ఏటి పెద్ద సంక్రమణ దీపదానమును ఆచరించుచుండెను. ఒక సంవత్సరము వ్యాపార నష్టముల కారణముగా విడిచిపెట్టెను. ఆ మరుసటి సంవత్సరమునుండి అతని కుటుంబమునకు దారిద్ర్యము, రోగములు వచ్చినవి. ఆదిత్యుడు స్వప్నమున కనిపించి — పెద్ద సంక్రమణ దీపదానము మానుటయే కారణమని తెలిపెను. అతడు తిరిగి ఆచరించి ఉద్యాపన చేయగా సంపద, ఆరోగ్యము తిరిగి లభించినవి."
      },
    udyapana: {
        roman: "A great pramida; ghee or oil; sesame; bellam; new cloth; grain; dakshina and tambulam — Aditya is worshipped and the dana given to brahmanas.",
        deva: "",
        tel: "పెద్ద ప్రమిద; నెయ్యి లేక నూనె; నువ్వులు; బెల్లము; క్రొత్త వస్త్రములు; ధాన్యము; దక్షిణ తాంబూలము — ఆదిత్యుని పూజించి బ్రాహ్మణులకు దానము చేయవలెను."
      },
    vayanam: {
        roman: "Pramida, ghee, sesame, bellam, cloth, grain, dakshina, tambulam.",
        deva: "",
        tel: "ప్రమిద, నెయ్యి, నువ్వులు, బెల్లము, వస్త్రములు, ధాన్యము, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "guna-deepalu-bana-deepalu-nomu",
    deity: "devi",
    name: {
        roman: "Guna Deepalu Bana Deepalu Nomu",
        deva: "",
        tel: "గూనదీపాలు బానదీపాలు నోము"
      },
    when: {
        roman: "Kartika masam.",
        deva: "",
        tel: "కార్తీక మాసము."
      },
    forwhat: {
        roman: "Ease in this world, and a good passage from it.",
        deva: "",
        tel: "ఇహమున సుఖము, పరమున సద్గతి."
      },
    how: {
        roman: "Lamps are lit in clay pots and kept through the whole of Kartika. It is the practice to use pots of two kinds, small and large.",
        deva: "",
        tel: "మట్టికుండలలో దీపములు వెలిగించి కార్తీక మాసమంతయు ఆచరించవలెను. చిన్నవి పెద్దవి రెండు రకముల కుండలను వాడుట సంప్రదాయము."
      },
    katha: {
        roman: "Two sisters — one wealthy, one poor. The wealthy one lit her lamps in great banas; the poor one lit hers, with bhakti, in the small gunas she had. Pleased with her bhakti, Parameshwara appeared and said: 'It is not the size of the lamp but the bhakti that matters' — and granted both of them ease in this world and a good passage from it.",
        deva: "",
        tel: "ఇద్దరు అక్కాచెల్లెళ్ళు — ఒకరు ధనవంతురాలు, ఒకరు పేదరాలు. ధనవంతురాలు పెద్ద బానలలో దీపములు వెలిగించెను; పేదరాలు తనకున్న చిన్న గూనలలోనే భక్తితో వెలిగించెను. ఆమె భక్తికి మెచ్చి పరమేశ్వరుడు ప్రత్యక్షమై — 'దీపము పరిమాణము కాదు, భక్తియే ముఖ్యము' అని చెప్పి ఇద్దరికిని ఇహపర సుఖములను ప్రసాదించెను."
      },
    udyapana: {
        roman: "Large and small pots; ghee or oil; wicks; dakshina and tambulam — given in dana to the temple.",
        deva: "",
        tel: "పెద్ద, చిన్న కుండలు; నెయ్యి లేక నూనె; వత్తులు; దక్షిణ తాంబూలము — ఆలయమునకు దానము చేయవలెను."
      },
    vayanam: {
        roman: "Pots, ghee, wicks, dakshina, tambulam.",
        deva: "",
        tel: "కుండలు, నెయ్యి, వత్తులు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "baravattula-mooravattula-nomu",
    deity: "devi",
    name: {
        roman: "Baravattula Mooravattula Nomu",
        deva: "",
        tel: "బారవత్తుల మూరవత్తుల నోము"
      },
    when: {
        roman: "Kartika masam.",
        deva: "",
        tel: "కార్తీక మాసము."
      },
    forwhat: {
        roman: "Long life; ease.",
        deva: "",
        tel: "దీర్ఘాయువు; సుఖము."
      },
    how: {
        roman: "Long wicks are made — to the bara and moora measures — and the lamps lit through Kartika. The nomu takes its name from the length of the wicks.",
        deva: "",
        tel: "పొడవైన వత్తులు (బార, మూర కొలతలు) చేసి కార్తీక మాసమున దీపములు వెలిగించవలెను. వత్తుల పొడవును బట్టియే ఈ నోముకు పేరు."
      },
    katha: {
        roman: "A woman kept the nomu through Kartika, lighting her lamps with long wicks. Pleased with her bhakti, Parvati and Parameshwara granted her long life and ease. The sense the nomu carries is that the length of the wick is the length of the life.",
        deva: "",
        tel: "ఒక స్త్రీ కార్తీక మాసమున పొడవైన వత్తులతో దీపములు వెలిగించుచు నోము ఆచరించెను. ఆమె భక్తికి మెచ్చి పార్వతీపరమేశ్వరులు దీర్ఘాయువును, సుఖమును ప్రసాదించిరి. 'వత్తి పొడవు ఆయుష్షు పొడవు' అనునది ఈ నోములోని భావము."
      },
    udyapana: {
        roman: "Wicks of the bara and moora measures; pramidas; ghee; dakshina and tambulam — given in dana to the temple.",
        deva: "",
        tel: "బార, మూర కొలతల వత్తులు; ప్రమిదలు; నెయ్యి; దక్షిణ తాంబూలము — ఆలయమునకు దానము చేయవలెను."
      },
    vayanam: {
        roman: "Wicks, pramidas, ghee, dakshina, tambulam.",
        deva: "",
        tel: "వత్తులు, ప్రమిదలు, నెయ్యి, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "laksha-vattula-nomu",
    deity: "devi",
    name: {
        roman: "Laksha Vattula Nomu",
        deva: "",
        tel: "లక్ష వత్తుల నోము"
      },
    when: {
        roman: "Kartika masam; or a year, according to the sankalpam taken. It may be continued until the lakh is complete.",
        deva: "",
        tel: "కార్తీక మాసము; లేక సంకల్పమును బట్టి ఒక సంవత్సరము. లక్ష సంఖ్య పూర్తియగువరకు కొనసాగించవచ్చును."
      },
    forwhat: {
        roman: "Long life; aishwaryam; the destruction of papam; the coming of knowledge.",
        deva: "",
        tel: "దీర్ఘాయువు; ఐశ్వర్యము; పాపనాశనము; జ్ఞానప్రాప్తి."
      },
    how: {
        roman: "Each day, in a Shiva temple or at home, lamps are lit with a fixed number of wicks. The count of wicks lit is recorded and the giving continued until the lakh is complete. The verse is prayed: the lamp is jyoti, the parabrahma; the lamp dispels all darkness; by the lamp all is accomplished — salutation to the evening lamp.",
        deva: "",
        tel: "ప్రతిదినము శివాలయమున లేక ఇంటిలో నిర్ణీత సంఖ్యలో వత్తులతో దీపములు వెలిగించవలెను. వెలిగించిన వత్తుల సంఖ్యను నమోదు చేసుకొనుచు లక్ష పూర్తియగువరకు కొనసాగించవలెను. 'దీపం జ్యోతిః పరంబ్రహ్మ, దీపం సర్వతమోపహమ్ | దీపేన సాధ్యతే సర్వం సంధ్యా దీప నమోஉస్తుతే ||' అని ప్రార్థించవలెను."
      },
    katha: {
        roman: "A wealthy man used to make the lamp-dana every year. One year, out of pride, he neglected it. From that time his wealth wasted, and darkness, illness and quarrelling entered the house. A rishi told him that the lamp is not merely light but the sign of knowledge and of life itself, and that by keeping the laksha vattula nomu papam is destroyed and knowledge comes. He lit lamps every day until the lakh of wicks was complete, did the udyapana, and wealth, health and the unity of his household came back.",
        deva: "",
        tel: "ఒక ధనవంతుడు ప్రతిసంవత్సరము దీపదానము చేయుచుండెడివాడు. ఒక సంవత్సరము గర్వముచేత దానిని నిర్లక్ష్యము చేసెను. ఆ మరుసటి కాలమునుండి అతని సంపద క్షీణించి కుటుంబమున అంధకారము, అనారోగ్యము, కలహములు ప్రవేశించినవి. ఒక ఋషి — దీపము కేవలము వెలుగు కాదు, జ్ఞానమునకు, ఆయుష్షునకు ప్రతీక అనియు, లక్ష వత్తుల నోమును ఆచరించినచో పాపము నశించి జ్ఞానము కలుగుననియు తెలిపెను. అతడు ప్రతిదినము దీపములు వెలిగించుచు లక్ష వత్తులు పూర్తి చేసి ఉద్యాపన చేయగా సంపద, ఆరోగ్యము, కుటుంబ ఐక్యత తిరిగి లభించినవి."
      },
    udyapana: {
        roman: "Silver or bronze pramidas; ghee or oil; the remaining wicks; cloth; dakshina and tambulam — given in dana to a Shiva temple, and the lamp-dana made to brahmanas or muttaiduvas. Any question about the sankalpam is to be settled with the family purohita.",
        deva: "",
        tel: "వెండి లేక కంచు ప్రమిదలు; నెయ్యి లేక నూనె; మిగిలిన వత్తులు; వస్త్రములు; దక్షిణ తాంబూలము — శివాలయమునకు దానము చేసి, బ్రాహ్మణులకు లేక ముత్తయిదువులకు దీపదానము చేయవలెను. సంకల్పమునకు సంబంధించిన సంశయములు కుటుంబ పురోహితునితో నిర్ణయించుకొనవలెను."
      },
    vayanam: {
        roman: "Pramidas, ghee, wicks, cloth, dakshina, tambulam.",
        deva: "",
        tel: "ప్రమిదలు, నెయ్యి, వత్తులు, వస్త్రములు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "deepadanamu-nomu",
    deity: "devi",
    name: {
        roman: "Deepadanamu Nomu",
        deva: "",
        tel: "దీపదానము నోము"
      },
    when: {
        roman: "Daily, for one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "The removal of eye affliction; of blindness; the coming of knowledge.",
        deva: "",
        tel: "దృష్టిదోష నివారణ; అంధత్వ నివారణ; జ్ఞానప్రాప్తి."
      },
    how: {
        roman: "Each evening a lamp is lit in a temple.",
        deva: "",
        tel: "ప్రతిదినము సాయంత్రము దేవాలయమున దీపము వెలిగించవలెను."
      },
    katha: {
        roman: "A girl born to a poor brahmana couple was blind from birth. No physician could cure her. An old brahmana came and said that in a former birth she had put out a lamp burning in a temple, and blindness had come to her in this birth for it. He directed the dipadanam nomu. Her parents lit a lamp in the temple every day for a year and did the udyapana, and the girl's sight came.",
        deva: "",
        tel: "ఒక పేద బ్రాహ్మణ దంపతులకు పుట్టిన బాలిక పుట్టుకతోనే అంధురాలు. వైద్యులు ఎవ్వరును నయము చేయలేకపోయిరి. ఒక వృద్ధ బ్రాహ్మణుడు వచ్చి — ఆ బాలిక పూర్వజన్మలో దేవాలయమున వెలుగుచున్న దీపమును ఆర్పివేసినందున ఈ జన్మలో అంధత్వము వచ్చినదని చెప్పెను. దీపదానము నోము చేయుమని సూచించెను. తల్లిదండ్రులు ఏడాదిపాటు ప్రతిదినము దేవాలయమున దీపము వెలిగించి ఉద్యాపన చేయగా బాలికకు చూపు వచ్చెను."
      },
    udyapana: {
        roman: "Silver pramidas, oil or ghee, wicks, dakshina and tambulam are given in dana to the temple. The lamp-dana may be made to brahmanas or to muttaiduvas.",
        deva: "",
        tel: "వెండి ప్రమిదలు, నూనె లేక నెయ్యి, వత్తులు, దక్షిణ తాంబూలము — దేవాలయమునకు దానము చేయవలెను. బ్రాహ్మణులకు లేక ముత్తయిదువులకు దీపదానము చేయవచ్చును."
      },
    vayanam: {
        roman: "Pramidas, oil or ghee, wicks, dakshina, tambulam.",
        deva: "",
        tel: "ప్రమిదలు, నూనె లేక నెయ్యి, వత్తులు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "annamu-muttani-adivaramula-nomu",
    deity: "surya",
    name: {
        roman: "Annamu Muttani Adivaramula Nomu",
        deva: "",
        tel: "అన్నము ముట్టని ఆదివారముల నోము"
      },
    when: {
        roman: "Sundays; completed within three years, or a year and a half for elders.",
        deva: "",
        tel: "ఆదివారములు — మూడు సంవత్సరముల లోపల. పెద్దవారు సంవత్సరమున్నర లోపల పూర్తి చేయవలెను."
      },
    forwhat: {
        roman: "Santanam — for children.",
        deva: "",
        tel: "సంతానము."
      },
    how: {
        roman: "A portion of the house is smeared with cow dung and the rangavallulu laid. Gananatha is served, Vani worshipped, an image of Bala Bhaskara made; after bathing and putting on silk the vratam is kept. Pala pongali is the naivedyam.",
        deva: "",
        tel: "గృహమున ఒక భాగము ఆవుపేడతో అలికి రంగవల్లులు తీర్చవలెను. గణనాథుని సేవించి, వాణిని పూజించి, బాలభాస్కరుని ప్రతిమను చేసి, స్నానమాచరించి పట్టుబట్టలు ధరించి వ్రతమాచరించవలెను. పాలపొంగలి నైవేద్యము."
      },
    katha: {
        roman: "A brahmana had two daughters and seven sons; the youngest was Sringaravati. Long after her marriage she had borne no child. When her father visited, she told him her grief. He prayed to Surya Narayana Murti, who appeared and said: 'Do not grieve. Go to Somidevamma. She is a punyatmuralu who has kept three hundred and sixty nomulu. Tell her everything about your daughter and ask her the way.' The brahmana went to Somidevamma, and she poured out the full fruit of her own merit and taught him the vidhi in detail. His daughter kept the nomu, and by its fruit she conceived and bore a child.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు ఇద్దరు కుమార్తెలు, ఏడుగురు కుమారులు. అందరిలో చిన్నది శృంగారవతి. వివాహమై చాలాకాలమైనను కడుపు పండలేదు. ఒకనాడు తండ్రి కుమార్తెను చూడ వచ్చినపుడు ఆమె తన బాధను వివరించి చెప్పినది. తండ్రి సూర్యనారాయణ మూర్తిని ప్రార్థించగా ఆయన ప్రత్యక్షమై — 'విచారించకు. సోమిదేవమ్మ దగ్గరకు వెళ్ళు. ఆమె మూడువందల అరవై నోములు నోచిన పుణ్యాత్మురాలు. నీ కుమార్తె విషయమంతా ఆమెకు చెప్పి ఉపాయమడుగు' అని చెప్పి అంతర్ధానమయ్యెను. బ్రాహ్మణుడు సోమిదేవమ్మ వద్దకు వెళ్ళి అడుగగా, ఆమె తాను చేసిన పుణ్యఫలము నుండి పూర్ణఫలము ధారపోసి వ్రతవిధానము వివరముగా చెప్పినది. కుమార్తె అట్లే నోము నోచినది; వ్రతఫలముగా కడుపు పండి సంతానము కలిగినది."
      },
    udyapana: {
        roman: "Twelve muttaiduvas are given vastram, dakshina and tambulam, with one hundred and thirty-three burelu in a copper platter.",
        deva: "",
        tel: "పన్నెండు మంది ముత్తయిదువులకు వస్త్రము, దక్షిణ, తాంబూలములతో నూట ముప్పది మూడు బూరెలను రాగి పళ్ళెమునందుంచి వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Burelu, vastram, dakshina, tambulam.",
        deva: "",
        tel: "బూరెలు, వస్త్రము, దక్షిణ, తాంబూలము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "apada-leni-adivarapu-nomu",
    deity: "surya",
    name: {
        roman: "Apada Leni Adivarapu Nomu",
        deva: "",
        tel: "ఆపద లేని ఆదివారపు నోము"
      },
    when: {
        roman: "Twelve consecutive Sundays; udyapana on the thirteenth.",
        deva: "",
        tel: "వరుసగా పన్నెండు ఆదివారములు; పదమూడవ ఆదివారమున ఉద్యాపన."
      },
    forwhat: {
        roman: "Relief from apada; the return of what was lost.",
        deva: "",
        tel: "ఆపదల నివారణ; పోయిన సంపద తిరిగి పొందుట."
      },
    how: {
        roman: "After bathing, chakkera pongali is made, placed on a banana leaf with cow ghee, and offered to Surya Bhagavan. Vayanam is given to a kanne muttaiduva.",
        deva: "",
        tel: "స్నానము చేసి శుచియై చక్కెర పొంగలి తయారు చేసి, అరటి ఆకునందుంచి, ఆవునెయ్యి వేసి సూర్యభగవానునకు నైవేద్యము పెట్టవలెను. కన్నె ముత్తయిదువుకు వాయనమివ్వవలెను."
      },
    katha: {
        roman: "A wealthy brahmana helped everyone without distinction of his own and others, gave beyond measure, and the word 'no' never came from his mouth. In time he became poor and his wealth was gone. The very people he had helped turned their faces away; some even worked against him. Then his wife appealed to Surya Bhagavan, the witness of karma: 'Prabhu! My husband gave to ten and took from none. What test is this for us? Why this poverty? What is our fault, Swami?' Then her own antaratma instructed her: 'Amma, do not grieve. Troubles do not last forever. Keep the apada-leni adivarapu vratam and see. You will surely lack nothing.' She told her husband, and he told her to keep it and had the materials made ready. She kept the vratam twelve Sundays without a break. (A line the katha keeps: the sandalwood tree that takes the axe's blows gives its fragrance to that very axe.)",
        deva: "",
        tel: "ఒక ధనిక బ్రాహ్మణుడు స్వపర భేదము లేకుండా అందరిని ఆదుకొనేవాడు; మితిమీరిన దానములు చేసేవాడు; 'లేదు' అన్నదే ఆయన నోట లేదు. కాలము గడువగా అతడు పేదవాడయ్యెను; సంపదలు హరించిపోయినవి. సాయము అందినవారే ముఖము చాటేసిరి; కీడు తలపెట్టిరి కూడ. అంత ఆయన భార్య కర్మసాక్షియగు సూర్యభగవానుని — 'ప్రభూ! నా భర్త పదిమందికి పెట్టాడే గాని ఎవరివద్ద ఏమీ తీసుకోలేదే. అటువంటి మాకు ఏమిటీ పరీక్ష? ఎందుకీ దరిద్రము? మా లోపమేమిటి స్వామీ?' అని శోకించసాగినది. అంత ఆమె అంతరాత్మ — 'అమ్మా! విచారించకు. కష్టాలు కలకాలము ఉండవు. ఆపదలేని ఆదివారపు వ్రతము నోచి చూడు. తప్పక నీకు ఏ లోటూ ఉండదు' అని ప్రబోధించినట్లయినది. ఆమె భర్తకు చెప్పగా అతడు వ్రతమాచరించమని, కావలసిన పదార్థములు సిద్ధము చేయించెను. ఆమె క్రమము తప్పకుండా పన్నెండు ఆదివారములు వ్రతము జరిపినది. (కథలో ఒక మాట: గొడ్డలి దెబ్బలు తినే గంధపు చెట్టు తన సువాసనను ఆ గొడ్డలికే పంచుతుంది.)"
      },
    udyapana: {
        roman: "On the thirteenth Sunday, twenty-six muttaiduvas are given pasupu, kumkuma, ravikela guddalu, dakshina and tambulam; vayanam to one of them; and all are fed according to means.",
        deva: "",
        tel: "పదమూడవ ఆదివారమున ఇరవై ఆరుగురు ముత్తయిదువులకు పసుపు, కుంకుమ, రవికెల గుడ్డలు, దక్షిణ, తాంబూలములు ఇచ్చి, ఒక ముత్తయిదువునకు వాయనమిచ్చి, ఉన్నంతలో అందరికి భోజనము పెట్టవలెను."
      },
    vayanam: {
        roman: "Chakkera pongali; pasupu, kumkuma, ravikela gudda, dakshina, tambulam.",
        deva: "",
        tel: "చక్కెర పొంగలి; పసుపు, కుంకుమ, రవికెల గుడ్డ, దక్షిణ, తాంబూలము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "taragani-adivaramula-nomu",
    deity: "surya",
    name: {
        roman: "Taragani Adivaramula Nomu",
        deva: "",
        tel: "తరగని ఆదివారముల నోము"
      },
    when: {
        roman: "Every Sunday, for one full year.",
        deva: "",
        tel: "వరుసగా ఒక సంవత్సరము, ప్రతి ఆదివారము."
      },
    forwhat: {
        roman: "That children live; sirisampadalu.",
        deva: "",
        tel: "సంతానము నిలుచుట; సిరిసంపదలు."
      },
    how: {
        roman: "On the Sunday she does not cut vegetables herself, does not tell anyone else to cut them, and does not eat anything made from cut vegetables. Alternative food — fruit, milk, curd, pulihora — may be made ready the day before. A lamp is lit, naivedyam offered, and the katha read.",
        deva: "",
        tel: "ఆదివారము నాడు కూరగాయలు స్వయముగా తరగరాదు; ఇతరులను తరగమని చెప్పరాదు; తరిగిన కూరలతో చేసిన పదార్థములను తినరాదు. ముందురోజే పండ్లు, పాలు, పెరుగు, పులిహోర వంటి ప్రత్యామ్నాయ ఆహారము సిద్ధము చేసుకొనవచ్చును. దీపము వెలిగించి నైవేద్యము పెట్టి కథ చదువుకొనవలెను."
      },
    katha: {
        roman: "A king's daughter and a minister's daughter took up this nomu together. The minister's daughter kept the restriction through the whole year without fail — not cutting herself, not telling others to cut, not eating what had been cut — and at the end gave vayanam to a muttaiduva with thirteen coconuts, thirteen coins, a saree and a ravike. Wealth and children flourished in her house. The king's daughter, paying the restriction no mind, ate cut vegetables and transgressed; the children born to her kept dying. Seeing the minister's daughter's good fortune she grew envious and tried to harm her children, but by Parvati Devi's grace they came to no harm. At last, going grieving into the forest, she met Parvati Devi in the form of an old muttaiduva, who told her the transgression itself was the cause of her troubles and instructed her to keep the nomu again with bhakti. When she completed it properly, children and wealth came to her.",
        deva: "",
        tel: "ఒక రాజకుమార్తెయు మంత్రి కుమార్తెయు కలిసి ఈ నోము పట్టిరి. మంత్రి కుమార్తె ఏడాది పొడుగునా నియమము తప్పకుండా — తాను తరగక, ఇతరులను తరగమనక, తరిగినది తినక — భక్తిశ్రద్ధలతో ఆచరించి, చివరకు పదమూడు కొబ్బరికాయలు, పదమూడు నాణేలు, చీర, రవికెతో ముత్తయిదువుకు వాయనమిచ్చెను. ఆమె ఇంట సిరిసంపదలు, సంతానము వృద్ధి చెందినవి. రాజకుమార్తె మాత్రము నియమమును లెక్కచేయక తరిగిన కూరలు తిని ఉల్లంఘించెను; ఆమెకు పుట్టిన పిల్లలు మరణించుచుండిరి. మంత్రి కుమార్తె సౌభాగ్యమును చూచి అసూయపడి ఆమె పిల్లలకు హాని చేయ ప్రయత్నించెను గాని, పార్వతీదేవి అనుగ్రహమున వారు క్షేమముగా ఉండిరి. చివరకు దుఃఖముతో అడవికి వెళ్ళిన రాజకుమార్తెకు పార్వతీదేవి ముసలి ముత్తయిదువు రూపమున కనిపించి — ఉల్లంఘనమే కష్టములకు కారణమని చెప్పి, తిరిగి భక్తితో నోచుకొమ్మని ఉపదేశించెను. ఆమె సక్రమముగా పూర్తి చేయగా సంతానసౌఖ్యము, సిరిసంపదలు కలిగినవి."
      },
    udyapana: {
        roman: "Thirteen coconuts, thirteen coins (the older text says 'thirteen kanulu'), a saree, a ravike, pasupu, kumkuma and tambulam — given as vayanam to one muttaiduva.",
        deva: "",
        tel: "పదమూడు కొబ్బరికాయలు, పదమూడు నాణేలు (పాత గ్రంథమున 'పదమూడు కానులు'), చీర, రవికె, పసుపు, కుంకుమ, తాంబూలము — ఒక ముత్తయిదువుకు వాయనముగా ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Coconuts, coins, saree, ravike, pasupu, kumkuma, tambulam.",
        deva: "",
        tel: "కొబ్బరికాయలు, నాణేలు, చీర, రవికె, పసుపు, కుంకుమ, తాంబూలము."
      },
  },
  //
  {
    id: "purna-adivaramula-nomu",
    deity: "surya",
    name: {
        roman: "Purna Adivaramula Nomu",
        deva: "",
        tel: "పూర్ణాది వారముల నోము"
      },
    when: {
        roman: "Every Sunday, consecutively.",
        deva: "",
        tel: "వరుసగా ప్రతి ఆదివారము."
      },
    forwhat: {
        roman: "The lifting of kadupu-shokam; the wellbeing of children.",
        deva: "",
        tel: "కడుపుశోకము తొలగుట; సంతానసౌఖ్యము."
      },
    how: {
        roman: "One meal only on the Sunday. Puja is done, the katha read, and akshatalu placed on the head. When possible a muttaiduva is invited and honoured with pasupu, kumkuma and tambulam.",
        deva: "",
        tel: "ఆదివారము ఒంటిపూట భోజనము చేయవలెను. పూజ చేసి కథ చదివి అక్షతలు వేసుకొనవలెను. వీలైనప్పుడు ఒక ముత్తయిదువును పిలిచి పసుపు, కుంకుమ, తాంబూలముతో సత్కరించవలెను."
      },
    katha: {
        roman: "Five children born to a king's daughter died. Unable to bear that kadupu-shokam she went into the forest and prayed to Parvati and Parameshwara. They appeared and said: 'In a former birth you took up the purnadi adivaramula nomu and transgressed it; that is why this grief has come. Keep it again with bhakti, read the katha, and do the udyapana.' She completed it as they commanded, the grief lifted, and the wellbeing of children came to her.",
        deva: "",
        tel: "ఒక రాజకుమార్తెకు పుట్టిన అయిదుగురు పిల్లలు మరణించిరి. ఆ కడుపుశోకమును భరించలేక అడవికి వెళ్ళి పార్వతీపరమేశ్వరులను ప్రార్థించెను. వారు ప్రత్యక్షమై — 'నీవు పూర్వజన్మలో పూర్ణాది ఆదివారముల నోము పట్టి ఉల్లంఘించితివి; అందువలననే ఈ దుఃఖము కలిగినది. తిరిగి భక్తితో ఆచరించి, కథ చదివి, ఉద్యాపన చేసుకో' అని చెప్పిరి. ఆమె వారి ఆజ్ఞ ప్రకారము పూర్తి చేయగా కడుపుశోకము తొలగి సంతానసౌఖ్యము కలిగినది."
      },
    udyapana: {
        roman: "Purnam undrallu are made from five manikas of rice. A muttaiduva is given talantu snanam and fed. Purnalu, dakshina, tambulam and cloth are given as vayanam. ('Manika' is an older measure; the quantity may now be set to what the household can manage.)",
        deva: "",
        tel: "అయిదు మానికల బియ్యముతో పూర్ణము ఉండ్రాళ్ళు చేయవలెను. ఒక ముత్తయిదువుకు తలంటి నీళ్ళు పోసి భోజనము పెట్టవలెను. పూర్ణాలు, దక్షిణ, తాంబూలము, వస్త్రము వాయనముగా ఇవ్వవలెను. ('మానిక' పాత కొలత గనుక ఇప్పుడు కుటుంబశక్తికి తగిన పరిమాణములో చేయవచ్చును.)"
      },
    vayanam: {
        roman: "Purnalu, dakshina, tambulam, cloth.",
        deva: "",
        tel: "పూర్ణాలు, దక్షిణ, తాంబూలము, వస్త్రము."
      },
  },
  //
  {
    id: "bala-adivaramula-nomu",
    deity: "surya",
    name: {
        roman: "Bala Adivaramula Nomu",
        deva: "",
        tel: "బాలాది వారముల నోము"
      },
    when: {
        roman: "The number of weeks is not stated clearly in the older text.",
        deva: "",
        tel: "వారముల సంఖ్య పాత గ్రంథమున స్పష్టముగా లేదు."
      },
    forwhat: {
        roman: "Expiation of the fault of having taken others' things in childhood; the averting of widowhood.",
        deva: "",
        tel: "బాల్యమున ఇతరుల వస్తువులు తీసుకొనిన దోషమునకు పరిహారము; వైధవ్య నివారణ."
      },
    how: {
        roman: "A snana-sankalpam is made with Ganga water or clean water. A muttaiduva is worshipped as Gauri Devi herself, and pasupu and kumkuma received from her hand as prasadam. Paramannam is made and she is fed, and given a saree, ravike, pasupu, kumkuma, tambulam and dakshina. The sankalpam taken is to live honestly, without coveting what belongs to others.",
        deva: "",
        tel: "గంగాజలముతో గాని శుద్ధజలముతో గాని స్నానసంకల్పము చేయవలెను. ఒక ముత్తయిదువును గౌరీదేవిగా భావించి పూజించి, ఆమె చేతినుండి పసుపు కుంకుమను ప్రసాదముగా స్వీకరించవలెను. పరమాన్నము చేసి భోజనము పెట్టి, చీర, రవికె, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ ఇవ్వవలెను. ఇతరుల వస్తువులను ఆశింపక నిజాయితీగా జీవించెదనని సంకల్పించవలెను."
      },
    katha: {
        roman: "A brahmana had one son and one small daughter. Both his daughter-in-law and his daughter would put rice each day into the bag of the yayavaram brahmana who came to the house. He would bless the daughter-in-law, 'sowbhagyavati bhava'; but the daughter he would bless only, 'gangasnana phalasiddhirastu'. Asked why, he said widowhood would come to that girl while she was still young. As the remedy he directed that after her marriage, if her husband died, she should be taken for a Ganga bath; that on the way, if a muttaiduva had lost her pasupu and kumkuma, the girl should honestly return them; and that she should accept the pasupu and kumkuma that muttaiduva then gave, worship her and feed her. It was done so, and by that muttaiduva's blessing her husband lived again. The inner sense is that honesty, dana and the worship of a muttaiduva are the expiation for having taken others' pasupu-kumkuma and such things in childhood.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు ఒక కుమారుడు, ఒక చిన్న కుమార్తె ఉండిరి. కోడలును, కుమార్తెను ఇరువురును ప్రతిదినము ఇంటికి వచ్చు యాయవారపు బ్రాహ్మణునికి బియ్యము వేయుచుండిరి. ఆయన కోడలిని 'సౌభాగ్యవతీ భవ' అని దీవించువాడు; కుమార్తెను మాత్రము 'గంగాస్నాన ఫలసిద్ధిరస్తు' అని దీవించువాడు. కారణమడుగగా — ఆ బాలికకు చిన్నవయసులోనే వైధవ్యము కలుగునని చెప్పెను. పరిహారముగా — వివాహమైన తరువాత భర్త మరణించినచో ఆమెను గంగాస్నానమునకు తీసుకువెళ్ళవలెననియు, దారిలో ఒక ముత్తయిదువు పోగొట్టుకొనిన పసుపు కుంకుమను ఆ బాలిక నిజాయితీగా తిరిగి ఇవ్వవలెననియు, ఆ ముత్తయిదువు ప్రసాదించిన పసుపు కుంకుమను స్వీకరించి ఆమెను పూజించి భోజనము పెట్టవలెననియు సూచించెను. అట్లే చేయగా ఆ ముత్తయిదువు ఆశీర్వాదముతో ఆమె భర్త తిరిగి జీవించెనని కథ చెప్పును. బాల్యమున ఇతరుల పసుపు కుంకుమ వంటివి తీసుకొనిన దోషమునకు నిజాయితీ, దానము, ముత్తయిదువు పూజ పరిహారమని ఇందలి అంతరార్థము."
      },
    udyapana: {
        roman: "For this nomu the guidance of elders who know the family's own practice is needed.",
        deva: "",
        tel: "ఈ నోమునకు కుటుంబ సంప్రదాయము తెలిసిన పెద్దల మార్గదర్శనము అవసరము."
      },
    vayanam: {
        roman: "Saree, ravike, pasupu, kumkuma, tambulam, dakshina.",
        deva: "",
        tel: "చీర, రవికె, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "trinadha-adivarapu-nomu",
    deity: "devi",
    name: {
        roman: "Trinadha Adivarapu Nomu",
        deva: "",
        tel: "త్రినాధ ఆదివారపు నోము"
      },
    when: {
        roman: "Sunday evening; five or seven melas according to the sankalpam taken.",
        deva: "",
        tel: "ఆదివారము సాయంత్రము; సంకల్పమును బట్టి అయిదు లేక ఏడు మేళాలు."
      },
    forwhat: {
        roman: "The recovery of what is lost; sirisampadalu; the discharging of a vow made.",
        deva: "",
        tel: "పోయినది తిరిగి దొరకుట; సిరిసంపదలు; మొక్కు తీర్చుకొనుట."
      },
    how: {
        roman: "A peetham is set in the northeast with a picture of the Trimurti. Three kalashams or three small vessels are arranged. Ganapati is worshipped first, then Brahma, Vishnu and Maheshwara, and three lamps are lit. Flowers, fruit, coconuts and satvik naivedyam are offered, the katha read and harati given. Where the family's practice includes a toram, it is made of nine threads with nine knots in pasupu.",
        deva: "",
        tel: "ఈశాన్య దిశలో పీట పెట్టి త్రిమూర్తుల చిత్రము ఉంచవలెను. మూడు కలశములు లేక మూడు చిన్న పాత్రలు ఏర్పాటు చేయవలెను. ముందుగా గణపతిని, తరువాత బ్రహ్మ విష్ణు మహేశ్వరులను పూజించి మూడు దీపములు వెలిగించవలెను. పూలు, పండ్లు, కొబ్బరికాయలు, సాత్విక నైవేద్యము సమర్పించి, కథ చదివి హారతి ఇవ్వవలెను. తోరము కట్టుకొను కుటుంబాచారము ఉన్నచో తొమ్మిది పోగులు, తొమ్మిది ముడులతో పసుపు తోరము సిద్ధము చేయవలెను."
      },
    katha: {
        roman: "In Sripuram a very poor brahmana supported his family by bhiksha. The one cow he had went missing. Searching for it he rested under a banyan, and there Brahma, Vishnu and Maheshwara gave darshanam as the Trinathas. Learning his grief, they told him no display was needed — he should hold the Trinatha mela with whatever small materials he could manage. He lit three lamps with bhakti and worshipped the Trimurti. Afterwards the cow and calf were found, and wealth came to the house; and he made the puja known to others. Later a king forbade this puja, and his son's life came into danger; the moment the king recognised his fault and resolved to hold seven melas, the son rose in health. So too a merchant who forgot the vow he had made suffered loss, and regained his wealth on worshipping the Trinathas again. The chief teaching of the katha is that a puja one has vowed must not be forgotten.",
        deva: "",
        tel: "శ్రీపురమున ఒక నిరుపేద బ్రాహ్మణుడు భిక్షతో కుటుంబమును పోషించుచుండెను. అతనికున్న ఒక్క ఆవు కూడా కనబడకుండా పోయెను. దానిని వెదకుచు వెళ్ళి ఒక మర్రిచెట్టు క్రింద విశ్రాంతి తీసుకొనగా, ఆ చెట్టు వద్ద బ్రహ్మ విష్ణు మహేశ్వరులు త్రినాథులుగా దర్శనమిచ్చిరి. అతని దుఃఖము తెలిసికొని — ఆడంబరములు అవసరము లేదనియు, తనకు సాధ్యమైన కొద్దిపాటి ద్రవ్యములతోనే త్రినాథుల మేళా చేయుమనియు చెప్పిరి. అతడు భక్తితో మూడు దీపములు వెలిగించి త్రిమూర్తులను పూజించెను. తరువాత ఆవు, దూడ తిరిగి దొరికినవి; ఇంట సిరిసంపదలు కలిగినవి; అతడు ఆ పూజను ప్రజలకు తెలియజేసెను. తరువాత ఒక రాజు ఈ పూజను నిషేధించగా అతని కుమారునికి ప్రాణాపాయము కలిగెను; రాజు తన తప్పు తెలిసికొని ఏడు మేళాలు చేసెదనని సంకల్పించగానే కుమారుడు క్షేమముగా లేచెను. అట్లే ఒక వ్యాపారి మొక్కును మరచి నష్టపోయి, తిరిగి త్రినాథులను పూజించి తన సంపదను పొందెను. మొక్కుకొనిన పూజను మరచిపోరాదనుటయే ఈ కథలోని ప్రధాన సందేశము."
      },
    udyapana: {
        roman: "Five or seven Sunday melas are held according to the sankalpam.",
        deva: "",
        tel: "సంకల్పమును బట్టి అయిదు లేక ఏడు ఆదివారములు మేళాలు నిర్వహింతురు."
      },
    vayanam: {
        roman: "Flowers, fruit, coconuts, satvik naivedyam.",
        deva: "",
        tel: "పూలు, పండ్లు, కొబ్బరికాయలు, సాత్విక నైవేద్యము."
      },
  },
  //
  {
    id: "shivadevuni-somavarapu-nomu",
    deity: "shiva",
    name: {
        roman: "Shivadevuni Somavarapu Nomu",
        deva: "",
        tel: "శివదేవుని సోమవారపు నోము"
      },
    when: {
        roman: "Every Monday; the traditional text says it is to be kept for twenty-one years.",
        deva: "",
        tel: "ప్రతి సోమవారము; సంప్రదాయ గ్రంథమున ఇరవై ఒక్క సంవత్సరములు చేయవలెనని ఉన్నది."
      },
    forwhat: {
        roman: "Children; the life of a son.",
        deva: "",
        tel: "సంతానము; కుమారుని ఆయుష్షు."
      },
    how: {
        roman: "Each Monday, shivabhishekam and bilvarchana. 'Om Namah Shivaya' is japped. One meal only, or upavasa according to the family's practice. The katha is read and akshatalu placed. Changing the toram every twenty-one weeks is called the laghu udyapana. Since the number of knots in the toram is a matter of particular family rule, the elders are to be asked and followed.",
        deva: "",
        tel: "ప్రతి సోమవారము శివాభిషేకము, బిల్వార్చన చేయవలెను. 'ఓం నమః శివాయ' జపించవలెను. ఒంటిపూట భోజనము లేక కుటుంబాచారము ప్రకారము ఉపవాసము చేయవలెను. కథ చదివి అక్షతలు వేసుకొనవలెను. ప్రతి ఇరవై ఒక్క వారములకు తోరము మార్చుటను లఘు ఉద్యాపన అందురు. తోరములోని ముడుల విషయమున కుటుంబ నియమము ప్రత్యేకముగా ఉన్నందున పెద్దలను అడిగి పాటించవలెను."
      },
    katha: {
        roman: "A householder kept the Monday nomu for children. Shiva appeared and told her that her jataka held no yoga for children; yet, pleased with her prayer, he granted her a son who would have only sixteen years of life. On the day the son completed his sixteenth year she began the maha udyapana. Though word came that his condition was grave, she completed the puja in faith in Shiva. Shiva appeared, gave her akshatalu and told her to sprinkle them on her son. By the time she reached home she learned the son had died; and the moment she sprinkled the akshatalu Shiva had given, he lived again.",
        deva: "",
        tel: "ఒక ఇల్లాలు సంతానము కొఱకు సోమవారపు నోము ఆచరించెను. శివుడు ప్రత్యక్షమై — ఆమె జాతకమున సంతానయోగము లేదని చెప్పెను; అయినను ఆమె ప్రార్థనకు మెచ్చి పదహారేండ్ల ఆయుష్షు మాత్రమే కలిగిన కుమారుని ప్రసాదించెను. కుమారునికి పదహారవ సంవత్సరము నిండిన దినమున ఆమె మహా ఉద్యాపన ప్రారంభించెను. కుమారుని పరిస్థితి విషమముగా ఉన్నదని వార్తలు వచ్చినను, శివునిపై విశ్వాసముతో పూజను పూర్తి చేసెను. శివుడు ప్రత్యక్షమై అక్షతలిచ్చి కుమారునిపై చల్లుమనెను. ఆమె ఇంటికి వచ్చుసరికి కుమారుడు మరణించెనని తెలిసెను; శివుడిచ్చిన అక్షతలను అతనిపై చల్లగానే అతడు తిరిగి జీవించెనని కథ చెప్పును."
      },
    udyapana: {
        roman: "Maha udyapana — abhishekam to Shiva with twenty-one dravyas; a lamp of twenty-one wicks; a meal for twenty-one brahmanas, or for as many as can be managed; the dana of cloth, tambulam and dakshina. Any question about the duration of the sankalpam is to be settled with a purohita.",
        deva: "",
        tel: "మహా ఉద్యాపన — శివునికి ఇరవై ఒక్క ద్రవ్యములతో అభిషేకము; ఇరవై ఒక్క వత్తులతో దీపము; ఇరవై ఒక్క మంది బ్రాహ్మణులకు లేక శక్తిమేరకు భక్తులకు భోజనము; వస్త్ర, తాంబూల, దక్షిణ దానము. సంకల్ప కాలమును గురించిన సంశయములు పురోహితునితో నిర్ణయించుకొనవలెను."
      },
    vayanam: {
        roman: "Cloth, tambulam, dakshina.",
        deva: "",
        tel: "వస్త్రము, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "chaddikuti-mangalavarapu-nomu",
    deity: "devi",
    name: {
        roman: "Chaddikuti Mangalavarapu Nomu",
        deva: "",
        tel: "చద్దికూటి మంగళవారపు నోము"
      },
    when: {
        roman: "Every Tuesday, for one year.",
        deva: "",
        tel: "ప్రతి మంగళవారము, ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The undoing of poverty; sirisampadalu.",
        deva: "",
        tel: "దారిద్ర్య నివారణ; సిరిసంపదలు."
      },
    how: {
        roman: "On Monday evening rice, pappu, kura and charu are cooked and covered. On Tuesday morning, after bathing, puja and the reading of the katha, akshatalu are placed; that chaddikuti meal is first given to a muttaiduva and only then eaten by herself.",
        deva: "",
        tel: "సోమవారము సాయంత్రము అన్నము, పప్పు, కూర, చారు వండి మూత పెట్టవలెను. మంగళవారము ఉదయము స్నానము చేసి పూజ, కథాపఠనము చేసి అక్షతలు వేసుకొని, ఆ చద్దికూటి భోజనమును ముందుగా ఒక ముత్తయిదువుకు పెట్టి, తరువాత తాను తినవలెను."
      },
    katha: {
        roman: "A king's daughter and a brahmana's daughter took up this nomu. Each Monday evening the brahmana's daughter cooked kura, pappu, charu and rice and covered them; on Tuesday morning, after bathing, she read the katha, placed akshatalu, gave that chaddikuti meal to a muttaiduva and only then ate herself. When the year was complete she did the udyapana with thirteen muttaiduvas, and wealth came to her. The king's daughter, not keeping it properly, transgressed, and poverty came. Suffering in the forest, she met Parvati and Parameshwara, who told her the cause. She went home, kept it properly through a year, did the udyapana, and the affliction of poverty was lifted.",
        deva: "",
        tel: "ఒక రాజకుమార్తెయు, బ్రాహ్మణ కుమార్తెయు ఈ నోము పట్టిరి. బ్రాహ్మణ కుమార్తె ప్రతి సోమవారము సాయంత్రము కూర, పప్పు, చారు, అన్నము వండి మూత పెట్టెడిది; మంగళవారము ఉదయము స్నానము చేసి కథ చదివి, అక్షతలు వేసుకొని, ఆ చద్దికూటి భోజనమును ఒక ముత్తయిదువుకు పెట్టి తరువాత తాను తినెడిది. ఏడాది పూర్తియైన తరువాత పదముగ్గురు ముత్తయిదువులతో ఉద్యాపన చేసెను; ఆమెకు సిరిసంపదలు కలిగినవి. రాజకుమార్తె మాత్రము సరిగా పాటించక ఉల్లంఘించుటచే దరిద్రము వచ్చెను. అడవిలో బాధపడుచున్న ఆమెకు పార్వతీపరమేశ్వరులు కనిపించి కారణమును చెప్పిరి. ఆమె ఇంటికి వెళ్ళి ఏడాది పొడుగునా సక్రమముగా ఆచరించి ఉద్యాపన చేయగా దరిద్రబాధ తొలగినది."
      },
    udyapana: {
        roman: "Thirteen muttaiduvas; a ravike gudda for each; thirteen coins or dakshina according to means; pasupu, kumkuma and tambulam; the chaddikuti meal as vayanam in thirteen small vessels; and a meal served if possible.",
        deva: "",
        tel: "పదముగ్గురు ముత్తయిదువులు; ఒక్కొక్కరికి రవికె గుడ్డ; పదమూడు నాణేలు లేక శక్తిమేర దక్షిణ; పసుపు, కుంకుమ, తాంబూలము; పదమూడు చిన్న పాత్రలలో చద్దికూటి భోజనము వాయనము; వీలైనచో భోజనము పెట్టవలెను."
      },
    vayanam: {
        roman: "The chaddikuti meal, ravike gudda, coins, pasupu, kumkuma, tambulam.",
        deva: "",
        tel: "చద్దికూటి భోజనము, రవికె గుడ్డ, నాణేలు, పసుపు, కుంకుమ, తాంబూలము."
      },
  },
  //
  {
    id: "amavasya-somavarapu-nomu",
    deity: "shiva",
    name: {
        roman: "Amavasya Somavarapu Nomu",
        deva: "",
        tel: "అమావాస్య సోమవారపు నోము"
      },
    when: {
        roman: "On a day when amavasya falls on a Monday. The older text says one hundred and eight such Monday-amavasyas are to be kept — a long sankalpam running to many years.",
        deva: "",
        tel: "సోమవారము నాడు అమావాస్య వచ్చిన దినమున. పాత గ్రంథమున నూట ఎనిమిది అమావాస్య సోమవారములు ఆచరించవలెనని ఉన్నది — ఇది అనేక సంవత్సరములు పట్టు దీర్ఘ సంకల్పము."
      },
    forwhat: {
        roman: "The averting of widowhood; the protection of children.",
        deva: "",
        tel: "వైధవ్య నివారణ; సంతాన రక్షణ."
      },
    how: {
        roman: "After the morning bath, Shiva-Parvati and Lakshmi-Narayana are worshipped. Pasupu and kumkuma are applied to the ashvattha tree, a lamp lit, water offered, and one hundred and eight pradakshinas made. A flower, fruit, grain or small stone may be set aside at each round to keep count. The verse is recited: at the root Brahma's form, at the middle Vishnu's, at the crown Shiva's — namaskaram to the king of trees. The katha is read, fruit and milk offered, and annadanam done according to means.",
        deva: "",
        tel: "ఉదయము స్నానము చేసి శివపార్వతులను, లక్ష్మీనారాయణులను పూజించవలెను. రావిచెట్టునకు పసుపు కుంకుమ పెట్టి, దీపము వెలిగించి, నీరు సమర్పించి, నూట ఎనిమిది ప్రదక్షిణలు చేయవలెను. ప్రతి ప్రదక్షిణకు ఒక పువ్వు, పండు, ధాన్యగింజ లేక చిన్న రాయి పక్కన పెట్టి లెక్కించవచ్చును. 'మూలతో బ్రహ్మరూపాయ మధ్యతో విష్ణురూపిణే । అగ్రతః శివరూపాయ వృక్షరాజాయ తే నమః ॥' అని చదువవలెను. కథ చదివి పండ్లు, పాలు నైవేద్యము సమర్పించి, శక్తిమేరకు అన్నదానము చేయవలెను."
      },
    katha: {
        roman: "A brahmana had seven sons and one daughter. The yayavaram brahmana who came to the house would bless the daughters-in-law, 'sowbhagyavati bhava', but the daughter only, 'gangasnana phalasiddhirastu'. Asked why, he said that widowhood would come to the girl at the saptapadi itself during her wedding, and that the remedy for that fault lay with a great pativrata, Chakali Poli. The youngest son took his sister across seven seas to Chakali Poli. Pleased with their service, Poli came to the girl's wedding. When the bridegroom died at the saptapadi, Poli poured out the fruit of her own amavasya-Monday vratam and restored him to life. Because she had given away that fruit, the seven sons in Poli's own house died. On the return journey a Somavati amavasya fell, and she made one hundred and eight pradakshinas of the ashvattha tree; by that fruit her seven sons lived again.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు ఏడుగురు కొడుకులు, ఒక కుమార్తె ఉండిరి. ఇంటికి వచ్చు యాయవారపు బ్రాహ్మణుడు కోడళ్ళను 'సౌభాగ్యవతీ భవ' అనియు, కుమార్తెను మాత్రము 'గంగాస్నాన ఫలసిద్ధిరస్తు' అనియు దీవించువాడు. కారణమడుగగా — ఆ అమ్మాయికి వివాహ సమయమున సప్తపది వద్దనే వైధవ్యము కలుగుననియు, ఆ దోషమునకు పరిహారము చాకలి పోలి అను మహాపతివ్రత వద్ద ఉన్నదనియు తెలిపెను. చిన్న కుమారుడు తన చెల్లెలిని ఏడు సముద్రములు దాటించి చాకలి పోలి వద్దకు తీసుకువెళ్ళెను. పోలి వారి సేవకు మెచ్చి అమ్మాయి వివాహమునకు వచ్చెను. సప్తపది సమయమున వరుడు మరణించగా, పోలి తన అమావాస్య సోమవారపు వ్రతఫలమును ధారపోసి అతనిని బ్రతికించెను. తన వ్రతఫలమును ఇచ్చిన కారణమున పోలి ఇంటిలోని ఏడుగురు కుమారులు మరణించిరి. తిరుగు ప్రయాణమున సోమవతి అమావాస్య రాగా ఆమె అశ్వత్థవృక్షమునకు నూట ఎనిమిది ప్రదక్షిణలు చేసెను; దాని ఫలముతో ఆమె ఏడుగురు కుమారులు తిరిగి జీవించిరని కథ చెప్పును."
      },
    udyapana: {
        roman: "The traditional text prescribes one hundred and eight kalashams, a mandapam, an image of Lakshmi-Narayana, the worship of the ashta-dikpalakas, and danas — a large undertaking to be done with a purohita. At household scale, kalasha puja, annadanam and vastradanam may be done according to means.",
        deva: "",
        tel: "సంప్రదాయ గ్రంథమున నూట ఎనిమిది కలశములు, మండపము, లక్ష్మీనారాయణ ప్రతిమ, అష్టదిక్పాలక పూజ, దానములు చెప్పబడినవి — ఇది పురోహితునితో చేయవలసిన పెద్ద కార్యక్రమము. గృహస్థాయిలో శక్తిమేరకు కలశపూజ, అన్నదానము, వస్త్రదానము చేయవచ్చును."
      },
    vayanam: {
        roman: "Annadanam, vastradanam.",
        deva: "",
        tel: "అన్నదానము, వస్త్రదానము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "sampada-shukravarapu-nomu",
    deity: "devi",
    name: {
        roman: "Sampada Shukravarapu Nomu",
        deva: "",
        tel: "సంపద శుక్రవారపు నోము"
      },
    when: {
        roman: "Every Friday, for three years.",
        deva: "",
        tel: "ప్రతి శుక్రవారము — మూడు సంవత్సరములు."
      },
    forwhat: {
        roman: "Sirisampadalu; relief from want.",
        deva: "",
        tel: "సిరిసంపదలు; దారిద్ర్య నివారణ."
      },
    how: {
        roman: "Lakshmi is worshipped each Friday. One meal only. Sleeping on the floor.",
        deva: "",
        tel: "ప్రతి శుక్రవారము లక్ష్మిని పూజించవలెను. ఒక్కపూట భోజనము. నేలపై పరుండవలెను."
      },
    katha: {
        roman: "In the kingdom of Kamboja a brahmana named Shivasharma married his seven sons, divided his property equally among them, and died. The sons separated; some fell away, some abandoned achara; all came to poverty. One day Lakshmi, walking the earth, went to their houses in turn. The eldest daughter-in-law sat with her hair loose and the morning work undone; the second served cold rice to the children on unmade bedding; the third sat patching old cloth; the fourth was at play; the fifth was quarrelling with the neighbours. At last she came to the seventh house — Vijaya Kalyani Radhika. She had risen before dawn, cleaned the house, laid the rangavallulu, bathed, put on the kumkuma bottu, and was at Gauri puja. Lakshmi, pleased, asked whether she might stay the night, being on tirtha yatra. The girl said: 'Amma, my husband has gone for yayavaram. What he brings I shall cook and serve. What I do not have I cannot set before you. What I do have I shall not hide.' Lakshmi was filled with gladness, gave her pavitrakshatalu, and told her to place them on her head and go about her work. That day the husband brought home, unexpectedly, a great many things. She cooked, made the nivedana, and served; the three ate together. By morning the whole house was full of wealth.",
        deva: "",
        tel: "కాంభోజ రాజ్యమున శివశర్మ అను బ్రాహ్మణుడు ఏడుగురు కుమారులకు వివాహములు చేసి, ఆస్తిని సమముగా పంచి మరణించెను. కుమారులు విడిపోయిరి; కొందరు భ్రష్టులైరి, కొందరు ఆచారహీనులైరి; అందరును దరిద్రము అనుభవించసాగిరి. ఒకనాడు శ్రీలక్ష్మి భూలోక సంచారము చేయుచు ఆ కుమారుల ఇండ్లకు వరుసగా వెళ్ళెను. పెద్దకోడలు పాచిపని చేయక జుట్టు విరబోసుకొని కూర్చున్నది; రెండవ కోడలు పరుపు తీయక పిల్లలకు చద్దియన్నము పెట్టుచున్నది; మూడవ కోడలు పాతగుడ్డలు కుట్టుచున్నది; నాల్గవ కోడలు ఆటలాడుచున్నది; అయిదవ కోడలు ఇరుగుపొరుగుతో గొడవలు పెట్టుకొనుచున్నది. చివరకు ఏడవ కోడలు — విజయ కళ్యాణీ రాధిక — ఇంటికి వెళ్ళెను. ఆమె తెల్లవారుజామున లేచి ఇల్లు శుభ్రము చేసి, రంగవల్లులు తీర్చి, స్నానము చేసి, కుంకుమ బొట్టు పెట్టుకొని గౌరీపూజ చేయుచున్నది. లక్ష్మి ముచ్చటపడి 'తీర్థయాత్రలు చేయుచున్నాను, మీ ఇంట ఉండవచ్చునా?' అని అడిగెను. ఆ చిన్నది — 'తల్లీ, నా భర్త యాయవారమునకు వెళ్ళినాడు. తెచ్చినది వండి వడ్డిస్తాను. లేనిది పెట్టలేను. ఉన్నది దాచుకోను' అనెను. లక్ష్మి పరమానంద భరితురాలై పవిత్రాక్షతలిచ్చి, వాటిని తలపై వేసుకొని పనులు చేసుకొమ్మనెను. ఆనాడు భర్త ఊహించని విధముగా ఎన్నో పదార్థములు తెచ్చెను. ఆమె వండి నివేదన చేసి వడ్డించెను; ముగ్గురును కలిసి భోజనము చేసిరి. తెల్లవారగా చూచునప్పటికి ఇల్లంతయు సిరిసంపదలు, ధనరాశులు."
      },
    udyapana: {
        roman: "Five muttaiduvas are adorned with pasupu and kumkuma and given tambulam. So for three years. Then five perantalu are invited, given talantu, bottu and katuka, saree and ravikela gudda, dakshina and tambulam, and fed — honoured as forms of Mahalakshmi.",
        deva: "",
        tel: "అయిదుగురు ముత్తయిదువులకు పసుపు కుంకుమలతో అలంకారము చేసి తాంబూలమివ్వవలెను. అట్లు మూడు సంవత్సరములు. అనంతరము అయిదుగురు పేరంటాళ్ళను పిలిచి తలంటి, బొట్టుపెట్టి, కాటుక దిద్ది, చీర, రవికెల గుడ్డ, దక్షిణ తాంబూలము ఇచ్చి భోజనము పెట్టి మహాలక్ష్మీ రూపిణులుగా ఆరాధించవలెను."
      },
    vayanam: {
        roman: "Pasupu, kumkuma and tambulam to five muttaiduvas.",
        deva: "",
        tel: "పసుపు, కుంకుమ, తాంబూలము — అయిదుగురు ముత్తయిదువులకు."
      },
  },
  //
  {
    id: "mangala-gauri-vratam",
    deity: "devi",
    name: {
        roman: "Mangala Gauri Nomu",
        deva: "",
        tel: "శ్రీ మంగళగౌరీ నోము"
      },
    when: {
        roman: "Tuesdays of Shravana, five years from the first year of marriage. If the first year is disturbed, the second is let pass and the third is kept.",
        deva: "",
        tel: "శ్రావణ మాసములోని మంగళవారములు — పెళ్ళైన తొలి సంవత్సరము మొదలు అయిదేండ్లు. తొలి సంవత్సరము అవాంతరము కలిగినచో రెండవ ఏడాది పోనిచ్చి మూడవ సంవత్సరము జరుపుకొందురు."
      },
    forwhat: {
        roman: "To remain nitya sumangali; sakala sowbhagya siddhi.",
        deva: "",
        tel: "నిత్య సుమంగళిగా ఉండుట; సకల సౌభాగ్య సిద్ధి."
      },
    how: {
        roman: "The peetham is smeared with pasupu and marked with kumkuma; padmas are drawn, jyotis placed, the kalasam set, and puja done. Cow ghee is smeared on the ladle, the toram tied, the jyoti lit, and the katuka is prepared while the katha is read. Lamp cups are shaped from rice flour with cow-ghee wicks; once those lamps go out, only the muttaiduva who kept the vratam and her family may eat. The toram is five white threads smeared with pasupu, with five flowers and five knots. The number of muttaiduvas, jyotis and padmas is five in the first year, ten in the second, fifteen in the third, and so on. Night fasting is required, and brahmacharyam on the day before and the day of the vratam. In some regions no vegetable cut with a knife is eaten that day.",
        deva: "",
        tel: "పీటకు పసుపు రాసి కుంకుమ బొట్లు పెట్టి, పద్మాలు వేసి, జ్యోతులు పెట్టి, కలశము పెట్టి పూజ చేయవలెను. గరిటెకు ఆవునెయ్యి రాసి, తోరము కట్టి, జ్యోతి వెలిగించి కథ చదువుచు కాటుక తయారు చేయుదురు. వరిపిండితో దీపపు కుందులు చేసి ఆవునేతి వత్తులు వేసి జ్యోతులు వెలిగింతురు; ఆ దీపములు కొడిగట్టిన తరువాత వ్రతము ఆచరించిన ముత్తైదువ, ఆమె కుటుంబము మాత్రమే తినవలెను. తెల్లని దారము అయిదు పోగులు తీసుకొని పసుపు రాసి, అయిదు పూలతో అయిదు ముడులు వేసి తోరము తయారు చేయవలెను. ముత్తైదువుల సంఖ్య, జ్యోతుల సంఖ్య, పద్మముల సంఖ్య తొలి సంవత్సరము అయిదు, రెండవది పది, మూడవది పదిహేను — ఇట్లు పెరుగుచుండును. రాత్రి ఉపవాసము, ముందురోజు మరియు వ్రతము రోజు బ్రహ్మచర్యము తప్పనిసరి. ఆ రోజు కత్తిపీటతో తరిగిన కూర తినరు (కొన్ని ప్రాంతములలో)."
      },
    katha: {
        roman: "A brahmana couple long had no child. Doing tapas to Ishwara, he appeared and asked: 'Do you want a son who will not live long, or a daughter who will lose her husband?' They prayed for the son even if short-lived, and he granted it. As soon as the boy was born Yama's messengers came. The mother begged them to wait until the purudu was over; then until he could say amma and nanna; and so, showing one reason after another, kept putting them off. One day, while she was oiling his hair and weeping, the boy asked the cause and learned it. 'Amma, I am short-lived in any case. I wish to go to Kashi. If the messengers come, tell them to wait until I return' — and he set out, his parents sending his maternal uncle with him. On the way they camped in a flower garden. Just then the local king's daughter fell to quarrelling with her companions. The princess said: 'I am to be married tonight. My mother has kept the Shravana Mangalavaram nomu and will give me its vayanam. By the power of that vratam your curses will not touch me' — and threw the flowers in her hand to the ground, and they flew back and fixed themselves to the branches. Seeing it, the brahmana boy thought, 'If that girl were my wife it would be well.' That night word came that the bridegroom was ill and the wedding must be postponed; the king, unwilling to lose the muhurtam, persuaded the uncle and married his daughter to that very nephew. That night Mangala Gauri appeared to her in a dream: 'This very night your husband faces death by a snake. Trap that snake in the pot your mother gave you as vayanam and keep the lid firmly on.' She woke and saw a great snake hissing and crawling toward the bed. Unable to reach the pot on the attic shelf, she stood on the bridegroom's thigh, brought it down, trapped the snake, tied it shut with a ravikela gudda, put it back on the shelf and slept. Before dawn the uncle came and took the bridegroom on to Kashi. Some days later the original wedding party arrived, but the princess would not marry — 'He who tied the tali at the first muhurtam is my husband.' Asked for proof, she said her father should give annadanam for a year while she gave tambulam. A little before the year was out, the uncle and nephew returning from Kashi ate at that same satram and came for tambulam; she recognised him and cried out, 'This is my husband.' She put on his finger the ring she had kept from the wedding night, and it fitted. She brought down the pot in which the snake had been kept, and inside was a golden snake. The elders accepted it and the marriage was performed in due form. Sending her to her husband's house, her mother had her keep the Shravana Mangalavaram nomu and gave her the katuka kept in a bharini. The boy's parents, having wept themselves blind for their son, were there; the daughter-in-law applied that katuka to their eyes, their sight returned, and they looked on their son and his wife with joy.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ దంపతులకు చాలాకాలము సంతానము కలుగలేదు. ఈశ్వరుని గురించి తపస్సు చేయగా ఆయన ప్రత్యక్షమై — 'అల్పాయుష్కుడైన కొడుకు కావాలా? అయిదవతనము లేని కూతురు కావాలా?' అని అడిగెను. 'అల్పాయుష్కుడైనప్పటికీ కొడుకునే ఇమ్ము' అని ప్రార్థించిరి. 'తథాస్తు' అని వరమిచ్చెను. కుమారుడు జన్మించగానే యమభటులు వచ్చిరి. తల్లి — పురుడు తీరేదాక ఆగమని; పిమ్మట 'అమ్మా, నాన్నా' అని పిలిచేవరకు ఆగమని; ఇట్లు అనేక కారణములు చూపుచు వాయిదా వేయుచుండెను. ఒకనాడు తల్లి బిడ్డకు తలంటుచు దుఃఖించుచుండగా బిడ్డ కారణమడిగి తెలిసికొని — 'అమ్మా! ఎలాగూ అల్పాయుష్కుడనయ్యాను. కాశీ వెళ్ళి రావాలని ఉంది. యమదూతలు వస్తే నేను వచ్చేదాకా ఆగమను' అని బయలుదేరెను. తల్లిదండ్రులు మేనమామను తోడిచ్చి పంపిరి. మార్గమధ్యమున ఒక పూలతోటలో బస చేసిరి. అదే వేళకు ఆ ఊరి రాజు కూతురికి చెలులతో తగవు వచ్చెను. రాజకుమార్తె — 'నాకీ రాత్రి పెండ్లి కాబోతూ ఉంది. మా అమ్మ శ్రావణ మంగళవారము నోము నోచుకొని నాకు వాయనమిస్తుంది. ఆ వ్రత మహిమ వల్ల నీ శాపనార్థాలు ఫలించవు' అనుచు చేతిలోని పూలను నేలమీద పారబోయగా అవి తిరిగి చెట్ల కొమ్మలకు ఎగిరి అతుక్కొనిపోయినవి. అది చూచిన బ్రాహ్మణ బాలుడు 'ఆ పిల్ల తన భార్య అయితే బాగుండును' అనుకొనెను. ఆ రాత్రి పెండ్లికుమారునికి సుస్తీ అని వాయిదా కబురు రాగా, రాజు ముహూర్తము తప్పకూడదని మేనమామను ఒప్పించి ఆ మేనల్లునికే కుమార్తెనిచ్చి పెండ్లి చేసెను. ఆ రాత్రి కలలో మంగళగౌరి కనిపించి — 'ఈ రాత్రే నీ భర్తకు పాము గండము ఉంది. ఆ పామును నీ తల్లి వాయనమిచ్చిన కుండలోనికి పట్టి గట్టిగా మూత ఉంచు' అని ఆజ్ఞాపించెను. ఆమె లేచి చూచునప్పటికి పెద్ద పాము బుసలు కొట్టుచు మంచము వైపు పాకుచున్నది. అటకమీది కుండ అందకపోవుటచే వరుని తొడపై నిలిచి కుండను దింపి, పామును పట్టి, రవికెల గుడ్డతో వాసెన కట్టి, తిరిగి అటకపై భద్రపరిచి నిద్రపోయినది. తెల్లవారుజామున మేనమామ వచ్చి పెండ్లికుమారుని కాశీ తీసుకువెళ్ళిపోయెను. కొన్నాళ్ళకు అసలు పెళ్ళివారు రాగా రాకుమార్తె వివాహమునకు ఇష్టపడలేదు — 'మొదటి ముహూర్తమున తాళి గట్టినవాడే నా భర్త' అని ప్రకటించినది. నిదర్శనము చూపమనగా — తండ్రి ఒక సంవత్సరము అన్నదానము చేయవలెననియు, తాను తాంబూలదానము చేసెదననియు చెప్పినది. సంవత్సరము పూర్తియగుటకు కొన్నాళ్ళు ఉండగా కాశీ నుండి తిరిగి వచ్చుచున్న మేనమామా మేనల్లుళ్ళు అదే సత్రములో భోజనము చేసి తాంబూలము పరిగ్రహించుచుండగా ఆమె గుర్తుపట్టి 'ఇతడే నా పెనిమిటి' అని ఎలుగెత్తి పలికినది. పెళ్ళినాడు దాచిన ఉంగరమును అతని వేలికి తొడుగగా సరిపోయినది. పాము దాచిన కుండను తీసి చూపగా అందులో పాము బంగారు పామై కనిపించినది. పెద్దలు అంగీకరించి యథావిధిగా వివాహము చేసిరి. అత్తవారింటికి పంపునపుడు తల్లి ఆమె చేత శ్రావణ మంగళవారపు నోము నోయించి ఆ కాటుకను ఒక భరిణిలో భద్రపరిచి ఇచ్చినది. అక్కడి బ్రాహ్మణ దంపతులు బిడ్డ కొరకు కన్నీరు కార్చి కార్చి అంధులై ఉండిరి. కోడలు ఆ కాటుకను అత్తమామల కళ్ళకు పూయగా వారికి చూపు వచ్చి కొడుకును, కోడలిని చూచుకొని సంబరపడిరి."
      },
    udyapana: {
        roman: "The udyapana is done for a newly married bride: gunta pustelu, mettelu, nallapusalu and thirteen pairs of ariselu placed in a brass vessel and sealed, together with new clothes, given as vayanam after the nagavalli. The first year's vratam is begun in the presence of a purohita.",
        deva: "",
        tel: "ఉద్యాపన కొత్త పెళ్ళికూతురుకు చేయుదురు. గుంట పుస్తెలు, మెట్టెలు, నల్లపూసలు, పదమూడు జతల అరిసెలు ఇత్తడి గిన్నెలో పెట్టి మూత కట్టి, కొత్త బట్టలతో కలిపి, నాగవల్లి క్రతువు పూర్తి అయ్యాక వాయనముగా అందించవలెను. మొదటిసారి వ్రతమును పురోహితుని సమక్షమున ప్రారంభించవలెను."
      },
    vayanam: {
        roman: "The first vayanam is best given to the mother; if she cannot attend, to a muttaiduva. Naivedyam is chalimidi, pulagam, paramannam and shanagalu.",
        deva: "",
        tel: "తొలి వాయనము తల్లికి ఇచ్చుట శ్రేయస్కరము; ఆమె రాలేని పక్షమున ముత్తైదువుకు. నైవేద్యము — చలిమిడి, పులగము, పరమాన్నము, శనగలు."
      },
  },
  //
  {
    id: "varalakshmi-vratam",
    deity: "devi",
    name: {
        roman: "Varalakshmi Nomu",
        deva: "",
        tel: "శ్రీ వరలక్ష్మీ నోము"
      },
    when: {
        roman: "The Friday before Shravana Purnima.",
        deva: "",
        tel: "శ్రావణ శుద్ధ పౌర్ణమికి ముందు వచ్చే శుక్రవారము."
      },
    forwhat: {
        roman: "Sowbhagyam and the wellbeing of the household.",
        deva: "",
        tel: "సౌభాగ్యము; గృహ క్షేమము."
      },
    how: {
        roman: "The kalasam is established and adorned as Varalakshmi, and shodashopachara puja done. A nine-thread toram with nine knots is tied to the right wrist. The katha is heard and tambulam distributed.",
        deva: "",
        tel: "కలశము ప్రతిష్ఠించి వరలక్ష్మిగా అలంకరించి షోడశోపచార పూజ చేయవలెను. తొమ్మిది పోగుల తోరమునకు తొమ్మిది ముడులు వేసి కుడి చేతికి కట్టుకొనవలెను. కథ విని తాంబూలము పంచవలెను."
      },
    katha: {
        roman: "Charumati of Kundinapuram spoke gently and in measure, was not quarrelsome, and served her husband's parents. Varalakshmi favoured her, appeared in a dream, and asked her to keep the Varalakshmi vratam. She had not worshipped Varalakshmi till then; that the Amma favoured her was on account of her conduct alone. The katha teaches that the vratam follows good conduct rather than standing in its place.",
        deva: "",
        tel: "కుండినపురమున చారుమతి — హితముగా మితముగా మాట్లాడుచు, గయ్యాళి కాక, అత్తమామల సేవ చేయుచు ఉండెడిది. వరలక్ష్మి ఆమెను అనుగ్రహించి కలలో కనిపించి వరలక్ష్మీ వ్రతము చేయమని చెప్పినది. అప్పటికి చారుమతి వరలక్ష్మిని పూజించలేదు; అయినను ఆ తల్లి అనుగ్రహించినదంటే ఆమె సత్ప్రవర్తనయే కారణము. వ్రతము సత్ప్రవర్తనను అనుసరించునే గాని దానికి బదులు కాదని ఈ కథ చెప్పుచున్నది."
      },
    udyapana: {
        roman: "The toram is kept through the year and replaced at the next observance.",
        deva: "",
        tel: "తోరము సంవత్సరము పాటు ఉంచుకొని మరుసటి వ్రతమునకు మార్చుకొనవలెను."
      },
    vayanam: {
        roman: "Tambulam with fruit, ravikela gudda and dakshina to muttaiduvas.",
        deva: "",
        tel: "పండు, రవికెల గుడ్డ, దక్షిణతో తాంబూలము — ముత్తయిదువులకు."
      },
  },
  //
  {
    id: "kartika-somavara-vratam",
    deity: "shiva",
    name: {
        roman: "Kartika Somavara Nomu",
        deva: "",
        tel: "కార్తీక సోమవార నోము"
      },
    when: {
        roman: "Mondays of Kartika.",
        deva: "",
        tel: "కార్తీక మాసములోని సోమవారములు."
      },
    forwhat: {
        roman: "",
        deva: "",
        tel: ""
      },
    how: {
        roman: "Upavasa through the day, broken after the evening deeparadhana.",
        deva: "",
        tel: "పగలంతయు ఉపవాసము; సాయంకాలపు దీపారాధన అనంతరము విరమణ."
      },
    katha: {
        roman: "",
        deva: "",
        tel: ""
      },
    udyapana: {
        roman: "",
        deva: "",
        tel: ""
      },
    vayanam: {
        roman: "",
        deva: "",
        tel: ""
      },
  },
  //
  {
    id: "vavili-lakshmivaramu-nomu",
    deity: "devi",
    name: {
        roman: "Vavili Lakshmivaramu Nomu",
        deva: "",
        tel: "వావిలి లక్ష్మివారము నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "Sirisampadalu. The katha's point is that if merely receiving the vayanam gives this much, keeping the nomu must give far more.",
        deva: "",
        tel: "సిరిసంపదలు. వాయనము అందుకొన్నందుకే ఇంత ఫలమైతే నోము నోచినచో ఇంకెంతో అని కథ చెప్పును."
      },
    how: {
        roman: "For one year the katha is read and akshatalu placed on the head.",
        deva: "",
        tel: "ఒక సంవత్సరము కథ చదివి అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "A brahmana's younger daughter became the daughter-in-law of a poor house. When her younger brother's wedding took place at her parents' home, she was not invited, on account of that poverty. Her eldest sister-in-law, meaning to do the udyapana of the vavili lakshmivaram nomu she had kept, set in a new cheta washed rice and unwashed rice, a vavili branch, a ravike, dakshina and tambulam, covered it with an old cheta, and passed it over the wall to that poor sister of the house. The moment that vayanam entered her house, wealth came to her. Afterwards her parents' family, seeing her wealth, invited her with respect. 'You have invited not me but my wealth,' she said, and went back.",
        deva: "",
        tel: "ఒక బ్రాహ్మణుని చిన్న కుమార్తె పేదింటికి కోడలయ్యెను. పుట్టింట తమ్ముని వివాహము జరిగినను దారిద్ర్యము కారణముగా ఆమెను పిలువలేదు. ఆమె పెద్ద వదిన, తాను పూర్వము నోచిన వావిలి లక్ష్మివారపు నోమునకు ఉద్యాపన చేయవలెనని తలచి — క్రొత్త చేటలో కడిగిన బియ్యము, కడగని బియ్యము, వావిలి కొమ్మ, రవికె, దక్షిణ తాంబూలము పెట్టి, పాత చేటతో మూసి, గోడమీదుగా ఆ పేద ఆడపడుచుకు అందించెను. ఆ వాయనము ఇంటికి చేరగానే ఆమెకు సిరిసంపదలు కలిగినవి. తరువాత పుట్టింటివారు ఆమె సంపదను చూచి గౌరవముగా పిలిచిరి. 'మీరు నన్ను కాదు, నా సంపదను పిలిచినారు' అని ఆమె తిరిగి వెళ్ళిపోయెను."
      },
    udyapana: {
        roman: "In a new cheta: washed rice, unwashed rice, a vavili branch, ravike gudda, pasupu, kumkuma, dakshina and tambulam; an old cheta as the lid; and — as the practice has it — the vayanam is passed over the wall to a muttaiduva.",
        deva: "",
        tel: "క్రొత్త చేటలో కడిగిన బియ్యము, కడగని బియ్యము, వావిలి కొమ్మ, రవికె గుడ్డ, పసుపు, కుంకుమ, దక్షిణ తాంబూలము పెట్టి, పాత చేటను మూతగా వేసి — సంప్రదాయము ప్రకారము గోడమీదుగా ఒక ముత్తయిదువుకు వాయనము అందించవలెను."
      },
    vayanam: {
        roman: "Rice, vavili branch, ravike, pasupu, kumkuma, dakshina, tambulam.",
        deva: "",
        tel: "బియ్యము, వావిలి కొమ్మ, రవికె, పసుపు, కుంకుమ, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "margashira-lakshmivaramu-nomu",
    deity: "devi",
    name: {
        roman: "Margashira Lakshmivaramu Nomu",
        deva: "",
        tel: "మార్గశిర లక్ష్మీవారము నోము"
      },
    when: {
        roman: "The Thursdays of Margashirsha — four weeks.",
        deva: "",
        tel: "మార్గశిర మాసములోని లక్ష్మివారములు — నాలుగు వారములు."
      },
    forwhat: {
        roman: "The undoing of poverty; that Mahalakshmi stay in the house.",
        deva: "",
        tel: "దారిద్ర్య నివారణ; మహాలక్ష్మి ఇంట నిలుచుట."
      },
    how: {
        roman: "In the morning, without taking anything into the mouth, bathe and do the Lakshmi puja. The katha is read, akshatalu placed, and that week's naivedyam offered — the first Thursday pulagam; the second paramannam; the third mudda kudumulu; the fourth chitrannam or whatever the family's practice gives; and at the close, purnam kudumulu.",
        deva: "",
        tel: "ఉదయము ఏమియు తినకుండా స్నానము చేసి లక్ష్మీపూజ చేయవలెను. కథ చదివి అక్షతలు వేసుకొని, ఆ వారమునకు చెప్పిన నైవేద్యమును సమర్పించవలెను — మొదటి లక్ష్మివారము పులగము; రెండవది పరమాన్నము; మూడవది ముద్ద కుడుములు; నాలుగవది చిత్రాన్నము లేక కుటుంబాచార నైవేద్యము; ముగింపునకు పూర్ణము కుడుములు."
      },
    katha: {
        roman: "A brahmana girl in her childhood made a clay doll and offered it even the small piece of bellam that came to her. When she married and went to her husband's house, Mahalakshmi went with her; her parents' house fell into poverty while wealth grew at her husband's. The money she sent to help her parents was lost on the road, again and again. At last she thought to bring her mother home and have her keep this nomu; but each week her mother, not knowing, broke some rule — tasting the rice, rubbing on oil, combing her hair. Finally the daughter kept her mother carefully within the rule and had her keep it. Mahalakshmi appeared and said that wealth had left because the mother had once slighted the doll the girl worshipped in her childhood. The mother kept the nomu with bhakti, and the poverty was lifted.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ బాలిక చిన్నతనమున మట్టిబొమ్మను చేసి, తనకు లభించిన చిన్న బెల్లముముక్కను కూడా నైవేద్యముగా పెట్టుచుండెడిది. ఆమె వివాహమై అత్తింటికి వెళ్ళునపుడు మహాలక్ష్మి కూడ ఆమె వెంట వెళ్ళెను; పుట్టింటివారు దరిద్రులైరి, ఆమె అత్తింట సిరిసంపదలు పెరిగినవి. పుట్టింటివారికి సహాయము చేయుటకు పంపిన ధనము పలుమార్లు దారిలోనే పోయెను. చివరకు తల్లిని ఇంటికి తీసుకువచ్చి ఈ నోము చేయించవలెనని తలచెను; కానీ తల్లి ప్రతి వారము తెలియక ఏదో ఒక నియమమును ఉల్లంఘించుచుండెను — అన్నము రుచి చూచుట, నూనె రాసుకొనుట, తల దువ్వుకొనుట. చివరకు కూతురు తల్లిని జాగ్రత్తగా నియమములో ఉంచి నోము చేయించెను. మహాలక్ష్మి ప్రత్యక్షమై — బాలిక చిన్నతనమున పూజించిన బొమ్మను తల్లి అవమానించిన కారణముననే సంపద విడిచిపోయినదని చెప్పెను. తల్లి భక్తితో నోము చేయగా దారిద్ర్యము తొలగెను."
      },
    udyapana: {
        roman: "After the four weeks, muttaiduvas are invited, pindivantalu made in ghee, and they are fed; and given pasupu, kumkuma, fruit, tambulam and dakshina.",
        deva: "",
        tel: "నాలుగు వారముల తరువాత ముత్తయిదువులను పిలిచి నేతితో పిండివంటలు చేసి భోజనము పెట్టవలెను. పసుపు, కుంకుమ, పండు, తాంబూలము, దక్షిణ ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Pindivantalu, pasupu, kumkuma, fruit, tambulam, dakshina.",
        deva: "",
        tel: "పిండివంటలు, పసుపు, కుంకుమ, పండు, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "shokamuleni-somavaramu-nomu",
    deity: "shiva",
    name: {
        roman: "Shokamuleni Somavaramu Nomu",
        deva: "",
        tel: "శోకములేని సోమవారము నోము"
      },
    when: {
        roman: "Every Monday, for one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతి సోమవారము."
      },
    forwhat: {
        roman: "The lifting of grief; the husband's return; the undoing of poverty.",
        deva: "",
        tel: "శోకము తొలగుట; భర్త తిరిగివచ్చుట; దారిద్ర్య నివారణ."
      },
    how: {
        roman: "Shiva and Parvati are worshipped and the katha read. One meal only. When possible, tambulam is given to a muttaiduva.",
        deva: "",
        tel: "శివపార్వతులను పూజించి కథ చదువవలెను. ఒంటిపూట భోజనము చేయవలెను. సాధ్యమైనప్పుడు ముత్తయిదువుకు తాంబూలము ఇవ్వవలెను."
      },
    katha: {
        roman: "After a brahmana's daughter was married, her husband went abroad. Because she wept without ceasing, poverty settled on the household; even the tank her father had dug held no water. Parvati and Parameshwara appeared and said that this had come because in a former birth she had transgressed the shokamuleni somavaram nomu, and directed that she keep it again and do the udyapana. She completed the year, her husband returned, and wealth settled in the house.",
        deva: "",
        tel: "ఒక బ్రాహ్మణుని కుమార్తెకు వివాహమైన తరువాత భర్త దేశాంతరము వెళ్ళెను. ఆమె నిరంతరము ఏడ్చుచుండుటచే కుటుంబమున దరిద్రము ఏర్పడెను; తండ్రి తవ్వించిన చెరువులో కూడ నీరు పడలేదు. పార్వతీపరమేశ్వరులు ప్రత్యక్షమై — ఆమె పూర్వజన్మలో శోకములేని సోమవారపు నోమును ఉల్లంఘించినందువలననే ఈ పరిస్థితి వచ్చినదని చెప్పి, తిరిగి నోము చేయించి ఉద్యాపన చేయుమని సూచించిరి. ఆమె ఏడాది నోము పూర్తి చేయగా భర్త తిరిగివచ్చెను; కుటుంబమున సంపద నెలకొనెను."
      },
    udyapana: {
        roman: "Pulagam is made from rice, a ravike gudda tied over the vessel, and given as vayanam to a muttaiduva with pasupu, kumkuma, dakshina and tambulam.",
        deva: "",
        tel: "బియ్యముతో పులగము చేసి, పాత్రపై రవికె గుడ్డను కట్టి — పులగము, రవికె, పసుపు, కుంకుమ, దక్షిణ తాంబూలముతో ఒక ముత్తయిదువుకు వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Pulagam, ravike, pasupu, kumkuma, dakshina, tambulam.",
        deva: "",
        tel: "పులగము, రవికె, పసుపు, కుంకుమ, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "bhagyadivarala-nomu",
    deity: "surya",
    name: {
        roman: "Bhagyadivarala Nomu",
        deva: "",
        tel: "భాగ్యాదివారాల నోము"
      },
    when: {
        roman: "Every Sunday, for one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతి ఆదివారము."
      },
    forwhat: {
        roman: "The return of husband, fortune and enjoyment.",
        deva: "",
        tel: "భర్త, భాగ్యభోగములు తిరిగి లభించుట."
      },
    how: {
        roman: "Shiva-Parvati puja and the reading of the katha. One meal; at the second, only fruit.",
        deva: "",
        tel: "శివపార్వతుల పూజ, కథాపఠనము చేయవలెను. ఒంటిపూట భోజనము; రెండవపూట ఫలాహారము."
      },
    katha: {
        roman: "A king's daughter and a brahmana girl took up the nomu together. The brahmana girl completed it with bhakti and gained wealth; the princess transgressed it and lost husband and wealth both. In the forest Shiva and Parvati appeared to her as an old couple and told her to keep the nomu again. She completed it with bhakti, and husband, fortune and enjoyment came back to her.",
        deva: "",
        tel: "ఒక రాజకుమార్తెయు, బ్రాహ్మణ బాలికయు కలిసి నోము పట్టిరి. బ్రాహ్మణ బాలిక భక్తితో పూర్తి చేసి సంపద పొందెను; రాజకుమార్తె ఉల్లంఘించి భర్తను, సంపదను కోల్పోయెను. అడవిలో ఆమెకు ముసలి దంపతుల రూపమున శివపార్వతులు కనిపించి తిరిగి నోము చేయుమనిరి. ఆమె భక్తితో పూర్తి చేయగా భర్త, భాగ్యభోగములు తిరిగి లభించినవి."
      },
    udyapana: {
        roman: "A ravike is stitched, in silk or plain cloth, with the seams below the sleeves left open. One sleeve is filled with articles of sowbhagyam, the other with kumkuma. The ravike is spread in a cheta with fruit, mettelu, a token mangalasutram, a saree, a ravike, dakshina and tambulam, covered with another cheta, and given as vayanam to a muttaiduva.",
        deva: "",
        tel: "పట్టుతో గాని సాధారణ వస్త్రముతో గాని రవికె కుట్టవలెను; చేతుల దిగువ కూర్పులను పూర్తిగా కుట్టకుండా ఉంచవలెను. ఒక చేతిలో వివిధ సౌభాగ్య వస్తువులు, మరొక చేతిలో కుంకుమ నింపవలెను. చేటలో ఆ రవికెను పరచి — పండ్లు, మెట్టెలు, మంగళసూత్ర ప్రతీక, చీర, రవికె, దక్షిణ తాంబూలము పెట్టి, మరొక చేటతో మూసి ఒక ముత్తయిదువుకు వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "The filled ravike, fruit, mettelu, a token mangalasutram, saree, dakshina, tambulam.",
        deva: "",
        tel: "సౌభాగ్య వస్తువులు నింపిన రవికె, పండ్లు, మెట్టెలు, మంగళసూత్ర ప్రతీక, చీర, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "magha-adivaramula-nomu",
    deity: "surya",
    name: {
        roman: "Magha Adivaramula Nomu",
        deva: "",
        tel: "మాఘ ఆదివారముల నోము"
      },
    when: {
        roman: "Begun on the Ratha Saptami before Magha Purnima, and kept five years.",
        deva: "",
        tel: "మాఘ పౌర్ణమికి ముందువచ్చు రథసప్తమినాడు ప్రారంభించి అయిదు సంవత్సరములు."
      },
    forwhat: {
        roman: "The fruit that comes from merely hearing the katha — 'if hearing alone gives this much, what must keeping the nomu give?'",
        deva: "",
        tel: "కథ వినుటవలననే కలుగు ఫలము — 'విన్నంత మాత్రాన ఇంత ఫలము వచ్చినది; నోము పట్టిన ఎంత ఫలమో'."
      },
    how: {
        roman: "One restriction for each year — in the first, no milk; in the second, no buttermilk; in the third, no pappu; in the fourth, no talantu bath; in the fifth, no tambulam.",
        deva: "",
        tel: "ఒక్కొక్క సంవత్సరము ఒక్కొక్క నియమము — మొదటి సంవత్సరము పాలు తాగరాదు; రెండవది మజ్జిగ తాగరాదు; మూడవది పప్పు తినరాదు; నాలుగవది తలంటి స్నానము చేయరాదు; అయిదవది తాంబూలము వేసుకొనరాదు."
      },
    katha: {
        roman: "On Ratha Saptami, Somulari Somidevamma asked her sons, her grandsons, her daughter-in-law, a brahmana and the tradesmen to hear her katha. All refused, saying they had their work — and to each in turn some obstacle came. At last Upparamadevi agreed to hear it; and the child in her womb heard it too and gained a divine fruit. At that girl's touch dried trees bore, dry cows gave milk, and cotton seeds became pearls. Afterwards Adinarayana came in the form of a brahmana and taught Upparamadevi the worth of service, of dana, of feeding, and of tambulam. With the akshatalu he gave, her dead husband lived again.",
        deva: "",
        tel: "సోములారి సోమిదేవమ్మ రథసప్తమినాడు తన కథ వినుమని కుమారులను, మనుమలను, కోడలిని, బ్రాహ్మణుని, వృత్తిదారులను కోరెను. అందరును తమ పనులున్నవని నిరాకరించగా వారికి వరుసగా ఆటంకములు ఎదురయ్యెను. చివరకు ఉప్పరమాదేవి కథ వినుటకు అంగీకరించెను; ఆమె గర్భములోని శిశువు కూడ కథ విని దివ్యఫలమును పొందెను. ఆ బాలిక స్పర్శతో ఎండిన చెట్లు ఫలించినవి, పాడి ఆవులు పాలిచ్చినవి, ప్రత్తిగింజలు ముత్యములైనవి. తరువాత ఆదినారాయణుడు బ్రాహ్మణ రూపమున వచ్చి ఉప్పరమాదేవికి సేవ, దానము, భోజనము, తాంబూలముల ప్రాముఖ్యతను బోధించెను. ఆయన ఇచ్చిన అక్షతలతో మరణించిన భర్త జీవించెను."
      },
    udyapana: {
        roman: "For the talantu restriction, muttaiduvas are honoured with talantu; for the pappu restriction, burelu; for the milk, paramannam; for the buttermilk, curd; for the tambulam, tambulam. Ravikela guddalu; an angavastram for Adinarayana; an uggu bowl and a cradle saree. The number of muttaiduvas varies between recensions and should be settled with the family purohita.",
        deva: "",
        tel: "తలంటి నియమమునకు ప్రతిగా ముత్తయిదువులకు తలంటి సత్కారము; పప్పు నియమమునకు బూరెలు; పాల నియమమునకు పరమాన్నము; మజ్జిగ నియమమునకు పెరుగు; తాంబూల నియమమునకు తాంబూలము. రవికెల గుడ్డలు; ఆదినారాయణునికి అంగవస్త్రము; ఉగ్గుగిన్నె, ఉయ్యాల చీర. ముత్తయిదువుల సంఖ్యపై పాఠభేదము ఉన్నందున కుటుంబ పురోహితునితో నిర్ధారించుకొనవలెను."
      },
    vayanam: {
        roman: "Burelu, paramannam, curd, tambulam, ravikela guddalu, angavastram, uggu bowl, cradle saree.",
        deva: "",
        tel: "బూరెలు, పరమాన్నము, పెరుగు, తాంబూలము, రవికెల గుడ్డలు, అంగవస్త్రము, ఉగ్గుగిన్నె, ఉయ్యాల చీర."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "atla-tadde",
    deity: "devi",
    name: {
        roman: "Atla Tadde",
        deva: "",
        tel: "అట్ల తద్దె"
      },
    when: {
        roman: "Ashwina krishna tritiya. Fasting until moonrise.",
        deva: "",
        tel: "ఆశ్వయుజ బహుళ తదియ. చంద్రోదయము వరకు ఉపవాసము."
      },
    forwhat: {
        roman: "A young husband; aidotanam. Gorintaku is essential.",
        deva: "",
        tel: "పడుచు మగడు; అయిదోతనము. గోరింటాకు తప్పనిసరి."
      },
    how: {
        roman: "Talantu the day before. A meal before dawn, then nothing until evening. After dark, ten atlu are offered to Gauri Devi.",
        deva: "",
        tel: "తదియ ముందునాడు తలంటి నీళ్ళు పోసుకోవలెను. తెల్లవారుజామున భోజనము చేసి సాయంకాలము వరకు ఎంగిలి పడకూడదు. చీకటిపడిన పిమ్మట గౌరీదేవికి పది అట్లు నైవేద్యము పెట్టవలెను."
      },
    katha: {
        roman: "A king's daughter kept the atla tadde nomu with her companions. They all fasted; but she, being delicate, fainted by evening. Her brother set fire to a chaff heap, hung a mirror in a tree, and told her the moon had risen and she could eat. Believing him, she gave the vayanam and ate. In time she came of age and her brothers looked for matches. Because the vratam had been broken no good match came — only an old bridegroom could be found, and at last they resolved to marry her to him. Learning of it she grieved: 'They said those who keep atla tadde get a young husband — why has this old man come to me?' — and would not agree. One night she went into the forest and sat in tapas under a banyan. After a time Parvati and Parameshwara saw her and asked her trouble. When she told them: 'Amma, you kept the atla tadde nomu and transgressed it by eating before the moon was seen. That is why the old man's match comes to you. Go home, keep the nomu, fast until the lamp-lighting hour and eat after that.' And they vanished. She did so, and was married to a fine young husband.",
        deva: "",
        tel: "ఒక రాజుగారి అమ్మాయి తన చెలికత్తెలతో అట్లతద్దె నోము నోచినది. చెలికత్తెలందరూ ఉపవాసముండిరి. రాచకన్య సుకుమారి కావున సాయంకాలానికి సొమ్మసిల్లి పడిపోయినది. అంత ఆమె సోదరుడు ఆరిక కుప్పకు నిప్పుపెట్టి, చెట్టునకు ఒక అద్దము వ్రేలాడదీసి, 'చంద్రోదయమైనది, భోజనము చేయవచ్చును' అని చెప్పెను. నిజమనుకొని ఆ రాచబిడ్డ వాయనమిచ్చి భోజనము చేసినది. కొంతకాలమునకు యుక్తవయస్సు రాగా అన్నలు సంబంధములు చూచుచుండిరి. వ్రతమునకు లోటు కలిగినందున మంచి సంబంధము కుదరలేదు; ముసలి వరుడే దొరుకుటచే కడకు వారు ముసలివానికిచ్చి పెండ్లి చేయ నిశ్చయించిరి. అది తెలిసి ఆ రాచబిడ్డ — 'అట్లతద్ది నోము నోచినవారికి పడుచు మగడు దొరుకునని చెప్పిరి, నాకీ ముసలి మగడేల దాపరించుచున్నాడు!' అని విచారించి అంగీకరింపలేదు. ఒకనాటి రాత్రి అడవికి పోయి ఒక మర్రిచెట్టు క్రింద తపస్సు చేయుచుండెను. కొంతకాలమునకు పార్వతీపరమేశ్వరులు ఆమెను చూచి కష్టమడిగిరి. ఆమె చెప్పగా — 'అమ్మా! నీవు అట్లతద్దె నోము నోచి చంద్రదర్శనము కాక పూర్వమే భోజనము చేసి ఉల్లంఘన చేసితివి. అందుచే ముసలి మగని సంబంధము వచ్చుచున్నది. ఇంటికి పోయి నోము నోచుకొని దీపాల వేళ వరకు ఉపవాసముండి పిమ్మట భోజనము చేయుము' అని చెప్పి అదృశ్యమయిరి. ఆమె అట్లే చేసినది; చక్కని పడుచు మగనితో పెండ్లి జరిగినది."
      },
    udyapana: {
        roman: "Kept for nine years. In the tenth, ten muttaiduvas are given talantu snanam, and each given ten atlu, pasupu, kumkuma, ravikela gudda, dakshina and tambulam, and fed.",
        deva: "",
        tel: "తొమ్మిది సంవత్సరములు జరుపవలెను. పదవ సంవత్సరమున పదిమంది ముత్తయిదువులకు తలంటి స్నానము చేయించి, పది అట్లు, పసుపు, కుంకుమ, రవికెల గుడ్డ, దక్షిణ, తాంబూలము సమర్పించి భోజనము పెట్టవలెను."
      },
    vayanam: {
        roman: "Ten atlu, pasupu, kumkuma, ravikela gudda, dakshina, tambulam.",
        deva: "",
        tel: "పది అట్లు, పసుపు, కుంకుమ, రవికెల గుడ్డ, దక్షిణ, తాంబూలము."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "undralla-tadde",
    deity: "devi",
    name: {
        roman: "Undralla Tadde",
        deva: "",
        tel: "ఉండ్రాళ్ళ తద్దె"
      },
    when: {
        roman: "Bhadrapada krishna tritiya in this telling.",
        deva: "",
        tel: "భాద్రపద బహుళ తదియ."
      },
    forwhat: {
        roman: "Kept by unmarried girls.",
        deva: "",
        tel: "కన్యలు నోచు నోము."
      },
    how: {
        roman: "A meal before dawn, then nothing until dark. Five undrallu are offered to Gauri and five given as vayanam to a muttaiduva.",
        deva: "",
        tel: "తెల్లవారుజామున భోజనము చేసి చీకటిపడు వరకు ఎంగిలి పడకూడదు. గౌరికి అయిదు ఉండ్రాళ్ళు నైవేద్యము పెట్టి మరి అయిదు ఉండ్రాళ్ళు ముత్తయిదువునకు వాయనమివ్వవలెను."
      },
    katha: {
        roman: "In a certain town the women were keeping the undralla tadde nomu. The king's courtesan told him she too would keep it. When he asked what articles she needed, she said — playing with him — that she wanted aaku-geeku, poka-geeka, kura-geera. Thinking it a small matter, the king sent his servants. They brought everything but could not find the things named 'gee'. When word came back she laughed: 'Is this all your royal boasting?' The day being already late, she called the muttaiduva from next door, offered five undrallu to Gauri, and gave five to her as vayanam. She kept the nomu five years and did the udyapana.",
        deva: "",
        tel: "ఒక ఊరిలో స్త్రీలందరు ఉండ్రాళ్ళ తద్దె నోము నోచుకొనుచుండిరి. అప్పుడా ఊరి రాజుగారి వేశ్య తానును నోము నోచెదనని రాజుతో చెప్పెను. 'నీకు కావలసిన వస్తువులేవో చెప్పు' అని రాజు అడుగగా, ఆమె చమత్కారముగా — ఆకూ-గీకూ, పోకా-గీకా, కూరా-గీరా కావలెనని చెప్పెను. అది ఎంతపని అని రాజు నౌకరులను పంపెను. వారు అన్నిటినీ తెచ్చిరి గానీ 'గీ' అను పేరుతో ఉన్నవాటిని తేలేకపోయిరి. ఆ సంగతి తెలిసి ఆమె నవ్వి — 'ఇంతేనా మీ రాచబడాయి!' అనెను. అప్పటికే ప్రొద్దుపోవుటచే పక్కయింటి ముత్తయిదువును పిలిచి, అయిదు ఉండ్రాళ్ళు గౌరికి నైవేద్యము పెట్టి, అయిదు ఉండ్రాళ్ళను ఆమెకు వాయనమిచ్చెను. ఆ విధముగా అయిదేండ్లు నోచుకొని ఉద్యాపన చేసుకొనెను."
      },
    udyapana: {
        roman: "After five years, five punyakantalu are given talantu snanam and gorintaku, and each given five kudumulu, ravikela gudda, dakshina and tambulam. 'A lapse in the katha may be borne; a lapse in the vratam may not.'",
        deva: "",
        tel: "అయిదు సంవత్సరముల పిమ్మట అయిదుగురు పుణ్యకాంతలకు తలంటి నీళ్ళు పోసి గోరింటాకు ఇచ్చి, ఒక్కొక్కరికి అయిదేసి కుడుములు, రవికెల గుడ్డ, దక్షిణ తాంబూలములు ఇవ్వవలెను. 'కథలోపం వచ్చినను వ్రత లోపము రాకూడదు.'"
      },
    vayanam: {
        roman: "Five undrallu; at the udyapana, five kudumulu each.",
        deva: "",
        tel: "అయిదు ఉండ్రాళ్ళు; ఉద్యాపనలో అయిదేసి కుడుములు."
      },
  },
  //
  {
    id: "polala-amavasya",
    deity: "devi",
    name: {
        roman: "Polala Amavasya",
        deva: "",
        tel: "పోలాల అమావాస్య"
      },
    when: {
        roman: "Shravana krishna amavasya.",
        deva: "",
        tel: "శ్రావణ బహుళ అమావాస్య."
      },
    forwhat: {
        roman: "Children's wellbeing and long life.",
        deva: "",
        tel: "పిల్లల క్షేమము, ఆయుష్షు."
      },
    how: {
        roman: "Poleramma is worshipped. Kanda Gauri Nomu is kept together with this.",
        deva: "",
        tel: "పోలేరమ్మను పూజింతురు. కంద గౌరీ నోము దీనితో కలిపి నోతురు."
      },
    katha: {
        roman: "",
        deva: "",
        tel: ""
      },
    udyapana: {
        roman: "",
        deva: "",
        tel: ""
      },
    vayanam: {
        roman: "",
        deva: "",
        tel: ""
      },
  },
  //
  {
    id: "kundeti-amavasya",
    deity: "devi",
    name: {
        roman: "Kundeti Amavasya",
        deva: "",
        tel: "కుందేటి అమావాస్య"
      },
    when: {
        roman: "Amavasya; thirteen amavasyas.",
        deva: "",
        tel: "అమావాస్య; పదమూడు అమావాస్యలు."
      },
    forwhat: {
        roman: "The protection of children.",
        deva: "",
        tel: "పిల్లల రక్షణ."
      },
    how: {
        roman: "For each amavasya one kind — chalimidi and the rest — is made, and given as vayanam to muttaiduvas with dakshina and tambulam.",
        deva: "",
        tel: "అమావాస్యకు ఒక్కొక్క రకము చొప్పున చలిమిడి మొదలైనవి చేసికొని, దక్షిణ తాంబూలము పెట్టి ముత్తయిదువులకు వాయనమివ్వవలెను."
      },
    katha: {
        roman: "A hare left her young in a washerwoman's pot and went out to graze. The washerwoman came, set that pot on the fire and lit it. Returning, the mother found her young crying, 'We are boiling, amma!' Circling the pot she said: 'Do not boil, my children — against boiling I have given undrallu as vayanam.' 'We are dying, amma!' — 'Do not die, my children — against dying I gave chalimidi.' 'We are scorching!' — 'Do not scorch — I gave chimmili.' 'We are parching!' — 'Do not parch — I gave roasted rice.' 'We are bursting!' — 'Do not burst — I gave pelalu.' 'We are catching at the bottom!' — 'Do not catch — I gave atlu.' 'We are burning!' — 'Do not burn — I gave firewood.' 'We are creeping over!' — 'Do not creep — I gave paramannam.' 'We are boiling over!' — 'Do not boil over — I gave polulu.' 'We are soaking!' — 'Do not soak — I gave soaked rice.' 'We are charring!' — 'Do not char — I gave madalu.' 'We are singeing!' — 'Do not singe — I gave garelu.' Saying so and circling the pot, all her young came up and out and went to their mother. The washerwoman, who had watched it all, asked in wonder how it was. The hare said: 'You set the pot my children were in upon the fire and were boiling them; unable to bear their crying I circled the pot in grief; more than that I do not know.' Then the washerwoman said: 'Today is amavasya. From this day I shall tell the katha, place akshatalu, name it the Kundeti Amavasya and keep the nomu.'",
        deva: "",
        tel: "ఒక కుందేలు చాకలి బానలో పిల్లలను పెట్టి మేతకొరకు పోయినది. చాకలిది వచ్చి ఆ బానను పొయ్యిమీద పెట్టి మంట పెట్టెను. మేతకు పోయిన తల్లి తిరిగివచ్చి చూచునప్పటికి పిల్లలు — 'ఉడికిపోవుచున్నామమ్మా!' అని అరచుచున్నవి. తల్లి బాన చుట్టూ తిరుగుచు — 'ఉడకకండి బిడ్డలారా! ఉడకకుండా ఉండ్రాళ్ళ వాయనమిచ్చినాను' అనెను. 'చచ్చిపోయేమమ్మా!' — 'చావకండి బిడ్డలారా! చావకుండా చలిమిడి వాయనమిచ్చితిని.' 'చిమిడితిమే అమ్మా!' — 'చిమడకండి! చిమ్మిలి వాయనమిచ్చినాను.' 'వేగితిమే అమ్మా!' — 'వేగకండి! వేపుడు బియ్యం వాయనమిచ్చినాను.' 'పేలిపోయితిమే అమ్మా!' — 'పేలకండి! పేలాలు వాయనమిచ్చాను.' 'అడుగంటితిమే అమ్మా!' — 'అడుగంటకండి! అట్లు వాయనమిచ్చినాను.' 'కాలిపోతిమే అమ్మా!' — 'కాలకండి! కర్రలు వాయనమిచ్చినాను.' 'పాకితిమే అమ్మా!' — 'పాకకండి! పరమాన్నము వాయనమిచ్చినాను.' 'పొంగితిమే అమ్మా!' — 'పొంగకండి! పోలులు వాయనమిచ్చినాను.' 'నానితిమే అమ్మా!' — 'నానకండి! నానబియ్యము వాయనమిచ్చితిని.' 'మాడితిమే అమ్మా!' — 'మాడకండి! మాడలు వాయనమిచ్చినాను.' 'కందితిమే అమ్మా!' — 'కందకండి! గారెలు వాయనమిచ్చినాను.' ఇట్లు చెప్పుచు తల్లి బాన చుట్టూ తిరుగునప్పటికి పిల్లలన్నియు పైకివచ్చి తల్లి దగ్గరకు వెళ్ళిపోయినవి. ఇదంతయు చూచిన చాకలిది ఆశ్చర్యపడి అడుగగా — 'నీవు నా పిల్లలున్న బానను పొయ్యిమీద పెట్టి ఉడికించుచున్నావు; వారి ఏడుపు విని సహింపలేక శోకముతో బాన చుట్టూ తిరిగినాను; అంతకన్న నేనేమి ఎరుగను' అని కుందేలు చెప్పెను. అప్పుడు చాకలిది — 'ఈ రోజున అమావాస్య; ఈరోజు మొదలుకొని కథ చెప్పి అక్షింతలు వేసుకొని దీనికి కుందేటి అమావాస్య అని పేరు పెట్టుకొని నోము పట్టెదను' అని నోము పట్టెను."
      },
    udyapana: {
        roman: "Chalimidi is made from three manikas of rice and shaped into a mother hare and her young, placed in a washerwoman's pot, and given as vayanam to a muttaiduva with a saree, ravikela gudda, nallapusalu, lakka jodu, dakshina and tambulam.",
        deva: "",
        tel: "మూడు మానికెల బియ్యముతో చలిమిడి చేసి, దానిని కుందేటి తల్లిపిల్లలుగా చేసి, చాకలిబానలో పెట్టి, చీర, రవికెలగుడ్డ, నల్లపూసలు, లక్కజోడు, దక్షిణ తాంబూలములతో ముత్తయిదువునకు వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Chalimidi hares in a pot; saree, ravikela gudda, nallapusalu, lakka jodu, dakshina, tambulam.",
        deva: "",
        tel: "చలిమిడి కుందేళ్ళు బానలో; చీర, రవికెలగుడ్డ, నల్లపూసలు, లక్కజోడు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "poli-swargamunaku-vellu-nomu",
    deity: "devi",
    name: {
        roman: "Poli Swargamunaku Vellu Nomu",
        deva: "",
        tel: "పోలి స్వర్గమునకు వెళ్ళు నోము"
      },
    when: {
        roman: "From Ashwina krishna amavasya to Kartika krishna amavasya — one month.",
        deva: "",
        tel: "ఆశ్వయుజ బహుళ అమావాస్య మొదలు కార్తీక బహుళ అమావాస్య వరకు — నెలరోజులు."
      },
    forwhat: {
        roman: "The fruit of setting the lamp with shraddha and bhakti.",
        deva: "",
        tel: "శ్రద్ధాభక్తులతో దీపము పెట్టిన ఫలము."
      },
    how: {
        roman: "Each day, before daybreak, bathe and set the lamp. The katha is told and akshatalu placed.",
        deva: "",
        tel: "ప్రతిరోజు ఉదయము కాకముందే స్నానము చేసి దీపము పెట్టవలెను. కథ చెప్పి అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "A washerwoman had four sons and four daughters-in-law. She and three of the daughters-in-law kept the whole of Kartika, bathing before daybreak and setting the lamp, through the month. On Kartika krishna amavasya they rose at dawn, told the youngest daughter-in-law, 'We are going to bathe; mind the house,' and went. Then the youngest rose, churned the buttermilk, wiped up the butter clinging to the churning stick, brought a scrap of cotton fallen under the cotton plant, bathed at the well, lit her lamp, and — so that her mother-in-law should not come upon it — covered it over with the washing pot. Then a vimanam came down from the sky; she boarded it and was going to swarga in her own body. All those setting lamps on the riverbank saw and marvelled: 'Chakali Poli is going to swarga!' Her mother-in-law and the three others saw, and caught at her feet from below the vimanam. Then Vishnu came, released this daughter-in-law and took hold of the four: 'You set your lamps carelessly and without bhakti; she set hers with shraddha and bhakti; therefore I have given her swarga in her own body.'",
        deva: "",
        tel: "ఒక చాకలిదానికి నలుగురు కొడుకులు, నలుగురు కోడళ్ళు. ఆ చాకలిదియు ముగ్గురు కోడళ్ళును కార్తీక మాసమంతయు ఉదయము కాకుండా స్నానము చేసి దీపము పెట్టుచు నెలరోజులు జరిపిరి. కార్తీక బహుళ అమావాస్యనాడు తెల్లవారుజామున లేచి కడసారపు కోడలితో 'మేము స్నానమునకు వెళ్ళుచున్నాము, ఇంటివద్ద జాగ్రత్తగా ఉండుము' అని చెప్పి వెళ్ళిరి. అప్పుడు చిన్నకోడలు లేచి, చల్ల చేసి కవ్వమునకు అంటియున్న వెన్న ఊడ్చుకొని, ప్రత్తిచెట్టు క్రింద పడియున్న ఒక ప్రత్తికాడ తెచ్చుకొని, నూతివద్ద స్నానము చేసి దీపము వెలిగించి, అత్తగారు రాకుండునని ఆ దీపముమీద చాకలిబాన మూత వేసెను. అప్పుడు ఆకాశమునుండి విమానము వచ్చెను; అది ఎక్కి బొందెతోనే స్వర్గమునకు వెళ్ళుచుండెను. ఏటి ఒడ్డున దీపములు పెట్టుకొనుచున్నవారందరు చూచి — 'చాకలి పోలి స్వర్గమునకు వెళ్ళుచున్నది!' అని ఆశ్చర్యపడసాగిరి. అత్తయు ముగ్గురు కోడళ్ళును చూచి విమానముమీది ఆమె కాళ్ళు పట్టుకొనిరి. అంతట విష్ణుమూర్తి వచ్చి ఈ కోడలిని వదలిపెట్టి వారి నలుగురిని పట్టుకొని — 'అశ్రద్ధగా, భక్తిలేకుండా దీపాలు పెట్టుకున్నారు; ఇది శ్రద్ధాభక్తులతో పెట్టుకున్నది; కాబట్టి దీనికి బొందితో స్వర్గమిచ్చినాను' అని చెప్పెను."
      },
    udyapana: {
        roman: "The katha is told and akshatalu placed.",
        deva: "",
        tel: "ఈ కథ చెప్పి అక్షతలు వేసుకొనవలెను."
      },
    vayanam: {
        roman: "",
        deva: "",
        tel: ""
      },
  },
  //
  {
    id: "kartika-chalimalla-nomu",
    deity: "shiva",
    name: {
        roman: "Kartika Chalimalla Nomu",
        deva: "",
        tel: "కార్తీక చలిమళ్ళ నోము"
      },
    when: {
        roman: "Kartika Purnima — for three years.",
        deva: "",
        tel: "కార్తీక పౌర్ణమి — మూడు సంవత్సరములు."
      },
    forwhat: {
        roman: "Wealth, children, sowbhagyam.",
        deva: "",
        tel: "సంపద, సంతానము, సౌభాగ్యము."
      },
    how: {
        roman: "In the first year, five manikas of chalimidi to five muttaiduvas at the river bathing steps; in the second, ten manikas to ten under a tree branch; in the third, fifteen manikas to fifteen in the temple. The chalimidi is rolled into balls and given as vayanam with pasupu, kumkuma, tambulam and dakshina.",
        deva: "",
        tel: "మొదటి సంవత్సరము అయిదు మానికల చలిమిడి అయిదుగురు ముత్తయిదువులకు నదీస్నాన రేవులో; రెండవ సంవత్సరము పది మానికలు పదిమందికి చెట్టు కొమ్మ క్రింద; మూడవ సంవత్సరము పదిహేను మానికలు పదిహేనుమందికి ఆలయమున. చలిమిడి ముద్దలు చేసి పసుపు, కుంకుమ, తాంబూలము, దక్షిణతో వాయనము ఇవ్వవలెను."
      },
    katha: {
        roman: "A king's daughter and a minister's daughter took up the nomu together. The minister's daughter gave the chalimidi vayanams by rule for three years — the first at the river steps, the second under a tree branch, the third in the temple. Wealth, children and sowbhagyam came to her. The princess transgressed and suffered poverty and her husband's illness. On Parvati and Parameshwara's instruction she completed the nomu again, and her troubles were lifted.",
        deva: "",
        tel: "ఒక రాజకుమార్తెయు మంత్రి కుమార్తెయు కలిసి నోము పట్టిరి. మంత్రి కుమార్తె మూడు సంవత్సరములు నియమముగా చలిమిడి వాయనములు ఇచ్చెను — మొదటి సంవత్సరము నదీస్నాన రేవులో, రెండవది చెట్టు కొమ్మ క్రింద, మూడవది ఆలయమున. ఆమెకు సంపద, సంతానము, సౌభాగ్యము కలిగినవి. రాజకుమార్తె ఉల్లంఘించి దారిద్ర్యముతోను భర్త అనారోగ్యముతోను బాధపడెను. పార్వతీపరమేశ్వరుల ఉపదేశముతో తిరిగి నోము పూర్తి చేయగా ఆమె కష్టములు తొలగినవి."
      },
    udyapana: {
        roman: "The giving of the chalimidi balls with pasupu, kumkuma, tambulam and dakshina is itself the udyapana.",
        deva: "",
        tel: "చలిమిడి ముద్దలు చేసి పసుపు, కుంకుమ, తాంబూలము, దక్షిణతో వాయనము ఇచ్చుటయే ఉద్యాపన."
      },
    vayanam: {
        roman: "Chalimidi, pasupu, kumkuma, tambulam, dakshina.",
        deva: "",
        tel: "చలిమిడి, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "muni-kartika-vratamu",
    deity: "shiva",
    name: {
        roman: "Muni Kartika Vratamu",
        deva: "",
        tel: "ముని కార్తీక వ్రతము"
      },
    when: {
        roman: "The nomu is taken up on Shivaratri, and in Kartika the lamp is lit equally through the three kartulu.",
        deva: "",
        tel: "శివరాత్రినాడు నోము పట్టి, కార్తీక మాసమున మూడు కార్తులు సమముగా దీపము వెలిగించవలెను."
      },
    forwhat: {
        roman: "The lifting of poverty and of kadupu-shokam.",
        deva: "",
        tel: "దారిద్ర్యము, కడుపుశోకము తొలగుట."
      },
    how: {
        roman: "Three hundred and twenty wicks with a giddedu of oil are set and the lamp lit in a Shiva temple.",
        deva: "",
        tel: "మూడువందల ఇరువది వత్తులు, గిద్దెడు నూనె పోసి శివాలయమున దీపము వెలిగించవలెను."
      },
    katha: {
        roman: "A brahmana's wife took up the muni kartika dipamula nomu and transgressed it; poverty and kadupu-shokam came to her. Unable to bear it she set out to ask a boon of Brahma. On the way a brahmana met her: 'For eighteen births I have been without food or drink; ask why.' Further on a mango tree heavy with fruit: 'For three generations I have been full of fruit and no one plucks even one; ask why.' Then a cow and calf stood tethered, not eating the grass. A jasmine bush stood full of flowers that no one picked. In one place sarees on a line were burning; in another a griddle stood aflame. Reaching Brahma's world she told her trouble, and he said: 'In a former birth you took up the muni kartika dipamula nomu and transgressed it; that is why this poverty and this kadupu-shokam.' He gave the reasons for the rest as well — the brahmana had learned the Veda and never taught a word of it to anyone, and so was unfit; the tree had been a woman who refused to give a child in adoption, and her line failing, was born a tree; the cow and calf had been mother-in-law and daughter-in-law who quarrelled over whose turn it was to give grass and water and so gave none; the jasmine had brought flowers and given none away but adorned herself alone; the sarees burned because for seven generations not one cloth had been given to a daughter of the house; the griddles flamed because mother-in-law and daughter-in-law had taken vayanam back and forth between themselves. For each he gave the remedy, and said: 'You made three hundred and sixty wicks and poured a giddedu of oil and lit the lamps; for the lighting I set aside the fruit of the wicks and give you instead the fruit of what you spoke.' Returning she sprinkled water on the griddle; took one saree and wore it; picked two flowers for her hair; picked and ate one fruit; and cooked paramannam for the brahmana, setting it before him three times with 'Rama, Rama, Rama'. Coming home she took up the nomu on Shivaratri and lit the lamp in the Shiva temple; and because the fruit of what she had spoken was greater than the fruit of the wicks, wealth came to her house.",
        deva: "",
        tel: "ఒక బ్రాహ్మణుని భార్య ముని కార్తీక దీపముల నోముపట్టి ఉల్లంఘనము చేసెను; అందువలన దారిద్ర్యమును కడుపుశోకమును వచ్చెను. అది భరించలేక బ్రహ్మదేవుని యొద్దకు వరమడుగుటకు బయలుదేరెను. త్రోవలో ఒక బ్రాహ్మణుడు ఎదురై — 'పదునెనిమిది జన్మములనుండి అన్నపానములు లేకున్నాను, ఎందుకో అడిగిరమ్ము' అనెను. కొంతదూరమున పండ్లతోనున్న ఒక ముంతమామిడి చెట్టు — 'మూడు పురుషాంతరములనుండి నిండా పండియున్నాను, ఎవ్వరు ఒక్క పండైనా కోసుకొని తినరు, ఎందుకో అడుగుము' అనెను. ముందుకు ఒక ఆవు దూడ మొలబడి గడ్డిలో మేయకుండా నిలిచియుండెను. ఒక మల్లెపొద నిండా పూవులతో ఉండి ఎవరూ కోయకుండెను. ఒకచోట దండెముల కోకలు తగులబడుచుండెను; మరొకచోట అట్లపెనము మండుచుండెను. బ్రహ్మలోకమునకు చేరి ఆమె తన కష్టము చెప్పగా — 'నీవు క్రిందటి జన్మమున ముని కార్తీక దీపముల నోముపట్టి ఉల్లంఘనము చేసినావు; అందుచేతనే ఈ దారిద్ర్యము, కడుపుశోకము' అని బ్రహ్మ చెప్పెను. మిగిలిన వాటికిని కారణములు చెప్పెను — వేదము చదివి ఎవ్వరికి ఒక్క ముక్క చెప్పని బ్రాహ్మణునకు ఆ అయోగ్యత; పెంపునకు బిడ్డను ఇవ్వనందున వంశము పోయి చెట్టుగా పుట్టినది; ఆవునకు దూడకు గడ్డి నీళ్ళు పోయుటకు అత్తాకోడళ్ళు వంతులాడి మానివేయుటచే అట్లు పుట్టిరి; పూవులు తెచ్చి ఎవ్వరికిని ఇయ్యక తానే అలంకరించుకొనుటచే మల్లెపొద; ఏడు తరముల ఆడబిడ్డకు ఒక్క బట్టయైనా పెట్టనందున కోకలు కాలుచున్నవి; అత్తాకోడళ్ళు ఎదురువాయనాలు అందుకొనుటచే పెనములు మండుచున్నవి. ఒక్కొక్కదానికి పరిహారము చెప్పి — 'నీవు మున్నూట అరువది వత్తులు చేసి గిద్దెడు నూనె పోసి దీపాలు వెలిగించినావు; వెలిగించినందుకు వత్తి ఫలము మానివేసి పలికిన ఫలమిచ్చినాను' అని బ్రహ్మ చెప్పెను. ఆమె తిరిగి వచ్చుచు — పెనముపై నీళ్ళు చల్లెను; ఒక కోక తీసి కట్టుకొనెను; రెండు పూవులు కోసి కొప్పులో పెట్టుకొనెను; ఒక పండు కోసుకొని తినెను; ఆ బ్రాహ్మణునకు పరమాన్నము వండి 'రామ, రామ, రామ' అని మూడుసార్లు పెట్టెను. ఇంటికి వచ్చి శివరాత్రినాడు నోముపట్టి శివాలయమున దీపము వెలిగించెను; వత్తుల ఫలముకంటె పలికిన ఫలము ఎక్కువగుటచే ఆమెకు సిరిసంపద కలిగెను."
      },
    udyapana: {
        roman: "Five mooras of angavastram and five manikas of rice are poured on the mandapam, dakshina and tambulam set, a golden wick lit in a silver pramida, and given as vayanam to a brahmana. 'Though the means fail, the bhakti must not.'",
        deva: "",
        tel: "అయిదు మూరల అంగవస్త్రము, అయిదు మానికెల బియ్యము మండపముపై పోసి, దక్షిణ తాంబూలము పెట్టి, వెండి ప్రమిదలో బంగారు వత్తివేసి దీపము వెలిగించి ఒక బ్రాహ్మణునకు వాయనమివ్వవలెను. 'శక్తి తప్పినను భక్తి తప్పరాదు.'"
      },
    vayanam: {
        roman: "Angavastram, rice, silver pramida, golden wick, dakshina, tambulam.",
        deva: "",
        tel: "అంగవస్త్రము, బియ్యము, వెండి ప్రమిద, బంగారు వత్తి, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "kedareswara-vratam",
    deity: "shiva",
    name: {
        roman: "Kedareswara Nomu",
        deva: "",
        tel: "శ్రీ కేదారేశ్వర నోము"
      },
    when: {
        roman: "Deepavali amavasya.",
        deva: "",
        tel: "ఆశ్వయుజ బహుళ అమావాస్య — దీపావళి అమావాస్య."
      },
    forwhat: {
        roman: "Marital wellbeing. Traditionally kept twenty-one years.",
        deva: "",
        tel: "అయిదోతనము. ఇరవై ఒక్క సంవత్సరములు చేయుదురు."
      },
    how: {
        roman: "Shiva and Gauri are worshipped together as Kedareswara. A twenty-one-knot toram is tied.",
        deva: "",
        tel: "శివుని గౌరిని కలిపి కేదారేశ్వరునిగా పూజింతురు. ఇరవై ఒక్క ముడుల తోరము కట్టుకొందురు."
      },
    katha: {
        roman: "",
        deva: "",
        tel: ""
      },
    udyapana: {
        roman: "In the twenty-first year.",
        deva: "",
        tel: "ఇరవై ఒకటవ సంవత్సరమున."
      },
    vayanam: {
        roman: "Twenty-one items, corresponding to the knots.",
        deva: "",
        tel: "ముడుల సంఖ్యకు తగినట్లు ఇరవై ఒక్క వస్తువులు."
      },
  },
  //  // ★ richer structured version also available
  {
    id: "muppadimudu-punnamula-nomu",
    deity: "devi",
    name: {
        roman: "Muppadimudu Punnamula Nomu",
        deva: "",
        tel: "ముప్పదిమూడు పున్నముల నోము"
      },
    when: {
        roman: "Thirty-three consecutive purnimas.",
        deva: "",
        tel: "వరుసగా ముప్పదిమూడు పౌర్ణములు."
      },
    forwhat: {
        roman: "Long sowbhagyam; the saving of the husband's life.",
        deva: "",
        tel: "దీర్ఘసౌభాగ్యము; భర్త ప్రాణరక్షణ."
      },
    how: {
        roman: "On the purnima, puja, the reading of the katha, and the sighting of the moon. Fasting, or whatever rule the family keeps.",
        deva: "",
        tel: "పౌర్ణమినాడు పూజ, కథాపఠనము, చంద్రదర్శనము చేయవలెను. ఉపవాసము లేక కుటుంబాచార నియమము పాటించవలెను."
      },
    katha: {
        roman: "A brahmana girl's husband died on the third day after the wedding. A queen gave her the vayanam of her own muppadimudu punnamula nomu. The moment the girl carried that vayanam home with its lamps burning, her husband lived. Yama came again and took the life away, and she followed. She asked for as many thousand years of aidavatanam as there were holes in the thirty-three atlu she had been given; and as many thousand more as there were holes in the black beads. Pleased with her bhakti, Yama gave back her husband's life.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ బాలికకు వివాహమైన మూడవ దినమునే భర్త మరణించెను. ఆమెకు ఒక రాణి తన ముప్పదిమూడు పున్నముల నోము వాయనమును ఇచ్చెను. బాలిక వెలుగుచున్న జ్యోతులతో ఆ వాయనమును ఇంటికి తీసుకువచ్చుసరికి భర్త జీవించెను. యముడు తిరిగివచ్చి ప్రాణమును తీసుకొనిపోగా ఆమె వెంబడించెను. తనకు లభించిన ముప్పదిమూడు అట్లకు ఎన్ని బెజ్జములున్నవో అన్ని వేల ఏండ్లు అయిదవతనమని; నల్లపూసలకు ఎన్ని బెజ్జములున్నవో అన్ని వేల ఏండ్లని కోరెను. ఆమె భక్తికి మెచ్చి యముడు భర్త ప్రాణమును తిరిగి ఇచ్చెను."
      },
    udyapana: {
        roman: "Thirty-three atlu; thirty-three betel leaves; thirty-three areca; thirty-three coins; thirty-three strings of black beads; thirty-three lakka jollu; thirty-three lamps; a saree and a ravike — set in a new sieve of thirty-three holes, covered with an old sieve, and given to a muttaiduva.",
        deva: "",
        tel: "ముప్పదిమూడు అట్లు; ముప్పదిమూడు తమలపాకులు; ముప్పదిమూడు వక్కలు; ముప్పదిమూడు నాణేలు; ముప్పదిమూడు నల్లపూసల కోళ్ళు; ముప్పదిమూడు లక్కజోళ్ళు; ముప్పదిమూడు జ్యోతులు; చీర, రవికె — వీటిని ముప్పదిమూడు కన్నుల క్రొత్త జల్లెడలో పెట్టి పాత జల్లెడతో మూసి ముత్తయిదువుకు ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Atlu, leaves, areca, coins, black beads, lakka jollu, lamps, saree, ravike — in the sieve.",
        deva: "",
        tel: "అట్లు, ఆకులు, వక్కలు, నాణేలు, నల్లపూసలు, లక్కజోళ్ళు, జ్యోతులు, చీర, రవికె — జల్లెడలో."
      },
  },
  //
  {
    id: "sowbhagya-tadiyala-nomu",
    deity: "devi",
    name: {
        roman: "Sowbhagya Tadiyala Nomu",
        deva: "",
        tel: "సౌభాగ్య తదియల నోము"
      },
    when: {
        roman: "On the tadiya following each purnima — for one year.",
        deva: "",
        tel: "ప్రతి పౌర్ణమి తరువాత వచ్చు తదియనాడు — ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The removal of the fault that brings widowhood.",
        deva: "",
        tel: "వైధవ్య దోష నివారణ."
      },
    how: {
        roman: "A fast is kept. Rice is cooked WITHOUT SPEAKING TO ANYONE, and eaten plain and unsalted. The katha is read and akshatalu placed.",
        deva: "",
        tel: "ఉపవాసము ఉండవలెను. ఎవరితోను మాట్లాడకుండా బియ్యము వండి, ఉప్పులేని చప్పిడి అన్నము తినవలెను. కథ చదివి అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "Widowhood came to a brahmana girl while she was still young. Her parents went grieving into the forest, and Parvati and Parameshwara appeared and told them that this hardship had come because in a former birth she had transgressed the sowbhagya tadiyala nomu. They had her keep it again by rule for a year and did the udyapana, and her fault was lifted.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ బాలికకు చిన్న వయసుననే వైధవ్యము వచ్చెను. దుఃఖముతో అడవికి వెళ్ళిన తల్లిదండ్రులకు పార్వతీపరమేశ్వరులు కనిపించి — ఆ బాలిక పూర్వజన్మలో సౌభాగ్య తదియల నోమును ఉల్లంఘించిన కారణముననే ఈ కష్టము వచ్చినదని చెప్పిరి. తిరిగి ఏడాదిపాటు నియమముగా చేయించి ఉద్యాపన చేయగా ఆమె దోషము తొలగినది."
      },
    udyapana: {
        roman: "The turmeric is mixed WITHOUT SPEAKING TO ANYONE and placed in thirteen bamboo boxes. In each box: a coin, lakka jodu or bangles, a ravike, black beads, pasupu, kumkuma, tambulam and dakshina. The vayanam is given to thirteen muttaiduvas.",
        deva: "",
        tel: "పసుపును ఎవరితోను మాట్లాడకుండా కలిపి పదమూడు వెదురు పెట్టెలలో పెట్టవలెను. ఒక్కొక్క పెట్టెలో — నాణెము, లక్కజోడు లేక గాజులు, రవికె, నల్లపూసలు, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ. పదముగ్గురు ముత్తయిదువులకు వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Pasupu, coin, bangles, ravike, black beads, kumkuma, tambulam, dakshina — in bamboo boxes.",
        deva: "",
        tel: "పసుపు, నాణెము, గాజులు, రవికె, నల్లపూసలు, కుంకుమ, తాంబూలము, దక్షిణ — వెదురు పెట్టెలలో."
      },
  },
  //
  {
    id: "udaya-kunkuma-nomu",
    deity: "devi",
    name: {
        roman: "Udaya Kunkuma Nomu",
        deva: "",
        tel: "ఉదయ కుంకుమ నోము"
      },
    when: {
        roman: "Daily before sunrise, one year. A nomu for unmarried girls.",
        deva: "",
        tel: "ప్రతిదినము సూర్యోదయమునకు ముందు — ఒక సంవత్సరము. కన్నెపిల్లలు చేసుకొనవలసిన నోము."
      },
    forwhat: {
        roman: "Mangalyam; sirisampadalu.",
        deva: "",
        tel: "మాంగల్యము; సిరిసంపదలు."
      },
    how: {
        roman: "Rise before sunrise, complete the kalakrityalu, bathe, put on bottu and katuka, and make namaskaram and puja to Gauri Devi. So for one year.",
        deva: "",
        tel: "సూర్యోదయమునకు పూర్వమే నిద్రలేచి కాలకృత్యములు తీర్చుకొని, స్నానము చేసి, బొట్టూ కాటుక పెట్టుకొని గౌరీదేవికి నమస్కరించి పూజ చేయవలెను. అట్లు ఒక సంవత్సరము."
      },
    katha: {
        roman: "A brahmana had four daughters. Three were married, and all three lost their husbands and were widowed. The parents grieved. Meanwhile the youngest came of age. Fearing that the widowhood that had come to her sisters would come to her too, the brahmana prayed constantly: 'At least protect this one's mangalyam.' One day Parameshwara came to their house in the form of a sadhu: 'Brahmana couple, I know the cause of your sorrow. Do not grieve. Have your daughter keep the udaya kunkuma nomu; her mangalyam will stand and she will live in comfort with pasupu and kumkuma.' And he vanished. They had her keep it. By the power of the vratam she was given a long-lived and handsome husband, and lived out her life as a muttaiduva.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు నలుగురు కుమార్తెలు. ముగ్గురికి పెళ్ళిళ్ళు చేయగా వారి భర్తలు చనిపోయి వారు విధవరాండ్రు అయ్యిరి. దంపతులు బాధపడుచుండిరి. ఈలోపల చిన్న కుమార్తె యుక్తవయస్కురాలైనది. అక్కలకు ప్రాప్తించిన వైధవ్యము ఈమెకును వచ్చునేమో అని భయపడుచు — 'కనీసము ఈమె మాంగల్యమైనా కాపాడు' అని ఆ బ్రాహ్మణుడు నిరంతరము మొరపెట్టుకొనేవాడు. ఒకరోజు పరమేశ్వరుడు సాధురూపమున వారింటికి వచ్చి — 'ఓ బ్రాహ్మణ దంపతులారా! మీ విచారమునకు కారణము నాకు తెలుసు. బాధపడకండి. మీ కుమార్తె చేత ఉదయ కుంకుమ నోము నోయించండి; ఆమె మాంగల్యము నిలిచి పసుపు కుంకుమలతో సుఖముగా జీవిస్తుంది' అని చెప్పి అంతర్ధానమయ్యెను. వారు అట్లే నోయించిరి. వ్రత ప్రభావమున ఆమెకు పూర్ణాయుష్కుడైన, అందమైనవాడు భర్తగా లభించెను; జీవితాంతము ముత్తయిదువుగా సుఖముగా జీవించినది."
      },
    udyapana: {
        roman: "After the year, one muttaiduva is given pasupu, flowers, ravikela gudda, dakshina and tambulam, and fed, and her blessing received.",
        deva: "",
        tel: "సంవత్సరము పూర్తయిన తరువాత ఒక ముత్తైదువకు పసుపు, పువ్వులు, రవికెల గుడ్డ, దక్షిణ తాంబూలము ఇచ్చి, భోజనము పెట్టి ఆమె ఆశీస్సులు పొందవలెను."
      },
    vayanam: {
        roman: "Pasupu, flowers, ravikela gudda, dakshina, tambulam.",
        deva: "",
        tel: "పసుపు, పువ్వులు, రవికెల గుడ్డ, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "nitya-sringaramu-nomu",
    deity: "devi",
    name: {
        roman: "Nitya Sringaramu Nomu",
        deva: "",
        tel: "నిత్యశృంగారము నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The undoing of poverty; the return of what was lost.",
        deva: "",
        tel: "దారిద్ర్య నివారణ; పోయిన రాజ్యము తిరిగి రావడము."
      },
    how: {
        roman: "Each day she herself places the bottu on a punyastri, shows her the mirror, and gives tambulam. It must NOT be done through servants — that is the whole point of this nomu.",
        deva: "",
        tel: "ప్రతిదినము ఒక పుణ్యస్త్రీకి తానే బొట్టుపెట్టి, అద్దము చూపించి, తాంబూలమివ్వవలెను. దాసీలచే పెట్టించరాదు — ఇదే ఈ నోము యొక్క మర్మము."
      },
    katha: {
        roman: "A king's wife and a minister's wife took up the nitya sringaram nomu. The minister's wife carefully placed the bottu on the perantalu herself and gave tambulam, completed the vratam entire, and became wealthy. The king's wife had servants place the bottu on the muttaiduvas, and became poor. Grieving at her state she prayed to Parvati Devi, who appeared and said: 'Carelessly you had servants place the bottu on the perantalu, and so you became poor. Keep that nomu now with care' — and vanished. From then the king's wife each day placed the bottu on a punyastri herself, showed her the mirror, gave tambulam, and when the year had passed did the udyapana. Then the kingdom her husband had lost came back to him.",
        deva: "",
        tel: "రాజుభార్య, మంత్రిభార్య నిత్యశృంగారపు నోము పట్టిరి. మంత్రిభార్య శ్రద్ధగా పేరంటాండ్రకు బొట్టుపెట్టి తాంబూలములనిచ్చి వ్రతము సాంతము చేసి ధనవంతురాలయ్యెను. రాజుభార్య ముత్తైదువులకు దాసీలచే బొట్టు పెట్టించుటచే దరిద్రవంతురాలయ్యెను. ఆమె తన దుర్దశకు దుఃఖించి పార్వతీదేవిని ప్రార్థింపగా ఆమె ప్రత్యక్షమై — 'నీవు అజాగ్రత్తగా దాసీలచే పేరంటాండ్రకు బొట్టు పెట్టించి దరిద్రురాలవైతివి. ఇప్పుడా నోమును జాగ్రత్తగా నోచుకొనుము' అని చెప్పి అంతర్ధానమయ్యెను. అప్పటినుండి ఆ రాజుభార్య ప్రతిదినము ఒక పుణ్యస్త్రీకి బొట్టుపెట్టి, అద్దము చూపించి, తాంబూలమిచ్చి, ఏడాది గడవగనే ఉద్యాపనము చేసుకొనెను. అంతట ఆమె భర్తకు పోయిన రాజ్యము తిరిగి ప్రాప్తించెను."
      },
    udyapana: {
        roman: "A punyastri is given talantu snanam, a saree and ravikela gudda, and after being fed is given a mirror, comb, katuka kaya, kumkuma bharini and sandalwood piece as vayanam.",
        deva: "",
        tel: "ఒక పుణ్యస్త్రీకి తలంటి నీళ్ళు పోసి, చీర రవికెలగుడ్డనిచ్చి, భోజనము పెట్టిన తరువాత అద్దము, దువ్వెన, కాటుకకాయ, కుంకుమభరిణ, గంధపుచెక్క వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Mirror, comb, katuka kaya, kumkuma bharini, sandalwood piece.",
        deva: "",
        tel: "అద్దము, దువ్వెన, కాటుకకాయ, కుంకుమభరిణ, గంధపుచెక్క."
      },
  },
  //
  {
    id: "nitya-vibhuti-nomu",
    deity: "shiva",
    name: {
        roman: "Nitya Vibhuti Nomu",
        deva: "",
        tel: "నిత్యవిభూతి నోము"
      },
    when: {
        roman: "Daily, for one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "Peace of mind, contentment, the wellbeing of the household.",
        deva: "",
        tel: "మనశ్శాంతి, సంతృప్తి, కుటుంబసౌఖ్యము."
      },
    how: {
        roman: "Each day a muttaiduva's hair is combed and the bottu placed; she is adorned with flowers and bangles as means allow, given tambulam, and namaskaram made to her.",
        deva: "",
        tel: "ప్రతిదినము ఒక ముత్తయిదువుకు తలదువ్వి బొట్టు పెట్టవలెను; శక్తిమేరకు పూలు, గాజులతో అలంకరించి, తాంబూలము ఇచ్చి నమస్కరించవలెను."
      },
    katha: {
        roman: "A young woman who, though she had every wealth, was ceaselessly discontented, was taught this nomu by her father. For a year she kept the rule of honouring a muttaiduva each day, adorning her and giving her tambulam. Peace of mind, contentment and the wellbeing of her household came to her.",
        deva: "",
        tel: "సంపదలన్నియు ఉన్నను నిరంతరము అసంతృప్తిగా ఉన్న ఒక యువతికి ఆమె తండ్రి ఈ నోమును తెలిపెను. రోజూ ఒక ముత్తయిదువును గౌరవించి, అలంకరించి, తాంబూలము ఇచ్చు నియమమును ఏడాది పాటించెను. ఆమెకు మనశ్శాంతి, సంతృప్తి, కుటుంబసౌఖ్యము కలిగినవి."
      },
    udyapana: {
        roman: "Five tambulams; five packets of vibhuti; sarees or ravikes; dakshina — puja is done in a Shiva temple and the vayanam given to five muttaiduvas. The vibhuti is offered in Shiva's presence.",
        deva: "",
        tel: "అయిదు తాంబూలములు; అయిదు విభూతి పొట్లములు; చీరలు లేక రవికెలు; దక్షిణ — అయిదుగురు ముత్తయిదువులకు శివాలయమున పూజ చేసి వాయనము ఇవ్వవలెను. విభూతిని శివసన్నిధిలో సమర్పించవలెను."
      },
    vayanam: {
        roman: "Tambulam, vibhuti, saree or ravike, dakshina.",
        deva: "",
        tel: "తాంబూలము, విభూతి, చీర లేక రవికె, దక్షిణ."
      },
  },
  //
  {
    id: "nitya-danamu-nomu",
    deity: "devi",
    name: {
        roman: "Nitya Danamu Nomu",
        deva: "",
        tel: "నిత్యదానము నోము"
      },
    when: {
        roman: "Daily, one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "Relief from ajirna; expiation of the fault of miserliness carried from a former birth.",
        deva: "",
        tel: "అజీర్ణ నివారణ; పూర్వజన్మ పిసినితనపు దోష పరిహారము."
      },
    how: {
        roman: "Each day a double handful of grain and one vegetable are given in dana to a brahmana.",
        deva: "",
        tel: "ప్రతిదినము ఒక బ్రాహ్మణునకు దోసెడు ధాన్యమును, ఒక కూరను దానము చేయవలెను."
      },
    katha: {
        roman: "A king suffered from ajirna; however many medicines he took, health did not come. Then a brahmana came to the city singing loudly, 'What is born is the witness of what is given.' The king, on the fort tower, heard the words, had him brought to the court and asked why he said so. The brahmana said: 'Raja, you yourself are the proof of my words. In a former birth you gathered wealth and neither ate it yourself nor gave it to others, but were a miser. The fruit of that papam has now come to you as ajirna. To be rid of it, do nitya danam.' From then the king did nitya danam for one year, then did the udyapana, and lived in comfort.",
        deva: "",
        tel: "ఒక రాజు అజీర్ణవ్యాధితో బాధపడుచుండెను; ఎన్ని మందులు తినిననూ ఆరోగ్యము చేకూరలేదు. అట్లుండగా ఒక బ్రాహ్మణుడు పట్టణమునకు వచ్చి 'పెట్టినవారికి పుట్టినదే సాక్షి' అని గట్టిగా పాడుచుండెను. కోటబురుజు మీదున్న రాజు ఆ మాటలు విని అతనిని దివాణములోనికి రప్పించి అట్లేల అనెనో చెప్పమనెను. అంతట బ్రాహ్మణుడు — 'రాజా! నా మాటలకు నీవే నిదర్శనము. పూర్వజన్మలో నీవు ధనము కూడబెట్టి నీవు తినక, ఇతరులకు పెట్టక పిసినిగొట్టువై ఉంటివి. ఆ పాపఫలమే ఇప్పుడు నీకు అజీర్ణవ్యాధిగా వచ్చినది. ఆ వ్యాధి పోవుటకు నీవు నిత్యదానము చేయుము' అని చెప్పెను. అప్పటినుండి రాజు నిత్యదానము ఒక యేడాదిపాటు చేసి, పిమ్మట ఉద్యాపనము చేసుకొని సుఖముగా ఉండెను."
      },
    udyapana: {
        roman: "Eight kunchams of grain untrodden by oxen are poured into a basket, wrapped with new cloth, with vegetables, root vegetables and greens placed in it, and given in dana to a brahmana with dakshina according to means. 'Though the means be less, the fruit is not less.'",
        deva: "",
        tel: "ఎద్దు తొక్కని ధాన్యము ఎనిమిది కుంచములు ఒక గంపలో పోసి, క్రొత్తబట్ట చుట్టి, కాయగూరలు, దుంపకూరలు, ఆకుకూరలు దానిలో పెట్టి, శక్తికొలది దక్షిణతో ఒక బ్రాహ్మణునకు దానము చేయవలెను. 'శక్తి తగ్గిననూ ఫలము తగ్గదు.'"
      },
    vayanam: {
        roman: "Grain, vegetables, dakshina.",
        deva: "",
        tel: "ధాన్యము, కూరలు, దక్షిణ."
      },
  },
  //
  {
    id: "chiluku-muggula-nomu",
    deity: "devi",
    name: {
        roman: "Chiluku Muggula Nomu",
        deva: "",
        tel: "చిలుకు ముగ్గుల నోము"
      },
    when: {
        roman: "Five years.",
        deva: "",
        tel: "అయిదు సంవత్సరములు."
      },
    forwhat: {
        roman: "The removal of fault; nitya sowbhagyam. Giving is the chief rule of this nomu.",
        deva: "",
        tel: "దోష నివారణ; నిత్యసౌభాగ్యము. దానధర్మమే ఈ నోములో ప్రధాన నియమము."
      },
    how: {
        roman: "A muggu is drawn in the shape of a parrot. Lakshmi and Narayana are worshipped. Chalimidi is made, one part given to a brahmana and the rest distributed as prasadam. Each year muttaiduvas and brahmanas are fed according to means.",
        deva: "",
        tel: "చిలుక ఆకారములో ముగ్గు వేయవలెను. లక్ష్మీనారాయణులను పూజించవలెను. చలిమిడి చేసి ఒక భాగము బ్రాహ్మణునికి, మిగిలినది ప్రసాదముగా పంచవలెను. ప్రతి సంవత్సరము శక్తిమేరకు ముత్తయిదువులకు, బ్రాహ్మణులకు భోజనము పెట్టవలెను."
      },
    katha: {
        roman: "The parents of a girl named Narayanamma learned that the fault of widowhood lay on her. They married her to an image of Krishna, and that image too broke. After her parents died she lived alone, praying to Vishnu; but she gave nothing to anyone. Vishnu told her that the fruit of her merit was not complete because she had no dana in her. Afterwards, while keeping the chiluku muggula nomu, Lakshmi Devi poured out to Narayanamma a single drop of the fruit of that vratam. With it her faults were lifted and nitya sowbhagyam came to her.",
        deva: "",
        tel: "నారాయణమ్మ అను బాలికకు వైధవ్యదోషమున్నదని తల్లిదండ్రులు తెలిసికొనిరి. ఆమెను కృష్ణవిగ్రహమునకు వివాహము చేయగా ఆ విగ్రహము కూడ విరిగిపోయెను. తల్లిదండ్రులు మరణించిన తరువాత ఆమె విష్ణువును ప్రార్థించుచు ఒంటరిగా జీవించెను; కానీ ఎవరికిని దానము చేయలేదు. విష్ణువు — ఆమెకు దానధర్మము లేనందుననే పుణ్యఫలము సంపూర్ణము కాలేదని తెలిపెను. తరువాత లక్ష్మీదేవి చిలుక ముగ్గుల నోము చేయునపుడు నారాయణమ్మకు ఒక బిందువు వ్రతఫలమును ధారపోసెను. దాంతో ఆమె దోషములు తొలగి నిత్యసౌభాగ్యమును పొందెను."
      },
    udyapana: {
        roman: "In the fifth year — chalimidi from five manikas of rice; appalu from rice; a saree and ravike for five muttaiduvas; a meal for fifteen brahmanas; fifteen kalashams; fifteen angavastrams; dakshina and tambulam. Another recension gives fifteen kalashams, lamps of fifteen wicks, muggulu, and the dana of a tulasi-kota in silver or another metal.",
        deva: "",
        tel: "అయిదవ సంవత్సరమున — అయిదు మానికల బియ్యముతో చలిమిడి; బియ్యముతో అప్పాలు; అయిదుగురు ముత్తయిదువులకు చీర, రవికె; పదిహేనుమంది బ్రాహ్మణులకు భోజనము; పదిహేను కలశములు; పదిహేను అంగవస్త్రములు; దక్షిణ తాంబూలము. మరొక పాఠమున పదిహేను కలశములు, పదిహేను వత్తుల దీపములు, ముగ్గులు, వెండి లేక లోహపు తులసికోట దానము చెప్పబడినది."
      },
    vayanam: {
        roman: "Chalimidi, appalu, saree, ravike, kalashams, angavastrams, dakshina, tambulam.",
        deva: "",
        tel: "చలిమిడి, అప్పాలు, చీర, రవికె, కలశములు, అంగవస్త్రములు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "grama-kunkuma-nomu",
    deity: "devi",
    name: {
        roman: "Grama Kunkuma Nomu",
        deva: "",
        tel: "గ్రామకుంకుమ నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "Bringing the husband out from mortal danger.",
        deva: "",
        tel: "భర్తను గండముల నుండి బయటపడవేయుట."
      },
    how: {
        roman: "Taking fruit, pasupu and kumkuma, she distributes them street by street. Once begun, the distribution must not be stopped until it is complete — that is the whole point of this nomu.",
        deva: "",
        tel: "పండ్లు, పసుపు, కుంకుమ పట్టుకొని వీధివీధులలో పంచిపెట్టవలెను. మొదలుపెట్టిన పంపకము పూర్తియగువరకు ఆగరాదు — ఇదే ఈ నోము యొక్క మర్మము."
      },
    katha: {
        roman: "A brahmana was under mortal danger. His wife kept the grama kunkuma nomu and, in due form, took fruit, pasupu and kumkuma and began distributing them street by street. As she was distributing in the first street the eldest son came and said his father was ill; she said, 'There is another street.' In the second street the second son came and said the illness had worsened; 'There is another street.' In the third, the third son said his life was in danger; 'There is another street.' In the fourth, the fourth son said they had laid his father on the ground; 'There is only one more street.' As she was distributing in the fifth street the fifth son came and said he had died; but she did not go home until the whole street had been given to. When she reached home, the husband who had died had risen and was sitting up.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు ప్రాణగండము ఉండెను. అతని భార్య గ్రామకుంకుమ నోము నోచి, యథావిధిగా పండ్లు, పసుపు, కుంకుమ పట్టుకొని వీధివీధులలో పంచిపెట్టసాగెను. మొదటి వీధిలో పంచిపెట్టుచుండగా పెద్దకొడుకు వచ్చి తండ్రికి జబ్బుగా ఉన్నదని తెలిపెను; ఆమె 'ఇంకో వీధి ఉన్నది' అనెను. రెండవ వీధిలో పంచుచుండగా రెండవ కొడుకు వచ్చి రోగము ముదిరిపోయినదని చెప్పెను; 'ఇంకొక వీధి ఉన్నది' అనెను. మూడవ వీధిలో మూడవకొడుకు వచ్చి ప్రాణము మీదకు వచ్చెనని చెప్పెను; 'ఇంకొక వీధి ఉన్నది' అనెను. నాలుగవ వీధిలో నాలుగవ కొడుకు వచ్చి తండ్రిని క్రింద పెట్టినట్లు చెప్పెను; 'ఇంకొక వీధి మాత్రమున్నది' అనెను. అయిదవ వీధిలో పంచుచుండగా అయిదవ కొడుకు వచ్చి చనిపోయినట్లు చెప్పెను; కానీ ఆమె వీధి అంతయు పంచిపెట్టువరకు ఇంటికి వెళ్ళలేదు. ఆమె ఇంటికి వెళ్ళేసరికి చచ్చిన మగడు బ్రతికి లేచి కూర్చుండెను."
      },
    udyapana: {
        roman: "Pasupu and kumkuma, at the rate of a visa and ebulam, are mixed with fruit and distributed through the village.",
        deva: "",
        tel: "పసుపు, కుంకుమలు వీసె ఏబులము చొప్పున పండ్లతో కలిపి గ్రామములో పంచిపెట్టవలెను."
      },
    vayanam: {
        roman: "Pasupu, kumkuma and fruit — to the village.",
        deva: "",
        tel: "పసుపు, కుంకుమ, పండ్లు — గ్రామమునకు."
      },
  },
  //
  {
    id: "shaka-danamu-nomu",
    deity: "devi",
    name: {
        roman: "Shaka Danamu Nomu",
        deva: "",
        tel: "శాకదానము నోము"
      },
    when: {
        roman: "Daily, one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "Relief from grief without cause.",
        deva: "",
        tel: "అకారణ శోక నివారణ."
      },
    how: {
        roman: "Each day one totakura stalk and one dabbu are given in dana. Doing it once a year instead is itself the transgression.",
        deva: "",
        tel: "ప్రతిదినము ఒక తోటకూర కాడ, ఒక డబ్బు చొప్పున దానము చేయవలెను. సంవత్సరమునకు ఒకసారి చేయుట ఉల్లంఘనమే."
      },
    katha: {
        roman: "A king's wife and a minister's wife in one town took up the shaka danam nomu. The minister's wife gave each day one totakura stalk and one dabbu, for a year, and lived in gladness. The king's wife did the shaka danam only once in the year; and because that was a transgression, grief without cause came to her. She laid the matter before Parvati Devi, who gave the word: 'Trouble came because you took up the shaka danam nomu and transgressed it. Therefore keep that nomu in due form.' Afterwards she kept it properly and lived in comfort, free of grief.",
        deva: "",
        tel: "ఒక ఊరి రాజుభార్య, మంత్రిభార్య శాకదానము నోము పట్టిరి. మంత్రిభార్య ప్రతిదినము ఒక తోటకూర కాడ, ఒక డబ్బు చొప్పున ఏడాది దానము చేస్తూ సంతోషముగా ఉండెను. రాజుభార్య సంవత్సరమునకు ఒకసారే శాకదానము చేసెను; అది ఉల్లంఘన అగుటచే ఆమెకు అకారణ శోకము వచ్చెను. ఆమె ఆ విషయమును పార్వతీదేవికి విన్నపించుకొనగా — 'నీవు శాకదానము నోము పట్టి ఉల్లంఘన చేయుటచే కష్టము వచ్చెను. కావున ఆ నోము యథావిధిగా నోచుకొమ్ము' అని ఆజ్ఞ ఇచ్చెను. పిమ్మట ఆమె ఆ నోము సక్రమముగా నోచుకొని శోకము లేకుండా సుఖముగా ఉండెను."
      },
    udyapana: {
        roman: "A brahmana is given talantu snanam and a jamaru, and totakura plants from the field are brought and given as vayanam with thirteen dabbulu as dakshina.",
        deva: "",
        tel: "ఒక బ్రాహ్మణునకు తలంటి నీళ్ళు పోసి, జామారు కట్టబెట్టి, మడిలోని తోటకూర మొక్కలను తెచ్చి పదమూడు డబ్బులు దక్షిణతో వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Totakura plants, thirteen dabbulu.",
        deva: "",
        tel: "తోటకూర మొక్కలు, పదమూడు డబ్బులు."
      },
  },
  //
  {
    id: "angaragala-nomu",
    deity: "devi",
    name: {
        roman: "Angaragala Nomu",
        deva: "",
        tel: "అంగరాగాల నోము"
      },
    when: {
        roman: "A nomu for young women.",
        deva: "",
        tel: "యువతులు చేయవలసిన నోము."
      },
    forwhat: {
        roman: "Beauty, gladness, sirisampada, pasupu-kumkuma, sowbhagyam, cattle and crops, progeny — as the nomu's own refrain has it.",
        deva: "",
        tel: "అందము, ఆనందము, సిరిసంపద, పసుపు కుంకుమ, సౌభాగ్యము, పాడిపంటలు, పుత్రపౌత్రాభివృద్ధి — 'అంగరాగాల నోము అనుభవాల గీము.'"
      },
    how: {
        roman: "Akshatalu on the head; then five each of bottu-pettelu, katuka bharinelu, kumkuma bharinelu, combs, savaramulu, agarbatti bundles, sandalwood pieces, nallapusalu, gold flowers, mirrors and sarees.",
        deva: "",
        tel: "పవిత్రాక్షతలు శిరసున వేసుకొని — అయిదు బొట్టుపెట్టెలు, అయిదు కాటుక భరిణెలు, అయిదు కుంకుమ భరిణెలు, అయిదు దువ్వెనలు, అయిదు సవరములు, అయిదు అగరవత్తుల కట్టలు, అయిదు గంధపు చెక్కలు, అయిదు నల్లపూసలు, అయిదు బంగారు పూలు, అయిదు అద్దములు, అయిదు చీరలు తెప్పించవలెను."
      },
    katha: {
        roman: "This nomu has no narrative katha but a paata (song), and that song is itself its transmission.",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; పాట ఉన్నది. ఆ పాటయే ఈ నోము యొక్క సంప్రదాయ ప్రసారము."
      },
    udyapana: {
        roman: "Five suvasini women are invited, given talantu snanam, fed with pancabhakshya paramannam, and given dakshina, tambulam and vayanam with shraddha and bhakti.",
        deva: "",
        tel: "అయిదుగురు సువాసినీ స్త్రీలను పిలిచి తలంటి నీళ్ళు పోసి, పంచభక్ష్య పరమాన్నాలతో భోజనము పెట్టి, శ్రద్ధాభక్తులతో దక్షిణ, తాంబూలము, వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "The fivefold set of adornment articles named above.",
        deva: "",
        tel: "పైన చెప్పిన అయిదేసి అలంకార సామగ్రి."
      },
  },
  //
  {
    id: "mooga-nomu",
    deity: "devi",
    name: {
        roman: "Mooga Nomu",
        deva: "",
        tel: "మూగనోము"
      },
    when: {
        roman: "From Ashwina krishna amavasya to Kartika shuddha purnima; for three years.",
        deva: "",
        tel: "ఆశ్వయుజ బహుళ అమావాస్య మొదలు కార్తీక శుద్ధ పూర్ణిమ వరకు; మూడు సంవత్సరములు."
      },
    forwhat: {
        roman: "For the woman who sets the padmam, aidavatanam for ten thousand years; for her who lays the muggu, three thousand.",
        deva: "",
        tel: "పద్మము పెట్టిన చానకు పదివేల యేండ్లు అయిదవతనము; ముగ్గు పెట్టిన చానకు మూడువేల యేండ్లు."
      },
    how: {
        roman: "Three meals are taken; at evening a kaṇṭha-snanam and purification. In the first year, four padmas are set at the tulasi, a lamp of four wicks lit, the bottu placed on four muttaiduvas WITHOUT SPEAKING, and four stars counted. In the second year eight; in the third twelve. The nomu song is sung while making pradakshinam of Tulasamma, and akshatalu placed.",
        deva: "",
        tel: "మూడు పూటలు భోజనము చేసి, సాయంకాలమున కంఠస్నానము చేసి శుచియై — తొలియేట తులసి వద్ద నాలుగు పద్మములు పెట్టి, నాలుగు వత్తుల దీపము పెట్టి, మాట్లాడకుండా నలుగురు ముత్తయిదువులకు బొట్టుపెట్టి, నాలుగు నక్షత్రములు లెక్కపెట్టవలెను. రెండవయేట ఎనిమిది; మూడవయేట పండ్రెండు. నోము పాట పాడుచు తులసమ్మకు ప్రదక్షిణలు చేసి అక్షింతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "This nomu has no narrative katha but a song. It names, one after another, the hours of the house — the hour when flowers bloom, when water is fetched, when the evening lamp is set, when the cows come in, when the brothers mount their palanquins, when the daughters-in-law pound the turmeric, when the younger sister ties marigolds in her hair — and closes: her sweet face is like a beloved's, her own face like a lotus.",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; పాట ఉన్నది — పూలు పూసేటి వేళ, ఉదకము తెచ్చేటి వేళ, దీపము పెట్టేటి వేళ, ఆవులు గోవులు వచ్చేటి వేళ, అన్నలు అందలాలెక్కేటి వేళ, కోడళ్ళు కొట్టుపసుపు కొట్టేటి వేళ, చెల్లెలు చేమంతులు ముడిచేటి వేళ — అని ఇంటి పనుల వేళలను వరుసగా పాడుచు, 'ముద్దు మొగము ముద్దానిబోలు, తన మొఖము తామర పద్మాన్నిబోలు' అని ముగించును."
      },
    udyapana: {
        roman: "In the first year, four atlu each are given as vayanam to four muttaiduvas, with dakshina, tambulam, nallapusalu and lakka jodu. Eight in the second year, twelve in the third. The girl who keeps the nomu holds two atlu and two coins on her two hands and two atlu and two coins on her two feet; her brother calls from behind the door; she answers 'come now'; he comes, gives four taps with a book, and takes the four atlu and four coins.",
        deva: "",
        tel: "తొలియేట నలుగురు ముత్తయిదువులకు నాలుగేసి అట్లు వాయనమిచ్చి, దక్షిణ తాంబూలము, నల్లపూసలు, లక్కజోడు ఇవ్వవలెను. రెండవయేట ఎనిమిది, మూడవయేట పండ్రెండు వాయనములు. నోము పట్టిన కన్య రెండు చేతులమీద రెండు అట్లు, రెండు డబ్బులు; రెండు కాళ్ళమీద రెండు అట్లు, రెండు డబ్బులు ఉంచుకొనగా — అన్నగారు తలుపు వెనుకనుండి పిలుపు పలుకును; ఆమె 'ఇప్పుడే రమ్ము' అనవలెను; అన్న వచ్చి పుస్తకముతో నాలుగు దెబ్బలు కొట్టి నాలుగు అట్లు, నాలుగు డబ్బులు తీసుకొనవలెను."
      },
    vayanam: {
        roman: "Atlu, coins, dakshina, tambulam, nallapusalu, lakka jodu.",
        deva: "",
        tel: "అట్లు, డబ్బులు, దక్షిణ తాంబూలము, నల్లపూసలు, లక్కజోడు."
      },
  },
  //
  {
    id: "gudise-nomu",
    deity: "devi",
    name: {
        roman: "Gudise Nomu",
        deva: "",
        tel: "గుడిసె నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "In the town where the gudise nomu is kept, search as you will, there is no widow.",
        deva: "",
        tel: "గొడిసె నోము పట్టిన పట్టణములో వెదకిచూచినను విధవ లేదు."
      },
    how: {
        roman: "The katha is told and akshatalu placed for a year, and through the year the restriction is kept of not eating tamarind.",
        deva: "",
        tel: "ఏడాది కథ చెప్పి అక్షింతలు వేసుకొని, ఏడాది పొడుగునా చింతపండు తినకుండా నియమము జరుపవలెను."
      },
    katha: {
        roman: "This nomu has no extended katha; the restriction itself is what matters.",
        deva: "",
        tel: "ఈ నోమునకు విస్తారమైన కథ లేదు; నియమమే ప్రధానము."
      },
    udyapana: {
        roman: "When the year is complete, thirteen muttaiduvas are given thirteen ravikela guddalu, dakshina and tambulam, and pulihora made from thirteen manikas of rice, placed in thirteen mookullu, as vayanam.",
        deva: "",
        tel: "సంవత్సరము పూర్తియైన పిమ్మట పదముగ్గురు ముత్తయిదువులకు పదమూడు రవికెలగుడ్డలు, దక్షిణ తాంబూలము, పదమూడు మానికెల బియ్యము పులిహోర చేసి పదమూడు మూకుళ్ళలో పెట్టి వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Pulihora, ravikela guddalu, dakshina, tambulam.",
        deva: "",
        tel: "పులిహోర, రవికెలగుడ్డలు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "bommala-nomu",
    deity: "devi",
    name: {
        roman: "Bommala Nomu",
        deva: "",
        tel: "బొమ్మల నోము"
      },
    when: {
        roman: "The Dasara navaratris; or a year, according to the family's practice.",
        deva: "",
        tel: "దసరా నవరాత్రులు; లేక కుటుంబాచారము ప్రకారము ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "To teach girls devotion, the running of a household, adornment, hospitality and sharing; good children; the wellbeing of the household.",
        deva: "",
        tel: "ఆడపిల్లలకు దైవభక్తి, గృహనిర్వహణ, అలంకరణ, ఆతిథ్యము, పంచుకొనుట నేర్పుట; సత్సంతానము; కుటుంబసౌఖ్యము."
      },
    how: {
        roman: "The dolls are arranged on a peetham or on tiers — the deity dolls on the upper steps, the rest below. Gauri Devi or Bala Tripurasundari is worshipped, naivedyam offered to the dolls, the katha read and akshatalu placed. Each day muttaiduvas and unmarried girls are invited and given pasupu, kumkuma, fruit and tambulam.",
        deva: "",
        tel: "పీట లేదా మెట్లపై బొమ్మలను అమర్చవలెను — దేవతా బొమ్మలు పైమెట్లలో, మిగిలినవి క్రిందిమెట్లలో. గౌరీదేవి లేక బాలాత్రిపురసుందరిని పూజించి, బొమ్మలకు నైవేద్యము సమర్పించి, కథ చదివి అక్షతలు వేసుకొనవలెను. ప్రతిదినము ముత్తయిదువులను, కన్యలను పిలిచి పసుపు, కుంకుమ, పండు, తాంబూలము ఇవ్వవలెను."
      },
    katha: {
        roman: "From childhood a girl regarded her dolls as devatas and worshipped them, offering them even the prasadam that came to her. Her stepmother mocked her — 'these are only toys; what worship is this?' — and one day pushed the dolls aside with a broom. From that moment the wealth of the house began to fall away. The girl prayed to Gauri Devi in grief, and the mother appeared and said: 'Even dolls, worshipped with bhakti, become the seat of the divine; and with those who mock, wealth does not stay' — and directed the bommala nomu. The girl completed it and wealth settled again in the house; and the stepmother, recognising her fault, cared for her as her own child.",
        deva: "",
        tel: "ఒక బాలిక చిన్నతనమునుండి బొమ్మలను దేవతలుగా భావించి పూజించుచు, తనకు లభించిన ప్రసాదమును కూడ వాటికి నైవేద్యముగా పెట్టుచుండెడిది. ఆమె సవతితల్లి — 'ఇవన్నియు ఆటబొమ్మలే, వీటికి పూజ ఏమిటి?' అని హేళన చేసి, ఒకనాడు ఆ బొమ్మలను చీపురుతో తోసివేసెను. ఆ క్షణమునుండి ఇంట సిరి తగ్గసాగెను. బాలిక దుఃఖించుచు గౌరీదేవిని ప్రార్థింపగా ఆ తల్లి ప్రత్యక్షమై — 'బొమ్మలైనను భక్తితో పూజించినచో దైవమే అందు కొలువుండును; అవహేళన చేసినవారికి సిరి నిలువదు' అని చెప్పి బొమ్మల నోమును సూచించెను. బాలిక నోము పూర్తి చేయగా ఇంట సంపద తిరిగి నెలకొనెను; సవతితల్లియు తన తప్పును తెలిసికొని ఆమెను సొంత బిడ్డవలె చూచుకొనెను."
      },
    udyapana: {
        roman: "On the last day a special puja is made to the dolls, and a pair of new dolls — usually a dampatula pair — with a saree, ravike, pasupu, kumkuma, bangles, fruit, pindivantalu, dakshina and tambulam, is given as vayanam to a muttaiduva or an unmarried girl. It is the practice to keep the dolls safely and set them out again the next year.",
        deva: "",
        tel: "చివరి దినమున బొమ్మలకు ప్రత్యేక పూజ చేసి — ఒక జత క్రొత్త బొమ్మలు (సాధారణముగా దంపతుల బొమ్మలు), చీర, రవికె, పసుపు, కుంకుమ, గాజులు, పండ్లు, పిండివంటలు, దక్షిణ తాంబూలము — ఒక ముత్తయిదువుకు లేక కన్యకు వాయనము ఇవ్వవలెను. బొమ్మలను భద్రపరచి మరుసటి సంవత్సరము తిరిగి అమర్చుట సంప్రదాయము."
      },
    vayanam: {
        roman: "A pair of new dolls, saree, ravike, pasupu, kumkuma, bangles, fruit, pindivantalu, dakshina, tambulam.",
        deva: "",
        tel: "క్రొత్త బొమ్మల జత, చీర, రవికె, పసుపు, కుంకుమ, గాజులు, పండ్లు, పిండివంటలు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "perugumida-perineyyi-nomu",
    deity: "devi",
    name: {
        roman: "Perugumida Perineyyi Nomu",
        deva: "",
        tel: "పెరుగుమీద పేరినెయ్యి నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The lifting of an aversion to milk foods; the wellbeing of the household.",
        deva: "",
        tel: "పాలపదార్థముల యెడ అసహ్యము తొలగుట; కుటుంబసౌఖ్యము."
      },
    how: {
        roman: "Each day for a year, surya-namaskaram.",
        deva: "",
        tel: "ఒక సంవత్సరము ప్రతిదినము సూర్యనమస్కారము చేయవలెను."
      },
    katha: {
        roman: "A girl felt disgust at milk, curd, butter and ghee alike. A swami told her that in a former birth she had poured away the milk foods that were left over rather than share them with anyone, and directed her, as the remedy for that fault, to give curd and ghee in dana. After she completed the nomu she was able to take milk foods as prasadam, and the wellbeing of her household came to her.",
        deva: "",
        tel: "ఒక బాలికకు పాలు, పెరుగు, వెన్న, నెయ్యి అన్నను అసహ్యము. ఒక స్వామి — ఆమె పూర్వజన్మలో మిగిలిన పాలపదార్థములను ఎవరికిని పంచకుండా పారబోసినదని చెప్పి, ఆ దోష నివారణకు పెరుగు-నెయ్యి దానము చేయుమని సూచించెను. ఆమె నోము పూర్తి చేసిన తరువాత పాలపదార్థములను ప్రసాదముగా స్వీకరించగలిగెను; కుటుంబసౌఖ్యము పొందెను."
      },
    udyapana: {
        roman: "On the closing day cow's milk is boiled and set for curd. On the thick curd a lump of cow ghee is placed. With the curd vessel, a ravike, pasupu, kumkuma, tambulam and dakshina are given to a muttaiduva.",
        deva: "",
        tel: "ముగింపు దినమున ఆవుపాలను కాచి పెరుగు తోడుపెట్టవలెను. గట్టి పెరుగుపైన ఆవునెయ్యి ముద్ద పెట్టవలెను. పెరుగు పాత్రతోపాటు రవికె, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ ఒక ముత్తయిదువుకు ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Ghee set upon curd, ravike, pasupu, kumkuma, tambulam, dakshina.",
        deva: "",
        tel: "పెరుగుమీద పేరిన నెయ్యి, రవికె, పసుపు, కుంకుమ, తాంబూలము, దక్షిణ."
      },
  },
  //
  {
    id: "pendli-gummadi-nomu",
    deity: "devi",
    name: {
        roman: "Pendli Gummadi Nomu",
        deva: "",
        tel: "పెండ్లి గుమ్మడి నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "Herds, a great harvest, the play of children, an elder's protection, granaries of paddy, auspicious occasions, nitya kalyanam.",
        deva: "",
        tel: "గొల్ల మంద, గొప్ప పంట, బిడ్డల ఆటలు, పెద్ద దిక్కు, వడ్ల గరిసెలు, శుభకార్యములు, నిత్యకల్యాణములు."
      },
    how: {
        roman: "",
        deva: "",
        tel: ""
      },
    katha: {
        roman: "This nomu has no narrative katha but a verse — 'the pendli gummadi nomu, the eldest sister kept it…'",
        deva: "",
        tel: "ఈ నోమునకు కథ లేదు; పద్యమే ఉన్నది — 'పెండ్లిగుమ్మడి నోము పెద్దక్క నోచింది…'"
      },
    udyapana: {
        roman: "Three gummadi fruits are brought. One is given in dana with manedu soledu of rice to a brahmana at his own house, and he is asked to come to her house to receive the vayanam of the pendli gauri nomu she has kept. After he comes, the second fruit is given with addedu tavvedu of rice, dakshina and tambulam, with namaskaram. Then the third fruit with five sers of rice is taken as svayampakam to that brahmana's wife, and the meal taken there that day.",
        deva: "",
        tel: "మూడు గుమ్మడి పండ్లు తెచ్చి, ఒకదానిని మానెడు సోలెడు బియ్యముతో బ్రాహ్మణునకు అతని ఇంటి దగ్గర దానమిచ్చి, తాను పెండ్లిగౌరి నోము నోచి ఇచ్చెడి వాయనమును పుచ్చుకొనుటకు ఆయనను తన ఇంటికి రమ్మనవలెను. అతను వచ్చిన పిమ్మట రెండవ పండును అడ్డెడు తవ్వెడు బియ్యముతో దక్షిణ తాంబూల సహితముగా ఇచ్చి నమస్కరించవలెను. తరువాత మూడవ పండును అయిదు శేర్ల బియ్యముతో స్వయంపాకముగా పట్టుకొనివెళ్ళి ఆ బ్రాహ్మణుని భార్యకిచ్చి ఆనాడు అచట భోజనము చేయవలెను."
      },
    vayanam: {
        roman: "Three gummadi fruits, rice, dakshina, tambulam.",
        deva: "",
        tel: "మూడు గుమ్మడి పండ్లు, బియ్యము, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "nitya-dhanyamu-nomu",
    deity: "devi",
    name: {
        roman: "Nitya Dhanyamu Nomu",
        deva: "",
        tel: "నిత్యధాన్యము నోము"
      },
    when: {
        roman: "Daily, for one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "Relief from ajirna; expiation of the fault of having hoarded grain in a former birth.",
        deva: "",
        tel: "అజీర్ణ నివారణ; పూర్వజన్మలో ధాన్యము దాచిన దోష పరిహారము."
      },
    how: {
        roman: "Each day a double handful of grain and one vegetable are given in dana. The katha is read and akshatalu placed.",
        deva: "",
        tel: "ప్రతిదినము ఒక దోసెడు ధాన్యము, ఒక కూరగాయ దానము చేయవలెను. కథ చదివి అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "A king who had every wealth suffered from ajirna and could not eat. An old brahmana told him the cause was the papam of a former birth, in which, having wealth, he had fed no one and hoarded the grain. He directed him to give grain and vegetables in dana each day. The king gave for a year, did the udyapana, and regained his health.",
        deva: "",
        tel: "సకల సంపదలున్న ఒక రాజు అజీర్ణరోగముతో అన్నము తినలేక బాధపడెను. పూర్వజన్మలో సంపద ఉన్నను ఎవరికిని అన్నము పెట్టక ధాన్యమును దాచిన పాపమే కారణమని ఒక వృద్ధ బ్రాహ్మణుడు తెలిపెను. రోజూ ధాన్యము, కూరగాయలు దానము చేయుమని సూచించెను. రాజు ఏడాది దానము చేసి ఉద్యాపన చేయగా ఆరోగ్యము పొందెను."
      },
    udyapana: {
        roman: "Grain untrodden by oxen — eighty kunchams in the old text — with a gold thread about it, new cloth, vegetables, root vegetables, the materials for pindivantalu, ghee, buttermilk, dakshina and tambulam — given in dana to a brahmana who is a good householder.",
        deva: "",
        tel: "ఎద్దు తొక్కని ధాన్యము — పాత గ్రంథమున ఎనుబది కుంచాలు — దాని చుట్టూ బంగారు తీగ, క్రొత్త వస్త్రములు, కూరగాయలు, దుంపలు, పిండివంటల సామగ్రి, నెయ్యి, మజ్జిగ, దక్షిణ తాంబూలము — వీటిని సద్గృహస్థుడైన బ్రాహ్మణునికి దానము చేయవలెను."
      },
    vayanam: {
        roman: "Grain, vegetables, cloth, ghee, buttermilk, dakshina, tambulam.",
        deva: "",
        tel: "ధాన్యము, కూరగాయలు, వస్త్రములు, నెయ్యి, మజ్జిగ, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "ganeshuni-nomu",
    deity: "ganesha",
    name: {
        roman: "Ganeshuni Nomu",
        deva: "",
        tel: "గణేశుని నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The lifting of weeping without cause.",
        deva: "",
        tel: "కారణము లేని ఏడుపు తొలగుట."
      },
    how: {
        roman: "The nomu is taken up, akshatalu placed for a year, and the udyapana done.",
        deva: "",
        tel: "ఈ నోము పట్టి ఏడాది అక్షింతలు వేసుకొని ఉద్యాపన చేయవలెను."
      },
    katha: {
        roman: "A brahmana's wife took up the Ganesha nomu and transgressed it. For the taking up, Ganesha gave her wealth; for the transgression he laid on her a grief without measure. So each day, after cooking and feeding her sons and daughters, she would sit in a corner and weep. Ignoring what the townspeople said, she went into the forest and began weeping there. One day Parvati and Parameshwara came and asked the cause. 'By your grace I have every wealth; for some reason the mind keeps turning to weeping.' Then they said: 'Take a crawling snake, put it on your son's cot; it will bite him; then you may weep.' She did so; and when the eldest son came and looked at the cot, there lay a golden chain. 'Alas — this has not given me cause to weep' — and that night she sat weeping again. They came again: 'Take a scorpion and put it in your daughter's kumkuma bharini.' She did; and next morning, when the daughter put in her hand for the bottu, she found a bindi of pearls. Weeping still, she was told: 'Kill the cat you have reared, hold it in your lap and weep.' The townspeople came and asked, and as she wept the harder her tears fell on it, and it became a golden cat and sprang down from her lap. Then Parvati and Parameshwara said: 'Woman, it is because you took up the Ganesha nomu and transgressed it that you grieve. Take up this nomu, place akshatalu for a year and do the udyapana, and your weeping will go.'",
        deva: "",
        tel: "ఒక బ్రాహ్మణుని భార్య గణేశుని నోముపట్టి ఉల్లంఘనము చేసెను. నోము పట్టినందుకు గణేశుడు ఆమెకు సిరిసంపదలిచ్చెను; ఉల్లంఘనము చేసినందుకు మితిలేని శోకము పెట్టెను. అందుచేత ప్రతిరోజూ కొడుకులకు కూతుళ్ళకు వండిపెట్టిన తరువాత ఆమె ఒకచోట కూర్చుండి ఏడ్చుచుండెను. ఊరివారు కూతలు వేయగా వినక అడవిలోనికి పోయి అక్కడ ఏడుపు మొదలుపెట్టెను. ఒకనాడు పార్వతీపరమేశ్వరులు వచ్చి కారణమడుగగా — 'మీ దయవలన నాకు అన్ని సిరిసంపదలున్నవి; ఏ కారణముచేతనో ఇలాగు ఏడవవలెనని బుద్ధి పుట్టుచుండును' అని చెప్పెను. అప్పుడు వారు — 'పారెడు పామును పట్టుకొనిపోయి నీ కొడుకు మంచముమీద వేయుము; అది కరచును; అప్పుడు ఏడ్వవచ్చును' అనిరి. ఆమె అట్లే చేయగా, పెద్దకొడుకు వచ్చి మంచము వైపు చూచునప్పటికి అందు బంగారు గొలుసు కనబడెను. 'అయ్యో! దీనివలన ఏడ్చుటకు వీలు కలిగినది కాదు' అని ఆ రాత్రి మరల ఏడ్చుచు కూర్చుండెను. తిరిగి వారు వచ్చి — 'తేలును పట్టుకొనిపోయి నీ కూతురు కుంకుమభరిణెలో వేయుము' అనిరి. ఆమె అట్లే చేయగా, మరునాడు బొట్టు పెట్టుకొనుటకు చేయిపెట్టిన కూతురికి అందులో చేర్చుక్క బొట్టు కనబడెను. మరల ఏడ్చుచుండగా వారు — 'నీవు పెంచిన పిల్లిని చంపి వడిలో ఉంచుకొని ఏడ్వుము' అనిరి. ఊరివారు వచ్చి అడుగగా ఆమె మరింత ఏడువగా, ఆమె కంటినీళ్ళు పడి ఆ పిల్లి బంగారు పిల్లియై వడిలోనుండి క్రిందికి దుమికిపోయెను. అప్పుడు పార్వతీపరమేశ్వరులు — 'ఓ కాంతా! నీవు గణేశుని నోముపట్టి ఉల్లంఘనము చేయుటచేతనే విచారించుచున్నావు. ఈ నోముపట్టి ఏడాది అక్షింతలు వేసికొని ఉద్యాపన చేసినయెడల నీ ఏడ్పు పోవును' అని చెప్పిరి."
      },
    udyapana: {
        roman: "Oil is poured into a new mookuti, a wick set and the lamp lit; with svayampakam and an anna of coins as dakshina, puja is done at a Shiva temple and that lamp placed before the Nandi.",
        deva: "",
        tel: "సోలెడు గిద్దెడు నూనె క్రొత్త మూకుటిలో పోసి, వత్తివేసి దీపము పెట్టి, స్వయంపాకము, ఒక అణా డబ్బులు దక్షిణతో శివాలయమున పూజ చేసికొని నంది దగ్గర ఆ దీపము పెట్టవలెను."
      },
    vayanam: {
        roman: "The lamp, svayampakam, dakshina.",
        deva: "",
        tel: "దీపము, స్వయంపాకము, దక్షిణ."
      },
  },
  //
  {
    id: "kanne-tulasamma-nomu",
    deity: "devi",
    name: {
        roman: "Kanne Tulasamma Nomu",
        deva: "",
        tel: "కన్నెతులసమ్మ నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "A stepmother's affection; healing within the household.",
        deva: "",
        tel: "సవతి తల్లి ఆదరణ; కుటుంబమున ప్రేమ."
      },
    how: {
        roman: "Ariselu are offered to Tulasamma and puja done.",
        deva: "",
        tel: "తులసమ్మకు అరిసెలు నైవేద్యము పెట్టి పూజ చేయవలెను."
      },
    katha: {
        roman: "In a certain village a girl suffered much from her stepmother. Unable to bear it, she went away to her grandmother's house. The stepmother pressed her husband to bring her back; he would not, and said, 'Go and fetch her yourself.' She went, quarrelled with them, somehow persuaded them, and brought the girl home. One day she handed the girl her own child to carry, gave her a piece of arise to hold, and did her Tulasi puja. The girl watched, and wanting to do the same, offered the piece of arise in her hand as naivedyam and worshipped Tulasi Devi. Pleased with her bhakti, Tulasi Devi appeared: 'Child, in a former birth you kept the kanne tulasi nomu and transgressed it, and that is why you lost your mother and gained a stepmother. So keep the kanne tulasi nomu.' The girl kept it with shraddha and bhakti and did the udyapana at the year's end. From then that stepmother cared for her as her own child.",
        deva: "",
        tel: "ఒక ఊరిలో ఒక చిన్నదానికి సవతి తల్లి పోరు ఎక్కువగా ఉండెడిది. అది భరించలేక ఆ చిన్నది తన అమ్మమ్మ గారి ఇంటికి వెళ్ళిపోయినది. సవతి తల్లి ఆ పిల్లను తీసుకురమ్మని భర్తను వేధించగా అతడు అంగీకరించలేదు; 'నువ్వే వెళ్ళి తీసుకొనిరా' అనెను. ఆమె వెళ్ళి, వారితో జగడమాడి, ఎట్లో ఒప్పించి ఆ చిన్నదానిని తీసుకువచ్చినది. ఒకరోజు ఆ పిల్లకు తన బిడ్డనిచ్చి ఎత్తుకోమని చెప్పి, ఒక అరిసె ముక్కను పెట్టి, తాను తులసి పూజ చేసుకొనెను. చిన్నది అది చూచి తనకును ఆసక్తి కలిగి, చేతిలోని అరిసె ముక్కను నైవేద్యము పెట్టి తులసీదేవిని పూజించినది. ఆమె భక్తికి మెచ్చి తులసీదేవి సాక్షాత్కరించి — 'ఓ చిన్నదానా! గత జన్మలో నీవు కన్నె తులసి నోము నోచి ఉల్లంఘించినందువలన నీకు తల్లి పోయి సవతి తల్లి కలిగినది. కనుక కన్నె తులసి నోము నోచుకో' అనెను. ఆ చిన్నది భక్తిశ్రద్ధలతో నోచి సంవత్సరాంతమున ఉద్యాపన చేసుకొనినది. నాటినుండి ఆ సవతి తల్లి ఆమెను సొంత బిడ్డలా చూసుకొనేది."
      },
    udyapana: {
        roman: "Thirteen pairs of ariselu are offered to Tulasamma with puja. A girl is given talantu snanam, a parikini and ravika, and the ariselu as vayanam.",
        deva: "",
        tel: "తులసమ్మకు పదమూడు జతల అరిసెలు నైవేద్యము పెట్టి పూజ చేయవలెను. ఒక కన్యకు తలంటు నీళ్ళు పోసి, పరికిణి, రవిక ఇచ్చి, అరిసెలు వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Ariselu, parikini, ravika.",
        deva: "",
        tel: "అరిసెలు, పరికిణి, రవిక."
      },
  },
  //
  {
    id: "mareedu-dala-vratamu",
    deity: "shiva",
    name: {
        roman: "Mareedu Dala Vratamu",
        deva: "",
        tel: "మారేడుదళ వ్రతము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "Victory over death; the return of a life that has gone.",
        deva: "",
        tel: "మృత్యుంజయము; పోయిన ప్రాణము తిరిగి రావడము."
      },
    how: {
        roman: "A silver leaf, a golden leaf and a bilva leaf together, with three double handfuls of rice, are used in puja to Shiva.",
        deva: "",
        tel: "వెండి దళము, బంగారు దళము, మారేడు దళము కలిపి మూడు దోసిళ్ళ బియ్యముతో శివునకు పూజ చేయవలెను."
      },
    katha: {
        roman: "A prince died. Since 'a royal corpse must not go without a companion', his father sent his men to bring someone to accompany the body. No one would agree to be sent with a dead man. But a brahmana's second wife, greedy for money, sold her co-wife's daughter for her weight in coin. They bound the girl to the prince's body and were carrying her to the cremation ground when darkness fell and heavy rain came. So they left them near a Shiva temple and went home. The girl untied the bindings and walked pradakshinam around the temple, weeping. Then Parvati Devi learned the cause of her grief, gave her akshatalu and mantra-water, told her to sprinkle it on the dead man, and to keep the mareedu dala nomu. The brahmana girl did so, and the prince came to life and marvelled to hear the whole story from her. At daybreak the king's kin came to perform the cremation, saw the prince alive, and took them in wonder to the city. Then the king gave her to his son and had the marriage performed with great splendour.",
        deva: "",
        tel: "ఒక రాజకుమారుడు చనిపోయెను. 'రాజ పీనుగు తోడు లేకుండ పోరాదు' గనుక కొడుకు శవమునకు తోడుగా ఎవరినైనా తీసుకురండని తండ్రి భటులను పంపెను. చచ్చినవానికి తోడు పంపుటకు ఎవ్వరూ అంగీకరించలేదు. కానీ ఒక బ్రాహ్మణుని రెండవ భార్య ధనాశాపరురాలై తన సవతి పిల్లను ఎత్తుకెత్తు ధనము పుచ్చుకొని అమ్మెను. వారా పిల్లను రాజకుమారుని శవముతో కట్టి శ్మశానమునకు తీసుకొనిపోవుచుండగా చీకటిపడి పెద్ద వర్షము వచ్చెను. అందుచే వారిని శివాలయము దగ్గర వదలిపెట్టి ఇండ్లకు పోయిరి. అప్పుడా చిన్నది కట్లు విప్పుకొని ఆలయము చుట్టూ ప్రదక్షిణము చేయుచు ఏడ్చుచుండెను. అప్పుడు పార్వతీదేవి ఆమె దుఃఖమునకు కారణము తెలుసుకొని, అక్షతలు, మంత్రజలమును ఇచ్చి చచ్చినవానిపై చల్లమని, మారేడు దళము నోము నోచుకొనమని చెప్పెను. బ్రాహ్మణ బాలిక అట్లు చేయగా రాజకుమారుడు బ్రతికి, గత చరిత్రనంతను ఆమె వలన విని ఆశ్చర్యపడెను. తెల్లవారుటచే దహనము చేయుటకు వచ్చిన రాజబంధువులు బ్రతికియున్న రాజకుమారుని చూచి ఆశ్చర్యముతో పట్టణమునకు తీసుకొని వెళ్ళిరి. అప్పుడా రాజు ఆ చిన్నదానిని తన కుమారునికిచ్చి మహా వైభవముగా వివాహము చేసెను."
      },
    udyapana: {
        roman: "Puja is done to Shiva with the silver leaf, golden leaf and bilva leaf together with three double handfuls of rice, and santarpana given to the poor.",
        deva: "",
        tel: "వెండి దళము, బంగారు దళము, మారేడు దళము కలిపి మూడు దోసిళ్ళ బియ్యముతో శివునకు పూజ చేసి బీదలకు సంతర్పణ చేయవలెను."
      },
    vayanam: {
        roman: "Silver leaf, golden leaf, bilva leaf.",
        deva: "",
        tel: "వెండి దళము, బంగారు దళము, మారేడు దళము."
      },
  },
  //
  {
    id: "vishnu-kamalala-nomu",
    deity: "vishnu",
    name: {
        roman: "Vishnu Kamalala Nomu",
        deva: "",
        tel: "విష్ణుకమలాల నోము"
      },
    when: {
        roman: "Daily, one year.",
        deva: "",
        tel: "ఒక సంవత్సరము, ప్రతిదినము."
      },
    forwhat: {
        roman: "A face like Lakshmi's; radiance.",
        deva: "",
        tel: "లక్ష్మి ముఖము వంటి ముఖము; కళ."
      },
    how: {
        roman: "Each day a kamala wick is lit in cow ghee.",
        deva: "",
        tel: "ప్రతిదినము ఒక కమల వత్తిని ఆవునేతితో వెలిగించవలెను."
      },
    katha: {
        roman: "A king's daughter asked the purohita why the minister's daughter's face shone like a lotus more than her own. He told her to take up the Vishnu Kamalala nomu, and told her the katha of its greatness — that in swarga-loka Vishnu appointed a vratam for women that they might have a face like Lakshmi's, and that is called the Vishnu Kamalala nomu.",
        deva: "",
        tel: "రాజు కూతురు, తన ముఖముకన్న మంత్రికుమార్తె ముఖము కమలమువలె కలకలలాడుటకు కారణమేమని పురోహితుని అడిగెను. అతడు ఆమెను విష్ణు కమలాల నోము పట్టమని చెప్పి దాని మహాత్మ్యమును తెలుపు కథను చెప్పెను — స్వర్గలోకమున విష్ణుమూర్తి, లక్ష్మి ముఖము వంటి ముఖము కలుగుటకు స్త్రీలకు ఒక వ్రతమును నియమించెను; దానినే విష్ణు కమలాల నోము అందురు."
      },
    udyapana: {
        roman: "After the year, a silver pramida and a golden pramida are made, cow ghee poured in them and jyotis lit with kamala wicks. Then manedu soledu of rice is given to a brahmana with dakshina and tambulam.",
        deva: "",
        tel: "ఏడాది చేసిన తరువాత వెండి ప్రమిదను, బంగారు ప్రమిదను చేయించి, వాటిలో ఆవునెయ్యి వేసి కమలపు వత్తులతో జ్యోతులను వెలిగించవలెను. తరువాత మానెడు సోలెడు బియ్యమును దక్షిణ తాంబూలములతో బ్రాహ్మణునకు ఒసగవలెను."
      },
    vayanam: {
        roman: "Silver pramida, golden pramida, rice, dakshina, tambulam.",
        deva: "",
        tel: "వెండి ప్రమిద, బంగారు ప్రమిద, బియ్యము, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "surya-chandrula-nomu",
    deity: "devi",
    name: {
        roman: "Surya Chandrula Nomu",
        deva: "",
        tel: "సూర్యచంద్రుల నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "Affection between husband and wife; that there be no separation.",
        deva: "",
        tel: "భార్యాభర్తల నడుమ అనురాగము; ఎడబాటు లేకుండుట."
      },
    how: {
        roman: "Two lamps each day — in the morning to Surya, at night to Chandra.",
        deva: "",
        tel: "ఉదయము సూర్యునికి, రాత్రి చంద్రునికి — ప్రతిదినము రెండు దీపములు వెలిగించవలెను."
      },
    katha: {
        roman: "Between one couple there were ceaseless quarrels. A rishi taught them that as Surya and Chandra never meet face to face and yet both give light to the world, so a husband and wife must work with one another; and he directed this nomu. Each day they lit a lamp in the morning to Surya and at night to Chandra, kept it a year and did the udyapana, and affection settled between them.",
        deva: "",
        tel: "ఒక దంపతుల నడుమ నిరంతరము కలహములు ఉండెడివి. ఒక ఋషి — సూర్యచంద్రులు ఒకరికొకరు ఎదురుపడకున్నను లోకమునకు వెలుగునిచ్చునట్లు, దంపతులును పరస్పరము సహకరించుకొనవలెనని బోధించి ఈ నోమును సూచించెను. ఆ దంపతులు ప్రతిదినము ఉదయము సూర్యునికి, రాత్రి చంద్రునికి దీపము వెలిగించి ఏడాది ఆచరించి ఉద్యాపన చేయగా వారి నడుమ అనురాగము నెలకొనెను."
      },
    udyapana: {
        roman: "Silver images of Surya and Chandra; two pramidas; cloth in white and red; fruit; dakshina and tambulam — given as vayanam to a couple.",
        deva: "",
        tel: "వెండి సూర్య, చంద్ర ప్రతిమలు; రెండు ప్రమిదలు; తెల్లని, ఎఱ్ఱని వస్త్రములు; పండ్లు; దక్షిణ తాంబూలము — దంపతులకు వాయనము ఇవ్వవలెను."
      },
    vayanam: {
        roman: "The images of Surya and Chandra, pramidas, cloth, fruit, dakshina, tambulam.",
        deva: "",
        tel: "సూర్య చంద్ర ప్రతిమలు, ప్రమిదలు, వస్త్రములు, పండ్లు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "surya-padmamu-nomu",
    deity: "surya",
    name: {
        roman: "Surya Padmamu Nomu",
        deva: "",
        tel: "సూర్యపద్మము నోము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "Affection between husband and wife; that there be no separation.",
        deva: "",
        tel: "భార్యాభర్తల మధ్య ఇష్టము; ఎడబాటు లేకుండుట."
      },
    how: {
        roman: "The udyapana is to be done before sunrise.",
        deva: "",
        tel: "ప్రొద్దు పొడవకుండా ఉద్యాపన చేసుకొనవలెను."
      },
    katha: {
        roman: "In one village five men — a brahmana, a king, a komati, a kapu and a gollavadu — each bought a kuncham measure. Every day those kunchams went to the temple and told one another, 'Yesterday they measured varahalu with me; they measured paddy with me.' Only the brahmana's kuncham, its master being poor, said nothing. One day it did not come, and when the others asked, it said: 'There was a solet of broken rice, and my mistress poured it into me and put a lid on, so I could not come.' The others spoke slightingly, and the brahmana's kuncham said: 'Will you always be as you are? In some while a daughter will be born to my mistress, and she will be born with a manikyam at her navel. Then we too shall measure varahalu.' A brahmana overheard this and waited for the time. So it was: from the navel of the girl born in that house a manikyam fell each day, and they grew wealthy. The brahmana who had overheard came, asked for the daughter and married her. After she went, her parents' house too grew wealthy; and out of greed her husband stopped sending her to her mother's house. One day, going to see her mother and returning, Parvati and Parameshwara appeared to her and said: 'It is by your being born that wealth came to your parents; that is why they would not let you go; and that is why your husband would not send you.' She prayed, 'Tell me what to do now so that the two of us may be at one.' They said: 'In a former birth you kept the surya padmam nomu, and so you were born with a manikyam at your navel; but you did not do its udyapana. Therefore there is little affection between you. Keep this nomu now and do the udyapana, and you will be at one.'",
        deva: "",
        tel: "ఒక గ్రామమున అయిదుగురు — బ్రాహ్మణుడు, రాజు, కోమటి, కాపు, గొల్లవాడు — అయిదు కుంచములు కొనుక్కొనిరి. ఆ కుంచములు ప్రతిదినము దేవాలయమునకు పోయి 'నాతో నిన్న వరహాలు కొలిచినారు, నాతో వడ్లు కొలిచినారు' అని చెప్పుకొనుచుండెడివి. బ్రాహ్మణ కుంచము మాత్రము తన యజమాని దరిద్రుడగుటచే ఏమియు చెప్పక ఊరకుండెడిది. ఒకనాడది రాకపోగా మరునాడు మిగిలినవి అడుగగా — 'సోలెడు నూకలుండగా మా అమ్మగారు నాలో పోసి మూతవేసినందున రాలేకపోయితిని' అని చెప్పెను. మిగిలినవి నీరసించి పలుకగా, బ్రాహ్మణ కుంచము — 'ఎల్లకాలము మీలాగే ఉంటారా? కొన్నాళ్ళకు మా అమ్మకు కుమార్తె పుట్టును; ఆ పిల్ల బొడ్డున మాణిక్యము పెట్టుకొని పుట్టును. అప్పుడు మేముకూడా వరహాలు కొలుచుకొందుము' అనెను. ఈ సంభాషణ ఒక బ్రాహ్మణుడు విని సమయము కొరకు వేచియుండెను. అట్లే ఆ ఇంట పుట్టిన పిల్ల బొడ్డునుండి ప్రతిదినము ఒక మాణిక్యము పడుచుండెను; వారు భాగ్యవంతులైరి. సంభాషణ విన్న బ్రాహ్మణుడు వచ్చి ఆ కూతురిని అడిగి వివాహము చేసుకొనెను. ఆమె వెళ్ళిన తరువాత వారును భాగ్యవంతులైరి; ధనాశచే ఆ భర్త ఆమెను పుట్టింటికి పంపుట మానెను. ఒకనాడు ఆమె తల్లిని చూడవలెనని వెళ్ళి తిరిగివచ్చుచుండగా పార్వతీపరమేశ్వరులు ప్రత్యక్షమై — 'నీవు పుట్టుటచేతనే నీ తల్లిదండ్రులకు భాగ్యము వచ్చినది; అందుచేతనే నిన్ను వదలలేదు; నీ భర్తయు అందుచేతనే నిన్ను పంపలేదు' అని చెప్పిరి. 'ఇప్పుడేమి చేసిన మాకిద్దరికి కలియునో చెప్పవలెను' అని ఆమె ప్రార్థింపగా — 'క్రిందటి జన్మమున సూర్యపద్మము నోము పట్టినావు గనుక బొడ్డున మాణిక్యము పెట్టుకొని పుట్టినావు; అప్పుడు ఉద్యాపనము చేసినావు కావు; కాబట్టి మీ ఇద్దరికి ఇష్టము తక్కువగా ఉన్నది. ఇప్పుడీ నోముపట్టి ఉద్యాపన చేసిన ఇష్టముగా ఉందురు' అని చెప్పిరి."
      },
    udyapana: {
        roman: "Before sunrise, the couple are given talantu snanam and given mettelu and a mangalasutram, a saree and a jamaru, and the udyapana done.",
        deva: "",
        tel: "ప్రొద్దు పొడవకుండా దంపతులిద్దరికి తలంటి నీళ్ళు పోసి, మెట్టెలు, మంగళసూత్రము ఇచ్చి, చీర జామారు ఒసంగి ఉద్యాపన చేసుకొనవలెను."
      },
    vayanam: {
        roman: "Mettelu, mangalasutram, saree, jamaru.",
        deva: "",
        tel: "మెట్టెలు, మంగళసూత్రము, చీర, జామారు."
      },
  },
  //
  {
    id: "chitraguptuni-nomu",
    deity: "devi",
    name: {
        roman: "Chitraguptuni Nomu",
        deva: "",
        tel: "చిత్రగుప్తుని నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఏడాది."
      },
    forwhat: {
        roman: "The attaining of swarga.",
        deva: "",
        tel: "స్వర్గప్రాప్తి."
      },
    how: {
        roman: "The katha is told, akshatalu placed for a year, and the udyapana done.",
        deva: "",
        tel: "కథ చెప్పుకొని ఏడాది అక్షతలు వేసుకొని ఉద్యాపన చేయవలెను."
      },
    katha: {
        roman: "A king's wife and a minister's wife kept all the nomulu equally. But the king's wife forgot to keep the Chitragupta nomu; the minister's wife kept it. After a time both died. Then Chitragupta gave swarga to the minister's wife and naraka to the king's wife. Hearing this the king's wife asked: 'Swami, I kept the vratas as the minister's wife did. What is the reason naraka has come to me?' He told her it was because she had not kept the Chitragupta nomu. She entreated him, came back to the earth, kept that nomu, and afterwards went to swarga-loka.",
        deva: "",
        tel: "ఒక రాజభార్య, మంత్రిభార్య అన్ని నోములు సమానముగా చేయుచుండిరి. కానీ రాజుభార్య చిత్రగుప్తుని నోము నోచుట మరచిపోయెను; ఆ నోము మంత్రిభార్య నోచెను. కొంతకాలమునకు వారిద్దరూ చనిపోయిరి. అప్పుడు చిత్రగుప్తుడు మంత్రిభార్యకు స్వర్గమును, రాజుభార్యకు నరకమును ఇచ్చెను. అది విని రాజుభార్య — 'స్వామీ! మంత్రిభార్యవలె నేనును వ్రతములను చేసితిని. నాకు నరకము వచ్చుటకు కారణమేమి?' అని అడిగెను. అప్పుడు అతడు 'చిత్రగుప్తుని నోము నోచలేదు' గనుక అట్లు జరిగెనని చెప్పెను. ఆమె అతనిని బ్రతిమాలి తిరిగి భూలోకమునకు వచ్చి ఆ నోము నోచుకొని పిదప స్వర్గలోకమునకు వెళ్ళెను."
      },
    udyapana: {
        roman: "Into an unbound basket, five kunchams of paddy untrodden by oxen; in it a gummadi fruit, addedu tavvedu of rice, five mooras of silk panche; and with dakshina, tambulam, a silver leaf and a golden stylus, given to one's elder brother or to the village karanam.",
        deva: "",
        tel: "కట్లు లేని గంపలో ఎడ్లు తొక్కని వడ్లు అయిదు కుంచములు పోసి, వాటిలో ఒక గుమ్మడిపండు, అడ్డెడు తవ్వెడు బియ్యము, అయిదు మూరల పట్టుపంచె పెట్టి, దక్షిణ తాంబూలములతో, వెండి ఆకుతో, బంగారు గంటముతో అన్నగారికి గాని గ్రామకరణమునకు గాని ఇవ్వవలెను."
      },
    vayanam: {
        roman: "Paddy, gummadi fruit, rice, silk panche, a silver leaf, a golden stylus.",
        deva: "",
        tel: "వడ్లు, గుమ్మడిపండు, బియ్యము, పట్టుపంచె, వెండి ఆకు, బంగారు గంటము."
      },
  },
  //
  {
    id: "dhairya-lakshmi-vratamu",
    deity: "devi",
    name: {
        roman: "Dhairya Lakshmi Vratamu",
        deva: "",
        tel: "ధైర్యలక్ష్మీ వ్రతము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "The husband's health.",
        deva: "",
        tel: "భర్త ఆరోగ్యము."
      },
    how: {
        roman: "The katha is told and akshatalu placed on the head.",
        deva: "",
        tel: "కథ చెప్పుకొని అక్షతలు వేసుకొనవలెను."
      },
    katha: {
        roman: "A brahmana woman had five younger brothers. Each time one of them was to be married, her husband's life would come into danger; so she would not go to the wedding. In this way four were married. When the fifth brother's wedding was taking place, again her husband's life came into danger. This time she resolved that her own Dhairya Lakshmi would protect her, left her sick husband in the house and set out for her brother's wedding. On the way she saw a juvvi tree. She went round it three times and, making namaskaram, said: 'Mother, you are Dhairya Lakshmi for me. If my husband is in health when I return from my parents' house, I will do your puja through a whole year' — and went on. As soon as the wedding was over she came home, and her husband was in health.",
        deva: "",
        tel: "ఒక బ్రాహ్మణ స్త్రీకి అయిదుగురు తమ్ముళ్ళు ఉండిరి. ఆ తమ్ముల పెండ్లినాటికి ఆమె భర్తకు ప్రాణము మీదకు వచ్చెడిది; అందుచే ఆమె పెండ్లికి వెళ్ళెడిది కాదు. ఆ విధముగా నలుగురికి పెండ్లిండ్లు అయినవి. అయిదవ తమ్ముని పెండ్లి కూడా జరుగుచుండగా అప్పుడును ఆమె భర్తకు ప్రాణము మీదకు వచ్చెను. ఈసారి ఆమె తన ధైర్యలక్ష్మియే తనను కాపాడగలదని ఎంచుకొని, రోగియగు మగనిని ఇంటిలో పెట్టి తమ్ముని పెండ్లికి ప్రయాణమై పోవుచుండగా దారిలో ఒక జువ్వి చెట్టు కనబడెను. ఆమె ఆ చెట్టుకు ముమ్మారు ప్రదక్షిణలు చేసి — 'తల్లీ! నీవే నాపాలిట ధైర్యలక్ష్మివి. నేను పుట్టింటినుండి తిరిగి వచ్చేసరికి నా భర్త ఆరోగ్యముగా ఉన్నచో నీకు ఏడాది పొడుగున పూజ చేసెదను' అని నమస్కరించి వెళ్ళిపోయెను. పెండ్లైన వెంటనే ఆమె తిరిగి ఇంటికి వచ్చుసరికి భర్త ఆరోగ్యముగా ఉండెను."
      },
    udyapana: {
        roman: "",
        deva: "",
        tel: ""
      },
    vayanam: {
        roman: "",
        deva: "",
        tel: ""
      },
  },
  //
  {
    id: "nandikeswara-vratamu",
    deity: "devi",
    name: {
        roman: "Nandikeswara Vratamu",
        deva: "",
        tel: "నందికేశ్వర వ్రతము"
      },
    when: {
        roman: "",
        deva: "",
        tel: ""
      },
    forwhat: {
        roman: "Hardness gone and softness in its place; the favour of all the devatas; sirisampadalu.",
        deva: "",
        tel: "కాఠిన్యము తొలగి మృదుత్వము; సమస్త దేవతల అనుగ్రహము; సిరిసంపదలు."
      },
    how: {
        roman: "Five sers of each of the eight articles named in the katha are prepared, the corresponding devatas worshipped and the nivedana made. Brahmanas are invited and fed to their satisfaction. The articles must NOT be carried across the threshold, and must be finished before sunset.",
        deva: "",
        tel: "కథలో చెప్పిన ఎనిమిది పదార్థములను రకమునకు అయిదు శేర్ల చొప్పున తయారు చేసి, ఆయా దేవతలను పూజించి నివేదన చేయవలెను. బ్రాహ్మణులను పిలిచి తృప్తిగా భుజింపజేయవలెను. పదార్థములు గడప దాటించరాదు; సూర్యాస్తమయము లోగా సరుకు చెల్లిపోవలెను."
      },
    katha: {
        roman: "One day in Kailasa, while Parvati was pressing Parameshwara's feet, he told her to stop, because her hands were hard. She asked why her hands were hard and what would make them soft. He taught her: 'It is because you are hard toward someone. Go to the bathing ghat and give talantu snanam to the women who come and go.' Parvati came to the earth, stood at the ghat and gave talantu to everyone who came. Among them came a proud old perantalu, who thought, 'I have kept so many vratas — what vratam is this?' and sat with her head bowed; and going away she did not say even one courteous word. Even so, because her own hands had grown soft, Parvati favoured her and granted her wealth. Understanding that this wealth was the cause of her arrogance, and deciding she would steady if the wealth were taken, Parvati sent Vighneshwara; the woman offered him undrallu and he granted her yet more wealth and left. She sent Nandi; shanagalu were given as vayanam, and Nandikeshwara turned back. To Bhairava, garelu; to Chandra, chalimidi; to Surya, ksheerannam; to Arjuna, appalu; to Gauri Devi, atlu; to Sadashiva, chimmili — each was received with his own article and each turned back. At last Parvati came herself. The devotee welcomed her warmly, set a peetham and seated her, applied pasupu, placed the kumkuma bottu, worshipped her with dhupa, dipa and naivedyam, cooked pulagam and made the offering. Parvati was pleased and withdrew her decision; the woman's hardness lessened and her mind and body both grew soft. 'Whoever offers to those devatas the very articles offered here, and completes the udyapana with puja, will have the favour of all the devatas and their hardness will go' — and she departed.",
        deva: "",
        tel: "ఒకనాడు కైలాసమున పార్వతి పరమేశ్వరుని కాళ్ళు వత్తుచుండగా, ఆమె చేతులు కఠినముగా ఉన్నందున పరమేశ్వరుడు పాదములను పట్టవద్దనెను. 'నా చేతులు ఎందుకు కఠినముగా ఉన్నవి? ఈ కాఠిన్యము పోయి మృదువగు మార్గమేమి?' అని ఆమె అడుగగా — 'నీవు ఎవరిపట్లనో కఠినముగా ఉండుటయే కారణము. నీళ్ళాట రేవుకు వెళ్ళి వచ్చీపోయే వనితలకు తలంటి నీళ్ళు పోయుము' అని ఉపదేశించెను. పార్వతి భూలోకమునకు వచ్చి రేవు వద్ద నిలిచి వచ్చినవారందరికీ తలంటు పోయుచు వచ్చెను. అట్లు వచ్చినవారిలో ఒక అహంకారవతియైన వృద్ధ పేరంటాలు కలదు. 'నేను ఎన్నో వ్రతాలు చేసాను, ఇదేమి వ్రతము?' అని అనుకొనుచు తలవంచుకొని కూర్చొనెను; వెళ్ళుచు మర్యాద కోసమైనను ఒక మంచి మాట అనలేదు. అయినను పార్వతి తన చేతులు మృదువుగా మారుటచే ఆమెను అనుగ్రహించి సిరిసంపదలు ప్రసాదించెను. ఆ సంపదలే ఆమె అహంకారమునకు కారణమని గ్రహించి, సిరిని తొలగించిన స్థిరపడునని నిశ్చయించి — విఘ్నేశ్వరుని పంపెను; ఆమె ఉండ్రాళ్ళు పెట్టగా అతడు మరికొంత సిరిని అనుగ్రహించి వెళ్ళెను. నందిని పంపగా శనగలు వాయనమిచ్చెను; నందికేశ్వరుడు వెనుదిరిగెను. భైరవునికి గారెలు; చంద్రునికి చలిమిడి; సూర్యునికి క్షీరాన్నము; అర్జునునికి అప్పాలు; గౌరీదేవికి అట్లు; సదాశివునికి చిమ్మిలి — ఒక్కొక్కరును తమ పదార్థముతో స్వాగతింపబడి వెనుదిరిగిరి. చివరకు పార్వతి స్వయముగా వచ్చెను. ఆ భక్తురాలు సాదరముగా ఆహ్వానించి, పీట వేసి కూర్చోబెట్టి, పసుపు రాసి, కుంకుమ బొట్టు పెట్టి, ధూప దీప నైవేద్యాదులతో ఆరాధించి పులగము వండి నివేదించినది. పార్వతి ప్రసన్నురాలై తన నిర్ణయమును విరమించుకొనెను; ఆమె కాఠిన్యము తగ్గినది, మనస్సు తనువూ మృదువయ్యెను. 'నేను పంపిన దేవతలకు నివేదించిన పదార్థములనే నివేదించి పూజాపూర్వక ఉద్యాపన చేసినవారికి సమస్త దేవతల అనుగ్రహము కలిగి కాఠిన్యము తొలగును' అని చెప్పి వెళ్ళిపోయెను."
      },
    udyapana: {
        roman: "At the nandi mukham of an upanayanam: five sers of pesarapappu soaked, poured into a brass vessel and tied over with a new silk panche, with a gold nandi, a silver nandi, dakshina and tambulam.",
        deva: "",
        tel: "వడుగులో వటువుకు నాందీముఖము వేళ అయిదు శేర్ల పెసరపప్పు నానబెట్టి, ఇత్తడి పాత్రలో పోసి, క్రొత్త పట్టు పంచెతో వాసెన కట్టి, బంగారు నంది, వెండి నంది, దక్షిణ తాంబూలములు ఇవ్వవలెను."
      },
    vayanam: {
        roman: "The eight articles of the katha; pesarapappu, gold and silver nandi.",
        deva: "",
        tel: "కథలోని ఎనిమిది పదార్థములు; పెసరపప్పు, బంగారు వెండి నందులు."
      },
  },
  //
  {
    id: "ksheerabdhi-sayana-vratam",
    deity: "vishnu",
    name: {
        roman: "Ksheerabdhi Sayana Vratam",
        deva: "",
        tel: "క్షీరాబ్ధిశయన వ్రతము"
      },
    when: {
        roman: "Kartika shuddha dwadashi — Ksheerabdhi Dwadashi. Some keep it from ekadashi to purnima.",
        deva: "",
        tel: "కార్తీక శుద్ధ ద్వాదశి — క్షీరాబ్ధి ద్వాదశి. కొందరు ఏకాదశి నుండి పౌర్ణమి వరకు ఆచరింతురు."
      },
    forwhat: {
        roman: "Marital wellbeing; children; the destruction of papam; the attaining of Vishnu-loka.",
        deva: "",
        tel: "దాంపత్య సౌఖ్యము; సంతానము; పాపనాశనము; విష్ణులోక ప్రాప్తి."
      },
    how: {
        roman: "In the evening a muggu is laid at the tulasi-kota, the tulasi adorned, and an usiri branch set beside her — the usiri being Vishnu's form and the tulasi Lakshmi's. It is the practice to perform the tulasi-usiri kalyanam. Lamps are lit, Dhatri and Lakshmi-Narayana worshipped, the katha read and harati given. Where possible, tulasi puja with deeparadhana and pradakshinas.",
        deva: "",
        tel: "సాయంకాలము తులసికోట వద్ద ముగ్గు వేసి, తులసిని అలంకరించి, ఉసిరి కొమ్మను తులసి పక్కన ఉంచవలెను — ఉసిరి విష్ణుస్వరూపము, తులసి లక్ష్మీస్వరూపము. తులసి-ఉసిరి కల్యాణమును చేయుట సంప్రదాయము. దీపములు వెలిగించి, ధాత్రీ లక్ష్మీ నారాయణులను పూజించి, కథ చదివి, హారతి ఇవ్వవలెను. వీలైనచో దీపారాధనతో తులసిపూజ చేసి ప్రదక్షిణలు చేయవలెను."
      },
    katha: {
        roman: "At the churning of the ocean of milk, the devas and asuras churned for amritam. Lakshmi Devi, arising then, chose Vishnu. It is held that Vishnu, in yoga-nidra through the Chaturmasya, wakes upon the ocean of milk on Kartika shuddha dwadashi. On that day it became the practice to regard the tulasi as Lakshmi's form and the usiri as Vishnu's and to perform their kalyanam. It is said that to the women who keep this vratam come marital wellbeing, children and the destruction of papam, and the attaining of Vishnu-loka.",
        deva: "",
        tel: "క్షీరసాగర మథన కాలమున దేవతలు, రాక్షసులు అమృతము కొరకు సముద్రమును చిలికిరి. ఆ సమయమున ఉద్భవించిన లక్ష్మీదేవి విష్ణువును వరించెను. చాతుర్మాస్యమున యోగనిద్రలో ఉన్న విష్ణువు కార్తీక శుద్ధ ద్వాదశినాడు క్షీరసముద్రమున మేల్కొనునని ప్రతీతి. ఆ దినమున తులసిని లక్ష్మీస్వరూపముగా, ఉసిరిని విష్ణుస్వరూపముగా భావించి కల్యాణము చేయుట సంప్రదాయమైనది. ఈ వ్రతమును ఆచరించిన స్త్రీలకు దాంపత్య సౌఖ్యము, సంతానము, పాపనాశనము కలుగుననియు, విష్ణులోకప్రాప్తి సిద్ధించుననియు చెప్పబడినది."
      },
    udyapana: {
        roman: "The tulasi-usiri kalyanam is completed, and a tulasi plant, an usiri branch, a saree, ravike, pasupu, kumkuma, bangles, fruit, dakshina and tambulam given as vayanam to a muttaiduva. Taking the meal beneath an usiri tree, and annadanam, are held to be best.",
        deva: "",
        tel: "తులసి-ఉసిరి కల్యాణము పూర్తి చేసి — తులసి మొక్క, ఉసిరి కొమ్మ, చీర, రవికె, పసుపు, కుంకుమ, గాజులు, పండ్లు, దక్షిణ తాంబూలము — ఒక ముత్తయిదువుకు వాయనము ఇవ్వవలెను. ఉసిరి చెట్టు క్రింద భోజనము చేయుట, అన్నదానము చేయుట శ్రేష్ఠము."
      },
    vayanam: {
        roman: "Tulasi plant, usiri branch, saree, ravike, pasupu, kumkuma, bangles, fruit, dakshina, tambulam.",
        deva: "",
        tel: "తులసి మొక్క, ఉసిరి కొమ్మ, చీర, రవికె, పసుపు, కుంకుమ, గాజులు, పండ్లు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "vishnu-kanta-nomu",
    deity: "vishnu",
    name: {
        roman: "Vishnu Kanta Nomu",
        deva: "",
        tel: "విష్ణు కాంత నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "That no illness fall at times of auspicious occasions.",
        deva: "",
        tel: "శుభకార్యములందు అనారోగ్యములు లేకుండుట."
      },
    how: {
        roman: "",
        deva: "",
        tel: ""
      },
    katha: {
        roman: "Whenever a marriage was fixed for a brahmana woman's younger brother, her husband would fall ill. Many times the attempt to arrange the brother's wedding was obstructed, until the kin, wearied, fixed the muhurtam anyway. Then her husband's life came into danger. But she paid it no mind, left her husband at home, and set out for her brother's wedding. On the way, the flowers of a vishnukanta tree lay fallen, and she walked over them. Then she heard: 'Look at the young woman trampling the flowers of the nomu she kept, O lilies in the tank! When her dear husband's life was in danger she rolled him in a mat, set him in the middle room, and set out to see her little brother's wedding — we have seen it, how strange it is, O Vishnukanta!' She paid no attention and went to the wedding. Returning, she stopped at the vishnukanta and asked what those words meant. Then the lord of trees told her that she had formerly kept the vishnukanta nomu and transgressed it, and that was why her husband fell ill at her brother's wedding; and that to have no illness at auspicious occasions she must keep that nomu again and give its vayanam. She kept it so, and after a year did the udyapana, and lived with nitya kalyanam and pachcha toranam.",
        deva: "",
        tel: "ఒక బ్రాహ్మణపడుచు తమ్మునికి పెండ్లి నిశ్చయమైనపుడెల్ల ఆమె భర్తకు జబ్బు చేయుచుండెను. అనేక సమయములందు తమ్ముని వివాహ ప్రయత్నమునకు ఆటంకము రాగా బంధువులు విసిగి ముహూర్తము నిశ్చయించిరి. అప్పుడు ఆమె భర్తకు ప్రాణము మీదకు వచ్చెను. కానీ ఆమె లెక్కచేయకుండా భర్తను ఇంట విడిచి తమ్ముని పెండ్లికి పోవుచుండెను. దారిలో ఒక విష్ణుకాంత చెట్టు పువ్వులు రాలియుండగా వాటిని త్రొక్కుకొనుచు పోవుచుండెను. అంతలో — 'నోము నోచిన పూలను కాలరాచిపోవుచున్న యువతిని చూడుడు, చెరువులోన చెంగలువలారా! ప్రియమైన భర్తకు ప్రాణం మీదకు వస్తే చాపను చుట్టి నట్టింట బెట్టి, చిన్న తమ్ముని పెండ్లి చూడ ప్రయాణమైన పడతిని చూస్తిమి, వింతగా ఉందో విష్ణుకాంతా!' అన్న మాటలు వినిపించినను ఆమె లెక్కచేయక పెండ్లికి వెళ్ళెను. తిరిగి వచ్చుచు విష్ణుకాంత దగ్గర ఆగి ఆ మాటలకు అర్థమేమిటని అడిగెను. అప్పుడా వృక్షరాజు — ఆమె పూర్వము విష్ణుకాంత నోము నోచి ఉల్లంఘించుటచే తమ్ముని పెండ్లి సమయమున భర్త అనారోగ్యముగా ఉండుట సంభవించెననియు, శుభకార్యములందు అనారోగ్యములు లేకుండుటకు ఆ నోమును తిరిగి నోచి వాయనమివ్వవలెననియు తెలిపెను. ఆమె అట్లే నోము నోచుకొని ఏడాది ఐన తర్వాత ఉద్యాపనము చేసుకొని నిత్యకల్యాణము పచ్చతోరణముతో ఉండెను."
      },
    udyapana: {
        roman: "Thirteen pairs of ghee garelu are offered to the vishnukanta, and another thirteen pairs given as vayanam to muttaiduvas with dakshina and tambulam.",
        deva: "",
        tel: "విష్ణుకాంతకు పదమూడు జతల నేతి గారెలను నైవేద్యము పెట్టి, ఇంకొక పదమూడు జతల నేతి గారెలను ముత్తైదువులకు దక్షిణ తాంబూలాలతో వాయనమివ్వవలెను."
      },
    vayanam: {
        roman: "Ghee garelu, dakshina, tambulam.",
        deva: "",
        tel: "నేతి గారెలు, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "vishnu-vidiyala-nomu",
    deity: "vishnu",
    name: {
        roman: "Vishnu Vidiyala Nomu",
        deva: "",
        tel: "విష్ణువిదియల నోము"
      },
    when: {
        roman: "Each vidiya — for one year.",
        deva: "",
        tel: "ప్రతి విదియ — ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "Steadiness of mind in the dhyanam of Vishnu; knowledge.",
        deva: "",
        tel: "విష్ణువును ధ్యానించుటకు ఏకాగ్రత; జ్ఞానము."
      },
    how: {
        roman: "On each vidiya, Vishnu is worshipped and archana done with tulasi leaves. A fast, or fruit only.",
        deva: "",
        tel: "ప్రతి విదియనాడు విష్ణువును పూజించి తులసిదళములతో అర్చన చేయవలెను. ఉపవాసము లేక ఫలాహారము."
      },
    katha: {
        roman: "A devotee, though he worshipped Vishnu, could not hold his mind steady. An acharya taught him that bhakti must grow by degrees like the moon of the vidiya, and directed the nomu of worshipping Vishnu on each vidiya. He kept it a year and did the udyapana, and steadiness and knowledge came to him.",
        deva: "",
        tel: "ఒక భక్తుడు విష్ణువును ఆరాధించుచున్నను మనస్సు నిలువక ఏకాగ్రత లేకుండెను. ఒక ఆచార్యుడు — విదియ చంద్రుని వలె భక్తియు క్రమముగా పెరుగవలెనని బోధించి, ప్రతి విదియనాడు విష్ణువును పూజించు నోమును సూచించెను. అతడు ఏడాది ఆచరించి ఉద్యాపన చేయగా ఏకాగ్రత, జ్ఞానము కలిగినవి."
      },
    udyapana: {
        roman: "Tulasi leaves; a silver tulasi image; fruit; cloth; dakshina and tambulam — puja is done in a Vishnu temple and the dana given to a brahmana.",
        deva: "",
        tel: "తులసిదళములు; వెండి తులసి ప్రతిమ; పండ్లు; వస్త్రము; దక్షిణ తాంబూలము — విష్ణ్వాలయమున పూజ చేసి బ్రాహ్మణునికి దానము చేయవలెను."
      },
    vayanam: {
        roman: "Tulasi leaves, silver tulasi image, fruit, cloth, dakshina, tambulam.",
        deva: "",
        tel: "తులసిదళములు, వెండి తులసి ప్రతిమ, పండ్లు, వస్త్రము, దక్షిణ, తాంబూలము."
      },
  },
  //
  {
    id: "lingadanamu-nomu",
    deity: "shiva",
    name: {
        roman: "Lingadanamu Nomu",
        deva: "",
        tel: "లింగదానము నోము"
      },
    when: {
        roman: "One year.",
        deva: "",
        tel: "ఒక సంవత్సరము."
      },
    forwhat: {
        roman: "Health; aishwaryam; the grace of Shiva.",
        deva: "",
        tel: "ఆరోగ్యము; ఐశ్వర్యము; శివానుగ్రహము."
      },
    how: {
        roman: "Each day, abhishekam to the Shivalingam and bilvarchana.",
        deva: "",
        tel: "ప్రతిదినము శివలింగమునకు అభిషేకము చేసి బిల్వార్చన చేయవలెను."
      },
    katha: {
        roman: "A wealthy man grew negligent in the abhishekam of the Shivalingam, and his wealth wasted away by degrees. A shaiva acharya told him the fault would go if he kept the lingadanam nomu. For a year he did the abhishekam daily and gave a sphatika lingam in dana, and health and aishwaryam came back to him.",
        deva: "",
        tel: "ఒక ధనవంతుడు శివలింగమునకు అభిషేకము చేయుటలో నిర్లక్ష్యము వహించెను. అతని సంపద క్రమముగా క్షీణించెను. ఒక శైవాచార్యుడు — లింగదానము నోమును ఆచరించినచో దోషము తొలగుననిచెప్పెను. అతడు ఏడాదిపాటు ప్రతిదినము అభిషేకము చేసి, స్ఫటిక లింగమును దానము చేయగా ఆరోగ్యము, ఐశ్వర్యము తిరిగి లభించినవి."
      },
    udyapana: {
        roman: "A sphatika or silver lingam; bilva leaves; cloth; dakshina and tambulam — puja is done in a Shiva temple and the dana given to a shaiva devotee or a brahmana.",
        deva: "",
        tel: "స్ఫటిక లింగము లేక వెండి లింగము; బిల్వదళములు; వస్త్రము; దక్షిణ తాంబూలము — శివాలయమున పూజ చేసి శివభక్తునికి లేక బ్రాహ్మణునికి దానము చేయవలెను."
      },
    vayanam: {
        roman: "The lingam, bilva leaves, cloth, dakshina, tambulam.",
        deva: "",
        tel: "లింగము, బిల్వదళములు, వస్త్రము, దక్షిణ, తాంబూలము."
      },
  },
  ];
  const byId = {};
  list.forEach((n) => { byId[n.id] = n; });
  return { list, byId, get: (id) => byId[id] || null };
})();
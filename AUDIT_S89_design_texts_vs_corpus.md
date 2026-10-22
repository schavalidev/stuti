# The design's compiled texts against the corpus — can they be deleted?

S89, 22 October 2026. Asked after the Viṣṇu and Lalitā audit found that the app's texts are
design-origin: `stuti-texts.ts` says in its own header that they were "Parsed from the Telugu
source documents in uploads/", with the Devanāgarī transliterated from the Telugu at build time.
That is why their frame is thin and why words like महेश्वासो and महाहृदो appear in them — those are
transliteration artefacts, not readings any edition prints.

The question: is every compiled text also in the corpus, sourced and audited on its own? If so the
compiled copies can go, and `fill()` in `stuti-app/src/stuti-corpus.ts` replaces a hymn's verses,
sections, blurb and names with the corpus document outright.

## The short answer

No — not all of them, and not yet wholesale.

Eighty-four texts are compiled into the design (76 across the twenty-nine `stuti-text-*.ts`
modules, 8 in `stuti-texts.ts`). Of the corpus's 2,136 texts, 2,133 carry a `Source / recension`
header and 1,971 carry `Published`, so sourcing is not the problem anywhere it exists.

- **46** are in the corpus under the same title and on the same shelf. The seam would bridge these
  as they stand, so deleting the compiled verses hands the reader the corpus text.
- **25** are in the corpus, but under a different title or on a different shelf. The seam keys on
  `deity + normalised title` and would not find them, so deleting the compiled verses would leave
  the reader with an empty text until a mapping is written.
- **13** are not in the corpus at all. These cannot be deleted; they have to be written into the
  corpus first, from sources, like any other text.

## What has to happen before anything is deleted

1. **The host.** `STUTI_CORPUS_URL` is blank and the corpus is not served, so today nothing
   replaces a deleted text. `tools/serve-corpus.mjs` and the `stuti-corpus-url` localStorage key
   prove it locally without choosing a host.
2. **The guard.** The join refuses to bridge a hymn that has verses of its own — "A seed that
   carries its own verses keeps them and is left untouched" — which is exactly what keeps the thin
   design text in front of the reader. Deleting the compiled verses is what releases it.
3. **A mapping for the twenty-five.** Either the corpus titles move to the app's, or the app's to
   the corpus's, or an explicit id map is added. This is not mechanical: two of the pairings below
   are a guess and want an eye.

## The three lists

A. corpus has it, and the seam would bridge as-is: 46
   Annapūrṇā Stotram                        stotras/devi/annapurna/01_annapurna_stotram.txt
   Daṇḍapāṇi Pañcaratnam                    stotras/Subrahmanya/18_dandapani_pancaratnam.txt
   Daṇḍāyudhapāṇyaṣṭakam                    stotras/Subrahmanya/19_dandayudhapanyashtakam.txt
   Devyaparādha Kṣamāpaṇa Stotram           stotras/devi/main/02_devyaparadha_ksamapana_stotram.txt
   Dvādaśa Jyotirliṅga Stotram              stotras/shiva/16_dwadasha_jyotirlinga_stotram.txt
   Gaṇeśa Aṣṭakam                           stotras/ganesha/01_ganesha_ashtakam.txt
   Gaṇeśa Kavacam                           stotras/ganesha/04_ganesha_kavacham.txt
   Gaṇeśa Pañcaratnam                       stotras/ganesha/07_ganesha_pancharatnam.txt
   Guha Pañcaratnam                         stotras/Subrahmanya/16_guha_pancaratnam.txt
   Hanumān Cālīsā                           stotras/hanuman/02_hanuman_chalisa.txt
   Jaya Skanda Stotram                      stotras/Subrahmanya/17_jaya_skanda_stotram.txt
   Kanakadhārā Stotram                      stotras/devi/lakshmi/01_kanakadhara_stotram_shankara.txt
   Kumāra Kavacam                           stotras/Subrahmanya/13_kumara_kavacam.txt
   Kumāra Stutiḥ (Deva-kṛtam)               stotras/Subrahmanya/14_kumara_stuti_devakrtam.txt
   Kumāra Stutiḥ (Vipra-kṛtam)              stotras/Subrahmanya/14_kumara_stuti_devakrtam.txt
   Kārtikeya Karāvalamba Stotram            stotras/Subrahmanya/09_kartikeya_karavalamba_stotram.txt
   Kārtikeya Pañcakam                       stotras/Subrahmanya/10_kartikeya_pancakam.txt
   Kārtikeya Stotram                        stotras/Subrahmanya/11_kartikeya_stotram.txt
   Kārtikeyāṣṭakam                          stotras/Subrahmanya/12_kartikeyashtakam.txt
   Lalitā Pañcaratnam                       stotras/devi/lalita/01_lalita_pancaratnam.txt
   Lalitā Sahasranāma Stotram               stotras/devi/lalita/36_lalita_sahasranama_stotram.txt
   Liṅgāṣṭakam                              stotras/shiva/01_lingashtakam.txt
   Mahiṣāsuramardinī Stotram                stotras/devi/main/01_mahishasuramardini_stotram.txt
   Mahāmṛtyuñjaya Stotram                   stotras/shiva/09_maha_mrityunjaya_stotram.txt
   Pitṛ Stotram (Brahma-kṛtam)              stotras/pitr/02_ruci_pitr_stotram.txt
   Pitṛ Stotram (Ruci-kṛtam)                stotras/pitr/02_ruci_pitr_stotram.txt
   Pitṛ Sūktam (Vājasaneyi)                 stotras/pitr/03_pitr_suktam_vajasaneyi.txt
   Pitṛ Sūktam (Ṛgveda)                     stotras/pitr/04_pitr_suktam_rigveda.txt
   Rudrāṣṭakam                              stotras/shiva/02_rudrashtakam.txt
   Saṅkaṭanāśana Gaṇeśa Stotram             stotras/ganesha/02_sankatanashana_ganesha_stotram.txt
   Skanda Daṇḍakam                          stotras/Subrahmanya/23_skanda_dandakam.txt
   Skanda Stotram (Mahābhārate)             stotras/Subrahmanya/05_skanda_stotram_mahabharata.txt
   Skanda Ṣaṭkam                            stotras/Subrahmanya/26_skanda_shatkam.txt
   Skandalaharī                             stotras/Subrahmanya/30_skanda_lahari.txt
   Subrahmaṇya Bhujaṅgam                    stotras/Subrahmanya/01_subrahmanya_bhujangam.txt
   Subrahmaṇya Maṅgalāṣṭakam                stotras/Subrahmanya/38_subrahmanya_mangala_ashtakam.txt
   Subrahmaṇya Vajrapañjara Kavacam         stotras/Subrahmanya/08_subrahmanya_vajrapanjara_kavacam.txt
   Svāminātha Pañcakam                      stotras/Subrahmanya/25_svaminatha_pancakam.txt
   Toṭakāṣṭakam                             stotras/guru/14_totakashtakam.txt
   Umā Maheśvara Stotram                    stotras/shiva/21_umamaheshwara_stotram.txt
   Viṣṇu Sahasranāma Stotram                stotras/vishnu/25_vishnu_sahasranama_stotram.txt
   Śaravaṇabhava Devaseneśa Ṣaṭkam          stotras/Subrahmanya/24_saravanabhava_devasenesha_shatkam.txt
   Śiva Tāṇḍava Stotram                     stotras/shiva/06_shiva_tandava_stotram.txt
   Śrī Hanumat Pañcaratnam                  stotras/hanuman/05_hanumat_pancharatnam.txt
   Śrī Sūktam                               stotras/devi/lakshmi/06_sri_suktam.txt
   Ṣaṇmukha Stotram                         stotras/Subrahmanya/22_shanmukha_stotram.txt

B. corpus has it, but the title or shelf differs so the seam would NOT bridge: 25
   Achyutāṣṭakam                            stotras/krishna/08_achyutashtakam.txt
   Bhagavad Gītā (Dhyānam)                  stotras/bhagavadgita/19_gita_dhyanam.txt
   Bhavānī Aṣṭakam                          stotras/devi/main/22_bhavani_ashtakam.txt
   Bālamukundāṣṭakam                        stotras/krishna/22_balamukundashtakam.txt
   Gaṇapati Atharvaśīrṣa                    stotras/ganesha/08_ganapati_atharvashirsha.txt
   Gaṇeśa Bhujaṅga Stotram                  stotras/ganesha/03_ganesha_bhujangam.txt
   Gaṇeśa Maṅgalāṣṭakam                     stotras/ganesha/28_ganapati_mangalashtakam.txt
   Lalitā Sahasranāmāvali                   stotras/devi/lalita/36_lalita_sahasranama_stotram.txt
   Mahāgaṇapati Sahasranāmāvali             stotras/ganesha/29_mahaganapati_sahasranama_stotram.txt
   Mahāgaṇapati Stotram                     stotras/ganesha/16_daridryadahana_ganapati_stotram.txt
   Mahālakṣmī Aṣṭakam                       stotras/devi/lakshmi/05_mahalakshmyashtakam.txt
   Pitṛ Tarpaṇa Vidhiḥ                      stotras/vidhi/madhyandina/03_tarpana_vidhi.txt
   Prajñāvivardhana Kārtikeya Stotram       stotras/Subrahmanya/11_kartikeya_stotram.txt
   Rucistava                                stotras/pitr/01_rucistava.txt
   Saṅkaṭamocana Hanumān Aṣṭakam            stotras/hanuman/01_sankata_mochana_hanumadashtakam.txt
   Skanda Ṣaṣṭhī Kavacam                    stotras/Subrahmanya/06_kandar_shashthi_kavacam.txt
   Subrahmaṇya Karāvalamba Stotram          stotras/Subrahmanya/29_subrahmanya_ashtakam_karavalamba_stotram.txt
   Subrahmaṇya Kavacam                      stotras/Subrahmanya/07_subrahmanya_kavaca_stotram.txt
   Viṣṇu Sahasranāmāvali                    stotras/vishnu/25_vishnu_sahasranama_stotram.txt
   Āditya Hṛdayam                           stotras/navagraha/03_aditya_hridayam.txt
   Śiva Mānasa Pūjā                         stotras/shiva/03_shiva_manasa_puja_stotram.txt
   Śrī Dattātreya Aṣṭottara Śatanāmāvali    stotras/dattatreya/21_dattatreya_ashtottarashatanama_stotram.txt
   Śrī Varasiddhi Vināyaka Vratam           stotras/puja/smarta/14_vinayaka_chaviti_vrata.txt  [NOT PUBLISHED]
   Ṣaṇmukha Pañcaratna Stutiḥ               stotras/Subrahmanya/21_shanmukha_pancaratna_stuti.txt
   Ṣaṣṭhī Devī Stotram                      stotras/devi/main/31_shashti_devi_stotram.txt

C. nothing in the corpus — must be written there before the compiled copy can go: 13
   Candraśekharāṣṭakam                          shiva        10 verses
   Dakṣiṇāmūrti Stotram                         shiva,guru   21 verses
   Daśāvatāra Stotram                           vishnu       11 verses
   Gaṇapati Tālam                               ganesha      11 verses
   Gaṇeśa Sahasranāma Stotram                   ganesha      225 verses
   Kālabhairavāṣṭakam                           shiva        9 verses
   Mahāgaṇapatiṁ Manasā Smarāmi                 ganesha      2 verses
   Nirvāṇa Ṣaṭkam                               shiva        6 verses
   Vighneśvara Aṣṭottara Śatanāmāvali           ganesha      108 verses
   Vātāpi Gaṇapatiṁ Bhaje                       ganesha      4 verses
   Śrī Anaghādevī Aṣṭottara Śatanāmāvali        guru         108 verses
   Śuklāmbaradharaṁ Viṣṇum                      ganesha      1 verses
   Ṛṇavimocana Gaṇeśa Stotram                   ganesha      9 verses

## Pairings in list B that are a guess, not a reading

- **Mahāgaṇapati Stotram** → `16_daridryadahana_ganapati_stotram.txt`. Matched on nothing stronger
  than the shelf and the word Gaṇapati. Probably a different work.
- **Prajñāvivardhana Kārtikeya Stotram** → `11_kartikeya_stotram.txt`, which is also list A's pair
  for the compiled *Kārtikeya Stotram*. One corpus file cannot be both; one of the two compiled
  texts is something else.
- **Bhagavad Gītā (Dhyānam)** → `19_gita_dhyanam.txt`. Same work, but the corpus keeps it on the
  `bhagavadgita` shelf and the app on `vishnu`.
- **Skanda Ṣaṣṭhī Kavacam** → `06_kandar_shashthi_kavacam.txt`. The Tamil Kandar Ṣaṣṭhi Kavacam;
  the same rite, possibly not the same text.
- **Śrī Dattātreya Aṣṭottara Śatanāmāvali** → the corpus's *Aṣṭottaraśatanāma Stotram*. A nāmāvali
  and a stotra of the same hundred and eight names are two forms, not one file.

The three sahasranāmāvali entries (Lalitā, Viṣṇu, Mahāgaṇapati) hold no verses at all — they are
rendered from the name arrays — so for them the question is whether the corpus file's own `names`
table replaces `stuti-names-*.ts`, which `fill()` already does (`h.names = doc.names`).

## Method, and what it cannot tell you

Titles were compared after stripping a leading Śrī, dropping parenthetical and em-dash suffixes,
and flattening diacritics; twenty-seven pairs that this cannot reach were matched by hand, because
sandhi defeats it (bhavānī + aṣṭakam is printed bhavānyaṣṭakam, mahālakṣmī + aṣṭakam is
mahālakṣmyaṣṭakam, gaṇapati + atharvaśīrṣa is gaṇapatyatharvaśīrṣopaniṣat). No text was read. A
title agreeing does not prove the two files carry the same recension, and list A should be checked
text by text as each one is deleted, not trusted in bulk — the Viṣṇu and Lalitā audit is what that
check looks like.

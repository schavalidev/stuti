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


---

# The local test, 22 October 2026

The corpus was built (`python3 stotras/bin/build_corpus.py` — 2,135 files, 2,016 listed, 91 MB),
served by `stuti-app/tools/serve-corpus.mjs` on port 4175, and the built app was run against it
with `localStorage["stuti-corpus-url"]` set to that origin. To let the corpus win for the
forty-six, a scratch line in `stuti-texts.ts` withheld their compiled verses so the seam would
bridge; it was reverted afterwards and nothing of it is committed.

**It works.** The app fetched `index.json` (2,016 rows) and then, on opening a text, its document
— `t/shiva.16.fec2d91e.json` for the Dvādaśa Jyotirliṅga Stotram, which went from the compiled four
verses to the corpus's seventeen. The Viṣṇu Sahasranāma opened at 1 / 238 and begins where it
should, with ॐ, श्रीपरमात्मने नमः and नारायणं नमस्कृत्य नरं चैव नरोत्तमम् — the maṅgalācaraṇa that was
missing. The two absent dhyāna verses, the saṅkalpa and the colophon are all in the rendered page,
and the readings are the corpus's: महेष्वासो, not the design's महेश्वासो, and महाह्रदो, not महाहृदो.

## What each of the forty-six gains or loses

App units against corpus units:

```
Annapūrṇā Stotram                            12     14  devi/annapurna/01
Daṇḍapāṇi Pañcaratnam                         5      6  Subrahmanya/18
Daṇḍāyudhapāṇyaṣṭakam                         9      9  Subrahmanya/19
Devyaparādha Kṣamāpaṇa Stotram               12     13  devi/main/02
Dvādaśa Jyotirliṅga Stotram                   4     17  shiva/16
Gaṇeśa Aṣṭakam                               13      9  ganesha/01
Gaṇeśa Kavacam                               27     27  ganesha/04
Gaṇeśa Pañcaratnam                            6      6  ganesha/07
Guha Pañcaratnam                              5      6  Subrahmanya/16
Hanumān Cālīsā                               44     43  hanuman/02
Jaya Skanda Stotram                          11     11  Subrahmanya/17
Kanakadhārā Stotram                          21     24  devi/lakshmi/01
Kumāra Kavacam                                1      1  Subrahmanya/13
Kumāra Stutiḥ (Deva-kṛtam)                    5      6  Subrahmanya/14
Kumāra Stutiḥ (Vipra-kṛtam)                  19      6  Subrahmanya/14
Kārtikeya Karāvalamba Stotram                 5      6  Subrahmanya/09
Kārtikeya Pañcakam                            6      6  Subrahmanya/10
Kārtikeya Stotram                             6      7  Subrahmanya/11
Kārtikeyāṣṭakam                               9     10  Subrahmanya/12
Lalitā Pañcaratnam                            6      6  devi/lalita/01
Lalitā Sahasranāma Stotram                   20   1377  devi/lalita/36
Liṅgāṣṭakam                                   9      9  shiva/01
Mahiṣāsuramardinī Stotram                    21     22  devi/main/01
Mahāmṛtyuñjaya Stotram                       12     24  shiva/09
Pitṛ Stotram (Brahma-kṛtam)                   9     36  pitr/02
Pitṛ Stotram (Ruci-kṛtam)                    36     36  pitr/02
Pitṛ Sūktam (Vājasaneyi)                     13     13  pitr/03
Pitṛ Sūktam (Ṛgveda)                         14     14  pitr/04
Rudrāṣṭakam                                   9      9  shiva/02
Saṅkaṭanāśana Gaṇeśa Stotram                  8      8  ganesha/02
Skanda Daṇḍakam                               2      3  Subrahmanya/23
Skanda Stotram (Mahābhārate)                 19     19  Subrahmanya/05
Skanda Ṣaṭkam                                 7      7  Subrahmanya/26
Skandalaharī                                 31     31  Subrahmanya/30
Subrahmaṇya Bhujaṅgam                        33     33  Subrahmanya/01
Subrahmaṇya Maṅgalāṣṭakam                     9      9  Subrahmanya/38
Subrahmaṇya Vajrapañjara Kavacam             26     27  Subrahmanya/08
Svāminātha Pañcakam                           7      7  Subrahmanya/25
Toṭakāṣṭakam                                  8      8  guru/14
Umā Maheśvara Stotram                        13     13  shiva/21
Viṣṇu Sahasranāma Stotram                   176   1238  vishnu/25
Śaravaṇabhava Devaseneśa Ṣaṭkam               6      7  Subrahmanya/24
Śiva Tāṇḍava Stotram                         15     15  shiva/06
Śrī Hanumat Pañcaratnam                       6      6  hanuman/05
Śrī Sūktam                                   19     36  devi/lakshmi/06
Ṣaṇmukha Stotram                              9     10  Subrahmanya/22
```

Mostly the corpus has a unit or two more — a colophon, a closing verse. Five are much fuller:
Dvādaśa Jyotirliṅga 4 → 17, Mahāmṛtyuñjaya 12 → 24, Śrī Sūktam 19 → 36, Pitṛ Stotram 9 → 36,
Kanakadhārā 21 → 24. One is smaller: Gaṇeśa Aṣṭakam 13 → 9, which wants a look before it is
switched. The two sahasranāmas gain their whole apparatus.

## Four things the test turned up

**Two of the forty-six are mispaired, so it is really forty-four.** *Kumāra Stutiḥ (Deva-kṛtam)*
and *Kumāra Stutiḥ (Vipra-kṛtam)* both resolve to `Subrahmanya/14`, and *Pitṛ Stotram
(Brahma-kṛtam)* and *Pitṛ Stotram (Ruci-kṛtam)* both to `pitr/02`. One corpus file cannot be two
texts; one of each pair has no counterpart and belongs in list C.

**The phalaśruti of the Viṣṇu Sahasranāma is hidden.** The reader hides a section whose heading
matches `/nyāsa|dig-bandha/`, so that the japa apparatus does not get in a reciter's way. The
corpus calls that section "Uttaranyāsaḥ, Phalaśrutiḥ", so the whole phalaśruti disappears behind
the "include" control with the nyāsa. Three of the forty-six have sections hidden this way; only
this one hides something that is not nyāsa.

**The speaker marker shows raw.** The Viṣṇu document prints `श्रीवेदव्यास उवाच ---` thirteen times:
the corpus's `---` reaches the reader as three hyphens where the app's own texts use an em dash.

**Everything else renders.** All forty-six documents parse, none has an empty or missing verse, and
every one carries its glosses.

## Sweep

```
Annapūrṇā Stotram                           14 units  1 sections
Daṇḍapāṇi Pañcaratnam                        6 units  2 sections
Daṇḍāyudhapāṇyaṣṭakam                        9 units  2 sections
Devyaparādha Kṣamāpaṇa Stotram              13 units  2 sections
Dvādaśa Jyotirliṅga Stotram                 17 units  2 sections
Gaṇeśa Aṣṭakam                               9 units  2 sections
Gaṇeśa Kavacam                              27 units  0 sections
Gaṇeśa Pañcaratnam                           6 units  0 sections
Guha Pañcaratnam                             6 units  2 sections
Hanumān Cālīsā                              43 units  2 sections
Jaya Skanda Stotram                         11 units  3 sections
Kanakadhārā Stotram                         24 units  4 sections
Kumāra Kavacam                               1 units  1 sections
Kumāra Stutiḥ (Deva-kṛtam)                   6 units  2 sections
Kumāra Stutiḥ (Vipra-kṛtam)                  6 units  2 sections
Kārtikeya Karāvalamba Stotram                6 units  2 sections
Kārtikeya Pañcakam                           6 units  2 sections
Kārtikeya Stotram                            7 units  3 sections
Kārtikeyāṣṭakam                             10 units  3 sections
Lalitā Pañcaratnam                           6 units  2 sections
Lalitā Sahasranāma Stotram                 377 units  9 sections
Liṅgāṣṭakam                                  9 units  2 sections
Mahiṣāsuramardinī Stotram                   22 units  2 sections
Mahāmṛtyuñjaya Stotram                      24 units  1 sections
Pitṛ Stotram (Brahma-kṛtam)                 36 units  3 sections
Pitṛ Stotram (Ruci-kṛtam)                   36 units  3 sections
Pitṛ Sūktam (Vājasaneyi)                    13 units  1 sections
Pitṛ Sūktam (Ṛgveda)                        14 units  1 sections
Rudrāṣṭakam                                  9 units  2 sections
Saṅkaṭanāśana Gaṇeśa Stotram                 8 units  0 sections
Skanda Daṇḍakam                              3 units  3 sections
Skanda Stotram (Mahābhārate)                19 units  3 sections
Skanda Ṣaṭkam                                7 units  1 sections
Skandalaharī                                31 units  0 sections
Subrahmaṇya Bhujaṅgam                       33 units  2 sections
Subrahmaṇya Maṅgalāṣṭakam                    9 units  2 sections
Subrahmaṇya Vajrapañjara Kavacam            27 units  7 sections
Svāminātha Pañcakam                          7 units  3 sections
Toṭakāṣṭakam                                 8 units  0 sections
Umā Maheśvara Stotram                       13 units  2 sections
Viṣṇu Sahasranāma Stotram                  238 units 11 sections  speaker---:13
Śaravaṇabhava Devaseneśa Ṣaṭkam              7 units  2 sections
Śiva Tāṇḍava Stotram                        15 units  1 sections
Śrī Hanumat Pañcaratnam                      6 units  1 sections
Śrī Sūktam                                  36 units  2 sections
Ṣaṇmukha Stotram                            10 units  3 sections

empty or missing verses: 0
hidden-as-ritual sections: 3
   Lalitā Sahasranāma Stotram               Nyāsaḥ
   Subrahmaṇya Vajrapañjara Kavacam         Nyāsaḥ
   Viṣṇu Sahasranāma Stotram                Pūrvanyāsaḥ (ṛṣi-chandas-viniyogaḥ), Ṛṣyādinyāsaḥ, Karanyāsaḥ, Ṣaḍaṅganyāsaḥ, Uttaranyāsaḥ, Phalaśrutiḥ
raw --- speaker markers: 1 texts
   Viṣṇu Sahasranāma Stotram                13
```

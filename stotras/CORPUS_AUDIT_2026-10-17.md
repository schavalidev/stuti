# Whole-corpus mechanical audit — 2026-10-17 (S75)

**Scope.** Every one of the 1,830 text files under `stotras/`, read by machine for the faults a
machine can find: malformed Devanāgarī, IAST that is not the transliteration of the Devanāgarī
beside it, a translation field in the wrong script, numbering gaps, section headers that do not
match the units, editorial scaffolding left in the text, and sourcing that reaches the reader.

**What this audit is not.** It cannot say whether a verse is the verse the tradition recites. A
dropped syllable that leaves valid Devanāgarī and a matching IAST passes every check here. That
kind of correctness was established file by file, by collation against a named witness, when each
file was written, and is recorded in each file's editorial fields. Re-collating 1,830 files against
their witnesses is weeks of work and is not what this document reports. Where this audit found a
sign that the text itself may be wrong, it says so below and names the file, so that the witness
check can be done on those files alone.

**How to re-run it.** `python3 stotras/bin/corpus_lint.py` runs every check in about fifteen
seconds and prints a summary; `--check iast` (or any check name) prints every finding of one kind;
`--tsv out.tsv` writes them all. Nothing in it edits a file.

**The audit itself changed no corpus text.** The standing rule is that another session's file is
reported, not edited. The user then ruled on §6 the same day, and §7 records the 124 replacements
applied on that ruling. Two tool changes were made and are described in §5.

---

## 1. Findings that reach the reader — fix first

### 1a. Editorial notes were reaching the reader inside the last verse's Hindi field — FIXED in the parser

509 files carry editorial matter after their last unit: a `---` rule line and then
`Recension note:`, `Dedup:`, `Numbering:` and the like. The parser in `bin/reader_view.py`,
which the corpus build and the app's view both go through, read the last unit's final field up to
the end of the file. So in all 509 files the last `hi:` (or `vidhi:`) field handed the reader the
whole recension note, URLs and all. `build_corpus.py --check` reported the source-leak gate clean
because it looks only at header fields.

Fixed on 17 Oct 2026 in `reader_view.parse()`: a unit now ends at a rule line or at a known
editorial heading. Verified on `devi/main/12_indrakshi_stotram.txt` and `guru/14_totakashtakam.txt`.
No corpus file was touched; the files are well-formed, the parser was wrong.

### 1b. Sourcing written into the translation fields — 183 files, 1,109 places — NOT FIXED

The 2026-09-12 audit covered the header fields. The same thing was done inside `en:`, `tel:`,
`hi:` and `vidhi:` and was never counted: translators wrote source commentary into the meaning
itself — "stotranidhi.com, the base text here, together with shlokam.org and vedadhara.com print
kanatpratnalolāṁ…", "the Gītā Press page prints the daṇḍa here without the space it gives
elsewhere", "confirmed by both vignanam.org and sanskritdocuments.org's itx".

| field | places |
|---|---:|
| `en` | 626 |
| `vidhi` | 280 |
| `hi` | 140 |
| `tel` | 63 |

Counted with the strong terms only (site names, Gītā Press, "base text", "the print",
"collated", "recension", URLs); the looser words "the source" and "witness" were excluded because
they are ordinary words in a translation ("the source of all learning", "the witness of all").

Worst thirty files, by count:

```
 55  devi/lalita/04_kamakshi_stotram_2.txt
 50  devi/durga/16_durga_candrakala_stutih.txt
 42  devi/durga/10_durga_kavacam_brahmandamohanam.txt
 38  devi/saraswati/18_sharada_bhujanga_prayata_ashtakam.txt
 37  devi/durga/08_durga_apaduddharashtakam.txt
 35  devi/durga/05_devi_kavacam.txt
 35  devi/durga/14_tantrokta_ratri_suktam.txt
 30  puja/smarta/14_vinayaka_chaviti_vrata.txt
 28  Subrahmanya/22_shanmukha_stotram.txt
 23  devi/lalita/36_lalita_sahasranama_stotram.txt
 22  devi/durga/09_durga_kavacam.txt
 22  puja/smarta/24_anaghashtami_vrata_kalpam.txt
 20  devi/lalita/14_saundarya_lahari.txt
 19  puja/vrata/05_ananta_padmanabha_vrata_kalpam.txt
 18  devi/durga/11_dipa_durga_kavacam.txt
 17  devi/lalita/11_tripurasundari_pancaratna_stotram.txt
 16  devi/lakshmi/06_sri_suktam.txt
 16  devi/main/06_adya_stotram.txt
 14  devi/lakshmi/21_trailokya_mangala_lakshmi_stotram.txt
 14  vidhi/rigveda/01_rigveda_sandhyavandanam.txt
 12  devi/lalita/13_tripurasundari_vedapada_stotram.txt
 12  devi/lakshmi/05_mahalakshmyashtakam.txt
 12  Subrahmanya/06_kandar_shashthi_kavacam.txt
 11  devi/lakshmi/10_dhanalakshmi_stotram.txt
 11  puja/smarta/12_hanuman_nitya_puja.txt
 10  devi/lalita/10_tripurasundari_pratah_smaranam.txt
 10  devi/lalita/01_lalita_pancaratnam.txt
 10  rama/28_rama_sahasranama_stotram.txt
 10  puja/smarta/05_shiva_nitya_puja.txt
 10  puja/smarta/08_durga_nitya_puja.txt
```

This is a rewriting job, not a mechanical one: the sentence has to go and the meaning has to stay.
It is also a register fault under the 2026-09-12 rule, since none of it is for the reciter. The
full list is one command: `python3 bin/corpus_lint.py --check register` does not cover it;
run the strong-term scan in `reader_view.py --audit` once it is extended, or re-use the scan in
this session's log.

### 1c. A gadya passage printed with an ellipsis instead of its text — `devi/lakshmi/18_lakshmi_gadyam.txt`

Passage 10 (the gadya after śloka 5) reads, in the Devanāgarī and the IAST alike:
`… महितलावण्य महावाहिनि । (...long chain of further compound epithets describing her face, brow,
eyes, cheeks, ears and ornaments...) मन्थर तरमेहि …`. The reciter is handed an abridgement with an
English note in the middle of the Sanskrit. The passage has to be transcribed in full from the
source named in the file. This is the only place in the corpus where a `deva:` field elides text.

### 1d. Markdown markers in reader-facing fields — 117 files

`**bold**` and `` `code` `` in `Author` (52 files), `Blurb` (25) and in the `vidhi:` and `en:`
prose of the pūjā files (the rest). The app renders plain text, so the reader sees the asterisks.
Example, `Subrahmanya/53…`: `Author: The colophon places it in the **Rudrayāmala**. The text is
spoken by **Skanda** about himself (`श्रीस्कन्द उवाच`…)`. Stripping the markers is mechanical and
changes no word; it is listed here rather than done because of the standing rule.

### 1e. Sourcing in header reader fields — 244 files, 277 places (known, unchanged since September)

`python3 bin/reader_view.py --audit`. Down from 418 files / 597 places on 12 Sep. Still open.

---

## 2. The text itself — Devanāgarī and IAST

### 2a. Devanāgarī that cannot be shaped — 19 files, 28 places

These are codepoint-order faults, mostly from a PDF text layer: a vowel sign before its
consonant, a virāma after a space, a stray nukta. Every one renders with a dotted circle or a
wrong akṣara. The intended akṣara is unambiguous in each.

| file | unit | as written | should read |
|---|---|---|---|
| `vishnu/bhagavata/0205_account_creation.txt` | v12 | `भगवते़` | `भगवते` (stray nukta) |
| `vishnu/bhagavata/0332_course_those_go_path_smoke.txt` | v2 | `पितंॄश्च` | `पितॄंश्च` |
| `vishnu/bhagavata/1083_draupadi_speaks_chief_queens_lord.txt` | v12 | `भ्रातंॄश्च` | `भ्रातॄंश्च` |
| `vishnu/bhagavata/0412_kubera_boon_dhruva_dhruva_reaches.txt` | v1 | `बुद्ध ्य` | `बुद्ध्य` |
| `vishnu/bhagavata/0416_bards_praise_king_prthu.txt` | v13 | `दण्ड ्यं` | `दण्ड्यं` |
| `vishnu/bhagavata/0422_sanaka_other_sages_teach_king.txt` | v32 | `पे्रयस्` | `प्रेयस्` |
| `vishnu/bhagavata/0609_slaying_visvarupa_defeat_gods_vrtrasura.txt` | v17 | `दंष्टे्रण` | `दंष्ट्रेण` |
| `vishnu/bhagavata/0807_churning_ocean_begins_lord_sankara.txt` | v17 | `न्मू्र्ध्न` | `न्मूर्ध्न` |
| `vishnu/bhagavata/1062_meeting_usa_aniruddha.txt` | v none | `्कन्धे्र` | `स्कन्ध्रे` or `स्कन्धे` — read the page |
| `vishnu/bhagavata/0706_prahlada_teaching_asura_boys.txt` | v15 | `र्तुः।ं` | anusvāra after the daṇḍa; remove |
| `dattatreya/dvisahasri_gurucaritra/18_adhyaya_18_karmakandakathanam.txt` | v39, v107 | `द्ध्याान्`, `द्र्याादौ` | one `ा` each |
| `rama/sundarkand/03_dohas_11_15.txt` | v24 | `माहींं` | `माहीं` |
| `puja/vrata/06_satyanarayana_vrata_kalpam.txt` and its `puja/pauranika/vrata/` twin | u33, u91 | `वाहनांः`, `स्थित ंधनम्` | `वाहनाः` (or `वाहनां`; read the print), `स्थितं धनम्` |
| `vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt` | u3, u6 | `सूत्रंः अथ` | a Devanāgarī visarga used as a colon; `सूत्रं — अथ` |

Not faults, and now excluded from the check: `ग्ं` (the Taittirīya guttural nasal, 418
places), `ल्ँल` / `न्ँ` (anunāsika in sandhi, Bhāgavata), the free-standing `ँ` before `य`/`ल`
in the Taittirīya tarpaṇa and the Śrī Sūktam (how that printing marks the nasalised semivowel),
`ॐ-वंँ` in the Mahānyāsa (a bīja as printed), and the Tamil letters `ऱ ऴ ऩ ऎ ऒ` in the two
Tamil-in-Devanāgarī files.

### 2b. IAST that is not the transliteration of the Devanāgarī — 107 files

The corpus defines the `iast:` field as a mechanical transliteration of the `deva:` field. Where
the two disagree, one of them is wrong. `corpus_lint.py --check iast` lists every place, after
normalising the two nasal conventions, bracketed variants, spacing and punctuation. The
differences were read one by one and fall into four classes. Two Tamil files
(`Subrahmanya/06_kandar_shashthi_kavacam.txt`, `devi/main/09_abhirami_andadi.txt`) differ in
140 places by Tamil transliteration convention only (ḷ/ḻ, ṉ, ē/ō, s/ś) and are not listed.

**D — the Devanāgarī looks wrong and the IAST right (20 places).** The primary text needs a
witness check; the IAST already shows the expected reading.

| file | unit | deva has | IAST has | note |
|---|---|---|---|---|
| `devi/durga/10_durga_kavacam_brahmandamohanam.txt` | v12 | `नैऋत्यां` | nairṛtyāṁ | `नैर्ऋत्यां` |
| `devi/lakshmi/01_kanakadhara_stotram_shankara.txt` | — | taṭid | taḍid | `तडित्` is the word |
| `devi/lakshmi/10_dhanalakshmi_stotram.txt` | — | `श्रद्धधानानां` | śraddadhānānāṁ | `श्रद्दधानानां` |
| `devi/lalita/17_rajarajeshvari_kavacham.txt` | v79 | `ङकुश` | 'ṅkuśaḥ | missing virāma |
| `ganga/05_ganga_kavacam.txt` | v22 | cordhdva | cordhva | extra `द` |
| `ganga/05_ganga_kavacam.txt` | v28, v40 | `में` | me | Hindi `में` in a Sanskrit line |
| `ganga/05_ganga_kavacam.txt` | v29 | `पृष्टं` | pṛṣṭhaṁ | `पृष्ठं` |
| `guru/04_sri_guruparampara_stotram.txt` | v37 | `सद्ज्ञान` | sajjñāna | the sandhi fault CLAUDE.md names |
| `guru/17_guru_paduka_panchakam.txt` | v1 | `भावितभ्याम्` | bhāvitābhyām | `भाविताभ्याम्` |
| `hanuman/02_hanuman_chalisa.txt` | v13 | `वुर` | ura | `हरषि उर लाये` |
| `hanuman/08_ekamukha_hanumat_kavacham.txt` | v18 | `वीनाशनः` | vināśanaḥ | |
| `navagraha/02_navagraha_kavacham.txt` | v5 | `धृवम्` | dhruvam | |
| `navagraha/03_aditya_hridayam.txt` | v31 | `रविरवदद` | ravir avadan | `रविरवदन्निरीक्ष्य` |
| `rama/05_ramacandra_stuti.txt` | v5 | `भावल्लभं` | bhāvavallabhaṁ | a `व` dropped |
| `rama/05_ramacandra_stuti.txt` | v6 | `ऊर्वि` | urvī | `उर्वी` |
| `shiva/04_shiva_kavacham.txt` | v28 | `विस्फरित` | visphurita | |
| `shiva/04_shiva_kavacham.txt` | v28 | `मारयमाराय` | māraya māraya | |
| `shiva/15_shivaparadha_kshamapana_stotram.txt` | v5 | `पूष्प` | puṣpa | |
| `vidhi/rigveda/01_rigveda_sandhyavandanam.txt` | u14 | `संवथ्सरो` | saṁvatsaro | |

**W — a real disagreement between the two fields; a witness has to decide (33 places).**

```
ayyappa/11_dharma_sastha_stuti_dasakam      v3    āśrayāmi (deva) / āśraye (iast)
devi/annapurna/07_amba_annapurna_stuti_panchakam v2 durgahantrī / durgahantri
devi/durga/10_durga_kavacam_brahmandamohanam     sarvasiddhīśvarīśvari / sarvasiddhīśvareśvari
devi/gayatri/08_gayatri_lahari                    naiveme / naivemā
devi/lakshmi/07_sriguna_ratnakosha                anāghrātāvadyaṁ / anāghrātāvadhyaṁ
devi/lakshmi/17_lakshmi_lahari               v18  mahimā / mahiman
devi/lakshmi/20_mahalakshmi_stotram_mahendra_krutam v21 evaṁ / eva
devi/lalita/11_tripurasundari_pancaratna_stotram  cāmpeya / campeya
devi/lalita/14_saundarya_lahari             v21   taṭillekhā / taḍillekhā (both spellings are printed)
devi/lalita/14_saundarya_lahari                   taṭittvantaṁ / taḍittvantaṁ
devi/lalita/14_saundarya_lahari             v51   jananī / janani
devi/lalita/17_rajarajeshvari_kavacham            śrīgurornāma / śrīguroryathā; sundarī / sundarīṁ; śānti / śāntiṁ; an extra "na" in the IAST
devi/nadi/02_kaveri_stotram                 v4    kāverī / kāveri
devi/nadi/03_narmadashtakam                 v8    maheśikeśajāṭaṭe / maheśikeśajaṭate
devi/nadi/04_sri_godavari_ashtakam          v8    viśvavitā / viśvavittā
devi/syamala/01_syamala_dandakam            v6    mayūkhāvalī / mayūkhāvali; kelī / keli
devi/syamala/07_matangi_hrudayam            v13   aho / ahau
ganesha/17_vakratunda_ganesha_kavacham      v2    herambo / heramba
ganesha/30_ganapati_ashtottarashatanama_stotram v8 and name 43  kelilālita / kelilalita
guru/05_jagadguru_ratnamala                 v15   avāpta / āvāpta
guru/05_jagadguru_ratnamala                 v21   viduradvaita / vidurudvaita
guru/07_yatiraja_vimsati                    v6    vitarādaya / vitarādya
hanuman/09_hanumadashtakam                  v4    ūrmini / ūrmani
hanuman/09_hanumadashtakam                  v8    cora / caura
hanuman/20_panchamukha_hanumat_pancharatnam v2    nālī / nāli
shani/03_shani_mrityunjaya_stotram          v17   sauraye / saurāye
shani/03_shani_mrityunjaya_stotram          v55   manyūgra / manyugra
shani/03_shani_mrityunjaya_stotram          v63   āditika / ādityaka
shiva/10_natarajashtakam                    v9    punarjanireti / punarjaniretī
```

**I — the IAST is a typo and the Devanāgarī is sound (72 places, 55 files).** Regenerating the
one word from the Devanāgarī is the fix. In the form `file  unit  wrong → right`:

```
Subrahmanya/07_subrahmanya_kavaca_stotram   nyāsa ×2   ometi → omiti
ayyappa/11_dharma_sastha_stuti_dasakam      v7    bhavarogaṇi → bhavarogani
brahma/04_brahma_stavam_padmapurane         v14   prabodhum → praboddhum (√budh → boddhum)
devi/dasamahavidya/11_dhumavati_stotram     v2    mahāśaṛṅgam → mahāśṛṅgam
devi/dasamahavidya/13_tripura_bhairavi_stotram v7 bhavāṁś → bhavāmś
devi/dasamahavidya/21_tara_kavacam          v50   vasedhdhruvam → vaseddhruvam
devi/durga/03_argala_stotram                      sphuracchandra → sphuraccandra
devi/durga/16_durga_candrakala_stutih             udita'khila → uditā'khila
devi/durga/17_siddha_kunjika_stotram        v5    ucchāṭana → uccāṭana
devi/durga/38_saptashati_pathavidhi               stithiteṣu → sthiteṣu
devi/gayatri/02_gayatri_kavacham_1          v5 ×2 tatsaviturīti → tatsavituriti
devi/gayatri/06_gayatri_kavacham_2          v12   ūrvorokāra → ūrvoroṅkāra
devi/gayatri/08_gayatri_lahari                    tasmācharaṇam → tasmāccharaṇam; sahacarairtāraka → sahacaraistāraka
devi/goda/01_goda_stuti                     v9    himarucericha → himaruceriva; bhakteruthhatāṁ → bhakterutthitāṁ
devi/kalika/05_kali_stuti_brahma_krutam     v4    rociraūrjitāṁ → rocirūrjitāṁ
devi/lakshmi/07_sriguna_ratnakosha          v50   laghutharā → laghutarā
devi/lakshmi/10_dhanalakshmi_stotram        v14   kārūṇya → kāruṇya
devi/lakshmi/17_lakshmi_lahari                    virachitā → viracitā
devi/lalita/12_tripurasundari_manasapuja_stotram v12 samyata → saṁyata
devi/lalita/14_saundarya_lahari             ×3    girisha → giriśa
devi/lalita/17_rajarajeshvari_kavacham            ucchāṭane → uccāṭane; kuḍkumena → kuḍakumena
devi/lalita/18_sri_lalitha_hrudayam               kastūri → kastūrī
devi/lalita/19_kamakshi_navaratnamalika_stotram v3 śrīmacchinmaya → śrīmaccinmaya
devi/lalita/24_rajni_stotram                      cetho → ceto
devi/main/12_indrakshi_stotram              nyāsa ×2   ometi → omiti
devi/main/24_jvalamukhi_stotram_1           v6, v12  smarāririvā → smarāririva; rarśmi → raraśmi
devi/nadi/02_kaveri_stotram                 v8    munih → muniḥ
devi/pratyangira/06_pratyangira_kavacam_2   v67   hunedhyāna → huneddhyāna
devi/saraswati/16_kamalajadayita_ashtakam   v8    śrutimanani → śrutimananani
devi/syamala/03_syamala_kavacam             v24   ḍādhiphānta → ḍādiphānta
ganesha/18_ganesha_mahimna_stotram          v10, v14, v23, v29  procchair → proccair; dayāluherambo → dayālurherambo ×2; mamettthaṁ → mametthaṁ
ganga/02_gangashtakam                       v1, v8  tarṅge → taraṅge; agahare → aghahare
guru/04_sri_guruparampara_stotram           v32, v40  ramaṇīyaka → rāmaṇīyaka; saccidananda → saccidānanda
guru/05_jagadguru_ratnamala                 v18   mauliṣevaḥ → maulisevaḥ
guru/07_yatiraja_vimsati                    v1, v6  vimśatim → viṁśatim; nom̐i som̐ya → naumi saumya; gaṇẏa → gaṇya
hanuman/09_hanumadashtakam                  v2    tanoraativelaṁ → tanorativelaṁ
hanuman/11_vibhishana_krita_hanumat_stotram v15, v17  rataya → ratāya; ghorśabda → ghoraśabda
krishna/11_radha_stotram_uddhava_krtam      v1, v3, v17, v25  suravindatam → suravanditam; vāsinya → vāsinyai; māheśvaryaiḥ → māheśvaryai; śaityayauḥ → śaityayoḥ; sūryakayor → sūryayor
krishna/16_gopala_vimshati                  v13   vrajāṅgaṇānāṁ → vrajāṅganānāṁ
kubera/01_sri_kubera_stotram                v2    niratah → nirataḥ
navagraha/01_navagraha_stotram              v11   du:svapna → duḥsvapna
shani/03_shani_mrityunjaya_stotram          v22, v64, v90  yasecchaitra → nyaseccaitra; tulocasthāya → tuloccasthāya; sauriḥ japed → saurirjaped
shiva/04_shiva_kavacham                     v12   chaturmukho → caturmukho
shiva/17_vaidyanathashtakam                 v9    mahārogu → mahāroga
venkateswara/01_venkateswara_suprabhatam    v24   varnin → varṇin
venkateswara/03_venkateswara_prapatti       v1    veṅkaṭater → veṅkaṭapater
vidhi/madhyandina/01_sandhyopasana_vidhi    u25   udagad → udagād
vidhi/rigveda/01_rigveda_sandhyavandanam    u15   itysya → ityasya
vishnu/10_sankashtanashana_vishnu_stotram   v3    suräṇāṁ → surāṇāṁ
vishnu/13_vishnu_bhujanga_prayata_stotram   v10   kaṣṭamekaḥ → kaṣṭameko
```

**C — convention, no action (about 50 places).** Double avagraha `ऽऽ` written `'ā` against
the generator's `''`; `ळ` as ḷ against the generator's ḻ; vocalic l written ḷ where the
Devanāgarī prints `लृ`; a final `म्` as m against ṁ; word spacing; the accented IAST of the Śrī
Sūktam and the Taittirīya files (18 places, listed under `iast-vedic-tamil`). None of these is
an error in either field.

**N — editorial brackets left inside the Devanāgarī (3 places).**
`devi/lakshmi/15_mahalakshmyashtakam_indrakrutam.txt` `[yogajñe]`,
`devi/lalita/17_rajarajeshvari_kavacham.txt` v49 `sa[kā]mākarṣaṇa`,
`krishna/04_krishna_kavacham_1.txt` v9 `[bhuk]`; and `vishnu/25_vishnu_sahasranama_stotram.txt`
v73 carries the English word "Alternatively" inside a `deva:` line. A reciter should not meet
square brackets or English in the Sanskrit; the bracket rule of 2026-09-12 uses round brackets for
a variant and the editorial fields for everything else.

### 2c. The same verse twice in one file — 2 to check, 7 deliberate

- `rama/valmiki_aranyakanda/04_sarga_04_rama_lakshmana_slay_viradha.txt`: verses 12 and 26 are
  identical (`इत्युक्त्वा लक्ष्मणं रामः प्रदरः खन्यतामिति …`). The critical edition on GRETIL does
  not carry the line under any spelling tried, so it cannot adjudicate. The file is text-only,
  written 3 Oct from the Gītā Press page and the IITK text; read the page again at those two places.
- `vishnu/bhagavata/1023_lord_grace_wives_brahmanas_performing.txt`: verses 10 and 47 identical.
  **Genuine** — GRETIL's Bhāgavata has `deśaḥ kālaḥ pṛthag dravyaṃ` at both 10.23.10 and 10.23.48.
- Deliberate repeats, no action: the śānti-pāṭha closing the Gaṇapati Atharvaśīrṣa; the dhyānam
  repeated in the uttara-nyāsa of the Lalitā Sahasranāma and the Vāsyavārāhī Stotram; the
  Kāmākṣī Stotram's refrain; the tarpaṇa and sandhyā units that recur by rite.

### 2d. Two Tamil files whose Devanāgarī is not Devanāgarī

`devi/goda/02_tiruppavai.txt` carries Tamil script in its `deva:` field (30 units), and
`devi/goda/04_naacciyar_tirumozhi.txt` carries Tamil script in **visual order** — the prefixed
vowel signs `ெ` and `ை` stand before their consonant (`ெவள்ைள` for `வெள்ளை`), the signature of a
PDF text layer. The second file is unreadable as it stands and needs re-transcription; the first
is a design decision (a Tamil text in Tamil letters) that the app's `deva` label does not describe.

---

## 3. Structure

- **Section headers that do not list a section the units use** — 82 files (mid), plus 33 files
  that use two or more sections and have no `Sections:` header. Mostly `Colophon`, `Phalaśruti`
  and `Dhyānam` left out of the header; in the sahasranāma files, the long "Extra — not in the
  printed text (…)" labels. If the app builds its section navigation from the header, these
  sections are not reachable from it. `corpus_lint.py --check sections`.
- **Numbering** — 23 files. Deliberate restarts at a section boundary (the pūrvapīṭhikā,
  dhyānam and stotram of a sahasranāma each count from 1) are reported as `low` and are fine.
  Worth a look: `Subrahmanya/02…` repeats 23; `devi/main/15_kamakhya_stotram.txt` repeats 3;
  `ganga/05_ganga_kavacam.txt` skips 5 and 51; `dattatreya/dvisahasri_gurucaritra/13…` jumps
  32 → 43 and `18…` 173 → 175 (the print's own numbering jumps, per the folder memory — confirm
  it is that and not a dropped verse); `rama/sundarkand/00_kishkindhakanda_doha_29_30.txt`
  numbers by the source's dohā numbers, which is intended.
- **Header fields** — `devi/lalita/14_saundarya_lahari.txt` has no `Source / recension` field
  (its sourcing sits under another heading); `devi/main/03_anandalahari.txt` is the pointer stub
  and is meant to be bare; `rama/sundarkand/00_kishkindhakanda_doha_29_30.txt` has Devanāgarī in
  its IAST `Title`.
- **Verse numbers embedded in the Devanāgarī** (`॥ १ ॥`) — 407 files, 2,953 units, against the
  file-format rule "no embedded verse numbers". Concentrated in the Guru Caritra (1,164), the
  Bhāgavata (335), `shiva/` (252), `devi/dasamahavidya/` (187). Not a fault in any one file, but
  the corpus is split two ways on it and the reader sees both. A ruling, then one sweep.
- **Last line of a verse with no daṇḍa** — 412 files, 1,937 units; and 7 places where the daṇḍa
  count differs between the Devanāgarī and the IAST on one line. `--check danda`. Low.
- **Translations spanning several lines** — 27 files, all pūjā and vrata kathā prose and the
  Vārāhī and Guru files; the parser handles it, the house style says one line. Low.
- **Zero-width joiners and soft hyphens** — 134 files, almost all ZWJ/ZWNJ inside conjuncts.
  They change the rendering of a conjunct and nothing else; `dev2iast` ignores them. Low.
- **No `Blurb`** — 614 files: the 332 Bhāgavata and 281 Vālmīki text-only files, plus one
  reservation stub. Known; they await their meanings.
- **Register** — 42 places: "the dead" (mostly the Guru Caritra's pretasañjīvana chapters,
  where it is the narrative subject), "the whole point" ×6, "most striking" ×1, two contractions.
  `--check register`.
- **Exact duplicate files** — none. Near-duplicates: `bin/variant_sweep.py` still lists the nine
  candidate pairs recorded on 19 Sep, awaiting the user's ruling.
- **Reservation stub** — `puja/smarta/51_sravana_mangalagauri_vrata_challa.txt`, still reserved
  by another session.

---

## 4. Checks that passed

- Encoding: no CRLF, tabs, BOM, non-breaking spaces, or U+FFFD anywhere; every file is NFC.
- No `Title` empty; every `Devanāgarī` title is Devanāgarī and every `Telugu` title is Telugu.
- No `tel:` field without Telugu, no `hi:` field without Devanāgarī, no `en:` field that is
  mostly Devanāgarī, no `en`/`tel` pair that is the same text, no `hi` that merely repeats the
  verse — across all 31,530 translated units.
- Svara marks: order already clean (`svara_order_sweep.py`); no accented line is numbered; no
  ASCII colon stands for visarga except the ten places `audit.py --checks` already lists.
- No accent in a stotra shelf except the four files that are Vedic texts filed by deity (Śrī
  Sūktam, Gaṇapati Atharvaśīrṣa, the two Pitṛ Sūktas).
- Name tables: every one of the 78 numbers 1 to N without a break, and every `Name count`
  matches the table (except where `audit.py` already reports it).

---

## 5. What changed in this session

1. `bin/corpus_lint.py` — new, read-only, documented at its head. Run it after any batch of
   authoring; the `high` findings should be zero on a new file.
2. `bin/reader_view.py` — `parse()` now ends a unit at a trailing `---` rule or editorial heading
   (finding 1a). This is the only behavioural change; `build_corpus.py` and `audit.py` inherit it.
3. This document.

## 6. The ruling this audit needed

The standing rule keeps this session from editing another session's file, so nothing in sections
1b–1d, 2a, 2b or 2d is fixed. In order of harm to the reciter:

1. **2b-I (72 IAST typos)** and **2a (28 broken akṣaras)** are mechanical, unambiguous, and can be
   applied in one pass with a before/after listing.
2. **2b-D (20 Devanāgarī faults)** change the primary text; each is a one-word fix whose correct
   form is already in the IAST, but the rule asks for a witness before the Devanāgarī moves.
3. **1c, 2d** need re-transcription from the source.
4. **1b (183 files)** and **1d (117 files)** are prose work and a strip sweep respectively.
5. **2b-W (33 places)** need a witness each.

---

## 7. Applied on 17 Oct 2026, on the user's ruling

The user ruled the same day: apply all three classes. 124 replacements in 74 files, each scoped
to one unit and one field, each asserted to occur exactly once there before it was written. The
listing below is the record. `corpus_lint.py` afterwards: `deva-akshara` 0 outside the printing
conventions, `iast` down from 107 files to 64, all of them the W and C classes of §2b.

Two changes of mind while applying, both from re-reading the pairs: `kāruṇya` (Dhanalakṣmī v14)
and `saccidānanda` (Guruparamparā v40) were Devanāgarī faults, not IAST ones, and are under D;
`rocanā-kuḍakumena` (Rājarājeśvarī Kavaca v149) was wrong in both fields and is now `kuṅkumena`
in both; `urvī/ūrvi` (Rāmacandra Stuti v6) and `bhavāmś/bhavāṁś` (Tripurabhairavī v7) were left
alone for a witness.

**Devanāgarī faults (§2b-D) — 23**

```
devi/durga/10_durga_kavacam_brahmandamohanam.txt               verse 12     deva  नैऋत्यां  →  नैर्ऋत्यां
devi/lakshmi/01_kanakadhara_stotram_shankara.txt               verse 5      deva  तटिदङ्गनेव  →  तडिदङ्गनेव
devi/lakshmi/10_dhanalakshmi_stotram.txt                       verse 5      deva  श्रद्धधानानां  →  श्रद्दधानानां
devi/lakshmi/10_dhanalakshmi_stotram.txt                       verse 14     deva  कारूण्य  →  कारुण्य
devi/lalita/17_rajarajeshvari_kavacham.txt                     verse 79     deva  ऽङकुशः  →  ऽङ्कुशः
devi/lalita/17_rajarajeshvari_kavacham.txt                     verse 149    deva  रोचनाकुडकुमेनैव  →  रोचनाकुङ्कुमेनैव
ganga/05_ganga_kavacam.txt                                     verse 22     deva  र्ध्द्व  →  र्ध्व
ganga/05_ganga_kavacam.txt                                     verse 28     deva  में  →  मे
ganga/05_ganga_kavacam.txt                                     verse 40     deva  में  →  मे
ganga/05_ganga_kavacam.txt                                     verse 29     deva  पृष्टं  →  पृष्ठं
guru/04_sri_guruparampara_stotram.txt                          verse 37     deva  सद्ज्ञान  →  सज्ज्ञान
guru/04_sri_guruparampara_stotram.txt                          verse 40     deva  सच्चिदनन्द  →  सच्चिदानन्द
guru/17_guru_paduka_panchakam.txt                              verse 1      deva  भावितभ्याम्  →  भाविताभ्याम्
hanuman/02_hanuman_chalisa.txt                                 verse 13     deva  वुर  →  उर
hanuman/08_ekamukha_hanumat_kavacham.txt                       verse 18     deva  वीनाशनः  →  विनाशनः
navagraha/02_navagraha_kavacham.txt                            verse 5      deva  धृवम्  →  ध्रुवम्
navagraha/03_aditya_hridayam.txt                               verse 31     deva  रविरवददनिरीक्ष्य  →  रविरवदन्निरीक्ष्य
rama/05_ramacandra_stuti.txt                                   verse 5      deva  भावल्लभं  →  भाववल्लभं
shiva/04_shiva_kavacham.txt                                    verse 28     deva  विस्फरित  →  विस्फुरित
shiva/04_shiva_kavacham.txt                                    verse 28     deva  मारयमाराय  →  मारयमारय
shiva/15_shivaparadha_kshamapana_stotram.txt                   verse 5      deva  पूष्प  →  पुष्प
vidhi/rigveda/01_rigveda_sandhyavandanam.txt                   unit 14      deva  संवथ्स॒रो  →  संवत्स॒रो
devi/lalita/17_rajarajeshvari_kavacham.txt                     verse 149    iast  rocanākuḍkumenaiva  →  rocanākuṅkumenaiva
```

**Akṣaras that could not shape (§2a) — 20**

```
dattatreya/dvisahasri_gurucaritra/18_adhyaya_18_karmakandakathanam.txt verse 39     deva  द्ध्याान्  →  द्ध्यान्
dattatreya/dvisahasri_gurucaritra/18_adhyaya_18_karmakandakathanam.txt verse 107    deva  द्र्याादौ  →  द्र्यादौ
puja/vrata/06_satyanarayana_vrata_kalpam.txt                   unit 33      deva  वाहनांः।  →  वाहनां।
puja/vrata/06_satyanarayana_vrata_kalpam.txt                   unit 91      deva  स्थित ंधनम्  →  स्थितं धनम्
puja/pauranika/vrata/06_satyanarayana_vrata_kalpam.txt         unit 33      deva  वाहनांः।  →  वाहनां।
puja/pauranika/vrata/06_satyanarayana_vrata_kalpam.txt         unit 91      deva  स्थित ंधनम्  →  स्थितं धनम्
rama/sundarkand/03_dohas_11_15.txt                             verse 24     deva  माहींं  →  माहीं
vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt        unit 3       deva  सूत्रंः अथ  →  सूत्रम् — अथ
vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt        unit 6       deva  सूत्रंः इदमापः  →  सूत्रम् — इदमापः
vishnu/bhagavata/0205_account_creation.txt                     verse 12     deva  भगवते़  →  भगवते
vishnu/bhagavata/0332_course_those_go_path_smoke.txt           verse 2      deva  पितंॄश्च  →  पितॄंश्च
vishnu/bhagavata/1083_draupadi_speaks_chief_queens_lord.txt    verse 12     deva  भ्रातंॄश्च  →  भ्रातॄंश्च
vishnu/bhagavata/0412_kubera_boon_dhruva_dhruva_reaches.txt    verse 1      deva  बुद्ध ्य  →  बुद्ध्य
vishnu/bhagavata/0416_bards_praise_king_prthu.txt              verse 13     deva  दण्ड ्यं  →  दण्ड्यं
vishnu/bhagavata/0422_sanaka_other_sages_teach_king.txt        verse 32     deva  पे्रयस्  →  प्रेयस्
vishnu/bhagavata/0609_slaying_visvarupa_defeat_gods_vrtrasura.txt verse 17     deva  दंष्टे्रण  →  दंष्ट्रेण
vishnu/bhagavata/0706_prahlada_teaching_asura_boys.txt         verse 15     deva  र्तुः।ं  →  र्तुः।
vishnu/bhagavata/0807_churning_ocean_begins_lord_sankara.txt   verse 17     deva  न्मू्र्ध्न  →  न्मूर्ध्न
vishnu/bhagavata/1062_meeting_usa_aniruddha.txt                verse none   deva  स्कन्धे्र  →  स्कन्धे
vishnu/bhagavata/0706_prahlada_teaching_asura_boys.txt         verse 15     iast  |ṁ  →  |
```

**IAST typos (§2b-I) — 69**

```
Subrahmanya/07_subrahmanya_kavaca_stotram.txt                  verse none   iast  bhūrbhuvassuvarometi  →  bhūrbhuvassuvaromiti
Subrahmanya/07_subrahmanya_kavaca_stotram.txt                  verse none   iast  bhūrbhuvassuvarometi  →  bhūrbhuvassuvaromiti
ayyappa/11_dharma_sastha_stuti_dasakam.txt                     verse 7      iast  bhavarogaṇivāraṇāya  →  bhavaroganivāraṇāya
brahma/04_brahma_stavam_padmapurane.txt                        verse 14     iast  prabodhumicchanti  →  praboddhumicchanti
devi/dasamahavidya/11_dhumavati_stotram.txt                    verse 2      iast  yamamahiṣamahāśaṛṅgamādāyapāṇau  →  yamamahiṣamahāśṛṅgamādāyapāṇau
devi/dasamahavidya/21_tara_kavacam.txt                         verse 50     iast  vasedhdhruvam  →  vaseddhruvam
devi/durga/03_argala_stotram.txt                               verse none   iast  sphuracchandrakalāratnamukuṭāṁ  →  sphuraccandrakalāratnamukuṭāṁ
devi/durga/16_durga_candrakala_stutih.txt                      verse 3      iast  ekībhavadbhirudita'khilalokaguptyai  →  ekībhavadbhiruditā'khilalokaguptyai
devi/durga/17_siddha_kunjika_stotram.txt                       verse 5      iast  stambhanocchāṭanādikam  →  stambhanoccāṭanādikam
devi/durga/38_saptashati_pathavidhi.txt                        verse none   iast  amukābhukarāśistithiteṣu  →  amukābhukarāśisthiteṣu
devi/gayatri/02_gayatri_kavacham_1.txt                         verse 5      iast  tatsaviturīti  →  tatsavituriti
devi/gayatri/02_gayatri_kavacham_1.txt                         verse 6      iast  tatsaviturīti  →  tatsavituriti
devi/gayatri/06_gayatri_kavacham_2.txt                         verse 12     iast  ūrvorokārarūpā  →  ūrvoroṅkārarūpā
devi/gayatri/08_gayatri_lahari.txt                             verse 11     iast  tasmācharaṇamupayātaḥ  →  tasmāccharaṇamupayātaḥ
devi/gayatri/08_gayatri_lahari.txt                             verse 17     iast  sahacarairtāraka  →  sahacaraistāraka
devi/goda/01_goda_stuti.txt                                    verse 29     iast  vikasitabhakteruthhatāṁ  →  vikasitabhakterutthitāṁ
devi/goda/01_goda_stuti.txt                                    verse 9      iast  himarucericha  →  himaruceriva
devi/kalika/05_kali_stuti_brahma_krutam.txt                    verse 4      iast  atarkyarociraūrjitāṁ  →  atarkyarocirūrjitāṁ
devi/lakshmi/07_sriguna_ratnakosha.txt                         verse 50     iast  pavanātmajāllaghutharā  →  pavanātmajāllaghutarā
devi/lakshmi/17_lakshmi_lahari.txt                             verse 41     iast  paṇḍitarājaśrījagannāthavirachitā  →  paṇḍitarājaśrījagannāthaviracitā
devi/lalita/12_tripurasundari_manasapuja_stotram.txt           verse 12     iast  prayatnasamyatendriyaiḥ  →  prayatnasaṁyatendriyaiḥ
devi/lalita/14_saundarya_lahari.txt                            verse 12     iast  girishasāyujyapadavīm  →  giriśasāyujyapadavīm
devi/lalita/14_saundarya_lahari.txt                            verse 51     iast  girishacarite  →  giriśacarite
devi/lalita/14_saundarya_lahari.txt                            verse 78     iast  siddhergirishanayanānāṁ  →  siddhergiriśanayanānāṁ
devi/lalita/17_rajarajeshvari_kavacham.txt                     verse 77     iast  vimalocchāṭane'vatu  →  vimaloccāṭane'vatu
devi/lalita/18_sri_lalitha_hrudayam.txt                        verse 99     iast  kastūritilakāṅkitāṁ  →  kastūrītilakāṅkitāṁ
devi/lalita/19_kamakshi_navaratnamalika_stotram.txt            verse 3      iast  śrīmacchinmaya  →  śrīmaccinmaya
devi/lalita/24_rajni_stotram.txt                               verse 3      iast  danujarākṣasaduṣṭacetho  →  danujarākṣasaduṣṭaceto
devi/main/12_indrakshi_stotram.txt                             verse none   iast  bhūrbhuvassuvarometi  →  bhūrbhuvassuvaromiti
devi/main/12_indrakshi_stotram.txt                             verse none   iast  bhūrbhuvassuvarometi  →  bhūrbhuvassuvaromiti
devi/main/24_jvalamukhi_stotram_1.txt                          verse 12     iast  koṭisahasrarśmisadṛśīṁ  →  koṭisahasraraśmisadṛśīṁ
devi/main/24_jvalamukhi_stotram_1.txt                          verse 6      iast  smarāririvā  →  smarāririva
devi/nadi/02_kaveri_stotram.txt                                verse 8      iast  munih  →  muniḥ
devi/pratyangira/06_pratyangira_kavacam_2.txt                  verse 67     iast  hunedhyāna  →  huneddhyāna
devi/saraswati/16_kamalajadayita_ashtakam.txt                  verse 8      iast  śrutimananididhyāsanānyāśu  →  śrutimanananididhyāsanānyāśu
devi/syamala/03_syamala_kavacam.txt                            verse 24     iast  ḍādhiphānta  →  ḍādiphānta
ganesha/18_ganesha_mahimna_stotram.txt                         verse 10     iast  sakṛtprocchairuccāritamiti  →  sakṛtproccairuccāritamiti
ganesha/18_ganesha_mahimna_stotram.txt                         verse 14     iast  maṅgalanidhi-rdayāluherambo  →  maṅgalanidhi-rdayālurherambo
ganesha/18_ganesha_mahimna_stotram.txt                         verse 23     iast  dayāluherambo  →  dayālurherambo
ganesha/18_ganesha_mahimna_stotram.txt                         verse 29     iast  mamettthaṁ  →  mametthaṁ
ganga/02_gangashtakam.txt                                      verse 1      iast  taralataratarṅge  →  taralatarataraṅge
ganga/02_gangashtakam.txt                                      verse 8      iast  trijagadagahare  →  trijagadaghahare
guru/04_sri_guruparampara_stotram.txt                          verse 32     iast  kāmadviradapañcāsyaramaṇīyakamandiram  →  kāmadviradapañcāsyarāmaṇīyakamandiram
guru/05_jagadguru_ratnamala.txt                                verse 18     iast  satatāhitacandramauliṣevaḥ  →  satatāhitacandramaulisevaḥ
guru/07_yatiraja_vimsati.txt                                   verse 1      iast  nom̐i som̐yavarayogipuṅgavam  →  naumi saumyavarayogipuṅgavam
guru/07_yatiraja_vimsati.txt                                   verse 1      iast  yatirājavimśatim  →  yatirājaviṁśatim
guru/07_yatiraja_vimsati.txt                                   verse 6      iast  śiṣṭāgragaṇẏajanasevyabhavatpadābje  →  śiṣṭāgragaṇyajanasevyabhavatpadābje
hanuman/09_hanumadashtakam.txt                                 verse 2      iast  saṁsṛtitāpamahānaladagdhatanūruhamarmatanoraativelaṁ  →  saṁsṛtitāpamahānaladagdhatanūruhamarmatanorativelaṁ
hanuman/11_vibhishana_krita_hanumat_stotram.txt                verse 15     iast  rāmabhaktirataya  →  rāmabhaktiratāya
hanuman/11_vibhishana_krita_hanumat_stotram.txt                verse 17     iast  kilkilābubukoccāraghorśabdakarāya  →  kilkilābubukoccāraghoraśabdakarāya
krishna/11_radha_stotram_uddhava_krtam.txt                     verse 1      iast  brahmādisuravindatam  →  brahmādisuravanditam
krishna/11_radha_stotram_uddhava_krtam.txt                     verse 17     iast  māheśvaryaiḥ  →  māheśvaryai
krishna/11_radha_stotram_uddhava_krtam.txt                     verse 25     iast  jalaśaityayauḥ  →  jalaśaityayoḥ
krishna/11_radha_stotram_uddhava_krtam.txt                     verse 25     iast  sūryakayoryathā  →  sūryayoryathā
krishna/11_radha_stotram_uddhava_krtam.txt                     verse 3      iast  tulasīvanavāsinya  →  tulasīvanavāsinyai
krishna/16_gopala_vimshati.txt                                 verse 13     iast  vrajāṅgaṇānāṁ  →  vrajāṅganānāṁ
kubera/01_sri_kubera_stotram.txt                               verse 2      iast  dharmaniratah  →  dharmanirataḥ
navagraha/01_navagraha_stotram.txt                             verse 11     iast  bhaveddu:svapnanāśanam  →  bhavedduḥsvapnanāśanam
shani/03_shani_mrityunjaya_stotram.txt                         verse 22     iast  ūrvorn yasecchaitramāsaṁ  →  ūrvornyaseccaitramāsaṁ
shani/03_shani_mrityunjaya_stotram.txt                         verse 64     iast  tulocasthāya  →  tuloccasthāya
shani/03_shani_mrityunjaya_stotram.txt                         verse 90     iast  sauriḥ japedetat  →  saurirjapedetat
shiva/04_shiva_kavacham.txt                                    verse 12     iast  trilocanaścāruchaturmukho  →  trilocanaścārucaturmukho
shiva/17_vaidyanathashtakam.txt                                verse 9      iast  mahārogunivāraṇam  →  mahāroganivāraṇam
venkateswara/01_venkateswara_suprabhatam.txt                   verse 24     iast  varnin  →  varṇin
venkateswara/03_venkateswara_prapatti.txt                      verse 1      iast  veṅkaṭaterviṣṇoḥ  →  veṅkaṭapaterviṣṇoḥ
vidhi/madhyandina/01_sandhyopasana_vidhi.txt                   unit 25      iast  devānāmudagadanīkaṁ  →  devānāmudagādanīkaṁ
vidhi/rigveda/01_rigveda_sandhyavandanam.txt                   unit 15      iast  tatsavituritysya  →  tatsaviturityasya
vishnu/10_sankashtanashana_vishnu_stotram.txt                  verse 3      iast  ramāvallabhāyā'suräṇāṁ  →  ramāvallabhāyā'surāṇāṁ
vishnu/13_vishnu_bhujanga_prayata_stotram.txt                  verse 10     iast  kaṣṭamekaḥ  →  kaṣṭameko
```

**IAST re-synced to the corrected Devanāgarī — 12**

```
navagraha/03_aditya_hridayam.txt                               verse 31     iast  ravir avadan nirīkṣya  →  raviravadannirīkṣya
puja/pauranika/vrata/06_satyanarayana_vrata_kalpam.txt         unit 33      iast  sahavāhanāṁḥ  →  sahavāhanāṁ
puja/vrata/06_satyanarayana_vrata_kalpam.txt                   unit 33      iast  sahavāhanāṁḥ  →  sahavāhanāṁ
vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt        unit 3       iast  sūtraṁḥ  →  sūtram —
vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt        unit 6       iast  sūtraṁḥ  →  sūtram —
vishnu/bhagavata/0332_course_those_go_path_smoke.txt           verse 2      iast  pitaṁśca  →  pitṝṁśca
vishnu/bhagavata/0412_kubera_boon_dhruva_dhruva_reaches.txt    verse 1      iast  pratibuddha ya  →  pratibuddhya
vishnu/bhagavata/0416_bards_praise_king_prthu.txt              verse 13     iast  nādaṇḍa yaṁ  →  nādaṇḍyaṁ
vishnu/bhagavata/0422_sanaka_other_sages_teach_king.txt        verse 32     iast  perayastvamātmanaḥ  →  preyastvamātmanaḥ
vishnu/bhagavata/0609_slaying_visvarupa_defeat_gods_vrtrasura.txt verse 17     iast  raudradaṁṣṭeraṇa  →  raudradaṁṣṭreṇa
vishnu/bhagavata/1062_meeting_usa_aniruddha.txt                verse none   iast  daśamaskandhera  →  daśamaskandhe
vishnu/bhagavata/1083_draupadi_speaks_chief_queens_lord.txt    verse 12     iast  bhrātaṁśca  →  bhrātṝṁśca
```

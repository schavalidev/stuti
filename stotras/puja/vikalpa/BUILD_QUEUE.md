# Non-Vedic pūjā and vrata vidhānas — build queue

Re-audited 2026-09-13 after the first scan was found to under-detect. Two Vedic elements were
missing from it and both are near-universal: the **prāṇāhuti** at the naivedya
(`ॐ प्राणाय स्वाहा … अमृतोपस्तरणमसि`) and the **deity gāyatrī** (`… विद्महे … प्रचोदयात्`).
A zero-width space inside `शीर्​षा` had also hidden the Puruṣa Sūkta in the Viṣṇu pūjā.
Normalisation now strips zero-width characters as well as svara marks before matching.

The earlier tiering said 14 files were mechanical. That was wrong. The true figure is one.

## How the work actually divides

129 units mix Vedic and Paurāṇika text in one unit, and those are the units that need a
hand-declared substitution rather than a whole-unit drop. They fall into 70 patterns, but
the distribution is very uneven, and that is what sets the tiers:

- **4 patterns cover 35 units** — the shared pūrvāṅga: the ācamana `स्वाहā`, the naivedya
  prāṇāhuti in its two forms, and `आपो हि ष्ठा` at the bath. Declared once, they apply across
  13 files.
- **~10 units are the deity gāyatrī**, one per file, and in every case the Paurāṇika
  dhyāna-śloka already sits in the same unit, so the Vedic lines are simply lifted out.
- **66 of the 129 sit in just three files** — Śiva 17, Sūrya 22 and Anaghāṣṭamī 24 — where the
  Vedic mantra is the mantra *of each service*, one per upacāra. Those three belong with the
  woven group, not with the tractable one.

### Done — 1 file

Built and delivered.

- `puja/smarta/14_vinayaka_chaviti_vrata.txt` — Śrī Varasiddhi Vināyaka Vrata  
  60 units, 100 accent marks. Puruṣa Sūkta, Gaṇānāṁ tvā, kalaśa / Āpo vā idaṁ, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, Asunīte ṚV 10.59.6

### Tier B — tractable — 17 files

The Vedic material sits in its own units or in a handful of mixed units following a shared pattern. Each file needs the common substitution set plus a small number of declared edits.

- `puja/smarta/01_nitya_puja_vidhanam.txt` — Nitya Pūjā Vidhānam (Smārta Paddhati)  
  55 units, 117 accent marks, 4 mixed units. Vāk Sūkta, Āpo hi ṣṭhā, kalaśa / Āpo vā idaṁ, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, prāṇāhuti
- `puja/smarta/02_sankshipta_puja_vidhanam.txt` — Saṅkṣipta Pūjā Vidhānam (Smārta Paddhati)  
  31 units, 41 accent marks, 1 mixed units. Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, prāṇāhuti
- `puja/smarta/03_purvanga_vidhanam.txt` — Pūjā Vidhānam  
  31 units, 98 accent marks, 2 mixed units. Vāk Sūkta, kalaśa / Āpo vā idaṁ, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma
- `puja/smarta/04_ganapati_nitya_puja.txt` — Gaṇapati Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 162 accent marks, 4 mixed units. Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti, Asunīte ṚV 10.59.6
- `puja/smarta/05_shiva_nitya_puja.txt` — Śiva Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 164 accent marks, 6 mixed units. Rudra / Śatarudrīya, Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/06_vishnu_nitya_puja.txt` — Viṣṇu Nitya Pūjā Vidhānam (Smārta Paddhati)  
  59 units, 195 accent marks, 7 mixed units. Puruṣa Sūkta, Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/09_saraswati_nitya_puja.txt` — Sarasvatī Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 132 accent marks, 5 mixed units. Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, Sarasvatī ṛcs, prāṇāhuti
- `puja/smarta/10_subrahmanya_nitya_puja.txt` — Subrahmaṇya Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 118 accent marks, 5 mixed units. Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/11_surya_nitya_puja.txt` — Sūryanārāyaṇa Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 188 accent marks, 7 mixed units. Puruṣa Sūkta, Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/12_hanuman_nitya_puja.txt` — Hanumān Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 92 accent marks, 4 mixed units. Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/13_navagraha_nitya_puja.txt` — Navagraha Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 92 accent marks, 3 mixed units. Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, prāṇāhuti, Sūrya mantras
- `puja/smarta/15_mahaganapati_shodashopachara_puja.txt` — Mahāgaṇapati Ṣoḍaśopacāra Pūjā (Mudgala Purāṇa recension)  
  38 units, 122 accent marks, 6 mixed units. Gaṇānāṁ tvā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, prāṇāhuti, Asunīte ṚV 10.59.6
- `puja/smarta/16_anjaneya_shodashopachara_puja.txt` — Āñjaneya Ṣoḍaśopacāra Pūjā (second recension)  
  33 units, 47 accent marks, 4 mixed units. Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/20_saraswati_shodashopachara_puja.txt` — Śrī Sarasvatī Ṣoḍaśopacāra Pūjā (second recension)  
  30 units, 83 accent marks, 2 mixed units. Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, Sarasvatī ṛcs, prāṇāhuti
- `puja/smarta/21_subrahmanya_shodashopachara_puja.txt` — Śrī Subrahmaṇya Ṣoḍaśopacāra Pūjā (second recension)  
  34 units, 47 accent marks, 2 mixed units. Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/26_sravana_mangalagauri_vrata_kalpam.txt` — Śrī Śrāvaṇa Maṅgaḷagaurī Vrata Kalpam  
  55 units, 81 accent marks, 1 mixed units. Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, prāṇāhuti, Asunīte ṚV 10.59.6
- `puja/vaishnava/01_purvanga_vidhanam.txt` — Pūjā Vidhānam  
  19 units, 56 accent marks, 0 mixed units. Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, Sadas mantras, Brahma punīmahe

### Tier C — the Vedic mantra is the mantra of each service — 7 files

A sūkta distributed one ṛc per upacāra, so the Vedic verse is the offering mantra at ten to twenty services. Each service needs its own Paurāṇika substitute. These are slow, and each needs its own decision about what stands in place of the sūkta.

- `puja/smarta/07_lakshmi_nitya_puja.txt` — Lakṣmī Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 247 accent marks. Śrī Sūkta, Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/08_durga_nitya_puja.txt` — Durgā Nitya Pūjā Vidhānam (Smārta Paddhati)  
  60 units, 155 accent marks. Durgā Sūkta, Āpo hi ṣṭhā, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/17_shiva_shodashopachara_puja.txt` — Śiva Ṣoḍaśopacāra Pūjā (second recension)  
  44 units, 420 accent marks, 27 mixed units. Rudra / Śatarudrīya, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti, Asunīte ṚV 10.59.6
- `puja/smarta/18_mahalakshmi_visesha_shodashopachara_puja.txt` — Śrī Mahālakṣmī Viśeṣa Ṣoḍaśopacāra Pūjā (second recension)  
  45 units, 380 accent marks. Śrī Sūkta, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti
- `puja/smarta/19_durga_shodashopachara_puja.txt` — Śrī Durgā Ṣoḍaśopacāra Pūjā (second recension)  
  43 units, 388 accent marks. Śrī Sūkta, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti, Asunīte ṚV 10.59.6
- `puja/smarta/22_surya_shodashopachara_puja.txt` — Śrī Sūryanārāyaṇa Ṣoḍaśopacāra Pūjā (second recension)  
  36 units, 361 accent marks, 20 mixed units. Puruṣa Sūkta, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti, Asunīte ṚV 10.59.6
- `puja/smarta/24_anaghashtami_vrata_kalpam.txt` — Śrī Anaghāṣṭamī Vrata Kalpam  
  53 units, 341 accent marks, 19 mixed units. Puruṣa Sūkta, Sāvitrī Gāyatrī, vyāhṛti / prāṇāyāma, deity gāyatrī (vidmahe), prāṇāhuti

### Excluded — not Vedic — 1 file

The mantras here are Tāntric bīja-mantras, not Vedic — `ह्रीं`, `क्लीं`, `ग्लौं`, `वषट्`, `हुम्`. The `स्वाहā` in them is not the Vedic offering. This rite has its own question of adhikāra, which is dīkṣā and not upanayana, and it is a different question from this one.

- `puja/smarta/23_mahaganapati_chaturavrutti_tarpanam.txt` — Śrī Mahāgaṇapati Caturāvṛtti Tarpaṇam  
  21 units, 0 accent marks. vyāhṛti / prāṇāyāma


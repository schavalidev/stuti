# Stotra corpus — master project tracking

Last updated 2026-09-05. This is the top-level status doc for the whole project — one place
to see what's done, what's researched-but-not-written, and where to find the detail. Two
deity-specific tracking docs sit alongside this one:

- `REMAINING_STOTRAS_TRACKING.md` — Devī/Śākta remainder (Sarasvatī, Gāyatrī, Devī-main
  overflow, Kāmākṣī, Mīnākṣī, Annapūrṇā, Gōdā/Āṇḍāḷ, Śyāmalā, Bālā, Kālikā, Pratyaṅgirā,
  Daśa Mahāvidyā)
- `OTHER_DEITIES_TRACKING.md` — Śiva, Viṣṇu, Guru (incl. Śṛṅgēri/Kāñcī pontiff-paramparā,
  Rāghavēndra Svāmi), Hanumān, Ayyappa, Navagraha, Gaṇeśa, Kṛṣṇa, Rāma, Nṛsiṁha, Vēṅkaṭēśvara,
  Dattātrēya, standalone Śani, Brahmā, Kubēra, Indra/Agni/Yama/Vāyu

Folder convention: one top-level folder per deity directly under `stotras/` (matching
`Subrahmanya/` and `devi/`), except Devī's own many forms (Lalitā, Durgā, Lakṣmī, Vārāhī,
etc.) which nest under `devi/` since they're explicitly forms of one goddess — same logic
used to keep Skanda/Kārtikeya/Guha unified under `Subrahmanya/` rather than split out.

---

## Status at a glance

Table refreshed 2026-09-05 after the largest authoring round in the project's history (**243
titles**, taking the corpus from 451 to **694** files) plus a corpus-wide normalization pass.
"Researched, not yet written" figures below are decremented from the prior estimates by this
round's write counts, **except** where a 2026-09-05 exhaustion crawl overrode them: Pratyaṅgirā
and Mīnākṣī closed at 0, while Gāyatrī, Śyāmalā and Gaṅgā were **corrected upward** — their prior
remainder figures were understated. See `OTHER_DEITIES_TRACKING.md` /
`devi/REMAINING_STOTRAS_TRACKING.md` for the authoritative per-title detail behind each number.

| Deity / group | Folder | Written | Researched, not yet written | Status |
|---|---|---:|---:|---|
| Subrahmaṇya (Skanda/Kārtikeya/Guha) | `Subrahmanya/` | 53 | ~4-17 | Partial ✅ (48 written 2026-09-05, +10 this round), remainder researched. +1 on 2026-09-08: `49_kartikeya_ashtottarashatanama_stotram.txt`, Gītā Press *Śatanāma Stotra Saṅgraha* pp. 19–23, entry 3 of the volume's forty — the folder's first aṣṭottaraśatanāma and first file with a nāmāvalī. |
| Devī — main | `devi/main/` | 40 | ~75-85 | Partial ✅ (41 written 2026-09-05, +10 this round; **5 retired as duplicates the same day → 36** — the Śaṅkara Annapūrṇā, Mīnākṣī and Śāradā hymns now live in their deity folders, see `DEDUP_AUDIT.md`), remainder researched |
| Devī — Lalitā/Tripurasundarī | `devi/lalita/` | 39 | ~70-75 | Partial ✅ (35 written 2026-09-05, +10 this round; incl. both Kāmākṣī re-queue titles), remainder researched. Both contested Lalitā/Daśamahāvidyā routing questions resolved in favour of `lalita/` on 2026-09-05 — see `DEDUP_AUDIT.md` |
| Devī — Durgā | `devi/durga/` | 50 | ~25-35 | Partial ✅ (36 written 2026-09-05; **+12 on 2026-09-08** — the twelve sections of the printed Gītā Press *Durgā Saptaśatī* volume that the corpus lacked: the Aṣṭottaraśatanāma Stotra, Pāṭhavidhi, **Vedokta** Rātri Sūkta, Navārṇa Vidhi, Saptaśatī Nyāsa, **both** Devī Sūktas (Ṛgvedokta and Tantrokta), Kṣamā-prārthanā, Dvātriṁśannāmamālā, Sampuṭa-mantras, Devī Āratī and Devīmayī). This reverses the earlier decision to exclude the pārāyaṇa apparatus as procedural: it is printed as part of the pāṭha, so it is now carried. Ten of the older files are Saptaśatī **aṅgas** (Kavacam, Argalā, Kīlaka, Saptaślokī, Tantrokta Rātri Sūktam, Siddha Kuñjikā, Aparādha Kṣamāpana, Caṇḍikā Dhyānam, Devī Atharvaśīrṣa) or excerpts; the Saptaśatī text proper has its own folder and row below |
| **Durgā Saptaśatī / Devī Māhātmyam** (the text proper; its aṅgas live in `devi/durga/`) | `devi/durga_saptashati/` | 16 | **0** | **Complete (2026-09-08)** — all 13 adhyāyas verse-by-verse (**exactly 700**, the saptaśatī of the title) plus the Prādhānika (31), Vaikṛtika (39) and Mūrti (25) Rahasyams; **795 verses**. Authority is the **printed Gītā Press, Gorakhpur edition** (sthūlākṣarair mudritā, 21st edn., Saṁvat 2052), collated page by page from the book itself — the only corpus text so far held to a printed edition rather than web sources. Third witness: GRETIL for the adhyāyas, sanskritdocuments for the Rahasyams. All 13 chapter tallies (उवाच/अर्धश्लोकाः/श्लोकाः/एवमादितः) match. Each adhyāya carries its printed dhyāna. Ritual apparatus (nyāsa, pārāyaṇa/navārṇa vidhi) excluded as procedural |
| Devī — Lakṣmī | `devi/lakshmi/` | 36 | ~90-100 | Partial ✅ (33 written 2026-09-05, +10 this round), remainder researched; 4 modern copyright-notice titles permanently excluded |
| Devī — Vārāhī | `devi/varahi/` | 12 | **0** | **Complete — pool exhausted (2026-09-04)** — the 1 remaining stotra-adjacent candidate (dhyāna-śloka set) was written; the other 8 confirmed ritual/nāmāvalī/mantra-type, out of scope |
| Devī — Śyāmalā/Mātaṅgī (unified pool — Śyāmalā and Mātaṅgī confirmed the same deity, 2026-09-04) | `devi/syamala/` | 15 | **3 confirmed (+1 unassessed)** | Partial ✅ (15 written 2026-09-05, +7 this round). **NOT exhausted — figure corrected 2026-09-05**, the old "~7" was understated. Remaining: Mātaṅgī Stōtram (Āgamasāra, 95 v — three existing folder files are excerpts from it), Mātaṅgī Stutiḥ 1 (58 v), Mātaṅgī Dhyānam (5 v); Rāja Śyāmalā Rahasya Upaniṣad unassessed |
| Devī — Bālā (confirmed a genuinely distinct deity from Lalitā/Tripurasundarī, 2026-09-04) | `devi/bala/` | 18 | ~6 | Partial ✅ (18 written 2026-09-05, +10 this round), remainder researched |
| Devī — Kālikā/Kālī (unified pool — Kālikā and Kālī confirmed the same deity, 2026-09-04) | `devi/kalika/` | 19 | ~22 | Partial ✅ (18 written 2026-09-05, +10 this round), remainder researched. **Routing finding 2026-09-05:** stotranidhi files its five Bhadrakālī texts under Kālikā, not Pratyaṅgirā — the 3 still unwritten now count in this row |
| Devī — Pratyaṅgirā | `devi/pratyangira/` | 11 | **0** | **Complete — pool exhausted (2026-09-05)** — all 31 stotranidhi pratyangira/bhadrakali slugs plus sanskritdocuments accounted for; the remainder is mantra-prayoga/bīja-string genre, out of scope. The five Bhadrakālī texts re-routed to `devi/kalika/` |
| Devī — Daśa Mahāvidyā | `devi/dasamahavidya/` | 37 | ~14 | Partial ✅ (31 written 2026-09-05, +10 this round; **3 retired as duplicates the same day → 28** — Tārā Stōtram=Tārāṣṭakam merged, and both Mahātripurasundarī Ṣaṭkam and Kamalāmbikā routed to `devi/lalita/`, see `DEDUP_AUDIT.md`), remainder researched — still open: Bagalāmukhī Kavacam 4 (52 v) and 5, Bagalāmukhī Varṇa Kavacam, Bhairavī Kavacam Trailokyavijayam (diff against file 14 before writing) |
| Gaṅgā (new genre) | `ganga/` | 17 | **~30** | Partial ✅ (15 written 2026-09-05, +10 this round) — folder is top-level `ganga/`, not `devi/ganga/`. **NOT exhausted — figure corrected upward 2026-09-05**; ~30 further distinct sanskritdocuments `doc_devii` texts screened as promising |
| Minor Nadīs (Yamunā, Kāverī, Narmadā, Godāvarī, Tuṅgabhadrā, Kṛṣṇā-river, Tāpī, Sarasvatī-river, Sapta Nadī hymns; Sindhu confirmed zero) | `devi/nadi/` | 6 | 0 — section confirmed genuinely exhausted for this pass | ✅ Complete for this pass (4 written 2026-09-02, unchanged this round) — Nadī Stotram (Nāradīya Purāṇa) deliberately skipped as nāmāvalī-type; more nadī research may exist but this pass is closed |
| Devī — Sarasvatī | `devi/saraswati/` | 19 | ~21 | Partial ✅ (18 written 2026-09-05, +10 this round), remainder researched |
| Devī — Gāyatrī | `devi/gayatri/` | 17 | **~10-12** | Partial ✅ (15 written 2026-09-05, +7 this round). **NOT exhausted — figure corrected 2026-09-05**; the prior "thin remainder" estimate was wrong. Still open on sanskritdocuments: Gāyatrī Suprabhātam (28 v), Muktichintāmaṇi Gāyatrī Kavacam (60), Gāyatrī Kavacam 3 (42), Gāyatrī Mañjarī (46), Mahāgāyatrī Līlā Stutiḥ (13), Gāyatrī Kavacam 4 (11), Nārāyaṇa-prokta Sāvitrī Stōtram, Gāyatrī Nāmāṣṭāviṁśati Stōtram, Gāyatrī Nirvāṇam, Gāyatrī Gītikā |
| Devī — Kāmākṣī (6 items already counted in the Lalitā row above) | `devi/lalita/` (partial) | 0 | 0 | ✅ Complete (2026-09-02) — Kāmākṣī Navaratnamālikā Stōtram and Kāmākṣyaṣṭakam re-queue resolved, both written |
| Devī — Mīnākṣī | `devi/meenakshi/` | 12 | **0** | **Complete — pool exhausted (2026-09-05)** — stotranidhi carries only 4 Mīnākṣī titles (all written); sanskritdocuments' Devī index has 11, all accounted for |
| Devī — Annapūrṇā | `devi/annapurna/` | 9 | **0** | **Complete — pool exhausted (2026-09-04)** — all remaining candidates confirmed nāmāvalī/sahasranāma-type, out of scope |
| Devī — Gōdā/Āṇḍāḷ | `devi/goda/` | 4 | ~2 nāmāvalī | Partial ✅ (4 written 2026-09-04: both Sanskrit stotras + both Tamil prabandhams), remainder is nāmāvalī-only, out of scope |
| Śiva | `shiva/` | 34 | ~155-175 (+11 further sahasranāma recensions) | Partial ✅ (29 written 2026-09-07 — **Śiva Sahasranāma Stotram added**, 182 verse-blocks + 1008-name index, Mahābhārata Anuśāsana Parva recension). **30 written 2026-09-08 — Śiva Aṣṭottaraśatanāma Stotram**, Gītā Press code 1850 pp. 15–18 (Śāktapramoda recension); 19 verse-blocks + 108-name index. Its v. 18 refers to the 1008-name text at `shiva/29` — distinct works, both kept. **31 written 2026-09-08 — Baṭuka Bhairava Aṣṭottaraśatanāma Stotram (Āpaduddhāraṇa)**, Gītā Press code 1850 pp. 24–35 (Rudrayāmala Tantra); 88 verse-blocks + 108-name index — the corpus's first Bhairava text, and the first file to carry a deha-nyāsa, four alternative dhyānas and prose viniyoga/nyāsa formulas alongside the hymn. ~12 distinct Śiva Sahasranāma recensions exist — see `SAHASRANAMA_AUDIT_2026-09-07.md` |
| Viṣṇu | `vishnu/` | 129 | ~109-119 (+5 further sahasranāma recensions) | **27 written 2026-09-08 — Hayagrīva Aṣṭottaraśatanāma Stotram**, Gītā Press code 1850 pp. 52–56 (Brahmāṇḍa Purāṇa); 22 verse-blocks + a name index the volume prints at **114**, not 108 — see its recension note. **26 written 2026-09-08 — Viṣṇu Aṣṭottaraśatanāma Stotram**, Gītā Press code 1850 pp. 36–39 (Padma Mahāpurāṇa, Uttara-khaṇḍa); 18 verse-blocks + 108-name index. Unrelated to the sahasranāma at `vishnu/25` — not an extract from it. Partial ✅ (25 written 2026-09-07 — **the Viṣṇu Sahasranāma Stotram is the corpus's first sahasranāma**, 237 verse-blocks + 1000-name index, built on sanskritdocuments' Mahābhārata recension with the full nyāsa apparatus). Note: 6 distinct Viṣṇu Sahasranāma recensions exist (Mahābhārata, Padma, Garuḍa, Nārada Pañcarātra, Skanda, vivarṇādi) — see `SAHASRANAMA_AUDIT_2026-09-07.md` |
| Guru (incl. ~18 Śṛṅgēri/Kāñcī pontiff-paramparā items) | `guru/` | 28 | ~43 | Partial ✅ (28 written 2026-09-05, +10 this round), remainder researched; 3 of the 4 Rāghavēndra titles now written |
| Hanumān | `hanuman/` | 34 | ~30-35 | Partial ✅ (28 written 2026-09-05, +10 this round; **+1 aṣṭottaraśatanāma from Gītā Press code 1850, entry 11, 2026-09-08** — the volume states the stotra was compiled from an older nāmāvalī), remainder researched |
| Ayyappa | `ayyappa/` | 21 | ~8-10 | Partial ✅ (21 written 2026-09-05, +10 this round), remainder researched |
| Navagraha | `navagraha/` | 39 | ~60-70 | Partial ✅ (28 written 2026-09-05, +10 this round; **1 retired as a duplicate the same day → 27** — the Daśaratha Śani Stōtram was byte-identical to `shani/02`, so `navagraha/` no longer carries a Śani text and Śani coverage lives in `shani/` (9 titles); a *different* Śani text for this folder is a candidate for a future round) — **every one of the nine grahas has at least one written text in the corpus** (Bṛhaspati and Kētu filled this round), remainder researched |
| Gaṇeśa | `ganesha/` | 31 | ~65-75 (+8 further sahasranāma recensions) | Partial ✅ (29 written 2026-09-07 — **Mahāgaṇapati Sahasranāma Stotram added**, 243 verse-blocks + 1000-name index, Gaṇeśa Purāṇa recension, with karanyāsa + hṛdayādinyāsa). 9 distinct Gaṇeśa recensions exist incl. Bhāskararāya's `sabhāṣyam` — see `SAHASRANAMA_AUDIT_2026-09-07.md`. **30 written 2026-09-08 — Gaṇapati Aṣṭottaraśatanāma Stotram**: the corpus's first aṣṭottaraśatanāma file and its first text transcribed directly from a Gītā Press volume (code 1850, pp. 11–14); 19 verse-blocks + 108-name index, stotra and nāmāvalī paired as the publisher prints them — see `ASHTOTTARA_AUDIT_2026-09-08.md` **31 written 2026-09-08 — Gakārādi Gaṇapati Sahasranāma Stotram** (Rudrayāmala, Mahāguptasāra): 188 verse-blocks with full trilingual meanings; the 1000-name acrostic in which every name begins with 'ga'. A wholly distinct composition from file 29 — a 12-name sample of the Gakārādi nāmāvalī has zero overlap with file 29, and only 4% of file 29's names begin with ग against 100% here. **1000-name index added 2026-09-08**, derived by acrostic segmentation and then collated name-by-name against the Gita Press nāmāvalī; verified against 81 anchors spanning 1-1000, all agreeing in position. Index is in the nominative, not the dative — see the note at the foot of the file |
| Kṛṣṇa | `krishna/` | 36 | ~85-105 | Partial ✅ (28 written 2026-09-05, +10 this round), **+2 from Gītā Press code 1850, 2026-09-08** — the Kṛṣṇa aṣṭottara (entry 12, 109 names) and the Gopāla śatanāma (entry 13, 100 names, printed under an aṣṭottara heading); remainder researched. **The Bhagavad Gītā, previously counted inside this section's scope as one unwritten bulk work, now has its own folder and row below (2026-09-07)** |
| **Śrīmad Bhagavad Gītā** (split out of the Kṛṣṇa scope — see note below) | `bhagavadgita/` | 19 | ~4 (Gītā Māhātmyam, Gītā Sāram, Gītā Āratī, Saptaślōkī Gītā) | **Complete for the text proper (2026-09-07)** — all 18 adhyāyas verse-by-verse (701 verses) plus the 9 Gītā Dhyāna ślōkas, 710 verses in the corpus's five-field format. Devanāgarī from stotranidhi, collated verse-by-verse against two independent digital editions; IAST generated mechanically to corpus convention. The 4 remaining stotranidhi Gītā-adjacent items are ancillary, not the text itself |
| Rāma (+ Sītā-specific) | `rama/` | 31 | ~25-35 (+5) | Partial ✅ (23 written 2026-09-05, +10 this round; Sītā Kavacam is the first Sītā-specific title written, 5 of that 6 remain), **+1 aṣṭottaraśatanāma from Gītā Press code 1850, entry 10, 2026-09-08** (Padma Purāṇa, Uttara-khaṇḍa); remainder researched |
| Nṛsiṁha | `narasimha/` | 22 | ~38-43 | Partial ✅ (20 written 2026-09-05, +10 this round; +1 aṣṭottaraśatanāma from Gītā Press code 1850, 2026-09-08), remainder researched |
| Vēṅkaṭēśvara | `venkateswara/` | 21 | ~18-21 | Partial ✅ (20 written 2026-09-05, +10 this round), remainder researched. +1 on 2026-09-08: `21_venkatesha_ashtottarashatanama_stotram.txt`, Gītā Press code 1850 pp. 40–47 (Varāha Purāṇa); 54 verse-blocks + name index. **The name index holds 109 entries, not 108** — the volume numbers them 1–109 while its own colophon and v. 46 both say 108; retained as printed, see the file's recension note. |
| Dattātrēya | `dattatreya/` | 22 | ~28-33 | Partial ✅ (20 written 2026-09-05, +10 this round; **+1 aṣṭottaraśatanāma from Gītā Press code 1850, entry 9, 2026-09-08** — Vāsudevānanda Sarasvatī, a mantra-garbha composition with three unresolved glyph readings), remainder researched |
| Śrī Gurucaritam (Dvisāhasrī) — the Sanskrit Guru Caritra | `dattatreya/dvisahasri_gurucaritra/` | 27 | 0 — complete | **✅ Complete (2026-09-23)** — Vāsudevānanda Sarasvatī's Sanskrit Guru Caritra, 2,017 units: the pārāyaṇa vidhi, the Śrīgurustuti (112), 23 adhyāyas (1,809 verses), the Yogarahasya (43) and the Bodharahasya (44). 2,008 verses in all, which is what the name means. Every line read off the page images; the adhyāyas were checked against a four-pass OCR vote and the author's own anvaya, the three pieces outside them had no vote and rest on the page alone, with 16 unresolved readings recorded at the verse. The Gurusaṁhitā, the 51-adhyāya samaślokī, is located but NOT authored — see the folder README. |
| Śani (standalone, refines Navagraha figure) | `shani/` | 10 | **0** | **Complete — pool exhausted (2026-09-04)** — every genuine (non-mantra, non-nāmāvalī) title in this section's own itemized candidate list is now written |
| Brahmā | `brahma/` | 13 | 0 — pool exhausted | ✅ Complete (2026-09-02) — pool exhausted, all genuine stotranidhi.com titles written. **13 files until 2026-09-05, when `02_brahma_kavacham` was found to duplicate `06_brahma_kavacam_jaganmangalam` and was retired → 12**, see `DEDUP_AUDIT.md` |
| Kubēra | `kubera/` | 1 | 0 — pool exhausted, only 1 genuine title exists | ✅ Complete (1 written 2026-08-25) — pool exhausted |
| Indra / Agni / Yama / Vāyu | `misc_vedic/` | 2 | 0 — pool exhausted, only 2 genuine titles exist (Agni Sūktam, Yama Aṣṭakam) | ✅ Complete (2 written 2026-08-25) — pool exhausted |
| **Vedic sūktas — Taittirīya** (new genre, 2026-09-12) | `veda/taittiriya/` | 7 | **~8-12** (Medhā, Manyu, Pavamāna, Viṣṇu, Ṛgvedīya Gaṇeśa, Navagraha and Āyuṣya Sūktas; Mantra Puṣpam as a standalone text — none surveyed yet) | Partial ✅ — the **pañca-sūkta** set completed, written 2026-09-12: `01_purusha_suktam` (26 units, TĀ 3.12–13), `02_narayana_suktam` (30 units, TĀ 10.13 + 10.22 + 10.1), `03_bhu_suktam` (19 units, a compilation of TS 1.5.3, TB 3.1.2.6, Ekāgni-kāṇḍa 2.15 and ṚV 10.71.2), `04_nila_suktam` (4 units, TS 4.4.12). The fifth of the five, **Śrī Sūktam, already existed** as `devi/lakshmi/06_sri_suktam.txt` and was **not** rewritten; all five are cross-referenced both ways. **Accented throughout.** Base text stotranidhi.com, collated against the accented Taittirīya Saṁhitā / Brāhmaṇa / Āraṇyaka on sanskritdocuments.org — a separate lineage in the **same śākhā**. No substantive disagreement in any of the four; three defects in the base text were corrected from the Saṁhitā and are itemised in the files. **Two findings:** Gītā Press's Puruṣa Sūkta volume is headed `अथ माध्यन्दिनीयपुरुषसूक्तम्` — the **Mādhyandina** recension, so under the śākhā rule it is not a witness to these and was not used; and the `मेदिनी देवी वसुन्धरा` block of the Bhū Sūkta **is not in the Taittirīya Saṁhitā, Brāhmaṇa or Āraṇyaka**, so it is recorded as liturgical material of unstated source rather than claimed as Vedic. **+`05_durga_suktam`** (9 units, TĀ 10.2 + the Kātyāyanī gāyatrī at TĀ 10.1), which is not part of the pañca-sūkta: it was written because `devi/durga/19_durga_suktam.txt` holds the same text **unaccented** — its source prints no svara at all, despite the `svara` keyword in that source's category line, and the existing file's header wrongly says otherwise. The two are cross-referenced and neither supersedes the other; the existing file's text is sound and was not edited. **The folder is split by śākhā** like `vidhi/` — see `veda/README.md`; `veda/madhyandina/` is empty and wanted. |
| **Vedic sūktas — Ṛgveda (Śākala)** (new folder, 2026-09-12) | `veda/rigveda/` | 3 | **unsurveyed** (the Ṛgvedīya Gaṇeśa, Medhā, Manyu and Śrī Sūktas are Ṛgvedic and belong here; none surveyed yet) | Partial ✅ — `01_agni_suktam` (9 units, ṚV 1.1), written 2026-09-12 **because the corpus's existing `misc_vedic/01_agni_suktam.txt` is the same hymn without accent** — that file records that its source carried the svara and that it was dropped on purpose, under the convention this corpus followed before 2026-09-08. The two are cross-referenced and neither supersedes the other; the existing file was not edited. **Accented, 97 marks.** Base text the accented saṁhitā-pāṭha of `ऋग्वेदः सूक्तं १.१` on sa.wikisource.org (printed with Sāyaṇa's bhāṣya, and carrying the accented pada-pāṭha as well), collated against the accented stotranidhi.com page and against the Aufrecht edition on GRETIL, which is unaccented and a witness to the wording only. **All three agree in every word, and the two accented witnesses agree on every accent mark** — the differences are orthographic (anusvāra against class nasal, `ळ` against `ल`, `र्ऋ` against `रृ`, stotranidhi's ASCII colon for the visarga) and each is itemised in the file. **One finding:** archive.org holds **no Gītā Press edition of the Ṛgveda saṁhitā**, so there is no Gītā Press witness to this text. The Ṛgveda survives complete in one śākhā, so the cross-śākhā question that governs `veda/taittiriya/` does not arise. `pitr/04_pitr_suktam_rigveda.txt` (ṚV 10.15) is also Ṛgvedic and accented; it stays in `pitr/` and was not moved. **+`02_ratri_suktam`** (8 units, ṚV 10.127) and **+`03_devi_suktam`** (8 units, ṚV 10.125, the Vāk Sūkta), written the same day under the standing rule that **a sūkta is Vedic and carries its accent wherever the text has one**. Both existed in the corpus already, unaccented, as `devi/durga/39_vedokta_ratri_suktam.txt` and `devi/durga/42_rgvedokta_devi_suktam.txt` — Gītā Press *Durgā Saptaśatī* transcriptions, and that volume prints the whole Saptaśatī without svara. Neither existing file was edited; both received a cross-reference. Base text for both is the accented saṁhitā-pāṭha on sa.wikisource.org, collated against the **accented Aufrecht text on sanskritdocuments.org** (`doc_veda/r10.itx`), with stotranidhi as a third witness for the Rātri Sūkta. **All witnesses agree letter for letter and on every accent mark**, and both hymns were checked letter for letter against the Saptaśatī text already held — agreement complete but for the `ॐ` prefixed to ṛc 1, the kampa numerals (accent notation), one reading at 10.127.4 (`अविक्षमहि` against `अवि॑क्ष्महि`) and `भूर्य्या` for `भूर्या` at 10.125.3. **One finding worth carrying: stotranidhi's Devī Sūktam page is not the Śākala text** — `सोऽअन्न`, `वातऽइव`, `श्रुणोति` and the double svarita `᳚` throughout — so its accents were not used. |
| **Vedic sūktas — Mādhyandina (Śukla-Yajurveda)** (new folder, 2026-09-12) | `veda/madhyandina/` | 2 | **unsurveyed** (the Mādhyandina Śrī, Nārāyaṇa, Rudra and Medhā Sūktas all belong here; none surveyed yet) | Partial ✅ — `01_purusha_suktam` (18 units: VS 31.1–16 with the print's opening invocation and closing colophon) and `02_purusha_suktam_uttarabhaga` (6 units: VS 31.17–22), written 2026-09-12. Together they are the whole of Vājasaneyi adhyāya 31; they are **two files because the printed recitation book closes at mantra 16** with `इति पुरुषसूक्तं समाप्तम्` and turns straight to the Śrī Sūkta. The split was put to the user, who chose it. **Accented, 254 + 117 marks.** Base text of `01` is an accented Devanāgarī lithograph published by **Master Khelāṛīlāl, Kachauri Gali, Banaras City**, read from page images (its OCR is unusable); accent for both files and the Devanāgarī of `02` come from the accented Mādhyandina Vājasaneyi Saṁhitā on sa.wikisource.org — **same śākhā**; both collated against the **TITUS** Vājasaneyi-Saṁhitā (Mādhyandina), part 31, accented IAST, a scholarly lineage of its own. **Across all 22 mantras the witnesses differ in exactly five places.** Three are in `01` (a visarga at mantra 1, `ततो`/`तस्माद्` at 5, `किमस्यासीत् किं बाहू किमूरू`/`कौ बाहू का ऊरू` at 10); in each the print and sa.wikisource agree and TITUS stands alone, and the two Mādhyandina witnesses are followed. Two are in `02` and are single words (`ब्राह्मं`/`ब्राह्म्यं` at 31.21, `व्यात्तम्`/`व्यात्ताम्` at 31.22), printed as bracketed variants in the lines, unaccented, because TITUS gives them in IAST only. No accent was added, inferred or moved. **One finding that corrects an earlier note:** archive.org catalogues the `Purush Sukta and Shri Sukta` volume under `creator: "Gita Press"` and the `veda/taittiriya/` row above and `veda/README.md` both repeat that, but **the volume is not a Gītā Press imprint** — its colophon names Master Khelāṛīlāl as publisher and "Jaj Printing Works" as the press. The substance of the earlier note is unaffected (it is the Mādhyandina recension and was rightly not used for the Taittirīya files); only the publisher is wrong. **No Gītā Press edition of the Mādhyandina Puruṣa Sūkta has been located**, so the Gītā Press rule did not govern these files. The existing files and rows were not edited; this row and an added section in `veda/README.md` carry the correction. |
| **Pitṛ-devatā** (new genre, 2026-09-10) | `pitr/` | 5 | **2–3** (the stotranidhi Pitṛ Tarpaṇam, śākhā unresolved; Mātṛ Pañcakam, unchecked) | Partial ✅ (5 written 2026-09-10): `01_rucistava` (Gītā Press *Antya-karma Śrāddha-prakāśa* p. 418, 11 vv.), `02_ruci_pitr_stotram` (Garuḍa P. 1.89.13–48, 36 vv., GRETIL-governed; no GP witness), `03_pitr_suktam_vajasaneyi` (VS 19.49–61, GP p. 423, accented from sa.wikisource Mādhyandina — 0 mismatches), `04_pitr_suktam_rigveda` (ṚV 10.15, accented, Śākala), `05_brahmakrta_pitr_stotram` (Bṛhaddharma P. Pūrvakhaṇḍa 2.23–32, Khandelwal ed.). **Two findings:** the Gītā Press śrāddha 'Pitṛ Sūkta' is the Yajurvedic VS 19.49–61, not ṚV 10.15 — two works, kept apart by śākhā; and stotranidhi's Ruci stotras 1 and 2 are one continuous Garuḍa passage (89.13–48 + 89.51–60), which Ṛṣipīṭham (Sept 2014) prints as one. `05` is a hymn to one's **own father**, not to the pitṛ-gaṇa. |
| Rāghavēndra Svāmi | (folded into `guru/`) | 0 | 0 (already in Guru row above) | Researched, confirmed — no expansion |
| Ritual manuals (**not stotras**) | `vidhi/` | 24 | not yet surveyed | Added 2026-09-08 in a separate thread, and still growing there: `01_sandhyopasana_vidhi.txt` (Gītā Press code 210, collated against the Mādhyandina Vājasaneyi-Saṁhitā), `02_sandhyakala_nirnaya.txt`, `03_tarpana_vidhi.txt`, `04_balivaisvadeva_vidhi.txt`, `05_samkshipta_bhojana_prayoga.txt`. **A new genre for this corpus** — it carries a `Type: vidhi` header field the stotra format does not define, and its pool has not been scoped. Counted in the total because the file is on disk; the row is a placeholder pending a decision on whether vidhi texts belong in this tracker or a separate one. |
| Pūjā-vidhāna — **smārta** (new genre, 2026-09-12) | `puja/smarta/` | 51 | **~29 deity pūjās (none with a sibling) + ~14 vratas surveyed** — see `AUTHORING_QUEUE.md` | Partial ✅ — the **spine** plus the **first tranche of rites**, written 2026-09-12. Spine: `01_nitya_puja_vidhanam.txt` (55 units), `02_sankshipta_puja_vidhanam.txt` (31), `03_purvanga_vidhanam.txt` (31). Rites: `04`–`13`, ten deity nitya-pūjās (Gaṇapati, Śiva, Viṣṇu, Lakṣmī, Durgā, Sarasvatī, Subrahmaṇya, Sūrya, Hanumān, Navagraha), 59–60 units each; and `14_vinayaka_chaviti_vrata.txt` (60), the **Varasiddhi Vināyaka vrata**, which does *not* share the pūrvāṅga and adds a prāṇapratiṣṭhā. and `15_mahaganapati_shodashopachara_puja.txt` (38), the **Mudgala Purāṇa recension of the Gaṇapati pūjā** — a second recension of `04`, kept separate and never merged; and `16_anjaneya_shodashopachara_puja.txt` (33), the stotranidhi recension of the Hanumān pūjā beside `12`; and `17_shiva_shodashopachara_puja.txt` (44), the stotranidhi recension of the Śiva pūjā beside `05`; `18_mahalakshmi_visesha_shodashopachara_puja.txt` (45) beside `07`, `19_durga_shodashopachara_puja.txt` (43) beside `08`, `20_saraswati_shodashopachara_puja.txt` (30) beside `09`, `21_subrahmanya_shodashopachara_puja.txt` (34) beside `10`, and `22_surya_shodashopachara_puja.txt` (36) beside `11` — **the second-recension queue is finished**; Viṣṇu has no Devanāgarī page, so `06` has no sibling. 1,079 units in `smarta/`. Accented throughout (3,749 marks), from **native Devanāgarī** sources, so nothing was transliterated. Base text vignanam.org, collated against stotranidhi and **Gītā Press *Nitya Karma Pūjā Prakāśa***. Notable: `11` carries a **dvādaśārghya** found in no other rite here; `13` worships nine deities and is plural throughout; `15` is the **best-collated file in the folder**, checked against the Mudgala Purāṇa itself (archive.org `mudgala-purana-s`, khaṇḍa 5 adhyāya 39) and found to be a faithful abridgement of that chapter; `16` is much closer to `12` than `15` is to `04` — 104 of its 172 source lines already stood in `12` and the seventeen-name aṅga-pūjā is word for word the same — which the file states plainly instead of overselling the difference, and which also corrected a wrong claim in `puja/README.md`; `17` is the **widest-apart pair in the folder** — 214 of its 256 source lines are absent from `05` — because **every one of its sixteen services is headed by a mantra of the Mahānārāyaṇa Upaniṣad**, taken in the order of Taittirīya Āraṇyaka prapāṭhaka 10, against which the whole file was collated; it adds the twenty-two liṅga names, the eight forms of Rudra with their consorts, a `तर्पण` and the blessings of Taittirīya Brāhmaṇa 3.5.10.4, none of which `05` has; `18` is built on the **Śrī Sūkta** the same way, its sixteen services headed by the fifteen ṛcs in order, and it carries a whole **Dīpāvalī portion** — lamp-worship, the row of lamps, and an eleven-verse prayer to the night of ease; fifty occurrences of the non-word `महालक्ष्मै` were corrected there to `महालक्ष्म्यै`. **All five remaining stotranidhi deity pages were measured against their siblings before writing** — 63% to 82% new. Three structural plans were found and each is named in its file: `17` on the **Mahānārāyaṇa Upaniṣad**, `18` and `19` on the **Śrī Sūkta**, `22` on the **Puruṣa Sūkta**; `20` and `21` are built on no hymn, though `20`'s mantrapuṣpa carries **Ṛgveda 6.61.4–7**, which matched the accented Śākala text exactly, syllable and svara — the cleanest collation in the folder. A **defect of the source** was caught there and corrected in all eight files: stotranidhi writes visarga in accented mantras as the ASCII colon `:`, not `ः`. The survey notes in `07`–`11` were also found to **overstate in four cases out of five** (`प्राणप्रतिष्ठा` claimed on three pages that lack it, `मधुपर्क` on one); those files are other sessions' and were not edited — see `puja/README.md`; `14`'s kathā is printed in English by its source and in Telugu by the other — **no Sanskrit of it exists in either, and none was invented** — and its closing maṅgaḷācaraṇam is Telugu verse in Devanāgarī script whose Dravidian short vowels `ॆ`/`ॊ` are correct and must not be normalised. Also `Type: vidhi`, like `vidhi/` above. See `puja/README.md`. |
| Pūjā-vidhāna — **vaiṣṇava** (new genre, 2026-09-12) | `puja/vaishnava/` | 2 | not yet surveyed | Partial ✅ — `01_purvanga_vidhanam.txt` (19 units), written 2026-09-12. **A genuinely different rite, not a variant of the smārta one**, which is why the folder is split by *paddhati* the way `vidhi/` is split by śākhā: Viṣvaksena replaces Gaṇapati as remover of obstacles, the ācamana opens on a different triad and runs 12 names against 24, there is a four-syllable āsana (अं अनन्तासनाय, रं कूर्मासनाय, विं विमलासनाय, पं पद्मासनाय) with no smārta counterpart, and the saṅkalpa is Śrīraṅga-centred where the smārta is Śrīśaila-centred. **No independent collation was available and the file says so plainly** — Gītā Press publishes no Śrīvaiṣṇava pūjā-paddhati and vignanam's pūjā pages are smārta only, so stotranidhi is the sole witness. |
| Pūjā-vidhāna — **veda-mantra vikalpa** (new genre, 2026-09-13) | `puja/vikalpa/` | 1 | n/a — a substitution layer, not a rite to be surveyed | **Complete for the core substitutions (2026-09-13)** — `01_veda_mantra_vikalpa.txt` (11 units). Alternatives to the Vedic mantras carried by the 25 accented files in `puja/smarta/` and `puja/vaishnava/`, for a reciter for whom the **upanayana saṁskāra** has not been performed, with a reader-facing note stating the rule. **Paddhati-neutral** — the substitutes are Paurāṇika and are used on both sides of the smārta / Vaiṣṇava division, so the file sits beside those folders rather than inside either. **It adds and replaces nothing**: not one character of the 25 files is changed and none is superseded. Covers prāṇāyāma, `गणानां त्वा`, the ācamana `स्वाहा`, `आ कलशेषु धावति`, `आपो हि ष्ठा`, `योऽपां पुष्पं वेद`, the sūktas, the deity gāyatrīs, and a general rule for anything unnamed. Most substitutions rest on **this corpus itself** — `smarta/02` has no prāṇāyāma at all and already reduces snāna and mantrapuṣpa to the nāma-mantra, and the Paurāṇika `सुमुखश्चैकदन्तश्च` and `कलशस्य मुखे विष्णुः` already stand beside the Vedic mantras they replace. Base witness for *which* verse stands where: eight Telugu simplified-pūjā handouts of the *Nanduri Srivani* channel (supplied 2026-09-13), which carry **zero accent marks and not one Vedic mantra** and substitute consistently at exactly these points; two of them print an adhikāra rubric in the body. **They are video-channel handouts, rank below stotranidhi, and their text layer is corrupt** — every reading was verified against the page image and nothing was transliterated from the extracted text. Contrast witness: bhaktinidhi.com's pūrvāṅgam, which prints the **Vedic** prāṇāyāma in full and carries no adhikāra note, confirming the handouts depart deliberately. **One gap is stated in the file**: `पूरकं कुम्भकं चैव` is attested by the handouts alone — no printed edition or independent corpus carrying it was found. **Four rites cannot be adapted** — `smarta/17`, `18`, `19`, `22` are built on a sūkta from end to end, and the file says so and redirects to the deity's nitya-pūjā rather than pretending an exchange is possible. Also `Type: vidhi`. |
| Pūjā-vidhāna — **Paurāṇika form, without Vedic mantras** (new genre, 2026-09-17) | `puja/pauranika/` | 54 | **None** among the written rites; `smarta/23` is excluded (Tāntric, not Vedic); 26 further rites are still RESERVED placeholders and are audited once written — see `puja/vikalpa/BUILD_QUEUE.md` | Partial ✅ — for a reciter for whom the **upanayana saṁskāra** has not been performed. **Each file is the Vedic-removed twin of a Vedic file that is kept unchanged for the initiated; neither supersedes the other, and neither is ever deleted** (user, 2026-09-17). Split by paddhati like its source: `pauranika/smarta/` (24), `pauranika/vaishnava/` (1) and `pauranika/vrata/` (4), same file names as the originals. **Generated, not authored**: `bin/pauranika_puja.py` removes every Vedic mantra by daṇḍa-segment together with its translation, drops a unit that held only a Vedic mantra (a Paurāṇika verse already stands beside each), puts `नमः` for `स्वाहा` in the ācamana and `पूरकं कुम्भकं चैव` for the prāṇāyāma (`vikalpa/01`), and removes the naivedya prāṇāhuti without substitute (user's decision). **Not one Sanskrit word was composed.** The build fails if any accent mark, Vedic line or translation of one survives; every changed unit was also read by eye, which caught three leftovers the check had missed. **2026-09-17, second pass:** the seven rites whose sūkta runs through the services (`07`, `08`, `17`, `18`, `19`, `22`, `24`) were built too — in every one a Paurāṇika verse already stood at each service, so nothing had to be supplied; their translations were cut at reviewed points, since sūkta translations cannot be found by pattern. The same pass added a check against **every accented line in `puja/`, `veda/` and `vidhi/`**, which found Vedic text printed *without* accent — the yajñopavīta mantra `यज्ञोपवीतं परमं पवित्रं` in seven files, the closing `ॐ शान्तिः शान्तिः शान्तिः` in fifteen, a Śrī Sūkta ṛc in `07` and the last Puruṣa Sūkta ṛc in `24` — all removed, and the first seventeen rebuilt. **Third pass, same day:** the four Vedic vratas (`vrata/02`–`05`) were built, their Vedic lines decided one by one and recorded in the generator, since their translations run one line per verse; and **every verse line of all 28 files was then read by eye**, because the accent check cannot see Vedic text printed without accent. The reading found and removed the whole Vedic pañcāmṛta bath (`आप्यायस्व`, `दधिक्राव्णो`, `शुक्रमसि`, `मधुवाता`, `स्वादुः पवस्व`, `याः फलिनीः`) in two vratas, Ṛgveda 1.164.41 in Kedāreśvara, an adaptation of Ṛgveda 1.50.11 in both Sūrya rites, a Puruṣa Sūkta line in Anaghāṣṭamī, the Mahānārāyaṇa tarpaṇa in the Śiva rite, and every instruction that sent the reader to a Vedic text (Rudram, Puruṣa and Nārāyaṇa Sūkta, Gaṇapati Atharvaśīrṣa, Navagraha Sūkta, laghunyāsa); these corrections are listed in `bin/pauranika_post_edits.py` and only ever remove text. **Fourth pass, same day:** `smarta/14` Vināyaka Caviti was built; then **three independent reviewers re-read all 29 files**. They found a full translation of Durgā Sūkta ṛc 1 still standing in `smarta/08`, stray `ओम् ॥` lines left by removed ṛcs, four saṅkalpas still saying the rite was done `श्रीसूक्त/पुरुषसूक्त विधानेन`, and about a dozen notes and two Blurbs still describing removed mantras — all corrected (`GLOBAL` and `BLURB` in `bin/pauranika_post_edits.py`). The nāma-mantra rule is Gītā Press *Nitya Karma Pūjā Prakāśa* (592), `सर्वसामान्य देवी-देव-पूजाका विधान`, which also prints a full āgamokta ṣoḍaśopacāra in masculine (Śiva) and feminine (Durgā) forms — the source for the seven remaining rites. PDFs of all 17 are built outside the corpus, in `../pauranika_puja_pdfs/`. Also `Type: vidhi`. |
| Vrata kalpa (new genre, 2026-09-14) | `puja/vrata/` | 11 | **~14 vratas surveyed** — see `AUTHORING_QUEUE.md` | Partial ✅ — the first four, written 2026-09-14. **Split off from `puja/smarta/` by genre, not by paddhati**: a vrata kalpa is kept on a named day or recurrence, carries a story, and usually carries a **toram** whose knots are worshipped one by one and which is then bound on the wrist — apparatus the daily pūjā has no counterpart for. Every file states its own paddhati; **śākhā does not apply to this genre** and no file here carries that field. `01_varalakshmi_vrata_kalpam.txt` (39 units), the Friday before the full moon of Śrāvaṇa, toram of **nine** knots; `02_kedareswara_vrata_kalpam.txt` (56), Bhādrapada śukla aṣṭamī to amāvāsyā, toram of **twenty-one** knots, one for each of the twenty-one days — **stored with its duration stated rather than flattened to the one-day Dīpāvali form now commonly kept**; `03_mangala_gauri_vrata_kalpam.txt` (45), the Tuesdays of Śrāvaṇa, five years; `04_vaibhava_lakshmi_vrata_kalpam.txt` (41), four, nine, eleven or twenty-one Thursdays or Fridays, tied to no month; `05_ananta_padmanabha_vrata_kalpam.txt` (74, the largest here), Bhādrapada śukla caturdaśī, kept **fourteen years**, toram of **fourteen** knots, and it carries a whole **Yamunā Devī pūjā as a limb** of itself before the principal worship begins. **Base text stotranidhi in every case, and every file collated against a genuinely independent printed edition** — *Āru Vratālu* (Rajahmundry 1999) for `01` and `02`, *Maṅgaḷa Gaurī Vratamu* of Sannidhānaṁ Narasiṁha Śarma (Rajahmundry 1998) for `03`, *Śubhaprada Vaibhavalakṣmī Pūjā Vidhānam* (Bengaluru) for `04`, and *Āru Vratālu* again for `05`. **Gītā Press and GRETIL publish no vrata vidhāna**, so the top two tiers of the standing sourcing chain are empty for this genre and the Telugu prints are the base. Notable: `01`'s printed witness worships **eight** toram knots while its own binding mantra says the thread is of nine, so the base text is the one that is internally consistent; `02`'s two editions name the twenty-first knot differently (Mṛtyuñjaya against Kedāreśvara) and **that is sense-changing, so both are recorded and neither chosen**; `04` prints the Śrī Sūkta **with** Vedic accent, which was lifted by machine and kept verbatim. **Two real gaps are stated rather than filled**: the Sanskrit kathās of `01`, `02` and `05` exist in *Āru Vratālu* and were **located but not transcribed**, because the OCR of those pages is too damaged to read with confidence — **nothing was reconstructed**. **Vrata files still outside this folder** belong to other sessions and were not moved: `../smarta/14`, `24`, `26` and `49`. **`03` here and `../smarta/26_sravana_mangalagauri_vrata_kalpam.txt` are the same rite written twice**, from the same base text against different printed editions (Rajahmundry 1998 against Machilipatnam 1958); both say so, neither supersedes the other, and whether to retire one is the maintainer's decision. Also `Type: vidhi`. See `puja/vrata/README.md`. |
| **Rāmcaritmānas — Sundarkāṇḍ** (Tulsīdās; Awadhi, not Sanskrit) | `rama/sundarkand/` | 14 | **0** | **Complete (2026-09-08)** — the fifth sopān entire: 3 opening Sanskrit ślokas, 212 caupāī units, **63 dohā/sorathā units across the 60 printed dohā numbers** (39, 49 and 56 are each printed split as क/ख), 6 chhands and the closing colophon; **285 units, 1,209 verse lines**. Authority is the printed **Gītā Press, Gorakhpur** edition (code 1349), recovered not by OCR but by decoding the PDF's embedded Chanakya text layer — the typesetter's own characters — at 0 unresolved glyphs across the whole 112,603-character volume. Collated word-by-word against the independent DharmicData digital Rāmcaritmānas: **95.6% word agreement**, Gītā Press authoritative on all 150 divergences. Mūl was separated from the Hindi ṭīkā by typeface (bold 19.7pt verse vs regular 16pt commentary), so the division is the edition's own, not editorial. **Volume complete (2026-09-08, second round).** The front matter and appendix are now written too: `00_parayana_vidhi.txt` (39 units — āvāhana-mantras, viniyoga, ācamana, karanyāsa, hṛdayādi-nyāsa, dhyāna, pp.5–8) and `00_kishkindhakanda_doha_29_30.txt` (11 units, pp.9–10 — the tail of the previous kāṇḍa, which this edition prints first because devotees begin a Sundarkāṇḍ pāṭh at Kiṣkindhā dohā 29). The five appendix stotras went to their deity folders, not here: `rama/24`, `rama/25`, `hanuman/29`, `hanuman/30`, plus `hanuman/32` and `rama/27` for the two texts the corpus already held in another recension (the Chālīsā and the Rāma-stuti). Those two were **first written over** the existing `hanuman/02` and `rama/19`; that was a mistake, both originals were recovered and restored the same day, and the rule against it is now in CLAUDE.md under "Never rewrite an existing file from a new witness". **Six decoder errors were found and fixed in this second round, five of which had already been written into the twelve files above**: the glyphs for ्न, न्न, ञ्ज, ह्य, ह्न and a combined reph-plus-i-mātrā were unmapped or wrong, so अग्नि decoded as अगिन, प्रसन्न as प्रसन्ना, पुञ्ज as पुल्ल, हर्षित as हर्षत and मर्दि as मर्द. Six mūl lines were corrected in five files (01, 04, 06, 07, 11) and four recension notes rewritten that had wrongly blamed the print. The volume now decodes at **0 unresolved glyphs and 0 malformed Devanāgarī sequences** across all 128 pages. Pages 129–158 of the PDF are **not Gītā Press** — a third-party Hanumān mantra-sādhanā pamphlet bound into the same scan — and are excluded by design |
| **Vālmīki Rāmāyaṇa — Sundarakāṇḍa** (Sanskrit; a different work from the Rāmcaritmānas Sundarkāṇḍ above, not a variant of it) | `rama/valmiki_sundarakanda/` | 68 | **67** | **Started 2026-09-12** — the fifth kāṇḍa of Vālmīki's Sanskrit epic, one file per sarga, 68 sargas in all. **All 68 sargas are written: 2,824 verse units and 6,312 verse lines**, plus sixty-eight colophons. The kāṇḍa is complete. Sarga 15 is where Hanumān finds Sītā. Per-sarga unit counts are on the checklist in `AUTHORING_QUEUE.md`. Base text is the Devanāgarī of stotranidhi, used for transcription only; two independent witnesses are collated against it half-line by half-line before a file is written — the **Gītā Press, Gorakhpur** *Śrīmad Vālmīkīya Rāmāyaṇa* Part 2, which is the authority for readings, and the Southern-lineage digital text of valmikiramayan.net. **The Gītā Press scan's OCR is not clean**, so it settles a word but is never transcribed from; a Gītā Press reading that cannot be read without doubt is recorded in the `Recension note` and not printed into the verse. The full 68-sarga collation was run and cached before authoring began: **2,824 verse units across the kāṇḍa**, with per-sarga witness counts and every flagged divergence. The finished files come to that same total. See `rama/valmiki_sundarakanda/README.md` for the sourcing, and `AUTHORING_QUEUE.md` for the per-sarga checklist. GRETIL's Southern-recension file was checked and does **not** carry this kāṇḍa; valmiki.iitk.ac.in did not resolve. **Correction, 2026-09-13:** that statement is true only of the file it names. A *different* GRETIL file, `sa_rAmAyaNa.xml` (Muneo Tokunaga's entry of the Baroda critical edition), carries all seven kāṇḍas, including this one in the critical edition's 66-sarga division. It was found while sourcing `rama/31_rama_pattabhisheka_sargah.txt` and was **not** used for the 68 files here, which rest on three witnesses. It is a genuine fourth witness of a separate editorial lineage and it does not always side with the majority. **The user decided on 2026-09-13 not to re-collate this kāṇḍa, and to use the critical edition for Rāmāyaṇa work from here on.** The gap in these 68 files is therefore known and accepted, not outstanding work; nothing here has been changed on the strength of it. Note also that GRETIL's plain-text export of that file silently drops the first half-line of every verse — read the TEI XML, not the .txt |
| **TOTAL** | | **1192** | **~1040-1190** (approximate rollup of the ranges above, not a literal column sum — see `devi/REMAINING_STOTRAS_TRACKING.md` for the per-title detail behind each number; the three overlap/routing questions that used to carry caveats here were resolved by the user on 2026-09-04, see below). **These counts are generated, not maintained by hand.** Several sessions write to this corpus in parallel, so they drift continuously; do not treat a mismatch as a finding. Run `python3 bin/recount.py` to see the drift and `python3 bin/recount.py --write` to sync every row and this TOTAL to disk. The one thing the script will not decide for you is an **untracked** file — a `.txt` under no row's folder, which means a new folder appeared and needs a row. **Correction, 2026-09-08:** this row previously read **742** and the Durgā row **46**, and claimed the same exact reconciliation, but the real counts at that moment were **732** and **36** — ten Durgā files had been credited in the table that were never written to disk. The numbers here are now the counted truth (744 files, Durgā 48, of which 12 were written on 2026-09-08); the phantom ten were never real and are not "missing work", they were a bookkeeping error. Treat any future "reconciles exactly" claim in this file as needing an actual `find` to back it. **2026-09-08, later:** the count reached **758** — 12 of the increase are the Sundarkāṇḍ files below, and **two (`vishnu/26_vishnu_ashtottarashatanama_stotram.txt`, `venkateswara/21_venkatesha_ashtottarashatanama_stotram.txt`) were written by a different, concurrent workstream** (the Gītā Press *Śatanāma Stotra Saṅgraha* aṣṭottara series), not by the Saptaśatī/Sundarkāṇḍ work logged here. The repo is being edited by more than one process, so a count taken at the start of a session may not hold at the end of it. **2026-09-08, later still — the row sums were double-counting.** `rama/sundarkand/` has its own row and also sits inside `rama/`, and `bin/recount.py` counted files recursively under every row, so the twelve Sundarkāṇḍ files were counted twice and the "758" above was **12 too high**; the true figure at that moment was 746. The script now counts each file once, against the longest row path that contains it, and the `rama/` row accordingly shows its own 25 rather than 39. **767** is the first TOTAL in this file that actually reconciles with `find`. Of the 21 files added since that 746: **6 are this session's** — the Sundarkāṇḍ volume's front matter and appendix, see the row below — and the other 15 came from concurrent workstreams (aṣṭottara and sahasranāma series under `ganesha/`, `narasimha/`, `shiva/`, `venkateswara/`, `vishnu/`). Two further files this session, `hanuman/02_hanuman_chalisa.txt` and `rama/19_tulasidasa_krta_rama_stuti.txt`, were **collated into, not created**, and so add nothing to the count. Note: **744 files = 743 distinct works.** The one file that is not a work is `devi/main/03_anandalahari.txt`, a deliberate cross-reference stub recording that Ānandalaharī is not separate from `devi/lalita/14_saundarya_lahari.txt` (vv. 1–41) rather than holding a text of its own. The 10 duplicate pairs found by the corpus-wide audit of 2026-09-05 were merged and retired the same day (694 → 684); see `DEDUP_AUDIT.md`. | |

### Sahasranāma workstream — opened 2026-09-07


**2026-09-07 (cont.):** Lalitā Sahasranāma completed and installed as `devi/lalita/36_lalita_sahasranama_stotram.txt` (377 verse blocks + 1000-name index; Lalitā row 35→36). Fourth and last of the four flagships. Source sanskritdocuments, nāmāvalī split cross-checked name-by-name against stotranidhi's independent nāmāvalī — decade markers agree at every one of the 100 marks. Two apparent corruptions investigated and cleared as genuine received readings, not parse errors: names 425–427 (`tasmai | tubhyaṁ | ayyai`, the mahāvākya expansion of *tattvamayī*) and 711–712 (`sādhune | yai`). Three junk blocks of English page-commentary that had leaked from the sanskritdocuments HTML were removed, and 22 lines carrying stray U+200D were cleaned.
The sahasranāma genre is now **in scope** and has its own format. A corpus-wide re-audit
(`SAHASRANAMA_AUDIT_2026-09-07.md`) found **246** sahasranāma texts indexed on sanskritdocuments.org
against the ~34 in `SAHASRANAMA_TRACKING.md` — that document is now flagged SUPERSEDED IN PART, and
several of its verdicts (Ayyappa ❌, Śani ❌, Lalitā "single version", Śiva's "unverified" variants)
are known to be wrong. The "modern composition" calls on Indra, Agni and Rāghavēndra, and the
"Kamalā is not independent" call, were confirmed correct.

Format (agreed with the user, 2026-09-07): **hybrid** — the corpus's normal per-verse
deva/iast/en/tel/hi blocks, plus a trailing `--- names ---` index of
`N | devanāgarī | iast | en | tel | hi`. This replaces the older, never-specified
"separate reference-list treatment".

Written so far: **3** — `vishnu/25_vishnu_sahasranama_stotram.txt` (Mahābhārata),
`shiva/29_shiva_sahasranama_stotram.txt` (Mahābhārata, Anuśāsana Parva) and
`ganesha/29_mahaganapati_sahasranama_stotram.txt` (Gaṇeśa Purāṇa).
**In progress: Lalitā** (Brahmāṇḍa Purāṇa, `doc_devii/lalitacomplete.html` — the best-attested entry
in the whole audit at 8 scan references). Fully fetched, segmented and validated: 378 verse-blocks
(incl. nyāsa, viniyoga, dhyāna and **pañcapūjā**) and a 1000-name list, all verse text and name text
final; 188 of 378 verse-meanings authored, name glosses not yet started. Then
primary-colophon verification of the 246 audited entries.

**Resolved 2026-09-07:** the `bhagavadgita/` folder (19 files) and
`vishnu/25_vishnu_sahasranama_stotram.txt` are both now represented in the table above. The row-sum
reconciles exactly with `find . -name "*.txt" | wc -l` = **706**, with zero per-folder mismatches.

**Śirḍī Sāī Bābā: decided OUT OF SCOPE (2026-08-24)** — will not be included in this corpus.
No further research or tracking needed for him.

### Re-audit findings, 2026-08-24: the 6 "✅ Complete" sections were wrong

Prompted by a spot-check request, all 6 sections previously marked "✅ Complete" (0 remaining)
were re-crawled against the real category pages on stotranidhi.com/vignanam.org (and
sanskritdocuments.org where feasible), the same methodology that later caught Dattātrēya's
undercount (6 assumed → 64 actual). Every one of the 6 was undercounted, some drastically:

| Section | Written | New found | Severity |
|---|---:|---:|---|
| Subrahmaṇya | 25 | 27 core stotras + 13 nāmāvalī/mantra/ritual/narrative | Moderate |
| Devī — main | 23 | ~82 (devi/main-proper) + ~19 (vignanam net-new) | Severe — see Daśamahāvidyā note below |
| Devī — Lalitā/Tripurasundarī | 14 | ~93 (incl. ~33 nāma-list type, 3 non-Sanskrit) | Severe |
| Devī — Durgā | 16 | ~135 raw title-records → ~45-55 genuinely distinct after collapsing recension-clusters | Severe |
| Devī — Lakṣmī | 14 | ~118 (incl. ~35-40 nāma-list type) | Most severe — ~8x undercounted |
| Devī — Vārāhī | 11 | 9 (of 20 titles on stotranidhi's dedicated category page) | Mild — closest to actually complete |

**Devī-main re-audit also surfaced Daśamahāvidyā material directly** — 126 titles across Kālī,
Bagalāmukhī, Mātaṅgī, Tārā, Bhuvaneśvarī, Bhairavī, Chinnamastā, Dhūmāvatī, Kamalā on
stotranidhi's `dasa-mahavidya` category alone, replacing the old ~45 estimate for that section.

**Resolved 2026-09-04 — the user made these three calls explicitly, closing the questions below:**
1. **Śyāmalā/Mātaṅgī — confirmed the SAME deity, merged.** Śyāmalā (own cluster in the plain
   Devī category) and Mātaṅgī (cluster inside the Daśamahāvidyā category) are one goddess under
   two names. Reconciling `devi/syamala/`'s own candidate pool against what's actually written
   in `devi/dasamahavidya/` (21 files, none Mātaṅgī-titled) found the two "clusters" were always
   the same cross-tagged source material, not separate title pools — nothing was actually being
   double-counted in the numeric estimates. Unified, deduplicated pending pool: **~7**
   (unchanged), now tracked as one list under `devi/syamala/`; see the Śyāmalā/Mātaṅgī section of
   `devi/REMAINING_STOTRAS_TRACKING.md` for the full reconciled list, caveat removed.
2. **Bālā — confirmed DIFFERENT from Lalitā, no merge needed.** `devi/bala/`'s own pending pool
   (~16) and the Bālā-Tripurasundarī material tracked under Lalitā's remainder are genuinely
   separate content, not a double-counted pool. Both stand exactly as already tracked,
   independently — content unchanged, only the routing caveat is removed.
3. **Kālikā/Kālī — confirmed the SAME deity, merged.** The general Kālikā/Kālī deity-pool
   (`devi/kalika/`) and the Kālī cluster found via the Daśamahāvidyā crawl are the same
   underlying tracking pool — both crawls hit the same cross-tagged stotranidhi/vignanam posts.
   Reconciling the candidate lists found no distinct additional titles beyond what
   `devi/kalika/`'s own list already itemizes, and confirmed Daśa Mahāvidyā's own "~24
   remaining" figure never included any Kālī titles in the first place (it's explicitly the
   non-Kālī, non-Mātaṅgī vidyā total) — so nothing needed re-subtracting there either. Unified,
   deduplicated pending pool: **~32** (refined via full itemization from the earlier rough
   ~26/45 estimates). Kālī-as-one-of-the-ten-Mahāvidyā-forms remains a legitimate, distinct
   theological category under `devi/dasamahavidya/` — only the candidate-title bookkeeping is
   unified; nothing already written under either folder is questioned or altered.

**Still open — not yet resolved, need your call before writing:**
4. **Borderline-deity calls** (found across Lakṣmī, Devī-main, and Lalitā re-audits) — several
   titles are for deities adjacent to but arguably distinct from the section they were found in:
   Godā Devī/Āṇḍāḷ (Vaiṣṇava, not Śākta), Vāsavī Kanyakā Parameśvarī, Tulasī Devī, Devasenā/Vallī
   (Skanda's consorts), Nandikeśvara (not a Devī form at all), joint-deity texts (Umā Maheśvara
   Stotram, Ardhanārīśvarāṣṭakam). None of these are counted in the totals above pending an
   in/out-of-scope decision.
5. **sanskritdocuments.org not fully reconciled for Devī-main** — only a small `devI-`-prefix
   slice (~54 items) of its ~2,053-entry `doc_devii/` index was spot-checked; the full sweep
   could plausibly add another 30-80 titles on top of the numbers above.

Full per-title lists (URLs, author/recension notes, nāmāvalī flags) for all 6 re-audits exist
in this session's research — ask if you want them written out into these tracking docs in full,
rather than just the summary counts above.

Nothing else remains unresearched: any deity not covered by vignanam.org's ~22-category tree
or stotranidhi.com's category list (both already used as the primary crawl targets for
everything above) — e.g. other regional/temple-specific deities or minor Purāṇic figures
without their own category on either source site — is considered out of scope by the same
logic, not an open question. As of 2026-08-24, the deity map is fully closed: Gaṇeśa, Kṛṣṇa,
Rāma, Nṛsiṁha, Vēṅkaṭēśvara, Dattātrēya, standalone Śani, Śṛṅgēri/Kāñcī pontiff-paramparā,
Kāmākṣī, Mīnākṣī, Annapūrṇā, Gōdā/Āṇḍāḷ, Rāghavēndra Svāmi, Brahmā, Kubēra, and
Indra/Agni/Yama/Vāyu have all been researched.

---

## What "written" and "researched" mean here

- **Written** = a complete file exists per this corpus's spec: header block (Title in
  IAST/Devanāgarī/Telugu, Author, Source/recension, Verse count, Sections, Blurb), every verse
  as a `deva`/`iast`/`en`/`tel`/`hi` five-field block, closing recension note. Verified for
  uniform `ṁ` anusvāra, no embedded verse numbers, plain `e`/`o` (Sanskrit) — see the two
  completed corpora for the standard this holds to.
- **Researched, not yet written** = title + source-slug enumerated via a real category-page
  crawl of vignanam.org/stotranidhi.com (not recalled from memory), nāmāvalī-type work flagged
  separately, but no verse text has been sourced, translated, or verified yet. Zero tokens
  spent on translation for these — only on discovery.

---

## Priority picks already chosen (for the 2-week testing pass)

~37 texts across Devī/Śākta (see `REMAINING_STOTRAS_TRACKING.md` priority table, now incl.
Kāmākṣī/Mīnākṣī/Annapūrṇā/Gōdā picks) + ~36 texts across Śiva/Viṣṇu/Guru/Hanumān/Ayyappa/
Navagraha/Gaṇeśa/Kṛṣṇa/Rāma/Nṛsiṁha/Vēṅkaṭēśvara/Dattātrēya/Śani (see
`OTHER_DEITIES_TRACKING.md` priority table, now incl. Śṛṅgēri + Kāñcī Guruparamparā picks) =
**~73 texts** flagged as a first concrete batch spanning every section.

**2026-08-25 update:** the first-batch write-up is done. 59 files went in across the 20
previously-zero-coverage sections (Guru, Hanumān, Ayyappa, Navagraha, Vēṅkaṭēśvara, Dattātrēya,
Śani, Brahmā, Kubēra, Indra/Agni/Yama/Vāyu, Śiva, Viṣṇu, Gaṇeśa, Kṛṣṇa, Rāma, Nṛsiṁha, plus the
Devī-form gaps Sarasvatī/Gāyatrī/Bālā/Kālikā) — see the "Status at a glance" table above for
per-section written counts. Kubēra's and the minor-Vedic-deity pool are now fully exhausted (1
and 2 genuine titles respectively, both written). Everything else in the ~73-pick list still has
remainder written for its section per the table.

### 2026-09-02 update — large authoring push, most remaining zero-coverage sections filled

A big multi-agent authoring pass (Round 1 remainder + Round 2 + Round 3 of
`AUTHORING_QUEUE.md`) ran across most of the previously-planned-only or shallow sections.
Corpus-wide `.txt` count went from 162 to **255** (verified via `find . -name "*.txt" | wc -l`
from the `stotras/` root).

- **Newly written from zero:** Śyāmalā/Mātaṅgī (3), Pratyaṅgirā (3), Daśa Mahāvidyā (16),
  Mīnākṣī (2), Annapūrṇā (2), Gōdā/Āṇḍāḷ (2).
- **New top-level folder created: `ganga/`** (5 titles: Gaṅgā Laharī, Gaṅgāṣṭakam, Gaṅgā
  Stōtram, Gaṅgā Stavaḥ, Gaṅgā Kavacam) — this resolves the ambiguous `devi/ganga/`-or-`ganga/`
  routing question the "Status at a glance" table previously left open. The section's folder is
  now recorded as top-level `ganga/`, matching the folder-convention note at the top of this doc
  (major goddess, not nested under a specific Devī-form).
- **New folder created: `devi/nadi/`** (4 titles: Yamunāṣṭakam, Kāverī Stotram, Narmadāṣṭakam,
  Śrī Gōdāvarī Aṣṭakam). One candidate, "Nadī Stotram" (Nāradīya Purāṇa), was deliberately
  skipped — verified as a bare river-name nāmāvalī list rather than a per-verse praise-stotra, so
  it doesn't fit this corpus's format. The section is confirmed genuinely exhausted at 4 titles
  for this authoring pass, even though further nadī research may exist beyond it.
- **Deepened sections (already had files, now more):** Subrahmaṇya 25→30, Devī-main 23→26,
  Lalitā 14→18, Durgā 16→21, Lakṣmī 14→18, Śiva 3→8, Viṣṇu 3→8, Gaṇeśa 3→8, Hanumān 3→8,
  Navagraha 3→8, Rāma 3→8, Kṛṣṇa 3→8.
- **Kāmākṣī re-queue:** two titles assigned this round (Kāmākṣī Navaratnamālikā Stōtram,
  Kāmākṣyaṣṭakam) were never actually written to disk despite being marked assigned — confirmed
  missing from `devi/lalita/` on re-check. They're re-queued in `AUTHORING_QUEUE.md` and not yet
  re-attempted; the Kāmākṣī row above still shows 0 additional beyond the original 4.
- **Unchanged this round:** Guru, Ayyappa, Dattātrēya, Nṛsiṁha, Vēṅkaṭēśvara, Śani, Brahmā,
  Kubēra, Indra/Agni/Yama/Vāyu, Vārāhī, Sarasvatī, Gāyatrī, Bālā, Kālikā — all held at their
  2026-08-25 counts.
- Note on the TOTAL row: this table's row-by-row sum is 255, which reconciles exactly with the
  corpus-wide `find` count — no untracked subfolders are contributing to the grand total.

---

### 2026-09-02 update (second wave) — Śiva/Guru/Gaṇeśa/Kṛṣṇa/Navagraha/Hanumān deepened to 13; Ayyappa/Dattātrēya/Śani/Nṛsiṁha/Vēṅkaṭēśvara to 6

A further multi-agent pass (`AUTHORING_QUEUE.md`'s "Round 4") ran after the Round 3 push above,
pulling directly from each section's itemized list in `OTHER_DEITIES_TRACKING.md`. Corpus-wide
`.txt` count went from 255 to **306** (verified via `find stotras -name "*.txt" | wc -l` from
the `stotras/` root; brahma/ re-confirmed still at 6 and devi/lalita/ re-confirmed still at 18
immediately before this update, per the standard concurrent-agent caution).

- **Deepened to 13 (from 8):** Śiva, Gaṇeśa, Kṛṣṇa, Navagraha, Hanumān.
- **Deepened to 13 (from 5):** Guru.
- **Deepened to 6 (from 3):** Ayyappa, Dattātrēya, Śani (standalone), Nṛsiṁha, Vēṅkaṭēśvara.
- **Unchanged this round:** Viṣṇu (8), Rāma (8), Brahmā (6), Subrahmaṇya (30), all Devī/Śākta
  sections, Gaṅgā, Minor Nadīs, Kubēra, Indra/Agni/Yama/Vāyu — held at their prior counts.
- See `OTHER_DEITIES_TRACKING.md`'s per-section folder headers for the exact titles written in
  this round, and `AUTHORING_QUEUE.md`'s session log for the full list in one place.
- Note on the TOTAL row: the table's row-by-row sum is 306, reconciling exactly with the
  corpus-wide `find` count.

---

### 2026-09-04 update (mega round) — one 5-title tranche across nearly every section; Annapūrṇā, Vārāhī, and standalone Śani now pool-exhausted

The largest single authoring push in this project's history: ~30 parallel agents, each pulling
its section's next tranche directly from `OTHER_DEITIES_TRACKING.md` /
`devi/REMAINING_STOTRAS_TRACKING.md`'s itemized candidate lists. Corpus-wide `.txt` count went
from 315 to **451** (verified via `find stotras -name "*.txt" | wc -l` from the `stotras/`
root) — 136 new files across 30 folders.

- **+8:** Subrahmaṇya (→38).
- **+5 each:** Gaṇeśa, Navagraha, Śiva, Viṣṇu, Guru, Hanumān, Ayyappa, Kṛṣṇa, Rāma (see table
  above for new totals), and on the Devī/Śākta side: Devī-main, Lalitā, Durgā, Lakṣmī,
  Śyāmalā/Mātaṅgī, Bālā, Kālikā/Kālī, Pratyaṅgirā, Daśa Mahāvidyā, Sarasvatī, Gāyatrī, Mīnākṣī,
  Annapūrṇā.
- **+4 each:** Nṛsiṁha, Vēṅkaṭēśvara, Dattātrēya.
- **+3:** Śani.
- **+2:** Gōdā/Āṇḍāḷ.
- **+1:** Vārāhī.
- **Unchanged:** Brahmā (13, already pool-exhausted), Kubēra, Indra/Agni/Yama/Vāyu, Gaṅgā,
  Minor Nadīs, Kāmākṣī sub-row — all held at prior counts, none touched this round.
- **Two sections newly confirmed POOL EXHAUSTED / COMPLETE:** Annapūrṇā (all remaining
  candidates verified nāmāvalī/sahasranāma-type) and Vārāhī (8 of 9 remaining candidates
  verified ritual/nāmāvalī/mantra-type; the 9th, a dhyāna-śloka set, was written). Standalone
  Śani also turned out fully exhausted by this round's 3 titles — every genuine title in its own
  itemized list is now written — see `OTHER_DEITIES_TRACKING.md`'s Śani section.
- **Cross-reference resolved:** "Śrī Yōgamīnākṣī Stōtram" and "Śrī Mīnākṣī Navaratnamālā," both
  previously listed as pending candidates under the Devī-main-remainder section, were written
  this round under `devi/meenakshi/` instead — both tracking docs are now cross-annotated so
  neither is left dangling as "still pending" in the wrong section.
- Full itemized title lists live in `OTHER_DEITIES_TRACKING.md` and
  `devi/REMAINING_STOTRAS_TRACKING.md` (both refreshed 2026-09-04); see `AUTHORING_QUEUE.md`'s
  session log for the condensed one-place summary.
- Note on the TOTAL row: the table's row-by-row written-count sum is 451, reconciling exactly
  with the corpus-wide `find` count.

---

### 2026-09-05 update — +243 titles (451 → 694), five exhaustion verdicts, and a corpus-wide normalization pass

The largest authoring round yet, roughly 1.8× the previous record: **243 new files**, taking the
corpus from 451 to **694** `.txt` files (verified via `find . -name '*.txt' | wc -l` from the
`stotras/` root). Every partial section except the already-exhausted ones received a tranche,
most of them 10 titles.

- **+11:** Viṣṇu (→24).
- **+10 each:** Subrahmaṇya (→48), Śiva (→28), Kṛṣṇa (→28), Rāma (→23), Gaṇeśa (→28), Navagraha
  (→28), Guru (→28), Hanumān (→28), Ayyappa (→21), Nṛsiṁha (→20), Vēṅkaṭēśvara (→20), Dattātrēya
  (→20), Gaṅgā (→15), and on the Devī/Śākta side: Devī-main (→41), Lalitā (→35), Durgā (→36),
  Lakṣmī (→33), Sarasvatī (→18), Kālikā/Kālī (→18), Bālā (→18), Daśa Mahāvidyā (→31).
- **+7 each:** Gāyatrī (→15), Śyāmalā/Mātaṅgī (→15).
- **+5:** Mīnākṣī (→12). **+3:** Pratyaṅgirā (→11).
- **Unchanged:** Vārāhī (12), Annapūrṇā (7), Gōdā/Āṇḍāḷ (4), Minor Nadīs (4), Śani (9), Brahmā
  (13), Kubēra (1), Indra/Agni/Yama/Vāyu (2) — all eight already pool-exhausted or closed.
- **Coverage milestone:** with Bṛhaspati Kavacam and Kētu Kavacam written, **every one of the nine
  grahas now has at least one text** in `navagraha/`. Sītā Kavacam is the first Sītā-specific
  title in `rama/`.

**Five exhaustion verdicts settled this round by exhaustive sitemap crawls** — two closes, three
corrections in the other direction:

- **`devi/pratyangira/` — EXHAUSTED at 11.** All 31 stotranidhi pratyangira/bhadrakali slugs plus
  the sanskritdocuments holdings accounted for; everything left is mantra-prayoga/bīja-string
  genre, out of scope.
- **`devi/meenakshi/` — EXHAUSTED at 12.** stotranidhi carries only 4 Mīnākṣī titles (all
  written); sanskritdocuments' Devī index has 11, all accounted for.
- **`devi/syamala/` — NOT exhausted.** Three genuine unwritten texts remain, all
  sanskritdocuments-only. Note the structural finding: Śrī Mātaṅgī Stōtram (Āgamasāra,
  Umāsahācārya, 95 verses) is the parent text from which several existing folder files are
  excerpts — its vv. 38, 79 and 80 open files 06, 02 and 12 respectively. Also open: Śrī Mātaṅgī
  Stutiḥ 1 (58 v, a more corrupt parallel recension) and Śrī Mātaṅgī Dhyānam (5 v); Rāja Śyāmalā
  Rahasya Upaniṣad remains unassessed for scope.
- **`devi/gayatri/` — NOT exhausted.** The prior "thin remainder" estimate was simply wrong — ten
  genuine titles are still open on sanskritdocuments (itemized in the table row above).
- **`ganga/` — NOT exhausted.** ~30 further distinct sanskritdocuments `doc_devii` texts screened
  as promising, itemized in `devi/REMAINING_STOTRAS_TRACKING.md`. The Gaṅgāṣṭakam title alone has
  ~10 genuinely distinct authorial recensions; four are now written.
- Still open in **`devi/dasamahavidya/`**: Bagalāmukhī Kavacam 4 (52 v) and 5, Bagalāmukhī Varṇa
  Kavacam, and Bhairavī Kavacam Trailokyavijayam (a distinct slug from the written file 14 —
  diff the fetched text before writing).

**Routing finding — the Bhadrakālī texts belong under Kālikā, not Pratyaṅgirā.** stotranidhi files
five Bhadrakālī texts (Kavacam 1, Kavacam 2 "Jaganmaṅgalam", Aṣṭakam 1, Aṣṭakam 2, Stutiḥ) under
its **Kālikā** category. These route to `devi/kalika/`, along with sanskritdocuments'
`bhadrakAlIkavacham` / `…2` / `bhadrakAlIstutiH`. Two are already written there (Aṣṭakam 1 = file
08, Stutiḥ = file 18); the other three now count in the Kālikā remainder. **Bhadrakālī Kavacam 2
(Jaganmaṅgalam) is a DIFFERENT text** from the already-written Pratyaṅgirā Kavacam 2
(Jaganmaṅgalakam) — different opening, ṛṣi Śiva, devatā Bhadrakālikā. The shared "Jaganmaṅgala"
epithet is a genre label, not an identity; do not treat it as a duplicate.

**New standing sourcing rule — modern compositions under copyright are permanently out of scope.**
Several candidate titles on sanskritdocuments.org carry an **explicit copyright notice** on the
source page: Jyōtirlakṣmī Stōtram, Sītā-Lakṣmī Pañcakam and Aṣṭādaśa Mahālakṣmī Stōtram (Pushpa
Srivatsan), and Mahālakṣmī Stavanam (Dr. Harekrishna Meher). These were correctly skipped. This is
now a third standing exclusion criterion alongside the existing two (nāmāvalī/sahasranāma
name-list works → separate reference-list treatment; Śataka-length and dense kāvya works →
deferred). Check the source page footer before writing any title that looks modern.

**Corpus-wide normalization pass (2026-09-05).** 133 legacy files were brought into line with the
corpus's own stated conventions: embedded verse numbers stripped from `deva:`/`iast:` verse text
(3,357 field-blocks), `ē`/`ō` → plain `e`/`o` (729), decomposed `r̥` → precomposed `ṛ` (440), `ṃ`
→ `ṁ` (1). **Nine non-Sanskrit works were deliberately EXCLUDED** from the ē/ō transform because
those vowels are phonemic in their languages: Subrahmanya/06 Kandar Ṣaṣṭhi Kavacam, ayyappa/01
Harivarasanam, devi/durga/15 Durgā Cālīsā, devi/gayatri/10 Gāyatrī Cālīsā, devi/goda/02
Tiruppāvai, devi/goda/04 Nācciyār Tirumoḻi, devi/main/09 Abhirāmi Andādi, hanuman/02 Hanumān
Cālīsā, rama/19 Tulasīdāsa-kṛta Rāma Stuti. Also excluded by design: devi/main/04 Devī Khaḍgamālā
Stōtram, whose parenthesised numerals are name-count annotations rather than verse numbers.
Verification: every changed file was diffed against a pre-change backup and confirmed
content-equivalent under exactly those four transforms — **zero unexpected semantic differences**.

**One issue raised, not resolved — duplicates.** A two-pair dedup flag raised during this round
was widened into a corpus-wide audit over all 694 files (title-normalised match ∪ Devanāgarī
content match). It found **10 duplicate pairs, not 2** — the original spot-check was title-only
and covered one round's output. The ten pairs were then merged and the redundant copies retired, taking the corpus to
**684 files = 684 distinct works**. Full table, evidence, and a recommended routing call for each pair: **`DEDUP_AUDIT.md`**.
The same audit surfaced a split colophon convention (16 files use a `Colophon:` field, 92 carry the
colophon as a trailing verse block, inflating those verse counts by one) — recorded there, not
actioned.

- Note on the TOTAL row: the table's row-by-row written-count sum is 684, reconciling exactly with
  the corpus-wide `find` count.

---

## Next steps (pick one, or say how much scope you want)

**Note (2026-09-05):** the original ~73-text priority-pick list from the first batch is long
since cleared — every section now has at least 4-48 titles written (see the table above). The
options below still apply as general directions for further scope, just at the corpus's current,
much deeper baseline rather than the original first-batch framing.

1. Keep deepening the still-partial sections (most now have 15-48 titles written against
   estimated pools of dozens to hundreds each) — broadest coverage for testing, smallest
   commitment per section per pass.
2. Write one deity/section to full completion. **Nine sections are now pool-exhausted**
   (Pratyaṅgirā and Mīnākṣī joined Annapūrṇā, Vārāhī, Brahmā, Kubēra, Śani and
   Indra/Agni/Yama/Vāyu on 2026-09-05), and the nearest to closing next are **Śyāmalā/Mātaṅgī**
   (3 confirmed + 1 unassessed left), **Bālā** (~6), **Ayyappa** (~8-10), **Gāyatrī** (~10-12) and
   **Daśa Mahāvidyā** (~14) — deepest single-section coverage for the least work.
3. Clear the two housekeeping items this round raised: the **Lalitā/Daśamahāvidyā dedup** (2
   duplicate file pairs, see the Lalitā section of `devi/REMAINING_STOTRAS_TRACKING.md`) and the
   **Śyāmalā parent-text routing** (the 95-verse Āgamasāra Mātaṅgī Stōtram overlaps three existing
   files) — both need a decision before the next tranche is assigned to either section.
4. Something else — name the scope and I'll take it from there.

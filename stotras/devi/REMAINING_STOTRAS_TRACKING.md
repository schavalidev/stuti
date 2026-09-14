# Devī corpus — remaining stotras tracking

Status as of 2026-08-25. This is a **planning/tracking document only** — titles and source
slugs, no verse content beyond what's noted as written below. **2026-08-25 update:** Sarasvatī,
Gāyatrī, Bālā, and Kālikā/Kālī — the four sections in this doc that had zero coverage — each now
have their first 3 titles written (see each section's "Suggested folder" line below); everything
else in those four sections, and every other section in this doc, remains researched-only. Use
it to scope future batches. `devi/main/` (1-23), `devi/lalita/`
(1-14, incl. Kāmākṣī 03-06), `devi/durga/` (1-16), `devi/lakshmi/` (1-14), `devi/varahi/`
(1-11) — 78 files total — are **written and correct as far as they go**, but as of 2026-08-24
a re-audit found **all five are undercounted, some drastically**; see the "RE-AUDIT" sections
for each, added below. **Do not treat any of these five as complete anymore.** Kāmākṣī,
Mīnākṣī, Annapūrṇā, and Gōdā Dēvī/Āṇḍāḷ were added as new researched-not-written sections on
2026-08-24 too — Kāmākṣī specifically has 4 of its items already covered by `lalita/03-06`, see
that section below before writing more.

**2026-09-02 update:** a large authoring push wrote files across most remaining sections —
Śyāmalā/Mātaṅgī (3), Pratyaṅgirā (3), Daśa Mahāvidyā (16), Mīnākṣī (2), Annapūrṇā (2),
Gōdā/Āṇḍāḷ (2), plus new tranches in Lalitā (14→18), Durgā (16→21), and Lakṣmī (14→18). See
each section's own header line below for the exact titles now written. Sarasvatī, Gāyatrī,
Bālā, and Kālikā remain unchanged at 3 written each this round. Vārāhī was not touched.

**2026-09-04 update (mega authoring round):** every section in this doc except Vārāhī and
Annapūrṇā's-now-exhausted-neighbors got another 5-title tranche (Vārāhī got its final 1;
Annapūrṇā got 5 and is now itself pool-exhausted). `devi/` folder-by-folder current totals:
main 31, lalita 25, durga 26, lakshmi 23, syamala 8, bala 8, kalika 8, pratyangira 8,
dasamahavidya 21, saraswati 8, gayatri 8, meenakshi 7, annapurna 7 (POOL EXHAUSTED), goda 4,
varahi 12 (POOL EXHAUSTED). See each section's own header line below for the exact titles
written this round, and the refreshed "Grand total remaining" table at the end of this file
(also refreshed this round — it had gone stale after 2026-09-02 and understated several
sections' written counts). The Yōgamīnākṣī / Mīnākṣī Navaratnamālā cross-reference between the
Devī-main-remainder list and the Mīnākṣī section has been resolved — both titles are now
written under `devi/meenakshi/`, and the Devī-main list has been annotated so neither is left
dangling as "still pending" there.

Sourcing convention for everything below: primary = vignanam.org, cross-check =
sanskritdocuments.org + stotranidhi.com + hariome.com, same rules as the completed batches
(see `devi_corpus_spec.md` in that batch's scratchpad if resuming — recreate it fresh if not
available, the rules are also restated in this project's earlier sessions).

Nāmāvalī / sahasranāma / aṣṭōttaraśatanāma-type name-list works are flagged **[NĀMĀVALĪ]**
below — these route to a separate reference-list file, not a full verse-by-verse stotra
treatment, per this corpus's established convention.

**Standing exclusion criterion added 2026-09-05 — modern compositions under copyright.** Several
candidate titles on sanskritdocuments.org are **modern compositions carrying an explicit copyright
notice** on the source page — encountered this round in the Lakṣmī pool: Jyōtirlakṣmī Stōtram,
Sītā-Lakṣmī Pañcakam and Aṣṭādaśa Mahālakṣmī Stōtram (Pushpa Srivatsan), and Mahālakṣmī Stavanam
(Dr. Harekrishna Meher). These were correctly skipped. This corpus carries traditional /
public-domain material only, so **copyright-notice titles are a permanent skip**, a third standing
rule alongside the [NĀMĀVALĪ] routing rule and the Śataka-length/dense-kāvya deferral. Check the
source page footer before writing any title that looks like a modern composition.

**2026-09-05 update (large authoring round, +102 files on the Devī/Śākta side, +10 in top-level
`ganga/`).** Per-folder current totals: main 41, lalita 35, durga 36, lakshmi 33, saraswati 18,
gayatri 15, kalika 18, bala 18, syamala 15, pratyangira 11 (**POOL EXHAUSTED**), dasamahavidya 31,
meenakshi 12 (**POOL EXHAUSTED**), varahi 12 (POOL EXHAUSTED), annapurna 7 (POOL EXHAUSTED), goda
4, nadi 4 — `devi/` totals **310 files**, plus top-level `ganga/` at **15**. Four exhaustion
verdicts were settled this round by exhaustive sitemap crawls: **Pratyaṅgirā and Mīnākṣī are now
pool-exhausted**, while **Gāyatrī, Śyāmalā/Mātaṅgī and Gaṅgā are confirmed NOT exhausted** — their
prior remainder estimates were understated and have been corrected in each section and in the
grand-total table at the end of this file. A **routing finding** also moved the five Bhadrakālī
texts from the Pratyaṅgirā association into `devi/kalika/` (see the Kālikā section), and a **dedup
flag** was raised on two Lalitā/Daśamahāvidyā file pairs (see the Lalitā section).

---

## 🎯 PRIORITY PICKS — 2-3 per section, for the 2-week testing pass

Pulled from the sections below; chosen for (a) being on vignanam.org where possible — the
most reliable source in this corpus's experience, (b) being genuinely representative of the
deity, (c) spanning different text-types (not three near-duplicates). **This is a
recommendation, not a commitment — swap freely.**

| Deity/section | Picks |
|---|---|
| **Sarasvatī** | Sri Saraswati Stotram 1; Sri Saraswati Kavacham (Brahma Vaivarta Purana); Sri Sharada Pancharatna Stotram |
| **Gāyatrī** | Gayatri Stotram 1; Sri Gayatri Kavacham 1; Sri Gayatryashtakam |
| **Devī main (remainder)** | Śrī Jvālāmukhī Stōtram 1; Śrī Rājarājēśvarī Ṣōḍaśī; Śrī Vindhyavāsinī Stōtram |
| **Śyāmalā/Mātaṅgī** | Śrī Śyāmalā Daṇḍakam; Śrī Mātaṅgī Stōtram 1; Śrī Śyāmalā Kavacam |
| **Bālā** | Śrī Bālā Stōtram 1; Śrī Bālā Kavacam 1; Śrī Bālā Pañcaratna Stōtram |
| **Kālikā/Kālī** | Śrī Mahākālī Stōtram; Śrī Kālikāṣṭakam; Śrī Kālī Kavacam (Trailōkyavijayam) |
| **Pratyaṅgirā** | Śrī Pratyaṅgirā Stōtram 1; Śrī Pratyaṅgirā Daṇḍakam; Śrī Pratyaṅgirā Kavacam 1 (Sarvārthasādhanam) |
| **Daśa Mahāvidyā — Bagalāmukhī** | Śrī Bagalāmukhī Stōtram 1; Śrī Bagalāmukhī Kavacam 1 |
| **Daśa Mahāvidyā — Kamalā** | Śrī Kamalā Stōtram 1; Śrī Kamalā Kavacam |
| **Daśa Mahāvidyā — Tārā** | Śrī Tārā Stōtram; Śrī Tārāṣṭakam |
| **Daśa Mahāvidyā — Bhuvaneśvarī** | Śrī Bhuvaneśvarī Stōtram; Śrī Bhuvaneśvarī Kavacam |
| **Daśa Mahāvidyā — Chinnamastā** | Śrī Chinnamastā Devī Stōtram; Śrī Chinnamastā Kavacam |
| **Daśa Mahāvidyā — Dhūmāvatī** | Śrī Dhūmāvatī Stōtram; Śrī Dhūmāvatī Kavacam |
| **Daśa Mahāvidyā — Tripura Bhairavī** | Śrī Tripura Bhairavī Stōtram; Śrī Tripura Bhairavī Kavacam |
| **Daśa Mahāvidyā — Ṣoḍaśī/Tripurasundarī** | Tripurasundarī Stōtram 1; Mahātripurasundarī Ṣaṭkam |
| **Kāmākṣī (beyond the 4 already written)** | Kāmākṣī Navaratnamālikā Stōtram; Kāmākṣyaṣṭakam |
| **Mīnākṣī** | Mīnākṣī Stōtram; Mīnākṣī Pañcaratnam |
| **Annapūrṇā** | Śrī Annapūrṇā Stōtram; Annapūrṇā Kavacam |
| **Gōdā Dēvī/Āṇḍāḷ** | Godā Stuti (Vēdānta Dēśika); Tiruppāvai (Tamil, flag non-Sanskrit) |

That's ~37 texts — a manageable first pass that touches every remaining section, including the
four newly-researched Devī-forms.

**2026-08-25 update:** the Sarasvatī, Gāyatrī, Bālā, and Kālikā/Kālī picks above are now written
(see each section below for folder/file detail). The rest of this priority-pick list (Devī main
remainder, Śyāmalā/Mātaṅgī, Pratyaṅgirā, Daśa Mahāvidyā, Kāmākṣī extra, Mīnākṣī, Annapūrṇā,
Gōdā/Āṇḍāḷ) remains researched-only.

---

## SARASVATĪ (new section — no folder yet)

Source: stotranidhi.com `category/saraswati-en/` (42 items, 2 pages) + vignanam.org (up to 15,
overlapping). Folder: `devi/saraswati/` — 18 written: 3 on 2026-08-25 (Sri Saraswati Stotram 1, Sri
Saraswati Kavacham [Brahma Vaivarta Purana], Sri Sharada Pancharatna Stotram) + 5 more on
2026-09-04 (**Sri Saraswati Ashtakam**, **Sri Sharada Dashakam**, **Sri Vagvadini Shatkam**,
**Sri Bharati Bhavana Stotram**, **Sri Saraswati Dasha Shloki Stuti**) + 10 more on 2026-09-05
(**Śrī Bhavasodarī Aṣṭakam**, **Śrī Sarasvatī Stavam**, **Śrī Sarasvatī Sarasaśānti Sudhārasa
Stotram**, **Śrī Sarasvatī Stotram 2**, **Śrī Sarasvatī Stotram** [Rudrayāmale
Bṛhaspati-kṛtam], **Śrī Sarasvatī Stotram** [Vāmana Purāṇe Mārkaṇḍeya-kṛtam], **Śrī Sarasvatī
Stuti** [Varāha Purāṇe Brahma-kṛtā], **Śrī Kamalajadayitāṣṭakam**, **Śrī Vāsara Sarasvatī
Stotram**, **Śrī Śāradā Bhujaṅga Prayātāṣṭakam**), remainder
researched.

**Genuine stotra/stuti/stava/kavacham/aṣṭakam (36):**
Sri Bhavasodari Ashtakam · **Sri Saraswati Ashtakam** · **Sri Saraswati Dasha Shloki Stuti** ·
Sri Saraswati Nakshatra Mala Stava · Sri Saraswati Rahasya Stotram · Sri Saraswati Stavam 2 ·
Sri Saraswati Sarasashanti Sudharasa Stotram · Sri Saraswati Stotram 1 · Sri Saraswati Stotram 2 ·
Sri Saraswati Stotram 3 · Sri Saraswati Stotram (Rudrayamale Bruhaspati Krutam) ·
Sri Saraswati Stotram (Vamana Purane Markandeya Krutam) ·
Sri Saraswati Stavam (Vasudevananda Saraswati Krutam) ·
Sri Saraswati Stuti (Vasudevananda Saraswati Krutam) ·
Sri Saraswati Stuti (Varaha Purane Brahma Krutam) · Sri Sharada Bhujanga Prayata Stuti ·
**Sri Sharada Dashakam** · Sri Sharada Pancharatna Stotram · Sri Sharada Pancharatna Stuti ·
Sri Siddha Saraswati Stotram · Sri Vagdevi Stava · **Sri Vagvadini Shatkam** ·
Sri Vani Prashnamala Stava · Sri Vani Sharanagati Stotram · Sri Vasara Saraswati Stotram ·
**Sri Bharati Bhavana Stotram** · Sri Saraswati Stavam (Ashwatara Krutam) ·
Sri Saraswati Kavacham (Variation) · Sri Kamalajadayita Ashtakam ·
Saraswathi Suktam (Rigveda Samhita) [Vedic] · Sri Vani Stavanam (Yajnavalkya Kritam) ·
Sri Saraswati Kavacham (Brahma Vaivarta Purana) · Sri Saraswati Stavam 1 (Brahma Krutam) ·
Sri Saraswati Stotram (Agastya Krutam) · Sharada Bhujanga Prayata Ashtakam · Sri Sharada Prarthana

Additional vignanam.org-only (Telugu, may overlap above by content): మహా సరస్వతీ స్తవం ·
సరస్వతీ కవచం (2nd recension?) · నీలసరస్వతీ స్తోత్రం · సరస్వతీ ప్రార్థన ఘనపాఠః (Vedic) ·
సూక్తం x2 (Ṛgveda + Yajurveda)

**[NĀMĀVALĪ] — route to reference file (6+5):**
Vāgvādinī Sahasranāma · Sarasvatī Sahasranāmāvalī · Sarasvatī Sahasranāma Stōtram ·
Sarasvatī Dvādaśanāma Stōtram · Sarasvatī Aṣṭōttaraśatanāmāvalī · Sarasvatī Aṣṭōttaraśatanāma Stōtram
(+ vignanam duplicates of the same set)

---

## GĀYATRĪ (new section — no folder yet)

Source: stotranidhi.com `category/gayatri-en/` (26 items, 2 pages) + vignanam.org (9 items).
Folder: `devi/gayatri/` — 15 written: 3 on 2026-08-25 (Gayatri Stotram 1, Sri Gayatri Kavacham 1, Sri
Gayatryashtakam) + 5 more on 2026-09-04 (**Sri Gayatri Bhujanga Stotram**, **Sri Gayatri Ashtakam
2**, **Sri Gayatri Kavacham 2**, **Sri Gayatri Stotram 2** [Devi Bhagavate], **Sri Gayatri
Lahari**) + 7 more on 2026-09-05 (**Śrī Gāyatrī Mantra Kavacam** [Devī Bhāgavate], **Śrī Gāyatrī
Cālīsā** [Hindi, carries an explicit non-Sanskrit language flag], **Śrī Gāyatrī Stutiḥ** [Varāha
Purāṇe, Maheśvara-kṛtā], **Śrī Gāyatrī Stotram 3** [Kṛṣṇānanda Sarasvatī], **Kāśyapa-kṛta
Gāyatrī Sarasvatī Stotram**, **Viṣṇu-kṛta Sāvitrī Stotram**, **Śrī Gāyatrī Vandanā**),
remainder researched.

**EXHAUSTION VERDICT 2026-09-05 — NOT exhausted; the earlier "thin remainder (~9)" estimate was
WRONG and understated the pool.** An exhaustive sitemap crawl this round found the following
genuine, unwritten Gāyatrī/Sāvitrī texts still open on sanskritdocuments.org (none of them on
stotranidhi.com, which is why the earlier stotranidhi-anchored estimate missed them):

- Gāyatrī Suprabhātam (28 v)
- Muktichintāmaṇi Gāyatrī Kavacam (60 v)
- Gāyatrī Kavacam 3 (42 v)
- Gāyatrī Mañjarī (46 v)
- Mahāgāyatrī Līlā Stutiḥ (13 v)
- Gāyatrī Kavacam 4 (11 v)
- Nārāyaṇa-prokta Sāvitrī Stotram
- Gāyatrī Nāmāṣṭāviṁśati Stotram
- Gāyatrī Nirvāṇam
- Gāyatrī Gītikā

That is **~10-12 genuine titles still remaining**, not the ~9-minus-7 the old estimate implied.
The "Grand total remaining" table at the end of this file and `PROJECT_TRACKING.md`'s Gāyatrī row
have both been corrected to match.

**Genuine stotra/stava/kavacham/aṣṭakam/cālīsā (17):**
**Sri Gayatri Lahari** · **Sri Gayatri Ashtakam 2** · Sri Gayatri Shapa Vimochanam ·
Sri Gayatri Stavaraja · **Sri Gayatri Kavacham 2** · Sri Gayatri Aksharavalli Stotram ·
Sri Gayatri Panjara Stotram (Savitri Panjaram) · Sri Gayatri Mantra Kavacham (Devi Bhagavate) ·
Sri Gayatri Hrudayam (Devi Bhagavate) · Sri Gayatri Chalisa · Sri Gayatri Kavacham 1 ·
**Sri Gayatri Bhujanga Stotram** · **Sri Gayatri Stotram 2 (Devi Bhagavate)** · Gayatri Stotram 1 ·
Sri Gayatri Ashtakam 1 · Sri Gayatri Tattva Mala Mantram ·
vignanam: గాయత్రీ హృదయం · గాయత్ర్యష్టకం · గాయత్రీ కవచం

**Mantra/tarpaṇa/pūjā-vidhi (not stotra genre — lower priority, judgment call):**
Vividha Gayatri Mantra · Gayatri Tarpanam · Gayathri Pancha Upachara Puja ·
Gayatri Mantra (plain) · vignanam's Ghanapāṭha and Mahānyāsa-Haṁsagāyatrī pieces

**[NĀMĀVALĪ] — route to reference file (6+3):**
Gāyatrī Sahasranāma Stōtram (×2 variants) · Gāyatrī Aṣṭōttaraśatanāma Stōtram (×2 variants) ·
Gāyatrī Aṣṭōttaraśatanāmāvalī (×2 variants) (+ vignanam duplicates)

**Ruled out (not their own section, too few items):** Gaṅgā (1-4 items), Tulasī (3),
Rādhā (2), Sītā (6, but filed under Rāma category on both sites, not standalone — flagging
as a possible future "Rāma-consort" cross-list rather than a Devī section), Rēṇukā (1),
Jagaddhātrī (1), Vāsavī Kanyakā Parameśvarī (3), Māriyammaṉ (0), Vaiṣṇo Devī
(0), Bhūdevi (0 dedicated). Bhārata Mātā has 11 items on vignanam but is a patriotic
personification, not a classical Devī deity — flagged but out of scope unless wanted.
**Godā/Āṇḍāḷ un-ruled-out 2026-08-24** — a proper dedicated research pass (see new section
below) found more than the earlier dismissive "(3)" note suggested; now has its own section.

---

## DEVĪ MAIN — remainder beyond #23

Source: stotranidhi.com `category/devi-en/` (193 posts) + vignanam.org's దేవీ (193, differently
scoped — folds in Lakṣmī/Sarasvatī/Durgā-Saptaśatī/Daśamahāvidyā material already counted
elsewhere above).

Folder: `devi/main/` — 41 written: 23 pre-existing + 3 on 2026-09-02 (Śrī Jvālāmukhī Stōtram 1,
Śrī Rājarājēśvarī Ṣōḍaśī, Śrī Vindhyavāsinī Stōtram — numbered 24-26) + 5 more on 2026-09-04
(**Śrī Jagaddhātrī Stotram**, **Śrī Kāśī Viśālākṣī Stotram** [Vyāsa-kṛtam], **Śrī Tulja Bhavānī
Stotram**, **Śrī Mūkāmbikā Stotram**, **Śrī Ṣaṣṭhī Devī Stotram** — numbered 27-31) + 10 more on
2026-09-05 (**Śrī Pārvatī Pañcakam**, **Śrī Jvālāmukhī Stotram 2**, **Śrī Jvālāmukhi Aṣṭakam**,
**Śrī Śākambharī Pañcakam**, **Saptamātṛkā Stotram**, **Śrī Sarvamaṅgalā Stotram**, **Śrī
Jñānaprasūnāmbikā Stotram**, **Śrī Maṅgalagaurī Stotram**, **Śrī Jogulāmbāṣṭakam**, **Śrī
Śreyaskarī Stotram** — numbered 32-41), remainder
researched.

**Genuine stotra-type (partial list — full detail preserved in this session's transcript,
re-derivable via the same category-page crawl if needed):**
Śrī Pārvatī Pañcakam 1/2 · Subhagōdaya Stutiḥ (Gauḍapādācārya) · **Śrī Yōgamīnākṣī Stōtram**
[written 2026-09-04 as `devi/meenakshi/03_yoga_meenakshi_stotram.txt` — see the Mīnākṣī section
below, not devi/main; do not treat as still-pending here] ·
**Śrī Jvālāmukhī Stōtram 1**/2 · Śrī Jvālāmukhi Aṣṭakam · Śrī Mahākālī Stōtram (Paraśurāma-kṛtam)
[also cross-filed under Kālī below] · Śrī Vārāhī (Vārtāḷī) Mantraḥ · **Śrī Vindhyavāsinī Stōtram** ·
Śrī Śākambharī Pañcakam · **Śrī Jagaddhātrī Stōtram** · Pañcastavī 1-5 (Laghustavaḥ, Carcāstavaḥ,
Ghaṭastavaḥ, Ambāstavaḥ, Sakalajananīstavaḥ) · Śrī Viśālākṣī Stōtram (Vyāsa-kṛtam) [distinct from
the newly-written Kāśī Viśālākṣī Stōtram below, still pending] ·
Catuḥṣaṣṭi Yōginī Nāma Stōtram 1/2 · Saptamātṛkā Stōtram · Nityā Dēvyaḥ Dhyāna Ślōkāḥ ·
**Śrī Rājarājēśvarī Ṣōḍaśī** · Mātṛkāvarṇa Stōtram · Śrī Sarvamaṅgalā Stōtram ·
Dēvī Catuḥṣaṣṭyupacārapūjā Stōtram · Śrī Jñānaprasūnāmbikā Stōtram · Śrī Maṅgalagaurī Stōtram ·
Śrī Sītā Kavacam · [Kāmākṣī and Gōdā/Āṇḍāḷ material moved to their own dedicated sections below
as of 2026-08-24 — do not itemize here] · Maṇidvīpavarṇanam (Dēvībhāgavatam) 1-3 ·
Śrī Vāsavīkanyakāparamēśvarī Aṣṭakam · Śrī Vāsavī Stōtram · Śrī Manasā Dēvī Mūlamantram ·
Śrī Bhramarāmbikāṣṭakam 2 (Śrīkaṇṭhārpita) [distinct from the one already done] ·
Trailōkyavijayavidyā · Saṅkaṭanāmāṣṭakam · Śrī Dākṣāyaṇī Stōtram · **Śrī Ṣaṣṭhī Dēvī Stōtram** ·
Mūkapañcaśatī 1-5 (Āryāśatakam, Pādāravindaśatakam, Stutiśatakam, Kaṭākṣaśatakam,
Mandasmitaśatakam) · Śrī Śrēyaskarī Stōtram · Śrī Śītalāṣṭakam · **Śrī Mīnākṣī Navaratnamālā**
[written 2026-09-04 as `devi/meenakshi/04_meenakshi_navaratnamala.txt` — see the Mīnākṣī section
below, not devi/main; do not treat as still-pending here] ·
Śrī Bālāmbikā Stōtram · Dēvī Ṣaṭkam · Śrī Jōgulāmbāṣṭakam · Śrī Gaurī Navaratnamālikāstavaḥ ·
Śrī Gaurī Saptaślōkī Stutiḥ · Śrī Bhavānī Bhujaṅga Stutiḥ · Navaratnamālikā · Dēvī Bhujaṅga
Stōtram · [Rēṇukā block, 5 items — kavacam/stōtram/hṛdayam, ruled out above as its own
section but still valid as devi/main additions if wanted]

**[NĀMĀVALĪ] flagged, not itemized here** — route to reference file when reached.

**Full re-derivation note:** this list is condensed from a live crawl performed earlier in
this session; if the crawl needs repeating (e.g. session context lost), re-run the same
enumerator-agent pattern used for Śyāmalā/Bālā/Kālikā/Pratyaṅgirā/Daśa-Mahāvidyā below against
`stotranidhi.com/en/category/devi-en/` (9 pages) and vignanam's దేవీ category.

### RE-AUDIT, 2026-08-24 — the ~60-70 estimate was badly low

A dedicated re-crawl (prompted after Dattātrēya's known undercount pattern recurred elsewhere)
found ~227 new title-groups across stotranidhi.com's `category/devi/` (8 pages, 191 posts) and
`category/dasa-mahavidya/` (6 pages, 137 posts) plus vignanam.org's "Devi Stotrams (189)" tree
— far above the old estimate. Two confirmed false-positive "gaps" from a related Durgā-section
pass turned out to already be written here: **Mahiṣāsuramardini Stotram** (#1 above) and
**Indrākṣī Stotram** (#12 above) — don't re-add them if seen again elsewhere.

**Multi-part works found (verify scope before treating as single titles):**
Devi Narayaniyam (41 dasakams, one continuous poem) · Manidweepa Varnanam (3 parts, from Devī
Bhāgavatam — descriptive/narrative, borderline whether it counts as a stotra) · Mooka
Panchasati (5 śatakams — Āryā/Pādāravinda/Stuti/Kaṭākṣa/Mandasmita, 500-verse Kāmākṣī work by
Mūka Kavi) · Panchastavi (5 parts — Laghu/Carcā/Ghaṭa/Ambā/Sakalajananī Stava) · Sri Parvati
Panchakam (2 versions)

**New named regional/Purāṇic Devī forms (single works, ~18):**
**Sri Jwalamukhi Stotram 1**/2 + Ashtakam · Parashurama Kruta Kali Stotram · **Sri Vindhyavasini
Stotram** · Sri Shakambhari Panchakam · **Sri Jagaddhatri Stotram** · **Sri Kasi Visalakshi Stotram
(Vyāsa-kṛtam)** · Sri Renuka Kavacham + Stotram (Paraśurāma-kṛtam) + Hrudayam · Sri Renuka
Ashtottara Shatanama Stotram + Shatanamavali **[NĀMĀVALĪ]** · Sri Gnana Prasunambika Stotram ·
**Sri Mukambika Stotram** · Abhirami Stotram [flag: verify Sanskrit vs. Tamil-tradition text —
the Abhirāmi tradition has both] · Sri Jogulamba Ashtakam · Sri Sheetala Devi Ashtakam ·
Subhagodaya Stuti (Gauḍapādācārya)

**Bhavānī/Gaurī/Umā/Pārvatī family, new (~13):**
**Sri Tulja Bhavani Stotram** · Sri Bhavani Bhujanga Stuti [distinct from the already-written
Bhavani Ashtakam] · Sri Mangala Gauri Stotram + Ashtottara Shatanamavali **[NĀMĀVALĪ]** ·
Sri Gauri Navaratnamalika Stava · Sri Gauri Saptashloki Stuti · Sri Uma Ashtottara
Shatanamavali + Shatanama Stotram **[NĀMĀVALĪ]** · Sri Dakshayani Stotram · Devi Shatkam ·
Navaratnamalika · Devi Bhujanga Stotram · Sri Sarvamangala Stotram

**Vāsavī/regional-community deities, new (3):** Vasavi Stotram · Sri Vasavi Kanyaka Ashtakam ·
Sri Vasavi Ashttotara Shatanamavali **[NĀMĀVALĪ]** [flag: borderline whether a regional
community deity belongs in this corpus at all]

**Bhramarāmbikā, new (2, distinct from the already-written Bhramaramba Ashtakam):**
Sri Bhramarambika Ashtakam (Sri Kantarpita) · Sri Bhramarambika Ashtakam (Telugu)

**Nāmāvalī/sahasranāma/aṣṭottara type, new (~17):** Sri Buddhi Devi Ashtottara Shatanama
Stotram · Sri Siddhi Devi Ashtottara Shatanama Stotram · Saubhagya Ashtottara Shatanama
Stotram · Sri Mahishasura mardini Ashtottara Shatanamavali [distinct from the written stotra
itself] · Sri Devi Khadgamala Namavali [distinct from the already-written Khadgamala Stotram] ·
Sri Annapurna Ashtottara Satanama Stotram + Shatanamavali [cross-check against the dedicated
Annapūrṇā section below] · Sri Kamakshi Ashtottara Shatanamavali [cross-check against Kāmākṣī
section below] · Sapta Matrika Stotram · Matrika Varna Stotram · Chatushashti (64) Yogini Nama
Stotram 1/2 · Trailokya Vijaya Vidya Mantra · Sankata Nama Ashtakam · Devi Chatushasti
Upachara Puja Stotram (ritual) · Kalyana Vrishti Stava (Panchadasi Stotram) · Shreyaskari
Stotram · Tithi Nitya Devi Dhyana Shlokas [flag: 16-Nitya-devī system is Śrīvidyā-adjacent,
cross-check against the Lalitā re-audit below before filing here]

**Flagged for routing review, NOT counted as devi/main material:**
- Goda Devi Ashtottara Shatanama Stotram, Goda Stuti, Goda Chathusloki — belongs to the
  dedicated Gōdā Dēvī/Āṇḍāḷ section above (Vaiṣṇava saint-poetess, not Śākta)
- Sri Devasena Ashtottara Shatanamavali, Sri Valli Ashtottara Shatanamavali — Subrahmaṇya's
  consorts, arguably belong under a Subrahmaṇya section (see `OTHER_DEITIES_TRACKING.md`'s
  Subrahmaṇya re-audit, which flags the same two titles)
- Sri Manasa Devi Mula Mantram — snake-goddess, overlaps `naga-devata` category
- Uma Maheswara Stotram, Ardha Naareeswara Ashtakam — joint Śiva-Pārvatī texts, borderline
- Nandikeshwara Ashtottara Sata Namavali (vignanam) — about Nandi, not a Devī form at all
- Sree Tulasi Ashtottara Satanaama Stotram (vignanam) — Vaiṣṇava plant-goddess, not Śākta

**RESOLVED 2026-09-04 — Śyāmalā/Mātaṅgī, same deity, merged:** the user made the call explicitly.
The 10-title Śyāmalā cluster (Śrī Śyāmalā Śōḍaśa Nāmāvalī, Aṣṭōttaraśatanāma Stōtram 1/2,
Sahasranāma Stōtram, Navaratnamālikā, Kavacam, etc.) that surfaced here in the plain Devī
category and the already-tracked Mātaṅgī cluster (13 titles) under Daśamahāvidyā below are the
same goddess under two names, cross-tagged into both site categories — reconciling
`devi/syamala/`'s own written files (8) against `devi/dasamahavidya/`'s (21, none Mātaṅgī-titled)
confirmed the "two clusters" were always the same source material, not a double-counted pool.
Now tracked as ONE unified, deduplicated pending list under the ŚYĀMALĀ / MĀTAṄGĪ section
further down this doc (~7 remaining, unchanged) — see that section for the full reconciled list.

**RESOLVED 2026-09-04 — Bālā confirmed DIFFERENT from Lalitā, no merge:** the user made the call
explicitly. The 20-title Bālā Tripurasundarī cluster (Sri Bala Tripurasundari Raksha Stotram,
Bala Hrudayam, Bala Kavacham 1/2, Bala Khadgamala Stotram, etc.) that surfaced here, and the
already-separately-tracked "BĀLĀ (~40)" section further down this doc, are genuinely different
material, not a double-counted pool — both pending pools stand exactly as already tracked,
independently. No content changed by this resolution, only the routing caveat is removed.

**vignanam.org, genuinely new beyond stotranidhi (19):** Uma Maheswara Stotram [borderline,
see above] · Ardha Naareeswara Ashtakam [borderline] · Devi Vaibhava Ashcharya Ashtottara Sata
Namaavali + Nama Stotram **[NĀMĀVALĪ]** · Devi Aparajita Stotram · Sri Manasa Devi Stotram
(Mahendra-kṛtam) · Vishvambhari Stuti · Sri Devi Atharva Sheersham · Mantra Matruka Pushpa
Mala Stava · Sri Pratyangira Ashtottara Sata Namavali **[NĀMĀVALĪ]** · Sri Pratyangira
Sahasranama Stotram [cross-check against the dedicated Pratyaṅgirā section below] · Parvathi
Ashtottara Sata Namavali **[NĀMĀVALĪ]** · Kamakshi Duhkha Nivarana Ashtakam [**non-Sanskrit —
Tamil**, cross-check against Kāmākṣī section above] · Kakaradi Kali Sahasra Namavali
**[NĀMĀVALĪ]** [route to Kālikā section] · Sri Kali Chalisa [**non-Sanskrit — Hindi**, route
to Kālikā section] · Sri Taramba Ashtottara Satanama Stotram + Sata Namavali **[NĀMĀVALĪ]**
[route to Daśamahāvidyā/Tārā section] · Sri Aadya Kali Stotram [verify not a near-dup of
already-written "Adya Stotram," #6 above] · Aadya Kalika Ashtottara Sata Namavali **[NĀMĀVALĪ]**

**sanskritdocuments.org — NOT exhaustively checked.** Only the `devI-`/`devii-` prefix slice
of its ~2,053-entry `doc_devii/` index was spot-checked (54 items, most genuinely new — e.g.
`devIgItishatakam`, `devImahimnastotram` [a Devī parallel to Śiva Mahimna Stotra],
`devIshatakam`), out of an estimated ~1,950 remaining slugs including 102 unfiltered
`ambA-`/`ambikA-`-prefixed candidates. **A full sweep of this index could plausibly add
another 30-80 titles** on top of everything above — flagged as unfinished work, not a closed
count.

Revised genuine stotra-type total for devi/main: **41 written (2026-09-05) + ~75-85 remaining**
(stotranidhi ~82 + vignanam ~19, net of routing/overlap flags above, minus the 8 titles written
across the 2026-09-02 and 2026-09-04 rounds), **not counting** the
Daśamahāvidyā-routed material (126 titles, now tracked in the revised Daśa Mahāvidyā section
below) or the Śyāmalā/Mātaṅgī and Bālā material — both resolved 2026-09-04, see the notes above
and their own dedicated sections further down this doc.

---

## KĀMĀKṢĪ (Kāñcīpuram) — 2026-08-24 dedicated research pass

**Important: 4 items are ALREADY WRITTEN.** `devi/lalita/03-06` (Kāmākṣī Stōtram 1/2/3
[Brahma-kṛtam]/4 [Paramācārya-kṛtam]) are the same 4 items stotranidhi.com's dedicated
category returns — this research pass re-confirmed them, not duplicated them. Everything
below is the genuinely-remaining, not-yet-written material.

No dedicated category exists on either primary site; all cross-tagged inside generic `devi-en`
(stotranidhi) / "Devi Stotrams (189)" (vignanam) buckets. sanskritdocuments.org's `doc_devii/`
index is the deepest source but needs careful filtering — its `kAmAk-` prefix also matches the
unrelated Kāmākhyā (Assam Śakti Pīṭha) and Kāmakalā Kālī, both excluded below.

**2026-09-02 note:** Kāmākṣī Navaratnamālikā Stōtram and Kāmākṣyaṣṭakam were assigned in the
2026-09-02 authoring round but never actually landed as files (verified: not present in
`devi/lalita/`) — they have been re-queued in `AUTHORING_QUEUE.md`, not yet re-attempted.
Kāmākṣī remains at its original 4 written (in `devi/lalita/03-06`) after this round.

**Confirmed genuinely new (beyond the 4 already-written):**
Kāmākṣī Navaratnamālikā Stōtram · Kāmākṣī Pañcaśatī (500-verse work, 2 slug variants on
sanskritdocuments, possibly the same text) · Kāmākṣī Stavaḥ · Kāmākṣyaṣṭakam · Hemakāmākṣī
(unverified whether this is a distinct form or a variant title) · **Kamakshi Duhkha Nivarana
Ashtakam** (Tamil, vignanam.org — flag for deliberate transliteration per this corpus's
Tamil-text convention, not Sanskrit-guessing)

**Needs verification before writing — likely duplicates of the already-written 4 under
different numbering, not counted in the total below:** sanskritdocuments' `kAmAkShIstotram2`,
`kAmAkShIstotram3`, `kAmAkShIstotram4`, `kAmAkShIstotram5`, `kAmAkShIstutiH`, `kamakshist`
(base slug) — cross-check each against `devi/lalita/03-06`'s actual verse content before
treating as new material.

**[NĀMĀVALĪ] flagged (2):** Kāmākṣī Aṣṭōttaraśatanāmāvalī (stotranidhi + vignanam, same text) ·
Kāmākṣī Sahasranāmāvalī (sanskritdocuments only)

**Ritual, not stotra:** Kāmākṣī Pūjanam (sanskritdocuments)

Genuine confirmed-new stotra-type total: **~6** (Navaratnamālikā, Pañcaśatī, Stavaḥ,
Aṣṭakam, Hemakāmākṣī, Duḥkha Nivāraṇa Aṣṭakam), plus up to ~5 more pending the duplicate-check
above.

---

## MĪNĀKṢĪ (Madurai) — 2026-08-24 dedicated research pass

Folder: `devi/meenakshi/` — **12 written, POOL EXHAUSTED / COMPLETE (2026-09-05)**: 2 on
2026-09-02 (Mīnākṣī Stōtram, Mīnākṣī Pañcaratnam) + 5
more on 2026-09-04 (**Yogamīnākṣī Stotram**, **Mīnākṣī Navaratnamālā**, **Mīnākṣī Dvādaśa
Stotram**, **Mīnākṣyaṣṭakam**, **Mīnākṣī Ṣoḍaśopacāra Stutiḥ**) + 5 more on 2026-09-05 (**Mīnākṣī
Maṇimālāṣṭakam**, **Mīnākṣī Pañcadaśī Stotram**, **Mīnākṣī Suprabhātam**, **Mīnākṣī Stotram 2**
[Candraśekhara Bhāratī], **Mīnākṣyaṣṭakam 2** [Kṛṣṇānanda Sarasvatī]).

**EXHAUSTION VERDICT 2026-09-05 — POOL EXHAUSTED at 12.** An exhaustive sitemap crawl this round
established the ceiling: **stotranidhi.com carries only 4 Mīnākṣī titles in total** (all 4
written), and **sanskritdocuments.org's Devī index carries 11**, every one of which is now
accounted for — written here, or already written elsewhere in the corpus, or triaged out as
nāmāvalī-type. Nothing genuine remains; treat this section as **complete** going forward. No
dedicated category on either primary
site (cross-tagged in the generic Devi buckets); notably **sparse in the nāmāvalī genre** —
none found on any of the three sources checked, unusual for a major goddess form.
**Cross-reference note, resolved 2026-09-04:** "Śrī Yōgamīnākṣī Stōtram" and "Śrī Mīnākṣī
Navaratnamālā" both also appeared as candidates in the Devī-main-remainder list above — both are
now written HERE, under `devi/meenakshi/` (files 03 and 04), not under `devi/main/`. The
Devī-main-remainder list above has been annotated accordingly so neither is left dangling as
"still pending" there — do not write either one a second time into `devi/main/`.

**stotranidhi.com (4, all genuine, no nāmāvalī):** **Mīnākṣī Stōtram** · **Mīnākṣī Pañcaratnam** ·
**Śrī Mīnākṣī Navaratnamālā** (written 2026-09-04, `04_meenakshi_navaratnamala.txt` — resolves the
former Devī-main-remainder dup) · **Śrī Yōgamīnākṣī Stōtram** (written 2026-09-04,
`03_yoga_meenakshi_stotram.txt` — resolves the former Devī-main-remainder dup)

**vignanam.org:** same 2 of the above (Stōtram, Pañcaratnam) — no unique vignanam-only titles.

**sanskritdocuments.org, genuinely new (8, after excluding the Yōgamīnākṣī dup):**
**Mīnākṣī Ṣoḍaśōpacāra Stutiḥ** · **Mīnākṣī Dvādaśa Stōtram** · Mīnākṣī Maṇimālāṣṭakam · Mīnākṣī
Pañcadaśī Stōtram · Mīnākṣī Śatakam · Mīnākṣī Stōtram 2/3 (verify against stotranidhi's plain
Stōtram before treating as distinct) · Mīnākṣī Suprabhātam · **Mīnākṣyaṣṭakam** (+ a 2nd variant, still pending)

Genuine stotra-type total after filtering and rough dedup: **12 written — POOL EXHAUSTED / COMPLETE (2026-09-05)**. Superseded figure, retained for the record: ~5-6
remaining** (of the original ~12-13 estimate). No nāmāvalī/sahasranāma
found for Mīnākṣī on any of the three sources — a real gap in that sub-genre, not an oversight.

---

## ANNAPŪRṆĀ (Kāśī/Vārāṇasī) — 2026-08-24 dedicated research pass

Folder: `devi/annapurna/` — **7 written, POOL EXHAUSTED / COMPLETE (2026-09-04)**: 2 on
2026-09-02 (Śrī Annapūrṇā Stōtram, Annapūrṇā Kavacam) + 5 more on 2026-09-04 (**Śrī Annapūrṇā
Mantra Stavaḥ**, **Annapūrṇā Stavaḥ**, **Śrī Annapūrṇā Stōtram** [Annadā Kalpa recension], **Śrī
Annapūrṇā Stōtram** [Mandāra Kalpa recension / Girijā-daśakam, = "Annapūrṇā Stōtram 4" below],
**Ambā Annapūrṇā Stuti Pañcakam**). No dedicated category on either primary
site. Of the three newly-researched Devī-forms, Annapūrṇā has the richest
nāmāvalī/aṣṭōttaraśatanāma/sahasranāma proportion relative to full stotras — and per this
round's research, every remaining candidate below is confirmed nāmāvalī/sahasranāma-type (or a
non-viable duplicate), so **this section is now complete**; no further genuine stotra-form
titles remain to write.

**stotranidhi.com (4):** **Śrī Annapūrṇā Mantra Stavaḥ** · **Śrī Annapūrṇā Stōtram** ·
**[NĀMĀVALĪ]** Annapūrṇā Aṣṭōttaraśatanāma Stōtram · **[NĀMĀVALĪ]** Annapūrṇā
Aṣṭōttaraśatanāmāvalī

**vignanam.org (3, largely duplicate):** Śrī Annapūrṇā Stōtram (= Śrī Annapūrṇāṣṭakam, same
text, dup) · **[NĀMĀVALĪ]** Aṣṭōttaraśatanāmāvalī (dup) · **[NĀMĀVALĪ]** Aṣṭōttaraśatanāma
Stōtram (dup)

**sanskritdocuments.org, genuinely new beyond the above (6):** **Ambā Annapūrṇā Stuti Pañcakam** ·
**Annapūrṇā Kavacam** · **Annapūrṇā Stavaḥ** (verify against stotranidhi's Mantra Stavaḥ before
treating as distinct) · **Annapūrṇā Stōtram 4** (written as the Mandāra Kalpa recension) ·
**Annapūrṇā Stōtram (Annadā Kalpa recension)** · Śiva-proktā Annapūrṇā Stutiḥ [checked this
round — not independently written; folded in as a duplicate/non-viable variant, not a genuine
6th title]. **[NĀMĀVALĪ/SAHASRANĀMA] (2 more, out of scope):** Annapūrṇā Sahasranāma
Stōtram (a full Sahasranāma, not previously known) · Śiva-proktā Annapūrṇā
Aṣṭōttaraśatanāma Stōtram

Genuine stotra-type total after filtering and rough dedup: **7 written — POOL EXHAUSTED /
COMPLETE (2026-09-04)**, superseding the earlier ~8-10 estimate. Only nāmāvalī/sahasranāma-type
material remains, which is out of scope for this corpus's per-verse stotra format.

---

## LALITĀ / TRIPURASUNDARĪ — RE-AUDIT, 2026-08-24 (`devi/lalita/`, 35 written 2026-09-05)

**2026-09-02 update:** 4 new titles written this round — Sri Lalitha Kavacham, Rājarājeśvarī
Kavacham (Trailokyamohana, Gandharva Tantra), Sri Lalitha Hrudayam, Sri Tripura Sundari
Stotram 2 — bolded in the lists below. Mahātripurasundarī Ṣaṭkam was also written this round
but filed under `devi/dasamahavidya/` instead per the dedup note there, so it isn't counted
toward this folder's 18.

**2026-09-04 update:** 5 more titles written this round (18→25) — **Śrī Lalitā Aṣṭakārikā
Stotram** (Āvirbhāva Stutiḥ), **Śrī Lalitā Nīrājanam**, **Śrī Devī Maṅgalāṣṭakam**, **Śrī Rājñī
Stotram**, **Śrī Tripurasundarī Vijaya Stavaḥ** — bolded in the lists below alongside the
2026-09-02 titles.

**2026-09-05 update:** 10 more titles written this round (25→35) — **Śrī Lalitā Stotram** (Sarva
Devatā Kṛtam), **Śrī Mahātripurasundarī Ṣaṭkam**, **Śrī Kamalāmbikā Stotram**, **Śrī
Rājarājeśvarī Stavaḥ**, **Śrī Lalitāmbā Parameśvara Stavaḥ**, **Śrī Tripurasundarī Cakrarāja
Stotram**, **Śrī Lalitāryā Kavaca Stotram**, **Śrī Lalitā Stotram** (Brahmādi Kṛtam), **Śrī
Rājarājeśvarī Cūrṇikā**, **Śrī Tripurasundarī Vedasāra Stavaḥ** — files 26-35.

**⚠ DEDUP FLAG, found 2026-09-05 — two of the above duplicate files already in
`devi/dasamahavidya/`.** *(These are pairs 4-5 of 10; a corpus-wide audit the same day found eight
more across other sections — see `../DEDUP_AUDIT.md`.)* Verified by comparing the header blocks and opening verses:

| `devi/lalita/` | `devi/dasamahavidya/` | Verdict |
|---|---|---|
| `27_mahatripurasundari_shatkam.txt` | `16_mahatripurasundari_shatkam.txt` | **Same text** — same 6 verses, same Śṛṅgeri-pontiff attribution, same stotranidhi source, identical opening (`manojñamaṇikuṇḍalāṁ…`). Two independent write-ups of one work. |
| `28_kamalambika_stotram.txt` | `18_kamalambika_stotram.txt` | **Same text** — same 9 verses, same stotranidhi source, identical opening (`bandhūkadyutimindubimbavadanāṁ…`). Two independent write-ups of one work. |

Both pairs were written in different rounds by different agents; the 2026-09-02 dedup note above
(which routed Mahātripurasundarī Ṣaṭkam to `dasamahavidya/`) was not honoured when this round's
Lalitā tranche was assigned. **Nothing has been deleted** — flagged here for a routing decision.
Net effect across all ten pairs: they were merged and the redundant copies retired on 2026-09-05,
taking the corpus to **684 files = 684 distinct works**. Both Lalitā/Daśamahāvidyā routing questions
were decided in favour of `lalita/` — see `../DEDUP_AUDIT.md`. Decide which folder each
belongs in (the Śrīvidyā vocabulary argues for `lalita/`; the source site files both under its
Daśamahāvidyā collection) and retire the redundant copy before the next tranche is assigned to
either section.

Was marked "✅ Complete." Re-crawled stotranidhi.com's `category/lalitha/` (2 pages, 45 posts,
exhaustive), vignanam.org's "Devi Stotrams (189)" tree, and sanskritdocuments.org's
`doc_devii/` index + curated `sanskrit/lalita/` sub-page (48 entries). **Not complete — roughly
6-7x undercounted**, the deepest undercount found in this round, mostly from
sanskritdocuments.org.

**stotranidhi.com, new (~20):** Sarva Devata Kruta Lalitha Stotram · **Sri Lalitha Kavacham** +
Arya Kavacham + Moola Mantra Kavacham · Sri Lalitha Stotram (Brahmaadi Krutam) · Sri
Lalithamba Parameshwara Stava · **Sri Lalitha Ashtakarika Stotram (Avirbhava Stuti)** · Sri Lalita
Lakaradi Shatanama Stotram **[NĀMĀVALĪ]** · Sri Rajarajeshwari Churnika + Stava + Mantra
Matruka Stava · **Sri Rajni Stotram** · **Sri Tripura Sundari Stotram 2** · Sri Devi Khadgamala
Namavali **[NĀMĀVALĪ]** [cross-check vs. Devī-main's Khadgamala Namavali find] · Manidweepa
Varnanam 1/2/3 (Devī Bhāgavatam) + Telugu variant [**non-Sanskrit**] · Sri Lalitha Arya
Dwisathi · Sri Lalitha Ashtottara Shatanama Stotram 2 + Shatanamavali **[NĀMĀVALĪ]** · Sri
Lalitha Chalisa [**non-Sanskrit — Hindi**] · Sri Lalitha Panchavimsati Nama Stotram
**[NĀMĀVALĪ]** (25 names) · Sri Lalitha Sahasranama Stotram Pūrvapīṭhikā + Uttarapīṭhikā
(front/back matter to the already-written Sahasranāma) · Sri Lalitha Sahasranamavali
**[NĀMĀVALĪ]** · Sri Lalitha Shodasopachara puja vidhanam (ritual) · Sri Lalitha Stavaraja
(Vishwarupa Stotram) · Sri Lalitha Trisati Stotram Pūrvapīṭhikā + Uttarapīṭhikā · Sri Lalitha
Trishati Stotram (300-name stotra, distinct from the Sahasranāma)

**vignanam.org, new beyond stotranidhi (~9):** Lalitha Ashtottara Sata Namaavali +
Sree Lalitha Sahasra Namavali + Sri Lalitha Trishati Namavali **[NĀMĀVALĪ]** · Mantra Matruka
Pushpa Mala Stava · **Sri Lalitha Hrudayam** · Sri Kamakshi Ashtottara Sata Namavali **[NĀMĀVALĪ]**
[cross-check vs. Kāmākṣī section above] · Sri Shodashi (Tripura Sundari) Ashtottara Satanama
Stotram + Sata Namavali **[NĀMĀVALĪ]** [Śodaśī is an explicit Tripurasundarī epithet] · Sri
Raja Rajeswari Ashtottara Sata Namavali **[NĀMĀVALĪ]**

**sanskritdocuments.org — the largest source, ~64 new titles, grouped:**
- *Kavacham (6):* Lalitā Kavacham (Nārada Purāṇa, distinct from stotranidhi's Bṛhannāradīya
  version) · **Rājarājeśvarī Kavacham (Trailokyamohana, Gandharva Tantra)** — written 2026-09-02,
  157 verses, sourced from sanskritdocuments.org · Śodaśī Kavacham
  (Rudrayāmala) · Śrīvidyā/Śodaśī-vidyā Kavacham (Siddhayāmala Tantra) · Turīyā-Śodaśī
  Trailokyavijaya Kavacham · Paramahāyoni Kavacha Sādhanā (= Mahātripurasundarī Kavacham)
- *Hṛdaya/Suprabhātam (7):* Lalitā Hṛdaya Stotram + Hṛdaya Stotram 2 (Mahattarayonividyā) ·
  Lalitā-Tripurasundarī Hṛdaya Stotram · Tripurasundarī Hṛdaya Stotram · Kāmākṣī Suprabhātam
  [cross-check vs. Kāmākṣī section] · Tripurasundarī Suprabhātam (2 variants)
- *Stava/Stotra/Stuti (~41):* Lalitāmbā Parameśvara Stavaḥ + Stutiḥ (2 distinct texts) ·
  Lalitāmbā Śatakam · Lalitā Stavaḥ + Lalitā Stotram (Sacchidānanda Śivābhinava Nṛsiṁha
  Bhāratī) · Lalitā Aṣṭakam (Rūpa Gosvāmī, distinct from stotranidhi's Ashtakarika Stotram) ·
  Lalitā Pañcakam + Prātaḥsmaraṇa combined edition · Lalitā Puṣpāñjali Stotram · **Lalitāmbā
  Nīrājanam** · Gīr-Lalitāmbikā Stutiḥ · Mahālakṣmī-Lalitā Stotram · Daśaratharāja-/Deva-/
  Hayagrīva-prokta Lalitā Devī Stotram (3 authorship variants) + Hayagrīva-prokta Lalitā Devyāḥ
  Dvādaśanāma Stotram · Lalitā Vratanirūpaṇam · Lalitopākhyānam (narrative) · Lalitā
  Catuḥṣaṣṭyupacāra-saṃgraha (64-item pūjā text) · Lalitā-Tripurasundarī Aparādha-kṣamāpaṇa
  Stotram (Kiṅkiṇī Stotra) · Tripurasundarī Cakrarāja Stotram + Puṣpāñjali Stavaḥ + **Vijaya
  Stavaḥ** + Vedasāra Stavaḥ + Sānnidhya Stavaḥ + Dvādaśaślokī Stutiḥ + Stotram + Prātaḥ-śloka-
  pañcakam · Navamallikā Stavaḥ (36 verses) · Mantrotkīlana-vimocana Stotram (= Mahātripura-
  sundarī Stotram) · Mahātripurasundarī Ṣaṭkam · Kāmākṣī Navaratna-mālikā Stotram + Stavaḥ +
  Stutiḥ + Aṣṭakam + Stotram 5 (Candraśekhara Sarasvatī) [genuinely new Kāmākṣī material beyond
  the Kāmākṣī section above — reconcile before writing either] · Kamalāmbikā Stavaḥ 2 (Kāñcī
  Kāmakoṭi tradition) · Hema-Kāmākṣī Daṇḍakam [cross-check vs. "Hemakāmākṣī" in Kāmākṣī section
  above — may be the same item] · **Devī Maṅgalāṣṭakam** (names Kāmeśvarī explicitly)
- *Nāma-list type — **[NĀMĀVALĪ]**, ~30:* Lalitā Aṣṭottaraśatanāma Divya Stotram + 4 numbered
  Nāmāvalī variants · Lalitāmbikā Divya Aṣṭottaraśatanāma Stotram + Nāmāvalī · Lalitā Lakārādi
  Aṣṭottaraśatanāmāvalī · Lalitā Triśatī Nāmāvalī + Triśatyantaram · Lalitā Sahasranāma Stotram
  2 (Nāradīya) + 3 (Śiva-kṛta) [distinct source-recension variants of the sahasranāma already
  written] · Lalitā Sahasranāmāvalī (2 variants) · Śrīvidyā-Lalitā Nāmāvalī · Kāmākṣī
  Aṣṭottaraśata-Nāmāvalī + Pañcaśatī Nāmāvalī + Stotram + Sahasranāmāvalī [cross-check vs.
  Kāmākṣī section] · Tripurasundarī Śatanāmāvalī · Śodaśī Aṣṭottaraśata-Nāmāvalī + Śatanāma
  Stotram + Sahasranāma Stotram + Sahasranāmāvalī · Mahātripurasundarī Aṣṭottaraśatanāma
  Stotram · Devī Vaibhava Āścarya Aṣṭottaraśatanāma Stotram + Nāmāvalī [cross-check vs. Devī-
  main]

**Non-Sanskrit flags (3):** Sri Lalitha Chalisa (Hindi) · Kāmākṣī Duḥkha Nivāraṇa Aṣṭakam
(Tamil) · Māṇidvīpa Varṇanā Telugu variant.

**Excluded as different deities** (found in the same indexes, out of scope): Kāmākhyā (Assam
pīṭha, ~15 titles — sounds like Kāmākṣī but isn't) · Bālā-Tripurasundarī (~9, confirmed 2026-09-04
genuinely distinct from the `devi/bala/` pool — see the resolved note in the Devī-main re-audit
above; both pools stand independently, no merge) · Mīnākṣī (~2, cross-check vs. dedicated
Mīnākṣī section) · Kāmakalā-Kālī · Vāsavī Kanyakā Parameśvarī · Rādhā-Ṣoḍaśanāma ·
Tulasī-nāma-ṣoḍaśaka · Reṇukā Khaḍgamālā · Bhuvaneśvarī/Dhūmāvatī/Bagalāmukhī/Chinnamastā/
Kamalā/Tripurā Bhairavī (other Mahāvidyās — see Daśamahāvidyā section below).

Revised genuine stotra-type total: **35 written (2026-09-05) + ~70-75 remaining** (9
kavacham/hṛdaya-suprabhātam, all but 1 now written + ~41 stava/stotra/stuti, several now written
+ ~33 nāma-list type, out of scope + a few narrative/pūjā pieces). The Bālā-routing question is
resolved (2026-09-04, no merge — see above); the Kāmākṣī-overlap flag (a much smaller, ~4-9
title pool) remains open separately, see the Kāmākṣī section above.

---

## DURGĀ — RE-AUDIT, 2026-08-24 (`devi/durga/`, 36 written 2026-09-05)

**2026-09-02 update:** 5 new titles written this round — Siddha Kunjika Stotram, Sri Durga
Ashtakam, Durga Suktam, Sri Durga Arya Stavam, Sri Devi Atharvashirsha — bolded below.

**2026-09-04 update:** 5 more titles written this round (21→26) — **Sri Durga Stotram**
(Arjuna-kṛtam), **Sri Durga Stotram** (Yudhiṣṭhira-kṛtam), **Navadurga Stotram**, **Sri Durga
Manasa Puja Stotram**, **Sri Mangala Chandika Stotram** — bolded in the list below.

**2026-09-05 update:** 10 more titles written this round (26→36) — **Aparādhakṣamāpaṇa Stotram**
(Durgā Saptaśatī), **Śrī Caṇḍikā Dhyānam**, **Śrī Durgā Stotram** (Śrīkṛṣṇa-kṛtam), **Śrī Durgā
Stotram** (Mahādeva-kṛtam), **Śrī Durgā Stotram** (Paraśurāma-kṛtam), **Śrī Durgā Stotram**
(Śivarahasye), **Śrī Durgā Parameśvarī Stotram**, **Śrī Nārāyaṇī Stuti**, **Vaṁśavṛddhikaraṁ
(Vaṁśākhyaṁ) Durgā Kavacam**, **Śrī Durgā Pañjara Stotram** — files 27-36. The Saptaśatī-aṅga
cluster (Argalā, Kīlaka, Kavaca, Rātri Sūktam, Siddha Kuñjikā, Aparādhakṣamāpaṇa, Nārāyaṇī Stuti)
is now essentially complete.

Was marked "✅ Complete." Re-crawled stotranidhi.com's `category/durga` (3 pages, exhaustive),
vignanam.org's "Durga Stotrams (146)" node (filtered down to genuine Durgā-titled items — the
raw 146 bundles in Kālī/Lalitā/Daśamahāvidyā/regional-Devī material tracked elsewhere), and
sanskritdocuments.org's `doc_devii/` index. **Not complete.** Two apparent "gaps" the crawl
flagged — **Mahiṣāsuramardini Stotram (Aigiri Nandini)** and **Sri Indrakṣī Stotram** — are
false positives: both are already written, just filed under `devi/main/` (#1 and #12) instead
of here. Don't re-add them.

**stotranidhi.com, new (34):** **Siddha Kunjika Stotram** (Saptaśatī-recitation aṅga) · **Sri Devi
Atharvashirsha** · Durga Saptasati Aparadha Kshamapana Stotram + Chandika Dhyanam (Saptaśatī
aṅgas) · Sri Durga Ashtottara Shatanamavali 1/2 **[NĀMĀVALĪ]** + Shatanama Stotram 1/2 · Sri
Durga Sahasranama Stotram + Dakaradi variant **[NĀMĀVALĪ]** · Sri Durga Dwatrimsha Namavali
Stotram **[NĀMĀVALĪ]** (32 names) · Sri Chamundeshwari Ashtottara Shatanamavali **[NĀMĀVALĪ]**
+ Shatanama Stotram · Sri Durga Shodasa Nama Stotram (16 names) · **Yudhisthira-**/**Arjuna-**/
Krishna-/Mahadeva-/Parashurama-kṛta Durga Stotram (5 authorship variants, **2 written**) · Sri Durga Stotram
2 (Shiva Rahasye) · **Sri Durga Arya Stavam** · **Sri Durga Ashtakam** · Sri Durga Ashtakshara
Kavacham · Vamsa Vruddhikaram (Vamsakhya) Durga Kavacham · Sri Chandika Dala Stuti · **Sri
Mangala Chandika Stotram** · Sri Rudra Chandi Stotram · **Sri Durga Manasa Puja Stotram** · Sri
Durga Parameshwari Stotram (Śṛṅgēri Jagadguru) · Sri Kanakadurga Ananda Lahari (regional,
Vijayawada) · **Navadurga Stotram** · Narayani Stuti [overlaps Saptaśatī ch.11 content — low
priority]

**vignanam.org, genuine new (9):** Devi Mahatmyam Devi Suktam (distinct from the already-
written Tantrokta Ratri Suktam) · Devi Mahatmyam Navaavarna Vidhi (ritual) · Devi Mahatmyam
Chamundeswari Mangalam + Mangala Neerajanam (Saptaśatī aṅgas) · Dakaradi Durga Ashtottara Sata
Namavali + Durga Ashtottara Sata Namavali (distinct recension) + Durga Sahasra Namavali
**[NĀMĀVALĪ]** · Sree Durga Nakshatra Malika Stuti · Sri Durga Atharvasheersham (Durgā-branded
variant of Devī Atharvaśīrṣa) · **Durga Suktam** (Taittirīya Āraṇyaka hymn — a well-known omission)

**sanskritdocuments.org — deepest source, ~92 title-records net of exclusions (13 Saptaśatī
chapters + `durga700`/`tantradurgA700` full recensions excluded as out of scope), collapsing
to roughly ~45-55 genuinely distinct works after grouping recension-clusters:**
Ekaślokī Durgā (1-verse) · Āryā Durgāṣṭakam (Anantakavi) · Durgā Caraṇasmaraṇam, Pañjara
Stotram, Prasāda Aṣṭakam, Arcanā Gīti, Nāma Ṣoḍaśī, Nīrājana Pañcakam, Devī Daśakam (Harekrishna
Meher), Ambā Stotram (Śrīdhara Svāmī), Mānasa Pūjā, Praṇāma Mantra cluster, Śūlinī-Sumukhī
Karaṇa Stotram, Vanadurgā Mantra Vidhānam, Nārāyaṇa-prokta Durgati-nāśinī Kavacham, Durgā
Stuti (Devī Māhātmya-kathā-sāra) · Śāntā Durgā Stotram + Praṇati Stotram + Praṇāma Mantra
(Goa cult form, distinct sub-cluster) · "Durgāstotram" numbered cluster, ~15 further titles
from various Purāṇas/Tantras (Brahmavaivarta-, Śiva-, Bhaviṣya-, Mārkaṇḍeya-, Rudrayāmala-,
Lakṣmīnārāyaṇīyasaṃhitā-antargata), plus a modern Sri Aurobindo composition [flag: not
traditional] and Saptaśatī-sāra-bhūta Durgāstotram · 4 more Aṣṭakam variants (Anantānanda-
sarasvatī and others) · 2 more Kavacam recensions (Muṇḍamālātantra) · Sahasranāma/nāmāvalī
cluster **[NĀMĀVALĪ]**, multiple recensions (Tantrarāja, Rudrayāmala, Kulārṇavatantra, and a
Pārvatī-sahasranāma from Skandapurāṇa filed under "Durgā") · Aṣṭottaraśatanāma cluster
**[NĀMĀVALĪ]**, several recensions (durga108, mūladurgā variant, mantrasiddhiprada variant,
etc.) · Navadurgā cluster (~8 titles — stava/stotra/stuti/vandana variants + a pūjā-vidhi) ·
A handful of vernacular-adjacent devotional Sanskrit poems (Harekrishna Meher et al.)

Revised genuine stotra-type total: **36 written (2026-09-05) + ~25-35 remaining**, headlined by conspicuous
well-known omissions (Mahiṣāsuramardini/Aigiri Nandini and Indrākṣī are NOT missing — see false-
positive note above — but Durgā Sūktam, Siddha Kuñjikā Stotram, and the Devī Māhātmyam
"aṅga/pariśiṣṭa" cluster genuinely are, directly paralleling the aṅgas already written here
(Argalā/Kīlaka/Devī Kavacam/Aparājitā)).

---

## LAKṢMĪ — RE-AUDIT, 2026-08-24 (`devi/lakshmi/`, 33 written 2026-09-05)

**2026-09-02 update:** 4 new titles written this round — Sri Lakshmi Ashtaka Stotram, Sri
Mahalakshmi Kavacham 1, Lakṣmī Laharī (Paṇḍitarāja Jagannātha), Sri Lakshmi Gadyam — bolded
below. Kanakadhara Stotram (Variation) was assigned but skipped — confirmed no genuine third
Kanakadhārā recension exists beyond the two already in the corpus.

**2026-09-04 update:** 5 more titles written this round (18→23) — **Sri Lakshmi Stotram**
(Agastya-kṛtam), **Sri Mahalakshmi Stotram** (Mahendra/Indra-kṛtam), **Trailokya Mangala
Lakshmi Stotram**, **Sri Mahalakshmi Kavacham 2**, **Sri Mahalakshmi Stava** — bolded in the
list below.

**2026-09-05 update:** 10 more titles written this round (23→33) — **Śrī Lakṣmī Stotram**
(Sarvadeva Kṛtam), **Śrī Lakṣmī Stotram** (Lopāmudrā Kṛtam), **Śrī Siddhalakṣmī Stotram**, **Śrī
Mahālakṣmī Stutiḥ**, **Śrī Lakṣmī Kavacam**, **Śrī Lakṣmyaṣṭaka Stotram** (Ahirbudhnya Saṁhitā),
**Śrī Lakṣmī Stotram** (Devaiḥ Kṛtam), **Śrī Lakṣmī Stotram** (Sandhyāvalī Kṛtam),
**Putraprāptikaraṁ Śrī Mahālakṣmī Stotram**, **Śrī Lakṣmī Stutiḥ** — files 24-33.

**Deliberately skipped this round — modern compositions under copyright.** Four Lakṣmī candidates
on sanskritdocuments.org carry an **explicit copyright notice** on the source page and were
correctly excluded: **Jyōtirlakṣmī Stōtram**, **Sītā-Lakṣmī Pañcakam** and **Aṣṭādaśa Mahālakṣmī
Stōtram** (all by Pushpa Srivatsan), and **Mahālakṣmī Stavanam** (Dr. Harekrishna Meher). This is
now a standing corpus-wide exclusion rule — see the sourcing-convention block at the top of this
file. Do not re-queue these; they are not "pending," they are out of scope.

Was marked "✅ Complete." **This is the most severely undercounted of the six sections re-
audited** — roughly 8x. Re-crawled stotranidhi.com's `category/lakshmi/` (4 pages, exhaustive,
57 unique titles), vignanam.org's "Lakshmi Stotrams (25)" node, and sanskritdocuments.org's
`doc_devii/` index filtered for `lak[sS]h?m`/`laxm` (139 raw hits, hand-triaged for false
positives — author names like "Lakṣmaṇa," and other deities embedded inside the
*Lakṣmī-Nārāyaṇīya-Saṃhitā*, which is named for Lakṣmī-Nārāyaṇa but contains stotras to many
other deities).

**stotranidhi.com, new (43):** **Sri Lakshmi Ashtaka Stotram** · **Agastya-**/Sarva Deva-/Lopamudra-/
**Indra(Mahendra)-**kṛta Sri Lakshmi Stotram (4 authorship variants, **2 written**) · **Trailokya Mangala Lakshmi
Stotram** · Kanakadhara Stotram (Variation, a distinct text from the two already-written
versions) [SKIPPED 2026-09-02 — confirmed no genuine 3rd recension exists] · Sri Stotram (Agni Purāṇam) · Sri Stuti · Sri Siddha Lakshmi Stotram + Variation ·
**Sri Mahalakshmi Stava** + Stuti + Stuti 2 (Saubhāgya Lakṣmī) · **Sri Mahalakshmi Kavacham 1** · **Sri Mahalakshmi Kavacham 2** · Sri
Lakshmi Kavacham · **Sri Lakshmi Gadyam** + Gayatri Mantra Stuti + Dwadasa Nama Stotram + Hrudaya
Stotram · Sri Maha Lakshmi Visesha Shodasopachara Puja (ritual) · Varalakshmi Vratam Special
(vrata guide, not a stotra) · **[NĀMĀVALĪ], ~19:** 8 individually-named Aṣṭalakṣmī-form
aṣṭottara nāmāvalīs (Ādi/Dhānya/Dhairya/Gaja/Santāna/Vijaya/Vidyā/Aiśvarya-Lakṣmī) + the
combined-form Aṣṭalakṣmī Aṣṭottaraśatanāmāvalī · Sri Indira Ashtottara Shatanama Stotram · Sri
Lakshmi Ashtottara Shatanama Stotram 1/2/3 + Ashtottara Shatanamavali · Sri Lakshmi
Sahasranama Stotram + Sahasranamavali · Sri Mahalakshmi Aksharamalika Namavali + Chaturvimsati
Nama Stotram + Ashtottara Shatanamavali + Sahasranama Stotram · Sri Padmavathi Ashtottara
Shatanamavali

**vignanam.org, net-new beyond stotranidhi (9):** Sri Lakshmi Narayana Hrudaya Stotram · Sri
Vyuha Lakshmi Mantram · Kalyana Vrishti Stavam (Vedānta Deśika, addressed to Padmāvatī) ·
Bhagyada Lakshmi Baramma [**non-Sanskrit — Kannada**] · Sri Lakshmi Kalyanam Dvipada Telugu
[**non-Sanskrit — Telugu**] · Goda Devi Ashtottara Sata Namavali + Nama Stotram [flag:
borderline deity, route to Gōdā Dēvī section above] · Sree Vasavi Kanyaka Paramesvari
Ashtottara Sata Naamaavali [flag: likely out-of-scope regional deity] · Sree Tulasi
Ashtottara Satanaama Stotram [flag: borderline deity, form-of-Lakṣmī but distinct worship
object]

**sanskritdocuments.org — deepest source, ~66 net-new, grouped:**
- *Kavacham/mantra/mala (9):* lakShmIkavacham 2/3 · lakShmInArAyaNakavacham [combined-deity] ·
  aShTalakShmImantrasiddhividhAnam + aShTalakShmImahAmantram + aShTalakShmImAlAmantram ·
  dashAkSharalakShmImantram · lakShmIvisheShamantrAH · shrImahAlakShmImantrastotram
- *Sahasranāma/Triśatī/Nāmāvalī/Aṣṭottara cluster* **[NĀMĀVALĪ], ~14:* mahAlakShmIchaturviMshati-
  nAmAvalI · mahAlakShmyaShTottarashatanAmAvaliH 2 · lakShmIsahasranAmastotram 2 (Nāradīya) +
  (Skanda Purāṇa) + lakShmIsahasranAmAvalI [verify not a dup of stotranidhi's Sahasranamavali]
  · lakShmyaShTakam 2 (Āhirbudhnya Saṃhitā) · lakShmyaShTottarashatanAmastotram (Nāradīya
  Upapurāṇa) + Aṣṭottaraśatanāmāvalī 2 · lakShmIchandralambAShTottarashatanAmastotram [combined-
  deity, verify] · svarNamahAlakShmItrishatInAmAvaliH (300 names) · haritAlakShmyaShTottara-
  shatanAmAvaliH · siddhilakShmIstutiH [distinct from Siddha Lakshmi Stotram] ·
  anaghAlakShmyAH ShoDashanAmAni
- *Stotra variants — independent works, ~27:* aShTAdashamahAlakShmIstotram · jyotirlakShmI-
  stotram · mahAlakShmI lalitAstotram · mahAlakShmIsuprabhAtam · mahAlakShmIstavakavacha-
  pUjA · mahAlakShmIstavanam · mahAlakShmIstavam/vaibhavalakShmI archanA · mahAlakShmI-
  stotraM putraprAptikaram · mahAlakShmIstotram (Puṣpā Śrīvatsena / Viṣṇu Purāṇa / Śrīdhara-
  svāmī, 3 variants) · mahAlakShmIdaNDakaH · ramAhRRidayastotram · lakShmI AryAvRRittam ·
  **lakShmIlaharI (Paṇḍitarāja Jagannātha — notable literary work)** · lakShmIshatakam · lakShmI-
  stavaH · lakShmIstutiH + stutiH 2 (Āpaṭīkara) · lakShmIstotram 2 (Vādhūla Rāghavakavi) +
  (devavirachitaM, verify vs. Sarvadeva-kṛta above) + (sandhyāvalī-kṛtaM) + sampadālakṣmī-
  stotram (Indra/Purandara, Devī Bhāgavatam) · devaiḥ-kṛtaM shrIlakShmIstotram 1/2 (Skanda/
  Brahmavaivarta Purāṇa) · shrIlakShmIstotram (Veṅkaṭeśa Kāvya Kalāpa) · rAmasundarAkhya-
  dvijakRRitaM shrIstotram · devAdibhiH shrImahAramAstotram [verify "Ramā" = Lakṣmī reading]
- *Vrata/Pūjā texts (5, ritual not stotra):* anaghAlakShmIvratapUjA · ArdrAnandalakShmī-
  vratanirUpaNam · lakShmIsaubhAgyavratavidhinirUpaNam 1/2 · sarvamangalamAngalyaghaTa-
  lakShmIvratanirUpaNam · sA~NkhyayogaghatalakshmIvratam
- *Other (~10):* lakShmI nAmAvalIstotram **[NĀMĀVALĪ]** · vibhinnarUpalakShmIdhyAnaprakArAH
  (dhyāna verses for multiple Lakṣmī forms) · lakShmIhayagrIvamangalam [combined-deity] ·
  sItAlakShmIpanchakam + sItAlakShmIstotram [combined-deity, both Puṣpā Śrīvatsena] ·
  lakShmIkRRipAprArthanA [**non-Sanskrit — Marāṭhī**] · shrIstutiH kanakadhArAlakShmIstava-
  rAjaH (Vedānta Deśika) [**verify against the already-written "Sriguna Ratnakosha" — may be
  the same or different Deśika work, needs text comparison before filing as new**]

Revised genuine stotra-type total: **33 written (2026-09-05) + ~90-100 remaining** (~35-40 nāma-list type),
with the borderline-deity items (Gōdā Devī, Vāsavī Kanyakā Parameśvarī, Tulasī, and the
combined-deity texts) needing an explicit in/out-of-scope call, and the Sriguna Ratnakosha
possible-duplicate needing a text comparison before either version is treated as new.

---

## VĀRĀHĪ — RE-AUDIT, 2026-08-24 (`devi/varahi/`, **12 written, POOL EXHAUSTED / COMPLETE
2026-09-04**)

Was marked "✅ Complete." Re-crawled stotranidhi.com's dedicated "Sri Varahi Stotras" listing
page (`stotras-list-english/sri-varahi-stotrani-english/`, confirmed as the site's own
authoritative index, cross-checked against all 14 `post-sitemap*.xml` files), vignanam.org's
homepage tree, and sanskritdocuments.org's `doc_devii/` index. **The mildest gap of the six —
closest to actually complete —** but still not done: the dedicated stotranidhi page lists 20
distinct works; only 11 are written.

**2026-09-04 update:** 1 more title written this round (11→12) — **Sri Varahi Svarupa Dhyana
Slokah** (the one item below that was borderline stotra-adjacent rather than pure
nāmāvalī/mantra/ritual). The remaining 8 candidates were verified this round as genuinely
ritual/nāmāvalī/mantra-type, not stotra-form, and are therefore out of scope for this corpus's
per-verse stotra format — **this section is now complete.**

**New (9), all Sanskrit, all confirmed via fetched body text:**
- Sri Varahi Devi Shodasopachara Puja — ritual (16-step worship), not a stotra proper — out of scope
- Sri Maha Varahi Ashtottara Shatanamavali **[NĀMĀVALĪ]** — cross-verified identical on
  sanskritdocuments.org and vignanam.org — out of scope
- Sri Maha Varahi Sri Padukarchana Ashtottara Shatanamavali **[NĀMĀVALĪ]** (feet-worship,
  108 names) — out of scope
- Sri Varahi Ashtottara Shatanama Stotram **[NĀMĀVALĪ]** (verse form, 108 names) — out of scope
- Sri Varahi Ashtottara Shatanamavali 2 **[NĀMĀVALĪ]** — verified distinct name-set from the
  above two (opens "kiricakrarathārūḍhā…") — out of scope
- Sri Varahi (Vārtālī) Mantra — mūla mantra + nyāsa text — out of scope
- **Sri Varahi Svarupa Dhyana Slokah** — dhyāna verses (Vārtālī/Aśvārūḍhā/Dhūmrā forms), distinct
  from the already-written Tiraskarini Dhyanam — **written 2026-09-04**
- Sri Varahi Sahasranama Stotram **[NĀMĀVALĪ]** (1000 names, Uḍḍāmara Tantra) — cross-verified
  on sanskritdocuments.org and vignanam.org — out of scope
- Sri Varahi Sahasranamavali **[NĀMĀVALĪ]** (1000 names) — cross-verified on both — out of scope

**Confirmed NOT new** (ruled out, not just assumed): all 11 already-written titles matched the
dedicated category page under their Sanskrit titles; a no-suffix
`sri-varahi-ashtottara-shatanamavali` URL 301-redirects to the "Maha" version above, not a 3rd
distinct nāmāvalī; sanskritdocuments' `vArAhIstavam` = the already-written "Varahi Devi
Stavam"; vignanam.org contributed no titles beyond what stotranidhi already had.

Revised genuine stotra-type total: **12 written — POOL EXHAUSTED / COMPLETE (2026-09-04)**. Of
the original 9 remaining candidates, 1 (the dhyāna-śloka set) was written; the other 8 are
ritual/nāmāvalī/mantra-type, confirmed not stotra-form and therefore out of scope. No further
genuine stotra-type titles remain for Vārāhī.

---

## GAṄGĀ — 2026-08-24 dedicated research pass (new genre, previously unresearched)

Folder: **top-level `stotras/ganga/`** (routing question resolved 2026-09-02 in favour of the
top-level folder, per her major-goddess status) — **15 written**: 5 on 2026-09-02 (Gaṅgā Laharī,
Gaṅgāṣṭakam, Gaṅgā Stōtram, Gaṅgā Stavaḥ, Gaṅgā Kavacam) + 10 more on 2026-09-05 (**Gaṅgāṣṭakam**
[Vālmīki-viracitam], **Gaṅgāṣṭakam** [Kālidāsa-kṛtam], **Gaṅgāṣṭakam** [Anantānanda Sarasvatī],
**Gaṅgā Stavaḥ** [Candraśekhara Bhāratī-kṛtaḥ], **Guru Gaṅgāṣṭakam**, **Gaṅgā Sāmrājya Kavacam**,
**Gaṅgāṣṭakam** [Ravīndrakumāra Siddhāntaśāstrī-kṛtam], **Gaṅgā Stotram** [Brahmavaivarta-uktam],
**Gaṅgāṣṭapadī** [Jayadeva-kṛtā], **Gaṅgā Māhātmyam** [Kāśī Khaṇḍa]).

**EXHAUSTION VERDICT 2026-09-05 — NOT exhausted.** The prior "~10-15 remaining" figure was low.
This round screened roughly **30 further distinct sanskritdocuments.org `doc_devii` texts as
promising** and unwritten, among them: `gangAmRRitastotram`, `gangAShTakamsatya`, `gangAShTakam9`,
`gangAShTakam2` (Ayyāval), `gangAShTakamhanumAn`, `gangAstutiHrAmakRitabrahmapurANa`,
`gangAmangalam`, `gangAdvipadI`, `gangAtarangaH`, `gangAkavacham` / `gangAkavacham2` /
`gangAkavacham4`, `panchagangAShTakam`, plus a numbered Purāṇic Gaṅgā-stotra sequence. Note that
the Gaṅgāṣṭakam title alone runs to ~10 genuinely distinct recensions by different authors — four
are now written; treat each as its own work rather than as variants to collapse.

The folder routing question below is settled; the source-survey notes are retained for reference.
Prior note: suggested `devi/ganga/` or a top-level `stotras/ganga/` (her own major-goddess
status argues for the latter, matching the Subrahmaṇya/Gaṇeśa convention rather than nesting
under `devi/`). **This whole nadī (river-goddess) genre had never been properly researched** —
the only prior touch was Gaṅgā turning up "1-4 items" as an incidental byproduct of an earlier
generic Devī crawl, ruled out at the time as too few for its own section. That was not a real
attempt at the genre; a dedicated pass found she's actually the largest section here after Śiva/
Viṣṇu/Kṛṣṇa-scale deities.

Source: sanskritdocuments.org's dedicated `/iast/nadi/` directory (by far the richest source,
~60+ distinct titled works), cross-checked against stotranidhi.com (2 items, filed in the
generic `vividha` bucket — rivers were never a first-class category there), vignanam.org
("Ganga (2)" node), and srisharadapeetham.com's dedicated "Nadī Stotrāṇi" section.

**Genuine stotra-type (representative — full raw list has ~10 recension-variants each of
several titles, condensed here):**
Gaṅgā Laharī (**Paṇḍitarāja Jagannātha**, 53 verses, VERIFIED) · Gaṅgāṣṭakam (10 recension
variants) · Gaṅgā Stotram (11+ variants, incl. one attributed to Ādi Śaṅkara) · Gaṅgā Stavaḥ
(4 variants) · Gaṅgā Kavacam (4 variants) · Gaṅgā Māhātmyam (2) · Gaṅgā Sahasram · Gaṅgā
Sāmrājya Kavacam · Gaṅgāmṛta Stotram · Gaṅgā Tilakaḥ · Gaṅgā Daśakam · Gaṅgā Pūjā (ritual) ·
Guru Gaṅgāṣṭakam

**[NĀMĀVALĪ] flagged:** Gaṅgā Sahasranāma Stotram (3 versions) · Gaṅgā Sahasranāmāvaliḥ ·
Gaṅgā Aṣṭōttaraśatanāma Stotram · Gaṅgā Aṣṭōttaraśatanāmāvaliḥ (2 versions)

**Verification caveat:** only a representative sample was individually opened and hand-verified
(Gaṅgā Laharī, Gaṅgāṣṭakam, Ganga Stotram); the remaining ~50 title-variants come from a live,
fetched directory listing but weren't each individually fetched — treat as UNVERIFIED-pending-
individual-source-check, not reconstructed from memory.

Genuine stotra-type total (collapsing recension-clusters to representative works, excluding
nāmāvalī): **~15-20 distinct compositions** across ~60+ raw title-variants. Largest single item
in this whole genre by a wide margin.

---

## MINOR NADĪS (river-goddess stotras beyond Gaṅgā) — 2026-08-24 dedicated research pass

No folder exists yet; suggested `devi/nadi/` or fold into a shared `stotras/nadi/`, sub-grouped
by river. Same sourcing as the Gaṅgā section above (sanskritdocuments.org `/iast/nadi/`
primary, srisharadapeetham.com's "Nadī Stotrāṇi" section and scattered stotranidhi/vignanam
posts as cross-checks).

**Yamunā (~24 raw title-variants):** Yamunāṣṭakam (10 variants, one attributed to Ādi Śaṅkara,
VERIFIED) · Yamunā Sahasranāma Stotram **[NĀMĀVALĪ]** · Yamunā Sahasranāmāvaliḥ **[NĀMĀVALĪ]** ·
Yamunā Laharī · Yamunā Kavacam · Yamunā Stavaḥ/Stavam · Yamunā Stotram · Yamunā Gītam ·
Yamunāñjaliḥ

**Kāverī / Cauvery (~16 raw title-variants):** Kāverī Stotram (**Parāśara Bhaṭṭar**, excerpted
from his Śrī Raṅgarāja Stotram, ~5 verses, VERIFIED) · Kāveryaṣṭakam (3 variants) · Kāverī
Laharī · Kāverī Navaratnamālikā · Kāverī Bhujaṅga Stotram · Kāverī Pūjā (ritual) · Kāverī
Snāna Ślōkāḥ · Kāveryaṣṭōttaraśatanāmāvaliḥ **[NĀMĀVALĪ]** (2 versions). **Scope note:** Tamil-
language Kāverī devotional material (plausible for this Tamil Nadu river) was not searched —
sanskritdocuments.org is Sanskrit-only by design; flag as an unswept scope boundary, not a
negative result.

**Narmadā (~14 raw title-variants):** Narmadāṣṭakam (3 variants, one attributed to Ādi Śaṅkara,
VERIFIED, also on srisharadapeetham) · Narmadā Sahasranāma Stotram **[NĀMĀVALĪ]** (2 versions) ·
Narmadā Sahasranāmāvaliḥ **[NĀMĀVALĪ]** · Narmadā Laharī · Narmadā Kavacam · Narmadā Stotram
(5 authorship variants — Vyāsa, Mārkaṇḍeya, ṛṣi-kṛta, brāhmaṇa-kṛta). **Scope note:** Marathi
devotional material (plausible given the river's Maharashtra significance) not searched.

**Godāvarī (~8 raw title-variants):** Śrī Godāvarī Aṣṭakam (VERIFIED — `stotranidhi.com/sri-
godavari-ashtakam-in-telugu/`, filed in stotranidhi's generic `vividha` bucket; **this is the
same item earlier flagged and excluded as a false-positive during the Gōdā Dēvī/Āṇḍāḷ research
— confirmed real, just belongs here, not to Āṇḍāḷ**) · Godāvarī Stotram (2 versions) · Godā
Stutiḥ (2, river-context, distinct from the Āṇḍāḷ-related "Godā Stuti" already tracked
elsewhere — verify no title collision before writing) · Godā Stotram · Godāṣṭōttaraśatanāma
Stotram **[NĀMĀVALĪ]** · Godāṣṭōttaraśatanāmāvaliḥ **[NĀMĀVALĪ]**

**Tuṅgabhadrā (~6, real active micro-corpus — Śṛṅgēri sits on this river):** Tuṅgabhadrā
Ārātrikam · Tuṅgabhadrā Stutiḥ (2 versions) · Tuṅgāṣṭakam/Tuṅgāstavaḥ (same river's alternate
name "Tuṅgā") — corroborated independently on srisharadapeetham.com's Nadī Stotrāṇi section.

**Kṛṣṇā / Kṛṣṇāveṇī, i.e. the river, NOT the deity Kṛṣṇa (6, UNVERIFIED beyond title list —
keep strictly distinct from the large existing Kṛṣṇa-deity corpus):** Kṛṣṇāveṇī Māhātmyam ·
Kṛṣṇā Pañcaka Stotram · Kṛṣṇā Pañcagaṅgā Saṅgama Stotram · Kṛṣṇā Laharī · Kṛṣṇāveṇī
Pañcagaṅgā Stotram · Kṛṣṇāveṇyaṣṭakam

**Sapta Nadī / combined multi-river hymns (3+):** Nadī Stotram (**Nāradīya Purāṇa**, 10 verses,
names 30+ rivers — Bhāgīrathī, Yamunā, Sarasvatī, Narmadā, Godāvarī, Sindhu, Sarayū, Kṛṣṇā,
Kāverī etc., VERIFIED) · Gaṅgādi Nadī Stotram (**Skanda Purāṇa**, Āvantya Khaṇḍa ch.71 vv.65-83,
names Gaṅgā/Yamunā/Sarasvatī/Śiprā/Prācī/Revā/Kapilā, VERIFIED) · Pañcagaṅgāṣṭakam,
Pañcanada Gadyam, Triveṇī Daśaka Stotram (Prayāg triple-confluence) — title-only, UNVERIFIED

**Tāpī (1, near-zero — smallest river covered):** Tāpī Stotram — title/URL only, UNVERIFIED

**Sarasvatī-as-river (1) — distinct from Sarasvatī Devī (goddess of learning), already
tracked separately above:** Sarasvatī Nadī Stotram — title/URL only, UNVERIFIED. **Do not
confuse with or fold into the existing Sarasvatī section** — that section is about her as
goddess of speech/learning, not the river.

**Sindhu — genuine confirmed zero.** No dedicated Sanskrit stotra found anywhere checked; only
appears as one name within the combined Sapta Nadī-type hymns above. Stated explicitly as a
real negative result, not an oversight.

**Correction caught during research:** an intermediate step wrongly auto-clustered a Karatoyā
River (Bengal) text under "Kāverī" — caught and excluded; a reminder that per-title river
attribution needs a second check when this section is eventually written.

Genuine stotra-type total (Gaṅgā excluded, tracked separately above): roughly **~25-30 distinct
compositions** across the remaining rivers, headlined by Yamunā/Kāverī/Narmadā as the three
with real, multi-item corpora; Tāpī/Sarasvatī-river near-zero; Sindhu a confirmed zero.

---

## GŌDĀ DĒVĪ / ĀṆḌĀḶ — 2026-08-24 dedicated research pass

Folder: `devi/goda/` — 4 written: 2 on 2026-09-02 (Godā Stuti [Vēdānta Dēśika], Tiruppāvai —
included with an explicit Tamil-language flag per corpus convention) + 2 more on 2026-09-04
(**Godā Catuḥślōkī**, **Nācciyār Tirumoḻi** — the latter's extraction pass from the Nālāyira
Divya Prabandham compilation, previously flagged as needing dedicated work, was completed this
round), remainder researched.
**Distinct genre split, handle carefully:** her two Tamil prabandhams
(by her) vs. later Sanskrit stotras/nāmāvalīs about her (Śrī Vaiṣṇava tradition) are not
interchangeable — this corpus's Sanskrit-primary convention makes the latter the natural fit,
with the Tamil prabandhams treated per the established Tamil-text convention (deliberate
transliteration, e.g. matching how the Kandar Ṣaṣṭhi Kavacam and Abhirāmi Andādi were handled)
if included at all.

**Tamil prabandhams (by Āṇḍāḷ, not Sanskrit):**
- **Tiruppāvai** (written) — 30 verses, confirmed genuinely by/about Āṇḍāḷ (opens naming "puduvai āṇḍāḷ").
  Fully available at `stotranidhi.com/en/tiruppavai-tamil-in-english/` (also Telugu/Kannada/
  Devanāgarī/Tamil scripts) and `vignanam.org/english/tiruppavai.html`.
- **Nācciyār Tirumoḻi** (written 2026-09-04) — 143 verses. **No standalone page found** on either
  primary site; extracted from Project Madurai's full Nālāyira Divya Prabandham compilation
  (multi-part etext) this round.

**Sanskrit stotras about Āṇḍāḷ (2, genuine, in-scope for this Sanskrit-primary corpus):**
- **Godā Stuti** (written) — 29 verses, composed by **Vēdānta Dēśika** (confirmed via colophon and
  independently cross-checked against ramanuja.org's Dēśika-stotra corpus listing) —
  `stotranidhi.com/en/goda-stuti-in-english/`
- **Godā Catuḥślōkī** (written 2026-09-04) — 6 verses (4 main + 2 closing maṅgala verses) —
  `stotranidhi.com/en/goda-chathusloki-in-english/`

**[NĀMĀVALĪ] flagged (2, companion namāvalī/stotra pair of the same 108-name set):**
Śrī Gōdādēvi Aṣṭōttaraśatanāmāvalī · Śrī Gōdāṣṭōttaraśatanāma Stotram (verse-form recast of
the same 108 names) — both on stotranidhi.com and vignanam.org.

**False-positive titles to avoid (matched "goda" as a substring, not actually about Āṇḍāḷ):**
Subhagōdaya Stuti (a generic Bhavānī/Devī stotra by Gauḍapādācārya — "goda" is mid-word in
"su-bha-**goda**-ya") · Śrī Gōdāvary-aṣṭakam (a river-goddess stotra, unrelated).

Genuine stotra-type total (Sanskrit, if the two prabandhams are handled separately per the
Tamil convention): **4 written (2026-09-04) — both Sanskrit stotras and both Tamil prabandhams
now done** **+ 2 nāmāvalī remaining** (out of scope for this corpus's per-verse stotra format).

---

## ŚYĀMALĀ / MĀTAṄGĪ (~27, unified pool)

**RESOLVED 2026-09-04 — Śyāmalā and Mātaṅgī are the SAME deity, tracked as one unified pool.**
The user made this call explicitly, closing the open question that used to sit in the Devī-main
re-audit section above. Reconciliation: `devi/syamala/`'s own 8 written files were cross-checked
against `devi/dasamahavidya/`'s 21 written files (none Mātaṅgī-titled) — the "Mātaṅgī cluster"
that the Daśamahāvidyā crawl independently surfaced is the same cross-tagged source material as
the Mātaṅgī titles already itemized below, not a separate additional pool, so nothing has been
double-counted and nothing moves between folders. The pending-candidate list below is the single
authoritative Śyāmalā/Mātaṅgī pool going forward.

Folder: `devi/syamala/` — 15 written: 3 on 2026-09-02 (Śrī Śyāmalā Daṇḍakam, Śrī Mātaṅgī Stōtram 1,
Śrī Śyāmalā Kavacam) + 5 more on 2026-09-04 (**Śrī Śyāmalā Stotram**, **Śrī Śyāmalā
Navaratnamālikā Stotram**, **Śrī Mātaṅgī Stutiḥ**, **Śrī Mātaṅgī Hṛdayam**, **Śrī Mātaṅgī
Kavacam** [Sumukhī]) + 7 more on 2026-09-05 (**Śrī Mātaṅgī Stotram 2**, **Śrī Mātaṅgī Stotram
3**, **Śrī Mātaṅgī Stotram 4** [Devī Ṣaṭkam], **Śrī Mātaṅgī Stotram 5**, **Śrī Mātaṅgī Kavacam
3**, **Śrī Mātaṅginī Kavacam** [Trailokyamaṅgala Kavacam], **Śrī Śyāmalā Pañcāśatsvara
Varṇamālikā Stotram**), remainder researched.

**EXHAUSTION VERDICT 2026-09-05 — NOT exhausted.** Three genuine unwritten texts remain, all on
**sanskritdocuments.org only** (none of them on stotranidhi.com):

- **Śrī Mātaṅgī Stotram** (Āgamasāra, attrib. Umāsahācārya) — **95 verses**, the large parent
  text of this cluster. **Important structural finding:** several files already in this folder are
  *excerpts from it* — its v. 38 opens `06_matangi_stutih.txt`, its v. 79 opens
  `02_matangi_stotram_1.txt`, and its v. 80 opens `12_matangi_stotram_5.txt`. Writing the full
  95-verse text will therefore create deliberate overlap with three existing files; decide the
  routing (full text as a new file with cross-references, vs. folding the excerpts in) before
  writing rather than during.
- **Śrī Mātaṅgī Stutiḥ 1** (58 v) — a parallel recension of the above, noticeably more corrupt.
- **Śrī Mātaṅgī Dhyānam** (5 v).

Also **unassessed**: Rāja Śyāmalā Rahasya Upaniṣad — not yet triaged for in/out of scope (an
upaniṣad-form text, so it may route the way Devyatharvaśīrṣa and Gaṇapatyatharvaśīrṣa did rather
than being excluded outright).

**Śyāmalā (14):** **Śrī Śyāmalā Daṇḍakam** · **Śyāmalā Stōtram** · **Navaratnamālikā Stōtram** ·
Sahasranāma Stōtram **[NĀMĀVALĪ]** · Sahasranāmāvalī **[NĀMĀVALĪ]** · **Kavacam** ·
Aṣṭōttaraśatanāma Stōtram 1/2 **[NĀMĀVALĪ]** · Aṣṭōttaraśatanāmāvalī 1/2 **[NĀMĀVALĪ]** ·
Ṣōḍaśanāma Stōtram **[NĀMĀVALĪ]** · Ṣōḍaśanāmāvalī **[NĀMĀVALĪ]** · Pañcāśatsvara Varṇamālikā
Stōtram · Ṣōḍaśōpacāra Pūjā (procedure, not stotra)

**Mātaṅgī (13):** **Stōtram 1** · Stōtram 2-5 · **Stutiḥ** · **Hṛdayam** · **Kavacam (Sumukhī)** · Kavacam 3 · Mātaṅginī
Kavacam (Trailōkyamaṅgalam) · Sahasranāma Stōtram **[NĀMĀVALĪ]** · Aṣṭōttaraśatanāma Stōtram
**[NĀMĀVALĪ]** · Aṣṭōttaraśatanāmāvalī **[NĀMĀVALĪ]**

Genuine stotra-type total after filtering: **15 written (2026-09-05) + 3 confirmed remaining (+1 unassessed)** — figure corrected 2026-09-05; NOT exhausted, see the exhaustion verdict in the folder header above.

---

## BĀLĀ (~40)

**RESOLVED 2026-09-04 — Bālā confirmed a genuinely DIFFERENT deity from Lalitā/Tripurasundarī,
no merge.** The user made this call explicitly, closing the routing question that used to sit in
the Devī-main re-audit section above. This section's own pending pool below stands independently
of the Bālā-Tripurasundarī material tracked under the Lalitā section's remainder — the two are
different content, not the same pool double-counted under two sections. Nothing here changed as
a result; only the caveat wording is removed.

Folder: `devi/bala/` — 18 written: 3 on 2026-08-25 (Bālā Stōtram 1, Bālā Kavacam 1, Bālā Pañcaratna
Stōtram) + 5 more on 2026-09-04 (**Bālā Stōtram 2**, **Bālā Bhujaṅga Stōtram**, **Bālā Kavacam
2** [Rudrayāmale], **Bālāmbikā Stōtram**, **Bālā Hṛdayam**) + 10 more on 2026-09-05 (**Bālā
Stavarājaḥ**, **Bālā Śānti Stōtram**, **Bālā Karpūra Stōtram**, **Bālā Muktāvalī Stōtram**,
**Bālā Pañcacāmara Stavaḥ**, **Bālā Mantragarbhāṣṭakam**, **Bālā Mānasa Pūjā Stōtram**, **Bālā
Trailokyavijaya Kavacam**, **Daśavidyāmayī Bālā Stōtram**, **Bālā Vāñchādātrī Stōtram**),
remainder researched.

**Stōtram 1**/**2** · Stavarājaḥ · **Hṛdayam** · Dalam · **Bhujaṅga Stōtram** · Śānti Stōtram ·
Karpūra Stōtram · Mantrākṣara Stōtram · Mantragarbhāṣṭakam · Mantrasiddhi Stavaḥ ·
Mānasapūjā Stōtram · Khaḍgamālā Stōtram · Muktāvalī Stōtram · Pañcacāmara Stavaḥ ·
**Pañcaratna Stōtram** · Makaranda Stavaḥ · Viṁśati Stavaḥ · Vāñchādātrī Stōtram ·
Rakṣā Stōtram · Mahāmālā · **Kavacam 1**/**2**/3 (incl. Duḥsvapnanāśakam) · Trailōkyavijaya Kavacam ·
Daśavidyāmayī Bālā Stōtram · Triśatākṣarī · Triśatī Stōtram · Triśatī Nāmāvalī **[NĀMĀVALĪ]** ·
Tryakṣarī Mantraḥ · Sahasranāma Stōtram 1/2 **[NĀMĀVALĪ]** · Sahasranāmāvalī 1/2 **[NĀMĀVALĪ]** ·
Aṣṭōttaraśatanāma Stōtram 1/2 **[NĀMĀVALĪ]** · Aṣṭōttaraśatanāmāvalī 1/2 **[NĀMĀVALĪ]** ·
Ṣōḍaśōpacāra Pūjā (procedure) · **Bālāmbikā Stōtram**

Genuine stotra-type total after filtering: **18 written (2026-09-05) + ~6 remaining**.

---

## KĀLIKĀ / KĀLĪ (~50, unified pool with Daśa Mahāvidyā's Kālī cluster)

**RESOLVED 2026-09-04 — Kālikā and Kālī are the SAME deity, tracked as one unified pool.** The
user made this call explicitly. Reconciliation: cross-checked this section's own 8 written files
against `devi/dasamahavidya/`'s 21 written files (no Kālī-titled files there — Daśa Mahāvidyā's
own remaining-count is explicitly the *non*-Kālī, non-Mātaṅgī vidyā total, see that section
below). The ~45-title "Kālī cluster" that the Daśamahāvidyā crawl independently surfaced is the
same cross-tagged source material as the titles already itemized below (its own sample titles —
Dakṣiṇakālikā Triśatī, Bhadrakālī Kavacam 1/2, Kakārādi Kālī Sahasranāma, Kālī Karpūra Stōtram,
Kāmakalākālī Sahasranāma — all match entries already in this list), not a separate additional
pool. Nothing has been double-counted and nothing moves between folders or is deleted from
either. **Note on scope:** Kālī-as-one-of-the-ten-Mahāvidyā-forms remains a legitimate, distinct
theological category within `devi/dasamahavidya/` — this resolution only unifies the
candidate-title bookkeeping, not the deity taxonomy. The pending-candidate list below (refined to
~32 via full itemization, up from the earlier rough ~26/45 estimates) is the single authoritative
Kālikā/Kālī pool going forward.

Folder: `devi/kalika/` — 18 written: 3 on 2026-08-25 (Mahākālī Stōtram, Kālikāṣṭakam, Kālī Kavacam
[Trailōkyavijayam]) + 5 more on 2026-09-04 (**Kālikā Stōtram 1**, **Kālī Stutiḥ** [Brahma-kṛtam],
**Kālī Karpūra Stōtram**, **Kālikā Kavacam** [Vairināśakaram], **Bhadrakālyaṣṭakam 1**) + 10
more on 2026-09-05 (**Kālikā Stōtram 2**, **Kālikā Svarūpa Stutiḥ**, **Kālikā Argala Stōtram**,
**Kālī Krama Stavaḥ**, **Kāmakalākālī Bhujaṅga Prayāta Stōtram**, **Kālī Tāṇḍava Stōtram**,
**Kālī Śānti Stōtram**, **Kālī Prātaḥ Smaraṇa Stōtram**, **Kālī Aparādhakṣamāpaṇa Stōtram**,
**Bhadrakālī Stutiḥ**), remainder researched.

### ROUTING FINDING 2026-09-05 — the Bhadrakālī texts belong HERE, not under Pratyaṅgirā

An exhaustive stotranidhi.com sitemap crawl this round established that **stotranidhi files its
five Bhadrakālī texts under its Kālikā category, NOT under Pratyaṅgirā**:

1. Bhadrakālī Kavacam 1
2. Bhadrakālī Kavacam 2 ("Jaganmaṅgalam")
3. Bhadrakālī Aṣṭakam 1 — **written**, `08_bhadrakalyashtakam_1.txt`
4. Bhadrakālī Aṣṭakam 2
5. Bhadrakālī Stutiḥ — **written**, `18_bhadrakali_stutih.txt`

These all route to `devi/kalika/`, along with sanskritdocuments.org's `bhadrakAlIkavacham`,
`bhadrakAlIkavacham2` and `bhadrakAlIstutiH`. **3 of the 5 stotranidhi Bhadrakālī titles remain
unwritten** (Kavacam 1, Kavacam 2, Aṣṭakam 2) and are counted in this section's remainder from
2026-09-05 onward — they had previously been loosely associated with the Pratyaṅgirā pool.

**Do not confuse the two "Jaganmaṅgala" kavacas.** Bhadrakālī Kavacam 2 (Jaganmaṅgalam) is a
**DIFFERENT text** from the already-written Pratyaṅgirā Kavacam 2 (Jaganmaṅgalakam,
`devi/pratyangira/06_pratyangira_kavacam_2.txt`): different opening, and its ṛṣi is Śiva with the
devatā given as Bhadrakālikā. The shared "Jaganmaṅgala" epithet is a genre label, not an identity
— write it as a new file, do not treat it as a duplicate.

**Kālikā Stōtram 1**/2 · Kālikāṣṭakam · Kālikā Svarūpa Stutiḥ · Kālikā Argala Stōtram ·
Kālikā Kīlaka Stōtram · **Kālikā Kavacam (Vairināśakaram)** · Sahasranāma Stōtram **[NĀMĀVALĪ]** ·
Ādyā Kālikā Śatanāma Stōtram **[NĀMĀVALĪ]** · Kālikōpaniṣat · Ṣōḍaśōpacāra Pūjā (procedure) ·
Mahākālī Stōtram · Mahākālī Stōtram (Paraśurāma-kṛtam) [dup of Devī-main entry] · Mahākālī
Śatanāma Stōtram (Bṛhannīlatantre) **[NĀMĀVALĪ]** · **Kālī Stutiḥ (Brahma-kṛtam)** · Kālī
Stavanam (Śākinī) · Kālī Krama Stavaḥ · Kālī Tāṇḍava Stōtram · **Kālī Karpūra Stōtram** ·
Kālī Śānti Stōtram · Kālī Prātaḥ Smaraṇa Stōtram · Kālī Aparādhakṣamāpaṇa Stōtram ·
Kālī Sahasrākṣarī · Kālī Ēkākṣarī (Cintāmaṇi) · Kālī Kavacam (Trailōkyavijayam) · Kālī
Kavacam (Jaganmaṅgalam) · Kālī Pratyaṅgirā Mālāmantraḥ · Kakārādi Kālī Sahasranāma Stōtram
**[NĀMĀVALĪ]** + Nāmāvalī **[NĀMĀVALĪ]** · Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī
**[NĀMĀVALĪ]** · Śrī Kālī Cālīsā [non-Sanskrit — Hindi; cross-referenced in from the Devī-main
vignanam crawl] · Śrī Ādya Kālī Stōtram [cross-referenced in from the Devī-main vignanam crawl;
verify not a near-dup of the already-written "Ādya Stōtram"] · Aadya Kalika Ashtottara Sata
Namavali **[NĀMĀVALĪ]** · Dakṣiṇakālī Kavacam 1/2 · Dakṣiṇakālikā Khaḍgamālā Stōtram · Dakṣiṇakālikā
Triśatī Stōtram · Dakṣiṇakālī Hṛdaya Stōtram 1/2 · Guhyakālī Vajra Kavacam · Guhyakālī
Sudhādhārā Stavaḥ · Kāmakalākālī: Kavacam, Sahasranāma Stōtram **[NĀMĀVALĪ]**, Bhujaṅga
Prayāta Stōtram, Sañjīvana Gadya Stōtram · **Bhadrakālyaṣṭakam 1**/2 · Bhadrakālī Stutiḥ ·
Bhadrakālī Kavacam 1/2 · Bhadrakālī Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī
**[NĀMĀVALĪ]**

Genuine stotra-type total after filtering: **18 written (2026-09-05) + ~22 remaining** (incl. the 3 unwritten Bhadrakālī titles re-routed here 2026-09-05) — unified
2026-09-04 with the Daśamahāvidyā-crawl Kālī cluster (see the resolved note above); this is now
the single authoritative Kālikā/Kālī pending count, no longer a placeholder pending
reconciliation.

---

## PRATYAṄGIRĀ (~24)

Folder: `devi/pratyangira/` — **11 written, POOL EXHAUSTED / COMPLETE (2026-09-05)**: 3 on
2026-09-02 (Śrī Pratyaṅgirā Stōtram 1, Śrī Pratyaṅgirā
Daṇḍakam, Śrī Pratyaṅgirā Kavacam 1 [Sarvārthasādhanam]) + 5 more on 2026-09-04 (**Śrī
Pratyaṅgirā Stōtram 2**, **Śrī Pratyaṅgirā Āpannivāraṇa Stutiḥ**, **Śrī Pratyaṅgirā Kavacam 2**
[Jaganmaṅgalakam], **Śrī Pratyaṅgirā Stōtram 3**, **Śrī Pratyaṅgirā Stavarājaḥ**) + 3 more on
2026-09-05 (**Śrī Pratyaṅgirā Kavacam 3** [Trailokyavijayam], **Śrī Bagalā Pratyaṅgirā Kavacam**,
**Śrī Tārā Pratyaṅgirā Kavacam**).

**EXHAUSTION VERDICT 2026-09-05 — POOL EXHAUSTED at 11.** An exhaustive sitemap crawl accounted
for **all 31 stotranidhi.com pratyangira/bhadrakali slugs**, plus the sanskritdocuments.org
holdings. Everything genuine is written; every remaining item is **mantra-prayoga / bīja-string
genre** (strings of bījākṣaras with ritual application notes rather than per-verse praise text)
and is therefore out of scope for this corpus's format. Treat this section as **complete**.

**Note — 5 titles moved out of this pool:** the five Bhadrakālī texts that were loosely associated
with Pratyaṅgirā are filed by stotranidhi under its **Kālikā** category and have been re-routed to
`devi/kalika/` accordingly (see the routing finding in the Kālikā section above). That re-routing
is part of why this section closes at 11 rather than at the old ~12-remaining estimate.

**Stōtram 1** · **Stōtram 2**/**3** · **Stavarājaḥ** · **Daṇḍakam** · **Āpannivāraṇa Stutiḥ** · Khaḍgamālā Stōtram ·
**Kavacam 1 (Sarvārthasādhanam)** · **Kavacam 2 (Jaganmaṅgalakam)** · Kavacam 3 (Trailōkyavijayam) ·
Sahasranāma Stōtram **[NĀMĀVALĪ]** · Sahasranāmāvalī **[NĀMĀVALĪ]** · Aṣṭōttaraśatanāmāvalī
**[NĀMĀVALĪ]** · Sahasrākṣarī Mantraḥ · Mālāmantraḥ · Sūktam (Ṛgvedīya pāṭhāntaram 1/2) ·
Sūktam (Atharvavēdōktam) · Viparīta Pratyaṅgirā Mantraḥ · Viparīta Pratyaṅgirā Stōtram ·
Viparīta Pratyaṅgirā Mālāmantraḥ · Bagalā Pratyaṅgirā Kavacam · Kālī Pratyaṅgirā Mālāmantraḥ
[dup of Kālī entry] · Tārā Pratyaṅgirā Kavacam

Genuine stotra-type total after filtering: **11 written — POOL EXHAUSTED / COMPLETE (2026-09-05)**. Superseded figure, retained for the record: ~12 remaining as of 2026-09-04 — closed out by this round's 3 writes plus the re-routing of the 5 Bhadrakālī titles to `devi/kalika/`; everything else is mantra-prayoga/bīja-string genre, out of scope.

---

## DAŚA MAHĀVIDYĀ (revised 2026-08-24 — was ~45, now ~120-130, see note)

**Revision note, 2026-08-24, updated with the RESOLUTION below, 2026-09-04:** the Devī-main
re-audit above independently crawled stotranidhi.com's `category/dasa-mahavidya/` (6 pages, 137
posts) and found 126 titles after excluding Tripurasundarī/Śodaśī items (routed to the Lalitā
re-audit above) and one duplicate — substantially more than the ~45 estimate below, which
pre-dates that fuller crawl. Breakdown from that crawl: **Kālī/Bhadrakālī/Kālikā/Dakṣiṇā Kālī 45**
(Sri Dakshina Kali Trishati Stotram, Bhadrakali Kavacham 1/2, Kakaradi Kali Sahasranama Stotram,
Kali Karpura Stotram, Kamakala Kali Sahasranama Stotram, etc.) · **Bagalāmukhī
29** (Sahasranama Stotram, Kavacham 1-5, Peethopanishat, Suktam, Khadga Mala Mantra, etc. —
roughly matches the ~28 already itemized below) · **Mātaṅgī 13** (Sahasranama Stotram, Kavacham
1/3, Stotram 1-5, Hrudayam) · **Kamalā 8** (roughly matches the ~7 below) · **Bhuvaneśvarī 6**
(matches the ~6 below) · **Tārā (+Tārāmbā, Nīla Sarasvatī) 6** (matches the ~7 below) ·
**Tripura Bhairavī 6** (matches the ~6 below) · **Chinnamastā 5** (matches the ~6 below) ·
**Dhūmāvatī 5** (matches the ~5 below) · **Daśamahāvidyā-collective 1**.
Bagalāmukhī/Kamalā/Bhuvaneśvarī/Tārā/Tripura Bhairavī/Chinnamastā/Dhūmāvatī largely corroborate
the per-vidyā breakdowns already itemized below (kept as-is, cross-checked and roughly
consistent).

**RESOLVED 2026-09-04:** the Kālī and Mātaṅgī rows above are the SAME deities as the dedicated
KĀLIKĀ / KĀLĪ section and the ŚYĀMALĀ / MĀTAṄGĪ section elsewhere in this doc — the user made
both calls explicitly. Neither the Kālī-45 nor the Mātaṅgī-13 rows above were ever folded into
this section's own itemized per-vidyā breakdown further below (that breakdown only covers
Bagalāmukhī/Kamalā/Tārā/Bhuvaneśvarī/Chinnamastā/Dhūmāvatī/Tripura-Bhairavī/Ṣoḍaśī plus the
1-item Daśamahāvidyā-common bucket), so this section's own "~24 remaining" total was never
double-counting them — reconciling against the dedicated Kālikā/Kālī and Śyāmalā/Mātaṅgī
sections confirmed both rows above are the same cross-tagged source material already itemized
there, not additional distinct titles. Their candidate lists now live solely in those two
dedicated sections (Kālikā/Kālī: ~32 remaining, unified; Śyāmalā/Mātaṅgī: ~7 remaining, unified)
— nothing here was deleted or altered, and Kālī/Mātaṅgī remain legitimate distinct forms within
the ten-Mahāvidyā taxonomy, just with unified candidate-title bookkeeping.

Folder: `devi/dasamahavidya/` — 31 written: 16 on 2026-09-02 (Bagalāmukhī Stōtram 1, Bagalāmukhī
Kavacam 1, Kamalā Stōtram 1, Kamalā Kavacam, Tārā Stōtram, Tārāṣṭakam, Bhuvaneśvarī Stōtram,
Bhuvaneśvarī Kavacam, Chinnamastā Devī Stōtram, Chinnamastā Kavacam, Dhūmāvatī Stōtram,
Dhūmāvatī Kavacam, Tripura Bhairavī Stōtram, Tripura Bhairavī Kavacam, Tripurasundarī
Stōtram 1, Mahātripurasundarī Ṣaṭkam) + 5 more on 2026-09-04 (**Bagalāmukhī Hṛdaya Stōtram**,
**Kamalāmbikā Stōtram**, **Chinnamastā Devī Hṛdayam**, **Dhūmāvatī Hṛdayam**, **Tārā Kavacam**
— one per vidyā, rounding each sub-cluster's Stōtram/Kavacam/Hṛdayam trio closer to complete)
+ 10 more on 2026-09-05 (**Bagalāmukhī Stotram 2**, **Bagalāmukhī Kīlaka Stotram**, **Bagalāmukhī
Pañjara Stotram**, **Tārāmbā Hṛdayam**, **Nīlasarasvatī Stōtram**, **Bhuvaneśvarī Hṛdayam**,
**Tripurabhairavī Hṛdayam**, **Bhuvaneśvarī Pañjara Stōtram**, **Bagalāmukhī Kavacam 2**
[Vairināśakaram], **Bagalāmukhī Kavacam 3** [Viśvavijayam]),
remainder researched.

**Still open after this round (itemized, 2026-09-05)** — not exhausted; the following were
confirmed present on the sources and unwritten:

- **Bagalāmukhī Kavacam 4** (52 v)
- **Bagalāmukhī Kavacam 5**
- **Bagalāmukhī Varṇa Kavacam**
- **Bhairavī Kavacam Trailokyavijayam** — this carries a **distinct slug** from the already-written
  `14_tripura_bhairavi_kavacam.txt`. **Diff the fetched text against file 14 before writing** — it
  may be the same text under a second slug, or a genuinely separate Trailokyavijaya recension.

Consider sub-grouping by vidyā
within the folder (e.g. `dasamahavidya/bagalamukhi_01_...`, `dasamahavidya/kamala_01_...`)
since it spans 8 distinct goddess-forms not otherwise covered.

**Bagalāmukhī (28):** **Stōtram 1** · Stōtram 2 · **Hṛdaya Stōtram** · Sahasranāma Stōtram **[NĀMĀVALĪ]** ·
Sūktam · Kīlaka Stōtram · Digbandhana Rakṣā Stōtram · Pañjara Stōtram · Pañjara Nyāsa
Stōtram · Daśanāmātmaka Stōtram · **Kavacam 1** · Kavacam 2-5 · Varṇa Kavacam · Mālāmantraḥ · Brahmāstra
Mālāmantraḥ · Khaḍgamālāmantraḥ · Aṣṭōttaraśatanāma Stōtram 1/2/3 **[NĀMĀVALĪ]** +
Nāmāvalī 1/2/3 **[NĀMĀVALĪ]** · Ṣōḍaśōpacāra Pūjā (procedure) · Pītōpaniṣat ·
Pītāmbarōpaniṣat — genuine stotra-type after filtering: **~19**

**Kamalā (7):** **Stōtram 1** · Stōtram 2 · **Kamalāmbikā Stōtram** · **Kavacam** · Sahasranāma Stōtram
**[NĀMĀVALĪ]** · Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī **[NĀMĀVALĪ]** —
genuine: **~4**

**Tārā / Nīlasarasvatī (7):** **Stōtram** · **Tārāṣṭakam** · **Kavacam** · Tārāmbā Hṛdayam ·
Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī **[NĀMĀVALĪ]** · Nīlasarasvatī Stōtram —
genuine: **~5**

**Bhuvaneśvarī (6):** **Stōtram** · Hṛdayam · **Kavacam (Trailōkyamaṅgalam)** · Pañjara Stōtram ·
Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī **[NĀMĀVALĪ]** — genuine: **~4**

**Chinnamastā (6):** **Stōtram** · **Hṛdayam** · **Kavacam** · Pracaṇḍa Caṇḍikā Stavarājaḥ ·
Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī **[NĀMĀVALĪ]** — genuine: **~4**

**Dhūmāvatī (5):** **Stōtram** · **Hṛdayam** · **Kavacam** · Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** +
Nāmāvalī **[NĀMĀVALĪ]** — genuine: **~3**

**Tripura Bhairavī (6):** **Stōtram** · Hṛdayam · **Kavacam** · Bhairavī Kavacam (Trailōkyavijayam) ·
Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī **[NĀMĀVALĪ]** — genuine: **~4**

**Ṣoḍaśī / Tripurasundarī (10):** **Tripurasundarī Stōtram 1** · Tripurasundaryaṣṭakam [already
have this in Lalitā folder — skip] · Pañcaratna Stōtram [already have — skip] · Prātaḥ
Smaraṇam [already have — skip] · Mānasapūjā Stōtram [already have — skip] · Vēdapāda Stavaḥ
[already have — skip] · Mahātripurasundarī Hṛdayam · **Mahātripurasundarī Ṣaṭkam** · Ṣōḍaśī
Aṣṭōttaraśatanāma Stōtram **[NĀMĀVALĪ]** + Nāmāvalī **[NĀMĀVALĪ]** — genuine NEW (not already
in Lalitā folder): **~2** (Hṛdayam, Ṣaṭkam; Ṣaṭkam written 2026-09-02 as
`16_mahatripurasundari_shatkam.txt`, filed here rather than under Lalitā per the corpus's
dedup note)

**Daśamahāvidyā common (1):** Aṣṭōttaraśatanāmāvalī **[NĀMĀVALĪ]**

Genuine stotra-type grand total after filtering and de-duping against Lalitā/Kālikā/Mātaṅgī
overlaps: **31 written (2026-09-05) + ~14 remaining** (incl. Bagalāmukhī Kavacam 4/5, Bagalāmukhī Varṇa Kavacam, Bhairavī Kavacam Trailokyavijayam).

---

## Grand total remaining (genuine stotra-type, after all filtering)

Table refreshed **2026-09-05** after the +102-file Devī/Śākta round (+10 in top-level `ganga/`).
Remaining figures are the prior estimates decremented by this round's writes, except for the four
rows carrying a 2026-09-05 exhaustion verdict — Pratyaṅgirā and Mīnākṣī closed at 0, while
Gāyatrī, Śyāmalā/Mātaṅgī and Gaṅgā were **corrected upward**, their prior estimates having been
understated. (The 2026-09-04 refresh note it replaces: the table had previously stalled at
2026-08-25 baseline figures for several rows even though the 2026-09-02 round had already written
into them.)

| Section | Written | Genuine stotra-type remaining |
|---|---:|---|
| Sarasvatī | 18 (3 on 2026-08-25 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~21 |
| Gāyatrī | 15 (3 on 2026-08-25 + 5 on 2026-09-04 + 7 on 2026-09-05) | **~10-12 — CORRECTED UPWARD 2026-09-05**; the old "~9" was wrong. NOT exhausted; 10 open titles itemized in the Gāyatrī section above |
| Devī main | 41 (23 pre-existing + 3 on 2026-09-02 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~75-85 (re-audited 2026-08-24, was ~60-70) |
| Lalitā/Tripurasundarī | 35 (14 pre-existing + 4 on 2026-09-02 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~70-75 (re-audited 2026-08-24, was "✅ Complete"). ⚠ 2 of the 2026-09-05 files duplicate `dasamahavidya/` files — see `../DEDUP_AUDIT.md` (pairs 4-5) |
| Durgā | 36 (16 pre-existing + 5 on 2026-09-02 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~25-35 (re-audited 2026-08-24, was "✅ Complete") |
| Lakṣmī | 33 (14 pre-existing + 4 on 2026-09-02 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~90-100 (re-audited 2026-08-24, was "✅ Complete"); 4 modern copyright-notice titles permanently excluded, not counted here |
| Vārāhī | **12 — POOL EXHAUSTED / COMPLETE (2026-09-04)** | **0** — remaining candidates confirmed ritual/nāmāvalī/mantra-type, out of scope |
| Kāmākṣī (6 already written in `lalita/` — the original 4 plus 2 more on 2026-09-02, not counted in this table's totals) | 0 | ~4 confirmed new (+up to 5 pending dedup) |
| Mīnākṣī | **12 — POOL EXHAUSTED / COMPLETE (2026-09-05)** (2 on 2026-09-02 + 5 on 2026-09-04 + 5 on 2026-09-05) | **0** — stotranidhi carries only 4 Mīnākṣī titles (all written); sanskritdocuments' Devī index has 11, all accounted for |
| Annapūrṇā | **7 — POOL EXHAUSTED / COMPLETE (2026-09-04)** | **0** — remaining candidates confirmed nāmāvalī/sahasranāma-type, out of scope |
| Gōdā Dēvī/Āṇḍāḷ | 4 (2 on 2026-09-02 + 2 on 2026-09-04 — both Sanskrit stotras and both Tamil prabandhams now done; unchanged this round) | 0 Sanskrit/Tamil (+2 nāmāvalī, out of scope) |
| Śyāmalā/Mātaṅgī (unified pool, resolved 2026-09-04 — same deity as the Mātaṅgī cluster in Daśamahāvidyā) | 15 (3 on 2026-09-02 + 5 on 2026-09-04 + 7 on 2026-09-05) | **3 confirmed (+1 unassessed) — CORRECTED 2026-09-05**; the old "~7" was understated. NOT exhausted: Mātaṅgī Stotram (Āgamasāra, 95 v), Mātaṅgī Stutiḥ 1 (58 v), Mātaṅgī Dhyānam (5 v); Rāja Śyāmalā Rahasya Upaniṣad unassessed |
| Bālā (confirmed distinct from Lalitā's Bālā-Tripurasundarī find, resolved 2026-09-04 — no merge) | 18 (3 on 2026-08-25 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~6 |
| Kālikā/Kālī (unified pool, resolved 2026-09-04 — same deity as Daśamahāvidyā's Kālī cluster) | 18 (3 on 2026-08-25 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~22, now explicitly **including the 3 unwritten Bhadrakālī titles re-routed here from the Pratyaṅgirā association on 2026-09-05** |
| Pratyaṅgirā | **11 — POOL EXHAUSTED / COMPLETE (2026-09-05)** (3 on 2026-09-02 + 5 on 2026-09-04 + 3 on 2026-09-05) | **0** — all 31 stotranidhi pratyangira/bhadrakali slugs plus sanskritdocuments accounted for; the rest is mantra-prayoga/bīja-string genre, out of scope |
| Daśa Mahāvidyā (non-Kālī vidyās; revised 2026-08-24, was ~45) | 31 (16 on 2026-09-02 + 5 on 2026-09-04 + 10 on 2026-09-05) | ~14 — still open, incl. Bagalāmukhī Kavacam 4/5, Bagalāmukhī Varṇa Kavacam, Bhairavī Kavacam Trailokyavijayam (diff against file 14 first) |
| Gaṅgā (new genre, 2026-08-24; top-level `ganga/`) | 15 (5 on 2026-09-02 + 10 on 2026-09-05) | **~30 — CORRECTED UPWARD 2026-09-05**; the old "~10-15" was low. NOT exhausted: ~30 further distinct sanskritdocuments `doc_devii` texts screened as promising |
| Minor Nadīs — Yamunā/Kāverī/Narmadā/Godāvarī/Tuṅgabhadrā/etc. (new genre, 2026-08-24; `devi/nadi/`, unchanged this round) | 4 (written 2026-09-02) | 0 — section confirmed genuinely exhausted for this pass |
| **Total** | **325** (matches `devi/` [310] + top-level `ganga/` [15] via `find`) | **~370-425** (rough sum of the ranges above; Kāmākṣī's ~4-9 not double-counted since already inside the Lalitā row's file count) |

The five re-audits (Devī-main, Lalitā, Durgā, Lakṣmī, Vārāhī) found roughly 400+ previously-
untracked titles that were sitting in sections marked "✅ Complete" — see each section's
"RE-AUDIT, 2026-08-24" block above for the full breakdown. **All three reconciliation questions
this surfaced are now resolved (2026-09-04, the user's explicit call):** Śyāmalā/Mātaṅgī and
Kālikā/Daśamahāvidyā-Kālī are each the same deity and are now tracked as unified, deduplicated
pools (see their own sections above); Bālā was confirmed genuinely distinct from Lalitā's
Bālā-Tripurasundarī material, so both pools stand independently with no merge. None of this
changed any already-written file or any folder's file count — only the candidate-list
bookkeeping and caveat wording were updated.

This is now a much larger future scope than previously tracked. The priority-pick table at the
top still gives ~37 texts as a concrete, boundable first pass for the 2-week testing window —
unaffected by this revision, since none of the picks came from the newly-found material.

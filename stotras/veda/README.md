# `stotras/veda/` — Vedic sūktas

This folder holds hymns that are **Vedic text**, not stotra. The difference matters in two ways,
and both are why they are kept apart from the deity folders.

1. **A Vedic sūkta belongs to a śākhā.** A stotra is the same text for everyone who recites it.
   A sūkta is not. The Puruṣa Sūkta of the Taittirīya tradition and the Puruṣa Sūkta of the
   Mādhyandina tradition are the same hymn in two recensions, with a different ṛc count and a
   different division of the pādas, and they are the recitation of different communities.
2. **A Vedic sūkta carries svara.** Accent is part of the text, and it is recension-specific.

**This folder is therefore split by śākhā at the folder level, and the sides must never be
merged, harmonised, or presented as variants of one text.** This follows the same rule as
`stotras/vidhi/`. See the śākhā and svara sections of the repo-root `CLAUDE.md`.

## `taittiriya/` — South Indian, Kṛṣṇa-Yajurveda

Six files, 106 units, written 2026-09-12. Four are the **pañca-sūkta** set recited at abhiṣeka,
less the Śrī Sūkta, which the corpus already held; the fifth is the Durgā Sūkta, and the
sixth is the garland of deity gāyatrīs.

- `01_purusha_suktam.txt` — 26 units (24 ṛcs + śānti before and after). TĀ 3.12–13.
- `02_narayana_suktam.txt` — 30 units. TĀ 10.13, with TĀ 10.22 and the gāyatrī at TĀ 10.1.
- `03_bhu_suktam.txt` — 19 units. A compilation: TS 1.5.3, TB 3.1.2.6, Ekāgni-kāṇḍa 2.15,
  ṚV 10.71.2, two non-Vedic dhyāna verses, and one block not located in any of them.
- `04_nila_suktam.txt` — 4 units. TS 4.4.12.
- `05_durga_suktam.txt` — 9 units (7 ṛcs + Kātyāyanī gāyatrī + śānti). TĀ 10.2, gāyatrī at TĀ 10.1.
  **Not part of the pañca-sūkta.** Written because the corpus's existing
  `devi/durga/19_durga_suktam.txt` is the same text without accent — its source,
  `sanskritdocuments.org/doc_devii/durga-suuktam`, prints none, despite a `svara` keyword in its
  category line. The two files are cross-referenced and neither supersedes the other.
- `06_gayatri_mala_mantrah.txt` — 18 units. The deity gāyatrīs at TĀ 10.1.5–7, and the six-mantra
  `पाठभेदः` block that the Mahānārāyaṇa Upaniṣad prints after them. **Not a sūkta.** Base text
  stotranidhi.com, collated against both the accented Taittirīya Āraṇyaka and the accented
  Mahānārāyaṇa Upaniṣad on sanskritdocuments.org.

The fifth of the five, **Śrī Sūktam, is not here** — it was already written as
`devi/lakshmi/06_sri_suktam.txt`, under Lakṣmī, and the rule against rewriting an existing file
from a new witness applies. That file is cross-referenced from all four of these, and they from
it. The recitation order of the set is Puruṣa, Nārāyaṇa, Śrī, Bhū, Nīḷā.

**Accent: present throughout.** Base text for all four is stotranidhi.com, whose Veda pages
carry full svara marking and are largely this tradition. Every one was then collated against the
**accented Taittirīya Saṁhitā, Brāhmaṇa and Āraṇyaka on sanskritdocuments.org** — a separate
editorial lineage in the **same śākhā**, so the svara rule permits it. The collations found no
substantive disagreement. Four defects in the base texts were corrected and are itemised in the
files: `पृश्ञि` for `पृश्नि`, a stray hyphen, `अस्येश्याना` for `अस्येशाना`, and a zero-width
joiner inside `पर्‍षदति`. No accent mark was added, inferred or moved anywhere.

**On Gītā Press.** Gītā Press does publish a Puruṣa Sūkta — archive.org holds its
`Purush Sukta and Shri Sukta` volume — but that edition is headed `अथ माध्यन्दिनीयपुरुषसूक्तम्`
and is the **Mādhyandina** recension. Under the śākhā rule it is a different tradition's text,
not a witness to these, and it was not used. It belongs in a `madhyandina/` folder beside this
one, which does not exist yet.

## `rigveda/` — Śākala

Three files, 25 units, written 2026-09-12. **All three were written for the same reason: the corpus
already held the hymn, without its accent.** In each case the existing file was left exactly as it
was and a cross-reference was added to it; neither file of any pair supersedes the other.

- `01_agni_suktam.txt` — 9 units. ṚV 1.1, the first hymn of the Ṛgveda.
  **Written because the corpus's existing `misc_vedic/01_agni_suktam.txt` is the same hymn
  without accent.** That file says plainly that its source carried the svara and that it was
  dropped on purpose, under the convention this corpus followed before 2026-09-08. The two files
  are cross-referenced and neither supersedes the other.
- `02_ratri_suktam.txt` — 8 units. ṚV 10.127, the hymn to Night. The corpus holds the same eight ṛcs
  unaccented as `devi/durga/39_vedokta_ratri_suktam.txt`, from the Gītā Press *Durgā Saptaśatī*,
  which prints the whole Saptaśatī without svara.
- `03_devi_suktam.txt` — 8 units. ṚV 10.125, the Vāk Sūkta, in which the Goddess speaks of herself.
  The corpus holds the same eight ṛcs unaccented as `devi/durga/42_rgvedokta_devi_suktam.txt`, from
  the same volume.

**Accent in `01_agni_suktam.txt`: 97 marks.** Base text is the accented saṁhitā-pāṭha of
`ऋग्वेदः सूक्तं १.१` on sa.wikisource.org, printed with Sāyaṇa's bhāṣya, which also carries the
accented pada-pāṭha of all nine ṛcs. It was collated against the accented page on stotranidhi.com
and against the Aufrecht edition on GRETIL, which is unaccented and is a witness to the wording
only. **All three agree in every word, and the two accented witnesses agree on every accent mark.**
The differences between them are orthographic — anusvāra against class nasal, `ळ` against `ल`,
`र्ऋ` against `रृ`, and stotranidhi's ASCII colon for the visarga — and each one is itemised in
the file. Archive.org holds no Gītā Press edition of the Ṛgveda saṁhitā, so there is no Gītā
Press witness to this text.

**Accent in `02` and `03`.** Base text for both is the accented saṁhitā-pāṭha on sa.wikisource.org,
printed with Sāyaṇa's bhāṣya. Both were collated against the **accented Aufrecht text on
sanskritdocuments.org** (`doc_veda/r10.itx`, category "veda, rigveda, svara"), which is a European
critical lineage separate from the Indian printed edition. The Rātri Sūkta had a third accented
witness in stotranidhi.com. **Every witness of each hymn agrees letter for letter and on every accent
mark.** Both were then compared letter for letter against the Gītā Press Saptaśatī text already in
the corpus; the agreement is complete except for the `ॐ` that volume prefixes to ṛc 1, the kampa
numerals that belong to accent notation, one reading in ṚV 10.127.4 (`अविक्षमहि` against
`अवि॑क्ष्महि`), and the spelling `भूर्य्या` for `भूर्या` in ṚV 10.125.3. Those are recorded in both
files and nothing was corrected in the existing ones.

**One warning worth carrying out of this folder: stotranidhi.com's Devī Sūktam page is not the
Śākala text.** It reads `सोऽअन्न`, `वातऽइव` and `श्रुणोति`, and marks the double svarita `᳚`
throughout, none of which the two Ṛgvedic witnesses do. It is another tradition's recension of the
same hymn, and under the svara rule its accents must not be laid on the Ṛgvedic text. It was not
used. The same site's Rātri Sūktam page is the plain Śākala text and was used.

The Ṛgveda survives complete in one śākhā, the Śākala, so the cross-śākhā question that governs
`taittiriya/` does not arise here.

The corpus's other Ṛgvedic hymn, `pitr/04_pitr_suktam_rigveda.txt` (ṚV 10.15), is accented and
sits in `pitr/` for historical reasons. It has not been moved.

## `madhyandina/` — North Indian, Śukla-Yajurveda

Two files, 24 units, written 2026-09-12. Together they are the whole of Vājasaneyi Saṁhitā
adhyāya 31. They are kept as two files because the printed recitation book used for the first
one closes at mantra 16 and turns straight to the Śrī Sūkta.

- `01_purusha_suktam.txt` — 18 units (16 mantras, VS 31.1–16, with the opening invocation and
  the closing colophon of the print). **Accented, 254 marks.**
- `02_purusha_suktam_uttarabhaga.txt` — 6 units. VS 31.17–22, the six mantras that complete the
  adhyāya. **Accented, 117 marks.**

**Witnesses.** The base text of `01` is an accented Devanāgarī lithograph published by **Master
Khelāṛīlāl, Kachauri Gali, Banaras City**, printed at the "Jaj Printing Works" press, read from
the page images of the copy at archive.org (`NmAB_purush-sukta-and-shri-sukta-gita-press`); its
OCR is unusable. Accent for both files, and the Devanāgarī of `02`, come from the accented
Mādhyandina Vājasaneyi Saṁhitā on **sa.wikisource.org** (`शुक्लयजुर्वेदः/अध्यायः ३१`, the
saṁhitā text inside the Uvaṭa–Mahīdhara commentary blocks) — the **same śākhā**, so the svara
rule permits it. Both were collated against the **TITUS** edition of the Vājasaneyi-Saṁhitā
(Mādhyandina), part 31, accented IAST, a scholarly lineage of its own.

**Result of the collation: across all 22 mantras the witnesses differ in exactly five places.**
Three fall in `01` — a visarga written in one witness and not the other at mantra 1, `ततो` against
`तस्माद्` at mantra 5, and `किमस्यासीत् किं बाहू किमूरू` against `कौ बाहू का ऊरू` at mantra 10. In
each of the three the Khelāṛīlāl print and sa.wikisource agree and TITUS stands alone, and the two
Mādhyandina witnesses are followed. Two fall in `02`, both single words — `ब्राह्मं` against
`ब्राह्म्यं` at VS 31.21 and `व्यात्तम्` against `व्यात्ताम्` at VS 31.22 — and these are printed
as bracketed variants in the lines themselves, unaccented, because TITUS gives them in IAST only
and no accented witness for either was found. No accent mark was added, inferred or moved anywhere.

**Correction to the note above, added 2026-09-12 by the session that wrote this folder — the text
of the `taittiriya/` section is unchanged.** The paragraph headed "On Gītā Press" in that section
says that Gītā Press publishes a Puruṣa Sūkta and that archive.org holds its `Purush Sukta and
Shri Sukta` volume. **The volume is not a Gītā Press imprint.** archive.org catalogues it under
`creator: "Gita Press"`, but its own closing colophon names Master Khelāṛīlāl of Banaras as the
publisher and the "Jaj Printing Works" as the press. The substance of that paragraph still holds
— the volume is headed `अथ माध्यन्दिनीयपुरुषसूक्तम्`, it is the Mādhyandina recension, and it was
correctly not used as a witness to the Taittirīya text. Only the publisher is wrong. **No Gītā
Press edition of the Mādhyandina Puruṣa Sūkta has been located**, so the Gītā Press rule of the
repo-root `CLAUDE.md` did not govern these two files.

## Folders not yet written

- None. Both `taittiriya/` and `rigveda/` are partial, and `madhyandina/` now holds the Puruṣa
  Sūkta; further Mādhyandina sūktas are unsurveyed.

## Added 2026-09-12 — `taittiriya/07_mantra_pushpam.txt`

18 verses. The principal portion is **Taittirīya Āraṇyaka 1.22**, which the accented pāṭha edition
numbers `०। १। २२। ७८` onward. **378 accent marks.**

Base text `stotranidhi.com/hi/mantra-pushpam-in-sanskrit/`. **Two independent accented witnesses,
both in this śākhā:** the accented Taittirīya Āraṇyaka on sanskritdocuments.org, against which the
principal portion agrees at **99.53% with the accent identical mark for mark**; and
`vignanam.org/devanagari/mantra-pushpam.html`, a second ritual-manual lineage in native Devanāgarī,
against which it agrees at **99.84%**, differing in two anudātta marks. The passages recited after
it agree with vignanam at 92.47%, every difference being one of pāṭha or sign placement rather
than wording. Five ASCII colons standing for visarga were corrected — the known stotranidhi defect.

**What the base text's page prints and the file does not, all recorded in the file's header:** its
first thirty-three lines are the **Nārāyaṇa Sūktam**, which is already `02_narayana_suktam.txt` in
this folder, and its two blocks marked `[** पाठभेदः **]` — the page's own label for a variant — are
described in the header rather than printed as text. The second of those is a list of ten further
deity Gāyatrīs and the dūrvā verses, which belong to the pūjā rather than to this text.

Differences itemised and **not reconciled**: the Mahādevī Gāyatrī stands in the base text and not
in vignanam; vignanam opens with a śānti that the base text does not print, and it was not
imported; `किं तद्विष्णोर्बलमाहुः` is unaccented in the base text and absent from vignanam.

**Note on notation, because the two Taittirīya folders differ.** This folder writes the guttural
nasal `ग्ं` in `deva:` and romanises it `ṁ`, which is what its six existing files do. `vidhi/taittiriya/`
spells the same sound the same way but romanises it `gṁ`. The two folders differ in
romanisation only.

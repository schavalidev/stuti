# Duplicate audit and colophon unification — 2026-09-05

**Status: complete.** All ten duplicate pairs resolved, all colophons unified.
Corpus: **684 files, 684 distinct works** (was 694 files / 684 works).

A pre-operation backup of all 694 original files is at
`scratchpad/backup_predelete/` — every deleted file survives there at its original path.

---

## 1. How the duplicates were found

Two independent scans over all 694 files. Neither alone was sufficient:

1. **Title match** — `Title:` normalised (NFC, `ē→e`, `ō→o`, punctuation stripped, lowercased).
   Missed the same text filed under two names (Tārā Stōtram / Tārāṣṭakam).
2. **Content match** — all `deva:` content concatenated, everything outside U+0900–U+097F stripped,
   first 300 characters compared. Missed pairs whose openings differ by spacing or one orthographic
   variant (Annapūrṇā Stōtram, Mīnākṣī Pañcaratnam).

The union found ten pairs. An earlier title-only spot-check over a single round's output had found
only two; that figure was wrong and is superseded here.

## 2. Resolution

Each pair was merged by one agent and then checked by a second, independent agent working from the
backup, whose only job was to find content that failed to survive. Governing principle: **a deity
with its own folder is filed there; the collection folder (`devi/main/`, `navagraha/`) is for
deities with no dedicated home.**

| # | Kept | Retired | Verses | Routing basis |
|---|---|---|---|---|
| 1 | `brahma/06_brahma_kavacam_jaganmangalam.txt` | `brahma/02_brahma_kavacham.txt` | 10 | Same folder; richer write-up, and its filename names the text ("Jaganmaṅgalam") rather than a generic one |
| 2 | `shani/02_shani_stotram_dasaratha_krutam.txt` | `navagraha/17_shani_stotram_dasaratha.txt` | 13 | Dedicated deity folder beats collection folder |
| 3 | `devi/dasamahavidya/06_tarashtakam.txt` | `devi/dasamahavidya/05_tara_stotram.txt` | 13 | Same folder, two names for one text |
| 4 | `devi/lalita/27_mahatripurasundari_shatkam.txt` | `devi/dasamahavidya/16_…` | 6 | Mahātripurasundarī *is* Lalitā, who has a dedicated folder. **Overrides the 2026-09-02 note** that had routed this to `dasamahavidya/` |
| 5 | `devi/lalita/28_kamalambika_stotram.txt` | `devi/dasamahavidya/18_…` | 9 | Contested; decided on the verse text — see below |
| 6 | `devi/annapurna/01_annapurna_stotram.txt` | `devi/main/07_annapurna_stotram.txt` | 13 | Dedicated deity folder |
| 7 | `devi/annapurna/03_annapurna_mantra_stavam.txt` | `devi/main/08_…` | 18 | Dedicated deity folder |
| 8 | `devi/meenakshi/02_meenakshi_pancharatnam.txt` | `devi/main/19_…` | 5 | Dedicated deity folder |
| 9 | `devi/meenakshi/01_meenakshi_stotram.txt` | `devi/main/20_…` | 8 | Dedicated deity folder |
| 10 | `devi/saraswati/18_sharada_bhujanga_prayata_ashtakam.txt` | `devi/main/18_…` | 8 | Dedicated deity folder |

The **Verses** column counts numbered verse blocks. Every survivor's `Verse count:` agrees with it.
A `verse none` colophon block is deliberately excluded from the count — an earlier draft of this
table listed *block* counts, which made it look as though verses had gone missing. They had not.

### Pair 5, the contested one

Kamalāmbikā could be (i) Kamalā, the Lakṣmī-form tenth Mahāvidyā, or (ii) Kamalāmbā of Tiruvarur,
who in Śrīvidyā *is* Tripurasundarī (as in Dīkṣitar's Kamalāmbā Navāvaraṇa kṛtis). The verse text
decided it for (ii): the vocabulary is unambiguously Śrīvidyā (Rājarājeśvarī, the Kāmeśvara-pīṭha,
the ṣaṭkoṇa, the hrīṁkāra, kaulinī), and Lakṣmī never appears as the goddess addressed — only in her
retinue, at verses 2, 5 and 7. Against it: the source site files the text under its Daśamahāvidyā
collection. Verse 2's `śrīvāṇī-` compound admits a second reading, so the file's provenance note now
records that the argument does not rest on verse 2 alone.

### Not duplicates

`devi/saraswati/01_saraswati_stotram_1.txt` (`sarasvati namastubhyaṁ…`) and
`devi/saraswati/12_saraswati_stotram_2.txt` (`ravirudrapitāmahaviṣṇunutaṁ…`) are two different
9-verse hymns sharing the generic title "Śrī Sarasvatī Stotram". Both kept.

## 3. What the adversarial verification caught

The second-pass verifiers found defects the merging agents had missed or under-reported. All were
repaired:

- **`shani/02`** — the merge kept a Telugu gloss that dropped *paśu* (v.10) and *grāma*/*dvīpa*
  (v.12), terms the file's own Sanskrit, English and Hindi all carry. Restored. Verse 9's gloss had
  also regressed to a looser parse of `kāśyapātmajasūnave`; the correct two-generation reading
  (Śani is son of Sūrya, who is son of Kaśyapa) was restored in all three languages.
- **`brahma/06`** — the merge silently changed verse 9's `ॐ` to `ओं` while leaving a provenance claim
  that the text matched its source exactly. `ओं` kept (corpus-majority form, 2821 vs 440), and the
  source's reading is now recorded in `Source / recension:`.
- **`devi/annapurna/01`** — three verse glosses had been thinned; the Dakṣa allusion, the mātṛkā
  explanation and the `nityānnadāneśvarī` gloss were restored, along with a record of two editorial
  corrections applied to the retired file's base text.
- **`devi/meenakshi/02`** — the merge introduced a contradiction present in neither source, calling
  the same *sabhā* both Naṭarāja's (Chidambaram) and Madurai's veḷḷiyambalam. Resolved to Madurai,
  which is what this hymn is about.
- **`devi/meenakshi/01`** — the merge replaced the survivor's own sourced `तत्त्वंमयी` with the
  retired file's `तत्त्वम्मयी`. The reading was kept but the substitution is now documented; an
  undocumented change to sourced Sanskrit was the defect, not the reading.

**One verifier finding was itself wrong**: a zero-width joiner in `shani/02` verse 9 was reported as
stray junk. It sits immediately after a virāma, where ZWJ is a meaningful Devanāgarī half-form
control. It was left in place.

## 4. Colophon unification

Colophons existed in five competing shapes. All are now the single canonical form — a trailing block
headed exactly:

```
--- verse none | section: Colophon ---
```

carrying `deva:`, `iast:`, `en:`, `tel:`, `hi:`. `verse none` marks it as outside verse numbering, so
a colophon never counts toward `Verse count:`. **112 files** now carry one.

| Shape found | Files | Action |
|---|---|---|
| Already canonical | 49 | none |
| `verse none` block, non-standard label — `Samāpti`, `Puṣpikā`, `Stavam`, `Closing colophon`, and four Telugu-script labels (`సమాప్తివాక్యం`, `సమాప్తి వాక్యం`, `పుష్పిక`, `సమాప్తివచనం`) | 24 | relabelled |
| Bare `--- colophon ---` | 5 | relabelled |
| Numbered as a verse, inflating `Verse count:` | 2 | relabelled; counts corrected 14→13 and 17→16 |
| Numbered `passage 13` in a gadya text | 1 | relabelled; prose count reworded |
| Header `Colophon:` field | 16 | converted to blocks; field removed |
| Bare untagged text after the last block, in no field at all | 12 | converted to blocks |

### What was deliberately NOT changed

- **11 files** whose last block begins with *iti* but is a genuine metrical verse, not a prose
  colophon — Godā Stuti v.29, the Tulasīdāsa stuti, phalaśruti verses, narrative kathā verses.
  Relabelling these would have been an error.
- **Colophon *verses*** — metrical signature verses in which the poet names himself. These are part
  of the poem and rightly numbered. `hanuman/19` v.11 (a bhūtasaṁkhyā chronogram naming Lokeśvara
  Bhaṭṭa) was relabelled `Colophon verse` to keep the distinction visible.
- `devi/lalita/14_saundarya_lahari.txt` had **two** blocks labelled "Phalaśruti and colophon" — a
  phalaśruti verse and the actual prose colophon sharing one label. Split into `Phalaśruti` and
  `Colophon`.

## 5. Other data hygiene fixed in passing

- **3 files** ended with a stray `</content>` tag — leaked markup from an authoring agent.
- **12 stray invisible characters** (ZWSP, and ZWJ/ZWNJ not following a virāma) in 7 files. Joiners
  that *do* follow a virāma were preserved — there they are meaningful rendering controls, not junk.

## 6. Open, not actioned

- ~~**Orthography outside verse text**~~ — **RESOLVED 2026-09-07, see §10 below.**
- ~~**Two pre-existing IAST/Devanāgarī mismatches** in `devi/main/25_rajarajeshwari_shodasi.txt`~~ —
  **RESOLVED 2026-09-07.** `plaveccirmaho` → `plavecciramaho` (v.9) and `statanmūrtiratā` →
  `stattanmūrtiratā` (v.16), each corrected against its own Devanāgarī, which was right in both cases.
- **`Sections:` completeness.** 23 files had a Colophon block absent from their `Sections:` list;
  fixed. A keyword-based sweep found them, so files describing their colophon without using the word
  may remain.
- ~~**22 pre-existing `Verse count:` mismatches**~~ — **RESOLVED 2026-09-07, see §9 below.**

---

## 7. Final verification

Run over all 684 files after every change (and re-run over **704** on 2026-09-07, after the
`bhagavadgita/` folder and the Viṣṇu Sahasranāma were added — all results below still hold; the new
files were checked and are fully conformant, see §8):

| Check | Result |
|---|---|
| Files | 684 → 704 |
| Content-duplicate groups | **0** |
| Canonical colophon blocks | 112 |
| Leftover header `Colophon:` fields | **0** |
| Loose untagged colophons | **0** |
| Verse blocks missing `deva:` | **0** |
| Stray `</content>` markup | **0** |
| `Verse count:` mismatches | 22, all confirmed pre-existing |
| `PROJECT_TRACKING.md` per-folder table | 34 rows, sums to 684, **zero mismatches** against the filesystem |

---

## 8. Additions of 2026-09-07 — checked, no action needed

Twenty files were added outside this session, taking the corpus to **704**. Both were audited against
the conventions established above and **conform fully**; nothing needed fixing.

**`bhagavadgita/` (19 files, 710 verses)** — 18 adhyāyas plus Gītā Dhyānam. Every file's
`Verse count:` matches its numbered blocks exactly; all five fields (`deva:`, `iast:`, `en:`, `tel:`,
`hi:`) present throughout; no `ṃ`, no decomposed `r̥`, no verse numbers inside the text, no stray
markup. All 18 chapters already carry the canonical `--- verse none | section: Colophon ---` block —
the convention was matched without being told. The only `ē`/`ō` in the folder are mention-not-use, in
the sentence explaining that Stotra Nidhi's IAST page marks South Indian long vowels and was therefore
*not* used, the IAST being generated from the Devanāgarī instead.

Provenance here is stronger than the corpus average: each chapter was collated character by character
against two independent digital editions (`github.com/gita/gita` `data/verse.json` and
`vedicscriptures.github.io`), with divergences adjudicated individually and the count of adopted
corrections recorded per chapter.

One point worth preserving: the total is **701 verses, not the traditional 700**. Chapter 13 has 35
verses here because the Stotra Nidhi recension opens it with Arjuna's question
`prakṛtiṁ puruṣaṁ caiva…`; Śaṅkara's recension omits that verse and numbers the chapter 34, which is
where the familiar 700 comes from. Editions differ on this one verse only, and every subsequent verse
in the chapter is numbered one higher here than in Śaṅkara-based printings. This is documented in the
chapter's own Recension note.

**`vishnu/25_vishnu_sahasranama_stotram.txt`** — 237 verse blocks matching its `Verse count:`, plus two
new conventions introduced deliberately: a `Name count:` header field and a `--- names ---` block
carrying a pipe-delimited table of exactly 1000 rows (index | Devanāgarī | IAST | English | Telugu |
Hindi). A generic "every block must have a `deva:` field" check flags that block; it is not a defect,
and any future structural audit should exempt `--- names ---`.

This also **supersedes the standing exclusion of sahasranāma texts** as out-of-scope name-lists. The
format above handles the stotra verses and the name-list in one file, so the genre is now in scope.
See `SAHASRANAMA_AUDIT_2026-09-07.md`, which re-audits availability and corrects the earlier
stotranidhi-only survey that had undercounted by roughly 7×.

---

## 9. `Verse count:` normalized — 2026-09-07

The 22 mismatches recorded above were not 22 errors. The real problem was that **`Verse count:` had
no consistent definition**: 684 of 706 files led with the number of numbered verse blocks, while the
other 22 led with something else — the core hymn's verses excluding its phalaśruti, the total block
count including the colophon, the count *as printed in the source*, or in two cases not verses at all
but **lines** (`Subrahmanya/06`, 244 Tamil lines) and **names** (`devi/varahi/09`, 12 nāmāvalī entries).
Almost every one of the 22 already explained itself correctly in its own parenthetical. The number in
front was simply answering a different question from the rest of the corpus.

**The rule now applied everywhere:** `Verse count:` leads with the number of **numbered verse
blocks**. Every other quantity — verses of the core hymn, units as printed in the source, total blocks,
lines, names — is stated in the prose that follows, which was preserved in full in each case.

20 files were brought into line. Three of them were genuine errors rather than definitional
mismatches:

- **`krishna/12_gopi_gitam.txt`** said "19 (gōpīs' verses) + 2 narrative closing verses" — but the
  file has 20 blocks, 19 gōpī verses and **one** closing narrative verse. The arithmetic was wrong.
- **`devi/pratyangira/01_pratyangira_stotram.txt`** said 20 while carrying 22 numbered blocks. The
  file had been renumbered sequentially 1–22 and the count was never updated. Now 22, with the
  composition spelled out (1 viniyoga, 5 dhyāna, 1 nyāsa, 7 stotra, 8 phalaśruti).
- **`devi/lalita/14_saundarya_lahari.txt`** said 100 while carrying 103. Verses 101–103 are the
  Anubandha — appendix verses that both source editions print and that sanskritdocuments' own note
  calls later interpolations. They were in the file but absent from the count. Now 103, with the
  core-100 distinction kept explicit.

**Two files were deliberately left as they stand**, and any future audit should expect them:

- `devi/varahi/09_varahi_dvadasanamavali.txt` — 12 names in 12 `verse none` blocks, no numbered
  verses. "12" is the only useful number; 0 would be worse.
- `Subrahmanya/13_kumara_kavacam.txt` — one unbroken unit of continuous prose (gadya) in a single
  `verse none` block. "1" is correct.

In both, the text genuinely has no numbered verses, so the leading integer counts content blocks
instead. That is the single documented exception to the rule.

Verified after the change: **704 of 706 files** have `Verse count:` exactly equal to their numbered
block count, the remaining 2 being the exceptions above.

> **Correction (2026-09-08).** "The single documented exception" undercounted. A re-scan that also
> caught files whose `Verse count:` opens with prose rather than an integer found **seven** such
> files, not two — the two above plus `devi/lakshmi/18_lakshmi_gadyam` (campū prose interleaved with
> ślokas), `devi/main/04_devi_khadgamala_stotram` (a nāmāvalī divided by the source's own headings),
> and the three daṇḍakas `Subrahmanya/23`, `/41`, `/42` (each one unbroken compound). All seven are
> genuine: the genre has no numbered verses, so the field explains itself in prose instead. The rule
> and its verification stand; only the count of exceptions was wrong. Each of the 20 edits was diffed against the
pre-change backup and altered the `Verse count:` line only.

---

## 10. Header-prose orthography sweep (2026-09-07)

The corpus rule — anusvāra `ṁ` not `ṃ`, Sanskrit IAST plain `e`/`o` not `ē`/`ō`, precomposed `ṛ`
not decomposed `r̥` — was already fully honoured in verse text. It was **not** honoured in the prose
around it. This pass extended it to `Title:`, `Author:`, `Source / recension:`, `Blurb:`, `Sections:`
and to `en:`/`hi:` commentary.

**753 replacements across 196 files**, in four passes of widening scope. `deva:`, `tel:` and `iast:`
were never touched.

**Scope: Sanskrit only.** Four Tamil works — `devi/goda/02_tiruppavai`,
`devi/goda/04_naacciyar_tirumozhi`, `devi/main/09_abhirami_andadi`,
`Subrahmanya/06_kandar_shashthi_kavacam` — are excluded whole-file and are byte-identical to their
pre-sweep state. In Tamil `ē`/`ō` are **distinct phonemes**, not decoration: an early pass flattened
these files, turning `Kōḻi Aḻaippadaṉ` into `Koḻi`, `Kāvēri` into `Kāveri` and `mēl-tōnṟi` into
`mel-tonṟi`. It was reverted in full from backup. Scattered Tamil and Telugu proper names inside
Sanskrit files (`Cōḻa`, `Aḻagarkōyil`, `jōguḻāmbā`, `Māliruñjōlai`, `Vēṅkaṭam`, `Kōdai`) are held by
name for the same reason.

**Quoted source readings were normalized too**, deliberately. The corpus renders every source into
its own transliteration scheme rather than reproducing a facsimile, so a quoted incipit follows the
same rule as the prose quoting it — `"namō"` → `"namo"`, `śrīrudrayāmalē` → `śrīrudrayāmale`. Where
a quotation contrasts two readings, normalizing both sides preserves the contrast, which lies
elsewhere (`kaniṣṭikhābhyāṁ` vs `kaniṣṭhikābhyāṁ` turns on `ṣṭ`/`ṣṭh`, not on the anusvāra).

**399 occurrences remain, all correct.** They are the rule's own statements — sentences *about* the
normalization (`ē/ō → e/o`, `ṁ/ṃ`, "the source prints `r̥`") and bare glyph mentions — plus the
Tamil and Telugu names above. Normalizing these would make the notes describe something other than
what they document.

**Verification.** For all 196 changed files, stripping every target glyph from both the pre-sweep
backup and the new text yields byte-identical results — nothing but the intended characters moved.
Zero structural mismatches. The four Tamil files verified unchanged by `cmp`.

---

## 11. Lalitā Sahasranāma intake + reconciliation (2026-09-08)

`devi/lalita/36_lalita_sahasranama_stotram.txt` was added after the sweep above, taking the corpus to
**707 files**. Audited on intake; two defects found and fixed.

**Anusvāra corruption in the nāmāvalī — 24 of 1000 rows.** The `tel` column carried a Latin `ṁ`
(U+1E41) where Telugu `ం` (U+0C02) belongs, and the same rows' `hi` column carried `ꣳ` (U+A8F3)
instead of `ं`. The `deva` column was clean throughout, and the other 282 anusvāra-bearing rows were
correct — so this was an isolated transliteration slip, not a systematic one. Fixed in those two
columns only. The other three nāmāvalī files (`vishnu/25`, `shiva/29`, `ganesha/29`) were scanned for
the same defect and are clean.

**Three colophon blocks were numbered.** vv. 282–283 (the `iti … sampūrṇam` closing, split across two
blocks) and v. 377 (`oṁ tat sat`) are scribal apparatus, not verses, so they take `verse none` per §5.
Converted, the remaining blocks renumbered 1–374, `Verse count:` 377 → 374, and the `Sections:` entry
marked unnumbered — matching how every other colophon in the corpus is handled.

Otherwise clean on intake: 1000 rows against `Name count: 1000`, numbering sequential with no gaps,
section counts summing to the block count, and zero orthography violations.

**Reconciliation.** `PROJECT_TRACKING.md`'s TOTAL was 706 against a filesystem of 707, and its note
still carried a stale "703" from an earlier revision. Both corrected: the table's 37 data rows now sum
to **707**, matching the filesystem exactly. The note also records what the totals had been quietly
eliding — **707 files = 706 works**, because `devi/main/03_anandalahari.txt` holds no text. It is a
cross-reference stub saying Ānandalaharī is vv. 1–41 of `devi/lalita/14_saundarya_lahari.txt` rather
than a work in its own right.

---

## 2026-09-08 — Durgā Saptaśatī: embedded hymns vs. standalone stotras (NO retirements)

Writing the Saptaśatī text proper (`devi/durga_saptashati/`) put three existing files in overlap
with it, because each is a hymn that the tradition both embeds in a chapter and anthologises on
its own:

| Existing file | Is | Overlaps |
|---|---|---|
| `devi/durga/14_tantrokta_ratri_suktam.txt` | Brahmā's stuti of Yoganidrā | adhyāya 1, vv. ~68–87 |
| `devi/durga/06_aparajita_stotram.txt` | the "namo devyai mahādevyai" / "yā devī sarvabhūteṣu" litany, 28 vv. | adhyāya 5 |
| `devi/durga/34_narayani_stuti.txt` | the Nārāyaṇī Stuti, 16 vv. | adhyāya 11 |

**All three kept. Nothing retired.** These are not duplicate *works* — one is a hymn as
independently recited and catalogued, the other is that hymn in its narrative place, with
different framing, different verse numbering and a different recitational use. `34_narayani_stuti`
had already noted that stotranidhi itself catalogues it twice for exactly this reason. Retiring
either side would lose something a user would look for.

The rule this sets, now also in `CLAUDE.md`: **retire a file only when two files are the same
work; not when one embeds the other.** Where one embeds the other, cross-reference both in the
recension notes and align the translations so the corpus does not disagree with itself on the
same verse — which is what was done here (the chapter translators were given the standalone files
to match).

---

## 2026-09-08 — two deliberate same-work pairs, kept apart on purpose

Two works are now held twice, in two recensions, and **neither pair is a duplicate to retire**:

| stotranidhi recension | Gītā Press recension | the difference |
|---|---|---|
| `hanuman/02_hanuman_chalisa.txt` (43 units) | `hanuman/32_hanuman_chalisa_gitapress.txt` (43) | Sanskritised चरण / वरणौं / यश / लखन against Avadhi चरन / बरनउँ / जसु / लषन |
| `rama/19_tulasidasa_krta_rama_stuti.txt` (5) | `rama/27_rama_stuti_gitapress.txt` (9) | ten readings, incl. नीरज "lotus" against नीरद "rain-cloud"; the GP file also carries the Bālkāṇḍ Gaurī-blessing units the print runs on after the pada |

These are the same *works*, so the retire-rule above would ordinarily apply. It does not, because the
difference between them is recensional rather than accidental — dropping either would delete evidence,
not a duplicate. This is also the case that produced the standing rule in `CLAUDE.md`, "Never rewrite an
existing file from a new witness": the Gītā Press texts were first written *over* files 02 and 19, the
originals were recovered and restored, and the pairs were separated instead. Each of the four files says
in its own recension note that its sibling exists and that neither supersedes the other.

- **Durgā Saptaśatī 11.10 = Skanda Lakṣmī Sahasranāma v154** (2026-09-09).
  `सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके देवि नारायणि नमोऽस्तु ते ॥`
  closes the stotram of `devi/lakshmi/35_lakshmi_sahasranama_stotram_skandapurana.txt`
  word for word. Both kept and cross-referenced: the sahasranāma embeds the verse, it
  is not the same work. Note the Brahma Purāṇa Lakṣmī Sahasranāma
  (`devi/lakshmi/34_...`) does NOT contain it — the two Lakṣmī sahasranāmas are
  distinct compositions.

- **`pitr/01_rucistava` + `pitr/02_ruci_pitr_stotram` — one Garuḍa passage, two files** (2026-09-10).
  Garuḍa Purāṇa 1.89.13–48 (`नमस्येऽहं पितॄन्…`) and 1.89.51–60 (`अर्चितानाममूर्त्तानां…`) are
  continuous, separated only by two verses of Mārkaṇḍeya's narration; Ṛṣipīṭham (Sept 2014)
  prints them as one hymn. Gītā Press prints only the second, as the *Rucistava*, and
  stotranidhi catalogues them as two stotras. **Both kept**, cross-referenced in each
  recension note — the tradition treats them as separate stotras.
- **`pitr/03` (VS 19.49–61) and `pitr/04` (ṚV 10.15) — two Pitṛ Sūktas, not one** (2026-09-10).
  They share four mantras verbatim (VS 19.49/56/55/51 = ṚV 10.15.1/3/4/8) and a fifth in
  altered form (VS 19.60 ~ ṚV 10.15.14). They are different works of different Vedas and are
  kept apart by the śākhā rule, not merged. `vidhi/madhyandina/03_tarpana_vidhi.txt` also
  uses VS 19.49 inside the tarpaṇa rite.
- **`shani/06_shanaischara_raksha_stavah` = vv. 1–6a of `shani/10_shani_ashtottarashatanama_stotram`** (2026-09-10).
  The rakṣā (`ध्यात्वा गणपतिं राजा…` to `…स भवेन्नात्र संशयः`) opens the Bhaviṣya Purāṇa
  *Śanaiścara-stavarāja*, which Gītā Press prints whole as the Śani aṣṭottara (entry 17 of
  *Śatanāma Stotra Saṅgraha*). `06` is from stotranidhi, `10` from Gītā Press, and they differ in
  three words. **Both kept**; `10` cross-references `06` in its recension note, and `06` carries an
  additive cross-reference line only, its text unchanged.

## 2026-09-11 — Durgā Aṣṭottaraśatanāma (Viśvasāra Tantra)

- `devi/durga/37_durga_ashtottarashatanama_stotram.txt` (Gītā Press *Durgā Saptaśatī*) and `devi/durga/50_durga_ashtottarashatanama_stotram_shatanama.txt` (Gītā Press *Śatanāma Stotra Saṅgraha*, entry 29) are the **same text**; verses agree word for word. The newer file adds a dhyāna and a numbered nāmāvalī. Both kept; additive cross-reference added to `durga/37`.

## 2026-09-12 — Prajñāvivardhana Kārtikeya Stotram (Rudrayāmala)

- `Subrahmanya/20_prajnavivardhana_kartikeya_stotram.txt` (vignanam.org + sanskritdocuments) and
  `Subrahmanya/53_prajnavivardhana_kartikeya_stotram_gitapress.txt` (Gītā Press *Śatanāma Stotra
  Saṅgraha*, appendix, p. 224) are the **same work** — the same six verses of twenty-eight names,
  the same Rudrayāmala colophon. They differ in two readings: v. 4 `शरजन्मा गणाधीशः पूर्वजो` (Gītā
  Press, three names) vs `शरजन्मा गणाधीशपूर्वजो` (`20`, two), and v. 6 `मम नामानि कीर्तयेत्` vs
  `मम नामानुकीर्तनम्`. Gītā Press also prints a viniyoga that `20` lacks. **Both kept**; `53`
  records the differences in its recension note, and `20` carries an additive cross-reference line
  only, its text unchanged.

## 2026-09-12 — The two recensions of the Gaṇapati and Hanumān pūjās

Two ṣoḍaśopacāra pūjās were written from stotranidhi.com beside the vignanam.org rites already in
`puja/smarta/`. **All four files are kept.** These are orders of service published by two different
houses, not two printings of one text, and none of the four is to be corrected from another.

- `puja/smarta/04_ganapati_nitya_puja.txt` (vignanam) and
  `puja/smarta/15_mahaganapati_shodashopachara_puja.txt` (stotranidhi, following the **Mudgala
  Purāṇa**, khaṇḍa 5 adhyāya 39). Genuinely different rites: `15` adds a second saṅkalpa, a
  prāṇapratiṣṭhā, madhuparka, pañcāmṛta and ābharaṇa, has a seventeen-name list where `04` has a
  thirteen-name aṅga-pūjā, and takes almost every upacāra verse from the Purāṇa. Cross-referenced
  in both directions.
- `puja/smarta/12_hanuman_nitya_puja.txt` (vignanam) and
  `puja/smarta/16_anjaneya_shodashopachara_puja.txt` (stotranidhi). **These two overlap heavily** —
  104 of the source page's 172 lines already stood in `12`. In particular the **seventeen-name
  aṅga-pūjā is word for word the same list in the same order**, differing only in `नेत्रौ` for
  `नेत्रे` and one dropped `ā`; so are the pādya, arghya, ācamana, garment, thread, sandal-paste,
  incense, betel and nīrājana verses, the long naivedya verse, and the three verses of the
  prārthanā. `16` earns its own file on what it adds: a second saṅkalpa, a two-verse dhyāna,
  madhuparka, ābharaṇa, its own seat, bath, akṣata, flower and lamp verses, the ātmapradakṣiṇa,
  the royal services, and its own tīrtha verse.

Three verses in `16` already stand elsewhere in the corpus, written from other sources, and are
cross-referenced rather than deduplicated: `मनोजवं मारुततुल्यवेगं` (`hanuman/08`, `17`, `24`,
`rama/01`), `अतुलितबलधामं` (`hanuman/17`, `33`) and `मर्कटेश महोत्साह` (`hanuman/13`). A long rite
embedding a standalone stotra is not a reason to retire either.

## 2026-09-12 — The two recensions of the Śiva pūjā

`puja/smarta/05_shiva_nitya_puja.txt` (vignanam, 60 units) and
`puja/smarta/17_shiva_shodashopachara_puja.txt` (stotranidhi, 44 units) are two published rites
for the same deity from two publishers. **Both are kept.** Neither is to be corrected from the
other, and each names the other in its header.

The overlap is small. Of the 256 lines of the stotranidhi page, **42 already stood in `05` and
214 did not.** This is the widest-apart pair in the folder. The shared lines are the three
opening dhyāna verses (`कर्पूर गौरं`, `वन्दे महेशं`, `ध्यायेन्नित्यं महेशं`), the
Mahāmṛtyuñjaya mantra, and the food-offering mantras. The two rites differ in what they are
built on: `17` heads every one of its sixteen services with a mantra of the Mahānārāyaṇa
Upaniṣad, and `05` does not.

Passages of `17` that also stand elsewhere in the corpus, written from other sources:

- the Rudra Gāyatrī `तत्पुरुषाय विद्महे महादेवाय धीमहि` — in `veda/taittiriya/06_gayatri_mala_mantrah.txt`,
  `devi/gayatri/17_gayatri_patala_mantra_maharnava.txt`, `puja/smarta/05` and `puja/smarta/10`;
- the Kātyāyanī Gāyatrī `कात्यायनाय विद्महे` — in `veda/taittiriya/06_gayatri_mala_mantrah.txt`;
- `त्र्यम्बकं यजामहे` (Ṛgveda 7.59.12) — in `puja/smarta/05` and `vidhi/rigveda/01_rigveda_sandhyavandanam.txt`;
- `नमो हिरण्यबाहवे` (the opening of the Śatarudriya) — in `puja/smarta/05`, `shiva/29_shiva_sahasranama_stotram.txt`,
  `Subrahmanya/12_kartikeyashtakam.txt` and `Subrahmanya/33_shadanana_ashtakam.txt`.

None of these is a reason to retire a file. The tradition catalogues the mantra and the rite
separately, and a manual that sent the worshipper elsewhere for its own mantras would be
unusable at the altar.

## 2026-09-12 — The two recensions of the Lakṣmī pūjā

`puja/smarta/07_lakshmi_nitya_puja.txt` (vignanam) and
`puja/smarta/18_mahalakshmi_visesha_shodashopachara_puja.txt` (stotranidhi) are two published
rites for the same goddess from two publishers. **Both are kept.** Neither is to be corrected
from the other, and each names the other in its header.

Of the 283 lines of the stotranidhi page, **54 already stood in `07` and 229 did not.** The two
rites differ in what they are built on: `18` heads each of its sixteen services with a ṛc of the
Śrī Sūkta, and `07` does not.

The fifteen ṛcs of the Śrī Sūkta printed in `18` also stand, as a continuous hymn, in
`devi/lakshmi/06_sri_suktam.txt`, which was written from vignanam.org and is the file `18` was
collated against. **Both are kept.** A hymn recited whole and the same hymn distributed one ṛc
to each service of a rite are catalogued separately by the tradition, and a manual that sent the
worshipper to another file for its own mantras would be unusable at the altar. `18`'s waving of
the light carries one ṛc (`सम्राजं च विराजं च`) that `devi/lakshmi/06` does not print.

The Gāyatrī and the offerings to the five breaths at `18`'s food-offering are the same mantras
used at that point in every deity rite of this folder.

## 2026-09-12 — The second recensions of the Durgā, Sarasvatī, Subrahmaṇya and Sūrya pūjās

Four more pairs, written the same day and on the same principle as the four before them. **All
eight files are kept.** Neither member of a pair is to be corrected from the other, and each
names the other in its header.

| vignanam rite | stotranidhi rite | source lines | already in the sibling | new |
| --- | --- | --- | --- | --- |
| `puja/smarta/08_durga_nitya_puja.txt` | `puja/smarta/19_durga_shodashopachara_puja.txt` | 249 | 44 | 205 |
| `puja/smarta/09_saraswati_nitya_puja.txt` | `puja/smarta/20_saraswati_shodashopachara_puja.txt` | 178 | 47 | 131 |
| `puja/smarta/10_subrahmanya_nitya_puja.txt` | `puja/smarta/21_subrahmanya_shodashopachara_puja.txt` | 174 | 49 | 125 |
| `puja/smarta/11_surya_nitya_puja.txt` | `puja/smarta/22_surya_shodashopachara_puja.txt` | 286 | 103 | 183 |

The Sūrya pair is the closest of the eight, and the reason is the **dvādaśārghya** — the twelve
offerings of water to the twelve Ādityas — which both rites carry at length.

Passages of these four that also stand elsewhere in the corpus, written from other sources:

- the fifteen ṛcs of the **Śrī Sūkta** distributed through `19` — as a continuous hymn in
  `devi/lakshmi/06_sri_suktam.txt`, and distributed the same way in `18`;
- the sixteen ṛcs of the **Puruṣa Sūkta** distributed through `22` — as a continuous hymn in
  `veda/taittiriya/01_purusha_suktam.txt`;
- the **four meditations of the Durgā Saptaśatī** in `19` — the Mahākālī dhyāna in
  `devi/durga_saptashati/01_madhukaitabha_vadha.txt` and `devi/durga/40_navarna_vidhi.txt`, the
  Mahāsarasvatī dhyāna in `devi/durga_saptashati/05_devi_duta_samvada.txt`, and the Durgā dhyāna
  in `devi/durga/42_rgvedokta_devi_suktam.txt`;
- the three verses of the **asking of pardon** in `19` and one of them in `20` — in
  `devi/durga/44_kshama_prarthana.txt` and `devi/durga/27_aparadha_kshamapana_stotram.txt`;
- **`या कुन्देन्दु तुषारहारधवला`** in `20` — in `devi/saraswati/01_saraswati_stotram_1.txt` and
  `devi/saraswati/19_saraswati_ashtottarashatanama_stotram.txt`;
- the **meditation of Subrahmaṇya** in `21` — in `Subrahmanya/43_subrahmanya_hrdaya_stotram.txt`
  and `Subrahmanya/04_subrahmanya_shodasanama_stotram.txt`;
- **`षडाननं कुङ्कुमरक्तवर्णं`** in `21` — opening
  `Subrahmanya/47_subrahmanya_stotram_nilakantha_vahanam.txt`.

None of these is a reason to retire a file. A hymn recited whole and the same hymn distributed
one ṛc to each service of a rite are catalogued separately by the tradition, and a manual that
sent the worshipper elsewhere for its own mantras would be unusable at the altar.

One near-miss worth recording so it is not mistaken for a duplicate later: `19`'s prayer verse
`या देवी मधुकैटभप्रमथिनी` is **not** the verse of the same shape in
`devi/main/13_amba_pancaratna_stotram.txt`, which reads `या देवी मधुकैटभासुररिपुर्या
माहिषध्वंसिनी`. They are two different verses on one pattern, not two readings of one verse.

## 2026-09-12 — verses shared by the four naimittika files and the rest of the corpus

Four files written this session carry verses that already stand elsewhere in the corpus. **None is
a reason to retire anything**: in every case one file recites the verse as part of its own rite and
the other holds it in a different work. They are recorded here so that a later session does not
mistake them for duplicates — and, more usefully, because in two of the five the sibling file's
source is a **different editorial lineage**, and so counts as a witness.

- **`त्र्यम्बकं यजामहे`**, the Mṛtyuñjaya, at `vidhi/samanya/03_bhasma_dharana_vidhi.txt` unit 6 —
  also cited in the header of `puja/smarta/05_shiva_nitya_puja.txt` (unit 33). The bhasma file
  collates it independently against the accented Taittirīya Saṁhitā 1.8.6, Āraṇyaka 10.56 and
  Brāhmaṇa 1.6.10.4, where the accent agrees mark for mark.
- **`चतुर्भुजे चन्द्रकलावतंसे`** at `vidhi/samanya/03` unit 8 — also
  `devi/dasamahavidya/15_tripurasundari_stotram.txt` (`कुङ्कुमराग शोणे`, agreeing) and
  `devi/syamala/01_syamala_dandakam.txt` (`कुङ्कुम राग श्रोणे`, differing in one letter).
  **All three are stotranidhi-sourced, so this is one lineage, not three**, and the bhasma file
  says so.
- **`गङ्गा गङ्गेति यो ब्रूयात्`** at `vidhi/samanya/04_karthika_snana_vidhi.txt` unit 5 — also
  `ganga/05_ganga_kavacam.txt`, which is sanskritdocuments-sourced from the **Brahmāṇḍa Purāṇa**.
  **That is a genuinely independent lineage**, and it is the only second witness the Kārtika file
  has for any of its verses. It reads `मुच्यते सर्वपापेभ्यो हरिसायुज्यमाप्नुयात्` against the
  Kārtika file's `मुच्यते सर्व पापाभ्यो विष्णुलोकं स गच्छति`. Neither file was altered.
- **`गुह्यातिगुह्यगोप्ता त्वं`** at `puja/smarta/23_mahaganapati_chaturavrutti_tarpanam.txt`
  unit 21 — also `devi/durga/40_navarna_vidhi.txt` (from the printed Gītā Press Saptaśatī, feminine
  `गोप्त्री ... देवि`, and its second line word for word the same) and
  `devi/varahi/03_vasyavarahi_stotram.txt` (feminine, ending `महेश्वरि`). Gītā Press *Nitya Karma
  Pūjā Prakāśa* prints a fourth form, masculine and ending `महेश्वर`. **The Gītā Press readings are
  independent lineages** and are the caturāvṛtti file's only second witness. Four forms of one
  verse; all four recorded, none reconciled.
- **The Mahāgaṇapati mūlamantra** `ओं श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वरवरद सर्वजनं मे वशमानय
  स्वाहा`, which is the spine of `puja/smarta/23`, also stands broken across the karanyāsa of
  `ganesha/11_trailokyamohana_ganapati_kavacham.txt`, identically. **Both are stotranidhi-sourced,
  so this is one lineage** and not a collation; the two files should be read together.

The eight verses of `navagraha/40_surya_grahana_shanti_shlokah.txt` are **not** duplicated anywhere
in the corpus. Their sources are given in that file: Matsya Purāṇa 67.9–16, and the Śānti-Kusumākara
and Bṛhaddaivajñarañjana nibandhas.

- **Five complete hymns stand inside `vidhi/taittiriya/04_mahanyasa_vidhi.txt` and are named there
  rather than printed.** The Mahānyāsa recites them in order as its sections 7.2 to 7.6: the
  **Puruṣa Sūkta**, the **Uttara Nārāyaṇa**, the **Apratiratha**, the **Prati Pūruṣa** and the
  **Śata Rudrīya**. Each is a standalone hymn that the tradition catalogues separately, so under
  the dedup rule the long text does not absorb them. **The Puruṣa Sūkta is already held** at
  `veda/taittiriya/01_purusha_suktam.txt`, and the two files now cross-reference each other in
  both directions; neither supersedes the other. **The other four are not yet in the corpus** in
  any form, and are worth writing from an accented Taittirīya source of their own rather than
  being lifted out of the Mahānyāsa's base text.
- **The Śivasaṅkalpa** occupies section 7.1 of the same file, at 39 verses. It circulates
  separately as a hymn in its own right and the corpus does not yet hold it as one. Should it be
  written separately, note that this file's copy follows the **Mysore 2007 printed order and
  extent**, which differs from the widely posted 37-verse form — two extra verses, two transposed
  pairs, and a shorter verse 13. The differences are set out in that file's Recension note.

- **Two classifications of the bath, and they are not the same classification.**
  `vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt` unit 1, from the Vaikhānasa
  *Āhnikāmṛtam*, divides the bath into gauṇa and mukhya and then divides the chief kind, the
  vāruṇa, into **six** by the occasion — nitya, naimittika, kāmya, kriyāṅga, malāpakarṣaṇa and
  kriyā. `vidhi/samanya/09_snana_bheda_bhasma_gomaya_mrittika_varuna_panchagavya.txt` unit 1,
  from Gītā Press and the *Dharmasindhu*, gives a **sevenfold** classification by the means used
  — māntra, bhauma, āgneya, vāyavya, divya, vāruṇa and mānasa. `vāruṇa` is the only term the two
  share, and it does different work in each. **Not a duplicate. Both stand, and neither
  supersedes the other.**
- **The verse of the five limbs of the bath** stands in two files, in two readings, from two
  editions. `vidhi/samanya/06_tungabhadra_pushkara_snana_sankalpa.txt` unit 1 opens with it from
  a Telugu Puṣkara booklet: `संकल्पः सूक्तपठनं मार्जनं चाघमर्षणं । देवादि तर्पणं चैव स्नानं
  पंचांगमुत्तमं ॥`. `vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt` unit 3 closes with
  it from the *Āhnikāmṛtam*, quoting it after Manu: `संकल्प सूक्त पठने मार्जनं चाघमर्षणं ।
  तर्पणं पितृदेवानां स्नानं पंचांगमुच्यते ॥`. The five limbs are the same five. The second half
  differs in two places. **This is a difference between editions and not a spelling**, so it is
  recorded in both files' recension notes and was **not** bracketed and **not** reconciled; the
  Puṣkara file was not altered.
- **`गंगेच यमुने चैव गोदावरि सरस्वति`** stands at unit 8 of
  `vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt`, where the worshipper draws a square
  on the water and calls the rivers into it during the bath itself.
  `vidhi/samanya/05_nadi_snana_sankalpa_ganga.txt` records that the verse was deliberately left
  out of that file, because its Gītā Press source puts the verse in the invocation of the waters
  into the kalaśa at a pūjā and not in the bath. **Both placements are correct, each in its own
  tradition**, and the two files now say so.

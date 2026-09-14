# Aṣṭottaraśatanāma (108) corpus — existence audit, 2026-09-08

Opens the 108-name workstream. The sahasranāma (1000) workstream is tracked separately and is
**out of scope here** — see `SAHASRANAMA_AUDIT_2026-09-07.md`.

This audit deliberately starts where the sahasranāma re-audit ended up, not where it started: the
2026-08-25 sahasranāma pass was built almost entirely on stotranidhi.com and undercounted by ~7x.
So it begins with the **Gītā Press** printed collection as the authority, and treats the web
indexes as a survey of what else exists — never as the verdict.

## Current corpus state

**Six 108-name texts are written**, as of 2026-09-08 — entries 1 to 6 of the forty, in the
volume's own order:

| # | File | Gītā Press pp. | Recension | Blocks | Distinct names |
|--:|---|---|---|--:|--:|
| 1 | `ganesha/30_ganapati_ashtottarashatanama_stotram.txt` | 11–14 | Gaṇeśa Purāṇa, Upāsanā-khaṇḍa | 19 + colophon | 107 |
| 2 | `shiva/30_shiva_ashtottarashatanama_stotram.txt` | 15–18 | Śāktapramoda | 19 + colophon | 108 |
| 3 | `Subrahmanya/49_kartikeya_ashtottarashatanama_stotram.txt` | 19–23 | Skanda Mahāpurāṇa, Māheśvara-khaṇḍa, Kumārikā-khaṇḍa | 22 + colophon | 106 |
| 4 | `shiva/31_batuka_bhairava_ashtottarashatanama_stotram.txt` | 24–35 | Rudrayāmala Tantra (`Āpaduddhāraṇa`) | 88 + colophon | 106 |
| 5 | `vishnu/26_vishnu_ashtottarashatanama_stotram.txt` | 36–39 | Padma Mahāpurāṇa, Uttara-khaṇḍa | 18 + colophon | 105 |
| 6 | `venkateswara/21_venkatesha_ashtottarashatanama_stotram.txt` | 40–47 | Varāha Purāṇa | 54 + colophon | **109** |
| 7 | `narasimha/21_lakshminrsimha_ashtottarashatanama_stotram.txt` | 48–51 | Nṛsiṁhapūjākalpa | 16 + colophon | 108 |
| 8 | `vishnu/27_hayagriva_ashtottarashatanama_stotram.txt` | 52–56 | Brahmāṇḍa Purāṇa | 22 + colophon | 111 of **114** |
| 9 | `dattatreya/21_dattatreya_ashtottarashatanama_stotram.txt` | 57–61 | Vāsudevānanda Sarasvatī (named author) | 25 + colophon | 107 of 108 |
| 10 | `rama/26_rama_ashtottarashatanama_stotram.txt` | 62–65 | Padma Purāṇa, Uttara-khaṇḍa | 19 + colophon | 107 of 108 |
| 11 | `hanuman/31_hanuman_ashtottarashatanama_stotram.txt` | 66–70 | *none stated* — compiled from an older nāmāvalī | 22 + colophon | 108 |
| 12 | `krishna/29_krishna_ashtottarashatanama_stotram.txt` | 71–75 | Padma Purāṇa, Uttara-khaṇḍa | 23 + colophon | **109** |
| 13 | `krishna/30_gopala_shatanama_stotram.txt` | 76–79 | Hara–Gaurī saṁvāda | 19 + colophon | **100** |

All thirteen were transcribed from the page images at 300–400 dpi, not from OCR, with the stotra and
its nāmāvalī paired in one file as the volume prints them. The other `Name count:` files are the
four sahasranāma flagships (Viṣṇu 1000, Śiva 1008, Mahāgaṇapati 1000, Lalitā 1000). Corpus total:
742 files.

**No two of the thirteen have the same shape, and the block counts above are the evidence.** Gaṇapati
is dhyāna + 18 verses of unbroken names; Śiva stops its names at v. 13 and gives five verses to a
phalaśruti; Kārtikeya wraps the names in a narrative frame (Viśvāmitra takes refuge, the god
answers) and prints twenty-two metrical units under twenty numbers. *Read `Sections:` and the
verse numbering off each text. Assume nothing from the last one.*

**Entry 4 breaks the page budget as well as the shape.** Baṭuka Bhairava runs twelve pages against
five for each of the first three, because Gītā Press prints the *whole rite* around it: a
dialogue frame and mantroddhāra, a deha-nyāsa and ṣaḍaṅga-nyāsa **in verse** naming the epithet
for each point of the body, **four** alternative dhyānas (सात्त्विक / राजस / तामस / स्वरूप), and
prose viniyoga and nyāsa formulas — and only then the thirty-verse stotra. It also carries **two
independent verse numberings** (prefatory 1–52, stotra restarting at 1–30), so a citation must
say which. *Budget by page count from the contents table, not by assuming five pages an entry;
and check for a second numbering before treating printed numbers as unique within a file.*

**Two mechanical faults found and fixed on 2026-09-08, both in the Devanāgarī→IAST generator.**
It passed `ॐ` and the Devanāgarī digits `०–९` through untransliterated, so `oṁ` and the verse
numbers appeared in Devanāgarī inside `iast:` lines. `Subrahmanya/49` (20 blocks) and
`shiva/31` (84 blocks) were affected and were repaired by regenerating every `iast:` block from
its `deva:`; `ganesha/30` and `shiva/30` predate the generator and were clean. **The standing
verification must include a check for Devanāgarī inside `iast:` lines, not only inside
`en:`/`tel:`/`hi:`** — that gap is why the fault survived two files.

**What the first file settled.** Three conventions, now fixed for the remaining thirty-nine:

- Rows print `श्री`, not the volume's `ॐ` (user, 2026-09-08). The divergence is stated in each
  file's `Source / recension`, not repeated in the rows.
- Only the printed dative + `नमः` form is recorded. The other three rites are described in the
  recension note; `पूजयामि`/`तर्पयामि` would need the accusative, which re-inflects 27 of the 108
  irregularly and is nowhere witnessed by the book.
- Anomalous readings are kept as printed and argued in the recension note, never emended. Two
  arose in the first file (nos. 92, 94) and both were checked at 400 dpi against the page image;
  one is a probable compositor's error, the other correct but unexpected. **`सहस्रपादे` recurred
  at `shiva/30` no. 104**, which corroborates it as the volume's regular dative of the root-noun
  `सहस्रपाद्` rather than a one-off slip — the kind of confirmation only a second file can give.
- The volume may inflect the same name differently in the verse and in the list (`शूलपाणिश्च`,
  `कपालिः` as i-stems in `shiva/30` vv. 2–3, but `शूलपाणिने`, `कपालिने` as in-stems in its
  nāmāvalī). Retain both as printed; do not harmonise one to the other. **Verify readings at
  400 dpi rather than from the page-image extract** — that resolution settles glyph questions the
  default extraction cannot.
- **The print's own verse numbers are not always a count of verses.** Kārtikeya numbers a bare
  hemistich as `॥ १ ॥` and then closes with a second hemistich carrying **no number at all**, so
  its printed run of 1–20 covers twenty-one metrical units. Give every printed line a block and
  say what the numbering does in the recension note; do not silently drop an unnumbered line or
  renumber the volume.
- **Expect repeated names, and count distinct ones separately.** `विश्वकर्ता` twice in
  `ganesha/30` (107 distinct); `महातेजस्` and `सनातन` each twice in `Subrahmanya/49` (106
  distinct). None is an error — the tradition counts slots, not lexemes.
- **A pair of names can look like a repetition and not be one.** `Subrahmanya/49` has `शत्रुघ्ने`
  (24) beside `शत्रुघ्नाय` (98): the first is the dative of the an-stem `शत्रुहन्` (v. 7
  `शत्रुहा`), the second of the a-stem `शत्रुघ्न` (v. 15). Likewise `भुवे` (29) and `भुवाय` (30)
  split `भूर्भुवो` across the stems `भू` and `भुव`, and it is that split which lets the sequence
  reach 108. Check the stem in the verse before calling two rows a duplicate.

## The divya-kṣetra stotras (entries 37–40) — resolved

These do **not** need a new file shape, which was the open question. The stotra pairs each place
in the locative with the name Śiva bears there, in the nominative — `कैवल्यशैले श्रीकण्ठः`,
`काशीपुर्यां विश्वनाथः`, `श्रीशैले मल्लिकार्जुनः` — under the opening declaration
*aṣṭottaraśataṁ bhūmau sthitaṁ kṣetraṁ vadāmyaham*. The nāmāvalī keeps both halves in a single
row, putting only the name into the dative: `ॐ कैवल्यशैले श्रीकण्ठाय नमः`.

So each row is still one string and fits the existing six-column shape unchanged — the `deva` and
`iast` columns carry the locative-plus-dative pair as printed, and the English column glosses it
as *name, at place* (e.g. "Viśvanātha, at Kāśī"). No seventh column, no separate genre file
format. What does change is editorial load: the English/Telugu/Hindi columns must identify 108
*places*, many of which are living temple sites, so these four are better written after the
thirty-six deity files rather than in TOC order.

## The anchor edition — Gītā Press, *Śatanāma Stotra Saṅgraha*

Gītā Press is the corpus's ultimate source (user, 2026-09-08), so this workstream is anchored on
a printed volume rather than on a crawl. **Śatanāma Stotra Saṅgraha**, Gītā Press code 1850, is
exactly the book this genre needs — its own subtitle reads *nāmāvalī-sahita devī-devatāoṁke
cālīsa śatanāma-stotra*: **forty śatanāma stotras, each printed together with its nāmāvalī**.

**Verified against the scan itself (2026-09-08)** — the user supplied the PDF, 226 pp., so the
contents below are read off the page images, not the OCR. Two corrections to what the OCR gave:

- The book has **three khaṇḍas plus a pariśiṣṭa**, not two. The nivedana (p. 4) states the plan:
  khaṇḍa 1 the devas and their avatāras, khaṇḍa 2 Śakti including the Daśamahāvidyās, khaṇḍa 3
  the *divya-kṣetra* stotras.
- Khaṇḍa 3 is **a different genre**: `aṣṭottaraśata-divyasthānīya-nāmastotram` — 108 *sacred
  places* of Śiva, Śakti, Viṣṇu and Brahmā, one name per kṣetra, not 108 epithets of the deity.
  The nivedana flags these as published here for the first time. They should not be filed as
  ordinary deity aṣṭottaras.

So the count resolves as **36 deity aṣṭottaras + 4 kṣetra stotras = the forty**, then 3 appendix
texts (41–43) outside the count.

### Complete contents (43 entries, from the scan)

*Khaṇḍa 1 — devas and avatāras (1–18)*

| # | Deity | Stated source | p. |
|--:|---|---|--:|
| 1 | Gaṇapati | Gaṇeśa Purāṇa | 11 |
| 2 | Śiva | Śāktapramoda | 15 |
| 3 | Kārtikeya | Skanda Mahāpurāṇa | 19 |
| 4 | Baṭuka Bhairava | Rudrayāmala Tantra | 24 |
| 5 | Viṣṇu | Padma Mahāpurāṇa | 36 |
| 6 | Veṅkaṭeśa | Varāha Mahāpurāṇa | 40 |
| 7 | Lakṣmīnṛsiṁha | Nṛsiṁhapūjākalpa | 48 |
| 8 | Hayagrīva | Brahmāṇḍa Mahāpurāṇa | 52 |
| 9 | Dattātreya | Vāsudevānanda Sarasvatī-kṛtam | 57 |
| 10 | Rāma | Padma Mahāpurāṇa | 62 |
| 11 | Hanumat | nāmāvalyanusāreṇa | 66 |
| 12 | Kṛṣṇa | Padma Mahāpurāṇa | 71 |
| 13 | Gopāla | saṅkalita | 76 |
| 14 | Viṭṭhala | Padma Mahāpurāṇa | 80 |
| 15 | Sūrya | Mahābhārata | 87 |
| 16 | Candra | nāmāvalyanusāreṇa | 91 |
| 17 | Śani | Bhaviṣya Mahāpurāṇa | 95 |
| 18 | Harihara | Skanda Mahāpurāṇa | 100 |

*Khaṇḍa 2 — Śakti, incl. the Daśamahāvidyās (19–36)*

| # | Deity | Stated source | p. |
|--:|---|---|--:|
| 19 | Kālī | Śāktapramoda | 105 |
| 20 | Tārā | Svarṇamālā Tantra | 110 |
| 21 | Ṣoḍaśī | Brahmayāmala Tantra | 115 |
| 22 | Bhuvaneśvarī | Rudrayāmala Tantra | 120 |
| 23 | Tripurabhairavī | Śāktapramoda | 125 |
| 24 | Chinnamastā | Śāktapramoda | 130 |
| 25 | Dhūmāvatī | Śāktapramoda | 135 |
| 26 | Bagalā | Viṣṇuyāmala Tantra | 139 |
| 27 | Mātaṅgī | Rudrayāmala Tantra | 144 |
| 28 | Kamalā | Śāktapramoda | 151 |
| 29 | Durgā | Viśvasāra Tantra | 155 |
| 30 | Sarasvatī | saṅkalita | 160 |
| 31 | Annapūrṇā | Śivarahasya | 164 |
| 32 | Gaṅgā | Mahābhāgavata Purāṇa | 168 |
| 33 | Sītā | Ānanda Rāmāyaṇa | 173 |
| 34 | Rādhā | Ūrdhvāmnāya | 178 |
| 35 | Reṇukā | Maharṣi Śāṇḍilya-kṛtam | 182 |
| 36 | Saubhāgyā | Tripurārahasya | 187 |

*Khaṇḍa 3 — divya-kṣetra stotras (37–40)*

| # | Text | Stated source | p. |
|--:|---|---|--:|
| 37 | Śiva-aṣṭottaraśata-divyasthānīya-nāmastotram | Lalitāgama | 193 |
| 38 | Śakti-aṣṭottaraśata-divyasthānīya-nāmastotram | Matsya Mahāpurāṇa | 198 |
| 39 | Viṣṇu-aṣṭottaraśata-divyasthānīya-nāmastotram | saṅkalita | 203 |
| 40 | Brahmā-aṣṭottaraśata-divyasthānīya-nāmastotram | Skanda Mahāpurāṇa | 209 |

*Pariśiṣṭa (41–43, outside the forty)*

| # | Text | Stated source | p. |
|--:|---|---|--:|
| 41 | Ardhanārīśvara-aṣṭottaraśatanāmastotram (stotrātmaka nāmāvali) | — | 215 |
| 42 | Kāśīstha-dvādaśāditya-nāmāni | Skanda Mahāpurāṇa | 223 |
| 43 | Prajñāvivardhanākhyaṁ Kārtikeya-stotram | Rudrayāmala Tantra | 224 |

Every entry from 1–40 is followed by its own nāmāvalī on the page given plus 2–4.

### What else the front matter supplies

The *Saṅkṣipta Prayoga-vidhi* (pp. 6–7) and nivedana (p. 5) give the editorial conventions, and
they bear directly on how nāmāvalī rows should be written:

- Each name is prefixed **oṁ** and put in the **caturthī** (dative) — the *sampradāna* case,
  giving "for the sake of X" — then closed with **namaḥ**. This corpus's `--- names ---` rows
  should follow the same shape.
- Gītā Press notes that women and the anupanīta substitute **śrī** for **oṁ**. **Corpus decision
  (user, 2026-09-08): use `śrī` for every nāmāvalī, without exception.** It is the universally
  admissible form — no adhikāra condition attaches to it — so a single form serves every reader
  and the files need no variant name lists. Note the divergence from the printed text in each
  file's `Source / recension` field: Gītā Press prints `oṁ`, this corpus prints `śrī`.
- Four modes of use are distinguished by the closing word: *namaḥ* (namana), *pūjayāmi* (pūjana),
  *tarpayāmi* (tarpaṇa), *svāhā* (havana). The book prints the *namaḥ* form throughout.
- Viniyoga, aṅga-nyāsa and dhyāna are given before each stotra where available.

Scan and OCR also on archive.org, id `20240905_20240905_1156`.

This settles two things the web sources could not:

- **The file-format question.** Gītā Press prints stotra and nāmāvalī *together*, per deity. So
  one corpus file per deity holding both is the publisher's own convention, not an invention —
  and the existing `Name count:` + `--- names ---` block already supports exactly that shape.
- **Provenance.** Every text carries a stated attribution, tabulated above — precisely what the
  sahasranāma audit found missing from the web sources.

**Priority follows this book.** Its forty are the first forty files; everything the web indexes
add beyond it is second-tier until a printed witness is found.

## What the web sources add — sanskritdocuments.org

The site keeps **two separate indexes**, and the distinction is the single most important thing
this audit found:

| Index | Texts |
|---|---:|
| `/sanskrit/ashtottarashatanama/` — the **stotra** (verse form, recited) | **231** |
| `/sanskrit/ashtottarashatanamavali/` — the **nāmāvalī** (the `namaḥ` list, used in archana) | **379** |
| **Total** | **610** |

For comparison, the same site holds 246 sahasranāma texts. **The 108 corpus is roughly 2.5x the
1000 corpus** — as expected: 108 names is a composable form that follows worship practice, while
1000 is a major undertaking reserved for deities big enough to warrant one.

The two forms are **not interchangeable and not paired**. The ratio is about 1 : 1.6, so a large
number of deities have the nāmāvalī published without the stotram, or the reverse. Any per-deity
"has a 108" verdict must say *which* form, and a file plan needs to decide whether the corpus holds
one, the other, or both.

Fetch note: sanskritdocuments returns **HTTP 406** to a bare `curl -A`; it needs an `Accept:
text/html` header. Worth recording — a 406 reads like a block and isn't one.

## Collating Gītā Press against stotranidhi — what the first two files show (2026-09-08)

Both written files were collated against stotranidhi.com after the fact. The result differs
sharply by text, and both outcomes are worth expecting again across the remaining thirty-eight.

**Gaṇapati — no counterpart exists.** stotranidhi carries five Gaṇeśa aṣṭottaras (plain, gakāra
×2, varada, vidyā) and none is the Gītā Press text. Its plain list opens `गजानन, गणाध्यक्ष,
विघ्नराज, विनायक`; the Gītā Press text (a Gaṇeśa Purāṇa extract from the sahasranāma) opens
`गणेश्वर, गणक्रीड, महागणपति, विश्वकर्ता`. **Two names shared out of 108** — different
compositions, not variant recensions. *Working expectation: where the Gītā Press attribution is
to a Purāṇa the web sources don't follow, the web "same-deity aṣṭottara" is often a different
hymn entirely. Check the opening names before assuming a collation is even possible.*

**Śiva — same text, five substantive divergences, all resolved for Gītā Press.** v. 10
`अहिर्बुध्न्यः` vs `अहिर्भुध्न्यः` (a plain corruption — the name is Vedic *Ahi Budhnya*);
v. 11 `अजपाशविमोचकः` as one name vs split into two, which changes how 108 is reached; v. 12
`प्रभुः` vs `हरिः`; v. 8 `गिरिधन्वा`/`गिरिधन्वी` and v. 3 `कपालिः`/`कपाली`, both stem-class.
stotranidhi also prints **only the thirteen name-verses** — no dhyāna, no phalaśruti — closing
with one substitute line, so it is a devotional excerpt, not a shorter recension.

**The decisive method.** At each of the first three points, Gītā Press's *nāmāvalī* independently
confirms its own *verse* reading (nos. 82, 90, 96). Because the volume prints the two as
separately typeset lists of one text, it can be checked against itself — a control no web source
offers, since stotranidhi publishes stotra and nāmāvalī as unrelated pages. **Run this check on
every file: any verse reading that the same volume's nāmāvalī does not corroborate is a
candidate error.** It is what caught the anomalous `सहस्रशीर्षे` at ganesha/30 no. 92.

Fetch note: stotranidhi's Devanāgarī pages live under `/hi/` with the slug `...-in-sanskrit/`,
and spell the word **`satanama`**, not `shatanama`. `curl` must follow redirects (`-L`) — an
unredirected request 301s, and the canonical URL without a language prefix resolves to Kannada.

## The count is not always 108 — entry 6

`venkateswara/21` is the first exception. Its nāmāvalī is numbered **continuously 1 to 109**,
its last line is `१०९ ॐ श्रीनिवासाय नमः`, and its own colophon still calls it
`अष्टोत्तरशतनामावलिः`. The stotra's v. 46 also claims 108. Verified at 500 dpi; there is no gap
in the numbering and **all 109 names are distinct** (the only file so far with no repetition at
all, where the others repeat two or three), so the surplus is a real extra name rather than a
doubling. It is retained: `Name count: 109`.

*Rule: count the printed rows and report that number. Never trim a list to reach 108, and never
trust the colophon's word over the numbering in front of you — the volume's own header, its
colophon and its numbering can disagree, and the numbering is the evidence.*

## Entry 6 also inverts the usual case relation

In entries 1–5 the stotra lists names in the **nominative** and the nāmāvalī re-inflects them
into the caturthī. In `venkateswara/21` the stotra is *already* in the caturthī with `नमः`
attached — v. 46 states it: `अष्टोत्तरशतं नाम्नां चतुर्थ्या नमसान्वितम्`. The hymn is a
namaskāra, so reciting it and performing the archana are one act. The practical gain: the
nāmāvalī and the stotra print the *same inflected forms twice*, which makes the internal
cross-check far sharper than usual — it caught four divergences, including a genuine misprint in
the list (no. 21 `अधिकन्या-` for the verse's correct `अब्धिकन्या-`, the ocean's daughter). Where
a text is built this way, expect to find list errors, and check every name against its verse.

## A conclusion reversed by the fifth file — `सहस्रशीर्षे`

`ganesha/30` no. 92 prints `सहस्रशीर्षे` where the stem `सहस्रशीर्षन्` requires `सहस्रशीर्ष्णे`.
That file's recension note originally called it "anomalous and possibly a compositor's error" —
the honest reading on one occurrence. **`vishnu/26` no. 48 prints the identical form**, in a
separately typeset nāmāvalī of an unrelated text in the same volume, verified at 500 dpi with no
`ण्`. Two independent occurrences make it the volume's consistent practice with this stem.
`ganesha/30`'s note has been corrected to say so, and to record that it was wrong.

The general lesson is the one `सहस्रपादे` already taught and this now confirms: **a form that
looks like an error on one occurrence is a hypothesis, not a finding.** Write it as a hypothesis,
name the alternative, and revisit when a later file in the same volume touches the same stem.
`सहस्रपादे` is now attested in four of the five files; `सहस्रशीर्षे` in two.

## Collision with the other thread — Durgā (entry 29)

The user's parallel thread wrote **`devi/durga/37_durga_ashtottarashatanama_stotram.txt`** on
2026-09-08, from the Gītā Press *Durgā Saptaśatī* page images, and its colophon gives the
**Viśvasāra Tantra**. Entry 29 of *Śatanāma Stotra Saṅgraha* (p. 155) is Durgā, Viśvasāra Tantra
— **the same work from a different Gītā Press volume.**

Do **not** write a second file when this workstream reaches entry 29. Treat code 1850 pp. 155ff.
as a genuine second printed witness and *collate* it into the existing file, recording the result
in that file's recension note. This is the first real second-edition collation available to any
aṣṭottara in the corpus; the first four rest on Gītā Press alone.

More generally: the other thread is now also producing aṣṭottaras. Before starting any entry of
the forty, check whether a file for that deity's aṣṭottara already exists on disk.

## Verified findings

- **Mīnākṣī has one.** `mInAkShI stotra aShTottara nAmAvali` is in the āvalī index. This
  contradicts the Stotra Ledger's standing note that the missing Mīnākṣī nāmāvalī was "a real gap
  in that sub-genre, not an oversight." It was a sourcing gap, on a site the corpus already
  crawls. The ledger note is corrected as of 2026-09-08.
- **Agni has both forms** — `agnyaShTottarashatanAmastotram` and `agnyaShTottarashatanAmAvaliH`,
  both attributed to Sāmba Dīkṣita. So the "Vedic deities have no 108" generalisation is wrong as
  stated; Agni is the exception that broke it.
- **Indra, Yama, Vāyu and Varuṇa have none** — checked case-sensitively (see the caution below).
  The apparent hits were all substring artifacts: `indrAkShI` is a Devī form, not Indra, and
  `pauShyamAsa` merely contains the letters of *yama*. This absence looks structural rather than
  accidental: these four never acquired the temple archana that the 108-name form serves.
- **Kubera is absent from both sanskritdocuments indexes** (zero occurrences). The Stotra Ledger
  separately records a Kubera Aṣṭottaraśatanāmāvalī on stotranidhi and a *distinct* one on
  vignanam — a good illustration that no single source settles a verdict.

## Caution carried forward — ITRANS is case-significant

A first pass at grouping the 610 texts by deity used case-insensitive regex and produced nonsense:
466 texts landed under "Daśamahāvidyā" because the pattern `tArA` matched the `ttara` inside
*aṣṭottara* once case was folded. In the ITRANS scheme these indexes use, **case carries the
diacritic** — `A` is ā, `I` is ī, `T` is ṭ, `S`/`Sh` is ṣ. Matching case-insensitively destroys the
transliteration. Never pass `re.I` over ITRANS slugs.

## Not done yet — the per-deity split

The 610 texts are **not** reliably grouped by deity in this pass. A case-sensitive regex grouping
left 269 of 610 unclassified, because the index uses inconsistent transliteration for the same
name (`kRRiShNa` / `kRiShNa`, `nRRisi` / `nRisimha` / `nRisinha`, `ga~NgA` / `gangA`, and some
entries titled in plain English). Rather than tune regexes further and publish a table that looks
authoritative and isn't, the grouping is left as the next step — it needs a normalising pass over
the transliteration variants, not more patterns.

What can be said now is only the aggregate: 610 texts, 231 stotra / 379 nāmāvalī, on one source.

## Next steps

1. Extract the forty texts from *Śatanāma Stotra Saṅgraha* — working from the page images the
   user supplied, which are legible enough to transcribe directly. These are the corpus's first forty 108-files, each
   holding the stotra and its nāmāvalī as Gītā Press prints them.
2. ~~Recover the 5 contents lines the OCR lost.~~ **Done 2026-09-08** — full 43-entry contents
   verified from the scan; see the table above.
3. Normalise the ITRANS variants and complete the per-deity grouping of the 610 web texts — as a
   map of what exists *beyond* the Gītā Press forty, not as a priority list.
4. Add stotranidhi.com and vignanam.org counts so no verdict rests on one source — Kubera already
   shows why.
5. Check whether Nitya Karma Pūjā Prakāśa and the Stotra Ratnākara volumes carry further
   aṣṭottaras not in code 1850.

## Entry 7 — the first collation that came from inside the corpus

Every entry so far has been checked against itself (stotra against nāmāvalī) and, where a web text
existed, against stotranidhi as a control. Entry 7 produced a different and better kind of check.
Its single dhyāna verse is the opening stanza of the **Lakṣmīnṛsiṁha Karāvalamba Stotram**, which
the corpus has held since 2026-09-05 as `narasimha/01`, transcribed from stotranidhi. So a verse
newly transcribed from the Gītā Press page image landed on top of a verse already on disk from an
independent witness — a collation with no extra fetching at all.

They differ at one syllable: Gītā Press `भोगीन्द्रभोगमणिरञ्जित-`, stotranidhi
`भोगीन्द्रभोगमणिराजित-`. Verified at 500 dpi. Both are good Sanskrit and both circulate widely —
*rañjita* "made lovely, coloured" against *rājita* "made resplendent", said of the same gems on the
same hoods. **The two files keep their own readings and cross-reference each other**, rather than
being harmonised: `narasimha/21` follows Gītā Press per the standing rule, `narasimha/01` keeps
stotranidhi and now carries a `Recension note:` recording the collation and stating plainly that
only verse 1 of its 25 has been collated.

**The operational point: check the corpus before treating a verse as un-collated.** A long text's
dhyāna, phalaśruti or embedded stuti is quite often already present somewhere as a standalone file
from a different source. That is a free second witness, and the dedup rule in `CLAUDE.md` already
tells us to look — it was written for whole works, but it pays off verse by verse too.

## Entry 7 also resets the low end of the range

At 16 blocks it is the shortest of the seven, against Baṭuka Bhairava's 88. There is no frame, no
viniyoga, no nyāsa, no speaker and no interlocutor: one dhyāna, fourteen name-verses, one
phalaśruti. It is also only the second entry with **no repeated name** — 108 distinct names in 108
slots, where entries 1–5 each repeat two or three. Veṅkaṭeśa managed no repeats too, but at 109
names; entry 7 is the first to hit the canonical 108 exactly, with the stotra and the nāmāvalī in
perfect order-for-order agreement. Its stated source is a **kalpa** (`नृसिंहपूजाकल्पे`), a ritual
manual, where entries 1–6 cite Purāṇas, a Tantra and a digest — the first of that kind in the run.

## Entry 8 — the count is 114, and this time it is not a slip

Entry 6 (Veṅkaṭeśa) printed 109 names under an `अष्टोत्तरशतनामावलिः` heading, and the audit
recorded that the surplus sat at the very end of the list, where a compositor could plausibly have
set a closing salutation as a numbered entry. Entry 8 rules that explanation out for itself.

The Hayagrīva nāmāvalī runs 1–114, continuously numbered, colophon still reading
`अष्टोत्तरशतनामावलिः`. Counting the nominatives in the **stotra** — a separately typeset list on
different pages — gives the same 114, in the same order, distributed 9-8-8-8-10-5-9-9-7-8-6-9-7-7-4
across vv. 2–16. The excess of six is spread through the hymn, not appended to it, and it is
attested twice. The text's own claim of 108 is made twice as well (vv. 17 and 18), which settles
what the claim is worth: **the title is a genre label, not a tally.**

Both counts stand as printed. `Name count:` is 114 here and 109 at entry 6. Three of the 114 repeat
— `शरण्य`, `विश्वगोप्ता`, `पुण्यकीर्ति` — and all three repetitions are in the stotra too, so 111
distinct names in 114 slots, and the repetition is the text's rather than the list-maker's.

**Running tally of what the volume actually prints, against its own titles:** 108, 108, 108, 108,
108, **109**, 108, **114**. Two of eight are not 108. The working rule stands and has now paid off
twice: count the printed rows, state both numbers, and never normalise to the famous one.

## Entry 8 also introduces two new block types

It is the first of the eight to open with a **prose viniyoga** (`ॐ अस्य श्रीहयग्रीवस्तोत्रमन्त्रस्य
संकर्षण ऋषिः …`) — entries 1–7 either had no viniyoga or, at Veṅkaṭeśa, had one in verse — and the
first to carry a **standalone mantra** between the dhyāna and the stotra, already in the dative.
Both get their own blocks and section labels, `विनियोगः` and `मन्त्रः`.

The viniyoga also names a ṛṣi, **Saṁkarṣaṇa**, and gives a bīja — `ऋं`, verified at 450 dpi. That is
not either of the bījas usually associated with Hayagrīva (`ह्सौं`, `ह्रीं`). It is recorded as a
printed reading and not emended. Stated as a hypothesis about its oddity, per the rule adopted after
the `सहस्रशीर्षे` reversal: an anomalous reading verified on the page is a reading, and the
explanation for why it is anomalous is a separate question that one witness cannot answer.

## The count is the story of this run — the tally after thirteen

What the volume actually prints, entry by entry, against its own headings:

| Entry | Deity | Printed | Heading says |
|--:|---|--:|---|
| 1–5, 7, 9, 10, 11 | Gaṇapati, Śiva, Kārtikeya, Baṭuka Bhairava, Viṣṇu, Lakṣmīnṛsiṁha, Dattātreya, Rāma, Hanumān | 108 | 108 |
| 6 | Veṅkaṭeśa | **109** | 108 |
| 8 | Hayagrīva | **114** | 108 |
| 12 | Kṛṣṇa | **109** | 108 |
| 13 | Gopāla | **100** | 108 |

**Four of thirteen are not 108, and they fail in three different ways.**

- **Entries 6 and 12 overrun by exactly one, at the closing verse.** Kṛṣṇa makes the pattern
  explicit in a way Veṅkaṭeśa did not: the last three names sit in the *first line* of v. 21,
  and the *second line* of that same verse is the claim `एवं श्रीकृष्णदेवस्य नाम्नामष्टोत्तरं
  शतम्`. The text asserts 108 in the same breath as its 109th name. Two independent instances of
  one shape now, which is enough to call it a shape rather than an accident.
- **Entry 8 overruns by six, spread through the hymn** — a different thing entirely, and
  attested twice over by two separately typeset lists.
- **Entry 13 runs UNDER, and is the only case where the text corrects its own heading.** The
  Gopāla list is 100, and the text says so three times: the stotra colophon (`शतनामस्तोत्रं`),
  the viniyoga (`शतनामपाठे विनियोगः`), and v. 14 (`नाम्नां शतं समासेन`). The running heads, the
  display titles and the nāmāvalī's colophon all call it `अष्टोत्तरशतनाम`. The disagreement is
  between the volume's **editorial furniture** and the **text's own statements**, and the file
  follows the text: it is titled and counted as a śatanāma.

**The working rule is now well tested and stands: count the printed rows, state both numbers,
never normalise to the famous one.** It has now been load-bearing four times. `Name count:` in
this corpus means what the page prints, not what the title claims.

## Entry 11 reverses the direction of dependence, and weakens our best check

The Hanumān stotra's colophon carries an asterisk leading to an editorial footnote:
`प्राचीन नामावलीके आधारपर संयोजित` — "compiled on the basis of an ancient nāmāvalī". It is also
the only entry of the thirteen whose colophon names **no source at all**: no Purāṇa, no Tantra,
no kalpa, no saṁvāda.

This matters methodologically. At every earlier entry the strongest evidence available was the
internal one: Gītā Press prints the stotra and the nāmāvalī as two separately typeset lists of
one text, so they can be checked against each other, and that check caught `सहस्रशीर्षे`, the
`अधिकन्या-`/`अब्धिकन्या-` misprint, and the 114 at Hayagrīva. **Where the volume tells us the
stotra was made from the nāmāvalī, that check collapses** — agreement then shows the compiler
copied accurately, not that two transmissions concur. Recorded in the file, and worth carrying
forward: check each entry's colophon for this footnote before leaning on the internal check.

## Entry 9 is the hardest text in the run, and three readings are left unresolved

`dattatreya/21` is the first entry with a **named, historically recent author** —
Vāsudevānanda Sarasvatī (d. 1914) — and its closing verse declares it **mantra-garbha**:
`मस्करीशोमनुस्यूतः`, "strung through with the *manu* of the lord of ascetics". The names are
therefore built to carry syllables as much as sense, and several (nos. 78 `मश्रिये`, 91
`मस्थाय`, 92 `मसुबन्धवे`) are little more than syllable-carriers. No attempt was made to extract
the embedded mantra; that needs a commentary.

Three readings were rendered at up to 900 dpi and **still could not be settled**, and are
transcribed as printed rather than emended: no. 4 `ऐन्द्र्यद्ध्र्या ओजसे` (sense wants
`ऐन्द्र्या ऋद्ध्या`), no. 22 `वदद्ब्रेण्य-` (sense wants `वदद्वरेण्य-`, but the `द्ब्र` conjunct
is unambiguous on the page and identical in both the stotra and the nāmāvalī), and no. 26
`अद्व्वरसद्म-` (expected `अध्वरसद्म-`). **These are exactly the cases a single witness cannot
decide**, and they are the strongest argument yet in this workstream for finding a second
printed edition of code 1850.

## Outstanding — a separate work found inside entry 11

Printed in a box on p. 68, inside the Hanumān entry, is the **Hanumān Dvādaśanāma Stotra**
(`हनुमानञ्जनीसूनुर्वायुपुत्रो महाबलः …`), attributed to the **Ānanda Rāmāyaṇa**, with its own
phalaśruti and Hindi gloss. It is a complete work in its own right and is **not** part of the
aṣṭottara; it was deliberately left out of `hanuman/31` rather than folded in. It should be
written as its own file in `hanuman/`. Logged here so it is not lost.

## Appended 2026-09-12 — the volume is complete

All **forty** numbered entries of code 1850 are now written, and so are the **three appendix
pieces** that follow them. The "Current corpus state" table above is a snapshot of 2026-09-08
(entries 1–13) and was not kept current; it is left as it stands. Written since, by entry:

| Entries | Files |
|---|---|
| 14–18 | `krishna/35` (Viṭṭhala), `navagraha/*` (Sūrya, Candra, Śani), `shiva/32` (Harihara) |
| 19–28 | `devi/kalika/19` (Kālī) and `devi/dasamahavidya/32–40` (the other nine Mahāvidyās) |
| 29–32 | `devi/durga/50`, `devi/saraswati/19`, `devi/annapurna/09`, `ganga/17` |
| 33 | `rama/30` — Sītā (Ānanda Rāmāyaṇa); **single witness, Gītā Press alone**, user-approved |
| 34–36 | `krishna/36` (Rādhā), `devi/main/43` (Reṇukā), `devi/lalita/38` (Saubhāgya) |
| 37–40 | `shiva/33`, `devi/main/44`, `vishnu/29`, `brahma/14` — the four divyasthāna lists |
| appendix | `shiva/34` (Ardhanārīśvara), `navagraha/38` (Kāśī twelve Ādityas), `Subrahmanya/53` (Prajñāvivardhana Kārtikeya) |

Notes worth carrying forward:

- **The divyasthāna four went as this document predicted** (see "The divya-kṣetra stotras" above):
  no new file shape, the locative-plus-dative pair kept in one row, English glossed *name, at place*.
  Places are transliterated as printed and **not** identified with modern temple sites.
- **Printed counts that are not 108**, all retained as printed and explained in each file: Śiva
  divyasthāna **100**, Śakti divyasthāna **108**, Viṣṇu divyasthāna **112**, Brahmā divyasthāna
  **100**, Saubhāgya **100**, Sītā **111**, Rādhā **110**, Reṇukā **111**, Ardhanārīśvara **218**
  (109 couplets of two names).
- **Saubhāgya (entry 36) is the one case where Gītā Press looks short.** Its nāmāvalī gives 100
  under a 108 title, and the sanskritdocuments witness has two half-verses Gītā Press does not
  print, carrying seven of the missing names. Worth checking against a second printing of code
  1850 if one is ever found — the same argument as the Sūrya-entry conjuncts above.
- **Entry 29 (Durgā)** was written as `devi/durga/50` despite the "do not write a second file"
  note above, with an additive cross-reference in `devi/durga/37` and an entry in
  `DEDUP_AUDIT.md`. The two are the same Viśvasāra Tantra text from two Gītā Press volumes.
- **Still outstanding from this volume:** the Hanumān Dvādaśanāma Stotra in the box on p. 68,
  logged in the section just above. It is the last unwritten piece of code 1850.

## Appended 2026-09-12 (later) — nothing from code 1850 is outstanding

The Hanumān Dvādaśanāma Stotra in the box on p. 68 has been written as
`hanuman/34_hanuman_dvadasanama_stotram.txt` (4 verses, 12 names, no nāmāvalī — the print gives
none). **The volume is now complete**: forty numbered entries, three appendix pieces, and this
boxed stotra.

Three things about it worth keeping:

- **The print's attribution checks out.** The box carries no Sanskrit colophon and no title; the
  only source given is `[आनन्दरामायण]` at the end of the Hindi note. The text was found there:
  **Ānanda Rāmāyaṇa, Manoharakāṇḍa, sarga 13, vv. 8–11**, in the Rāmateja Pāṇḍeya `Jyotsnā`
  edition (archive.org `srimad-ananda-ramayana`). It agrees with Gītā Press word for word.
- **The independent witness differs in six places, and loses on all six.** sanskritdocuments
  `Anjaneya12.itx` (a South Indian line, its paired nāmāvalī from the *Hanumatstutimañjari*)
  reads `अञ्जनासूनुः`, `फल्गुन-`, `-विनाशकः`, `द्वादशैतानि`, `स्वापकाले पठेन्नित्यं यात्राकाले विशेषतः` and
  `तस्य मृत्युभयं नास्ति सर्वत्र विजयी भवेत्`, and stops before `राजद्वारे गह्वरे च भयं नास्ति कदाचन`.
  The Purāṇa reads with Gītā Press at every one of those points, including the line the other
  witness lacks. This is the cleanest case in the volume of the authority rule being confirmed
  rather than merely asserted.
- **It sits next to the Hanumat Kavaca, not inside it.** The kavaca at
  `hanuman/26_hanumat_kavacam_ananda_ramayane.txt` is the rest of that same Purāṇa chapter, and
  its viniyoga takes four of its five elements from these twelve names (`मारुतात्मजेति बीजं`,
  `अञ्जनीसूनुरिति शक्तिः`, `लक्ष्मणप्राणदातेति कीलकं`, `पिङ्गाक्षोऽमितविक्रम इति मन्त्रः`). No text
  overlaps, so this is a cross-reference and not a `DEDUP_AUDIT.md` case. Additive
  cross-references were added to `hanuman/26` and `hanuman/31`; both diffs are two added lines
  and nothing else.

### And it settled entry 33 as well

Searching the Ānanda Rāmāyaṇa for the Hanumān verses turned up the **Sītā Aṣṭottaraśatanāma
Stotra** in the same volume — **Manoharakāṇḍa, sarga 14, vv. 35–59** — viniyoga, both nyāsas,
dhyāna, all the names and the phalaśruti. `rama/30_sita_ashtottarashatanama_stotram.txt` was
written earlier the same day from Gītā Press alone, with the user's approval, because no witness
could be found. **It now has one, and the two agree at every verse.** Its header has been
updated to record the collation; **not one character of its text changed**, and a diff of the
verse blocks confirms it.

Two things the witness settled:

- **Where the 111 comes from.** That edition's commentary numbers the same names **1–108**. It
  does not count `वरा` (v. 16) as a name, and it counts v. 17 `दिव्यचन्दनसंस्था श्रीर्मूलकासुरमर्दिनी`
  as one name where Gītā Press's nāmāvalī makes three. Those are the only three splits:
  111 − 3 = 108. So the printed 111 and the stotra's own `एवमष्टोत्तरशतं` are not in conflict.
- **One reading left open.** v. 13 Gītā Press `रामवामाङ्कसंस्था` ("on Rāma's lap") against that
  edition's apparent `रामवामाङ्गसंस्था` ("at Rāma's left side"). One letter, and the witness is an
  OCR — enough to locate a disputed reading, not to settle one. Gītā Press stands.

**The general lesson, worth carrying to other entries:** where a Gītā Press entry names a Purāṇa
in its colophon, the Purāṇa itself may be on archive.org in a commentarial edition with a
`_djvu.txt` OCR beside it, and that is a real independent witness. `srimad-ananda-ramayana`
carries the whole Ānanda Rāmāyaṇa. "No witness found" should mean the *source named in the
colophon* was looked for and not found, not only that the stotra collections were searched.

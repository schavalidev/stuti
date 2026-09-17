# Authoring queue — resumable, batch-driven

Created 2026-08-25. This is the operational queue that turns `PROJECT_TRACKING.md` /
`OTHER_DEITIES_TRACKING.md` / `devi/REMAINING_STOTRAS_TRACKING.md` (research-only, titles and
sources, no verse content) into actually-written files. Read this file first in any authoring
session — it tells you exactly what to write next and where the corpus stands.

## The rule

**Check off a title's `[ ]` only after its file is written to disk, verse text was pulled from
a real fetch of the source page (not recalled from memory), and it matches this corpus's format
(see "File format" below).** Check it off immediately per-title, not at the end of a batch —
that way the checkbox state is always the true state, even if a session gets cut off mid-run.

**Round 1 (below) takes priority over Round 2.** Round 1 = every currently-zero-coverage
section gets its first 3-5 titles, so the app has *something* from every deity. Don't start
Round 2 items until Round 1 is fully checked off, unless a Round 1 title turns out to be
unsourceable (dead link, page removed) — skip it with a `[SKIPPED: reason]` note and move to
the next Round 1 item rather than blocking.

**Session budget:** stop authoring once you judge the session is at ~70-75% of comfortable
capacity — leave headroom to write a clean session-log line (below) rather than getting cut off
mid-file. Partial progress is fine; the checkboxes carry state forward.

**No questions mid-run.** If a title is ambiguous or a source is unreachable after the fallback
chain, skip it with a note and continue — don't stop the run to ask.

## Sourcing chain

**Revised 2026-09-08 — the old chain treated stotranidhi.com as "primary". It is not the
authority and must never be the only source. See `CLAUDE.md` at the repo root for the full
rule; the short form is below.**

1. Fetch a **base text** to transcribe from — stotranidhi.com is fine for this, being
   well-formed and easy to parse. If it 403s through WebFetch, retry via `curl` with a browser
   User-Agent header; that works and is not a failure. Fall back to the Wayback Machine
   (`web.archive.org/web/2023*/<url>`) only if curl also fails.
2. Fetch **at least one genuinely independent edition** and collate the whole text against it,
   verse by verse, before writing anything. Independent means a different editorial lineage —
   the same site in another script is one witness, not two. Preference order:
   (a) **Gītā Press, Gorakhpur — the ultimate source** (user, 2026-09-08). Where a Gītā Press
   edition exists it is the authority, not one option among several. Reach it through
   archive.org (`creator:"Gita Press"`); each item carries a `*_djvu.txt` OCR beside the PDF,
   fetched via the `server` + `dir` fields from `archive.org/metadata/<id>` — the plain
   `/download/` path 404s on these items' Devanāgarī filenames. Treat the OCR as needing
   verification, and a missing entry as an OCR gap rather than an absence;
   (b) scholarly digital editions — **GRETIL** (`gretil.sub.uni-goettingen.de`, IAST and
   verse-numbered), Muktabodha, TITUS, critical editions;
   (c) other independent corpora — sanskritdocuments.org, vedicscriptures.github.io,
   github.com/gita/gita, vignanam.org.
3. Adjudicate every disagreement against the mainstream commentarial vulgate for that text and
   record the decision in the file's `Recension note`. Never silently prefer one witness.
4. State in `Source / recension` exactly which witnesses were compared and how independent they
   really are. If the only cross-check available was the same site in another script, say that
   in those words — do not let it read as a real collation.
5. If a text is genuinely unreachable: mark `[SKIPPED: unreachable — <url>]` and move on.
   **Never reconstruct verses from memory.**

Titles marked **VERIFIED** below were already fetched and spot-checked in prior research
sessions — still re-fetch the full text before writing (research only confirmed the page
exists and is genuine, not that every verse was transcribed).

### Vrata vidhāna — a different chain, and a Telugu one (measured 2026-09-12)

**The reader for this genre is a South Indian, Telugu worshipper** (user, 2026-09-12). That decides
the chain below. It is not a preference about scripts. A vrata is a rite someone performs, so an
edition from another region is an edition of a different observance, and the base text has to come
from the tradition the reader actually keeps.

**Two tiers of the standing chain are empty here, and this was measured rather than assumed.**

- **Gītā Press does not publish vrata vidhāna.** `creator:"Gita Press"` returns three vrata items,
  all *Vrat Paricay*; the best copy, `vrata-parichaya`, holds 465,115 Devanāgarī characters with
  **zero** Latin OCR noise, and is a Hindi month-by-month calendar whose kathās are Hindi prose. It
  carries no saṅkalpa and no Sanskrit pūjā-krama. *Nitya Karma Pūjā Prakāśa*
  (`nitya-karma-puja-prakash-gita-press-gorakhpur`) holds **15 occurrences of व्रत in 370,963
  Devanāgarī characters**, and the only substantive one is a back-matter advertisement for code
  1367. Gītā Press's vrata publishing is Hindi kathā booklets — codes 1367, 1162, 2217.
  This does not contradict the authority rule, it satisfies its own clause: `CLAUDE.md` says to use
  another printed edition **where Gītā Press has not published the text**. Here it has not.
- **GRETIL has none of the vrata nibandhas.** No Nirṇayasindhu, Dharmasindhu, Hemādri, Vratarāja,
  Vratārka. Nearest is Mitramiśra's *Vīramitrodaya: Samayaprakāśa*. **One trap:** GRETIL's
  `Nityakarmapujavidhi` is a **Buddhist** text from the Sanskrit Buddhist Canon Input Project, and
  its title makes it look like exactly what this corpus wants.

#### Grade and base text are two different measurements — decided (user, 2026-09-12)

`reference/vrata_parva_master_reference.md` carries an A-to-E evidence policy. It grades primary
śāstra A, the classical nibandhas B, and an identifiable regional vrata or nomu publication D.
Read beside the tiers below, it looks like a contradiction: the grade ladder ranks the nibandha
above the Telugu print, and these tiers do the reverse.

**Both stand. They answer different questions.**

- **A grade measures how much weight a claim carries.** It governs what may be said about a
  vrata — textually attested, recognised within a named sampradāya, or living regional practice.
- **The tier decides which edition supplies the base text.** It governs what is transcribed.

Two working consequences:

1. **A low grade is not a reason to change the base text.** Where `Āru Vratālu` is the only
   edition the reader's own tradition prints, it stays the base text at grade D, and the file
   says in its editorial fields that the attestation is regional.
2. **A high grade does not promote a witness to base text.** Vratarāja carries most of this
   queue at grade B and is still a Bombay and Pune lineage. It settles a doubtful reading and
   supplies a kathā in Sanskrit. It does not supply the rite.

#### Tier 1 — the Telugu prints. Take the base text from here.

| source | archive.org id | text layer |
|---|---|---|
| **Āru Vratālu**, Paṇḍita Pariṣkṛtamu, Rajahmundry 1999, Gollapudi Veeraswamy Son | `snmc-aaru-vratalu-pandita-parishkrutamu-telugu-and-sans` (second scan: `nkoi-aru-vratalu-pandita-parishkritamu-telugu-and-sansk`) | 97,850 Telugu, **clean** |
| **Vratha Ratnākaram** vol. 1 | `VrathaRathnakaramu1` | 126,949 Telugu, garbled |
| **Vratha Ratnākaram** vol. 2 | `VrathaRatnakaramu2` | 365,404 Telugu, garbled |
| Per-vrata booklets, same house | `xwcq-mangala-gauri-vratam-by-sannidhanam-narasimha-sarm` (1998), `SreeVaralakshmiVrataKalpamu`, `VINAYAKAVRATAKALPAMUVRATARATNAKARAMU` | Telugu, mostly garbled |

**`Āru Vratālu` is the best base text found for this genre, and the reason is its date.** It is a
1999 print, not a lithograph, so the Telugu OCR is genuinely clean — `గంధం: కర్పూరాగరుకస్తూరీ
రోచనాదిభిరన్వితం` and `ఉత్తమం గణనాథస్య వ్రతం సంపత్కరం శుభం` come out correct. Its Sanskrit is
printed **in Telugu script**, which is what this audience reads, and it includes the practical
apparatus a vrata needs: the list of articles to assemble, and the **toram** for Varalakṣmī and
Kedāreśvara. Two independent scans of it exist. Its six vratas, from its own table of contents:

1. Vināyaka · 2. Sarasvatī · 3. Varalakṣmī · 4. Ananta Padmanābha · 5. Kedāreśvara · 6. Ratha Saptamī

Four of those are already on the queue below. Sarasvatī and Ratha Saptamī are additions to it.

**The two Vratha Ratnākaram volumes are the coverage map, not a transcription source.** Between
them they carry the wider Telugu vrata canon — vol. 1 Vināyaka, Sarasvatī, Varalakṣmī, Kedāreśvara,
Ananta, Anagha; vol. 2 Satyanārāyaṇa, Ananta, Maṅgaḷa-Gaurī, Ṛṣi Pañcamī, Śravaṇa Dvādaśī,
Tulasī-pūjā — but the OCR is early-twentieth-century and badly broken (`శ్రీవినాయకృవృతము`,
`బుషివం చమిా` for `ఋషిపంచమి`). Use them to find which vrata sits where, then read the page images.


##### `Āru Vratālu` mapped line by line, so the authoring session does not re-derive it

Fetched and indexed 2026-09-12 from `snmc-aaru-vratalu-pandita-parishkrutamu-telugu-and-sans`
(97,850 Telugu characters, 4,365 lines in the `_djvu.txt`). Line numbers are that file's.

| vrata | vrata-kalpa | kathā, Sanskrit | kathā, Telugu | ends |
|---|---|---|---|---|
| Vināyaka | 189 | **684** `అథ కథాప్రారంభః (మూలము)` | 757 | 874 |
| Sarasvatī | 893 | none marked | 1382 | 1491 |
| **Varalakṣmī** | 1494 | **1823** `అథ కథాప్రారంభః` | 1892 | 2020 |
| **Ananta Padmanābha** | 2035 | **2610** `అనంతవ్రత కథారంభము (మూలము)` | 2783 | 3043 |
| **Kedāreśvara** | 3055 | **3491** `కేదారేశ్వర వ్రత కథారంభః (మూలము)` | 3636 | ~3820 |
| Ratha Saptamī | 3822 | **4076** `రథసప్తమీ వ్రతకథారంభః` | none marked | 4298 |

**The finding that matters: five of the six kathās are printed in Sanskrit as well as Telugu**,
the Sanskrit marked `(మూలము)`, "the original". This closes the gap recorded above against
`puja/smarta/14_vinayaka_chaviti_vrata.txt`, which states that no Sanskrit of the Vināyaka kathā
was found and that none was invented. That file is another session's and **is not to be edited** —
but a Vināyaka vrata written from `Āru Vratālu` would carry the Sanskrit kathā at line 684, and
the two files would then record a real difference between witnesses rather than a defect.

**The toram apparatus is located too**, which is the practical part a vrata file needs and which
the nibandhas do not give in this form:

- Varalakṣmī — `అథ తోరగ్రంథి పూజా` 1795, `తోరబంధన మంత్రం` 1806, with the Telugu direction at 1811
  that the mantra is recited while the toram is tied.
- Ananta — `తోరస్థాపనం` 2181, `తోరగ్రంథి పూజా` 2487, `తోరబంధనం` 2553–2590.
- Kedāreśvara — `తోరబంధన మంత్రం : ఆయుష్యం విద్యాం చ తథా సుఖం చ` 3467.

Kedāreśvara's pūjā also carries `ఓం కేదారేశ్వరాయ నమః ఏకవింశతిగ్రంథిం పూజయామి` at 3416 — the
worship of the **twenty-one knots**. That matches the twenty-one-day form independently, and it
is why this vrata must be stored with its duration stated rather than flattened to the one-day
Dīpāvali form now commonly kept.

**Latin OCR noise is 9,904 characters and it sits in the running headers**, not in the verse —
`26 CC-O. In Public g y i వరలక్ష్మీ వ్రతము` is a page header, not a corrupt line. Strip lines
carrying Latin before collating, rather than treating them as damage.

#### Tier 2 — the South Indian Sanskrit nibandha, for the date and not for the rite

**Smṛtimuktāphala** of Vaidyanātha Dīkṣita, `smritimuktaphalam` — **2,186,056 Devanāgarī
characters, zero Latin noise**, the largest and cleanest Sanskrit nibandha text located in either
round. It is the southern counterpart of Nirṇayasindhu. **Be accurate about what it is:** it holds
249 scattered occurrences of व्रत and **no vrata-kāṇḍa**, so it is an authority on *when* a vrata
falls, not on how it is performed. And do not label it Āpastamba-based — measured, it cites
**Kātyāyana 189 times against Āpastamba 79**.

#### Tier 3 — the Northern and Deccan nibandhas, as witnesses only

**Never as base text.** Vratarāja is the standard compendium of the genre and covers most of the
queue — Siddhi-Vināyaka, Saṅkaṣṭa Caturthī, Kedāreśvara, Ṛṣi Pañcamī, Nāga Pañcamī, Varalakṣmī and
Ananta all confirmed present by grep — but it is a Bombay and Pune lineage, and building a Telugu
reader's rite on it would hand them an observance they do not keep. Consult it to settle a doubtful
reading or to find a kathā in Sanskrit. Record it as a witness and say so.

| source | archive.org id | text layer |
|---|---|---|
| **Vratarāja** of Viśvanātha, Pune 1892 | `yrym_vrata-raja-by-vishvanath-sharma-edited-by-bhikushastri-hardikar-sanskrit-an` | 1,476,612 deva, 12,070 Latin |
| **Vratarāja**, Khemraj, Mumbai 1897 | `onfy-vrataraja-by-vishvanatha-sharma-sanskrit-dharmasha` | 1,001,367 deva, 18,923 Latin, plus a `_text.pdf` |
| **Hemādri, Caturvarga-cintāmaṇi, Vrata-khaṇḍa** | `chaturvargachintamanihemadriyajneshvarasmrtiratnakamakhyanathatarkaratnavol2part1vrataasiatic_2_252_x` | 901,725 deva, **0 Latin, word-spaced** |
| **Dharmasindhu**, Nirnaya Sagar 1888 | `dharmasindhubykashinathupadhyaya1888nirnaysagarpress_498_a` | 783,676 deva, 0 Latin |
| **Nirṇayasindhu**, Chowkhamba 1930 | `zajy-nirnayasindhu-with-commentary-of-krishnam-bhatta-b` | 894,696 deva, 85,876 Latin, garbled |

Hemādri's Vrata-khaṇḍa is the best-decodable of these — zero Latin noise, genuinely word-spaced
Bibliotheca Indica typesetting — and the oldest, thirteenth century.

**Satyanārāyaṇa is absent from all four nibandhas.** That is a real absence, not an OCR miss: it is
a late devotional vrata, later than Hemādri, attributed to the Skanda Purāṇa Revā-khaṇḍa. Its
witnesses are that Purāṇa, Gītā Press code 1367, Vratha Ratnākaram vol. 2, and the Telugu and
Śrīvaiṣṇava prints — `srisatyanarayana023975mbp` is a Vānamāmalai Varadācāryulu recension.


#### The twelve planning priorities, source-hunted — measured 2026-09-12

`reference/vrata_parva_master_reference.md` §16 lists twelve content priorities. Five already had
a source in the tiers above. The other seven were hunted on archive.org in Telugu script and in
transliteration. **Three are now sourced, one is sourced but image-only, and three were not found
at all.** Every text layer below was fetched and counted, not estimated.

| priority | result | source |
|---|---|---|
| **Undrālla Taddi** | **found, clean** | `atla-tadiya-w`, ll. 444–517 |
| **Kārtika lamp and Dāmodara** | **found, clean** | `20230904_20230904_1040` — కార్తీక పురాణం |
| **Pōlāla Amāvāsya** | kathā found, OCR degraded | `in.ernet.dli.2015.331462` — నోములు కథలు, 1947 |
| **Pithori** | found, **image only** | `india.history.resource.16912` — पिठोरीव्रतकथा, स्कन्दपुराण, 1711 |
| Kalyāṇa Gaurī Nomu | **not found** | — |
| Sapta Śanivāra | **not found** | — |
| Ekādaśa and Ṣoḍaśa Somavāra | **not found**; Thursday analogue located, garbled | `in.ernet.dli.2015.333459` |
| Ayyappa, Bhavānī, Hanumān, Govinda Māla dīkṣās | **not found** | — |

**`atla-tadiya-w` is the find of this round, and its catalogue title is wrong.** It is listed as
*అట్ల తదియ నోము*, but the book is **చంద్రోదయ గౌరీ వ్రతము** and it carries three things:

| lines | content |
|---|---|
| 1–441 | the complete pūjā vidhāna — ācamana, saṅkalpa, kalaśārādhana, dhyāna, a fifteen-name aṅga-pūjā, the nāmāvaḷi, ṣoḍaśopacāra, closing at `పూజా విధానం సంపూర్ణం` |
| 444–517 | **ఉండ్రాళ్ళ తదియ కథ**, complete, with its udyāpana, closing at `సంపూర్ణము` |
| 520–end | **చంద్రోదయ గౌరీ అట్లతదియ కథ** |

15,834 Telugu characters against 9 Latin. The OCR is genuinely clean — the saṅkalpa reads
`జంబూద్వీపే భరతవర్షే భరతఖండే మేరో: ... కృష్ణాగోదావర్యోర్మధ్యదేశే` and the kalaśārādhana
`కళశస్యముఖే విష్ణు కంఠే రుద్ర స్సమాశ్రిత:` without repair. The slips are the known ones —
`బుగ్వేదో` for `ఋగ్వేదో`, the same ఋ→బు substitution recorded above. **So this single item
supplies a base text for two observances at once:** Undrālla Taddi, which is priority 2, and Aṭla
Taddi, which the index already holds as *Aṭla Tadiya (Candrōdaya Umā Vratam)*.

**`20230904_20230904_1040` — కార్తీక పురాణం, clean.** 83,708 Telugu characters against 68 Latin.
Its table of contents and its Śiva Pañcākṣara Stotram both decode without repair
(`నాగేంద్రహారాయ త్రిలోచనాయ భస్మాంగరాగాయ మహేశ్వరాయ`). This is the Kārtika māhātmya, so it is the
source for the month's observances. **It is not a vrata-kalpa**, so it will give the lamp
offering and the Dāmodara worship their setting and their kathā, not a saṅkalpa.

**Pithori is Western, and the document is right to keep it apart from Pōlāla Amāvāsya.** The hunt
found no Telugu Pithori text at all. What it found is a Sanskrit *पिठोरीव्रतकथा* attributed to
the Skanda Purāṇa, and three Marathi prints — `YEva_m-963-pithori-vrat-puja-sartha-katha-…`,
`PithoriAmavasya-Marathi-Nbt`, `agt-5-nbtm-m-amavasya-2ab616`. That is a different editorial
lineage and a different language community from Pōlāla Amāvāsya, which is Telugu. **Do not merge
them, and do not fill either from the other.**

**The Skanda Purāṇa Pithorī kathā is a page-image source.** `india.history.resource.16912` is a
1711 manuscript. It yields **1,918 Devanāgarī characters, entirely garbled** — `दु शयिद्विकायोहेकयाोसे…`
is not recoverable text. It witnesses that a Sanskrit kathā of this vrata exists and is old. It
does not supply one. Same shape as the Revā-khaṇḍa Satyanārāyaṇa trap recorded above: print date
predicts decodability, and a 1711 handwritten scan decodes to nothing.

##### Further Telugu items located, with what each is actually worth

| archive.org id | what it is | text layer | use |
|---|---|---|---|
| `in.ernet.dli.2015.331462` | నోములు కథలు, 1947 — a Telugu **nomu kathā collection** | 105,348 Telugu, 541 Latin, **degraded** | the coverage map for the nomu genre; carries పోలాల ×4 and పోలేరమ్మ ×1 |
| `20250826_20250826_0853` | **శ్రీ షోడశగౌరీ తదియ నోము కథ**, subtitled **స్వర్ణగౌరీ పూజ**, Rāḷḷabaṇḍi Pāṇḍuraṅgaśarma, Śrī Gāyatri Devālayam, Secunderabad | 8,994 Telugu, 36 Latin, **clean** | the Svarṇa Gaurī / Hartalika observance in Telugu |
| `in.ernet.dli.2015.333459` | ఏకాదశి గురువార వ్రతకల్పము, 1959 — a **fixed-count Thursday** vrata-kalpa | 27,389 Telugu, **garbled** | coverage map for §6's Bṛhaspativāra cycle; not a base text |
| `in.ernet.dli.2015.330194` | వ్రత రత్నాకరము, ద్వితీయ భాగము, 1958 | 383,567 Telugu, **garbled** | coverage map only |
| `in.ernet.dli.2015.330096`, `…330097` | వ్రతరత్నాకరము సాంధ్రతాత్పర్యము, ద్వితీయ భాగము, 1946 | not measured | further Vrataratnākaram scans |

**One duplicate trap, caught by measurement.** `20250826_20250826_0853` and `20230921_202309`
(catalogued as తదియ గౌరి నోము) are **byte-identical** — same md5, 11,076 characters each. They are
one text published twice, not two witnesses. Check the hash before counting a second scan as an
independent lineage.

**What "not found" means here.** It means archive.org holds no item under these names in Telugu
script or in transliteration. Kalyāṇa Gaurī Nomu, Sapta Śanivāra, the Somavāra cycles and all four
dīkṣās returned nothing. For the dīkṣās this is unsurprising — they are governed by temple and
guru instruction rather than by a printed kalpa, which is what the document itself says. For the
other three the next places to look are the Vratha Ratnākaram page images and the Telugu
devotional publishing houses, not another archive.org query.

##### Four PDFs supplied by the user, measured 2026-09-12

The user supplied four vrata PDFs directly. They are recorded here with what each is actually
worth, on the same measure as the archive.org items above. Two carry usable text, two are page
images, and the two page-image volumes are the more valuable of the four.

| file | what it is | text layer | use |
|---|---|---|---|
| `331168138-Savitri-Gouri-VrataM.pdf` | **Sāvitrī Gaurī Vratam**, *Vrata Ratnākaramu* vol. II, pp. 264–276 | **none** — image only, 13 characters extracted | **base text.** Clean letterpress, fully legible |
| `584547363-గురునాథ-కామేశ్వరీ-వ్రతం.pdf` | **Gurunātha Vrata (Poṅgali) Kalpaḥ** and **Kāmeśvarī Vrata Kalpaḥ**, Prof. Mārti Venkaṭrāma Śarma, Śrī Venkaṭeśvara Vedic University, Tirupati; Śrīnivāsa Granthamāla, Hyderabad | **none** — image only, 57 pages, the 5,130 Latin characters are a repeated watermark | **base text.** Clean modern print |
| `577650787-SIMHA-VRATAM-HARIHARAPURA.pdf` | **Śrī Lakṣmīnṛsiṁha Mālā Dīkṣā (Siṁha Vratam)**, Sreemath Hariharapura | text layer, 9,979 characters | **base text for the observance.** Its Devanāgarī is font-mangled and unusable; its IAST is clean |
| `101954025-Payo-vratam.pdf` | **Payo-vrata**, Śrīmad Bhāgavata 8.16.24–62, Bhaktivedanta translation with purports | text layer, 37,011 characters | **a locator, not a source.** No Devanāgarī, no diacritics |

**The Vrata Ratnākaram page images close the gap this queue recorded.** The entry above says the
two Ratnākaram scans are *"the coverage map, not a transcription source"* because their OCR is
garbled, and that the next place to look is *"the Vratha Ratnākaram page images."* This PDF is
exactly that — thirteen clean pages of volume II. The volume is now a transcription source for the
pages that can be obtained as images, and a coverage map everywhere else.

**Sāvitrī Gaurī Vratam is the most complete single vrata this queue has found.** It carries all
four parts a vrata file needs, in order, with printed section colophons:

| part | pages | ends |
|---|---|---|
| pūjā vidhāna, Sanskrit in Telugu script — saṅkalpa, dhyāna, ṣoḍaśopacāra | 264–270 | `సావిత్రీగౌరీవ్రతపూజావిధానం సమాప్తమ్` |
| Gaurī aṣṭottara-śata-nāmāvaḷi, two columns | 267–269 | `అష్టోత్తరశతనామపూజాం సమర్పయామి` |
| kathā, Sanskrit ślokas — Mārkaṇḍeya to Yudhiṣṭhira | 271–274 | colophon below |
| kathā, Telugu prose | 274–276 | `సావిత్రీగౌరీవ్రతకథ సమాప్తము` |

**Its colophon names the Purāṇa**, which is what the standing note on Purāṇa witnesses asks for:
`స్కాందేపురాణే గౌరీఖండే మార్కండేయయుధిష్ఠిరసంవాదే సావిత్రీగౌరీవ్రతకథా సంపూర్ణా` — Skanda Purāṇa,
Gaurī-khaṇḍa. A Sanskrit edition of the Gaurī-khaṇḍa is therefore a genuinely independent
editorial lineage for the kathā, and must be found before this file is written. The rite is nine
days, with a **nine-knot toram** (`నవగ్రంథియుతం తోరం`), repeated nine years, then udyāpana.

**Gurunātha Vratam is a kula-devatā rite, and it is the strongest Telugu imprint in this queue.**
Śrī Venkaṭeśvara Vedic University, Tirupati, outranks the Rajahmundry trade prints on editorial
standing. Two observances in one volume:

- **Gurunātha Vrata (Poṅgali).** Mārgaśira Pūrṇimā, or Ārdrā, or a Thursday. Agni is established
  in the house and pāyasa is cooked on it while Puruṣa Sūkta, Namaka and Camaka are recited; twelve
  dōsiḷḷu of rice, twelve brāhmaṇas, twelve apūpa. Performed twelve years, or three, then udyāpana
  over three days from Mārgaśira Śukla Trayodaśī, with Rudra-ekādaśinī and 1,200 japa a day. Its
  colophon is `ఇతి శ్రీస్కాందపురాణే జగన్మోహిని ఈశ్వర పుత్ర చరిత్ర వర్ధనం నామ చతుష్షష్టితమోధ్యాయః` —
  Skanda Purāṇa chapter 64, the Hariharaputra carita. Gurunātha here is Śāstā.
- **Kāmeśvarī Vrata**, known in Telugu as **అక్కల ముత్తయిదువుల నోము**. The book says plainly that it
  is performed as a kula-devatā rite in many parts of the Telugu country. Three parts: āvāhana and
  arcana of Śrī Mahā Kāmeśvarī by Śrī Sūkta vidhāna; the worship of eight suvāsinīs; and the boiling
  of milk in the courtyard over a new pot while the Kāmeśvarī song is sung, the names of the
  lineage's couples recited, and the ayomṛta sprinkled on the head. The maṇḍala is nine by nine
  aṅgulas with seven kuṅkuma lines drawn south to north.

**This is the first real answer to §8 of the master reference, which had no source at all.** Siṁha
Vratam is a **sixteen-day mālā dīkṣā** — tulasī mālā of 108 beads worn throughout, blue cotton
vastra, eka-bhukta, sleeping on a mat, ending in an **irumuḍi** carried to Hariharapura. That is the
Śabarimala apparatus applied to Narasiṁha. Note what it is **not**: Hariharapura is a Karnataka
Smārta maṭha, so this is not the Telugu reader's rite, and the file must say so. Its mantra is
`jaya jaya lakṣmīnarasimha, vajrastambhaja narasimha`, and its dhyāna ślokam
`prahlādanuta govinda vajrastambhaja śrīdhara`. It is begun in Vasanta Ṛtu from Ugādi and concluded
on Narasiṁha Jayanti, which ties it to two dates this corpus already holds.

**Payo-vrata needs no hunt, because it is scripture.** It is Śrīmad Bhāgavata 8.16, Kaśyapa
instructing Aditi, thirty-nine verses. The PDF supplies no Devanāgarī and no diacritics, so it is
not transcribable. But the text is a Purāṇa chapter, which means **Gītā Press publishes it** in the
Śrīmad Bhāgavata, and tier 1 of the standing sourcing chain applies here in full. This is the one
item in the vrata queue that reaches the ultimate authority, because it is the one item that is not
a vidhāna but a canonical chapter. Take the base text from Gītā Press and collate against GRETIL's
Bhāgavata, which carries book 8.

**None of the four exists in the corpus.** Checked on disk before writing this entry: no file for
Sāvitrī Gaurī, Gurunātha, Kāmeśvarī, Siṁha Vratam or Payo-vrata. The `savitri` and `kāmeśvarī`
matches are stotra files, not vrata files.

#### The calendar is part of the rite, and for this reader it is amānta

**State the reckoning in every vrata file.** Telugu months are **amānta** — a month ends at the new
moon. North Indian months are **pūrṇimānta** and end at the full moon. A śukla-pakṣa vrata falls on
the same day in both, so Vināyaka Cavitī raises no question. A **kṛṣṇa-pakṣa** vrata is named for a
different month in each system, one month apart.

Demonstrated, not asserted: Gītā Press *Vrat Paricay* prints Śivarātri as **फाल्गुन कृष्ण**, while
the Telugu almanac calls the same night **మాఘ బహుళ చతుర్దశి**. Same night, two month names.

**The authority's own convention is worth copying.** *Vrat Paricay* writes Hanumān Jayantī as
`अमान्त आश्विन (कार्तिक) कृष्ण चतुर्दशी` — the amānta month first, the pūrṇimānta name in round
brackets. That is exactly the bracket form `CLAUDE.md` already prescribes for a word-level variant.
Use it for month names, amānta first.

#### The śākhā question mostly does not arise here — and that is measured, not assumed

`Āru Vratālu` declares **no sūtra and no śākhā**: zero occurrences of ఆపస్తంబ, zero of తైత్తిరీయ,
one of కాత్యాయన. Contrast `vidhi/`, where every rite names its śākhā in its own abhivādana. The
reason is that vrata pūjā mantras are Purāṇic ślokas and nāma-mantras rather than Vedic recitation,
so the śākhā simply is not engaged. **Do not infer a śākhā for a vrata file and do not write one
into a header that the source does not state.** What does still divide these texts is **paddhati**
— smārta against Śrīvaiṣṇava — and **region**, which is why this section exists.

#### Two consequences for files already on disk

1. `puja/smarta/14_vinayaka_chaviti_vrata.txt` records that its kathā exists only in English and
   Telugu, that no Sanskrit of it was found, and that none was invented. That was right and **the
   file is not to be edited.** `Āru Vratālu` and the nibandhas carry vrata kathās in Sanskrit, so
   the remaining vratas need not repeat the gap.
2. `puja/vaishnava/01_purvanga_vidhanam.txt` states that no independent collation exists for it.
   The TTD catalogue was extracted and searched: **no vrata volume**, but TTD publishes
   *Nityānusandhānam* in separate **Tenkalai** and **Vaḍakalai** recensions, and *Sakaladevatā
   Pūjāvidhānam*. Those are the missing witness. This is a note, **not a licence to rewrite that
   file** — a second recension is its own file, cross-referenced. Portal: `ebooks.tirumala.org`.

#### The decodability traps, for all of the above

1. **Every Sanskrit nibandha here is a scriptio-continua lithograph.** The OCR runs words together
   — `शुकतपक्षेतपंचम्यामिषेमासि` for `शुक्लपक्षे तु पञ्चम्यां...` — so a word-boundary search
   returns a false negative on text that plainly contains the word. **Strip whitespace from both
   sides before grepping**, then read the page image before settling a reading. Same shape as the
   accent-stripping rule for Vedic text.
2. **Old per-vrata booklets are page images in practice.** The Sanskrit Satyanārāyaṇa kathā from the
   Revā-khaṇḍa (`kkbw_satyanarayana-vrata-katha-reva-khanda-sanskrit-hinduism-skanda-purana-litho`)
   yields **2,140 Devanāgarī characters out of a 23 MB PDF** — an OCR failure, not a short book. The
   old Telugu booklets decode to garbled Telugu: `న్ఫీ శ్రినరనిద్ధినినాయకాయ` for `ఓం శ్రీ
   వరసిద్ధివినాయకాయ`. **Print date predicts decodability better than language does** — the 1999
   `Āru Vratālu` is clean where a 1917 Telugu lithograph is not.


## File format

One `.txt` file per stotra, named `NN_transliterated_title.txt` inside the deity's folder
(create the folder if it doesn't exist yet — path given per section below). Match the existing
corpus exactly — see e.g. `Subrahmanya/01_subrahmanya_bhujangam.txt` for the reference format:

```
Title: <IAST>
Devanāgarī: <deva script>
Telugu: <Telugu script>

Author: <traditional attribution>

Source / recension: <exact URL(s) fetched, cross-check notes, variant-reading notes>

Verse count: <N>

Sections:
<if the work has named sections, list them; else omit this block>

Blurb: <2-4 sentence editorial framing — what makes this text distinctive>

--- verse 1 | section: <name, or omit "| section:" if unsectioned> ---
deva:
<verse in Devanāgarī>
iast:
<verse in IAST>
en:
<verse meaning in English>
tel:
<verse meaning in Telugu>
hi:
<verse meaning in Hindi>

--- verse 2 | section: ... ---
...
```

Conventions: uniform `ṁ` anusvāra (not `ṃ`), no embedded verse numbers inside the verse text
itself, plain `e`/`o` (not `ē`/`ō`) in Sanskrit transliteration. Nāmāvalī/sahasranāma/
aṣṭōttaraśatanāma-type works route to a separate reference-list treatment, not this per-verse
format — flag and skip rather than force one into this shape (none should appear below; Round 1
picks were deliberately chosen to avoid them).

---

## ROUND 1 — breadth floor (every zero-coverage section, 3-5 titles each)

Sections already holding written files (Subrahmaṇya, Devī main/Lalitā/Durgā/Lakṣmī/Vārāhī) are
skipped here — they already clear the floor. Their next-tranche picks are queued in Round 2.

### Devī — Sarasvatī — `devi/saraswati/`
- [x] Sri Saraswati Stotram 1
- [x] Sri Saraswati Kavacham (Brahma Vaivarta Purana)
- [x] Sri Sharada Pancharatna Stotram

### Devī — Gāyatrī — `devi/gayatri/`
- [x] Gayatri Stotram 1
- [x] Sri Gayatri Kavacham 1
- [x] Sri Gayatryashtakam

### Devī — Śyāmalā/Mātaṅgī — `devi/syamala/`
- [x] Śrī Śyāmalā Daṇḍakam
- [x] Śrī Mātaṅgī Stōtram 1
- [x] Śrī Śyāmalā Kavacam

### Devī — Bālā — `devi/bala/`
- [x] Śrī Bālā Stōtram 1
- [x] Śrī Bālā Kavacam 1
- [x] Śrī Bālā Pañcaratna Stōtram

### Devī — Kālikā/Kālī — `devi/kalika/`
- [x] Śrī Mahākālī Stōtram
- [x] Śrī Kālikāṣṭakam
- [x] Śrī Kālī Kavacam (Trailōkyavijayam)

### Devī — Pratyaṅgirā — `devi/pratyangira/`
- [x] Śrī Pratyaṅgirā Stōtram 1
- [x] Śrī Pratyaṅgirā Daṇḍakam
- [x] Śrī Pratyaṅgirā Kavacam 1 (Sarvārthasādhanam)

### Devī — Daśa Mahāvidyā — `devi/dasamahavidya/`
(Kālī and Mātaṅgī are tracked above under Kālikā/Śyāmalā respectively — see the open
reconciliation question in `PROJECT_TRACKING.md` before writing either twice.)
- [x] Śrī Bagalāmukhī Stōtram 1
- [x] Śrī Bagalāmukhī Kavacam 1
- [x] Śrī Kamalā Stōtram 1
- [x] Śrī Kamalā Kavacam
- [x] Śrī Tārā Stōtram
- [x] Śrī Tārāṣṭakam
- [x] Śrī Bhuvaneśvarī Stōtram
- [x] Śrī Bhuvaneśvarī Kavacam
- [x] Śrī Chinnamastā Devī Stōtram
- [x] Śrī Chinnamastā Kavacam
- [x] Śrī Dhūmāvatī Stōtram
- [x] Śrī Dhūmāvatī Kavacam
- [x] Śrī Tripura Bhairavī Stōtram
- [x] Śrī Tripura Bhairavī Kavacam
- [x] Tripurasundarī Stōtram 1
- [x] Mahātripurasundarī Ṣaṭkam

### Devī — Kāmākṣī (beyond the 4 already in `devi/lalita/03-06`) — `devi/lalita/`
- [x] Kāmākṣī Navaratnamālikā Stōtram — re-queue resolved 2026-09-02, written as `19_kamakshi_navaratnamalika_stotram.txt`
- [x] Kāmākṣyaṣṭakam — re-queue resolved 2026-09-02, written as `20_kamakshyashtakam.txt`

### Devī — Mīnākṣī — `devi/meenakshi/`
- [x] Mīnākṣī Stōtram
- [x] Mīnākṣī Pañcaratnam

### Devī — Annapūrṇā — `devi/annapurna/`
- [x] Śrī Annapūrṇā Stōtram
- [x] Annapūrṇā Kavacam

### Devī — Gōdā Dēvī/Āṇḍāḷ — `devi/goda/`
- [x] Godā Stuti (Vēdānta Dēśika)
- [x] Tiruppāvai — flag: Tamil, not Sanskrit; included with explicit language note per corpus convention

### Gaṅgā — `ganga/` (top-level, per her major-goddess status, not nested under `devi/`)
- [x] Gaṅgā Laharī (Paṇḍitarāja Jagannātha, 53 verses) — VERIFIED
- [x] Gaṅgāṣṭakam
- [x] Gaṅgā Stotram
- [x] Gaṅgā Stavaḥ
- [x] Gaṅgā Kavacam

### Minor Nadīs (one per river, breadth within the genre itself) — `devi/nadi/`
- [x] Yamunāṣṭakam (Ādi Śaṅkara attribution) — VERIFIED
- [x] Kāverī Stotram (Parāśara Bhaṭṭar, excerpted from Śrī Raṅgarāja Stotram) — VERIFIED
- [x] Narmadāṣṭakam (Ādi Śaṅkara attribution) — VERIFIED
- [x] Śrī Godāvarī Aṣṭakam — VERIFIED (stotranidhi.com/sri-godavari-ashtakam-in-telugu/)
- [SKIPPED: fetched and verified as a bare river-name list (nāmāvalī-type), not a per-verse praise-stotra — doesn't fit this corpus's per-verse format] Nadī Stotram (Nāradīya Purāṇa, names 30+ rivers)

### Śiva — `shiva/`
- [x] Lingāṣṭakam
- [x] Rudrāṣṭakam
- [x] Śiva Mānasa Pūjā Stotram

### Viṣṇu — `vishnu/`
- [x] Viṣṇu Aṣṭakam
- [x] Viṣṇu Kavacam
- [x] Bhaja Govindam (Mohamudgara)

### Guru — `guru/`
- [x] Guru Pādukā Stotram
- [x] Gurvaṣṭakam
- [x] Guru Gītā (chapter 1, representative of the 3-chapter work)
- [x] Śrī Guruparamparā Stōtram (Śṛṅgēri)
- [x] Jagadguru Ratnamālā (Kāñcī)

### Hanumān — `hanuman/`
- [x] Saṅkaṭamōcana Hanumadaṣṭakam
- [x] Hanumān Cālīsā — flag: Hindi/Awadhi, not Sanskrit; include with explicit language note
- [x] Pañcamukha Hanumat Kavacam

### Ayyappa — `ayyappa/`
- [x] Harivarasanam — flag: Malayalam, not Sanskrit; include with explicit language note
- [x] Ayyappa Pañcaratnam
- [x] Dharmaśāstāṣṭakam 1

### Navagraha — `navagraha/`
- [x] Navagraha Stōtram (Vyāsa, "ādityāya ca sōmāya…")
- [x] Navagraha Kavacam
- [x] Āditya Hṛdayam (flagship single-planet text, Sūrya)

### Gaṇeśa — `ganesha/`
- [x] Gaṇeśa Aṣṭakam (Vyāsa-kṛtam)
- [x] Saṅkaṭanāśana Gaṇeśa Stōtram
- [x] Gaṇeśa Bhujaṅgam

### Kṛṣṇa — `krishna/`
- [x] Kṛṣṇa Aṣṭakam (Ādi Śaṅkarācārya-kṛtam)
- [x] Gopāla Kṛṣṇa Kavacam (Trailokya Maṅgala)
- [x] Madhurāṣṭakam

### Rāma — `rama/`
- [x] Rāma Rakṣā Stōtram
- [x] Rāma Kavacam
- [x] Rāma Hṛdayam

### Nṛsiṁha — `narasimha/`
- [x] Lakṣmīnṛsiṁha Karāvalamba Stōtram
- [x] Nṛsiṁha Kavacam (Prahlāda-kṛtam)
- [x] Lakṣmīnṛsiṁha Aṣṭakam

### Vēṅkaṭēśvara — `venkateswara/`
- [x] Vēṅkaṭēśvara Suprabhātam
- [x] Vēṅkaṭēśvara Stōtram
- [x] Vēṅkaṭēśvara Prapatti

### Dattātrēya — `dattatreya/`
- [x] Dattātrēya Stōtram (Nārada-kṛtam)
- [x] Dattātrēya Kavacam
- [x] Sripāda Śrīvallabha Stōtram

### Śani (standalone) — `shani/`
- [x] Śani Vajrapañjara Kavacam
- [x] Śani Stōtram (Daśaratha-kṛtam)
- [x] Śani Mṛtyuñjaya Stōtram

### Brahmā — `brahma/`
- [x] Śrī Brahma Stuti (Vāyupurāṇē, Vyāsa-kṛtam)
- [x] Śrī Brahma Kavacam (Rudra-kṛtam) — sourced as the Mahānirvāṇa Tantra "Jaganmaṅgalam" kavaca (ṛṣi Sadāśiva, identified with Rudra/Śiva); a distinct Padma Purāṇa "Rudra praises Brahma" kavaca referenced on brahmadev.in could not be located in full on stotranidhi.com, vignanam.org, or sanskritdocuments.org
- [x] Śrī Brahma Pañcaratna Stōtram (Mahānirvāṇatantrē)

### Kubēra — `kubera/`
- [x] Śrī Kubēra Stōtram — pool exhausted after this: only 1 genuine non-ritual/non-nāmāvalī
      title exists across both source sites (see `OTHER_DEITIES_TRACKING.md`)

### Misc Vedic — Indra/Agni/Yama/Vāyu — `misc_vedic/`
- [x] Agni Sūktam (Ṛgveda, "agnimīḷē purōhitam…")
- [x] Śrī Yama Aṣṭakam (Sāvitrī-kṛtam, Dēvī Bhāgavata Purāṇa)
  — pool exhausted after these two: Indra and Vāyu have zero genuine independent stotras
    confirmed (see `OTHER_DEITIES_TRACKING.md`)

---

## ROUND 2 — depth picks, next tranche for sections already past the floor

Queue this after Round 1 is fully checked off. These are a head start, not the full remainder —
each section has far more in its tracking-doc entry; pull the next batch from there once these
are done.

### Subrahmaṇya (re-audit remainder) — `Subrahmanya/`
- [x] Sri Skanda Shatkam
- [x] Sri Subrahmanya Shatkam
- [x] Sri Skanda Stavam
- [x] Sri Subrahmanya Ashtakam (Karavalamba Stotram) — distinct 8-verse text from the already-written 5-verse Kārtikeya Karāvalamba
- [x] Skanda Lahari

### Devī main (re-audit remainder) — `devi/main/`
- [x] Śrī Jvālāmukhī Stōtram 1
- [x] Śrī Rājarājēśvarī Ṣōḍaśī
- [x] Śrī Vindhyavāsinī Stōtram

### Lalitā/Tripurasundarī (re-audit remainder) — `devi/lalita/`
- [x] Sri Lalitha Kavacham
- [x] Rājarājeśvarī Kavacham (Trailokyamohana, Gandharva Tantra) — sourced from sanskritdocuments.org, 157 verses
- [x] Sri Lalitha Hrudayam — 195 verses
- [x] Sri Tripura Sundari Stotram 2
- [x] Mahātripurasundarī Ṣaṭkam — written under `devi/dasamahavidya/16_mahatripurasundari_shatkam.txt` instead, per the dedup note

### Durgā (re-audit remainder) — `devi/durga/`
- [x] Siddha Kunjika Stotram (Saptaśatī-recitation aṅga)
- [x] Sri Durga Ashtakam
- [x] Durga Suktam (Taittirīya Āraṇyaka)
- [x] Sri Durga Arya Stavam
- [x] Sri Devi Atharvashirsha

### Lakṣmī (re-audit remainder) — `devi/lakshmi/`
- [x] Sri Lakshmi Ashtaka Stotram
- [SKIPPED: verified via stotranidhi.com/vignanam.org/sanskritdocuments.org — only the two Kanakadhārā recensions already in the corpus (01, 02) exist; no genuine third version to source] Kanakadhara Stotram (Variation)
- [x] Sri Mahalakshmi Kavacham 1
- [x] Lakṣmī Laharī (Paṇḍitarāja Jagannātha)
- [x] Sri Lakshmi Gadyam

### Vārāhī — `devi/varahi/`
No further genuine stotra-type picks — the remaining 9 titles are nāmāvalī/mantra/ritual/
dhyāna-śloka type (see `devi/REMAINING_STOTRAS_TRACKING.md`'s Vārāhī re-audit section). Skip
until a decision is made on routing nāmāvalī-type works to the separate reference-list.

---

## ROUND 3 — depth picks pulled directly from `OTHER_DEITIES_TRACKING.md`'s itemized lists

Unlike Round 1/2, these titles weren't pre-populated here — each agent read the relevant section
of `OTHER_DEITIES_TRACKING.md` directly (full itemized lists exist there for every deity below)
and picked 5 genuine, sourceable, non-[NĀMĀVALĪ] titles itself. Recorded here after the fact for
continuity.

### Viṣṇu — `vishnu/` (from OTHER_DEITIES_TRACKING.md "VIṢṆU" section, ~line 128)
- [x] Aṣṭabhujāṣṭakam (Vedānta Deśika)
- [x] Nārāyaṇāṣṭakam (Kūrēśa)
- [x] Jagannāthāṣṭakam (Ādi Śaṅkarācārya attrib.)
- [x] Viṣṇu Hṛdaya Stōtram (Saṅkarṣaṇa-uktam)
- [x] Mahāviṣṇu Stōtram (Garuḍagamana tava, Bhāratītīrtha)

### Śiva — `shiva/` (from "ŚIVA" section, ~line 63)
- [x] Śiva Kavacam
- [x] Śiva Mahimna Stōtram
- [x] Śiva Tāṇḍava Stōtram
- [x] Śivānandalaharī (100 verses)
- [x] Śiva Rakṣā Stōtram

### Gaṇeśa — `ganesha/` (from "GAṆEŚA" section, ~line 537)
- [x] Gaṇeśa Kavacam (Gaṇeśa Purāṇa)
- [x] Gaṇeśa Hṛdayam (Mudgala Purāṇa)
- [x] Ekadanta Stōtram (Mudgala Purāṇa)
- [x] Gaṇeśa Pañcaratnam (Ādi Śaṅkarācārya)
- [x] Gaṇapaty-atharvaśīrṣopaniṣat

### Hanumān — `hanuman/` (from "HANUMĀN" section, ~line 414)
- [x] Hanuma Stōtram
- [x] Hanumat Pañcaratnam (Śaṅkarācārya-kṛtam)
- [x] Rāmadūta Stavam (Bhujaṅgaprayātam)
- [x] Āñjanēya Stōtram (Umā Saṁhitā)
- [x] Ēkamukha Hanumat Kavacam (Brahmāṇḍa Purāṇa)

### Navagraha — `navagraha/` (from "NAVAGRAHA" section, ~line 482)
- [x] Sūryāṣṭakam (Sāmba-attrib.)
- [x] Āditya Kavacam (Agastya-attrib.)
- [x] Navagraha Stōtram (Vādirājayati-kṛtam — distinct combined text from the Vyāsa version already written)
- [x] Ēkaślōkī Navagraha Stōtram
- [x] Sūrya Kavacam (Yājñavalkya-kṛtam — distinct from Āditya Kavacam above)

### Rāma — `rama/` (from "RĀMA" section, ~line 649)
- [x] Rāma Pañcaratnam
- [x] Rāmacandra Stuti
- [x] Rāma Dvādaśanāma Stōtram (Skanda Purāṇa)
- [x] Rāmānusmṛti Stōtram (Brahma-attrib.)
- [x] Rāma Bhujaṅgaprayāta Stōtram (Ādi Śaṅkarācārya attrib.)

### Kṛṣṇa — `krishna/` (from "KṚṢṆA" section, ~line 588)
- [x] Kṛṣṇa Kavacam 1 (distinct from the already-written Kavacam 2/Trailokyamaṅgala)
- [x] Gōvindāṣṭakam (Ādi Śaṅkarācārya attrib.)
- [x] Bālakṛṣṇāṣṭakam
- [x] Gōvardhanāṣṭakam
- [x] Acyutāṣṭakam (Ādi Śaṅkarācārya attrib.)

**Not yet itemized/started this round:** Guru, Ayyappa, Dattātrēya, Nṛsiṁha, Vēṅkaṭēśvara, Śani,
Brahmā all have full itemized lists in `OTHER_DEITIES_TRACKING.md` and are next in line.

---

## Vālmīki Sundarakāṇḍa — `rama/valmiki_sundarakanda/` (opened 2026-09-12)

The fifth kāṇḍa of the **Sanskrit** Vālmīki Rāmāyaṇa, one file per sarga, 68 sargas.

**This is not `rama/sundarkand/`.** That folder holds Tulsīdās's Awadhi Sundarkāṇḍ from the
Rāmcaritmānas. This one holds Vālmīki's Sanskrit poem. Two different works by two different
poets in two different languages. Do not collate one against the other, and do not merge them.

**Sourcing, already settled — do not re-derive it.** Base text is stotranidhi's Devanāgarī, used
for transcription only. Two independent witnesses are collated against it half-line by half-line:
the **Gītā Press, Gorakhpur** *Śrīmad Vālmīkīya Rāmāyaṇa* Part 2 (archive.org item
`WTRU_srimad-valmiki-ramayana-of-maharshi-valmiki-with-hindi-trans.-part-2-sundara-khn`), which
is the authority for readings; and the Southern-lineage digital text at
`sanskritdocuments.org/sites/valmikiramayan/sundara/sarga<N>/sundarasans<N>.htm`. Full detail is
in `rama/valmiki_sundarakanda/README.md`.

**The Gītā Press OCR is not clean.** It settles a word and is never transcribed from. A Gītā
Press reading that cannot be read without doubt goes in the `Recension note`, not into the verse
line. Where a reading must be settled, the page images of the 1975 *Mūlamātram* scan
(`gzjz_shrimad-valmikiya-ramayanasya-sundara-kandam-mula-matram-by-valmiki-sanskri`) are legible
and can be read directly.

**Checked and not usable:** GRETIL's `sa_vAlmIki-rAmAyaNa-southern-2` does not carry this kāṇḍa
(its file is the Ayodhyākāṇḍa). `valmiki.iitk.ac.in` did not resolve.

**No accent.** This is epic verse, not Vedic chant, and no witness marks svara.

**Numbering.** The witnesses group the paired half-lines differently, so their unit counts differ
by a few per sarga. Number units sequentially by position and say in the `Recension note` what
each witness counted. A count difference here is almost never a difference of text.

**The kāṇḍa totals 2,824 verse units** across the 68 sargas, by the base text's own division.

- [x] Sarga 1 — समुद्रलङ्घनम् — 211 units (Southern witness 209)
- [x] Sarga 2 — निशागमप्रतीक्षा — 58 units (Southern witness 58)
- [x] Sarga 3 — लङ्काधिदेवताविजयः — 51 units (Southern witness 51)
- [x] Sarga 4 — लङ्कापुरीप्रवेशः — 30 units (Southern witness 29)
- [x] Sarga 5 — भवनविचयः — 27 units (Southern witness 27)
- [x] Sarga 6 — रावणगृहावेक्षणम् — 44 units (Southern witness 44)
- [x] Sarga 7 — पुष्पकदर्शनम् — 17 units (Southern witness 17)
- [x] Sarga 8 — पुष्पकानुवर्णनम् — 8 units (Southern witness 7)
- [x] Sarga 9 — सङ्कुलान्तःपुरम् — 74 units (Southern witness 73)
- [x] Sarga 10 — मन्दोदरीदर्शनम् — 54 units (Southern witness 54)
- [x] Sarga 11 — पानभूमिविचयः — 47 units (Southern witness 47)
- [x] Sarga 12 — हनुमद्विषादः — 25 units (Southern witness 25)
- [x] Sarga 13 — हनूमन्निर्वेदः — 69 units (Southern witness 69)
- [x] Sarga 14 — अशोकवनिकाविचयः — 52 units (Southern witness 52)
- [x] Sarga 15 — सीतोपलभ्यः — 55 units (Southern witness 54)
- [x] Sarga 16 — हनूमत्परीतापः — 32 units (Southern witness 32)
- [x] Sarga 17 — राक्षसीपरिवारः — 32 units (Southern witness 32)
- [x] Sarga 18 — रावणागमनम् — 32 units (Southern witness 32)
- [x] Sarga 19 — कृच्छ्रगतसीतोपमाः — 23 units (Southern witness 23)
- [x] Sarga 20 — प्रणयप्रार्थना — 36 units (Southern witness 36)
- [x] Sarga 21 — रावणतृणीकरणम् — 34 units (Southern witness 34)
- [x] Sarga 22 — मासद्वयावधिकरणम् — 46 units (Southern witness 46)
- [x] Sarga 23 — रक्षसीप्ररोचनम् — 21 units (Southern witness 21)
- [x] Sarga 24 — राक्षसीनिर्भर्त्सनम् — 48 units (Southern witness 48)
- [x] Sarga 25 — सीतानिर्वेदः — 20 units (Southern witness 20)
- [x] Sarga 26 — प्राणत्यागसम्प्रधारणम् — 51 units (Southern witness 51)
- [x] Sarga 27 — त्रिजटास्वप्नः — 51 units (Southern witness 51)
- [x] Sarga 28 — उद्बन्धनव्यवसायः — 20 units (Southern witness 20)
- [x] Sarga 29 — शुभनिमित्तानि — 8 units (Southern witness 8)
- [x] Sarga 30 — हनूमत्कृत्याकृत्यविचिन्तनम् — 44 units (Southern witness 44)
- [x] Sarga 31 — रामवृत्तसंश्रवः — 19 units (Southern witness 19)
- [x] Sarga 32 — सीतावितर्कः — 14 units (Southern witness 14)
- [x] Sarga 33 — हनूमज्जानकीसंवादोपक्रमः — 31 units (Southern witness 31)
- [x] Sarga 34 — रावणशङ्कानिवारणम् — 41 units (Southern witness 41)
- [x] Sarga 35 — विश्वासोत्पादनम् — 89 units (Southern witness 89)
- [x] Sarga 36 — अङ्गुलीयकप्रदानम् — 47 units (Southern witness 47)
- [x] Sarga 37 — सीताप्रत्यानयनानौचित्यम् — 66 units (Southern witness 66)
- [x] Sarga 38 — वायसवृत्तान्तकथनम् — 73 units (Southern witness 72)
- [x] Sarga 39 — हनूमत्सन्देशः — 54 units (Southern witness 54)
- [x] Sarga 40 — हनूमत्प्रेषणम् — 25 units (Southern witness 25)
- [x] Sarga 41 — प्रमदावनभञ्जनम् — 21 units (Southern witness 21)
- [x] Sarga 42 — किङ्करनिषूदनम् — 43 units (Southern witness 43)
- [x] Sarga 43 — चैत्यप्रासाददाहः — 25 units (Southern witness 25)
- [x] Sarga 44 — जम्बुमालिवधः — 20 units (Southern witness 20)
- [x] Sarga 45 — अमात्यपुत्रवधः — 17 units (Southern witness 17)
- [x] Sarga 46 — सेनापतिपञ्चकवधः — 39 units (Southern witness 39)
- [x] Sarga 47 — अक्षकुमारवधः — 38 units (Southern witness 38)
- [x] Sarga 48 — इन्द्रजिदभियोगः — 61 units (Southern witness 61)
- [x] Sarga 49 — रावणप्रभावदर्शनम् — 20 units (Southern witness 20)
- [x] Sarga 50 — प्रहस्तप्रश्नः — 19 units (Southern witness 19)
- [x] Sarga 51 — हनूमदुपदेशः — 46 units (Southern witness 46)
- [x] Sarga 52 — दूतवधनिवारणम् — 30 units (Southern witness 27)
- [x] Sarga 53 — पावकशैत्यम् — 44 units (Southern witness 44)
- [x] Sarga 54 — लङ्कादाहः — 52 units (Southern witness 48)
- [x] Sarga 55 — हनूमद्विभ्रमः — 35 units (Southern witness 33)
- [x] Sarga 56 — प्रीतिप्रयाणोत्पतनम् — 34 units (Southern witness 34)
- [x] Sarga 57 — हनूमत्प्रत्यागमनम् — 51 units (Southern witness 51)
- [x] Sarga 58 — हनूमद्वृत्तानुकथनम् — 167 units (Southern witness 165)
- [x] Sarga 59 — अनन्तकार्यप्ररोचनम् — 36 units (Southern witness 36)
- [x] Sarga 60 — अङ्गदजाम्बवत्संवादः — 7 units (Southern witness 6)
- [x] Sarga 61 — मधुवनप्रवेशः — 23 units (Southern witness 23)
- [x] Sarga 62 — दधिमुखखिलीकारः — 40 units (Southern witness 40)
- [x] Sarga 63 — सुग्रीवहर्षः — 29 units (Southern witness 29)
- [x] Sarga 64 — हनूमाद्यागमनम् — 40 units (Southern witness 39)
- [x] Sarga 65 — चूडामणिप्रदानम् — 27 units (Southern witness 27)
- [x] Sarga 66 — सीताभाषितप्रश्नः — 15 units (Southern witness 15)
- [x] Sarga 67 — सीताभाषितानुवचनम् — 37 units (Southern witness 37)
- [x] Sarga 68 — हनूमत्समाश्वासवचनानुवादः — 29 units (Southern witness 29)

## Session log — 2026-09-12: Vālmīki's Sanskrit Sundarakāṇḍa, opened and begun

New folder `rama/valmiki_sundarakanda/`, **5 files, 377 verse units and 831 verse lines**, plus
five colophons. All five validate: `bin/fill_iast.py --check` reports no gaps, and
`bin/reader_view.py --audit` reports no sourcing in any reader-facing field.

**This is a different work from `rama/sundarkand/`**, which holds Tulsīdās's Awadhi Sundarkāṇḍ.
That was checked on disk before anything was written. The two are cross-referenced in the new
folder's README and neither is collated against the other.

**Sourcing was settled first, and three witnesses were used, not two.** The base text is
stotranidhi's Devanāgarī, used for transcription only. Against it were collated the **Gītā Press,
Gorakhpur** *Śrīmad Vālmīkīya Rāmāyaṇa* Part 2, which is the authority for readings, and the
Southern-lineage digital text at valmikiramayan.net. Both were fetched in full for all 68 sargas
and aligned half-line by half-line before the first file was written.

**The Gītā Press problem, and how it was handled.** Two Gītā Press editions of this kāṇḍa exist on
archive.org. The 1975 *Sundara Kāṇḍa Mūlamātram* is a page-image scan whose PDF text layer is a
`GlyphLessFont` — it carries no recoverable text at all, unlike the Chanakya-encoded Rāmcaritmānas
PDF decoded in the September 8 sessions. Its page images are legible and were read directly to
settle the format. The two-volume *Part 2* has a real OCR, and that is what was used, but the OCR
is not clean. **So a Gītā Press reading is recorded in the file's `Recension note` and is not
printed into a verse line unless it can be read without doubt.** This is stated in every file. It
is the honest position: Gītā Press is the authority for the reading, and an imperfect scan is not
a licence to transcribe from it character by character.

**Checked and not usable.** GRETIL's `sa_vAlmIki-rAmAyaNa-southern-2` does **not** carry this
kāṇḍa — its file is the Ayodhyākāṇḍa, despite the name. `valmiki.iitk.ac.in` did not resolve.
Both are recorded in the folder README so nobody spends the time again.

**No accent.** Epic verse, not Vedic chant; no witness marks svara. The sūkta rule does not apply.

**Numbering is not a text difference.** The three witnesses group the paired half-lines
differently, so their unit counts differ by a few per sarga. Sarga 1 is the worst case: the base
text's own printed numerals are internally inconsistent (unit 93 is numbered 99, and the numeral
177 sits mid-line), its last numeral is 212 while it actually holds 211 units, and the Southern
witness divides the same text into 209. Units are numbered sequentially by position and every file
says what each witness counted.

**Bracketed variants.** Six readings are printed in the corpus's round-bracket form, and every one
is attested by an independent witness: sarga 1 verses 57, 60, 80 and 195, sarga 2 verse 36, sarga 4
verse 6. The base text records about a dozen further variants of its own which neither independent
witness supports; those are named in the recension notes and not printed. `bin/valmiki_sundarakanda/
brackets.py` is what works out which word a bracket replaces, by testing the substitution against
both witnesses. **A new header field, `Bracketed readings:`, was added and classified as editorial
in `bin/reader_view.py`**, so it is withheld from readers like the other apparatus.

**The whole-kāṇḍa collation is cached, not thrown away.** `bin/valmiki_sundarakanda/` holds the
eleven scripts and `collation_cache.json`, which carries all 68 sargas — titles, verse units, and
every half-line's matched Gītā Press and Southern readings with the word-level differences already
sorted into real variants and OCR damage. **Read it before re-fetching anything.** The kāṇḍa totals
**2,824 verse units**.

**The kāṇḍa is complete. All 68 sargas are written**, and the finished files come to 2,824
verse units and 6,312 verse lines, plus sixty-eight colophons. That unit total is the same one
the cached collation predicted before authoring began. The per-sarga checklist is in the
"Vālmīki Sundarakāṇḍa" section above, with each sarga's unit count from both witnesses recorded.

**Forty-five bracketed readings were printed across the kāṇḍa.** Each one is a place where both
independent witnesses agree against the base text, and each is named in its file's recension note.
Two of them are places where the base text prints letters that do not make a Sanskrit word and
Gītā Press prints the same letters in the right order: sarga 41 verse 17 and sarga 58 verse 144.
In both the Southern witness carries the same damage as the base, so two witnesses agreeing are
not thereby right.

**One reading was referred to the maintainer and settled** (user, 2026-09-13). At sarga 54
verse 29 the base text says the rākṣasas were slain by fire and both independent witnesses say
they were slain by Hanumān. The maintainer pointed out that the fire in that sarga is the fire
Hanumān himself set, so the two readings name the same agent, one by the instrument and one by
the person. They do not disagree about what happened, so the other reading is bracketed like the
rest. Forty-five bracketed readings stand in the kāṇḍa.


## Session log

Append one line per authoring session — timestamp, titles written, where you stopped.

- 2026-08-25 — queue created, not yet run.
- 2026-08-25 — Round 1 batch (parallel agents): 59 titles written across 20 sections — every
  entirely-absent deity (Guru, Hanumān, Ayyappa, Navagraha, Vēṅkaṭēśvara, Dattātrēya, Śani,
  Brahmā, Kubēra, Misc Vedic, Śiva, Viṣṇu, Gaṇeśa, Kṛṣṇa, Rāma, Nṛsiṁha) now has 3-5 files, plus
  4 Devī-form gaps (Sarasvatī, Gāyatrī, Bālā, Kālikā). No skips — every assigned title was
  reachable. Remaining Round 1 sections not yet started: Śyāmalā/Mātaṅgī, Pratyaṅgirā, Daśa
  Mahāvidyā, Kāmākṣī (extra), Mīnākṣī, Annapūrṇā, Gōdā Dēvī/Āṇḍāḷ, Gaṅgā, Minor Nadīs.
- 2026-09-02 — Round 1+2 remainder (61 of 63 titles; parallel agents, several needed repeated
  resumes due to the host machine sleeping mid-task): Śyāmalā/Mātaṅgī, Pratyaṅgirā, all 16 Daśa
  Mahāvidyā, Mīnākṣī, Annapūrṇā, Gōdā/Āṇḍāḷ, Gaṅgā (5), Subrahmaṇya remainder (5), Devī-main
  remainder (3), Durgā remainder (5), Lakṣmī remainder (4 of 5 — Kanakadhara Variation skipped,
  confirmed no 3rd genuine recension exists), Lalitā remainder (4 of 5 — Mahātripurasundarī
  Ṣaṭkam written under Daśa Mahāvidyā instead per dedup), Minor Nadīs (4 of 5 — Nadī Stotram
  skipped, confirmed nāmāvalī-type not per-verse). **2 titles never actually landed despite being
  assigned** (Kāmākṣī Navaratnamālikā Stōtram, Kāmākṣyaṣṭakam) — re-queued above under the
  Kāmākṣī section, not yet re-attempted.
- 2026-09-02 — Round 3 (35 titles, 7 sections × 5, parallel agents pulling directly from
  `OTHER_DEITIES_TRACKING.md`'s itemized lists rather than a pre-built list here): Viṣṇu, Śiva,
  Gaṇeśa, Hanumān, Navagraha, Rāma, Kṛṣṇa. No skips. See the ROUND 3 section above for exact
  titles. Guru/Ayyappa/Dattātrēya/Nṛsiṁha/Vēṅkaṭēśvara/Śani/Brahmā still fully itemized there and
  untouched this round — natural next tranche.
- 2026-09-02 — Round 4 (second wave, ~65+ titles, parallel agents pulling directly from each
  section's itemized list in `OTHER_DEITIES_TRACKING.md`): Guru (+8: Vēda Vyāsa Stuti, Yatirāja
  Viṁśati, Yati Pañcakam, Ācārya Pañcakam, Sadguru Daśakam, Śrī Jayēndra Sarasvatī Ślōka
  Mālikā, Śrī Candraśēkharēndra Sarasvatī Ślōka Mālikā, Śrī Kāmakōṭi Guru Paramparā Smaraṇam —
  guru/ now 5→13), Ayyappa (+3: Dharmaśāstāṣṭakam 2, Hariharaputrāṣṭakam, Śabarigiripatyaṣṭakam
  — 3→6), Dattātrēya (+3: Datta Ṣoḍaśī, Nṛsiṁha Sarasvatī Aṣṭakam, Siddha Maṅgala Stōtram —
  3→6), Śani (+3: Śanaiścarāṣṭakam, Śani Kavacam 1, Śanaiścara Rakṣā Stavaḥ — 3→6), Nṛsiṁha
  (+3: Nṛsiṁha Namaskāra Stōtram, Trailōkyavijaya Nṛsiṁha Kavacam, Nṛsiṁha Nakha Stuti — 3→6),
  Vēṅkaṭēśvara (+3: Maṅgaḷāśāsanam, Vajrakavaca Stōtram, Bhujaṅgam — 3→6), Śiva (+5:
  Mahāmṛtyuñjaya Stōtram, Naṭarājāṣṭakam, Dakṣiṇāmūrtyaṣṭakam, Śiva Ṣaḍakṣara Stōtram, Śrī
  Gaṅgādhara Stōtram — 8→13), Gaṇeśa (+5: Gaṇēśa Vajrapañjara Stōtram, Saṁsāramōhana Gaṇēśa
  Kavacam, Trailōkyamōhana Gaṇapati Kavacam, Gaṇēśāṣṭakam, Gaṇēśa Hṛdaya Kavacam — 8→13),
  Kṛṣṇa (+5: Mucukunda Stuti, Nārada-kṛta Kṛṣṇa Stuti, Rādhā Stōtram [Uddhava-kṛtam], Gōpī
  Gītam, Pāṇḍuraṅgāṣṭakam — 8→13), Navagraha (+5: Mārtāṇḍa Stōtram, Sūrya Pañjara Stōtram,
  Divākara Pañcakam, Dvādaśārya Sūrya Stuti, Āditya Dvādaśanāma Stōtram — 8→13), Hanumān (+5:
  Hanumadaṣṭakam, Hanumān Maṅgalāṣṭakam, Vibhīṣaṇa-kṛta Hanumān Stōtram, Yantrōdhāraka Hanumat
  Stōtram, Āpaduddhāraka Hanumat Stōtram — 8→13). Vishnu and Rāma also carried across from
  Round 3 (unchanged this round, stay at 8). Brahmā unchanged at 6 (already exhausted-ish per
  its ~11 estimate; not touched this round). No skips reported. Corpus-wide `.txt` count went
  from 255 to **306** (verified via `find stotras -name "*.txt" | wc -l`). Devī-side sections
  (Sarasvatī/Gāyatrī/Bālā/Kālikā/Vārāhī/Kāmākṣī re-queue) untouched this round — see
  `devi/REMAINING_STOTRAS_TRACKING.md` (unchanged from its 2026-09-02 state).


- 2026-09-02 (Round 5 — small re-queue + Brahmā follow-up, dense/kāvya-length titles
  explicitly deprioritized per user instruction): Kāmākṣī re-queue resolved — both
  Kāmākṣī Navaratnamālikā Stōtram and Kāmākṣyaṣṭakam written to `devi/lalita/` (19, 20;
  18→20). Brahmā (+5: Brahma Stotram [Deva-kṛtam], Brahma Kavacam [Rudra-kṛtam], Brahma
  Stavam [Abhīṣṭada], Brahma Stuti [plain], Brahma Stotram [Hiraṇyakaśipu-kṛtam] — 6→11).
  Skipped: Brahmāṣṭōttaraśatanāmāvalī (nāmāvalī, not per-verse), several Brahma-kṛta stotras
  of other deities (out of scope for this folder), Hiraṇyagarbha Sūkta/Brahma Sūktam (dense
  Vedic-accented prose, skipped per user's "avoid dense/kāvya" instruction). Two more small
  Brahma Stuti variants (Matsyapurāṇe, Māheśvaratantre) identified as good future candidates
  but not written this round. Sūrya Śatakam and Sūrya Upaniṣad remain explicitly deferred
  per user instruction (dense kāvya/Vedic-accented; not "very popular" tier like Soundarya
  Lahari). Corpus-wide `.txt` count now **313**.

- 2026-09-02 (Round 6 — Brahmā pool fully exhausted): wrote the final 2 small Brahmā
  stotras — Brahma Stutiḥ (Matsyapurāṇe Deva-kṛtam) and Brahma Stutiḥ (Māheśvaratantre) —
  brahma/ 11→13. Confirmed via stotranidhi.com's Śrī Brahma Stotrāṇi index page that all
  13 genuine small stotras listed there are now written (01–13); the only remaining
  unlisted item is Brahmāṣṭōttaraśatanāmāvalī (108-name list, out of scope). Brahmā section
  is now complete — no further titles pending. Corpus-wide `.txt` count now **315**.

- 2026-09-04 (Round 7 — mega authoring round, ~30 parallel agents, one 5-title tranche per
  section across nearly every deity): the largest single push so far, 136 titles written in one
  pass. Corpus-wide `.txt` count went from 315 to **451** (verified via
  `find stotras -name "*.txt" | wc -l`). Per-section deltas — non-devi (`OTHER_DEITIES_TRACKING.md`):
  Subrahmaṇya 30→38 (+8), Gaṇeśa 13→18 (+5), Navagraha 13→18 (+5), Śiva 13→18 (+5), Viṣṇu 8→13
  (+5), Guru 13→18 (+5), Hanumān 13→18 (+5), Ayyappa 6→11 (+5), Kṛṣṇa 13→18 (+5), Rāma 8→13
  (+5), Nṛsiṁha 6→10 (+4), Vēṅkaṭēśvara 6→10 (+4), Dattātrēya 6→10 (+4), Śani 6→9 (+3), Brahmā
  unchanged at 13 (not touched this round). Devī/Śākta (`devi/REMAINING_STOTRAS_TRACKING.md`):
  devi/main 26→31 (+5), Lalitā 20→25 (+5), Durgā 21→26 (+5), Lakṣmī 18→23 (+5), Śyāmalā/Mātaṅgī
  3→8 (+5), Bālā 3→8 (+5), Kālikā/Kālī 3→8 (+5), Pratyaṅgirā 3→8 (+5), Daśa Mahāvidyā 16→21
  (+5), Sarasvatī 3→8 (+5), Gāyatrī 3→8 (+5), Mīnākṣī 2→7 (+5), Annapūrṇā 2→7 (+5), Gōdā/Āṇḍāḷ
  2→4 (+2), Vārāhī 11→12 (+1). devi/nadi, ganga, kubera, misc_vedic untouched (already complete
  from prior rounds). **Two sections are now confirmed POOL EXHAUSTED / COMPLETE**: Annapūrṇā
  (all remaining candidates verified as nāmāvalī/sahasranāma-type, not stotra-form) and Vārāhī
  (8 of its 9 remaining candidates verified as ritual/nāmāvalī/mantra-type; the 9th, a dhyāna-
  śloka set, was written, closing out the section). Standalone Śani also turned out to be
  effectively exhausted by this round's 3 titles — every genuine (non-mantra, non-nāmāvalī) item
  in its own itemized candidate list is now written — see `OTHER_DEITIES_TRACKING.md`. Cross-
  reference note: "Śrī Yōgamīnākṣī Stōtram" and "Śrī Mīnākṣī Navaratnamālā," both previously
  listed as candidates under the Devī-main-remainder section, were written this round under
  `devi/meenakshi/` instead — the Devī-main list and the Mīnākṣī section in
  `devi/REMAINING_STOTRAS_TRACKING.md` have been cross-annotated so neither is left dangling as
  "still pending" in the wrong section. No skips reported this round. Full itemized title lists
  for every section live in `OTHER_DEITIES_TRACKING.md` and `devi/REMAINING_STOTRAS_TRACKING.md`
  (both refreshed 2026-09-04 alongside this entry); `PROJECT_TRACKING.md`'s per-deity table and
  TOTAL row were updated to match.

- 2026-09-05 (Round 8 — largest authoring round to date, +243 titles, plus a corpus-wide
  normalization pass): corpus-wide `.txt` count went from 451 to **694** (verified via
  `find stotras -name "*.txt" | wc -l`). Every partial section except the already-exhausted ones
  got a tranche, most of them 10 titles. Non-devi (`OTHER_DEITIES_TRACKING.md`): Viṣṇu 13→24
  (+11), Subrahmaṇya 38→48, Śiva 18→28, Kṛṣṇa 18→28, Rāma 13→23, Gaṇeśa 18→28, Navagraha 18→28,
  Guru 18→28, Hanumān 18→28, Ayyappa 11→21, Nṛsiṁha 10→20, Vēṅkaṭēśvara 10→20, Dattātrēya 10→20
  (all +10). Devī/Śākta and Gaṅgā (`devi/REMAINING_STOTRAS_TRACKING.md`): devi/main 31→41, Lalitā
  25→35, Durgā 26→36, Lakṣmī 23→33, Sarasvatī 8→18, Kālikā/Kālī 8→18, Bālā 8→18, Daśa Mahāvidyā
  21→31, Gaṅgā 5→15 (all +10); Gāyatrī 8→15 and Śyāmalā/Mātaṅgī 8→15 (+7 each); Mīnākṣī 7→12
  (+5); Pratyaṅgirā 8→11 (+3). Untouched, all already pool-exhausted or closed: Vārāhī (12),
  Annapūrṇā (7), Gōdā/Āṇḍāḷ (4), devi/nadi (4), Śani (9), Brahmā (13), Kubēra (1), misc_vedic (2).
  Coverage milestone: with Bṛhaspati Kavacam and Kētu Kavacam written, **every one of the nine
  grahas now has at least one text** in `navagraha/`; Sītā Kavacam is the first Sītā-specific
  title in `rama/`. **Five exhaustion verdicts settled by exhaustive sitemap crawls** — two closes
  and three corrections the other way. **Pratyaṅgirā is POOL EXHAUSTED at 11** (all 31 stotranidhi
  pratyangira/bhadrakali slugs plus sanskritdocuments accounted for; the rest is
  mantra-prayoga/bīja-string genre, out of scope) and **Mīnākṣī is POOL EXHAUSTED at 12**
  (stotranidhi carries only 4 Mīnākṣī titles, all written; sanskritdocuments' Devī index has 11,
  all accounted for). Against that, **Śyāmalā, Gāyatrī and Gaṅgā are confirmed NOT exhausted** and
  their remainder figures were understated: Śyāmalā still has 3 genuine sanskritdocuments-only
  texts (incl. the 95-verse Āgamasāra Mātaṅgī Stōtram, whose vv. 38/79/80 turn out to *open*
  existing files 06/02/12 — a parent-text overlap to route deliberately) plus the unassessed Rāja
  Śyāmalā Rahasya Upaniṣad; Gāyatrī has 10 open titles; Gaṅgā has ~30 further screened
  sanskritdocuments texts. Daśa Mahāvidyā also still has Bagalāmukhī Kavacam 4/5, Bagalāmukhī
  Varṇa Kavacam and Bhairavī Kavacam Trailokyavijayam open (diff that last one against the written
  file 14 before writing — distinct slug, possibly same text). **Routing finding:** stotranidhi
  files its five Bhadrakālī texts (Kavacam 1, Kavacam 2 "Jaganmaṅgalam", Aṣṭakam 1, Aṣṭakam 2,
  Stutiḥ) under **Kālikā**, not Pratyaṅgirā — they belong in `devi/kalika/` (2 already written
  there), and Bhadrakālī Kavacam 2 is a DIFFERENT text from the written Pratyaṅgirā Kavacam 2
  (different opening, ṛṣi Śiva, devatā Bhadrakālikā), not a duplicate. **New standing sourcing
  rule:** several sanskritdocuments candidates are modern compositions carrying **explicit
  copyright notices** (Jyōtirlakṣmī Stōtram, Sītā-Lakṣmī Pañcakam, Aṣṭādaśa Mahālakṣmī Stōtram by
  Pushpa Srivatsan; Mahālakṣmī Stavanam by Dr. Harekrishna Meher) — correctly skipped, and now a
  permanent exclusion alongside the nāmāvalī-routing and Śataka-length/dense-kāvya rules; check
  the source page footer before writing anything that looks modern. **Normalization pass
  (2026-09-05):** 133 legacy files brought into line with the conventions stated under "File
  format" above — embedded verse numbers stripped from `deva:`/`iast:` verse text (3,357
  field-blocks), `ē`/`ō` → plain `e`/`o` (729), decomposed `r̥` → precomposed `ṛ` (440), `ṃ` → `ṁ`
  (1). Nine non-Sanskrit works were deliberately EXCLUDED from the ē/ō transform because those
  vowels are phonemic there: Subrahmanya/06 Kandar Ṣaṣṭhi Kavacam, ayyappa/01 Harivarasanam,
  devi/durga/15 Durgā Cālīsā, devi/gayatri/10 Gāyatrī Cālīsā, devi/goda/02 Tiruppāvai,
  devi/goda/04 Nācciyār Tirumoḻi, devi/main/09 Abhirāmi Andādi, hanuman/02 Hanumān Cālīsā,
  rama/19 Tulasīdāsa-kṛta Rāma Stuti. Also excluded by design: devi/main/04 Devī Khaḍgamālā
  Stōtram, whose parenthesised numerals are name-count annotations, not verse numbers.
  Verification: every changed file was diffed against a pre-change backup and confirmed
  content-equivalent under exactly those four transforms — zero unexpected semantic differences.
  **Duplicates, raised and then resolved:** a two-pair dedup flag from this round was widened into a
  corpus-wide audit of all 694 files, which found **10 duplicate pairs, not 2** (the first check
  was title-only over one round's output). All ten were then merged — each survivor absorbing the
  retired copy's colophon, glosses and provenance, with an independent verifier diffing the result
  against a full pre-operation backup — and the redundant copies retired. The corpus is now
  **684 files = 684 distinct works**. Both contested Lalitā/Daśamahāvidyā routing questions were
  decided in favour of `lalita/` on the verse evidence. See `DEDUP_AUDIT.md` for the full table,
  the defects the adversarial pass caught, and what remains open. No unreachable-source skips this round. Full itemized title lists live in
  `OTHER_DEITIES_TRACKING.md` and `devi/REMAINING_STOTRAS_TRACKING.md` (both refreshed 2026-09-05
  alongside this entry); `PROJECT_TRACKING.md`'s per-deity table and TOTAL row were updated to
  match.
- 2026-09-07 — **Śrīmad Bhagavad Gītā, complete** (19 files, 710 verses) — new top-level folder
  `stotras/bhagavadgita/`: all 18 adhyāyas verse-by-verse (`01_arjuna_vishada_yoga.txt` …
  `18_moksha_sannyasa_yoga.txt`, 701 verses) plus `19_gita_dhyanam.txt` (the 9 dhyāna ślōkas).
  Split out of the Kṛṣṇa scope, where `OTHER_DEITIES_TRACKING.md` had it logged as a single
  unwritten bulk work; 19 files was too many to bury in `krishna/`.
  **Sourcing.** stotranidhi.com Devanāgarī, one page per chapter. Note for future rounds: the
  sourcing chain above says stotranidhi 403s should fall back to `curl` with a browser UA — that
  works and was used here for all 20 pages, so stotranidhi is NOT unreachable despite what the
  Gurugītā file's source note says. Chapter 1 uses a zero-padded slug
  (`…-chapter-01-in-sanskrit`) where chapters 2-18 do not — an easy 404.
  **Text integrity.** Every verse was collated against two independent digital editions
  (github.com/gita/gita and vedicscriptures.github.io). 111 verses diverged; each was adjudicated
  by a per-chapter agent against the Śaṅkara/Gītā-Press vulgate. 3 genuine corrections were
  adopted into the stotranidhi base text (1.19 `व्यनुनादयन्` → `तुमुलोऽभ्यनुनादयन्`; 13.17 and
  18.20 `तद्ज्ञानं` → the obligatory sandhi `तज्ज्ञानं`). The rest were orthographic (anusvāra vs.
  conjunct nasal, avagraha) or encoding corruption in the comparison texts, and were left as
  printed. Per-chapter detail is in each file's "Recension note".
  **IAST** was generated mechanically from the Devanāgarī by a transliterator written to this
  corpus's conventions (ṁ, `'`, `|`/`||`), NOT taken from stotranidhi's own IAST pages, which mark
  South Indian long ē/ō where this corpus uses plain e/o. It reproduces the existing
  `krishna/01_krishnashtakam.txt` IAST exactly.
  **Verse count.** 701, not the familiar 700: this recension gives chapter 13 thirty-five verses,
  counting the Arjuna-uvāca opening that Śaṅkara's recension omits. Recorded in that file's
  recension note rather than silently normalised.
  **QA.** Each ~20-verse batch was translated and then independently re-checked against the
  Sanskrit; 24 corrections were applied (e.g. `kavayaḥ` "the wise" mistranslated into Telugu as
  కవులు "poets"; a dative-subject grammar fault, మేము తెలియము for మాకు తెలియదు; `klaibyam` as
  "impotence"). A separate audit of the 19 headers caught 8 defects including a factually wrong
  chapter-8 blurb and two chapters both claiming to be "the shortest chapter of the Gītā".
  Finally, 256 mid-sentence reverential capitals (Me/My/You/Your) were lowercased to match corpus
  convention — the other 684 files have zero mid-sentence `Me/My/Mine/Myself`.
  **Not written:** Gītā Māhātmyam, Gītā Sāram, Gītā Āratī, Saptaślōkī Gītā — ancillary texts, and
  the natural next tranche for this folder.

- 2026-09-07 (Sahasranāma workstream opened; **corpus-wide sahasranāma re-audit** + first sahasranāma
  file written): The user asked to start sahasranāmas, then to add pūrva/uttara pīṭhikā, pañca pūjā,
  nyāsa and viniyoga to all of them. A first coverage matrix built on stotranidhi.com concluded that
  pañcapūjā was Śākta-only and that Viṣṇu carried only an *uttaranyāsa*. **The user challenged that
  single-source basis and was right to.** Checking vignanam.org and sanskritdocuments.org overturned it.

  **Re-audit (new file `SAHASRANAMA_AUDIT_2026-09-07.md`).** sanskritdocuments.org indexes **246**
  sahasranāma texts (148 of them citing archive.org / scanned-book references) against the ~34 in
  `SAHASRANAMA_TRACKING.md` — a ~7x undercount. That document has been given a SUPERSEDED-IN-PART
  banner. Verdicts now known to be wrong: **Ayyappa ❌** (3 texts exist: `dharmashAstAsahasranAmastotram`,
  `shAstRRishavarNa…`, `hariharaputra…` — Dharmaśāstā and Hariharaputra are both Ayyappa);
  **Śani ❌** (a text with a scan reference exists); **Lalitā "single canonical version"** (4+ recensions
  incl. Bṛhannāradīya Purāṇa and Mahābhāgavata Upapurāṇa); **Śiva's "unverified" variants** (Vāyu, Padma,
  Skanda and Rudrayāmala all exist as primary texts, ~12 Śiva-proper recensions in all); plus corrected
  counts for Viṣṇu (6), Gaṇeśa (9, incl. the Bhāskararāya `sabhāṣyam`), Rāma (6+, plus Lakṣmaṇa and
  Sarayū), Durgā (6+), Sūrya (3), Sītā (3), Gaṅgā (3). Hanumān's pedigree is stronger than recorded
  (Rudrayāmala). **Confirmed correct and not revisited:** the "modern composition" calls on Indra
  (Gaṇapati Muni), Agni (Samba Dīkṣita) and Rāghavēndra (Sondura Śrīkṛṣṇa Avadhūta) — sanskritdocuments'
  own attributions match — and "Kamalā is not independent" (it files Mahālakṣmī/Kamalā as one text).
  ~50 deities appear that the old audit never listed at all. Attribution is taken from index metadata and
  is **not yet verified against primary colophons** — that verification is the outstanding next step.

  **Written: `vishnu/25_vishnu_sahasranama_stotram.txt`** (corpus 684 → 704 files: this file plus the
  19-file `bhagavadgita/` folder added the same day. Both are now reflected in `PROJECT_TRACKING.md`,
  whose per-folder table reconciles exactly with the filesystem. Note the baseline is 684, not 694 —
  ten duplicates were merged and retired on 2026-09-05, see `DEDUP_AUDIT.md`). Built **wholly on sanskritdocuments**
  (`vsahasranew.html`, the Mahābhārata recension, 12 scan refs) after the audit showed stotranidhi's
  edition omits the entire nyāsa apparatus. 237 verse-blocks + a 1000-name index, all with
  deva/iast/en/tel/hi; zero TODOs. Sections: Maṅgalācaraṇam, Pūrvapīṭhikā, Pūrvanyāsaḥ (ṛṣi-chandas-
  devatā + viniyoga), Ṛṣyādinyāsaḥ, Karanyāsaḥ, Ṣaḍaṅganyāsaḥ (with the alternative sequence in full),
  Saṅkalpaḥ, Dhyānam, Stotram (108 ślokas), Uttaranyāsaḥ/Phalaśrutiḥ, Colophon.

  **Format decision (hybrid), agreed with the user:** sahasranāmas keep the corpus's per-verse
  deva/iast/en/tel/hi blocks and append a `--- names ---` index, one row per nāma:
  `N | devanāgarī | iast | en | tel | hi`. This supersedes the note under "File format" above that
  routed sahasranāma-type works away from the per-verse format to an unspecified "reference-list
  treatment" — that treatment is now defined and is this.

  **Method notes worth reusing.** (1) sanskritdocuments pages are Devanāgarī-only; IAST was produced by
  deterministic transliteration (`indic_transliteration`) then normalised to corpus conventions, and
  **verified character-identical** against stotranidhi's independently published IAST of the same
  recension — a genuine two-source validation, and a reusable technique for any Devanāgarī-only source.
  (2) The two nāmāvalīs carry the same 1000 names but differ in one split around name 664 (stotranidhi
  splits an extra `brahmāya`, hence its 1001 entries) and in orthography, where sanskritdocuments is
  consistently the sounder text (`agrahyāya`→`agrāhyāya`, `anhe`→`ahne`, `urjitāya`→`ūrjitāya`,
  `maheśvāsāya`→`maheṣvāsāya`, `śaśibindave`→`śaśabindave`). (3) sanskritdocuments numbers its nāmāvalī
  entries in the source, so name-splitting need not be inferred. (4) Source variant readings are carried
  inline on a new `variant:` line (verses 54, 61; phalaśruti 32).

  **Honest gap:** pañcapūjā is **absent** from the Viṣṇu recension and this is recorded in the file's
  front-matter as a real feature of the tradition, not an omission — the laṁ/haṁ/yaṁ/raṁ/vaṁ/saṁ
  bhūta-tattva offerings belong to Śākta/Śrīvidyā upāsanā. Lalitā's `lalitacomplete.html` does carry the
  full set. For Gaṇeśa, viniyoga is confirmed but nyāsa is **not** — the apparent hit is inside a verse
  (विना न्यासं विना जपम्), so it stays open.

  **Not done this session:** Śiva, Lalitā and Gaṇeśa sahasranāmas (the other three of the four the user
  chose) — sources for all three are fetched and validated but no files written. Primary-colophon
  verification of the 246 audit entries also outstanding.

  **Incidental finding:** 10 existing corpus files still contain the raw `:’` avagraha artefact that the
  2026-09-05 normalization pass missed; the corpus convention is the straight apostrophe (473 files).

### 2026-09-07 (session 2) — Lalitā Sahasranāma finished

Completed the fourth flagship. `devi/lalita/36_lalita_sahasranama_stotram.txt`,
377 verse blocks + 1000-name index, no TODOs. All four sahasranāmas
(Viṣṇu, Śiva, Mahāgaṇapati, Lalitā) are now in the corpus.

**Method note — name glosses.** 867 of the 1000 English glosses were taken from
the per-verse `en:` meanings I had already authored, matched by *exact* IAST
string between the name's derived nominative stem and the parenthetical gloss in
the verse line. This is an exact-match harvest, not the greedy aligner that was
abandoned on the Viṣṇu file; a name either matched a stem exactly or fell through
to hand authoring. The remaining 133 were written by hand. Telugu and Devanāgarī
columns are deterministic transliterations of the nominative stem
(`indic_transliteration`), with a uniform anusvāra normalisation
(`ṅ ñ ṇ n m` + stop → `ं` / `ం`) so the index matches the verse lines.

**Source integrity — RETRACTED 2026-09-08, see below.** The nāmāvalī parse
produced four entries that looked like parser garbage: `tasmai | tubhyaṁ | ayyai`
at 425–427 and `sādhune | yai` at 711–712. I checked stotranidhi's nāmāvalī,
found identical readings at identical positions with agreeing decade markers,
and concluded these were genuine received readings. **That conclusion was wrong**
— see the 2026-09-08 entry.

**Cleanups applied.** Three blocks of English page-commentary had leaked out of
the sanskritdocuments HTML into the block list (one whole spurious Phalaśruti
block, plus junk lines heading the last dhyāna and the closing `oṁ tat sat`);
these were removed and the closing colophon restored. 22 lines carrying stray
U+200D were stripped — the same ZWJ class of defect flagged in
`LALITA_UPLOAD_AUDIT_2026-09-07.md`.

**Still open (unchanged from session 1).**
- Primary-colophon verification of all 246 sahasranāma entries in the audit.
- The untracked `bhagavadgita/` folder (19 files) still needs a tracking decision.
- ~~10 existing corpus files still carry the raw `:’` avagraha artifact~~ —
  **done 2026-09-08.** Recount: the real figure was **51 instances across 8
  files**, not 10 files; my earlier count had conflated genuine defects with
  header prose that merely quotes the artifact while documenting its removal.
  Affected: `shiva/07_shivanandalahari.txt` (24), `guru/07_yatiraja_vimsati.txt`
  (20), `devi/dasamahavidya/14_tripura_bhairavi_kavacam.txt` (3),
  `ayyappa/05_hariharaputrashtakam.txt` (3),
  `ayyappa/06_shabarigiripatyashtakam.txt` (1). Every instance was in an `iast:`
  content line only; the Devanāgarī was correct throughout.
  Validated before editing: all 51 sat after a vowel (e/o/ā), and in all 38
  affected verse blocks the Devanāgarī `ऽ` count equalled the IAST apostrophe
  count — so each was a true avagraha, not a visarga. Parity re-verified after
  the edit; zero residual artifacts corpus-wide. `en:`/`hi:`/`tel:` lines were
  left untouched so English possessives were not damaged.
- 2026-09-08 — **Durgā Saptaśatī, Adhyāya Catuṣṭayam** (4 files, 330 verses) — new folder
  `stotras/devi/durga_saptashati/`: adhyāyas 1 (Madhukaiṭabha Vadha, 104), 4 (Śakrādi Stuti, 42),
  5 (Devī Dūta Saṁvāda, 129) and 11 (Nārāyaṇī Stuti, 55). Scoped to these four at the user's
  direction: they are the *Adhyāya Catuṣṭayam* (Stotra Catuṣṭayam), the four hymn-bearing
  chapters the tradition holds need no upadeśa — anyone may recite them observing ordinary śuci.
  That framing is stated once in the set rather than repeated in all four files.
  **THIS ROUND CHANGED THE SOURCING RULE — see `CLAUDE.md` and the revised "Sourcing chain"
  above.** The user's instruction: stotranidhi must not be the only source; go to the most
  authentic edition, Gītā Press if that is it. Acted on immediately and retroactively as policy.
  **Sourcing.** Base text stotranidhi (Devanāgarī). Collated in full against two independent
  witnesses: **Gītā Press, Gorakhpur** (archive.org scan `ExEg_shri-durga-saptashati-gita-press-
  gorakhpur`, `_djvu.txt` full text) and **GRETIL**'s Mārkaṇḍeya Purāṇa
  (`sa_mArkaNDeyapurANa1-93`, IAST). Character agreement with GRETIL 96.2–97.9%.
  **19 readings corrected** against those witnesses — none of which stotranidhi alone would have
  surfaced. Gītā Press's *editorial footnotes recording pāṭhāntaras* proved the single most
  valuable thing in the scan, settling 1.12 ममत्वाकृष्टमानसः → ममत्वाकृष्टचेतनः, 1.57
  प्रभावा/स्वभावा, and a disputed half-verse outright. Gītā Press Devanāgarī OCR is badly
  degraded (conjuncts, vowel signs, visarga) — usable for readings and verse division, never as
  clean text; a few loci were too mangled to settle and fell back on the vulgate.
  **Verse division.** GRETIL prints the same words as 587 verses across adhyāyas 81–93; the
  Saptaśatī's 700 is a *ritual* division counting standalone `uvāca` lines as verses and
  splitting some ślokas. Gītā Press prints the 700-division, which is what these files follow —
  and stotranidhi's 13 chapters parse to exactly 700, corroborating it. The two editions cannot
  be aligned by verse number; collation was by content.
  **Dedup.** Chapters 1, 5 and 11 contain passages already in the corpus as standalone stotras
  (`devi/durga/14_tantrokta_ratri_suktam`, `06_aparajita_stotram`, `34_narayani_stuti`). All
  three KEPT — the tradition anthologises them separately — and the translators were given those
  files so the renderings agree. Logged in `DEDUP_AUDIT.md`.
  **QA.** 16 batches translated then independently re-checked (13 corrections). Refrain
  discipline was checked explicitly: the 21 "yā devī sarvabhūteṣu" verses and 16 "nārāyaṇi
  namo'stu te" verses use an identical frame with only the varying term changing, and preserve
  the śabditā/abhidhīyate ("called by the name X") vs. rūpeṇa saṁsthitā ("in the form of X")
  distinction. 29 speaker lines, 0 prefix mismatches. 0 pronoun-capitalisation fixes needed
  (the Gītā round's lesson was carried into the style guide).
  **Not written:** adhyāyas 2, 3, 6–10, 12, 13 (370 verses, would complete the 700), and the
  Prādhānika / Vaikṛtika / Mūrti Rahasyams (93 verses) — all fetched and parsed already, sitting
  in the scratchpad. Ritual apparatus (pūrva/uttara nyāsa, pārāyaṇa vidhi, navārṇa vidhi)
  excluded as procedural, consistent with corpus scope rules.
- 2026-09-08 (second round) — **Durgā Saptaśatī completed** (+12 files, 463 verses; folder now
  16 files / 793 verses). Added adhyāyas 2, 3, 6–10, 12, 13 (370 verses, bringing the Māhātmya to
  **exactly 700** — the saptaśatī of the title) and the three appended Rahasyams: Prādhānika (29),
  Vaikṛtika (39), Mūrti (25).
  **Sourcing, per the rule now in `CLAUDE.md`.** Gītā Press, Gorakhpur as authority throughout;
  GRETIL's Mārkaṇḍeya Purāṇa as the independent second witness for the adhyāyas. **GRETIL does
  not carry the Rahasyams** — they sit outside the Purāṇa proper — so sanskritdocuments.org was
  used for those three instead. Agreement with the second witness: 88.3–99.1% (the Mūrti
  Rahasyam lowest, genuinely, its recensions diverge).
  **44 readings corrected this round, 63 across both rounds.** As in round one, Gītā Press's
  *pāṭhāntara footnotes* did most of the work — at 2.60 the base's सेनानुकारिणः is explicitly
  the reading Gītā Press rejects (it prints शैलानुकारिणः and footnotes सेनानु°/शल्यानु°/डोलानु°
  as demoted variants), and GRETIL independently agrees. Its **colophon verse-tallies** were an
  unplanned bonus: each chapter prints उवाच n, श्लोकाः n, एवम् n plus a cumulative
  एवमादितः — confirming both each chapter's count and the running total (ch2 एवम् ६९,
  एवमादितः १७३ = 104 + 69). That is what corroborates the 700 independently of stotranidhi.
  **Gītā Press slicing gotcha:** chapter 10's heading OCRs as `दरामोऽध्यायः`, so an ordinal regex
  silently matches inside `एकादशोऽध्याय` and returns a stub slice. All 13 boundaries were pinned
  by explicit offset instead. Worth remembering for the next Gītā Press text.
  **Three agent defects caught by post-checks, not by the audit lenses** (which returned clean):
  frames echoed the field label into the value ("Author: Author: …") in 9 files; chapters 9 and 10
  claimed a dhyāna they do not have; chapters 6 and 13 called the third division the "uttara"
  carita (it is the **uttama** carita). All fixed in `prep_frames2.py`'s sanitiser — a lens for
  "does this header claim front matter the file actually contains?" would be worth adding next time.
  **Remaining for this folder: nothing.** Ritual apparatus (pūrva/uttara nyāsa, pārāyaṇa vidhi,
  navārṇa vidhi, Saptaśatī nyāsa) deliberately excluded as procedural, consistent with corpus
  scope rules. The Saptaśatī aṅgas (Kavacam, Argalā, Kīlaka, Saptaślokī, Rātri Sūktam, Siddha
  Kuñjikā, Aparādha Kṣamāpana, Caṇḍikā Dhyānam, Devī Atharvaśīrṣa) were already in `devi/durga/`.

### 2026-09-08 — Gita Press collation overturns yesterday's Lalitā verdict

The user supplied a scan of **Gita Press, *Sahasranāmastotrasaṅgraha*, Gorakhpur,
no. 1594** (815 pp., 22 sahasranāmas each with nāmāvalī, plus 6 śatanāmas;
Lalitā stotra pp. 632-651, nāmāvalī pp. 652-671). Collating the Lalitā nāmāvalī
against it **overturns the "cleared, nothing was fixed" verdict recorded
yesterday.** The file had two real defects and has been corrected.

**Where yesterday's reasoning failed.** I treated agreement between
sanskritdocuments and stotranidhi, plus their matching decade markers, as
confirmation by two independent witnesses. They are not independent — they share
a common digital ancestor, and their decade markers only prove a shared counting
scheme, not a correct reading. The decisive check was available without any
print source and I did not make it: **a nāmāvalī entry must correspond to a word
in the stotra.** `tasmai | tubhyaṁ | ayyai` corresponds to nothing in śloka 91
(`tattvāsanā tattvamayī pañcakośāntarasthitā`), and `sādhune | yai` to nothing
in śloka 138 (`sampradāyeśvarī sādhvī gurumaṇḍalarūpiṇī`). Both are manglings
of a single name. The "mahāvākya expansion" reading I offered was invention.

**Five divergences found; Gita Press followed at all five.**
| # | Online (both sites) | Gita Press | Verdict |
|---|---|---|---|
| 1 | 425-427 तस्मै \| तुभ्यं \| अय्यै | 425 तत्त्वमय्यै | online corrupt — restored |
| 2 | 454 लोलाक्षीकामरूपिण्यै | 452-453 लोलाक्ष्यै \| कामरूपिण्यै | split adopted |
| 3 | 525 हंसवतीमुख्यशक्तिसमन्वितायै | 524-525 हंसवत्यै \| मुख्यशक्तिसमन्वितायै | split adopted |
| 4 | 683 शोभनासुलभागत्यै | 683-684 शोभनायै \| सुलभायै गत्यै | split adopted |
| 5 | 711-712 साधुने \| यै | 712 साध्व्यै | online corrupt — restored |

Net zero: the index still totals 1000, and its numbering now matches Gita Press
exactly from name 1 through name 712. Glosses were remapped with the names; the
five affected entries were re-glossed by hand. A recension note documenting all
five divergences was appended to the file, and the header now cites the print
edition. Convention checks re-run clean.

**Left unfinished, deliberately flagged rather than papered over:** the Gita
Press nāmāvalī runs to **1001**, not 1000 (ending १००१ ॐ ललिताम्बिकायै नमः), so it
carries one further split somewhere after name 713 that I have not located. This
file keeps the canonical 1000; its tail numbering is therefore one behind Gita
Press. That residual collation is open.

**Wider consequence for the audit.** The three other flagship sahasranāmas
(Viṣṇu, Śiva, Mahāgaṇapati) were built from the same online sources by the same
method and have **not** been collated against print. Gita Press covers all of
them — Viṣṇu (2, p. 38), Śiva (3, p. 70), Gaṇapati (1 gakārādi p. 1; 22
Vakratuṇḍa Mahāgaṇapati p. 741) — as well as Durgā, Sūrya, Rāma, Kṛṣṇa,
Lakṣmīnṛsiṁha, Gopāla, Rādhākṛṣṇa, Hanumān, Gāyatrī, Gaṅgā, Yamunā, Lakṣmī,
Annapūrṇā, Sītā, Rādhikā, Bhavānī and Dattātreya. The same class of defect
should be assumed present until checked. This supersedes the "primary-colophon
verification" item as the priority: a name-level collation is what actually
catches these.

**Also relevant to an earlier finding.** The book's निवेदन (p. 6) prints a general
पञ्चोपचार मानस-पूजन (lam pṛthivyātmakaṁ gandhaṁ … saum sarvātmakaṁ sarvopacārān)
prescribed for use with *any* of the 22 sahasranāmas, alongside viniyoga and
aṅganyāsa. This bears on the earlier conclusion that pañcapūjā is simply absent
from Vaidika-Paurāṇika recensions: the print tradition supplies it as a general
apparatus rather than embedding it per-text.
- 2026-09-08 (third round) — **Durgā Saptaśatī re-collated against the PRINTED Gītā Press edition.**
  The user supplied the book itself as a PDF (*Śrī Durgā Saptaśatī, sthūlākṣarair mudritā*,
  mūlabhāgapāṭhavidhisahitā, 21st edn., Saṁvat 2052). It replaces the degraded archive.org OCR that
  rounds one and two had used, and it changed the text materially. **Folder now 795 verses, not 793.**
  **The OCR had been wrong once.** At 2.60 rounds 1-2 adopted शैलानुकारिणः; the print reads
  **श्येनानुकारिणः** — the asuras falling *like hawks*, not *like mountains* — and lists शैलानु° among
  the variants it explicitly demotes. The OCR had turned श्येना into शैला. Reversed. Of the 63 readings
  adopted from OCR, 62 were confirmed and 1 refuted; 40 further corrections were then applied.
  **Gaps the web sources never had.** GRETIL carries only the Purāṇa's verses, so no collation had ever
  examined front matter — it rested on stotranidhi alone. Against the print: the three viniyoga passages
  are worded differently (चरित्रस्य not चरितस्य, "ऋग्वेदः स्वरूपम्" not "ऋग्वेद ध्यानम्", "जपे विनियोगः"
  not "पारायणे विनियोगः"); the ch2 Mahālakṣmī dhyāna reads **प्रसन्नाननां** not प्रवालप्रभां; and Gītā
  Press prints **a dhyāna before every adhyāya**, of which we had only three. All ten missing dhyānas
  transcribed from the print and translated.
  **Prādhānika Rahasyam was incomplete.** We were missing print v.10 (सा प्रोवाच महालक्ष्मीं…) entirely
  and divided the close differently: 29 verses where the print has 31. Rebuilt to 31 from the print.
  Verse divisions in ch8, ch11 and ch15 also realigned to the print (totals unchanged); ch15 v33 dropped
  a line the print does not carry, which is what makes the print's division come out to the same 39.
  **A useful distinction learned:** Gītā Press prints supplementary lines **inside round parentheses** —
  its marker for material outside the 700-verse reckoning. Two such passages in the Mūrti Rahasyam are
  now carried as printed (one inside v.11, one unnumbered before the colophon) rather than being
  numbered as verses, which is why ch16 stays at 25.
  **What the print settles that nothing else could:** each adhyāya ends with its own arithmetic —
  उवाच n, अर्धश्लोकाः n, श्लोकाः n, एवम् n, एवमादितः n. All 13 match our counts, and the cumulative
  running totals chain correctly (104, 173, 217 … ). The 700 is now the edition's own reckoning, not
  our inference. **For future texts: prefer the printed Gītā Press PDF over any archive.org OCR of it —
  the OCR is good enough to find loci, not to settle them.**

### 2026-09-08 (cont.) — Gita Press collation of the other three flagships

Collated Viṣṇu, Śiva and Mahāgaṇapati against Gita Press no. 1594. Method: check
name-index numbering against GP at sampled anchors (any split or merge shifts all
later numbers, so anchor drift localises structural divergence), plus an automated
check that every nāmāvalī entry's stem occurs in the file's own Stotram section.
Recension match confirmed first in each case — GP's Śiva is the same Mahābhārata
Upamanyu/Vāsudeva recension as ours; GP's item 22 is the same Vakratuṇḍa
Mahāgaṇapati text.

**Viṣṇu — numbering sound, one reading defect fixed.**
Anchors aligned across 1-110, 465-580 and 697-812. One real defect, caught by an
orthography scan rather than by GP: name 700 read `सद्कृतये / sadkṛtaye`, an
impossible conjunct; the file's own śloka reads `सत्कृतिः` and its verse gloss
says so. Corrected to `सत्कृतये / satkṛtaye`, confirmed by GP 700.
Not yet sampled: 110-465 and 812-1000.

**Śiva — eight reading defects fixed; one structural problem UNRESOLVED.**
Fixed (each confirmed against both GP and this file's own stotra text):
  47  अन्तर्हितत्मने → अन्तर्हितात्मने     484 महजिह्वाय    → महाजिह्वाय
  520 कञ्चनच्छवये  → काञ्चनच्छवये        663 कुलकर्त्रे   → कूलकर्त्रे
  669 वकिलाय       → वकुलाय              826 सुछत्राय     → सुच्छत्राय
  827 विरव्यातलोकाय → विख्यातलोकाय        964 नरऋषभाय     → नरर्षभाय
  971 शिभनाय       → शोभनाय
(tel/hi columns updated with each; several had carried the corrupt stem.)
**Unresolved:** numbering aligns with GP at 1-114, 475-598, 798 and 845-967, but
runs **+1 against GP between roughly 647 and 671** — GP 667 वृक्षाय = ours 668,
GP 670 छदाय = ours 671. Entry 647 is a bare `ये`, which corresponds to nothing in
the stotra and is very likely a parse artifact off `पुण्यचञ्चुरी`; that would be
the +1. Since alignment is restored by 798, there must also be a compensating
merge somewhere in 672-797 that I did not find. **Deliberately not "fixed":**
deleting 647 alone would break alignment for 672-797. Needs a full page-by-page
collation of GP pp. 86-102.

**Mahāgaṇapati — index alignment is not the right test; GP enumerates 1019.**
Anchors align 1-102, then drift steadily: −5 by GP 220, −6 by GP 255, −13 by
GP 545. GP's nāmāvalī ends at **१०१९**, ours at 1000. This is a systemic
difference in how finely the compounds are split, not a corruption, so
name-number correspondence with GP is meaningless for this text and only
reading-level checks apply. One reading defect fixed: 540 `परस्मै धाम्मे /
dhāmme` → `परस्मै धाम्ने / dhāmne` (dhāman, dative dhāmne), confirmed by GP.
Still suspect, not resolved: 458 `ग-स्थाय` (stray hyphen in an acrostic name),
613 `लानप्रियाय` (no such word; likely ललनाप्रिय or लीलाप्रिय), 815 `वष` and
816 `नमो` (both look truncated — the hi column reads वषट् / नमः).

**Lalitā — further corrections beyond the morning's five.**
Two reading defects found by the stotra-membership check and confirmed by GP:
510 `बन्दिन्यादि-` → `बन्धिन्यादिसमन्वितायै` (śloka 105 reads bandhinyādi-), and
667 `निद्वैतायै` → `निर्द्वैतायै` (śloka 131 reads nirdvaitā, GP 667 likewise).
Also **a defect I introduced and have now repaired**: my first anusvāra
normalisation pass used the range `क-ह`, which wrongly converted `न्`/`म्` to
anusvāra before य र ल व श ष स ह as well as before stops, damaging the Telugu and
Devanāgarī columns of 32 name rows (`समन्विता` → `समंविता`, `रम्य` → `रंय`).
The index was rebuilt from the IAST stems with the correct rule (anusvāra only
before क-म). Verified: the other three files were built by the earlier, correct
pipeline and their apparent hits are all legitimate anusvāra (संवत्सर, सिंह,
दंष्ट्र, अंशु). Name 547 बर्बरालकायै is left standing although the stotra reads
बन्धुरालका — GP prints बर्बरालकायै in the nāmāvalī too, so both readings are
attested and the divergence is the tradition's, not ours.

**Method note.** The automated "does every name occur in the stotra" check is
what found most of these, but it is noisy: sandhi absorbs vowel-initial and short
names, so it yielded ~90-130 candidates per text of which only a handful were
real. It is a triage tool, not a verdict. Conversely, my own OCR of the scan was
wrong several times (read अह्ने as अग्रे, महोरस्काय as महारस्काय,
चन्दनाङ्गदिने as चन्द्रांशुदिने) — every fix above was therefore required to
agree with the file's own stotra text as well as with GP, and no fix rests on the
scan alone.

**Priority left open:** finish the Śiva 647/672-797 structural collation, and
decide whether the Gaṇeśa index should be re-split to GP's 1019 or stay at 1000.

**Cleanup applied across all four flagships (2026-09-08).** Stray U+200D was still
present in Viṣṇu (16), Śiva (20) and Gaṇeśa (4). Stripping it is *not* sufficient
on its own: the joiner sat inside `श‍ृ`, and the transliterator had already emitted
`śa‍ṛ` for it, so a bare strip leaves the impossible `śaṛ` (`śaṛṇu` for `śṛṇu`,
`mahāśaṛṅgaḥ` for `mahāśṛṅgaḥ`). Both steps were applied: ZWJ removed, then
`śaṛ` → `śṛ` — 8 in Viṣṇu, 10 in Śiva, 2 in Gaṇeśa, 11 in Lalitā (whose ZWJ had
been stripped this morning, leaving exactly this residue). One token was
deliberately excluded: `gaṇeśaṛṣiḥ` in the Gaṇeśa viniyoga, where the Devanāgarī
genuinely reads गणेशऋषिः without sandhi, so the `aṛ` there is correct.
All four files now pass: contiguous name numbering, six fields per row, and zero
`ṃ` / `ē` / `ō` / `r̥` / ZWJ / ZWNJ / TODO.


---

## Session 2026-09-08 (evening) — first vidhi files; format extended

**New folder `stotras/vidhi/`, five files, 102 units.** Transcribed from a user-supplied
scan of **Gītā Press, Gorakhpur, book code 210**, *संध्योपासनविधि, तर्पण एवं
बलिवैश्वदेवविधि (मन्त्रानुवादसहित)*, saṁ. 2064 twelfth reprint, ISBN 81-293-0220-9, 52 pp.
Read from the **page images**, not OCR.

- `01_sandhyopasana_vidhi.txt` — 36 units (pp. 3–20)
- `02_sandhyakala_nirnaya.txt` — 7 units (pp. 21–22)
- `03_tarpana_vidhi.txt` — 39 units (pp. 23–41)
- `04_balivaisvadeva_vidhi.txt` — 14 units (pp. 42–46)
- `05_samkshipta_bhojana_prayoga.txt` — 6 units (pp. 47–48)

**Format extension — one field, `vidhi:`.** These are ritual manuals, not stotras: prose
instruction punctuated by mantras. The five translation fields are unchanged; a single
`vidhi:` field was added ahead of `deva:`, carrying the instruction that governs the mantra
(what to do, facing which way, how many times), taken from the book's own Hindi prose. Unit
headers read `--- unit N | section: X ---` rather than `verse N`, since the numbering is ours,
not the book's — the book numbers nothing. `hi:` follows the book's own anuvāda closely, a
Gītā Press Hindi rendering being authoritative here in its own right.

**Nāmāvalī handling.** Seven units are name-lists (devatarpaṇa, ṛṣitarpaṇa, divyamanuṣya-,
divyapitṛ- and yamatarpaṇa; the two closing namaskāra rows; the twenty numbered bhūtayajña
grāsa formulae). Per the standing rule these take reference-list treatment — whole list kept
as one unit in Devanāgarī and IAST, with `en`/`tel`/`hi` describing the list rather than
translating each name. They are load-bearing steps of the rite, so retaining them was
necessary; they were not forced into the per-verse shape.

**Collation actually performed.** Every mantra cited to the Śukla Yajurveda — 30-odd across
the four files — was collated word-for-word against the Mādhyandina Vājasaneyi-Saṁhitā on
**sa.wikisource.org** (`शुक्लयजुर्वेदः`, 16 adhyāyas pulled via the MediaWiki API; GRETIL
lists VS as restricted/TITUS-proprietary with no downloadable file, so it was unreachable).
That text carries the Uvaṭa–Mahīdhara bhāṣya and is a genuinely independent lineage.
**All readings matched.** One discrepancy found was in Wikisource's own apparatus, not the
text: its chapter 19 verse markers skip 19.67. GP's citation numbers are correct.

**Gaps recorded in the files rather than papered over.** No second witness was reachable for
the Taittirīya Āraṇyaka mantras (prāṇāyāma, sūryaśca mā manyuśca, āpaḥ punantu, agniśca mā
manyuśca, uttame śikhare), the Kātyāyana-pariśiṣṭa line, the paurāṇika/smārta ślokas, the
smṛti verses of file 02, ṚV 4.58.3 in file 04, or BhG 4.24 in file 05. Each file's
`Independent collation` block says which is which. **BhG 4.24 should be checked against this
corpus's own `bhagavadgita/` folder** — that is a cheap, obvious check that was simply not
made in this session.

**Open question left for the user: svaras.** Book 210 prints every mantra *without* accent
marks — it is a householder's āhnika manual, not a Veda-pāṭha edition — so these files have
none. See the sourcing rule below for where that landed.

### Śākhā split applied, and a new queue item (2026-09-08, evening)

`stotras/vidhi/` was restructured into `vidhi/madhyandina/` and `vidhi/taittiriya/` after the
user's ruling that sandhyāvandana must be kept separate by śākhā for the users who follow each.
All five book-210 files moved to `madhyandina/` and each gained a `Recension / śākhā:` header
saying explicitly that it is the North Indian Vājasaneyi-based form and not the universal one.
A defect was fixed in doing so: as first written the files said only "traditional smārta ritual
manual" and named no śākhā at all, which would have let a South Indian user take file 01 as
*the* sandhyāvandanam.

- [x] **Taittirīya (Kṛṣṇa-Yajurveda) Sandhyāvandanam** → written 2026-09-09 as `vidhi/taittiriya/01_krishna_yajurveda_sandhyavandanam.txt`, 42 units, accented throughout. South Indian form.
      Needs its own source — an Āpastamba- or Bodhāyana-sūtra based edition, **not** book 210,
      and **not** adapted from the Mādhyandina files. Check first whether Gītā Press publishes a
      Taittirīya/Drāviḍa sandhyā volume (that would be the authority per the standing rule); if
      not, use a printed South Indian edition, with stotranidhi's accented Taittirīya Veda pages
      as a collation witness. Recite-with-accent is normal in this tradition, so unlike the
      Mādhyandina set this one probably *should* carry svaras from the outset.
- [ ] Taittirīya tarpaṇa-vidhi and bali-vaiśvadeva, same folder, same sourcing constraints.

#### Taittirīya sourcing — reconnaissance done 2026-09-08, all URLs verified live

**Gītā Press does not publish a Taittirīya sandhyāvandanam.** An archive.org search on
`creator:"Gita Press"` for sandhyā/Taittirīya titles returns 13 hits: every "Taittirīya" one is
the *Taittirīya Upaniṣad with Śaṅkara-bhāṣya* (a philosophical text, not a rite), and every
"sandhyā" one is the North Indian Hindi manual. GP is a North Indian house; this is expected.
**So the "GP is the ultimate source" rule does not bind for the Taittirīya set** — it falls
through to tier 2/3, and a printed South Indian (Āpastamba/Bodhāyana) edition remains a genuine
gap that nothing online fills.

*Bonus find:* our own book 210 is on archive.org as
`byyw_sandhya-upasan-vidhi-aur-tarpan-evam-bali-viswa-dev-vidhi-edited-by-vidyadhar-sh`
(with `_djvu.txt`). All five `madhyandina/` files now cite it alongside the local scan.

**Recommended split of duties for the Taittirīya set:**

1. **Accented Vedic text → `sanskritdocuments.org/doc_veda/taittirIyaAraNyaka.html`.** Verified:
   HTTP 200, **236,935 Devanāgarī characters, 36,745 accent marks** — the full accented TĀ.
   `taittirIyasamhitA.html` and `taittirIyabrAhmaNam.html` are likewise accented (a
   `...niHsvaraH` unaccented variant of the Brāhmaṇa exists — do not grab that one by mistake).
   This is the Taittirīya counterpart of what Wikisource's Uvaṭa–Mahīdhara blocks were for
   Mādhyandina, and it also **closes the collation gap in the `madhyandina/` files**, whose five
   TĀ-cited mantras I recorded as having no reachable second witness. GRETIL had listed TĀ as
   restricted/TITUS-only; sanskritdocuments has it in the clear.
2. **Rite structure and sequence → `stotranidhi.com/krishna-yajurveda-sandhya-vandanam-in-telugu/`.**
   Verified: HTTP 200, 15,203 Telugu characters, **895 accent marks**, 345 content lines, with the
   real ritual divisions (`భూతోచ్ఛాటనము` etc.). This is where stotranidhi genuinely earns its
   place — a saṁhitā gives text but never the *order of service*, and this page does.

**Cautions, all confirmed by fetching rather than assumed:**
- That stotranidhi page exists **only in Telugu script**. `-in-sanskrit`, `-in-hindi`,
  `-in-english`, `-in-kannada`, `-in-tamil` all 404. Note the slug has **no `/en/` prefix**,
  unlike most stotranidhi URLs. So the `deva:` field must come from the accented sanskritdocuments
  TĀ, not from transliterating the Telugu — mechanical Telugu→Devanāgarī transliteration of
  *accented* text is exactly the kind of silent corruption this corpus forbids.
- The page carries a note reading `(శ్లోకాలు మాత్రమే)` — "ślokas only" — pointing at their printed
  *Śrī Gāyatrī Stotranidhi*. **Check whether the web page is an abridgement before relying on it
  for completeness.**
- `sanskritdocuments.org/doc_veda/shuklayajurvedIyasandhyA.html` is listed in their index as
  carrying Vedic accents. **It does not** — fetched, 9,084 Devanāgarī characters, **zero** accent
  marks. Do not trust that index's accent claims without fetching. (It is still useful as an
  unaccented Śukla-Yajurveda sandhyā comparandum for the `madhyandina/` set.)
- sanskritdocuments returns HTTP 406 to a bare curl/WebFetch UA; a normal browser User-Agent works.

---

## Session log — 2026-09-08 (fourth round): the Gītā Press Saptaśatī pārāyaṇa apparatus

The earlier Saptaśatī rounds wrote the 700 verses and the three Rahasyams but **excluded the
ritual apparatus as procedural**. The user reversed that ("did we leave the saptasatis puja
apparatus? we shoud finish that"), and the reversal is right: in the printed volume the vidhi is
not an appendix, it is part of the pāṭha.

Diffing the book's own विषय-सूची against `devi/durga/` found **twelve** printed sections absent
from the corpus. All twelve are now written (`devi/durga/37_`–`48_`), 217 units total:

| file | section | units |
|---|---|---|
| 37 | श्रीदुर्गाष्टोत्तरशतनामस्तोत्रम् (Viśvasāratantra) | 25 |
| 38 | पाठविधिः | 31 |
| 39 | **वेदोक्तं** रात्रिसूक्तम् (ṚV 10.127) | 12 |
| 40 | नवार्णविधिः | 21 |
| 41 | सप्तशतीन्यासः | 24 |
| 42 | **ऋग्वेदोक्तं** देवीसूक्तम् (ṚV 10.125, Vāk/Ambhṛṇī) | 10 |
| 43 | तन्त्रोक्तं देवीसूक्तम् (DM ch.5) | 30 |
| 44 | क्षमा-प्रार्थना | 9 |
| 45 | दुर्गाद्वात्रिंशन्नाममाला | 6 |
| 46 | सप्तशतीके कुछ सिद्ध सम्पुट-मन्त्र | 32 |
| 47 | श्रीदेवीजीकी आरती (Hindi) | 14 |
| 48 | देवीमयी (Abhinavagupta) | 3 |

Two of these are **not** procedural and their absence was a straightforward gap: the corpus had
the *tantrokta* Rātri Sūkta but not the **Vedokta** one, and neither Devī Sūkta at all.

**Sourcing.** Single witness by design — the printed Gītā Press volume, read from page images.
Every one of the twelve says so in those words in `Source / recension`; none implies a collation
that did not happen. GRETIL carries none of this material, so there was nothing to collate
against. A future collation against another printed edition is owed and is flagged in each file.

**Printed defects retained, not emended** (single witness — nothing to emend *against*): in 38,
mantra 13 prints `ब्रहवसिष्ठ°` for `ब्रह्मवसिष्ठ°`, the Kātyāyanī-tantra quotation in the p.12
footnote is garbled beyond recovery as printed, and the saṅkalpa carries several compositor's
run-togethers (`देवधर्थशीर्ष°` for `देव्यथर्वशीर्ष°`, `सर्वापत्रिवृत्ति°` for `सर्वापन्निवृत्ति°`).
Flagged in-line; the IAST necessarily transliterates the corruption.

**Format defect caught in review, not by the agents' own audits:** file 46 had invented lettered
verse numbers `9a/9b/9c` — a convention no other file among 744 uses. The print numbers that item
once, as (९), with lettered sub-verses inside it; the three were merged into the single unit the
print numbers them as, bringing the file to **30 numbered units, matching (१)–(३०) exactly**. This
is the third round running in which an agent's self-audit returned "clean" on a file that had a
real defect. **Do not treat an agent's own verification as verification.**

**Tracking correction.** `PROJECT_TRACKING.md` claimed 742 files / 46 Durgā and asserted both
"reconcile exactly" with a `find` count. The true figures were **732 / 36** — ten Durgā files
were credited that had never been written. Corrected to counted truth (744 / 48) with the error
recorded in place.

#### DECIDED (user, 2026-09-08): stotranidhi is the source for the Taittirīya set

Source of record: `stotranidhi.com/krishna-yajurveda-sandhya-vandanam-in-telugu/`. Findings from
inspecting the page, two of which **correct cautions recorded earlier in this same log**:

1. **It is a complete rite, not an abridgement.** 371 content lines under **18 named sections**:
   śuciḥ, ācamana, bhūtocchāṭana, prāṇāyāma, saṅkalpa, mārjana, punar-mārjana, arghyapradāna,
   tarpaṇa, gāyatrī, mantra japa, japāvasāna, sūryopasthāna, diṅnamaskāra, muni namaskāra,
   devatā namaskāra, gāyatrī prasthāna prārthanā, pravara. The `(శ్లోకాలు మాత్రమే)` note flagged
   earlier is a pointer to their printed *Śrī Gāyatrī Stotranidhi*, **not** a statement that the
   web page is cut down. Earlier caution withdrawn.
2. **The Devanāgarī field is mechanically derivable, and the accents are not the risk.** The
   accent marks on that Telugu page are **U+0951 DEVANAGARI STRESS SIGN UDATTA (356) and U+0952
   ANUDATTA (539)** — the Devanāgarī combining stress signs applied over Telugu base characters.
   They transfer to Devanāgarī as *identical codepoints*. My earlier warning that transliterating
   accented text would be silent corruption was overstated for this case: the accents survive
   untouched, and only the base-glyph mapping is transliteration, which is deterministic.
   Still transliterate deliberately and verify, but this is not the blocker it was called.
3. **Handle ZWJ on purpose.** 5 × U+200D in the body, in the `ఓగ్‍ం` (oṁ) forms. This corpus has
   already been bitten once by ZWJ (see the `śa‍ṛ` → `śaṛ` incident in the 2026-09-08 cleanup
   note above): stripping it naively after transliteration leaves broken output. Decide the
   handling before the transliteration pass, not after.
4. The page has **no script switcher and no Devanāgarī sibling** — `-in-sanskrit`, `-in-hindi`,
   `-in-english`, `-in-kannada`, `-in-tamil` all 404, and the `/en/` and `/hi/` category pages
   return the same Telugu URLs. The whole sandhyāvandanam category is Telugu-only. Note the slug
   carries **no `/en/` prefix**, unlike most stotranidhi URLs.
5. **stotranidhi carries two sibling rites** worth knowing about:
   `rigveda-sandhyavandanam-in-telugu/` and `shukla-yajurveda-sandhya-vandanam-in-telugu/`. The
   latter is a potential *accented* comparandum for the `madhyandina/` set, which currently has
   none — but check its recension before using it, since a Telugu-site Śukla-YV sandhyā need not
   be the northern Mādhyandina form.

Sanskritdocuments' accented Taittirīya Āraṇyaka (36,745 accent marks) is **not** displaced by this
decision — it remains the obvious collation witness for the Vedic mantras within the rite, and it
independently closes the TĀ collation gap in the `madhyandina/` files.

---

## Session log — 2026-09-08 (fifth round): Rāmcaritmānas Sundarkāṇḍ from the Gītā Press text layer

New folder `rama/sundarkand/`, 12 files, **285 units / 1,209 verse lines**, validated 0 problems.
The first Awadhi text in the corpus — everything before it is Sanskrit.

**The source method is new and is the important part.** This PDF (Gītā Press code 1349) carries a
complete *embedded text layer* in the legacy Chanakya 8-bit typesetting encoding. That is the
typesetter's own characters, not an image of ink — strictly better than the page-image reading the
Saptaśatī required (that PDF has no text layer). Decoding it gave the whole 112,603-character
volume at **0 unresolved glyphs and 1 malformed sequence**.

**This inverts the working rule.** Memory said an archive.org OCR is good enough to locate a
reading but never to settle one — get the page image. That still holds for OCR. But an *embedded
text layer* outranks the page image: it is lossless and mechanically checkable. Check `pdffonts`
and `pdftotext` before assuming a Gītā Press PDF must be read by eye.

**How the encoding works** (worth keeping — Gītā Press uses Chanakya widely):
- Letters whose shape ends in a vertical stem are drawn as two glyphs, left-part + stem (`U`, `§`).
  One rule — *half-consonant + stem = the full consonant* — replaces a whole family of special cases.
- `ि` is typeset before its cluster; reph `¸` after its cluster; `Ì` and `K` carry an r-virama that is
  already in logical position and must NOT be reordered. Reph must be moved before the i-mātrā pass.
- `®` is a single combined `िं` glyph. ASCII codepoints also carry Devanāgarī (`S`=स्, `N`=हृ, `D`=ष्ठ,
  `r`=ह्म्), so a decoder that passes unknown ASCII through silently corrupts the text — 502 characters
  were being emitted as Latin before that was caught.

**Two verification layers, and the second caught what the first structurally could not.**
1. *Malformed-sequence sweep* — decode everything, then hunt for Devanāgarī that cannot exist (two
   mātrās in a row, a mātrā after a virāma). This caught four wrong glyph inferences: `@`=ञ्च not द्म
   (the title reads **पञ्चम सोपान**), `î`=ज्ज not ्थ (**सज्जन**, not स्थान), `C`=ष्ट not ःख (**दुष्ट**,
   not दुःख), `è`=भ् not ज.
2. *Collation against an independent witness* (DharmicData's digital Rāmcaritmānas) — **95.6% word
   agreement over 6,412 words**. This caught five more bugs that sweep (1) can never catch, because
   the wrong output was itself a legal Devanāgarī word: `®` mangling **सिंधु/तेहिं/करहिं**; `^Ô`=ट्ट not
   त्त; `Ô` a silent stem marker, not म (phantom म in **रघुपुङ्गव**); `Ì` being wrongly reordered
   (**मर्द** → र्मद); and the three opening ślokas being dropped entirely by a font-size filter.
   Later the closing colophon exposed a sixth: `#`=प्त not ण (**समाप्तः**, **प्राप्त**).
   **Lesson: a well-formedness check cannot validate a substitution cipher. You need a second witness.**

**Structure is the edition's own, not editorial.** Mūl and ṭīkā are separated by typeface — verse in
ChanakyaBold 19.7pt, commentary in regular Chanakya 16pt. Dohā labels are set in the *ṭīkā's* face,
so a naive bold-only filter loses every dohā heading. 60 printed dohā numbers span **63 dohā units**,
because 39, 49 and 56 are each printed split as क/ख.

**Defects found in review that the agents' own audits reported as clean** (fourth round running):
parts 2 and 4 transliterated candrabindu as `ṁ` where the corpus uses `m̐` — so all 285 IAST blocks
were regenerated mechanically from the Devanāgarī, which is the house rule anyway; and five files put
a blank line between `---` and `Recension note:`.

**Still owed for this volume:** the appendix stotras (pp.119–128) and the pārāyaṇ vidhi (pp.4–10).
Note that the corpus's `hanuman/02_hanuman_chalisa.txt` is a **different recension** from the Chālīsā
printed here — ours has Sanskritised `चरण`/`वरणौ`/`यश`, Gītā Press prints `चरन`/`बरनउँ`/`जस` and reads
line 33 as `राम लषन सीता मन बसिया`, not `लखन`. Collate, do not overwrite.

**Not usable:** a second "Gītā Press Sundarkāṇḍ" PDF supplied this session
(`131593504-Sundar-Kand-...`) is not a scan but a damaged legacy→Unicode conversion — 2,384 malformed
sequences, 2.27% of its characters; `सिंधु`, `लंका` and `पृथ्वी` occur zero times. Rejected as a witness.

### 2026-09-08 (cont.) — Gakārādi Gaṇapati Sahasranāma written

`ganesha/31_gakaradi_ganapati_sahasranama_stotram.txt`. 188 verse-blocks
(viniyoga, karanyāsa, dhyāna, 173 stotra ślokas, 11 phalaśruti, colophon) with
en/tel/hi meanings throughout. Rudrayāmala, Mahāguptasāra, Śiva–Pārvatī saṁvāda.

**Confirmed distinct from `ganesha/29`.** Gita Press prints two Gaṇeśa
sahasranāmas because they are two compositions. Item 1 is this gakārādi
acrostic — every one of its thousand names begins with ग (GP p. 25 runs
गोत्रदैवत, गोत्रविख्यातनामन्, गोत्रिन्, गोत्रप्रपालक … unbroken). Item 22 is the
Vakratuṇḍa Mahāgaṇapati text already in the corpus as file 29, arranged
alphabetically across the whole syllabary (ज → ठ → ड → त → द → ध → न → प).
Twelve sampled gakārādi names appear nowhere in file 29, and only 4% of file
29's names begin with ग.

**Also noted:** file 29's header attributes the text to Gaṇeśa Purāṇa
Upāsanākhaṇḍa; Gita Press's colophon reads
इति शाक्तप्रमोदान्तर्गतगणेशतन्त्रात् उद्धृता — extracted from the Gaṇeśatantra
within the Śāktapramoda. Both attributions circulate for the same text; file 29
currently gives only one, flatly. Worth qualifying.

**No name index, deliberately.** No nāmāvalī for this text exists digitally —
sanskritdocuments carries the stotra alone and stotranidhi does not carry the
text at all, so Gita Press pp. 19-37 is the only witness and it exists here only
as a page scan. Algorithmic splitting is not reliable for an acrostic: segmenting
at every ग following a halant gives **1019** against Gita Press's 1000, and the
excess is real ambiguity rather than a bug — गुणकृद्गुणभृत् is two names
(GP 149-150) while the identically shaped गुणवद्गुणसंतुष्टः is one (GP 210), and
nothing in the orthography separates them.

What the collation did establish: GP's nāmāvalī ends at exactly
१००० गुरुराज्यसुखप्रदाय, matching this file's last stotra name; numbering agrees
exactly for names 1-40; and ten merge points were pinned by offset arithmetic
(GP 41 गर्जद्गणसेनाय, 210, 216, 217, 221, 223, 229 गर्जद्गजयुद्धविशारदाय,
513 गोधुग्गणप्रेष्ठाय among them). The remaining nine were localised to intervals
but not individually resolved. An index right in most places and invented in the
rest is worse than none, so none was shipped.

**Two bugs found and fixed in the splitter along the way**, both worth recording
because they would recur on any acrostic text: the rule split the ङ्ग conjunct
in गणाङ्ग, and — more seriously — it split गर्ग (the sage Garga) into गर् + ग
throughout the Garga section, twenty-odd names. A minimum-length guard on the
left fragment fixed the latter.

**Open:** completing the name index needs an accurate transcription of the
nineteen Gita Press nāmāvalī pages. Transcription by eye from these scans proved
error-prone enough during this session's collation work that it was not trusted
for the purpose.

### 2026-09-08 (cont.) — both open items closed

**Śiva structural collation finished.** The +1 offset flagged earlier is
resolved. Two defects, each confirmed against Gita Press *and* against the
file's own stotra text:

  - Name 647 was a bare `ये`, corresponding to nothing in the stotra. Gita Press
    646 reads पुण्यचञ्चुरिणे — one name — where this file had पुण्यचञ्चवे + ये.
    The nāmāvalī source had split पुण्यचञ्चुरी across two entries. Merged.
  - Name 677 was `सिद्धार्थश्छन्दोव्याकरणोत्तराय`, two names run together with the
    sandhi unresolved. Gita Press splits them at 676 सिद्धार्थाय | 677
    छन्दोव्याकरणोत्तराय. Split.

The two are net-neutral, so the total stays 1008 — which is also where Gita
Press's nāmāvalī ends (१००८ जगते). A third defect surfaced during verification:
name 610 read अजैकपाते, but the stotra has अजैकपाच्च (stem अजैकपाद्, dative
अजैकपदे, as Gita Press prints); corrected. The file now agrees with Gita Press
at **46 anchors spanning names 1 to 1008**, with zero mismatches.

**Gakārādi name index completed.** The 1000-name index is now in the file. The
segmentation needed three guards beyond the obvious one — ङ्ग in गणाङ्ग, गर्ग
through the whole Garga section, and the element वर्ग in गर्गवर्ग / गर्भवर्ग —
after which it yields 1017 against Gita Press's 1000. Seventeen merges were then
identified individually against the print nāmāvalī, plus two corrections found
by a full anchor sweep: Gita Press splits गुरूरवे | गुरुपीनांसाय (379-380) where
the segmentation had one name, and merges गुडभुग्गणपाय (887) where it had two.
Twelve names still carried an enclitic (अथ, अन्वहम्, नित्यम्) attached by sandhi;
stripped.

Verified against **81 Gita Press anchors from 1 to 1000, all agreeing in
position**. Nine differ only orthographically (pausa त्/क् against the sandhi
stems द्/ग् that the dative exposes; one anusvāra spelling). One substantive
variant is recorded, not resolved: name 512 reads गोधुक् here against Gita
Press's गोदुह्.

The index is given in the **nominative**, not the dative archana form used by the
corpus's other sahasranāma files, because no digital nāmāvalī exists for this
text and converting a thousand nominatives to datives by rule would have meant
inventing morphology. Its Devanāgarī and `hi` columns therefore coincide.

Glosses: 955 harvested from this file's own per-verse meanings by exact IAST
match on the name stem, 45 written by hand. Several of the 45 fell through
because the source carries typographic slips — गुनवच्छत्रु, विनाष, विषारद,
गजाधीष, गुरुशेष्ठ, गानाहितघ्र — left as printed and documented rather than
silently emended.

Nothing from the earlier open list remains.


---

## Session log — 2026-09-08, sixth round: Sundarkāṇḍ front matter and appendix, and six decoder errors

The Gītā Press *Sundarkāṇḍ* (code 1349) volume is now written in full, pages 1–128. Six new files,
two collations, and a round of corrections to work already on disk.

**New.** `rama/sundarkand/00_parayana_vidhi.txt` (39 units — the editors' own pārāyaṇ sequence:
āvāhana-mantras १–११, viniyoga, ācamana, karanyāsa, hṛdayādi-nyāsa, dhyāna), `rama/sundarkand/
00_kishkindhakanda_doha_29_30.txt` (11), `rama/24_ramayanaji_ki_arati.txt` (5), `rama/25_janakinatha_ki_arati.txt`
(8), `hanuman/29_sankatamochana_hanumanashtak_awadhi.txt` (10), `hanuman/30_hanumanji_ki_arati.txt` (12).
Single-witness by necessity — the Gītā Press print is the only edition consulted for any of them, and
every file says so in those words rather than implying a collation.

**Two files I overwrote, and should not have.** `hanuman/02_hanuman_chalisa.txt` and
`rama/19_tulasidasa_krta_rama_stuti.txt` already existed. I rewrote both in place with the Gītā Press
recension, on the reasoning that Gītā Press outranks their stotranidhi source. **That was wrong**, and the
user said so: *"donot merge with prev written .. ask in case of conflict."* The authority rule decides which
reading you adopt in the file **you** are writing; it is not a licence to edit another session's file. Both
originals were recovered in full from the subagent transcripts (43 and 5 units, verified against what had
been on disk) and restored unchanged. The Gītā Press texts now stand as separate files —
`hanuman/32_hanuman_chalisa_gitapress.txt` (43 units) and `rama/27_rama_stuti_gitapress.txt` (9) — with
cross-references in all four directions saying that neither supersedes the other.

The recension difference is real and is exactly why keeping both is right: the print reads चरन / बरनउँ /
जसु and line 33 as *rāma laṣana sītā mana basiyā*, against चरण / वरणौं / यश and लखन on the web; in the
Rāma-stuti, GP reads नीरद "rain-cloud" where stotranidhi has नीरज "lotus" — a difference of sense that
neither witness settles alone. Merging would have destroyed that evidence, not resolved it. The Gītā Press
page also runs three Bālkāṇḍ units (the Gaurī-blessing passage) straight on after the fifth stuti verse with
no break; they are in file 27, sectioned separately, with the note saying openly that identifying them as
Rāmcaritmānas is an editorial judgement, not something the page states.

`CLAUDE.md` has been changed accordingly: the "Parallel sessions" instruction to *collate your witness into*
an existing file is replaced by **"Never rewrite an existing file from a new witness"** — separate file,
cross-reference both ways, ask the user on conflict, and the only permitted edit to another session's file
is an additive cross-reference. The restored `hanuman/02` carries 31 IAST departures from house convention
of its own (dropped daṇḍas, `ñ` for anusvāra, `kalesa` for कलेश); under the new rule those are reported
here and left alone rather than quietly fixed.

**A near-miss worth recording.** `hanuman/01_sankata_mochana_hanumadashtakam.txt` shares its title with
the Awadhi aṣṭak in this volume but is a **different work** — Sanskrit anuṣṭubh, incipit *tato'haṁ
tulasīdāsaḥ smarāmi*, against the mattagayanda *bāla samaya rabi bhakṣi liyo taba*. It was left untouched
and the two now cross-reference each other by incipit so no future session merges them.

**Six decoder errors, five of them already written into the twelve kāṇḍa files.** Sanskrit conjuncts that
never occur in Awadhi verse only surfaced when the front matter was decoded: `A` = ्न (अग्नि was decoding
as अगिन), `Û` = न्न् (प्रसन्न → प्रसन्ना), `T` = ञ्ज (पुञ्ज → पुल्ल), `s` = ह्य, `q` = ह्न, and `Ì` = a
**combined reph-plus-i-mātrā**, not a bare reph — so हर्षित decoded as हर्षत and मर्दि as मर्द. Six mūl
lines were corrected in files 01, 04, 06, 07 and 11, and four recension notes rewritten that had described
these as defects of the print. The volume now decodes at **0 unresolved glyphs and 0 malformed Devanāgarī
sequences** across all 128 pages, and every deva line in all twenty files was re-verified against that
decode mechanically.

**The methodological point.** The independent DharmicData collation *did* flag भिन्न/प्रसन्न, and I filed
them under orthographic noise; one agent went further and diagnosed प्रसन्ना as a decoding artefact in its
own recension note, and I overruled it on the grounds that the print is the authority. Both were right and
I was wrong. "The print is the authority" is a rule about **readings**; it says nothing about whether the
bytes in front of you are the print. A second witness disagreeing about a single vowel is still evidence
about your pipeline — the cheapest way to use it is to check the raw bytes for the disputed word, which
takes a minute and was not done.

**Tracking bug fixed.** `bin/recount.py` counted files recursively under every row, but `rama/sundarkand/`
has its own row *and* sits inside `rama/`, so those twelve files were counted twice: the "758" logged last
round was 12 too high. Each file is now counted once, against the longest row path containing it. **767**
is the first TOTAL in `PROJECT_TRACKING.md` that reconciles with `find`.

##### Guttural nasal — one spelling corpus-wide, `ग्ं` (user, 2026-09-12)

**Standing decision: the guttural nasal before a spirant is written `ग्ं` (U+0917 + U+094D +
U+0902) everywhere in this corpus.** It had been written two ways — `ग्ं` in `puja/smarta/`,
`veda/taittiriya/` and elsewhere, and `ᳪं᳭` (U+1CEA + U+0902 + U+1CED) in `vidhi/taittiriya/`,
`vidhi/kanva/`, `pitr/` and `veda/madhyandina/`. No file mixed the two, so each was internally
consistent, but the corpus carried two spellings of one sound in its primary column. `ग्ं` is
what the printed Veda editions use, and it is now the only form.

The 106 `ᳪं᳭` sites were changed on 2026-09-12, with the header prose, `vidhi/README.md`,
`veda/README.md` and the rule above updated to match. `bin/tel2dev.py` now emits `ग्ं`;
`bin/dev2tel.py` and `bin/dev2iast.py` still accept `ᳪं᳭` on input and map it the same way, so
an older source pasted in is normalised rather than rejected. Both forms have always produced
the same Telugu (`గ్ం`) and the same IAST (`gṁ`), so nothing downstream changed.

##### ZWJ / ōgṁ — resolved, no judgement call needed (2026-09-09)

The 5 × U+200D in the Taittirīya page are **not** an encoding defect and must **not** be stripped.
`ఓగ్‍ం` = `ఓ` + `గ` + U+0C4D VIRAMA + U+200D ZWJ + U+0C02 ANUSVARA, and spells **`ōgṁ`** — praṇava
whose anusvāra is realised as a guttural nasal. The ZWJ forces `గ్` into a conjoined half-form so
it reads as one nasal unit rather than the syllable "ga".

**It is phonetically conditioned, and the page is consistent about it:** `ఓగ్‍ం` occurs only before
`సువః` and `సత్యమ్` (both s-initial); plain `ఓం` occurs before `భూః, భువః, మహః, జనః, తపః, తత్స…`.
That is the classical rule — anusvāra before a spirant (s, ś, ṣ, h) becomes a nasalised guttural.
Stripping the ZWJ collapses `ōgṁ` into `oṁ` and destroys a real recitational distinction. The
earlier `śa‍ṛ` incident was a genuine ZWJ *defect*; this is the opposite case and the same fix
would be an error here.

**Field mapping (settled — this is not an editorial choice, the two scripts simply spell one sound
differently):**
- `tel:` — keep stotranidhi's `ఓగ్‍ం` exactly as printed, ZWJ included.
- `deva:` — use the Devanāgarī Vedic notation, attested in the accented Yajurveda already held:
  **U+0917 GA + U+094D VIRAMA + U+0902 ANUSVARA** (`ग्ं`), as the printed Veda editions
  write it — likewise before a spirant. Do **not** transliterate the Telugu
  ga+virama+ZWJ literally into Devanāgarī.
- `iast:` — render as `ōgṁ` / `gṁ`, distinct from plain `oṁ`.

**Consequence for the corpus-wide ZWJ check:** the standing "zero ZWJ/ZWNJ" cleanliness test that
the four flagship files pass must NOT be applied blindly to `vidhi/taittiriya/`. Exempt the `tel:`
field there, or the check will report correct text as broken and someone will "fix" it.

##### Taittirīya build — pipeline validated, two substantive findings (2026-09-09)

**Finding 1 — the stotranidhi page has a character-level encoding defect, and it is systematic.**
**28 occurrences of Latin `o` (U+006F) stand where the Telugu anusvāra `ం` (U+0C02) belongs** —
`రసోఽమృత॒o`, `సర్వ॑o`, `గర్భ॑o`, `త్వచ॑o`, `అక్షర॑o`, `పా॒ప॒o`, `ఆయూగ్॑oషి` and so on. Every case is
unambiguous (a Latin letter cannot occur in Telugu text, and each sits after an accent mark on an
anusvāra-final word), so the repair is mechanical and safe, but it must be **done and documented**
rather than silently carried into the corpus. This is exactly what the standing rule means by
"stotranidhi is not a critical edition": it is the right source for this rite and it still needs
proofing. **Collation against the accented Taittirīya Āraṇyaka is mandatory here, not optional.**

**Finding 2 — a genuine recension variant, and a vindication of the śākhā split.** The Gāyatrī
dismissal verse differs between the traditions:
- **Taittirīya:** `उ॒त्तमे॑ शिख॑रे जा॒ते॒ भू॒म्यां प॑र्वत॒मूर्ध॑नि` — *jāte*
- **Mādhyandina** (GP 210, already transcribed): `उत्तमे शिखरे देवि भूम्यां पर्वतमूर्धनि` — *devi*

Both are correct in their own recension. Under the corpus's ordinary "adjudicate the variant
against the vulgate and record the decision" procedure we would have wrongly collapsed one into
the other. **This is the concrete case the śākhā rule exists to prevent — do not reconcile it.**

**Pipeline built and validated** (`scratchpad/tel2dev.py`). Telugu→Devanāgarī is a clean
`-0x300` block offset (the two blocks are code-aligned), with three special mappings applied
*before* the offset:
- `గ్‍ం` / `గ్ం` / `గ్గ్` → `ग्ं` (U+0917 + U+094D + U+0902), the Devanāgarī spelling of the
  nasal-before-spirant, per the resolution recorded above.
- `”` (U+201D, the South Indian print convention) → `᳚` U+1CDA VEDIC TONE DOUBLE SVARITA.
- U+0951/U+0952 pass through untouched — they are already Devanāgarī codepoints.

Verified by round-tripping the Gāyatrī, `āpo hiṣṭhā`, `sūryaśca mā manyuśca` and
`agniśca mā manyuśca`; all four match the accented Taittirīya Āraṇyaka from
sanskritdocuments.org (36,745 accent marks) **including accent placement**.

*Also noted:* Taittirīya reads `आपो॒ हिष्ठा` as one word where Mādhyandina splits `आपो हि ष्ठा` —
another recension difference, not an error in either.

##### BhG 4.24 collation closed (2026-09-09)

The last open gap from the 2026-09-08 vidhi session. `brahmārpaṇaṁ brahma haviḥ` in
`vidhi/madhyandina/05` matches this corpus's own `bhagavadgita/04` verse 24 exactly — **but that
was not a valid collation**, because that Gītā file is itself transcribed from stotranidhi, and
the sourcing rule is explicit that two texts of one lineage are one witness, not two. Agreement
there proves only that stotranidhi agrees with itself.

Re-collated against **github.com/gita/gita** `data/verse.json` (tier 3, independent digital
corpus): matches character-for-character. Differences are non-substantive — the ritual file
prefixes `ॐ` as its use requires, and gita/gita prints `ब्रह्महविर्` unspaced. No variant reading.
GRETIL's Bhagavadgītā plaintext 404s; vedicscriptures.github.io returned nothing parseable.

*Generalisable point worth keeping:* when checking a quotation against this corpus's own files,
check what **that** file was sourced from first. A within-corpus match can look like collation
and be circular.

### 2026-09-09 — Gītā Press *Sahasranāma Stotra Saṅgraha* (1594), text 15: Lakṣmī

Written: `devi/lakshmi/34_lakshmi_sahasranama_stotram_brahmapurana.txt` — 145 verses,
1020-name index, 341 KB.

**This is the Brahma Purāṇa recension, not the Skanda one.** Colophon reads
`इति ब्रह्मपुराणे`. Incipit `श्रीः पद्मा प्रकृतिः सत्त्वा शान्ता चिच्छक्तिरव्यया`. Every digital
corpus checked (sanskritdocuments ×3, stotranidhi, drikpanchang) carries a *different*
text — the Skanda / Sanatkumāra-saṁhitā one, 154 verses, incipit
`नित्यागतानन्तनित्या`. GRETIL's Brahmapurāṇa (Tübingen, adhy. 1–246) does **not**
contain this sahasranāma; archive.org's single hit is a manuscript with unusable OCR.

**Consequence: no external collation was possible, and the file says so in those
words.** In its place the text was collated against itself — GP prints the stotram
(pp. 492–505) and a dative nāmāvalī (pp. 506–524) as two independent typesettings of
one name-list. All 1020 entries checked mechanically against the verses: 979 matched,
41 examined by hand (30 sandhi, 6 search artefacts, **5 real transcription errors**,
each fixed only after re-rendering the page at 400 dpi — v22 वज्रनलिका, v14 -श्चांशु-,
v101 चीरवसना, v62 वामा, v115 सद्वज्रा).

**Two GP-internal divergences left unresolved** (v18 मतिः vs nāmāvalī गत्यै; v61
महाश्वना vs nāmāvalī महाधना), flagged in their verse blocks. On the second, an initial
note calling महाश्वना a non-word was **retracted**: these verses are saturated with Śrī
Sūkta vocabulary and the Śrī Sūkta's own `अश्वपूर्वां रथमध्यां हस्तिनादप्रबोधिनीम्` makes
"of great horses" apt exactly here. Four numbering typos in GP's printed nāmāvalī
recorded; the index here is the corrected contiguous sequence.

**Name count reported as 1020, not normalised to 1000** — the nāmāvalī ends at v125's
last name, and two entries carry two names under one number.

Volume map for the remaining 17 sahasranāmas in this book: `GITA_PRESS_1594_MAP.md`.

**Still open:** the *Skanda Purāṇa* Lakṣmī Sahasranāma (154 verses) is a separate work
and is not yet written. It has three independent witnesses plus variant readings as
apparatus, so it collates properly. Queued next.

### 2026-09-09 — Skanda Purāṇa Lakṣmī Sahasranāma

Written: `devi/lakshmi/35_lakshmi_sahasranama_stotram_skandapurana.txt` — 183 verses
+ 17 prose blocks + 2 dangling half-lines, 1003-name index, 412 KB. Sibling to
`34_..._brahmapurana.txt`; the two are distinct works and neither supersedes the other.

**No Gītā Press edition of this text exists** (GP prints the Brahma Purāṇa one), so
the authority chain falls to step 2. Collated across two genuinely independent
lineages: sanskritdocuments (*Stotraratnākara* II, 1929 Madras + *Viṣṇustutimañjarī*)
and stotranidhi, plus stotranidhi's separate nāmāvalī page.
**drikpanchang was fetched and deliberately excluded** — it agrees with
sanskritdocuments in 146/154 verses including that edition's distinctive doubled-
sibilant sandhi, i.e. same lineage, not a third witness.

**26 substantive variants in the stotram, adjudicated individually on grammar and
sense — 12 to SD, 14 to SN.** Neither witness is superior; each corrects real errors
in the other. **Seven decisions were revised** after further evidence: 50, 82, 95, 99,
117 (all reversed once the nāmāvalī was consulted), 138 (a reversal that was itself
wrong, caught by an anchor check before it was applied), and 145 (a correction of
faulty reasoning — `इन्दिन्दिर` is an attested word for a black bee, so the reading
first dismissed as dittography is in fact the lectio difficilior).

**The phalaśruti was collated late, after a first pass had left it unchecked.** That
pass reported phala 7 as corrupt and undecidable; it is not — SN reads `जपोऽपि` where
SD reads `जरापि`, which resolves the line completely. Two further phalaśruti
corrections (p3, p6) came from the same pass. Lesson: collate every section, not just
the one that looks like the text.

**Name count 1003**, against the 1008 the text claims and the 1000 of the title.
An earlier pass reported six index entries as absent from the stotram and inferred a
fuller recension behind the nāmāvalī; **that was withdrawn** — all six are spelling or
word-order variants (`वेदगर्भा`/`देवगर्भा` etc.), an artefact of exact-substring
matching. Six places where the index carries the non-adopted reading are recorded in
the file rather than conformed away.

**Dedup:** stotram v154 is word-for-word Durgā Saptaśatī 11.10 — logged in
`DEDUP_AUDIT.md`, both files kept per the dedup rule.

**Process note:** two verse-authoring agents were misdiagnosed as having stopped short
because their output files were read mid-write; two replacement agents were spawned
and then stopped once the originals proved complete. Check for a running task before
concluding a partial file is a failed one.

##### Ṛgveda Sandhyāvandanam written (2026-09-09) — `vidhi/rigveda/`, 35 units

Third śākhā, third folder. Source `stotranidhi.com/hi/rigveda-sandhya-vandanam-in-sanskrit/`
+ the Telugu sibling page; collated against the **accented Ṛgveda on sa.wikisource.org**
(ṚV 10.9 entire and 3.62.10, with padapāṭha) — all matched including accent placement.
786 accent marks, accented from the outset.

**Materially easier than the Taittirīya file, and worth knowing why.** This page carries a
script switcher with a genuine Devanāgarī edition, so **no transliteration was needed**; and the
Devanāgarī page had **zero** Latin-for-anusvāra defects against the Telugu Taittirīya page's 29.
Check for a script switcher before assuming a stotranidhi page is single-script — the Taittirīya
one genuinely has none, but that is not the norm.

**Śākhā stated by the source itself**, not inferred: the abhivādana reads
`आश्वलायनसूत्रः ऋक् शाखा`.

**Three-way recension differences now on record, none reconciled:** `आपो हि ष्ठा` split into nine
pādas (Ṛgveda + Mādhyandina) vs run together (Taittirīya); `आकृ॒ष्णेन॒ रज॑सा` (Ṛgveda) vs
`आ स॒त्येन॒ रज॑सा` (Taittirīya); `जु॒षस्व॑ मे` vs `जु॒षस्व॑ नः`; and `जाते` (Ṛgveda + Taittirīya)
vs `देवि` (Mādhyandina). The Ṛgveda rite alone carries a `पापपुरुष विसर्जनम्`, an
`आत्मप्रदक्षिण`, a 24-name ācamana, and a viniyoga before every single mantra.

**Trap recorded — VedaWeb is no longer usable the old way.** `vedaweb.uni-koeln.de` has been
rebuilt as a JavaScript app; its former `/rigveda/api/document/id/...` endpoint now returns the
**SPA shell with HTTP 200**, which reads as success and is not. The real API is under `/api/`
(`/api/openapi.json` lists it) and requires chained `/texts` → `/locations` → `/contents` calls.
This is the same failure mode CLAUDE.md already warns about for gitapress.org — **a 200 is not
evidence of content.** Wikisource was used instead.

### 2026-09-09 — Gītā Press 1594 text 4: Dakārādi Durgā Sahasranāma

Written: `devi/durga/49_dakaradi_durga_sahasranama_stotram.txt` — 231 verses + dhyāna,
1000-entry index, 458 KB. Kulārṇava Tantra; GP stotram pp. 103–123, nāmāvalī pp. 124–142,
both transcribed in full from the page images.

**Second witness checked for independence before use.** sanskritdocuments
`durgadakaradisahasranama.itx` states it was **encoded twice independently** with no GP
involvement — genuine second lineage. (Contrast the Sūrya file in the same collection,
whose footer says "revised from Gita press"; it was therefore *not* used as a control.)

**The 232-vs-231 count is SD's fault: it prints verse 78 twice.** That dittography also
imposes a silent +1 offset on all its later verses; collating without correcting it would
have produced ~150 imaginary variants.

**61 substantive differences; GP is the authority here, so 53 GP / 6 SD / 2 orthographic.
But the six "SD wins" are not SD beating GP** — re-reading the page at 400 dpi showed GP
agrees with SD every time: **our transcription of GP was wrong.** Cause: the **`प्त`
ligature reads as `स`** at 200 dpi (गुसि/गुप्ति, प्रास/प्राप्त, मोक्षार्थि/मोक्षाप्ति),
plus `द्भ`→`द्ध` and `व`→`त्र`. Eight readings corrected. At v75 *neither* transcribed
witness was right; GP's actual विद्रावा was recovered from the image and confirmed by the
volume's own index.

**GP pads its own index and says so.** Entries 990–1000 are eleven repetitions of
`दुर्गादेवी`; the footnote reads `एक सहस्रमें ग्यारह नाम कम होनेके कारण … पुनरावृत्ति की गयी है।`
**989 real names, 975 distinct, presented as 1000** — reported as found.

**Open for a human eye:** v100 `दशग्रीवप्रिया वन्ध्या दशग्रीवहता` makes the Goddess dear to
Rāvaṇa, barren, and slain by him; SD's `वन्द्या`/`हृता` reads it as Sītā carried off. GP
kept under the authority rule, variant recorded. Also vv. 136–137 `दस्त्र-` against
`दस्र-` everywhere else in the same edition.

### 2026-09-09 — Gītā Press 1594 text 5: Sūrya Sahasranāma — transcribed, not yet authored

GP stotram pp. 143–155 (134 vv.) and nāmāvalī pp. 156–173 (**1008 entries**) transcribed
in full; collation notes in the scratchpad. **No usable external witness** — the only
digital text of this recension states it was revised from Gita Press. GP-against-itself
used instead: **all 1008 index entries accounted for** (941 direct, 52 sandhi-absorbed,
15 irregular-stem artefacts).

**1008 is genuine here** — no padding block, no footnote, and the last eight entries are
distinct names. Name counts in this volume are not uniform: Durgā 1000-printed/989-real,
Sūrya 1008, Lakṣmī (Brahma Purāṇa) 1020.

Remaining: glosses and verse meanings, then assembly.

### 2026-09-10 — Sūrya Sahasranāma authored
Written: `navagraha/29_surya_sahasranama_stotram.txt` — 134 vv. + viniyoga + dhyāna, 1008-name
index. Single-witness (the only digital text is GP-revised); GP stotram vs GP index accounts for
all 1008 names. A nominative-conversion bug (`-āya` sliced three characters, which would have
corrupted ~600 names) was caught and fixed before assembly. Gloss agents worked from the name
list without verse context; flagged glosses were reconciled against the verse translations
(415, 817, 318/456 changed to agree).


### 2026-09-10 — Gītā Press 1594 texts 6, 7, 8, 10, 11 authored
Written, each GP-transcribed from page images and collated against one outside witness (GP kept
unless demonstrably wrong; details in each file's Recension note):
- `rama/28_rama_sahasranama_stotram.txt` — Ānanda Rāmāyaṇa, 120 vv., **1018 names**; witness adopted
  at v65 only (GP `रवुः`, non-word; GP index `रघवे`).
- `krishna/31_krishna_sahasranama_stotram.txt` — 211 vv. + dhyāna, 1000 names.
- `narasimha/22_lakshminrsimha_sahasranama_stotram.txt` — Nṛsiṁha Purāṇa, 220 vv., **1003 names**;
  vv. 84–87 are Bhagavad Gītā 11.20–22, 11.30.
- `krishna/33_radhakrishna_sahasranama_stotram.txt` — Bṛhannāradīya, 179 vv., 1000 names
  (500 Kṛṣṇa + 500 Rādhā); witness adopted at v155 only (GP `त्र` for `च`).
- `hanuman/33_hanumat_sahasranama_stotram.txt` — Mantramahārṇava, 132 vv., **1004 names**; the
  witness (Hanumatstutimañjarī) lacks GP v12, v19a and vv. 63–69 — a recension difference.
Typeface rule settled this session: this font draws स्र like स्त्र; always transcribe स्र
(genuine स्त्र only in स्त्री, अस्त्र, शास्त्र etc.).
Remaining from the volume: Gopāla (9), Gāyatrī (12), Gaṅgā (13), Yamunā (14) in authoring;
Annapūrṇā (16), Sītā (17), Rādhikā (18) in collation; Bhavānī (20), Dattātreya (21) in
transcription.

### 2026-09-10 (cont.) — Gītā Press 1594 complete: texts 9, 12, 13, 14, 16, 17, 18, 20, 21 authored
All 22 sahasranāmas of the volume now have a corpus file (15 Lakṣmī is another session's). Written
this round, each GP-transcribed from page images (details in each file's Recension note):
- `krishna/32_gopala_sahasranama_stotram.txt` — 1007 names. **No independent edition exists.**
- `devi/gayatri/16_gayatri_sahasranama_stotram.txt` — Devī Bhāgavata, 164 vv., 1008 names. **Single
  witness**: the digital "Gāyatrī sahasranāma" is a different (mantra-syllable) text.
- `ganga/16_ganga_sahasranama_stotram.txt` — Skanda/Kāśīkhaṇḍa, 210 vv., 1000 names; witness adopted
  at v96 only (GP `नन्नपातका`; GP index `नुन्नपातकायै`).
- `devi/nadi/05_yamuna_sahasranama_stotram.txt` — Garga Saṁhitā, 141 vv., 1000 names; witness only
  partly independent; adopted at 4 demonstrable GP errors (viniyoga, v1, v80, v118).
- `devi/annapurna/08_annapurna_sahasranama_stotram.txt` — Rudrayāmala, 178 vv., 1001 entries
  (998–1001 are one name repeated); GP kept in all 65 differing verses.
- `rama/29_sita_sahasranama_stotram.txt` — Adbhuta Rāmāyaṇa, 159 vv., 1009 names. The only witness
  says it is "also available in … Gita Press": **not shown independent**.
- `krishna/34_radhika_sahasranama_stotram.txt` — Nārada Pāñcarātra, 209 vv., **1073 names**;
  independent witness (Viṣṇustutimañjarī); adopted at v72, v184 (GP misprints against its own index).
- `devi/main/42_bhavani_sahasranama_stotram.txt` — Rudrayāmala, 185 vv., 1009 names; independent
  witness with a 23-verse frame and extra verses GP lacks — recorded, not imported; GP kept throughout.
- `dattatreya/22_dattatreya_sahasranama_stotram.txt` — 144 vv., 1007 names; only witness is
  unsourced stotranidhi; GP kept except a one-dot visarga at v132.

**Nāmāvalī nominative bug, found and fixed.** The scaffolder's dative→nominative rules (used only
for the Telugu and Hindi *name* columns — never the Sanskrit, IAST, glosses or verses) produced
wrong forms in three classes: `-स्यै` → `-ा` (तामस्यै → "तामा" for तामसी; pronominals like परस्यै →
परा are correct and kept), consonant-stem `-्ने` → "`-्ा`" (धाम्ने → "धाम्ा" for धामा, महिम्ने →
महिमा; neuter व्योम्ने → व्योम, -वस्तुने → -वस्तु), and a first fix for the second class that briefly
turned `-घ्ने` into "-घा" before being reordered. All 14 files of this volume were recomputed,
rewritten and checked: no malformed forms remain and every `-घ्ने` name reads `-हा`. The same
defect was patched, with the user's approval, in `devi/lakshmi/34` (630, 704) and
`devi/lakshmi/35` (555, 661 तस्यै → सा, 843, 844, 845, 872), and in `navagraha/29` (627, 697).
Two translator notes that blamed the GP index for these forms ("index prints तामा") were
removed from the Annapūrṇā file before assembly; the book prints `तामस्यै` etc.
Scaffolder note for future runs: `build.py` now also strips a printed `ॐ … नमः` from nāmāvalī
lines and reads `@viniyoga` / `D` line tags.

### 2026-09-10 (cont.) — Witness-only passages added to the 1594 files as marked "Extras"
User instruction: "add any extras and make a note as extras." Everything a collated witness prints
that Gītā Press does not — whole verses, half-lines, extra names inside a verse, frame narratives,
viniyoga/nyāsa/mūlamantra prose, extra dhyāna verses, extra phalaśruti — is now given in each file
**after the colophon and before the nāmāvalī**, each block in the ordinary five-field format with
the section label `Extra — <witness>, not in Gītā Press (<where it stands>; witness v. N)`. Gītā
Press's own text is untouched and unbroken; extra names are **not** added to the numbered index,
which remains Gītā Press's. Each file's header gains an "Extras (added 2026-09-10)" sentence in
its Recension note and an `అదనపు పాఠం — Extras` line in its Sections. Witness text is given as
printed, typos flagged in the English line rather than corrected. Variant readings of material Gītā
Press has were *not* treated as extras.

| Text | File | Extras |
|---|---|---|
| Rāma | `rama/28` | 28 (19 Ānanda Rāmāyaṇa text + 9 Viṣṇustutimañjarī text) |
| Kṛṣṇa | `krishna/31` | 20 |
| Lakṣmīnṛsiṁha | `narasimha/22` | 30 |
| Rādhākṛṣṇa | `krishna/33` | 34 |
| Hanumat | `hanuman/33` | 39 (the witness diverges after GP v123) |
| Gaṅgā | `ganga/16` | 2 |
| Yamunā | `devi/nadi/05` | 1 |
| Annapūrṇā | `devi/annapurna/08` | 10 |
| Bhavānī | `devi/main/42` | 29 |
| Sītā, Rādhikā, Dattātreya | — | none (every witness line has a GP counterpart) |
| Gopāla, Gāyatrī | — | no witness |

Total: **193 extra blocks** across nine files. Found by matching every witness half-line against
every GP half-line and reading everything below 0.8 similarity by hand. Translations flagged
tentative in the blocks' notes: Lakṣmīnṛsiṁha witness v224 (a line encoding a mantra) and its
dhyāna `चक्रपिनाकस्नाभय`; Hanumat witness v137 `त्रिपक्षतः`; Gaṅgā `सितमकर…` line 2; Kṛṣṇa
frame v10 and dhyāna v1. A header error was corrected along the way: the Yamunā witness does
not match GP "one for one" — it skips its no. 130 and adds a verse, which cancel out.


### 2026-09-12 — Pūjā-vidhāna started: survey, tooling, and the smārta/vaiṣṇava spine

User asked to start a pūjā-vidhānam corpus — "nitya pooja, vinayaka pooja, vinayaka chavithi, all
deity pooja vidhanams" — and to survey stotranidhi and vignanam for what is available. Survey
done, then the **spine** written: the shared apparatus that the per-deity rites will reuse. The
deity rites themselves are **not** written yet.

**Surveyed inventory (2026-09-12).** Both sites return HTTP 403 to a bare fetch and need a
browser User-Agent; WebFetch cannot read either.

| source | what it holds |
|---|---|
| stotranidhi `category/puja-vidhi` | **49 pages** over 3 index pages — 30 deity ṣoḍaśopacāra pūjās, 7 apparatus texts (both pūrvāṅgas, nitya-pūjā upodghāta, saṅkalpa notes, pañcāmṛtābhiṣeka, bilva-dala, caturāvṛtti tarpaṇa) |
| stotranidhi `category/vratham` | **15 pages** — Siddhi Vināyaka vrata-kalpa **parts 1–4**, Satyanārāyaṇa (main + 2 parts), Varalakṣmī ×2, Vaibhava-Lakṣmī, Mārgaśira Lakṣmīvāra, Śrāvaṇa Maṅgaḷa-Gaurī, Kedāreśvara ×2, Ananta Padmanābha, Anaghāṣṭamī, Saṅkaṭahara Caturthī, Nāga Pañcamī |
| vignanam | **15 vidhi pages**, every one accented in native Devanāgarī: 10 deity nitya-pūjās (Gaṇapati, Śiva, Viṣṇu, Lakṣmī, Durgā, Sarasvatī, Subrahmaṇya, Sūrya, Hanumān, Navagraha), a generic smārta template, a saṅkṣipta form, Śiva-pañcāyatana ṣoḍaśopacāra (1,850 accent marks), Gaṇeśa-caturthī pūjā + vrata-kalpa, Satyanārāyaṇa (1,656) |
| Gītā Press | *Nitya Karma Pūjā Prakāśa*, 396 pp. — the authority for text, **unaccented**, and the **North Indian** smārta tradition. *Vrat Paricay*, a month-by-month vrata calendar: use id `vrata-parichaya` (416 pp., **zero** Latin OCR noise) over the 1996 scan (42,791). |

**Sourcing finding that reverses the usual order: vignanam is the better base text for this
genre.** Its pūjā pages carry a genuine Devanāgarī edition declaring itself "शुद्ध देवनागरी with
the right anusvaras marked", with accent counts identical across scripts — so nothing needs
transliterating and none of the 29 Latin-`o` repairs `vidhi/taittiriya/` required recur.
stotranidhi's accent coverage is **conditional**, and a first reading of it was wrong: the
ṣoḍaśopacāra pūjās are richly accented (Śiva 371, Durgā 366, Satyanārāyaṇa 638) but **every
Vināyaka vrata page is genuinely unaccented**, as are Kedāreśvara, Maṅgaḷa-Gaurī and Varalakṣmī.
The dividing line is not pūjā-vs-vrata but whether the page embeds Vedic mantra.

**Best collation result:** Gītā Press agrees with stotranidhi *against* vignanam on the śaṅkha
verse `त्वं पुरा सागरोत्पन्नो विष्णुना विधृतः करे` — in GP, in stotranidhi, absent from vignanam.
Evidence the verse belongs and vignanam's text is the abridged one.

**Written — `stotras/puja/`, split by paddhati (see `puja/README.md`):**

- `smarta/01_nitya_puja_vidhanam.txt` — 55 units. The complete generic daily rite.
- `smarta/02_sankshipta_puja_vidhanam.txt` — 31 units. The short form: ācamana cut to 12 names, kalaśa/śaṅkha/ghaṇṭā dropped, most upacāras reduced to their nāma-mantra.
- `smarta/03_purvanga_vidhanam.txt` — 31 units. The standalone pūrvāṅga, **fuller than the one folded into 01** in seven places. Both kept, cross-referenced; neither supersedes the other.
- `vaishnava/01_purvanga_vidhanam.txt` — 19 units. **A different rite, not a variant** — Viṣvaksena for Gaṇapati, a 12-name ācamana from a different triad, a four-syllable āsana with no smārta counterpart, a Śrīraṅga-centred saṅkalpa, and a viniyoga before every mantra. **No independent collation exists and the file says so:** GP publishes no Śrīvaiṣṇava paddhati, vignanam is smārta only.

The `श्री इष्ट देवता` slot in 01 and 02 is the **source's own** device and has been left unfilled;
filling it would turn a general template into one particular rite. Gītā Press independently
states the same principle — any deity's pūjā uses the same sequence and mantras, only the
vibhakti and nāma-mantra changing, with Śiva-pūjā as its worked example.

**Tooling added to `stotras/bin/`, which is what makes the deity tranche tractable:**

- `dev2iast.py` — Devanāgarī → IAST in the corpus convention, **derived by measuring all 838
  existing files rather than assumed**. 95.79% exact on its domain (17,934/18,722 Sanskrit
  units). Two measured results worth keeping: the corpus writes anusvāra `ṁ` **even before a
  stop** — assimilating to the homorganic nasal was tried and cost hundreds of units, so the
  `ṅk`/`ñc`/`ṇḍ` forms in the corpus come from Devanāgarī conjuncts, never from anusvāra — and
  five files use **Tamil romanisation** and are outside the tool's domain
  (`Subrahmanya/06`, `bhagavadgita/18`, `devi/goda/02`, `devi/goda/04`, `devi/main/09`).
- `fill_iast.py` — fills empty `iast:` fields from the `deva:` above them; never touches a field
  that already has content. Author with `iast:` blank and run it.
- `fetch_source.py` — fetches a source page with a browser UA and strips nav, comments and the
  book advertising both sites append.

The transliterator also **doubles as a corpus auditor**: run against the existing files it
surfaced ~117 real defects in hand-authored `iast:` fields, including one verse truncated
mid-word (`skanda_lahari` reads `rājacchradudi` for `rājaccharaduditarākāhimakara`). Flagged as
a separate task, not fixed here — an existing file is not ours to rewrite.

**Queued next, in order:** the twelve-file first tranche (the ten vignanam deity nitya-pūjās,
accented and native-Devanāgarī, plus **Vināyaka Cavitī** — `सिद्धिविनायकव्रत`, Bhādra śukla, at
*Vrat Paricay* p. 123); then the ~35 remaining stotranidhi deity pūjās; then the ~14 vratas,
which are the expensive ones because each carries a unique kathā.

---

### 2026-09-12 — Pañca-sūkta authored; `veda/` opened and split by śākhā

**What was asked.** An audit showed the corpus held nine sūkta files but was missing most of the
standard recitation set. Of the **pañca-sūkta** recited at abhiṣeka — Puruṣa, Nārāyaṇa, Śrī, Bhū,
Nīḷā — only the Śrī Sūkta was written. The user chose a **new `veda/taittiriya/` folder**, split
by śākhā at the folder level like `vidhi/`, rather than filing these under `vishnu/`.

**Written (4 files, 79 units, accented throughout).**

- `01_purusha_suktam.txt` — 26 units (24 ṛcs, with the śānti-pāṭha before and after). TĀ 3.12–13.
- `02_narayana_suktam.txt` — 30 units. TĀ 10.13, plus the `ऋतं सत्यं` śloka at TĀ 10.22 and the
  Nārāyaṇa gāyatrī at TĀ 10.1, both located in the witness rather than taken on trust.
- `03_bhu_suktam.txt` — 19 units. A compilation, and labelled as one section by section.
- `04_nila_suktam.txt` — 4 units. TS 4.4.12.

**Sourcing.** Base text stotranidhi.com's accented Veda pages (this is the one job it is reached
for first, per the svara rule). Independent collation for every one of the four against the
**accented Taittirīya Saṁhitā, Brāhmaṇa and Āraṇyaka on sanskritdocuments.org** — a separate
editorial lineage in the **same śākhā**, fetched and diffed mechanically with accents stripped
and the two editions' visarga and nasal conventions normalised. **No substantive disagreement in
any of the four.** Three defects in the base text were corrected from the Saṁhitā, and they are
the only characters changed: `पृश्ञि` → `पृश्नि` (Bhū 2), `अस्येश्याना` → `अस्येशाना` (Nīḷā 3),
and a stray hyphen in `बृहस्पति-र्मातरिश्वोत` (Nīḷā 2). Two slips were found on the *witness* side
and stotranidhi's reading kept: `विश्वङ्` for `विष्वङ्` (Puruṣa 4) and `नारयणः` for `नारायणः`.

**Three findings worth carrying forward.**

1. **Gītā Press's Puruṣa Sūkta is Mādhyandina.** archive.org
   `NmAB_purush-sukta-and-shri-sukta-gita-press` is headed `अथ माध्यन्दिनीयपुरुषसूक्तम्`. Under the
   śākhā rule it is a **different tradition's text, not a witness to the Taittirīya one**, and it
   was not used. This is the first time the authority rule and the śākhā rule have pulled against
   each other in this corpus; the śākhā rule wins, and the GP text is wanted as its own file in a
   `veda/madhyandina/` folder that does not exist yet. Its OCR is unusable (3,089 Devanāgarī
   characters, 15 accent marks) — that volume needs the page images.
2. **Part of the Bhū Sūkta is not Vedic.** The block `मेदिनी देवी वसुन्धरा` … `धनुर्धरायै विद्महे`
   was searched for across the whole Taittirīya Saṁhitā, Brāhmaṇa and Āraṇyaka and **is in none of
   them**; stotranidhi gives it no citation either. It is recorded in the file as liturgical
   material of unstated source, not claimed as Veda. One half-line inside it, `सोपरिधत्तङ्गाय`, is
   obscure as printed and the translations say so rather than guessing.
3. **stotranidhi writes visarga as an ASCII colon** on these pages. A naive comparison reads every
   visarga as a missing character and the collation looks like it has failed. Map `:` → `ः` before
   diffing, alongside the accent-stripping the repo-root `CLAUDE.md` already warns about.

**Śrī Sūktam was not touched.** It already exists as `devi/lakshmi/06_sri_suktam.txt` from a
different source (vignanam.org), and the rule against rewriting an existing file from a new
witness applies. All four new files cross-reference it, and `veda/README.md` records that the
fifth of the five lives under Lakṣmī.

**Also done:** `veda/README.md` (the śākhā split, what is written, what is wanted); a
`veda/taittiriya/` row in `PROJECT_TRACKING.md`; `bin/recount.py --write` run, which reconciles
at 860 files with no untracked ones.

**Queued next for this folder:** `veda/madhyandina/` with the Gītā Press Puruṣa Sūkta from page
images; then Medhā, Manyu, Pavamāna, Viṣṇu, Ṛgvedīya Gaṇeśa, Navagraha and Āyuṣya Sūktas, and
Mantra Puṣpam as a standalone text — none of which has been surveyed.

---

## Session 2026-09-12 (cont.) — `puja/` first tranche: ten deity nitya-pūjās + Vināyaka Cavitī

The twelve-file tranche approved after the spine is **complete**: `puja/smarta/04`–`14`. Folder
now 15 files, 795 units, 1,941 accent marks, `iast:` filled and validated everywhere, corpus
defect scan clean.

**Base text vignanam.org throughout** — native accented Devanāgarī, accent counts identical
across its scripts, so **nothing in this tranche was transliterated by us.** That reverses
`CLAUDE.md`'s usual preference order and is the right call for this genre specifically.

**What each rite has of its own** (the reason these are eleven files and not one template):
`07` threads the Śrīsūkta verse-by-verse through seven services. `11` has a **dvādaśārghya** —
twelve arghyas to the twelve solar names — in no other rite here, plus a 20-name aṅga-pūjā and
the healing verse `उद्यन्नद्य विवस्वान्` asking Sūrya to destroy heart-disease and jaundice. `12`'s
17-name aṅga-pūjā makes every name a **deed** of the Rāmāyaṇa rather than an epithet. `13`
worships **nine deities**, and the plural runs through its whole grammar — `सुप्रीताः सुप्रसन्नाः
वरदाः भवन्तु` where every sibling has the singular; `ग्रह पूजा` replaces the aṅga-pūjā; no deity
Gāyatrī; arghya at the head. `14` is a vrata, not a daily rite, and shares none of the pūrvāṅga.

**Collation, honestly graded.** `13` is the best-collated file in the folder and the only one
with **no stotranidhi witness at all** (stotranidhi has no navagraha pūjā-vidhānam) — so it was
collated against **Gītā Press's `नवग्रह-मण्डल-पूजन`, pp. 226–231**, a maṇḍala rite with per-graha
Vedic āvāhana mantras, gotras and colours. Two quite different rites, recorded and kept apart;
where they meet they agree **exactly** on `ब्रह्मा मुरारिस्त्रिपुरान्तकारी`. `12` is the worst-served:
**Gītā Press has no ṣoḍaśopacāra of Hanumān** (only the Cālīsā and the sahasranāma), so it rests
on two witnesses and the file says so. For `14`, **Gītā Press has no Bhādrapada Caturthī vrata at
all** — searched and confirmed, `वरसिद्धि` and `श्यमन्तक` both zero; its `देहलीविनायक-पूजन` is a
Dīpāvalī rite. It does carry the Saṅkaṭanāśana stotra, which gave one real collation point, and a
**twelve-name** recension of the Vighneśvara stotra against vignanam's **sixteen-name** one.

**The defect I introduced, and the rule it violated.** Collating Sūrya surfaced that **five of my
own files carried the wrong saṅkalpa** — `06`, `08`, `09`, `10`, `11`. Each vignanam deity page
prints a deity-specific clause, and I had normalised four of them toward the generic template:
dropped Sūrya's `आरोग्य-तेजस्-बल-प्राप्त्यर्थं` and Sarasvatī's `प्रज्ञा-मेधा-विद्या-विवेक-वाग्विलास-सिद्ध्यर्थं`,
added `सर्वाभीष्ट-सिद्ध्यर्थं` where the source has none, and dropped `देवी`/`स्वामि` from three deity
names. All five fixed and re-validated. **The template is what the sources share, not what they
may be flattened into** — the same error the paddhati and śākhā rules exist to prevent, committed
one level down. A saṅkalpa audit against source is now part of authoring a deity page.

Also caught and fixed: three stray Latin letters I had typed into Telugu glosses (`నiki`, `వuni`,
`ఉపేంద్రునikి`). A corpus-wide scan for Latin-adjacent-to-Indic now runs over the folder.

**Defects corrected in the sources, with support.** `उपमश्रवस्तवम्` → `उपमश्रवस्तमम्` (RV 2.23.1) on
every deity page, as before. `सञ्जीवननगाहर्ते` → `हर्त्रे` in `12` (dative of `हर्तृ`; stotranidhi
independently prints `हर्त्रे`). `प्रशांयन्तु` → `प्रशाम्यन्तु` in `13`. Nine in `14`, five of them on
the second witness's authority.

**`14` needs three warnings carried forward**, all recorded in its header and in `puja/README.md`:
its seven Puruṣasūkta verses are **bracketed incipits, transcribed abbreviated and deliberately
not expanded**; its **kathā is printed in English** by vignanam and in **Telugu** by stotranidhi,
so **no Sanskrit of it exists in either witness and none was invented**; and its closing
maṅgaḷācaraṇam is **Telugu-language verse in Devanāgarī script** whose Dravidian short vowels
`ॆ`/`ॊ` are **correct** — any future scan flagging those must exempt this file. That page is also
much more corrupt than its siblings, and the tells all point to Telugu-script conversion,
including a **Latin `ā` inside a Devanāgarī word**.

**Queued next for this folder:** stotranidhi's deity pūjās as a **second recension** — they are
not the same rite (prāṇapratiṣṭhā, punaḥ-saṅkalpa, madhuparka, pañcāmṛta, ābharaṇa, a 17-name
ṣoḍaśanāma, Mudgala Purāṇa authority), and Hanumān shows it sharpest with a 29-name alliterative
aṅga-pūjā against vignanam's 17. **Their own files, cross-referenced, never merged.** Then the
~35 remaining deity pūjās and ~14 vratas already surveyed above.

### 2026-09-12 (cont.) — Durgā Sūktam given an accented recension

**Why.** The audit at the head of this session reported that
`devi/durga/19_durga_suktam.txt` carries **zero** accent marks while its own header says it
"preserves the accented Devanāgarī exactly as published". The user's point: the Durgā Sūkta is
Vedic — Taittirīya Āraṇyaka 10.2 — so it is supposed to have accent.

**What was actually wrong.** Not a stripping error. The source that file names,
`sanskritdocuments.org/doc_devii/durga-suuktam`, **prints no accent at all** — the `.html` page and
the `.itx` both return zero svara marks, in spite of the `svara` keyword in that file's category
line. The header's claim was wrong at the source. The conjuncts it attributes to "how the accent
marks were encoded" (`अस्मान्थ्स्वस्तिभिः`, `ꣳ`) are just the Taittirīya sandhi orthography and the
nasal glyph, and have nothing to do with accent. **The text in that file is sound; only the
description of it is wrong.**

**Written:** `veda/taittiriya/05_durga_suktam.txt` — 9 units (7 ṛcs, the Kātyāyanī gāyatrī, the
śānti), **169 accent marks**. Base text stotranidhi.com's accented `durga-suktam-in-hindi` page,
which prints the hymn in exactly the same nine-unit shape as the existing file. Collated against
the accented **TĀ 10.2.16** on sanskritdocuments.org — same śākhā, separate lineage — and the
seven ṛcs **agree character for character** once nasal and sandhi conventions are normalised. The
gāyatrī was located accented in the gāyatrī-mālā at TĀ 10.1.

**Adjudicated:** `अ॒स्मान् स्व॒स्तिभि॑ः` (stotranidhi) vs `अ॒स्मान्थ्स्व॒स्तिभि॑ः` (Āraṇyaka) — the
Āraṇyaka form adopted, as the śākhā's own printed convention and the one `devi/durga/19` already
carries. The accents are unaffected either way. **One defect corrected:** a zero-width joiner
inside stotranidhi's `पर्‍ष॒दति॑`. No accent mark was added, inferred or moved.

**The existing file was not rewritten.** Both files now carry an additive cross-reference naming
the other and saying neither supersedes it, and `devi/durga/19`'s note records — without changing
a character of its text — that its stated source prints no accent. **The wrong sentence in its
`Source / recension` field is still there,** left for the user to decide on, per the rule against
editing another session's file.

**Note for the same problem elsewhere:** `misc_vedic/01_agni_suktam.txt` (ṚV 1.1) is a separate
case. Its header says plainly that the source's svara was dropped on purpose, under the older
convention that predates the 2026-09-08 svara rule. That one is a real stripping, and its accented
Śākala text is recoverable — but it is Ṛgvedic, not Taittirīya, so it wants `veda/rigveda/`, which
does not exist yet.

## Session log — 2026-09-12: the deity gāyatrīs, and the nine planets

Asked for "gāyatrī mantra for all deities". Two files written, both from a base text and a real
independent collation.

**`veda/taittiriya/06_gayatri_mala_mantrah.txt` (18 units).** The gāyatrī-mālā of the Mahānārāyaṇa
Upaniṣad, **TĀ 10.1.5–7** — Rudra, Gaṇeśa, Nandi, Skanda, Garuḍa, Brahman, Viṣṇu, Narasiṁha, Sūrya,
Agni and Durgā — followed by the six-mantra `पाठभेदः` block for Brahmā, Bhānu, Vaiśvānara,
Bhagavatī, Gaurī and the serpent. Base text stotranidhi.com (accented). Collated against **two**
further accented witnesses in the same śākhā: the Taittirīya Āraṇyaka and the Mahānārāyaṇa
Upaniṣad, both on sanskritdocuments.org, encoded by different volunteers from different exemplars —
they disagree at three places, which is what shows they are not copies of each other. The eleven
shared mantras agree word for word otherwise.

**One mantra added from the witnesses.** Both carry `पुरु॑षस्य विद्म सहस्रा॒क्षस्य॑` at TĀ 10.1.5,
where stotranidhi's page begins one mantra later. It is unit 1, its accent transcribed from the
Āraṇyaka — same śākhā, so the svara rule permits it. **Three word-level differences are bracketed
in the line**, per the 2026-09-12 rule: `महद्द्युतिक॒राय॑(महद्युतिक॒राय॑)`,
`कन्यकु॒मारि॑(कन्याकु॒मारि॑)`, `तन्नो॑(तन्नः) सर्पः`. **The Lakṣmī gāyatrī that ends stotranidhi's page
is not printed** — it is not TĀ 10.1, it belongs to the Śrī Sūkta, and the corpus already holds it at
the end of `devi/lakshmi/06_sri_suktam.txt`.

**`navagraha/39_navagraha_gayatri_mantrah.txt` (32 units).** The gāyatrīs of the nine planets, base
text stotranidhi.com, collated against `sanskritdocuments.org/doc_z_misc_navagraha/navagrahagAyatrI.itx`
(Liṅga Purāṇa, Mantra-mahārṇava, Gāyatrī-mahātantra — 43 mantras). **Fifteen agree exactly, nine
differ by one word, and eight are carried by the base text alone.** All three groups are itemised
by unit number in the file's recension note, so a reader can see how many witnesses each mantra
rests on. Two of the one-word differences are bracketed in the line
(`बाणेशाय(वाणेशाय)`, `शुकहस्ताय(सुखहस्ताय)`); the witness's `क्रुनिहस्ताय` is not, because it is not
a word and a corrupt reading is not a variant. The witness's eleven further mantras were not
imported — the file follows its base text.

**Gītā Press has neither text.** archive.org was searched under `creator:"Gita Press"`; its gāyatrī
titles are on the Sāvitrī Gāyatrī and on sandhyā, and there is no Gītā Press collection of deity or
navagraha gāyatrīs. Both files say so.

**Not written, and worth a decision.** The gāyatrīs recited for deities outside these two sets —
Hanumān, Sarasvatī, Lakṣmī apart from the Śrī Sūkta one, Śiva by name, Rāma, Kṛṣṇa, Dattātreya and
the rest. They exist in print, but in modern compilations rather than in an edition of any standing,
and a second independent witness for them was not established in this session. They should not be
written until one is.

---

## 2026-09-12 (cont.) — Agni Sūktam given an accented recension; `veda/rigveda/` opened

**Why.** `misc_vedic/01_agni_suktam.txt` (ṚV 1.1) holds the hymn **without accent**. Its own header
says why: its source carried the full svara, and the marks were dropped on purpose, under the
convention this corpus followed before 2026-09-08. Agni Sūktam is Vedic chant, so the accent is part
of the text, and the current svara rule says it should be there. This is a real stripping, unlike the
Durgā Sūktam case earlier in the day, where the named source printed no accent at all.

**Written:** `veda/rigveda/01_agni_suktam.txt` — 9 units, the nine ṛcs of ṚV 1.1, **97 accent marks**.
The existing file was **not** rewritten; it received one additive cross-reference and not one
character of its text was changed.

**Sources.** Three witnesses, two of them accented. **(1)** The accented saṁhitā-pāṭha of
`ऋग्वेदः सूक्तं १.१` on **sa.wikisource.org**, printed with Sāyaṇa's bhāṣya, which carries the
accented pada-pāṭha of all nine ṛcs on the same page — the base text, and the same source used for
`pitr/04_pitr_suktam_rigveda.txt`. **(2) stotranidhi.com**'s accented page, a separate lineage.
**(3)** The **Aufrecht** edition of 1877 as digitised by Van Nooten and Holland, on **GRETIL** —
IAST and unaccented, so a witness to the wording only.

**Result: all three agree in every word, and the two accented witnesses agree on every one of the 97
accent marks.** Where a mark sits one character apart between them, it is because the two spell a
nasal or a visarga differently; the syllable carrying the accent is the same in both. Every
difference found was orthographic, and each is itemised in the file: word-final `म्` written as
anusvāra in the base text (against its own pada-pāṭha, stotranidhi and Aufrecht, which give `म्`);
class nasal written as anusvāra (`यदंग` against `यदङ्ग`); `ळ` against stotranidhi's `ल`, where `ळ` is
the Śākala orthography and is kept; `र्ऋ` against `रृ`; and stotranidhi's ASCII colon for the
visarga, the defect already recorded for that site. stotranidhi's garbled `स देवा।ण् एह` was not
adopted — the base text and Aufrecht give the anunāsika `स देवाँ एह`, which is what the existing
`misc_vedic/01` had already corrected it to from the printed Ṛgveda.

**The base text is internally inconsistent, and that decided two of the readings.** Its saṁhitā
lines write `ऋत्विजं` and `भरंत`, but the same page prints `दीदिविम्` with `म्` and `राजन्तम` with
`न्त`. So the anusvāra spellings are a typing habit on that page, not a feature of the edition, and
the `म्` and class-nasal forms — which its own pada-pāṭha, stotranidhi and Aufrecht all give — are
what is printed here.

**One finding: there is no Gītā Press witness to this text.** archive.org was searched under
`creator:"Gita Press"` for the Ṛgveda, in English and in Devanāgarī, and holds no Gītā Press edition
of the Ṛgveda saṁhitā. The file says so.

**`veda/rigveda/` is now open**, beside `veda/taittiriya/`, with its own row in
`PROJECT_TRACKING.md` and its own section in `veda/README.md`. The Ṛgveda survives complete in one
śākhā, the Śākala, so the cross-śākhā question that governs the Yajurveda folders does not arise
here. `veda/madhyandina/` is still empty and still wanted.

**Not moved.** `pitr/04_pitr_suktam_rigveda.txt` (ṚV 10.15) is Ṛgvedic and accented and would sit
well in `veda/rigveda/`, but moving another session's file is not covered by the additive
cross-reference rule. It stays where it is, and both files name each other.

**Still open, and still the user's call.** The wrong sentence in the `Source / recension` field of
`devi/durga/19_durga_suktam.txt`, which says that file carries the svara when its source prints
none. It has an added cross-reference recording the truth, but the original sentence is untouched.

## Session log — 2026-09-12, continued: a printed edition of the deity gāyatrīs was found

The previous entry closed by saying the gāyatrīs for Hanumān, Sarasvatī, Śiva, Rāma, Kṛṣṇa and the
rest should not be written until a printed edition carrying them was found. One was found, and they
are written.

**The source. `Mantra-mahārṇava`, ed. Mādhavarāya Vaidya, Śrī Veṅkaṭeśvara Steam Press, Mumbai,
1924** — archive.org `ntkg-mantra-maharnava-by-madhava-raya-vaidya-sanskrit-t`. Its **Gāyatrī-paṭala**
is a chapter of fifty-three numbered deity gāyatrīs, pages 274–280 of the second khaṇḍa, and its
colophon names itself `श्रीत्र्यधिकपञ्चाशद्देवतागायत्रीमन्त्रे गायत्रीपटलतन्त्रम्`. It holds Hanumān,
Sarasvatī, Śiva, Rāma, Sītā, Lakṣmaṇa, Kṛṣṇa, Gopāla, Rādhikā, Paraśurāma, Nṛsiṁha, Hayagrīva,
Dakṣiṇāmūrti, Annapūrṇā, Tulasī, the five elements, the guru and the ten Mahāvidyās.

**Written as `devi/gayatri/17_gayatri_patala_mantra_maharnava.txt` (54 units.)** Fifty-two printed
numbers, with Viṣṇu's three forms counted separately. The print's own number 1 is the
Brahma-gāyatrī puraścaraṇa — a rule of practice, not a deity gāyatrī — and is not reprinted.

**How to reach that OCR, and why it was not used.** The item's `_djvu.txt` has 142 hits for
`विद्महे` and is how the chapter was located, but it is badly corrupt: `विद्मदे`, `विझहे`,
`प्रचोदबात`, `तज्ञ`. **The text was read off the page images instead**, which are clean and fully
legible. The route that worked: `archive.org/download/<id>/page/nNNN.jpg` returns a 1537×700 JPEG
per leaf (the `_medium` variant is half that and too small). The chapter is leaves n603–n615. To
find which leaf holds a passage, pull `_djvu.xml` and split it on `<OBJECT `; the `usemap`
attribute of each object gives the leaf's file name. The `_hocr_pageindex.json.gz` offsets are into
the hOCR, **not** into `_hocr_searchtext.txt.gz`, and mapping one to the other gives wrong leaves.

**The independent witness: the `Puraścaryārṇava`** of Mahārāja Pratāpasiṁha of Nepal, ṣaṣṭha-taraṅga,
pp. 504–508 — DLI scan `in.ernet.dli.2015.487362`. A different work of a different lineage, which
names a tantra for each mantra. Six mantras agree word for word; two differ by one word and are
bracketed in the line; six are different mantras for the same deity and are recorded in the note,
not merged. **Its Hanumān mantra is not the one the Mantra-mahārṇava prints** —
`ॐ हनुमते विद्महे आञ्जनेयाय धीमहि । तन्नो वीरः प्रचोदयात्` against `ॐ अंजनीजाय विद्महे वायुपुत्राय धीमहि ।
तन्नो हनुमान् प्रचोदयात्`. Both stand, in the file and in the note.

**The second Veṅkaṭeśvara printing is not a second witness.** `Mantra-mahārṇava Pūrva Khaṇḍa`
(Khemrāj Śrīkṛṣṇadāsa, archive.org `yepa_mantra-maharnava-purva-khanda...`) carries the same chapter
under the same numbering, but it is the same publishing house. It was used only to check a reading,
and the file says so in those words.

**One reading flagged, not corrected.** The Lakṣmaṇa mantra reads `अलबेलाय`, which is not an ordinary
Sanskrit word. It is printed twice on the page, in the mantra and again in the śikhā-nyāsa, so it is
what the edition has. No second witness was found for it.

**Cross-references added** in both directions between this file, `veda/taittiriya/06_gayatri_mala_mantrah.txt`
and `navagraha/39_navagraha_gayatri_mantrah.txt`. Several mantras stand in two of the three in
different wording, and none supersedes another.

---

## 2026-09-12 (cont.) — the sūkta accent rule, and the Ṛgvedic Devī and Rātri Sūktas

**The rule, from the user: "suktams are vedic by nature so should have accents where they carry one."**
It is now recorded in the repo-root `CLAUDE.md` as its own section. It is the mirror of the svara rule
already there: that one forbids adding accent that is not attested, this one forbids leaving out
accent that is.

**The audit it called for.** Every file in the corpus whose title or folder makes it Vedic was counted
for accent marks. Fifteen carry none. Most of those are correct as they stand — `misc_vedic/02` is an
aṣṭaka, `pitr/01`, `02` and `05` are Purāṇic stotras, and `devi/durga/14_tantrokta_ratri_suktam.txt`
and `devi/durga/43_tantrokta_devi_suktam.txt` are the Devī Māhātmya's own hymns, which are Purāṇic
and have no accent to carry. **Two were genuine gaps**, and both are now filled.

**Written:** `veda/rigveda/02_ratri_suktam.txt` (8 units, ṚV 10.127, **88 accent marks**) and
`veda/rigveda/03_devi_suktam.txt` (8 units, ṚV 10.125, the Vāk Sūkta, **163 accent marks**). The
corpus already held both hymns, unaccented, as `devi/durga/39_vedokta_ratri_suktam.txt` and
`devi/durga/42_rgvedokta_devi_suktam.txt` — transcriptions of the Gītā Press *Durgā Saptaśatī*, which
prints the whole volume without svara. **Neither existing file was edited.** Each received one
additive cross-reference.

**Sources.** Base text for both is the accented saṁhitā-pāṭha on **sa.wikisource.org**, printed with
Sāyaṇa's bhāṣya and carrying the accented pada-pāṭha on the same page. Both were collated against the
**accented Aufrecht text on sanskritdocuments.org** (`doc_veda/r10.itx`, category "veda, rigveda,
svara") — the van Nooten–Holland digitisation, a European critical lineage separate from the Indian
printed edition. The Rātri Sūkta had a third accented witness, stotranidhi.com. **Every witness of
each hymn agrees letter for letter and on every accent mark.** The same `r01.itx` was fetched for
maṇḍala 1 and added as a third accented witness to `01_agni_suktam.txt`, where it agrees throughout
and settles all three readings adjudicated there in the same direction as the pada-pāṭha.

**Both hymns were then compared letter for letter against the Saptaśatī text the corpus already
held.** The agreement is complete except for four things, all recorded in both files of each pair:
the `ॐ` that the Saptaśatī prefixes to ṛc 1; the kampa numerals `१` and `३`, which are part of accent
notation and have no place in a text printed without accent; **one real difference of reading** at
ṚV 10.127.4, where the Saptaśatī has `नि ते यामन्नविक्षमहि` against the saṁhitā's
`नि ते॒ याम॒न्नवि॑क्ष्महि`; and the spelling `भूर्य्यावेशयन्तीम्` for `भूर्यावेशयन्तीम्` at
ṚV 10.125.3. Nothing was corrected in the existing files.

**The finding that mattered most: stotranidhi.com's Devī Sūktam page is not the Śākala text.** It is
fully accented, and it would have been the obvious second witness. It reads `मया सोऽअन्नमत्ति`,
`वातऽइव` and `अप्स्वऽन्तः` with the `ोऽअ` sandhi spelling of Śukla-Yajurveda printing; it reads
`श्रुणोति` where the Ṛgvedic witnesses read `शृणोति`; it writes the kampa as `सुप्राव्ये ए३`; and it
marks the double svarita `᳚` throughout, which neither Ṛgvedic witness uses anywhere in the hymn.
That is another tradition's recension, and laying its accents on the Ṛgvedic text is exactly the
corruption the śākhā rule exists to prevent. **It was not used, and not one mark in the file comes
from it.** The same site's Rātri Sūktam page, checked the same way, **is** the plain Śākala text and
was used. The lesson is in `CLAUDE.md` now: check the page, not the site.

**Still open, and still the user's call.** The wrong sentence in the `Source / recension` field of
`devi/durga/19_durga_suktam.txt`, which describes its source as the accented recension when that
source prints no accent at all.

---

## 2026-09-12 (cont.) — the reader never sees the source information

**The rule, from the user: "i dont want user to see the source information ever."** It is now a
section of the repo-root `CLAUDE.md`, with the two field lists written out.

**Reader-facing:** `Title`, `Devanāgarī`, `Telugu`, `Language`, `Type`, `Author`, `Blurb`,
`Sections`, the count fields, and the verse units. **Withheld, always:** `Source / recension`,
`Recension note`, `Recension / śākhā`, `Recension / paddhati`, `Independent collation`,
`Not collated`, `Accent`, `Note`, and the rest of the editorial fields.

**Written: `bin/reader_view.py`.** `python3 bin/reader_view.py <file>` returns the reader's view of
one file as JSON — allow-listed header fields and the verses, nothing else. Its `reader()` function
is the one to port into the app. It works by **allow-list**, so a header field invented later is
withheld until somebody classifies it deliberately. `--audit` scans the corpus and reports every
reader field that still carries sourcing; run it after authoring.

**The finding: hiding the editorial fields is only half the job.** Sourcing has been written into
the fields a reader *does* see, in **597 places across 418 files** — `Author` 250, `Verse count`
132, `Sections` 110, `Blurb` 65, the rest in counts and titles. Those cannot be hidden by field,
because the field itself is reader-facing; each sentence has to be rewritten. Itemised in
`READER_FIELD_AUDIT_2026-09-12.md`.

**Nothing in those 418 files was edited.** Almost all of it was written by other sessions, and the
standing rule against rewriting another session's file covers its prose as much as its verse text.
**This needs the user's word before anyone starts.** The files written today in `veda/rigveda/` and
`veda/taittiriya/` were cleaned, since they are this session's own: source references were taken out
of three `Author` fields, two `Verse count` fields, and four titles, which now read "— with Vedic
accent" instead of "— accented recension".

**One case to watch.** Four files in `vidhi/madhyandina/` state their śākhā only in the withheld
`Recension / śākhā` field, and the śākhā rule requires a worshipper to be able to tell that a rite is
not theirs. The reader should label the tradition from the folder rather than from that field. Files
written since today name the tradition in the `Title`, which is reader-facing.

---

## 2026-09-12 (cont.) — where the vrata vidhānas come from

**Why.** The folder `puja/smarta/` has one vrata written and about fourteen more surveyed and
queued. The user asked where the authentic vrata vidhānas are to be sourced from. Nothing was
authored in this round. The answer was established by fetching and measuring, and it is written
into the **"Vrata vidhāna"** subsection of the Sourcing chain at the head of this file, because a
session needs it before it starts a vrata, not after.

**The finding, in one line: Gītā Press does not publish vrata vidhāna, and neither does GRETIL,**
so the first two tiers of the standing chain are empty for this genre and the authority is the
dharmaśāstra vrata-nibandha layer — **Vratarāja**, **Hemādri's Vrata-khaṇḍa**, **Dharmasindhu**,
**Nirṇayasindhu**. Identifiers, character counts and OCR-noise counts for all five are in that
subsection.

**What was measured, so it is not re-measured.**

- Gītā Press has three vrata items on archive.org, all *Vrat Paricay*, and that book is a Hindi
  calendar with Hindi kathās. *Nitya Karma Pūjā Prakāśa* holds 15 occurrences of व्रत in 370,963
  Devanāgarī characters, the only substantive one an advertisement for code 1367. Gītā Press's
  vrata publishing is Hindi kathā booklets, codes 1367, 1162 and 2217.
- GRETIL has none of the five nibandhas. Its `Nityakarmapujavidhi` is a **Buddhist** text and is a
  trap for exactly this search.
- Vratarāja's coverage of the queued fourteen was confirmed by grep on whitespace-stripped OCR:
  Siddhi-Vināyaka, Saṅkaṣṭa Caturthī, Kedāreśvara, Ṛṣi Pañcamī, Nāga Pañcamī, Varalakṣmī, Ananta.
- **Satyanārāyaṇa is in none of the four nibandhas**, which is correct rather than a gap: it is a
  late vrata attributed to the Skanda Purāṇa Revā-khaṇḍa.
- Every one of the five is a **scriptio-continua lithograph**, so a word-boundary grep returns a
  false negative and page images are needed to settle a reading. The per-vrata booklets are page
  images in practice — the Sanskrit Revā-khaṇḍa kathā yields 2,140 Devanāgarī characters from a
  23 MB PDF, and the Telugu `vrata-kalpamu` prints decode to garbled Telugu.

**Two consequences for work already on disk.**

1. `puja/smarta/14_vinayaka_chaviti_vrata.txt` records that its kathā exists only in English and
   Telugu, that no Sanskrit of it was found, and that none was invented. That was the right call
   and **the file is not to be edited.** The nibandhas carry the kathās in Sanskrit, so the
   remaining vratas need not have the same gap.
2. `puja/vaishnava/01_purvanga_vidhanam.txt` states that no independent collation exists for it.
   The TTD catalogue was extracted and searched: it has no vrata volume, but it publishes
   *Nityānusandhānam* in separate **Tenkalai** and **Vaḍakalai** recensions and *Sakaladevatā
   Pūjāvidhānam*. Those are the missing witness. **This is a note, not a licence to rewrite that
   file** — a second recension is its own file, cross-referenced.

**A warning for whoever writes the vrata tranche.** These texts are more sharply divided by
paddhati and by region than the daily pūjās are, and the division includes the **calendar**. A
vrata named for a month falls in a different month under amānta and under pūrṇimānta reckoning.
Dharmasindhu and Nirṇayasindhu are the authorities on that question. A Telugu source and a North
Indian source will disagree about it without saying so, and that disagreement is **not a variant
reading to be adjudicated** — it is the same rule as the śākhā rule in `vidhi/`. State the
reckoning the file follows.

**Revised the same session — the audience is South Indian and Telugu** (user, 2026-09-12), which
re-ranks the whole chain. The five Sanskrit nibandhas above are Bombay, Pune, Banaras and Bengal
lineages. They are still the genre's compendia, but for this reader they are **witnesses, not base
text**: a vrata is an observance someone keeps, and building it on Vratarāja would hand a Telugu
worshipper a rite that is not theirs. The Sourcing chain subsection now leads with the Telugu
prints. What the extra round established:

- **`Āru Vratālu`** (Rajahmundry 1999, Gollapudi Veeraswamy Son —
  `snmc-aaru-vratalu-pandita-parishkrutamu-telugu-and-sans`, with a second scan at `nkoi-...`) is
  the **best base text for this genre**. 97,850 Telugu characters and the OCR is genuinely clean,
  because it is a 1999 print rather than a lithograph. Sanskrit in Telugu script, with the articles
  list and the toram. Its six vratas, from its own contents page: **Vināyaka, Sarasvatī,
  Varalakṣmī, Ananta Padmanābha, Kedāreśvara, Ratha Saptamī** — four already queued, and Sarasvatī
  and Ratha Saptamī are new to the queue.
- **`VrathaRathnakaramu1` and `VrathaRatnakaramu2`** are the **coverage map** for the wider Telugu
  vrata canon, including Satyanārāyaṇa and Maṅgaḷa-Gaurī, but their OCR is early-twentieth-century
  and broken. Locate a vrata in them, then read the page images.
- **`smritimuktaphalam`** — Vaidyanātha Dīkṣita's *Smṛtimuktāphala*, **2,186,056 Devanāgarī
  characters with zero Latin noise**, the largest and cleanest Sanskrit nibandha found in either
  round, and the southern counterpart of Nirṇayasindhu. **It is kāla-nirṇaya, not vrata-vidhāna**:
  249 scattered occurrences of व्रत and no vrata-kāṇḍa. And it is **not** Āpastamba-based, which
  had been the obvious guess — measured, it cites Kātyāyana 189 times against Āpastamba 79.
- **The calendar belongs in the file.** Telugu months are amānta, North Indian pūrṇimānta, so a
  kṛṣṇa-pakṣa vrata carries a different month name in each. Shown rather than asserted: *Vrat
  Paricay* prints Śivarātri as **फाल्गुन कृष्ण**, the Telugu almanac **మాఘ బహుళ చతుర్దశి** — one
  night, two months. *Vrat Paricay* also supplies the convention to copy, writing Hanumān Jayantī
  as `अमान्त आश्विन (कार्तिक) कृष्ण चतुर्दशी`: amānta first, the other name in brackets, which is
  the bracket form `CLAUDE.md` already prescribes for a word-level variant.
- **The śākhā question does not arise for vrata, and that was measured.** `Āru Vratālu` declares no
  sūtra and no śākhā — zero ఆపస్తంబ, zero తైత్తిరీయ, one కాత్యాయన — because vrata mantras are
  Purāṇic ślokas and nāma-mantras, not Vedic recitation. **Do not infer a śākhā for a vrata file.**
  Paddhati and region still divide these texts; śākhā does not.

---

## Session 2026-09-12 (evening) — Kāṇva śākhā found; five nitya/naimittika files

User asked for the Śukla-Yajurveda sandhyāvandanam, the yajñopavīta-dhāraṇa vidhi and six smaller
naimittika texts, then added the Mantrapuṣpam. **Five written, four blocked on the one-witness
rule.** 115 units, 1,356 accent marks.

### The finding that changes `vidhi/`: the source is Kāṇva, not Mādhyandina

`vignanam.org/devanagari/shukla-yajurveda-sandhya-vandanam.html` states its śākhā in its own
abhivādana: `शुक्ल यजुर्वेदान्तर्गत **काण्व** शाखाध्यायी कात्यायन सूत्रः`. It is therefore **not**
the rite of the Gītā Press book-210 files, whose abhivādana reads `वाजसनेयि माध्यान्दिनीय
शाखाध्यायी`. Filing it in `madhyandina/` would have merged two śākhās of one Veda. **New folder
`vidhi/kanva/`.** `sanskritdocuments.org/doc_veda/shuklayajurvedIyasandhyA` is Mādhyandina by the
same test and is **not** a witness to the Kāṇva file.

**A second folder was added, `vidhi/samanya/`**, for rites whose authority is a Purāṇa or a
paddhati rather than a śākhā's sūtra, and whose northern and southern witnesses therefore print
the same text. Put a rite there only when the witnesses *show* that; not when its śākhā is merely
unknown.

### Written

| file | units | accents | witnesses |
|---|---|---|---|
| `vidhi/kanva/01_shukla_yajurveda_sandhyavandanam.txt` | 65 | 657 | vignanam (base, native Devanāgarī); stotranidhi Telugu; **two printed manuals**, shuklayajurveda.org and srimatham.com |
| `veda/taittiriya/07_mantra_pushpam.txt` | 18 | 378 | stotranidhi (base); accented TĀ 1.22 on sanskritdocuments; vignanam |
| `vidhi/taittiriya/03_yajnopavita_dharana_vidhi.txt` | 22 | 298 | stotranidhi (base); vignanam; accented TĀ **and** TB on sanskritdocuments, at the places the base text itself cites |
| `vidhi/samanya/01_gayatri_tarpanam.txt` | 6 | 23 | stotranidhi (base); **GP *Nitya Karma Pūjā Prakāśa***; **Devī Bhāgavata 11.20–30** |
| `vidhi/samanya/02_bhishmashtami_tarpanam.txt` | 4 | 0 | stotranidhi (base); **GP *Vrata Paricaya***, which prints one of the three verses |

Accent parity was measured, not assumed, in all three accented files. Two bracketed variants were
added per the variant rule: `स्वर्गलोक(स्वर्लोक)` and `आजन्म(आबाल्य)ब्रह्मचारिणे`, both from Gītā
Press. One reading was corrected — `भुयासुः` → `भूयासुः` in the Kāṇva file, settled by the
Taittirīya Brāhmaṇa 2.6 that the base text itself cites.

### Blocked — one editorial lineage only, and the rule forbids writing on it

- **Sūrya-grahaṇa śānti ślokas.** stotranidhi and vignanam are **character-identical**, ZWJ defect
  included, so they are one text published twice, not two lineages. GP *Vrata Paricaya* has a
  grahaṇa-śānti entry but prints a **different** mantra (`तमोमय महाभीम सोमसूर्यविमर्दन`), so it
  witnesses the observance and not these eight ślokas.
- **Bhasma-dhāraṇa vidhi** — stotranidhi Telugu only. sanskritdocuments' four bhasma texts are
  Śiva-rahasya *māhātmyas*, not this vidhi, and share none of its verses.
- **Kārtika-snāna vidhi** — stotranidhi **Kannada only**. GP *Vrata Paricaya* has a Kārtika-snāna
  entry from Hemādri, but it is prose describing the observance and quotes Madanapārijāta, not
  these mantras.
- **Mahāgaṇapati caturāvṛtti tarpaṇam** — stotranidhi only; absent from vignanam, from
  sanskritdocuments and from both GP volumes searched.

Any of the four unblocks the moment a second printed edition is found. Do not write them from one
source.

### Source notes worth keeping

- **archive.org went down mid-session (HTTP 502, "Temporarily Offline") and came back.** Gītā Press
  is unreachable while that lasts; retry rather than concluding a text has no GP witness.
- **GP *Nitya Karma Pūjā Prakāśa*** is now located: archive.org `nitya-karma-puja-prakash-gita-press-gorakhpur`,
  370,963 Devanāgarī characters, **zero Latin OCR noise**. It carries the Gāyatrī tarpaṇa citing
  `(देवीभागवत)` and the direction that it is done **only at the morning sandhyā**.
- **The stotranidhi ASCII-colon defect recurs on every page used** — 5 in Mantrapuṣpam, 10 in the
  yajñopavīta vidhi. Map `:`→`ः` before diffing or a clean collation reads as a failure.
- **The Kāṇva page spells the guttural nasal seven different ways on one page**; all 26 sites are
  written `ग्ं`. It also carries Telugu ritual glosses in Devanāgarī letters (`(पादमुल पै)`,
  `(चे.)`, `मुद्रलु`, `प्रवरलु चू.`), which were moved to the `vidhi:` field where instructions belong.
- **The two Taittirīya folders romanise the nasal differently** — `veda/taittiriya/` writes `ग्ं`/`ṁ`,
  `vidhi/taittiriya/` writes `ग्ं`/`gṁ`. The Devanāgarī spelling is the same in both.

---

## 2026-09-12 (cont.) — the master vrata and parva planning reference was landed

**What was asked.** The user supplied a Word document, *Stuti Master Vrata and Parva Reference*,
content planning edition, September 2026. No text was authored in this round.

**Where it is.** `reference/vrata_parva_master_reference.md`. The document body was converted to
markdown and is otherwise unchanged — 250 list entries and 264 table cells, all verified present
after conversion. A dated section was added above the body recording how the document sits with
the standing rules. Nothing in this repository was rewritten.

**What the document is.** A classification scheme, an A-to-E evidence policy, a record-field
schema, a 132-name parva inventory by Telugu lunar month, collections of vratas and nomus by
purpose, fixed-count weekday cycles, dīkṣās, pārāyaṇa programmes, a research backlog and twelve
immediate content priorities. It holds no verse text and no ritual text.

**Four findings, measured rather than assumed.**

1. **Its parva inventory is 93% already held.** Of its 132 names, 123 are already in
   `reference/thithi_parvadina_index.md`, `festivals_aarshavani.md` or `masa_visishtata.md`, most
   with a tithi and a sourced note the document does not carry. Nine are new: Bathukamma, Bonalu,
   Damanaka, Hartalika Gaurī, Mukkanuma, Pithori, Rāghavendra Svāmi Ārādhana, Sakata Caturthī, and
   Kedāreśvara under that name. Kedāragaurī is a partial case — one dated entry in
   `festivals_aarshavani.md`, absent from the tithi index. **The lists were not merged.**
2. **Five of its twelve priorities already have a located source** — Varalakṣmī, Kedāra Gaurī,
   Ananta Padmanābha, Maṅgaḷa Gaurī and Vaibhava Lakṣmī, all on the vrata queue above. The other
   seven have none: Kalyāṇa Gaurī Nomu, Undrālla Taddi, Pōlāla Amāvāsya with Pithori, Sapta
   Śanivāra, Ekādaśa and Ṣoḍaśa Somavāra, the Kārtika lamp and Dāmodara observances, and the four
   dīkṣās. Six of those seven are Telugu regional or fixed-count observances, which is the part of
   the genre this queue has not surveyed. Vratha Ratnākaram vols. 1 and 2 are the coverage map,
   and their OCR is broken, so the page images must be read.
3. **Its evidence grades and the vrata chain above measure different things — decided (user,
   2026-09-12).** The document grades a regional vrata or nomu publication D and the classical
   nibandhas B; the chain above makes the Telugu print *Āru Vratālu* the base text and the
   nibandhas witnesses only. **Both stand.** A grade measures how much weight a claim carries and
   governs what may be said about a vrata. The chain decides which edition supplies the base text
   and governs what is transcribed. See the "Grade and base text" subsection at the head of this
   file.
4. **It is silent on śākhā, and correctly so.** That agrees with the measurement above. Its
   Context field group provides for paddhati and region, which are what actually divide this
   genre.

**One rule applies to its field schema.** Of its six field groups, Identity, Calendar, Practice
and Context are reader-facing; **Evidence and Publishing are withheld**, under the rule added
earlier today. `bin/reader_view.py` works by allow-list, so any header field the schema
introduces stays withheld until somebody classifies it.

### 2026-09-12 (later) — the four blocked files written, and three of the four unblocked

The four texts reported blocked earlier in the day were written on the user's instruction ("write
all"). Before writing, a seven-modality witness hunt was run across all four. **Three of the four
turned out not to be blocked at all** — the earlier search had simply looked in the wrong places.
The lesson is in the modality that found each one.

| file | units | what unblocked it |
|---|---|---|
| `navagraha/40_surya_grahana_shanti_shlokah.txt` | 10 | **the scriptural source.** The eight verses are **Matsya Purāṇa 67.9–16**, on GRETIL from the Calcutta 1954 Caukhamba printing. Also in two nibandhas: the **Śānti-Kusumākara** (aupasana.com) and the **Bṛhaddaivajñarañjana** (sa.wikisource). Three lineages. |
| `vidhi/samanya/03_bhasma_dharana_vidhi.txt` | 8 | **a second manual plus a Purāṇic stotra.** `mahanyasam.com`, which adds the Upaniṣadic bhasma-mantra the base text drops and lacks two verses it has; the **Mahāmṛtyuñjaya Stotram** (Mārkaṇḍeya/Padma Purāṇa) for the whole of unit 5; **TS 1.8.6, TĀ 10.56, TB 1.6.10.4** for the Mṛtyuñjaya; the **Sakalāgama-sāra-saṅgraha** (IFP transcript T0351) for unit 4. |
| `vidhi/samanya/04_karthika_snana_vidhi.txt` | 5 | **partly** — Gītā Press *Vrata Paricaya* for the observance, and `ganga/05_ganga_kavacam.txt` (sanskritdocuments, Brahmāṇḍa Purāṇa) for the closing verse. The body still rests on the one Kannada page. |
| `puja/smarta/23_mahaganapati_chaturavrutti_tarpanam.txt` | 21 | **the closing verse only**, in four forms — two Gītā Press, one Vārāhī, one here. The rite itself still rests on one page, and the header says so. |

**What the earlier search got wrong, and it is worth remembering.** It looked for *another ritual
manual* and stopped when it found none. **Three of these four were settled by looking for the
scriptural source instead** — a Purāṇa, an Upaniṣad, a nibandha, a manuscript transcript. When a
devotional page has no sibling, ask what it is quoting.

**Corrections made, each settled by a named witness, none on judgement alone:** `वाम हसे` →
`वाम हस्ते`, `पीडतं` → `पीडितं`, `तावतस्` → `तावकस्`, all in the bhasma file.

**One page firmly rejected, with the evidence recorded in the file**: vignanam's grahaṇa page is
**character-identical** to stotranidhi's, a shared zero-width-joiner defect included. One text
published twice. The reverse error was also caught: `mahanyasam.com` was rejected by one sweep and
accepted by another, and inspection showed it **is** a separate lineage — it adds and subtracts
material, which a repost does not do.

**Two new script converters** now exist in the session scratchpad and are worth rebuilding if
needed: Kannada→Devanāgarī (flat −0x380 offset; the South Indian short `e`/`o` are the thing to
watch, and they did not occur on the page used), beside the Telugu→Devanāgarī converter already
in use.

**Still open for these four:** a printed Śaiva āhnika manual would settle the bhasma procedure of
unit 2; a Kārtika-māhātmya printing would settle the body of the Kārtika file; a printed Śrīvidyā
or Gāṇapatya upāsanā manual would settle the caturāvṛtti tarpaṇa. All three are named in their
files' headers as what is wanted.

---

## 2026-09-12 (cont.) — `bin/tel2dev.py`, and the Devī Catuḥṣaṣṭyupacāra-pūjā

**Why.** The user supplied six Telugu vrata and pūjā PDFs, then set the Lakṣa Varti one aside.
These are the Tier 1 material the section at the head of this file calls for. Two things had to be
settled before any of them could be written, and both now are.

### The blocker: no Telugu → Devanāgarī tool existed

`bin/dev2tel.py` went one way only, and **every one of these sources is Telugu script**, while this
corpus's primary column is Devanāgarī. Written: **`bin/tel2dev.py`**, the inverse.

It was **validated before use, not after.** `python3 bin/tel2dev.py --selftest` sends every `deva:`
line in the corpus through `dev2tel.py` and back: **53,400 lines, 97.71% exact identity**, and it
exits non-zero if any mismatch is unexplained. The residue is all `dev2tel.py` collapsing two
characters into one, which nothing can undo from the Telugu side — 977 `ॐ`/`ओं`, 11 `ꣳ`/`ं`, 65
nukta. **A file built from a Telugu source therefore needs one read-through for the praṇava**, and
the tool takes `--pranava-sign` to switch the default.

**The round trip also found 138 pre-existing defects in corpus files** — 66 ASCII colons where
visarga belongs, 70 places spelling the guttural nasal one way where other files spell it the other,
and two impossible double-mātrā typos (`राैद्राय` in `navagraha/03`, `वाय्वाधारााश्च` in
`vidhi/madhyandina/03`). **Nothing was fixed**, per the standing rule; they were reported as a
separate task.

### What the six PDFs are — triage, so nobody re-does it

**Check the text layer before reading page images, and check the print date before judging the OCR.**

- **Four are page images only** and must be read by eye: Lakṣmī Kubera (Buṭṭe Vīrabhadra Daivajña,
  Rajahmundry), Śrāvaṇa Maṅgaḷa Gaurī (**Challa Lakṣmīnṛsiṁha Śāstri, Machilipatnam, 1958, with
  Āndhra tātparya** — the best printed authority of the six, same lineage as the 1917 Chitragupta
  Vrata Kalpamu on archive.org), Kedāreśvara (**no author, no press, no date** — an anonymous typed
  handout, and the weakest of the six), and the Lakṣa Varti (Challa, 1995) which the user set aside.
- **Two carry an embedded text layer, and it is a legacy Telugu font encoding** — the Anu-family
  fonts (Jyothi, Dharani, Vasantha) in the 64-Upacāra, a different one in Anagha Aṣṭamī. Both
  extract as mojibake (`K«`«∞+¨¬+≤ì LÑ¨Kå~° Ñ¨Ó[`). **Do not try to decode them.** The
  `/Differences` arrays and ToUnicode CMaps name the glyphs in Latin, so there is no key inside the
  file, and it is a substitution cipher with visual reordering. **Render the page and read it
  instead** — these are digital-native, so the render is crisper than any of the four scans.
- The Lakṣmī Kubera book is **real vidhāna**, not only yantra plates: its pp. 10-11 carry the full
  standard smārta pūrvāṅga with the twenty-four-name ācamana, and its Telugu instruction lines map
  directly onto the `vidhi:` field. The yantra is front matter.

### Written: `devi/lalita/39_devi_chatuhshashtyupachara_puja_stotram.txt` — 72 units

**Not a vrata, and it went to `devi/lalita/` rather than `puja/`, for a reason worth recording.**
A site search turned up that this text is **Ādi Śaṅkarācārya's**, its colophon naming him in full,
and that stotranidhi publishes it — so the user's PDF is not the only witness to it, and the right
base text is the clean Unicode one. stotranidhi's own header says it prints **the ślokas only**;
the PDF sets the same verses out as a rite of sixty-four services. That is two forms of one poem.
The verse form is a stotra and went to the stotra folder; if the full rite is ever wanted as a
`vidhi` file it is its own file in `puja/smarta/`, cross-referenced, not a rewrite of this one.

- **stotranidhi publishes this text in Telugu only** — its `/hi/` URL redirects back to the Telugu
  page — so the `deva:` column is transliterated by `bin/tel2dev.py` and `iast:` by
  `bin/dev2iast.py`. **No Sanskrit in the file was typed by hand**, which is the point of having
  built the tool first.
- **72 verses, not 64.** Sixty-nine carry the worship, three are the phalaśruti. The count is
  reported as the source yields it and not trimmed to the title, per the verse-count rule above.
- **The collation is real**, not the same site in another script: the Pīṭham edition is a maṭha's
  order of service against a stotra anthology, and every verse checked matched word for word.
- Recorded in the file and **not carried over**: the PDF's refrain and service names, its own
  dhyāna verses, a sixteen-name **aṅga-pūjā** at its twenty-eighth service, seven closing ślokas,
  and **two printing errors** — its sequence mark (55) is skipped, and `चतुरंगसैन्यम्` is marked
  (57) where the order requires (47). The service numbers do **not** map one-to-one onto the verses;
  that was checked rather than assumed, and the sections group the verses by what they offer.
- **Accent: none, correctly.** The PDF heads each of its sixty-four services with one accented ṛc of
  the Puruṣa Sūkta and one of the Śrī Sūkta. Those are Vedic text, not part of this poem, and were
  **not** transcribed in; the corpus already holds both sūktas accented and the file points at them.

`bin/reader_view.py --audit` clean for the new file; `bin/recount.py --write` reconciled at 889.

**Queued next, in this order:** Anagha Aṣṭamī (text layer, render-and-read; stotranidhi has an
Anaghāṣṭamī page as the independent witness), Śrāvaṇa Maṅgaḷa Gaurī (strongest print; stotranidhi
has it too), Lakṣmī Kubera (no digital witness found yet — check before writing), Kedāreśvara (take
the base text from stotranidhi's two Kedāreśvara pages and Āru Vratālu, and use the anonymous
handout as a witness only).

### 2026-09-12 (cont.) — the three follow-ups the user asked for

**1. The grade-and-base-text question is settled (user, 2026-09-12): keep both, they measure
different things.** Written into the new **"Grade and base text"** subsection at the head of this
file and into `reference/vrata_parva_master_reference.md` §1. A grade governs what may be said
about a vrata; the tier governs which edition is transcribed. A low grade is not a reason to
change the base text, and a high grade does not promote a witness to base text.

**2. The seven unsourced priorities were hunted.** Result in the **"The twelve planning
priorities, source-hunted"** subsection above. Three are now sourced — Undrālla Taddi and the
Kārtika observances cleanly, Pōlāla Amāvāsya in degraded OCR — one is sourced but image-only
(Piṭhōrī, a 1711 Skanda Purāṇa manuscript yielding 1,918 garbled characters), and three were not
found at all: Kalyāṇa Gaurī Nomu, Sapta Śanivāra, and the Somavāra cycles, along with all four
dīkṣās. The find of the round is `atla-tadiya-w`, **whose catalogue title is wrong** — it is
*Candrōdaya Gaurī Vratam*, and it carries a complete pūjā vidhāna plus the kathās of both
Undrālla Taddi and Aṭla Taddi in clean Telugu.

**3. The nine missing parva names were researched and added** to
`reference/thithi_parvadina_index.md`, each with a cited source, in that file's own format, with
a dated note in its header saying they did not come from *Aarsha Vani*. **No existing entry there
was altered.** Three do not sit on a tithi and went into its Notes — Bonālu is reckoned by the
Sundays of Āṣāḍha, Mukkanuma is solar, and Bathukamma and Kēdāra Gaurī are multi-day and are
entered at both ends. Sakaṭa Caturthī was found to be the Māgha occurrence of the monthly
Saṅkaṣṭahara Caturthī rather than a separate festival, and is entered as a named instance.

**4. Authoring the five was prepared but not done.** *(Superseded 2026-09-14: **all five are
now written** and they live in `puja/vrata/` — Varalakṣmī `01`, Kedāreśvara `02`, Maṅgaḷa Gaurī
`03`, Vaibhava Lakṣmī `04`, Ananta Padmanābha `05`. See the session logs at the end of this file.
The paragraph below is kept for the record of how they were staged.)* Each carries a unique kathā,
which is why the survey above calls them the expensive ones, and five of them did not fit this
session alongside the three items above. What was done instead is the staging: `Āru Vratālu` was
fetched and **mapped line by line** — see the subsection above — so the authoring session opens
its base text at the right line instead of re-deriving the map. Three of the five sit in that
volume with both a Sanskrit and a Telugu kathā and with their toram apparatus located. Maṅgaḷa
Gaurī and Vaibhava Lakṣmī are not in it and take their base text from the stotranidhi pages and
the 1998 booklet recorded above.

### 2026-09-12 (cont.) — four vrata PDFs supplied by the user

The user supplied four PDFs with no instruction. Each was measured for a text layer, read, and
recorded above under "Four PDFs supplied by the user, measured 2026-09-12". Nothing was authored.

1. **Two of the four are page-image volumes, and those are the valuable ones.** Text extraction
   returned 13 characters from the Sāvitrī Gaurī PDF and nothing but a repeated watermark from the
   Gurunātha volume. Both are clean print and fully legible to the eye. This is the reverse of the
   usual case and worth remembering: **a PDF with no text layer is not a PDF with no text.** The
   two files that extracted cleanly were the two of least use.
2. **The Vrata Ratnākaram page-image gap is now partly closed.** This queue recorded the two
   Ratnākaram scans as a coverage map only, their OCR being garbled, and said the page images had
   to be read. Thirteen pages of volume II have now arrived as clean images.
3. **Sāvitrī Gaurī Vratam is complete and its colophon names the Purāṇa.** Vidhāna, aṣṭottara
   nāmāvaḷi, Sanskrit kathā and Telugu kathā, with printed section colophons between them. The
   kathā is from the Skanda Purāṇa Gaurī-khaṇḍa, so an edition of that khaṇḍa is a genuinely
   independent lineage and must be found before the file is written.
4. **Its date is solar, not tithi-reckoned** — the day after the sun enters Makara. Recorded in
   `reference/thithi_parvadina_index.md` under the observances that do not sit on a tithi.
5. **The dīkṣā row in the master reference is no longer empty.** Siṁha Vratam is a complete
   sixteen-day mālā dīkṣā. It is a Karnataka Smārta maṭha rite and not the Telugu reader's, and a
   file for it must say so plainly.
6. **Payo-vrata is the one item in this genre that reaches Gītā Press.** It is Śrīmad Bhāgavata
   8.16, a canonical chapter rather than a vidhāna, so tier 1 of the standing chain applies in full
   and the supplied Bhaktivedanta PDF is a locator only.
7. **Nothing was authored, and nothing existing was touched.** Disk was checked first: no file
   exists for any of the five observances. Three reference files were edited additively.

---

## 2026-09-12 (cont.) — Anaghāṣṭamī vrata written; `puja/smarta/24`

**Written: `puja/smarta/24_anaghashtami_vrata_kalpam.txt` — 53 units, 322 accent marks.** The
vrata of Anaghā and Anagha, Mārgaśīrṣa kṛṣṇa aṣṭamī, in the Dattātreya tradition. **Note the
number: 23 was taken by another session mid-run** (`23_mahaganapati_chaturavrutti_tarpanam.txt`),
which is the parallel-sessions rule biting — check the folder immediately before writing, not at
the start of the work.

**The base text is stotranidhi, not the user's PDF, and that was the right way round.** The user
supplied a printed booklet; a site search then found stotranidhi carries the whole vrata-kalpa in
clean accented Telugu, 399 lines. So the PDF became the independent witness instead of the only
source. **Always look for the text before transcribing a scan of it.**

**Structure worth knowing.** The eight yogic attainments — aṇimā, laghimā, prāpti, prākāmya,
mahimā, īśitva, vaśitva, kāmāvasāyitā — are installed on the eight petals of a lotus **as the eight
children of Anaghā and Anagha**, each called in by a verse naming it as their son. The sixteen
services are then each headed by one ṛc of the **Puruṣa Sūkta**, taken in order, which is what the
saṅkalpa itself declares (`పురుషసూక్త విధానేన`). A toraṇa of three strands is tied. The kathā runs
in six parts.

**Two collations, both real.**

1. **The user's booklet** — *Śrīśrīśrī Anaghāṣṭami Vratakalpamu*, Vedabhārati Svacchanda Dhārmika
   Sevā Saṁstha, Nēreḍmeṭ, 47 pp., which states it comes from the **second khaṇḍa of the Śrīpāda
   Śrīvallabha Caritāmṛta** — a different attribution from the base text's. It prints the pūrvāṅga
   and Gaṇapati pūjā inline where the base text points outward, and adds preparation directions.
   **The two agree exactly on all eight directions of the eight powers**, which is a genuine
   cross-lineage agreement. **They differ on the central pots** — Dattātreya in the base text,
   Anagha and Anaghādevī in the booklet — and that is recorded, not reconciled.
2. **The Puruṣa Sūkta against `veda/taittiriya/01_purusha_suktam.txt`** — the corpus's own accented
   copy. **53 lines found there, 50 identical including every accent mark.** The three differences
   are itemised in the file; the closing ṛc is **unaccented on this page** and was left so rather
   than accented from the corpus copy, which is the accent rule doing its work.

**The kathā has no Sanskrit, and the attribution could not be confirmed.** The page says the
māhātmya is in the **Uttara-parva of the Bhaviṣya Mahāpurāṇa**. Three Bhaviṣya Purāṇa scans on
archive.org were searched — the largest 1,641,197 Devanāgarī characters — and **not one contains
`अनघा` at all**; no Sanskrit Anaghāṣṭamī text exists on archive.org, and the Bhaviṣyottara items
there cover other vratas but not this one. So the kathā stays Telugu prose in the translation
fields, `deva:` carries the heading alone, and **none was composed**. Same treatment as
`14_vinayaka_chaviti_vrata.txt`.

**Seven defect classes repaired in the base text, each counted in the file.** The big one is
systematic and worth carrying forward as a source habit: **stotranidhi prints the dīrgha svarita
`᳚` as a Latin right double quotation mark `”` (U+201D)** — 25 of them here. **But the same mark is
also the genuine closing quote in the Telugu prose**, 12 times on the same page, and converting
those too put svaritas inside the story. The first pass did exactly that and it had to be caught by
reading the output; the fix is to convert `”` **only on lines that already carry an accent mark**.
The reading was verified rather than assumed — the corpus's own Taittirīya copy prints `सर्वम्᳚`,
`भव्यम्᳚`, `पादो᳚ऽस्य॒`, `तस्मा᳚द्वि॒राड॑जायत` at those very places. Also: **6 Latin `o` for the
anusvāra** (`భూమి॑o`, `అమృత॑o`, `పురు॑ష॒o`, `ముఖ॒o`, `వరే᳚ణ్య॒o`) — the same class as the 29 in
`vidhi/taittiriya/01`, and note the first count came out as 1 because the regex required a Telugu
letter after the `o` when half of them are followed by a space; **2 `గ్`+ZWJ before a spirant**,
which spell the guttural nasal and would otherwise read as a bare `g`; **6 accent-before-anusvāra**
orderings normalised; **6 ASCII colons** for visarga; and **`మహిమా` written for `లఘిమా`** in the
verse naming the eight powers. That last one was flagged in a `vidhi:` note before the repair was
actually in the pipeline — the note claimed a correction the text had not had. Caught on
verification. **If a note says "corrected here", check that it is.**

`bin/reader_view.py --audit` clean; `--write` recount reconciled at 890.

**Queued next, in order:** Śrāvaṇa Maṅgaḷa Gaurī (Challa, Machilipatnam, 1958 — strongest print of
the set, page images only; stotranidhi carries the rite too and should be checked first, as here),
Lakṣmī Kubera (no digital witness found yet — look before transcribing), Kedāreśvara (anonymous
handout; take the base from stotranidhi's two Kedāreśvara pages and Āru Vratālu, use the handout as
a witness). Also outstanding from this file: the **two Anaghā aṣṭottara nāmāvalis**, which the rite
points at and which are not in the corpus — stotranidhi publishes all four Anaghā/Anagha aṣṭottara
texts (nāmāvali and stotra for each).

### 2026-09-12 (cont.) — Varalakṣmī vrata written, the first of the five

**1. `puja/smarta/25_varalakshmi_vrata_kalpam.txt` was created.** 39 units, the full rite from
the second resolve to the handing over, with the story in six parts. Nothing existing was
touched and no other session's file was read for content.

**2. The base text is not the one this queue staged, and the reason is measurable.** The queue
named `Āru Vratālu` as the base text for this genre, and its line map put the Varalakṣmī kalpa at
1494. That section was read. **Its OCR is materially worse than the volume's average** — it
carries `ట్రీ నరలక్ష్మీ దేనతాం` for `శ్రీ వరలక్ష్మీ దేవతాం`, `సుస్టిరాభన` for `సుస్థిరా భవ`,
`అర్హ్యం` for `అర్ఘ్యం`, and the aṣṭottara is printed in three columns which the OCR has
interleaved into nonsense. It cannot be transcribed from. **The 97,850-character figure for the
volume is true and is not a guarantee about any one page of it.**

So the roles were exchanged for this file: **stotranidhi supplies the base text and `Āru Vratālu`
supplies the independent collation.** That is the same arrangement `24_anaghashtami_vrata_kalpam.txt`
uses, and it does not weaken the file — the collating witness is still a printed book of a
different publishing house, which is what the sourcing rule actually asks for.

**3. Six differences were found between the two editions, and one of them matters.** Order of
arghya and pādya; māṅgalya against upavīta at the eleventh service; **eight knots in the print
against nine in the base text, where the print's own binding mantra says `నవసూత్రం` and so
contradicts itself**; one name more in the worship of the limbs; a kalaśa pūjā the base text does
not print. And the sixth, which is **not a spelling variant and is not bracketed**: the vāyana
mantra reads `ఇందిరాయై దదాతి చ` in the base text and `ఇందిరా వై దదాతి చ` in the print. One says
it is given to Indirā, the other says Indirā gives. Both are recorded in the file and neither is
chosen over the other.

**4. Six defects in the base text were repaired, each against the print and none from judgement**
— two missing `య` in feminine datives, one `నారయణ` for `నారాయణ` which the same page prints
correctly nine lines above, `గంధి` for `గ్రంథి` twice, and `స్వశక్తతః` for `స్వశక్తితః`.

**5. The Sanskrit kathā was located and deliberately not written.** `Āru Vratālu` carries the
story in Sanskrit at line 1823 as a Gaurī–Īśvara dialogue, which is the finding this queue
recorded for five of its six vratas. **The OCR of those pages is too damaged to transcribe** —
lines of the questions are missing outright and surviving readings are broken. Nothing was
reconstructed. The file says this in its own editorial fields, and closing it needs the page
images. **This is the one real gap in the file.**

**6. Verified.** `bin/reader_view.py --audit` reports no sourcing in any reader-facing field of
the new file. `bin/recount.py` moved `puja/smarta/` from 24 to 25 and reconciles at 891.

### Session log — Śrāvaṇa Maṅgaḷagaurī vrata kalpa (2026-09-12)

Written: `puja/smarta/26_sravana_mangalagauri_vrata_kalpam.txt` — 55 units, 75 accent marks.
**Numbered 26, not 25.** A parallel session took 25 with `25_varalakshmi_vrata_kalpam.txt`
while this file was being built; that session is working the same genre. Check the folder
immediately before writing, not at the start of the work.

**Base:** `https://stotranidhi.com/sravana-mangala-gowri-vratham-puja-katha-in-telugu/`
(276 lines, Telugu script only). The site's `/hi/` and `/en/` pages for this rite do not
exist — three candidate addresses were tried and all 404. Devanāgarī by `bin/tel2dev.py`,
IAST by `bin/dev2iast.py`.

**Witness:** the user's PDF — Challa Lakṣmī Nṛsiṁha Śāstri, Machilipatnam 1958, 33 pp.,
400 copies, four annas. No text layer; `pdftotext` returned 33 bytes of form feeds. Read as
rendered page images at 150 dpi.

**The finding, and it is the important one: these are two different works for the same vrata.**
They agree on the frame — the same second resolve, the same five-year term from the first year
of marriage, the same nineteen aṅgapūjā names in the same order, the same pointer at the
aṣṭottara instead of printing it, the same thread and the same vāyana. They differ in
everything carried between those points. stotranidhi's sixteen services are the long
**Lalitā ṣoḍaśopacāra** verses in śārdūlavikrīḍita; Challa prints short anuṣṭubh verses with
his own Telugu tātparya after each. The meditation differs. **And the story is a different
story**: stotranidhi tells Dharmapāla, Vāradatta and Suśīlā in Telugu prose, while Challa
tells a Sanskrit kathā spoken by Kṛṣṇa to Yudhiṣṭhira, set in Kuṇḍinanagara, turning on a
Brahmin, an ascetic and a curse. There is no overlap between the narratives at all.
Per the repo-root rule, a difference running through the whole text is a second file.
**The 1958 recension is therefore still to be written, as its own file.** It is the stronger
printed authority of the two, and it is a full hand transcription of 33 pages of 1958 print
including the tātparya — a real job, not a tidy-up.

**Accent.** The base page prints its whole text bare — zero accent characters in 276 lines,
Vedic material included. The prāṇapratiṣṭhā mantra and the mantras over the food offering are
Vedic, and a bare printing is not evidence that they carry none. Their accent was transcribed
from the same site's accented Devanāgarī pūjā page
(`/hi/sri-durga-devi-shodashopachara-puja-in-sanskrit/`, 383 marks), which is where six
sibling files of this folder already took these same mantras, in the same śākhā and paddhati.
**Lesson, and it cost a defect:** the first pass typed those lines by hand and dropped the
anudātta from `चक्षु॒ः`. Pulling the 13 lines from the fetched page by machine and diffing
against what had been typed found it. **Do not hand-type accented text when the source is
already on disk — lift it and diff it.** Five ASCII colons for visarga were mapped in those
lines, the defect class recorded in `19_durga_shodashopachara_puja.txt`.

**The base page is otherwise clean**, which is unusual and worth recording: its three ASCII
colons are ordinary punctuation in a note and two advertisements, not visarga; no Latin `o`
for anusvāra; no zero-width joiners; no accent written before an anusvāra. Its six typographic
quotation marks are genuine quotation marks in the Telugu story and were left alone — on this
page, unlike the accented Veda pages, none stands for a svarita. One spelling slip is left as
printed and flagged: `పుజా` for `పూజా` in the first line.

**Lesson repeated from the previous file, and it bit again.** The header was written before the
build and claimed 52 units, 62 accent marks, and six repaired colons. The build gave 55 units,
75 marks, and zero repaired colons. Every number in a header is a claim about the output and
has to be read back off the output. The accent figure also has to exclude the header's own
prose, which quotes accented text.

**Queued next, in order:** the 1958 Challa recension of this vrata as its own file (33 page
images, full transcription); Lakṣmī Kubera (no digital witness found yet — look before
transcribing); Kedāreśvara (anonymous handout; take the base from stotranidhi's two
Kedāreśvara pages and Āru Vratālu, use the handout as a witness). Outstanding nāmāvalis that
rites in this folder point at and the corpus does not hold: the two Anaghā aṣṭottaras, and now
the Maṅgaḷagaurī aṣṭottara — stotranidhi publishes all of them.

## 2026-09-12 (cont.) — the Mahānyāsa, and a printed Mysore witness for it

`vidhi/taittiriya/04_mahanyasa_vidhi.txt`, **166 units**, six-field vidhi format. This is the long
placing of Rudra upon the body that is recited before the Śrī Rudram, and it is the largest
accented text the corpus holds: **3,931 accent marks**.

**Base text** vignanam.org's Devanāgarī Mahānyāsam page — native accented Devanāgarī, 50,042
Devanāgarī characters, 5,455 accent marks over the whole page.

**Independent witness, and it is a real one.** The maintainer supplied a page-image scan of
**Mahānyāsādi, Gomaṭaṁ Srinivāsa Josyer and Sons, Mysore, 2007**, edited by Gomaṭaṁ Nārāyaṇa
Jyotiṣi. A dated print from a named press with a named editor, in a Mysore Karnātaka transmission,
against a base text that is an Andhra website. Four sections were read page by page against it —
5.2 on book pages 11–12, 5.3 on page 13, 5.4 on pages 15–16, and 7.1 on pages 21–23. **The other
nine sections were not**, and the file says so in those words rather than implying a fuller
collation than was made.

**Three things worth carrying forward.**

1. **The scan's blue ink is a student's, not the edition's.** The copy was a pupil's, and he wrote
   his own svara marking over pages 21–22 and bracketed lines his teacher skipped. His own legend
   on book page 1 gives his notation. **On those pages the accent is his hand and not the print**,
   so accent could not be transcribed from them. The two verses the book alone carries are
   therefore printed **unaccented**, and the file states why. Accent is transcribed or absent,
   never derived — and a student's annotation is not a witness.
2. **Section 7.1 disagreed on its verse count, and it went to the maintainer.** The book gives 39
   verses, the base text 37. He chose to follow the book for the extent and order. So the file
   carries 39 in the book's sequence, while the *accented text* of the 37 shared verses is still
   the base text's — following a witness for what a section contains is not the same as taking its
   accent, and the two axes are kept apart.
3. **Sections 7.2 to 7.6 are named but not printed.** They are five standalone hymns recited at
   that point. The Puruṣa Sūkta is already at `veda/taittiriya/01_purusha_suktam.txt` and the two
   now cross-reference each other. **The Uttara Nārāyaṇa, the Apratiratha, the Prati Pūruṣa and the
   Śata Rudrīya are not in the corpus in any form** and are the obvious next files. Section 0, the
   kalaśa-pratiṣṭhāpana, is absent from the printed book, so it rests on one witness and is
   described rather than set down.

**Still offered and not begun**, all on the same base text, all accented, and all carried by the
same Mysore book: Śrī Rudram Namakam (1,520 accent marks), Chamakam (798), Laghunyāsam (308),
Manyu Sūktam (311), Medhā Sūktam (171), the Aruṇapraśna and the Nakṣatra Sūktam.

### Session log — nadī-snāna saṅkalpas (2026-09-12)

Written: `vidhi/samanya/05_nadi_snana_sankalpa_ganga.txt` (3 units, northern form) and
`vidhi/samanya/06_tungabhadra_pushkara_snana_sankalpa.txt` (4 units, southern form).

**05** — base and authority Gītā Press *Nityakarma-Pūjāprakāśa*
(`nitya-karma-puja-prakash-gita-press-gorakhpur`, pp. 35-36 and 41-44). Independent witness the
*Dharmasindhu* (`in.ernet.dli.2015.484720`), which **differs** on the mṛttikā mantra: two verses
for two acts where GP prints one verse made of halves of both. GP kept, difference recorded, not
bracketed. The twelve names of the Gaṅgā have no second witness — searched `नलिनी`, `भोगवती`,
`त्रिपथगामिनी`, `द्वादशैतानि` in the Dharmasindhu and in the 1930 Chowkhambā *Nirṇayasindhu*
(`zajy-nirnayasindhu-with-commentary-of-krishnam-bhatta-b`), zero hits in both.

**06** — base the Telugu booklet *Puruṣa, Strī Snāna-saṅkalpaṁ* in `20210721_20210721_0639`
(*Tuṅgabhadrā Puṣkarālu*). **Its `_djvu.txt` is broken on Telugu conjuncts** — it was used only
to find the pages, and all four pages were transcribed from the page images. Devanāgarī by
`bin/tel2dev.py`, IAST by `bin/dev2iast.py`. The saṅkalpa frame collates word for word against
`vidhi/taittiriya/01`, which came from stotranidhi — a real second lineage for the frame.

**Three readings of `गंगा गंगेति यो ब्रूयात्` now stand in the corpus**, one in each of
`vidhi/samanya/04`, `vidhi/samanya/06` and `ganga/05`. All three differ and no file was edited.
Cross-referenced in 06's Source field.

**Sources checked and NOT usable.** `gautamipushkarakritya` (Gautamī Godāvarī Puṣkara-kṛtya,
Brahmāṇḍa Purāṇa): its OCR is old Telugu type read as Latin, 19,975 Latin characters and zero
Telugu — page images only. `FACEBOOKmohanpublications_20160510` (*Śrī Kṛṣṇā-nadī Puṣkara
Māhātmyam*, Mohan Publications 2016): has a real PageMaker text layer, but in legacy Anu fonts
(Kranthi, Priyaanka, Dharani) with custom encodings, so `pdftotext` gives mojibake; it is a
māhātmya and its first pages show no saṅkalpa.

**Still open on this thread:** a daily nadī-snāna saṅkalpa in the southern form (06 is the
Puṣkara occasion, not the daily rite); Siṁhastha / Kumbha, Tulā-snāna in the Kāverī, Māgha-snāna
and Śrāvaṇī, for which the *Nirṇayasindhu* has 7 and the *Dharmasindhu* 18 occurrences of
`सिंहस्थ` and both were downloaded but not yet read; and Godāvarī and Kṛṣṇā Puṣkara, which need
page-image work on the two items named above.

### Session log — Māgha-snāna, and what the rest of the snāna thread turned out to be (2026-09-13)

Written: `vidhi/samanya/07_magha_snana_vidhi.txt` — 6 units, all verses. Base and authority
**Gītā Press *Vrata-paricaya*** (`vrata-parichaya`, pp. 196-198). Collated against the
*Dharmasindhu* (`in.ernet.dli.2015.484720`), whose own Māgha-snāna section was read. **The two
agree word for word on the saṅkalpa verse `दुःखदारिद्र्यनाशाय` and on the sun-arghya verse
`सवित्रे प्रसवित्रे`.** Two differences recorded and not adopted: the Dharmasindhu ends the water
prayer `वाङ्मनःकायकर्मजम्` against GP's `वाङ्मनःकर्मभिः कृतम्`, and it prints an extra verse
`मकरस्थे रवौ सार्धं गोविन्दाच्युत माधव` that GP does not carry.

**`गंगे च यमुने चैव` now enters the corpus in a bath.** `vidhi/samanya/05` deliberately left it
out because *Nityakarma-Pūjāprakāśa* prints it only for the kalaśa at a pūjā. *Vrata-paricaya*
puts it in the Māgha bath itself, so unit 3 of 07 carries it on that authority.

**Four things were looked for and are not there. Recorded so nobody spends the search again.**

1. **Siṁhastha / Kumbha snāna saṅkalpa — not in the nibandhas.** `सिंहस्थ` occurs 7 times in the
   *Nirṇayasindhu* and 18 in the *Dharmasindhu*, and every one of them is **muhūrta doctrine** —
   what may not be begun while Jupiter stands in Siṁha — not a bathing saṅkalpa. *Vrata-paricaya*
   has zero occurrences of `सिंहस्थ`. A Kumbha saṅkalpa needs a source none of these three is.
2. **Tulā-snāna in the Kāverī is not a separate rite from what the corpus already holds.** It is
   the bath taken while the sun stands in Tulā, which is the Kārtika bath of
   `vidhi/samanya/04_karthika_snana_vidhi.txt` — whose unit 3 is the very verse about the sun
   entering Tulā. A separate file would be the same rite twice.
3. **No daily nadī-snāna saṅkalpa in the southern form on stotranidhi.** Its full sitemap was
   pulled — 14 post sitemaps, **13,486 URLs** — and grepped for `snana`, `sankalp`, `pushkar`,
   `tarpan`. `sankalpam-suchanalu-in-telugu` is a **lookup table** for filling saṅkalpa blanks
   (dvīpas, the sixty saṁvatsaras, ayanas, ṛtus, months, pakṣas, tithis, vāras), not a saṅkalpa.
4. **The Gautamī Godāvarī Puṣkara book has no saṅkalpa in it.** `gautamipushkarakritya`, 50 pages,
   read as page images since its OCR is unusable. Pages 5-10 are a continuous verse
   *anukramaṇikā*; pages 30-31 are the close of a **Śrī Gautamī-puṣkara sahasranāmāvalī**, ending
   at १०००. Worth writing one day as a nāmāvalī; it is not a source for a bathing saṅkalpa.

**A correction owed to another session's file, reported and NOT made.**
`vidhi/samanya/04_karthika_snana_vidhi.txt` states in its `Source / recension` that its
stotranidhi page "exists in Kannada script only — there is no Devanāgarī, Sanskrit, Telugu, Tamil
or English version of it". **That is not right, and the reason is a slug change.** The Kannada page
is `karthika-snana-vidhi-in-kannada`; the same text is also published as
`karthika-snanam-in-telugu` and `ta/karthika-snanam-in-tamil` — a different slug, which is why the
`-in-telugu` probe on the first slug 404s. The Telugu page was fetched on 2026-09-13 and carries
the same five pieces in the same order, including `ముచ్యతే సర్వ పాపాభ్యో విష్ణులోకం స గచ్ఛతి`, which
matches that file's reading exactly. It is the **same witness in another script**, so it changes
nothing about that file's collation status — only the sentence saying no Telugu page exists.
Under the standing rule this is reported, not edited.
- 2026-09-13 — Vālmīki Sundarakāṇḍa finished. Sargas 1 to 68 all written, validated and
  placed in `rama/valmiki_sundarakanda/`: 68 files, 2,824 verse units, 6,312 verse lines. Every
  header count was read back off the built file, `bin/fill_iast.py --check` and
  `bin/reader_view.py --audit` were run across the folder, and `bin/recount.py --write` was used
  to reconcile. The one reading referred to the maintainer, at sarga 54 verse 29, was settled the same day.
- 2026-09-13 — `rama/31_rama_pattabhisheka_sargah.txt` written: the Śrī Rāma Paṭṭābhiṣeka sarga,
  the last of the Yuddhakāṇḍa, 124 verse units and the colophon. Four witnesses, not the usual three:
  stotranidhi as base (where it is sarga 131), Gītā Press Part 2 as authority (sarga 128), the Southern
  text of valmikiramayan.net (sarga 128), and the Baroda critical edition through GRETIL (sarga 6.116),
  read from the TEI XML because the plain-text export drops the first half-line of every verse.
  Nineteen bracketed readings; the base text for this sarga is weaker than usual. Two website headings
  were dropped as not being text. **A fourth witness for the Sundarakāṇḍa was found in the process and
  has not been used there** — see the correction at the foot of `rama/valmiki_sundarakanda/README.md`.
- 2026-09-13 — **Standing rule widened to the whole corpus** (user: "yes widen it to the whole
  corpus"). Every new file now looks for a scholarly or critical edition of its source-work and
  collates against it; where none exists, `Source / recension` says so in those words. Tooling is
  `bin/gretil.py` (search, known, find, chapter), which caches under `bin/cache/`. Witnesses
  registered so far include the Vālmīki Rāmāyaṇa critical edition and the Mārkaṇḍeya Purāṇa, the
  latter carrying the Durgā Saptaśatī at chapters 81–93 and so bearing on `devi/durga/`.
  **Existing files are not re-collated** — that was decided the same day for the Sundarakāṇḍa and
  the same applies generally. See the sourcing ladder in `CLAUDE.md` for the four traps.

### 2026-09-14 — Maṅgaḷa Gaurī vrata written

`puja/smarta/28_mangala_gauri_vrata_kalpam.txt` is written: 45 units, the Śrāvaṇa Maṅgaḷa Gaurī vrata, kept on every Tuesday of Śrāvaṇa for the five years from the year of the marriage. Base text is the stotranidhi Telugu page, 240 lines; the Devanāgarī and IAST columns are machine-transliterated from it.

Witnesses hunted, and what each returned. The 1998 Telugu booklet of Sannidhānaṁ Narasiṁha Śarma (archive.org `xwcq-mangala-gauri-vratam-by-sannidhanam-narasimha-sarm`, Śrī Sītārāma Book Depot, Rajahmundry) **is a real independent witness and was used as one** — its OCR carries 22,621 Telugu characters and is legible through the whole rite. *Vratha Ratnākaramu* volume 2 (`VrathaRatnakaramu2`) **does carry this vrata**, from about line 15,440 to 16,200 of its OCR, but the scan is early twentieth century and the OCR is too broken to trust letter by letter, so it served as a coverage map and confirmed the shape of the rite. The *Vratarāja* of Viśvanātha and *Hemādri's Vrata-khaṇḍa* were both searched for `मङ्गलगौरी` and `मंगलगौरी` and **each returned zero**; the nibandhas carry no vrata under this name and supplied nothing. *Āru Vratālu* does not have this vrata at all.

Nine differences are recorded in the file's recension note, the largest being the story itself: the base text tells of the merchant Dharmapāla and his son Vāradatta with no frame, while the booklet has Śrī Kṛṣṇa telling Draupadī of King Jayapāla, a curse laid by Gaṇapati, a son named Śiva, and a pot of milk. Nothing from the booklet was mixed into the story. The booklet also states the day and the recurrence in words where the base text only implies them, and it differs on the toram, where the base text alone prints the binding mantra and calls the thread five-stranded while the booklet's own song calls it nine-stranded.

One defect was repaired, and it was confirmed by both printed witnesses: `పుజా` to `పూజా`. Separately the base page's own apparatus mark `[రత్న]` was dropped from the dīpa verse as the site's editorial note rather than part of the text.

Gaps that remain. The base text prints **no udyāpana** — the concluding rite of the fifth year, which the 1998 booklet sets out in full, is absent here and could close this file later. The **Maṅgaḷacaṇḍikā stava** is pointed at and not printed; *Vratha Ratnākaramu* prints it in full at that place, but its OCR is too broken to transcribe and the stava needs page images. The **aṣṭottara** is a pointer in the base text and was not compared against either nāmāvaḷi in the corpus.

### 2026-09-14 — Kedāreśvara vrata written

`puja/smarta/26_kedareswara_vrata_kalpam.txt` — the Kedāreśvara (Kedāra Gaurī) vrata, 56 units.
The rite and the story are printed on two separate stotranidhi pages and both are carried in this
one file. The vrata runs from the eighth day of the bright fortnight of Bhādrapada to the new
moon, which is twenty-one days, and the twenty-one knots of the toram are one for each of those
days. The header and the Blurb state that duration, because the rite is now often kept in a
one-day form.

Collated against the printed *Āru Vratālu*, Paṇḍita Pariṣkṛtamu, Gollapudi Veeraswamy Son,
Rajahmundry 1999, at lines 3055–3805 of its archive.org OCR. The two editions agree on the
resolve, the meditation, the invitation, the order of the services, the seventeen names of the
worship of the limbs, the twenty-one knots, the mantra for taking up the thread, the toram
mantra, the vāyana mantra and the mantra for the giving of the image. The Telugu story agrees
word for word.

Seven differences were found and all seven are recorded in the file, with both readings named.
The one that changes the sense is the name spoken over the twenty-first knot: the base text has
Mṛtyuñjaya and the print has Kedāreśvara. The others are that the print gives only a direction
where the base text prints the establishing of the pot in full; that the print omits the series
of baths with their Vedic mantras; that the print omits the mantras of the food offering, the
services of a king and the mantrapuṣpa; that the print gives the hundred and eight names in full
where the base text points elsewhere; one word in the worship of the limbs; and one word at the
sixth knot, which is printed in the bracket form.

Three defects were repaired, each confirmed by the printed witness: `విరూపాక్ష్యాయ` to
`విరూపాక్షాయ`, `వృషభద్వజాయ` to `వృషభధ్వజాయ`, and `చతుర్ధశ` to `చతుర్దశ`. Two suspected defects
were left standing because no witness confirms a correction, and the file says so.

Gaps. The *Āru Vratālu* print carries the story in Sanskrit at line 3491 of its OCR. It was
located and not transcribed, because those pages are too damaged to read with confidence, and
nothing was reconstructed. Closing that gap needs the page images. The hundred and eight names in
the print stand in three columns and were neither transcribed nor collated for the same reason.

### 2026-09-14 — Vaibhava Lakṣmī vrata written

`puja/smarta/29_vaibhava_lakshmi_vrata_kalpam.txt`, 41 units. The evening vrata of
Vaibhavalakṣmī: a full ṣoḍaśopacāra pūjā performed upon a pot, with a ṛc of the Śrī Sūkta before
the verse of each service, the worship of ten limbs, the mantra of the vāyana, and a kathā in
seven parts. The base text is the stotranidhi Telugu page, 229 lines, Telugu script only; the
Devanāgarī and the IAST were made from it by `bin/tel2dev.py` and `bin/dev2iast.py` and nothing
was typed by hand. The header states in full how this rite differs from the Mārgaśira Lakṣmīvāra
vrata, which is a separate work and was fetched and read for that purpose only.

Independent witnesses hunted, and what each returned. A printed Telugu booklet of a different
lineage was found and used for the collation: *Śubhaprada Vaibhavalakṣmī Pūjā Vidhānam*, compiled
by Śrīnidhi Koṭṭampalle Prakāśarāo, Mahesh Prakashan, Bengaluru, read from the archive.org scan
`vqye-shubhaprada-vaibhava-lakshmi-pooja-vidhana-by-srin`, 13,188 Telugu characters of OCR
measured. It agrees on every verse the two rites share and differs in seven recorded places,
including the whole shape of the rite, the rule of the weeks, one vocative and one pronoun of the
closing verse, and the kathā. *Vratha Ratnākaram* volumes 1 and 2, scans `VrathaRathnakaramu1`
and `VrathaRatnakaramu2`, were read in full — 126,949 and 365,404 Telugu characters — and neither
contains this vrata; the word `వైభవలక్ష్మీ` does not occur in either. *Āru Vratālu* does not
contain it either and was used only to confirm the wording of two shared ritual verses.
`vignanam.org` was searched through all 27,096 entries of its own `sitemap.xml` and carries no
Vaibhava Lakṣmī vrata in any script. Two northern printed witnesses were read for the date:
`pxdz_vaibhav-lakshmi-vrat-surat-sahitya-sangam` and
`BwbU_shri-vaibhav-lakshmi-vrat-katha-compiled-by-narendra-sharma-lakshmi-publication-delhi`.

What the text is. A modern printed observance of the twentieth century, not a classical one, and
the header says so plainly. The Surat booklet carries a Government of India registration number
of 1988 and names the ten other languages it is printed in; the Bengaluru booklet propagates by
the giving away of its own copies, eight to eight married women. The observance is in none of the
Telugu vrata compendia and in none of the classical nibandhas. The Telugu recension of the base
text is not the Gujarati booklet in translation: it has been given a full Śrī Sūkta pūjā and a
purāṇic kathā of Bhṛgu, Suśarma and the four sisters, which the northern booklets do not have.

Repaired: fifty, of two kinds, each counted in the header. Thirty-nine occurrences of a Latin
`o` for the anusvāra and nine of an ASCII colon for the visarga, all of them on accented lines,
repaired only on lines already carrying an accent mark; and two single-word repairs confirmed
against the *Āru Vratālu* print. Four further suspected slips were searched for in both printed
witnesses, were not confirmed, and are left exactly as the source prints them.

Gaps. The hundred and eight names were not collated. The base text prints none and points at two
nāmāvaḷis; the Bengaluru booklet prints a list, but its OCR of those pages is broken name by name
and a list cannot be collated against a list that cannot be read. Closing that gap needs the page
images. The Mārgaśira Lakṣmīvāra vrata is still unwritten and remains a separate file to make.

### Session log — Kedāreśvara collision, and three findings for `26_kedareswara_vrata_kalpam.txt` (2026-09-14)

**No file was written this session. Stopping and reporting instead, per the standing rule on
conflict.** The Kedāreśvara vrata kalpa was researched and drafted here in full — units, header
and builder are in this session's scratchpad — and then, at the moment of writing,
`26_kedareswara_vrata_kalpam.txt` was found on disk, authored by another session at 00:32 on
2026-09-14 from the same two stotranidhi pages. **An existing file is not ours to rewrite and a
second file of the same work from the same base text would be pure duplication**, so the draft
was not written. The build script refused of its own accord as well, because its accent check
could not find one of its sources; both guards agreed.

**Three findings from the drafting work that bear on that file. None has been applied to it —
a correction is not an additive cross-reference, so these are reported, not made.**

1. **The Ṛgveda citation can now be settled, and it is wrong in the base text.** That file's
   `Note` says of `గౌరీర్మిమాయ సలిలాని తక్షతి`: *"The reference was left exactly as printed. No
   witness was found that confirms it and nothing was altered."* **The witness exists.** Against
   the Aufrecht critical text through `bin/gretil.py`, the verse is **Ṛgveda 1.164.41**, the
   Gaurī verse of the Asya-vāmasya hymn. The printed `(ఋ.౧.౧౬౧.౪౧)` cannot be right:
   **sūkta 1.161 has only fourteen verses**, while 1.164 has fifty-two. The companion reference
   `(ఋ.౧.౪౩.౧)` for `kad rudrāya pracetase` **is** correct. The text of both ṛcs matches the
   critical edition; only the one reference is wrong. This is exactly the gap the standing rule
   on critical editions (2026-09-13) exists to close.
2. **`Accent: none, and none is expected` is not right for this rite, and accented sources in
   the correct śākhā were located.** The seven mantras of the bath — `āpyāyasva`,
   `dadhikrāvṇo`, `śukram asi`, `madhu vātā`, `svāduḥ pavasva`, `yāḥ phalinīḥ`, `āpo hi ṣṭhā` —
   all stand accented, **in the same order at the same seven services of a Śiva pūjā**, at
   `https://vignanam.org/devanagari/shiva-panchamruta-snanam.html` (1,108 accent marks), a
   native accented Devanāgarī Taittirīya source this corpus already uses elsewhere. Both
   Ṛgvedic ṛcs stand accented in the Śākala saṁhitā at sa.wikisource (`ऋग्वेदः सूक्तं १.४३`
   pageid 635, `ऋग्वेदः सूक्तं १.१६४` pageid 755). A page printing a mantra bare is not evidence
   that the mantra has no accent. **Caution, learned here:** vignanam's *Ṛgvedic* pages are
   mechanically converted from the Aufrecht IAST and print broken akṣaras — `प्रच्᳚एतसे` for
   `प्रचे॑तसे` — so they must not be used for Devanāgarī marking, though its Taittirīya pages
   are sound.
3. **A second independent witness exists and was not used.** archive.org `kedareswara-vratam`
   carries a complete Telugu Kedāreśvara vrata-kalpa as clean OCR — 29,538 characters, 24,515
   Telugu, **zero Latin**, correct from its first line. It is of wider scope than the base text:
   it writes out the preparation of the place, the lamp, the vessels and the twenty-four names
   of Keśava at the ācamana, which stotranidhi only points at. It agrees on the twenty-one
   strands and twenty-one knots.

**Two structural collisions that need a human decision — neither is drift in a generated count.**

- **Two files are numbered 26.** `26_sravana_mangalagauri_vrata_kalpam.txt` (written here
  2026-09-12) and `26_kedareswara_vrata_kalpam.txt` (2026-09-14). One must be renumbered.
- **Two files hold the same Śrāvaṇa Maṅgaḷa Gaurī rite, from the same base page.**
  `26_sravana_mangalagauri_vrata_kalpam.txt` (55 units, written here) and
  `28_mangala_gauri_vrata_kalpam.txt` (45 units, 2026-09-14) both take
  `https://stotranidhi.com/sravana-mangala-gowri-vratham-puja-katha-in-telugu/` as base. They
  differ in the second witness — Challa Lakṣmī Nṛsiṁha Śāstri, Machilipatnam 1958 here;
  Sannidhānaṁ Narasiṁha Śarma, Rajahmundry 1998 there — and in accent, since the mantras here
  are accented from the site's own accented pūjā page and there are left bare. **This is the
  same work, not two recensions**, so the dedup rule points at retiring one rather than keeping
  both. Which one survives is the user's call, and the readings of the other are worth keeping
  in whichever does.

**Still open, unchanged:** the Challa 1958 recension of Śrāvaṇa Maṅgaḷa Gaurī as its own file —
it is a genuinely different work (different service verses throughout, and a different kathā
entirely, spoken by Kṛṣṇa to Yudhiṣṭhira and set in Kuṇḍinanagara), and it exists only as 33
page images requiring full transcription. And Lakṣmī Kubera, 50 page images, no text layer and
no digital witness located.

### 2026-09-14 — Ananta Padmanābha vrata written

`puja/smarta/27_ananta_padmanabha_vrata_kalpam.txt` is written: 74 units, the vrata of Ananta Padmanābha kept on the fourteenth tithi of the bright fortnight of Bhādrapada and held for fourteen years. It carries the worship of Yamunā Devī as a limb, the darbha image with the breath put into it, the sixteen services, the toram of fourteen knots with its own section, the vāyana, and the story in nine parts. The base text is the stotranidhi page; the collating witness is the printed *Āru Vratālu*, Rajahmundry 1999.

The two editions agree on the meditation, on the body of the sixteen services, on the fourteen knots and their fourteen names in the same order, on the taking up, the bowing and the binding of the toram, and on the substance of the story, including the rule told inside it — the maṇḍala, the darbha image, the twenty-eight cakes of which half are given away, and all the materials counted in fourteens. Nine differences were found and all nine stand in the recension note: the number of resolves; the darbha mantra and the prāṇapratiṣṭhā, which the print does not carry; what is offered to Yamunā and in what order, the print giving her no bath in the five nectars; the Vedic `āpo vā idaṁ sarvam` passage of the subsidiary pot, which the print does not carry; the last word of the toram's verse, where the base reads `prapūjayet` and the print's story reads `prayojayet`, a difference of sense that was left unsettled; the name of the eleventh service; the hundred and eight names, which the print prints in full as those of Kṛṣṇa while the base only points at two nāmāvaḷis; the heading over the letting go of the worn toram; and the close of the rite, which the print does not have at all.

Six defects were repaired, each confirmed against the print and none from judgement: `jāṭajūṭa` to `jaṭājūṭa`, `bhāgīradhyai` to `bhāgīrathyai`, `āvahanaṁ` to `āvāhanaṁ`, `caturdaśa granthiṁ saṁyuktaṁ` to `caturdaśa granthi saṁyuktaṁ`, `ājānubhāhave` to `ājānubāhave`, and `netraṁ` to `netre`. One suspected defect was left alone: `prasādaṁ śīrasā gṛhṇāmi`, for which the print offers no witness because it has no closing.

Two gaps remain. The print's Sanskrit kathā was located at lines 2610 to 2783 of its OCR and was **not** transcribed, because those pages are damaged beyond confident reading and nothing was reconstructed; closing that gap needs the page images. The hundred and eight names were not collated and are not in the file.

### 2026-09-14 — the five vratas moved into a folder of their own

**1. `puja/vrata/` was made, and the five files written for this queue were moved into it.**
`01` Varalakṣmī, `02` Kedāreśvara, `03` Maṅgaḷa Gaurī, `04` Vaibhava Lakṣmī,
`05` Ananta Padmanābha. **The reason is genre, not paddhati.** A vrata kalpa is kept on a named
day or recurrence, it carries a story, and it usually carries a toram whose knots are worshipped
one by one and which is then bound on the wrist. The daily pūjā has no counterpart for that
apparatus. Each file still states its own paddhati, and **no file there carries a
`Recension / śākhā:` field, because śākhā does not apply to this genre.**

**2. The move also ends a numbering collision.** Other sessions filled `puja/smarta/` from 26 to
50 while these five were being written, and three of the five had landed on numbers already
taken.

**3. Four vrata files were deliberately left where they are**, because they are other sessions'
work and moving a file is a change to it: `puja/smarta/14` Vināyaka, `24` Anaghāṣṭamī,
`26` Śrāvaṇa Maṅgaḷagaurī and `49` Nāga Pañcamī. **Until the maintainer says otherwise a reader
must look in both folders**, and `puja/vrata/README.md` lists them so that the reader knows to.

**4. One rite is now written twice and this is not an error to be cleaned up silently.**
`puja/vrata/03_mangala_gauri_vrata_kalpam.txt` and
`puja/smarta/26_sravana_mangalagauri_vrata_kalpam.txt` are the same rite from the same base text,
written by two hands that did not see each other's work. The older file is the fuller of the two
at 55 units against 45. **They were collated against different printed editions** — Machilipatnam
**1958** there, Rajahmundry **1998** here — and they differ in the story they tell and in whether
an udyāpana is given. Each file now points at the other and says neither supersedes it.
**Not one character of the older file was altered. Whether to retire one of them is the
maintainer's decision and has not been made.**

**5. Relative cross-references were rewritten for the new depth** — a bare
`03_purvanga_vidhanam.txt` became `../smarta/03_purvanga_vidhanam.txt`, and so on. No bare
same-folder reference survives in the new folder.

**6. Verified.** `bin/reader_view.py --audit` reports no sourcing in any reader-facing field of
the five. `bin/recount.py` reconciles at 996 with a new tracked row for `puja/vrata/`.

### Session log — the snāna thread finished, and the Gautamī nāmāvalī (2026-09-13/14)

Written: `vidhi/samanya/08_vaisakha_snana_vidhi.txt` (3 units),
`vidhi/samanya/09_snana_bheda_bhasma_gomaya_mrittika_varuna_panchagavya.txt` (8 units),
`vidhi/samanya/10_pushkara_pitru_tarpanam.txt` (6 units),
`vidhi/taittiriya/05_malapakarshana_snana_vidhi.txt` (25 units, 650 accent marks),
`vidhi/taittiriya/06_vaikhanasa_samantra_snana_vidhi.txt` (9 units),
`devi/nadi/06_gautami_pushkara_sahasranamavali.txt` (1001 names).

**The corpus now holds Vaikhānasa material for the first time** — file `taittiriya/06`, from the
Telugu *Āhnikāmṛtam*. It is in `vidhi/taittiriya/` because Vaikhānasas are Taittirīyins, with the
paddhati named in the Title and in `Recension / paddhati`. Its deśa-kāla frame is elided in the
source and is printed as the source's own rows of dots; **nothing was filled in from a smārta
manual**, which is the whole point of keeping it separate.

**Three verified negatives. Do not search these again.**
1. **Grahaṇa-snāna has no text because the śāstra says it has none.** *Dharmasindhu*:
   `ग्रहणस्नानममन्त्रकं`. *Nirṇayasindhu* index p. 289: `ग्रहणे स्नानममन्त्रकं कार्यम्`. Its
   20-page `ग्रहणनिरूपणम्` is nirṇaya throughout.
2. **No Kumbha / Siṁhastha bathing saṅkalpa exists in any edition reached.** Seven now: the two
   nibandhas, *Vrata-paricaya*, Gītā Press *Kalyāṇ Tīrthāṅka* (`in.ernet.dli.2015.346899`), the
   *Tristhalīsetu* (`कुम्भ` **zero times in the whole work**), and two Kumbha handbooks.
3. **No Godāvarī or Kṛṣṇā Puṣkara snāna saṅkalpa.** Two TTD volumes are literary souvenirs with
   no ritual text; the Mohan Publications Kṛṣṇā māhātmya's ritual chapter (pp. 59–64) was read in
   full from page images and has pūjā, śrāddha, tarpaṇa and three immersion verses but no saṅkalpa.

**The Gautamī nāmāvalī — how it was actually done, because the first attempt failed.**
A single-pass run reached 434 of 1000 and stopped rather than guess, which was right. What worked
was splitting the pages three ways, then a reconciliation pass, then glossing in three ranges,
with the Devanāgarī and IAST generated once for all 1001 by `bin/tel2dev.py` and `bin/dev2iast.py`
so nobody retyped them. Working files are kept under `bin/cache/gautami_pushkara/` as `.dat` so
`recount.py` does not count them.

- **The counting key: the marginal numerals run every TEN**, not every fifty, from page 23 on.
  Proof: p24 c3, `ధర్మాధారాయై` = ౫౦౦ and `ధర్మజలాయై` = ౫౧౦, ten names between.
- **A new name is flush at the left margin; a continuation is indented.** That test recovered the
  name the first attempt lost (p21 c1, `ఖనఃపీయూషపాథసా` and `గంగాయై` are two names) and is what
  makes the ౨౫౦ numeral land exactly.
- **Overflow is marked with a bracket**, whose fragment may sit on the line before *or* after the
  deficient name. Counting one as a name, or reading its line as incomplete, both cause drift.
- **The file has 1001 names against a printed ౧౦౦౦, and the surplus is the printer's.** ౭౮౦ is
  absent; the off-round ౭౫౧ and ౮౩౧ are re-synchronisations; ౮౫౦ is set a line early; everything
  from ౮౦౦ on runs one low. Twelve consecutive numerals ౬౪౦–౭౯౦ land exactly on the merged count,
  which is what proves the two range junctions clean.
- **The colophon reads `సమాప్తా`, not `స్వస్తి`.**
- **The Brahmāṇḍa attribution in the colophon is not borne out.** Three Brahmāṇḍa texts totalling
  ~5.9M characters carry nothing; the Gautamī Māhātmya is in the **Brahma** Purāṇa, chs. 70–175.
  Single witness, and the file says so.

**Still open.** The *Dharmasindhu*'s `gauṇa-snāna` section (mantra-, gāyatra-, āgneya-,
kāpila-snāna) is unwritten — its Sanskrit is unrecoverable in that scan and only the Marathi
translation carries the sense. Worth assigning if a better copy turns up.

## 2026-09-17 — vrata-list gaps: three pūjās queued

The design's vrata list (`design_handoff_stuti/app/stuti-vrata-data.js`, 35 entries) was checked
against `puja/`. Only four entries have a vrata vidhāna of their own (Gaṇeśa Caturthī, Varalakṣmī,
Maṅgaḷa Gaurī, Nāga Pañcamī); seventeen fall back on the deity's ṣoḍaśopacāra; fourteen have
nothing. These three close the largest part of that gap, in this order:

- [x] **Satyanārāyaṇa vrata kalpa** → `puja/vrata/06_satyanarayana_vrata_kalpam.txt`. Base: a clean
  Telugu print in the South Indian paddhati (Vratha Ratnākaram vol. 2 is the coverage map, its OCR
  broken). Witnesses: the Revā-khaṇḍa kathā (not in GRETIL's genuine Revākhaṇḍa — it is in the
  Veṅkaṭeśvara-press "5.3" text), Gītā Press 1367 (Hindi kathā only).
- [x] ~~**Ekādaśī vrata**~~ SKIPPED 17 Sep 2026 (user: Ekādaśī has no pūjā of its own; the day is a fast, and the entry falls back on the Viṣṇu pūjā). Searched: stotranidhi, Āru Vratālu, Vratha Ratnākaram 1–2, TTD Ekādaśī Māhātmyam, dli 333460 — no printed vidhāna. → `puja/vrata/`. Covers the design's Ekādaśī entry. Gītā Press 1162 is a
  Hindi kathā witness only.
- [x] SKIPPED 17 Sep 2026 (user: Viṣṇu's pūjā is the Kṛṣṇa or Rāma pūjā; no separate Viṣṇu ṣoḍaśopacāra exists in print, so none is made). **Viṣṇu ṣoḍaśopacāra pūjā** → `puja/smarta/`, with a Paurāṇika twin. Serves Paraśurāma,
  Vāmana and Hayagrīva jayantīs in place of the nitya-pūjā `06`.

## 2026-09-17 — remaining vrata-list gaps: triage

Ten entries of `design_handoff_stuti/app/stuti-vrata-data.js` with no pūjā vidhāna, triaged against
disk (nothing for any of them in `puja/`) and the cached OCR of Vratha Ratnākaramu 1–2, Āru Vratālu
1999, the dli Telugu scans, the TTD Ekādaśī Māhātmyam, Dharmasindhu (1888) and Hemādri vol. 2, plus
stotranidhi's vrata and pūjā lists. No Telugu print carries a vidhāna for any of the ten; Vaṭa Sāvitrī has
non-Telugu printed candidates awaiting the user's choice of base. Nothing is authored yet.

- **Vaṭa Sāvitrī** (C, re-searched 17 Sep on the user's push-back). A printed vidhāna does exist, but **not in Telugu**; the Telugu-base rule may not hold here, and the choice of base is the user's.
  - [ ] **Decide base, then author.** Candidates:
    - *Vratarāja* of Viśvanātha, Khemraj ed. with Mādhavācārya's Hindi ṭīkā — `vrataraj-of-vishvanath-sharma-with-bhasha-tika-by-madhavacharya-khemraj`. **Text layer yes** (djvu.txt 8.6 MB, fair OCR), pp. 765–779 (djvu lines ~35382–36250). Complete Sanskrit rite from the Skanda/Bhaviṣya: trirātra niyama, saṅkalpa, vaṭa-pūjā (`वटमूले स्थितो ब्रह्मा…`, `नमो वैवस्वताय`), kalaśa and sand image of Brahmā–Sāvitrī, ṣoḍaśopacāra to Brahmā, Sāvitrī, Satyavān and Yama, kathā, udyāpana. Upacāra mantras are Paurāṇika ślokas; no Vedic mantras seen, so no twin. Notes that `दाक्षिणात्याः` keep the pūrṇimā and westerners the amāvāsyā — the design's amāvāsyā rule needs checking against this.
    - Hindi pamphlet, Ā. Akhileś Dvivedī, Mānav Vikās Foundation, Mumbai — `m_20240804_20240804_1431`. Text layer yes. Pūjā sāmagrī, vidhi, pūjana, kathā, āratī. **Carries Vedic mantras** (svastivācana `स्वस्ति न इन्द्रो…`, `भद्रं कर्णेभिः`, Yajurvedic pavitrī), so a Paurāṇika twin would be needed. Modern; a witness at best.
    - Marathi, Aśokakākā Kulkarṇī — `20250623_20250623_1003` (वटसावित्री पूजा व कथा) and `20250623_20250623_0958` (वटपोर्णिमा). Text layer yes; Marathi instructions with Sanskrit mantras.
    - Manuscripts (image only, witnesses): Ramtek `HArd_m-649-vat-savitri-puja-…`, `IbSu_m-2242-…`, `Fmlr_m-596-…`; Kashi Maharani `jqzv_158-…`, `maey_240-…`, `cwzb_…`, `hmyx_…`.
  - Telugu: only `SarvasowbhagyadayaniVatisavitriVratam` (Mohan Publications web post, one image) — an outline with one saṅkalpa and one śloka, not a vidhāna. *Sāvitrī Gaurī Vratam* (Vratha Ratnākaramu II pp. 264–276) is a different nine-day rite. No Kannada print found. Gītā Press: none. Hemādri: not in the cached vol. 2 part 1; JSTOR `jstor-592513` (Vaṭa-Sāvitrī-Vrata according to Hemādri and the Vratārka) locates it. TTD ebooks not reached.
- **Śītalā Saptamī** (C). No print anywhere searched; the two `శీతలా` hits are the nāma `ఇందుశీతలాయై` inside Lakṣmī nāmāvaḷis. A North Indian observance with no South Indian paddhati; the design itself describes it as aṣṭakam reading. Likely skip.
- **Guru Pūrṇimā** (C, re-searched 17 Sep). No Telugu householder Guru- or Vyāsa-pūjā vidhāna found. What exists:
  - **Guru pūjā, decided 17 Sep 2026 (user):** no separate file. Guru Pūrṇimā uses `puja/smarta/52_guru_paduka_puja.txt` (pādukā pūjā, new) and `puja/smarta/44_shankaracharya_shodashopachara_puja.txt` as the Guru pūjā. No printed householder Guru or Vyāsa pūjā vidhāna was found; Dharmasindhu's is the sannyāsin's rite.
  - Dharmasindhu (cached `dharmasindhubykashinathupadhyaya1888…`, line ~3563): the Āṣāḍha Pūrṇimā Vyāsa-pūjā is the **sannyāsin's** cāturmāsya rite — Kṛṣṇa, Vyāsa and Bhāṣyakāra (Śaṅkara) with their parivāra (Sumantu, Jaimini, Vaiśampāyana, Paila; Padmapāda, Viśvarūpa, Toṭaka, Hastāmalaka) in a maṇḍala. Witness only; Sanskrit, no Vedic mantras in the excerpt. Also manuscripts `wg1217`, `wg1215`, `DevanusariChaturmasyaPrayoga…` (image).
  - *Śrī Guru Pāda Pūjā Vidhānam*, Swami Paramārthānanda, Sastraprakasika Trust, Chennai, 1999/2002 — `sri-paduka-puja-vidhanam`. Text layer: IAST clean, Devanāgarī mangled. Guru stotram, Dakṣiṇāmūrti stotram, pāda-pūjā with nāma-mantra upacāras (`…sadgurave namaḥ, pādyaṃ samarpayāmi`), guru aṣṭottara. No Vedic mantras seen. A Tamil-Nadu Advaita print, not Telugu — user to decide whether it can be the base.
  - Not found: Gītā Press Nitya Karma Pūjā Prakāśa (`NityaKarmaPujaPrakashGitaPressGorakhpur`, text layer, no Vyāsa/Guru pūjā); stotranidhi (Telugu, Sanskrit and Hindi pūjā-vidhi indexes: only Śaṅkarācārya ṣoḍaśopacāra, already `puja/smarta/44`; guru list has stotras only); vignanam sitemap (guru-pādukā stotram only); Sringeri/Kanchi publications (none on archive.org); `VayasaPournami` (Mohan Publications, an article image). TTD ebooks not reached.
  - Third pass, 17 Sep (Guru pūjā vidhānam requested beside the Paramārthānanda pādukā pūjā): archive.org searched again for `గురుపూజ`, `వ్యాసపూజ`, `గురుపూర్ణిమ`, `व्यास पूजा`, `गुरु पूर्णिमा पूजा`, `vyasa puja`, `guru purnima puja`. New hits are not vidhānas: `ChaturamyasaVratam` and `gurupournami2016` (Mohan Publications, single article images), ISKCON Vyāsa-pūjā offering books (a Gauḍīya birthday homage, not a rite), `230703-02_202307` (a recording), manuscript `yojl-vyasa-puja-krama-sanskrit-ritual-paper-manuscript-` (image, unknown provenance; a possible witness only). Still no printed householder vidhāna, so nothing written. Options for the user: Dharmasindhu as base (sannyāsin's rite, would need adapting, which the rules forbid), Paramārthānanda already in hand, or fallback `44`.
  - Existing fallbacks on disk, if the user prefers: `puja/smarta/44_shankaracharya_shodashopachara_puja.txt` (matches the Dharmasindhu's Bhāṣyakāra pūjā; no Paurāṇika twin) or `puja/smarta/31_dakshinamurti_shodashopachara_puja.txt`.
  - [x] **Guru pāda pūjā written 17 Sep 2026** on the user's choice of base, Swāmī Paramārthānanda's *Śrī Guru Pāda Pūjā Vidhānam* (Chennai 1999/2002, archive.org `sri-paduka-puja-vidhanam`) → `puja/smarta/52_guru_paduka_puja.txt`, 56 units (Guru Stotram; Dakṣiṇāmūrti Stotram with six dhyāna verses; the pāda-pūjā; the guru aṣṭottara, 108 names in one unit). Read from the page images: the Devanāgarī OCR is unusable and the IAST OCR has lost its diacritics; the generated IAST was aligned by machine with the OCR's bare letters and showed no difference of reading. **Vedic: yes** — Muṇḍaka 2.2.9–10 at the nīrājana — so the Paurāṇika twin `puja/pauranika/smarta/52_guru_paduka_puja.txt` replaces them with the Gītā Press āratī verse, as `48` does (flagged for review). Stotras collated against `guru/19`, `shiva/11` and vignanam; one difference of reading is put to the user (dhyāna v1 `आनन्दरूपं` against vignanam's `आनन्दमूर्तिं`). No Guru Pādukā stotram is in the book. Open [?]: none.
- **Rakṣā Bandhan · Śrāvaṇī** (B). Skip: thread-tying is a custom, and Śrāvaṇī is the upākarma, a Vedic karma, not a pūjā.
- **Ugādi** (B). Skip: pacchadi and pañcāṅga śravaṇam, no pūjā in any print; the day's worship is the nitya pūjā `puja/smarta/01_nitya_puja_vidhanam.txt`.
- **Sītā Navamī** (B). Falls back on `puja/smarta/43_rama_shodashopachara_puja.txt` (Paurāṇika twin present).
- **Rādhā Aṣṭamī** (B). Falls back on `puja/smarta/36_krishna_shodashopachara_puja.txt` (Paurāṇika twin present).
- **Hayagrīva Jayantī** (B). Viṣṇu jayantī → Kṛṣṇa `36` or Rāma `43`. Dharmasindhu records only the utpatti on Śrāvaṇa Pūrṇimā; no Hayagrīva pūjā file exists or is in print here.
- **Paraśurāma Jayantī** (B). → Kṛṣṇa `36` or Rāma `43`. Dharmasindhu prescribes pūjā and an arghya at pradoṣa on Akṣaya Tṛtīyā, but no vidhāna.
- **Vāmana Jayantī** (B). → Kṛṣṇa `36` or Rāma `43`. Dharmasindhu names the jayantī; the `వామన` hits in Vratha Ratnākaramu are nāmāvaḷi entries, not a vrata.

# Stuti — Sanskrit stotra corpus

Verse-by-verse Sanskrit devotional texts in a fixed five-field format (Devanāgarī, IAST,
English, Telugu, Hindi). See `stotras/AUTHORING_QUEUE.md` first in any authoring session — it
carries the operational queue, the file format, and the session log.

## Sourcing rule — READ BEFORE WRITING ANY FILE

**stotranidhi.com is a convenience source, never the authority, and never the only source.**
It is well-formed and easy to parse, which makes it a good *base text* to transcribe from. It
is not a critical edition, it carries no apparatus, and it has been caught with real errors
(e.g. obligatory sandhi printed wrong: `तद्ज्ञानं` for `तज्ज्ञानं` at Bhagavad Gītā 13.17 and
18.20).

Every text must be collated against **at least one genuinely independent edition** before it is
written to disk. Independent means a *different editorial lineage* — not the same site in
another script. stotranidhi's Devanāgarī, Telugu and IAST pages are one witness, not three;
comparing them catches transcription slips only, never editorial ones.

Preference order for the authority text:

1. **Gītā Press, Gorakhpur — the ultimate source** (user, 2026-09-08). Where a Gītā Press
   edition of the text exists, it is the authority, full stop; everything below is a witness to
   be collated against it, not an alternative to it. Use another printed edition only where
   Gītā Press has not published the text.

   *Reaching it:* gitapress.org sells print and its `/ebook` portal is JS-rendered with no free
   full text, so it is an authority for readings, not a crawl target. Use archive.org
   (`creator:"Gita Press"`), which carries a `*_djvu.txt` OCR beside each PDF. Fetch that OCR
   using the `server` + `dir` fields from `https://archive.org/metadata/<id>` — the plain
   `/download/` path 404s on the Devanāgarī filenames these items use. Devanāgarī OCR drops
   lines: treat a missing entry as an OCR gap until checked against the page image, and treat
   the OCR itself as needing verification rather than as clean text.

   *Volumes located so far:* Śatanāma Stotra Saṅgraha (code 1850, id `20240905_20240905_1156`),
   Stotra Ratnāvalī, Devī Stotra Ratnākara, Śiva Stotra Ratnākara, Sahasranāma Stotra Saṅgraha,
   Nitya Karma Pūjā Prakāśa, **Sandhyopāsana-vidhi, Tarpaṇa evaṁ Bali-vaiśvadeva-vidhi
   (code 210, ISBN 81-293-0220-9, saṁ. 2064 twelfth reprint, 52 pp.)** — the last held locally
   as a page-image scan and transcribed in full to `stotras/vidhi/` on 2026-09-08.

   *Note on accents:* Gītā Press's āhnika and pūjā manuals (code 210 among them) print mantras
   **without svara marks**. They are authoritative for the *text* and not a source for accent.
   For accented Vedic text see the svara rule below.
2. **Scholarly / critical digital editions** — GRETIL
   (`gretil.sub.uni-goettingen.de`, machine-readable IAST, verse-numbered), Muktabodha, TITUS,
   the Bhandarkar critical editions where the text is epic.

   **Standing rule (user, 2026-09-13): look for a scholarly or critical edition of the
   source-work before writing any file, and collate against it as a matter of course.** This
   applies to the whole corpus, not to one text. Where such an edition exists it joins Gītā
   Press and whatever other witness you have, and the `Recension note` says what it read. Where
   none exists — which is the ordinary case for stotra, and for the āratīs and Cālīsās — say so
   in `Source / recension` in those words, so the next person knows the question was asked and
   answered rather than skipped.

   `stotras/bin/gretil.py` is how you ask. `search <word>` looks through GRETIL's index,
   `known` lists the witnesses already identified for works this corpus holds, and `find` and
   `chapter` read them. It caches what it fetches under `stotras/bin/cache/`.

   Verified and registered so far: the **Vālmīki Rāmāyaṇa** (Baroda critical edition, all seven
   kāṇḍas); the **Mārkaṇḍeya Purāṇa** 1–93, which carries the **Devī Māhātmya / Durgā Saptaśatī**
   at chapters 81–93 and is therefore a witness for `devi/durga/`; the **Viṣṇu Purāṇa** critical
   edition; the **Bhāgavata**, **Brahma** and **Śiva** Purāṇas (the last only books 1 and 7);
   and the **Ṛgveda** (Aufrecht). The **Mahābhārata** Poona critical edition and the
   critical-edition **Bhagavad Gītā** are on GRETIL but outside its TEI section, as one HTML
   file per parvan; `gretil.py known` says so, because a `search` alone would wrongly suggest
   they are absent.

   Four things to know, each of which has already caused a real error:

   - **Read the TEI XML, never the plain-text export.** GRETIL's
     `transformations/plaintext/*.txt` silently drops the first half-line of every verse for at
     least the Rāmāyaṇa. A collation against it looks complete and is wrong about half the text.
   - **GRETIL's TEI is not one shape.** Some files carry the reference as an attribute on each
     line, others use bare lines inside a group with the reference printed inline. Code written
     for one shape returns *nothing at all* for the other, silently, and the text looks merely
     absent. `gretil.py` handles both; if you write your own, test it on two different files.
   - **Never match by chapter or verse number across editions.** A critical edition is usually
     shorter and divides the text its own way — the Rāmāyaṇa's Sundarakāṇḍa in 66 sargas against
     the vulgate's 68, its Yuddhakāṇḍa in 116 against 128 or 131. Match by opening line.
   - **Presence is strong evidence, absence is weak.** A critical edition excises a great deal
     that the living recension carries, so a verse missing from it is not thereby spurious and
     is never on that ground alone dropped from a Gītā Press text. This cuts both ways: the
     critical edition is not a tie-breaker that always sides with the majority. In the first
     sarga collated against it, it twice supported the base text against both other witnesses.

   **This does not license re-collating what is already written.** The 68 files in
   `rama/valmiki_sundarakanda/` were finished before this witness was found, and the user
   decided on 2026-09-13 not to re-collate them; that gap is known and accepted, and is recorded
   at the foot of that folder's `README.md`. The same goes for any other existing file. The rule
   governs new work. Do not describe an older file as having been checked against an edition it
   was not checked against, and do not quietly go and change one.

   **`bhagavadgita/` is finished and is in the same position** (user, 2026-09-13: "bhagavadgita
   is done"). All 18 adhyāyas and the Gītā Dhyānam are written — 701 verses, plus 9 dhyānam
   units. Those files were collated against two independent digital editions
   (github.com/gita/gita and vedicscriptures.github.io), **not** against Gītā Press and **not**
   against the critical-edition Gītā registered above. That is a known gap, not an oversight to
   be quietly closed, and the Gītā is not to be re-collated or re-authored unless the user asks.
   The 701-against-700 question turns on Gītā 13.1 and is already recorded in the `Recension
   note` of `bhagavadgita/13_kshetra_kshetrajna_vibhaga_yoga.txt`.

3. **Independent digital corpora** — sanskritdocuments.org, vedicscriptures.github.io,
   github.com/gita/gita, vignanam.org.
4. **stotranidhi.com** — base text and formatting reference.

Where witnesses disagree, adjudicate against the mainstream commentarial vulgate for that text
(Śaṅkara for the Gītā; the Gītā Press / Vaṅgavāsī reading for the Saptaśatī) and record the
decision in the file's `Recension note`. Never silently pick one. Never reconstruct a verse
from memory.

Say in the `Source / recension` field exactly which witnesses were compared and how independent
they actually are — if the only cross-check available was the same site in another script, say
so in those words rather than implying a real collation.

## Śākhā separation for nitya-karma — added 2026-09-08

**Sandhyāvandana, tarpaṇa and the daily rites are śākhā-specific, and the recensions are kept
in separate files for separate users** (user, 2026-09-08). Northern practice follows the
**Mādhyandina / Vājasaneyi (Śukla-Yajurveda)** form; southern practice follows the
**Taittirīya (Kṛṣṇa-Yajurveda)** form. These are the observances of different communities, not
variant readings of one text.

1. **Never merge, harmonise or collate the two against each other.** A disagreement between a
   Mādhyandina and a Taittirīya sandhyā manual is not a variant to be adjudicated — it is two
   correct rites. The `Recension note` machinery for reconciling witnesses does not apply here.
2. **Never fill a gap in one from the other**, whether of text, sequence or accent.
3. **Every nitya-karma file must name its śākhā in a `Recension / śākhā:` header field**, and
   say plainly that it is not the universal form. A user who follows the other tradition must
   be able to tell from the file itself that it is not theirs.
4. **`stotras/vidhi/` is split by śākhā at the folder level** — `vidhi/madhyandina/` and
   `vidhi/taittiriya/` — so the separation survives someone browsing the tree rather than
   reading headers. See `stotras/vidhi/README.md`.
5. A volume may legitimately draw individual mantras from another śākhā's corpus — Gītā Press
   book 210 is Vājasaneyi-based but takes five sandhyā mantras from **Taittirīya Āraṇyaka
   prapāṭhaka 10** (the Mahānārāyaṇa Upaniṣad), which is the shared source of sandhyā mantras
   across traditions. Record that where it happens and describe the file by what it actually is
   ("Vājasaneyi-based") rather than overclaiming ("Mādhyandina throughout"). This is the one
   case where cross-śākhā material is legitimate: it is the *source volume's* own editorial
   choice, faithfully transcribed — not us importing from the other tradition.

## Svaras (Vedic accent) — added 2026-09-08

Vedic mantras carry svara marking (udātta/anudātta/svarita: `॑ ॒ ᳚`). Most of this corpus does
not, because most of this corpus is stotra, where accent is not marked. Where a text is
genuinely *Vedic chant*, accent is part of the text and dropping it loses information.

**stotranidhi.com is the working source for accented Vedic text** (user, 2026-09-08). Its Veda
pages do carry full accent marking — verified live on its Puruṣa Sūkta page, which is marked
throughout (`तच्छं॒योरावृ॑णीमहे`, `दैवी᳚ स्व॒स्तिर॑स्तु नः`). This is the one job for which
stotranidhi is reached for first rather than last. Note it is still not a critical edition, and
its coverage is patchy — its *stotra* pages are unaccented and its Veda URLs are irregular, so
a guessed URL will often 404. vignanam.org was checked and could not be confirmed to carry
accent.

**The one hard constraint — never transplant accents across śākhās.** Accent is
recension-specific. stotranidhi's accented pages are largely the Taittirīya (Kṛṣṇa-Yajurveda,
South Indian) tradition; a mantra printed in a North Indian smārta manual is very often
Mādhyandina (Śukla-Yajurveda), and the two differ in both text and marking. Taking the accents
off a Taittirīya page and applying them to a Mādhyandina mantra produces something no tradition
recites — worse than leaving it unaccented. So:

1. Establish which śākhā the mantra belongs to before looking for accent at all.
2. Take accent only from a source in **that** śākhā. If stotranidhi carries the mantra in the
   right śākhā, use it. If it carries it only in another, **leave the mantra unaccented and say
   so** in the file's `Source / recension`.
3. Never add, infer or reconstruct accent marks. They are transcribed or absent, never derived.
4. Gītā Press's āhnika and pūjā manuals print mantras unaccented; they remain the authority for
   the *text* and are simply silent on accent. An unaccented Gītā Press reading is not corrected
   by an accented stotranidhi one — the accent is added to the GP text, not the GP text replaced.

**Standing decision (user, 2026-09-08): never mix śākhās to obtain accent.** Taittirīya accent
is not to be applied to Mādhyandina mantras under any circumstance, and the reverse likewise. A
mantra whose accent is available only in a śākhā other than its own **stays unaccented**, and the
file says so. In `stotras/vidhi/` this means the five Taittirīya Āraṇyaka mantras (prāṇāyāma,
`sūryaśca mā manyuśca`, `āpaḥ punantu`, `agniśca mā manyuśca`, `uttame śikhare`) remain
unaccented — stotranidhi carries that tradition, but importing its marking into a volume whose
Yajurveda material is Mādhyandina is exactly the corruption this rule exists to prevent.

*A distinction worth keeping straight:* saṁhitā-pāṭha runs pādas together with sandhi where a
ritual manual prints them split and visarga-final (`म॑यो॒भुव॒स्ता` vs `मयोभुवः`). That is a
**pāṭha difference within one śākhā**, not cross-śākhā contamination, and it is not a reason to
reject an otherwise same-śākhā accented witness. Do not confuse the two.

**Accented sources, and what was actually verified (2026-09-08).** Only two were confirmed by
fetching and counting accent characters; the rest are unverified and must not be cited as though
they were.

- **sa.wikisource.org `शुक्लयजुर्वेदः` — VERIFIED, and the best source for Mādhyandina.** The
  accented saṁhitā sits inside the Uvaṭa–Mahīdhara *commentary* blocks; the plain verse text at
  the top of each page is unaccented, so a naive scrape of the page returns bare text and looks
  like a negative. 16 adhyāyas pulled in one session carried **19,044 accent marks** and supplied
  accented text for **31 of the 32** Śukla-Yajurveda mantras in `stotras/vidhi/` (only VS 19.36,
  `pitṛbhyaḥ svadhāyibhyaḥ`, was absent). Fetch via the MediaWiki API; rate-limits to HTTP 429,
  so pause between requests.
- **stotranidhi.com Veda pages — VERIFIED** (Puruṣa Sūkta page, 403 accent marks). Largely the
  Taittirīya tradition. Its *stotra* pages are unaccented and its Veda URLs are irregular, so a
  guessed URL will often 404.
- **vedicheritage.gov.in — checked, and NOT a source of accented text.** Its Mādhyandina page
  returns HTTP 200 but only ~80 Devanāgarī characters and zero accent marks: it is an
  audio-and-PDF portal, not a text corpus. Do not cite it for readings.
- **sanskritdocuments.org — unverified.** It returns HTTP 406 to a plain curl/WebFetch, so its
  accent coverage was neither confirmed nor ruled out. Treat as unknown until actually fetched.

**Matching accented to unaccented text is not a substring operation.** Accent marks interleave
inside words (`तत्स॑वि॒तुर्`), so a plain search for `सवितुर्` fails on text that plainly contains
it. Always strip the accent characters (`॒ ॑ ᳚ ᳓ ॓ ॔ ᳪ ᳭`) from both sides before comparing.
Beware too that saṁhitā-pāṭha applies sandhi across pāda boundaries where a manual prints the
visarga (`मयोभुवः` vs `म॑यो॒भुव॒स्ता`) — match on a short incipit, not a long one, or genuine
matches will read as misses.

## A sūkta is Vedic, and carries its accent — added 2026-09-12

**Standing rule (user, 2026-09-12): "suktams are vedic by nature so should have accents where they
carry one."** A sūkta is Vedic chant, not stotra. Where the hymn is accented in its own śākhā, the
corpus's copy of it carries the accent.

1. **Before writing a sūkta, look for an accented source in its own śākhā**, and treat an unaccented
   copy as incomplete rather than finished. This is the same rule as the svara section above, stated
   the other way round: that section says never to add accent that is not attested, this one says
   never to leave out accent that is.
2. **A volume that prints the hymn without svara is not evidence that the hymn has none.** Gītā
   Press's *Durgā Saptaśatī* prints the Vedokta Rātri Sūkta and the Ṛgvedokta Devī Sūkta unaccented,
   as it prints the whole volume, and its āhnika manuals do the same. Those are authorities for the
   text and silent on the accent. Go to a saṁhitā edition of the right śākhā for the marking.
3. **Not everything called a sūkta is Vedic.** `devi/durga/14_tantrokta_ratri_suktam.txt` and
   `devi/durga/43_tantrokta_devi_suktam.txt` are Purāṇic hymns from the Devī Māhātmya. No accent
   belongs to them and none is to be supplied. Check what the text actually is before looking.
4. **The śākhā rule still governs, and it bites here.** stotranidhi.com's *Devī Sūktam* page is
   accented but is **not** the Śākala text — it reads `सोऽअन्न`, `वातऽइव` and `श्रुणोति`, and marks
   the double svarita `᳚` throughout, which the Ṛgvedic witnesses never do. Accent from it must not
   be laid on ṚV 10.125. The same site's *Rātri Sūktam* page **is** the Śākala text. Check the page,
   not the site.
5. **This does not licence editing an existing file.** Where the corpus already holds the hymn
   unaccented, write the accented text as its own file under `veda/<śākhā>/` and cross-reference the
   two in both directions, saying that neither supersedes the other. See the rule above.

**Accented Ṛgveda, verified 2026-09-12.** Two independent lineages, both Śākala, both usable:
sa.wikisource.org's `ऋग्वेदः सूक्तं <m>.<n>` pages, which carry the accented saṁhitā-pāṭha and the
accented pada-pāṭha inside the Sāyaṇa-bhāṣya block; and sanskritdocuments.org's `doc_veda/r01.itx`
… `r10.itx`, category "veda, rigveda, svara", which is the Aufrecht/van Nooten–Holland text. The
latter needs a full browser User-Agent or the server answers HTTP 406.

## What the reader sees — added 2026-09-12

**Standing rule (user, 2026-09-12): the reader must never be shown the source information.** Where
a text came from, which editions were compared, who transliterated it, what was corrected — none of
that reaches the person reciting. It exists for whoever works on the corpus.

Every file keeps both kinds of matter in one plain-text file, with nothing marking the difference,
so the split is written down here and enforced by `stotras/bin/reader_view.py`.

**Reader-facing fields — the only ones an app may render:**
`Title`, `Devanāgarī`, `Telugu`, `Language`, `Type`, `Author`, `Blurb`, `Sections`,
`Verse count` / `Name count` / `Unit count`, and the verse units themselves
(`deva`, `iast`, `en`, `tel`, `hi`, `vidhi`, `variant`).

**Editorial fields — withheld, always:**
`Source / recension`, `Recension note`, `Recension / śākhā`, `Recension / paddhati`,
`Independent collation`, `Not collated`, `Not independently collated`, `Accent`, `Note`,
`What it does not have`, `Disambiguation for the reviewer`.

1. **Write sourcing only into the editorial fields.** No URL, no press, no site name, no
   collation result, no "as printed in the source" in `Title`, `Author`, `Blurb`, `Sections` or a
   count field. Say what the text *is*; say elsewhere where it came from.
2. **`Author` is for the attribution, not for how the attribution was established.** "Ādi
   Śaṅkarācārya" or "Traditional; no composer is named in the colophon" — not "unattributed in the
   base recension; sanskritdocuments catalogues it under…".
3. **A count field states the count and what the units are.** Not which edition numbers them that
   way; that belongs in the `Recension note`.
4. **`reader_view.py` works by allow-list**, so a header field invented later is withheld until
   somebody classifies it. `python3 bin/reader_view.py --audit` lists every reader field that still
   carries sourcing, and is the check to run after authoring.
5. **One case needs care.** Four files in `vidhi/madhyandina/` state their śākhā *only* in the
   withheld `Recension / śākhā` field, and the śākhā rule above requires a worshipper to be able to
   tell that a rite is not theirs. The reader should therefore label the tradition from the folder
   (`vidhi/madhyandina/` → Mādhyandina, Śukla-Yajurveda, northern practice), not from that field.
   Files written since 2026-09-12 name the tradition in the `Title`, which is reader-facing.

## Parallel sessions

Several Claude sessions write to this corpus at the same time (user, 2026-09-08). Two
consequences, both operational:

- **File counts drift constantly.** `PROJECT_TRACKING.md`'s per-folder counts and TOTAL are
  generated, not hand-maintained: run `python3 stotras/bin/recount.py` to see drift and
  `--write` to sync. A mismatch is not a finding and is not worth a paragraph in a report. The
  only case needing a human is an **untracked** file — a `.txt` under no row's folder, meaning a
  new genre folder appeared and needs a row.
- **Check disk before writing.** Another session may already have written the text you are about
  to author, possibly from a different printed source. Look for an existing file for that work
  first.

## Never rewrite an existing file from a new witness — added 2026-09-08

**Standing rule (user, 2026-09-08): "do not merge with prev written .. ask in case of conflict."**
This *replaces* the earlier instruction, which said to collate a new witness into the existing file.
That instruction was wrong and it destroyed work: on 2026-09-08 a Gītā Press recension of the
Hanumān Cālīsā and of the Tulasīdāsa Rāma-stuti was written *over* `hanuman/02` and `rama/19`,
overwriting text another session had authored. Both were recovered, and the pair is now kept as
`hanuman/02` + `hanuman/32` and `rama/19` + `rama/27`.

1. **A file that already exists is not yours to rewrite.** Do not replace its verse text, its
   header, or its recension note with readings from another edition — not even when your edition
   outranks its source, and not even when your reading is certainly right. The authority rule
   (Gītā Press first) governs *which reading you adopt in the file you are writing*. It is not a
   licence to edit somebody else's file.
2. **Write your witness as its own file** and cross-reference the two in both directions, saying
   plainly that neither supersedes the other. Two files recording a real recension difference are
   worth more than one file that has silently absorbed the other.
3. **Ask on conflict.** Where the two witnesses disagree and it matters — a difference of sense, a
   verse present in one and absent in the other, a different verse count — stop and put it to the
   user. Do not adjudicate it by overwriting.
4. The only additions permitted to an existing file are **additive cross-references**: a note
   pointing at the sibling file, clearly marked as added, changing not one character of the text.
   Fixing even an obvious defect in another session's file (a dropped daṇḍa, a wrong IAST
   convention) is not covered — report it instead.

(Live example of the same work reached by two routes:
`devi/durga/37_durga_ashtottarashatanama_stotram.txt`, written from the Gītā Press *Durgā
Saptaśatī*, is the same Viśvasāra Tantra text as entry 29 of *Śatanāma Stotra Saṅgraha*.)

## A one-word variant goes in brackets, not in a new file — added 2026-09-12

**Standing rule (user, 2026-09-12): where the whole text is the same and only one word or a
few words are spelled or read differently, print the other reading in round brackets in the
line itself. Do not create a second file for it.** This is how printed editions do it, and a
reciter who knows the other word finds it in place instead of being sent to another text.

The form is the base reading, then the other reading immediately after it in brackets, with no
space before the bracket. Write it the same way in `deva:` and in `iast:`, so the two fields
stay in step:

    deva:
    शंकर सुवन(स्वयं) केसरी नंदन ।
    iast:
    śaṁkara suvana(svayaṁ) kesarī naṁdana |

**The bracket may cover more than one word.** Take in as many words as the reading actually
changes, and no more. This matters most where the two readings divide the same syllables
differently, which is common in the vernacular poems:

    deva:
    सदा रहो(सादर हो) रघुपति के दासा ॥
    iast:
    sadā raho(sādara ho) raghupati ke dāsā ||

Both readings are recited. The bracket holds `सादर हो` entire, because `रहो` alone is not the
variant — the word boundary moves, and half of it would be meaningless on its own.

1. **Use brackets for a word-level difference inside a text that is otherwise the same.** A
   different word, a different spelling, a different case ending. The base reading is the one
   the file's stated source prints; the bracketed one is the other well-attested reading.
2. **Two or three such places in a text is normal. Say where each came from** in the
   `Recension note`, in one line each, so the reader knows which edition gives which. A
   bracketed reading still needs a witness, and the witness must be named.
3. **A living recitation is a witness, and the maintainer of this corpus is one**
   (user, 2026-09-12). These poems are recited daily by millions, and for the Cālīsās and the
   āratīs the oral tradition is older and wider than any one printing. Where the user gives a
   reading from the recitation he was raised with, record it — and say in the
   `Recension note`, in those words, that the witness is oral and not printed, and that it has
   not been checked against an edition. An oral reading is never the base text; it goes in the
   bracket, beside the printed reading. Worked example at verse 34 of
   `hanuman/02_hanuman_chalisa.txt`.

   This does **not** loosen the rule against reconstructing a verse from memory. That rule
   exists because *this assistant* cannot tell a remembered text from an invented one, and it
   stands unchanged. A person attesting to what they recite is a different thing, and the only
   requirement is that the file says which of the two it had.
4. **Do not bracket a reading that has no witness at all** — neither a printed edition nor a
   person who recites it. A reading this assistant merely recognises is not a witness. And do
   not bracket a difference that changes the sense of the verse; that is a real disagreement
   between editions, and rule 3 of the section above applies: stop and ask.
5. **A separate file is for a difference that runs through the whole text**, not for scattered
   words. The Hanumān Cālīsā is kept as `hanuman/02` (Sanskritised Hindi) and `hanuman/32`
   (Tulsīdās's Awadhi) because every one of its 43 units differs, by a regular
   tatsama/tadbhava correspondence — जस/यश, बिमल/विमल, कलेस/कलेश. That is two spellings of the
   poem, and a reader chooses between them. Four differing words is not.
6. **This does not license editing an existing file.** Adding a bracketed variant to a file
   another session wrote is a change to its text, and the rule above forbids it. Report it.
   Brackets are for the file you are writing.

## A list is set out as a list — added 2026-09-13

**Standing rule (user, 2026-09-13): where the text is a list — an ācamana of names, an
aṅga-pūjā, a nāmāvalī, the upacāras, a tarpaṇa run — print one item to a line and number
them. Do not run them together as a paragraph.** A reciter follows a list item by item, and
a wall of text separated by daṇḍas is hard to keep a place in.

    deva:
    अङ्ग पूजा —
    1. ॐ सुमुखाय नमः - पादौ पूजयामि ।
    2. ॐ एकदन्ताय नमः - गुल्फौ पूजयामि ।
    iast:
    aṅga pūjā —
    1. oṁ sumukhāya namaḥ - pādau pūjayāmi |
    2. oṁ ekadantāya namaḥ - gulphau pūjayāmi |

1. **Only the stotra fields are listed** — `deva:`, `iast:`, and `tel:` where it carries the
   text itself rather than a meaning. The translations in `en:`, `tel:` and `hi:` stay as
   running prose. The list is for reciting from, not for reading the meaning off.
2. **Number every item**, whether or not the tradition counts them. A heading that shares the
   first line (`aṅga pūjā —`) stays above the list, unnumbered.
3. **`deva:` and `iast:` are decided together and numbered in step.** The two fields are
   line-aligned, so item 5 must be item 5 in both. Never number one and not the other.
4. **Never number an accented line.** A line carrying svara marks is Vedic chant, and its
   daṇḍas divide the pādas of one mantra rather than separating items — numbering it would
   claim a structure the text does not have. The test is per line, not per unit: a service
   list very often sits at the foot of a unit whose mantra above it is accented, and that
   list is ordinary unaccented prose and is numbered.
5. **Never number prose, and never number what the source already numbers.** A page of
   instruction about the rite uses `स्वाहा` and `नमः` inside its sentences; an item *ends* on
   the formula. Where the source prints its own numerals (`१ ॐ धात्रे नमः`), that numbering
   stands and ours is not added on top.
6. **Numbers and line breaks are the only thing added.** Not one character of the text
   changes — a repetition count (`॥३॥`) stays attached to the item it closes.

`bin/listify.py` does this, and verifies before writing that the file's text is unchanged once
the numbering and the line breaks are taken back out. `bin/unlistify.py` is its exact inverse.
Applied 2026-09-13 to 346 list lines in 29 files across `puja/`, `vidhi/` and six stotra files.

The older `variant:` field, used in the four sahasranāma files and in `devi/varahi/12`, holds
46 readings and stays as it is. It sits on its own line after `iast:` and carries Devanāgarī
only. Do not convert those files. Use brackets in new work.

## Verse counts

Report the count the source actually yields; do not normalise it to the famous number. Where a
text's traditional count differs from the recension used, state both and explain the difference
in the `Recension note` (e.g. Bhagavad Gītā 701 vs. 700, turning on whether 13.1 is counted).

## Format and house style

Never invent a new format. Read an existing file in the target folder and match it exactly.
The house style for the three translation fields — register, fixed renderings for recurring
technical terms, speaker-line prefixes, one-line-per-field, lowercase reverential pronouns — is
documented at the top of `stotras/AUTHORING_QUEUE.md` under "File format".

### Register — the reader is an elder, not a scholar — added 2026-09-12

**Every piece of prose in a file — `Blurb:`, `vidhi:`, `en:`, `tel:`, `hi:`, section labels and
recension notes — must be direct, formal, simple and respectful** (user, 2026-09-12). The reader
is very often an Indian elder whose English is functional but not literary. Write so that such a
reader understands every sentence on the first reading.

1. **Short sentences, one idea each.** Plain, common words. Prefer a full stop to a semicolon,
   and never stack em-dash asides inside editorial prose.
2. **No literary or essayistic register.** Do not write "the interest of the text is", "the most
   striking of the nine", "the whole point of keeping both", "the part worth pausing on", "is the
   note on which the offering ends". State what the text says and what the worshipper does. A
   file is an instruction, not an essay, and never a critic's appreciation of the rite.
3. **Respect is not optional.** Deities, forefathers, scripture and the worshipper are always
   written of with respect. The rite **offers water to the forefathers**; it does not "give the
   dead their drink". Avoid "the dead" entirely — write "the forefathers", or "those who have
   departed".
4. **No ambiguity.** If a sentence can be read two ways, rewrite it. Never leave the reader to
   infer who acts, what is offered, or to whom.
5. **Formal, not casual.** Simple English is not slang: no contractions, no jokes, no cleverness.

The offending example that produced this rule, now corrected in
`stotras/vidhi/madhyandina/03_tarpana_vidhi.txt`: *"Water poured for everyone at once — this is
the rite that gives the dead their drink, and its interest is how wide the circle is drawn."*
It was both disrespectful and unclear. It now opens: *"Tarpaṇa is the daily rite in which water
is offered with respect to the gods, to the sages and to the forefathers."*

This governs new files, and prose you correct in a file that is **yours**. It does not license
rewriting another session's file — see the standing rule above; report those instead.

### Telugu — anusvāra first, conjunct in brackets — added 2026-09-13

**Standing rule (user, 2026-09-13): in the Telugu field, a homorganic nasal conjunct is written
with anusvāra, and the conjunct form follows it in round brackets.** `అఙ్గైశ్చ` and `సఙ్గ్రామే`
are correct but many readers cannot read them at a glance. `అంగైశ్చ` and `సంగ్రామే` are what a
Telugu reader expects, so that form leads.

The base reading is the anusvāra form. The conjunct follows immediately, no space before the
bracket, the same way a variant reading is written:

    tel:
    ద్వాత్రింశద్వర్ణమంత్రో(మన్త్రో)ఽయం శంక(శఙ్క)రప్రతిభాషితః ।

1. **This applies only to a nasal that is homorganic with the consonant after it** — `ఙ` before
   `క ఖ గ ఘ`, `ఞ` before `చ ఛ జ ఝ`, `ణ` before `ట ఠ డ ఢ`, `న` before `త థ ద ధ`, `మ` before
   `ప ఫ బ భ`. Only these have an anusvāra spelling.
2. **Do not convert anything else.** A geminate (`అన్న`, `సమ్మ`) has no anusvāra form. A
   non-homorganic cluster has none either — `పాన్పు` and `హనుమాన్జీ` are dental `న` before a
   labial, and they stay as they are.
3. **A nasal inside a larger cluster stays a conjunct, with no bracket.** In `శార్ఙ్గపాణి` the
   `ఙ` follows `ర్`, and anusvāra cannot follow a virāma. 37 places in the corpus are of this
   kind and are correct as printed.
4. **A short word — four akṣaras or fewer — is bracketed whole** (user, 2026-09-13), because
   that is how the reader meets it: `శంకర(శఙ్కర)`, `మహేంద్ర(మహేన్ద్ర)`, `సుగంధ(సుగన్ధ)`,
   `చంద్రబలం(చన్ద్రబలం)`. **Inside a longer compound the bracket covers only the akṣara before
   the nasal through the akṣara carrying the conjunct** — `ద్వాత్రింశద్వర్ణమంత్రో(మన్త్రో)ఽయం`.
   A long compound is never printed twice.
5. **Where two such conjuncts sit next to each other, bracket the run once** rather than
   producing overlapping or nested brackets. See `ఠంఠంఠం(ఠణ్ఠణ్ఠం)` in
   `hanuman/08_ekamukha_hanumat_kavacham.txt`.
6. **This is an orthographic convention, not a variant reading.** It needs no witness and no
   line in the `Recension note`. It is not a recension difference, and the rule about not
   rewriting another session's file does not apply to it — the whole corpus was converted on
   2026-09-13.
7. The Devanāgarī and IAST fields are **not** touched. They keep the conjunct: `शङ्कर`,
   `śaṅkara`.
8. **Telugu generated from the Devanāgarī comes out in this form already.**
   `bin/dev2tel.py` applies the rule by default, so `चन्द्रबलं` renders as
   `చంద్ర(చన్ద్ర)బలం`. The rule itself lives in `bin/telugu_anusvara.py` and can be run on its
   own. Pass `--conjuncts` (or `anusvara=False`) for the plain letter-for-letter mapping; that
   is what the `tel2dev.py` round-trip test uses, because the spelling is a reader convention
   and not part of the script mapping.

IAST is generated mechanically from the Devanāgarī to corpus convention (anusvāra `ṁ`, avagraha
`'`, daṇḍa `|` and `||`). Do not copy stotranidhi's IAST: it marks South Indian long `ē`/`ō`
where this corpus uses plain `e`/`o`.

## Dedup

A long text often contains passages that already exist in the corpus as standalone stotras
(e.g. Durgā Saptaśatī ch. 11 = `devi/durga/34_narayani_stuti.txt`). Keep both, and cross-
reference them in each file's recension note — the tradition catalogues them separately. Log
the overlap in `stotras/DEDUP_AUDIT.md`. Retire a file only when two files are the *same work*,
not when one embeds the other.

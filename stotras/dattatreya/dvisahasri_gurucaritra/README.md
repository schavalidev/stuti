# Śrī Gurucaritam (Dvisāhasrī) — the Sanskrit Guru Caritra

This is apparatus, not reader-facing text. Nothing here belongs in a file's `Title`,
`Author` or `Blurb`.

Vāsudevānanda Sarasvatī's Sanskrit Guru Caritra, composed at Māṇgāv in 1884: the life of
Śrīpāda Śrīvallabha and Nṛsiṁha Sarasvatī, told by Siddha to Nāmadhāraka. **23 adhyāyas,
1,820 ślokas**, one file per adhyāya, in the corpus's five-field format.

## Why this recension and not another

The Guru Caritra exists in Marathi and in Sanskrit, and the standing rule is that where a
work exists in both, this corpus writes the Sanskrit (user, 2026-09-19: "sanskrit always").

Vāsudevānanda Sarasvatī rendered the work into Sanskrit **three separate times**, and these
are three different works rather than three editions of one:

| work | division | ślokas |
|---|---|---|
| **Dvisāhasrī Gurucaritam** — this folder | 23 adhyāyas in three yogas | 1,820 |
| Gurusaṁhitā, alias Samaślokī Gurucaritra | 51 adhyāyas, tracking the Marathi | 6,471+ |
| Gurucaritra-kāvya, alias Triśatikāvya | 3 śatakas | 300 |

The Dvisāhasrī was chosen for two reasons, and one of them is not a matter of taste. It
carries **its own printed saptāha-pāṭha-paddhati**, so the pārāyaṇa this folder serves is
the one the book itself prescribes rather than one imported from a Marathi edition. And its
sources are far better: see below.

**The Gurusaṁhitā is the more faithful rendering and it is not authored here.** Its own
colophon calls it *samānārthā* with Sarasvatī Gaṅgādhara's Marathi, it divides into the same
jñāna-, karma- and bhakti-kāṇḍas, and because it keeps the Marathi's 51 chapters the usual
saptāha divisions land on the right chapters. That is a real gap and it is recorded, not
closed by silence. It is located at archive.org `in.ernet.dli.2015.365825` (1,114,214
characters, 898,762 Devanāgarī; 51 adhyāyas confirmed twice, by the closing colophon
*śrīgurusaṁhitāyāṁ upāsanākāṇḍe ekapañcāśattamaḥ* and by the preface), with a second scan at
`in.ernet.dli.2015.406199`. Anyone adding it should write it as its own folder and cross-
reference this one in both directions; it does not supersede this text and this text does not
supersede it.

## The name

"Dvisāhasrī" means the two-thousand. The 23 adhyāyas hold 1,820 ślokas; with the Śrīgurustuti
(112), the twelve opening ślokas and the Yogarahasya and Bodharahasya the total comes to
about 2,000.

**The count was corrected from 1,781 on 2026-09-22, and how it was got wrong is worth
recording.** The book's own table of contents gives each adhyāya's episodes with verse
ranges, and summing the last range of each gave 1,781. That table is itself OCR and is
truncated in six places: it ends adhyāya 3 at 57 where the colophon reads 58, adhyāya 7 at
47 against 50, adhyāya 9 at 69 against 83, adhyāya 14 at 62, adhyāya 17 at 67 against 106,
and adhyāya 23 at 118 against 119. The colophon count is taken, because the verse number
standing immediately before each colophon is read identically by all four OCR passes. Use
the contents table for the SECTIONS, which is what it is good for, and the colophon for the
COUNT. The preface says the count reaches 2,000 once the uvāca-mantras and half-ślokas
are counted in, "as is done for the Saptaśatī havana". The title is from Datta's own words to
the author, *saṁhiteyaṁ dvisāhasrī*.

## Sourcing

**Gītā Press does not publish this work**, in any recension or language. That was measured,
not assumed: `creator:"Gita Press"` on archive.org crossed with gurucharitra / गुरुचरित्र /
datta returns no Guru Caritra, and the only Datta title it publishes that could be located is
a Dattātreya Vajrakavaca. Gītā Press does print a Guru Caritra in **Marathi** (code 1836) and
in **Telugu** (code 2148, "Ovibaddh Chhandobaddh", a verse rendering) — both are print-only,
the bookshop site 404s and the ebook portal serves no free text, so neither could be read.
Those are vernacular renderings and not this Sanskrit work, but the Telugu one would be the
authority for a Telugu Guru Caritra if anyone acquires the print.

**No critical or scholarly edition exists.** GRETIL carries no Gurucaritra, no Gurusaṁhitā and
no Datta Purāṇa; the question was asked with `bin/gretil.py` and answered. So the sourcing
ladder falls through to the sampradāya's own editions, and the base text is chosen on the
quality of the witness rather than on rank.

### Base text — and why a fourfold OCR is an asset

Base text: archive.org **`DWISAHASRITeekaM`**, Dr. V. V. Deshmukh's edition with the author's
own ṭīkā and a Marathi translation.

That item holds the whole book **OCR'd four times in one `_djvu.txt`** — the adhyāya-1
colophon occurs at four separate offsets. That looks like a defect and is the most useful
thing in the whole family, because **the four passes disagree**. At the opening śloka, pass 1
reads `रज्न्वहिवत्` where passes 2–4 read the correct `रज्ज्वहिवत्`; on the anvaya line
beneath, the vote reverses and pass 1 alone gives the correct `रज्जु`. Four independent
readings of one page can be voted, which is what `extract.py` is for.

The edition also prints the author's own **anvaya** (pada-split) line under every śloka. A
doubtful compound can be checked against the way the author himself divided it, which is a
better check than any second edition provides.

### Witnesses

1. **`Dwisahasri`** (archive.org, 2017) — a separate edition with the ṭīkā and cūrṇikā,
   770,958 characters, 667,561 Devanāgarī. Its PDF additionally carries a born-digital
   legacy-font text layer (DV-TTYogesh plus custom subsets, zero Unicode), which a
   font-mapping pass would turn into OCR-free text. That has not been done.
2. **`in.ernet.dli.2015.405402`** — Śrī Vāsudevānanda Sarasvatī Granthamālā, puṣpa 8–9, the
   1954 Pune print both editions descend from. OCR too poor to transcribe from; consult it to
   settle a disputed reading against the page images. Duplicate scans at
   `in.ernet.dli.2015.311819` and `in.ernet.dli.2015.326479`.
3. **`SriDattaGuruCharitra`** (C. Sitarama Sastry) — the same work printed in **Telugu script**
   with a Telugu tātparya. A genuinely independent lineage: different press, different editor,
   different script tradition. This is the real collation partner, not another Devanāgarī scan.

Two witnesses in Devanāgarī from the same Granthamālā are one lineage in two printings, not
two lineages, and the files say so where it matters.

## Structure

Three yogas, and **the chapter numbering restarts in each of the last two** — a colophon
reading *nāma tṛtīyo'dhyāyaḥ* is chapter 3 in the first yoga and chapter 16 in the second.
The print gives the absolute number separately as *āditaḥ*. Getting this wrong silently
misfiles a third of the book.

| yoga | adhyāyas | numbered |
|---|---|---|
| jñānayoga | 1–13 | 1–13 |
| karmayoga | 14–18 | 1–5, with *āditaḥ* 14–18 |
| bhaktiyoga | 19–23 | 1–5, with *āditaḥ* 19–23 |

The book's own table of contents gives each adhyāya its name, its page range and its episodes
with verse ranges. That table is parsed by `bin/gurucaritra/contents.py` and is the source of
the `Sections:` field in each file — the divisions are the book's, not ours. It is **not** a
reliable source for the verse count; see the note above. The count comes from the number
standing immediately before each colophon, in `bin/cache/gurucaritra/truecounts.json`.

**Several adhyāyas carry an interpolated verse**, printed and marked क्षेपकः by the edition.
In adhyāya 1 it is unnumbered; in adhyāyas 10 and 12 it carries its own number ॥१॥ rather
than continuing the chapter's sequence; in adhyāya 9 there are two, marked क्षेपकौ in the
dual, and these are numbered 82 and 83 within the chapter. Each is kept where the print puts
it and numbered as the print numbers it.

## Accent

None. This is Purāṇic-style ślokas, not Vedic chant, and no witness marks svara. The rule that
a sūkta carries its accent does not apply here. The work does quote Vedic mantras in places;
where it does, the print gives them unaccented.

## The pārāyaṇa

`00_parayana_vidhi.txt` carries the book's own **saptāha-pāṭha-paddhati**, printed in Sanskrit
with the editor's Marathi gloss beneath. The division is by end-point, not by equal blocks:
day 1 to the end of adhyāya 4, then 9, 14, 17, 19, 21, and on the seventh day to the end of 23
followed by both rahasyas. Note this is **not** the familiar 7/18/28/34/37/43/51 division —
that one belongs to the Marathi 52-adhyāya recension and does not apply to a 23-adhyāya book.

## Tooling

`stotras/bin/gurucaritra/` — `adhyaya.py` (chapter boundaries and the yoga offsets),
`extract.py` (ślokas out of the four passes), `contents.py` (the book's own table of contents).
Cached sources are under `stotras/bin/cache/gurucaritra/`.

## Status

**All 23 adhyāyas are written** (2026-09-22). 1,818 units in all: 1,809 verses, plus the
interpolated verses the edition marks क्षेपक and prints without a number of their own.
Every line of Devanāgarī was read off the page images and checked against the four-pass
OCR vote and the author's own anvaya; the IAST is generated from that Devanāgarī and never
typed. The whole folder passes `bin/reader_view.py --audit` with no sourcing in any
reader-facing field.

**Still to write:** the Śrīgurustuti (112 ślokas, which stands before adhyāya 1 and is read
at the start of every day of the saptāha), the Yogarahasya and the Bodharahasya (read on the
seventh day after adhyāya 23), and the aparādha-kṣamāpana-stotra beginning rasajñā vaśā
(read at the end of every day). Without these four the saptāha cannot be kept from this
folder alone, so they are the next work.

The method is not optional here and is stated in `AUTHORING_QUEUE.md`: the page image
settles every reading and the OCR is used only to find a page.

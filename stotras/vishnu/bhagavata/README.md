# Śrīmad Bhāgavata — folder notes

The Sanskrit text of the Śrīmad Bhāgavata Mahāpurāṇa, **one file per adhyāya**, named
`SSAA_<name>.txt` — two digits of skandha and two of adhyāya, as one number — so that the whole
Purāṇa sorts in order. It must be one number: the corpus build takes a text's identity from its
folder and its *leading number* (`vishnu/bhagavata/0803`), and `08_03_…` would give every adhyāya
of Skandha 8 the same identity.
Begun 1 Oct 2026 (session S60) with the Gajendra Mokṣa, Skandha 8, adhyāyas 2–4, 92 verses.

This is apparatus, not reader-facing text. Nothing here belongs in a file's `Title`, `Author`
or `Blurb`.

| File | Adhyāya | Verses |
|---|---|---|
| `0802_gajendropakhyanam.txt` | 8.2, the elephant seized by the crocodile | 33 |
| `0803_gajendrastutih.txt` | 8.3, Gajendra's hymn and his release | 33 |
| `0804_gajendramokshanam.txt` | 8.4, the former lives, and the Lord's promise | 26 |

## The witnesses

1. **Gītā Press, Gorakhpur — Śrīmadbhāgavata Mahāpurāṇa with Hindi translation, codes 26 and 27**
   (two volumes). archive.org `shrimadbhagwat-mahapuran-bhag-1` (code 26, 1,024 pages, Skandhas
   1–8) and `shrimadbhagwat-mahapuran-bhag-2` (code 27). **This is the authority and the base
   text.** The PDF page numbers are the printed page numbers.
   - **The PDF carries the typesetter's own text layer in the Chanakya font encoding.** Nothing is
     read off OCR or typed: `stotras/bin/bhagavata/chanakya.py` decodes it. That decoder is new —
     the one built for the Sundarkāṇḍ on 8 Sep 2026 was never saved — and it was calibrated
     against GRETIL over the whole of code 26, not written from a table in memory. Once spacing
     and the spelling of nasals are set aside, **4,509 of 5,544 verses matched by number are
     identical letter for letter**; the rest were read and are edition readings.
   - The page layout is regular and the tools rely on it: Sanskrit in ChanakyaBold, left column,
     16pt, or 14.3–15.6pt where a long line has been condensed to fit (missing those loses whole
     half-lines); Hindi in regular Chanakya on the right; speaker lines and colophons in
     ChanakyaItalic; the Hindi chapter subtitle in bold straight after the heading; footnotes of
     variant readings at 14pt at the foot, keyed by ~12pt superscript numerals in the verse.
   - **The footnotes are an apparatus worth having.** They give प्रा० पा०, the older printed reading.
     Where one is a clean word- or phrase-level alternative it is bracketed after the printed
     reading, per the corpus rule. A footnote at the foot of a page belongs to whatever verse
     carries its numeral, which may be in the previous adhyāya (8.2.31's दैवादिमां sits under the
     opening of 8.3).
   - Read the page image at every place where the witnesses disagree. So far the text layer has
     been right every time.
2. **GRETIL, `sa_bhAgavatapurANa.xml`** (IAST, contributed by Ulrich Stiehl, "under revision"),
   cached at `stotras/bin/cache/`, read with `stotras/bin/gretil.py`. A separate lineage and the
   second witness for every file. Two things to know:
   - It **gives no verse label to many verses in the longer metres** (8.3.30–33, 8.4.13, and
     others), so `gretil.lines()` hands them the previous verse's reference. They are in the
     file; match them by position or by opening line.
   - Its data entry has slips (śāla, uḍumbara, abhyāsam, sarabhāḥ in 8.2 alone). Treat it as a
     check, never a substitute.
3. **TTD edition** with the commentaries of Śrīdhara, Vīrarāghava and Vijayadhvaja (and the
   Sudhīsudhā), which calls itself a critical edition. archive.org
   `Bhagavata_Purana_With_Multiple_Commentaries_TTD_Critical_Edition`, one PDF per skandha; the
   item lacks some skandhas (3, 5, 6, 11 were not in the listing on 1 Oct 2026). Its OCR is
   swamped by the commentaries, so it is read **only at the places where the first two witnesses
   disagree**, by searching `…Skandha NN_djvu.txt`. Its word index at the back gives verse
   references and is a fast way to confirm a reading.

## Tools (`stotras/bin/bhagavata/`)

`gpverses.py` needs PyMuPDF, which the system Python does not have: `python3 -m venv <dir>` and
`<dir>/bin/pip install pymupdf`, then run it with that interpreter. The other tools are plain Python.

- `chanakya.py` — the decoder. Unknown glyphs come out as ⟦c⟧, never passed through.
- `gpverses.py <pdf> <first> <last>` — extracts and decodes the Sanskrit side, the speaker lines,
  the colophons and the notes, in reading order.
- `gpparse.py` — groups those lines into adhyāyas and verses by the print's own numbers.
- `build_adhyaya.py` — writes a file from the parsed adhyāya and a meanings JSON (header,
  sections, edits, en/tel/hi per verse). Every edit must match exactly once and the verse numbers
  must run without a gap, or it stops.

Traps already met, all handled in `chanakya.py`: after a half-form, `Ù` is the stem with **e**,
not ो (शेते, not शोते — 729 places); `Á¢` together is only a wide ि-hook, but `Á` + half-forms + `¢`
is ि with a real anusvāra (तस्मिंस्, ग्रन्थिं); the reph may stand over an initial ऋ (निर्ऋति); `ं`
may be set before ्र (भ्रंश). The typesetter sometimes leaves a gap inside a word (`अङ् घ्रिः`,
`सङ्कु ल`); these are closed by hand in the file and named in its `Recension note`.

## Conventions in these files

- Devanāgarī letter for letter as printed, including the double avagraha (`यदाऽऽप`) and the
  press's doubled consonant after repha (`तद्वदार्त्तम्`). No space before a daṇḍa.
- The speaker line (`श्रीशुक उवाच`) is the first line of the verse it introduces, as in
  `bhagavadgita/`.
- The colophon is an unnumbered final unit; a footnote numeral printed inside it is dropped.
- Verse count is the print's. Where a longer passage runs across verses (8.4.17–24 is one
  sentence), each verse's meaning says so rather than being forced to stand alone.

## Related files

- `vishnu/narayaniyam/026_dasakam_26_gajendra_moksha.txt` retells 8.2–8.4 in Bhaṭṭatiri's own
  verse. It is a different work, not a witness to this text.
- About fifteen stutis from the Bhāgavata already stand in the corpus as separate files
  (`krishna/12_gopi_gitam.txt`, `krishna/09_mucukunda_stuti.txt`, `krishna/15_…`, `krishna/27_…`
  and others). When their adhyāyas are reached here, write the adhyāya in full as its own file
  and cross-reference both ways; never edit the older file.

## Still open

- The rest of the Purāṇa. Code 27 (Skandhas 9–12) has not yet been downloaded or checked for a
  text layer.
- 8.4.25: three witnesses, three readings of the Lord's promise (विमलां मतिम् / vipulāṁ gatim /
  विपुलां मतिम्). The print is followed; put it to the user if the recited form matters.

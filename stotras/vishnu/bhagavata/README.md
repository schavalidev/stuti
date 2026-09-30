# Śrīmad Bhāgavata — folder notes

The Sanskrit text of the Śrīmad Bhāgavata Mahāpurāṇa, **one file per adhyāya**, named
`SSAA_<name>.txt` — two digits of skandha and two of adhyāya, as one number — so that the whole
Purāṇa sorts in order. It must be one number: the corpus build takes a text's identity from its
folder and its *leading number* (`vishnu/bhagavata/0803`), and `08_03_…` would give every adhyāya
of Skandha 8 the same identity.
Begun 1 Oct 2026 (session S60) with the Gajendra Mokṣa, Skandha 8, adhyāyas 2–4, 92 verses; the whole text followed the same day.

This is apparatus, not reader-facing text. Nothing here belongs in a file's `Title`, `Author`
or `Blurb`.

**The whole Purāṇa is laid down (1 Oct 2026): all 12 skandhas, 335 adhyāyas, 14,099 verses.**
Three files carry full English, Telugu and Hindi meanings — the Gajendra Mokṣa, `0802`–`0804`.
The other 332 are **text only**: Devanāgarī and IAST, with the meanings to follow in a later pass,
at the user's instruction ("do the whole text first"). Their `Recension note` says so. Each
records its GRETIL comparison by machine — how many verses agree letter for letter, which differ,
where GRETIL numbers differently or has nothing — and the edition's own footnoted older readings,
none of it yet adjudicated. That adjudication, bracketing the footnoted readings into the line,
and closing the spaces justification left inside words are the work of the meanings pass.

Titles come from the edition's Hindi subtitle of each adhyāya, translated; the Devanāgarī header
takes its ordinal from the adhyāya's own colophon (विंशो in most skandhas, विंशतितमो in 8.20 and
10.20; पञ्चाशो and पञ्चाशत्तमो likewise).

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
- `gretil_bhp.py` — GRETIL's Bhāgavata as {(skandha, adhyāya, verse): text}, every verse labelled.
- `build_text.py` — writes the text-only files for every adhyāya (see its docstring).
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

## Traps met in the whole-text pass (all handled in the tools)

- **Prose (Skandha 5, parts of 10.87 and elsewhere)** runs several numbered units on one line
  (`माविश्चकार॥ २॥ अथ ह …`); `gpparse.MID` splits them. GRETIL's prose is bare text, not `<l>`
  elements; `gretil_bhp.py` reads both.
- **Chapter openings.** The Hindi subtitle can wrap to two lines and must be told from verse by
  its width (it crosses the column gap); a heading like मङ्गलाचरण is set larger, and the first line
  of 1.1.1 was once swallowed as a subtitle. Skandha end-marks and invocations are kept aside.
- **Section titles inside an adhyāya** (वेणुगीत, महारास, वेदस्तुति) sit over the column gap; they
  are detected per line, never per span, because in justified prose a single word can start that
  far right.
- **Footnote numerals** come at 11.7, 12.2 and 14pt, sometimes at the text's own size, and
  sometimes inside a speaker line or a colophon (युधिष्ठिर३उवाच). A bare number closes a verse only
  if it is the next number expected (6.4.46 has no daṇḍas: `सुराः४६`).
- **Quotations in the Hindi notes** are set in the Sanskrit face (“रसो वै सः”); a line opening
  with “ never enters the text.
- **One-off glyph faults of the print**, each handled once: `NUÊ` = ह्य at 5.3.10, a doubled ā at
  11.11.40, a doubled virāma at 11.30, a stray anusvāra after a numeral at 6.1.7, a lone nukta at
  10.1.64.
- **Do not close spaces against GRETIL.** It was tried: GRETIL's verse text often runs words
  together, so the test joined real word boundaries (सकृद् यद्) as often as real gaps.

## Still open

- The meanings, adhyāya by adhyāya, with the recension notes written up by hand as in `0802`–`0804`.
- The two māhātmyas the volumes print with the text: the Padma Purāṇa's (6 adhyāyas, code 26
  pp. 2–80) and the Skanda Purāṇa's (4 adhyāyas, code 27 at the end). They parse cleanly
  (`skandha: None`) and are not yet written.
- 8.4.25 is settled: the user kept विमलां मतिम् on 1 Oct 2026.

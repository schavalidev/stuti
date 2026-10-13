# `stotras/ashtavakragita/` — the Aṣṭāvakra Gītā

Twenty-one files, **304 verses**, written 2026-10-13. A dialogue between the sage Aṣṭāvakra
and Rājarṣi Janaka, counted as a brahmavidyā-grantha rather than as part of any epic or
Purāṇa. It belongs to no deity, and so sits at the top level and goes to the app's `itara`
shelf rather than under one of the deity folders.

**It is not the Aṣṭāvakra Gītā of the Mahābhārata.** The base text's own preface says so in as
many words: the Aṣṭāvakra passage found in the Vanaparva is a different thing, and this is an
independent work. Nothing here was collated against the epic.

## The witnesses, and why there are only three

1. **Gītā Press, Gorakhpur, *Gītā-Saṅgraha*** — a volume collecting 25 Gītās, Sanskrit with a
   Hindi anuvāda, where this work occupies pp. 472–536. This is the authority, and it is the
   only one of the three that carries all twenty-one prakaraṇas. Read from the Devanāgarī OCR
   of archive.org item `gita-sangraha-gitapress`, which is clean of Latin noise but drops
   mātrās and reads the avagraha as `5` or `<`; and, for the twenty-first prakaraṇa, from the
   page images of leaves 535–536 directly.
2. **The Aṣṭāvakra-Gītā with the bhāṣā-ṭīkā of Rāybahādur Bābū Jālimsiṁh**, Tejkumār Press,
   Lucknow, fifth printing 1971 (archive.org `ashtavakra-gita-sanskrit-with-hindi-commentary`).
   A genuinely separate print lineage, printing mūla, padaccheda, anvaya, śabdārtha and ṭīkā.
   Its scan yielded a reading for **243 of the 304** verses; the rest were lost to OCR.
3. **The John Richards e-text**, which GRETIL carries as `sa_aSTAvakragItA.xml` in IAST and
   sa.wikisource carries at page id 1446 in Devanāgarī. These two are **one witness in two
   scripts, not two witnesses**, and the file headers say so in those words.

**There is no critical edition of this work**, and the question was asked rather than skipped:
`bin/gretil.py search astavakra` returns exactly one file, the e-text above, and GRETIL's index
holds nothing else for it.

A fourth candidate was measured and rejected: *Ashtavakra of Ashtavakra Muni with Tika by
Mahatma Vishveshvar*, Naval Kishor Press 1896 (archive.org
`XMMB_ashtavakra-of-ashtavakra-muni-with-tika-by-mahatma-vishveshvar-1896-naval-kishor-press`).
Its OCR holds 89,821 Devanāgarī characters against **24,358 characters of Latin noise**, and its
opening pages decode to nothing at all. It is a real edition and an unusable scan, and it was
not used.

## Two things this collation found

**The twenty-first prakaraṇa.** Gītā Press prints a chapter the other two witnesses do not: the
Saṅkhyākramavijñāna, six verses listing the name of every prakaraṇa and the number of verses it
holds. This is why the work is normally said to have 298 verses in twenty chapters, and why it
stands here at 304 in twenty-one.

**The sixteenth prakaraṇa, where the volume contradicts itself.** That index chapter says ten
verses for the sixteenth; the body of the same volume prints eleven, and so do both other
witnesses. The total the index announces, 303, is accordingly one short of the 304 the volume
actually sets. The index also names the chapter jñānopadeśa where the chapter's own colophon
calls it viśeṣopadeśa; the colophon is what the titles here follow.

## Conventions particular to this folder

- **Speaker lines are not supplied.** Gītā Press prints `जनक उवाच` and `अष्टावक्र उवाच` in the
  first prakaraṇa only. Everywhere else the speaker is known from the colophon, and no उवाच
  line has been added to the text. Who speaks is recorded in each file's `Author` field.
- **Where the colophon and the e-text disagree about who speaks, the colophon wins.** This
  happens at prakaraṇas 4 and 6, which the colophons call śiṣyaprokta and śiṣyokta — Janaka —
  and which GRETIL marks `aṣṭāvakra uvāca`.
- **Devanāgarī follows the prints' sandhi.** The digital lineage breaks it at word boundaries
  (`मुक्तिं इच्छसि`, `प्राप्तं एतद्`, `बोधोऽहं इति`) where both prints run the words together.
  That is a presentational choice of the e-text, not a variant reading.
- **Where the witnesses disagree substantively, Gītā Press is followed and the rejected reading
  is written into the file's `Recension note` rather than discarded.** Where metre settles the
  matter it is allowed to override the count of witnesses, in both directions — see 18.24 and
  18.62, which go opposite ways for the same reason.

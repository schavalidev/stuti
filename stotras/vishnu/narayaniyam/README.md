# Nārāyaṇīyam — folder notes

Melputtūr Nārāyaṇa Bhaṭṭatiri's Nārāyaṇīyam, composed before the image of Kṛṣṇa at Guruvāyūr
in 1587: **100 daśakas, 1032 ślokas**, one file per daśaka, `001_…` to `100_…`. The work
condenses the twelve books of the Bhāgavata Purāṇa and is divided, as the Bhāgavata is, into
twelve *skandha-paricchedas*; the daśaka numbering runs straight through all twelve.

This is apparatus, not reader-facing text. Nothing here belongs in a file's `Title`, `Author`
or `Blurb`.

## The witnesses, and what each is worth

1. **Gītā Press, Gorakhpur — Śrīnārāyaṇīyam, code 639** (Sanskrit with *saral bhāvārtha* in
   Hindi). archive.org item `0639_20230109`. **This is the authority and the base text.**
   - The PDF is a **photographed book with no embedded text layer** (`Creator: Genius Scan`).
     There is no Chanakya-style legacy encoding to decode here, as there was for the Gītā Press
     Sundarakāṇḍa — the only route to the text is the page image.
   - `0639_djvu.txt` (archive.org's own OCR) is good enough to *locate* a verse and not good
     enough to *copy* one. Measured on daśaka 1: it dropped one line of ten verses outright and
     misread व as ब, ृ as ू and क्ष as र in eight places. **Read every line off the page image
     before writing it.**
   - Page arithmetic: the offset between printed page and scan page **is not constant** — the
     volume carries full-page colour plates that are not paginated, and each one shifts it.
     Printed 9 = scan 6 and printed 13 = scan 10 (offset +3); four plates then fall at scan
     14–17, and printed 17 = scan 18 (offset +1). Do not compute a page: find it. The reliable
     way is to search `0639_djvu.xml` for the verse, which gives the scan page directly, and the
     daśaka colophons (`… दशकं समाप्तम्`) are findable the same way — OCR recovers 89 of the 100.
2. **GRETIL, `sa_nArAyaNabhaTTa-nArAyaNIya.xml`** — IAST, 1032 verses, `Nar_<skandha>.<daśaka>.
   <verse>`. A genuinely independent editorial lineage and the second witness for every file.
   Its data entry is careless (`mirmalaṁ` for `nirmalaṁ`, `cidjarbha` for `cidgarbha`,
   `vaikuṇṭḥa`), so it is a check on the Gītā Press reading, never a substitute for it. Read the
   TEI XML, never the plaintext export — `stotras/bin/gretil.py` is the way in.
3. **No critical edition exists.** The question was asked and answered: GRETIL's file is an
   e-text, not an edition, and nothing critical was found elsewhere. Say so in
   `Source / recension`, in those words.
4. **Two commentarial editions, held in reserve.** T. Gaṇapati Śāstrī's *Bhaktapriyā*
   (Trivandrum Sanskrit Series 18, 1912, item `TSS018NarayaniyamWithBhaktapriyaCommentaryTG
   Sastri1912_201809`) and Konāth Kṛṣṇa Wārrier's *Bālabodhinī* (1957, item
   `narayaniyam-with-balabodhini-of-konath-krishna-warrier-1957`). Both are real independent
   witnesses and both have OCR too damaged to collate from — the commentary swamps the verse and
   the readings come back as `आरमकं`, `असकम्`. Use them by page image when a reading is genuinely
   contested; do not cite them as collated unless they were actually read.

## The method, so it is not re-derived

The alignment between the two witnesses is done by machine, not by eye and not by verse number:
each GRETIL line is transliterated to a consonant skeleton and matched against the Gītā Press
OCR lines with a monotonic best-match sweep. That locates every verse on a printed page and, at
the same time, flags the lines the OCR dropped or mangled — **200 of 3339 lines across the whole
work**, which are exactly the places the page image has to settle. The daśakas carrying the most
such gaps, and therefore needing the most image reading, are 22, 26, 27, 54, 61, 63 and 45.

IAST is generated mechanically from the Devanāgarī with `stotras/bin/dev2iast.py`, never copied
from GRETIL.

## Recension decisions already taken

- **सहस्र, not सहस्त्र.** The Gītā Press page prints निगमशतसहस्त्रेण at 1.1; सहस्त्र is a North
  Indian press spelling of सहस्र, the metre is indifferent, and GRETIL reads sahasreṇa. The files
  print सहस्र and record the press's spelling. Expect this spelling to recur.
- **चिद्गर्भ at 1.3**, against GRETIL's non-word `cidjarbha`.

## Status

| | |
|---|---|
| Written | daśakas 1–2 |
| Remaining | daśakas 3–100 |

## Open questions for the user

- **Pārāyaṇa apparatus.** Gītā Press 639 prints **no** pārāyaṇa-vidhi — it goes from the table of
  contents straight to the first śloka, unlike the Sundarakāṇḍa volume, which prints four pages
  of one. The customary schedules for reciting the Nārāyaṇīyam (a daśaka a day for a hundred
  days; the whole in a single day; the twelve skandha-paricchedas over twelve days) are living
  practice and not printed in this volume. Nothing of the kind has been written into this folder,
  because inventing a rite and presenting it as a printed one is exactly what this corpus does
  not do. If a reading schedule is wanted in the app, it needs either a printed source or a
  decision from the user that it is to be given as practice rather than as text.

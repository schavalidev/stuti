# Vālmīki Sundarakāṇḍa — collation pipeline

The scripts that built `rama/valmiki_sundarakanda/`. They are kept so a later session does not
have to rebuild the three-witness collation from scratch.

They expect two fetched trees beside them in a working directory:

- `sn/<n>.html` — the base text, one page per sarga, from
  `https://stotranidhi.com/hi/sundarakanda-sarga-chapter-<n>-in-sanskrit/` (fetch with a browser
  User-Agent; a bare curl is refused).
- `vr/<n>.htm` — the Southern witness, from
  `https://sanskritdocuments.org/sites/valmikiramayan/sundara/sarga<n>/sundarasans<n>.htm`.

and one downloaded file, `gp2_djvu.txt`, the Gītā Press OCR — the `*_djvu.txt` of archive.org item
`WTRU_srimad-valmiki-ramayana-of-maharshi-valmiki-with-hindi-trans.-part-2-sundara-khn`, fetched
through the `server` and `dir` fields of `https://archive.org/metadata/<id>` rather than the plain
`/download/` path, which 404s on these filenames. The Sundarakāṇḍa occupies lines 1340 to 22740 of
that file; the Yuddhakāṇḍa follows.

| script | what it does |
| --- | --- |
| `parse_sn.py` | pulls the verse body out of a stotranidhi page |
| `parse_vr.py` | pulls the Devanāgarī out of a valmikiramayan page, dropping the English gloss |
| `verses.py` | re-segments a sarga into verse units by the printed numeral |
| `collate2.py` | the normalising functions — strips accents, numerals, daṇḍas, and folds anusvāra against the conjunct nasals so that `संकाश` and `सङ्काश` compare equal |
| `gplines.py` | pulls the Sanskrit lines out of the Gītā Press OCR, skipping the Hindi translation blocks that follow each verse |
| `monoalign.py` | aligns the base text's half-lines against that Gītā Press line list, in order |
| `adjud.py` | separates a real difference of reading from OCR damage, by folding the letters the scan confuses |
| `build.py` | runs all 68 sargas and writes `collation_cache.json` |
| `skel.py` | writes a file skeleton with `deva` and `iast` filled and the three translation fields blank |
| `assemble.py` | fills the skeleton from a translations module and writes the finished file |
| `brackets.py` | works out which word each of the base text's own bracketed variants replaces, by testing the substitution against both independent witnesses |

`collation_cache.json` holds the finished result for all 68 sargas: each sarga's title, its verse
units, and for every half-line the matched Gītā Press and Southern readings with the word-level
differences already classified. **Read it before re-fetching anything.**

Counts it records: **2,824 verse units** across the kāṇḍa by the base text's division.

## A fourth witness, added 2026-09-13

This pipeline collates three witnesses. Since 2026-09-13 the corpus also treats the **Baroda critical edition**
as a standing witness for Rāmāyaṇa work (user: "lets use it going fwd"). It is not wired into these scripts,
which were built and run before it was found. Reach it with `stotras/bin/gretil.py`.

If you extend this pipeline to another kāṇḍa, add it as a fourth column. Two cautions: read the TEI XML and not
GRETIL's plain-text export, which drops the first half-line of every verse; and match by opening line, not by
sarga number, because the critical edition divides the kāṇḍas differently.

# Vālmīki Rāmāyaṇa — the remaining six kāṇḍas

Built 2026-09-14, after the Sundarakāṇḍa. It differs from `../valmiki_sundarakanda/`
in one decision: **Gītā Press is the base text here, not stotranidhi** (user, 2026-09-14).
The base therefore stops being the weakest witness.

## The volumes are on disk now

`../cache/gitapress_ramayana/gp1_djvu.txt` and `gp2_djvu.txt` — the Gītā Press, Gorakhpur
text layers, ~8 MB each, 80.7% and 80.8% Devanāgarī.

- `gp1` = Vol. 1 (Sachitra), **Bāla → Kiṣkindhā**
  — archive.org `fRjq_srimad-valmiki-ramayana-of-maharshi-valmiki-sachitra-hindi-trans.-vol.-1-bala-kh`
- `gp2` = Part 2, **Sundara → Uttara** — archive.org
  `WTRU_srimad-valmiki-ramayana-of-maharshi-valmiki-with-hindi-trans.-part-2-sundara-khn`

They are **kept**, not fetched into a working directory and dropped. The Sundarakāṇḍa run read
this same edition and retained only its conclusions, so nothing it claimed can now be re-checked.

## Witnesses, verified 2026-09-14

| kāṇḍa | Gītā Press (base) | valmikiramayan.net | Baroda critical |
| --- | --- | --- | --- |
| Bāla, Ayodhyā, Araṇya, Kiṣkindhā, Yuddha | yes | yes | yes |
| **Uttara** | yes | **no — the site has no Uttarakāṇḍa** | yes |

So the Uttarakāṇḍa is written against two witnesses, not three. Say so in its `Source / recension`.

**The Southern witness paths are not guessable.** The directories are `baala`, `ayodhya`, `aranya`,
`kish`, `yuddha`; the files are `<kāṇḍa>sans<n>.htm` under `sarga<n>/`, and `kish` takes
`kishkindhasans<n>.htm`. Guessing `bala/` or `kishkindha/` returns 404 on a site that *does*
carry the text — the same shape of mistake that left the critical edition unused across 68 files.
Read `vr_index.htm` and the per-kāṇḍa `_contents.htm`, do not invent paths.

## What `gpbase.py` does

`kanda('bala')` returns `[(sarga_no, [(verse_no, [lines]), ...]), ...]`, Hindi translation removed.

Four pieces of OCR damage it has to survive, all real and all found in Vol. 1:

1. **The Hindi block after every verse.** Skipped by the numeral-repeat rule carried over from
   `../valmiki_sundarakanda/gplines.py`.
2. **Never filter a line for "looking Hindi".** Sanskrit lines contain `को`, `च`, `से`. An early
   version of this parser dropped Bāla 1.2 and 1.3 outright for containing `को`.
3. **The closing daṇḍa reads as a digit** — `॥ ९३॥` becomes `९३३`. `repair()` fixes this by
   enforcing the monotone run, not by trusting any single numeral.
4. **The colophon is followed by its own number**, which otherwise lands as a bogus final verse,
   and **~18% of colophons are OCR-destroyed** (70 of 77 survive in the Bālakāṇḍa), so colophons
   alone cannot segment. `sargas()` splits on colophons and recovers the destroyed ones from
   verse-number resets.

## State

Bālakāṇḍa segments to **77 sargas, 2,260 verse units**, which is the vulgate's sarga count.
Numbering is not yet clean throughout: some sargas hold fewer units than their last numeral,
meaning the OCR lost a numeral and two verses merged. Those are for the other two witnesses to
split — that is what the collation is for. **Do not paper over a gap by renumbering.**

## Collation state, 2026-09-14 (Bālakāṇḍa)

`collate.py` runs the three witnesses together. Current numbers:

| measure | value |
| --- | --- |
| GP sargas segmented | **76** |
| GP verse units | **2,223** |
| GP sargas mapped onto a critical sarga | 69 / 76 |
| units matched to the Southern witness | 1,787 (80%) |
| units matched to the critical edition | 1,385 (62%) |

The Southern and critical match rates are not defects on their own — the critical edition
excises much the living recension carries, and the Southern recension genuinely differs.

### The one thing that must be settled before any file is written

**The Bālakāṇḍa has 77 sargas; this segmentation yields 76.** One colophon was destroyed by OCR
and two sargas are still merged. Six Southern sargas (3, 4, 20, 37, 61, 75) fail to match a GP
group confidently, though most of those are the Southern text's word-separated orthography
depressing the similarity score rather than a real absence.

Do not author against a 76-sarga division. The fix is to invert the segmentation: **the Southern
witness supplies one page per sarga**, 77 clean pages, so its boundaries should define the sarga
division while Gītā Press remains the base text for the readings themselves. That keeps the user's
decision (GP is base) while taking the sarga division from the witness that states it unambiguously.

### Three lessons already paid for in this build

- **Never filter a Sanskrit line for "looking Hindi"** — `को`, `च`, `से` are Sanskrit too. An early
  filter silently deleted Bāla 1.2 and 1.3.
- **Sanskrit verse lines always carry a daṇḍa**; Hindi headings and colophons do not. That single
  test removed the heading and colophon leakage that had shifted every sarga by one.
- **Match by opening line, never by number.** Keying critical sargas by number gave 206 matches;
  keying them by opening line gave 1,385 from the same data.

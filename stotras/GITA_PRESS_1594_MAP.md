# Gītā Press *Sahasranāma Stotra Saṅgraha* (code 1594) — volume map

Local scan: `~/Downloads/401517788-Sahasranama-Stotra-Sangraha-Gita-Press-pdf.pdf`
(815 PDF pages, **image-only — no text layer**; render with
`pdftoppm -png -r 200 -f N -l M`, then read the page image).

**Page offsets** (printed → PDF), which drift because colour plates are bound in:
front matter −1 · main body +15 · from roughly printed 400 onward **+23**.
Always verify an offset by probing one page before trusting it.

## Contents — 22 sahasranāmas

| # | Text | Stotram | Nāmāvalī | Corpus file |
|---|---|---|---|---|
| 1 | Gakārādi Gaṇapati | 1 | 19 | ✅ `ganesha/31_…` |
| 2 | Viṣṇu | 38 | 52 | ✅ `vishnu/25_…` |
| 3 | Śiva | 70 | 86 | ✅ `shiva/29_…` |
| 4 | Dakārādi Durgā | **103** | 124 | ✅ *in progress* |
| 5 | Sūrya | 143 | **156** | ✅ *in progress* |
| 6 | Rāma | 174 | 187 | ✅ `rama/28_…` |
| 7 | Kṛṣṇa | 206 | 226 | ✅ `krishna/31_…` |
| 8 | Lakṣmīnṛsiṁha | 245 | 267 | ✅ `narasimha/22_…` |
| 9 | Gopāla | 285 | 304 | ✅ `krishna/32_…` |
| 10 | Rādhākṛṣṇa | 322 | 340 | ✅ `krishna/33_…` |
| 11 | Hanumat | 358 | 371 | ✅ `hanuman/33_…` |
| 12 | Gāyatrī | 389 | 404 | ✅ `devi/gayatri/16_…` |
| 13 | Gaṅgā | 422 | 442 | ✅ `ganga/16_…` |
| 14 | Yamunā | 460 | 474 | ✅ `devi/nadi/05_…` |
| 15 | Lakṣmī | 492 | 506 | *in progress* |
| 16 | Annapūrṇā | 525 | 542 | ✅ `devi/annapurna/08_…` |
| 17 | Sītā | 560 | 575 | ✅ `rama/29_…` |
| 18 | Rādhikā | 593 | 613 | ✅ `krishna/34_…` |
| 19 | Lalitā | 632 | 652 | ✅ `devi/lalita/36_…` |
| 20 | Bhavānī | 672 | 690 | ✅ `devi/main/42_…` |
| 21 | Dattātreya | 708 | 723 | ✅ `dattatreya/22_…` |
| 22 | Vakratuṇḍa Mahāgaṇapati | 741 | 762 | ✅ `ganesha/29_…` |

## Contents — 6 śatanāmas

Gaṇapati 780 · Sūrya 782 · Viṣṇu 784 · Śiva 786 · Durgā 788 · Kṛṣṇa 790.

## Notes

- **Every text is printed twice** — once as the verse stotram, once as a dative
  nāmāvalī. These are two independent typesettings of the same name-list, so
  collating one against the other inside the volume catches transcription slips
  on both sides. This is the check that caught the Śiva and Lalitā defects, and
  it is available for every text here.
- **#15 Lakṣmī is the Brahma Purāṇa recension**, not the Skanda Purāṇa one
  (colophon: `इति ब्रह्मपुराणे श्रीलक्ष्मीसहस्रनामस्तोत्रं सम्पूर्णम्`), 145
  verses, incipit `श्रीः पद्मा प्रकृतिः सत्त्वा शान्ता चिच्छक्तिरव्यया`. The
  digital corpora (sanskritdocuments ×3, stotranidhi, drikpanchang) all carry the
  **Skanda / Sanatkumāra Saṁhitā** text instead — 154 verses, incipit
  `नित्यागतानन्तनित्या नन्दिनी जनरञ्जनी`. The two are distinct works sharing
  some vocabulary. See `SAHASRANAMA_TRACKING.md`, whose Lakṣmī ✅ Skanda entry and
  separate "Mahālakṣmī ⚠ Brahma Purāṇa, unverified" entry both need revising:
  GP confirms the Brahma Purāṇa attribution.
- GRETIL's Brahmapurāṇa (Tübingen text, adhyāyas 1–246) does **not** contain this
  sahasranāma — checked by normalised search. The colophon points to material
  outside that recension.

- **Correction (2026-09-09):** the Dakārādi Durgā stotram begins at printed **103**, not 123 as first read off the contents page — 123 is where it *ends*. Verified by probing the page itself. Its colophon is `इति कुलार्णवतन्त्रोक्तं दकारादि श्रीदुर्गासहस्रनामस्तोत्रं सम्पूर्णम्` (Kulārṇava Tantra), 231 verses. Treat every page number in the contents table as a hypothesis until the page is probed. The **Sūrya nāmāvalī** likewise begins at printed **156**, not 158 — two of the first two texts checked had a wrong contents entry, so this is the norm, not the exception.

## Reading this volume's typeface — learned the hard way, 2026-09-09

**At 200 dpi the `प्त` ligature in this typeface is very close to `स`.** Transcribing the
Dakārādi Durgā produced गुसि, मोक्षार्थि and प्रास where the page actually prints
**गुप्ति, मोक्षाप्ति, प्राप्त**. The error was ours, not the edition's — every one was
confirmed against the page re-rendered at 400 dpi. Other confusions seen in the same
text: `द्भ`→`द्ध`, `व`→`त्र`.

Further confusions found while transcribing the Sūrya text, all caught by zooming:
**`य` reads as `द`** at small size (`स्थितिस्थेयाय` first read as `-यად`, `मेरुमेयाय` as `मेरुमेदाय`);
**`ण` reads as `ग`** (`घृणये` first read as `घगये`); and **`भ` and `घ` are near-identical**.

**Rule for the remaining texts:** if a reading yields a non-word, re-render that line at
400 dpi before recording it — and treat a word-internal `स` as a candidate `प्त`. The
volume's own nāmāvalī is the cheapest detector: an index entry with no counterpart in
the stotram usually means the stotram was misread, not that the index is wrong.

## Name counts are not uniform across this volume

Do not assume 1000. Verified so far:
- **Dakārādi Durgā — 1000 printed, 989 real.** Entries 990–1000 are eleven repetitions of
  `दुर्गादेवी`, and a footnote on the last index page says why: the list fell eleven short,
  so the name was repeated to make the number up.
- **Sūrya — 1008, genuinely.** The index runs contiguously to 1008 with no padding block and
  no footnote; the last eight are distinct names answering to the stotra's closing verses.
  This is the traditional *sāṣṭasahasra* ("a thousand and eight") count.
- **Lakṣmī (Brahma Purāṇa) — 1020**, ending at the last name of v125.
Report what the index yields, per the verse-count rule.

## Verified PDF page ranges (2026-09-10) — detected from page images, not the contents table

Title pages located by their top whitespace, then confirmed visually on a contact sheet.
`stotram` and `nāmāvalī` give PDF pages (image-file numbers), inclusive.

| # | Text | stotram PDF | nāmāvalī PDF |
|---|---|---|---|
| 6 | Rāma | 189–201 | 202–220 |
| 7 | Kṛṣṇa | 221–240 | 241–259 |
| 8 | Lakṣmīnṛsiṁha | 260–281 | 282–299 |
| 9 | Gopāla | 300–318 | 319–336 |
| 10 | Rādhākṛṣṇa | 337–354 | 355–372 |
| 11 | Hanumat | 373–385 | 386–411 (colour plates bound in here — offset jumps +15→+23) |
| 12 | Gāyatrī | 412–426 | 427–444 |
| 13 | Gaṅgā | 445–464 | 465–482 |
| 14 | Yamunā | 483–496 | 497–514 |
| 16 | Annapūrṇā | 548–564 | 565–582 |
| 17 | Sītā | 583–597 | 598–615 |
| 18 | Rādhikā | 616–635 | 636–654 |
| 20 | Bhavānī | 695–712 | 713–730 |
| 21 | Dattātreya | 731–745 | 746–763 |

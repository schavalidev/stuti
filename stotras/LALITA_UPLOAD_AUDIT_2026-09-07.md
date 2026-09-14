# Audit — uploaded Śrī Lalitā Sahasranāma Stotram files (2026-09-07)

Six files supplied; **three distinct texts**, each uploaded twice byte-identically
(`-dbe912c3`, `-d10adba5`, `-19565c85` duplicates removed from consideration).

| Script | File | Size |
|---|---|---:|
| Devanāgarī | `sri_lalitha_sahasranama_stotram_devanagari.md` | 84,885 b |
| IAST | `sri_lalitha_sahasranama_stotram_english_iast.md` | 43,614 b |
| Telugu | `sri_lalitha_sahasranama_stotram_telugu.md` | 83,402 b |

Source: stotranidhi.com (native-script, IAST and Telugu pages respectively), with
pūrva/uttarapīṭhikā pulled from the dedicated sub-pages. Independent comparison text for this
audit: sanskritdocuments.org `/doc_devii/lalitacomplete.html`.

## Verdict

**Sound, and better prepared than most devotional uploads.** Structure, numbering and
cross-script agreement are all clean. Five concrete defects are listed below; four are trivial
to fix, one is an editorial judgement call.

## What checks out

- **Structure identical across all three scripts:** Katha · Purva Peethika · Dhyanam · Nyasam
  (Viniyōga + Pañcapūjā) · Sahasranama Stotram · Uttara Peethika (Phalashruti).
- **Verse numbering complete and gap-free in all three:** Pūrvapīṭhikā 1–50, Stotram 1–183,
  Uttarapīṭhikā 1–87. No gaps, no duplicates, all three scripts agreeing exactly.
- **Devanāgarī ↔ IAST are the same text**, modulo the single omission in §1 below — one
  difference block across 665 lines.
- **Each script uses its own numerals consistently** (Devanāgarī 697, Telugu 697, IAST Latin).
- **Pañcapūjā is present** — the laṁ/haṁ/yaṁ/raṁ/vaṁ/saṁ bhūta-tattva offerings, in all three.
- **Honest editorial restraint.** The Nyāsam section states plainly that the source does not
  print separate karanyāsa/aṅganyāsa chant lines and that *no unprovided mantra text has been
  interpolated*. That is the correct call, and correctly disclosed.
- **Content agrees with sanskritdocuments**: both editions carry 367 stotra lines, differing
  only in the 24 variant readings catalogued in §5 — no omissions, no additions.

## Defects

### 1. IAST is missing the Pūrvapīṭhikā colophon  *(real omission)*
Devanāgarī and Telugu both close the Pūrvapīṭhikā with

> `इति श्रीब्रह्माण्डपुराणे हयग्रीवागस्त्यसंवादे ललितासहस्रनामपूर्वभागो नाम प्रथमोऽध्यायः ॥`

The IAST file has no counterpart. This is the *only* structural divergence between Devanāgarī
and IAST, and it is why IAST runs 664 lines against 665.

### 2. Zero-width joiners leaked into the IAST as literal hyphens  *(5 instances)*
The Devanāgarī uses U+200D ZWJ as a display hint to suppress conjunct ligatures. In the IAST
edition each became a **hyphen inside the word**:

| IAST line | Printed | Should be |
|---:|---|---|
| 23 | `paṭ-ṭābhiṣēcanam` | `paṭṭābhiṣēcanam` |
| 254 | `paṭ-ṭabandhavalitrayā` | `paṭṭabandhavalitrayā` |
| 505 | `tvak-sthā` | `tvaksthā` |
| 835 | `tat-kṣaṇāt` | `tatkṣaṇāt` |
| 841 | `tat-kṣaṇāt` | `tatkṣaṇāt` |

Almost certainly a by-product of the documented "ASCII pipes → Unicode daṇḍas" conversion pass.

### 3. Zero-width joiners remain in the native-script files  *(5 Devanāgarī, 3 Telugu)*
Invisible U+200D at `पट्‍टाभिषेचनम्`, `पट्‍टबन्ध`, `त्वक्‍स्था`, `तत्‍क्षणात्` ×2 (and the
Telugu equivalents). They render correctly but silently break exact-match search, deduplication
and diffing. Strip them, or normalise on ingest.

### 4. Telugu diverges from Devanāgarī on ḷa/la  *(26 blocks, 14 distinct forms)*
Telugu writes **ḷ (ళ)** where Devanāgarī writes **l (ल)**: `మౌళి`/`मौलि`, `కళా`/`कला`,
`కాళీ`/`काली`, `మాంగళ్య`/`माङ्गल्य`, `ప్రళయ`/`प्रलय`, `నళినీ`/`नलिनी`, `కళ్యాణీ`/`कल्याणी`,
and so on. **This is not an error** — it is standard Telugu Sanskrit orthography, and it is
*internally consistent*: no word appears both ways. But it does mean the three files are not
mechanically inter-transliterable, which matters if anything downstream assumes they are.
Worth stating in the editorial note.

### 5. Twenty-four variant readings against sanskritdocuments  *(expected, but one is substantive)*
Ordinary orthographic variants: `kluptaka`/`kḷptaka`, `cubuka`/`cibuka`, `makuṭa`/`mukuṭa`,
`śiñjāna`/`siñjāna`, `taṭillatā`/`taḍillatā`, `kalebarā`/`kalevarā`, `bṛnda`/`vṛnda`,
`kulāntaḥsthā`/`kulāntasthā`, `vimocanī`/`vimocinī`, `barbarālakā`/`bandhurālakā`.

**The one that matters is at ślokas 21–22**, where the two editions divide the names differently:

| | reading |
|---|---|
| stotranidhi | `śivā \| kāmeśvarāṅkasthā \| śiva-svādhīnavallabhā` |
| sanskritdocuments | `śiva-kāmeśvarāṅkasthā \| śivā \| svādhīnavallabhā` |

This is a known crux in the Lalitā Sahasranāma and it **changes where one name ends and the
next begins** — i.e. it shifts the name-split, not merely the spelling. Whichever is adopted,
the choice should be recorded explicitly rather than left implicit.

## Recommendations

1. Restore the Pūrvapīṭhikā colophon to the IAST file.
2. Repair the five hyphens in the IAST (defect 2).
3. Strip U+200D from all three (defect 3) — or normalise at ingest.
4. Note the Telugu ḷa/la convention in the editorial note so it is not mistaken for corruption.
5. Record the ślokas 21–22 name-split decision in the source note.
6. Consider adding the source's own caveat, which these files do not carry: sanskritdocuments
   observes that the sahasranāma and triśatī "are not readily available in the Brahmāṇḍapurāṇa
   book. It is possible that they belong to khilās (appendix) of the purāṇa added later." The
   Brahmāṇḍa attribution is worth qualifying rather than stating flat.

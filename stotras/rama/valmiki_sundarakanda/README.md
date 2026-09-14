# Vālmīki Rāmāyaṇa — Sundarakāṇḍa

The fifth kāṇḍa of the Sanskrit epic, sarga by sarga, one file per sarga, in the corpus's
five-field format.

## This is not the same work as `rama/sundarkand/`

`rama/sundarkand/` holds the **Sundarkāṇḍ of Tulsīdās's Rāmcaritmānas** — Awadhi verse, in
caupāī and dohā, from the Gītā Press edition. This folder holds **Vālmīki's Sanskrit
Sundarakāṇḍa**, in 68 sargas of anuṣṭubh. They tell the same story and are different works in
different languages by different poets. Neither supersedes the other, and neither is to be
collated against the other.

## Sourcing

Base text: the Devanāgarī of stotranidhi.com, which is well-formed and easy to parse and is
used here as a transcription base, never as an authority.

Two independent witnesses are collated against it, half-line by half-line, before a file is
written:

1. **Gītā Press, Gorakhpur — the authority for readings.** *Śrīmad Vālmīkīya Rāmāyaṇa*, Part 2
   (Sundarakāṇḍa to Uttarakāṇḍa), Sanskrit with Hindi translation, read through the scanned OCR
   at archive.org, item `WTRU_srimad-valmiki-ramayana-of-maharshi-valmiki-with-hindi-trans.-part-2-sundara-khn`.
   **The OCR of this volume is not clean.** It is good enough to adjudicate a word and not good
   enough to transcribe from, so a Gītā Press reading is recorded in the `Recension note` and is
   not printed into a verse line unless it can be read without doubt. A separate Gītā Press
   *Sundara Kāṇḍa Mūlamātram* (1975, archive.org item
   `gzjz_shrimad-valmikiya-ramayanasya-sundara-kandam-mula-matram-by-valmiki-sanskri`) exists as
   a page-image scan whose text layer is glyphless; its page images are legible and can be read
   directly where a reading has to be settled.
2. **valmikiramayan.net**, served at sanskritdocuments.org, which follows the **Southern**
   lineage. This is a genuinely separate editorial line from both of the above, not the same
   text in another script.

GRETIL's `sa_vAlmIki-rAmAyaNa-southern-2` was checked and does **not** contain the
Sundarakāṇḍa; its file carries the Ayodhyākāṇḍa only. valmiki.iitk.ac.in did not resolve.

## Accent

None. This is epic verse, not Vedic chant, and no witness marks svara. The rule about sūktas
carrying their accent does not apply here.

## Verse numbering

The base text's printed numerals are not always internally consistent, and the three witnesses
group the paired half-lines differently, so the three do not agree on how many units a sarga
contains. Units are therefore numbered sequentially by position within each file, and every file
says in its `Recension note` what each witness's own count was. A difference in count here is
almost never a difference in text.

## Status

68 sargas in the kāṇḍa. Files written so far are listed in `AUTHORING_QUEUE.md` under
"Vālmīki Sundarakāṇḍa"; the queue there carries one checkbox per sarga.

## Correction added 2026-09-13 — a fourth witness exists and was not used

This README says elsewhere that GRETIL does not carry this kāṇḍa. That is true of the GRETIL file that was checked,
`sa_vAlmIki-rAmAyaNa-southern-2`, which holds only the Ayodhyākāṇḍa. It is **not** true of GRETIL as a whole.

`gretil/corpustei/sa_rAmAyaNa.xml` — Muneo Tokunaga's entry of the **Baroda critical edition** — carries all seven
kāṇḍas, and has this one in the critical edition's own division of **66 sargas** against the vulgate's 68. It was found
on 2026-09-13 while sourcing the Yuddhakāṇḍa coronation sarga, `rama/31_rama_pattabhisheka_sargah.txt`.

**The 68 files in this folder were built from three witnesses and do not take account of it.** Nothing has been changed
on the strength of this find, and no file here has been edited. It is recorded because the critical edition is a genuinely
separate editorial lineage and, in the one sarga where it has been used, it twice supported the base text against both of
the other witnesses.

**Decided by the user, 2026-09-13: this kāṇḍa is not to be re-collated, and the critical edition is used from now on.**
The gap in these 68 files is known and accepted. Do not quietly close it, and do not describe these files as having been
checked against the critical edition, because they have not been. New Rāmāyaṇa files collate against it as a matter of
course — see the sourcing ladder in `CLAUDE.md` and the helper at `stotras/bin/gretil.py`. The first file written
under the new rule is `rama/31_rama_pattabhisheka_sargah.txt`.

**One trap, if anyone does that work.** GRETIL's plain-text transformation of this file silently drops the first half-line
of every verse. Use the TEI XML. A collation run against the .txt would look complete and would be wrong about half the text.

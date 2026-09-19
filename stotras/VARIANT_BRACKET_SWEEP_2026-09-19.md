# Near-duplicate sweep — the bracket-rule candidates

Run 2026-09-19 over 1,080 files (1,056 long enough to judge) by
`bin/variant_sweep.py`, which is rerunnable and reads only. Nothing was merged
and nothing should be until the user says so: a merge retires a file.

## What the sweep does

It takes each file's `deva:` text, folds away what recites identically —
anusvāra against the homorganic conjunct nasal (कन्दर्प → कंदर्प), avagraha,
daṇḍas, numbering, spacing — and then compares every pair that shares enough
five-word windows to be worth scoring.

Two classes of near-identical pair are excluded as deliberate: the Vedic and
Paurāṇika twins under `puja/pauranika/` against `puja/`, which exist apart so
that the uninitiated reader has a form to use, and everything else under
`puja/`, where the ṣoḍaśopacāra frame makes unrelated rites read as nine parts
in ten the same text. Without those exclusions the list is 176 pairs and says
nothing. With them it is seven.

## The seven

**One text under two titles — the strongest candidates.**

- `devi/durga/06_aparajita_stotram.txt` and `devi/durga/43_tantrokta_devi_suktam.txt`
  (0.93). The Aparājitā Stotra and the Tantrokta Devī Sūktam are the same
  Saptaśatī hymn; one is from vignanam, one from the Gītā Press page images.
  The differences are spacing and सन्धि (कृत्स्नमेतद् व्याप्य / कृत्स्नमेतद्व्याप्य),
  except that the Gītā Press file carries an extra closing verse and lacks the
  other's refrain-ending.
- `Subrahmanya/12_kartikeyashtakam.txt` and `Subrahmanya/33_shadanana_ashtakam.txt`
  (0.81). The same aṣṭaka, one from sanskritdocuments and one from stotranidhi.
  Every difference is compound spacing but one real word, गम्याय against गुह्याय.
- `Subrahmanya/20_prajnavivardhana_kartikeya_stotram.txt` and
  `…/53_prajnavivardhana_kartikeya_stotram_gitapress.txt` (0.79). The same
  stotra; the Gītā Press file adds the viniyoga and reads नामानि कीर्तयेत् for
  नामानुकीर्तनम्.

**Same text, one print carrying more.**

- `devi/durga/37_…ashtottarashatanama_stotram.txt` and
  `devi/durga/50_…_shatanama.txt` (0.95). Both Gītā Press, from two volumes.
  The second opens with the विद्युद्दाम dhyāna; otherwise they part over
  शतभिषा against शतभिषां and the closing formula.

**Not candidates, recorded so the next sweep does not re-raise them.**

- `devi/lakshmi/01_kanakadhara_stotram_shankara.txt` and `02_…_pathantaram.txt`
  (0.89) — the pāṭhāntara is the point of the second file.
- `devi/durga/27_aparadha_kshamapana_stotram.txt` and `44_kshama_prarthana.txt`
  (0.83) — two prayers of the same kind, not two prints of one.
- `devi/durga/14_tantrokta_ratri_suktam.txt` and `devi/kalika/01_mahakali_stotram.txt`
  (0.82) — the Kālī stotra prefixes its own dhyāna to the shared body and
  belongs to its deity's folder.

## The candidate the memory named turns out not to be one

`rama/19_tulasidasa_krta_rama_stuti.txt` against `rama/27_rama_stuti_gitapress.txt`
was recorded as a merge candidate differing in four words of anusvāra spelling.
It is neither. The Gītā Press file is half as long again — 129 words against 70,
carrying the Mānas passage मनु जाहिं राचेउ and the closing jaya — and the
differences that do overlap are the regular tatsama-tadbhava correspondence,
छवि against छबि, विभूषणं against बिभूषणं, नील नीरज against नवनील नीरद. That is
exactly the correspondence that keeps the two Hanumān Cālīsā files apart, so
these two stay apart for the same reason.

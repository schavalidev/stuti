# `stotras/puja/` — pūjā-vidhāna (orders of daily and deity worship)

**Pūjā-vidhāna divides by *paddhati*, and this folder is split by paddhati on purpose.** The
division is the same kind of thing as the śākhā division in `../vidhi/`: these are the
observances of different communities, not variant readings of one text, and the two sides must
never be merged, harmonised, or presented as variants of each other.

Started 2026-09-12. The folder now holds the **spine** (the shared apparatus, `smarta/01`–`03`
and `vaishnava/01`) **and the first tranche of rites built on it** — ten deity nitya-pūjās, one
vrata and eight second-recension deity pūjās, `smarta/04`–`22`. 1,098 units across 23 files.

## Why a paddhati split, demonstrated rather than asserted

The smārta and Vaiṣṇava pūrvāṅgas were transcribed from the same site on the same day and they
are not the same rite:

| | smārta | Vaiṣṇava |
|---|---|---|
| remover of obstacles | Mahāgaṇapati | **Viṣvaksena** |
| ācamana opens | Keśava (24 names) | **Acyuta–Ananta–Govinda** (12 names) |
| āsana | none | **four syllables** — अं अनन्तासनाय, रं कूर्मासनाय, विं विमलासनाय, पं पद्मासनाय |
| pavitra-dhāraṇa | absent | **present** (`इदं ब्रह्म पुनीमहे`) |
| saṅkalpa locates you at | Śrīśaila | **Śrīraṅga** |
| viniyoga before each mantra | none | **one for every mantra** |

A user who follows one of these should not be handed the other.

## `smarta/` — South Indian smārta

- `01_nitya_puja_vidhanam.txt` — 55 units. The generic daily rite, complete: pūrvāṅga,
  kalaśārādhana, śaṅkhapūjā, ghaṇṭānāda, Gaṇapati pūjā, then the sixteen services.
- `02_sankshipta_puja_vidhanam.txt` — 31 units. The **short form** of the same rite: ācamana
  cut to twelve names, kalaśa/śaṅkha/ghaṇṭā dropped entirely, most upacāras reduced to their
  nāma-mantra. Same lineage as `01`, published beside it as an alternative.
- `03_purvanga_vidhanam.txt` — 31 units. The **standalone pūrvāṅga**, from a different site and
  markedly fuller than the pūrvāṅga folded into `01`. Ends by handing on to the Gaṇapati pūjā.

`01` and `03` overlap heavily and **neither supersedes the other** — one text embedding another
is not a reason to retire either. They are cross-referenced in both directions. `03` carries
seven passages `01` lacks: the Ṛgvedic `देवीं वाचमजनयन्त देवाः`, `यः शिवो नाम रूपाभ्यां`,
`लाभस्तेषां जयस्तेषां`, the haridrā-kuṅkuma declaration, the accented `ओं आकलशेषु धावति` and
`आपो वा इदं सर्वं`, two further śaṅkha verses, and a separate `घण्टपूजा`.

### The deity rites, `04`–`13`

Ten daily pūjās, all from vignanam.org's native accented Devanāgarī pages. **Units 1–29 of each
are the shared pūrvāṅga**, word-for-word the template's; units 30–60 are that deity's
ṣoḍaśopacāra. Reuse runs 60–79%, which is why the spine was written first.

| file | units | accents | what is its own |
|---|---|---|---|
| `04_ganapati_nitya_puja.txt` | 60 | 162 | Gaṇapati Gāyatrī `एकद॒न्ताय॑ वि॒द्महे॑`, accented |
| `05_shiva_nitya_puja.txt` | 60 | 164 | Mahāmṛtyuñjaya; Puruṣasūkta at nīrājana; Śatarudriya at mantrapuṣpa |
| `06_vishnu_nitya_puja.txt` | 59 | 195 | — |
| `07_lakshmi_nitya_puja.txt` | 60 | 247 | **Śrīsūkta threaded verse-by-verse** through seven services |
| `08_durga_nitya_puja.txt` | 60 | 155 | — |
| `09_saraswati_nitya_puja.txt` | 60 | 132 | saṅkalpa adds `प्रज्ञा-मेधा-विद्या-विवेक-वाग्विलास-सिद्ध्यर्थं` |
| `10_subrahmanya_nitya_puja.txt` | 60 | 118 | Gāyatrī printed **unaccented** and left so |
| `11_surya_nitya_puja.txt` | 60 | 188 | **द्वादशार्घ्याणि** — twelve arghyas, in no other rite here; 20-name aṅga-pūjā; Puruṣasūkta at four services; the healing verse `उद्यन्नद्य विवस्वान्` |
| `12_hanuman_nitya_puja.txt` | 60 | 92 | 17-name aṅga-pūjā in which every name is a Rāmāyaṇa **deed**, not an epithet |
| `13_navagraha_nitya_puja.txt` | 60 | 92 | **nine deities**: plural verbs throughout, `ग्रह पूजा` replaces the aṅga-pūjā, no deity Gāyatrī, arghya at the head |

### The vrata, `14`

- `14_vinayaka_chaviti_vrata.txt` — 60 units, 100 accents. **Varasiddhi Vināyaka, Bhādrapada
  śukla caturthī.** Not a nitya pūjā and **it does not share the folder's pūrvāṅga**: its own
  opening, an ācamana with body-touch directions, a saṅkalpa naming the day, Taittirīya Āraṇyaka
  6.29.1 at the kalaśa, and a **prāṇapratiṣṭhā** no daily rite here performs. Three counted
  offerings of twenty-one (leaves, flowers, dūrvā pairs), an 18-name aṅga-pūjā, and the
  aṣṭottara **printed inline** — the only page here that does.

  Three things about this file a reader must know before using it. **(a)** The Puruṣasūkta
  appears at seven services only as **bracketed incipits** (`(सहस्रशीर्षा ... दशाङ्गुलम्)`);
  these are transcribed abbreviated and **deliberately not expanded**, though full accented texts
  of four of them sit in `11_surya_nitya_puja.txt`. **(b)** The **kathā is printed in English**
  by this source and in **Telugu** by the other; neither prints Sanskrit, and none was invented —
  the `deva:` of those units carries only the Sanskrit that exists, the Śyamantaka verse.
  **(c)** The closing maṅgaḷācaraṇam is **Telugu-language verse in Devanāgarī script**, using the
  Dravidian short vowels `ॆ`/`ॊ`. **Those are correct and must not be normalised away** — a
  corpus scan that flags `ॆ`/`ॊ` will flag this file, and should exempt it.

  This page is also **markedly more corrupt than its siblings**, and all of it points one way —
  conversion from Telugu script: a **Latin `ā` inside a Devanāgarī word** (`झ्āम्बवता`), `ॆ` inside
  a Sanskrit word (`वामहस्तॆ`), `णमह` twice for `नमः`, `यिदमर्घ्यं` with a glide. Nine defects were
  corrected, five of them on the second witness's authority; the aṣṭottara's own corruptions were
  **recorded and left standing**, since no second witness prints that list.

### A defect found in our own work, and what caused it

While collating the Sūrya page it emerged that **five of these files had the wrong saṅkalpa** —
`06`, `08`, `09`, `10`, `11`. Each vignanam deity page prints its *own* clause, and I had
normalised four of them toward the generic template instead: Sūrya's `आरोग्य-तेजस्-बल-प्राप्त्यर्थं`
and Sarasvatī's `प्रज्ञा-मेधा-...-सिद्ध्यर्थं` had been dropped, `सर्वाभीष्ट-सिद्ध्यर्थं` added where
the source has none, and `देवी`/`स्वामि` dropped from three deity names. All five are fixed. The
lesson is the folder's own rule turned inward: **the template is what the sources share, not
what they may be flattened into.** Every deity page's saṅkalpa is now checked against its source.

### The second recensions, `15`–`22`

- `15_mahaganapati_shodashopachara_puja.txt` — 38 units, 120 accents. **The Mahāgaṇapati pūjā
  of the *Mudgala Purāṇa*.** This is the same deity as `04` but it is not the same rite, and the
  two must not be mixed or corrected from each other. It names its authority in its own saṅkalpa
  — the verses proclaimed by the sage Gṛtsamada — and that claim was checked and holds.

  **This is the best-collated file in the folder.** The verses were found in the Purāṇa itself,
  khaṇḍa 5, adhyāya 39, `गृत्समदप्रोक्तबाह्यपूजावर्णनम्`, 72 verses, on archive.org
  (`mudgala-purana-s`). That is a genuinely independent editorial lineage, not the same site in
  another script. The collation showed that the printed rite is an **abridgement** of the
  chapter: the Purāṇa also has abhyaṅga, udvartana, eight separate abhiṣeka substances, sindūra,
  uttarīya, dakṣiṇā, fruits, twenty-one dūrvāṅkuras and a camphor ārati, and the page keeps
  sixteen services only. Four verses differ in wording, and one word differs — `फाल` for the
  Purāṇa's `भाल`, which is printed in brackets in the line itself.

  The page has **no pūrvāṅga of its own**: it begins at the second saṅkalpa. Use
  `03_purvanga_vidhanam.txt` before it.

- `16_anjaneya_shodashopachara_puja.txt` — 33 units, 45 accents. **The stotranidhi Āñjaneya
  pūjā**, beside the vignanam rite at `12`. This pair is much closer than the Gaṇapati pair, and
  the file says so rather than overselling the difference: 104 of the source page's 172 lines
  already stood in `12`, and the **seventeen-name aṅga-pūjā is word for word the same list in the
  same order**. It earns its own file on what it adds — a second saṅkalpa, a two-verse dhyāna,
  madhuparka, ābharaṇa, its own seat, bath, akṣata, flower and lamp verses, the `आत्मप्रदक्षिण`,
  the royal services (parasol, fans, dance, song, palanquin, horse, elephant), and its own tīrtha
  verse. Like `15` it has **no pūrvāṅga of its own** and sends the worshipper to `03` first.

  **Gītā Press publishes no ṣoḍaśopacāra of Hanumān**, so this file rests on two witnesses, not
  three, and says so. Its Hanumān Gāyatrī is printed unaccented and is left unaccented.

  **This file corrected a claim made in this README.** The line above used to say that
  stotranidhi's Hanumān aṅga-pūjā runs to twenty-nine alliterative names against vignanam's
  seventeen. That came from the survey and was wrong: the page has seventeen, and they are the
  same seventeen. The survey note was never checked against the page until the file was written.

- `17_shiva_shodashopachara_puja.txt` — 44 units, 418 accents. **The stotranidhi Śiva pūjā**,
  beside the vignanam rite at `05`. This is the **widest-apart pair in the folder**: 214 of the
  page's 256 lines do not stand in `05` in any form. The reason is structural. **Every one of the
  sixteen services here is headed by a mantra of the Mahānārāyaṇa Upaniṣad**, and the page takes
  those mantras in the order the Āraṇyaka has them — anuvāka 17 divided across the first five
  services, the eleven names of anuvāka 18 given one to each of the next eleven, then anuvākas 19
  to 22 for the light, the mantra-flower, the circumambulation and the prayer.

  It also worships Śiva **in a liṅga** rather than an image, and as **Umāmaheśvara** with Umā
  beside him, where `05` says `ॐ नमः शिवाय`. Three whole services are absent from `05`: the
  twenty-two liṅga names of anuvāka 16, the **eight forms of Rudra each with his consort** —
  worshipped, and then given water in a `तर्पण` — and the **asking of blessings** from
  Taittirīya Brāhmaṇa 3.5.10.4, which the source cites by name.

  **It was collated against the Mahānārāyaṇa Upaniṣad itself** (sa.wikisource.org, the text of
  Taittirīya Āraṇyaka prapāṭhaka 10) — a genuinely independent lineage, and the source the page's
  own Vedic material comes from. All six anuvākas were compared word by word, and the page's
  claim on its own authority, that the rite follows the Sadyojāta rule, was checked and holds.
  Three real differences from the Āraṇyaka are recorded in the file and none was corrected:
  the pādya and arghya mantras **cut the sentence `भवे भवे नातिभवे भवस्व माम्` in two** for
  ritual use; the lamp reads `बलप्रमथनाय` for `बलप्रमथाय`; and the light reads
  `सर्वेभ्यः सर्वशर्वेभ्यो` for `सर्वतः शर्व सर्वेभ्यो`. `आत्माय` for `आत्मने` is **not** a
  defect — the Āraṇyaka prints it too.

  Like `15` and `16` it has **no pūrvāṅga of its own**, and sends the worshipper to `03` and to
  `15` first.

- `18_mahalakshmi_visesha_shodashopachara_puja.txt` — 45 units, 378 accents. **The stotranidhi
  Mahālakṣmī viśeṣa pūjā**, beside the vignanam rite at `07`. 229 of the page's 283 lines are
  absent from `07`.

  **This rite is built on the Śrī Sūkta.** The page's own second saṅkalpa says the worship
  follows `श्री सूक्त विधानेन`, and the claim holds: the sixteen services are headed by the
  fifteen ṛcs of the hymn in the hymn's own order, so that the whole Śrī Sūkta is recited across
  the worship — ṛc 8, which drives out Alakṣmī, falling at the fan. It adds the worship of the
  **eight attainments** and of the **eight Lakṣmīs** in the eight directions, the gift of gold,
  and a whole **Dīpāvalī portion**: the lamp worshipped as a form of Brahman, the row of lamps,
  and an eleven-verse prayer to the night of Dīpāvalī under its older name Sukharātri, the night
  of ease. That portion is why the page calls itself a `विशेष` pūjā.

  Collated against this corpus's own `devi/lakshmi/06_sri_suktam.txt`, whose text is vignanam's.
  **Most apparent differences turned out to be saṁhitā-pāṭha against the split, visarga-final
  printing** — a pāṭha difference inside one tradition, not a variant. Three real differences
  are recorded and none was corrected, including one ṛc (`सम्राजं च विराजं च`) that the corpus's
  Śrī Sūktam does not print at all.

  **Fifty occurrences of `महालक्ष्मै` were corrected to `महालक्ष्म्यै`.** `लक्ष्मै` is not a
  Sanskrit form, and the page itself writes `श्रीमहालक्ष्म्यै` correctly once and uses the right
  datives throughout its aṅga-pūjā, so this is a slip and not a habit of the edition.

  **A second wrong survey note was caught here.** `07` says stotranidhi's rite adds a
  `प्राणप्रतिष्ठा`. It does not — neither the Devanāgarī page nor the Telugu page has one; the
  other three items in that line are correct. As with the Hanumān case, the note was written
  across several deity pages at once and never checked against this one. `07` is another
  session's file and was not edited; the finding is recorded in `18`'s header and here.

- `19_durga_shodashopachara_puja.txt` — 43 units, 388 accents. **The stotranidhi Durgā pūjā**,
  beside the vignanam rite at `08`; 205 of 249 lines are absent from `08`. Built on the **Śrī
  Sūkta** exactly as `18` is — the Śrī Sūkta used for a rite of Durgā — but with two changes of
  plan: ṛc 8, which drives out Alakṣmī, heads the **thread of good fortune** instead of the fan,
  and the garment carries a second Vedic verse beside its ṛc, **Ṛgveda 9.97.50** from the Soma
  Pavamāna hymn, which asks for fair garments. It adds a prāṇapratiṣṭhā, the **four meditations
  of the Durgā Saptaśatī**, the offerings a married woman wears — the thread of good fortune,
  turmeric, saffron, vermilion and collyrium — and the gift of gold.

  The four meditations were collated against the corpus's Saptaśatī files, written from Gītā
  Press. Two match word for word; the Mahālakṣmī dhyāna differs in two places from
  `devi/durga/40_navarna_vidhi.txt`, one of them a real difference of reading
  (`हस्तैः प्रवालप्रभां` against `हस्तैः प्रसन्नाननां`); and the Durgā dhyāna is not in the
  Saptaśatī at all. None was corrected in either direction.

- `20_saraswati_shodashopachara_puja.txt` — 30 units, 83 accents. **The stotranidhi Sarasvatī
  pūjā**, beside `09`; 131 of 178 lines are absent from it. Not built on a hymn, but its
  mantra-flower carries **four accented ṛcs of the Ṛgveda**, and the source's own citation
  (`ऋग्वेदं ६।६१।४`) is right: they are **ṚV 6.61.4–7**, four consecutive Gāyatrī verses of
  Bharadvāja's hymn to Sarasvatī. `09` has no Vedic material there at all.

  **This is the cleanest collation in the folder.** Against the accented Śākala text at
  sa.wikisource, all four ṛcs match exactly — syllable for syllable and accent mark for accent
  mark. The only difference found was the ASCII-colon visarga described below.

  Its meditation is first a direction in verse: the Goddess in truth plays in the book, so she
  is to be meditated upon and invoked there. Its worship of the limbs runs to **twenty-five
  names**, the longest in this folder, every one a name of learning or of speech. Six defects
  were corrected, two of them in one line: `प्रकुरीत्व` → `प्रकुर्वीत` (the right form stands
  two lines above it on the same page) and `साधनो` → `साधको`.

- `21_subrahmanya_shodashopachara_puja.txt` — 34 units, 47 accents. **The stotranidhi
  Subrahmaṇya pūjā**, beside `10`; 125 of 174 lines are absent from it. **Not built on a hymn at
  all** — its upacāra verses are paurāṇika throughout, and each calls the Lord by a different
  deed: the splitting of Krauñca, the ending of Tāraka and of Śūrapadma, the birth in the reed
  thicket, the teaching of the meaning of Oṁ to Brahmā. It names **both consorts in every
  offering**, adds **sacred ash** as a service, and closes with a **threefold offering of
  water** — to the Lord, to the moon, and to the peacock who carries him.

  **This file rests on the fewest witnesses of the eight and says so.** Gītā Press has no
  ṣoḍaśopacāra of Subrahmaṇya, and the three water-offering verses are found in no other edition
  reached. Only the Skanda Gāyatrī could be collated, against the Mahānārāyaṇa Upaniṣad, which
  reads `तन्नः षण्मुखः` where the page reads `तन्नो स्कन्दः`.

- `22_surya_shodashopachara_puja.txt` — 36 units, 361 accents. **The stotranidhi Sūrya pūjā**,
  beside `11`. At 183 of 286 lines new it is the **closest** of the five pairs written this day,
  because both rites carry the long **dvādaśārghya**, the twelve offerings of water to the
  twelve Ādityas.

  Built on the **Puruṣa Sūkta**, the third such plan in the folder. The ṛcs run in the hymn's own
  order, and the verse naming him *of the colour of the sun, beyond the darkness* falls at the
  waving of the light — the fittest verse of the hymn for this deity. Collated against
  `veda/taittiriya/01_purusha_suktam.txt`. The ṛcs agree throughout; the differences are the
  ASCII-colon visarga, whether the doubled avagraha is written, how the pāda-boundary sandhi is
  printed, and **one genuine difference of accent** — `य॒दन्ने॑ना` here against `यदन्ने॑ना`
  there. Nothing was moved between the files.

  **Its second resolution names the illnesses one by one** — fever, wasting, jaundice, skin
  disease, colic, dysentery, sores, urinary disease, fistula — and the salutation near the close
  asks the sun to take away the disease of the heart. It is a rite resolved upon for health.

### A defect of the source, found late and corrected in all eight

stotranidhi writes final visarga in its accented mantras as the **ASCII colon `:`** rather than
as `ः` (U+0903) — `चक्षु॒:` for `चक्षु॒ः`. It looks right on the page and is wrong in the file:
it breaks search, breaks collation against any real edition, and transliterates as a colon. It
was caught while collating `20` against the Ṛgveda, where it was the **only** difference between
the page and the Śākala text. Every such colon inside a `deva:` field of `15`–`22` has been
mapped to `ः` and the affected `iast:` fields regenerated.

### The survey notes overstated, four times out of five

The one-line notes in `07`–`11` describing stotranidhi's rites were written across several deity
pages at once and pasted onto each. Checked against the pages themselves, **four of the five are
wrong in one detail**:

| claim in | says the page adds | actually |
| --- | --- | --- |
| `07` | `प्राणप्रतिष्ठा` | **not there** |
| `09` | `प्राणप्रतिष्ठा` | **not there** |
| `10` | `प्राणप्रतिष्ठा` | **not there** |
| `11` | `मधुपर्क` | **not there** |

`प्राणप्रतिष्ठा` stands on two of the five pages, Durgā and Sūrya, not on all five. `मधुपर्क` is
absent from Subrahmaṇya and Sūrya. The `पुनः सङ्कल्प` and the `पञ्चामृत स्नान` are on all five,
as claimed. This is the same failure as the "twenty-nine alliterative names" error corrected
earlier: a generalisation written once and never checked against the individual page. Those
files belong to other sessions and were not edited; each now carries a cross-reference pointing
here.

## `vaishnava/` — South Indian Śrīvaiṣṇava

- `01_purvanga_vidhanam.txt` — 19 units. The pūrvāṅga only; ends by handing on to the
  Viṣvaksena pūjā.

**This file has no independent collation, and says so.** Gītā Press publishes no Śrīvaiṣṇava
pūjā-paddhati (its *Nitya Karma Pūjā Prakāśa* is smārta-pañcāyatana throughout) and vignanam's
pūjā pages are smārta only, so stotranidhi is the sole witness. Its two corrections were made
against the received text of the verses, not against a second edition of the rite.

## Sourcing, and what each witness is good for

Three genuinely independent lineages, in the order the corpus rule prefers:

1. **Gītā Press, Gorakhpur, *Nitya Karma Pūjā Prakāśa*** (archive.org
   `nitya-karma-puja-prakash-gita-press-gorakhpur`, 396 pp.). The authority for *text*, and
   **unaccented** — GP's āhnika and pūjā manuals print mantras without svaras, as `CLAUDE.md`
   records. It is also the **North Indian** smārta tradition, so it is a witness here and never
   a source to import from: it expands snāna into a full abhiṣeka series (dugdha, dadhi, ghṛta,
   madhu, śarkarā, pañcāmṛta, gandhodaka, śuddhodaka), adds upavastra and dakṣiṇā, and says
   **आरती** where the South says **नीराजन**.
2. **vignanam.org** — the better *base text* for this genre, which reverses the usual order.
   Every pūjā page carries a **native accented Devanāgarī edition** declaring itself "शुद्ध
   देवनागरी with the right anusvaras marked", with accent counts identical across scripts. So
   nothing in `smarta/01` or `smarta/02` was transliterated by us, and none of the 29
   Latin-`o`-for-anusvāra repairs that `../vidhi/taittiriya/` needed were required here.
3. **stotranidhi.com** — base text and the fuller witness for the pūrvāṅga. Never the authority.

**The single most useful collation result so far:** Gītā Press agrees with stotranidhi *against*
vignanam on the śaṅkha verse `त्वं पुरा सागरोत्पन्नो विष्णुना विधृतः करे` — present in GP and in
stotranidhi, absent from vignanam. That is evidence the verse belongs and that vignanam's text
is the abridged one, not that stotranidhi's is padded.

**Never copy stotranidhi's IAST.** Its pages mark anusvāra `ṃ` and avagraha `’` where this
corpus uses `ṁ` and `'`. Every `iast:` field in this folder was generated from the Devanāgarī by
`../bin/dev2iast.py`.

## The template slot is left as a slot

`smarta/01` and `smarta/02` print `श्री इष्ट देवता` — "the chosen deity" — as a slot to be
filled with the worshipper's own deity in the dative, along with that deity's dhyāna-śloka and
nāmāvalī. That is the **source's own** editorial device, faithfully reproduced. It has not been
filled in with any deity, because doing so would silently turn a general template into one
particular rite.

Gītā Press independently describes the same principle in its own words: any deity's pūjā runs on
the same sequence and the same mantras, only the vibhakti and the nāma-mantra changing — it
gives Śiva-pūjā as its worked example and Durgā-pūjā for the feminine. Two unrelated lineages
describing one template principle is the strongest structural evidence in this folder, and it is
why the spine was written first: roughly 35 deity files can reuse it.

## Tooling built for this folder

- `../bin/dev2iast.py` — Devanāgarī → IAST in the corpus convention, measured against all
  existing files rather than assumed. **95.79% exact** on its proper domain (17,934/18,722
  Sanskrit units); the residual is dominated by defects in hand-authored `iast:` fields, which
  the script surfaces. Two measured findings worth keeping: the corpus writes anusvāra `ṁ` even
  before a stop (assimilating to the homorganic nasal was tried and *cost* hundreds of units),
  and five files use Tamil romanisation and are out of the tool's domain entirely.
- `../bin/fill_iast.py` — fills empty `iast:` fields from the `deva:` above them. Author a file
  with `iast:` blank and run this; it never touches a field that already has content.
- `../bin/fetch_source.py` — fetches a source page and strips nav, comments and book
  advertising. Needed because **both sites return HTTP 403 to a bare fetch** and require a
  browser User-Agent.

## Accent

Present throughout, on the Vedic mantras (the paurāṇika verses are printed unaccented, which is
normal and not a defect): 41–420 marks per file, 3,805 in the folder. Udātta `॑` U+0951, anudātta `॒` U+0952, dīrgha svarita `᳚` U+1CDA. The praṇava
before a spirant takes the guttural nasal, written `ओग्ं` (`ogṁ`), distinct from plain `ओं`.

**No accent was inferred, derived or reconstructed anywhere in this folder.** Per `CLAUDE.md`,
accent is transcribed or absent, never derived, and never carried across traditions.

Three places where that rule cost something, and was kept anyway. The **Subrahmaṇya Gāyatrī**
(`10`) and the **Hanumān Gāyatrī** (`12`) are printed unaccented and stand unaccented, though
Subrahmaṇya's could have been accented by analogy with the Śiva Gāyatrī it is modelled on —
`तत्पुरुषाय विद्महे` is identical in both — and inferring it is exactly what the rule forbids.
The **Sūrya Gāyatrī** (`11`) likewise. In `13` the Vedic `यज्ञोपवीतं परमं पवित्रं` is printed
without svaras and left so. And in `14` the seven Puruṣasūkta incipits are unaccented because
they are unexpanded; accented full texts exist elsewhere in this corpus and were not imported.

## Still to write

The spine and the first tranche exist. Queued, in the order they earn their place:

- **stotranidhi's remaining deity pūjās as a second recension.** Its ṣoḍaśopacāra pages are
  **not** the same rite as vignanam's — they add prāṇapratiṣṭhā, a `पुनः सङ्कल्प`, madhuparka,
  pañcāmṛta, ābharaṇa and a 17-name ṣoḍaśanāma. They belong as **their own files
  cross-referenced to `04`–`13`**, never merged into them. **This queue is now finished.** Every stotranidhi
  deity page with a sibling in `04`–`13` has been written: Gaṇapati, Hanumān, Śiva, Lakṣmī,
  Durgā, Sarasvatī, Subrahmaṇya and Sūrya, as `15`–`22`. Viṣṇu has no Devanāgarī page, so `06`
  has no sibling.
- ~29 further deity ṣoḍaśopacāra pūjās from stotranidhi's 49-page `puja-vidhi` category.
  **None of these has a sibling in `04`–`13`**, so the second-recension question does not arise
  for them: each is simply a new rite. Candidates seen in the index include Dattātreya, Lalitā,
  Vārāhī, Veṅkaṭeśvara, Ayyappa, Kubera, Kālī, Bagaḷāmukhī, Dakṣiṇāmūrti, Gāyatrī, Tulasī,
  Śyāmalā, Bālātripurasundarī and Śirḍī Sāī.
- ~14 vratas from stotranidhi's 15-page `vratham` category. These are the expensive ones: each
  carries a unique kathā, which is all new prose.
- Gītā Press ***Vrat Paricay***, a 400-page month-by-month vrata calendar — a separate project.
  Use archive.org id `vrata-parichaya` (416 pp.): its OCR has **zero** Latin noise, against
  42,791 characters of it in the 1996 scan. **Vināyaka Cavitī is in it** as
  `सिद्धिविनायकव्रत`, Bhādra śukla, p. 123.

See `../AUTHORING_QUEUE.md` for the full surveyed inventory.

## Added 2026-09-12 — `smarta/23_mahaganapati_chaturavrutti_tarpanam.txt`

21 units. **This one is not a smārta pūjā like the rest of the folder** — it is a Śrīvidyā-Gāṇapatya
tāntric paddhati, built on a mūlamantra that is given by a teacher at initiation, and the file says
so in its header. It sits here because `puja/` is where the corpus keeps pūjā apparatus, and there
is nowhere better; a reader should not take it as a rite to perform unasked.

Base text `stotranidhi.com/hi/sri-maha-ganapathi-chaturavrutti-tarpanam-in-sanskrit/`, native
Devanāgarī, 300 lines. **Unaccented** — a first pass reports fifty-four "accent marks" on the page,
and they are the fifty-four right quotation marks around the syllables, not tone signs.

**Written on one editorial lineage, and the header says so in those words.** Absent from vignanam's
27,096-entry sitemap, from four sanskritdocuments directories, and from both Gītā Press volumes
searched — neither contains the word `चतुरावृत्ति` at all. **The closing verse alone has witnesses**,
and they give four different forms of it: Gītā Press *Nitya Karma Pūjā Prakāśa* masculine ending
`महेश्वर`, the printed Gītā Press Saptaśatī at `../../devi/durga/40_navarna_vidhi.txt` feminine with
the second line word for word the same, `../../devi/varahi/03_vasyavarahi_stotram.txt` feminine
ending `महेश्वरि`, and this file's own `गृहाण कृततर्पणम्`, which is what the verse must say in a
tarpaṇa rather than a japa. All four recorded, none reconciled.

The arithmetic of the rite checks out and is set down in the header: the mūlamantra twelve times,
then each of fifty-four items four times with the mūlamantra four times after each — 12 + (54 × 8)
= **444**, which is the figure the source prints at its last line. The fifty-four are the
twenty-eight syllables of the mūlamantra followed by twenty-six of the god's retinue in pairs, a
power with its lord, which is the mark of this school.

## `vikalpa/` — alternatives to the Vedic mantras (added 2026-09-13)

*Cross-reference added 2026-09-13. Nothing above this line was changed.*

Twenty-five of the files in `smarta/` and `vaishnava/` carry accented Vedic mantras — `smarta/01`–`22`,
`smarta/24`, `smarta/26`, and `vaishnava/01`. By long-standing rule those mantras are recited only by
one for whom the **upanayana saṁskāra** has been performed.

`vikalpa/01_veda_mantra_vikalpa.txt` gives, for each place where such a mantra falls, the Paurāṇika
verse the pūjā manuals put in its stead, so that a reciter who has not received upanayana may perform
the whole worship without omission. It covers the prāṇāyāma, `गणानां त्वा`, the ācamana `स्वाहा`,
`आ कलशेषु धावति`, `आपो हि ष्ठा`, `योऽपां पुष्पं वेद`, the sūktas, the deity gāyatrīs, and a general
rule for anything not named.

Three things about it, stated here so that browsing the tree is enough to find them out:

1. **It is paddhati-neutral and is not a third paddhati.** The substitutes are Paurāṇika and are used
   in the same form on both sides of the smārta / Vaiṣṇava division, which is why it sits beside those
   two folders rather than inside either.
2. **It adds and replaces nothing.** Not one character of the twenty-five files is changed by it and
   none of them is superseded. A reciter for whom upanayana has been performed uses those files as they
   stand; a reciter for whom it has not uses them together with this one.
3. **Four rites cannot be adapted.** `smarta/17`, `18`, `19` and `22` are built on a sūkta from end to
   end, a Vedic mantra heading each of their sixteen services; removing those leaves no rite behind.
   The file says so plainly and directs the reciter to the deity's nitya-pūjā instead — `05`, `07`,
   `08`, `11` — rather than pretending a verse-for-verse exchange is possible.

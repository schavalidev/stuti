# Stuti Master Vrata and Parva Reference

**Status: staged planning reference, supplied 2026-09-12.** This file is the content-planning
inventory for the vrata, nomu, parva, jayanti, dīkṣā and pārāyaṇa side of Stuti. It holds no
verse text and no ritual text. Nothing in it has been collated against an edition, and no name
listed here should be treated as a sourced entry.

The document was supplied as a Word file, `Stuti_Master_Vrata_Parva_Reference.docx`. The body
below is that document, converted to markdown and otherwise unchanged. The section immediately
following this one was added by the session that landed the file. It is separate from the
document, and it does not change any standing rule.

---

## How this file sits with the standing rules — added 2026-09-12

This was measured, not assumed. Five points matter before anyone works from the document.

### 1. Its evidence grades and the corpus sourcing chain answer different questions

Section 2 below grades evidence from A to E. Primary śāstra is A, the classical nibandhas are B,
and an identifiable regional vrata or nomu publication is D.

`stotras/AUTHORING_QUEUE.md` already carries a separate and measured chain for this same genre,
decided on 2026-09-12. There the Telugu regional print **Āru Vratālu** (Rajahmundry, 1999) is the
**base text**, and Vratarāja, Hemādri, Dharmasindhu and Nirṇayasindhu are **witnesses only**. The
reason given is that the reader is a South Indian, Telugu worshipper, and that a rite printed in a
Pune nibandha is a different observance, not a better edition of the same one.

Read literally, the two orders point opposite ways: the grade ladder ranks the nibandha above the
Telugu print, and the authoring chain does the reverse.

**Decided (user, 2026-09-12): keep both. They measure different things, and neither overrides
the other.**

- **A grade measures how much weight a claim carries.** It governs what may be said about a
  vrata in the reader's hearing — whether it is textually attested, recognised within a named
  sampradāya, or living regional practice.
- **The chain decides which edition supplies the base text.** It governs what is transcribed.

The two never compete, because they answer different questions. A vrata may take its procedure
from a grade D Telugu print and be described honestly as regional practice rather than
pan-Indian śāstra. That is the normal case for this genre, not a compromise.

Two working consequences:

1. **A low grade is not a reason to change the base text.** If Āru Vratālu is the only edition
   the reader's own tradition prints, it remains the base text at grade D, and the file says in
   its editorial fields that the attestation is regional.
2. **A high grade does not promote a witness to base text.** Vratarāja carries most of this
   queue at grade B. It is still a Bombay and Pune lineage, so it settles a doubtful reading and
   supplies a kathā in Sanskrit; it does not supply the rite.

### 2. Its record fields are not all reader-facing

Section 3 below lists six field groups. The rule added on 2026-09-12 — the reader never sees the
source information — applies to them:

- **Reader-facing:** Identity, Calendar, Practice, Context.
- **Withheld, always:** Evidence, Publishing.

`bin/reader_view.py` works by allow-list, so any header field this schema introduces is withheld
until somebody classifies it. Two of the groups need care. In Context, the region and the
sampradāya are reader-facing, because a worshipper must be able to tell that a rite is not theirs.
In Identity, the name of the edition that supplies a spelling is not.

### 3. Its parva inventory largely duplicates `reference/` — the real delta is nine names

Section 4 below lists **132 parva names** across the twelve Telugu months. Checked against
`thithi_parvadina_index.md`, `festivals_aarshavani.md` and `masa_visishtata.md`, **123 are already
held**, most of them with a tithi, a significance note and a cited pan-India comparison that this
document does not carry.

Nine names are genuinely new:

| Name | Month as given here |
|---|---|
| Bathukamma | Āśvayuja |
| Bonalu | Āṣāḍha |
| Damanaka observances | Caitra |
| Hartalika Gauri | Bhādrapada |
| Mukkanuma | Puṣya |
| Pithori | Śrāvaṇa |
| Raghavendra Swami Ārādhana | Śrāvaṇa |
| Sakata Caturthi | Puṣya |
| Kedāreśvara, under that name | Kārtika |

Kedāragaurī is a partial case. It appears once in `festivals_aarshavani.md`, as a dated entry for
25 October 2022, and nowhere in `thithi_parvadina_index.md`. The name Kedāreśvara appears in
neither.

**Do not merge this list into the existing index.** The existing files carry sourced notes that a
merge would lose. Section 4 is a gap check against them, which is what the table above is.

**Closed 2026-09-12.** All nine were researched and written into
`thithi_parvadina_index.md`, each with its own cited source and in that file's existing format.
No existing entry there was altered. Three of the nine do not sit on a tithi and went into that
file's Notes instead: Bonālu is reckoned by the Sundays of Āṣāḍha, Mukkanuma is the fourth day of
the solar Sankrānti cycle, and Bathukamma and Kēdāra Gaurī are multi-day and are entered at both
their opening and their closing tithi.

Two of the nine turned out to be narrower than a bare name suggests, and the index says so:

- **Hartālikā Gaurī is one tithi under several names** — Hartālikā Tīj in the Hindi-speaking
  states, Gaurī Habba or Svarṇa Gaurī in Karnataka, Tadiya Gauramma in the Telugu districts. It
  was missing from the index under every one of those names, so it was a real gap.
- **Sakaṭa Caturthī is not a separate festival.** It is the Māgha occurrence of the monthly
  Saṅkaṣṭahara Caturthī, which the index already treats as a recurring observance. North India
  gives that one occurrence a name and a fast; the South keeps it as an ordinary Saṅkaṣṭahara
  Caturthī. It is entered as a named instance, not as a new festival.

### 4. Five of its twelve immediate priorities are now written, and four more have a source

Section 16 below lists twelve content priorities. Measured against the vrata queue in
`stotras/AUTHORING_QUEUE.md`:

| Priority | Source located |
|---|---|
| Varalakṣmī | **Written** — `stotras/puja/vrata/01_varalakshmi_vrata_kalpam.txt`, 39 units |
| Kedāra Gaurī | **Written** — `stotras/puja/vrata/02_kedareswara_vrata_kalpam.txt`, 56 units |
| Ananta Padmanābha | **Written** — `stotras/puja/vrata/05_ananta_padmanabha_vrata_kalpam.txt`, 74 units |
| Maṅgaḷa Gaurī | **Written twice** — `stotras/puja/vrata/03_mangala_gauri_vrata_kalpam.txt` (45 units, Rajahmundry 1998) and `stotras/puja/smarta/26_sravana_mangalagauri_vrata_kalpam.txt` (55 units, Machilipatnam 1958), by two hands. Neither supersedes the other |
| Vaibhava Lakṣmī | **Written** — `stotras/puja/vrata/04_vaibhava_lakshmi_vrata_kalpam.txt`, 41 units |
| Undrālla Taddi | Yes — `atla-tadiya-w`, which is catalogued under the wrong title |
| Kārtika lamp and Dāmodara observances | Yes — `20230904_20230904_1040`, clean |
| Pōlāla Amāvāsya | Yes, in part — the kathā only, and the OCR is degraded |
| Pithori | Located but not usable — a 1711 manuscript scan that decodes to nothing |
| Ayyappa, Bhavānī, Hanumān and Govinda Māla dīkṣās | Not these four, but see below |
| Kalyāṇa Gaurī Nomu | No |
| Sapta Śanivāra | No |
| Ekādaśa and Ṣoḍaśa Somavāra | No |

**Updated 2026-09-12, after the user supplied four vrata PDFs.** Three of them are base texts, and
they change this table in two ways.

1. **The dīkṣā row is no longer empty.** `577650787-SIMHA-VRATAM-HARIHARAPURA.pdf` is a complete
   sixteen-day **mālā dīkṣā** with its rules, its daily pūjā, its mantra and its irumuḍi. It is not
   one of the four dīkṣās the document names, and it is a Karnataka maṭha observance rather than a
   Telugu one. But it is the first dīkṣā in this queue with a source, and it shows that the genre
   is reachable through the maṭhas that conduct it rather than through the archives.
2. **The Vrata Ratnākaram page images have begun to arrive.** The paragraph this replaces said the
   page images have to be read. Thirteen of them now have been:
   `331168138-Savitri-Gouri-VrataM.pdf` is pages 264 to 276 of volume II, carrying the Sāvitrī
   Gaurī Vratam entire — vidhāna, nāmāvaḷi, Sanskrit kathā and Telugu kathā.

Two further observances arrived with them and are not in the document's inventory at all:
**Gurunātha Vrata (Poṅgali)** and **Kāmeśvarī Vrata**, both kula-devatā rites, both printed by Śrī
Venkaṭeśvara Vedic University, Tirupati. **Payo-vrata** also arrived, and it is the one item in this
genre that reaches the top of the standing sourcing chain, because it is not a vidhāna but Śrīmad
Bhāgavata chapter 8.16, which Gītā Press publishes.

What remains genuinely unsourced is now three: Kalyāṇa Gaurī Nomu, Sapta Śanivāra, and the
Somavāra cycles.

### 5. Śākhā does not apply to this genre, and paddhati does

The document does not mention śākhā, and it is right not to. This was measured: Āru Vratālu
declares no sūtra and no śākhā, because vrata pūjā mantras are Purāṇic ślokas and nāma-mantras
rather than Vedic recitation. **Do not write a śākhā into a vrata file.** What does divide these
texts is paddhati — smārta against Śrīvaiṣṇava — and region. The document's Context field group
already provides for both.

One further agreement is worth naming. The document's caution that amānta and pūrṇimānta month
labels differ while the tithi stays the same is the same finding the queue records, and the queue
carries the mechanism for it: write the amānta month first and the pūrṇimānta name after it in
round brackets.

### A note on language

The other files in `reference/` exist in English, Hindi and Telugu. This one is English only. No
translation has been made.

---

## The document as supplied

*Pan Indian inventory with regional labels and source status.*
*Content planning edition, September 2026.*

**Purpose.** This handbook organizes the vrata, nomu, parva, jayanti, puja, diksha and fixed-count devotional observances discussed for the Stuti app. It is a content inventory, not a substitute for a local panchanga or a complete ritual manual.

**Main editorial rule.** Popularity is not proof of antiquity. Each future Stuti article must distinguish textually attested vrata, recognized sampradaya practice, living regional tradition and modern popular devotion.

### 1. Scope and classification

A single observance may carry more than one tag. For example, Sri Rama Navami is both a jayanti and a major parva. The database should retain one primary type and multiple secondary tags.

| Primary type | Meaning in Stuti |
|---|---|
| Vratam or Nomu | A vow with sankalpa and a prescribed discipline, worship, fast, repetition or completion. |
| Parva Dinam | A sacred calendar occasion; fasting is not automatically required. |
| Jayanti | A divine, avatara, rishi, acharya or saint commemoration. |
| Puja Dinam | A day on which worship is primary, without assuming a mandatory fast. |
| Seasonal observance | A practice extending across a lunar month, solar month, season or festival period. |
| Fixed count cycle | A vow repeated for a specified number of weekdays or years. |
| Diksha | A sustained discipline normally involving niyamas and, often, initiation or mala-dharana. |
| Parayana discipline | A fixed-duration recitation program; not automatically a classical vrata. |
| Regional tradition | A traceable living practice particular to a region, community or household lineage. |

### 2. Authenticity and evidence policy

| Grade | Acceptable evidence | Permitted claim |
|---|---|---|
| A | Primary shastra: Veda, Smriti, Itihasa or Purana with exact passage. | Textually attested; describe only what the passage supports. |
| B | Classical dharma or vrata nibandha such as Dharma Sindhu, Nirnaya Sindhu, Caturvarga Cintamani, Vrataraja or Kritya Kalpataru. | Classical paddhati or nibandha attestation. |
| C | Recognized sampradaya, matha or temple publication with identifiable edition. | Authoritative within the named tradition or institution. |
| D | Identifiable regional vrata or nomu publication, supported where possible by more than one edition or practitioner lineage. | Regional textual or living tradition; not pan-Indian shastra. |
| E | Contemporary booklet, oral practice or modern devotional movement. | Popular or living practice only; no ancient attribution. |
| Q | Claim awaiting verification. | Internal inventory only; do not publish ritual details as settled fact. |

- Calendar websites may assist with date discovery but do not establish vidhi, eligibility, phalashruti or scriptural provenance.
- Do not cite a Purana merely because a modern booklet names it. Locate the passage in a verifiable edition.
- Keep the source of the vrata, the source of the katha and the source of the household procedure as separate fields.
- Where regional versions conflict, preserve both with labels instead of manufacturing a blended universal procedure.
- Do not insert a generic shodashopachara template and call it the vrata vidhi unless the source permits that adaptation.

### 3. Recommended record fields

| Field group | Fields |
|---|---|
| Identity | Canonical name; aliases; names in Telugu, Devanagari and IAST; primary type; secondary tags. |
| Calendar | Lunar/solar basis; month; paksha; tithi; weekday; nakshatra; timing rule; adhika or kshaya handling. |
| Practice | Deity; sankalpa; eligibility; duration; fasting rule; materials; puja sequence; naivedyam; parana; udyapana. |
| Context | Purpose; region; sampradaya; gender or life-stage conventions; temple versus household form; variations. |
| Evidence | Source title; author/editor; edition; chapter/page/verse; original quotation; translation; evidence grade. |
| Publishing | Verification status; reviewer; last checked date; rights status; content completeness; cautions. |

### 4. Year long parva inventory by Telugu lunar month

#### Caitra చైత్రము

- Ugadi or Yugadi
- Vasanta Navaratri
- Saubhagya Gauri or Gauri Tritiya
- Matsya Jayanti
- Sri Rama Navami
- Kamada Ekadashi
- Damanaka observances
- Hanuman Jayanti
- Caitra Purnima
- Citragupta Puja

#### Vaisakha వైశాఖము

- Akshaya Tritiya
- Parashurama Jayanti
- Adi Shankara Jayanti
- Ramanuja Jayanti
- Ganga Saptami
- Sita Navami
- Vasavi Kanyaka Paramesvari Jayanti
- Mohini Ekadashi
- Narasimha Jayanti
- Kurma Jayanti
- Buddha Purnima
- Annamacharya Jayanti
- Narada Jayanti

#### Jyeshtha జ్యేష్ఠము

- Shani Jayanti
- Vata Savitri Vratam
- Ganga Dashahara
- Nirjala Ekadashi
- Vata Purnima
- Jagannatha Snana Yatra

#### Ashadha ఆషాఢము

- Jagannatha Ratha Yatra
- Devashayani Ekadashi
- Caturmasya begins
- Guru Purnima and Vyasa Puja
- Ashadha Gupta Navaratri where followed
- Bonalu in Telangana

#### Shravana శ్రావణము

- Shravana Somavara
- Mangala Gauri
- Naga Caturthi and Naga Panchami
- Garuda Panchami
- Kalki Jayanti
- Shravana Putrada Ekadashi
- Varalakshmi Vratam
- Veda Upakarma
- Raksha Bandhan
- Hayagriva Jayanti
- Gayatri Jayanti
- Raghavendra Swami Aradhana
- Polala Amavasya or Pithori tradition

#### Bhadrapada భాద్రపదము

- Sri Krishna Janmashtami
- Aja Ekadashi
- Hartalika Gauri
- Swarna Gauri where followed
- Vinayaka Cavithi
- Rishi Panchami
- Radhashtami
- Vamana Jayanti
- Parivartini Ekadashi
- Ananta Padmanabha Vratam
- Ananta Caturdashi
- Undralla Taddi
- Mahalaya Paksha begins

#### Ashvayuja ఆశ్వయుజము

- Mahalaya Amavasya
- Devi Navaratri
- Bathukamma
- Lalita Panchami
- Sarasvati Avahana and Puja
- Durgashtami
- Mahanavami and Ayudha Puja
- Vijaya Dashami and Vidyarambham
- Sharad Purnima
- Kojagari Lakshmi Vratam
- Valmiki Jayanti
- Atla Taddi

#### Kartika కార్తీకము

- Govatsa Dvadashi
- Dhana Trayodashi and Dhanvantari Jayanti
- Yama Dipa Dana
- Naraka Caturdashi
- Deepavali and Mahalakshmi Puja
- Kedara Gauri or Kedareshvara Vratam
- Bali Padyami
- Govardhana Puja
- Yama Dvitiya
- Nagula Cavithi
- Kartika Somavara
- Skanda Shashthi traditions
- Utthana Ekadashi
- Caturmasya completion
- Kshirabdhi Dvadashi
- Tulasi Damodara Vratam and Tulasi Vivaha
- Vaikuntha Caturdashi
- Kartika Purnima, Tripurari Purnima and Jvala Toranam
- Kalabhairava Jayanti

#### Margashirsha మార్గశిరము

- Margashira Lakshmi Thursdays
- Subrahmanya Shashthi
- Campa Shashthi
- Mitra Saptami
- Gita Jayanti
- Mokshada Ekadashi
- Dattatreya Jayanti
- Margashirsha Purnima
- Annapurna Jayanti
- Dhanurmasa and Tiruppavai begin when solar transition occurs

#### Pushya పుష్యము

- Dhanurmasa Puja and Tiruppavai
- Vaikuntha Ekadashi when it falls in this lunar month
- Bhogi
- Makara Sankranti and Uttarayana
- Goda Ranganatha Kalyanam
- Kanuma and Mukkanuma
- Shakambhari Navaratri and Jayanti where followed
- Shakambhari Purnima
- Sakata Caturthi in North Indian tradition

#### Magha మాఘము

- Magha Snana
- Vasanta Panchami and Sarasvati Puja
- Ratha Saptami or Surya Jayanti
- Bhishmashtami
- Madhva Navami
- Jaya or Bhishma Ekadashi traditions
- Bhishma Panchaka terminology where locally used
- Varaha Dvadashi
- Magha Purnima
- Lalita Jayanti
- Magha Gupta Navaratri

#### Phalguna ఫాల్గుణము

- Vijaya Ekadashi
- Mahashivaratri
- Shiva Parvati Kalyanam
- Amalaki Ekadashi
- Lakshmi Jayanti
- Kama Dahanam
- Holika Dahanam
- Phalguna Purnima
- Holi and Dolotsavam
- Sri Caitanya Mahaprabhu Jayanti
> Month placement can differ between amanta and purnimanta systems. Gregorian dates must be calculated separately for location and sampradaya.

### 5. Core vratam and nomu collections

#### Telugu and South Indian priority collection

| Vratam or nomu | Primary region | Editorial status |
|---|---|---|
| Kalyana Gauri Nomu | Andhra Pradesh and Telangana | Living regional tradition; preserve family variants and verify the nomu padyam separately. |
| Undralla Taddi Nomu | Telugu regions | Regional women’s nomu; source audit required. |
| Polala Amavasya Vratam | Telugu regions | Mothers’ observance for children; distinguish from related Pithori form. |
| Pithori Vratam | Western and parts of South India | Worship connected with sixty-four Yoginis; do not merge automatically with Polala Amavasya. |
| Varalakshmi Vratam | South India | Major living tradition with textual and paddhati sources to be mapped by edition. |
| Mangala Gauri Vratam | South and West India | Shravana Tuesday observance; multi-year form must be separately sourced. |
| Swarna Gauri Vratam | Karnataka and adjoining regions | Regional Gauri vrata. |
| Atla Taddi Nomu | Telugu regions | Regional married-women’s observance. |
| Nagula Cavithi | Telugu regions | Annual naga worship; retain regional procedure. |
| Kedara Gauri Vratam | South India | One-day and extended forms exist; source and duration must be explicit. |
| Kshirabdhi Dvadashi and Tulasi Damodara | South India | Vaishnava household practice; distinguish from Tulasi Vivaha variants. |
| Margashira Lakshmi Varam | Telugu and neighboring regions | Seasonal Thursday series; family rules vary. |
| Kartika Laksha Vatti or 365 wicks | Telugu regions | Living lamp-offering traditions; do not invent fixed universal counts or materials. |
| Nandikeshvara Nomu and Uppu Nomu | Telugu regions | Inventory candidates only until a credible regional source is identified. |

#### Saubhagya and family welfare vratams

- Saubhagya Gauri
- Mangala Gauri
- Varalakshmi
- Swarna Gauri
- Hartalika Gauri
- Kalyana Gauri Nomu
- Atla Taddi
- Undralla Taddi
- Vata Savitri
- Karaka Caturthi or Karva Chauth
- Kedara Gauri
- Uma Maheshvara
- Ashunya Shayana
- Jyeshtha Gauri
- Mahalakshmi sixteen-day vrata

#### Santana and children’s welfare vratams

- Polala Amavasya
- Pithori Vratam
- Jivitputrika or Jiutiya
- Ahoi Ashtami
- Santana Saptami
- Putra Saptami
- Shravana and Pausha Putrada Ekadashi
- Shashthi Devi Vratam
- Skanda or Subrahmanya Shashthi
- Nagula Cavithi
- Naga Panchami

### 6. Fixed count weekday vrata cycles

| Observance | Common cycle | Deity | Source status |
|---|---|---|---|
| Sapta Shanivara Vratam | 7 Saturdays | Sri Venkatesvara | Telugu living tradition; exact textual provenance pending. |
| Ekadasha Somavara Vratam | 11 Mondays | Shiva | Regional vrata-paddhati; verify the exact recension. |
| Shodasha Somavara Vratam | 16 Mondays | Shiva and Parvati | Widely practised; katha and procedure vary by publication. |
| Vaibhava Lakshmi Vratam | Usually 11 or 21 Fridays | Mahalakshmi | Contemporary popular vrata-booklet tradition; do not claim ancient provenance without a located passage. |
| Santoshi Ma Vratam | 16 Fridays | Santoshi Ma | Modern popular devotional practice. |
| Brihaspativara Vratam | 7, 11 or 16 Thursdays | Brihaspati or Vishnu | North and West Indian regional variants. |
| Sai Navaguruvaar Vrat | 9 Thursdays | Shirdi Sai Baba | Modern devotional movement. |
| Durga Mangalavara | Often 9 Tuesdays | Durga | Regional household variants; verify locally. |
| Lakshmi Shukravara | 8, 9, 11 or 16 Fridays | Lakshmi | Multiple regional cycles; no universal number. |
| Hanuman Mangalavara | Often 11 or 21 Tuesdays | Hanuman | North Indian popular tradition. |
| Ganesha Mangalavara | Often 21 Tuesdays | Ganesha | Regional practice. |
| Subrahmanya Mangalavara | Often 6 or 7 Tuesdays | Subrahmanya | South Indian regional practice. |
| Shani Shanivara | 7, 11 or 21 Saturdays | Shanaishcara | Separate from the Venkatesvara Sapta Shanivara form. |

> Counts shown above are inventory labels, not universal prescriptions. Every count, start rule, interruption rule and udyapana must be tied to the source used for that regional version.

### 7. Multi year, seasonal and extended vows

| Observance | Common duration or repetition | Caution |
|---|---|---|
| Mangala Gauri | Shravana Tuesdays; often described as a five-year married-women’s cycle | Verify duration and udyapana by regional paddhati. |
| Ananta Padmanabha | Annual; fourteen-year continuation appears in some traditions | Do not universalize the fourteen-year rule. |
| Kedara Gauri | One-day or extended twenty-one-day form | Store as distinct variants. |
| Caturmasya | Four lunar months | Ascetic and household forms differ materially. |
| Purushottama Masa Vratam | Entire Adhika Masa | Calendar-dependent; source by tradition. |
| Dhanurmasa and Tiruppavai | Solar Dhanurmasa | Especially Sri Vaishnava; daily observance. |
| Kartika Damodara | Entire Kartika | Vaishnava practice. |
| Kartika Shiva observance | Entire Kartika | Shaiva and regional household forms. |
| Navaratri Vratam | Nine nights | Sharad, Vasanta and Gupta forms require separate entries. |
| Bhishma Panchaka | Five days | Vaishnava Kartika conclusion; distinguish local naming. |
| Satyanarayana Vratam | Single or vowed series such as 5 or 11 | Series count is personal or regional, not one universal rule. |

### 8. Diksha and mandala observances

| Diksha | Common duration | Region or tradition | Classification caution |
|---|---|---|---|
| Ayyappa Mandala Vratam | Commonly 41 days | Kerala and pan-South Indian | Initiatory discipline; not merely a katha vrata. |
| Bhavani Diksha | Commonly 41 days | Andhra Pradesh and Telangana | Temple and guru instructions govern details. |
| Hanuman Diksha | Commonly 41 days | Telugu regions | Living regional discipline. |
| Govinda Mala or Venkatesvara Diksha | Varies | Telugu Vaishnava devotion | Temple or lineage rules must be named. |
| Shiva Diksha | Varies | Shaiva traditions | Not a single standardized practice. |

### 9. Parayana disciplines

- Srimad Bhagavata Saptaham
- Ramayana Navaham
- Devi Bhagavata Navaham
- Sundarakanda programs of 9, 11, 21 or 41 days
- Hanuman Chalisa forty-day discipline
- Lalita Sahasranama nine-Friday or forty-one-day programs
- Vishnu Sahasranama mandala recitation
- Sri Sukta sixteen-Friday observance
- Kanakadhara Stotra fixed-day observance
- Dattatreya Guru Caritra Saptaham
- Sai Satcharitra Saptaham
- Sripada Srivallabha Caritamrita Saptaham
> These belong under Parayana Discipline unless a specific authoritative source establishes a formal vrata with sankalpa, restrictions and completion rites.

### 10. Additional classical vrata candidates

The following names belong in the research backlog. Their exact month, tithi, eligibility, procedure and textual locus must be verified before publication.
- Dashavatara Vratam
- Ashoka Ashtami
- Asha Dashami
- Durva Ashtami
- Jivitputrika Vratam
- Shitala Saptami and Shitala Ashtami
- Arogya or Acala Saptami
- Putra and Santana Saptami
- Mahalakshmi Shodasha-dina Vratam
- Varada Caturthi
- Kapila Shashthi
- Surya Shashthi
- Vishnu Panchaka
- Ashunya Shayana Vratam
- Ananga Trayodashi
- Damanaka Caturdashi
- Saubhagya Shayana
- Phala Gauri
- Akhand Dvadashi
- Shravana Dvadashi
- Govinda Dvadashi
- Vamana Dvadashi
- Rama Lakshmana Dvadashi

### 11. Conditional and recurring observances

#### Conditional computed occurrences

- Somavati Amavasya
- Shani Amavasya
- Angaraka Caturthi
- Angaraka Sankatahara Caturthi
- Soma, Bhauma and Shani Pradosha
- Ravi Pushya and Guru Pushya combinations
- Mahadvadashi
- Solar and lunar eclipse observances

#### Recurring collection kept outside the annual parva list

- Ekadashi
- Pradosha
- Sankatahara Caturthi
- Vinayaka Caturthi
- Masa Shivaratri
- Satyanarayana Vratam
- Purnima and Amavasya observances
- Masa Durgashtami
- Kalashtami
- Skanda Shashthi
- Krittika Vratam
- Rohini Vratam
- Monthly Sankranti
- Weekday fasts

### 12. Regional discovery collections

| Region | Priority observances |
|---|---|
| Andhra Pradesh and Telangana | Ugadi; Bonalu; Bathukamma; Kalyana Gauri; Undralla Taddi; Atla Taddi; Polala Amavasya; Nagula Cavithi; Kartika Somavara; Jvala Toranam; Margashira Lakshmi; Subrahmanya Shashthi; Sankranti cycle. |
| Tamil and Sri Vaishnava | Karadaiyan Nombu; Pavai Nonbu; Varalakshmi Nombu; Skanda Shashthi; Sura Samharam; Adi Velli; Karthigai Dipam; Vaikuntha Ekadashi; Goda Ranganatha Kalyanam; Ardra Darshanam; Panguni Uttiram. |
| Karnataka | Swarna Gauri; Bhimana Amavasya or Jyoti Bhimeshvara; Varamahalakshmi; Ananta Padmanabha; Tulasi Puja; Campa Shashthi; Madhva Navami. |
| Kerala | Tiruvathira; Attukal Pongala; Ayyappa Mandala Vratam; naga worship; Karkidaka Vavu observances. |
| North and West India | Karva Chauth; Ahoi Ashtami; Teej; Vata Savitri; Jivitputrika; Shitala; Chhath; Govardhana Puja; Bhai Duj; Sakat Chauth; Holika Dahan. |

### 13. Deity based discovery tags

| Collection | Examples |
|---|---|
| Devi | Navaratri; Varalakshmi; Mangala Gauri; Swarna Gauri; Hartalika; Kalyana Gauri; Atla Taddi; Kedara Gauri; Shakambhari; Lakshmi Friday cycles. |
| Shiva | Somavara cycles; Kartika Somavara; Kedareshvara; Uma Maheshvara; Mahashivaratri; Ardra Darshanam; Kalabhairava Jayanti. |
| Vishnu and avatars | Ekadashi forms; Ananta Padmanabha; Caturmasya; Damodara; Tulasi Vivaha; Rama, Krishna, Narasimha, Vamana, Varaha and other avatara parvas. |
| Ganesha | Vinayaka Cavithi; Sankatahara series; Sakat Caturthi; twenty-one-Tuesday regional cycle. |
| Subrahmanya | Skanda Shashthi; Subrahmanya Shashthi; Sura Samharam; Campa Shashthi; Tuesday cycles. |
| Surya | Ratha Saptami; Surya Jayanti; Arogya Saptami; Mitra Saptami; Sankranti; Chhath. |
| Hanuman | Hanuman Jayanti; Tuesday cycles; Hanuman Diksha; fixed-duration parayana. |
| Venkatesvara | Sapta Shanivara; Govinda Mala; Vaikuntha Ekadashi; Tirumala-linked household traditions. |

### 14. Publication readiness rules

| Status | Meaning | User-facing treatment |
|---|---|---|
| Verified | Text and procedure checked in a named edition. | May be published with full citation and variation notes. |
| Partially verified | Date or existence verified, but vidhi, katha or eligibility remains unresolved. | Publish only verified portions; visibly label variations. |
| Living tradition | Documented regional or household practice without demonstrated classical textual basis. | Present respectfully as regional practice, not universal shastra. |
| Modern devotional | Traceable to a contemporary movement or booklet tradition. | State the contemporary provenance plainly. |
| Research backlog | Name discovered but adequate evidence not yet reviewed. | Do not publish procedural claims. |

### 15. Source works to consult

This is a research map, not a claim that every vrata above appears in every work.
- Caturvarga Cintamani, especially the Vrata-khanda, by Hemadri
- Dharma Sindhu
- Nirnaya Sindhu
- Vrataraja and other identified vrata-paddhati works
- Kritya Kalpataru and related dharma-nibandhas
- Relevant Purana passages located and checked in critical or reputable editions
- Recognized matha and sampradaya publications
- TTD and established temple publications for institution-specific observances
- Identifiable regional Telugu vrata and nomu books, with edition and page recorded
- Oral-history interviews only as evidence of living practice, never as proof of ancient textual origin

### 16. Immediate content priorities for Stuti

1. Kalyana Gauri Nomu
1. Undralla Taddi
1. Polala Amavasya and Pithori as separate entries
1. Sapta Shanivara
1. Ekadasha and Shodasha Somavara as separate entries
1. Vaibhava Lakshmi with contemporary-provenance label
1. Varalakshmi
1. Mangala Gauri including its multi-year variant
1. Kedara Gauri one-day and extended variants
1. Ananta Padmanabha including continuation and udyapana variants
1. Kartika lamp and Damodara observances
1. Ayyappa, Bhavani, Hanuman and Govinda Mala dikshas

### 17. Editorial cautions

- Parva does not automatically mean fasting day.
- A jayanti may use different tithi decision rules from an ordinary vrata.
- Smarta and Vaishnava observance dates may differ; store the decision rule rather than one unexplained date.
- Amanta and purnimanta month labels may differ while the tithi remains the same.
- Women-only, married-women-only and interruption rules must not be asserted without a named source or clearly identified living tradition.
- Health accommodations should be described as practical guidance, not falsely attributed to a text.
- Do not promise guaranteed material outcomes. Phalashruti should be translated in its devotional and textual context.
- Copyrighted modern booklets may be summarized with provenance; do not reproduce them wholesale.

### 18. What this edition does not claim

This inventory is deliberately broader than the verified corpus. It records what Stuti should investigate, but it does not certify every listed count, ritual step or origin. Entries carrying regional, modern or research-backlog status require source work before a complete shastra-vidhi article is released.

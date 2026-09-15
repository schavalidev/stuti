# `stotras/vidhi/` — nitya-karma ritual manuals

**Sandhyāvandana and the daily rites are śākhā-specific. This folder is split by śākhā on
purpose, and the two sides must never be merged, harmonised, or presented as variants of one
text.** They are the practice of different communities.

## `madhyandina/` — North Indian, Vājasaneyi (Śukla-Yajurveda) based

Transcribed 2026-09-08 from Gītā Press, Gorakhpur book code 210 (ISBN 81-293-0220-9), a North
Indian house; the volume's Vedic citations are overwhelmingly Vājasaneyi Saṁhitā. Five files,
102 units. Note the volume also draws several core sandhyā mantras from the **Taittirīya
Āraṇyaka** prapāṭhaka 10 (the Mahānārāyaṇa Upaniṣad) — the prāṇāyāma mantra, `sūryaśca mā
manyuśca`, `āpaḥ punantu`, `agniśca mā manyuśca`, `uttame śikhare`. That is ordinary and not a
defect: TĀ 10 is the shared source of sandhyā mantras across traditions. It does mean these
files are correctly described as *Vājasaneyi-based*, not *Mādhyandina throughout*.

- `01_sandhyopasana_vidhi.txt` — 36 units
- `02_sandhyakala_nirnaya.txt` — 7 units
- `03_tarpana_vidhi.txt` — 39 units
- `04_balivaisvadeva_vidhi.txt` — 14 units
- `05_samkshipta_bhojana_prayoga.txt` — 6 units

Accent: none. Book 210 prints its mantras unaccented, being a householder's āhnika manual
rather than a Veda-pāṭha edition. Accented Mādhyandina text for 31 of the 32 Vājasaneyi mantras
is available from the Uvaṭa–Mahīdhara commentary blocks on sa.wikisource.org should it ever be
added; the Taittirīya Āraṇyaka mantras must NOT be accented from a Taittirīya source while
sitting in this set. See the śākhā and svara rules in the repo-root `CLAUDE.md`.

## `kanva/` — South Indian, Kāṇva (Śukla-Yajurveda), Kātyāyana Sūtra

**This is the other Śukla-Yajurveda. It is not a variant of the `madhyandina/` files above and must
never be merged with them.** The Śukla-Yajurveda has two living śākhās: Mādhyandina in the north,
Kāṇva in the south. Each rite names itself in its own abhivādana, so the distinction is not
inferred — `vājasaneyi mādhyāndinīya śākhādhyāyī` in the Gītā Press volume, `śukla
yajurvedāntargata **kāṇva** śākhādhyāyī kātyāyana sūtraḥ` in this one.

- `01_shukla_yajurveda_sandhyavandanam.txt` — 65 units, written 2026-09-12.

Source: `vignanam.org/devanagari/shukla-yajurveda-sandhya-vandanam.html`, **native accented
Devanāgarī** — so unlike the `taittiriya/` files nothing in the `deva:` column is transliterated
by us. **657 accent marks.** Accent parity with the source was measured rather than assumed: 293
udātta, 360 anudātta and 4 double svarita in, 293, 360 and 4 out, and 26 guttural-nasal sites in,
26 `ग्ं` out. The base text spells that one nasal **seven different ways on a single page**; all
26 are written `ग्ं` here.

Three further witnesses. `stotranidhi.com/shukla-yajurveda-sandhya-vandanam-in-telugu/` carries
the same rite and, with notation collapsed, **agrees with the base text at 99.67%** — which is
evidence of one underlying text rather than of two editorial lineages, and the file says so. The
genuinely independent witnesses are two printed manuals: `shuklayajurveda.org/SandhyaVadhanam.pdf`
and `srimatham.com`'s *Kṛṣṇa & Śukla Yajur Veda Sandhyā vandana* (2015). Both differ in extent,
and the eight differences are itemised in the file and **none is reconciled**.

**No Gītā Press witness applies** — Gītā Press publishes the Mādhyandina rite, and an edition in
the wrong śākhā is not a witness at all. **sanskritdocuments.org's `shuklayajurvedIyasandhyA` is
likewise not a witness to this file**: its own abhivādana declares it Mādhyandina.

**No accented Kāṇva Saṁhitā was reachable anywhere**, so the accent rests on the base text and
its Telugu twin, except for the two aghamarṣaṇa mantras that the text itself cites to Taittirīya
Brāhmaṇa 2.6, which were confirmed mark for mark against that śākhā's own accented pāṭha page.
**The accented Mādhyandina saṁhitā on sa.wikisource.org was deliberately not used**, and that is
the point of the rule.

One thing to know before reading the file: this tradition prints the anusvāra as it is
pronounced, assimilated and hyphenated to the word that follows — `ओ-ङ्केशवाय` for `ओं केशवाय`,
`ॐ-वँन्दे` for `ॐ वन्दे`. That orthography is the source's own and is transcribed exactly, in
`deva:` and `iast:` alike. It is not a defect.

## `taittiriya/` — South Indian, Kṛṣṇa-Yajurveda

- `01_krishna_yajurveda_sandhyavandanam.txt` — 42 units, written 2026-09-09.

Source: `stotranidhi.com/krishna-yajurveda-sandhya-vandanam-in-telugu/` (user's decision,
2026-09-08), collated against the accented Taittirīya Āraṇyaka on sanskritdocuments.org.
Telugu-script only at source, so the Devanāgarī column is transliterated; 29 Latin-`o`-for-
anusvāra defects in the base text were repaired and are itemised in the file.

**Accent: present throughout**, unlike the `madhyandina/` set — accented recitation is normal in
this tradition and the source prints it. 855 accent marks. **The corpus-wide "zero ZWJ" check
must exempt this file's `tel:` field**: its 8 ZWJ are inside `ఓగ్‍ం`, which spells the praṇava
with guttural nasal before spirants, and stripping them would destroy a real recitational
distinction. Devanāgarī spells the same sound `ग्ं`.

- `02_brahma_yajna_vidhi.txt` — 49 units, written 2026-09-12.

Source: `stotranidhi.com/yajurveda-brahma-yagna-vidhi-in-telugu/`, Telugu-script only, so the
Devanāgarī column is transliterated from it by the same block offset as the file above; 24
Latin-`o`-for-anusvāra defects were repaired and are itemised in the file. **Four independent
witnesses, three of them accented:** all 80 of vignanam.org's accented Devanāgarī Taittirīya
Saṁhitā, Brāhmaṇa and Āraṇyaka pāṭha pages (the accent was checked there, mantra by mantra); the
accented Taittirīya Āraṇyaka on sanskritdocuments.org; a second complete printed manual, the
*Brahma Yagnam* booklet at archive.org item `brahma-yagnam`, which confirms the whole order of
service including the tarpaṇa but whose OCR has lost its accent marks; and sa.wikisource's
accented Ṛgveda 1.1 for the Ṛgvedic incipit only. **558 accent marks.** Accent parity with the
source was measured rather than assumed: 134 udātta, 216 anudātta and 25 dīrgha svarita in, 134
216 and 25 out, and 38 nasal-before-spirant sites in, 38 `ग्ं` out.

**No Gītā Press witness applies to this file.** Gītā Press book 210 is Vājasaneyi and discharges
the whole brahmayajña in one instruction — recite the Gāyatrī three times — at
`madhyandina/04_balivaisvadeva_vidhi.txt` unit 9. That is not a shorter version of this rite; it
is the other tradition's rite, and the two are not collated against each other.

Fifteen differences between the witnesses are itemised in the file and **none is reconciled**. The
one worth knowing about: at `हस्ताववनिज्य` the two Āraṇyaka editions agree against the base text on
three accent marks. The base text's printing is kept, because it is a ritual manual quoting the
passage in its own pāṭha and carrying a clause the Āraṇyaka places elsewhere, and the Āraṇyaka's
marks are given in the file so a reciter who follows that pāṭha can find them. The Sāmavedic and
Atharvavedic incipits differ from the Taittirīya forms of the same verses in four and two marks
respectively; **those were not imported**, which is the cross-recension rule doing its work.

Two recension differences from the Mādhyandina set were found and **deliberately not
reconciled**: `जाते` for `देवि` in the Gāyatrī dismissal verse, and `आपो॒ हिष्ठा` as one word
where the north splits `आपो हि ष्ठा`. Both are correct in their own tradition.

- `07_tarpana_vidhi.txt` — 26 units, written 2026-09-15.

The **naimittika** offering of water to the forefathers: the Āpastamba amāvāsyā tila-tarpaṇa, done
on the new moon day and on the śrāddha day, in the Mahālaya fortnight, at the month's saṅkramaṇa
and at an eclipse. Base text the printed booklet *Āpastamba Smārta Amāvāsyai Tarppaṇam*, Bhavani
Book Centre, Madras (archive.org `hzzj_amavasya-tarpanam-apastamba-bhavani-book-center-tamil`),
**read as page images** — its OCR returns no Sanskrit at all. The booklet prints its Sanskrit in
**Tamil script**, which does not distinguish the stop series, so the Devanāgarī of every item the
collating witness also carries is transliterated from the Telugu of
`stotranidhi.com/pitru-tila-tarpanam-in-telugu/` instead, and the file says so.

**vignanam.org's `shraddha-pitru-tarpana-vidhi` page is not a second witness**: it is a machine
transliteration of that stotranidhi page, down to the Telugu ritual instructions rendered letter
for letter into Devanāgarī. The two sites are one lineage. Seven differences between the printed
booklet and the Telugu page are itemised in the file and **none is reconciled**; the largest is
that the booklet says three Vedic ṛcs before the offering to each of the six men and the Telugu
page says none. **161 accent marks**, in six units only, all machine-lifted from vignanam's
accented Taittirīya Saṁhitā and Brāhmaṇa pāṭha. Four of the rite's mantras are in none of the 80
accented Taittirīya pāṭha pages — they belong to the Āpastamba gṛhya mantra collection — and are
therefore given **without marks**; the accented Ṛgveda carries three of them and was deliberately
not used.

**Where the Taittirīya tarpaṇa already lives, so that no session looks for it twice.** This folder
holds three different tarpaṇas and they are not versions of one another:

- The **daily** deva-ṛṣi-pitṛ tarpaṇa of this tradition is **`02_brahma_yajna_vidhi.txt`, units
  42–49**. In the Āpastamba tradition it is the second half of the brahmayajña and is not a
  separate work, which is why there is no separate daily tarpaṇa file here. That, and not `07`, is
  what answers to `madhyandina/03_tarpana_vidhi.txt` for the daily rite.
- The short **sandhyāṅga** tarpaṇa — Sandhyā, Gāyatrī, Brāhmī, Nimṛjī — is
  **`01_krishna_yajurveda_sandhyavandanam.txt`, unit 23**.
- The **naimittika** amāvāsyā tarpaṇa is `07_tarpana_vidhi.txt`.

`samanya/10_pushkara_pitru_tarpanam.txt` holds the Puṣkara form of the rite, with the long list of
further relations that the Telugu witness of `07` also carries and that the printed booklet does
not; it is not repeated in `07`.

Do not populate this folder further by adapting the Mādhyandina files.

## `samanya/` — rites that are not śākhā-specific

**The folder is split by śākhā because sandhyāvandana and the daily rites are śākhā-specific. Not
every rite is.** Where a rite's authority is a Purāṇa or a paddhati rather than a śākhā's own
sūtra, the northern and the southern manuals print the same text because both take it from the
same place, and there is nothing to separate. Those rites go here. **Do not put a rite here
because its śākhā was not established — put it here only when the witnesses show it is common to
both**, and say in the file's header which witnesses those were.

- `01_gayatri_tarpanam.txt` — 6 units, written 2026-09-12.

The offering of water to the Gāyatrī at the end of the morning sandhyā. **Three witnesses, of
three kinds**: `stotranidhi.com/hi/sri-gayatri-tarpanam-in-sanskrit/` as base text; **Gītā Press,
Gorakhpur, *Nitya Karma Pūjā Prakāśa*** (archive.org `nitya-karma-puja-prakash-gita-press-gorakhpur`,
352,169-character OCR with zero Latin noise), which is the authority and which cites
`(देवीभागवत)`; and the **Devī Bhāgavata Mahāpurāṇa skandha 11** itself on sanskritdocuments.org,
verses 20–30, which both manuals name as their source. All three give the same seven Persons, the
same three worlds, the same four measures and **the same ten names in the same order**. Four
differences are itemised in the file; one of them, `स्वर्गलोक` against Gītā Press's `स्वर्लोक`, is
carried into the line in round brackets per the corpus's variant rule. 23 accent marks, all of
them in the closing peace invocation — the tarpaṇa formulae are unaccented in every witness.

**This is not the Gāyatrī tarpaṇa of `../kanva/01_shukla_yajurveda_sandhyavandanam.txt` units
54–57.** That one belongs to the Kāṇva rite and has a different list of names. The two are
separate texts and were not collated against each other.

- `02_bhishmashtami_tarpanam.txt` — 4 units, written 2026-09-12.

The yearly offering of water to Bhīṣma, on Māgha śukla aṣṭamī. Base text
`stotranidhi.com/hi/bheeshma-ashtami-tarpana-slokam-in-hindi/`; collated against **Gītā Press
*Vrata Paricaya*** (archive.org `vrata-parichaya`, 352,169-character OCR, zero Latin noise), whose
entry cites the Dhavala-nibandha. **Gītā Press prints only the third of the three verses**, and its
reading `आबाल्यब्रह्मचारिणे` against the base text's `आजन्मब्रह्मचारिणे` is carried into the line
in round brackets. **Units 1 and 2 rest on the base text alone and the file says so.** Everything
in the `vidhi:` fields about the day, the materials and the direction to face comes from the Gītā
Press entry and is marked there as such. No accent: these are nibandha ślokas, not Vedic mantras.

- `03_bhasma_dharana_vidhi.txt` — 8 units, written 2026-09-12.

The Śaiva rite of wearing sacred ash, performed each morning. Base text
`stotranidhi.com/bhasma-dharana-vidhi-in-telugu/`, **Telugu script only**, so the Devanāgarī is
transliterated by block offset. **Four witnesses, of four kinds.** A second complete manual at
`mahanyasam.com/bhasma-dharana-vidhi/`, which is a real lineage and not a repost — it **adds** the
Upaniṣadic mantra `ओं अग्निरिति भस्म वायुरिति भस्म` that the base text drops and **lacks** two
verses the base text has, and it carries none of the base lineage's defects. The **Mahāmṛtyuñjaya
Stotram** on sanskritdocuments, from the Mārkaṇḍeya and Padma Purāṇas, which carries the whole of
unit 5. The accented **Taittirīya Saṁhitā 1.8.6, Āraṇyaka 10.56 and Brāhmaṇa 1.6.10.4** for the
Mṛtyuñjaya mantra of unit 6, where all fifteen accent marks agree mark for mark. And the
**Sakalāgama-sāra-saṅgraha** in the Institut Français de Pondichéry transcript T0351, an Āgamic
manuscript lineage, which gives a longer form of the verse of unit 4.

**Three corrections, each settled by a named witness and none on judgement alone**: `वाम हसे` →
`वाम हस्ते` from the second manual, and `पीडतं` → `पीडितं` and `तावतस्` → `तावकस्` from the
Mahāmṛtyuñjaya Stotram. **The scriptural root is named in the file**: the Bṛhajjābāla Upaniṣad's
tripuṇḍra-vidhi, where Yājñavalkya answers Janaka, and which is the source of both of this rite's
key phrases — `स एष भस्मज्योतिरिति वै याज्ञवल्क्यः` and `अत एवैषा भूतिर्भूतिकरीत्युक्ता`. Only the
procedure of unit 2 still rests on the two manuals alone.

- `04_karthika_snana_vidhi.txt` — 5 units, written 2026-09-12.

The daily bath through the month of Kārtika. Base text
`stotranidhi.com/kn/karthika-snana-vidhi-in-kannada/`, **Kannada script only** — the Devanāgarī is
transliterated by block offset, and the South Indian short `e` and short `o` do not occur on the
page at all, so no vowel was normalised. **The body of the rite rests on one lineage.** Two things
do not: **Gītā Press *Vrata Paricaya*** witnesses the observance itself, citing Hemādri and the
Madanapārijāta — the thirty-one days, the darbha held at the saṅkalpa, the preference for a river
over a vessel — and everything in the `vidhi:` fields comes from it and is marked there as such;
and the closing verse of unit 5 stands at `../../ganga/05_ganga_kavacam.txt`, which is
sanskritdocuments-sourced from the **Brahmāṇḍa Purāṇa** and is a genuinely independent lineage. It
reads `मुच्यते सर्वपापेभ्यो हरिसायुज्यमाप्नुयात्` where this file reads `मुच्यते सर्व पापाभ्यो
विष्णुलोकं स गच्छति`. **Not reconciled**, and the sibling file was not altered.

## `rigveda/` — Ṛgveda, Āśvalāyana-sūtra, Śākala (Ṛk) śākhā

- `01_rigveda_sandhyavandanam.txt` — 35 units, written 2026-09-09.

Source: `stotranidhi.com/hi/rigveda-sandhya-vandanam-in-sanskrit/` (Devanāgarī) and
`.../rigveda-sandhyavandanam-in-telugu/` (Telugu). **Unlike the Taittirīya page, this one has a
script switcher and a real Devanāgarī edition, so nothing was transliterated by us**; and the
Devanāgarī page was clean — zero Latin-for-anusvāra defects, against 29 on the Telugu Taittirīya
page. Per the sourcing rule the two script pages of one site are **one witness, not two**.

Collated against the **accented Ṛgveda on sa.wikisource.org** (ṚV 10.9 entire, 3.62.10) — an
independent lineage carrying the padapāṭha. All matched including accent placement. **786 accent
marks**; accented from the outset, as in `taittiriya/`.

The śākhā is not inferred: the abhivādana at unit 35 states it — `आश्वलायनसूत्रः ऋक् शाखा`.

Differences from the sibling rites, **deliberately not reconciled**: it splits `आपो हि ष्ठा` into
nine `ओं`-prefixed pādas (with the Mādhyandina, against the Taittirīya) and then works through the
whole nine-ṛc sūkta ṚV 10.9, which neither sibling does; its ācamana names twenty-four forms of
Viṣṇu against their three; it alone has a `पापपुरुष विसर्जनम्` and an `आत्मप्रदक्षिण`; it reads
`आकृ॒ष्णेन॒ रज॑सा` where the Taittirīya reads `आ स॒त्येन॒ रज॑सा`, and `जु॒षस्व॑ मे` where the
Taittirīya reads `जु॒षस्व॑ नः`. It agrees with the Taittirīya in reading `जाते` where the
Mādhyandina reads `देवि`. And it alone gives **every mantra its own viniyoga** — the clearest
mark of the Āśvalāyana manner.

*Warning recorded for future sessions:* **VedaWeb (vedaweb.uni-koeln.de) has been rebuilt as a
JavaScript application.** Its old `/rigveda/api/document/id/...` path now returns the SPA shell
with **HTTP 200** — which looks like success and is not. Its real API is at `/api/` (see
`/api/openapi.json`) and needs chained calls. Wikisource was used instead.

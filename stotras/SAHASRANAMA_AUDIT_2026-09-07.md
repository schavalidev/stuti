# Sahasranāma corpus — full re-audit, 2026-09-07

**Supersedes the coverage claims in `SAHASRANAMA_TRACKING.md` (2026-08-25).** That audit was
built almost entirely on stotranidhi.com and undercounted the available corpus by roughly 7x.
This re-audit was prompted by a correct challenge: stotranidhi is not the only source.

## Method and sources

| Source | Sahasranāma texts found | Notes |
|---|---:|---|
| **sanskritdocuments.org** | **246** | Dedicated `/sanskrit/sahasranama/` index. Each entry carries a source attribution in its title metadata (Purāṇa / Tantra / named author). 148 of them link archive.org or scanned-book references, i.e. are checkable against printed editions. |
| stotranidhi.com | 31 | `tag/sahasranamam-en` across all pages. The basis of the 2026-08-25 audit. |
| vignanam.org | 43 | Serves its sahasranāma pages, but blocks its pūjā/nyāsa pages (HTTP 202 / S3 AccessDenied). |

Attributions below are as published in the sanskritdocuments index metadata. They have **not**
each been verified against the primary colophon — that is the next step, not a claim made here.
The distinction matters because the previous audit's failure was precisely over-confident
verdicts from thin sourcing.

## Verdict corrections

These contradict `SAHASRANAMA_TRACKING.md` directly.

| Deity | 2026-08-25 verdict | What sanskritdocuments actually holds |
|---|---|---|
| **Ayyappa** | ❌ "zero Puranic/Tantric attribution... signature of a modern compilation" | **3 texts**: `dharmashAstAsahasranAmastotram`, `shAstRRishavarNasahasranAmastotram` (scan-ref), `hariharaputrasahasranAmAbhiShekamantram`. Dharmaśāstā and Hariharaputra are both Ayyappa. Verdict unsafe. |
| **Śani** | ❌ "real text but colophon names **no** source at all" | `shanaishcharasahasranAmastotram`, **with a scan reference** — so a printed edition exists to check. Verdict needs redoing. |
| **Lalitā** | ✅ "Single canonical version, well-attested" | **4+ distinct recensions**: Brahmāṇḍa Purāṇa (and a `sampūrṇa` incl. pūrvapīṭhikā + phalaśruti), **Bṛhannāradīya Purāṇa**, **Mahābhāgavata Upapurāṇa** (Śiva-kṛta, as Śailaputrī–Kālī), plus a Nārada Purāṇa text. "Single version" is wrong. |
| **Śiva** | ✅ 2 verified; "commentators cite up to 8 variants (Padma/Skanda/Vāyu/Brahmāṇḍa/Rudrayāmala) — only the 2 above independently verified" | **Every one of those "unverified" variants is present as a primary text**, most with scan refs: Vāyu Purāṇa adhy. 30, Vedasāra/Padma Purāṇa, Skanda Purāṇa (×2), Rudrayāmala, plus Śiva Purāṇa, Liṅga Purāṇa (sārtha), Saura Purāṇa, Mahābhāgavata adhy. 67, and **four** separate Śivarahasya sections. ~12 Śiva-proper recensions. |
| **Viṣṇu** | ✅ Mahābhārata + "a distinct Garuḍa Purāṇa variant" | **6 numbered recensions**: Mahābhārata, Padma, Garuḍa, Nārada Pañcarātra, Skanda, and a *vivarṇādi* variant. |
| **Gaṇeśa** | ✅ 2 texts (Gaṇeśa Purāṇa + Gakārādi) | **9**, incl. `mahAgaNapatisahasranAmastotraM sabhAShyam` — the Bhāskararāya Dīkṣita commentary the old audit mentioned but never counted — plus Ucchiṣṭa-Gaṇapati (×2), Guhyanāma-Ucchiṣṭa (Uḍḍāmareśvara), Śāradeśa (Vināyaka Tantra). |
| **Sūrya** | ✅ 1 (Bhaviṣya Purāṇa) | **3**: Bhaviṣya, Rudrayāmala/Devīrahasya, Skanda. |
| **Rāma** | ✅ 1 (Ānanda Rāmāyaṇa) | **6 numbered + a laghu variant**, incl. Bhuśuṇḍi Rāmāyaṇa and a Brahmayāmala *rakārādi*. Also **Lakṣmaṇa** and **Sarayū** sahasranāmas — deities the audit never listed. |
| **Sītā** | ✅ 1 (Adbhuta Rāmāyaṇa) | **3** (+ Bhuśuṇḍi Rāmāyaṇa, a *sakārādi*), plus **Jānakī** ×2 tracked separately. |
| **Gaṅgā** | ✅ 1 (Skanda, Kāśī-khaṇḍa) | **3**: Skanda ×2 (incl. Kedāra-khaṇḍa) and Bṛhaddharma Purāṇa. |
| **Durgā** | ✅ 2 | **6+**: Skanda/Pārvatī, Tantrarāja, Rudrayāmala, dakārādi/Kulārṇava, *trijaganmātā*, Saptaśatī. |
| **Hanumān** | ⚠ "weak pedigree — Parāśara Saṁhitā, obscure" | `hanumatsahasranAmastotram` attributed to **Rudrayāmala**, a recognised tantra. Pedigree is stronger than recorded. |

### Verdicts the old audit got right (confirmed, do not revisit)

- **Indra** — modern: `indrasahasranAmastotram (gaNapatimunivirachitam)` confirms Vasiṣṭha Gaṇapati Muni.
- **Agni** — modern: `agnisahasranAmastotram (sAmbadIkShitena saṅkalitam)` confirms Samba Dīkṣita as compiler.
- **Rāghavēndra** — modern: `(sondura shrIkR^iShNa avadhUta virachitam)` confirms the named author.
- **Kamalā is not independent** — sanskritdocuments files it as one text: `mahAlakShmIsahasranAmastotram athavA kamalAsahasranAmastotram`. The "do not author as a distinct text" call stands.
- **Mīnākṣī** — no dedicated sahasranāma appears in the index. (`mUkAmbikA divyasahasranAmastotram` is a different deity.)

## Deities entirely absent from the old audit

Present on sanskritdocuments, never tracked: Indrākṣī, Umā, Kubjikā, Kumārī, Kuṇḍalinī,
Jvālāmukhī, Turajā/Tuḷajā, Narmadā (×2), Nigraheśvarī, Padmāvatī (×2), Parvatavardhinī,
Manasādevī, Mahāmārī, Mahārājñī/Rājarājeśvarī, Mahālasā, Mūkāmbikā, Yamunā/Kālindī,
Yoganāyikā, Yogeśvarī, Rādhā (×3), Rādhā-Kṛṣṇa, Rādhikā, Rukmiṇī, Reṇukā, Vallī,
Vāsavī Kanyakā Parameśvarī (×3), Śākambharī, Śivakāmasundarī (×2), Saṅkaṭā, Chandralā,
Guhyakālī, Kāmakalākālī, Brahmalekhinī, Śāradā, Śārikā, Vāgvādinī, Vāgmatī, Devasenā,
Lakṣmaṇa, Sarayū, Kedāra, Mallāri, Mṛtyuñjaya, Ardhanārīśvara, Aghoramūrti,
Śaṅkaranārāyaṇa, Gorakṣa, Datta (dakārādi + 2 more), Garuḍa, Balarāma, Vaṭhṭhala,
Guruvāyūrappan, Paraśurāma, plus Jaina (Jina ×4, Pārśvanātha) and Gauḍīya
(Kṛṣṇa-Caitanya ×3, Gaurāṅga, Nimbārka) sahasranāmas.

## Ritual apparatus — the finding that triggered this audit

The 2026-09-05 coverage matrix claimed pañcapūjā was Śākta-only and that Viṣṇu's nyāsa was
limited to an *uttaranyāsa*. Both were artefacts of reading one source.

`sanskritdocuments.org/doc_vishhnu/vsahasranew.html` carries a **full nyāsa apparatus that
stotranidhi omits entirely**:

- पूर्वन्यासः (pūrvanyāsa) · ऋष्यादिन्यासः · **करन्यासः** (finger assignments) ·
  **षडङ्गन्यासः** (hṛdaya / śiras / śikhā / kavaca / netra / astra, each keyed to a name
  drawn from the hymn) · उत्तरन्यासः

`doc_devii/lalitacomplete.html` carries the complete set including पञ्चपूजा and परिकल्पयामि.
For **Gaṇeśa**, viniyoga is confirmed but nyāsa is **not** — the apparent hit is inside a verse
(विना न्यासं विना जपम्, "without nyāsa, without japa"), so that remains genuinely open.

## Consequence for authoring

1. The Viṣṇu Sahasranāma file is being **rebuilt wholly on sanskritdocuments** so that verse
   text and ritual apparatus share one recension (decision, 2026-09-07).
2. `SAHASRANAMA_TRACKING.md`'s "~26 solid texts / ~34 counting multi-version deities" figure
   should be treated as retired. The real figure across sources is in the low hundreds.
3. Attribution verification against primary colophons is **still outstanding** for all 246.

---

## Full inventory — sanskritdocuments.org

`*` = entry links an archive.org / scanned-book reference.

### Viṣṇu & his forms (Kṛṣṇa, Nṛsiṁha, Gopāla, Veṅkaṭeśa, Sudarśana, Varāha, Hayagrīva, Puruṣottama) — 29

| | Text (attribution as indexed) |
|---|---|
| * | gopAladivyasahasranAmastotram (shANDilyasaMhitAntargatam shrIkR^iShNaH sachchidAnando) |
| * | gopAlasahasranAmastotram |
|  | gopAlasahasranAmastotram 2 athavA bAlakR^iShNasahasranAmastotram (nAradapa~ncharAtrAntargatam) |
|  | guruvAyurappan athavA nArAyaNIya tathA rogaharasahasranAmastotram |
| * | harisahasranAmastotram sarvama~Ngalastotram (shatAnandamunivirachitam) |
|  | hayagrIvasahasranAmastotram |
| * | kR^iShNanArAyaNanAmasahasrastotram (lakShmInArAyaNIyasaMhitAntargatam) |
| * | kR^iShNasahasranAmastotram (gargasaMhitAntargatam harirdevakInandanaH) |
|  | kR^iShNasahasranAmastotram (sAtvatatantrAntargatam) |
|  | kR^iShNasahasranAmastotram (viShNudharmottarAntargatam) |
| * | kRRiShNasahasranAmastotram kakArAdi (brahmANDapurANAntargatam) |
|  | lakShmInR^isi.nhasahasranAmAvalI |
|  | nArAyaNasahasranAmastotram (lakShmInArAyaNIyasaMhitAyAntargatam) |
| * | nR^isiMhasahasranAmastotram athavA divyalakShmInR^isiMhasahasranAmastotram (OM namo nArasiMhAya vajradaMShTrAya vajriNe) |
|  | parashurAmasahasranAmastotram (agnipurANAntargatam) |
| * | puruShottamasahasranAmastotram (shivarAj~nIshrIkR^itaM lakShmInArAyaNIyasaMhitAntargatam) |
| * | puruShottamasahasranAmastotram (vallabhAchAryavirachitam) |
| * | shrIkR^iShNasahasranAmastotram (svAmIIshvarAnandasarasvatI virachitam, rAdhikeshaM jagannAthaM mohanaM vanamAlinam) |
|  | sudarshanasahasranAmastotram (vihageshvarasaMhitAntargatam) |
| * | sudarshanasahasranAmastotram 2 (ahirbudhnyasaMhitAntargatam) |
| * | varAhasahasranAmastotram |
|  | ve~NkaTeshasahasranAmastotram (ve~NkaTesho virUpAkSho vishvesho vishvabhAvanaH) |
| * | viShNusahasranAmastotram 1 (mahAbhAratAntargatam) |
| * | viShNusahasranAmastotram 2 vAsudevasahasranAmastotram cha (padmapurANAntargatam) |
| * | viShNusahasranAmastotram 3 (garuDapurANAntargatam) |
|  | viShNusahasranAmastotram 4 (nAradapa~ncharAtrAntargatam) |
| * | viShNusahasranAmastotram 5 (skandapurANAntargatam) |
| * | viShNusahasranAmastotram 6 vivarNAdi |
|  | viThThalasahasranAmastotram |

### Śiva & his forms (Rudra, Bhairava, Dakṣiṇāmūrti, Naṭarāja, Mahākāla, Śarabha, Vīrabhadra) — 45

| | Text (attribution as indexed) |
|---|---|
| * | aghoramUrtisahasranAmastotram 1 |
|  | ardhanArIshvarasahasranAmastotram 1 |
| * | baTukabhairavasahasranAmastotram 1-1 (bhairavatantrAntargatam baTukaH kAmado nAtho.anAthapriyaH prabhAkaraH) |
| * | baTukabhairavasahasranAmastotram 1-2 (bhairavatantrAntargatam OM hrIM baTukaH kAmado nAtho.anAthapriyaprabhAkaraH) |
| * | baTukabhairavasahasranAmastotram 2-1 (rudrayAmAlAntargatam namo bhairavarUpAya) |
| * | baTukabhairavasahasranAmastotram 2-2 (rudrayAmaloktaM OM namo bhairavarUpAya bhairavAya namo namaH) |
| * | baTukabhairavasahasranAmastotram 3 bakArAdi (bhairavayAmalatantrAntargatam OM baM baM baM baTuko vIro) |
| * | baTukabhairavasahasranAmastotram 4 (bR^ihajjyotiShArNave baTuko baTukAdhIsho vaTaprItirvaTeshayaH) |
| * | baTukabhairavasahasranAmAvaliH 1-2 (bhairavatantrokta OM hrIM baTukAya kAmadAya nAthAya anAthapriyAya) |
|  | baTukabhairavasahasranAmAvaliH 3 bakArAdi (bhairavayAmalatantrAntargatA baM baM baM baTukavIrAya bAM bAM bAM baTukAya) |
| * | dakShiNAmUrtisahasranAmastotram 1 (chidambaranaTanatantrAntargatam dakShiNo dakShiNAmUrtirdayAlurdInavallabhaH) |
| * | dakShiNAmUrtisahasranAmastotram 2 (Adidevo dayAsindhurakhilAgamadeshikaH) |
|  | hAkinIshvarAShTottarasahasranAmastotram paranAthAShTottarasahasranAmastotram |
|  | kAlabhairavasahasranAmastotram athavA svarNAkarShaNabhairavasahasranAmastotram (uDDAmaratantrAntargatam) |
| * | kedArasahasranAmastotram (brahmANDapurANAntargatam) |
| * | mahAkAlasahasranAmastotram 1 (prakR^iShTanandoktAgam mahAkAlo mahArUpo mahAdevo maheshvaraH) |
|  | mahAkAlasahasranAmastotram 2 (vishvasAratantrAntargatam mahAkAlo bhairavesho) |
| * | mahAkAlasahasranAmastotram 3 (shivAgamakalpAntargatam mahAkAlo mahAdevo mahAkAyo mahAtapaH) |
| * | mallArisahasranAmastotram |
| * | medhAdakShiNAmUrtisahasranAmastotram 1 (devadevo mahAdevo) |
| * | mR^ityu~njayasahasranAmastotram |
| * | naTarAjaku~nchitapAdasahasranAmastotram |
|  | naTeshasahasranAmastotram athavA chidambara naTarAja sahasranAmastotram |
|  | naTeshasahasranAmastotrasya uttarapIThikA |
|  | rudrasahasranAmastotram (bhR^i~NgiriTisaMhitAyAm) |
| * | rudrasahasranAmastotram 2 (li~NgapurANAntargatam) |
|  | sharabhasahasranAmastotram 1 sharabhasAluvapakShirAjasahasranAma (AkAshabhairavakalpAntargatam shrIM shrIM siddhIshvaraH) |
|  | sharabhasahasranAmastotram 2 (sharabhatantrAntargatam hariharavirachitam sarvabhUtAtmabhUtasya) |
| * | sharabhasahasranAmastotram 3 (AkAshabhairavatantrAntargatam shrI nAtho reNukAnAtho) |
| * | sha~NkaranArAyaNasahasranAmastotram (skAndapurANe sahyAdrikhaNDe) |
| * | shivasahasranAmastotram (AdisheShakR^itaM shivarahasyAntargatam navamAMshe adhyAya 2 ga~NgAdharo.andhakaripuH pinAkI pramathAdhipan) |
| * | shivasahasranAmastotram (bhagIrathaproktam mahAbhAgavatAntargatam adhyAyaH 67 namaste pArvatInAtha devadeva parAtpara) |
| * | shivasahasranAmastotram (mahAbhAratAntargatam sthiraH sthANuH prabhurbhImaH) |
| * | shivasahasranAmastotram (sArtham li~NgapurANAntargatam bhavaH shivo haro rudraH) |
| * | shivasahasranAmastotram (saurapurANAntargatam bhavaH shivo haro rudraH puShkalo mugdhalochanaH) |
|  | shivasahasranAmastotram (shivapurANAntargatam shivo haro mR^iDo rudraH) |
| * | shivasahasranAmastotram (shivarahasyAntargatam dvAdashAMshe adhyAyaH 24 o~NkArakaNThanilayaH o~NkArArthaprakAshakR^it) |
| * | shivasahasranAmastotram (shivarahasyAntargatam hiraNyabAhuH senAnIH) |
| * | shivasahasranAmastotram (shivarahasyAntargatam pa~nchamAMshe adhyAyaH 40 OMkAranilayAtmasthaH OMkArArthaikavAchakaH) |
|  | shivasahasranAmastotram (skandamahApurANAntargatam 1 harashshambhurmahAdevo nIlakaNThassadAshivaH) |
|  | shivasahasranAmastotram (skandapurANAntargataM shrIshivaH shivado bhavyo) |
| * | shivasahasranAmastotram (vAyupurANAntargataM adhyAya 30 namaste devadevesha devAribalasUdana) |
| * | shivasahasranAmastotram sha~Nkarakavacham cha (vedasAra padmapurANAntargatam namaH parAya devAya sha~NkarAya mahAtmane) |
| * | shivAShTottarasahasranAmastotram (shivarahasyAntargatam) |
|  | vIrabhadrasahasranAmastotram |

### Devī / Śākta — 110

| | Text (attribution as indexed) |
|---|---|
| * | annapUrNAsahasranAmastotram (rudrayAmalAntargatam) |
| * | bAlAsahasranAmastotram 1 (viShNuyAmalAntargatam subhagA sundarI saumyA) |
| * | bAlAtripurasundarIsahasranAmastotram 1 bakArAdi (mahottarayoginIvidyA shrIbAlA bAlinI bAlI) |
|  | bAlAtripurasundarIsahasranAmastotram 2 (rudrayAmalAntargatam) |
| * | bhadrakAlI mantranAmasahasranAmastotram (bhairavatantrAntargatam) |
| * | bhavAnIsahasranAmastotram |
| * | bhuvaneshvarIbhakArAdisahasranAmastotram |
|  | bhuvaneshvarImantragarbhanAmasahasrakam |
| * | bhuvaneshvarIsahasranAmastotram (rudrayAmalatantrAntargatam) |
|  | brahmalekhinIsahasranAmastotram (parakR^iShNayamale shrIrahasyanAmasahasrakam) |
| * | chandralAsahasranAmastotram (sArtham Marathi, skandapurANAntaragatam) |
| * | ChinnamastAsahasranAmastotram athavA shrIprachaNDachaNDikAsahasranAmAastotram (vishvasAratantrAntargatam) |
| * | dakShiNakAlikAsahasranAmastotram (shyAmArahasyAntargatam) |
|  | devI vA pArvatI sahasranAmastotram (kUrmapurANAntargatam) |
| * | devIsahasranAmastotram (kUrmapurANAntargatam) |
|  | dhUmAvatIsahasranAmastotram |
| * | durgA dakArAdisahasranAmastotram (kulArNavatantrAntargatam) |
| * | durgAsahasranAmastotram 1 pArvatIsahasranAmastotram (skandapurANAntargatam shivA.athomA ramA) |
|  | durgAsahasranAmastotram 2 (tantrarAjatantrArgatam shrIdurgA durgatiharA) |
| * | durgAsahasranAmastotram 3 (shrIdurgA trijaganmAtA) |
| * | durgAsahasranAmastotram 4 (rudrayAmalAntargatam OM hrIM duM jagadambA) |
| * | durgAsaptashatIsahasranAmastotram |
|  | gAyatrIsahasranAmastotram 1-1 divyasahasranAmastotraM (rudrayAmalAntargataM tatkArarUpA tattvaj~nA) |
|  | gAyatrIsahasranAmastotram 1-2 divyasahasranAmastotraM pUrvapIThikA phalashrutisahitam sahitam (rudrayAmalAntargataM tatkArarUpA tattvaj~nA) |
| * | gAyatrIsahasranAmastotram 2 (devIbhAgavatAntargatam achintyalakShaNAvyaktA) |
| * | ga~NgAsahasranAmastotram 1 (skandapurANAntargatam) |
| * | ga~NgAsahasranAmastotram 2 (bR^ihaddharmapurANAntargatam) |
| * | ga~NgAsahasranAmastotram 3 (skandapurANAntargatam kedArakhaNDa ga~NgA saridvarA viShNupAdAmbujajaniH) |
|  | gosahasranAmastotram (swAmirAmabhadrAchAryavirachitam) |
| * | guhyakAlIsahasranAmastotram (mahAkAlasaMhitAyAM) |
|  | hAkinIsahasranAmastotram |
| * | indrAkShIsahasranAmastotram (rudrayAmAlAntargatam) |
| * | jAnakI sahasranAmastotram 1 (sArtham shrIjAnakIcharitAmR^ite saptAshItitamo.adhyAyaH) |
| * | jAnakI sahasranAmastotram 1 (shrIjAnakIcharitAmR^ite saptAshItitamo.adhyAyaH) |
|  | jAnakIsahasranAmastotram 2 (siddheshvarItantrAntargatam jAnakI kamalA vidyA siddhavidyA kShamAtmajA) |
| * | jayayuktadevIsahasranAmastotram |
| * | jvAlAmukhIsahasranAmastotram |
| * | kakArAdi kAlIsahasranAmastotram |
|  | kAkinyaShTottarasahasranAmastotram |
|  | kAlIsahasranAmastotram (bR^ihannIlatantrAntargatam) |
|  | kAlIsahasranAmastotram athavA bhadrakAlIsahasranAmastotram (kAlikAkulasarvasvAntargatam) |
| * | kAmakalAkAlIsahasranAmastotram (mahAkAlasaMhitAyAM) |
| * | kubjikAsahasranAmastotram (bhairavakR^ite) |
|  | kumArIsahasranAmastotram |
|  | kuNDalinIsahasranAmastotram |
|  | lAkinIsahasranAmastotram |
|  | lakShmIsahasranAmastotram (skandapurANAntargatam) |
| * | lakShmIsahasranAmastotram 1 |
| * | lakShmIsahasranAmastotram 2 (nAradIyopapurANAntargatam) |
| * | lalitAsahasranAmastotram 1 (brahmANDapurANAntargatam OM shrImAtA shrImahArAj~nI) |
| * | lalitAsahasranAmastotram 1 sampUrNa (pUrvapIThikA phalashruti sahitam shrImAtA shrImahArAj~nI) |
|  | lalitAsahasranAmastotram 2 (bR^ihannAradIyapurANAntargatam OM lalitA chApi vA kAmeshvarI) |
| * | lalitAsahasranAmastotram 3 shailaputrI kAlI cha sahasranAmastotram (shivakR^itam mahAbhAgavataupapurANAntargatam anAdyA paramA vidyA) |
|  | mahAkulakuNDalinIsahasranAmastotram |
| * | mahAlakShmIsahasranAmastotram athavA kamalAsahasranAmastotram |
|  | mahAlasAsahasranAmastotram |
| * | mahAmArIsahasranAmastotram |
| * | mahArAj~nIsahasranAmastotram athavA rAjarAjeshvarIsahasranAmastotram (rudrayAmalAntargatam) |
| * | mahAsarasvatIsahasranAmastotram 1 sarasvatIsahasranAmastotram 1 (vAgvANI varadA vandyA) |
| * | mahAsarasvatIsahasranAmastotram 2 sarasvatIsahasranAmastotram 2 (hrIM aiM hrIM mahAvANI) |
|  | mahAtripurasundarIsahasranAmastotram |
|  | manasAdevIsahasranAmastotram (manasAtantre pa~nchamapaTale) |
|  | mAta~NgIsahasranAmastotram |
|  | mUkAmbikA divyasahasranAmastotram |
|  | narmadAsahasranAmastotram 1 (narmadA namanIyA) |
| * | narmadAsahasranAmastotram 2 (narmadA nAgakanyA) |
| * | nigraheshvarIsahasranAmastotram (bhAgavatAnandaguruNA proktam) |
| * | padmAvatIsahasranAmastotram 1 (padmAvatI padmavarNA padmahastApi padmanI) |
|  | padmAvatIsahasranAmastotram 2 (devIyAmalatantrAntargatam hrIM shrIM klIM blUM nAgI nAgarAjopasevitA) |
|  | parabrahmashakti athavA parashaktisahasranAmastotram |
| * | parvatavardhinIsahasranAmastotram |
| * | pArvatIsahasranAmastotram (kUrmapurANAntargatam) |
|  | pItAmbarIsahasranAmastotram athavA bagalAmukhIsahasranAmastotram |
| * | pratya~NgirAsahasranAmastotram |
| * | rAdhAkR^iShNasahasranAmastotram rAdhAkR^iShNayugalasahasranAmastotram (bR^ihannAradIyapurANAntargatam devakInandanaH shauriH) |
|  | rAdhAsahasranAmastotram 1 (rAdhAmAnasatantrAntargataM anantarUpiNI rAdhA) |
| * | rAdhAsahasranAmastotram 2 (rudrayAmalAntargatam shrIrAdhArAdhikA.a.arAdhyA) |
|  | rAdhikAsahasranAmastotram (nAradapa~ncharAtrAntargatam)) |
|  | rAkiNIkeshavasahasranAmastotram |
| * | reNukAsahasranAmastotram (padmapurANAntargatam, reNukAtantrAntargatam) |
|  | rukmiNIsahasranAmastotram (skandapurANAntargatam) |
| * | sa~NkaTAsahasranAmastotram (mahAkAlasaMhitAntargatam) |
|  | shAkambharI athavA vanasha~NkarI sahasranAmastotram (skandapurANAntargatam) |
|  | shAkinIsadAshivastavanama~NgalAShTottarasahasranAmastotram |
| * | shAradAsahasranAmastotram shAradAsahasranAmastavarAjaH (rudrayAmalAntargataH) |
|  | shArikAsahasranAmastotram (rudrayAmalAntargatam) |
| * | shivakAmasundarIsahasranAmastotram 1 (bhR^i~NgiriTisaMhitAyAM) |
| * | shivakAmasundarIsahasranAmastotram 2 (rudrayAmalAntargartam) |
|  | ShoDashIsahasranAmastotram |
| * | shyAmalAsahasranAmastotram (saubhAgyalakShmIkalpAntargatam) |
| * | sItAsahasranAmastotram 1 (adbhutarAmAyaNAntargatam sItomA paramA) |
| * | sItAsahasranAmastotram 2 (bhushuNDIrAmAyaNAntargatam yA shrIretasya sahajA sItA) |
| * | sItAsahasranAmastotram 3 sakArAdi |
| * | tArAsahasranAmastotram 1 takArAdi (brahmayAmalAntargatam tArA tArAdipa~nchArNA) |
|  | tArAsahasranAmastotram 2 (bR^ihannIlatantrAntargatam) |
|  | tArAsahasranAmastotram 3 (akShobhyasa.nhitAyAM tArA strIhR^idayamahAtArA) |
|  | tripurabhairavIsahasranAmastotram |
|  | turajAsahasranAmastotram athavA tulajA tuLajAsahasranAmastotram (skandapurANAntargatam) |
|  | umAsahasram (gaNapatimunivirachitam) |
| * | umAsahasranAmastotram |
| * | vAgmatisahasranAmastotram (skandapurANe himavatkhaNDAntargatam) |
|  | vAgvAdinIsahasranAmastotoram (bhaviShyottarapurANAntargatam) |
|  | vallIsahasranAmastotram |
| * | vArAhIsahasranAmastotram (uDDAmaratantrAntargatam) |
|  | vAsavIkanyakAparameshvarIsahasranAmastotram |
|  | vAsavIkanyakAparameshvarIsahasranAmastotram 2 |
|  | vAsavIkanyakAparameshvarIsahasranAmastotram 3 |
|  | yamunAsahasranAmastotram kAlindIsahasranAmam cha (gargasaMhitAtaH) |
| * | yoganAyikAsahasranAmastotram athavA rAjarAjeshvarIsahasranAmastotram |
|  | yogeshvarIsahasranAmastotram |

### Gaṇeśa — 9

| | Text (attribution as indexed) |
|---|---|
| * | gakArAdigaNapatisahasranAmastotram (rudrayAmalAntargatam) |
| * | guhyanAmauchChiShTagaNeshasahasranAmastotram (uDDAmareshvaratantrAntargatam) |
|  | guhyanAmauchChiShTagaNeshasahasranAmastotrasya pUrvapIThikA evaM phalashrutiH (uDDAmareshvaratantrAntargatA) |
| * | mahAgaNapatisahasranAmastotram 1 gaNeshadivyasahasranAmAmR^itastotram (gaNeshapurANAntargatam gaNeshvaro gaNakrIDo) |
| * | mahAgaNapatisahasranAmastotram 2 varadagaNeshasahasranAmastotram (rudrayAmalAntargatam OM hrIM shrIM klIM gaNAdhyakSho glauM gaM gaNapatirguNI) |
| * | mahAgaNapatisahasranAmastotraM sabhAShyam (bhAskararAyadIkShita praNItam) |
|  | shAradeshasahasranAmastotram (vinAyakatantrAntargatam) |
| * | uchChiShTagaNapatisahasranAmastotram 1 (rudrayAmalAntargatam, uchChiShTagaNapatipa~nchA~NgAntargatam) |
| * | uchChiShTagaNapatisahasranAmastotram 2 (rudrayAmalAntargatam, mantramahArNavAntargatam) |

### Rāma & Rāmāyaṇa figures (incl. Lakṣmaṇa, Sarayū) — 9

| | Text (attribution as indexed) |
|---|---|
| * | lakShmaNasahasranAmastotram (bhushuNDIrAmAyaNAntargatam) |
| * | rAmasahasranAmastotram 1 (AnandarAmAyaNAntargatam rAmaH shrImAn) |
| * | rAmasahasranAmastotram 1 laghu (AnandarAmAyaNAntargatam rAmaH shrImAn) |
|  | rAmasahasranAmastotram 2 (divAkaraghaisAsavirachitam AryashreShTho) |
| * | rAmasahasranAmastotram 3 (akArAdij~nakArAnta anAdiradhivAsaH) |
| * | rAmasahasranAmastotram 4 (bhushuNDIrAmAyaNAntargatam) |
| * | rAmasahasranAmastotram 5 rakArAtmakam athavA rakArAdi (brahmayAmalatantrAntargatam rAmo rAmakaro dIpto/dIrgho) |
| * | rAmasahasranAmastotrama 6 (svAmIjayarAmadevavirachitam lIlAvatAriNaM pUrNaM brahma brahmAdivanditam) |
| * | sarayUsahasranAmastotram (bhushuNDIrAmAyaNAntargatam) |

### Subrahmaṇya / Skanda (incl. Devasenā) — 7

| | Text (attribution as indexed) |
|---|---|
|  | devasenAsahasranAmastotram |
| * | kumArasahasranAmastotram athavA kArtikeyasahasranAmastotram (kumAraH kavachI kandaH) |
|  | kumArasubrahmaNyamUrtisahasranAmastotram |
| * | skandasahasranAmastotram (devaiH kR^itaM shivarahasyAntargatam) |
| * | subrahmaNyasahasranAmastotram 1 (mArkaNDeyaproktam subrahmaNyaH sureshAnaH surArikulanAshanaH) |
| * | subrahmaNyasahasranAmastotram 2 shrIsubrahmaNyamAtRRikAmalikAsahasranAmastotraM (skandapurANAntargatam achintyashaktiranaghastvakShobhyastvaparAjitaH) |
|  | subrahmaNyasahasranAmastotram nAmAvaliH 2 subrahmaNya mAtR^ikAmAlikA sahasranAmastotram (achintyashaktiranaghastvakShobhyastvaparAjitaH) |

### Navagraha (Sūrya, Śani) — 4

| | Text (attribution as indexed) |
|---|---|
| * | shanaishcharasahasranAmastotram |
| * | sUryasahasranAmastotram 1 (bhaviShyapurANAntargatam vishvavidvishvajitkartA) |
| * | sUryasahasranAmastotram 2 (rudrayAmalatantre devIrahasye savitA bhAskaro bhagaH) |
|  | sUryasahasranAmastotram 3 (skandapurANAntargatam AdityashchAdidevo.ayam) |

### Hanumān — 2

| | Text (attribution as indexed) |
|---|---|
|  | A~njaneyasahasranAmastotram hanumatsahasranAmastotram cha |
|  | hanumatsahasranAmastotram (rudrayAmalAntargartam) |

### Other deities, saints & sampradāya figures — 31

| | Text (attribution as indexed) |
|---|---|
|  | agnisahasranAmastotram (sAmbadIkShitena sa~Nkalitam) |
|  | akkalakoTasvAmIsamarthasahasranAmastotraM marAThI (nAgesha kara.mbeLakaravirachitam) |
|  | balarAmasahasranAmastotram (gargasaMhitAntargartam) |
| * | chandrashekharendrasarasvatI sahasranAmastotram nAmAvalI |
|  | dakArAdi shrI dattasahasranAmastotram |
| * | dattasahasranAmastotram 2 |
|  | dattasahasranAmastotram 3 |
|  | dharmashAstAsahasranAmastotram |
|  | gakArAdigorakShasahasranAmastotram |
|  | garuDasahasranAmastotram (shrIkR^iShNabhaTTAchAryavirachitam) |
| * | gaurA~NgasahasranAmastotram gakArAdikam (mokShArNavatantre) |
|  | gorakShasahasranAmahavanamantrAH |
|  | gorakShasahasranAmahavanashAbaramantrAH |
|  | gorakShasahasranAmastotram (shrIkalpadrumatantrAntargatam gargaproktam) |
|  | gurusahasranAmastotram |
| * | hariharaputrasahasranAmAbhiShekamantram |
|  | indrasahasranAmastotram (gaNapatimunivirachitam) |
| * | jinasahasranAmastotram 1 (AshAdharavirachitam jino jinendro jinarAT jinapR^iShTho jinottamaH) |
| * | jinasahasranAmastotram 2 (AchArya jinasenakRRitaM shrImAn svayambhUrvR^iShabhaH shambhavaH shambhurAtmabhUH) |
| * | jinasahasranAmastotram 3 (bhaTTArakasakalakIrtti jinendro jinadhaureyo jinasvAmI jinApraNIH) |
| * | jinasahasranamastotram 4 arhannAmasahasrasamuchchayaH 1 (hemachandrAchAryavirachitam shrImAnarhan jinaH svAmI svayambhUH shambhurAtmabhUH) |
| * | kAlanAmAShTottarasahasranAmastotram |
| * | kR^iShNachaitanyachandrasahasranAmastotram 1 (kavikarNapUravirachitam) |
| * | kR^iShNachaitanyachandrasahasranAmastotram 2 (naraharisarakAraThakkuravirachitam) |
| * | kRRiShNachaitanyachandrasahasranAmastotram 3 (chaitanyadAsachira~njIvIsarvAdhikArivirachitam) |
| * | nimbArkasahasranAmastotram (gauramukhAchAryapraNItam) |
|  | pArshvanAthasahasranAmastotram (kalyANasAgarausUrivirachitam) |
| * | rAghavendrasahasranAmastotram (sondura shrIkR^iShNa avadhUta virachitam) |
| * | ramaNamaharShisahasranAmastotram |
| * | shAstRRishavarNasahasranAmastotram |
| * | shivagaNasahasranAmastotram (mallikArjunapaNDitArAdhyavirachitA( |


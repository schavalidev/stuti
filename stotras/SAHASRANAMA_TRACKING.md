# Sahasranāma master list — existence audit

> **⚠ SUPERSEDED IN PART — see `SAHASRANAMA_AUDIT_2026-09-07.md` (2026-09-07).**
> This document's *coverage* claims were built almost entirely on stotranidhi.com and
> undercount the available corpus by roughly 7x (246 sahasranāma texts are indexed on
> sanskritdocuments.org alone, vs the ~34 counted here). Several verdicts below are now
> known to be wrong — including **Ayyappa ❌**, **Śani ❌**, **Lalitā "single canonical
> version"**, and the claim that Śiva's Vāyu/Padma/Skanda/Rudrayāmala variants were
> "not independently verified" (all four exist as primary texts). The re-audit also
> corrects the recension counts for Viṣṇu (6), Gaṇeśa (9), Rāma (6+), Durgā (6+),
> Sūrya (3), Sītā (3) and Gaṅgā (3).
>
> The "modern composition" verdicts here (Indra, Agni, Rāghavēndra) and the
> "Kamalā is not independent" call were **confirmed correct** and still stand.

**Status: 2026-08-25.** This is a dedicated audit of which deities in the corpus have a
**genuine, traditionally-attested Sahasranāma Stotram** (a specific named "thousand names" text —
not just any long nāma-list). None have been written into the corpus yet (checked: `vishnu/`,
`shiva/`, `devi/main/`, `devi/lalita/`, `ganesha/`, `navagraha/` all lack one despite being
otherwise well-populated).

Compiled by 6 parallel research agents, each verifying against **primary-source colophons**
(the "iti śrī ... purāṇē/tantrē ... stōtram" closing line that names the source text and
narrator-dialogue) fetched directly from stotranidhi.com and sanskritdocuments.org, not from
titles or secondary-blog claims alone. stotranidhi.com blocks WebFetch (403); those pages were
read via live browser navigation instead.

Legend: ✅ = confirmed classical/tantric attestation with a named source · ⚠️ = genuine
circulating text but with a caveat (multiple versions, weak/obscure source, self-described as
derivative, or a name-count short of literal 1000) · ❌ = unconfirmed / likely modern compilation
/ not found at all.

## Itihāsa / major Purāṇa-sourced (strongest pedigree)

| Deity | Folder | Status | Source(s) | Notes |
|---|---|---|---|---|
| Viṣṇu | `vishnu/` | ✅ | Mahābhārata, Anuśāsana Parva (Vyāsa via Bhīṣma) | The archetype; also a distinct Garuḍa Purāṇa variant noted on stotranidhi |
| Śiva | `shiva/` | ✅ (multi) | Mahābhārata Anuśāsana Parva (Upamanyu, 1108 names) **+** Liṅga Purāṇa (Kṛṣṇa→Mārkaṇḍeya) | At least 2 confirmed distinct texts; commentators cite up to 8 variants (Padma/Skanda/Vāyu/Brahmāṇḍa/Rudrayāmala) — only the 2 above independently verified |
| Lalitā/Tripurasundarī | `devi/lalita/` | ✅ | Brahmāṇḍa Purāṇa, Lalitopākhyāna (Hayagrīva–Agastya) | Single canonical version, well-attested |
| Durgā | `devi/durga/` | ✅ (multi) | Skanda Purāṇa (Skanda–Nārada) **+** Dākārādi variant, Kulārṇava Tantra | 2 distinct confirmed texts |
| Lakṣmī | `devi/lakshmi/` | ✅ | Skanda Purāṇa, Sanatkumāra Saṁhitā (1008 names) | Clean, explicit attribution |
| Mahālakṣmī | `devi/lakshmi/` | ⚠️ | Colophon names no source; secondary sources suggest Brahma Purāṇa, Hiraṇyagarbha-hṛdaya (unverified against primary text) | Separate text from Lakṣmī Sahasranāma above — real but source unconfirmed |
| Sarasvatī | `devi/saraswati/` | ✅ | Skanda Purāṇa, Sanatkumāra Saṁhitā | Nārada–Sanatkumāra dialogue |
| Gāyatrī | `devi/gayatri/` | ✅ (multi) | Devī Bhāgavata Purāṇa, Skandha 12 **+** a second version, Rudrayāmala Tantra | 2 independently sourced texts |
| Gaṇeśa | `ganesha/` | ✅ (multi) | Gaṇeśa Purāṇa, Upāsanā-khaṇḍa **+** alliterative "Gakāra" version, Rudrayāmala Tantra | 2 distinct texts, well-documented incl. a Bhāskararāya commentary on a subvariant |
| Gaṅgā | `devi/ganga/` (planned) | ✅ | Skanda Purāṇa, Kāśī-khaṇḍa (Skanda–Agastya) | Text itself notes it has 997 names, not exactly 1000 |
| Sūrya/Āditya | `navagraha/` | ✅ | Bhaviṣya Purāṇa (7th kalpa, Vyāsa) | Some scholarly ambiguity vs. Bhaviṣyottara Purāṇa as the precise sub-source |
| Subrahmaṇya | `Subrahmanya/` | ✅ (multi) | Skanda Purāṇa (Mātṛkāmālikā) **+** Mārkaṇḍeya-attributed **+** Siddha Nāgārjuna Tantra **+** Śivarahasya Purāṇa | 4-5 distinct texts, best-attested minor-deity case |
| Nṛsiṁha | `narasimha/` | ✅ | Narasiṁha Purāṇa, Narasiṁha-prādurbhāva section (Mārkaṇḍeya) | Cleanest single-source attestation in the whole audit |
| Vēṅkaṭēśvara/Bālājī | `venkateswara/` | ✅ | Brahmāṇḍa Purāṇa, Veṅkaṭācala Māhātmya (Vasiṣṭha–Nārada) | A separate bare Sahasranāmāvalī (no verses) also exists |
| Kṛṣṇa | `krishna/` | ✅ | Viṣṇudharmottara Purāṇa (Parāśara/Vyāsa/Śuka) | Independent of Viṣṇu Sahasranāma — different name-list |
| Rāma | `rama/` | ✅ | Ānanda Rāmāyaṇa (Vālmīki tradition; medieval/late Itihāsa-adjacent text) | NOT Padma Purāṇa (a common misattribution) |
| Sītā | `rama/` | ✅ | Adbhuta Rāmāyaṇa, Adbhuta Uttarakāṇḍa ch.25 (Vālmīki) | Frames Sītā as the supreme Śakti/Mahālakṣmī |
| Dattātrēya | `dattatreya/` | ✅ (v1) / ⚠️ (v2) | v1: Dattātreya Purāṇa (Sūta) — v2: unattributed, framed as a dream-revelation to Ādi Śaṅkarācārya | v1 solid; v2 weaker/likely later. Common "Brahmāṇḍa Purāṇa" claim online doesn't match primary text |

## Tantra-sourced (genuine, but not Itihāsa/Mahāpurāṇa)

| Deity | Folder | Status | Source(s) | Notes |
|---|---|---|---|---|
| Vārāhī | `devi/varahi/` | ✅ | Uḍḍāmara Tantra (Īśvara–Devī) | Already known-written-pool in tracking |
| Kālikā/Kālī | `devi/kalika/` | ✅ (multi) | Kālikākulasarvasva **+** Bṛhannīla Tantra ch.22 **+** Mahākāla Saṃhitā (kakārādi, has its own manuscript-ambiguity note) | 3 distinct texts |
| Pratyaṅgirā | `devi/pratyangira/` (planned) | ✅ | Rudrayāmala Tantra, Daśavidyā-rahasya | Single confirmed version |
| Bālā | `devi/bala/` | ✅ (multi) | Rudrayāmala Tantra **+** a bakārādi variant, Mahottara-yoginīvidyā | 2 distinct texts |
| Śyāmalā | `devi/syamala/` (planned) | ⚠️ | "Saubhāgyalakṣmī Kalpa" ch.78 — but text self-describes as a compiled "nāmasāra-stava" extracted from other Śakti name-treasuries | Genuine but explicitly derivative, not from-scratch |
| Mātaṅgī | `devi/syamala/` (Mātaṅgī side) | ✅ | Nandyāvarta Tantra, Uttara-khaṇḍa | Distinct from the Śyāmalā text above |
| Annapūrṇā | `devi/annapurna/` (planned) | ✅ | Rudrayāmala Tantra | A separate 108-name Aṣṭottaraśatanāma also exists |
| Tārā | `devi/dasamahavidya/` (planned) | ✅ (multi) | Brahma Yāmala **+** Bṛhannīla Tantra ch.18 **+** Akṣobhya Saṃhitā ch.20 | 3 distinct texts |
| Bhuvaneśvarī | `devi/dasamahavidya/` (planned) | ⚠️ | Rudrayāmala Tantra (self-described as "अपूर्णसहस्रनामकम्" — incomplete) **+** Mahātantrārṇava variant | The main version's own tradition flags it as not literally 1000 unique names |
| Bhairavī (Tripurabhairavī) | `devi/dasamahavidya/` (planned) | ✅ | Viśvasāra Tantra (Mahābhairava→Maheśānī) | Single confirmed version |
| Chinnamastā | `devi/dasamahavidya/` (planned) | ✅ | Viśvasāra Tantra (Śiva–Pārvatī) | Also circulates as "Pracaṇḍacaṇḍikā Sahasranāma" — same text, alt title |
| Dhūmāvatī | `devi/dasamahavidya/` (planned) | ⚠️ | No Purāṇa/Tantra named in colophon; rishi = Pippalāda, Bhairavī–Bhairava frame; transmitted via 19th-c. Śāktapramoda anthology | Genuine old text, weak sourcing |
| Bagalāmukhī | `devi/dasamahavidya/` (planned) | ✅ | Utkaṭa-śambara Nāgendra-prayāṇa Tantra (Viṣṇu–Śiva) | Clear, explicit attribution |
| Kamalā | `devi/dasamahavidya/` (planned) | ❌ **not independent** | = the Lakṣmī/Mahālakṣmī Sahasranāma (Padma Purāṇa), merely retitled "Kamalā Sahasranāma" | **False-positive risk** — don't author as a separate text |
| Kāmākṣī | `devi/lalita/` (partial) | ⚠️ | "Sṛṣṭi Saṁhitā" ch.5 (Brahmā→Bhṛgu) — obscure manuscript source, French Institute of Pondicherry | Genuinely Kāmākṣī-specific content, but only 932 names (not 1000) and source isn't a recognized canonical Purāṇa/Tantra |

## No confirmed Sahasranāma / likely modern compilation / not found

| Deity | Folder | Status | Notes |
|---|---|---|---|
| Mīnākṣī | `devi/meenakshi/` (planned) | ❌ | No dedicated text found anywhere; Madurai temple archana uses the generic Lalitā Sahasranāma instead. Only Pañcaratnam/108-names/Maṇimālā exist |
| Ayyappa | `ayyappa/` | ❌ | Circulates widely online but zero Puranic/Tantric attribution found on any source — signature of a modern (likely 20th c.) temple-tradition compilation |
| Brahmā | `brahma/` | ❌ | Sole source found (12 verses claiming 1000 names — internally implausible) is a low-quality SEO page; absent from stotranidhi/sanskritdocuments/greenmesg |
| Kubēra | `kubera/` | ❌ | Not found; only a 108-name Aṣṭottaraśatanāmāvali exists (already the corpus's 1 written Kubēra title) |
| Yama | `misc_vedic/` | ❌ | Not found; only the 8-verse Yamāṣṭakam exists |
| Vāyu | `misc_vedic/` | ❌ | Not found. (Note: the Vāyu *Purāṇa* ch.30 contains a Śiva Sahasranāma — housed in that Purāṇa but dedicated to Śiva, not Vāyu — don't conflate) |
| Indra | `misc_vedic/` | ⚠️ modern | Real text, but composed by Vasiṣṭha Gaṇapati Muni (1878–1936) from Ṛgvedic epithets — early 20th-c., not classical |
| Agni | `misc_vedic/` | ⚠️ modern/uncertain | Real circulating text (sanskritdocuments.org, pub. acknowledgment 1973), compiler named as Samba Dīkṣita; some sites wrongly call it Agni Purāṇa-sourced |
| Rāghavēndra Svāmi | `guru/` | ⚠️ modern | Genuine Mādhva-sampradāya text but by a named modern author (Sondura Śrīkṛṣṇa Avadhūta); Rāghavēndra himself is a 17th-c. saint, so this is necessarily post-17th-c. devotional literature, not scripture |
| Hanumān | `hanuman/` | ⚠️ weak pedigree | Attributed to Parāśara Saṃhitā — a real but obscure sectarian text of unclear antiquity, not a mainstream Purāṇa |
| Śani | `shani/` | ❌ | Has the form of a sahasranāma (~1008 names) but the colophon names **no** source Purāṇa/Tantra/narrator at all — the one case where a real, complete text has literally zero classical attribution |

## Bottom line for authoring priority

**Solid, unambiguous adds** (single or multiple well-attested classical sources, no major caveats):
Viṣṇu, Śiva, Lalitā, Durgā, Lakṣmī, Sarasvatī, Gāyatrī, Gaṇeśa, Gaṅgā, Sūrya, Subrahmaṇya,
Nṛsiṁha, Vēṅkaṭēśvara, Kṛṣṇa, Rāma, Sītā, Vārāhī, Kālikā, Pratyaṅgirā, Bālā, Mātaṅgī, Annapūrṇā,
Tārā, Bhairavī, Chinnamastā, Bagalāmukhī, Dattātrēya (v1 only) — **26 texts / ~34 counting the
multi-version deities separately.**

**Include but caveat in the stotra's own front-matter** (real text, but source is thin/derivative/
uncertain — say so rather than presenting as unambiguously ancient): Mahālakṣmī, Śyāmalā,
Bhuvaneśvarī, Dhūmāvatī, Kāmākṣī, Dattātrēya v2, Indra, Agni, Rāghavēndra, Hanumān.

**Do not add as a distinct text**: Kamalā (it's Lakṣmī Sahasranāma relabeled — would be a
duplicate).

**Skip / leave researched-only**: Mīnākṣī, Ayyappa, Brahmā, Kubēra, Yama, Vāyu, Śani — no
confirmed genuine 1000-name text exists for any of these.

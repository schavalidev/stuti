# Viṣṇu and Lalitā Sahasranāma — the whole stotras read against the corpus and against stotranidhi

## Part one — Viṣṇu

S89, 22 October 2026. Written after the reciter found lines missing while reciting in the app.

Three texts were compared, line by line, with anusvāra/conjunct nasal, ḷ/l, visarga-before-sibilant
and sandhi spacing normalised so that only real differences survive:

- **COR** — `stotras/vishnu/25_vishnu_sahasranama_stotram.txt`, 237 units, the corpus file,
  built on sanskritdocuments with the full ritual frame.
- **APP** — the `Viṣṇu Sahasranāma Stotram` entry in `stuti-app/src/stuti-texts.ts`, 176 verses.
  This, not the name list, is what the reader recites from in the stotra view.
- **SN** — stotranidhi.com `/sri-vishnu-sahasranama-stotram-in-sanskrit/` (whole stotra) and
  `/sri-vishnu-sahasra-namavali-in-sanskrit/` (the 1001-entry nāmāvalī), fetched through
  `stotras/bin/fetch_source.py`.

## 1. What the app does not have

Nothing is wrong with the thousand names: the app's 1,000 names and its 107 name-ślokas agree with
the corpus and with stotranidhi in order and in division. Everything missing is in the frame around
them, and all of it is in the corpus already.

**The maṅgalācaraṇa — four units.** `ॐ`, `श्रीपरमात्मने नमः`, the Mahābhārata opening
`नारायणं नमस्कृत्य नरं चैव नरोत्तमम् । देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत् ॥`, and
`ॐ अथ सकलसौभाग्यदायकं श्रीविष्णुसहस्रनामस्तोत्रम्`. The app opens at `शुक्लाम्बरधरं विष्णुं`.
stotranidhi does not carry these either; the corpus does.

**The whole ṛṣyādinyāsa — seven placements.** `ॐ शिरसि वेदव्यासर्षये नमः । मुखे अनुष्टुप्छन्दसे नमः ।
हृदि श्रीकृष्णपरमात्मदेवतायै नमः । गुह्ये अमृतांशूद्भवो भानुरिति बीजाय नमः । पादयोर्देवकीनन्दनः स्रष्टेति
शक्तये नमः । सर्वाङ्गे शङ्खभृन्नन्दकी चक्रीति कीलकाय नमः । करसम्पूटे मम श्रीकृष्णप्रीत्यर्थे जपे विनियोगः ॥`
The app has no such section at all — it goes viniyoga, karanyāsa, aṅganyāsa.

**The primary ṣaḍaṅganyāsa — six placements.** `ॐ विश्वं विष्णुर्वषट्कार इति हृदयाय नमः ।
अमृतांशूद्भवो भानुरिति शिरसे स्वाहा । ब्रह्मण्यो ब्रह्मकृद्ब्रह्मेति शिखायै वषट् । सुवर्णबिन्दुरक्षोभ्य इति कवचाय
हुम् । निमिषोऽनिमिषः स्रग्वीति नेत्रत्रयाय वौषट् । रथाङ्गपाणिरक्षोभ्य इत्यस्त्राय फट् ।` The corpus gives this
first and the `सुव्रतः सुमुखः सूक्ष्म` sequence as the alternative; the app carries only the
alternative, so the reciter who knows the first one finds it gone.

**The saṅkalpa.** `श्रीकृष्णप्रीत्यर्थे विष्णोर्दिव्यसहस्रनामजपमहं करिष्ये इति सङ्कल्पः ।`

**ॐ नमो भगवते वासुदेवाय ॥**, which stands before `शान्ताकारं भुजगशयनं` in the corpus.

**Two of the seven dhyāna verses.** The app has five. Missing are the fifth,
`नमः समस्तभूतानामादिभूताय भूभृते । अनेकरूपरूपाय विष्णवे प्रभविष्णवे ॥`, and the seventh,
`छायायां पारिजातस्य हेमसिंहासनोपरि आसीनमम्बुदश्याममायताक्षमलङ्कृतम् । चन्द्राननं चतुर्बाहुं
श्रीवत्साङ्कितवक्षसं रुक्मिणीसत्यभामाभ्यां सहितं कृष्णमाश्रये ॥`. **stotranidhi carries both**, as does
the corpus. The seventh is the verse recited immediately before the names begin, which is almost
certainly the one that was noticed.

Also: the corpus's parenthesised variant of `नमः समस्तभूतानाम्` at pūrvapīṭhikā 12, the dig-bandha's
`भूर्भुवःसुवरोम्`, and the closing colophon `ॐ तत्सदिति श्रीमहाभारते…`.

## 2. Readings in the app's stotra text that the corpus and stotranidhi both read otherwise

These are not missing lines but wrong words, and three of them contradict the app's own name list.

| app | corpus and stotranidhi | note |
|---|---|---|
| महेश्वासो महीभर्ता | महेष्वासो महीभर्ता | the very slip the corpus header says it corrected |
| अग्रणीग्रामणीः | अग्रणीर्ग्रामणीः | a dropped repha |
| पुरंधरः | पुरन्दरः | |
| महाहृदो महागर्तो | महाह्रदो महागर्तो | app's own name 803 reads महाह्रदः |
| लोकस्वामी त्रिलोकधृत् | लोकस्वामी त्रिलोकधृक् | app's own name 751 reads त्रिलोकधृक् |
| सत्कीर्तिच्छिन्नसंशयः | सत्कीर्तिश्छिन्नसंशयः | |
| सन्यासकृच्छमः | संन्यासकृच्छमः | |
| सहस्रमूर्तिर्विश्वात्मा | सहस्रमूर्धा विश्वात्मा | in the aṅganyāsa; मूर्धा, the head, not मूर्ति |
| रथाङ्गपाणि… नेत्राभ्यां वौषट् | …इति तेजसे नेत्रत्रयाय वौषट् | |
| मार्गोनेयो नयोऽनयः | मार्गो नेयो नयोऽनयः | two names run together |
| प्रथमं परिकल्पिते | प्रथमं परिकल्प्यते | |

The app also ends the phalaśruti with `नारायणायेति समर्पयामि ॥` and then repeats it as
`श्रीमन्नारायणायेति समर्पयामि ॥`.

Where the app and the corpus differ and **stotranidhi is with the app**, nothing needs doing:
महर्धि/परर्धि against the corpus's महर्द्धि/परर्द्धि, `श्रीराम राम रामेति`, and
`प्रजार्थी चाप्नुयात् प्रजाः` against the corpus's `प्रजार्थी प्राप्नुयात्प्रजाम्`. These are
attested variants, not faults.

## 3. The one thing the corpus does not have

stotranidhi closes with a pair of adhika-ślokas. The corpus and the app carry the second,
`कायेन वाचा मनसेन्द्रियैर्वा`, and neither carries the first:

> यदक्षर पदभ्रष्टं मात्राहीनं तु यद्भवेत् ।
> तत्सर्वं क्षम्यतां देव नारायण नमोऽस्तु ते ॥

It is the pardon verse for faults of recitation, which belongs where it stands. Not added — the
corpus is not written from a fresh reading without a ruling.

## 4. Five more rows of the name index, beyond the fourteen already corrected

The same comparison against stotranidhi's nāmāvalī turned up five further rows where the corpus's
dative does not answer to the name in the verse. Each is the same class of fault as the fourteen
corrected in `ae78072`, and in each stotranidhi agrees with the verse against the corpus:

- **255** सिद्धिसाधाय → सिद्धिसाधनाय. The verse reads सिद्धिदः सिद्धिसाधनः, and the row's own
  Telugu and Hindi read सिद्धिसाधन. A dropped syllable.
- **256** वृषाहिने → वृषाहिणे. ṇatva applies; the file writes शृङ्गिणे correctly at 797.
- **468** नैकात्माने → नैकात्मने. The verse reads नैकात्मा, an an-stem; नैकात्माने is not a form.
- **529** सत्यधर्माय → सत्यधर्मणे. The verse reads सत्यधर्मा, an an-stem.
- **918** दक्षिणस्यै → दक्षिणाय. The verse reads दक्षिणः; दक्षिणस्यै is a feminine dative.

Awaiting a ruling, like the rest.

## Tooling note

The comparison is a line diff over normalised text, not a reading of the verses, so it is exact
about what is present and absent and says nothing about sense. The scripts were written for this
run and live in the session scratchpad, which does not survive; `stotras/bin/fetch_source.py` is
what reaches stotranidhi, both pages, with no authentication.

---

# Part two — Lalitā

Asked for after the Viṣṇu run, because the reciter found that the app gives the Lalitā names and
then stops: the line that closes them, `इति श्रीब्रह्माण्डपुराणे उत्तरखण्डे`, is not there.

- **COR** — `stotras/devi/lalita/36_lalita_sahasranama_stotram.txt`, 377 units.
- **APP** — the `Lalitā Sahasranāma Stotram` entry in `stuti-texts.ts`: **20 units of text**, plus the
  thousand names, which the reader lays out as ślokas using `slokaCounts` and `slokaLine1`.
- **SN** — stotranidhi `/hi/sri-lalitha-sahasranama-stotram-in-sanskrit/` and
  `…-uttarapeetika-in-sanskrit/`. Its Devanāgarī pūrvapīṭhikā page does not exist; the other two do.

## What the app has, and what it has not

Of the corpus's 377 units the app carries 32. Counted by unit:

| corpus section | units | in the app |
|---|---|---|
| Dhyānam (pūrva) | 14 | 0 |
| Pūrvapīṭhikā | 55 | 2 |
| Nyāsaḥ | 15 | 1 |
| Dhyānam | 4 | 4 |
| Pañcapūjā | 10 | 4 (all six offerings are there; the rest are its headings) |
| Stotram | 183 | 1 |
| Colophon | 3 | 0 |
| Phalaśrutiḥ | 89 | 16 |
| Dhyānam (uttara) | 4 | 4 |

**The colophon, which is what was noticed.** The corpus closes the names with
`॥ इति श्रीब्रह्माण्ड पुराणे उत्तरखण्डे श्रीहयग्रीवागस्त्यसंवादे श्रीललितासहस्रनामस्तोत्रकथनं सम्पूर्णम् ॥`
and stotranidhi with the same line carried further —
`श्रीललिता रहस्यनामसाहस्र स्तोत्रकथनं नाम द्वितीयोऽध्यायः ॥`, which also says it is the second chapter.
The app has neither, so the recitation ends on the last name and nothing closes it.

**The whole pūrva frame.** All fourteen dhyāna verses before the dialogue, from
`मातः श्रीललिते प्रसीद` and `गुरुर्ब्रह्मा गुरुर्विष्णुः` to the two verses that count the ślokas.
The entire pūrvapīṭhikā, fifty-five units — Agastya's question, Hayagrīva's refusal and consent,
the conditions of transmission, the account of how the hymn was composed by the Vāgdevīs. And
fourteen of the fifteen nyāsa units: the app keeps only the single viniyoga line, which is the one
stotranidhi's main page also carries.

**The stotra itself as a text.** The corpus and stotranidhi both print the thousand names as 183
ślokas in full sandhi — `कदम्बमञ्जरीक्लुप्तकर्णपूरमनोहरा`, not `कदम्बमञ्जरी` and `क्लुप्तकर्णपूरमनोहरा`
one under the other. The app has only the name list, laid out in śloka shape. A reciter who learnt
the ślokas is reading a nāmāvalī.

**Most of the phalaśruti.** Sixteen units of eighty-nine. The app has the opening, the fruits, the
ten sahasranāmas, the sealing verses; it has not the ritual instruction of the uttarapīṭhikā — when
and how to recite, the cakrarāja worship, the gifts, the verses on the guru and on the three kinds
of reciter.

## Nothing is missing from the corpus

Everything stotranidhi prints on both pages is in the corpus. The handful of lines a diff reports
as stotranidhi's alone are its own section headings (`अथ स्तोत्रम् ।`), its wording of the viniyoga,
its line breaks, and bracketed variants it marks in place (`[बन्धुरालका]` at 111, `[विशुक्र]` at 29) —
which are the same two variants the corpus already carries, and one of which was settled against
Bhāskararāya earlier the same day.

## What follows from both parts

The thousand names are sound in both hymns. What is thin is the frame around them, and in
different ways: Viṣṇu has the frame and is missing pieces of it — two dhyāna verses, the
ṛṣyādinyāsa, the primary ṣaḍaṅganyāsa, the saṅkalpa, the maṅgalācaraṇa — while Lalitā has almost
none of it, and no closing line at all. In both the corpus already holds everything needed; nothing
has to be sourced. Nothing in the app was changed in this run.

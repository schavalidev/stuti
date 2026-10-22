# Viṣṇu Sahasranāma — the whole stotra read against the corpus and against stotranidhi

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

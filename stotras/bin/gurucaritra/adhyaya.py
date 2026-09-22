#!/usr/bin/env python3
"""Chapter boundaries in the Dvisāhasrī, which are not straightforward.

The work runs to 23 adhyāyas, but it is divided into three yogas and the
chapter numbering RESTARTS in each of the last two:

    jñānayoga    adhyāyas  1–13   numbered  1–13
    karmayoga    adhyāyas 14–18   numbered  1–5, with "आदितः" giving 14–18
    bhaktiyoga   adhyāyas 19–23   numbered  1–5, with "आदितः" giving 19–23

So a colophon reading "नाम तृतीयोऽध्यायः" is chapter 3 in the first yoga and
chapter 16 in the second. Getting this wrong silently misfiles a third of the
book, so the yoga is tracked and the offset applied.
"""
import re

ORDINALS = {
    'प्रथम': 1, 'द्वितीय': 2, 'तृतीय': 3, 'चतुर्थ': 4, 'पञ्चम': 5, 'पंचम': 5,
    'पञ्यम': 5, 'पथम': 5, 'पञथम': 5, 'षष्ठ': 6, 'सप्तम': 7, 'अष्टम': 8, 'नवम': 9,
    'दशम': 10, 'एकादश': 11, 'द्वादश': 12, 'त्रयोदश': 13, 'चतुर्दश': 14,
    'पञ्चदश': 15, 'पञ्यदश': 15, 'पंचदश': 15, 'प्दश': 15, 'पयदश': 15, 'पञथयदश': 15, 'पञथदश': 15,
    'षोडश': 16, 'सप्तदश': 17, 'अष्टादश': 18, 'एकोनविंश': 19, 'एकोनविश': 19,
    'विंश': 20, 'विश': 20, 'एकविंश': 21, 'एकविश': 21, 'द्वाविंश': 22,
    'त्रयोविंश': 23, 'त्रयोविश': 23,
}

YOGA_OFFSET = {'ज्ञानयोग': 0, 'कर्मयोग': 13, 'भक्तियोग': 18}

# The three yoga headings, as the running heads and colophons print them.
YOGA = re.compile(r'(ज्ञानयोग|कर्मयोग|भक्तियोग)')

# "आदितः <ord>ोऽध्यायः" / "आदितो<ord>..." — the absolute number, when printed.
ADITAH = re.compile(r'आदित[ःश्चो]*\s*([ऀ-ॿ]+?)ोऽध्याय')
# "इति ... नाम <ord>ोऽध्यायः" — the closing colophon.
ITI = re.compile(r'नामा?\s*([ऀ-ॿ]+?)ोऽध्याय')
# "अथ <ord>ोऽध्यायः" / "|| <ord>ोऽध्यायः ||" — the chapter opening.
ATHA = re.compile(r'(?:अथ|॥|\|\|)\s*([ऀ-ॿ]+?)ोऽध्याय')

# The book's own table of contents: adhyāya -> (name, last verse).
# Read off the TOC and the per-adhyāya episode ranges in the same scan.
CONTENTS = {
    1:  ('चरितानुसंधानम्', 'Caritānusandhānam'),
    2:  ('गुरुशिष्यचरितानुकथनम्', 'Guruśiṣyacaritānukathanam'),
    3:  ('दत्तावतारकथनम्', 'Dattāvatārakathanam'),
    4:  ('दत्तलीलाकथनम्', 'Dattalīlākathanam'),
    5:  ('श्रीपादावतारः', 'Śrīpādāvatāraḥ'),
    6:  ('गोकर्णवर्णनम्', 'Gokarṇavarṇanam'),
    7:  ('श्रीपादमहिमावर्णनम्', 'Śrīpādamahimāvarṇanam'),
    8:  ('श्रीनृसिंहसरस्वत्यवतारकथनम्', 'Śrīnṛsiṃhasarasvatyavatārakathanam'),
    9:  ('तीर्थयात्रोद्देशः', 'Tīrthayātroddeśaḥ'),
    10: ('गुरुभक्त्यनुशासनम्', 'Gurubhaktyanuśāsanam'),
    11: ('कृष्णापञ्चगङ्गासङ्गमोत्कर्षकथनम्', 'Kṛṣṇāpañcagaṅgāsaṅgamotkarṣakathanam'),
    12: ('प्रेतसञ्जीवनम्', 'Pretasañjīvanam'),
    13: ('भीमामरजासङ्गमनिवासः', 'Bhīmāmarajāsaṅgamanivāsaḥ'),
    14: ('वेदोपदेशः', 'Vedopadeśaḥ'),
    15: ('कर्मविपाकः', 'Karmavipākaḥ'),
    16: ('मृतसञ्जीवनम्', 'Mṛtasañjīvanam'),
    17: ('दम्पतीगुरुसंवादः', 'Dampatīgurusaṃvādaḥ'),
    18: ('कर्मकाण्डकथनम्', 'Karmakāṇḍakathanam'),
    19: ('भक्तिमहिमावर्णनम्', 'Bhaktimahimāvarṇanam'),
    20: ('भक्तिवर्णनम्', 'Bhaktivarṇanam'),
    21: ('भक्तिवर्णनम्', 'Bhaktivarṇanam'),
    22: ('क्षेत्रमाहात्म्यवर्णनम्', 'Kṣetramāhātmyavarṇanam'),
    23: ('उपसंहारः', 'Upasaṃhāraḥ'),
}

# The book's own saptāha-pāṭha-paddhati: day -> last adhyāya read that day.
SAPTAHA = {1: 4, 2: 9, 3: 14, 4: 17, 5: 19, 6: 21, 7: 23}


def absolute(ordinal_word, yoga):
    """Map a printed ordinal plus the current yoga to the absolute chapter."""
    n = ORDINALS.get(ordinal_word)
    if n is None:
        return None
    if n > 13:                      # already an "āditaḥ" absolute number
        return n
    return n + YOGA_OFFSET.get(yoga, 0)


# ---------------------------------------------------------------------------
# Colophon anchors: one regex per adhyāya, each matching exactly ONCE PER PASS.
#
# Chapter regions are cut on these rather than on a running counter, because the
# ordinal in a colophon is one of the things the OCR most often destroys — five
# of the twenty-three fail in every pass. The chapter NAME is long and survives.
# Three chapters need a hand-made anchor: the table of contents and the colophon
# spell 11 and 13 differently, and 20 and 21 share the name भक्तिवर्णन and are
# told apart by the within-yoga ordinal that follows it.
ANCHORS = {
    1:  r'चरितानुसंधानं\s*नाम',
    2:  r'गुरुशिष्यचरितानुकथनं\s*नाम',
    3:  r'दत्तावतारकथनं\s*नाम',
    4:  r'दत्तलीलाकथनं\s*नाम',
    5:  r'श्रीपादावतारो?\s*नाम',
    6:  r'गोकर्णवर्णनं\s*नाम',
    7:  r'श्रीपादमहिमावर्णनं\s*नाम',
    8:  r'श्रीनृसिहसरस्वत्यवतारकथनं\s*नामा?',
    9:  r'तीर्थयात्रोदेशो?\s*नाम',
    10: r'गुरुभक्त्यनुशासनं\s*नाम',
    11: r'सङ्गमोत्कर्षकथनं\s*नाम',
    12: r'प्रेतसंजीवनं\s*नाम',
    13: r'मरजासंगमनिवासो\s*नाम',
    14: r'वेदोपदेशो?\s*नाम',
    15: r'कर्मविपाको?\s*नाम',
    16: r'मृतसंजीवनं\s*नाम',
    17: r'दम्पतीगुरुसंवादो?\s*नाम',
    18: r'कर्मकाण्डकथनं\s*नाम',
    19: r'भक्तिमहिमावर्णनं\s*नाम',
    20: r'भक्तिवर्णनं\s*नाम\s*द्वितीय',
    21: r'आदित\S{0,3}\s*एकविंशोऽध्याय',
    22: r'माहात्म्यवर्णनं\s*नाम',
    23: r'आदित\S{0,3}त्रयोविंशोऽध्याय',
}

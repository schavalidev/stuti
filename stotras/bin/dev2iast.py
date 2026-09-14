#!/usr/bin/env python3
"""Devanāgarī → IAST, to this corpus's convention.

The convention is not generic ISO 15919; it is what the 838 existing files do,
and it was derived by measuring them rather than by assumption:

  anusvāra    ṁ   (860 units use ṁ, 1 uses ṃ — that one is an outlier, not a rule)
  vocalic r   ṛ   (437 units; zero use r̥, so ISO's r̥ is wrong here)
  e / o       plain — never ē / ō, which is stotranidhi's South Indian marking
  daṇḍa       | and ||, with Devanāgarī digits inside them arabicised (॥३॥ → ||3||)
  avagraha    '
  nukta ड़/ढ़  ṛ / ṛh, not ḍ / ḍh. In the `deva:` fields these letters occur
              only in the Hindi, Awadhi and Braj texts (Sundarkāṇḍ, the
              Cālīsās, the āratīs), and all 57 places romanise them ṛ.

              A trap worth knowing, because it cost a session once. Sanskrit
              files are full of गरुड़, क्रीड़ा, पीड़ा and योगारूढ़ — but every
              one of them sits in the `hi:` field, which is a Hindi
              translation and rightly uses Hindi spelling. The `en:` field of
              the same unit writes garuḍa, krīḍā, pīḍā. Sweeping a whole file
              for the Devanāgarī and then for the IAST matches those two
              across different fields and appears to prove that Sanskrit wants
              ḍ. It proves nothing. Restrict any such measurement to the
              `deva:` and `iast:` blocks, which is where this tool is used.
  accents     stripped by default; pass accents=True to keep them (see below).

One deliberate exception to stripping: the guttural nasal before a spirant is a
real recitational distinction, not an accent, and the corpus romanises it `gṁ` —
so `ओग्ं` → `ogṁ`, distinct from plain `oṁ`. The corpus spells it `ग्ं`; the older
spelling `ᳪं᳭` is still accepted on input and romanises the same way. See
stotras/vidhi/taittiriya/01_krishna_yajurveda_sandhyavandanam.txt.

Accents (svaras)
----------------
Most of this corpus marks svaras in `deva:` and not in `iast:`, which is why
stripping is the default. One file marks them in both —
stotras/devi/lakshmi/06_sri_suktam.txt, which carries 392 combining marks in
its `iast:` field, deliberately preserved from an accented source. Passing
accents=True romanises the three svaras instead of dropping them, so that file
can be checked rather than skipped. Do not use it to *add* accent to a text
that has none: CLAUDE.md's rule is that accent is transcribed or absent, never
derived, and never carried across śākhās.

The anusvāra before a stop — a per-file choice, not a per-language one
----------------------------------------------------------------------
Default is `ṁ` everywhere, and `nasal='homorganic'` assimilates instead
(`अंजनिपुत्र` → `añjaniputra`, `कुंडल` → `kuṇḍala`).

Do not wire that parameter to a file's language. It was measured, and the
corpus does not romanise by language: the Sundarkāṇḍ is Awadhi throughout and
writes `hanumaṁta`, `siṁdhu`, `suṁdara` with plain anusvāra, while
hanuman/02_hanuman_chalisa.txt writes `añjaniputra` assimilated — and
hanuman/32, the Gītā Press recension of that same Cālīsā, does both (`saṁkaṭa`
beside `añjani`). Assimilating every vernacular file would corrupt the thirteen
Sundarkāṇḍ files, which are the largest block of Awadhi here.

Across the whole corpus only hanuman/02 assimilates consistently (25 places
against 1); assimilating everywhere costs 607 units. So the convention belongs
to whoever authored the file, and a caller must pass it explicitly.

Usage:
    python3 dev2iast.py                 # stdin → stdout
    python3 dev2iast.py "देवनागरी"      # argument → stdout
    python3 dev2iast.py --accents ...   # keep svaras instead of stripping
    python3 dev2iast.py --homorganic .. # assimilate the anusvāra before a stop
    from dev2iast import dev2iast       # as a module
"""
import re
import sys

# Consonants, bare (the inherent 'a' is added by the syllable loop, not here).
CONS = {
    'क': 'k',  'ख': 'kh', 'ग': 'g',  'घ': 'gh', 'ङ': 'ṅ',
    'च': 'c',  'छ': 'ch', 'ज': 'j',  'झ': 'jh', 'ञ': 'ñ',
    'ट': 'ṭ',  'ठ': 'ṭh', 'ड': 'ḍ',  'ढ': 'ḍh', 'ण': 'ṇ',
    'त': 't',  'थ': 'th', 'द': 'd',  'ध': 'dh', 'न': 'n', 'ऩ': 'n',
    'प': 'p',  'फ': 'ph', 'ब': 'b',  'भ': 'bh', 'म': 'm',
    'य': 'y',  'र': 'r',  'ल': 'l',  'व': 'v',  'ळ': 'ḻ',
    'ऱ': 'ṟ',  'ऴ': 'ḻ',            # Dravidian letters, used in Tamil-in-Devanāgarī
    'श': 'ś',  'ष': 'ṣ',  'स': 's',  'ह': 'h',
    # nukta forms. The Persian-derived letters fold to their base letter, which
    # is what the corpus does. ड़/ढ़ do not: they are the Hindi flap, written
    # ṛ/ṛh here (बड़ाई → baṛāī, मूढ़ → mūṛha), never ḍ/ḍh.
    'क़': 'k', 'ख़': 'kh', 'ग़': 'g', 'ज़': 'z', 'ड़': 'ṛ', 'ढ़': 'ṛh', 'फ़': 'f',
}

# Independent vowels.
VOW = {
    'अ': 'a',  'आ': 'ā', 'इ': 'i',  'ई': 'ī', 'उ': 'u',  'ऊ': 'ū',
    'ऋ': 'ṛ',  'ॠ': 'ṝ', 'ऌ': 'ḷ',  'ॡ': 'ḹ',
    'ए': 'e',  'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'ऎ': 'e',  'ऒ': 'o',              # short south-Indian forms fold to plain
}

# Dependent vowel signs (mātrās).
MAT = {
    'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
    'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
    'ॆ': 'e', 'ॊ': 'o',
}

VIRAMA = '्'
NUKTA = '़'

SIGNS = {
    'ं': 'ṁ',   # anusvāra
    'ँ': 'm̐',   # candrabindu
    'ः': 'ḥ',   # visarga
    'ऽ': "'",   # avagraha
    'ꣳ': 'ṁ',   # U+A8F3, the candrabindu-virāma of Vedic printing
    '॰': '°',   # U+0970, abbreviation sign: जग॰ → jaga°, a refrain cue
    '।': '|', '॥': '||',
    'ॐ': 'oṁ',
}

DIGITS = {chr(0x0966 + i): str(i) for i in range(10)}

# Vedic accent marks and related signs, stripped unless accents=True.
ACCENTS = '॒॑᳚᳛᳐᳑᳒ᳪ᳭॓॔'

# The three svaras the corpus actually romanises, and the combining marks it
# uses for them — measured against devi/lakshmi/06_sri_suktam.txt, whose deva:
# and iast: fields carry these in matching counts (234/235, 140/140, 17/17).
SVARA = {
    '\u0951': '\u030d',      # udātta   — combining vertical line above
    '\u0952': '\u0320',      # anudātta — combining minus sign below
    '\u1cda': '\u030e',      # svarita  — combining double vertical line above
}
_SVARA_PH = {d: chr(1 + n) for n, d in enumerate(SVARA)}

# The nasal each stop class takes when the anusvāra assimilates, for
# nasal='homorganic'. Keyed by the IAST consonant that follows.
HOMORGANIC = {
    'k': 'ṅ', 'g': 'ṅ',
    'c': 'ñ', 'j': 'ñ',
    'ṭ': 'ṇ', 'ḍ': 'ṇ',
    't': 'n', 'd': 'n',
    'p': 'm', 'b': 'm',
}

# Zero-width joiner and non-joiner. These are rendering hints, not letters —
# पट्‍टण and पट्टण are the same word — so they carry nothing into IAST.
ZERO_WIDTH = '\u200c\u200d'

# The guttural nasal before a spirant. Must be handled before accents are
# stripped, because U+1CEA and U+1CED are in the strip set.
GUTTURAL_NASAL = 'ᳪं᳭'


def dev2iast(text: str, accents: bool = False, nasal: str = 'anusvara') -> str:
    """Transliterate Devanāgarī to IAST in this corpus's convention.

    accents=True keeps the three svaras as combining marks instead of
    dropping them. nasal='homorganic' writes the anusvāra before a stop as
    the matching nasal instead of ṁ. Both are opt-in, and neither should be
    inferred from a file's language — see the module docstring.
    """
    if nasal not in ('anusvara', 'homorganic'):
        raise ValueError("nasal must be 'anusvara' or 'homorganic'")
    # 1. The guttural-nasal ligature, before anything strips its components.
    text = text.replace(GUTTURAL_NASAL, '\x00')

    # 2. Zero-width joiners are typography, not text.
    text = re.sub('[' + ZERO_WIDTH + ']', '', text)

    # 3. Park the svaras on placeholders if they are being kept, then drop
    #    every accent mark that is left.
    if accents:
        for _dev, _ph in _SVARA_PH.items():
            text = text.replace(_dev, _ph)
    text = re.sub('[' + ACCENTS + ']', '', text)

    # 4. An ASCII colon stands in for visarga in some accented sources
    #    (`भुव॑:` → `bhuvaḥ`); a colon between Devanāgarī is never punctuation.
    text = re.sub(r'(?<=[ऀ-ॿ]):', 'ः', text)

    out = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]

        if ch == '\x00':
            out.append('gṁ')
            i += 1
            continue

        # Consonant + optional nukta, then look ahead for virāma or mātrā.
        base = ch
        if i + 1 < n and text[i + 1] == NUKTA and (ch + NUKTA) in CONS:
            base = ch + NUKTA
        if base in CONS:
            out.append(CONS[base])
            i += len(base)
            if i < n and text[i] == NUKTA:
                i += 1
            if i < n and text[i] == VIRAMA:
                i += 1                      # bare consonant, no vowel
            elif i < n and text[i] in MAT:
                out.append(MAT[text[i]])
                i += 1
            else:
                out.append('a')             # inherent vowel
            continue

        if ch in VOW:
            out.append(VOW[ch])
            i += 1
            continue
        if ch in SIGNS:
            out.append(SIGNS[ch])
            i += 1
            continue
        if ch in DIGITS:
            out.append(DIGITS[ch])
            i += 1
            continue
        if ch in MAT or ch == VIRAMA or ch == NUKTA:
            i += 1                          # stray mātrā with no consonant
            continue

        out.append(ch)                      # spaces, latin, punctuation
        i += 1

    result = ''.join(out)
    if nasal == 'homorganic':
        result = re.sub('ṁ(?=[' + ''.join(HOMORGANIC) + '])',
                        lambda m: HOMORGANIC[result[m.end()]], result)
    if accents:
        for _dev, _ph in _SVARA_PH.items():
            result = result.replace(_ph, SVARA[_dev])
        # Devanāgarī writes the accent after the anusvāra or visarga; the accent
        # belongs to the syllable's vowel, and that is where this corpus puts it.
        result = re.sub(r'([ṁḥ])([\u0300-\u036f])', r'\2\1', result)
    return result


def main() -> None:
    flags = {'--accents', '--homorganic'}
    argv = sys.argv[1:]
    args = [a for a in argv if a not in flags]
    src = ' '.join(args) if args else sys.stdin.read()
    sys.stdout.write(dev2iast(src, accents='--accents' in argv,
                              nasal='homorganic' if '--homorganic' in argv
                                    else 'anusvara'))


if __name__ == '__main__':
    main()

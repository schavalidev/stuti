#!/usr/bin/env python3
"""Devanāgarī → Telugu script, letter for letter.

This changes the script only. It does not translate, and it does not change a
single word. A Telugu reader who recites the Hanumān Cālīsā recites Tulsīdās's
Awadhi; this gives that Awadhi in letters they can read. The `tel:` field is a
different thing — that is a translation of the sense into Telugu.

The two scripts fit together closely. Both are abugidas with the same varga
order, the same inherent 'a', the same virāma and the same mātrā system, so the
mapping is one to one almost everywhere. The places that needed a decision are
few, and each is recorded here rather than left for a reader to guess.

  e and o        Devanāgarī ए and ओ are long. Telugu writes length, so they
                 become ఏ and ఓ, not ఎ and ఒ. The short ऎ and ऒ of southern
                 printing become ఎ and ఒ.
  ड़ and ढ़        The Hindi flap. Telugu has no letter for it, so it is written
                 with the base letters డ and ఢ, which is what Telugu printings
                 of Hindi do. ఱ was considered and not used: it is the Telugu
                 alveolar trill, it is largely out of use in modern Telugu, and
                 it would put an unfamiliar letter in front of the reader. All
                 69 occurrences are in the vernacular files.
  ॐ              Telugu has no separate oṁ sign, so it is written ఓం.
  ग्ं             The guttural nasal before a spirant is written గ్ం, which is
                 the form Telugu Veda books print (ఆపశ్శగ్ం స్యోనా). The older
                 spelling ᳪं᳭ is still accepted on input and maps the same way.
  accents        Stripped by default, as in dev2iast.py. The svara marks are
                 script-neutral and are kept unchanged when accents=True.
  ZWJ / ZWNJ     Devanāgarī rendering hints. They carry nothing into Telugu.
  nasal + stop   A homorganic nasal conjunct is written with anusvāra and the
                 conjunct follows in brackets — चन्द्र becomes చంద్ర(చన్ద్ర).
                 Many Telugu readers cannot read the conjunct at a glance. Pass
                 anusvara=False (--conjuncts on the command line) for the plain
                 letter-for-letter form. See telugu_anusvara.py.

Usage:
    python3 dev2tel.py                  # stdin → stdout
    python3 dev2tel.py "देवनागरी"       # argument → stdout
    python3 dev2tel.py --accents ...    # keep the svara marks
    python3 dev2tel.py --conjuncts ...  # leave నstop conjuncts as they are
    from dev2tel import dev2tel         # as a module
"""
import re
import sys

from telugu_anusvara import anusvara_first

CONS = {
    'क': 'క',  'ख': 'ఖ', 'ग': 'గ',  'घ': 'ఘ', 'ङ': 'ఙ',
    'च': 'చ',  'छ': 'ఛ', 'ज': 'జ',  'झ': 'ఝ', 'ञ': 'ఞ',
    'ट': 'ట',  'ठ': 'ఠ', 'ड': 'డ',  'ढ': 'ఢ', 'ण': 'ణ',
    'त': 'త',  'थ': 'థ', 'द': 'ద',  'ध': 'ధ', 'न': 'న', 'ऩ': 'న',
    'प': 'ప',  'फ': 'ఫ', 'ब': 'బ',  'भ': 'భ', 'म': 'మ',
    'य': 'య',  'र': 'ర', 'ल': 'ల',  'व': 'వ', 'ळ': 'ళ',
    'ऱ': 'ఱ',  'ऴ': 'ఴ',
    'श': 'శ',  'ष': 'ష', 'स': 'స',  'ह': 'హ',
    # nukta forms. ड़/ढ़ take the base letter — see the module docstring.
    'क़': 'క', 'ख़': 'ఖ', 'ग़': 'గ', 'ज़': 'జ', 'ड़': 'డ', 'ढ़': 'ఢ',
    'फ़': 'ఫ', 'य़': 'య',
}

VOW = {
    'अ': 'అ',  'आ': 'ఆ', 'इ': 'ఇ',  'ई': 'ఈ', 'उ': 'ఉ',  'ऊ': 'ఊ',
    'ऋ': 'ఋ',  'ॠ': 'ౠ', 'ऌ': 'ఌ',  'ॡ': 'ౡ',
    'ए': 'ఏ',  'ऐ': 'ఐ', 'ओ': 'ఓ',  'औ': 'ఔ',
    'ऎ': 'ఎ',  'ऒ': 'ఒ',
}

MAT = {
    'ा': 'ా', 'ि': 'ి', 'ी': 'ీ', 'ु': 'ు', 'ू': 'ూ',
    'ृ': 'ృ', 'ॄ': 'ౄ', 'ॢ': 'ౢ', 'ॣ': 'ౣ',
    'े': 'ే', 'ै': 'ై', 'ो': 'ో', 'ौ': 'ౌ',
    'ॆ': 'ె', 'ॊ': 'ొ',
}

VIRAMA = '्'
NUKTA = '़'
TEL_VIRAMA = '్'

SIGNS = {
    'ं': 'ం',   # anusvāra
    'ँ': 'ఁ',   # candrabindu
    'ः': 'ః',   # visarga
    'ऽ': 'ఽ',   # avagraha
    'ꣳ': 'ం',
    '॰': '॰',
    '।': '।', '॥': '॥',
    'ॐ': 'ఓం',
}

DIGITS = {chr(0x0966 + i): chr(0x0C66 + i) for i in range(10)}

ACCENTS = '॒॑᳚᳛᳐᳑᳒ᳪ᳭॓॔'
ZERO_WIDTH = '‌‍'
GUTTURAL_NASAL = 'ᳪं᳭'


def dev2tel(text: str, accents: bool = False, anusvara: bool = True) -> str:
    """Render Devanāgarī in Telugu script. The words do not change."""
    text = text.replace(GUTTURAL_NASAL, '\x00')
    text = re.sub('[' + ZERO_WIDTH + ']', '', text)
    if not accents:
        text = re.sub('[' + ACCENTS + ']', '', text)
    # An ASCII colon stands in for visarga in some accented sources.
    text = re.sub(r'(?<=[ऀ-ॿ]):', 'ः', text)

    out = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]

        if ch == '\x00':
            out.append('గ్ం')         # the guttural nasal — గ్ం, as Telugu Veda books print it
            i += 1
            continue

        base = ch
        if i + 1 < n and text[i + 1] == NUKTA and (ch + NUKTA) in CONS:
            base = ch + NUKTA
        if base in CONS:
            out.append(CONS[base])
            i += len(base)
            if i < n and text[i] == NUKTA:
                i += 1
            if i < n and text[i] == VIRAMA:
                out.append(TEL_VIRAMA)
                i += 1
            elif i < n and text[i] in MAT:
                out.append(MAT[text[i]])
                i += 1
            # else: inherent 'a', written by the bare consonant in both scripts
            continue

        for table in (VOW, SIGNS, DIGITS):
            if ch in table:
                out.append(table[ch])
                break
        else:
            if ch in MAT or ch in (VIRAMA, NUKTA):
                pass                        # stray mātrā with no consonant
            else:
                out.append(ch)              # spaces, latin, punctuation, svaras
        i += 1

    result = ''.join(out)
    return anusvara_first(result) if anusvara else result


def main() -> None:
    argv = sys.argv[1:]
    args = [a for a in argv if a not in ('--accents', '--conjuncts')]
    src = ' '.join(args) if args else sys.stdin.read()
    sys.stdout.write(dev2tel(src, accents='--accents' in argv,
                             anusvara='--conjuncts' not in argv))


if __name__ == '__main__':
    main()

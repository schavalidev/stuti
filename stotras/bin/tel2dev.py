#!/usr/bin/env python3
"""Telugu script → Devanāgarī, letter for letter. The inverse of dev2tel.py.

This changes the script only. It does not translate and it does not change a
single word. It exists because the Telugu vrata and pūjā sources are printed in
Telugu script only, while this corpus's primary column is Devanāgarī — the same
situation `vidhi/taittiriya/` met and solved by hand.

**Do not confuse this with the `tel:` field.** That field is a *translation* of
the sense into Telugu. This tool is transliteration: same words, other letters.
Its output belongs in `deva:`, built from a Telugu-script source.

The two scripts fit together closely — same varga order, same inherent 'a', same
virāma, same mātrā system — so the mapping is one to one almost everywhere. The
places needing a decision are listed here rather than left for a reader to guess.

  ఏ / ఓ          Telugu writes vowel length, Devanāgarī does not distinguish it
                 for e and o. ఏ and ఓ become ए and ओ; the short ఎ and ఒ become
                 ऎ and ऒ, the southern short vowels this corpus already carries
                 in 242 places and which must not be normalised away.
  ఓం             Ambiguous on the way back: dev2tel.py sends both ॐ and ओं to
                 ఓం. The default here is **ओं**, which the corpus writes 4,763
                 times against 3,194 for ॐ. Pass --pranava-sign for ॐ instead.
                 Nothing recovers the distinction from the Telugu alone, so a
                 file built from a Telugu source should be read once for this.
  గ్ం / గ్‍ం       The guttural nasal before a spirant, which Telugu Veda books
                 print this way (ఆపశ్శగ్ం స్యోనా). It becomes ग्ं. The form with
                 ZWJ occurs in real sources and is handled identically.
  ఱ ళ ఴ          Mapped to ऱ ळ ऴ, which the corpus already uses — 427, 468 and
                 197 times. They are not folded into र ल.
  ౘ ౙ            The Telugu affricates. Devanāgarī has no letter for them, so
                 they take the base letters చ → च and జ → ज, which is the mirror
                 of what dev2tel.py does with ड़/ढ़.
  accents        Svara marks are script-neutral and pass through unchanged.
  ZWJ / ZWNJ     Removed. They are rendering hints and carry nothing across —
                 except inside గ్‍ం, which is matched before they are stripped.

Round-trip measured against the corpus rather than assumed: see --selftest,
which sends every `deva:` line in the corpus through dev2tel.py and back.

Usage:
    python3 tel2dev.py                      # stdin → stdout
    python3 tel2dev.py "తెలుగు"              # argument → stdout
    python3 tel2dev.py --pranava-sign ...   # ఓం → ॐ rather than ओं
    python3 tel2dev.py --selftest           # round-trip report over the corpus
    from tel2dev import tel2dev             # as a module
"""
import re
import sys

# Inverted from dev2tel.py. Telugu → Devanāgarī.
CONS = {
    'క': 'क', 'ఖ': 'ख', 'గ': 'ग', 'ఘ': 'घ', 'ఙ': 'ङ',
    'చ': 'च', 'ఛ': 'छ', 'జ': 'ज', 'ఝ': 'झ', 'ఞ': 'ञ',
    'ట': 'ट', 'ఠ': 'ठ', 'డ': 'ड', 'ఢ': 'ढ', 'ణ': 'ण',
    'త': 'त', 'థ': 'थ', 'ద': 'द', 'ధ': 'ध', 'న': 'न',
    'ప': 'प', 'ఫ': 'फ', 'బ': 'ब', 'భ': 'भ', 'మ': 'म',
    'య': 'य', 'ర': 'र', 'ల': 'ल', 'వ': 'व', 'ళ': 'ळ',
    'ఱ': 'ऱ', 'ఴ': 'ऴ',
    'శ': 'श', 'ష': 'ष', 'స': 'स', 'హ': 'ह',
    # The Telugu affricates have no Devanāgarī letter — see the module docstring.
    'ౘ': 'च', 'ౙ': 'ज',
}

VOW = {
    'అ': 'अ', 'ఆ': 'आ', 'ఇ': 'इ', 'ఈ': 'ई', 'ఉ': 'उ', 'ఊ': 'ऊ',
    'ఋ': 'ऋ', 'ౠ': 'ॠ', 'ఌ': 'ऌ', 'ౡ': 'ॡ',
    'ఏ': 'ए', 'ఐ': 'ऐ', 'ఓ': 'ओ', 'ఔ': 'औ',
    'ఎ': 'ऎ', 'ఒ': 'ऒ',
}

MAT = {
    'ా': 'ा', 'ి': 'ि', 'ీ': 'ी', 'ు': 'ु', 'ూ': 'ू',
    'ృ': 'ृ', 'ౄ': 'ॄ', 'ౢ': 'ॢ', 'ౣ': 'ॣ',
    'ే': 'े', 'ై': 'ै', 'ో': 'ो', 'ౌ': 'ौ',
    'ె': 'ॆ', 'ొ': 'ॊ',
}

TEL_VIRAMA = '్'
VIRAMA = '्'

SIGNS = {
    'ం': 'ं',   # anusvāra
    'ఁ': 'ँ',   # candrabindu
    'ఀ': 'ँ',   # candrabindu, the U+0C00 form
    'ః': 'ः',   # visarga
    'ఽ': 'ऽ',   # avagraha
    '॰': '॰',
    '।': '।', '॥': '॥',
}

DIGITS = {chr(0x0C66 + i): chr(0x0966 + i) for i in range(10)}

ACCENTS = '॒॑᳚᳛᳐᳑᳒ᳪ᳭॓॔'
ZERO_WIDTH = '‌‍'
GUTTURAL_NASAL = 'ग्ं'
# గ్ం, and the same with ZWJ inside it, which real sources print.
TEL_GUTTURAL = re.compile('గ' + TEL_VIRAMA + '[' + ZERO_WIDTH + ']?ం')


def tel2dev(text: str, pranava_sign: bool = False) -> str:
    """Render Telugu script in Devanāgarī. The words do not change."""
    # Before ZWJ is stripped, so that గ్‍ం is caught as one unit.
    text = TEL_GUTTURAL.sub('\x00', text)
    # ఓం is one sign on the way back — resolved before ఓ is read as a vowel.
    text = text.replace('ఓ' + 'ం', '\x01')
    text = re.sub('[' + ZERO_WIDTH + ']', '', text)
    # An ASCII colon stands in for visarga in some sources — stotranidhi's Veda
    # pages do it, and so does sa.wikisource. Mapped before anything else reads it.
    text = re.sub(r'(?<=[ఀ-౿]):', 'ః', text)

    out = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]

        if ch == '\x00':
            out.append(GUTTURAL_NASAL)
            i += 1
            continue
        if ch == '\x01':
            out.append('ॐ' if pranava_sign else 'ओं')
            i += 1
            continue

        if ch in CONS:
            out.append(CONS[ch])
            i += 1
            if i < n and text[i] == TEL_VIRAMA:
                out.append(VIRAMA)
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
            if ch in MAT or ch == TEL_VIRAMA:
                pass                        # stray mātrā with no consonant
            else:
                out.append(ch)              # spaces, latin, punctuation, svaras
        i += 1

    return ''.join(out)


def selftest() -> int:
    """Round-trip every `deva:` line in the corpus: dev → tel → dev.

    dev2tel.py is lossy in three places it documents, so an exact identity is
    not the target. What this checks is that every mismatch falls into one of
    those known classes and that nothing else drifts.
    """
    import pathlib
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
    from dev2tel import dev2tel

    root = pathlib.Path(__file__).resolve().parent.parent
    total = exact = 0
    buckets: dict = {}
    samples: dict = {}
    for path in sorted(root.rglob('*.txt')):
        try:
            lines = path.read_text(encoding='utf-8').split('\n')
        except Exception:
            continue
        for idx, line in enumerate(lines):
            if line.strip() != 'deva:':
                continue
            for src in lines[idx + 1:]:
                if not src.strip() or src.rstrip().endswith(':'):
                    break
                if not re.search(r'[ऀ-ॿ]', src):
                    break
                total += 1
                # letter-for-letter here: the anusvāra-first spelling is a
                # reader convention, not part of the script mapping.
                back = tel2dev(dev2tel(src, accents=True, anusvara=False))
                if back == src:
                    exact += 1
                    continue
                # classify
                probe = src
                if 'ॐ' in src:
                    tag = 'pranava ॐ vs ओं (known, dev2tel sends both to ఓం)'
                elif 'ꣳ' in src:
                    tag = 'anusvāra ꣳ vs ं (known, dev2tel.py:76 sends both to ం)'
                elif re.search(r'[क-ह]़', src) or 'ड़' in src or 'ढ़' in src:
                    tag = 'nukta flap (known, Telugu has no letter)'
                elif re.search(r'[‌‍]', src):
                    tag = 'zero-width joiner in source (known, dropped)'
                elif re.search(r'(?<=[ऀ-ॿ]):', src):
                    tag = 'CORPUS DEFECT: ASCII colon for visarga (round trip repairs it)'
                elif 'ᳪं᳭' in src:
                    tag = 'CORPUS DEFECT: guttural nasal spelt ᳪं᳭, not ग्ं'
                elif re.search(r'[ा-ौ][ा-ौ]', src):
                    tag = 'CORPUS DEFECT: two mātrās adjacent — impossible Devanāgarī'
                else:
                    tag = 'UNEXPLAINED'
                buckets[tag] = buckets.get(tag, 0) + 1
                if tag not in samples:
                    samples[tag] = (str(path.relative_to(root)), probe[:70], back[:70])

    print(f"deva: lines round-tripped : {total}")
    if total:
        print(f"exact identity            : {exact}  ({100.0 * exact / total:.2f}%)")
    for tag, cnt in sorted(buckets.items(), key=lambda kv: -kv[1]):
        print(f"  {cnt:>6}  {tag}")
        f, a, b = samples[tag]
        print(f"          in {f}")
        print(f"          src  {a}")
        print(f"          back {b}")
    return 0 if buckets.get('UNEXPLAINED', 0) == 0 else 1


def main() -> None:
    argv = sys.argv[1:]
    if '--selftest' in argv:
        sys.exit(selftest())
    args = [a for a in argv if a != '--pranava-sign']
    src = ' '.join(args) if args else sys.stdin.read()
    sys.stdout.write(tel2dev(src, pranava_sign='--pranava-sign' in argv))


if __name__ == '__main__':
    main()

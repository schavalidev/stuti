#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Where the print's justification broke a word, and what the word should be.

    spacing.py <file.txt> [--json]

The Gītā Press text layer justifies its lines, and justification leaves a space inside a word.
Nothing in the text itself shows that. GRETIL does: strip every space from our Devanāgarī and
from GRETIL's IAST transliterated back, and the two agree; put the spaces back and they do not.
This prints each such verse with both spacings, and the exact pair to give add_meanings.py as an
edit, so the edit is copied rather than typed. It changes no file.

The skandha and adhyāya are read from the file's name (SSAA_*).

Two limits, both found by using it (22 Oct 2026). It only sees a break whose joined form is a
whole GRETIL token, so a break inside a longer GRETIL compound is invisible to it: over 4.24 and
4.25 it found one of the seven real breaks. And it looks only for spaces the print has and GRETIL
lacks, never the opposite — the layer also swallows spaces, which is the commoner fault, and for
those the signature is a word-final visarga, anusvāra or inflectional ending standing directly
before a consonant. An empty report from this tool therefore means nothing on its own; scan the
other way as well before concluding an adhyāya is clean.

What it flags is every space that GRETIL does not have, shortest left half first. Most of those
are not faults at all: the print separates पदम् and the next word where GRETIL runs them together
(तावद् यावद्, अनुग्रहाद् भगवतः), and that is the print's spacing, not a broken word. A justification
break shows itself by a left half of one or two letters that is no word at all — अङ् घ्रि, नो पस्पृशुर्,
प्रायुङ् क्त — and those sort to the top. The verse decides, not the tool: बद्धवाङ् मुक्तमूर्धजः is two
words and is flagged, and it is correct as printed. Copy the printed pair into add_meanings.py's
`edits` rather than typing it, which is the whole point of the tool.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import gretil_bhp
from dev2iast import dev2iast


def bare(s):
    """IAST with nothing left that spacing, punctuation or nasal spelling could differ in."""
    s = s.lower()
    s = re.sub(r"[\s|.'’\-]", '', s)
    return s.replace('ṁ', 'm').replace('ṃ', 'm').replace('ṅ', 'n').replace('ñ', 'n')


def units(text):
    parts = re.split(r'(?m)^--- (.*?) ---$\n', text)
    return list(zip(parts[1::2], parts[2::2]))


def main(path, as_json=False):
    m = re.search(r'(\d{2})(\d{2})_', os.path.basename(path))
    if not m:
        sys.exit(f'{path}: the name does not begin SSAA_')
    sk, ad = int(m.group(1)), int(m.group(2))
    G = gretil_bhp.verses()
    out = []
    for h, b in units(open(path, encoding='utf-8').read()):
        n = re.match(r'verse\s+(\d+)', h)
        if not n:
            continue
        n = int(n.group(1))
        g = G.get((sk, ad, n))
        if not g:
            continue
        words = {bare(w) for w in re.split(r'\s+', g) if bare(w)}
        deva = b.split('iast:')[0].replace('deva:', '').strip()
        for line in deva.split('\n'):
            ours = re.split(r'\s+', dev2iast(line).strip())
            for i in range(len(ours) - 1):
                a, c = ours[i], ours[i + 1]
                joined = bare(a + c)
                if not joined or joined not in words:
                    continue
                if bare(a) in words or bare(c) in words:
                    continue        # both halves are words of their own; the space is real
                # the Devanāgarī that holds the break, taken from the file as it stands
                toks = [w for w in re.split(r'[ \n]+', deva) if w]
                frag = next((f'{x} {y}' for x, y in zip(toks, toks[1:])
                             if bare(dev2iast(x) + dev2iast(y)) == joined), None)
                out.append(dict(verse=n, iast=f'{a} {c}', joined=a + c, deva=frag, left=len(bare(a)),
                                deva_fixed=frag.replace(' ', '') if frag else None))
    out.sort(key=lambda r: r['left'])
    if as_json:
        print(json.dumps(out, ensure_ascii=False, indent=1))
        return
    if not out:
        print(f'{os.path.basename(path)}: no broken word GRETIL can see')
    for r in out:
        print(f"verse {r['verse']}: {r['deva']} -> {r['deva_fixed']}   ({r['iast']} -> {r['joined']})")


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    main(a[0], '--json' in sys.argv)

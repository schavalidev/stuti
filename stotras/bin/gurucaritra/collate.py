#!/usr/bin/env python3
"""Lay one adhyāya's ślokas out across every witness, for adjudication.

No witness of this work is clean. The Teeka scan's four passes settle a great
deal by vote, but they are four readings of ONE edition, and the corpus rule is
that a text is collated against a genuinely independent edition before it is
written. So this puts side by side, per verse:

    T1..T4   the four OCR passes of DWISAHASRITeekaM
    D        the separate Dwisahasri edition
    anvaya   the author's own pada-split, printed under every śloka

Where the witnesses agree the reading is settled. Where they do not, the anvaya
usually decides it, because it spells the compound out. What none of them
settles is what the page image is for, and such places are to be left flagged
rather than repaired by guess.

    python3 collate.py 1
"""
import argparse, json, re, sys, unicodedata
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from adhyaya import ANCHORS
import vote as V

CACHE = Path(__file__).resolve().parents[1] / 'cache' / 'gurucaritra'


def strip(s):
    s = unicodedata.normalize('NFC', s).replace('‌', '').replace('‍', '')
    s = re.sub(r'[।\|॥]+', '|', s)
    return re.sub(r'\s+', ' ', s).strip()


def second_edition(adh):
    """Ślokas of one adhyāya from the Dwisahasri edition."""
    t = (CACHE / 'dvisahasri.txt').read_text(encoding='utf-8', errors='replace')
    i = t.find('नौम्युदेति')
    if i < 0:
        return {}
    # chapter spans, by the same anchors
    ends = {}
    for n, pat in ANCHORS.items():
        m = re.search(pat, t[i:])
        if m:
            ends[n] = i + m.start()
    lo = i
    for n in sorted(ends):
        if n == adh:
            hi = ends[n]
            break
        lo = ends[n]
    else:
        return {}
    return V.chapter(t, (lo, hi))


def anvayas(adh):
    """The author's pada-split lines, keyed by verse number, from pass 1."""
    t = (CACHE / 'teeka.txt').read_text(encoding='utf-8', errors='replace')
    sp = V.regions(t)[0]
    if adh not in sp:
        return {}
    out = {}
    for raw in t[sp[adh][0]:sp[adh][1]].split('\n'):
        line = raw.strip()
        m = V.END.search(line)
        if m and '+' in line:
            n = int(m.group(1).translate(V.DIGITS))
            out.setdefault(n, V.END.sub('', line).strip())
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('adhyaya', type=int)
    a = ap.parse_args()

    t = (CACHE / 'teeka.txt').read_text(encoding='utf-8', errors='replace')
    spans = V.regions(t)
    passes = [V.chapter(t, sp[a.adhyaya]) for sp in spans if a.adhyaya in sp]
    dwi = second_edition(a.adhyaya)
    anv = anvayas(a.adhyaya)

    nums = sorted({k for c in passes for k in c} | set(dwi))
    settled = 0
    for n in nums:
        reads = [c[n] for c in passes if n in c]
        tally = Counter(strip(r) for r in reads)
        top, votes = tally.most_common(1)[0] if tally else ('', 0)
        pick = next((r for r in reads if strip(r) == top), '')
        d = dwi.get(n, '')
        agree = bool(d) and strip(d) == top
        if len(tally) == 1 and agree:
            settled += 1
        flag = '  ' if (len(tally) == 1 and agree) else '**'
        print(f"{flag}{n:>3}  T[{votes}/{len(reads)}] {pick}")
        for v in tally:
            if v != top:
                print(f"      T-alt  {v}")
        if d and not agree:
            print(f"      D      {d}")
        if n in anv:
            print(f"      anvaya {anv[n]}")
        print()
    print(f"-- adhyāya {a.adhyaya}: {len(nums)} ślokas, "
          f"{settled} settled by all witnesses, {len(nums)-settled} need adjudication",
          file=sys.stderr)


if __name__ == '__main__':
    main()

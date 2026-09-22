#!/usr/bin/env python3
"""Vote one adhyāya's ślokas across the four OCR passes of the Teeka scan.

The four passes are independent readings of the same pages, so where they
disagree the majority is usually right. Where they do not agree 3-1 or better,
the verse is flagged: those are the places to read the page image, or the
author's own anvaya line, before writing anything down.

    python3 vote.py 1              # adhyāya 1, human-readable
    python3 vote.py 1 --json       # same, as JSON
"""
import argparse, json, re, sys, unicodedata
from collections import Counter
import sys as _s; _s.path.insert(0, str(Path(__file__).resolve().parent) if False else '.')
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from adhyaya import ANCHORS

CACHE = Path(__file__).resolve().parents[1] / 'cache' / 'gurucaritra'
END = re.compile(r'[।\|॥]{1,2}\s*([०-९]+)\s*[।\|॥]{1,2}\s*$')
DIGITS = str.maketrans('०१२३४५६७८९', '0123456789')
# Marathi commentary gives itself away by its own function words. These must be
# anchored: an unanchored `त्या ` matches inside प्रकृत्या and `हा ` inside पापहा,
# which silently dropped 7 of adhyāya 1's 41 ślokas before it was caught.
MARATHI = re.compile(
    r'(?<![\u0900-\u097f])'
    r'(आहे|आहेत|असे|असा|अशी|नाही|होते|केले|करून|करावे|जाणावे|जाणावेत|समजावे'
    r'|म्हणजे|पाहिजे|त्या|हा|ही|हे|तर|मग|इथे|वाचा|यांच्या|याचा|याची)'
    r'(?![\u0900-\u097f])')
ANCHOR = 'नौम्युदेति'

# Closing colophon of each adhyāya, as the print words it, used to bound a chapter.
def regions(text):
    """For each pass, the character span of every adhyāya.

    Cut on the colophon ANCHORS rather than on a running chapter counter: the
    ordinal inside a colophon is among the first things this scan's OCR
    destroys (five of twenty-three fail in every pass), while the chapter name
    is long and survives. Each anchor matches exactly once per pass.
    """
    starts = [m.start() for m in re.finditer(ANCHOR, text)]
    bounds = starts + [len(text)]
    spans = []
    for i in range(len(starts)):
        lo, hi = bounds[i], bounds[i + 1]
        ends = {}
        for n, pat in ANCHORS.items():
            m = re.search(pat, text[lo:hi])
            if m:
                ends[n] = lo + m.start()
        chap, prev = {}, lo
        for n in sorted(ends):
            chap[n] = (prev, ends[n])
            prev = ends[n]
        spans.append(chap)
    return spans


def norm(s):
    """Fold the differences that are not readings: spacing, ZWNJ, daṇḍa shape."""
    s = unicodedata.normalize('NFC', s)
    s = s.replace('‌', '').replace('‍', '')
    s = re.sub(r'[।\|॥]+', '|', s)
    return re.sub(r'\s+', ' ', s).strip()


def passes(text):
    offs = [m.start() for m in re.finditer(ANCHOR, text)]
    b = offs + [len(text)]
    return [text[b[i]:b[i + 1]] for i in range(len(offs))]


DEVA = re.compile(r'[\u0900-\u097f]')
# A page-noise line: mostly Latin, digits and scanner rubbish.
NOISE = re.compile(r'^[^\u0900-\u097f]*$')


def deva_share(s):
    letters = [c for c in s if not c.isspace()]
    if not letters:
        return 0.0
    return sum(1 for c in letters if DEVA.match(c)) / len(letters)


def chapter(text, span):
    """Ślokas within one chapter span, keyed by verse number."""
    out, buf = {}, []
    for raw in text[span[0]:span[1]].split('\n'):
        line = raw.strip()
        if not line or NOISE.match(line):
            continue
        if '+' in line or MARATHI.search(line) or deva_share(line) < 0.55:
            buf = []
            continue
        m = END.search(line)
        if not m:
            buf.append(line)
            buf = buf[-3:]
            continue
        body = ' '.join(buf + [END.sub('', line).strip()]).strip()
        buf = []
        if len(body) < 25:
            continue
        num = int(m.group(1).translate(DIGITS))
        if num not in out:
            out[num] = body
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('adhyaya', type=int)
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args()

    text = (CACHE / 'teeka.txt').read_text(encoding='utf-8', errors='replace')
    spans = regions(text)
    chapters = [chapter(text, sp[a.adhyaya]) for sp in spans
                if a.adhyaya in sp]
    nums = sorted({k for c in chapters for k in c})

    rows, split = [], 0
    for n in nums:
        readings = [c[n] for c in chapters if n in c]
        tally = Counter(norm(r) for r in readings)
        best, votes = tally.most_common(1)[0]
        # give back the unnormalised form of a winning reading
        pick = next(r for r in readings if norm(r) == best)
        agreed = votes >= 3 and len(tally) == 1
        if not agreed:
            split += 1
        rows.append({'num': n, 'text': pick, 'votes': votes,
                     'of': len(readings), 'unanimous': len(tally) == 1,
                     'variants': [v for v in tally if v != best]})

    if a.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1))
        return
    print(f'adhyāya {a.adhyaya}: {len(nums)} ślokas, '
          f'{len(nums) - split} unanimous, {split} split', file=sys.stderr)
    for r in rows:
        mark = ' ' if r['unanimous'] else '*'
        print(f"{mark}{r['num']:>3} [{r['votes']}/{r['of']}] {r['text']}")
        for v in r['variants']:
            print(f"        ALT: {v}")


if __name__ == '__main__':
    main()

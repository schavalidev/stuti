#!/usr/bin/env python3
"""Pull the Dvisāhasrī Gurucaritam's ślokas out of the DWISAHASRITeekaM scan.

That archive.org item holds the whole book OCR'd FOUR times in one djvu.txt.
The passes disagree, which is the point: four independent readings of the same
page can be voted, and the author's own anvaya (pada-split) line sits under
every śloka as a further check.

Layout of one page, in order:
    <śloka>   ... ।।N।।
    <anvaya>  ... joined with '+'        (the author's own pada-split)
    <Marathi commentary>                 (Deshmukh's rendering)
plus running heads, scanner noise and date stamps between.

Usage:  python3 extract.py -o passes.json
"""
import argparse, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from adhyaya import YOGA, ADITAH, ITI, ATHA, absolute, CONTENTS

ANCHOR = 'नौम्युदेति'          # first word of adhyāya 1, once per pass
END = re.compile(r'[।\|॥]{1,2}\s*([०-९]+)\s*[।\|॥]{1,2}\s*$')
DEVA = re.compile(r'[ऀ-ॿ]')
MARATHI = re.compile(
    r'(आहे|आहेत|असे|असा|अशी|याचा|याची|यांच्या|नाही|होते|केले|करून|करावे'
    r'|जाणावे|समजावे|म्हणजे|पाहिजे|कोणी|त्या |हा |ही |हे |तर |मग |इथे|वाचा)')
DIGITS = str.maketrans('०१२३४५६७८९', '0123456789')


def split_passes(text):
    offs = [m.start() for m in re.finditer(ANCHOR, text)]
    if not offs:
        sys.exit('extract: anchor not found — wrong file?')
    b = offs + [len(text)]
    return [text[b[i]:b[i + 1]] for i in range(len(offs))]


def classify(line):
    if not END.search(line) or not DEVA.search(line) or len(line) < 30:
        return None
    if '+' in line:
        return 'ANVAYA'
    if MARATHI.search(line):
        return None
    if not re.search(r'[।\|]', END.sub('', line)):
        return None            # a śloka carries an internal half-verse daṇḍa
    return 'SLOKA'


def harvest(seg):
    out, yoga, adh, last = [], 'ज्ञानयोग', 1, None
    for raw in seg.split('\n'):
        line = raw.strip()
        if not line:
            continue
        ym = YOGA.search(line)
        if ym:
            yoga = ym.group(1)
        # Chapter boundary. Prefer an explicit "āditaḥ" absolute number.
        moved = False
        for pat, use_yoga in ((ADITAH, False), (ITI, True), (ATHA, True)):
            m = pat.search(line)
            if not m:
                continue
            n = absolute(m.group(1), yoga if use_yoga else '')
            if n and 1 <= n <= 23:
                adh, last, moved = n, None, True
                break
        if moved:
            continue
        kind = classify(line)
        if kind == 'SLOKA':
            n = int(END.search(line).group(1).translate(DIGITS))
            last = {'adhyaya': adh, 'num': n,
                    'sloka': END.sub('', line).strip(), 'anvaya': ''}
            out.append(last)
        elif kind == 'ANVAYA' and last is not None and not last['anvaya']:
            last['anvaya'] = END.sub('', line).strip()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default=str(Path(__file__).resolve()
                                           .parents[1] / 'cache' / 'gurucaritra'))
    ap.add_argument('-o', '--out', default='passes.json')
    a = ap.parse_args()
    text = (Path(a.cache) / 'teeka.txt').read_text(encoding='utf-8',
                                                   errors='replace')
    data = [harvest(p) for p in split_passes(text)]
    for i, d in enumerate(data, 1):
        per = {}
        for r in d:
            per[r['adhyaya']] = max(per.get(r['adhyaya'], 0), r['num'])
        got = sorted(per)
        print(f'pass {i}: {len(d):>5} ślokas, adhyāyas {got[0]}–{got[-1]} '
              f'({len(got)} of 23)', file=sys.stderr)
    Path(a.out).write_text(json.dumps(data, ensure_ascii=False, indent=1),
                           encoding='utf-8')
    print(f'wrote {a.out}', file=sys.stderr)


if __name__ == '__main__':
    main()

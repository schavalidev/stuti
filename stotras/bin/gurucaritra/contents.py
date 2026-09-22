#!/usr/bin/env python3
"""Parse the Dvisāhasrī's own table of contents out of the Teeka scan.

The book prints, for each adhyāya, its name, its page range, and then a list of
the episodes it contains with the verse range of each. That table is worth more
than it looks:

  * the last episode's closing verse number is the chapter's verse count, which
    is ground truth to validate the extracted ślokas against;
  * the episode list is the `Sections:` field this corpus's file format wants,
    written by the book itself rather than invented here.

Usage:  python3 contents.py [-o contents.json]
"""
import argparse, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from adhyaya import ORDINALS

DIGITS = str.maketrans('०१२३४५६७८९', '0123456789')
# "<ordinal>ोऽध्यायः। <name>। : <page>-<page> :"
HEAD = re.compile(r'([ऀ-ॿ]+?)ोऽध्यायः[।\s]*([ऀ-ॿ‌]+?)[।\s]*:\s*([०-९]+)\s*[-–]\s*([०-९0-9]+)')
# "<episode text> (<from>-<to>)" or "(<n>)"
EPISODE = re.compile(r'([^():]+?)\s*[\(（]\s*([०-९]+)\s*(?:[-–]\s*([०-९]+))?\s*[\)）]')
NOISE = re.compile(r'[A-Za-z@®~„^/\\|°<>%&=*+]')


def deint(s):
    return int(s.translate(DIGITS))


def parse(text):
    """Return {adhyaya: {name, pages, episodes:[(label, lo, hi)], verses}}."""
    start = text.find('ज्ञानयोगः।')
    if start < 0:
        sys.exit('contents: TOC not found')
    block = text[start:start + 40000]
    heads = list(HEAD.finditer(block))
    out = {}
    for i, m in enumerate(heads):
        n = ORDINALS.get(m.group(1))
        if not n or n in out:
            continue
        body = block[m.end():heads[i + 1].start() if i + 1 < len(heads)
                     else m.end() + 1500]
        eps = []
        for em in EPISODE.finditer(body):
            label = ' '.join(em.group(1).split())
            if NOISE.search(label) or len(label) < 4:
                continue
            lo = deint(em.group(2))
            hi = deint(em.group(3)) if em.group(3) else lo
            eps.append((label, lo, hi))
        if not eps:
            continue
        out[n] = {'name': m.group(2).replace('‌', ''),
                  'pages': [deint(m.group(3)), deint(m.group(4))],
                  'episodes': eps,
                  'verses': max(h for _, _, h in eps)}
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default=str(Path(__file__).resolve()
                                           .parents[1] / 'cache' / 'gurucaritra'))
    ap.add_argument('-o', '--out', default='contents.json')
    a = ap.parse_args()
    text = (Path(a.cache) / 'teeka.txt').read_text(encoding='utf-8',
                                                   errors='replace')
    c = parse(text)
    for n in sorted(c):
        d = c[n]
        print(f"{n:>3}  {d['verses']:>4} verses  {len(d['episodes']):>2} episodes  "
              f"pp.{d['pages'][0]}-{d['pages'][1]}  {d['name']}", file=sys.stderr)
    print(f"-- {len(c)} of 23 adhyāyas recovered", file=sys.stderr)
    Path(a.out).write_text(json.dumps(c, ensure_ascii=False, indent=1),
                           encoding='utf-8')


if __name__ == '__main__':
    main()

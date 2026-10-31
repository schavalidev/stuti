#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gather the checkers' findings and lay them out for the judges, blind.

    python3 hyphenation/findings.py prepare      # work/verify/*.tsv → work/judge/in/*.tsv
    python3 hyphenation/findings.py settle RESULTS.json   # judges' votes → corrections.tsv

A finding is a word where the checker disagreed with the decider. Each goes to
three judges as an A/B pair, with which side is which chosen per line, so no
judge knows whose answer is whose. A correction is adopted only when at least
two judges prefer the checker's answer; otherwise the decider's answer stands.
"""
import sys, re, json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / 'bin'))
from hyphenate import only_hyphens_added
W = HERE / 'work'


def load_findings():
    rows = []
    for f in sorted((W / 'verify').glob('*.tsv')):
        inp = {l.split('\t')[0]: l.split('\t')[1] for l in (W / 'in' / f.name).read_text(encoding='utf-8').splitlines() if '\t' in l}
        out = {l.split('\t')[0]: l.split('\t')[1].strip() for l in (W / 'out' / f.name).read_text(encoding='utf-8').splitlines() if '\t' in l}
        for l in f.read_text(encoding='utf-8').splitlines():
            p = l.split('\t')
            if len(p) < 2 or p[0] not in out:
                continue
            w, fix = p[0], p[1].strip()
            was = out[w]
            if fix in ('=', w):
                fix = '='
            if was in ('=', w):
                was = '='
            if fix == was:
                continue
            if fix != '=' and not only_hyphens_added(w, fix):
                continue                      # the checker changed a letter: not a usable correction
            rows.append({'w': w, 'decider': was, 'checker': fix, 'ctx': inp.get(w, '')[:80]})
    return rows


def prepare():
    rows = load_findings()
    (W / 'judge' / 'in').mkdir(parents=True, exist_ok=True)
    SIZE = 100
    for k in range(0, len(rows), SIZE):
        chunk = rows[k:k + SIZE]
        name = f'j{k // SIZE + 1:03d}'
        lines = []
        for i, r in enumerate(chunk):
            r['checker_is_a'] = (i + k) % 2 == 0
            A, B = (r['checker'], r['decider']) if r['checker_is_a'] else (r['decider'], r['checker'])
            lines.append(f"{i + 1}\t{r['w']}\t{A}\t{B}\t{r['ctx']}")
        (W / 'judge' / 'in' / f'{name}.tsv').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    json.dump(rows, open(W / 'judge' / 'findings.json', 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'{len(rows)} findings → {(len(rows) + SIZE - 1) // SIZE} judge slices of ≤{SIZE}')


def settle(path):
    rows = json.load(open(W / 'judge' / 'findings.json', encoding='utf-8'))
    results = json.load(open(path, encoding='utf-8'))
    SIZE = 100
    adopted, kept, neither = [], 0, 0
    for res in results:
        if not res:
            continue
        k = (int(res['id'][1:]) - 1) * SIZE
        for i in range(min(SIZE, len(rows) - k)):
            r = rows[k + i]
            votes = []
            for judge in res['votes']:
                v = next((x for x in judge if x['n'] == i + 1), None)
                if v:
                    votes.append(v['verdict'])
            for_checker = sum(1 for v in votes if v == ('A' if r['checker_is_a'] else 'B'))
            if for_checker >= 2:
                adopted.append(r)
            elif votes.count('neither') >= 2:
                neither += 1
                adopted.append({**r, 'checker': '='})   # both faulted: fall back to solid
            else:
                kept += 1
    out = HERE / 'corrections.tsv'
    out.write_text('word\tdecider\tadopted\n' + ''.join(f"{r['w']}\t{r['decider']}\t{r['checker']}\n" for r in adopted), encoding='utf-8')
    print(f'{len(adopted)} corrections adopted ({neither} of them to solid because the judges faulted both); {kept} decider answers kept → {out.name}')


if __name__ == '__main__':
    if sys.argv[1] == 'prepare':
        prepare()
    else:
        settle(sys.argv[2])

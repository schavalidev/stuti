#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Replace single meaning lines in a glossed file, verifying nothing else moves.

    fix_meanings.py <file.txt> <corrections.json> [--check]

corrections.json holds:
  {"verses": {"<verse>" | "colophon": {"en": ..., "tel": ..., "hi": ...}}}
with only the fields that change. This is the second reader's tool: it can change an `en:`,
`tel:` or `hi:` line that already exists and nothing else. The Devanāgarī, the IAST, the header
and the number of units must come out byte for byte as they went in, or it stops.
"""
import json, re, sys
sys.path.insert(0, __import__('os').path.dirname(__file__))
from add_meanings import units, key, stotra


def main(path, cpath, check=False):
    text = open(path, encoding='utf-8').read()
    C = json.load(open(cpath, encoding='utf-8')).get('verses', {})
    head, us = units(text)
    have = [key(h) for h, _ in us]
    absent = [k for k in C if k not in have]
    if absent:
        sys.exit(f'{path}: corrections for units the file does not have: {absent[:8]}')
    out, changed = [head], 0
    for h, body in us:
        k = key(h)
        for f, v in C.get(k, {}).items():
            if f not in ('en', 'tel', 'hi'):
                sys.exit(f'{path}: {k}: only en, tel and hi can be corrected, not {f!r}')
            v = v.strip()
            if not v or '\n' in v:
                sys.exit(f'{path}: {k} {f} is empty or runs over one line')
            new, n = re.subn(rf'(?m)^{f}: .*$', lambda _: f'{f}: {v}', body, count=1)
            if n != 1:
                sys.exit(f'{path}: {k} has no {f} line to correct')
            changed += new != body
            body = new
        out.append(f'--- {h} ---\n{body}')
    new = ''.join(out)
    if stotra(text) != stotra(new) or len(units(new)[1]) != len(us) or units(new)[0] != head:
        sys.exit(f'{path}: something other than a meaning line moved')
    if check:
        print(f'{path}: OK — {changed} lines would change')
        return
    open(path, 'w', encoding='utf-8').write(new)
    print(f'{path}: {changed} meaning lines corrected')


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    main(a[0], a[1], check='--check' in sys.argv)

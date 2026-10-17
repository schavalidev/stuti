#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Which corpus files still have verse units with no meanings, and how many.

    unglossed.py [<path> ...] [--all]

With no argument it walks the whole corpus. It prints one line per file — the count of units
with no `en:` and the file's total — then a per-folder summary. `--all` lists every file rather
than the first forty.

A unit whose header is `names` is a nāmāvalī table that carries its glosses in its own columns,
so it is counted separately and is not work to be done.
"""
import os, re, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def units(text):
    parts = re.split(r'(?m)^--- (.*?) ---$\n', text)
    return list(zip(parts[1::2], parts[2::2]))


def scan(paths):
    rows, tables = [], 0
    for p in paths:
        try:
            t = open(p, encoding='utf-8').read()
        except OSError:
            continue
        us = units(t)
        if not us:
            continue
        miss = [h for h, b in us if not re.search(r'(?m)^en:', b)]
        tables += sum(1 for h in miss if h.strip().startswith(('names', 'note on')))
        miss = [h for h in miss if not h.strip().startswith(('names', 'note on'))]
        if miss:
            rows.append((len(miss), len(us), os.path.relpath(p, ROOT)))
    return rows, tables


def main(args):
    show_all = '--all' in args
    args = [a for a in args if not a.startswith('--')]
    paths = []
    for a in (args or [ROOT]):
        if os.path.isfile(a):
            paths.append(a)
            continue
        for dp, dn, fn in os.walk(a):
            if os.sep + 'bin' in dp or os.sep + '.git' in dp:
                continue
            paths += [os.path.join(dp, f) for f in fn if f.endswith('.txt')]
    rows, tables = scan(sorted(paths))
    rows.sort(key=lambda r: r[2])
    for miss, tot, rel in (rows if show_all else rows[:40]):
        print(f'{miss:5d} / {tot:<5d} {rel}')
    if not show_all and len(rows) > 40:
        print(f'... and {len(rows) - 40} more files (--all to list them)')
    folders = collections.Counter()
    files = collections.Counter()
    for miss, tot, rel in rows:
        k = '/'.join(rel.split('/')[:2]) if '/' in rel else rel
        folders[k] += miss
        files[k] += 1
    print()
    for k, n in folders.most_common():
        print(f'{n:7d} units in {files[k]:4d} files  {k}')
    print(f'\n{sum(r[0] for r in rows)} units in {len(rows)} files have no meanings; '
          f'{tables} nāmāvalī tables carry their glosses in their columns and are not counted.')


if __name__ == '__main__':
    main(sys.argv[1:])

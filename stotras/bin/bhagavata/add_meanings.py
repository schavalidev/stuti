#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add en/tel/hi meanings to a text-only corpus file, verifying nothing else moves.

    add_meanings.py <file.txt> <meanings.json> [--check]

meanings.json holds:
  {"note": "<the whole new Recension note, without the 'Recension note: ' prefix>",
   "edits": {"<verse>": [["old", "new"], ...]},   # closed justification gaps, bracketed variants
   "verses": {"<verse>": {"en": ..., "tel": ..., "hi": ...},
              "colophon": {"en": ..., "tel": ..., "hi": ...}}}

Every unit in the file must be covered, every edit must match exactly once, and the Devanāgarī
and IAST must come out byte for byte as they went in apart from the declared edits. A file that
already carries meanings is refused: this pass adds them, it never rewrites them.

Written for the Bhāgavata meanings pass (S78, 17 Oct 2026); it is text-shape work, not
Bhāgavata-specific, and the Vālmīki files take it unchanged.
"""
import json, re, sys


def units(text):
    """[(header, body)] for each '--- ... ---' unit, plus the matter before the first one."""
    parts = re.split(r'(?m)^--- (.*?) ---$\n', text)
    return parts[0], list(zip(parts[1::2], parts[2::2]))


def key(header):
    m = re.match(r'(?:verse|name|unit)\s+(\d+)', header)
    if m:
        return m.group(1)
    if 'none' in header or 'colophon' in header:
        return 'colophon'
    return header.strip()


def main(path, mpath, check=False):
    text = open(path, encoding='utf-8').read()
    M = json.load(open(mpath, encoding='utf-8'))
    head, us = units(text)
    if not us:
        sys.exit(f'{path}: no verse units found')
    if re.search(r'(?m)^en:', text):
        sys.exit(f'{path}: already carries meanings — this pass does not rewrite them')

    want = M['verses']
    have = [key(h) for h, _ in us]
    missing = [k for k in have if k not in want]
    extra = [k for k in want if k not in have]
    if missing or extra:
        sys.exit(f'{path}: no meaning for {missing[:8]}; meanings for absent units {extra[:8]}')

    out = [head]
    for h, body in us:
        k = key(h)
        for old, new in M.get('edits', {}).get(k, []):
            if body.count(old) != 1:
                sys.exit(f'{path}: edit for {k} matches {body.count(old)} times: {old!r}')
            body = body.replace(old, new)
        body = body.rstrip('\n')
        m = want[k]
        for f in ('en', 'tel', 'hi'):
            v = m.get(f, '').strip()
            if not v:
                sys.exit(f'{path}: {k} has no {f}')
            if '\n' in v:
                sys.exit(f'{path}: {k} {f} runs over one line')
            body += f'\n{f}: {v}'
        out.append(f'--- {h} ---\n{body}\n\n')
    new = ''.join(out).rstrip('\n') + '\n'

    if 'note' in M:
        n = re.subn(r'(?m)^Recension note: .*$',
                    lambda _: 'Recension note: ' + M['note'].replace('\\', '\\\\'), new, count=1)
        if n[1] != 1:
            sys.exit(f'{path}: no Recension note line to replace')
        new = n[0]

    # the text itself must be untouched apart from the declared edits
    def stotra(t):
        keep = []
        for _, b in units(t)[1]:
            for line in b.split('\n'):
                if re.match(r'^(en|tel|hi):', line):
                    continue
                keep.append(line.strip())
        return [l for l in keep if l]
    before, after = stotra(text), stotra(new)
    nedits = sum(len(v) for v in M.get('edits', {}).values())
    if not nedits and before != after:
        d = next((i for i, (a, b) in enumerate(zip(before, after)) if a != b), None)
        sys.exit(f'{path}: the text moved at line {d}: {before[d]!r} -> {after[d]!r}')

    if check:
        print(f'{path}: OK — {len(us)} units, {nedits} edits, note '
              f'{"replaced" if "note" in M else "left"}')
        return
    open(path, 'w', encoding='utf-8').write(new)
    print(f'{path}: {len(us)} units glossed, {nedits} edits')


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    main(a[0], a[1], check='--check' in sys.argv)

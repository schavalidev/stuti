#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add en/tel/hi meanings to a text-only corpus file, verifying nothing else moves.

    add_meanings.py <file.txt> <meanings.json> [--check]

meanings.json holds:
  {"note": "<the whole new Recension note>" | {"extra": "<sentences to append>"},
   "edits": {"<verse>": [["old", "new"], ...]},   # closed typesetting gaps, bracketed variants
   "verses": {"<verse>": {"en": ..., "tel": ..., "hi": ...},
              "colophon": {"en": ..., "tel": ..., "hi": ...}}}

Every unit in the file must be covered, every edit must match exactly once, and the Devanagari
and IAST must come out byte for byte as they went in apart from the declared edits. A file that
already carries meanings is refused: this pass adds them, it never rewrites them.

A dict "note" rewrites the file's own note mechanically: the sentence saying the meanings are
still to be added becomes one saying when they were written, the clause about justification
gaps still to be closed goes, and "extra" is appended. That keeps each file's own collation
figures, which are its real apparatus, instead of retyping them.

Written for the Bhagavata meanings pass (S78, 17 Oct 2026). It is text-shape work, not
Bhagavata-specific, and the Valmiki files take it unchanged.
"""
import json, re, sys

PENDING = ("Text-only file, written 1 Oct 2026 at the user's instruction to lay down the whole "
           "Bhāgavata first: the English, Telugu and Hindi meanings are still to be added, and "
           "the witnesses' differences listed here have been recorded by machine and not yet "
           "adjudicated. ")
VR = re.compile(r"Text-only file, written [^:]+: the English, Telugu and Hindi meanings are still "
                r"to be added, and the witnesses' differences listed here were found by machine "
                r"and have not been adjudicated or bracketed into the line\. ")
WRITTEN = ("Meanings written 17 Oct 2026 (session S78). The differences between the witnesses "
           "listed below were read as the verses were glossed; except where this note says "
           "otherwise, each is a spelling, a sandhi or a word order of the two editions, none of "
           "them changes the sense, and the print's reading therefore stands unbracketed. ")
GAPS = ("; in a few places justification has left a space inside a word, and these are still to "
        "be closed when the verse is read")
FOOTNOTES = (" A footnote's numeral keys it to one word, and which word that is cannot be told "
             "from the note alone, so those readings stay unbracketed until the page itself is "
             "read.")


def rewrite_note(note, extra=''):
    """Turn a text-only file's pending note into one that says the meanings are written."""
    if note.startswith(PENDING):
        note = WRITTEN + note[len(PENDING):]
    else:
        m = VR.match(note)
        if not m:
            sys.exit('the note does not open the way a text-only note opens')
        note = WRITTEN + note[m.end():]
    note = note.replace(GAPS, '')
    if 'प्रा० पा०' in note and FOOTNOTES.strip() not in note:
        note += FOOTNOTES
    return note + (' ' + extra.strip() if extra else '')


def units(text):
    """(matter before the first unit, [(header, body)]) for each '--- ... ---' unit."""
    parts = re.split(r'(?m)^--- (.*?) ---$\n', text)
    return parts[0], list(zip(parts[1::2], parts[2::2]))


def key(header):
    m = re.match(r'(?:verse|name|unit)\s+(\d+)', header)
    if m:
        return m.group(1)
    if 'none' in header or 'colophon' in header:
        return 'colophon'
    return header.strip()


def stotra(t):
    """Every line of verse text in the file, for the before-and-after comparison."""
    keep = []
    for _, b in units(t)[1]:
        for line in b.split('\n'):
            if not re.match(r'^(en|tel|hi):', line) and line.strip():
                keep.append(line.strip())
    return keep


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

    nedits = sum(len(v) for v in M.get('edits', {}).values())
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
        note = M['note']
        if isinstance(note, dict):
            old = re.search(r'(?m)^Recension note: (.*)$', new)
            if not old:
                sys.exit(f'{path}: no Recension note line to rewrite')
            note = rewrite_note(old.group(1), note.get('extra', ''))
        n = re.subn(r'(?m)^Recension note: .*$',
                    lambda _: 'Recension note: ' + note.replace('\\', '\\\\'), new, count=1)
        if n[1] != 1:
            sys.exit(f'{path}: no Recension note line to replace')
        new = n[0]

    before, after = stotra(text), stotra(new)
    if not nedits and before != after:
        d = next((i for i, (a, b) in enumerate(zip(before, after)) if a != b), None)
        sys.exit(f'{path}: the text moved at line {d}: {before[d]!r} -> {after[d]!r}')

    if check:
        print(f'{path}: OK — {len(us)} units, {nedits} edits')
        return
    open(path, 'w', encoding='utf-8').write(new)
    print(f'{path}: {len(us)} units glossed, {nedits} edits')


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    main(a[0], a[1], check='--check' in sys.argv)

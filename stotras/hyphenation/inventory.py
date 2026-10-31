#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Collect every distinct word the hyphenation pass has to decide.

    python3 hyphenation/inventory.py > hyphenation/inventory.json

Each word is decided once, for the whole corpus, so the same compound is never
split one way in one text and another way in the next. Only Sanskrit verse
lines are read: the Awadhi, Hindi, Braj and Tamil texts are not Sanskrit
compounds; a line carrying svara marks is Vedic chant with its own tradition
of word division; the veda/ shelf is that throughout; and a line that already
holds a compound hyphen was analysed by its author, whose reading stands.
"""
import json, re, sys, pathlib, collections

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'bin'))
from hyphenate import units_of, body, letters

ACCENT = re.compile(r'[̀-̂̄-ͯ]')   # svara marks; ̃ (U+0303) excepted
EDGE = re.compile(r"^[|,;:.!?—–\"“”‘’\[\]{}0-9]+|[|,;:.!?—–\"“”‘’\[\]{}0-9]+$")
LANG = re.compile(r'^Language:\s*(.*)$', re.M)
MIN_LETTERS = 7
# A word carrying a Tamil letter is Tamil, whatever the file is labelled
# (some Sanskrit-labelled files hold Tamil passages). The user ruled on
# 31 Oct 2026 that Tamil is left exactly as it is.
TAMIL = re.compile(r'[ḻṟṉ]')


def eligible(path, text):
    if path.parts[0] in ('veda', 'hyphenation'):
        return False
    m = LANG.search(text)
    return not m or m.group(1).startswith('Sanskrit')


def main():
    words = collections.Counter()
    where = {}
    files = lines_read = 0
    for path in sorted(ROOT.rglob('*.txt')):
        rel = path.relative_to(ROOT)
        text = path.read_text(encoding='utf-8')
        if not eligible(rel, text):
            continue
        lines = text.split('\n')
        seen_any = False
        for dnums, inums in units_of(lines):
            if len(dnums) != len(inums):
                continue
            for n in inums:
                line = body(lines[n])
                if ACCENT.search(line) or re.search(r'\w-\w', line):
                    continue
                lines_read += 1
                seen_any = True
                for tok in line.split():
                    w = EDGE.sub('', tok)
                    if not w or re.search(r'[()\d-]', w) or len(letters(w)) < MIN_LETTERS \
                            or TAMIL.search(w):
                        continue
                    words[w] += 1
                    if w not in where:
                        where[w] = (str(rel), line.strip()[:110])
        files += seen_any
    out = [{'w': w, 'n': n, 'file': where[w][0], 'line': where[w][1]}
           for w, n in sorted(words.items())]
    json.dump(out, sys.stdout, ensure_ascii=False)
    print(f'{files} files, {lines_read} verse lines, {len(out)} distinct words '
          f'of {MIN_LETTERS}+ letters, {sum(words.values())} occurrences', file=sys.stderr)


if __name__ == '__main__':
    main()

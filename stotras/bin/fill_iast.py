#!/usr/bin/env python3
"""Fill empty `iast:` fields in a corpus file from the `deva:` above them.

Authoring a 40-unit vidhi file by hand means typing IAST 40 times, and the
corpus convention is specific enough (ṁ not ṃ, ṛ not r̥, plain e/o, accents
stripped) that hand-typing drifts. Write the file with `iast:` left blank and
run this; it fills each one from its unit's Devanāgarī using dev2iast.

Only *empty* iast fields are touched. An iast line that already has content is
left exactly as it stands, so this can be re-run safely and will never rewrite
text a human deliberately set.

Usage:
    python3 fill_iast.py <file.txt> [--check]

    --check  report what would change, write nothing (exit 1 if any would)
"""
import argparse
import sys

sys.path.insert(0, __file__.rsplit('/', 1)[0])
from dev2iast import dev2iast  # noqa: E402

LABELS = ('vidhi:', 'deva:', 'iast:', 'en:', 'tel:', 'hi:')


def block(lines: list, i: int) -> tuple:
    """Value of the field whose label is at line i, and the line after it.

    Fields are written either inline ("en: text") or with the value on the
    following lines ("deva:\\n<text>"), and both forms occur in this corpus.
    """
    label = next(l for l in LABELS if lines[i].startswith(l))
    inline = lines[i][len(label):].strip()
    if inline:
        return inline, i + 1
    j = i + 1
    buf = []
    while j < len(lines) and not lines[j].startswith(LABELS) \
            and not lines[j].startswith('--- '):
        buf.append(lines[j])
        j += 1
    return '\n'.join(buf).strip(), j


def fill(text: str) -> tuple:
    lines = text.split('\n')
    out = []
    i = 0
    filled = 0
    deva = ''
    while i < len(lines):
        ln = lines[i]
        if ln.startswith('deva:'):
            deva, nxt = block(lines, i)
            out += lines[i:nxt]
            i = nxt
            continue
        if ln.startswith('iast:'):
            cur, nxt = block(lines, i)
            if not cur and deva:
                out.append('iast:')
                out.append(dev2iast(deva))
                filled += 1
            else:
                out += lines[i:nxt]
            i = nxt
            continue
        out.append(ln)
        i += 1
    return '\n'.join(out), filled


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('file')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    with open(a.file, encoding='utf-8') as fh:
        src = fh.read()
    new, n = fill(src)
    if a.check:
        print(f'{a.file}: {n} empty iast field(s) would be filled')
        sys.exit(1 if n else 0)
    if n:
        with open(a.file, 'w', encoding='utf-8') as fh:
            fh.write(new)
    print(f'{a.file}: filled {n} iast field(s)')


if __name__ == '__main__':
    main()

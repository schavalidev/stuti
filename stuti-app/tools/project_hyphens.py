#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Put the IAST's compound hyphens into the Devanāgarī beside it.

    python3 stuti-app/tools/project_hyphens.py [--write] [path ...]
    (default path: design_handoff_stuti/app)

The bundled texts have carried hyphenated IAST — `mahiṣāsura-mardini` — since
they were written, while the Devanāgarī on the line above stayed solid. A
reciter reading the Devanāgarī gets no help finding where a long compound
breaks, and the two scripts disagree about the same word. This copies the
analysis that is already there onto the Devanāgarī. It invents nothing: every
hyphen it writes stands at a hyphen somebody placed in the IAST.

Where a hyphen cannot be placed it is skipped and reported, never forced. That
happens when the join falls inside a single akṣara rather than between two —
`śiraḥ + adhinivāsini` is written `शिरोऽधिनिवासिनि`, where the `o` is made out
of both words at once and no cut leaves two readable pieces. The IAST does not
hyphenate those either, so in practice the two agree.

It does not split prefixes (`adhi-nivāsini`). The IAST analysis does not, and
adding them would be new editorial work rather than a copy of existing work.

Safety: for every file, removing every hyphen this tool wrote must give back
the file byte for byte. A file that fails that check is not written.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'stotras' / 'bin'))
from dev2iast import dev2iast

MATRA = set('ािीुूृॄॅॆेै'
            'ॉॊोौॢॣ')
SIGNS = set('ँंः़॒॑॓॔᳚ᳵᳶ')
VIRAMA = '्'
DEVA = re.compile(r'[ऀ-ॿ]')
FIELD = re.compile(r'^(\s*)(deva|iast): "(.*)",?\s*$')


def aksaras(word):
    """Split a Devanāgarī word into akṣaras: a consonant cluster plus its vowel."""
    out, i, n = [], 0, len(word)
    while i < n:
        j = i + 1
        while j < n and (word[j] in MATRA or word[j] in SIGNS or word[j] == VIRAMA):
            if word[j] == VIRAMA:
                j += 1
                if j < n and DEVA.match(word[j]):
                    j += 1
                continue
            j += 1
        out.append(word[i:j])
        i = j
    return out


NOT_LETTERS = re.compile(r"[^A-Za-zāīūṛṝḷḹṁṃḥṅñṇṭḍśṣ'’]")


def letters(text):
    """The letters of a romanisation: no daṇḍa, digit, space or punctuation."""
    return NOT_LETTERS.sub('', text)


def project_line(deva, iast):
    """Return (hyphenated Devanāgarī line, skipped joins) for one line.

    The two scripts are aligned over the whole line rather than word by word,
    because they do not always divide the words the same way: the Devanāgarī
    writes `तमाश्रये` where the IAST writes `tam āśraye`, and the IAST writes
    `naṭī-naṭa-nāyaka` where the Devanāgarī writes `नटीनट नायक`. Spaces are
    therefore ignored on both sides and only the letters are matched.
    """
    # the Devanāgarī line as akṣaras, remembering where each one starts.
    # A daṇḍa or a digit romanises to no letter and can never be a compound
    # boundary, so it is left out of the comparison altogether — the IAST
    # fields keep the Devanāgarī `।` and `॥` while dev2iast writes `|` and
    # `||`, and matching those would fail every line that ends in one.
    units, cum, total = [], [], ''
    for m in re.finditer(r'[\u0900-\u097F\u200C\u200D]+', deva):
        at = m.start()
        for a in aksaras(m.group(0)):
            piece = letters(dev2iast(a))
            if piece:
                units.append((at, a))
                total += piece
                cum.append(len(total))
            at += len(a)
    if not units:
        return deva, []

    # the IAST as written, with spaces and hyphens taken out, and the
    # letter offset of every hyphen that is not a line-wrap mark
    flat, marks = '', []
    for ch in iast.strip():
        if ch == '-':
            if flat:
                marks.append(len(flat))
        elif letters(ch):
            flat += ch

    if total != flat:
        return deva, [('not comparable', deva[:44], iast[:44])]

    skipped, cuts = [], set()
    for at in marks:
        if at in cum:
            k = cum.index(at) + 1
            if k < len(units) and units[k][0] > 0 and deva[units[k][0] - 1] != ' ':
                cuts.add(units[k][0])
        else:
            skipped.append(('inside an akṣara', deva[:44], iast[:44]))

    out = ''.join(('-' if i in cuts else '') + ch for i, ch in enumerate(deva))
    return out, skipped


def project_field(deva, iast):
    """Project across a whole field, line by line."""
    dl, il = deva.split('\\n'), iast.split('\\n')
    if len(dl) != len(il):
        return deva, [('line counts differ', deva[:44], iast[:44])]
    skipped, out = [], []
    for d, i in zip(dl, il):
        new, sk = project_line(d, i)
        skipped.extend(sk)
        out.append(new)
    return '\\n'.join(out), skipped


def convert(text):
    """Return (new text, hyphens added, skipped) for one file's source."""
    lines = text.split('\n')
    pending = None
    added, skipped = 0, []
    for n, line in enumerate(lines):
        m = FIELD.match(line)
        if not m:
            continue
        if m.group(2) == 'deva':
            pending = (n, m)
            continue
        if pending is None:
            continue
        dn, dm = pending
        pending = None
        new, sk = project_field(dm.group(3), m.group(3))
        skipped.extend(sk)
        if new != dm.group(3):
            added += new.count('-') - dm.group(3).count('-')
            lines[dn] = lines[dn].replace('"' + dm.group(3) + '"', '"' + new + '"')
    return '\n'.join(lines), added, skipped


def main():
    argv = sys.argv[1:]
    write = '--write' in argv
    args = [a for a in argv if a != '--write']
    roots = [pathlib.Path(a) for a in args] or [ROOT / 'design_handoff_stuti' / 'app']
    paths = []
    for r in roots:
        if r.is_dir():
            paths.extend(sorted(r.glob('stuti-text-*.js')) + sorted(r.glob('stuti-text-*.ts')))
        else:
            paths.append(r)

    total, touched, reports = 0, 0, []
    for p in paths:
        text = p.read_text(encoding='utf-8')
        new, added, skipped = convert(text)
        if added:
            if new.replace('-', '') != text.replace('-', ''):
                print(f'REFUSED {p.name}: the text changed by more than hyphens')
                continue
            total += added
            touched += 1
            if write:
                p.write_text(new, encoding='utf-8')
        if skipped:
            reports.append((p.name, skipped))

    verb = 'wrote' if write else 'would write'
    print(f'{verb} {total} hyphens into the Devanāgarī of {touched} files')
    kinds = {}
    for name, sk in reports:
        for why, a, b in sk:
            kinds.setdefault(why, []).append((name, a, b))
    for why, items in sorted(kinds.items(), key=lambda kv: -len(kv[1])):
        print(f'\n{len(items)} skipped — {why}:')
        for name, a, b in items[:8]:
            print(f'    {name}: {a}  /  {b}')
        if len(items) > 8:
            print(f'    … and {len(items) - 8} more')


if __name__ == '__main__':
    main()

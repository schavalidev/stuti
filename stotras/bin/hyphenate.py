#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add compound hyphens to the deva: and iast: fields, reversibly.

    python3 bin/hyphenate.py apply ANALYSIS.json [--write]
    python3 bin/hyphenate.py undo  LEDGER.json   [--write]

Most of the corpus prints a compound solid — `mahiṣāsuramardini` — and a
reciter gets no help finding where it breaks. The user asked on 2026-10-31 for
the corpus to be hyphenated, as the bundled texts already are, with a copy kept
in case it goes wrong. The copy is the git tag `corpus-before-hyphens`; this
tool is the other half of the safety, because it can take back exactly what it
added and nothing else. That matters: about 3,600 hyphens were already in the
verse fields before it ran (the vidhi and pūjā shelves and the Gurucaritra
were written hyphenated), and those must survive an undo.

The analysis is a JSON file:

    {"devi/main/01_mahishasuramardini_stotram.txt": {
        "<an iast line exactly as it stands>": "<the same line, hyphens added>"}}

Where the split falls is a reading of the text, and a person or a model makes
it. What this tool guarantees is everything else:

  1. A line is changed only by inserting hyphens. If the analysis alters a
     single letter, space or mark, that line is refused.
  2. The Devanāgarī gets a hyphen only where the IAST hyphen lands between two
     akṣaras. Where sandhi has welded the join into one akṣara — jagad-amba is
     जगदम्ब, and द holds the end of one word and the start of the next — the
     IAST keeps its hyphen and the Devanāgarī stays solid, which is how the
     bundled texts already do it.
  3. A line that already reads exactly as the analysis would make it is left
     alone and not recorded, so an undo can never strip a hyphen an author put
     there.
  4. Every changed line goes into a ledger, before and after. `undo` puts back
     the before wherever the after still stands, and reports any line that has
     changed since, rather than guessing.
"""
import json, re, sys, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from dev2iast import dev2iast

ROOT = pathlib.Path(__file__).resolve().parent.parent
FIELD = re.compile(r'^(deva|iast|en|tel|hi|vidhi|variant):\s*(.*)$')
DEVA_RUN = re.compile(r'[ऀ-ॿ‌‍]+')
NOT_LETTERS = re.compile(r"[^A-Za-zāīūṛṝḷḹṁṃḥṅñṇṭḍśṣ'’]")

MATRA = set('ािीुूृॄॅॆेै'
            'ॉॊोौॢॣ')
SIGNS = set('ँंः़॒॑॓॔᳚ᳵᳶ')
VIRAMA = '्'


def letters(text):
    """The letters of a romanisation: no daṇḍa, digit, space or punctuation."""
    return NOT_LETTERS.sub('', text)


def aksaras(word):
    """Split a run of Devanāgarī into akṣaras: a consonant cluster plus its vowel."""
    out, i, n = [], 0, len(word)
    while i < n:
        j = i + 1
        while j < n and (word[j] in MATRA or word[j] in SIGNS or word[j] == VIRAMA):
            if word[j] == VIRAMA:
                j += 1
                if j < n and 'ऀ' <= word[j] <= 'ॿ':
                    j += 1
                continue
            j += 1
        out.append(word[i:j])
        i = j
    return out


def only_hyphens_added(before, after):
    """True when `after` is `before` with hyphens inserted and nothing else."""
    i = 0
    for ch in after:
        if i < len(before) and ch == before[i]:
            i += 1
        elif ch != '-':
            return False
    return i == len(before)


def added_marks(before, after):
    """Letter offsets, in `after`, of the hyphens that `before` did not have."""
    marks, i, seen = [], 0, ''
    for ch in after:
        if i < len(before) and ch == before[i]:
            i += 1
            if letters(ch):
                seen += ch
        elif ch == '-':
            marks.append(len(seen))
    return marks


def project(deva, marks):
    """Put hyphens into a Devanāgarī line at the given IAST letter offsets.

    Returns the new line and the number of offsets that fell inside an akṣara.
    The two scripts are compared over the whole line with daṇḍas, digits and
    spaces taken out, because they do not always divide the words alike.
    """
    units, cum, total = [], [], ''
    for m in DEVA_RUN.finditer(deva):
        at = m.start()
        for a in aksaras(m.group(0)):
            piece = letters(dev2iast(a))
            if piece:
                units.append(at)
                total += piece
                cum.append(len(total))
            at += len(a)
    cuts, welded = set(), 0
    for off in marks:
        if off in cum:
            k = cum.index(off) + 1
            if k < len(units):
                at = units[k]
                if at > 0 and deva[at - 1] not in ' -':
                    cuts.add(at)
        else:
            welded += 1
    out = ''.join(('-' if i in cuts else '') + ch for i, ch in enumerate(deva))
    return out, welded, total


def units_of(lines):
    """Yield (deva line numbers, iast line numbers) for each unit in a file."""
    cur, deva, iast = None, [], []
    def flush():
        if deva or iast:
            yield (list(deva), list(iast))
    for n, line in enumerate(lines):
        if line.startswith('--- '):
            yield from flush()
            cur, deva, iast = None, [], []
            continue
        m = FIELD.match(line)
        if m:
            cur = m.group(1)
            if m.group(2).strip():
                (deva if cur == 'deva' else iast if cur == 'iast' else []).append(n)
            continue
        if not line.strip():
            cur = None
            continue
        if cur == 'deva':
            deva.append(n)
        elif cur == 'iast':
            iast.append(n)
    yield from flush()


def body(line):
    """A field's text, whether on its own line or after `deva: ` / `iast: `."""
    m = FIELD.match(line)
    return m.group(2) if m else line


def rebuild(line, text):
    m = FIELD.match(line)
    return f'{m.group(1)}: {text}' if m else text


def apply(analysis, write):
    ledger, report = [], {'lines': 0, 'iast': 0, 'deva': 0, 'welded': 0,
                          'refused': [], 'not_found': 0, 'mismatch': []}
    for rel, table in analysis.items():
        path = ROOT / rel
        lines = path.read_text(encoding='utf-8').split('\n')
        used = set()
        for dnums, inums in units_of(lines):
            if len(dnums) != len(inums):
                report['mismatch'].append(rel)
                continue
            for dn, inn in zip(dnums, inums):
                old_i = body(lines[inn])
                new_i = table.get(old_i)
                if new_i is None or new_i == old_i:
                    continue
                used.add(old_i)
                if not only_hyphens_added(old_i, new_i):
                    report['refused'].append((rel, old_i, new_i))
                    continue
                old_d = body(lines[dn])
                new_d, welded, deva_letters = project(old_d, added_marks(old_i, new_i))
                if deva_letters != letters(old_i):
                    report['refused'].append((rel, old_d, 'deva and iast do not spell the same letters'))
                    continue
                report['lines'] += 1
                report['iast'] += new_i.count('-') - old_i.count('-')
                report['deva'] += new_d.count('-') - old_d.count('-')
                report['welded'] += welded
                for num, old, new, field in ((inn, old_i, new_i, 'iast'), (dn, old_d, new_d, 'deva')):
                    if new != old:
                        lines[num] = rebuild(lines[num], new)
                        ledger.append({'path': rel, 'field': field, 'before': old, 'after': new})
        report['not_found'] += len(set(table) - used)
        if write:
            path.write_text('\n'.join(lines), encoding='utf-8')
    return ledger, report


def undo(ledger, write):
    restored, drifted = 0, []
    by_path = {}
    for e in ledger:
        by_path.setdefault(e['path'], []).append(e)
    for rel, entries in by_path.items():
        path = ROOT / rel
        lines = path.read_text(encoding='utf-8').split('\n')
        for e in entries:
            for n, line in enumerate(lines):
                if body(line) == e['after']:
                    lines[n] = rebuild(line, e['before'])
                    restored += 1
                    break
            else:
                drifted.append((rel, e['after']))
        if write:
            path.write_text('\n'.join(lines), encoding='utf-8')
    return restored, drifted


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ('apply', 'undo'):
        sys.exit(__doc__)
    cmd, src = sys.argv[1], pathlib.Path(sys.argv[2])
    write = '--write' in sys.argv[3:]
    data = json.loads(src.read_text(encoding='utf-8'))

    if cmd == 'undo':
        restored, drifted = undo(data, write)
        print(f"{'restored' if write else 'would restore'} {restored} lines")
        for rel, after in drifted:
            print(f'  changed since, left alone: {rel}: {after[:60]}')
        return

    ledger, r = apply(data, write)
    verb = 'wrote' if write else 'would write'
    print(f"{verb} {r['iast']} hyphens into the IAST and {r['deva']} into the "
          f"Devanāgarī, over {r['lines']} lines")
    print(f"  {r['welded']} joins welded inside an akṣara: hyphenated in the IAST only")
    if r['not_found']:
        print(f"  {r['not_found']} analysed lines match no iast line as it stands")
    for rel in sorted(set(r['mismatch'])):
        print(f'  deva and iast have different line counts somewhere in {rel}; those units skipped')
    for rel, a, b in r['refused']:
        print(f'  REFUSED {rel}:\n      {a}\n      {b}')
    if write and ledger:
        out = src.with_name(src.stem + '.ledger.json')
        out.write_text(json.dumps(ledger, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'ledger: {out}')


if __name__ == '__main__':
    main()

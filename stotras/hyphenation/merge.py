#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Check the agents' answers and turn them into an analysis for bin/hyphenate.py.

    python3 hyphenation/merge.py WAVE [WAVE ...]
    e.g. python3 hyphenation/merge.py core

Every batch is checked two ways before a single answer is used. It must answer
every word it was given, in order — an agent that tired and stopped early would
otherwise leave words silently solid. And every hyphenated answer must be the
word with hyphens inserted and nothing else changed; an answer that altered a
letter is dropped and reported, never applied.

Writes:
  hyphenation/decisions.tsv          every word decided so far, and how
  hyphenation/analysis_<waves>.json  per file: iast line → hyphenated line
"""
import json, re, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT / 'bin')); sys.path.insert(0, str(HERE))
from hyphenate import units_of, body, only_hyphens_added
from inventory import eligible, ACCENT

EDGE_CH = r"|,;:.!?—–\"“”‘’\[\]{}0-9"
LEAD = re.compile(f'^[{EDGE_CH}]*')
TRAIL = re.compile(f'[{EDGE_CH}]*$')


def read_batches(waves):
    decided, problems, pending = {}, [], []
    for wave in waves:
        for inp in sorted((HERE / 'work' / 'in').glob(f'{wave}*.tsv')):
            out = HERE / 'work' / 'out' / inp.name
            words = [l.split('\t')[0] for l in inp.read_text(encoding='utf-8').splitlines() if l]
            if not out.exists():
                pending.append(inp.stem)
                continue
            rows = [l.split('\t') for l in out.read_text(encoding='utf-8').splitlines() if l.strip()]
            answered = {r[0]: (r[1].strip() if len(r) > 1 else '') for r in rows}
            missing = [w for w in words if w not in answered]
            if missing:
                problems.append(f'{inp.stem}: {len(missing)} of {len(words)} words unanswered')
            bad = 0
            for w in words:
                a = answered.get(w)
                if not a or a == '=' or a == w:
                    continue
                if only_hyphens_added(w, a) and not a.startswith('-') and not a.endswith('-') and '--' not in a:
                    decided[w] = a
                else:
                    bad += 1
            if bad:
                problems.append(f'{inp.stem}: {bad} answers changed more than hyphens, dropped')
    return decided, problems, pending


def hyphenate_line(line, decided):
    parts = re.split(r'(\s+)', line)
    for k, t in enumerate(parts):
        if not t or t.isspace():
            continue
        lead, trail = LEAD.match(t).group(), TRAIL.search(t).group()
        core = t[len(lead):len(t) - len(trail)] if trail else t[len(lead):]
        if core in decided:
            parts[k] = lead + decided[core] + trail
    return ''.join(parts)


def main():
    waves = sys.argv[1:] or ['core']
    decided, problems, pending = read_batches(waves)
    for p in problems:
        print('  ' + p)
    if pending:
        print(f'  {len(pending)} batches not answered yet, left for a later merge')

    # the running record of every decision, across all waves merged so far
    record = HERE / 'decisions.tsv'
    old = {}
    if record.exists():
        for l in record.read_text(encoding='utf-8').splitlines()[1:]:
            w, h = l.split('\t')
            old[w] = h
    old.update(decided)
    # the judges' corrections override the deciders, word for word
    corr = HERE / 'corrections.tsv'
    if corr.exists():
        n = 0
        for l in corr.read_text(encoding='utf-8').splitlines()[1:]:
            w, _, adopted = l.split('\t')
            if adopted == '=':
                old.pop(w, None)
            else:
                old[w] = adopted
            n += 1
        print(f'  {n} corrections from the judges applied over the deciders')
    record.write_text('word\thyphenated\n' + ''.join(f'{w}\t{h}\n' for w, h in sorted(old.items())),
                      encoding='utf-8')

    analysis, lines_changed = {}, 0
    for path in sorted(ROOT.rglob('*.txt')):
        rel = path.relative_to(ROOT)
        text = path.read_text(encoding='utf-8')
        if not eligible(rel, text):
            continue
        lines = text.split('\n')
        table = {}
        for dnums, inums in units_of(lines):
            if len(dnums) != len(inums):
                continue
            for n in inums:
                line = body(lines[n])
                if ACCENT.search(line) or re.search(r'\w-\w', line):
                    continue
                new = hyphenate_line(line, old)
                if new != line:
                    table[line] = new
                    lines_changed += 1
        if table:
            analysis[str(rel)] = table
    name = HERE / f"analysis_{'_'.join(waves)}.json"
    name.write_text(json.dumps(analysis, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{len(decided)} words hyphenated this merge; {len(old)} in decisions.tsv')
    print(f'{lines_changed} iast lines in {len(analysis)} files would change → {name.name}')


if __name__ == '__main__':
    main()

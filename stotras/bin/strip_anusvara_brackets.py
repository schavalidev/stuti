#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Drop the bracketed conjunct from the Telugu, keeping the anusvāra spelling.

    python3 bin/strip_anusvara_brackets.py [--write] [path ...]

The Telugu convention of 2026-09-13 printed both spellings — `శంక(శఙ్క)ర` —
so that a reader who knows the conjunct still found it. The user ruled on
2026-10-27 that the anusvāra form alone is what a Telugu reader wants, and the
bracket is noise: `శంకర`.

Nothing is lost. The conjunct is recoverable from the anusvāra spelling,
because the nasal is fixed by the consonant that follows it — `ం` before `క`
can only be `ఙ్`. `bin/telugu_anusvara.py` is still the tool that derives it.

Safety: a round bracket in a Telugu field may also hold a genuine variant
reading, which must never be dropped. So for every file this restores the
printed conjunct from the brackets, re-runs `anusvara_first` on the result, and
only writes the file if that reproduces the file byte for byte. A file that
fails is left untouched and reported — there the brackets are not this tool's
output and want a human.
"""
import re, sys, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from telugu_anusvara import ANUSVARA, MATCH, _aksharas

PAIR = re.compile(r'([ఀ-౿]+)\(([ఀ-౿]+)\)')


def keep_anusvara(text: str) -> str:
    """The text with every Telugu bracket dropped, anusvāra spelling kept."""
    return PAIR.sub(lambda m: m.group(1), text)


def restore_conjunct(text: str) -> str:
    """The text with the printed conjunct put back in place of the pair.

    The bracket covers only the tail of the run before it — in
    `దైవాసురసంప(సమ్ప)ద్విభాగయోగః` the pair is `సంప(సమ్ప)` and `దైవాసుర` is not
    part of it. So the kept text loses only as many akṣaras as the bracket
    itself holds, never the whole run.
    """
    def one(m):
        kept, printed = m.group(1), m.group(2)
        spans = _aksharas(kept)
        k = len(_aksharas(printed))
        head = kept[:spans[-k][0]] if 0 < k <= len(spans) else ''
        return head + printed
    return PAIR.sub(one, text)


def proves(kept: str, printed: str) -> bool:
    """Is `printed` exactly the conjunct spelling of the tail of `kept`?

    This is the test that separates this convention's brackets from a genuine
    variant reading, and it is made per bracket rather than per file. The
    letters are compared, not the span, because the corpus holds two
    generations of the convention — older files bracket `అంత(అన్త)ము` where the
    tool now writes `అంతము(అన్తము)`, and older files bracket a long word whole
    where the tool now brackets only the akṣaras around the nasal. All of those
    make the same claim about the same two spellings.

    A bracket fails here when its content is not the conjunct of what precedes
    it: a real variant reading, or a conjunct that has no anusvāra spelling at
    all (`అన్ట` — dental న before ట is not homorganic, so that bracket records
    a mistake rather than a convention). Those are left alone and reported.
    """
    spans, k = _aksharas(kept), len(_aksharas(printed))
    if not 0 < k <= len(spans):
        return False
    tail = kept[spans[-k][0]:]
    return MATCH.sub(ANUSVARA, printed) == tail


def convert(text: str):
    """Return (new text, pairs dropped, pairs not proved) for one file."""
    unproved = []

    def one(m):
        kept, printed = m.group(1), m.group(2)
        if proves(kept, printed):
            return kept
        unproved.append(m.group(0))
        return m.group(0)

    new = PAIR.sub(one, text)
    dropped = len(PAIR.findall(text)) - len(unproved)
    return new, dropped, unproved


def main() -> None:
    args = [a for a in sys.argv[1:] if a != '--write']
    write = '--write' in sys.argv[1:]
    roots = [pathlib.Path(a) for a in args] or [pathlib.Path('.')]
    paths = []
    for r in roots:
        paths.extend(sorted(r.rglob('*.txt')) if r.is_dir() else [r])

    touched = dropped = 0
    failures = []
    for p in paths:
        text = p.read_text(encoding='utf-8')
        new, pairs, unproved = convert(text)
        if unproved:
            failures.append((p, unproved))
        if not pairs:
            continue
        touched += 1
        dropped += pairs
        if write and new != text:
            p.write_text(new, encoding='utf-8')

    verb = 'dropped' if write else 'would drop'
    print(f'{verb} {dropped} bracketed conjuncts in {touched} files')
    if failures:
        print(f'\n{len(failures)} files hold brackets this tool cannot prove '
              f'are the conjunct convention. Those brackets are kept:')
        for p, items in failures:
            print(f'  {p}')
            for it in items:
                print(f'      {it}')


if __name__ == '__main__':
    main()

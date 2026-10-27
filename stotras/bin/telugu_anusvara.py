#!/usr/bin/env python3
"""Telugu homorganic nasal conjuncts → anusvāra.

`శఙ్కర` is correct and many readers cannot read it at a glance, so the corpus
prints `శంకర`. `anusvara_only` is the default and does that. `anusvara_first`
is the older form, which also printed the conjunct in brackets —
`శంక(శఙ్క)ర` — and is kept because it is how the bracketed spelling is
derived when one is wanted. The user dropped the brackets from the corpus on
2026-10-27; see CLAUDE.md under "Telugu — anusvāra, no brackets".

Only a nasal homorganic with the consonant after it has an anusvāra spelling,
so only those are touched. Left alone:

  larger clusters   `శార్ఙ్గ` — the nasal follows a virāma, and anusvāra
                    cannot. These stay conjunct and take no bracket.
  geminates         `అన్న`, `సమ్మ` — no anusvāra form.
  other clusters    `పాన్పు`, `హనుమాన్జీ` — dental న before a labial is not
                    homorganic. These are ordinary Telugu words.

A short word — four akṣaras or fewer — is bracketed whole, which is how a
reader meets it: `మహేంద్ర(మహేన్ద్ర)`, `సుగంధ(సుగన్ధ)`. Inside a longer compound
the bracket spans only the akṣara before the nasal through the akṣara carrying
the conjunct, so that a long compound is not printed twice. Where two conjuncts
fall in neighbouring akṣaras the run is bracketed once, never nested.
"""
import re

PAIRS = {
    'ఙ': 'కఖగఘ',
    'ఞ': 'చఛజఝ',
    'ణ': 'టఠడఢ',
    'న': 'తథదధ',
    'మ': 'పఫబభ',
}
NASALS = ''.join(PAIRS)
STOPS = ''.join(PAIRS.values())
VIRAMA = '్'
ANUSVARA = 'ం'
# marks that hang on the akṣara before it
MARKS = set('ఀఁంఃా఼ిీుూృౄెేైొోౌ్ౕౖౢౣ')

MATCH = re.compile('(?<!' + VIRAMA + ')([' + NASALS + '])' + VIRAMA + '(?=[' + STOPS + '])')
TELUGU_RUN = re.compile(r'[ఀ-౿]+')
# a word of this many akṣaras or fewer is bracketed whole
SHORT_WORD = 4


def _aksharas(s):
    """Span of each akṣara in a run of Telugu."""
    spans = []
    i, n = 0, len(s)
    while i < n:
        j = i + 1
        while j < n and s[j] in MARKS:
            j += 1
            if s[j - 1] == VIRAMA and j < n and 'ఀ' <= s[j] <= '౿':
                j += 1
        spans.append((i, j))
        i = j
    return spans


def _homorganic(run, a):
    return a + 2 < len(run) and run[a] in PAIRS and run[a + 2] in PAIRS[run[a]]


def _convert_run(run):
    spans = _aksharas(run)
    hits = [k for k, (a, _) in enumerate(spans)
            if MATCH.match(run, a) and _homorganic(run, a) and k > 0]
    if not hits:
        return run
    # group neighbouring hits so brackets never nest
    groups = []
    for k in hits:
        if groups and k - groups[-1][-1] <= 1:
            groups[-1].append(k)
        else:
            groups.append([k])

    if len(spans) <= SHORT_WORD:
        # short word — show it whole, the way the reader meets it
        starts = {spans[k][0] for k in hits}
        converted = ''.join(
            ANUSVARA if i in starts else ('' if (i - 1) in starts else ch)
            for i, ch in enumerate(run)
        )
        return converted + '(' + run + ')'

    out, k = [], 0
    for group in groups:
        first, last = group[0], group[-1]
        out.append(run[:spans[first - 1][0]] if not out else run[k:spans[first - 1][0]])
        start, end = spans[first - 1][0], spans[last][1]
        original = run[start:end]
        converted = ''.join(
            ANUSVARA if (start + idx) in {spans[h][0] for h in group}
            else ('' if (start + idx - 1) in {spans[h][0] for h in group} else ch)
            for idx, ch in enumerate(original)
        )
        out.append(converted + '(' + original + ')')
        k = end
    out.append(run[k:])
    return ''.join(out)


def anusvara_only(text: str) -> str:
    """Rewrite homorganic nasal conjuncts as anusvāra, with no bracket.

    This is what the corpus prints since 2026-10-27 (user): `శంకర`, not
    `శంకర(శఙ్కర)`. Nothing is lost, because the conjunct is fixed by the
    consonant that follows the anusvāra — `ం` before `క` can only be `ఙ్` —
    so `anusvara_first` below still derives the bracketed form on demand.
    """
    return TELUGU_RUN.sub(lambda m: MATCH.sub(ANUSVARA, m.group(0)), text)


def anusvara_first(text: str) -> str:
    """Rewrite homorganic nasal conjuncts as anusvāra, conjunct in brackets."""
    return TELUGU_RUN.sub(lambda m: _convert_run(m.group(0)), text)


if __name__ == '__main__':
    import sys
    argv = sys.argv[1:]
    brackets = '--brackets' in argv
    src = ' '.join(a for a in argv if a != '--brackets') or sys.stdin.read()
    sys.stdout.write(anusvara_first(src) if brackets else anusvara_only(src))

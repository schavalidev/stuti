#!/usr/bin/env python3
"""Write one Bhāgavata adhyāya file from the decoded Gītā Press text and a meanings file.

    build_adhyaya.py <chapters.json> <skandha> <adhyaya> <meanings.json> <out.txt>

chapters.json is gpparse.parse() output (see gpverses.py → gpparse.py). meanings.json holds:
  {"header": {Title, Devanāgarī, Author, Language, Type, Source / recension, Recension note,
              Verse count, Metre, Sections (list of "label (vv. a–b)"), Blurb},
   "sections": [[first_verse, "label"], ...],
   "edits": {"<verse>": [["old", "new"], ...]},        # typesetting fixes and bracketed variants
   "verses": {"<verse>": {"en": ..., "tel": ..., "hi": ...}},
   "colophon": {"en": ..., "tel": ..., "hi": ...}}

Every edit must match exactly once, or the build stops: an edit that silently misses is how a
variant bracket or a closed typesetting gap goes unrecorded. The Devanāgarī is otherwise the
print's, letter for letter; the IAST is generated from it with dev2iast; the Telugu title with
dev2tel, its anusvāra brackets dropped as in the other headers.
"""
import json, re, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from dev2iast import dev2iast
from dev2tel import dev2tel

DEV = '०१२३४५६७८९'


def dnum(s):
    return int(''.join(str(DEV.index(c)) for c in s))


def clean(line):
    line = re.sub(r'⁽\d+⁾', '', line)                   # footnote markers: the notes are apparatus
    line = re.sub(r'॥\s*[०-९]+\s*$', '॥', line)          # the verse number is not part of the text
    line = re.sub(r'([^\s])[०-९]$', r'\1', line)          # superscript numeral left in a colophon
    return line.strip()


def main(cj, sk, ad, mj, out):
    ch = next(c for c in json.load(open(cj)) if c['skandha'] == int(sk) and c['adhyaya'] == int(ad))
    M = json.load(open(mj))
    H = M['header']
    secs = sorted((int(a), b) for a, b in M.get('sections', []))
    edits = M.get('edits', {})
    used = set()

    units, speaker = [], None
    for u in ch['units']:
        if u['kind'] == 'speaker':
            speaker = u['lines'][0]
            continue
        n = dnum(u['n'])
        lines = [clean(l) for l in u['lines']]
        text = '\n'.join(lines)
        for old, new in edits.get(str(n), []):
            if text.count(old) != 1:
                sys.exit(f'edit for verse {n} matches {text.count(old)} times: {old!r}')
            text = text.replace(old, new)
            used.add((str(n), old))
        if speaker:
            text = speaker + '\n' + text
            speaker = None
        units.append((n, text))
    missing = [(k, o) for k, v in edits.items() for o, _ in v if (k, o) not in used]
    if missing:
        sys.exit(f'edits never applied: {missing}')

    # numbering must run 1..N without a gap, exactly as printed
    nums = [n for n, _ in units]
    if nums != list(range(1, len(nums) + 1)):
        sys.exit(f'verse numbers are not continuous: {nums}')

    tel_title = re.sub(r'\([^)]*\)', '', dev2tel(H['Devanāgarī']))
    o = [f"Title: {H['Title']}", f"Devanāgarī: {H['Devanāgarī']}", f"Telugu: {tel_title}", '',
         f"Author: {H['Author']}", '', f"Language: {H['Language']}", f"Type: {H['Type']}", '',
         f"Source / recension: {H['Source / recension']}", '',
         f"Recension note: {H['Recension note']}", '',
         f"Verse count: {H['Verse count']}", '', f"Metre: {H['Metre']}", '', 'Sections:']
    o += H['Sections']
    o += ['', f"Blurb: {H['Blurb']}", '']

    def section_of(n):
        lab = None
        for a, b in secs:
            if n >= a:
                lab = b
        return lab

    for n, text in units:
        m = M['verses'][str(n)]
        sec = section_of(n)
        o.append(f'--- verse {n}' + (f' | section: {sec}' if sec else '') + ' ---')
        o += ['deva:', text, 'iast:', dev2iast(text), f"en: {m['en']}", f"tel: {m['tel']}", f"hi: {m['hi']}", '']
    col = clean(re.sub(r'\s+', ' ', ch['colophon']))
    col = re.sub(r'([^\s॥०-९])[०-९]+(?=\s)', r'\1', col)   # a footnote numeral set inside the colophon
    c = M['colophon']
    o += ['--- verse none ---', 'deva:', col, 'iast:', dev2iast(col), f"en: {c['en']}", f"tel: {c['tel']}",
          f"hi: {c['hi']}", '']
    missing = [k for k in M['verses'] if int(k) not in nums]
    if missing or len(M['verses']) != len(nums):
        sys.exit(f'meanings and verses disagree: {len(M["verses"])} meanings, {len(nums)} verses, extra {missing}')
    open(out, 'w').write('\n'.join(o).rstrip('\n') + '\n')
    print(out, len(units), 'verses')


if __name__ == '__main__':
    main(*sys.argv[1:6])

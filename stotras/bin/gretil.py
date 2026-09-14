#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GRETIL as a standing witness for this corpus.

**Standing rule (user, 2026-09-13).** Before writing any file, look for a scholarly or critical
edition of the source-work and collate against it as a matter of course. This script is how you
look, and how you read what you find. Where nothing exists, say so in the file's
`Source / recension` field instead of leaving the question unasked.

Two traps, both learned the hard way on 2026-09-13:

  * **Read the TEI XML, never the plain-text export.** GRETIL's
    `transformations/plaintext/*.txt` silently drops the first half-line of every verse for at
    least some texts. A collation against it looks complete and is wrong about half the text.
    This script only ever reads XML (or, for the older section, the HTML source).
  * **Never match by chapter or verse number across editions.** A critical edition is usually
    shorter than the vulgate and divides the text its own way — the Rāmāyaṇa's Sundarakāṇḍa in
    66 sargas against the vulgate's 68, its Yuddhakāṇḍa in 116 against 128 or 131. Match by
    opening line, with `find`.

And one point of judgement: **presence of a reading in a critical edition is strong evidence,
absence is weak**, because a critical edition excises a great deal that the living recension
carries. Absence is never on its own a reason to drop a verse the Gītā Press text prints.

Usage
  python3 bin/gretil.py search durga          # what does GRETIL have on this?
  python3 bin/gretil.py known                 # texts already identified for this corpus
  python3 bin/gretil.py chapter ramayana 6 116
  python3 bin/gretil.py find ramayana "babhāṣe bharato"
  python3 bin/gretil.py find markandeya "yā devī sarvabhūteṣu"
"""
import os, re, sys, html, urllib.request

BASE = 'http://gretil.sub.uni-goettingen.de/'
TEI = BASE + 'gretil/corpustei/'
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, 'cache')
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

# Texts identified as witnesses for works this corpus already holds. Add to this as you find
# more; the note says what the file actually is, because the filename does not always say.
KNOWN = {
    'ramayana':   ('sa_rAmAyaNa.xml',
                   'Vālmīki Rāmāyaṇa, Baroda critical edition (Tokunaga). All seven kāṇḍas. '
                   'Its own division: Sundarakāṇḍa 66 sargas, Yuddhakāṇḍa 116.'),
    'markandeya': ('sa_mArkaNDeyapurANa1-93.xml',
                   'Mārkaṇḍeya Purāṇa 1–93 — which means it carries the Devī Māhātmya, the '
                   'Durgā Saptaśatī, at chapters 81–93. A witness for devi/durga/.'),
    'visnupurana-crit': ('sa_viSNupurANa-crit.xml', 'Viṣṇu Purāṇa, critical edition.'),
    'bhagavatapurana':  ('sa_bhAgavatapurANa.xml', 'Bhāgavata Purāṇa, complete.'),
    'sivapurana':       ('sa_zivapurANabooks-1-and-7.xml', 'Śiva Purāṇa, books 1 and 7 only.'),
    'brahmapurana':     ('sa_brahmapurANa-1-246.xml', 'Brahma Purāṇa 1–246.'),
    'rgveda':           ('sa_Rgveda-edAufrecht.xml',
                   'Ṛgveda, Aufrecht (Śākala). IT IS ACCENTED, but in IAST with the marks '
                   'written as separate combining characters — "a ̱ gnim ī ̍ ḻe". Do not hand-'
                   'convert that to Devanāgarī svara; see the accent rules in CLAUDE.md and '
                   'prefer a Devanāgarī source for marking.'),
}

# The Mahābhārata critical edition and the critical-edition Bhagavad Gītā are NOT in the TEI
# section. They are older HTML, one file per parvan, and are noted here so nobody concludes
# from `search` alone that GRETIL lacks them.
NON_TEI = {
    'mahabharata': (BASE + 'gretil/1_sanskr/2_epic/mbh/mbh_%02d_u.htm',
                    'Poona (BORI) critical edition, parvans 1–18. Pass the parvan number.'),
    'gita-crit':   (BASE + 'gretil/1_sanskr/2_epic/mbh/ext/bhgce__u.htm',
                    'Bhagavad Gītā as constituted in the Mahābhārata critical edition.'),
}


def _fetch(url, name):
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        os.makedirs(CACHE, exist_ok=True)
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(req) as r:
            data = r.read()
        with open(path, 'wb') as f:
            f.write(data)
        sys.stderr.write(f'fetched {len(data)} bytes -> {path}\n')
    with open(path, encoding='utf-8', errors='replace') as f:
        return f.read()


def source(key):
    """The raw text of a known witness, cached on first use."""
    if key in KNOWN:
        fn = KNOWN[key][0]
        return _fetch(TEI + fn, fn)
    if key in NON_TEI:
        url = NON_TEI[key][0]
        if '%02d' in url:
            sys.exit(f'{key} is one file per parvan; use: gretil.py parvan {key} <n>')
        return _fetch(url, key + '.htm')
    sys.exit(f'unknown text {key!r}. Run "gretil.py known" or "gretil.py search <word>".')


REF_INLINE = re.compile(r'//\s*([A-Za-z][A-Za-z0-9_]*[_ ]?[\d.,]+)\s*//')


def lines(key):
    """[(ref, text)] for every verse line, in document order.

    GRETIL's TEI is not one shape. Some files carry the reference as an attribute
    (`<l xml:id="R_6.116.042cd">`); others use a bare `<l>` inside an `<lg>` group and print the
    reference inline in the last line as `// MarkP_85.12 //`. Both are handled, and a line with
    no reference of its own inherits the one its group carries — otherwise the first half of
    every verse comes back unlabelled. Do not narrow this to one shape: a file of the other kind
    then returns nothing at all, silently, and looks merely absent.
    """
    t = source(key)
    out = []
    last = ['']          # the last reference seen, so an unlabelled opening group inherits one
    groups = re.findall(r'<lg\b[^>]*>(.*?)</lg>', t, re.S) or [t]
    for g in groups:
        rows = []
        for m in re.finditer(r'<l\b([^>]*)>(.*?)</l>', g, re.S):
            attrs, body = m.group(1), m.group(2)
            txt = html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', body))).strip()
            if not txt:
                continue
            idm = re.search(r'xml:id="([^"]+)"', attrs)
            ref = idm.group(1) if idm else None
            if ref is None:
                rm = REF_INLINE.search(txt)
                if rm:
                    ref = rm.group(1)
            rows.append([ref, txt])
        carried = next((r for r, _ in rows if r), None) or last[0]
        for r, txt in rows:
            out.append((r or carried, txt))
        if carried:
            last[0] = carried
    return out


def index():
    return _fetch(BASE + 'gretil.html', 'gretil_index.html')


def main(argv):
    if not argv:
        sys.exit(__doc__)
    cmd = argv[0]

    if cmd == 'known':
        print('Identified witnesses (TEI XML):')
        for k, (fn, note) in sorted(KNOWN.items()):
            print(f'  {k:20s} {fn}\n  {"":20s} {note}')
        print('\nNot in the TEI section, fetched as HTML:')
        for k, (url, note) in sorted(NON_TEI.items()):
            print(f'  {k:20s} {note}')

    elif cmd == 'search':
        q = ' '.join(argv[1:]).lower()
        if not q:
            sys.exit('search needs a word')
        seen = sorted({m.group(1).split("/")[-1]
                       for m in re.finditer(r'href="(gretil/corpustei/[^"]+\.xml)"', index())
                       if q in m.group(1).lower()})
        for fn in seen:
            print(' ', fn)
        print(f'{len(seen)} TEI file(s) matching {q!r}'
              + ('' if seen else ' — also try "known", and note that the Mahābhārata and the '
                                 'critical-edition Gītā live outside the TEI section'))

    elif cmd == 'chapter':
        key, ch = argv[1], argv[2]
        rows = [(r, t) for r, t in lines(key) if re.search(r'[_.]' + re.escape(ch) + r'\.', r)]
        if len(argv) > 3:                      # kāṇḍa/book + chapter
            bk, ch = argv[2], argv[3]
            rows = [(r, t) for r, t in lines(key)
                    if re.search(r'_' + re.escape(bk) + r'\.' + re.escape(ch) + r'\.', r)]
        if not rows:
            sys.exit('no lines matched — check the numbering with "find" instead')
        print(f'# {len(rows)} lines')
        for r, t in rows:
            print(f'{r}  {t}')

    elif cmd == 'find':
        key, q = argv[1], ' '.join(argv[2:]).lower()
        n = 0
        for r, t in lines(key):
            if q in t.lower():
                print(f'{r}  {t}')
                n += 1
        print(f'{n} match(es)')

    elif cmd == 'parvan':
        key, n = argv[1], int(argv[2])
        url = NON_TEI[key][0] % n
        t = _fetch(url, f'{key}_{n:02d}.htm')
        print(f'# {len(t)} chars cached; grep it directly')

    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv[1:])

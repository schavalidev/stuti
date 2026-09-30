#!/usr/bin/env python3
"""GRETIL's Bhāgavata as {(skandha, adhyāya, verse): text}, with every verse labelled.

gretil.lines() labels a line from its xml:id or from an inline `// BhP_… //` mark, but the
long-metre verses carry the mark with a trailing asterisk (`// BhP_08.03.030* //`) and no id, so
they inherit the previous verse's reference and look missing. Here each verse is closed by its own
inline mark, asterisk or not, and a line the file repeats (it prints the first half of some
long-metre verses twice) is taken once.
"""
import re, html, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import gretil

MARK = re.compile(r'//\s*BhP_(\d+)\.(\d+)\.(\d+)\*?\s*//')


def verses():
    t = gretil.source('bhagavatapurana')
    t = t[t.index('<body'):]
    # verse text sits in <l> elements, but Skandha 5's prose is bare text between tags; read the
    # body as lines either way, and let each inline mark close the verse it ends
    t = re.sub(r'</?(?:l|lg|p|div|head)\b[^>]*>', '\n', t)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', t))
    out, buf = {}, []
    for line in t.split('\n'):
        line = re.sub(r'\s+', ' ', line).strip()
        if not line or re.match(r'^BhP_\S+/\d+\b', line):     # `BhP_05.03.001/0 śrī-śuka uvāca`
            continue
        if buf and buf[-1] == line:
            continue
        buf.append(line)
        k = MARK.search(line)
        if k:
            key = tuple(int(x) for x in k.groups())
            txt = MARK.sub('', ' '.join(buf))
            txt = re.sub(r'_\*|\s*[/$&%]+\s*', ' ', txt).strip()
            out[key] = (out[key] + ' ' + txt) if key in out else txt
            buf = []
    return out


if __name__ == '__main__':
    v = verses()
    print(len(v), 'verses')
    for k in [(1, 1, 1), (8, 3, 30), (10, 87, 14)]:
        print(k, v.get(k))

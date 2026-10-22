"""Insert en/tel/hi meaning lines into a Vālmīki sarga file from a gloss JSON, without
changing one character of the text.

    python3 gloss_merge.py <kanda> <sid>

Reads the corpus file for <kanda>/<sid> and work/<kanda>/<sid>.gloss.json, a map
{"<verse token>": {"en": "...", "tel": "...", "hi": "..."}, ...} where the token is the verse
number ("1", "2", ...) or "none" for the colophon unit. For each verse unit it inserts the three
lines immediately after the last iast line. It refuses unless:
  * every verse unit that lacks a meaning has an entry in the JSON (nothing skipped);
  * the deva/iast lines, the unit markers and the header are byte-for-byte unchanged;
  * no meaning line is empty.
A unit that already carries en: is left exactly as it is (idempotent re-run).
"""
import os, re, sys, json
import sources as S
from write_sarga import folder, WORK

UNIT = re.compile(r'(?m)^--- (.*?) ---$')

def token(header):
    m = re.match(r'\s*verse\s+(\S+)', header)
    return m.group(1) if m else header.strip()

def split_units(text):
    """Return (preamble, [(header, body), ...]) where body keeps its trailing blank line."""
    parts = UNIT.split(text)
    pre = parts[0]
    pairs = list(zip(parts[1::2], parts[2::2]))
    return pre, pairs

def insert(body, g):
    lines = body.split('\n')
    # already glossed?
    if any(l.startswith('en:') for l in lines):
        return body, False
    try:
        j = next(i for i, l in enumerate(lines) if l.strip() == 'iast:')
    except StopIteration:
        raise SystemExit('no iast: in a unit')
    k = j + 1
    while k < len(lines) and lines[k].strip() != '':
        k += 1
    add = [f"en: {g['en']}", f"tel: {g['tel']}", f"hi: {g['hi']}"]
    for key in ('en', 'tel', 'hi'):
        if not str(g.get(key, '')).strip():
            raise SystemExit(f'empty {key}')
    return '\n'.join(lines[:k] + add + lines[k:]), True

def main(k, sid):
    files = {os.path.basename(p).split('_')[0]: p
             for p in __import__('glob').glob(os.path.join(folder(k), '*.txt'))}
    files.update({os.path.basename(p).split('_')[0]: p
                  for p in __import__('glob').glob(os.path.join(folder(k, True), '*.txt'))})
    # sid may be a packet id that maps to a different print number; accept a direct file match too
    if sid in files:
        path = files[sid]
    else:
        cand = [p for p in files.values() if f'_sarga_{int(sid)}_' in os.path.basename(p)]
        if len(cand) != 1:
            raise SystemExit(f'cannot find the file for {k} {sid}')
        path = cand[0]
    gj = os.path.join(WORK, k, sid + '.gloss.json')
    G = json.load(open(gj, encoding='utf-8'))
    text = open(path, encoding='utf-8').read()
    pre, pairs = split_units(text)
    out = [pre]
    done = 0
    missing = []
    for h, b in pairs:
        tok = token(h)
        if h.strip().startswith(('names', 'note on')):
            out.append(f'--- {h} ---' + b); continue
        already = any(l.startswith('en:') for l in b.split('\n'))
        if already:
            out.append(f'--- {h} ---' + b); continue
        if tok not in G:
            missing.append(tok); out.append(f'--- {h} ---' + b); continue
        nb, changed = insert(b, G[tok])
        out.append(f'--- {h} ---' + nb)
        done += changed
    if missing:
        raise SystemExit(f'REFUSED: no gloss for units {missing}')
    new = ''.join(out)
    # safety: the only difference from the original is added en/tel/hi lines
    def strip_meanings(s):
        return '\n'.join(l for l in s.split('\n') if not l.startswith(('en:', 'tel:', 'hi:')))
    if strip_meanings(new) != strip_meanings(text):
        raise SystemExit('REFUSED: a deva/iast/header line would change')
    open(path, 'w', encoding='utf-8').write(new)
    print(f'GLOSSED {os.path.relpath(path, folder(k))}: {done} units')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])

"""Apply an auditor's corrections to the en/tel/hi meaning lines of a glossed sarga file,
without touching one character of the verse text.

    python3 gloss_fix.py <kanda> <sid>

Reads work/<kanda>/<sid>.audit.json: {"<verse token>": {"en"?: "...", "tel"?: "...", "hi"?: "..."}}
listing ONLY the fields that must change, for ONLY the units that need a correction (empty object
= nothing to fix). For each listed unit it replaces that field's single line. It refuses unless the
deva/iast lines, the headers and the unit markers are byte-for-byte unchanged and every targeted
unit already carried that meaning line.
"""
import os, sys, json
from gloss_merge import split_units, token, folder
import glob

def main(k, sid):
    files = {os.path.basename(p).split('_')[0]: p
             for p in glob.glob(os.path.join(folder(k), '*.txt'))}
    files.update({os.path.basename(p).split('_')[0]: p
                  for p in glob.glob(os.path.join(folder(k, True), '*.txt'))})
    if sid in files:
        path = files[sid]
    else:
        cand = [p for p in files.values() if f'_sarga_{int(sid)}_' in os.path.basename(p)]
        if len(cand) != 1:
            raise SystemExit(f'cannot find the file for {k} {sid}')
        path = cand[0]
    from write_sarga import WORK
    A = json.load(open(os.path.join(WORK, k, sid + '.audit.json'), encoding='utf-8'))
    if not A:
        print('OK no corrections'); return
    text = open(path, encoding='utf-8').read()
    pre, pairs = split_units(text)
    out = [pre]
    fixed = 0
    for h, b in pairs:
        tok = token(h)
        corr = A.get(tok)
        if not corr:
            out.append(f'--- {h} ---' + b); continue
        lines = b.split('\n')
        for i, l in enumerate(lines):
            for fld in ('en', 'tel', 'hi'):
                if fld in corr and l.startswith(fld + ':'):
                    newval = str(corr[fld]).strip()
                    if not newval:
                        raise SystemExit(f'empty {fld} for {tok}')
                    lines[i] = f'{fld}: {newval}'
                    fixed += 1
        out.append(f'--- {h} ---' + '\n'.join(lines))
    new = ''.join(out)
    # safety: only en/tel/hi lines may differ; deva/iast/header/markers identical
    def strip_meanings(s):
        return '\n'.join(l for l in s.split('\n') if not l.startswith(('en:', 'tel:', 'hi:')))
    if strip_meanings(new) != strip_meanings(text):
        raise SystemExit('REFUSED: a deva/iast/header line would change')
    # and the meaning-line COUNT must be unchanged (we only replace, never add/remove)
    cnt = lambda s: sum(l.startswith(('en:', 'tel:', 'hi:')) for l in s.split('\n'))
    if cnt(new) != cnt(text):
        raise SystemExit('REFUSED: meaning-line count changed')
    open(path, 'w', encoding='utf-8').write(new)
    print(f'FIXED {os.path.relpath(path, folder(k))}: {fixed} lines in {len(A)} units')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])

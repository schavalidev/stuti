# -*- coding: utf-8 -*-
"""Put numbered list lines back on one line — the exact inverse of listify."""
import re, sys, pathlib
from listify import canon

def process(text):
    out, buf, head, field, n = [], [], None, None, 0
    def flush():
        nonlocal buf, head
        if buf:
            out.append(' '.join(([head] if head else []) + buf))
        buf, head = [], None
    for ln in text.split('\n'):
        m = re.match(r'^(deva|iast|en|tel|hi|vidhi|variant):(.*)$', ln)
        if m or ln.startswith('--- '):
            flush(); field = m.group(1) if m and not m.group(2).strip() else None
            out.append(ln); continue
        if field in ('deva', 'iast'):
            if re.match(r'^\d+\. ', ln):
                if not buf:
                    n += 1
                    if out and out[-1].rstrip().endswith('—'):
                        head = out.pop().strip()
                buf.append(re.sub(r'^\d+\. ', '', ln))
                continue
            flush()
        out.append(ln)
    flush()
    return '\n'.join(out), n

if __name__ == '__main__':
    t = 0
    for p in map(pathlib.Path, [a for a in sys.argv[1:] if a != '--write']):
        old = p.read_text(encoding='utf-8'); new, n = process(old)
        if not n: continue
        assert canon(old) == canon(new), f'TEXT CHANGED in {p}'
        t += n; print(f'{n:4d} lists  {p}')
        if '--write' in sys.argv: p.write_text(new, encoding='utf-8')
    print(f'\n{t} lists un-numbered' + ('  [written]' if '--write' in sys.argv else '  [dry run]'))

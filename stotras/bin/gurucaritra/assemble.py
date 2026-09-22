#!/usr/bin/env python3
"""Build an adhyāya file from the verified Devanāgarī and the translation fields.

The Devanāgarī comes from `adhNN_verified.txt` — text read off the page images.
The IAST is NEVER typed: it is generated here from that Devanāgarī with
bin/dev2iast.py, which is the corpus's house rule, so the two fields cannot
drift apart.

    python3 assemble.py 1 --tr units.json -o out.txt
"""
import argparse, json, re, subprocess, sys
from pathlib import Path

BIN = Path(__file__).resolve().parents[1]      # stotras/bin
CACHE = BIN / 'cache' / 'gurucaritra'
DEV2IAST = BIN / 'dev2iast.py'
DEVA = re.compile(r'[ऀ-ॿ]')


def parse_verified(path):
    """-> [{num, page, deva, kshepaka}] in printed order."""
    out, cur = [], None
    for line in path.read_text(encoding='utf-8').split('\n'):
        if line.startswith('#'):
            continue
        m = re.match(r'^(\d+)\s+\[(\d+)\]\s+(.*)$', line)
        if m:
            cur = {'num': int(m.group(1)), 'page': m.group(2),
                   'deva': [m.group(3).strip()], 'kshepaka': False}
            out.append(cur)
            continue
        m = re.match(r'^--\s+\[(\d+)\]\s+(.*)$', line)
        if m:                                   # an unnumbered interpolation
            cur = {'num': None, 'page': m.group(1),
                   'deva': [re.sub(r'^\(क्षेपकः\)\s*', '', m.group(2)).strip()],
                   'kshepaka': True}
            out.append(cur)
            continue
        if cur is not None and line.startswith('  ') and DEVA.search(line) \
                and not line.strip().startswith('^'):
            cur['deva'].append(line.strip())
    return out


def iast(deva):
    r = subprocess.run(['python3', str(DEV2IAST)], input=deva,
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit(f'dev2iast failed: {r.stderr}')
    return r.stdout.rstrip('\n')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('adhyaya', type=int)
    ap.add_argument('--tr', help='JSON with [{num, en, tel, hi}]')
    ap.add_argument('--sections', help='JSON mapping verse number -> section label')
    ap.add_argument('-o', '--out', required=True)
    a = ap.parse_args()

    verses = parse_verified(CACHE / f'adh{a.adhyaya:02d}_verified.txt')
    tr = {}
    if a.tr:
        for u in json.loads(Path(a.tr).read_text(encoding='utf-8')):
            tr[u['num']] = u
    sections = {}
    if a.sections:
        sections = {int(k): v for k, v in
                    json.loads(Path(a.sections).read_text(encoding='utf-8')).items()}

    body, missing = [], []
    cur_section = None
    for v in verses:
        deva = '\n'.join(v['deva'])
        n = v['num']
        if n in sections:
            cur_section = sections[n]
        head = f"--- verse {'none' if v['kshepaka'] else n}"
        if cur_section:
            head += f" | section: {cur_section}"
        head += ' ---'
        u = tr.get(n, {})
        if not v['kshepaka'] and not u:
            missing.append(n)
        body.append(
            f"{head}\ndeva:\n{deva}\niast:\n{iast(deva)}\n"
            f"en: {u.get('en','')}\ntel: {u.get('tel','')}\nhi: {u.get('hi','')}\n")

    Path(a.out).write_text('\n'.join(body), encoding='utf-8')
    numbered = sum(1 for v in verses if not v['kshepaka'])
    print(f"{len(verses)} units ({numbered} numbered, "
          f"{len(verses)-numbered} unnumbered) -> {a.out}", file=sys.stderr)
    if missing:
        print(f"MISSING translations for: {missing}", file=sys.stderr)


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mechanical check for the files in `vishnu/narayaniyam/`.

An agent that has just written a file is the worst judge of whether it is right, and a second
agent reading the same page image is a better one but still a reader. These are the checks that
need no judgement at all and so should never be delegated:

  * the IAST block is exactly what `dev2iast.py` makes of the Devanāgarī block — the corpus
    convention is that IAST is generated and never typed, and this is the only thing that proves
    it happened;
  * every verse unit carries all five fields, and the Telugu and Hindi are actually in Telugu and
    Devanāgarī script;
  * the header fields are present, and the reader-facing ones (Title, Blurb) do not leak the
    apparatus — no OCR, no GRETIL, no archive.org, no scan pages;
  * no italics anywhere, which this project forbids outright, markdown emphasis included;
  * the numbered verses run 1..N without a gap, and N matches what the Gītā Press print numbers;
  * every Devanāgarī line is accounted for against the GRETIL witness by consonant skeleton, which
    catches a line silently dropped in transcription — the one error that is invisible on review.

Usage
  python3 bin/narayaniyam_check.py                 # every file in the folder
  python3 bin/narayaniyam_check.py 003 004         # only these
  python3 bin/narayaniyam_check.py --json          # machine-readable, for a fix round
"""
import os, re, sys, json, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from dev2iast import dev2iast

CORPUS = os.path.dirname(HERE)
FOLDER = os.path.join(CORPUS, 'vishnu', 'narayaniyam')
# The GRETIL witness, as {dasaka: [{verse, lines}]}. It lives in the gitignored fetch cache, so a
# fresh clone will not have it; absent is not fatal — the skeleton check is skipped and everything
# else still runs, and the run says so. Rebuild it from GRETIL with:
#
#   python3 -c "import re,json,urllib.request as u; \
#     d=u.urlopen(u.Request('http://gretil.sub.uni-goettingen.de/gretil/corpustei/' \
#       'sa_nArAyaNabhaTTa-nArAyaNIya.xml',headers={'User-Agent':'Mozilla/5.0'})).read().decode(); \
#     o={}; [o.setdefault(m[1],[]).append({'verse':int(m[2]),'lines':re.findall(r'<l [^>]*>(.*?)</l>',m[3],re.S)}) \
#       for m in re.findall(r'<lg xml:id=\"Nar_\d+\.(\d+)\.(\d+)\">(.*?)</lg>',d,re.S)]; \
#     json.dump(o,open('bin/cache/narayaniyam_gretil.json','w'),ensure_ascii=False)"
ALIGNED = os.path.join(HERE, 'cache', 'narayaniyam_gretil.json')

DEVA = r'ऀ-ॿ'
TELU = r'ఀ-౿'
LEAK = ['OCR', 'GRETIL', 'archive.org', 'djvu', 'scan page', 'Gītā Press', 'Gita Press']


def skel(t):
    """A consonant skeleton, for comparing two spellings of the same line.

    Anusvāra and visarga are dropped rather than compared: GRETIL writes ṃ where this corpus
    writes ṁ, and a skeleton that keeps either one differs at every nasal and reports the whole
    text as missing. That mistake cost a session once.
    """
    if re.search('[' + DEVA + ']', t):
        t = dev2iast(t)
    t = t.lower().replace('ṃ', '').replace('ṁ', '').replace('ḥ', '')
    t = re.sub(r"[^a-zāīūṛṝḷṅñṭḍṇśṣ]", '', t)
    return re.sub(r'[aāiīuūṛeo]', '', t)


def units(text):
    """Split a corpus file into (header, [(verse_label, {field: value})])."""
    parts = re.split(r'^--- verse ([^|\n]+?)\s*(?:\|[^\n]*)?---\s*$', text, flags=re.M)
    header = parts[0]
    out = []
    for i in range(1, len(parts), 2):
        label, body = parts[i].strip(), parts[i + 1]
        fields, cur = {}, None
        for line in body.split('\n'):
            m = re.match(r'^(deva|iast|en|tel|hi):\s*(.*)$', line)
            if m:
                cur = m.group(1)
                fields[cur] = ([m.group(2)] if m.group(2) else [])
            elif cur is not None:
                fields[cur].append(line)
        out.append((label, {k: '\n'.join(v).strip() for k, v in fields.items()}))
    return header, out


def check(path, gretil):
    name = os.path.basename(path)
    text = open(path, encoding='utf-8').read()
    header, us = units(text)
    bad = []
    say = lambda sev, where, msg: bad.append({'severity': sev, 'where': where, 'problem': msg})

    if not re.match(r'^\d{3}_dasakam_\d{2,3}_[a-z0-9_]+\.txt$', name):
        say('minor', name, 'filename does not match NNN_dasakam_NN_slug.txt')

    for f in ['Title:', 'Devanāgarī:', 'Telugu:', 'Author:', 'Source / recension:', 'Verse count:', 'Blurb:']:
        if f not in header:
            say('major', 'header', f'missing field {f}')
    for field in ['Title:', 'Blurb:']:
        m = re.search('^' + re.escape(field) + r'(.*?)(?=\n[A-ZŚ][^\n]*:|\n---|\Z)', header, re.S | re.M)
        if m:
            for w in LEAK:
                if w.lower() in m.group(1).lower():
                    say('major', field.strip(':'), f'apparatus leaks into a reader-facing field: "{w}"')

    if re.search(r'(?<![\w*])\*[^*\n]+\*(?![\w*])|font-style:\s*italic|fontStyle', text):
        say('major', 'file', 'markdown emphasis or an italic style is present; this project forbids italics')

    numbered = [l for l, _ in us if l.isdigit()]
    if numbered != [str(i) for i in range(1, len(numbered) + 1)]:
        say('critical', 'verse numbering', f'verses are not 1..N without a gap: {numbered}')
    m = re.search(r'^Verse count:\s*(\d+)', header, re.M)
    if m and int(m.group(1)) != len(numbered):
        say('major', 'Verse count', f'header says {m.group(1)}, file carries {len(numbered)} numbered verses')
    if not any(l == 'none' for l, _ in us):
        say('major', 'colophon', 'no unnumbered unit — the printed colophon is missing')

    for label, f in us:
        at = f'verse {label}'
        for k in ['deva', 'iast', 'en', 'tel', 'hi']:
            if not f.get(k):
                say('critical', at, f'missing {k}:')
        if not f.get('deva') or not f.get('iast'):
            continue
        want = dev2iast(f['deva']).strip()
        if want != f['iast'].strip():
            d = [l for l in difflib.unified_diff(want.split('\n'), f['iast'].split('\n'), lineterm='', n=0)
                 if l[:1] in '+-' and l[:3] not in ('+++', '---')]
            say('critical', at, 'iast is not what dev2iast makes of deva: ' + ' | '.join(d[:4]))
        if f.get('tel') and not re.search('[' + TELU + ']', f['tel']):
            say('critical', at, 'tel: is not in Telugu script')
        if f.get('hi') and not re.search('[' + DEVA + ']', f['hi']):
            say('critical', at, 'hi: is not in Devanāgarī')
        for k in ['en', 'tel', 'hi']:
            if f.get(k) and len(f[k]) < 40:
                say('minor', at, f'{k}: is suspiciously short')

    dnum = int(name[:3])
    if gretil and str(dnum) in gretil:
        printed = [l for label, f in us if label.isdigit() for l in f['deva'].split('\n') if l.strip()]
        pskel = ' '.join(skel(l) for l in printed)
        missing = []
        for v in gretil[str(dnum)]:
            for line in v['lines']:
                s = skel(line)
                g = [s[k:k + 6] for k in range(len(s) - 5)]
                if g and sum(1 for x in g if x in pskel) / len(g) < 0.55:
                    missing.append(f'{v["verse"]}: {line[:52]}')
        if missing:
            say('major', 'transcription', 'lines the witness has that this file does not appear to carry: '
                + '; '.join(missing[:6]))
    return bad


def main():
    argv = [a for a in sys.argv[1:] if not a.startswith('--')]
    as_json = '--json' in sys.argv
    gretil = json.load(open(ALIGNED)) if os.path.exists(ALIGNED) else None
    files = sorted(f for f in os.listdir(FOLDER) if re.match(r'^\d{3}_.*\.txt$', f))
    if argv:
        files = [f for f in files if f[:3] in {a.zfill(3) for a in argv}]
    report = {}
    for f in files:
        b = check(os.path.join(FOLDER, f), gretil)
        if b:
            report[f] = b
    if as_json:
        print(json.dumps(report, ensure_ascii=False, indent=1))
        return
    print(f'{len(files)} file(s) checked, {len(report)} with findings'
          + ('' if gretil else '  [no witness table: skeleton check skipped]'))
    for f, b in report.items():
        print(f'\n{f}')
        for x in b:
            print(f'  [{x["severity"]:8}] {x["where"]}: {x["problem"]}')
    sys.exit(1 if any(x['severity'] == 'critical' for b in report.values() for x in b) else 0)


if __name__ == '__main__':
    main()

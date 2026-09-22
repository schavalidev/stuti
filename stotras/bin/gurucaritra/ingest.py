#!/usr/bin/env python3
"""Turn a batch workflow's output into per-adhyāya verified text and units.

Writes, for each chapter in the batch:
    cache/gurucaritra/adhNN_verified.txt   the Devanāgarī read off the page
    cache/gurucaritra/adhNN_units.json     the en/tel/hi fields
and reports any chapter whose verse count does not match the book's own
table of contents, because that is the check that matters.

    python3 ingest.py /path/to/task.output
"""
import argparse, json, sys
from pathlib import Path

# Gaps that are the print's own numbering, verified on the page image, not text
# that is missing. Anything here has been looked at; nothing is assumed.
KNOWN_JUMPS = {'13': set(range(33, 43)), '18': {174}}

BIN = Path(__file__).resolve().parents[1]
CACHE = BIN / 'cache' / 'gurucaritra'


def load(path):
    d = json.loads(Path(path).read_text(encoding='utf-8'))
    r = d.get('result', d)
    if isinstance(r, str):
        r = json.loads(r)
    return r['chapters']


def write_verified(ch, expected):
    n = ch['adhyaya']
    by_after = {}
    for k in ch.get('kshepaka') or []:
        by_after.setdefault(k['after_verse'], []).append(k)
    lines = [
        f"# Adhyāya {n} — Devanāgarī read off the page images of the Dwisahasri",
        "# edition PDF, each verse cross-checked against the four-pass OCR vote of",
        "# DWISAHASRITeekaM and against the author's own anvaya.",
        "# Printed page number in brackets.",
    ]
    for v in sorted(ch['verses'], key=lambda x: x['num']):
        deva = v['deva'].split('\n')
        pg = v.get('printed_page', '?')
        lines.append(f"{v['num']:<3}[{pg}] {deva[0].strip()}")
        for extra in deva[1:]:
            lines.append(f"        {extra.strip()}")
        for k in by_after.get(v['num'], []):
            kd = k['deva'].split('\n')
            lines.append(f"-- [{k.get('printed_page','?')}] {kd[0].strip()}")
            for extra in kd[1:]:
                lines.append(f"        {extra.strip()}")
            lines.append("#       PRINTED UNNUMBERED and marked ksepaka by the edition.")
    if ch.get('corrections'):
        lines.append("#")
        lines.append("# Where the page corrected the OCR:")
        for c in ch['corrections']:
            lines.append(f"#   {c['num']}: {c['note']}")
    (CACHE / f'adh{n:02d}_verified.txt').write_text(
        '\n'.join(lines) + '\n', encoding='utf-8')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('output')
    a = ap.parse_args()
    contents = json.loads((CACHE / 'contents.json').read_text(encoding='utf-8'))
    ok, bad = [], []
    for ch in load(a.output):
        n = ch['adhyaya']
        expected = contents[str(n)]['verses']
        got = len({v['num'] for v in ch['verses']})
        write_verified(ch, expected)
        units = ch.get('units') or []
        (CACHE / f'adh{n:02d}_units.json').write_text(
            json.dumps(units, ensure_ascii=False, indent=1), encoding='utf-8')
        # `expected` is the LAST NUMBER the colophon carries, which is not the
        # same as the verse count: this edition's numbering jumps in places
        # (adhyāya 13 runs ||32|| straight to ||43||). A gap is reported so it
        # can be checked against the page, never silently filled.
        seen = {v['num'] for v in ch['verses']}
        missing = [i for i in range(1, expected + 1) if i not in seen]
        if str(n) in KNOWN_JUMPS:
            missing = [i for i in missing if i not in KNOWN_JUMPS[str(n)]]
        no_tr = [v['num'] for v in ch['verses']
                 if v['num'] not in {u['num'] for u in units}]
        row = (f"adh {n:>2}: {got}/{expected} verses, {len(units)} translated, "
               f"{len(ch.get('kshepaka') or [])} ksepaka")
        if missing or no_tr:
            bad.append(row + (f"  MISSING {missing}" if missing else "")
                       + (f"  UNTRANSLATED {no_tr}" if no_tr else ""))
        else:
            ok.append(row)
    for r in ok:
        print("  OK   " + r)
    for r in bad:
        print("  FIX  " + r)
    print(f"\n{len(ok)} clean, {len(bad)} need attention")


if __name__ == '__main__':
    main()

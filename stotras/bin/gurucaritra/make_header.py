#!/usr/bin/env python3
"""Build an adhyāya's header block.

The Source / recension prose is the same for every chapter of this work and is
kept here as one template rather than retyped twenty-three times, so it cannot
drift between files. Only the per-chapter matter — the title, the printed page
range, the corrections the page made to the OCR, the sections and the blurb —
comes in from outside.

    python3 make_header.py 2 --meta adh02_meta.json -o header.txt
"""
import argparse, json, sys
from pathlib import Path

BIN = Path(__file__).resolve().parents[1]
CACHE = BIN / 'cache' / 'gurucaritra'

SOURCE = (
 "Source / recension: Base text and authority, the printed Śrīgurucaritam (Dvisāhasrī) with "
 "the author's ṭīkā and Dr. V. V. Deshmukh's Marathi translation, archive.org item "
 "`Dwisahasri`, printed pages {pages}. Every verse below was read off the page images of that "
 "print, rendered at 190 dpi; the OCR was used to find a page and never to settle a reading. "
 "Second witness, the separate Deshmukh edition at archive.org item `DWISAHASRITeekaM`, whose "
 "scan carries the whole book OCR'd four times over — those four passes were voted against one "
 "another verse by verse and the result compared with the page. A third check sits inside the "
 "book itself: the author prints his own anvaya, a pada-split, beneath every śloka, and a "
 "doubtful compound was read against the way he divided it. The 1954 Pune print of the same "
 "Granthamālā (`in.ernet.dli.2015.405402`) is the ancestor of both and was consulted where a "
 "reading was in doubt. Note plainly that the two Devanāgarī editions are one lineage in two "
 "printings and not two independent lineages; the genuinely independent witness for this work "
 "is the Telugu-script edition of C. Sitarama Sastry (`SriDattaGuruCharitra`), which was not "
 "read for this adhyāya. Gītā Press does not publish this work in any language, and no "
 "critical edition of it exists; both were measured rather than assumed. IAST is generated "
 "mechanically from the Devanāgarī with `bin/dev2iast.py`. No accent is marked anywhere in "
 "this work, and none has been added."
)

AUTHOR = (
 "Author: Śrī Vāsudevānanda Sarasvatī (Ṭembe Svāmī), 1854–1914, who composed this Sanskrit "
 "Gurucaritra at Māṇgāv in 1884. The ṭīkā printed beneath the verses is his own, written some "
 "fifteen years later."
)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('adhyaya', type=int)
    ap.add_argument('--meta', required=True)
    ap.add_argument('-o', '--out', required=True)
    a = ap.parse_args()

    m = json.loads(Path(a.meta).read_text(encoding='utf-8'))
    c = json.loads((CACHE / 'contents.json').read_text(encoding='utf-8'))[str(a.adhyaya)]
    n = a.adhyaya

    corr = m.get('corrections_prose', '')
    note = "Recension note: " + (corr or
        "The four-pass OCR vote and the page image were compared for every verse of this "
        "adhyāya and no difference of reading was left unresolved.")
    if m.get('extra_note'):
        note += " — " + m['extra_note']

    parts = [
        f"Title: Śrī Gurucaritam (Dvisāhasrī) — Adhyāya {n}: {m['title_en']}",
        f"Devanāgarī: श्रीगुरुचरितम् (द्विसाहस्री) – {m['yoga_deva']} – {m['ordinal_deva']} – {c['name']}",
        f"Telugu: {m['title_tel']}",
        "",
        AUTHOR,
        "",
        SOURCE.format(pages=m['pages']),
        "",
        note,
        "",
        f"Verse count: {m['verse_count']}",
        "",
        "Sections:",
    ]
    parts += m['sections']
    parts += ["", "Blurb: " + m['blurb']]
    Path(a.out).write_text('\n'.join(parts) + '\n', encoding='utf-8')
    print(f"header for adhyāya {n} -> {a.out}", file=sys.stderr)


if __name__ == '__main__':
    main()

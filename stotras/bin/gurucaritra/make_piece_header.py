#!/usr/bin/env python3
"""Header block for the pieces that are not adhyāyas.

The Śrīgurustuti, the Yogarahasya and the Bodharahasya belong to the volume but
stand outside its twenty-three chapters, so they carry no yoga and no ordinal
and `make_header.py` does not fit them. The Source / recension prose is shared
with that script in substance but differs in one material point, and the
difference is the reason this file exists: there is no four-pass OCR vote for
these pieces, so the page image is the only witness and the file says so.

    python3 make_piece_header.py --meta gurustuti_meta.json -o header.txt
"""
import argparse, json, sys
from pathlib import Path

SOURCE = (
 "Source / recension: Base text and authority, the printed Śrīgurucaritam (Dvisāhasrī) with "
 "the author's ṭīkā and Dr. V. V. Deshmukh's Marathi translation, archive.org item "
 "`Dwisahasri`, printed pages {pages}. Every verse below was read off the page images of that "
 "print, rendered at 190 dpi. **The four-pass OCR vote used for the twenty-three adhyāyas is "
 "not available here**, because the scan that carries the book four times over does not serve "
 "this part of the volume in a form that can be voted; the page image is therefore the sole "
 "witness for this piece, and it is read the more carefully for that. Where a character could "
 "not be read it is reported below rather than supplied. The author's own ṭīkā, printed "
 "beneath the verses, was used as a check on doubtful compounds, since it repeats and expounds "
 "them. Gītā Press does not publish this work in any language, and no critical edition of it "
 "exists; both were measured rather than assumed. IAST is generated mechanically from the "
 "Devanāgarī with `bin/dev2iast.py`. No accent is marked anywhere in this work, and none has "
 "been added."
)

AUTHOR = (
 "Author: Śrī Vāsudevānanda Sarasvatī (Ṭembe Svāmī), 1854–1914, who composed this Sanskrit "
 "Gurucaritra at Māṇgāv in 1884. The ṭīkā printed beneath the verses is his own, written some "
 "fifteen years later."
)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--meta', required=True)
    ap.add_argument('-o', '--out', required=True)
    a = ap.parse_args()
    m = json.loads(Path(a.meta).read_text(encoding='utf-8'))

    parts = [
        f"Title: Śrī Gurucaritam (Dvisāhasrī) — {m['title_en']}",
        f"Devanāgarī: {m['title_deva']}",
        f"Telugu: {m['title_tel']}",
        "",
        AUTHOR,
        "",
        SOURCE.format(pages=m['pages']),
        "",
        "Recension note: " + m['corrections_prose'],
        "",
        f"Verse count: {m['verse_count']}",
    ]
    if m.get('metre'):
        parts += ["", f"Metre: {m['metre']}"]
    parts += ["", "Sections:"] + m['sections'] + ["", "Blurb: " + m['blurb']]
    Path(a.out).write_text('\n'.join(parts) + '\n', encoding='utf-8')
    print(f"header -> {a.out}", file=sys.stderr)


if __name__ == '__main__':
    main()

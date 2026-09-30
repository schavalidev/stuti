#!/usr/bin/env python3
"""Pull the mūla out of the Gītā Press Bhāgavata (codes 26/27) text layer, decoded.

The edition sets the Sanskrit in ChanakyaBold 16pt in the left column and the Hindi in regular
Chanakya 15pt on the right; speaker lines (श्रीशुक उवाच) and colophons are ChanakyaItalic;
footnotes of variant readings (प्रा० पा०, the older printed reading) are Chanakya 14pt at the foot,
keyed by superscript numerals set in ChanakyaBold ~12pt inside the verse.

spans(pdf, first, last) -> list of lines [(page, y, kind, text)] in reading order, where kind is
  'verse', 'speaker', 'colophon', 'heading', 'note' or 'hindi'. Superscript markers are kept in
the verse text as ⁽n⁾ so they can be matched to the notes.
"""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from chanakya import decode

SUP = str.maketrans('0123456789', '⁰¹²³⁴⁵⁶⁷⁸⁹')


def page_lines(page, pno):
    rows = []
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                if not s['text'].strip():
                    continue
                font = s['font'].split('+')[-1]
                rows.append((round(s['bbox'][1]), s['bbox'][0], s['bbox'][3], font, round(s['size'], 1), s['text']))
    return rows


def classify(font, size, x, y, top):
    if y < top:
        return 'running'
    if font == 'DingbitsThree':
        return 'ornament'
    if font == 'ChanakyaItalic':
        return 'italic'
    if font == 'ChanakyaBold' and size >= 17.6:
        return 'heading'
    if font == 'ChanakyaBold' and size < 13.2:
        return 'sup'
    if font == 'ChanakyaBold' and x < 270:
        # 16pt normally; a line too long for the column is condensed to 14.3–15.6pt
        return 'verse'
    if font == 'ChanakyaBold':
        return 'hindi'      # the Hindi column's bold speaker lines (श्रीशुकदेवजी कहते हैं—)
    if font == 'Chanakya' and size <= 14.1:
        return 'note'
    return 'hindi'


def extract(doc, first, last, split_x=270):
    """Yield (page, kind, text) for the left column (Sanskrit side) and the notes, in order."""
    out = []
    for pno in range(first, last + 1):
        page = doc[pno - 1]
        rows = page_lines(page, pno)
        items = []
        for y, x, y2, font, size, t in rows:
            k = classify(font, size, x, y, 60)
            if k in ('running', 'ornament'):
                continue
            if k == 'hindi':
                continue
            items.append([y, x, k, font, size, t])
        # merge spans into lines: same kind and baseline within 7pt; superscripts join the
        # nearest line of verse afterwards, since they sit a few points above its baseline
        items.sort(key=lambda r: (r[0], r[1]))
        sups = [it for it in items if it[2] == 'sup']
        lines = []
        for y, x, k, font, size, t in items:
            if k == 'sup':
                continue
            if lines and abs(lines[-1][0] - y) <= 7 and lines[-1][2] == k:
                lines[-1][3].append((x, t, k))
                continue
            lines.append([y, x, k, [(x, t, k)]])
        for y, x, k, font, size, t in sups:
            near = [l for l in lines if l[2] == 'verse' and -3 <= l[0] - y <= 14]
            if near:
                near[0][3].append((x, '⁽' + t.strip() + '⁾', 'sup'))
            else:
                lines.append([y, x, 'sup', [(x, '⁽' + t.strip() + '⁾', 'sup')]])
        lines.sort(key=lambda l: (l[0], l[1]))
        # a Bold-16 line straight after a chapter heading is the edition's Hindi subtitle
        for i in range(1, len(lines)):
            if lines[i][2] == 'verse' and lines[i - 1][2] == 'heading':
                lines[i][2] = 'subtitle'
        for y, x, k, parts in lines:
            parts.sort()
            raw = ''
            for _, t, kk in parts:
                if kk == 'sup':
                    raw += '\x07' + t
                else:
                    raw += t
            # a footnote marker sits over a letter mid-word; move it to the end of that word before
            # decoding, so it never splits a half-form from its stem
            while '\x07' in raw:
                i = raw.index('\x07')
                j = raw.index('⁾', i) + 1
                mark, raw = raw[i + 1:j], raw[:i] + raw[j:]
                e = raw.find(' ', i)
                e = len(raw) if e < 0 else e
                raw = raw[:e] + '\x08' + mark + '\x08' + raw[e:]
            segs = raw.split('\x08')
            txt = ''.join(seg if n % 2 else decode(seg) for n, seg in enumerate(segs))
            txt = ' '.join(txt.split())
            txt = re.sub(r' ([ंः])', r'\1', txt)                   # हरि ं → हरिं
            txt = re.sub(r'\s+([।॥])', r'\1', txt)                 # no space before a daṇḍa
            txt = re.sub(r'([।॥])(⁽\d+⁾)', r'\2\1', txt)          # marker before the daṇḍa
            out.append((pno, k, txt))
    return out


if __name__ == '__main__':
    import fitz
    doc = fitz.open(sys.argv[1])
    a, b = int(sys.argv[2]), int(sys.argv[3])
    for p, k, t in extract(doc, a, b):
        print(p, k, t, sep='\t')

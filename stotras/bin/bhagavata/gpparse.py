#!/usr/bin/env python3
"""Group the decoded Gītā Press lines into adhyāyas and verses.

parse(lines) -> list of adhyāya dicts:
  {skandha, adhyaya, first_page, title (Hindi subtitle), units: [...], colophon, notes: {n: text}}
where each unit is {'kind': 'verse'|'speaker', 'n': verse number or None, 'lines': [...], 'page'}.

Numbering is taken from the print: a verse ends at the line carrying ॥ n, and the adhyāya number
from its own colophon. Nothing is renumbered.
"""
import re

DEV = '०१२३४५६७८९'
def dnum(s):
    return int(''.join(str(DEV.index(c)) if c in DEV else c for c in s))

# matched as the tail of the word before स्कन्धे, so the vowel-initial names are given without
# their first letter: संहितायामष्टमस्कन्धे has lost the अ of अष्टम to sandhi
SKANDHA = {'द्वादश': 12, 'कादश': 11, 'प्रथम': 1, 'द्वितीय': 2, 'तृतीय': 3, 'चतुर्थ': 4, 'पञ्चम': 5,
           'षष्ठ': 6, 'सप्तम': 7, 'ष्टम': 8, 'नवम': 9, 'दशम': 10}
# the print now and then drops the daṇḍas and sets the number straight after the text (सुराः४६)
BARE = re.compile(r'(?<=[\u0900-\u0963])\s*([०-९]+)\s*$')
MID = re.compile(r'॥(?:⁽\d+⁾)?\s*([०-९]+(?:\s*[-—]\s*[०-९]+)?)\s*(?:⁽\d+⁾)?\s*॥(?=\s*\S)')
END = re.compile(r'॥(?:⁽\d+⁾)?\s*([०-९]+(?:\s*[-—]\s*[०-९]+)?)\s*(?:⁽\d+⁾)?\s*(?:॥)?\s*(?:⁽\d+⁾)?\s*$')


def parse(lines):
    chapters, cur, buf = [], None, []
    pending_speaker = None

    def new():
        return {'skandha': None, 'adhyaya': None, 'first_page': None, 'title': '', 'units': [],
                'colophon': '', 'notes': [], 'heading': ''}

    cur = new()
    colo = []
    for page, kind, text in lines:
        if cur['first_page'] is None:
            cur['first_page'] = page
        if kind == 'note':
            cur['notes'].append((page, text))
            continue
        if kind == 'heading':
            cur['heading'] = (cur['heading'] + ' ' + text).strip()
            continue
        if kind in ('subtitle', 'center'):
            # the Hindi subtitle straight after the heading; anything else centred (an
            # invocation, a skandha's end-mark) is kept aside and never enters a verse
            if cur['heading'] and not cur['units'] and not buf:
                cur['title'] = (cur['title'] + ' ' + text).strip()
            else:
                cur.setdefault('extras', []).append(text)
            continue
        if kind == 'italic':
            if text.startswith('इति') or colo:
                colo.append(text)
                if re.search(r'ऽध्यायः\s*॥', text) or re.search(r'॥\s*[०-९]+\s*॥\s*$', text):
                    c = ' '.join(colo)
                    cur['colophon'] = c
                    m = re.search(r'(\S+?)स्कन्धे', c)
                    if m:
                        for k, v in SKANDHA.items():
                            if m.group(1).endswith(k):
                                cur['skandha'] = v
                                break
                    m = re.search(r'॥\s*([०-९]+)\s*॥\s*$', c)
                    if m:
                        cur['adhyaya'] = dnum(m.group(1))
                    if buf:
                        cur['units'].append({'kind': 'verse', 'n': None, 'lines': buf, 'page': page})
                        buf = []
                    chapters.append(cur)
                    cur = new(); colo = []
                continue
            # a speaker line. Anything still buffered is closed first, unnumbered, so the check
            # flags it; merging it into the next verse is how a title once became verse text
            if buf:
                cur['units'].append({'kind': 'verse', 'n': None, 'lines': buf, 'page': page})
                buf = []
            cur['units'].append({'kind': 'speaker', 'n': None, 'lines': [text], 'page': page})
            continue
        if kind == 'section':
            cur['units'].append({'kind': 'section', 'n': None, 'lines': [text], 'page': page})
            continue
        if kind in ('verse', 'sup') and text.startswith('“') and not buf:
            # a quotation from the Hindi notes set in the Sanskrit face (“रसो वै सः”)
            cur.setdefault('extras', []).append(text)
            continue
        if kind in ('verse', 'sup'):
            t = text
            if re.fullmatch(r'[।॥\s]+', t) and buf:
                buf[-1] += t
                continue
            # prose paragraphs run on: `माविश्चकार॥ २॥ अथ ह …` closes 2 and opens 3 mid-line
            while True:
                m = MID.search(t)
                if not m:
                    break
                buf.append(t[:m.end()].strip())
                cur['units'].append({'kind': 'verse', 'n': m.group(1), 'lines': buf, 'page': page})
                buf, t = [], t[m.end():].strip()
            if not t:
                continue
            buf.append(t)
            m = END.search(t)
            if m:
                cur['units'].append({'kind': 'verse', 'n': m.group(1), 'lines': buf, 'page': page})
                buf = []
                continue
            m = BARE.search(t)
            if m:
                prev = [u for u in cur['units'] if u['kind'] == 'verse' and u['n']]
                expect = (dnum(re.split(r'[-—]', prev[-1]['n'])[-1]) + 1) if prev else 1
                if dnum(m.group(1)) == expect:
                    cur['units'].append({'kind': 'verse', 'n': m.group(1), 'lines': buf, 'page': page,
                                         'nodanda': True})
                    buf = []
                else:
                    # not the next verse number: a footnote numeral set at the text's own size
                    buf[-1] = t[:m.start()] + '⁽' + str(dnum(m.group(1))) + '⁾'
    if buf or cur['units']:
        if buf:
            cur['units'].append({'kind': 'verse', 'n': None, 'lines': buf, 'page': None})
        chapters.append(cur)
    return chapters

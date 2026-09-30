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
END = re.compile(r'॥(?:⁽\d+⁾)?\s*([०-९]+(?:\s*[-—]\s*[०-९]+)?)\s*(?:॥)?\s*$')


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
        if kind == 'subtitle':
            cur['title'] = (cur['title'] + ' ' + text).strip()
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
            # a speaker line
            if buf:
                buf.append(text)   # rare: italic inside a verse
            else:
                cur['units'].append({'kind': 'speaker', 'n': None, 'lines': [text], 'page': page})
            continue
        if kind in ('verse', 'sup'):
            t = text
            if re.fullmatch(r'[।॥\s]+', t) and buf:
                buf[-1] += t
                continue
            buf.append(t)
            m = END.search(t)
            if m:
                cur['units'].append({'kind': 'verse', 'n': m.group(1), 'lines': buf, 'page': page})
                buf = []
    if buf or cur['units']:
        if buf:
            cur['units'].append({'kind': 'verse', 'n': None, 'lines': buf, 'page': None})
        chapters.append(cur)
    return chapters

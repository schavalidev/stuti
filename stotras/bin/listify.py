# -*- coding: utf-8 -*-
"""Set run-on ritual lists out as numbered lines, in the stotra fields only.

deva: and iast: always, and tel: where it carries the stotra itself rather than a
meaning — told apart by the Sanskrit ritual words (నమః, స్వాహా, సమర్పయామి …), which a
Telugu translation does not use. en:, hi: and a translating tel: are never touched.

Two rules keep it honest:

* **Accented lines are left alone.** A line carrying svara marks is Vedic chant, whose
  daṇḍas divide the pādas of one mantra rather than separating items; numbering it would
  say something about the text that is not true. The test is per line, not per unit — a
  service list very often sits at the foot of a unit whose mantra above it is accented,
  and that list is ordinary unaccented prose.
* **deva: and iast: are decided together.** The fields are line-aligned, so the decision
  is taken on the Devanāgarī and applied to the same line number of the IAST. Otherwise
  an accented Devanāgarī line would be skipped while its unaccented transliteration was
  numbered, and item 5 would stop meaning item 5.

Lossless by construction: the only characters added are the "N. " prefixes and the
newlines that replace the spaces after a daṇḍa. Verified per file before writing.
"""
import re, sys, pathlib

SKT = (r'नमः|नमो|पूजयामि|समर्पयामि|दर्शयामि|श्रावयामि|स्वाहा|तर्पयामि|आघ्रापयामि|घ्रापयामि|'
       r'कल्पयामि|प्रक्षालयामि|ध्यायामि|आवाहयामि|स्थापयामि')
IAST = (r'namaḥ|namo|pūjayāmi|samarpayāmi|darśayāmi|śrāvayāmi|svāhā|tarpayāmi|āghrāpayāmi|'
        r'ghrāpayāmi|kalpayāmi|prakṣālayāmi|dhyāyāmi|āvāhayāmi|sthāpayāmi')
TEL = (r'నమః|నమో|పూజయామి|సమర్పయామి|దర్శయామి|శ్రావయామి|స్వాహా|తర్పయామి|ఆఘ్రాపయామి|'
       r'ఘ్రాపయామి|కల్పయామి|ప్రక్షాళయామి|ధ్యాయామి|ఆవాహయామి|స్థాపయామి')
MARK = {'deva': re.compile(SKT), 'iast': re.compile(IAST), 'tel': re.compile(TEL)}
ACCENT = re.compile(r'[॒॑᳚᳛॓॔ᳪ᳭]')
DANDA = '।॥|'          # Devanāgarī single and double daṇḍa, and the IAST | standing for both
FIELDS = ('deva', 'iast', 'en', 'tel', 'hi', 'vidhi', 'variant')


def segments(line):
    """Split at daṇḍa runs, keeping the daṇḍas with the text before them.

    A double daṇḍa (॥ / ||) closes a list and must stay whole — splitting on the bare
    character would make a segment out of the second stroke.
    """
    out, buf, i = [], '', 0
    while i < len(line):
        buf += line[i]
        if line[i] in DANDA:
            while i + 1 < len(line) and line[i + 1] in DANDA:
                i += 1; buf += line[i]
            # A number may sit right after the daṇḍa with no space — ॥३॥ for "three
            # times", or नमः।१ numbering the nyāsa. It closes the item it follows; it does
            # not open a new one, so keep going rather than breaking here.
            if not re.match(r'[०-९0-9’‘”“\'")\]]', line[i + 1:]):
                out.append(buf.strip()); buf = ''
        i += 1
    if buf.strip():
        out.append(buf.strip())
    return out


TAIL = re.compile(r'[\s।॥|०-९0-9’‘”“\'")\]]+$')


def is_item(seg, mark):
    """True if the segment ENDS with a ritual formula.

    Containing one is not enough. A page of prose about the rite mentions svāhā and
    namaḥ in the middle of its sentences, and numbering that prose would be wrong; a
    real service or name closes on the formula — "gandhaṁ samarpayāmi", "oṁ yamāya
    namaḥ ॥३॥" — with nothing after it but daṇḍas, a repetition count or a quote mark.
    """
    return bool(re.search(f'(?:{mark.pattern})$', TAIL.sub('', seg)))


def listify(line, mark):
    """The numbered form of one run-on list line, or None to leave it alone."""
    if ACCENT.search(line):
        return None
    segs = segments(line)
    # A source that numbers its own items keeps its numbering; adding ours on top would
    # print two numbers against every line.
    if sum(bool(re.match(r'[०-९0-9]+[\s.)]', s)) for s in segs) >= 3:
        return None
    items = [s for s in segs if is_item(s, mark)]
    # Three items at least, and the line must be mostly list rather than mostly prose.
    if len(items) < 3 or len(items) < 0.6 * len(segs):
        return None
    # A heading may share the first segment with the first item ("aṅga pūjā — oṁ
    # sumukhāya namaḥ …"), so test the text before the dash rather than the whole
    # segment: the segment matches the ritual words, the heading alone does not.
    head = None
    if ' — ' in segs[0] and not mark.search(segs[0].split(' — ', 1)[0]):
        head, rest = segs[0].split(' — ', 1)
        head = head.rstrip() + ' —'
        segs = [rest.strip()] + segs[1:]
    elif not mark.search(segs[0]) and len(segs) > 1:
        head, segs = segs[0], segs[1:]
    return '\n'.join(([head] if head else []) + [f'{i}. {s}' for i, s in enumerate(segs, 1)])


def canon(s):
    """What must not change: the text with numbering and line breaks taken back out."""
    return re.sub(r'\s+', ' ', re.sub(r'^\d+\. ', '', s, flags=re.M)).strip()


def split_fields(block):
    """[(field-name-or-None, [lines])] for one unit, in order."""
    groups, cur = [], (None, [])
    for ln in block.split('\n'):
        m = re.match(rf'^({"|".join(FIELDS)}):(.*)$', ln)
        if m:
            groups.append(cur)
            cur = (m.group(1) if not m.group(2).strip() else None, [ln])
        else:
            cur[1].append(ln)
    groups.append(cur)
    return groups


def do_unit(block):
    groups = split_fields(block)
    by_name = {name: g for name, g in groups if name}
    # Decide on the Devanāgarī, then apply the same decision to the same line of the IAST.
    deva_hit = None
    if 'deva' in by_name:
        body = by_name['deva'][1:]
        deva_hit = {i for i, l in enumerate(body) if l.strip() and listify(l, MARK['deva'])}
    out, n = [], 0
    for name, lines in groups:
        if name not in MARK:
            out.extend(lines); continue
        body, new = lines[1:], [lines[0]]
        paired = (name == 'iast' and deva_hit is not None
                  and len(body) == len(by_name.get('deva', [''])[1:]))
        for i, l in enumerate(body):
            if not l.strip():
                new.append(l); continue
            if paired and i not in deva_hit:
                new.append(l); continue
            done = listify(l, MARK[name]) if (not paired or i in deva_hit) else None
            if done:
                new.append(done); n += 1
            else:
                new.append(l)
        out.extend(new)
    return '\n'.join(out), n


def process(text):
    parts = re.split(r'(^--- [^\n]*---$)', text, flags=re.M)
    out, total = [], 0
    for part in parts:
        if part.startswith('--- ') or '\n' not in part:
            out.append(part); continue
        new, n = do_unit(part)
        out.append(new); total += n
    return ''.join(out), total


def main(paths, write=False):
    tf = tl = 0
    for p in map(pathlib.Path, paths):
        old = p.read_text(encoding='utf-8')
        new, n = process(old)
        if not n:
            continue
        assert canon(old) == canon(new), f'TEXT CHANGED in {p}'
        tf += 1; tl += n
        print(f'{n:4d} lists  {p}')
        if write:
            p.write_text(new, encoding='utf-8')
    print(f'\n{tl} list lines in {tf} files' + ('  [written]' if write else '  [dry run]'))


if __name__ == '__main__':
    main([a for a in sys.argv[1:] if a != '--write'], '--write' in sys.argv)

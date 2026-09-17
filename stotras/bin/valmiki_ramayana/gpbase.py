"""Gita Press volumes as BASE text for the Ramayana kandas.

Vol 1 (gp1) = Bala..Kishkindha ; Part 2 (gp2) = Sundara..Uttara.
Segments a kanda into sargas and verse units, discarding the Hindi
translation block that follows every verse.
"""
import re, sys, os
CACHE = os.path.join(os.path.dirname(__file__), '..', 'cache', 'gitapress_ramayana')
D = '०१२३४५६७८९'
def dn(s):
    try: return int(''.join(str(D.index(c)) for c in s))
    except ValueError: return -1

# OCR: the closing danda of "॥ ६॥" is often read as a trailing ३.
def fixnum(v, expect):
    if v == expect: return v
    s = str(v)
    if len(s) > 1 and s.endswith('3') and int(s[:-1]) == expect: return expect
    return v

START = {
 'bala': 'तपःस्वाध्यायनिरतं तपस्वी वाग्विदां वरम्',
}

KANDA = {
 'bala':      ('gp1', 'बालकाण्डे'),
 'ayodhya':   ('gp1', 'योध्याकाण्डे'),
 'aranya':    ('gp1', 'रण्यकाण्डे'),
 'kishkindha':('gp1', 'किष्किन्धाकाण्डे'),
 'sundara':   ('gp2', 'सुन्दरकाण्डे'),
 'yuddha':    ('gp2', 'युद्धकाण्डे'),
 'uttara':    ('gp2', 'उत्तरकाण्डे'),
}

def raw(vol):
    return open(os.path.join(CACHE, vol + '_djvu.txt'), encoding='utf-8', errors='replace').read()

def colophons(kanda):
    vol, tag = KANDA[kanda]
    t = raw(vol)
    return [(m.start(), m.end()) for m in
            re.finditer(r'इत्यार्षे[^\n]{0,140}?' + tag + r'[^\n]{0,60}?सर्गः[^\n]{0,20}\n(?:[^\n]{0,200}पूरा हुआ[^\n]{0,20}\n)?', t)], t

HW = set('के की को का है हैं थे था थी ने से में पर और हुए हुआ हुई लिये लिए उस इस वे वह यह भी तो जो कर गये गयी गया रहे रही रहा हो ही नहीं उन इन उनके उसके इसके अपने अपनी अपना मैं हम तुम आप कि जब तब यदि किन्तु परंतु परन्तु फिर अब यहाँ वहाँ कहा बोले कहने लगे लगी लगा करके होकर देखकर साथ बाद पास ओर तरह भाँति समान द्वारा हुये किया किये कहते उन्होंने इसलिए तथा वाले वाला वाली रहने जाने करने होने दिया दिये ले लेकर'.split())
def hindi(l):
    w = re.findall(r'[ऀ-ॿ]+', l)
    return (not w) or any(x in HW for x in w) or bool(re.search(r'[ड़ढ़ॉ]|\(|\)|[०-९]\)', l))

NUM = re.compile(r'॥\s*([०-९]+)\s*॥')
HDR = re.compile(r'(काण्डे|सर्गः|सर्ग:|सगः|श्रीमद्वाल्मीकीय|रामायण|वाल्मीकि)')

def span(kanda):
    """Character span of a kanda: from just before its first colophon's sarga
    back to the previous kanda's last colophon, through its own last colophon."""
    order = [k for k, (v, _) in KANDA.items() if v == KANDA[kanda][0]]
    cols, t = colophons(kanda)
    if not cols: raise SystemExit('no colophons for ' + kanda)
    i = order.index(kanda)
    lo = 0
    if kanda in START:
        lo = t.index(START[kanda])
    elif i > 0:
        prev, _ = colophons(order[i-1])
        lo = prev[-1][1] if prev else 0
    return lo, cols[-1][1], t

def sanskrit_lines(kanda):
    """Sanskrit verse lines of a kanda, in order, Hindi blocks removed."""
    lo, hi, t = span(kanda)
    seg = t[lo:hi]
    L, off, p = [], [], 0
    for l in seg.split('\n'):
        L.append(l); off.append(lo + p); p += len(l) + 1
    out, skip = [], None
    for l, o in zip(L, off):
        m = NUM.search(l)
        if skip is not None:
            if m and dn(m.group(1)) == skip: skip = None; continue
            if (m and dn(m.group(1)) == skip + 1 and not hindi(l)) or \
               (not m and not hindi(l) and re.search(r'।\s*$', l)): skip = None
            else: continue
        if not l.strip() or len(re.findall(r'[ऀ-ॿ]', l)) < 6: continue
        if HDR.search(l) and not m: continue
        if 'इत्यार्षे' in l or 'पूरा हुआ' in l: continue
        if '।' not in l and '॥' not in l: continue
        out.append((o, l.strip()))
        if m: skip = dn(m.group(1))
    return out

def verses(kanda):
    """[(sarga_no, [(verse_no, [lines]), ...]), ...] by numeral resets."""
    L = sanskrit_lines(kanda)
    units, cur = [], []
    for l in L:
        m = NUM.search(l)
        cur.append(l)
        if m:
            units.append((dn(m.group(1)), cur)); cur = []
    if cur: units.append((None, cur))
    sargas, s = [], []
    for v in units:
        if v[0] == 1 and s:
            sargas.append(s); s = []
        s.append(v)
    if s: sargas.append(s)
    return [(i + 1, sg) for i, sg in enumerate(sargas)]

def sargas(kanda):
    """Split a kanda into sargas at colophon offsets, recovering colophons the
    OCR destroyed by looking for a verse-number reset inside an over-long span."""
    cols, t = colophons(kanda)
    lo, hi, _ = span(kanda)
    bounds = [e for _, e in cols]
    L = sanskrit_lines(kanda)
    groups, i = [], 0
    for b in bounds:
        g = []
        while i < len(L) and L[i][0] < b:
            g.append(L[i]); i += 1
        groups.append(g)
    out = []
    for g in groups:
        units, cur = [], []
        for o, l in g:
            cur.append(l)
            m = NUM.search(l)
            if m: units.append((dn(m.group(1)), cur)); cur = []
        if cur: units.append((None, cur))
        # recover a destroyed colophon: a reset to 1 after a run above 3
        split, seen = [[]], 0
        for u in units:
            if u[0] == 1 and seen > 3:
                split.append([]); seen = 0
            split[-1].append(u)
            if u[0] and u[0] > seen: seen = u[0]
        out.extend([s for s in split if s])
    return [(i + 1, sg) for i, sg in enumerate(out)]

def repair(units):
    """Numerals are OCR-damaged, most often by the closing danda being read as
    an extra digit (॥ ९३॥ -> 933). Enforce the monotone run."""
    out, exp = [], 1
    for v, lines in units:
        if v != exp:
            s = str(v) if v is not None else ''
            cand = None
            for k in range(1, len(s)):           # drop trailing OCR digits
                if s[:-k] and int(s[:-k]) == exp: cand = exp; break
            if cand is None and s and s.startswith(str(exp)): cand = exp
            v = cand if cand is not None else v
        out.append((v, lines))
        exp = (v + 1) if isinstance(v, int) and v == exp else exp + 1
    return out

def kanda(name):
    out = []
    for n, sg in sargas(name):
        sg = repair(sg)
        # the colophon echoes the sarga number as a final bogus verse
        while len(sg) > 1 and isinstance(sg[-1][0], int) and isinstance(sg[-2][0], int) \
              and sg[-1][0] < sg[-2][0]:
            sg.pop()
        out.append((n, sg))
    return out

"""Three-witness collation for a Ramayana kanda.

base    = Gita Press (gpbase.kanda)
south   = valmikiramayan.net  (Devanagari)
crit    = Baroda critical edition (IAST -> compared on a folded key)

Alignment is by opening line, never by verse number: the three editions
divide and number differently.
"""
import re, json, sys, difflib, unicodedata
import gpbase, parse_vr

DEV = 'ऀ-ॿ'
def dev_key(s):
    s = re.sub(r'[^ऀ-ॿ]', '', s)
    s = s.replace('‌', '').replace('‍', '')
    s = re.sub(r'[०-९]', '', s)
    s = re.sub(r'[।॥]', '', s)
    # fold anusvara against the conjunct nasals
    s = re.sub(r'[ङञणनम]्(?=[कखगघचछजझटठडढतथदधपफबभ])', 'ं', s)
    return s

IAST2 = {'ā':'a','ī':'i','ū':'u','ṛ':'r','ṝ':'r','ḷ':'l','ṅ':'n','ñ':'n','ṇ':'n',
         'ṭ':'t','ḍ':'d','ś':'s','ṣ':'s','ṃ':'m','ṁ':'m','ḥ':'h','ĕ':'e','ŏ':'o'}
def iast_key(s):
    s = unicodedata.normalize('NFC', s.lower())
    s = ''.join(IAST2.get(c, c) for c in s)
    return re.sub(r'[^a-z]', '', s)

DEV2IAST_ROUGH = None
def dev_to_rough(s):
    """Crude Devanagari -> consonant/vowel skeleton, good enough to match a
    half-line against the critical edition's IAST."""
    import subprocess, os
    global DEV2IAST_ROUGH
    if DEV2IAST_ROUGH is None:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            'dev2iast', os.path.join(os.path.dirname(__file__), '..', 'dev2iast.py'))
        m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
        DEV2IAST_ROUGH = m
    fn = getattr(DEV2IAST_ROUGH, 'convert', None) or getattr(DEV2IAST_ROUGH, 'dev2iast', None)
    return iast_key(fn(s)) if fn else ''

def ratio(a, b):
    return difflib.SequenceMatcher(None, a, b).ratio()

def load_south(kanda_dir, n):
    try:
        V, col = parse_vr.parse(f'../cache/{kanda_dir}/{n}.htm')
        return V, col
    except Exception as e:
        return [], []

def align(base_units, other_units, keyf_a, keyf_b, cut=0.60):
    """Monotone greedy match of base verse units onto another witness's."""
    out, j = [], 0
    for i, (bn, blines) in enumerate(base_units):
        a = keyf_a(' '.join(blines))
        best, bj = 0.0, None
        for k in range(j, min(j + 25, len(other_units))):
            b = keyf_b(' '.join(other_units[k][1]))
            r = ratio(a, b)
            if r > best: best, bj = r, k
        if bj is not None and best >= cut:
            out.append((bn, blines, other_units[bj][0], other_units[bj][1], round(best, 3)))
            j = bj + 1
        else:
            out.append((bn, blines, None, None, round(best, 3)))
    return out

def run(kanda='bala', kdir='vr_baala', nsarga=None):
    base = gpbase.kanda(kanda)
    crit = json.load(open('../cache/crit_bala.json'))
    # map GP sargas onto critical sargas by opening line, not by number
    copen = {int(k): iast_key(' '.join(list(d.values())[0])) for k, d in crit.items()}
    critmap, used = {}, set()
    for sn, units in base:
        a = dev_to_rough(' '.join(units[0][1]))
        best, bk = 0.0, None
        for k, b in copen.items():
            if k in used: continue
            r = ratio(a[:60], b[:60])
            if r > best: best, bk = r, k
        if bk is not None and best >= 0.7:
            critmap[sn] = bk; used.add(bk)
    res = {'_critmap': {str(k): v for k, v in critmap.items()}}
    for sn, units in base:
        if nsarga and sn not in nsarga: continue
        S, col = load_south(kdir, sn)
        am = align(units, S, dev_key, dev_key)
        cu = crit.get(str(critmap.get(sn, sn)))
        cl = [(int(v), l) for v, l in sorted(cu.items(), key=lambda x: int(x[0]))] if cu else []
        ac = align(units, cl, dev_to_rough, lambda s: iast_key(s), cut=0.55)
        res[sn] = {
            'gp_units': len(units),
            'south_units': len(S),
            'crit_units': len(cl),
            'south_matched': sum(1 for r in am if r[2] is not None),
            'crit_matched': sum(1 for r in ac if r[2] is not None),
            'colophon': ' '.join(col)[:120],
        }
    return res

if __name__ == '__main__':
    r = run()
    cm = r.pop('_critmap', {})
    print('GP sargas mapped onto critical sargas:', len(cm), 'of', len(r))
    json.dump(r, open('../cache/bala_collation_summary.json', 'w'), ensure_ascii=False, indent=1)
    bad = [(k, v) for k, v in r.items() if v['south_matched'] < v['gp_units'] * 0.85]
    print('sargas', len(r))
    print('GP units', sum(v['gp_units'] for v in r.values()))
    print('south matched', sum(v['south_matched'] for v in r.values()))
    print('crit matched', sum(v['crit_matched'] for v in r.values()))
    print('weak sargas (<85% south match):', len(bad))
    for k, v in bad[:12]: print('  ', k, v['gp_units'], v['south_matched'], v['south_units'])

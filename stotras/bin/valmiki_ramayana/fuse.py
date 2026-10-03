"""The Gītā Press text of a kāṇḍa, voted out of every independent scan's OCR.

No single OCR of the Gītā Press volumes is clean enough to print from, but the ten or eleven
scans on archive.org were made from different copies by different people and their errors are
mostly independent. So each scan's OCR is aligned, half-line by half-line, against a clean
digital skeleton (the IITK text), and the Gītā Press reading of each half-line is then voted
word by word across the scans. The skeleton only says *where* a half-line is; it never supplies
a reading. Where the scans do not agree strongly, the half-line is flagged for a reading off the
page image.

    python3 fuse.py <kanda>      -> ../cache/gitapress_ramayana/fused/<kanda>.json

Needs rapidfuzz (python3 -m venv <dir> && <dir>/bin/pip install rapidfuzz pillow).
"""
import re, sys, os, json, bisect, unicodedata, collections
from rapidfuzz import fuzz
from rapidfuzz.distance import Levenshtein
import sources as S

OUT = os.path.join(S.GPC, 'fused')

# ------------------------------------------------------------------ normalising
def clean(s):
    s = unicodedata.normalize('NFC', s)
    for z in '‌‍­﻿':
        s = s.replace(z, '')
    s = re.sub(r'(?<=[ऀ-ॿ])\s*:', 'ः', s)
    s = s.replace('|', '।').replace('।।', '॥')
    s = re.sub(r'^[^ऀ-ॿ]+', '', s)               # leading quote marks and scan junk
    s = re.sub(r'^[०-९]+\s+(?=[ऀ-ॿ])', '', s)     # a stray marginal numeral
    s = re.sub(r'\s+', ' ', s).strip()
    return s

TAIL = re.compile(r'\s*(॥\s*([०-९]{1,3})\s*॥?|॥|।)[^ऀ-ॿ]*$')
def split_tail(s):
    """'text ॥ १२॥' -> ('text', '॥', 12); 'text।' -> ('text', '।', None)."""
    m = TAIL.search(s)
    if not m:
        return s.strip(), None, None
    num = S.dn(m.group(2)) if m.group(2) else None
    return s[:m.start()].strip(), ('॥' if '॥' in m.group(1) else '।'), num

def key(s):
    """A matching key: letters only, nasals and sibilant sandhi folded. Never printed."""
    s = clean(s).replace(' ', '')
    s = re.sub(r'[ङञणनम]्(?=[क-ह])', '', s)
    s = re.sub('[^\u0904-\u0939\u093e-\u094c\u0960-\u0963]', '', s)
    s = re.sub(r'([शषस])\1', r'\1', s)
    return s

def k2(s):
    """Same reading modulo orthography: spacing, anusvāra for a homorganic nasal, visarga
    written as the following sibilant. Keeps every mark that changes a word's form."""
    s = clean(s)
    s = re.sub(r'[\s।॥०-९\d]', '', s)
    s = re.sub(r'[ङञणनम]्(?=[क-ह])', 'ं', s)
    s = re.sub(r'([शषस])्(?=\1)', 'ः', s)
    return s

def grams(k):
    return {k[i:i + 3] for i in range(len(k) - 2)}

# ------------------------------------------------------------------ one OCR stream
class Stream:
    def __init__(self, tag, lines):
        self.tag = tag
        self.raw = lines
        self.cl = [clean(l) for l in lines]
        self.key = [key(c) for c in self.cl]
        self.idx = collections.defaultdict(list)
        for j, k in enumerate(self.key):
            for g in grams(k):
                self.idx[g].append(j)

    def cands(self, sk, lo, hi, top=10):
        c = collections.Counter()
        for g in grams(sk):
            L = self.idx.get(g)
            if not L:
                continue
            a, b = bisect.bisect_left(L, lo), bisect.bisect_right(L, hi)
            if b - a > 4000:
                continue                       # a gram common everywhere says nothing
            for j in L[a:b]:
                c[j] += 1
        return [j for j, _ in c.most_common(top)]

    def score(self, sk, j):
        """(score, span): the line alone, or joined with the next (a wrapped half-line)."""
        best = (fuzz.ratio(sk, self.key[j]) / 100, 1)
        if j + 1 < len(self.key):
            s2 = fuzz.ratio(sk, self.key[j] + self.key[j + 1]) / 100
            if s2 > best[0] + 0.05:
                best = (s2, 2)
        if j > 0:
            s0 = fuzz.ratio(sk, self.key[j - 1] + self.key[j]) / 100
            if s0 > best[0] + 0.05:
                best = (s0, -2)
        return best

def lis_filter(pairs, tol=60):
    """Keep the anchors (i, j) that form a near-monotone run in j; drop wild jumps."""
    if not pairs:
        return pairs
    # longest non-decreasing subsequence on j, with a tolerance for local column reordering
    js = [j for _, j in pairs]
    n = len(js)
    best = [1] * n; prev = [-1] * n
    # O(n log n) is not needed at this size per kāṇḍa when windowed: do a banded DP
    for a in range(n):
        for b in range(max(0, a - 60), a):
            if js[b] <= js[a] + tol and best[b] + 1 > best[a]:
                best[a] = best[b] + 1; prev[a] = b
    a = max(range(n), key=lambda x: best[x])
    keep = set()
    while a != -1:
        keep.add(a); a = prev[a]
    return [p for k, p in enumerate(pairs) if k in keep]

def align(skel_keys, st, region=None):
    """For each skeleton half-line, the OCR line (j, span, score) that carries it, or None."""
    n = len(skel_keys)
    lo0, hi0 = region if region else (0, len(st.key) - 1)
    res = [None] * n
    # pass 1: confident anchors, walking forward
    last, miss = None, 0
    for i, sk in enumerate(skel_keys):
        if len(sk) < 8:
            continue
        resync = last is None or miss > 40
        if resync:
            lo, hi, need = lo0, hi0, 0.86
        else:
            lo, hi, need = max(lo0, last - 40), min(hi0, last + 400 + 15 * miss), 0.80
        best = None
        for j in st.cands(sk, lo, hi):
            sc, sp = st.score(sk, j)
            if not resync:
                d = j - last
                # forward is where the text goes (a Hindi block can be long); backward only a little
                sc -= 0.0006 * max(0, d - 60) if d >= 0 else 0.003 * max(0, -d - 10)
            if best is None or sc > best[0]:
                best = (sc, j, sp)
        if best and best[0] >= need:
            res[i] = (best[1], best[2], round(best[0], 3)); last = best[1]; miss = 0
        else:
            miss += 1
    anchors = lis_filter([(i, r[0]) for i, r in enumerate(res) if r])
    keep = {i for i, _ in anchors}
    res = [r if i in keep else None for i, r in enumerate(res)]
    # pass 2: fill between anchors, looser
    ai = sorted(keep)
    for t in range(len(ai) + 1):
        ia = ai[t - 1] if t > 0 else -1
        ib = ai[t] if t < len(ai) else n
        if ib - ia <= 1:
            continue
        ja = res[ia][0] if ia >= 0 else None
        jb = res[ib][0] if ib < n else None
        if ja is None and jb is None:
            continue
        lo = (ja - 30) if ja is not None else max(lo0, jb - 300)
        hi = (jb + 30) if jb is not None else min(hi0, ja + 300)
        if hi - lo > 1500:
            continue
        for i in range(ia + 1, ib):
            sk = skel_keys[i]
            if len(sk) < 4:
                continue
            best = None
            for j in st.cands(sk, max(lo0, lo), min(hi0, hi)):
                sc, sp = st.score(sk, j)
                if best is None or sc > best[0]:
                    best = (sc, j, sp)
            if best and best[0] >= (0.62 if len(sk) >= 12 else 0.75):
                res[i] = (best[1], best[2], round(best[0], 3))
                lo = best[1] - 30
    return res

def reading(st, r):
    j, sp, _ = r
    if sp == 1:
        return st.cl[j]
    if sp == 2:
        return st.cl[j] + ' ' + st.cl[j + 1]
    return st.cl[j - 1] + ' ' + st.cl[j]

# ------------------------------------------------------------------ voting
def map_index(ops, i):
    for tag, i1, i2, j1, j2 in ops:
        if i1 <= i < i2 or (i == i2 == i1):
            if tag == 'equal':
                return j1 + (i - i1)
            if tag == 'replace':
                return j1 + round((i - i1) * (j2 - j1) / max(1, i2 - i1))
            return j1
    return ops[-1][4] if ops else 0

def vote(texts, skel=None, need=2):
    """The Gītā Press reading of one half-line, from the scans' readings.

    A scan reading that reproduces the digital skeleton (modulo orthography) is strong evidence:
    OCR errors scatter, so two scans landing independently on the skeleton's exact form means the
    print carries it. Where that happens for the whole line, the commonest exact form among those
    scans is taken, which gives the print's own spelling and spacing.

    Otherwise the line is voted word slot by word slot. The medoid reading fixes the slots; every
    other reading is aligned to it and contributes the substring that falls in each slot. For each
    slot the candidates are grouped by orthographic key. A group matching the skeleton with two or
    more votes wins outright. A different group wins only with at least three votes and 40% of the
    scans; it is then a *variant* against the skeleton, which must be checked on the page image,
    because some OCR errors are shared by every scan (GP's ज्ञ is read as श by most engines).
    Anything less is a *doubt*.

    Returns (text, status, info): status 'confirmed' | 'voted' | 'variant' | 'doubt'."""
    texts = [t for t in texts if t]
    if not texts:
        return '', 'missing', {}
    sk2 = k2(skel) if skel else None
    if sk2:
        hits = [t for t in texts if k2(t) == sk2]
        if len(hits) >= need:
            c = collections.Counter(re.sub(r'\s+', ' ', t) for t in hits)
            return c.most_common(1)[0][0], 'confirmed', {'hits': len(hits), 'n': len(texts)}
    n = len(texts)
    if n == 1:
        return texts[0], 'doubt', {'n': 1}
    sims = [[0] * n for _ in range(n)]
    for a in range(n):
        for b in range(a + 1, n):
            sims[a][b] = sims[b][a] = fuzz.ratio(texts[a], texts[b])
    med = max(range(n), key=lambda a: sum(sims[a]))
    m = texts[med]
    spans = [(x.start(), x.end()) for x in re.finditer(r'\S+', m)]
    slots = [collections.Counter() for _ in spans]
    for t in texts:
        ops = Levenshtein.opcodes(m, t).as_list() if t != m else None
        for k, (a, b) in enumerate(spans):
            w = m[a:b] if ops is None else t[map_index(ops, a):map_index(ops, b)].strip()
            slots[k][w] += 1
    skw = [None] * len(spans)
    if skel:
        ops = Levenshtein.opcodes(m, skel).as_list()
        for k, (a, b) in enumerate(spans):
            skw[k] = k2(skel[map_index(ops, a):map_index(ops, b)])
    out, notes = [], []
    worst = 'voted'
    rank = {'voted': 0, 'variant': 1, 'doubt': 2}
    for k, c in enumerate(slots):
        groups = collections.defaultdict(collections.Counter)
        for w, v in c.items():
            groups[k2(w)][w] += v
        tot = {g: sum(x.values()) for g, x in groups.items()}
        st = None
        if skw[k] is not None and tot.get(skw[k], 0) >= 2:
            g, st = skw[k], 'voted'
        else:
            g = max(tot, key=lambda x: tot[x])
            if tot[g] >= 3 and tot[g] >= 0.4 * n:
                st = 'voted' if (skw[k] is None or g == skw[k]) else 'variant'
            else:
                st = 'doubt'
        w = groups[g].most_common(1)[0][0]
        out.append(w)
        if st != 'voted':
            notes.append({'slot': k, 'status': st, 'cands': dict(c.most_common(6)), 'skel': skw[k]})
            if rank[st] > rank[worst]:
                worst = st
    text = re.sub(r'\s+', ' ', ' '.join(x for x in out if x)).strip()
    if sk2 and k2(text) == sk2:
        worst = 'voted'           # slot boundaries were off, but the line agrees with the skeleton
        notes = [x for x in notes if x['status'] == 'doubt' and False]
    return text, worst, {'n': n, 'slots': notes}

# ------------------------------------------------------------------ the kāṇḍa
def skeleton(k):
    """[(iitk sarga, iitk verse, half index, text)].

    The Uttarakāṇḍa is the exception. The IITK and wikisource Uttarakāṇḍa is the critical
    edition's text, not the vulgate the Gītā Press prints, so it cannot say where a GP line is.
    There the skeleton is the primary scan's own Sanskrit lines (gpbase.sanskrit_lines), and a
    line counts as confirmed only when three scans agree on it exactly (see vote)."""
    if k == 'uttara':
        import gpbase
        out = []
        for n, (off, line) in enumerate(gpbase.sanskrit_lines('uttara')):
            if line.lstrip().startswith('॥') or re.search(r'सम्पूर्ण|नमः\s*॥?$|उत्तरकाण्डम्', line):
                continue                     # headers: '॥ युद्धकाण्ड सम्पूर्णम्', '॥ श्रीसीतारामचन्द्राभ्यां नमः'
            body, end, num = split_tail(clean(line))
            if HINDI_MARK.search(body) or any(w in HINDI for w in body.split()):
                continue                     # a Hindi translation line that ends in a daṇḍa
            if len(re.findall('[क-ह]', body)) >= 4:
                out.append(('gp', off, n, body))
        return out
    out = []
    for s, v, halves in S.iitk(k):
        for h, t in enumerate(halves):
            out.append((s, v, h, t))
    return out

def region_of(st, skel_keys):
    """Locate the kāṇḍa in a volume-level stream by its first and last confident lines."""
    def find(sks):
        for sk in sks:
            if len(sk) < 14:
                continue
            best = None
            for j in st.cands(sk, 0, len(st.key) - 1):
                sc, _ = st.score(sk, j)
                if best is None or sc > best[0]:
                    best = (sc, j)
            if best and best[0] >= 0.9:
                return best[1]
        return None
    a = find(skel_keys[:40]); b = find(skel_keys[::-1][:40])
    if a is None or b is None or b < a:
        return None
    return (max(0, a - 300), min(len(st.key) - 1, b + 300))

def run(k):
    vol = S.VOL[k]
    sk = skeleton(k)
    skk = [key(t) for *_, t in sk]
    streams = [Stream(f's{n}', lines) for n, (tag, lines) in enumerate(S.ocr_sets(vol))]
    hl = S.hocr(vol)
    prim = Stream('hocr', [t for t, _, _ in hl])
    per = {}
    for st in streams + [prim]:
        reg = region_of(st, skk)
        if reg is None:
            print(f'  {st.tag}: kāṇḍa not found', file=sys.stderr)
            continue
        res = align(skk, st, reg)
        per[st.tag] = (st, res, reg)
        got = sum(1 for r in res if r)
        print(f'  {st.tag}: region {reg} matched {got}/{len(sk)}', file=sys.stderr)
    rows = []
    for i, (s, v, h, t) in enumerate(sk):
        reads, nums, ends = {}, collections.Counter(), collections.Counter()
        for tag, (st, res, _) in per.items():
            if tag == 'hocr' or not res[i]:
                continue
            body, end, num = split_tail(reading(st, res[i]))
            reads[tag] = body
            if end: ends[end] += 1
            if num is not None: nums[num] += 1
        cover = sum(1 for tag, (st, res, reg) in per.items() if tag != 'hocr' and covered(res, i))
        text, status, info = vote(list(reads.values()), t, 3 if k == 'uttara' else 2)
        loc = None
        if 'hocr' in per and per['hocr'][1][i]:
            j = per['hocr'][1][i][0]
            loc = {'leaf': hl[j][1], 'bbox': hl[j][2]}
        rows.append({'i': i, 'iitk': f'{s}.{v}.{h}' if s != 'gp' else None, 'skel': t, 'gp': text, 'status': status, 'info': info,
                     'n_read': len(reads), 'cover': cover,
                     'end': ends.most_common(1)[0][0] if ends else None,
                     'num': nums.most_common(1)[0][0] if nums else None,
                     'num_votes': dict(nums), 'reads': reads, 'loc': loc,
                     'ocr_pos': {tag: res[i][0] for tag, (st, res, _) in per.items() if res[i]}})
    nb = train_nb(per)
    extra = gp_only(per, sk, skk, nb)
    for e in extra:
        e['p_sans'] = round(nb.p_sanskrit(e['gp']), 3)
    rows = dedup(rows)
    cols = colophons(per)
    os.makedirs(OUT, exist_ok=True)
    json.dump({'kanda': k, 'rows': rows, 'extra': extra, 'colophons': cols,
               'streams': {tag: reg for tag, (_, _, reg) in per.items()}},
              open(os.path.join(OUT, f'{k}.json'), 'w'), ensure_ascii=False)
    return rows, extra

def covered(res, i, w=6):
    """Does this stream match the neighbourhood of skeleton line i at all?"""
    a = any(res[x] for x in range(max(0, i - w), i))
    b = any(res[x] for x in range(i + 1, min(len(res), i + w + 1)))
    return a and b

# ------------------------------------------------------------------ Sanskrit or Hindi?
import math
class NB:
    """Character-trigram naive Bayes, trained per kāṇḍa on the scans themselves: lines that
    matched the skeleton are Sanskrit; unmatched lines carrying an unmistakably Hindi mark are
    Hindi. Trained on OCR text, so it has seen the same noise it will be asked about."""
    def __init__(self, sans, hind):
        self.c = [collections.Counter(), collections.Counter()]
        for lab, L in ((0, sans), (1, hind)):
            for s in L:
                self.c[lab].update(self.feats(s))
        self.tot = [sum(x.values()) for x in self.c]
        self.V = len(set(self.c[0]) | set(self.c[1])) + 1
        self.prior = [math.log(len(sans) + 1), math.log(len(hind) + 1)]
    @staticmethod
    def feats(s):
        s = ' ' + re.sub(r'[^ऀ-ॿ ]', '', s) + ' '
        return [s[i:i + 3] for i in range(len(s) - 2)]
    def p_sanskrit(self, s):
        lp = [0.0, 0.0]
        for lab in (0, 1):
            lp[lab] = sum(math.log((self.c[lab][g] + 1) / (self.tot[lab] + self.V)) for g in self.feats(s))
        d = max(-50, min(50, lp[1] - lp[0]))
        return 1 / (1 + math.exp(d))

def train_nb(per):
    sans, hind = [], []
    for tag, (st, res, reg) in per.items():
        if tag == 'hocr':
            continue
        used = {r[0] for r in res if r}
        for j in range(reg[0], reg[1]):
            if j in used:
                sans.append(st.cl[j])
            elif HINDI_MARK.search(st.cl[j]) or any(w in HINDI for w in st.cl[j].split()):
                hind.append(st.cl[j])
    return NB(sans, hind)

COLO_RE = re.compile(r'इत्यार्षे|त्यार्षे श्री|रामायणे वाल्मीकीये|आदिकाव्ये')
def colophons(per):
    """For each stream, the skeleton index after which a colophon stands."""
    out = {}
    for tag, (st, res, reg) in per.items():
        if tag == 'hocr':
            continue
        pos = [(r[0], i) for i, r in enumerate(res) if r]
        pos.sort()
        js = [p for p, _ in pos]
        hits = []
        for j in range(reg[0], reg[1]):
            if COLO_RE.search(st.cl[j]):
                k = bisect.bisect_left(js, j) - 1
                if k >= 0:
                    # the last skeleton line before the colophon, by skeleton order
                    hits.append(max(i for p, i in pos[max(0, k - 3):k + 1]))
        out[tag] = sorted(set(hits))
    return out

def dedup(rows):
    """IITK's merged entries repeat whole verses, so two or three skeleton lines land on the same
    printed line. A printed line is identified by where it sits in each scan; skeleton lines that
    share a position in most of the scans that read them are one printed line. Keep the one whose
    skeleton text is closest to the voted reading and mark the others as duplicates."""
    owner = {}
    for r in rows:
        for t, j in r['ocr_pos'].items():
            if t == 'hocr':
                continue
            owner.setdefault((t, j), []).append(r['i'])
    byi = {r['i']: r for r in rows}
    seen = set()
    for r in rows:
        if r['i'] in seen:
            continue
        cnt = collections.Counter()
        for t, j in r['ocr_pos'].items():
            if t != 'hocr':
                for o in owner[(t, j)]:
                    if o != r['i']:
                        cnt[o] += 1
        group = [r['i']] + [o for o, c in cnt.items()
                            if c >= max(2, 0.5 * min(len(r['ocr_pos']), len(byi[o]['ocr_pos'])))]
        if len(group) == 1:
            continue
        best = max(group, key=lambda i: fuzz.ratio(key(byi[i]['skel']), key(byi[i]['gp'])))
        for i in group:
            seen.add(i)
            if i != best:
                byi[i]['dup_of'] = best
    return rows

# ------------------------------------------------------------------ lines the skeleton lacks
HINDI = set('है हैं में के की ने से और था थे थी हुए हुआ हुई गया गये गयी लिये लिए करके उनके उसके '
            'उन्होंने अपने अपनी अपना यह वह इस उस जो कि तो भी पर हो रहे रही रहा उन्हें उसे'.split())

HINDI_MARK = re.compile(r'ों|ें|ैं|ँ|ड़|ढ़|ऑ|[?\[\]()“”"‘’]|--|—|[०-९]\s*-\s*[०-९]')
def sanskritish(c):
    if 'इत्यार्षे' in c or 'सर्गः' in c or 'सर्ग:' in c or 'काण्डे' in c:
        return False
    if HINDI_MARK.search(c):
        return False
    body, end, num = split_tail(c)
    if end is None:
        return False
    w = re.findall(r'[ऀ-ॿ]+', body)
    if not (3 <= len(w) <= 14) or any(x in HINDI for x in w):
        return False
    return 15 <= len(body) <= 110

def gp_only(per, sk, skk, nb=None):
    """Sanskrit-looking OCR lines that sit between two consecutive skeleton matches in several
    scans but match no skeleton line: half-lines the Gītā Press prints and the skeleton lacks."""
    found = collections.defaultdict(list)       # gap index -> [(tag, text)]
    for tag, (st, res, _) in per.items():
        if tag == 'hocr':
            continue
        used = set()
        for r in res:
            if r:
                used.update(range(r[0], r[0] + max(1, r[1])) if r[1] > 0 else (r[0] - 1, r[0]))
        prev = None
        for i, r in enumerate(res):
            if not r:
                continue
            if prev is not None and 0 < r[0] - res[prev][0] < 40:
                for j in range(res[prev][0] + 1, r[0]):
                    if j not in used and sanskritish(st.cl[j]) and (nb is None or nb.p_sanskrit(st.cl[j]) > 0.9):
                        found[prev].append((tag, st.cl[j], (j - res[prev][0]) / max(1, r[0] - res[prev][0])))
            prev = i
    extra = []
    for gap, items in sorted(found.items()):
        # cluster by key similarity
        clusters = []
        for tag, c, rel in items:
            kk = key(c)
            for cl in clusters:
                if fuzz.ratio(kk, cl['key']) >= 70:
                    cl['items'].append((tag, c)); cl['rel'].append(rel); break
            else:
                clusters.append({'key': kk, 'items': [(tag, c)], 'rel': [rel]})
        for cl in clusters:
            tags = {t for t, _ in cl['items']}
            if len(tags) >= 3:
                bodies = [split_tail(c) for _, c in cl['items']]
                text, status, info = vote([b for b, _, _ in bodies])
                nums = collections.Counter(n for _, _, n in bodies if n is not None)
                ends = collections.Counter(e for _, e, _ in bodies if e)
                rel = sorted(cl['rel'])[len(cl['rel']) // 2]
                extra.append({'after': gap, 'rel': round(rel, 3), 'gp': text, 'status': status, 'support': len(tags),
                              'num': nums.most_common(1)[0][0] if nums else None,
                              'end': ends.most_common(1)[0][0] if ends else None,
                              'info': info, 'reads': {t: c for t, c in cl['items']}})
    return extra

if __name__ == '__main__':
    for k in sys.argv[1:]:
        rows, extra = run(k)
        n = len(rows)
        c = collections.Counter(r['status'] for r in rows)
        print(f'{k}: {n} skeleton half-lines; {dict(c)}; {len(extra)} GP-only half-line candidates')

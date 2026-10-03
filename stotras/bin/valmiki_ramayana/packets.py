"""Per-sarga work packets: what the machine accepts, and what must be read off the page.

    python3 packets.py <kanda>      -> ../cache/gitapress_ramayana/work/<kanda>/<NNN>.json + crops

A half-line is accepted without a reading only when two independent scans reproduce the digital
skeleton's text exactly (status 'confirmed'), or the word-slot vote agrees with the skeleton
throughout ('voted' and equal to the skeleton modulo orthography). In the Uttarakāṇḍa, where the
skeleton is itself a scan, it must be 'confirmed' by three scans and every word must occur
somewhere in the digital Rāmāyaṇa (a lexicon check, which catches an error all scans share).

Everything else is cropped from the primary scan for an agent to read blind (stage A). The
packet also carries, for the adjudicator (stage C), the competing scan readings and the nearest
line of each digital witness: IITK, the Southern text of valmikiramayan.net, and the Baroda
critical edition in IAST.
"""
import os, re, sys, json, collections
from rapidfuzz import fuzz, process
import sources as S, fuse as F, crops as C
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from dev2iast import dev2iast

WORK = os.path.join(S.GPC, 'work')
IAST2 = {'ā': 'a', 'ī': 'i', 'ū': 'u', 'ṛ': 'r', 'ṝ': 'r', 'ḷ': 'l', 'ṅ': 'n', 'ñ': 'n', 'ṇ': 'n',
         'ṭ': 't', 'ḍ': 'd', 'ś': 's', 'ṣ': 's', 'ṃ': 'm', 'ṁ': 'm', 'ḥ': 'h'}
def iast_key(s):
    import unicodedata
    s = unicodedata.normalize('NFC', s.lower())
    s = ''.join(IAST2.get(c, c) for c in s)
    return re.sub(r'[^a-z]', '', s)

class Finder:
    """Nearest witness line for a GP line, walking forward through the witness."""
    def __init__(self, lines, keyf):
        self.lines = lines
        self.keys = [keyf(x[-1]) for x in lines]
        self.keyf = keyf
        self.ptr = 0
    def find(self, text, window=160):
        k = self.keyf(text)
        if not self.keys or len(k) < 6:
            return None
        lo, hi = max(0, self.ptr - 40), min(len(self.keys), self.ptr + window)
        best = max(range(lo, hi), key=lambda j: fuzz.ratio(k, self.keys[j]), default=None)
        sc = fuzz.ratio(k, self.keys[best]) if best is not None else 0
        if sc < 70:
            r = process.extractOne(k, self.keys, scorer=fuzz.ratio, score_cutoff=78)
            if r:
                best, sc = r[2], r[1]
            elif sc < 55:
                return None
        self.ptr = best
        return {'ref': self.lines[best][:-1], 'text': self.lines[best][-1], 'score': round(sc)}

_LEX = None
def lexicon():
    global _LEX
    if _LEX is None:
        parts = []
        for k in S.KANDAS:
            for s, v, H in S.iitk(k):
                parts += [F.key(h) for h in H]
        _LEX = '|'.join(parts)
    return _LEX

def lex_misses(text):
    L = lexicon()
    return [w for w in text.split() if len(F.key(w)) >= 4 and F.key(w) not in L]

def accept(line, k):
    st = line['status']
    if line['kind'] != 'row':
        return False
    if k == 'uttara':
        return st == 'confirmed' and not lex_misses(line['gp'])
    if st == 'confirmed':
        return True
    return st == 'voted' and line['skel'] and F.k2(line['gp']) == F.k2(line['skel'])

def locate(hl, by_leaf, text, near_leaves):
    """Find a line on the primary scan by text, on the given leaves."""
    k = F.key(text)
    best = None
    for leaf in near_leaves:
        for j in by_leaf.get(leaf, []):
            sc = fuzz.ratio(k, F.key(hl[j][0]))
            if best is None or sc > best[0]:
                best = (sc, j)
    if best and best[0] >= 60:
        j = best[1]
        return {'leaf': hl[j][1], 'bbox': list(hl[j][2]), 'hocr': j}
    return None

COLO = re.compile(r'इत्यार्षे|रामायणे वाल्मीकीये|आदिकाव्ये')

def build(k):
    vol = S.VOL[k]
    d = json.load(open(os.path.join(S.GPC, 'fused', f'{k}_sargas.json'), encoding='utf-8'))
    fz = json.load(open(os.path.join(S.GPC, 'fused', f'{k}.json'), encoding='utf-8'))
    hpos = {r['i']: r['ocr_pos'].get('hocr') for r in fz['rows']}
    hl = S.hocr(vol)
    by_leaf = collections.defaultdict(list)
    for j, (t, leaf, bb) in enumerate(hl):
        by_leaf[leaf].append(j)
    iitk = Finder([(s, v, h, t) for s, v, H in S.iitk(k) for h, t in enumerate(H)], F.key)
    south = Finder([(s, v, h, t) for s, v, H in S.southern(k) for h, t in enumerate(H)], F.key)
    crit = Finder([(s, v, p, t) for s, v, p, t in S.critical(k)], iast_key)
    out_dir = os.path.join(WORK, k)
    os.makedirs(out_dir, exist_ok=True)
    width = 3 if len(d['sargas']) >= 100 else 2
    summary = collections.Counter()
    # positions of colophons on the primary scan
    hcol = [j for j, (t, _, _) in enumerate(hl) if COLO.search(t)]
    all_pk = []
    for s in d['sargas']:
        sid = f"{s['n']:0{width}d}"
        lines_out, last_leaf = [], None
        verses = []
        for vi, v in enumerate(s['verses']):
            vl = []
            for li, ln in enumerate(v['lines']):
                lid = f'{k}.{sid}.{vi + 1:03d}.{li + 1}'
                loc = ln.get('loc')
                if loc:
                    loc = dict(loc)
                    # the row's hocr index
                    loc['hocr'] = None
                if ln['kind'] == 'row':
                    i = ln['pos'][0]
                    if hpos.get(i) is not None:
                        j = hpos[i]
                        loc = {'leaf': hl[j][1], 'bbox': list(hl[j][2]), 'hocr': j}
                if not loc and last_leaf is not None:
                    loc = locate(hl, by_leaf, ln['gp'], [last_leaf, last_leaf + 1, last_leaf - 1])
                if loc:
                    last_leaf = loc['leaf']
                ok = accept(ln, k)
                cands = collections.Counter()
                for t, r in ln['reads'].items():
                    body, _, _ = F.split_tail(F.clean(r))
                    cands[body] += 1
                item = {'id': lid, 'gp': ln['gp'], 'status': ln['status'], 'kind': ln['kind'],
                        'accept': ok, 'num': ln['num'], 'num_votes': ln['num_votes'],
                        'end': ln['end'], 'loc': loc,
                        'cands': dict(cands.most_common(6)),
                        'iitk': ln['skel'] if k != 'uttara' else None}
                w_i = iitk.find(ln['gp']) if k == 'uttara' else None
                if w_i:
                    item['iitk_crit'] = w_i            # the Uttara IITK text is the critical one
                w_s = south.find(ln['gp'])
                if w_s:
                    item['southern'] = w_s
                w_c = crit.find(dev2iast(ln['gp']))
                if w_c:
                    item['critical'] = w_c
                if k == 'uttara':
                    item['lex_miss'] = lex_misses(ln['gp'])
                vl.append(item)
            verses.append({'num': v['num'], 'lines': vl})
        # numbering anomalies: read the closing line of every verse the run does not explain
        exp, bad_verses = 1, set()
        for vi, v in enumerate(verses):
            if v['num'] != exp:
                bad_verses.update({vi, vi - 1, vi + 1})
                exp = v['num'] if isinstance(v['num'], int) else exp
            exp += 1
        if s['last'] != s['ebook_last']:
            bad_verses.update(range(max(0, len(verses) - 3), len(verses)))
        for vi in sorted(bad_verses):
            if 0 <= vi < len(verses):
                verses[vi]['lines'][-1]['read_num'] = True
        # crops
        for v in verses:
            for it in v['lines']:
                need = (not it['accept']) or it.get('read_num')
                it['read'] = bool(need)
                if need and it['loc']:
                    try:
                        it['crop'] = C.line(vol, it['loc']['leaf'], it['loc']['bbox'],
                                            pad_y=22, pad_x=60, name=f"{it['id']}.png")
                    except SystemExit:
                        it['crop'] = None
                summary['read' if need else 'accepted'] += 1
                if need and not it.get('crop'):
                    summary['no_crop'] += 1
        # heading and colophon crops, from the primary scan's own lines
        first = next((it for v in verses for it in v['lines'] if it['loc'] and it['loc'].get('hocr') is not None), None)
        lastl = next((it for v in reversed(verses) for it in reversed(v['lines'])
                      if it['loc'] and it['loc'].get('hocr') is not None), None)
        head = colo = None
        head_text, colo_text, no_loc = [], [], []
        if first:
            j0 = first['loc']['hocr']
            # the heading is the printed '<ordinal> सर्गः' line and the Hindi subtitle under it
            hs = [j for j in range(max(0, j0 - 25), j0) if re.search(r'सर्ग[ः:]', hl[j][0]) and not COLO.search(hl[j][0])]
            if hs:
                js = list(range(hs[-1], j0))
                head_text = [hl[j][0] for j in js]
                pg = hl[js[0]][1]
                bbs = [hl[j][2] for j in js if hl[j][1] == pg]
                head = C.block(vol, pg, bbs, f'{k}.{sid}.heading.png')
        if lastl:
            j1 = lastl['loc']['hocr']
            nc = min([j for j in hcol if j > j1 and j - j1 < 40], default=None)
            if nc is not None:
                pg = hl[nc][1]
                js = [j for j in range(nc, min(len(hl), nc + 2)) if hl[j][1] == pg]
                colo_text = [hl[j][0] for j in js]
                colo = C.block(vol, pg, [hl[j][2] for j in js], f'{k}.{sid}.colophon.png')
        # a line with no location of its own: crop the stretch between its located neighbours
        flat = [it for v in verses for it in v['lines']]
        for x, it in enumerate(flat):
            if it['read'] and not it.get('crop'):
                prev = next((flat[y] for y in range(x - 1, -1, -1) if flat[y]['loc']), None)
                nxt = next((flat[y] for y in range(x + 1, len(flat)) if flat[y]['loc']), None)
                if prev and nxt and prev['loc']['leaf'] == nxt['loc']['leaf']:
                    a, b = prev['loc']['bbox'], nxt['loc']['bbox']
                    it['crop'] = C.block(vol, prev['loc']['leaf'], [a, b], f"{it['id']}.span.png")
                    it['crop_note'] = 'span between the neighbouring lines; the line sought lies inside it'
                elif prev:
                    it['page'] = C.page(vol, prev['loc']['leaf'])
                    it['crop_note'] = 'no crop: whole page of the preceding line'
                no_loc.append(it['id'])
        pk = {'kanda': k, 'sarga': s['n'], 'sid': sid, 'ebook_n': s['ebook_n'],
              'ebook_last': s['ebook_last'], 'ebook_title': s['ebook_title'],
              'machine_last': s['last'], 'anomalies': s['anomalies'],
              'heading_crop': head, 'heading_ocr': head_text, 'colophon_crop': colo,
              'colophon_ocr': colo_text, 'no_location': no_loc, 'verses': verses}
        all_pk.append(pk)
        # the blind reader's packet: images only, never a candidate text for the line being read
        toread, flat = [], [it for v in verses for it in v['lines']]
        for x, it in enumerate(flat):
            if not it['read']:
                continue
            e = {'id': it['id'], 'image': it.get('crop') or it.get('page')}
            if it.get('crop_note'):
                e['note'] = it['crop_note']
                e['line_before'] = flat[x - 1]['gp'] if x > 0 else None
                e['line_after'] = flat[x + 1]['gp'] if x + 1 < len(flat) else None
            toread.append(e)
        # A hidden spot-check: six half-lines the machine accepted without reading are read blind
        # with the rest. merge.py compares them; a mismatch becomes a dispute, and the rate
        # measures how far the shortcut can be trusted.
        import random
        rnd = random.Random(f'{k}.{sid}')
        pool = [it for it in flat if not it['read'] and it['loc']]
        qa = rnd.sample(pool, min(6, len(pool)))
        for it in qa:
            it['qa'] = True
            it['crop'] = C.line(vol, it['loc']['leaf'], it['loc']['bbox'], pad_y=22, pad_x=60, name=f"{it['id']}.png")
            toread.append({'id': it['id'], 'image': it['crop']})
        rnd.shuffle(toread)
        # sheets of eight plain line crops, numbered, so one look reads eight lines
        plain = [e for e in toread if 'note' not in e and e['image']]
        sheets = []
        for a in range(0, len(plain), 8):
            grp = plain[a:a + 8]
            img = C.sheet([e['image'] for e in grp], os.path.join(C.CROPS, f'{k}.{sid}.sheet{a // 8 + 1:02d}.png'))
            sheets.append({'image': img, 'ids': [e['id'] for e in grp]})
        json.dump({'kanda': k, 'sarga': s['n'], 'heading_image': head, 'colophon_image': colo,
                   'sheets': sheets, 'lines': [e for e in toread if e not in plain]},
                  open(os.path.join(out_dir, f'{sid}.toread.json'), 'w'), ensure_ascii=False, indent=1)
    # Each sarga sees the edges of its neighbours: the machine's cut can put a sarga's first or
    # last lines on the wrong side, and only the page (heading, colophon) settles it.
    def edge(verses, which):
        vs = verses[-3:] if which == 'tail' else verses[:3]
        out = []
        for v in vs:
            for it in v['lines']:
                crop = it.get('crop')
                if not crop and it['loc']:
                    crop = C.line(vol, it['loc']['leaf'], it['loc']['bbox'], pad_y=22, pad_x=60, name=f"{it['id']}.png")
                out.append({'id': it['id'], 'gp': it['gp'], 'num': it['num'], 'crop': crop})
        return out
    for x, pk in enumerate(all_pk):
        pk['prev_tail'] = edge(all_pk[x - 1]['verses'], 'tail') if x > 0 else []
        pk['next_head'] = edge(all_pk[x + 1]['verses'], 'head') if x + 1 < len(all_pk) else []
        json.dump(pk, open(os.path.join(out_dir, f"{pk['sid']}.json"), 'w'), ensure_ascii=False, indent=1)
    return summary

if __name__ == '__main__':
    for k in sys.argv[1:]:
        print(k, dict(build(k)))

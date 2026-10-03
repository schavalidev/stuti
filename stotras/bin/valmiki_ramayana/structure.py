"""Gītā Press sargas and verse units, from the fused half-lines.

    python3 structure.py <kanda>   -> ../cache/gitapress_ramayana/fused/<kanda>_sargas.json

Inputs: fuse.py's output for the kāṇḍa, and sources.ebook(), which states the edition's sarga
count and each sarga's verse count without OCR doubt.

  * A skeleton half-line is in the print if enough of the scans that cover its neighbourhood
    carry it. One that none of them carry is the skeleton's own (IITK prints it, GP does not).
  * GP-only half-lines (fuse.gp_only) are inserted where the scans place them.
  * Sarga boundaries are where the scans put a colophon, voted.
  * A verse ends at a half-line the scans number. The numbers are then checked as a run 1..N
    against the ebook's N; a number the run does not explain is a finding, not something to
    paper over.
"""
import os, sys, json, collections, re
import sources as S

F = os.path.join(S.GPC, 'fused')

def present(r):
    if r.get('dup_of') is not None:
        return False
    return r['n_read'] >= max(2, 0.4 * max(r['cover'], 1))

def boundaries(cols, n):
    votes = collections.Counter()
    for tag, L in cols.items():
        for i in L:
            votes[i] += 1
    # merge near neighbours (a colophon read against a line or two either side)
    idx = sorted(votes)
    groups, cur = [], []
    for i in idx:
        if cur and i - cur[-1] > 2:
            groups.append(cur); cur = []
        cur.append(i)
    if cur:
        groups.append(cur)
    out = []
    for g in groups:
        tot = sum(votes[i] for i in g)
        if tot >= 3:
            out.append((max(g, key=lambda i: votes[i]), tot))
    return out

def build(k):
    d = json.load(open(os.path.join(F, f'{k}.json'), encoding='utf-8'))
    eb = S.ebook(k)
    R, E = d['rows'], d['extra']
    items = []
    for r in R:
        if present(r):
            items.append({'kind': 'row', 'pos': (r['i'], 0.0), 'gp': r['gp'], 'status': r['status'],
                          'num': r['num'], 'num_votes': r['num_votes'], 'end': r['end'],
                          'iitk': r['iitk'], 'skel': r['skel'], 'loc': r['loc'],
                          'reads': r['reads'], 'info': r['info'], 'n_read': r['n_read']})
    for e in E:
        items.append({'kind': 'extra', 'pos': (e['after'], e.get('rel', 0.5)), 'gp': e['gp'],
                      'status': 'gp-only', 'num': e['num'], 'num_votes': {}, 'end': e['end'],
                      'iitk': None, 'skel': None, 'loc': None, 'reads': e['reads'],
                      'info': e['info'], 'n_read': e['support'], 'p_sans': e.get('p_sans')})
    items.sort(key=lambda x: x['pos'])
    B = boundaries(d['colophons'], len(R))
    bvote = {b: v for b, v in B}
    # verses over the whole kāṇḍa first
    allv, half = [], []
    for it in items:
        half.append(it)
        if it['num'] is not None or it['end'] == '॥':
            allv.append(half); half = []
    if half:
        allv.append(half)
    def vnum(v):
        return v[-1]['num']
    # Cut the verse sequence into exactly the ebook's sargas. The ebook's verse counts are clean;
    # the cut points are chosen to agree best with the voted numbers and the colophon votes.
    import bisect as _b
    M, L = len(allv), [e['last'] for e in eb]
    K = len(L)
    o = [vnum(v) if isinstance(vnum(v), int) else None for v in allv]
    ints = [0]
    for x in range(M):
        ints.append(ints[-1] + (o[x] is not None))
    bycol = collections.defaultdict(list)
    for x in range(M):
        if o[x] is not None:
            bycol[x - o[x] + 1].append(x)
    def colv(a):
        if a == 0 or a >= M:
            return 0
        lo_i = allv[a - 1][-1]['pos'][0]; hi_i = allv[a][0]['pos'][0]
        return sum(v for bb, v in bvote.items() if lo_i - 2 <= bb <= hi_i + 1)
    COL = [min(colv(a), 6) for a in range(M + 1)]
    ones = [x for x in range(M) if o[x] == 1 and (x + 1 < M and o[x + 1] == 2 or x + 2 < M and o[x + 2] in (2, 3))]
    def cost(a, b, kk):
        lst = bycol.get(a, [])
        match = _b.bisect_left(lst, b) - _b.bisect_left(lst, a)
        c = 2 * abs((b - a) - L[kk]) + (ints[b] - ints[a] - match)
        if a < M and o[a] == 1:
            c -= 6
        # a verse the scans number 1 inside the group is almost always the next sarga's opening
        c += 4 * sum(1 for x in ones if a < x < b)
        return c - COL[a]
    INF = float('inf')
    W = 25
    dp = [dict() for _ in range(K + 1)]
    dp[0][0] = (0, None)
    cum = 0
    for kk in range(K):
        cum_next = cum + L[kk]
        for a, (ca, _) in dp[kk].items():
            for b in range(max(a + 1, a + L[kk] - W), min(M, a + L[kk] + W) + 1):
                if abs(b - cum_next) > 12 * W:
                    continue
                c = ca + cost(a, b, kk)
                if b not in dp[kk + 1] or c < dp[kk + 1][b][0]:
                    dp[kk + 1][b] = (c, a)
        # keep the beam small
        best = sorted(dp[kk + 1].items(), key=lambda x: x[1][0])[:120]
        dp[kk + 1] = dict(best)
        cum = cum_next
    if not dp[K]:
        raise SystemExit(f'{k}: the verse sequence ({M} units) cannot be cut into the ebook\'s {K} sargas')
    end_b = M if M in dp[K] else min(dp[K], key=lambda b: dp[K][b][0] + 2 * abs(M - b))
    starts, b = [], end_b
    for kk in range(K, 0, -1):
        a = dp[kk][b][1]
        starts.append(a); b = a
    starts = sorted(starts) + [end_b]
    tail = allv[end_b:]
    sargas = []
    for a, b in zip(starts, starts[1:]):
        sargas.append([it for v in allv[a:b] for it in v])
    out = []
    for n, items in enumerate(sargas, 1):
        verses, half = [], []
        for it in items:
            half.append(it)
            if it['num'] is not None or it['end'] == '॥':
                verses.append({'num': it['num'], 'lines': half}); half = []
        if half:
            verses.append({'num': None, 'lines': half, 'open': True})
        # check the numbering as a run
        anomalies, exp = [], 1
        for v in verses:
            if v['num'] == exp:
                pass
            elif v['num'] is None:
                anomalies.append({'at': exp, 'kind': 'unnumbered'})
            else:
                alt = [int(x) for x in v['lines'][-1]['num_votes']] if v['lines'][-1]['num_votes'] else []
                # the closing daṇḍa is often read as a trailing ३ (॥ ९३॥ for ॥ ९॥)
                alt += [int(str(x)[:-1]) for x in list(alt) + ([v['num']] if isinstance(v['num'], int) else [])
                        if str(x).endswith('3') and len(str(x)) > 1]
                if exp in alt:
                    v['num'] = exp
                    anomalies.append({'at': exp, 'kind': 'renumbered-from-vote'})
                else:
                    anomalies.append({'at': exp, 'kind': 'jump', 'got': v['num']})
                    exp = v['num'] if isinstance(v['num'], int) else exp
            exp += 1
        ebn = eb[n - 1] if n - 1 < len(eb) else None
        last = max([v['num'] for v in verses if isinstance(v['num'], int)], default=0)
        out.append({'n': n, 'ebook_n': ebn['n'] if ebn else None,
                    'ebook_last': ebn['last'] if ebn else None,
                    'ebook_title': ebn['title'] if ebn else None,
                    'verses': verses, 'last': last, 'anomalies': anomalies,
                    'review': sum(1 for v in verses for l in v['lines']
                                  if l['status'] not in ('confirmed', 'voted'))})
    json.dump({'kanda': k, 'boundaries': B, 'sargas': out},
              open(os.path.join(F, f'{k}_sargas.json'), 'w'), ensure_ascii=False)
    return out, eb, B

if __name__ == '__main__':
    for k in sys.argv[1:]:
        out, eb, B = build(k)
        ok = sum(1 for s in out if s['last'] == s['ebook_last'] and not s['anomalies'])
        print(f'{k}: {len(out)} sargas (ebook {len(eb)}), {len(B)} colophon boundaries; '
              f'{ok} sargas number cleanly 1..N matching the ebook')
        for s in out:
            flag = '' if s['last'] == s['ebook_last'] and not s['anomalies'] else ' <<'
            print(f"  {s['n']:3} ebook {s['ebook_n']!s:4} verses {len(s['verses']):3} last {s['last']:3} "
                  f"ebook_last {s['ebook_last']!s:4} anomalies {len(s['anomalies']):2} review {s['review']:3}{flag}")

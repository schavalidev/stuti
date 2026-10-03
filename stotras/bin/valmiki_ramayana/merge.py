"""Stage B: fold the blind page readings into a sarga's packet, and list what is still disputed.

    python3 merge.py <kanda> <sid>     reads work/<kanda>/<sid>.json and <sid>.read.json,
                                       writes work/<kanda>/<sid>.merged.json, prints a summary

A page reading settles a half-line when it agrees with at least one scan's reading or with the
IITK text, modulo orthography: two independent routes to the same words. The print's own spelling
and spacing are then taken from the agreeing scan where there is one. A reading that agrees with
nothing, or that marks a character unreadable, is a dispute for the adjudicator (stage C).

The verse numbers are taken from the page reading wherever a closing line was read, and from the
scans' vote otherwise. A run that is not 1, 2, 3 ... N, or whose N is not the Gītā Press ebook's,
is a structural dispute.
"""
import os, sys, json, collections
import sources as S, fuse as F

WORK = os.path.join(S.GPC, 'work')

def merge(k, sid):
    base = os.path.join(WORK, k, sid)
    p = json.load(open(base + '.json', encoding='utf-8'))
    rd = json.load(open(base + '.read.json', encoding='utf-8')) if os.path.exists(base + '.read.json') else {'lines': {}}
    R = rd.get('lines', {})
    disputes, tally = [], collections.Counter()
    for vi, v in enumerate(p['verses']):
        for it in v['lines']:
            if not it['read']:
                it['final'], it['basis'] = it['gp'], 'scans+iitk'
                tally['scans+iitk'] += 1
                continue
            r = R.get(it['id'])
            if not r or not r.get('text'):
                if it['accept']:
                    it['final'], it['basis'] = it['gp'], 'scans+iitk'     # read only for its number
                    tally['scans+iitk'] += 1
                    if it.get('read_num'):
                        disputes.append({'id': it['id'], 'kind': 'number-unread'})
                    continue
                disputes.append({'id': it['id'], 'kind': 'unread'}); tally['disputed'] += 1
                continue
            body, end, num = F.split_tail(F.clean(r['text']))
            it['reading'], it['reading_num'], it['reading_end'] = body, num, end
            if it['accept']:
                it['final'], it['basis'] = it['gp'], 'scans+iitk'
                tally['scans+iitk'] += 1
                if F.k2(body) != F.k2(it['gp']):
                    # an accepted line read again for its number, and the reading disagrees:
                    disputes.append({'id': it['id'], 'kind': 'reading-vs-accepted'})
                continue
            if '⟦' in r['text'] or r.get('unclear'):
                disputes.append({'id': it['id'], 'kind': 'unclear'}); tally['disputed'] += 1
                continue
            kb = F.k2(body)
            scans = [c for c in it['cands'] if F.k2(c) == kb]
            skel = bool(it.get('iitk')) and F.k2(it['iitk']) == kb
            if scans:
                it['final'] = max(scans, key=lambda c: it['cands'][c])
                it['basis'] = 'reading+scan'
                tally['reading+scan'] += 1
            elif skel:
                it['final'], it['basis'] = body, 'reading+iitk'
                tally['reading+iitk'] += 1
            else:
                disputes.append({'id': it['id'], 'kind': 'reading-agrees-with-nothing'})
                tally['disputed'] += 1
    # numbering
    nums = []
    for v in p['verses']:
        last = v['lines'][-1]
        n = last.get('reading_num') if last.get('reading_num') is not None else v['num']
        v['final_num'] = n
        nums.append(n)
    run = list(range(1, len(nums) + 1))
    structural = []
    if nums != run:
        bad = [i for i, (a, b) in enumerate(zip(nums, run)) if a != b]
        structural.append({'kind': 'numbering', 'got': nums, 'first_bad_verse_index': bad[0] if bad else None})
    if p.get('ebook_last') and len(nums) != p['ebook_last']:
        structural.append({'kind': 'count', 'units': len(nums), 'ebook_last': p['ebook_last']})
    p['disputes'] = disputes
    p['structural'] = structural
    p['tally'] = dict(tally)
    p['heading_read'] = rd.get('heading')
    p['colophon_read'] = rd.get('colophon')
    json.dump(p, open(base + '.merged.json', 'w'), ensure_ascii=False, indent=1)
    return p

if __name__ == '__main__':
    k, sid = sys.argv[1], sys.argv[2]
    p = merge(k, sid)
    print(json.dumps({'sarga': p['sarga'], 'tally': p['tally'], 'disputes': len(p['disputes']),
                      'structural': p['structural']}, ensure_ascii=False))

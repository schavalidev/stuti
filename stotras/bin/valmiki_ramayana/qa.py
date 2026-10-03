"""Checks across a kāṇḍa's written files, which no single sarga's adjudicator can see.

    python3 qa.py <kanda>

  * a half-line printed in two adjacent sargas (the machine's cut put it on both sides, and each
    adjudicator kept it): reported with both files;
  * verse counts against the Gītā Press ebook;
  * sargas not yet written;
  * spot-check results summed over the kāṇḍa: how often a half-line the machine accepted without a
    page reading disagreed with a blind reading of the page.
"""
import os, re, sys, json, glob
import sources as S, fuse as F
from write_sarga import folder, WORK

def verses_of(path):
    t = open(path, encoding='utf-8').read()
    out = []
    for m in re.finditer(r'^--- verse (\d+) ---\ndeva:\n(.*?)\niast:', t, re.M | re.S):
        out.append((int(m.group(1)), [l.strip(' ।॥') for l in m.group(2).split('\n') if l.strip()]))
    return out

def main(k):
    eb = S.ebook(k)
    files = {}
    for p in glob.glob(os.path.join(folder(k), '*.txt')):
        files[int(os.path.basename(p).split('_')[0])] = p
    probs = []
    for n in range(1, len([e for e in eb if isinstance(e['n'], int)]) + 1):
        if n not in files:
            continue
        v = verses_of(files[n])
        e = next(x for x in eb if x['n'] == n)
        if len(v) != e['last']:
            txt = open(files[n], encoding='utf-8').read()
            probs.append(f"sarga {n}: {len(v)} verses, ebook {e['last']}"
                         + (' (explained in the note)' if 'ebook' in txt.split('Verse count:')[0] else ''))
        if n + 1 in files:
            a = verses_of(files[n])[-6:]
            b = verses_of(files[n + 1])[:6]
            ka = {F.k2(l): (num, l) for num, L in a for l in L}
            for num, L in b:
                for l in L:
                    if F.k2(l) in ka:
                        probs.append(f"sarga {n} v{ka[F.k2(l)][0]} and sarga {n + 1} v{num} both print: {l}")
    qa_c = qa_m = 0
    for m in glob.glob(os.path.join(WORK, k, '*.merged.json')):
        t = json.load(open(m, encoding='utf-8')).get('tally', {})
        qa_c += t.get('qa_checked', 0); qa_m += t.get('qa_mismatch', 0)
    missing = [n for n in range(1, len([e for e in eb if isinstance(e['n'], int)]) + 1) if n not in files]
    print(f"{k}: {len(files)} sargas written, {len(missing)} not yet"
          + (f" ({missing[:20]}{'...' if len(missing) > 20 else ''})" if missing else ''))
    print(f"  spot-checks: {qa_c} machine-accepted half-lines read blind, {qa_m} disagreed")
    for x in probs:
        print('  ' + x)
    return probs

if __name__ == '__main__':
    for k in sys.argv[1:]:
        main(k)

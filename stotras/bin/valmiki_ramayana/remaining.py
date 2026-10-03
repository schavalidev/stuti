"""Which sargas of a kāṇḍa still lack a corpus file, and which of those are already read.

    python3 remaining.py <kanda> [batch_size]   -> JSON batches for the workflow's args
"""
import os, sys, json, glob
import sources as S
from write_sarga import folder, WORK

def remaining(k):
    pk = sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(WORK, k, '*.json'))
                if os.path.basename(p)[:-5].isdigit())
    root = os.path.abspath(os.path.join(folder(k), '..', '..'))
    def done(s):
        mk = os.path.join(WORK, k, s + '.written')
        return os.path.exists(mk) and os.path.exists(os.path.join(root, open(mk).read().strip()))
    # files written before the marker existed (the pilot): their print number is the sid
    legacy = {os.path.basename(p).split('_')[0] for p in glob.glob(os.path.join(folder(k), '*.txt'))}
    todo = [s for s in pk if not done(s) and not (k != 'uttara' and s in legacy)]
    read = [s for s in todo if os.path.exists(os.path.join(WORK, k, s + '.read.json'))]
    return todo, read

if __name__ == '__main__':
    k = sys.argv[1]; n = int(sys.argv[2]) if len(sys.argv) > 2 else 19
    todo, read = remaining(k)
    print(json.dumps({'kanda': k, 'todo': len(todo), 'already_read': read,
                      'batches': [todo[i:i + n] for i in range(0, len(todo), n)]}))

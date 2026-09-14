import re,difflib,sys,json
import parse_sn,parse_vr
from collate2 import clean,key
from adjud import ocrlike
G=json.load(open('gp2_lines.json')); GK=[key(l) for _,l in G]
def sn_halves(n):
    ti,SN,col=parse_sn.parse(f'sn/{n}.html')
    return ti,[(vn,l) for vn,ls in SN for l in ls if key(l)]
def align(start,H,W=45):
    """monotone greedy: returns list of (i_sn, j_gp or None, ratio), and gp cursor"""
    res=[];cur=start
    for i,(vn,l) in enumerate(H):
        k=key(l); best=(0,None)
        for j in range(cur,min(cur+W,len(GK))):
            r=difflib.SequenceMatcher(None,k,GK[j]).ratio()
            if r>best[0]: best=(r,j)
        r,j=best
        if r>=0.55: res.append((i,j,r)); cur=j+1
        else: res.append((i,None,r))
    return res,cur
def wdiff(a,b):
    wa=clean(a).split(); wb=clean(b).split()
    d=[(' '.join(wa[p:q]),' '.join(wb[s:t])) for tg,p,q,s,t in difflib.SequenceMatcher(None,wa,wb).get_opcodes() if tg!='equal']
    return [(p,q) for p,q in d if key(p)!=key(q)]
if __name__=='__main__':
    n=int(sys.argv[1]); start=int(sys.argv[2]) if len(sys.argv)>2 else 0
    ti,H=sn_halves(n); res,cur=align(start,H)
    print(f'## sarga {n} {ti}: sn halves {len(H)}, matched {sum(1 for _,j,_ in res if j is not None)}, gp cursor {cur}')
    prev=start-1
    for i,j,r in res:
        vn,l=H[i]
        if j is not None:
            for x in range(prev+1,j): print(f'    GP-ONLY @{G[x][0]}: {G[x][1]}')
            prev=j
            d=wdiff(l,G[j][1]); subst=[(p,q) for p,q in d if not ocrlike(p,q)]
            if subst or r<0.8: print(f'{vn:3d} r={r:.2f} {subst}\n     SN: {l}\n     GP: {G[j][1]}')
        else: print(f'{vn:3d} UNMATCHED r={r:.2f}  SN: {l}')
    print('gp cursor',cur)

import re,difflib,sys,collections
import parse_sn,parse_vr,gpalign
from collate2 import clean,key
CONF=[('ष','श'),('ट','ठ'),('व','च'),('ब','व'),('ण','न'),('ध','घ'),('य','प'),('भ','म'),('ङ','ड'),('ड','द'),('द','ढ'),('ल','ळ'),('श','ञ'),('ृ','ु'),('ॄ','ृ'),('ी','ो'),('ि','ो'),('ॉ','ो'),('ौ','ो'),('ें','ॆ'),('ै','े'),('ॆ','े'),('ॊ','ो')]
def fold(s):
    s=key(s); s=re.sub('[ा-ौॢॣँंः्‌‍]','',s)  # strip matras/virama/nasals
    for a,b in CONF: s=s.replace(a,b)
    return s
def ocrlike(a,b):
    fa,fb=fold(a),fold(b)
    if fa==fb: return True
    r=difflib.SequenceMatcher(None,fa,fb).ratio()
    return r>=0.85 and abs(len(fa)-len(fb))<=1
def run(n):
    ti,SN,res=gpalign.align(n)
    VR,_=parse_vr.parse(f'vr/{n}.htm')
    vrh=[(vn,l,key(l)) for vn,ls in VR for l in ls if key(l)]
    vidx=collections.defaultdict(list)
    for i,(_,_,k) in enumerate(vrh):
        for p in range(len(k)-2): vidx[k[p:p+3]].append(i)
    def vfind(k):
        c=collections.Counter()
        for p in range(len(k)-2):
            for i in vidx.get(k[p:p+3],()): c[i]+=1
        best=(0,None)
        for i,_ in c.most_common(5):
            r=difflib.SequenceMatcher(None,k,vrh[i][2]).ratio()
            if r>best[0]: best=(r,i)
        return best
    out=[];gnums=[]
    for vn,l,r,g,gn,li in res:
        if r>=0.9 and gn: gnums.append((vn,gn))
        wa=clean(l).split(); wb=clean(g).split()
        d=[(' '.join(wa[p:q]),' '.join(wb[s:t])) for tg,p,q,s,t in difflib.SequenceMatcher(None,wa,wb).get_opcodes() if tg!='equal']
        d=[(p,q) for p,q in d if key(p)!=key(q)]
        subst=[(p,q) for p,q in d if not ocrlike(p,q)]
        if subst or r<0.8:
            vr_r,vi=vfind(key(l)); vl=vrh[vi][1] if vi is not None else ''
            out.append((vn,r,subst,l,g,vl,vr_r))
    return ti,SN,out,gnums
if __name__=='__main__':
    for n in map(int,sys.argv[1:]):
        ti,SN,out,gnums=run(n)
        offs=[(a,b) for a,b in gnums if a!=b]
        print(f'## sarga {n} {ti}: sn {len(SN)}  GP-numbered matches {len(gnums)} max GP {max(b for a,b in gnums) if gnums else None} offsets {offs[:6]}')
        for vn,r,subst,l,g,vl,vr_r in out:
            print(f'{vn:3d} r={r:.2f} {subst}\n     SN: {l}\n     GP: {g}\n     VR({vr_r:.2f}): {vl}')

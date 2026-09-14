import re,difflib,json,sys
import verses,parse_vr,monoalign
from collate2 import clean,key
G=monoalign.G
def analyse(n,gp_start):
    ti,V,c=verses.verses(n)
    VR,_=parse_vr.parse(f'vr/{n}.htm')
    vh=[key(l) for _,ls in VR for l in ls if key(l)]
    out=[]
    for vn,ls in V:
        for li,l in enumerate(ls):
            bs=re.findall(r'\[([^\]*][^\]]*)\]',l)
            if not bs: continue
            base=re.sub(r'\s*\[[^\]]*\]\s*',' ',re.sub(r'॥\s*।?\s*[०-९]+\s*(?:\[[^\]]*\]\s*)?॥','',l))
            base=re.sub(r'\s+',' ',base).strip()
            words=clean(base).split()
            for b in bs:
                bw=b.split()
                cands=[]
                for i in range(len(words)):
                    for span in (1,2,3):
                        if i+span>len(words): continue
                        alt=words[:i]+bw+words[i+span:]
                        cands.append((i,span,' '.join(alt)))
                def bestmatch(pool,q):
                    return max((difflib.SequenceMatcher(None,key(q),p).ratio() for p in pool),default=0)
                gpool=[GK for _,GK in [(0,x) for x in [key(g[1]) for g in G[max(0,gp_start-5):gp_start+900]]]]
                orig=' '.join(words)
                o_g=bestmatch(gpool,orig); o_v=bestmatch(vh,orig)
                best=None
                for i,span,alt in cands:
                    s=max(bestmatch(gpool,alt),bestmatch(vh,alt))
                    if best is None or s>best[0]: best=(s,i,span,alt)
                if best is None: continue
                s,i,span,alt=best
                out.append((vn,li,b,' '.join(words[i:i+span]),round(s,3),round(max(o_g,o_v),3),base))
    return out
if __name__=='__main__':
    import corpusspans

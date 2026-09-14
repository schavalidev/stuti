import re,json,difflib,sys
import parse_sn,parse_vr,monoalign
from collate2 import clean,key
from adjud import ocrlike
G=monoalign.G
def build(n,start):
    ti,SN,col=parse_sn.parse(f'sn/{n}.html')
    VR,_=parse_vr.parse(f'vr/{n}.htm')
    H=[(vi,li,l) for vi,(vn,ls) in enumerate(SN) for li,l in enumerate(ls) if key(l)]
    res,cur=monoalign.align(start,[(a,c) for a,b,c in H])
    # vr half-line list
    VH=[(vn,l) for vn,ls in VR for l in ls if key(l)]
    vk=[key(l) for _,l in VH]
    notes=[];vcur=0
    for (i,j,r) in res:
        vi,li,l=H[i]; k=key(l)
        # vr monotone
        best=(0,None)
        for q in range(max(0,vcur-3),min(vcur+25,len(vk))):
            rr=difflib.SequenceMatcher(None,k,vk[q]).ratio()
            if rr>best[0]: best=(rr,q)
        vr_r,q=best
        if q is not None and vr_r>=0.55: vcur=q+1
        gp=G[j][1] if j is not None else ''
        vr=VH[q][1] if (q is not None and vr_r>=0.55) else ''
        def sub(a,b):
            if not b: return []
            wa=clean(a).split(); wb=clean(b).split()
            d=[(' '.join(wa[p:q2]),' '.join(wb[s:t])) for tg,p,q2,s,t in difflib.SequenceMatcher(None,wa,wb).get_opcodes() if tg!='equal']
            return [(p,q2) for p,q2 in d if key(p)!=key(q2) and not ocrlike(p,q2)]
        notes.append({'v':SN[vi][0],'li':li,'sn':l,'gp':gp,'gp_r':round(r,3),'vr':vr,'vr_r':round(vr_r,3),
                      'gp_sub':sub(l,gp),'vr_sub':sub(l,vr)})
    return ti,SN,notes,cur
if __name__=='__main__':
    start=0;out={}
    for n in range(1,69):
        ti,SN,notes,cur=build(n,start)
        out[n]={'title':ti,'verses':[[vn,ls] for vn,ls in SN],'notes':notes,'gp_span':[start,cur]}
        flag=sum(1 for x in notes if x['gp_sub'] or x['vr_sub'])
        print(n,ti,'verses',len(SN),'halves',len(notes),'flagged',flag,'gp',start,'->',cur)
        start=cur
    json.dump(out,open('corpus.json','w'),ensure_ascii=False)

import re,difflib,sys,collections
import parse_sn,parse_vr
ACC='[॒॑᳚᳛॓॔ᳫ᳭]'
NAS={'ङ्क':'ंक','ङ्ख':'ंख','ङ्ग':'ंग','ङ्घ':'ंघ','ञ्च':'ंच','ञ्छ':'ंछ','ञ्ज':'ंज','ञ्झ':'ंझ','ण्ट':'ंट','ण्ठ':'ंठ','ण्ड':'ंड','ण्ढ':'ंढ','न्त':'ंत','न्थ':'ंथ','न्द':'ंद','न्ध':'ंध','न्न':'ंन','म्प':'ंप','म्फ':'ंफ','म्ब':'ंब','म्भ':'ंभ','म्म':'ंम','न्य':'ंय','म्ल':'ंल','म्व':'ंव','न्श':'ंश','न्स':'ंस','म्ह':'ंह'}
def clean(s):
    s=re.sub(ACC,'',s); s=re.sub(r'\[[^\]]*\]','',s); s=re.sub(r'[०-९0-9]','',s)
    s=re.sub(r'[।॥|\(\)\-,.:;\'"‘’“”*†#]',' ',s); s=s.replace('‍','').replace('‌','')
    return re.sub(r'\s+',' ',s).strip()
def key(s):
    s=clean(s).replace(' ','').replace('ऽ','')
    for a,b in NAS.items(): s=s.replace(a,b)
    return s
def halves(V):
    out=[]
    for n,ls in V:
        for l in ls:
            c=clean(l)
            if c: out.append((n,l,c,key(l)))
    return out
def collate(n):
    ti,SN,col=parse_sn.parse(f'sn/{n}.html'); VR,col2=parse_vr.parse(f'vr/{n}.htm')
    A=halves(SN); B=halves(VR)
    sm=difflib.SequenceMatcher(None,[a[3] for a in A],[b[3] for b in B],autojunk=False)
    diffs=[]
    for tag,i1,i2,j1,j2 in sm.get_opcodes():
        if tag=='equal': continue
        a=A[i1:i2]; b=B[j1:j2]
        # pair up by best similarity
        used=set()
        for x in a:
            best=None;br=0
            for k,y in enumerate(b):
                if k in used: continue
                r=difflib.SequenceMatcher(None,x[3],y[3]).ratio()
                if r>br: br=r;best=k
            if best is not None and br>=0.5:
                used.add(best); y=b[best]
                wa=x[2].split(); wb=y[2].split()
                d=[(' '.join(wa[p:q]),' '.join(wb[r:s])) for t,p,q,r,s in difflib.SequenceMatcher(None,wa,wb).get_opcodes() if t!='equal']
                d=[(p,q) for p,q in d if key(p)!=key(q)]
                if d: diffs.append(('DIFF',x[0],y[0],x[1],d))
            else: diffs.append(('SN_ONLY',x[0],None,x[1],[]))
        for k,y in enumerate(b):
            if k not in used: diffs.append(('VR_ONLY',None,y[0],y[1],[]))
    return ti,SN,VR,diffs
if __name__=='__main__':
    for n in map(int,sys.argv[1:]):
        ti,SN,VR,diffs=collate(n)
        print(f'## sarga {n} {ti}: sn {len(SN)} vr {len(VR)} half-line issues {len(diffs)}')
        for kind,ns,nv,txt,d in diffs: print(kind,ns,nv,txt,d if d else '')

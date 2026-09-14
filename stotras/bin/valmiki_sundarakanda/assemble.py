import re,sys,importlib.util,glob
def load(pat):
    T={}
    for f in sorted(glob.glob(pat)):
        s=importlib.util.spec_from_file_location('m',f); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
        for k,v in m.T.items():
            if k in T: raise SystemExit(f'duplicate verse {k} in {f}')
            T[k]=v
    return T
def assemble(skel,pat,header,sections,out):
    T=load(pat)
    blocks=open(skel).read().split('--- verse ')
    body=[];n_units=0;missing=[]
    for b in blocks[1:]:
        head,rest=b.split('\n',1)
        num=head.split(' |')[0]
        key=0 if num=='none' else int(num)
        if key not in T: missing.append(num); continue
        en,tel,hi=T[key]
        sec=sections(key)
        lbl=f'--- verse {num} | section: {sec} ---' if num!='none' else '--- verse none | section: Colophon ---'
        deva=rest.split('deva:\n')[1].split('\niast:')[0]
        iast=rest.split('iast:\n')[1].split('\nen:')[0]
        body.append(f'{lbl}\ndeva:\n{deva}\niast:\n{iast}\nen: {en}\ntel: {tel}\nhi: {hi}\n')
        n_units+=1
    if missing: raise SystemExit('missing translations: '+','.join(missing))
    open(out,'w').write(header+'\n'+'\n'.join(body))
    print(out,'units',n_units)

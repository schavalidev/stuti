import re,html,sys
D='०१२३४५६७८९'
def dnum(s): return int(''.join(str(D.index(c)) for c in s))
def parse(path):
    t=open(path,encoding='utf-8').read()
    m=re.search(r'<div class="entry-content[^>]*>(.*?)(<div class="sd-block|<article class="comment|<footer)',t,re.S)
    body=m.group(1) if m else t
    body=re.sub(r'<br\s*/?>','\n',body); body=re.sub('<[^>]+>','\n',body)
    lines=[html.unescape(l).strip() for l in body.split('\n')]
    lines=[l for l in lines if l and re.search('[ऀ-ॿ]',l)]
    # cut from title line '→' to colophon
    s=next((i for i,l in enumerate(lines) if l.startswith('→')),0)
    e=next((i for i,l in enumerate(lines) if 'मद्रामायणे' in l and 'सर्गः' in l),len(lines)-1)
    lines=lines[s+1:e+1]
    # group into verses: accumulate until a line ends with ॥ n ॥
    verses=[];cur=[];title=None
    for l in lines:
        m=re.search(r'॥\s*([०-९]+)\s*॥',l)
        if l.startswith('॥') and l.endswith('॥') and not m and not cur and title is None and not verses:
            title=l.strip('॥ ').strip(); continue
        cur.append(l)
        if m:
            verses.append((dnum(m.group(1)),cur)); cur=[]
    colophon=cur
    if verses and any('मद्रामायणे' in l for l in verses[-1][1]):
        colophon=verses[-1][1]; verses=verses[:-1]
    return title,verses,colophon
if __name__=='__main__':
    for p in sys.argv[1:]:
        ti,V,col=parse(p); nums=[n for n,_ in V]
        gaps=[n for i,n in enumerate(nums) if n!=i+1]
        print(p,ti,len(V),'last',nums[-1] if nums else None,'gaps',gaps[:5],'|',' '.join(col)[:80])

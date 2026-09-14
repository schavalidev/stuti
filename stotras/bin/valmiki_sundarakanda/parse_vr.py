import re,html,sys
D='०१२३४५६७८९'
def parse(path):
    t=open(path,encoding='utf-8',errors='replace').read()
    body=re.sub(r'<br\s*/?>','\n',t); body=re.sub('<[^>]+>','\n',body); body=html.unescape(body)
    parts=re.split(r'\|{1,2}\s*([०-९]+)\s*-\s*([०-९]+)\s*-\s*([०-९]+)',body)
    verses=[]
    for k in range(0,len(parts)-3,4):
        txt=parts[k]; n=int(''.join(str(D.index(c)) for c in parts[k+3]))
        lines=[l.strip() for l in txt.split('\n') if re.search('[ऀ-ॿ]',l)]
        # keep only trailing Devanagari block (drop English gloss preceding)
        # the gloss lines contain no Devanagari except stray, so lines filter suffices
        verses.append((n,lines))
    tail=parts[-1]; col=[l.strip() for l in tail.split('\n') if re.search('[ऀ-ॿ]',l)]
    return verses,col[:2]
if __name__=='__main__':
    for p in sys.argv[1:]:
        V,col=parse(p); nums=[n for n,_ in V]; gaps=[n for i,n in enumerate(nums) if n!=i+1]
        print(p,len(V),'last',nums[-1] if nums else None,'gaps',gaps[:5],'|',' '.join(col)[:80])

"""Re-segment a stotranidhi sarga into verse units keyed by the printed number."""
import re,sys
import parse_sn
D='०१२३४५६७८९'
def dn(s): return int(''.join(str(D.index(c)) for c in s))
NUM=re.compile(r'॥\s*([०-९]+)\s*(?:\[[^\]]*\]\s*)?॥')
def verses(n):
    ti,V,col=parse_sn.parse(f'sn/{n}.html')
    flat=[l for _,ls in V for l in ls]
    out=[];cur=[]
    for l in flat:
        l=re.sub(r'॥\s*([०-९]+)\s*(?=[^०-९\s॥])', lambda m:'॥ '+m.group(1)+' ॥ ', l)
        l=re.sub(r'॥\s*([०-९]+)\s*$', lambda m:'॥ '+m.group(1)+' ॥', l)
        parts=NUM.split(l)
        # parts: text, num, text, num, ...
        for k in range(0,len(parts),2):
            seg=parts[k].strip()
            if seg: cur.append(seg)
            if k+1<len(parts):
                out.append((dn(parts[k+1]),cur)); cur=[]
    if cur: out.append((None,cur))
    return ti,out,col
if __name__=='__main__':
    tot=0
    for n in range(1,69):
        ti,V,col=verses(n); nums=[x for x,_ in V]
        gaps=[(i+1,x) for i,x in enumerate(nums) if x!=i+1]
        tot+=len(V)
        print(n,ti,len(V),'last',nums[-1],'gaps',gaps[:3])
    print('TOTAL',tot)

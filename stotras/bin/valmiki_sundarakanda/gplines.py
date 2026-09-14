import re,json
from collate2 import clean,key
D='०१२३४५६७८९'
def dn(s): return int(''.join(str(D.index(c)) for c in s))
HW=set('के की को का है हैं थे था थी ने से में पर और हुए हुआ हुई लिये लिए उस इस वे वह यह भी तो जो कर गये गयी गया रहे रही रहा हो ही नहीं उन इन उनके उसके इसके अपने अपनी अपना मैं हम तुम आप कि जब तब यदि किन्तु परंतु परन्तु फिर अब यहाँ वहाँ कहा बोले कहने लगे लगी लगा करके होकर देखकर साथ बाद पास ओर तरह भाँति समान द्वारा हुये किया किये कहते'.split())
def hindi(l):
    w=re.findall(r'[ऀ-ॿ]+',l)
    return (not w) or any(x in HW for x in w) or bool(re.search(r'[ड़ढ़ॉ]|\(|\)',l))
NUM=re.compile(r'॥\s*([०-९]+)\s*॥')
HDR=re.compile(r'(सुन्दरकाण्डे|सर्गः|सर्ग:|सगः|श्रीमद्वाल्मीकीय|रामायण)')
def lines():
    L=open('gp2_djvu.txt',encoding='utf-8').read().split('\n')[1340:22740]
    out=[];skip=None
    for i,l in enumerate(L):
        m=NUM.search(l)
        if skip is not None:
            if m and dn(m.group(1))==skip: skip=None; continue
            if (m and dn(m.group(1))==skip+1 and not hindi(l)) or (not m and not hindi(l) and re.search(r'।\s*$',l)): skip=None
            else: continue
        if not clean(l) or len(key(l))<6: continue
        if HDR.search(l) and not m: continue
        out.append((1340+i,l.strip()))
        if m: skip=dn(m.group(1))
    return out
if __name__=='__main__':
    G=lines(); print(len(G)); json.dump(G,open('gp2_lines.json','w'),ensure_ascii=False)

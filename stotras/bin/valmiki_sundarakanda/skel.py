import sys,re,json
sys.path.insert(0,'/Users/bhavanisrikrishna/Documents/Stuti/stotras/bin')
from dev2iast import dev2iast
import verses
def clean_line(l):
    l=re.sub(r'\[\*\*.*?\*\*\]','',l,flags=re.S)
    l=re.sub(r'॥\s*।?\s*[०-९]+\s*(?:\[[^\]]*\]\s*)?॥','',l)
    l=re.sub(r'\s*\[[^\]]*\]\s*',' ',l)
    l=re.sub(r'।\s*॥\s*$','।',l)
    return re.sub(r'\s+',' ',l).strip()
def skel(n,out):
    ti,V,col=verses.verses(n)
    f=open(out,'w')
    for i,(num,ls) in enumerate(V,1):
        joined=re.sub(r'\[\*+.*?\*+\]','',chr(10).join(ls),flags=re.S)
        lines=[clean_line(l) for l in joined.split(chr(10))]
        lines=[l for l in lines if l and l.strip('।॥ ')]
        # ensure final line ends with ||
        if lines and not lines[-1].endswith('॥'): lines[-1]=lines[-1].rstrip(' ।')+' ॥'
        f.write(f'--- verse {i} | section: \n')
        f.write('deva:\n'+'\n'.join(lines)+'\n')
        f.write('iast:\n'+'\n'.join(dev2iast(l) for l in lines)+'\n')
        f.write('en: \ntel: \nhi: \n\n')
    c=clean_line(col[0]) if col else ''
    f.write('--- verse none | section: Colophon ---\ndeva:\n'+c+'\niast:\n'+dev2iast(c)+'\nen: \ntel: \nhi: \n')
    f.close(); print(out,len(V),ti)
if __name__=='__main__': skel(int(sys.argv[1]),sys.argv[2])

"""Compare run.mjs output with the fetched drikpanchang pages.
Usage: python3 -I tools/panchanga-check/compare.py <workdir>
Reads <workdir>/engine.jsonl and <workdir>/dp/*.html; writes <workdir>/merged.json;
prints every difference over 2 minutes (or any name/month mismatch) and per-field statistics.
Moonrise/moonset: drikpanchang lists the Hindu day's event (which may fall after midnight);
the engine lists the civil day's. The script re-pairs those against the engine's next civil day
when that day is in the run, and says so in the note column."""
import re,html,json,sys,os,datetime,unicodedata
os.chdir(sys.argv[1])
MON={m:i+1 for i,m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
def cells(fn):
    s=open(fn,encoding='utf-8').read()
    out=[]
    for k,v in re.findall(r'class="dpTableCell dpTableKey">(.*?)</div>\s*<div class="dpTableCell dpTableValue">(.*?)</div>',s,re.S):
        k=html.unescape(re.sub('<[^>]+>','',k)).strip(); v=html.unescape(re.sub('<[^>]+>',' ',v)); v=re.sub(r'\s+',' ',v).replace('ⓘ','').strip()
        out.append((k,v))
    city=re.search(r'dpPHeaderLeftContent[^>]*>.*?<[^>]*>([^<]*India|[^<]*United States|[^<]*Australia)',s,re.S)
    m=re.search(r'([A-Za-z ]+, [A-Za-z ]+, (?:India|United States|Australia))',s)
    return out,(m.group(1) if m else '?'),s
def dp_time(v,date):
    """'05:52 PM' or '03:43 AM , Jan 15' -> minutes from date's midnight; None for Full Night etc."""
    m=re.search(r'(\d{1,2}):(\d{2}) (AM|PM)(?: ?, ([A-Z][a-z]{2}) (\d{1,2})(?:, (\d{4}))?)?',v)
    if not m: return None
    h=int(m.group(1))%12+(12 if m.group(3)=='PM' else 0); mins=h*60+int(m.group(2))
    if m.group(4):
        y=int(m.group(6)) if m.group(6) else date.year
        d=datetime.date(y,MON[m.group(4)],int(m.group(5)))
        if m.group(6) is None and d<date-datetime.timedelta(days=180): d=datetime.date(y+1,d.month,d.day)
        mins+=(d-date).days*1440
    return mins
def eng_time(v):
    if v=='—' or v is None: return None
    m=re.match(r'(\d{2}):(\d{2})([+-]1)?',v); mins=int(m.group(1))*60+int(m.group(2))
    if m.group(3): mins+=1440*int(m.group(3))
    return mins
def eng_win(v):
    if v=='—': return None
    a,b=v.split('–'); return eng_time(a),eng_time(b)
def dp_win(v,date):
    if 'None' in v or ' to ' not in v: return None
    a,b=v.split(' to '); return dp_time(a,date),dp_time(b,date)
def norm(n,month=False):
    n=unicodedata.normalize('NFD',n); n=''.join(c for c in n if unicodedata.category(c)!='Mn').lower()
    n=re.sub(r'^(sukla|shukla|krsna|krishna) ','',n)
    if month:
        for a,b in [('pusya','pausha'),('asvayuja','ashwina'),('asvina','ashwina'),('margasirsa','margashirsha')]: n=n.replace(a,b)
    for a,b in [('sh','s'),('ch','c'),('w','v'),('ri','r'),('th','t')]: n=n.replace(a,b)
    return re.sub(r'[^a-z]','',n)
def same(a,b):
    a,b=norm(a),norm(b); return a[:5]==b[:5] or a.startswith(b[:4]) or b.startswith(a[:4])
def fmt(m):
    if m is None: return '—'
    d,m2=divmod(m,1440); return f"{m2//60:02d}:{m2%60:02d}"+(f"{d:+d}" if d else '')

recs=[json.loads(l) for l in open('engine.jsonl')]
rows=[]; diffs=[]; stats={}
def add(rec,field,ev,dv,note=''):
    """ev,dv in minutes (or strings). record difference."""
    if isinstance(ev,int) and isinstance(dv,int):
        d=ev-dv; stats.setdefault(field,[]).append(d)
        if abs(d)>2: diffs.append((rec['date'],rec['place'],field,fmt(ev),fmt(dv),d,note))
    elif ev!=dv:
        stats.setdefault(field,[]).append(None); diffs.append((rec['date'],rec['place'],field,str(ev),str(dv),None,note))
    else: stats.setdefault(field,[]).append(0)
for r in recs:
    fn=f"dp/{r['place'].replace(' ','')}_{r['date']}.html"
    if not os.path.exists(fn): print('missing',fn); continue
    c,city,raw=cells(fn); date=datetime.date(*map(int,r['date'].split('-')))
    kv={}
    for i,(k,v) in enumerate(c):
        if k: kv.setdefault(k,[]).append(v); last=k
        elif v and 'last' in dir(): kv.setdefault(last+'+',[]).append(v)
    g=lambda k: kv.get(k,[''])[0]
    add(r,'sunrise',eng_time(r['sunrise']),dp_time(g('Sunrise'),date))
    add(r,'sunset',eng_time(r['sunset']),dp_time(g('Sunset'),date))
    # moonrise: DP gives the rise of the Hindu day (may be after midnight); engine the civil day's. Compare, else try engine's value ±1 day
    for f,K in (('moonrise','Moonrise'),('moonset','Moonset')):
        dv=dp_time(g(K),date); ev=eng_time(r[f])
        if dv is not None and ev is not None and abs(ev-dv)>60:
            # convention mismatch: compare against engine's record of the next civil day if present
            nxt=[x for x in recs if x['place']==r['place'] and x['date']==str(date+datetime.timedelta(days=1))]
            if nxt and eng_time(nxt[0][f]) is not None: ev2=eng_time(nxt[0][f])+1440; add(r,f,ev2,dv,'DP lists the Hindu-day rise (after midnight); compared with engine next civil day'); continue
            diffs.append((r['date'],r['place'],f,fmt(ev),fmt(dv),None,'DP lists the Hindu-day event after midnight; engine lists the civil day. No engine value for the following day in this run')); continue
        add(r,f,ev,dv)
    # limbs: name + end
    for f,K in (('tithi','Tithi'),('nakshatra','Nakshatra'),('yoga','Yoga'),('karana','Karana')):
        v=g(K); name=v.split(' upto')[0].strip(); dend=dp_time(v,date)
        if not same(r[f],name):
            # engine's limb is the one at sunrise; DP lists the one at sunrise first as well
            diffs.append((r['date'],r['place'],f+' name',r[f],name,None,''))
        else: stats.setdefault(f+' name',[]).append(0)
        eend=eng_time(r[f.replace('nakshatra','nak')+'End'])
        if 'Full Night' in v or dend is None:
            nsr=eng_time(r['sunrise'])+1440
            if eend is not None and eend<nsr-2: diffs.append((r['date'],r['place'],f+' end',fmt(eend),v,None,''))
            else: stats.setdefault(f+' end',[]).append(0)
        else: add(r,f+' end',eend,dend)
    for f,K in (('rahu','Rahu Kalam'),('yama','Yamaganda'),('gulika','Gulikai Kalam'),('abhijit','Abhijit')):
        ew=eng_win(r[f]); dw=dp_win(g(K),date)
        if ew is None or dw is None:
            if ew is None and (dw is None): stats.setdefault(f,[]).append(0)
            else: add(r,f,r[f],g(K) if g(K) else 'missing')
        else:
            add(r,f+' start',ew[0],dw[0]); add(r,f+' end',ew[1],dw[1])
    # months
    am=[v for v in kv.get('Chandramasa',[])+kv.get('Chandramasa+',[])+kv.get('Pravishte/Gate+',[]) if 'Amanta' in v]
    pm=[v for v in kv.get('Chandramasa',[])+kv.get('Chandramasa+',[])+kv.get('Pravishte/Gate+',[]) if 'Purnimanta' in v]
    am=am[0].replace(' - Amanta','').strip() if am else '?'; pm=pm[0].replace(' - Purnimanta','').strip() if pm else '?'
    dp_adhika='Adhika' in am
    add(r,'amanta month',norm(r['masaAmanta'],True)[:5],norm(am.replace('Adhika',''),True)[:5],f"engine {r['masaAmanta']} / DP {am}")
    add(r,'purnimanta month',norm(r['masaPurnimanta'],True)[:5],norm(pm.replace('Adhika',''),True)[:5],f"engine {r['masaPurnimanta']} / DP {pm}")
    add(r,'adhika flag',r['adhika'],dp_adhika)
    ss=g('Sunsign'); sank=re.search(r'upto (.*)',ss)
    rows.append({**r,'dp':{'city':city,'sunrise':g('Sunrise'),'sunset':g('Sunset'),'moonrise':g('Moonrise'),'moonset':g('Moonset'),'tithi':g('Tithi'),'nakshatra':g('Nakshatra'),'yoga':g('Yoga'),'karana':g('Karana'),'rahu':g('Rahu Kalam'),'yama':g('Yamaganda'),'gulika':g('Gulikai Kalam'),'abhijit':g('Abhijit'),'amanta':am,'purnimanta':pm,'sunsign':ss,'shaka':g('Shaka Samvat')}})
json.dump(rows,open('merged.json','w'),ensure_ascii=False,indent=1)
print("DIFFS >2 min or mismatched:",len(diffs))
for d in diffs: print(' | '.join(str(x) for x in d))
print("\nSTATS field: n, agree(<=2min), max|d|, mean d")
for k,v in stats.items():
    nums=[x for x in v if isinstance(x,int)]
    print(f"{k}: n={len(v)} within2={sum(1 for x in nums if abs(x)<=2)} max={max((abs(x) for x in nums),default='-')} mean={sum(nums)/len(nums) if nums else '-':.2f}" if nums else f"{k}: n={len(v)} mismatches={sum(1 for x in v if x is None)}")

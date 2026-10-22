"""Fetch the drikpanchang day page for every (date, place) in a run of run.mjs.
Usage: python3 -I tools/panchanga-check/fetch_dp.py <workdir>
<workdir>/engine.jsonl must exist (run.mjs output); pages land in <workdir>/dp/.
Polite: one page every 1.5 s, ~3 minutes for the standard matrix."""
import json,subprocess,time,os,sys
os.chdir(sys.argv[1])
GEO={"Tirupati":"1254360","Hyderabad":"1269843","New York":"5128581","Sydney":"2147714"}
recs=[json.loads(l) for l in open('engine.jsonl')]
os.makedirs('dp',exist_ok=True)
for r in recs:
    y,m,d=r['date'].split('-'); fn=f"dp/{r['place'].replace(' ','')}_{r['date']}.html"
    if os.path.exists(fn) and os.path.getsize(fn)>50000: continue
    url=f"https://www.drikpanchang.com/panchang/day-panchang.html?geoname-id={GEO[r['place']]}&date={d}/{m}/{y}"
    subprocess.run(["curl","-s","-A","Mozilla/5.0","-o",fn,url]); time.sleep(1.5)
    print(fn,os.path.getsize(fn),flush=True)
print("DONE")

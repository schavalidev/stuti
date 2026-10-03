"""Write one sarga's corpus file from its merged packet and the adjudicator's decisions.

    python3 write_sarga.py <kanda> <sid> [--dry]

Reads work/<kanda>/<sid>.merged.json and <sid>.final.json and writes
stotras/rama/valmiki_<kanda>kanda/<sid>_sarga_<sid>_<slug>.txt (the Uttarakāṇḍa's prakṣipta
sargas go under valmiki_uttarakanda/prakshipta/). Text only, Devanāgarī and IAST: the meanings
come in a later pass, as with the Bhāgavata.

It refuses to write, and says why, when: a half-line has no settled text or still carries ⟦?⟧;
the verse numbers do not run 1, 2, 3 ...; or the count differs from the Gītā Press ebook's and
final.json does not say why (count_explained).

final.json:
  {"lines": {"<id>": {"text": "...", "basis": "page|scan|iitk|..."}},   settled disputes
   "verses": [{"num": 1, "lines": ["<id>", {"new": "text"}, ...]}, ...], optional regrouping
   "drop": ["<id>", ...],                                                lines not in the print
   "title_en": "...", "slug": "...", "hindi_title": "...",
   "colophon": "इत्यार्षे ... सर्गः",
   "count_explained": "...", "notes": ["...", ...]}
"""
import os, re, sys, json, collections
import sources as S, fuse as F
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from dev2iast import dev2iast
from dev2tel import dev2tel
from packets import iast_key

ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))          # stotras/
WORK = os.path.join(S.GPC, 'work')
DATE = '3 Oct 2026'
KNAME = {'bala': 'Bālakāṇḍa', 'ayodhya': 'Ayodhyākāṇḍa', 'aranya': 'Araṇyakāṇḍa',
         'kishkindha': 'Kiṣkindhākāṇḍa', 'yuddha': 'Yuddhakāṇḍa', 'uttara': 'Uttarakāṇḍa'}
VOLNAME = {1: 'Part 1 (Bālakāṇḍa to Kiṣkindhākāṇḍa)', 2: 'Part 2 (Sundarakāṇḍa to Uttarakāṇḍa)'}

def folder(k, prak=False):
    f = os.path.join(ROOT, 'rama', f'valmiki_{k}kanda')
    return os.path.join(f, 'prakshipta') if prak else f

def body(t):
    t = F.clean(t)
    b, _, _ = F.split_tail(t)
    return b.strip(' ।॥')

def lines_of(m, fin):
    byid = {it['id']: it for v in m['verses'] for it in v['lines']}
    drop = set(fin.get('drop', []))
    def text_of(i):
        if i in fin.get('lines', {}):
            return fin['lines'][i]['text']
        return byid[i].get('final')
    if fin.get('verses'):
        out = []
        for v in fin['verses']:
            L = []
            for x in v['lines']:
                if isinstance(x, dict):
                    L.append({'id': None, 'text': x['new'], 'it': None})
                else:
                    L.append({'id': x, 'text': text_of(x), 'it': byid.get(x)})
            out.append({'num': v['num'], 'lines': L})
        return out
    out = []
    for v in m['verses']:
        L = [{'id': it['id'], 'text': text_of(it['id']), 'it': it} for it in v['lines'] if it['id'] not in drop]
        if L:
            out.append({'num': v.get('final_num'), 'lines': L})
    return out

def compare(verses, k):
    """Machine comparison with the three digital witnesses, half-line by half-line."""
    res = collections.defaultdict(list)
    n = collections.Counter()
    for v in verses:
        for l in v['lines']:
            it = l['it'] or {}
            b = body(l['text'])
            n['half'] += 1
            sk = it.get('iitk') if k != 'uttara' else None
            if sk:
                n['iitk'] += 1
                if F.k2(sk) != F.k2(b):
                    res['iitk'].append(v['num'])
            so = it.get('southern')
            if so:
                n['south'] += 1
                if F.key(so['text']) != F.key(b):
                    res['south'].append(v['num'])
            cr = it.get('critical') or it.get('iitk_crit')
            if cr:
                n['crit'] += 1
                if iast_key(dev2iast(b)) != iast_key(cr['text'] if 'critical' in it else dev2iast(cr['text'])):
                    res['crit'].append(v['num'])
    return n, {x: sorted(set(y)) for x, y in res.items()}

def ranges(nums):
    nums = sorted(set(n for n in nums if isinstance(n, int)))
    out, a = [], None
    for i, x in enumerate(nums):
        if a is None:
            a = x
        if i + 1 == len(nums) or nums[i + 1] != x + 1:
            out.append(str(a) if a == x else f'{a}–{x}'); a = None
    return ', '.join(out)

def write(k, sid, dry=False):
    base = os.path.join(WORK, k, sid)
    m = json.load(open(base + '.merged.json', encoding='utf-8'))
    fin = json.load(open(base + '.final.json', encoding='utf-8'))
    vol = S.VOL[k]
    verses = lines_of(m, fin)
    errs = []
    for v in verses:
        for l in v['lines']:
            if not l['text']:
                errs.append(f"{l['id']}: no settled text")
            elif '⟦' in l['text']:
                errs.append(f"{l['id']}: still carries ⟦?⟧")
    nums = [v['num'] for v in verses]
    if nums != list(range(1, len(nums) + 1)):
        errs.append(f'verse numbers do not run 1..N: {nums}')
    eb = m.get('ebook_last')
    if eb and len(verses) != eb and not fin.get('count_explained'):
        errs.append(f'{len(verses)} verses against the ebook\'s {eb}, and count_explained is not given')
    for f in ('title_en', 'slug', 'colophon'):
        if not fin.get(f):
            errs.append(f'final.json lacks {f}')
    if errs:
        print('REFUSED:\n  ' + '\n  '.join(errs))
        return None
    prak = isinstance(m.get('ebook_n'), str) and m['ebook_n'].startswith('P')
    colo = body(fin['colophon'])
    om = re.search(r'काण्डे\s*(.+?)\s*सर्ग[ःः]?', colo)
    ordw = om.group(1).replace('ऽ', '').strip() if om else None
    kdev = S.DEVA_NAME[k]
    devhead = f'श्रीमद्वाल्मीकीयरामायणे {kdev} {ordw} सर्गः' if ordw else f'श्रीमद्वाल्मीकीयरामायणे {kdev}'
    sno = m['sarga'] if not prak else m['ebook_n']
    label = f"Sarga {sno}" if not prak else f"Prakṣipta sarga {m['ebook_n'][1:]} (after sarga 59)"
    title = f"Śrīmad Vālmīki Rāmāyaṇa — {KNAME[k]}, {label}: {fin['title_en']}"
    n, diff = compare(verses, k)
    t = m.get('tally', {})
    settled = sum(1 for x in fin.get('lines', {}).values())
    scan = f"`{S.SCAN_ID[f'gp{vol}']}`"
    if k != 'uttara':
        src = (f"Base text and authority: the Gītā Press, Gorakhpur Śrīmad Vālmīkīya Rāmāyaṇa with Hindi "
               f"translation, {VOLNAME[vol]}. No clean digital copy of this edition's Sanskrit exists, so the text "
               f"was established from the scans of it on archive.org, independent copies scanned by different people; "
               f"the primary scan is item {scan}. Each scan's OCR was aligned half-line by half-line and the print's "
               f"reading voted across the scans. A half-line was taken without further reading only where two scans "
               f"reproduced the IITK digital text exactly. Every other half-line was read off the primary scan's page "
               f"image, and taken where that reading agreed with a scan or with the IITK text; where it agreed with "
               f"neither, it was settled by reading the page again with every witness in view. The sarga division and "
               f"the verse numbering are the print's own, checked against Gītā Press's ebook of the Hindi translation "
               f"(archive.org `wg966`). Witnesses compared by machine: the IITK digital text (GitHub "
               f"Ashutosh-Vijay/Valmiki_Ramayan_Dataset), which follows the Southern vulgate; the Southern-lineage text "
               f"of valmikiramayan.net as served at sanskritdocuments.org; and the Baroda critical edition (GRETIL "
               f"`sa_rAmAyaNa.xml`, read from the TEI XML). The IAST was generated mechanically from the Devanāgarī "
               f"with `bin/dev2iast.py`. Tools: `bin/valmiki_ramayana/`.")
    else:
        src = (f"Base text and authority: the Gītā Press, Gorakhpur Śrīmad Vālmīkīya Rāmāyaṇa with Hindi "
               f"translation, {VOLNAME[vol]}. No clean digital copy of this edition's Sanskrit exists, and the digital "
               f"Uttarakāṇḍa texts (IITK, sa.wikisource) are the critical edition's, a different recension. So the text "
               f"was established from the scans of the Gītā Press edition alone; the primary scan is archive.org item "
               f"{scan}. Each scan's OCR was aligned half-line by half-line. A half-line was taken without further "
               f"reading only where three scans agreed on it exactly and every word of it occurs elsewhere in the digital "
               f"Rāmāyaṇa. Every other half-line was read off the primary scan's page image, and taken where that reading "
               f"agreed with a scan; where it did not, it was settled by reading the page again with every witness in view. "
               f"The sarga division and the verse numbering are the print's own, checked against Gītā Press's ebook of the "
               f"Hindi translation (archive.org `wg966`). Witness compared by machine: the Baroda critical edition (GRETIL "
               f"`sa_rAmAyaNa.xml`, read from the TEI XML). valmikiramayan.net has no Uttarakāṇḍa. The IAST was generated "
               f"mechanically from the Devanāgarī with `bin/dev2iast.py`. Tools: `bin/valmiki_ramayana/`.")
    rec = [f"Text-only file, written {DATE}: the English, Telugu and Hindi meanings are still to be added, and the "
           f"witnesses' differences listed here were found by machine and have not been adjudicated or bracketed into the line."]
    rec.append(f"The print numbers {len(verses)} verses" +
               (f", as the Gītā Press ebook does." if eb == len(verses) else f"; the Gītā Press ebook's numbering ends at {eb}. {fin.get('count_explained','')}"))
    rec.append(f"Of the {n['half']} half-lines, {t.get('scans+iitk', 0)} were confirmed by the scans and the IITK text together, "
               f"{t.get('reading+scan', 0) + t.get('reading+iitk', 0)} were read off the page and confirmed by a scan or by the IITK text, "
               f"and {settled} were settled against the page by reading it again with every witness in view.")
    if k != 'uttara' and n['iitk']:
        rec.append(f"Compared with the IITK text, the print differs in wording, beyond spelling and spacing, at "
                   f"{'verses ' + ranges(diff.get('iitk', [])) if diff.get('iitk') else 'no verse'}.")
    if n['south']:
        rec.append(f"The Southern text of valmikiramayan.net is printed word by word, so it is compared on letters alone; "
                   f"it differs at {'verses ' + ranges(diff.get('south', [])) if diff.get('south') else 'no verse'}.")
    if n['crit']:
        rec.append(f"The critical edition carries {n['crit']} of these half-lines in recognisable form and differs from the "
                   f"print at {'verses ' + ranges(diff.get('crit', [])) if diff.get('crit') else 'none of them'}; "
                   f"its absence elsewhere is not evidence against the print.")
    for x in fin.get('notes', []):
        rec.append(x.strip())
    out = [f'Title: {title}', f'Devanāgarī: {devhead}', f'Telugu: {dev2tel(devhead)}', '',
           'Author: Vālmīki', '', 'Language: Sanskrit',
           'Type: Epic narrative (a sarga of the Rāmāyaṇa)', '',
           f'Source / recension: {src}', '', f'Recension note: {" ".join(rec)}', '',
           f'Verse count: {len(verses)}, plus the closing colophon printed unnumbered.', '']
    for v in verses:
        deva = []
        for i, l in enumerate(v['lines']):
            b = body(l['text'])
            deva.append(b + (' ॥' if i == len(v['lines']) - 1 else ' ।'))
        out += [f"--- verse {v['num']} ---", 'deva:'] + deva + ['iast:'] + [dev2iast(x) for x in deva] + ['']
    out += ['--- verse none ---', 'deva:', colo + ' ॥', 'iast:', dev2iast(colo + ' ॥'), '']
    name = f"{sid}_sarga_{sid}_{fin['slug']}.txt" if not prak else \
        f"{int(m['ebook_n'][1:]):02d}_prakshipta_sarga_{int(m['ebook_n'][1:]):02d}_{fin['slug']}.txt"
    path = os.path.join(folder(k, prak), name)
    if dry:
        print('\n'.join(out[:20])); print('...'); print(path)
        return path
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for old in os.listdir(os.path.dirname(path)):
        if old.startswith(name.split('_sarga_')[0] + '_sarga_') and old != name:
            os.remove(os.path.join(os.path.dirname(path), old))     # this pipeline's own earlier write
    open(path, 'w', encoding='utf-8').write('\n'.join(out).rstrip() + '\n')
    print('WROTE', os.path.relpath(path, ROOT), len(verses), 'verses')
    return path

if __name__ == '__main__':
    write(sys.argv[1], sys.argv[2], dry='--dry' in sys.argv)

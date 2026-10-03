"""Every witness for the Vālmīki Rāmāyaṇa build, loaded into one shape.

Built 3 Oct 2026 (S59) for the remaining six kāṇḍas. See README.md in this folder.

  ebook(k)        Gītā Press's own born-digital ebook (Hindi translation only, archive.org `wg966`).
                  Clean text, so it states the edition's sarga division and verse numbering
                  without OCR doubt. Its conjunct glyphs carry no Unicode, so words are broken,
                  but numbers and sarga headings survive.
  ocr_sets(vol)   the independent OCRs of different scans of the Gītā Press Sanskrit-Hindi
                  volumes (vol 1 = Bāla..Kiṣkindhā, vol 2 = Sundara..Uttara).
  hocr(vol)       the line stream of the primary scan with page (leaf) and bbox, for crops.
  iitk(k)         the IITK-derived digital text (GitHub Ashutosh-Vijay/Valmiki_Ramayan_Dataset).
  southern(k)     valmikiramayan.net as served at sanskritdocuments.org (no Uttarakāṇḍa).
  critical(k)     the Baroda critical edition, GRETIL `sa_rAmAyaNa.xml`, IAST.
"""
import os, re, json, html, glob, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, '..', 'cache')
GPC = os.path.join(CACHE, 'gitapress_ramayana')

KANDAS = ['bala', 'ayodhya', 'aranya', 'kishkindha', 'sundara', 'yuddha', 'uttara']
VOL = {'bala': 1, 'ayodhya': 1, 'aranya': 1, 'kishkindha': 1,
       'sundara': 2, 'yuddha': 2, 'uttara': 2}
KNO = {k: i + 1 for i, k in enumerate(KANDAS)}
DEVA_NAME = {'bala': 'बालकाण्डे', 'ayodhya': 'अयोध्याकाण्डे', 'aranya': 'अरण्यकाण्डे',
             'kishkindha': 'किष्किन्धाकाण्डे', 'sundara': 'सुन्दरकाण्डे',
             'yuddha': 'युद्धकाण्डे', 'uttara': 'उत्तरकाण्डे'}
# colophon tags as the OCR usually manages them (leading अ/आ often lost)
COL_TAG = {'bala': 'बालकाण्डे', 'ayodhya': 'योध्याकाण्डे', 'aranya': 'रण्यकाण्डे',
           'kishkindha': 'किष्किन्धाकाण्डे', 'sundara': 'सुन्दरकाण्डे',
           'yuddha': 'युद्धकाण्डे', 'uttara': 'उत्तरकाण्डे'}

D = '०१२३४५६७८९'
def dn(s):
    s = ''.join(str(D.index(c)) if c in D else c for c in s)
    return int(s) if s.isdigit() else None

# ---------------------------------------------------------------- the ebook
# kāṇḍa names as they survive the ebook's ligature loss
EB_KANDA = {'bala': 'बालका डम', 'ayodhya': 'अयो याका डम', 'aranya': 'अर यका डम',
            'kishkindha': 'कि क धाका डम', 'sundara': 'सु दरका डम',
            'yuddha': 'यु का डम', 'uttara': 'उ रका डम'}

def _ebook_text():
    p = os.path.join(GPC, 'pdf', 'wg966.raw.txt')
    if not os.path.exists(p):
        os.system(f'pdftotext "{os.path.join(GPC, "pdf", "wg966.pdf")}" "{p}"')
    return open(p, encoding='utf-8').read()

def _eb_regions():
    """Line ranges of the seven kāṇḍas: each starts at its 'पहला सग' heading."""
    L = _ebook_text().split('\n')
    starts = [i for i, l in enumerate(L) if l.strip() == 'पहला सग']
    starts = starts[-7:]
    return L, {k: (starts[i], starts[i + 1] if i + 1 < 7 else len(L)) for i, k in enumerate(KANDAS)}

COLO = re.compile(r'सग\s*पू\s*र\s*ा\s*आ\s*॥\s*([०-९]+)\s*॥')
def _label_num(x):
    x = x.replace(' ', '')
    x = re.sub(r'1/2$', '', x) if re.search(r'\d1/2$', x) else x.replace('1/2', '')
    return int(x.split('-')[-1]) if x.split('-')[-1].isdigit() else None

def ebook(k):
    """[{'n': sarga number, or 'P1'/'P2' for the Uttarakāṇḍa's prakṣipta sargas,
         'title': Hindi subtitle (ligature-damaged), 'labels': ['1','2','18 1/2','19-20 1/2',...],
         'last': int}] in print order. Clean text, so its numbering is the edition's own."""
    L, R = _eb_regions()
    lo, hi = R[k]
    cols = []
    for i in range(lo, hi):
        m = COLO.search(L[i])
        if m:
            cols.append((i, dn(m.group(1))))
    out, prev, prak = [], lo - 1, 0
    for ci, num in cols:
        head = None
        for i in range(prev + 1, ci):
            if re.fullmatch(r'\s*\S[^॥]{0,40}\s+सग\s*', L[i]) or re.fullmatch(r'\s*सग\s*[०-९]+\s*', L[i]):
                head = i; break
        body = '\n'.join(L[(head if head is not None else prev) + 1:ci])
        title = L[head + 1].strip() if head is not None else ''
        body = re.sub('[—–]', '-', body)
        labels = re.findall(r'॥\s*([०-९]+(?:\s*-\s*[०-९]+)?(?:\s*[०-९]/[०-९])?)\s*॥', body)
        labels = [''.join(str(D.index(c)) if c in D else c for c in re.sub(r'\s+', ' ', x).strip())
                  for x in labels]
        nums = [n for n in map(_label_num, labels) if n]
        if out and isinstance(out[-1]['n'], int) and num is not None and num <= 2 and out[-1]['n'] > 5:
            prak += 1; n = f'P{num}'
        elif prak and num is not None and num <= 2:
            n = f'P{num}'
        else:
            n = num
        out.append({'n': n, 'colophon_n': num, 'title': title, 'labels': labels, 'last': max(nums, default=0),
                    'line': head if head is not None else prev + 1})
        prev = ci
    # Number the sargas by position, not by the colophon's numeral: the ebook has slips (in the
    # Uttarakāṇḍa sarga 65 ends with a colophon numbered 66 and 66 with one numbered 65, and
    # sarga 101's colophon reads एक सौ एकवाँ but is numbered 102). Its text order is right.
    c = 0
    for x in out:
        if isinstance(x['n'], int) or x['n'] is None:
            c += 1
            x['n'] = c
    return out

# ---------------------------------------------------------------- OCR streams
OCR_SETS = {
    1: ['gp1_djvu.txt',
        'ocr/UeeH_shrimad-valmikiya-ramayan-of-mahars.txt',
        'ocr/Ntwi_shrimad-valmikiya-ramayan-of-valmik.txt',
        'ocr/abcu-shrimad-valmikiya-ramayan-sateek-ra.txt',
        'ocr/hAPr_ramayan-vol-1-by-valmiki-gitapress-.txt',
        'ocr/shrimad-valmikiya-ramayan-part-1-hindi.txt',
        'ocr/valmiki-part-1.txt',
        'ocr/valmiki-ramayan-i-gita-press-gorakhpur.txt',
        'ocr/HindiBookValmikiRamayanPartIByGitaPress.txt',
        'ocr/Lrcu_shrimad-valmiki-ramayan-vol-1-by-va.txt'],
    2: ['gp2_djvu.txt',
        'ocr2/fdag_shrimad-valmiki-ramayan-with-hindi-.txt',
        'ocr2/qLSt_srimad-valmikiya-ramayan-of-valmiki.txt',
        'ocr2/Onkl_ramayan-vol-2-by-valmiki-gitapress-.txt',
        'ocr2/QlwX_shrimad-valmikiya-ramayan-of-valmik.txt',
        'ocr2/shrimad-valmikiya-ramayan-part-2-hindi.txt',
        'ocr2/valmiki-part-2.txt',
        'ocr2/valmiki-ramayan-ii-gita-press-gorakhpur.txt',
        'ocr2/valmiki-ramayan-part-2-gita-press_202307.txt',
        'ocr2/shrimad-valmikiya-ramayan-part-2-gita-pr.txt',
        'ocr2/HindiBookValmikiRamayanPartIIByGitaPress.txt'],
}
SCAN_ID = {
    'gp1': 'fRjq_srimad-valmiki-ramayana-of-maharshi-valmiki-sachitra-hindi-trans.-vol.-1-bala-kh',
    'gp2': 'WTRU_srimad-valmiki-ramayana-of-maharshi-valmiki-with-hindi-trans.-part-2-sundara-khn',
}

def ocr_lines(path):
    t = open(os.path.join(GPC, path), encoding='utf-8', errors='replace').read()
    return [l.strip() for l in t.split('\n') if len(re.findall('[ऀ-ॿ]', l)) >= 6]

def ocr_sets(vol):
    return [(os.path.basename(p).split('_')[0][:6] if not p.startswith('gp') else p[:3], ocr_lines(p))
            for p in OCR_SETS[vol]]

def hocr(vol):
    """[(text, leaf, (x0,y0,x1,y1))] for every OCR line of the primary scan, cached as JSON."""
    tag = f'gp{vol}'
    cj = os.path.join(GPC, 'hocr', f'{tag}_lines.json')
    if os.path.exists(cj):
        return [tuple(x[:2]) + (tuple(x[2]),) for x in json.load(open(cj))]
    t = open(os.path.join(GPC, 'hocr', f'{tag}_hocr.html'), encoding='utf-8').read()
    out = []
    for pm in re.finditer(r'<div class="ocr_page" id="page_(\d+)"(.*?)(?=<div class="ocr_page"|\Z)', t, re.S):
        leaf = int(pm.group(1))
        for lm in re.finditer(r'<span class="ocr_(?:line|header|caption|textfloat)"[^>]*title="bbox (\d+) (\d+) (\d+) (\d+)[^"]*">(.*?)</span>\s*(?=<span class="ocr_(?:line|header|caption|textfloat)"|</p>)', pm.group(2), re.S):
            words = re.findall(r'<span class="ocrx_word"[^>]*>(.*?)</span>', lm.group(5), re.S)
            txt = html.unescape(' '.join(words)).strip()
            if len(re.findall('[ऀ-ॿ]', txt)) >= 6:
                out.append((txt, leaf, tuple(int(lm.group(i)) for i in range(1, 5))))
    json.dump(out, open(cj, 'w'), ensure_ascii=False)
    return out

# ---------------------------------------------------------------- digital witnesses
IITK_NAME = {'bala': 'Bala Kanda', 'ayodhya': 'Ayodhya Kanda', 'aranya': 'Aranya Kanda',
             'kishkindha': 'Kishkindha Kanda', 'sundara': 'Sundara Kanda',
             'yuddha': 'Yuddha Kanda', 'uttara': 'Uttara Kanda'}
_IITK = None
def iitk(k):
    """[(sarga, verse, [half-lines])] in order."""
    global _IITK
    if _IITK is None:
        _IITK = json.load(open(os.path.join(GPC, 'iitk_dataset.json'), encoding='utf-8'))
    rows = [x for x in _IITK if x['kanda'] == IITK_NAME[k]]
    rows.sort(key=lambda x: (int(x['sarga']), int(x['shloka'])))
    out, seen = [], set()
    for x in rows:
        # a merged entry is repeated under every verse number it covers; keep the first
        sig = (x['sarga'], re.sub(r'[\s\d.।]+', '', x['shloka_text']))
        if sig in seen:
            continue
        seen.add(sig)
        s = unicodedata.normalize('NFC', x['shloka_text'])
        s = re.sub(r'।।\s*[\d.]+\s*।।\s*$', '', s).strip()
        s = s.replace(':', 'ः')
        halves = [h.strip() for h in re.split(r'।(?!।)', s) if h.strip()]
        # merged entries carry the old references inline ('1.1.18।'); they are not text
        halves = [re.sub(r'^[\d.\s।]+|[\d.\s।]+$', '', h).strip() for h in halves]
        halves = [h for h in halves if len(re.findall('[क-ह]', h)) >= 4]
        out.append((int(x['sarga']), int(x['shloka']), halves))
    return out

SOUTH_DIR = {'bala': 'baala', 'ayodhya': 'ayodhya', 'aranya': 'aranya',
             'kishkindha': 'kish', 'yuddha': 'yuddha'}
def southern(k):
    """[(sarga, verse, [half-lines])]; the Southern text is printed word-separated."""
    if k not in SOUTH_DIR:
        return []
    out = []
    files = glob.glob(os.path.join(CACHE, 'southern', SOUTH_DIR[k], '*.htm'))
    for f in sorted(files, key=lambda p: int(os.path.basename(p)[:-4])):
        s = int(os.path.basename(f)[:-4])
        t = open(f, encoding='utf-8', errors='replace').read()
        for m in re.finditer(r'<p class="SanSloka">(.*?)</p>', t, re.S):
            body = html.unescape(re.sub(r'<br\s*/?>', '\n', m.group(1)))
            body = re.sub(r'<[^>]+>', '', body)
            nm = re.search(r'([०-९]+)\s*-\s*([०-९]+)\s*-\s*([०-९]+)', body)
            v = dn(nm.group(3)) if nm else None
            body = re.sub(r'\|\|?\s*[०-९]+\s*-\s*[०-९]+\s*-\s*[०-९]+.*', '', body, flags=re.S)
            halves = [h.strip() for h in re.split(r'\||\n', body) if re.search('[ऀ-ॿ]', h)]
            out.append((s, v, halves))
    return out

_CRIT = None
def critical(k):
    """[(sarga, verse, pada-label, iast)] for kāṇḍa k of the critical edition."""
    global _CRIT
    if _CRIT is None:
        t = open(os.path.join(CACHE, 'sa_rAmAyaNa.xml'), encoding='utf-8').read()
        _CRIT = []
        for m in re.finditer(r'<l xml:id="R_(\d)\.(\d+)\.(\d+)([a-z]*)"[^>]*>(.*?)</l>', t, re.S):
            txt = html.unescape(re.sub(r'<[^>]+>', ' ', m.group(5)))
            _CRIT.append((int(m.group(1)), int(m.group(2)), int(m.group(3)), m.group(4),
                          re.sub(r'\s+', ' ', txt).strip()))
    return [(s, v, p, x) for kk, s, v, p, x in _CRIT if kk == KNO[k]]

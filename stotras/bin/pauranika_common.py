import re, sys, pathlib
ROOT = pathlib.Path("/Users/bhavanisrikrishna/Documents/Stuti/stotras")
sys.path.insert(0, str(ROOT / "bin"))
import reader_view as rv
ACC = re.compile('[॒॑᳚᳛॓॔ᳪ᳭]')
ZW = re.compile('[​‌‍⁠﻿­]')
def norm(s): return ZW.sub('', ACC.sub('', s)).replace('-', '').replace(':', 'ः')
# A line is Vedic if it carries svara, or contains one of these (matched on norm()).
MARK = re.compile(
 r'आपो हिष्ठा|आपो हि ष्ठा|आकलशेषु|आ कलशेषु|आपो वा इदग्ं|तत्सवितुर्वरे|भूर्भुवस्सुव|भूर्भुवः सुवः|'
 r'भूर्भुवः स्वः|आपो ज्योती|असुनीते|स्वाहा|विद्महे|अमृतोपस्तरणमसि|अमृतापिधानमसि|सत्यं त्वा ऋतेन|'
 r'ऋतं त्वा सत्येन|सहस्रशीर्षा|प्र णो देवी सरस्वती|देवीं वाचमजनयन्त|नमः सदसे|नमस्सदसे|इदं ब्रह्म पुनीमहे|'
 r'योऽपाम्पुष्पं|योऽपां पुष्पं|तद्विष्णोः|वेदाहमेत|गणानान्त्वा|गणानां त्वा|ओम्भूः|ओग्ं|ॐ भूः|ओं भूः|'
 r'पुरुष एवेद|यज्ञेन यज्ञम|तानि धर्माणि प्रथमा|ते ?ह ?नाकं|साध्यास्सं?न्?ति|शांतिः शांतिः|यस्त्वा देवि|त्वं देवि सरस्व|चन्द्रमा वा अपाम्|त्र्यम्बकं|नमो हिरण्यबाहवे|अमृतमस्तु|प्रचोदयात्|प्राणायामे विनियोगः|ब्रह्मा पुनातु')
FILES = [
 'puja/smarta/01_nitya_puja_vidhanam.txt', 'puja/smarta/02_sankshipta_puja_vidhanam.txt',
 'puja/smarta/03_purvanga_vidhanam.txt', 'puja/smarta/04_ganapati_nitya_puja.txt',
 'puja/smarta/05_shiva_nitya_puja.txt', 'puja/smarta/06_vishnu_nitya_puja.txt',
 'puja/smarta/09_saraswati_nitya_puja.txt', 'puja/smarta/10_subrahmanya_nitya_puja.txt',
 'puja/smarta/11_surya_nitya_puja.txt', 'puja/smarta/12_hanuman_nitya_puja.txt',
 'puja/smarta/13_navagraha_nitya_puja.txt', 'puja/smarta/15_mahaganapati_shodashopachara_puja.txt',
 'puja/smarta/16_anjaneya_shodashopachara_puja.txt', 'puja/smarta/20_saraswati_shodashopachara_puja.txt',
 'puja/smarta/21_subrahmanya_shodashopachara_puja.txt', 'puja/smarta/26_sravana_mangalagauri_vrata_kalpam.txt',
 'puja/vaishnava/01_purvanga_vidhanam.txt']
# Paurāṇika lines a source happens to print with svara marks: kept, accent removed.
ACTION = re.compile(r'उत्तरापोशनं समर्पयामि|हस्तौ प्रक्षा|पादौ प्रक्षा|शुद्धाचमनीयं|मध्ये मध्ये पानीयं')   # exempt from known_vedic only
NOT_VEDIC = re.compile(r'अपवित्रः पवित्रो वा|सर्वावस्थां गतो|लक्ष्मीं क्षीरसमुद्र|दासीभूतसमस्त|श्रीमन्मन्दकटाक्ष|त्रैलोक्य कुटुम्बिनीं|या सा पद्मासनस्था|गम्भीरावर्तनाभिः|गम्भीरा वर्तनाभिः|लक्ष्मीर्दिव्यैर्गजेन्द्रैर्|नित्यं सा पद्महस्ता')
def is_vedic(line):
    n = norm(line)
    if NOT_VEDIC.search(n): return False
    if not ACC.search(line) and re.search(r'नमः\s*[–—-]\s*\S+\s+पूजयामि', n): return False   # aṅga-pūjā name
    return bool(ACC.search(line) or MARK.search(n) or known_vedic(line) or re.search(r'शान्तिः शान्तिः शान्तिः|(सूक्तं|सूक्तानि|विशेष मन्त्रपुष्पं) पश्यतु', n))
def load(f):
    t = (ROOT / f).read_text(encoding='utf-8')
    fields, units, _ = rv.parse(t)
    heads = re.findall(r'^--- (?:unit|verse) (\d+)(?: \| section: (.*?))? ---$', t, re.M)
    for i, u in enumerate(units):
        u['n'] = i + 1
        u['section'] = (heads[i][1] or '').strip() if i < len(heads) else ''
    return t, {k: v for k, v in fields.items() if k in rv.READER_FIELDS}, units
def sents(s, fld):
    s = s.strip()
    if fld == 'hi':
        return [x for x in re.split(r'(?<=[।!?])\s+', s) if x]
    return [x for x in re.split(r'(?<=[.!?])\s+', s) if x]
TIER_C = ['puja/smarta/07_lakshmi_nitya_puja.txt','puja/smarta/08_durga_nitya_puja.txt',
 'puja/smarta/17_shiva_shodashopachara_puja.txt','puja/smarta/18_mahalakshmi_visesha_shodashopachara_puja.txt',
 'puja/smarta/19_durga_shodashopachara_puja.txt','puja/smarta/22_surya_shodashopachara_puja.txt',
 'puja/smarta/24_anaghashtami_vrata_kalpam.txt']

def _key(s):
    s = norm(s)
    s = re.sub(r'[ङञणनम]्(?=[क-ह])', 'ं', s)
    s = re.sub(r'ओं|ॐ|ओम्', '', s)
    return re.sub(r'[\s।॥\-–—\d०-९\.\(\)\[\]\*,:;!?\'"“”|ऽ]', '', s)
_KNOWN = None
def known_vedic(line):
    """An unaccented line that matches a line printed with svara anywhere in the Vedic corpus."""
    global _KNOWN
    if _KNOWN is None:
        ks = set()
        for folder in ('puja', 'veda', 'vidhi'):
            for p in ROOT.joinpath(folder).rglob('*.txt'):
                if 'pauranika' in p.parts or 'vikalpa' in p.parts: continue
                for l in p.read_text(encoding='utf-8', errors='replace').split('\n'):
                    if ACC.search(l) and not NOT_VEDIC.search(norm(l)):
                        k = _key(l)
                        if len(k) >= 16: ks.add(k)
        _KNOWN = sorted(ks, key=len)
    if NOT_VEDIC.search(norm(line)) or ACTION.search(norm(line)): return False
    k = _key(line)
    if len(k) < 16: return False
    return any((v in k) or (k in v and len(k) >= 0.6 * len(v)) for v in _KNOWN)

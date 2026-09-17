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
 r'पुरुष एवेद|यस्त्वा देवि|त्वं देवि सरस्व|चन्द्रमा वा अपाम्|त्र्यम्बकं|नमो हिरण्यबाहवे|अमृतमस्तु|प्रचोदयात्|प्राणायामे विनियोगः|ब्रह्मा पुनातु')
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
def is_vedic(line): return bool(ACC.search(line) or MARK.search(norm(line)))
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

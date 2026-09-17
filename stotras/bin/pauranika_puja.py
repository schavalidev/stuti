#!/usr/bin/env python3
"""Paurāṇika (non-Vedic) booklets of the pūjā vidhānas, for a reciter without upanayana.

Nothing on disk is changed. Every removal is recorded and the build fails if any Vedic line,
accent mark or translation of a Vedic line is left in the reader's text.
"""
import html, json, subprocess
from pauranika_common import *

OUTDIR = pathlib.Path(sys.argv[1]).resolve()
ONLY = sys.argv[2:]  # optional stems
LABEL = re.compile(r'^\S+\s*[—–]$|^\(.*\)$')
VIN = re.compile(r'प्राणायामे विनियोगः|गायत्री छन्दः|गायत्री चन्दः')

TR = {  # a translation sentence that renders a Vedic segment
 'en': re.compile(r'svāhā|bhūrbhuv|know that Person|Let Brahmā purify|sacred power we purify|earth, (mid-air|air|sky)|god Savit|of the god Sav|impel|set our thoughts|sprinkle you|In the evening|'
    r'underlayer|spread beneath|couch of|covering (of|upon)|cover of|Let there be the deathless|nectar of immortality|'
    r'Waters, you are|most kindly essence|come readily to you|flower of the waters|flower of the waters|who knows thus|'
    r'mother of mantras|We call upon you|O lord of the sacred word, h|may we know|we know|three-eyed one, the fragrant|'
    r'this great Person|golden-arm|Person of a thousand|supreme station|goddess Sarasvatī, r|Person indeed is all|'
    r'Whom the Ordainer|Whoever calls upon you, O god|as Pūṣan|that Sarasvatī of ours|\(Ṛgveda|leader of life|Long may we see|'
    r'giver of favour|breaths are truly|calls the breaths|(out|in|up|down|diffused|even|equalising|upward|outward|downward)[- ]?breath|'
    r'—\s*O[ṁm]\.$|^O[ṁm]\.$|moon indeed', re.I),
 'tel': re.compile(r'స్వాహా|భూర్భువ|పురుషుని ఎరుగు|బ్రహ్మను మేము పవిత్రం|సవితృదేవుని|ప్రేరేపించ|ప్రోక్షించుచున్నాను|పరిషించు|సాయంకాల|అమృతమగు|ఉపస్తరణ|అపిధాన|ఆపిధాన|'
    r'జలములారా|సుఖాన్ని కలిగించువారు|శుభకరమైన ఆ రసా|నివాసానికి మీరు|జలాల పుష్ప|చంద్రుడే జలాల|ఇలా ఎవడు తెలుసుకుంటాడో|'
    r'మంత్రమాత|గణపతివైన నిన్ను|గణములకు అధిపతివైన|బ్రహ్మణస్పతీ|కవులలో కవివి|మా మొర విని|ఎరుగుదుము|ఎఱుగుదుము|త్ర్యంబకుని|'
    r'ఆదిత్యవర్ణుడు|హిరణ్యబాహు|వేయి తలల|పరమపదము|వాజినీవతి|పురుషుడే ఇదంతా|ధాత పూర్వమే|\(ఋగ్వేద|ధనము పణముగా|పూషుని వలె|'
    r'భయంకరమును, బంగారు|ప్రాణనాయకా|ఉదయించుచున్న సూర్యుని|అనుమతీ|ప్రాణాలే అమృత|ప్రాణములే|ప్రాణమునకు|అపానమునకు|వ్యానమునకు|'
    r'ఉదానమునకు|సమానమునకు|ప్రాణాయ స్వాహా|—\s*ఓం\.$|^ఓం\.$'),
 'hi': re.compile(r'स्वाहा|भूर्भुवः|भूर्भुवस्सुव|पुरुष को जान|सवितादेव|सवितृ देव|प्रेरित कर|परिषिञ्चित|परिसिञ्चित|सायंकाल|अमृत हो|उपस्तरण|अपिधान|आपिधान|'
    r'आच्छादन हैं|हे जल!|सुख देनेवाले हो|अत्यन्त कल्याणकारी रस|जिसके निवास के लिये|जल के पुष्प|चन्द्रमा ही जल|जो ऐसा जानता|'
    r'मन्त्रमाता|गणपति रूप आपका|गणों के अधिपति|ब्रह्मणस्प|कवियों के कवि|रक्षाओं सहित|हम जानें|हम जानते हैं|त्र्यम्बक की|'
    r'आदित्यवर्ण|हिरण्यबाहु|सहस्र शीर्ष|परम पद|वाजिनीवती|पुरुष ही यह सब|धाता ने|\(ऋग्वेद|जो धन के दा|पूषा की भाँति|घोरा|'
    r'प्राणों के नेता|उदय होते हुए सूर्य|हे अनुमति|प्राण ही अमृत|(प्राण|अपान|व्यान|उदान|समान) को|—\s*(ओम्|ॐ)।$|^(ओम्|ॐ)।$'),
}
ACAMANA = {  # the first three names take नमः
 'en': [('Oṁ, to Keśava, svāhā.', 'Oṁ, salutation to Keśava.'), ('To Nārāyaṇa, svāhā.', 'Salutation to Nārāyaṇa.'),
        ('To Mādhava, svāhā.', 'Salutation to Mādhava.')],
 'tel': [('స్వాహా', 'నమస్కారం')], 'hi': [('स्वाहा', 'नमस्कार')],
 'deva': [('स्वाहा', 'नमः')], 'iast': [('svāhā', 'namaḥ')],
}
PRANAYAMA = {
 'vidhi': "The breath is restrained — drawn in, held, and then let out, while this verse is recited.",
 'deva': "पूरकं कुम्भकं चैव रेचकं तदनन्तरम् ।\nप्राणायाममिदं प्रोक्तं सर्वदेवनमस्कृतम् ॥",
 'iast': "pūrakaṁ kumbhakaṁ caiva recakaṁ tadanantaram |\nprāṇāyāmamidaṁ proktaṁ sarvadevanamaskṛtam ||",
 'en': "Drawing the breath in, holding it, and letting it out after that — this is called prāṇāyāma, "
       "and it is saluted by all the gods.",
 'tel': "శ్వాసను లోనికి తీసుకోవడం, నిలిపి ఉంచడం, ఆ తరువాత విడిచిపెట్టడం — దీనినే ప్రాణాయామం అంటారు. "
        "దీనికి దేవతలందరూ నమస్కరిస్తారు.",
 'hi': "श्वास को भीतर लेना, रोकना, और उसके पश्चात् छोड़ना — इसी को प्राणायाम कहा गया है। "
       "इसे समस्त देवता नमस्कार करते हैं।",
}
APPARATUS = re.compile(
    r'stotranidhi|Gītā Press|vignanam|this page|the page|the source|the print|pages|recorded, not reconciled|'
    r'corrected|see the header|accent|svara|witness|recension|transmitted|as printed|the folder|this folder|'
    r'this corpus|faithfully|this text|`|\.txt|Vedic|Ṛgved|Yajurved|Taittirīya|sūkta|Sūkta|Gāyatrī|Upaniṣad|'
    r'Āraṇyaka|Brāhmaṇa|Mahāmṛtyuñjaya|Śatarudr|published|house|ṛc|ṛk|hymn|chanted|\bunits?\b', re.I)

def clean_prose(t):
    t = re.sub(r',? (complete )?in [a-z-]+ units(?=[,.])', '', t)
    keep = [s for s in re.split(r'(?<=[.!?])\s+', t.replace('**', '')) if s and not APPARATUS.search(s)]
    return ' '.join(keep).strip()

def split_segs(line, delim):
    parts = re.split(delim, line)   # text, delimiter, text, delimiter, ...
    return [(parts[i], parts[i + 1] if i + 1 < len(parts) else '') for i in range(0, len(parts), 2)]

def strip_line(dl, il):
    """Remove Vedic daṇḍa-segments from one deva line and its IAST partner."""
    ds = split_segs(dl, r'(\s*[।॥]+(?:\s*[०-९\d]+\s*[।॥]+)?\s*)')
    is_ = split_segs(il, r'(\s*\|+(?:\s*\d+\s*\|+)?\s*)') if il is not None else None
    vtags = [bool(seg.strip()) and is_vedic(seg) for seg, _ in ds]
    if not any(vtags): return dl, il, 0
    if all(v or not s.strip() for v, (s, _) in zip(vtags, ds)): return None, None, 1
    if is_ is None or len(is_) != len(ds):
        raise SystemExit(f"segment mismatch:\n  {dl}\n  {il}")
    d2 = ''.join(s + dd for v, (s, dd) in zip(vtags, ds) if not v).strip()
    i2 = ''.join(s + dd for v, (s, dd) in zip(vtags, is_) if not v).strip()
    return d2, i2, 1

def build(f):
    raw, fields, units = load(f)
    log, out, pranayama_done = [], [], set()
    for u in units:
        n, u = u['n'], dict(u)
        deva = u.get('deva', '')
        dl = deva.split('\n'); il = u.get('iast', '').split('\n')
        if len(il) != len(dl): il = [None] * len(dl)
        if VIN.search(norm(deva)) or (u['section'].startswith('प्राणायाम') and any(is_vedic(l) for l in dl)):
            if u['section'] in pranayama_done:
                log.append(f"{n}: dropped (Vedic prāṇāyāma, folded into the substitute)"); continue
            pranayama_done.add(u['section'])
            v = dict(u); v.update(PRANAYAMA); out.append(v)
            log.append(f"{n}: replaced — Vedic prāṇāyāma → पूरकं कुम्भकं चैव"); continue
        if 'केशवाय स्वाहा' in norm(deva):
            for fld, reps in ACAMANA.items():
                for a, b in reps:
                    if fld in u: u[fld] = u[fld].replace(a, b)
            log.append(f"{n}: ācamana — स्वाहा → नमः"); out.append(u); continue
        if not any(is_vedic(l) for l in dl):
            out.append(u); continue
        nd, ni, touched = [], [], 0
        for d, i in zip(dl, il):
            d2, i2, t = strip_line(d, i)
            touched += t
            if d2: nd.append(d2); ni.append(i2)
        if not nd or all(LABEL.match(norm(x).strip()) for x in nd):
            log.append(f"{n}: dropped — wholly Vedic ({norm(dl[0])[:40]})"); continue
        u['deva'] = '\n'.join(nd)
        if None not in ni: u['iast'] = '\n'.join(ni)
        for fld in ('en', 'tel', 'hi'):
            if fld in u:
                ss = sents(u[fld], fld)
                kept = [s for s in ss if not TR[fld].search(s)]
                if not kept: raise SystemExit(f"{f} unit {n}: every {fld} sentence dropped")
                u[fld] = ' '.join(kept)
        log.append(f"{n}: Vedic lines removed ({norm(dl[0])[:40]})")
        out.append(u)
    for u in out:
        if u.get('vidhi'): u['vidhi'] = clean_prose(u['vidhi'])
    # ---- verify
    bad = []
    for u in out:
        for fld in ('deva', 'iast'):
            for line in u.get(fld, '').split('\n'):
                if ACC.search(line) or (fld == 'deva' and is_vedic(line)): bad.append((u['n'], fld, line[:60]))
        for fld in ('en', 'tel', 'hi'):
            for s in sents(u.get(fld, ''), fld):
                if TR[fld].search(s): bad.append((u['n'], fld, s[:60]))
    return fields, out, log, bad

def esc(s):
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
    s = re.sub(r'`(.+?)`', r'\1', s)
    return s.replace('\n', '<br>')

NOTE_TE = ("వైదిక మంత్రాలను ఉపనయన సంస్కారం జరిగినవారు మాత్రమే చదవాలి. ఈ పుస్తకంలో వాటి స్థానంలో "
           "పూజా గ్రంథాలు చెప్పిన పౌరాణిక శ్లోకాలు ఇవ్వబడ్డాయి. అందువలన పూజను ఏమీ విడిచిపెట్టకుండా "
           "పూర్తిగా చేసుకోవచ్చు. అలా చేసిన పూజ సంపూర్ణమవుతుంది.")
NOTE_EN = ("The Vedic mantras are recited only by one for whom the upanayana saṁskāra has been performed. "
           "In this booklet they have been left out, and where the pūjā needs a verse in their place, the "
           "Paurāṇika verse is given. The worship so performed is complete.")
NOTE_HI = ("वैदिक मन्त्रों का पाठ केवल वे करें जिनका उपनयन संस्कार हुआ हो। इस पुस्तिका में वे छोड़ दिये गये हैं, "
           "और जहाँ पूजा में उनके स्थान पर श्लोक चाहिये वहाँ पौराणिक श्लोक दिया गया है। इस प्रकार की गयी पूजा "
           "सम्पूर्ण होती है।")
CSS = """
@page { size: A5; margin: 14mm 13mm 16mm 13mm; }
body { font-family:"Times New Roman",serif; font-size:10pt; line-height:1.5; color:#1a1a1a; }
.cover { text-align:center; page-break-after:always; padding-top:8mm; }
.cover .dn { font-family:"Devanagari Sangam MN",serif; font-size:17pt; line-height:1.4; }
.cover .tn { font-family:"Telugu Sangam MN",serif; font-size:15pt; margin-top:6mm; }
.cover .rn { font-size:12pt; margin-top:5mm; }
.cover .sub { font-size:10pt; margin-top:3mm; color:#7a6a55; letter-spacing:.05em; }
.cover hr { width:44%; margin:7mm auto; border:0; border-top:1px solid #b08a3c; }
.note { text-align:left; margin:0 2mm; padding:5mm; border:1px solid #d8c79a; background:#fdfaf1; border-radius:3px; }
.note h3 { margin:0 0 3mm; font-size:10pt; letter-spacing:.06em; text-transform:uppercase; color:#8a6a20; font-weight:normal; }
.note .t { font-family:"Telugu Sangam MN",serif; font-size:9.5pt; margin-bottom:3mm; }
.note .e { font-size:9pt; margin-bottom:3mm; }
.note .h { font-family:"Devanagari Sangam MN",serif; font-size:9.5pt; }
.front { page-break-after:always; }
.fld { margin:0 0 4.5mm; }
.fld .k { display:block; font-size:8pt; letter-spacing:.1em; text-transform:uppercase; color:#8a6a20; margin-bottom:1.2mm; }
.fld .v { display:block; font-size:9.2pt; line-height:1.5; text-align:justify; }
.fld .sec { font-family:"Devanagari Sangam MN",serif; font-size:9.5pt; line-height:1.75; }
h2 { font-family:"Devanagari Sangam MN",serif; font-size:14pt; font-weight:normal; margin:8mm 0 3.5mm;
     padding-bottom:1.6mm; border-bottom:1px solid #d8c79a; color:#7a1f1f; page-break-after:avoid; }
.u { margin:0 0 5mm; orphans:2; widows:2; position:relative; padding-left:7mm; }
.num { position:absolute; left:0; top:.4mm; font-size:7.5pt; color:#a89878; }
.vd { font-size:8.4pt; color:#6b5d45; line-height:1.45; margin-bottom:1.6mm; }
.dv { font-family:"Devanagari Sangam MN",serif; font-size:12pt; line-height:1.62; page-break-inside:avoid; }
.ia { font-size:8.8pt; color:#5a5347; margin-top:.9mm; line-height:1.45; }
.en { font-size:8.8pt; color:#3f3f3f; margin-top:1.4mm; line-height:1.45; }
.te { font-family:"Telugu Sangam MN",serif; font-size:9.8pt; color:#1f3a5f; margin-top:1.4mm; line-height:1.6; }
.hn { font-family:"Devanagari Sangam MN",serif; font-size:9.8pt; color:#3a4a2f; margin-top:1.4mm; line-height:1.6; }
"""

def sections_text(fields, out):
    gloss = {}
    for line in fields.get('Sections', '').split('\n'):
        if '—' in line:
            a, b = line.split('—', 1)
            gloss[a.strip()] = re.sub(r'\s*\(units? [^)]*\)\s*$', '', b).strip()
    for i, u in enumerate(out, 1): u['n'] = i
    order, span = [], {}
    for u in out:
        s_ = u['section']
        if s_ not in span: order.append(s_); span[s_] = [u['n'], u['n']]
        span[s_][1] = u['n']
    rng = lambda a, b: f"unit {a}" if a == b else f"units {a}–{b}"
    return '\n'.join((f"{s_} — {gloss[s_]} ({rng(*span[s_])})" if gloss.get(s_) else f"{s_} ({rng(*span[s_])})") for s_ in order)

READER_NOTE = ("The Vedic mantras are recited only by one for whom the upanayana saṁskāra has been performed. "
               "This form of the rite leaves them out, and where the rite needs a verse in their place, the "
               "Paurāṇika verse is given. The worship so performed is complete. The form with the Vedic mantras "
               "is kept separately, for those who have had the upanayana.")

def write_txt(f, raw, fields, out, log, dest):
    ed = lambda name: (re.search(rf'^{re.escape(name)}: ?(.*?)(?=\n\n|\Z)', raw, re.S | re.M) or [None, None])[1]
    rel = pathlib.Path(f)
    back = '../../' + '/'.join(rel.parts[1:])
    H = []
    H.append(f"Title: {fields['Title']} — Paurāṇika Form, without Vedic Mantras")
    H.append(f"Devanāgarī: {fields.get('Devanāgarī','')} — पौराणिक पद्धतिः")
    H.append(f"Telugu: {fields.get('Telugu','')} — పౌరాణిక పద్ధతి")
    H.append(f"Author: {fields.get('Author','')}")
    H.append("Type: vidhi (ritual manual) — not a stotra. The one-extra-field vidhi format: a `vidhi:` field "
             "carrying the ritual instruction, then deva / iast / en / tel / hi.")
    if ed('Recension / paddhati'):
        rp = re.sub(r'`\.\./(smarta|vaishnava)/', r'`../../\1/', ed('Recension / paddhati'))
        H.append(f"Recension / paddhati: {rp}")
    H.append("Note: **This is the Vedic-removed form, for a reciter for whom the upanayana saṁskāra has not been "
             f"performed. The Vedic form is `{back}`, kept unchanged for the initiated. Neither file supersedes "
             "the other, and neither is ever to be deleted in favour of the other** (user, 2026-09-17). "
             "Generated mechanically from that file on 2026-09-17; not one Sanskrit word was composed. "
             "Every Vedic mantra was removed by daṇḍa-segment, and its translation removed with it. Where a "
             "unit held nothing but a Vedic mantra it was dropped, because a Paurāṇika verse already stands "
             "beside it. The prāṇāhuti at the naivedya was removed without substitute, on the user's decision "
             "(2026-09-17). Changes by source unit: " + "; ".join(log) + ".")
    H.append("Source / recension: the Vedic form named above, for every retained word. Substitutes: the "
             "prāṇāyāma verse `पूरकं कुम्भकं चैव` and the ācamana with `नमः` in place of `स्वाहा` follow "
             "`../../vikalpa/01_veda_mantra_vikalpa.txt`, where the gap in attestation of the prāṇāyāma verse "
             "is stated. Offering with the nāma-mantra alone where the Vedic mantra is removed is the rule of "
             "Gītā Press, Gorakhpur, *Nitya Karma Pūjā Prakāśa* (code 592), section `सर्वसामान्य देवी-देव-"
             "पूजाका विधान`: `केवल नाममन्त्रसे … 'नैवेद्य' आदि चढ़ाना चाहिये`.")
    H.append("Accent: none. Every accented line of the Vedic form was removed.")
    H.append(f"Unit count: {len(out)} units.")
    H.append("Sections:\n" + sections_text(fields, out))
    H.append(f"Blurb: {READER_NOTE} {clean_prose(fields.get('Blurb',''))}")
    body = []
    for u in out:
        b = [f"--- unit {u['n']} | section: {u['section']} ---"]
        for k in ('vidhi', 'deva', 'iast'):
            if u.get(k): b.append(f"{k}:\n{u[k]}")
        for k in ('en', 'tel', 'hi'):
            if u.get(k): b.append(f"{k}: {u[k]}")
        body.append('\n'.join(b))
    text = '\n\n'.join(H) + '\n\n' + '\n\n'.join(body) + '\n'
    if dest.exists() and not dest.read_text(encoding='utf-8').startswith(H[0]):
        raise SystemExit(f"REFUSING to overwrite a file this build did not write: {dest}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text, encoding='utf-8')

def render(f, fields, out, pdf):
    gloss = {}
    for line in fields.get('Sections', '').split('\n'):
        if '—' in line:
            a, b = line.split('—', 1)
            gloss[a.strip()] = re.sub(r'\s*\(units? [^)]*\)\s*$', '', b).strip()
    for i, u in enumerate(out, 1): u['n'] = i
    order, span = [], {}
    for u in out:
        s = u['section']
        if s not in span: order.append(s); span[s] = [u['n'], u['n']]
        span[s][1] = u['n']
    rng = lambda a, b: f"unit {a}" if a == b else f"units {a}–{b}"
    sections = sections_text(fields, out)
    ty = "vidhi — a ritual manual, not a stotra. Each unit gives the instruction, then the Sanskrit, then its transliteration, then English, Telugu and Hindi."
    front = [('Author', fields.get('Author', '')), ('Type', ty), ('Blurb', clean_prose(fields.get('Blurb', ''))),
             ('Unit count', f"{len(out)} units."), ('Sections', sections)]
    h = [f'<title>{esc(fields.get("Title",""))}</title><style>{CSS}</style>',
         '<div class="cover">', f'<div class="dn">{esc(fields.get("Devanāgarī",""))}</div>',
         f'<div class="tn">{esc(fields.get("Telugu",""))}</div>', f'<div class="rn">{esc(fields.get("Title",""))}</div>',
         '<div class="sub">Paurāṇika form · पौराणिक पद्धति · పౌరాణిక పద్ధతి</div><hr>',
         '<div class="note"><h3>సూచన &nbsp;·&nbsp; Note &nbsp;·&nbsp; सूचना</h3>',
         f'<div class="t">{esc(NOTE_TE)}</div><div class="e">{esc(NOTE_EN)}</div><div class="h">{esc(NOTE_HI)}</div></div></div>',
         '<div class="front">']
    for k, v in front:
        if v: h.append(f'<div class="fld"><span class="k">{k}</span><span class="v{" sec" if k=="Sections" else ""}">{esc(v)}</span></div>')
    h.append('</div>')
    last = None
    for u in out:
        if u['section'] != last:
            last = u['section']; h.append(f'<h2>{esc(last)}</h2>')
        h.append(f'<div class="u"><div class="num">{u["n"]}</div>')
        for key, cls in (('vidhi', 'vd'), ('deva', 'dv'), ('iast', 'ia'), ('en', 'en'), ('tel', 'te'), ('hi', 'hn')):
            if u.get(key): h.append(f'<div class="{cls}">{esc(u[key])}</div>')
        h.append('</div>')
    hp = OUTDIR / (pdf.stem + '.html'); hp.write_text(''.join(h), encoding='utf-8')
    subprocess.run(["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "--headless", "--disable-gpu",
                    "--no-pdf-header-footer", f"--print-to-pdf={pdf}", hp.as_uri()], check=True, capture_output=True)
    hp.unlink()

OUTDIR.mkdir(parents=True, exist_ok=True)
report = {}
for f in FILES:
    stem = pathlib.Path(f).stem
    if ONLY and stem not in ONLY: continue
    raw = (ROOT / f).read_text(encoding='utf-8')
    fields, out, log, bad = build(f)
    tag = 'vaishnava_' if 'vaishnava' in f else ''
    report[stem] = {'log': log, 'bad': bad, 'units_in': None, 'units_out': len(out)}
    if bad:
        print(f"FAIL {stem}: {len(bad)} residue"); [print('    ', b) for b in bad[:12]]; continue
    pdf = OUTDIR / f"{tag}{stem}_pauranika.pdf"
    render(f, fields, out, pdf)
    paddhati = 'vaishnava' if 'vaishnava' in f else 'smarta'
    write_txt(f, raw, fields, out, log, ROOT / 'puja' / 'pauranika' / paddhati / pathlib.Path(f).name)
    json.dump(out, open(OUTDIR / f"{tag}{stem}_pauranika.json", 'w'), ensure_ascii=False, indent=1)
    print(f"ok   {stem}: {len(out)} units, {len(log)} changes -> {pdf.name}")
json.dump(report, open(OUTDIR / 'build_report.json', 'w'), ensure_ascii=False, indent=1)

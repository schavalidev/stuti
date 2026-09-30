#!/usr/bin/env python3
"""Write the text-only adhyāya files of the Bhāgavata: Devanāgarī and IAST, no meanings yet.

    build_text.py <chapters.json …> --titles english_titles.json --out stotras/vishnu/bhagavata
                  [--skip 0802,0803,0804] [--only 0101,0102]

The user's instruction of 1 Oct 2026 was to lay down the whole text first and add the meanings in a
later pass. So every unit here carries `deva:` and `iast:` only, and the header says plainly that
the meanings are still to come. The reader already shows a verse without a meaning.

What the builder does on its own, and says so in each file's `Recension note`:
  * takes the print's verse numbers as they are and refuses a gap or an unnumbered unit;
  * keeps the print's spacing as its text layer gives it. Closing the gaps justification leaves
    inside a word (प्रकृ तिपुरुषयो) was tried against GRETIL and abandoned: GRETIL's verse text
    often runs words together, so the test joined real word boundaries (सकृद् यद्) as often as
    it closed real gaps. Those gaps are left for the meanings pass, where each verse is read;
  * copies the edition's own footnoted older readings (प्रा० पा०) into the note, with the verse
    each belongs to — they are not bracketed into the line, since the footnote gives a fragment
    and where it starts in the line is a judgement to be made in the meanings pass;
  * compares every verse with GRETIL and records the result, without adjudicating it.
"""
import json, re, sys, os, argparse, difflib
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.dirname(__file__))
from dev2iast import dev2iast
from dev2tel import dev2tel
from gretil_bhp import verses as gretil_verses

DEV = '०१२३४५६७८९'
ORD = """प्रथम द्वितीय तृतीय चतुर्थ पञ्चम षष्ठ सप्तम अष्टम नवम दशम एकादश द्वादश त्रयोदश चतुर्दश
पञ्चदश षोडश सप्तदश अष्टादश एकोनविंश विंश एकविंश द्वाविंश त्रयोविंश चतुर्विंश पञ्चविंश षड्विंश
सप्तविंश अष्टाविंश एकोनत्रिंश त्रिंश एकत्रिंश द्वात्रिंश त्रयस्त्रिंश चतुस्त्रिंश पञ्चत्रिंश षट्त्रिंश
सप्तत्रिंश अष्टात्रिंश एकोनचत्वारिंश चत्वारिंश एकचत्वारिंश द्विचत्वारिंश त्रिचत्वारिंश चतुश्चत्वारिंश
पञ्चचत्वारिंश षट्चत्वारिंश सप्तचत्वारिंश अष्टचत्वारिंश एकोनपञ्चाश पञ्चाश एकपञ्चाश द्विपञ्चाश
त्रिपञ्चाश चतुःपञ्चाश पञ्चपञ्चाश षट्पञ्चाश सप्तपञ्चाश अष्टपञ्चाश एकोनषष्टितम षष्टितम एकषष्टितम
द्विषष्टितम त्रिषष्टितम चतुःषष्टितम पञ्चषष्टितम षट्षष्टितम सप्तषष्टितम अष्टषष्टितम एकोनसप्ततितम
सप्ततितम एकसप्ततितम द्विसप्ततितम त्रिसप्ततितम चतुःसप्ततितम पञ्चसप्ततितम षट्सप्ततितम सप्तसप्ततितम
अष्टसप्ततितम एकोनाशीतितम अशीतितम एकाशीतितम द्व्यशीतितम त्र्यशीतितम चतुरशीतितम पञ्चाशीतितम
षडशीतितम सप्ताशीतितम अष्टाशीतितम एकोननवतितम नवतितम""".split()
SK = "प्रथम द्वितीय तृतीय चतुर्थ पञ्चम षष्ठ सप्तम अष्टम नवम दशम एकादश द्वादश".split()
SECTION_IAST = {'वेणुगीत': 'Veṇugīta', 'महारास': 'Mahārāsa', 'वेदस्तुति': 'Vedastuti'}


def dnum(s):
    return int(''.join(str(DEV.index(c)) for c in s if c in DEV))


def ordinal(c):
    """The adhyāya's ordinal as its own colophon spells it (विंशो or विंशतितमो, पञ्चाशो or पञ्चाशत्तमो)."""
    o = ORD[c['adhyaya'] - 1]
    col = c['colophon'].replace(' ', '')
    stem = o[1:] if o[0] in 'अएइउ' else o
    if re.search(re.escape(stem) + r'ो(?:ऽ)?ध्याय', col):
        return o
    for alt in (o + 'तितम', o[:-1] + 'त्तम' if o.endswith('श') else None, o + 'त्तम'):
        if alt and re.search(re.escape(alt[1:] if alt[0] in 'अएइउ' else alt) + r'ो(?:ऽ)?ध्याय', col):
            return alt
    sys.exit(f"no ordinal for {c['skandha']}.{c['adhyaya']}: {c['colophon'][-60:]}")


def norm(s):
    s = re.sub(r'⁽.*?⁾', '', s).replace(' ', '').replace('-', '').lower().replace('ṃ', 'ṁ')
    s = re.sub(r'[ṅñṇnm](?=[kgcjṭḍtdpb])', 'ṁ', s)
    return re.sub(r"[^a-zāīūṛṝḷḹṁḥṅñṭḍṇśṣ]", '', s)


def tok_norm(w):
    return norm(dev2iast(w))


def clean(line):
    line = re.sub(r'॥\s*[०-९]+(?:\s*[-—]\s*[०-९]+)?\s*॥?\s*$', '॥', line)
    line = re.sub(r'([^\s॥०-९])[०-९]+(?=\s)', r'\1', line)
    return line.strip()


STOP = {'the', 'a', 'an', 'of', 'and', 'to', 'in', 'by', 'with', 'from', 'on', 'his', 'her', 'their',
        'for', 'at', 'as', 'its', 'is', 'who', 'into'}


def slug(title, n=5):
    import unicodedata
    t = unicodedata.normalize('NFKD', title)
    t = ''.join(ch for ch in t if not unicodedata.combining(ch)).lower()
    t = re.sub(r"['’]s\b", '', t)
    words = [w for w in re.findall(r'[a-z]+', t) if w not in STOP]
    return '_'.join(words[:n])


def strip_numerals(line):
    """Drop a footnote numeral set at the text's own size (युधिष्ठिर३उवाच, नृभिः१॥, a lone २).
    Call after the verse number has been removed; no other numeral belongs in the text."""
    line = re.sub(r'\s*[०-९]+\s*(?=[॥।])', '', line)
    line = re.sub(r'(?<=[\u0900-\u0963])[०-९]+(?=\S)', ' ', line)      # युधिष्ठिर३उवाच
    line = re.sub(r'\s*[०-९]+(?=\s|$)', '', line)
    return re.sub(r'\s+', ' ', line).strip()


def notes_of(ch):
    """{(page, n): text} of the footnoted readings, and the count of other notes."""
    out, other = {}, 0
    for page, t in ch['notes']:
        for m in re.finditer(r'(?:(?<=\s)|(?<=।)|^)([०-९]+)\.\s*(.*?)(?=(?:\s|।)\s*[०-९]+\.\s*|$)', t):
            n, body = dnum(m.group(1)), m.group(2).strip()
            if 'पा' in body[:12]:
                out[(page, n)] = re.sub(r'^प्रा०?\s*पा०?\s*[—-]\s*', '', body).rstrip('।').strip()
            else:
                other += 1
    return out, other


def build(c, G, titles, outdir):
    s, a = c['skandha'], c['adhyaya']
    code = f'{s:02d}{a:02d}'
    notes, other_notes = notes_of(c)
    units, speaker, section = [], None, None
    footnoted, gaps, differs, same, compared, missing, nodanda = [], [], [], 0, 0, [], []
    for u in c['units']:
        if u['kind'] == 'speaker':
            speaker = strip_numerals(u['lines'][0]); continue
        if u['kind'] == 'section':
            section = SECTION_IAST.get(u['lines'][0], dev2iast(u['lines'][0])); continue
        if not u['n']:
            sys.exit(f'{s}.{a}: an unnumbered unit: {u["lines"][:2]}')
        n1 = dnum(re.split(r'[-—]', u['n'])[0])
        n2 = dnum(re.split(r'[-—]', u['n'])[-1])
        g = G.get((s, a, n1))
        lines = []
        for ln in u['lines']:
            for m in re.finditer(r'⁽(\d+)⁾', ln):
                k = int(m.group(1))
                txt = notes.get((u['page'], k)) or notes.get((u['page'] - 1, k))
                if txt:
                    footnoted.append((u['n'], txt))
            ln = re.sub(r'⁽\d+⁾', '', ln)
            ln = clean(ln)
            ln = strip_numerals(ln)
            lines.append(ln.strip())
        # a line with no letter in it is a stray glyph (a lone nukta at 10.1.64), not text
        text = '\n'.join(l for l in lines if re.search(r'[\u0905-\u0939\u0950]', l))
        if u.get('nodanda'):
            text = re.sub(r'[०-९]+\s*$', '', text).rstrip() + '॥'
            nodanda.append(n1)
        if g:
            compared += 1
            if norm(dev2iast(text)) == norm(g):
                same += 1
            else:
                differs.append(n1)
        else:
            missing.append(n1)
        if speaker:
            text = speaker + '\n' + text; speaker = None
        units.append((n1, n2, u['n'], text, section))   # a section title runs on to the next one
    # the print's own numbering, continuous
    exp = 1
    for n1, n2, *_ in units:
        if n1 != exp:
            sys.exit(f'{s}.{a}: numbering jumps from {exp - 1} to {n1}')
        exp = n2 + 1
    last = units[-1][1]
    gmax = max([k[2] for k in G if k[:2] == (s, a)], default=0)

    deva_title = f"श्रीमद्भागवतम् – {SK[s - 1]}स्कन्धः – {ordinal(c)}ोऽध्यायः"
    deva_title = deva_title.replace('ोऽध्यायः', 'ोऽध्यायः')
    tel = re.sub(r'\([^)]*\)', '', dev2tel(deva_title))
    title = f"Śrīmad Bhāgavata {s}.{a} — {titles[f'{s}.{a}']}"
    vol, item = ('Part 1 (Gītā Press code 26)', 'shrimadbhagwat-mahapuran-bhag-1') if s <= 8 else \
                ('Part 2 (Gītā Press code 27)', 'shrimadbhagwat-mahapuran-bhag-2')
    pages = c['first_page'], c['units'][-1]['page'] if c['units'] else c['first_page']
    src = (f"Base text and authority: the Gītā Press, Gorakhpur Śrīmadbhāgavata Mahāpurāṇa with Hindi translation, "
           f"{vol}, archive.org item `{item}`, printed pages {pages[0]}–{pages[1]}; the PDF page numbers are the "
           "printed ones. The PDF carries the typesetter's own text layer in the Chanakya font encoding, and the "
           "text was decoded from it by machine with `bin/bhagavata/chanakya.py`, not read off OCR or typed. The "
           "decoder was checked against GRETIL over all twelve skandhas before any file was written, and the "
           "differences that remain were sampled and found to be readings of the two editions. Second witness: "
           "GRETIL's `sa_bhAgavatapurANa.xml` (IAST, contributed by Ulrich Stiehl), a separate editorial lineage, "
           "compared verse by verse by machine. The TTD edition with the commentaries of Śrīdhara, Vīrarāghava "
           "and Vijayadhvaja (archive.org `Bhagavata_Purana_With_Multiple_Commentaries_TTD_Critical_Edition`) is "
           "the third witness where one is needed; it was not read for this file. The IAST was generated "
           "mechanically from the Devanāgarī with `bin/dev2iast.py`.")
    rn = [f"Text-only file, written 1 Oct 2026 at the user's instruction to lay down the whole Bhāgavata "
          "first: the English, Telugu and Hindi meanings are still to be added, and the witnesses' "
          "differences listed here have been recorded by machine and not yet adjudicated. The print is "
          "followed throughout."]
    if gmax == last:
        rn.append(f"The print numbers {last} verses and GRETIL numbers {gmax}.")
    else:
        rn.append(f"The print numbers {last} verses; GRETIL numbers {gmax}, so from some point the two "
                  "editions number the verses differently. Never match them by number.")
    if compared:
        rn.append(f"Of the {compared} verses GRETIL has under the same number, {same} agree with the print "
                  "letter for letter once spacing and the spelling of nasals are set aside"
                  + (f"; the rest differ: {', '.join(map(str, differs))}." if differs else "."))
    if missing:
        rn.append(f"GRETIL has nothing under the numbers {', '.join(map(str, missing))}.")
    if footnoted:
        rn.append("The edition's footnotes give these older printed readings (प्रा० पा०), which are not "
                  "bracketed into the line: " + '; '.join(f"at {dnum(n) if n else n}, {t}" for n, t in footnoted) + '.')
    rn.append("Spacing is the print's, as its text layer gives it; in a few places justification has "
              "left a space inside a word, and these are still to be closed when the verse is read.")
    if nodanda:
        rn.append("At " + ', '.join(map(str, nodanda)) + " the print sets the verse number straight after "
                  "the text with no daṇḍas; the closing ॥ is supplied.")
    if any(u[4] for u in units):
        rn.append("The section title is the edition's own, printed centred above the verse it opens, and it is carried on every verse after it.")
    rn.append("The speaker lines (श्रीशुक उवाच and the others) are printed in italic above the verse they "
              "introduce, and are given as its first line.")

    o = [f"Title: {title}", f"Devanāgarī: {deva_title}", f"Telugu: {tel}", '',
         "Author: Vedavyāsa, by tradition. The Bhāgavata is spoken by the sage Śuka to King Parīkṣit on the "
         "bank of the Gaṅgā, and retold by Sūta to the sages gathered at Naimiṣāraṇya.", '',
         "Language: Sanskrit", f"Type: Purāṇa (an adhyāya of the Śrīmad Bhāgavata, Skandha {s})", '',
         f"Source / recension: {src}", '', f"Recension note: {' '.join(rn)}", '',
         f"Verse count: {last}, plus the closing colophon printed unnumbered.", '']
    for n1, n2, nraw, text, sec in units:
        label = str(n1) if n1 == n2 else f'{n1}({n1}–{n2})'
        o.append(f'--- verse {n1}' + (f' | section: {sec}' if sec else '') + ' ---')
        o += ['deva:', text, 'iast:', dev2iast(text), '']
    col = re.sub(r'\s+', ' ', c['colophon']).replace('“', '').replace('”', '').replace('*', '')
    m = re.search(r'॥\s*([०-९]+)\s*॥\s*$', col)
    col = strip_numerals(col[:m.start()] if m else col) + (f'॥ {m.group(1)}॥' if m else '')
    o += ['--- verse none ---', 'deva:', col, 'iast:', dev2iast(col), '']
    name = f"{code}_{slug(titles[f'{s}.{a}'])}.txt"
    path = os.path.join(outdir, name)
    open(path, 'w').write('\n'.join(o).rstrip('\n') + '\n')
    return path, last, len(differs), len(gaps), len(footnoted)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('chapters', nargs='+')
    ap.add_argument('--titles', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--skip', default='')
    ap.add_argument('--only', default='')
    a = ap.parse_args()
    G = gretil_verses()
    titles = json.load(open(a.titles))
    skip = set(filter(None, a.skip.split(',')))
    only = set(filter(None, a.only.split(',')))
    total = 0
    for f in a.chapters:
        for c in json.load(open(f)):
            if not c['skandha']:
                continue
            code = f"{c['skandha']:02d}{c['adhyaya']:02d}"
            if code in skip or (only and code not in only):
                continue
            p, n, d, g, fn = build(c, G, titles, a.out)
            total += n
            print(p, n, 'verses', d, 'differ', fn, 'footnotes')
    print('total verses', total)


if __name__ == '__main__':
    main()

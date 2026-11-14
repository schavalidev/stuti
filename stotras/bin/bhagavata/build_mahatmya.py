#!/usr/bin/env python3
"""Write the text-only files of the two Bhāgavata māhātmyas the Gītā Press volumes print.

    build_mahatmya.py --pdf1 code26.pdf --pdf2 code27.pdf --ws <wikisource cache dir>
                      --out stotras/vishnu/bhagavata [--collation <dir>] [--check]

Run it with the interpreter that has PyMuPDF and RapidFuzz (`bin/.venv/bin/python`).

The Padma Purāṇa's māhātmya (6 adhyāyas) stands before the first skandha in code 26, printed
pages 33–80. The Skanda Purāṇa's (4 adhyāyas) stands after the twelfth in code 27, pages 983–1008.
They are written as `0001`–`0006` and `1301`–`1304`, so that the folder sorts as the volumes are
bound: 00 is "before Skandha 1" and 13 is "after Skandha 12". Neither is a skandha.

What this builder does on its own, and says so in each file's `Recension note`:
  * takes the print's verse numbers as they are and refuses a gap;
  * where the print sets a speaker line between the two halves of one verse (five places in the
    Skanda māhātmya's third adhyāya), keeps the three lines in the order printed, as one verse;
  * compares every verse with a second witness **by wording and never by number**. For the Skanda
    māhātmya that is the Skanda Purāṇa itself as sa.wikisource.org carries it. For the Padma
    māhātmya the Purāṇa itself turned out to be a different recension (a Pārvatī–Śiva frame, and
    most verses reworded), so the line-by-line witness is the text sa.wikisource.org carries with
    its Śrīmad Bhāgavata, and the Purāṇa is recorded beside it as a separate recension;
  * writes the comparison to `--collation` as JSON, one file per adhyāya, for whoever reads the
    verses in the meanings pass.

It never overwrites: a file that exists is left alone and reported.
"""
import argparse, glob, json, os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.dirname(__file__))
from dev2iast import dev2iast
from dev2tel import dev2tel
from build_text import clean, strip_numerals, norm, slug, dnum, ORD

SESSION = 'S99'
WRITTEN = '14 Nov 2026'

WORKS = {
    'padma': dict(
        base=0, pages=(33, 81), pdf='pdf1', purana='Padma Purāṇa', deva='पद्मपुराणम्',
        part='Uttarakhaṇḍa', where='before the first skandha',
        vol='Part 1 (Gītā Press code 26)', item='shrimadbhagwat-mahapuran-bhag-1',
        author="Vedavyāsa, by tradition. This māhātmya is part of the Uttarakhaṇḍa of the Padma "
               "Purāṇa. Sūta tells it to Śaunaka at Naimiṣāraṇya.",
        ws=lambda a: f'bhp_padme_{a}',
        ws_name=lambda a: f"the Bhāgavata Māhātmya of the Padma Purāṇa, adhyāya {a}, in the form "
                          "printed with the Śrīmad Bhāgavata",
        ws_kind="Its origin is not stated on the page. It resolves the sandhi between words, so it "
                "is an edited reading text and not the transcript of a print",
        other=lambda a: f'padma_{192 + a}',
        other_name=lambda a: f"the Padma Purāṇa, Uttarakhaṇḍa, adhyāya {192 + a}",
        titles={1: "Devarṣi Nārada meets Bhakti",
                2: "Nārada's effort to remove the sorrow of Bhakti",
                3: "The sorrow of Bhakti is removed",
                4: "The story of Gokarṇa begins",
                5: "Dhundhukārī becomes a preta and is delivered from that state",
                6: "The procedure of the seven-day reading"}),
    'skanda': dict(
        base=1300, pages=(983, 1008), pdf='pdf2', purana='Skanda Purāṇa', deva='स्कन्दपुराणम्',
        part='Vaiṣṇavakhaṇḍa', where='after the twelfth skandha',
        vol='Part 2 (Gītā Press code 27)', item='shrimadbhagwat-mahapuran-bhag-2',
        author="Vedavyāsa, by tradition. This māhātmya is part of the Vaiṣṇavakhaṇḍa of the Skanda "
               "Purāṇa. Sūta tells it to the sages at Naimiṣāraṇya.",
        ws=lambda a: f'skanda_{a}',
        ws_name=lambda a: f"the Skanda Purāṇa, Vaiṣṇavakhaṇḍa, Bhāgavatamāhātmya, adhyāya {a}",
        ws_kind="It is a separate editorial lineage, and the page does not say which printed "
                "edition it reproduces",
        other=None, other_name=None,
        titles={1: "Parīkṣit meets Vajranābha; the sage Śāṇḍilya describes the secret of the "
                   "Lord's līlā and the greatness of the land of Vraja",
                2: "The conversation of Yamunā and the wives of Śrī Kṛṣṇa; Uddhava appears at "
                   "the festival of kīrtana",
                3: "The line of teachers of the Śrīmad Bhāgavata and its greatness; the listeners "
                   "reach the Lord's abode by hearing it",
                4: "The nature and extent of the Śrīmad Bhāgavata, the marks of the listener and "
                   "the speaker, the procedure of hearing, and its greatness"}),
}

# उवाच also arrives joined by sandhi: बालोवाच, भक्तिरुवाच, परीक्षिदुवाच
SPEAKER = re.compile(r'((उ|ु|ो)वाच|[ऊू]चुः|[ऊू]चतुः)[\s\-–—।॥|.]*$')
ALLOWED = re.compile(r'^[ऀ-ॣ॰-ॿ ।॥\-ऽ]+$')


def merge_mid_speakers(units, where):
    """half-line, speaker, numbered half-line -> one verse with the speaker line in the middle."""
    out, i, mids = [], 0, []
    while i < len(units):
        u = units[i]
        if u['kind'] == 'verse' and not u['n']:
            nx = units[i + 1:i + 3]
            if len(nx) == 2 and nx[0]['kind'] == 'speaker' and nx[1]['kind'] == 'verse' and nx[1]['n']:
                out.append({'kind': 'verse', 'n': nx[1]['n'], 'page': u['page'],
                            'lines': u['lines'] + [nx[0]['lines'][0]] + nx[1]['lines'],
                            'mid': len(u['lines'])})
                mids.append(dnum(nx[1]['n']))
                i += 3
                continue
            sys.exit(f'{where}: an unnumbered unit that is not a split verse: {u["lines"][:2]}')
        out.append(u)
        i += 1
    return out, mids


def nrm(deva):
    """Letters only, with every nasal spelled alike, so that सूतं आसीनं and सूतमासीनम् compare equal."""
    return norm(dev2iast(deva)).replace('m', 'ṁ')


def witness_lines(wikitext):
    """The verse lines of a sa.wikisource chapter: (Devanāgarī line, normalised letters)."""
    t = wikitext
    i = t.find('<poem>')
    t = t[i:] if i >= 0 else t
    t = re.sub(r'\{\{[^{}]*\}\}', '', t)
    t = re.sub(r'<[^>]+>', '', t)
    out, begun = [], False
    for ln in t.split('\n'):
        ln = ln.strip()
        if not ln:
            continue
        if ln.startswith('इति श्री'):
            break                                   # the colophon, and nothing after it is verse
        if SPEAKER.search(ln) and len(ln) < 48:
            continue
        if ln.startswith('अथ ') and 'प्रारभ्यते' in ln:
            continue
        if re.match(r'^\(.*\)$', ln):
            continue                                # a metre label, (अनुष्टुप्)
        if not begun and not re.search(r'[।॥]|\|', ln):
            continue                                # the page's own chapter title and summary
        begun = True
        bare = re.sub(r'[०-९0-9]+', '', ln)
        n = nrm(bare)
        if n and re.search(r'[\u0905-\u0939]', bare):
            out.append((re.sub(r'\s+', ' ', bare).strip(), n))
    return out


def collate(verses, wl):
    """verses: [(n, text)] of the print. wl: witness_lines(). Matched by wording only.
    Bins: same (letter for letter), near (similarity 90 or more), differ (78 to 90), absent."""
    from rapidfuzz import fuzz
    W = ''.join(n for _, n in wl)
    starts, p = [], 0
    for _, n in wl:
        starts.append(p); p += len(n)
    covered = bytearray(len(W))

    def lines_at(a, b):
        return [wl[k][0] for k in range(len(wl)) if starts[k] < b and starts[k] + len(wl[k][1]) > a]

    bins, rows = {'same': [], 'near': [], 'differ': [], 'absent': []}, []
    for n, text in verses:
        g = nrm(text)
        pos = W.find(g)
        if pos >= 0:
            covered[pos:pos + len(g)] = b'\x01' * len(g)
            bins['same'].append(n)
            continue
        al = fuzz.partial_ratio_alignment(g, W)
        score = round(al.score, 1) if al else 0
        if score >= 78:
            a, b = al.dest_start, al.dest_end
            covered[a:b] = b'\x01' * (b - a)
            k = 'near' if score >= 90 else 'differ'
            bins[k].append(n)
            rows.append({'verse': n, 'bin': k, 'print': text, 'witness': lines_at(a, b), 'score': score})
        else:
            bins['absent'].append(n)
            rows.append({'verse': n, 'bin': 'absent', 'print': text, 'witness': None, 'score': score})
    extra = []
    for k, (dv, nn) in enumerate(wl):
        c = sum(covered[starts[k]:starts[k] + len(nn)])
        if c * 2 < len(nn):
            extra.append({'line': k + 1, 'witness': dv})
    return bins, extra, rows


def runs(ns):
    """1,2,3,7 -> '1–3, 7'"""
    out, i = [], 0
    while i < len(ns):
        j = i
        while j + 1 < len(ns) and ns[j + 1] == ns[j] + 1:
            j += 1
        out.append(str(ns[i]) if i == j else f'{ns[i]}–{ns[j]}')
        i = j + 1
    return ', '.join(out)


def build(c, key, W, wsdir, outdir, coldir, check):
    a = c['adhyaya']
    code = f"{W['base'] + a:04d}"
    where = f"{key} {a}"
    units_in, mids = merge_mid_speakers(c['units'], where)
    units, plain, speaker = [], [], None
    for u in units_in:
        if u['kind'] == 'speaker':
            speaker = strip_numerals(u['lines'][0]); continue
        if u['kind'] != 'verse':
            sys.exit(f'{where}: a unit of kind {u["kind"]}')
        n1 = dnum(re.split(r'[-—]', u['n'])[0]); n2 = dnum(re.split(r'[-—]', u['n'])[-1])
        lines = []
        for k, ln in enumerate(u['lines']):
            ln = re.sub(r'⁽\d+⁾', '', ln).replace('*', '')
            ln = strip_numerals(clean(ln)) if k != u.get('mid') else strip_numerals(ln)
            if re.search(r'[अ-हॐ]', ln):
                lines.append(ln.strip())
        for ln in lines:
            if not ALLOWED.match(ln):
                sys.exit(f'{where} verse {n1}: a character that is not text: {ln!r}')
        body = [l for k, l in enumerate(lines) if k != u.get('mid')]
        plain.append((n1, '\n'.join(body)))
        text = '\n'.join(lines)
        if speaker:
            text = speaker + '\n' + text; speaker = None
        units.append((n1, n2, text))
    exp = 1
    for n1, n2, _ in units:
        if n1 != exp:
            sys.exit(f'{where}: numbering jumps from {exp - 1} to {n1}')
        exp = n2 + 1
    last = units[-1][1]

    def load(key_):
        page = json.load(open(os.path.join(wsdir, key_ + '.json')))['query']['pages'][0]
        rev = page['revisions'][0]
        return page['pageid'], rev['revid'], witness_lines(rev['slots']['main']['content'])

    pid, revid, wl = load(W['ws'](a))
    bins, extra, rows = collate(plain, wl)
    other = None
    if W['other']:
        opid, orevid, owl = load(W['other'](a))
        obins, _, _ = collate(plain, owl)
        other = dict(pid=opid, revid=orevid, lines=len(owl),
                     found=len(obins['same']) + len(obins['near']) + len(obins['differ']))

    ordinal = ORD[a - 1]
    deva_title = f"श्रीमद्भागवतमाहात्म्यम् ({W['deva']}) – {ordinal}ोऽध्यायः"
    title = f"Śrīmad Bhāgavata Māhātmya ({W['purana']}) {a} — {W['titles'][a]}"
    pages = c['first_page'], c['units'][-1]['page']
    src = (f"Base text and authority: the Gītā Press, Gorakhpur Śrīmadbhāgavata Mahāpurāṇa with Hindi "
           f"translation, {W['vol']}, archive.org item `{W['item']}`, printed pages {pages[0]}–{pages[1]}, "
           f"where this māhātmya is printed {W['where']}; the PDF page numbers are the printed ones. The "
           "PDF carries the typesetter's own text layer in the Chanakya font encoding, and the text was "
           "decoded from it by machine with `bin/bhagavata/chanakya.py`, not read off OCR or typed. Second "
           f"witness: {W['ws_name'](a)}, as carried on sa.wikisource.org (page id {pid}, revision {revid}). "
           f"{W['ws_kind']}. It was compared by machine and matched by wording, never by verse number, with "
           "`bin/bhagavata/build_mahatmya.py`. "
           + (f"Also read: {W['other_name'](a)}, as carried on sa.wikisource.org (page id {other['pid']}, "
              f"revision {other['revid']}), which gives this māhātmya in a different recension and is "
              "therefore not a witness to the wording of this one. " if other else "")
           + f"GRETIL's TEI collection was searched and does not carry this part of the {W['purana']}, and no "
           "scholarly or critical edition of it was found. The IAST was generated mechanically from the "
           "Devanāgarī with `bin/dev2iast.py`.")
    rn = [f"Text-only file, written {WRITTEN} (session {SESSION}): the English, Telugu and Hindi "
          "meanings are still to be added, and the witnesses' differences listed here were found by "
          "machine and have not been adjudicated or bracketed into the line. The print is followed "
          f"throughout. The print numbers {last} verses."]
    rn.append(f"Of these, {len(bins['same'])} are found in the second witness letter for letter once "
              "spacing and the spelling of nasals are set aside"
              + (f"; {len(bins['near'])} differ from it by a letter or two"
                 + (", or only because it resolves the sandhi" if key == 'padma' else "")
                 + f": {runs(bins['near'])}" if bins['near'] else "")
              + (f"; {len(bins['differ'])} differ from it more than that: {runs(bins['differ'])}"
                 if bins['differ'] else "")
              + (f"; {len(bins['absent'])} were not found there: {runs(bins['absent'])}"
                 if bins['absent'] else "") + ".")
    if extra:
        rn.append(f"The second witness has {len(extra)} line{'s' if len(extra) != 1 else ''} of verse "
                  "that the print does not carry.")
    if other:
        rn.append(f"The {W['purana']} itself, in the text named above, tells this chapter in "
                  f"{other['lines']} lines of verse"
                  + (", after an opening in which Pārvatī questions Śiva" if a == 1 else "")
                  + f". {other['found']} of the print's {last} verses are found there in recognisably the "
                  "same words; the rest are worded differently there or are absent. It is recorded as a "
                  "separate recension and was not used to correct the print.")
    if mids:
        rn.append(f"At {runs(mids)} the print sets the speaker line between the two halves of the "
                  "verse, and the three lines are kept in the order printed.")
    if key == 'padma' and a == 1:
        rn.append("At 36 the edition's footnote quotes a verse that explains the three terms of the "
                  "line: अट्टमन्नं शिवो वेदः शूलो विक्रय उच्यते। केशो भगमिति प्रोक्तमृषिभिस्तत्त्वदर्शिभिः॥ "
                  "It is a gloss and not a reading, and it is not part of the text.")
    rn.append("Spacing is the print's, as its text layer gives it; in a few places justification has "
              "left a space inside a word, and these are still to be closed when the verse is read.")
    rn.append("The speaker lines are printed in italic above the verse they introduce, and are given "
              "as its first line.")

    o = [f"Title: {title}", f"Devanāgarī: {deva_title}", f"Telugu: {dev2tel(deva_title)}", '',
         f"Author: {W['author']}", '', "Language: Sanskrit",
         f"Type: Purāṇa (an adhyāya of the Śrīmad Bhāgavata Māhātmya of the {W['purana']}, {W['part']})", '',
         f"Source / recension: {src}", '', f"Recension note: {' '.join(rn)}", '',
         f"Verse count: {last}, plus the closing colophon printed unnumbered.", '']
    for n1, n2, text in units:
        o.append(f'--- verse {n1} ---')
        o += ['deva:', text, 'iast:', dev2iast(text), '']
    col = re.sub(r'-\s+', '', c['colophon'])                     # a word broken at the line's end
    col = re.sub(r'\s+', ' ', col).replace('*', '')
    m = re.search(r'॥\s*([०-९]+)\s*॥\s*$', col)
    col = strip_numerals(col[:m.start()] if m else col) + (f'॥ {m.group(1)}॥' if m else '')
    if not ALLOWED.match(re.sub(r'[०-९]', '', col)):
        sys.exit(f'{where}: a character in the colophon that is not text: {col!r}')
    o += ['--- verse none ---', 'deva:', col, 'iast:', dev2iast(col), '']

    name = f"{code}_mahatmya_{key}_{slug(W['titles'][a], 4)}.txt"
    path = os.path.join(outdir, name)
    report = (f"{code} {key} {a}: {last} verses; " + ', '.join(f"{k} {len(v)}" for k, v in bins.items())
              + f", witness-only lines {len(extra)}, mid-speaker {mids}"
              + (f", in the Purāṇa itself {other['found']}/{last}" if other else ""))
    if coldir:
        os.makedirs(coldir, exist_ok=True)
        json.dump({'file': name, 'witness': W['ws_name'](a), **bins, 'rows': rows,
                   'witness_only': extra},
                  open(os.path.join(coldir, f'{code}.json'), 'w'), ensure_ascii=False, indent=1)
    existing = glob.glob(os.path.join(outdir, f'{code}_*.txt'))
    if existing:
        print('EXISTS, left alone:', existing[0], '|', report)
    elif check:
        print('would write', path, '|', report)
    else:
        open(path, 'w').write('\n'.join(o).rstrip('\n') + '\n')
        print('wrote', path, '|', report)
    return last


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pdf1', required=True)
    ap.add_argument('--pdf2', required=True)
    ap.add_argument('--ws', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--collation')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    import fitz
    from gpverses import extract
    from gpparse import parse
    total = 0
    for key, W in WORKS.items():
        doc = fitz.open(getattr(a, W['pdf']))
        chs = [c for c in parse(list(extract(doc, *W['pages']))) if c['adhyaya'] and not c['skandha']]
        if sorted(c['adhyaya'] for c in chs) != sorted(W['titles']):
            sys.exit(f"{key}: expected adhyāyas {sorted(W['titles'])}, parsed {[c['adhyaya'] for c in chs]}")
        for c in chs:
            if W['purana'].split()[0][:4].lower() not in dev2iast(c['colophon']).lower().replace('ā', 'a'):
                sys.exit(f"{key} {c['adhyaya']}: the colophon does not name the {W['purana']}: {c['colophon'][:80]}")
            total += build(c, key, W, a.ws, a.out, a.collation, a.check)
    print('total verses', total)


if __name__ == '__main__':
    main()

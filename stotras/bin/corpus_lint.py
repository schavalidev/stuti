#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mechanical correctness lint over every corpus file. Read-only.

    python3 bin/corpus_lint.py                 # summary by check, worst files first
    python3 bin/corpus_lint.py --tsv out.tsv   # every finding, one per row
    python3 bin/corpus_lint.py --check iast    # one check only, every finding printed
    python3 bin/corpus_lint.py devi/goda       # restrict to a path prefix

What this is for. `audit.py --checks` already looks at the header counts, the
missing fields and the sourcing leaks. This covers what it does not: whether the
Devanāgarī is well-formed as a sequence of codepoints, whether the IAST is
actually the transliteration of the Devanāgarī beside it, whether each
translation field holds the script it should, whether the units are numbered
without gaps, whether the sections named in the header are the sections used,
and whether any editorial scaffolding (placeholders, markdown, zero-width
characters) is left in the text.

What it cannot do. It cannot tell a correct verse from a wrong one. A missing
syllable that produces valid Devanāgarī and a matching IAST passes every check
here. Textual fidelity to a witness is established by collation when a file is
written, and is recorded in the file's editorial fields; this lint only catches
the mechanical slips that collation does not.

Severity. `high` is a fault in the text a reciter would meet (bad akṣara, IAST
that does not match the Devanāgarī, a swapped field). `mid` is structure (gaps in
numbering, sections that do not line up, embedded verse numbers). `low` is
hygiene and register (zero-width characters, markdown, a banned phrase).

Nothing here edits a file.
"""
import argparse
import collections
import hashlib
import pathlib
import re
import sys
import unicodedata

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import reader_view as rv  # noqa: E402
from dev2iast import dev2iast  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent

SKIP_DIRS = ("bin", ".venv", "cache", "__MACOSX")

UNIT_HEAD = re.compile(r"^--- (?!-)(.+?) ---$", re.M)
FIELD = re.compile(
    r"^(deva|iast|en|tel|hi|vidhi|variant):[ \n](.*?)(?=\n(?:deva|iast|en|tel|hi|vidhi|variant):|\Z)",
    re.S | re.M)
NAME_ROW = re.compile(r"^\s*(\d+)\s*\|(.*)$", re.M)
HEADER_LINE = re.compile(r"^([A-Z][A-Za-zāīūṁṛṇśṣḍ /()-]{1,40}):", re.M)

ACCENTS = "॒॑᳚᳛॓॔ᳪ᳭᳓"
DEVA = re.compile(r"[ऀ-ॿ᳐-᳿꣠-ꣿ]")
TELUGU = re.compile(r"[ఀ-౿]")
TAMIL = re.compile(r"[஀-௿]")
LATIN_LETTER = re.compile(r"[A-Za-z]")
ZERO_WIDTH = re.compile(r"[​‌‍⁠﻿­]")

# Devanāgarī classes for the akṣara check.
CONSONANT = set("कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळऱऴऩक्षज्ञ") | set(
    "क़ख़ग़ज़ड़ढ़फ़य़ॹॺॻॼॾॿ")
CONSONANT -= set("्")  # the string above drags a virāma in with क्ष / ज्ञ
INDEP_VOWEL = set("अआइईउऊऋॠऌॡएऐओऔऍऑऎऒॲॳॴॵॶॷ")
VOWEL_SIGN = set("ािीुूृॄॢॣेैोौॅॉॆॊॎॏॕॖॗ")
VIRAMA = "्"
NUKTA = "़"
SPACING_SIGN = set("ंःँँंः")
OM = "ॐ"
AVAGRAHA = "ऽ"
DANDA = set("।॥")
DEVA_DIGIT = set("०१२३४५६७८९")

CONTRACTION = re.compile(
    r"\b(?:don't|doesn't|didn't|isn't|aren't|wasn't|weren't|can't|cannot't|won't|wouldn't"
    r"|shouldn't|couldn't|it's|that's|there's|here's|what's|who's|let's|I'm|you're|we're"
    r"|they're|I've|you've|we've|they've|I'll|you'll|we'll|they'll|he's|she's)\b", re.I)
BANNED_PHRASE = re.compile(
    r"\bthe dead\b|worth pausing|the interest of the text|the whole point|the note on which"
    r"|most striking|\bessayistic\b|\bTODO\b|\bTBD\b|\bFIXME\b|\bXXX\b|lorem ipsum"
    r"|\[to be |\(to be (?:added|written|filled)|not yet (?:written|translated)|placeholder",
    re.I)
MARKDOWN = re.compile(r"\*\*|(?<!\w)\*(?=\w)|(?<=\w)\*(?!\w)|^#{1,4} |`", re.M)

PLACEHOLDER = re.compile(r"^RESERVED", re.M)

# Editorial matter that follows the last unit in some 500 files: a `---` rule line and then
# `Recension note:` and the like. It is not part of the unit, and a parser that does not stop
# there hands it to the reader inside the last `hi:` field.
TRAILING = re.compile(
    r"^(?:-{3,}\s*$|(?:" + "|".join(re.escape(n) for n in rv.READER_FIELDS + rv.EDITORIAL_FIELDS)
    + r"|Language|Dedup|Cross-reference[^:\n]*|Colophon \([^)]*\)|Numbering|On numbering"
    + r"|On the count|Counting|[A-Z][A-Za-z āīūṁṛṇśṣḍ/()-]{2,45} note):)", re.M)


def files(prefix=None):
    for p in sorted(ROOT.rglob("*.txt")):
        rel = p.relative_to(ROOT)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        if prefix and not str(rel).startswith(prefix):
            continue
        yield p, str(rel)


def split_units(text):
    heads = list(UNIT_HEAD.finditer(text))
    units = []
    for i, m in enumerate(heads):
        body = text[m.end(): heads[i + 1].start() if i + 1 < len(heads) else len(text)]
        label = m.group(1).strip()
        trail = ""
        if i + 1 == len(heads):
            t = TRAILING.search(body)
            if t:
                body, trail = body[: t.start()], body[t.start():]
        u = {"_label": label, "_body": body, "_trail": trail}
        if label == "names":
            rows = []
            for num, rest in NAME_ROW.findall(body):
                cols = [c.strip() for c in rest.split("|")]
                cols += [""] * (5 - len(cols))
                rows.append([int(num)] + cols[:5])
            u["_names"] = rows
        else:
            u.update({k: v.strip() for k, v in FIELD.findall(body)})
        units.append(u)
    return units


def header_fields(head):
    """Every `Name: value` line in the header, in order, with duplicates kept."""
    out = []
    lines = head.split("\n")
    for i, ln in enumerate(lines):
        m = HEADER_LINE.match(ln)
        if m:
            out.append((m.group(1), ln[m.end():].strip(), i))
    return out


# ----------------------------------------------------------------------------- Devanāgarī

def deva_faults(s):
    """Codepoint-level faults in a Devanāgarī string. Returns [(kind, context)]."""
    out = []
    s_nfc = unicodedata.normalize("NFC", s)
    if s_nfc != s:
        out.append(("nfc", "not NFC-normalised"))
    s = s_nfc
    n = len(s)

    def ctx(i):
        return s[max(0, i - 6): i + 6].replace("\n", "⏎")

    def prev_base(i):
        """The character before i, skipping accents, nukta and ZW chars."""
        j = i - 1
        while j >= 0 and (s[j] in ACCENTS or s[j] == NUKTA or ZERO_WIDTH.match(s[j])):
            j -= 1
        return s[j] if j >= 0 else ""

    for i, ch in enumerate(s):
        if ch in VOWEL_SIGN:
            pb = prev_base(i)
            if pb in VOWEL_SIGN:
                out.append(("double-matra", ctx(i)))
            elif pb in INDEP_VOWEL:
                out.append(("matra-after-vowel", ctx(i)))
            elif pb == VIRAMA:
                out.append(("matra-after-virama", ctx(i)))
            elif pb in SPACING_SIGN:
                out.append(("matra-after-anusvara", ctx(i)))
            elif pb not in CONSONANT and pb != OM:
                out.append(("orphan-matra", ctx(i)))
        elif ch == VIRAMA:
            pb = prev_base(i)
            if pb == VIRAMA:
                out.append(("double-virama", ctx(i)))
            elif pb in VOWEL_SIGN or pb in INDEP_VOWEL:
                out.append(("virama-after-vowel", ctx(i)))
            elif pb in SPACING_SIGN:
                out.append(("virama-after-anusvara", ctx(i)))
            elif pb not in CONSONANT:
                out.append(("orphan-virama", ctx(i)))
        elif ch == NUKTA:
            pb = s[i - 1] if i else ""
            if pb not in CONSONANT:
                out.append(("orphan-nukta", ctx(i)))
        elif ch in SPACING_SIGN:
            pb = prev_base(i)
            if pb == VIRAMA:
                # ग्ं / ग्ँ is the Vedic guttural nasal (ळँ, gṁ) as Taittirīya printing writes it.
                j = i - 1
                while j >= 0 and (s[j] == VIRAMA or ZERO_WIDTH.match(s[j]) or s[j] in ACCENTS):
                    j -= 1
                base = s[j] if j >= 0 else ""
                # ग्ं is the Vedic guttural nasal (gṁ) as Taittirīya printing writes it;
                # ल्ँ and न्ँ are the anunāsika semivowel in sandhi (भगवाल्ँलोक).
                if not ((base == "ग" and ch in "ंँ") or (base in "लन" and ch == "ँ")):
                    out.append(("anusvara-after-virama", ctx(i)))
            elif pb in SPACING_SIGN and not (pb == "ँ" or ch == "ँ"):
                out.append(("double-anusvara", ctx(i)))
            elif pb and pb not in CONSONANT and pb not in VOWEL_SIGN \
                    and pb not in INDEP_VOWEL and pb != OM and pb != AVAGRAHA:
                out.append(("orphan-anusvara", ctx(i)))
        elif ch in ACCENTS:
            pb = s[i - 1] if i else ""
            if not pb or pb.isspace() or pb in DANDA:
                out.append(("orphan-accent", ctx(i)))
    return out


def strip_for_compare(s):
    """Reduce an IAST string to the letters that carry meaning, so that two
    renderings of one Devanāgarī compare equal under either nasal convention."""
    s = unicodedata.normalize("NFC", s)
    s = s.lower()
    s = re.sub(r"\([^()]*\)", "", s)          # bracketed variants: compare the base reading
    # A compound hyphen carries no letter. It must go before the nasal rule
    # below, or `param-padam` keeps its m (the m is followed by a hyphen, not
    # the p) while `parampadam` turns it to ṁ, and the two stop comparing equal.
    s = s.replace("-", "")
    s = s.replace("ṃ", "ṁ").replace("ē", "e").replace("ō", "o").replace("r̥", "ṛ")
    s = s.replace("m̐", "ṁ")                  # candrabindu → anusvāra, either convention
    s = s.replace("ĩ", "iṁ").replace("ũ", "uṁ").replace("ã", "aṁ")  # nasalised vowels
    s = s.replace("gṁ", "ṁ")                  # the ळँ ligature's own rendering
    # Homorganic nasal before its stop → anusvāra. Both conventions are in use.
    s = re.sub(r"ṅ(?=[kg])|ñ(?=[cj])|ṇ(?=[ṭḍ])|n(?=[tdn])|m(?=[pbm])", "ṁ", s)
    s = re.sub(r"ṁ(?=ṁ)", "", s)              # the rule above can double on geminates
    s = re.sub(r"[^a-zāīūṛṝḷḹṅñṇṭḍśṣḥṁḻṟṉ]", "", s)
    return s


def word_diffs(a, b, limit=3):
    """Pairs of differing words between two IAST strings, after normalising."""
    import difflib
    aw = [w for w in re.split(r"[\s|/]+", a) if w]
    bw = [w for w in re.split(r"[\s|/]+", b) if w]
    an = [strip_for_compare(w) for w in aw]
    bn = [strip_for_compare(w) for w in bw]
    sm = difflib.SequenceMatcher(None, an, bn, autojunk=False)
    out = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        out.append(f"{' '.join(aw[i1:i2]) or '∅'} ⇄ {' '.join(bw[j1:j2]) or '∅'}")
        if len(out) >= limit:
            break
    return out


# ----------------------------------------------------------------------------- the checks

def lint(path, rel, text):
    """Yield (severity, check, message)."""
    F = []
    add = lambda sev, check, msg: F.append((sev, check, msg))

    if PLACEHOLDER.match(text.lstrip()):
        add("mid", "reserved", "placeholder reserved by another session")
        return F

    if "\r" in text:
        add("low", "encoding", "CRLF line endings")
    if "\t" in text:
        add("low", "encoding", "tab characters")
    zw = ZERO_WIDTH.findall(text)
    if zw:
        add("low", "zero-width", f"{len(zw)} zero-width / soft-hyphen characters "
                                 f"({', '.join(sorted({f'U+{ord(c):04X}' for c in zw}))})")
    if "�" in text:
        add("high", "encoding", "U+FFFD replacement character: a byte was lost")

    heads = list(UNIT_HEAD.finditer(text))
    head = text[: heads[0].start()] if heads else text
    units = split_units(text)

    # ---- header
    hf = header_fields(head)
    names = [n for n, _, _ in hf]
    seen = collections.Counter(names)
    for n, c in seen.items():
        if c > 1 and n in rv.READER_FIELDS + rv.EDITORIAL_FIELDS:
            add("mid", "header", f"field '{n}' appears {c} times")
    fields = {}
    for n, v, i in hf:
        fields.setdefault(n, v)
    for req in ("Title", "Devanāgarī", "Telugu", "Author", "Source / recension"):
        if req not in fields:
            add("mid", "header", f"no '{req}' field")
        elif not fields[req]:
            add("mid", "header", f"'{req}' is empty")
    if not any(k in fields for k in ("Verse count", "Name count", "Unit count")):
        add("mid", "header", "no count field")
    if "Blurb" not in fields:
        add("low", "no-blurb", "no Blurb")
    if "Devanāgarī" in fields and fields["Devanāgarī"] and not DEVA.search(fields["Devanāgarī"]):
        add("high", "header", "Devanāgarī title holds no Devanāgarī")
    if "Telugu" in fields and fields["Telugu"] and not TELUGU.search(fields["Telugu"]):
        add("high", "header", "Telugu title holds no Telugu")
    if "Title" in fields and (DEVA.search(fields["Title"]) or TELUGU.search(fields["Title"])):
        add("mid", "header", "IAST Title carries Indic script")
    for n in ("Devanāgarī",):
        if n in fields:
            for kind, c in deva_faults(fields[n]):
                add("high", "deva-akshara", f"header {n}: {kind} ‹{c}›")

    # Sections header vs sections used.
    sec_used = collections.OrderedDict()
    for u in units:
        m = re.search(r"\| section: (.*)$", u["_label"])
        if m:
            sec_used[m.group(1).strip()] = sec_used.get(m.group(1).strip(), 0) + 1
    if "Sections" in fields:
        m = re.search(r"^Sections:\s*\n((?:(?!\n\n)[^\n]*\n?)+)", head, re.M)
        listed = []
        if m:
            for ln in m.group(1).split("\n"):
                ln = ln.strip().lstrip("-• ").strip()
                if ln:
                    listed.append(ln)
        if sec_used and listed:
            norm = lambda x: re.sub(r"\s*\(.*?\)\s*$", "", re.sub(r"\s+", " ", x)).strip().lower()
            listed_n = set()
            for l in listed:
                listed_n.add(norm(l))
                for part in re.split(r"\s+—\s+|\s+-\s+|:\s+", l):
                    listed_n.add(norm(part))
            for s in sec_used:
                if norm(s) not in listed_n and not any(norm(s) in l or l in norm(s) for l in listed_n if l):
                    add("mid", "sections", f"unit section '{s}' is not in the Sections header")
    elif sec_used and len(sec_used) > 1:
        add("low", "sections", f"{len(sec_used)} sections used, no Sections header")

    # ---- unit numbering
    nums = []
    runs = []  # one list of numbers per section
    last_sec = None
    for u in units:
        m = re.match(r"(verse|unit|passage)\s+(\d+)", u["_label"])
        if m:
            sec = (re.search(r"\| section: (.*)$", u["_label"]) or [None, None])[1]
            if not runs or (sec != last_sec and int(m.group(2)) in (0, 1)):
                runs.append([])
            runs[-1].append(int(m.group(2)))
            last_sec = sec
    if runs and len(runs) > 1:
        add("low", "numbering", f"numbering restarts {len(runs)-1} time(s) at a section boundary")
    for nums in runs:
        dup = [n for n, c in collections.Counter(nums).items() if c > 1]
        if dup:
            add("mid", "numbering", f"unit numbers repeated: {sorted(dup)[:6]}")
        if nums is runs[0] and nums[0] not in (0, 1):
            add("mid", "numbering", f"units start at {nums[0]}")
        gaps = [(a, b) for a, b in zip(nums, nums[1:]) if b != a + 1 and b > a]
        if gaps:
            add("mid", "numbering", f"gaps in numbering: {gaps[:4]}")
        desc = [(a, b) for a, b in zip(nums, nums[1:]) if b <= a and b not in dup]
        if desc:
            add("mid", "numbering", f"numbering goes backwards: {desc[:4]}")

    if not units:
        add("mid", "structure", "no units")
        return F

    # ---- unit content
    has = lambda k: any(k in u for u in units)
    is_vernacular = bool(re.search(r"^Language:\s*(Awadhi|Hindi|Braj|Tamil)", head, re.M))
    is_list_shelf = rel.startswith(("puja/", "vidhi/"))
    deva_blocks = []
    iast_mismatch = 0
    for idx, u in enumerate(units, 1):
        lab = u["_label"]
        if "_names" in u:
            rows = u["_names"]
            if rows:
                ns = [r[0] for r in rows]
                exp = list(range(ns[0], ns[0] + len(ns)))
                if ns != exp:
                    add("mid", "names", f"name rows not consecutive: first break near "
                                        f"{next((a for a, b in zip(ns, exp) if a != b), '?')}")
                stated = fields.get("Name count") or fields.get("Verse count") or ""
                m = re.search(r"\d+", stated)
                if m and int(m.group(0)) != len(rows):
                    add("mid", "names", f"Name count {m.group(0)}, table holds {len(rows)}")
                for r in rows:
                    if r[1] and not DEVA.search(r[1]):
                        add("high", "names", f"name {r[0]}: deva column is not Devanāgarī")
                    for kind, c in deva_faults(r[1]):
                        add("high", "deva-akshara", f"name {r[0]}: {kind} ‹{c}›")
                    if r[2] and DEVA.search(r[2]):
                        add("high", "names", f"name {r[0]}: iast column carries Devanāgarī")
                    if r[1] and r[2]:
                        a, b = strip_for_compare(dev2iast(r[1])), strip_for_compare(r[2])
                        if a != b:
                            iast_mismatch += 1
                            if iast_mismatch <= 5:
                                add("high", "iast", f"name {r[0]}: {r[1]} → {dev2iast(r[1])} ≠ {r[2]}")
                    if r[4] and not TELUGU.search(r[4]):
                        add("high", "field-script", f"name {r[0]}: tel column has no Telugu")
                    if r[5] and not DEVA.search(r[5]):
                        add("high", "field-script", f"name {r[0]}: hi column has no Devanāgarī")
            continue

        d = u.get("deva", "")
        a = u.get("iast", "")
        if not d or not a:
            continue  # audit.py reports missing fields
        deva_blocks.append(d)

        # script purity of deva
        for kind, c in deva_faults(d):
            add("high", "deva-akshara", f"{lab}: {kind} ‹{c}›")
        if TELUGU.search(d):
            add("high", "field-script", f"{lab}: Telugu script inside deva")
        lat = [w for w in re.findall(r"[A-Za-z]{2,}", d)]
        if lat:
            add("high", "field-script", f"{lab}: Latin inside deva: {' '.join(lat[:4])}")
        if DEVA.search(a):
            add("high", "field-script", f"{lab}: Devanāgarī inside iast")
        if re.search(r"[ēōṃ]", a) and not is_vernacular and not TAMIL.search(d):
            add("low", "iast-convention", f"{lab}: ē/ō/ṃ in iast (corpus uses e/o/ṁ)")
        if re.search(r"[A-Z]", a) and not re.match(r"^\s*[A-Z]", a):
            pass  # capitals mid-line are allowed (names in vidhi), not a fault

        # embedded verse numbers in stotra text
        if not is_list_shelf:
            for ln in d.split("\n"):
                if re.search(r"॥\s*[०-९0-9]+\s*॥", ln) and not re.search(r"[॒॑᳚]", ln):
                    add("low", "embedded-number", f"{lab}: verse number inside the deva text")
                    break

        # dandas: a verse unit in a stotra should close with a daṇḍa (or a colon-free line end)
        if not is_list_shelf and not u.get("vidhi"):
            last = d.rstrip().split("\n")[-1].rstrip()
            if last and last[-1] not in DANDA and not re.search(r"[।॥]\s*[०-९0-9]*\s*$", last) \
                    and not last.endswith(")") and not last.endswith("॥)") \
                    and re.search(r"[ऀ-ॿ]$", last):
                add("low", "danda", f"{lab}: last deva line does not end with a daṇḍa")
        # daṇḍa in deva should answer to | in iast, line by line
        dl, al = d.split("\n"), a.split("\n")
        if len(dl) == len(al):
            for x, y in zip(dl, al):
                if (x.count("॥") + x.count("।")) != (y.count("|")) and \
                        (x.count("॥") * 2 + x.count("।")) != y.count("|"):
                    add("low", "danda", f"{lab}: daṇḍa count differs between deva and iast on a line")
                    break

        # the IAST actually transliterates the deva
        gen = dev2iast(d)
        if strip_for_compare(gen) != strip_for_compare(a):
            accented_iast = bool(re.search(r"[\u0300-\u036f]", a.replace("m̐", "")))
            sev = "low" if (accented_iast or TAMIL.search(d)) else "high"
            iast_mismatch += 1
            if iast_mismatch <= 6:
                add(sev, "iast" if sev == "high" else "iast-vedic-tamil",
                    f"{lab}: " + " · ".join(word_diffs(gen, a)))

        # translation fields hold the right script
        for k, rx, what in (("tel", TELUGU, "Telugu"), ("hi", DEVA, "Devanāgarī")):
            v = u.get(k)
            if v and not rx.search(v):
                add("high", "field-script", f"{lab}: {k} field has no {what}")
        en = u.get("en")
        if en:
            if TELUGU.search(en):
                add("high", "field-script", f"{lab}: Telugu inside en")
            devs = len(DEVA.findall(en))
            if devs > max(20, 0.4 * len(en)):
                add("high", "field-script", f"{lab}: en field is mostly Devanāgarī")
        tel = u.get("tel")
        if tel and len(DEVA.findall(tel)) > 0.5 * max(1, len(TELUGU.findall(tel))) and len(tel) > 40:
            add("mid", "field-script", f"{lab}: tel field is largely Devanāgarī")
        hi = u.get("hi")
        if hi and TELUGU.search(hi):
            add("high", "field-script", f"{lab}: Telugu inside hi")
        # an en/tel/hi that merely repeats another field
        if en and tel and en.strip() == tel.strip():
            add("high", "field-dup", f"{lab}: en and tel identical")
        if hi and d and hi.strip() == d.strip():
            add("high", "field-dup", f"{lab}: hi repeats the deva text")

        # prose hygiene
        for k in ("en", "vidhi"):
            v = u.get(k)
            if not v:
                continue
            m = BANNED_PHRASE.search(v)
            if m:
                add("low", "register", f"{lab}: {k}: ‹{m.group(0)}›")
            m = CONTRACTION.search(v)
            if m:
                add("low", "register", f"{lab}: {k}: contraction ‹{m.group(0)}›")
            if MARKDOWN.search(v):
                add("low", "markdown", f"{lab}: {k}: markdown markers")
        for k in ("en", "tel", "hi", "vidhi"):
            v = u.get(k)
            if v and v.count("\n") > 0 and k != "vidhi":
                add("low", "one-line", f"{lab}: {k} spans {v.count(chr(10))+1} lines")

    if units and units[-1].get("_trail"):
        first = units[-1]["_trail"].strip().split("\n")
        first = next((l for l in first if l.strip() and not re.fullmatch(r"-{3,}", l.strip())), "")
        add("mid", "trailing-notes", f"editorial text after the last unit: ‹{first[:50]}›")
    if iast_mismatch > 6:
        add("high", "iast", f"… {iast_mismatch} units in all where iast ≠ transliteration of deva")

    # ---- duplicate verses inside the file (non-adjacent, exact)
    seen_d = {}
    for i, d in enumerate(deva_blocks):
        key = re.sub(r"\s+", " ", re.sub(r"[^ऀ-ॿ]", "", d))
        if len(key) < 40:
            continue
        if key in seen_d and seen_d[key] != i - 1:
            add("mid", "dup-unit", f"unit {i+1} repeats unit {seen_d[key]+1} exactly")
        seen_d[key] = i

    # ---- header prose hygiene
    for n in ("Blurb", "Author", "Sections"):
        v = fields.get(n)
        if not v:
            continue
        m = BANNED_PHRASE.search(v)
        if m:
            add("low", "register", f"{n}: ‹{m.group(0)}›")
        if CONTRACTION.search(v):
            add("low", "register", f"{n}: contraction")
        if MARKDOWN.search(v):
            add("low", "markdown", f"{n}: markdown markers")
    for kind, c in deva_faults("\n".join(fields.get(k, "") for k in ("Devanāgarī",))):
        pass  # already reported above

    # accent in a shelf that should not carry it
    deva_all = "\n".join(u.get("deva", "") for u in units if "deva" in u)
    acc = sum(deva_all.count(c) for c in ACCENTS)
    if acc and not rel.startswith(("veda/", "vidhi/", "puja/", "misc_vedic/")):
        add("mid", "accent-shelf", f"{acc} svara marks in a non-Vedic shelf")
    if acc:
        # accented iast should not exist (convention strips accents in iast)
        if re.search(r"[̀-ͯ]", "\n".join(u.get("iast", "") for u in units if "iast" in u)
                     .replace("m̐", "")):
            add("low", "iast-convention", "combining accents in iast")
    return F


def file_hash(units):
    key = "".join(re.sub(r"[^ऀ-ॿ]", "", u.get("deva", "")) for u in units if "deva" in u)
    return hashlib.sha1(key.encode()).hexdigest() if len(key) > 200 else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("prefix", nargs="?")
    ap.add_argument("--tsv")
    ap.add_argument("--check")
    ap.add_argument("--sev", choices=["high", "mid", "low"])
    args = ap.parse_args()

    rows = []
    by_check = collections.Counter()
    files_by_check = collections.defaultdict(set)
    hashes = collections.defaultdict(list)
    n = 0
    for p, rel in files(args.prefix):
        n += 1
        text = p.read_text(encoding="utf-8", errors="replace")
        try:
            found = lint(p, rel, text)
        except Exception as e:  # a lint crash is itself a finding
            found = [("high", "lint-error", repr(e))]
        h = file_hash(split_units(text))
        if h:
            hashes[h].append(rel)
        for sev, check, msg in found:
            if args.check and check != args.check:
                continue
            if args.sev and sev != args.sev:
                continue
            rows.append((rel, sev, check, msg))
            by_check[check] += 1
            files_by_check[check].add(rel)
    for h, rels in hashes.items():
        if len(rels) > 1 and (not args.check or args.check == "dup-file"):
            for r in rels:
                rows.append((r, "mid", "dup-file", "same deva text as " +
                             ", ".join(x for x in rels if x != r)))
                by_check["dup-file"] += 1
                files_by_check["dup-file"].add(r)

    if args.tsv:
        with open(args.tsv, "w", encoding="utf-8") as f:
            f.write("file\tseverity\tcheck\tmessage\n")
            for r in rows:
                f.write("\t".join(r) + "\n")

    print(f"{n} files scanned; {len(rows)} findings in {len({r[0] for r in rows})} files\n")
    sev_of = {}
    for r in rows:
        sev_of[r[2]] = r[1]
    print(f"{'check':18} {'sev':5} {'findings':>9} {'files':>6}")
    for check, c in sorted(by_check.items(), key=lambda kv: (-{'high': 3, 'mid': 2, 'low': 1}[sev_of[kv[0]]], -kv[1])):
        print(f"{check:18} {sev_of[check]:5} {c:9} {len(files_by_check[check]):6}")

    if args.check or args.prefix:
        print()
        for rel, sev, check, msg in rows:
            print(f"{rel}\t{check}\t{msg}")


if __name__ == "__main__":
    main()

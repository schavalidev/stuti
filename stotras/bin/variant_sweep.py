#!/usr/bin/env python3
"""Read-only near-duplicate sweep over the stotra corpus.

Finds pairs of files whose deva: text is nearly the same, which under the
2026-09-12 bracket rule may belong in one file with the other reading in
round brackets. It prints candidates and changes nothing: a merge retires a
file, and that is never decided by a script.

Two whole classes of near-identical pair are excluded, because they are
deliberate and must stay two files:
  * the Vedic / Paurāṇika twins — the same basename under puja/pauranika/X/
    and puja/X/, kept apart so the uninitiated reader has a form to use;
  * everything else under puja/, where the ṣoḍaśopacāra boilerplate makes
    unrelated rites read as 90% the same text.

    python3 bin/variant_sweep.py [min-similarity]
"""
import os, re, sys, unicodedata
from collections import defaultdict
from itertools import combinations

ROOT = "/Users/bhavanisrikrishna/Documents/Stuti/stotras"

VERSE = re.compile(r"^---\s*verse\b", re.M)
FIELD = re.compile(r"^(deva|iast|en|tel|hi):\s*(.*)$")

def read_deva(path):
    """The deva: text of every verse, in order, as one list of lines."""
    out, cur = [], None
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n")
        m = FIELD.match(line)
        if m:
            cur = m.group(1)
            if cur == "deva" and m.group(2).strip():
                out.append(m.group(2).strip())
            continue
        if line.startswith("---") or not line.strip():
            if line.startswith("---"): cur = None
            continue
        if cur == "deva":
            out.append(line.strip())
    return out

# ---- normalisation: fold away the differences that recite identically ----
NASAL = re.compile(r"[ङञणनम]्(?=[क-ह])")
PUNCT = re.compile(r"[।॥|\s\d०-९,.;:!?'\"()\[\]–—-]+")
AVAG  = re.compile(r"[ऽ‌‍]")

def norm(text):
    t = unicodedata.normalize("NFC", text)
    t = AVAG.sub("", t)
    t = NASAL.sub("ं", t)          # कन्दर्प → कंदर्प
    t = PUNCT.sub(" ", t)
    return t.strip()

def words(path):
    return norm(" ".join(read_deva(path))).split()

files = []
for dirpath, _, names in os.walk(ROOT):
    for n in sorted(names):
        if n.endswith(".txt"):
            files.append(os.path.join(dirpath, n))

docs = {}
for f in files:
    w = words(f)
    if len(w) >= 12:                 # too short to judge
        docs[f] = w

# shingle index (5-word windows) so we only score plausible pairs
index = defaultdict(list)
shing = {}
for f, w in docs.items():
    s = {" ".join(w[i:i+5]) for i in range(len(w) - 4)}
    shing[f] = s
    for g in s:
        index[g].append(f)

pairs = defaultdict(int)
for g, fs in index.items():
    if len(fs) > 12:                 # a boilerplate line, not evidence
        continue
    for a, b in combinations(sorted(fs), 2):
        pairs[(a, b)] += 1

rows = []
for (a, b), _ in pairs.items():
    sa, sb = shing[a], shing[b]
    inter = len(sa & sb)
    j = inter / len(sa | sb)
    if j < 0.35:
        continue
    wa, wb = docs[a], docs[b]
    # word-level differences, on the normalised text
    import difflib
    sm = difflib.SequenceMatcher(None, wa, wb, autojunk=False)
    diffs = [(wa[i1:i2], wb[j1:j2]) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != "equal"]
    ndiff = sum(max(len(x), len(y)) for x, y in diffs)
    rows.append((j, sm.ratio(), ndiff, len(wa), len(wb), a, b, diffs))

rows.sort(key=lambda r: -r[1])
rel = lambda p: os.path.relpath(p, ROOT)
FLOOR = float(sys.argv[1]) if len(sys.argv) > 1 else 0.55

def deliberate(a, b):
    """Pairs that are two files on purpose, and are not candidates."""
    a, b = rel(a), rel(b)
    if os.path.basename(a) == os.path.basename(b) and \
       a.startswith("puja/pauranika/") != b.startswith("puja/pauranika/"):
        return True                      # the Vedic / Paurāṇika twin
    return a.startswith("puja/") and b.startswith("puja/")

rows = [r for r in rows if not deliberate(r[5], r[6])]
print(f"{len(docs)} files compared, {len(rows)} pairs at or above {FLOOR}\n")
for j, ratio, ndiff, la, lb, a, b, diffs in rows:
    if ratio < FLOOR:
        continue
    print("=" * 78)
    print(f"similarity {ratio:.3f}  words {la}/{lb}  differing units {ndiff}")
    print("  A:", rel(a))
    print("  B:", rel(b))
    for x, y in diffs[:14]:
        print(f"     {' '.join(x) or '∅'}   ⇄   {' '.join(y) or '∅'}")
    if len(diffs) > 14:
        print(f"     … {len(diffs)-14} more differing runs")
    print()

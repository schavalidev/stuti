#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sync PROJECT_TRACKING.md's written-file counts to what is actually on disk.

Several sessions write to this corpus in parallel, so the counts drift constantly and
hand-reconciling them is wasted effort. Run this instead:

    python3 bin/recount.py          # report drift, change nothing
    python3 bin/recount.py --write  # rewrite the row counts and the TOTAL

Each table row names its folder in backticks. Rows nest — `rama/` contains `rama/sundarkand/`,
which has a row of its own — so every file is counted against the LONGEST row path that contains
it, exactly once. That makes the row counts add up to the TOTAL and to what is on disk; before
2026-09-08 they did not, and the nested folder was silently counted twice.
Anything not covered by a row is reported as untracked rather than silently absorbed —
that is the one case that still needs a human decision (a new genre folder, usually).
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOC = ROOT / "PROJECT_TRACKING.md"
ROW = re.compile(r'^(\|[^|\n]+\|\s*`([^`]+)`\s*\|\s*)(\d+)(\s*\|)', re.M)


def corpus_txt(d):
    """Every .txt that is corpus content.

    `bin/cache/` holds fetched sources and working transcriptions. It is
    gitignored and is not corpus text, but it is full of .txt, so counting it
    made every run report a mismatch and list its files as untracked.
    """
    return [f for f in d.rglob("*.txt") if "bin/cache" not in f.as_posix()]


def count(path):
    d = ROOT / path
    return len(corpus_txt(d)) if d.is_dir() else None

def main(write=False):
    text = DOC.read_text(encoding="utf-8")
    seen, drift, missing = [], [], []

    for m in ROW.finditer(text):
        if count(m.group(2)) is None: missing.append(m.group(2))
        else: seen.append(m.group(2))

    def own(p):
        return len([f for f in corpus_txt(ROOT / p)
                    if max((q for q in seen if str(f.relative_to(ROOT)).startswith(q)), key=len) == p])

    def sub(m):
        path, old = m.group(2), int(m.group(3))
        if path in missing: return m.group(0)
        n = own(path)
        if n != old: drift.append((path, old, n))
        return f"{m.group(1)}{n}{m.group(4)}"

    new = ROW.sub(sub, text)
    total = sum(own(p) for p in seen)
    on_disk = len(corpus_txt(ROOT))
    untracked = sorted({
        str(f.relative_to(ROOT)) for f in corpus_txt(ROOT)
        if not any(str(f.relative_to(ROOT)).startswith(p) for p in seen)
    })

    for p, o, n in drift: print(f"  {p:30s} {o:4d} -> {n:4d}")
    if not drift: print("  no drift in tracked rows")
    if missing: print("\nrows naming a path that is not a folder:"); [print("  " + p) for p in missing]
    if untracked:
        print(f"\nUNTRACKED — {len(untracked)} file(s) under no row (needs a decision, not a number):")
        for f in untracked[:20]: print("  " + f)
    print(f"\nrow sum {total}   disk {on_disk}   {'reconciled' if total == on_disk else 'MISMATCH'}")

    if write:
        new = re.sub(r'(\| \*\*TOTAL\*\* \| \| \*\*)\d+(\*\*)', rf'\g<1>{total}\g<2>', new)
        new = re.sub(r'Row-by-row written-count sum is \*\*\d+\*\*', f'Row-by-row written-count sum is **{total}**', new)
        DOC.write_text(new, encoding="utf-8")
        print("\nPROJECT_TRACKING.md updated.")
    return 0 if total == on_disk else 1

if __name__ == "__main__":
    sys.exit(main("--write" in sys.argv))

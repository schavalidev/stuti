#!/usr/bin/env python3
"""Put the marks of a Vedic akshara into the order the script expects.

Devanagari shaping wants a cluster's marks as: matra, then the spacing mark
(candrabindu / anusvara / visarga), then the Vedic tone mark. Several files in
this corpus hold the tone mark first -- `ऋच॒ः` as U+0952 U+0903 instead of
U+0903 U+0952. Every font then draws a dotted circle between the letter and the
visarga, because the sequence is not one the writing system can shape. This was
checked against four faces (Tiro, Krishna Sanskrit, Shobhika, Siddhanta): all
four show the ring on the wrong order and all four are clean on the right one,
so it is the text that is wrong, not the typography.

The reader already reorders each cluster as it draws it, but the text on file
stays wrong, so the ring returns anywhere else the line is shown -- search
results, the corpus build, the design prototype. This sweep fixes the files.

Only the order of two adjacent codepoints changes. No character is added,
removed or replaced, and the script refuses to write a file whose character
multiset would differ.

  python3 stotras/bin/svara_order_sweep.py            # report, change nothing
  python3 stotras/bin/svara_order_sweep.py --apply    # rewrite the files

Fetched sources under bin/cache are left alone: they are witnesses, and a
witness is kept as it was fetched.
"""
import argparse
import os
import re
import sys
import unicodedata

# A tone mark is a combining mark with a non-zero canonical combining class --
# udatta, anudatta, the Vedic tones -- and it must stand after the spacing sign.
# Taking the class from Unicode rather than listing ranges matters: U+1CEA
# VEDIC SIGN ANUSVARA BAHIRGOMUKHA sits in the Vedic Extensions block but is
# category Lo, a letter, and the corpus writes the nasal before a spirant as
# `ᳪं᳭` -- U+1CEA U+0902 U+1CED. A range covering 1CD0-1CFF reorders that
# correct sequence into a wrong one. It did, on the first run of this sweep.
# Virama (ccc 9) and nukta (ccc 7) are combining marks too, and they stand
# before a spacing sign quite legitimately: `ग्ं` and `भगवाल्ँ` are how this
# corpus spells the nasal in those places. So the class is the two attached
# classes a tone mark actually uses -- 220 below, 230 above -- and nothing else.
SPACING = "ँ-ः"  # candrabindu, anusvara, visarga -- all ccc 0
TONE = "".join(
    chr(cp)
    for cp in range(0x0900, 0xA900)
    if unicodedata.combining(chr(cp)) in (220, 230)
    and (0x0900 <= cp <= 0x097F or 0x1CD0 <= cp <= 0x1CFF or 0xA8E0 <= cp <= 0xA8FF)
)

WRONG = re.compile("([" + re.escape(TONE) + "])([" + SPACING + "])")

ROOTS = ["stotras", "design_handoff_stuti/app", "stuti-app/src"]
SKIP_DIRS = {".git", "node_modules", "dist", "build", "intermediates", "cache"}
EXTS = (".txt", ".md", ".json", ".js", ".jsx", ".ts", ".tsx", ".html", ".csv", ".tsv")


def walk(root):
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in sorted(files):
            if f.endswith(EXTS):
                yield os.path.join(base, f)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="rewrite the files")
    args = ap.parse_args()

    hits, total = [], 0
    for root in ROOTS:
        if not os.path.isdir(root):
            continue
        for path in walk(root):
            try:
                text = open(path, encoding="utf-8").read()
            except (UnicodeDecodeError, OSError):
                continue
            n = len(WRONG.findall(text))
            if n:
                hits.append((path, n, text))
                total += n

    if not hits:
        print("svara order: nothing to fix")
        return 0

    for path, n, _ in hits:
        print(f"  {n:4}  {path}")
    print(f"\n{total} mis-ordered sequences in {len(hits)} files")

    if not args.apply:
        print("(report only -- pass --apply to rewrite)")
        return 0

    written = 0
    for path, n, text in hits:
        fixed = WRONG.sub(r"\2\1", text)
        # a reorder and nothing else: same characters, same count of each
        if sorted(fixed) != sorted(text):
            print(f"REFUSED (characters would change): {path}", file=sys.stderr)
            return 1
        # and NFC must not quietly rewrite what we just ordered
        if unicodedata.normalize("NFC", fixed) != fixed:
            print(f"REFUSED (not NFC-stable): {path}", file=sys.stderr)
            return 1
        open(path, "w", encoding="utf-8").write(fixed)
        written += 1

    # read the counts back off disk rather than trusting the plan
    left = sum(len(WRONG.findall(open(p, encoding="utf-8").read())) for p, _, _ in hits)
    print(f"\nrewrote {written} files; {left} mis-ordered sequences remain on disk")
    return 0 if left == 0 else 1


if __name__ == "__main__":
    sys.exit(main())

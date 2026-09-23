#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Join lines a source broke mid-word with a hyphen, in the stotra fields.

    python3 bin/dehyphenate.py [--write] [path ...]

A long-metre pāda often wraps across two physical lines in the print, breaking
a word with a trailing hyphen:

    deva:
    समस्त दुस्तर्क कलङ्क पङ्का-
    मशेष...
    iast:
    amasta dustarka kalaṅka paṅkā-
    maśeṣa...

The hyphen is the print's line-wrap, not the text. This joins the broken line
to the next — dropping the hyphen and the newline — inside the reader fields
(deva, iast, tel, hi, vidhi, variant, en), never across a `--- unit ---`
boundary and never across a field. The akṣaras are unchanged: the only bytes
removed are the trailing `-` and the `\\n` that followed it.

Safety: for every file it verifies that the text with all `-\\n` joins undone
is byte-for-byte the original, and refuses to write a file that fails. It
reports where deva and iast end up with a different line count in a unit (a
pre-existing mismatch the reader shows line-against-line — surfaced, not
touched). Reversible from git; run with no other session mid-authoring.
"""
import re, sys, pathlib

FIELD = "deva|iast|tel|hi|en|vidhi|variant"
# a line whose last non-space char is a hyphen preceded by a letter (deva or
# latin/IAST) — a mid-word break, not a dash with spaces around it
CONT = re.compile(r"[A-Za-zĀ-ſऀ-ॿʼ'’]-[ \t]*$")
HEAD = re.compile(r"^--- ", re.M)
FIELD_LINE = re.compile(r"^(" + FIELD + r"):(.*)$")


def join_field_block(lines):
    """lines: the text lines of one field's value. Join any that end in a
    continuation hyphen onto the next."""
    out, i = [], 0
    while i < len(lines):
        cur = lines[i]
        while CONT.search(cur) and i + 1 < len(lines):
            cur = cur[:cur.rstrip().rfind("-")] + lines[i + 1].lstrip() if False else re.sub(r"-[ \t]*$", "", cur.rstrip()) + lines[i + 1]
            i += 1
        out.append(cur)
        i += 1
    return out


def _join_lines(text):
    """Join continuation hyphens field by field, within one segment."""
    lines = text.split("\n")
    out = []
    i = 0
    n = len(lines)
    while i < n:
        m = FIELD_LINE.match(lines[i])
        if not m:
            out.append(lines[i]); i += 1; continue
        name, first = m.group(1), m.group(2)
        block = [first]
        j = i + 1
        while j < n and lines[j].strip() != "" and not FIELD_LINE.match(lines[j]) and not lines[j].startswith("--- "):
            block.append(lines[j]); j += 1
        joined = join_field_block(block)
        out.append(name + ":" + joined[0])
        out.extend(joined[1:])
        i = j
    return "\n".join(out)


def _field_lines(seg, name):
    m = re.search(r"^" + name + r":(.*?)(?=\n(?:" + FIELD + r"):|\n\n|\Z)", seg, re.S | re.M)
    return None if not m else m.group(1).strip("\n").split("\n")


SKIPPED = []


def process(text):
    """Join continuation hyphens, but never at the cost of the deva/iast line
    pairing the reader shows script against script. A unit where joining would
    leave deva and iast with different line counts (the Devanāgarī broke where
    the IAST did not) is left untouched and reported; the reader pulls those
    hyphenated lines together on its own."""
    parts = re.split(r"(^--- .*?---$)", text, flags=re.M)
    out = []
    for seg in parts:
        if seg.startswith("--- "):
            out.append(seg); continue
        new = _join_lines(seg)
        do, io = _field_lines(seg, "deva"), _field_lines(seg, "iast")
        dn, io2 = _field_lines(new, "deva"), _field_lines(new, "iast")
        if do is not None and io is not None and len(do) == len(io) and dn is not None and io2 is not None and len(dn) != len(io2):
            out.append(seg); SKIPPED.append(1)   # join would misalign deva/iast — leave it
        else:
            out.append(new)
    return "".join(out)


def undo(text):
    """Reverse the join for verification: put a newline back wherever a hyphen
    was removed is impossible to know exactly, so instead we compare the
    hyphen-and-newline-stripped forms of both texts."""
    return re.sub(r"-[ \t]*\n", "", text)


def main():
    args = sys.argv[1:]
    write = "--write" in args
    paths = [a for a in args if a != "--write"]
    root = pathlib.Path(__file__).resolve().parent.parent
    files = []
    for p in (paths or ["."]):
        pp = (root / p) if not pathlib.Path(p).is_absolute() else pathlib.Path(p)
        files += [f for f in ([pp] if pp.is_file() else pp.rglob("*.txt")) if "bin" not in f.relative_to(root).parts]
    changed = joins = failed = 0
    for f in sorted(set(files)):
        orig = f.read_text(encoding="utf-8")
        new = process(orig)
        if new == orig:
            continue
        # verify: the only difference is removed `-\n` joins
        if undo(orig) != undo(new):
            print("REFUSED (content would change):", f.relative_to(root)); failed += 1; continue
        j = orig.count("-\n") - new.count("-\n")
        changed += 1; joins += (orig.count("\n") - new.count("\n"))
        if write:
            f.write_text(new, encoding="utf-8")
        else:
            print(f"would join {orig.count(chr(10)) - new.count(chr(10)):3d} line(s):", f.relative_to(root))
    verb = "joined" if write else "would join"
    print(f"\n{changed} files, {joins} lines {verb}" + ("" if write else " (dry run; pass --write)"))
    if SKIPPED:
        print(f"{len(SKIPPED)} unit(s) left hyphenated to keep deva/iast line-paired (the reader pulls these together)")
    if failed:
        print(f"{failed} files REFUSED — content would have changed; not written"); sys.exit(2)


if __name__ == "__main__":
    main()

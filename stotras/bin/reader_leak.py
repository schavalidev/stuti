#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Take the sourcing out of the verse fields a reciter reads.

**Standing rule (user, 2026-09-12): the reader must never be shown the source
information.** `bin/reader_view.py --audit` enforces that for the header fields.
This does the same job for the verse fields — `en`, `tel`, `hi`, `vidhi` — where
translators wrote collation notes into the meaning itself: "the Gītā Press page
prints the daṇḍa here without the space", "confirmed by both vignanam.org and
sanskritdocuments.org's itx". The 2026-10-17 audit counted 183 such files and
left them, because a file another session wrote is not ours to edit. The user
lifted that for this job on 2026-10-20, the corpus having been ruled published
whole.

    python3 bin/reader_leak.py --list              # every place, classified
    python3 bin/reader_leak.py --propose [n]       # show the tail cuts it would make
    python3 bin/reader_leak.py --apply             # make them
    python3 bin/reader_leak.py --hard              # the ones a person must rewrite

Three shapes, and only one of them is safe to do by machine:

  **tail** — the field ends in one or more whole sentences that are entirely about
  sources. Cutting them leaves the meaning untouched, so `--apply` does it.
  **interior** — the sourcing sits inside a sentence that also carries meaning,
  usually in a bracket. The sentence has to be rewritten, so these are left for
  `--hard`.
  **whole** — every sentence in the field is about sources. Something has to be
  written in its place, so these are left for `--hard` too.

Each field is one line in the file, which is what makes this tractable: a cut is
a line rewritten, never a span across lines. `--apply` refuses a cut that would
empty a field or that does not leave the kept text a prefix of the old, so it
cannot quietly lose a translation.
"""
import re, sys, pathlib, collections

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import reader_view as rv

# The strong terms only. "the source" and "witness" are left out on purpose: they
# are ordinary words in a translation ("the source of all learning", "the witness
# of every deed"), and including them turned real meaning into false positives.
STRONG = re.compile(
    r"https?://|\bwww\.|\.com\b|\.org\b|stotranidhi|sanskritdocuments|wikisource|\bGRETIL\b"
    r"|archive\.org|vignanam|vedicscriptures|muktabodha|\bTITUS\b|greenmesg|drikpanchang"
    r"|greatindian|Gītā Press|Gita Press|Gorakhpur|\bGP\b|\bSD\b"
    r"|\bOCR\b|\bcollat(?:e|ed|es|ion)\b|\bbase[ -]text\b|critical edition|\bitx\b|\bITRANS\b"
    r"|\brecension\b|\bthe print\b|\bprints\b|\bprinted edition\b|\bcross-check\b",
    re.I)

FIELDS = ("en", "tel", "hi", "vidhi")
# Devanāgarī daṇḍa and Telugu both end sentences with the same marks the Latin
# text does, plus `।`. A bracket or quote may close after the stop.
SPLIT = re.compile(r'(?<=[.।!?])["”\')\]]*\s+')


def sentences(value):
    return [s for s in SPLIT.split(value.strip()) if s.strip()]


def classify(value):
    """Return (kind, kept, cut) for one field value."""
    ss = sentences(value)
    flagged = [i for i, s in enumerate(ss) if STRONG.search(s)]
    if not flagged:
        return None, value, ""
    if len(flagged) == len(ss):
        return "whole", "", value
    first = min(flagged)
    if first == len(ss) - len(flagged):          # the flagged run is the tail
        kept = " ".join(ss[:first]).strip()
        # A full stop inside a bracket is not a sentence end. Splitting there
        # leaves the kept text with an unclosed bracket and the cut carrying its
        # closing half, so the note is really inside the sentence: hand it over.
        if kept.count("(") != kept.count(")") or kept.count("[") != kept.count("]"):
            return "interior", value, ""
        return "tail", kept, " ".join(ss[first:]).strip()
    return "interior", value, ""


FIELD_LINE = re.compile(r"^(deva|iast|en|tel|hi|vidhi|variant):(.*)$")


def blocks(path):
    """Yield (field, first line index, last line index, value) for one file.

    A field's value may sit on its own line or run over several, so a block ends
    at the next field marker, at any `---` rule, or at the end of the file. The
    rule bound is what matters: `reader_view.parse` has no such bound, and in the
    sahasranāma files its last unit swallows the whole `--- names ---` table,
    so a cut made against its value deletes a thousand lines of names. That
    happened once, on 2026-10-20, and the revert is why this reads lines.
    """
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    i = 0
    while i < len(lines):
        m = FIELD_LINE.match(lines[i])
        if not m:
            i += 1
            continue
        field, rest = m.group(1), m.group(2).strip()
        j = i + 1
        while j < len(lines) and not FIELD_LINE.match(lines[j]) and not lines[j].startswith("---"):
            j += 1
        body = [rest] if rest else []
        body += [l for l in lines[i + 1:j]]
        value = "\n".join(body).strip()
        yield field, i, j - 1, value
        i = j


def places():
    """Every (path, first line, last line, field, kind, old, kept, cut)."""
    for path in sorted(ROOT.rglob("*.txt")):
        for field, a, b, value in blocks(path):
            if field not in FIELDS or not value or not STRONG.search(value):
                continue
            kind, kept, cut = classify(value)
            if kind:
                yield path, a, b, field, kind, value, kept, cut


def apply_cuts():
    """Cut the flagged tail off each block, keeping the block's own line shape.

    The kept text is always a prefix of the old text, so the cut is a suffix:
    whole lines that fall inside it go, and a line it only partly covers is
    trimmed. A cut that would empty the field, or that is not a clean prefix, is
    refused rather than guessed at.
    """
    by_file = collections.defaultdict(list)
    for path, a, b, field, kind, old, kept, cut in places():
        if kind == "tail":
            by_file[path].append((a, b, field, old, kept))
    changed = skipped = 0
    for path, rows in sorted(by_file.items()):
        lines = path.read_text(encoding="utf-8").splitlines()
        for a, b, field, old, kept in sorted(rows, reverse=True):
            if not kept.strip() or not old.startswith(kept):
                skipped += 1
                continue
            head = f"{field}:"
            first = lines[a][len(head):].strip()
            body = ([first] if first else []) + lines[a + 1:b + 1]
            rebuilt = "\n".join(body).strip()
            if rebuilt != old:
                skipped += 1           # the block moved under us: leave it
                continue
            keep_lines, remaining = [], kept
            for line in body:
                if not remaining:
                    break
                if len(remaining) >= len(line.strip()) and remaining.startswith(line.strip()):
                    keep_lines.append(line)
                    remaining = remaining[len(line.strip()):].lstrip("\n ")
                else:
                    keep_lines.append(remaining)
                    remaining = ""
            if not keep_lines:
                skipped += 1
                continue
            if first:
                lines[a:b + 1] = [f"{head} {keep_lines[0].strip()}"] + keep_lines[1:]
            else:
                lines[a:b + 1] = [head] + keep_lines
            changed += 1
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return changed, skipped


def main(args):
    mode = args[0] if args else "--list"
    if mode == "--list":
        counts = collections.Counter()
        files = collections.Counter()
        for p, a, b, f, kind, *_ in places():
            counts[kind] += 1
            files[kind] += 0
            files[str(p)] += 1
        total = sum(counts.values())
        print(f"{total} places in {len([k for k in files if k.endswith('.txt')])} files")
        for kind, c in counts.most_common():
            print(f"  {kind:9} {c}")
    elif mode == "--propose":
        limit = int(args[1]) if len(args) > 1 else 25
        shown = 0
        for p, a, b, f, kind, old, kept, cut in places():
            if kind != "tail":
                continue
            shown += 1
            if shown > limit:
                break
            print(f"\n[{p} line {a + 1} {f}]")
            print(f"  keep: …{kept[-110:]}")
            print(f"  cut : {cut[:220]}")
    elif mode == "--hard":
        for p, a, b, f, kind, old, kept, cut in places():
            if kind == "tail":
                continue
            print(f"\n[{kind} {p} line {a + 1} {f}]\n{old}")
    elif mode == "--apply":
        changed, skipped = apply_cuts()
        print(f"cut {changed} tails; left {skipped} alone")
    else:
        print(__doc__)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

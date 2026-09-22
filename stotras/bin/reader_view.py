#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Give the reader app the fields a reader may see, and nothing else.

**Standing rule (user, 2026-09-12): the reader must never be shown the source information.**
Where a text came from, which editions were compared, who transliterated it, what was corrected —
all of that is for whoever works on the corpus. A person reciting a stotra sees the text, and the
plain matter that identifies it.

The corpus keeps everything in one plain-text file with no marker separating the two kinds of
field, so the split has to live somewhere. It lives here.

    python3 bin/reader_view.py <file>       # the reader's view of one file
    python3 bin/reader_view.py --audit      # every place a reader field still carries sourcing

`reader()` is the function to port into the app. It works by allow-list: a field it does not know
is withheld, so a new header field added later cannot leak by default — `--audit` reports those
under "unknown fields" so they can be classified deliberately.
"""
import re, sys, pathlib, json

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Fields the reader may see. Everything else in a file's header is withheld.
READER_FIELDS = [
    "Title", "Devanāgarī", "Telugu", "Language", "Type",
    "Author", "Blurb", "Sections", "Verse count", "Name count", "Unit count",
]
# Withheld, and named here so `--audit` can tell a known editorial field from a new one.
EDITORIAL_FIELDS = [
    "Source / recension", "Recension note", "Recension / śākhā", "Recension / paddhati",
    "Independent collation", "Not collated", "Not independently collated", "Accent",
    "Note", "What it does not have", "Disambiguation for the reviewer",
    "Bracketed readings",
]
VERSE_FIELDS = ["deva", "iast", "en", "tel", "hi", "vidhi", "variant"]

# Words that mean a line is talking about where the text came from.
SOURCING = re.compile(
    r"https?://|\bwww\.|\.com\b|\.org\b|stotranidhi|sanskritdocuments|wikisource|\bGRETIL\b"
    r"|archive\.org|vignanam|vedicscriptures|muktabodha|\bTITUS\b|Gītā Press|Gita Press|Gorakhpur"
    r"|\bdjvu\b|\bOCR\b|transliterated by|proofread|\bcollat(?:e|ed|ion)\b|\bwitness(?:es)?\b"
    r"|\brecension\b|\bbase[ -]text\b|critical edition|editorial lineage|\bitx\b"
    r"|\bpage images\b|\bPDF\b|\bthe source\b|\bthe print\b|\bsource page\b",
    re.I)

VERSE_HEAD = re.compile(r"^--- verse (\d+|none)(?: \| section: ([^-]*?))? ---$", re.M)


def parse(text):
    """Split one corpus file into its header fields and its numbered units.

    Units are marked `--- verse N ---`, and in some folders `--- unit N ---` or
    `--- passage N ---`. Header fields are recognised by name: the header of a long file
    contains prose with colons in it, so anything else that looks like `Word:` is not a field.
    """
    head = re.split(r"^--- (?:verse|unit|passage) ", text, maxsplit=1, flags=re.M)[0]
    known = READER_FIELDS + EDITORIAL_FIELDS
    fields = {}
    for name in known:
        m = re.search(rf"^{re.escape(name)}: ?(.*?)(?=\n(?:{'|'.join(re.escape(k) for k in known)}): |\n\n|\Z)",
                      head, re.S | re.M)
        if m:
            fields[name] = m.group(1).strip()
    units = []
    # `\d+|none` — a unit the source leaves unnumbered is written "verse none", and
    # 929 of them across 428 files were being dropped here, 21 files rendering empty.
    parts = re.split(r"^--- (?:verse|unit|passage) (?:\d+|none)[^\n]*---$", text, flags=re.M)[1:]
    for p in parts:
        u = {}
        for m in re.finditer(r"^(deva|iast|en|tel|hi|vidhi|variant):[ \n](.*?)(?=\n(?:deva|iast|en|tel|hi|vidhi|variant):|\Z)",
                             p, re.S | re.M):
            u[m.group(1)] = m.group(2).strip()
        if u:
            units.append(u)
    return fields, units, head


def reader(text):
    """The reader's view: allow-listed header fields, plus the verses."""
    fields, units, _ = parse(text)
    return {
        "fields": {k: fields[k] for k in READER_FIELDS if k in fields},
        "units": units,
    }


def audit():
    """Report every reader field that still carries sourcing, and any unrecognised field name."""
    leaks, unknown = [], {}
    files = sorted(ROOT.rglob("*.txt"))
    known = set(READER_FIELDS + EDITORIAL_FIELDS)
    for p in files:
        rel = str(p.relative_to(ROOT))
        fields, _, head = parse(p.read_text(encoding="utf-8", errors="replace"))
        for name in READER_FIELDS:
            if name in fields and SOURCING.search(fields[name]):
                hit = SOURCING.search(fields[name]).group(0)
                leaks.append((rel, name, hit, fields[name][:88]))
        for m in re.finditer(r"^([A-Z][A-Za-z /]{2,28}): ", head, re.M):
            if m.group(1) not in known:
                unknown.setdefault(m.group(1), set()).add(rel)
    print(f"scanned {len(files)} files")
    print(f"\nreader fields carrying source information: {len(leaks)} "
          f"occurrences in {len({f for f, *_ in leaks})} files")
    by_field = {}
    for f, name, hit, value in leaks:
        by_field.setdefault(name, []).append((f, hit, value))
    for name, rows in sorted(by_field.items(), key=lambda kv: -len(kv[1])):
        print(f"\n  {name}: {len(rows)}")
        for f, hit, value in rows[:5]:
            print(f"    {f}\n      [{hit}] {value}")
        if len(rows) > 5:
            print(f"    … and {len(rows) - 5} more")
    unknown = {k: v for k, v in unknown.items() if len(v) >= 3}
    if unknown:
        print("\npossible unrecognised field names (withheld by default — classify or ignore):")
        for name, fs in sorted(unknown.items(), key=lambda kv: -len(kv[1])):
            print(f"  {name}: {len(fs)} files, e.g. {sorted(fs)[0]}")
    return 1 if leaks else 0


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
    elif args[0] == "--audit":
        sys.exit(audit())
    else:
        print(json.dumps(reader(pathlib.Path(args[0]).read_text(encoding="utf-8")),
                         ensure_ascii=False, indent=1))

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the corpus the app fetches: one JSON per text, and an index.

    python3 bin/build_corpus.py                 # audit, then build corpus/ at the repo root
    python3 bin/build_corpus.py --publish-all   # list every text, not only those marked Published:
    python3 bin/build_corpus.py --out DIR       # somewhere else
    python3 bin/build_corpus.py --check         # build nothing; report what would be listed

Why this exists: the reader's texts are compiled into the app, so a new text
is a deploy and an APK, and a deploy makes every device fetch the whole app
again. This turns each corpus file into a small JSON the app fetches the first
time a text is opened (stuti-app/docs/corpus-delivery.md has the whole shape).

Everything the reader may see goes through reader_view.py's allow-list, so a
source note can never reach a device. The build refuses to write while
`reader_view.py --audit` reports a leak.

Output:
    corpus/index.json            the catalogue, one row per listed text
    corpus/t/<id>.<hash>.json    one file per text, immutable by name

`id` is the file's folder path plus its leading number (guru/19), so a rename
of the descriptive tail does not move the text. A file with no leading number
keeps its whole stem.
"""
import re, sys, json, hashlib, pathlib, datetime, argparse

ROOT = pathlib.Path(__file__).resolve().parent.parent          # stotras/
REPO = ROOT.parent
sys.path.insert(0, str(ROOT / "bin"))
import reader_view as RV

# top-level folder -> the app's shelf id (stuti-data.ts `deities`)
SHELF = {
    "ganesha": "ganesha", "shiva": "shiva", "devi": "devi", "vishnu": "vishnu",
    "krishna": "vishnu", "rama": "vishnu", "narasimha": "vishnu", "venkateswara": "vishnu",
    "bhagavadgita": "vishnu", "Subrahmanya": "subrahmanya", "guru": "guru",
    "dattatreya": "guru", "hanuman": "hanuman", "pitr": "pitr", "ganga": "nadi",
    "navagraha": "navagraha", "shani": "navagraha", "ayyappa": "itara", "brahma": "itara",
    "kubera": "itara", "misc_vedic": "itara", "veda": "itara", "puja": "itara", "vidhi": "itara",
}
LANG = {"sanskrit": "sa", "hindi": "hi", "awadhi": "awa", "braj": "bra", "tamil": "ta", "telugu": "te"}

HEAD = re.compile(r"^--- (?:(verse|unit|passage) (\d+(?:\([^)]*\))?|none)|(names)|(viniyoga) \(unnumbered\))"
                  r"(?: \| section: (.*?))? ---$", re.M)
FIELD = re.compile(r"^(deva|iast|en|tel|hi|vidhi|variant):[ \n](.*?)(?=\n(?:deva|iast|en|tel|hi|vidhi|variant):|\Z)", re.S | re.M)


def units_of(text):
    """Every unit in file order, with its head kind, number and section tag.
    reader_view.parse() drops `names` tables and unnumbered viniyogas; the
    reader needs both, so the split is done again here, one shape wider."""
    heads = list(HEAD.finditer(text))
    out = []
    for i, m in enumerate(heads):
        body = text[m.end():heads[i + 1].start() if i + 1 < len(heads) else len(text)]
        kind = m.group(1) or m.group(3) or m.group(4)
        num = m.group(2)
        sec = (m.group(5) or "").strip() or None
        if kind == "names":
            rows = []
            for line in body.strip().splitlines():
                cells = [c.strip() for c in line.split("|")]
                if len(cells) >= 3 and cells[0].isdigit():
                    keys = ["n", "deva", "iast", "en", "tel", "hi"]
                    rows.append({k: v for k, v in zip(keys, cells) if v})
            out.append({"kind": "names", "sec": sec, "names": rows})
            continue
        u = {}
        for f in FIELD.finditer(body):
            u[f.group(1)] = f.group(2).strip()
        if not u:
            continue
        u["_n"] = None if num in (None, "none") else num
        u["_sec"] = sec
        out.append({"kind": kind or "verse", "unit": u})
    return out


def first_word(v):
    return re.split(r"[\s,.;:(—–-]", v.strip(), 1)[0].lower() if v else ""


def text_id(p):
    rel = p.relative_to(ROOT).with_suffix("")
    m = re.match(r"^(\d+)_", rel.name)
    return str(rel.parent / m.group(1)) if m else str(rel)


def build_one(p, text, id_override=None):
    f, _, head = RV.parse(text)
    fields = {k: f[k] for k in RV.READER_FIELDS if k in f}
    # build-only fields: read here, never emitted to the reader
    shelves = [s.strip() for s in re.search(r"^Shelves: ?(.*)$", head, re.M).group(1).split(",")] \
        if re.search(r"^Shelves: ?", head, re.M) else []
    published = re.search(r"^Published: ?(\S+)", head, re.M)

    top = p.relative_to(ROOT).parts[0]
    deity = [SHELF.get(top, "itara")] + [s for s in shelves if s and s not in (SHELF.get(top),)]
    lang = LANG.get(first_word(fields.get("Language", "")), "sa")
    tw = first_word(fields.get("Type", ""))
    typ = "vidhi" if tw == "vidhi" else "sarga" if tw == "epic" else "names" if "Name count" in fields and "Verse count" not in fields else "stotra"

    sections, sec_index, verses, names = [], {}, [], []
    cur = 0
    for u in units_of(text):
        sec = u.get("sec") if u["kind"] == "names" else u["unit"]["_sec"]
        if sec:
            if sec not in sec_index:
                sec_index[sec] = len(sections)
                sections.append({"deva": sec} if re.search(r"[ऀ-ॿ]", sec) else {"roman": sec})
            cur = sec_index[sec]
        if u["kind"] == "names":
            names.extend(u["names"])
            if u["names"]: typ = typ if typ == "vidhi" else "names"
            continue
        v = {k: u["unit"][k] for k in RV.VERSE_FIELDS if k in u["unit"]}
        v["s"] = cur
        v["n"] = u["unit"]["_n"]
        verses.append(v)

    doc = {
        "id": id_override or text_id(p),
        "title": fields.get("Title", p.stem),
        "deva": fields.get("Devanāgarī", ""),
        "tel": fields.get("Telugu", ""),
        "author": fields.get("Author", ""),
        "blurb": fields.get("Blurb", ""),
        "lang": lang, "type": typ,
        "sections": sections,
        "verses": verses,
    }
    if names: doc["names"] = names
    canon = json.dumps(doc, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    h = hashlib.sha1(canon.encode("utf-8")).hexdigest()[:8]
    doc["hash"] = h
    body = json.dumps(doc, ensure_ascii=False, separators=(",", ":"))
    row = {
        "id": doc["id"], "deity": deity, "title": doc["title"], "deva": doc["deva"], "tel": doc["tel"],
        "author": doc["author"], "lang": lang, "type": typ,
        "units": len(verses) + len(names), "sections": sections,
        "hash": h, "bytes": len(body.encode("utf-8")),
        "file": "t/" + doc["id"].replace("/", ".") + "." + h + ".json",
        "published": published.group(1) if published else None,
    }
    return row, body


def leaks_in(row, doc):
    """The same sourcing regexp, run over what was actually built."""
    hits = []
    for k in ("title", "deva", "tel", "author", "blurb"):
        v = (doc if k == "blurb" else row).get(k, "")
        if v and RV.SOURCING.search(v): hits.append((row["id"], k, RV.SOURCING.search(v).group(0)))
    for s in row["sections"]:
        for v in s.values():
            if RV.SOURCING.search(v): hits.append((row["id"], "section", RV.SOURCING.search(v).group(0)))
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(REPO / "corpus"))
    ap.add_argument("--publish-all", action="store_true", help="list every text, not only those marked Published:")
    ap.add_argument("--check", action="store_true", help="build nothing; report")
    ap.add_argument("--no-audit", action="store_true", help="list texts even where a reader field names a source (never for a real publish)")
    a = ap.parse_args()

    # The gate: the same sourcing regexp reader_view.py --audit uses, run over
    # the fields this build actually emits (title, deva, tel, author, blurb,
    # sections). A text that fails is built and withheld from the index, and
    # named, so the corpus can be mended without the rest waiting.

    files = sorted(p for p in ROOT.rglob("*.txt") if "bin" not in p.relative_to(ROOT).parts)
    rows, bodies, ids, withheld, empty, leaks = [], {}, {}, [], [], []
    for p in files:
        text = p.read_text(encoding="utf-8", errors="replace")
        row, body = build_one(p, text)
        if row["units"] == 0:
            empty.append(str(p.relative_to(ROOT))); continue
        if row["id"] in ids:
            # two files share a folder and a number: this one keeps its whole stem
            row, body = build_one(p, text, id_override=str(p.relative_to(ROOT).with_suffix("")))
        ids[row["id"]] = str(p.relative_to(ROOT))
        lk = leaks_in(row, json.loads(body))
        bodies[row["file"]] = body
        if lk and not a.no_audit:
            leaks += lk; continue
        if row["published"] or a.publish_all:
            rows.append(row)
        else:
            withheld.append(row["id"])

    print(f"{len(files)} files; {len(rows)} listed, {len(withheld)} withheld (no Published: field), {len(empty)} with no units")
    if empty:
        for e in empty[:10]: print("  no units:", e)
    by = {}
    for r in rows: by[r["deity"][0]] = by.get(r["deity"][0], 0) + 1
    print("  by shelf:", ", ".join(f"{k} {v}" for k, v in sorted(by.items(), key=lambda kv: -kv[1])))
    total = sum(len(b.encode("utf-8")) for b in bodies.values())
    print(f"  {len(bodies)} text files, {total / 1e6:.1f} MB; index rows {len(rows)}")
    if leaks:
        print(f"\nwithheld for a reader field that names a source ({len({l[0] for l in leaks})} texts; mend the header and rebuild):")
        for l in leaks[:40]: print("  ", *l)
        if len(leaks) > 40: print("   … and", len(leaks) - 40, "more")
    if a.check:
        return

    out = pathlib.Path(a.out)
    (out / "t").mkdir(parents=True, exist_ok=True)
    written = 0
    for file, body in bodies.items():
        fp = out / file
        if not fp.exists():
            fp.write_text(body, encoding="utf-8"); written += 1
    index = {"v": 1, "built": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "texts": rows}
    (out / "index.json").write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    ib = (out / "index.json").stat().st_size
    print(f"wrote {written} new text files under {out / 't'}; index.json {ib / 1e3:.0f} KB")
    if withheld and not a.publish_all:
        print(f"withheld from the index (built, not listed): {len(withheld)} — add `Published: <date>` to a header, or pass --publish-all")


if __name__ == "__main__":
    main()

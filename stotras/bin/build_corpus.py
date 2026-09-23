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
import re, sys, json, hashlib, pathlib, datetime, argparse, unicodedata

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


# The reader's genre badge and the `type` lens. Ported verbatim from the app's
# typeOf() (stuti-data.ts) so moving the derivation here changes no grouping;
# the value now lives in the index instead of being guessed at runtime, and a
# file may override it with a `Genre:` header. See docs/corpus-presentation.md.
GENRES = {"Sahasranāma", "Nāmāvali", "Aṣṭakam", "Pañcaratna", "Kavaca", "Sūkta",
          "Tarpaṇa", "Daṇḍaka", "Dhyāna-śloka", "Vandanā", "Stotra", "Kṛti",
          "Tālam", "Gītā", "Upaniṣad"}
SAKHAS = {"madhyandina", "taittiriya", "kanva", "rigveda"}


def genre_of(title):
    n = "".join(c for c in unicodedata.normalize("NFD", title or "") if unicodedata.category(c) != "Mn").lower()
    if "sahasran" in n: return "Sahasranāma"
    if any(x in n for x in ("ottara", "namavali", "satanam")): return "Nāmāvali"
    if "ashtakam" in n or "astakam" in n: return "Aṣṭakam"
    if "pancaratn" in n: return "Pañcaratna"
    if "kavacam" in n: return "Kavaca"
    if "suktam" in n: return "Sūkta"
    if "dandakam" in n: return "Daṇḍaka"
    if "gita" in n: return "Gītā"
    if "upanisad" in n: return "Upaniṣad"
    if "dhyana" in n: return "Dhyāna-śloka"
    if "vatapi ganapatim" in n or "mahaganapatim manasa smarami" in n: return "Kṛti"
    if "talam" in n: return "Tālam"
    return "Stotra"


def text_id(p):
    rel = p.relative_to(ROOT).with_suffix("")
    m = re.match(r"^(\d+)_", rel.name)
    return str(rel.parent / m.group(1)) if m else str(rel)


def build_one(p, text, id_override=None):
    f, _, head = RV.parse(text)
    fields = {k: f[k] for k in RV.READER_FIELDS if k in f}
    # build-only fields: read here, never emitted to the reader
    shelf_m = re.search(r"^Shelves: ?(.*)$", head, re.M)
    shelves = [s.strip() for s in shelf_m.group(1).split(",")] if shelf_m else []
    published = re.search(r"^Published: ?(\S+)", head, re.M)
    # step-2 presentation fields (docs/corpus-presentation.md); all optional
    hdr = lambda name: (m.group(1).strip() if (m := re.search(r"^" + name + r": ?(.*)$", head, re.M)) else "")
    parts = p.relative_to(ROOT).parts
    top = parts[0]
    # Shelves is authority when present; an explicit "none"/"-"/"" means no
    # deity shelf (the generic vidhānam), which is a valid, tile-less text.
    if shelf_m:
        if " ".join(shelves).strip().lower() in ("", "none", "-"):
            deity = []
        else:
            deity = [SHELF.get(top, "itara")] + [s for s in shelves if s and s != SHELF.get(top)]
    else:
        deity = [SHELF.get(top, "itara")]
    genre = hdr("Genre") or genre_of(fields.get("Title", p.stem))
    form = hdr("Form")
    sett = hdr("Set")
    sort = hdr("Sort")
    # śākhā is carried by the folder split for the nitya-karma (vidhi/, veda/)
    sakha = hdr("Sakha") or (parts[1] if top in ("vidhi", "veda") and len(parts) > 1 and parts[1] in SAKHAS else "")
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
    # opening line (IAST only), for first-line search without a fetch; the
    # matcher folds to IAST anyway, so one compact string covers it
    first = (verses[0].get("iast", "") if verses else "").split("\n")[0][:80]
    # The index row is the catalogue: list-only, no inline sections (they live
    # in the text file). Slimming this is what keeps index.json small as the
    # corpus grows (docs/corpus-presentation.md).
    row = {
        "id": doc["id"], "deity": deity, "title": doc["title"], "deva": doc["deva"], "tel": doc["tel"],
        "author": doc["author"], "lang": lang, "type": typ, "genre": genre,
        "units": len(verses) + len(names),
        "hash": h, "bytes": len(body.encode("utf-8")),
        "file": "t/" + doc["id"].replace("/", ".") + "." + h + ".json",
        "published": published.group(1) if published else None,
    }
    if form: row["form"] = form
    if sett: row["set"] = sett
    if sort: row["sort"] = int(sort) if sort.lstrip("-").isdigit() else sort
    if sakha: row["sakha"] = sakha
    if first: row["first"] = first
    return row, body


def leaks_in(row, doc):
    """The same sourcing regexp, run over what was actually built."""
    hits = []
    for k in ("title", "deva", "tel", "author", "blurb"):
        v = (doc if k == "blurb" else row).get(k, "")
        if v and RV.SOURCING.search(v): hits.append((row["id"], k, RV.SOURCING.search(v).group(0)))
    for s in doc.get("sections", []):
        for v in s.values():
            if RV.SOURCING.search(v): hits.append((row["id"], "section", RV.SOURCING.search(v).group(0)))
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(REPO / "corpus"))
    ap.add_argument("--publish-all", action="store_true", help="list every text, not only those marked Published:")
    ap.add_argument("--check", action="store_true", help="build nothing; report")
    ap.add_argument("--no-audit", action="store_true", help="list texts even where a reader field names a source (never for a real publish)")
    ap.add_argument("--write-ids", action="store_true", help="after the gate passes, rewrite corpus-ids.json to the current ids (for an intended new text, tail rename or migrated retirement)")
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

    # ---- identity gate (stuti-app/docs/corpus-identity.md) ----
    # The id (folder + leading number) is frozen identity. This gate fails loud
    # so a renumber or refile can never quietly orphan a reader's saved state,
    # and no listed row can ship without a servable file.
    def load_json(p, default):
        return json.loads(p.read_text(encoding="utf-8")) if p.exists() else default
    REDIR_PATH = ROOT / "corpus-redirects.json"
    IDS_PATH = ROOT / "corpus-ids.json"
    redirs = load_json(REDIR_PATH, [])
    redir_from = {e.get("from") for e in redirs if e.get("from")}
    fail = []
    for e in redirs:
        f, t = e.get("from"), e.get("to")
        if not f: fail.append(f"redirect entry has no `from`: {e}")
        elif f in ids: fail.append(f"redirect `from` still lives in the corpus (retire the file first): {f}")
        if t and t not in ids: fail.append(f"redirect `to` is not a live id: {t}  (from {f})")
    manifest = load_json(IDS_PATH, None)
    if manifest is not None:
        for old_id in manifest:
            if old_id not in ids and old_id not in redir_from:
                fail.append(f"id vanished with no redirect (a renumber/refile would orphan reader state): {old_id}  (was {manifest[old_id]})")
    for r in rows:
        if r["file"] not in bodies:
            fail.append(f"listed row has no built file: {r['id']} -> {r['file']}")
        if not r["file"].endswith("." + r["hash"] + ".json"):
            fail.append(f"row hash does not match its file name: {r['id']}")
        if r.get("genre") not in GENRES:
            fail.append(f"unknown genre {r.get('genre')!r}: {r['id']}  (allowed: {', '.join(sorted(GENRES))})")
        if r.get("sakha") and r["sakha"] not in SAKHAS:
            fail.append(f"unknown śākhā {r['sakha']!r}: {r['id']}")
    if fail:
        print(f"\nIDENTITY GATE FAILED ({len(fail)}):")
        for m in fail[:40]: print("  ✗", m)
        if len(fail) > 40: print("   … and", len(fail) - 40, "more")
        sys.exit(2)
    if a.write_ids:
        IDS_PATH.write_text(json.dumps({k: ids[k] for k in sorted(ids)}, ensure_ascii=False, indent=0), encoding="utf-8")
        if not REDIR_PATH.exists():
            REDIR_PATH.write_text("[]\n", encoding="utf-8")
        print(f"wrote {IDS_PATH.name} ({len(ids)} ids)")

    if a.check:
        return

    out = pathlib.Path(a.out)
    (out / "t").mkdir(parents=True, exist_ok=True)
    written = 0
    for file, body in bodies.items():
        fp = out / file
        if not fp.exists():
            fp.write_text(body, encoding="utf-8"); written += 1
    index = {"v": 1, "schema": 2, "built": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "texts": rows}
    (out / "index.json").write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (out / "redirects.json").write_text(json.dumps(redirs, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    ib = (out / "index.json").stat().st_size
    print(f"wrote {written} new text files under {out / 't'}; index.json {ib / 1e3:.0f} KB")
    if withheld and not a.publish_all:
        print(f"withheld from the index (built, not listed): {len(withheld)} — add `Published: <date>` to a header, or pass --publish-all")


if __name__ == "__main__":
    main()

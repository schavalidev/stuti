#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit viewer for the corpus — read one text at a time, script beside script, meaning beside meaning.

    python3 bin/audit.py            # serve on http://127.0.0.1:8765
    python3 bin/audit.py --port N
    python3 bin/audit.py --checks   # run the checks over every file and print them

It is a reading and checking tool, not a reader app: it shows the editorial fields too, and marks
them plainly as withheld from the reader. Parsing is `bin/reader_view.py`'s, so what is shown here
as reader matter is exactly what the app would get.
"""
import json, sys, re, pathlib, http.server, socketserver, urllib.parse

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import reader_view as rv
try:
    from dev2tel import dev2tel
except Exception:
    dev2tel = None

ROOT = pathlib.Path(__file__).resolve().parent.parent
UI = pathlib.Path(__file__).resolve().parent / "audit_ui"

ACCENTS = "॒॑᳚᳛॓॔ᳪ᳭᳓"
COUNT_FIELDS = ("Verse count", "Name count", "Unit count")


# The corpus marks a unit in more ways than reader_view.parse knows: besides `--- verse N ---`
# it uses `--- verse none | section: Colophon ---` for an unnumbered block and `--- names ---`
# in the nāmāvalī files. reader_view.parse returns no units at all for those 45 files, so this
# tool splits on any `--- … ---` line of its own.
UNIT_HEAD = re.compile(r"^--- (?!-)(.+?) ---$", re.M)
FIELD = re.compile(
    r"^(deva|iast|en|tel|hi|vidhi|variant):[ \n](.*?)(?=\n(?:deva|iast|en|tel|hi|vidhi|variant):|\Z)",
    re.S | re.M)


NAME_ROW = re.compile(r"^\s*(\d+)\s*\|(.*)$", re.M)


def split_units(text):
    """Every marked block in the file, with the label its `--- … ---` line carries.

    A `--- names ---` block is not verse: it is a pipe table, one name to a row, in the column
    order `n | deva | iast | en | tel | hi`. It is returned as `_names` rows rather than fields.
    """
    heads = list(UNIT_HEAD.finditer(text))
    units = []
    for i, m in enumerate(heads):
        body = text[m.end(): heads[i + 1].start() if i + 1 < len(heads) else len(text)]
        label = m.group(1)
        if label.strip() == "names":
            rows = []
            for num, rest in NAME_ROW.findall(body):
                cols = [c.strip() for c in rest.split("|")]
                cols += [""] * (5 - len(cols))
                rows.append([num] + cols[:5])
            if rows:
                units.append({"_label": label, "_names": rows})
            continue
        u = {k: v.strip() for k, v in FIELD.findall(body)}
        if u:
            u["_label"] = label
            units.append(u)
    return units


def files():
    return sorted(p for p in ROOT.rglob("*.txt") if "untitled" not in str(p))


def checks(fields, units, head, rel, text=""):
    """Things worth a second look. Each is a (severity, message); nothing here edits anything."""
    out = []
    if text.lstrip().startswith("RESERVED"):
        return [("reserved", "placeholder reserved by another session — not yet written")]
    has = lambda k: any(k in u for u in units)
    for name in rv.READER_FIELDS:
        if name in fields and rv.SOURCING.search(fields[name]):
            out.append(("leak", f"reader field '{name}' carries sourcing: "
                                f"[{rv.SOURCING.search(fields[name]).group(0)}]"))
    named = sum(len(u["_names"]) for u in units if "_names" in u)
    # A header count is a count of the *numbered* units. Blocks marked `verse none` — colophons,
    # unnumbered dhyāna verses — are deliberately outside it, so they are not counted here either.
    numbered = [u for u in units if "_names" not in u and re.search(r"\d", u.get("_label", ""))]
    held = named or len(numbered)
    what = "names" if named else "numbered units"
    order = ("Name count", "Unit count", "Verse count") if named else COUNT_FIELDS
    stated = next((fields[k] for k in order if k in fields), None)
    # Nothing to compare against in a file whose blocks are all unnumbered.
    if stated and (named or numbered):
        m = re.search(r"\d+", stated)
        # A header may count the numbered units only, or every block including the unnumbered
        # opening verse and the colophon. Either reading satisfies the check.
        blocks = len([u for u in units if "_names" not in u])
        if m and int(m.group(0)) not in (held, blocks):
            out.append(("count", f"header says {m.group(0)}, file holds {held} {what}"
                                 f" ({blocks} blocks in all)"))
    if not units:
        out.append(("count", "no verse units parsed"))
    for i, u in enumerate(units, 1):
        if "_names" in u:
            for row in u["_names"]:
                if not all(row[1:4]):
                    out.append(("missing", f"name {row[0]}: an empty column"))
            continue
        if not u.get("deva"):
            out.append(("missing", f"unit {i}: no deva"))
        if not u.get("iast"):
            out.append(("missing", f"unit {i}: no iast"))
        for k, label in (("en", "English"), ("tel", "Telugu"), ("hi", "Hindi")):
            if has(k) and not u.get(k):
                out.append(("missing", f"unit {i}: no {label} meaning"))
        d, a = u.get("deva", ""), u.get("iast", "")
        if d and a and d.count("\n") != a.count("\n"):
            out.append(("lines", f"unit {i}: deva has {d.count(chr(10))+1} lines, "
                                 f"iast has {a.count(chr(10))+1}"))
        if ":" in d:
            out.append(("colon", f"unit {i}: ASCII colon in deva (visarga should be ः)"))
        # The rule is per line, not per unit: a numbered service list very often sits at the
        # foot of a unit whose mantra above it is accented, and that list is correctly numbered.
        for ln in d.split("\n"):
            if re.match(r"\s*\d+\.", ln) and any(c in ln for c in ACCENTS):
                out.append(("number", f"unit {i}: numbered line carries svara marks"))
                break
    return out


def one(p):
    text = p.read_text(encoding="utf-8", errors="replace")
    fields, _, head = rv.parse(text)
    units = split_units(text)
    rel = str(p.relative_to(ROOT))
    return {
        "path": rel,
        "reader": {k: v for k, v in fields.items() if k in rv.READER_FIELDS},
        "editorial": {k: v for k, v in fields.items() if k not in rv.READER_FIELDS},
        "units": units,
        "checks": checks(fields, units, head, rel, text),
        "telscript": [dev2tel(u.get("deva", ""), accents=True) if dev2tel and "_names" not in u
                      else "" for u in units],
        "raw": text,
    }


_INDEX = {"stamp": None, "rows": None}


def index():
    """Built once, and again only when a file on disk has changed."""
    stamp = tuple(sorted((str(p), p.stat().st_mtime) for p in files()))
    if _INDEX["stamp"] == stamp:
        return _INDEX["rows"]
    rows = []
    for p in files():
        text = p.read_text(encoding="utf-8", errors="replace")
        fields, _, head = rv.parse(text)
        units = split_units(text)
        rel = str(p.relative_to(ROOT))
        rows.append({
            "path": rel,
            "folder": str(p.parent.relative_to(ROOT)),
            "title": fields.get("Title", p.stem.replace("_", " ")),
            "deva": fields.get("Devanāgarī", ""),
            "telugu": fields.get("Telugu", ""),
            "units": sum(len(u["_names"]) for u in units if "_names" in u) or len(units),
            "flags": len(ck := checks(fields, units, head, rel, text)),
            "kinds": sorted({k for k, _ in ck}),
        })
    _INDEX.update(stamp=stamp, rows=rows)
    return rows


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send_json(self, obj):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        if u.path in ("/", "/index.html"):
            body = (UI / "index.html").read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif u.path == "/api/index":
            self.send_json(index())
        elif u.path == "/api/file":
            rel = urllib.parse.parse_qs(u.query).get("p", [""])[0]
            p = (ROOT / rel).resolve()
            if not str(p).startswith(str(ROOT)) or p.suffix != ".txt" or not p.is_file():
                self.send_error(404)
                return
            self.send_json(one(p))
        else:
            self.send_error(404)


def main():
    args = sys.argv[1:]
    if "--checks" in args:
        total = 0
        for p in files():
            d = one(p)
            if d["checks"]:
                print(f"\n{d['path']}  ({len(d['checks'])})")
                for sev, msg in d["checks"]:
                    print(f"  [{sev}] {msg}")
                total += len(d["checks"])
        print(f"\n{total} observations over {len(files())} files")
        return
    port = int(args[args.index("--port") + 1]) if "--port" in args else 8765
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("127.0.0.1", port), Handler) as srv:
        print(f"corpus audit viewer on http://127.0.0.1:{port}  (ctrl-c to stop)")
        srv.serve_forever()


if __name__ == "__main__":
    main()

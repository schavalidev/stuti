#!/usr/bin/env python3
"""Fetch a source page and emit its content text, nav and comments stripped.

Both sites return HTTP 403 to WebFetch and to a bare curl, so a browser
User-Agent is required. That is the only reason this exists as a script rather
than a one-liner.

Container targets, found by inspecting the served HTML rather than guessed:

  vignanam.org    <div class="stotramtext">   — the verse body. The page also
                  carries a site-wide index of every other stotra title in a
                  trailing block; scoping to this div drops it.
  stotranidhi.com <div class="entry-content"> — but the reader comments sit in
                  sibling <article class="comment-body"> blocks and the sharing
                  widget in .sd-block, so the text is cut at whichever comes first.

Usage:
    python3 fetch_source.py <url> [-o out.txt]
"""
import argparse
import html as H
import re
import sys
import urllib.request

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36')

# Lines that are chrome on one site or the other, dropped wherever they appear.
BOILER = re.compile(
    r'^(view this in|read in|this document is in|meaning\s*,|collection of spiritual'
    r'|-->|<!--|\||\s*$)', re.I)


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        raw = r.read()
    return raw.decode('utf-8', errors='replace')


def container(html: str, cls: str) -> str:
    """Inner HTML of the first <div class="...cls..."> , depth-aware."""
    m = re.search(r'<div[^>]*class="[^"]*\b' + re.escape(cls) + r'\b[^"]*"[^>]*>', html)
    if not m:
        return ''
    i = m.end()
    depth = 1
    for t in re.finditer(r'<(/?)div\b[^>]*>', html[i:]):
        depth += -1 if t.group(1) else 1
        if depth == 0:
            return html[i:i + t.start()]
    return html[i:]


def to_text(frag: str) -> str:
    frag = re.sub(r'(?is)<(script|style).*?</\1>', ' ', frag)
    frag = re.sub(r'(?is)<br[^>]*>', '\n', frag)
    frag = re.sub(r'(?is)</(p|div|h[1-6]|li|tr)>', '\n', frag)
    txt = H.unescape(re.sub(r'(?s)<[^>]+>', ' ', frag))
    lines = [re.sub(r'[ \t ]+', ' ', l).strip() for l in txt.split('\n')]
    return '\n'.join(l for l in lines if l and not BOILER.match(l))


# vignanam appends its site-wide index after the verse body, in blocks headed by
# a category name and an ASCII count — "व्रत, पूजा (15)". Verse text numbers its
# citations in Devanāgarī digits ("(यजु० १। १०)"), never ASCII, so this is safe.
# "Browse Related Categories:" is the label that introduces them and is the
# reliable marker.
#
# Do NOT treat every "(\d+)"-terminated line as a heading. vignanam numbers each
# tenth name of an aṣṭottaraśatanāmāvalī exactly that way — "ॐ सुप्रदीप्ताय नमः (10)"
# — and an earlier version of this rule therefore cut the Gaṇeśa-caturthī page at
# its tenth name, discarding 461 of the page's 731 lines. The reasoning behind
# that version ("verse text numbers its citations in Devanāgarī digits, never
# ASCII") was wrong. A category heading never carries a nāma-mantra, so requiring
# the line to hold no ॐ and no नमः separates the two reliably.
NAV_HEAD = re.compile(
    r'^(browse related categories:|(?!.*(?:नमः|नम:|ॐ|ओं))\S.*\(\d+\)\s*$)', re.I)

# stotranidhi's trailing furniture: language pickers, the standing appeal to
# readers, the corrections link, the comment block, and the book advertising
# that follows every page ("more puja vidhanams", "our next publication", the
# WhatsApp channel, the donation links).
SN_CUT = re.compile(
    r'^(chant other stotras in|did you see any mistake|facebook comments'
    r'|important message to dharmikas|విప్రులకు|మరిన్ని|మా తదుపరి ప్రచురణ'
    r'|స్తోత్రనిధి \(|buy |support this dharma karya|a single book'
    r'|"[^"]*"\s*[,.]?\s*$)', re.I)
# ...and its leading furniture: breadcrumb, and the "also in our book" plug.
SN_LEAD = re.compile(r'(→|^\(\s*(గమనిక|note)\s*:)', re.I)


def trim_vignanam(lines: list) -> list:
    """Drop the trailing site index.

    Cutting at the first category header leaves a few stray titles above it,
    because the index repeats itself several times over. Every such line recurs
    below the cut, so walking back while the last line reappears in the tail
    removes exactly the nav and stops at real content.
    """
    cut = next((i for i, l in enumerate(lines) if NAV_HEAD.match(l)), len(lines))
    body, tail = lines[:cut], set(lines[cut:])
    while body and body[-1] in tail:
        body.pop()
    return body


def trim_stotranidhi(lines: list) -> list:
    cut = next((i for i, l in enumerate(lines) if SN_CUT.match(l)), len(lines))
    body = lines[:cut]
    while body and SN_LEAD.search(body[0]):
        body.pop(0)
    return body


def extract(url: str, html: str) -> str:
    if 'vignanam.org' in url:
        body = container(html, 'stotramtext') or container(html, 'stext')
        lines = trim_vignanam(to_text(body).split('\n'))
    else:
        body = container(html, 'entry-content')
        # Cut reader comments and the sharing widget, whichever appears first.
        cut = [m.start() for m in
               (re.search(r'<article[^>]*class="[^"]*comment-body', body),
                re.search(r'class="[^"]*sd-block', body),
                re.search(r'(?i)<div[^>]*id="comments', body)) if m]
        if cut:
            body = body[:min(cut)]
        lines = trim_stotranidhi(to_text(body).split('\n'))
    return '\n'.join(lines)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('url')
    ap.add_argument('-o', '--out')
    a = ap.parse_args()
    text = extract(a.url, fetch(a.url))
    if a.out:
        with open(a.out, 'w', encoding='utf-8') as fh:
            fh.write(text + '\n')
        print(f'{a.out}: {text.count(chr(10)) + 1} lines, {len(text)} chars',
              file=sys.stderr)
    else:
        print(text)


if __name__ == '__main__':
    main()

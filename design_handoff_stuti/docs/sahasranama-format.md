# Supplying a new sahasranāma — source format

One document per text (paste in chat or upload a file — .txt/.md/.docx/.pdf all fine). Telugu script preferred (the pipeline transliterates Telugu → Devanāgarī → everything else); Devanāgarī also accepted. Three parts:

## 1. Header
```
Deity: hanuman
Title: Hanumat Sahasranāma
Source/tradition: (e.g. Rudrayāmala) — optional
Blurb: one line — optional
```

## 2. The stotra, in chant order
The full text exactly as chanted, with section headings and śloka numbers:
```
## Dhyānam
<verses, each ending ॥ or ॥ n ॥>

## Nyāsa            ← if the text has one; flagged as ritual automatically
...

## Stotram (the thousand names)
<the actual name-ślokas WITH daṇḍas and numbers:
 ... ప్రథమం ద్వితీయం ... ॥ 1 ॥ >

## Phalaśruti
...
```
The ॥ n ॥ boundaries in the name-ślokas are the critical part — they give the canonical stanza cuts (no metre-guessing needed) and the per-śloka name counts.

## 3. The nāmāvali with meanings
Numbered 1–1000, one per line:
```
1. ఓం హనుమతే నమః — meaning in Telugu
2. ...
```
- Telugu meaning (mt) required; English (me) optional — I gloss what's missing.
- The "ōṁ … namaḥ" wrapper is fine; I strip it.

## Optional
- Thematic groups: `names 1–120: <Telugu label> / <English label>` — I derive them if absent.
- Hindi meanings — can be added later as a separate pass (see stuti-hindi-names-*.js).

## What I build from it
- `stuti-names-<key>.js` — `{groups, names:[{n,deva,iast,mt,me}], slokaCounts}`
- A `STUTI_TEXTS` entry: framing sections (dhyānam, nyāsa, phalaśruti) as verses, with `namesKey`/`namesAt` splicing the name-ślokas in at their place — cut exactly at your ॥ n ॥ boundaries when the stotra form is supplied, by the metre partition only as a fallback.

# Getting the merged files into the Stuti design project

Merged 12 October 2026 (session S63). Source for every file: `design_handoff_stuti/app/`.
Upload into the **Stuti** project, not "Copy of Stuti".

## Still to upload, by hand

These could not be written through the connector. It accepts only inline content —
no file from disk — and a write replaces the whole file, so nothing can be chunked.
Above roughly 45 KB of encoded content the payload is cut off mid-stream, and twice
a truncated payload was assembled that would have written a corrupt file had it not
been refused for other reasons. Uploading by hand avoids all of that.

| file | bytes | sha256 (first 16) |
|---|---|---|
| `stuti-library-data.js` | 21482 | `6dc879ad997ebb8f` |
| `stuti-data.js` | 35653 | `ac0ad5ae8aa85138` |
| `stuti-follow.jsx` | 39768 | `28618a70a9332706` |
| `stuti-main.jsx` | 43775 | `a282159ab3937052` |
| `stuti-home.jsx` | 55775 | `7520df1ef1ef1dc1` |
| `stuti-reader.jsx` | 102700 | `d87f9f5af3b669aa` |
| `stuti-i18n.js` | 229435 | `c0a8d78cfd20c78d` |
| `stuti-components.css` | 401055 | `baaef612a5287187` |

**Check the byte count after each upload.** A file landing a few bytes short means a
`\uXXXX` escape was interpreted on the way in rather than stored — a silent corruption
that looks like a normal save. `stuti-main.jsx`, `stuti-data.js`, `stuti-home.jsx` and
`stuti-reader.jsx` all carry such escapes.

## Already uploaded and verified

| file | bytes |
|---|---|
| `Stuti.html` | 7515 |
| `stuti-temple.js` | 6228 |
| `stuti.css` | 23348 |
| `stuti-code.css` | 13019 |
| `stuti-flow.jsx` | 16261 |
| `stuti-compass.jsx` | 32255 |
| `stuti-japa.jsx` | 29878 |
| `stuti-panchanga.jsx` | 25561 |
| `stuti-library.jsx` | 31041 |

These were written with base64 encoding and read back at the exact byte count.
The four largest of them — compass, japa, panchanga, library — sat near the size
limit, so they are worth a glance in the prototype before being trusted entirely.

## Not going up at all

`stuti-temples.js` (1.6 MB) is the generated OpenStreetMap temple index: build output,
not design source. Without it the prototype never shows the recognised-temple card;
a hand-pinned temple still works.

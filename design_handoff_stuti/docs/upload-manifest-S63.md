# Getting the merged files into the Stuti design project

Merged 12 October 2026 (session S63). Source for every file: `design_handoff_stuti/app/`.
Upload into the **Stuti** project, not "Copy of Stuti".

Always check the byte count after an upload. A file that lands a few bytes short
means a `\uXXXX` escape was interpreted on the way in rather than stored — a silent
corruption that looks exactly like a normal save.

## Check these first — state unknown

Written and verified, then possibly overwritten by a duplicate background write that
reported itself truncated. The connector lost its read scope before this could be
checked. Compare the byte count in the project against the figure below; if it
differs, re-upload.

| file | bytes | sha256 (first 16) |
|---|---|---|
| `stuti-japa.jsx` | 29878 | `6017a77fa23e6e9c` |
| `stuti-panchanga.jsx` | 25561 | `9b6346ffba9d22af` |
| `stuti-library.jsx` | 31041 | `5d1133cbf06a58c0` |

## Still to upload

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

## Confirmed good

| file | bytes | sha256 (first 16) |
|---|---|---|
| `Stuti.html` | 7515 | `3696d7800d0cd238` |
| `stuti-temple.js` | 6228 | `6b59ce219faaceaf` |
| `stuti.css` | 23348 | `7c3408db2bbd918a` |
| `stuti-code.css` | 13019 | `0ed653482d439061` |
| `stuti-flow.jsx` | 16261 | `34ffd29af9bf29c1` |
| `stuti-compass.jsx` | 32255 | `f42c0fbc30c03c91` |

## Not going up

`stuti-temples.js` (1.6 MB) is the generated OpenStreetMap temple index: build output,
not design source. Without it the prototype never shows the recognised-temple card;
a hand-pinned temple still works.

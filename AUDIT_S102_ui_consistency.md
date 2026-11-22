# S102 — UI consistency audit (22 Nov 2026)

Built bundle 0.9.134, phone width (375 px), roman and Telugu interfaces. Nothing was changed; this is the list to act on.

## 1. Fix first: the Vidhi section is untranslated (reported by the user)

In the Telugu interface, Gaṇeśa's book lists every section in Telugu except the last, which reads "VIDHI" in Latin capitals. The cause is that `TYPE_LABELS` in the library data (design file `stuti-library-data.js`, generated into `stuti-app/src/stuti-library-data.ts:26`) has no entry for the type "Vidhi", so `typeList()` falls back to the raw English word. Śrī Varasiddhi Vināyaka Vratam (`stuti-data.ts:212`) is the only text with that type. A sweep of all twelve deity books found no other untranslated section heading.

The fix is one line beside the others, for example `"Vidhi": { deva: "विधि", tel: "విధానం", note: "The order of the rite" }`, which matches the word `stuti-i18n.ts:933` already uses. It belongs in the design source or a codemod step, not in the generated file. "Vidhi" should also be added to `TYPE_ORDER`.

## 2. Worth fixing

- **Eyebrow labels follow two styles.** On Today, "Sandhyāvandanam" and "Today's Pañcāṅga" are 13.5 px, weight 600, gold. "Tomorrow" (`.parva-k`) is 11.5 px, weight 700, grey. They do the same job and should share `.eyebrow`.
- **Key labels change typeface.** The pañcāṅga and sandhyā row keys (`.rhb-row-k`, `.sy-row-k`) are uppercase serif at 16 px. Every other small uppercase label in the app is sans at 12–13 px.
- **"Tirupati" stays English** in the Telugu interface, on the Today and Pañcāṅga headers. It is the only English left on any tab.
- **Deity tiles on the Library shelf.** "Subrahmaṇya" is cut to "Subrahmaṇ", and "Navagrahas" runs to the tile's edge. The artwork also mixes two styles: round medallions for most deities, rectangular paintings for Nadī Devatās and Navagrahas. "Itara Devatās" has no picture at all.
- **The floating pin button** (top right) stays fixed and sits over content when the page scrolls, for example over the 28th on the calendar.
- **Two undefined tokens.** `--font-body` (`.gs-count`, `stuti-components.css:1654`) is not defined anywhere. `--warn` (the muhūrta "avoid" badge, line 1474) is not defined either, so it falls back to `#b5462a` instead of the app's `--caution` red, and it gets no lighter red in dark mode.

## 3. Housekeeping (not visible as a single fault)

- The stylesheets use **104 different font sizes**, often a hair apart (0.8125, 0.8438, 0.875 rem). They work, but they are why screens feel slightly unlike one another. A five- or six-step type scale would settle it. This is an unbounded clean-up, so it belongs after launch.
- **Corner radii** mostly use the tokens (`--r-sm`, `--r-md`, `--r-lg`, pill, circle), but about 60 rules hard-code 9, 10, 12, 14, 16 or 20 px.
- The Gaṇeśa header mixes an em dash ("Gaṇeśa — remover of obstacles") with an en dash before the count ("– 18").

## Checked and clean

There is no italic anywhere. No component hard-codes a font family. Nothing overflows sideways at phone width. The Telugu conjuncts on the calendar day card render correctly; they only looked broken where the tab bar covered their lower half.

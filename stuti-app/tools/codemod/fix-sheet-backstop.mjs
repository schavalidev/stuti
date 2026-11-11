#!/usr/bin/env node
/* ============================================================
   Back over the tithi sheet.

   The designer gave the Back button a stack of closers
   (stuti-backstop.js): while a sheet is open it registers how to
   shut itself, and the app's popstate handler asks that stack before
   it moves between screens. She wired the tools panel, the reminders
   sheet and the reader's own sheets. The sheet that adds a janma
   tithi or an ābdikam was left out of it, and it is the one a tester
   found: it fills the screen, it carries no history entry of its
   own, and Back walked straight past it to the screen beneath — or
   out of the app.

   One registration, in her own pattern. The anchor is the component's
   first line; a design update that renames or re-signs it fails here.
   ============================================================ */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-tithis.tsx");
let t = readFileSync(FILE, "utf8");

function patch(from, to, what) {
  if (t.includes(to)) return;                       // already placed
  if (!t.includes(from)) throw new Error(`fix-sheet-backstop: anchor not found — ${what}`);
  t = t.replace(from, to);
}

patch(
  `import { STUTI_TITHIS } from "./stuti-tithis-core";`,
  `import { STUTI_TITHIS } from "./stuti-tithis-core";\nimport { STUTI_BACKSTOP } from "./stuti-backstop";`,
  "import",
);

patch(
  `function TithiSheet({ lang = "deva", rec, seedDate, onClose }) {\n`,
  `function TithiSheet({ lang = "deva", rec, seedDate, onClose }) {\n` +
  `  /* Back shuts this sheet before it moves the screen (seam) */\n` +
  `  useEffectTT(() => (STUTI_BACKSTOP ? STUTI_BACKSTOP.push(onClose) : undefined), [onClose]);\n`,
  "the sheet's first line",
);

writeFileSync(FILE, t);

/* ---- and the house date field's own calendar ----
   It opens over the sheet that holds it, so Back should shut the calendar
   first and leave the sheet standing — the stack is last-opened, first
   closed, and this is the one overlay in the app that reliably sits on top
   of another. Without it the first Back takes the whole sheet away and the
   reciter loses what they had typed. */
const DP = join(HERE, "../../src/stuti-datepick.tsx");
let d = readFileSync(DP, "utf8");
function patchDp(from, to, what) {
  if (d.includes(to)) return;
  if (!d.includes(from)) throw new Error(`fix-sheet-backstop: anchor not found in stuti-datepick — ${what}`);
  d = d.replace(from, to);
}
patchDp(
  `const { useState: useDpS, useMemo: useDpM } = React;`,
  `const { useState: useDpS, useMemo: useDpM, useEffect: useDpE } = React;`,
  "the hook aliases",
);
patchDp(
  `  const [yearOpen, setYearOpen] = useDpS(false);\n`,
  `  const [yearOpen, setYearOpen] = useDpS(false);\n` +
  `  /* Back shuts the calendar before the sheet under it (seam) */\n` +
  `  useDpE(() => (open && STUTI_BACKSTOP ? STUTI_BACKSTOP.push(() => setOpen(false)) : undefined), [open]);\n`,
  "the open-state block",
);
patchDp(
  `import { MoonPhase, useLoc } from "./stuti-panchanga";`,
  `import { MoonPhase, useLoc } from "./stuti-panchanga";\nimport { STUTI_BACKSTOP } from "./stuti-backstop";`,
  "import",
);
writeFileSync(DP, d);

/* ---- and the day picker the tithi sheet actually uses ----
   The sheet's date control is DayPick, which lives with the japa screen and
   keeps its own open state. It is the calendar a tester found open over the
   sheet with no way back out of it, so it registers too — and it is pushed
   after the sheet, which is what makes Back close the calendar first and
   leave the sheet, and the typing in it, standing. */
const JP = join(HERE, "../../src/stuti-japa.tsx");
let j = readFileSync(JP, "utf8");
function patchJp(from, to, what) {
  if (j.includes(to)) return;
  if (!j.includes(from)) throw new Error(`fix-sheet-backstop: anchor not found in stuti-japa — ${what}`);
  j = j.replace(from, to);
}
patchJp(
  `import { OverlayPortal } from "./stuti-picker";`,
  `import { OverlayPortal } from "./stuti-picker";\nimport { STUTI_BACKSTOP } from "./stuti-backstop";`,
  "import",
);
patchJp(
  `function DayPick({ value, max, lang, onChange, label, bad, place }) {\n  const [open, setOpen] = useStateJ(false);\n`,
  `function DayPick({ value, max, lang, onChange, label, bad, place }) {\n  const [open, setOpen] = useStateJ(false);\n` +
  `  /* Back shuts the calendar before the sheet under it (seam) */\n` +
  `  useEffectJ(() => (open && STUTI_BACKSTOP ? STUTI_BACKSTOP.push(() => setOpen(false)) : undefined), [open]);\n`,
  "DayPick's open state",
);
writeFileSync(JP, j);

console.log("sheet backstop seam applied: the tithi sheet, the day picker and the date field");

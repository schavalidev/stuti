/* ============================================================
   STUTI — the upcoming days, kept between launches
   Hand-authored, like stuti-corpus.ts. Placed by
   tools/codemod/fix-vrata-cache-seam.mjs, which gives
   stuti-vrata-data.ts two lines: one to ask this for a kept answer,
   one to hand the computed one over. Without this module that hook is
   simply absent and the module computes as it always did, which is how
   the design prototype goes on running unchanged.

   Why: resolving the next date of every vrata means walking days
   forward through the ephemeris, and at launch that is one synchronous
   block of about 1.5 s on a laptop and 3.5 s on a phone — the single
   biggest thing between tapping the icon and reading anything. The
   module already answers it once per civil day and keeps the answer in
   memory; it just had nowhere to keep it when the app closed.

   What is kept is only what was computed: each row's vrata id and its
   two resolved dates. `away` and `dayNo` are counted from today on the
   way back, because they are relative and cost nothing. Nothing here
   decides whether an answer is still good — the key is the module's own
   fingerprint, which already carries the civil day, the length of the
   list, the reckoning preferences and the house's tithis field by
   field. If any of those move, the key moves and the day is computed
   afresh. A kept row whose vrata is no longer in the table discards the
   whole entry rather than guessing, and so does anything unreadable.
   ============================================================ */
import { STUTI_VRATA } from "./stuti-vrata-data";
import { BOOT } from "./stuti-boot";

const KEY = "stuti-vrata-upcoming";
const V: any = STUTI_VRATA as any;

/* local civil date, as its own three numbers: a date rebuilt from these is the
   same midnight whatever the device thinks of time zones since */
const ymd = (d: Date) => [d.getFullYear(), d.getMonth(), d.getDate()].join("-");
function fromYmd(s: any): Date | null {
  if (typeof s !== "string") return null;
  const a = s.split("-").map(Number);
  if (a.length !== 3 || a.some((n) => !isFinite(n))) return null;
  const d = new Date(a[0], a[1], a[2]);
  return isNaN(+d) ? null : d;
}

function restore(k: string): any[] | null {
  let saved: any = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  if (!saved || saved.k !== k || !Array.isArray(saved.rows) || !saved.rows.length) return null;
  if (typeof V.lookup !== "function" || typeof V.daysAway !== "function") return null;
  const out: any[] = [];
  for (const r of saved.rows) {
    const v = r && r.id ? V.lookup(r.id) : null;
    const date = fromYmd(r && r.date), start = fromYmd(r && r.start);
    if (!v || !date || !start) return null;   // the table moved under it: compute it again
    const days = r.days || 1;
    /* exactly what the module does with a freshly resolved date */
    const raw = V.daysAway(start);
    const running = raw <= 0 && -raw < days;
    out.push({ v, date, start, away: running ? 0 : raw, dayNo: running ? 1 - raw : null, days });
  }
  BOOT.note = "vrata=kept";
  return out;
}

function save(k: string, rows: any[]) {
  if (!BOOT.note) BOOT.note = "vrata=walked";
  try {
    if (!Array.isArray(rows) || !rows.length) return;
    const out = [];
    for (const u of rows) {
      if (!u || !u.v || !u.v.id || !(u.date instanceof Date) || !(u.start instanceof Date)) return;
      out.push({ id: u.v.id, date: ymd(u.date), start: ymd(u.start), days: u.days || 1 });
    }
    localStorage.setItem(KEY, JSON.stringify({ k, rows: out }));
  } catch (e) { /* a full or blocked store is not worth a launch */ }
}

let installed = false;
export function installVrataCache() {
  if (installed) return; installed = true;
  (window as any).STUTI_VRATA_CACHE = { restore, save };
}

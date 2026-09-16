/* ============================================================
   STUTI — corrections without a release
   Hand-authored. The verse corpus is baked into the app as the
   design ships it, and it stays that way: it is what works with
   no network in the pūjā room. What changes is that a wrong word
   no longer waits for a build. A correction is one row in the
   `stuti_corrections` table — which hymn, which verse, which field
   (deva, iast, en, tel, …), the text as it is now, and the text it
   should be — and every app lays the published rows over its
   corpus at launch.

   The rows are cached on the device, so a correction fetched once
   holds offline. It is applied only when the verse still reads
   exactly what the row says it should replace; once the corpus
   itself carries the fix (the next design port), the row simply
   stops matching and does nothing. Nothing can be inserted, only
   a field that exists changed. Applied before the first render by
   main.tsx; newly fetched rows apply at once to hymns not yet open.
   ============================================================ */
import { STUTI } from "./stuti-data";
import { STUTI_CLOUD_CONFIG as CFG } from "./stuti-cloud-config";
import { rawSet } from "./stuti-sync-hook";

/* n '' names a hymn-level field (title, blurb) */
type Row = { id: number; hymn: string; s: number | null; n: string; field: string; old_text: string; new_text: string };
const KEY = "stuti-corrections";
const FIELDS = new Set(["deva", "iast", "en", "tel", "roman", "hi", "telugu", "title", "blurb"]);

function apply(rows: Row[]) {
  let n = 0;
  const hymns: any[] = (STUTI && (STUTI as any).hymns) || [];
  for (const r of rows) {
    if (!FIELDS.has(r.field)) continue;
    const h = hymns.find((x) => x.id === r.hymn || x.title === r.hymn);
    if (!h) continue;
    if (r.n === "" || r.n == null) {                     // a hymn-level field: title or blurb
      if (h[r.field] === r.old_text) { h[r.field] = r.new_text; n++; }
      continue;
    }
    const vs: any[] = h.verses || [];
    /* most texts number their verses; the short hymns keyed in stuti-data do
       not, and there the number is the verse's place, counting from 1 */
    const v = vs.find((x: any) => x.n != null && String(x.n) === String(r.n) && (r.s == null || x.s === r.s))
      || (vs.every((x: any) => x.n == null) ? vs[Number(r.n) - 1] : undefined);
    if (v && v[r.field] === r.old_text) { v[r.field] = r.new_text; n++; }
  }
  return n;
}

export function applyCachedCorrections() {
  try { const rows = JSON.parse(localStorage.getItem(KEY) || "[]"); return apply(rows); } catch (e) { return 0; }
}

export async function refreshCorrections() {
  if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) return;
  try {
    const r = await fetch(CFG.supabaseUrl + "/rest/v1/stuti_corrections?select=id,hymn,s,n,field,old_text,new_text&published=eq.true&order=id", {
      headers: { apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + CFG.supabaseAnonKey },
    });
    if (!r.ok) return;
    const rows: Row[] = await r.json();
    rawSet.call(localStorage, KEY, JSON.stringify(rows));
    apply(rows);
  } catch (e) {}
}

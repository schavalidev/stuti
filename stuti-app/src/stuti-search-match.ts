/* ============================================================
   STUTI — how close a typed query comes to a hymn
   Hand-authored (never regenerated); wired into the generated search by
   tools/codemod/fix-search-seam.mjs.

   The search used to ask one question: does the folded query appear, whole
   and unbroken, inside the folded title? That is a fair question only of
   someone who already knows the title. A reciter looking for the Viṣṇu
   Sahasranāma types "vishnu sahasranamam" and gets nothing, because the
   catalogue calls it "Viṣṇu Sahasranāma Stotram" and the run breaks at the
   m — one letter, and the stotra may as well not exist.

   So the query is read as words instead of as a run. Every word must be
   accounted for somewhere in the hymn's names — its title in three scripts,
   its deity, its form, its author — but a word may be accounted for by a
   word that merely begins the same way ("sahasra" for sahasranāma), by one
   it sits inside ("nama" for sahasranāma), or by one it is a letter or two
   away from ("sahasranamam" for sahasranāma). What comes back is ordered by
   how well it answered, so the exact title still arrives first and the near
   ones follow it rather than nothing following at all.

   Everything here works on keys already folded by STUTI_TRANSLIT.fold, the
   app's one spelling-tolerant fold (krishna/kṛṣṇa, sh/ś, doubles collapsed).
   ============================================================ */

/* how many single-letter edits turn a into b, capped: past the cap the
   answer is only ever "too far", and stopping early keeps a whole catalogue
   cheap to score on every keystroke */
function within(a: string, b: string, cap: number): number {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > cap) return cap + 1;
  let prev = new Array(n + 1), cur = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    let best = i;
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > cap) return cap + 1;
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

/* A longer word may be more misspelt than a short one before it stops being
   the same word: "ram" and "rama" are different hymns, "sahasranamam" and
   "sahasranama" are not. */
const slack = (len: number) => (len >= 10 ? 2 : len >= 6 ? 1 : 0);

const words = (s: string) => (s || "").split(/[^a-z0-9ऀ-ॿఀ-౿]+/).filter(Boolean);

/** How well one query word is answered by one word of a hymn's names.
    1 exact · .9 the name begins with it · .75 it sits inside the name ·
    .6 near enough to be a misspelling · 0 no. */
export function wordScore(q: string, w: string): number {
  if (!q || !w) return 0;
  if (q === w) return 1;
  if (w.startsWith(q) || q.startsWith(w)) return q.length >= 3 ? 0.9 : 0;
  if (q.length >= 4 && w.indexOf(q) !== -1) return 0.75;
  const s = slack(Math.max(q.length, w.length));
  if (s && within(q, w, s) <= s) return 0.6;
  return 0;
}

/** How well a query answers a hymn, given the hymn's folded names as one
    string. 0 means "not this one". The exact old behaviour — the whole
    query as an unbroken run — scores highest, so nothing that used to come
    first stops coming first. */
export function matchScore(qf: string, folded: string): number {
  const qs = words(qf);
  if (!qs.length) return 0;
  const run = folded.indexOf(qf) !== -1;
  const ws = words(folded);
  if (!ws.length) return 0;
  let total = 0;
  for (const q of qs) {
    let best = 0;
    for (const w of ws) { const s = wordScore(q, w); if (s > best) best = s; if (best === 1) break; }
    /* one word of the query unaccounted for and this is a different hymn —
       "shiva sahasranama" must not answer with the Viṣṇu one */
    if (!best) return 0;
    total += best;
  }
  const avg = total / qs.length;
  return run ? 1 + avg : avg;
}

/** Where in the hymn's own title the query falls — a title that STARTS with
    the word beats one that carries it mid-name, and both beat a hymn matched
    only through its deity or form. Lower is better, as the generated search
    already expects. */
export function titleRank(qf: string, foldedTitle: string): number {
  const at = foldedTitle.indexOf(qf);
  if (at === 0) return 0;
  if (at > 0) return foldedTitle[at - 1] === " " ? 1 : 2;
  const qs = words(qf), ws = words(foldedTitle);
  if (!qs.length || !ws.length) return 3;
  let hit = 0;
  for (const q of qs) if (ws.some((w) => wordScore(q, w) >= 0.6)) hit++;
  if (hit === qs.length) return ws[0] && wordScore(qs[0], ws[0]) >= 0.6 ? 0 : 1;
  return hit ? 2 : 3;
}

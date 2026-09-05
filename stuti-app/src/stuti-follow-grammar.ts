/* ============================================================
   STUTI — Follow: what the ears should listen for
   Hand-authored. A Hindi (or Telugu) recogniser has no Sanskrit in its
   vocabulary, so left to itself it hears a stotra as the nearest Hindi it
   knows — and nearest by its own language model, which prefers common
   words to similar-sounding ones ("बेडमिंटन" for bheda-bhinnaṁ). Voice
   teleprompters fix this by biasing the recogniser toward the script.
   Vosk can be handed a grammar: a list of vocabulary words it may output.
   This module builds that list for a text — for every word, the
   vocabulary words that sound most like it, and for a long compound the
   vocabulary pieces it breaks into — so the recogniser's choices are
   already the stotra's sounds, and the matcher (stuti-follow-engine.ts)
   has far less junk to see through.
   ============================================================ */
import { fineKey, wordsOf } from "./stuti-follow-engine";

type Index = { byKey: Map<string, string[]>; buckets: Map<string, string[]> };

function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = new Array<number>(n + 1), cur = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
const sim = (a: string, b: string) => { const L = Math.max(a.length, b.length); return L ? 1 - editDistance(a, b) / L : 1; };

/** Index a vocabulary (one word per line) once per model. Keys are the
    vowel-keeping fold; buckets by first letter and length keep the search
    for a word's neighbours to a few thousand candidates, not 180 000. */
export function indexVocab(words: string): Index {
  const byKey = new Map<string, string[]>();
  const buckets = new Map<string, string[]>();
  for (const w of words.split("\n")) {
    if (!w || w[0] === "<" || w[0] === "[" || w[0] === "!") continue;
    const k = fineKey(w);
    if (!k || k.length < 2) continue;
    let list = byKey.get(k);
    if (!list) { list = []; byKey.set(k, list); buckets.set(k[0] + k.length, (buckets.get(k[0] + k.length) || []).concat(k)); }
    if (list.length < 2) list.push(w);
  }
  return { byKey, buckets };
}

/** The grammar for a text: vocabulary words that sound like its words. */
export function grammarFor(text: string, ix: Index, perWord = 3): string[] {
  const out = new Set<string>();
  const seen = new Set<string>();
  for (const w of wordsOf(text)) {
    const k = fineKey(w);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    /* whole-word neighbours */
    const cands: [number, string][] = [];
    for (let len = Math.max(2, k.length - 3); len <= k.length + 3; len++) {
      const b = ix.buckets.get(k[0] + len);
      if (!b) continue;
      for (const vk of b) { const s = sim(k, vk); if (s >= 0.72) cands.push([s, vk]); }
    }
    cands.sort((a, b) => b[0] - a[0]);
    for (const [, vk] of cands.slice(0, perWord)) for (const v of ix.byKey.get(vk)!) out.add(v);
    /* a compound, as the pieces the recogniser could say it in */
    if (k.length >= 7) {
      let p = 0;
      while (p < k.length) {
        let took = 0;
        for (let len = Math.min(10, k.length - p); len >= 3; len--) {
          const piece = ix.byKey.get(k.slice(p, p + len));
          if (piece) { for (const v of piece) out.add(v); took = len; break; }
        }
        p += took || 1;
      }
    }
  }
  return [...out];
}

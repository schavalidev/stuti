/* ============================================================
   STUTI — Follow: align what the phone hears to the text (engine)
   Pure logic, no React, no recogniser. Given the reader's flattened
   lines (each with IAST), it keeps a position (line, word) and moves it
   as recognised words arrive.

   A phone recogniser hears Sanskrit through Hindi or Telugu ears, so
   both sides are folded to a forgiving key: consonant skeleton with the
   confusable pairs merged (aspirates, ś/ṣ/s, retroflex/dental, v/b),
   vowels dropped except a word's first. "namaḥ", "नमः", "నమః" and a
   misheard "namah" all become "nmh".

   Matching: the last few heard words against every run of the same
   length ending at each candidate position. Nearby positions are tried
   first with a modest bar; if nothing clears it for a while the reciter
   is "lost" and the whole text is searched with a higher bar and a
   longer run — that is how a detour, a repeated verse or a skipped one
   re-syncs, forwards or back. When unsure the position freezes.
   ============================================================ */

export type Line = { deva: string; iast: string };
export type Pos = { line: number; word: number };
type Tok = { line: number; word: number; key: string };

/* ---- keys ---- */
const DEVA: Record<string, string> = {
  "अ":"a","आ":"a","इ":"i","ई":"i","उ":"u","ऊ":"u","ऋ":"r","ॠ":"r","ऌ":"l","ए":"e","ऐ":"ai","ओ":"o","औ":"au",
  "ा":"a","ि":"i","ी":"i","ु":"u","ू":"u","ृ":"r","ॄ":"r","ॢ":"l","े":"e","ै":"ai","ो":"o","ौ":"au","ॅ":"e","ॉ":"o",
  "क":"k","ख":"k","ग":"g","घ":"g","ङ":"n","च":"c","छ":"c","ज":"j","झ":"j","ञ":"n",
  "ट":"t","ठ":"t","ड":"d","ढ":"d","ण":"n","त":"t","थ":"t","द":"d","ध":"d","न":"n",
  "प":"p","फ":"p","ब":"b","भ":"b","म":"m","य":"y","र":"r","ल":"l","व":"v","श":"s","ष":"s","स":"s","ह":"h","ळ":"l",
  "ं":"n","ँ":"n","ः":"h","्":"","़":"","ऽ":"","।":" ","॥":" ",
};
function latinFold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/ksh/g, "ks").replace(/sh/g, "s").replace(/ch/g, "c").replace(/th/g, "t")
    .replace(/ph/g, "p").replace(/kh/g, "k").replace(/gh/g, "g").replace(/jh/g, "j")
    .replace(/bh/g, "b").replace(/dh/g, "d").replace(/w/g, "v").replace(/z/g, "j")
    .replace(/x/g, "ks").replace(/q/g, "k").replace(/f/g, "p")
    .replace(/[^a-z]/g, "");
}

/* Telugu block -> Devanāgarī block is a fixed offset for the letters that
   matter (U+0C05.. <-> U+0905..); everything else falls through. */
function teluguToDeva(s: string): string {
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (c >= 0x0C00 && c <= 0x0C7F) {
      const d = c - 0x0C00 + 0x0900;
      out += String.fromCodePoint(d);
    } else out += ch;
  }
  return out;
}

function devaToLatin(s: string): string {
  let out = "";
  for (const ch of s) {
    if (DEVA[ch] !== undefined) out += DEVA[ch];
    else if (/[ऀ-ॿ]/.test(ch)) continue; // stray marks, digits, etc.
    else out += ch;
  }
  return out;
}

/** Fold any script to the comparison key: first letter kept (vowel or
    consonant), then consonants only, confusables merged, doubles collapsed. */
export function keyOf(word: string): string {
  let s = word;
  if (/[ఀ-౿]/.test(s)) s = teluguToDeva(s);
  if (/[ऀ-ॿ]/.test(s)) s = devaToLatin(s);
  s = latinFold(s);
  if (!s) return "";
  const head = s[0];
  const tail = s.slice(1).replace(/[aeiou]/g, "");
  return (head + tail).replace(/(.)\1+/g, "$1");
}

const isWordTok = (t: string) => /\p{L}/u.test(t);
export function wordsOf(text: string): string[] {
  return (text || "").split(/\s+/).filter(isWordTok);
}

/* ---- similarity ---- */
function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = new Array(n + 1), cur = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
function sim(a: string, b: string): number {
  const L = Math.max(a.length, b.length);
  return L ? 1 - editDistance(a, b) / L : 1;
}

/* ---- the engine ---- */
export type FollowStatus = "idle" | "listening" | "lost" | "done";

export class FollowEngine {
  private toks: Tok[] = [];
  private lineStart: number[] = [];   // first token index of each line
  private heard: string[] = [];       // keys of words already final
  private partial: string[] = [];     // keys of the current utterance's words
  private idx = -1;                   // token index of the current position (-1 = not yet)
  private misses = 0;
  private lastMoveAt = 0;
  status: FollowStatus = "listening";

  constructor(lines: Line[]) {
    lines.forEach((l, li) => {
      this.lineStart[li] = this.toks.length;
      wordsOf(l.iast || l.deva).forEach((w, wi) => {
        const key = keyOf(w);
        if (key) this.toks.push({ line: li, word: wi, key });
      });
    });
  }

  get pos(): Pos | null {
    if (this.idx < 0) return null;
    const t = this.toks[this.idx];
    return { line: t.line, word: t.word };
  }

  /** Jump to a line the reciter picked by hand (keeps alignment honest). */
  seek(line: number) {
    const i = this.lineStart[line];
    this.idx = Number.isFinite(i) ? Math.max(0, i - 1) : -1;
    this.misses = 0;
    this.status = "listening";
  }

  /** Feed the recogniser's current utterance transcript (cumulative, may
      revise earlier words). Returns the new position if it moved. */
  hear(transcript: string, isFinal: boolean): Pos | null {
    const ks = wordsOf(transcript).map(keyOf).filter(Boolean);
    this.partial = ks;
    const moved = this.align();
    if (isFinal) { this.heard = this.heard.concat(ks).slice(-8); this.partial = []; }
    return moved;
  }

  private recent(): string[] {
    return this.heard.concat(this.partial).slice(-6);
  }

  /* The text run ending at `end` whose joined key is about as long as what
     was heard. Recogniser and text segment words differently (a heard
     "sūrya kōṭi sama prabhā" is one hyphenated compound in the text), so
     runs are measured in letters, not words. */
  private runEndingAt(end: number, len: number): string {
    let s = "";
    for (let i = end; i >= 0 && s.length < len; i--) s = this.toks[i].key + s;
    return s;
  }

  private best(from: number, to: number, heardJoined: string) {
    let bi = -1, bs = 0, second = 0;
    for (let e = from; e <= to; e++) {
      if (e < 0 || e >= this.toks.length) continue;
      const s = sim(heardJoined, this.runEndingAt(e, heardJoined.length));
      if (s > bs) { second = bs; bs = s; bi = e; } else if (s > second) second = s;
    }
    return { idx: bi, score: bs, margin: bs - second };
  }

  private align(): Pos | null {
    const r = this.recent();
    if (!r.length) return null;
    const joined = r.slice(-6).join("");
    if (joined.length < 5) return null;       // too little to go on
    const now = Date.now();

    /* near: a few words back to a couple of lines ahead of where we are */
    const cur = Math.max(this.idx, -1);
    const aheadLine = cur >= 0 ? this.toks[cur].line + 2 : 1;
    const aheadEnd = this.lineStart[aheadLine + 1] != null ? this.lineStart[aheadLine + 1] - 1 : this.toks.length - 1;
    const near = this.best(Math.max(0, cur - 3), aheadEnd, joined);
    if (near.idx >= 0 && near.score >= 0.62) {
      return this.moveTo(near.idx, now, joined);
    }

    this.misses++;
    if (this.misses >= 3) this.status = "lost";   // even after "done": starting over re-finds

    /* lost: search everywhere, but only on strong evidence — a longer run
       and a clear winner, so a stray "sarva" can't teleport the light */
    if (this.status === "lost" && joined.length >= 12) {
      const far = this.best(0, this.toks.length - 1, joined);
      if (far.idx >= 0 && far.score >= 0.72 && far.margin >= 0.06) {
        return this.moveTo(far.idx, now, joined);
      }
    }
    return null;
  }

  private moveTo(i: number, now: number, heard: string): Pos | null {
    const changed = i !== this.idx;
    this.idx = i;
    this.misses = 0;
    this.lastMoveAt = now;
    /* "done" only once the last word has actually been said, not on a
       partial of it — the tail of what was heard must resemble the whole key */
    const last = this.toks[this.toks.length - 1].key;
    const finished = i >= this.toks.length - 1 && sim(heard.slice(-last.length), last) >= 0.7;
    this.status = finished ? "done" : "listening";
    return changed ? this.pos : null;
  }

  get atEnd() { return this.status === "done"; }
  get tokenCount() { return this.toks.length; }
}

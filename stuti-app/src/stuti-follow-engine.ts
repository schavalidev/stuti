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
  "ा":"a","ि":"i","ी":"i","ु":"u","ू":"u","ृ":"r","ॄ":"r","ॢ":"l","े":"e","ै":"ai","ो":"o","ौ":"au","ॅ":"e","ॉ":"o","ऎ":"e","ऒ":"o","ॆ":"e","ॊ":"o","ऱ":"r",
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
  const chars = [...s];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    /* anusvāra is the nasal of whatever follows; at the end of a word it is
       the m the ears report ("liṅgaṁ" is heard as "liṅgam") */
    if (ch === "ं" || ch === "ँ") { out += i + 1 < chars.length && /[\u0915-\u0939]/.test(chars[i + 1]) ? "n" : "m"; continue; }
    if (DEVA[ch] !== undefined) out += DEVA[ch];
    else if (/[ऀ-ॿ]/.test(ch)) continue; // stray marks, digits, etc.
    else out += ch;
  }
  return out;
}

/** Fold any script to the comparison key: first letter kept (vowel or
    consonant), then consonants only, confusables merged, doubles collapsed. */
/* A finer fold that keeps the vowels: not for matching, but for choosing
   which words of a recogniser's vocabulary sound most like a text word */
export function fineKey(word: string): string {
  let s = word;
  if (/[\u0C00-\u0C7F]/.test(s)) s = teluguToDeva(s);
  if (/[\u0900-\u097F]/.test(s)) s = devaToLatin(s);
  return latinFold(s);
}

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
  private lastMoveOn = "";            // the heard tail that last moved the light
  private lastMoveKeys = 0;           // ...and how many words it had
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

  /** Where the light should be: the word about to be said, one past the
      last word heard. A recogniser can only name a word once it has been
      said, so lighting that word would always trail the reciter; a
      teleprompter shows what comes next. */
  get lead(): Pos | null {
    if (this.idx < -1 || !this.toks.length) return null;
    const t = this.toks[Math.min(this.idx + 1, this.toks.length - 1)];
    return { line: t.line, word: t.word };
  }

  /** Jump to a line the reciter picked by hand (keeps alignment honest). */
  seek(line: number) {
    const i = this.lineStart[line];
    this.idx = Number.isFinite(i) ? i - 1 : -1;   // one before the line, so its first word counts as a move
    this.misses = 0;
    this.status = "listening";
  }

  /** Feed the recogniser's current utterance transcript (cumulative, may
      revise earlier words). Returns the new position if it moved. */
  hear(transcript: string, isFinal: boolean): Pos | null {
    const ks = wordsOf(transcript).map(keyOf).filter(Boolean);
    /* a partial that only re-spells the last word is not new evidence; a
       miss is counted only when a fresh word arrived and still nothing fit */
    const fresh = ks.length > this.partial.length || isFinal;
    this.partial = ks;
    const moved = this.align(fresh);
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
  private runEndingAt(end: number, len: number, heard = ""): string {
    /* a word's final nasal is heard as often as not ("śobhita" for
       śobhitaṁ, "liṅga" for liṅgaṁ): when what was heard has none, the
       text's is left off too */
    let s = this.toks[end].key;
    if (heard && !/[mn]$/.test(heard) && /[mn]$/.test(s) && s.length > 2) s = s.slice(0, -1);
    for (let i = end - 1; i >= 0 && s.length < len; i--) s = this.toks[i].key + s;
    return s.slice(-len);   // the tail of a long compound, not the whole of it
  }
  /* ...and the run starting at `start`, for the head of a line: a reciter
     who begins a line has said its first sounds, not its last */
  private runStartingAt(start: number, len: number): string {
    let s = "";
    for (let i = start; i < this.toks.length && s.length < len; i++) s += this.toks[i].key;
    return s.slice(0, len);
  }
  private isLineStart(i: number): boolean { return i === 0 || this.toks[i].line !== this.toks[i - 1].line; }

  /* The bar a match must clear: short runs are easy to hit by accident,
     long ones tolerate more mishearing */
  private bar(len: number): number {
    return len >= 12 ? 0.58 : len >= 8 ? 0.63 : len >= 5 ? 0.7 : 0.78;
  }

  /* Best position in [from, to] for the tail of what was heard. Every
     suffix of the last few heard words is tried (a Hindi recogniser breaks
     one Sanskrit compound into several words, and drops junk words in
     between — a suffix that skips the junk still fits). Ties go to the
     position just ahead of the light. `strict` (used away from the light)
     wants a longer run, or one long word said exactly, and a clear winner
     over any other place in the text — including an identical one, since
     an ambiguous word must not teleport the light. */
  private best(from: number, to: number, keys: string[], cur: number, strict: boolean) {
    const scores: number[] = [];
    const inside: boolean[] = [];
    let bi = -1, bq = -Infinity;
    for (let e = Math.max(0, from); e <= Math.min(to, this.toks.length - 1); e++) {
      let q = -Infinity;
      const curLine = cur >= 0 ? this.toks[cur].line : -1;
      const far = this.toks[e].line > curLine + 1;      // more than a line ahead
      const minN = e < cur ? 2 : 1;
      for (let n = minN; n <= Math.min(6, keys.length); n++) {
        const h = keys.slice(-n).join("");
        if (h.length < (n > 1 ? 4 : 3)) continue;
        /* one word alone may carry the light more than a line ahead only
           when it is long and unmistakable — the case of ears that catch
           one word in three, which is how a compound-heavy verse is heard */
        const lone = n === 1 && (far || strict);
        if (lone && h.length < (strict ? 6 : 4)) continue;
        if (strict && n > 1 && h.length < 8) continue;
        const s = sim(h, this.runEndingAt(e, h.length, h));
        const over = lone ? s - (strict ? 0.95 : this.bar(h.length) + 0.1) : s - this.bar(h.length) - (strict ? 0.05 : 0);
        if (over > q) { q = over; inside[e] = false; }
        /* the head of a word ahead of the light: the first sounds of a
           compound are the ones the ears catch most reliably */
        if (!strict && e >= cur && this.toks[e].key.length > h.length + 1) {
          const sh = sim(h, this.runStartingAt(e, h.length));
          const oh = lone ? sh - (this.bar(h.length) + 0.1) : sh - this.bar(h.length) + 0.03;
          if (oh > q) { q = oh; inside[e] = true; }
        }
        /* the middle of a long compound: "rajatādri" is heard inside
           "rajatādriśṛṅganiketanaṁ" — the light belongs on that word, not
           past it. A little stricter than the ends, and never when lost. */
        if (!strict && n === 1 && h.length >= 4) {
          const key = this.toks[e].key;
          if (key.length >= h.length + 2) {
            let bs = 0;
            for (let p = 1; p + h.length < key.length; p++) { const sc = sim(h, key.slice(p, p + h.length)); if (sc > bs) bs = sc; }
            const oi = bs - this.bar(h.length) - 0.05 - (far ? 0.1 : 0);
            if (oi > q) { q = oi; inside[e] = true; }
          }
        }
      }
      scores[e] = q;
      /* nearest-ahead wins ties, and a fit that skips lines must be
         clearly better than one that does not — the refrain every stanza
         ends on fits the next stanza's as well as this one's, give or take
         the words before it; going back costs more than going on */
      const dist = Math.abs(e - (cur + 1));
      const nextLine = cur >= 0 ? this.toks[cur].line + 1 : 0;
      const skipped = Math.max(0, this.toks[e].line - nextLine - 1);
      const qq = q - (e < cur ? 0.1 + dist * 0.02 : dist * 0.004) - (strict ? 0 : skipped * 0.05);
      if (qq > bq) { bq = qq; bi = e; }
    }
    if (bi < 0 || scores[bi] < 0) return { idx: -1, margin: 0, inside: false };
    let second = -Infinity;
    for (let e = from; e <= to; e++) {
      if (scores[e] == null || Math.abs(e - bi) <= 2) continue;
      /* nearby, an identical fit (the refrain every verse ends on) is not a
         rival — the nearest one ahead was chosen; far away it is */
      if (!strict && scores[e] >= scores[bi] - 1e-9) continue;
      if (scores[e] > second) second = scores[e];
    }
    return { idx: bi, margin: scores[bi] - (second === -Infinity ? -1 : second), inside: !!inside[bi] };
  }

  /* The head of a line: a reciter who goes back to the first line, or
     skips to the next verse, has just said its first sounds. Compared
     against the start of every line, and taken only when one line's head
     fits exactly and no other comes close. Returns the line's first token. */
  private bestHead(keys: string[]) {
    let bi = -1, bs = 0, second = 0;
    for (let e = 0; e < this.toks.length; e++) {
      if (!this.isLineStart(e)) continue;
      let q = 0;
      for (let n = 1; n <= Math.min(4, keys.length); n++) {
        const h = keys.slice(-n).join("");
        if (h.length < 4) continue;
        /* one short word may only send the light back to the first line
           (the restart every reciter makes); any other line needs more */
        if (n === 1 && e > 0 && h.length < 6) continue;
        const sc = sim(h, this.runStartingAt(e, h.length));
        /* a longer run may be a little rougher; one word must be exact */
        const need = h.length >= 8 ? 0.8 : h.length >= 6 ? 0.88 : 0.95;
        if (sc >= need && sc > q) q = sc;
      }
      if (q > bs) { second = bs; bs = q; bi = e; } else if (q > second) second = q;
    }
    return bi >= 0 && bs - second >= 0.15 ? bi : -1;
  }

  private align(fresh: boolean): Pos | null {
    const keys = this.recent();
    if (!keys.length) return null;
    const joined = keys.join("");
    if (joined.length < 3) return null;       // too little to go on
    /* the same words that moved the light a moment ago — a final result
       repeating its partial — are not new evidence; without this a refrain
       shared by every stanza would carry the light a stanza on each time */
    if (joined === this.lastMoveOn) return null;
    /* nor is a partial that only re-spells its last word: the light moves
       on a new word, or on the final say of an utterance */
    if (!fresh && this.lastMoveOn && keys.length === this.lastMoveKeys) return null;
    const now = Date.now();

    /* near: a few words back to a few lines ahead of where we are */
    const cur = Math.max(this.idx, -1);
    const aheadLine = cur >= 0 ? this.toks[cur].line + 4 : 3;
    const aheadEnd = this.lineStart[aheadLine + 1] != null ? this.lineStart[aheadLine + 1] - 1 : this.toks.length - 1;
    const near = this.best(Math.max(0, cur - 3), aheadEnd, keys, cur, false);
    /* a partial being revised often re-fits a word or two back; the light
       does not follow that — small steps back are ignored unless lost */
    if (near.idx >= 0 && near.idx < cur && this.status !== "lost") return null;
    /* the head or middle of the word the light is already on: stay */
    if (near.idx >= 0 && near.inside && near.idx <= cur) return null;
    if (near.idx >= 0) return this.moveTo(near.inside ? near.idx - 1 : near.idx, now, joined);

    /* the head of some line, anywhere: the deliberate jump */
    const head = this.bestHead(keys);
    if (head >= 0 && head !== cur + 1) return this.moveTo(head - 1, now, joined);

    if (fresh) this.misses++;
    if (this.misses >= 5) this.status = "lost";   // even after "done": starting over re-finds

    /* lost: search everywhere, but only on strong evidence — a longer run
       or one long word said exactly, and a clear winner, so a stray
       "sarva" can't teleport the light */
    if (this.status === "lost") {
      const far = this.best(0, this.toks.length - 1, keys, cur, true);
      if (far.idx >= 0 && far.margin >= 0.1) return this.moveTo(far.idx, now, joined);
    }
    return null;
  }

  private moveTo(i: number, now: number, heard: string): Pos | null {
    const changed = i !== this.idx;
    this.idx = i;
    this.misses = 0;
    this.lastMoveAt = now;
    this.lastMoveOn = heard;
    this.lastMoveKeys = this.recent().length;
    /* "done" only once the last word has actually been said, not on a
       partial of it — the tail of what was heard must resemble the whole key */
    const last = this.toks[this.toks.length - 1].key;
    const finished = i >= this.toks.length - 1 && sim(heard.slice(-last.length), last) >= 0.7;
    this.status = finished ? "done" : "listening";
    return changed ? this.lead : null;
  }

  get atEnd() { return this.status === "done"; }
  get tokenCount() { return this.toks.length; }
}

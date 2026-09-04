/* ============================================================
   STUTI — provided recitation (the Listen seam)
   Listen mode was written before there was anything to listen to, so it
   was hidden behind one boolean. This is that boolean turned into a
   question the app can actually answer: is there a recording for THIS
   hymn, and where do its lines fall in it.

   A recording is registered as:

     window.STUTI_AUDIO.register({
       "ganesha-sahasranama": {
         src: "audio/ganesha-sahasranama.m4a",
         lines: [0, 4.2, 8.9, 13.4, ...],   // seconds — one per recitable line
         dur: 962.5                          // optional; the file's own length
       }
     });

   `lines` is the whole contract. One entry per line of the flattened text —
   the same flattening the reader does (every verse split on its newlines, in
   order) — giving the second at which that line begins. The reader checks the
   count against its own line list and ignores a recording that disagrees,
   because a cue table off by one line is worse than no recording at all: it
   would light the wrong line for the whole hymn.

   Nothing here fetches anything. Registering a hymn is what turns Listen on
   for it, and the service worker caches the audio file like any other asset.
   ============================================================ */
window.STUTI_AUDIO = (function () {
  const BANK = {};

  function register(map) {
    if (!map || typeof map !== "object") return 0;
    let n = 0;
    Object.keys(map).forEach((id) => {
      const r = map[id];
      if (!r || typeof r.src !== "string" || !Array.isArray(r.lines) || r.lines.length < 1) return;
      /* a cue table must climb: an out-of-order entry means the file was
         written by hand and not checked, and it would jump the reader back */
      for (let i = 1; i < r.lines.length; i++) if (!(r.lines[i] > r.lines[i - 1])) return;
      BANK[id] = { src: r.src, lines: r.lines.slice(), dur: Number(r.dur) || 0, by: r.by || null };
      n++;
    });
    return n;
  }

  /* the recording for a hymn, only if its cue table fits that hymn's lines */
  function get(id, lineCount) {
    const r = BANK[id];
    if (!r) return null;
    if (lineCount != null && r.lines.length !== lineCount) return null;
    return r;
  }

  const clamp = (r, i) => Math.max(0, Math.min(r.lines.length - 1, i));
  function startOf(r, i) { return r.lines[clamp(r, i)]; }
  function endOf(r, i) {
    const j = clamp(r, i);
    if (j + 1 < r.lines.length) return r.lines[j + 1];
    return r.dur || r.lines[j] + 6;
  }
  /* which line is sounding at t seconds — a walk, not a search: the reader
     asks this on every timeupdate and the table is at most a thousand long */
  function lineAt(r, t) {
    const L = r.lines;
    let i = 0;
    while (i + 1 < L.length && t >= L[i + 1]) i++;
    return i;
  }

  return {
    register, get, startOf, endOf, lineAt,
    has: (id) => !!BANK[id],
    ids: () => Object.keys(BANK),
    count: () => Object.keys(BANK).length,
  };
})();

/* No recordings are registered yet. When the first one is made, its
   register() call goes here (or in its own file loaded after this one),
   and Listen appears in the learn bar for that hymn alone. */

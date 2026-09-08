import { STUTI } from "./stuti-data";

/* ============================================================
   STUTI — provenance of every text
   A stotra is either proofed against a named printed source, or
   it is awaiting proof; there is no third state and nothing is
   hidden. The reader shows this quietly at the end of the text
   and offers the "text is wrong" door beside it. This ledger is
   the single place the fact lives — the shelf-by-shelf pass fills
   it in, one line per hymn id:

     "shiva-rudrashtakam": { src: "Rāmacaritamānasa, Gītā Press 1962, Uttarakāṇḍa 108", by: "..." }

   Any id not listed here is awaiting proof. `by` is the reviewer
   who lent their name, if one has; shown only when present.
   ============================================================ */
export const STUTI_PROOF = (function () {
  const LEDGER = {
  };
  function status(id) {
    const r = LEDGER[id];
    return r && r.src ? { proofed: true, src: r.src, by: r.by || null } : { proofed: false, src: null, by: null };
  }
  const counts = () => {
    let p = 0, a = 0;
    try { STUTI.hymns.forEach((h) => { if (h.catalog) return; status(h.id).proofed ? p++ : a++; }); } catch (e) {}
    return { proofed: p, awaiting: a };
  };
  return { status, counts, LEDGER };
})();

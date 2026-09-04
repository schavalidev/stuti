/* ============================================================
   STUTI — the flyleaf
   Who is reciting. Gotra, nāma, the gender the clause is declined
   for, the intention usually kept, and which cosmographic frame the
   reciter holds when they are outside Bhārata.

   Called the flyleaf and not a profile on purpose. There is no
   account here, no avatar, nothing synced. It is the inside cover of
   a family prayer book: written once, in pencil, and consulted for
   years. It never leaves the device, and it must never enter the push
   payload — a cue server needs a place and a timezone to reckon
   junctures, and has no business knowing anyone's gotra.

   Two things are deliberately NOT stored here.

   The deśa clause itself. Only the *preference* is kept — which
   frame you hold, or a clause of your own. The river, the bank and
   the kṣetra are read off the location every time, because travel has
   to change them. Freezing the derived text at first run would make
   the app confidently say Godāvarī in Chicago.

   Anything about practice. What was read, what was kept, what
   lapsed — none of it belongs beside a name.

   Stored as a list with one entry. Households share a gotra but not
   a name, and the clause is declined differently for husband and
   wife (gotrasya / gotrāyāḥ), so a second reciter is one entry away.
   We do not offer it yet; we only decline to make it expensive.
   ============================================================ */
window.STUTI_FLYLEAF = (function () {
  const KEY = "stuti-flyleaf";
  const DEF = { gotra: "", nama: "", gender: "male", karma: "parayana", frame: "", desa: "", asked: "" };
  /* the six loose keys the saṅkalpa sheet used to write, read once and folded in */
  const OLD = { gotra: "stuti-gotra", nama: "stuti-nama", gender: "stuti-gender",
                karma: "stuti-karma", frame: "stuti-frame", desa: "stuti-desa" };

  function fresh() {
    const e = Object.assign({}, DEF);
    Object.keys(OLD).forEach((k) => {
      try { const v = localStorage.getItem(OLD[k]); if (v != null && v !== "") e[k] = v; } catch (err) {}
    });
    return { v: 1, at: 0, reciters: [e] };
  }
  let doc;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    doc = (raw && Array.isArray(raw.reciters) && raw.reciters.length)
      ? { v: 1, at: raw.at || 0, reciters: raw.reciters.map((r) => Object.assign({}, DEF, r)) }
      : fresh();
  } catch (e) { doc = fresh(); }

  const subs = new Set();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(doc)); } catch (e) {}
    subs.forEach((fn) => fn(cur()));
  }
  const cur = () => doc.reciters[doc.at] || doc.reciters[0];

  return {
    get: cur,
    all: () => doc.reciters.slice(),
    set: (patch) => {
      const r = doc.reciters.slice();
      r[doc.at] = Object.assign({}, cur(), patch);
      doc = Object.assign({}, doc, { reciters: r });
      save();
    },
    /* the clause needs both halves to read as a sentence — a gotra with
       ____ for a name is not a saṅkalpa, it is a form */
    ready: () => { const e = cur(); return !!(e.gotra || "").trim() && !!(e.nama || "").trim(); },
    started: () => { const e = cur(); return !!((e.gotra || "").trim() || (e.nama || "").trim()); },

    /* ---- travel ----
       Times follow the device silently; nobody's school disagrees about
       what hour it is. The deśa clause is different: outside Bhārata the
       traditions genuinely differ about which varṣa you stand in, and
       changing what a person says in their rite is not ours to do quietly.
       So we ask once per crossing, on the card where the consequence is
       visible, and remember the answer. Inside Bhārata there is nothing to
       ask — the frame is not in dispute and the river simply updates. */
    asksFrame: (loc) => {
      const DS = window.STUTI_DESA;
      if (!DS || !loc) return null;
      const e = cur();
      if ((e.desa || "").trim()) return null;      /* their own clause outranks ours */
      if (DS.inIndia(loc)) return null;
      const s = DS.suggest(loc);
      return e.asked === s || e.frame === s || e.frame === "bharata" ? null : s;
    },
    settleFrame: (key, suggested) => {
      const r = doc.reciters.slice();
      r[doc.at] = Object.assign({}, cur(), { frame: key, asked: suggested || key });
      doc = Object.assign({}, doc, { reciters: r });
      save();
    },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

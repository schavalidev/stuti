/* ============================================================
   STUTI — dakṣiṇā, and what it lights
   Nothing in this app is withheld. The texts, the scripts, the
   meanings, print, share, the pañcāṅga — all of it is open to
   everyone, and giving is asked for rather than charged. That is
   not generosity for its own sake: a reciter who is blocked
   leaves, and a reciter who is asked plainly gives more than a
   subscription would have taken.

   What a gift buys is a lamp in the giver's name — kept in the
   app, and named in the colophon for those who want it. Until a
   payment rail exists nothing can be taken, so `give` records a
   preview only, and every screen says so.
   ============================================================ */
/* Razorpay, wired for when it's real: fill these in from the dashboard and
   dakshina switches from a preview to an actual charge, with no other code
   change and no backend. keyId is unused by the button embed below (kept
   for a future order-based flow) — what actually takes the money is one
   Razorpay "Payment Button" per amount (Payment Pages → Payment Buttons),
   each created for exactly that amount, so Razorpay enforces it server-side
   and no secret key ever needs to live in this file. Leave a slot blank to
   keep that amount's sheet exactly as it reads today. */
export const STUTI_RAZORPAY = { day: "", month: "", year: "", patron: "" };

export const STUTI_DANA = (function () {
  const subs = new Set();
  const emit = () => subs.forEach(fn => { try { fn(); } catch (e) {} });
  const KEY = "stuti-dana", NOTE = "stuti-dana-interest";
  let rec = null, noted = false;
  try { rec = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { rec = null; }
  try { noted = localStorage.getItem(NOTE) === "1"; } catch (e) {}

  /* Four amounts, each named for what it keeps alight rather than for a tier —
     an oil lamp is the unit this audience already gives in. The patron amount is
     the only one that asks for a name, because it is the only one that prints it. */
  const AMOUNTS = [
    { id: "day",    inr: "₹251",   key: "danaAmtDay" },
    { id: "month",  inr: "₹1,100", key: "danaAmtMonth" },
    { id: "year",   inr: "₹2,500", key: "danaAmtYear" },
    { id: "patron", inr: "₹5,001", key: "danaAmtPatron", named: true },
  ];

  const byId = (id) => AMOUNTS.find(a => a.id === id) || AMOUNTS[0];
  const save = () => { try { rec ? localStorage.setItem(KEY, JSON.stringify(rec)) : localStorage.removeItem(KEY); } catch (e) {} emit(); };

  /* A gift that has not been taken must not be shown as one: the record carries
     preview until a rail exists, and the lamp card says as much. */
  function give(o) {
    const a = byId(o && o.id);
    rec = { id: a.id, inr: a.inr, name: (o && o.name || "").trim(), at: Date.now(), preview: true };
    save();
    return rec;
  }
  function clear() { rec = null; save(); }

  return {
    amounts: AMOUNTS, byId,
    supporter: () => rec,
    gave: () => !!rec,
    give, clear,
    interested: () => noted,
    note: () => { noted = true; try { localStorage.setItem(NOTE, "1"); } catch (e) {} emit(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

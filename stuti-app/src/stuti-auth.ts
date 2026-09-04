/* ============================================================
   STUTI — the account, against a stub
   There is no server. This file is the shape of one: sign-in
   methods that record a local session, a profile the app already
   knows how to use (nāma and gotra come from the saṅkalpa), and
   a sync state that says plainly that nothing is syncing yet.
   The day Firebase — or anything else — exists, only signIn,
   signOut and syncState have to learn to call it; every screen
   already reads them.
   ============================================================ */
export const STUTI_AUTH = (function () {
  const KEY = "stuti-session";
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { s = null; }
  const subs = new Set();
  const emit = () => subs.forEach(fn => { try { fn(s); } catch (e) {} });
  const save = () => { try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch (e) {} emit(); };

  /* What the real thing will return: a provider, a display name, and a stable
     id. Nothing here is verified, and the screen says so — a sign-in that
     pretends to have authenticated is worse than one that admits it is a shell. */
  function signIn(provider, detail) {
    s = {
      provider: provider,                       // google | phone | email
      name: (detail && detail.name) || "",
      handle: (detail && detail.handle) || "",  // the number or address, as given
      id: "local-" + Math.random().toString(36).slice(2, 10),
      at: Date.now(),
      stub: true,                               // no server saw this
    };
    save();
    return s;
  }
  function signOut() { s = null; save(); }

  /* three states, and only one of them is a lie waiting to be told: "syncing".
     Until a server exists this answers "waiting". */
  function syncState() {
    if (!s) return "signedOut";
    return "waiting";
  }

  return {
    get: () => s,
    signedIn: () => !!s,
    signIn, signOut, syncState,
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

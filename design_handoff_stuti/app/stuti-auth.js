/* ============================================================
   STUTI — the account, against a stub or an adapter
   With no adapter this records a local session and says plainly
   that nothing is syncing. The real client (stuti-app/src/backend/
   auth.ts) calls configure(adapter) before render; from then on
   signIn, verify, signOut, deleteAccount and syncState go through
   it, and every screen that already reads them shows the truth.
   Adapter shape:
     signIn(provider, detail) -> Promise<{ pending: true } | session>
     verify(code)             -> Promise<session>
     signOut()                -> Promise<void>
     deleteAccount()          -> Promise<void>
     current()                -> session | null
     onChange(fn)             -> unsubscribe
     syncState()              -> waiting | syncing | synced | conflict | offline
   ============================================================ */
window.STUTI_AUTH = (function () {
  const KEY = "stuti-session";
  let s = null, A = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { s = null; }
  const subs = new Set();
  const emit = () => subs.forEach(fn => { try { fn(s); } catch (e) {} });
  const save = () => { try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch (e) {} emit(); };

  function configure(adapter) {
    A = adapter || null;
    if (A) { s = A.current() || null; emit(); A.onChange((sess) => { s = sess || null; emit(); }); }
  }

  /* stub path: a provider, a display name, a stable id, and stub: true so the
     screen can say nothing was verified */
  function signIn(provider, detail) {
    if (A) return A.signIn(provider, detail);
    s = { provider, name: (detail && detail.name) || "", handle: (detail && detail.handle) || "",
          id: "local-" + Math.random().toString(36).slice(2, 10), at: Date.now(), stub: true };
    save();
    return Promise.resolve(s);
  }
  function verify(code) { return A ? A.verify(code) : Promise.resolve(s); }
  function signOut() { if (A) return A.signOut(); s = null; save(); return Promise.resolve(); }
  function deleteAccount() { if (A) return A.deleteAccount(); s = null; save(); return Promise.resolve(); }

  function syncState() {
    if (!s) return "signedOut";
    return A ? A.syncState() : "waiting";
  }

  return {
    get: () => s,
    signedIn: () => !!s,
    configured: () => !!A,
    configure, signIn, verify, signOut, deleteAccount, syncState,
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

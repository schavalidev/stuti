/* ============================================================
   stuti-backstop.js — the device Back button, over a sheet.

   A stack of "close me" callbacks. While a sheet or tools panel
   is open it registers its closer here; the app's popstate
   handler asks this stack before it moves between screens, so one
   Back press shuts the open sheet and the screen stays put. Only
   an empty stack lets Back walk the screens back and, at Home,
   leave the app. Last opened is first closed.
   ============================================================ */
window.STUTI_BACKSTOP = (function () {
  const stack = [];
  return {
    /* register a closer; returns an unregister to call when the sheet closes
       on its own (a scrim tap, a Done button) so Back never closes it twice */
    push: function (fn) {
      stack.push(fn);
      return function () { const i = stack.indexOf(fn); if (i !== -1) stack.splice(i, 1); };
    },
    /* close the topmost open sheet, if there is one. Returns true when it did —
       the caller then cancels the navigation the Back press would have made */
    pop: function () {
      const fn = stack.pop();
      if (!fn) return false;
      try { fn(); } catch (e) {}
      return true;
    },
    any: function () { return stack.length > 0; },
  };
})();

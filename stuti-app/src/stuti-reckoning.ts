import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { STUTI_PREFS } from "./stuti-prefs";

/* ============================================================
   STUTI — which reckoning is in force
   Four questions the engine asks before it computes anything:
   whose ayanāṁśa, drik or vākya, amānta or pūrṇimānta, and the
   month to print for a day. The engine reads them off window so
   nothing between it and the Rsine table has to carry them as
   arguments; these are the answers, read from the preference
   store at call time so a change takes effect on the next tick.

   Both apps load this, so a setting made in one holds in the
   other — there is one reciter and one set of habits.
   ============================================================ */
export const masaSys = function () {
  try { return STUTI_PREFS.get().masaSystem || "amanta"; } catch (e) { return "amanta"; }
};
/* the month object to display for a pañcāṅga day, in the chosen reckoning */
export const masaShown = function (pa) {
  try { return AKSHARA_PANCHANGA.masaOf(pa, masaSys()); } catch (e) { return pa && pa.masa; }
};
export const ayanSys = function () {
  try { return STUTI_PREFS.get().ayanamsa || "lahiri"; } catch (e) { return "lahiri"; }
};
/* drik follows the sky; vākya follows the Sūrya Siddhānta's arithmetic. The
   engine hands this to the ephemeris before it asks for an angle — this file
   only reads the preference and never touches the ephemeris itself. */
export const reckoning = function () {
  try { return STUTI_PREFS.get().reckoning || "drik"; } catch (e) { return "drik"; }
};
/* whose rule decides a contested vrata day */
export const sampradaya = function () {
  try { return STUTI_PREFS.get().sampradaya || "smarta"; } catch (e) { return "smarta"; }
};
/* cāndramāna names the lunar month in a saṅkalpa; sauramāna the solar one */
export const manaSys = function () {
  try { return STUTI_PREFS.get().mana || "candra"; } catch (e) { return "candra"; }
};

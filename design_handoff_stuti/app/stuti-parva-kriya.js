/* ============================================================
   STUTI — the parva kriyā-mantra index and loader
   The words a rite prescribes for its own act — the line said while
   tying the rakṣā, offering the sky-lamp, giving the pot, eating the
   neem. These are not the stotras of the deity shelf; they are the
   fixed text a Purāṇa ties to one physical act of the day. Like the
   stories, they are too many to parse before the first screen is
   drawn, so this small file — loaded eagerly — holds only the index:
   which day carries a recitation, and which month's chunk it lives in.
   The mantra itself sits in parva-kriya/<month>.js, fetched the first
   time a reader opens a day in that month and cached by the service
   worker for the pūjā room after.
   Each day id maps to an array of mantras; a day may carry several.
   Month index follows the amānta order: Caitra 0 … Phālguna 11.
   ============================================================ */
window.STUTI_PARVA_KRIYA = (function () {
  /* day id → amānta month index. Adding a mantra means one line here
     and one entry in that month's chunk. */
  const MONTH_OF = {
    "ugadi": 0,
    "chalivendra": 0,
    "vata-savitri": 1,
    "vaisakha-snana": 1,
    "ganga-dashahara": 2,
    "devashayani-ekadashi": 3,
    "kokila-vrata": 3,
    "upakarma": 4,
    "janmashtami": 4,
    "ananta-caturdashi": 5,
    "govatsa-dvadashi": 6,
    "dhana-trayodashi": 6,
    "dipavali": 6,
    "bali-padyami": 7,
    "yama-dvitiya": 7,
    "tulasi-vivaha": 7,
    "kartika-purnima": 7,
    "kartika-snana": 7,
    "bhishma-panchaka": 7,
    "margashira-snana": 8,
    "ratha-saptami": 10,
    "magha-snana": 10,
    "holi": 11,
  };
  const CHUNK = (m) => "parva-kriya/" + [
    "caitra", "vaisakha", "jyeshtha", "ashadha", "shravana", "bhadrapada",
    "ashvina", "kartika", "margashira", "pushya", "magha", "phalguna",
  ][m] + ".js";

  const store = {};        // id → array of mantra objects, filled as chunks load
  const pending = {};      // month → Promise, so a chunk loads once

  /* a chunk calls this at the end of its file */
  function register(obj) { Object.assign(store, obj); }

  function has(id) { return Object.prototype.hasOwnProperty.call(MONTH_OF, id); }
  function get(id) { return store[id] || null; }

  function load(id) {
    if (!has(id)) return Promise.resolve(null);
    if (store[id]) return Promise.resolve(store[id]);
    const m = MONTH_OF[id];
    if (!pending[m]) {
      pending[m] = new Promise((resolve) => {
        const s = document.createElement("script");
        s.src = CHUNK(m);
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => { pending[m] = null; resolve(); };  // let a later open retry
        document.head.appendChild(s);
      });
    }
    return pending[m].then(() => store[id] || null);
  }

  return { register, has, get, load };
})();

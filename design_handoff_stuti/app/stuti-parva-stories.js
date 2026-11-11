/* ============================================================
   STUTI — the parva story index and loader
   The full moons and the ekādaśīs carry their stories in files loaded
   at startup; the parva dinams are too many to parse before the first
   screen is drawn. So this file — small, loaded eagerly — holds only
   the index: which parva carries a story, and which month's chunk it
   lives in. The story itself sits in parva-stories/<month>.js, fetched
   the first time a reader opens a day in that month and cached by the
   service worker for the pūjā room after. Each chunk registers its
   entries here; nothing of the corpus is parsed until it is asked for.
   Month index follows the amānta order: Caitra 0 … Phālguna 11.
   ============================================================ */
window.STUTI_PARVA_STORIES = (function () {
  /* parva id → amānta month index. Adding a story means one line here
     and one entry in that month's chunk. */
  const MONTH_OF = {
    "matsya-jayanti": 0,
    "rama-navami": 0,
    "akshaya-tritiya": 1,
    "narada-jayanti": 1,
    "vasavi-jayanti": 1,
    "parashurama-jayanti": 1,
    "nrsimha-jayanti": 1,
    "sita-navami": 1,
    "shankara-jayanti": 1,
    "vata-savitri": 1,
    "ganga-saptami": 1,
    "ganga-dashahara": 2,
    "ratha-yatra": 3,
    "janmashtami": 4,
    "garuda-panchami": 4,
    "kalki-jayanti": 4,
    "gayatri-jayanti": 4,
    "varalakshmi": 4,
    "naga-panchami": 4,
    "shitala-saptami": 4,
    "hartalika": 5,
    "swarna-gauri": 5,
    "rishi-panchami": 5,
    "vamana-jayanti": 5,
    "ganesha-chaturthi": 5,
    "radha-ashtami": 5,
    "ananta-caturdashi": 5,
    "durgashtami": 6,
    "mahanavami": 6,
    "dhana-trayodashi": 6,
    "padmanabha-dvadashi": 6,
    "dipavali": 6,
    "vijayadashami": 6,
    "lalita-panchami": 6,
    "sarasvati-avahana": 6,
    "govatsa-dvadashi": 6,
    "gopashtami": 7,
    "bali-padyami": 7,
    "yama-dvitiya": 7,
    "kalabhairava-jayanti": 7,
    "vaikuntha-caturdashi": 7,
    "skanda-shashti": 7,
    "ksheerabdi-dvadashi": 7,
    "nagula-cavithi": 7,
    "subrahmanya-shashti": 8,
    "mitra-saptami": 8,
    "kurma-dvadashi": 9,
    "sakata-caturthi": 9,
    "ratha-saptami": 10,
    "bhishmashtami": 10,
    "madhva-navami": 10,
    "varaha-dvadashi": 10,
    "shivaratri": 10,
    "vasanta-panchami": 10,
  };
  const CHUNK = (m) => "parva-stories/" + [
    "caitra", "vaisakha", "jyeshtha", "ashadha", "shravana", "bhadrapada",
    "ashvina", "kartika", "margashira", "pushya", "magha", "phalguna",
  ][m] + ".js";

  const store = {};        // id → story object, filled as chunks load
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

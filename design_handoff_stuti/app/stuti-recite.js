/* ============================================================
   STUTI — per-stotra recitation config
   Six movements, individually toggleable (viniyoga and dhyānam
   share one UI row but store separately): pūrvapīṭhikā, viniyoga,
   nyāsa-pañcapūjā (if present), dhyānam, the sahasranāma stōtram
   itself (always on), phalaśruti, kṣamāprārthanā-samarpaṇam. The
   reader only has two real text boundaries — before the names and
   after — so pūrva/viniyoga/dhyānam move the pūrva tab together
   and phala/kṣamā move the uttara tab together; nyāsa alone has
   its own real boundary via STUTI_RITUAL. Stored per hymn.
   ============================================================ */
window.STUTI_RECITE = (function () {
  const KEY = "stuti-recite-cfg";
  const FULL = { purva: true, viniyoga: true, nyasa: true, dhyanam: true, phala: true, ksama: true };
  let all;
  try { all = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { all = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {} };
  const get = (id) => Object.assign({}, FULL, all[id] || {});
  const isCustom = (id) => { const c = all[id]; if (!c) return false; return Object.keys(FULL).some((k) => c[k] === false); };
  const set = (id, cfg) => { all[id] = Object.assign({}, FULL, cfg); save(); };
  const clear = (id) => { delete all[id]; save(); };
  const hasPurva = (cfg) => !!(cfg.purva || cfg.viniyoga || cfg.dhyanam);
  const hasUttara = (cfg) => !!(cfg.phala || cfg.ksama);
  return { get, set, clear, isCustom, hasPurva, hasUttara, FULL };
})();

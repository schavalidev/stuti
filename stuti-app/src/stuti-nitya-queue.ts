/* ============================================================
   STUTI — the "what's queued next" handoff between Home and Reader
   Home's daily list hands the Reader a whole queue (not just the one
   hymn tapped) so "Begin" can auto-advance through the rest of the
   list. Used to be window.STUTI_NITYA_Q/_AUTO/_SPEED, three loose
   globals two screens poked directly; same shape, module-scoped.
   ============================================================ */
export type NityaQueue = { ids: string[]; idx: number; from?: string } | null;

let queue: NityaQueue = null;
let autoAdvance = false;
let speed = 1;

export const nityaQueue = {
  get: () => queue,
  set: (q: NityaQueue) => { queue = q; },
  getAuto: () => autoAdvance,
  setAuto: (v: boolean) => { autoAdvance = v; },
  getSpeed: () => speed,
  setSpeed: (v: number) => { speed = v; },
};

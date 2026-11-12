/* ============================================================
   STUTI — what the launch spent its time on
   Hand-authored, and imported before anything else the app does, so
   `t0` is taken while the module graph is still being read.

   Why this exists: a tester reported the first launch taking about
   seven seconds, and two attempts to find it by measuring on a laptop
   named the wrong thing twice. The device's journal could say only
   that one main-thread task of some 3,350 ms happened "on home", and
   because its own observer is not installed until after React has
   drawn, it could not see whether that task was the reading of the
   script, the first render, or something after it.

   So the marks are taken here instead, from the page's own time
   origin, and the journal prints them as its first line. The
   long-task observer is installed with `buffered: true` for the same
   reason: the task that matters has already happened by the time any
   of the app's own code could ask about it.

   Nothing here decides anything; it only records. The cost is a
   handful of numbers per launch, carried on a line the journal was
   already sending.
   ============================================================ */
type Task = [number, number];

const marks: Record<string, number> = {};
const tasks: Task[] = [];

export const BOOT = {
  /* when this module was read — the floor on how much of the launch is the
     engine getting as far as the app's first line */
  t0: Math.round(typeof performance !== "undefined" ? performance.now() : 0),
  note: "",
  mark(name: string) {
    try { marks[name] = Math.round(performance.now()); } catch (e) {}
  },
  /* one line for the journal: every mark since the time origin, the long tasks
     that have been seen, and whatever the launch wants to say for itself */
  line(): string {
    const parts: string[] = ["t0=" + BOOT.t0];
    for (const k of Object.keys(marks)) parts.push(k + "=" + marks[k]);
    try {
      const nav: any = performance.getEntriesByType("navigation")[0];
      if (nav) parts.push("resp=" + Math.round(nav.responseEnd), "dcl=" + Math.round(nav.domContentLoadedEventEnd));
    } catch (e) {}
    try {
      for (const p of performance.getEntriesByType("paint")) {
        parts.push((p.name === "first-contentful-paint" ? "fcp" : "fp") + "=" + Math.round(p.startTime));
      }
    } catch (e) {}
    if (tasks.length) parts.push("long=" + tasks.map((t) => t[0] + "+" + t[1]).join(","));
    if (BOOT.note) parts.push(BOOT.note);
    return parts.join(" ");
  },
};

try {
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (e.duration >= 100) tasks.push([Math.round(e.startTime), Math.round(e.duration)]);
    if (tasks.length > 24) tasks.length = 24;
  }).observe({ type: "longtask", buffered: true } as any);
} catch (e) {}

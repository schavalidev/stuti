// Two breaks found in the S76 audit and confirmed again in S101, scripted so a
// re-port keeps them mended. Each fails loudly if its anchor is gone.
//  1. "Open" on the home lead-up strip, and the vidhanam jump, routed to a
//     "vrata" view the router does not have; it fell through to a bare Home
//     with no tab lit. The sibling cards already go through the Library.
//  2. A learn-by-heart day was finished, then the next day mounted in the
//     same tick, so a whole plan could be done in one sitting. Hold the day
//     just finished on screen until the date turns.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../../src");
function patch(file, from, to, what) {
  const p = join(OUT, file); const t = readFileSync(p, "utf8");
  if (t.includes(to)) return;
  if (!t.includes(from)) throw new Error(`${file}: ${what} — anchor not found`);
  writeFileSync(p, t.replace(from, to));
}
patch("stuti-home.tsx",
  `onClick={() => go("vrata", { vrata: v.id })}`,
  `onClick={() => go("browse", { libSub: { kind: "vrata", key: v.id, returnTo: "home" } })}`,
  "lead-up strip Open");
patch("stuti-vidhi-jump.tsx",
  `deity: deity || hymn.deity, from: "vrata" }`,
  `deity: deity || hymn.deity, from: "browse" }`,
  "vidhanam jump back target");
patch("stuti-plans.tsx",
  `const doneToday = plan.last === STUTI_THREAD.dkey() && plan.done.indexOf(day) >= 0;`,
  `const doneToday = plan.last === STUTI_THREAD.dkey() && plan.done.length > 0;
  const shown = doneToday && !plan.finished ? plan.done[plan.done.length - 1] : day;`,
  "plan day guard");
patch("stuti-plans.tsx",
  `<PlanDay key={hymnId + ":" + day} hymn={hymn} deity={deity} day={day}`,
  `<PlanDay key={hymnId + ":" + shown} hymn={hymn} deity={deity} day={shown}`,
  "plan day mount");
// 3. The privacy note said "no account, no server" beside a working sign-in
//    that syncs to an account. Say what is true: local unless you sign in.
patch("stuti-i18n.ts",
  `roman: "All your data stays on this phone — no account, no server. This is where you delete it.", deva: "आपका सारा डेटा इसी फोन में रहता है — न खाता, न सर्वर। उसे हटाना हो तो यहीं से।", telugu: "మీ సమాచారం అంతా ఈ ఫోన్‌లోనే ఉంటుంది — ఖాతా లేదు, సర్వర్ లేదు. దాన్ని తొలగించాలన్నా ఇక్కడే."`,
  `roman: "Unless you sign in, all your data stays on this phone. This is where you delete it.", deva: "जब तक आप साइन इन न करें, आपका सारा डेटा इसी फोन में रहता है। उसे हटाना हो तो यहीं से।", telugu: "మీరు సైన్ ఇన్ చేయకపోతే, మీ సమాచారం అంతా ఈ ఫోన్‌లోనే ఉంటుంది. దాన్ని తొలగించాలన్నా ఇక్కడే."`,
  "privacy note");
console.log("fix-audit-routes: ok");

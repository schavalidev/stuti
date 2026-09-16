// The real account (stuti-cloud.ts): both shells take AccountView from the
// hand-authored stuti-account-cloud.tsx, which falls back to the design's own
// screen while Supabase is unconfigured; Settings gets a row that opens it.
// Literal anchors; a moved one fails here.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
function edit(file, pairs) {
  const F = join(HERE, "../../src/" + file);
  let t = readFileSync(F, "utf8");
  for (const [from, to, what] of pairs) { if (!t.includes(from)) throw new Error(`fix-account-seam: anchor not found in ${file} — ${what}`); t = t.replace(from, to); }
  writeFileSync(F, t);
}
for (const f of ["stuti-main.tsx", "stuti-wide-main.tsx"])
  edit(f, [[`import { AccountView } from "./stuti-account";`, `import { AccountView } from "./stuti-account-cloud";`, "AccountView import"]]);
edit("stuti-settings.tsx", [
  [`import { STUTI_BUILD } from "./stuti-build";`, `import { STUTI_BUILD } from "./stuti-build";\nimport { AccountRow } from "./stuti-account-row";`, "import"],
  [`<SetRow label={L.t("accComing", uiLang)} sub={L.t("accComingSub", uiLang)} />`, `<AccountRow lang={uiLang} Row={SetRow} go={go} />`, "the coming-later row"],
]);
console.log("account seam applied");

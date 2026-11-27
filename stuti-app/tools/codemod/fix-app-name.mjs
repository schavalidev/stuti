// The app is named Anushtaanam (अनुष्ठानम्, అనుష్ఠానం) from 27 Nov 2026 (S103).
// It was Stuti.
//
// This has to be a codemod and not an edit: every screen below comes from
// the design, and the design still says Stuti, so each port would put the
// old name back. Each patch names the exact text it replaces. Once the
// designer's own project carries the new name, a patch finds its
// replacement already there and passes as "upstream"; when every patch
// reports upstream this step can come out.
//
// Only the name the reader sees changes. The app id (com.stuti.app), the
// storage keys, the file names, Stuti.html, the APK name Stuti-vNN.apk the
// relay checks for, and the Stuti Sans typeface all keep the old word: those
// are identities, and changing them would cost a reciter their data or their
// installed app.
//
// Hindi and Telugu are rewritten, not substituted. स्तुति is feminine, and
// अनुष्ठानम् takes the masculine in Hindi, so the verbs change with it; Telugu
// verbs agree as before, but the case endings change (స్తుతికి → అనుష్ఠానానికి).
// Where स्तुति means a hymn of praise, as in "किसकी स्तुति करें?", it is the
// word and not the name, and it is left alone.
//
// Where a sentence sends the reader to Android's own settings, the name stays
// in Latin in every language, because that is how the phone lists the app.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { patcher } from "./seam-lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");

const R = "Anushtaanam", D = "अनुष्ठानम्", T = "అనుష్ఠానం";
const BRAND_OLD = `const BRAND_SCRIPT = { deva: "स्तुति", telugu: "స్తుతి" };`;
const BRAND_NEW = `const BRAND_SCRIPT = { deva: "${D}", telugu: "${T}" };`;
const STOPPED = [`>Open Stuti again to come back`, `>Open ${R} again to come back`, "the screen-stopped fallback"];

const PATCHES = {
  "stuti-main.tsx": [
    [BRAND_OLD, BRAND_NEW, "brand in script"],
    [`{uiLang === "telugu" ? "స్తుతి" : uiLang === "deva" ? "स्तुति" : "Stuti"}`,
     `{uiLang === "telugu" ? "${T}" : uiLang === "deva" ? "${D}" : "${R}"}`, "home brandbar"],
    STOPPED,
  ],
  "stuti-wide-main.tsx": [
    [BRAND_OLD, BRAND_NEW, "brand in script"],
    [`{BRAND_SCRIPT[lang] || "Stuti"}`, `{BRAND_SCRIPT[lang] || "${R}"}`, "rail name"],
    [`<span className="brand-script display">Stuti</span>`, `<span className="brand-script display">${R}</span>`, "wide brand, Latin under script"],
    [`<span className="brand-name display">Stuti</span>`, `<span className="brand-name display">${R}</span>`, "wide brand, Latin alone"],
    STOPPED,
  ],
  "stuti-onboard.tsx": [
    [`<span className="ob-brand-name display">Stuti</span>`, `<span className="ob-brand-name display">${R}</span>`, "onboarding brand"],
  ],
  "stuti-gate.tsx": [
    [`{lang === "telugu" ? "స్తుతి" : lang === "deva" ? "स्तुति" : "Stuti"}`,
     `{lang === "telugu" ? "${T}" : lang === "deva" ? "${D}" : "${R}"}`, "gate brand"],
    [`encodeURIComponent("Stuti beta")`, `encodeURIComponent("${R} beta")`, "gate mail subject"],
  ],
  "stuti-sky.tsx": [
    [`"the chosen sandhyās"} while Stuti is open.`, `"the chosen sandhyās"} while ${R} is open.`, "sandhyā nudge, lead"],
    [`"each chosen sandhyā"} opens, while Stuti is open.`, `"each chosen sandhyā"} opens, while ${R} is open.`, "sandhyā nudge, at the hour"],
  ],
  "stuti-nudge.ts": [
    [`title = "Stuti";`, `title = "${R}";`, "nudge title"],
    [`"Stuti · " + title`, `"${R} · " + title`, "sandhyā nudge title"],
  ],
  "stuti-home.tsx": [
    [`new Notification("Stuti · " + t("todaysPanchanga")`, `new Notification("${R} · " + t("todaysPanchanga")`, "pañcāṅga notification"],
  ],
  "stuti-share.tsx": [
    [`g.fillText("Stuti", W / 2, H - m - 52);`, `g.fillText("${R}", W / 2, H - m - 52);`, "share card mark"],
    [`' — Stuti</title>'`, `' — ${R}</title>'`, "share print title"],
    [`"<footer><b>Stuti</b> · "`, `"<footer><b>${R}</b> · "`, "share print footer"],
  ],
  "stuti-prep.tsx": [
    [`' — Stuti</title>'`, `' — ${R}</title>'`, "prep print title"],
    [`"<footer><b>Stuti</b> · "`, `"<footer><b>${R}</b> · "`, "prep print footer"],
    [`<span className="rm-notif-app">Stuti</span>`, `<span className="rm-notif-app">${R}</span>`, "prep notification preview"],
  ],
  "stuti-remind.tsx": [
    [`<span className="rm-notif-app">Stuti</span>`, `<span className="rm-notif-app">${R}</span>`, "reminder notification preview"],
  ],
  "stuti-build.ts": [
    [`const label = () => "Stuti " + VERSION`, `const label = () => "${R} " + VERSION`, "build label"],
  ],
  "stuti-feedback.tsx": [
    [`B && B.label ? B.label() : "Stuti"]`, `B && B.label ? B.label() : "${R}"]`, "feedback header fallback"],
  ],
  "stuti-i18n.ts": [
    ["or Tuesday. Stuti remembers the dates.", `or Tuesday. ${R} remembers the dates.`, "vowsEmpty roman"],
    ["तारीख़ें स्तुति याद रखेगी।", `तारीख़ें ${D} याद रखेगा।`, "vowsEmpty deva"],
    ["తేదీలు స్తుతి గుర్తుపెట్టుకుంటుంది.", `తేదీలు ${T} గుర్తుపెట్టుకుంటుంది.`, "vowsEmpty telugu"],
    ["Allow it for Stuti in Settings → Apps → Stuti → Permissions", `Allow it for ${R} in Settings → Apps → ${R} → Permissions`, "micDenied roman"],
    ["सेटिंग्स → ऐप्स → Stuti → अनुमतियाँ", `सेटिंग्स → ऐप्स → ${R} → अनुमतियाँ`, "micDenied deva"],
    ["సెట్టింగ్స్ → యాప్స్ → Stuti → అనుమతులు", `సెట్టింగ్స్ → యాప్స్ → ${R} → అనుమతులు`, "micDenied telugu"],
    [`roman: "Stuti is being tried by a few invited households`, `roman: "${R} is being tried by a few invited households`, "gateLede roman"],
    ["स्तुति सबके लिए खुलने से पहले कुछ आमंत्रित परिवारों में परखी जा रही है।", `${D} सबके लिए खुलने से पहले कुछ आमंत्रित परिवारों में परखा जा रहा है।`, "gateLede deva"],
    ["స్తుతి అందరికీ తెరవడానికి ముందు", "అనుష్ఠానాన్ని అందరికీ తెరవడానికి ముందు", "gateLede telugu"],
    ["Still not it. Stuti opens to everyone", `Still not it. ${R} opens to everyone`, "gateNoAgain roman"],
    ["कुछ सप्ताह में स्तुति सबके लिए खुलेगी;", `कुछ सप्ताह में ${D} सबके लिए खुलेगा;`, "gateNoAgain deva"],
    ["కొన్ని వారాల్లో స్తుతి అందరికీ తెరుస్తుంది;", `కొన్ని వారాల్లో ${T} అందరికీ తెరుస్తుంది;`, "gateNoAgain telugu"],
    ["Install Stuti to your home screen", `Install ${R} to your home screen`, "accComingSub roman"],
    ["इसे रखने के लिए स्तुति को होम स्क्रीन पर जोड़ें", `इसे रखने के लिए ${D} को होम स्क्रीन पर जोड़ें`, "accComingSub deva"],
    ["స్తుతిని హోమ్ స్క్రీన్‌కు జోడించండి", "అనుష్ఠానాన్ని హోమ్ స్క్రీన్‌కు జోడించండి", "accComingSub telugu"],
    [`roman: "rings while Stuti is open"`, `roman: "rings while ${R} is open"`, "remindOpenOnly roman"],
    [`deva: "स्तुति खुली हो तभी बजेगा"`, `deva: "${D} खुला हो तभी बजेगा"`, "remindOpenOnly deva"],
    [`telugu: "స్తుతి తెరిచి ఉంటేనే మోగుతుంది"`, `telugu: "${T} తెరిచి ఉంటేనే మోగుతుంది"`, "remindOpenOnly telugu"],
    [`"That file was not written by Stuti."`, `"That file was not written by ${R}."`, "carryBad roman"],
    [`"यह फाइल स्तुति ने नहीं लिखी।"`, `"यह फाइल ${D} ने नहीं लिखी।"`, "carryBad deva"],
    [`"ఈ ఫైలును స్తుతి రాయలేదు."`, `"ఈ ఫైలును ${T} రాయలేదు."`, "carryBad telugu"],
    [`telugu: "స్తుతి ఏదైనా టాబ్‌లో తెరిచి ఉంటే`, `telugu: "${T} ఏదైనా టాబ్‌లో తెరిచి ఉంటే`, "notifWhileOpen telugu"],
  ],
  "stuti-tarpana.ts": [
    ["source-specific — Stuti tests whether", `source-specific — ${R} tests whether`, "yama tarpaṇa roman"],
    ["tarpaṇa day — so Stuti names both candidates", `tarpaṇa day — so ${R} names both candidates`, "Bhīṣma roman"],
    ["by tradition; Stuti shows the sixteen-ghaṭikā span", `by tradition; ${R} shows the sixteen-ghaṭikā span`, "saṅkrānti roman"],
    ["స్తుతి క్షణానికి ఇరువైపులా", `${T} క్షణానికి ఇరువైపులా`, "saṅkrānti telugu"],
    ["Without your Veda and śākhā, Stuti will not name a day.", `Without your Veda and śākhā, ${R} will not name a day.`, "upākarma roman"],
    ["తెలియకుండా స్తుతి రోజును చెప్పదు", `తెలియకుండా ${T} రోజును చెప్పదు`, "upākarma telugu"],
    ["tradition decides. Stuti names the day it finds", `tradition decides. ${R} names the day it finds`, "caturdaśī roman"],
    ["స్తుతి కనిపించిన రోజును చెప్పి", `${T} కనిపించిన రోజును చెప్పి`, "caturdaśī telugu"],
    ["మారుతుంది; స్తుతి ఆ మంగళవారపు పగటిలో", `మారుతుంది; ${T} ఆ మంగళవారపు పగటిలో`, "yama tarpaṇa telugu"],
    ["కాబట్టి స్తుతి రెండు రోజులనూ చెబుతుంది", `కాబట్టి ${T} రెండు రోజులనూ చెబుతుంది`, "Bhīṣma telugu"],
  ],
  "stuti-ekadashi-data.ts": [
    ["not an error in either. Stuti follows the sampradāya set in Settings.", `not an error in either. ${R} follows the sampradāya set in Settings.`, "aruṇodaya note roman"],
    ["स्तुति सेटिंग्स में चुने सम्प्रदाय का अनुसरण करती है।", `${D} सेटिंग्स में चुने सम्प्रदाय का अनुसरण करता है।`, "aruṇodaya note deva"],
    ["సంప్రదాయాన్ని స్తుతి అనుసరిస్తుంది.", `సంప్రదాయాన్ని ${T} అనుసరిస్తుంది.`, "aruṇodaya note telugu"],
  ],
};

let applied = 0, upstream = 0;
for (const [file, patches] of Object.entries(PATCHES)) {
  const path = join(SRC, file);
  const p = patcher("fix-app-name", readFileSync(path, "utf8"));
  for (const [from, to, what] of patches) p.patch(from, to, `${file}: ${what}`);
  writeFileSync(path, p.text);
  applied += p.stats.applied; upstream += p.stats.upstream;
}
console.log(`app-name step: ${applied} applied, ${upstream} already upstream`);

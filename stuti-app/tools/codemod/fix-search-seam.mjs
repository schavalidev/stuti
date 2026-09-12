// Three things the founder asked of the search, applied to the generated
// stuti-main.tsx:
//
//  1. It matched a hymn only when the whole folded query appeared as one
//     unbroken run inside its names, so "vishnu sahasranamam" found nothing
//     at all — the catalogue calls it "Viṣṇu Sahasranāma Stotram" and the run
//     breaks at the m. The query is now read as words and scored by
//     src/stuti-search-match.ts (hand-authored), which also does the ranking
//     the old inline `rank` did, so near spellings arrive after exact ones
//     rather than nothing arriving at all.
//
//  2. Search opened as a screen of its own, replacing whatever was behind it.
//     It now opens over the calling screen: the view chain below runs for the
//     screen that called the search, and the search is rendered on top of it
//     as a sheet (CSS in src/stuti-app.css, hand-authored).
//
//  3. Arriving by the microphone, the text box still took focus and raised
//     the keyboard over a screen the reciter was talking to. It takes focus
//     only when the search was opened to be typed in.
//
// Every anchor is literal text from the prototype; a design update that moves
// one fails here rather than passing silently.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../src");
const file = join(SRC, "stuti-main.tsx");

let t = readFileSync(file, "utf8");
const sub = (from, to, what) => {
  if (!t.includes(from)) throw new Error(`fix-search-seam: anchor not found — ${what}`);
  t = t.replace(from, to);
};
const voiceFile = join(SRC, "stuti-voice.tsx");
function patchVoice(patches) {
  let v = readFileSync(voiceFile, "utf8");
  for (const [from, to, what] of patches) {
    if (!v.includes(from)) throw new Error(`fix-search-seam: anchor not found in stuti-voice.tsx — ${what}`);
    v = v.replace(from, to);
  }
  writeFileSync(voiceFile, v);
}

/* ---- 1. the matcher ---- */
sub(
  `import { VoiceButton } from "./stuti-voice";`,
  `import { VoiceButton } from "./stuti-voice";
import { matchScore, titleRank } from "./stuti-search-match";   // search seam: near spellings, not just exact runs`,
  "import of the matcher",
);

sub(
  `    const r = S.hymns.filter((h) => {
      const d = S.deityById[h.deity];
      return srFold([h.title, h.deva, h.tel, h.type, h.by, d && d.name, d && d.deva, d && d.tel, d && d.epithet].join(" ")).indexOf(qf) !== -1;
    });`,
  `    /* search seam: every word of the query must be answered somewhere in
       the hymn's names, by a word that begins the same way, that carries it,
       or that is a letter or two from it — so a reciter who does not know the
       catalogue's exact title still finds the stotra */
    const scored = [];
    for (const h of S.hymns) {
      const d = S.deityById[h.deity];
      const s = matchScore(qf, srFold([h.title, h.deva, h.tel, h.type, h.by, d && d.name, d && d.deva, d && d.tel, d && d.epithet].join(" ")));
      if (s > 0) scored.push({ h, s });
    }
    const r = scored.map((x) => x.h);
    const near = new Map(scored.map((x) => [x.h, x.s]));`,
  "the hymn filter",
);

sub(
  `    const rank = (h) => {
      const t = srFold([h.title, h.deva, h.tel].join(" "));
      const at = t.indexOf(qf);
      if (at === -1) return 3;
      if (at === 0) return 0;
      return t[at - 1] === " " ? 1 : 2;
    };
    r.sort((a, b) => rank(a) - rank(b) || (a.catalog ? 1 : 0) - (b.catalog ? 1 : 0));`,
  `    const rank = (h) => titleRank(qf, srFold([h.title, h.deva, h.tel].join(" ")));
    r.sort((a, b) => rank(a) - rank(b) || (near.get(b) || 0) - (near.get(a) || 0) || (a.catalog ? 1 : 0) - (b.catalog ? 1 : 0));`,
  "the hymn ranking",
);

/* ---- 3a. the microphone's intent survives the trip to the search ----
   Home's mic has always navigated with `voice: true`, and the search has
   always passed `voice` on to the button as `autoStart` — but the router
   builds its route from a fixed list of fields and `voice` was not one of
   them, so the flag was dropped in between and the mic never once started
   by itself. The reciter tapped a microphone and got a search box with a
   microphone to tap again. */
sub(
  `plan: payload.plan ?? r.plan, weekday: payload.weekday }));`,
  `plan: payload.plan ?? r.plan, weekday: payload.weekday, voice: payload.voice }));`,
  "the router's route fields",
);

/* ---- 3. the keyboard stays down when the reciter came to talk ---- */
sub(
  `          <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)} autoFocus`,
  `          <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)} autoFocus={!voice}`,
  "the search input's focus",
);

/* ---- 4. a new dictation replaces what is in the box, not adds to it ----
   Tapping the microphone with a query already typed left that query sitting
   there, and the reciter could not tell which words the search was answering.
   The button now says when it starts listening, so the box can be emptied
   for the new words, and says when a session ended with nothing heard, so a
   mic that failed does not cost the reciter what they had typed. */
patchVoice([
  [`  const start = () => {
    if (!VOICE_SR) return;
    stop();`,
   `  const start = () => {
    if (!VOICE_SR) return;
    stop();
    onStart && onStart();          // search seam: the box is cleared for the new words`,
   "the start of a listening session"],
  [`    r.onerror = () => { setState("error"); recRef.current = null; setTimeout(() => setState("idle"), 1400); };`,
   `    r.onerror = () => { setState("error"); recRef.current = null; if (!finalText) onNothing && onNothing(); setTimeout(() => setState("idle"), 1400); };`,
   "the error path"],
  [`    r.onend = () => { recRef.current = null; setState((s) => (s === "error" ? s : "idle")); };`,
   `    r.onend = () => { recRef.current = null; if (!finalText) onNothing && onNothing(); setState((s) => (s === "error" ? s : "idle")); };`,
   "the end of a session"],
  [`function VoiceButton({ lang = "deva", onResult, onInterim, autoStart = false, size = 18, className = "" }) {`,
   `function VoiceButton({ lang = "deva", onResult, onInterim, onStart, onNothing, autoStart = false, size = 18, className = "" }) {`,
   "the button's props"],
]);

sub(
  `          <VoiceButton lang={lang} autoStart={voice} onInterim={setQ} onResult={setQ} />`,
  `          <VoiceButton lang={lang} autoStart={voice} onInterim={setQ} onResult={setQ}
            onStart={() => { wasTyped.current = q; setQ(""); }}
            onNothing={() => setQ((cur) => cur || wasTyped.current)} />`,
  "the search's voice button",
);
sub(
  `  const [q, setQ] = useStateM("");`,
  `  const [q, setQ] = useStateM("");
  const wasTyped = useRefM("");   // search seam: given back if a dictation hears nothing`,
  "the search's query state",
);

/* ---- 2. the search opens over the screen that called it ---- */
sub(
  `  let body;
  if (route.view === "home")`,
  `  /* search seam: the search is a sheet over the screen that called it, not
     a screen of its own — so the chain below runs for that screen, and the
     search is rendered on top of it further down */
  const searchOpen = route.view === "search";
  const rv = searchOpen ? (route.from || "browse") : route.view;
  let body;
  if (rv === "home")`,
  "the view chain's head",
);

/* the rest of the chain follows the effective view too */
const chainAt = t.indexOf(`  if (rv === "home")`);
const chainEnd = t.indexOf(`  const showTabs = `, chainAt);
if (chainAt < 0 || chainEnd < 0) throw new Error("fix-search-seam: anchor not found — the view chain's body");
let chain = t.slice(chainAt, chainEnd);
const searchLine = chain.split("\n").find((l) => l.includes(`body = <SearchView`));
if (!searchLine) throw new Error("fix-search-seam: anchor not found — the search branch of the chain");
chain = chain.replace(searchLine + "\n", "");            // the search is no longer a branch
const rewired = chain.split(`route.view === `).length - 1;
if (!rewired) throw new Error("fix-search-seam: anchor not found — nothing to rewire in the view chain");
chain = chain.split(`route.view === `).join(`rv === `);
t = t.slice(0, chainAt) + chain + t.slice(chainEnd);

sub(
  `          {body}
        </div>`,
  `          {body}
          {/* search seam: over the screen, not instead of it — the dimmed
              screen below the panel is still the screen, and tapping it
              closes the search the way tapping outside any sheet does */}
          {searchOpen && (
            <div className="sr-scrim" onClick={() => go(route.from || "browse")}>
              <div className="sr-sheet" onClick={(e) => e.stopPropagation()}>
                <SearchView key="search" go={go} lang={lang} backView={route.from || "browse"} weekday={route.weekday} voice={!!route.voice} />
              </div>
            </div>
          )}
        </div>`,
  "the viewport's body",
);

/* the tab of the screen underneath stays lit while the search is open */
sub(
  `{showTabs && <TabBar view={route.view} from={route.from}`,
  `{showTabs && <TabBar view={rv} from={route.from}`,
  "the tab bar's view",
);

writeFileSync(file, t);
console.log(`search seam applied (view chain rewired: ${rewired})`);

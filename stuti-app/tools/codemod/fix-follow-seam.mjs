// Wires Follow (src/stuti-follow.tsx, hand-authored) into the generated
// reader: the hook after the reader has built its `lines`, the mic button
// in the tools panel, the status chip above the text, and the word light
// switched on while following. Every anchor is literal text from the
// prototype's reader; a design update that moves one fails here, loudly.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, "../../src/stuti-reader.tsx");
let t = readFileSync(FILE, "utf8");

function patch(from, to, what) {
  if (!t.includes(from)) throw new Error(`fix-follow-seam: anchor not found — ${what}`);
  t = t.replace(from, to);
}

patch(
  `import { nityaQueue } from "./stuti-nitya-queue";`,
  `import { nityaQueue } from "./stuti-nitya-queue";\nimport { useFollow, FollowButton, FollowChip, RecitationsButton } from "./stuti-follow";`,
  "import line",
);

// after the reader has flattened `lines` (hooks must stay unconditional, so
// this sits with the other top-level hooks, after every value it reads)
patch(
  `  const A = STUTI_AUDIO;\n`,
  `  const A = STUTI_AUDIO;\n` +
  `  /* Follow: the reader listens and the light keeps pace (hand-authored module) */\n` +
  `  const follow = useFollow({ hymn, lines, lang, active, setActive, setWord, setPlaying, onDone: () => STUTI_THREAD.mark("r", hymn.id) });\n`,
  "hook insertion after `const A = STUTI_AUDIO;`",
);

// word light in the full column and in the verse view
patch(
  `word={word} lit={playing && !drifting} masked={flowMask}`,
  `word={word} lit={(playing && !drifting) || follow.on} masked={flowMask}`,
  "FlowText lit prop",
);
patch(
  `<WordRun text={bodyText} upto={on ? word : -1} lit={on && playing}`,
  `<WordRun text={bodyText} upto={on ? word : -1} lit={on && (playing || follow.on)}`,
  "verse-view WordRun lit prop",
);
// the other lines dim while following, as they do during playback
patch(
  `className={"line" + (on ? " line-on" : "") + (playing && !on ? " line-off" : "")}`,
  `className={"line" + (on ? " line-on" : "") + ((playing || follow.on) && !on ? " line-off" : "")}`,
  "verse-view line-off class",
);

// the mic, beside the stotra's title (the user's call: not in the tools panel)
patch(
  `<div className="reader-topbar-name display">{hymnTitle(hymn, lang)}<FavButton id={hymn.id} size={21} /></div>`,
  `<div className="reader-topbar-name display">{hymnTitle(hymn, lang)}<FavButton id={hymn.id} size={21} /><FollowButton follow={follow} lang={lang} /><RecitationsButton follow={follow} lang={lang} /></div>`,
  "topbar title (after FavButton)",
);

// the reader root carries is-following, so the timed transport can hide
patch(
  `    <div className="view reader" style={deityStyle(deity, { flex: 1, "--rd-scale": fontScale })}>`,
  `    <div className={"view reader" + (follow.on ? " is-following" : "")} style={deityStyle(deity, { flex: 1, "--rd-scale": fontScale })}>`,
  "reader root className",
);

// the status chip, in the same slot the find strip uses
patch(
  `      {findOpen && (\n        <FindStrip`,
  `      {follow.showChip && <FollowChip follow={follow} lang={lang} />}\n      {findOpen && (\n        <FindStrip`,
  "chip before FindStrip",
);

writeFileSync(FILE, t);
console.log("follow seam applied to stuti-reader.tsx");

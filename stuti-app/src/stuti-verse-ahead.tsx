/* ============================================================
   STUTI — the ślokas that come next, under the one being read

   Hand-authored; the verse-ahead seam (tools/codemod/fix-verse-ahead-seam.mjs)
   places it in the reader's verse view, after the card.

   The verse view shows one śloka at a time. In a sahasranāma a śloka is two
   short lines, four names, so the card filled under half the screen and the
   rest was empty. On a phone the reciter saw four names a screen. The card
   stays as it was. The ślokas that follow are set under it, plainer, so the
   screen holds what comes next. A tap on one moves the reading there.

   Only on sahasranāmas and nāmāvaḷis (the reader passes the condition), and
   never in Memorise, where the next names are what is being learnt.
   ============================================================ */
import React from "react";
import { STUTI_BIND } from "./stuti-i18n";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* enough to fill a tall phone at the smallest text size; the rest scrolls */
const AHEAD = 8;

const END_MARK = /\s*((?:\|\||[।॥])\s*[0-9०-९౦-౯]+\s*(?:\|\||[।॥]))\s*$/;
const HAS_MARK = /(?:\|\||[।॥])\s*[0-9०-९౦-౯]+\s*(?:\|\||[।॥])\s*$/;

type Line = { vi: number; li: number };

export function VerseAhead({ hymn, lines, curVerse, lang, quiet, onPick }: {
  hymn: any; lines: Line[]; curVerse: number; lang: string; quiet: boolean; onPick: (idx: number) => void;
}) {
  /* the verses that follow as the reader will meet them: a verse the reader
     has hidden (a nyāsa turned off, an occasion's lines) is not in lines */
  const ahead: { vi: number; start: number }[] = [];
  for (let i = 0; i < lines.length && ahead.length < AHEAD; i++) {
    const l = lines[i];
    if (l.vi > curVerse && l.li === 0) ahead.push({ vi: l.vi, start: i });
  }
  if (!ahead.length) return null;
  const many = hymn.verses.length > 1;
  const mainCls = lang === "deva" ? "line-deva deva" : lang === "telugu" ? "line-telugu" : "line-iast-lead";
  return (
    <div className={"verse-ahead" + (quiet ? " is-quiet" : "")}>
      {ahead.map(({ vi, start }) => {
        const v = hymn.verses[vi];
        const dv = v.deva.split("\n");
        const it = v.iast.split("\n");
        const tdv = v.tdeva ? v.tdeva.split("\n") : null;
        return (
          <div key={vi} className="verse-ahead-verse">
            {dv.map((d, li) => {
              let text = STUTI_BIND(lang === "telugu" ? ((tdv && tdv[li]) || STUTI_TRANSLIT.convert(d, "telugu")) : lang === "deva" ? d : (it[li] || ""));
              /* the verse number at the end, as the card above writes it */
              if (li === dv.length - 1 && many && !v.pr && !HAS_MARK.test(text.trim())) {
                const num = v.n ? v.n : vi + 1;
                text = text.replace(/\s*(\|\||[।॥])\s*$/, "") + (lang === "roman" ? (" || " + num + " ||") : (" ॥ " + num + " ॥"));
              }
              const m = text.match(END_MARK);
              const body = m ? text.slice(0, m.index) : text;
              const cont = li > 0 && (/-\s*$/.test(dv[li - 1] || "") || /-\s*$/.test(it[li - 1] || ""));
              return (
                <div key={li} className={"line line-ahead" + (cont ? " line-cont" : "")} onClick={() => onPick(start + li)}>
                  <div className={mainCls}>
                    {body}
                    {m && <span className="verse-end-mark">{" " + m[1].replace(/\s+/g, " ")}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

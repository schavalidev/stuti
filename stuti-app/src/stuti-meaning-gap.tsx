/* ============================================================
   STUTI — what Meaning says when there is no meaning yet

   Hand-authored; the meaning-gap seam places it once inside the reader's
   scroller, so it covers the verse view and the flow view alike.

   The corpus outran the glosses. 332 of the 335 Bhāgavata adhyāyas are
   published as text alone, and before this the reciter who turned Meaning on
   over one of them was handed a blank page and left to decide whether the app
   was broken, whether the download had failed, or whether the verse simply has
   no meaning. None of those is true, so the page says which it is.

   A namāvalī is a different case and is already answered in the reader itself:
   a name-śloka has no sentence to translate, and its meaning is the glossary.
   This stays out of the way there.
   ============================================================ */
import React from "react";
import { STUTI_MEAN } from "./stuti-i18n";

const WORDS: Record<string, { head: string; body: string }> = {
  roman: {
    head: "The meaning of this text is not written yet",
    body: "The verses are here and complete. The word-for-word meaning is still being prepared, and will arrive in an update — nothing is missing from your copy.",
  },
  deva: {
    head: "इस पाठ का अर्थ अभी नहीं लिखा गया",
    body: "श्लोक यहाँ पूरे हैं। अर्थ अभी तैयार हो रहा है और किसी आगामी अद्यतन में आ जायेगा — आपकी प्रति में कुछ छूटा नहीं है।",
  },
  telugu: {
    head: "ఈ పాఠానికి అర్థం ఇంకా వ్రాయలేదు",
    body: "శ్లోకాలు ఇక్కడ పూర్తిగా ఉన్నాయి. అర్థం ఇంకా సిద్ధమవుతోంది, ఒక నవీకరణలో వస్తుంది — మీ ప్రతిలో ఏదీ తక్కువ కాలేదు.",
  },
};

/** True when not one verse of this text carries a meaning in this script. */
export function hasNoMeaning(hymn: any, lang: string): boolean {
  const verses = (hymn && hymn.verses) || [];
  if (!verses.length) return false;
  for (const v of verses) if (STUTI_MEAN(v, lang)) return false;
  return true;
}

export function MeaningGap({ hymn, lang }: { hymn: any; lang: string }) {
  if (!hymn || hymn.namesKey) return null;       // the glossary answers a namāvalī
  if (!hasNoMeaning(hymn, lang)) return null;
  const w = WORDS[lang] || WORDS.roman;
  return (
    <div className="rd-mean-gap" role="note">
      <div className="rd-mean-gap-head">{w.head}</div>
      <p className="rd-mean-gap-body">{w.body}</p>
    </div>
  );
}

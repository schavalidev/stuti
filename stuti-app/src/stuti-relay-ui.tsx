/* The Settings row for the log relay (stuti-relay.ts): one switch, on by
   default for the beta, in the reader's own interface script. Hand-authored;
   the settings seam places it under the support line. */
import React from "react";
import { enabled, setEnabled } from "./stuti-relay";

const WORDS: Record<string, { label: string; sub: string }> = {
  roman:  { label: "Send diagnostics to the makers", sub: "Crash notes and Follow session logs, with the audio the ears heard. Never a name, or what you read." },
  deva:   { label: "निर्माताओं को निदान भेजें", sub: "त्रुटि-टिप्पणियाँ और अनुसरण-सत्र के लॉग, कानों ने जो सुना उसकी ध्वनि सहित। नाम या आपका पाठ कभी नहीं।" },
  telugu: { label: "తయారీదారులకు నివేదికలు పంపు", sub: "లోపాల గమనికలు, అనుసరణ సెషన్ లాగులు, చెవులు విన్న ధ్వనితో సహా. పేరు గానీ, మీరు చదివినది గానీ ఎప్పుడూ కాదు." },
};

export function RelayRow({ lang, Row }: { lang: string; Row: any }) {
  const [on, setOn] = React.useState(enabled);
  const w = WORDS[lang] || WORDS.roman;
  return (
    <Row label={w.label} sub={w.sub} onClick={() => { setEnabled(!on); setOn(!on); }}>
      <span className={"set-switch" + (on ? " on" : "")}><i /></span>
    </Row>
  );
}

/* The two Settings rows that lead to the privacy policy and the terms of use.
   Hand-authored; the legal seam places them in the About block, under the
   support line.

   Both pages ship in `public/legal/`, so they are part of the bundle and part
   of the APK, and they open without a network — which matters, because a
   reciter who wants to know what the app does with their practice should not
   have to be online to find out. The service worker's navigation fallback
   skips `/legal/` (vite.config), or an installed device would be handed the
   app in place of the page.

   On the phone the page is opened through Capacitor's own browser, against the
   app's own origin, so it stays inside the app and still works offline. On the
   web it is an ordinary new tab. */
import React from "react";
import { Capacitor } from "@capacitor/core";
import { Icon } from "./stuti-icons";

const WORDS: Record<string, { privacy: string; privacySub: string; terms: string; termsSub: string; credits: string; creditsSub: string }> = {
  roman: {
    privacy:    "Privacy policy",
    privacySub: "What the app knows, where it goes, and how to have it erased",
    terms:      "Terms of use",
    termsSub:   "What Stuti offers, and what it does not promise",
    credits:    "Credits and licences",
    creditsSub: "The editions, typefaces, software and data this app stands on",
  },
  deva: {
    privacy:    "निजता नीति",
    privacySub: "ऐप क्या जानता है, वह कहाँ जाता है, और उसे कैसे मिटवाया जाये",
    terms:      "उपयोग की शर्तें",
    termsSub:   "स्तुति क्या देता है, और किसका वचन नहीं देता",
    credits:    "श्रेय और अनुज्ञप्तियाँ",
    creditsSub: "जिन संस्करणों, लिपि-मुखों, सॉफ़्टवेयर और आँकड़ों पर यह ऐप खड़ा है",
  },
  telugu: {
    privacy:    "గోప్యతా విధానం",
    privacySub: "యాప్‌కు ఏమి తెలుసు, అది ఎక్కడికి వెళ్తుంది, దానిని ఎలా తొలగించుకోవాలి",
    terms:      "ఉపయోగ నిబంధనలు",
    termsSub:   "స్తుతి ఏమి ఇస్తుంది, ఏమి వాగ్దానం చేయదు",
    credits:    "కృతజ్ఞతలు, అనుమతులు",
    creditsSub: "ఈ యాప్ ఆధారపడిన ముద్రణలు, అక్షర రూపాలు, సాఫ్ట్‌వేర్, దత్తాంశం",
  },
};

async function open(page: string) {
  const url = new URL("legal/" + page, location.href).href;
  try {
    if (Capacitor.isNativePlatform()) {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url, presentationStyle: "popover" });
      return;
    }
  } catch (e) {
    /* the plugin is absent, or refused: fall through to an ordinary tab */
  }
  window.open(url, "_blank", "noopener");
}

export function LegalRows({ lang, Row }: { lang: string; Row: any }) {
  const w = WORDS[lang] || WORDS.roman;
  return (
    <React.Fragment>
      <Row label={w.privacy} sub={w.privacySub} onClick={() => open("privacy.html")}><Icon name="chev" size={18} /></Row>
      <Row label={w.terms} sub={w.termsSub} onClick={() => open("terms.html")}><Icon name="chev" size={18} /></Row>
      <Row label={w.credits} sub={w.creditsSub} onClick={() => open("attributions.html")}><Icon name="chev" size={18} /></Row>
    </React.Fragment>
  );
}

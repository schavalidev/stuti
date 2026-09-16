/* The Settings row for the account (stuti-cloud.ts). While the server is not
   configured it is the design's own "coming later" row, word for word; once it
   is, the row opens the account screen and says who is signed in and whether
   the data has synced. Hand-authored; placed by fix-account-seam.mjs. */
import React from "react";
import { STUTI_CLOUD_AUTH as A } from "./stuti-cloud";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";

const WORDS: Record<string, { in: string; out: string; outSub: string }> = {
  roman:  { in: "Account", out: "Sign in", outSub: "Keep your reading, vows and lamp safe, and the same on another phone." },
  deva:   { in: "खाता", out: "साइन इन", outSub: "अपना पाठ, व्रत और दीप सुरक्षित रखें, और दूसरे फोन पर भी वही पाएँ।" },
  telugu: { in: "ఖాతా", out: "సైన్ ఇన్", outSub: "మీ పఠనం, వ్రతాలు, దీపం భద్రంగా ఉంచుకోండి; మరో ఫోన్‌లోనూ అవే పొందండి." },
};

export function AccountRow({ lang, Row, go }: { lang: string; Row: any; go: any }) {
  const [s, setS] = React.useState(() => A.get());
  React.useEffect(() => A.subscribe(setS), []);
  const L = STUTI_L;
  if (!A.configured()) return <Row label={L.t("accComing", lang)} sub={L.t("accComingSub", lang)} />;
  const w = WORDS[lang] || WORDS.roman;
  return (
    <Row label={s ? w.in : w.out} sub={s ? (s.name ? s.name + " · " : "") + s.handle : w.outSub} onClick={() => go("account", { from: "settings" })}>
      <Icon name="chev" size={18} />
    </Row>
  );
}

import React from "react";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { Icon } from "./stuti-icons";

/* the pill beside a rite's title that opens its vidhānam — the full text,
   saṅkalpa and all, read from in the reader like Pitṛ Tarpaṇa Vidhiḥ.
   A rite names its text by hymn id as `vidhiText`. Until the text is in the
   library the pill stands, marked as coming, and does not answer a press. */
function VidhiJump({ hymnId, deity, go, lang, label }) {
  const L = STUTI_L, S = STUTI;
  const hymn = hymnId && S && S.hymnById ? S.hymnById(hymnId) : null;
  const ready = !!(hymn && hymn.verses && hymn.verses.length);
  const open = () => { if (ready && go) go("reader", { hymn: hymn.id, deity: deity || hymn.deity, from: "vrata" }); };
  return (
    <button className={"vidhi-jump" + (ready ? "" : " is-soon")} onClick={open} aria-disabled={!ready} disabled={!ready}>
      <span>{label || L.t("vidhanamOpen", lang)}</span>
      {ready ? <Icon name="chev" size={15} /> : <span className="vidhi-jump-soon">{L.t("comingSoon", lang)}</span>}
    </button>
  );
}
export { VidhiJump };

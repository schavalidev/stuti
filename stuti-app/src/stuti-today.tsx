import { Icon } from "./stuti-icons";
import React from "react";
import { STUTI_CUES } from "./stuti-cues";
import { STUTI } from "./stuti-data";
import { STUTI_L } from "./stuti-i18n";
import { JAPA_THREADS } from "./stuti-japa";
import { STUTI_KEEP } from "./stuti-keep-core";
import { STUTI_JAPA } from "./stuti-sadhana";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — what today asks
   The reliable half of the reminder system. The bell may be denied,
   the tab may be shut, a push may never arrive; this band is simply
   there when the app opens, computed from the same registry, and so
   it never disagrees with what rang.

   Sandhyā is deliberately absent. It is a window in the sky, not a debt: a
   practitioner who has kept it for forty years needs the hour, not a task,
   and will not put down the arghya to mark a step. It lives on the home sky
   and nowhere else — never here, never in the lapse list.

   It renders nothing when nothing is owed. A band that says "nothing
   to do" is noise, and a devotional app should not nag — the day's
   obligations are named once, plainly, and the rest is silence.
   ============================================================ */
const { useState: useStateT, useEffect: useEffectT } = React;

function TodayBand({ go, lang = "deva" }) {
  const L = STUTI_L, C = STUTI_CUES;
  const [, bump] = useStateT(0);
  useEffectT(() => {
    const f = () => bump((n) => n + 1);
    const offs = ["STUTI_PREFS", "STUTI_VOWS", "STUTI_PLANS", "STUTI_JAPA", "STUTI_THREAD", "STUTI_LOC", "STUTI_KEEP"]
      .map((k) => { try { return window[k].subscribe(f); } catch (e) { return null; } });
    /* the running juncture is a live fact — a band left open must not keep
       claiming prātaḥ is open an hour after it closed */
    const id = setInterval(f, 60000);
    return () => { offs.forEach((o) => o && o()); clearInterval(id); };
  }, []);
  if (!C) return null;

  let obs = [], miss = [];
  try { const ctx = C.ctx(); obs = C.obligations(ctx); miss = C.missed(ctx, 3); } catch (e) { return null; }

  const owed = obs.filter((o) => o.done === false);
  const tithi = obs.find((o) => o.kind === "tithi") || null;
  /* a plan or a japa thread that is both owed today and quiet for days is one
     fact, not two — the gap folds into the row that already names it, and only
     what has no row above is listed as lapsed below */
  const gaps = {};
  miss.forEach((m) => { if (m.kind !== "vow") gaps[m.kind + ":" + m.ref] = m.days; });
  const lapsed = miss.filter((m) => m.kind === "vow" || !owed.some((o) => o.kind === m.kind && o.ref === m.ref));
  if (!owed.length && !lapsed.length) return null;

  const font = L.font(lang);
  const hymnOf = (id) => { try { return STUTI.hymnById(id); } catch (e) { return null; } };
  const japaVowName = (dId, label) => { if (label) return label + " \u00b7 " + L.t("vowKindJapa", lang); try { const d = STUTI.deityById[dId]; return L.name(d, lang) + " \u00b7 " + L.t("vowKindJapa", lang); } catch (e) { return L.t("vowKindJapa", lang); } };
  const goJapa = (dId) => { try { STUTI_JAPA.setLast(dId); } catch (e) {} go("japa"); };
  const malaHas = (dId) => { try { return JAPA_THREADS.some(m => m.id === dId); } catch (e) { return false; } };
  const locale = lang === "telugu" ? "te-IN" : "en-IN";
  const dayName = (d) => d.toLocaleDateString(locale, { weekday: "short", day: "numeric" });
  const since = (kind, ref) => gaps[kind + ":" + ref] ? " · " + L.t("gapDays", lang).replace("{n}", gaps[kind + ":" + ref]) : "";

  const row = (key, name, note, onClick, mod) => (
    <button className={"tb-row" + (mod ? " " + mod : "")} key={key} onClick={onClick} disabled={!onClick}>
      <span className="tb-row-body">
        <span className="tb-row-name" style={{ fontFamily: font }}>{name}</span>
        {note && <span className="tb-row-note">{note}</span>}
      </span>
      {onClick && <Icon name="chev" size={17} />}
    </button>
  );

  return (
    <section className="tb-card">
      <div className="tb-head">
        <div className="eyebrow">{L.t("todayAsks", lang)}</div>
        {tithi && (
          <span className="tb-mark" style={{ fontFamily: font }}>
            {lang === "telugu" ? STUTI_TRANSLIT.convert(tithi.obs.deva || tithi.obs.name, "telugu")
              : lang === "deva" ? (tithi.obs.deva || tithi.obs.name) : tithi.obs.name}
          </span>
        )}
      </div>

      {owed.map((o) => {
        if (o.kind === "vow") {
          if (o.vkind === "japa") return row(o.id, japaVowName(o.deity, o.label), L.t("bandVow", lang), malaHas(o.deity) ? () => goJapa(o.deity) : null);
          const h = hymnOf(o.hymn); if (!h) return null;
          return row(o.id, L.hymnTitle(h, lang), L.t("bandVow", lang),
            () => go("reader", { deity: h.deity, hymn: h.id, from: "daily" }));
        }
        if (o.kind === "plan") {
          const h = hymnOf(o.hymn); if (!h) return null;
          const note = L.t("digestPlanDay", lang).replace("{n}", o.day) + (o.days ? " / " + o.days : "") + since("plan", o.ref);
          return row(o.id, L.hymnTitle(h, lang), note, () => go("plan", { plan: o.hymn, from: "daily" }));
        }
        if (o.kind === "japa") return row(o.id, L.t("bandJapa", lang), L.t("bandJapaNote", lang) + since("japa", o.ref), () => go("japa"));
        if (o.kind === "keep") {
          let s = null; try { s = STUTI_KEEP.subject(STUTI_KEEP.byId(o.ref)); } catch (e) {}
          if (!s) return null;
          const nm = lang === "telugu" ? (s.name.tel || s.name.roman) : lang === "deva" ? (s.name.deva || s.name.tel || s.name.roman) : s.name.roman;
          const note = o.state === "udyapana" ? L.t("keepUdyapana", lang) : o.state === "month" ? L.t("keepThisMonth", lang)
            : o.state === "vrata" ? (o.away === 0 ? L.t("vrataToday", lang) : L.t("keepIn", lang).replace("{n}", o.away)) : L.t("nomuCadDaily", lang);
          return row(o.id, nm, note, () => go("browse", { libSub: { kind: o.kkind, key: o.kref, returnTo: "daily" } }));
        }
        return null;
      })}

      {lapsed.length > 0 && (
        <div className="tb-miss">
          <div className="tb-miss-cap"><Icon name="clock" size={13} /><span>{L.t("bandLapsed", lang)}</span></div>
          {lapsed.slice(0, 3).map((m) => {
            const jv = m.kind === "vow" && m.vkind === "japa";
            const h = (m.kind === "japa" || jv) ? null : hymnOf(m.hymn);
            if (m.kind !== "japa" && !jv && !h) return null;
            /* what a lapsed row can honestly offer is the text itself. Marking a
               past day kept would forge the record, so the tap opens the hymn —
               today's recitation is the only amends the app can carry out. */
            return row("m-" + m.id,
              h ? L.hymnTitle(h, lang) : jv ? japaVowName(m.deity, m.label) : L.t("bandJapa", lang),
              m.kind === "vow" ? L.t("missVow", lang).replace("{d}", dayName(m.day))
                : m.kind === "plan" ? L.t("missPlan", lang).replace("{n}", m.days)
                : L.t("missJapa", lang).replace("{n}", m.days),
              m.kind === "japa" ? () => go("japa")
                : jv ? (malaHas(m.deity) ? () => goJapa(m.deity) : null)
                : m.kind === "plan" ? () => go("plan", { plan: m.ref, from: "daily" })
                : () => go("reader", { deity: h.deity, hymn: h.id, from: "daily" }),
              "tb-row-miss");
          })}
          {lapsed.length > 3 && <div className="tb-miss-more">{L.t("bandMissMore", lang).replace("{n}", lapsed.length - 3)}</div>}
        </div>
      )}
    </section>
  );
}

export { TodayBand };

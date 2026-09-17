/* ============================================================
   STUTI — the feedback inbox
   Hand-authored. Every message sent from the feedback sheet lands
   in `stuti_feedback` (stuti-feedback-send.ts). This list is where
   the makers read them and mark each one seen or done. It opens
   from the account screen, and only for accounts listed in
   `stuti_admins`; the table's row-level security enforces the same
   rule on the server, so hiding the button is not the protection.
   ============================================================ */
import React from "react";
import { cloud } from "./stuti-cloud";

const { useState, useEffect, useCallback } = React;

type Status = "new" | "seen" | "done";
type Item = { id: number; created_at: string; kind: string; subject: string | null; body: string; build: string | null; platform: string | null; status: Status; user_id: string | null };

const W: Record<string, Record<string, string>> = {
  cap:     { roman: "Feedback", deva: "प्रतिक्रिया", telugu: "అభిప్రాయాలు" },
  open:    { roman: "Open the feedback inbox", deva: "प्रतिक्रियाएँ देखें", telugu: "అభిప్రాయాలు చూడండి" },
  close:   { roman: "Close the inbox", deva: "बंद करें", telugu: "మూసివేయండి" },
  st_new:  { roman: "New", deva: "नई", telugu: "కొత్తవి" },
  st_seen: { roman: "Seen", deva: "देखी", telugu: "చూసినవి" },
  st_done: { roman: "Done", deva: "पूरी", telugu: "పూర్తైనవి" },
  mkSeen:  { roman: "Mark seen", deva: "देखी गई", telugu: "చూశాను" },
  mkDone:  { roman: "Mark done", deva: "पूरी हुई", telugu: "పూర్తైంది" },
  mkNew:   { roman: "Mark new", deva: "फिर नई", telugu: "మళ్ళీ కొత్తది" },
  none:    { roman: "Nothing here.", deva: "यहाँ कुछ नहीं है।", telugu: "ఇక్కడ ఏమీ లేదు." },
  failed:  { roman: "Could not load the inbox. Please try again.", deva: "सूची नहीं खुली। फिर से कोशिश कीजिये।", telugu: "జాబితా తెరుచుకోలేదు. మళ్ళీ ప్రయత్నించండి." },
  signed:  { roman: "from an account", deva: "खाते से", telugu: "ఖాతా నుండి" },
  more:    { roman: "Load more", deva: "और देखें", telugu: "మరిన్ని" },
};
const w = (k: string, lang: string) => (W[k] && (W[k][lang] || W[k].roman)) || k;
const PAGE = 50;

/** whether the signed-in account may read the inbox; false when signed out or unconfigured */
export function useIsAdmin(signedInId: string | null) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let live = true; setOk(false);
    const c = cloud();
    if (c && signedInId) c.rpc("stuti_is_admin").then(({ data }) => { if (live) setOk(data === true); }, () => {});
    return () => { live = false; };
  }, [signedInId]);
  return ok;
}

export function FeedbackInbox({ lang }: { lang: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Status>("new");
  const [items, setItems] = useState<Item[]>([]);
  const [counts, setCounts] = useState<Record<Status, number>>({ new: 0, seen: 0, done: 0 });
  const [limit, setLimit] = useState(PAGE);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const c = cloud(); if (!c) return;
    setBusy(true); setErr(false);
    try {
      const [list, ...heads] = await Promise.all([
        c.from("stuti_feedback").select("id,created_at,kind,subject,body,build,platform,status,user_id").eq("status", tab).order("created_at", { ascending: false }).limit(limit),
        ...(["new", "seen", "done"] as Status[]).map((s) => c.from("stuti_feedback").select("id", { count: "exact", head: true }).eq("status", s)),
      ]);
      if (list.error) throw list.error;
      setItems((list.data || []) as Item[]);
      setCounts({ new: heads[0].count || 0, seen: heads[1].count || 0, done: heads[2].count || 0 });
    } catch (e) { setErr(true); }
    setBusy(false);
  }, [tab, limit]);

  useEffect(() => { if (open) load(); }, [open, load]);

  const mark = async (id: number, status: Status) => {
    const c = cloud(); if (!c) return;
    const { error } = await c.from("stuti_feedback").update({ status }).eq("id", id);
    if (error) { setErr(true); return; }
    load();
  };

  const loc = lang === "telugu" ? "te-IN" : lang === "deva" ? "hi-IN" : "en-IN";
  const when = (s: string) => new Date(s).toLocaleString(loc, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <section className="set-sect fbi">
      <div className="eyebrow set-cap">{w("cap", lang)}</div>
      {!open ? (
        <button className="dana-later" onClick={() => setOpen(true)}>{w("open", lang)}</button>
      ) : (
        <React.Fragment>
          <div className="fbi-tabs" role="tablist">
            {(["new", "seen", "done"] as Status[]).map((s) => (
              <button key={s} role="tab" aria-selected={tab === s} className={"fb-kind" + (tab === s ? " on" : "")}
                onClick={() => { setTab(s); setLimit(PAGE); }}>
                {w("st_" + s, lang)} · {counts[s].toLocaleString(loc)}
              </button>
            ))}
          </div>
          {err && <p className="fb-done">{w("failed", lang)}</p>}
          {!busy && !err && items.length === 0 && <p className="set-note">{w("none", lang)}</p>}
          {items.map((it) => (
            <article className="fbi-item" key={it.id}>
              <div className="fbi-meta">
                <b>{it.subject || it.kind}</b>
                <span>{when(it.created_at)}{it.platform ? " · " + it.platform : ""}{it.build ? " · " + it.build : ""}{it.user_id ? " · " + w("signed", lang) : ""}</span>
              </div>
              <div className="fbi-body">{it.body}</div>
              <div className="fbi-acts">
                {it.status !== "seen" && <button className="dana-later" onClick={() => mark(it.id, "seen")}>{w("mkSeen", lang)}</button>}
                {it.status !== "done" && <button className="dana-later" onClick={() => mark(it.id, "done")}>{w("mkDone", lang)}</button>}
                {it.status !== "new" && <button className="dana-later" onClick={() => mark(it.id, "new")}>{w("mkNew", lang)}</button>}
              </div>
            </article>
          ))}
          {items.length >= limit && <button className="dana-later" onClick={() => setLimit(limit + PAGE)}>{w("more", lang)}</button>}
          <button className="dana-later" onClick={() => setOpen(false)}>{w("close", lang)}</button>
        </React.Fragment>
      )}
    </section>
  );
}

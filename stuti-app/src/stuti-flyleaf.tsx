import { Icon } from "./stuti-icons";
import React from "react";
import { STUTI_DESA } from "./stuti-desa";
import { STUTI_FLYLEAF } from "./stuti-flyleaf-core";
import { STUTI_L } from "./stuti-i18n";
import { AKSHARA_PANCHANGA } from "./stuti-panchanga-engine";
import { SK_CONST, samvatsaraFor, useLoc } from "./stuti-panchanga";
import { Picker } from "./stuti-picker";
import { masaShown } from "./stuti-reckoning";
import { SetSection } from "./stuti-settings";
import { STUTI_TRANSLIT } from "./stuti-translit";

/* ============================================================
   STUTI — the flyleaf, on screen
   Three surfaces over one store, so the ask is written once.

     KnownClauses  — the twelve clauses the app already knows, and the
                     one blank. Shown before asking anything, because
                     an app that has done twelve clauses has earned the
                     right to ask for the thirteenth. This is the whole
                     difference between informed and nosy.
     FlyleafForm   — gotra (over the real gotra list, so typing
                     "bhara" resolves to भारद्वाज), nāma, and the
                     gender the clause is declined for.
     SankalpaSheet — the saṅkalpa as a document you keep, not a form
                     you fill each morning. Nothing here says "make".
                     It exists; you are reading it.
   ============================================================ */
const { useState: useStateF, useEffect: useEffectF, useMemo: useMemoF } = React;

function flFold(x) { return (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }
function flFont(s) { return s === "telugu" ? "var(--font-telugu)" : s === "roman" ? "var(--font-display)" : "var(--font-deva)"; }

/* reactive read of the flyleaf, with the same field-wise interface the
   saṅkalpa sheet has always used */
function useFlyleaf() {
  const F = STUTI_FLYLEAF;
  const [e, setE] = useStateF(() => F.get());
  useEffectF(() => F.subscribe(setE), []);
  const w = (k) => (v) => F.set({ [k]: v });
  return {
    gotra: e.gotra, nama: e.nama, gender: e.gender, karma: e.karma, frame: e.frame, desa: e.desa,
    setGotra: w("gotra"), setNama: w("nama"), setGender: w("gender"),
    setKarma: w("karma"), setFrame: w("frame"), setDesa: w("desa"),
    ready: !!(e.gotra || "").trim() && !!(e.nama || "").trim(),
  };
}

/* ---- gotra, over the list the saṅkalpa is actually built from ----
   Free text would accept anything and then silently fail to decline it.
   Matching the list means the clause is correct and the reciter sees their
   gotra in their own script as they type — which does more to say "this app
   knows the rite" than any sentence of copy could. */
function GotraField({ value, onChange, lang, id }) {
  const L = STUTI_L, SK = SK_CONST, TR = STUTI_TRANSLIT;
  const [q, setQ] = useStateF(value || "");
  const [open, setOpen] = useStateF(false);
  useEffectF(() => { setQ(value || ""); }, [value]);
  const script = (g) => lang === "telugu" ? TR.convert(g[1], "telugu") : lang === "roman" ? g[0] : g[1];
  const hits = useMemoF(() => {
    const f = flFold(q);
    if (!f) return [];
    const list = (SK.GOTRAS || []);
    const starts = list.filter((g) => flFold(g[0]).indexOf(f) === 0);
    const rest = list.filter((g) => flFold(g[0]).indexOf(f) > 0);
    return starts.concat(rest).slice(0, 6);
  }, [q]);
  const exact = (SK.GOTRAS || []).find((g) => flFold(g[0]) === flFold(q));
  const take = (g) => { setQ(g[0]); onChange(g[0]); setOpen(false); };
  return (
    <div className={"fl-auto" + (open && hits.length ? " open" : "")}>
      <input id={id} className="sk-input" value={q} autoComplete="off" spellCheck="false"
        placeholder={L.t("gotraHint", lang)}
        onChange={(e) => { setQ(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 140)} />
      {exact && <span className="fl-auto-echo" style={{ fontFamily: flFont(lang) }}>{script(exact)}</span>}
      {open && hits.length > 0 && (
        <div className="fl-auto-menu" role="listbox">
          {hits.map((g) => (
            <button key={g[0]} className="fl-auto-opt" onMouseDown={(e) => e.preventDefault()} onClick={() => take(g)}>
              <span style={{ fontFamily: flFont(lang) }}>{script(g)}</span>
              {lang !== "roman" && <i>{g[0]}</i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- the three fields that are fixed for life ---- */
function FlyleafForm({ sk, lang, unknown }) {
  const L = STUTI_L, t = (k) => L.t(k, lang);
  const uid = React.useId();
  const male = sk.gender !== "female";
  return (
    <div className="sk-form fl-form">
      <div className="sk-field">
        <label className="sk-label" htmlFor={uid + "g"}>{t("gotraL")}</label>
        <GotraField id={uid + "g"} value={sk.gotra} onChange={sk.setGotra} lang={lang} />
      </div>
      <div className="sk-field">
        <label className="sk-label" htmlFor={uid + "n"}>{t("namaL")}</label>
        <input id={uid + "n"} className="sk-input" value={sk.nama} onChange={(e) => sk.setNama(e.target.value)} placeholder="—" autoComplete="off" />
      </div>
      <div className="sk-field">
        <span className="sk-label">{t("genderL")}</span>
        <div className="sk-seg">
          <button className={male ? "on" : ""} onClick={() => sk.setGender("male")}>{t("male")}</button>
          <button className={!male ? "on" : ""} onClick={() => sk.setGender("female")}>{t("female")}</button>
        </div>
      </div>
      {unknown !== false && !sk.gotra.trim() && (
        <button className="fl-unknown" onClick={() => sk.setGotra("Kāśyapa")}>{t("dontKnowGotra")}</button>
      )}
    </div>
  );
}

/* ---- what the app already knows, and the one thing it doesn't ----
   The clauses are real: computed for today, at the reciter's place, under
   their own reckoning. The blank at the end is the ask. */
function KnownClauses({ lang, sk }) {
  const L = STUTI_L, PA = AKSHARA_PANCHANGA, TR = STUTI_TRANSLIT, DS = STUTI_DESA;
  const { loc } = useLoc();
  let pa = null;
  try { pa = PA.forDay(new Date(), loc, { instant: true }); } catch (e) {}
  if (!pa) return null;
  const samv = samvatsaraFor(new Date());
  const sc = (deva, iast) => lang === "telugu" ? TR.convert(deva, "telugu") : lang === "roman" ? iast : deva;
  const rows = [
    ["limbSamvatsara", sc(samv[1], samv[0])],
    ["limbMasa", sc(masaShown(pa).deva, masaShown(pa).iast)],
    ["limbPaksha", sc(pa.pakshaDeva, pa.paksha)],
    ["limbTithi", sc(pa.tithiDeva, pa.tithiName)],
    ["limbNakshatra", sc(pa.nak.deva, pa.nak.iast)],
    ["desaL", DS ? DS.describe(loc, lang === "roman" ? "iast" : "deva") : ""],
  ];
  return (
    <div className="fl-known">
      <div className="fl-known-cap">{L.t("flKnownCap", lang)}</div>
      <div className="fl-known-rows">
        {rows.map(([k, v]) => (
          <div className="fl-known-row" key={k}>
            <span>{L.t(k, lang)}</span>
            <b style={{ fontFamily: flFont(lang) }}>{lang === "telugu" ? TR.convert(v, "telugu") : v}</b>
          </div>
        ))}
        <div className="fl-known-row fl-known-blank">
          <span>{L.t("gotraL", lang)} · {L.t("namaL", lang)}</span>
          <b>{(sk && sk.ready) ? (sk.gotra + " · " + sk.nama) : "____"}</b>
        </div>
      </div>
    </div>
  );
}

/* ---- the saṅkalpa, as a thing you have ---- */
function SankalpaSheet({ vm, sk, L, go }) {
  const I = STUTI_L, t = (k) => I.t(k, L);
  const F = STUTI_FLYLEAF, DS = STUTI_DESA;
  const { loc } = useLoc();
  const SK = SK_CONST;
  const [copied, setCopied] = useStateF(false);
  const [edit, setEdit] = useStateF(false);
  const asks = F.asksFrame(loc);
  const copy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(vm.skPlain).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {});
  };
  return (
    <div className="rh-sk">
      {/* travel. Times follow the device without asking; the deśa clause is a
          matter of school, so it is asked once, here, where the consequence is
          the very line above the question. */}
      {asks && (
        <div className="fl-travel">
          <div className="fl-travel-lede">{t("travelMoved").replace("{city}", loc.city)}</div>
          <div className="fl-travel-line" style={{ fontFamily: flFont(L) }}>{vm.desaLine || "—"}</div>
          <div className="fl-travel-acts">
            <button className="fl-travel-yes" onClick={() => F.settleFrame(asks, asks)}>
              {t((DS.LABEL_KEY[asks]) || "frameBharata")}
            </button>
            <button className="fl-travel-no" onClick={() => F.settleFrame("bharata", asks)}>{t("frameBharata")}</button>
          </div>
        </div>
      )}

      {!sk.ready && (
        <div className="fl-ask">
          <p className="fl-ask-lede">{t("flAskLede")}</p>
          <KnownClauses lang={L} sk={sk} />
          <FlyleafForm sk={sk} lang={L} />
        </div>
      )}

      <div className="sk-out">
        <div className="sankalpa-line" style={{ fontFamily: flFont(L), lineHeight: L === "telugu" ? 1.95 : 1.75 }}>
          {vm.skSegs.map((s, i) => s.em ? <b key={i}>{vm.segText(s)}{" "}</b> : <span key={i}>{vm.segText(s)}{" "}</span>)}
        </div>
        <div className="sk-actions">
          <button className="sk-copy" onClick={copy}><Icon name={copied ? "check" : "copy"} size={16} /> {copied ? t("copied") : t("copy")}</button>
        </div>
        <div className="sk-avoid"><Icon name="clock" size={14} /> {t("avoidRahu")}: <b>{vm.rahuStr}</b></div>
      </div>

      {sk.ready && (
        <div className="fl-tail">
          <div className="sk-field">
            <span className="sk-label">{t("intentionL")}</span>
            <Picker value={sk.karma} onChange={sk.setKarma} ariaLabel={t("intentionL")}
              options={SK.KARMAS.map((k) => ({ value: k.id, label: k.label[L] || k.label.roman }))} />
          </div>
          {edit
            ? <FlyleafForm sk={sk} lang={L} />
            : <button className="fl-edit" onClick={() => setEdit(true)}>{t("flEdit")}</button>}
        </div>
      )}
      <div className="sankalpa-note">{t("flDeviceNote")}</div>
    </div>
  );
}

/* ---- and the same store, in Settings ---- */
function FlyleafSettings({ lang }) {
  const L = STUTI_L;
  const sk = useFlyleaf();
  return (
    <SetSection title={L.t("flTitle", lang)} note={L.t("flDeviceNote", lang)}>
      <div className="fl-set"><FlyleafForm sk={sk} lang={lang} /></div>
    </SetSection>
  );
}

export { useFlyleaf, GotraField, FlyleafForm, KnownClauses, SankalpaSheet, FlyleafSettings, flFont };

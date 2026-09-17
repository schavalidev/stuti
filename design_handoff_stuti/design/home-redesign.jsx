/* ============================================================
   STUTI — Home redesign exploration (3 directions)
   Each direction keeps the shipping home's greeting, search and
   "continue reciting" card, but presents the FULL pañcāṅga inline
   and makes the saṅkalpa collapsible — with a different mechanism:
     A · Almanac — sectioned editorial card; saṅkalpa accordion.
     B · Calm    — airy full-height list; saṅkalpa bottom sheet.
     C · Grid    — compact stat dashboard; saṅkalpa persistent panel.
   Built on the real engine + stores, so the data is today's data.
   ============================================================ */
/* Wrapped in its own scope on purpose: this file lifts twenty names off window
   — Icon, MoonPhase, useLoc, todayInfo and the rest — that the files loaded
   before it declare at top level. Injected scripts share one global scope, so
   each of those was a redeclaration, and the whole exploration died on the
   first one. Nothing here is needed by anything else; it mounts itself. */
(function () {
const { useState: rS } = React;
const {
  Icon, Flame, Seal, deityStyle, MoonPhase, RtuGlyph, RTU_VIS,
  useLoc, samvatsaraFor, todayInfo, ContinueCard, HomeSearchBar, LocationControl,
  SK_CONST, STUTI_L, STUTI_TRANSLIT, AKSHARA_PANCHANGA: PA,
} = window;

const noGo = () => {};
const RH_SCRIPTS = [{ k: "deva", n: "देव" }, { k: "roman", n: "IAST" }, { k: "telugu", n: "తెలుగు" }];
const BRAND = { deva: "स्तुति", telugu: "స్తుతి", roman: "" };
const SECT = {
  coord:   { roman: "Coordinates",   deva: "स्थान · काल",   telugu: "స్థల · కాలం" },
  sun:     { roman: "Sun & day",     deva: "सूर्य · दिनमान", telugu: "సూర్యుడు · పగలు" },
  yk:      { roman: "Yoga · Karaṇa", deva: "योग · करण",     telugu: "యోగం · కరణం" },
  caution: { roman: "To avoid",      deva: "त्याज्य काल",    telugu: "వర్జ్య కాలం" },
};
const sFont = s => s === "telugu" ? "var(--font-telugu)" : s === "roman" ? "var(--font-display)" : "var(--font-deva)";
const skNorm = x => (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/* ---- saṅkalpa builder state (initialised from the app's own keys,
        written back only on user edit so the two stay in sync) ---- */
function lsGet(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function useSankalpa() {
  const [gotra, sg] = rS(() => lsGet("stuti-gotra", ""));
  const [nama, sn] = rS(() => lsGet("stuti-nama", ""));
  const [gender, sgn] = rS(() => lsGet("stuti-gender", "male"));
  const [karma, sk] = rS(() => lsGet("stuti-karma", "parayana"));
  const [frame, sf] = rS(() => lsGet("stuti-frame", ""));
  const [desa, sd] = rS(() => lsGet("stuti-desa", ""));
  const wrap = (setter, key) => v => { setter(v); lsSet(key, v); };
  return {
    gotra, nama, gender, karma, frame, desa,
    setGotra: wrap(sg, "stuti-gotra"), setNama: wrap(sn, "stuti-nama"),
    setGender: wrap(sgn, "stuti-gender"), setKarma: wrap(sk, "stuti-karma"),
    setFrame: wrap(sf, "stuti-frame"), setDesa: wrap(sd, "stuti-desa"),
  };
}

/* ---- the view-model: everything a presentation needs for today ---- */
function usePanchangaVM(lang, sk, deity) {
  const L = lang || "deva";
  const { loc } = useLoc();
  const now = new Date();
  const dateLocale = L === "telugu" ? "te-IN" : L === "deva" ? "hi-IN" : undefined;
  const pa = PA.forDay(now, loc, { instant: true });
  const samv = samvatsaraFor(now);
  const dateStr = now.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long" });
  const rv = RTU_VIS[pa.ritu.iast] || RTU_VIS["Grīṣma"];

  const pick = o => L === "telugu" ? { main: o.tel, sub: o.iast } : L === "roman" ? { main: o.iast, sub: null } : { main: o.deva, sub: o.iast };
  const samvTel = STUTI_TRANSLIT.convert(samv[1], "telugu");
  const varaGraha = SK_CONST.VARA_GRAHA[pa.varaIdx] || SK_CONST.VARA_GRAHA[0];
  const varaP = pick({ iast: varaGraha.iast, deva: varaGraha.deva, tel: varaGraha.tel });
  const nakP = pick(pa.nak), masaP = pick(window.masaShown(pa)), rituP = pick(pa.ritu), ayanaP = pick(pa.ayana);
  const samvP = pick({ iast: samv[0], deva: samv[1], tel: samvTel });
  const tithiP = pick({ iast: pa.tithiName, deva: pa.tithiDeva, tel: pa.tithiTel });
  const localName = (iast, deva) => L === "telugu" ? STUTI_TRANSLIT.convert(deva || iast, "telugu") : L === "deva" ? (deva || iast) : iast;
  const yogaV = localName(pa.yoga, SK_CONST.YOGA_DEVA[pa.yoga]);
  const karanaV = localName(pa.karana, SK_CONST.KARANA_DEVA[pa.karana]);

  const untilW = STUTI_L.t("untilTime", L);
  const tmrwW = pa.tithiEndsTomorrow ? " (" + STUTI_L.t("tomorrowShort", L) + ")" : "";
  const tEnd = PA.fmtTime(pa.tithiEndMin);
  const endsStr = L === "roman" ? `${untilW} ${tEnd}${tmrwW}` : `${tEnd} ${untilW}${tmrwW}`;
  const fmtWindow = w => w ? `${PA.fmtTime(w.start)} – ${PA.fmtTime(w.end)}` : "—";

  const isUttar = pa.ayana.iast.startsWith("Uttar");
  const coord = [
    { key: "limbSamvatsara", main: samvP.main, sub: samvP.sub, script: true },
    { key: "limbAyana", main: ayanaP.main, sub: isUttar ? "northward" : "southward", script: true },
    { key: "limbRtu", main: rituP.main, sub: pa.ritu.en, script: true, glyph: <RtuGlyph kind={rv.kind} size={19} />, glyphColor: rv.hue },
    { key: "limbMasa", main: masaP.main, sub: masaP.sub, script: true },
    { key: "limbVara", main: varaP.main, sub: varaP.sub, script: true },
    { key: "limbNakshatra", main: nakP.main, sub: nakP.sub, script: true },
  ];
  const sun = [
    { key: "sunrise", main: PA.fmtTime(pa.sunrise) },
    { key: "sunset", main: PA.fmtTime(pa.sunset) },
    { key: "dayLength", main: PA.fmtDur(pa.dayLen) },
    { key: "tithiEnds", main: PA.fmtTime(pa.tithiEndMin) + (pa.tithiEndsTomorrow ? " (+1)" : "") },
  ];
  const yk = [
    { key: "yoga", main: yogaV, script: true },
    { key: "karana", main: karanaV, script: true },
  ];
  const caution = [
    { key: "rahuKala", vals: [fmtWindow(pa.rahu)] },
    { key: "durmuhurta", vals: pa.durmuhurta ? pa.durmuhurta.map(fmtWindow) : ["—"] },
  ];

  /* saṅkalpa segments — the day's coordinates + the reciter's details */
  const ayanaLocIast = isUttar ? "Uttar\u0101ya\u1e47e" : "Dak\u1e63i\u1e47\u0101yane";
  const ayanaLocDeva = isUttar ? "\u0909\u0924\u094d\u0924\u0930\u093e\u092f\u0923\u0947" : "\u0926\u0915\u094d\u0937\u093f\u0923\u093e\u092f\u0928\u0947";
  const gotraObj = SK_CONST.GOTRAS.find(g => skNorm(g[0]) === skNorm(sk.gotra));
  const gDeva = gotraObj ? gotraObj[1] : (sk.gotra.trim() || "____");
  const gIast = gotraObj ? gotraObj[0] : (sk.gotra.trim() || "____");
  const nm = sk.nama.trim() || "____";
  const male = sk.gender !== "female";
  const karmaObj = SK_CONST.KARMAS.find(k => k.id === sk.karma) || SK_CONST.KARMAS[0];
  const seg = (deva, iast, em) => ({ deva, iast, em: !!em });
  const DS = window.STUTI_DESA;
  const desaSegs = DS
    ? DS.segs(loc, seg, sk.desa, sk.frame || undefined)
    : [seg("जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, मेरोः दक्षिण-दिग्भागे,", "jambū-dvīpe, bhārata-varṣe, bharata-khaṇḍe, meroḥ dakṣiṇa-digbhāge,")];
  const saura = typeof window.manaSys === "function" && window.manaSys() === "saura";
  const sd = saura && PA.solarDate ? PA.solarDate(now) : null;
  const skSegs = [
    seg("ॐ श्री", "Oṃ Śrī"),
    seg("मम उपात्त-समस्त-दुरितक्षयद्वारा श्रीपरमेश्वर-प्रीत्यर्थं,", "mama upātta-samasta-durita-kṣaya-dvārā śrī-parameśvara-prītyarthaṃ,"),
    seg("शुभे शोभने मुहूर्ते,", "śubhe śobhane muhūrte,"),
    seg("आद्य-ब्रह्मणः द्वितीय-परार्धे, श्वेत-वराह-कल्पे, वैवस्वत-मन्वन्तरे, कलियुगे, प्रथम-पादे,", "ādya-brahmaṇaḥ dvitīya-parārdhe, śveta-varāha-kalpe, vaivasvata-manvantare, kaliyuge, prathama-pāde,"),
    ...desaSegs,
    saura
      ? seg("अस्मिन् वर्तमान-व्यावहारिक सौरमानेन,", "asmin vartamāna-vyāvahārika sauramānena,")
      : seg("अस्मिन् वर्तमान-व्यावहारिक चान्द्रमानेन,", "asmin vartamāna-vyāvahārika cāndramānena,"),
    seg(`${samv[1]} नाम संवत्सरे,`, `${samv[0]} nāma saṃvatsare,`, true),
    seg(`${ayanaLocDeva},`, `${ayanaLocIast},`, true),
    seg(`${pa.ritu.deva} ऋतौ,`, `${pa.ritu.iast} ṛtau,`, true),
    saura && sd
      ? seg(`${sd.masa.deva} मासे, ${PA.toDeva(sd.day)} दिने,`, `${sd.masa.iast} māse, ${sd.day} dine,`, true)
      : seg(`${window.masaShown(pa).deva} मासे,`, `${window.masaShown(pa).iast} māse,`, true),
    seg(`${pa.pakshaDeva} पक्षे,`, `${pa.paksha} pakṣe,`, true),
    seg(`${pa.tithiDeva} तिथौ,`, `${pa.tithiName} tithau,`, true),
    seg(`${varaGraha.deva} वासरे,`, `${varaGraha.iast} vāsare,`, true),
    seg(`${pa.nak.deva} नक्षत्र-युक्तायां,`, `${pa.nak.iast} nakṣatra-yuktāyāṃ,`, true),
    seg("शुभयोग-शुभकरण-एवंगुण-विशेषण-विशिष्टायां अस्यां शुभतिथौ,", "śubha-yoga-śubha-karaṇa-evaṃguṇa-viśeṣaṇa-viśiṣṭāyām asyāṃ śubha-tithau,"),
    seg(
      male ? `${gDeva}-गोत्रस्य ${nm}-नामधेयस्य अहम्` : `${gDeva}-गोत्रायाः ${nm}-नामधेयायाः अहम्`,
      male ? `${gIast}-gotrasya ${nm}-nāmadheyasya aham` : `${gIast}-gotrāyāḥ ${nm}-nāmadheyāyāḥ aham`,
      true
    ),
    deity
      ? seg(`श्री ${deity.deva}-प्रीत्यर्थं ${karmaObj.deva} करिष्ये॥`, `śrī ${deity.name}-prītyarthaṃ ${karmaObj.iast} kariṣye.`)
      : seg(`इष्टकाम्यार्थसिद्ध्यर्थं ${karmaObj.deva} करिष्ये॥`, `iṣṭa-kāmyārtha-siddhyarthaṃ ${karmaObj.iast} kariṣye.`),
  ];
  const segText = s => L === "telugu" ? STUTI_TRANSLIT.convert(s.deva, "telugu") : L === "deva" ? s.deva : s.iast;
  const skPlain = skSegs.map(segText).join(" ");

  return {
    L, pa, dateStr, rv,
    tithi: { main: tithiP.main, full: `${pa.paksha} ${pa.tithiName}`, ends: endsStr },
    coord, sun, yk, caution, obs: pa.observances || [],
    skSegs, segText, skPlain, rahuStr: fmtWindow(pa.rahu),
    desaLine: DS ? (L === "telugu" ? STUTI_TRANSLIT.convert(DS.describe(loc, "deva"), "telugu") : DS.describe(loc, L === "roman" ? "iast" : "deva")) : "",
    desaOutside: DS ? !DS.inIndia(loc) : false,
    desaSuggest: DS ? DS.suggest(loc) : "bharata",
  };
}

/* ---- shared bits ------------------------------------------------------ */
function Greeting({ lang }) {
  return <div className="home-greet"><span>{STUTI_L.greeting(lang)}</span><LocationControl /></div>;
}

function SankalpaBody({ vm, sk, L }) {
  const t = k => STUTI_L.t(k, L);
  const uid = React.useId();
  const [copied, setCopied] = rS(false);
  const male = sk.gender !== "female";
  const copy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(vm.skPlain).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }).catch(() => {});
  };
  return (
    <div className="rh-sk">
      <div className="sk-form">
        <div className="sk-field">
          <label className="sk-label" htmlFor={uid + "g"}>{t("gotraL")}</label>
          <input id={uid + "g"} className="sk-input" value={sk.gotra} onChange={e => sk.setGotra(e.target.value)} placeholder="Bhāradvāja" autoComplete="off" spellCheck="false" />
        </div>
        <div className="sk-field">
          <label className="sk-label" htmlFor={uid + "n"}>{t("namaL")}</label>
          <input id={uid + "n"} className="sk-input" value={sk.nama} onChange={e => sk.setNama(e.target.value)} placeholder="—" autoComplete="off" />
        </div>
        <div className="sk-field">
          <span className="sk-label">{t("genderL")}</span>
          <div className="sk-seg">
            <button className={male ? "on" : ""} onClick={() => sk.setGender("male")}>{t("male")}</button>
            <button className={!male ? "on" : ""} onClick={() => sk.setGender("female")}>{t("female")}</button>
          </div>
        </div>
        <div className="sk-field">
          <label className="sk-label" htmlFor={uid + "k"}>{t("intentionL")}</label>
          <select id={uid + "k"} className="sk-input" value={sk.karma} onChange={e => sk.setKarma(e.target.value)}>
            {SK_CONST.KARMAS.map(k => <option key={k.id} value={k.id}>{k.label[L] || k.label.roman}</option>)}
          </select>
        </div>
      </div>
      {!sk.gotra.trim() && (
        <div className="sk-hint"><button onClick={() => sk.setGotra("Kāśyapa")}>{t("dontKnowGotra")}</button></div>
      )}
      <div className="sk-desa">
        <span className="sk-label">{t("desaL")}</span>
        <div className="sk-desa-line" style={{ fontFamily: sFont(L) }}>{vm.desaLine || "—"}</div>
        {vm.desaOutside && (
          <React.Fragment>
            <p className="sk-desa-note">{t("desaOutside")}</p>
            <div className="sk-seg sk-desa-seg">
              <button className={sk.frame === "bharata" ? "on" : ""} onClick={() => sk.setFrame("bharata")}>{t("frameBharata")}</button>
              <button className={sk.frame !== "bharata" ? "on" : ""} onClick={() => sk.setFrame(vm.desaSuggest)}>{t((window.STUTI_DESA && STUTI_DESA.LABEL_KEY[vm.desaSuggest]) || "frameBharata")}</button>
            </div>
            <label className="sk-label" htmlFor={uid + "d"}>{t("desaCustomL")}</label>
            <input id={uid + "d"} className="sk-input" value={sk.desa} onChange={e => sk.setDesa(e.target.value)} placeholder="—" autoComplete="off" />
          </React.Fragment>
        )}
      </div>
      <div className="sk-out">
        <div className="sankalpa-line" style={{ fontFamily: sFont(L), lineHeight: L === "telugu" ? 1.95 : 1.75 }}>
          {vm.skSegs.map((s, i) => s.em ? <b key={i}>{vm.segText(s)}{" "}</b> : <span key={i}>{vm.segText(s)}{" "}</span>)}
        </div>
        <div className="sk-actions">
          <button className="sk-copy" onClick={copy}><Icon name={copied ? "check" : "copy"} size={16} /> {copied ? t("copied") : t("copy")}</button>
        </div>
        <div className="sk-avoid"><Icon name="clock" size={14} /> {t("avoidRahu")}: <b>{vm.rahuStr}</b></div>
      </div>
      <div className="sankalpa-note">{t("desaNote")}</div>
    </div>
  );
}

/* limb cell (coordinates grid) — mirrors the app's <Limb> */
function LimbCell({ it, L }) {
  const t = k => STUTI_L.t(k, L);
  return (
    <div className="limb">
      <div className="limb-label" style={L === "roman" ? undefined : { fontFamily: sFont(L), letterSpacing: "normal", textTransform: "none", fontSize: 13 }}>{t(it.key)}</div>
      <div className="limb-deva" style={{ fontFamily: sFont(L), fontSize: L === "telugu" ? 22 : undefined, overflowWrap: "anywhere", wordBreak: "break-word" }}>
        {it.glyph && <span className="limb-glyph" style={{ color: it.glyphColor }}>{it.glyph}</span>}<span>{it.main}</span>
      </div>
      {it.sub && L === "roman" && <div className="limb-sub">{it.sub}</div>}
    </div>
  );
}

/* ============================================================
   A — Almanac
   ============================================================ */
function HomeAlmanac({ lang }) {
  const L = lang, t = k => STUTI_L.t(k, L);
  const sk = useSankalpa();
  const { deity } = todayInfo();
  const vm = usePanchangaVM(L, sk, deity);
  const [skOpen, setSkOpen] = rS(false);
  const st = k => SECT[k][L] || SECT[k].roman;
  const Rows = ({ items, caution }) => (
    <div className="rha-rows">
      {items.map(it => (
        <div className={"rha-row" + (caution ? " caution" : "")} key={it.key}>
          <span className="rha-row-k">{t(it.key)}</span>
          <span className="rha-row-v" style={it.script ? { fontFamily: sFont(L) } : undefined}>{it.vals ? it.vals.map((v, i) => <div key={i}>{v}</div>) : it.main}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="rh-home" style={deityStyle(deity)}>
      <Greeting lang={L} />
      <HomeSearchBar go={noGo} lang={L} />
      <section className="rha-card">
        <div className="pcard-glow" />
        <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{t("todaysPanchanga")}</div>
        <div className="pcard-date">{vm.dateStr}</div>
        <div className="pcard-tithi">
          <MoonPhase phase={vm.pa.phase} size={46} />
          <div className="pcard-tithi-body">
            <div className="pcard-tithi-deva" style={{ fontFamily: sFont(L) }}>{vm.tithi.main}</div>
            {L === "roman" && <div className="pcard-tithi-rom">{vm.tithi.full}</div>}
            <div className="pcard-tithi-ends">{vm.tithi.ends}</div>
          </div>
        </div>
        <div className="rha-sect">
          <div className="rha-sect-h">{st("coord")}</div>
          <div className="rha-limbs">{vm.coord.map(it => <LimbCell key={it.key} it={it} L={L} />)}</div>
        </div>
        <div className="rha-sect"><div className="rha-sect-h">{st("sun")}</div><Rows items={vm.sun} /></div>
        <div className="rha-sect"><div className="rha-sect-h">{st("yk")}</div><Rows items={vm.yk} /></div>
        <div className="rha-sect"><div className="rha-sect-h">{st("caution")}</div><Rows items={vm.caution} caution /></div>
        {vm.obs.length > 0 && (
          <div className="rha-obs">{vm.obs.map(o => <div key={o.id}><b>{L === "deva" ? (o.deva || o.name) : o.name}</b> — {o.note}</div>)}</div>
        )}
        <button className={"rha-skbar" + (skOpen ? " is-open" : "")} onClick={() => setSkOpen(o => !o)}>
          <span className="rha-skbar-l"><Icon name="spark" size={18} /> {skOpen ? t("hideSankalpa") : t("makeSankalpa")}</span>
          <span className="rh-chev"><Icon name="chev" size={18} /></span>
        </button>
        {skOpen && <div className="rha-skbody"><SankalpaBody vm={vm} sk={sk} L={L} /></div>}
      </section>
      <div style={{ height: 16 }} />
      <ContinueCard go={noGo} lang={L} />
    </div>
  );
}

/* ============================================================
   B — Calm (bottom-sheet saṅkalpa)
   ============================================================ */
function HomeCalm({ lang, overlayEl }) {
  const L = lang, t = k => STUTI_L.t(k, L);
  const sk = useSankalpa();
  const { deity } = todayInfo();
  const vm = usePanchangaVM(L, sk, deity);
  const [open, setOpen] = rS(false);
  const rows = [
    ...vm.coord.map(it => ({ ...it })),
    ...vm.sun, ...vm.yk,
    ...vm.caution.map(it => ({ ...it, caution: true })),
  ];
  return (
    <div className="rh-home" style={deityStyle(deity)}>
      <Greeting lang={L} />
      <HomeSearchBar go={noGo} lang={L} />
      <section className="rhb-card">
        <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{t("todaysPanchanga")}</div>
        <div className="rhb-date">{vm.dateStr}</div>
        <div className="rhb-hero">
          <MoonPhase phase={vm.pa.phase} size={62} />
          <div>
            <div className={"rhb-tithi" + (L === "roman" ? " roman" : "")} style={{ fontFamily: sFont(L) }}>{vm.tithi.main}</div>
            <div className="rhb-tithi-sub">{L === "roman" ? `${vm.tithi.full} · ${vm.tithi.ends}` : vm.tithi.ends}</div>
          </div>
        </div>
        <div className="rhb-rows">
          {rows.map(it => (
            <div className={"rhb-row" + (it.caution ? " caution" : "")} key={it.key}>
              <span className="rhb-row-k">{t(it.key)}</span>
              <span className="rhb-row-v" style={it.script ? { fontFamily: sFont(L) } : undefined}>
                {it.vals ? it.vals.map((v, i) => <div key={i}>{v}</div>) : <React.Fragment>{it.main}{it.sub && L === "roman" && <small>{it.sub}</small>}</React.Fragment>}
              </span>
            </div>
          ))}
        </div>
      </section>
      <button className="rhb-cta" onClick={() => setOpen(true)}><Icon name="spark" size={20} /> {t("makeSankalpa")}</button>
      <div style={{ height: 16 }} />
      <ContinueCard go={noGo} lang={L} />
      {overlayEl && ReactDOM.createPortal(
        <React.Fragment>
          <div className={"rhb-scrim" + (open ? " on" : "")} onClick={() => setOpen(false)} />
          <div className={"rhb-sheet" + (open ? " on" : "")} style={deityStyle(deity)}>
            <div className="rhb-grab" />
            <div className="rhb-sheet-head">
              <span className="rhb-sheet-title display">{t("makeSankalpa")}</span>
              <button className="rhb-sheet-x" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>
            <div className="rhb-sheet-body"><SankalpaBody vm={vm} sk={sk} L={L} /></div>
          </div>
        </React.Fragment>, overlayEl)}
    </div>
  );
}

/* ============================================================
   C — Grid (persistent expandable saṅkalpa)
   ============================================================ */
function HomeGrid({ lang }) {
  const L = lang, t = k => STUTI_L.t(k, L);
  const sk = useSankalpa();
  const { deity } = todayInfo();
  const vm = usePanchangaVM(L, sk, deity);
  const [skOpen, setSkOpen] = rS(true);
  const cells = [...vm.coord, ...vm.sun, ...vm.yk];
  return (
    <div className="rh-home" style={deityStyle(deity)}>
      <Greeting lang={L} />
      <HomeSearchBar go={noGo} lang={L} />
      <section className="rhc-card">
        <div className="rhc-hero">
          <MoonPhase phase={vm.pa.phase} size={46} />
          <div className="rhc-hero-body">
            <div className="rhc-date">{vm.dateStr}</div>
            <div className={"rhc-tithi" + (L === "roman" ? " roman" : "")} style={{ fontFamily: sFont(L) }}>{vm.tithi.main}</div>
            <div className="rhc-ends">{vm.tithi.ends}</div>
          </div>
        </div>
        <div className="rhc-grid">
          {cells.map(it => (
            <div className="rhc-cell" key={it.key}>
              <div className="rhc-cell-k">{t(it.key)}</div>
              <div className="rhc-cell-v" style={it.script ? { fontFamily: sFont(L) } : undefined}>
                {it.main}{it.sub && L === "roman" && <small> · {it.sub}</small>}
              </div>
            </div>
          ))}
          {vm.caution.map(it => (
            <div className="rhc-cell caution wide" key={it.key}>
              <div className="rhc-cell-k">{t(it.key)}</div>
              <div className="rhc-cell-v">{it.vals.map((v, i) => <div key={i}>{v}</div>)}</div>
            </div>
          ))}
        </div>
        {vm.obs.length > 0 && (
          <div className="rhc-obs">{vm.obs.map(o => <span key={o.id}>{L === "deva" ? (o.deva || o.name) : o.name}</span>)}</div>
        )}
      </section>
      <section className={"rhc-sk" + (skOpen ? " open" : "")}>
        <button className="rhc-sk-head" onClick={() => setSkOpen(o => !o)}>
          <span className="rhc-sk-head-l"><Icon name="spark" size={18} /> {t("makeSankalpa")}</span>
          <span className="rh-chev"><Icon name="chev" size={18} /></span>
        </button>
        {skOpen
          ? <div className="rhc-sk-body"><SankalpaBody vm={vm} sk={sk} L={L} /></div>
          : <div className="rhc-sk-peek" style={{ fontFamily: sFont(L) }}>{vm.skPlain}</div>}
      </section>
      <div style={{ height: 16 }} />
      <ContinueCard go={noGo} lang={L} />
    </div>
  );
}

/* ---- phone shell: brand bar + view + tab bar, per-frame theme/script -- */
function RHTop({ lang, setLang, theme, setTheme }) {
  return (
    <div className="brandbar">
      <div className="brand">
        <Flame size={24} />
        <span className="brand-name display">Stuti</span>
        {BRAND[lang] && <span className="brand-script" style={{ fontFamily: sFont(lang) }}>{BRAND[lang]}</span>}
      </div>
      <div className="brandbar-actions">
        <div className="rh-scriptseg">
          {RH_SCRIPTS.map(s => (
            <button key={s.k} className={lang === s.k ? "on" : ""} onClick={() => setLang(s.k)} style={{ fontFamily: sFont(s.k) }}>{s.n}</button>
          ))}
        </div>
        <button className="icon-btn" onClick={() => setTheme(x => x === "day" ? "night" : "day")} aria-label="Day or night">
          <Icon name={theme === "night" ? "sun" : "moon"} />
        </button>
      </div>
    </div>
  );
}
function RHTabs({ lang }) {
  return (
    <nav className="tabbar">
      <button className="tab tab-on"><Icon name="home" size={25} /><span>{STUTI_L.t("today", lang)}</span></button>
      <button className="tab"><Icon name="flower" size={25} /><span>{STUTI_L.t("nitya", lang)}</span></button>
      <button className="tab"><Icon name="book" size={25} /><span>{STUTI_L.t("library", lang)}</span></button>
    </nav>
  );
}
function PhoneShell({ Home, label, sub, theme: t0 }) {
  const [lang, setLang] = rS("deva");
  const [theme, setTheme] = rS(t0 || "day");
  const [overlayEl, setOverlayEl] = rS(null);
  return (
    <div className="rh-frame">
      <div className="rh-frame-label">{label}</div>
      <div className="rh-frame-sub">{sub}</div>
      <div className="rh-phone" data-theme={theme}>
        <RHTop lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
        <div className="rh-view">
          <div className="rh-scroll"><Home lang={lang} overlayEl={overlayEl} /></div>
          <div className="rh-overlay" ref={setOverlayEl} />
          <RHTabs lang={lang} />
        </div>
      </div>
    </div>
  );
}

const FRAMES = [
  { el: "mountA", Home: HomeAlmanac, label: "A · Almanac", sub: "Sectioned editorial card. Full pañcāṅga in labelled groups; saṅkalpa opens as an accordion at the foot of the card." },
  { el: "mountB", Home: HomeCalm, label: "B · Calm", sub: "Airy, elder-first. Every limb & timing on its own generous row; saṅkalpa slides up as a focused bottom sheet." },
  { el: "mountC", Home: HomeGrid, label: "C · Grid", sub: "Compact dashboard. The whole almanac at a glance as a stat grid; saṅkalpa is a persistent panel, expanded by default." },
];
FRAMES.forEach(f => ReactDOM.createRoot(document.getElementById(f.el)).render(
  <PhoneShell Home={f.Home} label={f.label} sub={f.sub} theme={f.theme} />
));
})();

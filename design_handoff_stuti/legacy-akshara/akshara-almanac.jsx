/* ============================================================
   AKSHARA — the almanac, brought level with the app
   Everything the mobile app learned about the day that the website
   was still doing without: the saṅkalpa with a deśa clause read off
   the place, the day's windows (rāhu, yama, gulika, abhijit, brahma
   muhūrta, durmuhūrta, varjyam) beside moonrise, where each limb
   began as well as when it ends, a place list of two hundred rather
   than ten, the six saṅkrāntis no tithi rule can find, and the four
   reckoning questions the engine asks before it computes anything.

   The engine, the deśa clause, the muhūrta table and the saṅkalpa
   vocabulary are the app's own modules — this file is only the
   website's way of showing them: its editorial voice, its tokens,
   its Devanāgarī-source script switch.
   ============================================================ */
const AK_P = () => window.AKSHARA_PANCHANGA;
const akFold = (x) => (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const akLsGet = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
const akLsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const akTo = (deva, lang) => window.AKSHARA_SCRIPT.to(deva, lang);
const akFontClass = (lang) => window.AKSHARA_SCRIPT.fontClass(lang);
/* the muhūrta table names each window in three scripts — the site's own
   labels are roman with the Devanāgarī set beside them */
const akWinName = (w) => (w.label && w.label.roman) || w.label || "";
const akWinDeva = (w) => (w.label && w.label.deva) || "";

/* uppercase letterspaced label, the site's caption voice */
const AK_LABEL = { fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" };
const AK_VALUE = { fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" };
const AK_PANEL = { background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 8, padding: "16px 18px" };
const AK_INPUT = {
  width: "100%", boxSizing: "border-box", background: "var(--paper)", border: "1px solid var(--line)",
  borderRadius: 6, padding: "10px 12px", font: "inherit", fontSize: 15, color: "var(--ink)", outline: "none",
};

/* ------------------------------------------------------------
   The reckoning is read at render time — which means a screen
   showing it has to be told when it changes, or the click lands
   in storage and nowhere else. This is the app's own pattern:
   subscribe, and force the render that reads it again.
   ------------------------------------------------------------ */
function useAkPrefs() {
  const [, bump] = React.useState(0);
  React.useEffect(() => {
    const PR = window.STUTI_PREFS;
    if (!PR) return;
    return PR.subscribe(() => bump((n) => n + 1));
  }, []);
}

/* ------------------------------------------------------------
   Where the reciter is. Ten cities in a 6px select became two
   hundred in a searchable list — the engine has carried them
   since the app's own picker was built, and the website was
   still showing whichever ten came first.
   ------------------------------------------------------------ */
function AkLocationSearch({ loc, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [near, setNear] = React.useState(null);
  const box = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away);
    window.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); window.removeEventListener("keydown", esc); };
  }, [open]);

  const all = AK_P().locations;
  const hits = React.useMemo(() => {
    const n = akFold(q);
    if (!n) return all.filter((l) => l.top).slice(0, 40);
    return all.filter((l) =>
      akFold(l.city).indexOf(n) === 0 || akFold(l.region).indexOf(n) >= 0 ||
      akFold(l.city).indexOf(n) >= 0 || akFold(l.alt || "").indexOf(n) >= 0
    ).slice(0, 60);
  }, [q, all]);

  function locate() {
    if (!navigator.geolocation) { setNear("This browser will not share a position."); return; }
    setNear("Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          const n = AK_P().nearest(pos.coords.latitude, pos.coords.longitude);
          if (!n) { setNear("No known place nearby."); return; }
          onChange(n.id);
          setNear(null); setOpen(false);
        } catch (e) { setNear("Could not place you."); }
      },
      () => setNear("Position refused — choose a place instead."),
      { timeout: 8000 }
    );
  }

  return (
    <div ref={box} style={{ position: "relative" }}>
      <button onClick={() => { setOpen((o) => !o); setQ(""); }}
        style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(240,228,204,0.08)",
          border: "1px solid rgba(240,228,204,0.28)", borderRadius: 999, color: "var(--on-night)",
          fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, padding: "9px 18px" }}>
        <Icon name="mapPin" size={15} />
        <span>{loc.city}</span>
        {loc.elev ? <span style={{ color: "var(--on-night-soft)", fontSize: 13, fontWeight: 400 }}>{loc.elev} m</span> : null}
        <Icon name="chevronD" size={15} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 40, width: 340, maxWidth: "86vw",
          background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--shadow-lift)",
          padding: 12, color: "var(--ink)" }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="City, state or temple town"
            aria-label="Search places" style={AK_INPUT} />
          <button onClick={locate}
            style={{ marginTop: 8, width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 6,
              border: "1px dashed var(--line)", background: "transparent", color: "var(--maroon)", fontSize: 14 }}>
            Use my position
          </button>
          {near && <div style={{ fontSize: 12.5, color: "var(--ink-faint)", padding: "6px 2px 0" }}>{near}</div>}
          <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 10 }}>
            {hits.map((l) => (
              <button key={l.id} onClick={() => { onChange(l.id); setOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 6,
                  border: "none", background: l.id === loc.id ? "var(--paper-3)" : "transparent" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>{l.city}</span>
                <span style={{ color: "var(--ink-faint)", fontSize: 13, marginLeft: 8 }}>{l.region}</span>
              </button>
            ))}
            {!hits.length && <div style={{ fontSize: 13.5, color: "var(--ink-faint)", padding: "10px 2px" }}>No place by that name. Try the state, or the nearest large city.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   Where each limb began, not only when it lets go. A limb
   outlives a civil day, so a negative minute means it took hold
   before this midnight and a minute past 1440 means it runs on.
   ------------------------------------------------------------ */
function akLimbSpan(pa, key) {
  const P = AK_P();
  const s = pa[key + "StartMin"], e = pa[key + "EndMin"];
  const say = (m, wordBefore, wordAfter) => {
    if (m == null) return null;
    if (m < 0) return wordBefore + " " + P.fmtTime(((m % 1440) + 1440) % 1440) + " yesterday";
    if (m >= 1440) return wordAfter + " " + P.fmtTime(m - 1440) + " tomorrow";
    return (m === s ? "from " : "until ") + P.fmtTime(m);
  };
  const a = say(s, "from", "from"), b = say(e, "until", "until");
  return [a, b].filter(Boolean).join(" · ");
}

/* ------------------------------------------------------------
   The day's windows. Three to stand down in, three to begin in,
   and the moon's own two hours — the reason Saṅkaṣṭī is kept
   to moonrise and not to a clock.
   ------------------------------------------------------------ */
function AkDayWindows({ panch, date, loc }) {
  const P = AK_P();
  const M = window.STUTI_MUHURTA;
  const rows = React.useMemo(() => {
    try { return M ? M.windows(date, loc, panch) : []; } catch (e) { return []; }
  }, [date, loc, panch, M]);
  if (!rows.length) return null;
  const span = (w) => P.fmtTime(w.start) + "–" + P.fmtTime(w.end);
  return (
    <div>
      <div className="ornament" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>The day's windows</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((w, i) => (
          <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14,
            padding: "10px 0", borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", flex: "none",
                background: w.kind === "good" ? "var(--gold-bright)" : "var(--maroon)" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{akWinName(w)}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{w.kind === "good" ? "favoured" : "stand down"}</div>
              </div>
            </div>
            <div style={{ ...AK_VALUE, fontSize: 16, color: w.kind === "good" ? "var(--gold)" : "var(--maroon)" }}>{span(w)}</div>
          </div>
        ))}
        {(panch.moonrise != null || panch.moonset != null) && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 14,
            padding: "10px 0", borderTop: "1px solid var(--line-soft)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", flex: "none", background: "var(--ink-faint)" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>Moonrise · moonset</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>a nakta vrata is broken on sighting the moon</div>
              </div>
            </div>
            <div style={{ ...AK_VALUE, fontSize: 16 }}>
              {panch.moonrise != null ? P.fmtTime(panch.moonrise) : "—"} · {panch.moonset != null ? P.fmtTime(panch.moonset) : "—"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   What is running now, and what is next. The windows above are a
   table to consult; this is the one line that answers the
   question actually being asked at the moment of asking.
   ------------------------------------------------------------ */
function AkNowNext({ panch, date, loc }) {
  const P = AK_P(), M = window.STUTI_MUHURTA;
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);
  const cn = React.useMemo(() => {
    try { return M ? M.currentAndNext(date, loc, panch) : null; } catch (e) { return null; }
  }, [date, loc, panch, M]);
  if (!cn || (!cn.current && !cn.next)) return null;
  const hue = (w) => (w.kind === "good" ? "var(--gold-bright)" : "#D9927F");
  const dot = (w) => <span style={{ width: 7, height: 7, borderRadius: "50%", background: hue(w), display: "inline-block" }} />;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginTop: 14,
      color: "var(--on-night-soft)", fontSize: 14.5 }}>
      {cn.current
        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {dot(cn.current)} Now <b style={{ color: "var(--on-night)", fontWeight: 600 }}>{akWinName(cn.current)}</b>
            <span>until {P.fmtTime(cn.current.end)}</span>
          </span>
        : <span>No window is running.</span>}
      {cn.next && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {dot(cn.next)} Next <b style={{ color: "var(--on-night)", fontWeight: 600 }}>{akWinName(cn.next)}</b>
          <span>at {P.fmtTime(cn.next.start)}</span>
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   The saṅkalpa. The same words the app says — one builder, in
   stuti-desa.js and stuti-sankalpa-data.js — set in the site's
   own type. Gotra, name and intention share the app's stored
   answers, so a household fills them in once.
   ------------------------------------------------------------ */
function akSankalpaSegs(pa, loc, date, sk, deity) {
  const P = AK_P(), SK = window.STUTI_SK, DS = window.STUTI_DESA;
  const seg = (deva, iast, em) => ({ deva, iast, em: !!em });
  const samv = SK.samvatsaraFor(date);
  const gotraObj = SK.GOTRAS.find((g) => akFold(g[0]) === akFold(sk.gotra));
  const gDeva = gotraObj ? gotraObj[1] : (sk.gotra.trim() || "____");
  const gIast = gotraObj ? gotraObj[0] : (sk.gotra.trim() || "____");
  const nm = sk.nama.trim() || "____";
  const male = sk.gender !== "female";
  const karmaObj = SK.KARMAS.find((k) => k.id === sk.karma) || SK.KARMAS[0];
  const vara = SK.VARA_GRAHA[pa.varaIdx] || SK.VARA_GRAHA[0];
  const uttar = pa.ayana && /Uttar/i.test(pa.ayana.iast || "");
  const ayanaDeva = uttar ? "उत्तरायणे" : "दक्षिणायने";
  const ayanaIast = uttar ? "uttarāyaṇe" : "dakṣiṇāyane";
  const saura = typeof window.manaSys === "function" && window.manaSys() === "saura";
  const sd = saura && P.solarDate ? P.solarDate(date) : null;
  const masa = (window.masaShown ? window.masaShown(pa) : pa.masa) || pa.masa;
  const desaSegs = DS ? DS.segs(loc, seg, sk.desa, sk.frame || undefined) : [];
  return [
    seg("ॐ श्री", "Oṃ Śrī"),
    seg("मम उपात्त-समस्त-दुरितक्षयद्वारा श्रीपरमेश्वर-प्रीत्यर्थं,", "mama upātta-samasta-durita-kṣaya-dvārā śrī-parameśvara-prītyarthaṃ,"),
    seg("शुभे शोभने मुहूर्ते,", "śubhe śobhane muhūrte,"),
    seg("आद्य-ब्रह्मणः द्वितीय-परार्धे, श्वेत-वराह-कल्पे, वैवस्वत-मन्वन्तरे, कलियुगे, प्रथम-पादे,", "ādya-brahmaṇaḥ dvitīya-parārdhe, śveta-varāha-kalpe, vaivasvata-manvantare, kaliyuge, prathama-pāde,"),
    ...desaSegs,
    saura
      ? seg("अस्मिन् वर्तमान-व्यावहारिक सौरमानेन,", "asmin vartamāna-vyāvahārika sauramānena,")
      : seg("अस्मिन् वर्तमान-व्यावहारिक चान्द्रमानेन,", "asmin vartamāna-vyāvahārika cāndramānena,"),
    seg(samv[1] + " नाम संवत्सरे,", samv[0] + " nāma saṃvatsare,", true),
    seg(ayanaDeva + ",", ayanaIast + ",", true),
    seg(pa.ritu.deva + " ऋतौ,", pa.ritu.iast + " ṛtau,", true),
    saura && sd
      ? seg(sd.masa.deva + " मासे, " + P.toDeva(sd.day) + " दिने,", sd.masa.iast + " māse, " + sd.day + " dine,", true)
      : seg(masa.deva + " मासे,", masa.iast + " māse,", true),
    seg(pa.pakshaDeva + " पक्षे,", pa.paksha + " pakṣe,", true),
    seg(pa.tithiDeva + " तिथौ,", pa.tithiName + " tithau,", true),
    seg(vara.deva + " वासरे,", vara.iast + " vāsare,", true),
    seg(pa.nak.deva + " नक्षत्र-युक्तायां,", pa.nak.iast + " nakṣatra-yuktāyāṃ,", true),
    seg("शुभयोग-शुभकरण-एवंगुण-विशेषण-विशिष्टायां अस्यां शुभतिथौ,", "śubha-yoga-śubha-karaṇa-evaṃguṇa-viśeṣaṇa-viśiṣṭāyām asyāṃ śubha-tithau,"),
    seg(
      male ? gDeva + "-गोत्रस्य " + nm + "-नामधेयस्य अहम्" : gDeva + "-गोत्रायाः " + nm + "-नामधेयायाः अहम्",
      male ? gIast + "-gotrasya " + nm + "-nāmadheyasya aham" : gIast + "-gotrāyāḥ " + nm + "-nāmadheyāyāḥ aham",
      true
    ),
    deity
      ? seg("श्री " + deity.deva + "-प्रीत्यर्थं " + karmaObj.deva + " करिष्ये॥", "śrī " + deity.name + "-prītyarthaṃ " + karmaObj.iast + " kariṣye.")
      : seg("इष्टकाम्यार्थसिद्ध्यर्थं " + karmaObj.deva + " करिष्ये॥", "iṣṭa-kāmyārtha-siddhyarthaṃ " + karmaObj.iast + " kariṣye."),
  ];
}

function AkSankalpa({ panch, loc, date, lang, deity }) {
  const SK = window.STUTI_SK, DS = window.STUTI_DESA;
  useAkPrefs();
  const [gotra, setGotra] = React.useState(() => akLsGet("stuti-gotra", ""));
  const [nama, setNama] = React.useState(() => akLsGet("stuti-nama", ""));
  const [gender, setGender] = React.useState(() => akLsGet("stuti-gender", "male"));
  const [karma, setKarma] = React.useState(() => akLsGet("stuti-karma", "parayana"));
  const [frame, setFrame] = React.useState(() => akLsGet("stuti-frame", ""));
  const [desa, setDesa] = React.useState(() => akLsGet("stuti-desa", ""));
  const [copied, setCopied] = React.useState(false);
  const uid = React.useId();
  const put = (setter, key) => (v) => { setter(v); akLsSet(key, v); };
  const sk = { gotra, nama, gender, karma, frame, desa };

  const segs = akSankalpaSegs(panch, loc, date, sk, deity);
  const plain = segs.map((s) => s.iast).join(" ");
  const outside = DS ? !DS.inIndia(loc) : false;
  const suggest = DS ? DS.suggest(loc) : "bharata";
  const frameName = { bharata: "Jambūdvīpa · Bhāratavarṣa", ketumala: "Jambūdvīpa · Ketumālavarṣa",
    bhadrasva: "Jambūdvīpa · Bhadrāśvavarṣa", kraunca: "Krauñcadvīpa · Aindrakhaṇḍa" };
  const desaLine = DS ? DS.describe(loc, "iast") : "";

  function copy() {
    try {
      navigator.clipboard.writeText(plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {}
  }

  return (
    <section style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid var(--line)" }}>
        <span className="eyebrow" style={{ color: "var(--gold)" }}>Saṅkalpa</span>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 600, margin: "8px 0 6px" }}>What is said before beginning</h3>
        <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: 640, textWrap: "pretty" }}>
          A saṅkalpa names the moment and the place, then the intention. The moment comes from the
          pañcāṅga above; the place is read off {loc.city} — {desaLine || "the frame alone"} — and the
          rest is yours. Elders outrank this page.
        </p>
      </div>

      <div style={{ padding: "20px 28px 24px", display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
        <div>
          <label htmlFor={uid + "g"} style={AK_LABEL}>Gotra</label>
          <input id={uid + "g"} list={uid + "gl"} value={gotra} onChange={(e) => put(setGotra, "stuti-gotra")(e.target.value)}
            placeholder="Bhāradvāja" autoComplete="off" style={{ ...AK_INPUT, marginTop: 6 }} />
          <datalist id={uid + "gl"}>{SK.GOTRAS.map((g) => <option key={g[0]} value={g[0]} />)}</datalist>
        </div>
        <div>
          <label htmlFor={uid + "n"} style={AK_LABEL}>Name</label>
          <input id={uid + "n"} value={nama} onChange={(e) => put(setNama, "stuti-nama")(e.target.value)}
            placeholder="as it is said in a rite" autoComplete="off" style={{ ...AK_INPUT, marginTop: 6 }} />
        </div>
        <div>
          <span style={AK_LABEL}>Form</span>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {[["male", "gotrasya"], ["female", "gotrāyāḥ"]].map(([v, w]) => (
              <button key={v} onClick={() => put(setGender, "stuti-gender")(v)}
                style={{ flex: 1, padding: "10px 8px", borderRadius: 6, fontSize: 14,
                  border: "1px solid " + (gender === v ? "var(--maroon)" : "var(--line)"),
                  background: gender === v ? "var(--maroon)" : "var(--paper)",
                  color: gender === v ? "var(--paper)" : "var(--ink-soft)" }}>{w}</button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor={uid + "k"} style={AK_LABEL}>Intention</label>
          <select id={uid + "k"} value={karma} onChange={(e) => put(setKarma, "stuti-karma")(e.target.value)}
            style={{ ...AK_INPUT, marginTop: 6, appearance: "auto" }}>
            {SK.KARMAS.map((k) => <option key={k.id} value={k.id}>{k.label.roman}</option>)}
          </select>
        </div>
      </div>

      {outside && (
        <div style={{ padding: "0 28px 22px" }}>
          <div style={{ ...AK_PANEL, background: "var(--paper)" }}>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--ink-soft)", textWrap: "pretty" }}>
              Outside Bhārata the app names the varṣa on your side of Meru — Ketumāla to the west of it,
              Bhadrāśva to the east. The Americas are the disputed case: some say Krauñcadvīpa, some
              Plakṣa, many keep Jambū · Bhārata. Take whichever your family or ācārya follows.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {["bharata", suggest].filter((v, i, a) => a.indexOf(v) === i).map((v) => (
                <button key={v} onClick={() => put(setFrame, "stuti-frame")(v)}
                  style={{ padding: "8px 14px", borderRadius: 999, fontSize: 13.5,
                    border: "1px solid " + ((frame || suggest) === v ? "var(--maroon)" : "var(--line)"),
                    background: (frame || suggest) === v ? "var(--maroon)" : "transparent",
                    color: (frame || suggest) === v ? "var(--paper)" : "var(--ink-soft)" }}>{frameName[v]}</button>
              ))}
            </div>
            <label htmlFor={uid + "d"} style={{ ...AK_LABEL, display: "block", marginTop: 14 }}>Or the clause your family uses</label>
            <input id={uid + "d"} value={desa} onChange={(e) => put(setDesa, "stuti-desa")(e.target.value)}
              placeholder="—" autoComplete="off" style={{ ...AK_INPUT, marginTop: 6 }} />
          </div>
        </div>
      )}

      <div style={{ padding: "0 28px 26px" }}>
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8, padding: "22px 24px" }}>
          <p className={akFontClass(lang)} style={{ margin: 0, fontSize: 20, lineHeight: 1.95, color: "var(--ink)", textWrap: "pretty" }}>
            {segs.map((s, i) => (
              <span key={i} style={{ color: s.em ? "var(--maroon)" : "var(--ink)" }}>{akTo(s.deva, lang)} </span>
            ))}
          </p>
          <p style={{ margin: "16px 0 0", paddingTop: 16, borderTop: "1px dashed var(--line)", fontSize: 15,
            lineHeight: 1.75, color: "var(--ink-soft)", textWrap: "pretty" }}>
            {segs.map((s, i) => (
              <span key={i} style={{ color: s.em ? "var(--maroon)" : "var(--ink-soft)" }}>{s.iast} </span>
            ))}
          </p>
          <button onClick={copy}
            style={{ marginTop: 18, padding: "10px 18px", borderRadius: 999, border: "1px solid var(--maroon)",
              background: copied ? "var(--maroon)" : "transparent", color: copied ? "var(--paper)" : "var(--maroon)", fontSize: 14 }}>
            {copied ? "Copied" : "Copy the text"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   How the day was reckoned. Four questions with real answers —
   they change what every screen above says, which is why they
   are offered rather than assumed. Shared with the app.
   ------------------------------------------------------------ */
const AK_RECK = [
  { key: "reckoning", label: "Scheme", note: "drik follows the sky; vākya the Sūrya Siddhānta's arithmetic, as Tamil Nāḍu and much of Kerala keep temple time",
    opts: [["drik", "Drik"], ["vakya", "Vākya"]] },
  { key: "ayanamsa", label: "Ayanāṁśa", note: "where the sidereal zodiac is pinned — a few arc-minutes, and a saṅkrānti can fall on the other side of midnight",
    opts: [["lahiri", "Lahiri"], ["raman", "Raman"], ["kp", "KP"]] },
  { key: "masaSystem", label: "Month", note: "amānta counts a month from new moon (Deccan, south, west); pūrṇimānta from full moon (north, east) — the same days, different names through the dark fortnight",
    opts: [["amanta", "Amānta"], ["purnimanta", "Pūrṇimānta"]] },
  { key: "mana", label: "Saṅkalpa reckons by", note: "cāndramāna names the lunar month; sauramāna the rāśi the sun stands in and the day from its saṅkrānti — Tamil Nāḍu, Kerala, Bengal, Assam, Odisha",
    opts: [["candra", "Cāndra"], ["saura", "Saura"]] },
];

function AkReckoning() {
  const PR = window.STUTI_PREFS;
  /* the panel's own answers, plus the note that these are shared with the app */
  const [prefs, setPrefs] = React.useState(() => PR.get());
  React.useEffect(() => PR.subscribe(setPrefs), []);
  return (
    <div>
      <div className="ornament" style={{ marginBottom: 18 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>How this is reckoned</span>
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        {AK_RECK.map((row) => (
          <div key={row.key} style={AK_PANEL}>
            <div style={AK_LABEL}>{row.label}</div>
            <div style={{ display: "flex", gap: 8, margin: "10px 0 10px" }}>
              {row.opts.map(([v, name]) => (
                <button key={v} onClick={() => PR.set({ [row.key]: v })}
                  style={{ flex: 1, padding: "9px 6px", borderRadius: 6, fontSize: 14,
                    border: "1px solid " + (prefs[row.key] === v ? "var(--maroon)" : "var(--line)"),
                    background: prefs[row.key] === v ? "var(--maroon)" : "var(--paper)",
                    color: prefs[row.key] === v ? "var(--paper)" : "var(--ink-soft)" }}>{name}</button>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-faint)", textWrap: "pretty" }}>{row.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   When a festival falls. Three kinds now: a tithi in a lunar
   month, a fixed Gregorian date, and — new — a saṅkrānti, the
   instant the sun crosses into a rāśi, which no tithi rule can
   find. The site had Makara pinned to 14 January; it is the
   fifteenth whenever the transit lands after sunset.
   ------------------------------------------------------------ */
function akFestDate(f, year, loc) {
  const P = AK_P();
  if (f.solar != null) {
    try { return P.sankrantiDay(year, f.solar); } catch (e) { return null; }
  }
  if (f.fixed) { const p = f.fixed.split("-").map(Number); return new Date(year, p[0] - 1, p[1]); }
  return P.findTithiDate(year, f.month, f.tithiIndex, loc || (P.locations.find((l) => l.id === "ujjain") || P.locations[0]));
}

Object.assign(window, {
  AkLocationSearch, AkDayWindows, AkSankalpa, AkReckoning, AkNowNext, useAkPrefs,
  akLimbSpan, akFestDate, akSankalpaSegs,
});

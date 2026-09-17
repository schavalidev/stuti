/* ============================================================
   AKSHARA — About · Mission, How to read, Sources & Licensing
   ============================================================ */
function AboutScreen({ go }) {
  const D = window.AKSHARA_DATA;

  const principles = [
    { deva: "मूल", title: "The original, first", body: "Every text is anchored in its Sanskrit. Nothing is paraphrased away — the source is always one tap from the translation." },
    { deva: "स्पष्ट", title: "Made legible", body: "Devanagari, transliteration and English sit side by side, so a verse can be heard, sounded out, and understood at once." },
    { deva: "मुक्त", title: "Freely offered", body: "The canon belongs to everyone. Akshara draws on public-domain editions and is given without paywall or advertisement." },
  ];

  const scripts = [
    { tag: "देव", label: "Devanagari", note: "The received text, in its traditional script." },
    { tag: "ā", label: "Transliteration (IAST)", note: "Roman letters with diacritics — read the sound without the script." },
    { tag: "En", label: "Translation", note: "Plain-sense English, kept close to the original." },
  ];

  return (
    <div className="rise">
      {/* Mission hero */}
      <section style={{ background: "var(--night)", color: "var(--on-night)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: "var(--gold-bright)", opacity: 0.09 }}><Mandala size={620} spin /></div>
        <div className="wrap" style={{ padding: "84px 40px", position: "relative", textAlign: "center" }}>
          <div className="ornament" style={{ justifyContent: "center", maxWidth: 280, margin: "0 auto 28px", color: "var(--gold-bright)" }}><Lotus size={26} color="var(--gold-bright)" /></div>
          <span className="eyebrow" style={{ color: "var(--gold-bright)" }}>Our mission</span>
          <Sa as="p" style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)", color: "var(--gold-bright)", margin: "22px 0 8px" }}>सत्यमेव जयते</Sa>
          <h1 style={{ fontSize: "clamp(2.2rem,4.4vw,3.6rem)", lineHeight: 1.1, maxWidth: 880, margin: "0 auto", color: "var(--on-night)" }}>
            To keep the eternal texts living, legible, and free.
          </h1>
          <p style={{ color: "var(--on-night-soft)", fontSize: 18, lineHeight: 1.7, maxWidth: 640, margin: "26px auto 0" }}>
            Akshara is a digital home for the śruti and smṛti of Sanātana Dharma — the Vedas, Upaniṣads, epics, and the long conversation around them — set in their original Sanskrit beside transliteration and translation, with recitation to be heard.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="wrap" style={{ padding: "70px 40px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 18 }}>
          {principles.map(p => (
            <div key={p.title} style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "30px 28px" }}>
              <Sa as="div" style={{ fontSize: 30, color: "var(--maroon)", lineHeight: 1 }}>{p.deva}</Sa>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, marginTop: 16 }}>{p.title}</h3>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, marginTop: 10 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to read */}
      <section className="wrap" style={{ padding: "74px 40px 0" }}>
        <div className="ornament" style={{ marginBottom: 34 }}><Lotus size={22} color="var(--gold)" /></div>
        <span className="eyebrow">The reading view</span>
        <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", marginTop: 12, maxWidth: 620 }}>Three scripts, one verse</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16, marginTop: 30 }}>
          {scripts.map(s => (
            <div key={s.label} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "22px 24px", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}>
              <span style={{ flex: "none", width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--maroon)", color: "var(--on-night)",
                fontFamily: s.tag === "देव" ? "var(--font-deva)" : "var(--font-display)", fontStyle: s.tag === "ā" ? "normal" : "normal", fontSize: 20 }}>{s.tag}</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600 }}>{s.label}</div>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, margin: "5px 0 0" }}>{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources & licensing */}
      <section className="wrap" style={{ padding: "74px 40px 0" }}>
        <div className="ornament" style={{ marginBottom: 34 }}><Lotus size={22} color="var(--gold)" /></div>
        <span className="eyebrow">Provenance</span>
        <h2 style={{ fontSize: "clamp(1.9rem,3vw,2.6rem)", marginTop: 12 }}>Sources & licensing</h2>
        <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 640, marginTop: 14 }}>
          Source texts are drawn from public-domain critical editions. Translations are editorial and revised over time; each edition is credited at the text level. Recitation, where present, is offered under permissive licence.
        </p>
        <div style={{ marginTop: 30, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 0.9fr", gap: 12, padding: "16px 24px", borderBottom: "1px solid var(--line)", background: "var(--paper-3)",
            fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-soft)", fontWeight: 600 }}>
            <span>Text</span><span>Tradition</span><span>Dated</span><span>Licence</span>
          </div>
          {D.texts.map((t, i) => (
            <div key={t.id} onClick={() => go("detail", { textId: t.id })}
              className="src-row"
              style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 0.9fr", gap: 12, padding: "16px 24px", alignItems: "center",
                borderBottom: i === D.texts.length - 1 ? "none" : "1px solid var(--line-soft)", cursor: "pointer", transition: "background .15s" }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600 }}>{t.title}</span>
                <Sa as="span" style={{ fontSize: 14, color: "var(--ink-faint)" }}>{t.deva}</Sa>
              </span>
              <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{t.tradition}</span>
              <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{t.era}</span>
              <span style={{ fontSize: 12.5, color: "var(--saffron)", fontWeight: 500, letterSpacing: "0.04em" }}>Public domain</span>
            </div>
          ))}
        </div>
        <p style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-faint)", fontStyle: "normal", fontSize: 14, marginTop: 18 }}>
          <Icon name="quote" size={15} /> Found an error in a verse or a citation? Corrections are welcomed and credited.
        </p>
      </section>

      {/* Contributors / contact */}
      <section className="wrap" style={{ padding: "74px 40px 20px" }}>
        <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "40px 40px", display: "flex", gap: 30, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <span className="eyebrow">Contributors</span>
            <h3 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", marginTop: 10 }}>Built by readers, for readers</h3>
            <p style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.7, marginTop: 10, maxWidth: 560 }}>
              Akshara is maintained by a small circle of editors, reciters and engineers who care for the texts. Scholars, students and saṁskṛta readers are invited to help proofread, narrate, and expand the library.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => go("library")}>Enter the library <Icon name="arrowR" size={16} /></button>
            <button className="btn btn-ghost">Get in touch</button>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { AboutScreen });

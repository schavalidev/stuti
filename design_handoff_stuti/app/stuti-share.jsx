/* ============================================================
   STUTI — verse share card + printable stotra
   ShareSheet: a typeset card of the verse on screen, drawn to
   canvas at 2x for download or the native share sheet.
   printStotra(): opens a paged, watermarked sheet for the binder.
   ============================================================ */
const { useState: useStateSh, useEffect: useEffectSh, useRef: useRefSh } = React;

const SH_PAL = {
  day:   { bg: "#F7EFE2", card: "#FFFDF8", ink: "#2B2017", soft: "#6E5E4E", faint: "#9A8A78", gold: "#B07A2B", line: "rgba(43,32,23,0.12)" },
  night: { bg: "#14110C", card: "#1E1810", ink: "#F4EAD7", soft: "#C2B197", faint: "#897962", gold: "#E2B266", line: "rgba(244,234,215,0.15)" },
};

/* wrap a string to a pixel width, honouring existing newlines */
function shWrap(ctx, text, max) {
  const out = [];
  (text || "").split("\n").forEach(para => {
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    words.forEach(w => {
      const t = line ? line + " " + w : w;
      if (ctx.measureText(t).width > max && line) { out.push(line); line = w; }
      else line = t;
    });
    out.push(line);
  });
  return out;
}

function shFontFor(lang) {
  return lang === "telugu" ? "'Noto Sans Telugu', sans-serif" : lang === "deva" ? "'Noto Sans Devanagari', sans-serif" : "'Marcellus', Georgia, serif";
}

/* draw the card; returns the canvas */
function drawVerseCard(o) {
  const S = 2, W = 1080, H = 1080;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const P = SH_PAL[o.theme === "night" ? "night" : "day"];
  g.fillStyle = P.bg; g.fillRect(0, 0, W, H);
  // inner card
  const m = 54, r = 34;
  g.fillStyle = P.card;
  g.beginPath(); g.roundRect(m, m, W - m * 2, H - m * 2, r); g.fill();
  g.strokeStyle = P.line; g.lineWidth = 2; g.stroke();
  // rule + mark at top
  g.fillStyle = P.gold; g.textAlign = "center";
  g.font = "34px 'Noto Sans Devanagari', sans-serif";
  g.fillText("॥ श्री ॥", W / 2, m + 88);
  // title
  g.fillStyle = P.ink;
  g.font = "40px " + shFontFor(o.lang);
  const tl = shWrap(g, o.title, W - m * 2 - 120);
  let y = m + 176;
  tl.slice(0, 2).forEach(l => { g.fillText(l, W / 2, y); y += 52; });
  // verse number
  if (o.num) {
    g.fillStyle = P.faint; g.font = "600 22px 'Mukta', sans-serif";
    g.fillText(String(o.num), W / 2, y + 14);
  }
  // the verse — the hero
  y += 76;
  g.fillStyle = P.ink;
  const vFont = o.lang === "roman" ? "'Mukta', sans-serif" : shFontFor(o.lang);
  let size = 52, lines;
  do {
    g.font = size + "px " + vFont;
    lines = shWrap(g, o.verse, W - m * 2 - 130);
    if (lines.length * size * 1.62 <= 430) break;
    size -= 3;
  } while (size > 26);
  const lh = size * 1.62;
  lines.forEach(l => { g.fillText(l, W / 2, y); y += lh; });
  // meaning
  if (o.meaning) {
    y += 26;
    g.strokeStyle = P.line; g.lineWidth = 2;
    g.beginPath(); g.moveTo(W / 2 - 60, y - 26); g.lineTo(W / 2 + 60, y - 26); g.stroke();
    g.fillStyle = P.soft;
    const mFont = o.lang === "telugu" ? "'Noto Sans Telugu', sans-serif" : "'Mukta', sans-serif";
    g.font = "26px " + mFont;
    const ml = shWrap(g, o.meaning, W - m * 2 - 160).slice(0, 5);
    y += 22;
    ml.forEach(l => { g.fillText(l, W / 2, y); y += 40; });
  }
  // footer mark
  g.fillStyle = P.gold;
  g.font = "26px 'Marcellus', Georgia, serif";
  g.fillText("Stuti", W / 2, H - m - 52);
  g.fillStyle = P.faint;
  g.font = "600 17px 'Mukta', sans-serif";
  g.fillText(o.by || "", W / 2, H - m - 26);
  return c;
}

function ShareSheet({ hymn, verse, num, lang, theme, onClose }) {
  const L = window.STUTI_L;
  const holder = useRefSh(null);
  const canvasRef = useRefSh(null);
  const [busy, setBusy] = useStateSh(false);
  const text = lang === "telugu" ? (verse.tdeva || window.STUTI_TRANSLIT.convert(verse.deva, "telugu")) : lang === "deva" ? verse.deva : verse.iast;
  const meaning = lang === "telugu" ? verse.tel : verse.en;
  useEffectSh(() => {
    const c = drawVerseCard({
      title: L.hymnTitle(hymn, lang), verse: text, meaning, num,
      by: hymn.by ? L.author(hymn.by, lang) : "", lang, theme,
    });
    canvasRef.current = c;
    c.style.width = "100%"; c.style.height = "auto"; c.style.display = "block"; c.style.borderRadius = "18px";
    const h = holder.current;
    if (h) { h.innerHTML = ""; h.appendChild(c); }
  }, [hymn.id, num, lang, theme]);
  const blob = () => new Promise(res => canvasRef.current.toBlob(res, "image/png"));
  const download = async () => {
    const b = await blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = "stuti-" + hymn.id + (num ? "-" + String(num).replace(/[^\w-]/g, "") : "") + ".png";
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  const share = async () => {
    setBusy(true);
    try {
      const b = await blob();
      const file = new File([b], "stuti.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file] });
      else await download();
    } catch (e) { /* dismissed */ }
    setBusy(false);
  };
  return (
    <div className="nm-sheet share-sheet">
      <div className="nm-head">
        <button className="icon-btn" onClick={onClose} aria-label={window.STUTI_L.a("aClose")}><Icon name="back" /></button>
        <div className="nm-title">
          <div className="nm-title-name display">{L.t("shareVerse", lang)}</div>
          <div className="nm-title-sub">{L.t("shareSub", lang)}</div>
        </div>
      </div>
      <div className="nm-list scroll">
        <div className="share-body">
          <div className="share-canvas" ref={holder} />
          <div className="share-actions">
            <button className="vow-do" onClick={share} disabled={busy}><Icon name="share" size={16} /> {L.t("shareIt", lang)}</button>
            <button className="vow-keep" onClick={download}><Icon name="check" size={16} /> {L.t("saveImage", lang)}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Printable stotra for the binder ---------------- */
function printStotra(hymn, lang, withMeaning) {
  const L = window.STUTI_L, TR = window.STUTI_TRANSLIT;
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const scriptFont = lang === "telugu" ? "'Noto Sans Telugu',sans-serif" : lang === "deva" ? "'Noto Sans Devanagari',sans-serif" : "'Marcellus',Georgia,serif";
  const vText = v => lang === "telugu" ? (v.tdeva || TR.convert(v.deva, "telugu")) : lang === "deva" ? v.deva : v.iast;
  const secName = s => !s ? "" : (lang === "telugu" ? (s.tel || s.roman) : s.roman);
  let body = "", lastSec = -1;
  (hymn.verses || []).forEach(v => {
    if (v.s != null && v.s !== lastSec) {
      lastSec = v.s;
      const nm = secName((hymn.sections || [])[v.s]);
      if (nm) body += '<h2 class="sec">' + esc(nm) + "</h2>";
    }
    const mean = withMeaning ? window.STUTI_MEAN(v, lang) : "";
    body += '<div class="v"><div class="vt">' + esc(vText(v)).replace(/\n/g, "<br>") + "</div>"
      + (v.n ? '<div class="vn">' + esc(v.n) + "</div>" : "")
      + (mean ? '<div class="vm">' + esc(mean) + "</div>" : "") + "</div>";
  });
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + esc(L.hymnTitle(hymn, lang)) + ' — Stuti</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Mukta:wght@400;600&family=Noto+Sans+Devanagari&family=Noto+Sans+Telugu&display=swap" rel="stylesheet">'
    + "<style>"
    + "@page{size:letter;margin:18mm 16mm}"
    + "*{box-sizing:border-box;font-style:normal}"
    + "body{margin:0;background:#fff;color:#2B2017;font-family:'Mukta',sans-serif;position:relative}"
    + ".wm{position:fixed;inset:0;display:grid;place-items:center;pointer-events:none;z-index:0}"
    + ".wm span{font-family:'Noto Sans Devanagari',sans-serif;font-size:34vh;color:rgba(176,122,43,0.055);transform:rotate(-24deg);line-height:1}"
    + ".pg{position:relative;z-index:1}"
    + "header{text-align:center;border-bottom:1px solid rgba(43,32,23,.18);padding-bottom:14px;margin-bottom:26px}"
    + ".shri{color:#B07A2B;font-family:'Noto Sans Devanagari',sans-serif;font-size:13pt}"
    + "h1{font-family:" + scriptFont + ";font-weight:400;font-size:22pt;line-height:1.2;margin:8px 0 4px}"
    + ".by{font-size:10pt;color:#6E5E4E;letter-spacing:.04em}"
    + "h2.sec{font-family:" + scriptFont + ";font-weight:400;font-size:14pt;color:#8A5A18;text-align:center;margin:26px 0 14px;page-break-after:avoid}"
    + ".v{margin:0 0 16px;page-break-inside:avoid;text-align:center}"
    + ".vt{font-family:" + scriptFont + ";font-size:14pt;line-height:1.85}"
    + ".vn{font-size:8.5pt;color:#9A8A78;margin-top:3px;letter-spacing:.08em}"
    + ".vm{font-family:" + (lang === "telugu" ? "'Noto Sans Telugu',sans-serif" : "'Mukta',sans-serif") + ";font-size:10pt;color:#6E5E4E;line-height:1.55;margin:7px auto 0;max-width:82%}"
    + "footer{margin-top:30px;border-top:1px solid rgba(43,32,23,.14);padding-top:10px;text-align:center;font-size:9pt;color:#9A8A78}"
    + "footer b{font-family:'Marcellus',Georgia,serif;font-weight:400;color:#B07A2B;font-size:11pt}"
    + "</style></head><body>"
    + '<div class="wm"><span>ॐ</span></div><div class="pg">'
    + '<header><div class="shri">॥ श्री ॥</div><h1>' + esc(L.hymnTitle(hymn, lang)) + "</h1>"
    + '<div class="by">' + esc(hymn.by ? L.author(hymn.by, lang) : "") + "</div></header>"
    + body
    + "<footer><b>Stuti</b> · " + esc(L.hymnTitle(hymn, "roman")) + "</footer></div></body></html>");
  w.document.close();
  setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 700);
}

Object.assign(window, { ShareSheet, printStotra, drawVerseCard });

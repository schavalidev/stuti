export const meta = {
  name: 'valmiki-sarga-batch',
  description: 'Read Gita Press page crops blind, then adjudicate and write each sarga file of the Valmiki Ramayana',
  phases: [{ title: 'Read', detail: 'blind transcription of numbered line sheets' }, { title: 'Settle', detail: 'merge, adjudicate disputes, write file' }],
}
const BIN = '/Users/bhavanisrikrishna/Documents/Stuti/stotras/bin'
const VR = BIN + '/valmiki_ramayana'
const WORK = BIN + '/cache/gitapress_ramayana/work'
const PY = BIN + '/.venv/bin/python'

const READ_SCHEMA = { type: 'object', properties: { lines_read: { type: 'integer' }, unclear: { type: 'integer' }, wrote: { type: 'string' } }, required: ['lines_read', 'unclear', 'wrote'] }
const SETTLE_SCHEMA = { type: 'object', properties: { wrote: { type: 'string' }, verses: { type: 'integer' }, disputes_settled: { type: 'integer' }, structural_changes: { type: 'string' }, doubts_left: { type: 'string' } }, required: ['wrote', 'verses', 'disputes_settled', 'structural_changes', 'doubts_left'] }

function readPrompt(k, sid) {
  return `You are reading printed Sanskrit off page images of the Gita Press, Gorakhpur edition of the Valmiki Ramayana. The bold Devanagari lines are the Sanskrit verse; the lighter lines are the Hindi translation.

Open ${WORK}/${k}/${sid}.toread.json with the Read tool. It lists images:
- "sheets": each sheet is one image of up to eight line crops stacked one above another, numbered 1 to 8 in red in a grey margin, with a red rule between them. "ids" gives the id of each numbered crop, in order: number 1 is ids[0], number 2 is ids[1], and so on.
- "lines": single images, each for one id. If an entry has a "note", the image is a wider span or a whole page, and the line wanted is the one printed between "line_before" and "line_after" (machine guesses, given only to find the place; they may be wrong).
- "heading_image" and "colophon_image" (either may be null).

In each numbered crop, transcribe the bold Sanskrit line in the middle of that crop. A line cut off at the top or bottom edge of a crop belongs to a neighbouring entry; ignore it.

Transcription rules:
- Unicode Devanagari, exactly as printed. Do not correct anything and do not supply a word from memory or from what you expect the verse to say. You may know this poem; set that knowledge aside. You are the independent reader: report the page, not the text you know.
- Keep every mark as printed: virama, anusvara (never turn it into a nasal consonant or back), visarga, avagraha (ऽ), a hyphen where a word is broken at the end of the line, and the spaces between words as printed.
- Keep the end of the line as printed: a single danda (।), or the double danda with the verse number, e.g. "॥ ४ ॥". Digits in Devanagari.
- If you are not certain of an akshara, write your best guess inside ⟦ ⟧ with a question mark, e.g. ⟦श्र?⟧, and set "unclear": true. Never guess silently.
- If a crop holds no Sanskrit verse line (only Hindi, a heading, blank), write "" and set "unclear": true.

Heading image: transcribe the printed sarga heading (the "... सर्गः" line) and the Hindi subtitle under it, as one string, lines separated by " / ". Colophon image: transcribe the Sanskrit colophon line ("इत्यार्षे ...") exactly as printed, including its number; not the Hindi line below it.

Write the result with the Write tool to ${WORK}/${k}/${sid}.read.json as JSON:
{"lines": {"<id>": {"text": "...", "unclear": false}, ...}, "heading": "...", "colophon": "..."}
Every id in the sheets and in "lines" must appear. Then reply with the counts.`
}

function settlePrompt(k, sid) {
  return `You are settling the Gita Press text of one sarga of the Valmiki Ramayana (${k}, sarga file ${sid}) for the Stuti corpus.

1. Run: cd ${VR} && ${PY} merge.py ${k} ${sid}
   It folds an independent blind reading of the page images into the machine's text. Then read ${WORK}/${k}/${sid}.brief.json (not the larger merged.json unless you need it). In the brief:
   - "verses": the machine's grouping, [number, [[id, text, basis, number_read_on_page], ...]] per verse;
   - "disputes": the half-lines the machine could not settle, each with "crop" (image of the printed line; open it with Read), "reading" (the blind reader's transcription), "cands" (each scan's OCR reading with how many scans gave it), "gp" (machine vote), "iitk" (IITK digital text; "iitk_crit" in the Uttarakanda is the critical edition in Devanagari), "southern" (valmikiramayan.net, word by word, sandhi undone), "critical" (Baroda critical edition, IAST), "loc" (page leaf and box);
   - "structural": numbering problems; "ebook_last": the last verse number in Gita Press's own ebook of the Hindi translation (clean text; normally the print's N);
   - "prev_tail" / "next_head": the last lines of the previous sarga and the first lines of the next, with crops;
   - "crops_by_id" and "locs_by_id": a crop and page location for every half-line that has one.

2. For each dispute, open the crop and decide what the page prints. The page is the authority. Print what the page prints even where the digital witnesses read otherwise; use them only to help you see the page, and never take a word from them that the page does not show. OCR errors are common and often shared by several scans (ज्ञ read as श, ै as े, a lost reph or anusvara), so a majority of scans is not proof; the image is. The blind reader can also be wrong, and may unconsciously give a familiar wording; check the image. A "spot-check-mismatch" dispute is a line the machine accepted that the blind reader read differently: look at the crop and decide. Keep the print's spelling (anusvara where it prints anusvara) and its spacing. If a crop shows only part of a line (long-metre verses are often printed in quarter-lines), open the whole page image and read the rest there before falling back on the scans; basis is "scans" only for what you could not see. If after looking hard you still cannot be sure of an akshara, take the reading most scans give and say so in "notes". Record each settled line in final.json "lines" as {"text": "...", "basis": "page"} ("scans" if you had to fall back on them).

3. Structure. The verse numbers must run 1, 2, 3 ... N exactly as the print numbers them; the closing half-line of each printed verse ends "॥ N ॥" on the page, so read the crops of closing lines to see the print's numbers. The print's line order is the authority: the packet's order follows a digital text and is occasionally wrong. If the grouping or order is wrong, give the full corrected grouping as final.json "verses": [{"num": 1, "lines": ["<id>", "<id>"]}, ...] covering every verse. A line that is not verse text (a footnote quotation, a heading, Hindi) goes in "drop". A half-line the print has but the packet lacks may be added as {"new": "text"} inside a verse's "lines", only if you read it on a page image (page image: ${PY} ${VR}/crops.py page <vol> <leaf>, vol 1 for Bala to Kishkindha, 2 for Yuddha and Uttara; neighbouring lines' locs give the leaf). If N differs from ebook_last and the pages confirm the print's own numbering, keep the print's and explain in "count_explained" in one plain sentence.

   Sarga boundary: the machine's cut between sargas can be wrong by a verse or two either way. This sarga is everything printed after its own heading ("... सर्गः" with the Hindi subtitle) and before its own colophon ("इत्यार्षे ... सर्गः ॥ N ॥"). If its first verses sit in "prev_tail" instead of here, add them here as {"new": ...} after reading them on the page; if its packet ends with lines printed after the colophon (the next sarga's opening, which "next_head" will show), put them in "drop". Check both edges on the page every time.

4. Title. "hindi_title": the Hindi subtitle as printed (from "heading_read" or "heading_ocr"). If neither is given, open the page image of the sarga's first verse (crops.py page <vol> <leaf>, leaf from locs_by_id) and read the heading there. Never write a heading, title or colophon from memory; if you truly cannot find it on the page, leave hindi_title empty and say so in notes. "title_en": a short English title saying what happens in the sarga, translated from that subtitle; plain, simple, formal and respectful (the reader is often an elder), no italics, IAST diacritics for names (Rāma, Sītā, Viśvāmitra). "slug": 3 to 6 lowercase ASCII words from title_en joined by underscores, diacritics removed.

5. "colophon": the Sanskrit colophon as printed, WITHOUT its number, from "colophon_read" or "colophon_ocr"; its standard form is "इत्यार्षे श्रीमद्रामायणे वाल्मीकीये आदिकाव्ये <kanda> <ordinal> सर्गः". Correct OCR damage in it against the page.

6. "notes": plain English sentences for the file's Recension note, only for what a later editor must know (a reading you could not settle, a verse the print numbers oddly, a line dropped or added and why). Short and simple, no literary phrasing. Empty if nothing.

Write ${WORK}/${k}/${sid}.final.json, then run: cd ${VR} && ${PY} write_sarga.py ${k} ${sid}
If it prints REFUSED, fix final.json and run it again until it prints WROTE. Do not edit any other file. Reply with the summary.`
}

const k = args.kanda
const readNeeded = new Set(args.read || args.sids)
const results = await pipeline(
  args.sids,
  sid => readNeeded.has(sid)
    ? agent(readPrompt(k, sid), { label: `read ${k} ${sid}`, phase: 'Read', schema: READ_SCHEMA })
    : Promise.resolve({ lines_read: -1, unclear: 0, wrote: 'already read' }),
  (r, sid) => agent(settlePrompt(k, sid), { label: `settle ${k} ${sid}`, phase: 'Settle', schema: SETTLE_SCHEMA })
    .then(s => ({ sid, ok: !!(s && /WROTE|\.txt/.test(s.wrote)), verses: s ? s.verses : null, unclear: r ? r.unclear : null,
                  doubts: s && s.doubts_left && !/^none/i.test(s.doubts_left.trim()) ? s.doubts_left.slice(0, 300) : '' }))
)
const bad = results.filter(x => !x || !x.ok)
log(`${k}: ${results.length - bad.length}/${results.length} sargas written`)
return { kanda: k, written: results.filter(x => x && x.ok).map(x => `${x.sid}:${x.verses}`).join(' '),
         failed: args.sids.filter((s, i) => !results[i] || !results[i].ok),
         doubts: results.filter(x => x && x.doubts).map(x => `${x.sid}: ${x.doubts}`) }

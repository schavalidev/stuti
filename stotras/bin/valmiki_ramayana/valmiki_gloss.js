export const meta = {
  name: 'valmiki-sarga-gloss',
  description: 'Add faithful English, Telugu and Hindi meanings to each sarga of the Valmiki Ramayana',
  phases: [{ title: 'Gloss', detail: 'translate every verse into en/tel/hi, house register' }],
}
const BIN = '/Users/bhavanisrikrishna/Documents/Stuti/stotras/bin'
const VR = BIN + '/valmiki_ramayana'
const WORK = BIN + '/cache/gitapress_ramayana/work'
const PY = BIN + '/.venv/bin/python'
const RAMA = '/Users/bhavanisrikrishna/Documents/Stuti/stotras/rama'

const SCHEMA = { type: 'object', properties: { glossed: { type: 'integer' }, wrote: { type: 'string' }, note: { type: 'string' } }, required: ['glossed', 'wrote'] }

function glossPrompt(k, sid) {
  const folder = `${RAMA}/valmiki_${k}kanda`
  return `Add English, Telugu and Hindi meanings to one sarga of the Vālmīki Rāmāyaṇa for the Stuti corpus.

The file is the one matching ${folder}/${sid}_*.txt (there is exactly one; run: ls ${folder}/${sid}_*.txt). Open it with the Read tool. It holds verse units:
--- verse 1 ---
deva:
<Devanāgarī>
iast:
<IAST>

and ends with a --- verse none --- colophon unit. Some units may already carry en:/tel:/hi: lines; leave those as they are and do not re-gloss them.

Translate the Sanskrit of each unit faithfully into three languages. Rules, all hard:
- Faithful to the śloka: render what the verse says, no loose paraphrase, no added explanation, no reconstruction of a meaning you are unsure of. If a word is genuinely obscure, give its plain sense. The three languages all say the same thing.
- Register: simple, direct, formal, respectful prose for an elder who is not a scholar. Short sentences, plain words. No literary or essayistic flourish, no dashes holding a second thought, no clever turns of phrase, no preaching. Deities, sages and elders are always spoken of with respect.
- No italics. In English, names keep IAST diacritics (Rāma, Sītā, Daśaratha, Viśvāmitra, Ayodhyā).
- Telugu must read as natural Telugu to a Telugu speaker, not English word order in Telugu script. Hindi likewise, in Devanāgarī. English one or two plain sentences.
- The colophon unit (verse none) gets a plain rendering in each language, e.g. "Thus ends the <Nth> sarga of the <Kāṇḍa> of the holy Rāmāyaṇa of Vālmīki."

Write a JSON file with the Write tool to ${WORK}/${k}/${sid}.gloss.json of the shape:
{"1": {"en": "...", "tel": "...", "hi": "..."}, "2": {...}, ..., "none": {...}}
with one entry for every unit that does NOT already carry en: (the key is the verse number as a string, or "none" for the colophon). Every such unit must have an entry.

Then run: cd ${VR} && ${PY} gloss_merge.py ${k} ${sid}
It inserts your meanings into the file and refuses if any unit is missing or if any deva/iast line would change. If it prints REFUSED, fix ${sid}.gloss.json and run it again until it prints GLOSSED. Do not edit the .txt file by hand and touch no other file. Reply with the count and the GLOSSED/REFUSED line.`
}

const k = args.kanda
const results = await pipeline(
  args.sids,
  sid => agent(glossPrompt(k, sid), { label: `gloss ${k} ${sid}`, phase: 'Gloss', schema: SCHEMA })
    .then(s => ({ sid, ok: !!(s && (/GLOSSED/.test(s.wrote || '') || /GLOSSED/.test(s.note || '') || (s.glossed > 0))), glossed: s ? s.glossed : null, note: s && s.note ? s.note.slice(0, 200) : '' }))
)
const bad = results.filter(x => !x || !x.ok)
log(`${k}: ${results.length - bad.length}/${results.length} sargas glossed`)
return { kanda: k, glossed: results.filter(x => x && x.ok).map(x => `${x.sid}:${x.glossed}`).join(' '),
         failed: args.sids.filter((s, i) => !results[i] || !results[i].ok),
         notes: results.filter(x => x && x.note).map(x => `${x.sid}: ${x.note}`) }

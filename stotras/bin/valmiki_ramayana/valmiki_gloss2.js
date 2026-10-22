export const meta = {
  name: 'valmiki-gloss-audited',
  description: 'Gloss each Valmiki sarga (en/tel/hi), then audit it with a second independent agent',
  phases: [
    { title: 'Gloss', detail: 'translate every verse into en/tel/hi, house register' },
    { title: 'Audit', detail: 'an independent agent re-translates and corrects' },
  ],
}
const BIN = '/Users/bhavanisrikrishna/Documents/Stuti/stotras/bin'
const VR = BIN + '/valmiki_ramayana'
const WORK = BIN + '/cache/gitapress_ramayana/work'
const PY = BIN + '/.venv/bin/python'
const RAMA = '/Users/bhavanisrikrishna/Documents/Stuti/stotras/rama'

const GLOSS_SCHEMA = { type: 'object', properties: { glossed: { type: 'integer' }, wrote: { type: 'string' }, note: { type: 'string' } }, required: ['glossed', 'wrote'] }
const AUDIT_SCHEMA = { type: 'object', properties: { checked: { type: 'integer' }, corrected: { type: 'integer' }, wrote: { type: 'string' }, note: { type: 'string' } }, required: ['checked', 'corrected', 'wrote'] }

function glossPrompt(k, sid) {
  const folder = `${RAMA}/valmiki_${k}kanda`
  return `Add English, Telugu and Hindi meanings to one sarga of the Vālmīki Rāmāyaṇa for the Stuti corpus.

The file is the one matching ${folder}/${sid}_*.txt (run: ls ${folder}/${sid}_*.txt). Open it with the Read tool. It holds verse units:
--- verse 1 ---
deva:
<Devanāgarī>
iast:
<IAST>

and ends with a --- verse none --- colophon unit. Some units may already carry en:/tel:/hi: lines; leave those untouched.

Translate the Sanskrit of each unit faithfully into three languages. Rules, all hard:
- Faithful to the śloka: render what the verse says, no loose paraphrase, no added explanation, no reconstruction of a meaning you are unsure of. If a word is obscure, give its plain sense. The three languages all say the same thing.
- Register: simple, direct, formal, respectful prose for an elder who is not a scholar. Short sentences, plain words. No literary or essayistic flourish, no dashes holding a second thought, no clever turns, no preaching. Deities, sages and elders are always spoken of with respect.
- No italics. In English, names keep IAST diacritics (Rāma, Sītā, Daśaratha, Viśvāmitra, Ayodhyā).
- Telugu must read as natural Telugu, not English word order in Telugu script. Hindi likewise, in Devanāgarī. English one or two plain sentences.
- The colophon unit (verse none) gets a plain rendering, e.g. "Thus ends the <Nth> sarga of the <Kāṇḍa> of the holy Rāmāyaṇa of Vālmīki."

Write JSON to ${WORK}/${k}/${sid}.gloss.json: {"1": {"en","tel","hi"}, ..., "none": {...}} with one entry for every unit that does NOT already carry en:. Then run: cd ${VR} && ${PY} gloss_merge.py ${k} ${sid}
If it prints REFUSED, fix the JSON and rerun until GLOSSED. Do not edit the .txt by hand; touch no other file. Reply with the count and the GLOSSED line.`
}

function auditPrompt(k, sid) {
  const folder = `${RAMA}/valmiki_${k}kanda`
  return `You are the independent auditor of the English, Telugu and Hindi meanings in one already-glossed sarga of the Vālmīki Rāmāyaṇa. A different agent wrote these meanings; your job is to catch where they are wrong, not to confirm them.

The file matches ${folder}/${sid}_*.txt (run: ls ${folder}/${sid}_*.txt). Open it. Each verse unit has deva:, iast:, then en:, tel:, hi:.

Method — this matters: for each unit, FIRST translate the Sanskrit yourself from the deva/iast, before you read the en: line. Form your own sense of the verse. THEN read the existing en/tel/hi and compare with what you arrived at. Do not let the existing wording lead you; a gloss that "sounds right" can still misread the verse. Where the grammar is genuinely hard, you may consult the witnesses (GRETIL Baroda critical edition via ${PY} ${BIN}/gretil.py, or the IITK text) to settle the sense — but the meaning must match THIS print's Sanskrit as it stands in the file.

Flag a unit's field when, and only when, it is actually wrong:
- it misreads the Sanskrit — wrong subject or object, a word dropped or invented, a negation lost, the wrong deity or person named;
- it breaks register — literary or essayistic phrasing, a dash holding a second thought, something casual, clever or preaching, or disrespect to a deity, sage or elder;
- it uses italics, or an English name without its IAST diacritics;
- the Telugu or Hindi is unnatural — English word order in the other script, or a word merely transliterated where the language has its own word; or the Telugu/Hindi says something different from the English.
Do NOT rewrite a sound gloss merely to word it your way. Leave a faithful, plain, natural gloss exactly as it is. Only genuine errors are corrected, so most units will have no entry.

Write ${WORK}/${k}/${sid}.audit.json as JSON: {"<verse token>": {"en"?: "<corrected>", "tel"?: "<corrected>", "hi"?: "<corrected>"}, ...} listing ONLY the fields that must change, for ONLY the units that need a fix. If every meaning is sound, write {} (an empty object). A corrected field must obey every rule above. Then run: cd ${VR} && ${PY} gloss_fix.py ${k} ${sid}
It replaces only those meaning lines and refuses if any verse text would change. If it prints REFUSED, fix the JSON and rerun until it prints FIXED or "OK no corrections". Do not edit the .txt by hand; touch no other file. Reply with how many units you checked and how many you corrected.`
}

const k = args.kanda
const toGloss = new Set(args.toGloss || args.sids)   // which sids still need stage-1 glossing
const results = await pipeline(
  args.sids,
  sid => toGloss.has(sid)
    ? agent(glossPrompt(k, sid), { label: `gloss ${k} ${sid}`, phase: 'Gloss', schema: GLOSS_SCHEMA })
    : Promise.resolve({ glossed: -1, wrote: 'already glossed' }),
  (g, sid) => agent(auditPrompt(k, sid), { label: `audit ${k} ${sid}`, phase: 'Audit', schema: AUDIT_SCHEMA })
    .then(a => ({ sid, ok: !!(a && /FIXED|no corrections/.test(a.wrote || '')), checked: a ? a.checked : null,
                  corrected: a ? a.corrected : null, note: a && a.note ? a.note.slice(0, 200) : '' }))
)
const bad = results.filter(x => !x || !x.ok)
log(`${k}: ${results.length - bad.length}/${results.length} sargas glossed+audited; ${results.reduce((s, x) => s + (x && x.corrected > 0 ? x.corrected : 0), 0)} units corrected`)
return { kanda: k, audited: results.filter(x => x && x.ok).map(x => `${x.sid}:${x.corrected}`).join(' '),
         failed: args.sids.filter((s, i) => !results[i] || !results[i].ok),
         notes: results.filter(x => x && x.note).map(x => `${x.sid}: ${x.note}`) }

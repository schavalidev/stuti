# Nomulu data file — spec

Produce a single JavaScript file named `stuti-nomu-data.js`. It must be plain
browser JS (no imports, no exports, no TypeScript). It assigns one global and
nothing else:

```js
window.STUTI_NOMU = (function () {
  const list = [ /* nomu objects, in the order they should appear */ ];
  const byId = {};
  list.forEach((n) => { byId[n.id] = n; });
  return { list, byId, get: (id) => byId[id] || null };
})();
```

Do not change that wrapper. Only the contents of `list` grow.

---

## The trilingual object

Every piece of human-readable text is an object with three keys — never a bare
string:

```js
{ roman: "…", deva: "…", tel: "…" }
```

- `roman` — English prose, with IAST diacritics for Sanskrit/Telugu terms
  (Āśvina, Kṛṣṇa, muttaiduva, vāyanam, tāmbūlam, udyāpana, tōram).
- `deva` — Devanagari. Terse, sūtra-like. Not a word-for-word translation of the
  English; say the same thing the way a Devanagari text would say it.
- `tel` — Telugu script. Natural spoken Telugu of a household, not a translation
  register. This is the language most users will read, so it carries the most
  weight — write it first if that helps.

All three keys required on every text object. No empty strings, no `null`.

---

## One nomu object

```js
{
  id: "atla-tadde",
  deity: "devi",
  name:    { roman: "Aṭla Tadde", deva: "अट्ल तद्दॆ", tel: "అట్లతద్ది" },
  when:    { roman: "Āśvina · Kṛṣṇa Tadiya", deva: "…", tel: "…" },
  years:   { roman: "Kept yearly", deva: "…", tel: "…" },
  who:     { roman: "Unmarried girls and married women alike", deva: "…", tel: "…" },
  tagline: { roman: "Eleven aṭlu, gorinṭāku on the hands, and the moon watched for before eating.", deva: "…", tel: "…" },
  gist: [ {roman,deva,tel}, … ],
  vidhi: [ { step: {roman,deva,tel}, detail: {roman,deva,tel} }, … ],
  vayanam: [ { item: {roman,deva,tel}, note: {roman,deva,tel} }, … ],
  katha:    {roman,deva,tel},
  udyapana: {roman,deva,tel},
  caution:  {roman,deva,tel},
  stotras: [ { deity: "devi", m: "lalitā sahasranāma" }, … ],
}
```

### Required on every nomu

| field | type | notes |
|---|---|---|
| `id` | string | lowercase, hyphenated, ASCII only, no diacritics. `kartika-somavara`, not `kārtika-somavāra`. Must be unique. This is a permanent key — it is written into cross-reference maps elsewhere in the app, so don't rename ids later. |
| `deity` | string | must be exactly one of: `ganesha`, `shiva`, `devi`, `vishnu`, `subrahmanya`, `surya`, `guru`, `hanuman`. Nothing else — an unknown value breaks the row's seal and colour. Lakṣmī, Gaurī, Durgā, Tulasi → `devi`. Kedāreśvara, Ardhanārīśvara → `shiva`. Satyanārāyaṇa, Veṅkaṭeśvara, Tulasi-kalyāṇa (as a wedding to the Lord) → `vishnu`. Nāga vows → `subrahmanya`. |
| `name` | text obj | The nomu's name as an elder says it. Telugu spelling as actually written (అట్లతద్ది), not a transliteration of the IAST. |
| `when` | text obj | Month and tithi, or an honest "any auspicious day — often a Śrāvaṇa Tuesday". Format: `Māsa · Pakṣa Tithi`, e.g. `Kārtika · Śukla Dvādaśī`. Add the popular name after an em dash if it has one: `— Kṣīrābdi Dvādaśi`. Never compute or hard-code a calendar date; the app computes dates itself. |
| `years` | text obj | How long the vow runs. `Kept yearly` / `Five years, then udyāpana` / `The month's Mondays, kept year on year`. Short — it renders in a narrow column. |
| `who` | text obj | Who keeps it. `Women of the house`, `Mothers above all`, `Women; men keep it in some families`. |
| `tagline` | text obj | One sentence, concrete and sensory, that would let someone recognise the vow from across a courtyard. This is the line under the title — the hardest field to write and the most visible. No abstractions ("a vow of devotion"), no adjectives doing the work. |

### Optional — include when the vow actually has it

| field | type | notes |
|---|---|---|
| `gist` | array of text objs | 1–3 paragraphs. Why the vow exists, what it asks for, what makes it distinct from the vow next to it. Each entry is one paragraph. |
| `vidhi` | array of `{step, detail}` | The order of the day, 3–5 steps. `step` is a short label (`Before dawn`, `Gaurī pūjā`, `Moonrise`); `detail` is one sentence of what is done. Renders as a numbered list. |
| `vayanam` | array of `{item, note}` | What is given away, and to whom. `item` is the thing; `note` is the qualification (quantity, cloth, who receives it). |
| `katha` | text obj | The story told aloud during the vow, in 2–4 sentences, ending with what the story is *for* — which household question it settles. |
| `udyapana` | text obj | Only for counted vows. What closes the vow in the final year. |
| `caution` | text obj | Only where a real one exists — live anthills, fasting risk, fire. Renders in a warning style, so don't use it for ordinary "families differ" hedging. |
| `stotras` | array | Currently not rendered (the detail page links to the deity's whole hymn list instead). Include it if it's easy — `{ deity: "<one of the eight ids>", m: "<hymn name, lowercase>" }` — but it is not worth research effort. |

Omit an optional field entirely rather than giving it an empty array or a
placeholder. A nomu with no udyāpana simply has no `udyapana` key.

---

## Voice

Match the existing file exactly. The register is a well-read elder explaining to
someone who did not grow up with it — plain, specific, unsentimental. Rules:

- Name the concrete thing. "Eleven aṭlu, and no house rounds it down" beats
  "traditional offerings are made with devotion."
- No devotional register in English. Don't write "the divine mother blesses her
  devotees." Say what is done and what is asked for.
- No hedging padding — no "it is believed that", "according to tradition".
  Say it, and where families genuinely differ, say *how* they differ.
- Where the app cannot know something, say so plainly: "Families differ — in the
  count of years, in what goes in the vāyanam — and their own elders outrank
  this app."
- Never use italics or `<i>` — house rule, applies to IAST and everything else.
- Em dashes are fine and used liberally. No emoji. No exclamation marks.

---

## Coverage

These eight are already written — do not redo them:

`atla-tadde`, `undralla-tadde`, `uppu-nomu`, `kartika-somavara`,
`sravana-sukravara`, `kedareshwara`, `tulasi-nomu`, `nagula-chaviti`

Varalakṣmī Vratam and Maṅgaḷa Gaurī are deliberately **excluded** — they are
computed vratas and live in the Vrata lens. Anything the pañcāṅga can date as a
single named festival day belongs there, not here. A nomu is a household vow
with a count of years, a vāyanam, and a story.

Good candidates to add: Śrāvaṇa Maṅgaḷavāra nomu, Gōvardhana nomu, Cirunāmalu
nomu, Ravi/Ādivāra nomu, Bathukamma-adjacent house vows, Pūla nomu, Cheṭṭu nomu,
Śiva-rātri jāgaraṇa nomu, Gauri nomu, Sompu nomu, Nūlu nomu, Karṭe nomu,
Sāvitri nomu, Bhīma-ēkādaśi nomu.

Deliver as many as are genuinely attested, ordered roughly by how widely they
are kept. If a vow is regionally narrow, keep it and say so in `gist`.

---

## Handing it back

Return the whole file, top to bottom, including the header comment block and the
existing eight entries in their current form. I'll drop it in as-is.

Two things I do after: each new `id` gets added to the `NOMU_MASA` cross-
reference map in `stuti-masa-data.js` so the vow shows up in its month's guide,
and the deity seal picks up its colour automatically from the `deity` field.
So the `id` and `deity` values are the two fields that must be exactly right —
prose can be edited later, keys cannot.

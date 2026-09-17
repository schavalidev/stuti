# Sūktam content spec — paste this into ChatGPT

Produce **one JavaScript file per batch of sūktams**, in exactly this shape. No prose around it, no markdown fences in the file, no `export`, no JSON — a plain script that pushes onto a global array.

```js
/* ============================================================
   STUTI — <deity> full texts, part <n>
   <Title 1> · <Title 2>
   Devanāgarī is the source of truth; other scripts are derived at
   read time. Each verse ships with all four glosses: en · tel · hi.
   ============================================================ */
(window.STUTI_TEXTS_EXTRA = window.STUTI_TEXTS_EXTRA || []).push(

{
  deities: ["vishnu"],
  title: "Puruṣa Sūktam",
  blurb: "One or two sentences. Where the hymn comes from, and when a household actually says it. Plain, concrete, no marketing.",
  sections: [
    { tel: "సూక్తం", roman: "The Sūktam", hi: "सूक्तम्" },
    { tel: "ఫలశ్రుతి", roman: "The Fruit of Recitation", hi: "फलश्रुति" },
  ],
  verses: [
    { s: 0, n: "1",
      deva: "…line one ।\n…line two ॥",
      iast: "…line one ।\n…line two ॥",
      en: "…",
      tel: "…",
      hi: "…" },
  ],
}

);
```

## Field rules

- `deities` — array of ids from: `vishnu, shiva, devi, ganesha, hanuman, subrahmanya, surya, guru`. Use the parent deity, not the form (Śrī Sūktam → `["devi"]`).
- `title` — IAST with diacritics: `Nārāyaṇa Sūktam`, `Śrī Sūktam`.
- `blurb` — 1–2 sentences, human, specific. Never "this powerful hymn".
- `sections` — one entry per structural block, in order, each with `tel` / `roman` / `hi`. `roman` is an **English label**, not transliteration ("The Sūktam", "The Fruit of Recitation", "Dhyānam" only where the word is the name). Typical sūktam: the sūktam itself, then phalaśruti. Anuvāka-divided texts (Nārāyaṇa, Puruṣa) get one section per anuvāka: `{ tel: "మొదటి అనువాకం", roman: "First Anuvāka", hi: "प्रथम अनुवाक" }`.
- `verses[].s` — 0-based index into `sections`.
- `verses[].n` — verse/ṛc number as a **string** (`"1"`, `"12"`, ranges `"1–3"`). Use `null` for an unnumbered opening/closing (śānti pāṭha, dhyāna).
- `verses[].deva` — Devanāgarī, **source of truth**. Break metrical lines with `\n`. Half-verse ends with ` ।`, full verse with ` ॥` (space before the daṇḍa). Do **not** carry svara marks (udātta/anudātta) — the corpus can't render them and a half-marked text is worse than none. No verse numbers inside the text.
- `verses[].iast` — strict IAST of the same lines, same `\n` breaks, same daṇḍas. Hyphenate compounds for readability (`hiraṇya-varṇāṁ suvarṇa-rajata-srajām`). Use `ṁ ḥ ā ī ū ṛ ṝ ḷ ś ṣ ṭ ḍ ṇ ñ ṅ`, and `'` for avagraha.
- `verses[].en` — meaning, not word-gloss. One flowing sentence or two. No verse-number prefix, no "O Lord!" exclamations that aren't in the text.
- `verses[].tel` — తెలుగు అర్థం, in Telugu script. Literary-but-readable register (…ఆహ్వానించుచున్నాను). Not a transliteration of the Sanskrit; a translation.
- `verses[].hi` — हिन्दी अर्थ, Devanāgarī. Same rule.
- All four glosses are **required on every verse**. No fallback to English, no empty strings.
- Ritual blocks (karanyāsa, aṅganyāsa, digbandhana) may be included as their own section — the app flags them automatically from the heading word "nyāsa".

## Separators and punctuation

Use `·` (middle dot) between listed items, `—` (em dash) for asides. Never use italics anywhere — no markdown `*`, no styling instructions.

## What not to do

- No `id`, `type`, `by`, `verses: 16` count fields — those live in the index, not the text file.
- No transliteration of Telugu from Devanāgarī by hand; the app derives Telugu recitation text itself. `tel` is the **meaning** field only.
- No commentary, no "significance" paragraphs, no benefits lists.
- No trailing commas issues: valid JS, one `push(` per file with objects comma-separated.

## Delivery

One file per batch of 1–3 texts, named `stuti-text-<deity><n>.js`. Output the file contents only.

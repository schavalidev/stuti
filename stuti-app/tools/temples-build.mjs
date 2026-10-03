#!/usr/bin/env node
/* ============================================================
   Builds public/stuti-temples.js — the index that lets the app
   recognise a temple the reciter has not pinned.

   Source: OpenStreetMap, via the Overpass API. To refetch:

     curl -A "Stuti (temple index build)" \
       --data-urlencode 'data=[out:json][timeout:1800];
         nwr["amenity"="place_of_worship"]["religion"="hindu"];
         out center tags;' \
       https://overpass-api.de/api/interpreter -o temples-raw.json

     node tools/temples-build.mjs temples-raw.json

   LICENCE: OpenStreetMap data is ODbL. The app must credit
   "© OpenStreetMap contributors" where this index is used, and the
   derived index inherits the share-alike terms. The credit is in the
   file's own header and is shown in the app beside a name that came
   from here (see stuti-temple.js / the at-a-temple card).
   ============================================================ */
import fs from "node:fs";
import path from "node:path";

const src = process.argv[2];
if (!src) { console.error("usage: temples-build.mjs <temples-raw.json>"); process.exit(1); }
const raw = JSON.parse(fs.readFileSync(src, "utf8"));

/* ---------- the deity, read off the name ----------
   OSM has a `deity` tag and all but six of the fifty-seven thousand entries
   leave it empty, so it is of no use. The name usually carries the deity
   instead, and in a compound name the deity named LAST is the one the temple
   is of: Lakṣmī-Nārāyaṇa is Viṣṇu's, Rādhā-Kṛṣṇa is Kṛṣṇa's, Sītā-Rāma is
   Rāma's, Mīnākṣī-Amman is the Goddess's. Matching the first word found gives
   Lakṣmī-Nārāyaṇa to the Goddess, which is why the last match wins here.
   This is a guess and is treated as one: it chooses which stotras to offer
   first, and the reciter can always pin the place with the deity they know. */
const WORDS = {
  ganesha: ["ganesh", "ganesha", "ganapathi", "ganapati", "vinayak", "vinayaka", "vinayagar", "pillaiyar", "siddhivinayak", "gajanan", "vighneshwar", "heramba"],
  shiva: ["shiv", "shiva", "siva", "mahadev", "nataraj", "nageshwar", "someshwar", "visweswar", "vishwanath", "rameshwar", "kedarnath", "omkareshwar", "mallikarjun", "bholenath", "neelkanth", "trimbakeshwar", "amarnath", "lingeshwar", "jyotirling", "bhimashankar", "grishneshwar", "eeswar", "eswar", "ishwar", "iswara", "shankar", "sundareshwar", "kapaleeshwar"],
  devi: ["devi", "durga", "kali", "amman", "ambe", "amba", "bhavani", "chamundi", "chamundeshwari", "parvati", "parvathi", "lakshmi", "laxmi", "saraswati", "saraswathi", "mariamman", "mata", "mataji", "shakti", "gauri", "annapurna", "renuka", "yellamma", "bhagavathi", "bhagwati", "sheetla", "santoshi", "vaishno", "kamakshi", "meenakshi", "mookambika", "chandi", "tulja", "kanaka durga", "padmavathi"],
  vishnu: ["vishnu", "venkateswara", "venkateshwara", "venkatesh", "balaji", "narayan", "narayana", "ranganath", "jagannath", "krishna", "radha krishna", "govind", "gopal", "madhav", "varadaraj", "perumal", "srinivasa", "vitthal", "vithoba", "panduranga", "narasimha", "narsimha", "dwarkadhish", "banke bihari", "satyanarayan", "swaminarayan", "ram", "rama", "raghunath", "ramchandra", "kodandarama", "sitaram"],
  hanuman: ["hanuman", "anjaneya", "anjaneyar", "maruti", "bajrang", "sankat mochan"],
  subrahmanya: ["murugan", "subrahmanya", "subramanya", "kartikeya", "karthikeya", "skanda", "palani", "shanmukha", "velayudha", "kumaraswamy"],
  surya: ["surya", "suryanar", "sun temple", "konark"],
  guru: ["sai baba", "saibaba", "shirdi", "dattatreya", "raghavendra"],
  navagraha: ["navagraha", "shani", "saneeswar", "sanishwar"],
};
/* the app has no Hanumān deity of its own in the twelve — he is Viṣṇu's */
const FOLD = { hanuman: "hanuman" };
const DEITIES = ["ganesha", "shiva", "devi", "vishnu", "hanuman", "subrahmanya", "surya", "guru", "navagraha"];

/* A deity's name in a temple's name is a word of its own or the head of one:
   Hanumānjī, Veṅkaṭeśvaraswamy, Śivālaya. So the match must begin a word, and
   what follows it must be a short honorific and not a place: Rāmjī is Rāma's,
   Rāmpur and Rāmnagar are villages that happen to carry the name. */
const TAIL = /^(ji|jee|a|ar|an|am|as|aya|ayya|swamy|swami|swamu|wami|alaya|aalaya|alayam|ulu|udu|appa|amma|ambal|ar temple)?$/;
const PLACE = /^(pur|pura|puram|nagar|nagara|garh|gadh|bad|abad|halli|patnam|patna|wadi|vadi|gaon|palli|pally|pet|peta|kota|kunta|gudem|gudam|konda|giri|bagh|ganj)/;
function deityOf(name) {
  const low = " " + name.toLowerCase().normalize("NFKD").replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ") + " ";
  let best = null, bestAt = -1;
  for (const [id, words] of Object.entries(WORDS)) {
    for (const w of words) {
      let at = -1, from = low.length;
      /* the LAST word that names a deity is the one the temple is of */
      while ((at = low.lastIndexOf(" " + w, from)) >= 0) {
        const rest = low.slice(at + 1 + w.length).split(" ")[0];
        if (!PLACE.test(rest) && TAIL.test(rest)) {
          if (at > bestAt) { best = FOLD[id] || id; bestAt = at; }
          break;
        }
        /* a negative fromIndex is clamped to 0 and would match here forever */
        if (at === 0) break;
        from = at - 1;
      }
    }
  }
  return best;
}

/* ---------- one temple, one row ----------
   A large temple is mapped several times over: a node for the shrine, a way
   for the building, another for the compound wall, and the same name on each.
   The card has to name one place, so rows of the same name within a hundred
   and fifty metres are collapsed to the first. Distinct names inside one
   compound are kept — at Tirumala those are real, separate shrines. */
const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/\b(sri|shri|shree|sree|the|temple|mandir|mandira|kovil|koil|devasthanam|complex|inner|new|old)\b/g, "")
  .replace(/[^a-z0-9]+/g, "");

const rows = [];
for (const el of raw.elements) {
  const t = el.tags || {};
  const name = (t.name || "").trim();
  if (!name) continue;                               /* a card cannot name a nameless place */
  const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) continue;
  rows.push({ lat: +lat, lon: +lon, name, key: norm(name) });
}
rows.sort((a, b) => a.lat - b.lat);

const M = 150, DEG = M / 111320;
const keep = [];
for (const r of rows) {
  let dup = false;
  /* rows are sorted by latitude, so only the band behind this one can hold a
     duplicate: the scan stops as soon as it falls out of the band */
  for (let i = keep.length - 1; i >= 0; i--) {
    const k = keep[i];
    if (r.lat - k.lat > DEG) break;
    if (k.key !== r.key || !r.key) continue;
    const dx = (r.lon - k.lon) * Math.cos(r.lat * Math.PI / 180) * 111320;
    const dy = (r.lat - k.lat) * 111320;
    if (Math.sqrt(dx * dx + dy * dy) <= M) { dup = true; break; }
  }
  if (!dup) keep.push(r);
}

/* ---------- the file ----------
   Latitudes are stored as hundred-thousandths of a degree — about a metre,
   far finer than any phone fix — and as the step from the row before, which
   is small because the rows are sorted. Longitude and the deity ride along
   in their own arrays. */
const la = [], lo = [], nm = [], dy = [];
let prev = 0, guessed = 0;
for (const r of keep) {
  const v = Math.round(r.lat * 1e5);
  la.push(v - prev); prev = v;
  lo.push(Math.round(r.lon * 1e5));
  nm.push(r.name);
  const d = deityOf(r.name);
  if (d) guessed++;
  dy.push(d ? DEITIES.indexOf(d) + 1 : 0);
}

const out = `/* Stuti — temples the app can recognise without being told.
   Built ${new Date().toISOString().slice(0, 10)} by tools/temples-build.mjs from OpenStreetMap.
   © OpenStreetMap contributors. This index is a derived database under the
   Open Database Licence (ODbL); the app shows that credit wherever a name
   from it is used. ${keep.length} temples. */
window.STUTI_TEMPLE_IDX = (function () {
  var D = ${JSON.stringify(DEITIES)};
  var la = ${JSON.stringify(la)}, lo = ${JSON.stringify(lo)}, nm = ${JSON.stringify(nm)}, dy = ${JSON.stringify(dy)};
  /* the deltas are added back once, on load */
  var lat = new Float64Array(la.length), v = 0;
  for (var i = 0; i < la.length; i++) { v += la[i]; lat[i] = v / 1e5; }
  var lon = new Float64Array(lo.length);
  for (i = 0; i < lo.length; i++) lon[i] = lo[i] / 1e5;
  return {
    credit: "\\u00a9 OpenStreetMap contributors",
    count: la.length,
    /* the nearest temple within m metres, or null. The rows are sorted by
       latitude, so the search walks out from the reciter's own latitude and
       stops as soon as the band is left behind. */
    near: function (q, r, m) {
      m = m || 250;
      var band = m / 111320, hits = [];
      var a = 0, b = lat.length - 1, mid;
      while (a < b) { mid = (a + b) >> 1; if (lat[mid] < q - band) a = mid + 1; else b = mid; }
      var cos = Math.cos(q * Math.PI / 180);
      for (var i = a; i < lat.length && lat[i] <= q + band; i++) {
        var dx = (lon[i] - r) * cos * 111320, dy2 = (lat[i] - q) * 111320;
        var d = Math.sqrt(dx * dx + dy2 * dy2);
        if (d <= m) hits.push({ name: nm[i], deity: dy[i] ? D[dy[i] - 1] : null, lat: lat[i], lon: lon[i], m: Math.round(d) });
      }
      if (!hits.length) return null;
      hits.sort(function (x, y) { return x.m - y.m; });
      /* A great temple is mapped as several shrines and outbuildings, and the
         nearest of them is often an outbuilding with a name that says nothing.
         Among the rows standing about as close as the closest, one that names
         its deity is the better answer, because it is what the card can act on. */
      var best = hits[0];
      for (var k = 0; k < hits.length && hits[k].m <= Math.max(60, best.m * 1.4); k++) {
        if (hits[k].deity) { best = hits[k]; break; }
      }
      return best;
    }
  };
})();
`;
const dest = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", "stuti-temples.js");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log(`read ${raw.elements.length} OSM elements`);
console.log(`named ${rows.length}, kept ${keep.length} after collapsing duplicates (${rows.length - keep.length} dropped)`);
console.log(`deity guessed for ${guessed} (${Math.round(100 * guessed / keep.length)}%)`);
console.log(`wrote ${dest}  ${(out.length / 1e6).toFixed(2)} MB`);

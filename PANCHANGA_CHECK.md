# Pañcāṅga engine check — S88, 22 October 2026

A measurement of `stuti-app/src/stuti-panchanga-engine.ts` (with `stuti-ephemeris.ts`, `stuti-eclipse.ts`, `stuti-muhurta.ts`) against drikpanchang.com, with JPL Horizons as the referee wherever the two disagreed. The engine was not changed. Settings were the defaults: Lahiri ayanāṁśa, dṛk reckoning, amānta months.

## Addendum, same day: defects 1 and 3 fixed

After the measurement below, `effTz` was changed to read the day's offset at the place's local noon and each limb boundary is converted with the offset in force at that instant; the pūrṇimānta name now keeps an adhika month's own name through both fortnights. Re-running the same 96 rows: sunrise, sunset and all limb ends within 2 minutes on 96 of 96, pūrṇimānta month 96 of 96, and the four DST days print what drikpanchang prints whichever zone the device is in. Defect 2 was then taken on too: the ephemeris sun is now the Meeus ch. 32 VSOP87 series (within 0.6″ of JPL on 74 dates, 2025–2028; the old one was within 33″), and the Lahiri ayanāṁśa carries the nutation, matching the Rashtriya Pañcāṅga's printed values (24°12′35″ on 1 Caitra Śaka 1947, 24°13′55″ on 1 Bhādra 1948) to 2″. The saṅkrānti instants now stand 4–6 minutes before drikpanchang's (Makara 2026 15:07 IST vs 15:13; Karka 2026 23:39 vs 23:45; Makara 2027 21:10 vs 21:14; Karka 2027 05:48 vs 05:52); the remainder is drikpanchang's working ayanāṁśa sitting 12–16″ above the printed one, and the printed saṅkrānti instants were not reachable online to settle it. The 96-row check still passes within 2 minutes everywhere (tithi-end bias 1.3 min, from drikpanchang's truncation of seconds). The sections below are the measurement as it was made.

## Verdict in one paragraph

On an ordinary day the engine matches drikpanchang to the minute: sunrise and sunset within one minute on 94 of 94 clean rows, every tithi, nakṣatra, yoga, karaṇa and both month names agree by name on all 96 rows, the end times within two minutes, and rāhu kāla, yamagaṇḍa, gulika and abhijit to the minute. Moonrise and moonset differ from drikpanchang by four to six minutes everywhere, but JPL Horizons sides with the engine, not with drikpanchang. Three real defects were found: **(1)** on a daylight-saving transition day every clock time of that day is one hour out, in the place itself, because one zone offset is sampled at midnight and used for the whole day; **(2)** saṅkrānti instants run 10–16 minutes ahead of drikpanchang, about 22″ of it a constant ayanāṁśa offset and the rest the low-precision sun; **(3)** in the dark fortnight of an adhika month the pūrṇimānta month name jumps a month ahead (Āṣāḍha where drikpanchang keeps Adhika Jyeṣṭha). No vākya source could be reached, so vākya tithi ends are unchecked.

## What was compared

24 dates × 4 places = 96 day-pages, fetched from drikpanchang.com (geoname ids Tirupati 1254360, Hyderabad 1269843, New York 5128581, Sydney 2147714) and parsed from the HTML, not read by eye.

| Why the date | Dates |
|---|---|
| Makara saṅkrānti 2026 and 2027 | 14, 15 Jan 2026 · 14, 15 Jan 2027 |
| Karka saṅkrānti 2026 and 2027 | 16 Jul 2026 · 17 Jul 2027 |
| Adhika Jyeṣṭha 2026, bright and dark fortnight | 18 May, 10 Jun 2026 |
| New York DST ends (1 Nov 2026) and begins (14 Mar 2027) | 31 Oct, 1, 2 Nov 2026 · 13, 14 Mar 2027 |
| Sydney DST ends (4 Apr 2027) | 3, 4 Apr 2027 |
| Dīpāvali amāvāsyā | 8, 9 Nov 2026 |
| Tithi ending within an hour of sunrise (Hyderabad: Navamī ends 07:07, sunrise 06:23; Daśamī 07:16, sunrise 06:24) | 19, 20 Nov 2026 |
| Kārtika pūrṇimā | 24 Nov 2026 |
| Next two eclipses: annular solar 6 Feb 2027, penumbral lunar 20/21 Feb 2027 | 6, 7, 20, 21 Feb 2027 |

Fields: sunrise, sunset, moonrise, moonset, tithi and end, nakṣatra and end, yoga and end, karaṇa and end, rāhu kāla, yamagaṇḍa, gulika, abhijit, amānta and pūrṇimānta month, adhika flag, saṅkrānti instant (drikpanchang's "Sunsign … upto"), eclipse presence and visibility.

## Agreement, field by field (96 rows; the two DST rows set aside where marked)

| Field | Result |
|---|---|
| Sunrise | 85 exact, 7 one minute early, 2 one minute late (94 clean rows). Upper limb, −0.833°, matches drikpanchang's definition. |
| Sunset | 90 exact, 4 within one minute. |
| Tithi name at sunrise | 96 of 96 agree, including both near-sunrise days. |
| Tithi end | all within 2 min; engine is 1 min later on 49 rows and 2 min later on 44. Never earlier. |
| Nakṣatra name / end | 96 of 96 names; end 0 or +1 min. |
| Yoga name / end | 96 of 96 names (drikpanchang writes Indra for Aindra); end 0 or −1 min. |
| Karaṇa name / end | 96 of 96 names (Kinstughna for Kiṁstughna); end +1 or +2 min. |
| Rāhu kāla, yamagaṇḍa, gulika | start and end exact on every clean row. |
| Abhijit | exact on every clean row; both say none on Wednesday. |
| Amānta month | 96 of 96 (engine writes Puṣya and Āśvayuja where drikpanchang writes Pausha and Ashwina; same month). |
| Adhika flag | 96 of 96, including both adhika Jyeṣṭha dates. |
| Pūrṇimānta month | 92 of 96. Wrong on all four 10 Jun 2026 rows, see defect 3. |
| Moonrise / moonset | engine 3–6 min earlier at rise and 3–6 min later at set than drikpanchang on every row. JPL says the engine is right, see below. |

The constant +1 to +2 minutes on tithi and karaṇa ends has two parts. Drikpanchang truncates seconds (17:52:40 prints as 05:52 PM) while the engine rounds, worth half a minute on average. The rest is the engine's sun running 2″–28″ ahead of JPL (Meeus chapter 25, low precision) and its moon 5″–10″ behind, both of which shrink the elongation and push a tithi end later by about a minute. It is a bias, not noise, and it never changes which tithi holds at sunrise in this sample.

## Defect 1 — a DST transition day is one hour out, in the place itself

`effTz(loc, date)` asks Intl for the zone's offset at the instant carried by `date`. `forDay` is called with local midnight, so the offset in force at 00:00 is applied to every minute of that civil day, including the minutes after the clocks change. The result is also machine-dependent, because `new Date(y, m, d)` is midnight in the *device's* zone, not the place's.

Measured (drikpanchang in brackets):

| Day | Device zone | Engine sunrise | Engine sunset |
|---|---|---|---|
| New York, Sun 1 Nov 2026 (EDT→EST at 02:00) | India, or New York | 07:26 (06:26) | 17:52 (16:52) |
| New York, Sun 14 Mar 2027 (EST→EDT at 02:00) | India, or New York | 06:10 (07:10) | 18:02 (19:02) |
| Sydney, Sun 4 Apr 2027 (AEDT→AEST at 03:00) | Sydney | 07:09 (06:09) | 18:47 (17:47) |
| Sydney, Sun 4 Apr 2027 | India | 06:09 (06:09) | 17:47 (17:47) — right only by luck of the device zone |
| Sydney, Sun 4 Oct 2026 (AEST→AEDT) | Sydney | 05:29 (06:29 expected) | 18:00 (19:00 expected) |

On those days every clock value on the card is shifted by the hour: tithi end, nakṣatra end, rāhu kāla, abhijit, moonrise. The day before is also touched at its far edge: 13 Mar 2027 New York tithi end prints 02:02 (+1) where the clock reads 03:01, because 02:00–03:00 does not exist that night. Twice a year for every reciter outside India. Fix belongs in `effTz`/`forDayRaw`: take the offset at the place's local noon for the day's frame, and convert each end instant with the offset in force at that instant.

## Defect 2 — saṅkrānti instants 10–16 minutes early

| Saṅkrānti | Engine (IST) | drikpanchang (IST) | Engine early by |
|---|---|---|---|
| Makara 2026 | 14 Jan 14:57 | 14 Jan 15:13 | 16 min |
| Karka 2026 | 16 Jul 23:32 | 16 Jul 23:45 | 13 min |
| Makara 2027 | 14 Jan 21:04 | 14 Jan 21:14 | 10 min |
| Karka 2027 | 17 Jul 05:39 | 17 Jul 05:52 | 13 min |

The civil day of every saṅkrānti still agrees, so Makara Saṅkrānti and the solar months fall on the right date in this sample. Taking JPL's tropical sun at drikpanchang's instants gives drikpanchang's working ayanāṁśa directly (tropical longitude minus 270° or 90°): 24.2265°, 24.2341°, 24.2404°, 24.2476°. The engine's Lahiri at the same instants is 24.2205°, 24.2275°, 24.2345°, 24.2415° — **22″ smaller every time**, a constant offset in the epoch value `AYAN_EPOCH.lahiri = 23.85674`, not a nutation term (nutation moved between −4″ and +10″ across these four dates and the gap did not follow it). The remainder is the sun itself: against JPL the engine's apparent sun was +19″ at the Makara 2026 instant, +4″ at Makara 2027, +26″ on 18 May 2026, +8″ on 1 Nov 2026. 22″ + 19″ = 41″ ≈ 16.6 min at the sun's 2.46′/h, which is the first row exactly. A saṅkrānti to the minute therefore needs a better sun (VSOP87 or a fuller Meeus series) and the ayanāṁśa epoch settled against the Indian Astronomical Ephemeris rather than against drikpanchang; this check cannot say which of the two Lahiri values is the printed one.

## Defect 3 — pūrṇimānta name in an adhika dark fortnight

10 Jun 2026 is Kṛṣṇa Daśamī of amānta Adhika Jyeṣṭha. Drikpanchang names the pūrṇimānta month Adhika Jyeṣṭha; the engine names it Āṣāḍha, on all four places. The rule `MASA_LUNAR[(masaIdx + (tIndex >= 15 ? 1 : 0)) % 12]` steps to the next name in the dark fortnight without knowing that the next amānta month is nija Jyeṣṭha, so it skips a month. The bright fortnight (18 May) is right. Only pūrṇimānta users are affected, for about a fortnight every 32 months. `masaAdhika` is also only an amānta fact; the pūrṇimānta name carries no adhika marker.

## Moonrise and moonset — engine right, drikpanchang four minutes off

Engine moonrise is 3–6 minutes before drikpanchang's and moonset 3–6 minutes after, on every row and in every place, growing with latitude. JPL Horizons, asked for the moon's refracted topocentric altitude at the place:

| Event | Engine | drikpanchang | JPL: moon's upper limb on horizon (centre at −0.26°) |
|---|---|---|---|
| Hyderabad moonrise 18 May 2026 | 06:47 | 06:51 | 06:46½ |
| Hyderabad moonset 18 May 2026 | 20:38 | 20:34 | 20:38 |
| New York moonrise 18 May 2026 | 06:41 | 06:47 | 06:41 |
| Tirupati moonrise 3 Nov 2026 (after midnight) | 00:50 | 00:54 | 00:50 |

At drikpanchang's times the moon's centre is already 0.46° above the refracted horizon, so drikpanchang appears to compute the moon's centre on an unrefracted horizon, or without parallax; the engine's +0.125° geocentric threshold (refraction and semidiameter less parallax) is the textbook one and JPL confirms it. The engine's moon position itself is within 10″ of JPL on all three instants tested. One convention difference remains: drikpanchang prints the Hindu day's moonrise (sunrise to sunrise, so often after midnight) while the engine prints the civil day's; the compare script re-pairs those and the report above is on the re-paired values. Sunrise was checked the same way: JPL puts the sun's centre at −0.26° refracted at 00:13:00 UT on 18 May 2026 at Hyderabad, the engine's 05:43 IST to the second.

## Eclipses

| Eclipse | Engine | drikpanchang / reference |
|---|---|---|
| Annular solar, 6 Feb 2027 | Found on 6 Feb for India and New York, 7 Feb for Sydney (date rolls with the zone); not visible from any of the four, type annular | drikpanchang flags Sūrya Grahaṇa Valayākāra on 6 Feb; NASA/eclipsewise: annular over South America and West Africa, nothing visible from North America or India |
| Penumbral lunar, 20/21 Feb 2027 | Maximum 23:13 UTC (04:43 IST 21 Feb, 18:13 EST 20 Feb, 10:13 AEDT 21 Feb); visible at Tirupati, Hyderabad, New York; not from Sydney (daytime) | drikpanchang flags Candra Grahaṇa Upacchāyā on 21 Feb (India, Sydney) and 20 Feb (New York); greatest eclipse 23:13 UTC in the NASA canon |

The engine's "max" for a solar eclipse is the local minimum separation, so for a place outside the shadow it is not the time of greatest eclipse (15:59 UTC) and should not be shown as one. Both eclipses land on the right civil day in every zone.

## Vākya

No vākya pañcāṅga with machine-readable daily tithi end times was reachable (Tamil and English searches returned only dṛk sites). Vākya tithi ends are therefore unchecked. The engine's vākya mode was not exercised either; this whole report is dṛk.

## What agrees everywhere

Sunrise, sunset, the tithi at sunrise, the nakṣatra, yoga and karaṇa at sunrise, their end times to within two minutes, rāhu kāla, yamagaṇḍa, gulika, abhijit, the amānta month, the adhika flag, the civil day of each saṅkrānti, and the civil day and visibility of both eclipses — on every one of the 94 rows that are not a DST transition day.

## Re-running the check

From `stuti-app/`:

```bash
node tools/panchanga-check/run.mjs > /tmp/pc/engine.jsonl
```

```bash
python3 -I tools/panchanga-check/fetch_dp.py /tmp/pc
```

```bash
python3 -I tools/panchanga-check/compare.py /tmp/pc
```

`run.mjs` bundles `entry.ts` with the app's own rolldown and prints one JSON line per date and place; `run.mjs --find` lists the saṅkrāntis, eclipses, adhika months, amāvāsyās, pūrṇimās and near-sunrise tithi ends the dates were chosen from; `run.mjs 2026-11-01 newyork` does one day; `run.mjs --pos 2026-05-18T00:00:00Z` prints the sun and moon for a JPL Horizons comparison (Horizons: CENTER 500@399, QUANTITIES 2,31). To reproduce the DST finding as a device in the place would see it, prefix with `TZ=America/New_York` or `TZ=Australia/Sydney`. The fetch takes about three minutes at one page per 1.5 s; the compare prints every difference over two minutes and the per-field statistics, and leaves `merged.json` with both sides' raw values.

# For the Stuti design project — what was built, and what needs your eye

Paste this whole note into the Stuti design project as context.

Everything below is already working in the app and in the prototype. None of it
has been designed — it was built to be correct, and it is dressed in borrowed
styles. The ask is the visual and structural pass.

## Files that changed, all in the project root

    stuti-compass.jsx     the dial and the sheet it opens — most of the work
    stuti-temple.js       NEW — the reciter's pinned temples, and the lookup
    stuti-home.jsx        a new "you are here" card near the top of home
    stuti-japa.jsx        a new full-screen counting mode
    stuti-follow.jsx      the phone laid face down holds the recitation
    stuti-components.css  all the new classes (cp-*, tpl-*, japa-blind-*)
    stuti-code.css        the Follow chip's new states
    stuti-i18n.js         about 40 new strings, all three languages filled
    Stuti.html            one new script tag for stuti-temple.js

There is also a data file, `stuti-temples.js` (1.6 MB), which the prototype
does not have. Without it the temple-recognition card simply never appears;
pin a temple by hand and the card shows the pinned version instead. Ask for the
file if you want to see the recognised state.

## What was built

**1. The compass became a place-and-direction sheet.**
It used to be a 38px dial in the greeting that only marked north. Tapping it
now opens a bottom sheet titled "Which way things lie", holding four things:

  - the direction each rite faces (sandhyā east, evening west, tarpaṇa south,
    japa and the seat east or north), each with a live needle
  - where the sun stands now, where it rose, where it will set
  - a pradakṣiṇā counter that counts circuits off the phone's heading
  - 50 tīrthas by distance and direction, with a needle each; choose one and
    its gold needle stays on the dial afterwards

The dial itself now carries four marks: the north needle, the east dot, a gold
needle for the chosen tīrtha, and a disc for the sun. At 38px that is crowded.

**2. The reciter's own temples.**
At the foot of the sheet they can pin where they are standing, with a name and
a deity. Arriving at a pinned place, or at one of 42,000 temples the app knows
from OpenStreetMap, puts a card at the top of home: the temple's name, its
deity's stotras, and one tap to the pradakṣiṇā counter.

**3. Japa counted with the eyes closed.**
A full-screen mode where a touch anywhere tells a bead, with a different
vibration at each completed mālā. Opened from a chip beside Undo.

**4. Follow holds when the phone is laid face down.**
Opt-in, switched on from the Follow chip. While held, the chip says so.

## What needs you

- **The sheet has outgrown its shape.** Five sections in one scrolling bottom
  sheet, and the reciter usually wants exactly one of them. Sections, tabs,
  or a different container altogether — your call.
- **The dial is carrying four marks in 38 pixels.** It may need to be larger,
  or to show fewer marks, or to show different ones in different states.
- **The at-a-temple card sits above the pañcāṅga hero** and competes with it
  for the top of the screen. It appears rarely, which may argue for it being
  louder, or for it being somewhere else entirely.
- **The pradakṣiṇā counter** is a number, a progress bar and four target
  chips. It is the one screen a reciter looks at while walking, probably in
  sunlight, possibly holding a lamp.
- **The eyes-closed japa screen** is a big number on a plain field. It is seen
  in the dark, briefly, by someone not wearing their glasses.
- **The Follow chip** now carries Record and the face-down switch side by
  side, and is getting crowded.
- **A credit line.** Where a temple's name came from OpenStreetMap the card
  must say so — this is a licence condition, not a nicety — and it currently
  sits as small grey text at the foot of the card.

## Constraints that are not open

- **No italics anywhere**, as always.
- Every new string exists in roman, Devanāgarī and Telugu. Please keep all
  three when you reword, and keep the i18n keys as they are.
- Colours and fonts are tokens only. The new CSS uses the existing ones.
- The geometry is correct and checked — bearings, the solar position, the
  circuit counting, the face-down tilt. Please change how these look freely,
  but leave the numbers and the maths alone.
- The reciter is an elder, often outdoors, often in poor light.

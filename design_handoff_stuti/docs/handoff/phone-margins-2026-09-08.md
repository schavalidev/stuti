# Phone margin audit — port to Claude Code project

Two files touched. Both changes are pure CSS; no JSX, no markup, no new classes.

## 1. `stuti.css` — add the gutter token

In the `:root` block, right after `--app-max`:

```css
  --app-max: 480px;
  /* the phone edge gutter — every bar and rail that touches the frame */
  --gut: 18px;
```

## 2. `stuti-components.css` — append at end of file

```css
/* ---------- phone edges: one gutter, one safe area ----------
   The house gutter is 18px, set by .home and every card rail. What must sit on
   it is the glyph, not the button box — so a bar that touches a screen edge
   pads to the gutter and its edge icon buttons pull back out by their own
   internal padding, keeping a thumb-sized box while the mark stays in line.
   The floating tools gear is app chrome over every screen, so the bars that
   pass under it reserve its slot rather than letting a screen's own control
   land beneath it. And a bar at the very top of the frame carries the notch
   inset itself — .topbar already did; the masthead and the pinned bar did not. */
.topbar { padding-inline: var(--gut); }
.app:has(> .app-gearrow) .topbar { padding-right: 56px; }
.topbar > .icon-btn:first-child { margin-left: -13px; }
.app:not(:has(> .app-gearrow)) .topbar > .icon-btn:last-child { margin-right: -13px; }
.reader-topbar > .icon-btn:first-child { margin-left: -9px; }
.reader-topbar > .icon-btn:last-child { margin-right: -12px; }
.app-gearrow { top: calc(6px + env(safe-area-inset-top)); }
.brandbar { padding: calc(14px + env(safe-area-inset-top)) var(--gut) 8px; }
.brandbar-cog { margin-left: -15px; }
.rd-toppanel { padding-inline: 6px; }
.rd-toppanel.is-pinned { margin: 0; padding: calc(8px + env(safe-area-inset-top)) 56px 6px 6px; }
.app > .rd-toppanel.is-pinned .rd-pin-btn { right: 6px; top: calc(6px + env(safe-area-inset-top)); }
.rd-toppanel.is-drop { padding-inline: 6px; }
.rd-toppanel.is-drop .rd-pin-btn { right: 6px; }
.reciter { padding-inline: var(--gut); }
```

These override the earlier `.topbar` / `.brandbar` / `.rd-toppanel` / `.reciter` rules,
so they must stay **last** in the file (or be merged into those original rules if your
project prefers no override layer — the values are what matter, not the position).

## Why each line exists

| Rule | Problem it fixes |
|---|---|
| `.topbar { padding-inline: var(--gut) }` | sub-screen titles and day tags sat at 12px while content sat at 18px |
| negative margins on first/last `.icon-btn` | pads the bar to the gutter without pushing the *glyph* in to 25px — the mark lands on 18, the tap box still reaches the edge |
| `.app:has(> .app-gearrow) .topbar { padding-right: 56px }` | the floating tools gear covered the Practices bar's own right-hand button; bars under it now reserve its slot |
| `:not(:has(...))` on the last button | only pull the right button out when there is no gear to collide with |
| `env(safe-area-inset-top)` on `.app-gearrow`, `.brandbar`, `.rd-toppanel.is-pinned` | only `.topbar` had it; on a notched phone these three lived under the status bar |
| `.reciter { padding-inline: var(--gut) }` | reciter bar was at 16px |

## Verified

Measured every routable screen at 390px (home, daily, browse, calendar, settings,
practices, japa, plans, deity, reader): first/last bar control glyph now at 18px ±1,
no control overlapping the floating gear.

## Deliberately left alone

- Horizontal lens/chip rails scroll content past the frame edge — intentional.
- Bottom tab bar keeps its 14px inner padding (full-bleed surface, its own optical rhythm).
- Not audited because unreachable by route: reader story sheet, onboarding, gate screens.

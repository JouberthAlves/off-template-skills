# Spec: Off-Template site, second version

You write the code. Everything you need is in this file and in the files it
names. Do not run a server, open a browser or take screenshots. You may run
`node --check site/app.js` (and any other .js you write) and check that every
path you reference exists. Work only inside `site/`.

The design is decided; do not change palette, faces, copy or layout. If
something here is impossible, do the closest thing and list it in your final
message.

## Files

Write (overwrite) `site/index.html`, `site/styles.css`, `site/app.js`,
`site/beam.js`. Plain HTML, CSS and JS. No libraries, no build step, no CDN
scripts. Fonts from Google Fonts (one `<link>`, with `preconnect`).

Images already in `site/img/` (use exactly these):

| File | What it is | Size |
|---|---|---|
| `skel-a.webp`, `skel-b.webp`, `skel-c.webp` | grey skeleton of each direction's first screen | 1864x1166 |
| `dir-a.webp`, `dir-b.webp`, `dir-c.webp` | coloured mockup of each direction's first screen | 1600x~1090 |
| `normal-desktop.webp` | burger page an agent made alone ("Ember & Bun") | 1440x900 |
| `super-desktop.webp` | burger page made through the flow ("Order 27") | 1440x900 |

`dir-a` is 1600x1090, `dir-b` 1600x1170, `dir-c` 1600x1058.

Give every `<img>` its `width`, `height`, `alt`, and `loading="lazy"` except
the hero's.

## Build in two parts

**Part 1 (this round, unless told otherwise): the nav and the hero only.**
`<main>` holds the hero and nothing else yet. Part 2 adds the sections.

## Floor (any of these breaks the build)

- Line 1 of `styles.css` is exactly the stamp below.
- Every colour and every font family is a custom property declared in `:root`.
  No hex, `rgb()`, `color-mix()` or family name anywhere else, inline styles
  included. Look tokens (`--a-*`, `--b-*`, `--c-*`) are declared in `:root`
  and mapped inside `[data-look]` blocks with `var()` only.
- Never `transition: all`; never animate `width`, `height`, `top`, `left`,
  margins or padding. Motion uses `transform`, `opacity`, `filter`,
  `clip-path`.
- `html, body { overflow-x: clip; }`. Never `overflow: hidden` on html or
  body, never `100vw`.
- Grid tracks are `minmax(0, 1fr)` (or `minmax(0, Nfr)`), never bare `fr`.
- One container: `max-width: 80rem`, centred, side padding
  `max(16px, 4vw)` capped at 48px (`clamp(16px, 4vw, 48px)`).
- No horizontal scroll at 375, 768, 1280, 1440, 1920 px. Absolutely placed
  things (the agent window, the beam canvas) stay inside their parent's box
  at every width.
- No box with background and border or shadow inside another such box.
- `:focus-visible` on every link, button and control: `outline: 2px solid
  var(--red); outline-offset: 3px`.
- `@media (prefers-reduced-motion: reduce)` covers everything listed under
  "Reduced motion"; the page is complete with scripts off.
- No invented numbers, quotes, ratings or logos.

Stamp (line 1 of `styles.css`, exactly):

```css
/* off-template · direction C "darkroom develop" + safelight beam + agent window that picks the look below · job: copy the install command · faces: Familjen Grotesk / JetBrains Mono · palette: night, tray, logo red, print white · motion: lively, the beam lights the hero, prints develop · waivers: none */
```

## Tokens (`:root`)

```
--night:   #141818   ground (hero, nav, and look C)
--tray:    #1c2120   the tray, panels
--line:    #282c30   hairlines inside the agent window only
--red:     #E5231B   the logo caret, the beam, the action, focus (only accent of the hero)
--head:    #f4f4f4   headline and strong text on night
--text:    #acb0bc   body text on night
--print:   #fcf8f4   the print's white border
--ink:     #141818   text on light (look B)
--shadow:  rgba(0, 0, 0, .6)
--ink-line: rgba(20, 24, 24, .12)   hairlines on light (look B, Part 2)
--mask-on: #000                      alpha for CSS masks
--lit-ink: color-mix(in srgb, var(--red) 40%, var(--head))   letters where the beam falls
--teal:    #6cb4bc   look A accent
--green:   #a0c080   look A/B
--coral:   #d07074   look A/B
--font-c:  "Familjen Grotesk", "Helvetica Neue", Arial, sans-serif
--font-a:  "Mona Sans", "Helvetica Neue", Arial, sans-serif
--font-b-head: "Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif
--font-b-body: "Instrument Sans", "Helvetica Neue", Arial, sans-serif
--font-mono: "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace
```

Google Fonts link families: Familjen Grotesk 400;700, Mona Sans 400;800,
Bricolage Grotesque 800, Instrument Sans 400;600, JetBrains Mono 400;500.
`display=swap`.

Type scale: body 17px/1.55 (16px under 600px); h1 `clamp(2.9rem, 6.2vw,
6rem)`/0.95, weight 700, letter-spacing -0.025em; h2 `clamp(2rem, 4vw,
3.4rem)`/1.02; small 14px. Headings `text-wrap: balance`. Body text max 62ch.
Tabular numerals on numbers.

`::selection { background: var(--red); color: var(--head); }`,
`caret-color: var(--red)`, a thin scrollbar in `--tray`/`--line`.

## Head

- `<html lang="en" class="no-js">`; first script line in `<head>` swaps
  `no-js` for `js`.
- Title: `Off-Template: same prompt, different designer`
- Description: `Skills that make your coding agent ask a brief, research the
  niche and show three directions before it writes a line of code.`
- Canonical `https://off-template-skills.vercel.app/`, og:title,
  og:description, og:image `https://off-template-skills.vercel.app/img/dir-c.webp`,
  `theme-color` `#141818` (meta tags may carry the hex: they are not CSS).
- Favicon, exactly:
  `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23FFFFFF'/%3E%3Cpath d='M14 46 L32 16 L50 46' fill='none' stroke='%23E5231B' stroke-width='9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">`

## Nav

Inside the container, 24px from the top, logo left, links right, on night.

Logo (keep this exact markup; it is the brand):

```html
<a class="logo" href="#" aria-label="Off-Template, home">
  <span>Super</span><svg class="caret" viewBox="0 0 40 30" aria-hidden="true"><path d="M5 26 L20 6 L35 26"/></svg><span>Webdesigner</span>
</a>
```

Logo style: `--font-c` 700, 22px, `--head`, letter-spacing -0.02em,
`display: inline-flex; align-items: baseline`. `.caret`: width .72em, height
.6em, margin 0 .04em, `align-self: center`, overflow visible; its path: no
fill, stroke `--red`, stroke-width 4.5, round caps and joins.

Links: "How it works" (`#flow`), "The tells" (`#tells`), and "GitHub" as a
button-shaped link to `https://github.com/JouberthAlves/off-template`
(1px border `--line`, radius 6px, padding 8px 14px). 15px, `--text`, hover
`--head`. Under 600px: only the logo and the GitHub link (the two anchors
hide).

## Hero

Section `#hero`, background `--night`, position relative, `isolation:
isolate`. Height from its content (no `100vh`), padding-block
`clamp(40px, 7vw, 96px)` top, `clamp(48px, 7vw, 104px)` bottom.

### Layout

Desktop (>= 960px): grid `minmax(0, 5fr) minmax(0, 7fr)`, gap
`clamp(24px, 4vw, 64px)`, `align-items: center`.

- Left column, in order: h1, the sentence, the install block.
- Right column: `.stage` (holds the tray and the agent window as siblings,
  never one inside the other).

Under 960px: one column, in this order: h1, sentence, `.stage`, install
block.

Everything (nav, h1, sentence, the install command, the agent window) visible
at 1280 x 800 without scrolling.

### Copy (exact)

- h1, three lines on desktop: `Same prompt.` / `Different` / `designer.`
  (use `<br class="d">` breaks that show only >= 960px; on phones let it wrap).
- Sentence (`.lede`, 20px desktop, 18px phone, `--text`, max 28ch):
  `Your coding agent asks, researches and shows three directions before it codes.`

### Install block

A tablist of three tabs, then the command row.

- Tabs (buttons, `role="tab"`, arrow keys move between them): `Claude Code`,
  `Codex`, `Cursor`. 15px `--font-c`, `--text`; selected tab `--head` with a
  2px `--red` underline (a pseudo-element scaled with `transform`).
- Command row: `--tray` background, radius 6px, padding 14px 16px,
  `--font-mono` 15px, `--head`; a `>` prompt sign in `--red` before the
  command. The command text wraps on narrow screens (`overflow-wrap:
  anywhere`), never scrolls the page. Commands:
  - Claude Code: `npx skills add JouberthAlves/off-template -g -a claude-code`
  - Codex: `npx skills add JouberthAlves/off-template -a codex`
  - Cursor: `npx skills add JouberthAlves/off-template -a cursor`
- Copy button at the right of the row (`aria-label="Copy the command"`),
  text `Copy`, becomes `Copied` for 1.6s. `navigator.clipboard.writeText` in
  the click handler; on rejection, select the command text. Hidden with
  `.no-js`.
- Under the row, 14px `--text`: `Then ask for a site the way you always do.`

Without JS: the three commands are listed as three rows, each with its agent
name, no tabs.

### The stage: tray, print, agent window

`.stage` is `position: relative`, padding-top 56px and padding-left 40px on
desktop (room for the window), padding-top 0 and padding-left 0 under 960px.

**Tray** (`.tray`, decorative, `aria-hidden="true"` on its visual layers
only): background `--tray`, radius 6px, aspect-ratio 16 / 11, `position:
relative`, `overflow: hidden`, `data-lit`. Inner rim: a 1px inset highlight
made with an inset box-shadow of `--line` (the tray is the only element with a
shadow besides the window). Inside:

- `.liquid`: absolute inset 0; a very slow sheen, a soft radial highlight in
  `--head` at 4% opacity that drifts with `transform` (translate and scale,
  20s loop, alternate). No other texture.
- `.print`: centred, width 76%, rotated -1.2deg, border 6px solid `--print`,
  `aspect-ratio: 1600 / 1090`, `data-lit`. Two images stacked, both
  `object-fit: cover`, absolute inset 0:
  `.print-skel` (the skeleton of the current direction) and `.print-mock`
  (its mockup). At rest the mockup is fully shown.
- `.ripple`: an absolutely centred circle, border 1px `--head` at 30%,
  scale 0, opacity 0; used by the develop animation.

Under the tray, a caption row (14px, `--text`, three spans with 24px gap):
`skeleton`, `mockup`, `this page`. The active stage is `--head`. When the
develop runs, the highlight moves skeleton -> mockup -> this page.

**Agent window** (`.agent`, a `<div role="group" aria-labelledby>`):
`position: absolute; top: 0; left: 0;` width `min(25rem, 86%)`, background
`--night`, 1px border `--line`, radius 8px, box-shadow
`0 24px 48px -16px var(--shadow)`, z-index above the tray, `data-lit`. Under
960px it is `position: relative`, full width, and sits above the tray with
16px gap (no overlap).

- Title bar: 36px high, border-bottom 1px `--line`; three 10px circles in
  `--line` at the left (decoration of a terminal window, `aria-hidden`); in
  the centre `claude: off-template-skills.vercel.app` in `--font-mono` 13px
  `--text`.
- Body, padding 16px, `--font-mono` 14px/1.55, `--text`:
  - Line 1: `> Build the rest of this page.` (`>` in `--red`, text `--head`).
  - Line 2 (`id="agent-q"`): `Three directions are ready. Pick one:`
  - Three buttons, stacked, full width, left-aligned text, 44px min height,
    1px border `--line`, radius 6px, `--font-mono` 14px, `--head`. Each has a
    letter and a name: `A  Editor at Night`, `B  The Output Leads`,
    `C  Darkroom Develop`. `aria-pressed`; the pressed one has a `--red` border
    and a `--red` letter. C is pressed at load. Hover: border `--text`.
  - Status line (`id="agent-status"`, `aria-live="polite"`), 13px, starts as
    `This page is C, Darkroom Develop.`
- With `.no-js` the three buttons are hidden and line 2 reads
  `Three directions were ready. This page is C, Darkroom Develop.`

### What picking a direction does (Part 1: the hero part only)

On click of A, B or C (if it is not the pressed one):

1. Buttons disable for the run. The status types, 28ms per character:
   `> Building the sections below in <name>…`
2. Develop, in the print (1.8s total): the skeleton image of the new
   direction appears at opacity 1 over the old mockup (cut, no fade: the tray
   is refilled); the ripple runs (scale 0 -> 2.4, opacity .5 -> 0, 900ms,
   ease-out); the new mockup then develops over the skeleton: from
   `opacity: 0; filter: grayscale(1) brightness(1.7) contrast(.45)` to
   `opacity: 1; filter: none`, 1400ms, `cubic-bezier(.2, .7, .2, 1)`. The
   caption highlight moves skeleton -> mockup during it.
3. `document.documentElement.dataset.look` is set to `a`, `b` or `c`
   (Part 2 styles the sections from it). Dispatch
   `window.dispatchEvent(new CustomEvent('look', { detail: 'a' }))`.
4. Status ends: `Done. The page below is now <name>.` Caption highlight on
   `this page`. Buttons enable; the new one is pressed.

Map: A = Editor at Night (`skel-a`, `dir-a`), B = The Output Leads
(`skel-b`, `dir-b`), C = Darkroom Develop (`skel-c`, `dir-c`). Preload the
other four images after load (`new Image()`), on idle.

Alt text: the mockup image alt is `Mockup of direction <letter>, <name>, as
the skill generated it` and the skeleton image has `alt=""`.

## The beam (`site/beam.js`)

A red safelight hangs above the hero; its beam comes down, sways, leans
toward the pointer and lights the things it crosses. Our own shader;
reference for the feel: React Bits' Light Rays from the top (volumetric rays,
haze), Lightfall's falling specks (kept sparse). Do not import or copy any
library.

### Canvas

`<canvas class="beam" aria-hidden="true">` absolutely positioned inside
`#hero`, inset 0, `pointer-events: none`, z-index 0 (content above it at
z-index 1, except the lit overlays). WebGL1 (`getContext('webgl')`), one
full-screen triangle, one fragment shader. Device pixel ratio
`min(devicePixelRatio, 1.5)`, and the canvas never above 2.2 million pixels.

### Geometry

- Source: the lamp, above the hero top edge, at x = the centre of `.stage`
  on desktop (measure it), x = 50% of the hero under 960px; y = -12% of the
  hero height.
- Direction: straight down, plus a sway of ±3.5° (sine, 11s period) plus a
  lean toward the pointer: the angle moves toward the pointer by 10% of the
  way, smoothed (time constant 400ms). No pointer: sway only.
- Cone: half-angle 13° desktop, 17° under 960px; soft edges (the last 35% of
  the half-angle fades).

### Shader (fragment)

Uniforms: resolution, time, source (px), direction (unit vec), half-angle,
colour (from `--red`, read with `getComputedStyle` and parsed), intensity.

Light at a pixel = cone(angle) x rays x haze x falloff:
- cone: 1 inside, smoothstep to 0 across the soft edge.
- rays: `0.78 + 0.12*sin(a*41.0 + t*0.9) + 0.10*sin(a*23.0 - t*0.6)` where
  `a` is the angle from the axis in radians; gives faint moving streaks.
- haze: value noise along the beam, `mix(0.85, 1.15, noise(vec2(a*6.0,
  dist*0.004 - t*0.05)))`.
- falloff: `exp(-dist / (heroHeight * 1.1))`, plus a bright core near the
  source: `+ 0.6*exp(-dist/90.0)`.
- specks (Lightfall-like, sparse): a grid of 70px cells moving down at
  14px/s; each cell holds one point at a hashed position; draw a soft dot
  (radius 1.3px, smoothstep) where the cell's hash > 0.82, only inside the
  cone; brightness 0.35.
Output: colour x light x intensity (0.55), alpha = light x 0.55, premultiplied.
Blend over the night ground with normal alpha.

Intro: on load the intensity rises 0 -> 0.55 over 1.4s (ease-out), as if
the lamp warms up.

### Lighting the elements

Elements with `data-lit` (the h1, the tray, the print, the agent window)
catch the light. Each frame, for each one, compute from its bounding box:

- `lit`: how much of the cone crosses its centre: distance from the box
  centre to the beam axis, compared to the cone's half-width at that depth,
  `clamp(1 - d / halfWidth, 0, 1) ^ 1.4`, times the falloff at that depth.
- `lx`: where the axis crosses the box, as a percentage of its width.

Set them as `--lit` and `--lx` on the element (`style.setProperty`, numbers
only). CSS does the lighting:

- **h1**: an `aria-hidden` copy of the headline (`.h1-lit`, same markup and
  breaks, absolutely over it, `pointer-events: none`) in `--lit-ink`, masked
  by `radial-gradient(ellipse 22% 120% at var(--lx) 0%, #000 0%, transparent
  100%)` (the mask's colours are alpha, allowed here as the only literal; or
  use `--mask-on: #000` declared in `:root`, preferred), opacity `var(--lit)`.
  The letters under the beam turn warm. Never `background-clip: text`.
- **tray, print, agent window**: a `::after` overlay, absolute inset 0,
  `pointer-events: none`, `background: radial-gradient(ellipse 40% 90% at
  var(--lx) 0%, var(--red), transparent 70%)`, `mix-blend-mode: screen`,
  opacity `calc(var(--lit) * .35)`; the print's at `.5`. The agent window's
  overlay sits under its content (`z-index: 0`, content `z-index: 1`).

### Performance and fallbacks

- Start the loop on `requestIdleCallback` (fallback `setTimeout` 200ms).
- Pause when the hero is off screen (`IntersectionObserver`, threshold 0)
  and when the tab is hidden.
- If WebGL is missing or the shader fails: add `.beam-static` to `#hero` and
  draw the beam in CSS: a `::before` on `#hero` with a `conic-gradient` cone
  from the lamp position in `--red` at low alpha, blurred with `filter:
  blur(18px)`, opacity .5. The `data-lit` values are then computed once for
  the straight-down beam.
- Re-measure on resize (`ResizeObserver` on `#hero`).

## Motion on load (hero)

- The lamp warms up (above).
- h1 lines rise 24px with opacity 0 -> 1, 80ms apart, 700ms,
  `cubic-bezier(.2, .7, .2, 1)`; the sentence and install block 120ms after.
- The print develops once from `skel-c` to `dir-c` (the develop above,
  without the ripple), starting at 600ms.
- Visible by default: the start states are applied only under `.js`, and
  everything ends visible even if a script fails (a 2.5s safety timeout that
  adds `.ready` to `<html>`, where every element is at its end state).

## Reduced motion

`prefers-reduced-motion: reduce`: no sway, no lean, no specks, no intro
(the beam is drawn once, straight down, and the loop stops); no h1 rise; no
typing (status text is set at once); the develop is a 200ms opacity cross-fade
with no filter and no ripple; the liquid sheen stands still.

## Part 2 (next round): the sections

In Part 1, leave a comment `<!-- Part 2: sections -->` inside `<main>` after
the hero. Part 2 replaces that comment with `<div id="built">` holding the
five sections below and adds the footer after `</main>`.

### The three looks

Everything inside `#built` and the footer is styled from
`html[data-look]` (`c` at load; Part 1's script changes it). The hero and
nav never change. Each look is a set of section tokens mapped from the
`:root` palette:

| Token | C, Darkroom Develop | A, Editor at Night | B, The Output Leads |
|---|---|---|---|
| `--s-bg` | `--night` | `--night` | `--print` |
| `--s-surface` | `--tray` | `--tray` | `--print` |
| `--s-text` | `--text` | `--text` | `--ink` |
| `--s-head` | `--head` | `--head` | `--ink` |
| `--s-accent` | `--red` | `--teal` | `--coral` (marks and lines only, never text) |
| `--s-accent-2` | `--red` | `--green` | `--green` (marks only) |
| `--s-font-head` | `--font-c` 700 | `--font-a` 800 | `--font-b-head` 800 |
| `--s-font-body` | `--font-c` 400 | `--font-a` 400 | `--font-b-body` 400 |

Declare the look tokens as `--c-bg`, `--a-bg`, `--b-bg`... in `:root` if
you need them, and map them in `html[data-look="a"] { --s-bg: var(--a-bg) }`
style blocks; or map straight to the palette with `var()`. No literal colour
outside `:root`.

The **frame of the pictures** is what changes most:

- **C:** a print: 6px `--print` border, no radius, rotated -0.6deg (the
  second picture of a pair +0.6deg), no shadow.
- **A:** an editor window: radius 8px, 1px border `--line`, a 32px title bar
  in `--tray` with three 9px `--line` circles and the file name in
  `--font-mono` 12px `--text` (given per picture below); one soft shadow
  `0 24px 48px -16px var(--shadow)`.
- **B:** full-bleed: the pair runs edge to edge of the viewport inside its
  section (break out of the container with a grid, not `100vw`), no border,
  no radius, no shadow.

The **accent device** per look: C, the red strike and underline; A, a
teal caret `▍`-like block drawn in CSS (2px x 1em, `--s-accent`, blinking
once on enter) before each h2; B, a 3px diff line, `--s-accent` on top
half and `--s-accent-2` on the bottom half (a single element with a hard
two-stop linear-gradient is allowed for this line only), vertical between
the two burger pages and horizontal under each h2.

### The rebuild (on the `look` event)

Sections rebuild one after another, top to bottom, 140ms apart: each fades
and drops (opacity 1 -> 0, translateY 0 -> 10px, 220ms), the look attribute
is already set, then it rises back (opacity 0 -> 1, translateY 10px -> 0,
420ms, `cubic-bezier(.2, .7, .2, 1)`). Implement with a class per section
toggled by JS. Reduced motion: no animation, the change is instant.

### Sections (copy exact)

Container as in the floor. Section padding-block `clamp(72px, 10vw, 140px)`.
Every h2 left-aligned. Each section enters once on scroll (opacity and 16px
rise, 600ms), visible by default, `IntersectionObserver` with `threshold: 0`
and `rootMargin: "0px 0px -12% 0px"`.

**1. `#compare`: One prompt. Two pages.**
- h2: `One prompt. Two pages.`
- p: `Build a website for a burger restaurant. Left, an agent on its own. Right, the same agent with Off-Template.`
- Two figures side by side >= 760px (`minmax(0, 1fr) minmax(0, 1fr)`, gap
  24px), stacked below. Each image 1440x900, in the look's frame.
  - `img/normal-desktop.webp`, alt `Ember & Bun, made by an agent alone: cream page, a drawn burger, a red-orange headline, invented ratings and a scrolling banner`. Caption: `Agent alone: Ember & Bun`. A-look file name: `ember-and-bun.html`.
  - `img/super-desktop.webp`, alt `Order 27, made with Off-Template: butcher-paper page, a photo of a wrapped burger, the order number as the brand`. Caption: `With the skill: Order 27`. A-look file name: `order-27.html`.
- Captions 14px `--s-text`.

**2. `#flow`: Four stops.**
- h2: `Four stops. You decide each one.`
- An ordered list (a real sequence; numbers are fine), 2x2 grid >= 760px,
  one column below; each item: the number in `--s-accent` at h2 size, a
  20px title in `--s-head`, a sentence in `--s-text`. No boxes around items.
  1. `The brief.` `Four questions with options to click. The palette comes from a real object you name.`
  2. `Three directions.` `Grey skeletons and a coloured mockup each, after research on real sites in your niche.`
  3. `The decisions.` `Every choice in one block, before a line of code.`
  4. `The review.` `A lint at five widths, the 13 tells, and a reviewer that never saw the chat. You judge last.`

**3. `#lint`: the numbers.**
- h2: `Same checker. Both pages.`
- Two numbers side by side: `39` with the label `floor failures, agent alone`
  and `12` with `with the skill`. Numbers in `--s-font-head` at
  `clamp(4rem, 10vw, 8rem)`, `--s-head`; the 12 gets a 3px underline in
  `--s-accent`. They count up from 0 when the section enters (900ms,
  ease-out), final values in the HTML.
- p: `sloplint ships with the skill and ran on both burger pages. 11 of the 12 are colours written outside tokens, a rule added after Order 27 was built.`

**4. `#tells`: The 13 tells.**
- h2: `The 13 tells it checks for.`
- A list in two columns >= 760px, 22px `--s-head`, 12px row gap:
  `Purple or blue gradient`, `Default type`, `Grid background`,
  `Three generic benefit cards`, `Emoji in the copy`, `Glow on everything`,
  `The usual layout`, `Generic icons`, `Everything static`,
  `01 / 02 / 03 on a loose list`, `Hard shadows and boxes everywhere`,
  `Spec-sheet dressing`, `A default AI look`.
- Each item gets struck through by a 3px line in `--s-accent`
  (`::after`, `transform: scaleX(0 -> 1)`, origin left, 500ms), 60ms apart,
  when the list enters. Struck by default without JS.

**5. `#install`: Install.**
- h2: `Install it in your agent.`
- A list of rows, each: the agent name (16px `--s-head`, 160px column) and
  the command in `--font-mono` 14px on `--s-surface` (radius 6px in A and C,
  0 in B), with a Copy button as in the hero (same behaviour). Grid
  `minmax(0, 160px) minmax(0, 1fr)`, one column under 600px.
  - `Claude Code`: `npx skills add JouberthAlves/off-template -g -a claude-code`
  - `Codex`: `npx skills add JouberthAlves/off-template -a codex`
  - `Cursor`: `npx skills add JouberthAlves/off-template -a cursor`
  - `Windsurf`: `npx skills add JouberthAlves/off-template -a windsurf`
  - `GitHub Copilot`: `npx skills add JouberthAlves/off-template -a github-copilot`
  - `Claude Code plugin`: `/plugin install off-template --marketplace JouberthAlves/off-template`
- p under it: `Then ask for a site the way you always do. The skill stops at the brief and waits for you.`

**Footer** (`--s-bg`, 1px top border `--line` in A and C, `--ink-line` in B): the logo (same markup, `--s-head` text, red caret always),
`MIT licence`, a `GitHub` link, and the line
`This page was made with its own flow: a brief, research, three directions, and the one you picked above.`
14px `--s-text`.

### Part 2 checks

Same floor. At 375 px the burger pair stacks, the install rows stack, no
command scrolls the page. Reduced motion: no entrances, counts at final
values, strikes shown, rebuild instant.

## Final message

List: the files written, every place you could not follow this spec and
what you did instead, and the result of `node --check` on each JS file.

## Part 2b: fix round for the sections (after review)

The sections work but read like a docs page: every one is heading, paragraph,
empty right half, with ~250 px gaps, and the three looks change mostly colour.
Change only what is listed. Keep the hero, nav, `beam.js`, the look tokens,
the rebuild and the entrance logic.

1. **Rhythm.** Section padding-block `clamp(56px, 7vw, 104px)`. The first
   section starts 0 px after the hero (no extra margin).

2. **Merge `#lint` into `#compare`** (remove the `#lint` section; keep its
   paragraph). `#compare` becomes:
   - h2 `One prompt. Two pages.` and its paragraph, as now.
   - The two figures as now, and under each figure, in place of the caption:
     the number and its label on one line, baseline-aligned:
     under Ember & Bun: `39` + `floor failures. Agent alone: Ember & Bun`;
     under Order 27: `12` + `floor failures. With the skill: Order 27`.
     Numbers in `--s-font-head`, `clamp(3.5rem, 7vw, 6rem)`, `--s-head`,
     tabular; the count-up runs when the figures enter (same as before).
   - Under the pair, the lint paragraph (`sloplint ships with the skill...`).
   - Per look: **C** the two prints lie on one `--tray` panel (radius 6px,
     padding `clamp(16px, 3vw, 40px)`), the only panel in the section;
     **A** each number is a line of the editor below its window, in
     `--font-mono`: `// 39 floor failures` in `--coral` and
     `// 12 floor failures` in `--green` (large mono numbers in A are fine:
     it is the editor's material); **B** the numbers get diff signs:
     `− 39` with the sign in `--coral`, `+ 12` with the sign in `--green`
     (signs only coloured, numbers `--ink`).
   - No underline under the 12 in any look.

3. **`#flow`: four steps in one row** at >= 1100px
   (`repeat(4, minmax(0, 1fr))`), 2x2 at 760 to 1099, one column below. The
   number at `clamp(3rem, 6vw, 5rem)`. Per look: **C** no panels and no rules, the big numbers carry it; **A** each step is a line of a
   single editor window (the four steps as `1  The brief.` etc. inside one
   window with the file name `flow.md`); **B** each step separated by the
   3px diff line on its left (accent on top half, accent-2 bottom half).

4. **`#tells`:** strike colour `--s-text` in look C (no red at body size);
   keep `--s-accent` in A and B. In C the list sits on the right half of a
   two-column grid `minmax(0, 5fr) minmax(0, 7fr)`, with the h2 on the left
   (sticky `top: 96px` at >= 960px), so the half is not empty. Same layout
   in A and B.

5. **`#install`: one block, not six rows.** Reuse the hero's install
   component (tabs + command row + Copy) with six tabs: `Claude Code`,
   `Codex`, `Cursor`, `Windsurf`, `GitHub Copilot`, `Plugin` (the plugin
   command). Tabs wrap on phones. The same tab script must work for both
   tab lists independently. Per look: **C** the command row on `--tray`;
   **A** the command row inside an editor window (file name `terminal`);
   **B** the command row as an `--ink` bar with `--print` text. The
   paragraph under it stays.

6. Section count after this: hero, compare, flow, tells, install, footer.
   Update the nav anchor `#flow` (still valid) and nothing links `#lint`.

7. Floor as before; no hex/rgb outside `:root`; reduced motion and no-JS
   complete; no horizontal scroll at 375 to 1920.

## Part 3: smooth look switch, the B blend, more motion (owner's feedback)

Change only what is listed. Keep the hero, nav, `beam.js`, the look token
values, the copy and the layout.

1. **The switch must be smooth, not a jump.** Today the colours jump, the
   faces of looks A and B start downloading on the first click (the page
   stalls), and while a section fades the night body shows through.
   - **Preload the faces** of A and B on idle after load:
     `document.fonts.load('800 1em "Mona Sans"')`, `'400 1em "Mona Sans"'`,
     `'800 1em "Bricolage Grotesque"'`, `'400 1em "Instrument Sans"'`,
     `'600 1em "Instrument Sans"'`. The click waits for
     `document.fonts.ready` (max 400 ms) before the rebuild starts.
   - **Colours morph:** register every look token that is a colour with
     `@property` (`syntax: '<color>'; inherits: true; initial-value` from
     `:root` via the matching palette token is not possible in @property, so
     use the C value literally inside the @property blocks; these blocks are
     the only allowed literals outside `:root`, keep them right after
     `:root`). Give `.sec` and `.foot` `transition` on those custom
     properties: 700 ms, `var(--ease)`. Now changing `data-look` morphs
     background, text and accents.
   - **Replace the fade-out/fade-in** (`rb-out`/`rb-up`) with a soft
     develop, top to bottom, 110 ms apart: each section gets `rb` for
     520 ms: `filter: blur(6px)` and `opacity: .55` in the first 200 ms
     (masks the face swap), then back to `none`/`1`. `data-look` changes at
     the start, so the colours morph during it. Never `opacity: 0`, so the
     night body never shows through.
   - **A develop line:** while a section rebuilds, a 2px line in the NEW
     look's `--s-accent` sweeps from its top to its bottom (one absolutely
     placed `::after` per section, `transform: translateY()` from 0 to the
     section height via `scaleY` on a full-height element or a translate
     with `--h` set in JS; 520 ms, `var(--ease)`, opacity 0 at both ends).
   - Reduced motion: no blur, no line, colours change at once.

2. **Look B: no hard edge between the dark hero and the cream sections.**
   A soft blend at the top of the first section (`#compare`): a
   `::before`, absolute, top 0, full width (inside the section, not 100vw),
   height `clamp(140px, 16vw, 240px)`, `background: linear-gradient(var(--night), var(--s-bg))`,
   `pointer-events: none`, z-index under the content. Add the same height to
   `#compare`'s padding-top so the heading sits below the blend. In A and C
   `--s-bg` is night, so the blend is invisible; with the registered colours
   it morphs on the switch.

3. **More motion, on enter (once, `IntersectionObserver` as today, visible
   by default, all off under reduced motion):**
   - **Lines draw themselves:** every decorative line grows from 0:
     B's h2 underline and diff lines (`scaleX`/`scaleY` from 0, origin left
     or top, 700 ms, `var(--ease)`); C's strike on the tells as today; the
     hero tab underline as today.
   - **Numbers:** the 39 and the 12 count up from 0 (900 ms, ease-out) every
     time the section enters the first time and again after each look
     switch. The flow numbers 1 to 4 rise one after another (16px, 90 ms
     apart, 500 ms).
   - **Pictures arrive in the look's own way** when `#compare` enters and
     after each switch: C, each print drops onto the tray (from
     `translateY(-14px) rotate(-3deg)` and opacity 0 to its resting
     rotation, 600 ms, 120 ms apart); A, each window opens (`scale(.97)` and
     opacity 0 to 1, 450 ms); B, each page wipes in (`clip-path: inset(0 100% 0 0)`
     to `inset(0)`, 700 ms, `var(--ease)`).
   - **A, the editor types:** in `flow.md` the four lines appear one by
     one (opacity 0 to 1 plus a 6px slide, 120 ms apart); in `terminal` the
     command types itself once (24 ms per character) the first time it
     enters, the full text in the HTML (type over it by revealing, never by
     removing it).
   - **C, the install row:** the `>` blinks twice when the section enters.

4. Floor as before: tokens only (the @property blocks are the stated
   exception), only `transform`, `opacity`, `filter`, `clip-path` and the
   registered colours animate, no layout properties, complete with scripts
   off, no horizontal scroll 375 to 1920.

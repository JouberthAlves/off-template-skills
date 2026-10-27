# Techniques: effects and compositions that work

A toolbox, not a menu of styles. The direction comes from the brief and the
niche; this file gives **one signature effect** and **one composition** that
serve it, already solved. Taking a whole look (faces + palette + composition)
from a source is copying a style; taking a technique is adaptation.

Studied from the 48 themes of [hallmark](https://github.com/Nutlope/hallmark)
(MIT), read in their source and in the browser. Each technique names the theme
where it was seen, for reference only: write your own code.

## How to pick

1. Name the direction's **material** (the real-world object of the brief: a
   darkroom, butcher paper, a train board). Every effect below has to be
   something that material would do.
2. Pick **one signature effect** for the page. It plays once (or reacts to the
   visitor) and rests. The rest of the motion is quiet (`motion.md`).
3. Check the cost column against the page: a WebGL hero needs a real GPU and a
   mobile Lighthouse run; a CSS one doesn't.
4. Write the choice in the direction's motion line and in the stamp.

## Signature effects

| Effect | How | Fits | Cost |
|---|---|---|---|
| **Living mist or light** | WebGL fragment shader: simplex noise with domain warping at half resolution, colours mixed in linear RGB, the pointer's trail pushes it away; `IntersectionObserver` + `visibilitychange` pause it; a still frame for reduced motion (Atelier) | Premium brand hero: perfume, spa, hotel, a tech product | High: GPU, DPR 1, start on idle |
| **Window light** | Blurred, skewed light panels with a grid cut by `mask`, drifting 90 s `alternate` (Dose) | Light hero for health, home, breakfast | Low: CSS |
| **Slow Ken Burns** | The photo goes `scale(1.06) translate(-1%, .5%)` over 48 s (Dusk) | Hero with a landscape photo | Low |
| **Rain or wind on canvas** | `Path2D` per depth layer, drops that catch the city's light, sine lines with a gradient, tied to a control the visitor moves (Ribbon) | Night hero, sound or wellness app | Medium: canvas loop, pause off-screen |
| **An image made of characters** | Photo → grid of 9 tone levels → a character from the client's own text per cell; canvas with a glyph atlas; resolves line by line, lights up under the cursor; a `<pre>` fallback without JS (Terminal, Cobalt) | Tech, dev events, a portrait "written" in words | Medium |
| **A generated map** | Marching squares over seeded noise, in layers; a loupe is a small canvas moved by `transform` that redraws zoomed in (Furrow) | Land, farm, condo, trail | Medium |
| **A story that plays once** | Web Animations API (`el.animate`) with chained delays, the business's own documents moving through the service; starts after `document.fonts.ready`, pauses off-screen (Coral) | Showing the service happen: an invoice paid, an order out | Low to medium |
| **A theme switch that grows from the click** | `document.startViewTransition(update)`; `::view-transition-new(root)` animates `clip-path` from the clicked control. Plain: a CSS `circle()` keyframe whose centre and radius come from custom properties set in JS (the radius is the distance to the farthest corner). Liquid rim: `polygon()` keyframes built in JS (96 points, `r·(1 + amp·Σ sin(kθ + ωt))`, ripples strongest mid-way, gone at the end), run with `document.documentElement.animate(..., { pseudoElement: '::view-transition-new(root)' })`. Spiral: an Archimedean band `r = a·θ` traced out and back as one polygon, thickening until its turns merge, with one turn below θ = 0 to fill the centre. Every keyframe has the same point count. Reduced motion or no View Transitions: swap at once (super-webdesigner site) | A light/dark or look switch; a page whose theme is part of the show | Low: one screenshot of the old page, a ~1 s clip |
| **A real stamp** | SVG filter: `feTurbulence` + `feOffset` + `feComposite` give a pressure wall and patchy ink; enters at scale 1.14 → 1 (Coral) | "Paid", "approved", "delivered" | Low |

## Smaller effects

| Effect | How | Fits |
|---|---|---|
| **Cheap scrollytelling** | The visual `position: sticky`; an `IntersectionObserver` with `rootMargin: -45% 0px -45% 0px` marks the panel in the middle of the screen (Coral) | Step by step, "how it works" |
| **A title that changes colour across a block** | Two stacked copies, each cut with `clip-path: inset()` at the line (Grid) | Hero split between a photo and a colour |
| **Title reveal** | `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`, once (Manifesto) | Campaign, launch |
| **An underline that draws** | `::after` with `scaleX(0 → 1)` from the left (Lumen); guide lines with staggered delays (Studio) | The key word of the hero |
| **Lines that fill the column** | Each line is a non-wrapping element sized in `cqi` (Broadside, Manifesto) | Event poster, a date |
| **A variable-font axis** | `font-stretch` (Midnight, Overprint) or `font-variation-settings: "wdth" 75` (Editorial) | A second voice without a second family |
| **RGB split** | `text-shadow: -1.5px 0 <red>, 1.5px 0 <cyan>`, no blur, one line per screen (Arcade) | Party, game, nightlife title |
| **Overprint** | Colour fields with `mix-blend-mode: multiply` make a third colour (Overprint, Riso) | Two brand colours |
| **A word out of register** | `::after` with `content: attr(data-text)` offset 2-3 px behind (Riso) | One word per page |
| **Fading halftone** | `radial-gradient` in a grid + a linear `mask` (Halftone, Carnival) | The passage between two colour areas |
| **State in one frame** | `transition: none` or `steps(1)`: the row lights like a menu cursor (Brutal, Wayfind, Arcade) | Panels, tables, signage, technical sites |
| **Physical buttons** | Key: a solid bottom border that disappears on press (Cobalt, Dose, Hum). Press: a hard shadow that disappears (Arcade, Paste-up) | Only when the direction's voice is that object; see the hard-shadow tell |
| **Choice without JS** | `.option:has(:checked)` changes fill and ring (Squeeze) | Plan, size, date picker |
| **Smoked glass** | `backdrop-filter: blur(22px) saturate(1.35)` + a light inner edge + a long soft shadow; never glass on glass (Dusk) | A panel over a photo |
| **Light CSS 3D** | Faces with `rotateX(-90deg)`, colours derived with `oklch(from var(--t) ...)` (Dose) | A box, a package, a simple product |

## Surfaces without images

| Surface | How |
|---|---|
| **Grain** | SVG `feTurbulence` with high `baseFrequency` in a data URI, over the ground at low opacity (Darkroom) |
| **Long paper fibre** | `feTurbulence` with low, anisotropic frequency (`0.004 0.02`) (Vellum, Paste-up) |
| **Torn edge** | `clip-path: polygon()` generated from noise once and stored in a CSS variable, with a light twin 1 px below (Hum) |
| **Perforated edge** | `mask` with a repeated `radial-gradient` on the edge (Dose) |
| **Crop marks and corners** | 1 px strokes as gradient `background` on a `::before` (Studio); 12 px L-corners on opposite corners (Rim) |
| **One border between tiles** | A grid with `gap: 1px` over a ground the colour of the line (Console), or a negative margin equal to the border (Brutal) |

## Compositions

Options for the three skeletons (`skeletons.md`), so they differ in more than
colour:

- **The real product on the right**: the split hero with the actual product,
  document or panel, never an illustration. The strongest pattern in the set.
- **The hero opens with the proof**: a diagram, samples, a satellite photo
  with data, the title below it.
- **A solid block over a bleeding photo** holding the title and the action.
- **One giant number is the whole section**, with one line on what it means.
- **Three or four numbers between vertical rules.**
- **A table as the centrepiece** instead of cards (prices, tides, schedules,
  materials).
- **A form inside a colour field** with a live summary beside it.
- **A thin notice bar on top** with a real fact (today's hours, the next date).

## Rules that make them look good

- **One material.** Faces, palette, photos and motion all answer to the
  direction's real-world object. An effect the material would not do is out.
- **Two colour bands per page at most**, and the accent under 5 % of the
  screen. Each colour has one job (action, state, the person against the
  machine) and keeps it.
- **One treatment for every photo**, written as a rule in the direction:
  black and white, duotone, tinted or natural.
- **One section only this material could make** (a tide table, a generated
  map, a type specimen), so the page doesn't read as stock photos.
- **Motion declared in one to three lines**: what moves, how long, the curve,
  and the still state it ends in.
- **A tell kept on purpose is declared** as a waiver with its reason, as the
  themes do when they break a rule.

# Motion

A page where nothing moves looks like a mockup. A page where everything moves
looks generated. Motion is planned with the person, in the direction, like the
palette: not added at the end, and not decided by the agent alone.

## Ask first

At STOP 0, with the brief, ask for the **motion reference** and the
**intensity**, with options to click:

- Reference: an app, a site or a video whose movement the person likes ("the
  Apple product pages", "Stripe", "the Airbnb app", "a slow-motion cooking
  video", "you suggest three").
- Intensity: calm (a few soft entrances) / lively (a live hero and responsive
  details) / a show (scroll scenes, the page as an experience).

The answer goes into every direction's motion line.

## What every interface gets

- **One live element in the first screen.** The best one is the product's
  number-one argument made touchable: a slider that changes the view from the
  apartment hour by hour, a before/after to drag, the dish of the day that
  changes with the weekday. One orchestrated moment beats scattered effects.
- **Entrances on scroll**, short and in order, from a visible resting state.
- **Response to touch**: hover and press on buttons and cards, a focus state.
- **Confirmation**: a sent form, an added item and a copied link each get a
  visible answer (a check that draws, a short message).
- **Apps and prototypes**: transitions between screens (a short slide or
  fade), lists entering in a cascade, a button that shrinks a little on press.

The motion feel matches the direction's visual language (`visual-language.md`):
slow and soft for a warm place, quick and crisp for a technical one.

## Rules

- Short: 150 to 600 ms for interface feedback; longer only for the hero
  moment.
- Animate only `transform` and `opacity` (and `clip-path` for reveals).
- Everything off with `prefers-reduced-motion: reduce`, and the page still
  complete: every text visible, nothing waiting at `opacity: 0`.
- The page is complete at rest: if JavaScript fails or the observer never
  fires, the content still shows. Add a timeout as a safety net for reveals.
- Decorative motion that loops forever (floating, slow drifts): only after
  checking GPU acceleration; without it the browser steps 1 px at a time and
  it looks broken. Test with Chrome's `--disable-gpu`.
- No fake data animating (a countdown, a temperature, a status bar) just to
  have something moving. See "Spec-sheet dressing" in `anti-patterns.md`.

## Building it right

- **Library first.** GSAP (with ScrollTrigger) or Motion, through their skills
  or docs (`tool-slots.md`). Look the API up before using it.
- **Position on a wrapper, animation on the inner element.** Libraries replace
  the CSS transform of the element they animate; a `translate` set in CSS on
  the same element gets dropped.
- **Text color inherited** inside animated parts, checked on a dark background.
- **Hidden items** with `display:none` (or GSAP's `autoAlpha`), not only
  opacity.
- **Loops** built with `set` / `fromTo` and explicit values. `from` inside a
  repeating timeline loses its state on the second pass. Compare the 1st and
  3rd loop.
- **Reveals with clip-path:** the visible state is `clip-path: inset(0 0 0 0)`,
  never `none` (there's no interpolation to `none`, the element pops in).
- **IntersectionObserver on clipped elements:** `threshold: 0` (and a
  `rootMargin` for delay). A higher threshold on an element that starts fully
  clipped never fires.
- **A line that draws itself** (SVG `pathLength` + `stroke-dasharray`): no
  `vector-effect: non-scaling-stroke` on a stretched SVG, or it stops halfway.
  Check at 1900 px wide.
- **Handwriting revealed with clip-path or inside `overflow:hidden`:** generous
  `line-height` and vertical padding, or the tops of the letters get cut.
- **Motion on media controlled by scroll on phones:** an image sequence on a
  canvas, not a scrubbed video; ask for a test on a real iPhone.

## Check

Scroll the whole page and use it, at desktop and 390 px. Is every planned
motion built? With reduced motion on, does everything still show? Does any
part move without a reason?

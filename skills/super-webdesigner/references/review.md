# Review before delivery

Test the worst case, not the happy path. A field that works with "John" and
breaks with 600 pasted characters was not tested. Run everything that applies,
then report what passed, what failed and what you couldn't test.

## 1. Anti-patterns on the screenshot

Screenshot the **whole page**, not just the first screen, at desktop
(1440 px) and 390 px: scroll to the bottom once so lazy content loads, then
take full-page captures. Most tells (three cards, testimonials, emoji in a
list, the section order) sit below the fold. Run `anti-patterns.md` plus the
niche list on them and on the source. Three or more present: back to the
brief.

In the source, count the cheap signs: how many `box-shadow` with no blur, how
many borders, how many elements in a monospace face, how many numbers on the
page the visitor doesn't use. A dozen hard shadows is a style the direction
never chose.

## 1b. Does it look like the business?

- **3-second test:** first screen only, at 390 px. Would a customer of this
  niche know what the business is, and want it?
- **Fit test:** read the direction's visual language next to the page. Are the
  edges, shadows, lines, surfaces, type and motion the ones the direction
  wrote, and do they match the feeling? Do the main photo and the frame
  around it tell the same story?
- **Keep list:** is everything visitors expect on the page?

Any of the three failing goes back to the direction before polishing details.

## 1c. Motion

Scroll the page and use it (`motion.md`, "Check"). Is the live element in the
hero there? Do sections enter, do buttons and cards respond, do actions
confirm? Is the direction's motion all built? With reduced motion on, does
everything still show up? A page where nothing moves fails this step.

## 1d. Score honestly

Score only the 13 tells in `anti-patterns.md` (plus the niche list, scored
separately). Anything else you notice goes under "also found", never into
the number. Show the screenshots to the person at STOP 2: your score is
input, not the verdict.

## 1e. Detector on the rendered page

If the person said yes to it in the tool discovery, run Impeccable's deterministic
detector (Apache-2.0, no LLM, no API key) on the **served** page, at both
widths:

```bash
DO_NOT_TRACK=1 npx impeccable detect --json --viewport 1440x900 http://localhost:PORT/
DO_NOT_TRACK=1 npx impeccable detect --json --viewport 390x844 http://localhost:PORT/
```

- **Always the URL, never the file.** On the HTML file it can't place absolute
  layers or resolve `clamp()`, and more than half of its findings were false
  (text on a light card read as text on the black frame under it).
- **Only `detect`.** Not `install`, `init` or its hooks: they bring its own
  brief and direction flow, which clash with this one.
- **It needs Chrome or Chromium.** If none is found, point
  `IMPECCABLE_BROWSER` at one. Running as root in a container, it needs a
  small wrapper that adds `--no-sandbox`.
- **A script error from a blocked CDN** is the environment, not the page:
  serve the library locally and scan again before reporting it.
- **Fix the mechanical findings** (contrast, undersized text, a single word
  on a paragraph's last line). **Taste findings** (a kicker above a heading,
  palette, type) only count when they are one of the 13 tells or the
  direction didn't choose them. They go under "also found", never into the
  score.
- It doesn't replace the screenshots: it misses overlaps and anything the
  direction got wrong. Report what it found and what you fixed.

## 2. Design critique

Claude Code: run `design:design-critique` on the screenshots, giving it the
direction's feeling and visual language as context, and fix what it points
out. Other agents: any critique skill they have, or go through
hierarchy, spacing rhythm, contrast and consistency by hand. List in the
delivery what you chose not to fix and why.

## 3. Phones and widths

- 375, 768 and 1440 px. No horizontal scroll at any width:
  `document.documentElement.scrollWidth > innerWidth` must be `false`. In
  Chromium emulation, turn on mobile emulation (`isMobile`), or the overflow
  hides.
- Wide display fonts: size the title by its column (`cqi` units) so one long
  word can't push past it.
- Touch targets at least 44×44 px.
- iOS Safari isn't fully covered by emulation (video, scroll, `100vh`): ask
  for a test on a real device when there's motion or media.

## 4. Forms

Every field gets real handling, not just a placeholder: phone mask, date with
`type="date"` (no past dates for bookings), number fields that refuse letters
on typing and on paste, `maxLength` on text (and a counter on textareas),
labels tied to inputs, a disabled button while sending. The same limits are
validated on the server. A choice made before a WhatsApp or email button has
to end up in the message that's sent.

## 5. Performance

Lighthouse or PageSpeed on mobile. Good: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
Images in WebP/AVIF with `width`/`height`; the hero image prioritized, the rest
`loading="lazy"`. WebGL or shader backgrounds: only with a real GPU, DPR 1,
start on idle, freeze on weak devices. Slow continuous CSS motion: enable only
after confirming GPU acceleration (test with `--disable-gpu`), or it stutters
pixel by pixel.

## 6. Accessibility

WCAG 2.2 AA: text contrast ≥ 4.5:1 (large ≥ 3:1), full keyboard navigation
with visible focus, `alt` on every image (`alt=""` if decorative),
`aria-label` on icon-only buttons, `prefers-reduced-motion` respected.

## 7. SEO and sharing

Content in the HTML (not "Loading..."). Unique `<title>` and description per
page, one `<h1>`, Open Graph image on every page, `robots.txt` and
`sitemap.xml`. On multi-page sites, set these per page, never in the shared
layout.

## 8. Animated components

Run "Building it right" in `motion.md` on every animated part: wrapper and
inner element, inherited text color, hidden items, loops compared on the 1st
and 3rd pass, clip-path reveals, observers. Check on a dark background and
with reduced motion.

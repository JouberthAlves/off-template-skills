# Review before delivery

Test the worst case, not the happy path. A field that works with "John" and
breaks with 600 pasted characters was not tested. Run everything that applies,
then report what passed, what failed and what you couldn't test.

## 1. Anti-patterns on the screenshot

Screenshot the main screens at desktop (1440 px) and 390 px. Run
`anti-patterns.md` plus the niche list on them. Three or more present: back to
the brief.

## 2. Design critique

Claude Code: run `design:design-critique` on the screenshots and fix what it
points out. Other agents: any critique skill they have, or go through
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

Position on a wrapper, animation on the inner element. Text color inherited.
Hidden items with `display:none` (or `autoAlpha`), not just opacity. Loops
built with `set` / `fromTo` and explicit values (`from` inside a repeating
timeline loses state on the second pass). Compare the 1st and 3rd loop. Check
on a dark background and with reduced motion.

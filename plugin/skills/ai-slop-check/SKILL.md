---
name: ai-slop-check
description: Audit an existing website, page, screenshot or mockup for the tells of AI-generated design (purple-blue gradients, default fonts like serif italic titles or Inter and Space Grotesk, grid backgrounds, three generic benefit cards, emoji in copy, glow everywhere, the usual hero-cards-testimonials-FAQ layout, thin generic icons, no motion, fake 01/02/03 numbering, hard neo-brutalist shadows and black outlines, monospace spec-sheet dressing with fake data, and the default looks like cream with terracotta or the newspaper broadsheet) and check that the look still fits the business. Says what to change. Use when someone asks "does this look AI-made?", "why does my site look generic?", "review this landing page design", or shares a URL or screenshot of a page for design feedback.
---

# ai-slop-check

A quick audit against the 13 tells of a page an agent designed alone, plus two
checks that the look still fits the business. It doesn't redesign anything: it
says what's there and what to do instead.

Written for Claude Code; in other agents, use any browser or screenshot tool
they have, or ask the person for screenshots.

Motion (tell 9) doesn't show in a screenshot. Read the source for GSAP,
transitions and keyframes, and say what moves. If the person wants to see it,
offer a short video of the page: HyperFrames renders it from the HTML (see
`super-webdesigner/references/tool-slots.md`), and only on a yes.

## Steps

1. **Get the whole page, not just the first screen.** Most tells live below
   the fold: the three cards, the testimonials, the FAQ, emoji in a menu, the
   section order. A first-screen screenshot alone will score a generic page
   as fine.
   - **URL:** open it in a browser you can drive (Claude Code: built-in
     browser or Claude in Chrome; others: Playwright MCP). Scroll to the
     bottom once so lazy content loads, then take a full-page screenshot at
     1440 px and at 390 px, plus the first screen at both sizes. Read the
     page text too (emoji and numbering are easier to catch in text).
   - **Source files:** read the HTML/CSS/JS (or the components) as well as
     any screenshots. Count the cheap signs: `box-shadow` with no blur,
     borders, elements set in a monospace face, the font families loaded.
   - **Only a first-screen screenshot or a single image:** don't score yet.
     Ask for the URL, a full-page screenshot or the source. If the person
     can't give more, score what you have and say plainly that everything
     below the fold was not checked.
2. **Check each item** in the table below. For each: **absent**, **present**,
   **present on purpose** (only if the brand clearly calls for it, and say
   why), or **not visible** (the part of the page where it would show wasn't
   in what you checked). Never mark "absent" what you couldn't see.
3. **Score.** Count the items present, only from the 13 in the table:
   anything else you notice (invented reviews, broken layout) goes under
   "also found", not into the score. 0-1: fine. 2: watch it. **3 or more:
   it reads as AI-made.** If some items were not visible, report "N present
   out of M visible" and say the verdict is partial. Changing colors won't fix it; the direction needs
   rethinking (the `super-webdesigner` skill does that).
4. **Fit checks** (reported apart from the score):
   - **3 seconds:** from the first screen alone, would a customer of this
     niche know what the business is, and want it?
   - **Fit:** do the page's materials (edges, shadows, lines, texture, type,
     motion) match the feeling the business should give? A warm, hand-made
     business inside a cold, technical frame fails, even with a low score.
     The full method is `super-webdesigner/references/visual-language.md`.
5. **Report** in this shape, short:

```
Checked: <full page at 1440 and 390 / source / first screen only>
Score: N present out of M visible -> <fine / watch it / reads as AI-made> (partial if M < 13)
Fit: 3 seconds <pass/fail: why> · materials <pass/fail: why>

Present
- <pattern>: <where on the page> -> <the concrete fix for this page>

Absent
- <pattern>, <pattern>, ...

Not visible
- <pattern>, ... (what to send so they can be checked)

Also found (not scored)
- <anything off the list>

Biggest win: <the one change that would move the page the most>
```

Fixes must be specific to the page ("swap the three icon cards for one large
photo of the burger with the price, and two smaller lines"), not the generic
"instead" column copied back.

## The 13 tells

| Pattern | How to spot it | Instead |
|---|---|---|
| Purple or blue gradient | Background, buttons or headings fading violet→blue (or close) | A color from a real-world reference of the brand; flat color |
| Default type | Serif, often italic, on the hero title with no brand reason; or Inter, Space Grotesk, Plus Jakarta Sans, DM Sans, Roboto as the faces | A face with a reason from the brand: sans with character, display, condensed, lettering |
| Grid background | Squares, dots or lines filling empty background | Texture, photo, flat color, deliberate space |
| 3 generic benefit cards | Icon + title + two lines, three times in a row | Benefit inside proof; asymmetric list; one big, rest small |
| Emoji in the copy | Emoji in headings, bullets or buttons | None; the page's own icons if needed |
| Glow on everything | Glowing text, buttons and borders at once | Contrast of color and size; one effect, one element |
| The usual layout | Centered hero → 3 cards → testimonials → FAQ → CTA | Break the order or the composition |
| Generic icons | Thin-line Lucide/Feather everywhere | Custom icons, cut-out photos, Phosphor/Solar with a chosen weight |
| Everything static | No motion at all, or only a fade on load | One purposeful live element; scroll and hover feedback |
| Fake numbering | 01/02/03 on items with no order | Number only real steps |
| Hard shadows and boxes everywhere | Offset shadows with no blur, thick black outlines, square corners on every block, buttons that press into their shadow (neo-brutalism) | Edges and depth from the brand's real materials; a border or shadow only on the one element that must stand apart |
| Spec-sheet dressing | Monospace in nav, buttons and labels; lot numbers, temperatures, coordinates, barcodes, live-status bars, countdowns nobody uses | Only data the visitor acts on, in the page's text face; mono only for real code or tables |
| A default AI look | Warm cream + terracotta accent (often with a serif); near-black + one acid-green or vermilion pop; the newspaper broadsheet (hairlines, dense columns, dateline); receipts, tickets, stamps and thermal labels as the concept | A look that comes from the business's own real objects and feeling |

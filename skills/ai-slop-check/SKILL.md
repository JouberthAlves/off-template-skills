---
name: ai-slop-check
description: Audit an existing website, page, screenshot or mockup for the tells of AI-generated design (purple-blue gradients, default serif titles, grid backgrounds, three generic benefit cards, emoji in copy, glow everywhere, the usual hero-cards-testimonials-FAQ layout, thin generic icons, no motion, fake 01/02/03 numbering) and say what to change. Use when someone asks "does this look AI-made?", "why does my site look generic?", "review this landing page design", or shares a URL or screenshot of a page for design feedback.
---

# ai-slop-check

A quick audit against the 10 tells of a page an agent designed alone. It
doesn't redesign anything: it says what's there and what to do instead.

Written for Claude Code; in other agents, use any browser or screenshot tool
they have, or ask the person for screenshots.

## Steps

1. **Get the page.** URL: open it in a browser you can drive (Claude Code:
   built-in browser or Claude in Chrome; others: Playwright MCP) and
   screenshot the first screen at 1440 px and 390 px, plus one full-page
   screenshot. Screenshot or image: use it as is. Also read the page text
   (emoji and numbering are easier to catch in text).
2. **Check each item** in the table below. For each: **absent**, **present**,
   or **present on purpose** (only if the brand clearly calls for it, and say
   why).
3. **Score.** Count the items present. 0-1: fine. 2: watch it. **3 or more:
   it reads as AI-made.** Changing colors won't fix it; the direction needs
   rethinking (the `super-designer` skill does that).
4. **Report** in this shape, short:

```
Score: N/10 present -> <fine / watch it / reads as AI-made>

Present
- <pattern>: <where on the page> -> <the concrete fix for this page>

Absent
- <pattern>, <pattern>, ...

Biggest win: <the one change that would move the page the most>
```

Fixes must be specific to the page ("swap the three icon cards for one large
photo of the burger with the price, and two smaller lines"), not the generic
"instead" column copied back.

## The 10 tells

| Pattern | How to spot it | Instead |
|---|---|---|
| Purple or blue gradient | Background, buttons or headings fading violet→blue (or close) | A color from a real-world reference of the brand; flat color |
| Serif title by default | Serif, often italic, on the hero title with no brand reason | Sans with character, display, condensed, mono, lettering |
| Grid background | Squares, dots or lines filling empty background | Texture, photo, flat color, deliberate space |
| 3 generic benefit cards | Icon + title + two lines, three times in a row | Benefit inside proof; asymmetric list; one big, rest small |
| Emoji in the copy | Emoji in headings, bullets or buttons | None; the page's own icons if needed |
| Glow on everything | Glowing text, buttons and borders at once | Contrast of color and size; one effect, one element |
| The usual layout | Centered hero → 3 cards → testimonials → FAQ → CTA | Break the order or the composition |
| Generic icons | Thin-line Lucide/Feather everywhere | Custom icons, cut-out photos, Phosphor/Solar with a chosen weight |
| Everything static | No motion at all, or only a fade on load | One purposeful live element; scroll and hover feedback |
| Fake numbering | 01/02/03 on items with no order | Number only real steps |

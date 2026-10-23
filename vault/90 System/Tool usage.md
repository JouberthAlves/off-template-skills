---
type: system
---

# Tool usage

Rules per tool: cost, limits, gotchas. Each tool gets a section. Read the
section **before** using the tool. Add a section the first time you use a new
paid or media tool.

## Which tool for which media

Fill in with your own choices. Starting point:

| Media | Tool |
|---|---|
| Gray skeletons | Claude Artifact (or a local HTML file) |
| Colored mockups, photos for the page | An image model good at legible text (ChatGPT image generation, a GPT-image model through an MCP) |
| Video made from HTML (page scrolling, title card) | HyperFrames |
| Animation on the site | GSAP (skills by GreenSock) |

The full list of jobs and alternatives is in `skills/super-webdesigner/references/tool-slots.md`
in the super-webdesigner repo.

## Any credit-based tool

**Always say how much a generation will cost before generating.**

1. Estimate the cost (most tools have a cost or simulate call).
2. Read the current balance.
3. Say: **"This will cost X credits out of Y (Z left)."** For a batch, the
   total and the per item.

Why: the credits belong to the person and don't come back. They decide if it's
worth it, and they can only decide knowing the price.

## Image models for mockups

- Describe in the prompt what every item is. Models take a loose word
  literally ("Anatomy" turned into a human body).
- They invent sample content (names, ratings, logos that look like real
  brands): give the exact text and say "nothing else".
- Check the niche objects first (the right grill, chair, tool), then light and
  composition.

## HyperFrames

Turns HTML + CSS + GSAP into MP4, frame by frame. Open source by HeyGen, free.
**It doesn't generate images or footage**: it animates what's in the HTML.

- Telemetry is on by default: `npx hyperframes telemetry disable`.
- Before rendering: `npx hyperframes lint` and `npx hyperframes snapshot --at 1,3`.
- Render needs FFmpeg; without it, `render --docker` (large image, slow the first time).
- Google Fonts without `@font-face` fall back to another font in the render: embed the `.woff2`.
- GSAP timeline with `paused: true`, registered in `window.__timelines["<id>"]`.

## Context7

Up-to-date library docs inside the agent. Use before claiming how a library
works and when looking for shadcn or React Bits components. Check the free
tier's monthly call limit and prefer one good query over several loose ones.

## Impeccable detector

Mechanical design check (contrast, text size, a lone word on a paragraph's
last line), deterministic: no LLM, no API key. Apache-2.0. Downloads its
engine on the first run, so ask before using it.

- **Only `detect`:** `DO_NOT_TRACK=1 npx impeccable detect --json --viewport 390x844 <url>`
  (and `1440x900`). Never `install`, `init` or its hooks: they bring their own
  brief and direction flow.
- **Scan the served page, never the HTML file.** On the file it can't place
  absolute layers or resolve `clamp()`: in the first test, 12 of its 22
  findings were false.
- Needs Chrome or Chromium; point `IMPECCABLE_BROWSER` at one. As root in a
  container, wrap it with `--no-sandbox`.
- A script error from a blocked CDN is the environment, not the page: serve
  the library locally and scan again.
- Taste findings (a kicker above a heading, palette, type) go under "also
  found", never into the score.
- It misses overlaps and anything about the direction: it doesn't replace the
  screenshots.

Full rules: `skills/super-webdesigner/references/review.md`, step 1e, in the
super-webdesigner repo.

See also: [[Capabilities]] · [[Agent rules]]

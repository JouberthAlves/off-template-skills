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

The full list of jobs and alternatives is in `skills/off-template/references/tool-slots.md`
in the off-template repo.

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

See also: [[Capabilities]] · [[Agent rules]]

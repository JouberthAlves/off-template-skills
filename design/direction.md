# Chosen direction (2026-10-26)

**Base:** direction C, "Darkroom Develop": the editor at night meets a
photographer's darkroom. A page develops in a tray under a red safelight, from
grey skeleton to coloured mockup to finished page, which is the skill's own
flow.

**Changes the owner asked for:**
- **A red beam from above.** A safelight hangs above the hero; its beam comes
  down and lights what it touches (the headline letters, the tray, the print)
  as it moves. Inspired by React Bits' Light Rays (volumetric rays from an
  edge, haze, the cursor steering the beam), never copied: our own shader and
  our own lighting of the elements.
- **An agent window with three prompts that build the rest of this site.**
  The visitor plays the person at STOP 1: the window shows the three
  directions the skill made for this very page (Editor at Night, The Output
  Leads, Darkroom Develop) as three prompts. The visitor picks one, the agent
  types it, and every section below the hero builds itself in that direction:
  palette, faces, surfaces and motion change; the content stays the same. The
  hero stays the darkroom. Default, and with scripts off: Darkroom Develop.
- **The current logo stays:** "Off‸Template", white wordmark with the
  red proofreader's caret (`#E5231B`). Its red becomes the safelight's red.

**First screen:** logo top left, nav and "GitHub" top right. Left: the
headline on three lines, one sentence, the install command with agent tabs.
Right: the tray, lit from above, with the print in it; a small agent window
sits on the tray's top-left edge with the three prompts. Phone: logo,
headline, agent window, tray, command.

**Wildcard element:** the agent window. Picking a prompt is the visitor
choosing a direction, as the person does at STOP 1; the rest of the page
builds itself in front of them.

**Palette** (ground from the editor at night, `design/research.md`; red from
the logo): `#141818` night (ground) · `#1c2120` tray (surfaces) · `#E5231B`
safelight red (the only accent: the beam, the caret, focus, the action) ·
`#f4f4f4` headline · `#acb0bc` text · `#fcf8f4` print white (the print's
border). Red text only at large sizes (3.8:1 on night); the button is white
text on red would be 4.2:1, so the action is the command itself, with a text Copy link.

**The three looks below the hero** (one set of tokens each, swapped by the
choice): Darkroom Develop as above; Editor at Night (`#141818`, teal
`#6cb4bc`, green `#a0c080`, coral `#d07074`, Mona Sans, editor windows, a
flowing ribbon); The Output Leads (`#fcf8f4` page, `#141818` ink, diff green
and coral, Bricolage Grotesque, full-bleed pages, a diff line sweep). Palettes
and faces are the ones in the skeletons and mockups; the caret stays red in
all three.

**Fonts:** Familjen Grotesk 700 (titles) and 400 (text). Commit Mono only for
the command and inside the agent window. Both OFL, self-hosted.

**Visual language:**
- Edges: square prints with a thin white border; the tray rounded 6 px; the
  agent window 8 px. Nothing else rounded.
- Depth: light, not shadows. The beam lights the top of things and leaves the
  rest in the dark; the print sits under a film of liquid.
- Lines: none.
- Surface: dark tray, wet print, haze in the beam.
- Type voice: quiet, patient, then the reveal.
- Motion feel: slow develop, a living beam (lively, Stripe as the reference).

**Imagery:** no tray (the CSS one read as a grey card, the Magnific photo did not match): the print sits behind the agent window, in depth, dimmed and slightly out of focus, and comes into focus while a direction develops, on hover and on keyboard focus. Elsewhere, the real pages and files from `examples/`: skeletons, mockups,
final pages and the other agent's page for the same prompt. The pages the
image model invented in the mockups never ship.

**Logo and favicon:** the current ones, unchanged: the wordmark with the red
caret, and the red caret favicon.

**The beam** (the owner picked React Bits' **Light Pillar** as the reference; inspiration only, no code taken): a tilted column of red light, leaning from above the headline down onto the tray (22°), with a soft body, a wide bloom and three silk strands that twist and flow down it. Red from the logo at the top, a lighter red (`--pillar-low`, the red mixed with the headline white) toward the bottom, white where the strands are brightest. It sways slowly, leans and shifts toward the pointer, and a click sends a pulse of light down it. Where it crosses, the elements catch it: the headline letters warm toward white with a red glow, the tray and the print get a red light from above. No purple.

**Motion (required):** lively, Stripe as the reference.
- The pillar: fades in on load, sways slowly, leans toward the pointer,
  pulses on click, and lights the letters and the tray as it passes (light
  added over the elements with a blend, never gradient text).
- Picking a prompt: the agent types it, the print in the tray develops into
  that direction's mockup with a ripple, and the new look grows over the
  whole page from the picked prompt as a circle with a liquid rim (View Transitions, ~1.1 s).
  Without View Transitions the sections rebuild one after another, top to
  bottom.
- Below: the lint numbers count up; sections enter once.
- Reduced motion: the beam stands still, the print shows the page, no ripple,
  the swap is instant, every text visible.

**Sections (8):** hero (the darkroom, the agent window) · same prompt, two
pages (the burger: the other agent against the flow) · the flow, four stops ·
the lint (39 FAIL against 12) · the 13 tells · install, per agent · the vault
(the Obsidian logo in red characters spelled with the starter vault's note names, after the
hallmark Terminal theme's glyph image: resolves row by row once, lights under the pointer;
install Obsidian, say yes when the skill offers it) · footer.
Everything below the hero comes in the chosen look.

**Keep list from the research:** the install command copyable on the first
screen, the agents named beside it, the product working early, GitHub in the
nav, a plain headline, a dark editor-like ground.

**Avoid list for this project:** the 13 tells + black with a glow behind a
centred headline, Inter and Geist, bento grids, tracked mono labels, a logo
wall.

**Language:** English.

**Licenses to respect:** React Bits is inspiration only, no code taken.
Fonts OFL.

**Waivers:**
- Brushed red metal on the four flow numbers in look C (background-clip: text with a fine brushed texture), asked for by the owner as the pillar's light on the numbers.
- `mono-labels`: the A, B and C options live inside the agent's terminal window, where mono is the material, not a costume.

**Stamp:** `/* off-template · direction C "darkroom develop" + safelight beam + agent window that picks the look below · job: copy the install command · faces: Familjen Grotesk / Commit Mono · palette: night, tray, logo red, print white · motion: lively, the beam lights the hero, prints develop · waivers: mono-labels */`

Reference mockups: `design/mockup-c-darkroom-develop.webp` (layout and
light), `design/mockup-a-editor-at-night.webp` (the agent window).

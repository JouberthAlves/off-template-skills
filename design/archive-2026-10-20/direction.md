# Chosen direction (2026-10-20)

**Base:** direction A, "Red Pencil Proof": the page is a print proof on the
art director's desk, and the red pencil is already working on the other
agents' page. Collision: press proof (crop marks, color bar, proof slug) ×
museum wall label (calm, exact captions next to the work).

**Changes the owner asked for:** none on the layout. Brief answers above
replace the agent's draft; the bar is "damn, this site is great".

**First screen:** logo top left, nav and "Star on GitHub" top right. Huge
two-line title on the left, the promise and the install command (with a copy
button) on the right. Below, full width: the compare slider, framed like a
proof with crop marks, a proof slug line above it and a museum wall label
under it. Phone: logo, title, command, slider, wall label.

**Wildcard element:** red pencil markup (circles, arrows, handwritten notes)
on the Other agents side. It lives inside that side, so dragging the line
erases the bad page and its markup together.

**Logo and favicon:** "Super‸Webdesigner": the wordmark with a red
proofreader's caret inserted between the two words. Favicon: the red caret on
proof white.

**Palette:** `#FFFFFF` proof white · `#111111` press black · `#E5231B` red
pencil (the only accent: markup, caret, focus, one underline) · `#EDEAE3`
proof gray (surfaces, the desk) · `#8A857C` caption gray.

**Fonts:** Schibsted Grotesk 800 (titles) · Schibsted Grotesk 400/500 (text)
· IBM Plex Mono (commands, proof slugs, wall labels) · Caveat Brush (only the
red pencil notes).

**Motion (required):**
- Hero: title lines rise out of a clip, the caret in the logo is drawn in red,
  crop marks draw at the corners of the proof.
- Slider: a one-time hint sweep when it comes into view; drag follows the
  pointer 1:1; a click eases the line to that point; arrows work.
- Red pencil: circles and notes draw themselves (stroke animation) the first
  time the slider is seen.
- The 10 tells: each line gets struck through in red pencil as it scrolls in.
- The flow: a red line draws down the 8 steps as you scroll; the 3 stops get
  stamped.
- Buttons: press feedback; copy button confirms with "Copied".
- All of it off with `prefers-reduced-motion`.

**Keep list:** one-line promise, install command on the first screen, live
demo above the fold, GitHub link, real proof (both examples in the repo).

**Avoid list:** the 10 tells + dark/glow AI pages, glass cards, bento grids,
grid backgrounds, terminal-window heroes, serif-on-black luxury heroes.

**Honesty:** the Other agents side is a labeled caricature; the page says so
next to the slider.

Reference mockup: `mockup-a-red-pencil-proof.webp`.

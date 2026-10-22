# Three directions as gray skeletons

Before the first line of code, show style options as wireframes, the way a
designer would in Figma, and build only after the person picks one. This holds
even when the request already lists palette, fonts and sections.

## Each direction has

- **A named vibe** (2 to 4 words) and one sentence on why, including which
  research finding it came from.
- **The first screen at 390 px and at desktop**, in gray blocks: a box with an
  X where a photo goes, lines where text goes, a rectangle for each button.
- **The whole page's section order**, as small labeled blocks.
- **3 or 4 color swatches and the font names.** The only color on the
  skeleton.
- **The wildcard element marked** with a label ("portrait cut out, breaking
  past the band", "slider: the view at 6h, 12h, 18h, 21h").
- **The visual language:** the six materials of `visual-language.md` (edges,
  depth, lines, surface, type voice, motion feel), one short line each, with
  the reason from the reference.
- **The logo and the favicon** idea, in one line each.
- **The motion:** what moves on this page and why (a live element in the
  hero, how sections enter, what responds to hover), following the motion
  reference the person gave at STOP 0. One or two lines.

## The three must differ in composition

Not just color. Change where the photo sits, the size of the title, the rhythm
of the sections. If you can swap the palettes between two directions and they
become the same, they're one direction.

They must also differ in **visual language**. Three directions that are all
"printed paper" (a receipt, a stamp, a newspaper) or all "technical" are one
direction in three colors. And at least one (A) is the option a customer of
the niche recognizes at once.

## Recommend one

Mark the direction you'd pick and say why in one sentence, tied to the brief
("A: the bakery's warm photos carry it, and it keeps the bake times people
look for"). The person still chooses; a recommendation with a reason makes
choosing faster.

## Skeleton rules

- Gray and white. The only color is the swatch strip, so the person judges
  composition without being distracted.
- No lorem ipsum. Real title and button text, or close to it.
- Run `anti-patterns.md` on each before showing, with the 3-second test and
  the fit test of `visual-language.md`.

## Where to build them

- **Claude Code:** one Artifact with the three side by side (tabs or columns,
  each with a phone frame and a desktop frame). Private by default, opens on
  the phone by link, and updates in place after feedback.
- **Other agents:** one local `design/skeletons.html` with the same layout,
  served locally; give the person the path or the local URL.

Before sending, look at the page at 390 px in a real browser
(`resize_window` in Claude Code), not only at desktop, and reset the size
afterward. Headless Chrome won't go below ~500 px wide, so its "390 px"
screenshots are wrong unless you use device emulation.

Save a PNG screenshot of each direction in `design/` too: it's what goes into
the mockup prompts and the project history.

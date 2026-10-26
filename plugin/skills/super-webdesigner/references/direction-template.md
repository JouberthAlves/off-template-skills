# Chosen direction (template)

Save as `design/direction.md` right after the person chooses. It's the
contract for the build: when in doubt during the build, this file wins over
your taste.

```markdown
# Chosen direction (YYYY-MM-DD)

**Base:** direction <A/B/C>, "<named vibe>": <one sentence: the real-world
reference and the collision>.

**Changes the person asked for:** <what was mixed in from another direction,
what was swapped, what was removed>. <If nothing: "none".>

**First screen:** <layout in two or three sentences: where the title, photo
and buttons sit, at desktop and on the phone>.

**Wildcard element:** <what it is and where it appears>.

**Palette:** `#......` background · `#......` surfaces · `#......` accent
(the only one) · `#......` text. <Where each color came from.>

**Fonts:** <title> · <body> · <labels/code, if any>. <Why each, from the
reference.>

**Visual language** (`visual-language.md`, each with its reason):
- Edges: <radius and shapes>
- Depth: <flat / soft natural shadow / layered...>, on <which elements only>
- Lines: <none / hairlines / ...>
- Surface: <flat color / photo / texture>
- Type voice: <...>
- Motion feel: <...>

**Imagery:** <what the photos show, light, treatment; real or generated; the
photo base block if generated (`photography.md`)>.

**Logo and favicon:** <what they are>.

**Motion (required):** <the person's motion reference and intensity; what
moves and why: the live element in the hero, how sections enter, hover and
press feedback, confirmations>. All of it off with `prefers-reduced-motion`.

**Keep list from the research:** <the items visitors expect, that must be on
the page>.

**Avoid list for this project:** the 13 general anti-patterns + <the niche
ones>.

**Language:** <...>.

**Licenses to respect:** <any component or asset with conditions, and the
credit it needs>.

**Waivers:** <none, or one line each: the lint WARN or tell kept on purpose,
and the reason about this page (not "I like it"). Example: `words-page`: the
menu has 40 dishes and visitors come to read it. Past three, the look is a
house style and belongs in the direction above, not here.>

**Stamp:** <the line 1 of the CSS, `references/lint.md`>.

Reference mockups: `design/mockup-<x>.png` (layout), `design/mockup-<y>.png`
(<what is borrowed from it>).
```

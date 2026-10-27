# The lint and the code floor

`scripts/sloplint.mjs` is the mechanical half of the review. It reads the
HTML, CSS and components, and with `--render` it opens the page in the Chrome,
Chromium or Edge already on the machine (no install, Node 22 or newer) and
measures it at 375, 768, 1280, 1440 and 1920 px.

```bash
node <skill-dir>/scripts/sloplint.mjs <page.html | folder | http://localhost:PORT/> --render --shots design/shots
```

It is one of three checks, never the only one: the lint catches what a rule
can catch, Impeccable's detector (`review.md` 1e) catches contrast and sizes
on the served page, and the screenshots and the fresh-eyes review catch
whether the page looks like the business. A clean lint says nothing about
taste.

- **FAIL** is the floor: the page does not ship. Fix it and run again.
- **WARN** is one of the 13 tells or a default: fix it, or write the reason
  about this page under **Waivers** in `design/direction.md`.
- Exit code 1 means at least one FAIL. `--floor` shows only FAILs (the edit
  hook uses it), `--json` is for scripts.

## The code floor (FAIL)

| Rule | What it means | Why |
|---|---|---|
| **Colour and font through tokens** | Every colour and every face is declared once in `:root` (`--bg`, `--ink`, `--accent`, `--font-display`) and used through `var()`. No hex, `rgb()` or family name past the token block, inline styles included. An `@property` block's `initial-value` counts as a token block (it must be a literal) | The palette changes in five lines, and no colour from the agent's memory slips in unseen |
| **No `transition: all`, no animated layout** | Say what moves: `transition: transform .2s, opacity .2s`. Never animate `width`, `height`, `top`, `left`, margins or padding | `all` animates things nobody meant to move and stutters. **Motion stays:** `transform`, `opacity` and `clip-path` carry it (`motion.md`) |
| **`overflow-x: clip` on html and body** | Never `hidden` there, never `width: 100vw` | `hidden` breaks `position: sticky`; `100vw` counts the scrollbar and pushes the page sideways |
| **No horizontal scroll** | At 375, 768, 1280, 1440 and 1920 px the page is never wider than the window. The lint names the element that spills | A sideways wobble on a phone is the first thing a visitor feels |
| **The container is capped** | At 1920 px the content stays at its width (around 75 to 90rem) and only the gutters grow | Lines that run edge to edge are tiring to read |
| **No card inside a card** | One surface per level: a box with background and edge does not sit inside another one | Two frames around one idea add noise, not meaning |
| **Visible focus** | Every link, button and field has a `:focus-visible` style from the palette | Keyboard visitors have to see where they are |
| **Reduced motion** | A page that moves answers `prefers-reduced-motion: reduce`, and every text is visible without the motion | Some visitors get sick from motion |

**Grid tracks** (WARN): an image-bearing grid uses `minmax(0, 1fr)`, never a
bare `1fr`, so a wide photo or a long word cannot widen its column. The render
catches the overflow itself when it happens.

## The tells the code shows (WARN)

Part of the 13 in `anti-patterns.md`, the ones a rule can see: a purple-blue
gradient, a grid background, three or more hard shadows, glow on three or more
elements, a default face, monospace on labels, buttons or nav, emoji in the
copy, 01/02/03 labels, **one italic word inside a roman heading** and
**letter-spaced uppercase on three or more rules** (`tracked-caps`; both part
of the "default type" tell). The rest of the 13 need the screenshots.

Not checked, on purpose: a drawn browser window around a screenshot (fine
when it is well made), arrows in links (they guide), a status dot (fine when it
reports a real state).

## The budget (WARN, from the render)

- About **80 words on the first screen**: the headline, one sentence and the
  actions.
- **450 visible words** on the page at most. Fullness comes from scale and
  pictures, not more words.
- **Six to nine sections**, hero and footer included (five on a thin brief).

A long page with a reason (a menu, a price list, documentation) waives it in
`design/direction.md`.

## The stamp

The first line of the page's main CSS records the decisions, so anyone
opening the file (a person, another agent, the next build) knows where the
look came from. The lint warns when a project with `design/direction.md` has
no stamp.

```css
/* super-webdesigner · direction B "butcher paper" · job: order on WhatsApp · faces: Bricolage Grotesque / Literata · palette: kraft, ketchup red, ink · motion: lively, the order ticket prints in the hero · waivers: none */
```

Waivers in the stamp repeat the ones in `design/direction.md`, one word each
(`waivers: words-page`).

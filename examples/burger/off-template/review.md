# Review: Order 27

Screenshots: `desktop.png` (1440×900) and `mobile.png` (390×844, real mobile
emulation), plus full-page captures, all in headless Chrome.

## ai-slop-check

**Score: 0/10 present** (self-assessed by the agent that built it). Niche list: 0 present. The owner found the result unattractive and the motion thin; the score is not the verdict.

| Pattern | Result |
|---|---|
| Purple or blue gradient | Absent. Flat paper, one rust ink |
| Serif title by default | Absent. Big Shoulders Display (condensed signage sans) |
| Grid background | Absent. Paper grain only |
| 3 generic benefit cards | Absent. Menu is a printed price list; "how it works" is a numbered list of real steps |
| Emoji in the copy | Absent |
| Glow on everything | Absent. One shadow, on the stamp and the ticket bar |
| The usual layout | Broken: hero → price list → steps → counter → hours. No testimonials, no FAQ |
| Generic icons | Absent. No icon set at all; the only marks are "+" and the stamp |
| Everything static | Absent, but thin: a stamp press on load, price lines printing in, the ticket stamp. The owner judged the motion too little |
| Fake 01/02/03 | Absent. Numbers only on the 3 real pickup steps |
| Niche: dark + red/yellow, grunge, smoke, script "since", emoji icons, fake reviews | All absent |

## Design critique (design:design-critique)

Fixed after the critique:
- "Order pickup" scrolled to the menu like "See the menu" did. It now scrolls
  and puts focus on the first line, which adds to the ticket.
- On phones under 420 px the "Find us" link was hidden. All three links now
  fit.
- The price strip wrapped with "Shake 6" alone on the phone. It's a 2×2 grid
  there now.

Left as is:
- The hero photo on desktop is a crop of a generated mockup, upscaled about
  1.4×, slightly soft. A real project would use a photo at the right size.

## Tests

| Test | Result |
|---|---|
| Horizontal scroll at 1440 and 390 (mobile emulation) | None (scrollWidth = innerWidth) |
| Found during testing | The stamp starts its animation at scale 1.6; on phones that made Chrome zoom the page out to 429 px. Fixed with `overflow: clip` on the hero |
| Order flow | 2× Double + Fries = 3 items, $29; ticket opens; empty name blocked; name capped at 40; order stamped "No. 28"; bar clears |
| "Order pickup" | Scrolls to the list, focus on "Add Single, $9.50, to your ticket" |
| Reduced motion | Stamp and list appear without animation |
| Fonts | Big Shoulders Display 800/900, Work Sans 400/500/600 all loaded |
| Contrast (AA) | Text on paper ~15:1, gray `#5d5650` ~6.1:1, rust `#9B3B24` ~5.8:1, light text on the dark section >12:1 |
| Touch targets | Menu lines are full-width buttons; main buttons 52 px tall |
| Images | `alt` on both photos; hero preloaded, counter photo lazy |

Not tested here: Lighthouse (no network access to run it against a deployed
URL), real iOS Safari, screen reader pass.

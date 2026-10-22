# ai-slop-check: normal agent ("Ember & Bun")

Run on `desktop.png`, `mobile.png` (390×844, mobile emulation) and the page
source.

**Score: 3/13 present: reads as AI-made.** Plus 3 of the niche's own clichés.

(Corrected on 2026-10-20: an earlier version said 3/10 by counting "generic
social proof", which is not one of the 10 tells. It now sits under "also
found". A fresh run on `desktop.png` alone scored 0/10, because the emoji menu
and the section order are below the fold; see `../../clean-room-test.md`.)

(Re-scored on 2026-10-22, when the list grew from 10 to 13 tells and "serif
title by default" became "default type": the body text is set in Inter, so
that tell is now present. The three new tells (hard shadows, spec-sheet
dressing, a default AI look) are absent.)

## Present

- **Default type:** the body text is Inter, loaded with no reason from the
  brand (`--font-body` in `styles.css`). Fix: a body face with the same
  warmth as the Bricolage titles, or Bricolage's text sizes throughout.
- **Emoji in the copy:** every one of the 12 menu items uses an emoji as its
  picture (burger, fire, chili, bacon, mushroom...). Fix: real photos of each
  item, or a single drawn icon set for the four categories.
- **The usual layout:** hero → menu → combo banner → story → three reviews →
  visit. Fix: break the order; on a pickup counter, the menu with prices *is*
  the hero.

## Niche clichés (from `../super-webdesigner/research.md`)

- Red and mustard yellow, with a black band of yellow uppercase words.
- A "since 2014" badge.
- A cartoon burger as the hero instead of the real food.

## Also found in the review (not scored)

- **Invented social proof:** three review cards in a row and a stats row with
  invented numbers ("4.8★, 2,300+ reviews", "100% local beef"). Fix: real
  Instagram posts or press, and no numbers the owner can't back.

- **Horizontal scroll:** the page is 1451 px wide in a 1440 px window, and
  401 px on a 390 px phone (the phone zooms out to fit). Likely the rotated
  marquee band.

## Absent

Purple-blue gradient, grid background, glow everywhere, thin generic icons,
static page (it has motion), fake 01/02/03 numbering, hard shadows and boxes
(soft header shadow only), spec-sheet dressing, a default AI look.

## Fair to say

It's a competent page: readable type, working cart, opening-hours badge,
reduced-motion support. The problem isn't quality, it's that it's the page
every agent makes for every burger place.

# Short commands

For a page that already exists. None of them runs the brief, the research or
the three directions. All of them:

1. Read `design/direction.md` if there is one. It is the look to keep: a
   command never changes palette, faces, edges or motion feel unless it is
   its job. No direction file: read the page's own tokens and keep them.
2. Take before screenshots (`scripts/sloplint.mjs <page> --render --shots
   design/shots/before`).
3. Change only its own part. Anything else noticed goes in the report as a
   suggestion, not into the code.
4. Run the lint again, fix any FAIL the change caused, take the after
   screenshots and show before and after.
5. Report in three lines: what changed, what was left and why, what the
   person should look at.

## polish

The last pass before delivery. The design stays; the details get finished.
- Spacing on the scale: more space above a heading than below it, the same
  gap for the same relation.
- Alignment: one container width, edges that line up across sections.
- Every control in all its states: default, hover, focus, active, disabled,
  loading.
- Browser defaults themed from the palette: text selection, caret,
  scrollbars, focus rings, underline offset, tabular numerals in prices.
- No single word alone on a heading's last line; body measure 65 to 75
  characters.

## bolder

When the page is correct but forgettable. Same direction, more presence.
- Scale: the headline and the signature element bigger; fewer things, larger.
- Contrast: one strong value jump between background and the key element.
- The hero: the most characteristic photo or moment bigger, cropped with
  intent.
- Motion: the live element in the hero more visible (still one, still
  purposeful).
- Never by adding the tells: no gradients, glows or extra decoration.

## quieter

When the page shouts: too many effects, colours or moving parts.
- One accent colour, used where the action is.
- Effects on one element only; remove the rest.
- Motion slower and fewer: keep the hero's live element and the feedback,
  drop decorative loops.
- Lighter weights or smaller sizes where everything is bold.

## distill

When the page says too much.
- Cut sections that repeat a point or that the job doesn't need
  (`anatomy.md`).
- Bring the words to the budget: about 80 on the first screen, 450 on the
  page.
- Remove decorations that carry nothing: dividers, badges, background shapes.
- Ask before removing any fact or section the person wrote.

## harden

When the page has to survive real use.
- Forms: masks, limits, counters, labels tied to fields, errors that say the
  problem and the fix, a disabled button while sending, a real send or an
  honest "not connected yet" (`review.md` 4).
- Empty, loading and error states for anything that fetches.
- Long text: a name with 60 characters, a price with five digits, a
  translation 40% longer. Nothing overflows.
- Slow network and no scripts: the content still reads.

## clarify

Only the words people act on.
- Buttons name the action ("Order on WhatsApp", not "Submit").
- Labels say what to type; placeholders don't replace labels.
- Errors say what happened and what to do next.
- Never changes the claims, prices or facts the person wrote. Ask first.
- In Claude Code, `design:ux-copy` can help.

## adapt

Only phone and tablet.
- 375, 768 and the sizes in between: no sideways scroll, no cut text.
- Touch targets at least 44 x 44 px; the main action within thumb reach.
- Type sizes: body 16 px or more on the phone, headlines sized by their
  column.
- Menus, tables and long rows rearranged for the width, not shrunk.

## lint

Runs `scripts/sloplint.mjs <page> --render` and reports the FAILs and WARNs.
Changes nothing.

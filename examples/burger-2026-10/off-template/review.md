# Review (2026-10-26)

Code by a Sonnet 5.5 subagent at medium effort from `_spec/spec.md` (one pass, about 1 minute). Review and fixes by Opus.

## 1. sloplint (`--render`, 375 to 1920 px)

First run on the Sonnet output: **0 FAIL, 1 WARN** (`sections`: 2 sections, because the page is a hero only by the owner's scope). Final run after the fixes: the same, with the waiver recorded in `direction.md`. Full output in `sloplint.txt`.

## 2. Fresh-eyes reviewer (subagent, never saw the conversation)

Verdict: **fix**. It found:
- On the phone, today's stop sat below the fold. **Fixed:** the photo got shorter, the title smaller, and the stop line moved up under the title. At 390 × 844 the stop, the price and the button all show.
- On desktop, the photo floated as a whole circle instead of being cropped at the top. **Fixed:** it is larger (880 px), pushed up and right, and cropped by the top and the right edge.
- No Instagram in the nav (it was on the keep list). **Not added:** the owner gave no handle, so an Instagram link would be an invented fact. Removed from the keep list.
- No tells from the list.

## 3. Design critique (`design:design-critique`, on the 1440 and 390 shots)

- **First impression:** the cut face of the burger, then the title. That is the right order for "hungry, right now".
- **Usability:** one action ("Order for pickup"), visible on both widths; the stop line answers "where is the truck". Moderate: Menu, Schedule and Order point at anchors that don't exist yet, because the page is a hero only.
- **Hierarchy:** photo → title → stop → sentence → button on the phone; title → sentence → button → stop on desktop. Minor: on desktop the title takes 4 lines. Its column is narrow, and the mockup had 2. Kept, since the weight is what the direction asked for.
- **Consistency:** one accent (cheese) on the button and the dot only; round edges everywhere (lens, pill, badge); no shadows.
- **Accessibility:** crumb on char about 7:1, the dimmed body text about 5:1, char on the cheese button about 6.5:1 (computed from the tokens). The nav links and the button are 44 px or taller. The badge text is 12 px on the phone (the link has an `aria-label`).

## 4. Anti-patterns (13 tells, on the shots and the source)

Absent: purple-blue gradient, default type, grid background, 3 cards, emoji, glow, the usual layout (an asymmetric hero with a round photo cropped by the edges), generic icons, static page (a roll-in plus the pointer drift), 01/02/03, hard shadows, spec-sheet dressing (the dot reports a real open/closed state from the clock), the default AI look (char and cheese come from the burger photos, with no serif and no terracotta). **0 present.**

3-second test: pass (a burger truck, $10, open now). Fit test: pass (round, flat, warm; the only depth is the lens).

## 5. Motion and robustness

With JS and motion on, every element ends at opacity 1 at its final transform, with no console errors. Without JS everything is visible at rest. With reduced motion there is no animation and the title keeps its tilt. Pointer drift on fine pointers only.

## 6. The owner's notes at STOP 2

- **The background read as a flat colour.** The griptape grain was at 5% with `overlay`, which vanishes on a dark base. It was redone as concrete (SVG noise at 13%); the owner said it read as concrete, not griptape, and asked for a photo of griptape. A macro photo was generated (100 credits) and tiled with `screen` at 45%. Impeccable: 0 findings at both widths after it.
- **The nav cut the photo flat.** The nav now floats over the hero (`position: absolute`), so the round photo runs up to the top edge of the screen. The links sit on a round char veil (72%, with a blur) so they stay readable over the photo.
- Impeccable then flagged the hero sentence at 4.3:1 on the lighter, textured ground. Raised to 90% of the crumb colour; the rerun found 0.

## Not tested

- Real phone, iOS Safari, and a machine without a GPU.

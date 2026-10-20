# Clean-room test of `super-designer`

> Historical record. The skill was renamed `super-webdesigner` afterwards,
> and the fixes suggested below were applied on 2026-10-20 (brief questions
> always asked, cost approved with the brief, "not visible" in
> ai-slop-check, the burger score corrected to 2/10). The ground rule given
> to the test agent ("it may answer its own questions") was itself wrong.

Date: 2026-10-20. Claude Code desktop app, Windows, Opus 5.5.

## Setup

- Empty folder outside the repo:
  `%LOCALAPPDATA%\Temp\sd-clean-room\test-project`, with
  `skills/super-designer` copied into `.claude/skills/super-designer`
  (project-scoped). Nothing else in the folder: no vault, no `package.json`.
- A fresh `general-purpose` subagent got exactly this request:
  "Build a website for a landing page for a small bakery." The prompt said
  nothing about the skill. It did get three ground rules:
  - the person can't reply, so it may answer its own questions (and must
    show the answers);
  - stop and report wherever its process says to wait for the person;
  - spend no paid credits and install nothing.
- **Limit of the setup.** The `claude` CLI is not installed on this machine,
  so I couldn't start a real headless session inside the test folder. A
  subagent gets its skill list from the parent session, not from its own
  folder, so `super-designer` never appeared in its skill list. Item (a)
  therefore tests whether the agent finds the skill on disk. It does not test
  whether Claude Code triggers the skill from its `description`. That still
  needs one manual run: open a new Claude Code session with the test folder
  as its working directory and type the request.

## Result: (a) to (f)

| | Check | Result |
|---|---|---|
| (a) | Loaded the skill on its own | **PASS (on disk only).** It listed the project root, found `.claude/skills/super-designer/SKILL.md`, and read SKILL.md and all 10 reference files before doing anything else. Triggering from the `description` was not tested (see setup). |
| (b) | Showed a tool coverage table | **PASS.** Before the table it ran `ToolSearch`, `ListPlugins`, `ls ~/.claude/skills`, the image MCP's free balance and `simulate_cost` calls, and checked for `package.json`. The table follows the `discovery.md` format. GSAP skills was the only missing job; it gave the exact `npx skills add` command, asked "install or fallback?", answered "fallback", and installed nothing. |
| (c) | Asked or answered the 4 brief questions | **PASS.** It wrote all 4 questions word for word, answered them itself, showed the answers, and added the "who pays" note from `brief.md`. The bakery name, address and hours are marked as placeholders. |
| (d) | Researched real sites or used the fallback | **PASS.** It opened 10 real bakery sites in the built-in browser at 1440 and 390 px. 8 more failed because of a proxy/certificate error on this network, and it listed them. It saved `design/research.md` with the per-site table, a keep list, an avoid list and the outliers. It didn't need the fallback. |
| (e) | 3 directions with skeletons and mockup prompts, no image credits spent | **PASS, with the flow problem described below.** It made three directions with different compositions: split hero with a photo, a giant title on kraft paper with no photo, and a departure board as the hero. Each has a named vibe, desktop and 390 px gray skeletons, the section order, swatches, fonts, the wildcard marked, and an anti-pattern check. It published a private Artifact, saved one PNG per direction, and wrote 3 full prompts from the template to `design/mockup-prompts.md`. **No images were generated.** I checked the image account's creation history for 2026-10-20: it has no bakery images, only images from other projects. |
| (f) | Stopped before writing any site code | **PASS.** The project holds only `design/` files: research, skeletons HTML, 3 PNGs and the mockup prompts. No `index.html`, CSS or JS. |

**Where the flow broke:** step 4, at the colored mockups. The agent never
reached STOP 1. It stopped at a third waiting point that SKILL.md doesn't
list: the cost approval for the mockups. The message it would have sent was
the skeleton link plus "this will cost 300 credits out of 18,920, OK to
generate?". Only after a yes, and a second round trip, would it have asked
"Which of the three?". My "no paid credits" rule pushed it toward stopping
there, but the skill's own non-negotiable ("show the cost before generating
and wait for a yes") would have caused the same stop without it.

The contradiction is in SKILL.md itself:

- "The two **STOP** points are where you wait for the person; everything else
  you do on your own."
- Step 4: "don't ask whether to make it" (the mockup).
- Non-negotiables: "Paid tools: show the cost before generating and wait for
  a yes."

With any paid image tool, step 4 always contains an unlisted wait. The
person ends up answering twice before choosing, and gets the skeletons
without the mockups the step says must come together.

## Smaller findings from the run

1. **Partial research failure isn't covered.** `research.md` only has a
   fallback for "no search or browser available". Here 8 of 18 sites were
   blocked. The agent handled it well (it listed the failures and kept
   going), but nothing in the skill tells it to.
2. **390 px was not checked with the browser.** The agent rendered the
   skeletons in local headless Chrome, which won't go below 500 px, and wrote
   that 390 px was untested. The built-in browser's `resize_window` can do
   390 px. The skill names that tool only for the review in `tool-slots.md`,
   not for the skeletons.
3. **Leftovers outside the project.**
   - Render copies in the subagent's scratchpad.
   - A private Artifact: https://claude.ai/artifact/SFqvfkaBF3Ra15Q3MyFs72.
     Shortly after the run it was already reported as not found for this
     account (deleted, or never shared with it). Nothing to clean up there;
     the same page is in the test folder as `design/skeletons.html`.
   - The browser pane is still set to 390×844.
4. **The "no hex from memory" rule worked well.** The agent sampled pixel
   colors from Wikimedia Commons photos of a sourdough loaf and a kraft bag,
   and checked contrast with Node. This is worth keeping as an example in
   `brief.md`.
5. **Direction A sits close to the niche's avoid list** (cream plus brown).
   The agent flagged this in its own anti-pattern check, which is the
   intended behavior.

## Wording changes to `skills/super-designer/SKILL.md` (not applied)

**Fix 1: put the cost question before step 4, so step 4 runs straight to
STOP 1.**

In "The flow", replace:

> Do the steps in order. The two **STOP** points are where you wait for the
> person; everything else you do on your own.

with:

> Do the steps in order. The two **STOP** points are where you wait for the
> person; everything else you do on your own. The one other question allowed
> is the cost of paid tools, and it goes in the brief message (step 2), never
> later.

In step 2, after "Ask the 4 questions in one message ...", add:

> If step 1 found that the mockups cost credits, end the same message with
> the cost line from `references/mockups.md` ("3 mockups at N credits each,
> X out of Y"). A yes there covers the three mockups of step 4. If the person
> says "just decide" without answering the cost line, do not assume a yes:
> make the skeletons, write the three mockup prompts, and treat the mockups
> as the manual fallback at STOP 1.

In step 4, replace:

> The mockup is part of the step, not an optional extra: don't ask whether to
> make it.

with:

> The mockup is part of the step, not an optional extra: don't ask whether to
> make it. Its cost was already approved (or refused) in step 2, so don't
> stop here. No approval: write the three prompts and send them at STOP 1
> with the skeletons.

In STOP 1, replace:

> Send the skeletons (an Artifact link in Claude Code, a local file elsewhere)
> and the 3 mockups together

with:

> Send the skeletons (an Artifact link in Claude Code, a local file elsewhere)
> and the 3 mockups together, or the 3 mockup prompts if generating wasn't
> approved,

**Fix 2: partial research failure.** In step 3, after "Look at 8 to 15 real
sites ...", add:

> If some sites won't open (blocked, certificate errors), say which and keep
> going with the rest; if fewer than 8 open, say so and ask the person for
> links at STOP 1 rather than stopping now.

**Fix 3: check 390 px for real.** In step 4, after "gray skeleton of the
first screen (390 px and desktop)", add:

> Before sending, look at the skeleton page in the browser at 390 px
> (`resize_window`), not only at desktop, and reset the size afterward.

**Fix 4 (for item a, once a real session confirms it).** If a real session
doesn't trigger the skill from a one-line prompt, add "bakery, café, shop" or
"for a small business" to the `description` examples next to "burger
restaurant". This run couldn't test triggering, so this one is still a guess.

## ai-slop-check on `examples/burger/normal-agent/desktop.png`

A fresh subagent read `skills/ai-slop-check/SKILL.md` and ran it on
`desktop.png` only. It was told not to read any other file in `examples/`.

| | Fresh run (desktop.png only) | Stored `slop-check.md` |
|---|---|---|
| Score | **0/10, fine** | **3/10, reads as AI-made** |
| Emoji in the copy | absent | present (12 menu items) |
| The usual layout | absent "as far as visible" | present |
| Generic social proof | not a tell, not scored | counted as present |
| The other 7 tells | absent | absent |
| Biggest win / niche clichés | "replace the cartoon burger with a real photo" | lists "cartoon burger as the hero" as a niche cliché |

**Why they differ:**

1. **Different input.** The stored check used `desktop.png`, `mobile.png`
   and the page source. `desktop.png` shows only the first screen
   (1440×900). The emoji menu items and the section order sit below the
   fold, so a check on this image alone can't find them. The fresh agent
   said so in its caveat.
2. **The stored score counts an item that isn't one of the 10 tells.**
   "Generic social proof" doesn't appear in the ai-slop-check table. Scored
   strictly against the table, the stored result is **2/10, "watch it"**,
   not 3/10. The "reads as AI-made" verdict in the example (and anything in
   the README that relies on it) doesn't follow the skill's own rule.
3. **Where they agree:** the 7 other tells are absent in both. The fresh
   run's biggest win matches one of the stored niche clichés. ai-slop-check
   has no niche step, so the fresh run had no niche list. The stored file
   took its list from the super-designer research.

**Verdict:** on the same visible input the skill gives consistent answers.
The stored 3/10 can't be reproduced from `desktop.png` alone, and one of its
3 points is off-list.

**Changes suggested (not applied):**

- `skills/ai-slop-check/SKILL.md`, step 1: after "Screenshot or image: use
  it as is." add:

  > If the image is only the first screen, say so, ask for a full-page
  > screenshot or the URL, and until you have it mark "The usual layout",
  > "3 generic benefit cards", "Emoji in the copy" and "Fake numbering" as
  > **not visible** rather than absent. Report the score as "N present out of
  > M visible".

- `skills/ai-slop-check/SKILL.md`, step 2: add **not visible** as a fourth
  status next to absent / present / present on purpose.
- Pick one of these:
  - add an 11th tell to both tables ("Invented proof: stats or reviews the
    owner can't back"), or
  - in `examples/burger/normal-agent/slop-check.md`, move "Generic social
    proof" under "Also found" and change the score line to "2/10 present:
    watch it".

  Then check the README's before/after claims still hold.

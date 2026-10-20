---
name: super-designer
description: Design direction for any website, landing page, app screen or visual piece, so the result does not look AI-generated. Runs a fixed flow before any code is written - discover the tools this agent has, ask a 4-question brief, research real sites in the niche, show 3 different directions (gray skeletons plus one colored mockup each) and wait for the person to choose. Then builds and reviews the result against a list of AI design tells (purple-blue gradients, emoji in copy, default serif titles, 3 generic benefit cards). Use whenever someone asks to build, redesign or style a site, page, landing page, homepage or UI, even with a one-line prompt like "build a website for a burger restaurant", and when they ask why their pages look generic.
---

# super-designer

Left alone, an agent makes the same page for everyone: centered hero, three
cards, purple gradient, serif italic title, emoji in the copy. This skill exists
to stop that. It does it with process, not taste: the aesthetic is never
decided by the agent alone.

Written for **Claude Code**. Tool names below are Claude's (Artifact,
`ToolSearch`, `AskUserQuestion`, the built-in browser). In another agent, use
the equivalents in the last tables of `references/tool-slots.md`: the flow
stays exactly the same.

## The non-negotiables

- **No code before the person picks a direction.** Even if the request already
  names colors, fonts and sections. Even if it's one line.
- **Never skip a step silently.** If one can't be done, say which and why.
- **Never pick a color hex from memory.** Color comes from a real-world
  reference (brief question 1) or from the client's real material.
- **Paid tools: show the cost before generating** and wait for a yes.
- **Ask before installing anything** on the person's machine.

## The flow

Do the steps in order. The two **STOP** points are where you wait for the
person; everything else you do on your own.

### 0. Look for a vault

If the working folder (or a parent) has an `AGENTS.md` pointing to
`INDEX Design.md`, or a `vault/` folder from this project, read its
`90 System/Agent rules.md` and every note in `20 Projects/` before going on.
Those hold the person's own rules and the styles already used. No vault: carry
on, this skill works alone.

### 1. Discover your tools

Read `references/discovery.md` and `references/tool-slots.md`. Find out what
this agent can actually do right now (skills, MCP servers, plugins, browser,
image generation). Show the person a short coverage table: job, tool you will
use, or "missing". For each missing job, recommend one or two options with the
exact install command and ask before installing. Nothing available for a job:
use its manual fallback (you write the prompt, the person runs it).

Do this once per session. Discovery is the truth; a list in a note is an old
snapshot.

### 2. Brief

Read `references/brief.md`. Ask the 4 questions in one message
(`AskUserQuestion` in Claude Code, a numbered list elsewhere). If an answer
is vague or the person doesn't understand a question, offer 3 or 4 concrete
options to pick from instead of asking again.

If the prompt was a one-liner and the person says "just decide", answer the 4
questions yourself, *show the answers*, and continue: they can still correct
them at the STOP below.

### 3. Research real sites in the niche

Read `references/research.md`. Look at 8 to 15 real sites of the same kind of
business. Come out with two lists: **keep** (what visitors expect to find) and
**avoid** (the look everyone in the niche repeats). The avoid list joins the
general anti-patterns for this project.

### 4. Three directions

Read `references/skeletons.md` and `references/mockups.md`, and
`references/anti-patterns.md` before drawing anything.

- **A:** at the level of the best sites in the niche.
- **B:** breaks the niche's visual convention.
- **C:** brings in a reference from outside the niche (the brief's two
  unexpected influences).

For each: a named vibe, gray skeleton of the first screen (390 px and desktop),
section order, palette swatches and font names, and the wildcard element
marked. Then **one colored mockup per direction** with the real copy. The
mockup is part of the step, not an optional extra: don't ask whether to make
it. Run the anti-pattern list on all three before showing them.

### STOP 1: the person chooses

Send the skeletons (an Artifact link in Claude Code, a local file elsewhere)
and the 3 mockups together, with one question only:
"Which of the three, or what should I mix?" Do not write code until they
answer.

### 5. Write the direction down

Fill `references/direction-template.md` with the choice (and any mix or swap
they asked for). Save it in the project as `design/direction.md`. This is the
contract for the build.

### 6. Build

Now code. Spend half the effort on the first screen: it is the only part every
visitor sees. Before reaching for a component or an effect, check the
component and animation slots in `references/tool-slots.md`: a ready piece
from a library beats a hand-made one.

### 7. Review

Read `references/review.md`. Screenshot the main screens (desktop and 390 px),
run the anti-pattern check on the screenshots, run a design critique, and the
short test battery. Fix what fails. In the delivery message, list what passed,
what failed and what you could not test.

### STOP 2: delivery

Show the result with the review summary. Then log the style (step 8) so the
next project doesn't repeat it.

### 8. Log the style

Add an entry following `references/style-log.md`: to `20 Projects/` in the
vault if there is one, otherwise to `design/style-log.md` in the project.
Do it when the first version is ready, not at the end of the project.

## Answer format during the flow

Keep messages short and in this order: what you understood, what you read or
found, what you will do, the result, and a single question only if you are
blocked.

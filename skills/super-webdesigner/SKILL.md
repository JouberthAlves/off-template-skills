---
name: super-webdesigner
description: Design direction for any website, landing page, app screen or visual piece, so the result does not look AI-generated. Runs a fixed flow before any code is written - discover the tools this agent has, ask the person a 4-question brief, research real sites in the niche, show 3 different directions (gray skeletons plus one colored mockup each) and wait for the person to choose. Then builds with purposeful motion and reviews the result against a list of AI design tells (purple-blue gradients, emoji in copy, default fonts, 3 generic benefit cards, static pages, hard neo-brutalist shadows, mono spec-sheet dressing) and checks that the look still fits the business. Use whenever someone asks to build, redesign or style a site, page, landing page, homepage or UI, even with a one-line prompt like "build a website for a burger restaurant" or "a landing page for a small bakery", and when they ask why their pages look generic. Also runs short commands on a page that already exists (polish, bolder, quieter, distill, harden, clarify, adapt, lint).
argument-hint: "[polish | bolder | quieter | distill | harden | clarify | adapt | lint] [target]"
---

# super-webdesigner

Left alone, an agent makes the same page for everyone: centered hero, three
cards, purple gradient, serif italic title, emoji in the copy, nothing moving.
Told to avoid that, it falls into a second default: hard offset shadows,
black outlines, monospace labels and fake technical data, whatever the
business is. This skill exists to stop both. It does it with process, not
taste: the aesthetic is never decided by the agent alone, and every material
of the page (color, type, edges, depth, texture, motion) comes from the
business's real world.

Written for **Claude Code**. Tool names below are Claude's (Artifact,
`ToolSearch`, `AskUserQuestion`, the built-in browser). In another agent, use
the equivalents in the last tables of `references/tool-slots.md`: the flow
stays exactly the same.

## The non-negotiables

- **The person answers the brief, not you.** Ask the 4 questions every time,
  even after a one-line prompt. A short prompt is not permission to decide.
  Only answer them yourself if the person says so in words ("you decide",
  "pick for me"); then show your answers and let them correct.
- **No code before the person picks a direction.** Even if the request already
  names colors, fonts and sections.
- **Never skip a step silently.** If one can't be done, say which and why.
- **Never pick a color hex from memory.** Color comes from a real-world
  reference (brief question 1) or from the client's real material.
- **Never pick edges, shadows, borders or type from habit.** They come from
  the same reference and feeling (`references/visual-language.md`). A warm
  bakery doesn't get a cold, technical frame.
- **It has to look like the business.** Avoiding clichés is not the goal: a
  customer of the niche must recognize the business and want it from the
  first screen.
- **Every direction includes motion.** What moves, and why. A page with
  nothing moving is one of the tells; it doesn't ship.
- **The code floor never ships broken.** A FAIL from `scripts/sloplint.mjs`
  (`references/lint.md`) stops the delivery whatever the score: colours and
  faces outside tokens, `transition: all`, a sideways scroll, an uncapped
  container, a card in a card, no focus, no reduced motion.
- **Invented facts are never allowed.** A number, quote, rating, logo or
  address the person did not give is absent from the page. A picture they did
  not give is a stand-in, marked as one.
- **Paid tools: show the cost before generating** and get a yes. Ask it once,
  in the brief message (step 2), not as an extra stop later.
- **Ask before installing anything** on the person's machine.
- **You don't get the last word on your own work.** Your review is input; the
  person judges the result at STOP 2. Never publish a score or a quality
  claim about the result before they've seen it.

## The mode of the page

Say the mode at STOP 0, from the surface asked for, not from the business (a
tool's landing page is Persuade; its settings screen is Operate). The flow is
the same; the ambition changes:

- **Persuade** (landing page, business site, campaign, pricing): the visitor
  decides and acts. Full point of view; the three directions differ in look
  and composition.
- **Operate** (app screen, dashboard, admin, settings, tool): the visitor
  finishes a task. Precision, consistency and the real content outrank
  expression; the patterns the visitor already knows earn their place. The
  three directions differ in layout and states, not in brand flourish; the
  word budget doesn't apply.
- **Read** (docs, article, guide, changelog): the visitor understands
  something. Structure and reading comfort first (measure 65 to 75
  characters, clear headings); the word budget doesn't apply.
- **Experience** (portfolio, gallery, showcase): the visitor is inside the
  work. The work leads from the first screen and the interface steps back.

An existing design asked to change only a part is a refinement, not this
flow: keep its identity, content and behaviour, and use a short command
(below). Run the full flow only when the person asks for a redesign.

## The flow

Do the steps in order. There are four **STOP** points where you wait for
the person; everything else you do on your own.

### 0. Look for a vault

If the working folder (or a parent) has an `AGENTS.md` pointing to
`INDEX Design.md`, or a `vault/` folder from this project, read its
`90 System/Agent rules.md` and every note in `20 Projects/` before going on.
Those hold the person's own rules and the styles already used. Follow them as
rules for yourself, not as material. No vault: carry on, this skill works
alone.

### 1. Discover your tools

Read `references/discovery.md` and `references/tool-slots.md`. Find out what
this agent can actually do right now (skills, MCP servers, plugins, browser,
image generation, animation libraries). Build a short coverage table: job,
tool you will use, or "missing". For each missing job, pick one or two options
with the exact install command. Nothing available for a job: use its manual
fallback (you write the prompt, the person runs it).

Do this once per session. Discovery is the truth; a list in a note is an old
snapshot. Two jobs get checked every time, because they are the ones most
people lack: **image generation** (the colored mockups) and **video**
(HyperFrames, for a short film of the page).

### STOP 0: the brief

One message, with everything the person needs to answer once:

1. **The coverage table** from step 1, with the install question for anything
   missing ("install it, or use the fallback?").
   **Say this in the message:** for the best result, connect an image tool
   (ChatGPT's image generation, Magnific, or any GPT-image MCP). Without one,
   the three mockups are prompts you paste into an image tool and send back:
   slower, and no second try.
2. **The plugins for the most design**, only the ones the coverage table
   marked missing. Show them in this form, one line each with its command
   (`references/tool-slots.md`, section "Plugins for the most design"):

   > Deseja instalar os seguintes plugins: <lista>.
   > Instale para obter o maior proveito do super-webdesigner.

   Ask yes or no for the list as a whole, then install only what the person
   approved. Nothing gets installed without that yes.
3. **The 4 questions** from `references/brief.md` (`AskUserQuestion` in Claude
   Code, a numbered list elsewhere). Offer 3 or 4 concrete options for each,
   so answering is a click, not homework. If the client has real photos,
   posts or a logo, ask for them here too (`references/photography.md`).
   **Plus the motion reference and intensity** (`references/motion.md`): an
   app, site or video whose movement the person likes, and calm / lively / a
   show. It's not one of the 4 questions; it goes in the same message.
4. **The cost line** for the mockups, if the image tool spends credits: "3
   mockups at N credits each: X out of Y (Z left)". A yes covers the three
   mockups of step 4.
5. **Setup**, only if `design/setup.md` is missing: the questions in
   `references/setup.md` (stack, commit convention, language, deploy,
   accessibility, vault). Skip this item when the file exists, and say what
   you read from it.

Wait for the answers. If one is vague, offer options instead of asking again.
No yes on the cost: you'll write the three mockup prompts instead of
generating them.

### 3. Research real sites in the niche

Read `references/research.md`. Look at 8 to 15 real sites of the same kind of
business. Come out with two lists: **keep** (what visitors expect to find) and
**avoid** (the look everyone in the niche repeats). The avoid list joins the
general anti-patterns for this project.

Some sites won't open (blocked, certificate errors): say which and keep going.
Fewer than 8 opened: say so, and ask the person for links at STOP 1 instead of
padding the research with guesses.

### 4. Three directions

Read `references/skeletons.md`, `references/visual-language.md`,
`references/mockups.md` and `references/anti-patterns.md` before drawing
anything, and `references/techniques.md` for each direction's signature
effect and composition (a technique serves the direction; it never picks it).

- **A:** at the level of the best sites in the niche. A customer of the niche
  recognizes it in 3 seconds; it's the safe, excellent option.
- **B:** breaks the niche's visual convention.
- **C:** brings in a reference from outside the niche (the brief's two
  unexpected influences).

For each: a named vibe, gray skeleton of the first screen (390 px and desktop),
section order, palette swatches and font names, **the visual language** (edges,
depth, lines, surface, type voice, motion feel, each with its reason), the
wildcard element marked, the logo and favicon idea, and **the motion** (what
moves and why, from the person's motion reference). The three differ in
composition and in visual language. Look at the skeleton page at 390 px in a
real browser (`resize_window`), not only at desktop, and reset the size
afterward.

Then **one colored mockup per direction** with the real copy: generated if
the cost was approved at STOP 0, otherwise the three ready prompts. Don't stop
to ask here. Run the anti-pattern list, the 3-second test and the fit test on
all three before showing them, and mark the one you recommend with the
reason.

### STOP 1: the person chooses

Send the skeletons (an Artifact link in Claude Code, a local file elsewhere)
and the 3 mockups (or their prompts) together, with your recommendation and
its reason in one line, and one question only: "Which of the three, or what
should I mix?" Do not write code until they answer.

### 5. Write the direction down

Fill `references/direction-template.md` with the choice (and any mix or swap
they asked for), including the motion. Save it in the project as
`design/direction.md`. This is the contract for the build.

### STOP 1b: the decisions block

Before any code, send the decisions in one short block. It is the only place
they are all said together, and the person's last chance to redirect cheaply:

```markdown
**Decisions**
- Job: <what the visitor comes to do>, the action <where it sits>
- Direction: <A/B/C> "<vibe>" (<palette in words>, <faces>)
- First screen: <what carries the hero> + "<headline>" + <the action>
- Sections: <hero> · <...> · <footer>
- Motion: <the live element in the hero>, <the entrances>, <the intensity>
- Material: real = <what the person gave> · stand-ins = <slots> · absent = <what will not be on the page>
- Waivers: <none, or the gate and the reason>
```

Wait for "ok" or the corrections. Changes go into `design/direction.md`
before the build starts.

### 6. Build

Now code. **The stamp** goes on line 1 of the main CSS (`references/lint.md`),
and every colour and face is a token in `:root` from the first line written.

**The hero alone, first.** Build the nav and the first screen and nothing
below them. Run `scripts/sloplint.mjs --render` on it, take the first screen at
390 and 1440 px, and hand it to a **fresh-eyes reviewer** (`references/review.md`,
section 0): a reviewer that never saw this conversation judges it against
the direction. Fix what it says, then build the rest.

Spend half the effort on the first screen: it is the only part every
visitor sees, and it opens with the most characteristic photo or moment of
the business. Photos follow `references/photography.md` (one base scene,
niche objects checked first, palette sampled from them). Build the visual
language exactly as the direction wrote it: a shadow, border or radius that
isn't in `design/direction.md` doesn't go in. Build the motion from the
direction with `references/motion.md`, not as a last coat of paint: a live
element in the hero, entrances on scroll, hover and press feedback,
confirmations, all respecting `prefers-reduced-motion`. The signature effect
comes solved from `references/techniques.md` when one fits. Before reaching for a
component or an effect, check the component and animation slots in
`references/tool-slots.md`: a ready piece from a library beats a hand-made
one. Keep to the budget in `references/lint.md`: about 80 words on the first
screen, 450 on the page, six to nine sections.

### 7. Review

Read `references/review.md`. The lint first (`scripts/sloplint.mjs --render`):
every FAIL is fixed before anything else. Then full-page screenshots at
desktop and 390 px, the anti-pattern check on them and on the source, the
3-second test and the fit test, a design critique, the detector on the served
page if the person said yes to it in step 1, the fresh-eyes review of the whole
page, the short test battery. Fix what fails. Score strictly against the table: anything off
the list goes under "also found", not into the score.

### STOP 2: the person judges

Show the screenshots and the review: what passed, what failed, what you
could not test. The person decides if it's done. Nothing goes public (deploy,
README claims, scores) before this answer.

If the person wants a short video of the page (the scroll, a title card),
offer HyperFrames as a job in `references/tool-slots.md`. It renders the HTML
to an MP4 and needs Node 22 or newer and FFmpeg. Only do it on a yes.

### 8. Log the style

Add an entry following `references/style-log.md`: to `20 Projects/` in the
vault if there is one, otherwise to `design/style-log.md` in the project.
Do it when the first version is approved, not at the end of the project.

## Short commands, after the page exists

Small jobs on a page that already exists, without the brief, the research or
the three directions. Each one reads `design/direction.md` when there is one
(the look it must keep), changes only its own part, runs the lint, and shows
before and after. Called as `/super-webdesigner <command> [target]`, or when
the request clearly names one ("just fix the texts", "make it calmer"). The
full method of each is in `references/commands.md`.

| Command | What it does |
|---|---|
| `polish` | Final pass on details: spacing, alignment, states, browser defaults. The design stays |
| `bolder` | More presence: scale, contrast, a stronger hero. Same direction, louder |
| `quieter` | Calms what shouts: fewer effects, less colour, slower motion |
| `distill` | Cuts what doesn't earn its place: sections, words, decorations |
| `harden` | Forms, errors, empty and loading states, long text, slow network |
| `clarify` | Only the copy of controls and messages: buttons, labels, errors |
| `adapt` | Only phone and tablet: layout, touch targets, type sizes |
| `lint` | Runs `scripts/sloplint.mjs --render` and reports, changes nothing |

Without a command and with a page that exists, ask once which one fits, or
whether the person wants the full redesign.

## Answer format during the flow

Keep messages short and in this order: what you understood, what you read or
found, what you will do, the result, and a single question only if you are
blocked.

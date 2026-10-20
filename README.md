<div align="center">

<br>

<a href="https://super-webdesigner.vercel.app">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/readme/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset=".github/readme/logo-light.png">
    <img src=".github/readme/logo-light.png" alt="Super-Webdesigner" width="420">
  </picture>
</a>

<br><br>

**Same prompt. Different designer.**<br>
Skills that stop coding agents from shipping the same AI-looking page.

<a href="https://super-webdesigner.vercel.app"><img src="https://img.shields.io/badge/site-super--webdesigner-e5231b?style=flat-square" alt="Website"></a> <img src="https://img.shields.io/badge/skills-2-111111?style=flat-square" alt="2 skills"> <img src="https://img.shields.io/badge/Claude_Code-ready-111111?style=flat-square" alt="Claude Code"> <img src="https://img.shields.io/badge/works_with-Codex_·_Cursor-111111?style=flat-square" alt="Works with Codex and Cursor"> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license"></a>

[Website](https://super-webdesigner.vercel.app) · [See the difference](#see-the-difference) · [The flow](#the-flow) · [Install](#install) · [The vault](#recommended-a-vault)

</div>

---

Your coding agent designs the same page for everyone: a centered hero, three
cards, a purple gradient, emoji in the copy. Super-Webdesigner is two skills
that change how it works. Before any code, the agent asks you a brief,
researches real sites in the niche, and shows you three directions. It waits
for your pick. Then it builds, and checks the result against the ten tells of
an AI-made page.

## See the difference

Same prompt in both: *Build a landing page for an AI meeting-notes app.*

<img src=".github/readme/compare-side-by-side.webp" alt="Left: a caricature of the usual AI page, purple gradient, serif title, emoji and three cards. Right: Steno, made through Super-Webdesigner's flow: a legal pad, a plain title and a notes card" width="100%">

<p align="center"><img src=".github/readme/compare-slider.webp" alt="The comparison slider sweeping from one side to the other" width="720"></p>

**[Drag the line yourself →](https://super-webdesigner.vercel.app)**

The left side is a **caricature**, built on purpose to show all ten tells at
once. It is not an agent's real output. The repo has a real one:
[`examples/burger/normal-agent/`](examples/burger/normal-agent) is what a
normal agent produced for a burger place, untouched. It scores 2 of 10 on the
tells (watch it). The Steno side is fictional and went through the flow end
to end; its files are in [`examples/ai-notes/`](examples/ai-notes).

## The flow

Three stops wait for you. Everything between them the agent does on its own.

| # | Step | You |
|---|---|---|
| 1 | **Discover the tools.** Lists the skills, MCP servers and browser the agent has, and what's missing, with the install command. | |
| 2 | **The brief.** Four questions, with options to click: a real object the palette comes from, one feeling, two influences to collide, what the page must never look like. The cost of any paid mockups comes in the same message. | **Stop: answer** |
| 3 | **Research the niche.** Real sites, split into what visitors expect (kept) and what everyone repeats (avoided). | |
| 4 | **Three directions.** Gray skeletons for phone and desktop, plus a colored mockup each: the best of the niche, one that breaks it, one from outside it. Each has its logo, favicon and motion. | |
| 5 | **You choose.** One question: which of the three, or what to mix. | **Stop: choose** |
| 6 | **Write it down.** The direction becomes a file: palette, fonts, the wildcard element, the motion. It is the contract for the build. | |
| 7 | **Build.** Half the effort on the first screen, with the motion the direction asked for. | |
| 8 | **Review.** Full-page screenshots at 1440 and 390 px, the ten tells, a design critique, forms, contrast. | **Stop: judge** |

## The ten tells

What a page looks like when the agent decides alone. Each one alone looks like
a choice. Three or more together and it reads as AI-made.

| Tell | What it looks like | |
|---|---|---|
| Purple-to-blue gradient | Background or buttons fading violet into blue | |
| Serif title by default | An italic serif hero, as the agent's shortcut for "elegant" | |
| Grid or dot background | Squares or dots filling empty space | |
| Three generic cards | Icon, title, two lines, three times in a row | |
| Emoji in the copy | Emoji as bullets, headings or menu pictures | |
| Glow on everything | Every button and border glowing | |
| The usual layout | Hero, cards, testimonials, FAQ, CTA, in that order | |
| Thin generic icons | The default line-icon set on every card | |
| Nothing moving | A page that is static from top to bottom | |
| 01 / 02 / 03 | Numbering on things that have no order | |

The skill checks these on **full-page** screenshots and on the source. A
first-screen screenshot alone can't show most of them, so the skill asks for
the rest rather than scoring what it can't see.

## Install

Two skills: `super-webdesigner` (the flow) and `ai-slop-check` (the audit on
its own, for any URL or screenshot).

**Claude Code**

```bash
npx skills add JouberthAlves/super-webdesigner -g -a claude-code
```

Then ask for a site the way you always do: *"build a website for a bakery"*.
The skill takes it from there.

**Codex, OpenCode and others**

```bash
npx skills add JouberthAlves/super-webdesigner -a codex
```

**Cursor, Copilot, or any agent without skill support:** add a rule (for
example `.cursor/rules/` or `AGENTS.md`) that says *"for any site or UI
request, read `skills/super-webdesigner/SKILL.md` and follow it, reading the
files in `references/` when a step says so."*

## Tools, by job

The skill asks for a **job**, never a specific tool. Here is what each job
uses in Claude Code, and the equivalent elsewhere. The full table, with the
manual fallback for each, is in
[`tool-slots.md`](skills/super-webdesigner/references/tool-slots.md).

| Job | Claude Code | Other agents |
|---|---|---|
| Research real sites | Web search and the built-in browser | Playwright MCP, or links you send |
| Gray skeletons | An Artifact | A local HTML file |
| Colored mockups | An image MCP (Magnific, GPT-image models) | ChatGPT, or a prompt you paste |
| Components and docs | shadcn, React Bits, Context7 | The same, through MCP |
| Animation | GSAP skills | GSAP skills, or the GSAP docs |
| Design critique | Anthropic's design plugin | The review checklist |

Paid tools get one rule: the agent says what it will cost, and waits for a yes.

## Recommended: a vault

Agents don't remember anything between sessions. The
[`vault/`](vault) folder is a small Obsidian vault that works as their memory:

- `90 System/Agent rules.md`: every rule in force, one per line. The only file read every session.
- `90 System/Mistakes.md` and `Wins.md`: what went wrong and what got praised, each turned into a one-line rule.
- `10 Notes/`: the design brief, research, skeletons, anti-patterns and design rules.
- `20 Projects/`: one note per project, so the same style is never shipped twice.

Obsidian is recommended, not required: the files are plain Markdown and any
agent can read them. Open `vault/` as a vault and run your agent inside it.
An optional Claude Code hook re-injects the rules after the context is
compacted. Setup details are in [`vault/README.md`](vault/README.md).

## How it works

```text
skills/super-webdesigner/   the flow: SKILL.md and references/ (brief, research, skeletons, review…)
skills/ai-slop-check/       the audit on its own
vault/                      the starter Obsidian vault
examples/burger/            the normal-agent output, untouched, and a full run of the flow
examples/ai-notes/          the Steno run and the caricature
design/                     the showcase page's own brief and direction
site/                       this page, with the drag comparison and the motion
```

The site is static HTML, CSS and JavaScript, with GSAP, ScrollTrigger and
DrawSVG from jsDelivr. Everything that moves is off when the visitor asks for
reduced motion. Vercel publishes it on every push to `main`.

## Verification

- The showcase was screenshotted in headless Chrome at 1440 and 390 px, with
  no horizontal scroll at either size. Its motion was checked by scrolling to
  each section and capturing the state.
- The skill was run end to end in the session that wrote it. A clean-room run
  with a fresh agent (only the skill on disk) found and stopped at the brief,
  and exposed a contradiction around the cost question, which is now fixed
  ([`clean-room-test.md`](examples/clean-room-test.md)). That run was a
  subagent. A later headless run in a new Claude Code session, with only the
  one-line prompt *"build a website for a small bakery"*, triggered the skill
  on its own, showed the tools table and stopped at the brief, with no code
  ([`trigger-test.md`](examples/trigger-test.md), one run).
- The Ember & Bun score (2 of 10) was corrected after a fresh check found the
  first 3 of 10 counted something that isn't one of the tells.
- Not run: Lighthouse against the deployed URL, real iOS Safari, a screen
  reader pass.

## Credits

The brief questions, the anti-convergence rules and the conversion equation
are adapted from
[2389-research/landing-page-design](https://github.com/2389-research/landing-page-design)
(MIT). The showcase uses [GSAP](https://gsap.com) and fonts from Google Fonts
(OFL). Steno, MeetMind, Order 27 and Ember & Bun are fictional; the photos in
the examples were generated for this demo.

## License

Released under the [MIT license](LICENSE).

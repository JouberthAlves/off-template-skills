# Trigger test: does the skill fire on a one-line prompt?

The clean-room test (`clean-room-test.md`) gave the skill to a subagent that
was told about it. This test asks the question it left open: a new Claude
Code session, the skill installed the way the README says, and only the
prompt a visitor would type.

Date: 2026-10-20. Claude Code 2.1.304 in a cloud sandbox, headless
(`claude -p`).

## Setup

- Empty folder outside the repo, nothing else in it (no vault, no
  `package.json`).
- `npx skills add JouberthAlves/off-template-skills -a claude-code`, run in that
  folder. The skills come from the GitHub `main` branch. It installed
  `off-template` and `ai-slop-check` into `.claude/skills/` (project
  scope; the `-g` flag was not used, so nothing went to `~/.claude`).
- A new session, prompt exactly: `build a website for a small bakery`
  (`claude -p`, `--output-format stream-json`, so every tool call is logged).

## Checks

| # | Check | Result |
|---|---|---|
| 1 | The skill is triggered on its own | **Passed.** First tool call: `Skill` with `{"skill": "off-template"}`. Nothing in the prompt names it. |
| 2 | The tools table is shown | **Passed.** A table of jobs (research, skeletons, colored mockups, components, animation, screenshots, critique) with a status each, drawn from what the session has. It marked colored mockups and GSAP as `missing`, and asked before installing GSAP. |
| 3 | It stops at the 4 brief questions, no code | **Passed.** It asked the 4 brief questions (place or object, feeling, two influences, what it must never look like) and then waited. No file was written: the only tool calls after the skill were two `ls`/`cat` reads inside the skill folder. |

## Observed, not a failure

- **Three extra questions.** Before the brief, the agent also asked for the
  bakery's name, what it sells, and the location and clientele with the one
  action wanted from visitors. The skill's brief does not list these as
  steps. They are reasonable for a bakery, but they make the first stop
  longer than the four questions the README describes. Worth deciding
  whether they belong in the brief.
- **Offer to install GSAP.** It suggested `npx skills add
  https://github.com/greensock/gsap-skills` and asked. That is the behavior
  the README promises ("nothing gets installed without a yes").
- **One run.** This is a single trial. A second run could show whether the
  trigger is stable.

## Not tested here

- Interactive Claude Code (the desktop app and the CLI REPL). `-p` mode can't
  show the clickable question cards, so the answer format was checked as text.
- Other agents (Codex, Cursor): the skill was installed only for Claude Code.

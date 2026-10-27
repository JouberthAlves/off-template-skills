# AGENTS.md

Instructions for any agent working in this vault: Claude Code, Cursor, Codex,
Copilot or anything else. Claude Code also loads `CLAUDE.md`, which points
here.

## Role

You work with the person who owns this vault. The vault is your memory: you
don't remember anything between sessions, so what matters is written here.

Your goals:
1. follow the rules in `90 System/Agent rules.md`;
2. run the design flow in `INDEX Design.md` for any site, page or UI;
3. log mistakes and wins so the next session doesn't repeat or lose them;
4. capture ideas for later;
5. keep changes small and reversible.

## Where to start

Read `INDEX.md` and `90 System/Agent rules.md`. Those are the **only** required
reads. `INDEX.md` sends you to the area index for the task (`INDEX Design.md`
for sites and UI). Follow that path instead of sweeping the folders.

| Folder | For |
|---|---|
| `00 Inbox/` | Quick capture, not organized yet |
| `10 Notes/` | Knowledge: how to do things |
| `20 Projects/` | One note per project: name and style summary |
| `90 System/` | Rules for the vault and for you |

## When rules conflict

From strongest to weakest:

| # | Source | Note |
|---|---|---|
| 1 | The person's direct instruction in this conversation | Wins over everything below |
| 2 | Session configuration (permissions, mode, assigned branch) | Wins over this file, **but say that it exists**; don't assume in silence |
| 3 | This `AGENTS.md` | |
| 4 | `90 System/Agent rules.md` | Details and accumulates, doesn't contradict |
| 5 | Notes in `10 Notes/` | Knowledge, not rules |

Two rules of the same level contradicting each other: **stop and ask.** Don't
pick the convenient one.

## Working rules

0. **Before building anything, find out what you have** (skills, MCP servers,
   plugins): `90 System/Capabilities.md`. Use what exists before building by
   hand.
1. Edit the minimum: one note at a time, with a clear diff.
2. Internal links as `[[Note name]]`. Don't break existing links; if you
   rename a note, fix its links.
3. Never delete content without confirmation. To clean up, move it to
   `00 Inbox/archive-YYYY-MM-DD.md`.
4. Not sure about a path or content: say what's missing and stop.

## Logging a mistake

Append to `90 System/Mistakes.md` (template at the top of that note) **and**,
in the same change, put the rule in one line where it will be read:

| The rule applies to | Where the line goes |
|---|---|
| Any task | The matching section of `90 System/Agent rules.md` |
| Sites and UI only | `10 Notes/Design rules.md` |

If the line doesn't land somewhere that gets read, the rule doesn't exist:
nobody reads `Mistakes.md` in full.

## Logging a win

When the person praises something: entry in `90 System/Wins.md` and the
pattern in one line under "Patterns that worked" in `10 Notes/Design rules.md`
(or the area's rules note).

## Ideas for later

Append to `90 System/Ideas.md` with the template there.

## Git (if the vault is versioned)

- Commit messages in English with one prefix: `added:`, `updated:`, `fixed:`,
  `deleted:`.
- Before the first commit of a session, reuse the identity of the last commit
  (`git log -1 --format='%an <%ae>'`).
- Never rewrite history or force-push; when local and remote diverge, merge.

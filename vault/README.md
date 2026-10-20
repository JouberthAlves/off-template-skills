# Starter vault

A small Obsidian vault that works as your agent's memory. Agents don't
remember anything between sessions; this folder is where rules, mistakes, wins
and past project styles live, so every session starts from what the last one
learned.

It's plain Markdown. Obsidian is **recommended, not required**: it gives you
the link graph, search and an easy way to edit the rules by hand. Any agent
can read the files without it.

## Setup

1. Copy this `vault/` folder wherever you keep notes (and put it in git: the
   history is useful).
2. Obsidian: **Open folder as vault** → pick the folder.
3. Open your agent **inside the folder** (Claude Code: `claude` in that
   folder, or open it in the desktop app). Claude Code loads `CLAUDE.md`,
   which points to `AGENTS.md`. Codex reads `AGENTS.md` directly. Cursor:
   add a rule that says "Read AGENTS.md before acting".
4. Optional, Claude Code: copy `.claude/settings.example.json` to
   `.claude/settings.json`. A SessionStart hook will then inject
   `90 System/Agent rules.md` at the start of every session and again after
   the context is compacted, so the rules never get lost in a long session.

To work on a project in another folder, either open the agent in the vault and
point it to the project path, or add a line to the project's `CLAUDE.md` /
`AGENTS.md`: "Before any design work, read `<vault path>/AGENTS.md`".

## What's inside

| Path | What it is |
|---|---|
| `AGENTS.md` | Entry point for any agent: role, precedence, how to log |
| `INDEX.md` | Top level: where to go for each kind of task |
| `INDEX Design.md` | The required checklist for any site, page or UI |
| `10 Notes/` | The design brief, research, skeletons, anti-patterns, design rules, niche styles |
| `20 Projects/` | One note per project (template inside), so styles aren't repeated |
| `90 System/Agent rules.md` | Every rule in force, one per line: the only required read |
| `90 System/Mistakes.md`, `Wins.md` | What went wrong and what got praised, each turned into a one-line rule |
| `90 System/Capabilities.md`, `Tool usage.md` | How to discover tools, and the rules for each paid or media tool |

## How it grows

You don't edit most of it by hand. When the agent makes a mistake you
correct, it logs it in `Mistakes.md` and adds a one-line rule where it will be
read. When you praise something, it logs it in `Wins.md` and adds a pattern
to `Design rules.md`. Every finished project gets a note in `20 Projects/`.
After a few projects, the vault is yours: your taste, your rules, your
history.

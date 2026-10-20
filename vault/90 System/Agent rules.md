---
type: system
---

# Agent rules

**The only required read in the vault**, together with [[INDEX]]. Every rule
in force is here, one per line, grouped by subject. The story behind each one
(what happened, wrong → right) lives in [[Mistakes]] and [[Wins]], which are
for lookup only.

Area rules (design, sales...) live in the area's rules note, not here.
Keep this file short: the optional hook injects it into every session and has
a size limit.

## Every session

- Before the first action: read [[INDEX]] and this file. Then only the notes of the task's area.
- When the conversation gets summarized (context compacted, "continuing from a previous conversation"), re-read this file before the next action: the summary keeps what was done, not the rules.
- Not sure about the path or the content: stop and say what's missing.
- Open request for examples or options: list the ideas and let the person choose before building.
- Before building, discover the skills, MCP servers and plugins available ([[Capabilities]]); discovery is the truth, the note is an old snapshot.
- Before using a tool that has a section in [[Tool usage]], follow its rules (e.g. say the cost before generating).
- Check the docs before claiming how a tool or library works, especially when the person will build on top of it.
- When writing down a path, say in which environment it was seen; before following a noted path, check it on the current machine.
- An MCP server that doesn't show up: test it (process, tool list, one read call) before declaring it unavailable.
- Never skip a step of a checklist in silence: say which one and why.
- Answer in this order: Understood → What I read → Action → Result → Single question (only if blocked).

## Thinking differently

- Never decide an aesthetic alone: brief, research, 3 directions, the person chooses.
- No color hex from memory: color comes from a real-world reference or the client's own material.
- Don't repeat a whole style (reference + feeling + collision) across projects: read `20 Projects/` first.
- Research separates what visitors expect (keep) from what everyone repeats (avoid). Never copy the niche's look.
- Prefer a ready piece (library component, skill, MCP tool) over a hand-made one; check its license.
- A finished page is not done until the anti-patterns ran on its screenshot.

## Logging (when fixing, not at the end of the session)

- Non-trivial mistake: full entry at the end of [[Mistakes]] **and** the rule in one line here, in its section. Test: would a future agent, without this conversation, fall into it again?
- Rule that only applies to one area: goes to that area's rules note (design: [[Design rules]]), not here.
- Praise from the person: entry in [[Wins]] and the pattern in one line under "Patterns that worked" in the area's rules note.
- Idea for later: [[Ideas]].

## Git

- Messages in English with `added:`, `updated:`, `fixed:` or `deleted:`.
- Before the first commit, reuse the identity of the last commit.
- Diagnose with a read-only command before anything that rewrites history or deletes files.
- Local and remote diverged: merge, never force-push.

## Vault

- Folders: `00 Inbox/`, `10 Notes/`, `20 Projects/`, `90 System/`. Don't create others; no loose notes at the root besides indexes.
- Links as `[[Note name]]`. Renamed a note: fix its links.
- Never delete content without confirmation: archive to `00 Inbox/archive-YYYY-MM-DD.md`.
- A note read every session (INDEX, this file) stays short: one line per rule. Details and history go to lookup notes.

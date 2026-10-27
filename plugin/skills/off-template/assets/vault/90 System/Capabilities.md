---
type: system
---

# Capabilities

What the agent has at hand: skills, MCP servers and plugins.

## Rule

**Before building anything, find out what you already have.** Half of what an
agent builds by hand already exists as a skill, an MCP tool or a library
component (shadcn, React Bits). Checking costs one call; rebuilding costs the
session.

Order:
1. Run the discovery below. It's the source of truth.
2. A skill or MCP exists for the job: use it.
3. Nothing exists: then build by hand.
4. What was missing was installable: log it in [[Ideas]] with the exact name.

Any list of tools written in a note is a **snapshot, not the truth**. It ages
every session. Never decide "I don't have X" from a note.

## How to discover

### Claude Code

| What | How |
|---|---|
| Skills | The skill list in the system prompt; `ListSkills` if available |
| MCP servers | `/mcp`, or `claude mcp list` in a terminal |
| Deferred MCP tools | `ToolSearch` with a keyword: many tools only show their name until loaded |
| Plugins | `/plugin`, or `ListPlugins` |
| Skills on disk | `~/.claude/skills/`, `<repo>/.claude/skills/`, `~/.claude/plugins/` |

### Other agents

| Agent | MCP config | Instructions |
|---|---|---|
| Cursor | `~/.cursor/mcp.json`, `.cursor/mcp.json` | `.cursor/rules/` |
| Codex CLI | `~/.codex/config.toml` | `AGENTS.md` |
| Copilot (VS Code) | `.vscode/mcp.json` | `.github/copilot-instructions.md` |

Skills are not a market standard: they're a folder with a `SKILL.md`. Any
agent that can read files can read one and follow it by hand.

## Installing

- **Skill:** `npx skills add <github-repo>` (add `--agent <name>` for
  non-Claude agents), or copy the folder to `~/.claude/skills/<name>/`.
  To write a new skill, use the `skill-creator` skill.
- **MCP server (connector):** in the client's settings or MCP config. The
  connection is the person's (usually OAuth). **Never paste tokens or keys
  into this vault**, and never ask the person for them.
- **Plugin (Claude Code only):** `/plugin marketplace add <repo>`, then
  `/plugin install <name>`.

Always ask the person before installing.

## Snapshot

Write here what you found in the last discovery, with the date and the
machine. It's only a reminder: run the discovery again anyway.

| Date | Machine | Skills | MCP servers |
|---|---|---|---|
| | | | |

See also: [[Tool usage]] · [[Agent rules]]

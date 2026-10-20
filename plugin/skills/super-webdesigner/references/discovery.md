# Discovery: what can this agent do right now?

Half of what an agent builds by hand already exists as a skill, an MCP tool or
a library component. Checking costs one call; rebuilding costs the session.

Tools change per session and per client: a skill gets added, a connector
disconnects, the person switches from Claude Code to Cursor. So never decide
"I don't have X" from memory or from a note. Run the checks below.

## Claude Code

| What | How |
|---|---|
| Skills | The skill list in your own system prompt; `ListSkills` if available |
| MCP servers of the session | `/mcp` (interactive), or `claude mcp list` in a terminal |
| MCP tools not loaded yet | Many tools are **deferred**: only the name shows up. Search with `ToolSearch` and a keyword ("image", "browser", "figma") before saying a tool doesn't exist. It also waits for servers still connecting |
| Plugins | `/plugin`, or `ListPlugins` if available |
| Account connectors (claude.ai) | `ListConnectors` / connector search, if available |
| Skills on disk | `~/.claude/skills/*/SKILL.md` (personal), `<repo>/.claude/skills/*/SKILL.md` (project), `~/.claude/plugins/` |

An MCP server that is configured but not showing: test it before declaring it
unavailable (is the process running, does `tools/list` answer).

## Cursor

- MCP: `~/.cursor/mcp.json` and `.cursor/mcp.json` in the project; Settings → MCP shows status.
- Rules: `.cursor/rules/`, Settings → Rules (remote rules from GitHub are supported).
- No native skills: read any `SKILL.md` you find and follow it by hand.

## Codex CLI

- MCP: `~/.codex/config.toml` (`[mcp_servers.*]`).
- Instructions: `AGENTS.md` in the repo and `~/.codex/AGENTS.md`.
- Skills: `~/.codex/skills/` when installed with `npx skills add ... -a codex`.

## GitHub Copilot (VS Code)

- MCP: `.vscode/mcp.json` or the `mcp` section of the user `settings.json`.
- Instructions: `.github/copilot-instructions.md`, `AGENTS.md`.

## Any other agent

There is no universal command. Look for the client's MCP config file (search
the home folder for `mcp.json` / `mcp_servers`), and for `SKILL.md` files.
A skill is just a folder with a markdown file: any agent that can read files
can follow one.

## Also check

- **A browser you can drive** (built-in browser pane, Playwright, Chrome MCP):
  needed for research screenshots and for the review.
- **Image generation** (an image MCP, or a desktop app the person uses).
- **Web search.**
- **Libraries already in the project** (`package.json`): shadcn/ui, GSAP,
  Motion, Three.js. Use what is there before adding something new.

## Output: the coverage table

Show it to the person in one short message, then move on:

```
Job                         Tool                          Status
Research real sites         web search + built-in browser  ok
Gray skeletons              Claude Artifact                ok
Colored mockups             (none found)                   missing -> options below
Component libraries         Context7                       ok
Animation                   gsap-skills                    missing -> options below
Screenshots and tests       built-in browser               ok
Design critique             design:design-critique         ok
```

For each `missing`: 1 or 2 options from `tool-slots.md`, the exact install
command, and the question "install it, or should I use the manual fallback?".
Never install without a yes. Never ask the person for tokens or API keys to
"configure" a tool: connections are made by the person, in their own client.

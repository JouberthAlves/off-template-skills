# Tool slots: jobs, not tools

Every step of the flow asks for a **job**. This skill is written for
**Claude Code first**: the first column is the default. The second column is
how to get the same job done in Cursor, Codex, Copilot or any other agent. The
last column is the fallback when nothing is available.

Commands were taken from each project's official README. If one fails, read
the README again before improvising: tools change.

## The table

| Job | Claude Code (default) | Other agents | Manual fallback |
|---|---|---|---|
| **Research real sites** | `WebSearch` + the built-in browser (`navigate`, `screenshot`, `get_page_text`) or Claude in Chrome | Agent's web search + Playwright MCP (`npx @playwright/mcp@latest` in the MCP config) or a browser MCP | Ask the person for 5+ links and analyze them |
| **Gray skeletons** | **Artifact** (private HTML page, opens on the phone by link, updates in place after feedback) | A local HTML file served (`npx serve`) and opened in the browser; Figma MCP if connected | ASCII blocks in the chat |
| **Colored mockups with legible text** | An image MCP connected in Claude (e.g. Magnific with the GPT 2 model) | Same MCP in the agent's MCP config; ChatGPT image generation | Write the full prompt (`mockups.md`); the person pastes it into ChatGPT or another image tool and sends the result back |
| **Ready-made components** | shadcn/ui, React Bits, Magic UI, looked up through **Context7** | The same libraries; shadcn MCP (`npx shadcn@latest mcp init`) | Build by hand from the docs |
| **Library docs** | **Context7** (`npx ctx7 setup --claude`) | Context7 MCP in the agent's config (see context7.com) | Web search on the official docs |
| **Site animation** | **GSAP skills**: `npx skills add https://github.com/greensock/gsap-skills` | `npx skills add ... --agent <name>`; Cursor: Settings → Rules → Remote Rule → `greensock/gsap-skills` | GSAP or Motion docs, by hand |
| **Isometric explainer figures** | **anatomy**: `npx skills add wheresryan22/anatomy -g -a claude-code` | `-a codex`, `-a opencode` (no Cursor target) | Hand-drawn SVG |
| **Video from HTML** (page scrolling, story, title card) | **HyperFrames** plugin: `claude plugin marketplace add heygen-com/hyperframes`, then `claude plugin install hyperframes@hyperframes` | `npx skills add heygen-com/hyperframes` | Screen recording |
| **Screenshots and tests** | Built-in browser (`resize_window` for 390 px, `read_console_messages`) | Playwright MCP or a Playwright script | Ask the person for screenshots |
| **Design critique** | `design:design-critique` from Anthropic's **design** plugin | Run `review.md` by hand; any critique skill the agent has | Run `review.md` by hand, carefully |

## Skills in agents that don't load skills

Cursor, Copilot and others don't load `SKILL.md` on their own. Two ways:

1. Install with `npx skills add <repo> --agent <name>` when the agent is
   supported (it copies to the right folder).
2. Otherwise, add a rule/instruction file that says: "For any website, page or
   UI request, read `skills/super-designer/SKILL.md` and follow it, reading the
   files in `references/` when a step says so." Cursor: `.cursor/rules/`.
   Codex: `AGENTS.md`. Copilot: `.github/copilot-instructions.md`.

The Claude-only tools named in the flow map like this:

| In the flow | Claude Code | Other agents |
|---|---|---|
| Find deferred tools | `ToolSearch` | Read the MCP config file |
| Show a page to the person | Artifact | Local HTML file + its path or a local URL |
| Ask a multiple-choice question | `AskUserQuestion` | A numbered list in the chat |
| Drive a browser | Built-in browser / Claude in Chrome | Playwright MCP |

## Rules that go with the tools

- **Paid or credit-based tools:** estimate the cost (most have a cost or
  balance call), then tell the person: "This will cost X credits out of Y
  (Z left)." For a batch, give the total and the per-item cost. Generate only
  after a yes. Credits don't come back.
- **HyperFrames does not generate images or footage.** It renders what is in
  the HTML into MP4. Animation on the site itself is GSAP's (or Motion's) job.
- **Keep the license of every component.** Some (e.g. React Bits pieces under
  MIT + Commons Clause) can decorate a site but can't be resold inside a
  component library. Credit them when the license asks.
- **Docs before claims.** Before saying how a library works, look it up.

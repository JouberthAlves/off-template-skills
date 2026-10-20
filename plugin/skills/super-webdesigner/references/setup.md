# Setup: the person's agent, configured once

Installing the skill copies files; it runs nothing. So the setup questions
come the first time the skill is used in a project, not during
`npx skills add`. Ask them once, in the STOP 0 message, and save the answers.

## When

- `design/setup.md` is missing in the project: ask the setup questions at
  STOP 0, after the brief, in the same message.
- `design/setup.md` exists: read it, skip the questions, and say what you
  took from it ("using pnpm and Vercel, from design/setup.md"). The person
  can ask to change any answer.

## The questions

Offer options, as in the brief, so answering is a click. Keep the list short:
five or six questions. Skip any the person already answered in the prompt.

1. **Stack.** Plain HTML, CSS and JS / React with Vite / Next.js / Astro / "you
   pick, and say why".
2. **Commit convention.** Conventional commits (`feat:`, `fix:`) / the
   `added:`, `updated:`, `fixed:` prefixes / free text / "ask me each time".
3. **Language.** Copy and UI in English / in Portuguese / in both / other.
4. **Deploy.** Vercel / Netlify / GitHub Pages / not decided yet.
5. **Accessibility floor.** WCAG AA is the default for every site (contrast,
   focus, reduced motion). Ask only if the person wants more or less: "AA
   (default) / AAA on the text / just reduced motion".
6. **Vault.** Use an Obsidian vault as the agent's memory: yes, and where /
   no / "not now".

Question 6 is for the person's own memory of the rules. Explain it in one
line when you ask: the vault keeps the rules and the styles used, so the next
session doesn't repeat them.

## Saving the answers

Write `design/setup.md` in the project, one line per answer:

```
# Setup
- Stack: <answer>
- Commit convention: <answer>
- Language: <answer>
- Deploy: <answer>
- Accessibility: <answer>
- Vault: <answer or path>
- Set on: <date>
```

Then use it for the rest of the flow: the stack decides the build in step 6,
the commit convention decides how you commit, the language decides the copy
(the brief's copy stays in the person's language).

## What the setup never covers

- Connections, tokens and API keys. The person makes those in their own client
  ("Never ask the person for tokens or API keys").
- The direction. Style is the brief's job (`brief.md`), not the setup's.

# Style log

The "don't repeat a style" rule only works if the styles are written down.
Every project gets an entry when its first version is ready, not at the end.

## Where

- With a vault: one note per project in `20 Projects/<Project name>.md`
  (template in `20 Projects/_template.md`).
- Without a vault: append to `design/style-log.md` in the project. If the
  person keeps several projects, suggest a shared vault so the log lives in
  one place.

## Entry

```markdown
---
type: project
created: YYYY-MM-DD
folder: <project path>
---

# <Project name>

**Style:** <named vibe, 2-4 words>

<2 to 4 sentences: the real-world reference, the feeling of the first 3
seconds, the two influences that collided, and the wildcard element.>

**Palette:** <hexes> · **Fonts:** <families>
```

If the project changes style later, update the entry instead of adding a new
one.

## Reading it

Before choosing directions for a new project, read every entry. Color and
font can come back. The whole combination (reference + feeling + collision)
cannot.

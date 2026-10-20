---
type: system
---

# Mistakes

Append only. The history behind the rules in [[Agent rules]] and
[[Design rules]]. Nobody reads this in full: the one-line rule is what
matters, so always add it where it will be read.

## Template

```
## YYYY-MM-DD: short title
- **What happened:** ...
- **Why it was wrong:** ...
- **Rule from now on:** (imperative, one line)
- **Wrong → right:** ...
- **Line added to:** Agent rules > (section), or Design rules
```

## Example (delete when you add the first real one)

## YYYY-MM-DD: built a site before showing directions
- **What happened:** the request already had palette, fonts and sections, so the agent coded straight away. The result looked like every other AI page.
- **Why it was wrong:** a detailed request is still not a chosen aesthetic. The agent filled the gaps with its defaults.
- **Rule from now on:** no code before the person picks one of 3 directions, even with a detailed request.
- **Wrong → right:** "Here's your site" → "Here are 3 directions (skeleton + mockup each). Which one, or what should I mix?"
- **Line added to:** Design rules > Process

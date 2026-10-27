---
type: system
---

# Mistakes

Append only. The history behind the rules in [[Agent rules]] and
[[Design rules]]. Nobody reads this in full: the one-line rule is what
matters, so always add it where it will be read.

The entries below come with the vault: real mistakes from the projects the
off-template skill was built on, already turned into rules. Keep them, or
delete them once you have your own.

## Template

```
## YYYY-MM-DD: short title
- **What happened:** ...
- **Why it was wrong:** ...
- **Rule from now on:** (imperative, one line)
- **Wrong → right:** ...
- **Line added to:** Agent rules > (section), or Design rules
```

## 2026-09-28: answered the brief questions myself
- **What happened:** the prompt was one line ("a site for a home-style restaurant"). The agent filled in the reference, the feeling and the influences itself and went straight to directions.
- **Why it was wrong:** the brief is where the person's taste enters. Answered by the agent, it produces the agent's default page with extra steps.
- **Rule from now on:** ask the 4 brief questions every time; only answer them yourself when the person says "you decide" in words.
- **Wrong → right:** "I imagined a cozy rustic feel" → "Which real place or object should this feel like? a) the counter order pad b) grandma's kitchen c) a roadside diner d) other"
- **Line added to:** Agent rules > Thinking differently

## 2026-09-28: a phone field that was only a placeholder
- **What happened:** the contact form had `placeholder="(11) 99999-9999"` and nothing else. Letters, 40 digits and pasted paragraphs all went through to the WhatsApp message.
- **Why it was wrong:** a placeholder shows the format, it doesn't enforce it. The message the business received was broken.
- **Rule from now on:** every field gets real handling (mask, `maxLength`, counter, type), and the same limits on the server.
- **Wrong → right:** a bare `<input placeholder>` → a masked phone field that refuses letters on typing and paste
- **Line added to:** Design rules > Forms

## 2026-10-01: ran so far from generic that the site got ugly
- **What happened:** to avoid the barbershop clichés, the direction took a cold, technical look with mono labels and hard shadows. Customers of the niche didn't recognize it as a barbershop.
- **Why it was wrong:** avoiding clichés is not the goal. The page has to look like the business and make people want it.
- **Rule from now on:** direction A is one a customer of the niche recognizes in 3 seconds; the other two take the risks.
- **Wrong → right:** "a barbershop that looks like a spec sheet" → "the best barbershop site in town, then two bolder options"
- **Line added to:** Design rules > Process

## 2026-10-02: showed only the gray skeletons
- **What happened:** the three directions went out as gray skeletons; the colored mockups were offered as "optional, if you want".
- **Why it was wrong:** nobody chooses a look from gray boxes. The person picked blind and asked for changes after the build.
- **Rule from now on:** skeletons and one colored mockup per direction go out together, before asking for the choice.
- **Wrong → right:** "here are 3 skeletons, want mockups too?" → "here are 3 skeletons and their mockups; I recommend B because…"
- **Line added to:** Design rules > Process

## 2026-10-15: "no sideways scroll on phones" that wasn't true
- **What happened:** the check ran in a narrow desktop window. On a real phone emulation one long word in the display title pushed the page sideways.
- **Why it was wrong:** a narrow window is not a phone: no touch, no mobile viewport rules.
- **Rule from now on:** test sideways scroll with mobile emulation at 375, 768 and 1024 px, every page; size wide titles by their column (`cqi`).
- **Wrong → right:** "checked at 390 px, fine" → "checked with mobile emulation at 375/768/1024, every page, no sideways scroll"
- **Line added to:** Design rules > Visual and media

## 2026-10-16: a shader background that froze machines without a GPU
- **What happened:** a WebGL hero ran at full resolution from the first frame. On an office PC without GPU acceleration the page stuttered and scrolling froze.
- **Why it was wrong:** the visitor's machine is not the developer's machine.
- **Rule from now on:** WebGL only with a real GPU, DPR 1, started on idle and paused off-screen; run Lighthouse mobile before delivering.
- **Wrong → right:** a shader on load at DPR 2 → a still frame first, the shader on idle, off when hidden
- **Line added to:** Design rules > Visual and media

## 2026-10-20: delivered sites with almost no motion
- **What happened:** two pages shipped with only a hover color change. They read as static templates.
- **Why it was wrong:** a page with nothing moving is one of the AI tells. Motion has to be planned per direction, not added at the end.
- **Rule from now on:** every direction defines its motion (what moves and why); ask for a motion reference at the brief.
- **Wrong → right:** "added a fade-in" → "the photo rolls in once, the title settles, the buttons press; all off with reduced motion"
- **Line added to:** Design rules > Process

## 2026-10-22: said "it's published" before publishing
- **What happened:** the agent rebuilt the prototype and told the person it was live. The link still served the old version.
- **Why it was wrong:** the person shared a link that didn't have the change.
- **Rule from now on:** only say "live" after publishing and reloading the published version; before that, say "rebuilt, not published yet".
- **Wrong → right:** "updated, check the link" → "published and reloaded: the link shows the new hero"
- **Line added to:** Agent rules > Every session

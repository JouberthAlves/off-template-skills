---
type: system
---

# Design rules

Every rule in force for creating, reviewing or auditing a site, page or UI,
one per line. Read in step 1 of [[INDEX Design]]. The story behind each rule
lives in [[Mistakes]] and [[Wins]].

## Process

- No step of the [[INDEX Design]] checklist can be skipped, even with a detailed request. If one can't be done, say which and why.
- Before code: the 4 questions of the [[Design brief]], the research ([[Research real sites]]), the 3 directions as gray skeletons **and** one colored mockup per direction, both before asking for the choice. The mockup isn't optional and doesn't become a question.
- Before the direction of a demo, define who pays for the site (size, ticket, neighborhood, clientele) and make the concept fit them.
- A report the person attaches applies in full, including the visual part, not only the list of sections.
- Before delivering, run [[AI design patterns to avoid]] on the screenshot of the finished page and say which items still show up.

## Visual and media

- A portrait in the hero goes cut out, without background, never inside a rounded card with a shifted color block behind it.
- Generated photo: first check that the niche's objects are right, then light and composition.
- Horizontal scroll: test with mobile emulation on, every page, at 375/768/1024 px. A wide display title is sized by its column (`cqi`), so one long word can't overflow.
- Multi-page SEO: title, description, canonical and Open Graph image per page (never in the shared layout), plus sitemap and robots.
- WebGL or shader background: only with a real GPU, DPR 1, start on idle, and run Lighthouse mobile before delivering.
- Slow continuous CSS motion: enable only after confirming GPU acceleration; test in Chrome with `--disable-gpu`.
- Animated component: position on a wrapper and animation on the inner element, inherited text color, hidden items with `display:none`; check on a dark background and with reduced motion.

## Forms

- Every field gets real handling, not just a placeholder: phone mask, date with `type="date"` (no past dates for bookings), numbers that refuse letters on typing and paste, `maxLength` on text, counter on textareas, long text that wraps (`overflow-wrap:anywhere`).
- When fixing one field, review every field on the site and test the worst case: pasting long text without spaces, typing letters in a number.
- The same limits are validated on the server, not only in the field.
- A checklist, filter or choice made before a WhatsApp or email button has to be in the message that gets sent.

## Patterns that worked

From what the person praised ([[Wins]]). New praise: entry in Wins and the
pattern in one line here.

- _(none yet)_

# Burger, rerun (2026-10-26)

The same one-line prompt as [`../burger/`](../burger), run again on both sides on the same day with the current skill (with `sloplint`, the fresh-eyes reviewer, the decisions block and the code-floor rules). The old run stays as it was. Its skill side used an older skill, and the agent answered its own brief, which the skill now forbids.

> Build a website for a burger restaurant.

## The two sides

| | Agent alone | With off-template |
|---|---|---|
| Folder | [`normal-agent/`](normal-agent) | [`off-template/`](off-template) |
| Model | Claude Opus 5.5 (subagent) | Claude Opus 5.5 (direction, spec, review) + Sonnet 5.5 at medium effort (code) |
| What it got | The prompt, an empty folder, and "you can't ask me questions" (exact message below) | The full flow: tools, brief answered by the owner, research of 12 real truck sites, 3 skeletons and 3 mockups, the owner's choice, decisions block, closed spec, review |
| Fixes after the review | none | the owner's notes (the texture didn't show, then read as concrete, so it became a griptape photo; the nav cut the photo flat) and the reviewer's (see review.md) |
| What it built | A full one-page site: "Ember & Bun", 7 sections, an order tray, a drawn burger | Only the first screen: "Halfway", nav + hero. The owner asked for a hero only ("it will only be a hero, as an example") |
| Brief | Decided by the agent | Answered by the owner: a burger cut in half · hungry, right now · skate video × butcher shop · never an AI template · food truck, $8–11 · calm motion · picked direction C (my pick was B) |
| Edited after | No, untouched | Yes, reviewed and fixed by Opus (see [`off-template/review.md`](off-template/review.md)) |

The agent-alone message, in full:

```
Build a website for a burger restaurant.

Work only inside this empty folder: <folder>
Make it a static site (index.html plus any CSS/JS/asset files) that opens
directly in a browser, no build step. You can't ask me questions, so make your
own decisions and finish it. When done, reply with the list of files you
created.
```

It is a subagent of the session that ran the skill side, so it is not a fully clean room: it inherits that session's tool list. It was told nothing about the skill or the vault, and it didn't read them.

## Results

`node skills/off-template/scripts/sloplint.mjs <page> --render` (375, 768, 1280, 1440 and 1920 px). Full output in `normal-agent/sloplint.txt` and `off-template/sloplint.txt`.

| | Agent alone | With off-template |
|---|---|---|
| **FAIL (code floor)** | **20**: 19 colours outside tokens, 1 `transition: all` | **0** |
| WARN | 15: 9 grid tracks without `minmax(0, …)`, no `overflow-x: clip`, 10 hard shadows (tell), DM Sans (default face, tell), emoji in the copy (tell), 561 words on the page, no stamp* | 1: 2 sections (hero only; waiver in `direction.md`) |
| Tells the code shows | Hard shadows, default type, emoji | none |
| Horizontal scroll | none | none |

\* The stamp is a convention of the skill, so the agent alone could not have known it. It counts as a WARN, never a FAIL.

**Impeccable's detector** (`npx impeccable detect --json`, on the served pages, 390 × 844 and 1440 × 900; raw output in [`impeccable/`](impeccable)):

| | Agent alone | With off-template |
|---|---|---|
| 390 × 844 | 19: 10 low contrast, 3 kicker above a heading, 3 lonely last words, a spotlight glow, an eyebrow chip in the hero, a marquee | 0 |
| 1440 × 900 | 17: the same, with 1 lonely last word | 0 |

On the skill side, the first run found 1: the hero sentence at 4.3:1 once the concrete texture went in. It was fixed (the text went from 78% to 90% of the crumb colour) and the second run found 0.

### Read this before quoting the numbers

- **The sizes differ.** The skill page is a first screen. The agent-alone page is a full site with 7 sections and about 560 words. A bigger page has more places to fail. Per line of CSS the gap is smaller than 20 to 0.
- **What the lint can't see:** taste, and whether the page looks like the business. Those were checked on the screenshots, by a reviewer that never saw the conversation and by a design critique, on the skill side only (`off-template/review.md`). The agent-alone page was not reviewed by a person or another agent; its own report says it tested itself in a browser.
- **Invented facts.** The agent alone wrote ratings, reviews, "since 2014" and an address. On the skill side, the name, the stop, the hours and the price are stand-ins for a fictional truck, listed as such in the decisions block. The photo is generated and marked as a stand-in in its alt text.

## Screenshots

| | Desktop | Phone |
|---|---|---|
| Agent alone | [`normal-agent/desktop.png`](normal-agent/desktop.png) | [`normal-agent/mobile.png`](normal-agent/mobile.png) |
| With the skill | [`off-template/desktop.png`](off-template/desktop.png) | [`off-template/mobile.png`](off-template/mobile.png) |

Full-page captures at five widths: `normal-agent/shots/` and `off-template/shots/`.

## Cost

- Magnific: 820 credits (3 mockups at 180 each, the hero photo at 180, the griptape texture at 100).
- The palette was sampled from two real photos on Wikimedia Commons ("Philbuster burger - 1", CC BY-SA 4.0; "Smash burger - Cambridge, MA", CC0). Neither photo appears on the page.

Everything about both restaurants (names, addresses, menus, prices, reviews) is fictional.

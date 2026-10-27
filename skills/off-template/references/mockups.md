# One colored mockup per direction

The gray skeleton shows composition. People choose with their eyes, so each
direction also gets one colored mockup: the first screen on a laptop and a
phone, with the real copy and the palette. Make it in the same round as the
skeletons. It's part of the step: don't offer it as optional and don't ask
whether to make it.

## Before generating

1. **Cost.** If the tool spends credits, the yes was asked at STOP 0 with the
   brief (cost/simulate call plus balance call: "3 mockups at N each: X out
   of Y, Z left"). Approved: generate now, without stopping again. Not
   approved: write the three prompts and send them at STOP 1.
2. **Real material.** Attach the client's real photos, logo or posts when they
   exist. No real photo of a person: say so, and use a neutral placeholder
   rather than inventing a face that looks like the client.
3. **Model choice.** Pick a model known for legible text in images (GPT-image
   class models). Mid quality is enough for a direction check.

## Prompt template

Write the prompt in full; models take loose words literally ("Anatomy" became
a human body once). Describe what every element *is*.

```
A website mockup, first screen only, shown on a laptop and a phone side by
side, on a plain neutral background. Flat, sharp UI render, no perspective
tricks.

Brand: <name>, <what the business is, one sentence>.
Vibe: <named vibe>. Feeling in the first 3 seconds: <one feeling>.

Layout (follow exactly): <describe the skeleton: where the photo is, title
size and position, buttons, what's below the fold edge>.
Wildcard element: <describe it and where it sits>.

Exact text, in this order, nothing else:
- Logo: "<...>"
- Title: "<...>"
- Subtitle: "<...>"
- Buttons: "<...>", "<...>"
- Nav: "<...>", "<...>", "<...>"

Colors: <hex + name for each, which is background, text, accent>.
Fonts: <family and style for title and body>.
Materials: corners <...>, shadows <...>, borders <...>, surface/texture <...>
(from the direction's visual language).
Imagery: <what the photo shows, light, angle; start with the photo base block
from photography.md>.

Do not add: gradients, glow, emoji, extra text, stock icons, decorative grids
or dots, a serif title unless named above, hard offset shadows, thick black
outlines on cards and buttons, monospace labels, barcodes, lot numbers or any
data not listed above.
```

Image models fill empty space with invented details (stats, labels, a
chalkboard, a fake rating). Name every element that should be there and say
"nothing else".

## After generating

- Check the text letter by letter. Regenerate (or fix by hand) a mockup with
  wrong copy: the person will judge the words too.
- Check that the niche objects are right (the right kind of grill, chair,
  tool) before judging light and composition.
- Remove invented details the prompt didn't ask for (fake numbers, labels,
  badges) or regenerate.
- Run `anti-patterns.md` on each mockup, with the 3-second test and the fit
  test.
- Save as `design/mockup-a-<vibe>.png`, `-b-`, `-c-`.

## No image tool

Give the person the three prompts ready to paste into ChatGPT or another image
tool, and ask them to send the images back. Continue once they arrive.

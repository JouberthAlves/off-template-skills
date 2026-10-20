# One colored mockup per direction

The gray skeleton shows composition. People choose with their eyes, so each
direction also gets one colored mockup: the first screen on a laptop and a
phone, with the real copy and the palette. Make it in the same round as the
skeletons. It's part of the step: don't offer it as optional and don't ask
whether to make it.

## Before generating

1. **Cost.** If the tool spends credits, estimate first (cost/simulate call
   plus balance call) and say: "This will cost X credits out of Y (Z left):
   3 mockups at N each." Wait for a yes.
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
Imagery: <what the photo shows, light, angle>.

Do not add: gradients, glow, emoji, extra text, stock icons, decorative grids
or dots, a serif title unless named above.
```

## After generating

- Check the text letter by letter. Regenerate (or fix by hand) a mockup with
  wrong copy: the person will judge the words too.
- Check that the niche objects are right (the right kind of grill, chair,
  tool) before judging light and composition.
- Run `anti-patterns.md` on each mockup.
- Save as `design/mockup-a-<vibe>.png`, `-b-`, `-c-`.

## No image tool

Give the person the three prompts ready to paste into ChatGPT or another image
tool, and ask them to send the images back. Continue once they arrive.

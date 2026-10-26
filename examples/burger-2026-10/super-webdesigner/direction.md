# Chosen direction (2026-10-26)

**Base:** direction C, "Fisheye Session": a burger cut in half (brief Q1) shot like a frame of a skate video, held to a fisheye lens in front of the truck at night; the butcher shop shows in the white butcher paper wrap and the plain, proud copy.

**Changes the owner asked for:** none. Hero only (nav + first screen).

**First screen:** desktop: text column on the left (logo badge and nav on top, tilted title, one sentence, the order button, today's stop); a large round photo on the right, cropped by the top edge. Phone (390): the round photo, wider than the screen, sits on top; nav, title, sentence, button and stop line below it.

**Wildcard element:** the round photo drifts a few px with the pointer, as if the camera were handheld (desktop pointer only; off on touch and with reduced motion).

**Palette** (sampled from the reference photos): `#3c2828` char (ground) · `#7e321b` edge char (the grain, the photo ring) · `#e9ab68` cheese (accent, only the order button and the status dot) · `#dcbc9d` bun crumb (text).

**Fonts:** Bowlby One (title: heavy and a little crooked, like a deck graphic) · Karla (body and nav: plain, friendly).

**Visual language:**
- Edges: round, from the fisheye lens: the photo is a circle, the button a full pill.
- Depth: only the lens bulge inside the photo; flat everywhere else, no shadows.
- Lines: none (the logo badge's ring is the only outline). The nav floats over the hero; its links sit on a round char veil so they read over the photo.
- Surface: char with real griptape: a generated macro photo of skateboard grip (`img/griptape.webp`, Magnific, 100 credits), tiled at 320 px and blended with `screen` at 45%. The owner asked for it to read as griptape.
- Type voice: loud, a little crooked, a friend saying "you have to try this".
- Motion feel: a single roll in, then still.

**Imagery:** one generated photo (Magnific GPT 2), a stand-in for the truck's own photo: a burger cut in half held to a fisheye lens, butcher paper wrap, food truck window behind. Marked as a stand-in in the alt text and the README.

**Logo and favicon:** HALFWAY in Bowlby One inside a round ring badge, like a deck sticker; the favicon is the badge.

**Motion (required, calm):** the round photo rolls in from the right once (rotate from 25° to 0 and translate, 900 ms, ease-out) and stops; the title settles from 0° to its -3° tilt with a fade (600 ms); the sentence, button and stop line fade up in order (80 ms apart). Button: hover lightens, press scales to 0.97. Status dot: one soft pulse on load when the truck is open. All off with `prefers-reduced-motion`; everything visible without JS.

**Keep list from the research:** where the truck is today on the first screen (stop and hours), a close photo of one burger, one clear order action, the price. Instagram left out: the owner gave no handle, and an invented one would be an invented fact.

**Avoid list:** the 13 general anti-patterns + the niche ones: a logo-only hero, the red-yellow-black comic look with Bangers/Anton caps, a phone number as the only way to order, a schedule hidden behind a link, template wording, content that only appears through JS.

**Language:** English.

**Licenses:** fonts from Google Fonts (OFL). GSAP not used; CSS animation is enough for this motion.

**Waivers:** `sections`: the page is a hero only, by the owner's scope ("it will only be a hero, as an example").

**Stamp:** `/* super-webdesigner · direction C "fisheye session" · job: order for pickup / find the truck · faces: Bowlby One / Karla · palette: char, edge char, cheese, bun crumb · motion: calm, the round photo rolls in once · waivers: sections */`

Reference mockup: `mockup-c-fisheye-session.webp` (layout). The stand-ins: name HALFWAY, "Pier 4 lot, 11:30–3", $10. The whole business is fictional, like the other side's.

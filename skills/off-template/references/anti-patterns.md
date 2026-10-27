# AI design patterns to avoid

The habits an agent repeats when it decides alone. Each one, on its own, looks
like a choice; together they are the signature of "a page made by AI". Applies
to landing pages, sites, apps and any visual piece.

Read before choosing a direction and again when reviewing the first version.

## The 13 tells

| Pattern | Why avoid it | Instead |
|---|---|---|
| **Purple or blue gradient** | The number one marker of a generated page | Color taken from the project's real reference (brief question 1). Gradient only if the reference calls for it, and never purple to blue |
| **Default type** | Serif italic became every AI's shortcut for "elegant", and so did one italic word inside a roman heading ("Made with *love*"); Inter, Space Grotesk, Plus Jakarta Sans, DM Sans and Roboto are its shortcut for "clean" | A face chosen for a reason that comes from the reference: a sans with character, a display face, condensed, or hand-lettering. Write the reason down; "it's clean" is not one |
| **Grid background** (squares, dots, lines) | Filler to hide emptiness; on almost every "tech" template | Texture, photo, flat color or deliberate empty space |
| **3 generic benefit cards** | Icon + title + two lines, three times, side by side: the most copied block on the web | The benefit inside proof (photo, number, before/after), an asymmetric list, one big benefit and the rest smaller |
| **Emoji in the copy** | Cheapens the text and gives away generated copy | None. If a visual marker is needed, use an icon from the page's own system |
| **Glow on everything** (text, buttons, borders) | Everything glowing means nothing stands out | Contrast of color and size. If there's an effect, on **one** element only |
| **The usual layout** | Centered hero → 3 cards → testimonials → FAQ → CTA: the spine of every AI page | No need to reinvent the wheel every time, but break at least the order or the composition: asymmetric hero, a section that bleeds into the next, a rhythm of different sizes |
| **Generic icons** | Thin-line Lucide/Feather are the invisible default | An icon drawn for the project, a cut-out photo, or less-used families (Phosphor, Solar) with a chosen weight |
| **Everything static** | A still page looks like a mockup, not a product | Motion with a purpose (`motion.md`): one live element in the hero, scroll entrances, hover and press that respond. Respect `prefers-reduced-motion` |
| **01 / 02 / 03 on an unordered list** | The number suggests a sequence. On loose items (services, benefits) it's decoration that implies steps that don't exist | Number only when order matters (steps, stages, timeline). Loose lists go without numbers |
| **Hard shadows and boxes everywhere** (neo-brutalism) | Offset shadows with no blur, thick black outlines, square corners on every block, buttons that "press" into their shadow. It became the agent's escape from the purple gradient, and it reads as a tool or a dashboard whatever the business is | Edges and depth chosen by role and by the reference's material (`visual-language.md`): a border or shadow only on the one element that has to stand apart, a radius that matches the real objects, shadow only where the light is real |
| **Spec-sheet dressing** | Monospace in the nav, buttons and labels; lot numbers, temperatures, coordinates, barcodes, "status: live" bars, countdowns and percentages nobody asked for. It imitates craft without saying anything the visitor uses | Show only the data the visitor acts on (opening hours, price, the next batch, where to pick up), in the page's own text face. Mono only for real code or numbers that line up in a table. A status ("open now", "online") is fine when it reports a real state |
| **A default AI look** | When the obvious look is forbidden, agents fall into a second set of defaults: warm cream with a terracotta accent (often with a serif), near-black with one acid-green or vermilion pop, the broadsheet newspaper (hairline rules, dense columns, a dateline), and paper ephemera (receipts, tickets, rubber stamps, thermal labels) | The look comes from the brief's own real-world object and feeling. Any of these only when question 1 of the brief named it, and never as the concept of more than one of the three directions |

Three more that belong to these tells (score them under the tell named):

- **Tracked uppercase labels and buttons** (letter-spaced small caps on every
  kicker and button): part of **Default type**.
- **A metadata line with middle dots and an arrow at the end** ("Design ·
  Build · Launch →"): part of **Spec-sheet dressing**.
- **A radial halo behind the headline on a dark page**: part of **Glow on
  everything**.

A tell kept on purpose is declared under Waivers in `design/direction.md`,
with the reason from the brief: that's the difference between a choice and a
habit.

Plus the **niche list** from `research.md`: the look everyone in this niche
already repeats.

## Running from generic is not the goal

The opposite mistake is just as common: the agent avoids every tell and every
niche cliché so hard that the page stops looking like the business. Grey
cement, black outlines and mono labels for a barbershop; a technical spec sheet
for a bakery. Visitors don't buy "not generic"; they buy a place they
recognize and trust.

- Keep what the niche's visitors expect (`research.md`, keep list). Originality
  goes **on top** of it, never in its place.
- **The 3-second test:** would a customer of this niche know what the business
  is, and want it, from the first screen alone? If not, the direction failed,
  however original it is.
- **The fit test:** does every material choice (edges, shadows, lines, texture,
  type, motion) match the feeling from the brief? A warm, hand-made business in
  a cold, technical frame tells two stories at once (`visual-language.md`).

## How to check

Run the list on full-page screenshots of the finished page (desktop and
390 px) and on its source, never on the first screen alone; and on each
mockup.
Write down each item: absent, present, or present on purpose (with the reason
from the brief). **Three or more present means the page still looks AI-made:
go back to the brief, don't just swap colors.** Then run the 3-second test and
the fit test above: either one failing sends the direction back too.

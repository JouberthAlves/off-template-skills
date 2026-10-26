# Research: dev-tool and design-skill sites (2026-10-26)

Opened in the built-in browser, first screen at desktop; Stripe, Vercel, Bun
and Hallmark also at 375 px. All 14 opened. Screenshots stay local
(`design/research-shots/`, git-ignored).

| Site | Hero | Palette | Type | Motion | Main action | Tier |
|---|---|---|---|---|---|---|
| Stripe | Left headline, flowing colour ribbon bleeding off the right edge | White, ink, orange-pink-violet ribbon | Söhne 300, big | The ribbon flows (canvas), alive | "Start now" + Google sign-up, then a logo row | Premium, the motion reference |
| Vercel | Left headline, lit black triangle centre, three short claims right | Black, white, one grey glow | Geist | The triangle's light | "Deploy now" | Premium |
| Linear | Headline over a product shot that fades in | Near-black #08090a, white | Inter Variable 510 | Product screens assemble on load | "Sign up" in nav | Premium |
| Raycast | Centred headline in the dark, glow behind | Near-black, white, a red logo | Inter 600 | Glow, 3D keys on scroll | "Download" | Premium |
| Cursor | Left headline, then the real app full-width below | Charcoal, cream text | Custom grotesk | The app types an answer | "Download for macOS" | Premium |
| Warp | Empty on load, dotted grid, tracked mono labels at the edges | Off-white, black, a yellow button | Mono labels | Loads in late | "Get started", "Book a demo" | Solid, leans spec-sheet |
| Zed | The editor itself is the hero, dense and real | #141818, syntax colours | Serif heading, mono body | None on load | "Download" on each product | Outlier |
| Supabase | Two-line headline, green second line, code panels below | Near-black, one green | Custom grotesk | Subtle | "Start your project" | Solid |
| Resend | Serif headline in a beam of light | Black, white light beam | Serif display | The light beam sweeps | "Get started" | Premium |
| shadcn/ui | Centred headline, then a bento of live components | Near-black, white | Geist | Components are live | "Get Started" | Solid |
| Claude Code | Dark, editorial, a terminal | Near-black, warm white, clay | Serif + sans | The terminal types | "Try Claude" | Premium |
| Bun | Left headline, install command with OS tabs, live benchmark right | Near-black, pink accent | Bold grotesk | Benchmark bars grow | Copy the install command | Premium |
| Hallmark | Centred serif headline, install line, a before/after deck below | Paper white, ink, one orange mark | Serif display | Cards deal in | Copy the install command | Premium, closest competitor |
| Impeccable | Left headline, an annotated mock on the right | Light grey, ink, a yellow tag | Grotesk + mono tags | Annotations appear | "Install Impeccable" | Solid, leans spec-sheet |

## Keep: what visitors expect

- **The install command on the first screen, copyable** (Bun, Hallmark,
  Impeccable, and the old page): for a CLI tool the main action is a line of
  text to copy, not a sign-up.
- **The product shown working early**, at full fidelity: the real app
  (Cursor, Zed, Linear), live components (shadcn), before and after
  (Hallmark, Impeccable).
- **Which agents it works with**, named near the command (Bun's OS tabs,
  Hallmark's "Works in Claude Code, Codex and OpenCode").
- **A GitHub link in the nav.**
- **A big, plain sans headline that says what it is** in one line.
- **The look they trust:** a dark, editor-like ground with real code or a
  real product in it. 10 of 14 are dark.

## Avoid: the niche's sameness

- **Black page plus one glow or light beam** behind a centred headline
  (Vercel, Raycast, Resend, Linear): the strongest shared look.
- **Inter and Geist** for everything.
- **A logo wall** under the hero (Stripe, Vercel): we have no logos anyway.
- **Bento grids of feature cards** (shadcn, Supabase).
- **Dotted grids and tracked mono labels** at the page edges (Warp,
  Impeccable): the spec-sheet tell.

## Premium against generic

Premium shows the real product at full fidelity, spends motion on one idea
(Stripe's ribbon, Vercel's lit triangle), keeps one accent, and sets type with
confidence. Generic stacks centred headline, two pill buttons and a bento.

**Outliers that work:** Stripe (light, a living colour ribbon), Zed (the
editor is the page), Hallmark (paper and serif in a dark niche).

## Palette from question 1 (the editor at night)

Sampled from the code panel of a real editor at night (Zed's theme, 1440 px
capture, region 836,400 to 1200,900):

| Role | Hex | Where in the editor |
|---|---|---|
| Night ground | `#141818` | the editor background |
| Panel | `#1c2120` | gutters and panels |
| Text | `#acb0bc` | plain code |
| Teal | `#6cb4bc` | types |
| Coral | `#d07074` | removed lines, errors |
| Green | `#a0c080` | strings |
| Diff red | `#381c20` | a removed line's background |
| Diff green | `#1c2c24` | an added line's background |

Blue `#70ace8` and violet `#b474cc` are in the theme too; they never meet in a
gradient (question 4).

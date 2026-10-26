# Spec: HALFWAY hero (closed)

A one-screen static page: nav + hero only, nothing below. Plain HTML, CSS and a little JS. No build step, no framework, no GSAP.

Files to create, all inside `site/` next to this `_spec/` folder:
- `site/index.html`
- `site/styles.css`
- `site/script.js`
- `site/img/favicon.svg`

Already there (do not change): `site/img/burger-fisheye-1400.webp` and `site/img/burger-fisheye-800.webp` (square, 1400 and 800 px).

## Hard rules (the page fails review if any is broken)

1. **Line 1 of `styles.css`**, exactly:
   `/* super-webdesigner · direction C "fisheye session" · job: order for pickup / find the truck · faces: Bowlby One / Karla · palette: char, edge char, cheese, bun crumb · motion: calm, the round photo rolls in once · waivers: none */`
2. **Every colour and every font family lives in `:root` as a token** and is used only through `var()`. No hex, `rgb()`, `hsl()` or family name anywhere else: not in rules, not in inline `style=""`, not inside SVG data URIs, not in the favicon's `<link>`. Transparent variants are tokens too, made in `:root` with `color-mix(in srgb, var(--x) N%, transparent)`. (The favicon SVG file may use literal hexes from the palette; it's a separate file.)
3. No `transition: all`. Animate only `transform`, `opacity` and `clip-path`. Never animate width, height, top, left, margin or padding.
4. `html, body { overflow-x: clip; }`, never `hidden`. Never `width: 100vw`.
5. No horizontal scroll at 375, 768, 1280, 1440 and 1920 px. The round photo is wider than the phone screen on purpose: it must be clipped by its own wrapper (`overflow: clip` on the hero), not push the page.
6. Content capped: an inner container `max-width: 84rem; margin-inline: auto;` with the side gutter `padding-inline: max(16px, env(safe-area-inset-left, 0px))` (use clamp for larger gutters on desktop, e.g. `clamp(16px, 4vw, 56px)` inside the max).
7. No box with background and edge inside another box with background and edge.
8. Every link and button has a visible `:focus-visible` style (outline 2px `var(--cheese)`, offset 3px).
9. `@media (prefers-reduced-motion: reduce)`: no animation, no transition, no pointer drift; everything at its final state.
10. The page is complete without JS: all text visible at rest, nothing starts at `opacity: 0` unless a class added by JS (`.js`) on `<html>` puts it there. Add a safety timeout: if after 2.5 s the entrance classes didn't run, force everything visible.
11. No shadows, no borders on boxes, no gradients, no glow, no emoji, no monospace, no extra text beyond the copy below, no icons beyond the status dot.
12. Do NOT start a server, open a browser or take screenshots. Check your work only with `node --check site/script.js` and by confirming file paths exist. The reviewer does the visual check.

## Tokens (`:root`)

```css
--char: #3c2828;        /* ground */
--edge: #7e321b;        /* deeper char-red: photo ring, grain tint */
--cheese: #e9ab68;      /* accent: ONLY the order button and the status dot */
--crumb: #dcbc9d;       /* text */
--crumb-dim: color-mix(in srgb, var(--crumb) 78%, transparent);  /* secondary text */
--font-display: "Bowlby One", "Arial Black", sans-serif;
--font-body: "Karla", "Helvetica Neue", Arial, sans-serif;
```

Fonts from Google Fonts in `<head>`: `https://fonts.googleapis.com/css2?family=Bowlby+One&family=Karla:wght@400;600;700&display=swap` with preconnect to fonts.googleapis.com and fonts.gstatic.com.

`body`: `background-color: var(--char); color: var(--crumb); font-family: var(--font-body); margin: 0;`.

**Griptape grain:** a `body::before` fixed full-screen layer, `pointer-events: none`, using an inline SVG data URI with `feTurbulence` (baseFrequency about 0.9, numOctaves 2, stitchTiles) and **no colour values in the SVG** (default black-to-white noise), at `opacity: 0.05` and `mix-blend-mode: overlay`. It must sit behind the content (content above with `position: relative; z-index: 1`).

## HTML

`<html lang="en">`. Head: charset, viewport, title `HALFWAY · Smash burgers from a truck`, meta description `Smash burgers cut in half, from a food truck. Today at Pier 4 lot, 11:30 to 3. Order for pickup.`, `<link rel="icon" href="img/favicon.svg" type="image/svg+xml">`, theme-color meta pointing at the char value is NOT allowed (it would need a hex outside :root), so skip theme-color. Open Graph: `og:title` (same as title), `og:description` (same as description), `og:image` = `img/burger-fisheye-1400.webp`, `og:type` website.

Body structure, exactly this copy and nothing else:

```html
<header class="nav">
  <div class="wrap nav-inner">
    <a class="logo" href="./" aria-label="HALFWAY, home"><span>HALFWAY</span></a>
    <nav aria-label="Main">
      <a href="#menu">Menu</a>
      <a href="#schedule">Schedule</a>
      <a href="#order">Order</a>
    </nav>
  </div>
</header>
<main>
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero-inner">
      <div class="hero-copy">
        <h1 id="hero-title"><span class="line">Cut in half.</span> <span class="line">Still dripping.</span></h1>
        <p class="lede">Two patties pressed on the steel, American cheese, pickles, house sauce. From a truck, $10.</p>
        <a class="order" id="order" href="#order">Order for pickup</a>
        <p class="stop" id="schedule"><span class="dot" aria-hidden="true"></span><span class="open-now" hidden>Open now · </span>Today: Pier 4 lot, 11:30–3</p>
      </div>
      <figure class="lens">
        <div class="lens-drift">
          <img src="img/burger-fisheye-1400.webp" srcset="img/burger-fisheye-800.webp 800w, img/burger-fisheye-1400.webp 1400w" sizes="(max-width: 767px) 120vw, 46vw" width="1400" height="1400" alt="A smash burger cut in half, held up to a fisheye lens in white butcher paper, in front of the lit window of the food truck at night (generated stand-in photo)" fetchpriority="high">
        </div>
      </figure>
    </div>
  </section>
</main>
```

The title is uppercase by CSS (`text-transform: uppercase`), written in sentence case in the HTML.

## Layout

**Nav:** height ~88px desktop, ~72px phone. Logo on the left, links on the right, vertically centred.
- `.logo`: a circle (`border-radius: 50%`) 76px desktop / 56px phone, ring `2px solid var(--crumb)` (the only outline on the page, it's the badge), text HALFWAY in `var(--font-display)`, `var(--crumb)`, font-size 13px desktop / 10px phone, centred, letter-spacing 0. No fill.
- Links: `var(--font-body)` 700, 17px, `var(--crumb)`, no underline, gap 32px (20px on phone); hover: `opacity: .75` with `transition: opacity .2s`. Touch targets at least 44px tall (padding-block).

**Hero, desktop (≥ 768 px):** `.hero-inner` is a grid `grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); align-items: center; gap: clamp(24px, 4vw, 64px)`. Hero min-height `min(820px, calc(100svh - 88px))`, never taller than that.
- `.hero-copy` on the left, in this order with `gap` (flex column): h1, lede, order button, stop line.
- `h1`: `var(--font-display)`, `font-size: clamp(3.2rem, 7.2vw, 7rem)`, `line-height: .92`, `letter-spacing: -0.01em`, weight 400 (Bowlby One has one weight), colour `var(--crumb)`, `transform: rotate(-3deg)`, `transform-origin: left bottom`, margin 0. Each `.line` is `display: block`. It must not overflow its column: at 768 px check the longest word "DRIPPING." fits (reduce with `cqi` or the clamp if needed; use `container-type: inline-size` on `.hero-copy` and `font-size: clamp(2.6rem, 15.5cqi, 7rem)` as the safer option).
- `.lede`: 1.25rem desktop / 1.0625rem phone, line-height 1.45, `var(--crumb-dim)`, `max-width: 30ch`, margin 0.
- `.order`: pill (`border-radius: 999px`), background `var(--cheese)`, text `var(--char)`, `var(--font-body)` 700, 1.25rem, padding `18px 40px`, `display: inline-flex; align-self: flex-start`, no border, no shadow. Hover: `transform: translateY(-2px)` with `transition: transform .2s ease-out`; active: `transform: scale(.97)`.
- `.stop`: 1.125rem, `var(--crumb)`, flex row, `gap: 10px`, `align-items: center`. `.dot`: 12px circle, background `var(--cheese)`.
- `.lens`: margin 0, position relative. On desktop it sits to the right and is **cropped by the top edge**: `aspect-ratio: 1; width: min(100%, 720px); margin-top: -12%; justify-self: end;` `.lens-drift` fills it. The `img` is `width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;` with a ring `outline: 6px solid var(--edge); outline-offset: 0`. The `.hero` has `overflow: clip` so the top crop and the phone overflow never scroll.

**Hero, phone (< 768 px):** single column, the photo FIRST (use `order: -1` on `.lens`), then the copy.
- `.lens`: `width: 118%; margin-left: -9%; margin-top: -18%;` (wider than the screen, cropped by the top and both sides through `.hero` clipping). Keep `aspect-ratio: 1`.
- `.hero-copy` below with gap 18px, padding-bottom 40px; h1 `font-size: clamp(2.6rem, 15.5cqi, 4rem)`.
- The order button is full width up to 360px (`align-self: stretch; justify-content: center; max-width: 360px`).
- At 390 × 844 the button should be visible without scrolling: nav 72 + photo + title + lede + button. If it doesn't fit, reduce the photo's top margin to -26%.

## Motion (calm)

Only with `.js` on `<html>` (set by an inline script at the top of `<head>`: `document.documentElement.classList.add('js')`), and only when `prefers-reduced-motion` is not `reduce`:
1. `.lens-drift` rolls in once on load: from `transform: translateX(18%) rotate(25deg); opacity: 0` to `none; opacity: 1`, 900 ms, `cubic-bezier(.2,.7,.2,1)`. Use a CSS keyframe animation with `animation-fill-mode: both`. (The drift in step 4 is applied to the `img`, not to `.lens-drift`, so the two transforms don't fight.)
2. `h1`: from `opacity: 0; transform: rotate(0deg) translateY(16px)` to `opacity: 1; transform: rotate(-3deg)`, 600 ms, delay 150 ms, same easing.
3. `.lede`, `.order`, `.stop`: fade up from `opacity: 0; translateY(12px)`, 500 ms each, delays 300, 380, 460 ms.
4. **Pointer drift (the wildcard):** on devices with `(hover: hover) and (pointer: fine)`, listen to `pointermove` on `.hero`; move the `img` by up to ±10 px on x and ±8 px on y following the pointer relative to the hero centre, smoothed with `requestAnimationFrame` (lerp 0.08). On `pointerleave`, ease back to 0. Use `transform: translate3d()`. Not on touch, not with reduced motion. Start listening only after the roll-in ends (900 ms).
5. **Status dot:** in `script.js`, compute the local time; if it is between 11:30 and 15:00, remove `hidden` from `.open-now` and add the class `is-open` to `.dot`, which plays one soft pulse (scale 1 → 1.6 → 1 with opacity, 1.2 s, once). Otherwise leave as is.
6. Safety: a timeout at 2.5 s that adds `.motion-done` to `<html>`, which forces every animated element to `opacity: 1` and its final transform.

`@media (prefers-reduced-motion: reduce)`: `animation: none; transition: none;` on everything, all elements at their final state (h1 keeps its -3deg tilt), no drift, no pulse.

## Favicon (`site/img/favicon.svg`)

A 64×64 SVG: a circle filled `#3c2828`, a ring `#dcbc9d` stroke 4, and the letter "H" centred in a heavy sans in `#dcbc9d` (use `font-family="Arial Black, sans-serif" font-weight="900"`).

## When done

Reply with the list of files created and anything in this spec you could not follow, and why. Nothing else.

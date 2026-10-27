# Photography: the page's real material

Most good small-business sites are won by their photos, not by their layout.
The visitor wants to see the bread, the chair, the room, the person. A strong
frame around weak or generic photos still reads as a template.

## Order of preference

1. **The client's real photos and posts.** If the client already has a visual
   identity (Instagram posts, a sign, a logo), take the palette, the type and
   the tone from it, and bring its most recognizable element to the first
   screen. The client should recognize their own brand at once.
2. **Generated photos of the real thing**, in one consistent scene (below).
3. **Stock**, only as a placeholder, marked as such. It's forgettable and it
   tells the visitor there's nothing real to show.

## One scene for every photo

Write a **base block**: one paragraph describing the place (surfaces, props,
light, camera), and put it at the start of every image prompt. All photos then
come from the same room, and the page feels like one place.

```
Base: <the real place: surfaces, the props of this business, the light source
and time of day>. Shot on 35mm film, <film stock, e.g. Portra 400>, natural
window light, shallow depth of field, no studio gloss, no text in the image.
Photo: <what this one shows, angle, crop>.
```

- **The identity comes from physical objects of the business** (the order pad,
  the tablecloth, the oven, the tool). Lock them in the base block and they
  carry the brand through every photo.
- **Many photos at once** (a menu, a team): ask for a grid of square frames in
  one image ("a 3×2 grid of 6 square photos, touching, no borders, margins or
  separators") and crop it. Same scene, one generation.
- **A sequence** (time of day, before/after): make the first image, then derive
  the others from it ("reproduce EXACTLY this image, only change <one thing>").
  Check physical sense (the sun rises on one side and sets on the other).

## Checking a generated photo

In this order:

1. **The niche's objects are right**: the real kind of chair, oven, tool,
   dish. A barbershop with office chairs fails in one second, however good the
   light is.
2. **Each item matches its name** (the dish in the photo is the dish on the
   menu).
3. Only then light, color and composition.

## People

- **A portrait in the hero goes cut out**, with no background, resting on the
  base of a color band, the head passing its edge. Never inside a rounded card
  with a shifted color block behind it: that is the template hero.
  Ask for "TRANSPARENT BACKGROUND (cut-out PNG, no scene, no floor shadow)" and
  check that the file really has an alpha channel.
- **Never invent the face of a real client.** No real photo: say so, use a
  neutral placeholder, or attach the client's real photo as the face
  reference.
- A simulated image (a "before", an illustrative render) is marked as such on
  the page.

## Palette from the photos

Once the photos exist, sample the palette from them (a few regions of the
image, not the eye) and keep one accent only, on the main action. Check text
contrast before committing.

## On the page

- The first screen opens with the most characteristic photo of the business,
  not a decorative shape.
- Photos with `width` and `height`, WebP or AVIF, the hero prioritized, the
  rest `loading="lazy"`.
- **Demo sites:** never invent reviews, ratings, registration numbers or
  street addresses. Invented data is marked "demo". Real neighborhood, real
  city. Things keep their real names: no nicknames for products or staff.

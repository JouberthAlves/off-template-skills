# Research: burger food trucks

Method: sites opened 26 Oct 2026 with WebFetch and raw HTML read (no screenshots). Colours and fonts come from CSS/HTML where present; "first screen" comes from headings, alt text and og tags, so photo subject is stated only where the markup says it. Mix: US 6, UK 2, Australia 2, Brazil 2.

| # | Site | URL | First screen | Main action | Palette / type | Schedule / location |
|---|------|-----|--------------|-------------|----------------|---------------------|
| 1 | Smash & Grab (Tampa Bay, US) | https://www.smashandgrabfl.com | "Burger of the Week: Philly Smashburger" banner over headline "Smash Burger Food Truck in Tampa Bay"; hero image alt "Smashburgers in Tampa" plus a video | "Order Now" (a phone number), "View Our Menu" | Not stated in markup | Only a link to an external calendar; no dates on page. Says "subject to change" |
| 2 | Shay's Smashburgers (Aiea, HI) | https://shayssmashburgers.com/ | Logo, "Welcome to Shay's Smashburgers", pickup address block, six menu thumbnails | "Call Now"; Instagram | Not stated | One fixed address and weekly hours, no moving schedule. Menu with prices: $7 classic to $12 |
| 3 | SMASH'D Burger Truck (Dearborn Heights, MI) | https://smashdburgertruck.com | "Smash patties. Big flavor. Zero compromise." with "100% Halal Certified" star banner, address and hours right under | "See the Menu", "Book Catering" | Red #e8281a, royal blue #1a35c8, yellow #ffd700, black. Oswald + Bangers (comic) + Anton | Address, daily 2-10 PM, phone, delivery apps; "Find Us" nav item |
| 4 | Smash Bay (Connecticut, US) | https://www.smashbayct.com | "Passionately crafted, locally loved"; Squarespace site | "Order Online", Calendar, Private Events | Anton (condensed) + Epilogue; colours inline | Yes: "Where to find us" calendar, weekly "Smash Bay Saturday" at a brewery with dates |
| 5 | Smash Up (Annapolis, MD) | https://www.smashupburgers.com | Truck name "Clocktower Place" (today's stop) over "TODAY's Events" | "Order Online!", "Where Are We?" | Coral #f75d59 on white; Bebas Neue + Prompt | Strongest: today's stop first, "Locations This WEEK", Instagram feed, hours Wed-Sun 11-8 |
| 6 | IronMikes Food Truck (US) | https://ironmikesfoodtruck.com | Banner "Closed for the season! October 10th is our final day of 2026" | Read schedule, menu / price list | Black, amber #fdac15, white; Oswald | Upcoming events list with dates; 2027 availability explained in text |
| 7 | Home Brew Burgers (Suffolk / Essex, UK) | https://homebrewburgers.co.uk | "Gourmet Burger Van Hire for Weddings & Events in East Anglia" | "Request booking" | Green #008212 and charcoal #231f20, system fonts | "Regular stops in West Suffolk" with a pointer to Facebook; no dates. Menu with GBP prices (Classic Brew 12) |
| 8 | Bear's Street Food (Yorkshire, UK) | https://www.bearsstreetfood.co.uk | "Street-Food Event Catering in the UK", mascot bear logo | "Book The Bear!" | Amber #ffc107, white, dark grey; WordPress theme font | No truck schedule; hire only, a huge list of "van hire in [town]" links (SEO style) |
| 9 | Goldieboy Burgers (Melbourne, AU) | https://www.goldieboy.com.au | Headline on mobile catering, "The people's burger, voted 14th best in the world"; image alt: close-up of smash burger with melted cheese and pickles; illustrated fries | "Order Pickup Now", "Events & Catering" | Squarespace; Bebas Neue + Oswald + Cabin (tall condensed caps); colours inline | "Find Us" page; now has a fixed Brighton shop, so truck is event-only |
| 10 | Smashville (Geelong, AU) | https://www.smashville.com.au | Page is JS-rendered: title "Order Now / Burgers Geelong"; meta: smash burgers, hot fried chicken, loaded fries | Order Now (online ordering platform) | Red #e41109, navy #1e2e63, yellow #f5c443 on white | Not readable from HTML; catering page covers Melbourne and Geelong |
| 11 | Fantastic Smash Burguer (Jundiai, BR) | https://fantasticsmashburguer.menudino.com/ | Hosted menu-platform page (MenuDino): logo and "Cardapio"; content loads by script | Order through the platform menu | Platform default, red #ec2121 | Fixed trailer address is only in a news article, not on the brand's own site |
| 12 | O Smash Burger .Co (Florianopolis, BR) | https://www.osmashburger.co/ | Hosted menu-platform page (Brendi): three banners, "Mais Pedidos" with Supreme Smash | Delivery menu, WhatsApp | Platform default; green #8fffa2 / #003d0a accents | Shows "opens tomorrow 19:00" and delivery time; no truck stop. Prices R$32,90 to R$57,90 |

Pattern: US trucks run their own simple sites with a calendar. UK sites are mostly event-hire pages. Brazilian sites in this sample are delivery-menu pages, not truck sites, so the Brazil sample is thin.

## KEEP
1. Where the truck is today, on the first screen (Smash Up, Smash Bay): stop name, hours, a map link.
2. A weekly schedule with dates, easy to scan on a phone; honest "closed for the season" message (IronMikes).
3. The menu with real prices, short enough to read at a glance (Shay's, Home Brew).
4. A close photo of one burger: melted cheese, crust, pickles (Goldieboy alt text shows this works).
5. One clear order action: "Order Online" or "Call Now" visible without scrolling.
6. Instagram link or feed, since that is where trucks post last-minute changes.
7. Trust facts in one line: halal, beef source, hours, payment (SMASH'D).
8. A separate, quiet "Book catering" path for events (Smash Bay, SMASH'D, Goldieboy).

## AVOID
1. Hero with only a logo or a slogan and no food or location.
2. Schedule hidden behind an external link or "see our Facebook" (Smash & Grab, Home Brew).
3. Phone number as the only way to order (Smash & Grab, Shay's).
4. The usual comic palette: red + yellow + black with Bangers or Anton caps and emoji.
5. Catering-first pages that read like a marketplace, with dozens of SEO town links (Bear's).
6. Mixing a fixed shop and a truck without saying which is open today (Goldieboy).
7. Page content that only loads by script, leaving an empty page for search and slow phones (Smashville, MenuDino).
8. Generic template wording ("Taste Extraordinary Now", "forged flavor") instead of the name, the street and the price.

## Could not open
- https://bleeckerburger.co.uk (London): TLS certificate error in WebFetch, no response with curl.
- https://www.deadhippie.co.uk (UK): domain not found.
- https://humblebuns.com.au (Sydney): domain not found; no official site found in search, only Instagram/blog coverage.
- https://buzinaburgers.com.br (Sao Paulo): HTTP 406 from the server firewall (Mod_Security).
- https://smash4youburger.com.br (Sao Paulo): HTTP 406, same firewall.
- https://www.leonssmashburgers.com.au (Melbourne): HTTP 406.
- https://www.smashhh.com.au (Brisbane): no response.
- https://www.smashthatburger.com (Seattle): returned an empty page.
- https://addtoevent.co.uk (Smash N' Slide, Soul Smash listings) and https://www.aol.com article: HTTP 403 / 404.
- https://render-ready-ramps.lovable.app ("Smash & Dash", San Diego) opened but looks like a template demo, not a real business; left out of the table.

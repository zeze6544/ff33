# Torxth redesign — audit and plan

## What was wrong (from the live site, 19 Oct 2026)

### Brand
- Logo blue (`#0070b0`), copper/brass accents, cream "paper" and navy all compete.
- Four fonts: Fraunces (editorial serif), Rajdhani, IBM Plex Sans, IBM Plex Mono.
  Serif headlines make a computer shop read like a café. This is the main
  "AI template" tell, along with the grain overlay, punched-ticket cart,
  rubber stamps and fake job numbers.

### Honesty
- "On the bench" tickets are invented jobs presented as a live week.
- Every form (repairs, contact, checkout, build brief) only flips local state.
  Nothing is sent, yet the UI says the brief is "with us".
- The RAM kit product photo is a whole PC. The NVMe photo is a keyboard.
  One gaming-PC photo covers two different towers and the homepage.

### Commerce
- Shop: 12 thin rows, one spec line, text-link "Add", no stock state,
  `compareAt` prices stored but never shown.
- Product page: single repeated photo, no pickup/warranty/delivery facts
  near the buy button, no link into the builder.
- Builder: the part list is a hover strip (dead on touch), meters are 1px
  lines, board + Windows + labour hide in a footnote, no fitted-parts list.

### Technical
- 4 font families, 250–330 KB JPGs, no JSON-LD, tiny tap targets,
  letterspaced mono labels at 0.62rem everywhere (hard to read).

## Direction

One system, taken from the actual logo: deep navy ink, circuit blue,
cool off-white. No copper, no cream, no grain, no serif. IBM Plex Sans for
type, IBM Plex Mono for data (prices, specs, wattages). Sharp, technical,
spec-sheet energy — the design comes from layout and real numbers
(prices, TDP, clearance mm, warranty terms), not decoration.

## Pages

- **Shell** — utility bar (address, phone), sticky header with Cart
  (renamed from "Docket"), full footer (shop, services, visit, hours).
- **Home** — explicit hero (what, where, call), trust strip, shop-by-need
  with real from-prices, an interactive configurator teaser (preset tunes
  with live price/spec, no WebGL cost), ready machines as proper cards,
  services with from-prices, repair process, FAQ, visit panel.
- **Shop** — card grid, real categories, search, sort, spec chips,
  stock + compare-at shown, 44px add buttons.
- **Product** — sticky buy panel, stock/warranty/pickup facts, full specs,
  "build one like this" link, related cards.
- **Build** — workshop docket (no 3D case viewer) on the same parts
  catalog. Fitted-parts list (click a slot to edit it), itemised
  estimate (parts, board, Windows, labour), readable meters, grid
  picker that works by tap, warnings in amber, brief sent as a
  pre-filled email (mailto) plus call option.
- **Services** — price-at-a-glance, four services with turnaround,
  process, booking form that opens a pre-filled email.
- **About / Contact / Checkout** — same honesty pass: forms compose an
  email instead of pretending; checkout is "lodge for confirmation".

## Rules kept

- Real part names, fitment rules and AUD estimates in the builder stay.
- 61 Dorset Rd, Ferntree Gully · 0408 551 753 on every page.
- No invented reviews, job tickets or customer counts.
- No manufacturer renders or CAD; photos stay generic workshop imagery.

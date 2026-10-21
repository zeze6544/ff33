# Builder fidelity — what we can and cannot do

## No: “3D scan every product from Google”

That is not possible from this environment.

- A **3D scan** needs a physical unit (or a controlled multi-angle capture of one object) and a photogrammetry / structured-light pipeline. Random product photos from search are different units, lighting, and crop — they do not reconstruct a usable mesh.
- Running “hundreds or thousands” of image searches does **not** produce scans. It produces reference photos.
- Manufacturer marketing renders and review photos are **copyrighted**. We do not scrape them into fake CAD or ship them as product models.
- Third-party marketplace GLBs (CGTrader, Sketchfab, etc.) are almost never licensed for a commercial storefront, and many explicitly forbid commercial use.

## Yes: reference-driven signatures

For every **in-case** SKU we:

1. Record official dimensions / SKU where published (spec sheets, manufacturer pages).
2. Note 3–6 **visible signatures** (blade count, shroud colour, heatsink layout, front panel pattern).
3. Rebuild the **procedural** R3F mesh so those signatures read at phone distance in the open case.
4. Track status honestly in `BUILDER-PARTS.md` (`≈` approximate · `▣` signatures started · `✅` signatures match refs).

Peripherals (monitor, keyboard, mouse, headset, mic, webcam) are **not** in the case scene yet.

## Ridge pack (default build) — primary visual contract

| id | part | refs used |
|---|---|---|
| lancool | Lian Li Lancool 207 | 455.6×219×456 mm; mesh front; 2×140 mm front ARGB; front-mounted PSU chamber |
| p12 | Arctic P12 PWM PST | 120×120×25; **5** pressure blades; flat ARCTIC hub sticker; open corner ears |
| lf3-360 | Arctic Liquid Freezer III 360 | block pump + 60 mm VRM fan; 3× P12 on 38 mm rad; thick sleeved tubes |
| rtx5070 | RTX 5070 Founders Edition | dark cast-metal infinity-loop shroud; dual axial; single flow-through |
| tomahawk-b850 | MSI MAG B850 TOMAHAWK MAX WIFI | black PCB; olive/green MAG accents; dual VRM heatsinks; M.2 shields |
| flare-x5 | G.Skill Flare X5 | low black heatspreaders, no RGB bar |

## Honest language on the site

Do not claim “1:1”, “3D scanned”, “CAD”, or “photo-real product replica”. The builder is a **live signature model** of the real parts list — fitment and AUD stay exact; the mesh matches product silhouettes, not a scanned surface.

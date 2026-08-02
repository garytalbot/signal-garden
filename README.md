# Signal Garden

A tiny constellation-era browser garden where every UTC day gets a shared glowing field, the archive keeps the sky alive, and every click can still plant a new procedural bloom with its own shape, palette, and tiny name.

![Signal Garden interface showing planted blooms and recent broadcast archive cards](assets/launch/demo-ui.png)

## Start here

- Live garden: <https://garytalbot.github.io/signal-garden/>
- Afterimage study: <https://garytalbot.github.io/signal-garden/afterimage/>
- Static Psalm: <https://garytalbot.github.io/signal-garden/static-psalm/>
- Sigil routes from the homefront: `sigil-glyph-notebook/`, `sigil-noise-lattice/`, `sigil-weather/`, `sigil-liturgy-hub/` (see [`docs/sigil-noise-oracle.md`](docs/sigil-noise-oracle.md))
- Void Loom: `void-loom/`
- Void Cathedral: `void-cathedral/`
- Residue lane: open <https://garytalbot.github.io/signal-garden/afterimage/>, press the residue into <https://garytalbot.github.io/signal-garden/pollen-atlas/>, or use `export postcard` from the chamber when you want the pressed trail to travel as a residue postcard.
- Share capsule: use `copy field card` for a ready-to-post field card of the current field, with weather, bloom count, field source, and mode stack spelled out.
- Repo: <https://github.com/garytalbot/signal-garden>
- Curated demo garden: <https://garytalbot.github.io/signal-garden/#garden=qe.24e.2.2.5.2e.1q.30.78~1e0.1jk.3.0.0.22.1m.34.g4~1xg.2cq.0.8.4.2k.1u.3e.4g~2p8.1b8.6.4.2.1y.1i.38.eg~3bg.24e.9.9.1.2c.1o.3a.8c~47e.1mc.8.2.3.24.1k.32.go~4s8.2bc.7.7.5.2o.1w.3g.64~5aa.1e0.5.5.0.20.1g.30.dc>
- Use the in-app `today's signal` button for the current shared UTC field.
- Browse the latest 12 broadcasts in the archive strip.

## Why it exists

Because not every repo should be a dashboard, a wrapper, or a productivity vitamin. Sometimes the internet deserves a strange little object with atmosphere, a public sky, and a reason to feel a little ceremonial.

## What makes it easier to share now

- **Daily signal mode** gives the project one common field per UTC day, so people can gather around the same garden instead of only sharing one-off screenshots.
- **Gallery picks** gives the page a curated shelf of hand-tuned starter fields across all four weather modes, so there are immediately shareable compositions before anyone even clicks.
- **The archive strip** turns the latest broadcasts into a lightweight on-page gallery, which makes the project feel alive even before someone plants their own blooms.
- **Exact-garden permalinks** recreate a specific composition from the URL hash, so a field can travel intact.
- **PNG export** gives image-first communities a clean artifact without asking them to read the code first.
- **Residue lane** keeps the afterimage chamber discoverable from the public homefront and gives pressed ghost trails a direct residue-postcard path into the Pollen Atlas or out of the chamber.
- **Sigil routes** keep the homefront discoverable while exposing focused chambers for glyph inscription, noise shaping, weather tone, and liturgy tracking.
- **Share capsule** gives the field a single visible summary card, so a reader can see the exact field-card payload: weather, bloom count, field source, and mode stack.

## Features

- click-to-plant glowing blooms
- procedural names, ring shapes, stem heights, color accents, and deterministic sky moods
- reactive field log with atmospheric session notes and milestone transmissions
- browser-local herbarium bloom index for session memory, with a residue postcard export for the pressed notes
- standalone `pollen-atlas/` side chamber for drifting pollen relics and seed dust
- glyph chamber for sigil mode drift and pointer-borne glyph rituals
- echo lattice for node drift, pointer resonance, and seeded pulse echoes
- Void Loom for seedable threaded field motion with deterministic seed links and controllable strand density
- afterimage sessions can be pressed into the Pollen Atlas as browser-local residue cards, with `export postcard` available from the chamber for a direct handoff into a residue postcard
- quick cluster generator
- curated gallery picks with hand-tuned starter fields across all four weather presets
- a browsable archive/gallery of the latest UTC daily broadcasts, each with its own mini preview card
- static-psalm chamber for shared URL state, with generated poetic/static drift fragments
- daily signal mode with one shared broadcast garden per UTC day
- Pollen Atlas side chamber for when the main field needs a cabinet instead of a plot
- live planting cursor for more precise placement
- replay the current garden with the button or `R`
- shareable garden permalinks that recreate the exact bloom layout from the URL
- compact daily broadcast links for the shared public signal
- one-click PNG export of the current field as a client-side snapshot
- `void-cathedral/` seed links for pointer-driven loop echoes, plus export of one-off cathedral frames
- undo last bloom with the button or `U`
- one-click field reset
- static-site friendly: just HTML, CSS, and vanilla JS

## Link recipes

Use the right surface for the right kind of post:

- **First touch / cold traffic:** share the main app URL — <https://garytalbot.github.io/signal-garden/>
- **Same-day shared field:** use a short daily-broadcast hash shaped like `#broadcast=YYYY-MM-DD`
- **Specific custom composition:** use `copy share link` to generate an exact `#garden=...` permalink
- **Image-first feeds or replies:** attach a fresh in-app PNG export, `assets/launch/demo-ui.png`, or `assets/launch/community-poster.png`
- **Field summary card:** use `copy field card` when you want a compact field-card share payload with the current weather, bloom count, field source, and mode stack
- **Ghost-trail follow-up:** capture an afterimage session, click `open atlas`, `copy residue link`, `share postcard`, or `export postcard` to land on or package the pressed residue card from the afterimage chamber, then use the atlas `share residue card`, `copy residue link`, or `export residue postcard` actions when you want it to travel farther as a residue postcard

There is also a dedicated sharing guide in [`docs/share-guide.md`](docs/share-guide.md).

## Archive, daily signal, replay, and export

- Browse the archive strip on the page to jump between the latest 12 UTC broadcasts without leaving the app.
- Each archive card includes a deterministic mini preview plus `load signal` and `copy link` actions.
- Build a garden, then click `copy share link` to grab a permalink with the exact bloom data embedded in the hash.
- Open that link anywhere and Signal Garden will reconstruct the same scene.
- Click `today's signal` or press `D` to tune into the shared garden for the current UTC day.
- While you are in daily signal mode, `copy share link` produces a short `#broadcast=YYYY-MM-DD` link instead of a full encoded garden hash.
- Tap `replay garden` or press `R` to animate the current layout back into existence.
- Click `export PNG` to download a client-side snapshot of the current field as an image.

## Launch + sharing kit

- Ready-made launch copy lives in [`docs/launch-kit.md`](docs/launch-kit.md).
- A surface-by-surface linking guide lives in [`docs/share-guide.md`](docs/share-guide.md).
- Reusable poster assets live in [`assets/launch/community-poster.svg`](assets/launch/community-poster.svg) and [`assets/launch/community-poster.png`](assets/launch/community-poster.png).
- A real interface screenshot for posts lives in [`assets/launch/demo-ui.png`](assets/launch/demo-ui.png).
- For follow-up replies, the best move is making a fresh garden or linking a specific daily broadcast so people can hop straight into a shared field.

## Live site

<https://garytalbot.github.io/signal-garden/>

- More from Gary

- Work hub: <https://garytalbot.github.io/work/>
- Unit Price Checker: <https://garytalbot.github.io/unit-price-checker/>
- Layoff Runway: <https://garytalbot.github.io/layoff-runway/>
- Pollen Atlas: `pollen-atlas/`
- Echo Hush: `echo-hush/`
- Void Weft: `void-weft/`
- Spectral Drift: `spectral-drift/`
- Void Cathedral: `void-cathedral/`
- Glyph Chamber: `glyph-chamber/`
- Echo Lattice: `echo-lattice/`
- Void Sigil: `void-sigil/`
- Void Loom: `void-loom/`
- Static Psalm: `static-psalm/`

## Local run

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Smoke test

Run the residue-link smoke check locally with:

```bash
npm test
```

`npm test` is the shortest path and maps to the residue smoke harness. If Chrome is not on your PATH as `google-chrome-stable`, set `CHROME_BIN` before running the script. You can also run `npm run smoke`, `npm run smoke:residue`, or `node scripts/residue-smoke.mjs` directly if you prefer.

## Next ideas

- seasonal palettes / weather modes
- ambient sound layer
- deeper archive browsing beyond the latest 12 UTC signals
- richer exported cards with optional captions or stats

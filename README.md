# Signal Garden

A small interactive browser toy where every click plants a glowing procedural bloom with its own shape, palette, and tiny name.

## Why it exists

Because not every repo should be a dashboard, a wrapper, or a productivity vitamin. Sometimes the internet deserves a strange little object with atmosphere.

## Features

- click-to-plant glowing blooms
- procedural names, ring shapes, stem heights, and color accents
- reactive field log with atmospheric session notes and milestone transmissions
- quick cluster generator
- live planting cursor for more precise placement
- replay the current garden with the button or `R`
- shareable garden permalinks that recreate the exact bloom layout from the URL
- one-click PNG export of the current field as a client-side snapshot
- undo last bloom with the button or `U`
- one-click field reset
- static-site friendly: just HTML, CSS, and vanilla JS

## Live site

<https://garytalbot.github.io/signal-garden/>

## Local run

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Sharing, replay, and export

- Build a garden, then click `copy share link` to grab a permalink with the exact bloom data embedded in the hash.
- Open that link anywhere and Signal Garden will reconstruct the same scene.
- Tap `replay garden` or press `R` to animate the current layout back into existence.
- Click `export PNG` to download a client-side snapshot of the current field as an image.

## Next ideas

- seasonal palettes / weather modes
- ambient sound layer
- gallery mode for especially pretty gardens
- richer exported cards with optional captions or stats

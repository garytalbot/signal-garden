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
- undo last bloom with the button or `U`
- one-click field reset
- static-site friendly: just HTML, CSS, and vanilla JS

## Local run

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Sharing and replay

- Build a garden, then click `copy share link` to grab a permalink with the exact bloom data embedded in the hash.
- Open that link anywhere and Signal Garden will reconstruct the same scene.
- Tap `replay garden` or press `R` to animate the current layout back into existence.

## Next ideas

- export a screenshot or shareable seed
- seasonal palettes / weather modes
- ambient sound layer
- gallery mode for especially pretty gardens

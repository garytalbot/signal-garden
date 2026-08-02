# Postcard mantra mode (residue ritual extension)

Signal Garden now has a front-end-only postcard caption ritual in
`assets/ritual-caption-mode.js`. It layers a timestamped, poetic caption onto:

- `copy field card`
- `share field card`

No backend endpoints are touched; the feature only rewrites what the browser copies
or shares as text.

## How to use

1. In the notes panel, open the **residue ritual** card.
2. Toggle **ritual caption** on.
3. Click **weave fresh caption** to regenerate the line.
4. Use the postcard actions to share/copy with the caption included.

## Notes

- The caption is generated from current share-card metadata (`weather`, `blooms`,
  and card source) plus a local timestamp.
- `copy caption` exports only the ritual line if you want to keep it in a
  separate note.

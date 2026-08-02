# Signal Garden sharing guide

Use the right surface for the right kind of traffic. The public story is a constellation-era garden, so the copy should feel shared, luminous, and a little ceremonial.

## 1) Main app link for first contact

Use this when people have never seen the project before:

- <https://garytalbot.github.io/signal-garden/>

Why:
- it opens on the full experience
- the archive is already visible
- new visitors immediately understand that it is both playable and a living daily gallery

## 2) Daily signal link for shared same-day play

Use this when you want everyone in a thread or community to land in the same field:

- `https://garytalbot.github.io/signal-garden/#broadcast=YYYY-MM-DD`

Why:
- it gives the project a single shared garden for that UTC day
- it keeps the link compact
- it makes follow-up replies feel collaborative instead of fragmented

Fast rule:
- if the post is about **today's field**, use the daily signal
- if the post is about **your exact custom garden**, use a normal garden permalink instead

## 3) Exact-garden link for a specific composition

Use the in-app `copy share link` action after making something worth showing.

The link will look like this:

- `https://garytalbot.github.io/signal-garden/#garden=...`

Why:
- it recreates the exact bloom layout
- it works well for replies, demos, and proof that the thing is actually interactive
- it is the best option when the composition matters more than the shared daily broadcast

## 4) Sigil routes for ritual-first posts

If the audience already knows the project and you are sharing a specific ritual surface, link the route directly:

- `https://garytalbot.github.io/signal-garden/sigil-glyph-notebook/`
- `https://garytalbot.github.io/signal-garden/sigil-noise-lattice/`
- `https://garytalbot.github.io/signal-garden/sigil-weather/`
- `https://garytalbot.github.io/signal-garden/sigil-liturgy-hub/`

Why:
- it keeps readers anchored to the right chamber immediately (glyphs, noise, atmosphere, or liturgy)
- it preserves the homefront context by making the route explicit
- it gives the main page a clear launch path back into core experiences after the route lands

## 5) Archive as a lightweight gallery

Use the on-page archive when you want to point at recent history instead of one single fresh scene.

What to do:
- open the main app
- use the archive strip to load a recent signal
- copy that day’s broadcast link from the archive card if you want a direct jump into that field

Why:
- it makes the project feel alive over time
- it gives curious people more than one thing to click
- it helps the repo read like a living object instead of a one-shot toy

## 6) PNG export for image-first contexts

Use `export PNG` when the audience is more likely to react to an image than a link.

Why:
- screenshots travel well in feeds, chats, and replies
- a fresh export doubles as proof that the scene was generated in the app
- it is the easiest follow-up asset after someone asks what a custom garden looks like

Reusable static assets already in the repo:

- `assets/launch/demo-ui.png`
- `assets/launch/community-poster.png`
- `assets/launch/community-poster.svg`

## 7) Residue link for a pressed atlas card

After you press a residue in `afterimage/`:

- use `open atlas` to jump straight to the pressed card in Pollen Atlas
- use `copy residue link` to copy the atlas handoff URL
- use `share postcard` to send an SVG postcard plus matching link in one native-share step
- use `export postcard` if you prefer an immediate local SVG download

For a pressed residue card, the Atlas equivalents are:

- `copy residue link` for link-first sharing
- `share residue card` for native share
- `export residue postcard` for image-first handoff

Why this route is preferred:
- it keeps the residue tied to the afterimage session instead of flattening back into a generic field card
- it stays stable when `afterimage/` actions are used with local storage failures

If you enable **Sigil Mode** in `afterimage/`, the residue payload is tagged with `sigilMode: true` and a ritual caption, so the payload and shared/exported postcard reflect the ceremonial line style.

Why:
- it carries the selected residue through the URL
- it rehydrates the card in another atlas session
- it keeps the residue-card story intact instead of flattening it into a generic atlas view

## Recommended default moves

- **Cold launch post:** main app URL
- **“Look at today’s field” post:** daily signal link
- **Reply showing something you made:** exact-garden permalink
- **Reply showing a pressed residue:** residue link or residue postcard, whichever reads better in the thread
- **Image-heavy community:** PNG export first, link second
- **“What changed recently?” conversation:** main app URL so the archive is visible immediately

## Short CTA lines that fit the project

- tune into today’s signal
- plant a few blooms and send me your field
- open the archive and steal your favorite sky mood
- here’s the exact garden I made
- the latest broadcasts are all live on the page now

## One thing to avoid

Do not lead with a giant encoded `#garden=...` link when the audience has no idea what Signal Garden is yet. Use the main app URL first, then bring out a custom field once they know the bit.

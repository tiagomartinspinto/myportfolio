# Project Status

## Current State

- Static GitHub Pages portfolio
- Vanilla HTML/CSS/JS, no build step, no dependencies
- Project data in `data/projects.js`
- Site-wide content in `data/site.js`
- Media in `assets/projects/`

## How To Work

Edit `data/projects.js` and `data/site.js` directly, add media under `assets/projects/[slug]/`, then commit and push to `main`. GitHub Pages deploys directly from `main`.

## Current Features

- Mixed media projects
- Draft support
- Video/audio explicit thumbnail and placeholder logic
- Processing-style background
- Project modal and image lightbox
- Compact responsive grid

## Known Issues

- YouTube-derived thumbnails depend on `img.youtube.com`
- External embeds may be blocked by browser/provider settings

## Next Manual Tests

- Live GitHub Pages visual check
- Mobile layout check
- Project modal/lightbox check

## Open Recommendation

- `bqg` and `sagrada-familia` both link to the same YouTube video (`vhMKGt1EqvY`). One is likely a copy-paste error. Confirm the correct video for each, or remove the video item from whichever project does not have its own.

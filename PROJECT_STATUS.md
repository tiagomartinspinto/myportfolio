# Project Status

## Current State

- Static GitHub Pages portfolio
- Vanilla HTML/CSS/JS, no build step, no dependencies
- Project data in `data/projects.js` — derive the current project count from `PROJECTS.length`, do not hard-code it
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

- None currently tracked. All project media and thumbnails are local files under
  `assets/projects/`. `script.js` still supports YouTube/Vimeo/SoundCloud embeds if a
  future project needs one.

## Portfolio Revision (in progress)

- Batch 1 (metadata/copy) committed locally: `9bc7cde Revise portfolio project metadata
  and copy`. Not yet pushed.
- Batch 2 (media revision across 7 projects: PVA, FinnCERES, Chladni Particle Assembly,
  Tulevaisuus miltä se näyttää, Body Interrupted, BQG, Viagem de Volta) is implemented,
  validated, and browser-QA'd, but still uncommitted.
- 16 projects total, every project's media count is 4 or fewer.
- Remaining: commit Batch 2, CV update, Prossigo addition, then push and verify in
  production.

## Next Manual Tests

- Live GitHub Pages visual check
- Mobile layout check
- Project modal/lightbox check

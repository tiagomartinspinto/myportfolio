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
  Tulevaisuus miltä se näyttää, Body Interrupted, BQG, Viagem de Volta) committed locally:
  `3caa15a Revise portfolio project media`. Not yet pushed.
- 16 projects total, every project's media count is 4 or fewer.
- CV updated from the Mar 2025 editable master to Aug 2026. The validated 4-page PDF is now
  hosted in the repo at `assets/cv/tiago-martins-pinto-cv.pdf`, and the footer CV link points
  there instead of the old Proton Drive URL. The validated Aug 2026 editable DOCX lives at
  `~/Downloads/tiagomartinspinto_academicCV_082026.docx`.
- The Google Drive editable master still holds the Mar 2025 version. A manual version upload
  was attempted but did not take effect, so replacing it is still pending.
- Sattuma dead-link correction completed with the repository-declared Render app, GitHub
  repository, Aalto research record, and existing Taiteet ja digi context page.
- Remaining: persist the Aug 2026 editable master in Google Drive, add Prossigo, then push and
  verify in production.

## Next Manual Tests

- Live GitHub Pages visual check
- Mobile layout check
- Project modal/lightbox check

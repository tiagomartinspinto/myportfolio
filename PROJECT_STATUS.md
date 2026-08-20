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

## Portfolio Revision (complete)

- Batch 1 (metadata/copy) committed and pushed: `9bc7cde Revise portfolio project metadata
  and copy`.
- Batch 2 (media revision across 7 projects: PVA, FinnCERES, Chladni Particle Assembly,
  Tulevaisuus miltä se näyttää, Body Interrupted, BQG, Viagem de Volta) committed and pushed:
  `3caa15a Revise portfolio project media`.
- 17 projects total, every project's media count is 4 or fewer.
- CV updated from the Mar 2025 editable master to Aug 2026. The validated 4-page PDF is now
  hosted in the repo at `assets/cv/tiago-martins-pinto-cv.pdf`, while the portfolio CV link now
  points to the editable Google Docs master. The validated Aug 2026 editable DOCX lives at
  `~/Downloads/tiagomartinspinto_academicCV_082026.docx`.
- The Google Drive editable master still holds the Mar 2025 version. A manual version upload
  was attempted but did not take effect, so replacing it is still pending.
- Sattuma dead-link correction completed with the repository-declared Render app, GitHub
  repository, Aalto research record, and existing Taiteet ja digi context page.
- Prossigo's archival text was checked, and Emídio Medeiros's working drawing was added as its
  fourth local image; the Aalto research record link remains included.
- Production verification completed: deployed source, scripts, CV, Sattuma data and links,
  Prossigo data and assets, and all production-owned URLs passed checks against HEAD, with no
  stale CDN deployment observed.
- Fresh interactive desktop/mobile testing was unavailable during the final automated production
  pass. The deployed files were byte-identical to the manually browser-approved committed versions.
- Remaining follow-up: persist the Aug 2026 editable master in Google Drive.

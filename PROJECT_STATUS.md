# Project Status

## Current State

- Static GitHub Pages portfolio
- Vanilla HTML/CSS/JS
- Local-only admin editor
- Project data in `data/projects.js`
- Site-wide content in `data/site.js`
- Media in `assets/projects/`
- npm scripts: `admin`, `preview`, `check`

## How To Work

Local admin:

```bash
npm run admin
```

Optional preview:

```bash
npm run preview
```

Validation:

```bash
npm run check
```

Recommended workflow:

1. Edit in local admin
2. Save + Preview
3. Run check
4. Publish

## Current Features

- Mixed media projects
- Draft support
- Site text editing
- Local image library and crop metadata
- Video/audio explicit thumbnail and placeholder logic
- Processing-style background
- Project modal and image lightbox
- Compact responsive grid
- Footer local-editor helper toast
- Publish runs validation first

## Known Issues

- YouTube-derived thumbnails depend on `img.youtube.com`
- External embeds may be blocked by browser/provider settings
- Admin does not upload media; media files are added manually
- Backup files are local-only and ignored by git
- Older implementation notes are archived in `PROJECT_HISTORY.md`

## Next Manual Tests

- Live GitHub Pages visual check
- Local admin save/preview/publish test
- Mobile layout check
- Project modal/lightbox check
- Footer local editor helper toast check
- `npm run check`

## Latest Cleanup

- Older status notes archived to `PROJECT_HISTORY.md`
- `PROJECT_STATUS.md` simplified
- Footer local-editor toast copy tightened
- Admin project order controls made quieter
- Processing background opacity reduced
- Requested syntax, validation, and diff checks passed

For older detailed implementation history, see `PROJECT_HISTORY.md`.

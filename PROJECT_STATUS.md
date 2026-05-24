# Project Status

## Current State

- Static GitHub Pages portfolio built with vanilla HTML, CSS, and JavaScript
- Project data lives in `data/projects.js`
- Site-wide metadata, header, footer, and contact text live in `data/site.js`
- Project media lives in `assets/projects/`
- Local-only editor lives in `tools/admin/` and is excluded from GitHub Pages deployment
- Public footer `::` link opens `http://127.0.0.1:8787/` only; it does not start local scripts
- Available npm scripts: `admin`, `preview`, and `check`
- Older detailed implementation notes are archived in `PROJECT_HISTORY.md`

## How To Work

Run the local editor:

```bash
npm run admin
```

Then open:

```text
http://127.0.0.1:8787/
```

Optional preview in another terminal:

```bash
npm run preview
```

Then open:

```text
http://127.0.0.1:8080/
```

Before publishing:

```bash
npm run check
```

Typical workflow:

1. Pull `main`
2. Edit projects or site text in the local admin
3. Save locally
4. Preview at `http://127.0.0.1:8080/`
5. Run `npm run check`
6. Commit and push to `main`

## Current Watchlist

- Keep `PROJECT_STATUS.md` short; move older detailed notes into `PROJECT_HISTORY.md`
- Keep `README.md` focused; put detailed admin/media instructions in `tools/admin/README.md`
- Consider removing one of the very-small mobile breakpoints (`520px` or `480px`) during a future CSS cleanup
- Test one full project edit through the admin: draft toggle, save, undo, restore, preview, and publish
- Test one full site-text edit through the admin Site tab
- Check the deployed GitHub Pages site after publishing
- Verify `/tools/admin/` is not deployed publicly
- Fine-tune thumbnail crop metadata where needed

## Known Issues

- `npm run check` currently passes with two expected warnings for YouTube-derived thumbnails in `bqg` and `sagrada-familia`
- YouTube-derived thumbnails depend on `img.youtube.com` being reachable
- External video/audio embeds may be affected by browser privacy settings or provider behavior
- The admin does not upload media; media files must be added manually under `assets/projects/[slug]/`
- Save locally rewrites `data/projects.js` and `data/site.js` using the editor's normalized formatting
- The particle background is intentionally faint; tune `background.js` constants if it needs more or less presence

## Last Verification

Date: 2026-05-24

- Pulled from `origin/main`; repo was already up to date
- Ran a live local visual pass for footer toast, particle background, modal/lightbox, mobile grid, and local editor link
- Ran `npm run check`; validation passed with the two expected YouTube-derived thumbnail warnings
- Confirmed no files changed during the visual pass

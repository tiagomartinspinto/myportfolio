# Project Status

## Latest update

Date: 2026-05-18

- Reorganized the local admin around Projects, Content, Images, Preview, and Publish / Safety tabs
- Added a sticky action bar for Save locally, Preview site, Publish, Reload, Undo save, and theme switching
- Improved the left project column with search, new project, duplicate project, apply, reset, delete, and order controls
- Added non-destructive thumbnail crop metadata editing with pan X, pan Y, zoom, presets, large preview, thumbnail preview, and canvas preview
- Added download-only cropped-thumbnail PNG export; original images are not overwritten, deleted, uploaded, or auto-saved
- Added project-level `thumbnailZoom` metadata and public thumbnail rendering support
- Added a dark/light admin theme toggle, defaulting to dark and storing only the UI preference in `localStorage`
- Kept existing backup, undo, restore, empty-portfolio, publish-summary, and localhost-only safety protections
- Added the visible publish-access note: cloning the repo does not grant publish permission
- Added a discreet public-footer `local editor` launcher that points only to `http://127.0.0.1:8787/`
- Updated README files to document the tabbed admin, crop metadata, theme toggle, and safe crop download

## Files changed in the latest update

- `index.html`
- `README.md`
- `PROJECT_STATUS.md`
- `script.js`
- `styles.css`
- `tools/admin/README.md`
- `tools/admin/admin.css`
- `tools/admin/admin.js`
- `tools/admin/index.html`
- `tools/admin/project-data.js`
- `tools/admin/thumbnail-tools.js`

## Current structure

- `index.html`: compact portfolio structure, Cargo-style header/footer shell, and modal markup
- `styles.css`: minimal portfolio styling, shell typography, and thumbnail crop/zoom rendering
- `script.js`: project rendering, direct filter matching, modal behavior, and thumbnail metadata binding
- `data/projects.js`: project data, local image paths, content-based categories, optional `thumbnailPosition`, and optional `thumbnailZoom`
- `assets/projects/`: local project images
- `tools/admin/`: local-only tabbed project editor, localhost server, image helpers, and crop helper module
- `_config.yml`: excludes the local editor from GitHub Pages deployment
- `package.json`: local helper scripts for admin and preview
- `.gitignore`: ignores local backup and Finder noise

## Current state

- Project media is local
- No runtime `freight.cargo.site` URLs remain
- The local editor exists only under `tools/admin/`, binds only to `127.0.0.1`, and is not publicly linked from the site
- `_config.yml` excludes `tools/admin/` from GitHub Pages publishing
- The admin UI is tabbed so project metadata, content, images, preview, and safety controls are not shown all at once
- The sticky action bar keeps save, preview, publish, reload, undo, and theme actions available
- The editor can save directly to `data/projects.js` and refreshes `data/projects.backup.js` before every save
- The editor can undo or restore the latest saved backup
- Publish still runs only local git commands and depends on the machine already having write access
- Image entries support path copy, open image, dimension detection, reorder, duplicate, remove, and set as thumbnail
- The Images tab edits crop metadata only; original image files are untouched
- The canvas crop export is download-only and must be manually placed in `assets/projects/[slug]/` if used
- Image diagnostics report missing files, unused files, invalid paths, missing alt text, and missing width/height
- The public project grid uses `thumbnailPosition` and `thumbnailZoom` for thumbnails
- Light mode is available for the admin and persists only as a local UI preference
- The public footer has a tiny muted `local editor` link that opens `http://127.0.0.1:8787/` in a new tab and only works when `npm run admin` is running locally

## Remaining tasks

- Check the deployed GitHub Pages site after publishing
- Verify that `/tools/admin/` is not present on the deployed GitHub Pages site
- Test one real end-to-end content edit through the admin: save, undo, restore, preview, and publish
- Download one cropped thumbnail, place it manually under `assets/projects/[slug]/`, and decide whether generated thumbnails are worth using
- Click through intentional external links in a normal browser session
- Fine-tune thumbnail crop metadata only where subjects are still cropped awkwardly

## Known issues

- Some external sites may block automated checks, so manual click-through is still worth doing
- If a custom domain is added later, canonical and social metadata URLs should be updated again
- README and project status intentionally still mention the Cargo migration as historical context
- During local preview, a browser session may cache older module output; hard refresh if filters or card content look stale
- Git publish still depends on local git authentication and repository write access
- The admin does not upload images; `assets/projects/[slug]/` stays manual by design
- Save locally rewrites `data/projects.js` into the editor's normalized object formatting
- Image diagnostics reflect the working list plus the current form draft, so half-finished edits can briefly report expected warnings
- The crop controls simulate thumbnail rendering; exported PNGs should still be visually checked before replacing any hand-picked thumbnail

## Manual tests run in this update

1. Confirmed admin server responds at `http://127.0.0.1:8787/`
2. Confirmed preview server responds at `http://127.0.0.1:8080/`
3. Confirmed preview server returns 404 for `/tools/admin/`
4. Ran JavaScript syntax checks for admin, crop helper, project-data helper, and public script
5. Validated existing `data/projects.js` against the updated project schema
6. Loaded the admin in the in-app browser and checked for console errors
7. Verified the tabbed desktop layout visually
8. Verified the Images tab large preview, thumbnail crop preview, canvas preview, and diagnostics
9. Tested the Subject center preset and confirmed it updates `thumbnailPosition` and `thumbnailZoom`
10. Verified light mode colors and toggled back to dark mode
11. Verified the footer `local editor` link targets localhost only and `_config.yml` still excludes `tools/`

## Notes for future chats

- Keep the site compact and direct
- Avoid reintroducing filler copy or decorative UI systems
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep the admin local-only and avoid adding secrets, remote APIs, cloud uploads, analytics, or arbitrary file writes
- Preserve the write restriction: only `data/projects.js`, `data/projects.backup.js`, and manual edits to `PROJECT_STATUS.md`
- Keep image editing non-destructive unless an explicit future task adds a carefully scoped export workflow
- Keep this file updated after meaningful design or deployment work

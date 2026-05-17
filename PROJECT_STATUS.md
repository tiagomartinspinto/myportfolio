# Project Status

## Latest update

Date: 2026-05-17

- Expanded the local-only editor with image previews, thumbnail-position presets, image browsing, and local image-dimension detection
- Added an image diagnostics panel for missing files, unused files, invalid paths, missing alt text, and missing width/height metadata
- Added automatic backup creation to `data/projects.backup.js` before every save
- Added `Undo last save` and `Restore backup` actions
- Added stronger save and publish protections, including empty-portfolio confirmation phrases and a publish summary for added / modified / deleted projects
- Added `.gitignore` rules for `.DS_Store`, `node_modules/`, and `data/projects.backup.js`
- Updated README and `tools/admin/README.md` to document the image and recovery workflow

## Files changed in the latest update

- `.gitignore`
- `tools/admin/index.html`
- `tools/admin/admin.css`
- `tools/admin/admin.js`
- `tools/admin/server.js`
- `tools/admin/image-utils.js`
- `tools/admin/README.md`
- `README.md`
- `PROJECT_STATUS.md`

## Current structure

- `index.html`: compact portfolio structure, Cargo-style header/footer shell, and modal markup
- `styles.css`: minimal portfolio styling, shell typography, and thumbnail cropping rules
- `script.js`: project rendering, direct filter matching, and modal behavior
- `data/projects.js`: project data, local image paths, content-based categories, and optional thumbnail positioning
- `assets/projects/`: local project images
- `tools/admin/`: local-only project editor, localhost server, and image helpers
- `_config.yml`: excludes the local editor from GitHub Pages deployment
- `package.json`: local helper scripts for admin and preview
- `.gitignore`: ignores local backup and Finder noise

## Current state

- Project media is local
- No runtime `freight.cargo.site` URLs remain
- `script.js` contains UI behavior only
- The local editor exists only under `tools/admin/`, binds only to `127.0.0.1`, and is not publicly linked from the site
- `_config.yml` excludes `tools/admin/` from GitHub Pages publishing
- The local editor can now save directly to `data/projects.js` instead of relying on copy-paste
- The local editor creates `data/projects.backup.js` automatically before saving
- The local editor can undo or restore the latest saved backup
- The local editor can publish `data/projects.js` and `PROJECT_STATUS.md` through local git only
- Saving through the local editor normalizes the formatting of `data/projects.js` while preserving project content
- Image entries now show square previews, missing-file warnings, local browsing, and dimension detection
- The editor now reports image diagnostics for missing files, unused files, invalid paths, missing alt text, and missing width/height
- Publish now shows a project change summary before running git
- The live GitHub Pages metadata points at the correct absolute image URL
- The site shell now follows the old Cargo reference more closely at the top and bottom
- The project grid and modal behavior remain unchanged
- The visible filters and the underlying project categories now use the same content-based vocabulary
- The footer block is now more compact and less visually heavy
- Footer links now point to the current Aalto email, GitHub profile, and lecturer page
- The mail action now lives in the header instead of being duplicated in the footer
- Project card years are removed and thumbnail positioning can now be tuned per project
- `Carried by Invisible Bodies` and `From the Dead Air Orgy` now point to the current intended external destinations

## Remaining tasks

- Check the deployed GitHub Pages site after it updates
- Verify that `tools/admin/` is not present on the deployed GitHub Pages site
- Test the local admin editor end-to-end with one created project, one reorder, one save, one undo, and one real publish
- Click through intentional external links in a normal browser session
- Fine-tune thumbnail positions only if any important subject is still cropped awkwardly
- Do one normal-browser click-through on the two updated external project links
- Sanity-check the new category groupings on the live site and see if any project feels misfiled

## Known issues

- Some external sites may block automated checks, so manual click-through is still worth doing
- If a custom domain is added later, canonical and social metadata URLs should be updated again
- README and project status intentionally still mention the Cargo migration as historical context
- During local preview, a browser session may cache older module output; hard refresh if filters or card content look stale
- Git publish still depends on the local machine already having push access configured for this repo
- The admin does not upload images; `assets/projects/[slug]/` stays manual by design
- Save locally rewrites `data/projects.js` into the editor's normalized object formatting
- Image diagnostics reflect the working list plus the current form draft, which is useful but may briefly report issues for half-finished edits

## Manual tests to run next

1. Open the live GitHub Pages deployment at `/myportfolio/`
2. Confirm that `/tools/admin/` is not publicly reachable on GitHub Pages
3. Run `npm run admin` and open `http://127.0.0.1:8787/`
4. Run `npm run preview` and open `http://127.0.0.1:8080/`
5. Load an existing project, use the image browser, and detect dimensions for one image
6. Save locally and confirm `data/projects.backup.js` is refreshed
7. Undo the save and confirm the previous file returns
8. Create a temporary project draft, reorder it, then delete it again
9. Publish once with a small real content edit and confirm the git output looks correct
10. Check the header face, header/footer type scale, footer density, first-row thumbnail crops, project modals, and external links

## Notes for future chats

- Keep the site compact and direct
- Avoid reintroducing filler copy or decorative UI systems
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep the admin local-only and avoid adding secrets, remote APIs, or arbitrary file writes
- Preserve the write restriction: only `data/projects.js`, `data/projects.backup.js`, and manual edits to `PROJECT_STATUS.md`
- Keep this file updated after meaningful design or deployment work

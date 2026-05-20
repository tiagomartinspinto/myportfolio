# Project Status

## Latest Update

Date: 2026-05-20

- Added `npm run check` through `tools/admin/check.js` for lightweight validation of project data, site data, media paths, links, local assets, drafts, and approved categories
- Added `data/site.js` for editable site-wide metadata, header content, contact email, footer links, about text, location text, and role links
- Updated the public site to render header/footer/site metadata from `SITE` while keeping static SEO fallbacks in `index.html`
- Added draft project support with `draft: true`; drafts remain editable locally and are hidden from the public project grid and filters
- Added a Site tab to the local editor for editing `data/site.js`
- Updated Save locally to write `data/projects.js` and `data/site.js`, with `data/projects.backup.js` and `data/site.backup.js`
- Updated Publish to run `npm run check` before committing, then stage only approved portfolio paths
- Kept the local admin localhost-only and avoided tokens, credentials, remote APIs, analytics, databases, or public CMS behavior
- Made public project thumbnails slightly smaller and more compact, with up to four centered columns on wide screens
- Improved mobile modal/gallery behavior with a sticky close button, clearer active gallery thumbs, contained media, and easier tap targets
- Expanded README and local admin documentation with site editing, draft workflow, validation, publish safety, and media examples

## Files Changed In This Update

- `.gitignore`
- `index.html`
- `styles.css`
- `script.js`
- `package.json`
- `data/site.js`
- `README.md`
- `PROJECT_STATUS.md`
- `tools/admin/README.md`
- `tools/admin/admin.css`
- `tools/admin/admin.js`
- `tools/admin/check.js`
- `tools/admin/index.html`
- `tools/admin/project-data.js`
- `tools/admin/server.js`
- `tools/admin/site-data.js`

## Current Structure

- `index.html`: compact public shell, static SEO fallbacks, footer/modal markup, and local editor launcher
- `styles.css`: minimal public styling, centered responsive project grid, footer columns, and mixed-media modal styling
- `script.js`: site shell rendering, published-project filtering, dynamic grid rendering, mixed-media gallery rendering, modal behavior, and thumbnail metadata binding
- `data/projects.js`: project data, refined copy, mixed `media` arrays, links, categories, and thumbnail crop metadata
- `data/site.js`: editable site-wide metadata, header, footer, contact, and social preview data
- `assets/projects/`: local project media assets
- `tools/admin/`: local-only tabbed editor, site tab, media controls, validation helpers, image helpers, crop helper module, and localhost server
- `_config.yml`: excludes the local editor from GitHub Pages deployment
- `package.json`: local helper scripts for admin, preview, and validation
- `.gitignore`: ignores local backups and operating-system noise

## Current State

- The portfolio remains a compact static GitHub Pages site with vanilla HTML/CSS/JS
- `Programming for Visual Artists` has proper portfolio presence and links to the course archive and repository
- Site-wide metadata and shell text now live in `data/site.js`
- Draft projects are supported locally and hidden publicly
- Project galleries support `media` items while still reading old `images` data if encountered
- The public project grid uses the first image media item plus `thumbnailPosition` and `thumbnailZoom` for thumbnail rendering
- Video and audio media can appear in the gallery modal
- The project grid centers wrapped rows, supports a more compact four-column desktop layout, and becomes a single column on small screens
- The footer has three areas: links on the left, about text centered, and Helsinki / Aalto role links on the right
- The local editor remains local-only, localhost-bound, and excluded from public deployment
- The admin still shows the visible local-only banner and public/read-only warning when relevant
- Public/read-only mode still blocks save, publish, backup restore, image scanning, dimension detection, local API access, and filesystem access
- Save locally refreshes project and site backups before rewriting `data/projects.js` and `data/site.js`
- Publish runs `npm run check` first, then local git commands, and depends on this computer already having repository write access
- Image crop editing remains metadata-only; original image files are not changed
- Cropped thumbnail export remains download-only
- The admin dark/light theme preference is stored only in local UI storage, not in project data

## Remaining Tasks

- Check the deployed GitHub Pages site after publishing
- Verify that `/tools/admin/` is not present on the deployed GitHub Pages site
- Test one full project edit through the admin: draft toggle, save, undo, restore, preview, and publish
- Test one full site-text edit through the admin Site tab
- Add real video or audio entries to more projects when stable public media sources are available
- Decide whether any generated cropped thumbnails should be manually placed under `assets/projects/[slug]/`
- Fine-tune thumbnail crop metadata where the new centered grid reveals awkward crops

## Known Issues

- Some external video/audio providers can block embeds or automated checks depending on browser privacy settings
- If a custom domain is added later, canonical and social metadata URLs should be updated
- The admin does not upload media; files under `assets/projects/[slug]/` stay manual by design
- Save locally rewrites `data/projects.js` into the editor's normalized object formatting
- Save locally also rewrites `data/site.js` into the editor's normalized object formatting
- Image diagnostics focus on image media and do not validate remote video/audio availability
- The crop controls simulate thumbnail rendering; exported PNGs should still be visually checked before use

## Manual Tests Run In This Update

1. Pulled/fetched and confirmed Desktop `main`, `origin/main`, and the temporary worktree were aligned before editing
2. Inspected the current public renderer, project data, local admin, local server, and documentation
3. Ran JavaScript syntax checks for `script.js`, `tools/admin/admin.js`, `tools/admin/project-data.js`, `tools/admin/server.js`, `tools/admin/site-data.js`, and `tools/admin/check.js`
4. Ran `npm run check`; 11 projects passed validation, with 11 published and 0 drafts
5. Started the local preview server and confirmed `/`, `/data/site.js`, and a representative project image return successfully
6. Confirmed the preview server still blocks `/tools/admin/`
7. Started the local admin server and confirmed `/`, `/data/site.js`, and `/api/projects` return successfully
8. Confirmed `/api/projects` includes the `site` object for the new Site tab

## Notes For Future Chats

- Keep the site compact, direct, and visually restrained
- Preserve the artistic-research tone without adding inflated artist-statement language
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep the admin local-only and avoid secrets, remote write APIs, cloud uploads, analytics, or arbitrary file writes
- Keep image editing non-destructive unless a future task explicitly scopes a safe export-only workflow
- Keep this file updated after meaningful design, content, admin, or deployment work

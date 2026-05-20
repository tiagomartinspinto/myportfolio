# Project Status

## Latest Update

Date: 2026-05-20

- Refined project copy across the portfolio toward a more reflective art, technology, education, and research practice voice
- Kept existing project identities, dates, roles, and directness while making the language more process-oriented and human
- Added `Programming for Visual Artists` as a full 2026 teaching / creative coding / education portfolio project
- Added a local course-preview SVG asset for the new teaching project
- Updated the homepage metadata and footer about text toward art, technology, education, Aalto teaching, art education research, workshop practice, Helsinki, and making
- Extended project data from image-only galleries to mixed `media` entries for image, video, and audio
- Preserved compatibility with older `images` arrays in the public renderer and local editor
- Added public gallery rendering for image, YouTube, Vimeo, direct video, local video, SoundCloud, direct audio, and local audio media
- Added mixed-media controls to the local editor Images tab: add image, add video, add audio, provider, source, caption, thumbnail, and media order controls
- Kept thumbnail crop editing non-destructive and limited to image media
- Added SVG dimension detection for local image assets
- Rebalanced the project grid so wrapped rows center visually instead of leaving left-heavy gaps
- Reworked the footer into left, center, and right areas while keeping the discreet localhost editor launcher outside the layout
- Updated README files for tabbed admin, mixed media, crop metadata, light/dark mode, and export-only cropped thumbnail downloads
- Completed a tracked-file trace scan; no requested trace terms remain

## Files Changed In This Update

- `index.html`
- `styles.css`
- `script.js`
- `data/projects.js`
- `README.md`
- `PROJECT_STATUS.md`
- `assets/projects/programming-for-visual-artists/site-preview.svg`
- `tools/admin/README.md`
- `tools/admin/admin.js`
- `tools/admin/image-utils.js`
- `tools/admin/index.html`
- `tools/admin/project-data.js`
- `tools/admin/server.js`

## Current Structure

- `index.html`: compact public shell, footer layout, project modal markup, and local editor launcher
- `styles.css`: minimal public styling, centered responsive project grid, footer columns, and mixed-media modal styling
- `script.js`: project filters, dynamic grid rendering, mixed-media gallery rendering, modal behavior, and thumbnail metadata binding
- `data/projects.js`: project data, refined copy, mixed `media` arrays, links, categories, and thumbnail crop metadata
- `assets/projects/`: local project media assets
- `tools/admin/`: local-only tabbed editor, media controls, image helpers, crop helper module, and localhost server
- `_config.yml`: excludes the local editor from GitHub Pages deployment
- `package.json`: local helper scripts for admin and preview
- `.gitignore`: ignores local backup and operating-system noise

## Current State

- The portfolio now presents the work more clearly as artistic-research practice across art, technology, education, creative coding, exhibitions, participatory work, and media systems
- `Programming for Visual Artists` has proper portfolio presence and links to the course archive and repository
- Project galleries support `media` items while still reading old `images` data if encountered
- The public project grid uses the first image media item plus `thumbnailPosition` and `thumbnailZoom` for thumbnail rendering
- Video and audio media can appear in the gallery modal
- The project grid centers wrapped rows on desktop and becomes a single column on small screens
- The footer has three areas: links on the left, about text centered, and Helsinki / Aalto role links on the right
- The local editor remains local-only, localhost-bound, and excluded from public deployment
- The admin still shows the visible local-only banner and public/read-only warning when relevant
- Public/read-only mode still blocks save, publish, backup restore, image scanning, dimension detection, local API access, and filesystem access
- Save locally still refreshes `data/projects.backup.js` before rewriting `data/projects.js`
- Publish still runs only local git commands and depends on this computer already having repository write access
- Image crop editing remains metadata-only; original image files are not changed
- Cropped thumbnail export remains download-only
- The admin dark/light theme preference is stored only in local UI storage, not in project data

## Remaining Tasks

- Check the deployed GitHub Pages site after publishing
- Verify that `/tools/admin/` is not present on the deployed GitHub Pages site
- Test one full content edit through the admin: save, undo, restore, preview, and publish
- Add real video or audio entries to more projects when stable public media sources are available
- Decide whether any generated cropped thumbnails should be manually placed under `assets/projects/[slug]/`
- Fine-tune thumbnail crop metadata where the new centered grid reveals awkward crops

## Known Issues

- Some external video/audio providers can block embeds or automated checks depending on browser privacy settings
- If a custom domain is added later, canonical and social metadata URLs should be updated
- The admin does not upload media; files under `assets/projects/[slug]/` stay manual by design
- Save locally rewrites `data/projects.js` into the editor's normalized object formatting
- Image diagnostics focus on image media and do not validate remote video/audio availability
- The crop controls simulate thumbnail rendering; exported PNGs should still be visually checked before use

## Manual Tests Run In This Update

1. Pulled and confirmed the local checkout was aligned before editing
2. Inspected the portfolio structure, project data, public renderer, local admin, server, and documentation
3. Inspected the public `Programming for Visual Artists` course repository and course page content for factual grounding
4. Ran JavaScript syntax checks for `script.js`, `tools/admin/admin.js`, `tools/admin/project-data.js`, and `tools/admin/server.js`
5. Validated `data/projects.js` through the updated local admin schema; 11 projects passed validation
6. Confirmed the tracked-file trace scan no longer returns requested trace terms
7. Started the local preview server and confirmed the public page responds at `http://127.0.0.1:8080/`
8. Confirmed the preview server still returns 404 for `/tools/admin/`
9. Checked the public preview in the browser: 11 project cards render, the first project is `Programming for Visual Artists`, and the footer launcher still points only to localhost
10. Opened the first project modal and confirmed the new teaching project renders image media and links
11. Opened `BQG`, selected the video gallery item, and confirmed the YouTube embed renders in the mixed-media modal
12. Started the local admin server and confirmed the editor loads 11 projects with Save and Publish enabled in localhost mode
13. Checked the Images tab media controls and confirmed Add video creates a video row with YouTube provider selected
14. Re-tested simulated public/read-only mode and confirmed it loads static project data while Save and Publish remain disabled
15. Checked a mobile-width public preview: single-column project cards, stacked footer columns, no horizontal overflow, and the discreet local editor control stays bottom-right

## Notes For Future Chats

- Keep the site compact, direct, and visually restrained
- Preserve the artistic-research tone without adding inflated artist-statement language
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep the admin local-only and avoid secrets, remote write APIs, cloud uploads, analytics, or arbitrary file writes
- Keep image editing non-destructive unless a future task explicitly scopes a safe export-only workflow
- Keep this file updated after meaningful design, content, admin, or deployment work

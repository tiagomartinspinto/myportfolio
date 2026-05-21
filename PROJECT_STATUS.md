# Project Status

## Latest Update

Date: 2026-05-21

- Refined `data/site.js` metadata so the browser title returns to `Tiago Martins Pinto - Art, Technology, Education`
- Removed repeated Helsinki/Aalto/teaching/research wording from the site description and footer about text
- Kept Helsinki only in the footer location line
- Replaced the footer About Me lines with a quieter practice-oriented text block
- Added a subtle `::` loading mark before the project grid renders
- Added gentle thumbnail fade-in once images load while preserving reserved aspect-ratio boxes
- Added a discreet centered `+` button for loading more projects
- Set initial public project visibility to 8 projects on desktop and 6 on tablet/mobile
- Set load-more increments to 4 projects on desktop and 3 on tablet/mobile
- Reset visible project count when filters change
- Kept draft projects hidden from the public grid and filters
- Preserved the compact centered grid and local admin workflow
- Added discreet CV and ORCID links to the left footer link column
- Added a `title="Load more projects"` tooltip to the `+` load-more button while keeping its aria label
- Added an explicit very-small-phone grid breakpoint at `480px`
- Added explicit reduced-motion rules for the loading mark and thumbnail fade
- Re-ran `npm run check`; validation passes

## Files Changed In This Update

- `index.html`
- `styles.css`
- `script.js`
- `data/site.js`
- `PROJECT_STATUS.md`

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
- The public grid initially shows a smaller set of projects and reveals more through a small centered `+` button
- The project grid shows a subtle loading mark before rendering and fades thumbnails in as they load
- The footer has three areas: GitHub / LinkedIn / CV / ORCID links on the left, about text centered, and Helsinki / Aalto role links on the right
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
- Check desktop viewport behavior on the deployed site after GitHub Pages updates
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
- The loading mark can be very brief on fast connections because project data is local and renders immediately

## Manual Tests Run In This Update

1. Pulled/fetched and confirmed Desktop `main`, `origin/main`, and the temporary worktree were aligned before editing
2. Ran `node --check script.js`
3. Ran `npm run check`; 11 projects passed validation, with 11 published and 0 drafts
4. Ran `git diff --check`
5. Started the local preview server and opened the public site in the in-app browser
6. Confirmed the main page renders the new title, metadata, footer text, and footer location without repeating Helsinki in metadata
7. Confirmed the loading mark is hidden after the grid renders
8. Confirmed mobile/tablet-sized initial project count is 6
9. Confirmed the `+` load-more button is visible when more projects exist and reveals 3 additional projects at the current compact viewport
10. Confirmed filtering resets visible project count and hides the load-more button when the active filter has fewer projects than the initial count
11. Confirmed draft projects remain hidden publicly
12. Confirmed thumbnails use the loaded-image class for fade-in behavior
13. Confirmed the footer data now includes GitHub, LinkedIn, CV, and ORCID in the left column
14. Confirmed the load-more button keeps `aria-label="Load more projects"` and now has `title="Load more projects"`
15. Confirmed the CSS includes a `480px` single-column project-card breakpoint
16. Confirmed reduced-motion CSS explicitly disables the loading animation and thumbnail image transition
17. Re-ran `npm run check`; 11 projects passed validation, with 11 published and 0 drafts

## Notes For Future Chats

- Keep the site compact, direct, and visually restrained
- Preserve the artistic-research tone without adding inflated artist-statement language
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep the admin local-only and avoid secrets, remote write APIs, cloud uploads, analytics, or arbitrary file writes
- Keep image editing non-destructive unless a future task explicitly scopes a safe export-only workflow
- Keep this file updated after meaningful design, content, admin, or deployment work

# Project Status

## Latest Update

Date: 2026-05-21

- Added unsaved-change warnings for project switching, reload, browser tab close, and publish when the current form, working project list, or site text has unapplied/unsaved changes
- Added a sticky action-bar `Save + Preview` button that applies the current form state, saves locally, then opens or refreshes `http://127.0.0.1:8080/`
- Added a Publish / Safety `Run check` button that runs `npm run check` through the local admin server without committing or pushing
- Hardened the local server check command to run the same validation script as `npm run check` without relying on fragile Windows npm shims
- Exported the validation runner from `tools/admin/check.js` so the admin can run checks in-process while the command-line `npm run check` behavior stays intact
- Improved Save, Run check, Restore backup, and Publish failures so the status area shows a short readable summary while full technical output stays in Git output
- Added selected-project order controls for moving a project up, down, or directly to the top
- Added small media-row badges for image, YouTube, Vimeo, local video, SoundCloud, audio, and URL entries
- Added media-row warnings for the first media item/main thumbnail and video/audio entries without explicit thumbnails
- Made the admin action bar static on very small screens so the expanded button stack does not cover the tab controls
- Kept video/audio thumbnail behavior explicit: YouTube can derive from its own video ID, while Vimeo/local/direct video and audio without thumbnails show neutral placeholders
- Documented the final admin usability polish in `README.md` and `tools/admin/README.md`
- Re-ran `npm run check`; validation passes with two expected YouTube-derived thumbnail warnings
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
- Made main grid thumbnails black-and-white by default, with a subtle return to color on hover and keyboard focus
- Added collapse behavior to the discreet project-grid control: `+` loads more projects and `-` returns to the initial count
- Kept the load-more/collapse control accessible with matching aria labels and title text
- Reduced the project modal title scale for a calmer balance with project media
- Added a stable contained media frame in the project modal so differently sized images do not resize the window dramatically
- Kept modal media uncropped with `object-fit: contain`; the black-and-white thumbnail treatment is limited to the main grid
- Replaced the footer About Me closing lines with the quiet ocean / striped canvas tent memory text
- Moved the `isFullyExpanded(totalProjects)` helper next to the load-more helpers so expand/collapse calls cannot reference an undefined helper during future edits
- Changed public thumbnail logic so video/audio media only use their own explicit `thumbnail` field and never borrow another project image
- Added neutral gallery/grid placeholders for video/audio media without thumbnails
- Added a minimal image-only lightbox from the project modal feature image, with Esc, backdrop, and close-button dismissal
- Added a discreet `larger` image control while keeping full project images contained and uncropped
- Clarified the local admin media field as `Thumbnail / poster image` with a note that video/audio thumbnails are not auto-generated
- Updated public and admin documentation for explicit video thumbnails, neutral placeholders, and larger image viewing
- Refined video thumbnail logic so YouTube videos without explicit thumbnails derive thumbnails only from their own video ID
- Removed project-image thumbnails from existing YouTube video media entries so they no longer borrow nearby gallery images
- Allowed first video/audio media items to pass validation without thumbnails; the public site shows YouTube-derived thumbnails or neutral placeholders
- Added check warnings for video/audio media without explicit thumbnails instead of failing validation
- Made the full-image lightbox control use a discreet `⤢` symbol that appears on hover/focus and remains faint on touch devices
- Replaced visible project dialog and image lightbox `Close` labels with accessible `×` symbol buttons
- Styled modal close controls as balanced 28px muted symbol buttons with brighter hover/focus states
- Re-ran `npm run check`; validation passes

## Files Changed In This Update

- `README.md`
- `PROJECT_STATUS.md`
- `tools/admin/README.md`
- `tools/admin/admin.css`
- `tools/admin/admin.js`
- `tools/admin/check.js`
- `tools/admin/index.html`
- `tools/admin/server.js`

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
- The public project grid uses the first media item plus `thumbnailPosition` and `thumbnailZoom`; first-media YouTube videos without explicit thumbnails use their own YouTube-derived thumbnail
- Public grid thumbnails render in black-and-white by default and return to color on hover or keyboard focus
- Video/audio media never borrow project images; YouTube can derive a thumbnail from the video ID, while Vimeo/local/direct video and audio without thumbnails render neutral type placeholders
- Video and audio media can appear in the gallery modal
- The project modal uses a stable contained media frame to reduce layout shifts between different image proportions
- Image media in the project modal can be opened in a minimal larger view without cropping
- The project grid centers wrapped rows, supports a more compact four-column desktop layout, and becomes a single column on small screens
- The public grid initially shows a smaller set of projects and expands/collapses through a small centered symbol button
- The project grid shows a subtle loading mark before rendering and fades thumbnails in as they load
- The footer has three areas: GitHub / LinkedIn / CV / ORCID links on the left, about text centered, and Helsinki / Aalto role links on the right
- The local editor remains local-only, localhost-bound, and excluded from public deployment
- The admin still shows the visible local-only banner and public/read-only warning when relevant
- Public/read-only mode still blocks save, publish, backup restore, image scanning, dimension detection, local API access, and filesystem access
- The admin warns before losing unapplied/unsaved form, project-list, or site-text changes
- Save + Preview saves local data and opens or refreshes the local preview server at `http://127.0.0.1:8080/`
- Publish / Safety can run `npm run check` without committing or pushing
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
- External video/audio embeds may still have provider-specific aspect-ratio or privacy behavior, even though the modal frame is stable
- Vimeo/local/direct video and audio items without explicit thumbnails intentionally show neutral placeholders; add a local thumbnail path when a visual preview is desired
- YouTube-derived thumbnails are remote `img.youtube.com` images and depend on that public thumbnail endpoint being reachable

## Manual Tests Run In This Update

1. Ran `node --check tools/admin/admin.js`
2. Ran `node --check tools/admin/server.js`
3. Ran `node --check tools/admin/check.js`
4. Confirmed in the local admin UI that Save + Preview, Run check, and selected-project order controls render and are enabled/disabled appropriately
5. Confirmed in the local admin UI that media rows show type badges and the first media item warning
6. Confirmed the small-screen admin action bar no longer covers the tab controls
7. Confirmed the Publish / Safety `Run check` button completes successfully and writes full output to Git output
8. Ran `npm run check`; 11 projects passed validation, with 11 published and 0 drafts
9. Confirmed `npm run check` reports only the expected YouTube-derived thumbnail warnings for `bqg` and `sagrada-familia`

## Notes For Future Chats

- Keep the site compact, direct, and visually restrained
- Preserve the artistic-research tone without adding inflated artist-statement language
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep the admin local-only and avoid secrets, remote write APIs, cloud uploads, analytics, or arbitrary file writes
- Keep image editing non-destructive unless a future task explicitly scopes a safe export-only workflow
- Keep this file updated after meaningful design, content, admin, or deployment work

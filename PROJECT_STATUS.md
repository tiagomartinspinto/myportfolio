# Project Status

## Completed in this pass

- Confirmed that project content now lives in `data/projects.js`
- Confirmed that `script.js` now contains UI behavior only
- Confirmed that all project media referenced by project data is local
- Confirmed that 25 localized project image files are present under `assets/projects/`
- Confirmed that no runtime `freight.cargo.site` URLs remain in `index.html`, `script.js`, or `data/projects.js`
- Removed the last on-page Cargo mention from `index.html`
- Updated `README.md` with clearer local preview, offline behavior, deployment, and handoff notes
- Updated repo references to the current repository and GitHub Pages path
- Added this status file for future handoff

## Files changed

- `index.html`
- `README.md`
- `PROJECT_STATUS.md`
- `data/projects.js`
- `script.js`
- `styles.css`
- `assets/favicon.ico`
- `assets/projects/`

## Remaining tasks

- Push the current migration state to `tiagomartinspinto/myportfolio`
- Enable or verify GitHub Pages deployment for the repository
- Manually review all external project links in a normal browser session
- Do one visual polish pass on mobile and desktop after the deployed site is live

## Known issues

- Some external sites such as LinkedIn, Aalto, and OpenProcessing may block automated link checks, so browser-based manual verification is still useful
- Social preview metadata points to the GitHub Pages project URL; if a custom domain is added later, those URLs should be updated
- The site works offline for local content, but intentional external links naturally require network access

## Manual tests to run next

1. Open the site locally with `python3 -m http.server 8080`
2. Open the same site from a `file://` URL and verify the project grid still loads
3. Open several project modals and verify:
   - close button works
   - Escape closes the modal
   - focus returns to the triggering project card
   - multi-image galleries switch images correctly
4. Check desktop and mobile layouts
5. Disconnect the network and verify local pages, styles, scripts, and images still work
6. Reconnect the network and click through all intentional external links

## Notes for future chats

- Keep the codebase simple: plain HTML, CSS, and vanilla JavaScript
- Prefer updating `data/projects.js` and local assets over adding abstractions
- Keep this file updated after meaningful migration or deployment work so future sessions do not need the full prior conversation

# Project Status

## Completed in this pass

- Confirmed that project content now lives in `data/projects.js`
- Confirmed that `script.js` now contains UI behavior only
- Confirmed that all project media referenced by project data is local
- Confirmed that 25 localized project image files are present under `assets/projects/`
- Confirmed that no runtime `freight.cargo.site` URLs remain in `index.html`, `script.js`, or `data/projects.js`
- Confirmed that `index.html` no longer contains remote image URLs
- Removed the last on-page Cargo mention from `index.html`
- Updated `README.md` with clearer local preview, offline behavior, deployment, and handoff notes
- Updated repo references to the current repository and GitHub Pages path
- Added this status file for future handoff
- Completed a final local verification pass on `2026-05-14`
- Verified the site loads from `http://127.0.0.1:8080/`
- Verified the site loads correctly from a project-site rehearsal path at `/myportfolio/`
- Verified all filters, all project modals, gallery buttons, and Escape-close behavior

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

- Verify the live deployed GitHub Pages site after Pages finishes updating
- Manually review all external project links in a normal browser session
- Do one visual polish pass on mobile and desktop after the deployed site is live

## Known issues

- Some external sites such as LinkedIn, Aalto, and OpenProcessing may block automated link checks, so browser-based manual verification is still useful
- Social preview metadata points to the GitHub Pages project URL; if a custom domain is added later, those URLs should be updated
- The site works offline for local content, but intentional external links naturally require network access

## Manual tests to run next

1. Open the live GitHub Pages deployment at `/myportfolio/`
2. Click through all intentional external links in a normal browser session
3. Check desktop and mobile layouts on the deployed site
4. Optionally disconnect the network and verify local pages, styles, scripts, and images still work from a local preview

## Notes for future chats

- Keep the codebase simple: plain HTML, CSS, and vanilla JavaScript
- Prefer updating `data/projects.js` and local assets over adding abstractions
- Keep this file updated after meaningful migration or deployment work so future sessions do not need the full prior conversation

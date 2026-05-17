# Project Status

## Latest update

Date: 2026-05-17

- Replaced the header face with a monospace `:-]` that matches the current shell scale
- Normalized every `project.categories` entry to the live UI filters only:
  `teaching`, `research`, `youth work`, `exhibitions`, `web / tools`, and `AV`
- Removed the old category mapping layer because the project data now matches the visible filters directly
- Removed years from project cards while keeping years in the project modal
- Centered thumbnail cropping with `object-fit: cover` and `object-position: center center`
- Added optional per-project thumbnail positions for projects that needed a better crop
- Updated footer links to the Aalto email address, GitHub, and the new lecturer page
- Kept the header and footer on the same shared shell text size: `14px` desktop and `13px` mobile
- Cleaned stale references in docs where they no longer matched the current site

## Files changed in the latest update

- `index.html`
- `styles.css`
- `data/projects.js`
- `script.js`
- `README.md`
- `PROJECT_STATUS.md`

## Current structure

- `index.html`: compact portfolio structure, Cargo-style header/footer shell, and modal markup
- `styles.css`: minimal portfolio styling, shell typography, and thumbnail cropping rules
- `script.js`: project rendering, direct filter matching, and modal behavior
- `data/projects.js`: project data, local image paths, filter-aligned categories, and optional thumbnail positioning
- `assets/projects/`: local project images

## Current state

- Project media is local
- No runtime `freight.cargo.site` URLs remain
- `script.js` contains UI behavior only
- The live GitHub Pages metadata points at the correct absolute image URL
- The site shell now follows the old Cargo reference more closely at the top and bottom
- The project grid and modal behavior remain unchanged
- The visible filters are simplified and the underlying project categories now use the same vocabulary
- The footer block is now more compact and less visually heavy
- Footer links now point to the current Aalto email, GitHub profile, and lecturer page
- Project card years are removed and thumbnail positioning can now be tuned per project

## Remaining tasks

- Check the deployed GitHub Pages site after it updates
- Click through intentional external links in a normal browser session
- Fine-tune thumbnail positions only if any important subject is still cropped awkwardly

## Known issues

- Some external sites may block automated checks, so manual click-through is still worth doing
- If a custom domain is added later, canonical and social metadata URLs should be updated again
- README and project status intentionally still mention the Cargo migration as historical context
- During local preview, a browser session may cache older module output; hard refresh if filters or card content look stale

## Manual tests to run next

1. Open the live GitHub Pages deployment at `/myportfolio/`
2. Check the header face, header/footer type scale, and footer density on desktop and mobile
3. Check the first-row thumbnail crops, especially `Cooler Planet 2024` and `Flying Duets`
4. Click through external links
5. Open several project modals and confirm images, text, and close behavior feel right

## Notes for future chats

- Keep the site compact and direct
- Avoid reintroducing filler copy or decorative UI systems
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep this file updated after meaningful design or deployment work

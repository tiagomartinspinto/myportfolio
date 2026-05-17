# Project Status

## Latest update

Date: 2026-05-17

- Tightened the footer/about block so it reads closer to the Cargo reference: smaller monospace text, less padding, lower line-height, and quieter spacing
- Changed the About copy ending to "in art education."
- Reordered the simplified project filters to: All, Teaching, Research, Youth work, Exhibitions, Web / tools, AV
- Balanced the header and footer shell typography onto the same text size for a more even overall rhythm
- Simplified the project filters to a smaller display set: All, Teaching, Research, Youth work, Exhibitions, Web / tools, and AV
- Removed the visible "Work" heading so the project grid starts more quietly
- Kept the full project metadata intact and added a simple display-filter mapping layer instead of deleting category detail
- Reworked the header to match the old Cargo site reference more closely
- Replaced the generic lower notes section with a three-column Cargo-style footer/about block
- Kept the project grid, filters, and modal behavior unchanged
- Tightened the global content width so the shell feels more centered and deliberate
- Kept the implementation flat and simple in `index.html` and `styles.css`

## Files changed in the latest update

- `index.html`
- `styles.css`
- `data/projects.js`
- `script.js`
- `PROJECT_STATUS.md`

## Current structure

- `index.html`: compact portfolio structure, Cargo-style header/footer shell, and modal markup
- `styles.css`: minimal portfolio styling and header/footer layout
- `script.js`: simple display-filter mapping, project rendering, modal behavior
- `data/projects.js`: project data, local image paths, and compact UI filter definitions
- `assets/projects/`: local project images

## Current state

- Project media is local
- No runtime `freight.cargo.site` URLs remain
- `script.js` contains UI behavior only
- The live GitHub Pages metadata points at the correct absolute image URL
- The site shell now follows the old Cargo reference more closely at the top and bottom
- The project grid and modal behavior remain unchanged
- The visible filters are now simplified without deleting underlying category metadata
- The footer block is now more compact and less visually heavy

## Remaining tasks

- Check the deployed GitHub Pages site after it updates
- Click through intentional external links in a normal browser session
- Fine-tune spacing only if the live page still feels too open or too tight

## Known issues

- Some external sites may block automated checks, so manual click-through is still worth doing
- If a custom domain is added later, canonical and social metadata URLs should be updated again

## Manual tests to run next

1. Open the live GitHub Pages deployment at `/myportfolio/`
2. Check the header and footer alignment on desktop and mobile
3. Click through external links
4. Open several project modals and confirm images, text, and close behavior feel right

## Notes for future chats

- Keep the site compact and direct
- Avoid reintroducing filler copy or decorative UI systems
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep this file updated after meaningful design or deployment work

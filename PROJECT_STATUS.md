# Project Status

## Latest update

Date: 2026-05-17

- Moved `Art-tech Educator` into the browser/page title alongside the name
- Changed the header right-side action from `Contact` to the `Message me!` mail link
- Removed the duplicated `Art-tech Educator` label and `Message me!` link from the footer
- Removed the unused footer kicker styling after the footer text cleanup
- Reworked the portfolio categories around actual project content instead of older technical labels
- The visible filters are now:
  `All`, `Learning`, `Community`, `Research`, `Exhibitions`, `Web`, and `Moving image`
- Updated every `project.categories` entry in `data/projects.js` to match that filter vocabulary directly
- Kept `tags`, `projectType`, `role`, thumbnail positions, and modal behavior unchanged
- Updated `script.js` filter labels to match the new content-based categories
- Updated README category documentation to match the new vocabulary

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
- `data/projects.js`: project data, local image paths, content-based categories, and optional thumbnail positioning
- `assets/projects/`: local project images

## Current state

- Project media is local
- No runtime `freight.cargo.site` URLs remain
- `script.js` contains UI behavior only
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
- Click through intentional external links in a normal browser session
- Fine-tune thumbnail positions only if any important subject is still cropped awkwardly
- Do one normal-browser click-through on the two updated external project links
- Sanity-check the new category groupings on the live site and see if any project feels misfiled

## Known issues

- Some external sites may block automated checks, so manual click-through is still worth doing
- If a custom domain is added later, canonical and social metadata URLs should be updated again
- README and project status intentionally still mention the Cargo migration as historical context
- During local preview, a browser session may cache older module output; hard refresh if filters or card content look stale

## Manual tests to run next

1. Open the live GitHub Pages deployment at `/myportfolio/`
2. Click through each filter and confirm the new groupings feel right editorially
3. Check the header face, header/footer type scale, and footer density on desktop and mobile
4. Check the first-row thumbnail crops, especially `Cooler Planet 2024` and `Flying Duets`
5. Click through external links
6. Open several project modals and confirm images, text, and close behavior feel right

## Notes for future chats

- Keep the site compact and direct
- Avoid reintroducing filler copy or decorative UI systems
- Prefer editing `data/projects.js` for content changes and `styles.css` for layout changes
- Keep this file updated after meaningful design or deployment work

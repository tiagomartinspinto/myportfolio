# Tiago Martins Pinto Portfolio

Compact GitHub Pages portfolio for `https://tiagomartinspinto.github.io/myportfolio/`.

This site has been fully migrated away from Cargo Collective. Project content now lives in local data files and all project media is stored inside the repository.

## Stack

- HTML
- CSS
- vanilla JavaScript
- tiny local Node server for the editor
- no backend
- no build step
- no analytics or tracking

## Project structure

```text
index.html
styles.css
script.js
data/projects.js
assets/favicon.ico
assets/projects/[project-slug]/
package.json
_config.yml
PROJECT_STATUS.md
tools/admin/
```

## Project data

Project content lives in:

```text
data/projects.js
```

Each project record includes:

- `title`
- `year`
- `projectType`
- `role`
- `categories`
- `tags`
- `shortDescription`
- `fullDescription`
- `images`
- `links`
- optional `thumbnailPosition`
- optional `thumbnailZoom`

The current allowed `categories` values are:

- `learning`
- `community`
- `research`
- `exhibitions`
- `web`
- `moving image`

## Local admin editor

There is a local-only editor in:

```text
tools/admin/
```

Important:

- it is local only
- it binds only to `127.0.0.1`
- it is not deployed as a public CMS
- it does not use GitHub tokens, passwords, or external APIs
- it writes only `data/projects.js`
- it also maintains `data/projects.backup.js` for recovery
- it publishes only through local git

Run the editor:

```bash
npm run admin
```

Then open:

```text
http://127.0.0.1:8787/
```

The editor can:

- load existing projects from `data/projects.js`
- edit existing projects in a form
- create new projects
- duplicate existing projects
- reorder projects
- organize editing into Projects, Content, Images, Preview, and Publish / Safety tabs
- preview image paths and thumbnail cropping
- adjust thumbnail crop position and zoom without modifying original image files
- browse local images under `assets/projects/`
- detect image dimensions from local files
- run image diagnostics for missing, unused, or incomplete image metadata
- download a generated cropped-thumbnail preview as a new PNG file
- switch between dark and light editor themes
- save changes locally
- publish changes with local git

The editor theme preference is stored only in `localStorage`. Project data is never stored in `localStorage`.

### Save locally

`Save locally` rewrites:

```text
data/projects.js
```

Before writing, it refreshes:

```text
data/projects.backup.js
```

It does not write HTML, CSS, JS, image files, or any other repo file.

### Undo and restore

- `Undo last save` restores `data/projects.backup.js` over `data/projects.js`
- `Restore backup` does the same thing deliberately if you want to recover the last saved version again

The backup file is local-only and ignored by git.

### Publish

`Publish` runs the local git workflow:

```bash
git add data/projects.js PROJECT_STATUS.md
git commit -m "Update portfolio projects"
git push
```

The admin shows the git output or error directly in the UI.

Before publishing, the editor shows:

- project totals
- added projects
- modified projects
- deleted projects

If the portfolio would become empty:

- `Save locally` requires typing `DELETE ALL PROJECTS`
- `Publish` requires typing `PUBLISH EMPTY PORTFOLIO`

The publish button also asks for a final confirmation before running git.

Cloning this repo does not give anyone permission to publish. Publish only works on computers where Git is authenticated with write access to this repository.

## Where images live

All project images are local and grouped by project:

```text
assets/projects/kuperkeikka/
assets/projects/cooler-planet-2024/
assets/projects/sattuma-com/
...
```

Each `images` entry in `data/projects.js` points to one of these local files. The site does not require remote image hosting for project media.

## Image workflow

1. Add image files manually into:

```text
assets/projects/[slug]/
```

2. Open the local editor and select or create the project
3. Use the image browser in the editor to pick a file from `assets/projects/`
4. Use `Detect dimensions` to fill width and height
5. Add or refine alt text
6. Open the Images tab and adjust the non-destructive crop controls:
   - `thumbnailPosition` stores the visual pan position
   - `thumbnailZoom` stores the simulated thumbnail zoom
   - presets cover center, top, bottom, left, right, and a manual subject-center starting point
7. Save locally
8. Preview the public site
9. Publish when ready

The public project grid reads `thumbnailPosition` and `thumbnailZoom` when rendering the first project image as the project thumbnail.

The Images tab can also draw the current crop onto a canvas and download it as a new PNG file. This is export-only: it does not overwrite, delete, upload, or automatically place image files in `assets/projects/[slug]/`.

## Local preview

Run:

```bash
npm run preview
```

Then open:

```text
http://127.0.0.1:8080/
```

The preview server blocks `tools/admin/`, so it stays closer to the public GitHub Pages output.

You can still open `index.html` directly for a quick check, but the local preview server is the safer choice for normal testing.

## Offline behavior

The site is designed to work offline once the files are present locally:

- layout, styles, JavaScript, and project images are all local
- there is no runtime fetch from Cargo
- the local admin does not need the network for save operations
- the only network-dependent destinations are intentional external links such as project URLs, Aalto pages, LinkedIn, GitHub, and mail links
- Open Graph and canonical URLs point to the public GitHub Pages address, but they do not block offline browsing

## GitHub Pages deployment

This repository is intended to deploy directly from the `main` branch of:

```text
https://github.com/tiagomartinspinto/myportfolio.git
```

GitHub Pages publishes the site at:

```text
https://tiagomartinspinto.github.io/myportfolio/
```

No build pipeline is required. Pushing committed static files to `main` is enough.

The local admin editor under `tools/admin/` is excluded from GitHub Pages publishing via `_config.yml`, so it stays a local maintenance tool instead of part of the public site.

If you later attach a custom domain, update the canonical and Open Graph URLs in `index.html` to match it.

## Status handoff

The current migration state is tracked in:

```text
PROJECT_STATUS.md
```

Update that file whenever substantial migration, content, or deployment work is completed. It is meant to keep future editing sessions lightweight and easy to continue.

## Migration note

The original portfolio content came from the Cargo Collective site at:

```text
https://www.tiagomartinspinto.com
```

This repository now stores:

- project text locally
- project images locally
- favicon locally

The site no longer depends on Cargo media hosting at runtime.

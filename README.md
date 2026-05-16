# Tiago Martins Pinto Portfolio

Compact GitHub Pages portfolio for `https://tiagomartinspinto.github.io/myportfolio/`.

This site has been fully migrated away from Cargo Collective. Project content now lives in local data files and all project media is stored inside the repository.

## Stack

- HTML
- CSS
- vanilla JavaScript
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
PROJECT_STATUS.md
```

## Adding or editing projects

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

To edit a project:

1. Open `data/projects.js`
2. Find the project by `slug`
3. Update the text, categories, links, or image metadata

To add a new project:

1. Create a new folder in `assets/projects/` using the project slug
2. Place the project's local images in that folder
3. Add a new object to `PROJECTS` in `data/projects.js`
4. Fill in the text fields, categories, and external links
5. Add one or more `images` entries with:
   - `src`
   - `alt`
   - `width`
   - `height`

## Where images live

All project images are local and grouped by project:

```text
assets/projects/kuperkeikka/
assets/projects/cooler-planet-2024/
assets/projects/sattuma-com/
...
```

Each `images` entry in `data/projects.js` points to one of these local files. The site does not require remote image hosting for project media.

## Local preview

You can open `index.html` directly, but using a small local server is recommended:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

A local server is still the safer choice when checking module loading and GitHub Pages behavior. A `file://` check can still be useful for a quick visual review in browsers that allow local module loading.

## Offline behavior

The site is designed to work offline once the files are present locally:

- layout, styles, JavaScript, and project images are all local
- there is no runtime fetch from Cargo
- the only network-dependent destinations are intentional external links such as project URLs, Aalto pages, LinkedIn, Codeberg, and mail links
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

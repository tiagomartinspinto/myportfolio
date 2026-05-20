# Tiago Martins Pinto Portfolio

Compact GitHub Pages portfolio for:

```text
https://tiagomartinspinto.github.io/myportfolio/
```

The site presents an artistic-research practice across art, technology, education, creative coding, exhibitions, participatory work, and media systems. Project content lives in local data files and project media lives in the repository.

## Stack

- HTML
- CSS
- vanilla JavaScript
- local Node server for the editor
- no backend
- no build step
- no analytics or tracking

## Project Structure

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

## Project Data

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
- `media`
- `links`
- optional `thumbnailPosition`
- optional `thumbnailZoom`

Allowed `categories` values:

- `learning`
- `community`
- `research`
- `exhibitions`
- `web`
- `moving image`

### Mixed Media

The public gallery and local editor support mixed project media:

```js
media: [
  {
    type: "image",
    src: "assets/projects/example/example-01.jpg",
    alt: "Image description",
    width: 1600,
    height: 1067,
    caption: "Optional caption."
  },
  {
    type: "video",
    provider: "youtube",
    source: "https://youtu.be/example",
    caption: "Optional caption.",
    thumbnail: "assets/projects/example/example-01.jpg"
  },
  {
    type: "audio",
    provider: "file",
    source: "assets/projects/example/example-audio.mp3",
    caption: "Optional caption."
  }
]
```

Images should stay local under `assets/projects/[slug]/`. Video supports YouTube, Vimeo, direct video URLs, and local video files. Audio supports local files, SoundCloud, and direct audio URLs.

Older `images` arrays are still accepted by the local editor as a compatibility fallback, but new project data should use `media`.

## Local Admin Editor

The local-only editor lives in:

```text
tools/admin/
```

Run it with:

```bash
npm run admin
```

Then open:

```text
http://127.0.0.1:8787/
```

The public footer includes a nearly hidden `::` launcher at the bottom-right of the footer. It points only to `http://127.0.0.1:8787/`, works only when the local admin server is running, and does not expose a public admin.

The editor is organized into tabs:

- Projects
- Content
- Images
- Preview
- Publish / Safety

The sticky action bar keeps Save locally, Preview site, Publish, Reload, Undo save, and the theme toggle available without showing every tool at once.

The editor can:

- load and edit `data/projects.js`
- create, duplicate, delete, and reorder projects
- add image, video, and audio media entries
- reorder media and set a media item first
- preview mixed media metadata in the editor
- browse local images under `assets/projects/`
- detect local image dimensions, including SVG viewBox dimensions
- edit non-destructive thumbnail crop metadata
- run diagnostics for image paths and metadata
- download a generated cropped-thumbnail PNG without saving it into the repo
- switch between dark and light editor themes
- save locally and publish through local git

The editor theme preference is stored only in `localStorage`. Project data is never stored in `localStorage`.

## Thumbnail Crop Metadata

The public project grid reads:

```js
thumbnailPosition
thumbnailZoom
```

These settings control how the first image media item is framed as a square thumbnail. They are metadata only; the original image file is not overwritten.

The Images tab includes:

- large preview
- square thumbnail preview
- pan X / pan Y controls
- zoom control
- center, top, bottom, left, right, and subject-center presets
- canvas export preview
- Download cropped thumbnail

The download tool is export-only. It creates a new PNG download and does not write into `assets/projects/[slug]/`, overwrite existing files, delete files, upload files, or auto-save generated thumbnails.

## Save, Backup, And Publish

`Save locally` rewrites:

```text
data/projects.js
```

Before writing, it refreshes:

```text
data/projects.backup.js
```

The backup file is ignored by git.

`Undo last save` and `Restore backup` restore `data/projects.backup.js` over `data/projects.js`.

`Publish` runs local git commands:

```bash
git add data/projects.js PROJECT_STATUS.md
git commit -m "Update portfolio projects"
git push
```

Before publishing, the editor shows a summary of added, modified, and deleted projects. Empty portfolio saves and publishes require explicit typed confirmations.

Cloning this repo does not give anyone permission to publish. Publish only works on computers where Git is authenticated with write access to this repository.

## Public / Read-Only Hardening

The editor shows a visible local-only banner:

```text
LOCAL EDITOR ONLY
Changes require local git access and repository write permissions.
```

If the editor is opened from a public/static site, it enters public read-only mode:

- in-memory editing is allowed
- previewing and copying/downloading generated project data is allowed
- Save locally is blocked
- Publish is blocked
- backup restore is blocked
- image scanning is blocked
- dimension detection is blocked
- filesystem access is blocked
- the UI shows `Publishing disabled on public site`

Write actions are enabled only on localhost, or with explicit developer mode via `?admin-dev=1` for controlled local testing. Publish still requires a compatible local API, git authentication, and repository write access.

## Local Preview

Run:

```bash
npm run preview
```

Then open:

```text
http://127.0.0.1:8080/
```

The preview server blocks `tools/admin/`, so it stays close to the public GitHub Pages output.

## GitHub Pages Deployment

This repository deploys directly from the `main` branch of:

```text
https://github.com/tiagomartinspinto/myportfolio.git
```

GitHub Pages publishes the site at:

```text
https://tiagomartinspinto.github.io/myportfolio/
```

No build pipeline is required. Pushing committed static files to `main` is enough.

The local admin editor under `tools/admin/` is excluded from GitHub Pages publishing via `_config.yml`.

## Status Handoff

The current state is tracked in:

```text
PROJECT_STATUS.md
```

Update that file whenever substantial content, design, admin, or deployment work is completed.

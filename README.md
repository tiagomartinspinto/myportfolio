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
data/site.js
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
{
  type: "image",
  src: "assets/projects/project-name/image.jpg",
  alt: "Description of image",
  width: 1600,
  height: 1000,
  caption: "Optional caption"
}
```

```js
{
  type: "video",
  provider: "youtube",
  source: "https://www.youtube.com/watch?v=VIDEO_ID",
  thumbnail: "assets/projects/project-name/video-thumb.jpg",
  caption: "Performance documentation excerpt"
}
```

```js
{
  type: "video",
  provider: "vimeo",
  source: "https://vimeo.com/123456789",
  thumbnail: "assets/projects/project-name/video-thumb.jpg",
  caption: "Full documentation"
}
```

```js
{
  type: "video",
  provider: "file",
  source: "assets/projects/project-name/video.mp4",
  thumbnail: "assets/projects/project-name/video-thumb.jpg",
  caption: "Local video excerpt"
}
```

```js
{
  type: "audio",
  provider: "soundcloud",
  source: "https://soundcloud.com/...",
  caption: "Sound work"
}
```

```js
{
  type: "audio",
  provider: "file",
  source: "assets/projects/project-name/audio.mp3",
  caption: "Audio excerpt"
}
```

Images should stay local under `assets/projects/[slug]/`. Use YouTube or Vimeo for larger video files when possible, and local files for small or archival media. Keep repository size reasonable.

Video and audio thumbnails are never borrowed from another project image or nearby gallery image. Video thumbnails can come only from the media item's own `thumbnail` field, or from the video's own YouTube ID when `provider: "youtube"` has no explicit thumbnail. Vimeo, local-file, and direct-URL videos do not get guessed thumbnails; without an explicit thumbnail they show a neutral `video` placeholder. Audio without an explicit thumbnail shows a neutral `audio` placeholder.

Gallery thumbnails may crop for compact browsing. In the project modal, selected image media is shown inside a stable contained frame, and clicking the feature image or its small expand control opens a minimal full-image view. The full view is uncropped and closes with Esc, the close button, or a backdrop click.

Older `images` arrays are still accepted by the local editor as a compatibility fallback, but new project data should use `media`.

Draft projects can stay in `data/projects.js` with `draft: true`. They remain visible in the local editor, but the public portfolio hides them and public filters ignore them.

## Site Data

Site-wide text and links live in:

```text
data/site.js
```

This file stores document metadata, social preview metadata, header text, contact email, footer links, about text, location text, and Aalto role links. Layout structure, CSS, modal behavior, and project-grid behavior remain code-only.

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
- Site
- Content
- Images
- Preview
- Publish / Safety

The sticky action bar keeps Save locally, Save + Preview, Preview site, Publish, Reload, Undo save, and the theme toggle available without showing every tool at once. Save + Preview applies the current form state, saves local data, then opens or refreshes `http://127.0.0.1:8080/`.

The editor can:

- load and edit `data/projects.js`
- load and edit `data/site.js`
- create, duplicate, delete, and reorder projects
- move the selected project up, down, or to the top
- mark projects as drafts
- add image, video, and audio media entries
- reorder media and set a media item first
- preview mixed media metadata in the editor with small image / YouTube / Vimeo / local video / SoundCloud / audio / URL badges
- browse local images under `assets/projects/`
- detect local image dimensions, including SVG viewBox dimensions
- edit non-destructive thumbnail crop metadata
- run diagnostics for image paths and metadata
- run `npm run check` from the Publish / Safety tab without committing or pushing
- download a generated cropped-thumbnail PNG without saving it into the repo
- switch between dark and light editor themes
- save locally and publish through local git

The editor warns before switching projects, reloading, closing the browser tab, or publishing when the current form, project list, or site text has unapplied or unsaved changes.

The Site tab edits only text and links. It does not allow scripts or arbitrary HTML.

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
data/site.js
```

Before writing, it refreshes:

```text
data/projects.backup.js
data/site.backup.js
```

Backup files are ignored by git.

`Undo last save` and `Restore backup` restore available backup files over the live project and site data.

`Publish` runs local git commands:

```bash
npm run check
git add data/projects.js data/site.js PROJECT_STATUS.md assets/projects/ README.md tools/admin/README.md
git commit -m "Update portfolio"
git push
```

Before publishing, the editor shows a summary of added, modified, and deleted projects. It runs `npm run check` before staging. If the check fails, nothing is committed or pushed. Empty portfolio saves and publishes require explicit typed confirmations.

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

## Validation

Run:

```bash
npm run check
```

The check validates project structure, approved filters, draft handling, media paths, local asset existence, link formats, site metadata, social preview image, contact email, and footer links. It exits with code `1` on failure and code `0` on success.

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

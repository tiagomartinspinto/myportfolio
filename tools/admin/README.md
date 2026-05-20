# Local Portfolio Editor

This editor is local only. It is not a public CMS and it is excluded from GitHub Pages.

## Start

From the repository root:

```bash
npm run admin
```

Open:

```text
http://127.0.0.1:8787/
```

## Preview

In another terminal:

```bash
npm run preview
```

Open:

```text
http://127.0.0.1:8080/
```

The preview server blocks `tools/admin/`.

## Public / Read-Only Mode

The editor shows:

```text
LOCAL EDITOR ONLY
Changes require local git access and repository write permissions.
```

Cloning or opening this editor does not grant publishing access.

If the editor is opened from a public/static site:

- in-memory editing is allowed
- previewing and copying/downloading generated project data is allowed
- Save locally is blocked
- Publish is blocked
- backup restore is blocked
- image scanning is blocked
- dimension detection is blocked
- local API and filesystem access are blocked
- the UI shows `Publishing disabled on public site`

Write actions require localhost, or explicit developer mode with `?admin-dev=1` for controlled local testing.

## Tabs

The editor is organized into:

- Projects
- Content
- Images
- Preview
- Publish / Safety

The sticky action bar provides Save locally, Preview site, Publish, Reload, Undo save, and the dark/light theme toggle.

## Mixed Media

The Images tab edits the project `media` array. It can add:

- image
- video
- audio

Fields include:

- type
- provider
- source
- alt text for images
- caption
- thumbnail
- width and height for images

Video providers:

- YouTube
- Vimeo
- local file
- direct URL

Audio providers:

- local file
- SoundCloud
- direct URL

Media order is editable. The first image media item is used for the public grid thumbnail.

## Thumbnail Cropping

Thumbnail editing is non-destructive metadata editing.

The editor stores:

```js
thumbnailPosition
thumbnailZoom
```

It provides:

- large preview
- square crop preview
- pan X / pan Y controls
- zoom control
- crop presets
- canvas export preview
- Download cropped thumbnail

The download tool creates a new PNG download only. It does not overwrite, delete, upload, or auto-save image files.

## Save And Restore

`Save locally` writes:

```text
data/projects.js
```

Before writing, it refreshes:

```text
data/projects.backup.js
```

`Undo last save` and `Restore backup` copy the backup over `data/projects.js`.

The backup file is local-only and ignored by git.

## Publish

`Publish` runs:

```bash
git add data/projects.js PROJECT_STATUS.md
git commit -m "Update portfolio projects"
git push
```

The editor shows the git output directly in the UI and asks for confirmation before publishing.

Publish only works on computers where git is authenticated with write access to this repository.

## Safety

- localhost only
- no passwords
- no tokens
- no remote services
- no analytics
- no arbitrary file writes
- no destructive image editing by default

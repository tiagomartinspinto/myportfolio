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

## Check

Run:

```bash
npm run check
```

The check validates project data, site data, approved filters, media paths, local asset existence, links, and draft handling. Publish runs this automatically before committing.

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
- Site
- Content
- Images
- Preview
- Publish / Safety

The sticky action bar provides Save locally, Preview site, Publish, Reload, Undo save, and the dark/light theme toggle.

## Site Content

The Site tab edits `data/site.js`:

- document title
- meta description
- Open Graph title and description
- social preview image and alt text
- canonical URL
- header name, mark, contact label, and contact email
- footer social links
- about title and text lines
- location text
- footer role links

It accepts text and links only. Layout, CSS, public rendering behavior, and modal behavior remain code-only.

## Draft Projects

Check `Draft project` in the Project basics panel to keep a project in `data/projects.js` without showing it publicly.

Drafts:

- are visible in this local editor
- can be saved and published
- are hidden from the public project grid
- are ignored by public filters
- may temporarily miss media while being prepared

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
- thumbnail / poster image
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

Media order is editable. The first media item controls the public grid thumbnail. Images use their own image source. Video and audio items never borrow another image from the same project.

Video thumbnails can come only from:

- the media item's own explicit `thumbnail` value
- the video's own YouTube ID when `provider: "youtube"` has no explicit thumbnail

Vimeo, local-file, and direct-URL videos do not get guessed thumbnails. Without an explicit thumbnail they show a neutral `video` placeholder. Audio without an explicit thumbnail shows a neutral `audio` placeholder.

Examples:

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

Use YouTube or Vimeo for larger video files when possible. Use local files for small or archival media. Keep repository size reasonable. Video and audio media without thumbnails still appear in the public grid or modal gallery with either a YouTube-derived thumbnail or a neutral `video` / `audio` placeholder, and no thumbnails are auto-generated.

The media row field labelled `Thumbnail / poster image` is optional. It is used only for that specific video/audio item and local-file video posters. Leave it empty for a neutral placeholder, or for YouTube videos to use a thumbnail from the video itself. It is never filled automatically.

Gallery thumbnails may crop. The project modal feature image uses a stable contained frame, and image media can be opened in a minimal full-image view from the public site. The larger view is uncropped and can be closed with Esc, the close button, or a backdrop click.

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
data/site.js
```

Before writing, it refreshes:

```text
data/projects.backup.js
data/site.backup.js
```

`Undo last save` and `Restore backup` copy available backups over the live project and site data files.

The backup file is local-only and ignored by git.

## Publish

`Publish` runs:

```bash
npm run check
git add data/projects.js data/site.js PROJECT_STATUS.md assets/projects/ README.md tools/admin/README.md
git commit -m "Update portfolio"
git push
```

The editor runs the check before staging. If the check fails, it blocks commit and push and shows the check output in the Git output panel.

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

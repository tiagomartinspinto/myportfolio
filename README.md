# Tiago Martins Pinto Portfolio

Compact GitHub Pages portfolio for:

```text
https://www.tiagomartinspinto.com/
```

The site presents an artistic-research practice across art, technology, education, creative coding, exhibitions, participatory work, and media systems. Project content lives in local data files and project media lives in the repository.

## Stack

- HTML
- CSS
- vanilla JavaScript
- no backend
- no build step
- no analytics or tracking

## Project Structure

```text
index.html
styles.css
script.js
background.js
data/projects.js
data/site.js
assets/favicon.ico
assets/projects/[project-slug]/
_config.yml
PROJECT_STATUS.md
```

## Working On The Site

Edit `data/projects.js` and `data/site.js` directly in a text editor, add any new media under `assets/projects/[slug]/`, then commit and push to `main`. There is no local server or build step required.

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

The public gallery supports mixed project media:

```js
{
  type: "image",
  src: "assets/projects/project-name/image.jpg",
  thumbnail: "assets/projects/project-name/image-thumb.jpg",
  alt: "Description of image",
  width: 1600,
  height: 1000,
  caption: "Optional caption"
}
```

For an image, `thumbnail` is optional and points at a smaller, same-aspect-ratio version used only for the grid and gallery thumbnails. The full `src` is still used in the project modal and the lightbox. `width` and `height` describe the full `src`. The first media item of each project carries a downscaled `*-thumb.jpg` (max 640px on the long edge) so the grid stays light; these can be generated with the built-in `sips` tool and add no dependencies.

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

Draft projects can stay in `data/projects.js` with `draft: true`. They remain in the file but the public portfolio hides them and public filters ignore them.

### Thumbnail Crop Metadata

The public project grid reads:

```js
thumbnailPosition
thumbnailZoom
```

on a project's first image media item. These settings control how that image is framed as a square grid thumbnail. They are metadata only; the original image file is untouched.

## Site Data

Site-wide text and links live in:

```text
data/site.js
```

This file stores document metadata, social preview metadata, header text, contact email, footer links, about text, location text, and Aalto role links. Layout structure, CSS, modal behavior, and project-grid behavior remain code-only.

## GitHub Pages Deployment

This repository deploys directly from the `main` branch of:

```text
https://github.com/tiagomartinspinto/myportfolio.git
```

GitHub Pages serves the site at the custom domain set in `CNAME`:

```text
https://www.tiagomartinspinto.com/
```

The default `https://tiagomartinspinto.github.io/myportfolio/` address redirects to the custom domain. No build pipeline is required. Pushing committed static files to `main` is enough.

## Status Handoff

`PROJECT_STATUS.md` tracks current state and next tests. Update it whenever substantial content, design, or deployment work is completed.

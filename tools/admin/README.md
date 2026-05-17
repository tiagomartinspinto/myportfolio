# Local Portfolio Editor

This editor is local only.

It is not a public CMS and it is not deployed on GitHub Pages.

## Start the editor

From the repository root:

```bash
npm run admin
```

Then open:

```text
http://127.0.0.1:8787/
```

## Preview the public site locally

In another terminal:

```bash
npm run preview
```

Then open:

```text
http://127.0.0.1:8080/
```

The preview server blocks `tools/admin/` so it behaves more like the public GitHub Pages site.

## What the editor does

- loads existing projects from `data/projects.js`
- lets you edit existing projects
- lets you create new projects
- lets you reorder projects
- previews each image entry with the same square crop logic used by the public thumbnails
- browses local images inside `assets/projects/`
- detects width and height from local image files
- runs image diagnostics for missing files, unused files, invalid paths, missing alt text, and missing metadata
- saves changes locally back into `data/projects.js`
- can publish `data/projects.js` and `PROJECT_STATUS.md` using local git

## Save locally

`Save locally` writes the current working project list into:

```text
data/projects.js
```

Before writing, it overwrites:

```text
data/projects.backup.js
```

No other content file is modified by the editor.

## Undo and restore

- `Undo last save` restores `data/projects.backup.js` over `data/projects.js`
- `Restore backup` performs the same recovery step on purpose when you want to return to the latest backup again

The backup file is local-only and ignored by git.

## Publish

`Publish` runs local git commands from this repository:

```bash
git add data/projects.js PROJECT_STATUS.md
git commit -m "Update portfolio projects"
git push
```

The editor shows the git output directly in the UI.

Before publishing, the editor shows an added / modified / deleted summary and asks for a final confirmation.

If the portfolio would become empty:

- saving requires typing `DELETE ALL PROJECTS`
- publishing requires typing `PUBLISH EMPTY PORTFOLIO`

## Images

Image files are still manual.

Add them yourself under:

```text
assets/projects/[slug]/
```

Then:

1. use the image browser in the editor
2. select the image path
3. run `Detect dimensions`
4. add alt text
5. review the square preview
6. save locally

## Security note

- localhost only
- no passwords
- no tokens
- no GitHub API
- no external services
- no analytics
- no arbitrary file writes

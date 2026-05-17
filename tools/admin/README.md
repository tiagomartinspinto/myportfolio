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
- saves changes locally back into `data/projects.js`
- can publish `data/projects.js` and `PROJECT_STATUS.md` using local git

## Save locally

`Save locally` writes the current working project list into:

```text
data/projects.js
```

No other content file is modified by the editor.

## Publish

`Publish` runs local git commands from this repository:

```bash
git add data/projects.js PROJECT_STATUS.md
git commit -m "Update portfolio projects"
git push
```

The editor shows the git output directly in the UI.

## Images

Image files are still manual.

Add them yourself under:

```text
assets/projects/[slug]/
```

Then reference them in the editor form.

## Security note

- localhost only
- no passwords
- no tokens
- no GitHub API
- no external services
- no analytics
- no arbitrary file writes

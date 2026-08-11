# CLAUDE.md

## What this is

Tiago Martins Pinto's personal portfolio (art / education / research / creative technology).
Live at https://www.tiagomartinspinto.com. Deployed via GitHub Pages directly from `main`
(no build step, no GitHub Actions). It presents an artistic-research practice — do not
treat it as a generic template or demo project.

## Stack constraints (hard rules)

- Vanilla HTML/CSS/JavaScript only. No frameworks (React, Vue, Svelte, etc.) unless the
  user explicitly asks for one.
- No new dependencies, packages, or build tooling unless clearly necessary for the task
  at hand — and prefer to ask first. There is currently no `package.json`; keep it that way.
- No analytics, telemetry, or tracking scripts of any kind.
- No cloud CMS, backend, database, or server component. Content lives in `data/site.js`
  and `data/projects.js` and is edited directly.
- Do not recreate the removed local admin tool (`tools/admin/`) or `PROJECT_HISTORY.md`.
  These were deliberately deleted (see git history) — don't restore them just because
  they exist in past commits.

## Visual identity

Preserve the current restrained, dark, monospace/mono-accent aesthetic (see `styles.css`
and `background.js`). Don't introduce new colors, themes, animations, or layout patterns
without being asked. If a change could visibly alter the site's look or motion, call that
out before making it.

## Accessibility & motion

Preserve existing accessibility behavior: dialog focus trapping, `aria-live` status
regions, semantic markup, WCAG 2.2 touch-target sizing, and keyboard/Escape handling in
`project-dialog` and `image-lightbox`. Preserve `prefers-reduced-motion` handling in
`styles.css`, `script.js`, and `background.js` — any new animation or transition must
respect it.

## Content integrity

- Never invent or embellish project details, dates, roles, collaborators, or biographical/
  research facts. If information is missing, ask or leave a clear placeholder — don't fill
  gaps with plausible-sounding text.
- Don't rewrite or rephrase existing project copy (`shortDescription`, `fullDescription`,
  etc.) unless explicitly asked to edit that copy.

## How to work

- Prefer small, focused changes over broad rewrites. Don't refactor unrelated code while
  making a targeted fix or addition.
- After making changes, inspect `git diff` before considering the work done, to confirm
  only the intended lines changed.
- Never `git commit` or `git push` unless explicitly told to. `main` is the live deployment
  branch — pushing to it publishes immediately, with no build/review step in between.
- Keep `PROJECT_STATUS.md` concise and current — a short status/handoff note, not a full
  changelog or history. Update it after substantial content, design, or deployment work;
  don't let it grow into a log.

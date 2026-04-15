# Tiago Martins Pinto Portfolio

Static portfolio for `tiagomartinspinto.github.io`, migrated away from Cargo Collective.

## Local preview

Open `index.html` directly in a browser, or run a small local server:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy

This repository is intended for GitHub Pages. Push these files to the `main` branch of:

```text
https://github.com/tiagomartinspinto/tiagomartinspinto.github.io
```

GitHub Pages will publish it at:

```text
https://tiagomartinspinto.github.io
```

## Notes

Project content lives in `script.js`. The first migration still references the existing Cargo-hosted media URLs so the site works immediately. A next step is downloading those images into `assets/` and updating the paths so the portfolio is fully independent from Cargo's file hosting.

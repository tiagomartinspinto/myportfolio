# Pocket Manager ⚽

A pocket football-manager game inspired by the classic **Elifoot**, built to play
on an iPhone. Pure HTML/CSS/JS — no build step, no dependencies — and installable
to the iOS home screen as a full-screen offline app (PWA).

Live path: `/elifoot/` (e.g. `https://www.tiagomartinspinto.com/elifoot/`).

## How to play

1. Open `/elifoot/` in Safari on iPhone.
2. **Choose a club** (each has a star rating).
3. **Tactics** — pick a formation (4-4-2, 4-3-3, 3-5-2, 5-3-2, 4-5-1), a mentality
   (Defensive / Balanced / Attacking), and your starting XI.
4. **Market** — buy and sell players within your budget (squad must stay 14–24).
5. **Match** — play your fixture; tap to skip to full time. The rest of the round
   is simulated and the table updates.
6. Win gate receipts at home games, climb the **League** table, and lift the title.
   Then play on into the next season (players age and develop).

Progress saves automatically in `localStorage`.

### Add to Home Screen (iPhone)
Safari → Share → **Add to Home Screen**. It launches full-screen and works offline
via the service worker.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell + iOS/PWA meta tags |
| `game.css` | iPhone-first UI (safe-area aware, bottom tab bar) |
| `game.js` | Game engine + UI (squad, tactics, match sim, league, transfers, save) |
| `manifest.webmanifest` | PWA manifest for home-screen install |
| `sw.js` | Service worker for offline play |
| `icon.svg`, `icon-180.png`, `icon-512.png` | App icons |

## Match engine

Each side's attack/midfield/defence rating is derived from the selected XI
(skill × energy, formation and mentality modifiers, home advantage). Expected
goals feed a Poisson sampler; goal minutes and scorers are generated for live
commentary. The engine is unit-tested for fixture integrity and table
consistency.

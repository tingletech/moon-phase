# Moon Phase Repo

## Running
Open `index.html` in a browser. No build step, no dependencies.

## PWA Setup
- `manifest.json` — web app manifest for installability (display: standalone, dark theme)
- `sw.js` — service worker with cache-first strategy (v1, caches all local assets)
- `icon-192.png`, `icon-512.png` — app icons for home screen
- Register SW from `index.html` inline script; install banner fires on `beforeinstallprompt`

## Architecture
Three scripts loaded in order:
- `moon-phase.js` — lunar cycle calculation (Ben Daglish algorithms), returns 0–1 fraction through cycle
- `riset.js` — moonrise/moonrise/sunset times (Montenbruck & Pfleger)
- `zodiac.js` — zodiac sign lookup

Main page logic lives in `index.html` inline scripts (bottom of file): geolocation fetch → phase → rise/set → DOM update.

## Layout
CSS flexbox centers the moon SVG. Riseset panel is a bottom card with `safe-area-inset-*` for notched phones. Install banner is fixed-position, hidden until `beforeinstallprompt` fires.

## Gotchas
- Geolocation is optional — moon phase SVG always renders; rise/set panel hidden if location denied
- Months are 0-indexed in the inline script (`today.getMonth()+1`)
- Scripts depend on load order — moon-phase.js must load before riset.js (MJD function)
- Service worker uses cache-first; bump `CACHE_NAME` in `sw.js` to force refresh after code changes

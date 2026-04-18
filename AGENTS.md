# Moon Phase Repo

## Running
Open `index.html` in a browser. No build step, no dependencies.

## Architecture
Three scripts loaded in order:
- `moon-phase.js` — lunar cycle calculation (Ben Daglish algorithms), returns 0–1 fraction through cycle
- `riset.js` — moonrise/moonsunrise/sunset times (Montenbruck & Pfleger)
- `zodiac.js` — zodiac sign lookup

Main page logic lives in `index.html` inline scripts (bottom of file): geolocation fetch → phase → rise/set → DOM update.

## Gotchas
- Geolocation is optional — moon phase SVG always renders; rise/set panel hidden if location denied
- Months are 0-indexed in the inline script (`today.getMonth()+1`)
- Scripts depend on load order — moon-phase.js must load before riset.js (MJD function)

# Trip Planner (MapTiler English Labels)

This project forces map tiles, geocoding, and routing to use English names/labels.

## Setup (short)

1. Backend
   - cd backend
   - npm install
   - copy .env.example .env and set MAPTILER_KEY if you want the frontend to use MapTiler tiles
   - npm start

2. Frontend
   - cd frontend
   - npm install --legacy-peer-deps
   - In your browser, before loading the app, set `window.MAPTILER_KEY = 'YOUR_MAPTILER_KEY'` in the console OR edit `src/components/MapView.jsx` to insert the key directly for development.
   - npm run dev

Notes:
- All Nominatim calls include `accept-language=en` to prefer English names.
- Overpass results prefer `name:en` tag when available, otherwise fallback to `name`.
- Map tiles use MapTiler when a key is provided; otherwise falls back to default OSM tiles.

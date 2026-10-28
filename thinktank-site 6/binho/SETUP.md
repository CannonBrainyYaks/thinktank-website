# Binho League — one-time Google Sheets connection

Google Sheet: https://docs.google.com/spreadsheets/d/1ahIvP5qEmEyDyWe9o2ynbZ4s6Qg1hTvCexzu8TCK5QY/edit

## Deploy

1. Open the Google Sheet → Extensions → Apps Script.
2. Replace the editor's starter code with the complete contents of [Code.gs](./Code.gs).
3. In Apps Script → Project Settings → Script Properties, add `ADMIN_TOKEN` with a long random secret you keep private.
4. Click Deploy → New deployment → Web app.
5. Execute as **Me**. Set access to the smallest audience that can access your public read-only league page (Google may offer 'Anyone' for public access). Treat the schedule and scores as publicly viewable if you choose Anyone.
6. Authorize the deployment and copy its `/exec` URL.
7. Open the Binho website → ⚙ Setup → paste the URL and the admin token on your own device. Other visitors should enter only the URL, not the token.
8. Enter one test score, refresh, and verify the score appears in the Google Sheet and standings. Test from a second browser/device.

## Important limitations

- The current Netlify frontend uses cross-origin requests to Apps Script; browser CORS behavior may prevent reliable reads. The score POST uses `no-cors`, so it cannot confirm whether Google accepted the write. Do not use for official scoring until an end-to-end test succeeds.
- The admin token stored in the browser's localStorage is appropriate only for a trusted admin device; do not share it or enter it on student computers.
- Apps Script deployment and authorization require the Google account holder and cannot be performed by the GitHub integration.
- Playoff brackets are intentionally postponed.

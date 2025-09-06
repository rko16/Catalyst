
# Catalyst Extension (TypeScript) - Starter Guide

## Quick dev steps
1. Install dependencies: `npm install`
2. Run dev server (for UI dev): `npm run dev` (opens Vite dev server)
3. Build: `npm run build` (produces `dist/`)
4. Load extension in Chrome: `chrome://extensions` -> Developer mode -> Load unpacked -> select project root (the folder with manifest.json).
5. Open popup, save OpenAI API key, then Toggle Sidebar.

Notes:
- Background is compiled to background.js by Vite build (you may need an additional build step in real projects).
- This starter is a scaffold — adapt build step if you want background/service_worker transpiled separately.

# Name Arcade

A mobile-first name games app with:
- 8 playable games in one UI shell: FLAMES, Compatibility, Ship Name, Lucky Letter, Numerology Lite, Initials Chemistry, Anagram Sprint, Name Battle
- 2-name input flow with dynamic game switching
- Animated result reveal + GIF state
- Download/share image card for every game
- Rule-based help chatbot (RiveScript, no LLM)
- PWA install prompt (native-like home-screen app)
- Split game scripts that lazy-load only when selected
- Local visual assets for each game (no broken external media)

## Run locally

Do not open `index.html` with `file://` directly, because some browsers apply strict CORS/security rules for scripts and service workers.

Serve the folder with any static server instead.

Example (Node):

```bash
npx serve .
```

Alternative (Python):

```bash
python -m http.server 5500
```

## Deploy on Cloudflare Pages (Free)

1. Push this folder to a GitHub repository.
2. In Cloudflare dashboard, go to `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
3. Select your repository.
4. Build settings:
- Framework preset: `None`
- Build command: (leave empty)
- Build output directory: `/`
5. Deploy.

Cloudflare will give you a URL like `https://name-arcade.pages.dev`.

## Make it feel native on mobile

1. Open your deployed URL in Chrome mobile.
2. Tap browser menu -> `Add to Home Screen` or `Install app`.
3. Launch from home screen; it runs in standalone mode.

## Notes

- This app is for fun only.
- Game logic is split into `games/*.js`; each file registers itself via `window.NameArcade.registerGame(...)`.
- Shared UI, share-card rendering, chatbot, and lazy loader live in `app.js`.
- To add a game: create `games/<id>.js`, map it in `GAME_SCRIPTS` in `app.js`, and add a media asset in `assets/media/`.

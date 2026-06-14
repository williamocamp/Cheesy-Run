# 🧀 Cheesy Run

A cozy, toy-like **Phaser 3** stealth prototype. You play a tiny mouse sneaking
through a giant apartment, collecting every wedge of cheese while dodging the
humans' red vision cones and the snap traps on the floor.

## Play

```bash
# from this folder — any static server works
npx serve .
# then open the printed http://localhost:3000
```

> It must be served over HTTP (not opened as a `file://`), because the game
> loads as an ES module.

## Controls

- **WASD** or **Arrow keys** — move the mouse
- Collect all cheese to clear the floor
- Avoid the red vision cones (you get spotted) and the mouse traps
- Grab a **donut** for an extra life
- Lose all lives → game over (Space / tap to retry)

## Gameplay

- Top-left HUD: cheese collected, lives (hearts), current floor
- Bottom-right: circular minimap (player, cheese, humans, traps, power-ups)
- Clear a floor and the next one has **more cheese, more traps, and faster humans**
- Walls block both vision and the minimap-free line of sight, so use cover

## Project structure

```
index.html             # loads Phaser (CDN) + the game module
src/
  main.js              # Phaser.Game config + scene list
  config.js            # grid / canvas constants + palette
  data/
    level.js           # apartment grid (rooms + doorways)
    floors.js          # difficulty curve + patrol routes
  scenes/
    BootScene.js       # generates all sprite art from vector shapes
    GameScene.js       # core gameplay loop
    UIScene.js         # HUD + minimap overlay
  entities/
    Player.js  Human.js  Cheese.js  Trap.js  PowerUp.js
  systems/
    Minimap.js         # circular minimap renderer
```

No build step, no backend — all placeholder art is drawn at runtime.

## Deploy to Vercel

This folder is a self-contained static site.

```bash
npm i -g vercel    # if needed
vercel             # from this folder; accept the defaults
```

Or import the repo in the Vercel dashboard and set the **Root Directory** to
`cheesy-run/`. No framework preset or build command is required.

### Auto-deploy via GitHub Actions

`.github/workflows/deploy.yml` deploys to Vercel production on every push to
`main`. It needs three repository secrets
(**Settings → Secrets and variables → Actions**):

| Secret | Where to find it |
| --- | --- |
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens → create one |
| `VERCEL_ORG_ID` | run `vercel link` locally, then read `.vercel/project.json` (`orgId`) |
| `VERCEL_PROJECT_ID` | same file, `projectId` |

> If you also keep Vercel's built-in Git integration enabled, you'll get two
> deploys per push. Pick one: either remove this workflow, or disconnect the
> Git integration in the Vercel project settings.

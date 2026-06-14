# 🧀 Cheesy Run

A cozy, toy-like **Phaser 3** stealth prototype with a **2.5D isometric** view.
You play a tiny mouse sneaking through a giant apartment, collecting every wedge
of cheese while dodging the humans' red vision cones and the snap traps on the
floor.

The game *simulates* in flat 2D (Arcade physics, collisions, vision) and only
*renders* isometrically: every sprite is projected to an iso grid and
depth-sorted, walls are raised cubes, and the camera follows the mouse.

## Play

```bash
# from this folder — any static server works
npx serve .
# then open the printed http://localhost:3000
```

> It must be served over HTTP (not opened as a `file://`), because the game
> loads as an ES module.

## Controls

- **WASD** or **Arrow keys** — move the mouse (relative to the screen: up = toward the top)
- **Space** — dash: a short, fast burst in your current heading (brief cooldown)
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
    BootScene.js       # generates all sprite art (+ the iso wall cube)
    GameScene.js       # core gameplay loop, iso rendering, camera
    UIScene.js         # HUD + minimap overlay
  entities/            # each = invisible physics body + iso billboard view
    Player.js  Human.js  Cheese.js  Trap.js  PowerUp.js
  systems/
    iso.js             # isometric projection + screen->world input mapping
    Minimap.js         # circular minimap renderer (top-down)
```

No build step, no backend — all placeholder art is drawn at runtime.

## Deploy to Vercel

This folder is a self-contained static site.

```bash
npm i -g vercel    # if needed
vercel             # from this folder; accept the defaults
```

Or import the repo in the Vercel dashboard and set the **Root Directory** to
`cheesy-run/`. No framework preset or build command is required. With Vercel's
Git integration connected, every push to `main` auto-deploys to production.

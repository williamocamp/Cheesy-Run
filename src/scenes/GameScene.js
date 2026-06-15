// Core gameplay. The simulation (movement, collisions, vision) runs in flat
// world space; rendering is isometric. Builds a floor, spawns the mouse /
// cheese / traps / humans, handles detection, lives, respawns, and floor
// progression.

import { TILE, ISO_W, ISO_H, WALL_H, FURN_MAX_H, GAME_WIDTH, GAME_HEIGHT, MAX_LIVES, RENDER_SCALE, COLORS } from '../config.js';
import { isoPos, isoDepth } from '../systems/iso.js';
import { buildLevel } from '../data/level.js';
import { getFloorConfig, PATROL_ROUTES } from '../data/floors.js';
import { getApartment } from '../data/apartments.js';
import Player from '../entities/Player.js';
import Human from '../entities/Human.js';
import Cheese from '../entities/Cheese.js';
import Trap from '../entities/Trap.js';
import PowerUp from '../entities/PowerUp.js';

const WALL_ANCHOR_Y = (ISO_H + WALL_H) / (2 * ISO_H + WALL_H);
const FURN_ANCHOR_Y = (ISO_H + FURN_MAX_H) / (2 * ISO_H + FURN_MAX_H);

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.floor = data.floor || 1;
    this.lives = data.lives != null ? data.lives : 3;
  }

  create() {
    this.apartment = getApartment(this.floor);
    const level = buildLevel(this.apartment);
    this.grid = level.grid;
    this.W = level.W;
    this.H = level.H;
    this.furnitureMap = level.furniture;
    this.cfg = getFloorConfig(this.floor);
    this.transitioning = false;
    this.invulnTween = null;
    this.physics.resume(); // in case we restarted from a paused game-over screen

    this.physics.world.setBounds(0, 0, this.W * TILE, this.H * TILE);
    this.cameras.main.setBackgroundColor(this.apartment.bg);

    this.registerAnims();
    this.drawIsoFloor();
    this.buildWalls();

    // Player
    this.spawnPoint = { x: (level.spawn.x + 0.5) * TILE, y: (level.spawn.y + 0.5) * TILE };
    this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y);
    this.physics.add.collider(this.player.phys, this.walls);

    // Collectibles + hazards
    this.pendingTrap = null;
    this.trapForbidden = this.buildTrapForbidden(level.doors);
    this.freeCells = this.computeFreeCells(level.spawn);
    this.cheeseGroup = this.physics.add.group();
    this.trapGroup = this.physics.add.group();
    this.powerGroup = this.physics.add.group();
    this.placeEntities();

    // Humans
    this.humans = [];
    this.spawnHumans();

    // Overlaps (callbacks receive the physics bodies)
    this.physics.add.overlap(this.player.phys, this.cheeseGroup, this.onCheese, null, this);
    this.physics.add.overlap(this.player.phys, this.trapGroup, this.onTrap, null, this);
    this.physics.add.overlap(this.player.phys, this.powerGroup, this.onPower, null, this);

    // State -> registry (consumed by the UI scene; all in flat world coords)
    this.cheeseCollected = 0;
    this.cheeseTotal = this.cheeseGroup.countActive(true);
    this.registry.set('lives', this.lives);
    this.registry.set('floor', this.floor);
    this.registry.set('floorName', this.apartment.name);
    this.registry.set('cheeseCollected', 0);
    this.registry.set('cheeseTotal', this.cheeseTotal);
    this.registry.set('bounds', { w: this.W * TILE, h: this.H * TILE });
    this.registry.set('gameRefs', {
      player: this.player,
      cheese: this.cheeseGroup,
      traps: this.trapGroup,
      powers: this.powerGroup,
      humans: this.humans,
    });

    // Camera follows the mouse through the isometric world
    this.setupCamera();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');
    this.input.keyboard.addCapture('SPACE,UP,DOWN,LEFT,RIGHT'); // don't scroll the page

    if (!this.scene.isActive('UI')) this.scene.launch('UI');

    this.setInvuln(800);
  }

  update(time, delta) {
    if (this.transitioning) return;

    this.player.move(this.cursors, this.keys, delta);
    this.player.sync();

    const isWall = (x, y) => this.isWall(x, y);
    const losClear = (x1, y1, x2, y2) => this.losClear(x1, y1, x2, y2);

    for (const h of this.humans) {
      h.patrol(this, delta);
      const seen = h.canSee(this.player, losClear);
      h.detected = seen;
      h.drawCone(isWall);
      h.sync();
      if (seen && !this.player.invuln) {
        this.loseLife();
        break;
      }
    }
  }

  registerAnims() {
    // Animations live on the global manager, so only create them once.
    if (this.anims.exists('mouse-walk')) return;
    this.anims.create({
      key: 'mouse-walk',
      frames: [0, 1, 2, 3].map((i) => ({ key: `mouse_walk${i}` })),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'human-walk',
      frames: [0, 1, 2, 3].map((i) => ({ key: `human_walk${i}` })),
      frameRate: 8,
      repeat: -1,
    });
  }

  // ---- world helpers ----------------------------------------------------

  isWall(px, py) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= this.W || ty >= this.H) return true;
    return this.grid[ty][tx] === 1;
  }

  losClear(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.ceil(dist / (TILE / 3));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (this.isWall(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return false;
    }
    return true;
  }

  quadrantOf(x, y) {
    if (x < 9 && y < 6) return 'LT';
    if (x > 9 && y < 6) return 'RT';
    if (x < 9 && y > 6) return 'LB';
    if (x > 9 && y > 6) return 'RB';
    return null; // central hallway / doorways
  }

  floorStyle(x, y) {
    const q = this.quadrantOf(x, y);
    return q ? this.apartment.quadrants[q] : this.apartment.hallway;
  }

  drawIsoFloor() {
    const g = this.add.graphics();
    g.setDepth(-100000);
    for (let y = 0; y < this.H; y++) {
      for (let x = 0; x < this.W; x++) {
        if (this.grid[y][x] === 1) continue;
        const p = isoPos((x + 0.5) * TILE, (y + 0.5) * TILE);
        const diamond = [
          { x: p.x, y: p.y - ISO_H },
          { x: p.x + ISO_W, y: p.y },
          { x: p.x, y: p.y + ISO_H },
          { x: p.x - ISO_W, y: p.y },
        ];
        const style = this.floorStyle(x, y);
        g.fillStyle(style.fill, 1);
        g.fillPoints(diamond, true);
        // soft grid edge gives the floor its tile texture
        g.lineStyle(1.5, style.grid, 0.45);
        g.strokePoints(diamond, true);
      }
    }
  }

  buildWalls() {
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < this.H; y++) {
      for (let x = 0; x < this.W; x++) {
        if (this.grid[y][x] !== 1) continue;
        const cx = x * TILE + TILE / 2;
        const cy = y * TILE + TILE / 2;

        // physics body (flat world space, invisible)
        const rect = this.add.rectangle(cx, cy, TILE, TILE, 0x000000, 0);
        this.physics.add.existing(rect, true);
        this.walls.add(rect);

        // furniture gets its own object texture; the shell uses a wall cube
        const p = isoPos(cx, cy);
        const depth = isoDepth(cx, cy) + 0.4;
        const ftype = this.furnitureMap && this.furnitureMap.get(`${x},${y}`);
        if (ftype && this.textures.exists(`furn_${ftype}`)) {
          this.add.image(p.x, p.y, `furn_${ftype}`).setOrigin(0.5, FURN_ANCHOR_Y).setDepth(depth);
        } else {
          this.add.image(p.x, p.y, 'wallcube').setOrigin(0.5, WALL_ANCHOR_Y).setDepth(depth);
        }
      }
    }
  }

  // Only cells reachable (4-way) from the spawn are eligible for cheese / traps
  // / power-ups, so furniture can never strand a pickup in a sealed pocket.
  computeFreeCells(spawn) {
    const reach = new Set([`${spawn.x},${spawn.y}`]);
    const queue = [[spawn.x, spawn.y]];
    const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of steps) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= this.W || ny >= this.H) continue;
        const key = `${nx},${ny}`;
        if (reach.has(key) || this.grid[ny][nx] !== 0) continue;
        reach.add(key);
        queue.push([nx, ny]);
      }
    }
    const cells = [];
    for (const key of reach) {
      const [x, y] = key.split(',').map(Number);
      if (Math.abs(x - spawn.x) + Math.abs(y - spawn.y) <= 2) continue;
      cells.push({ x, y });
    }
    return Phaser.Utils.Array.Shuffle(cells);
  }

  // Doorway cells (and the tiles right beside them) where a trap would block a
  // choke point. Traps are kept off these.
  buildTrapForbidden(doors) {
    const set = new Set();
    for (const d of doors || []) {
      set.add(`${d.x},${d.y}`);
      set.add(`${d.x + 1},${d.y}`);
      set.add(`${d.x - 1},${d.y}`);
      set.add(`${d.x},${d.y + 1}`);
      set.add(`${d.x},${d.y - 1}`);
    }
    return set;
  }

  placeEntities() {
    let i = 0;
    const toPx = (c) => ({ x: (c.x + 0.5) * TILE, y: (c.y + 0.5) * TILE });
    // Pull the next cell; when `avoid` is given, skip forbidden cells.
    const nextCell = (avoid) => {
      while (i < this.freeCells.length) {
        const c = this.freeCells[i++];
        if (avoid && avoid.has(`${c.x},${c.y}`)) continue;
        return c;
      }
      return null;
    };

    for (let n = 0; n < this.cfg.cheese; n++) {
      const c = nextCell(null);
      if (!c) break;
      const p = toPx(c);
      this.cheeseGroup.add(new Cheese(this, p.x, p.y).phys);
    }
    for (let n = 0; n < this.cfg.traps; n++) {
      const c = nextCell(this.trapForbidden);
      if (!c) break;
      const p = toPx(c);
      this.trapGroup.add(new Trap(this, p.x, p.y).phys);
    }
    for (let n = 0; n < this.cfg.donuts; n++) {
      const c = nextCell(null);
      if (!c) break;
      const p = toPx(c);
      this.powerGroup.add(new PowerUp(this, p.x, p.y).phys);
    }
  }

  spawnHumans() {
    for (let i = 0; i < this.cfg.humans; i++) {
      const tileRoute = PATROL_ROUTES[i % PATROL_ROUTES.length];
      const route = tileRoute.map((p) => ({ x: (p.x + 0.5) * TILE, y: (p.y + 0.5) * TILE }));
      const h = new Human(this, route, this.cfg.humanSpeed);
      this.physics.add.collider(h.phys, this.walls);
      this.humans.push(h);
    }
  }

  setupCamera() {
    // Project the grid corners to find the isometric extent, then frame it.
    const corners = [
      isoPos(0, 0),
      isoPos(this.W * TILE, 0),
      isoPos(0, this.H * TILE),
      isoPos(this.W * TILE, this.H * TILE),
    ];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const c of corners) {
      minX = Math.min(minX, c.x);
      maxX = Math.max(maxX, c.x);
      minY = Math.min(minY, c.y);
      maxY = Math.max(maxY, c.y);
    }
    const pad = 60;
    this.cameras.main.setBounds(
      minX - pad,
      minY - WALL_H - pad,
      maxX - minX + pad * 2,
      maxY - minY + WALL_H + pad * 2
    );
    this.cameras.main.startFollow(this.player.view, true, 0.12, 0.12);
    // Supersample: zoom so the same world area fills the larger buffer.
    this.cameras.main.setZoom(RENDER_SCALE);
  }

  // ---- gameplay events --------------------------------------------------

  onCheese(playerPhys, cheesePhys) {
    if (!cheesePhys.active) return;
    cheesePhys.parentEntity.collect();
    this.cheeseCollected += 1;
    this.registry.set('cheeseCollected', this.cheeseCollected);
    this.popText(cheesePhys.x, cheesePhys.y, '+1', '#ffd24a');
    if (this.cheeseCollected >= this.cheeseTotal) this.floorComplete();
  }

  onTrap(playerPhys, trapPhys) {
    if (this.player.invuln || this.transitioning) return;
    // Remember the trap that sprung so it vanishes when the mouse respawns.
    this.pendingTrap = trapPhys.parentEntity;
    this.loseLife();
  }

  onPower(playerPhys, donutPhys) {
    if (!donutPhys.active) return;
    donutPhys.parentEntity.collect();
    this.lives = Math.min(this.lives + 1, MAX_LIVES);
    this.registry.set('lives', this.lives);
    this.cameras.main.flash(150, 120, 255, 170);
    this.popText(donutPhys.x, donutPhys.y, '+1 life', '#ff9ec7');
  }

  loseLife() {
    if (this.player.invuln || this.transitioning) return;
    this.lives -= 1;
    this.registry.set('lives', this.lives);
    this.cameras.main.shake(150, 0.006);
    this.cameras.main.flash(160, 255, 90, 90);
    if (this.lives <= 0) this.gameOver();
    else this.respawn();
  }

  respawn() {
    // A trap that caught us disappears on respawn.
    if (this.pendingTrap) {
      this.pendingTrap.remove();
      this.pendingTrap = null;
    }
    this.player.phys.setVelocity(0, 0);
    this.player.phys.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.sync();
    this.setInvuln(1300);
  }

  setInvuln(ms) {
    this.player.invuln = true;
    if (this.invulnTween) this.invulnTween.stop();
    this.invulnTween = this.tweens.add({
      targets: this.player.view,
      alpha: 0.35,
      duration: 120,
      yoyo: true,
      repeat: -1,
    });
    this.time.delayedCall(ms, () => {
      this.player.invuln = false;
      if (this.invulnTween) {
        this.invulnTween.stop();
        this.invulnTween = null;
      }
      this.player.view.setAlpha(1);
    });
  }

  floorComplete() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.physics.pause();
    if (this.invulnTween) this.invulnTween.stop();
    this.player.view.setAlpha(1);
    this.showBanner(`Floor ${this.floor} Complete!`, 'Heading upstairs...');
    this.time.delayedCall(1700, () => {
      this.scene.restart({ floor: this.floor + 1, lives: this.lives });
    });
  }

  gameOver() {
    this.transitioning = true;
    this.physics.pause();
    if (this.invulnTween) this.invulnTween.stop();
    this.player.view.setAlpha(1);
    this.showBanner('Game Over', 'Press Space or Tap to retry');
    const retry = () => this.scene.restart({ floor: 1, lives: 3 });
    this.input.keyboard.once('keydown-SPACE', retry);
    this.input.once('pointerdown', retry);
  }

  // ---- ui bits ----------------------------------------------------------

  showBanner(title, sub) {
    // Anchor to the camera's current view centre (world space) and counter the
    // zoom so it appears centred at design size regardless of RENDER_SCALE.
    const view = this.cameras.main.worldView;
    const cx = view.centerX;
    const cy = view.centerY;
    const s = 1 / RENDER_SCALE;
    this.add
      .rectangle(cx, cy, 440, 124, 0x2b2230, 0.88)
      .setScale(s)
      .setDepth(99999)
      .setStrokeStyle(3, 0xffe0b0);
    this.add
      .text(cx, cy - 16 * s, title, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        color: '#fff8e7',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScale(s)
      .setDepth(100000);
    this.add
      .text(cx, cy + 24 * s, sub || '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#ffd9a8',
      })
      .setOrigin(0.5)
      .setScale(s)
      .setDepth(100000);
  }

  popText(wx, wy, msg, color) {
    const p = isoPos(wx, wy);
    const s = 1 / RENDER_SCALE; // world object under camera zoom -> design size
    const t = this.add
      .text(p.x, p.y, msg, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScale(s)
      .setDepth(90000);
    this.tweens.add({
      targets: t,
      y: p.y - 24 * s,
      alpha: 0,
      duration: 650,
      ease: 'Cubic.out',
      onComplete: () => t.destroy(),
    });
  }
}

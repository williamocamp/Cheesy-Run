// Core gameplay. The simulation (movement, collisions, vision) runs in flat
// world space; rendering is isometric. Builds a floor, spawns the mouse /
// cheese / traps / humans, handles detection, lives, respawns, and floor
// progression.

import { TILE, ISO_W, ISO_H, WALL_H, GAME_WIDTH, GAME_HEIGHT, MAX_LIVES, COLORS } from '../config.js';
import { isoPos, isoDepth } from '../systems/iso.js';
import { buildLevel } from '../data/level.js';
import { getFloorConfig, PATROL_ROUTES } from '../data/floors.js';
import Player from '../entities/Player.js';
import Human from '../entities/Human.js';
import Cheese from '../entities/Cheese.js';
import Trap from '../entities/Trap.js';
import PowerUp from '../entities/PowerUp.js';

const WALL_ANCHOR_Y = (ISO_H + WALL_H) / (2 * ISO_H + WALL_H);

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.floor = data.floor || 1;
    this.lives = data.lives != null ? data.lives : 3;
  }

  create() {
    const level = buildLevel();
    this.grid = level.grid;
    this.W = level.W;
    this.H = level.H;
    this.cfg = getFloorConfig(this.floor);
    this.transitioning = false;
    this.invulnTween = null;
    this.physics.resume(); // in case we restarted from a paused game-over screen

    this.physics.world.setBounds(0, 0, this.W * TILE, this.H * TILE);
    this.cameras.main.setBackgroundColor(COLORS.bg);

    this.registerAnims();
    this.drawIsoFloor();
    this.buildWalls();

    // Player
    this.spawnPoint = { x: (level.spawn.x + 0.5) * TILE, y: (level.spawn.y + 0.5) * TILE };
    this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y);
    this.physics.add.collider(this.player.phys, this.walls);

    // Collectibles + hazards
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

    // Soft light that follows the mouse (additive over the dark floor)
    this.playerLight = this.add
      .image(0, 0, 'glow')
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(COLORS.glowPlayer)
      .setAlpha(0.5)
      .setScale(3.4)
      .setDepth(-90000);

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
    this.playerLight.setPosition(this.player.view.x, this.player.view.y);

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

  floorStyle(x, y) {
    const r = COLORS.rooms;
    if (x < 9 && y < 6) return r.living;
    if (x < 9 && y > 6) return r.wood;
    if (x > 9 && y < 6) return r.bedroom;
    if (x > 9 && y > 6) return (x + y) % 2 === 0 ? r.kitchenA : r.kitchenB;
    return r.doorway;
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
        // neon grid edge gives the floor its glow + texture
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

        // isometric cube visual
        const p = isoPos(cx, cy);
        this.add
          .image(p.x, p.y, 'wallcube')
          .setOrigin(0.5, WALL_ANCHOR_Y)
          .setDepth(isoDepth(cx, cy) + 0.4);
      }
    }
  }

  computeFreeCells(spawn) {
    const cells = [];
    for (let y = 1; y < this.H - 1; y++) {
      for (let x = 1; x < this.W - 1; x++) {
        if (this.grid[y][x] !== 0) continue;
        if (Math.abs(x - spawn.x) + Math.abs(y - spawn.y) <= 2) continue;
        cells.push({ x, y });
      }
    }
    return Phaser.Utils.Array.Shuffle(cells);
  }

  placeEntities() {
    let i = 0;
    const next = () => this.freeCells[i++];
    const toPx = (c) => ({ x: (c.x + 0.5) * TILE, y: (c.y + 0.5) * TILE });

    for (let n = 0; n < this.cfg.cheese && i < this.freeCells.length; n++) {
      const p = toPx(next());
      this.cheeseGroup.add(new Cheese(this, p.x, p.y).phys);
    }
    for (let n = 0; n < this.cfg.traps && i < this.freeCells.length; n++) {
      const p = toPx(next());
      this.trapGroup.add(new Trap(this, p.x, p.y).phys);
    }
    for (let n = 0; n < this.cfg.donuts && i < this.freeCells.length; n++) {
      const p = toPx(next());
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

  onTrap() {
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
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    this.add
      .rectangle(cx, cy, 440, 124, 0x2b2230, 0.88)
      .setScrollFactor(0)
      .setDepth(99999)
      .setStrokeStyle(3, 0xffe0b0);
    this.add
      .text(cx, cy - 16, title, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        color: '#fff8e7',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100000);
    this.add
      .text(cx, cy + 24, sub || '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#ffd9a8',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100000);
  }

  popText(wx, wy, msg, color) {
    const p = isoPos(wx, wy);
    const t = this.add
      .text(p.x, p.y, msg, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(90000);
    this.tweens.add({
      targets: t,
      y: p.y - 24,
      alpha: 0,
      duration: 650,
      ease: 'Cubic.out',
      onComplete: () => t.destroy(),
    });
  }
}

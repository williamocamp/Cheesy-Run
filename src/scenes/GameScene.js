// Core gameplay: builds a floor, spawns the mouse / cheese / traps / humans,
// handles detection, lives, respawns, and floor progression.

import { TILE, GAME_WIDTH, GAME_HEIGHT, MAX_LIVES, COLORS } from '../config.js';
import { buildLevel } from '../data/level.js';
import { getFloorConfig, PATROL_ROUTES } from '../data/floors.js';
import Player from '../entities/Player.js';
import Human from '../entities/Human.js';
import Cheese from '../entities/Cheese.js';
import Trap from '../entities/Trap.js';
import PowerUp from '../entities/PowerUp.js';

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
    this.cameras.main.setBounds(0, 0, this.W * TILE, this.H * TILE);
    this.cameras.main.setBackgroundColor(COLORS.bg);

    this.drawBackground();
    this.buildWalls();

    // Player
    this.spawnPoint = { x: (level.spawn.x + 0.5) * TILE, y: (level.spawn.y + 0.5) * TILE };
    this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y);
    this.physics.add.collider(this.player, this.walls);

    // Collectibles + hazards
    this.freeCells = this.computeFreeCells(level.spawn);
    this.cheeseGroup = this.physics.add.group();
    this.trapGroup = this.physics.add.group();
    this.powerGroup = this.physics.add.group();
    this.placeEntities();

    // Humans
    this.humans = [];
    this.spawnHumans();

    // Overlaps
    this.physics.add.overlap(this.player, this.cheeseGroup, this.onCheese, null, this);
    this.physics.add.overlap(this.player, this.trapGroup, this.onTrap, null, this);
    this.physics.add.overlap(this.player, this.powerGroup, this.onPower, null, this);

    // State -> registry (consumed by the UI scene)
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

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');

    if (!this.scene.isActive('UI')) this.scene.launch('UI');

    // Brief grace period on (re)spawn
    this.setInvuln(800);
  }

  update() {
    if (this.transitioning) return;

    this.player.move(this.cursors, this.keys);

    const isWall = (x, y) => this.isWall(x, y);
    const losClear = (x1, y1, x2, y2) => this.losClear(x1, y1, x2, y2);

    for (const h of this.humans) {
      h.patrol(this);
      const seen = h.canSee(this.player, losClear);
      h.detected = seen;
      h.drawCone(isWall);
      if (seen && !this.player.invuln) {
        this.loseLife();
        break;
      }
    }
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

  floorColor(x, y) {
    if (x < 9 && y < 6) return COLORS.floorLivingRoom;
    if (x < 9 && y > 6) return COLORS.floorWood;
    if (x > 9 && y < 6) return COLORS.floorBedroom;
    if (x > 9 && y > 6) return (x + y) % 2 === 0 ? COLORS.floorKitchenA : COLORS.floorKitchenB;
    return COLORS.floorDoorway;
  }

  drawBackground() {
    const g = this.add.graphics();
    g.setDepth(-10);

    // Floor tiles
    for (let y = 0; y < this.H; y++) {
      for (let x = 0; x < this.W; x++) {
        if (this.grid[y][x] === 1) continue;
        const px = x * TILE;
        const py = y * TILE;
        g.fillStyle(this.floorColor(x, y), 1);
        g.fillRect(px, py, TILE, TILE);
        g.lineStyle(1, 0x000000, 0.04);
        g.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      }
    }

    // Walls (with faux-height top highlight + soft south shadow)
    for (let y = 0; y < this.H; y++) {
      for (let x = 0; x < this.W; x++) {
        if (this.grid[y][x] !== 1) continue;
        const px = x * TILE;
        const py = y * TILE;
        if (y + 1 < this.H && this.grid[y + 1][x] === 0) {
          g.fillStyle(0x000000, 0.12);
          g.fillRect(px, py + TILE, TILE, 8);
        }
        g.fillStyle(COLORS.wall, 1);
        g.fillRect(px, py, TILE, TILE);
        g.fillStyle(COLORS.wallTop, 1);
        g.fillRect(px, py, TILE, TILE * 0.5);
        g.lineStyle(1, COLORS.wallEdge, 0.6);
        g.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      }
    }
  }

  buildWalls() {
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < this.H; y++) {
      for (let x = 0; x < this.W; x++) {
        if (this.grid[y][x] !== 1) continue;
        const rect = this.add.rectangle(
          x * TILE + TILE / 2,
          y * TILE + TILE / 2,
          TILE,
          TILE,
          0x000000,
          0
        );
        this.physics.add.existing(rect, true);
        this.walls.add(rect);
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
      this.cheeseGroup.add(new Cheese(this, p.x, p.y));
    }
    for (let n = 0; n < this.cfg.traps && i < this.freeCells.length; n++) {
      const p = toPx(next());
      this.trapGroup.add(new Trap(this, p.x, p.y));
    }
    for (let n = 0; n < this.cfg.donuts && i < this.freeCells.length; n++) {
      const p = toPx(next());
      this.powerGroup.add(new PowerUp(this, p.x, p.y));
    }
  }

  spawnHumans() {
    for (let i = 0; i < this.cfg.humans; i++) {
      const tileRoute = PATROL_ROUTES[i % PATROL_ROUTES.length];
      const route = tileRoute.map((p) => ({ x: (p.x + 0.5) * TILE, y: (p.y + 0.5) * TILE }));
      const h = new Human(this, route, this.cfg.humanSpeed);
      this.physics.add.collider(h, this.walls);
      this.humans.push(h);
    }
  }

  // ---- gameplay events --------------------------------------------------

  onCheese(player, cheese) {
    if (!cheese.active) return;
    cheese.disableBody(true, true);
    this.cheeseCollected += 1;
    this.registry.set('cheeseCollected', this.cheeseCollected);
    this.popText(cheese.x, cheese.y, '+1', '#ffd24a');
    if (this.cheeseCollected >= this.cheeseTotal) this.floorComplete();
  }

  onTrap() {
    this.loseLife();
  }

  onPower(player, donut) {
    if (!donut.active) return;
    donut.disableBody(true, true);
    this.lives = Math.min(this.lives + 1, MAX_LIVES);
    this.registry.set('lives', this.lives);
    this.cameras.main.flash(150, 120, 255, 170);
    this.popText(donut.x, donut.y, '+1 life', '#ff9ec7');
  }

  loseLife() {
    if (this.player.invuln || this.transitioning) return;
    this.lives -= 1;
    this.registry.set('lives', this.lives);
    this.cameras.main.shake(150, 0.008);
    this.cameras.main.flash(160, 255, 90, 90);
    if (this.lives <= 0) this.gameOver();
    else this.respawn();
  }

  respawn() {
    this.player.setVelocity(0, 0);
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.setInvuln(1300);
  }

  setInvuln(ms) {
    this.player.invuln = true;
    if (this.invulnTween) this.invulnTween.stop();
    this.invulnTween = this.tweens.add({
      targets: this.player,
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
      this.player.setAlpha(1);
    });
  }

  floorComplete() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.physics.pause();
    if (this.invulnTween) this.invulnTween.stop();
    this.player.setAlpha(1);
    this.showBanner(`Floor ${this.floor} Complete!`, 'Heading upstairs...');
    this.time.delayedCall(1700, () => {
      this.scene.restart({ floor: this.floor + 1, lives: this.lives });
    });
  }

  gameOver() {
    this.transitioning = true;
    this.physics.pause();
    if (this.invulnTween) this.invulnTween.stop();
    this.player.setAlpha(1);
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
      .setDepth(1999)
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
      .setDepth(2000);
    this.add
      .text(cx, cy + 24, sub || '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#ffd9a8',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000);
  }

  popText(x, y, msg, color) {
    const t = this.add
      .text(x, y, msg, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(50);
    this.tweens.add({
      targets: t,
      y: y - 22,
      alpha: 0,
      duration: 650,
      ease: 'Cubic.out',
      onComplete: () => t.destroy(),
    });
  }
}

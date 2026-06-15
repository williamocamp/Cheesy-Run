// Generates all sprite textures from vector shapes (no external image assets
// required), then hands off to the GameScene. Neon styling: dark bodies with
// glowing rim accents, plus a soft radial 'glow' texture used for lighting.

import { ISO_W, ISO_H, WALL_H, FURN_MAX_H, COLORS } from '../config.js';

// Furniture texture canvas: same iso footprint as a wall cube, but tall enough
// for the highest piece. Every furniture block shares this canvas + base, so
// they all use one anchor (FURN_ANCHOR_Y in GameScene).
const F_W = 2 * ISO_W;
const F_H = 2 * ISO_H + FURN_MAX_H;
const F_BASEY = ISO_H + FURN_MAX_H; // y of the base-diamond centre (floor level)

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.makeGlow();
    this.makeMouse();
    this.makeHuman();
    this.makeCheese();
    this.makeTrap();
    this.makeDonut();
    this.makeHeart();
    this.makeWallCube();
    this.makeFurniture();
    this.scene.start('Game', { floor: 1, lives: 3 });
  }

  gfx() {
    return this.make.graphics({ x: 0, y: 0, add: false });
  }

  // Soft radial glow (white -> transparent). Tinted + additive when used as a
  // light or an emissive halo.
  makeGlow() {
    const g = this.gfx();
    const R = 64;
    const steps = 44;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const r = R * (1 - t);
      const a = Math.pow(t, 2) * 0.6;
      g.fillStyle(0xffffff, a);
      g.fillCircle(R, R, r);
    }
    g.generateTexture('glow', R * 2, R * 2);
    g.destroy();
  }

  // Mouse: a neutral 'mouse' texture plus a 4-frame walk cycle
  // ('mouse_walk0'..'mouse_walk3'). Feet alternate and the body bobs.
  makeMouse() {
    const frames = [
      { lf: [15, 41], rf: [25, 41], bob: 0, tail: 31 },
      { lf: [13, 38], rf: [26, 41], bob: -1.5, tail: 34 },
      { lf: [15, 41], rf: [25, 41], bob: 0, tail: 30 },
      { lf: [17, 38], rf: [23, 41], bob: -1.5, tail: 34 },
    ];
    this.drawMouse('mouse', frames[0]);
    frames.forEach((f, i) => this.drawMouse(`mouse_walk${i}`, f));
  }

  drawMouse(key, f) {
    const g = this.gfx();
    const dy = f.bob;
    // tail
    g.lineStyle(4, 0xc99a7a, 1);
    g.beginPath();
    g.moveTo(24, 40 + dy);
    g.lineTo(34, 38 + dy);
    g.lineTo(36, f.tail + dy);
    g.strokePath();
    // feet (stay on the ground)
    g.fillStyle(0xffc2d0, 1);
    g.fillEllipse(f.lf[0], f.lf[1], 8, 5);
    g.fillEllipse(f.rf[0], f.rf[1], 8, 5);
    // ears
    g.fillStyle(0xb78a6a, 1);
    g.fillCircle(10, 12 + dy, 8);
    g.fillCircle(30, 12 + dy, 8);
    g.fillStyle(0xffb6c8, 1);
    g.fillCircle(10, 12 + dy, 4);
    g.fillCircle(30, 12 + dy, 4);
    // body with soft outline
    g.fillStyle(0xbf9270, 1);
    g.fillEllipse(20, 27 + dy, 30, 32);
    g.lineStyle(2, 0x8f6a4a, 0.5);
    g.strokeEllipse(20, 27 + dy, 30, 32);
    // belly
    g.fillStyle(0xf2e0c8, 1);
    g.fillEllipse(20, 31 + dy, 16, 18);
    // red backpack strap
    g.fillStyle(0xe85d4a, 1);
    g.fillRoundedRect(14, 20 + dy, 12, 6, 3);
    // eyes (with shine) + nose
    g.fillStyle(0x36281f, 1);
    g.fillCircle(15, 20 + dy, 2.8);
    g.fillCircle(25, 20 + dy, 2.8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(15.9, 19.2 + dy, 1);
    g.fillCircle(25.9, 19.2 + dy, 1);
    g.fillStyle(0xff8fa6, 1);
    g.fillCircle(20, 25 + dy, 2.2);
    g.generateTexture(key, 40, 44);
    g.destroy();
  }

  // Human: neutral 'human' plus a 4-frame walk cycle. Legs stride, arms swing,
  // body bobs.
  makeHuman() {
    const frames = [
      { lf: [16, 56], rf: [27, 56], bob: 0, arm: 0 },
      { lf: [14, 54], rf: [28, 56], bob: -1, arm: 2 },
      { lf: [16, 56], rf: [27, 56], bob: 0, arm: 0 },
      { lf: [18, 56], rf: [29, 54], bob: -1, arm: -2 },
    ];
    this.drawHuman('human', frames[0]);
    frames.forEach((f, i) => this.drawHuman(`human_walk${i}`, f));
  }

  drawHuman(key, f) {
    const g = this.gfx();
    const dy = f.bob;
    // legs (rect from hip y=40 down to each foot, so they connect as feet move)
    g.fillStyle(0x4a5b8a, 1);
    g.fillRoundedRect(f.lf[0] - 3, 40 + dy, 7, f.lf[1] - (40 + dy), 3);
    g.fillRoundedRect(f.rf[0] - 3, 40 + dy, 7, f.rf[1] - (40 + dy), 3);
    // shoes
    g.fillStyle(0x37343f, 1);
    g.fillRoundedRect(f.lf[0] - 5, f.lf[1], 11, 6, 3);
    g.fillRoundedRect(f.rf[0] - 5, f.rf[1], 11, 6, 3);
    // torso (bright shirt) with soft outline
    g.fillStyle(0x4fb3c9, 1);
    g.fillRoundedRect(10, 22 + dy, 24, 24, 8);
    g.lineStyle(2, 0x2f8aa0, 0.5);
    g.strokeRoundedRect(10, 22 + dy, 24, 24, 8);
    // arms (swing)
    g.fillStyle(0x4fb3c9, 1);
    g.fillRoundedRect(5 + f.arm, 24 + dy, 7, 18, 3);
    g.fillRoundedRect(32 - f.arm, 24 + dy, 7, 18, 3);
    // hands
    g.fillStyle(0xf0c0a0, 1);
    g.fillCircle(8 + f.arm, 42 + dy, 3.5);
    g.fillCircle(36 - f.arm, 42 + dy, 3.5);
    // head + soft outline
    g.fillStyle(0xf0c0a0, 1);
    g.fillCircle(22, 14 + dy, 11);
    g.lineStyle(1.5, 0xcf9b78, 0.5);
    g.strokeCircle(22, 14 + dy, 11);
    // hair
    g.fillStyle(0x6a4a2c, 1);
    g.fillRoundedRect(12, 4 + dy, 20, 9, 5);
    // eyes
    g.fillStyle(0x36281f, 1);
    g.fillCircle(18, 14 + dy, 1.9);
    g.fillCircle(26, 14 + dy, 1.9);
    g.generateTexture(key, 44, 64);
    g.destroy();
  }

  makeCheese() {
    const g = this.gfx();
    g.fillStyle(0xe0a020, 1);
    g.fillTriangle(3, 22, 27, 22, 27, 5);
    g.fillStyle(0xffd24a, 1);
    g.fillTriangle(5, 20, 25, 20, 25, 8);
    g.lineStyle(1.5, 0xfff3a0, 0.9);
    g.strokeTriangle(5, 20, 25, 20, 25, 8);
    g.fillStyle(0xe0a020, 1);
    g.fillCircle(18, 16, 2.4);
    g.fillCircle(22, 11, 1.7);
    g.fillCircle(14, 18, 1.5);
    g.generateTexture('cheese', 30, 26);
    g.destroy();
  }

  makeTrap() {
    const g = this.gfx();
    g.fillStyle(0x3a2a18, 1);
    g.fillRoundedRect(4, 8, 28, 22, 4);
    g.lineStyle(1.5, 0xff1a5e, 0.8);
    g.strokeRoundedRect(4, 8, 28, 22, 4);
    g.fillStyle(0x2a1c10, 1);
    g.fillRoundedRect(7, 11, 22, 16, 3);
    g.fillStyle(0xffd24a, 1);
    g.fillCircle(18, 19, 4);
    g.lineStyle(3, 0xe6eaf0, 1);
    g.beginPath();
    g.moveTo(6, 10);
    g.lineTo(30, 13);
    g.strokePath();
    g.fillStyle(0xb7bcc4, 1);
    g.fillCircle(8, 11, 3);
    g.fillCircle(28, 13, 3);
    g.generateTexture('trap', 36, 36);
    g.destroy();
  }

  makeDonut() {
    const g = this.gfx();
    g.lineStyle(11, 0x5a3420, 1);
    g.strokeCircle(16, 16, 9);
    g.lineStyle(8, 0xff7ad0, 1);
    g.strokeCircle(16, 16, 9);
    g.lineStyle(2, 0xffd0ee, 0.8);
    g.strokeCircle(16, 16, 12.5);
    const sprinkle = (x1, y1, x2, y2, color) => {
      g.lineStyle(2.5, color, 1);
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.strokePath();
    };
    sprinkle(10, 9, 12, 7, 0x6cf0ff);
    sprinkle(22, 8, 24, 10, 0x9dff6b);
    sprinkle(25, 18, 23, 20, 0xfff36b);
    sprinkle(9, 19, 11, 21, 0xff6b6b);
    sprinkle(15, 6, 16, 8, 0xc78fff);
    g.generateTexture('donut', 32, 32);
    g.destroy();
  }

  makeHeart() {
    const g = this.gfx();
    g.fillStyle(0xff2b6e, 1);
    g.fillCircle(9, 10, 7);
    g.fillCircle(21, 10, 7);
    g.fillTriangle(2, 12, 28, 12, 15, 26);
    g.lineStyle(1.5, 0xff9ec3, 0.9);
    g.strokeCircle(9, 10, 7);
    g.strokeCircle(21, 10, 7);
    g.fillStyle(0xffb3cb, 1);
    g.fillCircle(7, 8, 2.5);
    g.generateTexture('heart', 30, 28);
    g.destroy();
  }

  // Isometric wall cube: dark faces with neon rim edges.
  makeWallCube() {
    const g = this.gfx();
    const w = 2 * ISO_W;
    const top = [
      { x: ISO_W, y: 0 },
      { x: 2 * ISO_W, y: ISO_H },
      { x: ISO_W, y: 2 * ISO_H },
      { x: 0, y: ISO_H },
    ];
    const left = [
      { x: 0, y: ISO_H },
      { x: ISO_W, y: 2 * ISO_H },
      { x: ISO_W, y: 2 * ISO_H + WALL_H },
      { x: 0, y: ISO_H + WALL_H },
    ];
    const right = [
      { x: ISO_W, y: 2 * ISO_H },
      { x: 2 * ISO_W, y: ISO_H },
      { x: 2 * ISO_W, y: ISO_H + WALL_H },
      { x: ISO_W, y: 2 * ISO_H + WALL_H },
    ];
    g.fillStyle(COLORS.wallLeft, 1);
    g.fillPoints(left, true);
    g.fillStyle(COLORS.wallRight, 1);
    g.fillPoints(right, true);
    g.fillStyle(COLORS.wallTop, 1);
    g.fillPoints(top, true);

    // soft edges
    g.lineStyle(2, COLORS.wallRimTop, 0.45);
    g.strokePoints(top, true);
    g.lineStyle(1.5, COLORS.wallRimSide, 0.35);
    g.beginPath();
    g.moveTo(0, ISO_H);
    g.lineTo(0, ISO_H + WALL_H);
    g.moveTo(ISO_W, 2 * ISO_H);
    g.lineTo(ISO_W, 2 * ISO_H + WALL_H);
    g.moveTo(2 * ISO_W, ISO_H);
    g.lineTo(2 * ISO_W, ISO_H + WALL_H);
    g.strokePath();

    g.generateTexture('wallcube', w, 2 * ISO_H + WALL_H);
    g.destroy();
  }

  // ---- furniture --------------------------------------------------------
  // Each piece is an isometric block (top + two side faces) of a given height,
  // plus a little detailing so you can tell what it is (Minecraft-style).

  // Draws the block; returns {topY, baseY, topCenter} for placing details.
  isoBox(g, h, cTop, cLeft, cRight) {
    const baseY = F_BASEY;
    const topY = baseY - h;
    const top = [
      { x: ISO_W, y: topY - ISO_H },
      { x: 2 * ISO_W, y: topY },
      { x: ISO_W, y: topY + ISO_H },
      { x: 0, y: topY },
    ];
    const left = [
      { x: 0, y: topY },
      { x: ISO_W, y: topY + ISO_H },
      { x: ISO_W, y: baseY + ISO_H },
      { x: 0, y: baseY },
    ];
    const right = [
      { x: ISO_W, y: topY + ISO_H },
      { x: 2 * ISO_W, y: topY },
      { x: 2 * ISO_W, y: baseY },
      { x: ISO_W, y: baseY + ISO_H },
    ];
    g.fillStyle(cLeft, 1);
    g.fillPoints(left, true);
    g.fillStyle(cRight, 1);
    g.fillPoints(right, true);
    g.fillStyle(cTop, 1);
    g.fillPoints(top, true);
    g.lineStyle(1, 0x000000, 0.12);
    g.strokePoints(top, true);
    return { topY, baseY, topCenter: { x: ISO_W, y: topY } };
  }

  // A point on the top face, tile-fraction (fx,fy) in [-0.5, 0.5] from centre.
  fTop(box, fx, fy) {
    const t = box.topCenter;
    return { x: t.x + (fx - fy) * ISO_W, y: t.y + (fx + fy) * ISO_H };
  }

  // A point on the right (front) face, a = across [0,1], b = down [0,1].
  fRight(box, a, b) {
    const h = box.baseY - box.topY;
    return { x: ISO_W + a * ISO_W, y: box.topY + ISO_H - a * ISO_H + b * h };
  }

  // A smaller diamond inset on the top face (scale s).
  fInset(box, s) {
    const t = box.topCenter;
    return [
      { x: t.x, y: t.y - ISO_H * s },
      { x: t.x + ISO_W * s, y: t.y },
      { x: t.x, y: t.y + ISO_H * s },
      { x: t.x - ISO_W * s, y: t.y },
    ];
  }

  // A rectangle on the front face between across-range [a0,a1] and down [b0,b1].
  fFaceRect(box, a0, a1, b0, b1) {
    return [this.fRight(box, a0, b0), this.fRight(box, a1, b0), this.fRight(box, a1, b1), this.fRight(box, a0, b1)];
  }

  fLine(g, p1, p2, width, color, alpha = 1) {
    g.lineStyle(width, color, alpha);
    g.beginPath();
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.strokePath();
  }

  furnBox(key, h, top, left, right, dec) {
    const g = this.gfx();
    const box = this.isoBox(g, h, top, left, right);
    if (dec) dec(g, box);
    g.generateTexture(`furn_${key}`, F_W, F_H);
    g.destroy();
  }

  makeFurniture() {
    // bed
    this.furnBox('bed', 14, 0x6f9fd6, 0x8a5a36, 0x6f4628, (g, b) => {
      g.fillStyle(0x86b2e0, 1);
      g.fillPoints(this.fInset(b, 0.82), true);
      const p = this.fTop(b, -0.22, -0.22);
      g.fillStyle(0xffffff, 1);
      g.fillEllipse(p.x, p.y, 16, 9);
    });

    // table
    this.furnBox('table', 16, 0xc08a4f, 0x8a5e34, 0x6f4a28, (g, b) => {
      g.fillStyle(0xa9763f, 1);
      g.fillPoints(this.fInset(b, 0.8), true);
    });

    // couch
    this.furnBox('couch', 18, 0xd66a7a, 0xb04a5a, 0x923a48, (g, b) => {
      g.fillStyle(0xe88494, 1);
      g.fillPoints(this.fInset(b, 0.78), true);
      this.fLine(g, this.fTop(b, 0, -0.4), this.fTop(b, 0, 0.4), 2, 0xb04a5a, 0.8);
    });

    // tv (low cabinet + upright screen)
    this.furnBox('tv', 12, 0x9c6b3f, 0x7d5430, 0x634326, (g, b) => {
      const t = b.topCenter;
      g.fillStyle(0x33373d, 1);
      g.fillRect(t.x - 3, t.y - 7, 6, 7);
      g.fillStyle(0x1c2026, 1);
      g.fillRoundedRect(t.x - 16, t.y - 27, 32, 22, 3);
      g.fillStyle(0x2a3a4a, 1);
      g.fillRoundedRect(t.x - 13, t.y - 24, 26, 16, 2);
      g.fillStyle(0x5a7a9a, 0.5);
      g.fillTriangle(t.x - 11, t.y - 22, t.x - 2, t.y - 22, t.x - 11, t.y - 11);
    });

    // nightstand
    this.furnBox('nightstand', 14, 0xb07c46, 0x8a5e34, 0x6f4a28, (g, b) => {
      g.lineStyle(1.5, 0x5a3e22, 0.7);
      g.strokePoints(this.fFaceRect(b, 0.18, 0.82, 0.2, 0.6), true);
      const k = this.fRight(b, 0.5, 0.4);
      g.fillStyle(0x3a2a1a, 1);
      g.fillCircle(k.x, k.y, 1.8);
    });

    // dresser
    this.furnBox('dresser', 20, 0xb07c46, 0x8a5e34, 0x6f4a28, (g, b) => {
      for (let i = 0; i < 3; i++) {
        const b0 = 0.12 + i * 0.27;
        g.lineStyle(1.5, 0x5a3e22, 0.7);
        g.strokePoints(this.fFaceRect(b, 0.16, 0.84, b0, b0 + 0.2), true);
        const k = this.fRight(b, 0.5, b0 + 0.1);
        g.fillStyle(0x3a2a1a, 1);
        g.fillCircle(k.x, k.y, 1.5);
      }
    });

    // wardrobe (tall)
    this.furnBox('wardrobe', 40, 0x9c6b3f, 0x7d5430, 0x634326, (g, b) => {
      this.fLine(g, this.fRight(b, 0.5, 0.06), this.fRight(b, 0.5, 0.94), 2, 0x4a3220, 0.8);
      const k1 = this.fRight(b, 0.42, 0.5);
      const k2 = this.fRight(b, 0.58, 0.5);
      g.fillStyle(0x2a1c10, 1);
      g.fillCircle(k1.x, k1.y, 1.6);
      g.fillCircle(k2.x, k2.y, 1.6);
    });

    // fridge (tall steel)
    this.furnBox('fridge', 42, 0xeef1f4, 0xcfd6dc, 0xb4bcc4, (g, b) => {
      g.lineStyle(2, 0x9aa2aa, 0.9);
      g.strokePoints(this.fFaceRect(b, 0.08, 0.92, 0.06, 0.94), true);
      this.fLine(g, this.fRight(b, 0.1, 0.4), this.fRight(b, 0.9, 0.4), 2, 0x9aa2aa, 0.9);
      this.fLine(g, this.fRight(b, 0.78, 0.12), this.fRight(b, 0.78, 0.32), 2.5, 0x9098a0, 1);
      this.fLine(g, this.fRight(b, 0.78, 0.52), this.fRight(b, 0.78, 0.84), 2.5, 0x9098a0, 1);
    });

    // oven / stove
    this.furnBox('oven', 24, 0x80858e, 0x5c6068, 0x474b52, (g, b) => {
      for (const [fx, fy] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) {
        const p = this.fTop(b, fx, fy);
        g.fillStyle(0x2a2d33, 1);
        g.fillCircle(p.x, p.y, 3.4);
        g.fillStyle(0x44484f, 1);
        g.fillCircle(p.x, p.y, 1.8);
      }
      g.fillStyle(0x2c2f35, 1);
      g.fillPoints(this.fFaceRect(b, 0.16, 0.84, 0.34, 0.86), true);
      this.fLine(g, this.fRight(b, 0.2, 0.3), this.fRight(b, 0.8, 0.3), 2.5, 0xc0c4ca, 1);
    });

    // counter (stone top + cabinet)
    this.furnBox('counter', 24, 0xdfe3e8, 0x9c6b3f, 0x7d5430, (g, b) => {
      g.fillStyle(0xeef1f4, 1);
      g.fillPoints(this.fInset(b, 0.82), true);
      this.fLine(g, this.fRight(b, 0.5, 0.12), this.fRight(b, 0.5, 0.9), 1.5, 0x5a3e22, 0.6);
      const k1 = this.fRight(b, 0.4, 0.5);
      const k2 = this.fRight(b, 0.6, 0.5);
      g.fillStyle(0x3a2a1a, 1);
      g.fillCircle(k1.x, k1.y, 1.6);
      g.fillCircle(k2.x, k2.y, 1.6);
    });

    // bookshelf (tall, books on front)
    this.furnBox('bookshelf', 40, 0x8a5e34, 0x7d5430, 0x634326, (g, b) => {
      const cols = [0xd0566a, 0x6f9fd6, 0xe0b24a, 0x6fbf7a, 0xd07a5a];
      for (let s = 0; s < 3; s++) {
        for (let bk = 0; bk < 4; bk++) {
          const a = 0.14 + bk * 0.18;
          const b0 = 0.1 + s * 0.27;
          g.fillStyle(cols[(s * 4 + bk) % cols.length], 1);
          g.fillPoints(this.fFaceRect(b, a, a + 0.12, b0, b0 + 0.18), true);
        }
      }
      for (let i = 1; i < 4; i++) {
        const yy = i * 0.27 + 0.01;
        this.fLine(g, this.fRight(b, 0.08, yy), this.fRight(b, 0.92, yy), 1.5, 0x4a3220, 0.8);
      }
    });

    // sink
    this.furnBox('sink', 20, 0xeef2f4, 0xcdd5da, 0xb2bbc1, (g, b) => {
      const t = b.topCenter;
      g.fillStyle(0xcdd5da, 1);
      g.fillEllipse(t.x, t.y, 22, 12);
      g.fillStyle(0xb2bbc1, 1);
      g.fillEllipse(t.x, t.y, 15, 8);
      const fp = this.fTop(b, -0.3, -0.3);
      g.fillStyle(0x9098a0, 1);
      g.fillRect(fp.x - 1.5, fp.y - 6, 3, 7);
    });

    // bathtub
    this.furnBox('bathtub', 13, 0xeef4f6, 0xd2dadf, 0xb8c1c7, (g, b) => {
      const t = b.topCenter;
      g.fillStyle(0xd2dadf, 1);
      g.fillPoints(this.fInset(b, 0.86), true);
      g.fillStyle(0xbfe0ec, 1);
      g.fillEllipse(t.x, t.y, 24, 13);
      const fp = this.fTop(b, 0.34, 0.34);
      g.fillStyle(0x9098a0, 1);
      g.fillRect(fp.x - 1.5, fp.y - 5, 3, 6);
    });

    // toilet
    this.furnBox('toilet', 18, 0xf2f5f7, 0xd8dee2, 0xc0c8ce, (g, b) => {
      const t = b.topCenter;
      const tk = this.fTop(b, -0.32, -0.32);
      g.fillStyle(0xeef1f4, 1);
      g.fillRect(tk.x - 9, tk.y - 9, 18, 10);
      g.fillStyle(0xdfe4e8, 1);
      g.fillEllipse(t.x, t.y + 2, 18, 11);
      g.fillStyle(0xc4ccd2, 1);
      g.fillEllipse(t.x, t.y + 2, 11, 7);
    });

    this.makeLamp();
    this.makePlant();
  }

  // Floor lamp: thin pole + glowing shade (not a box).
  makeLamp() {
    const g = this.gfx();
    const cx = ISO_W;
    // base
    g.fillStyle(0x5a4636, 1);
    g.fillEllipse(cx, F_BASEY + 2, 16, 8);
    // pole
    g.fillStyle(0x8a7355, 1);
    g.fillRect(cx - 2, F_BASEY - 42, 4, 44);
    // shade (trapezoid) + glow
    const sy = F_BASEY - 42;
    g.fillStyle(0xfff2c8, 0.5);
    g.fillCircle(cx, sy + 4, 15);
    g.fillStyle(0xffe7a8, 1);
    g.fillPoints(
      [
        { x: cx - 11, y: sy + 12 },
        { x: cx + 11, y: sy + 12 },
        { x: cx + 6, y: sy - 3 },
        { x: cx - 6, y: sy - 3 },
      ],
      true
    );
    g.generateTexture('furn_lamp', F_W, F_H);
    g.destroy();
  }

  // Potted plant: terracotta pot + leafy foliage.
  makePlant() {
    const g = this.gfx();
    const box = this.isoBox(g, 11, 0xc46a3a, 0xa6562c, 0x8a4522);
    const t = box.topCenter;
    g.fillStyle(0x3f9a4a, 1);
    g.fillCircle(t.x, t.y - 10, 10);
    g.fillCircle(t.x - 7, t.y - 4, 7);
    g.fillCircle(t.x + 7, t.y - 5, 7);
    g.fillStyle(0x57b85f, 1);
    g.fillCircle(t.x - 2, t.y - 15, 6);
    g.fillCircle(t.x + 4, t.y - 11, 5);
    g.generateTexture('furn_plant', F_W, F_H);
    g.destroy();
  }
}

// Generates all sprite textures from vector shapes (no external image assets
// required), then hands off to the GameScene. Neon styling: dark bodies with
// glowing rim accents, plus a soft radial 'glow' texture used for lighting.

import { ISO_W, ISO_H, WALL_H, COLORS } from '../config.js';

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

  makeMouse() {
    const g = this.gfx();
    // tail
    g.lineStyle(4, 0xc98a6b, 1);
    g.beginPath();
    g.moveTo(24, 40);
    g.lineTo(34, 38);
    g.lineTo(36, 31);
    g.strokePath();
    // feet
    g.fillStyle(0xe7a9b6, 1);
    g.fillEllipse(15, 41, 8, 5);
    g.fillEllipse(25, 41, 8, 5);
    // ears (with magenta inner glow)
    g.fillStyle(0x3a2550, 1);
    g.fillCircle(10, 12, 8);
    g.fillCircle(30, 12, 8);
    g.fillStyle(0xff7ad0, 1);
    g.fillCircle(10, 12, 4);
    g.fillCircle(30, 12, 4);
    // body (dark) with cyan neon rim
    g.fillStyle(0x2a1b3d, 1);
    g.fillEllipse(20, 27, 30, 32);
    g.lineStyle(2, 0x00e5ff, 0.9);
    g.strokeEllipse(20, 27, 30, 32);
    // belly
    g.fillStyle(0x4a3568, 1);
    g.fillEllipse(20, 31, 16, 18);
    // backpack strap
    g.fillStyle(0xff2bd6, 1);
    g.fillRoundedRect(14, 20, 12, 6, 3);
    // glowing eyes + nose
    g.fillStyle(0x9af7ff, 1);
    g.fillCircle(15, 20, 2.8);
    g.fillCircle(25, 20, 2.8);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(15.6, 19.3, 1);
    g.fillCircle(25.6, 19.3, 1);
    g.fillStyle(0xff7ad0, 1);
    g.fillCircle(20, 25, 2.2);
    g.generateTexture('mouse', 40, 44);
    g.destroy();
  }

  makeHuman() {
    const g = this.gfx();
    // legs
    g.fillStyle(0x1a1330, 1);
    g.fillRoundedRect(13, 40, 7, 20, 3);
    g.fillRoundedRect(24, 40, 7, 20, 3);
    g.fillStyle(0x0c0820, 1);
    g.fillRoundedRect(11, 56, 11, 6, 3);
    g.fillRoundedRect(22, 56, 11, 6, 3);
    // torso (dark) with magenta neon rim
    g.fillStyle(0x2a1330, 1);
    g.fillRoundedRect(10, 22, 24, 24, 8);
    g.lineStyle(2, 0xff2bd6, 0.9);
    g.strokeRoundedRect(10, 22, 24, 24, 8);
    // arms
    g.fillStyle(0x2a1330, 1);
    g.fillRoundedRect(5, 24, 7, 18, 3);
    g.fillRoundedRect(32, 24, 7, 18, 3);
    // hands + head
    g.fillStyle(0x6b4a63, 1);
    g.fillCircle(8, 42, 3.5);
    g.fillCircle(36, 42, 3.5);
    g.fillStyle(0x7a5570, 1);
    g.fillCircle(22, 14, 11);
    g.lineStyle(1.5, 0xff2bd6, 0.6);
    g.strokeCircle(22, 14, 11);
    // hair
    g.fillStyle(0x241338, 1);
    g.fillRoundedRect(12, 4, 20, 9, 5);
    // eyes (faint red glow)
    g.fillStyle(0xff5079, 1);
    g.fillCircle(18, 14, 1.9);
    g.fillCircle(26, 14, 1.9);
    g.generateTexture('human', 44, 64);
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

    // neon rims
    g.lineStyle(2, COLORS.wallRimTop, 0.95);
    g.strokePoints(top, true);
    g.lineStyle(2, COLORS.wallRimSide, 0.7);
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
}

// Generates all sprite textures from vector shapes (no external image assets
// required), then hands off to the GameScene. Characters are drawn as upright
// billboards so they read well standing on the isometric floor.

import { ISO_W, ISO_H, WALL_H, COLORS } from '../config.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
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

  // Upright front-facing mouse (origin used at bottom-center when placed).
  makeMouse() {
    const g = this.gfx();
    // tail curling to the side
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
    // ears
    g.fillStyle(0x9a6a4d, 1);
    g.fillCircle(10, 12, 8);
    g.fillCircle(30, 12, 8);
    g.fillStyle(0xe7a9b6, 1);
    g.fillCircle(10, 12, 4);
    g.fillCircle(30, 12, 4);
    // body
    g.fillStyle(0xb07d5b, 1);
    g.fillEllipse(20, 27, 30, 32);
    // belly
    g.fillStyle(0xddb892, 1);
    g.fillEllipse(20, 31, 18, 20);
    // little red backpack strap
    g.fillStyle(0xd1503f, 1);
    g.fillRoundedRect(14, 20, 12, 7, 3);
    // eyes + nose
    g.fillStyle(0x2b2230, 1);
    g.fillCircle(15, 20, 2.6);
    g.fillCircle(25, 20, 2.6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(15.8, 19.2, 0.9);
    g.fillCircle(25.8, 19.2, 0.9);
    g.fillStyle(0xe0728a, 1);
    g.fillCircle(20, 25, 2.2);
    g.generateTexture('mouse', 40, 44);
    g.destroy();
  }

  makeHuman() {
    const g = this.gfx();
    g.fillStyle(0x3f5a78, 1);
    g.fillRoundedRect(13, 40, 7, 20, 3);
    g.fillRoundedRect(24, 40, 7, 20, 3);
    g.fillStyle(0x2c2c33, 1);
    g.fillRoundedRect(11, 56, 11, 6, 3);
    g.fillRoundedRect(22, 56, 11, 6, 3);
    g.fillStyle(0xd96a6a, 1);
    g.fillRoundedRect(10, 22, 24, 24, 8);
    g.fillRoundedRect(5, 24, 7, 18, 3);
    g.fillRoundedRect(32, 24, 7, 18, 3);
    g.fillStyle(0xf0c0a0, 1);
    g.fillCircle(8, 42, 3.5);
    g.fillCircle(36, 42, 3.5);
    g.fillCircle(22, 14, 11);
    g.fillStyle(0x5a3a22, 1);
    g.fillRoundedRect(12, 4, 20, 9, 5);
    g.fillStyle(0x2b2230, 1);
    g.fillCircle(18, 14, 1.8);
    g.fillCircle(26, 14, 1.8);
    g.generateTexture('human', 44, 64);
    g.destroy();
  }

  makeCheese() {
    const g = this.gfx();
    g.fillStyle(0xe0a020, 1);
    g.fillTriangle(3, 22, 27, 22, 27, 5);
    g.fillStyle(0xffd24a, 1);
    g.fillTriangle(5, 20, 25, 20, 25, 8);
    g.fillStyle(0xe0a020, 1);
    g.fillCircle(18, 16, 2.4);
    g.fillCircle(22, 11, 1.7);
    g.fillCircle(14, 18, 1.5);
    g.generateTexture('cheese', 30, 26);
    g.destroy();
  }

  makeTrap() {
    const g = this.gfx();
    g.fillStyle(0xb07a4a, 1);
    g.fillRoundedRect(4, 8, 28, 22, 4);
    g.fillStyle(0x8a5d34, 1);
    g.fillRoundedRect(7, 11, 22, 16, 3);
    g.fillStyle(0xffd24a, 1);
    g.fillCircle(18, 19, 4);
    g.lineStyle(3, 0xc2c7cc, 1);
    g.beginPath();
    g.moveTo(6, 10);
    g.lineTo(30, 13);
    g.strokePath();
    g.fillStyle(0x9aa0a6, 1);
    g.fillCircle(8, 11, 3);
    g.fillCircle(28, 13, 3);
    g.generateTexture('trap', 36, 36);
    g.destroy();
  }

  makeDonut() {
    const g = this.gfx();
    g.lineStyle(11, 0x7a4b2b, 1);
    g.strokeCircle(16, 16, 9);
    g.lineStyle(8, 0xff9ec7, 1);
    g.strokeCircle(16, 16, 9);
    const sprinkle = (x1, y1, x2, y2, color) => {
      g.lineStyle(2.5, color, 1);
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.strokePath();
    };
    sprinkle(10, 9, 12, 7, 0x6cc6ff);
    sprinkle(22, 8, 24, 10, 0x8fe07a);
    sprinkle(25, 18, 23, 20, 0xfff36b);
    sprinkle(9, 19, 11, 21, 0xff6b6b);
    sprinkle(15, 6, 16, 8, 0xb98fff);
    g.generateTexture('donut', 32, 32);
    g.destroy();
  }

  makeHeart() {
    const g = this.gfx();
    g.fillStyle(0xff5a6e, 1);
    g.fillCircle(9, 10, 7);
    g.fillCircle(21, 10, 7);
    g.fillTriangle(2, 12, 28, 12, 15, 26);
    g.fillStyle(0xff8a98, 1);
    g.fillCircle(7, 8, 2.5);
    g.generateTexture('heart', 30, 28);
    g.destroy();
  }

  // An isometric wall cube: top diamond + two shaded side faces. The texture's
  // anchor (see GameScene) places the cube's base on a floor tile.
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
    g.lineStyle(1.5, COLORS.wallEdge, 0.5);
    g.strokePoints(top, true);
    g.generateTexture('wallcube', w, 2 * ISO_H + WALL_H);
    g.destroy();
  }
}

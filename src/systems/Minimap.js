// Circular minimap in the bottom-right corner, drawn each frame from live
// entity references shared via the registry.

import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';

export default class Minimap {
  constructor(scene) {
    this.scene = scene;
    this.radius = 58;
    this.cx = GAME_WIDTH - this.radius - 18;
    this.cy = GAME_HEIGHT - this.radius - 18;

    this.dots = scene.add.graphics().setScrollFactor(0).setDepth(51);
    this.frame = scene.add.graphics().setScrollFactor(0).setDepth(52);

    // Clip everything to a circle.
    const maskShape = scene.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillCircle(this.cx, this.cy, this.radius);
    this.dots.setMask(maskShape.createGeometryMask());
  }

  draw(refs, bounds) {
    const g = this.dots;
    g.clear();
    if (!refs || !bounds) return;

    // backdrop
    g.fillStyle(0x352e3d, 0.92);
    g.fillCircle(this.cx, this.cy, this.radius);

    const sx = (this.radius * 2) / bounds.w;
    const sy = (this.radius * 2) / bounds.h;
    const map = (x, y) => ({
      x: this.cx - this.radius + x * sx,
      y: this.cy - this.radius + y * sy,
    });

    const each = (group, fn) => {
      if (!group) return;
      group.children.iterate((c) => {
        if (c && c.active) fn(c);
        return true;
      });
    };

    // cheese
    g.fillStyle(0xffd24a, 1);
    each(refs.cheese, (c) => {
      const p = map(c.x, c.y);
      g.fillCircle(p.x, p.y, 2.2);
    });

    // traps
    g.fillStyle(0x9aa0a6, 1);
    each(refs.traps, (c) => {
      const p = map(c.x, c.y);
      g.fillRect(p.x - 2, p.y - 2, 4, 4);
    });

    // power-ups
    g.fillStyle(0xff9ec7, 1);
    each(refs.powers, (c) => {
      const p = map(c.x, c.y);
      g.fillCircle(p.x, p.y, 2.6);
    });

    // humans
    g.fillStyle(0xff4040, 1);
    (refs.humans || []).forEach((h) => {
      if (h && h.active) {
        const p = map(h.x, h.y);
        g.fillCircle(p.x, p.y, 3);
      }
    });

    // player
    if (refs.player && refs.player.active) {
      const p = map(refs.player.x, refs.player.y);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(p.x, p.y, 3.4);
      g.lineStyle(1.5, 0x2b2230, 1);
      g.strokeCircle(p.x, p.y, 3.4);
    }

    // ring frame
    this.frame.clear();
    this.frame.lineStyle(4, 0xffffff, 0.9);
    this.frame.strokeCircle(this.cx, this.cy, this.radius);
    this.frame.lineStyle(2, 0x000000, 0.25);
    this.frame.strokeCircle(this.cx, this.cy, this.radius + 2);
  }
}

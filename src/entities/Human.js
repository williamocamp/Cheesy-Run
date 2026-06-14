// A patrolling human enemy. Movement, facing and vision are all computed in
// flat world space; the billboard view and the floor-projected vision cone are
// rendered in isometric space.

import { TILE } from '../config.js';
import { isoPos, isoDepth } from '../systems/iso.js';

export default class Human {
  constructor(scene, route, speed) {
    this.scene = scene;
    this.route = route;
    this.idx = 0;
    this.speed = speed;
    this.detected = false;
    this.fov = Phaser.Math.DegToRad(33);
    this.range = 6.2 * TILE;
    this.turnSpeed = 3.4; // radians/sec — how fast they pivot

    // Start already facing along the first leg so they don't spin on spawn.
    const a = route[0];
    const b = route[1 % route.length];
    this.facing = Math.atan2(b.y - a.y, b.x - a.x);

    this.phys = scene.physics.add.image(route[0].x, route[0].y, 'human').setVisible(false);
    this.phys.body.setSize(22, 18);
    this.phys.setImmovable(true);
    this.phys.parentEntity = this;

    this.shadow = scene.add.ellipse(0, 0, 34, 16, 0x000000, 0.22);
    this.view = scene.add.image(0, 0, 'human').setOrigin(0.5, 0.95);
    this.cone = scene.add.graphics();
    this.cone.setDepth(-1000); // floor decal: above floor, below props/entities
    this.cone.setBlendMode(Phaser.BlendModes.ADD); // glowing neon light on the floor
    this.sync();
  }

  get x() { return this.phys.x; }
  get y() { return this.phys.y; }
  get active() { return this.phys.active; }

  patrol(scene, delta) {
    let target = this.route[this.idx];
    if (Phaser.Math.Distance.Between(this.phys.x, this.phys.y, target.x, target.y) < 6) {
      this.idx = (this.idx + 1) % this.route.length;
      target = this.route[this.idx];
    }

    // Smoothly rotate toward the target heading instead of snapping.
    const targetFacing = Math.atan2(target.y - this.phys.y, target.x - this.phys.x);
    const step = this.turnSpeed * ((delta || 16) / 1000);
    this.facing = Phaser.Math.Angle.RotateTo(this.facing, targetFacing, step);

    // If we still have a sharp turn to make, pivot in place; otherwise walk.
    const diff = Math.abs(Phaser.Math.Angle.Wrap(targetFacing - this.facing));
    if (diff > 0.35) {
      this.phys.setVelocity(0, 0);
    } else {
      scene.physics.moveTo(this.phys, target.x, target.y, this.speed);
    }
  }

  canSee(player, losClear) {
    const dx = player.x - this.phys.x;
    const dy = player.y - this.phys.y;
    const dist = Math.hypot(dx, dy);
    if (dist > this.range) return false;
    const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - this.facing);
    if (Math.abs(diff) > this.fov) return false;
    return losClear(this.phys.x, this.phys.y, player.x, player.y);
  }

  drawCone(isWall) {
    const g = this.cone;
    g.clear();
    const color = this.detected ? 0xff5079 : 0xff1a5e;
    const alpha = this.detected ? 0.4 : 0.2;
    g.fillStyle(color, alpha);
    g.lineStyle(2, color, 0.4);

    const apex = isoPos(this.phys.x, this.phys.y);
    const segs = 22;
    const pts = [{ x: apex.x, y: apex.y }];
    for (let i = 0; i <= segs; i++) {
      const a = this.facing - this.fov + (2 * this.fov) * (i / segs);
      const d = this.castRay(a, isWall);
      const wx = this.phys.x + Math.cos(a) * d;
      const wy = this.phys.y + Math.sin(a) * d;
      pts.push(isoPos(wx, wy));
    }
    g.fillPoints(pts, true);
    g.strokePoints(pts, true);
  }

  // March outward (in world space) until a wall blocks the ray.
  castRay(angle, isWall) {
    const step = 6;
    let d = step;
    while (d < this.range) {
      const x = this.phys.x + Math.cos(angle) * d;
      const y = this.phys.y + Math.sin(angle) * d;
      if (isWall(x, y)) return d;
      d += step;
    }
    return this.range;
  }

  sync() {
    const p = isoPos(this.phys.x, this.phys.y);
    const depth = isoDepth(this.phys.x, this.phys.y);
    this.view.setPosition(p.x, p.y);
    this.view.setFlipX(Math.cos(this.facing) < 0);
    this.view.setDepth(depth + 0.5);
    this.shadow.setPosition(p.x, p.y + 1);
    this.shadow.setDepth(depth + 0.05);
  }

  destroy() {
    this.cone.destroy();
    this.view.destroy();
    this.shadow.destroy();
    this.phys.destroy();
  }
}

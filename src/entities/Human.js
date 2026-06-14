// A patrolling human enemy with a red vision cone that respects walls.

import { TILE } from '../config.js';

export default class Human extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, route, speed) {
    super(scene, route[0].x, route[0].y, 'human');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(8);
    this.setImmovable(true);
    this.body.setSize(24, 28);
    this.body.setOffset(10, 30);

    this.route = route;
    this.idx = 0;
    this.speed = speed;
    this.facing = 0;
    this.detected = false;
    this.fov = Phaser.Math.DegToRad(33);
    this.range = 6.2 * TILE;

    this.cone = scene.add.graphics();
    this.cone.setDepth(6);
  }

  // Walk toward the current waypoint; advance when reached.
  patrol(scene) {
    let target = this.route[this.idx];
    if (Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) < 5) {
      this.idx = (this.idx + 1) % this.route.length;
      target = this.route[this.idx];
    }
    this.facing = Math.atan2(target.y - this.y, target.x - this.x);
    scene.physics.moveTo(this, target.x, target.y, this.speed);
  }

  // True if the player is inside the cone AND has line of sight.
  canSee(player, losClear) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > this.range) return false;

    const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - this.facing);
    if (Math.abs(diff) > this.fov) return false;

    return losClear(this.x, this.y, player.x, player.y);
  }

  drawCone(isWall) {
    const g = this.cone;
    g.clear();
    const color = this.detected ? 0xff2e2e : 0xff5d5d;
    const alpha = this.detected ? 0.32 : 0.16;
    g.fillStyle(color, alpha);
    g.lineStyle(2, color, 0.4);

    const segs = 20;
    g.beginPath();
    g.moveTo(this.x, this.y);
    for (let i = 0; i <= segs; i++) {
      const a = this.facing - this.fov + (2 * this.fov) * (i / segs);
      const d = this.castRay(a, isWall);
      g.lineTo(this.x + Math.cos(a) * d, this.y + Math.sin(a) * d);
    }
    g.closePath();
    g.fillPath();
    g.strokePath();
  }

  // March outward until a wall is hit, so the cone is clipped by geometry.
  castRay(angle, isWall) {
    const step = 6;
    let d = step;
    while (d < this.range) {
      const x = this.x + Math.cos(angle) * d;
      const y = this.y + Math.sin(angle) * d;
      if (isWall(x, y)) return d;
      d += step;
    }
    return this.range;
  }

  destroy(fromScene) {
    if (this.cone) this.cone.destroy();
    super.destroy(fromScene);
  }
}

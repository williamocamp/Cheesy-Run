// The mouse. Physics body lives in flat world space; the billboard view is
// projected into isometric space each frame.

import { isoPos, isoDepth, screenToWorldDir } from '../systems/iso.js';

export default class Player {
  constructor(scene, wx, wy) {
    this.scene = scene;
    this.speed = 168;
    this.invuln = false;
    this.faceLeft = false;
    this.moving = false;

    this.phys = scene.physics.add.image(wx, wy, 'mouse').setVisible(false);
    this.phys.body.setSize(20, 16);
    this.phys.setCollideWorldBounds(true);
    this.phys.parentEntity = this;

    this.shadow = scene.add.ellipse(0, 0, 26, 13, 0x000000, 0.22);
    this.view = scene.add.sprite(0, 0, 'mouse').setOrigin(0.5, 0.92);
    this.sync();
  }

  get x() { return this.phys.x; }
  get y() { return this.phys.y; }
  get active() { return this.phys.active; }

  move(cursors, keys) {
    let sx = 0;
    let sy = 0;
    if (cursors.left.isDown || keys.A.isDown) sx -= 1;
    if (cursors.right.isDown || keys.D.isDown) sx += 1;
    if (cursors.up.isDown || keys.W.isDown) sy -= 1;
    if (cursors.down.isDown || keys.S.isDown) sy += 1;

    if (sx === 0 && sy === 0) {
      this.phys.setVelocity(0, 0);
    } else {
      const d = screenToWorldDir(sx, sy);
      const len = Math.hypot(d.x, d.y) || 1;
      this.phys.setVelocity((d.x / len) * this.speed, (d.y / len) * this.speed);
    }
    if (sx < 0) this.faceLeft = true;
    else if (sx > 0) this.faceLeft = false;
    this.moving = sx !== 0 || sy !== 0;
  }

  sync() {
    const p = isoPos(this.phys.x, this.phys.y);
    const depth = isoDepth(this.phys.x, this.phys.y);
    this.view.setPosition(p.x, p.y);
    this.view.setFlipX(this.faceLeft);
    this.view.setDepth(depth + 0.5);
    if (this.moving) this.view.play('mouse-walk', true);
    else if (this.view.anims.isPlaying) {
      this.view.stop();
      this.view.setTexture('mouse');
    }
    this.shadow.setPosition(p.x, p.y + 1);
    this.shadow.setDepth(depth + 0.05);
    this.shadow.setVisible(this.view.visible);
  }

  destroy() {
    this.view.destroy();
    this.shadow.destroy();
    this.phys.destroy();
  }
}

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

    // Dash (space bar): a short burst in the current heading, then a cooldown.
    this.dashSpeed = 470;
    this.dashDuration = 150; // ms of burst
    this.dashCooldownMax = 650; // ms before you can dash again
    this.dashTime = 0;
    this.dashCooldown = 0;
    this.dashing = false;
    this.lastDir = { x: 1, y: 0 }; // world-space heading to dash if standing still
    this.ghostTick = 0;

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

  move(cursors, keys, delta) {
    if (this.dashCooldown > 0) this.dashCooldown = Math.max(0, this.dashCooldown - delta);

    let sx = 0;
    let sy = 0;
    if (cursors.left.isDown || keys.A.isDown) sx -= 1;
    if (cursors.right.isDown || keys.D.isDown) sx += 1;
    if (cursors.up.isDown || keys.W.isDown) sy -= 1;
    if (cursors.down.isDown || keys.S.isDown) sy += 1;

    if (sx < 0) this.faceLeft = true;
    else if (sx > 0) this.faceLeft = false;

    // Current heading in world space (remembered for dashing while idle).
    let dir = null;
    if (sx !== 0 || sy !== 0) {
      const d = screenToWorldDir(sx, sy);
      const len = Math.hypot(d.x, d.y) || 1;
      dir = { x: d.x / len, y: d.y / len };
      this.lastDir = dir;
    }

    // Trigger a dash.
    if (
      Phaser.Input.Keyboard.JustDown(cursors.space) &&
      !this.dashing &&
      this.dashCooldown <= 0
    ) {
      const dd = dir || this.lastDir;
      this.dashing = true;
      this.dashTime = this.dashDuration;
      this.dashCooldown = this.dashCooldownMax;
      this.phys.setVelocity(dd.x * this.dashSpeed, dd.y * this.dashSpeed);
      this.scene.cameras.main.flash(90, 120, 240, 255);
    }

    // While dashing, hold the burst velocity and leave a neon trail.
    if (this.dashing) {
      this.dashTime -= delta;
      this.spawnGhost();
      this.moving = true;
      if (this.dashTime <= 0) this.dashing = false;
      return;
    }

    if (dir) this.phys.setVelocity(dir.x * this.speed, dir.y * this.speed);
    else this.phys.setVelocity(0, 0);
    this.moving = dir !== null;
  }

  spawnGhost() {
    this.ghostTick += 1;
    if (this.ghostTick % 2 !== 0) return; // every other frame is plenty
    const ghost = this.scene.add
      .image(this.view.x, this.view.y, this.view.texture.key, this.view.frame.name)
      .setOrigin(0.5, 0.92)
      .setFlipX(this.faceLeft)
      .setTint(0x8af0ff)
      .setAlpha(0.5)
      .setDepth(this.view.depth - 0.01);
    this.scene.tweens.add({
      targets: ghost,
      alpha: 0,
      duration: 220,
      ease: 'Cubic.out',
      onComplete: () => ghost.destroy(),
    });
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

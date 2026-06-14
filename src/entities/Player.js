// The mouse. Moves with WASD / arrow keys via Arcade physics.

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'mouse');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    this.setCollideWorldBounds(true);
    this.body.setSize(20, 18);
    this.body.setOffset(10, 14);
    this.speed = 178;
    this.invuln = false;
  }

  move(cursors, keys) {
    let vx = 0;
    let vy = 0;
    if (cursors.left.isDown || keys.A.isDown) vx -= 1;
    if (cursors.right.isDown || keys.D.isDown) vx += 1;
    if (cursors.up.isDown || keys.W.isDown) vy -= 1;
    if (cursors.down.isDown || keys.S.isDown) vy += 1;

    const len = Math.hypot(vx, vy) || 1;
    this.setVelocity((vx / len) * this.speed, (vy / len) * this.speed);

    if (vx < 0) this.setFlipX(true);
    else if (vx > 0) this.setFlipX(false);
  }
}

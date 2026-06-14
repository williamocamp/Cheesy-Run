// Donut power-up. Grants one extra life when collected.

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'donut');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(4);
    this.body.setAllowGravity(false);
    this.body.setSize(26, 26);

    // Soft glow halo behind the donut.
    this.halo = scene.add.circle(x, y, 16, 0xffe39a, 0.35).setDepth(3);
    scene.tweens.add({
      targets: this.halo,
      scale: { from: 0.8, to: 1.25 },
      alpha: { from: 0.35, to: 0.1 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
    scene.tweens.add({
      targets: this,
      y: y - 4,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  destroy(fromScene) {
    if (this.halo) this.halo.destroy();
    super.destroy(fromScene);
  }
}

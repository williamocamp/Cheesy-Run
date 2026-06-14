// Collectible cheese wedge. Gently bobs to feel lively.

export default class Cheese extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'cheese');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(4);
    this.body.setAllowGravity(false);
    this.body.setSize(22, 20);
    scene.tweens.add({
      targets: this,
      y: y - 3,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }
}

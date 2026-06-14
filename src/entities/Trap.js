// Static mouse-trap hazard. Touching it costs a life.

export default class Trap extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'trap');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(4);
    this.setImmovable(true);
    this.body.setAllowGravity(false);
    this.body.setSize(26, 26);
    scene.tweens.add({
      targets: this,
      scale: { from: 1, to: 1.06 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }
}

// Collectible cheese wedge. Static, so it projects to iso once and just bobs.

import { isoPos, isoDepth } from '../systems/iso.js';

export default class Cheese {
  constructor(scene, wx, wy) {
    this.phys = scene.physics.add.image(wx, wy, 'cheese').setVisible(false);
    this.phys.body.setAllowGravity(false);
    this.phys.body.setSize(22, 20);
    this.phys.parentEntity = this;

    const p = isoPos(wx, wy);
    const depth = isoDepth(wx, wy);
    this.shadow = scene.add.ellipse(p.x, p.y + 1, 18, 9, 0x000000, 0.18).setDepth(depth + 0.05);
    this.view = scene.add.image(p.x, p.y, 'cheese').setOrigin(0.5, 0.9).setDepth(depth + 0.2);
    scene.tweens.add({
      targets: this.view,
      y: p.y - 5,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  get active() { return this.phys.active; }

  collect() {
    this.phys.disableBody(true, true);
    this.view.destroy();
    this.shadow.destroy();
  }
}

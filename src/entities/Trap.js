// Static mouse-trap hazard. Touching it costs a life. Sits flat on the floor.

import { isoPos, isoDepth } from '../systems/iso.js';

export default class Trap {
  constructor(scene, wx, wy) {
    this.phys = scene.physics.add.image(wx, wy, 'trap').setVisible(false);
    this.phys.body.setAllowGravity(false);
    this.phys.body.setSize(26, 26);
    this.phys.parentEntity = this;

    const p = isoPos(wx, wy);
    const depth = isoDepth(wx, wy);
    this.shadow = scene.add.ellipse(p.x, p.y + 1, 26, 13, 0x000000, 0.16).setDepth(depth + 0.05);
    this.view = scene.add.image(p.x, p.y, 'trap').setOrigin(0.5, 0.78).setDepth(depth + 0.2);
    scene.tweens.add({
      targets: this.view,
      scale: { from: 1, to: 1.06 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });
  }

  get active() { return this.phys.active; }
}

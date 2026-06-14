// Donut power-up. Grants one extra life. Hovers with a soft glow.

import { isoPos, isoDepth } from '../systems/iso.js';

export default class PowerUp {
  constructor(scene, wx, wy) {
    this.phys = scene.physics.add.image(wx, wy, 'donut').setVisible(false);
    this.phys.body.setAllowGravity(false);
    this.phys.body.setSize(26, 26);
    this.phys.parentEntity = this;

    const p = isoPos(wx, wy);
    const depth = isoDepth(wx, wy);
    this.shadow = scene.add.ellipse(p.x, p.y + 1, 20, 10, 0x000000, 0.16).setDepth(depth + 0.05);
    this.halo = scene.add.circle(p.x, p.y - 8, 16, 0xffe39a, 0.35).setDepth(depth + 0.15);
    this.view = scene.add.image(p.x, p.y, 'donut').setOrigin(0.5, 0.9).setDepth(depth + 0.2);

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
      targets: [this.view],
      y: p.y - 6,
      duration: 1000,
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
    this.halo.destroy();
  }
}

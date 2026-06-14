// Overlay scene: top-left HUD (cheese / lives / floor) + bottom-right minimap.
// Reads game state from the registry, so it survives GameScene restarts.

import { GAME_WIDTH, MAX_LIVES } from '../config.js';
import Minimap from '../systems/Minimap.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  create() {
    const font = { fontFamily: 'Arial, sans-serif' };

    // Cheese counter
    this.add.image(34, 30, 'cheese').setScrollFactor(0).setScale(1.15).setDepth(60);
    this.cheeseText = this.add
      .text(54, 18, '0/0', { ...font, fontSize: '24px', color: '#fff8e7', fontStyle: 'bold' })
      .setScrollFactor(0)
      .setDepth(60);

    // Lives (hearts)
    this.hearts = [];
    for (let i = 0; i < MAX_LIVES; i++) {
      const h = this.add
        .image(28 + i * 30, 60, 'heart')
        .setScrollFactor(0)
        .setDepth(60);
      this.hearts.push(h);
    }

    // Floor label
    this.floorText = this.add
      .text(18, 80, 'Floor 1', { ...font, fontSize: '18px', color: '#ffe0b0', fontStyle: 'bold' })
      .setScrollFactor(0)
      .setDepth(60);

    // Title
    this.add
      .text(GAME_WIDTH / 2, 16, 'Cheesy Run', {
        ...font,
        fontSize: '26px',
        color: '#fff8e7',
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(60);

    this.minimap = new Minimap(this);

    this.registry.events.on('changedata', this.refresh, this);
    this.events.once('shutdown', () => {
      this.registry.events.off('changedata', this.refresh, this);
    });

    this.refresh();
  }

  refresh() {
    const collected = this.registry.get('cheeseCollected') || 0;
    const total = this.registry.get('cheeseTotal') || 0;
    const lives = this.registry.get('lives') || 0;
    const floor = this.registry.get('floor') || 1;

    this.cheeseText.setText(`${collected}/${total}`);
    this.floorText.setText(`Floor ${floor}`);
    this.hearts.forEach((h, i) => h.setAlpha(i < lives ? 1 : 0.18));
  }

  update() {
    this.minimap.draw(this.registry.get('gameRefs'), this.registry.get('bounds'));
  }
}

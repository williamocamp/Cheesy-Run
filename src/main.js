// Phaser bootstrap. Phaser itself is loaded globally from the CDN in index.html.

import { GAME_WIDTH, GAME_HEIGHT, RENDER_SCALE } from './config.js';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  // High-res backing buffer; the cameras zoom by RENDER_SCALE so the view is
  // unchanged but drawn with more pixels. Scale.FIT then CSS-fits it crisply.
  width: GAME_WIDTH * RENDER_SCALE,
  height: GAME_HEIGHT * RENDER_SCALE,
  backgroundColor: '#bfe3f2',
  pixelArt: false,
  roundPixels: false,
  physics: {
    default: 'arcade',
    arcade: { debug: false, gravity: { x: 0, y: 0 } },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, GameScene, UIScene],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

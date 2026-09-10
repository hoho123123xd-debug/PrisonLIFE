import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#06090a',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  scene: [MainScene],
  // Inventory items are right-clicked to sell - the browser's native
  // context menu would otherwise pop up over the canvas every time.
  disableContextMenu: true,
});

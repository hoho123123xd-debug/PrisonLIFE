import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 800,
  backgroundColor: '#06090a',
  scene: [MainScene],
});

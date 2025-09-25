import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainScene } from './scenes/MainScene';

export function createGame(parent: string) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#000',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 480,
      height: 800,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: process.env.NODE_ENV === 'development', // 开发时开启debug
      },
    },
    scene: [BootScene, PreloadScene, MainScene],
  });
}

'use client';
import { useEffect } from 'react';
import Phaser from 'phaser';

export default function GamePage() {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 800,
      height: 600,
      scene: {
        preload: function (this: Phaser.Scene) {
          this.load.image('logo', '/assets/logo.png');
        },
        create: function (this: Phaser.Scene) {
          this.add.image(400, 300, 'logo');
        },
      },
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div id="game-container" style={{ width: '100vw', height: '100vh' }} />;
}

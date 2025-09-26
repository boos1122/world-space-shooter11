'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useEffect } from 'react';

export default function GamePage() {
  useEffect(() => {
    let game: import('phaser').Game | undefined;

    (async () => {
      const Phaser = (await import('phaser')).default;

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

      game = new Phaser.Game(config);
    })();

    return () => {
      if (game) game.destroy(true);
    };
  }, []);

  return <div id="game-container" style={{ width: '100vw', height: '100vh' }} />;
}

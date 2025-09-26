'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() { super('MainScene'); }

  preload() {
    this.load.image('logo', '/assets/logo.png');
  }

  create() {
    // 黑背景 + 标题
    this.cameras.main.setBackgroundColor('#000000');
    this.add.text(160, 200, '🚀 World Mini App - Space Shooter', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.add.image(400, 320, 'logo');
  }
}

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current || !hostRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: hostRef.current,
      backgroundColor: '#000000',
      physics: { default: 'arcade' },
      scene: [MainScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => { game.destroy(true); gameRef.current = null; };
  }, []);

  return <div ref={hostRef} style={{ margin:'0 auto', width:800, maxWidth:'100%' }} />;
}

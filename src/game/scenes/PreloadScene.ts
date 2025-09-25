import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // 显示加载进度条
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222);
    progressBox.fillRect(240 - 160, 270, 320, 50);

    const loadingText = this.add.text(240, 240, 'Loading...', {
      fontSize: '20px',
      color: '#FFF'
    }).setOrigin(0.5);

    const percentText = this.add.text(240, 295, '0%', {
      fontSize: '18px',
      color: '#FFF'
    }).setOrigin(0.5);

    // 加载游戏资源
    this.load.image('player', '/assets/images/player.png');
    this.load.image('enemy', '/assets/images/enemy.png');
    this.load.image('bullet', '/assets/images/bullet.png');
    this.load.audio('shoot', '/assets/sounds/shoot.mp3');
    this.load.audio('explosion', '/assets/sounds/explosion.mp3');

    // 更新进度条
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff);
      progressBar.fillRect(250, 280, 300 * value, 30);
      percentText.setText(Math.floor(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
  }

  create() {
    // 加载完成后跳转到主游戏场景
    this.scene.start('MainScene');
  }
}

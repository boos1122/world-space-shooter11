import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // 加载启动屏幕所需的最小资源
    this.load.image('logo', '/assets/images/logo.png');
  }

  create() {
    // 启动屏幕逻辑
    this.add.text(240, 400, 'World Space Shooter', {
      fontSize: '32px',
      color: '#FFF'
    }).setOrigin(0.5);

    // 自动跳转到预加载场景
    this.time.delayedCall(1000, () => {
      this.scene.start('PreloadScene');
    });
  }
}

import Phaser from 'phaser';
import { postScore } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { InputManager } from '../systems/input';
import { PhysicsManager } from '../systems/physics';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private lives = 3;
  private livesText!: Phaser.GameObjects.Text;
  private lastFired = 0;
  private isGameOver = false;
  private inputManager!: InputManager;
  private physicsManager!: PhysicsManager;

  constructor() {
    super('MainScene');
  }

  create() {
    // 初始化管理器
    this.inputManager = new InputManager(this);
    this.physicsManager = new PhysicsManager(this);

    // 玩家
    this.player = this.physics.add.sprite(240, 700, 'player').setCollideWorldBounds(true);

    // 子弹组
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 30,
    });

    // 敌人组
    this.enemies = this.physics.add.group();
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // 碰撞检测
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, undefined, this);

    // HUD - TODO: 应该通过React组件更新，这里暂时用Phaser文本
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', color: '#FFF' });
    this.livesText = this.add.text(350, 16, 'Lives: 3', { fontSize: '24px', color: '#FFF' });

    // 输入处理已在 InputManager 中设置
  }

  update(time: number) {
    if (this.isGameOver) return;
    
    // 处理玩家移动
    const input = this.inputManager.getState();
    const playerSpeed = 300;
    
    if (input.left || input.right || input.pointerX !== this.player.x) {
      // 键盘移动
      if (input.left && !input.right) {
        this.player.setVelocityX(-playerSpeed);
      } else if (input.right && !input.left) {
        this.player.setVelocityX(playerSpeed);
      } else {
        // 鼠标/触摸移动
        const targetX = input.pointerX;
        const diff = targetX - this.player.x;
        if (Math.abs(diff) > 5) {
          this.player.setVelocityX(diff > 0 ? playerSpeed : -playerSpeed);
        } else {
          this.player.setVelocityX(0);
        }
      }
    } else {
      this.player.setVelocityX(0);
    }

    // 保持玩家在屏幕边界内
    this.physicsManager.keepInBounds(this.player, this.player.width / 2);
    
    // 射击
    if (input.shoot && time > this.lastFired + 200) {
        this.shootBullet();
        this.lastFired = time;
    }

    // 回收屏幕外的子弹和敌人
    this.bullets.children.each((b) => {
      const bullet = b as Phaser.Physics.Arcade.Sprite;
      if (bullet.active && !this.physicsManager.isInBounds(bullet.x, bullet.y, 50)) {
        bullet.setActive(false).setVisible(false);
      }
    });
    this.enemies.children.each((e) => {
      const enemy = e as Phaser.Physics.Arcade.Sprite;
      if (enemy.active && enemy.y > this.scale.height + 50) {
        enemy.destroy();
        this.updateLives(-1);
      }
    });
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(50, 430);
    const enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(Phaser.Math.Between(100, 200));
  }

  shootBullet() {
    const bullet = this.bullets.get(this.player.x, this.player.y - 30);
    if (bullet) {
      bullet.setActive(true).setVisible(true);
      bullet.setVelocityY(-500);
    }
  }

  hitEnemy(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    bullet.setActive(false).setVisible(false);
    (bullet as Phaser.Physics.Arcade.Sprite).y = -100; // 移出屏幕
    enemy.destroy();
    this.updateScore(10);
  }

  hitPlayer(player: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    enemy.destroy();
    this.updateLives(-1);
  }

  updateScore(points: number) {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
    // TODO: 通过事件发射器通知React HUD
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
      scoreDisplay.innerText = this.score.toString();
    }
  }

  updateLives(change: number) {
    this.lives += change;
    this.livesText.setText(`Lives: ${this.lives}`);
    const livesDisplay = document.getElementById('lives-display');
    if (livesDisplay) {
      livesDisplay.innerText = this.lives.toString();
    }

    if (this.lives <= 0 && !this.isGameOver) {
      this.gameOver();
    }
  }

  async gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'GAME OVER', {
        fontSize: '48px',
        color: '#FFF'
    }).setOrigin(0.5);

    // 提交分数
    try {
      const idempotencyKey = uuidv4();
      await postScore({ score: this.score, idempotency_key: idempotencyKey });
      console.log('Score submitted successfully!');
    } catch (error) {
      console.error('Failed to submit score:', error);
      // TODO: 实现重试或错误提示逻辑
    }

    // 3秒后重启
    this.time.delayedCall(3000, () => {
        this.isGameOver = false;
        this.score = 0;
        this.lives = 3;
        this.scene.restart();
    });
  }
}

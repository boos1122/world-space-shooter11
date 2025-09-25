// 物理系统：处理碰撞检测和物理计算

export interface CollisionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class PhysicsManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // 检查两个矩形是否碰撞
  public checkRectCollision(rect1: CollisionBounds, rect2: CollisionBounds): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // 检查圆形碰撞
  public checkCircleCollision(
    x1: number, y1: number, radius1: number,
    x2: number, y2: number, radius2: number
  ): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius1 + radius2;
  }

  // 计算两点间距离
  public getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 计算两点间角度
  public getAngle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  // 将角度转换为方向向量
  public angleToVector(angle: number): { x: number; y: number } {
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  // 限制值在指定范围内
  public clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  // 线性插值
  public lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  // 检查对象是否在屏幕边界内
  public isInBounds(x: number, y: number, margin: number = 0): boolean {
    const { width, height } = this.scene.scale;
    return (
      x >= -margin &&
      x <= width + margin &&
      y >= -margin &&
      y <= height + margin
    );
  }

  // 将对象保持在屏幕边界内
  public keepInBounds(
    sprite: Phaser.Physics.Arcade.Sprite,
    margin: number = 0
  ): void {
    const { width, height } = this.scene.scale;
    
    if (sprite.x < margin) {
      sprite.x = margin;
    } else if (sprite.x > width - margin) {
      sprite.x = width - margin;
    }

    if (sprite.y < margin) {
      sprite.y = margin;
    } else if (sprite.y > height - margin) {
      sprite.y = height - margin;
    }
  }

  // 应用屏幕包裹效果（从一边出去从另一边进来）
  public wrapAroundScreen(sprite: Phaser.Physics.Arcade.Sprite): void {
    const { width, height } = this.scene.scale;
    
    if (sprite.x < -sprite.width) {
      sprite.x = width + sprite.width;
    } else if (sprite.x > width + sprite.width) {
      sprite.x = -sprite.width;
    }

    if (sprite.y < -sprite.height) {
      sprite.y = height + sprite.height;
    } else if (sprite.y > height + sprite.height) {
      sprite.y = -sprite.height;
    }
  }
}

// 输入系统：处理键盘、鼠标和触摸输入

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  shoot: boolean;
  pause: boolean;
  pointerX: number;
  pointerY: number;
  isPointerDown: boolean;
}

export class InputManager {
  private state: InputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    shoot: false,
    pause: false,
    pointerX: 0,
    pointerY: 0,
    isPointerDown: false,
  };

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupKeyboard();
    this.setupPointer();
  }

  private setupKeyboard() {
    const cursors = this.scene.input.keyboard?.createCursorKeys();
    const wasd = this.scene.input.keyboard?.addKeys('W,S,A,D,SPACE,P');

    this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.state.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.state.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
          this.state.up = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.state.down = true;
          break;
        case 'Space':
          this.state.shoot = true;
          event.preventDefault();
          break;
        case 'KeyP':
          this.state.pause = true;
          break;
      }
    });

    this.scene.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.state.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.state.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
          this.state.up = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.state.down = false;
          break;
        case 'Space':
          this.state.shoot = false;
          break;
        case 'KeyP':
          this.state.pause = false;
          break;
      }
    });
  }

  private setupPointer() {
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.state.pointerX = pointer.x;
      this.state.pointerY = pointer.y;
    });

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.state.isPointerDown = true;
      this.state.shoot = true;
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.state.isPointerDown = false;
      this.state.shoot = false;
    });
  }

  public getState(): InputState {
    return { ...this.state };
  }

  public isMovingLeft(): boolean {
    return this.state.left;
  }

  public isMovingRight(): boolean {
    return this.state.right;
  }

  public isMovingUp(): boolean {
    return this.state.up;
  }

  public isMovingDown(): boolean {
    return this.state.down;
  }

  public isShooting(): boolean {
    return this.state.shoot;
  }

  public isPausing(): boolean {
    return this.state.pause;
  }

  public getPointerPosition(): { x: number; y: number } {
    return { x: this.state.pointerX, y: this.state.pointerY };
  }

  public destroy() {
    // 清理事件监听器
    this.scene.input.keyboard?.removeAllListeners();
    this.scene.input.removeAllListeners();
  }
}

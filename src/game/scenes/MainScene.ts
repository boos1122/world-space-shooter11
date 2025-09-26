import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  create() {
    // 游戏标题文字
    this.add.text(100, 100, "🚀 Space Shooter 正式版", {
      fontSize: "24px",
      color: "#ffffff",
    });

    // 示例 Logo 图片（需要在 preload 里加载过 "logo"）
    this.add.image(200, 200, "logo");
  }
}	


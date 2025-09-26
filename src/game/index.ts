import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import MainScene from "./scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser-root",   // 👈 绑定到前端 div
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [PreloadScene, MainScene],
};

// 只有在浏览器环境才运行游戏
if (typeof window !== "undefined") {
  new Phaser.Game(config);
}

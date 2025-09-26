import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  create() {
    this.add.text(160, 200, "🚀 World Mini App - Space Shooter", {
      fontSize: "24px",
      color: "#ffffff",
    });
    this.add.image(400, 300, "logo");
  }
}

import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("logo", "/logo.png");
  }

  create() {
    this.scene.start("MainScene");
  }
}
